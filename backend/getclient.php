<?php

require_once 'connectioncheck.php';  // answers if &connectioncheck is part of the URL ans exists

header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"); // this allows any cross-site scripting (needed for chrome)

$pathToClient = '../webclient/';

$includeJsFiles = Array(
		'tools/BigInt.js',
		'tools/rsa.js',
		'tools/sha256.js',
		'tools/filehandling.js',

		'config/config.js',
		'exception.js',
		'tools/mixed.js',
		'tools/url.js',
		'getelectionconfig.js',
		'listoferrors.js',

		'modules-auth/user-passw-list/module.js',
		'modules-auth/shared-passw/module.js',
		'modules-auth/oauth2/module.js',
		'modules-election/blinded-voter/module.js',
		'modules-election/blinded-voter/module-backend.js',
		'modules-tally/publish-only/module.js',
		'modules-tally/configurable-tally/module.js',
		'page.js',
		'newelection.js',
		'vote.js',
		'getresult.js',


		/* Crypto-tool */
		'tools/jsrsasign-master/ext/jsbn.js',
		'tools/jsrsasign-master/ext/jsbn2.js',
		'tools/jsrsasign-master/ext/prng4.js',
		'tools/jsrsasign-master/ext/rng.js',
		'tools/jsrsasign-master/ext/rsa.js',
		'tools/jsrsasign-master/ext/rsa2.js',
		'tools/jsrsasign-master/ext/base64.js',

		// geprüft, sind notwendig ######## es wird eval() verwendet #########
		#base64: wegen rstring2hex() -->
		'tools/jsrsasign-master/base64x-1.1.js',
		'tools/jsrsasign-master/crypto-1.1.js',
		'tools/jsrsasign-master/core.js',
		'tools/jsrsasign-master/sha256.js',

		'tools/jsrsasign-master/rsasign-1.2.js',
		/* Crypto-tool Ende */
);

$includeCssFiles = Array('standard.css', 'substeps.css');

// print HTML-Header 
echo '
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="ISO-8859-1">
				<title>VVVote</title>';

// print all Javascript files 
echo '<script>';
foreach ($includeJsFiles as $f) {
	readfile($pathToClient . $f);
}

// print placeholder for JSON permission file
echo "\n//placeholder for permission file\n";
echo "//bghjur56zhbvbnhjiu7ztgfdrtzhvcftzujhgfgtgvkjskdhvfgdjfgcfkdekf9r7gdefggdfklhnpßjntt\n";
echo '</script>';

// print stylesheets
echo '<style type="text/css">';
foreach ($includeCssFiles as $f) {
	readfile($pathToClient . $f);
}
echo '</style>';



// print the main content take from index.html - logo125x149.svg is included somewhere in the middle of the following text 
echo <<<EOT
<script>
/**
 * shows/hides the additional technical info div
 */
		function onToggleTechInfosSwitch() {
			var el=document.getElementById('techinfocheckbox');
			var el2=document.getElementById('techinfos');
			if (el.checked) {
				el2.style.display='';
			} else {
				el2.style.display='none';
			}
		}
</script>

<!-- the following "<script>" is used as heredoc replacement -->
<script  id="authUserPasswHtml" type="mumpiz">
<div id="auth">
	<form name="permission" method="post" onsubmit="return false;">
		<div align="center">
			<br>
			<table>
				<tr>
					<td>
						<table>
							<tr>
								<td>&nbsp;</td>
								<td align=right><font color=black> <b>ElectionId:</b>
								</font></td>
								<td><input name=electionId value=""></td>
								<td>&nbsp;</td>
							</tr>
							<tr>
								<td>&nbsp;</td>
								<td align=right><font color=black> <b>VoterId:</b>
								</font></td>
								<td><div id="divvoterid">
										<input name="voterId" id="voterId" value="">
									</div></td>
								<td>&nbsp;</td>
							</tr>
							<tr>
								<td>&nbsp;</td>
								<td align=right><b>Secret:</b></td>
								<td><input name="secret" id="secret" value="" type="password"></td>
								<td>&nbsp;</td>
							</tr>
							<tr>
								<td>&nbsp;</td>
								<td>&nbsp;</td>
								<td><input type="submit" name=reqPermiss
									value="Request ballot" onclick="onGetPermClick();"></td>
								<td>&nbsp;</td>
						</table>
					</td>
				</tr>
			</table>
		</div>
	</form>
