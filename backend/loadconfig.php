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

require_once 'tools.php';
// config dir: use environmant variable if set, otherwise use config dir under the 'backend'-dir
$tmp = getenv('VVVOTE_CONFIG_DIR');
if (is_string($tmp))	$configdir = rtrim($tmp, '/\\');
else 					$configdir = __DIR__ . '/config';
if (! is_dir($configdir)) {user_error('Error: Config directory does not exist or is not a directory: >' . $configdir . '<', E_USER_ERROR); die();}

// config filename: try 'conf-this-server.toml', [hostname].toml and [hostname]_[port].toml
$configFilename = 'conf-this-server.toml';
if (! is_file($configdir . '/' . $configFilename)) {
	if (array_key_exists('HTTP_HOST', $_SERVER) && array_key_exists('SERVER_PORT', $_SERVER) ) {
		$hostfn = preg_replace('/(.*)\:[0-9]*/', '${1}', $_SERVER['HTTP_HOST']); // apache (sometimes) appends the port to the hostname if it is not the default port 80 or 443 --> remove that
		$configFilename = 'conf-' . $hostfn . '.toml';
		if (! is_file($configdir . '/' . $configFilename)) { // try hostname without port 
			$configFilename = 'conf-' . $hostfn . '_' . $_SERVER['SERVER_PORT'] . '.toml'; // try hostname with port
				if (! is_file($configdir . '/' . $configFilename)) { // try hostname without port 
					user_error('Error: config file: >' . $configdir . '/' . $configFilename . '< not found', E_USER_ERROR); die();
				}
		}
	}
}

// load the conf-XX.toml file
if (is_string($configdir)) {
	// $configfile = "C:/Users/R A/Documents/eclipse_workspace/vvvote/vvvote/backend/config/test.toml";
	$configstr = file_get_contents(rtrim($configdir, '/\\') . '/' . $configFilename);
	if ($configstr === false) { user_error("Error while reading config file", E_USER_ERROR);  die();}
	// $config = json_decode($configstr, true);
	// require_once __DIR__ . '/../tools/php-toml.php';
	// $config = Toml::parse($configstr);
	require_once __DIR__ . '/tools/Toml-master/src/Exception/ExceptionInterface.php';
	require_once __DIR__ . '/tools/Toml-master/src/Exception/RuntimeException.php';
	require_once __DIR__ . '/tools/Toml-master/src/Exception/DumpException.php';
	require_once __DIR__ . '/tools/Toml-master/src/Exception/LexerException.php';
	require_once __DIR__ . '/tools/Toml-master/src/Exception/ParseException.php';
	require_once __DIR__ . '/tools/Toml-master/src/Token.php';
	require_once __DIR__ . '/tools/Toml-master/src/Parser.php';
	require_once __DIR__ . '/tools/Toml-master/src/Lexer.php';
	require_once __DIR__ . '/tools/Toml-master/src/Toml.php';
	
	$config = \Yosymfony\Toml\Toml::Parse($configstr);
	if ($config === null) { user_error("Could not json_decode the given config file.", E_USER_ERROR); die(); }
	// print_r($config);
	// extract($config); // we trust the config
	$pServerUrlBases = $config['pServerUrlBases'];
	if (isset($config['tServerStoreVotePorts'])) $tServerStoreVotePorts = $config['tServerStoreVotePorts'];
	else										 $tServerStoreVotePorts = Array('80');
	$serverNo = $config['serverNo'];
	
	$urltmp = parse_url($pServerUrlBases[$serverNo -1]);
	if (! isset($urltmp['port']) || ($urltmp['port'] == 0)) {
		switch ($urltmp['scheme']) {
			case 'http':  $urltmp['port'] =  80; break;
			case 'https': $urltmp['port'] = 443; break;
			default: die('pServerUrlBases must start with >http< or >https<');
		}
	}
	if ( (isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST']   !== $urltmp['host']) ||
		 (isset($urltmp['port']) && isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] !== $urltmp['port'] ) ) {
				}
	$debug = false;
	if (isset($config['debug'])) $debug = $config['debug'];
	$webclientUrlbase = '../webclient'; // relativ to backend or absolute, no trailing slash
	if (isset($config['webclientUrlbase'])) $webclientUrlbase = $config['webclientUrlbase'];
	$configUrlBase = $pServerUrlBases[$serverNo -1];
	
	$dbInfos = $config['dbInfos'];
	if (isset($config['oauthConfig'])) {
		$oauthConfig = array();
		foreach ($config['oauthConfig'] as $curOauthConfig) {
			$curOauthConfig['redirect_uri']          = rtrim($pServerUrlBases[$serverNo -1], '/') . '/modules-auth/oauth/callback.php';
			$curOauthConfig['authorization_endp']    = rtrim($curOauthConfig['oauth_url'], '/') . '/oauth2/authorize/'; 
			$curOauthConfig['token_endp']            = rtrim($curOauthConfig['oauth_url'], '/') . '/oauth2/token/';
			$curOauthConfig['get_profile_endp']    	 = rtrim($curOauthConfig['ressources_url'], '/') . '/user/profile/'; 
			$curOauthConfig['is_in_voter_list_endp'] = rtrim($curOauthConfig['ressources_url'], '/') . '/user/listmember/'; 
			$curOauthConfig['get_membership_endp']   = rtrim($curOauthConfig['ressources_url'], '/') . '/user/membership/'; 
			$curOauthConfig['get_auid_endp']         = rtrim($curOauthConfig['ressources_url'], '/') . '/user/auid/'; 
			$curOauthConfig['sendmail_endp']         = rtrim($curOauthConfig['ressources_url'], '/') . '/user/mails/'; 
			$oauthConfig[] = $curOauthConfig;
		}
	}
	if (isset($config['externalTokenConfig'])) {
		$externalTokenConfig = array();
		foreach ($config['externalTokenConfig'] as $curExternalTokenConfig) { 
			$curExternalTokenConfig['checkTokenUrl'] = rtrim($curExternalTokenConfig['checkerUrl'], '/') . 'vvvote_check_token';	
			$curExternalTokenConfig['sendmail']      = rtrim($curExternalTokenConfig['checkerUrl'], '/') . 'vvvote_send_confirmation.php';	
			$externalTokenConfig[] = $curExternalTokenConfig;
		}
	}
}

