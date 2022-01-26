if (typeof translations === 'undefined') translations = [];
translations['cs'] = 
{
   "domain": "messages",
   "locale_data": {
      "messages": {
         "": {
            "domain": "messages",
            "plural_forms": "nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;",
            "lang": "cs"
         },
         "There is an error in the server configuration. The server did not deliver the server infos. api/./getserverinfos says %s": [
            "V konfiguraci serveru došlo k chybě. Server nedodal informace o serveru. api/./getserverinfos říká %s"
         ],
         "Voting server": [
            "Hlasovací server"
         ],
         "Checking server": [
            "Kontrolní server",
            "%d Kontrolní servery",
            "%d Kontrolních serverů",
            "%d Kontrolní servery"
         ],
         "Please enter a valid voting link. Valid voting links start with \"http://\" oder \"https://\".": [
            "Zadejte prosím platný odkaz pro hlasování. Platné hlasovací odkazy začínají na \"http://\" nebo \"https://\"."
         ],
         "The given voting URL is not in the expected format (missing '?' or 'confighash=' resp. 'electionUrl=')": [
            "Zadaná adresa URL hlasování není v očekávaném formátu (chybí '?' nebo 'confighash=' resp. 'electionUrl=')."
         ],
         "The given voting URL is not in the expected format (missing 'confighash=').": [
            "Zadaná adresa URL hlasování není v očekávaném formátu (chybí 'confighash=')."
         ],
         "The voting configuration obtained from the server does not match the checksum. The server is trying to cheat you. Aborted.": [
            "Konfigurace hlasování získaná ze serveru neodpovídá kontrolnímu součtu. Server se vás snaží podvést. Přerušeno."
         ],
         "The voting configuration could not be loaded from the provided URL": [
            "Konfiguraci hlasování se nepodařilo načíst ze zadané adresy URL."
         ],
         "Error: The config does not contain the questions": [
            "Chyba: Konfigurace neobsahuje otázky"
         ],
         "Error: The config does not contain the blinder Data": [
            "Chyba: Konfigurace neobsahuje položka Data"
         ],
         "Error: The config does not contain the permission server keys": [
            "Chyba: Konfigurace neobsahuje klíče serveru oprávnění"
         ],
         "Error: The config does not contain the permission server key": [
            "Chyba: Konfigurace neobsahuje klíč serveru oprávnění"
         ],
         "Voting link: ": [
            "Hlasovací odkaz:"
         ],
         "1<sup>st</sup> Enter voting link": [
            "1.<sup></sup> Zadejte odkaz pro hlasování"
         ],
         "2<sup>nd</sup> Show the result": [
            "2.<sup></sup> Zobrazit výsledek"
         ],
         "<p>Enter the link of the voting for which you want to see the results<br></p>": [
            "<p>Zadejte odkaz na hlasování, jehož výsledky chcete zobrazit.<br></p>"
         ],
         "Get voting results": [
            "Zjistit výsledky hlasování"
         ],
         "Get Voting Results": [
            "Získat výsledky hlasování"
         ],
         "Name of the voting: ": [
            "Název hlasování: "
         ],
         "The voting requieres authorisation module >%s< which is not supported by this client.\nUse a compatible client.": [
            "Hlasování vyžaduje autorizační modul >%s<, který tento klient nepodporuje.\nPoužijte kompatibilního klienta."
         ],
         "Your web browser %s %s not supported. Please use FireFox at least version 34, Chrome at least version 38 (except on Android) or Edge. Do not use iPad or iPhone (iOS)": [
            "Váš webový prohlížeč %s %s není podporován. Použijte prosím FireFox alespoň verze 34, Chrome alespoň verze 38 (kromě Androidu) nebo Edge. Nepoužívejte iPad nebo iPhone (iOS)"
         ],
         "Your web browser %s %s is on %s not supported. Please use FireFox at least version 34, Chrome at least version 38 (except on Android) or Edge. iPad and iPhone (iOS) does not work at all. MacOS works.": [
            "Váš webový prohlížeč %s %s na %s není podporován. Použijte prosím FireFox alespoň verze 34, Chrome alespoň verze 38 (kromě Androidu) nebo Edge. iPad a iPhone (iOS) nefunguje vůbec. Systém MacOS funguje."
         ],
         "Your web browser %s %is not supported. Please use FireFox at least version 34, Chrome at least version 38 (except on Android) or Edge.": [
            "Váš webový prohlížeč %s %i není podporován. Použijte prosím FireFox alespoň verze 34, Chrome alespoň verze 38 (kromě Androidu) nebo Edge."
         ],
         "Check of credentials failed. You are not in the list of allowed voters for this voting or secret not accepted.": [
            "Kontrola pověření se nezdařila. Nejste na seznamu povolených voličů pro toto hlasování nebo tajné hlasování nebylo přijato."
         ],
         "Cheating: Your computer sent a wrong name of voting.": [
            "Podvádění: Váš počítač odeslal špatný název hlasování."
         ],
         "The phase of creating voting certificates is yet to begin.": [
            "Fáze vytváření hlasovacích certifikátů teprve začne."
         ],
         "The phase of creating voting certificates has already ended.": [
            "Fáze vytváření hlasovacích certifikátů již skončila."
         ],
         "The phase of casting votes is yet to begin.": [
            "Fáze odevzdávání hlasů teprve začne."
         ],
         "The phase of casting votes has already ended.": [
            "Fáze odevzdávání hlasů již skončila."
         ],
         "You can fetch the result of the voting only after the phase of casting votes has ended.": [
            "Výsledek hlasování můžete získat až po skončení fáze odevzdávání hlasů."
         ],
         "You cannot fetch the voting result anymore.": [
            "Výsledek hlasování již nelze načíst."
         ],
         "Now is not the phase of casting votes.": [
            "Nyní není fáze odevzdávání hlasů."
         ],
         "The server already confirmed a voting certificate for this voting for you. For every eligible voter, only one voting certificate will be confirmed (that means digitally signed by the server).": [
            "Server vám již potvrdil hlasovací certifikát pro toto hlasování. Pro každého oprávněného hlasujícího bude potvrzen pouze jeden hlasovací certifikát (to znamená digitálně podepsaný serverem)."
         ],
         "You already have cast a vote for this voting.": [
            "Pro toto hlasování jste již hlasovali."
         ],
         "The name of the voting is already in use.": [
            "Název hlasování se již používá."
         ],
         "The voting does not exist on the server. Most likely the voting link is wrong. Please correct it and try again.": [
            "Hlasování na serveru neexistuje. S největší pravděpodobností je odkaz na hlasování špatný. Opravte jej a zkuste to znovu."
         ],
         "A voting with the requested name does not exist on the server. Use the voting link directly.": [
            "Hlasování s požadovaným názvem na serveru neexistuje. Použijte přímo odkaz na hlasování."
         ],
         "You did not allow this server to check your eligibility at the identity server. Please allow this server to checkt your eligibility at the identity server and try again.": [
            "Nepovolili jste tomuto serveru ověřit vaši způsobilost na serveru identity. Povolte prosím tomuto serveru ověřit vaši způsobilost na serveru identit a zkuste to znovu."
         ],
         "The session is not valid, most likely it expired or you logged out.": [
            "Relace není platná, pravděpodobně vypršela nebo jste se odhlásili."
         ],
         "The voters will be identified by a token and the eligibility will be verified by this token.<br>": [
            "Voliči budou identifikováni pomocí tokenu a podle tohoto tokenu bude ověřena jejich způsobilost.<br>"
         ],
         "Steps: ": [
            "Kroky:"
         ],
         "Authorize voting server": [
            "Autorizace hlasovacího serveru"
         ],
         "Authorize checking server": [
            "Autorizační kontrolní server"
         ],
         "Create voting certificate": [
            "Vytvořit hlasovací certifikát"
         ],
         "Configuration error: serverId >%s< is asked for, but not configured": [
            "Chyba konfigurace: ServerId >%s< je požadován, ale není nakonfigurován."
         ],
         "Step %s: ": [
            "Krok %s: "
         ],
         "Authorize %s": [
            "Autorizovat %s"
         ],
         "Authorization succeeded": [
            "Autorizace proběhla úspěšně"
         ],
         "Log out": [
            "Odhlásit"
         ],
         "Name me publicly as ": [
            "Jmenujte mě veřejně jako "
         ],
         "Using the an identity server (which is specifical designed to work with vvvote), a list of eligible voters is created on the identity server for each voting date. Enter the ID of this list.<br>": [
            "Pomocí serveru identit (který je speciálně navržen pro práci s vvvote) se na serveru identit vytvoří seznam oprávněných voličů pro každý den hlasování. Zadejte ID tohoto seznamu.<br>"
         ],
         "ID of the list of eligible voters": [
            "ID seznamu oprávněných voličů"
         ],
         "Your name:": [
            "Vaše jméno:"
         ],
         "Voting password:": [
            "Heslo pro hlasování:"
         ],
         "Additionally, tell the eligible voters the voting password.": [
            "Kromě toho sdělte oprávněným voličům heslo pro hlasování."
         ],
         "The voters enter thier name and can only cast their vote if they know the password given here. Everyone who knows the password can cast his vote.<br>": [
            "Volič zadá své jméno a může hlasovat pouze tehdy, pokud zná heslo, které je zde uvedeno. Každý, kdo zná heslo, může hlasovat.<br>"
         ],
         "Voting password": [
            "Heslo pro hlasování"
         ],
         "Verification of server signature failed. Aborted.": [
            "Ověření podpisu serveru se nezdařilo. Přerušeno."
         ],
         "The following questionID is missing in the server answer: ": [
            "V odpovědi serveru chybí následující questionID: "
         ],
         "A Signature does not belong to the server we sent the data to in order to let the server sign it.": [
            "Podpis nepatří serveru, kterému jsme data poslali, aby je mohl podepsat."
         ],
         "Expected: >%s<, received: >%s<": [
            "Očekávané: >%s<, přijato: >%s<"
         ],
         "I already got enough sigs but server said: 'more sigs needed': \n%s": [
            "Mám už dost znaků, ale server řekl: \"je potřeba více znaků\": \n%s"
         ],
         "unknown server cmd: %s": [
            "neznámý server cmd: %s"
         ],
         "An unknown system error occured: %s": [
            "Došlo k neznámé systémové chybě: %s"
         ],
         "an exception occured: %s": [
            "došlo k výjimce: %s"
         ],
         "%s has rejected your request (error no  %d):\n %s": [
            "%s odmítl vaši žádost (chyba č. %d):\n %s"
         ],
         "Client found error:\n %s": [
            "Klient nalezl chybu:\n %s"
         ],
         "handleXmlAnswer(): Internal program error, got unknown action: %s": [
            "handleXmlAnswer(): Vnitřní chyba programu, neznámá akce: %s"
         ],
         "Voting certificate %s": [
            "Hlasovací certifikát %s"
         ],
         "In order to be able to cast your vote, you have to save your voting certificate on your device now": [
            "Abyste mohli hlasovat, musíte si nyní do svého zařízení uložit hlasovací certifikát."
         ],
         "Creating voting certificate": [
            "Vytvoření hlasovacího certifikátu"
         ],
         "<ul><li>You will get voting certificae in the form of a webpage file as result of this step.</li><li>Please remember where you saved it.</li><li>The voting certificate is neccesary in order to cast the vote. There is no way getting a replacement for it. Thus, save it securely till the end of the voting.</li></ul>": [
            "<ul><li>Výsledkem tohoto kroku bude hlasovací certifikát ve formě souboru na webové stránce.</li><li>Pamatujte si, kam jste jej uložili.</li><li>Hlasovací certifikát je nutný pro hlasování. Není možné jej nahradit. Proto si jej bezpečně uložte až do konce hlasování.</li></ul>"
         ],
         "<p><h2>Technical information</h2>The voting certificate is digitally signed by at least two servers. This signatures makes the certificate valid for voting. <br> The voting certificate contains an unique certificate number which is only known by your device - it was generated by your device and encrypted before it was sent and signed by the servers. Your device decrypts thes certificate number together with the server's signatures (This procedure is called &quot;Blinded Signature&quot;). Thus, the servers do not know the certificate number. <br> You can imagine it as follows:<br>  Your device generates a long random number (a unique number) and writes it on a sheet of paper. Your device lays a sheet of carbon-paper on this sheet, puts them together in an envelope, seals it and sends it to the servers. The servers sign on the outside of the envelope, in case you are entitled to vote. By doing so, the signature is transferred to the sheet containing the certificate number because of the carbon-paper. The servers do not open the envelope (which they cannot do, because they do not know the needed key), and send the envelope back to your device. Your device opens (decrypts) the envelope. In result, your device has a sheet of paper containing a unique certificate number and the signatures of the servers, but the servers do not know this number.The unique number together with the server's signatures and the ballot is called >voting certificate<.</p>": [
            "<p><h2>Technické informace</h2>Hlasovací certifikát je digitálně podepsán nejméně dvěma servery. Díky tomuto podpisu je certifikát platný pro hlasování. <br>Hlasovací certifikát obsahuje jedinečné číslo certifikátu, které zná pouze vaše zařízení - bylo vygenerováno vaším zařízením a zašifrováno před odesláním a podepsáním servery. Vaše zařízení dešifruje číslo certifikátu spolu s podpisy serverů (tento postup se nazývá &quot;Slepý podpis&quot;). Servery tedy číslo certifikátu neznají. <br>Můžete si to představit následovně: <br>Vaše zařízení vygeneruje dlouhé náhodné číslo (jedinečné číslo) a napíše ho na list papíru. Vaše zařízení na tento list položí list uhlového papíru, vloží je dohromady do obálky, zapečetí ji a odešle serverům. Servery se podepíší na vnější stranu obálky pro případ, že jste oprávněni hlasovat. Tím se podpis přenese na list, který obsahuje číslo osvědčení, protože tam je uhlový kopírovací papír. Servery obálku neotevřou (což ani nemohou, protože neznají potřebný klíč) a pošlou obálku zpět do vašeho zařízení. Vaše zařízení obálku otevře (dešifruje). Výsledkem je, že vaše zařízení má list papíru obsahující jedinečné číslo certifikátu a podpisy serverů, které však servery neznají. jedinečné číslo spolu s podpisy serverů a hlasovacím lístkem se nazývá >hlasovací certifikát<.</p>"
         ],
         "Please load the voter certification file": [
            "Načtěte prosím soubor s certifikátem voliče"
         ],
         "Search": [
            "Hledat"
         ],
         "<h2>Voting certificate generated.</h2><p id=\"didSaveButtonsId\">Did you save the voting certificate on your devide?<br><button id=\"savedReturnEnvelope\" onclick=\"page.blinder.onUserDidSaveReturnEnvelope();\" >Yes</button>&emsp;<button id=\"didNotSaveReturnEnvelope\" onclick=\"page.blinder.saveReturnEnvelope();\" >No</button></p><p><ul id=\"howToVoteId\" style=\"display:none\"><li>You got a voting certificate in the form of a webpage file which you saved on your device.</li><li>Please remember the place where you saved it.</li><li>The voting certificate is needed in order to cast the vote. There is no way obaining a new one. Thus, save it securly till the end of the voting.</li><li>In order to cast a vote, open the voting certificate in a web browser. You can do this by double clicking it in the file explorer.</li><li>Everyone who has the voting certificate can use it to cast the vote - thus do not pass it on</li><li>Casting the vote using the voting certificate is anonymous. That means, as long as you do not help, nobody can find out who sent the vote.</li><li>%s</li></ul></p>": [
            "<h2>Vygeneroval se hlasovací certifikát.</h2><p id=\"didSaveButtonsId\">Uložili jste si hlasovací certifikát do svého zařízení?<br>Ano<button id=\"savedReturnEnvelope\" onclick=\"page.blinder.onUserDidSaveReturnEnvelope();\" >&emsp;<button id=\"didNotSaveReturnEnvelope\" onclick=\"page.blinder.saveReturnEnvelope();\" >Ne</button></p><p><ul id=\"howToVoteId\" style=\"display:none\"><li>Dostali jste hlasovací certifikát ve formě souboru webové stránky, který jste si uložili do svého zařízení.</li><li>Zapamatujte si prosím místo, kam jste ho uložili.</li><li>Hlasovací certifikát je nutný k hlasování. Není možné získat nový. Proto si jej bezpečně uložte až do konce hlasování.</li><li>Abyste mohli hlasovat, otevřete hlasovací certifikát ve webovém prohlížeči. Můžete tak učinit dvojitým kliknutím v průzkumníku souborů.</li><li>Hlasovat může každý, kdo má hlasovací certifikát - nepředávejte jej tedy dál</li><li>Vložení hlasu pomocí hlasovacího certifikátu je anonymní. To znamená, že pokud tomu nepomůžete, nikdo nemůže zjistit, kdo hlas poslal.</li><li>%s</li></ul></p>"
         ],
         "Error: voting certificate data not found": [
            "Chyba: údaje o hlasovacím certifikátu nebyly nalezeny"
         ],
         "Error: voting certificate data could not be read: JSON decode failed": [
            "Chyba: data hlasovacího certifikátu se nepodařilo načíst: JSON se nepodařilo dekódovat"
         ],
         "The voter certificate is not consistent": [
            "Hlasovací certifikát není konzistentní"
         ],
         "The signature on the vote is correct. This means that the vote is unchanged.": [
            "Podpis na hlasování je správný. To znamená, že hlasování zůstává beze změny."
         ],
         "The signature on the vote is not correct. This means that the vote is changed or the key does not match.": [
            "Podpis na hlasování není správný. To znamená, že hlasování je změněno nebo nesouhlasí klíč."
         ],
         "Error verifying a signature:\nThe number of signatures on the voting certificate is not correct. \nRequired number: %d, number in this voting certificate: %d": [
            "Chyba při ověřování podpisu:\nPočet podpisů na hlasovacím certifikátu není správný. \nPožadovaný počet: %d, počet v tomto hlasovacím certifikátu: %d"
         ],
         "The vote is not for this election (Election IDs do not match).": [
            "Hlasování se netýká těchto voleb (nesouhlasí volební ID)."
         ],
         "The vote is not for this election (Question ID not found in election configuration).": [
            "Hlasování se netýká těchto voleb (ID otázky nebylo nalezeno v konfiguraci voleb)."
         ],
         "The signature by the permission server >%s< for the voting key is correct. This means, the server has confirmed that the according voter is entitled to vote.": [
            "Podpis serveru oprávnění >%s< pro hlasovací klíč je správný. To znamená, že server potvrdil, že daný volič je oprávněn hlasovat."
         ],
         "The signature by permission server >%s< for the voting key is not correct. Either the configuration is wrong or there is a fraud. Please inform the persons responsible for the voting": [
            "Podpis serveru oprávnění >%s< pro hlasovací klíč není správný. Buď je konfigurace špatná, nebo dochází k podvodu. Informujte prosím osoby odpovědné za hlasování"
         ],
         "Error verifying the signature:\n%s": [
            "Chyba při ověřování podpisu:\n%s"
         ],
         "For voter >%s< the server >%s< returns a different order of signatures than server >%s<.": [
            "Pro voliče >%s< vrací server >%s< jiné pořadí podpisů než server >%s<."
         ],
         "Motion group": [
            "Skupina návrhu"
         ],
         "Motion title": [
            "Název návrhu"
         ],
         "Action": [
            "Akce"
         ],
         "Show &amp; <br>vote": [
            "Zobrazit &amp; <br>hlas"
         ],
         "Hide": [
            "Skrýt"
         ],
         "Client does not support voting scheme >%s<": [
            "Klient nepodporuje hlasovací schéma >%s<"
         ],
         "Cast vote!": [
            "Hlasujte!"
         ],
         "Save voting recceipt": [
            "Uložit potvrzení o hlasování"
         ],
         "Motion text": [
            "Text návrhu"
         ],
         "Initiator: %s": [
            "Iniciátor: %s",
            "Iniciátoři: %s",
            "Iniciátoři: %s",
            "Iniciátoři: %s"
         ],
         "Summary": [
            "Shrnutí"
         ],
         "Reasons": [
            "Důvody"
         ],
         "<p>You cannot fetch the result as long as vote casting is possible.</p>": [
            "<p>Dokud je možné hlasovat, nemůžete získat výsledek.</p>"
         ],
         "Show all votes": [
            "Zobrazit všechny hlasy"
         ],
         "Error: Expected >showWinners< or >error<": [
            "Chyba: Očekávaný >showWinners< nebo >error<"
         ],
         "Got from server: %s": [
            "Získáno ze serveru: %s"
         ],
         "Something did not work: %s": [
            "Něco nefunguje: %s"
         ],
         "In motion group %s, no motion got the requiered number of votes. ": [
            "Ve skupině návrhů %s nezískal žádný návrh potřebný počet hlasů. "
         ],
         "Motion %s": [
            "Návrh %s"
         ],
         " and ": [
            " a "
         ],
         "In motion group %s, %s won. ": [
            "Ve skupině návrhu %s , %s vyhrál. ",
            "Ve skupině návrhu %s , %s vyhrály. ",
            "Ve skupině návrhu %s, %s vyhrálo. ",
            "Ve skupině návrhu %s, %s vyhrálo. "
         ],
         "Close": [
            "Zavřít"
         ],
         "Votes on %s ": [
            "Hlasy na %s "
         ],
         "motion %s": [
            "návrh %s"
         ],
         "Yes/No": [
            "Ano/Ne"
         ],
         "Score": [
            "Skóre"
         ],
         "Picked": [
            "Vybráno"
         ],
         "Scheme not supported": [
            "Schéma není podporováno"
         ],
         "Voting number": [
            "Hlasovací číslo"
         ],
         "Verify!": [
            "Ověřit!"
         ],
         "Error": [
            "Chyba"
         ],
         "invalid": [
            "neplatné"
         ],
         "Yes": [
            "Ano"
         ],
         "No": [
            "No"
         ],
         "Abst.": [
            "Abst."
         ],
         " - my vote": [
            " - můj hlas"
         ],
         "Verify signatures!": [
            "Ověřit podpisy!"
         ],
         "Number of YESs": [
            "Počet ANO"
         ],
         "Number of NOs": [
            "Počet NE"
         ],
         "Number of absten.": [
            "Počet absten."
         ],
         "Sum of scores": [
            "Součet výsledků"
         ],
         "Number picked": [
            "Zvolené číslo"
         ],
         "Not Supported voting scheme": [
            "Nepodporovaný systém hlasování"
         ],
         "Voting scheme not supported": [
            "Systém hlasování není podporován"
         ],
         "Motion group: %s": [
            "Skupina návrhu %s"
         ],
         "Question to be voted on": [
            "Otázka, o které se bude hlasovat"
         ],
         "Tally servers accepted the vote!": [
            "Sčítací servery přijaly hlasování!"
         ],
         "Vote accepted": [
            "Hlasování přijato"
         ],
         "Error 238u8": [
            "Chyba 238u8"
         ],
         "Vote casting is closed": [
            "Hlasování je uzavřeno"
         ],
         "Vote casting starts at %s": [
            "Hlasování začíná na %s"
         ],
         "The server did not accept the vote.": [
            "Server hlasování nepřijal."
         ],
         "The server >%s< did not accept the vote.": [
            "Server >%s< hlasování nepřijal."
         ],
         "It says:\n": [
            "Píše se v něm:\n"
         ],
         "Error: Expected >saveYourCountedVote<": [
            "Chyba: Očekávaná chyba >saveYourCountedVote<"
         ],
         "Information: The server's (%s) clock time in the voting receipt (%s) deviates from the clock time of your device (%s)": [
            "Informace: Čas hodin serveru (%s) v potvrzení o hlasování (%s) se liší od času hodin vašeho zařízení (%s)."
         ],
         "Error while verifying tally server /%s/ signature: %s": [
            "Chyba při ověřování podpisu hlasovacího serveru /%s/ podpis: %s"
         ],
         "The signature from server >%s< does not match the signed vote": [
            "Podpis ze serveru >%s< neodpovídá podepsanému hlasování"
         ],
         "Error: missing the signed data (no dot in the string)": [
            "Chyba: chybí podepsaná data (v řetězci není tečka)"
         ],
         "This file can be used in order to proof that a tallying server\r\ndid receive the vote. The server's signature proofs it. The \r\nsignature is here in the standard JWT format which can be \r\nverified by according services, e.g. https://jwt.io/ \r\nJust copy the value of \"JWT\" into the field \"Encoded\" and the \r\naccording public key from below in the field \"VERIFY SIGNATURE\"\r\non the before mentioned website. The JWT contains all the \r\ninformation that is also shown in JSON clear text.": [
            "Tento soubor lze použít jako důkaz, že sčítací server \nskutečně obdržel hlas. Důkazem je podpis serveru. \nPodpis je zde ve standardním formátu JWT, který lze \nověřit pomocí příslušných služeb, např. https://jwt.io/. \nStačí zkopírovat hodnotu \"JWT\" do pole \"Encoded\" \na příslušný veřejný klíč z níže uvedeného pole \"VERIFY SIGNATURE\" \nna výše uvedené webové stránce. JWT obsahuje všechny \ninformace, které jsou rovněž zobrazeny v čistém textu JSON."
         ],
         "Voting receipt %s": [
            "Příjem hlasů %s"
         ],
         "In order to be able to proof that you sent your vote, you can save the voting receipt": [
            "Abyste mohli doložit, že jste svůj hlas odeslali, můžete si uložit potvrzení o hlasování."
         ],
         "<p>As long as it is possible to cast votes, it is not possible to get the voting result.</p>": [
            "<p>Dokud je možné hlasovat, není možné získat výsledek hlasování.</p>"
         ],
         "The server does not reveal the result. It answers:\n %s": [
            "Server výsledek nezveřejní. Odpovídá:\n %s"
         ],
         "Error: Expected >verifyCountVotes<": [
            "Chyba: Očekávaná chyba >verifyCountVotes<"
         ],
         "Error: unexpected var type": [
            "Chyba: neočekávaný typ var"
         ],
         "details: %s": [
            "detaily: %s"
         ],
         "Error: some error occured": [
            "Chyba: došlo k nějaké chybě"
         ],
         "Number of Votes": [
            "Počet hlasů"
         ],
         "Total": [
            "Celkem"
         ],
         "1<sup>st</sup> Set voting preferences": [
            "1.<sup></sup> Nastavení hlasovacích preferencí"
         ],
         "2<sup>nd</sup> Save voting link": [
            "2.<sup></sup> odkaz Uložit hlasování"
         ],
         "Here you can create a new voting. In order to do so, fill in the name of the voting and set the preferences for the authorization mechanism. <br><br>": [
            "Zde můžete vytvořit nové hlasování. Za tímto účelem vyplňte název hlasování a nastavte preference mechanismu autorizace. "
         ],
         "Name of voting": [
            "Název hlasování"
         ],
         "Vote on": [
            "Hlasovat o"
         ],
         "predefined test voting items": [
            "předdefinované položky pro testovací hlasování"
         ],
         "Enter a question to vote on": [
            "Zadejte otázku, o které chcete hlasovat"
         ],
         "Autorization method": [
            "Autorizační metoda"
         ],
         "External token verification": [
            "Externí ověření tokenu"
         ],
         "Upload a list of usernames and passwords": [
            "Nahrání seznamu uživatelských jmen a hesel"
         ],
         "Create new voting": [
            "Vytvořit nové hlasování"
         ],
         "Open a new voting": [
            "Otevřít nové hlasování"
         ],
         "Waiting for the servers": [
            "Čekání na servery"
         ],
         "The hash obtained from the server does not match the hash from another server. The server is trying to cheat you. Aborted.": [
            "Hash získaný ze serveru se neshoduje s hashem z jiného serveru. Server se vás snaží podvést. Přerušeno."
         ],
         "Save the link and distribute it to all eligable people. ": [
            "Uložte odkaz a rozešlete jej všem oprávněným osobám. "
         ],
         "This is the voting link: ": [
            "Toto je odkaz pro hlasování: "
         ],
         "Server reports error: \n": [
            "Server hlásí chybu: \n"
         ],
         "Unknown command from Server: \n": [
            "Neznámý příkaz ze serveru: \n"
         ],
         "Online Voting:<br> anonymous and traceable": [
            "Hlasování online:<br> anonymní a sledovatelné"
         ],
         "Take part in a voting": [
            "Zúčastněte se hlasování"
         ],
         "Fetch result": [
            "Načtení výsledku"
         ],
         "That's how": [
            "Takto"
         ],
         "Show explanations and technical information": [
            "Zobrazit vysvětlení a technické informace"
         ],
         "About": [
            "O aplikaci"
         ],
         "Privacy statement": [
            "Prohlášení o ochraně soukromí"
         ],
         "Ok": [
            "Ok"
         ],
         "There is an error in the configuration. Please inform the administrator. (error no.: 875765: URL not defined or not of type string)": [
            "V konfiguraci došlo k chybě. Informujte prosím správce. (číslo chyby: 875765: URL není definována nebo není typu string)"
         ],
         "There is an error in the configuration. Please inform the administrator. (error no.: 875766: URL not defined or not of type string)": [
            "V konfiguraci došlo k chybě. Informujte prosím správce. (číslo chyby: 875766: URL není definována nebo není typu string)"
         ],
         "An error occured while connecting to a server": [
            "Při připojování k serveru došlo k chybě."
         ],
         "Click %s this link, in order to test the connection manually.</a>The link will be opened in a new window.</li> <li>Solve the problem,</li> <li>close the window and </li><li>click afterwards on %s try again</button>": [
            "Kliknutím na tento %s odkaz můžete připojení otestovat ručně.</a>Odkaz se otevře v novém okně.</li> <li>Vyřešte problém,</li> <li>zavřete okno a poté </li><li>klikněte na %s a zkusite to znovu.</button>"
         ],
         "Received from: ": [
            "Přijato od:"
         ],
         "2<sup>nd</sup> Authorize": [
            "2.<sup></sup> autorizace"
         ],
         "3<sup>rd</sup> Vote": [
            "3.<sup></sup> hlasování"
         ],
         "Enter Voting Link": [
            "Zadejte hlasovací odkaz"
         ],
         "<p><ul><li>I yet do not have a voting certificate</li><li>For this voting no voting certificate is needed</li><li>I do not know wheather a voting vertificate is needed</li></ul>": [
            "<p><ul><li>Zatím nemám hlasovací certifikát</li><li>Pro toto hlasování není potřeba žádný hlasovací certifikát</li><li>Nevím, zda je hlasovací certifikát potřeba.</li></ul>"
         ],
         "Fetch voting properties": [
            "Načtení hlasovacích vlastností"
         ],
         "I already have a voting certificate": [
            "Již mám hlasovací certifikát"
         ],
         "Take part in voting": [
            "Zapojte se do hlasování"
         ],
         "It is not possible anymore to create a voting certificate": [
            "Již není možné vytvořit hlasovací certifikát."
         ],
         "The voting requires blinding module >%s< which is not supported by this client.\nUse a compatible client.": [
            "Hlasování vyžaduje zaslepovací modul >%s<, který tento klient nepodporuje.\nPoužijte kompatibilního klienta."
         ],
         "The voting requires authorisation module >%s< which is not supported by this client.\nUse a compatible client.": [
            "Hlasování vyžaduje autorizační modul >%s<, který tento klient nepodporuje.\nPoužijte kompatibilního klienta."
         ],
         "Generate voting certificate and save it": [
            "Vygenerování hlasovacího certifikátu a jeho uložení"
         ],
         "Voting mode >%s< is not supported by this client": [
            "Režim hlasování >%s< není tímto klientem podporován."
         ],
         "Voting Certificate for %s": [
            "Hlasovací certifikát pro %s"
         ],
         "The voting certificate is not valid": [
            "Hlasovací certifikát není platný"
         ],
         "You directly opened the voting certificate, but you have to save it as file on your device.": [
            "Hlasovací certifikát jste otevřeli přímo, ale musíte jej uložit jako soubor ve svém zařízení."
         ],
         "Error r83g83": [
            "Chyba r83g83"
         ],
         "You can cast your vote from now on and without any time limit.": [
            "Od této chvíle můžete hlasovat bez časového omezení."
         ],
         "You can cast your vote from now on until before %s.": [
            "Hlasovat můžete od nynějška až do %s."
         ],
         "You can cast your vote from %s until before %s.": [
            "Hlasovat můžete od %s až do %s."
         ],
         "It is not possible anymore to cast your vote.": [
            "Hlasování již není možné."
         ],
         "voting\u0004Best option": [
            "Nejlepší možnost"
         ],
         "voting\u0004Acceptance": [
            "Přijetí"
         ],
         "voting\u0004Yes": [
            "Ano"
         ],
         "voting\u0004No": [
            "Ne"
         ],
         "voting\u0004Abstentation": [
            "Zdržení se hlasování"
         ],
         "voting\u0004Scores": [
            "Skóre"
         ],
         "List_of_Votes\u0004Vote": [
            "Hlas"
         ]
      }
   }
}; 
