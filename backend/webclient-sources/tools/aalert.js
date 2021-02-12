/**
 * This replaces the alert() function which has restrictions on some browsers
 */

var aalert = {
  openHtml: function (title, message) {
		var htmlStr = message +
					'<p><button id="okbuttonid" type="button" autofocus="autofocus" onclick="removePopup();">' + 
					i18n.gettext('Ok') +
					'</button></p>';
		var fragm = html2Fragm(htmlStr);
		showPopup(fragm);
		var el = document.getElementById('okbuttonid');
		el.focus();
  },
  openTextOk: function (message) {
		var htmlStr = '<div id="popuptext" style="overflow:auto;max-height:80vh;"></div>';
		this.openHtml("", htmlStr);
		var el = document.getElementById('popuptext');
		el.innerText = message;
	  },
  close: function () {
    document.getElementById("dialog-wrap").style.display = "none";
  }
};
