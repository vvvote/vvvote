
/**
 * errorno starts at 2000
 * constructor and public-preveleged (can access private methods) methods which are instantiated each time
 * @param election Election
 */
var PublishOnlyTally = function (election, config) { // TODO store config also
	this.election = election;
	this.config = config;
};

/***********************************
 * 
 * New Election Phase
 * 
 **********************************/

PublishOnlyTally.GetEnterQuestionsHtml = function() {
	return '<label for="question1Input">Frage, über die abgestimmt werden soll</label><br><textarea rows="10" cols="50" placeholder="Wer soll Koordinator der AG Wirtschaft werden?" id="question1Input" /></textarea><br>';
};



/**
 * called from the NewElectionPage in order to get the NewElection config to be sent to the server 
 */
PublishOnlyTally.getNewElectionData = function() {
	var el = document.getElementById('question1Input');
	ret =  
	{		"tally": "publishOnly",
			"questions": [{
				"questionID": 1,
				"questionWording": el.value
			}]
	};
	return ret;
};





/**************************************
 * 
 * Voting Phase
 * 
 **************************************/


PublishOnlyTally.prototype.getMainContentFragm = function(fragm, config) {
	//var fragm = document.createDocumentFragment();
	
	
	// print question
	var label = document.createElement('label');
	var txtnode = document.createTextNode(this.config.questions[0].questionWording);
	label.appendChild(txtnode);
	label.setAttribute('for', 'voteInput');
	fragm.appendChild(label);
	
	// vote input field
	var inp = document.createElement('input');
	inp.setAttribute('type', 'text');
	inp.setAttribute('id', 'voteInput');
	fragm.appendChild(inp);
	
	// submitt button
	var btn = document.createElement('input');
	btn.setAttribute('type', 'submit');
	btn.setAttribute('value', 'abstimmen!');
	btn.setAttribute('id', 'sendvote');
	//btn.setAttribute('disabled', 'disabled');
	btn.setAttribute('onclick', 'page.sendVote(event);');
	fragm.appendChild(btn);
	
	return fragm;
	
};

PublishOnlyTally.prototype.onPermissionLoaded = function() {
	
};

PublishOnlyTally.prototype.sendVote = function () {
	var element = document.getElementById('voteInput');
	var vote = element.value;
	this.sendVoteData(vote, 1);
};

PublishOnlyTally.prototype.sendVoteData = function (vote, questionID_) {
	var transm = {};
	transm = this.election.signVote(vote, questionID_);
	transm.cmd = 'storeVote';
	var transmstr = JSON.stringify(transm);
	var me = this;
	this.te = new TransportEncryption();
	this.te.encrypt(transmstr, me, me.encryptedCallback, ClientConfig.tkeys[0]);
//	myXmlSend(ClientConfig.storeVoteUrl, transmstr, me, me.handleServerAnswerStoreVote, ClientConfig.anonymizerUrl);
};

PublishOnlyTally.prototype.encryptedCallback = function(encrypted) {
	console.log(encrypted);
	var me = this;
	myXmlSend(ClientConfig.storeVoteUrl, encrypted, me, me.handleServerAnswerStoreVote, ClientConfig.anonymizerUrl);
};

PublishOnlyTally.test = function () {alert('mmm');}; 


PublishOnlyTally.prototype.handleServerAnswerStoreVote = function (xml) {
	try {
		var data = parseServerAnswer(xml, true);
		if (typeof(data.cmd) === 'string' && data.cmd === 'error') {
			// an encryption error occoured on server side, that is why it sends an unencrypted error message
			alert('Der Server hat die Stimme nicht akzeptiert. Er meldet:\n' + translateServerError(data.errorNo, data.errorTxt));
		} else {
			var me = this;
			this.te.decrypt(data, true).then(function (data) {
				// TODO check voting server sig
				switch (data.cmd) {
				case 'saveYourCountedVote': me.handleServerAnswerStoreVoteSuccess(data);
				break;
				case 'error':
					alert('Der Server hat die Stimme nicht akzeptiert. Er meldet:\n' + translateServerError(data.errorNo, data.errorTxt));
					break;
				default:
					throw new ErrorInServerAnswer(2002, 'Error: Expected >saveYourCountedVote<', 'Got from server: ' + data.cmd);
				break;
				}
			}).catch(function(e) {
				alert('decryption of server answer failed: ' + e);
			});
		};
	} catch (e) {
		if (e instanceof MyException ) {e.alert();}
		else {throw e;}
	}
};

PublishOnlyTally.prototype.handleServerAnswerStoreVoteSuccess = function (data) {
	Page.loadMainContent('Vielen Dank f&uuml;r Ihre Stimme!');
	alert('Stimme wurde vom Server akzeptiert!');
};


/********************************************
 * 
 * Get Result Phase
 * 
 * ******************************************/



