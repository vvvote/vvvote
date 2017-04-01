Um dieses Dokument mit Ablaufdiagrammen anzuzeigen, klicken Sie hier: https://stackedit.io/viewer#!url=https://raw.githubusercontent.com/vvvote/vvvote/master/doc/flowchart_memberDB_VotezillaPortal_Vvvote.md



# Schritt 1: Registrierung am Votezilla Portal
```sequence
Note right of MitgliedsDB: Erzeuge für jedes Mitglied ein zufälliges Registrierungstoken
MitgliedsDB->Votezilla_Portal: sendet alle Registrierungstoken
MitgliedsDB->Mitglied: sendet an alle Mitglieder eine Email mit dem jeweiligen Registrierungstoken
Mitglied->Votezilla_Portal: Registriert sich, wählt Benutzername, Passwort und hinterlegt eine Emailadresse
Note left of Mitglied: Mitglied kann Antragsentwürfe einstellen, Anträge unterstützen, Anträge einreichen, an Abstimmungen teilnehmen
```

# Schritt 2: Anonyme Abstimmung

```sequence
Mitglied->Votezilla_Portal: loggt sich ein und klickt auf "Wahlschein"
Note right of Votezilla_Portal: Erzeugt ein zufälliges Autorisierungstoken
Votezilla_Portal->Vvvote_Client: Weiterleitung auf den Vvvote-Webclient mit Autorisierungstoken
Note right of Vvvote_Client: Erzeugt einen zufälligen RSA-Schlüssel
Vvvote_Client->Vvvote_Server:  sendet verblindeten öffentlichen Teil des RSA-Schlüssels mit dem Autorisierungstoken \n(d.h. schreibt auf ein Papier die zufällige Abstimmungsnummer \nund legt es zusammen mit einem Kohlepapier in einen versiegelten Umschlag,\n auf dem außen das Autorisierungstoken steht)
Note left of Vvvote_Server: prüft, ob für das Autorisierungstoken bereits ein Wahlschein unterschrieben wurde
Vvvote_Server->Votezilla_Portal: fragt Stimmberechtigung mit Autorisierungstoken ab
Note left of Vvvote_Server: unterschreibt blind den zufälligen RSA-Schlüssel
Vvvote_Server->Vvvote_Client: sendet blinde Unterschrift
Note right of Vvvote_Client: * entblindet die Unterschrift des Servers (d.h. öffnet den versigelten Umschlag)
Vvvote_Client->Mitglied: speichert den Wahlschein
Note right of Mitglied: wartet bis Anonymisierungsfrist abgelaufen ist
Mitglied->Vvvote_Client: Trifft die Abstimmungsentscheidung
Vvvote_Client->Vvvote_Server: sendet die Stimme, die mit dem erzeugten RSA-Schlüssel unterschrieben ist, und \n* entblindeter Unterschrift des Vvvote-Servers unter dem öffentlichen Teil des erzeugten RSA-Schlüssels
Note right of Votezilla_Portal: wartet bis Abstimmungsende erreicht ist
Votezilla_Portal->Vvvote_Server: ruft die Abstimmungsstatistik ab
Note right of Votezilla_Portal: speichert die Abstimmungsstatistik
Mitglied->Vvvote_Client: Alle Stimmen abrufen
Vvvote_Client->Vvvote_Server: Alle Stimmen abrufen
Note right of Vvvote_Client: kann eigene Stimme markieren\n und Unterschriften aller Stimmen prüfen
```
