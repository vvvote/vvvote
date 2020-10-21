function ConfigurableTally(blinder, config) {
	PublishOnlyTally.call(this, blinder, config);
}


ConfigurableTally.prototype = new PublishOnlyTally();


/***********************************************
 * 
 * New Election Phase
 * 
 */

ConfigurableTally.GetEnterQuestionsHtml = function() {
	return '';
};


ConfigurableTally.getNewElectionData = function() {
	var ret =  
	{		"tally": "configurableTally",
			"questions": [/*{
				"questionID": 1,
				"questionWording": "Drehen wir uns im Kreis? (zweistufig)",
				"scheme": [{
					"name": "yesNo",
					"abstention": true,
					"quorum": "2", // 0: no quorum, 1: at least as numbers of YESs as of NOs, 1+: more YESs than NOs, 2: at least twice as much YESs as NOs, 2+: more than twice as much YESs than NOs 
					"abstentionAsNo": false,
					"mode": "quorum" // "quorum": all that meet the quorum, "bestOnly": only the one with the most numer yes (if several have the same: returns all of them / if "quorum" set   
				},
				{
					"name": "score",
					"minScore": -3,
					"maxScore": 3
				}],
				"findWinner": ["yesNo",	"score", "yesNoDiff", "random"],
				"options": [{
					"optionID": 1,
					"optionTitle": "Ja, linksherum.",
					"optionDesc": "Hier mach ich zum test mal eine richtig lange Modulbeschreibung rein.\n\n Ich bin gespannt, wie die angezeigt wird als Legende für die Auswahlknöpfe. Meine Prognose ist, dass NRW das anonyme Verfahren einführen wird. Was glauben Sie, stimmt das?"
				},
				{
					"optionID": 2,
					"optionTitle": "Ja, rechtsherum"
				},
				{
					"optionID": 3,
					"optionTitle": "Nein. Ab durch die Mitte!"
				},
				{
					"optionID": 4,
					"optionTitle": "Jein. Wir drehen durch."
				}],
				"references": [{
					"referenceName": "Abschlussparty und Auflösung",
					"referenceAddress": "https://lqfb.piratenpartei.de/lf/initiative/show/5789.html"
				},
				{
					"referenceName": "Bilder zur Motivation",
					"referenceAddress": "https://startpage.com/do/search?cat=pics&cmd=process_search&language=deutsch&query=cat+content"
				}]
			},
			{
				"questionID": 2,
				"questionWording": "Drehen wir uns im Kreis? (nur ja/nein/Enthaltung)",
				"scheme": [{
					"name": "yesNo",
					"abstention": true,
					"abstentionAsNo": true,
					"quorum": "1+",    // 0: no quorum, 1: "at least the same number of YES as of NO", 1+: "more than YES than NO",		2: "at least twice as much YES than NO",		2+: "more than twice as much YES than NO""abstentionAsNo": false,
					"mode": "bestOnly" // "quorum": all options that meet the quorum, "bestOnly": only the one with the most numer yes (if several have the same: returns all of them / if "quorum" set to 0 no quorum is requiered)
				}],
				"findWinner": ["yesNo", "yesNoDiff", "random"],

				"options": [{
					"optionID": 1,
					"optionTitle": "Ja, linksherum. Hier mach ich zum test mal eine richtig lange Modulbeschreibung rein.<br> Ich bin gespannt, wie die angezeigt wird als Legende für die Auswahlknöpfe. Meine Prognose ist, dass NRW das anonyme Verfahren einführen wird. Was glauben Sie, stimmt das?"
				},
				{
					"optionID": 2,
					"optionTitle": "Ja, rechtsherum"
				},
				{
					"optionID": 3,
					"optionTitle": "Nein. Ab durch die Mitte!"
				},
				{
					"optionID": 4,
					"optionTitle": "Jein. Wir drehen durch."
				}],
				"references": [{
					"referenceName": "Abschlussparty und Auflösung",
					"referenceAddress": "https://lqfb.piratenpartei.de/lf/initiative/show/5789.html"
				},
				{
					"referenceName": "Bilder zur Motivation",
					"referenceAddress": "https://startpage.com/do/search?cat=pics&cmd=process_search&language=deutsch&query=cat+content"
				}]
			}, */
			{
				"questionID": 103,
				"questionWording":"SÄA18: Ständige Mitgliederversammlung ablehnen" /*+
				"\n* Hauptmodul: Ständige Mitgliederversammlung ablehnen" +
				"\n* Modul 1: keine Bereitstellung für Infrastruktur für die SMV" +
				"\n* Modul 2: Entwicklung auf Bundesebene abwarten" */,
				"scheme": [{
					"name": "yesNo",
					"abstention": true,
					"quorum": "2", // 0: no quorum, 1: at least as numbers of YESs as of NOs, 1+: more YESs than NOs, 2: at least twice as much YESs as NOs, 2+: more than twice as much YESs than NOs 
					"abstentionAsNo": false,
					"mode": "quorum" // "quorum": all that meet the quorum, "bestOnly": only the one with the most numer yes (if several have the same: returns all of them / if "quorum" set   
				},
				{
					"name": "score",
					"minScore": 0,
					"maxScore": 3
				}],
				"findWinner": ["yesNo",	"score", "yesNoDiff", "random"],
				"options":
					[
					 { "optionID": 1, 
						 "proponents": ["Alice", "Bob", "Carsten", "Dirk", "Ewald"], // optional. Names of people who made the motion
						 "optionTitle": "Hauptmodul: Ständige Mitgliederversammlung ablehnen", 
						 "optionDesc": "Der Landesverband NRW lehnt es grundsätzlich ab, zum jetzigen Zeitpunkt ein System einzuführen, welches unter zuhilfenahme von Online-Werkzeugen irgendeine Form von verbindlicher Abstimmung umsetzen soll.\
							 \n\nZu diesem Zweck werden aus §8 (2) der Landessatzung die Worte \"oder in einem vom Landesparteitag legitimierten Werkzeug\" gestrichen. ", 
						 "reasons": "== Glaubwürdigkeit ==\
								 \n* Beschluss/PM aus der Gründungszeit der Piratenpartei: https://wiki.piratenpartei.de/Pressemitteilung_vom_12.11.2006_zu_Wahlmaschinen\
								 \n* Wir machen uns absolut unglaubwürdig, wenn wir verbindliche Onlineabstimmungen beschliessen und durchführen.\
								 \n\n== Toolproblem ==\
					 \nEs gibt zum jetzigen Zeitpunkt kein einziges Tool, welches die elementaren Anforderungen an geheime Wahlen erfüllt (anonym/pseudonym, Nachvollzieh- und Überprüfbarkeit). Auf absehbare Zeit nicht umsetzbare Mitbestimmungswerkzeuge in die Satzung zu schreiben ist Zeitverschwendung und Wahlbetrug."	},
					 { "optionID": 2, 
						 "optionTitle": "SÄA 18: SMV Modul 1: 2014 keine Ressourcen für SMV bereitstellen", 
						 "optionDesc": "Das Thema SMV soll 2014 (mindestens für die Amtsperiode des derzeitgen Landesvorstandes) keine Rolle mehr spielen. Es soll insbesondere keinerlei finanzielle Förderung oder Bereitstellung von IT Infrastruktur aus Landesmitteln stattfinden." },
					 { "optionID": 3, 
							 "optionTitle": "SÄA 18: Modul 2: Entwicklung auf Bundesebene abwarten", 
							 "optionDesc": "Das Thema SMV soll auf Landesebene erst wieder aktiv behandelt werden, wenn es auf Bundesebene neue Entscheidungen oder Entwicklungen zum Thema SMV gibt (z.B. Bestätigung eines Tools, Satzungsänderungen)."
					 }],
				"references":[
							  { "referenceName":"Vollständiger Antrag zur SMV Option 1 - Ablehnung von verbindlicher Online-SMV mit Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A019" },
							  { "referenceName":"Vollständiger Antrag zur SMV Option 2 - Totholz SMV mit Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A019" },
							  { "referenceName":"Vollständiger Antrag zum Basisentscheid mit Begründung und Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A030" }
							  ]
			},
			{
				"questionID": 104,
				"questionWording":"SÄA19: Ständige Mitgliederversammlung (SMV) nur auf Totholz" /*+
				"\n* Totholz SMV" +
				"\n* Modul 1: Änderung der Entscheidsordnung durch den Basisentscheid" +
				"\n* Modul 2: An die Arbeit" */ ,
				"scheme": [{
					"name": "pickOne",
//					"abstention": true,
//					"quorum": "2", // 0: no quorum, 1: at least as numbers of YESs as of NOs, 1+: more YESs than NOs, 2: at least twice as much YESs as NOs, 2+: more than twice as much YESs than NOs 
//					"abstentionAsNo": false,
//					"mode": "quorum" // "quorum": all that meet the quorum, "bestOnly": only the one with the most numer yes (if several have the same: returns all of them / if "quorum" set   
				}],
				"findWinner": ["pickOne", "random"],
				"options":
					[
							  { "optionID": 1, 
								  "optionTitle": "SÄA 19: SMV Ständige Mitgliederversammlung nur auf Totholz einführen", 
								  "optionDesc": "Der Satzung wird an geeigneter Stelle einen Abschnitt \"Basisentscheid und Basisbefragung\" mit folgendem Wortlaut hinzugefügt: (Anmerkung 1: Der Text entspricht bis auf die hier durch Streichung bzw Fettschrift kenntlich gemachten Teile dem angenommenen SÄA003 (http://wiki.piratenpartei.de/Antrag:Bundesparteitag_2013.1/Antragsportal/SÄA003) aus Neumarkt.)\n\n\
								  (Anmerkung 2: Die parallel dazu vorgeschlagene Entscheidsordnung weicht deutlich von X011 (http://wiki.piratenpartei.de/Antrag:Bundesparteitag_2013.1/Antragsportal/X011) aus Neumarkt ab.) \
								  \n\n(1) Die Mitglieder fassen in einem Basisentscheid einen Beschluss, der einem des Landesparteitags gleichsteht. Ein Beschluss zu Sachverhalten, die dem Landesparteitag vorbehalten sind oder eindeutig dem Parteiprogramm widersprechen, gilt als Basisbefragung mit lediglich empfehlenden Charakter. Urabstimmungen gemäß §6 (2) Nr.11 PartG werden in Form eines Basisentscheids durchgeführt, zu dem alle stimmberechtigten Mitglieder in Textform eingeladen werden. Die nachfolgenden Bestimmungen für Anträge bzw. Abstimmungen gelten sinngemäß auch für Personen bzw. Wahlen.\
								  \n\n(2) Teilnahmeberechtigt sind alle persönlich identifizierten, am Tag der Teilnahme stimmberechtigten Mitglieder gemäß §4(4) der Bundessatzung, die mit ihren Mitgliedsbeiträgen nicht im Rückstand sind. Um für Quoren und Abstimmungen berücksichtigt zu werden, müssen sich die teilnahmeberechtigten Mitglieder zur Teilnahme anmelden.\
								  \n\n(3) Über einen Antrag wird nur abgestimmt, wenn er innerhalb eines Zeitraums ein Quorum von Teilnehmern als Unterstützer erreicht oder vom Bundesparteitag eingebracht wird. Der Landesvorstand darf organisatorische Anträge einbringen. Konkurrierende Anträge zu einem Sachverhalt können rechtzeitig vor der Abstimmung eingebracht und für eine Abstimmung gebündelt werden. Eine erneute Abstimmung über den gleichen oder einen sehr ähnlichen Antrag ist erst nach Ablauf einer Frist zulässig, es sei denn die Umstände haben sich seither maßgeblich geändert. Über bereits erfüllte, unerfüllbare oder zurückgezogene Anträge wird nicht abgestimmt. Der Landesparteitag soll die bisher nicht abgestimmten Anträge behandeln.\
								  \n\n(4) Vor einer Abstimmung werden die Anträge angemessen vorgestellt und zu deren Inhalt eine für alle Teilnehmer zugängliche Debatte gefördert. Die Teilnahme an der Debatte und Abstimmung muss für die Mitglieder zumutbar und barrierefrei sein. Anträge werden nach gleichen Maßstäben behandelt. Mitglieder bzw. Teilnehmer werden rechtzeitig über mögliche Abstimmungstermine bzw. die Abstimmungen in Textform informiert.\
								  \n\n(5) Die Teilnehmer haben gleiches Stimmrecht, das sie selbstständig und frei innerhalb des Abstimmungszeitraums ausüben. Abstimmungen außerhalb des Parteitags erfolgen entweder pseudonymisiert oder geheim. Bei pseudonymisierter Abstimmung kann jeder Teilnehmer die unverfälschte Erfassung seiner eigenen Stimme im Ergebnis überprüfen und nachweisen. Bei personellen Sachverhalten oder auf Antrag einer Minderheit muss die Abstimmung geheim erfolgen. In einer geheimen Abstimmung sind die einzelnen Schritte für jeden Teilnehmer ohne besondere Sachkenntnisse nachvollziehbar und die Stimmabgabe erfolgt nicht elektronisch. Die Manipulation einer Abstimmung oder die Veröffentlichung von Teilergebnissen vor Abstimmungsende sind ein schwerer Verstoß gegen die Ordnung der Partei.\
							      \n\n(6) Das Nähere regelt die Entscheidsordnung, welche durch den Landesparteitag beschlossen wird und auch per Basisentscheid geändert werden kann." },
							  { "optionID": 2, 
							    	  "optionTitle": "SÄA 19: Modul 1: Änderung der Entscheidsordnung durch den Basisentscheid", 
							    	  "optionDesc": "Abschnitt (6) wird ersetzt durch:" +
							    	  		"\n\n(6) Das Nähere regelt die Entscheidsordnung, welche durch den Landesparteitag beschlossen wird und auch per Basisentscheid geändert werden kann." },
							  { "optionID": 3, 
							    	  	"optionTitle": "SÄA 19: Modul 2: An die Arbeit !", 
							    	  	"optionDesc": "Regionale und kommunale Gliederungen ausreichender Größe sind aufgefordert, spätestens nach der kommenden Kommunalwahl mit der Gründung von Urnen zu beginnen. Der Landesvorstand ist aufgefordert durch Ausschreibungen (oder sofern nötig & möglich auch durch Wahlen noch auf dem LPT), entsprechendes Personal für die Organisation und Durchführung zu finden und entsprechend zu beauftragen." },
					],
				"references":[]
			}, {
			"questionID": 105,
			"questionWording":"SÄA30: Basisentscheid Online (BEO) einführen" /* +
			"\n* Modul 1: Basisentscheid Online (BEO) einführen" +
			"\n* Modul 2: auch anonyme, nachvollziehbare Online-Abstimmung zulassen" +
			"\n* Modul 3: Programmänderungen im BEO mit 2/3-Mehrheit der abgegebenen Stimmen" */ ,
			"scheme": [{
				"name": "yesNo",
				"abstention": true,
				"quorum": "2", // 0: no quorum, 1: at least as numbers of YESs as of NOs, 1+: more YESs than NOs, 2: at least twice as much YESs as NOs, 2+: more than twice as much YESs than NOs 
				"abstentionAsNo": false,
				"mode": "quorum" // "quorum": all that meet the quorum, "bestOnly": only the one with the most numer yes (if several have the same: returns all of them / if "quorum" set   
			}],
			"findWinner": ["yesNo"],
			"options":
				[
							  { "optionID": 1, 
								  "optionTitle": "SÄA 30: Modul 1: Basisentscheids auch auf Landesebene einführen",
								  "shortDesc": "Modul 1: Einführung des auf Bundesebene bereits beschlossenen Basisentscheids auch auf Landesebene",
								  "optionDesc":"Der Landesparteitag möge Folgendes beschließen:\
									  \n\nModul 1\
									  \n\nDer Paragraph 16 der Bundessatzung (Basisentscheid und Basisbefragung) wird in die Landessatzung an geeigneter Stelle sinngemäß (d.h. Bund durch Land entsprechend zu ersetzen) eingefügt und eine kleine Unklarheit beseitigt:\
									  \n\n\"(1) Die Mitglieder fassen in einem Basisentscheid einen Beschluss, der einem Beschluss des Parteitags gleichsteht. Ein Beschluss zu Sachverhalten, die dem Parteitag vorbehalten sind oder eindeutig dem Parteiprogramm widersprechen, gilt als Basisbefragung mit lediglich empfehlenden Charakter. Urabstimmungen zur Auflösung und Verschmelzung werden in Form eines Basisentscheids durchgeführt, zu dem alle stimmberechtigten Mitglieder in Textform eingeladen werden. Die nachfolgenden Bestimmungen für Anträge bzw. Abstimmungen gelten sinngemäß auch für Personen bzw. Wahlen.\
									  \n\n(2) Teilnahmeberechtigt sind alle persönlich identifizierten, am Tag der Teilnahme stimmberechtigten Mitglieder gemäß Abschnitt A § 4 (4) der Bundessatzung, die mit ihren Mitgliedsbeiträgen nicht im Rückstand sind. Um für Quoren und Abstimmungen berücksichtigt zu werden, müssen sich die teilnahmeberechtigten Mitglieder zur Teilnahme anmelden.\
									  \n\n(3) Über einen Antrag wird nur abgestimmt, wenn er innerhalb eines Zeitraums ein Quorum von Teilnehmern als Unterstützer erreicht oder vom Parteitag eingebracht wird. Der Vorstand darf organisatorische Anträge einbringen. Konkurrierende Anträge zu einem Sachverhalt können rechtzeitig vor der Abstimmung eingebracht und für eine Abstimmung gebündelt werden. Eine erneute Abstimmung über den gleichen oder einen sehr ähnlichen Antrag ist erst nach Ablauf einer Frist zulässig, es sei denn die Umstände haben sich seither maßgeblich geändert. Über bereits erfüllte, unerfüllbare oder zurückgezogene Anträge wird nicht abgestimmt. Der Parteitag soll die bisher nicht abgestimmten Anträge behandeln.\
									  \n\n(4) Vor einer Abstimmung werden die Anträge angemessen vorgestellt und zu deren Inhalt eine für alle Teilnehmer zugängliche Debatte gefördert. Die Teilnahme an der Debatte und Abstimmung muss für die Mitglieder zumutbar und barrierefrei sein. Anträge werden nach gleichen Maßstäben behandelt. Mitglieder bzw. Teilnehmer werden rechtzeitig über mögliche Abstimmungstermine bzw. die Abstimmungen in Textform informiert.\
									  \n\n(5) Die Teilnehmer haben gleiches Stimmrecht, das sie selbstständig und frei innerhalb des Abstimmungszeitraums ausüben. Abstimmungen außerhalb des Parteitags erfolgen entweder pseudonymisiert oder geheim. Bei pseudonymisierter Abstimmung kann jeder Teilnehmer die unverfälschte Erfassung seiner eigenen Stimme im Ergebnis überprüfen und nachweisen. Bei personellen Sachverhalten oder auf Antrag einer Minderheit muss die Abstimmung geheim erfolgen. In einer geheimen Abstimmung sind die einzelnen Schritte für jeden Teilnehmer ohne besondere Sachkenntnisse nachvollziehbar und die Stimmabgabe erfolgt nicht elektronisch. Die Manipulation einer Abstimmung oder die Veröffentlichung von Teilergebnissen vor Abstimmungsende sind ein schwerer Verstoß gegen die Ordnung der Partei.\
									  \n\n(6) Das Nähere regelt die Entscheidsordnung, welche durch den Parteitag beschlossen wird und auch per Basisentscheid geändert werden kann.\"",
								  "reasons": "Die Partei braucht dringend ein Verfahren, mit dem Entscheidungen auch zwischen Parteitagen getroffen werden können. Der Basisentscheid wurde auf Bundesebene bereits beschlossen. Erhoffter Vorteil des Basisentscheides ist eine große Beteiligung durch einfache Teilnahme und frühzeitig bekannte Abstimmungstermine.\
										  \n\nDurch die Nutzung der gleichen Satzungsregelungen wie beim Bundesverband ergeben sich viele Synergien (Verifizierung, Termine, gleiche Software und Plattform, rechtliche Prüfung, Administration). Der Landesverband kann sich eine auf Landesebene angepasste Entscheidsordnung für die Details geben."
							  },
							  { "optionID": 2, 
								  "optionTitle": "SÄA30: Modul 2: Basisentscheid online anonym ermöglichen",
								  "shortDesc": "Der Basisentscheid, der auf bundesebene bislang online nur pseudonym vorgesehen ist, wird erweitert um die Möglichkeit, auch anonyme und nachvollziehbare Online-Abstimmungen durchzuführen", 
								  "optionDesc": "Modul 2 (nur abzustimmen, wenn Modul 1 angenommen wurde)\
									  \n\nNach Absatz 5 Satz 3 wird folgender Text eingefügt:\
									  \n\n\"Statt einer pseudonymisierten Abstimmung kann auch eine anonyme, mit Hilfe von kryptographischen Verfahren nachvollziehbare, elektronische Abstimmung durchgeführt werden. Das Verfahren darf nur eingeführt werden, wenn es mindestens genauso manipulationssicher und kryptografisch nachvollziehbar ist wie das pseudonymisierte.\"",	
								  "reasons": "Gegenüber der Regelung auf Bundesebene, die online nur pseudonymisierte Abstimmungen vorsieht, soll hier die Möglichkeit geschaffen werden, einen Schritt weiter zu gehen, so dass auch die Administratoren der Server die Stimmen den Abstimmenden nicht zuordnen können.\
										  \n\nDabei dürfen nur solche Verfahren eingesetzt werden, deren Nachvollziehbarkeit kryptografisch gesichert ist und die mindestens genau so manipulationssicher sind wie das vorgesehene pseudonymisierte Verfahren ist."
							  },
							  { "optionID": 3, 
								  "optionTitle": "SÄA30: Modul 3: Auch Programmanträge im Basisentscheid zulassen",
								  "optionDesc": "Paragraph 8 Absatz 2 der Satzung wird durch folgenden Text ersetzt:\
									  \n\n\"Des weiteren können die Parteiprogramme mit einer 2/3-Mehrheit der abgegeben gültigen Stimmen eines Basisentscheids geändert werden.\"",
							      "reasons": "Der bisherige § 8 Absatz 2 der Landessatzung führt dazu, dass Programmänderungen außerhalb von Parteitagen nur beschlossen werden können, wenn 2/3 aller Mitglieder schriftlich zustimmen (d.h. ca 4000 Ja-Stimmen). Das macht Programmentscheidungen außerhalb von Parteitagen praktisch unmöglich.\
										  \n\nDieses Modul sieht vor, dass der Basisentscheid auch zur Änderung der Parteiprogramme, jedoch nicht der Satzung eingesetzt werden kann. Ob dies grundsätzlich mit dem Parteiengesetz vereinbar ist, ist umstritten (siehe http://wiki.piratenpartei.de/Antrag:Bundesparteitag_2014.1/Antragsportal/SÄA004\""
							  }],
							  "references":[]
			},{
				"questionID": 106,
				"questionWording":"SÄA31: Ständige Mitgliederversammlung (SMV) einführen" /*+
				"\n* Modul 1: Antrag für eine SMV-NRW" +
				"\n* Modul 2: auch anonyme, nachvollziehbare Online-Abstimmung zulassen" +
				"\n* Modul 3: Programmänderungen im BEO mit 2/3-Mehrheit der abgegebenen Stimmen" */,
				"scheme": [{
					"name": "yesNo",
					"abstention": true,
					"quorum": "2", // 0: no quorum, 1: at least as numbers of YESs as of NOs, 1+: more YESs than NOs, 2: at least twice as much YESs as NOs, 2+: more than twice as much YESs than NOs 
					"abstentionAsNo": false,
					"mode": "quorum" // "quorum": all that meet the quorum, "bestOnly": only the one with the most numer yes (if several have the same: returns all of them / if "quorum" set   
					// "winnerIfQuorumFailed": 3, // if no option fulfills the quorum, this optionID will be declared as winner ("status quo"-option). If not set, no option will be declared as winner in this case
				}],
				"findWinner": ["yesNo"],
				"options":
						[
							  { "optionID": 1, 
								  "optionTitle": "SÄA31: Modul 1: Antrag für eine SMV-NRW",
								  "shortDesc": "Grundmodul (Modul 1): Einführung einer Ständigen Mitgliederversammlung (SMV) nach den Prinzipien von Liquid Democracy für Beschlüsse zu Stellungnahmen, Positionspapiere, Anfragen von Fraktionen und Programm",
								  "optionDesc": "Modul 1\
									  \n\n§ 6a Der Landesparteitag (Ergänzungsantrag)\
									  \n\n(8) Der Landesparteitag tagt daneben online und nach den Prinzipien von Liquid Democracy als Ständige Mitgliederversammlung (im folgenden \"SMV\" genannt). Jeder Pirat im Landesverband Nordrhein-Westfalen hat das Recht, an der SMV teilzunehmen. Die Stimmberechtigung in der SMV richtet sich nach § 4 Absatz 4 der Bundessatzung.\
									  \n\n(9) Die SMV kann Stellungnahmen, Positionspapiere, Anfragen von Fraktionen sowie Anträge zu Programmen verbindlich beschließen. Sie kann Anträge zur Satzung, zur Finanzordnung, zur Schiedsgerichtsordnung, zur Auflösung sowie zur Verschmelzung mit anderen Parteien (§ 9 Abs. 3 Parteiengesetz) nicht verbindlich beschließen, insoweit kann die SMV nur Empfehlungen abgeben.\
									  \n\n(10) Der Landesparteitag beschließt die erste Geschäftsordnung der SMV, in der auch die Konstituierung der SMV geregelt ist. Nach der Konstituierung kann auch die SMV über ihre Geschäftsordnung entscheiden.\
									  \n\n(11) Geheime Abstimmungen und Wahlen finden im Rahmen der SMV nicht statt. Alles weitere regelt die Geschäftsordnung zur SMV.\
									  \n\n§ 6b Der Landesvorstand\
									  \n\n(7) j) Systembetrieb SMV gemäß §6a.",
									  "reasons": "Modul 1 ist quasi der Hauptantrag, wird dieser angelehnt entfallen Modul 2 und 3. \
										  \n\nModul 2 und 3 sind dann konkurrierend.\
										  \n\nEinen Entwurf zur Geschäftsordnung wird es auch noch geben. Der hat aber noch Zeit, da dass ja keine Satzungsänderung ist."
							  },
							  { "optionID": 2, 
								  "optionTitle": "Modul 2: Variante mit Satzung und Inkrafttreten Vorbehalt für §6a(9)",
								  "optionDesc": "§6a Der Landesparteitag\
									  \n\n(9) Die SMV kann Stellungnahmen, Positionspapiere, Anfragen von Fraktionen sowie Anträge zu Programmen, zur Satzung, zur Finanzordnung, zur Schiedsgerichtsordnung, zur Auflösung sowie zur Verschmelzung mit anderen Parteien (§ 9 Abs. 3 Parteiengesetz) verbindlich beschließen. Bei Satzungs-, Finanzordnungs-, Schiedgerichtsordnungs-, Auflösungsanträgen und Anträgen zur Verschmelzung mit anderen Parteien kann der Vorstand innerhalb der ersten 7 Tage nach Abstimmungsende durch einen schriftlich begründeten Beschluss das Inkrafttreten eines Antrags auf das Ende des nächsten Landesparteitag der Piratenpartei Nordrhein-Westfalen verschieben.",
								  "reasons": "Modul 1 ist quasi der Hauptantrag, wird dieser angelehnt entfallen Modul 2 und 3. \
										  \n\nModul 2 und 3 sind dann konkurrierend.\
										  \n\nEinen Entwurf zur Geschäftsordnung wird es auch noch geben. Der hat aber noch Zeit, da dass ja keine Satzungsänderung ist."
							  },
							  { "optionID": 3, 
								  "optionTitle": "SÄA31: Modul 3: Antrag für eine SMV-NRW",
								  "shortDesc": "All-Incl. Variante ohne Vorbehalt für §6a(9)",
								  "optionDesc": "§6a Der Landesparteitag\
									  \n\n(9) Die SMV kann Stellungnahmen, Positionspapiere, Anfragen von Fraktionen sowie Anträge zu Programmen, zur Satzung, zur Finanzordnung, zur Schiedsgerichtsordnung, zur Auflösung sowie zur Verschmelzung mit anderen Parteien (§ 9 Abs. 3 Parteiengesetz) verbindlich beschließen.",
									  "reasons": "Modul 1 ist quasi der Hauptantrag, wird dieser angelehnt entfallen Modul 2 und 3. \
										  \n\nModul 2 und 3 sind dann konkurrierend.\
										  \n\nEinen Entwurf zur Geschäftsordnung wird es auch noch geben. Der hat aber noch Zeit, da dass ja keine Satzungsänderung ist."
							  }],
							  "references":[]
			},{
			"questionID": 107,
			"questionWording":"Eidgenössische Volksinitiative 'Schluss mit uferlosem Bau von Zweitwohnungen!'",
			"scheme": [{
				"name": "pickOne",
				"quorum": "1", // 0: no quorum, 1: at least as numbers of YESs as of NOs (not selected is counted as NO), 1+: more YESs than NOs, 2: at least twice as much YESs as NOs, 2+: more than twice as much YESs than NOs 
				"mode": "quorum", // "quorum": all that meet the quorum, "bestOnly": only the one with the most numer yes (if several have the same: returns all of them / if "quorum" set
				"abstentionOptionID": 4, // if not set, no option is interpreted as abstentation
				"winnerIfQuorumFailed": 3, // if no option fulfills the quorum, this optionID will be declared as winner ("status quo"-option). If not set, no option will be declared as winner 
				"abstentionAsNo": false
			}],
			"findWinner": ["pickOne", "random"],
			"options":
				[
				 { "optionID": 1, 
					 "optionTitle": "Zustimmung zur eidgenössischen Volksinitiative 'Schluss mit uferlosem Bau von Zweitwohnungen!' empfehlen",
					 "shortDesc": "Die Piratenpartei soll öffentlich die Zustimmung zur Volksinitiative 'Schluss mit uferlosem Bau von Zweitwohnungen!' empfehlen",
					 "optionDesc":"\Die Piratenpartei soll öffentlich die Zustimmung zur folgenden eidgenössischen Volksinitiative empfehlen:\n\n\
						 I\n\n\
						 Die Bundesverfassung vom 18. April 1999 wird wie folgt geändert:\n\n\
						 ''Art. 75a ('''neu''') Zweitwohnungen''\n\n\
						 <sup>1</sup>Der Anteil von Zweitwohnungen am Gesamtbestand der Wohneinheiten und der für Wohnzwecke genutzten Bruttogeschossfläche einer Gemeinde ist auf höchstens zwanzig Prozent beschränkt.\n\n\
						 <sup>2</sup>Das Gesetz verpflichtet die Gemeinden, ihren Erstwohnungsanteilsplan und den detaillierten Stand seines Vollzugs alljährlich zu veröffentlichen.\n\n\
						 \n\n\
						 II\n\n\
						 Die Übergangsbestimmungen der Bundesverfassung werden wie folgt geändert:\n\n\
						 '''Art. 197 Ziff. 8 (neu)'''\n\n\
						 ''8. Übergangsbestimmungen zu Art. 75a (Zweitwohnungen)''\n\n\
						 <sup>1</sup>Tritt die entsprechende Gesetzgebung nach Annahme von Artikel 75a nicht innerhalb von zwei Jahren in Kraft, so erlässt der Bundesrat die nötigen Ausführungsbestimmungen über Erstellung, Verkauf und Registrierung im Grundbuch durch Verordnung.\n\n\
						 <sup>2</sup>Baubewilligungen für Zweitwohnungen, die zwischen dem 1. Januar des auf die Annahme von Artikel 75a folgenden Jahres und dem Inkrafttreten der Ausführungsbestimmungen erteilt werden, sind nichtig." },
				 { "optionID": 2, 
					 "optionTitle": "Ablehnung öffentlich empfehlen",
				 },
				 { "optionID": 3, 
					 "optionTitle": "Keine öffentliche Empfehlung abgeben", 
//					 "optionDesc": "Die Piratenpartei soll sich nicht öffentlich zur Initiative positionieren." 
				 },
				 { "optionID": 4, 
					 "optionTitle": "Ich enthalte mich" 
				 }]
			}]
	};
	return ret;
};


