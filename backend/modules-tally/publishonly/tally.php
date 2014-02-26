<?php

/**
 * 
 * @author r
 * error no starts at 1100
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

require_once __DIR__ . '/../../crypt.php';
require_once __DIR__ . '/../../exception.php';
require_once __DIR__ . '/dbPublishOnlyTally.php';

/**
 * Class that just collects and publishes the votes
 * errorno starts at 2000
 * @author r
 *
 */
class PublishOnlyTelly {
	var $db;
	var $crypt;
	var $election;
	function __construct($dbInfo, Crypt $crypt, Election $election_) {
		$this->db = new DbPublishOnlyTelly($dbInfo);
		$this->crypt = $crypt;
		$this->election = $election_;
	}
	
	function isFirstVote($electionId, $votingno) { // TODO make sure that this is called only after the sigs have been checked
		return $this->db->isFirstVote($electionId, $votingno);
	}
	
	/*function makeStrFromBallot(ballot) {
		var tmp = Object();
		tmp. 
	}
	*/
	
	function sigsOk($vote) {
		// check the sig of the voter on the vote
		$votersigOk = $this->crypt->verifyVoterSig($vote);
		if (! ($votersigOk === true) ) return false;
		// check the sigs of the permission servers
		$permissionSigsOk = $this->election->verifyPermission($vote);
		
		return  ($votersigOk && $permissionSigsOk);
	}
	
	/**
	 * 
	 * return false if storing of the vote failed
	 * @param unknown $vote
	 */
	function store($electionId, $votingno, $vote, $voterreq) {
		return $this->db->storeVote($electionId, $votingno, $vote, $voterreq);
	}
	
	/*
	 function decrypVoterReq($voterReq) {
		$encryptedkey = $voterReq['enckey'];
		$encmethod = $voterReq['encType'];
		$hmacmethos = $voterReq['hmacType'];
		$hmacEncKey = $voterReq['hmacKey'];
		$hmacKey = $this->crypt->decrypt($hmacEncKey);
		$ciphered = $voterReq['ciphered'];
		// TODO maybe you want message integrity check (if you think encryption CBC-AES is not enough to ensure that no one can alter it in a certain way) add another key and calculate a HMAC
		$decryptedkey = $this->crypt->decrypt($encryptedkey); // TODO may be you want deffie-hellman key exchange here in order to provide perfect forward security. But if you plan to publish the votes anyway, it is not needed. 
		switch ($method) {
			case 'aes160':
				$engine = new Crypt_AES(CRYPT_AES_MODE_CBC);
			    $engine->setKey($decryptedkey);
				$decryptedVoteStr = $engine->decrypt($ciphered);
			break;
			
			default:
				WrongRequestException::throwException(1102, 'Telly-decryptVoterReq: cipher not supported', "requested cipher: $method, supported aes160 only");
			break;
		}
		$decryptedVote = json_decode($decryptedVoteStr);
		if ($decryptedVote == null) { // json could not be decoded
			WrongRequestException::throwException(1103, 'Telly-decrypt: Error while decoding JSON request', $req);
		}
		return $decryptedVote; 
	}
	*/
	
	function storeVoteEvent($voterReq) {
		// $vote = $this->decrypVoterReq($voterReq);
		// check if the voting is open for the given electionId (period in time)
		try {
			$electionId = $voterReq['permission']['signed']['electionId'];
			$votingno   = $voterReq['permission']['signed']['votingno'];
			$vote       = $voterReq['vote']['vote'];
		} catch (OutOfBoundsException $e) {
			WrongRequestException::throwException(1102, 'The request ist missing >electionId< and/or >votingno<', "complete request: " . print_r($voterReq, true));
		} catch (OutOfRangeException $e) {
			WrongRequestException::throwException(1103, 'The request ist missing >electionId< and/or >votingno<', "complete request: " . print_r($voterReq, true));
		}
		$isfirstv = $this->isFirstVote($electionId, $votingno);
		if (! $isfirstv) {
			WrongRequestException::throwException(1102, 'For this election, a vote from you is already stored', "Election: $electionId, Voting number $votingno");
		}
		try {
			$ok = $this->sigsOk($voterReq);
			if ($ok) {
				$this->store($electionId, $votingno, $vote, $voterReq);
			} else WrongRequestException::throwException(1104, 'Signature verification failed.', ''); ;
		} catch (Exception $e) {
			WrongRequestException::throwException(1104, 'Signature verification failed.', "details: " . $e->__toString() ); ;
		}
		// TODO sign the vote and send it back
		return array('cmd' => 'saveYourCountedVote'); // TODO sent the signed vote back
	}

	function getAllVotesEvent($voterReq) {
		// TODO check if client is allowed to see the election result (e.g. was allowed to vote / did vote himself)
		// TODO check if voting phase has ended
		// TODO check in election config database if only election admin can see all votes
		$allvotes = $this->db->getVotes($voterReq['electionId']);
		$result = $this->db->getResult($voterReq['electionId']);
		/* TODO move this to a new function getResult / EndElection
		foreach ($allvotes as $vote) {
			$this->sigsOk($vote);
		}
		*/
//		$blindedInfos = $this->election->getBlindedInfos(); // infos from blinding module 
		$ret = array ('data' => array('allVotes' => $allvotes),  
				      'cmd' => 'verifyCountVotes');
		return $ret;
	}
	
	function handleTallyReq($req) {
		try {
			$voterReq = json_decode($req, true); //, $options=JSON_BIGINT_AS_STRING); // decode $req
			if ($voterReq == null) { // json could not be decoded
				WrongRequestException::throwException(1100, 'Tally: Error while decoding JSON request', $req);
			}
			$result = array();
			//	print "voterReq\n";
			//	print_r($voterReq);
			// $this.verifysyntax($result);
			switch ($voterReq['cmd']) {
				case 'storeVote':
					$result = $this->storeVoteEvent($voterReq);
					break;
				case 'getAllVotes':
					$result = $this->getAllVotesEvent($voterReq);
					break;
				default:
					WrongRequestException::throwException(1101, 'Error unknown tally command (accepting "storeVote" and "getAllVotes" only)', $req);
					break;
			}
		} catch (ElectionServerException $e) {
			$result = $e->makeServerAnswer();
		}
		$ret = json_encode($result);
		return $ret;
	
	}
	
}