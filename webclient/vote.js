function VotePage() {
	Page.call(this);
	this.steps = new Array();
	this.steps[1] = 'Schritt 1: Wahlunterlagen holen'; 
	this.steps[2] = 'Schritt 2: Autorisierung';
	this.steps[3] = 'Schritt 3: Abstimmen';
	this.mainContent = '<h3>Wahlunterlagen holen</h3>'+
	'<p><ul><li>Ich habe noch keinen Wahlschein</li>' +
	'<li>für die Wahl wird kein Wahlschein benötigt</li>' +
	'<li>Ich weiß nicht, ob für die Wahl ein Wahlschein benötigt wird</li></ul>' +
	GetElectionConfig.getMainContent('Wahlunterlagen holen', 'page', 'VotePage.gotElectionConfig') + '</p>' +
	'<p></p>&nbsp;<p></p>' +
	'<h3>Ich habe bereits einen Wahlschein</h3>' + 
	BlindedVoterElection.getPermissionHtml('page.blinder');
	this.title = 'An Abstimmung teilnehmen';
	this.blinder = {};
	this.tally = {};
	this.displayPermFileHtmlOnPhase2 = false;
	VotePage.obj = this; // set a reference to this instance so that it can be called from static methods
}

VotePage.prototype = new Page();

/*
function startVoting(load) {
		election = new BlindedVoterElection('election', permissionLoaded); // use global namespace because
		if (load) {loadMainContent(mc); }
		return mc;
	}
 */


VotePage.gotElectionConfig = function (config) { 
	config.phase = 'generatePermissions'; // TODO take phase from config
	switch (config.phase) {
	case 'generatePermissions':
		this.startStep2(config, true);
		break;
	case 'voting':
		this.startStep3(config, true);		
	}
};

VotePage.prototype.startStep2 = function (config) {
	var mc = '';
	var mclast = '';
	switch (config.blinding) {
	case 'blindedVoter':
		mc = mc + BlindedVoterElection.getStep2Html();
		mclast =  BlindedVoterElection.getStep2HtmlDetails();
		this.blinder = new BlindedVoterElection('page.election', VotePage.onPermLoaded, config);
		break;
	default:
		alert('The election requieres election module >' + config.blinding + "< which is not supported by this client.\nUse a compatible client.");
	break;			
	}

	switch (config.auth) {
	case 'userPassw':
		mc = mc + UserPasswList.getMainContent(config);
		this.tally = new UserPasswList();
		break;
	case 'sharedPassw':
		mc = mc + SharedPasswAuth.getMainContent(config);
		this.tally = new SharedPasswAuth();
		break;
	case 'oAuth2':
		mc = mc + OAuth2.getMainContent(config);
		this.tally = new OAuth2();
		break;
		
	default:
		alert('The election requieres authorisation module >' + config.auth + "< which is not supported by this client.\nUse a compatible client.");
	}
	Page.loadMainContent(mc + mclast);
	this.setStep(2);
};

/*
function permissionLoaded(ok){
	if (ok) {
		telly = new PublishOnlyTelly(election, election.config, document.getElementById('loadedmaincontent'));
		var mc = telly.getMainContent();
		mc = mc + sendVoteHtml;
		loadMainContent(mc);
		var element = document.getElementById('sendvote');
		element.disabled = !ok;
		setStep(3);
} else {
		alert('Wahlschein ungültig');
	}
}*/

VotePage.prototype.onPermLoaded = function(permok, blindingobj) {
	this.blinder = blindingobj;
	if (permok) {
		var config = {}; // TODO load this from blinder
		config.blinding = 'blindedVoter';
		config.auth = 'sharedPassw';
		config.electionId = this.blinder.config.electionId;
		
/*		this.obj.startStep2(config, false);
		// if ballot already shown --> enable it, else: show ballot
		if (this.displayPermFileHtmlOnPhase2) {} */
		this.tally = new PublishOnlyTelly(this.blinder, config, document.getElementById('loadedmaincontent'));
		var mc = this.tally.getMainContent();
		mc = mc + '<p><input disabled="disabled" id="sendvote" type="submit" '+
        'value="abstimmen!" ' + 
        'onclick="page.sendVote(event);" >';
		Page.loadMainContent(mc);
		var element = document.getElementById('sendvote');
		element.disabled = !permok;
		this.setStep(3);

	} else {
		alert('Wahlschein nicht gültig'); // TODO provide a more detailed error message
	}

};
/*
VotePage.prototype.startPublishOnlyVote = function(config, needElection) {
	var mc = '';
	if (needElection) {mc = mc + BlindedVoterElection.getPermissionHtml();}
	tally = new PublishOnlyTelly(this.blinder);
	mc = mc + tally.getMainContent();
	mc = mc + '<p><input disabled="disabled" id="sendvote" type="submit" '+
	          'value="abstimmen!" ' + 
	          'onclick="sendVote(event);" >';
    Page.loadMainContent(mc);
    this.setStep(3);
};
*/

VotePage.prototype.sendVote = function (event) {
	// alert('jetzt wird die Stimme gesendet');
	this.tally.sendVote();
};

/*
VotePage.prototype.startStep3 = function (config, needBlinder){
	switch (config.tally) {
	case 'publishOnly':
		this.startPublishOnlyVote(config, needBlinder);
		break;
	default:
			// TODO throw some error
	}
}
*/
