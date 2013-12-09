<?php
require_once 'exception.php';
require_once 'Crypt/RSA.php';
require_once 'modules-db/dbMySql.php'; 
require_once 'dbelections.php';
require_once 'modules-election/blindedvoter/election.php';
require_once 'modules-auth/user-passw-list/auth.php';
require_once 'modules-auth/shared-passw/auth.php';

require_once 'config/conf-allservers.php';
require_once 'config/conf-thisserver.php';

header("Content-type: text/plain");
header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"); // this allows any cross-site scripting (needed for chrome)

// header("Access-Control-Allow-Origin: http://www.webhod.ra", false);
// header("Access-Control-Allow-Origin: http://www2.webhod.ra", false);

// echo ":: data received via GET ::\n\n";
// print_r($_GET);

// echo "\n\n:: Data received via POST ::\n\n";
// print_r($_POST);

// echo "\n\n:: Data received as \"raw\" (text/plain encoding) ::\n\n";

/**
 * error no start at 6000
 */
if (isset($HTTP_RAW_POST_DATA)) {
	// echo $HTTP_RAW_POST_DATA;
	//$db = new DbMySql(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PREFIX, DB_TYP);
	// TODO avoid decoding the request twice
	try{
		$dbElections = new DbElections($dbInfos);
		$reqdecoded = json_decode($HTTP_RAW_POST_DATA, true); // TODO error handling
		$elconfig = $dbElections->loadElectionConfigFromElectionId($reqdecoded['electionId']); // TODO error handling, e.g. issset($reqdecoded['electionId'])...
		if (count($elconfig) < 1) {
			WrongRequestException::throwException(6000, 'Election ID not found', "ElectionId you sent: " . $reqdecoded['electionId']);
		}
		switch ($elconfig['auth']) {
			case 'userPassw': $auth = new UserPasswAuth($dbInfos); break;
			case 'sharedPassw': $auth = new SharedPasswAuth($dbInfos); break;
			default: /* TODO return an error */ break;
		}
		$el = new Election($elconfig['electionId'],
				$numVerifyBallots,
				$numSignBallots,
				$pServerKeys,
				$serverkey,
				$numAllBallots,
				$numPSigsRequiered,
				$dbInfos,
				$auth);
		$result = $el->handlePermissionReq($HTTP_RAW_POST_DATA);
		// print "\r\n";
	} catch (WrongRequestException $e) {
		$result = json_encode($e->makeServerAnswer());
	} // TODO catch all exceptions
	print "$result";
}

// echo "\n\n:: Files received ::\n\n";
// print_r($_FILES);

?>