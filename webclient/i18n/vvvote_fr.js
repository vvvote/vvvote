if (typeof translations === 'undefined') translations = [];
translations['fr'] = 
{
   "domain": "messages",
   "locale_data": {
      "messages": {
         "": {
            "domain": "messages",
            "plural_forms": "nplurals=2; plural=(n > 1);",
            "lang": "fr"
         },
         "Voting server": [
            ""
         ],
         "Checking server": [
            "",
            ""
         ],
         "Please enter a valid voting link. Valid voting links start with \"http://\" oder \"https://\".": [
            ""
         ],
         "The given voting URL is not in the expected format (missing '?' or 'confighash=' resp. 'electionUrl=')": [
            ""
         ],
         "The given voting URL is not in the expected format (missing 'confighash=').": [
            ""
         ],
         "The voting configuration obtained from the server does not match the checksum. The server is trying to cheat you. Aborted.": [
            ""
         ],
         "The voting configuration could not be loaded from the provided URL": [
            ""
         ],
         "Voting link: ": [
            ""
         ],
         "Step 1: Enter voting link": [
            "Etape 1: Entrez le lien de la votation"
         ],
         "Step 2: Show the result": [
            "Étape 2: Afficher le résultat"
         ],
         "<p>Enter the link of the voting for which you want to see the results<br></p>": [
            "<p> Entrez le lien de la votatiom pour laquelle vous voulez voir les résultats </ p>"
         ],
         "Get voting results": [
            "Obtenez les résultats des votations"
         ],
         "Get Voting Results": [
            "Obtenez les résultats des votations"
         ],
         "Name of the voting: ": [
            "Nom de la votation:"
         ],
         "The voting requieres authorisation module >%s< which is not supported by this client.\nUse a compatible client.": [
            "Le vote exige le module d'autorisation  >%s< qui n'est pas pris en charge par ce client.\nUtilisez un client compatible."
         ],
         "Your web browser %s %is not supported. Please use FireFox at least version 34, Chrome at least version 38 (except on Android) or Edge.": [
            ""
         ],
         "Check of credentials failed. You are not in the list of allowed voters for this voting or secret not accepted.": [
            ""
         ],
         "Cheating: Your computer sent a wrong name of voting.": [
            ""
         ],
         "The phase of creating voting certificates is yet to begin.": [
            ""
         ],
         "The phase of creating voting certificates has already ended.": [
            ""
         ],
         "The phase of casting votes is yet to begin.": [
            ""
         ],
         "The phase of casting votes has already ended.": [
            ""
         ],
         "You can fetch the result of the voting only after the phase of casting votes has ended.": [
            ""
         ],
         "You cannot fetch the voting result anymore.": [
            ""
         ],
         "Now is not the phase of casting votes.": [
            ""
         ],
         "The server already confirmed a voting certificate for this voting for you. For every eligible voter, only one voting certificate will be confirmed (that means digitally signed by the server).": [
            ""
         ],
         "You already have cast a vote for this voting.": [
            ""
         ],
         "The name of the voting is already in use.": [
            ""
         ],
         "The voting does not exist on the server. Most likely the voting link is wrong. Please correct it and try again.": [
            ""
         ],
         "A voting with the requested name does not exist on the server. Use the voting link directly.": [
            ""
         ],
         "You did not allow this server to check your eligibility at the Basisentscheid server. Please allow this server to checkt your eligibility at the Basisentscheid server and try again.": [
            ""
         ],
         "The voters will be identified by a token and the eligibility will be verified by this token.<br>": [
            ""
         ],
         "Steps: ": [
            ""
         ],
         "Authorize voting server": [
            ""
         ],
         "Authorize checking server": [
            ""
         ],
         "Create voting certificate": [
            ""
         ],
         "Step %s: ": [
            ""
         ],
         "Authorize %s": [
            ""
         ],
         "Authorization succeeded": [
            ""
         ],
         "Name me publicly as ": [
            ""
         ],
         "Using the Basisentscheid Online (BEO), a list of eligible voters is created on the BEO server for each voting date. Enter the ID of this list.<br>": [
            ""
         ],
         "ID of the list of eligible voters": [
            ""
         ],
         "Your name:": [
            ""
         ],
         "Voting password:": [
            ""
         ],
         "Additionally, tell the eligible voters the voting password.": [
            ""
         ],
         "The voters enter thier name and can only cast their vote if they know the password given here. Everyone who knows the password can cast his vote.<br>": [
            ""
         ],
         "Voting password": [
            ""
         ],
         "Verification of server signature failed. Aborted.": [
            ""
         ],
         "The following questionID is missing in the server answer: ": [
            ""
         ],
         "A Signature does not belong to the server we sent the data to in order to let the server sign it.": [
            ""
         ],
         "Expected: >%s<, received: >%s<": [
            ""
         ],
         "I already got enough sigs but server said: 'more sigs needed': \n%s": [
            ""
         ],
         "unknown server cmd: %s": [
            ""
         ],
         "An unknown system error occured: %s": [
            ""
         ],
         "an exception occured: %s": [
            ""
         ],
         "%s has rejected your request (error no  %d):\n %s": [
            "%s a rejeté votre demande (error no %d):\n%s"
         ],
         "Voting certificate %s": [
            "Certificat de droit de vote %s"
         ],
         "In order to be able to cast your vote, you have to save your voting certificate on your device now": [
            "Afin de pouvoir pour voter, vous devez enregistrer votre certificat de vote sur votre appareil maintenant"
         ],
         "Creating voting certificate": [
            "Création de certificat de vote"
         ],
         "<ul><li>You will get voting certificae in the form of a webpage file as result of this step.</li><li>Please remember where you saved it.</li><li>The voting certificate is neccesary in order to cast the vote. There is no way getting a replacement for it. Thus, save it securely till the end of the voting.</li></ul>": [
            ""
         ],
         "<p><h2>Technical information</h2>The voting certificate is digitally signed by at least two servers. This signatures makes the certificate valid for voting. <br> The voting certificate contains an unique certificate number which is only known by your device - it was generated by your device and encrypted before it was sent and signed by the servers. Your device decrypts thes certificate number together with the server's signatures (This procedure is called &quot;Blinded Signature&quot;). Thus, the servers do not know the certificate number. <br> You can imagine it as follows:<br>  Your device generates a long random number (a unique number) and writes it on a sheet of paper. Your device lays a sheet of carbon-paper on this sheet, puts them together in an envelope, seals it and sends it to the servers. The servers sign on the outside of the envelope, in case you are entitled to vote. By doing so, the signature is transferred to the sheet containing the certificate number because of the carbon-paper. The servers do not open the envelope (which they cannot do, because they do not know the needed key), and send the envelope back to your device. Your device opens (decrypts) the envelope. In result, your device has a sheet of paper containing a unique certificate number and the signatures of the servers, but the servers do not know this number.The unique number together with the server's signatures and the ballot is called >voting certificate<.</p>": [
            ""
         ],
         "Please load the voter certification file": [
            "S'il vous plaît charger le fichier de certificat d'électeur"
         ],
         "<h2>Voting certificate generated.</h2><p id=\"didSaveButtonsId\">Did you save the voting certificate on your devide?<br><button id=\"savedReturnEnvelope\" onclick=\"page.blinder.onUserDidSaveReturnEnvelope();\" >Yes</button>&emsp;<button id=\"didNotSaveReturnEnvelope\" onclick=\"page.blinder.saveReturnEnvelope();\" >No</button></p><p><ul id=\"howToVoteId\" style=\"display:none\"><li>You got a voting certificate in the form of a webpage file which you saved on your device.</li><li>Please remember the place where you saved it.</li><li>The voting certificate is needed in order to cast the vote. There is no way obaining a new one. Thus, save it securly till the end of the voting.</li><li>In order to cast a vote, open the voting certificate in a web browser. You can do this by double clicking it in the file explorer.</li><li>Everyone who has the voting certificate can use it to cast the vote - thus do not pass it on</li><li>Casting the vote using the voting certificate is anonymous. That means, as long as you do not help, nobody can find out who sent the vote.</li><li>%s</li></ul></p>": [
            ""
         ],
         "Error: voting certificate data not found": [
            "Erreur: Les données de certificat de vote sont introuvables"
         ],
         "Error: voting certificate data could not be read: JSON decode failed": [
            "Erreur: Les données de certificat de vote ne pouvaient être lues: JSON décodage échoué"
         ],
         "The voter certificate is not consistent": [
            "Le certificat de vote n'est pas conforme"
         ],
         "The signature on the vote is correct. This means that the vote is unchanged.": [
            "La signature sur le vote est correcte. Cela signifie que le vote n'a pas été manipulé."
         ],
         "The signature on the vote is not correct. This means that the vote is changed or the key does not match.": [
            "La signature sur le vote n'est pas correct. Cela signifie que le vote a été modifié ou la clé ne correspond pas."
         ],
         "Error verifying a signature:\nThe number of signatures on the voting certificate is not correct. \nRequired number: %d, number in this voting certificate: %d": [
            ""
         ],
         "The signature by the permission server >%s< for the voting key is correct. This means, the server has confirmed that the according voter is entitled to vote.": [
            "La signature par le serveur d'autorisation >%s< pour la clé de vote est correcte. Cela signifie, le serveur a confirmé que l'électeur a le droit de voter."
         ],
         "The signature by permission server >%s< for the voting key is not correct. Either the configuration is wrong or there is a fraud. Please inform the persons responsible for the voting": [
            "La signature par le serveur d'autorisation >%s< pour la clé de vote n'est pas correcte. Soit la configuration est mauvaise ou il ya une fraude. S'il vous plaît informez les personnes responsables pour cette votation"
         ],
         "Error verifying the signature:\n%s": [
            "Erreur vérification de la signature: \n%s"
         ],
         "For voter >%s< the server >%s< returns a different order of signatures than server >%s<.": [
            "Pour le voteur >%s< le serveur >%s< retourne un ordre différent des signatures que le serveur >%s<."
         ],
         "Motion group": [
            ""
         ],
         "Motion title": [
            ""
         ],
         "Action": [
            ""
         ],
         "Show &amp; <br>vote": [
            ""
         ],
         "Hide": [
            ""
         ],
         "Client does not support voting scheme >%s<": [
            ""
         ],
         "Motion text": [
            ""
         ],
         "Initiator: %s": [
            "",
            ""
         ],
         "Summary": [
            ""
         ],
         "Reasons": [
            ""
         ],
         "Error 238u8": [
            ""
         ],
         "Vote casting is closed": [
            ""
         ],
         "Vote casting starts at %s": [
            ""
         ],
         "Vote accepted": [
            ""
         ],
         "The server accepted your vote.": [
            ""
         ],
         "<p>You cannot fetch the result as long as vote casting is possible.</p>": [
            ""
         ],
         "Show all votes": [
            ""
         ],
         "Error: Expected >showWinners< or >error<": [
            ""
         ],
         "Got from server: %s": [
            ""
         ],
         "Something did not work: %s": [
            ""
         ],
         "In motion group %s, no motion got the requiered number of votes. ": [
            ""
         ],
         "Motion %s": [
            ""
         ],
         " and ": [
            ""
         ],
         "In motion group %s, %s won. ": [
            "",
            ""
         ],
         "Close": [
            ""
         ],
         "Votes on %s ": [
            ""
         ],
         "motion %s": [
            ""
         ],
         "Yes/No": [
            ""
         ],
         "Score": [
            ""
         ],
         "Error 875498z54: scheme not supported": [
            ""
         ],
         "Voting number": [
            ""
         ],
         "Verify!": [
            ""
         ],
         "Error": [
            ""
         ],
         "invalid": [
            ""
         ],
         "Yes": [
            ""
         ],
         "No": [
            ""
         ],
         "Abst.": [
            ""
         ],
         " - my vote": [
            ""
         ],
         "Verify signatures!": [
            ""
         ],
         "Number of YESs": [
            ""
         ],
         "Numer of NOs": [
            ""
         ],
         "Number of absten.": [
            ""
         ],
         "Sum of scores": [
            ""
         ],
         "Not Supported voting scheme": [
            ""
         ],
         "Voting scheme not supported": [
            ""
         ],
         "Motion group: %s": [
            ""
         ],
         "Question to be voted on": [
            ""
         ],
         "Cast vote!": [
            ""
         ],
         "The server did not accept the vote. It says:\n%s": [
            ""
         ],
         "Error: Expected >saveYourCountedVote<": [
            ""
         ],
         "decryption of server answer failed: %s": [
            ""
         ],
         "Thank you for voting!": [
            ""
         ],
         "Server accepted the vote!": [
            ""
         ],
         "<p>As long as it is possible to cast votes, it is not possible to get the voting result.</p>": [
            ""
         ],
         "The server does not reveal the result. It answers:\n %s": [
            ""
         ],
         "Error: Expected >verifyCountVotes<": [
            ""
         ],
         "Error: unexpected var type": [
            ""
         ],
         "details: %s": [
            ""
         ],
         "Error: some error occured": [
            ""
         ],
         "Find my vote": [
            ""
         ],
         "Number of Votes": [
            ""
         ],
         "Total": [
            ""
         ],
         "Step 1: Set voting preferences": [
            "Étape 1: Definer les préférences de vote "
         ],
         "Step 2: Save voting link": [
            ""
         ],
         "Here you can create a new voting. In order to do so, fill in the name of the voting and set the preferences for the authorization mechanism. <br><br>": [
            ""
         ],
         "Name of voting": [
            ""
         ],
         "Vote on": [
            ""
         ],
         "predefined test voting items": [
            ""
         ],
         "Enter a question to vote on": [
            ""
         ],
         "Autorization method": [
            ""
         ],
         "External token verification": [
            ""
         ],
         "Upload a list of usernames and passwords": [
            ""
         ],
         "Create new voting": [
            ""
         ],
         "Open a new voting": [
            "Ouvrir une nouvelle votation"
         ],
         "Save the link and distribute it to all eligable people. ": [
            ""
         ],
         "This is the voting link: ": [
            "Ceci est le lien de la votation:"
         ],
         "Server reports error: \n": [
            "Le serveur indique une erreur:\n"
         ],
         "Online Voting: anonymous ballots and traceable": [
            "Vote en ligne: bulletins anonymes et traçable"
         ],
         "Take part in a voting": [
            "Participer à une votation"
         ],
         "Fetch result": [
            "Récupérer les résultats"
         ],
         "Procedure": [
            "Procédure"
         ],
         "Show explanations and technical information": [
            "Afficher les explications et informations techniques"
         ],
         "Step 2: Authorize": [
            "Etape 2: Autoriser"
         ],
         "Step 3: Vote": [
            "Etape 3: Voter"
         ],
         "Enter Voting Link": [
            "Inserer le lien pour acceder à la votation"
         ],
         "<p><ul><li>I yet do not have a voting certificate</li><li>For this voting no voting certificate is needed</li><li>I do not know wheather a voting vertificate is needed</li></ul>": [
            "<p><ul><li>Je n'ai pas encore un certificat de vote</li><li>Pour cette votation il ne faut pas de certificat  de vote </li><li>I do not know wheather a voting vertificate is needed</li><li>Je ne sais pas si un certificat de vote est nécessaire</ul>"
         ],
         "Fetch voting properties": [
            "Aller chercher les propriétés de vote"
         ],
         "I already have a voting certificate": [
            "Je possède déjà un certificat de vote"
         ],
         "Take part in voting": [
            "Participez a la votation"
         ],
         "It is not possible anymore to create a voting certificate": [
            "Il n'est plus possible de créer un certificat de vote"
         ],
         "The voting requires blinding module >%s< which is not supported by this client.\nUse a compatible client.": [
            ""
         ],
         "Name of voting:": [
            "Nom de la votation:"
         ],
         "The voting requires authorisation module >%s< which is not supported by this client.\nUse a compatible client.": [
            "Le vote exige le module d'autorisation  >%s< qui n'est pas pris en charge par ce client.\nUtilisez un client compatible."
         ],
         "Generate voting certificate and save it": [
            "Générer le certificat de vote et l'enregistrer"
         ],
         "Voting mode >%s< is not supported by this client": [
            "Mode de vote >%s< n'est pas pris en charge par ce client"
         ],
         "The voting certificate is not valid": [
            "Ce certificat de vote n'est pas valable"
         ],
         "You directly opened the voting certificate, but you have to save it as file on your device.": [
            "Vous avez ouvert directement votre certificat de vote, mais vous devez l'enregistrer en tant que fichier sur votre appareil."
         ],
         "Error r83g83": [
            "Erreur r83g83"
         ],
         "You can cast your vote from now on and without any time limit.": [
            "Vous pouvez voter dès maintenant et sans limite de temps."
         ],
         "You can cast your vote from now on until before %s.": [
            "Vous pouvez voter à partir de maintenant jusqu'avant %s."
         ],
         "You can cast your vote from %s until before %s.": [
            "Vous pouvez voter à partir de %s jusqu'avant %s."
         ],
         "It is not possible anymore to cast your vote.": [
            "Il est plus possible de voter."
         ],
         "voting\u0004Acceptance": [
            ""
         ],
         "voting\u0004Yes": [
            ""
         ],
         "voting\u0004No": [
            ""
         ],
         "voting\u0004Abstentation": [
            ""
         ],
         "voting\u0004Scores": [
            ""
         ],
         "List_of_Votes\u0004Vote": [
            ""
         ]
      }
   }
}; 
