<?php
header('Location: webclient/');
die();

// the following code can be used somewhere else:
echo "<!DOCTYPE html>\n<html>\n <head>";
echo "<style type=\"text/css\">\n";
chdir(__DIR__);
readfile('../backend/webclient-sources/standard.css');
echo '</style>';
echo '</head>
<body>
<h1>Vvvote</h1>
<p><a href="./webclient/?">Click here to see the web interface</a></p>';


chdir(__DIR__); require_once '../backend/tools/tools.php';
// require_once '../backend/tools/loadconfig.php';
// global $pServerUrlBases, $serverNo;
// $myUrlParsed = parse_url ( $pServerUrlBases [$serverNo] );
// if (($myUrlParsed ['scheme'] === 'https') && ((empty ( $_SERVER ['HTTPS'] ) || ($_SERVER ['HTTPS'] === 'off')))) {
//	if (! isset($myUrlParsed['port'])) $myUrlParsed['port'] = 443;
//	header ( 'Location: https://' . preg_replace ( '/(.*)\:[0-9]*/', '${1}', $_SERVER['HTTP_HOST'] ) .':' . $myUrlParsed['port'] . $_SERVER['REQUEST_URI'], true, 308 );
// } else {
//	header ( 'Location: ./webclient/?' . $_SERVER ['QUERY_STRING'], true, 308 );
// }

$filename = 'vvvote_client_' . clearForFilename($_SERVER['HTTP_HOST']);
echo '<p>Paranoid users can <a href="./api/v1/getclient?download" download="' . $filename . '">download the client</a> and check the sha256 checksum in order to be sure that the client is not modified.</p>';
echo '<p>You can open the downloaded .html-file and use it to obtain the voting certificate.</p>';
echo '<p>Afterwords, you can open the saved voting certificate using the client and cast your vote.</p>';
echo '</body>';
?>
