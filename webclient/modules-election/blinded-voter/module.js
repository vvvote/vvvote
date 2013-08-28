
function savePermission(ballot) {
	var bb = new Blob([ballot]);
	saveAs(bb, "signed_ballot.txt");
	// TODO check maximal loops = numServers
}


function handleXmlAnswer(xml) {
	if (xml.status != 200) {
		alert('HTTP-Error received: ' + xml.status + "\n" + xml.responseText);
		return;
	}
	var serverno = election.pServerSeq.slice(-1)[0];
	document.permission.log.value = document.permission.log.value + '<-- empfangen von ' + (election.xthServer +1) + ' (' + election.pServerList[serverno].url + ') Server: ' + xml.responseText + "\r\n\r\n";
	var result = handleServerAnswer(election, xml.responseText);
	switchAction(result);
	// TODO check maximal loops = numServers
};

function switchAction(result) {
	switch (result.action) {
	case 'send':
	  var xml2 = new XMLHttpRequest();
	  serverno = election.pServerSeq.slice(-1)[0];
	  xml2.open('POST', election.pServerList[serverno].url, true);
	  xml2.onload = function() { handleXmlAnswer(xml2); }; // quasi resursiv
	  document.permission.log.value = document.permission.log.value + '--> gesendet an ' + (election.xthServer +1) + ' (' + election.pServerList[serverno].url + ') Server: ' + result.data + "\r\n\r\n";
	  xml2.send(result.data);
	  break;
	case 'savePermission':
		alert('fertig. Wahlzettel speichern! Wahlzettelinhalt: \n '+ result.data);
		savePermission(result.data);
		// saveAs(result.data, 'ballots.json');
	    break;
	case 'serverError':
		alert('Server ' + (election.xthServer +1) + ' (' + election.pServerList[serverno].url + ') rejected the request \n Error number: '+ result.errorNo + "\n" + result.errorText);
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
		election.voterId    = document.permission.voterId.value;
		election.secret     = document.permission.secret.value;
		election.electionId = document.permission.electionId.value;
		election.numBallots = 5;
     	//  alert('voterID: '    + voterID +
	    //        '\r\nelectionID: ' + electionID);
	    election.pServerList = getPermissionServerList();
	    
	    req = makeFirstPermissionReqs(election);
	    // save req as local file in order to have a backup in case something goes wrong

	    //	purl = new Array();
 	//	purl[0] = 'getpermission.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';
	//	purl[1] = 'http://www2.webhod.ra/vvvote2/getpermission.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=13727034088813';
		
		var xml = new XMLHttpRequest();
		//var serverno = getNextPermServer(election);
		var url = election.pServerList[election.pServerSeq.slice(-1)[0]].url;
		xml.open('POST', url, true);
		xml.onload = function() { handleXmlAnswer(xml);};
//		 xml.onreadystatechange = function() {
//		   if (xml.readyState != 4)  { return; }
//		   var serverResponse = JSON.parse(xml.responseText);
//		 };
    	document.permission.log.value = document.permission.log.value + '\r\n\r\n --> gesendet an 1. Server (' + url + '): ' + req + "\r\n\r\n";  
        xml.send(req);
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
 * provide HTML code to be presented in step 3 (voting)
 *  
 */
BlindedVoterElection.getPermissionHtml = function(varname) {
	return 'Bitte laden Sie die Datei, in der Ihr Wahlschein gespeichert ist:<br>'+
	'<input type="file" id="loadfile" accept="text/plain" onchange="' + varname +'.loadPermFile(event);"/>';
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
 * called on: permission file is loaded
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
	this.permissionOk = true;
	this.callOnPermLoaded(this.permissionOk); // call back --> enables vote button
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
			alert('Die Unterschrift is korrekt');
		} else {
			alert('Die Unterschrift ist nicht korrekt');
		}
	} catch (e) {
		alert("Fehler beim überprüfen der Signatur:\n" + e);
	}
};
