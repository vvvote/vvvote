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
		global $externalTokenConfig;

		$curl_options = array(
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_SSL_VERIFYPEER => false,
				CURLOPT_POST => true,
				CURLOPT_POSTFIELDS => json_encode($fieldsToJson),
				CURLOPT_URL => $url,
		);

		if ($verifyCert) {
			$path_to_certificate = realpath(dirname(__FILE__) . '/../../config/' . $this->authConfig['configId'] . '.pem');
			$curl_options[CURLOPT_SSL_VERIFYHOST] = 2; /* 2: check the common name and that it matches the HOST name*/
			$curl_options[CURLOPT_CAINFO]         = $path_to_certificate;
			$curl_options[CURLOPT_SSL_VERIFYPEER] = true;
		}
		$ch = curl_init();
		curl_setopt_array($ch, $curl_options);

		$resultStr = curl_exec($ch);
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		$content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
		if ($resultStr === false) $errorText = curl_error($ch);
		else                      $errorText = print_r($http_code, true);
		curl_close($ch);
		if ($http_code !=200 ) {
			InternalServerError::throwException(34868, 'Error connecting to the external token verifier. Please inform the server administrator', "Got HTTP status / curl-error: " . $errorText);
		}
		if ($http_code === 200 && isset($resultStr)) {
			$result = json_decode($resultStr, true);
			if ($result == null) InternalServerError::throwException(2350, 'The answer from the external token verifier could not be parsed. Please inform the server administrator', "Got from the token verifier server: >$resultStr<");
			if (isset($result['errorText'])) InternalServerError::throwException(34867, 'External token verifier returned an error. Please inform the server administrator', $result['errorText']);
			return $result;
		}
		return false;
	}

	/**
	 * 
	 * @param unknown $configId
	 * @return unknown|boolean false if 'configId' is not set, array otherwise
	 */
	function getExternalTokenConfig()  {
		If ( isset($this->authConfig['configId']) ) {
			$i = find_in_subarray($externalTokenConfig, 'configId', $this->authConfig['configId']);
			if ($i === false)  WrongRequestException::throwException(38573, 'externalTokenAuth: configId not found in server config', print_r($this->authConfig['configId'], true));
			return $externalTokenConfig[$i];
		} else return false;
	}

	/**
	 * check the credentials sent from the voter
	 */
	function checkCredentials($credentials, $electionId) {
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
		if ( isset($result['allowed']) && ($result['allowed'] === true) ) return true;
		return false;
/*		
		$curl_options = array(
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_SSL_VERIFYPEER => false,
				CURLOPT_POST => true,
				CURLOPT_POSTFIELDS => json_encode($postfields), 
				CURLOPT_URL => $url,
		);
		
		if ($verifyCert) {
			$path_to_certificate = realpath(dirname(__FILE__) . '/../../config/' . $this->authConfig['configId'] . '.pem');
			$curl_options[CURLOPT_SSL_VERIFYHOST] = 2; // check the common name and that it matches the HOST name
			$curl_options[CURLOPT_CAINFO]         = $path_to_certificate;
			$curl_options[CURLOPT_SSL_VERIFYPEER] = true;
		}
		$ch = curl_init();
		curl_setopt_array($ch, $curl_options);

		$resultStr = curl_exec($ch);
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		$content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
		if ($resultStr === false) $errorText = curl_error($ch);
		else                      $errorText = print_r($http_code, true);
		curl_close($ch);
		if ($http_code !=200 ) {
			InternalServerError::throwException(34868, 'Error connecting to the external token verifier. Please inform the server administrator', "Got HTTP status / curl-error: " . $errorText);
		}
		if ($http_code === 200 && isset($resultStr)) {
			$result = json_decode($resultStr, true);
			if ($result == null) InternalServerError::throwException(2350, 'The answer from the external token verifier could not be parsed. Please inform the server administrator', "Got from the token verifier server: >$resultStr<");
			if (isset($result['errorText'])) InternalServerError::throwException(34867, 'External token verifier returned an error. Please inform the server administrator', $result['errorText']);
			if ( isset($result['allowed']) && ($result['allowed'] === true) ) return true;
		}
		return false;
		// return $this->db->checkCredentials($electionId, $credentials['voterId'], $credentials['secret']);
*/
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
		if (! isset($electionId))              WrongRequestException::throwException(2340, 'ElectionId not set', "request received: \n" . print_r($req, true));
		if (gettype($electionId) != 'string' ) WrongRequestException::throwException(2345, 'ElectionId is not of type /string/', "request received: \n" . print_r($req, true));
		if (isset($req['configId']) && gettype($req['configId']) == 'string') {
			return Array('configId' => $req['configId']);
		} else {
			if (isset($req['checkTokenUrl']) && gettype($req['checkTokenUrl']) == 'string')	{
				$ok = $this->newElection($electionId, $req['checkTokenUrl']);
				if (! $ok) InternalServerError::throwException(2710, 'Internal server error: error saving election auth information', "request received: \n" . print_r($req, true));
				return Array();
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
		$curExternalElectonConfig = $this->getExternalTokenConfig();
		if ($curExternalElectonConfig === false) return; // if new election was created using tokenUrl, confirmation e-mail is not supported
		$fieldsToSend = array(
				'verifierPassw' => $curExternalElectonConfig['verifierPassw'],
				'token'			=> $voterId
				);
		try {
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