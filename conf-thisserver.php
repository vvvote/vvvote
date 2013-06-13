<?php
require_once 'rsaMyExts.php';

$p         = new Math_BigInteger('132142866940061439369049939392871171837');
$q         = new Math_BigInteger('329739346824962665858211019049028523431');
$exppriv   = new Math_BigInteger('26810339711175068571895897630425577741285181744474600748544636921940254686473', 10);
$exppubl   = new Math_BigInteger('65537', 10);
$n         = new Math_BigInteger('43572702632393812002389124439062643234946865623253726132688386065774781812747', 10);

$rsa       = new rsaMyExts();
$serverkey = $rsa->rsaGetHelpingNumbers($p, $q, $exppriv, $exppubl, $n);

?>