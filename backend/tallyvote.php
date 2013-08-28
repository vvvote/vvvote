<?php
/**
 * This class handles the XmlHttp-messages between the counting server and the voter 
 */
// TODO include some config files

require_once __DIR__ . '/modules-election/blindedvoter/election.php'; // TODO use the election from election config
require_once __DIR__ . '/modules-tally/publishonly/tally.php';
require_once 'modules-auth/user-passw-list/auth.php';

require_once 'config/conf-allservers.php';
require_once 'config/conf-thisserver.php';

header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

if (isset($HTTP_RAW_POST_DATA)) {
	$auth = new UserPasswAuth($dbInfos);
	$el = new Election($electionId, 
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