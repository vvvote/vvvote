/*
 * errorno start: 1000
 */

function GetElectionConfig(url, serverkeys, gotConfigObject, gotConfigMethod) {
	this.url = url;
	this.serverkey = serverkeys;
	this.onGotConfigObject = gotConfigObject;
	this.onGotConfigMethod = gotConfigMethod;
	try { // check the election-URL
		if ( this.url.indexOf('http://') !== 0 && this.url.indexOf('https://') !== 0 ) {
			throw new UserInputError(1000, i18n.gettext('Please enter a valid voting link. Valid voting links start with "http://" oder "https://".'), url);
		}
		var query = URI.parseURL(url); // tools/url/
		if (!query || !query.confighash) {
			if (query.electionUrl)	this.url = query.electionUrl; // if the webclient URL is given, it contains the link in electionUrl=
			else throw new UserInputError(1001, i18n.gettext("The given voting URL is not in the expected format (missing '?' or 'confighash=' resp. 'electionUrl=')"), url);
		}
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
			try {
				var config = parseServerAnswer(xml, true);
				if (config.cmd == 'error') throw new ServerReturnedAnError(1010, config.errorNo, config.errorTxt);
				// verify if the deliverd config matches the requested hash
				var query = URI.parseURL(this.url); 
				if (!query || !query.confighash) throw new UserInputError(1000, i18n.gettext("The given voting URL is not in the expected format (missing 'confighash=')."), this.url);
				if ( !(GetElectionConfig.generateConfigHash(config) === query.confighash)) throw new ErrorInServerAnswer(1080, i18n.gettext("The voting configuration obtained from the server does not match the checksum. The server is trying to cheat you. Aborted."), this.url); 
				// TODO verify config sigs
				this.onGotConfigMethod.call(this.onGotConfigObject, config);
			} catch (e) {
				if ((e instanceof ErrorInServerAnswer) && (e.errNo == 2001)) { // could not JSON decode
					// try to extract the confighash from the URL and try to get the electionconfig from a known server
					var query = URI.parseURL(this.url); 
					if (!query || !query.confighash) throw new UserInputError(1001, i18n.gettext("The given voting URL is not in the expected format (missing 'confighash=')."), this.url);
					var tmp = ClientConfig.electionConfigUrl + '?confighash=' + query.confighash;
					if (tmp !== this.url) this.url = tmp;
					else new UserInputError(1020, i18n.gettext("The voting configuration could not be loaded from the provided URL"), this.url);
					this.reqestElectionConfig();
				} else if (e instanceof MyException) { 
					e.alert();
					}
				else throw e;
			}
		}
};

/**
 * static methods
 * @returns {String}
 */
GetElectionConfig.getMainContent = function(buttontext, gotConfigObject, gotConfigMethod) {
	var  url = '';
	if (location.search.length > 1) {
		     url = ClientConfig.electionConfigUrl + location.search; //'http://www.webhod.ra/vvvote2/backend/getelectionconfig.php?confighash=34b71852f90d9c469530d27743da27c34b6795a30c7ef38cb016c613b134d76b';
	} 
	var maincontent = 
		'<div id="divElectionUrl">'+
		'	<form id="formGetelectionConfig">'+
		i18n.gettext('Voting link: ') +
		'			<input style="width:100%" name="electionUrl" id="electionUrlId" autocomplete="off" type="text" value="' + url +'">'+
		'		<input type="button" name="getelectionconfig" id="buttonElectionUrlId" value="' + buttontext + '"'+ 
		'			onclick="'+
		'				var a = document.getElementById(\'electionUrlId\');' + 
		'				new GetElectionConfig(a.value, null, ' + gotConfigObject + ', ' + gotConfigMethod + ');' +
		'				return false;">'+
		'	</form>'+
		'</div>';
	return maincontent;
};

GetElectionConfig.generateConfigHash = function (config) {
	var configOnly = JSON.parse(JSON.stringify(config)); 	// make a copy of the original config object 
	delete configOnly.cmd; // remove the cmd from the config
	delete configOnly.phase; // remove the phase info from the config
	var configstr = unicodeToBlackslashU(JSON.stringify(configOnly));
	var hash = SHA256(configstr);
    return hash; 
};

GetElectionConfig.submitForm = function() {
	var el = document.getElementById('buttonElectionUrlId');
	el.click();
};

