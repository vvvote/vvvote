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

function myXmlSend(url, data, callbackObject, callbackFunction) {
	var xml2 = new XMLHttpRequest();
	xml2.onload = function() { callbackFunction.call(callbackObject, xml2, url); };
	xml2.onerror = function(e) {
		alert("error: (" + xml2.status + ") "+ xml2.statusText + "e: " + e.target.status);
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
		var diagnosisIFrame = document.getElementById("diagnosisIFrame"); //src="' + url + '"
		//window.frames['diagnosisIFrame'].document.location.href = url;
		diagnosisIFrame.src = url;
		diagnosisIFrame.style.display = "";
		//diagnosisIFrame.innerHtml = '<iframe  srcdoc="<h1>TITEL</h1>" width="100%" height="80%">Your Browser does not support IFrames</iframe>';
		var diagnosisWindow = window.open(url, "Diagnosis Window", "width=600,height=600,scrollbars=yes");
/*		diagnosisWindow.onLoad = function() { // funktioniert nicht, weil diagnosisWindow = null, wenn der Popup-blocker aktiv ist
			alert("jetz hat's geklappt");
		};
	*/	try {
			diagnosisWindow.focus();
		} catch (e) {
			if (e instanceof TypeError) { // Pop-Up-Window blocked
				alert('Es ist ein Fehler beim Aufbau einer Verbindung aufgetreten. Um den genauen Fehler anzuzeigen, wurde versucht, die Verbindung in einem neuen Fenster zu öffnen. Bitte lassen Sie das Pop-up-Fenster zu.');
			}
		}
	};
	try {
		xml2.open('POST', url, true);
		userlog("\n--> gesendet an Server " + (url) + ': ' + data + "\r\n\r\n");
		xml2.send(data);
	} catch (e) { // this is thrown from ff if xml2.open fails because of a non existent protocol (like http oder https)
		// chrome calls xml2.onerror in this case
		alert('Error trying to connect to ' + url + '\n' + e.toString());
	}
}

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
