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

chdir(__DIR__);
require_once './../../tools/dbBase.php';

/**
 * errorno starts at 3000
 * @author r
 *
 */
class DbOAuth2 extends DbBase {

	function __construct($dbInfos) {
		$dbtables =
		array('oa_elections' /* Table name */ => array(
				array('name' => 'electionId'          , 'digits' => '100', 'json' => false), /* colunm definition */
				array('name' => 'serverId'            , 'digits' => '100', 'json' => false),
/*				array('name' => 'listId'              , 'digits' => '100', 'json' => false), */
				array('name' => 'eligibilityCriteria' , 'digits' => '500', 'json' => true) /* ca. 230 chars are used -> 500 makes a lot of room for lidtId */
		),
			  'oa_voters' /* table name */ => array(
				array('name' => 'serverId'       , 'digits' => '100', 'json' => false), /* colunm definition: Id of the OAuth 2.0 server */
				array('name' => 'configHash'     , 'digits' => '100', 'json' => false), /* colunm definition */
				array('name' => 'transactionId'  , 'digits' => '100', 'json' => false), /* colunm definition */
			  	array('name' => 'username'       , 'digits' => '100', 'json' => false), /* colunm definition */
			  	array('name' => 'displayname'    , 'digits' => '100', 'json' => false), /* colunm definition */
			  		//array('name' => 'public_id'      , 'digits' => '100', 'json' => false), /* colunm definition */
			  	array('name' => 'auid'           , 'digits' => '100', 'json' => false), /* colunm definition */
			  	array('name' => 'authInfos'      , 'digits' => '5000','json' => true),
			  	array('name' => 'startTime'      , 'digits' => '100', 'json' => false),
			  	array('name' => 'firstUse'       , 'digits' => '1'  , 'json' => false)
			  )
		);
		parent::__construct($dbInfos, $dbtables, true);
	}

	function newElection($electionId, $serverId, $eligibilityCriteria) {
		$exists = $this->load(array('electionId' => $electionId), 'oa_elections', 'serverId');
		if (isset($exists[0])) { 
			WrongRequestException::throwException(3000, 'election ID already used', $electionId);
		}
		$saved = $this->save(array('electionId' => $electionId, 'serverId' => $serverId, 'eligibilityCriteria' => $eligibilityCriteria), 'oa_elections');
		if (! $saved) {
			InternalServerError::throwException(3001, 'internal server error; election not saved', $electionId);
		}
		return $saved;
	}
	
	function getListIdByElectionId($electionId) {
		return $this->load(array('electionId' => $electionId), 'oa_elections', 'listId');
	}
	
	function getEligibaleCriteria($electionId) {
		$rettmp = $this->load(array('electionId' => $electionId), 'oa_elections', 'eligibilityCriteria');
		if (count($rettmp) < 1) InternalServerError::throwException(3000, 'election id not found', "election >$electionId< not found in table oa_elections");
		if (count($rettmp) > 1) InternalServerError::throwException(3010, 'more than 1 election id found', "several >$electionId< found in table oa_elections");
		return $rettmp[0];
	}

	function getOAuthServerIdByElectionId($electionId) {
		$rettmp = $this->load(array('electionId' => $electionId), 'oa_elections', 
				'serverId');
		if (count($rettmp) < 1) InternalServerError::throwException(3000, 'election id not found', "election >$electionId< not found in table oa_elections");
		if (count($rettmp) > 1) InternalServerError::throwException(3010, 'more than 1 election id found', "several >$electionId< found in table oa_elections");
		return $rettmp[0];
	}
	
	
	function saveAuthData($configHash, $ServerId, $transactionId, $auid, $username, $authInfos, $now) {
		$saved = $this->save(array(
				'serverId'      => $ServerId,
				'configHash'    => $configHash,
				'transactionId' => $transactionId,
				'auid'			=> $auid,
				'username'      => $username,
				'authInfos'     => $authInfos,
				'startTime'     => $now,
				'firstUse'      => '1'
		), 'oa_voters');
		if (! $saved) { 
			InternalServerError::throwException(3010, 'internal server error; auth infos not saved', 'config hash: ' . $electionId . ', username: ' . $username);
		}
		return $saved;
	}
	
	function loadAuthData($configHash, $transactionId) {
		$fromDB = $this->load(array(
				'configHash'    => $configHash,
				'transactionId' => $transactionId // TODO firstUse => false
		), 'oa_voters', array('auid', 'username', 'authInfos', 'startTime', 'firstUse'));
		// TODO set firstUse auf 0 for false
		if ($fromDB === false || count($fromDB) < 1) return Array();
		return $fromDB[count($fromDB)-1]; // TODO sort by startTime
	}
	
	function loadAuthDataFromVoterId($electionId, $voterId) {
		$fromDB = $this->load(array(
				'configHash' => $electionId,
				'auid'       => $voterId
		), 'oa_voters', array('auid', 'username', 'authInfos', 'startTime', 'firstUse'));
		// TODO set firstUse auf 0 for false
		if ($fromDB === false || count($fromDB) < 1) return Array();
		return $fromDB[count($fromDB)-1]; // TODO sort by startTime
	}
	

}


?>