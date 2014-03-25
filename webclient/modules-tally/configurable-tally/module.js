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
			mc = mc +'<div id="FirstStepQ'+qNo+'">';
			//if (tallyconfig.questions[qNo].voteSystem['single-step'] === true)
			if (tallyconfig.questions[qNo].voteSystem.steps.indexOf('yesNo' >= 0)) {
				for (var optionNo=0; optionNo<tallyconfig.questions[qNo].options.length; optionNo++) {
					var optionID = tallyconfig.questions[qNo].options[optionNo].optionID;
					mc = mc + '<p class="votingOption">' +
					'<fieldset>' +
					'<legend>' + tallyconfig.questions[qNo].options[optionNo].optionText + '</legend>'+
					'<input type="radio" name="optionQ'+qNo+'O'+optionID+'" id="optionQ'+qNo+'O'+optionID+'Y" value="Y">' +
					'                                      <label          for="optionQ'+qNo+'O'+optionID+'Y">Ja</label>' +
					'<input type="radio" name="optionQ'+qNo+'O'+optionID+'" id="optionQ'+qNo+'O'+optionID+'N" value="N">' +
					' <label                                               for="optionQ'+qNo+'O'+optionID+'N">Nein</label>';
					// '<input type="radio" name="optionQ'+qNo+'O'+optionID+'" id="optionQ'+qNo+'O'+optionID+'E" value="E" checked="checked">';
					// ' <label                                                             for="optionQ'+qNo+'O'+optionID+'A">Enthaltung</label>';
					if (tallyconfig.questions[qNo].voteSystem.abstention) {
						mc = mc + '<input type="radio" name="optionQ'+qNo+'O'+optionID+'" id="optionQ'+qNo+'O'+optionID+'A" value="A" checked="checked">' +
						' <label                                                for="optionQ'+qNo+'O'+optionID+'A">Einhaltung</label>';
					}
					mc = mc + '</fieldset>' + '</p>';
				}
			}
			if (tallyconfig.questions[qNo].voteSystem.steps.indexOf('yesNo') >= 0 && tallyconfig.questions[qNo].voteSystem.steps.indexOf('score') >= 0) {
				mc = mc + '<button id="button2ndStepQ"'+tallyconfig.questions[qNo].questionID+'" onclick="ConfigurableTally.buttonStep('+qNo+', true);" >Weiter</button>';
			}
			mc = mc + '</div>';
			if (tallyconfig.questions[qNo].voteSystem.steps.indexOf('score') >= 0) {
				mc = mc +'<div id="SecondStepQ'+qNo+'" style="display:none">';
				mc = mc + '<table class="voteOptions">';
				mc = mc + '<thead>';
				mc = mc + '<tr><th scope="col" rowspan="2">Option</th>';
				mc = mc + '<th scope="col" rowspan="2">enthalten</th>';
				mc = mc + '<th scope="col" colspan="3">bewerten </th></tr>';
				mc = mc + '<tr><th style="text-align:left;">sehr schlecht</th><th style="text-align:center;">mittel</th><th style="text-align:right;">sehr gut</th></tr>';
				mc = mc + '</thead><tbody>';
				for (var optionNo=0; optionNo<tallyconfig.questions[qNo].options.length; optionNo++) {
					var optionID = tallyconfig.questions[qNo].options[optionNo].optionID;
					var min = tallyconfig.questions[qNo].voteSystem['min-score'];
					var max = tallyconfig.questions[qNo].voteSystem['max-score'];
					mc = mc +
					'<tr>' +
					'	<td scope="row"><label for="optionRQ'+qNo+'O'+optionNo+'">' + tallyconfig.questions[qNo].options[optionNo].optionText + '</label></td>' +
					'	<td style="text-align:center;"><input type="checkbox" name="optionScore'+optionNo+'" id="optionRAQ'+qNo+'O'+optionNo+'" checked="checked" onclick="ConfigurableTally.onScoreAbstentionClick('+qNo+', '+optionNo+');"></td>' +
//					' <label for="optionRAQ'+qNo+'O'+optionNo+'">Enthaltung</label>&emsp;'+
					'	<td colspan="3" style="text-align:center;"><input style="width:100%;" type="range" name="optionScore'+optionNo+'" id="optionRQ'+qNo+'O'+optionNo+'" value="0" min="'+min+'" max="'+max+'" class="likeDisabled" onmousedown="ConfigurableTally.onScoreRangeClick('+qNo+', '+optionNo+');"></td>' +
					'</tr>';
				}
				mc = mc + '</tbody></table>';
				if (tallyconfig.questions[qNo].voteSystem.steps.indexOf('yesNo') >= 0) {
					mc = mc + '<button id="button1stStepQ"'+tallyconfig.questions[qNo].questionID+'" onclick="ConfigurableTally.buttonStep('+qNo+', false);">Zur&uuml;ck</button>';
				}
				mc = mc + '</div>';
			}

			break;
		case 'rank':
			mc = mc + '<table class="voteOptions">';
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
		else 	mc = mc + '<button id="buttonNextQ'+qNo+'" onclick="ConfigurableTally.showQuestion(' +(qNo+1)+');">N&auml;chste Frage</button>';
		mc = mc + '</div>'; // end div question
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
		mc = mc + '	<tr class="votingOption">';
		mc = mc + '		<td class="rankNo">' + (optionNo+1) + '</td>';
		mc = mc + '		<td id="optionQ'+qNo+'O'+optionNo+'" class="votingOptionText" draggable="true" ondrop="ConfigurableTally.drop(event, '+qNo+', '+optionNo+');" ondragover="ConfigurableTally.dragOver(event, '+qNo+', '+optionNo+');" ondragstart="ConfigurableTally.dragStart(event, '+qNo+', '+optionNo+');">'+ ConfigurableTally.tallyConfig.questions[qNo].options[ranking[optionNo]].optionText + '</td>';
		mc = mc + '		<td class="moveRank">';
		if (optionNo > 0)                        		mc = mc + '<a href="javascript:ConfigurableTally.moveUp  (' + qNo +', ' + (optionNo) + ');" >&nbsp;&uarr;&nbsp;</a>';
		else 											mc = mc + '&nbsp;&nbsp;&nbsp;';
		mc = mc + ' ';
		if (optionNo < ConfigurableTally.tallyConfig.questions[qNo].options.length - 1) 	mc = mc + '		<a href="javascript:ConfigurableTally.moveDown(' + qNo +', ' + (optionNo) + ');" >&nbsp;&darr;&nbsp;</a>';
		else 																				mc = mc + '&nbsp;&nbsp;&nbsp;'; 
		mc = mc + '		</td>';
		mc = mc + '	</tr>';
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


