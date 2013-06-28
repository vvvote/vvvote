<?php
require_once 'rsaMyExts.php';

$p         = new Math_BigInteger('10645752675217578369956837062782498220775273');
$q         = new Math_BigInteger('287562030630461198841452085101513512781647409');
$exppriv   = new Math_BigInteger('1210848652924603682067059225216507591721623093360649636835216974832908320027478419932929', 10);
$exppubl   = new Math_BigInteger('65537', 10);
$n         = new Math_BigInteger('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10);

$rsa       = new rsaMyExts();
$serverkey = $rsa->rsaGetHelpingNumbers($p, $q, $exppriv, $exppubl, $n);
$thisServerName = 'PermissionServer1';
$debug     = true;

define('USE_PDO',0);  // 1: Zugriff via PDO; 0: zugrif via mysql_ bzw. mssql_
define('DB_TYP','MySQL'); // MySQL oder MSSQL

if (DB_TYP=='MySQL') {
	define('DB_HOST','localhost');
	define('DB_USER','root');
	define('DB_NAME','election');
	define('DB_PASSWORD','geheim');
} else {
	define('DB_HOST','localhost,1433');
	define('DB_USER','sa');
	define('DB_NAME','master');
	define('DB_PASSWORD','geheim');
}

?>