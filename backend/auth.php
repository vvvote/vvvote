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
		$this->authConfig = $authData;
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
		return $this->checkPhase($phase); // throws itself an error if false
	}

	function checkPhase($phase) {
		switch ($phase) {
			case 'registering':
				$starttag = 'RegistrationStartDate';
				$endtag   = 'RegistrationEndDate';
				$errnoAdd = 0;
				break;
			case 'voting':
				$starttag = 'VotingStart';
				$endtag =   'VotingEnd';
				$errnoAdd = 2;
				break;
			case 'getResult':
				$starttag = 'VotingEnd';
				$endtag = false; // after end of voting always allow getting the result
				$errnoAdd = 4;
				break;
			default:
				InternalServerError::throwException(47563523, 'checkcredentials: not supported phase', print_r($phase, true));
				break;
		}
		if (isset($this->authConfig[$starttag])) $startdate = strtotime($this->authConfig[$starttag]);
		else                                     $startdate = strtotime('2000-01-01T00:00Z');
		if ( ($endtag !== false) && isset($this->authConfig[$endtag])) $enddate = strtotime($this->authConfig[$endtag]);
		else                                                           $enddate = strtotime('2038-01-01T00:00Z'); // TODO use DateTime() which supports 64bit
		
		$now = time();
		$ret = ($startdate <= $now) && ($enddate >= $now);
		if ($ret !== true) {
			if ($startdate > $now)	WrongRequestException::throwException(3 + $errnoAdd, "The phase /$phase/ is yet to begin", $startdate);
			if ($enddate   < $now)	WrongRequestException::throwException(4 + $errnoAdd, "The phase /$phase/ already ended", $enddate);
		}
		return $ret;
	}
	
	/**
	 * 
	 * @param array $authData1
	 * @param array $authData2
	 * @return true if authData contain the same dates, false otherwise
	 */
	static function AuthDatesEqual(array $authData1, array $authData2) {
		$fields = ['RegistrationStartDate', 'RegistrationEndDate', 'VotingStart', 'VotingEnd'];
		$ret = true;
		foreach ($fields as $field) {
			$ret = $ret && (strtotime($authData1[$field]) === strtotime($authData2[$field]));
		}
		foreach ($authData1['DelayUntil'] as $index => $curdate) {
			$ret = $ret && (strtotime($curdate) === strtotime($authData2['DelayUntil'][$index]));
		}
		return $ret;
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
	
	function handleNewElectionReq($electionId, $req) {
		$authconfig = array();
		$now = time();
		if (isset($req["RegistrationStartDate"])) {
			$regStartDate = strtotime($req["RegistrationStartDate"]);
			if ($regStartDate === false) WrongRequestException::throwException(12010, '/RegistrationStartDate/ is set but could not be paresed'     , "request received: \n" . print_r($req, true));
			if (strtotime('+11 years', $now) < $regStartDate || strtotime('-11 years', $now) > $regStartDate) WrongRequestException::throwException(12011, '/RegistrationStartDate/ is more than 10 years away from now which is not supported'     , "request received: \n" . print_r($req, true)); // check if date is plausible	
			$authconfig['RegistrationStartDate'] = date('c', $regStartDate);
		}
		if (isset($req["RegistrationEndDate"])) {
			$regEndDate = strtotime($req["RegistrationEndDate"]);
			if ($regEndDate === false) WrongRequestException::throwException(12012, '/RegistrationEndDate/ is set but could not be paresed'     , "request received: \n" . print_r($req, true));
			if (strtotime('+11 years', $now) < $regEndDate || strtotime('-11 years', $now) > $regEndDate) WrongRequestException::throwException(12013, '/RegistrationEndDate/ is more than 10 years away from now which is not supported'     , "request received: \n" . print_r($req, true)); // check if date is plausible	
			$authconfig['RegistrationEndDate'] = date('c', $regEndDate);
		}
		if (isset($req["VotingStart"])) {
			$regEndDate = strtotime($req["VotingStart"]);
			if ($regEndDate === false) WrongRequestException::throwException(12014, '/VotingStart/ is set but could not be paresed'     , "request received: \n" . print_r($req, true));
			if (strtotime('+11 years', $now) < $regEndDate || strtotime('-11 years', $now) > $regEndDate) WrongRequestException::throwException(12015, '/VotingStart/ is more than 10 years away from now which is not supported'     , "request received: \n" . print_r($req, true)); // check if date is plausible	
			$authconfig['VotingStart'] = date('c', $regEndDate);
		}
		if (isset($req["VotingEnd"])) {
			$regEndDate = strtotime($req["VotingEnd"]);
			if ($regEndDate === false) WrongRequestException::throwException(12016, '/VotingEnd/ is set but could not be paresed'     , "request received: \n" . print_r($req, true));
			if (strtotime('+11 years', $now) < $regEndDate || strtotime('-11 years', $now) > $regEndDate) WrongRequestException::throwException(12017, '/VotingEnd/ is more than 10 years away from now which is not supported'     , "request received: \n" . print_r($req, true)); // check if date is plausible	
			$authconfig['VotingEnd'] = date('c', $regEndDate);
		}
		if (isset($req["DelayUntil"])) {
			if (! is_array($req["DelayUntil"])) WrongRequestException::throwException(12021, 'if DelayUntil is set, it must be an array', print_r($req['DelayUntil'], true));
			foreach ($req["DelayUntil"] as $i => $datumStr) {
				$datum = strtotime($datumStr);
				if ($datum === false) WrongRequestException::throwException(12022, "DelayUntil date number $i could not be paresed" , "request received: \n" . print_r($req['DelayUntil'], true));
				if (strtotime('+11 years', $now) < $datum || strtotime('-11 years', $now) > $datum) WrongRequestException::throwException(12023, "DelayUntil date number $i is more than 10 years away from now which is not supported"     , "request received: \n" . print_r($req['DelayUntil'], true)); // check if date is plausible	
			}
			$authconfig['DelayUntil'] = $req["DelayUntil"]; 
		}
		return $authconfig;
	}
	
	/**
	 * Some authenticitaction methods provide a means to send a confirmation mail to the voter
	 * 
	 */
	
	function onPermissionSend($electionId, $voterId) {

	}
	
}


?>