ConfigurableTally.dragOver = function (ev, qNo, optNo) {
	ev.preventDefault();
	// ConfigurableTally.drop(ev, qNo, optNo);
};

ConfigurableTally.dragStart = function (ev, qNo, optNo) {
	ev.dataTransfer.effectAllowed = 'move';
	// ev.dataTransfer.setData("Text", ev.target.id);
	var transobj = {"qNo": qNo, "optNo": optNo};
	var transstr = JSON.stringify(transobj);
	ev.dataTransfer.setData("Text", transstr);
	ConfigurableTally.transObj = transobj;
	// ev.dataTransfer.setData("optNo", optNo.toString());
};

ConfigurableTally.drop = function (ev, qNo, optNo) {
	ev.preventDefault();
	// var data=ev.dataTransfer.getData("Text");
	// ev.target.appendChild(document.getElementById(data));
//	var transobj = JSON.parse(ev.dataTransfer.getData('Text')); 
	var transobj = ConfigurableTally.transObj;
	var fromQNo = transobj.qNo;
	var fromOptNo = transobj.optNo;
	if (qNo != fromQNo) return;
	ConfigurableTally.moveFromTo(qNo, fromOptNo, optNo);
};


ConfigurableTally.onScoreAbstentionClick = function(qNo, optionNo) {
	var checkbox = document.getElementById('optionRAQ'+qNo+'O'+optionNo);
	var range = document.getElementById('optionRQ'+qNo+'O'+optionNo);
	if (checkbox.checked) 	range.className = 'likeDisabled';
	else 					range.className = '';
};

ConfigurableTally.onScoreRangeClick = function(qNo, optionNo) {
	var checkbox = document.getElementById('optionRAQ'+qNo+'O'+optionNo);
	checkbox.checked = false;
	ConfigurableTally.onScoreAbstentionClick(qNo, optionNo); 
};


ConfigurableTally.buttonStep = function(qNo, forward) {
	var firstStep = document.getElementById('FirstStepQ'+qNo);
	var secondStep = document.getElementById('SecondStepQ'+qNo);
	if (forward)  	{ firstStep.style.display = 'none'; 	secondStep.style.display = ''; 		}
	else 			{ firstStep.style.display = ''; 		secondStep.style.display = 'none'; 	}
};

ConfigurableTally.getInputs = function() {
	
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
						 "min-score": -3,
						 "max-score": 3,
						 "abstention": true,
						 "steps": "yesNo score"
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
					 "questionWording":"Drehen wir uns im Kreis?",
					 "voteSystem":
					 {
						 "type": "score",
						 "max-score": 3,
						 "min-score": -3,
						 "abstention": true,
						 "steps": "yesNo"
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
					 "questionID":3,
					 "questionWording":"Bringen uns Schuldzuweisungen irgendwas?",
					 "voteSystem":
					 {
						 "type": "rank",
						 "max-score": 1,
						 "abstention": false,
						 "steps": ""
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
							   { "referenceName":"piff paff puff kappotschießen", "referenceAddress":"https://twitter.com/czossi/status/436217916803911680/photo/1" }
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