PublishOnlyTally.prototype.handleUserClickGetAllVotes = function (config_, onGotVotesObj, onGotVotesMethod) {
	this.config = config_;
	this.onGotVotesObj    = onGotVotesObj;
	this.onGotVotesMethod = onGotVotesMethod;
	var now = new Date();  // TODO this code is dublicated in ConfigurableTally.prototype.handleUserClickShowWinner
	var endDate = false;
	if ('VotingEnd' in this.config.authConfig)	endDate = new Date (this.config.authConfig.VotingEnd);
	if ( (endDate !== false) && (now < endDate) ) {
		var html = '<p>Solange Stimmen abgegeben werden können, kann das Wahlergebnis nicht abgerufen werden.</p>';
		onGotVotesMethod.call(onGotVotesObj, html);
		return;
	}
	var me = this; 
	PublishOnlyTally.requestAllVotes(this.config.electionId, 1, me, me.handleServerAnswerVerifyCountVotes);
};

PublishOnlyTally.requestAllVotes = function(mainElectionId, subElectionId, callbackObj, callbackMethod) {
	var req = {};
	req.cmd = 'getAllVotes';
	req.electionId = unicodeToBlackslashU(JSON.stringify({'mainElectionId':  mainElectionId, 'subElectionId': subElectionId}));
	var datastr = JSON.stringify(req);
	// TODO add auth to data
	myXmlSend(ClientConfig.getResultUrl, datastr, callbackObj, callbackMethod);
};

PublishOnlyTally.prototype.findMyVote = function() {
	
	var myVoteIndex = ArrayIndexOf(this.votes, 'permission.signed.votingno', myvotingno);
};

PublishOnlyTally.prototype.handleServerAnswerVerifyCountVotes = function (xml) {
	try {
		var answ = parseServerAnswer(xml, true);
		switch (answ.cmd) {
		case 'error':
			alert('Der Server gibt das Abstimmungsergebnis nicht bekannt. Er meldet:\n' + translateServerError(answ.errorNo, answ.errorTxt));
			break;
		case 'verifyCountVotes': 
			this.processVerifyCountVotes(answ);
			break;
		default:
			throw new ErrorInServerAnswer(2003, 'Error: Expected >verifyCountVotes<', 'Got from server: ' + answ.cmd);
			break;
		}
	} catch (e) {
		if (e instanceof MyException ) {e.alert();}
		else if (e instanceof TypeError   ) {
			var f = new ErrorInServerAnswer(2004, 'Error: unexpected var type', 'details: ' + e.toString());
			f.alert();
		} else {
			var f = new ErrorInServerAnswer(2005, 'Error: some error occured', 'details: ' + e.toString());
			f.alert();
		}
	}
};

PublishOnlyTally.prototype.processVerifyCountVotes = function (answ) {
	var votesOnly = new Array();
	this.votes = answ.data.allVotes;
	// process data
	//   show a list of all votes
	var htmlcode = ''; //<button onclick="page.tally.handleUserClickGetPermissedBallots();">Liste der Wahlscheine holen</button>';
	htmlcode = htmlcode + '<button onclick="page.tally.findMyVote();">Finde meine Stimme</button>';
	htmlcode = htmlcode + '<div id="allvotes"><table>';
	htmlcode = htmlcode + '<thead><th><span id="allvotesHead">' + 'Stimme'                  + '</th>'; 
	htmlcode = htmlcode + '<th>' + 'Stimmnummer' + '</span></th></thead>';
	htmlcode = htmlcode + '<tbody>';
	var myVno = false; // my voting number
	if ('returnEnvelope' in window) {
		myVno = this.election.getVotingNo(curQuestion.questionID); //tmp2.votingno; // must be identical to returnEnvelope.permission.keypar.pub.n + ' ' + returnEnvelope.permission.keypar.pub.exp;
	}
	var v;   // vote
	var vno; // vote number
	var disabled;
	for (var i=0; i<this.votes.length; i++) {
		htmlcode = htmlcode + '<tr>';
		try {v   = this.votes[i].vote.vote;    disabled = '';} catch (e) {v   = 'Error'; disabled = 'disabled';}
		try {vno = this.votes[i].permission.signed.votingno; } catch (e) {vno = 'Error'; disabled = 'disabled';}
		htmlcode = htmlcode + '<td class="vote">' + v + '</td>';
		var vnoAttrib = 'class="votingno"';
		var vnoText = vno;
		if (vno === myVno) {
			vnoAttrib = 'class="votingno myVote" id="myVote' + optionIndex + '"';
			vnoText = vno + ' - meine Stimme';
		}
		htmlcode = htmlcode + '<td> <div ' + vnoAttrib + '>' + vnoText + '</div></td>'; 
		// TODO substitude election for this.varname
		htmlcode = htmlcode + '<td> <button ' + disabled + ' onclick="page.tally.handleUserClickVerifySig(' + i +');" >Unterschriften pr&uuml;fen!</button>' + '</td>'; 
//		htmlcode = htmlcode + '<td>' + this.votes[i].permission.signed.salt     + '</td>'; 
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
};

PublishOnlyTally.prototype.handleUserClickVerifySig = function (no) {
	this.election.verifyVoteSigs(this.votes[no]);
};
PublishOnlyTally.prototype.handleUserClickGetPermissedBallots = function () {
	this.election.getAllPermissedBallots();
};
