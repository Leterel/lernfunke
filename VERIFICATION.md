# Nachweis – 20.10.2026

Windows, Node.js 24.19.0, echtes Chrome 155.0.8059.85 headless, frische Profile.
Keine persönlichen Tabs, privaten Dateien oder physischen Geräte.

`npm test`: **5/5 Testgruppen**. Datumsvalidierung/Schaltjahr, Sommer-/Winterzeit,
Duplikate, gestrige/unterbrochene/längste Serien, Zukunftstage und Sicherungsprüfung.

`npm run test:browser`: **21/21 Prüfungen**:

1. Echte JavaScript-Funktion mit vier Eingaben.
2. Falsche Lösung und Syntaxfehler abgelehnt.
3. Gefälschte globale Worker-Nachrichten und `Array.every`-Manipulation fälschen keinen Erfolg.
4. Endlosschleife durch harten Timeout beendet.
5. Worker-IndexedDB-Zugriff endet mit `SecurityError`.
6. `fetch` ohne Kontakt zum Instrumentierungsserver blockiert.
7. Externes `importScripts` blockiert.
8. WebSocket-Verbindung blockiert.
9. Synchrones HTTP-XHR blockiert.
10. Tagesabschluss vor sichtbarem Erfolg gespeichert; schneller Doppelklick zählt einmal.
11. Erfolg überspringen und vollständig neu laden erhält die Serie.
12. 50 gleichzeitige Writes in zwei Tabs ergeben einen Abschluss.
13. Wiederholter Import ohne Doppelzählung.
14. Ungültiger Import verändert vorhandene Daten nicht.
15. Echter JSON-Download über die Oberfläche.
16. Import in frisches Profil stellt Fortschritt wieder her.
17. Simulierter Schreibfehler erzeugt weder Erfolg noch Teilabschluss.
18. Offline neu laden, Sandbox-Code ausführen und Fortschritt speichern.
19. Ausführungsframes werden anschließend entfernt.
20. 390 × 844 Mobilansicht ohne horizontalen Überlauf.
21. Keine unbehandelten JavaScript-Anwendungsfehler.

Erste Läufe deckten eine falsche synchrone WebSocket-Testannahme und den fehlenden
Offlinepfad für opaque iframe-Navigation auf. Beides wurde korrigiert; der finale
Durchlauf prüft `srcdoc` und den tatsächlichen Serverkontakt.

Finale Ergebnisse und ausschließlich app-eigene Screenshots liegen im Lieferpaket
unter `nachweise/`. Desktop/Mobilansicht wurden visuell geprüft.

Grenzen: keine physische Handy-/Android-/Store- oder PWA-Installationsprüfung,
keine garantierte RAM-Quote. Tageswechsel mit festen Kalenderdaten getestet, nicht
tageweise abgewartet. Belegt sind Transaktionsbestätigung und vollständiges
Tab-Neuladen, keine physische Stromunterbrechung oder universelle Browserfreigabe.
