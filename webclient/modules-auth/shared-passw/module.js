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
	var startdate = new Date();
	var enddate = startdate.getTime() + 0.1 * 86400 * 1000; // in milleseconds
	var intervall = 5 * 60 * 1000; // in milleseconds
	var DelayUntil = new Array();
	var DelayUntilStr = new Array();
	DelayUntil.push(startdate.getTime());
	DelayUntilStr.push(startdate.toUTCString());
	var cur = startdate.getTime();
	while (cur < enddate) {
		cur = DelayUntil[DelayUntil.length-1] + intervall;
		DelayUntil.push(cur);
		var tmp = new Date(cur);
		DelayUntilStr.push(tmp.toISOString());
	}
	var enddatedate = new Date(enddate);
	ret.authData = {
			"RegistrationStartDate": "2014-01-27T21:20:00Z",  // period, in which return envelop generation is allowed
	        "RegistrationEndDate":   "2020-10-10T21:20:00Z",
	        "VotingStart": startdate.toISOString(),  
	        "VotingEnd" :  enddatedate.toISOString(),  
	        "DelayUntil":   DelayUntilStr
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

