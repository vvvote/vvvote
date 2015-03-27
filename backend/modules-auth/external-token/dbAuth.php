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
class DbExternalTokenAuth extends DbBase {

	function __construct($dbInfos) {
		$dbtables =
		array('xt_config' /* Table name */ => array(
				array('name' => 'electionId'   , 'digits' => '100', 'json' => false), /* colunm definition */
				array('name' => 'checkTokenUrl', 'digits' => '100', 'json' => false)
		));
		parent::__construct($dbInfos, $dbtables, true);
	}

	function getCheckTokenUrl($electionId) {
		$url = $this->load(array('electionId' => $electionId), 'xt_config', 'checkTokenUrl');
		if (! (count($url) === 1)) return false;
		return $url[0];
	}
	
	function newElection($electionId, $checkTokenUrl) {
		$exists = $this->load(array('electionId' => $electionId), 'xt_config', 'electionId');
		if (isset($exists[0])) { 
			WrongRequestException::throwException(3000, 'election ID already used', $electionId);
		}
		$saved = $this->save(array('electionId' => $electionId, 'checkTokenUrl' => $checkTokenUrl), 'xt_config');
		if (! $saved) {
			InternalServerError::throwException(3001, 'internal server error; election not saved', $electionId);
		}
		return $saved;
	}
	


}


?>