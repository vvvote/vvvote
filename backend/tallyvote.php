<?php
/**
 * This class handles the XmlHttp-messages between the counting server and the voter 
 */

require_once 'dbelections.php';
require_once __DIR__ . '/modules-election/blindedvoter/election.php'; // TODO use the election from election config
require_once __DIR__ . '/modules-tally/publishonly/tally.php';
require_once 'modules-auth/user-passw-list/auth.php';
require_once 'modules-auth/shared-passw/auth.php';



require_once 'config/conf-allservers.php';
require_once 'config/conf-thisserver.php';

header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

if (isset($HTTP_RAW_POST_DATA)) {
	// TODO avoid decoding the request twice
	// move the instanciations to a common place
	$dbElections = new DbElections($dbInfos);
	$reqdecoded = json_decode($HTTP_RAW_POST_DATA, true); // TODO error handling
	switch ($reqdecoded['cmd']) {
		case 'getAllVotes': $electionId = $reqdecoded['electionId']; break;
		case 'storeVote':   $electionId = $reqdecoded['permission']['signed']['electionId']; break;
		default: // TODO throw an error
			break;
	}
	$elconfig = $dbElections->loadElectionConfigFromElectionId($electionId); // TODO error handling
	
	// TODO test if isset($elconfig['auth'])
	switch ($elconfig['auth']) {
		case 'userPassw':   $auth = new UserPasswAuth($dbInfos); break;
		case 'sharedPassw': $auth = new SharedPasswAuth($dbInfos); break;
		default: /* TODO return an error */ break;
	}
	
	$el = new Election($elconfig['electionId'], 
			$numVerifyBallots, 
			$numSignBallots, 
			$pServerKeys, 
			$serverkey, 
			$numAllBallots,
			$numPSigsRequiered,
			$dbInfos,
			$auth);
	// echo $HTTP_RAW_POST_DATA;
	$tally = new PublishOnlyTelly($dbInfos, new Crypt($pServerKeys, $serverkey), $el); // TODO use a different private key for tallying server
	$result = $tally->handleTallyReq($HTTP_RAW_POST_DATA);
	// print "\r\n";
	print "$result";
}

?>