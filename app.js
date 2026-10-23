import {list,complete,exportBackup,importBackup} from './store.js';
import {summary} from './model.js';
import {execute} from './execute.js';
import {lessons} from './curriculum.js';
const $=id=>document.getElementById(id);
const channel=typeof BroadcastChannel==='function'?new BroadcastChannel('lernfunke-updates'):null;
let busy=false,ready=false;
const drafts=new Map();
let selected=lessons.find(lesson=>`#${lesson.id}`===location.hash)||lessons[0];
const lessonButtons=new Map();
for(const [index,lesson] of lessons.entries()){
 const button=document.createElement('button');button.type='button';button.dataset.lesson=lesson.id;
 button.addEventListener('click',()=>selectLesson(lesson));$('lessons').append(button);lessonButtons.set(lesson.id,button);
}
function renderLesson(){
 for(const [id,key] of [['lesson-heading','heading'],['lesson-explanation','explanation'],['lesson-example','example'],['lesson-task','task'],['lesson-hint','hint'],['exercise-title','exercise'],['signature','signature']])$(id).textContent=selected[key];
 $('code').value=drafts.get(selected.id)??selected.starter;
 $('results').replaceChildren();$('celebration').hidden=true;$('lesson-details').open=false;
 $('skip').textContent=selected===lessons.at(-1)?'Zum Lernpfad':'Nächste Lektion';
}
function selectLesson(lesson){
 if(busy)return;
 drafts.set(selected.id,$('code').value);selected=lesson;history.replaceState(null,'',`#${lesson.id}`);renderLesson();
 refresh().then(()=>announce('Lektion gewählt. Lies die Aufgabe und probiere deinen Code aus.')).catch(error=>announce(error.message));
}
renderLesson();
async function refresh(){
 const state=summary(await list());
 $('streak').textContent=state.current;
 $('days').textContent=state.days?`${state.days} ${state.days===1?'Lerntag':'Lerntage'} gespeichert`:'Noch kein Lerntag gespeichert';
 $('best').textContent=`Längste Serie: ${state.longest} ${state.longest===1?'Tag':'Tage'}`;
 const current=state.perLesson[selected.id];
 $('lesson-state').textContent=current.today?'Diese Lektion heute abgeschlossen ✓':current.complete?'Gelernt · heute wiederholen':`Lektion ${lessons.indexOf(selected)+1} / ${lessons.length} · etwa ${selected.minutes} Minuten`;
 $('course-progress').textContent=`${state.completedLessons} von ${lessons.length} Lektionen gelernt. Mehrere Lektionen am selben Tag zählen als ein Lerntag.`;
 for(const [index,lesson] of lessons.entries()){
  const button=lessonButtons.get(lesson.id);button.textContent=`${String(index+1).padStart(2,'0')} · ${lesson.title}${state.perLesson[lesson.id].complete?' ✓':''}`;
  if(lesson===selected)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
 }
}
function setBusy(value){busy=value;$('run').disabled=value||!ready;$('import').disabled=value;for(const button of lessonButtons.values())button.disabled=value;}
function announce(text){$('status').textContent=text;}
async function run(){
 if(busy||!ready)return;
 setBusy(true);$('celebration').hidden=true;$('results').replaceChildren();announce('Dein Code läuft isoliert …');
 try{
  const lesson=selected;
  const result=await execute($('code').value,lesson.id);
  if(result.results?.length){
   const table=document.createElement('table');const caption=document.createElement('caption');caption.textContent=`Vier echte Funktionsaufrufe · ${lesson.title}`;table.append(caption);
   const head=document.createElement('tr');for(const label of ['Eingabe','Erwartet','Dein Ergebnis','Prüfung']){const th=document.createElement('th');th.scope='col';th.textContent=label;head.append(th);}table.append(head);
   for(const row of result.results){const tr=document.createElement('tr');for(const value of [row.input,row.expected,row.actual,row.pass?'✓':'Noch nicht']){const td=document.createElement('td');td.textContent=value;tr.append(td);}table.append(tr);}
   $('results').append(table);
  }
  if(!result.ok){announce(result.error||'Noch nicht ganz. Prüfe die Ergebnisse und versuche es erneut.');return;}
  announce('Alle Tests bestanden. Fortschritt wird sicher gespeichert …');
  await complete(undefined,lesson.id); // Commit MUST precede celebration, button state and success.
  await refresh();channel?.postMessage('changed');
  announce('Gespeichert. Dein Lerntag zählt – auch bei sofortigem Schließen.');
  $('celebration').hidden=false;
 }catch(error){announce(error.message||'Speichern fehlgeschlagen. Bitte noch einmal versuchen.');}
 finally{setBusy(false);}
}
$('run').addEventListener('click',run);
$('code').addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();run();}});
$('skip').addEventListener('click',()=>{
 const next=lessons[lessons.indexOf(selected)+1];
 if(next){selectLesson(next);$('exercise-title').scrollIntoView({block:'start'});$('code').focus();}
 else{$('celebration').hidden=true;announce('Lernpfad geschafft. Du kannst jede Lektion wiederholen. Jeder Tag zählt höchstens einmal.');lessonButtons.get(selected.id).focus();}
});
$('export').addEventListener('click',async()=>{
 try{const data=await exportBackup();const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='lernfunke-fortschritt.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);$('backup-status').textContent='Sicherung erstellt. Bewahre die JSON-Datei an einem sicheren Ort auf.';}
 catch(error){$('backup-status').textContent=error.message;}
});
$('import').addEventListener('change',async event=>{
 const file=event.target.files[0];if(!file||busy)return;
 setBusy(true);
 try{if(file.size>2_000_000)throw Error('Sicherung zu groß (höchstens 2 MB).');const count=await importBackup(await file.text());await refresh();channel?.postMessage('changed');$('backup-status').textContent=`Sicherung atomar ergänzt (${count} Einträge). Vorhandene Lerntage bleiben erhalten.`;}
 catch(error){$('backup-status').textContent=error.message;}
 finally{event.target.value='';setBusy(false);}
});
channel?.addEventListener('message',()=>refresh().catch(error=>announce(error.message)));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh().catch(error=>announce(error.message));});
try{await refresh();ready=true;setBusy(false);announce('Bereit. Ändere den Code und probiere deine Lösung aus.');}
catch(error){announce(error.message);}
if('serviceWorker' in navigator){
 try{
  const registration=await navigator.serviceWorker.register('./sw.js');await navigator.serviceWorker.ready;
  $('offline').textContent='Offline bereit: Diese App ist jetzt in deinem Browser verfügbar – auch ohne Internet. Öffne sie immer unter derselben lokalen Adresse, damit dein Fortschritt erhalten bleibt.';
  registration.addEventListener('updatefound',()=>{$('offline').textContent='Neue App-Version wird vorbereitet. Nach Abschluss bitte neu laden.';});
 }catch{$('offline').textContent='Offline-Cache konnte nicht vorbereitet werden. Bitte über die lokale Startadresse öffnen; Fortschritt bleibt separat gespeichert.';}
}else $('offline').textContent='Dieser Browser unterstützt keinen Offline-Cache. Fortschritt wird trotzdem lokal gespeichert.';
