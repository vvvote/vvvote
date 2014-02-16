var OAuth2 = function() {


};

OAuth2.getMainContent = function(conf) {
	serverId = 'BEOBayern';
	
	var random = bigInt2str(randBigInt(200,0), 62);
//	var oauthRedirectUri = 'https://abstimmung.piratenpartei-nrw.de/backend/modules-auth/oauth/callback.php';
//	var oauthRedirectUri = 'http%3A//www.webhod.ra/vvvote2/backend/modules-auth/oauth/callback.php';
//	var oauthClientId = 'vvvote';
	var elelctionConfigHash = GetElectionConfig.generateConfigHash(conf);
	var oauthAutorize = oAuth2Config[serverId].authorizeUri + 
		'scope=' + oAuth2Config[serverId].scope +
		'&state=' + oAuth2Config[serverId].serverId + '.' + elelctionConfigHash + '.'+ random + 
		'&redirect_uri=' + oAuth2Config[serverId].redirectUri[0] + 
		'&response_type=code' +
		'&client_id=' + oAuth2Config[serverId].clientId[0];
	var mc = '<div id="auth">' +
	'<form onsubmit="return false;">' +
	'                       <br>' +
	'						<label for="electionId">Name der Abstimmung:</label> ' +
    '                            <input readonly="readonly" name="electionId" id="electionId" value="' + conf.electionId + '">' +
    '                       <br>' +
	'						<label for="login">Einloggen</label> ' +
	'		  				     <a id="login" href="' + oauthAutorize + '" target="_blank">&Uuml;ber BEO Bayern einloggen</a>'+
    '                       <br>' +
	'						<label for="voterId">Username bei BEO</label> ' +
	'						     <input name="voterId" id="voterId" value="" type="text"></td>' + 
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
	var element = document.getElementById('listId');
	ret.authData.listId = element.value;
	return ret;
};