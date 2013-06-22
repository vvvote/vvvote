<?php

class election {
	var $electionId; // = 'wahl1';
    var $numVerifyBallots;
    var $numSignBallots; 
    var $pServerKeys;
    var $serverkey;
    var $numAllBallots;
    var $thisServerNum;
    
	function __construct($electionId_, $numVerifyBallots_, $numSignBallots_, $pServerKeys_, $serverkey_, $numAllBallots_, $thisServerNum_) {
		$this->electionId       = $electionId_;
		$this->numVerifyBallots = $numVerifyBallots_;
		$this->numSignBallots   = $numSignBallots_;
		$this->pServerKeys      = $pServerKeys_;
		$this->serverkey        = $serverkey_;
		$this->numAllBallots    = $numAllBallots_;
		$this->thisServerNum    = $thisServerNum_;
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
			$text    = "Voter $voterReq[voterId] already got a voting permission from this server.<br>";
			$errorno = 3;
		}
		return array('errorno' => $errorno, 'text' => $text);
	}
	/**
	 * randomly chooses $numPick out of $numBallots
	 * @param $numPick number of ballots to pick
	 * @param $numBallots number of total ballots
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
		$numPick = $this->numVerifyBallots[$voterReq['xthServer']];
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
	/**
	 * Sign a ballot
	 * @param unknown $ballot must contain ['hashBi']
	 */
	function signBallot($ballot) {
		$rsa = new rsaMyExts();
		$rsa->loadKey($this->serverkey['privatekey']);
		$newnum = count($ballot['sigs']);
		$blindedHash = new Math_BigInteger($ballot['blindedHash'], 16);
		$ballot['sigs'][$newnum]['sig'] = $rsa->_rsasp1($blindedHash)->toHex();
		$ballot['sigs'][$newnum]['serverno'] = $this->thisServerNum;
		if (!isset($ballot['sigs'][$newnum]['serSig'])) {
			$ballot['sigs'][$newnum]['serSig'] = $blindedHash->toHex();
		}
		$ballot['sigs'][$newnum]['serSigPrev'] = $ballot['sigs'][$newnum]['serSig'];
		$tmp = new Math_BigInteger($ballot['sigs'][$newnum]['serSig'], 16);
		$ballot['sigs'][$newnum]['serSig']     = $rsa->_rsasp1($tmp)->toHex();
		return $ballot;
	}
	
	function signBallots($voterReq) {
		if (isset($voterReq['ballots']["sigs"])) {
			$xtserver = count($voterReq['ballots']["sigs"]);
		} else {
			$xtserver = 0;
		}
		$numBallots = count($voterReq['ballots']);
		$picked = $this->pickBallots($this->numSignBallots[$xtserver], $numBallots);
		$ballots = array();
		for ($i=0; $i<count($picked); $i++) {
			$ballot = array();
			$ballot['ballotno'] = $voterReq['ballots'][$picked[$i]]['ballotno']; // TODO take this from database
			// TODO $blindedHashFromDB = select blindedHash sigs from ballots by electionId, VoterId, $picked[$i]
			$blindedHashFromDB = $voterReq['ballots'][$picked[$i]]['blindedHash']; // TODO never use the data from the user, load from DB 
			// TODO $ballot['sigs']        = json_decode($sigsFromDB);
			$ballot['sigs'] = array(); // $voterReq["ballots"][$picked[$i]]['blindedHash']; // TODO never use the data from the user, load from DB
			$ballot['blindedHash'] = $blindedHashFromDB;
			$ballot = $this->signBallot($ballot);
			$ballots[$i] = $ballot;
		}
		return $ballots;
	}
	
	
	function signBallotsEvent($voterReq) {
		// verify ballots
		$verified = $this->verifyBallots($voterReq);
		if (! $verified) {$e = error('Ballot verification failed. I will not sign a ballot.'); }
		
		// sign ballots
		$signedBallots = $this->signBallots($voterReq);
		// encrypt $signedBallots so that only the voter can decrypt it
		
		$ret = array();
		$ret['ballots'] = $signedBallots;
		if (count($ret['ballots'][0]['sigs']) == count($this->pServerKeys) -2) {
			$ret['cmd'] = 'savePermission';
		} else {
			$ret['cmd'] = 'reqSigsNextpServer';
		}
		
		return $ret; // TODO return signed ballots
	}
	
	
	/*
	 * 		$xthserver = count($voterReq['ballots']["sigs"]);
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
	 */
	
	
	function verifySig($hash, $sig, $server) {
		$pubkey = $pServerKeys[$server];
		$rsa = new rsaMyExts();
		$rsa->loadKey($pubkey); // TODO 
		$hashBI = new Math_BigInteger($hash, 16);
		$verify = $rsa->_rsaep($sig);
		return array ('sigok' => $hashBI->equals($verify), 'prevsig' => $verify);
	}
	
	function verifyBallots($voterReq) {
		// $voterReq: .ballots[] .electionId .VoteId .blindedHash[] .serversAlreadySigned[]
		global $base;
		//contains an array saying the x-th server has to sign y ballots
		// verify if user is allowed to vote and status of communication (done: pickBallots, next: signBallots) is correct
		// load requested hashes from database ($voterId, $electionId) in $requestedballots['num'][i] $requestedballots['blindedhash'][i]
		// verify content of the ballot
		// verify if the correct number of ballots was sent: if (count($voterReq["ballots"]) != $this->numVerifyBallots) { $e = error('not the correct number of ballots sent'); }
		$tmpret = array();
		$rsa = new rsaMyExts();
		$rsa->loadKey($this->serverkey['privatekey']);
		$rsapub = new rsaMyExts();
		$rsapub->loadKey($this->serverkey['publickey']);
		for ($i=0; $i<count($voterReq["ballots"]); $i++) {
			// verify electionID
			if ($voterReq["ballots"][$i]['electionId'] != $this->electionId)               {
				$e = error("electionID is wrong"); return $e;
			}
			// verify if the sent ballot was requested
/*			$kw = in_array($voterReq['ballots'][$i].['ballotno'], $requestedballots['num']);
			if ($kw >= 0) {
				$requestedballots['sent'][$kw] = true;
			} else {
				$e = error("A Ballot was sent for verification purpose that was not requested");
			}
*/			// verify hash
			$raw = array();
			$raw['electionId'] = $voterReq["ballots"][$i]['electionId'];
			$raw['votingno'  ] = $voterReq["ballots"][$i]['votingno'];
			$raw['salt'      ] = $voterReq["ballots"][$i]['salt'];
			$str = json_encode($raw);
			$hashByMe = hash('sha256', $str);
			$hashByMeBigInt = new Math_BigInteger($hashByMe, 16);
			$blindedHashFromDatabase    = new Math_BigInteger($voterReq["ballots"][$i]['blindedHash'], $base); // @TODO: load this hash from database
			$signedblindedHash          = $rsa->_rsasp1($blindedHashFromDatabase);
			$unblindf                   = new Math_BigInteger($voterReq["ballots"][$i]['unblindf'], $base);
			$unblindedHash              = $rsa->rsaUnblind($signedblindedHash, $unblindf);
			$verifyHash                 = $rsapub->_rsasp1($unblindedHash);
			$unblindethashFromDatabaseStr = $verifyHash->toHex();
			$hashOk = $hashByMeBigInt->equals($verifyHash); 
			if (!$hashOk) {
				$e = error("hash wrong"); return $e;
			}
			// verify sigs from previous servers .ballots.sigs: .sig(encryptet previous sig or hash if first sig) .serverno (number of the siging server in order to identify the correct public key)
			if (isset($voterReq["ballots"][$i]['sigs'])) {
				foreach ($voterReq["ballots"][$i]['sigs'] as $nums => $sig) {
					if ($num == 0) {$prevsig = $hash;} 
					$result = $this->verifySig($prevsig, $sig['sig'], $sig['serverno']);
					if (!$result['sigok']) { $e = error('Signature of previous server is wrong.'); }
					$prevsig = $result['prevsig']; // TODO use 2 arrays: one in which the hash is recursively encrypted and one containing all the encrypted states after each signature
				}
			}
			$tmpret[$i] = $hashOk;
			
			// verify if votingId is unique
			   // load $allvotingno from database
			   // if (array_search($raw['votingno'], $allvotingno) == false) {$e = error("Voting number allocated"); return $e;}

			//
		}
		// verify if all requested ballots were sent
/*		for ($i=0; $i<count($requestedballots["num"]); $i++) {
			if (! $requestedballots['sent']) {
				$e = error("Not all requested ballots were sent for verification. Ballots $requestedballots[num][$i] is missing.");
			}
		}
*/
		// verify sigs of earlier servers if present
		
		return array($tmpret, $hashByMe, $unblindethashFromDatabaseStr);
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