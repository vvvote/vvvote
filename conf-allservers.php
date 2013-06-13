<?php
$electionId = 'wahl1';

// number of ballots the servers have to sign 0: first signing server, 1: second signing server
// last server always must be set to 1.
$numBallots = 2; 
$numSignBallots = array(0 => 1, 1 => 1);  
$numVerifyBallots = array(0 => 1, 1 => 1);
?>