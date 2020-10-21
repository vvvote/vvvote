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
chdir(__DIR__); require_once './dbAuth.php';
chdir(__DIR__); require_once './../../root-classes/auth.php';
chdir(__DIR__); require_once './fetchfromoauthserver.php';
chdir(__DIR__); require_once './../../tools/dbelections.php';

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
	const name = "oAuth2";
	
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
	function checkCredentials($credentials, $electionId, $phase) {
		global $oauthConfig; // TODO move this to __construct?

		// check date
		$inDateRange = parent::checkCredentials($credentials, $electionId, $phase); //checks the phase time frame
		if ($inDateRange !== true) return false;
		
		// load necessary data
		  //$configHash = $this->electionsDB->electionIdToConfigHash($electionId);
		$oAuthServerId = $this->db->getOAuthServerIdByElectionId($electionId); // $Ids['serverId'] und $Ids['listId']

		// verify transaction credentials
		if (! array_key_exists('identifier', $credentials ) ){
			WrongRequestException::throwException(100070, 'Missing the field >identifier< in your request.', 'Credentials you sent: >' . var_export($credentials, true) . '<');
			return false; // $credentials['identifier'] not found / wrong
		}
		if (! is_string($credentials['identifier'] ) ){
			WrongRequestException::throwException(100069, 'The field >identifier< in your request must be of type string.', 'Credentials you sent: >' . var_export($credentials, true) . '<');
			return false; // $credentials['identifier'] not found / wrong
		}
		
		$webclientAuthFromDb = $this->db->loadAuthData($electionId, hash('sha256', $credentials['identifier']));
		if (count($webclientAuthFromDb) < 1) {
			WrongRequestException::throwException(100067, 'No authentication data found in my database. The identifier you sent not found. Possible cause: You did not autorize Vvvote to get the data from the oAuth2 server.', 'Credentials you sent: >' . var_export($credentials, true) . '<, electionID: >' . var_export($electionId, true) . '<');
			return false; // $credentials['identifier'] not found / wrong 
		}
		if (! isset($webclientAuthFromDb['auid'])) {
			WrongRequestException::throwException(100068, 'The authentication data found in my database is incomplete. It does not contain the auid/sub. Possible cause: You did not autorize Vvvote to get the data from the oAuth2 server.', 'Credentials you sent: >' . var_export($credentials, true) . '<, electionID: >' . var_export($electionId, true) . '<');
			return false; // did not log in in OAuth2 / BEO server
		}
		
		
		// $authInfos = $this->db->loadAuthData($configHash, $Ids['serverId'], $credentials['identifier']);
		// connect to OAuth2 server
		$this->oAuthConnection = new FetchFromOAuth2Server($oAuthServerId, $webclientAuthFromDb['authInfos']);

		// verify if the user may take part in this voting //
		$eligCrit = $this->db->getEligibaleCriteria($electionId);
		
		if (!isset($eligCrit)) WrongRequestException::throwException(12100, 'internal server error: authModule: OAuth2 could not load the config', 'electionId: ' . $electionId);
		

		// is not a fake/test/admin/dummy account
		if ($eligCrit['verified'] === false) $isVerified = true; // test not requiered
		else {
			$isVerified = $this->oAuthConnection->isVerified();
			if ($isVerified !== true) return false;
		}

		// is a member and entitled for voting (stimmberechtigt)
		if ($eligCrit['eligible'] === false) $isEntitled = true; // test not requiered
		else {
			$isEntitled = $this->oAuthConnection->isEntitled();
			if ($isEntitled !== true) return false;
		}

		// Is the voter registered for voting offline (external)? then he is not allowed to vot online.
		if ($eligCrit['external_voting'] === false) $isOnlineVoter = true; // test not requiered
		else {
			$isOnlineVoter = $this->oAuthConnection->isOnlineVoter();
			if ($isOnlineVoter !== true) return false;
		}
		
		 // check if in list of allowed voters
		if (isset($eligCrit['listId']) ) {  
			if ($eligCrit['listId'] === '') $isInVoterList = true; // test not requiered
			else {
				$isInVoterList = $this->oAuthConnection->isInVoterList($eligCrit['listId']);
				if ($isInVoterList !== true) return false;
			}
		} else $isInVoterList = true; // test not requiered

		// is a member and entitled for voting (stimmberechtigt)
		if (isset($eligCrit['nested_groups']) && (count($eligCrit['nested_groups']) > 0) ) {
			$isInGroup = $this->oAuthConnection->isInGroup($eligCrit['nested_groups']);
			if ($isInGroup !== true) return false;
		} else $isInGroup = true; // test not requiered

		// voter is in voter list --> fetch identity information
		// load auid, username, public_id auth-infos, already_used by electionId, tmp-secret
		// $displayname = $this->oAuthConnection->fetchAuid();
		// return auid and public_id if everthing is ok.
		if ( ($isInVoterList === true) && ($isVerified === true) && ($isEntitled === true) && ($isOnlineVoter === true) && ($isInVoterList === true) && ($isInGroup === true))
				return true;
		else 	return false;
	}

	function getVoterId($credentials, $electionId) {
		// $configHash = $this->electionsDB->electionIdToConfigHash($electionId);
		$authData = $this->db->loadAuthData($electionId, hash('sha256', $credentials['identifier']));
		if (count($authData) == 0 || $authData === false) WrongRequestException::throwException(12000, 'Voter not found. Please login in into OAuth2 server and allow access to this server.', var_export($credentials, true) .  var_export($electionId, true));
		return $authData['auid'];
	}

