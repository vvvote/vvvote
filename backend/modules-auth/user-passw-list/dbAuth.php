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

chdir(__DIR__); require_once './../../tools/dbBase.php';

class DbAuth extends DbBase {
	
	function __construct($dbInfos) {
		$dbtables =
		array('up_credentials' /* Table name */ => array(
				array('name' => 'electionID'    , 'digits' => '100', 'json' => false), /* colunm definition */
				array('name' => 'voterId'       , 'digits' => '100', 'json' => false),
				array('name' => 'up_credentials', 'digits' => '100', 'json' => false)
		));
		parent::__construct($dbInfos, $dbtables, true);
	}
	
	/**
	 * Sets the list of voters and credentials
	 * @param array $voterlist[number]['electionId']['voterID']['secret']
	 */
	function importVoterListFromArray($voterlist) { // TODO make a method in dbBase to import an array
		print_r($voterlist);
		$tname = $this->prefix . 'up_credentials';
		$sql  = "insert into $tname (electionId, voterId, up_credentials) values (:electionId, :voterId, :secret)";
		$stmt = $this->connection->prepare($sql);
		foreach ($voterlist as $voter) {
			$stmt->execute($voter);
			//	print "<br>\n";
			//	print_r($voter);
			//	print_r($stmt->errorInfo());
				
		}
	}
	
	function checkCredentials($electionId, $voterId, $secret) { 
		$secretFromDb = $this->loadElectionVoter($electionId, $voterId, 'up_credentials', 'up_credentials');	
		if ($secretFromDb[0] === $secret) {
			return true;
		}
		return false;
	}
	
	
}

?>