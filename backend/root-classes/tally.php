<?php
/**
 * Base class for all Tallies
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


class Tally {
	function handleNewElectionReq($electionId, Auth $auth, Blinder $blinder, $req) {
		return array();
	}
	function setup($elconfig) {
		$this->elConfig = $elconfig;
	}
}

?>