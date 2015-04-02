/**
 * replaces <> with - and :/\|?* with + because this are reserved characters on NTFS
 * @param fn
 * @returns
 */
function clearForFilename(fn) {
	return fn.replace(/</g, '-').replace(/>/g, '-').replace(/:/g, '+').replace(/\//g,'+').replace(/\\/g,'+').replace(/\|/g, '+').replace(/\?/g, '+').replace(/\*/g,'+');
}


/**
 * returns an array containing the counts of the same values in the given list
 * @param list array
 * @returns {Array}
 */
function getFrequencies(list) {
	if (list.length < 1) {return list;}
	list.sort();
	var freqs = new Array();
	var j = 0;
	freqs[0] = {'option': list[0], 'freq': 1};
	for (var i=1; i<list.length; i++) {
		if (list[i] != freqs[j].option) {
			j++;
			freqs[j] = {'option': list[i], 'freq': 1};
		} else {
			freqs[j].freq++;  
		}
	}
	return freqs;
}


/**
 * returns the index in an array of objects which matches
 * a given property of the object
 * @param a: array to search in
 * @param elementname: name of property to search
 * @param element: element to search for
 * @returns {Number}
 */
function ArrayIndexOf(a, elementname, element) {
	if (!a || !a.length || a.length < 1) return -1;
	for (var i = 0; i < a.length; i++) {
		if (a[i][elementname] === element) return i;
	}
	return -1;
}


function sendThroughProxy() {

}

/**
 * 
 * @param url if url is set to null the parameters from the last call we be used
 * @param data
 * @param callbackObject
 * @param callbackFunction
 * @param proxy
 * @returns
 */
function myXmlSend(url, data, callbackObject, callbackFunction, proxy) {
	if (typeof url !== 'string') { // typeof returns 'undefined' if url is not set
		alert('Ein Fehler in den Einstellungen ist aufgetreten. Bitte informieren Sie den Wahlverantwortlichen (Fehlernr.: 875765: URL nicht definiert oder kein String)');
		return;
	} 
	myXmlSend_(url, data, callbackObject, callbackFunction, proxy, 'POST', true);
}

function httpGet(url, callbackObject, callbackFunction, log, proxy) {
	if (typeof url !== 'string') { // typeof returns 'undefined' if url is not set
		alert('Ein Fehler in den Einstellungen ist aufgetreten. Bitte informieren Sie den Wahlverantwortlichen (Fehlernr.: 875766: URL nicht definiert oder kein String)');
		return;
	}
	myXmlSend_(url, null, callbackObject, callbackFunction, proxy, 'GET', log);
}


function myXmlSend_(url, data, callbackObject, callbackFunction, proxy, method, log) {
	if (url !== null) { // if url == null: an error occoured and retry was pressed
		myXmlSend_.url = url;
		myXmlSend_.data = data;
		myXmlSend_.callbackObject = callbackObject;
		myXmlSend_.callbackFunction = callbackFunction;
		myXmlSend_.proxy = proxy;
		myXmlSend_.method = method;
		myXmlSend_.log = log;
		unhidePopup();
	}
	var xml2 = new XMLHttpRequest();
	xml2.onload = function() { myXmlSend_.callbackFunction.call(myXmlSend_.callbackObject, xml2, myXmlSend_.url); };
	xml2.onerror = function(e) {
		// var t;
		// if (e instanceof Event) t = e.target.statusText;
		// else                    t = e.toString;
		// alert("error: (" + xml2.status + ") "+ xml2.statusText + "e: " + t);
		// this occures when
		// * certificate of https is not valid
		// * in chrome: protocol unknown
		// * server not found (DNS error)
		// unfortunately the status is in all cases 0
		// so we open a new window (pop-up) to show the problem to the user
		// + "\n" + 'click <a href="' + url +'" here</a>');};

		/*		  if (xml2.status == Components.results.NS_ERROR_UNKNOWN_HOST) {
		   alert("DNS error: " +  this.channel.status);
	     }
		 */		
		var errorDiv = document.getElementById("errorDiv");
		//window.frames['diagnosisIFrame'].document.location.href = url;
		var tmp   = '<div id="error"><h1>Es gab einen Fehler bei einer Verbindung zu einem Server.</h1>';
		var testurl;
		if (myXmlSend_.url.indexOf('?') > 0)	testurl = myXmlSend_.url + '&connectioncheck';
		else                                	testurl = myXmlSend_.url + '?connectioncheck';
		tmp = tmp + '<ul><li>Klicken Sie <a href="' + testurl + '" target="_blank">auf diesen Link, um die Verbindung zum Server manuell zu testen.</a> Der Link wird in einem neuen Fenster geöffnet.</li> <li>Beheben Sie das Problem,</li> <li>schließen Sie das neue Fenster und </li><li>klicken anschließend auf <button id="retry" name="retry" onclick="myXmlSend_(null, null, null, null)">erneut versuchen</button></li></ul></div>';
		tmp = tmp + '';
		errorDiv.innerHTML = tmp;
		// alert(errorDiv.innerHTML);
		errorDiv.style.display = ""; // this causes the div to be displayed (set to "none" to hide it)
		// setTimeout(window.scrollTo(0, 0), 1000); //wait till rendering is done
		window.scrollTo(0, 0);
		hidePopup();
		// var diagnosisControlDiv = document.getElementById("diagnosisControlDiv");

//		diagnosisControlDiv.innerHTML = '<button id="retry" name="retry" onclick="myXmlSend_(url, data, callbackObject, callbackFunction)">erneut versuchen</button>';
		// diagnosisControlDiv.style.display = "block";
		//diagnosisIFrame.innerHtml = '<iframe  srcdoc="<h1>TITEL</h1>" width="100%" height="80%">Your Browser does not support IFrames</iframe>';
		/*		var diagnosisWindow = window.open(myXmlSend_.url, "Diagnosis Window", "width=600,height=600,scrollbars=yes");
		diagnosisWindow.onLoad = function() { // funktioniert nicht, weil diagnosisWindow = null, wenn der Popup-blocker aktiv ist
			alert("jetz hat's geklappt");
		};
		 */	/*try {
			diagnosisWindow.focus();
		} catch (e) {
			if (e instanceof TypeError) { // Pop-Up-Window blocked
				alert('Es ist ein Fehler beim Aufbau einer Verbindung aufgetreten. Um den genauen Fehler anzuzeigen, wurde versucht, die Verbindung in einem neuen Fenster zu öffnen. Bitte lassen Sie das Pop-up-Fenster zu.');
			}
		} */
	};
	try {
		if (myXmlSend_.proxy && myXmlSend_.proxy.length > 0) {
//			var urlparts = URI.getParts(url);
			myXmlSend_.url = myXmlSend_.proxy + url; // urlparts.pathname + urlparts.search +urlparts.hash;
		}
		xml2.open(myXmlSend_.method, myXmlSend_.url, true);
		if (myXmlSend_.method == 'GET') xml2.setRequestHeader("If-Modified-Since", "Sat, 01 Jan 2005 00:00:00 GMT"); // if using GET the browser is generally allowed to cache the answer. But we want to make sure to get always the latest version
		/* unfortunately this does not work because setting requestHeader Host is prohibited for security reasons
		if (myXmlSend_.proxy && myXmlSend_.proxy.length > 0) {
			var urlparts = URI.getParts(url);
			var realhost = urlparts.host;
			xml2.setRequestHeader('Host', realhost);
		} */
		if ((myXmlSend_.data === null) || typeof myXmlSend_.data === 'undefined')	xml2.send();
		else 																		xml2.send(myXmlSend_.data);
		if (myXmlSend_.log) userlog("\r\n\r\n--> gesendet an Server " + myXmlSend_.url + ': ' + myXmlSend_.data + "\r\n\r\n");
		var errorDiv = document.getElementById("errorDiv");
		// var diagnosisControlDiv = document.getElementById("diagnosisControlDiv");
		errorDiv.style.display = "none";
		// diagnosisControlDiv.style.display = "none";
	} catch (e) { // this is thrown from ff if xml2.open fails because of a non existent protocol (like http oder https)
		// chrome calls xml2.onerror in this case
		// an old IE throws this for "permission dinied"
		// alert('Error trying to connect to ' + myXmlSend_.url + '\n' + e.toString());
		xml2.onerror(e);
	}
}


//myXmlSend.myRetry = function() {myXmlSend(url, data, callbackObject, callbackFunction);};

function parseServerAnswer(xml, jsonDecode) {
	if (xml.status != 200) { httpError(xml); }
	try {
		userlog("\n<--- empfangen:\n" + xml.responseText);
		var regex = /----vvvote----\n(.*)\n----vvvote----\n/g;
		var tmp = regex.exec(xml.responseText);
		if (tmp != null && 1 in  tmp)	tmp = tmp[1]; // found ----vvvote---- marker
		else 							tmp = xml.responseText; // use complete response if no marker found
		var data;
		if (jsonDecode) data = JSON.parse(tmp);
		else			data = tmp;
		return data;
	} catch (e) {
		// defined in exception.js
//		alert("ErrorInServerAnswer 2001, 'Error: could not JSON decode the server answer', 'Got from server: '" + xml.responseText);
		throw new ErrorInServerAnswer(2001, 'Error: could not JSON decode the server answer', 'Got from server: ' + xml.responseText);
		// 		return Object({'action':'clientError', 'errorText': "could not JSON decode: (" + e + ") \n" + dataString});

	}
}

function httpError(xml) {
	userlog("\n<--- empfangen Fehler " + xml.status + ": " + xml.statusText);
	alert("ErrorInServerAnswer(2000, 'Error: Server did not sent an answer', 'Got HTTP status: (" + xml.status + ") " + xml.statusText);
	throw new ErrorInServerAnswer(2000, 'Error: Server did not sent an answer', 'Got HTTP status: (' + xml.status + ') ' + xml.statusText);
}

/**
 * 
 * Working with up to 53 bits (more is not saved in a number [mantisse of a double])
 * @param num number to be converted to hex string
 * @param digits number of digits of the resulting hex string (padded this zeros)
 * @returns
 */
function int2hex(num, digits) {
	var h = Number(num).toString(16);
	var ret = ("000000000000000" + h).substr(-digits);
	return ret;
}

/**
 * @param str
 * @returns {String} a string where all not asci characters are encoded to \uXXXX resp. \UXXXXXXXX which is the default behavior of php so we need to do the same here in order to verify the hash
 */
function unicodeToBlackslashU(str) {
	var ret = '';
	for (var i = 0; i < str.length; ++i) {
		var unicode = str.charCodeAt(i);
		if ( (unicode < 128) ) { // && (unicode != 60)  && (unicode != 62) spitze Klammern werden von PHP 5.3 auch mit \u kodiert
			ret = ret + str.charAt(i);
		} else {
			if (unicode < 65536) {
				ret = ret + '\\u' + int2hex(unicode, 4);
			} else {
				ret = ret + '\\U' + int2hex(unicode, 8);
			}
		}
	}
	ret = ret.replace(/\//g,'\\/'); // php defaults to escaping '/' with a backslash to '\/'
	return ret;
}

/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 * taken from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * 
 */
function shuffleArray(arrayOrig) {
	array = arrayOrig.slice(0); // copy the array
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}


/**********************
 * Wiki Syntax to DOM
 */

function wikiSyntax2DOMFrag(wikisyntax_) {
	var wikisyntax = String(wikisyntax_); // necassary in case wikisyntax_ contains only of a number 
	// \n == \r\n --> <p>
	// \n* --> <ul><li>
	// \n= TEXT = --> <h1>
	// \n== TEXT == --> <h2>
	// \n=== TEXT === --> <h3>
	// \n==== TEXT ==== --> <h4>
	// \n===== TEXT ===== --> <h5>
	// \n====== TEXT ====== --> <h6>
	// \n# --> <ol><li>
	// '' --> <i>
	// ''' --> <b>
	// ''''' --> <i><b>
	// <u> --> <u>
	// <s> --> <strike>
	// new line ends the following formats: list, i, b, ib, h1, h2, h3, h4, h5, h6 =
	// new line does not end the following formats: p, <s>, <u>
	function charFormat(row, frag, openTag) {
		var tags = [{"wikiOpen": "''" , 'wikiClose': "''"  , 'html': 'em' },
		            {'wikiOpen': "'''", 'wikiClose': "'''" , 'html': 'strong' },
		            {'wikiOpen': "<s>", 'wikiClose': "</s>", 'html': 'del' },
		            {'wikiOpen': "<u>", 'wikiClose': "</u>", 'html': 'u' }
		            ];

		var firstmatch = Number.MAX_VALUE;
		var firstTag = '';
		var firstTagNo = -1;
		for (var tagNo = 0; tagNo < tags.length; tagNo++) {
			var pos = row.search(tags[tagNo].wikiOpen);
			if (pos >= 0 && firstmatch >= pos) {
				firstmatch = pos;
				firstTagNo = tagNo;
				firstTag = tags[tagNo].html;
			}
		}
		if (firstTag.length === 0) { // no tag found
			var e = document.createTextNode(row);
			return {"fragm": e, "openTags":''};
		} else { // tag found
			//find matching closing tag
			var secondMatch = row.substr(firstmatch + tags[firstTagNo].wikiOpen.length).search(tags[firstTagNo].wikiClose);
			// do some magic in order to solve the problem that ''' is matching '' and ''' - solve it the same way as the wiki does: look ahead if a later '' is there
			if (firstTag === 'em' && row.substr(firstmatch + tags[firstTagNo].wikiOpen.length).search("'''")) {
				var secondMatch2a = row.substr(firstmatch + tags[firstTagNo].wikiOpen.length + secondMatch + tags[firstTagNo].wikiClose.length).search("[^']" + tags[firstTagNo].wikiClose + "[^']");
				var secondMatch2b = row.substr(firstmatch + tags[firstTagNo].wikiOpen.length + secondMatch + tags[firstTagNo].wikiClose.length).search("[^']" + tags[firstTagNo].wikiClose + "$");
				if (secondMatch2a >= 0 || secondMatch2b >=0 ) {
					if (secondMatch2a < 0) secondMatch2a = Number.MAX_VALUE;
					if (secondMatch2b < 0) secondMatch2b = Number.MAX_VALUE;
					secondMatch = Math.min(secondMatch2a, secondMatch2b) + 1 + secondMatch + tags[firstTagNo].wikiClose.length;
				}
			}

			var fragm = document.createDocumentFragment();
			var beforeNode = document.createTextNode(row.substr(0, firstmatch));
			var taggedNode = document.createElement(tags[firstTagNo].html);
			var innerNode;
			if (secondMatch >= 0)	innerNode = charFormat(row.substr(firstmatch + tags[firstTagNo].wikiOpen.length, secondMatch));
			else					innerNode = charFormat(row.substr(firstmatch + tags[firstTagNo].wikiOpen.length));
			taggedNode.appendChild(innerNode.fragm);
			fragm.appendChild(beforeNode);
			fragm.appendChild(taggedNode);
			var openTags;
			if (secondMatch >= 0) { // closing tag found
				var afterNode  = charFormat(innerNode.openTags +'\uFEFF'+ row.substr(firstmatch + tags[firstTagNo].wikiOpen.length + secondMatch + tags[firstTagNo].wikiClose.length));
				fragm.appendChild(afterNode.fragm);
				openTags = afterNode.openTags;
			} else { // closing tag not found
				openTags = innerNode.openTags +'\uFEFF' + tags[firstTagNo].wikiOpen;
			}
			return {'fragm': fragm, 'openTags': openTags};
		}
		var e;
		if (tags[firstTagNo].html === openTag) { // closing tag found	
			e = document.createTextNode(row.substr(0, firstmatch));
			return e;
		} else { // opening tag found 									
			var secondPartInput = row.substr(firstmatch + tags[firstTagNo].wiki.length);
			if (secondPartInput.length > 0) e.appendChild(charFormat(secondPartInput, frag, '')); // TODO instead of '' use parent open tag
			if (firstmatch > 0)	e = document.createTextNode(row.substr(0, firstmatch+1));
			else				e = document.createElement(tags[firstTagNo].html);
			// if (e.appendChild(charFormat(row.substr(firstmatch + tags[firstTagNo].wiki.length), frag, tags[firstTagNo].html)));
			return e;
		}
	}

	/**
	 * remove open tags that are automatically closed on new line from list of open tags
	 * @param tags
	 * @returns
	 */
	function removeTagsAutomaticallyClosedOnNewLine(tags) {
		var closedTags = [/'''/g, /''/g];
		var ret = tags;
		for (var t=0; t<closedTags.length; t++) {
			ret = ret.replace(closedTags[t], '');	
		}
		ret = ret.replace(/\uFEFF\uFEFF/g, ''); // remove doubled separators
		return ret;
	}

	var fragm = document.createDocumentFragment();
	var rows = wikisyntax.split("\n");
	var whitespace = '';
	var ulLevel = 0;
	var olLevel = 0;
	var matched = false;
	var prevTag = '';
	var prevNode = document.createElement('div');
	var openTags = '';
	for (var rowNo in rows) {
		matched = false;
		if (rows[rowNo].substring(0, '* '.length) === '* ') { // unordered list item
			matched = true;
			if (prevTag !== 'li') {
				if (fragm !== prevNode)	fragm.appendChild(prevNode);
				prevNode = document.createElement('ul');
			}
			var li = document.createElement('li');
			var textn = document.createTextNode(rows[rowNo].substring(2));
			li.appendChild(textn);
			prevNode.appendChild(li);
			prevTag = 'li';
		}
		if (rows[rowNo].search(/====== (.*) ======/) >= 0) { // h6
			matched = true;
			var h = document.createElement('h6');
			var textn = document.createTextNode(rows[rowNo].replace(/====== (.*) ======/, "$1"));
			h.appendChild(textn);
			fragm.appendChild(h);
			prevNode = fragm;
			prevTag = "h6";
		}
		if (!matched && rows[rowNo].search(/===== (.*) =====/) >= 0) { // h5
			matched = true;
			var h = document.createElement('h5');
			var textn = document.createTextNode(rows[rowNo].replace(/===== (.*) =====/, "$1"));
			h.appendChild(textn);
			fragm.appendChild(h);
			prevNode = fragm;
			prevTag = "h5";
		}
		if (!matched && rows[rowNo].search(/==== (.*) ====/) >= 0) { // h4
			matched = true;
			var h = document.createElement('h4');
			var textn = document.createTextNode(rows[rowNo].replace(/==== (.*) ====/, "$1"));
			h.appendChild(textn);
			fragm.appendChild(h);
			prevNode = fragm;
			prevTag = "h4";
		}
		if (!matched && rows[rowNo].search(/=== (.*) ===/) >= 0) { // h3
			matched = true;
			var h = document.createElement('h3');
			var textn = document.createTextNode(rows[rowNo].replace(/=== (.*) ===/, "$1"));
			h.appendChild(textn);
			fragm.appendChild(h);
			prevNode = fragm;
			prevTag = "h3";
		}
		if (!matched && rows[rowNo].search(/== (.*) ==/) >= 0) { // h2
			matched = true;
			var h = document.createElement('h2');
			var textn = document.createTextNode(rows[rowNo].replace(/== (.*) ==/, "$1"));
			h.appendChild(textn);
			fragm.appendChild(h);
			prevNode = fragm;
			prevTag = "h2";
		}
		if (!matched && rows[rowNo].search(/= (.*) =/) >= 0) { // h1
			matched = true;
			var h = document.createElement('h1');
			var textn = document.createTextNode(rows[rowNo].replace(/= (.*) =/, "$1"));
			h.appendChild(textn);
			fragm.appendChild(h);
			prevNode = fragm;
			prevTag = "h1";
		}

		if (rows[rowNo].length == 0) { // new paragraph
			if (fragm !== prevNode)	fragm.appendChild(prevNode);
			prevNode = document.createElement('p');
			prevTag = 'p';
		}
		if (!matched) {  // no tag matched --> append a TextNode
			if (['li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(prevTag) >= 0) { // in this tags a new line ends the taged text
				if (fragm !== prevNode)	fragm.appendChild(prevNode);
				prevNode = fragm;
			}
			var textn = charFormat(whitespace + openTags + rows[rowNo], null, '');
			//var textn = document.createTextNode(' ' +rows[rowNo]);
			openTags = removeTagsAutomaticallyClosedOnNewLine(textn.openTags);
			prevNode.appendChild(textn.fragm);
			if (prevTag == 'p')	whitespace = ''; // do not insert a whitespace at the first line of a new paragraph
			else 				whitespace = ' '; // usually a new line is replaced by a space
			prevTag = '';
		}

	}
	if (fragm !== prevNode)	fragm.appendChild(prevNode);
	return fragm;
}

/**
 * table[row][col]: row=0 --> head, put DOM in the array (e.g. document.createTextNode('row 1 Column 1')
 */
function makeTableDOM(table){
	var tableNode = document.createElement('table');
	var theadNode = document.createElement('thead');
	var trNode = document.createElement('tr');
	for (var colNo=0; colNo<table[0].length; colNo++) {
		var tdNode = document.createElement('td');
		if ('attrib' in table[0][colNo]) {
			for (var aNo=0; aNo < table[0][colNo].attrib.length; aNo++ ) {
				tdNode.setAttribute(table[0][colNo].attrib[aNo].name, table[0][colNo].attrib[aNo].value);
			}
		}
		tdNode.appendChild(document.createTextNode(table[0][colNo].content));
		trNode.appendChild(tdNode);
	}
	theadNode.appendChild(trNode);
	tableNode.appendChild(theadNode);
	var tbodyNode = document.createElement('tbody');
	for (var rowNo=1; rowNo<table.length; rowNo++) {
		// mc = mc + '<p class="voteQuestion" id="voteQuestion'+tallyconfig.questions[qNo].questionID+'">' + tallyconfig.questions[qNo].questionWording + '</p>';
		var trNode = document.createElement('tr');
		for (var colNo=0; colNo<table[rowNo].length; colNo++) {
			var tdNode = document.createElement('td');
			if ('attrib' in table[rowNo][colNo]) {
				for (var aNo=0; aNo < table[rowNo][colNo].attrib.length; aNo++ ) {
					tdNode.setAttribute(table[rowNo][colNo].attrib[aNo].name, table[rowNo][colNo].attrib[aNo].value);
				}
			}
			tdNode.appendChild(table[rowNo][colNo].content);
			trNode.appendChild(tdNode);
		}
		tbodyNode.appendChild(trNode);

	}
	tableNode.appendChild(tbodyNode);
	return tableNode;
}

function radioBtnDOM(id, name, label, value, fieldSetNode, klasse) {
	var radioNode = document.createElement('input');
	radioNode.setAttribute('type', 'radio');
	radioNode.setAttribute('name', name);
	radioNode.setAttribute('id'  , id);
	radioNode.setAttribute('value'  , value);
	if (typeof klasse === 'string') radioNode.setAttribute('class', klasse);

	var labelNode = document.createElement('label');
	labelNode.setAttribute('for', id);
	labelNode.appendChild(document.createTextNode(label));
	if (typeof klasse === 'string') labelNode.setAttribute('class', klasse);

	fieldSetNode.appendChild(radioNode);
	fieldSetNode.appendChild(labelNode);
	return radioNode;
}


function buttonDOM(id, label, onclick, addTo, klasse) {
	var buttonNode= document.createElement('button');
	buttonNode.setAttribute('id'	  , id);
	buttonNode.setAttribute('onclick', onclick);
	if (typeof klasse === 'string') buttonNode.setAttribute('class', klasse);
	var buttonNodeTxt = document.createTextNode(label);
	buttonNode.appendChild(buttonNodeTxt);
	addTo.appendChild(buttonNode);
}

/*
element.style {
	display: block;
	height: 50px;
	overflow: hidden;
	}
 */

/***************
 * Langsames Aufklappen
 *  
 * 

<style>
        #container {

        }
        #content {
            background: silver;
            color: White;
            padding: 20px;
        }
        .slideShow .slideHide {            
          overflow-y: hidden;
          transition: max-height 0.5s ease-in-out;
        }  
    </style>
 */    
/**
 * Calculate the hight of the complete content 
 */
HTMLElement.prototype.ichCalculateNeededHeight = function() {
	var el = this;
	var tmp = el.style.maxHeight;
	el.style.maxHeight = '';
	var cs = getComputedStyle(el);
	el.ichNeededHeight = el.offsetHeight + 
		parseFloat(cs.getPropertyValue('margin-top')) + 
		parseFloat(cs.getPropertyValue('margin-bottom')); 
	el.style.maxHeight = tmp;
	if (tmp.length < 1) el.style.maxHeight = 0; // it must be a number in order to make scrolling-transition working 
};

/**
 * 
 * @param id id of the element to show or the element object itself
 */
function showElement(id) {
	var el;
	if (typeof id == 'string') 	el = document.getElementById(id);
	else 						el = id;
	if (! ('ichNeededHeight' in el)) el.ichCalculateNeededHeight(); 
	setTimeout(function() {
		el.classList.remove('slideHide');
		el.classList.add('slideShow');
		el.style.maxHeight = el.ichNeededHeight + 'px'; 
	}, 1);
}

function hideElement(id) {
	var el;
	if (typeof id == 'string') 	el = document.getElementById(id);
	else 						el = id;
	el.classList.remove('slideShow');
	el.classList.add('slideHide');
	el.style.maxHeight = '0px'; 
}

function isShown(id) {
	var el;
	if (typeof id == 'string') 	el = document.getElementById(id);
	else 						el = id;
	var ret = (parseInt(el.style.maxHeight) > 0);
	return ret;
}


/**
 * Call this if the height of a smoothly shrinking element has changed
 * @param id
 */
function adjustMaxHeight(id) {
	var el;
	if (typeof id == 'string') 	el = document.getElementById(id);
	else 						el = id;
	el.style.transition = 'max-height 0s';
	el.ichCalculateNeededHeight(); 
	setTimeout(function() {
		el.style.maxHeight = el.ichNeededHeight + 'px'; 
		el.style.transition = '';
	}, 1);
}



function html2Fragm(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

/**
 * get Html for waiting animation indicator
 */

function getWorkingAnimationHtml() {
	var ret = '<div class="uil-default-css">';
	for (var deg=0; deg<12; deg++) {
		ret = ret + '<div style="top:80px;left:93px;width:14px;height:40px;background:#00b2ff; translate(0,-60px);transform:rotate(' + deg * 30 + 'deg)   translate(0,-60px);border-radius:10px;position:absolute;"></div>';
	}
	ret = ret + '</div>';
	return ret;
}

/*
function getShowPopupHtml(innerHtml) {
	var ret = '<div id="modalbg" style="visibility:hidden;"></div>'; 
	ret = ret + '<div id="popup" style="visibility:hidden;">';
	ret = ret + innerHtml;
	ret = ret + '</div> </div>';
	return ret;
}
*/

function showPopup(fragm) {
	var div2 = document.createElement('div');
	div2.setAttribute('id', 'popup');
	div2.setAttribute('class', 'modal');
	div2.appendChild(fragm);
	var divContainer = document.createElement('div');
	divContainer.setAttribute('id', 'popupContainer');
	divContainer.setAttribute('class', 'popupContainer');
	divContainer.appendChild(div2);
	var div = document.createElement('div');
	div.setAttribute('id', 'modalbg');
	div.setAttribute('class', 'modalbg');
	div.appendChild(divContainer);
	var fragmMain = document.createDocumentFragment();
	fragmMain.appendChild(div);
	
	document.body.appendChild(fragmMain);
/*
	document.getElementById('modalbg').style='visibility:visible;';
	document.getElementById('popup').style='visibility:visible;';
	*/
}

function hidePopup() {
	var el = document.getElementById('modalbg');
	if (el != null) {
		document.getElementById('modalbg').className='';
		document.getElementById('modalbg').style="visibility:hidden;";
		document.getElementById('popup').className='';
		document.getElementById('popup').style="visibility:hidden;";
	}
}

function unhidePopup() {
	var el = document.getElementById('modalbg');
	if (el != null) {
		document.getElementById('modalbg').className='modalbg';
		document.getElementById('modalbg').style="visibility:visible;";
		document.getElementById('popup').className='modal';
		document.getElementById('popup').style="visibility:visible;";
	}
}


function removePopup() {
	var el = document.getElementById('modalbg');
	el.parentNode.removeChild(el);
}


function addQuoationMarksIfString(v) {
	if (typeof(v) === 'string') return "'" + v + "'"; 
	else                        return v;
}