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
				array('name' => 'electionID'   , 'digits' =>   '100', 'json' => false), /* colunm definition */
				array('name' => 'voterId'      , 'digits' =>   '100', 'json' => false),
				array('name' => 'blindedHashes', 'digits' => '10000', 'json' => true)
				),
		      'pickedBallots' /* Table name */ => array(
				array('name' => 'electionID'   , 'digits' =>   '100', 'json' => false), /* colunm definition */
				array('name' => 'voterId'      , 'digits' =>   '100', 'json' => false),
				array('name' => 'pickedBallots', 'digits' => '10000', 'json' => true)
				),
			  'signedBallots' /* Table name */ => array(
				array('name' => 'electionID'   , 'digits' =>   '100', 'json' => false), /* colunm definition */
				array('name' => 'voterId'      , 'digits' =>   '100', 'json' => false),
				array('name' => 'signedBallots', 'digits' => '10000', 'json' => true)
				),
			  'VotingNos' /* Table name */ => array(
				array('name' => 'electionID'   , 'digits' =>   '100', 'json' => false), /* colunm definition */
				array('name' => 'voterId'      , 'digits' =>   '100', 'json' => false),
				array('name' => 'VotingNos'    , 'digits' =>  '5000', 'json' => true)
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