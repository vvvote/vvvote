function ConfigurableTally(election, config, onGotVotesObj, onGotVotesMethod) {
	PublishOnlyTelly.call(this, election, config, onGotVotesObj, onGotVotesMethod);
}


ConfigurableTally.prototype = new PublishOnlyTelly();

ConfigurableTally.getMainContent = function(tallyconfig) {
	ConfigurableTally.tallyConfig = tallyconfig;
	var mc =
		'<p id="ballotName">' + tallyconfig.ballotName + '</p>';

	for (var qNo=0; qNo<tallyconfig.questions.length; qNo++) {
		mc = mc + '<div id="divVoteQuestion'+tallyconfig.questions[qNo].questionID+'">';
		mc = mc + '<p class="voteQuestion" id="voteQuestion'+tallyconfig.questions[qNo].questionID+'">' + tallyconfig.questions[qNo].questionWording + '</p>';
		switch (tallyconfig.questions[qNo].voteSystem.type) {
		case 'score':
			//if (tallyconfig.questions[qNo].voteSystem['single-step'] === true) 
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
		case 'rank':
			mc = mc + '<table class="ranking">';
			mc = mc + '	<thead>';
			mc = mc + '		<th>Rang</th>';
			mc = mc + '		<th>Option</th>';
			mc = mc + '		<th>Verschieben</th>';
			mc = mc + '</thead>';
			ConfigurableTally.questions = new Array();
			var rankingTmp = [];
			for (var optionNo=0; optionNo<tallyconfig.questions[qNo].options.length; optionNo++) {
				rankingTmp[optionNo] = optionNo;
			}
			ConfigurableTally.questions[qNo] = {"ranking": rankingTmp};
			mc = mc + '<tbody id="rankingTable' + qNo +'">' + ConfigurableTally.getRankingTableHtml(qNo) +'</tbody>';
			mc = mc + '</table>';
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

ConfigurableTally.getRankingTableHtml = function(qNo) {
	var mc ='';
	for (var optionNo=0; optionNo<ConfigurableTally.tallyConfig.questions[qNo].options.length; optionNo++) {
//		var optionID = tallyconfig.questions[qNo].options[optionNo].optionID;
		var ranking = ConfigurableTally.questions[qNo].ranking;
		mc = mc + '<div class="votingOption">'; 
		mc = mc + '<tr>';
		mc = mc + '	<td>' + (optionNo+1) + '</td>';
		mc = mc + '	<td>'+ ConfigurableTally.tallyConfig.questions[qNo].options[ranking[optionNo]].optionText + '</td>';
		mc = mc + '	<td>';
		if (optionNo > 0)                        		mc = mc + '		<span onclick="ConfigurableTally.moveUp  (' + qNo +', ' + (optionNo) + ');" class="move">&uarr;&nbsp;</span>';
		else 											mc = mc + '&nbsp;&nbsp;';
		if (optionNo < ConfigurableTally.tallyConfig.questions[qNo].options.length - 1) 	mc = mc + '		<span onclick="ConfigurableTally.moveDown(' + qNo +', ' + (optionNo) + ');" class="move">&darr;&nbsp;</span>';
		mc = mc + '</td>';
		mc = mc + '</tr>';
	}
	return mc;
};

ConfigurableTally.moveUp = function(qNo, optionIndex) {
	if (optionIndex > 0)
		ConfigurableTally.moveFromTo(qNo, optionIndex, optionIndex - 1);
};

ConfigurableTally.moveDown = function(qNo, optionIndex) {
	if (optionIndex < ConfigurableTally.tallyConfig.questions[qNo].options.length)  
		ConfigurableTally.moveFromTo(qNo, optionIndex, optionIndex + 1);
};

ConfigurableTally.moveFromTo = function(qNo, from, to) {
	if (from == to) return;
	if (from < to) {
		var beforeFrom = ConfigurableTally.questions[qNo].ranking.slice(0, from);
		var afterFrom = ConfigurableTally.questions[qNo].ranking.slice(from + 1, to +1);
		var FromElement = ConfigurableTally.questions[qNo].ranking[from];
		var afterTo = ConfigurableTally.questions[qNo].ranking.slice(to + 1);
		ConfigurableTally.questions[qNo].ranking = beforeFrom.concat(afterFrom, FromElement, afterTo);
	} else {
		var beforeTo = ConfigurableTally.questions[qNo].ranking.slice(0, to);
		var afterTo= ConfigurableTally.questions[qNo].ranking.slice(to, from);
		var moveElement = ConfigurableTally.questions[qNo].ranking[from];
		var afterFrom = ConfigurableTally.questions[qNo].ranking.slice(from + 1);
		ConfigurableTally.questions[qNo].ranking = beforeTo.concat(moveElement, afterTo, afterFrom);
	}
	var el = document.getElementById('rankingTable' +qNo);
	var tablehtml = ConfigurableTally.getRankingTableHtml(qNo);
	el.innerHTML = tablehtml;
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
						  { "optionID": 1, "optionText": "Ja, linksherum. Hier mach ich zum test mal eine richtig lange Modulbeschreibung rein.<br> Ich bin gespannt, wie die angezeigt wird als Legende für die Auswahlknöpfe. Meine Prognose ist, dass NRW das anonyme Verfahren einführen wird. Was glauben Sie, stimmt das?" },
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
						 "type": "rank",
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