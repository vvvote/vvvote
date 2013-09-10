<?php
require_once 'dbBase.php';

class DbElections extends DbBase {

	function __construct($dbInfos) {
		$dbtables =
		array('elections' /* Table name */ => array(
				array('name' => 'electionId', 'digits' => '100'), /* colunm definition */
				array('name' => 'config'    , 'digits' => '1000'),
				array('name' => 'hash'      , 'digits' => '257')
		));
		parent::__construct($dbInfos, $dbtables, true);
	}
	
	function saveElectionConfig($electionId, $config) {
		$configstr = json_encode($config);
		$hash = hash('sha256', $configstr);
		$ok = $this->save(array('electionId' => $electionId, 
				                 'config'     => $configstr, 
				                 'hash'       => $hash), 
				'elections');
		return $hash;
	}
	
	function loadElectionConfigFromHash($hash) {
		$cfgs = $this->load(array('hash' => $hash), 'elections', 'config');
		if (count($cfgs) < 1) return $cfgs; 
		return $cfgs[0];
	}
}

?>