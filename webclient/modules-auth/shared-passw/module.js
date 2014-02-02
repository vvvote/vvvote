var SharedPasswAuth = function() {


};

SharedPasswAuth.getMainContent = function(conf) {
	var mc = '<div id="auth">' +
	'<form onsubmit="return false;">' +
	'                       <br>' +
	'						<label for="electionId">Name der Abstimmung:</label> ' +
    '                            <input disabled="disabled" name="electionId" id="electionId" value="' + conf.electionId + '">' +
    '                       <br>' +
	'						<label for="voterId">Ihr Name:</label> ' +
	'		  				     <input name="voterId" id="voterId" value=""> ' +
    '                       <br>' +
	'						<label for="sharedPassw">Wahlpasswort</label> ' +
	'						     <input name="sharedPassw" id="secret" value="" type="password"></td>' + 
    '                       <br>' +
	'						<label for="reqPermiss"></label> ' +
	'						     <input type="submit" name="reqPermiss" id="reqPermiss" ' +
	'							  value="Wahlschein holen" onclick="onGetPermClick();">' +
    '                       <br>' +
    '</form>' +
    '</div>';
	return mc;
}; 

SharedPasswAuth.getConfigObtainedHtml = function () {
	var ret = 'Teilen Sie den Wahlberechtigten auﬂerdem das Wahlpasswort mit.';
	return ret;
};