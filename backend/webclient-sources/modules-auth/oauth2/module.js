var OAuth2 = function(authConfig) {
	this.serverId = authConfig.serverId;
	this.hasSubSteps = true;
};

OAuth2.prototype.getCredentials = function (electionId, permissionServerId) {
	el = document.getElementById('displayname');
	var displayname = el.value;
	var clientId = ClientConfig.oAuth2Config[this.serverId].clientIds[permissionServerId];
	var credentials = {
			identifier: OAuth2.random[clientId],
			displayname: displayname
	};
	return credentials;
};

/**
 * the randoms for transaction token - generated when step 2 page is loaded
 */
OAuth2.random = [];


function setSubStep(ss) {
	var numSteps = 3;
	for (var i=1; i<=numSteps; i++) { 
		var el  = document.getElementById("substep"+i);
		var el2 = document.getElementById("ss"+i);
		if (ss == i) {
			el.style.display="";
			el2.className ='active-step';
		}
		else {        
			el.style.display="none";
		}
		if (i < ss) el2.className ='done-step';
		if (i > ss) el2.className ='todo-step';
	}
	el = document.getElementById("substepL");
	if (ss == numSteps) { 
		el.style.display=""; // show "generate voting permission"-button on last step
		// OAuth2.showLogOutLink(true, 'L');
	} else {
		el.style.display="none";    
	}
}


OAuth2.waitForOAuthServer = function(oauthAutorize, step) {
    var w = window.open(oauthAutorize, "_blank"); //"menubar=no,status=no,height=" + height + ",width=" + width + ",left=" + left + ",top=" + top);
    OAuth2.timer = setInterval(function () {
    		w.postMessage(true, '*'); // send a message to the new window so that it will get a reference to this window
      }, 1000);
    OAuth2.subStep = step;
    OAuth2.showLogOutLink(true, 1);
//    OAuth2.showDoneButton('loginOauth2Txt2s' + step); // did not do anything (anymore) 
};


OAuth2.loggedIn = function(ev) {
	clearInterval(OAuth2.timer);
	setSubStep(OAuth2.subStep +1);
	OAuth2.showLogOutLink(false, 1);
/* automatically clicking the next permission server autorization button works, but all browsers block the new window - so this does not work
	setTimeout(function() { 
		var el = document.getElementById('login2'); //  + OAuth2.subStep + 1
		aalert.openTextOk(el); 
		el.click(); 
		}, 500);
*/
};

window.addEventListener("message", OAuth2.loggedIn, false);

/*
OAuth2.showDoneButton = function(id) {
	var el = document.getElementById(id);
	el.style.display = '';
};
*/

