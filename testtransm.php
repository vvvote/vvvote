<?php
require_once 'Crypt/RSA.php';
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

	$el = new election($electionId, 
			$numVerifyBallots, 
			$numSignBallots, 
			$pServerKeys, 
			$serverkey, 
			$numAllBallots,
			$thisServerNum);
	$result = $el->handlePermissionReq($HTTP_RAW_POST_DATA);
// print "\r\n";
	print "$result";
}

// echo "\n\n:: Files received ::\n\n";
// print_r($_FILES);

?>