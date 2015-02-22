/* not used anymore
function savePermission(ballot) {
	// TODO check maximal loops = numServers
	// download webclient
	savePermission.ballot = ballot;
	httpGet(ClientConfig.voteClientUrl, savePermission, savePermission.gotWebclient, false);
}
*/

/**
 * @param varname the name of the global var that holds the instance of this object. It is used for HTML code to call back.
 */
var BlindedVoterElection = function (config_) { // TODO save and load config in permission file
	this.permission = {};
	this.permissionOk = false;
	this.config = config_; // TODO check if permission file electionId matches the electionId given in config
};

BlindedVoterElection.prototype.XXhandleXmlAnswer = function(xml) {
	var result = this.permObtainer.handleServerAnswer(xml);
	this.switchAction(result);
	// TODO check maximal loops = numServers
};

/**
 * this is called after the server answer is processed
 * @param result
 */
BlindedVoterElection.prototype.switchAction = function (result) {
	switch (result.action) {
	case 'send':
		var url = this.permObtainer.getCurServer().url;
		var me = this;
		myXmlSend(url, result.data, me, me.XXhandleXmlAnswer);
		break;
	case 'savePermission':
		this.injectPermissionIntoClientSave(result.data);
		page.onPermGenerated();
		break;
	case 'serverError':
		var servername = this.permObtainer.getCurServer().name;
		var errortext = translateServerError(result.errorNo, result.errorText);
		alert(servername + ' hat Ihr Anliegen zurückgewiesen (Fehlernr. '+ result.errorNo + "):\n" + errortext);
		switch (result.errorNo) {
		case 1: /* authorization failed */
			page.onAuthFailed(this.permObtainer.getCurServer());
			break;
		default:
			break;
		}

		break;
	case 'clientError':
		alert('Client found error:\n '+ result.errorText);
		break;
		// tally
		/*	case 'sendVote':
		  var xml2 = new XMLHttpRequest();
		  // serverno = election.pServerSeq.slice(-1)[0]; // TODO use different config for tally servers
		  xml2.open('POST', 'http://www.webhod.ra/vvvote2/backend/tallyvote.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813', true);
		  xml2.onload = function() { handleXmlAnswer(xml2); }; // quasi resursiv
		  var element = document.getElementById('logtextarea'); 
		  element.value = element.value + '--> gesendet an ' + ('Zählserver') + ' (' + 'TODO URL' + ') Server: ' + result.data + "\r\n\r\n";
		  xml2.send(result.data);
		  break; */
	default:
		alert('handleXmlAnswer(): Internal program error, got unknown action: ' + result.action);
	}
};


/*
 * public members
 */

BlindedVoterElection.prototype.gotWebclient = function(xml) {
	if (xml.status != 200) {
		httpError(xml);
	} else { 
		this.clientHtml = xml.responseText; // save the web client
		this.obtainPermission(); // obtain the voter card (permission)
	}
};

/**
 * Injects the ballot permission into the web client and opens the save dialog of the web broweser
 * @param ballot JSON encoded ballot
 */
BlindedVoterElection.prototype.injectPermissionIntoClientSave = function(ballot) {
	var find = /\/\/bghjur56zhbvbnhjiu7ztgfdrtzhvcftzujhgfgtgvkjskdhvfgdjfgcfkdekf9r7gdefggdfklhnpßjntt/;
	var returnEnvelope = {
			'permission': ballot, 
			'config': this.config};
	var ballotWithClient = this.clientHtml.replace(find, 'returnEnvelope = ' + JSON.stringify(returnEnvelope) +';');
	// load the electionId to be used as filename
	var p2 = JSON.parse(ballot[0].transm.str);
	var electionid = JSON.parse(p2.electionId).mainElectionId;

	var bb = new Blob([ballotWithClient]); //  new Blob([ballot]); 
	saveAs(bb, "Wahlschein " + clearForFilename(electionid) + '.html');
};


