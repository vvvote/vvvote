<?php



chdir(__DIR__); require_once './connectioncheck.php';  // answers if &connectioncheck is part of the URL and exists

chdir(__DIR__); require_once './tools/exception.php';
chdir(__DIR__); require_once './tools/loadmodules.php';

header("Content-type: text/plain");
header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"); // this allows any cross-site scripting (needed for chrome)
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');



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

$HTTP_RAW_POST_DATA = file_get_contents('php://input'); // read the post data, works in php 7 without muddling in php.ini

if ($HTTP_RAW_POST_DATA !== false) {
	$electionIdPlace = function ($a) {
		if (! isset($a['electionId'])) WrongRequestException::throwException(7200, 'Election id missing in client request'	, $GLOBALS['HTTP_RAW_POST_DATA']);
		return      $a['electionId'];
	};
	try{
		$el = loadElectionModules($HTTP_RAW_POST_DATA, $electionIdPlace);
		$result = $el->handlePermissionReq($HTTP_RAW_POST_DATA);
		// print "\r\n";
	} catch (ElectionServerException $e) {
		$result = json_encode($e->makeServerAnswer());
	} // TODO catch all exceptions
	print "$result";
}

// echo "\n\n:: Files received ::\n\n";
// print_r($_FILES);

?>