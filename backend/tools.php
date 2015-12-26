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


/**
 * 
 * @param unknown $array
 * @param unknown $subarraykey
 * @param unknown $subarrayvalue
 * @return unknown|boolean
 */

function find_in_subarray($array, $subarraykey, $subarrayvalue) {
	foreach ($array as $key => $value) {
		if ($value[$subarraykey] === $subarrayvalue) return $key;
	}
	return false;
}

function makeCompleteElectionId($mainElectionId, $questionID) {
	$completeElectionId = json_encode(array('mainElectionId' => $mainElectionId,  'subElectionId' => $questionID));
	return $completeElectionId;
}

function splitCompleteElectionId($completeElectionId) {
	return json_decode($completeElectionId);
}

function base64url_encode($data) {
	return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data, $strict = true) {
	
	return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) + (4 - (strlen($data) % 4)) % 4, '=', STR_PAD_RIGHT), $strict);
}


?>