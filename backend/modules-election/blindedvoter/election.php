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

require_once 'dbBlindedVoter.php';
require_once 'exception.php'; // I dont know why this works - the files are in different directories but this way php finds both
require_once 'crypt.php';

/**
 * Class that implements the blinded voter scheme
 *
 * errorno start at 1 and
 * errorno start at 100 and 200 and 300 and 1000 and 400
 * 
 * @author r
 *
 */

class Election {
	var $electionId; // = 'wahl1';
	var $numVerifyBallots;
	var $numSignBallots;
	var $numAllBallots;
	var $numSigsRequiered;
	var $db;
	var $auth;
	var $crypt;

	function __construct($electionId_, $numVerifyBallots_, $numSignBallots_, array $pServerKeys_, $serverkey_, $numAllBallots_, $numSigsRequiered_, $dbInfos, Auth $auth_) {
		$this->electionId       = $electionId_;
		$this->numVerifyBallots = $numVerifyBallots_;
		$this->numSignBallots   = $numSignBallots_;
		$this->numAllBallots    = $numAllBallots_;
		$this->db               = new DbBlindedVoter($dbInfos);
		$this->auth				= $auth_;
		$this->crypt            = new Crypt($pServerKeys_, $serverkey_);
		$this->numSigsRequiered = $numSigsRequiered_;
		
	}


	function isInVoterList($credentials, $electionId) { 
		return $this->auth->checkCredentials($credentials, $electionId);
	}

	function isFirstVote($credentials, $electionID, $threadId) {
		//read transactionlist
		//
		return true;
	}

	function isPermitted($credentials, $electionID_, $threadId) {
		// TODO save req in log-database and check if first req
		// TODO check if correct number of ballots was sent
		$inlist = $this->isInVoterList($credentials, $electionID_);
		if (!$inlist) {
			WrongRequestException::throwException(1, "Error: check of credentials failed. You are not in the list of allowed voters for this election or secret not accepted", 'isPermitted: credentials ' . print_r($credentials, true));
		}

		if ($this->electionId != $electionID_) {
			WrongRequestException::throwException(2, 'Error: wrong election id', "isPermitted: No voting permission is given for election $electionID_, only $this->electionId is accepted");
		}
/* at the moment, this is tested later
		$firstVote = $this->isFirstVote($credentials, $electionID_, $threadId);
		if (!$firstVote) {
			WrongRequestException::throwException(3, "Error: This voter is already a voting permission given for the election $this->electionId If you lost your permission use the recover button.", "isPermitted: $voterReq[voterId] already got a voting permission from this server.");
		}
*/
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
		$permitted = $this->isPermitted($voterReq['credentials'], $this->electionId, 1); // $voterReq['voterId'], $voterReq['secret'], $voterReq['electionId'], 1); // @TODO substitude ThreadId for 1
		$voterId = $this->auth->getVoterId($voterReq['credentials'], $this->electionId);
		// TODO check if this is the first req for picking ballots
		$numPick = $this->numVerifyBallots[$voterReq['xthServer']]; // TODO think about: trust the xthServer from voterReq? - better check the number of already obained sigs?
		$numBallots = count($voterReq['ballots']); // TODO take from config?
		// TODO care for not picking too much ballots so that no one ist left to sign. 
		// Take the number of ballots which has to be left to sign from $numSignBallots in conf-allservers.php 
		$requestBallots['picked'] = $this->pickBallots($numPick, $numBallots);
		$requestBallots['cmd'] = 'unblindBallots';
		// save requested Ballots(voterId, electionId);
		$toSave = array('requestedBallots' => $requestBallots['picked'],
				        'blindedHashes'    => $voterReq['ballots']);
		$this->db->saveBlindedHashes($this->electionId, $voterId, $toSave);
		return $requestBallots;
	}
	/**
	 * Sign a ballot
	 * @param unknown $ballot must contain ['hashBi']
	 */
	// function signBallot($ballot) {
		
		//$rsa = new rsaMyExts();
		//$rsa->loadKey($this->serverkey['privatekey']);
		//$newnum = count($ballot['sigs']);
		//$blindedHash = new Math_BigInteger($ballot['blindedHash'], 16);
		//$ballot['sigs'][$newnum]['sig'] = $rsa->_rsasp1($blindedHash)->toHex();
		//$ballot['sigs'][$newnum]['sigBy'] = $this->thisServerName;
		//$this->crypt->signBlindedHash($blindedHash, $ballot);
		
	//}

