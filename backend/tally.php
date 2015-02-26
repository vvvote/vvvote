<?php

class Tally {
	function handleNewElectionReq($electionId, Auth $auth, Blinder $blinder, $req) {
		return array();
	}
	function setup($elconfig) {
		$this->elConfig = $elconfig;
	}
}

?>