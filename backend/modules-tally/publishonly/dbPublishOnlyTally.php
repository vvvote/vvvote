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



require_once 'modules-db/dbMySql.php';
require_once 'dbBase.php';

class DbPublishOnlyTally extends DbBase {
	function __construct($dbInfos) {
		$dbtables = 
		array('storedCorrectVotes' /* Table name */ => array(
				array('name' => 'electionId'        , 'digits' =>   '100', 'json' => false), /* colunm definition */
				array('name' => 'votingno'          , 'digits' =>  '5000', 'json' => false),
				array('name' => 'vote'              , 'digits' =>    '50', 'json' => false),
				array('name' => 'storedCorrectVotes', 'digits' => '10000', 'json' => true)
				)
				);
		parent::__construct($dbInfos, $dbtables, true);
	}
	
	function  storeVote($electionId, $votingno, $vote, $voterReq) { 
		return $this->save(array(
								'electionId'         => $electionId, 
								'votingno'           => $votingno,
								'vote'               => $vote,
								'storedCorrectVotes' => $voterReq,
								), 
							'storedCorrectVotes');
	}
	
	
	
	function isFirstVote($electionId, $votingno) {
		$where = array('electionId' => $electionId, 'votingno' => $votingno);
		$got = $this->load($where, 'storedCorrectVotes', 'storedCorrectVotes');
		if (count($got) === 0) {return true;}
		else                   {return false;} 		
	}
	
	function getVotes($electionId) {
		$where = array('electionId' => $electionId);
		$got = $this->load($where, 'storedCorrectVotes', 'storedCorrectVotes');
		return $got;
	}
	
	/**
	 * 
	 * @param unknown $electionId
	 * @return unknown
	 */
	function getResult($electionId) {
		// TODO better copy all correct votes to a new table
		// TODO get freqs
		$where = array('electionId' => $electionId);
		$got = $this->summarize($where, 'vote', 'count', 'votingno', 'storedCorrectVotes', 'vote');
		return $got;
	}
	
}