<?php

require_once 'db.php';

class WrongRequestException extends Exception {
	var $errorno;
	var $errortxt;
	function __construct($errorno_, $errortxt_){
		$this->errorno  = $errorno_;
		$this->errortxt = $errortxt_;
	}
}


class Election {
	var $electionId; // = 'wahl1';
    var $numVerifyBallots;
    var $numSignBallots; 
    var $pServerKeys;
    var $serverkey;
    var $numAllBallots;
    var $thisServerName;
    var $db;
    
	function __construct($electionId_, $numVerifyBallots_, $numSignBallots_, array $pServerKeys_, $serverkey_, $numAllBallots_, $thisServerName_, Db $db) {
		$this->electionId       = $electionId_;
		$this->numVerifyBallots = $numVerifyBallots_;
		$this->numSignBallots   = $numSignBallots_;
		$this->pServerKeys      = $pServerKeys_;
		$this->serverkey        = $serverkey_;
		$this->numAllBallots    = $numAllBallots_;
		$this->thisServerName   = $thisServerName_;
		$this->db               = $db;
	}

	function throwException($errorno, $errortxt, $data) {
		global $debug;
		if ($debug) {
			$errortxt = $errortxt . "\n" . $data . "\n";
			// debug_print_backtrace();
		}
		throw new WrongRequestException($errorno, $errortxt);
	}
	
	function isInVoterList($voterId, $secret) {
		return $this->db->checkCredentials($this->electionId, $voterId, $secret);
	}

	function isFirstVote($voterID, $electionID, $threadId) {
		//read transaktionlist
		//
		return true;
	}

	function isPermitted($voterID, $secret, $electionID_, $threadId) { // TODO save req in database and check if first req
		$inlist = $this->isInVoterList($voterID, $secret);
		if (!$inlist) { 
			$this->throwException(1, "Error: check of credentials failed", "isPermitted: Voter $voterID is not in the list of allowed voters.");
		}
		
		if ($this->electionId != $electionID_) {
			$this->throwException(2, 'Error: wrong electionID', "isPermitted: No voting permission is given for election $electionID_, only $this->electionId is accepted");
		}
		
		$firstVote = $this->isFirstVote($voterID, $electionID_, $threadId);
		if (!$firstVote) {
			$this->throwException(3, "Error: This voter is already a voting permission given for the election $this->electionId If you lost your permission use the recover button.", "isPermitted: $voterReq[voterId] already got a voting permission from this server.");
		}
		return true;
	}
	/**
	 * randomly chooses $numPick out of $numBallots
	 * @param $numPick number of ballots to pick
	 * @param $numBallots number of total ballots
	 * @return number array of randomly choosen different numbers
	 */
	function pickBallots($numPick, $numBallots, $notallowednumbers = array()) {
		// TODO use array_rand
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
		$permitted = $this->isPermitted($voterReq['voterId'], $voterReq['secret'], $voterReq['electionId'], 1); // @TODO substitude ThreadId for 1
		// TODO check if this is the first req for picking ballots
		$numPick = $this->numVerifyBallots[$voterReq['xthServer']];
		$numBallots = count($voterReq['ballots']); // TODO take from config?
		$requestBallots['picked'] = $this->pickBallots($numPick, $numBallots);
		$requestBallots['cmd'] = 'unblindBallots';
		// save requested Ballots(voterId, electionId);
		$toSave = array('requestedBallots' => $requestBallots['picked'], 
				        'blindedHashes'    => $voterReq['ballots']);
		$this->db->saveBlindedHashes($this->electionId, $voterReq['voterId'], $toSave);
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
		$ballot['sigs'][$newnum]['sigBy'] = $this->thisServerName;
		if ($newnum === 0) { $prevSig = $blindedHash->toHex();                 } // TODO Think about: blindedHash correct?
		else               { $prevSig = $ballot['sigs'][$newnum -1]['serSig']; }
		$tmp = new Math_BigInteger($prevSig, 16);
		$ballot['sigs'][$newnum]['serSig']     = $rsa->_rsasp1($tmp)->toHex();
		return $ballot;
	}
	
