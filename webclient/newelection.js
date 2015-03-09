


function NewElectionPage() {
	Page.call(this);
	this.steps[1] = 'Schritt 1: Abstimmungseinstellungen festlegen'; 
	this.steps[2] = 'Schritt 2: Abstimmungslink speichern';
	var OauthHtml = '';
	for ( var curroauthconfig in ClientConfig.oAuth2Config) {
		OauthHtml  = '<input type="radio" onclick="page.setAuthMethod(\'OAuth2\',\'' + ClientConfig.oAuth2Config[curroauthconfig].serverId + '\');"     name="authMethod" id="' + ClientConfig.oAuth2Config[curroauthconfig].serverId + '">';
		OauthHtml += '<label for="' + ClientConfig.oAuth2Config[curroauthconfig].serverId +'">' + ClientConfig.oAuth2Config[curroauthconfig].serverDesc + '</label></input>';
	}
	var testHtmlml = 
		'<br><br><button onclick="ConfigurableTally.test2();">Teste Tally Config</button>';
	var test2Htmlml = 
		'<a href="https://addons.mozilla.org/firefox/downloads/latest/325576/addon-325576-latest.xpi?src=search" data-hash="sha256:96e26869e85c9fb40202078eae55218b477957ced6cfb997b07523ec2a99ffb6">Zu FireFox hinzuf&uuml;gen</a>';
	this.mainContent = newElectionHtmlPre + OauthHtml + newElectionHtmlPost + testHtmlml; // test2Htmlml; // newElectionHtmlPre and newElectionHtmlPost defined in index.html as heredoc replacement
	this.title = 'Neue Abstimmung anlegen';
	this.serverno = 0;
	this.authModule = Object();
};

NewElectionPage.prototype = new Page();

NewElectionPage.prototype.setAuthMethod = function(method, authServerId) {
	switch(method) {
	case 'sharedPassw':		this.authModule = SharedPasswAuth; 	break;
	case 'userPasswList':	this.authModule = UserPasswList;   	break;
	case 'OAuth2':		    this.authModule = OAuth2;       	break;
	case 'sharedAuth':	    this.authModule = SharedAuth;      	break;
	default:		alert('Program error 8769867'); 			break;
	}
	var html = this.authModule.getNewElectionHtml(authServerId);
	var el = document.getElementById('authInputs');
	el.innerHTML = html;
};

NewElectionPage.prototype.setQuestions = function (which) {
	var html = '';
	switch(which) {
	case 'givenTest':     this.tally = ConfigurableTally; break;
	case 'enterQuestion': this.tally = PublishOnlyTally;  break;
	}
	html= this.tally.GetEnterQuestionsHtml(); 
	var el = document.getElementById('questionInputs');
	el.innerHTML = html;
};

NewElectionPage.prototype.handleNewElectionButton = function () {
	
	// authConfig
	var tmp = this.authModule.getNewElectionData();
	ret.auth =  tmp.auth;
	ret.authData = tmp.authData;
	
	// Tally Config
	tmp = this.tally.getNewElectionData();
	ret.tally = tmp.tally;
	ret.questions = tmp.questions;
	
	var element = document.getElementById('electionId');
	ret.electionId = element.value;

	this.config = ret;
	var data = JSON.stringify(ret);
	var me = this;
	this.serverno = 0;
//	myXmlSend(ClientConfig.newElectionUrl[0], data, me, me.handleNewElectionAnswer, 'http://94.228.205.41:8080/');
	myXmlSend(ClientConfig.newElectionUrl[0], data, me, me.handleNewElectionAnswer);
};



NewElectionPage.prototype.handleNewElectionAnswer = function(xml) {
	try {
		var data = parseServerAnswer(xml, true);
		switch (data.cmd) {
		case 'saveElectionUrl':
			if (this.serverno < ClientConfig.newElectionUrl.length -1) {
				this.serverno++;
				var me = this;
				myXmlSend(ClientConfig.newElectionUrl[this.serverno], JSON.stringify(this.config), me, me.handleNewElectionAnswer);
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
			var msg = translateServerError(data.errorNo, data.errorTxt);
			alert("Server meldet Fehler: \n" + msg);
			break;
		default:
			break;
		}
	}catch (e) {
		alert('Answer from Server does not match the expected format (JSON decode error)');
	}

};
