


function NewElectionPage() {
	Page.call(this);
	this.steps[1] = 'Schritt 1: Abstimmungseinstellungen festlegen'; 
	this.steps[2] = 'Schritt 2: Abstimmungslink speichern';
	this.mainContent = newElectionHtml; // defined in index.html as heredoc replacement
	this.title = 'Neue Abstimmung anlegen';
	this.serverno = 0;
	this.authModule = Object();
}

NewElectionPage.prototype = new Page();

NewElectionPage.prototype.setAuthMethod = function(method) {
	switch(method) {
	case 'sharedPassw':		this.authModule = SharedPasswAuth; 	break;
	case 'userPasswList':	this.authModule = UserPasswList;   	break;
	case 'BEOBayern':		this.authModule = OAuth2;       	break;
	default:		alert('Programmfehler 8769867'); 			break;
	}
	var html = this.authModule.getNewElectionHtml();
	var el = document.getElementById('authInputs');
	el.innerHTML = html;
};


NewElectionPage.prototype.handleNewElectionButton = function () {
		var ret = this.authModule.getNewElectionData();
		var element = document.getElementById('electionId');
		ret.electionId = element.value;
		this.config = ret;
		var data = JSON.stringify(ret);
		var me = this;
		this.serverno = 0;
		myXmlSend(newElectionUrl[0], data, me, me.handleNewElectionAnswer);
	};

	
	
	NewElectionPage.prototype.handleNewElectionAnswer = function(xml) {
		var data = parseServerAnswer(xml);
		switch (data.cmd) {
		case 'saveElectionUrl':
			if (this.serverno < newElectionUrl.length -1) {
				this.serverno++;
				var me = this;
				myXmlSend(newElectionUrl[this.serverno], JSON.stringify(this.config), me, me.handleNewElectionAnswer);
			} else {
				var a = getAuthModuleStatic(this.config);
				var ahtml = a.getConfigObtainedHtml();
				var mc = '<p>Speichern Sie den Link und geben Sie ihn an alle Wahlberechtigten weiter. ' +
				ahtml +	
				'</p>' +
				'<p>Der Link zur Wahl ist: <input type="text" id="electionUrl" readonly="readonly" width="100%" value="' + data.configUrl + '"></p>';
				// '<p>Der Link zur Wahl ist: ' + data.configUrl + '</p>';
				this.setStep(2);
				Page.loadMainContent(mc);
				eleUrl = document.getElementById('electionUrl');
				eleUrl.select();
			}
			break;
		case 'error': // TODO in case the errors is reported not from the first server: handle it somehow: (remove election from all previous servers?)
			alert('Server meldet Fehler: ' + data.errorNo + "\n" + data.errorTxt);
			break;
		default:
			break;
		}
	};
