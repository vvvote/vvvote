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

chdir(__DIR__); require_once './dbBlindedVoter.php';
chdir(__DIR__); require_once './../../tools/exception.php'; // I dont know why this works - the files are in different directories but this way php finds both
chdir(__DIR__); require_once './../../tools/crypt.php';
chdir(__DIR__); require_once './../../root-classes/blinder.php';

/**
 * Class that implements the blinded voter scheme
 *
 * errorno start at 1 and
 * errorno start at 100 and 200 and 300 and 1000 and 400
 * 
 * @author r
 *
 */

class BlindedVoter extends Blinder {
	var $electionId; // = 'wahl1';
	var $numVerifyBallots;
	var $numSignBallots;
	var $numAllBallots;
	var $numSigsRequiered;
	var $db;
	var $auth;
	var $crypt;

	function __construct($electionId_, $numVerifyBallots_, $questions_, $numSignBallots_, array $pServerKeys_, $serverkey_, $numAllBallots_, $numSigsRequiered_, $dbInfos, Auth $auth_) {
		$this->electionId       = $electionId_;
		$this->numVerifyBallots = $numVerifyBallots_;
		$this->questions		= $questions_;
		$this->numSignBallots   = $numSignBallots_;
		$this->numAllBallots    = $numAllBallots_;
		$this->db               = new DbBlindedVoter($dbInfos);
		$this->auth				= $auth_;
		$this->crypt            = new Crypt($pServerKeys_, $serverkey_);
		$this->numSigsRequiered = $numSigsRequiered_;
	}
	
	function setElectionId($electionId_) {
		$this->electionId = $electionId_;
	}

	/**
	 * Generates new keys for an election, returns the public part and 
	 * saves the private part in the database
	 * {@inheritDoc}
	 * @see Blinder::handleNewElectionReq()
	 */
	function handleNewElectionReq($electionId, $blinderData) {

		// verify the signatures already contained in $blinderData
		if ( isset($blinderData ['permissionServerKeys']) ) {
			foreach ($blinderData ['permissionServerKeys'] as $psname => $signedkey) {
				$ok = $this->verifyPermissionServerKey($psname, $signedkey, $electionId);
				if ($ok !== true)
					InternalServerError::throwException(8747856, 'Verification of election key failed', var_export($signedkey, true));
			}
		} else {
			$blinderData['permissionServerKeys'] = array ();
		}
		
		global $serverNo, $pServerKeys, $bitlengthElectionKeys;
		// $pk = $this->db->loadPrivateKey($electionId);
		
		$crypt_rsa = $this->getCrypt();
		$keypair = $crypt_rsa->createKey($bitlengthElectionKeys);
		$keystr = str_replace('\/', '/', json_encode($keypair));
		$crypt_rsa->loadKey($keypair['publickey']);
		$pubkey = array( // fields defined by JSON Web Key https://tools.ietf.org/html/draft-ietf-jose-json-web-key-41
				'kty' => 'RSA', // only RSA is supported by vvvote
				'n'   => base64url_encode($crypt_rsa->modulus->toBytes()),
				'e'   => base64url_encode($crypt_rsa->exponent->toBytes()),
				'kid' => $pServerKeys[$serverNo -1]['name'] . '.' . $electionId
		);
		// save private key in DB
		$ok = $this->db->savePrivateKey($electionId, $keypair);
		if (! $ok) InternalServerError::throwException(19, "Internal server error while saving private key", false);
		global $pserverkey;
		$ok = $crypt_rsa->loadKey($pserverkey['privatekey']);
		if (! $ok) InternalServerError::throwException(20, "Internal server error while parsing private permission server key", false);
		$sig = $crypt_rsa->sign(json_encode($pubkey));
		$sigBase64Url = base64url_encode($sig);
		// test
		// $base64urldec = base64url_decode($sigBase64Url);
		// $base64ok = ( $sig === $base64urldec);
		// $ok = $crypt_rsa->loadKey($pServerKeys[$serverNo -1]);
		// $verify = $crypt_rsa->verify(json_encode($pubkey), $sigBase64Url);
		$blinderData['permissionServerKeys'][$pServerKeys[$serverNo -1]['name']] = array('key' => $pubkey, 'sig' => $sigBase64Url);
		return $blinderData;
	}
	