OAuth2.getMainContent = async function(conf) {
	var serverId = conf.authConfig.serverId;
	
	var elelctionId = conf.electionId;
	var step = 1;
	var serverUsageNoteLang = i18n.options.locale_data.messages[""].lang;
	// if the requested language is not available, use the first one
	if (ClientConfig.oAuth2Config[serverId].serverUsageNote[serverUsageNoteLang] == undefined) serverUsageNoteLang = Object.keys(ClientConfig.oAuth2Config[serverId].serverUsageNote)[0];
	var mc = 
		ClientConfig.oAuth2Config[serverId].serverUsageNote[serverUsageNoteLang] + 
		'<ol class="substep-progress">' +
		'<span class="stepshead">' + i18n.gettext('Steps: ') + '</span>' +
/*		'<li class="active-step" id="ss1">' +
        '	<span class="step-name"><span class="substeps">A:</span> Einloggen</span>' +
        '</li>' +
*/      '<li class="active-step"   id="ss1">' +
        '	<span class="step-name"><span class="substeps">A:</span> ' + i18n.gettext('Authorize voting server') + '</span>'+
        '</li>'+
        '<li class="todo-step"   id="ss2">'+
        '<span class="step-name"><span class="substeps">B:</span> ' + i18n.gettext('Authorize checking server') + '</span>'+
        '</li>'+
        '<li class="todo-step"   id="ss3">'+
        '	<span class="step-name"><span class="substeps">C:</span> '+ i18n.gettext('Create voting certificate') + '</span>'+
        '</li>'+
        '</ol>'+
        '<br><br>' +
/*		'<div id="substep1">	<label for="loginOauth2Txt"><span class="substeps">Schritt ' + String.fromCharCode('A'.charCodeAt(0) + step -1) +':</span> Einloggen</label> ' +
		'<span id="loginOauth2Txt">Sie m&uuml;ssen sich beim Basisentscheid-Server einloggen und angemeldet bleiben. </span>' +
		'						<label for="loginOAuth2"><span class="substeps"> </label> ' +
		'		  				     <a id="loginOAuth2" href="' + ClientConfig.oAuth2Config[serverId].loginUri + '" target="_blank" onclick="OAuth2.showDoneButton(\'loginOauth2Txt2\');">&Uuml;ber &gt;' + ClientConfig.oAuth2Config[serverId].serverDesc + '&lt; einloggen</a><br>' +
		'<br>' +
		'						<label for="loginOauth2Txt2"> </label> ' +
		'<span id="loginOauth2Txt2" style="display:none;"><button onclick="setSubStep(2);">Ich habe mich erfolreich angemeldet</button></span>'+
		'</div>'+
*/
//	'<span id="loginOauth2Txt2">Wichtig: Erst einloggen, danach folgende Schritte ausf&uuml;hren.'+
//	'<span id="loginOauth2Txt2">Erst nachdem Sie sich erfolgreich eingeloggt haben, fahren Sie mit den folgenden Schritten fort.</span><br>' + // klicken Sie auf die folgenden ' + Object.keys(ClientConfig.oAuth2Config[serverId].clientId).length + ' Links.'

	// ' Durch den Klick auf die Links wird den Abstimmungsserver erlaubt beim Basisentscheid-Server ' +
	// 'Ihre Wahlberechtigung abzurufen.' +
		'<br>';
//	step++;
	if (! ClientConfig.oAuth2Config[serverId]) {
		aalert.openTextOk(i18n.sprintf(i18n.gettext("Configuration error: serverId >%s< is asked for, but not configured"), serverId)); 
	}
	var slist = ClientConfig.serverList;
	for ( var permissionServerId in ClientConfig.oAuth2Config[serverId].clientIds) {
		var clientId = ClientConfig.oAuth2Config[conf.authConfig.serverId].clientIds[permissionServerId];
		OAuth2.random[clientId] = bigInt2str(randBigInt(200,0), 62);
		var oauthAutorize = ClientConfig.oAuth2Config[serverId].authorizeUri + 
		'prompt=' + ( (step == 1) ? 'login' : 'none') +
		'&scope=' + encodeURIComponent(ClientConfig.oAuth2Config[serverId].scope) +
		'&state=' + encodeURIComponent(ClientConfig.oAuth2Config[serverId].serverId.replace('.', '\\.') + '.' + elelctionId.replace('.', '\\.') + '.' + await SHA256(OAuth2.random[clientId])) + 
		'&redirect_uri=' + encodeURIComponent(ClientConfig.oAuth2Config[serverId].redirectUris[permissionServerId]) + 
		'&response_type=code' +
		'&client_id=' + encodeURIComponent(clientId);
		var permServerNr =  ArrayIndexOf(slist, 'name', permissionServerId);
		var style = '"display:none;"';
		if (step == 1) style = '""';
		mc = mc + 
		'<div id="substep' + step +'" style=' + style + '>' +
		'						<label for="login'+step+'"><span class="substeps">' + i18n.sprintf(i18n.gettext('Step %s: '), String.fromCharCode('A'.charCodeAt(0) + step -1)) + '</span></label>' + 
	//	'		  				     <a id="login" href="javascript:window.open(\'' + oauthAutorize + '\', \'_blank\');">Zugriff auf &gt;' + ClientConfig.oAuth2Config[serverId].serverDesc + '&lt; erlauben</a><br>';
		'		  				     <a autofocus="autofocus" id="login'+step+'" href="#" onclick="OAuth2.waitForOAuthServer(\''+oauthAutorize+'\', ' +step+');">' + i18n.sprintf(i18n.gettext('Authorize %s'), slist[permServerNr].getDesc()) + '</a><br>'+
//		'		  				     <a autofocus="autofocus" id="login'+step+'" href="' + oauthAutorize + '" target="_blank" onclick="OAuth2.showDoneButton(\'loginOauth2Txt2s'+step+'\');">' + slist[permServerNr].desc + ' autorisieren</a><br>'+
//		'		  				     <a id="login" href="' + oauthAutorize + '" target="_blank">&Uuml;ber &gt;' + ClientConfig.oAuth2Config[serverId].serverDesc + '&lt; einloggen</a><br>';
		'						<label for="loginOauth2Txt2s'+step+'"> </label> ' +
		'<span id="loginOauth2Txt2s'+step+'" style="display:none"><button onclick="setSubStep(' +(step+1) +')">' + i18n.gettext('Authorization succeeded') + '</button></span>'+
		'<br>' +
		'</div>';
		if (step == 1 )	mc = mc + '<div id="log_out1" class="log_out"' + 'style="display:none;"' + '>' +
		'								<a target="_blank" href="' + ClientConfig.oAuth2Config[serverId].logoutUrl + '">' + i18n.gettext('Log out') + '</a> ' +
		'						   </div>';
		step++;
	}
		
	mc = mc +
	'<div id="substep' + step +'" style="display:none;">' +
	'						<label for="displayname" style="display:none">' + i18n.gettext('Name me publicly as ') + '</label> ' +
	'						     <input name="displayname" id="displayname" value="" type="hidden"></td>' + 
	'</div>';
	mc = mc +
	'<div id="log_outL" class="log_outL"' + 'style="display:none;"' + '>' +
	'						<a target="_blank" href="' + ClientConfig.oAuth2Config[serverId].logoutUrl + '">' + i18n.gettext('Log out') + '</a> ' +
	'</div>';
	return mc;
}; 

