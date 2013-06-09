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
	var transm = new Object();
	transm.str        = JSON.stringify(ballot);
	transm.checksum   = SHA256(transm.str);
	return transm;
}


/**
 * @TODO use the smallest key size of all servers
 * attention: the bitsize of all permission server's keys must be equal 
 * @param electionId
 * @param numBallots
 * @param serverList
 * @param forServer Nummer des Servers, für den der Req erzeugt werden soll
 * @returns {Object}
 */

function makeBlindSigReqForFirstServer(electionId, numBallots, serverList, forServer) {
	var ballots = new Array();
	if (forServer == 1) {
	for (var i=0; i<numBallots; i++) {
		var ballot = new Object();
		ballot.raw    = makeBallotRaw(electionId, bitSize(serverList[0].key.n)); // attention: the bitsize of all permission servers must be equal
		ballot.transm = addBallotChecksum(ballot.raw);
		for (var j=0; j<serverList.length; j++) {
			ballot.blindingf[j] = RsablindingFactorsGen(bitSize(serverList[j].key.n) - 1, serverList[j].key.n);
		}
		ballot.blinded[0] = rsaBlind(ballot.transm.checksum, ballot.blindingf[forServer], serverList[forServer].key);
		ballot.signer[0]  = forServer;
		ballots[i] = ballot;
	}
	return ballots;
	}
}

function makeBlindSigReqForOtherServers(ballots, serverList, forServer) {
	var prevSig;
	for (ballot in ballots) {
		if (sign in ballot.transm) {prevSig = ballot.transm.sign[ballot.transm.sign.length-1]; }
		else                       {prevSig = ballot.transm.checksum;}
		ballot.blinded[forServer] = rsaBlind(prevSig, ballot.blindingf[forServer], serverList[forServer].key);
	}
}


function makePermissionReqs(voterId, secret, electionId, numBallots, serverList) {
	var serverSeq = new Array;
	var ballots = makeBlindSigReqForFirstServer(electionId, numBallots, serverList, nextServer);
	for (var s=0; s<serverList.lenght; s++) {
		var nextServer = getNextPermServer(serverSeq, serverList);
		serverSeq[s] = nextServer;
		makePermissionReq(voterId, secret, electionId, ballots, serverList); 
	}
}

function makeNextPermissionReq(){
	
}


function makePermissionReq(voterId, secret, electionId, ballots, serverList) {
	var req = new Object();
	for (var i=0; i<ballots.length; i++) {
		req[i].blindedHash = ballots[i].blinded[ballots[i].blinded.length - 1];
	}
	req['voterId'] = voterId;
	req['secret']  = secret;
	return JSON.stringify(req);
}
	

function getNextPermServer(serverSeq, serverList) {
	for (var i=0; i<serverList.length; i++) { 
		nextServer = Math.round((Math.random()*serverList.length)); // find the next random server number
		var j = 0;
		while (serverSeq.indexOf(nextServer) > 0 && j < serverList.length) {
			nextServer++;
			j++;
			if (nextServer == serverList.lenght) {nextServer = 0;}
		}
		if (j == serverList.length) {return -1;}
	}
    return nextServer;
}

function makeUnblindedreqestedBallots(reqestedBallots, allBallots){
	var answer = new Array();
	for (var i=0; i<reqestedBallots.length; i++) {
		answer[i] = allBallots[reqestedBallots[i]]; 
	}
	return JSON.stringify(answer);
}

function verifySaveElectionPermiss(serverAnsw, ballots, serverKey) {
	// answ: array of signed: .num .blindSignatur
	var answ     = JSON.parse(serverAnsw); // decode answer
	for (var i=0; i<answ.length; i++) {
		var signatur = rsaUnblind(answ[i].blindSignatur, ballots[answ[i].num].blindingf, serverKey);  // unblind
		var testsign = RsaEncDec(signatur, serverKey);
		var signOk   = equals(testsign, ballots[answ[i].num].transm.checksum);
		j = ballots[answ.num[i]].transm.blindsig.length;
		ballots[answ[i].num].transm.blindsig[j] = answ[i].blindSignatur;  
		ballots[answ[i].num].transm.sign[j]     = signatur;
		ballots[answ[i].num].transm.signOk[j]   = signOk; 
	}
	return ballots;
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
	var slist  = new Array();
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
