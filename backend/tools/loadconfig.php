<?php
/**
 * return 404 if called directly
 */
if (count ( get_included_files () ) < 2) {
	header ( 'HTTP/1.0 404 Not Found' );
	echo "<h1>404 Not Found</h1>";
	echo "The page that you have requested could not be found.";
	exit ();
}

chdir(__DIR__); require_once './exception.php';
chdir(__DIR__); require_once './tools.php';

// use globally set path to configfile, if set
if (! isset ( $configFilepath )) {
	// config dir: use environmant variable if set, otherwise use config dir under the 'backend'-dir
	$tmp = getenv ( 'VVVOTE_CONFIG_DIR' );
	if (is_string ( $tmp ))
		$configdir = rtrim ( $tmp, '/\\' );
	else
		$configdir = __DIR__ . '/../config';
	if (! is_dir ( $configdir )) {
		user_error ( 'Error: Config directory does not exist or is not a directory: >' . $configdir . '<', E_USER_ERROR );
		die ();
	}
	
	// config filename: try "config-[hostname]_[port].php", "config-[hostname].php" and 'config.php'
	if (array_key_exists ( 'HTTP_HOST', $_SERVER ) && array_key_exists ( 'SERVER_PORT', $_SERVER )) {
		$hostfn = preg_replace ( '/(.*)\:[0-9]*/', '${1}', $_SERVER ['HTTP_HOST'] ); // apache (sometimes) appends the port to the hostname if it is not the default port 80 or 443 --> remove that
		$configFilename = 'config-' . $hostfn . '_' . $_SERVER ['SERVER_PORT'] . '.php'; // try hostname with port
		if (! is_file ( $configdir . '/' . $configFilename )) {
			$configFilename = 'config-' . $hostfn . '.php'; // try hostname without port
			if (! is_file ( $configdir . '/' . $configFilename )) {
				$configFilename = 'config.php';
			}
		}
	} else {
		$configFilename = 'config.php';
	}
$configFilepath = $configdir . '/' . $configFilename;
}
if (! is_file ( $configFilepath )) {
	user_error ( 'Error: config file: >' .$configFilepath . '< not found', E_USER_ERROR );
	die();
}
$configdir = dirname($configFilepath);

// load the config file
chdir(__DIR__); require_once $configFilepath;
if ($config === null) {
	user_error ( "Could not decode the given config file >$configFilepath<.", E_USER_ERROR );
	die ();
}
// var_export($config);

$debug = false;
if (isset ( $config ['debug'] ))
	$debug = $config ['debug'];

$serverNo = $config ['serverNo'];
	
$pServerUrlBases = array ();
$ApiPrefix = 'api/v1/';
foreach ( $config ['pServerUrlBases'] as $i => $curUrl ) {
	$urltmp0 = trim ( $curUrl, '/' ) . '/';
	$urltmp = parse_url ( $urltmp0 );
	if (! isset ( $urltmp ['port'] ) || ($urltmp ['port'] == 0 || empty($urltmp ['port']))) {
		switch ($urltmp ['scheme']) {
			case 'http' :
				$urltmp ['port'] = 80;
				break;
			case 'https' :
				$urltmp ['port'] = 443;
				break;
			default :
				InternalServerError::throwException ( 643986, 'Error: pServerUrlBases must start with >http< or >https<, ', 'found: >' . $pServerUrlBases [$serverNo - 1] . '<' );
		}
	}
//	if ( (($i + 1) === $serverNo) && isset ( $_SERVER ) && array_key_exists('HTTP_HOST', $_SERVER) && array_key_exists('SERVER_PORT', $_SERVER) ) {
//		if (($urltmp ['host'] !== preg_replace ( '/(.*)\:[0-9]*/', '${1}', $_SERVER ['HTTP_HOST'])) || ($urltmp ['port'] != $_SERVER ['SERVER_PORT']))
//			InternalServerError::throwException ( 8347546, 'Warning: http request host does not match configured hostname/port. A reason for this might be wrong serverNo in config', 'http requested host >' . preg_replace ( '/(.*)\:[0-9]*/', '${1}', $_SERVER ['HTTP_HOST']) . ':' . $_SERVER ['SERVER_PORT'] . "<, configured (serverNo: $serverNo >" . $urltmp ['host'] . ':' . $urltmp ['port'] . '<.' );
//	}
	$pServerUrlBases [] = $urltmp0 . $ApiPrefix;			
}


