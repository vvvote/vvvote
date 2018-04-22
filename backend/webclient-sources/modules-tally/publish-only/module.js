
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
	return '<label for="question1Input">' + i18n.gettext('Question to be voted on') + '</label><br><textarea rows="10" cols="50" placeholder="Wer soll Koordinator der AG Wirtschaft werden?" id="question1Input" /></textarea><br>';
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
	inp.setAttribute('id', 'question0Input');
	fragm.appendChild(inp);
	
	// submitt button
	var btn = buttonDOM('buttonSendQ0', i18n.gettext('Cast vote!'), 'page.sendVote(event)', fragm, 'sendVoteButton');
	fragm.appendChild(btn);
	
	// save receipt button
	var saveReceiptButton = buttonDOM('buttonSaveReceiptIdQ0', i18n.gettext('Save voting recceipt'), 'page.saveVotingReceipt(0)', fragm, 'votingReceiptButton');
	saveReceiptButton.setAttribute('disabled', 'disabled');

	return fragm;
	
};


/**
 * returns the vote to be send as a string
 * Overwrite this method in order to implement other voting inputs
 */
PublishOnlyTally.prototype.getInputs = function(qNo) {
	var element = document.getElementById('question0Input');
	var voteStr = element.value;
	return voteStr;
}

/**
 * Is called form vote page when the "cast vote" button is pressed
 * Overwrite getInputs in order to implement other voting inputs
 */
PublishOnlyTally.prototype.sendVote = function (qNo) {
	var voteStr = this.getInputs(qNo);
	this.sendVoteData(voteStr, qNo);
};

PublishOnlyTally.prototype.sendVoteData = function (voteStr, qNo) {
	var transm = {};
	transm = this.election.signVote(voteStr, qNo);
	if (! ('myVotesHandler' in this) ) this.myVotesHandler = [];
	this.myVotesHandler[qNo]=[];
	if (! ('storeVotesPromises' in this) ) this.storeVotesPromises = [];
	this.storeVotesPromises[qNo]=[];
	for (var i = 0; i < ClientConfig.storeVoteUrls.length; i++) {
//	var i = 1;
		this.myVotesHandler[qNo][i] = new PublishOnlyTallySendVoteHandler(this, qNo, i);
		this.storeVotesPromises[qNo][i] = this.myVotesHandler[qNo][i].sendVote(transm);
	}
	// TODO: raise an error only if no tally server accepted the vote
	Promise.all(this.storeVotesPromises[qNo])
	.then(function(ret) {
		alert(i18n.gettext('Tally servers accepted the vote!'));
	}).catch(function(err) {
		if (err instanceof MyException) err.alert();
		else alert(err);
//		alert("Nö: Bei mindestens 1 Stimmserver gab es einen Fehler.");
	});
};

/**
 * Disable and change button text of "send vote Button" to "vote accepted" or "Send your vote after XXX"
 */

PublishOnlyTally.prototype.enDisableSendButton = function(buttonText, qNo, disable) {
	var el = document.getElementById('buttonSendQ'+qNo);
	if (disable) {
		el.setAttribute('disabled', 'disabled');
		el.setAttribute('class', 'sendVoteButtonDone');
	}
	else         {
		el.removeAttribute('disabled');
		el.setAttribute('class', 'sendVoteButton');
	}
	el.childNodes[0].nodeValue = buttonText;
};

PublishOnlyTally.prototype.disableQuestion = function(buttonText, qNo, selected) {
	this.enDisableSendButton(i18n.gettext('Vote accepted'), qNo, true);
	var el = document.getElementById('question' + qNo + 'Input');
	el.setAttribute('disabled', 'disabled');
};

ConfigurableTally.prototype.enableSendVoteButtons = function() {
	this.onPermissionLoaded('');
};

