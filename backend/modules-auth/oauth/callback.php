<?php

require_once 'config/conf-allservers.php';
require_once 'config/conf-thisserver.php';
require_once 'exception.php';

// config
// $acc_url = 'https://beoauth.piratenpartei-bayern.de/oauth2/token/'; // URL for fetching the access token 
// $authurl = 'https://beoauth.piratenpartei-bayern.de/oauth2/authorize/'; // URL to be opened on the voters web browser asking to login and authorization
  // append to this URL: //?scope=member&state=BEO+Bayern.12345&redirect_uri=https://abstimmung.piratenpartei-nrw.de/backend/modules-auth/oauth/callback.php&response_type=code&client_id=vvvote';


require 'client.php';
require 'GrantType/IGrantType.php';
require 'GrantType/AuthorizationCode.php';


$client = new OAuth2\Client(CLIENT_ID, CLIENT_SECRET);
if (!isset($_GET['code']))
{
	$auth_url = $client->getAuthenticationUrl(AUTHORIZATION_ENDPOINT, REDIRECT_URI);
	header('Location: ' . $auth_url);
	die('Redirect');
}
else
{
	$oauthdata = explode('.', $_GET['state'], 2); // TODO test if set -> error handling
	if (len($oauthdata) < 2) {} // TODO error handling
	print_r($oauthdata);
	$curConfig = $oauthConfig[$oauthdata[0]]; 
	// TODO write $oauthdata[0] and $oauthdata[1] into a database
	$params = array('code' => $_GET['code'], 'redirect_uri' => $curConfig['redirect_uri']);
	$response = $client->getAccessToken($curConfig['token_endp'], 'authorization_code', $params);
	print_r($response);
	parse_str($response['result'], $info);
	print_r($info);
	$client->setAccessToken($info['access_token']);
	$response = $client->fetch($curConfig['get_membership_endp']);
	print_r($response);
	// var_dump($response, $response['result']);
}



if (isset($_GET) && isset($_GET['code']) ) {
	$code = $_GET['code'];
	// get access token
	
// 	Der app Server hohlt sich per request token (code) von https://beoauth.piratenpartei-bayern.de/oauth2/token/
// 	POST: 'code': '3ZSbhSJWFEp6Fzuiplbw7g7qU4lEUz', 'client_secret':
// 	'somesecret', 'grant_type': 'authorization_code', 'client_id':
// 	'portal-local', 'redirect_uri': 'https://localhost:1443/accounts/auth/'}
	
	
	
	
	fetchAUUID();
	fetchName();
	fetchMember();
	fetchHgroupd();
	
	if (! isset($_GET['api'])) {
		header('Location: ' . $webclientUrlbase . '/index.html?confighash=' . $hash, true, 301);
		die();
	}
}


?>