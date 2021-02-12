<?php
$workingDir = getcwd();

chdir(__DIR__);
require_once 'connectioncheck.php';  // answers if &connectioncheck is part of the URL and exists

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

chdir(__DIR__); 
require_once 'tools/tools.php';

// if ?download is appended, set header 'Content-Disposition: attachment'
if (array_key_exists('QUERY_STRING', $_SERVER) ){
	parse_str($_SERVER['QUERY_STRING'], $queryArray); 
	if(array_key_exists('download', $queryArray)) header('Content-Disposition: attachment; filename=vvvote_client_' . 'vvvote_client_' . clearForFilename($_SERVER['HTTP_HOST']) . '.html');
}

$pathToClientSource = __DIR__ . '/webclient-sources/';

if ( (PHP_SAPI === 'cli') && ($argc > 1) ) {
	$configFilepath = $argv[1]; // interpreted by tools/loadconfig.php which is called from getserverinfos.php
	if (substr_compare($configFilepath, './', 0, 2) === 0) // relativ path
		$configFilepath = $workingDir . '/' . $configFilepath;  // make it absolute
}
// first do the action that requires possibly wrong config
ob_start();
	$output_as_javascript = true; // interpreted by getpublicserverkeys.php
	include 'getserverinfos.php';
	$PrintedServerinfos = ob_get_contents();
ob_end_clean();

if (array_key_exists ( 'cmd', $serverinfos ) && ($serverinfos['cmd'] === 'serverError') ) {
	if (PHP_SAPI === 'cli') {
		fwrite ( STDERR, "Error in server configuration. Client not compiled. Details: " . $serverinfosStr );
	} else {
		echo '
		<head>
		<title>Vvvote Client Error</title>
		</head>
		<body>
			<h1>Error Compiling Webclient</h1>
			There is an error in the server\'s configuration.<br>
			Datails:<br>
			' . $PrintedServerinfos . '<p>
			If you are the administrator: Setting debug = true in the config file and calling on the command line "php -f getclient.php >client.html" you might get more information.<br>
			';
	}
	return 1;
}

$includeJsFiles = Array();

$available_lang_ids = ['de', 'en_US', 'fr']; // If you add a language, add its ID here. The expected filename is "vvvote_{id}.js".
foreach ($available_lang_ids  as $lang_id) {
	$langfile = 'i18n/vvvote_' . $lang_id . '.js';
	array_push($includeJsFiles, $langfile);
}


$includeJsFiles = array_merge($includeJsFiles, Array(
		'tools/jed.js',
		'tools/i18n.js',
		'tools/aalert.js',
		
		'tools/BigInt.js',
		'tools/rsa.js',
		'tools/sha256.js',
		'tools/webcrypto.js',
		'tools/filehandling.js',
		'tools/textencoder.js',
		
		'exception.js',
		'tools/mixed.js',
		'tools/url.js',
		'listoferrors.js',
		'tools/ua-parser.js',


		'config/config.js',
		'getelectionconfig.js',
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
));

$includeCssFiles = Array('standard.css', 'substeps.css', 'working-animation.css', 'style_new.css', 'style_doc.css');

// print HTML-Header 
echo '
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1.0">
				<title>VVVote</title>';
// print all Javascript files 
echo '<script>';
foreach ($includeJsFiles as $f) {
	if ($f == 'config/config.js') { // insert server infos immedeately in front of config.js
	echo $PrintedServerinfos;
	//	include 'getserverinfos.php';
	}
	readfile($pathToClientSource . $f);
	echo "\r\n";
}

echo "var privacy_statement = [];\r\n"; 
foreach ($available_lang_ids as $lang_id) {
	// use default privacy statement if not available in the requested language
	if (file_exists(__DIR__ . '/config/privacy_statement_' . $lang_id . '.txt')) 
		 $fn = __DIR__ . '/config/privacy_statement_' . $lang_id . '.txt';
	else $fn = __DIR__ . '/config/privacy_statement.html';
	$ps = file_get_contents($fn);
	echo 'privacy_statement["' . $lang_id .'"] = ' . json_encode($ps) . ";\r\n"; 
}
		