date_default_timezone_set('Europe/Berlin'); // this is only used to avoid a warning message from PHP -> you do not need to adjust it. All dates are in UTC or use explicit time zone offset.


// load / set config which is identical for all servers

$urltmp = parse_url($pServerUrlBases[0]);
$tServerStoreVoteUrls = array('http://' . $urltmp['host'] . ':' . $tServerStoreVotePorts[0] . $urltmp['path'] . '/storevote.php');


// number of ballots the servers have to sign 0: first signing server, 1: second signing server...
// last server always must be set to 1.
//     $numBallots = 2;
$numSignBallots   = array(0 => 1, 1 => 1);
$numVerifyBallots = array(0 => 0, 1 => 0);
$numPSigsRequiered = count($numSignBallots); // this number of sigs from permission servers are requiered in order for a return envelope to be accepted
$numPServers = $numPSigsRequiered; // number of permission servers
$numTServers = 1;

if (! isset($DO_NOT_LOAD_PUB_KEYS)) { // this will be set during key generation
	require_once __DIR__ . '/rsaMyExts.php';
	define('CRYPT_RSA_MODE', CRYPT_RSA_MODE_INTERNAL); // this is needed for RSA Key generation (in newelection-->election.php because otherwise openssl (if present) needs special configuration in openssl.cnf when creating a new key pair)
	function loadkeys($dir, $filenameprefix, $num) {
		$serverKeys = array();
		for ($i = 1; $i <= $num; $i++) {
			$pubkeystr = file_get_contents($dir . "/$filenameprefix$i.publickey.pem");
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

	$pServerKeys = loadkeys($configdir, 'PermissionServer', $numPServers);
	$tServerKeys = loadkeys($configdir, 'TallyServer', $numTServers);
}

// length of the keys which will be generated for each question in an election on the newelection-request
$bitlengthElectionKeys = 512; // only 512 because blinding in JavaScript will take more than 5 minutes for 2048

const NEW_ELECTION_URL_PART = '/newelection.php';


// load private key of the permission server and if serverno === 1 also of the tally server


	function loadprivatekey($dir, $typePrefix, $serverNo, array $publickeys) {

		$serverkey = Array();
		$serverkey['serverName'] = $typePrefix . $serverNo;

		$privateKeyStrWraped = file_get_contents( $dir . "/$typePrefix${serverNo}.privatekey.pem.php");
		// extract the key from that file (when created with admin.php there are php markers around it in order to make apache execute it instead of delivering it)
		$privateKeyStr =  preg_replace('/.*(-----BEGIN RSA PRIVATE KEY-----(.*)-----END RSA PRIVATE KEY-----).*/mDs', '$1', $privateKeyStrWraped);
		$serverkey['privatekey'] = $privateKeyStr;

		// extract public key from private key
		$rsa       = new rsaMyExts();
		$rsa->loadKey($serverkey['privatekey']);
		$rsapub    = new rsaMyExts();
		$serverkey['publickey'] = $rsapub->_convertPublicKey($rsa->modulus, $rsa->publicExponent);

		// tests if .publickey matches to the public key in this .privatekey file
		$rsa       = new rsaMyExts();
		$rsa->loadKey($serverkey['publickey']);
		$i = find_in_subarray($publickeys, 'name', $serverkey['serverName']);
		$test = $rsa->modulus->compare($publickeys[$i]['modulus']);
		if ($test !== 0) throw ('internal server configuration error: .publickey does not match the .privatekey for ' . $serverkey['serverName']);
		return $serverkey;
	}
$pserverkey = loadprivatekey($configdir, 'PermissionServer', $serverNo, $pServerKeys);
if ($serverNo === 1) $tserverkey = loadprivatekey($configdir, 'TallyServer', $serverNo, $tServerKeys); // TODO use separate numeration for tally and permission servers

?>