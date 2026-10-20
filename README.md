# Lernfunke – lokal programmieren lernen

Eigenständiger deutscher Prototyp: eine eigene JavaScript-Lektion, echte
Codeausführung, Tagesstreak und lokale Sicherungen. Keine Konten, Cloud,
Werbung, Laufzeit-Abhängigkeiten oder Serverkosten. Keine fremden Kurse/Assets.

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

- Eigene kurze Lektion über Parameter und `return`, vier echte Funktionsaufrufe
  mit positiven/negativen Zahlen, null und einem Bruchwert.
- Opaque-Origin-Sandbox ohne Same-Origin-Berechtigung, darin ein kurzlebiger
  Worker. CSP sperrt Netzwerk. Ein Worker auf dem Hauptorigin wird nicht verwendet.
  Ein-Sekunden-Workerlimit plus äußere Drei-Sekunden-Grenze.
- IndexedDB-Transaktion mit `durability: strict`; Erfolg erst nach `oncomplete`.
  Lektion+lokales Datum bilden den idempotenten Schlüssel, auch über mehrere Tabs.
- Streak, Lerntage und längste Serie. Gestern abgeschlossene Serien bleiben bis
  heute Abend erhalten; ein ausgelassener Tag unterbricht die aktuelle Serie.
- JSON-Export und atomarer Import-Merge. Duplikate zählen einmal; ungültige und
  übergroße Sicherungen werden vor dem Schreiben vollständig abgelehnt.
- Offline-App-Shell inklusive isoliertem Runner, ohne externe Schriften/Assets.

## Daten und Grenzen

Fortschritt liegt ausschließlich im Browserprofil. Privatmodus, Browserreinigung,
Speicherentzug oder Geräteausfall können Daten entfernen. Regelmäßig exportieren.
Import ergänzt, löscht aber nichts. Sicherungen enthalten nur Tagesabschlüsse,
keinen Code oder Kontodaten. Gerätezeit und Sicherungen sind vom Nutzer editierbar:
kein manipulationssicherer Leistungsnachweis und kein anerkanntes Zertifikat.

Genau eine Lektion; englische Kurse, KI-Tutor, Konten, Synchronisierung und native
App sind spätere Arbeit. Die Sandbox ist keine Betriebssystem-VM mit garantierter
RAM-Quote. [SECURITY.md](SECURITY.md) erklärt die Ausführungsgrenzen.

## Prüfen

```powershell
npm test
npm run test:browser
```

Node-Tests brauchen keine Pakete. Browserregressionen verwenden vorhandenes
Playwright aus dem benachbarten SofaFunk-Projekt und Chrome unter
`C:\Program Files\Google\Chrome\Application\chrome.exe`. Bei separat entpackten
Quellen den vorhandenen Playwright-Modulpfad setzen:

```powershell
$env:PLAYWRIGHT_MODULE = 'C:\Pfad\zu\playwright\index.mjs'
npm run test:browser
```

Alle Tests benutzen frische Profile, synthetischen Code und temporären Loopback-
Server. Keine privaten Tabs, Dateien oder physischen Geräte. Belege: fünf Node-
Testgruppen und 21 echte Chrome-Prüfungen, siehe [VERIFICATION.md](VERIFICATION.md).
