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
require_once __DIR__ . '/../../auth.php';
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
	const name = "sharedPassw";
	
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
	function checkCredentials($credentials, $electionId, $phase) {
		$inDateRange = parent::checkCredentials($credentials, $electionId, $phase); //checks the phase time frame
		if ($inDateRange !== true) return false;
		
		return $this->db->checkCredentials($electionId, $credentials['voterId'], $credentials['secret']);
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
	 * 
	 * @param unknown $electionId
	 * @param unknown $req : $$req['sharedPassw']
	 */
	function handleNewElectionReq($electionId, $req) {
		$authConfig = parent::handleNewElectionReq($electionId, $req);
		if (isset($electionId) && isset($req['sharedPassw']) &&
				gettype($electionId) == 'string' && gettype($req['sharedPassw']) == 'string') 
		{
			$ok = $this->newElection($electionId, $req['sharedPassw']);
			if (! $ok) InternalServerError::throwException(2710, 'Internal server error: error saving election auth information', "request received: \n" . print_r($req, true));
			return $authConfig;
		} else {
			WrongRequestException::throwException(2000, 'ElectionId or shared password not set or of wrong type', "request received: \n" . print_r($req, true));
		}
	}

}
?>