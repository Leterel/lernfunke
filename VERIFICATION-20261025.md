# Lernfunke 0.3.0 — acht eigene Lektionen, 25.10.2026

Der Lernpfad enthält acht aufeinander aufbauende deutsche JavaScript-Aufgaben:
Rückgabewerte, Variablen, Entscheidungen, Schleifen, Zahlenlisten, Textmethoden,
Objekteigenschaften und einen Warenkorb mit Versandgrenze. Jede Lektion enthält
Erklärung, Beispiel, Aufgabe, Startcode, Hinweis und vier feste Funktionsprüfungen.

## Neue Aufgabentypen

Arrays und Objekte werden als vertrauenswürdige eingebettete JSON-Fixtures an
den isolierten Worker übergeben. Erwartet werden primitive Zahlen oder Texte;
Object.is prüft weiterhin das Ergebnis. Die Anzeige der Eingabedaten wird bereits
vor Ausführung des Lerncodes erzeugt; eine Mutation des übergebenen Arrays kann
sie nicht umschreiben. Zurückgegebene Strings werden als Text angezeigt, kein HTML.
Sandbox, eigener MessageChannel, CSP-Sperren und Zeitlimits bleiben bestehen.

## Daten und Offlinebetrieb

Die ersten vier Lesson-IDs und die IndexedDB-Version 1 bleiben unverändert.
Bestehende v1- und v2-Sicherungen bleiben importierbar. Neue Exporte verwenden
weiterhin das v2-Format mit den bekannten Abschlussdaten. Alle acht Abschlüsse
an einem Tag ergeben einen Lerntag. Codeentwürfe bleiben nur im offenen Tab.
Der App-Shell-Cache ist auf v3 erhöht; IndexedDB wird beim Cachewechsel nicht gelöscht.

## Nachweise

- 9/9 Node-Testgruppen: Datums-/DST-Grenzen, Serien, Idempotenz, Importvalidierung,
  acht Lektionen an einem Tag, ursprüngliche IDs, bestehende Vier-Lektionen-v2-
  Sicherung und neue strukturierte Fixtures mit Grenzfällen.
- 31 echte Chrome-Prüfungen: alle acht richtigen Lösungen und falschen Startcodes
  offline; Ausführung der Warenkorb-Abschlussaufgabe mit tatsächlicher Tabelle;
  v2-Merge aller acht Abschlüsse, vorhandene IndexedDB v1 und v1-Backup ohne Verlust.
- Isolationsprüfungen für IndexedDB, Fetch, XHR, WebSocket und importScripts;
  gefälschte globale Nachrichten, Prototypänderungen und fremde Testdefinitionen
  können keinen falschen Erfolg erzeugen. Endlosschleife wird beendet.
- 50 gleichzeitige Schreibversuche, Erfolg erst nach Commit, Speicherfehler ohne
  Teilfortschritt, Import/Download per UI und Reload mit Lektionwahl bleiben geprüft.
- Mutiertes Array verändert die angezeigten Fixturewerte nicht. Ein tatsächlicher
  String-Rückgabewert erscheint korrekt in der Ergebniszelle.
- Desktop und 390px-Layout einschließlich strukturierter Ergebnistabelle ohne
  horizontalen Überlauf; keine unbehandelten App-Fehler. Screenshots visuell geprüft.

Verwendet wurden frische Chromeprofile, synthetischer Übungscode und ein eigener
Loopbackserver. Keine privaten Browserprofile, externen Dienste oder physischen
Geräte. Browserbelege liegen lokal unter work/verification. Keine harte RAM-Quote,
keine Garantie gegen Browserlücken, kein Vollkurs und kein Prüfungszertifikat.

Reproduktion: npm test; nach npm ci mit installiertem Chrome npm run test:browser.
PLAYWRIGHT_MODULE beziehungsweise TEST_CHROME können vorhandene Testwerkzeuge angeben.
Die App selbst braucht keine Laufzeitpakete oder npm-Installation.
