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

chdir(__DIR__); require_once './exception.php';
chdir(__DIR__); require_once './../Crypt/AES.php';
chdir(__DIR__); require_once './tools.php'; /* base64url encoder */
chdir(__DIR__); require_once './rsaMyExts.php';

class Crypt {

	var $serverKeys;
	var $myPrivateKey;
	const KEY_TYPE_JWK = 1; /* JWK = JSON Web Key format */
	
	/**
	 * 
	 * @param unknown $serverkeys array
	 * @param unknown $privateKey
	 */
	function __construct(array $serverkeys, $privateKey, $keyFormat = 0)  {
		$this->serverKeys   = $serverkeys;
		$this->keyFormat = $keyFormat;
		$rsa = new rsaMyExts();
		if ($privateKey) {
			$rsa->loadKey($privateKey['privatekey']);
			$rsapub = new rsaMyExts();
			$rsapub->loadKey($privateKey['publickey']);
			$this->myPrivateKey = array ('privRsa' => $rsa, 
					'pubRsa' => $rsapub, 
					'serverName' => $privateKey['serverName']);
			}
	}
	
	function getServerKey($servername) {
 		$f = -1;
		if ($this->keyFormat === self::KEY_TYPE_JWK) {
			if (isset($this->serverKeys[$servername]) )	
				$pubkey = $this->serverKeys[$servername]['key'];
			else WrongRequestException::throwException(87634675, 'key not found', 'looking for the key from server >' . $servername . '<' . ', looking in: ' . var_export($this->serverKeys, true));
		} else {
			foreach ($this->serverKeys as $num => $s) {
				if ($s['name'] == $servername) {
					$f = $num;
				}
			}
			if ($f == -1) {
				WrongRequestException::throwException(1000, "Error: server key not found", "Crypt:getServerKey: Server $servername not found");
			}
			$pubkey = $this->serverKeys[$f];
			}
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
		$keyformat = false;
		if ($this->keyFormat == static::KEY_TYPE_JWK) $keyformat = CRYPT_RSA_PUBLIC_FORMAT_JWK;
		return static::verifySigKey($hash, $sig, $pubkey, $keyformat);
	}

	static function verifySigKey($hash, $sig, $pubkey, $keyformat) {
		$rsa = new rsaMyExts();
		$rsa->loadKey($pubkey, $keyformat);
 		$hashBI = new Math_BigInteger($hash, 16);
		$sigBI = new Math_BigInteger($sig, 16);
		if ($sigBI->compare($rsa->zero) < 0 || $sigBI->compare($rsa->modulus) > 0) return false; // the signature has more bits than the modulus --> the signature cannot has been created by the given key and the exponentiation cannot be performed. 
		$verify = $rsa->_rsaep($sigBI);
		if ($hashBI->equals($verify)) {
			return true;
		}
		WrongRequestException::throwException(1001, "Error: signature verifcation failed", "verifySig: given hash: $hash, calculated hash: " . $verify->toHex() . var_export($keyformat, true));
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
		$differentSigsBy = Array();
		foreach ($arrayOfSigs as $num => $sig) {
			$ok[$num] = $this->verifySigText($text, $sig['sig'], $sig['sigBy']); // throws an exception if not ok
			if (! $ok[$num]) { return false; }
			if (in_array($sig['sigBy'], $differentSigsBy)) {return false;} // do not allow the sig from one server twice in the list of sigs / count sigs from the same server only once 
			array_push($differentSigsBy, $sig['sigBy']); 
			if ($num == 0) 	$oksum = $ok[$num];
			else 			$oksum = $oksum & $ok[$num]; 
			// if ($num == 0) {
			//	$prevsig = $hashByMe;
			// }
			// $result = $this->verifySig($prevsig, $sig['serSig'], $sig['sigBy']);
			// if (!$result['sigok']) { $e = 'Signature of previous server in serSig is wrong.'; return $e;}
			// $prevsig = $result['prevsig']; // TODO serSig
		}
		if (count($differentSigsBy) != count($arrayOfSigs) ) return false;
		else return $oksum;
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
		return static::verifySigKey($hashByMe, $sig, $pubkey, CRYPT_RSA_PUBLIC_FORMAT_RAW);
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
		if ($hashOk !== true ) WrongRequestException::throwException(1002, "Error: blinded hash verification failed. Most probable reason: the webclient used a key different from the server's key.", "expected hash: $hashByMe, got unblinded hash: $verifyHash, blinded Hash $blindedHash, unblinding factor $unblindf");
		return $hashOk === true;
	}
	
