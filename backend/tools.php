<?php
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