/***********************************************************************
 * 
 * 
 * Voting Phase
 * 
 * 
 ***********************************************************************/

ConfigurableTally.prototype.getMainContentFragm = function(fragm, tallyconfig) {
	ConfigurableTally.tallyConfig = tallyconfig;
	// var fragm =	document.createDocumentFragment();
//	var elp = document.createElement('h1');
//	elp.appendChild(document.createTextNode(tallyconfig.electionTitle));
//	elp.setAttribute('id', 'ballotName');
//	fragm.appendChild(elp);
	//mc = mc + '<div id="divVoteQuestions">';
	var divNode = document.createElement('div');
	divNode.setAttribute('id', 'divVoteQuestions');

	var table = Array([tallyconfig.questions.length *2 +1]);
	//var table = [3][3];
	var styleClass;
	table[0] = [{'content': i18n.gettext('Motion group'), 'attrib': [{'name': 'class', 'value': 'tableHeader'}]}, 
	            {'content': i18n.gettext('Motion title'), 'attrib': [{'name': 'class', 'value': 'tableHeader'}]}, 
	            {'content': i18n.gettext('Action'),       'attrib': [{'name': 'class', 'value': 'tableHeader'}]}];
	for (var qNo=0; qNo<tallyconfig.questions.length; qNo++) {
		if (qNo % 2 == 1) styleClass = 'unevenTableRow';
		else			  styleClass = 'evenTableRow';
		table[qNo * 2 + 1] = Array(3);
		table[qNo * 2 + 1][0] = {'content': document.createTextNode(tallyconfig.questions[qNo].questionID), 'attrib': [{'name': 'class', 'value': styleClass}, {'name':'id', 'value': 'qRow'+qNo+'C1'}]};
		table[qNo * 2 + 1][1] = {'content': wikiSyntax2DOMFrag(tallyconfig.questions[qNo].questionWording), 'attrib': [{'name': 'class', 'value': styleClass}, {'name':'id', 'value': 'qRow'+qNo+'C2'}]};

		var elp = document.createElement('button');
		elp.setAttribute('id'	  , 'buttonShowQid'+qNo);
		elp.setAttribute('onclick', 'ConfigurableTally.showQuestion(' +qNo+')');
		elp.showTextHtml = i18n.gettext('Show &amp; <br>vote'); 
		elp.hideTextHtml = i18n.gettext('Hide');
		var elp2 = html2Fragm(elp.showTextHtml);
		// var elp2 = document.createTextNode('Anzeigen & Abstimmen');
		elp.appendChild(elp2);
		table[qNo * 2 + 1][2] = {'content' : elp, 'attrib': [{'name': 'class', 'value': styleClass}, {'name':'id', 'value': 'qRow'+qNo+'C3'}]};

		table[qNo * 2 + 2] = Array(1);
		var fragm2 = document.createDocumentFragment();
//		var fieldSetNode = document.createElement('fieldset');
//		fragm2.appendChild(fieldSetNode);
		ConfigurableTally.getDOM1Election(tallyconfig, qNo, fragm2);
		table[qNo * 2 + 2][0] = {'content' : fragm2, 'attrib': [{'name': 'colspan', 'value':'3'}]};
	}

	var electionsListDOM = makeTableDOM(table);
	electionsListDOM.setAttribute('class', 'votingQuestionsTable');
	fragm.appendChild(electionsListDOM);

	var fragm2 = wikiSyntax2DOMFrag("= Ziele meiner politischen Arbeit =\n\
			== Wirtschaft ==\n\
			* Mehr Transparenz, mehr Möglichkeiten für die Bürger, sich an politischen Entscheidungsprozessen zu beteiligen; barrierefreie Politik\n\
			* Der Mensch muss im Mittelpunkt der Politik stehen: Auch Wirtschaftspolitik ist für den Menschen da, nicht für die Unternehmen. Die Unternehmen sind aber Mittel zu dem Zweck, Wohlstand für die Menschen zu schaffen.\n\
			* Die Politik muss den Bürgern reinen Wein einschenken: Wenn mehr Ausgaben gefordert werden, muss auch klar gesagt werden, wo das Geld dafür herkommen soll.\n\
			* Sachorientierung in der Politik.\n\
			\n\
			= Wiki-Syntax-Tests =\n\
			* Aufzählung\n\
			Text ohne Leerzeile nach der Aufzählung\n\
			\n\
			Noch ''Ein kursiver''' Text, der hier endet.\n\
			normal '''''fett und kursiv''''' normal\n\
			\n\
			Neuer '''Absatz fett ''kursiv und fett''' nur kursiv'' und dies ist '''fetter Text\n\
			mit einem Zeilen'''umbruch\n\
			\n\
			kjh kjn <s>jhjh\n\
			jlkh</s>nicht mehr\n\
			\n\
			normal <s>durchgestrichen '''+fett</s>nicht mehr durchgestrichen'''Normal\n\
			\n\
			normal'''''fett+kursiv''nicht mehr kursiv'''normal\n\
			\n\
			normal''kursiv'''+fett''nicht mehr kursiv'''normal\n\
			\n\
			normal <s>durchgestrichen '''''+fett+kursiv</s>nicht mehr durchgestrichen''Nicht mehr kursiv'''Normal\n\
			\n\
			normal<u>unterst\n\
			richen</u>normal\n\
			\n\
			normal<u>unterst\n\
			\n\
	richen</u>normal		");

	// document.getElementById('maincontent').appendChild(fragm);
	// document.getElementById('maincontent').appendChild(fragm2);
	return fragm;
};