if (isset ( $config ['tServerStoreVotePorts'] ))
	$tServerStoreVotePorts = $config ['tServerStoreVotePorts'];
else {
	$tServerStoreVotePorts = array();
	foreach ($pServerUrlBases as $key => $value) {
		$tServerStoreVotePorts[$key] = '80';
	}
}

$linkToHostingOrganisation = '#';
if (isset ( $config ['linkToHostingOrganisation'] )) {
	$linkToHostingOrganisation = $config ['linkToHostingOrganisation'];
}

$aboutUrl = '';
if (isset ( $config ['aboutUrl'] )) {
	$aboutUrl = $config ['aboutUrl'];
}


$webclientUrlbase = '../../webclient/'; // relativ to api/v1/index.php or absolute, with trailing slash, URL allowed
if (isset ( $config ['webclientUrlbase'] ))
	$webclientUrlbase = rtrim($config ['webclientUrlbase'], '/') . '/';
$configUrlBase = $pServerUrlBases [$serverNo - 1];

$dbInfos = $config ['dbInfos'];


if (isset ( $config ['externalTokenConfig'] )) {
	$externalTokenConfig = array ();
	foreach ( $config ['externalTokenConfig'] as $curExternalTokenConfig ) {
		$curExternalTokenConfig ['checkTokenUrl'] = rtrim ( $curExternalTokenConfig ['checkerUrl'], '/' ) . '/vvvote_check_token.php';
		$curExternalTokenConfig ['sendmail'] = rtrim ( $curExternalTokenConfig ['checkerUrl'], '/' ) . '/vvvote_send_confirmation.php';
		$externalTokenConfig [] = $curExternalTokenConfig;
	}
}

date_default_timezone_set ( 'Europe/Berlin' ); // this is only used to avoid a warning message from PHP -> you do not need to adjust it. All dates are in UTC or use explicit time zone offset.
                                            
// load / set config which is identical for all servers

$tServerStoreVoteUrls = array();
foreach ( $tServerStoreVotePorts as $key => $value ) {
	$urltmp = parse_url ( $pServerUrlBases [$key] );
	$tServerStoreVoteUrls[$key] = 'http://' . $urltmp ['host'] . ':' . $tServerStoreVotePorts [$key] . $urltmp ['path'] . 'storevote';
}

// number of ballots the servers have to sign 0: first signing server, 1: second signing server...
// last server always must be set to 1.
// $numBallots = 2;
$numSignBallots = array (
		0 => 1,
		1 => 1 
);
$numVerifyBallots = array (
		0 => 0,
		1 => 0 
);
$numPSigsRequiered = count ( $numSignBallots ); // this number of sigs from permission servers are requiered in order for a return envelope to be accepted
$numPServers = $numPSigsRequiered; // number of permission servers
$numTServers = 2;

if (! isset ( $DO_NOT_LOAD_PUB_KEYS )) { // this will be set during key generation
	chdir(__DIR__); require_once './rsaMyExts.php';
	define ( 'CRYPT_RSA_MODE', CRYPT_RSA_MODE_INTERNAL ); // this is needed for RSA Key generation (in newelection-->election.php because otherwise openssl (if present) needs special configuration in openssl.cnf when creating a new key pair)
	function loadkeys($dir, $filenameprefix, $num) {
		$serverKeys = array ();
		for($i = 1; $i <= $num; $i ++) {
			$pubkeyfilename = $dir . "/voting-keys/$filenameprefix$i.publickey.pem";
			$pubkeystr = @file_get_contents ( $pubkeyfilename );
			if ($pubkeystr === false)
				InternalServerError::throwException ( 6345986, 'Internal server configuration error: Could not read public voting key', 'Looking for file >' . $pubkeyfilename . '<' );
			$rsa = new rsaMyExts ();
			$rsa->loadKey ( $pubkeystr );
			$pServerKey = array (
					'name' => $filenameprefix . $i, // $pubkeyJson['kid'],
					'modulus' => $rsa->modulus,
					'exponent' => $rsa->exponent 
			);
			$serverKeys [] = $pServerKey;
		}
		return $serverKeys;
	}
	
	$pServerKeys = loadkeys ( $configdir, 'PermissionServer', $numPServers );
	$tServerKeys = loadkeys ( $configdir, 'TallyServer', $numTServers );
}

