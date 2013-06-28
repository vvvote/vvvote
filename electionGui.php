<!DOCTYPE html>
<html>
<head>
<title>Online Election / Wahl</title>
<script src="BigInt.js"></script>
<script src="rsa.js"></script>
<script src="sha256.js"></script>
<script src="election.js"></script>
<script type="text/javascript">

function handleXmlAnswer(xml) {
	document.permission.log.value = document.permission.log.value + '<-- empfangen von ' + (election.xthServer +1) + '. Server: ' + xml.responseText + "\r\n\r\n";
	var result = handleServerAnswer(election, xml.responseText);
	// TODO check maximal loops = numServers
	switch (result.action) {
	case 'send':
	  var xml2 = new XMLHttpRequest();
	  xml2.open('POST', purl, true);
	  xml2.onload = function() { handleXmlAnswer(xml2); }; // quasi resursiv
	  document.permission.log.value = document.permission.log.value + '--> gesendet an ' + (election.xthServer +1) + '. Server: ' + result.data + "\r\n\r\n";
	  xml2.send(result.data);
	  break;
	case 'savePermission':
		alert('fertig. Wahlzettel speichern! Wahlzettelinhalt: \n '+ result.data);
	    break;
	case 'serverError':
		alert('Server rejected the request \n '+ result.erroNo + "\n" + result.errorText);
		break;
	case 'clientError':
		alert('Client found error:\n '+ result.errorText);
	    break;
	default:
		alert('handleXmlAnswer(): Internal program error, got unknown action: ' + result.action);
	}
};

function onGetPermClick()  {
		election = new Object();
		election.voterId    = document.permission.voterId.value;
		election.secret     ='leer';
		election.electionId = document.permission.electionId.value;
		election.numBallots = 5;
     	//  alert('voterID: '    + voterID +
	    //        '\r\nelectionID: ' + electionID);
	    election.pServerList = getPermissionServerList();
	    
	    req = makeFirstPermissionReqs(election);
	    // save req as local file in order to have a backup in case something goes wrong
		// var req = makePermissionReq(voterId, electionId, numBallots, pServerList);
		// alert('req: ' + req);
		// document.permission.json.value = req;
		
		// var rq = new Object();
		// rq.voterId    = 'pakki';
		// rq.electionId = 'wahl1';
		// var req = JSON.stringify(rq);;
		purl = 'testtransm.php?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=137098483694310';
		var xml = new XMLHttpRequest();
        xml.open('POST', purl, true);
		xml.onload = function() { handleXmlAnswer(xml);};
//		 xml.onreadystatechange = function() {
//		   if (xml.readyState != 4)  { return; }
//		   var serverResponse = JSON.parse(xml.responseText);
//		 };
    	document.permission.log.value = document.permission.log.value + '\r\n\r\n --> gesendet an 1. Server: ' + req + "\r\n\r\n";  
        xml.send(req);
		return false;
}
	</script>
</head>

<body>
	<br>
	<form name=permission method="post" onsubmit="return false;">
		<!--  action="getPermission"> -->

		This page demonstrates a JavaScript library for secure online election
		<div align="center">
			<br>
			<table border=2 cellspacing=0 cellpadding=0>
				<tr>
					<td>
						<table bgColor="lightgray" border=0 cellspacing=0 cellpadding=1>
							<tr>
								<td>&nbsp;</td>
								<td align=right><font color=black> <b>ElectionId:</b>
								</font></td>
								<td><input name=electionId value="wahl1"></td>
								<td>&nbsp;</td>
							</tr>
							<tr>
								<td>&nbsp;</td>
								<td align=right><font color=black> <b>VoterId:</b>
								</font></td>
								<td><input name=voterId value="pakki"></td>
								<td>&nbsp;</td>
							</tr>
							<tr>
								<td>&nbsp;</td>
								<td>&nbsp; <input type="hidden" name=json value="">
								</td>
								<td><input type="submit" name=reqPermiss value="Request ballot"
									onclick="onGetPermClick();">
								</td>
								<td>&nbsp;</td>
						
						</table>
					</td>
				</tr>
				</tr>
				<tr>
					<td>
					<textarea name=log rows=20 cols=80>Log:</textarea>
					</td>
				</tr>
			</table>
		</div>
	</form>

</body>
</html>
<?php

?>