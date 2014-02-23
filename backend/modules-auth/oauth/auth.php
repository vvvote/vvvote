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

require_once 'exception.php';
require_once 'dbAuth.php';
require_once 'auth.php';
require_once 'fetchfromoauthserver.php';

/**
 * Provides an interface to oauth
 * 
 * errorno starts at 2700
 * @author r
 *
 */

class OAuth2 extends Auth {
	function __construct($dbInfo) {
		parent::__construct();
		$this->db = new DbOAuth2($dbInfo);
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
	function checkCredentials($credentials) {
		// load necessary data
		$electionsDB = new DbElections($dbInfos);
		$elConfig = $electionsDB->loadElectionConfigFromElectionId($credentials['electionId']);
		$configHash = $electionsDB->generateConfigHash($elconfig);
		$Ids = $this->db->getListIdandServerIdByElectionId($electionId); // $Ids['serverId'] und $Ids['listId']
		
		// verify transaction credentials
		$webclientAuthFromDb = $this->db->loadAuthData($configHash, $credentials['identifier']);
		$secretFromDb = hash('sha256', $configHash . $oauthConfig[$Ids['serverId']] . $webclientAuthFromDb['username'] . $credentials['identifier']);
		if ($secretFromDb !== $credentials['secret'] ) return false;
		
		// check if in list of allowed voters
		$authInfos = $this->db->loadAuthData($configHash, $Ids['serverId'], $credentials['identifier']);
		$oAuthConnection = new FetchFromOAuth2Server($Ids['serverId'], $authInfos);
		$isInVoterList = $oAuthConnection->isInVoterList($Ids['listId']);
		if (!$isInVoterList) return false;

		// voter is in voter list --> fetch identity information
		// load auid, username, public_id auth-infos, already_used by electionId, tmp-secret
		$displayname = $oAuthConnection->fetchAuid();
		// return auid and public_id if everthing is ok.
		return $isInVoterList;
	}
	
	function getVoterId() {
		
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
	 */
	function handleNewElectionReq($electionId, $req) {
		if (isset($electionId) && isset($req['listId']) &&
				gettype($electionId) == 'string' && gettype($req['listId']) == 'string') 
		{
			return $this->newElection($electionId, $req['listId'], $req['serverId']);
		} else {
			WrongRequestException::throwException(2700, 'ElectionId or list Id not set or of wrong type', "request received: \n" . print_r($req, true));
		}
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