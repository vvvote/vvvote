
/**
 * This module does the internal work. The communication to the servers and the user (GUI) 
 * is done by the BlindedVoter-module
 * param credentials: the obj.method(electionId, serverName) has to return the credentials 
 */

var BlindedVoterPermObtainer = function(mainElectionId_, questions_, credentials_, config_) {
	this.config = {
			"numCreateBallots": config_.numCreateBallots, 
			"serverList":       config_.serverList,
	};
	// this.config.serverSeq = this.config.serverList.slice(); // slice() copies the content of the array
	this.config.serverSeq=[];
	for (var s=0; s<this.config.serverList.length; s++) {
		this.config.serverSeq[s] = s;
	}
	if(config_.shuffleServerSeq) this.config.serverSeq = shuffleArray(this.config.serverSeq);
	this.mainElectionId = mainElectionId_;

	this.questions = [];
	// copy the needed information from questeions[] only and by doing so create the completeElectionIds
	for (var q=0; q<questions_.length; q++) {
		this.questions[q] = {
				'completeElectionId': JSON.stringify({"mainElectionId": this.mainElectionId, "subElectionId": questions_[q].questionID}),
				'questionID': questions_[q].questionID
				};
	}
	this.credentials = {"obj": credentials_.obj, "method": credentials_.method};
	this.xthServer = 0;
};

/**
 * 
 * @param electionId
 * @returns {___ballot0}
 */


BlindedVoterPermObtainer._makeBallotRaw = function(electionId, keypair) {
	var ballot = new Object();
	ballot.electionId = electionId;
//	if (random) {
		ballot.votingno   = bigInt2str(keypair.pub.n, 16) + ' ' + bigInt2str(keypair.pub.exp, 16);
		var bits = bitSize(keypair.pub.n);
		ballot.salt       = randBigInt(bits, 0);
/*	} else {
		ballot.votingno   = '1'; 
		ballot.salt       = str2bigInt('6', 10);
	} */
	return ballot;
};

BlindedVoterPermObtainer._addBallothash = function(ballot) {
	var tmp = new Object();
	tmp.electionId = ballot.electionId;
	tmp.votingno   = ballot.votingno;
	if (typeof ballot.salt == "string") {
		tmp.salt = ballot.salt;
	} else {
		tmp.salt       = bigInt2str(ballot.salt, 16);
	}
	var transm  = new Object();
	transm.str  = unicodeToBlackslashU(JSON.stringify(tmp)); // unicodeToBlackslashU is necessary because php json_encode uses u\XXXX-notation instead of the direct unicode values. Without this hash verification will fail on server side if umlauts are in the electionId
	transm.hash = SHA256(transm.str); // returns an hex-encoded string
	return transm;
};


/**
 * creates ballots and saves them in this.questions[].ballot
 * TODO use the smallest key size of all servers
 * attention: the bitsize of all permission server's keys must be equal 
 * @param electionId
 * @param numBallots
 * @param serverList
 * @param forServer Nummer des Servers, für den der Req erzeugt werden soll
 * @returns {Object}
 */

