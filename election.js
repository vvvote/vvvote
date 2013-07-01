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
	transm.str  = JSON.stringify(tmp);
	transm.hash = SHA256(transm.str); // returns an hex-encoded string
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

function makeBallots(election, forServer) {
	var ballots = new Array();
	for (var i=0; i<election.numBallots; i++) {
		var ballot = new Object();
		if (election.xthServer == 0) {
			ballot.raw    = makeBallotRaw(election.electionId, bitSize(election.pServerList[0].key.n)); // attention: the bitsize of all permission servers must be equal
			ballot.transm = addBallothash(ballot.raw);
			ballot.ballotno = i;
			ballot.blindingf = new Array();
			for (var j=0; j<election.pServerList.length; j++) {
				ballot.blindingf[j] = RsablindingFactorsGen(bitSize(election.pServerList[j].key.n) - 1, election.pServerList[j].key.n);
			}
			ballot.blindedHash = new Array();
		} else {
			ballot = election.ballots[i];
		}
		ballot.blindedHash[election.xthServer] = rsaBlind(str2bigInt(ballot.transm.hash, 16), ballot.blindingf[forServer], election.pServerList[forServer].key);
/* only for debugging purposes
		ballot.blindedHashStr = bigInt2str(ballot.blindedHash[0], 10);
		ballot.signedBlinded  = powMod(ballot.blindedHash[0], election.pServerList[forServer].key.exppriv, election.pServerList[forServer].key.n);
		ballot.signedBlindedStr  = bigInt2str(ballot.signedBlinded, 10);
		ballot.unblindedHash = rsaUnblind(ballot.signedBlinded, ballot.blindingf[forServer], election.pServerList[forServer].key);
		ballot.unblindedHashStr =  bigInt2str(ballot.unblindedHash, 10);
		ballot.verifyStr     = bigInt2str(RsaEncDec(ballot.unblindedHash, election.pServerList[forServer].key), 10);
		ballot.verifyStrHex  = bigInt2str(RsaEncDec(ballot.unblindedHash, election.pServerList[forServer].key), 16);
*/
		// ballot.sigBy[election.xthServer] = election.pServerList[forServer].name;
		ballots[i] = ballot;
	}
	election.ballots = ballots;
	return ballots;
}


function makePermissionReqs(election) {
	// voterId, secret, electionId, numBallots, serverList
	//global base;
	if ('xthServer' in election) { election.xthServer++;   }
	else                         { election.xthServer = 0; }
	var forServer = getNextPermServer(election); 
	var ballots   = makeBallots(election, forServer); 
	var req = new Object();
	req.cmd = 'pickBallots';
	req.ballots = new Array();
	for (var i=0; i<election.numBallots; i++) {
		req.ballots[i] = new Object();
		req.ballots[i].blindedHash = bigInt2str(ballots[i].blindedHash[election.xthServer], base);
		req.ballots[i].ballotno    = i;
		if ('sigs' in ballots[i].transm) {
			req.ballots[i].sigs = new Array();
			for (var s=0; s<ballots[i].transm.sigs.length; s++) {
				req.ballots[i].sigs[s] = Object();
				req.ballots[i].sigs[s].sig    = ballots[i].transm.sigs[s].sig;
				req.ballots[i].sigs[s].sigBy  = ballots[i].transm.sigs[s].sigBy;
				req.ballots[i].sigs[s].serSig = ballots[i].transm.sigs[s].serSig;
			}
		}
	}
	req.xthServer = election.xthServer;
	return req;
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

function reqSigsNextpServerEvent(election, data) {
	verifySaveElectionPermiss(election, data);
	return makePermissionReqs(election);
}

function makeFirstPermissionReqs(election) {
	var ret = makePermissionReqs(election);
	addCredentials(election, ret);
	return JSON.stringify(ret);
}

function savePermissionEvent(election, data) {
	verifySaveElectionPermiss(election, data); // TODO return an error if verification failed
	ret = new Array();
	for (var i=0; i<election.ballots.length; i++) {
		if ('sigs' in election.ballots[i].transm) {
			if (election.ballots[i].transm.sigs.length == election.pServerList.length) {
				ret.push(election.ballots[i].transm);
			}
		};
	}
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
		if ('sigs' in ballots[requestedBallots[i]].transm) {
			transm.ballots[i].sigs = new Array();
			for (var s=0; s<ballots[requestedBallots[i]].transm.sigs.length; s++) {
				transm.ballots[i].sigs[s] = Object();
				transm.ballots[i].sigs[s].sig    = ballots[requestedBallots[i]].transm.sigs[s].sig;
				transm.ballots[i].sigs[s].sigBy  = ballots[requestedBallots[i]].transm.sigs[s].sigBy;
				transm.ballots[i].sigs[s].serSig = ballots[requestedBallots[i]].transm.sigs[s].serSig;
			};
		};
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
			if (nextServer == election.pServerList.length) {nextServer = 0;};
		}
		if (j == election.pServerList.length) {return -1;};
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
	var sigsOk;
	for (var i=0; i<answ.ballots.length; i++) {
		// TODO think about: this only checks the newest sig
		var blindedSig = str2bigInt(answ.ballots[i].sigs.slice(-1)[0].sig, base);
		var signatur = rsaUnblind(blindedSig, election.ballots[answ.ballots[i].ballotno].blindingf[prevServer], serverKey);  // unblind
		var testsign = RsaEncDec(signatur, serverKey);
		var myhash   = str2bigInt(election.ballots[answ.ballots[i].ballotno].transm.hash, 16);
		var sigOk   = equals(testsign, myhash); // TODO test serSig
		if ('sigs' in election.ballots[answ.ballots[i].ballotno].transm) {
			j = election.ballots[answ.ballots[i].ballotno].transm.sigs.length;	
		} else {
			election.ballots[answ.ballots[i].ballotno].transm.sigs = new Array();
			j = 0;
		}
		election.ballots[answ.ballots[i].ballotno].transm.sigs[j] = Object();
		election.ballots[answ.ballots[i].ballotno].transm.sigs[j].blindSig = answ.ballots[i].sigs.slice(-1)[0].sig;  
		election.ballots[answ.ballots[i].ballotno].transm.sigs[j].sig      = bigInt2str(signatur, base);
		election.ballots[answ.ballots[i].ballotno].transm.sigs[j].sigBy    = serverKey.serverId;
		election.ballots[answ.ballots[i].ballotno].transm.sigs[j].sigOk    = sigOk;
		election.ballots[answ.ballots[i].ballotno].transm.sigs[j].serSig   = answ.ballots[i].sigs.slice(-1)[0].serSig; //TODO unblind
		if (i == 0) {sigsOk = sigOk;            }
		else        {sigsOk = (sigsOk && sigOk);}
		
	}
	
	return sigsOk;
}


