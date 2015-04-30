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


?>