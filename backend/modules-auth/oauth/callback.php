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

// TODO remove this and put it in the conf-this-server
$oauthConfig['is_in_voter_list_endp'] = 'https://beoauth.piratenpartei-bayern.de/api/self/listmember/';

// $client = new OAuth2\Client(CLIENT_ID, CLIENT_SECRET);
if (!isset($_GET['code']))
{
	$auth_url = $client->getAuthenticationUrl(AUTHORIZATION_ENDPOINT, REDIRECT_URI);
	header('Location: ' . $auth_url);
	die('Redirect');
}
else
{
	$state = explode('.', $_GET['state']); // TODO test if set -> error handling
	if (count($state) < 3) {
		// TODO error handling
	}
	//	print "<br>$oauthdata";
	//	print_r($oauthdata);
	$curOAuth2Config = $oauthConfig[$state[0]];
	/*
	 // unescpe '..' to '.'
	$i = 1; $next = true;
	while ($next && $i < count($state)) {
	$electionId = $oauthConfig[$state[$i]];
	if (strlen($state[$i]) == 0) {
	$electionId = $electionId . '.';
	$next = true;
	} else {
	$next = false;
	}
	$i++;
	}
	*/

	$electionhash = $state[1];
	$tmpsecret = $state[2];
	//	print "<br><br>\ncurConfig: ";
	//	print_r($curConfig);
	// TODO write $oauthdata[0] and $oauthdata[1] into a database
	$client = new OAuth2\Client($curOAuth2Config['client_id'], $curOAuth2Config['client_secret']);
	$params = array('code' => $_GET['code'], 'redirect_uri' => $curOAuth2Config['redirect_uri']);
	$response = $client->getAccessToken($curOAuth2Config['token_endp'], 'authorization_code', $params);
	//	print "<br><br>\nresponse: ";
	//	print_r($response);
	//	parse_str($response['result'], $info);
	$tokeninfos = $response['result'];
	//	print "<br><br>\info: ";
	print_r($tokeninfos);
	$client->setAccessToken($tokeninfos);
	
	$fetcher = new FetchFromOAuth2Server($state[0], $tokeninfos);
	print '<br>username from fetch: ' . $fetcher->fetchUsername();
	print '<br>auid from fetch: ' . $fetcher->fetchAuid();
	print '<br>isInVoterlist from fetch: ' . $fetcher->isInVoterList('d94b915b-db13-4264-890c-0780692e4998');
	
	$membership = $client->fetch($curOAuth2Config['get_membership_endp'], Array(), Client::HTTP_METHOD_POST);
	print "<br><br>\nresponse 2: ";
	print_r($membership);


	$userprofile = $client->fetch('https://beoauth.piratenpartei-bayern.de/api/self/profile/', $params, Client::HTTP_METHOD_POST);
	print "<br><br>\nresponse 3: ";
	print_r($userprofile);
	$listId = 'd94b915b-db13-4264-890c-0780692e4998';
	$mayvote = $client->fetch($curOAuth2Config['is_in_voter_list_endp'] . $listId .'/', Array(), Client::HTTP_METHOD_POST);
	print "<br><br>\may vote: ";
	print_r($mayvote);
	$mayvoteBoolean = ($mayvote['result']['list'] === $listId && $mayvote['result'] == 1);
	$now =  new DateTime('now');


	print ("<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"ISO-8859-1\">");
	print ('<title>VVVote: Login erfolgreich</title>');
	print ('</head><body>');
	print ('<big><u>Login für Abstimmungsserver 1 erfolgreich.</u></big>');
	print ('<ul><li>Schlie&szlig;en Sie jetzt dieses Fenster und </li>');
	print ('    <li>klicken Sie in dem urspr&uuml;nglichen Fenster auf den Knopf zum Login für Abstimmungsserver 2</li></ul>');
	print ('<button onClick="window.close();">Fenster schlie&szlig;en</button>');

	$ret = array(
			'usernanme' => $userprofile['result']['username'],
			'auid'      => $membership['result']['auid'],
			'mayvote'   => $mayvoteBoolean
	);

	print "<h1>Ergebnisse</h1>";
	print '<br>auid: ' . $membership['result']['auid'];
	print '<br>Access Token: ' . print_r($tokeninfos, true);
	print "<br>BEO-Username: " . $userprofile['result']['username'];
	print '<br>Election config hash: ' . $electionhash;
	print '<br>temp secret: ' . $tmpsecret;
	print "<br>BEO-Anzeigename: " . $userprofile['result']['public_id'];
	print ('<br>Mitglied der Piratenpartei: ' . $membership['result']['type'] . ', überprüft: ' . $membership['result']['verified']);
	print "<br>jetzt: " . $now->format(DateTime::ATOM);
	print ('</body>');
	// var_dump($response, $response['result']);
}

class FetchFromOAuth2Server {

	function __construct($serverId, $authInfos) {
		//$this->serverId = $serverId;
		//$this->authInfos = $authInfos;
		$this->curOAuth2Config =  $oauthConfig[$serverId];
		$this->client = new OAuth2\Client($this->curOAuth2Config['client_id'], $this->curOAuth2Config['client_secret']);
		$client->setAccessToken($authInfos);
		// $this->params = array('redirect_uri' => $curOAuth2Config['redirect_uri']); // $params = array('code' => $_GET['code'], 'redirect_uri' => $curOAuth2Config['redirect_uri']);
	}

	function fetchUsername() {
		$userprofile = $this->fetch($this->curOAuth2Config['get_profile_endp']);
		return $userprofile['result']['username'];
	}

	function fetchAuid() {
		$membership = $this->fetch($this->curOAuth2Config['get_membership_endp']);
		return $membership['result']['auid'];
	}

	function isInVoterList($listId) {
		$inVoterlist = $this->fetch($this->$curOAuth2Config['is_in_voter_list_endp'] . $listId .'/');
		$inVoterlistBoolean = ($inVoterlist['result']['list'] === $listId && $inVoterlist['result'] == 1);
		return $inVoterlistBoolean;
	}


	function fetch($endpoint) {
		return $this->client->fetch($endpoint, Array(), Client::HTTP_METHOD_POST);
	}
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