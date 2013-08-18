var UserPasswList = function() {



};

UserPasswList.getMainContent = function() {
	var element = document.getElementById('authUserPasswHtml'); // this is in index.html in order to have a substitute for heredoc
	mainContentUserPassw = element.innerHTML;
	return mainContentUserPassw;
}; 
