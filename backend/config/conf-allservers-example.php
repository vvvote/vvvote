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
 * include 'backend' here without trailing slash
 */
$pServerUrlBases = array('http://demo.vvvote.de/backend', 'http://demo2.vvvote.de/backend'); // without trailing slash

$tServerStoreVotePort = '80'; //do not use https here to enable the anonymizer-server to strip the browser-fingerprint - this is not necessary if all voters would use the tor browser bundle


// construct tServerUrl for the webclient use 
// do not use https here to enable the anonymizer-server to strip the browser-fingerprint - this is not necessary if all voters would use the tor browser bundle
$urltmp = parse_url($pServerUrlBases[0]);
$tServerStoreVoteUrls = array('http://' . $urltmp['host'] . ':' . $tServerStoreVotePort . $urltmp['path'] . '/storevote.php');


// number of ballots the servers have to sign 0: first signing server, 1: second signing server...
// last server always must be set to 1.
//     $numBallots = 2; 
$numSignBallots   = array(0 => 1, 1 => 1);  
$numVerifyBallots = array(0 => 0, 1 => 0);
$numPSigsRequiered = count($numSignBallots); // this number of sigs from permission servers are requiered in order for a return envelope to be accepted
$numPServers = $numPSigsRequiered; // number of permission servers
$numTServers = 1;

if (! isset($DO_NOT_LOAD_PUB_KEYS)) { // this will be set during key generation
	define('CRYPT_RSA_MODE', CRYPT_RSA_MODE_INTERNAL); // this is needed for RSA Key generation (in newelection-->election.php because otherwise openssl (if present) needs special configuration in openssl.cnf when creating a new key pair)
	function loadkeys($filenameprefix, $num) {
		$serverKeys = array();
		for ($i = 1; $i <= $num; $i++) {
			$pubkeystr = file_get_contents(__DIR__ . "/$filenameprefix$i.publickey");

			$rsa = new rsaMyExts();
			$rsa->loadKey($pubkeystr);
			$pServerKey = array(
					'name'     => $filenameprefix . $i, // $pubkeyJson['kid'],
					'modulus'  => $rsa->modulus,
					'exponent' => $rsa->exponent,
			);
			$serverKeys[] = $pServerKey;
		}
		return $serverKeys;
	}

	$pServerKeys = loadkeys('PermissionServer', $numPServers);
	$tServerKeys = loadkeys('TallyServer', $numTServers);
}

$base = 16;
$numAllBallots = 5;
$bitlengthElectionKeys = 512;

const NEW_ELECTION_URL_PART = '/newelection.php';

?>