
function savePermission(ballot) {
	var bb = new Blob([ballot]);
	saveAs(bb, "signed_ballot.txt");
	// TODO check maximal loops = numServers
}


// TODO use handleXmlAnswer from tools/mixed 
function XXhandleXmlAnswer(xml) {
	var result = handleServerAnswer(election, xml);
	switchAction(result);
	// TODO check maximal loops = numServers
};

function switchAction(result) {
	switch (result.action) {
	case 'send':
	  serverno = election.pServerSeq.slice(-1)[0];
	  var me = this;
	  myXmlSend(election.pServerList[serverno].url, result.data, me, XXhandleXmlAnswer);
/*	  var xml2 = new XMLHttpRequest();
	  xml2.open('POST', election.pServerList[serverno].url, true);
	  xml2.onload = function() { XXhandleXmlAnswer(xml2); }; // quasi resursiv
	  document.permission.log.value = document.permission.log.value + '--> gesendet an ' + (election.xthServer +1) + ' (' + election.pServerList[serverno].url + ') Server: ' + result.data + "\r\n\r\n";
	  xml2.send(result.data); */
	  break;
	case 'savePermission':
		alert('Speichern Sie den Wahlschein!\n Zum Abstimmen klicken Sie auf "An Abstimmung teilnehmen" und wählen Sie unter der Überschrift "Ich habe bereits einen Wahlschein" den gespeicherten Wahlschein aus.'); //+ Wahlzettelinhalt: \n result.data);
		savePermission(result.data);
		// saveAs(result.data, 'ballots.json');
	    break;
	case 'serverError':
		alert('Server ' + (election.xthServer +1) + /*' (' + election.pServerList[serverno].url + */ ' rejected the request \n Error number: '+ result.errorNo + "\n" + result.errorText);
		break;
	case 'clientError':
		alert('Client found error:\n '+ result.errorText);
	    break;
	// telly
/*	case 'sendVote':
		  var xml2 = new XMLHttpRequest();
		  // serverno = election.pServerSeq.slice(-1)[0]; // TODO use different config for telly servers
		  xml2.open('POST', 'http://www.webhod.ra/vvvote2/backend/tallyvote.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813', true);
		  xml2.onload = function() { handleXmlAnswer(xml2); }; // quasi resursiv
		  var element = document.getElementById('logtextarea'); 
		  element.value = element.value + '--> gesendet an ' + ('Zählserver') + ' (' + 'TODO URL' + ') Server: ' + result.data + "\r\n\r\n";
		  xml2.send(result.data);
		  break; */
	default:
		alert('handleXmlAnswer(): Internal program error, got unknown action: ' + result.action);
	}
}

function onGetPermClick()  {
		election = new Object();
		var e = document.getElementById('voterId');
		election.voterId    = e.value;
		e = document.getElementById('secret');
		election.secret     = e.value;
		e = document.getElementById('electionId');
		election.electionId = e.value;
		election.numBallots = 5;
     	//  alert('voterID: '    + voterID +
	    //        '\r\nelectionID: ' + electionID);
	    election.pServerList = getPermissionServerList();
	    
	    req = makeFirstPermissionReqs(election);
	    // save req as local file in order to have a backup in case something goes wrong

	    //	purl = new Array();
 	//	purl[0] = 'getpermission.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';
	//	purl[1] = 'http://www2.webhod.ra/vvvote2/getpermission.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';
		
		var url = election.pServerList[election.pServerSeq.slice(-1)[0]].url;
		me = this;
		myXmlSend(url, req, me, XXhandleXmlAnswer);
/*	    var xml = new XMLHttpRequest();
		//var serverno = getNextPermServer(election);
		xml.open('POST', url, true);
		xml.onload = function() { handleXmlAnswer(xml);};
//		 xml.onreadystatechange = function() {
//		   if (xml.readyState != 4)  { return; }
//		   var serverResponse = JSON.parse(xml.responseText);
//		 };
    	document.permission.log.value = document.permission.log.value + '\r\n\r\n --> gesendet an 1. Server (' + url + '): ' + req + "\r\n\r\n";  
        xml.send(req); */
		return false;
}
/**
 * @param varname the name of the global var that holds the instance of this object. It is used for HTML code to call back.
 */
var BlindedVoterElection = function (varname, onpermloaded, config) { // TODO save and load config in permission file
	this.varname = varname; // the name of the global var that holds the instance of this object. It is used for HTML code to call back. 
	this.callOnPermLoaded = onpermloaded;
	this.permission = {};
	this.permissionOk = false;
	this.config = config; // TODO check if permission file electionId machtes the electionId given in config
};

/*
 * public members
 */

/**
 * provide HTML code to be presented in step 2 (voting)
 *  
 */
BlindedVoterElection.getStep2Html = function() {
	var ret = 'Als Ergebnis dieses Schrittes erhalten Sie einen Wahlzettel, den Sie ' + 
	'speichern und zur Stimmabgabe später wieder laden müssen. ' +
	'Der Stimmzettel berechtigt zur Stimmabgabe - geben Sie ihn also nicht ' + 
	'weiter! Er ist anonym, d.h. es kann nicht festgestellt werden, wem er gehört.'; 
	return ret;
		
};