BlindedVoterPermObtainer.prototype.makeBallots = function() {
	document.body.style.cursor = "progress"; // show sand watch as key generation can take a minute
	for (var q=0; q<this.questions.length; q++){
		var ballots = new Array();
		for (var i=0; i<this.config.numCreateBallots; i++) {
			var ballot = new Object();
			ballot.keypair  = RsaKeyGen(bitSize(this.config.serverList[0].key.n) >> 1, 1, str2bigInt('65537', 10, 0)); // attention: the bitsize of all permission servers must be equal
			ballot.raw      = BlindedVoterPermObtainer._makeBallotRaw(this.questions[q].completeElectionId, ballot.keypair); 
			ballot.transm   = BlindedVoterPermObtainer._addBallothash(ballot.raw);
			ballot.ballotno = i;
			ballot.blindingf = new Array();
			for (var j=0; j<this.config.serverList.length; j++) {
				ballot.blindingf[j] = RsablindingFactorsGen(bitSize(this.config.serverList[j].key.n) - 1, this.config.serverList[j].key.n);
			}
			ballot.blindedHash = new Array();
			for (var s=0; s<this.config.serverList.length; s++) {
				ballot.blindedHash[s] = rsaBlind(str2bigInt(ballot.transm.hash, 16), ballot.blindingf[s], this.config.serverList[s].key);
			}
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
		this.questions[q].ballots = ballots;
	}
	document.body.style.cursor = "auto";
};



BlindedVoterPermObtainer.prototype.makePermissionReqs = function() {
	var req = new Object();
	req.cmd = 'pickBallots';
	req.questions = [];
	for (var q=0; q<this.questions.length; q++) {
		req.questions[q] = {
				"questionID": this.questions[q].questionID, 
				"ballots" : []};
		for (var i=0; i<this.config.numCreateBallots; i++) {
			req.questions[q].ballots[i] = {
					'blindedHash': bigInt2str(this.questions[q].ballots[i].blindedHash[this.config.serverSeq[this.xthServer]], 16),
					'ballotno':    i	
			};
			if ('sigs' in this.questions[q].ballots[i].transm) {
				req.questions[q].ballots[i].sigs = new Array();
				for (var s=0; s<this.questions[q].ballots[i].transm.sigs.length; s++) {
					req.questions[q].ballots[i].sigs[s] = {
							'sig':    this.questions[q].ballots[i].transm.sigs[s].sig,
							'sigBy':  this.questions[q].ballots[i].transm.sigs[s].sigBy,
							'serSig': this.questions[q].ballots[i].transm.sigs[s].serSig};
				}
			}
		}
	}
	// not needed: req.xthServer = this.xthServer;
	return req;
};


BlindedVoterPermObtainer.prototype.getCurServer = function () {
	return this.config.serverList[this.config.serverSeq[this.xthServer]]; 
};

/**
 * adds the credentials to the request Object
 * @param req
 * @returns
 */
BlindedVoterPermObtainer.prototype.addCredentials = function(req) { 
	req['credentials'] = this.credentials.method.call(this.credentials.obj, this.mainElectionId, this.config.serverList[this.config.serverSeq[this.xthServer]].name);
	req['electionId'] = this.mainElectionId;
	return req;
};

BlindedVoterPermObtainer.prototype.reqSigsNextpServerEvent = function(data) {
	var sigsOk = this.verifySaveElectionPermiss(data);
	if (!sigsOk) throw new ErrorInServerAnswer(9238983, 'Verification of server signature failed. Aborted.', '');
	this.xthServer++;
	return this.makePermissionReqs();
};

/*
function makeFirstPermissionReqs(election) {
	var ret = makePermissionReqs(election);
	return ret;
}


function makePermissionReqsResume(election) {
	var ret = makePermissionReqsFromBallots(election, election.ballots);
	return ret;
}
*/


/**
 * 
 * @param data data receiced from the last permission server with the commmand "savePermission"
 * @returns the ballot which is signed by all permission servers as a JSON-encoded string
 */
BlindedVoterPermObtainer.prototype.savePermissionEvent = function(data) {
	var sigsOk = this.verifySaveElectionPermiss(data);
	if (!sigsOk) throw new ErrorInServerAnswer(9238983, 'Verification of server signature failed. Aborted.', '');
	var ret = new Array();
	for (var q=0; q<this.questions.length; q++) {
		// find the ballot who got the sigs from all permission servers and save that one
		for (var i=0; i<this.questions[q].ballots.length; i++) {
			var curBallot = this.questions[q].ballots[i];
			if ('sigs' in curBallot.transm) {
				if (curBallot.transm.sigs.length == this.config.serverList.length) {
					var b = new Object();
					b.transm = curBallot.transm;
					b.keypair = keypair2str(curBallot.keypair);
					ret.push(b);
				}
			}
		}
	}
	return ret;
};

BlindedVoterPermObtainer.prototype.unblindBallotsEvent = function(requestedBallots) {
	var ret = this.disclose(requestedBallots); //, election.pServerSeq[election.xthServer]);
	ret.cmd = 'signBallots';
	return ret;
};


// bigInt2str

BlindedVoterPermObtainer.prototype.disclose = function(requestedBallots) {
	// @TODO make sure to never disclose all ballots
	var transm = {'questions': []};
	for (var q=0; q<this.questions.length; q++) {
		transm.questions[q] = {
				'questionID': this.questions[q].questionID,
				'ballots':    []};
		for (var i=0; i<requestedBallots.questions[q].picked.length; i++) {
			var curPicked = requestedBallots.questions[q].picked[i];
			var curPickedBallot = this.questions[q].ballots[curPicked];
			transm.questions[q].ballots[i] = {
					'votingno':    curPickedBallot.raw.votingno,
					'salt':        bigInt2str(curPickedBallot.raw.salt, 16),
					'electionId':  curPickedBallot.raw.electionId,
					'hash':        curPickedBallot.transm.hash,
					'unblindf':    bigInt2str(curPickedBallot.blindingf[this.config.serverSeq[this.xthServer]].unblind, 16)
			};
			//'blindedHash': bigInt2str(curPickedBallot.blindedHash[election.xthServer], 16); // TODO this is not needed to transmitt remove it before release
			// var blindedHashSig = RsaEncDec(str2bigInt(transm.ballots[i].blindedHash, 16), key.exppriv);
			// var unblindedHashSig = (str2bigInt(transm.ballots[i].blindedHash, 16), key.exppriv);
			transm.questions[q].ballots[i].ballotno = curPicked;
			if ('sigs' in curPickedBallot.transm) {
				transm.questions[q].ballots[i].sigs = new Array();
				for (var s=0; s<curPickedBallot.transm.sigs.length; s++) {
					transm.questions[q].ballots[i].sigs[s] = {
							'sig':    curPickedBallot.transm.sigs[s].sig,
							'sigBy':  curPickedBallot.transm.sigs[s].sigBy,
							'serSig': curPickedBallot.transm.sigs[s].serSig	};
				};
			};
		}
	}
	return transm;
};

/**
 * If sigs are ok, they are saved in member questions[].ballots[].transm.sigs[]
 * @param answ
 * @returns {Boolean}
 */

BlindedVoterPermObtainer.prototype.verifySaveElectionPermiss = function(answ) {
	var prevServer = this.config.serverSeq[this.xthServer];
	var serverKey  = this.config.serverList[prevServer].key;
	// TODO check if the server did sign what I sent to him (e.g. votingno returned is not changed)
	// TODO check if the server did not sign an unblinded ballot
	// answ: array of signed: .num .blindSignatur .serverId
	// var answ     = JSON.parse(serverAnsw); // decode answer
	var sigsOkQ = false;
	for (var q=0; q<this.questions.length; q++) {
		var sigsOk;
		for (var i=0; i<answ.questions[q].ballots.length; i++) {
			var curBallot = this.questions[q].ballots[answ.questions[q].ballots[i].ballotno];
			var curTransm = curBallot.transm;
			var questionID = this.questions[q].questionID;
			var qnoAnsw = ArrayIndexOf(answ.questions, 'questionID', questionID);
			if (qnoAnsw < 0) throw new ErrorInServerAnswer(875636, 'A questionID is mussing in the server answer', questionID);
			var curAnswBallot = answ.questions[qnoAnsw].ballots[i];
			if (this.config.serverList[prevServer].name !== curAnswBallot.sigs.slice(-1)[0].sigBy) throw new ErrorInServerAnswer(576793, 'sig is not from the server we sent the data to in order to let the server sign', 'expected: /' + this.config.serverList[prevServer].name + '/ received: /' + curAnswBallot.sigs.slice(-1)[0].sigBy +'/');
			// TODO think about: this only checks the newest sigs
			var blindedSig = str2bigInt(curAnswBallot.sigs.slice(-1)[0].sig, 16);
			var signatur = rsaUnblind(blindedSig, curBallot.blindingf[prevServer], serverKey);  // unblind
			var testsign = RsaEncDec(signatur, serverKey);
			var myhash   = str2bigInt(curTransm.hash, 16);
			var sigOk   = equals(testsign, myhash); // TODO test serSig
			var j;
			if ('sigs' in curTransm) {              j = curTransm.sigs.length;}
			else {	curTransm.sigs = new Array();	j = 0;			          }
			curTransm.sigs[j] = Object();
			curTransm.sigs[j].blindSig = curAnswBallot.sigs.slice(-1)[0].sig;  
			curTransm.sigs[j].sig      = bigInt2str(signatur, 16);
			curTransm.sigs[j].sigBy    = serverKey.serverId;
			curTransm.sigs[j].sigOk    = sigOk;
			curTransm.sigs[j].serSig   = curAnswBallot.sigs.slice(-1)[0].serSig; //TODO unblind
			this.questions[q].ballots[curAnswBallot.ballotno].transm = curTransm; 
			if (i == 0) {sigsOk = sigOk;            }
			else        {sigsOk = (sigsOk && sigOk);}
		}
		if (q==0) {sigsOkQ = sigsOk;             }
		else      {sigsOkQ = (sigsOkQ && sigsOk);}
	}
	return sigsOkQ;
};


/**
 * not used
 * copies properties of vote which will be sent to the tally server
 * @param vote
 * @returns {___voteTransm2}
function makeVoteTransm(vote) {
	var voteTransm = new Object();
	voteTransm.electionId = vote.electionId;
	voteTransm.votingno   = vote.votingno;
	voteTransm.salt       = vote.salt;
	voteTransm.signatures = vote.transm.sigs;
	voteTransm.vote       = vote;
	return voteTransm;
}
 */

/**
 * finds the ballot which obtained the numRequiredSignatures sigs

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
 */

BlindedVoterPermObtainer.prototype.handleServerAnswer = function(dataString) {
	try {
		var data = parseServerAnswer(dataString, true);
		var ret;
		switch (data.cmd) {
		case 'unblindBallots':
			ret = this.unblindBallotsEvent(data);
			break;
		case 'reqSigsNextpServer':
			if (this.xthServer < (this.config.serverList.length -1)) {
				ret = this.reqSigsNextpServerEvent(data);
			} else {
				return Object({'action':'clientError', 'errorText': "I already got enough sigs but server said: 'more sigs needed': \n" + dataString});
			}
			break;
		case 'savePermission':
			// create the string to be saved 
			var ballotFileContent = this.savePermissionEvent(data);
			return Object({'action':'savePermission', 'data': ballotFileContent});
			break;
		case 'error':
			return Object({'action':'serverError', 'errorText': data.errorTxt, 'errorNo': data.errorNo});
		default:
			return Object({'action':'clientError', 'errorText': "unknown server cmd: " + data.cmd});
		break;
		}
		this.addCredentials(ret);
		var send = JSON.stringify(ret);
		return Object({'action':'send', 'data':send});
	} catch (e) {
		if (e instanceof ErrorInServerAnswer)	{
			var m = e.getMessage();
			return Object({'action':'clientError', 'errorText': m});
		}
		if (e instanceof Error) { 
			return Object({'action':'clientError', 'errorText': "an unknown system error occured: " + e.toString()});
		} else
			return Object({'action':'clientError', 'errorText': "an exception occured: " + e.toString()});
	}
};