<p><h2>Weitere technische Information</h2><br>
Der Wahlzettel ist digital von mindestens 2 Servern unterschrieben. Diese Unterschrift führt dazu, dass der Wahlzettel bei der Stimmabgabe akzeptiert wird.<br>
Der Wahlzettel enthält eine eindeutige Wahlzettelnummer, die nur Ihr Computer kennt - sie wurde von Ihrem Computer erzeugt und verschlüsselt, bevor die Server den Wahlzettel unterschrieben haben, und danach auf Ihrem Computer entschlüsselt (Man spricht von &quot;Blinded Signature&quot;). Die Server kennen daher die Wahlzettelnummer nicht.<br>
Man kann sich das so vorstellen:<br> 
Ihr Computer schreibt auf den Wahlzettel die Wahlzettelnummer, die er sich selbst &quot;ausdenkt&quot; (Zufallszahl). Dieser Wahlzettel wird zusammen mit einem Blatt Kohlepapier in einen Umschlag gelegt und an den Server geschickt. 
Der Server unterschreibt außen auf dem Umschlag (wenn Sie wahlberechtigt sind), so dass sich die Unterschrift durch das Kohlepapier auf Ihren Wahlzettel überträgt. Ohne den Umschlag geöffnet zu haben (was der Server nicht kann, weil er den dafür notwendigen Schlüssel nicht kennt), schickt er den Brief an Ihren Computer zurück.
Ihr Computer öffnet den Umschlag (d.h. entschlüsselt die Wahlzettelnummer) und hält einen vom Server unterschriebenen Wahlzettel in der Hand, deren Nummer der Server nicht kennt.  
</p>
</div>
</script>


<!-- the following "<script>" is used as heredoc replacement -->
<script  id="newElectionHtmlPre" type="mumpiz">
	
	Hier k&ouml;nnen Sie eine neue Abstimmung starten.     
    Zum Anlegen einer neuen Abstimmung legen Sie den Namen der Abstimmung und die Authorisierungsmethode fest. 
	<br><br>
	<input type="text" id="electionId"> 
    	<label for="electionId">Name der Abstimmung</label> 
 	<br>
	<fieldset onload="page.setAuthMethod('sharedPassw');">
		<legend>Autorisierungsmethode</legend>
		<input type="radio" onclick="page.setAuthMethod('sharedPassw', null);"   name="authMethod" id="sharedPassw">
			<label for="sharedPassw">Abstimmungspasswort</label>

 <!---   	<input type="radio" onclick="page.setAuthMethod('userPasswList', null);" name="authMethod" id="userPasswList">
			<label for="userPasswList">Liste Benuzername und Passwort hochladen</label></input>
--->
</script>
		
<!-- the following "<script>" is used as heredoc replacement -->
<script  id="newElectionHtmlPost" type="mumpiz">
    </fieldset>
	<br>
	<div id="authInputs">
	<!--- in this div the different inputs needed for the different auth methods are displayed --->
	</div>
	<br>
	<input type="button" onclick="page.handleNewElectionButton();" value="Neue Abstimmung anlegen">		
</script>

