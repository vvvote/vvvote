<?php
/**
 * This class handles the XmlHttp-messages between the counting server and the voter
 * (storeVote and getAllVotes)
 * ErrorNo start at 7200
 */

require_once 'connectioncheck.php';  // answers if &connectioncheck is part of the URL ans exists

require_once 'exception.php';
require_once 'loadmodules.php';
require_once 'getcmd.php';

header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

if (isset($HTTP_RAW_POST_DATA)) {
	$electionIdPlace = function ($a) {
		if (! isset($a['electionId'])) WrongRequestException::throwException(7200, 'Election id missing in client request'	, $httpRawPostData);
		return      $a['electionId'];
	};
	try {
		checkCmd($HTTP_RAW_POST_DATA, 'getResult'); // throws an error if this command is not there
		$el = loadElectionModules($HTTP_RAW_POST_DATA, $electionIdPlace);
		$result = $el->tally->handleTallyReq($HTTP_RAW_POST_DATA);
	} catch (ElectionServerException $e) {
		$result = $e->makeServerAnswer();
	}
	print json_encode($result);
}

?>