// length of the keys which will be generated for each question in an election on the newelection-request
$bitlengthElectionKeys = 512; // only 512 because blinding in JavaScript will take more than 5 minutes for 2048
const NEW_ELECTION_URL_PART = 'newelection';

// load private key of the permission server and if serverno === 1 also of the tally server
function loadprivatekey($dir, $typePrefix, $serverNo, array $publickeys) {
	$serverkey = Array ();
	$serverkey ['serverName'] = $typePrefix . $serverNo;
	
	$privatekeyfilename = $dir . "/voting-keys/$typePrefix${serverNo}.privatekey.pem.php";
	$privateKeyStrWraped = file_get_contents ( $privatekeyfilename );
	if ($privateKeyStrWraped === false)
		InternalServerError::throwException ( 646584, 'Internal server configuration error: Could not read chain of SSL-certificates', 'Looking for file >' . $privatekeyfilename . '<' );
		
		// extract the key from that file (when created with admin.php there are php markers around it in order to make apache execute it instead of delivering it)
	$privateKeyStr = preg_replace ( '/.*(-----BEGIN RSA PRIVATE KEY-----(.*)-----END RSA PRIVATE KEY-----).*/mDs', '$1', $privateKeyStrWraped );
	$serverkey ['privatekey'] = $privateKeyStr;
	
	// extract public key from private key
	$rsa = new rsaMyExts ();
	$rsa->loadKey ( $serverkey ['privatekey'] );
	$rsapub = new rsaMyExts ();
	$serverkey ['publickey'] = $rsapub->_convertPublicKey ( $rsa->modulus, $rsa->publicExponent );
	
	// tests if .publickey matches to the public key in this .privatekey file
	$rsa = new rsaMyExts ();
	$rsa->loadKey ( $serverkey ['publickey'] );
	$i = find_in_subarray ( $publickeys, 'name', $serverkey ['serverName'] );
	if ($i === false)
		InternalServerError::throwException ( 656661, 'Internal server configuration error: no publickey found for the privatekey for ', $serverkey ['serverName'] );
	$test = $rsa->modulus->compare ( $publickeys [$i] ['modulus'] );
	if ($test !== 0)
		InternalServerError::throwException ( 656662, 'Internal server configuration error: .publickey.pem does not match the .privatekey.pem.php', 'for >' . $serverkey ['serverName'] . '<, private key file >' . $privatekeyfilename . '<.' );
	return $serverkey;
}
if (! isset ( $DO_NOT_LOAD_PUB_KEYS )) {
	$pserverkey = loadprivatekey ( $configdir, 'PermissionServer', $serverNo, $pServerKeys );
	$tserverkey = loadprivatekey ( $configdir, 'TallyServer', $serverNo, $tServerKeys ); // TODO use separate numeration for tally and permission servers
}

