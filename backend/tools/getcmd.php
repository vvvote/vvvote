<?php

/* 
 * errorno starts at 8000
 */


/**
 * return 404 if called directly
 */
if(count(get_included_files()) < 2) {
	header('HTTP/1.0 404 Not Found');
	echo "<h1>404 Not Found</h1>";
	echo "The page that you have requested could not be found.";
	exit;
}

chdir(__DIR__); require_once './exception.php';

/**
 * 
 * @param unknown $httpReq
 */

function getCmd($httpReq) {
	$reqdecoded = getData($httpReq);
	if (! isset($reqdecoded['cmd']))	WrongRequestException::throwException(8010, '>cmd< is missing in request' , 'got: ' . $httpReq);
	return $reqdecoded['cmd'];	
}

function getData($httpReq) {
	$reqdecoded = json_decode($httpReq, true);
	if ($reqdecoded == null) 			WrongRequestException::throwException(8000, 'Data in JSON format expected', 'got: ' . $httpReq);
	if (! isset($reqdecoded['cmd']))	WrongRequestException::throwException(8010, '>cmd< is missing in request' , 'got: ' . $httpReq);
	return $reqdecoded;
}


function checkCmd ($httpReq, $cmd) {
	$cmd = getCmd($httpReq);
	if ($cmd !== $cmd) WrongRequestException::throwException(8030, "Only the command >$cmd< is accepted", 'got: ' . $reqdecoded['cmd']);
}
