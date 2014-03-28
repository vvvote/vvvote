<?php
header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once 'connectioncheck.php';  // answers if &connectioncheck is part of the URL ans exists

require_once 'exception.php';
require_once 'loadmodules.php';
require_once 'getcmd.php';


if (isset($HTTP_RAW_POST_DATA)) {
	$electionIdPlace = function ($a) {
		if (! isset($a['permission']['signed']['electionId'])) WrongRequestException::throwException(1200, 'Election id missing in client request'	, $httpRawPostData);
		return      $a['permission']['signed']['electionId'];
	};

	try {
		checkCmd($HTTP_RAW_POST_DATA, 'storeVote');
		$el = loadElectionModules($HTTP_RAW_POST_DATA, $electionIdPlace);
		$result = $el->tally->handleTallyReq($HTTP_RAW_POST_DATA);
	} catch (ElectionServerException $e) {
		$result = $e->makeServerAnswer();
	}
	print "----vvvote----\n" . json_encode($result) . "\n----vvvote----\n";
}