//TODO it is not pretty to have it completely static?
ConfigurableTally.getDOM1Election = function(tallyconfig, qNo, fragm) {
	var divQNode = document.createElement('div');
	divQNode.setAttribute('id', 'divVoteQuestion'+qNo);
	divQNode.setAttribute('class', 'voteQuestion');

	for (var optionNo=0; optionNo < tallyconfig.questions[qNo].options.length; optionNo++) {
		var optionFieldSet = document.createElement('fieldset');
		var legendNode = ConfigurableTally.getOptionTextFragm(tallyconfig.questions[qNo].options[optionNo], qNo, optionNo);
		optionFieldSet.appendChild(legendNode);
		for (var schemetypeindex = 0; schemetypeindex < tallyconfig.questions[qNo].tallyData.scheme.length; schemetypeindex++) {
			var fieldSetNode = document.createElement('fieldset');
			var legendNode = document.createElement('legend');
			fieldSetNode.appendChild(legendNode);
			var curScheme = tallyconfig.questions[qNo].tallyData.scheme[schemetypeindex];
			legendNode.setAttribute('class', curScheme.name);
			switch (curScheme.name) {
			case 'pickOne':
				radioBtnDOM('optionQ'+qNo+'O'+optionNo+'B', 'optionQ'+qNo+"PickOne", i18n.pgettext('voting', 'Best option')        , optionNo.toString(), fieldSetNode, 'pickOneRadio');
				break;
			case 'yesNo':
				legendNode.appendChild(document.createTextNode(i18n.pgettext('voting','Acceptance')));
				radioBtnDOM('optionQ'+qNo+'O'+optionNo+'Y', 'optionQ'+qNo+'O'+optionNo+"YesNo", i18n.pgettext('voting', 'Yes')        , '1', fieldSetNode, 'yesNoRadio');
				var noBtn = radioBtnDOM('optionQ'+qNo+'O'+optionNo+'N', 'optionQ'+qNo+'O'+optionNo+"YesNo", i18n.pgettext('voting','No')      , '0', fieldSetNode, 'yesNoRadio');
				if (curScheme.abstention) {
					var rBtn = radioBtnDOM('optionQ'+qNo+'O'+optionNo+'A', 'optionQ'+qNo+'O'+optionNo+"YesNo", i18n.pgettext('voting','Abstentation'), '-1', fieldSetNode, 'yesNoRadio');
					rBtn.setAttribute('checked', 'checked');
				} else {
					noBtn.setAttribute('checked', 'checked');
				}
				break;
			case 'score':
				legendNode.appendChild(document.createTextNode(i18n.pgettext('voting','Scores')));
				for (var score = curScheme.minScore; score <= curScheme.maxScore; score++) {
					var rBtn = radioBtnDOM('optionQ'+qNo+'O'+optionNo+'S'+score, 'optionQ'+qNo+'O'+optionNo+'Score', score.toString(), score.toString(), fieldSetNode, 'scoreRadio');
					if (score == curScheme.minScore) rBtn.setAttribute('checked', 'checked');
				}
				break;
			default: 
				aalert.openTextOk(i18n.sprintf(i18n.gettext('Client does not support voting scheme >%s<'), curScheme.name));
			}
			optionFieldSet.setAttribute('class', 'optionFieldSet');
			optionFieldSet.appendChild(fieldSetNode);
		}
		divQNode.appendChild(optionFieldSet);
	}
	var divSendVote = document.createElement('div');
	divSendVote.setAttribute('class', 'sendVote');
	buttonDOM('buttonSendQ'+qNo, i18n.gettext('Cast vote!'), 'page.sendVote('+qNo+')', divSendVote, 'sendVoteButton');
	var saveReceiptButton = buttonDOM('buttonSaveReceiptIdQ'+qNo, i18n.gettext('Save voting recceipt'), 'page.saveVotingReceipt(' + qNo +')', divSendVote, 'votingReceiptButton');
	saveReceiptButton.setAttribute('disabled', 'disabled');
	divQNode.appendChild(divSendVote);
	var divQNodeContainer = document.createElement('div');
	divQNodeContainer.setAttribute('id', 'divVoteQuestionContainer'+qNo);
	divQNodeContainer.appendChild(divQNode);
	fragm.appendChild(divQNodeContainer);
	return '';
};