// print placeholder for JSON permission file
echo "\n//placeholder for permission file\n";
echo "//bghjur56zhbvbnhjiu7ztgfdrtzhvcftzujhgfgtgvkjskdhvfgdjfgcfkdekf9r7gdefggdfklhnpjntt\n";
echo '</script>';

// print stylesheets
echo '<style type="text/css">';
foreach ( $includeCssFiles as $f ) {
	
	// replace /*DataUrl ...path=<nnn> */ by base64 encoded font file
	$cssfile = file_get_contents($pathToClientSource . $f);
	$pattern = '/\/\*DataUrl (.*) path=<(.*)>(.*)\*\//'; 	// find strings like "/*DataUrl src: url( path=<fonts/CenturyGothicRegular/CenturyGothicRegular.woff>) format('woff'); */"
	$matches = null;
	while (preg_match($pattern, $cssfile, $matches)) {
		// matches contains:
		// matches[0] = /*DataUrl src: url( path=<fonts/CenturyGothicRegular/CenturyGothicRegular.woff>) format(\'woff\'); */
		// matches[1][0] = 'src: url('
		// matches[2][0] = 'fonts/CenturyGothicRegular/CenturyGothicRegular.woff'
		// matches[3][0] = ') format(\'woff\'); '
		
		// matches2 = null;
		// $numMatches preg_match('/path=<(.*)>/', $matches, $pathToFontFile);
		
		$fontfile = file_get_contents ($pathToClientSource . $matches [2]);
		$type = pathinfo ($pathToClientSource . $matches [2], PATHINFO_EXTENSION);
		$fontDataUrl = 'data:font/' . $type . ';base64,' . base64_encode ( $fontfile );
		$cssfile = preg_replace ( $pattern, '$1 ' . $fontDataUrl . '$3', $cssfile, 1 );
		$matches = null;
	} ;
	echo $cssfile;
	 
//	readfile($pathToClient . $f);
}

echo '</style>';
/*
echo '
<script type="text/javascript">
  $(document).ready(function(){
    setTimeout(function(){

      $(".evenTableRow>button, .unevenTableRow>button").click(function(){

        $("tr").not($(this).parents("tr").first()).removeClass("tr_active");
        $("tr").not($(this).parents("tr").first()).removeClass("cont_box");

        $(this).parents("tr").first().toggleClass( "tr_active" );
        setTimeout(function(){
          $(".slideShow").parents("tr").first().toggleClass( "tr_active cont_box" );
        });
      });

    },1000);
    setTimeout(function(){
      $(".votingOption>button").click(function(){

        $(this).toggleClass( "active" );
      });
    },1000);
  });
</script>';
*/

// print the main content take from index.html - logo125x149.svg is included somewhere in the middle of the following text 
echo <<<EOT

</head>

<body onload="onWebsiteLoad(); onToggleTechInfosSwitch(); //startVoting(true); //test();" onClick="// rng_seed_time(); // better random" onKeyPress="// rng_seed_time(); // better random">
	<div id="errorDiv" style="display:none"></div>
	<!--  <div id="diagnosisControlDiv" style="display:none"></div>   -->
	<div class="wraper">
			<div id="errorDiv" style="display:none"></div>
			<!--  <div id="diagnosisControlDiv" style="display:none"></div>   -->
			<header>
				<div class="container">
					<div class="row">
						<div class="col-md-11">
							
							<nav class="navbar">
								<div class="navbar-header">
									<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1">
									<span class="sr-only">Toggle navigation</span>
									<span class="icon-bar"></span>
									<span class="icon-bar"></span>
									<span class="icon-bar"></span>
									</button>
									<a href="$linkToHostingOrganisation" class="navbar-brand" id="logo" tabindex="-1">
