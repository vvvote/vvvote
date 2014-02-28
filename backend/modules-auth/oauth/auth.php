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

require_once 'exception.php';
require_once 'dbAuth.php';
require_once 'auth.php';
require_once 'fetchfromoauthserver.php';
require_once __DIR__ . '/../../dbelections.php';

/**
 * Provides an interface to oauth
 * 
 * @author r
 *
 */

class OAuth2 extends Auth {
	/**
	 * TODO $dbInfos are also used to setup the DbElections
	 * @param unknown $dbInfo
	 */
	function __construct($dbInfo) {
		parent::__construct();
		$this->db = new DbOAuth2($dbInfo);
		$this->electionsDB = new DbElections($dbInfo);
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
	 * @param array $credentials: ['secret'] ['identifier'] 
	 */
	function checkCredentials($credentials, $electionId) {
		global $serverkey, $oauthConfig; // TODO move this to __construct
		// load necessary data
		$configHash = $this->electionsDB->electionIdToConfigHash($electionId);
		$Ids = $this->db->getListIdandServerIdByElectionId($electionId); // $Ids['serverId'] und $Ids['listId']
		
		// verify transaction credentials
		$webclientAuthFromDb = $this->db->loadAuthData($configHash, $credentials['identifier']); // TODO error handling $webclientAuthFromDb empty
		if (! isset($webclientAuthFromDb['username'])) return false; // did not log in in OAuth2 / BEO server 
		$secretFromDb = hash('sha256', $configHash . $oauthConfig[$Ids['serverId']]['client_id'] . $webclientAuthFromDb['username'] . $credentials['identifier']);
		if ($secretFromDb !== $credentials['secret'] ) return false;
		
		// check if in list of allowed voters
         		// $authInfos = $this->db->loadAuthData($configHash, $Ids['serverId'], $credentials['identifier']);
		$this->oAuthConnection = new FetchFromOAuth2Server($Ids['serverId'], $webclientAuthFromDb['authInfos']);
		$isInVoterList = $this->oAuthConnection->isInVoterList($Ids['listId']);
		if (!$isInVoterList) return false;

		// voter is in voter list --> fetch identity information
		// load auid, username, public_id auth-infos, already_used by electionId, tmp-secret
		// $displayname = $this->oAuthConnection->fetchAuid();
		// return auid and public_id if everthing is ok.
		return $isInVoterList;
	}
	
	function getVoterId($credentials, $electionId) {
		$configHash = $this->electionsDB->electionIdToConfigHash($electionId);
		$authData = $this->db->loadAuthData($configHash, $credentials['identifier']);
		if (count($authData) == 0 || $authData === false) WrongRequestException::throwException(12000, 'Voter not found. Please login in into OAuth2 server and allow access to this server.', print_r($voterReq['credentials'], true) .  print_r($voterReq['electionId'], true));
		return $authData['auid'];
	}

/* not needed at the moment (dirctly implemented in chechCredentials) may be this could be usefull later 
	function setupOAuthConnection($credentials, $electionId) {
		global $serverkey, $dbInfos, $oauthConfig;
		if (isset($this->$oAuthConnection)) return true;
		// lod necessary data
		$electionsDB = new DbElections($dbInfos);
		$elConfig = $electionsDB->loadElectionConfigFromElectionId($electionId);
		$configHash = $electionsDB->generateConfigHash($elConfig);
		$Ids = $this->db->getListIdandServerIdByElectionId($electionId); // $Ids['serverId'] und $Ids['listId']
		
		$webclientAuthFromDb = $this->db->loadAuthData($configHash, $credentials['identifier']);
		if (! isset($webclientAuthFromDb['username'])) return false; // did not log-in in OAuth2 / BEO server
		$secretFromDb = hash('sha256', $configHash . $oauthConfig[$Ids['serverId']]['client_id'] . $webclientAuthFromDb['username'] . $credentials['identifier']);
		if ($secretFromDb !== $credentials['secret'] ) return false;
				
		$this->oAuthConnection = new FetchFromOAuth2Server($Ids['serverId'], $webclientAuthFromDb['authInfos']);
		return true;
	}
	*/
	function getDisplayName($credentials, $electionId) {
		return $credentials['displayname'];
	}
	
	/**
	 * Import the list of voters and associated credentials into the database
	 * no use for this kind of auth module --> not implemented
	 * @param array $voterlist[number]['electionId']['voterID']['secret']
	 */
	function importCredentials($voterlist) {
		return true;
	}

	/**
	 * 
	 * @param unknown $electionId
	 * @param unknown $listId Id of the list of allowed voters. This Id must 
	 * match the Id of the list of allowed voters of the oauth (BEO) server
	 */
	function newElection($electionId, $listId, $serverId) {
		return $this->db->newElection($electionId, $listId, $serverId);
	}
	
	
	/**
	 * 
	 * @param unknown $electionId
	 * @param unknown $req : $req['listId']
	 * @return auth config data to be saved with the election config because the client need to know it for obtaining voting permission
	 */
	function handleNewElectionReq($electionId, $req) {
		if (isset($electionId) && isset($req['listId']) &&
				gettype($electionId) == 'string' && gettype($req['listId']) == 'string') 
		{
			$ok = $this->newElection($electionId, $req['listId'], $req['serverId']); // TODO think about taking serverId always from election-config
			if (! $ok) InternalServerError::throwException(2710, 'Internal server error: error saving election auth information', "request received: \n" . print_r($req, true));
			return Array('serverId' => $req['serverId']);
		} else {
			WrongRequestException::throwException(2700, 'ElectionId or list id not set or of wrong type', "request received: \n" . print_r($req, true));
		}
		return Array('serverId' => $req['serverId']);
	}
	/*
	function isInVoterList($oAuthConnection) {
		$db = new DbElections($dbInfos);
		$electionId = $db->configHashToElectionId($configHash);
		$listId = $this->db->getListIdByElectionId($electionId);
		$isInVoterList = $oAuthConnection->isInVoterList($listId);
		return $isInVoterList;
	}
*/
}
?>