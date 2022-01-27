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
		'						<label for="voterId">' + i18n.gettext('Your name:') +'</label> ' +
		'		  				     <input name="voterId" id="voterId" value="" autofocus="autofocus"> ' +
		'                       <br>' +
		'						<label for="sharedPassw">' + i18n.gettext('Voting password:') +'</label> ' +
		'						     <input name="sharedPassw" id="secret" value="" type="password"></td>' + 
		'                       <br>';
	return mc;
}; 


SharedPasswAuth.getConfigObtainedHtml = function () {
	var ret = i18n.gettext('Additionally, tell the eligible voters the voting password.');
	return ret;
};

/**
 * This static function has to return HTML code containing the fields needed for creating
 * a new election
 * @returns {String}
 */
SharedPasswAuth.getNewElectionHtml = function () {
	var ret =
		i18n.gettext('The voters enter thier name and can only cast their vote if they know the password given here. Everyone who knows the password can cast his vote.<br>') +
		'<input type="text" id="givenPassword">' + 
		'<label for="givenPassword">' + i18n.gettext('Voting password') + '</label>';
	return ret;
};

/**
 * this function must return an Array/Object with .authModule, containing the AuthModuleId
 * and .authData containing an Array/Object with all auth data needed for this module
 * ret.error
 */
SharedPasswAuth.getNewElectionData = function (serverId, startdate, intervall, enddate) {
	var ret = {};
	ret.auth = 'sharedPassw';
//	var startdate = new Date();
//	var enddate = startdate.getTime() + 0.1 * 86400 * 1000; // in milleseconds
	var enddateNum = enddate.getTime();
//	var intervall = 5 * 60 * 1000; // in milleseconds
	var DelayUntil = new Array();
	var DelayUntilStr = new Array();
	DelayUntil.push(startdate.getTime());
	DelayUntilStr.push(startdate.toISOString());
	var cur = startdate.getTime();
	while (cur < enddateNum - intervall) {
		cur = DelayUntil[DelayUntil.length-1] + intervall;
		DelayUntil.push(cur);
		var tmp = new Date(cur);
		DelayUntilStr.push(tmp.toISOString());
	}
	if (DelayUntilStr.length < 2) { // only start date
		ret.errorTxt = i18n.gettext("Error: The prohibit voting interval is too long: it must be shorter then the duration between start and end of voting.");
		ret.erroNo = 87474395;
		return ret;
	}
	ret.authData = {
			"RegistrationStartDate": "2014-01-27T21:20:00Z",  // period, in which return envelop generation is allowed
	        "RegistrationEndDate":   "2030-10-10T21:20:00Z",
// für später:      "RegistrationEndDate":   DelayUntilStr[DelayUntilStr.length -1],
	        "VotingStart": startdate.toISOString(),  
	        "VotingEnd" :  enddate.toISOString(),  
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

