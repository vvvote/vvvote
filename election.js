/**
 * 
 * @param electionId
 * @returns {___ballot0}
 */


function makeBallotRaw(electionId, bits) {
	var ballot = new Object();
	ballot.electionId = electionId;
	if (random) {
		ballot.votingno   = randBigInt(bits, 0);  
		ballot.salt       = randBigInt(bits, 0);
	} else {
		ballot.votingno   = str2bigInt('1', 10); 
		ballot.salt       = str2bigInt('6', 10);
	}
	return ballot;
}


function addBallothash(ballot) {
	var tmp = new Object();
	tmp.electionId = ballot.electionId;
	tmp.votingno   = bigInt2str(ballot.votingno, base);
	tmp.salt       = bigInt2str(ballot.salt, base);
	var transm = new Object();
	transm.str        = JSON.stringify(tmp);
	transm.hash   = SHA256(transm.str); // returns an hex-encoded string
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

function makeBlindSigReqForFirstServer(election, forServer) {
	//var electionId, numBallots, serverList;
	var ballots = new Array();
	for (var i=0; i<election.numBallots; i++) {
		if (election.xthServer == 0) {
			var ballot = new Object();
			ballot.raw    = makeBallotRaw(election.electionId, bitSize(election.pServerList[0].key.n)); // attention: the bitsize of all permission servers must be equal
			ballot.transm = addBallothash(ballot.raw);
			ballot.transm.ballotno = i;
			ballot.blindingf = new Array();
			for (var j=0; j<election.pServerList.length; j++) {
				ballot.blindingf[j] = RsablindingFactorsGen(bitSize(election.pServerList[j].key.n) - 1, election.pServerList[j].key.n);
				var kw = bigInt2str(ballot.blindingf[j].unblind, 10); // TODO remove
			}
			ballot.blindedHash    = new Array();
		} else {
			ballot = election.ballots[i];
		}
		ballot.blindedHash[election.xthServer] = rsaBlind(str2bigInt(ballot.transm.hash, 16), ballot.blindingf[forServer], election.pServerList[forServer].key);

		ballot.blindedHashStr = bigInt2str(ballot.blindedHash[0], 10);
		ballot.signedBlinded  = powMod(ballot.blindedHash[0], election.pServerList[forServer].key.exppriv, election.pServerList[forServer].key.n);
		ballot.signedBlindedStr  = bigInt2str(ballot.signedBlinded, 10);
		ballot.unblindedHash = rsaUnblind(ballot.signedBlinded, ballot.blindingf[forServer], election.pServerList[forServer].key);
		ballot.unblindedHashStr =  bigInt2str(ballot.unblindedHash, 10);
		ballot.verifyStr     = bigInt2str(RsaEncDec(ballot.unblindedHash, election.pServerList[forServer].key), 10);
		ballot.verifyStrHex  = bigInt2str(RsaEncDec(ballot.unblindedHash, election.pServerList[forServer].key), 16);
		ballot.sigBy     = new Array();
		ballot.sigBy[0]  = forServer;
		ballots[i]       = ballot;
	}
	election.ballots = ballots;
	return ballots;
}

function makeBlindSigForNextServers(election, forServer) {
	
}

function makeBlindSigReqForOtherServers(ballots, serverList, forServer) {
	var prevSig;
	for (ballot in ballots) {
		if (sign in ballot.transm) {prevSig = ballot.transm.sign[ballot.transm.sign.length - 1]; }
		else                       {prevSig = ballot.transm.hash;}
		ballot.blinded[forServer] = rsaBlind(prevSig, ballot.blindingf[forServer], serverList[forServer].key);
	}
}


function makeFirstPermissionReqs(election) {
	// voterId, secret, electionId, numBallots, serverList
	//global base;
	if (election.xthServer) { election.xthServer++; }
	else                    { election.xthServer = 0; }
	var forServer = getNextPermServer(election); 
	var ballots   = makeBlindSigReqForFirstServer(election, forServer); 
	var req = new Object();
	req.cmd = 'pickBallots';
	
	req.blindedHash = new Array();
	for (var i=0; i<election.numBallots; i++) {
		req.blindedHash[i] = bigInt2str(ballots[i].blindedHash[0], base);
	}
	req.xthServer      = election.xthServer;
	addCredentials(election, req);
	return JSON.stringify(req);
}

/*

function makePermissionReqs(voterId, secret, electionId, numBallots, serverList) {
	var serverSeq = new Array;
	var ballots = makeBlindSigReqForFirstServer(electionId, numBallots, serverList, nextServer);
	for (var s=0; s<serverList.lenght; s++) {
		var nextServer = getNextPermServer(serverSeq, serverList);
		serverSeq[s] = nextServer;
		makePermissionReq(voterId, secret, electionId, ballots, serverList); 
	}
	return JSON.stringify(req);
}
*/

function makeNextPermissionReq(election, data){
}

/**
 * adds the credentials to the request Object
 * @param election
 * @param req
 * @returns
 */
function addCredentials(election, req) {
	req['voterId']    = election.voterId;
	req['secret']     = election.secret;
	req['electionId'] = election.electionId;
	return req;
}

function makePermissionReq(voterId, secret, electionId, ballots, serverList) {
	var req = new Object();
	for (var i=0; i<ballots.length; i++) {
		req.blindedHash[i] = ballots[i].blinded[ballots[i].blinded.length - 1];
	}
	req['voterId'] = voterId;
	req['secret']  = secret;
	return JSON.stringify(req);
}

function reqSigsNextpServerEvent(election, data) {
	// verify the received sigs
	return verifySaveElectionPermiss(election, data);
	// makePermuissionReqs
}

function handleServerAnswer(election, dataString) {
	var data = JSON.parse(dataString);
	if ('errorno' in data) {
		alert ("Error occured: $data.errorno $data.text");
	} else {
		switch (data.cmd) {
		case 'unblindBallots':
			ret = unblindBallotsEvent(election, data);
			break;
		case 'reqSigsNextpServer':
			ret = reqSigsNextpServerEvent(election, data);
			break;
		case 'savePermission':
			//
			break;

		default:
			break;
		}
	}
	addCredentials(election, ret);
	return JSON.stringify(ret);
}


function unblindBallotsEvent(election, requestedBallots) {
	var ret = disclose(election, requestedBallots.picked, election.ballots, election.pServerSeq[election.pServerSeq.length - 1]);
	ret.cmd = 'signBallots';
	return ret;
}


// bigInt2str

function disclose(election, requestedBallots, ballots, forServer) {
	// @TODO make sure to never disclose all ballots
	var transm = Object();
	transm.ballots = new Array();
	for (var i=0; i<requestedBallots.length; i++) {
		transm.ballots[i]            = new Object();
		transm.ballots[i].votingno   = bigInt2str(ballots[requestedBallots[i]].raw.votingno, base);
		transm.ballots[i].salt       = bigInt2str(ballots[requestedBallots[i]].raw.salt, base);
		transm.ballots[i].electionId = ballots[requestedBallots[i]].raw.electionId;
		transm.ballots[i].hash       = ballots[requestedBallots[i]].transm.hash;
		transm.ballots[i].unblindf   = bigInt2str(ballots[requestedBallots[i]].blindingf[forServer].unblind, base);
		transm.ballots[i].blindedHash = bigInt2str(ballots[requestedBallots[i]].blindedHash[election.xthServer], base); // TODO this is not needed to transmitt remove it before release
		// var blindedHashSig = RsaEncDec(str2bigInt(transm.ballots[i].blindedHash, 16), key.exppriv);
		// var unblindedHashSig = (str2bigInt(transm.ballots[i].blindedHash, 16), key.exppriv);
		transm.ballots[i].ballotno = requestedBallots[i];
		if (ballots[requestedBallots[i]].transm.sigs) {
			for (var s=0; s<ballots[requestedBallots[i]].transm.sigs.length; s++) {
				transm.ballots[i].sigs[j]       = bigInt2str(ballots[requestedBallots[i]].transm.sigs[j], base);
				transm.ballots[i].sigBy[j]      = ballots[requestedBallots[i]].transm.sigBy[j];
			}
		}
	}
	return transm;
}


function getNextPermServer(election) {
	// var serverSeq, pServerList;
	if (!election.pServerSeq) {election.pServerSeq = new Array();}
	for (var i=0; i<election.pServerList.length; i++) { 
		nextServer = Math.round((Math.random()*(election.pServerList.length - 1))); // find the next random server number
		var j = 0;
		while (election.pServerSeq.indexOf(nextServer) > 0 && j < election.pServerList.length) {
			nextServer++;
			j++;
			if (nextServer == election.pServerList.length) {nextServer = 0;}
		}
		if (j == election.pServerList.length) {return -1;}
	}
	election.pServerSeq.push(nextServer);
    return nextServer;
}

function makeUnblindedreqestedBallots(reqestedBallots, allBallots){
	var answer = new Array();
	for (var i=0; i<reqestedBallots.length; i++) {
		answer[i] = allBallots[reqestedBallots[i]]; 
	}
	return JSON.stringify(answer);
}

function verifySaveElectionPermiss(election, answ) {
	var prevServer = election.pServerSeq[election.pServerSeq.length-1];
	var serverKey  = election.pServerList[prevServer].key;
	// answ: array of signed: .num .blindSignatur .serverId
	// var answ     = JSON.parse(serverAnsw); // decode answer
	for (var i=0; i<answ.ballots.length; i++) {
		var blindedSig = str2bigInt(answ.ballots[i].sigs.slice(-1)[0].sig, base);
		var signatur = rsaUnblind(blindedSig, election.ballots[answ.ballots[i].ballotno].blindingf[prevServer], serverKey);  // unblind
		var testsign = RsaEncDec(signatur, serverKey);
		var myhash   = str2bigInt(election.ballots[answ.ballots[i].ballotno].transm.hash, 16);
		var signOk   = equals(testsign, myhash);
		if (election.ballots[answ.ballots[i].ballotno].transm.sig) {
			j = election.ballots[answ.ballots[i].ballotno].transm.sig.length;	
		} else {
			election.ballots[answ.ballots[i].ballotno].transm.sigs     = new Array();
			election.ballots[answ.ballots[i].ballotno].transm.blindsig = new Array();
			election.ballots[answ.ballots[i].ballotno].transm.sigBy    = new Array();
			election.ballots[answ.ballots[i].ballotno].transm.signOk   = new Array();
			j = 0;
		}
		
		election.ballots[answ.ballots[i].ballotno].transm.blindsig[j] = answ.ballots[i].sigs.slice(-1)[0].sig;  
		election.ballots[answ.ballots[i].ballotno].transm.sigs[j]     = bigInt2str(signatur, base);
		election.ballots[answ.ballots[i].ballotno].transm.sigBy[j]    = serverKey.serverId;
		election.ballots[answ.ballots[i].ballotno].transm.signOk[j]   = signOk; 
	}
	return election.ballots;
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
	random = true;
	base = 16; // basis used to encode/decode bigInts
	var slist  = new Array();
	var server = new Object();
	var key    = new Object();
	server.name = 'PermissionServer1';
	server.url  = '';
	key.exp     = str2bigInt('65537', 10);  
	key.exppriv = str2bigInt('1210848652924603682067059225216507591721623093360649636835216974832908320027478419932929', 10); //@TODO remove this bvefore release, only needed for debugging
	key.n       = str2bigInt('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10);
	key.serverId = server.name;
	server.key = key; 
	slist[0] = server;
	server.name = 'PermissionServer2';
	slist[1] = server;
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