PublishOnlyTally.prototype.onPermissionLoaded = function(returnEnvelopeLStorageId_) {
	if (returnEnvelopeLStorageId_ != '') {
		this.returnEnvelopeLStorageId = returnEnvelopeLStorageId_;
		if ('collapseAllQuestions' in this) this.collapseAllQuestions();
	}
	//var configHash = GetElectionConfig.generateConfigHash(this.config);
	var voteStart = page.getNextVoteTime();
	var buttonStr = i18n.gettext('Error 238u8');
	var disable = false;
	if (voteStart === false) {disable = true;  buttonStr = i18n.gettext('Vote casting is closed'); }
	if (voteStart === true)  {disable = false; buttonStr = i18n.gettext('Cast vote!'); }
	if (voteStart instanceof Date) {
		disable = true;
		buttonStr = i18n.sprintf(i18n.gettext('Vote casting starts at %s'), formatDate(voteStart));
		var me = this;
		executeAt(voteStart, me, me.enableSendVoteButtons);
	}
	
	var tmp = null;
	try {
		if (typeof localStorage !== 'undefined') { // Internet Explorer 11 does not support loacalStorage for files loaded from local disk. As this is not an important feature, just disable it if not supported
			tmp = localStorage.getItem('sentQNo' + this.returnEnvelopeLStorageId);
			if (tmp != null) this.sentQNo = JSON.parse(tmp);
		}
	} catch (e) {console.log('problem accessing local storage ignored: ' + e.toString());} // EDGE causes sometimes a "SCRIPT16389: Unbekannter Fehler." when trying to acces the localstorage. As this is not an important feature, we just ignore it
	for (var qNo=0; qNo<this.config.questions.length; qNo++) {
		if (tmp != null && this.sentQNo.indexOf(qNo) >=0) this.disableQuestion(i18n.gettext('Vote accepted'), qNo, false);
		else                                              this.enDisableSendButton(buttonStr, qNo, disable);
	}
};

PublishOnlyTally.test = function () {alert('mmm');}; 


PublishOnlyTally.prototype.showSaveReceiptButton = function(qNo) {
	var el = document.getElementById('buttonSaveReceiptIdQ'+qNo);
	el.removeAttribute('disabled');
//		el.removeAttribute('display');
};



/**
 * This class sends the vote (encrypts it beforehand) and handles 
 * the answer (verifies the voting server's signature)
 * For each question one PublishOnlyTallySendVoteHandler will be used
 */
PublishOnlyTallySendVoteHandler = function(parent, qNo, tServerNo) {
	this.parent = parent; 
	this.qNo = qNo;
	this.tServerNo = tServerNo;
	};

/**
 * add cmd "storeVote" to the signed vote transm
 * ecncrypt it (transport encryption)
 * 
 */
	PublishOnlyTallySendVoteHandler.prototype.sendVote = function(transm) {
		return new Promise(function(resolve, reject) {
			this.voteOnly = JSON.parse(JSON.stringify(transm)); //clone object
			transm.cmd = 'storeVote';
			var transmstr = JSON.stringify(transm);
			var me = this;
			this.te = new TransportEncryption();
			this.te.encrypt(transmstr, me, me.encryptedCallback, ClientConfig.tkeys[this.tServerNo]);
			this.resolve = resolve;
			this.reject = reject;
		}.bind(this));
	};

PublishOnlyTallySendVoteHandler.prototype.encryptedCallback = function(encrypted) {
	console.log(encrypted);
	this.sentReqDate = new Date();
	var me = this;
	myXmlSend(ClientConfig.storeVoteUrls[me.tServerNo], encrypted, me, me.handleServerAnswerStoreVote, ClientConfig.anonymizerUrl);
};

PublishOnlyTallySendVoteHandler.prototype.handleServerAnswerStoreVote = function (xml) {
	try {
		var data = parseServerAnswer(xml, true);
		if (typeof(data.cmd) === 'string' && data.cmd === 'error') {
			// an encryption error occoured on server side, that is why it sends an unencrypted error message
			throw new ServerReturnedAnError(234543, data.errorNo, i18n.gettext('The server did not accept the vote.'), data.errorTxt); 
//			alert(i18n.sprintf(i18n.gettext('The server did not accept the vote. It says:\n%s'), translateServerError(data.errorNo, data.errorTxt)));
		} else {
			var me = this;
			this.te.decrypt(data, true)
			.then(function (data) {
				switch (data.cmd) {
				case 'saveYourCountedVote': 
					me.handleServerAnswerStoreVoteSuccess(data);
					break;
				case 'error':
					throw new ServerReturnedAnError(234543, data.errorNo, i18n.sprintf(i18n.gettext('The server >%s< did not accept the vote.'), xml.responseURL), i18n.gettext('It says:\n')+ data.errorTxt);
//					alert(i18n.sprintf(i18n.gettext('The server >%s< did not accept the vote. It says:\n%s'), xml.responseURL, translateServerError(data.errorNo, data.errorTxt)));
//					me.reject("abc");
					break;
				default:
					throw new ErrorInServerAnswer(2002, i18n.gettext('Error: Expected >saveYourCountedVote<'), i18n.sprintf(i18n.gettext('Got from server: %s'),data.cmd));
				break;
				}
			}).catch(function(e) {
//				if (e instanceof MyException) e.alert();
//				else alert(i18n.sprintf(i18n.gettext('decryption of server answer failed: %s'), e.toString()));
				me.reject(e);
			});
		};
	} catch (e) {
//		if (e instanceof MyException ) {e.alert();}
//		else {throw e;}
		console.log('handleServerAnswerStoreVote: ' + e);
		throw e;
	}
};

