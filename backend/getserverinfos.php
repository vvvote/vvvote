<?php

/**
 * prints the content of the servers's public keys as JavaScript
 * with assignment to PermissionServer${i}pubkey
 */

chdir(__DIR__);

try {
    $DO_NOT_LOAD_PRIV_KEYS = TRUE;
	chdir(__DIR__); require_once './tools/loadconfig.php'; // needed for $numPServers and $pServerUrlBases and $oauthConfig
	
	for($i = 0; $i < $numPServers; $i ++) {
		$key = array (
				'kty' => 'RSA',
				'n' => base64url_encode ( $pServerKeys [$i] ['modulus']->toBytes () ),
				// 'modHex'=> $pServerKeys[$i]['modulus']->toHex(),
				'e' => base64url_encode ( $pServerKeys [$i] ['exponent']->toBytes () ),
				'kid' => $pServerKeys [$i] ['name'] 
		);
		$pkeys [] = $key;
	}
	
	for($i = 0; $i < $numTServers; $i ++) {
		$key = array (
				'kty' => 'RSA',
				'n' => base64url_encode ( $tServerKeys [$i] ['modulus']->toBytes () ),
				// 'modHex'=> $pServerKeys[$i]['modulus']->toHex(),
				'e' => base64url_encode ( $tServerKeys [$i] ['exponent']->toBytes () ),
				'kid' => $tServerKeys [$i] ['name'] 
		);
		$tkeys [] = $key;
	}
	
	if (isset ( $oauthConfig )) {
		foreach ( $oauthConfig as $curConfig ) {
			$oauth = array (
					'serverId'        => $curConfig ['serverId'],
					'serverDesc'      => $curConfig ['serverDesc'],
					'authorizeUri'    => $curConfig ['authorize_url'],
					'loginUri'        => $curConfig ['login_url'],
					'scope'           => $curConfig ['scope'],
					'redirectUris'    => $curConfig ['redirectUris'],
					'clientIds'       => $curConfig ['clientIds']
			);
			if (array_key_exists('server_usage_note', $curConfig)) $oauth['serverUsageNote'] = $curConfig['server_usage_note'];
			if (array_key_exists('logout_url'       , $curConfig)) $oauth['logoutUrl']       = $curConfig['logout_url'];
			$oauthConfigs [$curConfig ['serverId']] = $oauth;
		}
	}
	
	$serverinfos = array (
			'pkeys' => $pkeys,
			'pServerUrlBases' => $pServerUrlBases,
			'tkeys' => $tkeys,
			'tServerStoreVoteUrls' => $tServerStoreVoteUrls,
            'anonymizerUrl' => $anonymizerUrl
	);
	if (isset($oauthConfigs)) $serverinfos['authModules'] = array ('oAuth2' => $oauthConfigs);
	else $serverinfos['authModules'] = array ();

} catch ( Exception $e ) {
	$serverinfos = array (
			'cmd' => 'serverError',
			'errorDesc' => $e->__toString () 
	);
}

$serverinfosStr = str_replace ( '\/', '/', json_encode ( $serverinfos ) );

global $output_as_javascript;
if (isset ( $_GET ['js'] ) || isset ( $output_as_javascript )) {
	echo "serverinfos = \r\n";
	echo "$serverinfosStr";
	echo ';';
	echo "\r\n";
} else {
	echo "$serverinfosStr";
}

/*
 * echo "PermissionServerpubkeys = \r\n";
 * echo '{jwk:';
 * echo '[';
 * for ($i = 1; $i <= $numPServers; $i++) {
 * readfile("config/PermissionServer${i}.publickey");
 * if ($i < $numPServers) echo ",\r\n";
 * else echo "]\r\n";
 * }
 * echo '},';
 *
 *
 *
 *
 * echo '{urls:[';
 * for ($i = 1; $i <= $numPServers; $i++) {
 * echo '"' . $pServerUrlBases . '"';
 * if ($i < $numPServers) echo ",\r\n";
 * else echo "]\r\n";
 * }
 * echo '}';
 * echo ";\r\n";
 */

?>