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

OAuth2.getMainContent = function(conf) {
	var serverId = conf.authConfig.serverId;
	
	var elelctionConfigHash = GetElectionConfig.generateConfigHash(conf);
	var mc = 
	'						<label for="loginOAuth2">Einloggen</label> ' +
	'		  				     <a id="loginOAuth2" href="' + ClientConfig.oAuth2Config[serverId].loginUri + '" target="_blank">&Uuml;ber &gt;' + ClientConfig.oAuth2Config[serverId].serverDesc + '&lt; einloggen</a><br>';
	
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
		'						<label for="login">Für ' + permissionServerId +'</label> ' +
	//	'		  				     <a id="login" href="javascript:window.open(\'' + oauthAutorize + '\', \'_blank\');">Zugriff auf &gt;' + ClientConfig.oAuth2Config[serverId].serverDesc + '&lt; erlauben</a><br>';
		'		  				     <a id="login" href="' + oauthAutorize + '" target="_blank">Zugriff auf &gt;' + ClientConfig.oAuth2Config[serverId].serverDesc + '&lt; erlauben</a><br>';
//		'		  				     <a id="login" href="' + oauthAutorize + '" target="_blank">&Uuml;ber &gt;' + ClientConfig.oAuth2Config[serverId].serverDesc + '&lt; einloggen</a><br>';
	}
	
	mc = mc +
	'						<label for="username">Username bei BEO</label> ' +
	'						     <input name="username" id="username" value="" type="text"></td>' + 
    '                       <br>' +
	'						<label for="displayname">Mich &ouml;ffentlich anzeigen als</label> ' +
	'						     <input name="displayname" id="displayname" value="" type="text"></td>' + 
    '                       <br>';
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