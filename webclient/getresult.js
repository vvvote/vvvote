function GetResultPage() {
	Page.call(this);
	this.steps = new Array();
	this.tally = null;
	this.setLanguage();
}

GetResultPage.prototype = new Page();

GetResultPage.prototype.setLanguage = function() {
	this.steps[1] = i18n.gettext('1<sup>st</sup> Enter voting link'); 
	this.steps[2] = i18n.gettext('2<sup>nd</sup> Show the result');
	this.mainContent = i18n.gettext('<p>Enter the link of the voting for which you want to see the results<br></p>') +
	                   GetElectionConfig.getMainContent(i18n.gettext('Get voting results'), 'page', 'page.gotElectionConfig');
	this.title = i18n.gettext('Get Voting Results');
	Page.prototype.setLanguage.call(this); // this updates the steps
};

GetResultPage.prototype.display = function() {
	Page.prototype.display.call(this);
	if (typeof returnEnvelope != 'undefined') {
		this.gotElectionConfig(returnEnvelope.config);
	}
};

GetResultPage.prototype.showResult = function() {
	this.setStep(2);
	// TODO add switch (blinder)
	var blinder = new BlindedVoterElection(this.config); 
	if (typeof returnEnvelope != 'undefined') blinder.importPermission(returnEnvelope);
	// var element = document.getElementById("loadedmaincontent");
	var me = this;
	switch (this.config.tally) {
	case 'configurableTally':
		this.tally = new ConfigurableTally(blinder);
		this.tally.handleUserClickShowWinners(this.config, me, me.gotVotes);
		break;
	case 'publishOnly':
		this.tally = new PublishOnlyTally(blinder);
		this.tally.handleUserClickGetAllVotes(this.config, me, me.gotVotes);
		break;
	default: // TODO throw some error
		break;
	}

};

GetResultPage.prototype.onPermLoaded = function () { // called by blinder.importPermission which is needed in votePage
	
};

/*
function startStep4(config){
	switch (config.tally) {
	case 'publishOnly':
		showResultPublishOnlyVote(config);
		break;
	default:
			// TODO throw some error
	}
}
*/

GetResultPage.prototype.gotElectionConfig = function (config) {
	this.config = config;
	this.showResult();
};

GetResultPage.prototype.gotVotes = function (html) {
	Page.loadMainContent('<h2>' + i18n.gettext('Name of the voting: ') + this.config.electionTitle + '</h2>' + html);
};


function startLoadingResult() {
	var mc = GetElectionConfig.getMainContent('gotElectionConfigForTally');
	loadMainContent(mc);
//	currAction = 'getResult'; // this is used in order to determine what should happens after the config was loaded
}

function getAuthModuleStatic(config) {
	var a;
	switch (config.auth) {
	case 'userPassw':     a = UserPasswList;     break;
	case 'sharedPassw':   a = SharedPasswAuth;   break;
	case 'oAuth2':        a = OAuth2;            break;
	case 'externalToken': a = ExternalTokenAuth; break;
	default:
		alert(i18n.sprintf(i18n.gettext("The voting requieres authorisation module >%s< which is not supported by this client.\nUse a compatible client."), config.auth));
	}
	return a;
}
