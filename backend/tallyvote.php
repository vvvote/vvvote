<?php
/**
 * This class handles the XmlHttp-messages between the counting server and the voter 
 */
// TODO include some config files

require_once __DIR__ . '/modules-election/blindedvoter/election.php'; // TODO use the election from election config
require_once __DIR__ . '/modules-tally/publishonly/tally.php';

require_once 'conf-allservers.php';

// TODO remove the HOST-if in case not testing locally
if ($_SERVER['HTTP_HOST'] == 'www.webhod.ra') { require_once 'conf-thisserver.php';}
else                                          { require_once 'conf-thisserver2.php';}



if (isset($HTTP_RAW_POST_DATA)) {
	// echo $HTTP_RAW_POST_DATA;
	$tally = new PublishOnlyTelly($dbInfos, new Crypt($pServerKeys, $serverkey)); // TODO use a different private key for talliering server
	$result = $tally->handleTallyReq($HTTP_RAW_POST_DATA);
	// print "\r\n";
	print "$result";
}

?>