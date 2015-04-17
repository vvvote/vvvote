Anonymisierungsverfahren von vvvote
===================================

[TOC]

1. Ziel des Verfahrens
-------------------
vvvote verwendet folgendes Verfahren zur anonym und gleichzeitig nachvollziehbaren Abstimmung. Das bedeutet, dass

*  niemand nachvollziehen kann, wer wie abgestimmt hat und gleichzeitig 
*  sichergestellt ist, dass nur Stimmberechtigte abstimmen können und zwar jeder nur einmal.

2. Kurzbeschreibung des Verfahrens
-------------------------------
Der Wahlschein ist digital von mindestens 2 Servern unterschrieben. Diese Unterschrift führt dazu, dass der Wahlschein bei der Stimmabgabe akzeptiert wird.

Der Wahlschein enthält eine eindeutige Wahlscheinnummer, die nur Ihr Computer kennt - sie wurde von Ihrem Computer erzeugt und verschlüsselt, bevor die Server den Wahlschein unterschrieben haben, und danach auf Ihrem Computer entschlüsselt (Man spricht von "Blinded Signature"). Die Server kennen daher die Wahlscheinnummer nicht.

### 2.1 Man kann sich das so vorstellen ###

Ihr Computer schreibt auf den Wahlschein die Wahlscheinnummer, die er sich selbst "ausdenkt" (Zufallszahl). Dieser Wahlschein wird zusammen mit einem Blatt Kohlepapier in einen Umschlag gelegt und an den Server geschickt. 

Der Server unterschreibt außen auf dem Umschlag (wenn Sie wahlberechtigt sind), so dass sich die Unterschrift durch das Kohlepapier auf Ihren Wahlschein überträgt. Ohne den Umschlag geöffnet zu haben (was der Server nicht kann, weil er den dafür notwendigen Schlüssel nicht kennt), schickt er den Brief an Ihren Computer zurück.

Ihr Computer öffnet den Umschlag (d.h. entschlüsselt die Wahlscheinnummer) und hält einen vom Server unterschriebenen Wahlschein in der Hand, deren Nummer der Server nicht kennt.

3. Technischere Beschreibung des Verfahrens
----------------------------------------
Die Lösung des Problems arbeitet mit blinden Signaturen. Die blinden Signaturen ermöglichen folgendes Vorgehen für eine anonyme und nachvollziehbare Abstimmung:

1. Der Wähler (Client) erzeugt ein RSA-Schlüsselpaar.
2. Den öffentlichen Teil des RSA-Schlüssels verblindet der Client
3. Den verblindeten öffentlichen Teil des RSA-Schlüssels schickt er zusammen mit Identifizerungsmerkmalen an den Wahlberechtigungsserver
4. Anhand der Identifizerungsmerkmale prüft der Server die Stimmberechtigung (darf grundsätzlich wählen und hat noch keinen Wahlschein). 
5. Wenn stimmberechtigt, dann unterschreibt der Server den verblindeten Teil des öffentlichen Schlüssels.
6. Der Stimmberechtigungsserver schickt den verblindet unterschriebenen öffentlichen Teil des Wählerschlüssels zurück an den Client = Wähler.
7. Der Client entblindet die Unterschrift des Stimmberechtigungsservers.
8. Der Client = Wähler unterschreibt mit seinem privaten Schlüssel seine Stimme.
9. Der Client schickt seine Stimme ohne Absender, zusammen mit seiner Unterschrift, dem öffentlichen Teil seines RSA-Schlüssels und mit der entblindeten Unterschrift des Stimmberechtigungsservers unter dem öffentlichen Teil seines Schlüssels an den Zählserver.
10. Nach Abschluss der Wahl werden alle Transaktionen veröffentlicht.
Ergebnis: Siehe unten C.

4. Angriffsmöglichkeiten und entsprechende Sicherungsmaßnahmen
--------------------------------------------------------------

Angriffe können verschiedene Ziele haben: Es kann versucht werden,..