function makeVote(ballots, numRequiredSignatures, vote) {
	var j = 0;
	var numsigners = 0;
	for (var i=0; i<ballots.length; i++) { // find the ballot that is signed by most permission servers
		if (ballots[i].transm.sign.length > numsigners) {
			numsigners = ballots[i].transm.sigs.length;
			j = i;
		};
	}
	if (numsigners < numRequiredSignatures) {throw "Not enough permission signarures acquired";}
	votedballot      = ballots[j];
	votedballot.vote = vote;
	return votedballot; 
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
	voteTransm.signatures = vote.transm.sigs;
	voteTransm.vote       = vote;
	return voteTransm;
}

function handleServerAnswer(election, dataString) {
	try {
	var data = JSON.parse(dataString);
	} catch (e) {
		return Object({'action':'clientError', 'errorText': "could not JSON decode: (" + e + ") \n" + dataString});
	}
	var ret;
	switch (data.cmd) {
	case 'unblindBallots':
		ret = unblindBallotsEvent(election, data);
		break;
	case 'reqSigsNextpServer':
		if (election.xthServer < (election.pServerList.length -1)) {
			ret = reqSigsNextpServerEvent(election, data);
		} else {
			return Object({'action':'clientError', 'errorText': "I already got enough sigs but server said: 'more sigs needed': \n" + dataString});
		}
		break;
	case 'savePermission':
		// create the string to be saved 
		ballotFileContent = savePermissionEvent(election, data);
		return Object({'action':'savePermission', 'data': ballotFileContent});
		break;
	case 'error':
		return Object({'action':'serverError', 'errorText': data.errorTxt, 'errorNo': data.errorNo});
	default:
		return Object({'action':'clientError', 'errorText': "unknown server cmd: " + data.cmd});
	break;
	}
	addCredentials(election, ret);
	send = JSON.stringify(ret);
	return Object({'action':'send', 'data':send});
}


/**
 * config
 * @returns {Array}
 */

function getPermissionServerList() {
	// load config
	random = true;
	base = 16; // basis used to encode/decode bigInts
	var slist  = new Array();
	var server0 = new Object();
	var server1 = new Object();
	var key0    = new Object();
	var key1    = new Object();
	server0.name = 'PermissionServer0';
	server0.url  = 'getpermission.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';
	key0.exp     = str2bigInt('65537', 10);  
	key0.exppriv = str2bigInt('1210848652924603682067059225216507591721623093360649636835216974832908320027478419932929', 10); //@TODO remove this bvefore release, only needed for debugging
	key0.n       = str2bigInt('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10);
	key0.serverId = server0.name;
	server0.key = key0; 
	slist[0] = server0;
	
	server1.name = 'PermissionServer1';
	server1.url = 'http://www2.webhod.ra/vvvote2/getpermission.php';
	key1.exp     = str2bigInt('65537', 10);  
	key1.exppriv = str2bigInt('1210848652924603682067059225216507591721623093360649636835216974832908320027478419932929', 10); //@TODO remove this bvefore release, only needed for debugging
	key1.n       = str2bigInt('3061314256875231521936149233971694238047219365778838596523218800777964389804878111717657', 10);
	key1.serverId = server1.name;
	server1.key = key1;
	slist[1] = server1;
    return slist;	
};
