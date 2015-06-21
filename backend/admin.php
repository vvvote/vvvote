<?php
// TODO remove these lines before release

$cliCmd = $argv[1];
$options = getopt('c:f:');
var_dump($options);



require_once 'Math/BigInteger.php';
require_once 'Crypt/RSA.php';
define('CRYPT_RSA_MODE', CRYPT_RSA_MODE_INTERNAL); // this is needed because otherwise openssl (if present) needs special configuration in openssl.cnf when creating a new key pair

if ( (PHP_SAPI === 'cli') && isset($argv) && isset($argv[1]) ) $cliCmd = $argv[1];
else {  // called from web browser
	$cliCmd = '';
	echo '
			<head>
			<title>Administrate the voting permission server</title>
			</head>
			<body>
			<h1>Administrate the voting permission server</h1>
			
			<form action="">
			<input type="submit" value="Create Tables" name="createTables"> <br> 
			<input type="submit" value="Import list of voters" name="importVoterList"> <br>
			<input type="submit" value="Test: check credentials" name="checkCredentials"> <br> 
			<input type="submit" value="Delete database content" name="DeleteDatabaseContent"> <br> 
			<input type="submit" value="Create key pair" name="createKeypair">
			</form>

			</body>
			';
}


if ((isset($_GET['createTables' ])) || (isset($_POST['createTables' ]))) {
	require_once 'config/conf-allservers.php';
	require_once 'config/conf-thisserver.php';
	$dbauth = new DbAuth($dbInfos);
	$dbblindedvoter = new DbBlindedVoter($dbInfos);
	$dbpublishonlyTally = new DbPublishOnlyTally($dbInfos);
	echo  "fertig. Database tables created";
}


if ((isset($_GET['importVoterList' ])) || (isset($_POST['importVoterList' ]))) {
	require_once 'modules-auth/user-passw-list/dbAuth.php';
	require_once 'modules-election/blindedvoter/dbBlindedVoter.php';
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

// if ((isset($_GET['createKeypair' ])) || (isset($_POST['createKeypair' ])) || (strcasecmp($cliCmd, 'createKeypair') === 0) )  {
	$crypt_rsa = new Crypt_RSA();
	$keypair = $crypt_rsa->createKey(20);
	$crypt_rsa->loadKey($keypair['publickey']);
	// $crypt_rsa->loadKey($serverkey['publickey']);

	$keypairStr = str_replace('\/', '/', json_encode($keypair));
//	if (strcasecmp($cliCmd, 'createKeypair') === 0) {
		$opts = getopt('f:');
		$filename = $opts['f'];
		file_put_contents($filename, $keypairStr);
		echo 'done.';
//	} else {
		echo '<br>n: ' . $crypt_rsa->modulus->toString();

		//print_r($crypt_rsa->modulus);
		echo '<br>k: ' . $crypt_rsa->k;
		// print_r($crypt_rsa->k);
		echo '<br>exp: ' . $crypt_rsa->exponent->toString();
		//print_r($crypt_rsa->exponent);
		echo "<br>\r\n";
		print($keypairStr);
//	}
//}
// for database debugging use phpMyAdmin or the like

?>