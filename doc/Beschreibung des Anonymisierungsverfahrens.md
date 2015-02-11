Ein Vorschlag, wie anonym gew„hlt werden kann (d.h. niemand nachvollziehen kann, wer wie abgestimmt hat) und gleichzeitig sichergestellt ist, dass nur Wahlberechtigte abstimmen k”nnen und auch nur einmal.

Die L”sung des Problems arbeitet mit blinden Signaturen.
Die blinden Signaturen erm”glichen beispielsweise folgendes Vorgehen fr eine anonyme und nachvollziehbare Wahl:

1. Der W„hler (Client) erzeugt ein RSA-Schlsselpaar.
2. Den ”ffentlichen Teil des RSA-Schlssels verblindet der Client
3. Den verblindeten ”ffentlichen Teil des RSA-Schlssels schickt er zusammen mit Identifizerungsmerkmalen an den Wahlberechtigungsserver
4. An Hand der Identifizerungsmerkmale prft der Server die Wahlberechtigung (darf Grunds„tzlich w„hlen und hat noch keinen Wahlschein). 
5. Wenn wahlberechtigt, dann unterschreibt der Server den verblindeten Teil des ”ffentlichen Schlssels.
6. Der Wahlberechtigungsserver schickt den verblindet unterschriebenen ”ffentlichen Teil des W„hlerschlssels zurck an den Client = W„hler.
7. Der Client entblindet die Unterschrift des Wahlberechtigungsservers.
8. Der Client = W„hler unterschreibt mit seinem privaten Schlssel seine Stimme.
9. Der Client schickt seine Stimme ohne Absender, zusammen mit seiner Unterschrift und dem ”ffentlichen Teil seines RSA-Schlssels und zusammen mit der entblindeten Unterschrift des Wahlberechtigungsservers unter dem ”ffentlichen Teil des Schlssels an den Z„hlserver.
10. Nach Abschluss der Wahl werden alle Transaktionen ver”ffentlicht.
Ergebnis: Siehe unten C.

Damit die Kompromittierung des geheimen Schlssels des Wahlberechtigungsservers nicht dazu fhrt, dass der Angreifer gltige Wahlscheine ausstellen kann, werden mindestens 2 Wahlberechtigungsserver verwendet, die beide den (verblindeten) ”ffentlichen Teil des W„hlerschlssels unterschrieben haben mssen, damit der Wahlschein gltig ist.
Da selbst eine Zusammenarbeit von allen Wahlberechtigungsservern und allen Z„hlservern die Anonymit„t nicht knacken kann, k”nnen Wahlberechtigungsserver und Z„hlserver die gleichen Server sein.

Die Anonymit„t kann nur ber einen Angriff auf den Client gebrochen werden. Das bedeutet, 1. Es sind besondere Sicherungsmaánahmen fr den Client sinnvoll. Er k”nnte beispielsweise als bootbares System verteilt werden.
2. Erfolgreiche Angriffe treffen nur einzelne W„hler.



A. Wenn eine Wahlscheinnummer blind unterschrieben wird, so dass
derjenige Server, der die Wahlberechtigung prft, die Wahlscheinnummer
nicht kennt. Das kann auch ber mehrere Server geschehen, so dass man
nicht 1 Server vertrauen muss, dass er keine zus„tzlichen Wahlscheine unterschreibt. 

Man kann sich das so vorstellen: 
Der W„hler schreibt eine lange selbst gew„hlte Nummer auf ein Blattpapier
(Wahlscheinnummer) [genauer: auf dem Client wird eine Zufallszahl bzw. ein RSA-Schlsselpaar erzeugt, wovon der ”ffentliche Schlssel als Zufallszahl verwendet wird] und legt dieses zusammen mit einem Kohleblatt in
einen Umschlag, der verschlossen wird. Der Server prft die Wahlberechtigung und unterschreibt auáen auf dem Umschlag, wobei sich
die Unterschrift durch das Kohlepapier auf das Blatt, auf dem die
Wahlscheinnummer steht, durchdrckt. Der Server hat die Wahlscheinnummer
also nicht gesehen.
Es bietet sich an, das Verfahren so zu machen, dass man sich diese Wahlzettel vor Er”ffnung der Wahlen erzeugen und blind unterschreiben lassen muss. Es k”nnen im Vorhinein Wahlscheine fr mehrere Wahlen erzeugt werden.


