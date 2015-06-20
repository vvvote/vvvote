<?php

require_once 'connectioncheck.php';  // answers if &connectioncheck is part of the URL ans exists

header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, if-modified-since'); // this allows any cross-site scripting (needed for chrome)
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

// necassary to force the browser not to use the cached version - changes here will not arrive the voter otherwise
header("Pragma: no-cache");
/*
header("Expires: Sat, 01 Jan 2005 00:00:00 GMT");
header("Last-Modified: ".gmdate( "D, d M Y H:i:s")."GMT");
*/
header("Cache-Control: no-cache, must-revalidate");
header('Content-type: text/html; charset=utf-8');

$pathToClient = '../webclient/';

$includeJsFiles = Array(
		'tools/BigInt.js',
		'tools/rsa.js',
		'tools/sha256.js',
		'tools/filehandling.js',

		'exception.js',
		'tools/mixed.js',
		'tools/url.js',
		'config/config.js',
		'getelectionconfig.js',
		'listoferrors.js',
		'tools/ua-parser.js',
		
		'modules-auth/user-passw-list/module.js',
		'modules-auth/shared-passw/module.js',
		'modules-auth/oauth2/module.js',
		'modules-auth/external-token/module.js',
		'modules-election/blinded-voter/module.js',
		'modules-election/blinded-voter/module-backend.js',
		'modules-tally/publish-only/module.js',
		'modules-tally/configurable-tally/module.js',
		'page.js',
		'newelection.js',
		'vote.js',
		'getresult.js',


		/* Crypto-tool 
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

$includeCssFiles = Array('standard.css', 'substeps.css', 'working-animation.css');

// print HTML-Header 
echo '
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
				<title>VVVote</title>';

// print all Javascript files 
echo '<script>';
foreach ($includeJsFiles as $f) {
	readfile($pathToClient . $f);
	echo "\r\n";
}

// print placeholder for JSON permission file
echo "\n//placeholder for permission file\n";
echo "//bghjur56zhbvbnhjiu7ztgfdrtzhvcftzujhgfgtgvkjskdhvfgdjfgcfkdekf9r7gdefggdfklhnpjntt\n";
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
Der Wahlschein ist digital von mindestens 2 Servern unterschrieben. Diese Unterschrift führt dazu, dass der Wahlschein bei der Stimmabgabe akzeptiert wird.<br>
Der Wahlschein enthält eine eindeutige Wahlscheinnummer, die nur Ihr Computer kennt - sie wurde von Ihrem Computer erzeugt und verschlüsselt, bevor die Server den Wahlschein unterschrieben haben, und danach auf Ihrem Computer entschlüsselt (Man spricht von &quot;Blinded Signature&quot;). Die Server kennen daher die Wahlscheinnummer nicht.<br>
Man kann sich das so vorstellen:<br> 
Ihr Computer schreibt auf den Wahlschein die Wahlscheinnummer, die er sich selbst &quot;ausdenkt&quot; (Zufallszahl). Dieser Wahlschein wird zusammen mit einem Blatt Kohlepapier in einen Umschlag gelegt und an den Server geschickt. 
Der Server unterschreibt außen auf dem Umschlag (wenn Sie wahlberechtigt sind), so dass sich die Unterschrift durch das Kohlepapier auf Ihren Wahlschein überträgt. Ohne den Umschlag geöffnet zu haben (was der Server nicht kann, weil er den dafür notwendigen Schlüssel nicht kennt), schickt er den Brief an Ihren Computer zurück.
Ihr Computer öffnet den Umschlag (d.h. entschlüsselt die Wahlscheinnummer) und hält einen vom Server unterschriebenen Wahlschein in der Hand, deren Nummer der Server nicht kennt.  
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
	<fieldset><legend>Abstimmen über</legend>
		<input type="radio" id="givenTest"     name="testRadioGroup" onclick="page.setQuestions('givenTest')"    /> <label for="givenTest"    >Voreingestellte Testabstimmungen</label>
		<input type="radio" id="enterQuestion" name="testRadioGroup" onclick="page.setQuestions('enterQuestion')"/> <label for="enterQuestion">Eine Frage zur Abstimmung eingeben</label>
	</fieldset>
	<div id="questionInputs">
	<!--- in this div the inputs for different tallies will be inserted --->
	</div>
		
	<fieldset onload="page.setAuthMethod('sharedPassw');">
		<legend>Autorisierungsmethode</legend>
		<input type="radio" onclick="page.setAuthMethod('sharedPassw', null);"   name="authMethod" id="sharedPassw">
			<label for="sharedPassw">Abstimmungspasswort</label>
		<input type="radio" onclick="page.setAuthMethod('externalToken', null);"  name="authMethod" id="externalToken">
			<label for="externalToken">Externe Tokenabfrage</label>
		
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
		
	function checkBrowser() {
		var parser = new UAParser(); 
		var browser = parser.getBrowser();
		var os = parser.getOS().name.toUpperCase();
		var browsName = browser.name.toUpperCase();
		if (!(   (browsName.indexOf('FIREFOX')>= 0) // as creating the return envelope cannot be retried, make sure only tested browsers are used 
			  || (browsName.indexOf('CHROME') >= 0) // chrome in android actually works, but the saved returnEnvelope is very hard to open whereas this is no problem in firefox for android 
			  || (browsName.indexOf('OPERA')  >= 0) 
			  || (browsName.indexOf('IE')     >= 0)
		   ) ) {
			showPopup(html2Fragm('Ihr Browser ' + browsName + ' ' + browser.major + ' wird nicht unterstützt. Bitte verwenden Sie FireFox ab Version 21, Chrome ab Version 38 (nicht auf Android) oder den InternetExplorer ab Version 11.'));
		} else { // check browser version
			if (   (browsName.indexOf('SAFARI') >=0 ) // safari 5: everything is working but saving the return envelope 
				|| (browsName.indexOf('FIREFOX')>= 0 && browser.major < 21)		
				|| (browsName.indexOf('CHROME') >= 0 && (browser.major < 38 || os.indexOf('ANDROID') >= 0)) // chrome in android actually works, but the saved returnEnvelope is very hard to open whereas this is no problem in firefox for android		
				|| (browsName.indexOf('OPERA')  >= 0 && browser.major < 11)		
				|| (browsName.indexOf('IE')     >= 0 && browser.major < 11)		
			   ) {
				showPopup(html2Fragm('Ihr Browser ' + browsName + ' ' + browser.major + ' wird nicht unterstützt. Bitte verwenden Sie FireFox ab Version 21, Chrome ab Version 38 (nicht auf Android) oder den InternetExplorer ab Version 11.'));
			}
		}
	}

	function checkBrowserReturnEnvelope() {
		var parser = new UAParser(); 
		var browser = parser.getBrowser(); // this check is more for convinience in order to avoid user retry and frustration
		if (   (browser.name.toUpperCase().indexOf('SAFARI') >= 0 && browser.major <  5)  // safari 5: everything is working but saving the return envelope 
			|| (browser.name.toUpperCase().indexOf('FIREFOX')>= 0 && browser.major < 21)		
			|| (browser.name.toUpperCase().indexOf('CHROME') >= 0 && browser.major < 38)		
			|| (browser.name.toUpperCase().indexOf('OPERA')  >= 0 && browser.major < 11)		
			|| (browser.name.toUpperCase().indexOf('IE')     >= 0 && browser.major < 11)		
		   ) {
			showPopup(html2Fragm('Ihr Browser ' + browsName + ' ' + browser.major + ' wird nicht unterstützt. Bitte verwenden Sie FireFox ab Version 21, Chrome ab Version 38 (nicht auf Android) oder den InternetExplorer ab Version 11.'));
		}
	}
		
	function onWebsiteLoad() {
		page.display();
		if (location.search.length > 1 && typeof firstload == 'undefined' && location.search.indexOf('confighash') >= 0) {
			firstload = false;
			// do not show the "new election" menu if confighash is set in url
			var el = document.getElementById('newElectionLink');
			el.setAttribute('style', 'display:none');
			
			if (location.search.indexOf('showresult') >=0) page = getResultPage;
			else                                           page = votePage; // TODO read phase from config and
		    page.display();
	    	 // var me = this;
			 // new GetElectionConfig(a.value, null, me, me.onGotElectionConfig);
	        GetElectionConfig.submitForm();
	    	// TODO read phase from config and load votePage(generatePermssion), votePage(submitVote), getresult()
		}
		if ('returnEnvelope' in window) { // this is the return envelope
			 checkBrowserReturnEnvelope();
			 // do not show the "new election" menu in return envelope
			 var el = document.getElementById('newElectionLink');
			 el.setAttribute('style', 'display:none');

			 // switch to vote page - it is the default page anyway
	    	 //  page = votePage; 
		     //  page.display();
		     
		     // load the config and show the options
		     // votePage.display automatically checks if returnEnvelope is set
		    // BlindedVoterElection.onImportPermission(returnEnvelope);
		} else {
			checkBrowser();
		}
	} 
				
</script>

</head>

<body onload="onWebsiteLoad(); onToggleTechInfosSwitch(); //startVoting(true); //test();" onClick="// rng_seed_time(); // better random" onKeyPress="// rng_seed_time(); // better random">
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
			 <a id="newElectionLink" href="javascript:page = newElectionPage; page.display(); // handleNewElection();"  >Neue Abstimmung anlegen</a> &nbsp;&nbsp;&nbsp;
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
