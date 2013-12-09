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
	}
	
	function loadBlindedHashes($electionId, $voterId) {
		return $this->loadElectionVoter($electionId, $voterId, 'blindedHashes', 'blindedHashes');
	}
	
	function saveSignedBallots($electionId, $voterId, $signedBallotsForJSON) {
		return $this->saveElectionVoter($electionId, $voterId, 'signedBallots', 'signedBallots', $signedBallotsForJSON);
	}
	
	function loadAllSignedBallots($electionId) {
		return $this->load(array('electionID' => $electionId), 'signedBallots', 'signedBallots');
	}
	
}

?>