ConfigurableTally.getOptionTextFragm = function(curOption, qNo, optionNo) {
//	var divFirstQNode = document.createElement('div');
//	divFirstQNode.setAttribute('id', 'FirstStepQ'+qNo);
	var legendNode = document.createElement('legend');
	legendNode.setAttribute('class', 'votingOption');
	if ('optionTitle' in curOption) {
		var pTitleNode = document.createElement('h1');
		pTitleNode.appendChild(document.createTextNode(curOption.optionTitle));
		legendNode.appendChild(pTitleNode);
	}
	if ('optionDesc' in curOption) {
		buttonDOM('buttonQTid'+qNo, i18n.gettext('Motion text'), 'ConfigurableTally.showOptionDetail("divVoteQuestionDescQ", ' +qNo+', '+optionNo+')', legendNode);
		var divOptionDescNode = document.createElement('div');
		divOptionDescNode.setAttribute('id', 'divVoteQuestionDescQ' + qNo + 'O' + optionNo);
		divOptionDescNode.setAttribute('style', 'display:none');
		var optionDescNode = wikiSyntax2DOMFrag(curOption.optionDesc);
		divOptionDescNode.appendChild(optionDescNode);
		if ('proponents' in curOption) {
			var proponentsNode = document.createElement('p');
			proponentsNode.setAttribute('class', 'proponents');
			proponentsNode.appendChild(document.createTextNode(i18n.sprintf(i18n.ngettext('Initiator: %s', 'Initiators: %s', curOption.proponents.length), curOption.proponents.join(', '))));
			divOptionDescNode.appendChild(proponentsNode);
		}

		legendNode.appendChild(divOptionDescNode);
	}
	if ('shortDesc' in curOption) {
		buttonDOM('buttonQSDid'+qNo, i18n.gettext('Summary'), 'ConfigurableTally.showOptionDetail("QuestionShortDescQ", ' +qNo+', '+optionNo+')', legendNode);
		var divOptionDescNode = document.createElement('div');
		divOptionDescNode.setAttribute('id', 'QuestionShortDescQ' + qNo + 'O' + optionNo);
		divOptionDescNode.setAttribute('style', 'display:none');
		var optionDescNode = wikiSyntax2DOMFrag(curOption.shortDesc);
		divOptionDescNode.appendChild(optionDescNode);
		legendNode.appendChild(divOptionDescNode);
	}
	if ('reasons' in curOption) {
		buttonDOM('buttonQRid'+qNo, i18n.gettext('Reasons'), 'ConfigurableTally.showOptionDetail("QuestionReasonQ", ' +qNo+', '+optionNo+')', legendNode);
		var divOptionDescNode = document.createElement('div');
		var optionDescNode = wikiSyntax2DOMFrag(curOption.reasons);
		divOptionDescNode.setAttribute('id', 'QuestionReasonQ' + qNo + 'O' + optionNo);
		divOptionDescNode.setAttribute('style', 'display:none');
		divOptionDescNode.appendChild(optionDescNode);
		legendNode.appendChild(divOptionDescNode);
	}
	return legendNode;
	/*	fieldSetNode.appendChild(legendNode);
	pNode.appendChild(fieldSetNode);
	divQNode.appendChild(pNode);
	/*
				if (tallyconfig.questions[qNo].voteSystem.steps.indexOf('yesNo') >= 0 && tallyconfig.questions[qNo].voteSystem.steps.indexOf('score') >= 0) {
					mc = mc + '<button id="button2ndStepQ"'+tallyconfig.questions[qNo].questionID+'" onclick="ConfigurableTally.buttonStep('+qNo+', true);" >Weiter</button>';
				}
				mc = mc + '</div>';
				if (tallyconfig.questions[qNo].voteSystem.steps.indexOf('score') >= 0) {
					mc = mc +'<div id="SecondStepQ'+qNo+'" style="display:none">';
					mc = mc + '<table class="voteOptions">';
					mc = mc + '<thead>';
					mc = mc + '<tr><th scope="col" rowspan="2">Option</th>';
					mc = mc + '<th scope="col" rowspan="2">enthalten</th>';
					mc = mc + '<th scope="col" colspan="3">bewerten </th></tr>';
					mc = mc + '<tr><th style="text-align:left;">sehr schlecht</th><th style="text-align:center;">mittel</th><th style="text-align:right;">sehr gut</th></tr>';
					mc = mc + '</thead><tbody>';
					for (var optionNo=0; optionNo<tallyconfig.questions[qNo].options.length; optionNo++) {
						var optionID = tallyconfig.questions[qNo].options[optionNo].optionID;
						var min = tallyconfig.questions[qNo].voteSystem['min-score'];
						var max = tallyconfig.questions[qNo].voteSystem['max-score'];
						mc = mc +
						'<tr>' +
						'	<td scope="row"><label for="optionRQ'+qNo+'O'+optionNo+'">' + tallyconfig.questions[qNo].options[optionNo].optionTitle + '</label></td>' +
						'	<td style="text-align:center;"><input type="checkbox" name="optionScore'+optionNo+'" id="optionRAQ'+qNo+'O'+optionNo+'" checked="checked" onclick="ConfigurableTally.onScoreAbstentionClick('+qNo+', '+optionNo+');"></td>' +
//						' <label for="optionRAQ'+qNo+'O'+optionNo+'">Enthaltung</label>&emsp;'+
						'	<td colspan="3" style="text-align:center;"><input style="width:100%;" type="range" name="optionScore'+optionNo+'" id="optionRQ'+qNo+'O'+optionNo+'" value="0" min="'+min+'" max="'+max+'" class="likeDisabled" onmousedown="ConfigurableTally.onScoreRangeClick('+qNo+', '+optionNo+');"></td>' +
						'</tr>';
					}
					mc = mc + '</tbody></table>';
					if (tallyconfig.questions[qNo].voteSystem.steps.indexOf('yesNo') >= 0) {
						mc = mc + '<button id="button1stStepQ"'+tallyconfig.questions[qNo].questionID+'" onclick="ConfigurableTally.buttonStep('+qNo+', false);">Zur&uuml;ck</button>';
					}
					mc = mc + '</div>';
				}
			}
			break;
		case 'rank':
			mc = mc + '<table class="voteOptions">';
			mc = mc + '	<thead>';
			mc = mc + '		<th>Rang</th>';
			mc = mc + '		<th>Option</th>';
			mc = mc + '		<th>Verschieben</th>';
			mc = mc + '</thead>';
			ConfigurableTally.questions = new Array();
			var rankingTmp = [];
			for (var optionNo=0; optionNo<tallyconfig.questions[qNo].options.length; optionNo++) {
				rankingTmp[optionNo] = optionNo;
			}
			ConfigurableTally.questions[qNo] = {"ranking": rankingTmp};
			mc = mc + '<tbody id="rankingTable' + qNo +'">' + ConfigurableTally.getRankingTableHtml(qNo) +'</tbody>';
			mc = mc + '</table>';
			break;
		default: 
			aalert.openTextOk('Client unterstützt das Abstimmsystem >' + tallyconfig.voteSystem.type + '< nicht');
		}
		if (qNo>0) {
			mc = mc + '<button id="buttonPrevQ'+qNo+'" onclick="ConfigurableTally.showQuestion(' +(qNo-1)+')">Vorhergehende Frage</button>';
		}
		if (qNo == tallyconfig.questions.length-1)
			mc = mc + '<button id="buttonNextQ'+qNo+'" onclick="ConfigurableTally.submitVote()">Abstimmen!</button>';
		else 	mc = mc + '<button id="buttonNextQ'+qNo+'" onclick="ConfigurableTally.showQuestion(' +(qNo+1)+');">N&auml;chste Frage</button>';
		mc = mc + '</div>'; // end div question
		mc = mc + '</div>'; // end div question container
	}
	 */
};


ConfigurableTally.prototype.collapseAllQuestions = function() {
	for (var qNo=0; qNo<this.config.questions.length; qNo++) {
		var el = document.getElementById('divVoteQuestion'+qNo);
		if (el !== null) {
			hideElement(el); // el.style.display = 'none';
		}
	}
};


ConfigurableTally.showQuestion = function(showqNo) {
	var tallyconfig = ConfigurableTally.tallyConfig;
	
	// test if clicked on "hide" --> then hide that details and return
	for (var qNo=0; qNo<tallyconfig.questions.length; qNo++) {
		var el = document.getElementById('divVoteQuestion'+qNo);
		if (el !== null) {
			if (qNo == showqNo && isShown(el)) {
				hideElement(el); // clicked on an already shown question -> just hide it
				var btn = document.getElementById('buttonShowQid'+qNo);
				btn.innerHTML = btn.showTextHtml;
				//btn.childNodes[0].nodeValue = "Anzeigen";
				var elCol1 = document.getElementById('qRow'+qNo+'C1');
				var elCol2 = document.getElementById('qRow'+qNo+'C2');
				var elCol3 = document.getElementById('qRow'+qNo+'C3');
				elCol1.className = elCol1.className.replace(/\bcurRow\b/,'');
				elCol2.className = elCol2.className.replace(/\bcurRow\b/,'');
				elCol3.className = elCol3.className.replace(/\bcurRow\b/,'');
				return;
			}
		}
	}
	
	// clicked on a question which is hidden -> show that and hide all others
	for (var qNo=0; qNo<tallyconfig.questions.length; qNo++) {
		var el = document.getElementById('divVoteQuestion'+qNo);
		var elCol1 = document.getElementById('qRow'+qNo+'C1');
		var elCol2 = document.getElementById('qRow'+qNo+'C2');
		var elCol3 = document.getElementById('qRow'+qNo+'C3');
		if (el !== null) {
			if (qNo == showqNo)	{
				showElement(el); // el.style.display = 'block';
				var btn = document.getElementById('buttonShowQid'+qNo);
				btn.innerHTML = btn.hideTextHtml;
				btn.childNodes = btn.hideTextNodes;
				//btn.childNodes[0].nodeValue = "Verbergen";
				elCol1.className = elCol1.className + ' curRow'; 
				elCol2.className = elCol2.className + ' curRow'; 
				elCol3.className = elCol3.className + ' curRow'; 
			}
			else {
				hideElement(el); // el.style.display = 'none';
				var btn = document.getElementById('buttonShowQid'+qNo);
				btn.innerHTML = btn.showTextHtml;
				// btn.childNodes[0].nodeValue = "Anzeigen &";
				elCol1.className = elCol1.className.replace(/\bcurRow\b/,'');
				elCol2.className = elCol2.className.replace(/\bcurRow\b/,'');
				elCol3.className = elCol3.className.replace(/\bcurRow\b/,'');
			}
		}
	}
};

ConfigurableTally.showOptionDetail = function(tag, qNo, optNo) {
	var el = document.getElementById(tag+qNo+'O'+optNo);
	if (el.style.display.length > 0 )	el.style.display = '';
	else       							el.style.display = 'none';
	adjustMaxHeight('divVoteQuestion'+qNo);
};


ConfigurableTally.getRankingTableHtml = function(qNo) {
	var mc ='';
	for (var optionNo=0; optionNo<ConfigurableTally.tallyConfig.questions[qNo].options.length; optionNo++) {
//		var optionID = tallyconfig.questions[qNo].options[optionNo].optionID;
		var ranking = ConfigurableTally.questions[qNo].ranking;
		mc = mc + '	<tr class="votingOption">';
		mc = mc + '		<td class="rankNo">' + (optionNo+1) + '</td>';
		mc = mc + '		<td id="optionQ'+qNo+'O'+optionNo+'" class="votingoptionTitle" draggable="true" ondrop="ConfigurableTally.drop(event, '+qNo+', '+optionNo+');" ondragover="ConfigurableTally.dragOver(event, '+qNo+', '+optionNo+');" ondragstart="ConfigurableTally.dragStart(event, '+qNo+', '+optionNo+');">'+ ConfigurableTally.tallyConfig.questions[qNo].options[ranking[optionNo]].optionTitle + '</td>';
		mc = mc + '		<td class="moveRank">';
		if (optionNo > 0)                        		mc = mc + '<a href="javascript:ConfigurableTally.moveUp  (' + qNo +', ' + (optionNo) + ');" >&nbsp;&uarr;&nbsp;</a>';
		else 											mc = mc + '&nbsp;&nbsp;&nbsp;';
		mc = mc + ' ';
		if (optionNo < ConfigurableTally.tallyConfig.questions[qNo].options.length - 1) 	mc = mc + '		<a href="javascript:ConfigurableTally.moveDown(' + qNo +', ' + (optionNo) + ');" >&nbsp;&darr;&nbsp;</a>';
		else 																				mc = mc + '&nbsp;&nbsp;&nbsp;'; 
		mc = mc + '		</td>';
		mc = mc + '	</tr>';
	}
	return mc;
};

ConfigurableTally.moveUp = function(qNo, optionIndex) {
	if (optionIndex > 0)
		ConfigurableTally.moveFromTo(qNo, optionIndex, optionIndex - 1);
};

