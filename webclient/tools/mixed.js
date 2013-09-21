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

function myXmlSend(url, data, callbackObject, callbackFunction) {
	  var xml2 = new XMLHttpRequest();
	  xml2.open('POST', url, true);
	  xml2.onload = function() { callbackFunction.call(callbackObject, xml2); }; 
	  userlog("\n--> gesendet an Server " + (url) + ': ' + data + "\r\n\r\n");
	  xml2.send(data);
}

function parseServerAnswer(xml) {
	if (xml.status != 200) {
		userlog("\n<--- empfangen:\n " + xml.status);
		throw new ErrorInServerAnswer(2000, 'Error: Server did not sent an answer', 'Got HTTP status: ' + xml.status);
	}
	try {
		userlog("\n<--- empfangen:\n" + xml.responseText);
		var data = JSON.parse(xml.responseText);
		return data;
	} catch (e) {
		// defined in exception.js
		throw new ErrorInServerAnswer(2001, 'Error: could not JSON decode the server answer', 'Got from server: ' + xml.responseText);
		// 		return Object({'action':'clientError', 'errorText': "could not JSON decode: (" + e + ") \n" + dataString});

	}
}
