<?php

// only allow call from command line
if (PHP_SAPI !== 'cli') {
	header ( 'HTTP/1.0 404 Not Found' );
	echo "<h1>404 Not Found</h1>";
	echo "The page that you have requested could not be found.";
	exit ();
}

echo "This command automatically downloads all needed certification chains for all servers using https in the config. It places them in the needed location config/tls-certificates/[hostname].pem. \r\n\r\nsyntax: php -f retrieve-tls-chains.php [configfile]\r\n [configfile] path including file name to the config file (optional). Start with './' for a relative path from the workign dir\r\n";
$curdir = getcwd();
chdir(__DIR__);
chdir(__DIR__); require '../tools/exception.php';
if ($argc > 1) {
	$configFilepath = $argv[1];
	if (substr_compare($configFilepath, './', 0, 2) === 0) // relativ path
		$configFilepath = $curdir . '/' . $configFilepath;  // make it absolute
}
chdir(__DIR__); require '../tools/loadconfig.php';
// require __DIR__ . '/../config/conf-thisserver.php';

$tlshosts = array ();

/*
 * function that add a host if it is an https and shows errors
 */
function addHost($array, $key, $configContext) {
	global $tlshosts;
	$url = $array [$key];
	$urlparts = parse_url ( $url );
	if ($urlparts === false)
		echo 'Error in config ' . $configContext . ' ' . $key . ' while parsing URL >' . $url . "<\r\n";
	else {
		if (! isset ( $urlparts ['scheme'] ))
			echo 'Error in config ' . $configContext . ' ' . $key . ' missing "http://" or "https://" >' . $url . "<\r\n";
		else {
			if ($urlparts ['scheme'] === 'https') {
				if (! isset ( $urlparts ['host'] ))
					echo 'Error in config ' . $configContext . ' ' . $key . ' missing host part of URL " >' . $url . "<\r\n";
				else {
					$host = $urlparts ['host'];
					if (($host !== false) && (array_search ( $host, $tlshosts ) === false))
						$tlshosts [] = $host;
				}
			}
		}
	}
}

// add all permission servers
foreach ( $pServerUrlBases as $id => $curConfig ) {
	// var_dump ( $curConfig );
	addHost ( $pServerUrlBases, $id, '$pServerUrlBases' );
}

// add all tallying servers
foreach ( $tServerStoreVoteUrls as $id => $curConfig ) {
	// var_dump ( $curConfig );
	addHost ( $tServerStoreVoteUrls, $id, '$tServerStoreVoteUrls' );
}

// add all externalToken servers
foreach ( $externalTokenConfig as $id => $curConfig ) {
	// var_dump ( $curConfig );
	if ($curConfig ['verifyCertificate'] === true) {
		addHost ( $curConfig, 'checkTokenUrl', 'externalTokenConfig >' . $curConfig ['configId'] . '<' );
		addHost ( $curConfig, 'sendmail', 'externalTokenConfig >' . $curConfig ['configId'] . '<' );
	}
}

// add all oAuth servers
foreach ( $oauthConfig as $id => $curConfig ) {
	// var_dump ( $curConfig );
	addHost ( $curConfig, 'authorization_endp', 'oAuthConfig >' . $id . '<' );
	addHost ( $curConfig, 'token_endp', 'oAuthConfig >' . $id . '<' );
	addHost ( $curConfig, 'get_profile_endp', 'oAuthConfig >' . $id . '<' );
	addHost ( $curConfig, 'is_in_voter_list_endp', 'oAuthConfig >' . $id . '<' );
	addHost ( $curConfig, 'get_membership_endp', 'oAuthConfig >' . $id . '<' );
	addHost ( $curConfig, 'get_auid_endp', 'oAuthConfig >' . $id . '<' );
	addHost ( $curConfig, 'sendmail_endp', 'oAuthConfig >' . $id . '<' );
	addHost ( $curConfig, 'authorization_endp', 'oAuthConfig >' . $id . '<' );
}

// array_unique($tlsurls,SORT_STRING);

// retrieve the certifications chain for all servers
foreach ( $tlshosts as $host ) {
	echo "Retrieving certificate chain for >$host<...\r\n";
	try {
		$pemstr = retrievePem ( $host );
		// echo $pemstr;
		global $configdir; 
		$pemfilename = $configdir . '/tls-certificates/' . $host . '.pem';
		$written = file_put_contents ( $pemfilename, $pemstr );
		// $ret = exec ( 'echo "" | openssl s_client -connect ' . $host . ':443 -servername ' . $host . ' -prexit 2>/dev/null | sed -n -e "/BEGIN\ CERTIFICATE/,/END\ CERTIFICATE/ p" >' . $pemfilename, $output, $retval );
		// var_dump ( $ret );
		// var_dump ( $retval );
		// var_dump ( $output );
		if (($written === 0) || ($written === false)) {
			echo "    ...error retrieving certification chain\r\n\r\n";
			unlink ( $pemfilename );
		} else
			echo "    ...wrote the following file >$pemfilename<\r\n\r\n";
	} catch ( ElectionServerException $e ) {
		echo "    ...error retrieving certification chain: " . $e->__toString () . "\r\n\r\n";
	}
}

function retrievePem($hostname) {
	$ssloptions = array (
			"capture_peer_cert_chain" => true,
			"allow_self_signed" => false,
			// "CN_match" => $hostname,
			"verify_peer" => false, // true, (must be false as we do not have a root certificate yet)
			"SNI_enabled" => true,
			"peer_name" => $hostname,
			"verify_peer_name" => true
	); // ,
	   // "cafile" => '/etc/ssl/certs/ca-certificates.crt'
	   // mozilla ca cert bundle: http://curl.haxx.se/docs/caextract.html
	
	$ctx = stream_context_create ( array (
			"ssl" => $ssloptions 
	) );
	$result = @stream_socket_client ( "ssl://$hostname:443", $errno, $errstr, 10, STREAM_CLIENT_CONNECT, $ctx );
	if ($errno)
		ElectionServerException::throwException ( 19843954, "Error opening SSL-Socket: $errstr", '' );
	if ($result === false)
		ElectionServerException::throwException ( 19843955, "Error opening SSL-Socket before connect(): This can happen e.g. when the hostname does not match certificate. If you have curl installed, you can call >curl -v https://$hostname/< to find out more details", '' );
	$cont = stream_context_get_params ( $result );
	$ret = '';
	foreach ( $cont ["options"] ["ssl"] ["peer_certificate_chain"] as $cert ) {
		openssl_x509_export ( $cert, $pem_encoded );
		$ret = $ret . $pem_encoded;
	}
	return $ret;
}
?>