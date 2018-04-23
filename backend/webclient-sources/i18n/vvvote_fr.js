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
         "There is an error in the server configuration. The server did not deliver the server infos. api/./getserverinfos says %s": [
            ""
         ],
         "Voting server": [
            "serveur de votation"
         ],
         "Checking server": [
            "Vérification de serveur",
            "Vérification de serveur %d"
         ],
         "Please enter a valid voting link. Valid voting links start with \"http://\" oder \"https://\".": [
            "S'il vous plaît entrer un lien de vote valide. Un liens de vote valide commence par \"http: //\" ou \"https: //\"."
         ],
         "The given voting URL is not in the expected format (missing '?' or 'confighash=' resp. 'electionUrl=')": [
            "L'URL de vote donnée est pas dans le format attendu (manquant »?» Ou 'confighash=' resp. 'electionUrl=')"
         ],
         "The given voting URL is not in the expected format (missing 'confighash=').": [
            "L'URL de vote donnée est pas dans le format attendu (manquant \"confighash = ')."
         ],
         "The voting configuration obtained from the server does not match the checksum. The server is trying to cheat you. Aborted.": [
            "La configuration de vote obtenu à partir du serveur ne correspond pas à la somme de contrôle. Le serveur essaie de vous tromper. Avorté."
         ],
         "The voting configuration could not be loaded from the provided URL": [
            "La configuration de vote ne peut être chargé à partir de l'URL fournie"
         ],
         "Error: The config does not contain the questions": [
            "Erreur : La configuration ne contient pas les questions."
         ],
         "Error: The config does not contain the blinder Data": [
            "Erreur : La configuration ne contient pas les données du blinder."
         ],
         "Error: The config does not contain the permission server keys": [
            "Erreur : La configuration ne contient pas les clés du serveur de permissions."
         ],
         "Error: The config does not contain the permission server key": [
            "Erreur : La configuration ne contient pas la clé de serveur de permissions."
         ],
         "Voting link: ": [
            "Lien de la votation: "
         ],
         "1<sup>st</sup> Enter voting link": [
            "1<sup>re</sup> Entrez le lien de la votation"
         ],
         "2<sup>nd</sup> Show the result": [
            "2<sup>e</sup> Afficher le résultat"
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
            "Votre navigateur web %s %s n'est pas compatible avec ce système de vote. S'il vous plaît utilisez FireFox au moins la version 34, Chrome au moins la version 38 (sauf sur Android) ou Edge (sauf sur Android)."
         ],
         "Check of credentials failed. You are not in the list of allowed voters for this voting or secret not accepted.": [
            "La vérification de vos informations d'identification a échoué. Vous n'êtes pas dans la liste des électeurs autorisés pour cette votation ou le secret n'a pas été accepté."
         ],
         "Cheating: Your computer sent a wrong name of voting.": [
            "Tricherie: Votre ordinateur a envoyé un mauvais nom de votation."
         ],
         "The phase of creating voting certificates is yet to begin.": [
            "La phase de création de certificats de droit de vote n'a pas encore commencé."
         ],
         "The phase of creating voting certificates has already ended.": [
            "La phase de création de certificats de vote est déjà terminé."
         ],
         "The phase of casting votes is yet to begin.": [
            "La phase du décompte des votes n'a pas encore commencé."
         ],
         "The phase of casting votes has already ended.": [
            "La phase du décompte des votes est déjà terminé."
         ],
         "You can fetch the result of the voting only after the phase of casting votes has ended.": [
            "Vous pouvez aller chercher le résultat de la votation qu'après la phase du décompte des votes est terminé."
         ],
         "You cannot fetch the voting result anymore.": [
            "Vous ne pouvez plus aller chercher le résultat de la votation."
         ],
         "Now is not the phase of casting votes.": [
            "Au moment n'est pas encore la phase du décompte des voix."
         ],
         "The server already confirmed a voting certificate for this voting for you. For every eligible voter, only one voting certificate will be confirmed (that means digitally signed by the server).": [
            "Le serveur a déjà confirmé un certificat de vote pour cette votation pour vous. Pour chaque électeur admissible, un seul certificat de vote sera confirmé (ce qui signifie signé numériquement par le serveur)."
         ],
         "You already have cast a vote for this voting.": [
            "Vous avez déja deposé votre vote pour cette  votation."
         ],
         "The name of the voting is already in use.": [
            "Ce nom du vote est déjà utilisé."
         ],
         "The voting does not exist on the server. Most likely the voting link is wrong. Please correct it and try again.": [
            "Cette votation n'existe pas sur le serveur. Probablement le lien de votation est erroné. S'il vous plaît corriger le et essayer à nouveau."
         ],
         "A voting with the requested name does not exist on the server. Use the voting link directly.": [
            "Une votation avec le nom demandé n'existe pas sur le serveur. Utiliser directement le lien de votation."
         ],
         "You did not allow this server to check your eligibility at the identity server. Please allow this server to checkt your eligibility at the identity server and try again.": [
            "Vous n'avez pas permis à ce serveur de vérifier votre admissibilité au serveur d'identité. S'il vous plaît permettez à ce serveur de vérifier votre admissibilité au niveau du serveur d'identité et essayer à nouveau."
         ],
         "The voters will be identified by a token and the eligibility will be verified by this token.<br>": [
            "Les électeurs seront identifiés par un jeton et l'éligibilité sera vérifié par ce jeton."
         ],
         "Steps: ": [
            "Etapes:"
         ],
         "Authorize voting server": [
            "Autoriser le serveur de vote"
         ],
         "Authorize checking server": [
            "Autoriser le serveur de verificant"
         ],
         "Create voting certificate": [
            "Créer le certificat de vote"
         ],
         "Configuration error: serverId >%s< is asked for, but not configured": [
            "Erreur de configuration : serverId > %s < est demandé, mais n'est pas configuré."
         ],
         "Step %s: ": [
            "Etape %s"
         ],
         "Authorize %s": [
            "Autoriser %s"
         ],
         "Authorization succeeded": [
            "L'autorisation a réussi"
         ],
         "Name me publicly as ": [
            "Nommez-moi publiquement"
         ],
         "Using the an identity server (which is specifical designed to work with vvvote), a list of eligible voters is created on the identity server for each voting date. Enter the ID of this list.<br>": [
            "Utilisation du serveur d'identité (qui est spécifiquement conçu pour fonctionner avec vvvote), une liste des électeurs est créé sur le serveur d'identité pour chaque votatîon. Entrez l'ID de cette liste.<br>"
         ],
         "ID of the list of eligible voters": [
            "ID de la liste des électeurs admissibles"
         ],
         "Your name:": [
            "Votre nom:"
         ],
         "Voting password:": [
            "Mot de passe pour la votation:"
         ],
         "Additionally, tell the eligible voters the voting password.": [
            "En outre, communiquez aux électeurs le mot de passe de vote."
         ],
         "The voters enter thier name and can only cast their vote if they know the password given here. Everyone who knows the password can cast his vote.<br>": [
            "Les électeurs entrent leur nom et ne peuvent que participer à cette votation s'ils connaissent le mot de passe donné ici. Tous ceux qui connaissent le mot de passe peuvent participer à la votation. <br>"
         ],
         "Voting password": [
            "Mot de passe de la votation"
         ],
         "Verification of server signature failed. Aborted.": [
            "Vérification de la signature du serveur a échoué. Avorté"
         ],
         "The following questionID is missing in the server answer: ": [
            "L'ID de la question suivante est manquant dans la réponse du serveur:"
         ],
         "A Signature does not belong to the server we sent the data to in order to let the server sign it.": [
            "Une signature ne fait pas partie du serveur, nous avons envoyé les données afin de laisser le serveur signer."
         ],
         "Expected: >%s<, received: >%s<": [
            "Attendu: >%s<, reçu: >%s<"
         ],
         "I already got enough sigs but server said: 'more sigs needed': \n%s": [
            "Je l'ai déjà eu suffisamment de signatures mais le serveur dit: \"plus de signatures nécessaires\": \n%s"
         ],
         "unknown server cmd: %s": [
            "cmd de serveurs inconnus: %s"
         ],
         "An unknown system error occured: %s": [
            "Une erreur système inconnue est survenue: %s"
         ],
         "an exception occured: %s": [
            "une exception est survenue: %s"
         ],
         "%s has rejected your request (error no  %d):\n %s": [
            "%s a rejeté votre demande (error no %d):\n%s"
         ],
         "Client found error:\n %s": [
            "Client a trouvé un erreur:\n%s"
         ],
         "handleXmlAnswer(): Internal program error, got unknown action: %s": [
            "handleXmlAnswer(): Erreur de logiciel intern, a obtenu une action unconue: %s"
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
            "<ul> <li> Vous obtiendrez certificat de vote sous la forme d'un fichier de page web à la suite de cette étape. </li> <li> S'il vous plaît rappelez-vous où vous l'avez enregistré. </li> <li> Le certificat de vote est nécessaire afin d'enregistrer votre suffrage. Il est impossible d'obtenir un remplacement pour elle. Ainsi, enregistrez le en toute sécurité jusqu'à la fin de la votation. </li> </ul>"
         ],
         "<p><h2>Technical information</h2>The voting certificate is digitally signed by at least two servers. This signatures makes the certificate valid for voting. <br> The voting certificate contains an unique certificate number which is only known by your device - it was generated by your device and encrypted before it was sent and signed by the servers. Your device decrypts thes certificate number together with the server's signatures (This procedure is called &quot;Blinded Signature&quot;). Thus, the servers do not know the certificate number. <br> You can imagine it as follows:<br>  Your device generates a long random number (a unique number) and writes it on a sheet of paper. Your device lays a sheet of carbon-paper on this sheet, puts them together in an envelope, seals it and sends it to the servers. The servers sign on the outside of the envelope, in case you are entitled to vote. By doing so, the signature is transferred to the sheet containing the certificate number because of the carbon-paper. The servers do not open the envelope (which they cannot do, because they do not know the needed key), and send the envelope back to your device. Your device opens (decrypts) the envelope. In result, your device has a sheet of paper containing a unique certificate number and the signatures of the servers, but the servers do not know this number.The unique number together with the server's signatures and the ballot is called >voting certificate<.</p>": [
            "<p> <h2> Informations techniques </h2> \nLe certificat de vote est signé numériquement au moins par deux serveurs. Cette signature rend le certificat valable pour le vote. <br> Le certificat de vote contient un numéro de certificat unique qui est seulement connu par votre appareil - il a été généré par votre appareil et crypté avant d'être envoyé et signé par les serveurs. Votre appareil décrypte le numéro de certificat en même temps que les signatures du serveur (Cette procédure est appelée &quot;Signature Aveuglé&quot;). Ainsi, les serveurs ne connaissent pas le numéro de certificat. <br> Vous pouvez l'imaginer comme suit: <br> Votre appareil génère un long nombre aléatoire (un numéro unique) et l'écrit sur une feuille de papier. Votre appareil établit une feuille de papier carbone sur cette feuille, les met ensemble dans une enveloppe, scelle et l'envoie aux serveurs. Les serveurs signent à l'extérieur de l'enveloppe, au cas où vous avez le droit de voter. En procédant ainsi, la signature est transférée sur la feuille contenant le numéro de certificat à cause du papier carbone. Les serveurs n'ouvrent pas l'enveloppe (car ils ne le peuvent pas faire, parce qu'ils nont pas la clé nécessaire), après ils r'envoyent l'enveloppe à votre appareil. Votre appareil ouvre (déchiffre) l'enveloppe. En conséquence, votre appareil dispose d'une feuille de papier contenant un numéro de certificat unique et les signatures des serveurs, mais les serveurs ne connaissent pas ce numéro unique. Procédé conjointement avec les signatures du serveur et le bulletin de vote est appelé >certificat de vote<. < /p>"
         ],
         "Please load the voter certification file": [
            "S'il vous plaît charger le fichier de certificat d'électeur"
         ],
         "Search": [
            "Parcourir"
         ],
         "<h2>Voting certificate generated.</h2><p id=\"didSaveButtonsId\">Did you save the voting certificate on your devide?<br><button id=\"savedReturnEnvelope\" onclick=\"page.blinder.onUserDidSaveReturnEnvelope();\" >Yes</button>&emsp;<button id=\"didNotSaveReturnEnvelope\" onclick=\"page.blinder.saveReturnEnvelope();\" >No</button></p><p><ul id=\"howToVoteId\" style=\"display:none\"><li>You got a voting certificate in the form of a webpage file which you saved on your device.</li><li>Please remember the place where you saved it.</li><li>The voting certificate is needed in order to cast the vote. There is no way obaining a new one. Thus, save it securly till the end of the voting.</li><li>In order to cast a vote, open the voting certificate in a web browser. You can do this by double clicking it in the file explorer.</li><li>Everyone who has the voting certificate can use it to cast the vote - thus do not pass it on</li><li>Casting the vote using the voting certificate is anonymous. That means, as long as you do not help, nobody can find out who sent the vote.</li><li>%s</li></ul></p>": [
            "<h2>Le certificat de vote a été généré. </h2><p id=\"didSaveButtonsId\">Avez-vous enregistrer le ceritificat de vote sur votre appareil?<br><button id=\"savedReturnEnvelope\" onclick=\"page.blinder.onUserDidSaveReturnEnvelope();\" >Oui</button>&emsp;<button id=\"didNotSaveReturnEnvelope\" onclick=\"page.blinder.saveReturnEnvelope();\" >Non</button></p><p><ul id=\"howToVoteId\" style=\"display:none\"><li>Vous avez reçu un certificat de vote en tant comme fichier de format page web, lequel vous avez enregistrer sur votre appareil. </li><li>Si'l vous plait, souvenez-vous où vous avez enregistrer le certificat.</li><li>Le certificat de vote est necessair pour pouvoir participer à la votation. Il y a pas de possibilité de recevoir un nouveau certificat pour cette votation.  Ainsi, l'enregistrer en toute sécurité jusqu'à la fin de la votation.</li><li>Pour voter, ouvrez le certificat de vote dans un navigateur web. Vous pouvez le faire en double cliquant dessus dans l'explorateur de fichiers.</li><li>Le certificat de vote donne le droit de voter - alors ne donnez le certificat de vote à personne! </li><li>Le vote est anonyme, ca veut dire que sans votre aide ne personne peut savoir qui a voté. </li><li>%s</li></ul></p>"
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
            "Erreur vérification d'une signature:\nLe nombre de signatures sur le certificat de vote n'est pas correcte. \nNombre requis: %d, nombre dans ce certificat de vote: %d"
         ],
         "The vote is not for this election (Election IDs do not match).": [
            "Le vote n'est pas pour cette élection (les cartes d'électeur ne correspondent pas)."
         ],
         "The vote is not for this election (Question ID not found in election configuration).": [
            "Le vote n'est pas pour cette élection (L'ID de la question ne figure pas dans la configuration de l'élection)."
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
            "groupe de motion"
         ],
         "Motion title": [
            "Titre de la motion"
         ],
         "Action": [
            "Action"
         ],
         "Show &amp; <br>vote": [
            "Afficher &amp; <br>vote"
         ],
         "Hide": [
            "Masquer"
         ],
         "Client does not support voting scheme >%s<": [
            "Le client ne prend pas en charge ce système de vote >%s<"
         ],
         "Cast vote!": [
            "Envoyer le vote!"
         ],
         "Save voting recceipt": [
            ""
         ],
         "Motion text": [
            "Texte de la motion"
         ],
         "Initiator: %s": [
            "Initiateur: %s",
            "Initiateurs: %s"
         ],
         "Summary": [
            "Sommaire"
         ],
         "Reasons": [
            "Justification"
         ],
         "<p>You cannot fetch the result as long as vote casting is possible.</p>": [
            "<p>Vous pouvez aller chercher le résultat de la votation qu'après la phase de votation est terminée.</p>"
         ],
         "Show all votes": [
            "Afficher tous les votes"
         ],
         "Error: Expected >showWinners< or >error<": [
            "Erreur: Attendue  >showWinners< or >error<"
         ],
         "Got from server: %s": [
            "Reçu de la part du serveur: %s"
         ],
         "Something did not work: %s": [
            "Quelque chose n'a pas fonctionné: %s"
         ],
         "In motion group %s, no motion got the requiered number of votes. ": [
            "Dans le groupe de motions %s aucune motion n'a obtenu le nombre de voix requis."
         ],
         "Motion %s": [
            "Motion %s"
         ],
         " and ": [
            "et"
         ],
         "In motion group %s, %s won. ": [
            "Dans le groupe de motion %s, %s a gagné.",
            "Dans le groupe de motion %s, %s a gangé."
         ],
         "Close": [
            "Fermer"
         ],
         "Votes on %s ": [
            "Voter sur %s"
         ],
         "motion %s": [
            "motion %s"
         ],
         "Yes/No": [
            "Oui/Non"
         ],
         "Score": [
            "Score"
         ],
         "Picked": [
            "Choisi"
         ],
         "Scheme not supported": [
            "Systeme de vote ne pas pris en charge"
         ],
         "Voting number": [
            "Numero de votation"
         ],
         "Verify!": [
            "Verifier!"
         ],
         "Error": [
            "Erreur"
         ],
         "invalid": [
            "invalide"
         ],
         "Yes": [
            "Oui"
         ],
         "No": [
            "Non"
         ],
         "Abst.": [
            "Abst. "
         ],
         " - my vote": [
            "- mon vote"
         ],
         "Verify signatures!": [
            "Verifier les signatures!"
         ],
         "Number of YESs": [
            "Nombre de OUIs"
         ],
         "Number of NOs": [
            "Nombre de NONs"
         ],
         "Number of absten.": [
            "Nombre d'abstentions"
         ],
         "Sum of scores": [
            "Somme des scores"
         ],
         "Number picked": [
            "Numéro choisi"
         ],
         "Not Supported voting scheme": [
            " Système de vote ne pas pris en charge"
         ],
         "Voting scheme not supported": [
            "Systeme de vote ne pas pris en charge"
         ],
         "Motion group: %s": [
            "Groupe de motion: %s"
         ],
         "Question to be voted on": [
            "Question sur la quelle il faut voter"
         ],
         "Tally servers accepted the vote!": [
            ""
         ],
         "Vote accepted": [
            "Vote accepté"
         ],
         "Error 238u8": [
            "Erreur 238u8"
         ],
         "Vote casting is closed": [
            "la collection des vote est terminée"
         ],
         "Vote casting starts at %s": [
            "La collection de vote commence à %s"
         ],
         "The server did not accept the vote.": [
            ""
         ],
         "The server >%s< did not accept the vote.": [
            ""
         ],
         "It says:\n": [
            ""
         ],
         "Error: Expected >saveYourCountedVote<": [
            "Erreur: Attendu >saveYourCountedVote<"
         ],
         "Acceptance conformation from the server contains an unplausible date: %s, now: %s": [
            ""
         ],
         "Error while verifying tally server /%s/ signature: %s": [
            ""
         ],
         "The signature from server >%s< does not match the signed vote": [
            ""
         ],
         "Error: missing the signed data (no dot in the string)": [
            ""
         ],
         "This file can be used in order to proof that a tallying server\r\ndid receive the vote. The server's signature proofs it. The \r\nsignature is here in the standard JWT format which can be \r\nverified by according services, e.g. https://jwt.io/ \r\nJust copy the value of \"JWT\" into the field \"Encoded\" and the \r\naccording public key from below in the field \"VERIFY SIGNATURE\"\r\non the before mentioned website. The JWT contains all the \r\ninformation that is also shown in JSON clear text.": [
            ""
         ],
         "Voting receipt %s": [
            ""
         ],
         "In order to be able to proof that you sent your vote, you can save the voting receipt": [
            ""
         ],
         "<p>As long as it is possible to cast votes, it is not possible to get the voting result.</p>": [
            "<p>Pendant la phase ou on peut deposer les votes, il n'est pas possible de voir les résultats de la votation</p>"
         ],
         "The server does not reveal the result. It answers:\n %s": [
            "Le serveur ne révèle pas le résultat. Il repond:\n%s"
         ],
         "Error: Expected >verifyCountVotes<": [
            "Erreur: Attendu >verifyCountVotes<"
         ],
         "Error: unexpected var type": [
            "Erreur: inattendue type de var"
         ],
         "details: %s": [
            "Details: %s"
         ],
         "Error: some error occured": [
            "Erreur: Un erreur est apparu"
         ],
         "Number of Votes": [
            "Nombre de votes"
         ],
         "Total": [
            "Total"
         ],
         "1<sup>st</sup> Set voting preferences": [
            "1<sup>re</sup> Definer les préférences de vote  "
         ],
         "2<sup>nd</sup> Save voting link": [
            "2<sup>e</sup> Enregistrer le lien de la votation"
         ],
         "Here you can create a new voting. In order to do so, fill in the name of the voting and set the preferences for the authorization mechanism. <br><br>": [
            "Ici, vous pouvez créer une nouvelle votation. Pour faire ça, remplissez le nom de la votation et définissez les préférences pour le mécanisme d'autorisation. <br><br>"
         ],
         "Name of voting": [
            "Nom de la votation"
         ],
         "Vote on": [
            "Voter sur"
         ],
         "predefined test voting items": [
            "éléments de vote de test prédéfinis"
         ],
         "Enter a question to vote on": [
            "Inserez ici la questien sur la quelle il faut voter"
         ],
         "Autorization method": [
            "Méthode d'autorisation"
         ],
         "External token verification": [
            "vérification de jeton externe"
         ],
         "Upload a list of usernames and passwords": [
            "Ajouter une liste de noms d'utilisateur et de mots de passe"
         ],
         "Create new voting": [
            "Créer une nouvelle votation"
         ],
         "Open a new voting": [
            "Ouvrir une nouvelle votation"
         ],
         "Waiting for the servers": [
            "En attente des serveurs"
         ],
         "The hash obtained from the server does not match the hash from another server. The server is trying to cheat you. Aborted.": [
            "Le hachage obtenu du serveur ne correspond pas au hachage d'un autre serveur. Le serveur essaie de vous tromper. Avorté."
         ],
         "Save the link and distribute it to all eligable people. ": [
            "Enregistrez ce lien et distribuez-le à toutes les personnes admissibles."
         ],
         "This is the voting link: ": [
            "Ceci est le lien de la votation:"
         ],
         "Server reports error: \n": [
            "Le serveur indique une erreur:\n"
         ],
         "Unknown command from Server: \n": [
            "Commande inconnue du serveur :\n"
         ],
         "Online Voting:<br> anonymous and traceable": [
            "Vote en ligne:<br> anonymes et traçable"
         ],
         "Take part in a voting": [
            "Participer à une votation"
         ],
         "Fetch result": [
            "Récupérer les résultats"
         ],
         "That's how": [
            "Déroulement"
         ],
         "Show explanations and technical information": [
            "Afficher les explications et informations techniques"
         ],
         "There is an error in the configuration. Please inform the administrator. (error no.: 875765: URL not defined or not of type string)": [
            "Il y a une erreur dans la configuration. Veuillez en informer l'administrateur. (n° d'erreur : 875765 : URL non définie ou non de type chaîne de caractères)"
         ],
         "There is an error in the configuration. Please inform the administrator. (error no.: 875766: URL not defined or not of type string)": [
            "Il y a une erreur dans la configuration. Veuillez en informer l'administrateur. (n° d'erreur : 875766 : URL non définie ou non de type chaîne de caractères)"
         ],
         "An error occured while connecting to a server": [
            ""
         ],
         "Click %s this link, in order to test the connection manually.</a>The link will be opened in a new window.</li> <li>Solve the problem,</li> <li>close the window and </li><li>click afterwards on %s try again</button>": [
            ""
         ],
         "Received from: ": [
            ""
         ],
         "2<sup>nd</sup> Authorize": [
            "2<sup>e</sup> Autoriser"
         ],
         "3<sup>rd</sup> Vote": [
            "3<sup>e</sup> Voter"
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
            "La votation nécessite le module de liaison >%s< qui ne sont pas pris en charge par cet client.\nUtilisez un client compatible."
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
         "Voting Certificate for %s": [
            "Certificat de vote pour %s"
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
         "voting\u0004Best option": [
            "Meilleure option"
         ],
         "voting\u0004Acceptance": [
            "Acceptation"
         ],
         "voting\u0004Yes": [
            "Oui"
         ],
         "voting\u0004No": [
            "Non"
         ],
         "voting\u0004Abstentation": [
            "Abstention"
         ],
         "voting\u0004Scores": [
            "Scores"
         ],
         "List_of_Votes\u0004Vote": [
            "Votation"
         ]
      }
   }
}; 
