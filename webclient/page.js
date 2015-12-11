function Page() {
	this.steps= new Array();
	this.mainContent = '';
	this.title = '';
}

Page.prototype.display = function() {
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
		html = html + '<li id="stepli' + i +'"><span id="step' + i +'" class="curr">' + this.steps[i] + '</span></li>';
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
		for (var i=1; i<this.steps.length; i++) {
			element = document.getElementById('step' + i); // + step-1);
			elementli = document.getElementById('stepli' + i); // + step-1);
			if (i < step)  { element.setAttribute('class', 'done'); elementli.setAttribute('class', 'done'); }
			if (i == step) { element.setAttribute('class', 'curr'); elementli.setAttribute('class', 'curr'); }
			if (i > step)  { element.setAttribute('class', 'todo'); elementli.setAttribute('class', 'todo'); }
			}
		
		element = document.getElementById('steptitle');
		element.textContent = this.steps[step];
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