if (isset ( $config ['oauth2Config'] )) {
	$oauthConfig = array ();
	foreach ( $config ['oauth2Config'] as $curOauthConfig) {
		if (! array_key_exists('oauth_url',            $curOauthConfig)) InternalServerError::throwException(346548, 'missing >oauth_url< in oAuth2 config', '');
		if (! array_key_exists('ressources_url',       $curOauthConfig)) InternalServerError::throwException(346549, 'missing >ressources_url< in oAuth2 config', '');
		if (! array_key_exists('client_ids',           $curOauthConfig)) InternalServerError::throwException(346550, 'missing >clientIds< in oAuth2 config', '');
		if (! is_array($curOauthConfig['client_ids'])                  ) InternalServerError::throwException(346555, '>clientIds< in oAuth2 must be an array', '');
		if (! array_key_exists('client_secret',        $curOauthConfig)) InternalServerError::throwException(346551, 'missing >client_secret< in oAuth2 config', '');
		if (! array_key_exists('mail_identity',        $curOauthConfig)) InternalServerError::throwException(346552, 'missing >mail_identity< in oAuth2 config', '');
		if (! array_key_exists('mail_content_subject', $curOauthConfig)) InternalServerError::throwException(346553, 'missing >mail_content_subject< in oAuth2 config', '');
		if (! array_key_exists('mail_content_body',    $curOauthConfig)) InternalServerError::throwException(346554, 'missing >mail_content_body< in oAuth2 config', '');
		if (! array_key_exists('serverDesc',           $curOauthConfig)) InternalServerError::throwException(346556, 'missing >serverDesc< in oAuth2 config', '');
		
		if (! array_key_exists('type',         $curOauthConfig) ) $curOauthConfig['type']         = 'ekklesia';
		if (! array_key_exists('mail_sign_it', $curOauthConfig) ) $curOauthConfig['mail_sign_it'] = false;
		
		$oauthUrlTrimmed = rtrim ( $curOauthConfig ['oauth_url'], '/' );
		$resUrlTrimmed =  rtrim ( $curOauthConfig ['ressources_url'], '/' );
				
		switch ($curOauthConfig['type']) {
			case "ekklesia":
				if (! array_key_exists('scope',        $curOauthConfig) ) $curOauthConfig['scope']        = 'member unique mail';
				$curOauthConfig ['token_endp'] = $oauthUrlTrimmed . '/oauth2/token/';
//not used at the moment				$curOauthConfig ['get_profile_endp'] =  $resUrlTrimmed . '/user/profile/';
				$curOauthConfig ['is_in_voter_list_endp'] = $resUrlTrimmed . '/user/listmember/';
				$curOauthConfig ['get_membership_endp'] = $resUrlTrimmed . '/user/membership/';
				$curOauthConfig ['get_auid_endp'] = $resUrlTrimmed . '/user/auid/';
				$curOauthConfig ['sendmail_endp'] = $resUrlTrimmed . '/user/mails/';
				$curOauthConfig ['client_id'] = $curOauthConfig ['client_ids'][$serverNo - 1];
				// the following only needed for the webclient provided throu getserverinfos.php
				$curOauthConfig ['authorize_url'] = $oauthUrlTrimmed . '/oauth2/authorize/?'; // must end with ?
				$curOauthConfig ['login_url'] = $oauthUrlTrimmed . '/';
				for ($i = 0; $i < count($pServerUrlBases); $i++) {
					$curOauthConfig ['redirectUris'][$pServerKeys[$i]['name']] = rtrim ($pServerUrlBases[$i],'/') . '/modules-auth/oauth2/callback';
					$curOauthConfig ['clientIds']   [$pServerKeys[$i]['name']] = $curOauthConfig['client_ids'][$i];
				}
				$curOauthConfig ['redirect_uri'] = $curOauthConfig ['redirectUris'][$pServerKeys[$serverNo -1]['name']];
				$oauthConfig[$curOauthConfig['serverId']] = $curOauthConfig;
				break;
			case "keycloak":
				if (! array_key_exists('scope', $curOauthConfig) ) $curOauthConfig['scope'] = 'eligible user_roles verified';
				$curOauthConfig ['token_endp'] = $oauthUrlTrimmed . '/token/'; // umgestellt
//not used at the moment				$curOauthConfig ['get_profile_endp'] =  $resUrlTrimmed . '/userinfo/';
// not supported by keycloak at the moment				$curOauthConfig ['is_in_voter_list_endp'] = $resUrlTrimmed . '/user/listmember/';
				$curOauthConfig ['get_membership_endp'] = $resUrlTrimmed . '/userinfo';
				$curOauthConfig ['get_auid_endp'] = $resUrlTrimmed . '/userinfo';
				$curOauthConfig ['sendmail_endp'] = $resUrlTrimmed . '/user/mails/'; // not yet implemented in keycloak server
				$curOauthConfig ['client_id'] = $curOauthConfig ['client_ids'][$serverNo - 1];
				// the following only needed for the webclient provided throu getserverinfos.php
				$curOauthConfig ['authorize_url'] = $oauthUrlTrimmed . '/auth?'; // must end with ? or & // umgestellt
				$curOauthConfig ['login_url'] = $oauthUrlTrimmed . '/';
				for ($i = 0; $i < count($pServerUrlBases); $i++) {
					$curOauthConfig ['redirectUris'][$pServerKeys[$i]['name']] = rtrim ($pServerUrlBases[$i],'/') . '/modules-auth/oauth2/callback';
					$curOauthConfig ['clientIds']   [$pServerKeys[$i]['name']] = $curOauthConfig['client_ids'][$i];
				}
				$curOauthConfig ['redirect_uri'] = $curOauthConfig ['redirectUris'][$pServerKeys[$serverNo -1]['name']];
				$oauthConfig[$curOauthConfig['serverId']] = $curOauthConfig;
				break;
		}
	}
}




?>