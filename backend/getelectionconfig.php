<?php
// http://server.vvvote.org/backend/getelectionconfig?server=server2.vvvote.org&confighash=XXXXXXXX&sig=YYYYYYYYYyy&sig=zzzzzzzzzz
// http://www.webhod.ra/vvvote2/backend/getelectionconfig.php?confighash=aaaaaaa

/**
 * errorno starts at 4000
 */

require_once 'config/conf-allservers.php';
require_once 'config/conf-thisserver.php';
require_once 'exception.php';
require_once 'dbelections.php';

header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"); // this allows any cross-site scripting (needed for chrome)

if (isset($HTTP_RAW_POST_DATA)) {
	// $hash =
}
if (isset($_GET) && isset($_GET['confighash'])) {
	$hash = $_GET['confighash'];
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
	} catch (WrongRequestException $e) {
		$result = $e->makeServerAnswer();
	}
	/*
	 $result = array(
	 		'electionId' => $electionId,
	 		'auth'       => 'userPassw',
	 		'blinding'   => 'blindedVoter',
	 		'ballot'     => array('opt1' => 'Europäische Zentralbank soll künftig direkt Kredit an Staaten geben', 'opt2' => 'Europäische Zentralbank soll weiterhin keine Kredite an Staaten geben dürfen'),
	 		'telly'      => 'publishOnly'
	 );
	*/
	// TODO sign the config
	$ret = json_encode($result);
	print($ret);
}
?>