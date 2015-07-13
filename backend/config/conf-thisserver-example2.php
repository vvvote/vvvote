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

require_once __DIR__ . '/../rsaMyExts.php';

date_default_timezone_set('Europe/Berlin');

$webclientUrlbase = '../webclient'; // relativ to backend or absolute, no trailing slash
/*
$p         = new Math_BigInteger('10645752675217578369956837062782498220775273');
$q         = new Math_BigInteger('287562030630461198841452085101513512781647409');
$exppriv   = new Math_BigInteger('1210848652924603682067059225216507591721623093360649636835216974832908320027478419932929', 10);
$exppubl   = new Math_BigInteger('65537', 10);
$n         = new Math_BigInteger('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10);

$rsa       = new rsaMyExts();
// $serverkey = $rsa->rsaGetHelpingNumbers($p, $q, $exppriv, $exppubl, $n);
$serverkey = array (
	'privatekey' => "-----BEGIN RSA PRIVATE KEY-----\r\nMIIBOgIBAAJBAIkMUjQxX4D/f9Md3tcYKwSlet/MW6nBwYrtY9OAC/+1e04PA1TGab7DZApeZIUW\r\nDGS+FNocILauMRouErJXJPsCAwEAAQJACRBTNiJ3Ii1Dre8ReCugBLb7sRDEldiQ9/g1RvKhWIWg\r\nVZFWk6ngeZmBBXobpIkXhB3I2kiv6I5JrBxM/kbTYQIhAJPLfjfbqADR/pXPR7ZRXLVJ0IoCaOwI\r\nPTwz8P82pR4rAiEA7WKcrX0RpN2cRWvyLBtOoSiDrt3858lNrrBf27aIfHECIHZ3gvDbTUt7CAql\r\nX+IwTZOzW0mErP2ljRAYwnCQKMKJAiEAnLZqGrojaMSIQuhFYsrQOOInNM0GBfrGFtoHHmQ9bHEC\r\nIBLrnHNXAEjKMQxKben6pqoKuPsNiHMpdyY3Av6Pg8+1\r\n-----END RSA PRIVATE KEY-----",
	'publickey'	 => "-----BEGIN PUBLIC KEY-----\r\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIkMUjQxX4D/f9Md3tcYKwSlet/MW6nBwYrtY9OAC/+1\r\ne04PA1TGab7DZApeZIUWDGS+FNocILauMRouErJXJPsCAwEAAQ==\r\n-----END PUBLIC KEY-----"
);
$serverkey['serverName'] = 'PermissionServer2';
*/

$serverNo = 2;
// load private key
$serverkey = Array();
$serverkey['serverName'] = 'PermissionServer' .$serverNo;

$privateKeyStr = file_get_contents(__DIR__ . "/PermissionServer${serverNo}.privatekey");
$serverkey['privatekey'] = $privateKeyStr;

// extract public key from private key
$rsa       = new rsaMyExts();
$rsa->loadKey($serverkey['privatekey']);
$rsapub    = new rsaMyExts();
$serverkey['publickey'] = $rsapub->_convertPublicKey($rsa->modulus, $rsa->publicExponent);

// test if .publickey matches to the public key in this .privatekey file
$rsa       = new rsaMyExts();
$rsa->loadKey($serverkey['publickey']);
$i = find_in_subarray($pServerKeys, 'name', $serverkey['serverName']);
$test = $rsa->modulus->compare($pServerKeys[$i]['modulus']);
if ($test !== 0) throw ('internal server configuration error: .publickey does not match the .privatekey for ' . $serverkey['serverName']);


$debug     = true;


$dbInfos = array(
		'dbtype'   => 'mysql',
		'dbhost'  => 'localhost',
		'dbuser'  => 'root',
		'dbpassw' => 'bernAl821',
		'dbname'  => 'election_server2',
		'prefix'  => 'el2_'
);

// OAuth 2.0 config
$oauthBEObayern = array(
		'serverId'      => 'BEOBayern',
		'client_id'     => 'vvvote2',
		'client_secret' => 'your_client_secret',
		'redirect_uri'  => 'http://www2.webhod.ra/vvvote2/backend/modules-auth/oauth/callback.php',
		// 	'redirect_uri'  => 'https://abstimmung.piratenpartei-nrw.de/backend/modules-auth/oauth/callback.php',
			'mail_identity' => 'voting', // this is used for the sendmail_endp and determines which sender will be used for the mail 
			'mail_sign_it'  => true,     // wheather the mail should be signed by the id server 
			'mail_content'	=> array(    // $electionId will be replaced by the electionId
					'subject' => 'Wahlschein erstellt',
					'body'    => "Hallo!\r\n\r\nSie haben für die Abstimmung >" . '$electionId' . "< einen Wahlschein erstellt.\r\nFalls dies nicht zutreffen sollte, wenden Sie sich bitte umgehend an einen Abstimmungsverantwortlichen.\r\n\r\nFreundliche Grüße\r\nDas Wahlteam\r\n"
					),
			
			'authorization_endp'    => 'https://beoauth.piratenpartei-bayern.de/oauth2/authorize/',
			'token_endp'            => 'https://beoauth.piratenpartei-bayern.de/oauth2/token/',
			'get_profile_endp'      => 'https://beoauth.piratenpartei-bayern.de/api/v1/user/profile/',
			'is_in_voter_list_endp' => 'https://beoauth.piratenpartei-bayern.de/api/v1/user/listmember/',
			'get_membership_endp'   => 'https://beoauth.piratenpartei-bayern.de/api/v1/user/membership/',
			'get_auid_endp'			=> 'https://beoauth.piratenpartei-bayern.de/api/v1/user/auid/',
			'sendmail_endp'			=> 'https://beoauth.piratenpartei-bayern.de/api/v1/user/mails/'
);
$oauthConfig = array($oauthBEObayern['serverId'] => $oauthBEObayern);

$externalTokenConfig = array(
		/* make sure:
		 *  - in order to make the certification check work: copy the certificate (.pem)-file in backend/config and name it <configId>.pem (you can easily use a webbrowser to obtain that file)
		*/
		
		array(
				'configId'         => 'basisentscheid_offen', // this is used to identify the correct config and specified in the newElection.php call
				'checkTokenUrl'    => 'https://basisentscheid.piratenpartei-bayern.de/offen/vvvote_check_token.php', // URL which is used to check if the token is valid and the correspondig user allowed to vote
				'verifierPassw'    => 'mysecret', // password needed to authorize the check token request
				'verifyCertificate' => true,
				'sendmail'          => 'https://basisentscheid.piratenpartei-bayern.de/offen/vvvote_send_confirmation.php'
		)
);


?>