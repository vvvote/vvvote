<?php
chdir ( __DIR__ );
$pathToBackend = '../../../backend/'; 
require_once $pathToBackend . 'tools/loadconfig.php';
chdir ( __DIR__ );

// redirect to https
$cmd = trim($_SERVER ['PATH_INFO'], '/');

if (   ($cmd !== 'storevote') 
		&& (empty ( $_SERVER ['HTTPS'] ) || $_SERVER ['HTTPS'] === 'off')
		&& (substr_compare($pServerUrlBases[$serverNo -1], 'https://', 0, 8, true) === 0) ) {
			$myUrlParsed = parse_url($pServerUrlBases[$serverNo -1] );
			if ((! array_key_exists('port', $myUrlParsed)) || empty($myUrlParsed['port']) || ($myUrlParsed['port'] === ''))
					$myUrlParsed['port']= 443;
	header('Location: https://' .$myUrlParsed['host'] . ':' . $myUrlParsed['port'] . $_SERVER['REQUEST_URI'], true, 307);
	die();
}

// $path = $_SERVER['REQUEST_URI'];
// $strpos($path, '/api/v1');

switch ($cmd) {
	case 'getserverinfos' :
		require_once $pathToBackend . 'getserverinfos.php';
		break;
	case 'newelection' :
		require_once $pathToBackend . 'newelection.php';
		break;
	case 'getelectionconfig' :
		require_once $pathToBackend . 'getelectionconfig.php';
		break;
	case 'getpermission' :
		require_once $pathToBackend . 'getpermission.php';
		break;
	case 'getclient' :
		require_once $pathToBackend . 'getclient.php';
		break;
	case 'storevote' :
		require_once $pathToBackend . 'storevote.php';
	case 'getresult' :
		require_once $pathToBackend . 'getresult.php';
		break;
	case 'modules-auth/oauth2/callback' :
		require_once $pathToBackend . 'modules-auth/oauth/callback.php';
		break;
		default :
		;
		break;
}
?>
