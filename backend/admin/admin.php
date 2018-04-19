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

$workingDir = getcwd();

chdir(__DIR__); require_once './../Math/BigInteger.php';
chdir(__DIR__); require_once './../Crypt/RSA.php';
chdir(__DIR__); require_once './../tools/rsaMyExts.php';

chdir(__DIR__); require_once '../modules-auth/user-passw-list/dbAuth.php';
chdir(__DIR__); require_once '../modules-election/blindedvoter/dbBlindedVoter.php';

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

if (count($argv) == 1) {
	echo 'Administrate / Setup vvvote. 
php -f admin.php <command>
Supported commands: createKeyPair
call php -f admin.php <command> in order to get help for the command.';
}

if ( /* (isset($_GET['DeleteDatabaseContent' ])) || ( isset($_POST['DeleteDatabaseContent' ])) || */ (PHP_SAPI === 'cli' && isset($argv[1]) &&  $argv[1] === 'DeleteDatabaseContent')) {
	$DO_NOT_LOAD_PUB_KEYS = true; // interpreted from loadconfig.php
	chdir(__DIR__); require_once '../tools/loadconfig.php';
//	require_once '../config/conf-thisserver.php'; // TODO this is required for database access but if the server's key is not generated cause an error
	chdir(__DIR__); require_once '../tools/dbelections.php';
	$db = new DbBlindedVoter($dbInfos);
	$ok = $db->resetDb();
	$db = new DbElections($dbInfos);
	$ok = $db->resetDb();
	print "<br>\n Deleted the content of the database";
}