	function signBallots($voterReq, $blindedHashesFromDB) {
		/*if (isset($voterReq['ballots'][0]['sigs'])) { // TODO take from DB instead of voterReq, from voterReq is not working because sigs are not sent in disclosing event
			$xtserver = count($voterReq['ballots'][0]["sigs"]);
		} else {
		$xtserver = 0;
		}
		*/
		// find out the x-th server I am
		$xthserver = 0;
		$numSigned = array();
		foreach ($blindedHashesFromDB['blindedHashes'] as $bh) {
			if (isset($bh['sigs'])) {
				$tmp = count($bh['sigs']);
				if (! isset($numSigned[$tmp -1]) ) $numSigned[$tmp -1] = 0;
				$numSigned[$tmp -1]++;
				if ($tmp > $xthserver) $xthserver = $tmp;
			}
		} // TODO check if all first/second... signatures come from the same servers
		// TODO check if all prev sigs came from different servers
		// check if all previous servers signed the correct number of ballots/blindedHashes
		foreach ($numSigned as $i => $num) {
			if ($num != $this->numSignBallots[$i] ) WrongRequestException::throwException(401, "Error: the number of already acquiered signatures does not match the configured number of signatures", "from server $i, sigs acquiered $num should have acquiered " . $this->numSignBallots[$i]);
		}

		// make an array of ballot numbers that can be signed (e.g. only already signed ones by previous servers are allowed that are not disclosed to this server
		$allowedBallots = array();
		foreach ($blindedHashesFromDB['blindedHashes'] as $ballot) {
			if ($xthserver == 0) array_push($allowedBallots, $ballot['ballotno']);
			else {
				if (isset($ballot['sigs'])
				&& count($ballot['sigs']) == $xthserver
				&& (!in_array($ballot['ballotno'], $blindedHashesFromDB['requestedBallots'])))
					array_push($allowedBallots, $ballot['ballotno']);
			}
		}
		if (count($allowedBallots) < 1) {
			WrongRequestException::throwException(301, "Error: no non-disclosed ballots left to sign", "signBallots: " . json_encode($allowedBallots));
		}
		if (count($allowedBallots) < $this->numSignBallots[$xthserver]) WrongRequestException::throwException(300, "Error: not enough non-disclosed ballots left to sign", "signBallots: left to sign: " . json_encode($allowedBallots));
		// $picked = $this->pickBallots($this->numSignBallots[$xthserver], count($allowedBallots));
		$pickedtmp = $this->pickBallots($this->numSignBallots[$xthserver], count($allowedBallots));
		$picked = array();
		foreach ($pickedtmp as $num => $p) {
			$picked[$num] = $allowedBallots[$p];
		}
		$ballots = array();
		for ($i=0; $i<count($picked); $i++) {
			$ballot = array();
			$ballot['ballotno']    = $blindedHashesFromDB['blindedHashes'][$picked[$i]]['ballotno'];
			$ballot['blindedHash'] = $blindedHashesFromDB['blindedHashes'][$picked[$i]]['blindedHash'];
			if (isset ($blindedHashesFromDB['blindedHashes'][$picked[$i]]['sigs'])) $ballot['sigs'] = array_slice($blindedHashesFromDB['blindedHashes'][$picked[$i]]['sigs'], 0, null ,true);
			else                                                                    $ballot['sigs'] = array();
			$ballot = $this->crypt->signBlindedHash($ballot['blindedHash'], $ballot);
			$ballots[$i] = $ballot;
		}
		return $ballots;
	}



