function ConfigurableTally(election, config, onGotVotesObj, onGotVotesMethod) {
	PublishOnlyTelly.call(this, election, config, onGotVotesObj, onGotVotesMethod);
}


ConfigurableTally.prototype = new PublishOnlyTelly();

ConfigurableTally.getMainContent = function(tallyconfig) {
	var mc =
		'<p id="ballotName">' + tallyconfig.ballotName + '</p>';

	for (var qNo=0; qNo<tallyconfig.questions.length; qNo++) {
		mc = mc + '<div id="divVoteQuestion'+tallyconfig.questions[qNo].questionID+'">';
		mc = mc + '<p class="voteQuestion" id="voteQuestion'+tallyconfig.questions[qNo].questionID+'">' + tallyconfig.questions[qNo].questionWording + '</p>';
		switch (tallyconfig.questions[qNo].voteSystem.type) {
		case 'score':
			if (tallyconfig.questions[qNo].voteSystem['single-step'] === true) 
			for (var optionNo=0; optionNo<tallyconfig.questions[qNo].options.length; optionNo++) {
				var optionID = tallyconfig.questions[qNo].options[optionNo].optionID;
				mc = mc + '<p class="votingOption">' +
				'<fieldset>' +
				'<legend>' + tallyconfig.questions[qNo].options[optionNo].optionText + '</legend>'+
				'<input type="radio" name="option'+optionID+'" id="option'+optionID+'Y" value="Y">' +
				'                                      <label for="option'+optionID+'Y">Ja</label>' +
				'<input type="radio" name="option'+optionID+'" id="option'+optionID+'N" value="N">' +
				' <label                                      for="option'+optionID+'N">Nein</label>' +
				'<input type="radio" name="option'+optionID+'" id="option'+optionID+'E" value="E" checked="checked">' +
				' <label                                      for="option'+optionID+'E">Enthaltung</label>';
				if (tallyconfig.questions[qNo].voteSystem.abstention) {
					mc = mc + '<input type="radio" name="option'+optionID+'" id="option'+optionID+'A" value="A" checked="checked">' +
					' <label                                                for="option'+optionID+'A">keine Teilnahme</label>';
				}
				mc = mc + '</fieldset>' + '</p>';
			}
			if (!tallyconfig.questions[qNo].voteSystem['single-step'] === true) {
				mc = mc + '<button id="button2ndStepQ"'+tallyconfig.questions[qNo].questionID+'">Weiter</button>';
				for (var optionNo=0; optionNo<tallyconfig.options.length; optionNo++) {
					var optionID = tallyconfig.options[optionNo].optionID;
					mc = mc +
					'<input type="text" name="optionScore'+option+'" id="option'+optionID+'Y" value="Y">' +
					' <label for="optionScore'+optionID+'">' + tallyconfig.options[optionNo].optionText + '</label>';
				}
			}
			break;
		default: 
			alert('Client unterstützt das Abstimmsystem >' + tallyconfig.voteSystem.type + '< nicht');
		}
		if (qNo>0) {
			mc = mc + '<button id="buttonPrevQ'+qNo+'" onclick="ConfigurableTally.showQuestion(' +(qNo-1)+')">Vorhergehende Frage</button>';
		}
		if (qNo == tallyconfig.questions.length-1)
				mc = mc + '<button id="buttonNextQ'+qNo+'" onclick="ConfigurableTally.submitVote()">Abstimmen!</button>';
		else 	mc = mc + '<button id="buttonNextQ'+qNo+'" onclick="ConfigurableTally.showQuestion(' +(qNo+1)+')">N&auml;chste Frage</button>';
		mc = mc + '</div>';
	}
	ConfigurableTally.tallyConfig = tallyconfig;
	return mc;
};

ConfigurableTally.showQuestion = function(showqNo) {
	tallyconfig = ConfigurableTally.tallyConfig;
	for (var qNo=0; qNo<tallyconfig.questions.length; qNo++) {
		var el = document.getElementById('divVoteQuestion'+tallyconfig.questions[qNo].questionID);
		if (qNo == showqNo)	el.style.display = '';
		else       			el.style.display = 'none';
	}
};

ConfigurableTally.test = function() {
	var tallyConfig = 
	{
			"ballotID":"GTVsdffgsdwt40QXffsd452re",
			"votingStart": "2014-02-10T21:20:00Z", 
			"votingEnd": "2014-03-04T00:00:00Z",
			"access":
			{
				"listID": "DEADBEEF",
				"groups": [ 1,2,3] 
			},     
			"ballotName": "Galgenhumor",
			"questions":
				[
				 {
					 "questionID":1,
					 "questionWording":"Drehen wir uns im Kreis?",
					 "voteSystem":
					 {
						 "type": "score",
						 "max-score": 1,
						 "abstention": true,
						 "single-step": true
					 },
					 "options":
						 [
						  { "optionID": 1, "optionText": "Ja, linksherum" },
						  { "optionID": 2, "optionText": "Ja, rechtsherum" },
						  { "optionID": 3, "optionText": "Nein. Ab durch die Mitte!" },
						  { "optionID": 4, "optionText": "Jein. Wir drehen durch." }
						  ],
						  "references":
							  [
							   { "referenceName":"Abschlussparty und Auflösung", "referenceAddress":"https://lqfb.piratenpartei.de/lf/initiative/show/5789.html" },
							   { "referenceName":"Bilder zur Motivation","referenceAddress":"https://startpage.com/do/search?cat=pics&cmd=process_search&language=deutsch&query=cat+content" }
							   ]
				 },
				 {
					 "questionID":2,
					 "questionWording":"Bringen uns Schuldzuweisungen irgendwas?",
					 "voteSystem":
					 {
						 "type": "score",
						 "max-score": 1,
						 "abstention": false,
						 "single-step": true
					 },
					 "options":
						 [
						  { "optionID":1, "optionText": "Ja. Befriedigung! Ha!"},
						  { "optionID":2, "optionText": "Ja. Streit und Ärger."},
						  { "optionID":3, "optionText": "nö, aber wir machen's dennoch" },
						  { "optionID":4, "optionText": "Huch? Das macht noch jemand?" }
						  ],
						  "references":
							  [                
							   { "referenceName":"piff paff puff kappotschießen", "referenceAddress":"https://twitter.com/czossi/status/436217916803911680/photo/1" },
							   ]
				 }
				 ],
				 "references":
					 [
					  {"referenceName":"Piratenpartei","referenceAddress":"https://piratenpartei.de/"}
					  ]
	};

	var mc = ConfigurableTally.getMainContent(tallyConfig);
	Page.loadMainContent(mc);
	ConfigurableTally.showQuestion(0);
};