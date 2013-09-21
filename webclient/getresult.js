function GetResultPage() {
	Page.call(this);
	this.steps = new Array();
	this.steps[1] = 'Schritt 1: Abstimmungslink eingeben'; 
	this.steps[2] = 'Schritt 2: Ergebnis anzeigen';
	this.mainContent = '<h2>Wahlunterlagen holen</h2>'+
	                   '<p>Geben Sie den Link zu der Abstimmung ein, dessen Ergebnis Sie sehen wollen <br>' +
	                   GetElectionConfig.getMainContent('page', 'page.gotElectionConfig');
	this.tally = null;
}

GetResultPage.prototype = new Page();


GetResultPage.prototype.showResult = function() {
	this.setStep(2);
	// TODO add switch (blinder)
	var blinder = new BlindedVoterElection('election', null, this.config); // use global namespace because
	
	// var element = document.getElementById("loadedmaincontent");
	var me = this;
	switch (this.config.telly) {
	case 'publishOnly':
		this.tally = new PublishOnlyTelly(blinder, this.config, me, me.gotVotes);
		break;
	default: // TODO throw some error
		break;
	}
	this.tally.handleUserClickGetAllVotes();

};
/*
function startStep4(config){
	switch (config.telly) {
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
	var mc = GetElectionConfig.getMainContent('gotElectionConfigForTelly');
	loadMainContent(mc);
	currAction = 'getResult'; // this is used in order to determine what should happen after the config was loaded
}

function getAuthModuleStatic(config) {
	var a;
	switch (config.authModule) {
	case 'userPassw':    a = UserPasswList;   break;
	case 'sharedPassw':  a = SharedPasswAuth; break;
	default:
		alert('The election requieres authorisation module >' + config.auth + "< which is not supported by this client.\nUse a compatible client.");
	}
	return a;
}