1. das Abstimmunsergebnis zu verändern
2. die Anonymität zu brechen

4.1. Abstimmungsergebnis manipulieren?
------------------------------------
Das Abstimmungsergebnis zu manipulieren ist ziemlich schwierig, denn:

1. Alle Stimmen werden veröffentlicht. Jeder kann prüfen, ob seine Stimme dabei ist.
2. Jeder kann prüfen, dass keine Stimme verändert wurde, denn die Stimmen sind von den Wählern digital unterschrieben. Eine Veränderung der Stimme würde diese Unterschrift ungültig machen.
3. Jeder kann damit nachzählen, ob der Server richtig ausgezählt hat.

Ein Problem aber bleibt: Der Server könnte selbst Wahlscheine erzeugen, sie selbst unterschreiben, hinzufügen und selbst abstimmen. 

Dies könnte vom Administrator des Servers ausgehen oder von einem externen Angreifer, dem es gelungen ist, den geheimen Schlüssel vom Server zu kopieren. Dieser Schlüssel wird verwendet, um die Wahlscheine zu unterschreiben und somit die Stimmberechtigung zu bestätigen.

Dies kann verhindert werden, wenn die Kenntnis dieses Schlüssels nicht ausreicht, um die Stimmberechtigung zu erlangen. Damit die Kompromittierung des geheimen Schlüssels des Stimmberechtigungsservers nicht dazu führt, dass ein Angreifer gültige Wahlscheine ausstellen kann, werden mindestens 2 Stimmberechtigungsserver verwendet, die beide den (verblindeten) öffentlichen Teil des Wählerschlüssels unterschrieben haben müssen, damit der Wahlschein gültig ist.

Da selbst eine Zusammenarbeit von allen Stimmberechtigungsservern und allen Zählservern die Anonymität nicht knacken kann, können jeweils ein Stimmberechtigungsserver und ein Zählserver vom gleichen Administrator verwaltet werden (und auf dem gleichen System laufen). Damit das Hinzufügen von Stimmen durch einen Adminstrator unmöglich wird, müssen mindestens 2 Stimmberechtigungsserver verwendet werden, die von unterschiedlichen Administratoren betreut werden.

4.2. Anonymität brechen?
------------------------
Die cryptographische Anonymität kann nur über einen Angriff auf den Client gebrochen werden, denn den Servern liegen keinerlei Informationen vor, die die Anonymität brechen könnte. Das bedeutet, 

1. Es sind besondere Sicherungsmaßnahmen für den Client sinnvoll. Der Client ist daher so konzipiert, dass er (auch) über andere Kanäle verbreitet werden kann. Er ist in HTML/Javascript geschrieben und besteht aus lediglich einer .html-Datei. Er kann vom Server abgerufen werden über den Basis-URL des Servers, an die "backend/getclient.php" angehängt wird. Der Hash-Wert des Clients kann ebenso über unterschiedliche Kanäle verbreitet werden, so dass jeder prüfen kann, ob sein Client verändert wurde. 
2. Erfolgreiche Angriffe auf den Client von einem manipulierten Abstimmserver können dadurch auffallen.
3. Angriffe auf den Client, die nicht von einem Abstimmserver ausgehen, treffen nur einzelne Wähler, deren Computer infiziert ist.

Grundsätzlich besteht natürlich immer das Risiko, dass das Verfahren selbst fehlerhaft sein könnte oder fehlerhaft programmiert wurde.

Die Sicherung der Anonymität hängt bei diesem Verfahren entscheidend davon ab, dass man seine Stimme ohne Absenderinformationen einreicht. 

Zu diesem Zweck wird ein Anonymisierungsdienst eingesetzt, der die IP-Adresse ändert und alle Browserspezifischen Informationen löscht (anonymouse.org).

