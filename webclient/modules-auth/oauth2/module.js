var OAuth2 = function() {

};

OAuth2.prototype.getCredentials = function (config, clientId) {
	var configHash = GetElectionConfig.generateConfigHash(config);
	var el = document.getElementById('username');
	var username = el.value;
	var credentials = {
			secret: SHA256(configHash  + clientId + username + OAuth2.random[clientId]),
			identifier: random[clientId]
	};
	return credentials;
};

/**
 * the randoms for transaction token - generated when step 2 page is loaded
 */
OAuth2.random = [];

OAuth2.getMainContent = function(conf) {
	serverId = 'BEOBayern';
	
	var elelctionConfigHash = GetElectionConfig.generateConfigHash(conf);
	var mc = '<div id="auth">' +
	'<form onsubmit="return false;">' +
	'                       <br>' +
	'						<label for="electionId">Name der Abstimmung:</label> ' +
    '                            <input readonly="readonly" name="electionId" id="electionId" value="' + conf.electionId + '">' +
    '                       <br>';
	
	for ( var clientno in oAuth2Config[serverId].clientId) {
		OAuth2.random[clientno] = bigInt2str(randBigInt(200,0), 62);
		var oauthAutorize = oAuth2Config[serverId].authorizeUri + 
		'scope=' + oAuth2Config[serverId].scope +
		'&state=' + oAuth2Config[serverId].serverId + '.' + elelctionConfigHash + '.'+ OAuth2.random[clientno]+ 
		'&redirect_uri=' + oAuth2Config[serverId].redirectUri[clientno] + 
		'&response_type=code' +
		'&client_id=' + oAuth2Config[serverId].clientId[clientno];
		mc = mc + 
		'						<label for="login">Einloggen f&uuml;r Abstimmserver ' + clientno +'</label> ' +
		'		  				     <a id="login" href="' + oauthAutorize + '" target="_blank">&Uuml;ber &gt;' + oAuth2Config[serverId].serverDesc + '&lt; einloggen</a><br>';
	}
	
	mc = mc +
	'						<label for="voterId">Username bei BEO</label> ' +
	'						     <input name="username" id="username" value="" type="text"></td>' + 
    '                       <br>' +
	'						<label for="reqPermiss"></label> ' +
	'						     <input type="submit" name="reqPermiss" id="reqPermiss" ' +
	'							  value="Wahlschein holen" onclick="onGetPermClick();">' +
    '                       <br>' +
    '</form>' +
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
	ret.authData.serverId = oAuth2Config['BEOBayern'].serverId; // TODO read this from selected OAuthServer-config which was selected in the web formular 
	var element = document.getElementById('listId');
	ret.authData.listId = element.value;
	return ret;
};