	function signBallotsEvent($voterReq) {
		// TODO: check credentials
		// load the blinded Hashes from cmd 'pickBallots'
		$voterId = $this->auth->getVoterId($voterReq['credentials'], $voterReq['electionId']);
		$blindedHashesFromDB = $this->db->loadBlindedHashes($this->electionId, $voterId);
		if (count($blindedHashesFromDB) > 1) {
			WrongRequestException::throwException(301, 'Error: more than one request for ballots sent', "All requested ballots: " . print_r($blindedHashesFromDB, true));
		}
		if (count($blindedHashesFromDB) < 1) {
			WrongRequestException::throwException(302, 'Error: Sign request without request for disclosing ballots', "All requested ballots: " . print_r($blindedHashesFromDB, true));
		}
		$blindedHashesFromDB = $blindedHashesFromDB[0];

		// verify ballots
		$verified = $this->verifyBallots($voterReq, $blindedHashesFromDB);
		if (! $verified) {
			WrongRequestException::throwException(300, 'Error: Ballot verification failed. I will not sign a ballot.', "voterreq: \n" . json_encode($voterReq)) . "loaded blinded hashes: " .  json_encode($blindedHashesFromDB);
		} // TODO: for debugging purpose only: add loaded ballots here

		// sign ballots
		$signedBallots = $this->signBallots($voterReq, $blindedHashesFromDB);
		// encrypt $signedBallots so that only the voter can decrypt it

		$ret = array();
		$ret['ballots'] = $signedBallots;
		$tmp = array('voterId' => $voterId, 'signedBallots' => $signedBallots);
		$this->db->saveSignedBallots($this->electionId, $voterId, $tmp);
		if (count($ret['ballots'][0]['sigs']) >= $this->crypt->getNumServers() ) {
			$ret['cmd'] = 'savePermission';
			// TODO think about: save all signed ballots not only the ones where this server is the last signer?
			// up to now it is only used for tally.js to show who requested a Wahlschein
			// maybe it should be used to avoid multi-threading problems
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

	function ballot2strForSig(array $ballot) {
		$raw = array();
		$raw['electionId'] = $ballot['electionId'];
		$raw['votingno'  ] = $ballot['votingno'];
		$raw['salt'      ] = $ballot['salt'];
		$str = str_replace("\\/",'/', json_encode($raw)); // json_encode escapes / with \/ while JavaScript JSON.encode() does not 
		return $str;
	}

	function verifyBallots($voterReq, $blindedHashesFromDB) {
		// $voterReq: .ballots[] .electionId .VoteId   //.blindedHash[] .serversAlreadySigned[]
		//contains an array saying the x-th server has to sign y ballots
		// verify if user is allowed to vote and status of communication (done: pickBallots, next: signBallots) is correct
		// verify content of the ballot
		// verify if the correct number of ballots was sent: if (count($voterReq["ballots"]) != $this->numVerifyBallots) { WrongRequestException::throwException('not the correct number of ballots sent'); }
		$tmpret = array();
		for ($i=0; $i<count($voterReq["ballots"]); $i++) {
			// verify electionID
			if ($voterReq["ballots"][$i]['electionId'] != $this->electionId)               {
				WrongRequestException::throwException(210, 'Error: electionID is wrong', "expected electionID: $this->electionId, received electionID in ballot $i: " . $voterReq['ballots'][$i]['electionId']);
			}
			// verify if the sent ballot was requested
			$kw = in_array($voterReq['ballots'][$i]['ballotno'], $blindedHashesFromDB['requestedBallots']);
			if ($kw >= 0) {
				$requestedballots['sent'][$kw] = true;
			} else {
				WrongRequestException::throwException(211, "A Ballot was sent for verification purpose that was not requested", "verifyBallots: not requested ballot: " . $voterReq['ballots'][$i]['ballotno'] . "requested ballots: " . print_r($blindedHashesFromDB['requestedBallots'], true));
			}
			// verify hash
			$str = $this->ballot2strForSig($voterReq["ballots"][$i]);
			$blindedHashFromDatabase    = $blindedHashesFromDB['blindedHashes'][$voterReq['ballots'][$i]['ballotno']]['blindedHash'];
			$unblindf                   = $voterReq["ballots"][$i]['unblindf'];
			$hashOk = $this->crypt->verifyBlindedHash($str, $unblindf, $blindedHashFromDatabase);
  			if (! ($hashOk === true)) {
				WrongRequestException::throwException(212, "Error: hash wrong", "hash from signature: " . $verifyHash->toHex() . "calculated hash: $hashByMe");
			}
			// verify sigs from previous servers .ballots.sigs: .sig(encryptet previous sig or hash if first sig) .sigBy (name of the signing server in order to identify the correct public key)
			$sigsOk = false;
			if (isset($voterReq["ballots"][$i]['sigs'])) {
				$sigsOk = $this->crypt->verifySigs($str, $voterReq["ballots"][$i]['sigs']);
			} else { $sigsOk = true; } // no sigs there
			$tmpret[$i] = ($hashOk === true) && ($sigsOk === true);
			if ($i == 0) {
				$ret = ($tmpret[$i] === true);
			}
			else         { $ret = ($ret === true) && ($tmpret[$i] === true);
			}

			// TODO verify if votingId is unique
			// load $allvotingno from database
			// if (array_search($raw['votingno'], $allvotingno) == false) {$e = WrongRequestException::throwException... error("Voting number allocated"); return $e;}

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

	/**
	 * This functin is called from telly to check if the
	 * vote should be accepted
	 * @param unknown $vote
	 * @return boolean
	 */
	function verifyPermission($vote) {
		if (! isset($vote['permission']['sigs']) ) {
			WrongRequestException::throwException(400, "Error: permission does not have a signature from a permission server", "verifyPermission: complete vote: " . print_r($vote, true));
			return false;
		}
		if (count($vote['permission']['sigs']) < $this->numSigsRequiered) {
			WrongRequestException::throwException(401, "Error: permission does not have the requiered number of signatures from permission servers", "verifyPermission: requiered number of sigs from permission servers: " . $this->numSigsRequiered . 'number of sigs received: ' . count($vote['sigs']));
			return false;
		}
		$str = $this->ballot2strForSig($vote['permission']['signed']);
		return $this->crypt->verifySigs($str, $vote['permission']['sigs']);
	}
	
	function getAllPermissedBallots() {
		$signedBallots = $this->db->loadAllSignedBallots($this->electionId);  
		return $signedBallots;
	}
	
	function handlePermissionReq($req) {
		try {
			$voterReq = json_decode($req, true); //, $options=JSON_BIGINT_AS_STRING); // decode $req
			if ($voterReq == null) { // json could not be decoded
				WrongRequestException::throwException(100, 'Error while decoding JSON request', $req);
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
				case 'getAllPermissedBallots':
					$result = $this->getAllPermissedBallots($voterReq);
					break;
				default:
					WrongRequestException::throwException(101, 'Error unknown command', $req);
					break;
			}
		} catch (ElectionServerException $e) {
			$result = array('cmd' => 'error', 'errorTxt' => $e->errortxt, 'errorNo' => $e->errorno);
		}
		$ret = json_encode($result);
		return $ret;
	}
}


?>