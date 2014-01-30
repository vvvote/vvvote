/*
 * errorno start: 1000
 */

function GetElectionConfig(url, serverkeys, gotConfigObject, gotConfigMethod) {
	this.url = url;
	this.serverkey = serverkeys;
	this.onGotConfigObject = gotConfigObject;
	this.onGotConfigMethod = gotConfigMethod;
//	var kw = new URI(null, null);
	try { // check the election-URL
		if ( this.url.indexOf('http://') !== 0 && this.url.indexOf('https://') !== 0 ) {
			throw new UserInputError(1000, "Bitte geben Sie einen gültigen Wahl-Link ein. Gültige Wahl-Links beginnen mit 'http://' oder 'https://'", url);
		}
		var pos = url.indexOf('?');
		var q;
		if (pos > -1) {
			q = url.substring(pos + 1) || null;
		} else {
			throw new UserInputError(1000, "The given election URL is not in the expected format (missing '?')", url);
		}

		var query = URI.parseQuery(q); // tools/url/
		if (!query || !query.confighash) throw new UserInputError(1000, "The given election URL is not in the expected format", url);
//		var sigsok = verifySigs(query); // TODO implement this
		this.reqestElectionConfig();
	} catch (e) {
		if (e instanceof MyException) { e.alert();}
		else throw e;
	}
}

GetElectionConfig.prototype = {
		reqestElectionConfig: function () {
			var me = this;
			myXmlSend(this.url + '&api', '', me, this.handleXmlAnswer);

		},

		handleXmlAnswer: function (xml) {
			var config = parseServerAnswer(xml);
			// TODO verify the hash
			// TODO verify config sigs
			this.onGotConfigMethod.call(this.onGotConfigObject, config);
		}
};

/**
 * static methods
 * @returns {String}
 */
GetElectionConfig.getMainContent = function(buttontext, gotConfigObject, gotConfigMethod) {
	// TODO get url from link in browser
	var  url = '';
	if (location.search.length > 1) {
		     url = electionConfigUrl + location.search; //'http://www.webhod.ra/vvvote2/backend/getelectionconfig.php?confighash=34b71852f90d9c469530d27743da27c34b6795a30c7ef38cb016c613b134d76b';
	} 
	var maincontent = 
		'<div id="divElectionUrl">'+
		'<form>'+
		'Wahl-Link: '+
		'<input style="width:60em" name="electionUrl" id="electionUrlId" type="text" value="' + url +'">'+
		'<input type="button" name="getelectionconfig" value="' + buttontext + '"'+ 
		'onclick="'+
		'var a = document.getElementById(\'electionUrlId\');' + 
		'new GetElectionConfig(a.value, null, ' + gotConfigObject + ', ' + gotConfigMethod + ');' +
		'return false;">'+
		'</form>'+
		'</div>';
	return maincontent;
};