ConfigurableTally.moveDown = function(qNo, optionIndex) {
	if (optionIndex < ConfigurableTally.tallyConfig.questions[qNo].options.length)  
		ConfigurableTally.moveFromTo(qNo, optionIndex, optionIndex + 1);
};

ConfigurableTally.moveFromTo = function(qNo, from, to) {
	if (from == to) return;
	if (from < to) {
		var beforeFrom = ConfigurableTally.questions[qNo].ranking.slice(0, from);
		var afterFrom = ConfigurableTally.questions[qNo].ranking.slice(from + 1, to +1);
		var FromElement = ConfigurableTally.questions[qNo].ranking[from];
		var afterTo = ConfigurableTally.questions[qNo].ranking.slice(to + 1);
		ConfigurableTally.questions[qNo].ranking = beforeFrom.concat(afterFrom, FromElement, afterTo);
	} else {
		var beforeTo = ConfigurableTally.questions[qNo].ranking.slice(0, to);
		var afterTo= ConfigurableTally.questions[qNo].ranking.slice(to, from);
		var moveElement = ConfigurableTally.questions[qNo].ranking[from];
		var afterFrom = ConfigurableTally.questions[qNo].ranking.slice(from + 1);
		ConfigurableTally.questions[qNo].ranking = beforeTo.concat(moveElement, afterTo, afterFrom);
	}
	var el = document.getElementById('rankingTable' +qNo);
	var tablehtml = ConfigurableTally.getRankingTableHtml(qNo);
	el.innerHTML = tablehtml;
};


ConfigurableTally.dragOver = function (ev, qNo, optNo) {
	ev.preventDefault();
	// ConfigurableTally.drop(ev, qNo, optNo);
};

ConfigurableTally.dragStart = function (ev, qNo, optNo) {
	ev.dataTransfer.effectAllowed = 'move';
	// ev.dataTransfer.setData("Text", ev.target.id);
	var transobj = {"qNo": qNo, "optNo": optNo};
	var transstr = JSON.stringify(transobj);
	ev.dataTransfer.setData("Text", transstr);
	ConfigurableTally.transObj = transobj;
	// ev.dataTransfer.setData("optNo", optNo.toString());
};

ConfigurableTally.drop = function (ev, qNo, optNo) {
	ev.preventDefault();
	// var data=ev.dataTransfer.getData("Text");
	// ev.target.appendChild(document.getElementById(data));
//	var transobj = JSON.parse(ev.dataTransfer.getData('Text')); 
	var transobj = ConfigurableTally.transObj;
	var fromQNo = transobj.qNo;
	var fromOptNo = transobj.optNo;
	if (qNo != fromQNo) return;
	ConfigurableTally.moveFromTo(qNo, fromOptNo, optNo);
};


ConfigurableTally.onScoreAbstentionClick = function(qNo, optionNo) {
	var checkbox = document.getElementById('optionRAQ'+qNo+'O'+optionNo);
	var range = document.getElementById('optionRQ'+qNo+'O'+optionNo);
	if (checkbox.checked) 	range.className = 'likeDisabled';
	else 					range.className = '';
};

ConfigurableTally.onScoreRangeClick = function(qNo, optionNo) {
	var checkbox = document.getElementById('optionRAQ'+qNo+'O'+optionNo);
	checkbox.checked = false;
	ConfigurableTally.onScoreAbstentionClick(qNo, optionNo); 
};


ConfigurableTally.buttonStep = function(qNo, forward) {
	var firstStep = document.getElementById('FirstStepQ'+qNo);
	var secondStep = document.getElementById('SecondStepQ'+qNo);
	if (forward)  	{ firstStep.style.display = 'none'; 	secondStep.style.display = ''; 		}
	else 			{ firstStep.style.display = ''; 		secondStep.style.display = 'none'; 	}
};






/***********************************************************************
 * 
 * Send Vote
 * 
 ***********************************************************************/

/**
 * 
 * @param qNo
 * @param selected 	JSON-String of the vote array of options (and scheme) to be selected,
 * 					true: do not disable options, 
 * 					false: all options will be unselected
 * 					 
 */

ConfigurableTally.prototype.disableQuestion = function(buttonText, qNo, selected) {
	//var vote = {//"ballotID":tallyconfig.ballotID,
//	"questions": [{
//	"questionID": tallyconfig.questions[qNo].questionID,
	//"optionOrder": [],
//	"statusQuoOption": "",
	//"options": [] //[[{"name": "score", "value": 1}, {"name": "yesNo", "value": 1}]]
//	}]
//	};
	this.enDisableSendButton(buttonText, qNo, true);
	if (typeof selected === "string") selected = JSON.parse(selected);
	// Disable all inputs on all options belonging to the question
	if (selected !== true) { // if selected === true: do not disable options
		for (var optionNo=0; optionNo<this.config.questions[qNo].options.length; optionNo++) {
//			var optionID = this.config.questions[qNo].options[optionNo].optionID;
			for (var schemeIndex=0; schemeIndex<this.config.questions[qNo].tallyData.scheme.length; schemeIndex++) {
				var curScheme = this.config.questions[qNo].tallyData.scheme[schemeIndex];
				if (typeof selected == 'object') {
					var curSchemeVote = selected.options[optionNo][ArrayIndexOf(selected.options[optionNo], 'name', curScheme.name)];
				}
				switch (curScheme.name) {
				case 'pickOne':
					var el = document.getElementById('optionQ'+qNo+'O'+optionNo+'B');
					el.setAttribute('disabled', 'disabled');
					el.removeAttribute('checked');
					break;
				case 'yesNo':
					var el = document.getElementById('optionQ'+qNo+'O'+optionNo+'Y');
					el.setAttribute('disabled', 'disabled');
					el.removeAttribute('checked');
					var el = document.getElementById('optionQ'+qNo+'O'+optionNo+'N');
					el.setAttribute('disabled', 'disabled');
					el.removeAttribute('checked');
					if (curScheme.abstention) { 
						var el = document.getElementById('optionQ'+qNo+'O'+optionNo+'A');
						el.setAttribute('disabled', 'disabled');
						el.removeAttribute('checked');
					}
					if (typeof curSchemeVote  != 'undefined') {
						var votedElementId;
						switch (curSchemeVote.value) {
						case 1:  votedElementId = 'Y'; break;
						case 0:  votedElementId = 'N'; break;
						case -1: votedElementId = 'A'; break;
						}
						var el = document.getElementById('optionQ'+qNo+'O'+optionNo+votedElementId);
						el.setAttribute('checked', 'checked');
					}
					break;
				case 'score':
					for (var score = curScheme.minScore; score <= curScheme.maxScore; score++) {
						var rBtn = document.getElementById('optionQ'+qNo+'O'+optionNo+'S'+score);
						rBtn.setAttribute('disabled', 'disabled');
						if ((typeof curSchemeVote != 'undefined') && curSchemeVote['value'] ==  score) rBtn.setAttribute('checked', 'checked');
						else rBtn.removeAttribute('checked');
					}
					break;
				}
			}
		}
	}
};

/**
 * Gets called from PublishOnlyTally to send the vote
 * @return JSON encoded string that contains the selected options for qNo
 **/
ConfigurableTally.prototype.getInputs = function(qNo) {
	var vote = {//"ballotID":tallyconfig.ballotID,
//			"questions": [{
//			"questionID": tallyconfig.questions[qNo].questionID,
			"optionOrder": [],
//			"statusQuoOption": "",
			"options": [] //[[{"name": "score", "value": 1}, {"name": "yesNo", "value": 1}]]
//	}]
	};

	var valueYNA = -2;  // nothing selected --> -2
	for (var optionNo=0; optionNo<this.config.questions[qNo].options.length; optionNo++) {
		var optionID = this.config.questions[qNo].options[optionNo].optionID;
		vote.optionOrder[optionNo] = optionID;
		vote.options[optionNo] = [];
		for (var schemeIndex=0; schemeIndex<this.config.questions[qNo].tallyData.scheme.length; schemeIndex++) {
			var value = valueYNA;
			var curScheme = this.config.questions[qNo].tallyData.scheme[schemeIndex]; 
			switch (curScheme.name) {
			case 'pickOne':
				value = document.getElementById('optionQ'+qNo+'O'+optionNo+'B').checked;
				break;
			case 'yesNo':                             
				var voteOptionY =     document.getElementById('optionQ'+qNo+'O'+optionNo+'Y').checked;
				var voteOptionN =     document.getElementById('optionQ'+qNo+'O'+optionNo+'N').checked;
				if (curScheme.abstention) { 
					var voteOptionA = document.getElementById('optionQ'+qNo+'O'+optionNo+'A').checked;
					if  (voteOptionA == true) value = -1; // abstentitian --> -1
				}
				if  (voteOptionY == true) value = 1;  // yes --> 1
				if  (voteOptionN == true) value = 0;  // no --> 0
				break;
			case 'score':
				for (var score = curScheme.minScore; score <= curScheme.maxScore; score++) {
					var rBtn = document.getElementById('optionQ'+qNo+'O'+optionNo+'S'+score);
					if (rBtn.checked) value = score;
				}
				break;
			}
			vote.options[optionNo][schemeIndex] = {"name": curScheme.name, "value": value};
		}
	}
	return unicodeToBlackslashU(JSON.stringify(vote));

};

/***********************************************************************
 * 
 * Get Result
 * 
 ***********************************************************************/

ConfigurableTally.prototype.handleUserClickGetAllVotes = function (config_, onGotVotesObj, onGotVotesMethod) {
	this.config = config_;
	this.onGotVotesObj    = onGotVotesObj;
	this.onGotVotesMethod = onGotVotesMethod;
	PublishOnlyTally.prototype.handleUserClickGetAllVotes.call(this, config_,onGotVotesObj, onGotVotesMethod); 
};

ConfigurableTally.prototype.handleUserClickShowWinners = function (config_, onGotVotesObj, onGotVotesMethod) {
	this.config = config_;
	this.onGotVotesObj    = onGotVotesObj;
	this.onGotVotesMethod = onGotVotesMethod;
	var now = new Date();
	var endDate = false;
	if ('VotingEnd' in this.config.authConfig)	endDate = new Date (this.config.authConfig.VotingEnd);
	if ( (endDate !== false) && (now < endDate) ) {
		var html = i18n.gettext('<p>You cannot fetch the result as long as vote casting is possible.</p>');
		onGotVotesMethod.call(onGotVotesObj, html);
		return;
	}
	var me = this; 
	var data = {};
	data.cmd = 'getWinners';  // 'getWinners'; // 'getStatistic';
	data.electionId = unicodeToBlackslashU(JSON.stringify({'mainElectionId': this.config.electionId}));
	// data.questionID = [103, 105];
	var datastr = JSON.stringify(data);
	// TODO add auth to data
	myXmlSend(ClientConfig.getResultUrl, datastr, me, me.handleServerAnswerShowWinners);
};


ConfigurableTally.prototype.handleServerAnswerShowWinners = function (xml) {
	try {
		var answer = parseServerAnswer(xml, true);
		var html ='';
		switch (answer.cmd) {
		case 'showWinners':
			this.winners = answer.data;
			for (var question in this.config.questions) {
				var questionID = this.config.questions[question].questionID;
				html = html + '<p>' + this.getWinnersHtml(questionID);
				if (typeof(questionID) === 'string') questionID = "'" + questionID + "'"; 
				html = html + '<button onclick="page.tally.handleUserClickGetAllVotes(' + questionID + ')">' + i18n.gettext('Show all votes') + '</button></p>';
			}
			break;
		case 'error':
				var msg = translateServerError(answer.errorNo);
				html = html + '<p>' + msg + '</p>';
			break;
		default:
			throw new ErrorInServerAnswer(2043, i18n.gettext('Error: Expected >showWinners< or >error<'), i18n.sprintf(i18n.gettext('Got from server: %s'), answer.cmd));
			break;
		}
		this.onGotVotesMethod.call(this.onGotVotesObj, html);
	} catch (e) {
		// TODO if (e instanceof ErrorInServerAnswer)
		if (e instanceof MyException)	e.alert();
		else aalert.openTextOk(i18n.sprintf(i18n.gettext('Something did not work: %s'), e.toString())); 
	}
};

ConfigurableTally.prototype.getWinnersHtml = function (questionID) {
	var html = '';
	if (this.winners[questionID].length == 0) html = html + i18n.sprintf(i18n.gettext('In motion group %s, no motion got the requiered number of votes. '), questionID);
//	if (this.winners[questionID].length == 1) html = html + i18n.sprintf(i18n.gettext('In motion group %s, %s won. '), questionID,
//			'<a href="javascript: page.tally.showOptionPopUp(' + addQuotationMarksIfString(questionID) + ', ' + addQuotationMarksIfString(this.winners[questionID][0]) + ');">' + 
//			i18n.sprintf(i18n.gettext('Motion %s'), this.winners[questionID]) + '</a>');
	if (this.winners[questionID].length  > 0) {
		var motionshtml = '';
		for (var i=0; i<this.winners[questionID].length; i++) {
			motionshtml = motionshtml + '<a href="javascript: page.tally.showOptionPopUp(' + addQuotationMarksIfString(questionID) + ', ' + addQuotationMarksIfString(this.winners[questionID][i]) + ');">' +
			i18n.sprintf(i18n.gettext('Motion %s'), this.winners[questionID][i]) + '</a>';
			if (i+2 == this.winners[questionID].length) motionshtml = motionshtml + i18n.gettext(' and ');
			if ((this.winners[questionID].length > 1) && (i+2 <  this.winners[questionID].length)) motionshtml = motionshtml + ', ';
		}
		html = i18n.sprintf(i18n.ngettext('In motion group %s, %s won. ', 'In motion group %s, %s won. ', this.winners[questionID].length), questionID,	motionshtml);
	}
	return html;
};

