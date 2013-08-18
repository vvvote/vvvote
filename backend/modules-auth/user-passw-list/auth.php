<?php
require_once 'dbAuth.php';
require_once 'auth.php';

class UserPasswAuth extends Auth {
	function __construct($dbInfo) {
		parent::__construct();
		$this->db = new DbAuth($dbInfo);
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
	 * @param array $voterlist[number]['electionId']['voterID']['secret']
	 */
	function importCredentials($voterlist) {
		return $this->db->importVoterListFromArray($voterlist);
	}
	
	/**
	 * Return the html5 code to be integrated into the webpage
	 * For the correct application use stylesheet use id="password" and id="username"
	 */
	function getAuthHtml() {
	
	}
	
}