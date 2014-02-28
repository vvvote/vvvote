var OAuth2 = function(authConfig) {
	this.serverId = authConfig.serverId;
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
	var numSteps = 4;
	for (var i=1; i<=numSteps; i++) 
	{    
		var el = document.getElementById("substep"+i);    
		if (ss == i) el.style.display="";    
		else        el.style.display="none";  
	}
	if (ss == numSteps) {
		el = document.getElementById("substepL");
		el.style.display="";    

	}
}


OAuth2.getMainContent = function(conf) {
	var serverId = conf.authConfig.serverId;
	
	var elelctionConfigHash = GetElectionConfig.generateConfigHash(conf);
	var step = 1;
	var mc = 
		'<script type="text/javascript">'+
		'function setSubStep(ss) {' +
		'  for (var i=1; i<=3; i++) {' +
		'    var el = document.getElementById("substep"+i);' +
		'    if (ss == i) el.style.display="";' +
		'    else         el.style.display="none";' +
		'  }' +
		'}' +
		'</script>' +
		'<div id="substep1">	<label for="loginOauth2Txt"><span class="substeps">Schritt ' + String.fromCharCode('A'.charCodeAt(0) + step -1) +':</span> Einloggen</label> ' +
		'<span id="loginOauth2Txt">Sie m&uuml;ssen sich beim Basisentscheid-Server einloggen und angemeldet bleiben. </span>' +
		'						<label for="loginOAuth2"><span class="substeps"> </label> ' +
		'		  				     <a id="loginOAuth2" href="' + ClientConfig.oAuth2Config[serverId].loginUri + '" target="_blank">&Uuml;ber &gt;' + ClientConfig.oAuth2Config[serverId].serverDesc + '&lt; einloggen</a><br>' +
		'<br>' +
		'						<label for="loginOauth2Txt2"> </label> ' +
		'<span id="loginOauth2Txt2"><button onclick="setSubStep(2);">Ich habe mich erfolreich angemeldet</button></span>'+
		'</div>'+
//	'<span id="loginOauth2Txt2">Wichtig: Erst einloggen, danach folgende Schritte ausf&uuml;hren.'+
//	'<span id="loginOauth2Txt2">Erst nachdem Sie sich erfolgreich eingeloggt haben, fahren Sie mit den folgenden Schritten fort.</span><br>' + // klicken Sie auf die folgenden ' + Object.keys(ClientConfig.oAuth2Config[serverId].clientId).length + ' Links.'

	// ' Durch den Klick auf die Links wird den Abstimmungsserver erlaubt beim Basisentscheid-Server ' +
	// 'Ihre Wahlberechtigung abzurufen.' +
		'<br>';
	step++;
	
	for ( var permissionServerId in ClientConfig.oAuth2Config[serverId].clientId) {
		var clientId = ClientConfig.oAuth2Config[conf.authConfig.serverId].clientId[permissionServerId];
		OAuth2.random[clientId] = bigInt2str(randBigInt(200,0), 62);
		var oauthAutorize = ClientConfig.oAuth2Config[serverId].authorizeUri + 
		'scope=' + ClientConfig.oAuth2Config[serverId].scope +
		'&state=' + ClientConfig.oAuth2Config[serverId].serverId + '.' + elelctionConfigHash + '.'+ OAuth2.random[clientId]+ 
		'&redirect_uri=' + ClientConfig.oAuth2Config[serverId].redirectUri[permissionServerId] + 
		'&response_type=code' +
		'&client_id=' + clientId;
		mc = mc + 
		'<div id="substep' + step +'" style="display:none;">' +
		'						<label for="login'+step+'"><span class="substeps">Schritt ' + String.fromCharCode('A'.charCodeAt(0) + step -1) +':</span> Für ' + permissionServerId +': </label> ' +
	//	'		  				     <a id="login" href="javascript:window.open(\'' + oauthAutorize + '\', \'_blank\');">Zugriff auf &gt;' + ClientConfig.oAuth2Config[serverId].serverDesc + '&lt; erlauben</a><br>';
		'		  				     <a id="login'+step+'" href="' + oauthAutorize + '" target="_blank">Zugriff auf &gt;' + ClientConfig.oAuth2Config[serverId].serverDesc + '&lt; erlauben</a><br>'+
//		'		  				     <a id="login" href="' + oauthAutorize + '" target="_blank">&Uuml;ber &gt;' + ClientConfig.oAuth2Config[serverId].serverDesc + '&lt; einloggen</a><br>';
		'						<label for="loginOauth2Txt2s'+step+'"> </label> ' +
		'<span id="loginOauth2Txt2s'+step+'"><button onclick="setSubStep(' +(step+1) +')">Zugriff erfolgreich erlaubt</button></span>'+
		'<br>' +
		'</div>';
		step++;
	}
	
	mc = mc +
	'<div id="substep' + step +'" style="display:none;">' +
	'						<label for="username"><span class="substeps">Schritt ' + String.fromCharCode('A'.charCodeAt(0) + step -1) +':</span> Username beim Basisentscheid-Server</label> ' +
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
		'Für den Basisentscheid Online (BEO) wird für jeden Abstimmungstermin auf dem BEO-Server eine Liste der Stimmberechtigten angelegt. Geben Sie hier die ID dieser Liste ein.<br>' +
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