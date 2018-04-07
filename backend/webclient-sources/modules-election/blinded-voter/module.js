
/**
 * @param varname the name of the global var that holds the instance of this object. It is used for HTML code to call back.
 */
var BlindedVoterElection = function (config_) {
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
		removePopup();
		this.injectPermissionIntoClientSave(result.data);
		page.onPermGenerated();
		break;
	case 'serverError':
		removePopup();
		var servername = this.permObtainer.getCurServer().name;
		var errortext = translateServerError(result.errorNo, result.errorText);
		alert(i18n.sprintf(i18n.gettext('%s has rejected your request (error no  %d):\n %s'), servername, result.errorNo, errortext));
		switch (result.errorNo) {
		case 1: /* authorization failed */
			page.onAuthFailed(this.permObtainer.getCurServer());
			break;
		default:
			break;
		}

		break;
	case 'clientError':
		removePopup();
		alert(i18n.sprintf(i18n.gettext('Client found error:\n %s'), result.errorText));
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
		removePopup();
		alert(i18n.sprintf(i18n.gettext('handleXmlAnswer(): Internal program error, got unknown action: %s'), result.action));
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

BlindedVoterElection.prototype.saveReturnEnvelopeAgain = function() {
	var me = this;
	httpPostDownload(ClientConfig.voteClientUrl, me, me.gotWebclientPermAlreadyObteined, false);
};

BlindedVoterElection.prototype.gotWebclientPermAlreadyObteined = function(xml) {
	if (xml.status != 200) {
		httpError(xml);
	} else { 
		this.clientHtml = xml.responseText; // save the web client
		this.injectPermissionIntoClientSave(this.permission); // obtain the voter card (permission)
	}
};


/**
 * Injects the ballot permission into the web client and opens the save dialog of the web broweser
 * @param ballot JSON encoded ballot
 */
BlindedVoterElection.prototype.injectPermissionIntoClientSave = function(ballot) {
	var find = /\/\/bghjur56zhbvbnhjiu7ztgfdrtzhvcftzujhgfgtgvkjskdhvfgdjfgcfkdekf9r7gdefggdfklhnpjntt/;
	var lStorage = {'id': bigInt2str(randBigInt(128, 0), 16)};
	this.returnEnvelopeCreationDate = new Date();
	var returnEnvelope = {
			'permission': ballot, 
			'config': this.config,
			'lStorage': lStorage,
			'creationDate': this.returnEnvelopeCreationDate.toString()};
	var ballotWithClient = this.clientHtml.replace(find, 'returnEnvelope = ' + JSON.stringify(returnEnvelope) +';');
	// load the electionId to be used as filename
		// var p2 = JSON.parse(ballot[0].transm.str);
		//var electionid = JSON.parse(p2.electionId).mainElectionId;

	this.returnEnvelopeBlob = new Blob([ballotWithClient]); //  new Blob([ballot]);
	this.saveReturnEnvelope();
};

BlindedVoterElection.prototype.saveReturnEnvelope = function() {
	var filename = i18n.sprintf(i18n.gettext('Voting certificate %s'), clearForFilename(this.config.electionTitle) + '.html');
	var htmlStr = i18n.gettext('In order to be able to cast your vote, you have to save your voting certificate on your device now') +
	'<form><p><button id="okbuttonid" type="submit" autofocus="autofocus" onclick="removePopup(); saveAs(page.blinder.returnEnvelopeBlob, \'' + filename +'\'); return false;">Ok</button></p></form>';
	var fragm = html2Fragm(htmlStr);
	showPopup(fragm);
	var el = document.getElementById('okbuttonid');
	el.focus();
};

BlindedVoterElection.prototype.onUserDidSaveReturnEnvelope = function()  {
	var el = document.getElementById('howToVoteId');
	el.removeAttribute('style', 'display:block');
	var el = document.getElementById('didSaveButtonsId');
	el.setAttribute('style', 'display:none');
};

BlindedVoterElection.prototype.obtainPermission_ = function()  {
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
	var aniHtml = getWorkingAnimationHtml(); 
	showPopup(html2Fragm('<h1>' + i18n.gettext('Creating voting certificate') + '</h1>' + aniHtml));
	this.authModule = authmodule_;
	this.retry = retry_; // set to true if authentification failed
	// download webclient
	var me = this;
	httpPostDownload(ClientConfig.voteClientUrl, me, me.gotWebclient, false);
};



/**
 * provide HTML code to be presented in step 2 (voting)
 *  
 */
BlindedVoterElection.getStep2Html = function() {
	var ret = i18n.gettext(
		'<ul>' +
			'<li>You will get voting certificae in the form of a webpage file as result of this step.</li>' +
			'<li>Please remember where you saved it.</li>' + 
			'<li>The voting certificate is neccesary in order to cast the vote. There is no way getting a replacement for it. Thus, save it securely till the end of the voting.</li>' + 
    	'</ul>');
	return ret;

};

BlindedVoterElection.getStep2HtmlDetails = function() {
	var ret = i18n.gettext(
	'<p><h2>Technical information</h2>' +
	'The voting certificate is digitally signed by at least two servers. This signatures makes the certificate valid for voting. <br> ' +
	"The voting certificate contains an unique certificate number which is only known by your device - it was generated by your device and encrypted before it was sent and signed by the servers. Your device decrypts thes certificate number together with the server's signatures (This procedure is called &quot;Blinded Signature&quot;). Thus, the servers do not know the certificate number. <br> " +
	'You can imagine it as follows:<br>  ' +
	'Your device generates a long random number (a unique number) and writes it on a sheet of paper. Your device lays a sheet of carbon-paper on this sheet, puts them together in an envelope, seals it and sends it to the servers. ' + 
	'The servers sign on the outside of the envelope, in case you are entitled to vote. By doing so, the signature is transferred to the sheet containing the certificate number because of the carbon-paper. The servers do not open the envelope (which they cannot do, because they do not know the needed key), and send the envelope back to your device. ' +
	'Your device opens (decrypts) the envelope. In result, your device has a sheet of paper containing a unique certificate number and the signatures of the servers, but the servers do not know this number.' +
	"The unique number together with the server's signatures and the ballot is called >voting certificate<." + 
	'</p>');
	return ret;
};

BlindedVoterElection.getStep3HtmlDetails = function() {
	return BlindedVoterElection.getStep2HtmlDetails();
};



/**
 * provide HTML code to be presented in step 3 (voting)
 *  
 */

BlindedVoterElection.loadReturnEnvelopeHtml = function() {
	return i18n.gettext('Please load the voter certification file') +
	// '<input type="file" id="loadfile" accept=".html" name="file" onchange="BlindedVoterElection.onClickedLoadFile(event)"/>'; //+ varname +'.loadPermFile(event);"/>';
	'<div class="file_upload">' +
	'<input id="uploadFile" class="fileName" disabled="disabled" />' +
	'<div class="fileUpload fileBtn">' +
	    '<span>'+i18n.gettext('Search')+'</span>' +
	    '<input id="loadfile" type="file" class="upload" accept=".html" name="file" onchange="BlindedVoterElection.onClickedLoadFile(event)"/>' +
	'</div>' +
	'</div>';
};


/**
 * provide HTML code to be presented after successful voting permission generated
 */
BlindedVoterElection.prototype.getPermGeneratedHtml = function() {
	var votingTimeStr = page.getVoteTimeStr();
	return i18n.sprintf(i18n.gettext( 
	'<h2>Voting certificate generated.</h2>' +
	'<p id="didSaveButtonsId">Did you save the voting certificate on your devide?<br>' + 
	'<button id="savedReturnEnvelope" onclick="page.blinder.onUserDidSaveReturnEnvelope();" >Yes</button>' +
	'&emsp;<button id="didNotSaveReturnEnvelope" onclick="page.blinder.saveReturnEnvelope();" >No</button>' +
	'</p><p><ul id="howToVoteId" style="display:none">' +
	'<li>You got a voting certificate in the form of a webpage file which you saved on your device.</li>' +
	'<li>Please remember the place where you saved it.</li>' + 
	'<li>The voting certificate is needed in order to cast the vote. There is no way obaining a new one. Thus, save it securly till the end of the voting.</li>' +
	'<li>In order to cast a vote, open the voting certificate in a web browser. ' +
	'You can do this by double clicking it in the file explorer.</li>' +
	'<li>Everyone who has the voting certificate can use it to cast the vote - thus do not pass it on</li>' + 
	'<li>Casting the vote using the voting certificate is anonymous. That means, as long as you do not help, nobody can find out who sent the vote.</li>' +
	'<li>%s</li>' +
	'</ul></p>'), votingTimeStr);
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
	if (returnEnvelopeStr == null || returnEnvelopeStr.length == 0) {alert(i18n.gettext("Error: voting certificate data not found")); return;};
	var returnEnvelope = JSON.parse(returnEnvelopeStr[1]); 
	if (returnEnvelope == null ) {alert(i18n.gettext("Error: voting certificate data could not be read: JSON decode failed"));return;};
	this.importPermission(returnEnvelope);
};

BlindedVoterElection.prototype.importPermission = function (returnEnvelope) {
	this.config = returnEnvelope.config;
	this.permission = returnEnvelope.permission;
	this.returnEnvelopeLStorageId = returnEnvelope.lStorage.id;
	this.returnEnvelopeCreationDate = new Date(returnEnvelope.creationDate);
	var mainElectionIdMismatch = false;
	for (var q=0; q<this.permission.length; q++) {
		this.permission[q].transm.signed = JSON.parse(this.permission[q].transm.str);
		var splittedElectionID = JSON.parse(this.permission[q].transm.signed.electionId);
		this.permission[q].questionID = splittedElectionID.subElectionId;
		if (splittedElectionID.mainElectionId !== this.config.electionId) {mainElectionIdMismatch = true;}
	}
	if (mainElectionIdMismatch) alert(i18n.gettext('The voter certificate is not consistent')); // TODO throw?
	this.permissionOk = !mainElectionIdMismatch;
	// TODO check if all requiered fields are present
	// check signatures from permissionservers on election keys
	var me = this;
	var configChecker = new GetElectionConfig(null, null, me, me.onPermissionsServerSigsOk);
	configChecker.verifyPermissionServerSigs(this.config);
};

BlindedVoterElection.prototype.onPermissionsServerSigsOk = function() {
	var me = this;
	this.permissionOk = true;
	page.onPermLoaded(this.permissionOk, me, this.config, this.returnEnvelopeLStorageId); // call back --> enables vote button or loads ballot
	// TODO check signatures from permissionservers on my voting keys
	// TODO check for date if voting already/still possible
};


BlindedVoterElection.prototype.getVotingNo = function(questionID_) {
	if ( !('permission' in this)) return false;
	var qNo = ArrayIndexOf(this.permission, 'questionID', questionID_);
	if (qNo < 0) return false; // TODO alert the user?
	var tmp = this.permission[qNo].transm.str;
	var tmp2 = JSON.parse(tmp);
	var votingno = tmp2.votingno;
	return votingno;
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
	
	// copy only the anonymous and relevant parts of the permission
	var sigs = Array();
	for (var i=0; i<this.permission[q].transm.sigs.length; i++) {
		sigs.push({'sig': 	this.permission[q].transm.sigs[i].sig, 'sigBy': this.permission[q].transm.sigs[i].sigBy});
	}

	transm.permission = {
		"sigs": sigs,
		"signed": this.permission[q].transm.signed
	};
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
			alert(i18n.gettext('The signature on the vote is correct. This means that the vote is unchanged.'));
		} else {
			alert(i18n.gettext('The signature on the vote is not correct. This means that the vote is changed or the key does not match.'));
		}
	} catch (e) {
		alert("Error verifying the signature:\n" + e);
	}

	var transm = BlindedVoterPermObtainer.addBallothash(vote.permission.signed);
	var sig, serverinfo, pubkey, sigOk, slist;
	slist = ClientConfig.serverList;
	if (vote.permission.sigs.length != slist.length) {
		alert(i18n.sprintf(i18n.gettext("Error verifying a signature:\nThe number of signatures on the voting certificate is not correct. \nRequired number: %d, number in this voting certificate: %d"), slist.length, vote.permission.sigs.length));
	}
	var completElectionIdStr = vote.permission.signed.electionId;
	var completElectionId = JSON.parse(completElectionIdStr);
	if (completElectionId.mainElectionId !== this.config.electionId) alert (i18n.gettext('The vote is not for this election (Election IDs do not match).'));
	else {
		var qid = completElectionId.subElectionId;
		var qno = ArrayIndexOf(this.config.questions, 'questionID', qid);
		if (qno < 0) alert (i18n.gettext('The vote is not for this election (Question ID not found in election configuration).'));
		else {
			for (var i=0; i <vote.permission.sigs.length; i++) {
				try {
					sig = vote.permission.sigs[i];
					// serverinfo = ClientConfig.getServerInfoByName(sig.sigBy);
					pubkey = jwk2BigInt(this.config.questions[qno].blinderData.permissionServerKeys[sig.sigBy].key);
					// pubkey = serverinfo.key;
					// var sigOk = rsa.verifyStringPSS(voteitself, sig, 'sha256', -2);
					sigOk = rsaVerifySig(transm.str, sig.sig, pubkey);
					if (sigOk) {
						alert(i18n.sprintf(i18n.gettext('The signature by the permission server >%s< for the voting key is correct. This means, the server has confirmed that the according voter is entitled to vote.'), sig.sigBy));
					} else {
						alert(i18n.sprintf(i18n.gettext('The signature by permission server >%s< for the voting key is not correct. Either the configuration is wrong or there is a fraud. Please inform the persons responsible for the voting'), sig.sigBy)); 
					}
				} catch (e) {
					alert(i18n.sprintf(i18n.gettext("Error verifying the signature:\n%s"), e.toString()));
				}
			}
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
						alert(i18n.sprintf(i18n.gettext('For voter >%s< the server >%s< returns a different order of signatures than server >%s<.'), curr['voterId'], s, x));
					}
				}
			}
		}
	}

	return this.allPermissions;
};