BlindedVoterElection.prototype.obtainPermission_ = function()  {
/*	var authmodule = this.authModule;
	var retry = this.retry;
	if (!retry) {
		this.election = new Object();
		this.election.mainElectionId = this.config['electionId'];
		this.election.numBallots = 5; // TODO move this to config
		this.election.pServerList = ClientConfig.serverList;
		this.election.pServerSeq = ClientConfig.serverList.slice(); // copies the content of the array
		// TODO let it shuffle again: this.election.pServerSeq = shuffleArray(this.election.pServerSeq);
		this.election.xthServer = 0;
	}
	
	
	}

	var ret;
	ret = { "questions":  [], 
			"cmd":       "pickBallots",
			"xthServer": this.election.xthServer
			};
	
	for (var q=0; q<this.config.questions.length; q++) {
		var req;

		this.election.electionId =  JSON.stringify({"electionId": this.config.mainElectionId, "subElectionId": this.config.questions[q].questionID});
		if (retry) req = makePermissionReqsResume(this.election);
		else       req = makeFirstPermissionReqs (this.election);
		req.questionID =  this.config.questions[q].questionID;
		ret.questions[q] = {
				"questionID": this.config.questions[q].questionID,
				"ballots": req.ballots};
		this.election.questions.ballots = req.ballots; 
		}
	this.election.electionId = this.election.mainElectionId; 
	var credentials = [];
	for ( var i = 0; i < this.election.pServerList.length; i++) {
		credentials[i] = authmodule.getCredentials(this.config['electionId'], this.election.pServerList[i].name); 
	addCredentials(this.election, ret);
	*/
	
	// get server specific credentials
	if (!this.retry) {
		this.permObtainer = new BlindedVoterPermObtainer(this.config['electionId'], this.config['questions'], {'obj': this.authModule, 'method': this.authModule.getCredentials}, ClientConfig.BlindedVoter);
		this.permObtainer.makeBallots();
		// TODO: save ballots as local file in order to have a backup in case something goes wrong
	}
	var send = this.permObtainer.makePermissionReqs();
	this.permObtainer.addCredentials(send);
	return send;
};


BlindedVoterElection.prototype.obtainPermission = function()  {
	var send = this.obtainPermission_();
	var url = this.permObtainer.getCurServer().url;
	var me = this;
	myXmlSend(url, JSON.stringify(send), me, me.XXhandleXmlAnswer);
	return false;
};


BlindedVoterElection.prototype.onGetPermClick = function(authmodule_, retry_)  {
	this.authModule = authmodule_;
	this.retry = retry_; // set to true if authentification failed
	// download webclient
	var me = this;
	httpGet(ClientConfig.voteClientUrl, me, me.gotWebclient, false);
};



/**
 * provide HTML code to be presented in step 2 (voting)
 *  
 */
BlindedVoterElection.getStep2Html = function() {
	var ret = 'Als Ergebnis dieses Schrittes erhalten Sie einen Wahlschein, den Sie ' + 
	'speichern und zur Stimmabgabe sp&auml;ter wieder laden m&uuml;ssen. ' +
	'Der Wahlschein berechtigt zur Stimmabgabe - geben Sie ihn also nicht ' + 
	'weiter! Er ist anonym, d.h. es kann ohne Ihre Mithilfe nicht festgestellt werden, wem er geh&ouml;rt.'; 
	return ret;

};

