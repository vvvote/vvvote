<?php
require_once 'Crypt/RSA.php';
require_once 'db.php';
require_once 'election.php';

require_once 'conf-allservers.php';
require_once 'conf-thisserver.php';

header("Content-type: text/plain");

// echo ":: data received via GET ::\n\n";
// print_r($_GET);

// echo "\n\n:: Data received via POST ::\n\n";
// print_r($_POST);

// echo "\n\n:: Data received as \"raw\" (text/plain encoding) ::\n\n";
if (isset($HTTP_RAW_POST_DATA)) { 
 // echo $HTTP_RAW_POST_DATA;
	$db = new Db(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PREFIX, DB_TYP);
	$el = new Election($electionId, 
			$numVerifyBallots, 
			$numSignBallots, 
			$pServerKeys, 
			$serverkey, 
			$numAllBallots,
			$thisServerName,
			$db);
	$result = $el->handlePermissionReq($HTTP_RAW_POST_DATA);
// print "\r\n";
	print "$result";
}

// echo "\n\n:: Files received ::\n\n";
// print_r($_FILES);

?>