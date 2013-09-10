
/**
 * errorno starts at 2000
 * constructor and public-preveleged (can access private methods) methods which are instantiated each time
 * @param election Election
 */
var PublishOnlyTelly = function (election, config, showResultElement) { // TODO store config also
	this.election = election;
	this.config = config;
	this.resultElement = showResultElement;
};

/**
 * public functions
 */
PublishOnlyTelly.prototype.getMainContent = function() {
//	var element = document.getElementById('PublishOnlyTellyHtml'); // this is in index.html in order to have a substitute for heredoc
//	ret = element.innerHTML
	var ret = ''; // this.election.getPermissionHtml();
	ret = ret + '\n<p>\n'; // TODO present options from config
	ret = ret + 'Ihre Stimme: <input type="text" name="vote" id="vote" value="Alternative A">';
	ret = ret + '\n</p>\n';
	return ret;
	
};

PublishOnlyTelly.prototype.sendVote = function () {
	var element = document.getElementById('vote');
	var vote = element.value;
	var transm = {};
	transm = this.election.signVote(vote);
	transm.cmd = 'storeVote';
	
	var transmstr = JSON.stringify(transm);
	var me = this;
	var url = 'http://www.webhod.ra/vvvote2/backend/tallyvote.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';
	myXmlSend(url, transmstr, me, me.handleServerAnswerStoreVote);
};


PublishOnlyTelly.prototype.handleServerAnswerStoreVote = function (xml) {
	try {
		var data = parseServerAnswer(xml);
		switch (data.cmd) {
		case 'saveYourCountedVote':
			alert('Stimme wurde vom Server akzeptiert!');
			break;
		case 'error':
			alert('Der Server hat die  Stimme nicht akzeptiert.\ Er meldet:\n' + data.errorNo + ': ' + data.errorTxt);
			break;
		default:
			throw new ErrorInServerAnswer(2002, 'Error: Expected >saveYourCountedVote<', 'Got from server: ' + data.cmd);
		break;
		}
		// TODO check voting server sig
	} catch (e) {
		if (e instanceof MyException ) {e.alert();}
		else {throw e;}
	}
};


PublishOnlyTelly.prototype.handleUserClickGetAllVotes = function () {
	var me = this; 
	var url = 'http://www.webhod.ra/vvvote2/backend/tallyvote.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';
	var data = {};
	data.cmd = 'getAllVotes';
	data.electionId = this.config.electionId;
	var datastr = JSON.stringify(data);
	// TODO add auth to data
	myXmlSend(url, datastr, me, me.handleServerAnswerVerifyCountVotes);
};

PublishOnlyTelly.prototype.handleServerAnswerVerifyCountVotes = function (xml) {
	var votesOnly = new Array();
	try {
		var data = parseServerAnswer(xml);
		if (data.cmd != 'verifyCountVotes') {
			throw new ErrorInServerAnswer(2003, 'Error: Expected >verifyCountVotes<', 'Got from server: ' + data.cmd);
		} 
		this.votes = data.data;
		// process data
		var me = this;
		var htmlcode = '<div id="allvotes"><table>';
		htmlcode = htmlcode + '<thead><th><span id="allvotesHead">' + 'Stimme'                  + '</th>'; 
		htmlcode = htmlcode + '<th>' + 'Stimmnummer' + '</span></th></thead>';
		htmlcode = htmlcode + '<tbody>';
		for (var i=0; i<data.data.length; i++) {
			htmlcode = htmlcode + '<tr>';
			htmlcode = htmlcode + '<td> <span id="vote">' + data.data[i].vote.vote                  + '</span></td>'; 
			htmlcode = htmlcode + '<td> <span id="votingno">' + data.data[i].permission.signed.votingno + '</span></td>'; 
			// TODO substitude election for this.varname
			htmlcode = htmlcode + '<td> <button onclick="telly.handleUserClickVerifySig(' + i +');" >Verify Signatures</button>' + '</td>'; 
//			htmlcode = htmlcode + '<td>' + data.data[i].permission.signed.salt     + '</td>'; 
			htmlcode = htmlcode + '</tr>';
			// TODO add to votes only if sigOk
			votesOnly[i] = data.data[i].vote.vote;
		}
		htmlcode = htmlcode + '</tbody></table></div>';
	} catch (e) {
		if (e instanceof MyException ) {e.alert();}
		else {throw e;}
	}
	
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

	this.resultElement.innerHTML = htmlcode2 + '<br> <br>\n\n' + htmlcode;
};

PublishOnlyTelly.prototype.handleUserClickVerifySig = function (no) {
	this.election.verifyVoteSigs(this.votes[no]);
};