


function NewElectionPage() {
	Page.call(this);
	this.setLanguage();
}

NewElectionPage.prototype = new Page();

NewElectionPage.prototype.setLanguage = function() {
	this.steps[1] = i18n.gettext('Step 1: Set voting preferences'); 
	this.steps[2] = i18n.gettext('Step 2: Save voting link');
	var OauthHtml = '';
	for ( var curroauthconfig in ClientConfig.oAuth2Config) {
		OauthHtml  = '<input type="radio" onclick="page.setAuthMethod(\'OAuth2\',\'' + ClientConfig.oAuth2Config[curroauthconfig].serverId + '\');"     name="authMethod" id="' + ClientConfig.oAuth2Config[curroauthconfig].serverId + '">';
		OauthHtml += '<label for="' + ClientConfig.oAuth2Config[curroauthconfig].serverId +'">' + ClientConfig.oAuth2Config[curroauthconfig].serverDesc + '</label></input>';
	}


	var newElectionHtmlPre = i18n.gettext(
			'Here you can create a new voting. ' + 
			'In order to do so, fill in the name of the voting and set the preferences for the authorization mechanism. ' +
	'<br><br>') + 
	'<input type="text" id="electionId">' + 
	'	<label for="electionId">' +  i18n.gettext('Name of voting') + '</label>' + 
	'<br>' +

	'<fieldset><legend>' +  i18n.gettext('Vote on') + '</legend>' +
	'<input type="radio" id="givenTest"     name="testRadioGroup" onclick="page.setQuestions(\'givenTest\')"    /> <label for="givenTest"    >' + i18n.gettext('predefined test voting items') + '</label>' +
	'<input type="radio" id="enterQuestion" name="testRadioGroup" onclick="page.setQuestions(\'enterQuestion\')"/> <label for="enterQuestion">' + i18n.gettext('Enter a question to vote on') + '</label>' +
	'</fieldset>' +
	'<div id="questionInputs">' +
	'<!--- in this div the inputs for different tallies will be inserted --->' +
	'</div>' +

	'<fieldset onload="page.setAuthMethod(\'sharedPassw\');">' +
	'	<legend>' + i18n.gettext('Autorization method') + '</legend>' +
	'	<input type="radio" onclick="page.setAuthMethod(\'sharedPassw\', null);"   name="authMethod" id="sharedPassw">' +
	'		<label for="sharedPassw">' + i18n.gettext('Voting password') + '</label>' +
	'	<input type="radio" onclick="page.setAuthMethod(\'externalToken\', null);"  name="authMethod" id="externalToken">' +
	'		<label for="externalToken">' + i18n.gettext('External token verification') + '</label>' +

	'<!---   	<input type="radio" onclick="page.setAuthMethod(\'userPasswList\', null);" name="authMethod" id="userPasswList">' +
	'		<label for="userPasswList">' + i18n.gettext('Upload a list of usernames and passwords') + '</label></input>' +
	'--->';



	var newElectionHtmlPost = 
		'</fieldset>' +
		'<br>' +
		'<div id="authInputs">' +
		'<!--- in this div the different inputs needed for the different auth methods are displayed --->' +
		'</div>' +
		'<br>' +
		'<input type="button" onclick="page.handleNewElectionButton();" value="' + i18n.gettext('Create new voting') + '">';		


	var testHtmlml = 
		'<br><br><button onclick="var r = secureRandom(16); var parser = new UAParser(); var browser = parser.getBrowser(); alert(browser.major + browser.name + browser.version +\'r: \' + r.toString(16)); PublishOnlyTally.test();">Test</button>';
	var test2Htmlml = 
		'<a href="https://addons.mozilla.org/firefox/downloads/latest/325576/addon-325576-latest.xpi?src=search" data-hash="sha256:96e26869e85c9fb40202078eae55218b477957ced6cfb997b07523ec2a99ffb6">Zu FireFox hinzuf&uuml;gen</a>';
	this.mainContent = newElectionHtmlPre + OauthHtml + newElectionHtmlPost + testHtmlml; // test2Htmlml; // newElectionHtmlPre and newElectionHtmlPost defined in index.html as heredoc replacement
	this.title = i18n.gettext('Open a new voting');
	this.serverno = 0;
	this.authModule = Object();
	Page.prototype.setLanguage.call(this)
};


NewElectionPage.prototype.setAuthMethod = function(method, authServerId) {
	switch(method) {
	case 'sharedPassw':		this.authModule = SharedPasswAuth; 	break;
	case 'userPasswList':	this.authModule = UserPasswList;   	break;
	case 'OAuth2':		    this.authModule = OAuth2;       	break;
	case 'sharedAuth':	    this.authModule = SharedAuth;      	break;
	case 'externalToken':   this.authModule = ExternalTokenAuth;break;
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
	var ret = {};
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
				var mc = '<p>' + i18n.gettext('Save the link and distribute it to all eligable people. ') +
				ahtml +	
				'</p><br><p>' +
				'<label for="electionUrl">' + i18n.gettext('This is the voting link: ') + '</label>' + 
				'<input type="text" id="electionUrl" readonly="readonly" width="100%" value="' + data.configUrl + '"></p>';
				this.setStep(2);
				Page.loadMainContent(mc);
				var eleUrl = document.getElementById('electionUrl');
				eleUrl.select();
			}
			break;
		case 'error': // TODO in case the errors is reported not from the first server: handle it somehow: (remove election from all previous servers?)
			var msg = translateServerError(data.errorNo, data.errorTxt);
			alert(i18n.gettext("Server reports error: \n") + msg);
			break;
		default:
			break;
		}
	}catch (e) {
		alert('Answer from Server does not match the expected format (JSON decode error)');
	}

};
