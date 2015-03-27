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
 * Provides an easy auth mechanism: everyone is allowed to vote
 * whose token is accepted by an external server
 * 
 * errorno starts at 2000
 * @author r
 *
 */

class ExternalTokenAuth extends Auth {
	const name = "externalToken";
	
	function __construct($dbInfo) {
		parent::__construct();
		$this->db = new DbExternalTokenAuth($dbInfo);
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
		$url = $this->db->getCheckTokenUrl($electionId);
		// $url = 'http://www.webhod.ra/vvvote2/test/externaltoken.html';
		$curl_options = array(
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_SSL_VERIFYPEER => false,
				CURLOPT_URL => $url,
/*				CURLOPT_POST => true,
				CURLOPT_POSTFIELDS => array(
						'token' => $credentials['voterId'],
						'electionId' => $electionId
						) */
		);
		$ch = curl_init();
		curl_setopt_array($ch, $curl_options);

		$resultStr = curl_exec($ch);
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		$content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
		curl_close($ch);
		if ($http_code === 200 && isset($resultStr)) {
			$result = json_decode($resultStr, true);
			if ( isset($result['allowed']) && ($result['allowed'] === true) ) return true;
		}
		return false;
		// return $this->db->checkCredentials($electionId, $credentials['voterId'], $credentials['secret']);
	}

	/**
	 * Import the list of voters and associated credentials into the database
	 * no use for this kind of auth module --> not implemented
	 * @param array $voterlist[number]['electionId']['voterID']['secret']
	 */
	function importCredentials($voterlist) {
		return true;
	}

	function newElection($electionId, $checkTokenUrl) {
		return $this->db->newElection($electionId, $checkTokenUrl);
	}
	
	
	/**
	 * 
	 * @param unknown $electionId
	 * @param unknown $req : $req['externalToken']
	 */
	function handleNewElectionReq($electionId, $req) {
		if (isset($electionId) && isset($req['checkTokenUrl']) &&
				gettype($electionId) == 'string' && gettype($req['checkTokenUrl']) == 'string') 
		{
			$ok = $this->newElection($electionId, $req['checkTokenUrl']);
			if (! $ok) InternalServerError::throwException(2710, 'Internal server error: error saving election auth information', "request received: \n" . print_r($req, true));
			return Array();
		} else {
			WrongRequestException::throwException(2000, 'ElectionId or chekTokenUrl not set or of wrong type', "request received: \n" . print_r($req, true));
		}
	}
}
?>