Aus dem gleichen Grund wird verhindert, dass es einen unmittelbaren zeitlichen Zusammenhang zwischen dem Zeitpunkt der Erstellung des Wahlscheines, bei der die Identität dem Server bekannt ist und der Stimmabgabe, gibt. Daher sind entweder die Phasen der Erstellung der Wahlscheine und der Stimmabgabe vollständig voneinander getrennt (d.h. solange sich jemand einen Wahlschein erstellen kann, kann niemand abstimmen) oder die Abstimmung erfolgt verzögert, beispielsweise immer erst ab 18:00 des Tages, an dem man sich den Wahlschein erstellt hat, bzw. am nächsten Tag ab 18:00, wenn man sich den Wahlschein nach 18:00 erstellt hat.

Ein besonderes Risiko für die Anonymität besteht immer, wenn weitere Daten zusammengeführt werden können: Wenn man sich beispielsweise vor der Abstimmung über die Anträge auf irgendwelchen Webseiten informiert hat, und den Zeitpunkt kennen würde (wird nicht veröffentlicht), an dem man abgestimmt hat, könnte man statistische Zusammenhänge zwischen dem Zeitpunkt des Besuches dieser Seiten und dem Zeitpunkt der Stimmabgabe __vermuten__. Das Verfahren sichert, dass es nicht bewiesen werden kann.


5. Detaillierte, allgemeinverständlichere Beschreibung des Verfahrens
------------------------------------------------------------------
Man kann sich das so vorstellen: 

1. Der Wähler bereitet einen Briefumschlag vor, auf den er außen seinen Benutzername und sein Passwort schreibt.
2. Der Wähler schreibt eine lange selbst gewählte Nummer auf ein Blattpapier(Wahlscheinnummer) [technisch: auf dem Client wird eine Zufallszahl bzw. ein RSA-Schlüsselpaar erzeugt, wovon der öffentliche Schlüssel als Zufallszahl verwendet wird] und legt es zusammen mit einem Kohleblatt in den Breifumschlag, der verschlossen wird [technisch: verschlüsselt wird]. 
3. Der Wähler schickt diesen Brief (noch mal verschlüsselt) an den Stimmberechtigungsserver.
4. Der Stimmberechtigungsserver prüft die Stimmberechtigung und unterschreibt außen auf dem Umschlag. Dabei drückt sich die Unterschrift durch das Kohlepapier auf das Blatt, auf dem die Wahlscheinnummer steht, durch. Der Server hat die Wahlscheinnummer also nicht gesehen.
5. Der Stimmberechtigungsserver schickt den Briefumschlag ungeöffnet an den Wähler zurück.
6. Der Wähler öffnet den Briefumschlag (technisch: entschlüsselt die Daten). Damit hat der Wähler ein Blattpapier, auf dem eine eindeutige zufällig Zahl steht, die er selst erzeugt hat, und die durch das Kohlepapier durchgedrückte Unterschrift des Stimmberechtigungsservers. Dies ist der Wahlschein.
7. Auf den Wahlschein schreibt der Wähler seine Stimme und schickt ihn an den Zählserver.
8. Der Zählserver prüft
	a) ob die Unterschrift des Stimmberechtigungsservers vorhanden ist und sie gültig ist und
	b) ob mit der Wahlscheinnummer noch keine Stimme abgegeben wurde.
Wenn beides erfüllt ist, akzeptiert der Zählserver die Stimme.
9. Nach Ende der Abstimmung werden die Wahlscheinnummern zusammen mit der abgegebenen Stimme veröffentlicht. Anders ausgedrückt: die ausgepackten Wahlscheine, auf die sich die Unterschrift mittels Kohlepapier durchgedrückt hat und der Wähler danach seine Stimme drauf geschrieben hat, werden veröffentlicht.

6. Ergebnis
--------
1. Jeder kann überprüfen, dass nur unterschriebene Wahlscheinnummern abgestimmt haben
2. Jeder kann die Stimmen selbst nachzählen, weil sie veröffentlicht sind.
3. Jeder kann bei seiner eigenen Stimme sehen, ob sie korrekt empfangen wurde, denn jeder kennt selbst seine eigene Wahlscheinnummer.
4. Jeder kann prüfen, dass keine Stimmen vom Server verändert wurde: Jede Stimme ist digital unterschrieben. Eine Veränderung der Stimme würde die unetrschrift ungültig machen.

