<?php
require_once 'Crypt/RSA.php';
require_once 'modules-db/dbMySql.php'; 
require_once 'modules-election/blindedvoter/election.php';
require_once 'modules-auth/user-passw-list/auth.php';

require_once 'conf-allservers.php';

// TODO remove this lines before release
require_once 'conf-thisserver.php';

header("Content-type: text/plain");
header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
// header("Access-Control-Allow-Origin: http://www.webhod.ra", false);
// header("Access-Control-Allow-Origin: http://www2.webhod.ra", false);

// echo ":: data received via GET ::\n\n";
// print_r($_GET);

// echo "\n\n:: Data received via POST ::\n\n";
// print_r($_POST);

// echo "\n\n:: Data received as \"raw\" (text/plain encoding) ::\n\n";
if (isset($HTTP_RAW_POST_DATA)) { 
 // echo $HTTP_RAW_POST_DATA;
	//$db = new DbMySql(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PREFIX, DB_TYP);
	$auth = new UserPasswAuth($dbInfos);
	$el = new Election($electionId, 
			$numVerifyBallots, 
			$numSignBallots, 
			$pServerKeys, 
			$serverkey, 
			$numAllBallots,
			$dbInfos,
			$auth);
	$result = $el->handlePermissionReq($HTTP_RAW_POST_DATA);
// print "\r\n";
	print "$result";
}

// echo "\n\n:: Files received ::\n\n";
// print_r($_FILES);

?>