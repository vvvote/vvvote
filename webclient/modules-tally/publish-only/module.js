
/**
 * errorno starts at 2000
 * constructor and public-preveleged (can access private methods) methods which are instantiated each time
 * @param election Election
 */
var PublishOnlyTally = function (election, config) { // TODO store config also
	this.election = election;
	this.config = config;
};

/**
 * public functions
 */
PublishOnlyTally.prototype.getMainContentFragm = function() {
//	var element = document.getElementById('PublishOnlyTallyHtml'); // this is in index.html in order to have a substitute for heredoc
//	ret = element.innerHTML
	var ret = ''; // this.election.getPermissionHtml();
	ret = ret + '\n<p>\n'; // TODO present options from config
	ret = ret + 'Ihre Stimme: <input type="text" name="vote" id="vote" value="">';
	ret = ret + '\n</p>\n';
	
	var fragm = document.createDocumentFragment();
	var inp = document.createElement('input');
	inp.setAttribute('type', 'submit');
	inp.setAttribute('value', 'abstimmen!');
	inp.setAttribute('id', 'sendvote');
	inp.setAttribute('disabled', 'disabled');
	inp.setAttribute('onclick', 'page.sendVote(event);');
	fragm.appendChild(inp);
	
	return fragm;
	
};

PublishOnlyTally.prototype.sendVote = function () {
	var element = document.getElementById('vote');
	var vote = element.value;
	this.sendVoteData(vote);
};

PublishOnlyTally.prototype.sendVoteData = function (vote, questionID_) {
	var transm = {};
	transm = this.election.signVote(vote, questionID_);
	transm.cmd = 'storeVote';
	var transmstr = JSON.stringify(transm);
	var me = this;
	myXmlSend(ClientConfig.storeVoteUrl, transmstr, me, me.handleServerAnswerStoreVote, ClientConfig.anonymizerUrl);
};


PublishOnlyTally.prototype.handleServerAnswerStoreVote = function (xml) {
	try {
		var data = parseServerAnswer(xml, true);
		// TODO check voting server sig
		switch (data.cmd) {
		case 'saveYourCountedVote':
			Page.loadMainContent('Vielen Dank f&uuml;r Ihre Stimme!');
			alert('Stimme wurde vom Server akzeptiert!');
			break;
		case 'error':
			alert('Der Server hat die Stimme nicht akzeptiert. Er meldet:\n' + translateServerError(data.errorNo, data.errorTxt));
			break;
		default:
			throw new ErrorInServerAnswer(2002, 'Error: Expected >saveYourCountedVote<', 'Got from server: ' + data.cmd);
		break;
		}
	} catch (e) {
		if (e instanceof MyException ) {e.alert();}
		else {throw e;}
	}
};


PublishOnlyTally.prototype.handleUserClickGetAllVotes = function (config_, onGotVotesObj, onGotVotesMethod) {
	this.config = config_;
	this.onGotVotesObj    = onGotVotesObj;
	this.onGotVotesMethod = onGotVotesMethod;
	var me = this; 
	var data = {};
	data.cmd = 'getAllVotes';
	data.electionId = JSON.stringify({'mainElectionId': this.config.electionId, 'subElectionId': 1});
	var datastr = JSON.stringify(data);
	// TODO add auth to data
	myXmlSend(ClientConfig.getResultUrl, datastr, me, me.handleServerAnswerVerifyCountVotes);
};

PublishOnlyTally.prototype.findMyVote = function() {
	
	var myVoteIndex = ArrayIndexOf(this.votes, 'permission.signed.votingno', myvotingno);
};

