<?php
function find_in_subarray($array, $subarraykey, $subarrayvalue) {
	foreach ($array as $key => $value) {
		if ($value[$subarraykey] === $subarrayvalue) return $key;
	}
	return false;
}

?>