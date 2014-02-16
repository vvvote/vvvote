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

require_once 'dbAuth.php';
require_once 'auth.php';
require_once 'exception.php';

/**
 * Provides an interface to oauth
 * 
 * errorno starts at 2700
 * @author r
 *
 */

class OAuth2 extends Auth {
	function __construct($dbInfo) {
		parent::__construct();
		$this->db = new DbOAuth($dbInfo);
	}


	/**
	 * return server credentials which are added to the answer to the voter
	 * it can also return a nonce or one time pad to be transformed by the voter
	 * in order to check voter credentials
	 */
	function addCredentials()  {

	}

	/**
	 * check the credentials sent from the voter
	 */
	function checkCredentials($voterreq) {
		return $this->db->checkCredentials($voterreq['electionId'], $voterreq['voterId'], $voterreq['secret']);
	}

	/**
	 * Import the list of voters and associated credentials into the database
	 * no use for this kind of auth module --> not implemented
	 * @param array $voterlist[number]['electionId']['voterID']['secret']
	 */
	function importCredentials($voterlist) {
		return true;
	}

	/**
	 * 
	 * @param unknown $electionId
	 * @param unknown $listId Id of the list of allowed voters. This Id must 
	 * match the Id of the list of allowed voters of the oauth (BEO) server
	 */
	function newElection($electionId, $listId) {
		return $this->db->newElection($electionId, $listId);
	}
	
	
	/**
	 * 
	 * @param unknown $electionId
	 * @param unknown $req : $req['listId']
	 */
	function handleNewElectionReq($electionId, $req) {
		if (isset($electionId) && isset($req['listId']) &&
				gettype($electionId) == 'string' && gettype($req['listId']) == 'string') 
		{
			return $this->newElection($electionId, $req['listId']);
		} else {
			WrongRequestException::throwException(2700, 'ElectionId or list Id not set or of wrong type', "request received: \n" . print_r($req, true));
		}
	}

}
?>