ConfigurableTally.prototype.showOptionPopUp = function (questionID, optionID) {
	var qNo = ArrayIndexOf(this.config.questions, 'questionID', questionID);
	var curQ = this.config.questions[qNo];
	var optionNo = ArrayIndexOf(curQ.options, 'optionID', optionID);
	var curOption = curQ.options[optionNo];
	var fragm = document.createDocumentFragment(); 
	fragm.appendChild(ConfigurableTally.getOptionTextFragm(curOption, qNo, optionNo));
	buttonDOM('closePopup', i18n.gettext('Close'), 'page.tally.removeOptionPopup()', fragm, 'closePopup');
	showPopup(fragm);
};

ConfigurableTally.prototype.removeOptionPopup = function() {
	removePopup();
};

ConfigurableTally.prototype.handleUserClickGetAllVotes = function(questionID) {
	var me = this;
	this.curQuestionID = questionID;
	PublishOnlyTally.requestAllVotes(this.config.electionId, questionID, me, me.handleServerAnswerVerifyCountVotes);
};


ConfigurableTally.prototype.processVerifyCountVotes = function (answ) {
	var votesOnly = new Array();
	this.votes = answ.data.allVotes;
	// process data
	//   show a list of all votes
	var htmlcode = '';
	// TODO think about: implement this? 
	// var htmlcode = '<button onclick="page.tally.handleUserClickGetPermissedBallots();">Liste der Wahlscheine holen</button>';
	// if ( !('returnEnvelope' in window) ) {
	//	htmlcode = htmlcode + '<button onclick="page.tally.findMyVote();">Finde meine Stimme - Wahlschein laden</button>';
	// }
	var v;   // vote
	var vno; // vote number
	var disabled;
	var curQuestion = this.config.questions[ArrayIndexOf(this.config.questions, 'questionID', this.curQuestionID)]; 
	var myVno = false;
	if ('returnEnvelope' in window) {
		myVno = this.election.getVotingNo(curQuestion.questionID); //tmp2.votingno; // must be identical to returnEnvelope.permission.keypar.pub.n + ' ' + returnEnvelope.permission.keypar.pub.exp;
	}
	var freq = [];
	for (var optionIndex=0; optionIndex<curQuestion.options.length; optionIndex++ ) {
		freq[optionIndex] = {
				'yesNo': {'numYes': 0, 'numNo': 0, 'numAbstention': 0},
				'score': 0,
				'pickOne': {'numBest': 0, 'numNotBest': 0, 'numAbstention': 0}
		};
		htmlcode = htmlcode + '<h3>' + i18n.sprintf(i18n.gettext('Votes on %s '), 
			'<a href="javascript: page.tally.showOptionPopUp(' + addQuotationMarksIfString(curQuestion.questionID) + ', ' + addQuotationMarksIfString(curQuestion.options[optionIndex].optionID) + ');">' + 
			i18n.sprintf(i18n.gettext('motion %s'), curQuestion.options[optionIndex].optionID) + '</a></h3>');
		htmlcode = htmlcode + '<div class="allvotes"><table>';
		htmlcode = htmlcode + '<thead>'; 
		for (var schemeIndex=0; schemeIndex<curQuestion.tallyData.scheme.length; schemeIndex++ ) {
			switch(curQuestion.tallyData.scheme[schemeIndex].name) {
			case 'yesNo':   htmlcode = htmlcode + '<th>' + i18n.gettext('Yes/No') + '</th>'; break;
			case 'score':   htmlcode = htmlcode + '<th>' + i18n.gettext('Score')  + '</th>'; break;
			case 'pickOne': htmlcode = htmlcode + '<th>' + i18n.gettext('Picked') + '</th>'; break;
			default: 	    htmlcode = htmlcode + '<th>' + i18n.gettext('Scheme not supported')  + '</th>'; 
						  //aalert.openTextOk(i18n.gettext('Error 875498z54: scheme not supported'));
			};
		}
		htmlcode = htmlcode + '<th>' + i18n.gettext('Voting number') + '</th><th>' + i18n.gettext('Verify!') + '</th></thead>';
		htmlcode = htmlcode + '<tbody>';
		for (var i=0; i<this.votes.length; i++) {
			htmlcode = htmlcode + '<tr>';
			// set pickOneAbstention to true if that option was selected
			// verify that at maximum 1 option contains true
			var pickOneAbstention = false;
			var pickOneInvalid = false;
			var pickOneSchemeIndex = ArrayIndexOf(curQuestion.tallyData.scheme,'name', 'pickOne'); 
			if (pickOneSchemeIndex >= 0) {
				var numBest = 0;
				try {
					var vString   = this.votes[i].vote.vote; 
					var v = JSON.parse(vString); 
					for (var opts=0; opts < v.options.length; opts++) {
						var pickOneSchemeIndexVote = ArrayIndexOf(v.options[opts],'name', 'pickOne'); 
						if (v.options[opts][pickOneSchemeIndexVote].value === true) numBest++;
						if ( ('abstentionOptionID' in curQuestion.tallyData.scheme[pickOneSchemeIndex]) 
								&&	(curQuestion.tallyData.scheme[pickOneSchemeIndex].abstentionOptionID === v.optionOrder[opts]) 
								&& v.options[opts][pickOneSchemeIndexVote].value === true ) pickOneAbstention = true;
					}
					if (numBest > 1) pickOneInvalid = true;
				} catch (e) {pickOneInvalid = true;}  
			}

			for (var schemeIndex=0; schemeIndex<curQuestion.tallyData.scheme.length; schemeIndex++ ) {
				var curScheme = curQuestion.tallyData.scheme[schemeIndex];
				try {vno = this.votes[i].permission.signed.votingno; } catch (e) {vno = 'Error'; disabled = 'disabled';}
				var vt = i18n.gettext('Error');
				var value = i18n.gettext('invalid');
				try {
					var vString   = this.votes[i].vote.vote; 
					v = JSON.parse(vString); 
					var optionVoteIndex;
					var optionVoteSchemeIndex;
					optionVoteIndex = v.optionOrder.indexOf(curQuestion.options[optionIndex].optionID);
					optionVoteSchemeIndex = ArrayIndexOf(v.options[optionVoteIndex], 'name', curScheme.name);
					disabled = ''; 
					value = v.options[optionVoteIndex][optionVoteSchemeIndex].value;
					switch (curScheme.name) {
					case 'yesNo': 
						switch (value) {
						case 1: vt = i18n.gettext('Yes');    freq[optionIndex].yesNo.numYes++;        break;
						case 0: vt = i18n.gettext('No');     freq[optionIndex].yesNo.numNo++;         break;
						case -1: vt = i18n.gettext('Abst.'); /* translators: do not use more than 7 characters */ freq[optionIndex].yesNo.numAbstention++; break; // TODO verify if abstention is in the scheme allowed
						default: vt = i18n.gettext('invalid'); break;
						}
						break;
					case 'score': 
						vt = value.toString(); 
						freq[optionIndex].score = freq[optionIndex].score + value; 
						break; // TODO check range
					case 'pickOne':
						if (pickOneInvalid === true) vt = i18n.gettext('invalid'); 
						else {
							if ( pickOneAbstention === true) {
								if (value === true) vt = i18n.gettext('Yes'); // show the abstention option as "yes" 
								else 				vt = i18n.gettext('Abst.'); 
								freq[optionIndex].pickOne.numAbstention++; 
							} else {
								switch (value) {
								case true:  vt = i18n.gettext('Yes'); freq[optionIndex].pickOne.numBest++;        break;
								case false: vt = i18n.gettext('No');  freq[optionIndex].pickOne.numNotBest++;     break;
								default:    vt = i18n.gettext('invalid'); break;
								}
							}
						}
						break;
					default:      vt = i18n.gettext('invalid'); break;
					}
				} catch (e) {
					vt   = i18n.gettext('Error'); 
					disabled = 'disabled';
				}
				htmlcode = htmlcode + '<td  class="vote ' + curScheme.name + ' ' + curScheme.name + value.toString() + '">';
				htmlcode = htmlcode + vt + '</td>';
			}
			var vnoAttrib = 'class="votingno"';
			var vnoText = vno;
			if (vno === myVno) {
				vnoAttrib = 'class="votingno myVote" id="myVote' + optionIndex + '"';
				vnoText = vno + i18n.gettext(' - my vote');
			}
			htmlcode = htmlcode + '<td> <div ' + vnoAttrib + '>' + vnoText + '</div></td>'; 
			htmlcode = htmlcode + '<td> <button ' + disabled + ' onclick="page.tally.handleUserClickVerifySig(' + i +');" >' + 
				i18n.gettext('Verify signatures!') + '</button>' + '</td>'; 
//			htmlcode = htmlcode + '<td>' + this.votes[i].permission.signed.salt     + '</td>'; 
			htmlcode = htmlcode + '</tr>';
			// TODO add to votes only if sigOk
			votesOnly[i] = v;
		}
		htmlcode = htmlcode + '</tbody></table></div>';
	}

	// show the frequencies
	// freq.sort(function(a, b) {return b.score - a.score;});
	// freq.sort(function(a, b) {return b.yesNo.numYes - a.yesNo.numYes;});
	var htmlcode2 = '<div id="freq"><table>';
	htmlcode2 = htmlcode2 + '<thead>';
	htmlcode2 = htmlcode2 + '<th class="optionHead"  >' + 'Option'         + '</th>';
	for (var schemeIndex=0; schemeIndex<curQuestion.tallyData.scheme.length; schemeIndex++ ) {
		var curScheme = curQuestion.tallyData.scheme[schemeIndex];
		switch (curScheme.name) {
		case 'yesNo':
			htmlcode2 = htmlcode2 + '<th class="numVotes">' + i18n.gettext("Number of YESs") + '</th>';
			htmlcode2 = htmlcode2 + '<th class="numVotes">' + i18n.gettext('Number of NOs') + '</th>';
			if (curScheme.abstention) {
				htmlcode2 = htmlcode2 + '<th class="numVotes">' + i18n.gettext('Number of absten.') + '</th>';
			}
			break;
		case 'score': 
			htmlcode2 = htmlcode2 + '<th class="numVotes">' + i18n.gettext('Sum of scores') + '</th>';
			break;
		case 'pickOne':
			htmlcode2 = htmlcode2 + '<th class="numVotes">' + i18n.gettext('Number picked') + '</th>';
			break;
		default:
			htmlcode2 = htmlcode2 + '<th class="numVotes">' + i18n.gettext('Not Supported voting scheme') + '</th>';
		break;
		}
	}
	htmlcode2 = htmlcode2 + '</thead><tbody>';
	for (var i=0; i<freq.length; i++) {
		htmlcode2 = htmlcode2 + '<tr>';
		var winnerOption = '';
		if (this.winners[curQuestion.questionID].indexOf(curQuestion.options[i].optionID) >= 0) winnerOption = ' winnerOption'; 
		htmlcode2 = htmlcode2 + '<td class="option' + winnerOption + '">' + 
		'<a href="javascript: page.tally.showOptionPopUp(' + addQuotationMarksIfString(curQuestion.questionID) + ', ' + addQuotationMarksIfString(curQuestion.options[i].optionID) + ');">' + 
		i18n.sprintf(i18n.gettext('motion %s'), curQuestion.options[i].optionID) + '</a>' + 
		'</td>'; 
		for (var schemeIndex=0; schemeIndex<curQuestion.tallyData.scheme.length; schemeIndex++ ) {
			var curScheme = curQuestion.tallyData.scheme[schemeIndex];
			switch (curScheme.name) {
			case 'yesNo':
				htmlcode2 = htmlcode2 + '<td class="numVotes' + winnerOption + '">' + freq[i].yesNo.numYes + '</td>';
				htmlcode2 = htmlcode2 + '<td class="numVotes' + winnerOption + '">' + freq[i].yesNo.numNo  + '</td>';
				if (curScheme.abstention) {
					htmlcode2 = htmlcode2 + '<td class="numVotes' + winnerOption + '">' + freq[i].yesNo.numAbstention + '</td>';
				}
				break;
			case 'score': 
				htmlcode2 = htmlcode2 + '<td class="numVotes' + winnerOption + '">' + freq[i].score + '</td>';
				break; 
			case 'pickOne': 
				var textgth = freq[i].pickOne.numBest;
				if (('abstentionOptionID' in curScheme) && (curQuestion.options[i].optionID === curScheme.abstentionOptionID) )  textgth = freq[i].pickOne.numAbstention;
				htmlcode2 = htmlcode2 + '<td class="numVotes' + winnerOption + '">' + textgth + '</td>';
				break; 
			default:
				htmlcode2 = htmlcode2 + '<td class="numVotes' + winnerOption + '">' + i18n.gettext('Voting scheme not supported') + '</td>';
			break;
			}
		}
		htmlcode2 = htmlcode2 + '</tr>';
	}
	htmlcode2 = htmlcode2 + '</tbody>';
	htmlcode2 = htmlcode2 + '</table></div>';

	var htmlcode0 = '<h3>' + i18n.sprintf(i18n.gettext('Motion group: %s'), this.curQuestionID) + '</h3>';
	htmlcode0 = htmlcode0 + '<p>' + this.getWinnersHtml(this.curQuestionID) + '</p>';

	var ret = htmlcode0 + '<br>\n\n' + htmlcode2 + '<br> <br>\n\n' + htmlcode;
	this.onGotVotesMethod.call(this.onGotVotesObj, ret);
};

