<?php
/**
 * This class handles the XmlHttp-messages between the counting server and the voter
 */

require_once 'exception.php';
require_once 'dbelections.php';
require_once __DIR__ . '/modules-election/blindedvoter/election.php'; // TODO use the election from election config
require_once __DIR__ . '/modules-tally/publishonly/tally.php';
require_once 'modules-auth/user-passw-list/auth.php';
require_once 'modules-auth/shared-passw/auth.php';



require_once 'config/conf-allservers.php';
require_once 'config/conf-thisserver.php';

header('Access-Control-Allow-Origin: *', false); // this allows any cross-site scripting
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

if (isset($HTTP_RAW_POST_DATA)) {
	// TODO avoid decoding the request twice
	// move the instanciations to a common place
	try {
		$reqdecoded = json_decode($HTTP_RAW_POST_DATA, true); // TODO error handling
		if (! isset($reqdecoded['cmd']))  WrongRequestException::throwException(1200, 'Excpected a command', 'got: ' . $HTTP_RAW_POST_DATA);
		switch ($reqdecoded['cmd']) {
			case 'getAllVotes': $electionId = $reqdecoded['electionId']; break;
			case 'storeVote':   $electionId = $reqdecoded['permission']['signed']['electionId']; break;
			default:  WrongRequestException::throwException(1201, 'Only commands >getAllVotes< and >storeVote< are accepted', $reqdecoded['cmd']);
				break;
		}
		$dbElections = new DbElections($dbInfos);
		$elconfig = $dbElections->loadElectionConfigFromElectionId($electionId);
		if (! isset($elconfig['auth']))  WrongRequestException::throwException(1202, 'Election Id not found', $electionId);
		// TODO test if isset($elconfig['auth'])
		switch ($elconfig['auth']) {
			case 'userPassw':   $auth = new UserPasswAuth($dbInfos); break;
			case 'sharedPassw': $auth = new SharedPasswAuth($dbInfos); break;
			default: WrongRequestException::throwException(1203, 'Only auth modules >userPassw< and >sharedPassw< are accepted', $elconfig['auth']);
				break;
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
		// echo $HTTP_RAW_POST_DATA;
		$tally = new PublishOnlyTelly($dbInfos, new Crypt($pServerKeys, $serverkey), $el); // TODO use a different private key for tallying server
		$result = $tally->handleTallyReq($HTTP_RAW_POST_DATA);
		// print "\r\n";
	} catch (WrongRequestException $e) {
		$result = json_encode($e->makeServerAnswer());
	}
	print "$result";
}

?>