function GetElectionConfig(url, serverkeys, gotConfig) {
	this.url = url;
	this.serverkey = serverkeys;
	this.onGotConfig = gotConfig;
//	var kw = new URI(null, null);

	var pos = url.indexOf('?');
	if (pos > -1) {
		q = url.substring(pos + 1) || null;
	}
	var query = URI.parseQuery(q); // tools/url/
	if (!query || !query.confighash) return false; // TODO throw some error
	var sigsok = verifySigs(query); // TODO throw some error
	this.reqestElectionConfig();
	
}

GetElectionConfig.prototype = {
		reqestElectionConfig: function () {
			var me = this;
			var xml = new XMLHttpRequest();
			xml.open('GET', this.url, true);
			xml.onload = function() { me.handleXmlAnswer(xml);};
			// not used, using GET, var req = JSON.stringify(query);
			// xml.send(req);
			// xml.setRequestHeader("User-Agent","vvvote"); // remove the browser ID in order to garant anonymity
			// xml.setRequestHeader("Origin","vvvote"); // remove the browser ID in order to garant anonymity
			// For security behaviour of all browsers see http://code.google.com/p/browsersec/wiki/Part2#Same-origin_policy_for_XMLHttpRequest
			xml.send();
			// TODO Cross site scripting from local file is prohibited in chrome and in FireFox but works in Internet Explorer
		},

		handleXmlAnswer: function (xml) {
			var config = JSON.parse(xml.responseText);
			// TODO error handling
			// TODO verify the hash
			this.onGotConfig(config);
		},
		
		
};

/**
 * static methods
 * @returns {String}
 */
GetElectionConfig.getMainContent = function(gotconfig) {
	var maincontent = 
		'<div id="divElectionUrl">'+
		'<form>'+
		'Wahl-URL: '+
		'<input size="120" name="electionUrl" id="electionUrlId" type="text" value="http://www.webhod.ra/vvvote2/backend/getelectionconfig.php?confighash=aaaaaaa">'+
		'<input type="button" name="getelectionconfig" value="Hole Wahlunterlagen"'+ 
		   'onclick="'+
		      'var a = document.getElementById(\'electionUrlId\');' + 
		      'new GetElectionConfig(a.value, null, ' + gotconfig +');' +
		      'return false;">'+
		'</form>'+
		'</div>';
	return maincontent;
};


function verifySigs(query) {
	// TODO implement this
	return true;
	}





