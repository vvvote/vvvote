<?php

/*
    VVVote: An Anonymity and Traceability Providing Online Voting System
    Copyright (C) 2016 Robert Arnold, prog@robert-arnold.de

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */



require_once 'connectioncheck.php';  // answers if &connectioncheck is part of the URL and exists

require_once __DIR__ . '/config/conf-allservers.php';
require_once 'config/conf-thisserver.php';
require_once 'exception.php';
require_once 'modules-auth/shared-passw/auth.php';
require_once 'modules-auth/user-passw-list/auth.php';
require_once 'modules-auth/oauth/auth.php';
require_once 'modules-auth/shared-auth/auth.php';
require_once 'modules-auth/external-token/auth.php';
require_once 'dbelections.php';
require_once 'modules-election/blindedvoter/election.php';
require_once 'modules-tally/publishonly/tally.php';
require_once 'modules-tally/configurable-tally/tally.php';
//require_once 'modules-tally/tally-collection/tally.php';



header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept'); // this allows any cross-site scripting (needed for chrome)
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
//header('Access-Control-Allow-Methods:', 'PUT, GET, POST, DELETE, OPTIONS'); // - See more at: http://www.wilsolutions.com.br/content/fix-request-header-field-content-type-not-allowed-access-control-allow-headers#sthash.TdDHtHfX.dpuf
/**
 * error starts at 2100
 */


if (isset($HTTP_RAW_POST_DATA)) {
	$electionconfigStr = $HTTP_RAW_POST_DATA;
	}

