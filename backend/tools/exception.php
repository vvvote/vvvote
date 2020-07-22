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
	
	static function MyException($errorno, $errortxt) {
		throw new ElectionServerException($errorno, $errortxt);
	}
	
	static function getErrorText($errortxt, $data) {
		global $debug;
		if ($debug) {
			$errortxt = $errortxt . "\r\n" . $data;
			// debug_print_backtrace();
		} else {
			$errortxt = $errortxt;
		}
		return $errortxt;
	}
	
	static function throwException($errorno, $errortxt, $data) {
		self::MyException($errorno, self::getErrorText($errortxt, $data));
	}
}

class WrongRequestException extends ElectionServerException {
	static function MyException($errorno, $errortxt) {
		throw new WrongRequestException($errorno, $errortxt);
	}
}

class InternalServerError extends ElectionServerException {
	static function MyException($errorno, $errortxt) {
		throw new InternalServerError($errorno, $errortxt);
	}
	static function MyExceptionData($errorno, $errortxt, $data) {
		throw new InternalServerError($errorno, parent::getErrorText($errortxt, $data));
	}
}

?>