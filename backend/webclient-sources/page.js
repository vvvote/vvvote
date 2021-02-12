function Page() {
	this.steps= new Array();
	this.mainContent = '';
	this.title = '';
	this.setLanguage();
	// document.getElementById('locale_select').onChange="page.setLanguage(this.value)";
}


Page.prototype.setLanguage = function() {
	this.menu = new Array();
	if (typeof (i18n) == 'undefined') i18n = new Jed({});
	this.ciSubHead = i18n.gettext('Online Voting:<br> anonymous and traceable');
	this.menu[1] = i18n.gettext('Open a new voting');
	this.menu[2] = i18n.gettext('Take part in a voting');
	this.menu[3] = i18n.gettext('Fetch result');
	this.stepstitle = i18n.gettext("That's how");
	this.techinfocheckboxlabel = i18n.gettext('Show explanations and technical information');
	this.aboutLinkText = i18n.gettext('About');
	this.privacyStatementText = i18n.gettext('Privacy statement');
	this.privacyStatementLink = 'javascript:aalert.openTextOk(privacy_statement[i18n.options.locale_data.messages[""].lang])';
};


Page.prototype.display = function() {
	document.getElementById('ciSubHead').innerHTML = this.ciSubHead;
	document.getElementById('newElectionLink').textContent = this.menu[1];
	document.getElementById('takepartLink').textContent    = this.menu[2];
	document.getElementById('fetchresult').textContent     = this.menu[3];
	document.getElementById('idtechinfocheckbox').textContent = this.techinfocheckboxlabel;
	document.getElementById('idstepstitle').textContent = this.stepstitle;
	document.getElementById('aboutUrlId').textContent = this.aboutLinkText;
	document.getElementById('privacyStatementId').textContent = this.privacyStatementText;
	document.getElementById('privacyStatementId').href = this.privacyStatementLink;
	this.showSteps();
	Page.loadMainContent(this.mainContent);
	this.setStep(1);
	var element = document.getElementById('pagetitle');
	element.textContent = this.title;
};

// 	<li><span id="step1" class="curr">Schritt 1: Wahlunterlagen holen</span></li>
Page.prototype.showSteps = function() {
	var html = '';
	for (var i=1; i<this.steps.length; i++) { // "<" because length starts measuring at index 0
		html = html + '<li id="stepli' + i +'"><span id="step' + i +'">' + this.steps[i] + '</span></li>';
	}
	var element = document.getElementById('stepslist');
	element.innerHTML = html;
};


/**
 * setStep removes additional tech infos
 * @param step
 */
Page.prototype.setStep = function(step) {
		var element;
		var elementli;
		for (var i=1; i<this.steps.length; i++) {
			element = document.getElementById('step' + i); // + step-1);
			elementli = document.getElementById('stepli' + i); // + step-1);
			if (i < step)  { element.setAttribute('class', 'done'); elementli.setAttribute('class', 'done'); }
			if (i == step) { element.setAttribute('class', 'curr'); elementli.setAttribute('class', 'curr'); }
			if (i > step)  { element.setAttribute('class', 'todo'); elementli.setAttribute('class', 'todo'); }
			}
		
		// element = document.getElementById('steptitle');
		// element.textContent = this.steps[step];
		Page.setAddiTechInfos('');
};

Page.loadMainContent = function (contentHtml) {
	var element = document.getElementById("loadedmaincontent");
	element.innerHTML = contentHtml; 
};

Page.loadMainContentFragm = function (contentFragm) {
	var div = document.createElement('div');
	div.setAttribute('id', 'loadedmaincontent');
	div.appendChild(contentFragm);
	var mc = document.getElementById('loadedmaincontent');
	mc.parentNode.replaceChild(div, mc);
};


Page.setAddiTechInfos = function (content) {
	var element = document.getElementById("additiontechinfos");
	element.innerHTML = content; 
};
