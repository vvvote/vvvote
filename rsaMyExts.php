<?php
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
}
?>