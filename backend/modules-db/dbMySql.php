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
			// may be the connection did not work because the database is still not created --> we try to create it. 
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
	
	/**
	 * creates the tables and adds coulumns if not already present
	 */
	function createTables() { // throws PDOException
		// echo "create Tables<br>\n";
		foreach ($this->evtables as $tname => $tabledef) {
			$colstr = '';
			$tablename = $this->prefix . $tname;
				
			foreach ($tabledef as $col) {
//				if (strlen($colstr) > 0) $colstr = $colstr . ', \n';
				switch ($col['digits']) {
					case 'TEXT':        $colstr = $colstr . $col['name'] . " TEXT, ";                       break;
					case 'MEDIUMTEXT':  $colstr = $colstr . $col['name'] . " MEDIUMTEXT, ";                 break;
					case 'LONGTEXT':    $colstr = $colstr . $col['name'] . " LONGTEXT, ";                   break;
					default:			$colstr = $colstr . $col['name'] . " varchar(${col['digits']}), ";	break;
				}
			}
			$sql = "CREATE TABLE IF NOT EXISTS $tablename (
			$colstr
			id int not null auto_increment,
			primary key(id)
			) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;";
			// echo $sql;
			$this->connection->exec($sql);
			$status = $this->connection->errorInfo();

			// add all columns to the table (ignoring error if coulumn not already exists)
			$sql2 = 'DROP PROCEDURE IF EXISTS foo;'; //"delimiter //";
			$this->connection->exec($sql2);
			$status = $this->connection->errorInfo();
				
			$sql2 = 'create procedure foo()
					begin 
					declare continue handler for 1060 begin end;'; // ignore error if column already exists
			foreach ($tabledef as $col) {
				$sql2 = $sql2 . 'alter table ' . $tablename . ' add '. $col['name'] . " varchar(${col['digits']}); ";
			}
			$sql2 = $sql2 . 'end;';
			$this->connection->exec($sql2);
			$status = $this->connection->errorInfo();
			
			$sql2 = 'call foo();';
			$this->connection->exec($sql2);
			$status = $this->connection->errorInfo();
			
			$sql2 = 'DROP PROCEDURE IF EXISTS foo;';
			$this->connection->exec($sql2);
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
		var_export($voterlist);
		$tname = $this->prefix . 'credentials';
		$sql  = "insert into $tname (electionId, voterId, credentials) values (:electionId, :voterId, :secret)";
		$stmt = $this->connection->prepare($sql);
		foreach ($voterlist as $voter) {
			$stmt->execute($voter);
			//	print "<br>\n";
			//	var_export($voter);
			//	var_export($stmt->errorInfo());
				
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
			// var_export($this->connection->errorInfo());
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
	
	/**
	 * 
	 * @param unknown $cols
	 * @param unknown $tablename
	 * @return bool true on success or false on failure 
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
	
	function load($where, $tablename, $colname, $sortcol='') {
		$wherestr = $this->_makewherestr($where);
		$tname = $this->prefix . $tablename;
		if ($sortcol=='') $statmnt = $this->connection->prepare("SELECT $colname FROM $tname $wherestr");
		else              $statmnt = $this->connection->prepare("SELECT $colname FROM $tname $wherestr ORDER BY $sortcol");
		foreach ($where as $name => $cond) {
			$statmnt->bindValue(":$name", $cond);
		}
		$status = $statmnt->execute();
		$got = $statmnt->fetchAll();
		return $got; 
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
			$ret[$num] = json_decode($gotrow[0], true); // TODO only json_decode if the column is marked as JSON
			if ($ret[$num] == null) $ret[$num] = $gotrow[0]; // it's not JSON encoded
		}
		return $ret;
		
	}

	function prepare($statement) {
		return $this->connection->prepare($statement);
	}
}
?>