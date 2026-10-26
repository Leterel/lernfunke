# Lernfunke 0.4.0 — Prüfung 26.10.2026

10/10 Node-Testgruppen bestanden. Die bestehende vollständige Browserregression
besteht unverändert 31/31 Chromechecks: acht Offline-Lektionen, echte isolierte
Ausführung, Zeitlimit/Netz-/Speicherisolation, Fixture-Spoofingabwehr, alte v1-DB
und v1/v2-Backups, konkurrierende Fortschrittswrites, String-/Arrayanzeige und
390px-Layout.

Zusätzlich bestehen acht echte Chrome-Entwurfschecks (tests/browser-drafts.mjs):

- Manueller und verzögerter Speichercommit je Lektion, tatsächlicher Reload.
- Cache-Offline-Neuladen, Entwurfswiederherstellung und neuer Offline-Commit.
- Zwei Tabs: aktiver Text bleibt erhalten, stale Revision wird abgelehnt;
  gespeicherte Fassung und bewusste Übernahme funktionieren.
- 20 konkurrierende Schreibversuche mit gleicher Revision: genau ein Commit,
  19 Konflikte. Prüfung findet in derselben IndexedDB-Schreibtransaktion statt.
- Startcode-Reset bleibt nach Reload erhalten; mehr als 32 KiB verändert keinen
  vorhandenen gespeicherten Entwurf.
- Ungültiger persistierter Record wird abgelehnt und nur durch bewussten Reset
  der betroffenen Lektion repariert.
- Verweigerter Entwurfspeicher bewahrt den Text im Tab und verhindert keine
  separate Fortschritts-Datenbank. Kein Abschluss wird durch Entwürfe verbucht.
- Fortschritts-Export enthält keinen Code; Desktop/Mobil ohne horizontalen
  Überlauf oder unbehandelte App-Fehler. Screenshots visuell geprüft.

Ein Server ausschließlich auf Loopback, frische Chromeprofile und synthetischer
Übungscode. Keine physischen Geräte, privaten Browserprofile oder fremden Dateien.
Bekannte Browser-/RAM-Grenzen unverändert: SECURITY.md. Bestätigten Commit vor
Schließen abwarten; Warnungen des Browsers sind keine Speicher-Garantie.

Reproduktion: npm test, npm run test:browser, node tests/browser-drafts.mjs.
Browsertests brauchen npm ci / Playwright und installiertes Chrome. Alternativ
PLAYWRIGHT_MODULE auf ein vorhandenes index.mjs setzen. Zum Appstart braucht es
keine npm-Pakete. Screenshots/JSON lokal unter work/draft-verification/.
