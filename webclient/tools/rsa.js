      //<input type=button name=nnnb1 value="Pick primes p,q" 
    	  // nnnp = p
// nnne = e
// nnnm = plaintext message
// nnns = 1: true primes, =2 probable primes
// nnng = Anzahl bits der Primes

// b: number of bits of the primes, ps: 1=true primes, 2=probable primes
function getRandomPrime(bits, method, e) {    	  
      var r;

      if (bits<5) {//generated primes must be at least 5 bits long to avoid infinite loop during generation
        throw ("getRandomPrime(): at least 5 bits needed");
      }
      if (equalsInt(e, 2) || equalsInt(e, 1) || equalsInt(e, 0)) { //e should be an odd prime
    	throw ("getRandomPrime: e must be greater than 2");
      }

      while (true) {
        if (method == 1) r=randProbPrime(bits);
        else             r=randTruePrime(bits);  
        if (!equalsInt(mod(r, e), 1))  //the prime must not be congruent to 1 modulo e
          break;
      }
      return r;
}
/**
 * 
 * @param bits n will have roughly twice as much bits as given here
 * @param method 1: probable prime, 2: true prime
 * @param e public exponent, usually set to 65537
 * @returns {___keys2}
 */
function RsaKeyGen(bits, method, e) {
	var privatekey = new Object(), publickey = new Object(), keys = new Object();
	p = getRandomPrime(bits, method, e);
	q = getRandomPrime(bits, method, e);
	n = mult(p, q);
	phi = mult(addInt(p, -1), addInt(q, -1));
	d = inverseMod(e, phi);
	if (! d) { throw ("RSAKeyGen(): e is not invertable, try a different e");} // TODO use Exception class
	privatekey.n   = n;
	privatekey.exp = d;
	privatekey.p   = p;
	privatekey.q   = q;
	publickey.n    = n;
	publickey.exp  = e;
	keys.priv      = privatekey;
	keys.pub       = publickey;
	return keys;
}

/**
 * converts bigInts in the key to hex-encoded strings (actually it uses the global var base)
 * @param kp Object key
 * @returns key par with hex encoded big ints; use stringify to get a string
 * 
 */
function keypair2str(kp) {
	var ret = new Object();
	ret.priv = key2str(kp.priv);
	ret.pub  = key2str(kp.pub);
	return ret;
}

/**
 * converts bigInts in the key to hex-encoded strings
 * @param kp Object key
 * @returns kp with hex-encoded bigInts
 */
function key2str(k) {
	var ret = new Object();
	ret.n = bigInt2str(k.n, base);
	ret.exp = bigInt2str(k.exp, base);
	if ('p' in k) ret.p = bigInt2str(k.p, base);
	if ('q' in k) ret.q = bigInt2str(k.q, base);
	return ret;
}

function str2key(str) {
	var a = str.split(' ');
	var key = {};
	key.n = str2bigInt(a[0], 16);
	key.exp = str2bigInt(a[1], 16);
	return key;
}

function arrayStr2key(arraystr) {
	var key = {};
	key.n = str2bigInt(arraystr.n, 16);
	key.exp = str2bigInt(arraystr.exp, 16);
	key.p = str2bigInt(arraystr.p, 16);
	key.q = str2bigInt(arraystr.q, 16);
	return key;
}

function RsaEncDec(plaintext, key){
	if (!greater(key.n, plaintext)) { throw ("RsaEncDec(): modulus " + key.n + " must be greater than plaintext" + plaintext);}
	return powMod(plaintext, key.exp, key.n);
}

/**
 * 
 * @param plaintext string 
 * @param sig hex encoded big integer
 * @param key valid key
 * @returns
 */
function rsaVerifySig(plaintext, sig, key) {
	var sigBi = str2bigInt(sig, 16);
	var hashFromSigBi = RsaEncDec(sigBi, key);
	var hash = SHA256(plaintext);
	var hashBi = str2bigInt(hash, 16);
	return equals(hashBi, hashFromSigBi);
}

/**
 * Generate blinding and according unblindung factors
 * Use the factors in blind() and unblind()
 * @param bits
 * @param n
 * @returns object.blind and object.unblind
 */
function RsablindingFactorsGen(bits, n){
	var factors = new Object();
	// only workes correctly if 
	// the biggest common devisor of rand and modulus equals 1.  

    while (true) {
        r = randBigInt(bits, 0);
        if (!equalsInt(mod(n, r), 1)) break;
      }

	factors.blind   = r; // str2bigInt('27', 10); // @TODO put r here back after debugging finished
	factors.unblind = inverseMod(factors.blind, n);
	return factors; 
}

function rsaBlind(plaintextBigInt, factors, key) {
	var ret;
	ret = multMod(plaintextBigInt, powMod(factors.blind, key.exp, key.n), key.n);
	return ret;
}

function rsaUnblind(blindedtextBigInt, factors, key) {
	var ret;
	ret = multMod(blindedtextBigInt, factors.unblind, key.n);
	return ret;
}

/**
 * Calculate the numbers needed for using the fast decrypt algorithm 
 * @param p Prime 1
 * @param q Prime 2
 * @param d private exponent
 * @param n modulus
 * @returns {object containing the needed numbers}
 */
function getHelpingNumbers(p, q, d, n) {
// see http://en.wikipedia.org/wiki/RSA_%28algorithm%29#Using_the_Chinese_remainder_algorithm
// p and q: the primes from the key generation,
	var ret = new Object();
    ret.d_P   = mod(d, sub(p, one));
    ret.d_Q   = mod(d, sub(q, one));
    ret.q_inv = inverseMod(q, p);
    ret.p     = p;
    ret.q     = q;
    ret.n     = n;
    return ret;
}

/**
 * Fast decryption using the chinese remainder algorithm 
 * @param cipheredtext
 * @param privkeycoeffs object: numbers calculated by getHelpingNumbers()
 * @returns decrypted message
 */
function rsaDecrypt(cipheredtext, privkeycoeffs) {
//	These values allow the recipient to compute the exponentiation m = cd (mod pq) more efficiently as follows:
//	http://en.wikipedia.org/wiki/RSA_%28algorithm%29#Using_the_Chinese_remainder_algorithm
	if (!greater(privkeycoeffs.n, cipheredtext)) throw ('The ciphered text c must be less than p*q');

	m_1 = powMod(cipheredtext, privkeycoeffs.d_P, privkeycoeffs.p);
	m_2 = powMod(cipheredtext, privkeycoeffs.d_Q, privkeycoeffs.q);
	if (greater(m_1, m_2)) { h = multMod(privkeycoeffs.q_inv, sub(add(m_1, privkeycoeffs.p), m_2), privkeycoeffs.p);}
	else                   { h = multMod(privkeycoeffs.q_inv, sub(    m_1,                   m_2), privkeycoeffs.p);} 
	m = add(m_2,  multMod(h, privkeycoeffs.q, privkeycoeffs.n));
	return m;
}


