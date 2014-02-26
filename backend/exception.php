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

class ElectionServerException extends Exception {
	var $errorno;
	var $errortxt;
	function __construct($errorno_, $errortxt_) {
		$this->errorno  = $errorno_;
		$this->errortxt = $errortxt_;
	}
	
	function __toString() {
		return $this->errorno . ': ' . $this->errortxt;
	}
	
	function makeServerAnswer() {
		$ret = Array('cmd' => 'error', 'errorNo' => $this->errorno, 'errorTxt' => $this->errortxt);
		return $ret;
	}
	
	
	static function throwException($errorno, $errortxt, $data) {
		global $debug;
		if ($debug) {
			$errortxt = $errortxt . "\n" . $data . "\n";
			// debug_print_backtrace();
		}
		throw new WrongRequestException($errorno, $errortxt);
	}
}

class WrongRequestException extends ElectionServerException {

}

class InternalServerError extends ElectionServerException {

}

?>