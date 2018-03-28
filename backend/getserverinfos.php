<?php

/**
 * prints the content of the servers's public keys as JavaScript
 * with assignment to PermissionServer${i}pubkey
 */

require_once 'config/conf-allservers.php'; // needed for $numPServers and $pServerUrlBases

for ($i = 0; $i < $numPServers; $i++) {
	$key = array(
			'kty' => 'RSA', 
			'n' => base64url_encode($pServerKeys[$i]['modulus']->toBytes()),
			// 'modHex'=> $pServerKeys[$i]['modulus']->toHex(),
			'e' => base64url_encode($pServerKeys[$i]['exponent']->toBytes()),
			'kid' => $pServerKeys[$i]['name']
			);
	$pkeys[] = $key; 
}

for ($i = 0; $i < $numTServers; $i++) {
	$key = array(
			'kty' => 'RSA',
			'n' => base64url_encode($tServerKeys[$i]['modulus']->toBytes()),
			// 'modHex'=> $pServerKeys[$i]['modulus']->toHex(),
			'e' => base64url_encode($tServerKeys[$i]['exponent']->toBytes()),
			'kid' => $tServerKeys[$i]['name']
	);
	$tkeys[] = $key;
}



$serverinfos = array(
		'pkeys' => $pkeys, 
		'pServerUrlBases' => $pServerUrlBases, 
		'tkeys' => $tkeys, 
		'tServerStoreVoteUrls' => $tServerStoreVoteUrls);

$serverinfosStr = str_replace('\/', '/', json_encode($serverinfos));

global $output_as_javascript;
if (isset($_GET['js']) || isset($output_as_javascript)) {
	echo "serverinfos = \r\n";
	echo "$serverinfosStr";
	echo ';';
	echo "\r\n";
			
} else {
	echo "$serverinfosStr";
}

/*
echo "PermissionServerpubkeys = \r\n";
echo '{jwk:';
echo '[';
for ($i = 1; $i <= $numPServers; $i++) {
	readfile("config/PermissionServer${i}.publickey");
	if ($i < $numPServers) echo ",\r\n";
	else 				   echo	"]\r\n";
}
echo '},';




echo '{urls:[';
for ($i = 1; $i <= $numPServers; $i++) {
	echo '"' . $pServerUrlBases . '"';
	if ($i < $numPServers) echo ",\r\n";
	else 				   echo	"]\r\n";
	}
echo '}';	
echo ";\r\n";
*/

?>