	function verifyPermissionServerKey($pservername, $signedKey, $electionId) {
		global $serverNo, $pServerKeys;
		if ( ! is_string($pservername) ) InternalServerError::throwException(8747850, '$pservername must be a string', 'Got: >' . var_export($pservername, true). '<');
		$tmp = explode('.', $signedKey['key']['kid'], 2);
		$pservername2 = $tmp[0];
		if ($pservername2 === $signedKey['key']['kid']) InternalServerError::throwException(8747851, '<kid> must contain one >.<', 'Got this kid: >' . $signedKey['key']['kid'] . '<');
		if ($pservername2 !== $pservername) InternalServerError::throwException(8747852, 'Part before >.< in the <kid> does not match the permission server name', 'Got this kid: >' . $signedKey['key']['kid'] . '<, expected permission server name: >' . $pservername . '<');
		if ($tmp[1] !== $electionId) InternalServerError::throwException(8747849, 'Part after >.< in the <kid> does not match the electionId', 'Got this kid: >' . $signedKey['key']['kid'] . '<, expected election Id: >' . $electionId . '<');
		$i = find_in_subarray($pServerKeys, 'name', $pservername2);
		if ($i === false) InternalServerError::throwException(8747853, 'The needed long-term permission server key was not found', 'Looking for: >' . $pservername . '<');
		$crypt_rsa = $this->getCrypt();
		$base64urldec = base64url_decode($signedKey['sig']);
		$ok = $crypt_rsa->loadKey($pServerKeys[$i]);
		if ($ok !== true) InternalServerError::throwException(8747854, 'Failed to load long-term permission server key', 'key: >' . var_export($pServerKeys[$i], true) . '<');
		$verify = $crypt_rsa->verify(json_encode($signedKey['key']), $base64urldec);
		if ($verify !== true) InternalServerError::throwException(8747855, 'Verification of permission server keys failed', 'long-term key: >' . var_export($pServerKeys[$i], true) . '<', ', election key >' . var_export($signedKey, true) . '<');
		return $verify;
	}

	function getCrypt() {
		$crypt_rsa = new Crypt_RSA();
		$crypt_rsa->setHash('sha256');
		$crypt_rsa->setMGFHash('sha256');
		$crypt_rsa->setSaltLength($crypt_rsa->hash->getLength());
		$crypt_rsa->setSignatureMode(CRYPT_RSA_SIGNATURE_PKCS1);
		return $crypt_rsa;
	}
	
	function isInVoterList($credentials, $electionId) { 
		return $this->auth->checkCredentials($credentials, $electionId, 'registering');
	}

	function isFirstVote($credentials, $electionID, $threadId) {
		//read transactionlist
		//
		return true;
	}

