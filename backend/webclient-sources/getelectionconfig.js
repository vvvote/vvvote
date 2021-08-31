/*
 * errorno start: 1000
 */

function GetElectionConfig(url, serverkeys, gotConfigObject, gotConfigMethod) {
	this.url = url;
	this.serverkey = serverkeys;
	this.onGotConfigObject = gotConfigObject;
	this.onGotConfigMethod = gotConfigMethod;
	try { 
		if (url !== null) {
			// check the election-URL
			if ( this.url.indexOf('http://') !== 0 && this.url.indexOf('https://') !== 0 ) {
				throw new UserInputError(1000, i18n.gettext('Please enter a valid voting link. Valid voting links start with "http://" oder "https://".'), url);
			}
			var query = URI.parseURL(url); // tools/url/
			if (!query || !query.confighash) {
				if (query.electionUrl)	this.url = query.electionUrl; // if the webclient URL is given, it contains the link in electionUrl=
				else throw new UserInputError(1001, i18n.gettext("The given voting URL is not in the expected format (missing '?' or 'confighash=' resp. 'electionUrl=')"), url);
			}
//			var sigsok = verifySigs(query); // TODO implement this
			this.reqestElectionConfig();
		}
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

		handleXmlAnswer: async function (xml) {
			try {
				var config = parseServerAnswer(xml, true);
				if (config.cmd == 'error') throw new ServerReturnedAnError(1010, config.errorNo, config.errorTxt);
				// verify if the deliverd config matches the requested hash
				var query = URI.parseURL(this.url); 
				if (!query || !query.confighash) throw new UserInputError(1000, i18n.gettext("The given voting URL is not in the expected format (missing 'confighash=')."), this.url);
				var hash_receivedConfig = await GetElectionConfig.generateConfigHash(config); 
				if ( !( hash_receivedConfig === query.confighash)) throw new ErrorInServerAnswer(1080, i18n.gettext("The voting configuration obtained from the server does not match the checksum. The server is trying to cheat you. Aborted."), this.url); 
				// verify sigs on election keys for each permission server
				this.verifyPermissionServerSigs(config);
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
		},

		
		verifyPermissionServerSigs: function(config) {
			try {
				this.config2verify = config;
				var me = this;
				this.oneSigInvalid = false;
				this.sigsValid = Array(config.questions.length);
				if (typeof config.questions === 'undefined') throw new ErrorInServerAnswer(876876873, i18n.gettext("Error: The config does not contain the questions"), '');
				for (var qNo = 0; qNo < config.questions.length; qNo++) { // for each question
					this.sigsValid[qNo] = Array(serverinfos.pkeys.length);
					for (var pServerNo = 0; pServerNo < serverinfos.pkeys.length; pServerNo++) { // for each permissionServer
						this.sigsValid[qNo][pServerNo] = false;
					}
					for (var pServerNo = 0; pServerNo < serverinfos.pkeys.length; pServerNo++) { // for each permissionServer
						if (typeof config.questions[qNo].blinderData === 'undefined') throw new ErrorInServerAnswer(876876874, i18n.gettext("Error: The config does not contain the blinder Data"), 'On question ' + qNo);
						if (typeof config.questions[qNo].blinderData.permissionServerKeys === 'undefined') throw new ErrorInServerAnswer(876876875, i18n.gettext("Error: The config does not contain the permission server keys"), '');
						if (typeof config.questions[qNo].blinderData.permissionServerKeys['PermissionServer' + (pServerNo +1)] === 'undefined') throw new ErrorInServerAnswer(876876876, i18n.gettext("Error: The config does not contain the permission server key"), 'PermissionServer' + (pServerNo +1));
						this.verifyPermissionServerSig(config.questions[qNo].blinderData.permissionServerKeys['PermissionServer' + (pServerNo +1)], serverinfos.pkeys[pServerNo], me, me.onSigValid, me.onSigInvalid, {'qNo': qNo, 'pServerNo': pServerNo});
					}
				} 
			} catch (e) {
				if (e instanceof MyException) e.alert();
				else throw e;
			}
		},
		
		
		verifyPermissionServerSig: function (signedKey, permanentKey, onObject, onSigValid, onSigInvalid, passthru){
			// import PermissionServer permanent key
			tmpPermanentKey = permanentKey;
			tmpPermanentKey.alg ="RS256";
			tmpPermanentKey.ext = true;
			window.crypto.subtle.importKey('jwk', tmpPermanentKey, 
					{name: 'RSASSA-PKCS1-v1_5', hash:{name: 'SHA-256'}}, true, ['verify'])
					.then(function(publickey) {	
						// verify the signatur over the new election key
						crypto.subtle.verify({'name': 'RSASSA-PKCS1-v1_5', hash:{name: 'SHA-256'}}, 
								publickey, 
								base64Url2ArrayBuf(signedKey.sig), 
								str2arrayBuf(unicodeToBlackslashU(JSON.stringify(signedKey.key))))
								.then(function(isvalid) {
									if (isvalid) {
									        try {
										        onSigValid.call(onObject, passthru);
										        // throw new ErrorInServerAnswer(1080, i18n.gettext("The voting configuration obtained from the server does not match the checksum. The server is trying to cheat you. Aborted."), this.url);
                                                                                } catch (e) {
                                                                                console.log(e);
                                                                                aalert.openTextOk("An error occured: " + e);
                                                                                }
									}
									
									else onSigInvalid.call(onObject, passthru, 'verified with isValid==false');
								})
								.catch(function(err) {
									console.log('verify-catch: ' + err);
									onSigInvalid.call(onObject, passthru, 'verify-catch: ' + err);
								});
					})
					.catch(function(err) {
						console.log('importkey-catch: ' + err);
						onSigInvalid.call(onObject, passthru, 'importkey-catch: ' + err);
					});
		},
		
		onSigValid: function(verifiedKey) {
			this.sigsValid[verifiedKey['qNo']][verifiedKey['pServerNo']] = true;
			if (! this.oneSigInvalid) {
				var allSigsValid = this.sigsValid[0][0];
				for (var qNo = 0; qNo < this.config2verify.questions.length; qNo++) { // for each question
					for (var pServerNo = 0; pServerNo < serverinfos.pkeys.length; pServerNo++) { // for each permissionServer
						allSigsValid = ( (allSigsValid === true) && (this.sigsValid[qNo][pServerNo] === true) );
						if (allSigsValid !== true) break;
					}
				}
				if (allSigsValid === true) this.onGotConfigMethod.call(this.onGotConfigObject, this.config2verify);
			}
		},
		
		onSigInvalid: function (verifiedKey, err) {
			this.sigsValid[verifiedKey['qNo']][verifiedKey['pServerNo']] = false;
			if (! this.oneSigInvalid) { // show the alert only once
				this.oneSigInvalid = true;
				var e = new ErrorInServerAnswer(10658, 'The signature from a permission server is not valid. Aborting.', 'question no. ' + verifiedKey['qNo'] + ', permission server no. ' + verifiedKey['pServerNo'], err);
				e.alert();
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
		'	<form id="formGetelectionConfig"><span class="txt">'+
		i18n.gettext('Voting link: ') +
		'			</span><input name="electionUrl" id="electionUrlId" autocomplete="off" type="text" value="' + url +'">'+
		'		<input type="button" class="orange_but" name="getelectionconfig" id="buttonElectionUrlId" value="' + buttontext + '"'+ 
		'			onclick="'+
		'				var a = document.getElementById(\'electionUrlId\');' + 
		'				new GetElectionConfig(a.value, null, ' + gotConfigObject + ', ' + gotConfigMethod + ');' +
		'				return false;">'+
		'	</form>'+
		'</div>';
	return maincontent;
};

GetElectionConfig.generateConfigHash = async function (config) {
	var configOnly = JSON.parse(JSON.stringify(config)); 	// make a copy of the original config object 
	delete configOnly.cmd; // remove the cmd from the config
	delete configOnly.phase; // remove the phase info from the config
	var configstr = unicodeToBlackslashU(JSON.stringify(configOnly));
	var hash = await SHA256(configstr);
    return hash; 
};

GetElectionConfig.submitForm = function() {
	var el = document.getElementById('buttonElectionUrlId');
	el.click();
};

