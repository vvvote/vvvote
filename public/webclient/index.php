<?php
// redirect to https, if configured
if ((empty ( $_SERVER ['HTTPS'] ) || $_SERVER ['HTTPS'] === 'off')) {
	// load the configuration
	$pathToBackend = './../../backend/';
	require_once $pathToBackend . 'tools/loadconfig.php';

	// test if https is configured
	if (substr_compare ( $pServerUrlBases [$serverNo - 1], 'https://', 0, 8, true ) === 0) {
		
		// buiuld the redirection URL
		$myUrlParsed = parse_url ( $pServerUrlBases [$serverNo - 1] );
		if ((! array_key_exists ( 'port', $myUrlParsed )) || empty ( $myUrlParsed ['port'] ) || ($myUrlParsed ['port'] === ''))
			$myUrlParsed ['port'] = 443;
		header ( 'Location: https://' . $myUrlParsed ['host'] . ':' . $myUrlParsed ['port'] . $_SERVER ['REQUEST_URI'], true, 307 );
		die ();
	}
}

// redirect to index2.html if that exists, otherwise to ../api/v1/getclient
if (file_exists('index2.html')) header ('Location: index2.html?' . $_SERVER ['QUERY_STRING'], true, 307 );
else                            header ('Location: ../api/v1/getclient?' . $_SERVER ['QUERY_STRING'], true, 307 );
?>