function ConfigurableTally(blinder, config) {
	PublishOnlyTally.call(this, blinder, config);
}


ConfigurableTally.prototype = new PublishOnlyTally();

ConfigurableTally.prototype.getMainContentFragm = function(tallyconfig) {
	ConfigurableTally.tallyConfig = tallyconfig;
	var fragm =	document.createDocumentFragment();
	var elp = document.createElement('h1');
	elp.appendChild(document.createTextNode(tallyconfig.electionId));
	elp.setAttribute('id', 'ballotName');
	fragm.appendChild(elp);
	//mc = mc + '<div id="divVoteQuestions">';
	var divNode = document.createElement('div');
	divNode.setAttribute('id', 'divVoteQuestions');

	var table = Array([tallyconfig.questions.length *2 +1]);
	//var table = [3][3];
	table[0] = ['Antragsgruppe', 'Antragstitel', 'Aktion'];
	for (var qNo=0; qNo<tallyconfig.questions.length; qNo++) {
		table[qNo * 2 + 1] = Array(3);
		table[qNo * 2 + 1][0] = {'content' : document.createTextNode(tallyconfig.questions[qNo].questionID)};
		table[qNo * 2 + 1][1] = {'content' : wikiSyntax2DOMFrag(tallyconfig.questions[qNo].questionWording)};

		var elp = document.createElement('button');
		elp.setAttribute('id'	  , 'buttonShowQid'+qNo);
		elp.setAttribute('onclick', 'ConfigurableTally.showQuestion(' +qNo+')');
		var elp2 = document.createTextNode('Anzeigen');
		elp.appendChild(elp2);
		table[qNo * 2 + 1][2] = {'content' : elp};

		table[qNo * 2 + 2] = Array(1);
		var fragm2 = document.createDocumentFragment();
		ConfigurableTally.getDOM1Election(tallyconfig, qNo, fragm2);
		table[qNo * 2 + 2][0] = {'content' : fragm2, 'attrib': [{'name': 'colspan', 'value':'3'}]};
	}

	var electionsListDOM = makeTableDOM(table);
	fragm.appendChild(electionsListDOM);

	var fragm2 = wikiSyntax2DOMFrag("= Ziele meiner politischen Arbeit =\n\
			== Wirtschaft ==\n\
			* Mehr Transparenz, mehr Möglichkeiten für die Bürger, sich an politischen Entscheidungsprozessen zu beteiligen; barrierefreie Politik\n\
			* Der Mensch muss im Mittelpunkt der Politik stehen: Auch Wirtschaftspolitik ist für den Menschen da, nicht für die Unternehmen. Die Unternehmen sind aber Mittel zu dem Zweck, Wohlstand für die Menschen zu schaffen.\n\
			* Die Politik muss den Bürgern reinen Wein einschenken: Wenn mehr Ausgaben gefordert werden, muss auch klar gesagt werden, wo das Geld dafür herkommen soll.\n\
			* Sachorientierung in der Politik.\n\
			\n\
			= Wiki-Syntax-Tests =\n\
			* Aufzählung\n\
			Text ohne Leerzeile nach der Aufzählung\n\
			\n\
			Noch ''Ein kursiver''' Text, der hier endet.\n\
			normal '''''fett und kursiv''''' normal\n\
			\n\
			Neuer '''Absatz fett ''kursiv und fett''' nur kursiv'' und dies ist '''fetter Text\n\
			mit einem Zeilen'''umbruch\n\
			\n\
			kjh kjn <s>jhjh\n\
			jlkh</s>nicht mehr\n\
			\n\
			normal <s>durchgestrichen '''+fett</s>nicht mehr durchgestrichen'''Normal\n\
			\n\
			normal'''''fett+kursiv''nicht mehr kursiv'''normal\n\
			\n\
			normal''kursiv'''+fett''nicht mehr kursiv'''normal\n\
			\n\
			normal <s>durchgestrichen '''''+fett+kursiv</s>nicht mehr durchgestrichen''Nicht mehr kursiv'''Normal\n\
			\n\
			normal<u>unterst\n\
			richen</u>normal\n\
			\n\
			normal<u>unterst\n\
			\n\
	richen</u>normal		");

	// document.getElementById('maincontent').appendChild(fragm);
	// document.getElementById('maincontent').appendChild(fragm2);
	return fragm;
};

//TODO it is not pretty to have it completely static?
ConfigurableTally.getDOM1Election = function(tallyconfig, qNo, fragm) {
	var divQNode = document.createElement('div');
	divQNode.setAttribute('id', 'divVoteQuestion'+qNo);
	divQNode.setAttribute('class', 'voteQuestion');

	for (var optionNo=0; optionNo < tallyconfig.questions[qNo].options.length; optionNo++) {
		var optionFieldSet = document.createElement('fieldset');
		var legendNode = ConfigurableTally.getOptionTextFragm(tallyconfig.questions[qNo].options[optionNo], qNo, optionNo);
		optionFieldSet.appendChild(legendNode);
		for (var schemetypeindex = 0; schemetypeindex < tallyconfig.questions[qNo].tallyData.scheme.length; schemetypeindex++) {
			var fieldSetNode = document.createElement('fieldset');
			var legendNode = document.createElement('legend');
			fieldSetNode.appendChild(legendNode);
			var curScheme = tallyconfig.questions[qNo].tallyData.scheme[schemetypeindex];
			legendNode.setAttribute('class', curScheme.name);
			switch (curScheme.name) {
			case 'yesNo':
				legendNode.appendChild(document.createTextNode('Zustimmung'));
				radioBtnDOM('optionQ'+qNo+'O'+optionNo+'Y', 'optionQ'+qNo+'O'+optionNo+"YesNo", 'Ja'        , '1', fieldSetNode, 'yesNoRadio');
				var noBtn = radioBtnDOM('optionQ'+qNo+'O'+optionNo+'N', 'optionQ'+qNo+'O'+optionNo+"YesNo", 'Nein'      , '0', fieldSetNode, 'yesNoRadio');
				if (curScheme.abstention) {
					var rBtn = radioBtnDOM('optionQ'+qNo+'O'+optionNo+'A', 'optionQ'+qNo+'O'+optionNo+"YesNo", 'Enthaltung', '-1', fieldSetNode, 'yesNoRadio');
					rBtn.setAttribute('checked', 'checked');
				} else {
					noBtn.setAttribute('checked', 'checked');
				}
				break;
			case 'score':
				legendNode.appendChild(document.createTextNode('Bewertungspunkte'));
				for (var score = curScheme.minScore; score <= curScheme.maxScore; score++) {
					var rBtn = radioBtnDOM('optionQ'+qNo+'O'+optionNo+'S'+score, 'optionQ'+qNo+'O'+optionNo+'Score', score.toString(), score.toString(), fieldSetNode, 'scoreRadio');
					if (score == curScheme.minScore) rBtn.setAttribute('checked', 'checked');
				}
				break;
			default: 
				alert('Client unterstützt das Abstimmschema >' + curScheme.name + '< nicht');
			}
			optionFieldSet.setAttribute('class', 'optionFieldSet');
			optionFieldSet.appendChild(fieldSetNode);
		}
		divQNode.appendChild(optionFieldSet);
	}
	var divSendVote = document.createElement('div');
	divSendVote.setAttribute('class', 'sendVote');
	buttonDOM('buttonSendQ'+qNo, 'Stimme senden', 'page.sendVote('+qNo+')', divSendVote, 'sendVoteButton');
	divQNode.appendChild(divSendVote);
	var divQNodeContainer = document.createElement('div');
	divQNodeContainer.setAttribute('id', 'divVoteQuestionContainer'+qNo);
	divQNodeContainer.appendChild(divQNode);
	fragm.appendChild(divQNodeContainer);
	return '';
};


