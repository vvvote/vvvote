/**
 * 
 * @param electionId
 * @returns {___ballot0}
 */
function makeBallotRaw(electionId) {
	var ballot;
	ballot.electionId = electionId;
	ballot.votingno   = randBigInt(bits, 0);
	ballot.salt       = randBigInt(bits, 0);
	return ballot;
}


function addBallotChecksum(voteSheet) {
	votingSheet.str        = JSON.stringify(votingSheet);
	votingSheet.checksum   = SHA256(votingSheetStr);
}


function makeBlindSigReq(electionID, numVotingSheets, serverKeys) {
	var ballots;
	for (var i=0; i<numVotingSheets; i++) {
		var ballot;
		ballot.raw    = makeBallotRaw(electionId);
		ballot.transm = addBallotChecksum(voteSheet.raw);
		for (var j=0; j<serverkeys.length; i++) {
			ballot.blindingf = RsablindingFactorsGen(bitSize(serverKeys[i].n) - 1, serverKeys[i].n);
			ballot.blinded   = rsaBlind(ballot.transm.checksum, ballot.blindingf, serverKeys[i]);
		}
		ballots[i] = ballot;
	}
	return ballots;	
}

function makeUnblindedreqestedBallots(reqestedBallots, allBallots){
	var answer;
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


/**
 * 
 * @param vote
 * @returns {___voteTransm2}
 */
function makeVoteTransm(vote) {
	var voteTransm;
	voteTransm.electionId = vote.electionId;
	voteTransm.votingno   = vote.votingno;
	voteTransm.salt       = vote.salt;
	voteTransm.signatures = vote.transm.sign;
	voteTransm.vote       = vote;
	return voteTransm;
}
