var ExternalTokenAuth = function() {
	this.hasSubSteps = false;
};

ExternalTokenAuth.prototype.getCredentials = function (config, clientId) {
	var credentials = {};
	var e = document.getElementById('voterId');
	credentials.voterId    = e.value;
	return credentials;
};

ExternalTokenAuth.getMainContent = function(conf) {
	var query = URI.parseQuery(location.search);
	var token = '';
	if ('token' in query) token = query.token; 
	var mc =
		'						<label for="voterId">Token: </label> ' +
		'		  				     <input name="voterId" id="voterId" value="' + token +'"> ' +
		'                       <br>';
	return mc;
}; 


ExternalTokenAuth.getConfigObtainedHtml = function () {
	var ret = '';
	return ret;
};

/**
 * This static function has to return HTML code containing the fields needed for creating
 * a new election
 * @returns {String}
 */
ExternalTokenAuth.getNewElectionHtml = function () {
	var ret = 
		'Die W&auml;hler werden über ein Token identifiziert und die Wahlberechtigung gepr&uuml;ft.<br>';
	return ret;
};

/**
 * this function must return an Array/Object with .authModule, containing the AuthModuleId
 * and .authData containing an Array/Object with all auth data needed for this module
 */
ExternalTokenAuth.getNewElectionData = function (serverId) {
	var ret = {};
	ret.auth = 'externalToken'; 
//	var element = document.getElementById('checkTokenUrl');
//	ret.authData.sharedPassw = element.value;
//	ret.authData = {'checkTokenUrl': 'http://www.webhod.ra/vvvote2/test/externaltoken.html'};
	ret.authData = {'configId': 'basisentscheid_offen'};
	return ret;
};

/**
 * This is only needed in case the auth module needs several steps
 * so this method can load the apropiate step
 */
ExternalTokenAuth.prototype.onAuthFailed = function(curServer){

};