Dies ist nur eine der Möglichkeiten, online Abstimmungen so
durchzuführen, dass für niemanden außer dem Abstimmenden selbst
nachvollziehbar ist, wer wie abgestimmt hat (anonyme Wahl) und dennoch
jeder das Wahlergebnis nachzählen kann (nachvollziehbar).


7. Zuordnung der technischen Verfahrensschritte zur allgemeinverständlicheren Darstellung
---------------------------------------------------------------------------------------
Man kann sich das gesamte Verfahren so vorstellen (die : Nummern nach dem Doppelpunkt beziehen sich auf die Verfahrensschrittnummern in der technischen Beschreibung)

* :1. bis 3.: Der Wähler schreibt eine lange selbst gewählte Nummer auf ein Blattpapier (Wahlscheinnummer) und legt dieses zusammen mit einem Kohleblatt in einen Umschlag, der verschlossen wird. Auf den Briefumschlag schreibt er den Absender drauf. 

* :4. Anhand des Absenders prüft der Sever die Wahlberechtigung (ist grundsätzlich wahlberechtigt und hat für diese Abstimmung noch keinen Wahlschein)

* :5. Der Server unterschreibt außen auf dem Umschlag, wobei sich die Unterschrift durch das Kohlepapier auf das Blatt, auf dem die Wahlscheinnummer steht, durchdrückt. Der Server hat die Wahlscheinnummer also nicht gesehen.
 
* :6. Er schickt den Umschlag mit dem Wahlschein ungeöffnet an den Wähler (=Client) zurück. 

* :7. Der Wähler packt den Umschlag aus (kryptografisch: entblindet ihn). 
Er hat damit einen Wahlschein, auf dem 
	(a) eine zufällige lange und daher eindeutige Nummer steht und 
	(b) durch das Kohlepapier die Unterschrift des Stimmberechtigungsservers drauf ist.

* :8. Auf diesen Wahlschein schreibt der Wähler seine Stimme drauf, steckt den Wahlschein in einen frischen Briefumschlag und 

* :9. schickt ihn ohne Absender an den Zählserver.

10. Nach Abschluss der Abstimmung werden alle Briefe, die die Server 
erhalten haben, veröffentlicht. Damit kann jeder selbst die abgegebenen Stimmen (nach-)zählen und auch die Unterschriften auf dem Wahlschein prüfen.    


8. Alternative anonyme und nachvollziehbare Abstimmverfahren
------------------------------------------------------------
Dies ist nur eine der Möglichkeiten, online Abstimmungen so durchzuführen, dass für niemanden außer dem Abstimmenden selbst nachvollziehbar ist, wer wie abgestimmt hat (anonyme Wahl) und dennoch jeder das Wahlergebnis nachzählen kann (nachvollziehbar). Es ist in vvvote in dem Modul blinded-voter umgesetzt. 

Ein anderes Verfahren wird beispielsweise von den Schweizer Piraten seit Jahren eingestzt (Pivote). Das dabei eingesetzte Verfahren ist allerdings schwieriger zu verstehen, hat Flexibilitätsnachteile und die Anonymität durch eine bestimmte Zahl Wahlverantwortlicher, die dafür zusammenarbeiten müssten, jederzeit aufgehoben werden. 


Links
-----
* Eine exakte technische Beschreibung des verwendeten Protokolls und der verwendeten API findet sich unter [hier](https://github.com/pfefffer/vvvote/tree/master/doc/protocol "Titel")
* ein alter Stand dieses Dokumentes, einschließlich Diskussion ist [hier](https://basisentscheid.piratenpad.de/geheim1 "Pad") zu finden
* Der vollständige [Quellcode ist auf Github veröffentlicht](https://github.com/pfefffer/vvvote)