EOT;

if (file_exists(__DIR__ . '/config/logo_brand_47x51.svg'))									
 	   readfile(__DIR__ . '/config/logo_brand_47x51.svg');
else   readfile(__DIR__ . '/config/logo_brand_47x51_example.svg');

echo <<<EOT
									</a>
									<span id="ciSubHead" class="slogan"></span>
								</div>
								
								<div class="collapse navbar-collapse top_menu" id="navbar-collapse-1">
									<ul class="nav navbar-nav">
										<li><a id="newElectionLink" href="javascript:page = newElectionPage; page.display(); // handleNewElection();"  >Neue Abstimmung anlegen</a></li>
										<li><a id="takepartLink"    href="javascript:page = votePage;        page.display(); // startVoting(true);"    >An Abstimmung teilnehmen</a></li>
										<li><a id="fetchresult"     href="javascript:page = getResultPage;   page.display(); // startLoadingResult();" >Abstimmungsergebnis abrufen</a></li>
									</ul>
								</div>
							</nav>
						</div>
						<div class="col-md-1">
							<select id="locale_select" onChange="changeLanguage(this.value)">
								<option selected="selected" value="de">De</option>
								<option value="en_US">En</option>
								<option value="fr">Fr</option>
							</select>
						</div>
					</div>
				</div>
			</header>
			<div class="container">
				<div class="row filter_row">
					<div class="col-md-3">
						<h1 id="pagetitle" class="vvvote_title">An Abstimmung teilnehmen</h1>
					</div>
					<div class="col-md-9">
						<div id="steps">
							<div id="idstepstitle">Vorgehensweise</div>
							<ul id="stepslist">
								<li><span id="step1" class="curr">1. Wahlunterlagen holen</span></li>
								<li><span id="step2">2. Autorisierung</span></li>
								<li><span id="step3"><a onclick="startStep3();">3. Stimme abgeben</a></span></li>
								<li><span id="step4"><a onclick="startStep4();">4. Abstimmungsergebnis holen</a></span></li>
							</ul>
						</div>
					</div>
					
				</div>
				<div class="row">
					<div class="col-md-12">
						<div id="all">


		<div id="maincontent">
			<!-- this div is replaced by the html of the according auth-module -->
			<div id="loadedmaincontent">
			<script type="text/javascript">
				// document.write('');
			</script>
			</div>
		</div>

		<div id="techinfosswitch">
			<input type="checkbox" class="hidden check" name="techinfocheckbox" id="techinfocheckbox" value="techinfocheckbox" onclick="onToggleTechInfosSwitch();">
			<label class="orange_but" for="techinfocheckbox" id="idtechinfocheckbox"> </label>
		</div>

		<div id="techinfos" style="display:none;">
			<div id="additiontechinfos"></div>
			<div id="log">
				<h1>Log:</h1>
				<textarea id="logtextarea" name="log"></textarea>
			</div>
		</div>


	</div>
	</div>
		</div>
	</div>
	</div>
	<footer>
	<div class="footer_wraper">
				<div class="container">
					<div class="row">
						<div class="col-md-2 text-center">
							<div class="copyright" > 
									<span><a id="aboutUrlId" href="$aboutUrl" target="_blank">About</a></span>
							</div>
						</div>
						<div class="col-md-2 text-center">
							<div class="copyright" > 
									<span><a id="privacyStatementId" href="$aboutUrl">Privacy statement</a></span>
							</div>
						</div>
						<div class="col-md-2 col-sm-push-5">
							<div class="copyright text-center"">
								<div class="logo_foot" style="width: 30px;display: inline-block;vertical-align: middle;">						
EOT;

readfile($pathToClientSource . 'logo_auto.svg');

echo <<<EOT
								</div>
							<span>powered by <a href="https://www.vvvote.de/">VVVote</a></span>
							</div>
						</div>
					</div>
				</div>
				</div>
			</footer>
</body>
</html>

EOT;
