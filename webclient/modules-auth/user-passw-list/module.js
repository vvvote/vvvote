var UserPasswList = function() {



};

UserPasswList.getMainContent = function() {
	var mainContentUserPassw = 
		'<div id="auth">' +
		'	<form name="permission" method="post" onsubmit="return false;">' +
		'		<div align="center">' +
		'			<br>' +
		'			<table>' +
		'				<tr>' +
		'					<td>' +
		'						<table>' +
		'							<tr>' +
		'								<td>&nbsp;</td>' +
		'								<td align=right><font color=black> <b>ElectionId:</b>' +
		'								</font></td>' +
		'								<td><input name=electionId value=""></td>' +
		'								<td>&nbsp;</td>' +
		'							</tr>' +
		'							<tr>' +
		'								<td>&nbsp;</td>' +
		'								<td align=right><font color=black> <b>VoterId:</b>' +
		'								</font></td>' +
		'								<td><div id="divvoterid">' +
		'										<input name="voterId" id="voterId" value="">' +
		'									</div></td>' +
		'								<td>&nbsp;</td>' +
		'							</tr>' +
		'							<tr>' +
		'								<td>&nbsp;</td>' +
		'								<td align=right><b>Secret:</b></td>' +
		'								<td><input name="secret" id="secret" value="" type="password"></td>' +
		'								<td>&nbsp;</td>' +
		'							</tr>' +
		'							<tr>' +
		'								<td>&nbsp;</td>' +
		'								<td>&nbsp;</td>' +
		'								<td><input type="submit" name=reqPermiss' +
		'									value="Request ballot" onclick="onGetPermClick();"></td>' +
		'								<td>&nbsp;</td>' +
		'						</table>' +
		'					</td>' +
		'				</tr>' +
		'			</table>' +
		'		</div>' +
		'	</form>' +
		'<p><h2>Weitere technische Information</h2><br>' +
		'Der Wahlschein ist digital von mindestens 2 Servern unterschrieben. Diese Unterschrift führt dazu, dass der Wahlschein bei der Stimmabgabe akzeptiert wird.<br>' +
		'Der Wahlschein enthält eine eindeutige Wahlscheinnummer, die nur Ihr Computer kennt - sie wurde von Ihrem Computer erzeugt und verschlüsselt, bevor die Server den Wahlschein unterschrieben haben, und danach auf Ihrem Computer entschlÃ¼sselt (Man spricht von &quot;Blinded Signature&quot;). Die Server kennen daher die Wahlscheinnummer nicht.<br>' +
		'Man kann sich das so vorstellen:<br>' + 
		'Ihr Computer schreibt auf den Wahlschein die Wahlscheinnummer, die er sich selbst &quot;ausdenkt&quot; (Zufallszahl). Dieser Wahlschein wird zusammen mit einem Blatt Kohlepapier in einen Umschlag gelegt und an den Server geschickt.' + 
		'Der Server unterschreibt außen auf dem Umschlag (wenn Sie wahlberechtigt sind), so dass sich die Unterschrift durch das Kohlepapier auf Ihren Wahlschein überträgt. Ohne den Umschlag geöffnet zu haben (was der Server nicht kann, weil er den dafür notwendigen Schlüssel nicht kennt), schickt er den Brief an Ihren Computer zurück.' +
		'Ihr Computer öffnet den Umschlag (d.h. entschlüsselt die Wahlscheinnummer) und hält einen vom Server unterschriebenen Wahlschein in der Hand, deren Nummer der Server nicht kennt.  ' +
		'</p>' +
		'</div>';
	return mainContentUserPassw;
}; 

UserPasswList.getNewElectionHtml = function (serverId) {
	var ret = 
		'Die W&auml;hler m&uuml;ssen sich mit Benutzername und Passwort anmelden. Laden Sie ein .csv-Datei hoch mit den Benutzernamen und den Passwörtern aller Stimmberechtigten <br>' +
		'<input type="file" id="userlist">' + 
		'<label for="userlist">Liste der Stimmberechtigten hochladen</label>';
	return ret;
};



