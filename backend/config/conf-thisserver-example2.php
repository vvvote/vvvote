<?php
/**
 * return 404 if called directly
 */
if(count(get_included_files()) < 2) {
	header('HTTP/1.0 404 Not Found');
	echo "<h1>404 Not Found</h1>";
	echo "The page that you have requested could not be found.";
	exit;
}

require_once __DIR__ . '/../rsaMyExts.php';

$webclientUrlbase = '..'; // relativ to backend or absolute, no trailing slash

$p         = new Math_BigInteger('10645752675217578369956837062782498220775273');
$q         = new Math_BigInteger('287562030630461198841452085101513512781647409');
$exppriv   = new Math_BigInteger('1210848652924603682067059225216507591721623093360649636835216974832908320027478419932929', 10);
$exppubl   = new Math_BigInteger('65537', 10);
$n         = new Math_BigInteger('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10);

$rsa       = new rsaMyExts();
$serverkey = $rsa->rsaGetHelpingNumbers($p, $q, $exppriv, $exppubl, $n);
$serverkey['serverName'] = 'PermissionServer2';
$debug     = true;


$dbInfos = array(
		'dbtype'   => 'mysql',
		'dbhost'  => 'localhost',
		'dbuser'  => 'root',
		'dbpassw' => 'bernAl821',
		'dbname'  => 'election_server2',
		'prefix'  => 'el2_'
);

// OAuth config
$oauthBEObayern = array(
		'name'          => 'BEO Bayern', // Name of this OAuth service do not use special characters
		'client_id'     => 'vvvote2',
		'client_secret' => 'your client secret',
		'redirect_uri'  => $configUrlBase . '/modules-auth/oauth/callback.php',
		'authorization_endp'  => 'https://beoauth.piratenpartei-bayern.de/oauth2/authorize/',
		'token_endp'          => 'https://beoauth.piratenpartei-bayern.de/oauth2/token/',
		'get_membership_endp' => 'https://beoauth.piratenpartei-bayern.de/api/self/membership/'
);
$oauthConfig = array($oauthBEObayern['name'] => $oauthBEObayern);

?>