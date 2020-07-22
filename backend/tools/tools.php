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


/**
 * 
 * @param unknown $array
 * @param unknown $subarraykey
 * @param unknown $subarrayvalue
 * @return unknown|boolean
 */

function find_in_subarray($array, $subarraykey, $subarrayvalue) {
	foreach ($array as $key => $value) {
		if ($value[$subarraykey] === $subarrayvalue) return $key;
	}
	return false;
}

function clearForFilename($filename) {
	$replace = array('<', '>', ':', '\\', '/', '|', '?', '*');
	$ret = str_replace($replace, '_', $filename);
	return $ret;
}

function makeCompleteElectionId($mainElectionId, $questionID) {
	$completeElectionId = json_encode(array('mainElectionId' => $mainElectionId,  'subElectionId' => $questionID));
	return $completeElectionId;
}

function splitCompleteElectionId($completeElectionId) {
	return json_decode($completeElectionId);
}

/**
 * convert each byte of a string to base64url
 * @param string $data 
 */
function base64url_encode($data) {
	return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data, $strict = true) {
	
	return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) + (4 - (strlen($data) % 4)) % 4, '=', STR_PAD_RIGHT), $strict);
}

/**
 * Send a JSON-POST Request
 * 
 * @param string $url        	
 * @param array $fieldsToJson         	
 * @param string (optional) $verifyCert path to certificate file: must be absolut! e.g. realpath ( dirname ( __FILE__ ) . '/../../config/' . $this->authConfig ['configId'] . '.pem' );        	
 * @return false if failed/throws is failed, array with the JSON decoded answer 
 */
function httpPost($url, array $fieldsToJson, $verifyCertfile=false, $contentTypeTextPlain = false) {
	$curl_options = array (
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_SSL_VERIFYPEER => false,
			CURLOPT_POST => true,
			CURLOPT_POSTFIELDS => json_encode ( $fieldsToJson ),
			CURLOPT_URL => $url,
	);
	if ($contentTypeTextPlain) 	$curl_options[CURLOPT_HTTPHEADER] = array('Content-type: text/plain');
		
	if ($verifyCertfile) {
		if (@file_get_contents($verifyCertfile) === false) InternalServerError::throwException(6754534, 'Internal server configuration error: Could not read chain of SSL-certificates', 'Looking for file ' . var_export($verifyCertfile), true);
		$path_to_certificate = $verifyCertfile;
		$curl_options[CURLOPT_SSL_VERIFYHOST] = 2; /* 2: check the common name and that it matches the HOST name */
		$curl_options[CURLOPT_CAINFO] = $path_to_certificate;
		$curl_options[CURLOPT_SSL_VERIFYPEER] = true;
	}
	$ch = curl_init();
	curl_setopt_array($ch, $curl_options );
	
	$resultStr = curl_exec( $ch );
	$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE );
	$content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE );
	if ($resultStr === false)	$errorText = curl_error($ch );
	else                    	$errorText = var_export ( $http_code, true );
	curl_close( $ch );
	if ($http_code != 200) {
		InternalServerError::throwException ( 31868, 'Error connecting to the external URL. Please inform the server administrator', "URL: >${url}<" . "\r\n Got HTTP status / curl-error: " . $errorText );
	}
	if ($http_code === 200 && isset ( $resultStr )) {
		$result = json_decode ( $resultStr, true );
		if ($result == null)
			InternalServerError::throwException ( 25550, 'The answer from the external URL could not be JSON decoded. Please inform the server administrator', "URL: >${url}<" . "Got from the token verifier server: >$resultStr<" );
		if (isset ( $result ['errorText'] ))
			InternalServerError::throwException ( 31867, 'The external server returned an error. Please inform the server administrator', "URL: >${url}<" . $result ['errorText'] );
		return $result;
	}
	return false;
}
	
?>