if (typeof translations === 'undefined') translations = [];
translations['en_US'] = 
{
   "domain": "messages",
   "locale_data": {
      "messages": {
         "": {
            "domain": "messages",
            "plural_forms": "nplurals=2; plural=(n != 1);",
            "lang": "en_US"
         },
         "There is an error in the server configuration. The server did not deliver the server infos. api/./getserverinfos says %s": [
            "There is an error in the server configuration. The server did not deliver the server infos. api/./getserverinfos says %s"
         ],
         "Voting server": [
            "Voting server"
         ],
         "Checking server": [
            "Checking server",
            "Checking server %d"
         ],
         "Please enter a valid voting link. Valid voting links start with \"http://\" oder \"https://\".": [
            "Please enter a valid voting link. Valid voting links start with \"http://\" oder \"https://\"."
         ],
         "The given voting URL is not in the expected format (missing '?' or 'confighash=' resp. 'electionUrl=')": [
            "The given voting URL is not in the expected format (missing '?' or 'confighash=' resp. 'electionUrl=')"
         ],
         "The given voting URL is not in the expected format (missing 'confighash=').": [
            "The given voting URL is not in the expected format (missing 'confighash=')."
         ],
         "The voting configuration obtained from the server does not match the checksum. The server is trying to cheat you. Aborted.": [
            "The voting configuration obtained from the server does not match the checksum. The server is trying to cheat you. Aborted."
         ],
         "The voting configuration could not be loaded from the provided URL": [
            "The voting configuration could not be loaded from the provided URL"
         ],
         "Error: The config does not contain the questions": [
            "Error: The config does not contain the questions"
         ],
         "Error: The config does not contain the blinder Data": [
            "Error: The config does not contain the blinder Data"
         ],
         "Error: The config does not contain the permission server keys": [
            "Error: The config does not contain the permission server keys"
         ],
         "Error: The config does not contain the permission server key": [
            "Error: The config does not contain the permission server key"
         ],
         "Voting link: ": [
            "Voting link: "
         ],
         "1<sup>st</sup> Enter voting link": [
            "1<sup>st</sup> Enter voting link"
         ],
         "2<sup>nd</sup> Show the result": [
            "2<sup>nd</sup> Show the result"
         ],
         "<p>Enter the link of the voting for which you want to see the results<br></p>": [
            "<p>Enter the link of the voting for which you want to see the results<br></p>"
         ],
         "Get voting results": [
            "Get voting results"
         ],
         "Get Voting Results": [
            "Get Voting Results"
         ],
         "Name of the voting: ": [
            "Name of the voting: "
         ],
         "The voting requieres authorisation module >%s< which is not supported by this client.\nUse a compatible client.": [
            "The voting requieres authorisation module >%s< which is not supported by this client.\nUse a compatible client."
         ],
         "Your web browser %s %is not supported. Please use FireFox at least version 34, Chrome at least version 38 (except on Android) or Edge.": [
            "Your web browser %s %is not supported. Please use FireFox at least version 34, Chrome at least version 38 (except on Android) or Edge."
         ],
         "Check of credentials failed. You are not in the list of allowed voters for this voting or secret not accepted.": [
            "Check of credentials failed. You are not in the list of allowed voters for this voting or secret not accepted."
         ],
         "Cheating: Your computer sent a wrong name of voting.": [
            "Cheating: Your computer sent a wrong name of voting."
         ],
         "The phase of creating voting certificates is yet to begin.": [
            "The phase of creating voting certificates is yet to begin."
         ],
         "The phase of creating voting certificates has already ended.": [
            "The phase of creating voting certificates has already ended."
         ],
         "The phase of casting votes is yet to begin.": [
            "The phase of casting votes is yet to begin."
         ],
         "The phase of casting votes has already ended.": [
            "The phase of casting votes has already ended."
         ],
         "You can fetch the result of the voting only after the phase of casting votes has ended.": [
            "You can fetch the result of the voting only after the phase of casting votes has ended."
         ],
         "You cannot fetch the voting result anymore.": [
            "You cannot fetch the voting result anymore."
         ],
         "Now is not the phase of casting votes.": [
            "Now is not the phase of casting votes."
         ],
         "The server already confirmed a voting certificate for this voting for you. For every eligible voter, only one voting certificate will be confirmed (that means digitally signed by the server).": [
            "The server already confirmed a voting certificate for this voting for you. For every eligible voter, only one voting certificate will be confirmed (that means digitally signed by the server)."
         ],
         "You already have cast a vote for this voting.": [
            "You already have cast a vote for this voting."
         ],
         "The name of the voting is already in use.": [
            "The name of the voting is already in use."
         ],
         "The voting does not exist on the server. Most likely the voting link is wrong. Please correct it and try again.": [
            "The voting does not exist on the server. Most likely the voting link is wrong. Please correct it and try again."
         ],
         "A voting with the requested name does not exist on the server. Use the voting link directly.": [
            "A voting with the requested name does not exist on the server. Use the voting link directly."
         ],
         "You did not allow this server to check your eligibility at the identity server. Please allow this server to checkt your eligibility at the identity server and try again.": [
            "You did not allow this server to check your eligibility at the identity server. Please allow this server to checkt your eligibility at the identity server and try again."
         ],
         "The voters will be identified by a token and the eligibility will be verified by this token.<br>": [
            "The voters will be identified by a token and the eligibility will be verified by this token.<br>"
         ],
         "Steps: ": [
            "Steps: "
         ],
         "Authorize voting server": [
            "Authorize voting server"
         ],
         "Authorize checking server": [
            "Authorize checking server"
         ],
         "Create voting certificate": [
            "Create voting certificate"
         ],
         "Configuration error: serverId >%s< is asked for, but not configured": [
            "Configuration error: serverId >%s< is asked for, but not configured"
         ],
         "Step %s: ": [
            "Step %s: "
         ],
         "Authorize %s": [
            "Authorize %s"
         ],
         "Authorization succeeded": [
            "Authorization succeeded"
         ],
         "Name me publicly as ": [
            "Name me publicly as "
         ],
         "Using the an identity server (which is specifical designed to work with vvvote), a list of eligible voters is created on the identity server for each voting date. Enter the ID of this list.<br>": [
            "Using the an identity server (which is specifical designed to work with vvvote), a list of eligible voters is created on the identity server for each voting date. Enter the ID of this list.<br>"
         ],
         "ID of the list of eligible voters": [
            "ID of the list of eligible voters"
         ],
         "Your name:": [
            "Your name:"
         ],
         "Voting password:": [
            "Voting password:"
         ],
         "Additionally, tell the eligible voters the voting password.": [
            "Additionally, tell the eligible voters the voting password."
         ],
         "The voters enter thier name and can only cast their vote if they know the password given here. Everyone who knows the password can cast his vote.<br>": [
            "The voters enter thier name and can only cast their vote if they know the password given here. Everyone who knows the password can cast his vote.<br>"
         ],
         "Voting password": [
            "Voting password"
         ],
         "Verification of server signature failed. Aborted.": [
            "Verification of server signature failed. Aborted."
         ],
         "The following questionID is missing in the server answer: ": [
            "The following questionID is missing in the server answer: "
         ],
         "A Signature does not belong to the server we sent the data to in order to let the server sign it.": [
            "A Signature does not belong to the server we sent the data to in order to let the server sign it."
         ],
         "Expected: >%s<, received: >%s<": [
            "Expected: >%s<, received: >%s<"
         ],
         "I already got enough sigs but server said: 'more sigs needed': \n%s": [
            "I already got enough sigs but server said: 'more sigs needed': \n%s"
         ],
         "unknown server cmd: %s": [
            "unknown server cmd: %s"
         ],
         "An unknown system error occured: %s": [
            "An unknown system error occured: %s"
         ],
         "an exception occured: %s": [
            "an exception occured: %s"
         ],
         "%s has rejected your request (error no  %d):\n %s": [
            "%s has rejected your request (error no  %d):\n %s"
         ],
         "Client found error:\n %s": [
            "Client found error:\n %s"
         ],
         "handleXmlAnswer(): Internal program error, got unknown action: %s": [
            "handleXmlAnswer(): Internal program error, got unknown action: %s"
         ],
         "Voting certificate %s": [
            "Voting certificate %s"
         ],
         "In order to be able to cast your vote, you have to save your voting certificate on your device now": [
            "In order to be able to cast your vote, you have to save your voting certificate on your device now"
         ],
         "Creating voting certificate": [
            "Creating voting certificate"
         ],
         "<ul><li>You will get voting certificae in the form of a webpage file as result of this step.</li><li>Please remember where you saved it.</li><li>The voting certificate is neccesary in order to cast the vote. There is no way getting a replacement for it. Thus, save it securely till the end of the voting.</li></ul>": [
            "<ul><li>You will get voting certificae in the form of a webpage file as result of this step.</li><li>Please remember where you saved it.</li><li>The voting certificate is neccesary in order to cast the vote. There is no way getting a replacement for it. Thus, save it securely till the end of the voting.</li></ul>"
         ],
         "<p><h2>Technical information</h2>The voting certificate is digitally signed by at least two servers. This signatures makes the certificate valid for voting. <br> The voting certificate contains an unique certificate number which is only known by your device - it was generated by your device and encrypted before it was sent and signed by the servers. Your device decrypts thes certificate number together with the server's signatures (This procedure is called &quot;Blinded Signature&quot;). Thus, the servers do not know the certificate number. <br> You can imagine it as follows:<br>  Your device generates a long random number (a unique number) and writes it on a sheet of paper. Your device lays a sheet of carbon-paper on this sheet, puts them together in an envelope, seals it and sends it to the servers. The servers sign on the outside of the envelope, in case you are entitled to vote. By doing so, the signature is transferred to the sheet containing the certificate number because of the carbon-paper. The servers do not open the envelope (which they cannot do, because they do not know the needed key), and send the envelope back to your device. Your device opens (decrypts) the envelope. In result, your device has a sheet of paper containing a unique certificate number and the signatures of the servers, but the servers do not know this number.The unique number together with the server's signatures and the ballot is called >voting certificate<.</p>": [
            "<p><h2>Technical information</h2>The voting certificate is digitally signed by at least two servers. This signatures makes the certificate valid for voting. <br> The voting certificate contains an unique certificate number which is only known by your device - it was generated by your device and encrypted before it was sent and signed by the servers. Your device decrypts thes certificate number together with the server's signatures (This procedure is called &quot;Blinded Signature&quot;). Thus, the servers do not know the certificate number. <br> You can imagine it as follows:<br>  Your device generates a long random number (a unique number) and writes it on a sheet of paper. Your device lays a sheet of carbon-paper on this sheet, puts them together in an envelope, seals it and sends it to the servers. The servers sign on the outside of the envelope, in case you are entitled to vote. By doing so, the signature is transferred to the sheet containing the certificate number because of the carbon-paper. The servers do not open the envelope (which they cannot do, because they do not know the needed key), and send the envelope back to your device. Your device opens (decrypts) the envelope. In result, your device has a sheet of paper containing a unique certificate number and the signatures of the servers, but the servers do not know this number.The unique number together with the server's signatures and the ballot is called >voting certificate<.</p>"
         ],
         "Please load the voter certification file": [
            "Please load the voter certification file"
         ],
         "Search": [
            "Search"
         ],
         "<h2>Voting certificate generated.</h2><p id=\"didSaveButtonsId\">Did you save the voting certificate on your devide?<br><button id=\"savedReturnEnvelope\" onclick=\"page.blinder.onUserDidSaveReturnEnvelope();\" >Yes</button>&emsp;<button id=\"didNotSaveReturnEnvelope\" onclick=\"page.blinder.saveReturnEnvelope();\" >No</button></p><p><ul id=\"howToVoteId\" style=\"display:none\"><li>You got a voting certificate in the form of a webpage file which you saved on your device.</li><li>Please remember the place where you saved it.</li><li>The voting certificate is needed in order to cast the vote. There is no way obaining a new one. Thus, save it securly till the end of the voting.</li><li>In order to cast a vote, open the voting certificate in a web browser. You can do this by double clicking it in the file explorer.</li><li>Everyone who has the voting certificate can use it to cast the vote - thus do not pass it on</li><li>Casting the vote using the voting certificate is anonymous. That means, as long as you do not help, nobody can find out who sent the vote.</li><li>%s</li></ul></p>": [
            "<h2>Voting certificate generated.</h2><p id=\"didSaveButtonsId\">Did you save the voting certificate on your devide?<br><button id=\"savedReturnEnvelope\" onclick=\"page.blinder.onUserDidSaveReturnEnvelope();\" >Yes</button>&emsp;<button id=\"didNotSaveReturnEnvelope\" onclick=\"page.blinder.saveReturnEnvelope();\" >No</button></p><p><ul id=\"howToVoteId\" style=\"display:none\"><li>You got a voting certificate in the form of a webpage file which you saved on your device.</li><li>Please remember the place where you saved it.</li><li>The voting certificate is needed in order to cast the vote. There is no way obaining a new one. Thus, save it securly till the end of the voting.</li><li>In order to cast a vote, open the voting certificate in a web browser. You can do this by double clicking it in the file explorer.</li><li>Everyone who has the voting certificate can use it to cast the vote - thus do not pass it on</li><li>Casting the vote using the voting certificate is anonymous. That means, as long as you do not help, nobody can find out who sent the vote.</li><li>%s</li></ul></p>"
         ],
         "Error: voting certificate data not found": [
            "Error: voting certificate data not found"
         ],
         "Error: voting certificate data could not be read: JSON decode failed": [
            "Error: voting certificate data could not be read: JSON decode failed"
         ],
         "The voter certificate is not consistent": [
            "The voter certificate is not consistent"
         ],
         "The signature on the vote is correct. This means that the vote is unchanged.": [
            "The signature on the vote is correct. This means that the vote is unchanged."
         ],
         "The signature on the vote is not correct. This means that the vote is changed or the key does not match.": [
            "The signature on the vote is not correct. This means that the vote is changed or the key does not match."
         ],
         "Error verifying a signature:\nThe number of signatures on the voting certificate is not correct. \nRequired number: %d, number in this voting certificate: %d": [
            "Error verifying a signature:\nThe number of signatures on the voting certificate is not correct. \nRequired number: %d, number in this voting certificate: %d"
         ],
         "The vote is not for this election (Election IDs do not match).": [
            "The vote is not for this election (Election IDs do not match)."
         ],
         "The vote is not for this election (Question ID not found in election configuration).": [
            "The vote is not for this election (Question ID not found in election configuration)."
         ],
         "The signature by the permission server >%s< for the voting key is correct. This means, the server has confirmed that the according voter is entitled to vote.": [
            "The signature by the permission server >%s< for the voting key is correct. This means, the server has confirmed that the according voter is entitled to vote."
         ],
         "The signature by permission server >%s< for the voting key is not correct. Either the configuration is wrong or there is a fraud. Please inform the persons responsible for the voting": [
            "The signature by permission server >%s< for the voting key is not correct. Either the configuration is wrong or there is a fraud. Please inform the persons responsible for the voting"
         ],
         "Error verifying the signature:\n%s": [
            "Error verifying the signature:\n%s"
         ],
         "For voter >%s< the server >%s< returns a different order of signatures than server >%s<.": [
            "For voter >%s< the server >%s< returns a different order of signatures than server >%s<."
         ],
         "Motion group": [
            "Motion group"
         ],
         "Motion title": [
            "Motion title"
         ],
         "Action": [
            "Action"
         ],
         "Show &amp; <br>vote": [
            "Show &amp; <br>vote"
         ],
         "Hide": [
            "Hide"
         ],
         "Client does not support voting scheme >%s<": [
            "Client does not support voting scheme >%s<"
         ],
         "Cast vote!": [
            "Cast vote!"
         ],
         "Save voting recceipt": [
            "Save voting recceipt"
         ],
         "Motion text": [
            "Motion text"
         ],
         "Initiator: %s": [
            "Initiator: %s",
            "Initiators: %s"
         ],
         "Summary": [
            "Summary"
         ],
         "Reasons": [
            "Reasons"
         ],
         "<p>You cannot fetch the result as long as vote casting is possible.</p>": [
            "<p>You cannot fetch the result as long as vote casting is possible.</p>"
         ],
         "Show all votes": [
            "Show all votes"
         ],
         "Error: Expected >showWinners< or >error<": [
            "Error: Expected >showWinners< or >error<"
         ],
         "Got from server: %s": [
            "Got from server: %s"
         ],
         "Something did not work: %s": [
            "Something did not work: %s"
         ],
         "In motion group %s, no motion got the requiered number of votes. ": [
            "In motion group %s, no motion got the requiered number of votes. "
         ],
         "Motion %s": [
            "Motion %s"
         ],
         " and ": [
            " and "
         ],
         "In motion group %s, %s won. ": [
            "In motion group %s, %s won. ",
            "In motion group %s, %s won. "
         ],
         "Close": [
            "Close"
         ],
         "Votes on %s ": [
            "Votes on %s "
         ],
         "motion %s": [
            "motion %s"
         ],
         "Yes/No": [
            "Yes/No"
         ],
         "Score": [
            "Score"
         ],
         "Picked": [
            "Picked"
         ],
         "Scheme not supported": [
            "Scheme not supported"
         ],
         "Voting number": [
            "Voting number"
         ],
         "Verify!": [
            "Verify!"
         ],
         "Error": [
            "Error"
         ],
         "invalid": [
            "invalid"
         ],
         "Yes": [
            "Yes"
         ],
         "No": [
            "No"
         ],
         "Abst.": [
            "Abst."
         ],
         " - my vote": [
            " - my vote"
         ],
         "Verify signatures!": [
            "Verify signatures!"
         ],
         "Number of YESs": [
            "Number of YESs"
         ],
         "Number of NOs": [
            "Number of NOs"
         ],
         "Number of absten.": [
            "Number of absten."
         ],
         "Sum of scores": [
            "Sum of scores"
         ],
         "Number picked": [
            "Number picked"
         ],
         "Not Supported voting scheme": [
            "Not Supported voting scheme"
         ],
         "Voting scheme not supported": [
            "Voting scheme not supported"
         ],
         "Motion group: %s": [
            "Motion group: %s"
         ],
         "Question to be voted on": [
            "Question to be voted on"
         ],
         "Tally servers accepted the vote!": [
            "Tally servers accepted the vote!"
         ],
         "Vote accepted": [
            "Vote accepted"
         ],
         "Error 238u8": [
            "Error 238u8"
         ],
         "Vote casting is closed": [
            "Vote casting is closed"
         ],
         "Vote casting starts at %s": [
            "Vote casting starts at %s"
         ],
         "The server did not accept the vote.": [
            "The server did not accept the vote."
         ],
         "The server >%s< did not accept the vote.": [
            "The server >%s< did not accept the vote."
         ],
         "It says:\n": [
            "It says:\n"
         ],
         "Error: Expected >saveYourCountedVote<": [
            "Error: Expected >saveYourCountedVote<"
         ],
         "Acceptance conformation from the server contains an unplausible date: %s, now: %s": [
            "Acceptance conformation from the server contains an unplausible date: %s, now: %s"
         ],
         "Error while verifying tally server /%s/ signature: %s": [
            "Error while verifying tally server /%s/ signature: %s"
         ],
         "The signature from server >%s< does not match the signed vote": [
            "The signature from server >%s< does not match the signed vote"
         ],
         "Error: missing the signed data (no dot in the string)": [
            "Error: missing the signed data (no dot in the string)"
         ],
         "This file can be used in order to proof that a tallying server\r\ndid receive the vote. The server's signature proofs it. The \r\nsignature is here in the standard JWT format which can be \r\nverified by according services, e.g. https://jwt.io/ \r\nJust copy the value of \"JWT\" into the field \"Encoded\" and the \r\naccording public key from below in the field \"VERIFY SIGNATURE\"\r\non the before mentioned website. The JWT contains all the \r\ninformation that is also shown in JSON clear text.": [
            "This file can be used in order to proof that a tallying server\r\ndid receive the vote. The server's signature proofs it. The \r\nsignature is here in the standard JWT format which can be \r\nverified by according services, e.g. https://jwt.io/ \r\nJust copy the value of \"JWT\" into the field \"Encoded\" and the \r\naccording public key from below in the field \"VERIFY SIGNATURE\"\r\non the before mentioned website. The JWT contains all the \r\ninformation that is also shown in JSON clear text."
         ],
         "Voting receipt %s": [
            "Voting receipt %s"
         ],
         "In order to be able to proof that you sent your vote, you can save the voting receipt": [
            "In order to be able to proof that you sent your vote, you can save the voting receipt"
         ],
         "<p>As long as it is possible to cast votes, it is not possible to get the voting result.</p>": [
            "<p>As long as it is possible to cast votes, it is not possible to get the voting result.</p>"
         ],
         "The server does not reveal the result. It answers:\n %s": [
            "The server does not reveal the result. It answers:\n %s"
         ],
         "Error: Expected >verifyCountVotes<": [
            "Error: Expected >verifyCountVotes<"
         ],
         "Error: unexpected var type": [
            "Error: unexpected var type"
         ],
         "details: %s": [
            "details: %s"
         ],
         "Error: some error occured": [
            "Error: some error occured"
         ],
         "Number of Votes": [
            "Number of Votes"
         ],
         "Total": [
            "Total"
         ],
         "1<sup>st</sup> Set voting preferences": [
            "1<sup>st</sup> Set voting preferences"
         ],
         "2<sup>nd</sup> Save voting link": [
            "2<sup>nd</sup> Save voting link"
         ],
         "Here you can create a new voting. In order to do so, fill in the name of the voting and set the preferences for the authorization mechanism. <br><br>": [
            "Here you can create a new voting. In order to do so, fill in the name of the voting and set the preferences for the authorization mechanism. <br><br>"
         ],
         "Name of voting": [
            "Name of voting"
         ],
         "Vote on": [
            "Vote on"
         ],
         "predefined test voting items": [
            "predefined test voting items"
         ],
         "Enter a question to vote on": [
            "Enter a question to vote on"
         ],
         "Autorization method": [
            "Autorization method"
         ],
         "External token verification": [
            "External token verification"
         ],
         "Upload a list of usernames and passwords": [
            "Upload a list of usernames and passwords"
         ],
         "Create new voting": [
            "Create new voting"
         ],
         "Open a new voting": [
            "Open a new voting"
         ],
         "Waiting for the servers": [
            "Waiting for the servers"
         ],
         "The hash obtained from the server does not match the hash from another server. The server is trying to cheat you. Aborted.": [
            "The hash obtained from the server does not match the hash from another server. The server is trying to cheat you. Aborted."
         ],
         "Save the link and distribute it to all eligable people. ": [
            "Save the link and distribute it to all eligable people. "
         ],
         "This is the voting link: ": [
            "This is the voting link: "
         ],
         "Server reports error: \n": [
            "Server reports error: \n"
         ],
         "Unknown command from Server: \n": [
            "Unknown command from Server: \n"
         ],
         "Online Voting:<br> anonymous and traceable": [
            "Online Voting:<br> anonymous and traceable"
         ],
         "Take part in a voting": [
            "Take part in a voting"
         ],
         "Fetch result": [
            "Fetch result"
         ],
         "That's how": [
            "That's how"
         ],
         "Show explanations and technical information": [
            "Show explanations and technical information"
         ],
         "There is an error in the configuration. Please inform the administrator. (error no.: 875765: URL not defined or not of type string)": [
            "There is an error in the configuration. Please inform the administrator. (error no.: 875765: URL not defined or not of type string)"
         ],
         "There is an error in the configuration. Please inform the administrator. (error no.: 875766: URL not defined or not of type string)": [
            "There is an error in the configuration. Please inform the administrator. (error no.: 875766: URL not defined or not of type string)"
         ],
         "An error occured while connecting to a server": [
            "An error occured while connecting to a server"
         ],
         "Click %s this link, in order to test the connection manually.</a>The link will be opened in a new window.</li> <li>Solve the problem,</li> <li>close the window and </li><li>click afterwards on %s try again</button>": [
            "Click %s this link, in order to test the connection manually.</a>The link will be opened in a new window.</li> <li>Solve the problem,</li> <li>close the window and </li><li>click afterwards on %s try again</button>"
         ],
         "Received from: ": [
            "Received from: "
         ],
         "2<sup>nd</sup> Authorize": [
            "2<sup>nd</sup> Authorize"
         ],
         "3<sup>rd</sup> Vote": [
            "3<sup>rd</sup> Vote"
         ],
         "Enter Voting Link": [
            "Enter Voting Link"
         ],
         "<p><ul><li>I yet do not have a voting certificate</li><li>For this voting no voting certificate is needed</li><li>I do not know wheather a voting vertificate is needed</li></ul>": [
            "<p><ul><li>I yet do not have a voting certificate</li><li>For this voting no voting certificate is needed</li><li>I do not know wheather a voting vertificate is needed</li></ul>"
         ],
         "Fetch voting properties": [
            "Fetch voting properties"
         ],
         "I already have a voting certificate": [
            "I already have a voting certificate"
         ],
         "Take part in voting": [
            "Take part in voting"
         ],
         "It is not possible anymore to create a voting certificate": [
            "It is not possible anymore to create a voting certificate"
         ],
         "The voting requires blinding module >%s< which is not supported by this client.\nUse a compatible client.": [
            "The voting requires blinding module >%s< which is not supported by this client.\nUse a compatible client."
         ],
         "The voting requires authorisation module >%s< which is not supported by this client.\nUse a compatible client.": [
            "The voting requires authorisation module >%s< which is not supported by this client.\nUse a compatible client."
         ],
         "Generate voting certificate and save it": [
            "Generate voting certificate and save it"
         ],
         "Voting mode >%s< is not supported by this client": [
            "Voting mode >%s< is not supported by this client"
         ],
         "Voting Certificate for %s": [
            "Voting Certificate for %s"
         ],
         "The voting certificate is not valid": [
            "The voting certificate is not valid"
         ],
         "You directly opened the voting certificate, but you have to save it as file on your device.": [
            "You directly opened the voting certificate, but you have to save it as file on your device."
         ],
         "Error r83g83": [
            "Error r83g83"
         ],
         "You can cast your vote from now on and without any time limit.": [
            "You can cast your vote from now on and without any time limit."
         ],
         "You can cast your vote from now on until before %s.": [
            "You can cast your vote from now on until before %s."
         ],
         "You can cast your vote from %s until before %s.": [
            "You can cast your vote from %s until before %s."
         ],
         "It is not possible anymore to cast your vote.": [
            "It is not possible anymore to cast your vote."
         ],
         "voting\u0004Best option": [
            "Best option"
         ],
         "voting\u0004Acceptance": [
            "Acceptance"
         ],
         "voting\u0004Yes": [
            "Yes"
         ],
         "voting\u0004No": [
            "No"
         ],
         "voting\u0004Abstentation": [
            "Abstentation"
         ],
         "voting\u0004Scores": [
            "Scores"
         ],
         "List_of_Votes\u0004Vote": [
            "Vote"
         ]
      }
   }
}; 
