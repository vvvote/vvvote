<?php
// create database: database name

// tables:
// * credentials:   electionId, voterId, secret
// * blindedHashes: electionId, voterId, JSON (ballots)
// * pickedBallots: electionId, voterID, JSON (picked)
// * signedBallots: electionId, voterID, JSON (ballots)
// * votingno: votingno


// reset database

class Db {

	var $connection;
	var $prefix;
	var $dbname;
	static $evtables = array(); // ev = election and voter tables

	// $dbtype = mysqlnd
	function __construct($dbhost, $dbuser, $dbpassw, $dbname, $prefix, $dbtype='mysql', $create = false) { // throws PDOException
		self::$evtables = array(
				'blindedHashes',
				'pickedBallots',
				'signedBallots',
				'votingNos',
				'credentials'
		);
		$this->prefix = $prefix;
		try {
			$this->connection = new PDO("$dbtype:host=$dbhost;dbname=$dbname", $dbuser, $dbpassw);
		} catch (PDOException $e) {
			// TODO check if non existing DB was the cause of teh error
			// if ($this->connection->connect_error) {
			//echo "construct4";
				
			// if ($create == true) {
			//echo "construct5: $dbtype";
				$this->connection = new PDO("$dbtype:host=$dbhost", $dbuser, $dbpassw);
			//echo "construct6";
				$this->connection->exec("CREATE DATABASE IF NOT EXISTS `$dbname`");
			//echo "construct7";
				//CREATE USER '$user'@'localhost' IDENTIFIED BY '$pass';
				//GRANT ALL ON `$this->dbname`.* TO '$user'@'localhost';
				//FLUSH PRIVILEGES;");
				$this->connection = new PDO("$dbtype:host=$dbhost;dbname=$dbname", $dbuser, $dbpassw);
			//echo "construct8";
				$this->createTables($dbname);
			// }
		}
		
	}

	/**
	 * Create all tables
	 * @param unknown $prefix
	 * @param unknown $credentials
	 */
	function createTables($dbname) { // throws PDOException
		echo "create Tablesy<br>\n";
		foreach (self::$evtables as $table) {
			$colname   = $table;
			$tablename = $this->prefix . $table;
			$sql = "CREATE TABLE $tablename (
			ElectionId varchar(100) NOT NULL,
			voterId varchar(100) NOT NULL,
			$colname varchar(10000) NOT NULL,
			id int not null auto_increment,
			primary key(id)
			) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;";
			echo $sql;
			$this->connection->exec($sql);
			$status = $this->connection->errorInfo();
			echo "<br>\n $status";
		}
	}


	/**
	 * Sets the list of voters and credentials
	 * @param array $voterlist[]['electionId']['voterID']['secret']
	 */
	function importVoterListFromArray($voterlist) {
		print_r($voterlist);
		$tname = $this->prefix . 'credentials'; 
		$sql  = "insert into $tname (electionId, voterId, credentials) values (:electionId, :voterId, :secret)";
		$stmt = $this->connection->prepare($sql);
		foreach ($voterlist as $voter) {
			$stmt->execute($voter);
		//	print "<br>\n";
		//	print_r($voter);
		//	print_r($stmt->errorInfo());
			
		}
	}

	function checkCredentials($electionId, $voterId, $secret) {
		$tname = $this->prefix . 'credentials'; 
		$sql  = "select credentials FROM $tname WHERE (electionId = :electionId AND voterId = :voterId)";
		$stmnt = $this->connection->prepare($sql);
		$stmnt->bindValue(':electionId', $electionId);
		$stmnt->bindValue(':voterId'   , $voterId);
		$stmnt->execute();
		// print_r($stmnt);
		$secretFromDb = $stmnt->fetch();
		// print "<br>\n secretFromDb: ";
		// print_r($secretFromDb);
		if ($secretFromDb === false)  {
			return false;
		}
		if ($secretFromDb['credentials'] == $secret) {
			return true;
		}
		return false;
	}

	/**
	 * Delete the content of all tables 
	 */
	function resetDb() {
		foreach (self::$evtables as $table) {
			$tablename = $this->prefix . $table;
			$sql = "DELETE FROM $tablename";
			$this->connection->exec($sql);
			// print_r($this->connection->errorInfo());
		}
	}

	function _save($electionId, $voterId, $tablename, $colname, $forjson) {
		$saveStr = json_encode($json);
		$statmnt = $this->connection->prepare("INSERT INTO :tablename (electionId, voterId, :colname) VALUES (:electionId, :voterId, :json)");
		$statmnt->bindValue(':tablename' , $this->prefix . $tablename);
		$statmnt->bindValue(':electionId', $electionId);
		$statmnt->bindValue(':voterId'   , $voterId);
		$statmnt->bindValue(':colname'   , $colname);
		return $statmnt->execute();
	}

	function _load($electionId, $voterId, $tablename, $colname) {
		$statmnt = $this->connection->prepare('SELECT :colname FROM :tablename WHERE (electionId = :electionId AND voterId  = :voterId  )');
		$statmnt->bindValue(':tablename' , $this->prefix . $tablename);
		$statmnt->bindValue(':electionId', $electionId);
		$statmnt->bindValue(':voterId'   , $voterId);
		$statmnt->bindValue(':colname'   , $colname);
		$got = $statmnt->fetchAll();
		if ($got === false) return false;
		foreach ($got as $num => $gotrow) {
			$ret[$num] = json_decode($gotrow);
		}
		return $ret;
	}


	function saveBlindedHashes($electionId, $voterId, $jsonblindedHashes) {
		return $this->_save($electionId, $voterId, 'blindedHashes', 'blindedHashes', $jsonblindedHashes);
		/*		$statemnt = $this->connection->prepare('INSERT INTO blindedHashes (electionId, voterId, jsonHash) VALUES (:electionId, :voterId, :jsonHash)');
		 $statemnt->bindValue(':electionId', $electionId);
		$statemnt->bindValue(':voterId'   , $voterId);
		$statemnt->bindValue(':jsonHash'  , $jsonblindedHashes);
		$statemnt->execute();
		*/
	}

	function loadBlindedHashes($electionId, $voterId) {
		return $this->_load($electionId, $voterId, 'blindedHashes', 'blindedHashes');
	}



}
?>