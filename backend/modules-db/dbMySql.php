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


// create database: database name

// tables:
// * credentials:   electionId, voterId, secret
// * blindedHashes: electionId, voterId, JSON (ballots)
// * pickedBallots: electionId, voterID, JSON (picked)
// * signedBallots: electionId, voterID, JSON (ballots)
// * votingno: votingno


// reset database

class DbMySql { // TODO dbBase

	var $connection;
	var $prefix;
	var $evtables = array(); // ev = election and voter tables

	// $dbtype = mysqlnd
	/**
	 *
	 * @param array $dbInfos: array('dbtype' => 'mysql', 'dbname' => 'database_name', 'dbuser' => 'sql_user_name', 'dbpassw' => 'sql_user_passw');
	 * @param boolean $create
	 * @return boolean true: Database existed, false: database newly created
	*/
	function __construct($dbInfos, $tables, $create = false) { // throws PDOException
		// $dbInfos-> $dbhost, $dbuser, $dbpassw, $dbname, $prefix
		$this->prefix = $dbInfos['prefix'];
		$this->evtables = $tables;
		try {
			$this->connection = new PDO("{$dbInfos['dbtype']}:host={$dbInfos['dbhost']};dbname={$dbInfos['dbname']}", $dbInfos['dbuser'], $dbInfos['dbpassw']);
		} catch (PDOException $e) {
			// TODO check if non existing DB was the cause of the error
			// if ($this->connection->connect_error) {
			//echo "construct4";

			// if ($create == true) {
			//echo "construct5: $dbtype";
			$this->connection = new PDO("{$dbInfos['dbtype']}:host={$dbInfos['dbhost']}", $dbInfos['dbuser'], $dbInfos['dbpassw']);
			//echo "construct6";
			$this->connection->exec("CREATE DATABASE IF NOT EXISTS `{$dbInfos['dbname']}`");
			//echo "construct7";
			//CREATE USER '$user'@'localhost' IDENTIFIED BY '$pass';
			//GRANT ALL ON `$this->dbname`.* TO '$user'@'localhost';
			//FLUSH PRIVILEGES;");
			$this->connection = new PDO("{$dbInfos['dbtype']}:host={$dbInfos['dbhost']};dbname={$dbInfos['dbname']}", $dbInfos['dbuser'], $dbInfos['dbpassw']);
			//echo "construct8";
			$this->createTables();
			return false;
			// }
		}
		if ($create) $this->createTables();
		return true;
	}

	/**
	 * Create all tables
	 * @param unknown $prefix
	 * @param unknown $credentials
	 */ /*
	function createTablesX() { // throws PDOException
		// echo "create Tables<br>\n";
		foreach ($this->evtables as $table) {
			$colname   = $table;
			$tablename = $this->prefix . $table;
			$sql = "CREATE TABLE IF NOT EXISTS $tablename (
			electionId varchar(100) NOT NULL,
			voterId varchar(100) NOT NULL,
			$colname varchar(10000) NOT NULL,
			id int not null auto_increment,
			primary key(id)
			) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;";
			// echo $sql;
			$this->connection->exec($sql);
			$status = $this->connection->errorInfo();
			// echo "<br>\n $status";
		}
	}
*/
	function createTables() { // throws PDOException
		// echo "create Tables<br>\n";
		foreach ($this->evtables as $tname => $tabledef) {
			$colstr = '';
			$tablename = $this->prefix . $tname;
				
			foreach ($tabledef as $col) {
//				if (strlen($colstr) > 0) $colstr = $colstr . ', \n'; 
				$colstr = $colstr . $col['name'] . " varchar(${col['digits']}), ";
			}
			$sql = "CREATE TABLE IF NOT EXISTS $tablename (
			$colstr
			id int not null auto_increment,
			primary key(id)
			) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;";
			// echo $sql;
			$this->connection->exec($sql);
			$status = $this->connection->errorInfo();
			// echo "<br>\n $status";
		}
	}
	
	
	
	/**
	 * Sets the list of voters and credentials
	 * @param array $voterlist[number]['electionId']['voterID']['secret']
	 */
	// TODO this method should be moved into dbBase or later into an admin-module
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


	/**
	 * Delete the content of all tables
	 */
	function resetDb() {
		foreach ($this->evtables as $table => $kw) {
			$tablename = $this->prefix . $table;
			$sql = "DELETE FROM $tablename";
			$this->connection->exec($sql);
			// print_r($this->connection->errorInfo());
		}
	}
