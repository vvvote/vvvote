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
		
		// auth
		$newconfig['electionId'] = $electionId;
		switch ($electionconfig['auth']) {
			case 'sharedPassw':
				$authm = new SharedPasswAuth($dbInfos);
				$newconfig['auth'] = 'sharedPassw';
				break;
			case 'userPasswList':
				$authm = new UserPasswAuth($dbInfos);
				$newconfig['auth'] = 'userPasswList';
				break;
			case 'oAuth2':
				$authm = new OAuth2($dbInfos);
				$newconfig['auth'] = 'oAuth2';
				break;
			case 'sharedAuth':
				$authm = new SharedAuth($dbInfos);
				$newconfig['auth'] = 'sharedAuth';
				break;
			default:
				WrongRequestException::throwException(2110, 'Authorisation module not supported by this server', "you requested: " . $electionconfig['authModule']);
				break; 
		}
		$newconfig['authConfig'] = $authm->handleNewElectionReq($electionId, $electionconfig['authData']);
		
		// TODO election
		$newconfig['blinding'] = 'blindedVoter';
		global $dbInfos, $numVerifyBallots,	$numSignBallots, $pServerKeys, $serverkey, $numAllBallots, $numPSigsRequiered;
		$blinder = new BlindedVoter($electionId, $numVerifyBallots, $numSignBallots, $pServerKeys, $serverkey, $numAllBallots, $numPSigsRequiered, $dbInfos, $authm);
		
		// TODO tally
		switch ($electionconfig['tally']) {
			case 'publishOnly':
				$tallym = new PublishOnlyTally($dbInfo, $crypt, $election_);
				$newconfig['tally'] = 'publishOnlyTally';
				break;
			case 'configurableTally':
				$tallym = new ConfigurableTally($dbInfo, $crypt, $election_);
				$newconfig['tally'] = 'configurableTally';
				break;
			case 'tallyCollection':
				$tallym = new TallyCollection($dbInfo);
				$newconfig['tally'] = 'tallyCollection';
				break;
			default:
				WrongRequestException::throwException(2120, 'Tally module not supported by this server', "you requested: " . $electionconfig['tallyModule']);
				break;
		}
		$newconfig['tallyData'] = $tallym->handleNewElectionReq($electionId, $authm, $blinder, $electionconfig['tallyData']);
		
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