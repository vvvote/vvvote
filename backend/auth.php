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

abstract class Auth {
	var $db;
	const name = "*fill in*";
		/**
	 * creates the connection to the database
	 */
	function __construct() {
		
	}
	
	/**
	 * load the auth part of the election config which is public
	 * @param unknown $authData
	 */
	function setup($electionId, $authData) {
		
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
		
	}
	
	/**
	 * In OAuth 2 / BEO the voterId is not read from vvvote client but
	 * from OAuth-Server. Shared Password and Username/Password will just
	 * return the transmitted voterId
	 * @param unknown $credentials
	 * @param unknown $electionId
	 * @return voterId
	 */
	function getVoterId($credentials, $electionId){
		return $credentials['voterId'];
	}
	
	
	/**
	 * Import the list of voters and associated credentials into the database
	 */
	function importCredentials($voterlist) {
		
	}
	
	/**
	 * Return the html5 code to be integrated into the webpage 
	 * For the correct application use stylesheet use id="password" and id="username"
	 */
	function getAuthHtml() {
		
	}
	
}


?>