<?php
$electionId = 'wahl1';

// number of ballots the servers have to sign 0: first signing server, 1: second signing server...
// last server always must be set to 1.
//     $numBallots = 2; 
$numSignBallots   = array(0 => 3, 1 => 1);  
$numVerifyBallots = array(0 => 3, 1 => 1);

$pServerKey1 = array(
		'name'     => 'PermissionServer1',
		'modulus'  => new Math_BigInteger('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10),
		'exponent' => new Math_BigInteger('65537', 10)
);

$pServerKey2 = array(
		'name'     => 'PermissionServer2',
		'modulus'  => new Math_BigInteger('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10),
		'exponent' => new Math_BigInteger('65537', 10)
);

$pServerKeys = array(
		0 => $pServerKey1,
		1 => $pServerKey2
);

$base = 16;
$numAllBallots = 5;
?>