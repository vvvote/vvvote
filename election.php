<?php

class election {
	var $electionId; // = 'wahl1';

	function __construct($electionId_) {
		$this->electionId = $electionId_;
	}

	function isInVoterList($voterId) {
		return $voterId == 'pakki' || $voterId == 'melanie';
	}

	function isFirstVote($voterID, $electionID, $threadId) {
		//read transaktionlist
		//
		return true;
	}

	function isPermitted($voterID, $electionID_, $threadId) {
		$errorno = 0;
		$text    = 'ok';
		if ($this->electionId != $electionID_) {
			$text    = "No voting permission is given for election $electionID_, only $this->electionId is accepted";
			$errorno = 1;
		}
		$inlist = $this->isInVoterList($voterID);
		if (!$inlist) {
			$text    = "Voter $voterReq.voterId is not in the list of allowed voters.<br>";
			$errorno = 2;
		}
		$firstVote = $this->isFirstVote($voterID, $electionID_, $threadId);
		if (!$firstVote) {
			$text    = "Voter $voterReq[voterId] already got a voting permission.<br>";
			$errorno = 3;
		}
		return array('errorno' => $errorno, 'text' => $text);
	}
	/**
	 * randomly chooses $numPick out ou $numBallots
	 * @param unknown $numPick
	 * @param unknown $numBallots
	 * @return number array of randomly choosen different numbers
	 */
	function pickBallots($numPick, $numBallots) {
		$picked = array();
		for ($i=0; $i<$numPick; $i++) {
			$r = rand(0, $numBallots - 1);
			$j = 0;
			while (in_array($r, $picked) && $j < $numBallots) {
				$j++;
				$r++;
				if ($r == $numBallots) {
					$r = 0;
				}
			}
			$picked[$i] = $r;
		}
		return $picked;
	}

	function pickBallotsEvent($voterReq) {
		global $numVerifyBallots;
		$numPick = $numVerifyBallots[$voterReq['xthServer']];
		$permitted = $this->isPermitted($voterReq['voterId'], $voterReq['electionId'], 1); // @TODO substitude ThreadId for 1
		if ($permitted['errorno'] != 0) {
			return $permitted;
		}
		$numBallots = count($voterReq['blindedHash']);
		$requestBallots['picked'] = $this->pickBallots($numPick, $numBallots);
		$requestBallots['cmd'] = 'unblindBallots';
		// save requested Ballots(voterId, electionId);
		return $requestBallots;
	}

	function signBallots($voterReq) {
		// $voterReq: .ballots[] .electionId .VoteId .blindedHash[] .serversAlreadySigned[]
		global $serverkey;
		global $numSignBallots; //contains an arry saying the x-th server has to sign y ballots
		// load requested ballots($voterId, $electionId)
		// verify content of the ballot
		$i = 0;
		$raw = array();
		$raw['electionId'] = $voterReq["ballots"][$i]['electionId'];
		$raw['votingno'  ] = $voterReq["ballots"][$i]['votingno'];
		$raw['salt'      ] = $voterReq["ballots"][$i]['salt'];
		$str = json_encode($raw);
		$hashByMe = hash('sha256', $str);
		return $hashByMe;
		$raw['hash'      ] = 1;
		$ballot['raw'][electionId] = 1;
				// calculate hash
		// unblind the hash
		// test  if calculated hash matches the given hash (transmitted in the message 'pickBallots', if not first signing server: verify the sigs of previous servers
		$i = 0;
		while ($i < count($voterReq['ballots']) ) {
			$i++;
			if (isset($voterReq['ballots']['sigs'])) {
				break;
			}
		}
		$xthserver = count($voterReq['ballots']["sigs"]);
		// sign several hashs:
		$signer = new rsaMyExts();
		$signer->loadKey($serverkey);
		$numAll = count($voterReq['blindedHash']);
		$picked = $this->pickBallots($numSignBallots[$xthserver], $numAll);
		$ret = array();
		for ($i=0; $i<$num; $i++) {
			$hash = str2bigInt($voterReq['blindedHash'][i]);
			$ret['signature'][i] = bigInt2str($signer->_rsasp1($hash), 10);
		}
		return $ret;
	}

	function signBallotsEvent($voterReq) {
		return $this->signBallots($voterReq);
	}

	function handlePermissionReq($req) {
		$voterReq = json_decode($req, true); //, $options=JSON_BIGINT_AS_STRING); // decode $req
		$result = array();
	//	print "voterReq\n";
	//	print_r($voterReq);
		// $this.verifysyntax($result);
		// $this.verifyuser($voterReq['voterid'], $voterReq['secret']);
		// get state the user is in for the selected election
		switch ($voterReq['cmd']) {
			case 'pickBallots':
				$result = $this->pickBallotsEvent($voterReq);
				break;
			case 'signBallots':
				$result = $this->signBallotsEvent($voterReq);
				break;
					
			default:
				;
				break;
		}
		$ret = json_encode($result);
		return $ret;
	}
	// everything is ok, construct answer
}





?>