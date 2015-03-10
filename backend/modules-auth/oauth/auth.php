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
	function checkCredentials($credentials, $electionId) {
		global $serverkey, $oauthConfig; // TODO move this to __construct?
		// load necessary data
		  //$configHash = $this->electionsDB->electionIdToConfigHash($electionId);
		$oAuthServerId = $this->db->getOAuthServerIdByElectionId($electionId); // $Ids['serverId'] und $Ids['listId']

		// verify transaction credentials
		$webclientAuthFromDb = $this->db->loadAuthData($electionId, $credentials['identifier']); // TODO error handling $webclientAuthFromDb empty // TODO error handling if not set (or not string)
		if (! isset($webclientAuthFromDb['username'])) return false; // did not log in in OAuth2 / BEO server
		$secretFromDb = hash('sha256', $electionId . $oauthConfig[$oAuthServerId]['client_id'] . $webclientAuthFromDb['username'] . $credentials['identifier']);
		if ($secretFromDb !== $credentials['secret'] ) return false;

		// $authInfos = $this->db->loadAuthData($configHash, $Ids['serverId'], $credentials['identifier']);
		// connect to OAuth2 server
		$this->oAuthConnection = new FetchFromOAuth2Server($oAuthServerId, $webclientAuthFromDb['authInfos']);

		// verify if the user may take part in this voting //
		$eligCrit = $this->db->getEligibaleCriteria($electionId);
		
		if (!isset($eligCrit)) WrongRequestException::throwException(12100, 'internal server error: authModule: OAuth2 could not load the config', 'electionId: ' . $electionId);
		
		// TODO check date

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
		if ( ($isInVoterList === true) && ($isVerified === true) && ($isEntitled === true) && ($isInVoterList === true) && ($isInGroup === true))
				return true;
		else 	return false;
	}

	function getVoterId($credentials, $electionId) {
		// $configHash = $this->electionsDB->electionIdToConfigHash($electionId);
		$authData = $this->db->loadAuthData($electionId, $credentials['identifier']);
		if (count($authData) == 0 || $authData === false) WrongRequestException::throwException(12000, 'Voter not found. Please login in into OAuth2 server and allow access to this server.', print_r($credentials, true) .  print_r($electionId, true));
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
		if ( (! isset($req["serverId"]     )) || (! is_string($req['serverId']     )) ) WrongRequestException::throwException(12001, 'Missing /listId/ in election config'       , "request received: \n" . print_r($req, true));
		if ( (! isset($req["listId"]       )) || (! is_string($req['listId']       )) ) WrongRequestException::throwException(12001, 'Missing /listId/ in election config'       , "request received: \n" . print_r($req, true));
		if ( (! isset($req["nested_groups"])) || (! is_array( $req['nested_groups'])) ) WrongRequestException::throwException(12002, 'Missing /nested_groups/ in election config', "request received: \n" . print_r($req, true));
		if ( (! isset($req["verified"]     )) || (! is_bool(  $req['verified']     )) ) WrongRequestException::throwException(12003, 'Missing /verified/ in election config'     , "request received: \n" . print_r($req, true));
		if ( (! isset($req["eligible"]     )) || (! is_bool(  $req['eligible']     )) ) WrongRequestException::throwException(12004, 'Missing /eligible/ in election config'     , "request received: \n" . print_r($req, true));
		if ( (! isset($electionId          )) || (! is_string($electionId          )) ) WrongRequestException::throwException(12005, '/ElectionId/ not set or of wrong type', "request received: \n" . print_r($req, true));
		$authconfig = Array(
				'serverId'      => $req['serverId'],
				'listId'        => $req["listId"],
				'nested_groups' => $req["nested_groups"],
				'verified'      => $req["verified"],
				'eligible'      => $req["eligible"],
		);
		date_default_timezone_set('UTC');
		if (isset($req["RegistrationStartDate"])) {
			$regStartDate = strtotime($req["RegistrationStartDate"]);
			if ($regStartDate === false) WrongRequestException::throwException(12010, '/RegistrationStartDate/ is set but could not be paresed'     , "request received: \n" . print_r($req, true));
//		TODO check if date is plausible:	if (strtotime('+10 years', $now) > $regStartDate || strtotime('-10 years', now) < $regStartDate) WrongRequestException::throwException(12011, '/RegistrationStartDate/ is more than 10 years away from now which is not supported'     , "request received: \n" . print_r($req, true));
			$authconfig['RegistrationStartDate'] = date('c', $regStartDate);
		}
		if (isset($req["RegistrationEndDate"])) {
			$regEndDate = strtotime($req["RegistrationEndDate"]);
			if ($regEndDate === false) WrongRequestException::throwException(12011, '/RegistrationEndDate/ is set but could not be paresed'     , "request received: \n" . print_r($req, true));
			$authconfig['RegistrationEndDate'] = date('c', $regEndDate);
		}
		// TODO don't save any data until everything is completed (no error occured in the further steps)
		// TODO don't save any publuc config data in separate data base - just use the config
		$ok = $this->newElection($electionId, $req['serverId'], $authconfig); // TODO think about taking serverId always from election-config
		if (! $ok) InternalServerError::throwException(12020, 'Internal server error: error saving election auth information', "request received: \n" . print_r($req, true));
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
}
?>