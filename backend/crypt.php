<?php

/**
 * verifys signatures
 * verify blinded sigs
 * verify hashes
 * signs
 * encrypt
 * decrypt
 *
 * @author r
 * errorno start at 1000
 */

/**
 * return 404 if called directly
 */
if(count(get_included_files()) < 2) {
	header('HTTP/1.0 404 Not Found');
	echo "<h1>404 Not Found</h1>";
	echo "The page that you have requested could not be found.";
	exit;
}


require_once 'exception.php';

class Crypt {

	var $serverKeys;
	var $myPrivateKey;
	
	/**
	 * 
	 * @param unknown $serverkeys array
	 * @param unknown $privateKey
	 */
	function __construct(array $serverkeys, $privateKey)  {
		$this->serverKeys   = $serverkeys;
		
		$rsa = new rsaMyExts();
		$rsa->loadKey($privateKey['privatekey']);
		$rsapub = new rsaMyExts();
		$rsapub->loadKey($privateKey['publickey']);
		$this->myPrivateKey = array ('privRsa' => $rsa, 
				'pubRsa' => $rsapub, 
				'serverName' => $privateKey['serverName']);
	}
	
	function getServerKey($servername) {
		$f = -1;
		foreach ($this->serverKeys as $num => $s) {
			if ($s['name'] == $servername) {
				$f = $num;
			}
		}
		if ($f == -1) {
			WrongRequestException::throwException(1000, "Error: server key not found", "Crypt:getServerKey: Server $servername not found");
		}
		$pubkey = $this->serverKeys[$f];
		return 	$pubkey;
	}
	
	/**
	 * 
	 * @param unknown $hash string: hex encoded bigInt
	 * @param unknown $sig  string: hex encoded bigInt
	 * @param unknown $servername string
	 * @return boolean throws an Exception if sig verification failed
	 */
	function verifySigHash($hash, $sig, $servername) {
		$pubkey = $this->getServerKey($servername);
		return static::verifySigKey($hash, $sig, $pubkey);
	}

	static function verifySigKey($hash, $sig, $pubkey) {
		$rsa = new rsaMyExts();
		$rsa->loadKey($pubkey);
		$hashBI = new Math_BigInteger($hash, 16);
		$sigBI = new Math_BigInteger($sig, 16);
		$verify = $rsa->_rsaep($sigBI);
		if ($hashBI->equals($verify)) {
			return true;
		}
		WrongRequestException::throwException(1001, "Error: signature verifcation failed", "verifySig: Server $servername, given hash: $hash, calculated hash: " . $verify->toHex());
	}

	
	static function verifyHash($text, $hash) {
		$hashByMe = hash('sha256', $text);
		$hashByMeBigInt = new Math_BigInteger($hashByMe, 16);
		$hashOk = $hashByMeBigInt->equals($verifyHash);
		return $hashOk;
	}
	
	function verifySigText($text, $sig, $servername) {
		$hashByMe = hash('sha256', $text);
		return $this->verifySigHash($hashByMe, $sig, $servername);
	}
	

	
	function verifySigs($text, array $arrayOfSigs) {
		$ok = array();
		foreach ($arrayOfSigs as $num => $sig) {
			$ok[$num] = $this->verifySigText($text, $sig['sig'], $sig['sigBy']); // throws an exception if not ok
			if (! $ok) { return false; }
			// if ($num == 0) {
			//	$prevsig = $hashByMe;
			// }
			// $result = $this->verifySig($prevsig, $sig['serSig'], $sig['sigBy']);
			// if (!$result['sigok']) { $e = 'Signature of previous server in serSig is wrong.'; return $e;}
			// $prevsig = $result['prevsig']; // TODO serSig
		}
		return $ok === array_pad(array(), count($arrayOfSigs), true);
	}
	