	function isPermitted($credentials, $electionID_, $threadId) {
		// Hint: save req in log-database and check if first req --> not neccessary because the signed ballots are saved
		// TODO check if correct number of ballots was sent
		$inlist = $this->isInVoterList($credentials, $electionID_);
		if ($inlist !== true) {
			WrongRequestException::throwException(1, "Error: check of credentials failed. You are not in the list of allowed voters for this election or secret not accepted", 'isPermitted: credentials ' . var_export($credentials, true));
		}

		if ($this->electionId !== $electionID_) {
			WrongRequestException::throwException(2, 'Error: wrong election id', "isPermitted: No voting permission is given for election $electionID_, only $this->electionId is accepted");
		}
/* at the moment, this is tested later
		$firstVote = $this->isFirstVote($credentials, $electionID_, $threadId);
		if (!$firstVote) {
			WrongRequestException::throwException(3, "Error: This voter is already a voting permission given for the election $this->electionId If you lost your permission use the recover button.", "isPermitted: $voterReq[voterId] already got a voting permission from this server.");
		}
*/
		return $inlist;
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
		if (! isset($voterReq['credentials'])) WrongRequestException::throwException(436, 'Request does not contain credentials', var_export($voterReq, true));
		$permitted = $this->isPermitted($voterReq['credentials'], $this->electionId, 1); // $voterReq['voterId'], $voterReq['secret'], $voterReq['electionId'], 1); // @TODO substitude ThreadId for 1
		$voterId = $this->auth->getVoterId($voterReq['credentials'], $this->electionId);
		// TODO check if this is the first req for picking ballots
		foreach ($voterReq['questions'] as $i => $question) {
			// verify that there are the same numer of sigs on each question
			if ($i > 0) $prev_xthServer = $xthServer;
			$xthServer = $this->getXthServer($question['ballots']);
			if ($i > 0 && $xthServer !== $prev_xthServer) WrongRequestException::throwException(412, 'On each questition the number of already obtained sigs must be equal', $voterReq);
			// TODO verify that all properties of ballots are sent
			$numPick = $this->numVerifyBallots[$xthServer]; 
			$numBallots = count($question['ballots']); // TODO take from config?
			if ($numBallots <= array_sum($this->numSignBallots) ) WrongRequestException::throwException(432, 'not enough ballots sent', "$numBallots sent, at least " . array_sum($this->numSignBallots) + 1 . ' are necessary');
			// Take the number of ballots which has to be left to sign from $numSignBallots in loadconfig.php
			$requestBallots['questions'][$i]['picked'] = $this->pickBallots($numPick, $numBallots);
			$requestBallots['questions'][$i]['questionID'] = $question['questionID'];
		}
		$requestBallots['cmd'] = 'unblindBallots';
		// save requested Ballots(voterId, electionId);
		unset($voterReq['credentials']);
		$toSave = array('requestedBallots' => $requestBallots,
						'blindedHashes'    => $voterReq);
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

	/**
	 * find out the x-th server I am
	 * perfom some checks on the sigs
	 * @param unknown $voterReq
	 */
	function getXthServer($blindedHashesFromDbBallots) {
		$xthserver = 0;
		$numSigned = array();
		foreach ($blindedHashesFromDbBallots as $bh) {
			if (isset($bh['sigs'])) {
				$tmp = count($bh['sigs']);
				if (! isset($numSigned[$tmp -1]) ) $numSigned[$tmp -1] = 0;
				$numSigned[$tmp -1]++;
				if ($tmp > $xthserver) $xthserver = $tmp;
			}
		} 
		// TODO check if all first/second... signatures come from the same servers
		// TODO check if all prev sigs came from different servers
		// TODO check if all prev sigs did not come from this server
		
		// check if all previous servers signed the correct number of ballots/blindedHashes
		foreach ($numSigned as $xth => $num) { 
			if ($num != $this->numSignBallots[$xth] ) WrongRequestException::throwException(401, "Error: the number of already acquiered signatures does not match the configured number of signatures", "from server $xth, sigs acquiered $num should have acquiered " . $this->numSignBallots[$xth]);
		}
	return $xthserver;		
	}
	

	function signBallots($blindedHashesFromDB) {
		$ret = array();
		$xthserver = $this->getXthServer($blindedHashesFromDB['questions'][0]['ballots']); // find out the x-th server I am // verifyBallots already checked that the x-th server is identical on all questions
		foreach ($blindedHashesFromDB['questions'] as $q => $question) {
			
			// make an array of ballot numbers that can be signed (e.g. only already signed ones by previous servers are allowed that are not disclosed to this server
		/*
			$allowedBallots = array();
			foreach ($question['ballots'] as $ballot) {
				if (!in_array($ballot['ballotno'], $blindedHashesFromDB['questions'][$q]['picked'])) { // not disclosed to this server
					if ($xthserver == 0) array_push($allowedBallots, $ballot['ballotno']);
					else {
						if (isset($ballot['sigs']) && count($ballot['sigs']) == $xthserver)
							array_push($allowedBallots, $ballot['ballotno']);
					}
				}
			}
		*/
			$allowedBallots = array(0);
				
			if (count($allowedBallots) < 1) {
				WrongRequestException::throwException(301, "Error: no non-disclosed ballots left to sign", "signBallots: " . json_encode($allowedBallots));
			}
			if (count($allowedBallots) < $this->numSignBallots[$xthserver]) WrongRequestException::throwException(300, "Error: not enough non-disclosed ballots left to sign", "signBallots: left to sign: " . json_encode($allowedBallots));
			
			// pick the requiered number of ballots to be signed randomly
			$pickedtmp = $this->pickBallots($this->numSignBallots[$xthserver], count($allowedBallots));
			$picked = array();
			foreach ($pickedtmp as $num => $p) {
				$picked[$num] = $allowedBallots[$p];
			}
			// sign the picked ballots
			$completeElectionId = makeCompleteElectionId($blindedHashesFromDB['electionId'], $question['questionID']);
			$privKey = $this->db->loadPrivateKey($completeElectionId);
			global $serverNo, $pServerKeys;
			$privKey['serverName'] = $pServerKeys[$serverNo -1]['name'];
			// var_export($privKey);
			$crypt = new Crypt(array(), $privKey);
			$ballots = array();
			for ($i=0; $i<count($picked); $i++) {
				$ballot = array();
				$ballot['ballotno']    = $question['ballots'][$picked[$i]]['ballotno'];
				$ballot['blindedHash'] = $question['ballots'][$picked[$i]]['blindedHash'];
				if (isset ($question['ballots'][$picked[$i]]['sigs'])) $ballot['sigs'] = array_slice($question['ballots'][$picked[$i]]['sigs'], 0, null ,true);
				else                                                   $ballot['sigs'] = array();
				$ballot = $crypt->signBlindedHash($ballot['blindedHash'], $ballot);
				$ballots[$i] = $ballot;
			}
			$ret[$q] = array(
					'ballots'    => $ballots,
					'questionID' => $question['questionID']);
		}
		return $ret;
	}




	function signBallotsEvent($voterReq) {
		// in pickBallots-mode: check credentials? It is not necassary because providing the correct unblinding factors show that the Client is the one who sent the pickBallots-Request and back then the credentials have been verified. 
		// check credentials
		if (! isset($voterReq['credentials'])) WrongRequestException::throwException(436, 'Request does not contain credentials', var_export($voterReq, true));
		$permitted = $this->isPermitted($voterReq['credentials'], $this->electionId, 1); // $voterReq['voterId'], $voterReq['secret'], $voterReq['electionId'], 1); // @TODO substitude ThreadId for 1
		$voterId = $this->auth->getVoterId($voterReq['credentials'], $this->electionId);
		
		// load the blinded Hashes from cmd 'pickBallots'
		$voterId = $this->auth->getVoterId($voterReq['credentials'], $voterReq['electionId']); // TODO: this is nearly a duplication of the line above and gives the same result --> remove?
		$isFirstRequestSig = $this->db->isFirstReqForSign($voterReq['electionId'], $voterId);
		if (! ($isFirstRequestSig === true)) {
			WrongRequestException::throwException(301, 'Error: This server already signed a return envelop for you', "voterId: " . var_export($voterId, true));
		}
	/*
		$blindedHashesFromDB = $this->db->loadBlindedHashes($this->electionId, $voterId);
		if (count($blindedHashesFromDB) < 1) {
			WrongRequestException::throwException(302, 'Error: Sign request without request for disclosing ballots', "All requested ballots: " . var_export($blindedHashesFromDB, true));
		}
		$blindedHashesFromDB = $blindedHashesFromDB[0]['blindedHashes'];

		// verify ballots
		$verified = $this->verifyBallots($voterReq, $blindedHashesFromDB);
		if (! $verified) {
			WrongRequestException::throwException(300, 'Error: Ballot verification failed. I will not sign a ballot.', "voterreq: \n" . json_encode($voterReq)) . "loaded blinded hashes: " .  json_encode($blindedHashesFromDB);
		} // TODO: for debugging purpose only: add loaded ballots here
	*/
		// sign ballots 
		$signedBallots = $this->signBallots($voterReq);
		// encrypt $signedBallots so that only the voter can decrypt it

		$ret = array('questions' => $signedBallots);
		$tmp = array('voterId' => $voterId, 'signedBallots' => $signedBallots);
		if (count($ret['questions'][0]['ballots'][0]['sigs']) >= $this->crypt->getNumServers() ) {
			$ret['cmd'] = 'savePermission';
			// up to now it is only used for tally.js to show who requested a Wahlschein
			// maybe it should be used to avoid multi-threading problems
			$this->auth->onPermissionSend($this->electionId, $voterId);
		} else {
			$ret['cmd'] = 'reqSigsNextpServer';
		}
		
		// TODO think about: save all signed ballots not only the ones where this server is the last signer?
		$this->db->saveSignedBallots($this->electionId, $voterId, $tmp);
		
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
		$str = json_encode($raw);
		// $str = str_replace("\\/",'/', json_encode($raw)); // json_encode escapes / with \/ while JavaScript JSON.encode() does not --> in the java-script webclient / will be escaped to \/ 
		return $str;
	}

	function verifyBallots($voterReq, $blindedHashesFromDB) {
		// $voterReq: .ballots[] .electionId .VoteId   //.blindedHash[] .serversAlreadySigned[]
		//contains an array saying the x-th server has to sign y ballots
		// verify if user is allowed to vote and status of communication (done: pickBallots, next: signBallots) is correct
		// verify content of the ballot
		// verify if the correct number of ballots was sent: if (count($voterReq["ballots"]) != $this->numVerifyBallots) { WrongRequestException::throwException('not the correct number of ballots sent'); }
		$tmpret = array();
		if ($voterReq['electionId'] != $this->electionId) 	WrongRequestException::throwException(210, 'Error: electionID is wrong', "expected electionID: $this->electionId, received electionID in ballot $i: " . $voterReq['ballots'][$i]['electionId']);
		if ( (      ! isset($voterReq['questions'])) || (! is_array($voterReq['questions'])) ) WrongRequestException::throwException(223, "Error: questions must be set and an array", var_export($voterReq, true));
		for ($q=0; $q<count($voterReq['questions']); $q++) {
			if (         (!isset($voterReq["questions"][$q]['questionID'])) || 
			(! ( is_int($voterReq["questions"][$q]['questionID'] ) ||  is_string($voterReq["questions"][$q]['questionID']) ) )   ) WrongRequestException::throwException(227, 'Error: verifyBallots(): missing questionID or it is not of type int', $q);
			$qno = find_in_subarray($voterReq["questions"], 'questionID', $blindedHashesFromDB['blindedHashes']['questions'][$q]['questionID']);
			if ($qno === false) WrongRequestException::throwException(237, 'Error: All questions must be disclosed', 'Number in question array for which no questionID was found in voterrequest: ' . $q);
			if ( (! isset($voterReq['questions'][$q]['ballots'])) || (! is_array($voterReq['questions'][$q]['ballots'])) ) WrongRequestException::throwException(224, "/questions[].['ballots']/ must be set and of type array", var_export($voterReq, true));
			foreach ($blindedHashesFromDB['requestedBallots']['questions'][$q]['picked'] as $p) {
				$i = find_in_subarray($voterReq['questions'][$q]['ballots'], 'ballotno', $p); 
				if ($i === false) WrongRequestException::throwException(211, "A picked Ballot was not sent", "verifyBallots: not sent ballot: $p");
				$curVoterBallot = $voterReq["questions"][$qno]["ballots"][$i];
				
				if ( (!isset($curVoterBallot['unblindf'])  || (!is_string($curVoterBallot['unblindf']))) ) 	WrongRequestException::throwException(225, 'Error: /unblindf/ must be set and of type /string/', var_export($curVoterBallot, true));
				// verify if the sent ballot was requested
			//	$kw = array_search($curVoterBallot['ballotno'], $blindedHashesFromDB['requestedBallots']['questions'][$q]['picked']);
			//	if ($kw === false) WrongRequestException::throwException(211, "A Ballot was sent for verification purpose that was not requested", "verifyBallots: not requested ballot: " . $voterReq['ballots'][$i]['ballotno'] . "requested ballots: " . var_export($blindedHashesFromDB['requestedBallots'], true));
			//	$requestedballots['sent'][$kw] = true;
			//	}
				// verify hash
				$completeElectionId = makeCompleteElectionId($this->electionId, $blindedHashesFromDB['blindedHashes']['questions'][$q]['questionID']);
				$str = $this->ballot2strForSig($curVoterBallot, $completeElectionId);
				$blindedHashFromDatabase    = $blindedHashesFromDB['blindedHashes']['questions'][$q]['ballots'][$curVoterBallot['ballotno']]['blindedHash'];
				$unblindf                   = $curVoterBallot['unblindf'];
				$privKey = $this->db->loadPrivateKey($completeElectionId);
				// var_export($privKey);
				// var_export($this->electionId);
				$privKey['serverName'] = '';
				$crypt = new Crypt(array(), $privKey);
				$hashOk = $crypt->verifyBlindedHash($str, $unblindf, $blindedHashFromDatabase);
				if ($hashOk !== true) {
					WrongRequestException::throwException(212, "Error: hash wrong", "hash from signature: " . $verifyHash->toHex() . "calculated hash: $hashByMe");
				}
				// verify sigs from previous servers .ballots.sigs: .sig(encryptet previous sig or hash if first sig) .sigBy (name of the signing server in order to identify the correct public key)
				$sigsOk = false;
				if (isset($curVoterBallot['sigs'])) {
					$qnoTmp = find_in_subarray($this->questions, 'questionID', $voterReq["questions"][$q]['questionID']);
					if ($qnoTmp === false) WrongRequestException::throwException(2127645, "Error: could not find questionId in config", "looking for questionId: >" . $voterReq["questions"][$q]['questionID'] . "<");
					$pubkeys = $this->questions[$qnoTmp]['blinderData']['permissionServerKeys'];
					$crypt = new Crypt($pubkeys, $privKey, Crypt::KEY_TYPE_JWK); // privKey is not used by verifySigs but must be given
					$sigsOk = $crypt->verifySigs($str, $curVoterBallot['sigs']);
				} else { $sigsOk = true;} // no sigs there
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
			if ($q == 0) $retQ = $ret;
			else         $retQ = ($retQ === true) && ($ret === true);
		}
	return $retQ;
	}

	/**
	 * This functin is called from tally to check if the
	 * vote should be accepted
	 * @param unknown $vote
	 * @return boolean
	 */
	function verifyPermission($vote) {
		if (! isset($vote['permission']['sigs']) ) {
			WrongRequestException::throwException(400, "Error: permission does not have a signature from a permission server", "verifyPermission: complete vote: " . var_export($vote, true));
			return false;
		}
		if (count($vote['permission']['sigs']) < $this->numSigsRequiered) {
			WrongRequestException::throwException(401, "Error: permission does not have the requiered number of signatures from permission servers", "verifyPermission: requiered number of sigs from permission servers: " . $this->numSigsRequiered . 'number of sigs received: ' . count($vote['sigs']));
			return false;
		}
		$completeElectionId = $vote['permission']['signed']['electionId'];
		$electionIdParts = json_decode($completeElectionId, true);
		$qId = $electionIdParts['subElectionId'];
		$qnoTmp = find_in_subarray($this->questions, 'questionID', $qId);
		$pubkeys = $this->questions[$qnoTmp]['blinderData']['permissionServerKeys'];
		$crypt = new Crypt($pubkeys, false, Crypt::KEY_TYPE_JWK); // only the public keys are used, but a valid private key must be provided
		$str = $this->ballot2strForSig($vote['permission']['signed']);
		return $crypt->verifySigs($str, $vote['permission']['sigs']);
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
			//	var_export($voterReq);
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