ConfigurableTally.test = function() {
	var config = 
	{
			"ballotID":"GTVsdffgsdwt40QXffsd452re",
			"votingStart": "2014-02-10T21:20:00Z", 
			"votingEnd": "2014-03-04T00:00:00Z",
			"access":
			{
				"listID": "DEADBEEF",
				"groups": [ 1,2,3] 
			},     
			"electionID": /* "ballotName": */ "1. Basisentscheid NRW (online, anonym, Test)",
			"questions":
				[
				 {
					 "questionID":1,
					 "questionWording":"Drehen wir uns im Kreis? (zweistufig)",
					 "tallyData": {
						 "scheme": /*"voteSystem":*/
							 [{
								 "name": "yesNo",
								 "abstention": true,
								 "quorum": "2", //1: "at least the same number of YES as of NO",		1+: "more than YES than NO",		2: "at least twice as much YES than NO",		2+: "more than twice as much YES than NO""abstentionAsNo": false,
								 "abstentionAsNo": false
							 }, {
								 "name": "score",
								 "minScore": -3,
								 "maxScore": 3,
							 }],
							 "findWinner": ["yesNo", "score", "yesNoDiff", "random"]
					 },
					 "options":
						 [
						  { "optionID": 1, "optionTitle": "Ja, linksherum.", "optionDesc": "Hier mach ich zum test mal eine richtig lange Modulbeschreibung rein.\n\n Ich bin gespannt, wie die angezeigt wird als Legende für die Auswahlknöpfe. Meine Prognose ist, dass NRW das anonyme Verfahren einführen wird. Was glauben Sie, stimmt das?" },
						  { "optionID": 2, "optionTitle": "Ja, rechtsherum" },
						  { "optionID": 3, "optionTitle": "Nein. Ab durch die Mitte!" },
						  { "optionID": 4, "optionTitle": "Jein. Wir drehen durch." }
						  ],
						  "references":
							  [
							   { "referenceName":"Abschlussparty und Auflösung", "referenceAddress":"https://lqfb.piratenpartei.de/lf/initiative/show/5789.html" },
							   { "referenceName":"Bilder zur Motivation","referenceAddress":"https://startpage.com/do/search?cat=pics&cmd=process_search&language=deutsch&query=cat+content" }
							   ]
				 },
				 {
					 "questionID":2,
					 "questionWording":"Drehen wir uns im Kreis? (nur ja/nein/Enthaltung)",
					 "tallyData": {
						 "scheme": /*"voteSystem":*/
							 [{
								 "name": "yesNo",
								 "abstention": true,
								 "abstentionAsNo": true,
								 "quorum": "1+", //1: "at least the same number of YES as of NO",		1+: "more than YES than NO",		2: "at least twice as much YES than NO",		2+: "more than twice as much YES than NO""abstentionAsNo": false,
							 }]
					 },
					 "options":
						 [
						  { "optionID": 1, "optionTitle": "Ja, linksherum. Hier mach ich zum test mal eine richtig lange Modulbeschreibung rein.<br> Ich bin gespannt, wie die angezeigt wird als Legende für die Auswahlknöpfe. Meine Prognose ist, dass NRW das anonyme Verfahren einführen wird. Was glauben Sie, stimmt das?" },
						  { "optionID": 2, "optionTitle": "Ja, rechtsherum" },
						  { "optionID": 3, "optionTitle": "Nein. Ab durch die Mitte!" },
						  { "optionID": 4, "optionTitle": "Jein. Wir drehen durch." }
						  ],
						  "references":
							  [
							   { "referenceName":"Abschlussparty und Auflösung", "referenceAddress":"https://lqfb.piratenpartei.de/lf/initiative/show/5789.html" },
							   { "referenceName":"Bilder zur Motivation","referenceAddress":"https://startpage.com/do/search?cat=pics&cmd=process_search&language=deutsch&query=cat+content" }
							   ]
				 },
				 {
					 "questionID":3,
					 "questionWording":"Bringen uns Schuldzuweisungen irgendwas?",
					 "tallyData": {
						 "scheme": /*"voteSystem":*/
							 [{
								 "name": "yesNo",
								 "abstention": false
							 }]
					 },
					 "options":
						 [
						  { "optionID":1, "optionTitle": "Ja. Befriedigung! Ha!"},
						  { "optionID":2, "optionTitle": "Ja. Streit und Ärger."},
						  { "optionID":3, "optionTitle": "nö, aber wir machen's dennoch" },
						  { "optionID":4, "optionTitle": "Huch? Das macht noch jemand?" }
						  ],
						  "references":
							  [                
							   { "referenceName":"piff paff puff kappotschießen", "referenceAddress":"https://twitter.com/czossi/status/436217916803911680/photo/1" }
							   ]
				 },
				 {
					 "questionID":4,
					 "questionWording":"Basisentscheid / Ständige Mitgliederversammlung\n* SÄA30: Modul 1: Basisentscheid in NRW einführen\n* SÄA30: Modul 2: Basisentscheid online anonym ermöglichen\n* SÄA30: Modul 3: Auch Programmanträge im Basisentscheid zulassen\n* SÄA XY: Ständige Mitgliederversammlung einführen",
					 "tallyData": {
						 "scheme": /*"voteSystem":*/
							 [{
								 "name": "score",
								 "minScore": -3,
								 "maxScore": 3,
							 }]
					 },
					 "options":
						 [
						  { "optionID": 1, "optionTitle": "SÄA 18: SMV Option 1 - Ablehnung von verbindlicher Online-SMV", "optionDesc": "Der Landesverband NRW lehnt es grundsätzlich ab, zum jetzigen Zeitpunkt ein System einzuführen, welches unter zuhilfenahme von Online-Werkzeugen irgendeine Form von verbindlicher Abstimmung umsetzen soll.\n\nZu diesem Zweck werden aus §8 (2) der Landessatzung die Worte \"oder in einem vom Landesparteitag legitimierten Werkzeug\" gestrichen. ", "reasons": "== Glaubwürdigkeit ==\n* Beschluss/PM aus der Gründungszeit der Piratenpartei: https://wiki.piratenpartei.de/Pressemitteilung_vom_12.11.2006_zu_Wahlmaschinen\n* Wir machen uns absolut unglaubwürdig, wenn wir verbindliche Onlineabstimmungen beschliessen und durchführen.\n\n== Toolproblem ==\nEs gibt zum jetzigen Zeitpunkt kein einziges Tool, welches die elementaren Anforderungen an geheime Wahlen erfüllt (anonym/pseudonym, Nachvollzieh- und Überprüfbarkeit). Auf absehbare Zeit nicht umsetzbare Mitbestimmungswerkzeuge in die Satzung zu schreiben ist Zeitverschwendung und Wahlbetrug."},
						  { "optionID": 2, "optionTitle": "SÄA 18: Modul 1: 2014 keine Ressourcen für SMV bereitstellen", "optionDesc": "Das Thema SMV soll 2014 (mindestens für die Amtsperiode des derzeitgen Landesvorstandes) keine Rolle mehr spielen. Es soll insbesondere keinerlei finanzielle Förderung oder Bereitstellung von IT Infrastruktur aus Landesmitteln stattfinden." },
						  { "optionID": 3, "optionTitle": "SÄA 18: Modul 2: Entwicklung auf Bundesebene abwarten", "optionDesc": "Das Thema SMV soll auf Landesebene erst wieder aktiv behandelt werden, wenn es auf Bundesebene neue Entscheidungen oder Entwicklungen zum Thema SMV gibt (z.B. Bestätigung eines Tools, Satzungsänderungen)."  },
						  { "optionID": 4, "optionTitle": "SÄA 19: SMV Option 2 Ständige Mitgliederversammlung nur auf Totholz einführen", "optionDesc": "Der Landesparteitag möge beschliessen, der Satzung an geeigneter Stelle einen Abschnitt \"Basisentscheid und Basisbefragung\" mit folgendem Wortlaut hinzuzufügen: (Anmerkung 1: Der Text entspricht bis auf die hier durch Streichung bzw Fettschrift kenntlich gemachten Teile dem angenommenen SÄA003 (http://wiki.piratenpartei.de/Antrag:Bundesparteitag_2013.1/Antragsportal/SÄA003) aus Neumarkt.)\n\n\
							  (Anmerkung 2: Die parallel dazu vorgeschlagene Entscheidsordnung weicht deutlich von X011 (http://wiki.piratenpartei.de/Antrag:Bundesparteitag_2013.1/Antragsportal/X011) aus Neumarkt ab.) \
							  \n\n(1) Die Mitglieder fassen in einem Basisentscheid einen Beschluss, der einem des Landesparteitags gleichsteht. Ein Beschluss zu Sachverhalten, die dem Landesparteitag vorbehalten sind oder eindeutig dem Parteiprogramm widersprechen, gilt als Basisbefragung mit lediglich empfehlenden Charakter. Urabstimmungen gemäß §6 (2) Nr.11 PartG werden in Form eines Basisentscheids durchgeführt, zu dem alle stimmberechtigten Mitglieder in Textform eingeladen werden. Die nachfolgenden Bestimmungen für Anträge bzw. Abstimmungen gelten sinngemäß auch für Personen bzw. Wahlen.\
							  \n\n(2) Teilnahmeberechtigt sind alle persönlich identifizierten, am Tag der Teilnahme stimmberechtigten Mitglieder gemäß §4(4) der Bundessatzung, die mit ihren Mitgliedsbeiträgen nicht im Rückstand sind. Um für Quoren und Abstimmungen berücksichtigt zu werden, müssen sich die teilnahmeberechtigten Mitglieder zur Teilnahme anmelden.\
							  \n\n(3) Über einen Antrag wird nur abgestimmt, wenn er innerhalb eines Zeitraums ein Quorum von Teilnehmern als Unterstützer erreicht oder vom Bundesparteitag eingebracht wird. Der Landesvorstand darf organisatorische Anträge einbringen. Konkurrierende Anträge zu einem Sachverhalt können rechtzeitig vor der Abstimmung eingebracht und für eine Abstimmung gebündelt werden. Eine erneute Abstimmung über den gleichen oder einen sehr ähnlichen Antrag ist erst nach Ablauf einer Frist zulässig, es sei denn die Umstände haben sich seither maßgeblich geändert. Über bereits erfüllte, unerfüllbare oder zurückgezogene Anträge wird nicht abgestimmt. Der Landesparteitag soll die bisher nicht abgestimmten Anträge behandeln.\
							  \n\n(4) Vor einer Abstimmung werden die Anträge angemessen vorgestellt und zu deren Inhalt eine für alle Teilnehmer zugängliche Debatte gefördert. Die Teilnahme an der Debatte und Abstimmung muss für die Mitglieder zumutbar und barrierefrei sein. Anträge werden nach gleichen Maßstäben behandelt. Mitglieder bzw. Teilnehmer werden rechtzeitig über mögliche Abstimmungstermine bzw. die Abstimmungen in Textform informiert.\
							  \n\n(5) Die Teilnehmer haben gleiches Stimmrecht, das sie selbstständig und frei innerhalb des Abstimmungszeitraums ausüben. Abstimmungen außerhalb des Parteitags erfolgen entweder pseudonymisiert oder geheim. Bei pseudonymisierter Abstimmung kann jeder Teilnehmer die unverfälschte Erfassung seiner eigenen Stimme im Ergebnis überprüfen und nachweisen. Bei personellen Sachverhalten oder auf Antrag einer Minderheit muss die Abstimmung geheim erfolgen. In einer geheimen Abstimmung sind die einzelnen Schritte für jeden Teilnehmer ohne besondere Sachkenntnisse nachvollziehbar und die Stimmabgabe erfolgt nicht elektronisch. Die Manipulation einer Abstimmung oder die Veröffentlichung von Teilergebnissen vor Abstimmungsende sind ein schwerer Verstoß gegen die Ordnung der Partei.\
						  \n\n(6) Das Nähere regelt die Entscheidsordnung, welche durch den Landesparteitag beschlossen wird und auch per Basisentscheid geändert werden kann." },
						  { "optionID": 5, "optionTitle": "SÄA 19: Modul 1: Änderung der Entscheidsordnung durch den Basisentscheid", "optionDesc": "Abschnitt (6) wird ersetzt durch:\n\n(6) Das Nähere regelt die Entscheidsordnung, welche durch den Landesparteitag beschlossen wird und auch per Basisentscheid geändert werden kann." },
						  { "optionID": 6, "optionTitle": "SÄA 19: Modul 2: An die Arbeit !", "optionDesc": "Regionale und kommunale Gliederungen ausreichender Größe sind aufgefordert, spätestens nach der kommenden Kommunalwahl mit der Gründung von Urnen zu beginnen. Der Landesvorstand ist aufgefordert durch Ausschreibungen (oder sofern nötig & möglich auch durch Wahlen noch auf dem LPT), entsprechendes Personal für die Organisation und Durchführung zu finden und entsprechend zu beauftragen." },
						  { "optionID": 7, "optionTitle": "SÄA30: Modul 1: Basisentscheid in NRW einführen", "optionDesc": "" },
						  { "optionID": 8, "optionTitle": "SÄA30: Modul 2: Basisentscheid online anonym ermöglichen", "optionDesc": "" },
						  { "optionID": 9, "optionTitle": "SÄA30: Modul 3: Auch Programmanträge im Basisentscheid zulassen", "optionDesc": "" }
						  ],
						  "references":
							  [
							   { "referenceName":"Vollständiger Antrag zur SMV Option 1 - Ablehnung von verbindlicher Online-SMV mit Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A019" },
							   { "referenceName":"Vollständiger Antrag zur SMV Option 2 - Totholz SMV mit Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A019" },
							   { "referenceName":"Vollständiger Antrag zum Basisentscheid mit Begründung und Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A030" }
							   ]
				 }
				 ],
				 "references":
					 [
					  {"referenceName":"Piratenpartei","referenceAddress":"https://piratenpartei.de/"}
					  ]

	};

	var tally = new ConfigurableTally('', config);
	var fragm = tally.getMainContentFragm(config);
	Page.loadMainContentFragm(fragm);
	ConfigurableTally.showQuestion(0);
};



