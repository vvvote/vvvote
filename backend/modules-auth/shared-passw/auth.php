<?php
require_once 'dbAuth.php';
require_once 'auth.php';
require_once 'exception.php';

/**
 * Provides an easy auth mechanism: everyone is allowed to vote
 * who knows the election password
 * 
 * errorno starts at 2000
 * @author r
 *
 */

class SharedPasswAuth extends Auth {
	function __construct($dbInfo) {
		parent::__construct();
		$this->db = new DbSharedPasswAuth($dbInfo);
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

	function newElection($electionId, $sharedSecret) {
		return $this->db->newElection($electionId, $sharedSecret);
	}
	
	/**
	 * Return the html5 code to be integrated into the webpage
	 * For the correct application use stylesheet use id="password" and id="username"
	 */
	function getAuthHtml() {

	}
	
	/**
	 * 
	 * @param unknown $electionId
	 * @param unknown $req : $$req['sharedPassw']
	 */
	function handleNewElectionReq($electionId, $req) {
		if (isset($electionId) && isset($req['sharedPassw']) &&
				gettype($electionId) == 'string' && gettype($req['sharedPassw']) == 'string') 
		{
			return $this->newElection($electionId, $req['sharedPassw']);
		} else {
			WrongRequestException::throwException(2000, 'ElectionId or shared password not set or of wrong type', "request received: \n" . print_r($req, true));
		}
	}

}
?>