	function signBallots($voterReq) {
		if (isset($voterReq['ballots'][0]['sigs'])) { // TODO take from DB instead of voterReq, from voterReq is not working because sigs are not sent in disclosing event
			$xtserver = count($voterReq['ballots'][0]["sigs"]);
		} else {
			$xtserver = 0;
		}
		$numBallots = count($voterReq['ballots']); // TODO think about it: from DB from config?
		$allowedBallots = array();
		// load all ballots sent in first req from $this->voterId $this->electionId from DB
		$ballotsFromDB = $voterReq['ballots']; // TODO replace $voterReq['ballots'] with the picked ballots saved in datebase 			// TODO $ballot['sigs']        = json_decode($sigsFromDB);
		foreach ($ballotsFromDB as $ballot) { 
		// TODO use this if $ballotsFromDB is loaded from DB: 	if ( isset($ballot['sigs']) && ($ballot['reqDisclosed'])) { 
				array_push($allowedBallots, $ballot['ballotno']-1);
		//	}
		}
		if (count($allowedBallots) < 1) {$this->throwException(300, "Error: no non-disclosed ballots left to sign", "signBallots: " . json_encode($allowedBallots));}
		$picked = $this->pickBallots($this->numSignBallots[$xtserver], count($allowedBallots));
		// $pickedtmp = $this->pickBallots($this->numSignBallots[$xtserver], count($allowedBallots));
		// $picked = array();
		// foreach ($pickedtmp as $num => $p) {
		//	$picked[$num] = $allowedBallots[$p];
		// }
		$ballots = array();
		for ($i=0; $i<count($picked); $i++) {
			$ballot = array();
			$ballot['ballotno'] = $ballotsFromDB[$picked[$i]]['ballotno']; 
			$blindedHashFromDB = $ballotsFromDB[$picked[$i]]['blindedHash'];
			if (isset ($ballotsFromDB[$picked[$i]]['sigs'])) { $ballot['sigs'] = array_slice($ballotsFromDB[$picked[$i]]['sigs'], 0, null ,true); }
	  		else                                             { $ballot['sigs'] = array();                                   }
			$ballot['blindedHash'] = $blindedHashFromDB;
			$ballot = $this->signBallot($ballot);
			$ballots[$i] = $ballot;
		}
		return $ballots;
	}
	
	
	function signBallotsEvent($voterReq) {
		// verify ballots
		$verified = $this->verifyBallots($voterReq); // TODO make $verified a boolean
		if (! $verified) { $this->throwException(300, 'Error: Ballot verification failed. I will not sign a ballot.', "voterreq: \n" . json_encode($voterReq));} // TODO: for debugging purpose only: add loaded ballots here 
		
		// sign ballots
		$signedBallots = $this->signBallots($voterReq);
		// encrypt $signedBallots so that only the voter can decrypt it
		
		$ret = array();
		$ret['ballots'] = $signedBallots;
		if (count($ret['ballots'][0]['sigs']) >= count($this->pServerKeys) ) {
			$ret['cmd'] = 'savePermission';
		} else {
			$ret['cmd'] = 'reqSigsNextpServer';
		}
		
		return $ret; 
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
	
	
	function verifySig($hash, $sig, $servername) {
		$f = -1;
		foreach ($this->pServerKeys as $num => $s) {
		  if ($s['name'] == $servername) { $f = $num; }	
		}
		if ($f == -1) {$this->throwException(200, "Error: signature verifcation failed", "verifySig: Server $servername given in signature not found");}
		$pubkey = $this->pServerKeys[$f];
		$rsa = new rsaMyExts();
		$rsa->loadKey($pubkey);  
		$hashBI = new Math_BigInteger($hash, 16);
		$sigBI = new Math_BigInteger($sig, 16);
		$verify = $rsa->_rsaep($sigBI);
		if ($hashBI->equals($verify)) { return true; }
		$this->throwException(201, "Error: signature verifcation failed", "verifySig: Server $servername, given hash: $hash, calculated hash: " . $verify->toHex());
	}
	
	function verifyBallots($voterReq) {
		// $voterReq: .ballots[] .electionId .VoteId .blindedHash[] .serversAlreadySigned[]
		global $base;
		//contains an array saying the x-th server has to sign y ballots
		// verify if user is allowed to vote and status of communication (done: pickBallots, next: signBallots) is correct
		// load requested hashes from database ($voterId, $electionId) in $requestedballots['num'][i] $requestedballots['blindedhash'][i]
		// verify content of the ballot
		// verify if the correct number of ballots was sent: if (count($voterReq["ballots"]) != $this->numVerifyBallots) { throwException('not the correct number of ballots sent'); }
		$tmpret = array();
		$rsa = new rsaMyExts();
		$rsa->loadKey($this->serverkey['privatekey']);
		$rsapub = new rsaMyExts();
		$rsapub->loadKey($this->serverkey['publickey']);
		for ($i=0; $i<count($voterReq["ballots"]); $i++) {
			// verify electionID
			if ($voterReq["ballots"][$i]['electionId'] != $this->electionId)               {
				$this->throwException(210, 'Error: electionID is wrong', "expected electionID: $this->electionId, received electionID in ballot $i: " . $voterReq['ballots'][$i]['electionId']);
			}
			// verify if the sent ballot was requested
			$blindedHashesFromDB = $this->db->loadBlindedHashes($this->electionId, $voterReq['voterId']);
			if (count($blindedHashesFromDB) > 1) {$this->throwException(301, 'more than one request for ballots sent', "All requested ballots: " . print_r($blindedHashesFromDB, true));}
			if (count($blindedHashesFromDB) < 1) {$this->throwException(302, 'Sign request without request for disclosing ballots', "All requested ballots: " . print_r($blindedHashesFromDB, true)); }
			$blindedHashesFromDB = $blindedHashesFromDB[0]; 
			$kw = in_array($voterReq['ballots'][$i]['ballotno'], $blindedHashesFromDB['requestedBallots']);
			if ($kw >= 0) {
				$requestedballots['sent'][$kw] = true;
			} else {
				$this->throwException(211, "A Ballot was sent for verification purpose that was not requested", "verifyBallots: not requested ballot: " . $voterReq['ballots'][$i]['ballotno'] . "requested ballots: " . print_r($blindedHashesFromDB['requestedBallots'], true));
			}
			// verify hash
			$raw = array();
			$raw['electionId'] = $voterReq["ballots"][$i]['electionId'];
			$raw['votingno'  ] = $voterReq["ballots"][$i]['votingno'];
			$raw['salt'      ] = $voterReq["ballots"][$i]['salt'];
			$str = json_encode($raw);
			$hashByMe = hash('sha256', $str);
			$hashByMeBigInt = new Math_BigInteger($hashByMe, 16);
			$blindedHashFromDatabaseTest= new Math_BigInteger($voterReq["ballots"][$i]['blindedHash'], $base);
			// $kw = $blindedHashesFromDB['blindedHashes'][$voterReq['ballots'][$i]['ballotno']]['blindedHash'];
			$blindedHashFromDatabase    = new Math_BigInteger($blindedHashesFromDB['blindedHashes'][$voterReq['ballots'][$i]['ballotno']]['blindedHash'], $base); 
			$signedblindedHash          = $rsa->_rsasp1($blindedHashFromDatabase);
			$unblindf                   = new Math_BigInteger($voterReq["ballots"][$i]['unblindf'], $base);
			$unblindedHash              = $rsa->rsaUnblind($signedblindedHash, $unblindf);
			$verifyHash                 = $rsapub->_rsasp1($unblindedHash);
			$unblindethashFromDatabaseStr = $verifyHash->toHex();
			$hashOk = $hashByMeBigInt->equals($verifyHash); 
			if (!$hashOk) {
				$this->throwException(212, "Error: hash wrong", "hash from signature: " . $verifyHash->toHex() . "calculated hash: $hashByMe");
			}
			// verify sigs from previous servers .ballots.sigs: .sig(encryptet previous sig or hash if first sig) .sigBy (number of the siging server in order to identify the correct public key)
			if (isset($voterReq["ballots"][$i]['sigs'])) {
				foreach ($voterReq["ballots"][$i]['sigs'] as $num => $sig) {
					if ($num == 0) {$prevsig = $hashByMe;} 
					// $result = $this->verifySig($prevsig, $sig['serSig'], $sig['sigBy']);
					// if (!$result['sigok']) { $e = 'Signature of previous server in serSig is wrong.'; return $e;}
					// $prevsig = $result['prevsig']; // TODO serSig / sigs use 2 arrays: one in which the hash is recursively encrypted and one containing all the encrypted states after each signature
					$this->verifySig($hashByMe, $sig['sig'], $sig['sigBy']); // throws an exception if not ok
				}
			}
			$tmpret[$i] = $hashOk;
			if ($i == 0) { $ret = $hashOk;         }
			else         { $ret = $ret && $hashOk; }
			
			// verify if votingId is unique
			   // load $allvotingno from database
			   // if (array_search($raw['votingno'], $allvotingno) == false) {$e = throwException... error("Voting number allocated"); return $e;}

			//
		}
		// verify if all requested ballots were sent
/*		for ($i=0; $i<count($requestedballots["num"]); $i++) {
			if (! $requestedballots['sent']) {
				$e = throwExeption...("Not all requested ballots were sent for verification. Ballots $requestedballots[num][$i] is missing.");
			}
		}
*/
		// array($tmpret, $hashByMe, $unblindethashFromDatabaseStr);
		return $ret;
	}

	
	function handlePermissionReq($req) {
		try {
			$voterReq = json_decode($req, true); //, $options=JSON_BIGINT_AS_STRING); // decode $req
			if ($voterReq == null) { // json could not be decoded
				$this->throwException(100, 'Error while decoding JSON request', $req);
			}
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
					$this->throwException(101, 'Error unknown command', $req);
					break;
			}
		} catch (WrongRequestException $e) {
			$result = array('cmd' => 'error', 'errorTxt' => $e->errortxt, 'errorNo' => $e->errorno);
		}
		$ret = json_encode($result);
		return $ret;
	}
	// everything is ok, construct answer
}


?>