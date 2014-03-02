<?php

require_once '../../config/conf-allservers.php';
require_once '../../config/conf-thisserver.php';

require_once '../../exception.php';
require_once 'fetchfromoauthserver.php';

// config
// $acc_url = 'https://beoauth.piratenpartei-bayern.de/oauth2/token/'; // URL for fetching the access token
// $authurl = 'https://beoauth.piratenpartei-bayern.de/oauth2/authorize/'; // URL to be opened on the voters web browser asking to login and authorization
// append to this URL: //?scope=member&state=BEO+Bayern.12345&redirect_uri=https://abstimmung.piratenpartei-nrw.de/backend/modules-auth/oauth/callback.php&response_type=code&client_id=vvvote';


require_once 'client.php';
require_once 'GrantType/IGrantType.php';
require_once 'GrantType/AuthorizationCode.php';

require_once 'dbAuth.php';

use nsOAuth2\Client;


print "<!DOCTYPE html>\n<html>\n";
print "<head>\n<meta charset=\"ISO-8859-1\">\n";
if (strpos($webclientUrlbase, "http") === 0) $pathwebclient = $webclientUrlbase ; // absolute path given
else                                         $pathwebclient = '../../' . $webclientUrlbase;
print "<style type=\"text/css\">\n";
print '@import url("' . $pathwebclient . '/standard.css' .'");\n';
print "</style>";
print '
<script>
/**
 * shows/hides the additional technical info div
 */
		function onToggleTechInfosSwitch() {
			var el=document.getElementById("techinfocheckbox");
			var el2=document.getElementById("techinfos");
			if (el.checked) {
				el2.style.display="";
			} else {
				el2.style.display="none";
			}
		}
</script>
		';

function printTitle($headertitle, $h1) {
	global $pathwebclient;
	print "<title>$headertitle</title>";
	print '</head><body>';
	echo '
		<div id="all">
			<div id="ci">
				<img id="logoimg" alt="Logo" src="' . $pathwebclient . '/logo125x149.svg" align="left">
				<h1>VVVote</h1>
				Online Wahl: Anonyme und nachvollziehbare Abstimmungen
			</div>
		<div id="maincontent">
		';
	print '<h1 id="pagetitle">' . $h1 . '</h1>';
}

function printTechInfos($techinfos) {
	echo '
				<br><button onClick="window.close();">Fenster schlie&szlig;en</button>
			</div>
			<div id="techinfosswitch">
				<input type="checkbox" name="techinfocheckbox" id="techinfocheckbox" value="techinfocheckbox" onclick="onToggleTechInfosSwitch();">
				<label for="techinfocheckbox">Technische Informationen/Erkl&auml;rungen anzeigen</label>
			</div>
			<div id="techinfos" style="display:none;">'
				. $techinfos . '
			</div>
		</body>';
}