<script type="text/javascript">
	// var maincontent = '<object type="text/html" width="800" height="700" data="modules-auth/user-passw-list/module.html"></object>'; 
	// var maincontent = '<object type="text/html" width="800" height="700" data="getelectionconfig.html"></object>';
	
	var element = document.getElementById('newElectionHtmlPre'); // heredoc replacement
	newElectionHtmlPre = element.innerHTML;
	var element = document.getElementById('newElectionHtmlPost'); // heredoc replacement
	newElectionHtmlPost = element.innerHTML;

	
	function userlog(log) {
	  var element = document.getElementById('logtextarea'); 
	  element.value = element.value + log;
	}

	// var maincontent = ''; //GetElectionConfig.getMainContent();
	// maincontent = startVoting();
	
	var newElectionPage = new NewElectionPage();
	var votePage        = new VotePage();
	var getResultPage   = new GetResultPage();
	
	var page = votePage;
	
	function onWebsiteLoad() {
		page.display();
		if (location.search.length > 1 && typeof firstload == 'undefined') {
			firstload = false;
	    	 page = votePage; // TODO read phase from config and
		     page.display();
	    	 GetElectionConfig.submitForm();
	    	// TODO read phase from config and load votePage(generatePermssion), votePage(submitVote), getresult()
		}
		if (permission) {
	    	 page = votePage; // TODO read phase from config and
		     page.display();
		     BlindedVoterElection.onImportPermission(permission);
		}
	} 
		
</script>

</head>

<body onload="onWebsiteLoad(); onToggleTechInfosSwitch(); //startVoting(true); //test();" onClick="rng_seed_time(); // better random" onKeyPress="rng_seed_time(); // better random">
	<div id="errorDiv" style="display:none"></div>
	<!--  <div id="diagnosisControlDiv" style="display:none"></div>   -->
	<div id="all">
		<div id="ci">
		<div id="logoimg">
EOT;



readfile($pathToClient . 'logo125x149.svg');



echo <<<EOT
		</div>
			<h1>VVVote</h1>
			Online Wahl: Anonyme und nachvollziehbare Abstimmungen (in Entwicklung)
		</div>

		<div id="nav">
			 <a href="javascript:page = newElectionPage; page.display(); // handleNewElection();"  >Neue Abstimmung anlegen</a> &nbsp;&nbsp;&nbsp;
			 <a href="javascript:page = votePage;        page.display(); // startVoting(true);"    >An Abstimmung teilnehmen</a> &nbsp;&nbsp;&nbsp; 
			 <a href="javascript:page = getResultPage;   page.display(); // startLoadingResult();" >Abstimmunsergebnis abrufen</a>
		</div>

		<div id="steps">
			<h1>Vorgehensweise</h1>
			<ul id="stepslist">
				<li><span id="step1" class="curr">Schritt 1: Wahlunterlagen holen</span></li>
				<li><span id="step2">Schritt 2: Autorisierung</span></li>
				<li><span id="step3"><a onclick="startStep3();">Schritt 3: Stimme abgeben</a></span></li>
				<li><span id="step4"><a onclick="startStep4();">Schritt 4: Abstimmungsergebnis holen</a></span></li>
			</ul>

		</div>
		<div id="maincontent">
			<h1 id="pagetitle">An Abstimmung teilnehmen</h1>
			<h2 id="steptitle">Schritt 1: Wahlunterlagen holen</h2>
			<!-- this div is replaced by the html of the according auth-module -->
			<div id="loadedmaincontent">
			<script type="text/javascript">
				document.write('');
			</script>
			</div>
		</div>
		<div id="techinfosswitch">
		<input type="checkbox" name="techinfocheckbox" id="techinfocheckbox" value="techinfocheckbox" onclick="onToggleTechInfosSwitch();">
		<label for="techinfocheckbox">Technische Informationen/Erkl&auml;rungen anzeigen</label></div>
		<div id="techinfos" style="display:none;">
		<div id="additiontechinfos"></div>
		<div id="log">
			<h1>Log:</h1>
			<textarea id="logtextarea" name="log"></textarea>

		</div>
		</div>
	</div>
</body>
</html>

EOT;
