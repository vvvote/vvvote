
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
	var ret = this.election.getPermissionHtml();
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

// TODO move this to tools or so
function myXmlSend(url, data, callbackObject, callbackFunction) {
	  var xml2 = new XMLHttpRequest();
	  xml2.open('POST', url, true);
	  xml2.onload = function() { callbackFunction.call(callbackObject, xml2); }; 
	  userlog('--> gesendet an Server ' + (url) + ': ' + data + "\r\n\r\n");
	  xml2.send(data);

}

// TODO move this to tools or so
function parseServerAnswer(xml) {
	if (xml.status != 200) {
		userlog("\n<--- empfangen:\n " + xml.status);
		ErrorInServerAnswer(2000, 'Error: Server did not sent an answer', 'Got HTTP status: ' + xml.status);
	}
	try {
		userlog("\n<--- empfangen:\n" + xml.responseText);
		var data = JSON.parse(xml.responseText);
		return data;
	} catch (e) {
		// defined in exception.js
		ErrorInServerAnswer(2001, 'Error: could not JSON decode the server answer', 'Got from server: ' + xml.responseText);
	}
}


PublishOnlyTelly.prototype.handleServerAnswerVerifyCountVotes = function (xml) {
	try {
		var data = parseServerAnswer(xml);
		if (data.cmd != 'verifyCountVotes') {
			ErrorInServerAnswer(2002, 'Error: Expected >verifyCountVotes<', 'Got from server: ' + data.cmd);
		} 
		// process data
		var htmlcode = '<table>';
		htmlcode = htmlcode + '<td>' + 'Stimme'                  + '</td>'; 
		htmlcode = htmlcode + '<td> <span style="font: 30%">' + 'Stimmnummer' + '</span></td>'; 
		for (var i=0; i<data.data.length ;i++) {
			htmlcode = htmlcode + '<tr>';
			htmlcode = htmlcode + '<td>' + data.data[i].vote.vote                  + '</td>'; 
			htmlcode = htmlcode + '<td> <span style="font: 30%">' + data.data[i].permission.signed.votingno + '</span></td>'; 
			htmlcode = htmlcode + '<td> <button>Verify Signatures</button>' /* + data.data[i].permission.sigs[0].sig   */  + '</td>'; 
//			htmlcode = htmlcode + '<td>' + data.data[i].permission.signed.salt     + '</td>'; 
			htmlcode = htmlcode + '</tr>';
		}
		htmlcode = htmlcode + '</table>';
		this.resultElement.innerHTML = htmlcode;
	} catch (e) {
		if (e instanceof MyException ) {e.alert();}
		else {throw e;}
	}
};


PublishOnlyTelly.prototype.handleUserClick = function () {
	
};

