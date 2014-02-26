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

class DbElections extends DbBase {

	function __construct($dbInfos) {
		$dbtables =
		array('elections' /* Table name */ => array(
				array('name' => 'electionId', 'digits' => '100' , 'json' => false), /* colunm definition */
				array('name' => 'config'    , 'digits' => '1000', 'json' => true),
				array('name' => 'hash'      , 'digits' => '257' , 'json' => false)
		));
		parent::__construct($dbInfos, $dbtables, true);
	}
	
	function configHashToElectionId($configHash) {
		$config = $this->loadElectionConfigFromHash($configHash);
		return $this->generateConfigHash($config);
	}
	
	function electionIdToConfigHash($electionId) {
	$elConfig = $this->loadElectionConfigFromElectionId($electionId);
	$configHash = $this->generateConfigHash($elConfig);
	return $configHash;
}
	
	function generateConfigHash($config) {
		$configstr = json_encode($config);
		$hash = hash('sha256', $configstr);
		return $hash;
	}
	
	function saveElectionConfig($electionId, $config) {
		$hash = $this->generateConfigHash($config);
		$ok = $this->save(array('electionId' => $electionId, 
				                'config'     => $config, // this column is marked as json=true so that it gets automatically json encoded and decoded 
				                'hash'       => $hash), 
				'elections');
		return $hash;
	}
	
	function loadElectionConfigFromHash($hash) {
		$cfgs = $this->load(array('hash' => $hash), 'elections', 'config');
		if (count($cfgs) < 1) return $cfgs; 
		return $cfgs[0];
	}
	
	function loadElectionConfigFromElectionId($electionId) {
		$cfgs = $this->load(array('electionId' => $electionId), 'elections', 'config');
		if (count($cfgs) < 1) return $cfgs;
		return $cfgs[0];
	}
	
}

?>