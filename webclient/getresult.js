function GetResultPage() {
	Page.call(this);
	this.steps = new Array();
	this.steps[1] = 'Schritt 1: Abstimmungslink eingeben'; 
	this.steps[2] = 'Schritt 2: Ergebnis anzeigen';
	this.mainContent = '<p>Geben Sie den Link zu der Abstimmung ein, dessen Ergebnis Sie sehen wollen <br>' +
	                   GetElectionConfig.getMainContent('Abstimmungsergebnis holen', 'page', 'page.gotElectionConfig');
	this.title = 'Abstimmungsergebnis holen';
	this.tally = null;
}

GetResultPage.prototype = new Page();

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
	Page.loadMainContent('<h2>Name der Abstimmung: ' + this.config.electionId + '</h2>' + html);
};


function startLoadingResult() {
	var mc = GetElectionConfig.getMainContent('gotElectionConfigForTally');
	loadMainContent(mc);
	currAction = 'getResult'; // this is used in order to determine what should happens after the config was loaded
}

function getAuthModuleStatic(config) {
	var a;
	switch (config.auth) {
	case 'userPassw':     a = UserPasswList;     break;
	case 'sharedPassw':   a = SharedPasswAuth;   break;
	case 'oAuth2':        a = OAuth2;            break;
	case 'externalToken': a = ExternalTokenAuth; break;
	default:
		alert('The election requieres authorisation module >' + config.auth + "< which is not supported by this client.\nUse a compatible client.");
	}
	return a;
}
