var SharedPasswAuth = function() {


};

SharedPasswAuth.prototype.getCredentials = function (config, clientId) {
	var credentials = {};
	var e = document.getElementById('voterId');
	credentials.voterId    = e.value;
	e = document.getElementById('secret');
	credentials.secret     = e.value;
	return credentials;
};

SharedPasswAuth.getMainContent = function(conf) {
	var mc =
	'						<label for="voterId">Ihr Name:</label> ' +
	'		  				     <input name="voterId" id="voterId" value=""> ' +
    '                       <br>' +
	'						<label for="sharedPassw">Wahlpasswort</label> ' +
	'						     <input name="sharedPassw" id="secret" value="" type="password"></td>' + 
    '                       <br>';
	return mc;
}; 


SharedPasswAuth.getConfigObtainedHtml = function () {
	var ret = 'Teilen Sie den Wahlberechtigten auﬂerdem das Wahlpasswort mit.';
	return ret;
};

/**
 * This static function has to retunt HTML code containing the fields needed for creating
 * a new election
 * @returns {String}
 */
SharedPasswAuth.getNewElectionHtml = function () {
	var ret = 
		'Die W&auml;hler geben ihren Namen ein und k&ouml;nnen nur dann abstimmen, wenn sie das hier festgelegte Abstimmungspasswort kennen. Es kann also jeder abstimmen, der das Abstimmungspasswort kennt.<br>' +
		'<input type="text" id="givenPassword">' + 
		'<label for="givenPassword">Abstimmungspasswort</label>';
	return ret;
};

/**
 * this function must return an Array/Object with .authModule, containing the AuthModuleId
 * and .authData containing an Array/Object with all auth data needed for this module
 */
SharedPasswAuth.getNewElectionData = function (serverId) {
	var ret = {};
	ret.authModule = 'sharedPassw'; 
	ret.authData = {};
	var element = document.getElementById('givenPassword');
	ret.authData.sharedPassw = element.value;
	return ret;
};