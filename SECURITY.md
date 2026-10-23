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
und die Nonce. Parameter und vier numerische Prüffälle werden beim Serverstart
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
