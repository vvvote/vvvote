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


include_once 'Math/BigInteger.php';
require_once 'Crypt/RSA.php';

// from <http://tools.ietf.org/html/rfc3447#appendix-A.1.2>:
// RSAPrivateKey ::= SEQUENCE {
//     version           Version,
//     modulus           INTEGER,  -- n
//     publicExponent    INTEGER,  -- e
//     privateExponent   INTEGER,  -- d
//     prime1            INTEGER,  -- p
//     prime2            INTEGER,  -- q
//     exponent1         INTEGER,  -- d mod (p-1)          = d_p
//     exponent2         INTEGER,  -- d mod (q-1)          = d_q
//     coefficient       INTEGER,  -- (inverse of q) mod p = q_inv
//     otherPrimeInfos   OtherPrimeInfos OPTIONAL
// }

class rsaMyExts extends Crypt_RSA {
	/**
	 * 
	 * @param unknown $p prime 1
	 * @param unknown $q prime 2
	 * @param unknown $d private key exponent
	 * @param unknown $e public key exponent
	 * @param unknown $n modulus
	 * @return array of keys
	 */
	function rsaGetHelpingNumbers($p, $q, $d, $e, $n) {
		// see http://en.wikipedia.org/wiki/RSA_%28algorithm%29#Using_the_Chinese_remainder_algorithm
		// p and q: the primes from the key generation,
		$ret = array();
		$one = new Math_BigInteger(1);
		//	$ret['privatekey']['d_P']   = $d->modPow($one, $p->substract($one));  // mod(d, sub(p, one));
		//	$ret['privatekey']['d_Q']   = $d->modPow($one, $q->substract($one));
		//	$ret['privatekey']['q_inv'] = $q->modInverse($p);
		//	$ret['privatekey']['p']     = $p;
		//	$ret['privatekey']['q']     = $q;
		//	$ret['privatekey']['n']     = $n;

		$d_P   = $d->modPow($one, $p->subtract($one));  // mod(d, sub(p, one));
		$d_Q   = $d->modPow($one, $q->subtract($one));
		$q_inv = $q->modInverse($p);
		$primes       = array( 1 => $p,   2=> $q);
		$exponents    = array( 1 => $d_P, 2 => $d_Q);
		$coefficients = array( 2 => $q_inv);

		return array(
				'privatekey' => $this->_convertPrivateKey($n, $e, $d, $primes, $exponents, $coefficients),
				'publickey'  => $this->_convertPublicKey($n, $e),
				'partialkey' => false
		);
	}
	
	static function mulMod($f1, $f2, $mod) {
		$tmp = bcmul($f1->value, $f2->value);
		$ret = new Math_BigInteger();
		$ret->value = bcmod($tmp, $mod->value);
		return $ret;
	}
	
	function rsaBlind($cleartextBigInt, $blindf) {
		$tmp = $this->_rsasp1($blindf);
		$ret = $this->mulMod($tmp, $cleartextBigInt, $this->modulus);
		// JS: $ret = multMod(plaintextBigInt, powMod(factors.blind, key.exp, key.n), key.n);
		
		// does not work: $ret->value =  $ret->_multiplyReduce($tmp->value,  $cleartextBigInt->value, $this->modulus->value, MATH_BIGINTEGER_MONTGOMERY); //MATH_BIGINTEGER_MONTGOMERY);
		
		return $ret;
	}
	
	
	function rsaUnblind($blindedBigInt, $unblindf) {
		// does not work: $ret->_multiplyReduce($tmp->value, $unblindf->value, $this->modulus->value, MATH_BIGINTEGER_MONTGOMERY); //MATH_BIGINTEGER_MONTGOMERY);
		// JS: $ret = multMod($blindedtext, $unblindf, $n);
		$ret = $this->mulMod($blindedBigInt, $unblindf, $this->modulus);
		return $ret;
	}
}
?>