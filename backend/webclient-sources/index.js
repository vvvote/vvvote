
/**
 * shows/hides the additional technical info div
 */
	function onToggleTechInfosSwitch() {
		var el=document.getElementById('techinfocheckbox');
		var el2=document.getElementById('techinfos');
		if (el.checked) {
			el2.style.display='';
		} else {
			el2.style.display='none';
		}
	}
	
	function userlog(log) {
	  var element = document.getElementById('logtextarea'); 
	  element.value = element.value + log;
	}

	// var maincontent = ''; //GetElectionConfig.getMainContent();
	// maincontent = startVoting();
	
	var newElectionPage = new NewElectionPage();
	var votePage        = new VotePage();
	var getResultPage   = new GetResultPage();
	
	var page = votePage;
	
	function checkBrowser() {
		var parser = new UAParser(); 
		var browser = parser.getBrowser();
		var os = parser.getOS().name.toUpperCase();
		var browsName = browser.name.toUpperCase();
		if (!(   (browsName.indexOf('FIREFOX')  >= 0) // as creating the return envelope cannot be retried, make sure only tested browsers are used 
			  || (browsName.indexOf('CHROME')   >= 0) // chrome in android actually works, but the saved returnEnvelope is very hard to open whereas this is no problem in firefox for android 
			  || (browsName.indexOf('CHROMIUM') >= 0) // chrome in android actually works, but the saved returnEnvelope is very hard to open whereas this is no problem in firefox for android 
			  || (browsName.indexOf('OPERA')    >= 0) 
			  || (browsName.indexOf('IE')       >= 0)
			  || (browsName.indexOf('EDGE')     >= 0)
		   ) ) {
			showPopup(html2Fragm(i18n.sprintf(i18n.gettext('Your web browser %s %is not supported. Please use FireFox at least version 34, Chrome at least version 38 (except on Android) or Edge. Do not use iPad or iPhone (iOS)'), browsName, browser.major)));
		} else { // check browser version
			if (   (browsName.indexOf('SAFARI')   >=0 ) // safari 5: everything is working but (a) saving the return envelope and (b) webCrypto is supported from 8 (according to https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) 
				|| (browsName.indexOf('FIREFOX')  >= 0 && browser.major < 34) // 21 is enough for all but webcrypto API which is supported from 34 onwards		
				|| (browsName.indexOf('CHROME')   >= 0 && (browser.major < 38 || os.indexOf('ANDROID') >= 0)) // chrome in android actually works, but the saved returnEnvelope is very hard to open whereas this is no problem in firefox for android		
				|| (browsName.indexOf('CHROMIUM') >= 0 && (browser.major < 38 || os.indexOf('ANDROID') >= 0)) // chrome in android actually works, but the saved returnEnvelope is very hard to open whereas this is no problem in firefox for android		
				|| (browsName.indexOf('OPERA')    >= 0 && browser.major < 34) // 11 was enough wothout WebCrypto, in 34 the webCrypto is working		
				|| (browsName.indexOf('IE')       >= 0 && browser.major < 12)	// in IE 11 everything is working but webcrypto API. 	
				|| (browsName.indexOf('EDGE')     >= 0 && browser.major < 12)	// Edge is working completely
				|| (os === 'IOS') // on iPad and iPhone (iOS) no browser can save the return envelope as download
			   ) {
				showPopup(html2Fragm(i18n.sprintf(i18n.gettext('Your web browser %s %is on %s not supported. Please use FireFox at least version 34, Chrome at least version 38 (except on Android) or Edge. iPad and iPhone (iOS) does not work at all. MacOS works.'), browsName, browser.major, os)));
			}
		}
	}

	function checkBrowserReturnEnvelope() {
		var parser = new UAParser(); 
		var browser = parser.getBrowser(); // this check is more for convinience in order to avoid user retry and frustration
		if (   (browser.name.toUpperCase().indexOf('SAFARI')   >= 0 && browser.major <  8)  // safari 5: everything is working but saving the return envelope, WebCrypto API is available from version 8 onwards 
			|| (browser.name.toUpperCase().indexOf('FIREFOX')  >= 0 && browser.major < 21)		
			|| (browser.name.toUpperCase().indexOf('CHROME')   >= 0 && browser.major < 38)		
			|| (browser.name.toUpperCase().indexOf('CHROMIUM') >= 0 && browser.major < 38)		
			|| (browser.name.toUpperCase().indexOf('OPERA')    >= 0 && browser.major < 11)		
			|| (browser.name.toUpperCase().indexOf('IE')       >= 0 && browser.major < 12) // in IE 11 everything is working but webCryptoAPI		
			|| (browser.name.toUpperCase().indexOf('EDGE')     >= 0 && browser.major < 12)		
		   ) {
			showPopup(html2Fragm(i18n.sprintf(i18n.gettext('Your web browser %s %is not supported. Please use FireFox at least version 34, Chrome at least version 38 (except on Android) or Edge.'), browsName, browser.major)));
		}
	}

	function onWebsiteLoad() {
		
		var langs = document.getElementById('locale_select').children;
		var i = ArrayIndexOf(langs, 'value', localizationName);
		langs[i].selected = true;
		
		page.display();
		if (location.search.length > 1 && typeof firstload == 'undefined' && location.search.indexOf('confighash') >= 0) {
			firstload = false;
			// do not show the "new election" menu if confighash is set in url
			var el = document.getElementById('newElectionLink');
			el.setAttribute('style', 'display:none');
			
			if (location.search.indexOf('showresult') >=0) page = getResultPage;
			else                                           page = votePage; // TODO read phase from config and
		    page.display();
	    	 // var me = this;
			 // new GetElectionConfig(a.value, null, me, me.onGotElectionConfig);
	        GetElectionConfig.submitForm();
	    	// TODO read phase from config and load votePage(generatePermssion), votePage(submitVote), getresult()
		}
		if ('returnEnvelope' in window) { // this is the return envelope
			 checkBrowserReturnEnvelope();
			 // do not show the "new election" menu in return envelope
			 var el = document.getElementById('newElectionLink');
			 el.setAttribute('style', 'display:none');

			 // switch to vote page - it is the default page anyway
	    	 //  page = votePage; 
		     //  page.display();
		     
		     // load the config and show the options
		     // votePage.display automatically checks if returnEnvelope is set
		    // BlindedVoterElection.onImportPermission(returnEnvelope);
		} else {
			checkBrowser();
		}
	}
	