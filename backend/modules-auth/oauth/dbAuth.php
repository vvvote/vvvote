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

require_once 'dbBase.php';

/**
 * errorno starts at 3000
 * @author r
 *
 */
class DbOAuth extends DbBase {

	function __construct($dbInfos) {
		$dbtables =
		array('oa_elections' /* Table name */ => array(
				array('name' => 'electionId'        , 'digits' => '100', 'json' => false), /* colunm definition */
				array('name' => 'electionConfigHash', 'digits' => '100', 'json' => false), /* colunm definition */
				array('name' => 'listId'            , 'digits' => '100', 'json' => false)
				),
			  'oa_voters' /* table name */ => array(
				array('name' => 'serverId' , 'digits' => '100', 'json' => false), /* colunm definition: Id of the OAuth 2.0 server */
				array('name' => 'configHash'     , 'digits' => '100', 'json' => false), /* colunm definition */
				array('name' => 'transactionId'  , 'digits' => '100', 'json' => false), /* colunm definition */
			  	array('name' => 'username'       , 'digits' => '100', 'json' => false), /* colunm definition */
				//array('name' => 'public_id'      , 'digits' => '100', 'json' => false), /* colunm definition */
			  	array('name' => 'auid'           , 'digits' => '100', 'json' => false), /* colunm definition */
			  	array('name' => 'authInfos'      , 'digits' => '100', 'json' => true),
			  	array('name' => 'startTime'      , 'digits' => '100', 'json' => true)
			  )
		);
		parent::__construct($dbInfos, $dbtables, true);
	}

	function checkCredentials($electionId, $voterId, $secret) {
		$secretFromDb = $this->load(array('electionId' => $electionId), 'sp_credentials', 'sp_credentials');
		if (! (count($secret) === 1)) return false;
		if ($secretFromDb[0] === $secret) {
			return true;
		}
		return false;
	}
	
	function newElection($electionId, $configHash, $listId) {
		$exists = $this->load(array('electionId' => $electionId), 'oa_elections', 'listId');
		if (isset($exists[0])) { 
			WrongRequestException::throwException(3000, 'election ID already used', $electionId);
		}
		$saved = $this->save(array('electionId' => $electionId, 'electionConfigHash' => $configHash, 'listId' => $listId), 'oa_elections');
		if (! $saved) {
			WrongRequestException::throwException(3001, 'internal server error; election not saved', $electionId);
		}
		return $saved;
	}
	
	function getListIdByElectionConfigHash($electionConfigHash) {
		return $this->load(array('ElectionConfigHash' => $electionConfigHash), 'oa_elections', 'listId');
	}
	
	function saveAuthData($configHash, $ServerId, $transactionId, $username, $authInfos, $now) {
		$saved = $this->save(array(
				'serverId' => $ServerId,
				'configHash' => $configHash,
				'transactionId' => $transactionId,
				'username' => $username,
				'authInfos' => $authInfos,
				'startTime' => $now
		), 'oa_voters');
		if (! $saved) {
			WrongRequestException::throwException(3010, 'internal server error; auth infos not saved', 'config hash: ' . $electionId . ', username: ' . $username);
		}
		return $saved;
	}
	
	function loadAuthData($configHash, $serverId, $transactionId) {
		$this->load(array(
				'serverId' => $ServerId,
				'configHash' => $configHash,
				'transactionId' => $transactionId
		), 'oa_voters', $colname);
	}

}


?>

