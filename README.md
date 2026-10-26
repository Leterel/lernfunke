# Lernfunke – lokal programmieren lernen

Eigenständiger deutscher Prototyp: acht eigene JavaScript-Lektionen, echte
Codeausführung, Tagesstreak und lokale Sicherungen. Keine Konten, Cloud,
Werbung, Laufzeit-Abhängigkeiten oder Serverkosten. Keine fremden Kurse/Assets.

Öffentlicher Quellcode: [Leterel/lernfunke](https://github.com/Leterel/lernfunke).
Aktueller Stand: 0.4.0. Kurzanleitung: [START-HIER.md](START-HIER.md).

## Starten

Node.js 24+ und aktueller Browser erforderlich; auf diesem Rechner vorhanden.

1. Vollständigen Quellenordner entpacken.
2. Unter Windows `START.cmd` doppelt anklicken. Alternativ `npm start` oder
   `node server.mjs` im Ordner ausführen. Kein `npm install` nötig.
3. **http://127.0.0.1:4178/** in Chrome öffnen. Immer dieselbe Adresse und
   dasselbe Browserprofil verwenden: Fortschritt gehört zu dieser Speicheradresse.
4. Lektion lesen, Code bearbeiten und „Code ausführen“ wählen (Strg+Eingabe geht
   ebenfalls). Erste Lösung: `return zahl * 2;`.
5. „Offline bereit“ abwarten. Danach funktionieren Neuladen und Codeausführung
   ohne Internet. Chrome kann die Installation als App anbieten; Installation
   und Store-Veröffentlichung sind noch nicht separat zertifiziert.

Der Startprozess bindet ausschließlich an IPv4-Loopback. Keine Daten werden
hochgeladen. Mit Strg+C beenden. Falls Port 4178 bereits belegt ist, den anderen
lokalen Prozess prüfen. Ein anderer Port ist ein neuer Speicherort: vorher eine
Sicherung exportieren. Keine globale Installation oder Firewall-Freigabe nötig.
Nicht `index.html` direkt öffnen: Module und Service Worker brauchen die lokale URL.

## Umgesetzt

- Zusammenhängender Lernpfad: `return`, Variablen, `if/else`, `for`-Schleifen, Arrays, Texte, Objekte und ein Warenkorb-Abschluss.
  Jede Lektion hat eigene Erklärungen, Beispiele, Aufgabe, Hinweis und vier echte
  Funktionsaufrufe, darunter Null-/Bruchwerte und Entscheidungsgrenzen.
- Freie Lektionwahl, nächste Lektion und dauerhaft gespeicherter Zwischenstand
  pro Lektion. Mehrere Lektionen am selben Tag ergeben nur einen Lerntag.
  Codeentwürfe werden separat pro Lektion lokal gespeichert, auch nach Reload und offline. Nach 400 ms Pause wird gespeichert; „Entwurf speichern“ speichert sofort. Erst die bestätigte Meldung bedeutet abgeschlossen. Fortschritts-Backups enthalten ausschließlich Abschlüsse, keinen Code.
- Opaque-Origin-Sandbox ohne Same-Origin-Berechtigung, darin ein kurzlebiger
  Worker. CSP sperrt Netzwerk. Ein Worker auf dem Hauptorigin wird nicht verwendet.
  Ein-Sekunden-Workerlimit plus äußere Drei-Sekunden-Grenze.
- IndexedDB-Transaktion mit `durability: strict`; Erfolg erst nach `oncomplete`.
  Lektion+lokales Datum bilden den idempotenten Schlüssel, auch über mehrere Tabs.
- Streak, Lerntage und längste Serie. Gestern abgeschlossene Serien bleiben bis
  heute Abend erhalten; ein ausgelassener Tag unterbricht die aktuelle Serie.
- JSON-v2-Export und atomarer Import-Merge, auch für alte v1-Sicherungen.
  Die bestehende IndexedDB-v1 und ursprüngliche Abschluss-ID bleiben erhalten.
  Duplikate zählen einmal; ungültige und
  übergroße Sicherungen werden vor dem Schreiben vollständig abgelehnt.
- Offline-App-Shell inklusive isoliertem Runner, ohne externe Schriften/Assets.

## Daten und Grenzen

Fortschritt liegt ausschließlich im Browserprofil. Privatmodus, Browserreinigung,
Speicherentzug oder Geräteausfall können Daten entfernen. Regelmäßig exportieren.
Import ergänzt, löscht aber nichts. Sicherungen enthalten nur Tagesabschlüsse,
keinen Code oder Kontodaten. Gerätezeit und Sicherungen sind vom Nutzer editierbar:
kein manipulationssicherer Leistungsnachweis und kein anerkanntes Zertifikat.

Acht Lektionen zum Einstieg; englische Kurse, KI-Tutor, Konten, Synchronisierung und native
App sind spätere Arbeit. Die Sandbox ist keine Betriebssystem-VM mit garantierter
RAM-Quote. [SECURITY.md](SECURITY.md) erklärt die Ausführungsgrenzen.

## Prüfen

```powershell
npm test
npm run test:browser
```

Node-Tests brauchen keine Pakete. Für die Browserregressionen einmal `npm ci`

ausführen; Playwright ist für Tests fest versioniert. Die App selbst hat keine
Laufzeit-Abhängigkeiten und braucht weiterhin kein `npm install`.
Chrome wird über den installierten Kanal gefunden. Optional kann `TEST_CHROME`
auf einen konkreten Browserpfad zeigen. Alternativ ohne Installation ein bereits
vorhandenes Playwright-Modul über `PLAYWRIGHT_MODULE` angeben.

Alle Tests benutzen frische Profile, synthetischen Code und temporären Loopback-
Server. Keine privaten Tabs, Dateien oder physischen Geräte. Belege: fünf Node-
Testgruppen im ursprünglichen Stand siehe [VERIFICATION.md](VERIFICATION.md).
Der neue Lernpfad wird mit neun Node-Testgruppen und 31 Chrome-Prüfungen geprüft:
[VERIFICATION-20261025.md](VERIFICATION-20261025.md). Entwurfsspeicherung ab 0.4.0: zehn Node-Testgruppen und acht zusätzliche Chromechecks, siehe [VERIFICATION-20261026.md](VERIFICATION-20261026.md).
