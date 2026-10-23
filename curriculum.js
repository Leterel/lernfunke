// Self-authored content. Only trusted numeric fixtures enter the isolated runner.
export const lessons = [
 {id:'js-return-1',title:'Werte zurückgeben',minutes:5,heading:'Eine kleine Maschine für Zahlen',
  explanation:'Eine Funktion erhält eine Eingabe und liefert mit return ein Ergebnis zurück. Der Parameter zahl ist ein Name für die Eingabe. Rechnen funktioniert damit auch bei null, negativen Zahlen und Brüchen.',
  example:'function plusEins(zahl) {\n  return zahl + 1;\n}\n\nplusEins(4); // 5',
  task:'Verdopple zahl und gib das Ergebnis zurück. Schreibe nur den Funktionskörper. Beispiele: 3 → 6 und −4 → −8.',
  hint:'Nach return steht dein Rechenausdruck. Mit * multiplizierst du die Eingabe mit zwei; ein Semikolon beendet die Anweisung.',
  exercise:'Mach die Eingabe doppelt',signature:'function verdoppeln(zahl) {',starter:'return zahl;',parameter:'zahl',cases:[[3,6],[0,0],[-4,-8],[1.5,3]]},
 {id:'js-variables-1',title:'Mit Variablen rechnen',minutes:6,heading:'Gib einem Wert einen Namen',
  explanation:'const legt einen Namen für einen Wert an, der nicht neu zugewiesen wird. let verwendest du, wenn der Wert später geändert werden soll. Ein sprechender Name erklärt, wofür eine Zahl gebraucht wird.',
  example:'function stundenInMinuten(stunden) {\n  const minutenProStunde = 60;\n  return stunden * minutenProStunde;\n}\n\nstundenInMinuten(2); // 120',
  task:'Rechne minuten in Sekunden um. Lege dafür eine Konstante sekundenProMinute mit dem Wert 60 an und gib das Produkt zurück. Auch eine halbe Minute hat Sekunden.',
  hint:'const sekundenProMinute = 60; legt den Umrechnungsfaktor fest. Danach multiplizierst du minuten damit und gibst das Ergebnis zurück.',
  exercise:'Aus Minuten werden Sekunden',signature:'function inSekunden(minuten) {',starter:'const sekundenProMinute = 60;\nreturn minuten;',parameter:'minuten',cases:[[2,120],[0,0],[1.5,90],[10,600]]},
 {id:'js-conditions-1',title:'Entscheidungen treffen',minutes:7,heading:'Zwei Wege, ein Ergebnis',
  explanation:'if prüft eine Bedingung. Ist sie wahr, läuft der erste Block; sonst der else-Block. >= bedeutet größer oder gleich. Achte auf die Grenze: „ab 50“ schließt genau 50 ein.',
  example:'function eintritt(alter) {\n  if (alter < 6) {\n    return 0;\n  } else {\n    return 8;\n  }\n}',
  task:'Gib die Versandkosten zurück: Ab einem kaufwert von 50 sind es 0, darunter 5. Verwende if und else. Beispiele: 20 → 5, genau 50 → 0.',
  hint:'Prüfe kaufwert >= 50. Gib im ersten Block 0 und im anderen Block 5 zurück. Die Eingabe ist hier eine nichtnegative Zahl.',
  exercise:'Versandkosten an der Grenze',signature:'function versand(kaufwert) {',starter:'if (kaufwert > 50) {\n  return 0;\n} else {\n  return 5;\n}',parameter:'kaufwert',cases:[[0,5],[49.99,5],[50,0],[80,0]]},
 {id:'js-loops-1',title:'Schrittweise aufsummieren',minutes:8,heading:'Wiederholen mit einem Zähler',
  explanation:'Eine for-Schleife hat Startwert, Bedingung und nächsten Schritt. Mit let kann ein Zähler wachsen. += addiert zum bisherigen Wert. Prüfe vor jedem Durchlauf die Bedingung, damit die Schleife irgendwann endet.',
  example:'function dreimalEins() {\n  let summe = 0;\n  for (let i = 0; i < 3; i++) {\n    summe += 1;\n  }\n  return summe; // 3\n}',
  task:'Addiere alle ganzen Zahlen von 1 bis einschließlich anzahl. Bei 4 ist das 1 + 2 + 3 + 4 = 10. Bei 0 bleibt die Summe 0. Die Eingabe ist eine nichtnegative ganze Zahl.',
  hint:'Starte summe bei 0 und i bei 1. Solange i <= anzahl gilt, addierst du i zur Summe und erhöhst i. Gib die Summe erst nach der Schleife zurück.',
  exercise:'Die Summe von 1 bis n',signature:'function aufsummieren(anzahl) {',starter:'let summe = 0;\nfor (let i = 1; i < anzahl; i++) {\n  summe += i;\n}\nreturn summe;',parameter:'anzahl',cases:[[0,0],[1,1],[4,10],[10,55]]}
];
export const lessonIds=lessons.map(lesson=>lesson.id);
export const lessonSpecs=Object.fromEntries(lessons.map(({id,parameter,cases})=>[id,{parameter,cases}]));
