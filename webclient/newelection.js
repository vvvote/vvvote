


function NewElectionPage() {
	Page.call(this);
	this.steps[1] = 'Schritt 1: Abstimmungseinstellungen festlegen'; 
	this.steps[2] = 'Schritt 2: Abstimmungslink speichern';
	OauthHtml = '';
	for ( var curroauthconfig in ClientConfig.oAuth2Config) {
		OauthHtml  = '<input type="radio" onclick="page.setAuthMethod(\'OAuth2\',\'' + ClientConfig.oAuth2Config[curroauthconfig].serverId + '\');"     name="authMethod" id="' + ClientConfig.oAuth2Config[curroauthconfig].serverId + '">';
		OauthHtml += '<label for="' + ClientConfig.oAuth2Config[curroauthconfig].serverId +'">' + ClientConfig.oAuth2Config[curroauthconfig].serverDesc + '</label></input>';
	}
	var testHtmlml = 
		'<br><br><button onclick="ConfigurableTally.test();">Teste Tally Config</button>';
	this.mainContent = newElectionHtmlPre + OauthHtml + newElectionHtmlPost + testHtmlml; // newElectionHtmlPre and newElectionHtmlPost defined in index.html as heredoc replacement
	this.title = 'Neue Abstimmung anlegen';
	this.serverno = 0;
	this.authModule = Object();
}

NewElectionPage.prototype = new Page();

NewElectionPage.prototype.setAuthMethod = function(method, authServerId) {
	switch(method) {
	case 'sharedPassw':		this.authModule = SharedPasswAuth; 	break;
	case 'userPasswList':	this.authModule = UserPasswList;   	break;
	case 'OAuth2':		    this.authModule = OAuth2;       	break;
	default:		alert('Program error 8769867'); 			break;
	}
	var html = this.authModule.getNewElectionHtml(authServerId);
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
		myXmlSend(ClientConfig.newElectionUrl[0], data, me, me.handleNewElectionAnswer);
	};

	
	
	NewElectionPage.prototype.handleNewElectionAnswer = function(xml) {
		try {
			var data = parseServerAnswer(xml);
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
