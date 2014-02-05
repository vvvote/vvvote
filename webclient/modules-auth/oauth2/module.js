var Oauth = function() {


};

Oauth.getMainContent = function(conf) {
	var oauthAutorize = 'https://beoauth.piratenpartei-bayern.de/oauth2/authorize/?scope=member&redirect_uri=https://abstimmung.piratenpartei-nrw.de/backend/modules-auth/oauth/callback.php&response_type=code&client_id=vvvote';
	var mc = '<div id="auth">' +
	'<form onsubmit="return false;">' +
	'                       <br>' +
	'						<label for="electionId">Name der Abstimmung:</label> ' +
    '                            <input disabled="disabled" name="electionId" id="electionId" value="' + conf.electionId + '">' +
    '                       <br>' +
	'						<label for="voterId">&Uuml;ber BEO Bayern einloggen</label> ' +
	'		  				     <a href="' + oauthAutorize + '" target="_blank" '+
    '                       <br>' +
	'						<label for="sharedPassw">Wahlpasswort</label> ' +
	'						     <input name="sharedPassw" id="secret" value="" type="password"></td>' + 
    '                       <br>' +
	'						<label for="reqPermiss"></label> ' +
	'						     <input type="submit" name="reqPermiss" id="reqPermiss" ' +
	'							  value="Wahlschein holen" onclick="onGetPermClick();">' +
    '                       <br>' +
    '</form>' +
    '</div>';
	return mc;
}; 

Oauth.getConfigObtainedHtml = function () {
	var ret = 'Teilen Sie den Wahlberechtigten auﬂerdem das Wahlpasswort mit.';
	return ret;
};