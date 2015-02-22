<?php


require_once 'connectioncheck.php';  // answers if &connectioncheck is part of the URL and exists

require_once __DIR__ . '/config/conf-allservers.php';
require_once 'config/conf-thisserver.php';
require_once 'exception.php';
require_once 'modules-auth/shared-passw/auth.php';
require_once 'modules-auth/user-passw-list/auth.php';
require_once 'modules-auth/oauth/auth.php';
require_once 'modules-auth/shared-auth/auth.php';
require_once 'dbelections.php';
require_once 'modules-election/blindedvoter/election.php';
require_once 'modules-tally/publishonly/tally.php';
require_once 'modules-tally/configurable-tally/tally.php';
require_once 'modules-tally/tally-collection/tally.php';



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
		
//		$authm = LoadModules::laodAuthModule($electionconfig['auth']);
		global $dbInfos;
		$authm = new SharedAuth($dbInfos);
		$authTmp = $authm->handleNewElectionReq($electionId, $electionconfig);
		$newconfig['authConfig'] = $authTmp['authConfig']; 
		$newconfig["auth"] = $authTmp['auth'];
		
		// blinder
		$newconfig['blinding'] = 'blindedVoter';
		global $numVerifyBallots, $numSignBallots, $pServerKeys, $serverkey, $numAllBallots, $numPSigsRequiered;
		$blinder = new BlindedVoter($electionId, $numVerifyBallots, $numSignBallots, $pServerKeys, $serverkey, $numAllBallots, $numPSigsRequiered, $dbInfos, $authm);
		
		// tally
		$tallym = LoadModules::loadTally($electionconfig['tally'], $blinder);
		
		$newconfig['tally'] = constant(get_class($tallym) . '::name');
//		$newconfig['tallyData'] = $tallym->handleNewElectionReq($electionId, $authm, $blinder, $electionconfig['tallyData']);
		
		// $this->subTally->handleNewElectionReq($req['subTallyData']);
		if ( (! isset($electionconfig["questions"])) || (! is_array($electionconfig["questions"]))) WrongRequestException::throwException(2146, 'Request must contain an array of questions', print_r($electionconfig, true));
		foreach ($electionconfig['questions'] as $i => $question) {
			$completeElectionId = json_encode(array ('mainElectionId' => $electionId,  'subElectionId' => $question['questionID']));
			
//			$subAuthConf = $authm->newSubElection($completeElectionId);
			
			$subBlinderConf = $blinder->handleNewElectionReq($completeElectionId);
			$subTallyConf = $tallym->handleNewElectionReq($completeElectionId, $authm, $blinder, $question);
			$ret[$i] = array( // TODO take the names of the modules from config / use a new function getModuleName()
					'questionID'  => $question['questionID'],
					'questionWording' => $question['questionID'],
					'options'         => $question['options'],
					'blinderData' => $subBlinderConf,
					'tallyData'   => $subTallyConf);
		}
		$newconfig['questions']  = $ret;
		
		$hash = $db->saveElectionConfig($electionId, $newconfig);
		//e.g. http://www.webhod.ra/vvvote2/backend/getelectionconfig.php?confighash=
		$configurl = "${configUrlBase}/getelectionconfig.php?confighash=${hash}";
		
		$result['cmd'] = 'saveElectionUrl';
		$result['configUrl'] = $configurl;
		// TODO sign the answer
	} catch (ElectionServerException $e) {
		// TODO: think about: the auth module is saving data in db which stays there and blocks another try in case the same electionId is used again - implement a reverseNewElection() oder reversTransaction in each module
		$result = $e->makeServerAnswer();
	}
	
	$ret = json_encode($result);
	print($ret);
}

?>