PublishOnlyTally.prototype.handleServerAnswerVerifyCountVotes = function (xml) {
	var votesOnly = new Array();
	try {
		var data = parseServerAnswer(xml, true);
		if (data.cmd != 'verifyCountVotes') {
			throw new ErrorInServerAnswer(2003, 'Error: Expected >verifyCountVotes<', 'Got from server: ' + data.cmd);
		}
		this.votes = data.data.allVotes;
		// process data
		//   show a list of all votes
		var htmlcode = '<button onclick="page.tally.handleUserClickGetPermissedBallots();">Liste der Wahlscheine holen</button>';
		htmlcode = htmlcode + '<button onclick="page.tally.findMyVote();">Finde meine Stimme</button>';
		htmlcode = htmlcode + '<div id="allvotes"><table>';
		htmlcode = htmlcode + '<thead><th><span id="allvotesHead">' + 'Stimme'                  + '</th>'; 
		htmlcode = htmlcode + '<th>' + 'Stimmnummer' + '</span></th></thead>';
		htmlcode = htmlcode + '<tbody>';
		var v;   // vote
		var vno; // vote number
		var disabled;
		for (var i=0; i<this.votes.length; i++) {
			htmlcode = htmlcode + '<tr>';
			try {v   = this.votes[i].vote.vote;    disabled = '';} catch (e) {v   = 'Error'; disabled = 'disabled';}
			try {vno = this.votes[i].permission.signed.votingno; } catch (e) {vno = 'Error'; disabled = 'disabled';}
			htmlcode = htmlcode + '<td> <span id="vote">' + v + '</span></td>'; 
			htmlcode = htmlcode + '<td> <span id="votingno">' + vno + '</span></td>'; 
			// TODO substitude election for this.varname
			htmlcode = htmlcode + '<td> <button ' + disabled + ' onclick="page.tally.handleUserClickVerifySig(' + i +');" >Unterschriften pr&uuml;fen!</button>' + '</td>'; 
//			htmlcode = htmlcode + '<td>' + this.votes[i].permission.signed.salt     + '</td>'; 
			htmlcode = htmlcode + '</tr>';
			// TODO add to votes only if sigOk
			votesOnly[i] = v;
		}
		htmlcode = htmlcode + '</tbody></table></div>';
		
		// show the frequencies
		var freqs = getFrequencies(votesOnly);
		freqs.sort(function(a, b) {return b.freq - a.freq;});
		var numVotes = votesOnly.length;
		var htmlcode2 = '<div id="freq"><table>';
		htmlcode2 = htmlcode2 + '<thead>';
		htmlcode2 = htmlcode2 + '<th class="optionHead"  >' + 'Option'         + '</th>'; 
		htmlcode2 = htmlcode2 + '<th class="numVotes">' + 'Anzahl Stimmen' + '</th>';
		htmlcode2 = htmlcode2 + '</thead><tfoot>';
		htmlcode2 = htmlcode2 + '<tr><td>Gesamt</td>';
		htmlcode2 = htmlcode2 + '<td class="numVotes">' + numVotes+ '</td>';
		htmlcode2 = htmlcode2 + '</tfoot><tbody>';
		for (var i=0; i<freqs.length; i++) {
			htmlcode2 = htmlcode2 + '<tr>';
			htmlcode2 = htmlcode2 + '<td class="option"  >' + freqs[i].option + '</td>'; 
			htmlcode2 = htmlcode2 + '<td class="numVotes">' + freqs[i].freq   + '</td>'; 
			htmlcode2 = htmlcode2 + '</tr>';
		}
		htmlcode2 = htmlcode2 + '</tbody>';
		htmlcode2 = htmlcode2 + '</table></div>';
		var ret = htmlcode2 + '<br> <br>\n\n' + htmlcode;
		this.onGotVotesMethod.call(this.onGotVotesObj, ret);
	} catch (e) {
		if (e instanceof MyException ) {e.alert();}
		else if (e instanceof TypeError   ) {
			f = new ErrorInServerAnswer(2004, 'Error: unexpected var type', 'details: ' + e.toString());
			f.alert();
		} else {
			f = new ErrorInServerAnswer(2005, 'Error: some error occured', 'details: ' + e.toString());
			f.alert();
		} // TODO show the error
	}
};

PublishOnlyTally.prototype.handleUserClickVerifySig = function (no) {
	this.election.verifyVoteSigs(this.votes[no]);
};
PublishOnlyTally.prototype.handleUserClickGetPermissedBallots = function () {
	this.election.getAllPermissedBallots();
};
