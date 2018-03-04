<?php
header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

require_once 'connectioncheck.php';  // answers if &connectioncheck is part of the URL ans exists

require_once 'exception.php';
require_once 'loadmodules.php';
require_once 'getcmd.php';
require_once 'crypt.php';
// require_once 'config/conf-allservers.php';
require_once 'loadconfig.php';

if (isset($HTTP_RAW_POST_DATA)) {
	$electionIdPlace = function ($a) {
		if (! isset($a['permission']['signed']['electionId'])) WrongRequestException::throwException(1200, 'Election id missing in client request'	, $httpRawPostData);
		return      $a['permission']['signed']['electionId'];
	};

	try {
		global $tserverkey;
		$crypt = new Crypt(array(), $tserverkey);
		$reqdata = $crypt->decryptRsaAes($HTTP_RAW_POST_DATA);
		try {
			checkCmd($reqdata, 'storeVote');
			$el = loadElectionModules($reqdata, $electionIdPlace);
			$resultplain = $el->tally->handleTallyReq(getData($reqdata));
		} catch (ElectionServerException $e) {
			$resultplain = $e->makeServerAnswer();
		}
		$result = $crypt->encryptAes(json_encode($resultplain));
	} catch (ElectionServerException $e) {
		$result = $e->makeServerAnswer();
	} catch (Exception $e) {
		try { 
			InternalServerError::throwException(98437, 'Internal server error', $e->getMessage());
		} catch (InternalServerError $e) {
			$result = $e->makeServerAnswer();
		}
	}
	print "----vvvote----\n" . json_encode($result) . "\n----vvvote----\n";
}
