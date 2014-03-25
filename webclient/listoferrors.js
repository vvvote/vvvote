
function translateServerError(errorNo, errorTxt) {
	if (errorNo in listOfServerErrors.de) {
		return listOfServerErrors.de[errorNo];
	} else {
		return errorTxt;
	}
}

listOfServerErrors = {
		"de": {
			"1": "Sie sind nicht in der Liste der Stimmberechtigten oder die Zugangsdaten sind falsch oder Sie haben dem Server nicht erlaubt, Ihre Stimmberechtigung zu prüfen.",
			"2": "Manipulationsversuch: Ihr Computer übermittelt einen falschen Namen der Abstimmung.",
			"301": "Der Server hat Ihnen bereits einen Wahlschein für diese Abstimmung bestätigt. Für jeden Stimmberechtigten wird maximal ein Wahlschein bestätigt (d.h. vom Server digital unterschrieben).",
			"1102": "Bei dieser Abstimmung haben Sie bereits abgestimmt.",
			"2120": "Der Name der Abstimmung ist bereits vergeben.",
			"4000": "Die Abstimmung existiert nicht auf diesem Server. Vermutlich ist der Wahl-Link falsch. Korrigieren Sie den Wahl-Link und versuchen es erneut.", // confighash nicht gefunden
			"6000": "Eine Abstimmung mit dem übermittelten Namen existiert nicht auf diesem Server. Rufen Sie den Wahl-Link direkt auf.", // electionId nicht gefunden
			"12000":"Sie haben diesem Server keine Erlaubnis erteilt, Ihre Stimmberechtigung beim Basisentscheid-Server zu prüfen. Erlauben Sie den Zugriff auf den Basisentscheid-Server und versuchen Sie es erneut."
		},
		"en": {
			"1": "check of credentials failed. You are not in the list of allowed voters for this election or secret not accepted",
			"4000": "Election not found on this server. Verify you entered the correct election url.",
			"6000": "An election with the transmitted name does not exists on this server. Call the election url directly.",
			"12000": "Voter not found. Please login in into OAuth2 server and allow access to this server."
		}
};