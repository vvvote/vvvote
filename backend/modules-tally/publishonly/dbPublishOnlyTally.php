<?php
require_once 'modules-db/dbMySql.php';
require_once 'dbBase.php';

class DbPublishOnlyTelly extends DbBase {
	function __construct($dbInfos) {
		$dbtables = 
		array('storedCorrectVotes' /* Table name */ => array(
				array('name' => 'electionID'        , 'digits' =>   '100'), /* colunm definition */
				array('name' => 'votingno'          , 'digits' =>  '5000'),
				array('name' => 'storedCorrectVotes', 'digits' => '10000')
				)
				);
		parent::__construct($dbInfos, $dbtables, true);
	}
	
	function  storeVote($electionId, $votingno, $vote) { 
		return $this->save(array(
								'electionId'         => $electionId, 
								'votingno'           => $votingno,
								'storedCorrectVotes' => json_encode($vote),
								), 
							'storedCorrectVotes');
	}
	
	
	
	function isFirstVote($electionId, $votingno) {
		$where = array('electionId' => $electionId, 'votingno' => $votingno);
		$got = $this->load($where, 'storedCorrectVotes', 'storedCorrectVotes');
		if ($got == false) {return true;}
		else               {return false;} 		
	}
	
	function getVotes($electionId) {
		$where = array('electionId' => $electionId);
		$got = $this->load($where, 'storedCorrectVotes', 'storedCorrectVotes');
		return $got;
	}
	
}