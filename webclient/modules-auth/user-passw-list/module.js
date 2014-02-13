var UserPasswList = function() {



};

UserPasswList.getMainContent = function() {
	var element = document.getElementById('authUserPasswHtml'); // this is in index.html in order to have a substitute for heredoc
	mainContentUserPassw = element.innerHTML;
	return mainContentUserPassw;
}; 

UserPasswList.getNewElectionHtml = function () {
	var ret = 
		'Die W&auml;hler m&uuml;ssen sich mit Benutzername und Passwort anmelden. Laden Sie ein .csv-Datei hoch mit den Benutzernamen und den Passwörtern aller Stimmberechtigten <br>' +
		'<input type="file" id="userlist">' + 
		'<label for="userlist">Liste der Stimmberechtigten hochladen</label>';
	return ret;
};