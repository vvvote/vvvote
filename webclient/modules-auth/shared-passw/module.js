var SharedPasswAuth = function() {


};

SharedPasswAuth.getMainContent = function(conf) {
	var mc = '<div id="auth">' +
	'<form>' +
		'<br>' +
	'						<label for="electionId">Name der Abstimmung:</label> ' +
    '                            <input disabled="disabled" name="electionId" id="electionId" value="' + conf.electionId + '">' +
    '                       <br>' +
	'						<label for="voterId">Ihr Name:</label> ' +
	'		  				     <input name="voterId" id="voterId" value="pakki"> ' +
    '                       <br>' +
	'						<label for="sharedPassw">Wahlpasswort</label> ' +
	'						     <input name="sharedPassw" id="sharedPassw" value="pakki"></td>' + 
    '                       <br>' +
	'						<label for="reqPermiss"></label> ' +
	'						     <input type="submit" name="reqPermiss" id="reqPermiss" ' +
	'							  value="Wahlzettel holen" onclick="onGetPermClick();">' +
    '                       <br>' +
	'			<textarea name="log" rows=20 cols=80>Log:</textarea></td>' +
    '</form>' +
    '</div>';
	return mc;
}; 

SharedPasswAuth.getConfigObtainedHtml = function () {
	var ret = 'Teilen Sie den Wahlberechtigten auﬂerdem das Wahlpasswort mit.';
	return ret;
};