ConfigurableTally.getOptionTextFragm = function(curOption, qNo, optionNo) {
//	var divFirstQNode = document.createElement('div');
//	divFirstQNode.setAttribute('id', 'FirstStepQ'+qNo);
	var legendNode = document.createElement('legend');
	legendNode.setAttribute('class', 'votingOption');
	if ('optionTitle' in curOption) {
		var pTitleNode = document.createElement('h1');
		pTitleNode.appendChild(document.createTextNode(curOption.optionTitle));
		legendNode.appendChild(pTitleNode);
	}
	if ('optionDesc' in curOption) {
		buttonDOM('buttonQTid'+qNo, 'Antragstext', 'ConfigurableTally.showOptionDetail("divVoteQuestionDescQ", ' +qNo+', '+optionNo+')', legendNode);
		var divOptionDescNode = document.createElement('div');
		divOptionDescNode.setAttribute('id', 'divVoteQuestionDescQ' + qNo + 'O' + optionNo);
		divOptionDescNode.setAttribute('style', 'display:none');
		var optionDescNode = wikiSyntax2DOMFrag(curOption.optionDesc);
		divOptionDescNode.appendChild(optionDescNode);
		legendNode.appendChild(divOptionDescNode);
	}
	if ('shortDesc' in curOption) {
		buttonDOM('buttonQSDid'+qNo, 'Zusammenfassung', 'ConfigurableTally.showOptionDetail("QuestionShortDescQ", ' +qNo+', '+optionNo+')', legendNode);
		var divOptionDescNode = document.createElement('div');
		divOptionDescNode.setAttribute('id', 'QuestionShortDescQ' + qNo + 'O' + optionNo);
		divOptionDescNode.setAttribute('style', 'display:none');
		var optionDescNode = wikiSyntax2DOMFrag(curOption.shortDesc);
		divOptionDescNode.appendChild(optionDescNode);
		legendNode.appendChild(divOptionDescNode);
	}
	if ('reasons' in curOption) {
		buttonDOM('buttonQRid'+qNo, 'Begründung', 'ConfigurableTally.showOptionDetail("QuestionReasonQ", ' +qNo+', '+optionNo+')', legendNode);
		var divOptionDescNode = document.createElement('div');
		var optionDescNode = wikiSyntax2DOMFrag(curOption.reasons);
		divOptionDescNode.setAttribute('id', 'QuestionReasonQ' + qNo + 'O' + optionNo);
		divOptionDescNode.setAttribute('style', 'display:none');
		divOptionDescNode.appendChild(optionDescNode);
		legendNode.appendChild(divOptionDescNode);
	}
	return legendNode;
	/*	fieldSetNode.appendChild(legendNode);
	pNode.appendChild(fieldSetNode);
	divQNode.appendChild(pNode);
	/*
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
						'	<td scope="row"><label for="optionRQ'+qNo+'O'+optionNo+'">' + tallyconfig.questions[qNo].options[optionNo].optionTitle + '</label></td>' +
						'	<td style="text-align:center;"><input type="checkbox" name="optionScore'+optionNo+'" id="optionRAQ'+qNo+'O'+optionNo+'" checked="checked" onclick="ConfigurableTally.onScoreAbstentionClick('+qNo+', '+optionNo+');"></td>' +
//						' <label for="optionRAQ'+qNo+'O'+optionNo+'">Enthaltung</label>&emsp;'+
						'	<td colspan="3" style="text-align:center;"><input style="width:100%;" type="range" name="optionScore'+optionNo+'" id="optionRQ'+qNo+'O'+optionNo+'" value="0" min="'+min+'" max="'+max+'" class="likeDisabled" onmousedown="ConfigurableTally.onScoreRangeClick('+qNo+', '+optionNo+');"></td>' +
						'</tr>';
					}
					mc = mc + '</tbody></table>';
					if (tallyconfig.questions[qNo].voteSystem.steps.indexOf('yesNo') >= 0) {
						mc = mc + '<button id="button1stStepQ"'+tallyconfig.questions[qNo].questionID+'" onclick="ConfigurableTally.buttonStep('+qNo+', false);">Zur&uuml;ck</button>';
					}
					mc = mc + '</div>';
				}
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
		mc = mc + '</div>'; // end div question container
	}
	 */
};

ConfigurableTally.prototype.onPermissionLoaded = function() {
	this.collapseAllQuestions();
	//var configHash = GetElectionConfig.generateConfigHash(this.config);
	var tmp = localStorage.getItem('sentQNo' + returnEnvelope.lStorage.id);
	if (tmp != null) {
		this.sentQNo = JSON.parse(tmp);
		for (var q=0; q<this.sentQNo.length; q++) {
			this.disableQuestion(this.sentQNo[q]);
		}
	}
};


ConfigurableTally.prototype.collapseAllQuestions = function() {
	for (var qNo=0; qNo<this.config.questions.length; qNo++) {
		var el = document.getElementById('divVoteQuestion'+qNo);
		if (el !== null) {
			hideElement(el); // el.style.display = 'none';
		}
	}
};


ConfigurableTally.showQuestion = function(showqNo) {
	var tallyconfig = ConfigurableTally.tallyConfig;
	for (var qNo=0; qNo<tallyconfig.questions.length; qNo++) {
		var el = document.getElementById('divVoteQuestion'+qNo);
		if (el !== null) {
			if (qNo == showqNo && isShown(el)) {
				hideElement(el); // clicked on an already shown question -> just hide it
				var btn = document.getElementById('buttonShowQid'+qNo);
				btn.childNodes[0].nodeValue = "Anzeigen";
				return;
			}
		}
	}
	// clicked on a question which is hidden -> show that and hide all others
	for (var qNo=0; qNo<tallyconfig.questions.length; qNo++) {
		var el = document.getElementById('divVoteQuestion'+qNo);
		if (el !== null) {
			if (qNo == showqNo)	{
				showElement(el); // el.style.display = 'block';
				var btn = document.getElementById('buttonShowQid'+qNo);
				btn.childNodes[0].nodeValue = "Verbergen";
			}
			else {
				hideElement(el); // el.style.display = 'none';
				var btn = document.getElementById('buttonShowQid'+qNo);
				btn.childNodes[0].nodeValue = "Anzeigen";
			}
		}
	}
};

ConfigurableTally.showOptionDetail = function(tag, qNo, optNo) {
	var el = document.getElementById(tag+qNo+'O'+optNo);
	if (el.style.display.length > 0 )	el.style.display = '';
	else       							el.style.display = 'none';
	adjustMaxHeight('divVoteQuestion'+qNo);
};