	// TODO move this to a more reasonable place - election?
	static function verifyVoterSig($vote) {
		$text = $vote['vote']['vote'];
		$sig  = $vote['vote']['sig'];
		$pubkeystr = $vote['permission']['signed']['votingno'];
		//return $this->verifyPss($text, $sig, $pubkeystr);
		$pubkeyarray = explode(' ', $pubkeystr);
		$pubkey      = array(
				'n'   => new Math_BigInteger($pubkeyarray[0], 16),
				'e'   => new Math_BigInteger($pubkeyarray[1], 16));
		$hashByMe = hash('sha256', $text);
		return static::verifySigKey($hashByMe, $sig, $pubkey);
	}

	

	function verifyPss($text, $sig, $pubkeystr) {
		$pubkeyarray = explode(' ', $pubkeystr);
		$rsa = new rsaMyExts();
		$rsa->loadKey(array('n' => new Math_BigInteger($pubkeyarray[0], 16), 
				            'e' => new Math_BigInteger($pubkeyarray[1], 16)));
		$rsa->setHash('sha256');
		$rsa->setMGFHash('sha256');
		$rsa->setSignatureMode(CRYPT_RSA_SIGNATURE_PSS);
		$rsa->setSaltLength(0);
		$sigBigInt = new Math_BigInteger($sig, 16); 
		$sigBin = $rsa->_i2osp($sigBigInt, ceil(strlen($sig) /2));
		$sigOk = $rsa->verify($text, $sigBin); 
		return $sigOk;
	}
	/**
	 * 
	 * @param unknown $text string
	 * @param unknown $unblindf string: hex encoded bigInt
	 * @param unknown $blindedHash string: hex encoded bigInt
	 */
	function verifyBlindedHash($text, $unblindf, $blindedHash) {
		$hashByMe                   = hash('sha256', $text);
		$hashByMeBigInt             = new Math_BigInteger($hashByMe, 16);
		$blindedHashBigInt          = new Math_BigInteger($blindedHash, 16);
		$signedblindedHash          = $this->myPrivateKey['privRsa']->_rsasp1($blindedHashBigInt );
		$unblindf                   = new Math_BigInteger($unblindf, 16);
		$unblindedSignedHash        = $this->myPrivateKey['privRsa']->rsaUnblind($signedblindedHash, $unblindf);
		$verifyHash                 = $this->myPrivateKey['pubRsa']->_rsasp1($unblindedSignedHash);
		$hashOk = $hashByMeBigInt->equals($verifyHash);
		if (! $hashOk ) WrongRequestException::throwException(1002, "Error: blinded hash verification failed", "expected hash: $hashByMe, got unblinded hash: $verifyHash, blinded Hash $blindedHash, unblinding factor $unblindf");
		return $hashOk;
	}
	
	function signBlindedHash($blindedHash, $ballot) {
		// normal sig
		if (! isset(   $ballot['sigs']) ) $ballot['sigs'] = array();
		$newnum = count($ballot['sigs']);
		$blindedHashBigInt = new Math_BigInteger($blindedHash, 16);
		$ballot['sigs'][$newnum]['sig']   = $this->myPrivateKey['privRsa']->_rsasp1($blindedHashBigInt)->toHex();
		$ballot['sigs'][$newnum]['sigBy'] = $this->myPrivateKey['serverName'];

		//ser Sig
		if ($newnum === 0)	$prevSig = $blindedHash;
		else                $prevSig = $ballot['sigs'][$newnum -1]['serSig']; // TODO Think about: previous blindedHashes correct?
		$tmp = new Math_BigInteger($prevSig, 16);
		$ballot['sigs'][$newnum]['serSig']     = $this->myPrivateKey['privRsa']->_rsasp1($tmp)->toHex();
		return $ballot;
	}
	
	/**
	 * 
	 * @param unknown $plaintext hex-encoded big int
	 * @param number $basis provide this parameter if the $plaintext is not hex encoded
	 * @return string (bigInt to Bytes)
	 */
	function decrypt ($plaintext, $basis = 16) {
		$ptBigInt = new Math_BigInteger($plaintext, $basis);
		$dec = $this->myPrivateKey['privRsa']->_rsasp1($ptBigInt);
		$ret = $dec->toBytes();
		return $ret;
	}

	function getNumServers() {
		return count($this->serverKeys);
	}
}

?>