if ( /*(isset($_GET['createKeypair' ])) || (isset($_POST['createKeypair' ]))  || */ (isset ( $argv [1] ) && (strcasecmp ( $argv [1], 'createKeyPair' ) === 0))) {
	try {
		define ( 'CRYPT_RSA_MODE', CRYPT_RSA_MODE_INTERNAL ); // this is needed because otherwise openssl (if present) needs special configuration in openssl.cnf when creating a new key pair
		if (isset ( $argv [1] ) && (count ( $argv ) < 4)) {
			print 'usage: php -f admin.php createKeyPair <p|t> <serverIdNumber> [configdir]' . "\np: for permission server\nt: for tallying server\nconfigfile: use this directory instead of the default config dir (optional). Absolut path or relavtive to working dir if starting with './'";
			exit ( 1 );
		}
		
		if (isset ( $argv [2] )) {
			switch ($argv [2]) {
				case 'p' :
				case 'P' :
					$type = 'PermissionServer';
					$bitlength = 2048;
					break; // only 512 because blinding in JavaScript will take more than 5 minutes for 2048
				case 't' :
				case 'T' :
					$type = 'TallyServer';
					$bitlength = 2048;
					break;
				default :
					print "Error: Argument 2 must be either 'p' or 't'. Call 'admin.php createKeyPair' without further parameters to get help.";
					exit ( 1 );
			}
		}
		if (isset ( $argv [3] )) {
			if (is_numeric ( $argv [3] ))
				$thisServerName = $type . $argv [3];
			else
				$thisServerName = $argv [3];
		}
		
		if (isset ($argv[4]) ) {
			$configdir = $argv[4];
		} else {
			$DO_NOT_LOAD_PUB_KEYS = true; // interpreted from loadconfig.php
			chdir(__DIR__); require_once './../tools/loadconfig.php';
		}
		
		$crypt_rsa = new Crypt_RSA ();
		echo "Creating key pair...<br>\r\n";
		$keypair = $crypt_rsa->createKey ( $bitlength );
		
		
		/* taken from ftp://ftp.rsasecurity.com/pub/pkcs/pkcs-1/pkcs-1v2-1-vec.zip
		$n = new Math_BigInteger('a2ba40ee07e3b2bd2f02ce227f36a195024486e49c19cb41bbbdfbba98b22b0e577c2eeaffa20d883a76e65e394c69d4b3c05a1e8fadda27edb2a42bc000fe888b9b32c22d15add0cd76b3e7936e19955b220dd17d4ea904b1ec102b2e4de7751222aa99151024c7cb41cc5ea21d00eeb41f7c800834d2c6e06bce3bce7ea9a5', 16);
		$e = new Math_BigInteger('010001', 16);
		$p = new Math_BigInteger('d17f655bf27c8b16d35462c905cc04a26f37e2a67fa9c0ce0dced472394a0df743fe7f929e378efdb368eddff453cf007af6d948e0ade757371f8a711e278f6b', 16);
		$q = new Math_BigInteger('c6d92b6fee7414d1358ce1546fb62987530b90bd15e0f14963a5e2635adb69347ec0c01b2ab1763fd8ac1a592fb22757463a982425bb97a3a437c5bf86d03f2f', 16);
		
		// taken from https://csrc.nist.gov/csrc/media/projects/cryptographic-algorithm-validation-program/documents/dss/186-2rsatestvectors.zip
		$n = new Math_BigInteger('be499b5e7f06c83fa0293e31465c8eb6b58af920bae52a7b5b9bfeb7aa72db1264112eb3fd431d31a2a7e50941566929494a0e891ed5613918b4b51b0d1fb97783b26acf7d0f384cfb35f4d2824f5dd380623a26bf180b63961c619dcdb20cae406f22f6e276c80a37259490cfeb72c1a71a84f1846d330877ba3e3101ec9c7b', 16);
		$e = new Math_BigInteger('010001', 16);
		$p = new Math_BigInteger('e7a80c5d211c06acb900939495f26d365fc2b4825b75e356f89003eaa5931e6be5c3f7e6a633ad59db6289d06c354c235e739a1e3f3d39fb40d1ffb9cb44288f', 16);
		$q = new Math_BigInteger('d248aa248000f720258742da67b711940c8f76e1ecd52b67a6ffe1e49354d66ff84fa601804743f5838da2ed4693a5a28658d6528cc1803bf6c8dc73c5230b55', 16);
		
		$one = new Math_BigInteger('01', 16);
		$p_1 = $p->subtract($one);
		$q_1 = $q->subtract($one);
		$phi = $p_1->multiply($q_1);
		$d = $e->modInverse($phi);
		
		$crypt_rsa = new rsaMyExts();
		$keypair = $crypt_rsa->rsaGetHelpingNumbers($p, $q, $d, $e, $n);
		*/
		
		
		// save private key to file
		$keystr = str_replace ( '\/', '/', json_encode ( $keypair ) );
		chdir($workingDir);
		global $configdir;
		$filename = "$configdir/voting-keys/${thisServerName}.privatekey.pem.php";
		file_put_contents ( $filename, "<?php\r\n/* \r\n" . $keypair ['privatekey'] . "\r\n*/\r\n?>" );
		echo "Saved private key to '$filename'<br>\r\n";
		// save public key to file
		$crypt_rsa->loadKey ( $keypair ['publickey'] );
		$pubkey = array ( // fields defined by JSON Web Key http://openid.net/specs/draft-jones-json-web-key-03.html
				'alg' => 'RSA', // only RSA is supported by vvvote
				'mod' => base64url_encode ( $crypt_rsa->modulus->toBytes () ),
				'exp' => base64url_encode ( $crypt_rsa->exponent->toBytes () ) 
		);
		// 'kid' => $thisServerName);
		// print_r($crypt_rsa->modulus);
		echo "public key:<br>\r\n";
		echo ' n:   ' . base64url_encode ( $crypt_rsa->modulus->toBytes () ) . "<br>\r\n";
		echo ' k:   ' . $crypt_rsa->k . "<br>\r\n";
		echo ' exp: ' . base64url_encode ( $crypt_rsa->exponent->toBytes () );
		// print_r($crypt_rsa->exponent);
		echo "<br>\r\n";
		$pubkeystr = str_replace ( '\/', '/', json_encode ( $pubkey ) );
		$filename = "$configdir/voting-keys/${thisServerName}.publickey.pem";
		file_put_contents ( $filename, $keypair ['publickey'] ); // $pubkeystr
		echo "Saved public key to '$filename'<br>\r\n";
	} catch ( ElectionServerException $e ) {
		echo "An error ocured: " . $e->__tostring ();
	}
}
// for database debugging use phpMyAdmin or the like

?>