/* not needed at the moment (dirctly implemented in checkCredentials) may be this could be usefull later 
	function setupOAuthConnection($credentials, $electionId) {
		global $pserverkey, $dbInfos, $oauthConfig;
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
	function newElection($electionId, $serverId, $eligibilityCriteria) {
		return $this->db->newElection($electionId, $serverId, $eligibilityCriteria);
	}

	
	/**
	 * 
	 * @param unknown $electionId
	 * @param unknown $req : $req['listId']
	 * @return auth config data to be saved with the election config because the client need to know it for obtaining voting permission
	 */
	function handleNewElectionReq($electionId, $req) {
		$authconfig = parent::handleNewElectionReq($electionId, $req);
		
		if ( (! isset($req["serverId"]        )) || (! is_string($req['serverId']       )) ) WrongRequestException::throwException(12006, 'Missing /serverId/ in election config'       , "request received: \n" . var_export($req, true));
		if ( (! isset($req["listId"]          )) || (! is_string($req['listId']         )) ) WrongRequestException::throwException(12001, 'Missing /listId/ in election config'         , "request received: \n" . var_export($req, true));
		if ( (! isset($req["nested_groups"]   )) || (! is_array( $req['nested_groups']  )) ) WrongRequestException::throwException(12002, 'Missing /nested_groups/ in election config'  , "request received: \n" . var_export($req, true));
		if ( (! isset($req["verified"]        )) || (! is_bool(  $req['verified']       )) ) WrongRequestException::throwException(12003, 'Missing /verified/ in election config'       , "request received: \n" . var_export($req, true));
		if ( (! isset($req["eligible"]        )) || (! is_bool(  $req['eligible']       )) ) WrongRequestException::throwException(12004, 'Missing /eligible/ in election config'       , "request received: \n" . var_export($req, true));
		if ( (! isset($req["external_voting"] )) || (! is_bool(  $req['external_voting'])) ) WrongRequestException::throwException(12008, 'Missing /external_voting/ in election config', "request received: \n" . var_export($req, true));
		if ( (! isset($electionId             )) || (! is_string($electionId            )) ) WrongRequestException::throwException(12005, '/ElectionId/ not set or of wrong type'       , "request received: \n" . var_export($req, true));
		global $oauthConfig;
		if ( find_in_subarray($oauthConfig, 'serverId', $req['serverId']) === false)    WrongRequestException::throwException(12007, 'Server configuration for OAuth2-serverId not found', "request received: \n" . var_export($req, true));
		$authconfig['serverId']        = $req['serverId'];
		$authconfig['listId']          = $req["listId"];
		$authconfig['nested_groups']   = $req["nested_groups"];
		$authconfig['verified']        = $req["verified"];
		$authconfig['eligible']        = $req["eligible"];
		$authconfig['external_voting'] = $req["external_voting"];
		
		// TODO don't save any data until everything is completed (no error occured in the further steps)
		// TODO don't save any public config data in separate data base - just use the config
		$ok = $this->newElection($electionId, $req['serverId'], $authconfig); // TODO think about taking serverId always from election-config
		if (! $ok) InternalServerError::throwException(12020, 'Internal server error: error saving election auth information', "request received: \n" . var_export($req, true));
		return $authconfig;
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
	
	function onPermissionSend($electionId, $voterId) {
		global $oauthConfig; // TODO move this to __construct?
		// load necessary data
		  //$configHash = $this->electionsDB->electionIdToConfigHash($electionId);
		$oAuthServerId = $this->db->getOAuthServerIdByElectionId($electionId); // $Ids['serverId'] und $Ids['listId']

		// verify transaction credentials
		$webclientAuthFromDb = $this->db->loadAuthDataFromVoterId($electionId, $voterId);
		if (! isset($webclientAuthFromDb['authInfos'])) return false; // TODO throw error?

		// connect to OAuth2 server
		$this->oAuthConnection = new FetchFromOAuth2Server($oAuthServerId, $webclientAuthFromDb['authInfos']);
		$this->oAuthConnection->sendConfirmMail($electionId);
	}
}
?>