BlindedVoterElection.getStep2HtmlDetails = function() {
	var ret = '<p><h2>Weitere technische Information</h2>' +
	'Der Wahlzettel ist digital von mindestens 2 Servern unterschrieben. Diese Unterschrift führt dazu, dass der Wahlzettel bei der Stimmabgabe akzeptiert wird.<br> ' +
	'Der Wahlzettel enthält eine eindeutige Wahlzettelnummer, die nur Ihr Computer kennt - sie wurde von Ihrem Computer erzeugt und verschlüsselt, bevor die Server den Wahlzettel unterschrieben haben, und danach auf Ihrem Computer entschlüsselt (Man spricht von &quot;Blinded Signature&quot;). Die Server kennen daher die Wahlzettelnummer nicht.<br> ' +
	'Man kann sich das so vorstellen:<br>  ' +
	'Ihr Computer schreibt auf den Wahlzettel die Wahlzettelnummer, die er sich selbst &quot;ausdenkt&quot; (Zufallszahl). Dieser Wahlzettel wird zusammen mit einem Blatt Kohlepapier in einen Umschlag gelegt und an den Server geschickt. ' + 
	'Der Server unterschreibt außen auf dem Umschlag (wenn Sie wahlberechtigt sind), so dass sich die Unterschrift durch das Kohlepapier auf Ihren Wahlzettel überträgt. Ohne den Umschlag geöffnet zu haben (was der Server nicht kann, weil er den dafür notwendigen Schlüssel nicht kennt), schickt er den Brief an Ihren Computer zurück. ' +
	'Ihr Computer öffnet den Umschlag (d.h. entschlüsselt die Wahlzettelnummer) und hält einen vom Server unterschriebenen Wahlzettel in der Hand, deren Nummer der Server nicht kennt.   ' +
	'</p>';
 	return ret;
};



/**
 * provide HTML code to be presented in step 3 (voting)
 *  
 */
BlindedVoterElection.getPermissionHtml = function() {
	return 'Bitte laden Sie die Datei, in der Ihr Wahlschein gespeichert ist:<br>'+
	'<input type="file" id="loadfile" accept="text/plain" onchange="BlindedVoterElection.onClickedLoadFile(event)"/>'; //+ varname +'.loadPermFile(event);"/>';
};

BlindedVoterElection.onClickedLoadFile = function(event) {
	el = new BlindedVoterElection('', '', '');
	el.loadPermFile(event);
};

/**
 * called on: click on load permission file
 * @param evt
 */
BlindedVoterElection.prototype.loadPermFile = function (evt) {
    var files = evt.target.files; // FileList object
    files[0];
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
	var permissionstr = ev.target.result; 
	// alert(permissionstr);
	this.permission = JSON.parse(permissionstr)[0];
	this.permission.transm.signed = JSON.parse(this.permission.transm.str);
	// TODO give an error if JSON parsing failed
	// TODO check if permission corresponds to the election config
	// TODO check if all requiered fields are present
	// TODO check signatures from permissionservers
	// TODO check for date if voting already/still possible
	this.config = {};
	this.config.electionId = this.permission.transm.signed.electionId;
	var me = this;
	this.permissionOk = true;
	page.onPermLoaded(this.permissionOk, me); // call back --> enables vote button or loades ballot
	};

BlindedVoterElection.prototype.checkPerm = function() {
	if (!this.permissionOk) return false;
	var trans = {};
	trans.votingno   = this.permission.votingno;
	trans.salt       = this.permission.salt;
	trans.electionId = this.permission.electionId;
	trans.sigs       = this.permission.sigs;
	return trans;
};

BlindedVoterElection.prototype.signVote = function (vote) {
	var votestr = vote;
	var privatekeyarray = this.permission.keypair.priv;
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
	
	signedvote = {};
	signedvote.vote = votestr;
	signedvote.sig  = sig;
	var transm = {};
	transm.permission = this.permission.transm;
	transm.vote = signedvote;
	return transm;
};


BlindedVoterElection.getServerInfoByName = function (servername) {
	var slist = getPermissionServerList();
	for (var s=0; s<slist.length; s++) {
		if (slist[s].name = servername) return slist[s]; 
	}
};

BlindedVoterElection.prototype.verifyVoteSigs = function (vote) {
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
			alert('Die Unterschrift unter der Stimme ist korrekt');
		} else {
			alert('Die Unterschrift unter der Stimme ist nicht korrekt');
		}
	} catch (e) {
		alert("Fehler beim überprüfen der Signatur:\n" + e);
	}

	var transm = addBallothash(vote.permission.signed);
	var sig, serverinfo, pubkey, sigOk, slist;
	slist = getPermissionServerList();
	if (vote.permission.sigs.length != slist.length) {
		alert("Die Anzahl der Unterschriften unter dem Wahlschein ist nicht korrekt. Erforderliche Anzahl: " + slist.length + ', Anzahl Unterschriften bei diesem Wahlschein: ' + vote.permission.sigs.length);
	}
	for (var i=0; i <vote.permission.sigs.length; i++) {
		try {
			sig = vote.permission.sigs[i];
			serverinfo = BlindedVoterElection.getServerInfoByName(sig.sigBy);
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