BlindedVoterElection.getStep2HtmlDetails = function() {
	var ret = '<p><h2>Weitere technische Information</h2>' +
	'Der Wahlschein ist digital von mindestens 2 Servern unterschrieben. Diese Unterschrift führt dazu, dass der Wahlzettel bei der Stimmabgabe akzeptiert wird.<br> ' +
	'Der Wahlschein enth&auml;lt eine eindeutige Wahlscheinnummer, die nur Ihr Computer kennt - sie wurde von Ihrem Computer erzeugt und verschl&uuml;sselt, bevor die Server den Wahlschein unterschrieben haben, und danach auf Ihrem Computer entschl&uml;sselt (Man spricht von &quot;Blinded Signature&quot;). Die Server kennen daher die Wahlscheinnummer nicht.<br> ' +
	'Man kann sich das so vorstellen:<br>  ' +
	'Ihr Computer schreibt auf den Wahlschein die Wahlscheinnummer, die er sich selbst &quot;ausdenkt&quot; (Zufallszahl). Dieser Wahlschein wird zusammen mit einem Blatt Kohlepapier in einen Umschlag gelegt und an den Server geschickt. ' + 
	'Der Server unterschreibt außen auf dem Umschlag (wenn Sie wahlberechtigt sind), so dass sich die Unterschrift durch das Kohlepapier auf Ihren Wahlschein &uuml;berträgt. Ohne den Umschlag ge&ouml;ffnet zu haben (was der Server nicht kann, weil er den daf&uuml;r notwendigen Schl&uuml;ssel nicht kennt), schickt er den Brief an Ihren Computer zur&uuml;ck. ' +
	'Ihr Computer &ouml;ffnet den Umschlag (d.h. entschl&uuml;sselt die Wahlscheinnummer) und h&auml;lt einen vom Server unterschriebenen Wahlschein in der Hand, deren Nummer der Server nicht kennt.   ' +
	'</p>';
	return ret;
};



/**
 * provide HTML code to be presented in step 3 (voting)
 *  
 */
BlindedVoterElection.loadReturnEnvelopeHtml = function() {
	return 'Bitte laden Sie die Datei, in der Ihr Wahlschein gespeichert ist:<br>'+
	'<input type="file" id="loadfile" accept=".html" onchange="BlindedVoterElection.onClickedLoadFile(event)"/>'; //+ varname +'.loadPermFile(event);"/>';
};

/**
 * provide HTML code to be presented after successful voting permission generated
 */
BlindedVoterElection.prototype.getPermGeneratedHtml = function() {
	return '<h2>Wahlschein erfolgreich erstellt. </h2>' +
	'<p>Der Wahlschein berechtigt zur Stimmabgabe - geben Sie ihn also nicht ' + 
	'weiter! Er ist anonym, d.h. es kann ohne Ihre Mithilfe nicht festgestellt werden, wem er geh&ouml;rt.</p>' +
	'<p>Zum Abstimmen &ouml;ffnen Sie den Wahlschein im Internet-Browser. ' +
	'Eine M&ouml;glichkeit dazu ist: Klicken Sie im Datei-Explorer doppelt auf die Wahlschein-Datei.</p>';
};

BlindedVoterElection.onClickedLoadFile = function(event) {
	var bv = new BlindedVoterElection('');
	bv.loadPermFile(event);
};
BlindedVoterElection.onImportPermission = function (returnEnvelope) {
	var bv = new BlindedVoterElection('');
	bv.importPermission(returnEnvelope);
};

/**
 * called on: click on load permission file
 * @param evt
 */
BlindedVoterElection.prototype.loadPermFile = function (evt) {
	var files = evt.target.files; // FileList object
	// files[0];
	var filereader = new FileReader();
	var me = this;
	filereader.onload = function(event) {me.permFileLoaded(event);};
	filereader.readAsText(files[0]);
};

/**
 * called on: permission file is loaded into RAM
 * @param ev
 */
BlindedVoterElection.prototype.permFileLoaded = function (ev) {
	var returnEnvelopeHtml = ev.target.result; 
	// alert(permissionstr);
	var returnEnvelopeStr = returnEnvelopeHtml.match(/^returnEnvelope =(.+);$/m);
	if (returnEnvelopeStr == null || returnEnvelopeStr.length == 0) {alert("Error: Return envelope data not found"); return;};
	var returnEnvelope = JSON.parse(returnEnvelopeStr[1]); 
	if (returnEnvelope == null ) {alert("Error: Return envelope data could not be read: JSON decode failed");return;};
	this.importPermission(returnEnvelope);
};

