/**
 * replaces <> with - and :/\|?* with + because this are reserved characters on NTFS
 * @param fn
 * @returns
 */
function clearForFilename(fn) {
	return fn.replace('<', '-').replace('>', '-').replace(':', '+').replace('/','+').replace('\\','+').replace('|', '+').replace('?', '+').replace('*','+');
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

/**
 * 
 * @param url if url is set to null the parameters from the last call we be used
 * @param data
 * @param callbackObject
 * @param callbackFunction
 * @returns
 */
function myXmlSend(url, data, callbackObject, callbackFunction) {
	if (url != null) {
		myXmlSend.url = url;
		myXmlSend.data = data;
		myXmlSend.callbackObject = callbackObject;
		myXmlSend.callbackFunction = callbackFunction;
	}
	var xml2 = new XMLHttpRequest();
	xml2.onload = function() { myXmlSend.callbackFunction.call(myXmlSend.callbackObject, xml2, myXmlSend.url); };
	xml2.onerror = function(e) {
		var t;
		if (e instanceof Event) t = e.target.statusText;
		else                    t = e.toString;
		alert("error: (" + xml2.status + ") "+ xml2.statusText + "e: " + t);
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
		tmp = tmp + '<ul><li>Klicken Sie <a href="' + myXmlSend.url + '&connectioncheck' + '" target="_blank">auf diesen Link, um die Verbindung zum Server manuell zu testen.</a> Der Link wird in einem neuen Fenster geöffnet.</li> <li>Beheben Sie das Problem,</li> <li>schließen Sie das neue Fenster und </li><li>klicken anschließend auf <button id="retry" name="retry" onclick="myXmlSend(null, null, null, null)">erneut versuchen</button></li></ul></div>';
		tmp = tmp + '';
		errorDiv.innerHTML = tmp;
		// alert(errorDiv.innerHTML);
		errorDiv.style.display = ""; // this causes the div to be displayed (set to "none" to hide it)
		// setTimeout(window.scrollTo(0, 0), 1000); //wait till rendering is done
		window.scrollTo(0, 0);
		// var diagnosisControlDiv = document.getElementById("diagnosisControlDiv");

//		diagnosisControlDiv.innerHTML = '<button id="retry" name="retry" onclick="myXmlSend(url, data, callbackObject, callbackFunction)">erneut versuchen</button>';
		// diagnosisControlDiv.style.display = "block";
		//diagnosisIFrame.innerHtml = '<iframe  srcdoc="<h1>TITEL</h1>" width="100%" height="80%">Your Browser does not support IFrames</iframe>';
		/*		var diagnosisWindow = window.open(myXmlSend.url, "Diagnosis Window", "width=600,height=600,scrollbars=yes");
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
		xml2.open('POST', myXmlSend.url, true);
		xml2.send(myXmlSend.data);
		userlog("\n--> gesendet an Server " + myXmlSend.url + ': ' + myXmlSend.data + "\r\n\r\n");
		var errorDiv = document.getElementById("errorDiv");
		// var diagnosisControlDiv = document.getElementById("diagnosisControlDiv");
		errorDiv.style.display = "none";
		// diagnosisControlDiv.style.display = "none";
	} catch (e) { // this is thrown from ff if xml2.open fails because of a non existent protocol (like http oder https)
		// chrome calls xml2.onerror in this case
		// an old IE throws this for "permission dinied"
		// alert('Error trying to connect to ' + myXmlSend.url + '\n' + e.toString());
		xml2.onerror(e);
	}
}


// myXmlSend.myRetry = function() {myXmlSend(url, data, callbackObject, callbackFunction);};

function parseServerAnswer(xml) {
	if (xml.status != 200) {
		userlog("\n<--- empfangen Fehler " + xml.status + ": " + xml.statusText);
		alert("ErrorInServerAnswer(2000, 'Error: Server did not sent an answer', 'Got HTTP status: (' " + xml.status + ') ' + xml.statusText);
		throw new ErrorInServerAnswer(2000, 'Error: Server did not sent an answer', 'Got HTTP status: (' + xml.status + ') ' + xml.statusText);
	}
	try {
		userlog("\n<--- empfangen:\n" + xml.responseText);
		var data = JSON.parse(xml.responseText);
		return data;
	} catch (e) {
		// defined in exception.js
//		alert("ErrorInServerAnswer 2001, 'Error: could not JSON decode the server answer', 'Got from server: '" + xml.responseText);
		throw new ErrorInServerAnswer(2001, 'Error: could not JSON decode the server answer', 'Got from server: ' + xml.responseText);
		// 		return Object({'action':'clientError', 'errorText': "could not JSON decode: (" + e + ") \n" + dataString});

	}
}
