var SharedPasswAuth = function() {
	this.hasSubSteps = false;
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
	var ret = 'Teilen Sie den Wahlberechtigten außerdem das Wahlpasswort mit.';
	return ret;
};

/**
 * This static function has to return HTML code containing the fields needed for creating
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
	ret.auth = 'sharedPassw'; 
	ret.authData = {
			"RegistrationStartDate": "2014-01-27T21:20:00Z",  // period, in which return envelop generation is allowed
	        "RegistrationEndDate":   "2020-10-10T21:20:00Z",
	        "VotingStart": "2014-01-27T21:20:00Z",  
	        "VotingEnd" :  "2020-10-10T21:20:00Z",  
	        "DelayUntil": [
	                          "2015-04-13T12:35:00+02:00", 
	                          "2015-04-13T12:40:00+02:00",
	                          "2015-04-13T12:45:00+02:00",
	                          "2015-04-13T12:50:00+02:00",
	                          "2015-04-13T13:00:00+02:00",
	                          "2015-04-13T17:00:00+02:00",
	                          "2015-04-13T17:05:00+02:00",
	                          "2015-04-13T17:10:00+02:00",
	                          "2015-04-13T17:15:00+02:00",
	                          "2015-04-13T17:20:00+02:00",
	                          "2015-04-13T17:25:00+02:00",
	                          "2015-04-13T17:30:00+02:00",
	                          "2015-04-13T17:35:00+02:00",
	                          "2015-04-13T18:15:00+02:00",
	                          "2015-04-13T18:20:00+02:00",
	                          "2015-04-13T18:25:00+02:00",
	                          "2015-04-13T18:30:00+02:00",
	                          "2015-04-13T18:35:00+02:00",
	                          "2015-04-13T18:40:00+02:00",
	                          "2015-04-13T19:45:00+02:00",
	                          "2015-04-13T19:50:00+02:00",
	                          "2015-04-13T20:00:00+02:00",
	                          "2015-04-13T20:00:00+02:00",
	                          "2015-04-13T20:05:00+02:00",
	                          "2015-04-13T20:10:00+02:00",
	                          "2015-04-13T20:15:00+02:00",
	                          "2015-04-13T20:20:00+02:00",
	                          "2015-04-13T20:25:00+02:00",
	                          "2015-04-13T20:30:00+02:00",
	                          ]
	};
	var element = document.getElementById('givenPassword');
	ret.authData.sharedPassw = element.value;
	return ret;
};

/**
 * This is only needed in case the auth module needs several steps
 * so this method can load the apropiate step
 */
SharedPasswAuth.prototype.onAuthFailed = function(curServer){

};

