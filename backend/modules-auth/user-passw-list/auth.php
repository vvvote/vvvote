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

class UserPasswAuth extends Auth {
	const name = "userPassw";
	
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
	function checkCredentials($credentials, $electionId) {
		return $this->db->checkCredentials($electionId, $credentials['voterId'], $credentials['secret']);
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