if (!isset($_GET['code'])) {
	// TODO better error handling / better text
	printTitle('VVVote: Error', 'Keine Autorisierungsdaten &uuml;bermittelt. Login fehlgeschlagen.');
	printTechInfos('URL-request-parameter >code< not set');
	die();
} else {
	if (!isset($_GET['state'])) {
		printTitle('VVVote: Error', 'Daten zur Zuordnung der Anfrage fehlen.');
		printTechInfos('URL-request-parameter >state< ist nor set.');
		die();
	}
	$state = explode('.', $_GET['state']);
	if (count($state) != 3) {
		printTitle('VVVote: Error', 'Daten zur Zuordnung der Anfrage fehlen.');
		printTechInfos('URL-request-parameter >state< does not contain two dots: >' . $_GET['state']);
		die();
	} else {
		//	print "<br>$oauthdata";
		//	print_r($oauthdata);
		$serverId     = $state[0];
		$electionhash = $state[1];
		$tmpsecret    = $state[2];
		$curOAuth2Config = $oauthConfig[$serverId];

		print '<title>VVVote: Login erfolgreich</title>';
		print '</head><body>';


		//	print "<br><br>\ncurConfig: ";
		//	print_r($curConfig);
		$client = new nsOAuth2\Client($curOAuth2Config['client_id'], $curOAuth2Config['client_secret']);
		$params = array('code' => $_GET['code'], 'redirect_uri' => $curOAuth2Config['redirect_uri']);
		$response = $client->getAccessToken($curOAuth2Config['token_endp'], 'authorization_code', $params);
		//	print "<br><br>\nresponse: ";
		//	print_r($response);
		//	parse_str($response['result'], $info);
		if (isset($response['error']) || $response['code'] != '200') {
			// TODO better error message
			printTitle('VVVote: Login fehlgeschlagen', 'Autorisierung dieser Anwendung fehlgeschlagen.');
			print 'M&ouml;gliche Ursachen:<br>';
			print '<ul>
						<li>Wenn die Autorisierung urspr&uuml;nglich geklappt hatte und Sie bei dieser Seite lediglich auf &quot;Neu Laden&quot; gedr&uuml;ckt haben, dann gilt vermutlich die alte Autorisierung weiterhin. Schlie&szlig;en Sie einfach dieses Fenster.</li>
						<li>Anonsten schlie&szlig;en Sie dieses Fenster und loggen sich erneut beim Basisentscheid-Server ein.</li>
					</ul>';
			
			$techinfos = 
			'<br>client_id: >' . 	$curOAuth2Config['client_id'] . '<' .
			'<br>client_secret: >' .$curOAuth2Config['client_secret'] . '<' . 
			'<br>code: >' . 		$_GET['code'] . '<' .
			'<br>redirect_uri: >' . $curOAuth2Config['redirect_uri'] . '<' .
			'<br>token_endp: >' . 	$curOAuth2Config['token_endp'] . '<' .
			'<br>params: >' . print_r($params, true) . '<' .
			'<br>response: >' . print_r($response, true) . '<';
			printTechInfos($techinfos);		
			die();
		}
		// print_r($response);
		$tokeninfos = $response['result'];
		//	print "<br><br>\info: ";
		// print_r($tokeninfos);
		$client->setAccessToken($tokeninfos);
		$now =  new DateTime('now');

		$fetcher = new FetchFromOAuth2Server($state[0], $tokeninfos);
		$auid        = $fetcher->fetchAuid();
		$userProfile = $fetcher->fetchUserProilfe();
		$username  = $userProfile['username'];
		
		global $dbInfos;
		$oAuthDb = new DbOAuth2($dbInfos);
		$oAuthDb->saveAuthData($electionhash, $serverId, $tmpsecret, $auid, $username, $tokeninfos, $now->format(DateTime::ATOM));
		
		if (isset($userProfile['public_id'])) $public_id = $userProfile['public_id'];
		else                                  $public_id = '';
		if ($public_id == '') 	$h1 = 'Hallo,';
		else 					$h1 = 'Hallo ' . $public_id .',';
		printTitle('VVVote: Login erfolgreich', $h1);
		
		print 	'<br> '.
				'<ul>' .
				'	<li>Ihr Login war erfolgreich und der Abstimmserver &gt;' . $serverkey['serverName'] . '&lt; ist nun berechtigt, ' .
						'Ihre Wahlberechtigung abzufragen.</li>' .
				'	<li>Ihre Wahlberechtigung wurde noch nicht gepr&uuml;ft. Sie wird erst gepr&uumlft, wenn Sie im ursp&uuml;nglichen Fenster auf &quot;Wahlschein erzeugen&quot; klicken.</li>' .
				'	<li>Schlie&szlig;en Sie jetzt dieses Fenster</li>' .
				'</ul>';
								
		// print '<ul><li>Schlie&szlig;en Sie jetzt dieses Fenster</li>';
		// print '    <li>Anschlie&szlig;end:</li>';
		// print '<ul><li>Wenn Sie noch nicht erfolgreich f&uuml;r den anderen Abstimmserver eingeloggt haben, klicken Sie in dem urspr&uuml;nglichen Fenster auf den Link zum Login f&uuml;r den anderen Abstimmungsserver</li>';
		// print '<li>Wenn Sie sich bereits f&uuml;r beide Abstimmserver eingeloggt haben, klicken Sie in dem urspr&uuml;nglichen Fenster auf den Knopf &quot;Wahlschein holen&quot;.</li></ul></ul>';


		//print '<br>isInVoterlist from fetch: ' . ($fetcher->isInVoterList('d94b915b-db13-4264-890c-0780692e4998') ? 'true' : 'false');

		$techinfos = 
			'<br><h2>Informationen zum Datenschutz</h2>' .
			'<br>Folgende pers&ouml;nliche Daten wurden auf diesem Abstimmserver gespeichert:' .
			'<ul>' .
				'<li>Ihr Username beim Basisentscheid-Server</li>' .
				'<li>Eine Ziffernfolge, die Sie eindeutig identifiziert: ' . $auid . '</li>' .
				'<li>Geheime Zugangsdaten, die es dem Server erm&ouml;glichen, Ihre Wahlberechtigung beim Basisentscheid-Server abzufragen.</li>' .
			'</ul>';
		printTechInfos($techinfos);
		/*
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


		print '<big><u>Login für Abstimmungsserver 1 erfolgreich.</u></big>';
		print '<ul><li>Schlie&szlig;en Sie jetzt dieses Fenster und </li>';
		print '    <li>klicken Sie in dem urspr&uuml;nglichen Fenster auf den Knopf zum Login für Abstimmungsserver 2</li></ul>';
		print '<button onClick="window.close();">Fenster schlie&szlig;en</button>';

		$ret = array(
				'usernanme' => $userprofile['result']['username'],
				'auid'      => $membership['result']['auid'],
				'mayvote'   => $mayvoteBoolean
		);


		//	$db = new DbOAuth2($dbInfos);
		//	$db->saveAuthData($electionhash, $serverId, $tmpsecret, $username, $authInfos, $now);

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

		*/

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
		*/
	}
}


?>