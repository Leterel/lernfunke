import {list,complete,exportBackup,importBackup} from './store.js';
import {summary} from './model.js';
import {execute} from './execute.js';
const $=id=>document.getElementById(id);
const channel=typeof BroadcastChannel==='function'?new BroadcastChannel('lernfunke-updates'):null;
let busy=false,ready=false;
async function refresh(){
 const state=summary(await list());
 $('streak').textContent=state.current;
 $('days').textContent=state.days?`${state.days} ${state.days===1?'Lerntag':'Lerntage'} gespeichert`:'Noch kein Lerntag gespeichert';
 $('best').textContent=`Längste Serie: ${state.longest} ${state.longest===1?'Tag':'Tage'}`;
 $('lesson-state').textContent=state.today?'Heute abgeschlossen ✓':state.complete?'Gelernt · heute wiederholen':'01 / 01 · etwa 5 Minuten';
}
function setBusy(value){busy=value;$('run').disabled=value||!ready;$('import').disabled=value;}
function announce(text){$('status').textContent=text;}
async function run(){
 if(busy||!ready)return;
 setBusy(true);$('celebration').hidden=true;$('results').replaceChildren();announce('Dein Code läuft isoliert …');
 try{
  const result=await execute($('code').value);
  if(result.results?.length){
   const table=document.createElement('table');const caption=document.createElement('caption');caption.textContent='Vier echte Funktionsaufrufe';table.append(caption);
   const head=document.createElement('tr');for(const label of ['Eingabe','Erwartet','Dein Ergebnis','Prüfung']){const th=document.createElement('th');th.scope='col';th.textContent=label;head.append(th);}table.append(head);
   for(const row of result.results){const tr=document.createElement('tr');for(const value of [row.input,row.expected,row.actual,row.pass?'✓':'Noch nicht']){const td=document.createElement('td');td.textContent=value;tr.append(td);}table.append(tr);}
   $('results').append(table);
  }
  if(!result.ok){announce(result.error||'Noch nicht ganz. Prüfe die Ergebnisse und versuche es erneut.');return;}
  announce('Alle Tests bestanden. Fortschritt wird sicher gespeichert …');
  await complete(); // Commit MUST precede celebration, button state and success.
  await refresh();channel?.postMessage('changed');
  announce('Gespeichert. Dein Lerntag zählt – auch bei sofortigem Schließen.');
  $('celebration').hidden=false;
 }catch(error){announce(error.message||'Speichern fehlgeschlagen. Bitte noch einmal versuchen.');}
 finally{setBusy(false);}
}
$('run').addEventListener('click',run);
$('code').addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();run();}});
$('skip').addEventListener('click',()=>{$('celebration').hidden=true;announce('Du kannst die Aufgabe beliebig oft wiederholen. Jeder Tag zählt höchstens einmal.');$('code').focus();});
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
