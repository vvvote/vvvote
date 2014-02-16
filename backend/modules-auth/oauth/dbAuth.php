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
				array('name' => 'electionId'    , 'digits' => '100', 'json' => false), /* colunm definition */
				array('name' => 'listId'        , 'digits' => '100', 'json' => false)
				),
			  'oa_voters' /* table name */ => array(
				array('name' => 'oAuth2ServerId' , 'digits' => '100', 'json' => false), /* colunm definition */
				array('name' => 'electionId'     , 'digits' => '100', 'json' => false), /* colunm definition */
			  	array('name' => 'username'       , 'digits' => '100', 'json' => false), /* colunm definition */
				array('name' => 'statecode'      , 'digits' => '100', 'json' => false), /* colunm definition */
				array('name' => 'public_id'      , 'digits' => '100', 'json' => false), /* colunm definition */
			  	array('name' => 'auuid'          , 'digits' => '100', 'json' => false), /* colunm definition */
			  	array('name' => 'authCode'       , 'digits' => '100', 'json' => false)
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
	
	function newElection($electionId, $listId) {
		$exists = $this->load(array('electionId' => $electionId), 'oa_elections', 'listId');
		if (isset($exists[0])) { 
			WrongRequestException::throwException(3000, 'election ID already used', $electionId);
		}
		$saved = $this->save(array('electionId' => $electionId, 'listId' => $listId), 'oa_elections');
		if (! $saved) {
			WrongRequestException::throwException(3001, 'internal server error; election not saved', $electionId);
		}
		return $saved;
	}
	


}


?>