ConfigurableTally.test2 = function() {
	var config = 
	{
			"ballotID":"GTVsdffgsdwt40QXffsd452re",
			"votingStart": "2014-02-10T21:20:00Z", 
			"votingEnd": "2014-03-04T00:00:00Z",
			"access":
			{
				"listID": "DEADBEEF",
				"groups": [ 1,2,3] 
			},     
			"ballotName": "1. Basisentscheid NRW (online, anonym, Test)",
			"questions":
				[
				 {
					 "questionID":1,
					 "questionWording":"Drehen wir uns im Kreis? (zweistufig)",
					 "tallyData": {
						 "scheme":
							 [ 
							  {
								  "name": "yesNo", /* "yesNo" "score", "pickOne" "rank" */ 
								  "abstention": true
							  },
							  {
								  "name": "score", 
								  "minScore": -3,
								  "maxScore": 3
							  }
							  ]
					 },
					 "options":
						 [
						  { "optionID": 1, "optionTitle": "Ja, linksherum.", "optionDesc": "Hier mach ich zum test mal eine richtig lange Modulbeschreibung rein.\n\n Ich bin gespannt, wie die angezeigt wird als Legende für die Auswahlknöpfe. Meine Prognose ist, dass NRW das anonyme Verfahren einführen wird. Was glauben Sie, stimmt das?" },
						  { "optionID": 2, "optionTitle": "Ja, rechtsherum" },
						  { "optionID": 3, "optionTitle": "Nein. Ab durch die Mitte!" },
						  { "optionID": 4, "optionTitle": "Jein. Wir drehen durch." }
						  ],
						  "references":
							  [
							   { "referenceName":"Abschlussparty und Auflösung", "referenceAddress":"https://lqfb.piratenpartei.de/lf/initiative/show/5789.html" },
							   { "referenceName":"Bilder zur Motivation","referenceAddress":"https://startpage.com/do/search?cat=pics&cmd=process_search&language=deutsch&query=cat+content" }
							   ]
				 },
				 {
					 "questionID":2,
					 "questionWording":"Drehen wir uns im Kreis? (nur ja/nein/Enthaltung)",
					 "tallyData": {
						 "scheme":
							 [{
								 "name": "yesNo", /* "yesNo" "score", "pickOne" "rank" */ 
								 "abstention": false
							 }]
					 },
					 "options":
						 [
						  { "optionID": 1, "optionTitle": "Ja, linksherum. Hier mach ich zum test mal eine richtig lange Modulbeschreibung rein.<br> Ich bin gespannt, wie die angezeigt wird als Legende für die Auswahlknöpfe. Meine Prognose ist, dass NRW das anonyme Verfahren einführen wird. Was glauben Sie, stimmt das?" },
						  { "optionID": 2, "optionTitle": "Ja, rechtsherum" },
						  { "optionID": 3, "optionTitle": "Nein. Ab durch die Mitte!" },
						  { "optionID": 4, "optionTitle": "Jein. Wir drehen durch." }
						  ],
						  "references":
							  [
							   { "referenceName":"Abschlussparty und Auflösung", "referenceAddress":"https://lqfb.piratenpartei.de/lf/initiative/show/5789.html" },
							   { "referenceName":"Bilder zur Motivation","referenceAddress":"https://startpage.com/do/search?cat=pics&cmd=process_search&language=deutsch&query=cat+content" }
							   ]
				 },
				 {
					 "questionID":3,
					 "questionWording":"Bringen uns Schuldzuweisungen irgendwas?",
					 "tallyData": {
						 "scheme":
							 [ 
							  {
								  "name": "rank", /* "yesNo" "score", "pickOne" "rank" */ 
							  }
							  ]
					 },
					 "options":
						 [
						  { "optionID":1, "optionTitle": "Ja. Befriedigung! Ha!"},
						  { "optionID":2, "optionTitle": "Ja. Streit und Ärger."},
						  { "optionID":3, "optionTitle": "nö, aber wir machen's dennoch" },
						  { "optionID":4, "optionTitle": "Huch? Das macht noch jemand?" }
						  ],
						  "references":
							  [                
							   { "referenceName":"piff paff puff kappotschießen", "referenceAddress":"https://twitter.com/czossi/status/436217916803911680/photo/1" }
							   ]
				 },
				 {
					 "questionID":4,
					 "questionWording":"Basisentscheid / Ständige Mitgliederversammlung\n* SÄA30: Modul 1: Basisentscheid in NRW einführen\n* SÄA30: Modul 2: Basisentscheid online anonym ermöglichen\n* SÄA30: Modul 3: Auch Programmanträge im Basisentscheid zulassen\n* SÄA XY: Ständige Mitgliederversammlung einführen",
					 "tallyData": {
						 "scheme":
							 [{
								 "name": "score", 
								 "minScore": 0,
								 "maxScore": 3
							 }]
					 },
					 "options":
						 [
						  { "optionID": 1, "optionTitle": "SÄA 18: SMV Option 1 - Ablehnung von verbindlicher Online-SMV", "optionDesc": "Der Landesverband NRW lehnt es grundsätzlich ab, zum jetzigen Zeitpunkt ein System einzuführen, welches unter zuhilfenahme von Online-Werkzeugen irgendeine Form von verbindlicher Abstimmung umsetzen soll.\n\nZu diesem Zweck werden aus §8 (2) der Landessatzung die Worte \"oder in einem vom Landesparteitag legitimierten Werkzeug\" gestrichen. ", "reasons": "== Glaubwürdigkeit ==\n* Beschluss/PM aus der Gründungszeit der Piratenpartei: https://wiki.piratenpartei.de/Pressemitteilung_vom_12.11.2006_zu_Wahlmaschinen\n* Wir machen uns absolut unglaubwürdig, wenn wir verbindliche Onlineabstimmungen beschliessen und durchführen.\n\n== Toolproblem ==\nEs gibt zum jetzigen Zeitpunkt kein einziges Tool, welches die elementaren Anforderungen an geheime Wahlen erfüllt (anonym/pseudonym, Nachvollzieh- und Überprüfbarkeit). Auf absehbare Zeit nicht umsetzbare Mitbestimmungswerkzeuge in die Satzung zu schreiben ist Zeitverschwendung und Wahlbetrug."},
						  { "optionID": 2, "optionTitle": "SÄA 18: Modul 1: 2014 keine Ressourcen für SMV bereitstellen", "optionDesc": "Das Thema SMV soll 2014 (mindestens für die Amtsperiode des derzeitgen Landesvorstandes) keine Rolle mehr spielen. Es soll insbesondere keinerlei finanzielle Förderung oder Bereitstellung von IT Infrastruktur aus Landesmitteln stattfinden." },
						  { "optionID": 3, "optionTitle": "SÄA 18: Modul 2: Entwicklung auf Bundesebene abwarten", "optionDesc": "Das Thema SMV soll auf Landesebene erst wieder aktiv behandelt werden, wenn es auf Bundesebene neue Entscheidungen oder Entwicklungen zum Thema SMV gibt (z.B. Bestätigung eines Tools, Satzungsänderungen)."  },
						  { "optionID": 4, "optionTitle": "SÄA 19: SMV Option 2 Ständige Mitgliederversammlung nur auf Totholz einführen", "optionDesc": "Der Landesparteitag möge beschliessen, der Satzung an geeigneter Stelle einen Abschnitt \"Basisentscheid und Basisbefragung\" mit folgendem Wortlaut hinzuzufügen: (Anmerkung 1: Der Text entspricht bis auf die hier durch Streichung bzw Fettschrift kenntlich gemachten Teile dem angenommenen SÄA003 (http://wiki.piratenpartei.de/Antrag:Bundesparteitag_2013.1/Antragsportal/SÄA003) aus Neumarkt.)\n\n\
							  (Anmerkung 2: Die parallel dazu vorgeschlagene Entscheidsordnung weicht deutlich von X011 (http://wiki.piratenpartei.de/Antrag:Bundesparteitag_2013.1/Antragsportal/X011) aus Neumarkt ab.) \
							  \n\n(1) Die Mitglieder fassen in einem Basisentscheid einen Beschluss, der einem des Landesparteitags gleichsteht. Ein Beschluss zu Sachverhalten, die dem Landesparteitag vorbehalten sind oder eindeutig dem Parteiprogramm widersprechen, gilt als Basisbefragung mit lediglich empfehlenden Charakter. Urabstimmungen gemäß §6 (2) Nr.11 PartG werden in Form eines Basisentscheids durchgeführt, zu dem alle stimmberechtigten Mitglieder in Textform eingeladen werden. Die nachfolgenden Bestimmungen für Anträge bzw. Abstimmungen gelten sinngemäß auch für Personen bzw. Wahlen.\
							  \n\n(2) Teilnahmeberechtigt sind alle persönlich identifizierten, am Tag der Teilnahme stimmberechtigten Mitglieder gemäß §4(4) der Bundessatzung, die mit ihren Mitgliedsbeiträgen nicht im Rückstand sind. Um für Quoren und Abstimmungen berücksichtigt zu werden, müssen sich die teilnahmeberechtigten Mitglieder zur Teilnahme anmelden.\
							  \n\n(3) Über einen Antrag wird nur abgestimmt, wenn er innerhalb eines Zeitraums ein Quorum von Teilnehmern als Unterstützer erreicht oder vom Bundesparteitag eingebracht wird. Der Landesvorstand darf organisatorische Anträge einbringen. Konkurrierende Anträge zu einem Sachverhalt können rechtzeitig vor der Abstimmung eingebracht und für eine Abstimmung gebündelt werden. Eine erneute Abstimmung über den gleichen oder einen sehr ähnlichen Antrag ist erst nach Ablauf einer Frist zulässig, es sei denn die Umstände haben sich seither maßgeblich geändert. Über bereits erfüllte, unerfüllbare oder zurückgezogene Anträge wird nicht abgestimmt. Der Landesparteitag soll die bisher nicht abgestimmten Anträge behandeln.\
							  \n\n(4) Vor einer Abstimmung werden die Anträge angemessen vorgestellt und zu deren Inhalt eine für alle Teilnehmer zugängliche Debatte gefördert. Die Teilnahme an der Debatte und Abstimmung muss für die Mitglieder zumutbar und barrierefrei sein. Anträge werden nach gleichen Maßstäben behandelt. Mitglieder bzw. Teilnehmer werden rechtzeitig über mögliche Abstimmungstermine bzw. die Abstimmungen in Textform informiert.\
							  \n\n(5) Die Teilnehmer haben gleiches Stimmrecht, das sie selbstständig und frei innerhalb des Abstimmungszeitraums ausüben. Abstimmungen außerhalb des Parteitags erfolgen entweder pseudonymisiert oder geheim. Bei pseudonymisierter Abstimmung kann jeder Teilnehmer die unverfälschte Erfassung seiner eigenen Stimme im Ergebnis überprüfen und nachweisen. Bei personellen Sachverhalten oder auf Antrag einer Minderheit muss die Abstimmung geheim erfolgen. In einer geheimen Abstimmung sind die einzelnen Schritte für jeden Teilnehmer ohne besondere Sachkenntnisse nachvollziehbar und die Stimmabgabe erfolgt nicht elektronisch. Die Manipulation einer Abstimmung oder die Veröffentlichung von Teilergebnissen vor Abstimmungsende sind ein schwerer Verstoß gegen die Ordnung der Partei.\
						  \n\n(6) Das Nähere regelt die Entscheidsordnung, welche durch den Landesparteitag beschlossen wird und auch per Basisentscheid geändert werden kann." },
						  { "optionID": 5, "optionTitle": "SÄA 19: Modul 1: Änderung der Entscheidsordnung durch den Basisentscheid", "optionDesc": "Abschnitt (6) wird ersetzt durch:\n\n(6) Das Nähere regelt die Entscheidsordnung, welche durch den Landesparteitag beschlossen wird und auch per Basisentscheid geändert werden kann." },
						  { "optionID": 6, "optionTitle": "SÄA 19: Modul 2: An die Arbeit !", "optionDesc": "Regionale und kommunale Gliederungen ausreichender Größe sind aufgefordert, spätestens nach der kommenden Kommunalwahl mit der Gründung von Urnen zu beginnen. Der Landesvorstand ist aufgefordert durch Ausschreibungen (oder sofern nötig & möglich auch durch Wahlen noch auf dem LPT), entsprechendes Personal für die Organisation und Durchführung zu finden und entsprechend zu beauftragen." },
						  { "optionID": 7, "optionTitle": "SÄA30: Modul 1: Basisentscheid in NRW einführen", "optionDesc": "" },
						  { "optionID": 8, "optionTitle": "SÄA30: Modul 2: Basisentscheid online anonym ermöglichen", "optionDesc": "" },
						  { "optionID": 9, "optionTitle": "SÄA30: Modul 3: Auch Programmanträge im Basisentscheid zulassen"}
						  ],
						  "references":
							  [
							   { "referenceName":"Vollständiger Antrag zur SMV Option 1 - Ablehnung von verbindlicher Online-SMV mit Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A019" },
							   { "referenceName":"Vollständiger Antrag zur SMV Option 2 - Totholz SMV mit Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A019" },
							   { "referenceName":"Vollständiger Antrag zum Basisentscheid mit Begründung und Modulen", "referenceAddress":"https://wiki.piratenpartei.de/NRW:Landesparteitag_2014.1/Antr%C3%A4ge/S%C3%84A030" }
							   ]
				 }
				 ],
				 "references":
					 [
					  {"referenceName":"Piratenpartei","referenceAddress":"https://piratenpartei.de/"}
					  ]

	};

	var tally = new ConfigurableTally('', config);
	var fragm = tally.getMainContentFragm(config);
	Page.loadMainContentFragm(fragm);
	ConfigurableTally.showQuestion(0);
};