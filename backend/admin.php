<?php

if (PHP_SAPI !== 'cli') {
	echo '
		<head>
		<title>Administrate the voting permission server</title>
		</head>
		<body>
			<h1>Administrate the voting permission server</h1>
			Use of this php file from command line only
<!---
			<form action="">
				<input type="submit" value="Create Tables" name="createTables">
				<br> 
				<input type="submit" value="Import list of voters" name="importVoterList">
				<br> 
				<input type="submit" value="Test: check credentials" name="checkCredentials">
				<br> 
				<input type="submit" value="Delete database content" name="DeleteDatabaseContent">
				<br> 
				<input type="submit" value="Create key pair" name="createKeypair">
			</form>
-->
		</body>
	';
}


require_once 'Math/BigInteger.php';
require_once 'Crypt/RSA.php';



require_once 'modules-auth/user-passw-list/dbAuth.php';
require_once 'modules-election/blindedvoter/dbBlindedVoter.php';

if ((isset($_GET['createTables' ])) || (isset($_POST['createTables' ]))) {
	$dbauth = new DbAuth($dbInfos);
	$dbblindedvoter = new DbBlindedVoter($dbInfos);
	$dbpublishonlyTally = new DbPublishOnlyTally($dbInfos);
	echo  "fertig. Database tables created";
}

/*
if ((isset($_GET['importVoterList' ])) || (isset($_POST['importVoterList' ]))) {
	$electionId = 'wahl1';
	$voterlist = array(
			0 => array('electionId' => $electionId, 'voterId' => 'pakki'  , 'secret' => 'pakki'),
			1 => array('electionId' => $electionId, 'voterId' => 'melanie', 'secret' => 'melanie')
			);
	for ($i=0; $i<50; $i++) {
		array_push($voterlist, array('electionId' => $electionId, 'voterId' => "user$i", 'secret' => "user$i"));
	}
	$db = new DbAuth($dbInfos);
	$db->importVoterListFromArray($voterlist);

}

if ((isset($_GET['checkCredentials' ])) || (isset($_POST['checkCredentials' ]))) {
	$dbauth = new DbAuth($dbInfos);
	$ok = $dbauth->checkCredentials('wahl1', 'pakki', 'pakki');
  	print "<br>\n ok? ";
  	print_r($ok);
}

*/

if ( /* (isset($_GET['DeleteDatabaseContent' ])) || ( isset($_POST['DeleteDatabaseContent' ])) || */ (PHP_SAPI === 'cli' && isset($argv[1]) &&  $argv[1] === 'DeleteDatabaseContent')) {
	require_once 'config/conf-allservers.php';
	require_once 'config/conf-thisserver.php'; // TODO this is required for database access but if the server's key is not generated cause an error
	require_once 'dbelections.php';
	$db = new DbBlindedVoter($dbInfos);
	$ok = $db->resetDb();
	$db = new DbElections($dbInfos);
	$ok = $db->resetDb();
	print "<br>\n Deleted the content of the database";
}

if ( /*(isset($_GET['createKeypair' ])) || (isset($_POST['createKeypair' ]))  || */ (isset($argv[1]) && (strcasecmp($argv[1], 'createKeyPair') === 0)) ) {
	define('CRYPT_RSA_MODE', CRYPT_RSA_MODE_INTERNAL); // this is needed because otherwise openssl (if present) needs special configuration in openssl.cnf when creating a new key pair
	$DO_NOT_LOAD_PUB_KEYS = true; // interpreted from conf-allservers.php
	require_once 'config/conf-allservers.php';
	
	if (isset($argv[1]) && (count($argv) < 4) ) {
		print 'usage: php -f admin.php createKeyPair <p|t> <serverIdNumber>' . "\np: for permission server\nt: for tallying server"; exit(1);
	}
	if (isset($argv[2])) {
		switch ($argv[2]) {
			case 'p': case 'P': $type = 'PermissionServer'; $bitlength =  2048; break; // only 512 because blinding in JavaScript will take more than 5 minutes for 2048
			case 't': case 'T': $type = 'TallyServer';      $bitlength = 2048; break;
			default:
				print "Error: Argument 2 must be either 'p' or 't'";
				exit(1);
		}
	}
	if (isset($argv[3])) {
		if (is_numeric($argv[3])) 	$thisServerName = $type . $argv[3];
		else         		  		$thisServerName = $argv[3];
	}
	$crypt_rsa = new Crypt_RSA();
	$keypair = $crypt_rsa->createKey($bitlength);

	// save private key to file
	$keystr = str_replace('\/', '/', json_encode($keypair));
	file_put_contents("config/${thisServerName}.privatekey.pem.php", "<?php\r\n/* \r\n" . $keypair['privatekey'] . "\r\n*/\r\n?>");

	// save public key to file
	$crypt_rsa->loadKey($keypair['publickey']);
	$pubkey = array( // fields defined by JSON Web Key http://openid.net/specs/draft-jones-json-web-key-03.html
			'alg'   => 'RSA', // only RSA is supported by vvvote
			'mod'   => base64url_encode($crypt_rsa->modulus->toBytes()),
			'exp'   => base64url_encode($crypt_rsa->exponent->toBytes())
	);
	// 'kid' 	=> $thisServerName);
	//print_r($crypt_rsa->modulus);
	echo '<br>n: ' . base64url_encode($crypt_rsa->modulus->toBytes());
	echo '<br>k: ' . $crypt_rsa->k;
	// print_r($crypt_rsa->k);
	echo '<br>exp: ' . base64url_encode($crypt_rsa->exponent->toBytes());
	//print_r($crypt_rsa->exponent);
	echo "<br>\r\n";
	$pubkeystr = str_replace('\/', '/', json_encode($pubkey));
	file_put_contents("config/${thisServerName}.publickey", $keypair['publickey']); //$pubkeystr
}
// for database debugging use phpMyAdmin or the like

?>