/*
	function _saveXX($electionId, $voterId, $tablename, $colname, $forjson) {
		$saveStr = json_encode($forjson);
		return $this->_save(array('electionId' => $electionId, 'voterId' => $voterId, $colname => $saveStr), $tablename);
		/*$tname = $this->prefix . $tablename;
		$statmnt = $this->connection->prepare("INSERT INTO $tname (electionId, voterId, $colname) VALUES (:electionId, :voterId, :json)");
		// $statmnt->bindValue(':tablename' , $this->prefix . $tablename);
		$statmnt->bindValue(':electionId', $electionId);
		$statmnt->bindValue(':voterId'   , $voterId);
		//		$statmnt->bindValue(':colname'   , $colname);
		$statmnt->bindValue(':json'      , $saveStr);
		$ret = $statmnt->execute();
		$status = $this->connection->errorInfo();
		return $ret; 
	}
*/
	function save($cols, $tablename) {
		$tname = $this->prefix . $tablename;
		$colsstr = '(';
		$valstr = '(';
		foreach ($cols as $name => $cond) {
			if (substr($colsstr, -1, 1) != '(' ) {
				$colsstr = $colsstr . ', ';
				$valstr = $valstr . ', ';
			}
			$colsstr = $colsstr . $name;
			$valstr = $valstr . ':' . $name;
		}
		$colsstr = $colsstr . ')';
		$valstr  = $valstr  . ')';
		$statmnt = $this->connection->prepare("INSERT INTO $tname $colsstr VALUES $valstr");
		foreach ($cols as $name => $val) {
			$statmnt->bindValue(":$name", $val);
		}
		$ret = $statmnt->execute();
		$status = $this->connection->errorInfo();
		return $ret;
	}
	
/*	function _load($electionId, $voterId, $tablename, $colname) {
		$tname = $this->prefix . $tablename;
		$statmnt = $this->connection->prepare("SELECT $colname FROM $tname WHERE (electionId = :electionId AND voterId  = :voterId  )");
		$statmnt->bindValue(':electionId', $electionId);
		$statmnt->bindValue(':voterId'   , $voterId);
		$status = $statmnt->execute();
		$got = $statmnt->fetchAll();
		if ($got === false) return false;
		$ret = array();
		foreach ($got as $num => $gotrow) {
			$ret[$num] = json_decode($gotrow[0], true);
		}
		return $ret;
	}
*/
	
	function _makewherestr($where) {
		$wherestr = 'WHERE (';
		foreach ($where as $name => $cond) {
			if (substr($wherestr, -1, 1) != '(' ) $wherestr = $wherestr . ' AND ';
			$wherestr = $wherestr . $name . ' = :' . $name;
		}
		$wherestr = $wherestr . ')';
		return $wherestr;
	}
	
	function load($where, $tablename, $colname) {
		$wherestr = $this->_makewherestr($where);
		$tname = $this->prefix . $tablename;
		$statmnt = $this->connection->prepare("SELECT $colname FROM $tname $wherestr");
		foreach ($where as $name => $cond) {
			$statmnt->bindValue(":$name", $cond);
		}
		$status = $statmnt->execute();
		$got = $statmnt->fetchAll();
		if ($got === false) return false;
		// $ret = array();
		// foreach ($got as $num => $gotrow) {
		//		$ret[$num] = json_decode($gotrow[0], true);
		//		if ($ret[$num] == null) $ret[$num] = $gotrow[0]; // it's not JSON encoded
		//}
		return $got; // $ret;
	}
	
	function summarize($where, $groupby, $func, $funccol, $tablename, $colname) {
		$wherestr = $this->_makewherestr($where);
		$tname = $this->prefix . $tablename;
		$statmnt = $this->connection->prepare("SELECT $colname, $func($funccol) FROM $tname $wherestr GROUP BY $groupby");
		foreach ($where as $name => $cond) {
			$statmnt->bindValue(":$name", $cond);
		}
		$status = $statmnt->execute();
		$got = $statmnt->fetchAll();
		if ($got === false) return false;
		$ret = array();
		foreach ($got as $num => $gotrow) {
			$ret[$num] = json_decode($gotrow[0], true);
			if ($ret[$num] == null) $ret[$num] = $gotrow[0]; // it's not JSON encoded
		}
		return $ret;
		
	}

	function prepare($statement) {
		return $this->connection->prepare($statement);
	}
}
?>