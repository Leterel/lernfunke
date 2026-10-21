# Fortschritt

## 20.10.2026 — Projektidee aufgenommen

Originalzusammenfassung unverändert gesichert; Kernanforderungen und erstes
lokales MVP im README festgehalten. Implementierung und Tests stehen aus.

## 20.10.2026 — Lernfunke 0.1.0 lokal umgesetzt

Eigene deutsche Lektion, echte JavaScript-Ausführung in opaque-Origin-Sandbox mit
kurzlebigem Worker und Netzwerksperre, atomare/idempotente IndexedDB-Abschlüsse vor
Erfolg, lokale Tagesstreaks, Export/Import-Merge und Offline-PWA implementiert.
Keine fremden Kurse, externen Dienste, Laufzeitpakete oder Serverkosten.

Fünf Node-Testgruppen und 21 echte Chrome-Prüfungen bestanden. Dazu gehören
50 konkurrierende Writes über zwei Tabs, Wiederholungsimporte, Reload nach
übersprungener Animation, Speicherfehler ohne Erfolg, Endlosschleifen, Netzwerk-
und Speicherisolation sowie Offline-Ausführung. Desktop/Mobil-Screenshots geprüft.

Ein lokales Quellenpaket mit Startdatei und Nachweisen erstellt. Kein öffentliches
GitHub-Repository, Hosting, physisches Handy oder Zertifikat eingerichtet. Weitere
Lektionen, Englisch, KI, Synchronisierung und native App bleiben separate Arbeit.
Details und ehrliche Grenzen: VERIFICATION.md und SECURITY.md.

## 21.10.2026 — Öffentlich reproduzierbare Tests

Browser-Testabhängigkeit Playwright1.58.2 per package-lock festgelegt. Browserpfad
optional über TEST_CHROME, sonst installierter Chrome-Kanal; kein fest verdrahteter
Nachbarprojektpfad und keine erzwungene Deaktivierung der Browser-Sandbox mehr.
App weiterhin ohne Laufzeitabhängigkeiten. Alle fünf Node-Testgruppen und alle
21 echten Chrome-Prüfungen erneut bestanden. User erlaubt nun GitHub-Veröffentlichung;
Git-Verlauf vor Veröffentlichung auf erkennbare Geheimnisse geprüft (keine Funde).
