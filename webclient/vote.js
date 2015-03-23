function VotePage() {
	Page.call(this);
	this.steps = new Array();
	this.steps[1] = 'Schritt 1: Wahlunterlagen holen'; 
	this.steps[2] = 'Schritt 2: Autorisierung';
	this.steps[3] = 'Schritt 3: Abstimmen';
	this.mainContent = '<h3>Wahlunterlagen holen</h3>'+
	'<p><ul><li>Ich habe noch keinen Wahlschein</li>' +
	'<li>f&uuml;r die Wahl wird kein Wahlschein ben&ouml;tigt</li>' +
	'<li>Ich wei&szlig; nicht, ob f&uuml;r die Wahl ein Wahlschein ben&ouml;tigt wird</li></ul>' +
	GetElectionConfig.getMainContent('Wahlunterlagen holen', 'page', 'VotePage.prototype.gotElectionConfig') + '</p>' + 
	'<p></p>&nbsp;<p></p>' +
	'<h3>Ich habe bereits einen Wahlschein</h3>' + 
	BlindedVoterElection.loadReturnEnvelopeHtml('page.blinder');
	this.title = 'An Abstimmung teilnehmen';
	this.reset();
	VotePage.obj = this; // set a reference to this instance so that it can be called from static methods
}


VotePage.prototype = new Page();

VotePage.prototype.reset = function() {
	this.config = {};
	this.blinder = {};
	this.tally = {};
	this.authModule = {};
	this.displayPermFileHtmlOnPhase2 = false;
	this.authFailed = false;
};

VotePage.prototype.display = function() {
	this.reset();
	Page.prototype.display.call(this);
	if (typeof returnEnvelope != 'undefined') {
		BlindedVoterElection.onImportPermission(returnEnvelope);
		// this.gotElectionConfig(returnEnvelope.config);
	}

};


/*
function startVoting(load) {
		election = new BlindedVoterElection('election', permissionLoaded); // use global namespace because
		if (load) {loadMainContent(mc); }
		return mc;
	}
 */


VotePage.prototype.gotElectionConfig = function (config) { 
	this.config = config; 
	config.phase = 'generatePermissions'; // TODO take phase from config
	switch (config.phase) {
	case 'generatePermissions':
		this.startStep2(config);
		break;
	case 'voting':
		this.startStep3(config, true);		
	}
};

VotePage.prototype.startStep2 = function (config) {
	var mc = '';
	var techinfo = '';
	switch (config.blinding) {
	case 'blindedVoter':
		mc = mc + BlindedVoterElection.getStep2Html();
		techinfo =  BlindedVoterElection.getStep2HtmlDetails();
		this.blinder = new BlindedVoterElection(config);
		break;
	default:
		alert('The election requieres election module >' + config.blinding + "< which is not supported by this client.\nUse a compatible client.");
	break;			
	}
	
	mc = mc + '<div id="auth">' +
	'<form onsubmit="return false;">' +
	'                       <br>' +
	'						<h3><label for="electionId">Name der Abstimmung:</label> ' +
	'                            <span id="electionId">' + config.electionId + '</span></h3>'+		
//	'						<label for="electionId">Name der Abstimmung:</label> ' +
//  '                            <input readonly="readonly" name="electionId" id="electionId" value="' + config.electionId + '">' + // TODO use element.settext for election (instead of escaping electionId) 
    '                            <input type="hidden" readonly="readonly" name="electionId" id="electionId" value="' + config.electionId + '">' + // TODO use element.settext for election (instead of escaping electionId) 
    '                       <br>';


	switch (config.auth) {
	case 'userPassw':
		mc = mc + UserPasswList.getMainContent(config);
		this.authModule = new UserPasswList();
		break;
	case 'sharedPassw':
		mc = mc + SharedPasswAuth.getMainContent(config);
		this.authModule = new SharedPasswAuth();
		break;
	case 'oAuth2':
		mc = mc + OAuth2.getMainContent(config);
		this.authModule = new OAuth2(config.authConfig);
		break;
		
	default:
		alert('The election requieres authorisation module >' + config.auth + "< which is not supported by this client.\nUse a compatible client.");
	}
	var showGenerateButton = '""';
	if (this.authModule.hasSubSteps) showGenerateButton = '"display:none;"';
	mc = mc + // TODO take this or some part of it from blinder module
	'<div id="substepL" style=' +showGenerateButton + '>' +
	'						<label for="reqPermiss"></label> ' +
	'						     <input type="submit" name="reqPermiss" id="reqPermiss" ' +
	'							  value="Wahlschein erzeugen und speichern" onclick="page.onGetPermClick();">' +
    '                       <br>' +
    '</div>' +
    '</form>' +
    '</div>';

	this.setStep(2); // setStep deletes additional tech infos
	Page.loadMainContent(mc);
	Page.setAddiTechInfos(techinfo);
};

VotePage.prototype.onGetPermClick = function () { 
	this.blinder.onGetPermClick(this.authModule, this.authFailed);
};

VotePage.prototype.onAuthFailed = function(curServer) {
	this.authFailed = true;
	this.authModule.onAuthFailed(curServer);
};


VotePage.prototype.onPermGenerated = function() {
	this.setStep(3);
	var mc = this.blinder.getPermGeneratedHtml();
	Page.loadMainContent(mc);
	
};



VotePage.prototype.onPermLoaded = function(permok, blindingobj, config, returnEnvelopeLStorageId) {
	this.blinder = blindingobj;
	if (permok) {
		switch (config.tally) {
		case 'publishOnly': 
			this.tally = new PublishOnlyTally(this.blinder, config);
			break;
		case 'configurableTally':
			this.tally = new ConfigurableTally(this.blinder, config);
			break;
		default:
			alert('Abstimmunsmodus /' + config.tally + '/ wird vom Client nicht unterstützt');
		}
		var fragm = this.tally.getMainContentFragm(config);
		Page.loadMainContentFragm(fragm);
		this.tally.onPermissionLoaded(returnEnvelopeLStorageId); 
//		var element = document.getElementById('sendvote');
//		element.disabled = !permok;
		this.setStep(3);

	} else {
		alert('Wahlschein nicht gültig'); // TODO provide a more detailed error message
	}

};

VotePage.prototype.sendVote = function (event) {
	// alert('jetzt wird die Stimme gesendet');
	this.tally.sendVote(event);
};
