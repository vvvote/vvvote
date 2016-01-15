
function translateServerError(errorNo, errorTxt) {
	listOfServerErrors = {
			"de": {
				"1": "Sie sind nicht in der Liste der Stimmberechtigten oder die Zugangsdaten sind falsch oder Sie haben dem Server nicht erlaubt, Ihre Stimmberechtigung zu prüfen.",
				"2": "Manipulationsversuch: Ihr Computer übermittelt einen falschen Namen der Abstimmung.",
				"3": "Die Phase der Erstellung von Wahlscheinen hat noch nicht begonnen.",
				"4": "Die Phase der Erstellung von Wahlscheinen ist bereits vorbei.",
				"5": "Die Phase der Stimmabgabe hat noch nicht begonnen.",
				"6": "Die Phase der Stimmabgabe ist bereits vorbei.",
				"7": "Das Abstimmungsergebnis kann erst abgerufen werden, wenn die Stimmabgabe beendet ist.",
				"8": "Das Abstimmungsergebnis kann nicht mehr abgerufen werden.",
				"9": "Aktuell ist nicht die Phase der Stimmabgabe.",
				"301": "Der Server hat Ihnen bereits einen Wahlschein für diese Abstimmung bestätigt. Für jeden Stimmberechtigten wird maximal ein Wahlschein bestätigt (d.h. vom Server digital unterschrieben).",
				"1102": "Bei dieser Abstimmung haben Sie bereits abgestimmt.",
				"2120": "Der Name der Abstimmung ist bereits vergeben.",
				"4000": "Die Abstimmung existiert nicht auf diesem Server. Vermutlich ist der Abstimmungslinklink falsch. Korrigieren Sie den Abstimmungslink und versuchen es erneut.", // confighash nicht gefunden
				"6000": "Eine Abstimmung mit dem übermittelten Namen existiert nicht auf diesem Server. Rufen Sie den Abstimmungslink direkt auf.", // electionId nicht gefunden
				"12000":"Sie haben diesem Server keine Erlaubnis erteilt, Ihre Stimmberechtigung beim Basisentscheid-Server zu prüfen. Erlauben Sie den Zugriff auf den Basisentscheid-Server und versuchen Sie es erneut."
			},
			"en": {
				"1": "Check of credentials failed. You are not in the list of allowed voters for this election or secret not accepted.",
				"2": "Cheating: Your computer sent a wrong name of voting.",
				"3": "The phase of creating voting certificates is yet to begin.",
				"4": "The phase of creating voting certificates has already ended.",
				"5": "The phase of casting votes is yet to begin.",
				"6": "The phase of casting votes has already ended.", 
				"7": "You can fetch the result of the voting only after the phase of casting votes has ended.",
				"8": "You cannot fetch the voting result anymore.",
				"9": "Now is not the phase of casting votes.",
				"301": "The server already confirmed a voting certificate for this voting for you. For every eligible voter, only one voting certificate will be confirmed (that means digitally signed by the server).",
				"1102": "You already have cast a vote for this voting.",
				"2120": "The name of the voting is already in use.",
				"4000": "The voting does not exist on the server. Most likely the voting link is wrong. Please correct it and try again.", // confighash nicht gefunden
				"6000": "A voting with the requested name does not exist on the server. Use the voting link directly.", // electionId nicht gefunden
				"4000": "Voting not found on this server. Verify you entered the correct voting url.",
				"6000": "A voting with the transmitted name does not exists on this server. Call the election URL directly.",
				"12000": "You did not allow this server to check your eligibility at the Basisentscheid server. Please allow this server to checkt your eligibility at the Basisentscheid server and try again."
			},
			"local": {
				"1": i18n.gettext("Check of credentials failed. You are not in the list of allowed voters for this election or secret not accepted."),
				"2": i18n.gettext("Cheating: Your computer sent a wrong name of voting."),
				"3": i18n.gettext("The phase of creating voting certificates is yet to begin."),
				"4": i18n.gettext("The phase of creating voting certificates has already ended."),
				"5": i18n.gettext("The phase of casting votes is yet to begin."),
				"6": i18n.gettext("The phase of casting votes has already ended."), 
				"7": i18n.gettext("You can fetch the result of the voting only after the phase of casting votes has ended."),
				"8": i18n.gettext("You cannot fetch the voting result anymore."),
				"9": i18n.gettext("Now is not the phase of casting votes."),
				"301": i18n.gettext("The server already confirmed a voting certificate for this voting for you. For every eligible voter, only one voting certificate will be confirmed (that means digitally signed by the server)."),
				"1102": i18n.gettext("You already have cast a vote for this voting."),
				"2120": i18n.gettext("The name of the voting is already in use."),
				"4000": i18n.gettext("The voting does not exist on the server. Most likely the voting link is wrong. Please correct it and try again."), // confighash nicht gefunden
				"6000": i18n.gettext("A voting with the requested name does not exist on the server. Use the voting link directly."), // electionId nicht gefunden
				"4000": i18n.gettext("Voting not found on this server. Verify you entered the correct voting url."),
				"6000": i18n.gettext("A voting with the transmitted name does not exists on this server. Call the election URL directly."),
				"12000": i18n.gettext("You did not allow this server to check your eligibility at the Basisentscheid server. Please allow this server to checkt your eligibility at the Basisentscheid server and try again.")
				
			}
	};

	
	if (errorNo in listOfServerErrors.local) {
		return listOfServerErrors.local[errorNo];
	} else {
		return errorTxt;
	}
};