B. Die Unterschrift unter der Wahlscheinnummer kann hinterher von jedem
geprft werden.

C. Nach Ende der Abstimmung werden die Wahlscheinnummern zusammen mit
der abgegebenen Stimme ver”ffentlicht. Im Vergleich: die ausgepackten
Zettel, auf die sich die Unterschrift mittels Kohlepapier durchgedrckt
hat und der W„hler danach seine Stimme drauf geschrieben hat, werden
ver”ffentlicht)

Ergebnis:
a) Jeder kann berprfen, dass nur unterschriebene Wahlscheinnummern
abgestimmt haben
b) Jeder kann die Stimmen selbst nachz„hlen, weil sie ver”ffentlicht sind.
c) Jeder kann bei seiner eigenen Stimme sehen, ob sie korrekt empfangen
wurde, denn jeder kennt selbst seine eigene Wahlscheinnummer.

Dies ist nur eine der M”glichkeiten, online Abstimmungen so
durchzufhren, dass fr niemanden auáer dem Abstimmenden selbst
nachvollziehbar ist, wer wie abgestimmt hat (anonyme Wahl) und dennoch
jeder das Wahlergebnis nachz„hlen kann (nachvollziehbar).


Man kann sich das gesamte Verfahren so vorstellen: 
1. bis 3.: Der W„hler schreibt eine lange selbst gew„hlte Nummer auf ein Blattpapier
(Wahlscheinnummer) und legt dieses zusammen mit einem Kohleblatt in
einen Umschlag, der verschlossen wird. Auf den Briefumschlag schreibt er den Absender drauf. 

4. Anhand des Absenders prft der Sever die Wahlberechtigung (ist grunds„tzlich 
wahlberechtigt und hat fr diese Abstimmung noch keinen Wahlschein)

5. Der Server unterschreibt auáen auf dem Umschlag, wobei sich die Unterschrift 
durch das Kohlepapier auf das Blatt, auf dem die Wahlscheinnummer steht, 
durchdrckt. Der Server hat die Wahlscheinnummer also nicht gesehen.
 
6. Er schickt den Umschlag mit dem Wahlschein unge”ffnet 
an den W„hler (=Client) zurck. 

7. Der W„hler packt den Umschlag aus (kryptografisch: entblindet ihn). 
Er hat damit einen Wahlschein, auf dem 
(a) eine zuf„llige lange und daher eindeutige Nummer steht und 
(b) durch das Kohlepapier die Unterschrift des Wahlberechtigungsservers drauf ist.

8. Auf diesen Wahlschein schreibt der W„hler seine Stimme drauf, steckt den Wahlschein
in einen frischen Briefumschlag und 

9. schickt ihn ohne Absender an den Z„hlserver.

10. Nach Abschluss der Abstimmung werden alle Briefe, die die Server 
erhalten haben, ver”ffentlicht. Damit kann jeder selbst die abgegebenen Stimmen 
(nach-)z„hlen und auch die Unterschriften auf den Wahlzetteln prfen.    



Dies ist nur eine der M”glichkeiten, online Abstimmungen so
durchzufhren, dass fr niemanden auáer dem Abstimmenden selbst
nachvollziehbar ist, wer wie abgestimmt hat (anonyme Wahl) und dennoch
jeder das Wahlergebnis nachz„hlen kann (nachvollziehbar). Es ist in vvvote 
in dem Modul blinded-voter umgesetzt. 

siehe auch hier: https://basisentscheid.piratenpad.de/geheim1