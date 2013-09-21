function Page() {
	this.steps= new Array();
	this.mainContent = '';
}

Page.prototype.display = function() {
	this.showSteps();
	Page.loadMainContent(this.mainContent);
	this.setStep(1);
};

// 	<li><span id="step1" class="curr">Schritt 1: Wahlunterlagen holen</span></li>
Page.prototype.showSteps = function() {
	var html = '';
	for (var i=1; i<this.steps.length; i++) { // "<" because length starts measuring at index 0
		html = html + '<li><span id="step' + i +'" class="curr">' + this.steps[i] + '</span></li>';
	}
	var element = document.getElementById('stepslist');
	element.innerHTML = html;
};

Page.prototype.setStep = function(step) {
		var element;
		for (var i=1; i<this.steps.length; i++) {
			element = document.getElementById('step' + i); // + step-1);
			if (i == step) {element.setAttribute('class', 'curr');}
			else           {element.removeAttribute('class');}
		}
		element = document.getElementById('steptitle');
		element.textContent = this.steps[step];
};

Page.loadMainContent = function (content) {
	var element = document.getElementById("loadedmaincontent");
	element.innerHTML = content; 
};
