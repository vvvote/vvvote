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

/*********************************************************
*  Change the settings to match your database account
*/
$dbInfos = array(
		'dbtype'  => 'mysql',
		'dbhost'  => 'localhost',
		'dbuser'  => 'root',
		'dbpassw' => 'bernAl821',
		'dbname'  => 'election_server1',
		'prefix'  => 'el1_'  // this will be prepended to all table names - you can just leave it the way it is
);

/**
 * Beyond this point in this file, you only need to make changes if you want to configure OAuth2 or externalToken-Auth
 ************************************************************/

require_once __DIR__ . '/../rsaMyExts.php';

$serverNo = 1;
if (isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] !== parse_url($pServerUrlBases[$serverNo -1],  PHP_URL_HOST)) {
	require_once 'conf-thisserver2.php';
} else {
	date_default_timezone_set('Europe/Berlin'); // this is only used to avoid a warning message from PHP -> you do not need to adjust it. All dates are in UTC or use explicit time zone offset.
	
	$webclientUrlbase = '../webclient'; // relativ to backend or absolute, no trailing slash
	
	$debug     = false;

	// define('DB_PREFIX', 'server1_');

	// OAuth 2.0 config
	$oauthBEObayern = array(
			'serverId'      => 'BEOBayern',
			'client_id'     => 'vvvote',
			'client_secret' => 'your_client_secret',
			'redirect_uri'  => $configUrlBase . '/modules-auth/oauth/callback.php',
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
	
	// tests if .publickey matches to the public key in this .privatekey file
	$rsa       = new rsaMyExts();
	$rsa->loadKey($serverkey['publickey']);
	$i = find_in_subarray($pServerKeys, 'name', $serverkey['serverName']);
	$test = $rsa->modulus->compare($pServerKeys[$i]['modulus']);
	if ($test !== 0) throw ('internal server configuration error: .publickey does not match the .privatekey for ' . $serverkey['serverName']);
	
	
}

?>