PublishOnlyTallySendVoteHandler.prototype.handleServerAnswerStoreVoteSuccess = function (data) {
	this.verifyTServerSig(data.sig.sig, data.sig.signedData, ClientConfig.tkeys[this.tServerNo])
	.then( function(receivedData) {
		// alert("sig valid!" + JSON.stringify(receivedData));
		
		// verify if the date is correct that the server signed
		if (! ('iat' in receivedData.decodedSignedContent)) throw new ErrorInServerAnswer(548664, 'Missing date of issue (iat) in voting receipt', JSON.stringify(receivedData.decodedSignedContent));
		var issuedAtDate = new Date(receivedData.decodedSignedContent.iat).getTime();
		var now = new Date().getTime(); // TODO: add rounding because issuedAtDate is rounded // TODO first check if is voting phase
		var issuedAtDatePlausible = (this.sentReqDate.getTime() <= (issuedAtDate +1000)) && (now >= issuedAtDate );
		if (!issuedAtDatePlausible) alert(i18n.sprintf(i18n.gettext('Acceptance conformation from the server contains an unplausible date: %s, now: %s'), receivedData.decodedSignedContent.iat, now));
		
		// verify if the vote is unchanged
		var toBeSignedData = JSON.parse(JSON.stringify(this.voteOnly)) // clone the object data;
		toBeSignedData.iat = receivedData.decodedSignedContent.iat
		if (! ('iss' in receivedData.decodedSignedContent)) throw new ErrorInServerAnswer(7564534, 'Missing issuer (iss) in voting receipt', JSON.stringify(receivedData.decodedSignedContent));
		toBeSignedData.iss = ClientConfig.tkeys[this.tServerNo].kid;
		toBeSignedData.cmd = 'storeVote';
		var equals = jsonEquals(receivedData.decodedSignedContent, toBeSignedData);
		if (equals !== true) throw new ErrorInServerAnswer(46596, 'Error: The tally server signed something else than my vote. The differences are: ', JSON.stringify(diff));
//		alert(i18n.gettext('Server accepted the vote!'));
		
		// save the votingReceipt in the PublishOnlyTally
		if (! ('votingReceipt'  in this.parent) )               this.parent.votingReceipt = new Array();
		if (! (this.qNo         in this.parent.votingReceipt) ) this.parent.votingReceipt[this.qNo] = {}; 
		this.parent.votingReceipt[this.qNo][ClientConfig.tkeys[this.tServerNo].kid] = receivedData;
		
		this.parent.showSaveReceiptButton(this.qNo);
		this.parent.disableQuestion(i18n.gettext('Vote accepted'), this.qNo, receivedData.decodedSignedContent.vote.vote);
		// Page.loadMainContent(i18n.gettext('Thank you for voting!'));
		
		// save the sent question number in localStorage
		if (!Array.isArray(this.parent.sentQNo)) this.parent.sentQNo = new Array();
		this.parent.sentQNo.push(this.qNo);
		try { // edge sometimes (ca. 20%) causes a SCRIPT16389 unspecified error (which supposedly means "permission denied") when trying to access local storage from a local file
			if (typeof localStorage !== 'undefined') { // Internet Explorer 11 does not support loacalStorage for files loaded from local disk. As this is not an important feature, just disable it if not supported
				localStorage.setItem('sentQNo'+ this.parent.returnEnvelopeLStorageId, JSON.stringify(this.parent.sentQNo));
			}
		} catch (e) {
			alert ("Info: Problem accessing localStorage:" + e.toString());
			console.log('Info: handleServerAnswerStoreVoteSuccess: problem accessing local storage ignored: ' + e.toString());
		}
		this.resolve();
	}.bind(this))
	.catch (function(err) {
		console.log(err);
		throw new ErrorInServerAnswer(34554, i18n.sprintf(i18n.gettext("Error while verifying tally server /%s/ signature: %s"), ClientConfig.tkeys[this.tServerNo].kid, err),'');
//		alert(i18n.sprintf(i18n.gettext("Error while verifying tally server /%s/ signature: %s"), ClientConfig.tkeys[this.tServerNo].kid, err));
		this.reject();
	}.bind(this));
};