if (isset ($electionconfigStr)) {
	$newconfig = array();
	try {
		$electionconfig = json_decode($electionconfigStr, true);
		// TODO verify auth
		if (isset($electionconfig) && 
     		isset($electionconfig['electionId']) && is_string($electionconfig['electionId']) &&
     		isset($electionconfig['auth']) && is_string($electionconfig['auth'])  &&
     		isset($electionconfig['authData']) ) {
			$electionId = $electionconfig['electionId'];
		}
		else {
			WrongRequestException::throwException(2100, 'Missing election Id or authorisation module name or it is not a string or auth data ist missing', "complete request received:\n" . $electionconfigStr);
		}
		
		$db = new DbElections($dbInfos);
		$alreadyGiven = $db->loadElectionConfigFromElectionId($electionId);
		if (count($alreadyGiven) > 0) WrongRequestException::throwException(2120, 'This election id is already used', $electionId);
		
		// create public election config and secret election config
		$newconfig['electionId'] = $electionId;
		if (isset($electionconfig['electionTitle'])) $newconfig["electionTitle"] = $electionconfig['electionTitle'];
		else  										 $newconfig["electionTitle"] = $electionId;
//		$authm = LoadModules::laodAuthModule($electionconfig['auth']);
		global $dbInfos;
		$authm = new SharedAuth($dbInfos);
		$authTmp = $authm->handleNewElectionReq($electionId, $electionconfig);
		$newconfig['authConfig'] = $authTmp['authConfig']; 
		$newconfig["auth"] = $authTmp['auth'];
		
		// blinder
		$newconfig['blinding'] = 'blindedVoter';
		global $numVerifyBallots, $numSignBallots, $pServerKeys, $pserverkey, $numAllBallots, $numPSigsRequiered;
		$blinder = new BlindedVoter($electionId, $numVerifyBallots, $electionconfig['questions'], $numSignBallots, $pServerKeys, $pserverkey, $numAllBallots, $numPSigsRequiered, $dbInfos, $authm);
		
		// tally
		$tallym = LoadModules::loadTally($electionconfig['tally'], $blinder);
		
		$newconfig['tally'] = constant(get_class($tallym) . '::name');
//		$newconfig['tallyData'] = $tallym->handleNewElectionReq($electionId, $authm, $blinder, $electionconfig['tallyData']);
		
		// $this->subTally->handleNewElectionReq($req['subTallyData']);
		if ( (! isset($electionconfig["questions"])) || (! is_array($electionconfig["questions"]))) WrongRequestException::throwException(2146, 'Request must contain an array of questions', print_r($electionconfig, true));
		foreach ($electionconfig['questions'] as $i => $question) {
			$completeElectionId = json_encode(array ('mainElectionId' => $electionId,  'subElectionId' => $question['questionID']));
			
//			$subAuthConf = $authm->newSubElection($completeElectionId);
			
			$subBlinderConf = $blinder->handleNewElectionReq($completeElectionId, (isset($question['blinderData'])?$question['blinderData']:array()));
			$subTallyConf = $tallym->handleNewElectionReq($completeElectionId, $authm, $blinder, $question);
			$ret[$i] = array( // TODO take the names of the modules from config / use a new function getModuleName()
					'questionID'  		=> $question['questionID'],
					'questionWording' 	=> $question['questionWording'],
					'blinderData' 		=> $subBlinderConf,
					'tallyData'   		=> $subTallyConf);
		if (isset($question['options'])) $ret[$i]['options'] = $question['options'];
		$electionconfig['questions'][$i]['blinderData'] = $subBlinderConf;
		}
		
		$newconfig['questions']  = $ret;
			
		// create new config on the next server
		if ($serverNo < count($pServerUrlBases) ) {
			$url = $pServerUrlBases[$serverNo] . NEW_ELECTION_URL_PART; // first server has no. 1 --> [$serverNo] means the next server
			$tmp = parse_url($url);
			$certfile = false;
			if ($tmp['scheme'] === 'https') {
				$host = $tmp['host'];
				$certfile = realpath(dirname(__FILE__) . '/config/permissionservercerts/' . $host . '.pem');
			}
			
			$configWithAllKeys = httpPost($url, $electionconfig, $certfile, true);
			if (! isset($configWithAllKeys['questions'])) InternalServerError::throwException(8734634, 'Error creating a new election: a permission server returned a config without questions. Server URL delivering wrong config: ' . $url, ''); 
			if (! is_array($configWithAllKeys['questions'])) InternalServerError::throwException(8734635, 'Error creating a new election: a permission server returned a config withot questions not as array. Server URL delivering wrong config: ' . $url, ''); 
			foreach ($configWithAllKeys['questions'] as $qNo => $question ) {
				foreach ($pServerKeys as $pNum => $publickey) {
					if ($pNum < $serverNo) { // verify if the keys from the new-election request are unmodified
						if (!    isset($question['blinderData'])) InternalServerError::throwException(8734636, 'Error creating a new election: a permission server returned a config without blinderData. Server URL delivering wrong config: ' . $url, ''); 
						if (! is_array($question['blinderData'])) InternalServerError::throwException(8734637, 'Error creating a new election: a permission server returned a config with blinderData not as array. Server URL delivering wrong config: ' . $url, ''); 
						if (!    isset($question['blinderData']['permissionServerKeys'])) InternalServerError::throwException(8734646, 'Error creating a new election: a permission server returned a config without permissionServerKeys. Server URL delivering wrong config: ' . $url, ''); 
						if (! is_array($question['blinderData']['permissionServerKeys'])) InternalServerError::throwException(8734647, 'Error creating a new election: a permission server returned a config with permissionServerKeys not as array. Server URL delivering wrong config: ' . $url, ''); 
						if (!    isset($question['blinderData']['permissionServerKeys'][$publickey['name']]) ) InternalServerError::throwException(8734638, 'Error creating a new election: a permission server returned a config without blinderData for previous permission servers. Server URL delivering wrong config: ' . $url, ''); 
						if (! is_array($question['blinderData']['permissionServerKeys'][$publickey['name']]) ) InternalServerError::throwException(8734639, 'Error creating a new election: a permission server returned a config with blinderData for previous permission servers not as array. Server URL delivering wrong config: ' . $url, ''); 
						if (           $question['blinderData']['permissionServerKeys'][$publickey['name']] !== $newconfig['questions'][$qNo]['blinderData']['permissionServerKeys'][$publickey['name']])
							InternalServerError::throwException(8734656, 'Error creating a new election: a permission server changed the keys of an other permission server on quesion no. ' . $qNo, 'expected: ' . print_r($newconfig['questions'][$qNo]['blinderData'][$publickey['name']], true) . ',\r\n received: ' . $question['blinderData'][$publickey['name']]);
					} else { // verify if the newly obtained keys are signed correctly
						$completeElectionId = json_encode(array ('mainElectionId' => $electionId,  'subElectionId' => $question['questionID']));
						$ok = $blinder->verifyPermissionServerKey($publickey['name'], $question['blinderData']['permissionServerKeys'][$publickey['name']], $completeElectionId);
						if ($ok !== true) InternalServerError::throwException(8734657, 'Error creating a new election: a permission server delivered not valid keys on quesion no. ' . $qNo, 'expected: ' . print_r($newconfig['questions'][$qNo]['blinderData'][$publickey['name']], true) . ',\r\n received: ' . $question['blinderData'][$publickey['name']]);
					}
				}
				$newconfig['questions'][$qNo]['blinderData'] = $question['blinderData'];
			}
		}

		$hash = $db->saveElectionConfig($electionId, $newconfig);
		//e.g. http://www.webhod.ra/vvvote2/backend/getelectionconfig.php?confighash=
		$configurl = "${configUrlBase}/getelectionconfig.php?confighash=${hash}";
		
		if ($serverNo === 1) { 
			// the request came from external --> deliver a link to the config
			$result['cmd'] = 'saveElectionUrl';
			$result['configUrl'] = $configurl;
		} else {
			// the request came from another vvvote server --> deliver the config, because of the generated keys directly
			$result = $newconfig;
		}
		// TODO sign the answer
	} catch (ElectionServerException $e) {
		// TODO: think about: the auth module is saving data in db which stays there and blocks another try in case the same electionId is used again - implement a reverseNewElection() oder reversTransaction in each module
		$result = $e->makeServerAnswer();
	}
	
	$ret = json_encode($result);
	print($ret);
}

?>