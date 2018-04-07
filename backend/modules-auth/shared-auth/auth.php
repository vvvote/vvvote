<?php

/**
 * return 404 if called directly
 * errorNo starts at 12000
 */
if(count(get_included_files()) < 2) {
	header('HTTP/1.0 404 Not Found');
	echo "<h1>404 Not Found</h1>";
	echo "The page that you have requested could not be found.";
	exit;
}

chdir(__DIR__); require_once './../../tools/exception.php';
chdir(__DIR__); require_once './../../tools/loadmodules.php';

/**
 * This class allows sharing the authentification between subElections (questions)
 */

class SharedAuth extends Auth {
	const name = "sharedAuth";
	
	var $subAuthModule;
	var $subAuthData;
	var $subAuth;
	var $mainElectionId;
	var $voterId;
	var $credentialsCheckAnswer;
	var $credentials;

	/**
	 * TODO $dbInfos are also used to setup the DbElections
	 * @param unknown $dbInfo
	 */
	function __construct($dbInfo) {
		parent::__construct();
	}

	function setup($electionId, $authData) {
		$this->subAuthModule = LoadModules::laodAuthModule($authData["auth"]);
		$this->mainElectionId = $authData['mainElectionId'];
	}
	
	static function splitElectionId ($completeElectionId) {
		$electionIdParts = json_decode($completeElectionId);
		
		// verify if param $completeElectionId is valid
		if ($electionIdParts == null)                        ElectionServerException::throwException(12000, 'sharedAuth::splitElectionId: internal error: $electionId must in a valid json format', "got: $electionId");
		if (! defined($electionIdParts['mainElectionId']))   ElectionServerException::throwException(12010, 'sharedAuth::splitElectionId: internal error: $electionId must contain mainElectionId', "got: $electionId");
		if (! defined($electionIdParts['subElectionId'   ])) ElectionServerException::throwException(12010, 'sharedAuth::splitElectionId: internal error: $electionId must contain subElectionId', "got: $electionId");
		
		$ret = array("mainElectionId" => $electionIdParts['mainElectionId'],
				     "mainElectionId"    => $electionIdParts['mainElectionId']);
		return $ret;
	}

	/**
	 * @param $mainelectionId 
	 * @see Auth::getVoterId()
	 */
	
	function getVoterId($credentials, $mainElectionId_) {

		/* is the result already in the cache? */
		if (isset($this->credentials) && ($this->credentials === $credentials)
		&& ($this->$mainElectionId ===  $mainElectionId_)
		&& isset($this->voterId))
			return $this->voterId;

		/* put the query and answer in the cache */
		$this->mainElectionId = $mainElectionId_;
		$this->credentials = $credentials;
		$this->voterId = $this->subAuthModule->getVoterId($credentials, $mainElectionId_);

		return $this->voterId;
	}

	function checkCredentials($credentials, $completeElectionId, $phase) {
		$electionIdParts = self::splitElectionId($completeElectionId);
		$mainElectionId = $electionIdParts['mainElectionId'];
		
		$inDateRange = parent::checkCredentials($credentials, $electionId, $phase); //checks the phase time frame
		if ($inDateRange !== true) return false;
		
		/* is the result already in the cache? */
		if (isset($this->credentials) && ($this->credentials === $credentials)
		&& ($this->$mainElectionId ===  $mainElectionId)
		&& isset($this->credentialsCheckAnswer))
			return $this->credentialsCheckAnswer;

		/* put the query and answer in the cache */
		$this->mainElectionId = $mainElectionId;
		$this->credentials = $credentials;
		$this->credentialsCheckAnswer = $this->subAuthModule->checkCredentials($credentials, $mainElectionId);

		return $this->credentialsCheckAnswer;
	}

	function newElection($electionId, $subAuth, $subAuthData) {
		// $this->db->newElection($electionId, $subAuthModule);
		$this->subAuth = $subAuth;
		$this->subAuthData = $subAuthData;
		$this->subAuthModule =  LoadModules::laodAuthModule($subAuth);
		$subAuthRet = $this->subAuthModule->handleNewElectionReq($electionId, $subAuthData);
		return array('auth' => $subAuth, 'authConfig' => $subAuthRet);
	}

	function newSubElection($mainElectenId) {
		$ret = array(
				'auth' => $this->subAuth,
				'authData' => $this->subAuthData
		);
		return $ret;
	}
/**
 * $req: {
 * 'auth': 'oAuth2' || 'sharedPassw'
 * 'authData': depends on auth
 * }
 */
	function handleNewElectionReq($electionId, $req) {
		if ( (! isset($req["auth"]     )) || (! is_string($req['auth']     )) ) WrongRequestException::throwException(30001, 'Missing /auth/ in election config'       , "request received: \n" . print_r($req, true));
		$subAuth = $req["auth"];
		$authConfig = $this->newElection($electionId, $subAuth, $req['authData']);
		return $authConfig;
	}
}
?>