	function signBlindedHash($blindedHash, $ballot) {
		// normal sig
		if (! isset(   $ballot['sigs']) ) $ballot['sigs'] = array();
		$newnum = count($ballot['sigs']);
		$blindedHashBigInt = new Math_BigInteger($blindedHash, 16);
		$ballot['sigs'][$newnum]['sig']   = $this->myPrivateKey['privRsa']->_rsasp1($blindedHashBigInt)->toHex();
		$ballot['sigs'][$newnum]['sigBy'] = $this->myPrivateKey['serverName'];

		//ser Sig
		/*
		if ($newnum === 0)	$prevSig = $blindedHash;
		else                $prevSig = $ballot['sigs'][$newnum -1]['serSig']; // TODO Think about: previous blindedHashes correct?
		$tmp = new Math_BigInteger($prevSig, 16);
		$ballot['sigs'][$newnum]['serSig']     = $this->myPrivateKey['privRsa']->_rsasp1($tmp)->toHex();
		*/
		return $ballot;
	}
	
	/**
	 * 
	 * @param unknown $plaintext hex-encoded big int
	 * @param number $basis provide this parameter if the $plaintext is not hex encoded
	 * @return string (bigInt to Bytes)
	 */
	function decrypt($plaintext, $basis = 16) {
		$ptBigInt = new Math_BigInteger($plaintext, $basis);
		$dec = $this->myPrivateKey['privRsa']->_rsasp1($ptBigInt);
		$ret = $dec->toBytes();
		return $ret;
	}
	
	function JwsSign(array $toJson) {
		$protectedFields = array('alg' => 'RS256', 'typ' => 'JWT');
		$protectedFieldsStr = json_encode($protectedFields);
		$protectedFieldsBase64Url = base64url_encode($protectedFieldsStr);
		$toJson['iss'] = $this->myPrivateKey['serverName'];
		$toJson['iat'] = date('c', time());
		$ContentStrToSign = str_replace('\/', '/', json_encode($toJson));
		$textbase64 = base64url_encode($ContentStrToSign); //json_encode(array('test' => 'ich'))); // $text
		$toSignStr = $protectedFieldsBase64Url . '.' . $textbase64;

		$this->myPrivateKey['privRsa']->setMGFHash('sha256');
		$this->myPrivateKey['privRsa']->setHash('sha256');
		$this->myPrivateKey['privRsa']->setSignatureMode(CRYPT_RSA_SIGNATURE_PKCS1);
		$sig = base64url_encode($this->myPrivateKey['privRsa']->sign($toSignStr));
		
		return array('proctedetFields' => $protectedFields, 'sig' =>$sig, 'signedData' => $toSignStr); //base64url_encode(
		// https://jwt.io/ allows online verification
		
	}

	function getNumServers() {
		return count($this->serverKeys);
	}

	/*******************************************************
	 * symmetric encryption
	* /
	*/

	/**
	 * 
	 * @param string $json {'iv': 'xxx', 'wrappedKey': 'XX', 'encrypted': }
	 * @return Ambigous <boolean, string, unknown>
	 * @throws if something was wrong
	 */
	function decryptRsaAes($json) {
		$message = json_decode($json, true);
		if ( ($message == null) || (! isset($message['iv'])) || (! isset($message['wrappedKey'])) || (! isset($message['encrypted'])) ) WrongRequestException::throwException(874367,'crypt: >wrappedKey<, >iv<, >encrypted< must be set', var_export($json)); 	
		if ( (! is_string($message['iv'])) || (! is_string($message['wrappedKey'])) || (! is_string($message['encrypted'])) ) WrongRequestException::throwException(874368,'crypt: wrappedKey, iv, encrypted must be strings', var_export($json));
		
		$aeskey = $this->unwrapKey($message['wrappedKey']);
		// echo base64url_encode($aeskey);
		$plaintext = self::decryptAes($message['encrypted'], $aeskey, $message['iv']);
		if ($plaintext === false) WrongRequestException::throwException(754452, 'decryptRsaAes: decryption failed','');
		$this->aeskey = $aeskey;
		$this->iv = substr(base64url_decode($message['encrypted']), -16); // save the last 128 bits as iv for next encryption
		return $plaintext;
	}
	
	
	
