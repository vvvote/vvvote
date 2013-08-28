<?php


class WrongRequestException extends Exception {
	var $errorno;
	var $errortxt;
	function __construct($errorno_, $errortxt_){
		$this->errorno  = $errorno_;
		$this->errortxt = $errortxt_;
	}
	
	function __toString() {
		return $this->errorno . ': ' . $this->errortxt;
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


?>