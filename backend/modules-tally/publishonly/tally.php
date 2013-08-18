<?php

/**
 * 
 * @author r
 * error no starts at 1100
 */

require_once __DIR__ . '/../../crypt.php';
require_once __DIR__ . '/../../Crypt/AES.php';
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
	function __construct($dbInfo, Crypt $crypt) {
		$this->db = new DbPublishOnlyTelly($dbInfo);
		$this->crypt = $crypt;
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
		// check the sigs of the permission servers
		
		$this->crypt->verifySigs($text, $arrayOfSigs);
		// check the sig of the voter on the vote
	}
	
	/**
	 * 
	 * return false if storing of the vote failed
	 * @param unknown $vote
	 */
	function store($electionId, $votingno, $voterreq) {
		return $this->db->storeVote($electionId, $votingno, $voterreq);
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
		// check if enough sigs from permission servers are sent along with the vote
		$electionId = $voterReq['permission']['signed']['electionId'];
		$votingno   = $voterReq['permission']['signed']['votingno'];
		
		$isfirstv = $this->isFirstVote($electionId, $votingno);
		if (! $isfirstv) {
			WrongRequestException::throwException(2000, ' For this election, a vote from you is already stored', "Election: $electionId, Voting number $votingno"); 
		}
        $this->store($electionId, $votingno, $voterReq);
		// TODO sign the vote
		return json_encode(array('cmd' => 'saveYourCountedVote')); // TODO sent the signed vote back
	}
	
	function getAllVotesEvent($voterReq) {
		// TODO check if client is allowed to see the election result (e.g. was allowed to vote / did vote himself)
		// TODO check if voting phase has ended
		// TODO check in election config database if only election admin can see all votes
		$allvotes = $this->db->getVotes($voterReq['electionId']);
		$ret = array ('data' => $allvotes, 'cmd' => 'verifyCountVotes');
		return $ret;
	}
	
	function handleTallyReq($req) {
		try {
			$voterReq = json_decode($req, true); //, $options=JSON_BIGINT_AS_STRING); // decode $req
			if ($voterReq == null) { // json could not be decoded
				WrongRequestException::throwException(1100, 'Telly: Error while decoding JSON request', $req);
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
					WrongRequestException::throwException(1101, 'Error unknown telly command', $req);
					break;
			}
		} catch (WrongRequestException $e) {
			$result = array('cmd' => 'error', 'errorTxt' => $e->errortxt, 'errorNo' => $e->errorno);
		}
		$ret = json_encode($result);
		return $ret;
	
	}
	
}