/*
 * sig Signatrure as base64Url
 * DataSigned base64Url encoded signed data
 * serverkey public key as JWK
 * @returns Promise
 */
PublishOnlyTallySendVoteHandler.prototype.verifyTServerSig = function (sig, DataSigned, serverkey) {
	return new Promise (function (resolve, reject) {
		var sigArraBuff        = base64Url2ArrayBuf(sig);
		// DataSignedArraBuff = base64Url2ArrayBuf(DataSigned);
		var DataSignedArraBuff = str2ArrayBuf(DataSigned);

		// sigArraBuff        = base64Url2ArrayBuf('k8L9X6hd4U-o2aTA_g0x4N7i5grlMXt0FviWhjjY-4Ja3Ovvko42q8Kt_7k9RC8Z4RNKEqImReqrrX0YB6PCMhmXUDEzbF0TUIZVLUWoieD6zWKOnvVFbM7JvWjCV_2Roc7LUCrRbQmv_GHPbva3XXkr_Exi7q8CL4yzoba0Msg');	
		// sigArraBuff        = base64Url2ArrayBuf('RoI9o03ENTVeWL_Mi5hcGwLTLcWNGcTlDKkH7KrR16EQ7R7odIXFl_PVwnWkAiH8tr7JqYKXvKR2nViU0m-0AitUYwwPLZeVPz950WjCw3R_oqxc-pb2gz_ahbNwB5daK8hYk9BBLm1SV9GvbBr-OuydK9sjSGtkFe-tR8IYM_E');
		// DataSignedArraBuff = base64Url2ArrayBuf('KuXsZaDByQhXAFvL37JTAH3LHR_bnUx2I5hbLnPm1w8');
		// DataSignedArraBuff = base64Url2ArrayBuf('nAQhQS1zrU02DQgG8W9lnlAWYhPvf5ZsSIxpQCYqKXdcMVpUtoxNtDCZ9JBm0vTJTK78JR_CVZSbLLu5bzFspe4lfuYHi3XAd34Vuj1QdV1OcFU4i5GxJ_AIl9UOdjWAu6g2_Ai7T_tzhBSLXi8R4MAlFlQbNNKsruqjnetBrY8');

		//n: sigArraBuff        = base64Url2ArrayBuf('RoI9o03ENTVeWL_Mi5hcGwLTLcWNGcTlDKkH7KrR16EQ7R7odIXFl_PVwnWkAiH8tr7JqYKXvKR2nViU0m-0AitUYwwPLZeVPz950WjCw3R_oqxc-pb2gz_ahbNwB5daK8hYk9BBLm1SV9GvbBr-OuydK9sjSGtkFe-tR8IYM_E');

//		serverkey.n = 'vkmbXn8GyD-gKT4xRlyOtrWK-SC65Sp7W5v-t6py2xJkES6z_UMdMaKn5QlBVmkpSUoOiR7VYTkYtLUbDR-5d4Oyas99DzhM-zX00oJPXdOAYjomvxgLY5YcYZ3NsgyuQG8i9uJ2yAo3JZSQz-tywacahPGEbTMId7o-MQHsnHs';
//		serverkey.e = 'AQAB';

//		serverkey.d = 'DQ8XNiva0YHbTh_gPo3hoyCJiZFOFL8mlViCa_og-vS2jbpruYmgHwOiHERmXcX2SMtbWblU6xB3qAJjvSLN-4jTkWS3QE9PEQbuAc9gt3aVdI2P2vn9Qolj_nUUQBCxk0yOJqiCOWcs9Js0IqB8TYNLogjVcP5AjnCVyQVH5o0';
//		serverkey.p = '56gMXSEcBqy5AJOUlfJtNl_CtIJbdeNW-JAD6qWTHmvlw_fmpjOtWdtiidBsNUwjXnOaHj89OftA0f-5y0Qojw';
//		serverkey.q = '0kiqJIAA9yAlh0LaZ7cRlAyPduHs1Stnpv_h5JNU1m_4T6YBgEdD9YONou1Gk6WihljWUozBgDv2yNxzxSMLVQ';

		serverkey.alg = 'RS256';
		serverkey.ext = true;
		var me = this;
		window.crypto.subtle.importKey('jwk', serverkey, {name: 'RSASSA-PKCS1-v1_5', hash:{name: 'SHA-256'}}, true, ['verify'])
		.then(function(publickey) {
			me.serverKeyAPI = publickey;
			console.log('serverKeyAPI: ' + me.serverKeyAPI);
			window.crypto.subtle.verify( {name: "RSASSA-PKCS1-v1_5", hash:{name: 'SHA-256'}}, publickey, sigArraBuff, DataSignedArraBuff)
			.then(function(isvalid){
				//returns a boolean on whether the signature is valid or not
				console.log("Tally server signature valid: " + isvalid);
				if (isvalid !== true) throw new ErrorInServerAnser(3463456, i18n.sprintf(i18n.gettext('The signature from server >%s< does not match the signed vote'), serverkey.kid),'');
//				alert("jääär:" + isvalid);
//				var decodedSignedDataStr = base64Url2String(DataSigned);
				
				// decode JWT and generate compatible JWT
				var decodedSignedData = DataSigned.split('.');
				if (! (1 in decodedSignedData)) throw new ErrorInServerAnswer(5345985, i18n.gettext('Error: missing the signed data (no dot in the string)'), DataSigned)
				var decodedSignedContentStr = base64Url2String(decodedSignedData[1]);
				var decodedSignedContent = JSON.parse(decodedSignedContentStr);
				// JSON.parse throws itself if (decodedSignedContent === null) throw new ErrorInServerAnser(3463457, i18n.sprintf(i18n.gettext('Error: The second part of the signature from >%s< cannot be JSON decoded'), serverkey.kid), 'Got: ' + decodedSignedContentStr);
//				
				var jwt = DataSigned + '.' + sig;
				
				// generate RSA Public key in PEM Format to be included in the file that proves the casting of the vote
				window.crypto.subtle.exportKey('spki', me.serverKeyAPI)
				.then(function (spkikey){
					publickeyPEM = spkiToPEM(spkikey);
					resolve({'decodedSignedContent': decodedSignedContent, 'sig': sig, 'sigBy': serverkey.kid, 'JWT': jwt, 'publicKeyPEM': publickeyPEM});
				})
//				if ((isvalid === true) && (decodedSignedContent !== null)) resolve({'decodedSignedContent': decodedSignedContent, 'sig': sig, 'sigBy': serverkey.kid, 'JWT': jwt});
//				else reject(isvalid);
			})
			.catch(function(err){
				console.error(err);
//				alert("oh, no!");
				reject(err);
			});
		});
	});
}


