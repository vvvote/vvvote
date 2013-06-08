<?php
class election {
	var $electionId = 'wahl1';
	
	function handlePermissionReq($req) {
		$voterReq = json_decode($req, true, 512, JSON_BIGINT_AS_STRING); // decode $req
		
	}
	
	
	function isPermitted($voterID, $electionID_, $threadId) {
		if ($this->electionId != $electionID_) {return false;}
		$inlist = isInVoterList($voterID);
		if (!$inlist) {return false; }
		$FirstVote = isFirstVote($voterID, $electionID, $thredID);
		return $FirstVote;
	}
	
	function isFirstVote($voterID, $electionID, $threadId) {
		//read transaktionlist
		//
		return true;
	}
	
	function isInVoterList($voterId) {
		return $voterId == 'pakki' || $voterId == 'melanie'; 
	}
}

?>