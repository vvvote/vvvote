/**
 * 
 * @param electionId
 * @returns {___ballot0}
 */

function makeBallotRaw(electionId, bits) {
	var ballot = new Object();
	ballot.electionId = electionId;
	ballot.votingno   = randBigInt(bits, 0);
	ballot.salt       = randBigInt(bits, 0);
	return ballot;
}


function addBallotChecksum(ballot) {
	ballot.str        = JSON.stringify(ballot);
	ballot.checksum   = SHA256(ballot.str);
}


function makeBlindSigReq(electionId, numVotingSheets, serverList) {
	var ballots = new Object();
	for (var i=0; i<numVotingSheets; i++) {
		var ballot = new Object();
		ballot.raw    = makeBallotRaw(electionId, bitSize(serverList[i].key.n));
		ballot.transm = addBallotChecksum(ballot.raw);
		for (var j=0; j<serverList.length; i++) {
			ballot.blindingf = RsablindingFactorsGen(bitSize(serverList[i].key.n) - 1, serverList[i].key.n);
			ballot.blinded   = rsaBlind(ballot.transm.checksum, ballot.blindingf, serverList[i].key);
		}
		ballots[i]         = ballot;
	}
	return ballots;	
}


function makePermissionReq(voterId, electionId, numVotingSheets, serverList) {
	var ballots = makeBlindSigReq(electionId, numVotingSheets, serverList);
	var req = new Object();
	for (var i=0; i<ballots.length; i++) {
		req[i][blindedHash] = ballots[i].blinded;
	}
	req['voterId'] = voterId;
	return JSON.stringify(req);
}

function makeUnblindedreqestedBallots(reqestedBallots, allBallots){
	var answer = new Object();
	for (var i=0; i<reqestedBallots.length; i++) {
		answer[i] = allBallots[reqestedBallots[i]]; 
	}
	return JSON.stringify(answer);
}

function verifySaveElectionPermiss(serverAnsw, ballots, serverKey) {
	// answ: array of signed: .num .blindSignatur
	var answ     = JSON.parse(serverAnsw); // decode answer
	for (var i=0; i<answ.length; i++) {
		var signatur = rsaUnblind(answ.blindSignatur, ballots[answ.num].blindingf, serverKey);  // unblind
		var testsign = RsaEncDec(signatur, serverKey);
		var signOk   = equals(testsign, ballots[answ.num].transm.checksum);
		j = ballots[answ.num].transm.blindsig.length;
		ballots[answ.num].transm.blindsig[j] = answ.blindSignatur;  
		ballots[answ.num].transm.sign[j]     = signatur;
		ballots[answ.num].transm.signOk[j]   = signOk; 
	}
}


function makeVote(ballots, numRequiredSignatures, vote) {
	var j = 0;
	var numsigners = 0;
	for (var i=0; i<ballots.length; i++) { // find the ballot that is signed by most permission servers
		if (ballots[i].transm.sign.length > numsigners) {
			numsigners = ballots[i].transm.sign.length;
			j = i;
		}
	}
	if (numsigners < numRequiredSignatures) {throw "Not enough permission signarures acquired";}
	votedballot      = ballots[j];
	votedballot.vote = vote;
	return votedballot; 
}

function getPermissionServerList() {
	// load config
	var slist  = new Object();
	var server = new Object();
	var key    = new Object();
	server.name = 'PermissionServer1';
	server.url  = '';
	key.exp     = str2bigInt('65537', 10);  
	key.n       = str2bigInt('43572702632393812002389124439062643234946865623253726132688386065774781812747', 10);
	server.key = key; 
	slist[0] = server;
    return slist;	
}


/**
 * 
 * @param vote
 * @returns {___voteTransm2}
 */
function makeVoteTransm(vote) {
	var voteTransm = new Object();
	voteTransm.electionId = vote.electionId;
	voteTransm.votingno   = vote.votingno;
	voteTransm.salt       = vote.salt;
	voteTransm.signatures = vote.transm.sign;
	voteTransm.vote       = vote;
	return voteTransm;
}
