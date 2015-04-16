Anonymisierungsverfahren von vvvote
===================================

Ziel des Verfahrens
-------------------
vvvote verwendet folgendes Verfahren zur anonym Abstimmung(d.h. niemand nachvollziehen kann, wer wie abgestimmt hat) und gleichzeitig sichergestellt ist, dass nur Stimmberechtigte abstimmen können und zwar jeder nur einmal.

Verfahren
---------
Die Lösung des Problems arbeitet mit blinden Signaturen.
Die blinden Signaturen ermöglichen folgendes Vorgehen für eine anonyme und nachvollziehbare Abstimmung:

1. Der Wähler (Client) erzeugt ein RSA-Schlüsselpaar.
2. Den öffentlichen Teil des RSA-Schlüssels verblindet der Client
3. Den verblindeten öffentlichen Teil des RSA-Schlüssels schickt er zusammen mit Identifizerungsmerkmalen an den Wahlberechtigungsserver
4. Anhand der Identifizerungsmerkmale prüft der Server die Stimmberechtigung (darf Grundsätzlich wählen und hat noch keinen Wahlschein). 
5. Wenn stimmberechtigt, dann unterschreibt der Server den verblindeten Teil des öffentlichen Schlüssels.
6. Der Stimmberechtigungsserver schickt den verblindet unterschriebenen öffentlichen Teil des Wählerschlüssels zurück an den Client = Wähler.
7. Der Client entblindet die Unterschrift des Stimmberechtigungsservers.
8. Der Client = Wähler unterschreibt mit seinem privaten Schlüssel seine Stimme.
9. Der Client schickt seine Stimme ohne Absender, zusammen mit seiner Unterschrift, dem öffentlichen Teil seines RSA-Schlüssels und mit der entblindeten Unterschrift des Stimmberechtigungsservers unter dem öffentlichen Teil seines Schlüssels an den Zählserver.
10. Nach Abschluss der Wahl werden alle Transaktionen veröffentlicht.
Ergebnis: Siehe unten C.

Angriffsmöglichkeiten und entsprechende Sicherungsmaßnahmen
----------------------------------------------------------------------------
Damit die Kompromittierung des geheimen Schlüssels des Stimmberechtigungsservers nicht dazu führt, dass ein Angreifer gültige Wahlscheine ausstellen kann, werden mindestens 2 Stimmberechtigungsserver verwendet, die beide den (verblindeten) öffentlichen Teil des Wählerschlüssels unterschrieben haben müssen, damit der Wahlschein gültig ist.
Da selbst eine Zusammenarbeit von allen Stimmberechtigungsservern und allen Zählservern die Anonymität nicht knacken kann, können jeweils ein Stimmberechtigungsserver und ein Zählserver vom gleichen Administrator verwaltet werden (und auf dem gleichen System laufen).

Die Anonymität kann nur über einen Angriff auf den Client gebrochen werden. Das bedeutet, 1. Es sind besondere Sicherungsmaßnahmen für den Client sinnvoll. Er könnte beispielsweise als bootbares System verteilt werden.
2. Erfolgreiche Angriffe treffen nur einzelne Wähler.


Allgemeinverständlichere Beschreibung des Verfahrens
----------------------------------------------------
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

Ergebnis
--------
1. Jeder kann überprüfen, dass nur unterschriebene Wahlscheinnummern
abgestimmt haben
2. Jeder kann die Stimmen selbst nachzählen, weil sie veröffentlicht sind.
c) Jeder kann bei seiner eigenen Stimme sehen, ob sie korrekt empfangen
wurde, denn jeder kennt selbst seine eigene Wahlscheinnummer.

Dies ist nur eine der Möglichkeiten, online Abstimmungen so
durchzuführen, dass für niemanden außer dem Abstimmenden selbst
nachvollziehbar ist, wer wie abgestimmt hat (anonyme Wahl) und dennoch
jeder das Wahlergebnis nachzählen kann (nachvollziehbar).


Man kann sich das gesamte Verfahren so vorstellen: 
1. bis 3.: Der Wähler schreibt eine lange selbst gewählte Nummer auf ein Blattpapier
(Wahlscheinnummer) und legt dieses zusammen mit einem Kohleblatt in
einen Umschlag, der verschlossen wird. Auf den Briefumschlag schreibt er den Absender drauf. 

4. Anhand des Absenders prüft der Sever die Wahlberechtigung (ist grundsätzlich 
wahlberechtigt und hat für diese Abstimmung noch keinen Wahlschein)

5. Der Server unterschreibt außen auf dem Umschlag, wobei sich die Unterschrift 
durch das Kohlepapier auf das Blatt, auf dem die Wahlscheinnummer steht, 
durchdrückt. Der Server hat die Wahlscheinnummer also nicht gesehen.
 
6. Er schickt den Umschlag mit dem Wahlschein ungeöffnet 
an den Wähler (=Client) zurück. 

7. Der Wähler packt den Umschlag aus (kryptografisch: entblindet ihn). 
Er hat damit einen Wahlschein, auf dem 
(a) eine zufällige lange und daher eindeutige Nummer steht und 
(b) durch das Kohlepapier die Unterschrift des Wahlberechtigungsservers drauf ist.

8. Auf diesen Wahlschein schreibt der Wähler seine Stimme drauf, steckt den Wahlschein
in einen frischen Briefumschlag und 

9. schickt ihn ohne Absender an den Zählserver.

10. Nach Abschluss der Abstimmung werden alle Briefe, die die Server 
erhalten haben, veröffentlicht. Damit kann jeder selbst die abgegebenen Stimmen 
(nach-)zählen und auch die Unterschriften auf dem Wahlschein prüfen.    



Dies ist nur eine der Möglichkeiten, online Abstimmungen so
durchzuführen, dass für niemanden außer dem Abstimmenden selbst
nachvollziehbar ist, wer wie abgestimmt hat (anonyme Wahl) und dennoch
jeder das Wahlergebnis nachzählen kann (nachvollziehbar). Es ist in vvvote 
in dem Modul blinded-voter umgesetzt. 

siehe auch hier: https://basisentscheid.piratenpad.de/geheim1