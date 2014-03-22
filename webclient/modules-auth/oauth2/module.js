var OAuth2 = function(authConfig) {
	this.serverId = authConfig.serverId;
	this.hasSubSteps = true;
};

OAuth2.prototype.getCredentials = function (config, permissionServerId) {
	var configHash = GetElectionConfig.generateConfigHash(config);
	var el = document.getElementById('username');
	var username = el.value;
	el = document.getElementById('displayname');
	var displayname = el.value;
	var clientId = ClientConfig.oAuth2Config[config.authConfig.serverId].clientId[permissionServerId];
	var credentials = {
			secret: SHA256(configHash  + clientId + username + OAuth2.random[clientId]),
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
	if (ss == numSteps) { // show "generate voting permission"-button on last step
		el.style.display="";    
	} else {
		el.style.display="none";    
	}
}

OAuth2.showDoneButton = function(id) {
	var el = document.getElementById(id);
	el.style.display = '';
};

OAuth2.getMainContent = function(conf) {
	var serverId = conf.authConfig.serverId;
	
	var elelctionConfigHash = GetElectionConfig.generateConfigHash(conf);
	var step = 1;
	var mc = 
		'<ol class="substep-progress">' +
/*		'<li class="active-step" id="ss1">' +
        '	<span class="step-name"><span class="substeps">A:</span> Einloggen</span>' +
        '</li>' +
*/      '<li class="active-step"   id="ss1">' +
        '	<span class="step-name"><span class="substeps">A:</span> Abstimmserver autorisieren</span>'+
        '</li>'+
        '<li class="todo-step"   id="ss2">'+
        '<span class="step-name"><span class="substeps">B:</span> Kontrollserver autorisieren</span>'+
        '</li>'+
        '<li class="todo-step"   id="ss3">'+
        '	<span class="step-name"><span class="substeps">C:</span> Wahlschein erstellen</span>'+
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
	
	var slist = getPermissionServerList();
	for ( var permissionServerId in ClientConfig.oAuth2Config[serverId].clientId) {
		var clientId = ClientConfig.oAuth2Config[conf.authConfig.serverId].clientId[permissionServerId];
		OAuth2.random[clientId] = bigInt2str(randBigInt(200,0), 62);
		var oauthAutorize = ClientConfig.oAuth2Config[serverId].authorizeUri + 
		'scope=' + ClientConfig.oAuth2Config[serverId].scope +
		'&state=' + ClientConfig.oAuth2Config[serverId].serverId + '.' + elelctionConfigHash + '.'+ OAuth2.random[clientId]+ 
		'&redirect_uri=' + ClientConfig.oAuth2Config[serverId].redirectUri[permissionServerId] + 
		'&response_type=code' +
		'&client_id=' + clientId;
		var permServerNr =  ArrayIndexOf(slist, 'name', permissionServerId);
		var style = '"display:none;"';
		if (step == 1) style = '""';
		mc = mc + 
		'<div id="substep' + step +'" style=' + style + '>' +
		'						<label for="login'+step+'"><span class="substeps">Schritt ' + String.fromCharCode('A'.charCodeAt(0) + step -1) +':</span> Für ' + slist[permServerNr].desc +': </label> ' +
	//	'		  				     <a id="login" href="javascript:window.open(\'' + oauthAutorize + '\', \'_blank\');">Zugriff auf &gt;' + ClientConfig.oAuth2Config[serverId].serverDesc + '&lt; erlauben</a><br>';
		'		  				     <a id="login'+step+'" href="' + oauthAutorize + '" target="_blank" onclick="OAuth2.showDoneButton(\'loginOauth2Txt2s'+step+'\');">' + slist[permServerNr].desc + ' autorisieren</a><br>'+
//		'		  				     <a id="login" href="' + oauthAutorize + '" target="_blank">&Uuml;ber &gt;' + ClientConfig.oAuth2Config[serverId].serverDesc + '&lt; einloggen</a><br>';
		'						<label for="loginOauth2Txt2s'+step+'"> </label> ' +
		'<span id="loginOauth2Txt2s'+step+'" style="display:none"><button onclick="setSubStep(' +(step+1) +')">Autorisierung war erfolgreich</button></span>'+
		'<br>' +
		'</div>';
		step++;
	}
	
	mc = mc +
	'<div id="substep' + step +'" style="display:none;">' +
	'						<label for="username"><span class="substeps">Schritt ' + String.fromCharCode('A'.charCodeAt(0) + step -1) +':</span> Username erneut eingeben</label> ' +
	'						     <input name="username" id="username" value="" type="text"></td>' + 
    '                       <br>' +
	'						<label for="displayname" style="display:none">Mich &ouml;ffentlich anzeigen als</label> ' +
	'						     <input name="displayname" id="displayname" value="" type="hidden"></td>' + 
    '                       <br>'+
	'</div>';
	return mc;
}; 

OAuth2.getConfigObtainedHtml = function () {
	var ret = ''; // shared password: Teilen Sie den Wahlberechtigten außerdem das Wahlpasswort mit.
	return ret;
};

OAuth2.getNewElectionHtml = function (serverId) {
	// TODO put this in config 
	var ret = 
		'F&uuml;r den Basisentscheid Online (BEO) wird f&uuml;r jeden Abstimmungstermin auf dem BEO-Server eine Liste der Stimmberechtigten angelegt. Geben Sie hier die ID dieser Liste ein.<br>' +
		'<input name="listId" id="listId" value="" type="text">' +
		'<label for="listId">ID der Liste, die die Abstimmungsberechtigten enth&auml;lt</label> ';
	return ret;
};

/**
 * this function must returns an Array/Object with .authModule, containing the AuthModuleId
 * and .authData containing an Array/Object with all auth data needed for this module
 */
OAuth2.getNewElectionData = function () {
	var ret = {};
	ret.authModule = 'oAuth2'; 
	ret.authData = {};
	ret.authData.serverId = ClientConfig.oAuth2Config['BEOBayern'].serverId; // TODO read this from selected OAuthServer-config which was selected in the web formular 
	var element = document.getElementById('listId');
	ret.authData.listId = element.value;
	return ret;
};

OAuth2.prototype.onAuthFailed = function(xthserver){
	var ss = 1; 
	if (xthserver > 0) {
		// pa = Math.min(xthserver, election.pServerSeq[xthserver]); // in case "Server 2"-auth was failing first, take the user to "server 1", because this one was not tried.
		var pa = xthserver;
		ss = pa + 2;
	}
	setSubStep(ss);
};