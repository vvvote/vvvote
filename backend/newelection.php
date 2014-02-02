<?php

require_once 'connectioncheck.php';  // answers if &connectioncheck is part of the URL ans exists

require_once __DIR__ . '/config/conf-allservers.php';
require_once 'config/conf-thisserver.php';
require_once 'exception.php';
require_once 'modules-auth/shared-passw/auth.php';
require_once 'modules-auth/user-passw-list/auth.php';
require_once 'dbelections.php';

header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"); // this allows any cross-site scripting (needed for chrome)

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
     		isset($electionconfig['electionId']) && gettype($electionconfig['electionId']) == 'string' &&
     		isset($electionconfig['authModule']) && gettype($electionconfig['authModule']) == 'string' &&
     		isset($electionconfig['authData']) ) {
			$electionId = $electionconfig['electionId'];
		}
		else {
			WrongRequestException::throwException(2100, 'Missing election Id or authorisation module name or it is not a string or auth data ist missing', "complete request received:\n" . $electionconfigStr);
		}
		// auth
		$newconfig['electionId'] = $electionId;
		switch ($electionconfig['authModule']) {
			case 'sharedPassw':
				$sp = new SharedPasswAuth($dbInfos);
				$sp->handleNewElectionReq($electionId, $electionconfig['authData']);
				$newconfig['auth'] = 'sharedPassw';
				break;
			case 'userPasswList':
				$sp = new UserPasswAuth($dbInfos);
				$sp->handleNewElectionReq($electionId, $electionconfig['authData']);
				$newconfig['auth'] = 'userPasswList';
				break;
			default:
				break; // TODO return some error
		}
		// TODO election
		$newconfig['blinding'] = 'blindedVoter';
		
		// TODO telly
		$newconfig['telly'] = 'publishOnly';
				
		$db = new DbElections($dbInfos);
		$hash = $db->saveElectionConfig($electionId, $newconfig);
		//e.g. http://www.webhod.ra/vvvote2/backend/getelectionconfig.php?confighash=
		$configurl = "${configUrlBase}/getelectionconfig.php?confighash=${hash}";
		
		$result['cmd'] = 'saveElectionUrl';
		$result['configUrl'] = $configurl;
		// TODO sign the answer
	} catch (WrongRequestException $e) {
		$result = $e->makeServerAnswer();
	}
	
	$ret = json_encode($result);
	print($ret);
}

?>