<?php

/**
 * errorno starts at 7000
 */

/**
 * return 404 if called directly
 */
if(count(get_included_files()) < 2) {
	header('HTTP/1.0 404 Not Found');
	echo "<h1>404 Not Found</h1>";
	echo "The page that you have requested could not be found.";
	exit;
}

require_once 'Crypt/RSA.php';
require_once 'modules-db/dbMySql.php';
require_once 'dbelections.php';
require_once 'blinder.php';
require_once 'modules-election/blindedvoter/election.php';
// require_once 'modules-election/blinder-collection/election.php';
require_once 'modules-auth/user-passw-list/auth.php';
require_once 'modules-auth/shared-passw/auth.php';
require_once 'modules-auth/oauth/auth.php';
require_once 'modules-auth/external-token/auth.php';
require_once 'modules-tally/publishonly/tally.php';
require_once 'modules-tally/configurable-tally/tally.php';

require_once 'config/conf-allservers.php';
require_once 'config/conf-thisserver.php';


function loadElectionModules($httpRawPostData, $electionIdPlace) {
	// getpermission: $reqdecoded['electionId']
	global $dbInfos, $numVerifyBallots,	$numSignBallots, $pServerKeys, $serverkey, $numAllBallots, $numPSigsRequiered;
	$dbElections = new DbElections($dbInfos);
	$reqdecoded = json_decode($httpRawPostData, true);
	if ($reqdecoded == null) 						WrongRequestException::throwException(7040, 'Data in JSON format expected'         	, 'got: ' . $HTTP_RAW_POST_DATA);
	//	if (! isset($electionIdPlace($reqdecoded))) 	WrongRequestException::throwException(7010, 'Election id missing in client request'	, $httpRawPostData);
	if (! is_string($electionIdPlace($reqdecoded))) WrongRequestException::throwException(7050, 'Election id must be a string'			, 'got: ' . print_r($reqdecoded['electionId'], true));
	// load election config from database by election id
	$completeElectionId = $electionIdPlace($reqdecoded);
	$splittedElectionId = json_decode($completeElectionId);
	if ($splittedElectionId == null) $mainElectionId = $completeElectionId; // TODO this is not a good thing: trying... better generally use json encoded ElectionId
	else                             $mainElectionId = $splittedElectionId->mainElectionId;
	$elconfig = $dbElections->loadElectionConfigFromElectionId($mainElectionId);
	if (count($elconfig) < 1)					WrongRequestException::throwException(7000, 'Election id not found in server database', "ElectionId you sent: " . $reqdecoded['electionId']);

	if (! isset($elconfig['auth'])) {
		WrongRequestException::throwException(7020, 'element auth not found in election config', "ElectionId you sent: " . $reqdecoded['electionId']);
	}
	
	$auth = LoadModules::laodAuthModule($elconfig['auth']);
	if (isset($elconfig['authConfig'])) $auth->setup($elconfig["electionId"], $elconfig['authConfig']);
	// TODO think about: should Election be any Election or just the blinding module?
	$blinder = LoadModules::loadBlinder($elconfig['blinding'], $elconfig, $auth); 
	$blinder->tally = LoadModules::loadTally($elconfig['tally'], $blinder); // TODO use a different private key for tallying server
	$blinder->tally->setup($elconfig);
	
	return $blinder;
}

class LoadModules {
	static function loadTally($name, $blinder) {
		global $dbInfos, $pServerKeys, $serverkey;
		switch ($name) {
			case 'publishOnly': 		$ret = new PublishOnlyTally($dbInfos, new Crypt($pServerKeys, $serverkey), $blinder); break;
			case 'configurableTally':	$ret = new ConfigurableTally($dbInfos, new Crypt($pServerKeys, $serverkey), $blinder); break;
//			case 'tallyCollection': 	$ret = new TallyCollection();
			default: 					WrongRequestException::throwException(7060, 'tally module not supported (supported: publishOnly, configurableTally, tallyCollection)', "auth module requested: " . $name);
			break;
		}
		return $ret;
	}
	
	static function loadBlinder($name, $elconfig, $auth) {
	global $dbInfos, $numVerifyBallots,	$numSignBallots, $pServerKeys, $serverkey, $numAllBallots, $numPSigsRequiered;
		$el = new BlindedVoter($elconfig['electionId'],
				$numVerifyBallots,
				$numSignBallots,
				$pServerKeys,
				$serverkey,
				$numAllBallots,
				$numPSigsRequiered,
				$dbInfos,
				$auth);
	return $el;	
	}
	
	static function laodAuthModule($name) {
		global $dbInfos;
		switch ($name) {
			case 'userPassw': 	  $auth = new UserPasswAuth($dbInfos); break;
			case 'sharedPassw':	  $auth = new SharedPasswAuth($dbInfos); break;
			case 'oAuth2': 	      $auth = new OAuth2($dbInfos); break;
			case 'sharedAuth':    $auth = new SharedAuth($dbInfos); break;
			case 'externalToken': $auth = new ExternalTokenAuth($dbInfos); break;
			default: 			WrongRequestException::throwException(7030, 'auth module not supported (supported: userPassw, sharedPassw, oAuth2, sharedAuth)', "auth module requested: " . $elconfig['auth']);
			break;
		}
		return $auth;
	}
}