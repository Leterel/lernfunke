# Lernfunke 0.4.0 starten

1. Das vollständige Quellenpaket in einen eigenen Ordner entpacken.
2. Mit vorhandenem Node.js 24+ unter Windows `START.cmd` doppelklicken.
   Alternativ im Ordner `node server.mjs` starten. Kein npm-Installationsschritt
   für die App nötig. Das Terminal geöffnet lassen.
3. [Lernfunke lokal öffnen](http://127.0.0.1:4178/). Acht eigene deutsche
   Lektionen führen von return über Variablen, Bedingungen und Schleifen zu
   Arrays, Texten, Objekten und einem kleinen Warenkorb.
4. Aufgabe lesen, den Startcode korrigieren und „Code ausführen“ drücken.
   Vier echte Tests zeigen Eingabe, Erwartung und Ergebnis. Erst nach
   erfolgreichem Speichern erscheint die Abschlussbestätigung.
5. Mit „Nächste Lektion“ fortfahren oder oben eine Lektion auswählen.
   Alle Lektionen sind frei zugänglich. Jede hat ihren eigenen Abschluss;
   acht Abschlüsse am selben Tag ergeben trotzdem nur einen Lerntag.

„Offline bereit“ abwarten. Danach funktionieren Neuladen, Aufgabenwechsel und
isolierte Codeausführung auch ohne Internet. Immer dieselbe lokale Adresse,
denselben Port und dasselbe Browserprofil benutzen: Dort liegt der Fortschritt.
Vor Browserreinigung oder Gerätewechsel eine Sicherung exportieren. Alte
v1-Sicherungen sind weiterhin importierbar; neue v2-Sicherungen enthalten alle
Lektionen. Import ergänzt den bestehenden Stand, ohne alte Lerntage zu löschen.
Codeentwürfe werden pro Lektion separat in diesem Browser gespeichert. Nach kurzer Pause oder „Entwurf speichern“ die Bestätigung abwarten, bevor du schließt. Bei noch ungespeichertem Text warnt der Browser vor dem Verlassen. „Auf Startcode zurücksetzen“ ersetzt den Entwurf bewusst durch die Vorlage. Bei gleichzeitig bearbeitenden Tabs bleibt dein Text im Konflikt erhalten: gespeicherte Fassung laden oder den eigenen Entwurf bewusst übernehmen. Browserreinigung kann Entwürfe löschen; sie sind nicht im Fortschritts-Backup enthalten.

Die erste Lösung lautet `return zahl * 2;`. Weitere Lösungen selbst ausprobieren;
jede Aufgabe hat einen aufklappbaren Hinweis. Nicht index.html direkt öffnen,
sondern die lokale Startadresse nutzen. Strg+C im Terminal beendet den Server.

Öffentlicher Quellcode: [Leterel/lernfunke](https://github.com/Leterel/lernfunke).
Kein Konto, kein Hosting, keine KI und keine Kosten pro Nutzung. Eigene kurze
Übungslösungen eingeben; keine fremden Pakete. Der Browser-Sandbox fehlt eine
harte RAM-Quote. Tagesstreak und Backups sind keine Prüfungszertifikate.
Ausführliche Nachweise/Grenzen: README.md, SECURITY.md und VERIFICATION-20261026.md.
