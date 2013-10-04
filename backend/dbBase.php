<?php
// create database: database name

// tables:
// * credentials:   electionId, voterId, secret
// * blindedHashes: electionId, voterId, JSON (ballots)
// * pickedBallots: electionId, voterID, JSON (picked)
// * signedBallots: electionId, voterID, JSON (ballots)
// * votingno: votingno
/*		self::$evtables = array(
 'blindedHashes',
		'pickedBallots',
		'signedBallots',
		'votingNos',
		'credentials'
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

require_once 'modules-db/dbMySql.php';

/**
 * This class is made in order to make it easy to implement the usage of
 * some other database. Just implement the used methods of dbMySql.php and add it
 * in the switch() in the constructor of this class
 * @author r
 *
 */
class DbBase {

	var $connection;
	var $prefix;
	//var $evtables = array(); // ev = election and voter tables

	// $dbtype = mysqlnd
	function __construct($dbInfos, $tables, $create = false) { // throws PDOException
		$this->prefix = $dbInfos['prefix'];
		switch ($dbInfos['dbtype']) {
			case 'mysql':
				$this->connection = new DbMySql($dbInfos, $tables, $create);
				break;
					
			default: // throw some error
				;
				break;
		}
	}

	/**
	 * Create all tables
	 */
	function createTables($dbname) { // throws PDOException
		return $this->connection->createTables($dbname);
	}

	/**
	 * Delete the content of all tables
	 */
	function resetDb() {
		return $this->connection->resetDb();
	}

	function save(array $cols, $tablename) {
		return $this->connection->save($cols, $tablename);
	}
	
	function saveElectionVoter($electionId, $voterId, $tablename, $colname, $forjson) {
		$saveStr = json_encode($forjson);
		return $this->save(array('electionId' => $electionId, 'voterId' => $voterId, $colname => $saveStr), $tablename);
	}	
/**
 * 
 * @param unknown $where array colname == value all pairs are treated as AND conditions
 * @param unknown $tablename
 * @param unknown $colname
 */
	function load($where, $tablename, $colname) {
		return $this->connection->load($where, $tablename, $colname);
	}
	
	function summarize($where, $groupby, $func, $funccol, $tablename, $colname) {
		return $this->connection->summarize($where, $groupby, $func, $funccol, $tablename, $colname);
	}
	
	
	/**
	 * Load $volname in table $tablename for $electionId and $voterId
	 * returns false if not successfull, json decoded array otherwise
	 * @param string $electionId
	 * @param string $voterId
	 * @param string $tablename
	 * @param string $colname
	 * @return Ambigous <boolean, multitype:mixed unknown >
	 */
	function loadElectionVoter($electionId, $voterId, $tablename, $colname) {
		return $this->load(array('electionId' => $electionId, 'voterId' => $voterId), $tablename, $colname);
	}
	
}
?>