BlindedVoterElection.prototype.importPermission = function (returnEnvelope) {
	this.config = returnEnvelope.config;
	this.permission = returnEnvelope.permission; // TODO think about several permissions in permission array
	var mainElectionIdMismatch = false;
	for (var q=0; q<this.permission.length; q++) {
		this.permission[q].transm.signed = JSON.parse(this.permission[q].transm.str);
		var splittedElectionID = JSON.parse(this.permission[q].transm.signed.electionId);
		this.permission[q].questionID = splittedElectionID.subElectionId;
		if (splittedElectionID.mainElectionId !== this.config.electionId) {mainElectionIdMismatch = true;}
	}
	if (mainElectionIdMismatch) alert('The return envelope is not consistant'); // TODO throw?
	// TODO check if all requiered fields are present
	// TODO check signatures from permissionservers
	// TODO check for date if voting already/still possible
	//this.config = {};
	//this.config.electionId = this.permission.transm.signed.electionId;
	var me = this;
	this.permissionOk = !mainElectionIdMismatch;
	page.onPermLoaded(this.permissionOk, me, this.config); // call back --> enables vote button or loads ballot

};

/* not used at the moment
BlindedVoterElection.prototype.checkPerm = function() {
	if (!this.permissionOk) return false;
	var trans = {};
	trans.votingno   = this.permission.votingno;
	trans.salt       = this.permission.salt;
	trans.electionId = this.permission.electionId;
	trans.sigs       = this.permission.sigs;
	return trans;
};
*/


BlindedVoterElection.prototype.signVote = function (vote, questionID_) {
	var q = ArrayIndexOf(this.permission, 'questionID', questionID_);
	var votestr = vote;
	var privatekeyarray = this.permission[q].keypair.priv;
	var hash = SHA256(vote);
	var hashBi = str2bigInt(hash, 16);
	var privatekey = arrayStr2key(privatekeyarray);
	var sigBI = RsaEncDec(hashBi, privatekey);
	var sig = bigInt2str(sigBI, 16);

	// var publickey = str2key(this.permission.transm.signed.votingno);
	/*	scheiß library ist fehlerhaft: Die PSS-Signatur ist nur manchmal korrekt.
	 * var rsa = new RSAKey();
	var coeffs = getHelpingNumbers(str2bigInt(privatekey.p, 16), str2bigInt(privatekey.q, 16), str2bigInt(privatekey.exp, 16), str2bigInt(privatekey.n, 16));
	rsa.setPrivateEx(privatekey.n, 
			bigInt2str(publickey.exp, 16), 
			privatekey.exp, 
			privatekey.p, 
			privatekey.q,  
			bigInt2str(coeffs.d_P, 16), 
			bigInt2str(coeffs.d_Q, 16), 
			bigInt2str(coeffs.q_inv, 16)); //  RSASetPrivateEx(N,E,D,P,Q,DP,DQ,C)
	var sig = rsa.signStringPSS(votestr, 'sha256', 0); // TODO sLen? salt length (-1 or -2) 
	Test:
	var verified = rsa.verifyPSS(votestr, sig, 'sha256', 0);
	if (verified) alert('unterschrift korrekt');
	 */

	var signedvote = {};
	signedvote.vote = votestr;
	signedvote.sig  = sig;
	var transm = {};
	transm.permission = this.permission[q].transm;
	transm.vote = signedvote;
	return transm;
};



