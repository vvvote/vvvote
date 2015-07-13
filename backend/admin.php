<?php

if (PHP_SAPI !== 'cli') {
	echo '
		<head>
		<title>Administrate the voting permission server</title>
		</head>
		<body>
			<h1>Administrate the voting permission server</h1>
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
		</body>
	';
}
// TODO remove these lines before release


require_once 'Math/BigInteger.php';
require_once 'Crypt/RSA.php';
define('CRYPT_RSA_MODE', CRYPT_RSA_MODE_INTERNAL); // this is needed because otherwise openssl (if present) needs special configuration in openssl.cnf when creating a new key pair
require_once 'config/conf-allservers.php';
require_once 'config/conf-thisserver.php';



require_once 'modules-auth/user-passw-list/dbAuth.php';
require_once 'modules-election/blindedvoter/dbBlindedVoter.php';

if ((isset($_GET['createTables' ])) || (isset($_POST['createTables' ]))) {
	$dbauth = new DbAuth($dbInfos);
	$dbblindedvoter = new DbBlindedVoter($dbInfos);
	$dbpublishonlyTally = new DbPublishOnlyTally($dbInfos);
	echo  "fertig. Database tables created";
}


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


if ((isset($_GET['DeleteDatabaseContent' ])) || (isset($_POST['DeleteDatabaseContent' ]))) {
	$db = new DbBlindedVoter($dbInfos);
	$ok = $db->resetDb();
	print "<br>\n Deleted the content of the database";
}

if ((isset($_GET['createKeypair' ])) || (isset($_POST['createKeypair' ])) || (isset($argv[1]) && (strcasecmp($argv[1], 'createKeyPair') === 0)) ) {
	
	if (isset($argv[1]) && (count($argv) < 3) ) { print 'usage: php -f admin.php createKeyPair <serverIdNumber>'; exit(1); } 
	if (isset($argv[2])) {
		if (is_numeric($argv[2])) 	$thisServerName = 'PermissionServer' . $argv[2];
		else         		  		$thisServerName = $argv[2]; 
	}
	$crypt_rsa = new Crypt_RSA();
	$keypair = $crypt_rsa->createKey(512);
	
	// save private key to file
	$keystr = str_replace('\/', '/', json_encode($keypair));
	file_put_contents("config/${thisServerName}.privatekey", $keystr);

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
	file_put_contents("config/${thisServerName}.publickey", $pubkeystr);
}
// for database debugging use phpMyAdmin or the like

?>