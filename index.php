<?php
// phpinfo();
include_once 'electionGui.php';
?>

<body>
<html>

<?php
include_once 'BigInt.html';

include_once 'Crypt/RSA.php';
if (!class_exists('Math_BigInteger')) { require_once('Math/BigInteger.php'); }
include_once 'rsaMyExts.php';
	
$test = bcmod('1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', '7');
print "$test";




$rsa       = new rsaMyExts();
$p         = new Math_BigInteger('132142866940061439369049939392871171837');
$q         = new Math_BigInteger('329739346824962665858211019049028523431');
$exppriv   = new Math_BigInteger('26810339711175068571895897630425577741285181744474600748544636921940254686473', 10);
$exppubl   = new Math_BigInteger('65537', 10);
$n         = new Math_BigInteger('43572702632393812002389124439062643234946865623253726132688386065774781812747', 10);
$blindf    = new Math_BigInteger('27', 10);
$unblindf  = new Math_BigInteger('6455215204799083259613203620601873071843980092333885352990872009744412120407', 10);

$mykey = $rsa->rsaGetHelpingNumbers($p, $q, $exppriv, $exppubl, $n);
print "<br> mein Key <br>";
print_r($mykey);
print "<br> mein Key Ende <br>";

$rsa->setPrivateKeyFormat(CRYPT_RSA_PRIVATE_FORMAT_PKCS1);
$rsa->loadKey($mykey['publickey']);

$rsa->setEncryptionMode(CRYPT_RSA_ENCRYPTION_PKCS1);
$blinded = $rsa->rsaBlind(new Math_BigInteger('23', 10), $blindf);
print "verblindet: $blinded <br>";
$rsa->loadKey($mykey['privatekey']);

$ciphered  = $rsa->_rsaep($blinded);
# $ciphered  = $rsa->_rsaes_pkcs1_v1_5_encrypt('h');
print "signiert: <br>";
print_r($ciphered);
print "<br>";
$unblinded = $rsa->rsaUnblind($ciphered, $unblindf);
print "entblinded: $unblinded";
$rsa->loadKey($mykey['publickey']);
$decrypted = $rsa->_rsaep($unblinded);
print "<br>entschlüsselt: /$decrypted/ <br>";

# print_r($rsa);

?>
</html>
</body>