PublishOnlyTally.prototype.saveVotingReceipt = function(qNo) {
	var explanation = i18n.gettext(
'This file can be used in order to proof that a tallying server\r\n\
did receive the vote. The server\'s signature proofs it. The \r\n\
signature is here in the standard JWT format which can be \r\n\
verified by according services, e.g. https://jwt.io/ \r\n\
Just copy the value of "JWT" into the field "Encoded" and the \r\n\
according public key from below in the field "VERIFY SIGNATURE"\r\n\
on the before mentioned website. The JWT contains all the \r\n\
information that is also shown in JSON clear text.');

	// convert public tally server keys into the pem format
	var publickeys = '/**\r\n';
	var convertkeyPromises = [];
	for (var i = 0; i < ClientConfig.tkeys.length; i++) {
		var curkey = ClientConfig.tkeys[i];
		convertkeyPromises[i] = jwk2pemPromise(curkey);
	}
	Promise.all(convertkeyPromises)
	.then(function (pemkeys) {
		for (var i = 0; i < ClientConfig.tkeys.length; i++) {
			var curkey = ClientConfig.tkeys[i];
			publickeys = publickeys + '\r\npublic key for >' + curkey.kid + '<:\r\n'+ pemkeys[i] + '\r\n';
		}
		publickeys = publickeys + '**/\r\n';
		var votingReceiptStr = '/**\r\n' + explanation + '\r\n**/\r\n' + publickeys + JSON.stringify(this.votingReceipt,null,'\t');

		this.votingReceiptBlob = new Blob([votingReceiptStr]);
		var filename = i18n.sprintf(i18n.gettext('Voting receipt %s'), clearForFilename(this.config.electionTitle) + '_' + qNo + '.json');
		var htmlStr = i18n.gettext('In order to be able to proof that you sent your vote, you can save the voting receipt') +
		'<form><p><button id="okbuttonid" type="submit" autofocus="autofocus" onclick="removePopup(); saveAs(page.tally.votingReceiptBlob, \'' + filename +'\'); return false;">Ok</button></p></form>';
		var fragm = html2Fragm(htmlStr);
		showPopup(fragm);
		var el = document.getElementById('okbuttonid');
		el.focus();
	}.bind(this));
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
		var html = i18n.gettext('<p>As long as it is possible to cast votes, it is not possible to get the voting result.</p>');
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

/*
PublishOnlyTally.prototype.findMyVote = function() {
	
	var myVoteIndex = ArrayIndexOf(this.votes, 'permission.signed.votingno', myvotingno);
};
*/

PublishOnlyTally.prototype.handleServerAnswerVerifyCountVotes = function (xml) {
	try {
		var answ = parseServerAnswer(xml, true);
		switch (answ.cmd) {
		case 'error':
			alert(i18n.sprintf(i18n.gettext('The server does not reveal the result. It answers:\n %s'), translateServerError(answ.errorNo, answ.errorTxt)));
			break;
		case 'verifyCountVotes': 
			this.processVerifyCountVotes(answ);
			break;
		default:
			throw new ErrorInServerAnswer(2003, i18n.gettext('Error: Expected >verifyCountVotes<'), i18n.sprintf(i18n.gettext('Got from server: %s'), answ.cmd));
			break;
		}
	} catch (e) {
		if (e instanceof MyException ) {e.alert();}
		else if (e instanceof TypeError   ) {
			var f = new ErrorInServerAnswer(2004, i18n.gettext('Error: unexpected var type'), i18n.sprintf(i18n.gettext('details: %s'), e.toString()));
			f.alert();
		} else {
			var f = new ErrorInServerAnswer(2005, i18n.gettext('Error: some error occured'), i18n.sprintf(i18n.gettext('details: %s'), e.toString()));
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
//	htmlcode = htmlcode + '<button onclick="page.tally.findMyVote();">' + i18n.gettext('Find my vote') + '</button>';
	htmlcode = htmlcode + '<div id="allvotes"><table>';
	/* in the list of votes */
	htmlcode = htmlcode + '<thead><th><span id="allvotesHead">' + i18n.pgettext('List_of_Votes','Vote') + '</th>'; 
	htmlcode = htmlcode + '<th>' + i18n.gettext('Voting number') + '</span></th></thead>';
	htmlcode = htmlcode + '<tbody>';
	var myVno = false; // my voting number
	if ('returnEnvelope' in window) {
		myVno = this.election.getVotingNo(this.config.questions[0].questionID); //tmp2.votingno; // must be identical to returnEnvelope.permission.keypar.pub.n + ' ' + returnEnvelope.permission.keypar.pub.exp;
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
			vnoAttrib = 'class="votingno myVote" id="myVote' + 0 /* optionIndex in configurableTally */ + '"';
			vnoText = vno + i18n.gettext(' - my vote');
		}
		htmlcode = htmlcode + '<td> <div ' + vnoAttrib + '>' + vnoText + '</div></td>'; 
		// TODO substitude election for this.varname
		htmlcode = htmlcode + '<td> <button ' + disabled + ' onclick="page.tally.handleUserClickVerifySig(' + i +');" >' + i18n.gettext('Verify signatures!') + '</button>' + '</td>'; 
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
	htmlcode2 = htmlcode2 + '<th class="numVotes">' + i18n.gettext('Number of Votes') + '</th>';
	htmlcode2 = htmlcode2 + '</thead><tfoot>';
	htmlcode2 = htmlcode2 + '<tr><td>' + i18n.gettext('Total') + '</td>';
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
