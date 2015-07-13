<?php

/**
 * return 404 if called directly
 */


if(count(get_included_files()) < 2) {
	header('HTTP/1.0 404 Not Found');
	echo "<h1>404 Not Found</h1>";
	echo "The page that you have requested could not be found.";
	exit;
}

require_once __DIR__ . '/../Math/BigInteger.php';
require_once __DIR__ . '/../tools.php';
require_once __DIR__ . '/../rsaMyExts.php';

/*
 * The only change you need to make in this file is: adjust the urls of servers
 */
$pServerUrlBases = array('http://www.webhod.ra/vvvote2/backend', 'http://127.0.0.1/vvvote2/backend'); // without trailing slash

$configUrlBase = $pServerUrlBases[0]; 

// number of ballots the servers have to sign 0: first signing server, 1: second signing server...
// last server always must be set to 1.
//     $numBallots = 2; 
$numSignBallots   = array(0 => 3, 1 => 1);  
$numVerifyBallots = array(0 => 2, 1 => 2);
$numPSigsRequiered = count($numSignBallots); // this number of sigs from permission servers are requiered in order for a return envelope to be accepted
$numPServers = $numPSigsRequiered; // number of permission servers

$pServerKeys = array();
for ($i = 1; $i <= $numPServers; $i++) {
	$pubkeystr = file_get_contents(__DIR__ . "/PermissionServer$i.publickey");
	
	$rsa = new rsaMyExts();
	$rsa->loadKey($pubkeystr);
	$pServerKey = array(
			'name'     => "PermissionServer$i", // $pubkeyJson['kid'],
			'modulus'  => $rsa->modulus,
			'exponent' => $rsa->exponent,
	);
	$pServerKeys[] = $pServerKey;
}

$base = 16;
$numAllBallots = 5;
?>