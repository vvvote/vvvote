<?php
// http://server.vvvote.org/backend/getelectionconfig?server=server2.vvvote.org&confighash=XXXXXXXX&sig=YYYYYYYYYyy&sig=zzzzzzzzzz
// http://www.webhod.ra/vvvote2/backend/getelectionconfig.php?confighash=aaaaaaa

 require_once __DIR__ . '/config/conf-allservers.php';
require_once 'config/conf-thisserver.php';

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
	// TODO get config from database by hash
	$result = array(
			'electionId' => $electionId,
			'auth'       => 'userPassw',
			'blinding'   => 'blindedVoter',
			'ballot'     => array('opt1' => 'Melanie', 'opt2' => 'Pakki'),
			'telly'      => 'publishOnly'
	);
	$ret = json_encode($result);
	print_r($ret);
}
?>