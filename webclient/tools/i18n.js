
// find best localization
localizationName = '';
// exact match of most preferred language
if (typeof(navigator.language) !== 'undefined'  && typeof (translations[navigator.language.replace('-', '_')]) !== 'undefined') localizationName = navigator.language.replace('-', '_')
else {
	if (typeof(navigator.userLanguage) !== 'undefined') { // IE system language
		// IE exact match
		if (typeof (translations[navigator.userLanguage.replace('-', '_')]) !== 'undefined') localizationName = navigator.userLanguage.replace('-', '_');
		else { // match the language only
			var langOnlyTrans = Object.keys(translations).map(function(e) {return e.split('_')[0]});
				if (typeof(langOnlyTrans[navigator.userLanguage.split('-')[0]]) !== 'undefined') localizationName = navigator.userLanguage('-')[0];
			}	
		}
	 // firefox and chrome provide a list of prefered localizations
	if (typeof(navigator.languages) !== 'undefined') {
		for (var i=0; i<navigator.languages.length; i++) {
			if (typeof(translations[navigator.languages[i].replace('-', '_')]) !== 'undefined') { localizationName = navigator.languages[i].replace('-', '_'); break;}
		}
		if (localizationName === '') { // no exact match -> try language only
			var langOnlyTrans = Object.keys(translations).map(function(e) {return e.split('_')[0];});
			for (var i=0; i<navigator.languages.length; i++) {
				if (typeof(langOnlyTrans[navigator.languages[i].split('-')[0]]) !== 'undefined') { localizationName = navigator.languagesplit('-')[0]; break;}
			}
		}
	}
	if (localizationName === '') localizationName = Object.keys(translations)[0]; // fall back to the first translation if no other information about the preferred language is available 
}

i18n = new Jed(translations[localizationName]);


function changeLanguage(locale) {
	i18n = new Jed(translations[locale]);
	newElectionPage.setLanguage();
	votePage.setLanguage();
	getResultPage.setLanguage();
	page.display();
}

