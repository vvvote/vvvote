


function NewElectionPage() {
	Page.call(this);
	this.steps[1] = 'Schritt 1: Abstimmungseinstellungen festlegen'; 
	this.steps[2] = 'Schritt 2: Abstimmungslink speichern';
	this.mainContent = newElectionHtml; // defined in index.html as heredoc replacement
	this.title = 'Neue Abstimmung anlegen';
	this.serverno = 0;
}

NewElectionPage.prototype = new Page();


NewElectionPage.prototype.handleNewElectionButton = function () {
		var ret = {};
		var element = document.getElementById('electionId');
		ret.electionId = element.value;
		ret.authModule = 'sharedPassw'; // TODO move somethin to auth module
		ret.authData = {};
		var element = document.getElementById('givenPassword');
		ret.authData.sharedPassw = element.value;
		this.config = ret;
		var data = JSON.stringify(ret);
		var me = this;
		myXmlSend(newElectionUrl[0], data, me, me.handleNewElectionAnswer);
	};

	
	
NewElectionPage.prototype.handleNewElectionAnswer = function(xml) {
		// TODO sent newElection-request to other servers 
		var data = parseServerAnswer(xml);
		switch (data.cmd) {
		case 'saveElectionUrl':
			if (this.serverno < newElectionUrl.length -1) {
				this.serverno++;
				var me = this;
				myXmlSend(newElectionUrl[this.serverno], JSON.stringify(this.config), me, me.handleNewElectionAnswer);
			}
			var a = getAuthModuleStatic(this.config);
			var ahtml = a.getConfigObtainedHtml();
			var mc = '<p>Speichern Sie den Link und geben Sie ihn an alle Wahlberechtigten weiter. ' +
			          ahtml +	
			          '</p>' +
			          '<p>Der Link zur Wahl ist: ' + data.configUrl + '</p>';
			this.setStep(2);
			Page.loadMainContent(mc);
			break;
		case 'error':
			alert('Server meldet Fehler: ' + data.errorNo + "\n" + data.errorTxt);
			break;
		default:
			break;
		}
	};
