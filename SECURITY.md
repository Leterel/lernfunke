# Ausführungsgrenzen

Lerncode wird niemals im App-Fenster oder in einem Worker des App-Origins evaluiert.
Die App lädt ausschließlich ihre eigene Runner-Vorlage und erzeugt ein `srcdoc`-
iframe mit `sandbox="allow-scripts"`, ohne `allow-same-origin`, Popups oder Navigation.
Der Origin ist undurchsichtig. Der Blob-Worker erbt diese Sandbox und Frame-CSP.
Die IndexedDB der App ist damit unerreichbar.

Die Frame-CSP setzt `default-src 'none'` und `connect-src 'none'`; nur der eigene
Inline-Runner und Blob-Worker sind erlaubt. Die Eltern-CSP erlaubt den SHA-256-
Hash des Runner-Inlineskripts, vom lokalen Server aus der Vorlage berechnet.
`unsafe-eval` ist für den isolierten `Function`-Aufruf erforderlich; die App selbst
evaluiert niemals Lerncode. Das Frame schränkt die geerbten Regeln weiter ein.

App und Frame verwenden einen exklusiven MessageChannel mit Zufalls-Nonce. Das
Frame nimmt genau eine Initialisierung vom tatsächlichen Elternfenster und genau
einen Port an. Ergebnisse kommen über einen zweiten privaten MessageChannel.
Sein Port liegt in einer Closure, die der mit `Function` kompilierte Code nicht
erreichen kann. Globale Worker-`postMessage`-Nachrichten zählen nicht als Ergebnis.
Die Oberfläche verwendet `textContent`, niemals `innerHTML` für Lerncode/Fehler.

Ein separater Timer beendet den Worker nach einer Sekunde; die Elternseite räumt
spätestens nach drei Sekunden auf. Endlosschleifen blockieren diese Timer nicht.
Jeder Versuch erhält neue Frames, Worker und Kanäle. Veränderte Prototypen werden
nicht zwischen Versuchen übernommen.

## Lektionen und feste Tests

Der Elternaufruf übermittelt ausschließlich Lerncode, eine bekannte Lektion-ID
und die Nonce. Parameter und vier eigene JSON-Prüffälle werden beim Serverstart
aus dem eigenen `curriculum.js` in die Runner-Vorlage eingebettet und in deren
CSP-Hash einbezogen. Der Service Worker speichert genau diese gerenderte Vorlage.
Der Runner akzeptiert nur eigene IDs (keine geerbten Objektschlüssel) und ignoriert
mitgesendete Tests/Erwartungswerte. Lerncode kann den Fixture-/Ergebniskanal nicht
erreichen. Freie Testdefinitionen aus Nachrichten, Importen oder Nutzercode sind
nicht zugelassen. Die Hauptseite bindet jede Antwort zusätzlich an ihre Lektion-ID.

Die Tests prüfen Funktionsverhalten, keine vorgeschriebene Syntax oder einen
vorgeschriebenen Algorithmus. Der Lernpfad ist kein manipulationssicheres Examen;
die lokalen Fortschrittsdaten bleiben vom Nutzer editierbar.

## Offline-Pfad

Eine Navigation eines opaque-Origin-Frames kann nicht zuverlässig vom Service
Worker des App-Origins offline bedient werden. Deshalb lädt die Elternseite die
gecachte Vorlage und verwendet `srcdoc`. Dafür wird keine Same-Origin-Freigabe
aufgeweicht. Der echte Chrome-Offlinetest deckt diesen Pfad ab.

## Grenzen und Wartung

Keine VM, harte RAM-Quote oder Garantie gegen Browserlücken. Absichtliche
Speicherexplosionen können den Renderer oder Browser beenden. Nur eigene kurze
Übungslösungen eingeben, keine fremden Pakete. Tests belegen konkrete
Netzwerk-/Speichergrenzen in der verwendeten Chrome-Version.

Fortschritt und Gerätezeit sind editierbar: kein vertrauenswürdiger Prüfungsnachweis.
Bei App-Shell-Änderungen den Cache-Namen in `sw.js` erhöhen. Updates löschen nur
alte Lernfunke-Shell-Caches, keine IndexedDB. Netzwerk, `allow-same-origin` und
beliebige externe Skripte nicht in die Sandbox aufnehmen. Isolation und Offline-
Codeausführung nach Änderungen erneut im Browser prüfen.

## Strukturierte Aufgaben ab 0.3.0

Arrays und Objekte stammen ausschließlich aus den eigenen eingebetteten JSON-Fixtures.
Die Eingabeanzeige wird vor der Lerncodeausführung aus diesen Daten erzeugt;
Änderungen an einem übergebenen Array können die angezeigte Testeingabe nicht
verfälschen. Ergebnisse bleiben primitive Zahlen oder Texte; fremde Objekte
werden nicht als HTML oder ausführbarer Code dargestellt. Die bestehenden
Isolationsgrenzen und Zeitlimits gelten weiterhin.

## Lokale Entwürfe ab 0.4.0

Entwürfe liegen in einer getrennten IndexedDB `lernfunke-drafts` Version 1,
Store `drafts`, nur für die acht bekannten Lektionen. Maximal 32 KiB UTF-8 je
Entwurf, gültige Zeichen und vollständig geprüfte Records. Fortschrittsdatenbank
`lernfunke-local` v1, Abschluss-IDs und Fortschrittsbackups bleiben unverändert.
Es gibt keine Übertragung von Code an den lokalen Server oder externe Dienste.

Jeder Schreibvorgang liest und vergleicht die erwartete Revision in derselben
readwrite-Transaktion. Ein inzwischen gespeicherter fremder Tab erzeugt einen
Konflikt statt stillen Überschreibens; aktive Texte werden nicht automatisch
ersetzt. Nur die ausdrücklich beschrifteten Knöpfe laden eine fremde Fassung,
übernehmen den eigenen Entwurf oder setzen auf Startcode zurück. Erfolg wird
erst nach oncomplete gemeldet. Browser-Schließen während eines noch laufenden
Schreibvorgangs garantiert keine Speicherung: Bestätigung abwarten. Es gibt
eine beforeunload-Warnung bei nicht bestätigten Entwürfen; Browser können solche
Dialoge unterdrücken. Fortschrittsbackups enthalten bewusst keinen Nutzercode.
Browserdatenlöschung oder ein anderer Port/Origin trennt auch diese Entwürfe.
