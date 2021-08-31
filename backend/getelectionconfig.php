<?php
// http://server.vvvote.org/backend/getelectionconfig?server=server2.vvvote.org&confighash=XXXXXXXX&sig=YYYYYYYYYyy&sig=zzzzzzzzzz
// http://www.webhod.ra/vvvote2/backend/getelectionconfig.php?confighash=aaaaaaa

/**
 * errorno starts at 4000
 */

chdir(__DIR__); require_once './connectioncheck.php';  // answers if &connectioncheck is part of the URL ans exists

chdir(__DIR__); require_once './tools/loadconfig.php';
// require_once 'config/conf-thisserver.php';
chdir(__DIR__); require_once './tools/exception.php';
chdir(__DIR__); require_once './tools/dbelections.php';

header('Access-Control-Allow-Origin: *', true); // this allows any cross-site scripting
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"); // this allows any cross-site scripting (needed for chrome)
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if (isset($HTTP_RAW_POST_DATA)) {
	// $hash =
}
if (isset($_GET) && isset($_GET['confighash']) ) {
	$hash = $_GET['confighash'];
	if (! isset($_GET['api'])) {
		$token = '';
		if (isset($_GET['token'])) $token = '&token=' . $_GET['token'];
		$showResult = '';
		if (isset($_GET['showresult'])) $showResult = '&showresult';
		$insert = '';
//		if ( ($webclientUrlbase[0] !== '/') && (strpos($webclientUrlbase, '://') === false) )
//				$insert = '../';
		header('Location: ' . /*$insert .*/ $webclientUrlbase . '?confighash=' . $hash . $token . $showResult, true, 307);
		die();
	}
}

if (isset ($hash)) {
	// TODO verify sigs
	try {
		$db = new DbElections($dbInfos);
		$result = $db->loadElectionConfigFromHash($hash);
		if (count($result) == 0) {
			$result = WrongRequestException::throwException(4000, 'Election not found', $hash);
		}
		$result['cmd'] = 'loadElectionConfig';
	} catch (ElectionServerException $e) {
		$result = $e->makeServerAnswer();
	}
	
	// TODO sign the config
	$ret = json_encode($result);
	print($ret);
}
?>