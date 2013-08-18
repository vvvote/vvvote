<?php
require_once 'modules-db/dbMySql.php'; 
require_once 'dbBase.php';

class DbBlindedVoter extends DbBase {
	function __construct($dbInfos) {
		$dbtables =
		array('blindedHashes' /* Table name */ => array(
				array('name' => 'electionID'   , 'digits' =>   '100'), /* colunm definition */
				array('name' => 'voterId'      , 'digits' =>   '100'),
				array('name' => 'blindedHashes', 'digits' => '10000')
				),
		      'pickedBallots' /* Table name */ => array(
				array('name' => 'electionID'   , 'digits' =>   '100'), /* colunm definition */
				array('name' => 'voterId'      , 'digits' =>   '100'),
				array('name' => 'pickedBallots', 'digits' => '10000')
				),
			  'signedBallots' /* Table name */ => array(
				array('name' => 'electionID'   , 'digits' =>   '100'), /* colunm definition */
				array('name' => 'voterId'      , 'digits' =>   '100'),
				array('name' => 'signedBallots', 'digits' => '10000')
				),
			  'VotingNos' /* Table name */ => array(
				array('name' => 'electionID'   , 'digits' =>   '100'), /* colunm definition */
				array('name' => 'voterId'      , 'digits' =>   '100'),
				array('name' => 'VotingNos'    , 'digits' =>  '5000')
				)
		);
		
		parent::__construct($dbInfos, $dbtables, true);
	}
	
	function saveBlindedHashes($electionId, $voterId, $blindedHashesForJSON) {
		return $this->saveElectionVoter($electionId, $voterId, 'blindedHashes', 'blindedHashes', $blindedHashesForJSON);
		/*		$statemnt = $this->connection->prepare('INSERT INTO blindedHashes (electionId, voterId, jsonHash) VALUES (:electionId, :voterId, :jsonHash)');
		 $statemnt->bindValue(':electionId', $electionId);
		$statemnt->bindValue(':voterId'   , $voterId);
		$statemnt->bindValue(':jsonHash'  , $jsonblindedHashes);
		$statemnt->execute();
		*/
	}
	
	function loadBlindedHashes($electionId, $voterId) {
		return $this->loadElectionVoter($electionId, $voterId, 'blindedHashes', 'blindedHashes');
	}
	
}

?>