ConfigurableTally.getRankingTableHtml = function(qNo) {
	var mc ='';
	for (var optionNo=0; optionNo<ConfigurableTally.tallyConfig.questions[qNo].options.length; optionNo++) {
//		var optionID = tallyconfig.questions[qNo].options[optionNo].optionID;
		var ranking = ConfigurableTally.questions[qNo].ranking;
		mc = mc + '	<tr class="votingOption">';
		mc = mc + '		<td class="rankNo">' + (optionNo+1) + '</td>';
		mc = mc + '		<td id="optionQ'+qNo+'O'+optionNo+'" class="votingoptionTitle" draggable="true" ondrop="ConfigurableTally.drop(event, '+qNo+', '+optionNo+');" ondragover="ConfigurableTally.dragOver(event, '+qNo+', '+optionNo+');" ondragstart="ConfigurableTally.dragStart(event, '+qNo+', '+optionNo+');">'+ ConfigurableTally.tallyConfig.questions[qNo].options[ranking[optionNo]].optionTitle + '</td>';
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






/***********************************************************************
 * 
 * Send Vote
 * 
 ***********************************************************************/


ConfigurableTally.prototype.sendVote = function(qNo) {
	this.vote = this.getInputs(qNo);
	this.qNo = qNo;
	var votestr = unicodeToBlackslashU(JSON.stringify(this.vote));
	var questionID = this.config.questions[qNo].questionID;
	this.sendVoteData(votestr, questionID);  // sendVoteData is inherited from publish-only-tally
};

ConfigurableTally.prototype.handleServerAnswerStoreVote = function (xml) {
	try {
		var data = parseServerAnswer(xml, true);
		// TODO check voting server sig
		switch (data.cmd) {
		case 'saveYourCountedVote':
			alert('Der Server hat Ihre Stimme akzeptiert.');
			this.disableQuestion(this.qNo, this.vote);
			if (!Array.isArray(this.sentQNo)) this.sentQNo = new Array();
			this.sentQNo.push(this.qNo);
			localStorage.setItem('sentQNo'+ returnEnvelope.lStorage.id, JSON.stringify(this.sentQNo));
			break;
		case 'error':
			alert('Der Server hat die Stimme nicht akzeptiert. Er meldet:\n' + translateServerError(data.errorNo, data.errorTxt));
			break;
		default:
			throw new ErrorInServerAnswer(2002, 'Error: Expected >saveYourCountedVote<', 'Got from server: ' + data.cmd);
		break;
		}
	} catch (e) {
		if (e instanceof MyException ) {e.alert();}
		else {throw e;}
	}
};


/**
 * 
 * @param qNo
 * @param selected - if known: the vote array of options (and scheme) to be selected, otherwise nothing will be selected 
 */

ConfigurableTally.prototype.disableQuestion = function(qNo, selected) {
	//var vote = {//"ballotID":tallyconfig.ballotID,
//	"questions": [{
//	"questionID": tallyconfig.questions[qNo].questionID,
	//"optionOrder": [],
//	"statusQuoOption": "",
	//"options": [] //[[{"name": "score", "value": 1}, {"name": "yesNo", "value": 1}]]
//	}]
//	};

	// Disable and change button text of "send vote Button" to "vote accepted"
	var el = document.getElementById('buttonSendQ'+qNo);
	el.setAttribute('disabled', 'disabled');
	el.setAttribute('class', 'sendVoteButtonDone');
	el.childNodes[0].nodeValue = 'Stimme akzeptiert';

	// Disable all inputs on all options belonging to the question
	for (var optionNo=0; optionNo<this.config.questions[qNo].options.length; optionNo++) {
//		var optionID = this.config.questions[qNo].options[optionNo].optionID;
		for (var schemeIndex=0; schemeIndex<this.config.questions[qNo].tallyData.scheme.length; schemeIndex++) {
			var curScheme = this.config.questions[qNo].tallyData.scheme[schemeIndex];
			if (typeof selected != 'undefined') {
				var curSchemeVote = selected.options[optionNo][ArrayIndexOf(selected.options[optionNo], 'name', curScheme.name)];
			}
			switch (curScheme.name) {
			case 'yesNo':
				var el = document.getElementById('optionQ'+qNo+'O'+optionNo+'Y');
				el.setAttribute('disabled', 'disabled');
				el.removeAttribute('checked');
				var el = document.getElementById('optionQ'+qNo+'O'+optionNo+'N');
				el.setAttribute('disabled', 'disabled');
				el.removeAttribute('checked');
				if (curScheme.abstention) { 
					var el = document.getElementById('optionQ'+qNo+'O'+optionNo+'A');
					el.setAttribute('disabled', 'disabled');
					el.removeAttribute('checked');
				}
				if (typeof selected != 'undefined') {
					var votedElementId;
					switch (curSchemeVote.value) {
					case 1:  votedElementId = 'Y'; break;
					case 0:  votedElementId = 'N'; break;
					case -1: votedElementId = 'A'; break;
					}
					var el = document.getElementById('optionQ'+qNo+'O'+optionNo+votedElementId);
					el.setAttribute('checked', 'checked');
				}
				break;
			case 'score':
				for (var score = curScheme.minScore; score <= curScheme.maxScore; score++) {
					var rBtn = document.getElementById('optionQ'+qNo+'O'+optionNo+'S'+score);
					rBtn.setAttribute('disabled', 'disabled');
					if ((typeof selected != 'undefined') && curSchemeVote['value'] ==  score) rBtn.setAttribute('checked', 'checked');
					else rBtn.removeAttribute('checked');
				}
				break;
			}
		}
	}
};

ConfigurableTally.prototype.getInputs = function(qNo) {
	var vote = {//"ballotID":tallyconfig.ballotID,
//			"questions": [{
//			"questionID": tallyconfig.questions[qNo].questionID,
			"optionOrder": [],
//			"statusQuoOption": "",
			"options": [] //[[{"name": "score", "value": 1}, {"name": "yesNo", "value": 1}]]
//	}]
	};

	var valueYNA = -2;  // nothing selected --> -2
	for (var optionNo=0; optionNo<this.config.questions[qNo].options.length; optionNo++) {
		var optionID = this.config.questions[qNo].options[optionNo].optionID;
		vote.optionOrder[optionNo] = optionID;
		vote.options[optionNo] = [];
		for (var schemeIndex=0; schemeIndex<this.config.questions[qNo].tallyData.scheme.length; schemeIndex++) {
			var value = valueYNA;
			var curScheme = this.config.questions[qNo].tallyData.scheme[schemeIndex]; 
			switch (curScheme.name) {
			case 'yesNo':                             
				var voteOptionY =     document.getElementById('optionQ'+qNo+'O'+optionNo+'Y').checked;
				var voteOptionN =     document.getElementById('optionQ'+qNo+'O'+optionNo+'N').checked;
				if (curScheme.abstention) { 
					var voteOptionA = document.getElementById('optionQ'+qNo+'O'+optionNo+'A').checked;
					if  (voteOptionA == true) value = -1; // abstentitian --> -1
				}
				if  (voteOptionY == true) value = 1;  // yes --> 1
				if  (voteOptionN == true) value = 0;  // no --> 0
				break;
			case 'score':
				for (var score = curScheme.minScore; score <= curScheme.maxScore; score++) {
					var rBtn = document.getElementById('optionQ'+qNo+'O'+optionNo+'S'+score);
					if (rBtn.checked) value = score;
				}
				break;
			}
			vote.options[optionNo][schemeIndex] = {"name": curScheme.name, "value": value};
		}
	}
	return vote;

	/*
	for (var qNo=0; qNo<tallyconfig.questions.length; qNo++) {
		switch (tallyconfig.questions[qNo].voteSystem.type) {
		case 'score':
			divFirstQNode.setAttribute('id', 'FirstStepQ'+qNo);
			if (tallyconfig.questions[qNo].voteSystem.steps.indexOf('yesNo' >= 0)) {
				for (var optionNo=0; optionNo<tallyconfig.questions[qNo].options.length; optionNo++) {
					var optionID = tallyconfig.questions[qNo].options[optionNo].optionID;
				}
			}
		}

	}
	 */	

};

/***********************************************************************
 * 
 * Get Result
 * 
 ***********************************************************************/

ConfigurableTally.prototype.handleUserClickGetAllVotes = function (config_, onGotVotesObj, onGotVotesMethod) {
	this.config = config_;
	this.onGotVotesObj    = onGotVotesObj;
	this.onGotVotesMethod = onGotVotesMethod;


	PublishOnlyTally.prototype.handleUserClickGetAllVotes.call(this, config_,onGotVotesObj, onGotVotesMethod); 
};

ConfigurableTally.prototype.handleUserClickShowWinners = function (config_, onGotVotesObj, onGotVotesMethod) {
	this.config = config_;
	this.onGotVotesObj    = onGotVotesObj;
	this.onGotVotesMethod = onGotVotesMethod;
	var me = this; 
	var data = {};
	data.cmd = 'getWinners';
	data.electionId = unicodeToBlackslashU(JSON.stringify({'mainElectionId': this.config.electionId}));
	var datastr = JSON.stringify(data);
	// TODO add auth to data
	myXmlSend(ClientConfig.getResultUrl, datastr, me, me.handleServerAnswerShowWinners);
};


ConfigurableTally.prototype.handleServerAnswerShowWinners = function (xml) {
	try {
		var answer = parseServerAnswer(xml, true);
		if (answer.cmd != 'showWinners') throw new ErrorInServerAnswer(2043, 'Error: Expected >showWinners<', 'Got from server: ' + data.cmd);
		var html ='';
		this.winners = answer.data;
		for (var question in this.config.questions) {
			var questionID = this.config.questions[question].questionID;
			html = html + '<p>' + this.getWinnersHtml(questionID);
			html = html + '<button onclick="page.tally.handleUserClickGetAllVotes(' + questionID + ')">Alle Stimmen ansehen</button></p>';
		}
		this.onGotVotesMethod.call(this.onGotVotesObj, html);
	} catch (e) {
		alert('irgendwas hat nicht geklappt: ' + e.toString()); 
	}
};

ConfigurableTally.prototype.getWinnersHtml = function (questionID) {
	var html = "Bei Antragrguppe " + questionID;
	if (this.winners[questionID].length > 0)
		html = html + ' wurde Antrag ' + this.winners[questionID] + ' angenommen. ';
	else html = html + ' hat kein Antrag die erforderliche Mehrheit erreicht. ';
	return html;
};

ConfigurableTally.prototype.handleUserClickGetAllVotes = function(questionID) {
	var me = this;
	this.curQuestionID = questionID;
	PublishOnlyTally.requestAllVotes(this.config.electionId, questionID, me, me.handleServerAnswerVerifyCountVotes);
};

ConfigurableTally.prototype.handleServerAnswerVerifyCountVotes = function(xml) {
	var votesOnly = new Array();
	try {
		var answ = parseServerAnswer(xml, true);
		if (answ.cmd != 'verifyCountVotes') {
			throw new ErrorInServerAnswer(2003, 'Error: Expected >verifyCountVotes<', 'Got from server: ' + answ.cmd);
		}
		this.votes = answ.data.allVotes;
		// process data
		//   show a list of all votes
		var htmlcode = '<button onclick="page.tally.handleUserClickGetPermissedBallots();">Liste der Wahlscheine holen</button>';
		htmlcode = htmlcode + '<button onclick="page.tally.findMyVote();">Finde meine Stimme</button>';
		var v;   // vote
		var vno; // vote number
		var disabled;
		var curQuestion = this.config.questions[ArrayIndexOf(this.config.questions, 'questionID', this.curQuestionID)]; 
		var freq = [];
		for (var optionIndex=0; optionIndex<curQuestion.options.length; optionIndex++ ) {
			freq[optionIndex] = {
					'yesNo': {'numYes': 0, 'numNo': 0, 'numAbstention': 0},
					'score': 0
			};
			htmlcode = htmlcode + '<h3>Stimmen zu Antrag ' + curQuestion.options[optionIndex].optionID + '</h3>';
			htmlcode = htmlcode + '<div class="allvotes"><table>';
			htmlcode = htmlcode + '<thead>'; 
			for (var schemeIndex=0; schemeIndex<curQuestion.tallyData.scheme.length; schemeIndex++ ) {
				switch(curQuestion.tallyData.scheme[schemeIndex].name) {
				case 'yesNo': htmlcode = htmlcode + '<th>' + 'Ja/Nein</th>'; break;
				case 'score': htmlcode = htmlcode + '<th>' + 'Bewertung</th>'; break;
				default: alert('error 875498z54');
				};
			}
			htmlcode = htmlcode + '<th>' + 'Stimmnummer' + '</th><th>Prüfen!</th></thead>';
			htmlcode = htmlcode + '<tbody>';
			for (var i=0; i<this.votes.length; i++) {
				htmlcode = htmlcode + '<tr>';

				for (var schemeIndex=0; schemeIndex<curQuestion.tallyData.scheme.length; schemeIndex++ ) {
					var curScheme = curQuestion.tallyData.scheme[schemeIndex];
					try {vno = this.votes[i].permission.signed.votingno; } catch (e) {vno = 'Error'; disabled = 'disabled';}
					var vt = 'fehler';
					var value = 'invalid';
					try {
						var vString   = this.votes[i].vote.vote; 
						v = JSON.parse(vString); 
						var optionVoteIndex;
						var optionVoteSchemeIndex;
						optionVoteIndex = v.optionOrder.indexOf(curQuestion.options[optionIndex].optionID);
						optionVoteSchemeIndex = ArrayIndexOf(v.options[optionVoteIndex], 'name', curScheme.name);
						disabled = ''; 
						value = v.options[optionVoteIndex][optionVoteSchemeIndex].value;
						switch (curScheme.name) {
						case 'yesNo': 
							switch (value) {
							case 1: vt = 'Ja';     freq[optionIndex].yesNo.numYes++;        break;
							case 0: vt = 'Nein';   freq[optionIndex].yesNo.numNo++;         break;
							case -1: vt = 'Enth.'; freq[optionIndex].yesNo.numAbstention++; break; // TODO verify if abstention is in the scheme allowed
							default: vt = 'ungültig'; break;
							}
							break;
						case 'score': 
							vt = value.toString(); 
							freq[optionIndex].score = freq[optionIndex].score + value; 
							break; // TODO check range
						default:      vt = 'ungültig'; break;
						}
					} catch (e) {
						vt   = 'Error'; 
						disabled = 'disabled';
					}
					htmlcode = htmlcode + '<td  class="vote ' + curScheme.name + ' ' + curScheme.name + value.toString() + '">';
					htmlcode = htmlcode + vt + '</td>';
				}
				htmlcode = htmlcode + '<td> <span id="votingno">' + vno + '</span></td>'; 
				htmlcode = htmlcode + '<td> <button ' + disabled + ' onclick="page.tally.handleUserClickVerifySig(' + i +');" >Unterschriften pr&uuml;fen!</button>' + '</td>'; 
//				htmlcode = htmlcode + '<td>' + this.votes[i].permission.signed.salt     + '</td>'; 
				htmlcode = htmlcode + '</tr>';
				// TODO add to votes only if sigOk
				votesOnly[i] = v;
			}
			htmlcode = htmlcode + '</tbody></table></div>';
		}
		
		// show the frequencies
		// freq.sort(function(a, b) {return b.score - a.score;});
		// freq.sort(function(a, b) {return b.yesNo.numYes - a.yesNo.numYes;});
		var htmlcode2 = '<div id="freq"><table>';
		htmlcode2 = htmlcode2 + '<thead>';
		htmlcode2 = htmlcode2 + '<th class="optionHead"  >' + 'Option'         + '</th>';
		for (var schemeIndex=0; schemeIndex<curQuestion.tallyData.scheme.length; schemeIndex++ ) {
			var curScheme = curQuestion.tallyData.scheme[schemeIndex];
			switch (curScheme.name) {
			case 'yesNo':
				htmlcode2 = htmlcode2 + '<th class="numVotes">' + 'Anzahl Ja' + '</th>';
				htmlcode2 = htmlcode2 + '<th class="numVotes">' + 'Anzahl Nein' + '</th>';
				if (curScheme.abstention) {
					htmlcode2 = htmlcode2 + '<th class="numVotes">' + 'Anzahl Enth.' + '</th>';
				}
				break;
			case 'score': 
				htmlcode2 = htmlcode2 + '<th class="numVotes">' + 'Summe Bewertungen' + '</th>';
				break; 
			default:
				htmlcode2 = htmlcode2 + '<th class="numVotes">' + 'Not Supported Scheme' + '</th>';
			break;
			}
		}
		htmlcode2 = htmlcode2 + '</thead><tbody>';
		for (var i=0; i<freq.length; i++) {
			htmlcode2 = htmlcode2 + '<tr>';
			var winnerOption = '';
			if (curQuestion.options[i].optionID == this.winners[curQuestion.questionID]) winnerOption = ' winnerOption'; 
			htmlcode2 = htmlcode2 + '<td class="option' + winnerOption + '">' + 'Antrag ' + curQuestion.options[i].optionID + '</td>'; 
			for (var schemeIndex=0; schemeIndex<curQuestion.tallyData.scheme.length; schemeIndex++ ) {
				var curScheme = curQuestion.tallyData.scheme[schemeIndex];
				switch (curScheme.name) {
				case 'yesNo':
					htmlcode2 = htmlcode2 + '<td class="numVotes' + winnerOption + '">' + freq[i].yesNo.numYes + '</td>';
					htmlcode2 = htmlcode2 + '<td class="numVotes' + winnerOption + '">' + freq[i].yesNo.numNo  + '</td>';
					if (curScheme.abstention) {
						htmlcode2 = htmlcode2 + '<td class="numVotes' + winnerOption + '">' + freq[i].yesNo.numAbstention + '</td>';
					}
					break;
				case 'score': 
					htmlcode2 = htmlcode2 + '<td class="numVotes' + winnerOption + '">' + freq[i].score + '</td>';
					break; 
				default:
					htmlcode2 = htmlcode2 + '<td class="numVotes' + winnerOption + '">' + 'Not Supported Scheme' + '</td>';
				break;
				}
			}
			htmlcode2 = htmlcode2 + '</tr>';
		}
		htmlcode2 = htmlcode2 + '</tbody>';
		htmlcode2 = htmlcode2 + '</table></div>';
		
		var htmlcode0 = '<h3> Antragsgruppe: ' + this.curQuestionID + '</h3>';
		htmlcode0 = htmlcode0 + '<p>' + this.getWinnersHtml(this.curQuestionID) + '</p>';

		var ret = htmlcode0 + '<br>\n\n' + htmlcode2 + '<br> <br>\n\n' + htmlcode;
		this.onGotVotesMethod.call(this.onGotVotesObj, ret);
	} catch (e) {
		if (e instanceof MyException ) {e.alert();}
		else if (e instanceof TypeError   ) {
			var f = new ErrorInServerAnswer(2004, 'Error: unexpected var type', 'details: ' + e.toString());
			f.alert();
		} else {
			var f = new ErrorInServerAnswer(2005, 'Error: some error occured', 'details: ' + e.toString());
			f.alert();
		} // TODO show the error
	};
};


ConfigurableTally.test = function() {
	var config = 
	{
			"ballotID":"GTVsdffgsdwt40QXffsd452re",
			"votingStart": "2014-02-10T21:20:00Z", 
			"votingEnd": "2014-03-04T00:00:00Z",
			"access":
			{
				"listID": "DEADBEEF",
				"groups": [ 1,2,3] 
			},     
			"electionID": /* "ballotName": */ "1. Basisentscheid NRW (online, anonym, Test)",
			"questions":
				[
				 {
					 "questionID":1,
					 "questionWording":"Drehen wir uns im Kreis? (zweistufig)",
					 "tallyData": {
						 "scheme": /*"voteSystem":*/
							 [{
								 "name": "yesNo",
								 "abstention": true,
								 "quorum": "2", //1: "at least the same number of YES as of NO",		1+: "more than YES than NO",		2: "at least twice as much YES than NO",		2+: "more than twice as much YES than NO""abstentionAsNo": false,
								 "abstentionAsNo": false
							 }, {
								 "name": "score",
								 "minScore": -3,
								 "maxScore": 3,
							 }],
							 "findWinner": ["yesNo", "score", "yesNoDiff", "random"]
					 },
					 "options":
						 [
						  { "optionID": 1, "optionTitle": "Ja, linksherum.", "optionDesc": "Hier mach ich zum test mal eine richtig lange Modulbeschreibung rein.\n\n Ich bin gespannt, wie die angezeigt wird als Legende für die Auswahlknöpfe. Meine Prognose ist, dass NRW das anonyme Verfahren einführen wird. Was glauben Sie, stimmt das?" },
						  { "optionID": 2, "optionTitle": "Ja, rechtsherum" },
						  { "optionID": 3, "optionTitle": "Nein. Ab durch die Mitte!" },
						  { "optionID": 4, "optionTitle": "Jein. Wir drehen durch." }
						  ],
						  "references":
							  [
							   { "referenceName":"Abschlussparty und Auflösung", "referenceAddress":"https://lqfb.piratenpartei.de/lf/initiative/show/5789.html" },
							   { "referenceName":"Bilder zur Motivation","referenceAddress":"https://startpage.com/do/search?cat=pics&cmd=process_search&language=deutsch&query=cat+content" }
							   ]
				 },
				 {
					 "questionID":2,
					 "questionWording":"Drehen wir uns im Kreis? (nur ja/nein/Enthaltung)",
					 "tallyData": {
						 "scheme": /*"voteSystem":*/
							 [{
								 "name": "yesNo",
								 "abstention": true,
								 "abstentionAsNo": true,
								 "quorum": "1+", //1: "at least the same number of YES as of NO",		1+: "more than YES than NO",		2: "at least twice as much YES than NO",		2+: "more than twice as much YES than NO""abstentionAsNo": false,
							 }]
					 },
					 "options":
						 [
						  { "optionID": 1, "optionTitle": "Ja, linksherum. Hier mach ich zum test mal eine richtig lange Modulbeschreibung rein.<br> Ich bin gespannt, wie die angezeigt wird als Legende für die Auswahlknöpfe. Meine Prognose ist, dass NRW das anonyme Verfahren einführen wird. Was glauben Sie, stimmt das?" },
						  { "optionID": 2, "optionTitle": "Ja, rechtsherum" },
						  { "optionID": 3, "optionTitle": "Nein. Ab durch die Mitte!" },
						  { "optionID": 4, "optionTitle": "Jein. Wir drehen durch." }
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
					 "tallyData": {
						 "scheme": /*"voteSystem":*/
							 [{
								 "name": "yesNo",
								 "abstention": false
							 }]
					 },
					 "options":
						 [
						  { "optionID":1, "optionTitle": "Ja. Befriedigung! Ha!"},
						  { "optionID":2, "optionTitle": "Ja. Streit und Ärger."},
						  { "optionID":3, "optionTitle": "nö, aber wir machen's dennoch" },
						  { "optionID":4, "optionTitle": "Huch? Das macht noch jemand?" }
						  ],
						  "references":
							  [                
							   { "referenceName":"piff paff puff kappotschießen", "referenceAddress":"https://twitter.com/czossi/status/436217916803911680/photo/1" }
							   ]
				 },
				 {
					 "questionID":4,
					 "questionWording":"Basisentscheid / Ständige Mitgliederversammlung\n* SÄA30: Modul 1: Basisentscheid in NRW einführen\n* SÄA30: Modul 2: Basisentscheid online anonym ermöglichen\n* SÄA30: Modul 3: Auch Programmanträge im Basisentscheid zulassen\n* SÄA XY: Ständige Mitgliederversammlung einführen",
					 "tallyData": {
						 "scheme": /*"voteSystem":*/
							 [{
								 "name": "score",
								 "minScore": -3,
								 "maxScore": 3,
							 }]
					 },
					 "options":
						 [
						  { "optionID": 1, "optionTitle": "SÄA 18: SMV Option 1 - Ablehnung von verbindlicher Online-SMV", "optionDesc": "Der Landesverband NRW lehnt es grundsätzlich ab, zum jetzigen Zeitpunkt ein System einzuführen, welches unter zuhilfenahme von Online-Werkzeugen irgendeine Form von verbindlicher Abstimmung umsetzen soll.\n\nZu diesem Zweck werden aus §8 (2) der Landessatzung die Worte \"oder in einem vom Landesparteitag legitimierten Werkzeug\" gestrichen. ", "reasons": "== Glaubwürdigkeit ==\n* Beschluss/PM aus der Gründungszeit der Piratenpartei: https://wiki.piratenpartei.de/Pressemitteilung_vom_12.11.2006_zu_Wahlmaschinen\n* Wir machen uns absolut unglaubwürdig, wenn wir verbindliche Onlineabstimmungen beschliessen und durchführen.\n\n== Toolproblem ==\nEs gibt zum jetzigen Zeitpunkt kein einziges Tool, welches die elementaren Anforderungen an geheime Wahlen erfüllt (anonym/pseudonym, Nachvollzieh- und Überprüfbarkeit). Auf absehbare Zeit nicht umsetzbare Mitbestimmungswerkzeuge in die Satzung zu schreiben ist Zeitverschwendung und Wahlbetrug."},
						  { "optionID": 2, "optionTitle": "SÄA 18: Modul 1: 2014 keine Ressourcen für SMV bereitstellen", "optionDesc": "Das Thema SMV soll 2014 (mindestens für die Amtsperiode des derzeitgen Landesvorstandes) keine Rolle mehr spielen. Es soll insbesondere keinerlei finanzielle Förderung oder Bereitstellung von IT Infrastruktur aus Landesmitteln stattfinden." },
						  { "optionID": 3, "optionTitle": "SÄA 18: Modul 2: Entwicklung auf Bundesebene abwarten", "optionDesc": "Das Thema SMV soll auf Landesebene erst wieder aktiv behandelt werden, wenn es auf Bundesebene neue Entscheidungen oder Entwicklungen zum Thema SMV gibt (z.B. Bestätigung eines Tools, Satzungsänderungen)."  },
						  { "optionID": 4, "optionTitle": "SÄA 19: SMV Option 2 Ständige Mitgliederversammlung nur auf Totholz einführen", "optionDesc": "Der Landesparteitag möge beschliessen, der Satzung an geeigneter Stelle einen Abschnitt \"Basisentscheid und Basisbefragung\" mit folgendem Wortlaut hinzuzufügen: (Anmerkung 1: Der Text entspricht bis auf die hier durch Streichung bzw Fettschrift kenntlich gemachten Teile dem angenommenen SÄA003 (http://wiki.piratenpartei.de/Antrag:Bundesparteitag_2013.1/Antragsportal/SÄA003) aus Neumarkt.)\n\n\
							  (Anmerkung 2: Die parallel dazu vorgeschlagene Entscheidsordnung weicht deutlich von X011 (http://wiki.piratenpartei.de/Antrag:Bundesparteitag_2013.1/Antragsportal/X011) aus Neumarkt ab.) \
							  \n\n(1) Die Mitglieder fassen in einem Basisentscheid einen Beschluss, der einem des Landesparteitags gleichsteht. Ein Beschluss zu Sachverhalten, die dem Landesparteitag vorbehalten sind oder eindeutig dem Parteiprogramm widersprechen, gilt als Basisbefragung mit lediglich empfehlenden Charakter. Urabstimmungen gemäß §6 (2) Nr.11 PartG werden in Form eines Basisentscheids durchgeführt, zu dem alle stimmberechtigten Mitglieder in Textform eingeladen werden. Die nachfolgenden Bestimmungen für Anträge bzw. Abstimmungen gelten sinngemäß auch für Personen bzw. Wahlen.\
							  \n\n(2) Teilnahmeberechtigt sind alle persönlich identifizierten, am Tag der Teilnahme stimmberechtigten Mitglieder gemäß §4(4) der Bundessatzung, die mit ihren Mitgliedsbeiträgen nicht im Rückstand sind. Um für Quoren und Abstimmungen berücksichtigt zu werden, müssen sich die teilnahmeberechtigten Mitglieder zur Teilnahme anmelden.\
							  \n\n(3) Über einen Antrag wird nur abgestimmt, wenn er innerhalb eines Zeitraums ein Quorum von Teilnehmern als Unterstützer erreicht oder vom Bundesparteitag eingebracht wird. Der Landesvorstand darf organisatorische Anträge einbringen. Konkurrierende Anträge zu einem Sachverhalt können rechtzeitig vor der Abstimmung eingebracht und für eine Abstimmung gebündelt werden. Eine erneute Abstimmung über den gleichen oder einen sehr ähnlichen Antrag ist erst nach Ablauf einer Frist zulässig, es sei denn die Umstände haben sich seither maßgeblich geändert. Über bereits erfüllte, unerfüllbare oder zurückgezogene Anträge wird nicht abgestimmt. Der Landesparteitag soll die bisher nicht abgestimmten Anträge behandeln.\
							  \n\n(4) Vor einer Abstimmung werden die Anträge angemessen vorgestellt und zu deren Inhalt eine für alle Teilnehmer zugängliche Debatte gefördert. Die Teilnahme an der Debatte und Abstimmung muss für die Mitglieder zumutbar und barrierefrei sein. Anträge werden nach gleichen Maßstäben behandelt. Mitglieder bzw. Teilnehmer werden rechtzeitig über mögliche Abstimmungstermine bzw. die Abstimmungen in Textform informiert.\
							  \n\n(5) Die Teilnehmer haben gleiches Stimmrecht, das sie selbstständig und frei innerhalb des Abstimmungszeitraums ausüben. Abstimmungen außerhalb des Parteitags erfolgen entweder pseudonymisiert oder geheim. Bei pseudonymisierter Abstimmung kann jeder Teilnehmer die unverfälschte Erfassung seiner eigenen Stimme im Ergebnis überprüfen und nachweisen. Bei personellen Sachverhalten oder auf Antrag einer Minderheit muss die Abstimmung geheim erfolgen. In einer geheimen Abstimmung sind die einzelnen Schritte für jeden Teilnehmer ohne besondere Sachkenntnisse nachvollziehbar und die Stimmabgabe erfolgt nicht elektronisch. Die Manipulation einer Abstimmung oder die Veröffentlichung von Teilergebnissen vor Abstimmungsende sind ein schwerer Verstoß gegen die Ordnung der Partei.\
						  \n\n(6) Das Nähere regelt die Entscheidsordnung, welche durch den Landesparteitag beschlossen wird und auch per Basisentscheid geändert werden kann." },
						  { "optionID": 5, "optionTitle": "SÄA 19: Modul 1: Änderung der Entscheidsordnung durch den Basisentscheid", "optionDesc": "Abschnitt (6) wird ersetzt durch:\n\n(6) Das Nähere regelt die Entscheidsordnung, welche durch den Landesparteitag beschlossen wird und auch per Basisentscheid geändert werden kann." },
						  { "optionID": 6, "optionTitle": "SÄA 19: Modul 2: An die Arbeit !", "optionDesc": "Regionale und kommunale Gliederungen ausreichender Größe sind aufgefordert, spätestens nach der kommenden Kommunalwahl mit der Gründung von Urnen zu beginnen. Der Landesvorstand ist aufgefordert durch Ausschreibungen (oder sofern nötig & möglich auch durch Wahlen noch auf dem LPT), entsprechendes Personal für die Organisation und Durchführung zu finden und entsprechend zu beauftragen." },
						  { "optionID": 7, "optionTitle": "SÄA30: Modul 1: Basisentscheid in NRW einführen", "optionDesc": "" },
						  { "optionID": 8, "optionTitle": "SÄA30: Modul 2: Basisentscheid online anonym ermöglichen", "optionDesc": "" },
						  { "optionID": 9, "optionTitle": "SÄA30: Modul 3: Auch Programmanträge im Basisentscheid zulassen", "optionDesc": "" }
						  ],
						  "references":
							  [
							   { "referenceName":"Vollständiger Antrag zur SMV Option 1 - Ablehnung von verbindlicher Online-SMV mit Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A019" },
							   { "referenceName":"Vollständiger Antrag zur SMV Option 2 - Totholz SMV mit Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A019" },
							   { "referenceName":"Vollständiger Antrag zum Basisentscheid mit Begründung und Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A030" }
							   ]
				 }
				 ],
				 "references":
					 [
					  {"referenceName":"Piratenpartei","referenceAddress":"https://piratenpartei.de/"}
					  ]

	};

	var tally = new ConfigurableTally('', config);
	var fragm = tally.getMainContentFragm(config);
	Page.loadMainContentFragm(fragm);
	ConfigurableTally.showQuestion(0);
};



ConfigurableTally.test2 = function() {
	var config = 
	{
			"ballotID":"GTVsdffgsdwt40QXffsd452re",
			"votingStart": "2014-02-10T21:20:00Z", 
			"votingEnd": "2014-03-04T00:00:00Z",
			"access":
			{
				"listID": "DEADBEEF",
				"groups": [ 1,2,3] 
			},     
			"ballotName": "1. Basisentscheid NRW (online, anonym, Test)",
			"questions":
				[
				 {
					 "questionID":1,
					 "questionWording":"Drehen wir uns im Kreis? (zweistufig)",
					 "tallyData": {
						 "scheme":
							 [ 
							  {
								  "name": "yesNo", /* "yesNo" "score", "pickOne" "rank" */ 
								  "abstention": true
							  },
							  {
								  "name": "score", 
								  "minScore": -3,
								  "maxScore": 3
							  }
							  ]
					 },
					 "options":
						 [
						  { "optionID": 1, "optionTitle": "Ja, linksherum.", "optionDesc": "Hier mach ich zum test mal eine richtig lange Modulbeschreibung rein.\n\n Ich bin gespannt, wie die angezeigt wird als Legende für die Auswahlknöpfe. Meine Prognose ist, dass NRW das anonyme Verfahren einführen wird. Was glauben Sie, stimmt das?" },
						  { "optionID": 2, "optionTitle": "Ja, rechtsherum" },
						  { "optionID": 3, "optionTitle": "Nein. Ab durch die Mitte!" },
						  { "optionID": 4, "optionTitle": "Jein. Wir drehen durch." }
						  ],
						  "references":
							  [
							   { "referenceName":"Abschlussparty und Auflösung", "referenceAddress":"https://lqfb.piratenpartei.de/lf/initiative/show/5789.html" },
							   { "referenceName":"Bilder zur Motivation","referenceAddress":"https://startpage.com/do/search?cat=pics&cmd=process_search&language=deutsch&query=cat+content" }
							   ]
				 },
				 {
					 "questionID":2,
					 "questionWording":"Drehen wir uns im Kreis? (nur ja/nein/Enthaltung)",
					 "tallyData": {
						 "scheme":
							 [{
								 "name": "yesNo", /* "yesNo" "score", "pickOne" "rank" */ 
								 "abstention": false
							 }]
					 },
					 "options":
						 [
						  { "optionID": 1, "optionTitle": "Ja, linksherum. Hier mach ich zum test mal eine richtig lange Modulbeschreibung rein.<br> Ich bin gespannt, wie die angezeigt wird als Legende für die Auswahlknöpfe. Meine Prognose ist, dass NRW das anonyme Verfahren einführen wird. Was glauben Sie, stimmt das?" },
						  { "optionID": 2, "optionTitle": "Ja, rechtsherum" },
						  { "optionID": 3, "optionTitle": "Nein. Ab durch die Mitte!" },
						  { "optionID": 4, "optionTitle": "Jein. Wir drehen durch." }
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
					 "tallyData": {
						 "scheme":
							 [ 
							  {
								  "name": "rank", /* "yesNo" "score", "pickOne" "rank" */ 
							  }
							  ]
					 },
					 "options":
						 [
						  { "optionID":1, "optionTitle": "Ja. Befriedigung! Ha!"},
						  { "optionID":2, "optionTitle": "Ja. Streit und Ärger."},
						  { "optionID":3, "optionTitle": "nö, aber wir machen's dennoch" },
						  { "optionID":4, "optionTitle": "Huch? Das macht noch jemand?" }
						  ],
						  "references":
							  [                
							   { "referenceName":"piff paff puff kappotschießen", "referenceAddress":"https://twitter.com/czossi/status/436217916803911680/photo/1" }
							   ]
				 },
				 {
					 "questionID":4,
					 "questionWording":"Basisentscheid / Ständige Mitgliederversammlung\n* SÄA30: Modul 1: Basisentscheid in NRW einführen\n* SÄA30: Modul 2: Basisentscheid online anonym ermöglichen\n* SÄA30: Modul 3: Auch Programmanträge im Basisentscheid zulassen\n* SÄA XY: Ständige Mitgliederversammlung einführen",
					 "tallyData": {
						 "scheme":
							 [{
								 "name": "score", 
								 "minScore": 0,
								 "maxScore": 3
							 }]
					 },
					 "options":
						 [
						  { "optionID": 1, "optionTitle": "SÄA 18: SMV Option 1 - Ablehnung von verbindlicher Online-SMV", "optionDesc": "Der Landesverband NRW lehnt es grundsätzlich ab, zum jetzigen Zeitpunkt ein System einzuführen, welches unter zuhilfenahme von Online-Werkzeugen irgendeine Form von verbindlicher Abstimmung umsetzen soll.\n\nZu diesem Zweck werden aus §8 (2) der Landessatzung die Worte \"oder in einem vom Landesparteitag legitimierten Werkzeug\" gestrichen. ", "reasons": "== Glaubwürdigkeit ==\n* Beschluss/PM aus der Gründungszeit der Piratenpartei: https://wiki.piratenpartei.de/Pressemitteilung_vom_12.11.2006_zu_Wahlmaschinen\n* Wir machen uns absolut unglaubwürdig, wenn wir verbindliche Onlineabstimmungen beschliessen und durchführen.\n\n== Toolproblem ==\nEs gibt zum jetzigen Zeitpunkt kein einziges Tool, welches die elementaren Anforderungen an geheime Wahlen erfüllt (anonym/pseudonym, Nachvollzieh- und Überprüfbarkeit). Auf absehbare Zeit nicht umsetzbare Mitbestimmungswerkzeuge in die Satzung zu schreiben ist Zeitverschwendung und Wahlbetrug."},
						  { "optionID": 2, "optionTitle": "SÄA 18: Modul 1: 2014 keine Ressourcen für SMV bereitstellen", "optionDesc": "Das Thema SMV soll 2014 (mindestens für die Amtsperiode des derzeitgen Landesvorstandes) keine Rolle mehr spielen. Es soll insbesondere keinerlei finanzielle Förderung oder Bereitstellung von IT Infrastruktur aus Landesmitteln stattfinden." },
						  { "optionID": 3, "optionTitle": "SÄA 18: Modul 2: Entwicklung auf Bundesebene abwarten", "optionDesc": "Das Thema SMV soll auf Landesebene erst wieder aktiv behandelt werden, wenn es auf Bundesebene neue Entscheidungen oder Entwicklungen zum Thema SMV gibt (z.B. Bestätigung eines Tools, Satzungsänderungen)."  },
						  { "optionID": 4, "optionTitle": "SÄA 19: SMV Option 2 Ständige Mitgliederversammlung nur auf Totholz einführen", "optionDesc": "Der Landesparteitag möge beschliessen, der Satzung an geeigneter Stelle einen Abschnitt \"Basisentscheid und Basisbefragung\" mit folgendem Wortlaut hinzuzufügen: (Anmerkung 1: Der Text entspricht bis auf die hier durch Streichung bzw Fettschrift kenntlich gemachten Teile dem angenommenen SÄA003 (http://wiki.piratenpartei.de/Antrag:Bundesparteitag_2013.1/Antragsportal/SÄA003) aus Neumarkt.)\n\n\
							  (Anmerkung 2: Die parallel dazu vorgeschlagene Entscheidsordnung weicht deutlich von X011 (http://wiki.piratenpartei.de/Antrag:Bundesparteitag_2013.1/Antragsportal/X011) aus Neumarkt ab.) \
							  \n\n(1) Die Mitglieder fassen in einem Basisentscheid einen Beschluss, der einem des Landesparteitags gleichsteht. Ein Beschluss zu Sachverhalten, die dem Landesparteitag vorbehalten sind oder eindeutig dem Parteiprogramm widersprechen, gilt als Basisbefragung mit lediglich empfehlenden Charakter. Urabstimmungen gemäß §6 (2) Nr.11 PartG werden in Form eines Basisentscheids durchgeführt, zu dem alle stimmberechtigten Mitglieder in Textform eingeladen werden. Die nachfolgenden Bestimmungen für Anträge bzw. Abstimmungen gelten sinngemäß auch für Personen bzw. Wahlen.\
							  \n\n(2) Teilnahmeberechtigt sind alle persönlich identifizierten, am Tag der Teilnahme stimmberechtigten Mitglieder gemäß §4(4) der Bundessatzung, die mit ihren Mitgliedsbeiträgen nicht im Rückstand sind. Um für Quoren und Abstimmungen berücksichtigt zu werden, müssen sich die teilnahmeberechtigten Mitglieder zur Teilnahme anmelden.\
							  \n\n(3) Über einen Antrag wird nur abgestimmt, wenn er innerhalb eines Zeitraums ein Quorum von Teilnehmern als Unterstützer erreicht oder vom Bundesparteitag eingebracht wird. Der Landesvorstand darf organisatorische Anträge einbringen. Konkurrierende Anträge zu einem Sachverhalt können rechtzeitig vor der Abstimmung eingebracht und für eine Abstimmung gebündelt werden. Eine erneute Abstimmung über den gleichen oder einen sehr ähnlichen Antrag ist erst nach Ablauf einer Frist zulässig, es sei denn die Umstände haben sich seither maßgeblich geändert. Über bereits erfüllte, unerfüllbare oder zurückgezogene Anträge wird nicht abgestimmt. Der Landesparteitag soll die bisher nicht abgestimmten Anträge behandeln.\
							  \n\n(4) Vor einer Abstimmung werden die Anträge angemessen vorgestellt und zu deren Inhalt eine für alle Teilnehmer zugängliche Debatte gefördert. Die Teilnahme an der Debatte und Abstimmung muss für die Mitglieder zumutbar und barrierefrei sein. Anträge werden nach gleichen Maßstäben behandelt. Mitglieder bzw. Teilnehmer werden rechtzeitig über mögliche Abstimmungstermine bzw. die Abstimmungen in Textform informiert.\
							  \n\n(5) Die Teilnehmer haben gleiches Stimmrecht, das sie selbstständig und frei innerhalb des Abstimmungszeitraums ausüben. Abstimmungen außerhalb des Parteitags erfolgen entweder pseudonymisiert oder geheim. Bei pseudonymisierter Abstimmung kann jeder Teilnehmer die unverfälschte Erfassung seiner eigenen Stimme im Ergebnis überprüfen und nachweisen. Bei personellen Sachverhalten oder auf Antrag einer Minderheit muss die Abstimmung geheim erfolgen. In einer geheimen Abstimmung sind die einzelnen Schritte für jeden Teilnehmer ohne besondere Sachkenntnisse nachvollziehbar und die Stimmabgabe erfolgt nicht elektronisch. Die Manipulation einer Abstimmung oder die Veröffentlichung von Teilergebnissen vor Abstimmungsende sind ein schwerer Verstoß gegen die Ordnung der Partei.\
						  \n\n(6) Das Nähere regelt die Entscheidsordnung, welche durch den Landesparteitag beschlossen wird und auch per Basisentscheid geändert werden kann." },
						  { "optionID": 5, "optionTitle": "SÄA 19: Modul 1: Änderung der Entscheidsordnung durch den Basisentscheid", "optionDesc": "Abschnitt (6) wird ersetzt durch:\n\n(6) Das Nähere regelt die Entscheidsordnung, welche durch den Landesparteitag beschlossen wird und auch per Basisentscheid geändert werden kann." },
						  { "optionID": 6, "optionTitle": "SÄA 19: Modul 2: An die Arbeit !", "optionDesc": "Regionale und kommunale Gliederungen ausreichender Größe sind aufgefordert, spätestens nach der kommenden Kommunalwahl mit der Gründung von Urnen zu beginnen. Der Landesvorstand ist aufgefordert durch Ausschreibungen (oder sofern nötig & möglich auch durch Wahlen noch auf dem LPT), entsprechendes Personal für die Organisation und Durchführung zu finden und entsprechend zu beauftragen." },
						  { "optionID": 7, "optionTitle": "SÄA30: Modul 1: Basisentscheid in NRW einführen", "optionDesc": "" },
						  { "optionID": 8, "optionTitle": "SÄA30: Modul 2: Basisentscheid online anonym ermöglichen", "optionDesc": "" },
						  { "optionID": 9, "optionTitle": "SÄA30: Modul 3: Auch Programmanträge im Basisentscheid zulassen"}
						  ],
						  "references":
							  [
							   { "referenceName":"Vollständiger Antrag zur SMV Option 1 - Ablehnung von verbindlicher Online-SMV mit Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A019" },
							   { "referenceName":"Vollständiger Antrag zur SMV Option 2 - Totholz SMV mit Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A019" },
							   { "referenceName":"Vollständiger Antrag zum Basisentscheid mit Begründung und Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A030" }
							   ]
				 }
				 ],
				 "references":
					 [
					  {"referenceName":"Piratenpartei","referenceAddress":"https://piratenpartei.de/"}
					  ]

	};

	var tally = new ConfigurableTally('', config);
	var fragm = tally.getMainContentFragm(config);
	Page.loadMainContentFragm(fragm);
	ConfigurableTally.showQuestion(0);
};