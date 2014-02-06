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

$configUrlBase = 'http://www.webhod.ra/vvvote2/backend'; // without trailing slash

// number of ballots the servers have to sign 0: first signing server, 1: second signing server...
// last server always must be set to 1.
//     $numBallots = 2; 
$numSignBallots   = array(0 => 3, 1 => 1);  
$numVerifyBallots = array(0 => 3, 1 => 2);
$numPSigsRequiered = 2;

$pServerKey0 = array(
		'name'     => 'PermissionServer1',
		'modulus'  => new Math_BigInteger('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10),
		'exponent' => new Math_BigInteger('65537', 10)
);

$pServerKey1 = array(
		'name'     => 'PermissionServer2',
		'modulus'  => new Math_BigInteger('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10),
		'exponent' => new Math_BigInteger('65537', 10)
);

$pServerKeys = array(
		0 => $pServerKey0,
		1 => $pServerKey1
);


$base = 16;
$numAllBallots = 5;
?>