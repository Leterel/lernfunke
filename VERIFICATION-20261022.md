# Lernfunke 0.2.0 — vier Lektionen, 22.10.2026

Vier selbstverfasste deutsche Aufgaben mit eigener Erklärung, Beispiel, Hinweis,
Startcode und jeweils vier festen Funktionsprüfungen: Rückgabewerte, Variablen,
Entscheidungen an einer Grenze und Schleifensumme. Lektionwahl, direkte nächste
Lektion, Tab-Codeentwürfe, URL-gebundene Auswahl und dauerhafter Lernpfadstand.

## Datenkompatibilität

Die bestehende IndexedDB-Version 1 und deren `events`-Store werden weiter benutzt.
`js-return-1:YYYY-MM-DD` bleibt unverändert. Neue Lektionen bekommen eigene IDs;
die Tagesstreak zählt weiterhin unterschiedliche lokale Kalendertage.
Sicherungen werden als v2 exportiert. v1-Sicherungen der ersten Lektion werden
vollständig validiert und atomar ergänzt. Es wird kein alter Abschluss gelöscht.

## Ausführung und Sicherheit

Unveränderte opaque-Origin-/Blob-Worker-Isolation, privater MessageChannel,
Nonce, CSP-Netzwerksperre und Laufzeitgrenzen. Der Server bettet nur die eigenen
Fixtures aus curriculum.js in die gehashte Runner-Vorlage ein; übermittelte
Testdefinitionen werden ignoriert. Jeder Versuch hat neue Sandbox und Worker.
Details und weiterhin bestehende RAM-/Browsergrenzen: SECURITY.md.

## Prüfung

Acht Node-Testgruppen: Kalender, DST, Idempotenz, unterbrochene Serien, Zukunftstage,
Importvalidierung, mehrere Lektionen am gleichen Tag, Original-v1-IDs und v2-Merge,
sowie Testgrenzen/noch nicht korrekte Startlösungen.

28 echte Chrome-Browserchecks umfassen:

- Alle vier richtigen Lösungen und aufgabenspezifisch falsche Startlösungen,
  Syntaxfehler und abgebrochene Endlosschleife.
- IndexedDB-, Fetch-, XHR-, WebSocket- und importScripts-Isolation; gefälschte
  globale Nachrichten/Prototypänderungen sowie mitgeschickte Fake-Fixtures.
- Erfolg erst nach Speichercommit; 50 gleichzeitige Schreibversuche aus zwei Tabs,
  Importduplikate, atomar abgelehnte ungültige Sicherung und Speicherfehler.
- Bestehende echte v1-Datenbank vor Erststart, Import einer v1-Sicherung und neuer
  Lektionabschluss: ursprünglicher Abschluss bleibt erhalten.
- v2-Export/-Import aller Lektionen, Neuladen, ausgewählte Lektion und Fortschritt,
  alle vier Aufgaben offline aus der gecachten App-Shell; Tagesstreak bleibt 1.
- Desktop-/Mobilansicht, kein horizontaler Mobilüberlauf und keine App-Pageerrors.

Frische Testprofile, ausschließlich synthetischer Lerncode, Loopbackserver und
vorhandener Chrome. Keine privaten Browserprofile oder physischen Geräte.
Screenshots und maschinenlesbares Ergebnis liegen lokal in `work/verification/`.
Die Tests sind kein Nachweis für jeden Browser, eine RAM-Quote, App-Installation,
Storefreigabe oder ein anerkanntes Zertifikat. Aufgaben prüfen Verhalten, keinen
vorgeschriebenen Algorithmus.