	static function decryptAes($encryptedB64, $key, $ivB64) {
		$cipher = new Crypt_AES(CRYPT_AES_MODE_CBC); // could use CRYPT_AES_MODE_CBC
		// keys are null-padded to the closest valid size
		// longer than the longest key and it's truncated
		$cipher->setKeyLength(256);
		$cipher->setKey($key);
		$iv = base64url_decode($ivB64, true);
		if ($iv === false)      WrongRequestException::throwException(645277, 'decryptAes: iv must be bease64url encoded', $ivB64);
		if (strlen($iv) !== 16) WrongRequestException::throwException(645278, 'decryptAes: iv must have a length of 16 bytes (128 bits)', $ivB64);
		$encrypted = base64url_decode($encryptedB64, true);
		if ($encrypted === false) WrongRequestException::throwException(645279, 'decryptAes: >encrypted< must be bease64url encoded', $encryptedB64);
		$cipher->setIV($iv); // defaults to all-NULLs if not explicitely defined

		$decrypted = $cipher->decrypt($encrypted);
		return $decrypted;
	}

	function encryptAes($plaintext, $key = null, $ivB64 = null) {
		$cipher = new Crypt_AES(CRYPT_AES_MODE_CBC); // could use CRYPT_AES_MODE_CBC
		// keys are null-padded to the closest valid size
		// longer than the longest key and it's truncated
		$cipher->setKeyLength(256);
		if ($key === null && isset($this->aeskey)) $key = $this->aeskey;
		if ($key === null) ElectionServerException::throwException(645280, 'encryptAes: aes key not set', '');
		$cipher->setKey($key);
		
		if ($ivB64 === null) 	{
			if (isset($this->iv)) $iv = $this->iv;
			else                  $iv = Crypt_RSA::_random(32);
		}
		else 					$iv = base64url_decode($ivB64);
		$cipher->setIV($iv); // defaults to all-NULLs if not explicitely defined
	
		$encrypted = $cipher->encrypt($plaintext);
		//		echo base64url_encode($encrypted) . "\r\n";
		//		echo $cipher->decrypt($encrypted);
		return array('encrypted' => base64url_encode($encrypted), 'iv' => base64url_encode($iv));
	}
	
	
	function unwrapKey($wrappedKeyB64Url) {
		$this->myPrivateKey['privRsa']->setHash('sha256');
		$this->myPrivateKey['privRsa']->setMGFHash('sha256');
		//$cipher->setKeyLength(256);
		$wrappedKey = base64url_decode($wrappedKeyB64Url, true);
		if ($wrappedKey === false) WrongRequestException::throwException(645277, 'decryptAes: iv must be bease64url encoded', $ivB64);
		
		$aeskey = $this->myPrivateKey['privRsa']->decrypt($wrappedKey);
//		$aeskeyB64 = base64url_encode($aeskey);
//		echo 'aes-key: ' . $aeskeyB64;
		return $aeskey;
	}
}

/*
Crypt::testAes('');
require_once __DIR__ . '/config/conf-allservers.php';
require_once 'config/conf-thisserver.php';
global $pServerKeys, $pserverkey;
$cipher = new Crypt($pServerKeys, $pserverkey);
$aeskey = $cipher->unwrapKey('XVwsNssTIC4Uhv0ijOB9q4mEUxeGedsWhptPQdqAZY+VM5KQg/XM8W+BD6wVT+d58y6p7spwj5UnehGUgUtRtjgTWpP4KbbZ9tfaQBvqTkes/kkBDbI4Zbks8HrT8cGzDwUNaXqPZ7d3sRbKtAGjMaQYvm57UZgKfB03zo+Cc3vaeXkIFvZQi08uzfvrJS3tT2hj4S6ivqWicISzs0jf2Xqza2+DQKnPLpBWvAvpL+y4OiVqF0rDsrmwk+GG2LWMj+nkTBGLxzjLGz7XZesXjIU5o4YjrkcF5QBfKgFNryT7ibbBuEyZhWMfcyhR0BVZD9PTWOCt/DP5zW9Fx2Nvow');
$aeskeyB64 = base64url_encode($aeskey);
echo "\r\nunwrapping was correct: " . ($aeskeyB64 === 'FJM9D66p2HnL5nPCM8Q6tpSYztIUfy6dGF4DqFta5_w');
*/

?>