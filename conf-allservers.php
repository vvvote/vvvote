<?php
$electionId = 'wahl1';

// number of ballots the servers have to sign 0: first signing server, 1: second signing server
// last server always must be set to 1.
$numBallots = 2; 
$numSignBallots   = array(0 => 1, 1 => 1);  
$numVerifyBallots = array(0 => 1, 1 => 1);

$pServerKey1 = array(
		'modulus' => '1',
		'exp'     => '2'
);

$pServerKey2 = array(
		'modulus' => '1',
		'exp'     => '2'
);

$pServerKeys = array(
		1 => $pServerKey1,
		2 => $pServerKey2
);

$base = 16;
?>