OAuth2.showLogOutLink = function(show, step) {
	var el  = document.getElementById("log_out" + step);
	if (show) 	el.style.display="";
	else el.style.display="none";
};

OAuth2.getConfigObtainedHtml = function () {
	var ret = ''; // shared password: Teilen Sie den Wahlberechtigten außerdem das Wahlpasswort mit.
	return ret;
};

OAuth2.getNewElectionHtml = function (serverId) {
	// TODO put this in config 
	var ret =
		i18n.gettext('Using the an identity server (which is specifical designed to work with vvvote), a list of eligible voters is created on the identity server for each voting date. Enter the ID of this list.<br>') +
		'<input name="listId" id="listId" value="" type="text">' +
		'<label for="listId">' + i18n.gettext('ID of the list of eligible voters') + '</label> ';
	return ret;
};

/**
 * this function must returns an Array/Object with .authModule, containing the AuthModuleId
 * and .authData containing an Array/Object with all auth data needed for this module
 */
OAuth2.getNewElectionData = function (serverId) {
	var ret = {};
	ret.auth = 'oAuth2'; 
	ret.authData = { 
			"nested_groups": ["KV Düsseldorf"],
			"verified": false,
			"eligible": true,
			"external_voting": true,
			"RegistrationStartDate": "2014-01-27T21:20:00Z",
			"RegistrationEndDate":   "2030-10-10T21:20:00Z"
			};
	ret.authData.serverId = ClientConfig.oAuth2Config[serverId].serverId; 
	var element = document.getElementById('listId');
	ret.authData.listId = element.value;
	return ret;
};

OAuth2.prototype.onAuthFailed = function(curServer) {
	var xthserver = ArrayIndexOf(ClientConfig.serverList, 'name', curServer.name);
	var ss = 1; 
	/* if (xthserver > 0) {
		// var pa = Math.min(xthserver, election.pServerSeq[xthserver]); // in case "Server 2"-auth was failing first, take the user to "server 1", because this one was not tried.
		var pa = xthserver;
		ss = pa + 1;
	} */
	setSubStep(ss);
};