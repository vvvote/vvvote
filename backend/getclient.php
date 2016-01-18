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
		'tools/textencoder.js',
		
		'exception.js',
		'tools/mixed.js',
		'tools/url.js',
		'config/config.js',
		'getelectionconfig.js',
		'listoferrors.js',
		'tools/ua-parser.js',

		'tools/jed.js',
		'i18n/vvvote_de.js',
		'i18n/vvvote_en_US.js',
		'i18n/vvvote_fr.js',
		'tools/i18n.js',
		
		'modules-auth/user-passw-list/module.js',
		'modules-auth/shared-passw/module.js',
		'modules-auth/oauth2/module.js',
		'modules-auth/external-token/module.js',
		'modules-election/blinded-voter/module.js',
		'modules-election/blinded-voter/module-backend.js',
		'modules-tally/publish-only/transportencryption.js',
		'modules-tally/publish-only/module.js',
		'modules-tally/configurable-tally/module.js',
		'page.js',
		'newelection.js',
		'vote.js',
		'getresult.js',
		
		'index.js'

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
$output_as_javascript = true; // interpreted by getpublicserverkeys.php
foreach ($includeJsFiles as $f) {
	if ($f == 'config/config.js') { // insert server infos immedeately in front of config.js
		include 'getserverinfos.php';
	}
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
			<p id="ciSubHead"></p>
		</div>

		<div id="nav">
			 <a id="newElectionLink" href="javascript:page = newElectionPage; page.display(); // handleNewElection();"  >Neue Abstimmung anlegen</a> &nbsp;&nbsp;&nbsp;
			 <a id="takepartLink"    href="javascript:page = votePage;        page.display(); // startVoting(true);"    >An Abstimmung teilnehmen</a> &nbsp;&nbsp;&nbsp; 
			 <a id="fetchresult"     href="javascript:page = getResultPage;   page.display(); // startLoadingResult();" >Abstimmungsergebnis abrufen</a>
			 <select id="locale_select" onChange="changeLanguage(this.value)">
    			<option selected="selected" value="de">Deutsch</option>
    			<option value="en_US">English</option>
    			<option value="fr">Français</option>
  			</select>
			 
		</div>

		<div id="steps">
			<h1 id="idstepstitle">Vorgehensweise</h1>
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
				// document.write('');
			</script>
			</div>
		</div>
		<div id="techinfosswitch">
		<input type="checkbox" name="techinfocheckbox" id="techinfocheckbox" value="techinfocheckbox" onclick="onToggleTechInfosSwitch();">
		<label for="techinfocheckbox" id="idtechinfocheckbox"> </label></div>
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
