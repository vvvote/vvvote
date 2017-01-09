if (typeof translations === 'undefined') translations = [];
translations['de'] = 
{
   "domain": "messages",
   "locale_data": {
      "messages": {
         "": {
            "domain": "messages",
            "plural_forms": "nplurals=2; plural=(n != 1);",
            "lang": "de"
         },
         "Voting server": [
            "Abstimmserver"
         ],
         "Checking server": [
            "Kontrollserver",
            "Kontrollserver %d"
         ],
         "Please enter a valid voting link. Valid voting links start with \"http://\" oder \"https://\".": [
            "Bitte geben Sie einen gültigen Wahl-Link ein. Gültige Wahl-Links beginnen mit 'http://' oder 'https://'"
         ],
         "The given voting URL is not in the expected format (missing '?' or 'confighash=' resp. 'electionUrl=')": [
            "Der angebene Abstimmungslink ist nicht im erwarteten Format (\"?\" oder \"confighash=\" oder \"electionUrl=\" fehlt)."
         ],
         "The given voting URL is not in the expected format (missing 'confighash=').": [
            "Der angegebene Abstimmungslink ist nicht im erwarteten Format (\"confighash=\" fehlt)."
         ],
         "The voting configuration obtained from the server does not match the checksum. The server is trying to cheat you. Aborted.": [
            "Die Abstimmungskonfiguration, die der Server gesendet hat, passt nicht zur erwarteten Prüfsumme der Konfiguration. Dies deutet auf einen Betrugsversuch hin. Darum wurde der Vorgang wurde abgebrochen."
         ],
         "The voting configuration could not be loaded from the provided URL": [
            "Die Abstimmungskonfiguration konnte nicht vom angegebenen Link geladen werden."
         ],
         "Voting link: ": [
            "Abstimmungslink: "
         ],
         "Step 1: Enter voting link": [
            "Schritt 1: Abstimmungslink eingeben"
         ],
         "Step 2: Show the result": [
            "Schritt 2: Ergebnis anzeigen"
         ],
         "<p>Enter the link of the voting for which you want to see the results<br></p>": [
            "<p>Geben Sie den Link zu der Abstimmung ein, dessen Ergebnis Sie sehen wollen <br></p>"
         ],
         "Get voting results": [
            "Abstimmungsergebnis holen"
         ],
         "Get Voting Results": [
            "Abstimmungsergebnis holen"
         ],
         "Name of the voting: ": [
            "Name der Abstimmung: "
         ],
         "The voting requieres authorisation module >%s< which is not supported by this client.\nUse a compatible client.": [
            "Die Abstimmung erfordert das Autorisierungsmodul >%s<, das durch diesen Client nicht unterstützt wird.\nVerwenden Sie einen kompatiblen Client"
         ],
         "Your web browser %s %is not supported. Please use FireFox at least version 34, Chrome at least version 38 (except on Android) or Edge.": [
            "Ihr Browser %s %s wird nicht unterstützt. Bitte verwenden Sie FireFox ab Version 34, Chrome ab Version 38 (nicht auf Android) oder Edge."
         ],
         "Check of credentials failed. You are not in the list of allowed voters for this voting or secret not accepted.": [
            "Fehler bei der Überprüfung der Anmeldeinformationen. Sie sind nicht in der Liste der Stimmberechtigten oder die Zugangsdaten sind falsch oder Sie haben dem Server nicht erlaubt, Ihre Stimmberechtigung zu prüfen."
         ],
         "Cheating: Your computer sent a wrong name of voting.": [
            "Manipulationsversuch: Ihr Computer übermittelt einen falschen Namen der Abstimmung."
         ],
         "The phase of creating voting certificates is yet to begin.": [
            "Die Phase der Erstellung von Wahlscheinen hat noch nicht begonnen."
         ],
         "The phase of creating voting certificates has already ended.": [
            "Die Phase der Erstellung von Wahlscheinen ist bereits vorbei."
         ],
         "The phase of casting votes is yet to begin.": [
            "Die Phase der Stimmabgabe hat noch nicht begonnen."
         ],
         "The phase of casting votes has already ended.": [
            "Die Phase der Stimmabgabe ist bereits vorbei."
         ],
         "You can fetch the result of the voting only after the phase of casting votes has ended.": [
            "Das Abstimmungsergebnis kann erst abgerufen werden, wenn die Stimmabgabe beendet ist."
         ],
         "You cannot fetch the voting result anymore.": [
            "Das Abstimmungsergebnis kann nicht mehr abgerufen werden."
         ],
         "Now is not the phase of casting votes.": [
            "Aktuell ist nicht die Phase der Stimmabgabe."
         ],
         "The server already confirmed a voting certificate for this voting for you. For every eligible voter, only one voting certificate will be confirmed (that means digitally signed by the server).": [
            "Der Server hat Ihnen bereits einen Wahlschein für diese Abstimmung bestätigt. Für jeden Stimmberechtigten wird maximal ein Wahlschein bestätigt (d.h. vom Server digital unterschrieben)."
         ],
         "You already have cast a vote for this voting.": [
            "Bei dieser Abstimmung haben Sie bereits abgestimmt."
         ],
         "The name of the voting is already in use.": [
            "Der Name der Abstimmung ist bereits vergeben."
         ],
         "The voting does not exist on the server. Most likely the voting link is wrong. Please correct it and try again.": [
            "Die Abstimmung existiert nicht auf diesem Server. Vermutlich ist der Abstimmungslinklink falsch. Korrigieren Sie den Abstimmungslink und versuchen es erneut."
         ],
         "A voting with the requested name does not exist on the server. Use the voting link directly.": [
            "Eine Abstimmung mit dem übermittelten Namen existiert nicht auf diesem Server. Rufen Sie den Abstimmungslink direkt auf."
         ],
         "You did not allow this server to check your eligibility at the identity server. Please allow this server to checkt your eligibility at the identity server and try again.": [
            "Sie haben diesem Server keine Erlaubnis erteilt, Ihre Stimmberechtigung beim Identitätsserver zu prüfen. Erlauben Sie den Zugriff auf den Identitätsserver und versuchen Sie es erneut."
         ],
         "The voters will be identified by a token and the eligibility will be verified by this token.<br>": [
            "Die W&auml;hler werden über ein Token identifiziert und die Wahlberechtigung gepr&uuml;ft.<br>"
         ],
         "Steps: ": [
            "Schritte: "
         ],
         "Authorize voting server": [
            "Abstimmserver autorisieren"
         ],
         "Authorize checking server": [
            "Kontrollserver autorisieren"
         ],
         "Create voting certificate": [
            "Wahlschein erstellen"
         ],
         "Configuration error: serverId >%s< is asked for, but not configured": [
            "Konfigurationsfehler: Server-ID >%s< wurde angefordert, ist aber nicht konfiguriert."
         ],
         "Step %s: ": [
            "Schritt %s"
         ],
         "Authorize %s": [
            "%s autorisieren"
         ],
         "Authorization succeeded": [
            "Autorisierung war erfolgreich"
         ],
         "Name me publicly as ": [
            "Mich &ouml;ffentlich anzeigen als"
         ],
         "Using the an identity server (which is specifical designed to work with vvvote), a list of eligible voters is created on the identity server for each voting date. Enter the ID of this list.<br>": [
            "Bei Verwendung eines speziellen Identitätsservers (der für die Zusammenarbeit mit Vvvote programmiert wurde), kann eine Liste der Stimmberechtigten für jedes Abstimmungsdatum erstellt werden. Geben Sie hier die ID dieser Liste ein.<br>"
         ],
         "ID of the list of eligible voters": [
            "ID der Liste, die die Abstimmungsberechtigten enth&auml;lt"
         ],
         "Your name:": [
            "Ihr Name:"
         ],
         "Voting password:": [
            "Abstimmungspasswort:"
         ],
         "Additionally, tell the eligible voters the voting password.": [
            "Teilen Sie den Stimmberechtigten außerdem das Abstimmunspasswort mit."
         ],
         "The voters enter thier name and can only cast their vote if they know the password given here. Everyone who knows the password can cast his vote.<br>": [
            "Die W&auml;hler geben ihren Namen ein und k&ouml;nnen nur dann abstimmen, wenn sie das hier festgelegte Abstimmungspasswort kennen. Es kann also jeder abstimmen, der das Abstimmungspasswort kennt.<br>"
         ],
         "Voting password": [
            "Abstimmungspasswort"
         ],
         "Verification of server signature failed. Aborted.": [
            "Die Überprüfung einer Unterschrift von einem Server ist fehlgeschlagen. Abbruch."
         ],
         "The following questionID is missing in the server answer: ": [
            "Die folgende questionID fehlt in der Antwort vom Server: "
         ],
         "A Signature does not belong to the server we sent the data to in order to let the server sign it.": [
            "Die Unterschrift gehört nicht zu dem Server, zu dem die Daten zur Unterschrift gesendet wurden."
         ],
         "Expected: >%s<, received: >%s<": [
            "Erwartet: >%s<, empfangen: >%s<"
         ],
         "I already got enough sigs but server said: 'more sigs needed': \n%s": [
            "Bereits genug Serverunterschriften erhalten, aber der Server sagt: 'weitere Unterschriften benötoigt':\n%s"
         ],
         "unknown server cmd: %s": [
            "Unbekanntes Kommando vom Server: %s"
         ],
         "An unknown system error occured: %s": [
            "Ein unbekannter Systemfehler ist aufgetreten: %s"
         ],
         "an exception occured: %s": [
            "Eine Exception ist aufgetreten: %s"
         ],
         "%s has rejected your request (error no  %d):\n %s": [
            "%s hat Ihr Anliegen zurückgewiesen (Fehlernr. %d):\n%s"
         ],
         "Client found error:\n %s": [
            "Die lokale Webanwendung hat den folgenden Fehler festgestellt:\n%s"
         ],
         "handleXmlAnswer(): Internal program error, got unknown action: %s": [
            "Interner Progammfehler in der Webanwendung: handleXmlAnswer(): eine unbekannte Aktion >%s< wude angefordert."
         ],
         "Voting certificate %s": [
            "Wahlschein %s"
         ],
         "In order to be able to cast your vote, you have to save your voting certificate on your device now": [
            "Damit Sie später Ihre Stimme senden können, müssen Sie jetzt den Wahlschein als Datei auf Ihrem Gerät abspeichern."
         ],
         "Creating voting certificate": [
            "Erstelle Wahlschein"
         ],
         "<ul><li>You will get voting certificae in the form of a webpage file as result of this step.</li><li>Please remember where you saved it.</li><li>The voting certificate is neccesary in order to cast the vote. There is no way getting a replacement for it. Thus, save it securely till the end of the voting.</li></ul>": [
            "<ul>\n\t<li>Als Ergebnis dieses Schrittes erhalten Sie einen Wahlschein in Form einer Webseiten-Datei.</li>\n\t<li>Merken Sie sich bitte, wo Sie die Datei speichern.</li>\n\t<li>Der Wahlschein wird benötigt, um die Stimme abzugeben und kann nicht ersetzt werden. Daher wird empfohlen, den Wahlschein bis zum Ende der Abstimmung zu sichern.</li>\n</ul>"
         ],
         "<p><h2>Technical information</h2>The voting certificate is digitally signed by at least two servers. This signatures makes the certificate valid for voting. <br> The voting certificate contains an unique certificate number which is only known by your device - it was generated by your device and encrypted before it was sent and signed by the servers. Your device decrypts thes certificate number together with the server's signatures (This procedure is called &quot;Blinded Signature&quot;). Thus, the servers do not know the certificate number. <br> You can imagine it as follows:<br>  Your device generates a long random number (a unique number) and writes it on a sheet of paper. Your device lays a sheet of carbon-paper on this sheet, puts them together in an envelope, seals it and sends it to the servers. The servers sign on the outside of the envelope, in case you are entitled to vote. By doing so, the signature is transferred to the sheet containing the certificate number because of the carbon-paper. The servers do not open the envelope (which they cannot do, because they do not know the needed key), and send the envelope back to your device. Your device opens (decrypts) the envelope. In result, your device has a sheet of paper containing a unique certificate number and the signatures of the servers, but the servers do not know this number.The unique number together with the server's signatures and the ballot is called >voting certificate<.</p>": [
            "<p><h2>Weitere technische Information</h2>\nDer Wahlschein ist digital von mindestens 2 Servern unterschrieben. Diese Unterschrift führt dazu, dass der Wahlschein bei der Stimmabgabe akzeptiert wird.<br>\nDer Wahlschein enth&auml;lt eine eindeutige Wahlscheinnummer, die nur Ihr Computer kennt - sie wurde von Ihrem Computer erzeugt und verschl&uuml;sselt, bevor die Server den Wahlschein unterschrieben haben, und danach auf Ihrem Computer entschl&uuml;sselt (Man spricht von &quot;Blinded Signature&quot;). Die Server kennen daher die Wahlscheinnummer nicht.<br>\nMan kann sich das so vorstellen:<br>\nIhr Computer schreibt auf den Wahlschein die Wahlscheinnummer, die er sich selbst &quot;ausdenkt&quot; (Zufallszahl). Dieser Wahlschein wird zusammen mit einem Blatt Kohlepapier in einen Umschlag gelegt und an den Server geschickt. \nDer Server unterschreibt außen auf dem Umschlag (wenn Sie wahlberechtigt sind), so dass sich die Unterschrift durch das Kohlepapier auf Ihren Wahlschein &uuml;berträgt. Ohne den Umschlag ge&ouml;ffnet zu haben (was der Server nicht kann, weil er den daf&uuml;r notwendigen Schl&uuml;ssel nicht kennt), schickt er den Brief an Ihren Computer zur&uuml;ck. \nIhr Computer &ouml;ffnet den Umschlag (d.h. entschl&uuml;sselt die Wahlscheinnummer) und h&auml;lt einen vom Server unterschriebenen Wahlschein in der Hand, deren Nummer der Server nicht kennt. \n</p>"
         ],
         "Please load the voter certification file": [
            "Bitte laden Sie die Datei, in der Ihr Wahlschein gespeichert ist:"
         ],
         "<h2>Voting certificate generated.</h2><p id=\"didSaveButtonsId\">Did you save the voting certificate on your devide?<br><button id=\"savedReturnEnvelope\" onclick=\"page.blinder.onUserDidSaveReturnEnvelope();\" >Yes</button>&emsp;<button id=\"didNotSaveReturnEnvelope\" onclick=\"page.blinder.saveReturnEnvelope();\" >No</button></p><p><ul id=\"howToVoteId\" style=\"display:none\"><li>You got a voting certificate in the form of a webpage file which you saved on your device.</li><li>Please remember the place where you saved it.</li><li>The voting certificate is needed in order to cast the vote. There is no way obaining a new one. Thus, save it securly till the end of the voting.</li><li>In order to cast a vote, open the voting certificate in a web browser. You can do this by double clicking it in the file explorer.</li><li>Everyone who has the voting certificate can use it to cast the vote - thus do not pass it on</li><li>Casting the vote using the voting certificate is anonymous. That means, as long as you do not help, nobody can find out who sent the vote.</li><li>%s</li></ul></p>": [
            "<h2>Wahlschein erfolgreich erstellt. </h2>\n<p id=\"didSaveButtonsId\">Haben Sie den Wahlschein als Datei auf Ihrem Gerät gespeichert?<br>\n<button id=\"savedReturnEnvelope\" onclick=\"page.blinder.onUserDidSaveReturnEnvelope();\" >Ja</button>\n&emsp;<button id=\"didNotSaveReturnEnvelope\" onclick=\"page.blinder.saveReturnEnvelope();\" >Nein</button>\n</p><p><ul id=\"howToVoteId\" style=\"display:none\">\n<li>Sie haben einen Wahlschein in Form einer Webseiten-Datei erhalten, die Sie auf ihrem Computer gespeichert haben.</li>\n<li>Merken Sie sich bitte, wo Sie die Datei gespeichert haben.</li>\n<li>Der Wahlschein wird benötigt, um die Stimme abzugeben und kann nicht ersetzt werden. Daher wird empfohlen, den Wahlschein bis zum Ende der Abstimmung zu sichern.</li>\n<li>Zum Abstimmen &ouml;ffnen Sie den Wahlschein im Internet-Browser. \nEine M&ouml;glichkeit dazu ist: Klicken Sie im Datei-Explorer doppelt auf die Wahlschein-Datei.</li>\n<li>Der Wahlschein berechtigt zur Stimmabgabe - geben Sie ihn also nicht \nweiter! Die Stimmabgabe damit ist anonym, d.h. ohne Ihre Mithilfe kann nicht festgestellt werden, von wem die Stimme abgegeben wurde.</li>\n<li>%s</li>\n</ul></p>"
         ],
         "Error: voting certificate data not found": [
            "Fehler: Wahlscheindaten nicht gefunden"
         ],
         "Error: voting certificate data could not be read: JSON decode failed": [
            "Fehler: Wahlscheindaten konnten nicht gelesen werden: JSON decode gescheitert"
         ],
         "The voter certificate is not consistent": [
            "Der Wahlschein ist inkonsistent"
         ],
         "The signature on the vote is correct. This means that the vote is unchanged.": [
            "Die Unterschrift unter der Stimme ist korrekt, d.h. die Stimme wurde nicht verändert."
         ],
         "The signature on the vote is not correct. This means that the vote is changed or the key does not match.": [
            "Die Unterschrift unter der Stimme ist nicht korrekt, d.h. die Stimme wurde verändert oder der Schlüssel passt nicht."
         ],
         "Error verifying a signature:\nThe number of signatures on the voting certificate is not correct. \nRequired number: %d, number in this voting certificate: %d": [
            "Fehler beim überprüfen der Signatur:\nDie Anzahl der Unterschriften unter dem Wahlschein ist nicht korrekt.\nErforderliche Anzahl: %d, Anzahl Unterschriften bei diesem Wahlschein: %d"
         ],
         "The vote is not for this election (Election IDs do not match).": [
            "Die Stimme ist nicht für diese Abstimmung (Election-IDs stimmen nicht überein)."
         ],
         "The vote is not for this election (Question ID not found in election configuration).": [
            "Die Stimme ist nicht für diese Abstimmung (Question ID in der Abstimmungskonfiguration nicht gefunden)"
         ],
         "The signature by the permission server >%s< for the voting key is correct. This means, the server has confirmed that the according voter is entitled to vote.": [
            "Die Unterschrift von Stimmberechtigungsserver >%s< für den Abstimmungsschlüssel ist korrekt, d.h. der Server hat bestätigt, dass der zugehörige Wähler stimmberechtigt ist."
         ],
         "The signature by permission server >%s< for the voting key is not correct. Either the configuration is wrong or there is a fraud. Please inform the persons responsible for the voting": [
            "Die Unterschrift von Stimmberechtigungsserver >%s< für den Abstimmungsschlüssel ist nicht korrekt. Es liegt entweder eine falsche Konfiguration oder ein Betrugsversuch vor. Bitte die Wahlverantwortlichen informieren."
         ],
         "Error verifying the signature:\n%s": [
            "Fehler beim Überprüfen der Signatur:\n%s"
         ],
         "For voter >%s< the server >%s< returns a different order of signatures than server >%s<.": [
            "Fehler beim überprüfen der Signatur:\nBei Wähler >%s< gibt Server >%s< eine anderen Reihenfolge der Unterschriften an als Server >%s<"
         ],
         "Motion group": [
            "Antragsgruppe"
         ],
         "Motion title": [
            "Antragstitel"
         ],
         "Action": [
            "Aktion"
         ],
         "Show &amp; <br>vote": [
            "Anzeigen &amp;<br>abstimmen"
         ],
         "Hide": [
            "Verbergen"
         ],
         "Client does not support voting scheme >%s<": [
            "Dieser Client unterstützt das Abstimmschema >%s< nicht"
         ],
         "Motion text": [
            "Antragstext"
         ],
         "Initiator: %s": [
            "Antragsteller: %s",
            "Antragsteller: %s"
         ],
         "Summary": [
            "Zusammenfassung"
         ],
         "Reasons": [
            "Begründung"
         ],
         "Error 238u8": [
            "Fehler 238u8"
         ],
         "Vote casting is closed": [
            "Stimmabgabe nicht mehr möglich"
         ],
         "Cast vote!": [
            "Stimme senden!"
         ],
         "Vote casting starts at %s": [
            "Stimme senden ab %s möglich"
         ],
         "Vote accepted": [
            "Stimme akzeptiert"
         ],
         "The server accepted your vote.": [
            "Der Server hat Ihre Stimme akzeptiert."
         ],
         "<p>You cannot fetch the result as long as vote casting is possible.</p>": [
            "<p>Das Ergebnis kann nicht abgerufen werden, so lange Stimmen abgegeben werden können.</p>"
         ],
         "Show all votes": [
            "Alle Stimmen ansehen"
         ],
         "Error: Expected >showWinners< or >error<": [
            "Fehler: ertwartet: >showWinners< oder >error<"
         ],
         "Got from server: %s": [
            "Vom Server empfangen: %s"
         ],
         "Something did not work: %s": [
            "Irgendwas hat nicht geklappt: %s"
         ],
         "In motion group %s, no motion got the requiered number of votes. ": [
            "Bei Antragsgruppe %s hat kein Antrag die erforderliche Mehrheit erreicht. "
         ],
         "Motion %s": [
            "Antrag %s"
         ],
         " and ": [
            " und "
         ],
         "In motion group %s, %s won. ": [
            "Bei Antragsgruppe %s wurde %s angemommen.",
            "Bei Antragsgruppe %s wurden %s angemommen."
         ],
         "Close": [
            "Schließen"
         ],
         "Votes on %s ": [
            "Stimmen zu %s"
         ],
         "motion %s": [
            "Antrag %s"
         ],
         "Yes/No": [
            "Ja/Nein"
         ],
         "Score": [
            "Bewertung"
         ],
         "Picked": [
            "Ausgewählt"
         ],
         "Scheme not supported": [
            "Abstimmungsschema nicht unterstützt"
         ],
         "Voting number": [
            "Stimmnummer"
         ],
         "Verify!": [
            "Prüfen!"
         ],
         "Error": [
            "Fehler"
         ],
         "invalid": [
            "ungültig"
         ],
         "Yes": [
            "Ja"
         ],
         "No": [
            "Nein"
         ],
         "Abst.": [
            "Enth."
         ],
         " - my vote": [
            " - meine Stimme"
         ],
         "Verify signatures!": [
            "Unterschriften pr&uuml;fen!"
         ],
         "Number of YESs": [
            "Anzahl Ja"
         ],
         "Number of NOs": [
            "Anzahl Nein"
         ],
         "Number of absten.": [
            "Anzahl Enth."
         ],
         "Sum of scores": [
            "Summe Bewertungen"
         ],
         "Number picked": [
            "Anzahl ausgewählt"
         ],
         "Not Supported voting scheme": [
            "Nicht unterstütztes Abstimmungsschema"
         ],
         "Voting scheme not supported": [
            "Abstimmungsschema wird nicht unterstützt"
         ],
         "Motion group: %s": [
            "Antragsgruppe %s"
         ],
         "Question to be voted on": [
            "Frage, über die abgestimmt werden soll"
         ],
         "The server did not accept the vote. It says:\n%s": [
            "Der Server hat die Stimme nicht akzeptiert. Er meldet:\n%s"
         ],
         "Error: Expected >saveYourCountedVote<": [
            "Fehler: erwartete >saveYourCountedVote< vom Server"
         ],
         "decryption of server answer failed: %s": [
            "Entschlüsselung der Serverantwort ist fehlgeschlagen: %s"
         ],
         "Thank you for voting!": [
            "Vielen Dank f&uuml;r Ihre Stimme!"
         ],
         "Server accepted the vote!": [
            "Stimme wurde vom Server akzeptiert!"
         ],
         "<p>As long as it is possible to cast votes, it is not possible to get the voting result.</p>": [
            "<p>Solange Stimmen abgegeben werden können, kann das Wahlergebnis nicht abgerufen werden.</p>"
         ],
         "The server does not reveal the result. It answers:\n %s": [
            "Der Server gibt das Abstimmungsergebnis nicht bekannt. Er meldet:\n%s"
         ],
         "Error: Expected >verifyCountVotes<": [
            "Fehler: erwartete >verifyCountVotes<"
         ],
         "Error: unexpected var type": [
            "Fehler: Unerwarteter Variablentyp"
         ],
         "details: %s": [
            "Details: %s"
         ],
         "Error: some error occured": [
            "Fehler: ein Fehler ist aufgetreten"
         ],
         "Number of Votes": [
            "Anzahl Stimmen"
         ],
         "Total": [
            "Gesamt"
         ],
         "Step 1: Set voting preferences": [
            "Schritt 1: Abstimmungseinstellungen festlegen"
         ],
         "Step 2: Save voting link": [
            "Schritt 2: Abstimmungslink speichern"
         ],
         "Here you can create a new voting. In order to do so, fill in the name of the voting and set the preferences for the authorization mechanism. <br><br>": [
            "Hier k&ouml;nnen Sie eine neue Abstimmung starten. Zum Anlegen einer neuen Abstimmung legen Sie den Namen der Abstimmung und die Authorisierungsmethode fest. <br><br>"
         ],
         "Name of voting": [
            "Name der Abstimmung"
         ],
         "Vote on": [
            "Abstimmen über"
         ],
         "predefined test voting items": [
            "Voreingestellte Testabstimmungen"
         ],
         "Enter a question to vote on": [
            "Eine Frage zur Abstimmung eingeben"
         ],
         "Autorization method": [
            "Autorisierungsmethode"
         ],
         "External token verification": [
            "Externe Tokenabfrage"
         ],
         "Upload a list of usernames and passwords": [
            "Liste mit Benuzernamen und Passwörtern hochladen"
         ],
         "Create new voting": [
            "Neue Abstimmung anlegen"
         ],
         "Open a new voting": [
            "Neue Abstimmung anlegen"
         ],
         "Waiting for the servers": [
            "Auf Server warten"
         ],
         "Save the link and distribute it to all eligable people. ": [
            "Speichern Sie den Link und geben Sie ihn an alle Stimmberechtigten weiter. "
         ],
         "This is the voting link: ": [
            "Der Link zur Abstimmung ist: "
         ],
         "Server reports error: \n": [
            "Server meldet folgenden Fehler: \n"
         ],
         "Online Voting: anonymous ballots and traceable": [
            "Online Abstimmung: anonym und nachvollziehbar"
         ],
         "Take part in a voting": [
            "An Abstimmung teilnehmen"
         ],
         "Fetch result": [
            "Ergebnis abrufen"
         ],
         "Procedure": [
            "So geht's"
         ],
         "Show explanations and technical information": [
            "Erklärungen und technische Informationen anzeigen"
         ],
         "Step 2: Authorize": [
            "Schritt 2: Autorisieren"
         ],
         "Step 3: Vote": [
            "Schritt 3: Abstimmen"
         ],
         "Enter Voting Link": [
            "Abstimmungslink eingeben"
         ],
         "<p><ul><li>I yet do not have a voting certificate</li><li>For this voting no voting certificate is needed</li><li>I do not know wheather a voting vertificate is needed</li></ul>": [
            "<p><ul><li>Ich habe noch keinen Wahlschein</li><li>f&uuml;r die Wahl wird kein Wahlschein ben&ouml;tigt</li><li>Ich wei&szlig; nicht, ob f&uuml;r die Wahl ein Wahlschein ben&ouml;tigt wird</li></ul>"
         ],
         "Fetch voting properties": [
            "Wahlunterlagen holen"
         ],
         "I already have a voting certificate": [
            "Ich habe bereits einen Wahlschein"
         ],
         "Take part in voting": [
            "An Abstimmung teilnehmen"
         ],
         "It is not possible anymore to create a voting certificate": [
            "Es ist nicht mehr möglich, einen Wahlschein zu erstellen"
         ],
         "The voting requires blinding module >%s< which is not supported by this client.\nUse a compatible client.": [
            "Die Abstimmung erfordert das Verblindungsmodul >%s<, welches von diesem Client nicht unterstützt wird.\nVerwenden Sie einen kompatiblen Client."
         ],
         "Name of voting:": [
            "Name der Abstimmung:"
         ],
         "The voting requires authorisation module >%s< which is not supported by this client.\nUse a compatible client.": [
            "Die Abstimmung erfordert das Autorisierungsmodul >%s<, welches von diesem Client nicht unterstützt wird.\nVerwenden Sie einen kompatiblen Client."
         ],
         "Generate voting certificate and save it": [
            "Wahlschein erzeugen und speichern"
         ],
         "Voting mode >%s< is not supported by this client": [
            "Abstimmunsmodus >%s< wird vom Client nicht unterstützt"
         ],
         "The voting certificate is not valid": [
            "Der Wahlschein ist nicht gültig"
         ],
         "You directly opened the voting certificate, but you have to save it as file on your device.": [
            "Sie haben den Wahlschein direkt geöffnet. Sie müssen ihn aber als Datei auf Ihrem Gerät speichern."
         ],
         "Error r83g83": [
            "Fehler r83g83"
         ],
         "You can cast your vote from now on and without any time limit.": [
            "Ab sofort können Sie Ihre Stimme ohne zeitliche Einschränkung abgeben."
         ],
         "You can cast your vote from now on until before %s.": [
            "Ab sofort bis vor %s Uhr können Sie Ihre Stimme abgeben."
         ],
         "You can cast your vote from %s until before %s.": [
            "Von %s Uhr bis vor %s Uhr können Sie Ihre Stimme abgeben."
         ],
         "It is not possible anymore to cast your vote.": [
            "Es gibt keine Möglichkeit mehr, Ihre Stimme abzugeben."
         ],
         "voting\u0004Best option": [
            "Beste Möglichkeit"
         ],
         "voting\u0004Acceptance": [
            "Zustimmung"
         ],
         "voting\u0004Yes": [
            "Ja"
         ],
         "voting\u0004No": [
            "Nein"
         ],
         "voting\u0004Abstentation": [
            "Enthaltung"
         ],
         "voting\u0004Scores": [
            "Bewertungspunkte"
         ],
         "List_of_Votes\u0004Vote": [
            "Stimme"
         ]
      }
   }
}; 
