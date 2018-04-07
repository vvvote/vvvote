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
chdir(__DIR__); require_once './dbAuth.php';
chdir(__DIR__); require_once './../../root-classes/auth.php';
chdir(__DIR__); require_once './../../tools/exception.php';

/**
 * Provides an easy auth mechanism: everyone is allowed to vote
 * whose token is accepted by an external server
 *
 * errorno starts at 2340
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
	 * 
	 * @param unknown $url
	 * @param unknown $fieldsToJson
	 * @param unknown $verifyCert
	 * @return mixed|boolean
	 */
	function httpPost($url, $fieldsToJson, $verifyCert) {
		$hostname = parse_url($url, PHP_URL_HOST);
		if ($hostname === false) InternalServerError::throwException(8756653, 'Internal server configuration error (external token auth): Could not decode URL', 'trying to decode >' . $url. '<'); 
		$tlscertfilename = realpath(dirname(__FILE__) . '/../../config/tls-certificates/' . $hostname . '.pem');
		if ($verifyCert !== false) {
			if (@file_get_contents($tlscertfilename)) InternalServerError::throwException(673454, 'Internal server configuration error: Could not read tls certificate chain', 'Looking for file >' . $tlscertfilename . '<');
		}
		return httpPost($url, $fieldsToJson, ($verifyCert?$tlscertfilename:false));
	}

	/**
	 * 
	 * @param unknown $configId
	 * @return unknown|boolean false if 'configId' is not set, array otherwise
	 */
	function getExternalTokenConfig()  {
		global $externalTokenConfig;
		If ( isset($this->authConfig['configId']) ) {
			$i = find_in_subarray($externalTokenConfig, 'configId', $this->authConfig['configId']);
			if ($i === false)  WrongRequestException::throwException(38573, 'externalTokenAuth: configId not found in server config', print_r($this->authConfig['configId'], true));
			return $externalTokenConfig[$i];
		} else return false;
	}

	/**
	 * check the credentials sent from the voter
	 */
	function checkCredentials($credentials, $electionId, $phase) {
		$inDateRange = parent::checkCredentials($credentials, $electionId, $phase); //checks the phase time frame
		if ($inDateRange !== true) return false;
		global $externalTokenConfig;
		$curExternalTokenConfig = $this->getExternalTokenConfig();
		if ($curExternalTokenConfig !== false) {
			$url           = $curExternalTokenConfig['checkTokenUrl']; 
			$verifierPassw = $curExternalTokenConfig['verifierPassw'];
			$verifyCert    = $curExternalTokenConfig['verifyCertificate'];
		} else {  // the election was created with tokenUrl instead of configId
			$url           = $this->db->getCheckTokenUrl($electionId);
			$verifierPassw = '';
			$verifyCert    = false;
		}
		// $url = 'http://www.webhod.ra/vvvote2/test/externaltoken.html';
		
		$fieldsToJson = 		array(
				'token'         => $credentials['voterId'],
				'electionId'    => $electionId,
				'verifierPassw' => $verifierPassw
		);
		
		$result = $this->httpPost($url, $fieldsToJson, $verifyCert);
//		print_r($result);
		if ( isset($result['allowed']) && ($result['allowed'] === true) ) return true;
		return false;
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
		$ret = parent::handleNewElectionReq($electionId, $req);
		if (! isset($electionId))              WrongRequestException::throwException(2340, 'ElectionId not set', "request received: \n" . print_r($req, true));
		if (gettype($electionId) != 'string' ) WrongRequestException::throwException(2345, 'ElectionId is not of type /string/', "request received: \n" . print_r($req, true));
		if (isset($req['configId']) && gettype($req['configId']) == 'string') {
			$ret['configId'] = $req['configId'];
			return $ret;
		} else {
			if (isset($req['checkTokenUrl']) && gettype($req['checkTokenUrl']) == 'string')	{
				$ok = $this->newElection($electionId, $req['checkTokenUrl']);
				if (! $ok) InternalServerError::throwException(2710, 'Internal server error: error saving election auth information', "request received: \n" . print_r($req, true));
				return $ret;
			} else {
				WrongRequestException::throwException(2350, 'neither chekTokenUrl nor configId is set', "request received: \n" . print_r($req, true));
			}
		}
	}
	
	/**
	 * sends a confirmation email to the voter
	 * @see Auth::onPermissionSend()
	 */
	function onPermissionSend($electionId, $voterId) {
		try {
		$curExternalElectonConfig = $this->getExternalTokenConfig();
		if ($curExternalElectonConfig === false) return; // if new election was created using tokenUrl, confirmation e-mail is not supported
		$verifyCert = $curExternalElectonConfig['verifyCertificate'];
		$fieldsToSend = array(
				'verifierPassw' => $curExternalElectonConfig['verifierPassw'],
				'token'			=> $voterId
				);
			$result = $this->httpPost($curExternalElectonConfig['sendmail'], $fieldsToSend, $verifyCert);
		} catch (Exception $e) {
			// ignore the problem, because the return envelope is already sent, we cannot do anything about it
			// TODO log it
			global $debug;
			if ($debug) throw $e;
			return;
		}
		return;		
	}
	
}
?>