BlindedVoterElection.prototype.verifyVoteSigs = function (vote) {
	// TODO verify that there is no doubled voting no
	var pubkeystr = vote.permission.signed.votingno;
	var pubkey = str2key(pubkeystr);
	// var rsa = new RSAKey();
	// rsa.setPublic(bigInt2str(pubkey.n, 16), bigInt2str(pubkey.exp, 16));
	var voteitself = vote.vote.vote;
	var sig = vote.vote.sig;
	try {
		// var sigOk = rsa.verifyStringPSS(voteitself, sig, 'sha256', -2);
		var sigOk = rsaVerifySig(voteitself, sig, pubkey);
		if (sigOk) {
			alert('Die Unterschrift unter der Stimme ist korrekt, d.h. die Stimme wurde nicht verändert.');
		} else {
			alert('Die Unterschrift unter der Stimme ist nicht korrekt, d.h. die Stimme wurde verändert oder der Schlüssel passt nicht.');
		}
	} catch (e) {
		alert("Fehler beim überprüfen der Signatur:\n" + e);
	}

	var transm = addBallothash(vote.permission.signed);
	var sig, serverinfo, pubkey, sigOk, slist;
	slist = ClientConfig.serverList;
	if (vote.permission.sigs.length != slist.length) {
		alert("Die Anzahl der Unterschriften unter dem Wahlschein ist nicht korrekt. Erforderliche Anzahl: " + slist.length + ', Anzahl Unterschriften bei diesem Wahlschein: ' + vote.permission.sigs.length);
	}
	for (var i=0; i <vote.permission.sigs.length; i++) {
		try {
			sig = vote.permission.sigs[i];
			serverinfo = ClientConfig.getServerInfoByName(sig.sigBy);
			pubkey = serverinfo.key;
			// var sigOk = rsa.verifyStringPSS(voteitself, sig, 'sha256', -2);
			sigOk = rsaVerifySig(transm.str, sig.sig, pubkey);
			if (sigOk) {
				alert('Die Unterschrift von Wahlberechtigungsserver >' + sig.sigBy + '< für den Abstimmungsschlüssel ist korrekt');
			} else {
				alert('Die Unterschrift von Wahlberechtigungsserver >' + sig.sigBy + '< für den Abstimmungsschlüssel ist nicht korrekt');
			}
		} catch (e) {
			alert("Fehler beim überprüfen der Signatur:\n" + e.toString());
		}
	}

};

BlindedVoterElection.prototype.getAllPermissedBallots = function () {
	var cmd = Object();
	cmd.cmd = 'getAllPermissedBallots';
	cmd.electionId = this.config.electionId;
	var req = JSON.stringify(cmd);
	this.allPermissions = new Array();
	var pServerList = ClientConfig.serverList;
	for (var i=0; i<pServerList.length; i++) {
		var url = pServerList[i].url;
		me = this;
		myXmlSend(url, req, me, me.XhandleXmlAnswerGetAllPermissedBallots);
	}
};

BlindedVoterElection.prototype.XhandleXmlAnswerGetAllPermissedBallots = function (xml, url) {
	var answ = parseServerAnswer(xml, true); 
	var pServerList = ClientConfig.serverList;

	var i = ArrayIndexOf(pServerList, 'url', url);
	var sname = pServerList[i].name; 
	this.allPermissions = answ;

	this.allPermissions; // .voterId .sigs[wievielter Unterzeichner][angabe von Servername]
	var curr;
	// find voterID, if not presend -> add
	for (i=0; i<answ.length; i++) {
		curr = answ[i]; // signedBallots[].sigs[].sigBy
		var permission;
		var v = ArrayIndexOf(this.allPermissions, 'voterId', curr['voterId']);
		if (v < 1) {
			permission = new Object();
			permission.voderId = curr['voterId'];
			permission.sigs = new Array();
			this.allPermissions.push(permission);
		} else {
			permission = this.allPermissions[v];
		}
		permission.sigs[sname] = curr['sigsBy']; // this is an array containing the list of permission server names ind the sequence they signed the permission
		// verify if all servers say the same sequence of sigs 
		if (permission.sigs.length > 1) {
			var c = permission.sigs[0]; // TODO find the server which provides the most sigs
			for (var s in permission.sigs) {
				for (var j=0; j<min(c.length, permission.sigs[s].length); j++) {
					if (permission.sigs[s][0] != c[0]) {
						alert('Bei Wähler >' + curr['voterId'] + '< gibt Server >' + s + '< eine anderen Reihenfolge der Unterschriften an als Server >' + x + '<.');}
				}
			}
		}
	}

	return this.allPermissions;
};


