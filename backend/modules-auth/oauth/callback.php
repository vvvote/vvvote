<?php

use OAuth2\Client;
require_once '../../config/conf-allservers.php';
require_once '../../config/conf-thisserver.php';
require_once '../../exception.php';

// config
// $acc_url = 'https://beoauth.piratenpartei-bayern.de/oauth2/token/'; // URL for fetching the access token
// $authurl = 'https://beoauth.piratenpartei-bayern.de/oauth2/authorize/'; // URL to be opened on the voters web browser asking to login and authorization
// append to this URL: //?scope=member&state=BEO+Bayern.12345&redirect_uri=https://abstimmung.piratenpartei-nrw.de/backend/modules-auth/oauth/callback.php&response_type=code&client_id=vvvote';


require 'client.php';
require 'GrantType/IGrantType.php';
require 'GrantType/AuthorizationCode.php';


// $client = new OAuth2\Client(CLIENT_ID, CLIENT_SECRET);
if (!isset($_GET['code']))
{
	$auth_url = $client->getAuthenticationUrl(AUTHORIZATION_ENDPOINT, REDIRECT_URI);
	header('Location: ' . $auth_url);
	die('Redirect');
}
else
{
	$oauthdata = explode('.', $_GET['state'], 2); // TODO test if set -> error handling
	if (count($oauthdata) < 3) {
		// TODO error handling
	}
	//	print "<br>$oauthdata";
	//	print_r($oauthdata);
	$curConfig = $oauthConfig[$oauthdata[0]];
	// unescpe '..' to '.'
	$i = 1; $next = true;
	while ($next && $i < count($oauthdata)) {
		$electionId = $oauthConfig[$oauthdata[$i]];
		if (strlen($oauthdata[$i]) == 0) {
			$electionId = $electionId . '.';
			$next = true;
		} else {
			$next = false;
		}
		$i++;
	}
	$tmpsecret = $oauthdata[$i];
	//	print "<br><br>\ncurConfig: ";
	//	print_r($curConfig);
	// TODO write $oauthdata[0] and $oauthdata[1] into a database
	$client = new OAuth2\Client($curConfig['client_id'], $curConfig['client_secret']);
	$params = array('code' => $_GET['code'], 'redirect_uri' => $curConfig['redirect_uri']);
	$response = $client->getAccessToken($curConfig['token_endp'], 'authorization_code', $params);
	//	print "<br><br>\nresponse: ";
	//	print_r($response);
	//	parse_str($response['result'], $info);
	$tokeninfos = $response['result'];
	//	print "<br><br>\info: ";
	print_r($tokeninfos);
	$client->setAccessToken($tokeninfos);

	$membership = $client->fetch($curConfig['get_membership_endp'], Array(), Client::HTTP_METHOD_POST);
	print "<br><br>\nresponse 2: ";
	print_r($membership);


	$userprofile = $client->fetch('https://beoauth.piratenpartei-bayern.de/api/self/profile/', $params, Client::HTTP_METHOD_POST);
	print "<br><br>\nresponse 3: ";
	print_r($userprofile);

	$mayvote = $client->fetch($curConfig['may_vote_endp'] . 'd94b915b-db13-4264-890c-0780692e4998' .'/', Array(), Client::HTTP_METHOD_POST);
	print "<br><br>\may vote: ";
	print_r($mayvote);
	$now = new DateTime(null, null);
	print "<h1>Ergebnisse</h1>";
	print '<br>auid: ' . $membership['result']['auid'];
	print '<br>Access Token: ' . print_r($tokeninfos, true);
	print "<br>BEO-Username: " . $userprofile['result']['username'];
	print '<br>temp secret: ' . $tmpsecret;
	print '<br>Election Id: ' . $electionId;
	print "<br>BEO-Anzeigename: " . $userprofile['result']['public_id'];
	print ('<br>Mitglied der Piratenpartei: ' . $membership['result']['type'] . ', überprüft: ' . $membership['result']['verified']);
	print "<br>jetzt: " . $now->format(DateTime::ATOM);
	// var_dump($response, $response['result']);
}


/*
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
*/

?>