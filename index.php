<?php
include_once 'electionGui.php';
?>

<body>
<html>

<?php
include_once 'BigInt.html';

include_once 'Crypt/RSA.php';
if (!class_exists('Math_BigInteger')) { require_once('Math/BigInteger.php'); }
include_once 'rsaMyExts.php';
	
	
$rsa       = new rsaMyExts();
$p         = new Math_BigInteger('132142866940061439369049939392871171837');
$q         = new Math_BigInteger('329739346824962665858211019049028523431');
$exppriv   = new Math_BigInteger('26810339711175068571895897630425577741285181744474600748544636921940254686473', 10);
$exppubl   = new Math_BigInteger('65537', 10);
$n         = new Math_BigInteger('43572702632393812002389124439062643234946865623253726132688386065774781812747', 10);

$mykey = $rsa->rsaGetHelpingNumbers($p, $q, $exppriv, $exppubl, $n);
print "<br> mein Key <br>";
print_r($mykey);
print "<br> mein Key Ende <br>";

$rsa->setPrivateKeyFormat(CRYPT_RSA_PRIVATE_FORMAT_PKCS1);
$rsa->loadKey($mykey['privatekey']);

$rsa->setEncryptionMode(CRYPT_RSA_ENCRYPTION_PKCS1);
$ciphered  = $rsa->encrypt('hallo! Ich bin wahlberechtigt.');
# $ciphered  = $rsa->_rsaes_pkcs1_v1_5_encrypt('h');
print "verschlüsselt: <br>";
print_r($ciphered);
print "<br>";
$rsa->loadKey($mykey['publickey']);
$decrypted = $rsa->decrypt($ciphered);

print "<br>entschlüsselt: /$decrypted/ <br>";

# print_r($rsa);

?>
</html>
</body>