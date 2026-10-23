import {LESSON,localDay,validDay,parseBackup,validateEvents} from './model.js';
import {lessonIds} from './curriculum.js';
let connection;
function db(){
 return connection??=new Promise((resolve,reject)=>{
  const request=indexedDB.open('lernfunke-local',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('events',{keyPath:'id'});
  request.onsuccess=()=>{request.result.onversionchange=()=>{request.result.close();connection=undefined;};resolve(request.result);};
  request.onerror=()=>{connection=undefined;reject(Error('Lokaler Speicher nicht verfügbar. Bitte Browser-Speicher erlauben.'));};
  request.onblocked=()=>reject(Error('Ein anderer Tab blockiert den Speicher. Bitte alte Tabs schließen.'));
 });
}
// Resolve only after transaction.oncomplete, never after an individual put.
// All tabs serialize writes through the same IndexedDB object-store transaction.
async function transaction(mode,operation){
 const database=await db();
 return new Promise((resolve,reject)=>{
  let tx;try{tx=database.transaction('events',mode,{durability:'strict'});}catch(error){reject(error);return;}
  let value;tx.oncomplete=()=>resolve(value);
  tx.onerror=tx.onabort=()=>reject(Error('Fortschritt konnte nicht gespeichert werden. Keine Bestätigung verbucht.'));
  try{value=operation(tx.objectStore('events'));}catch(error){tx.abort();reject(error);}
 });
}
export async function list(){
 let request;await transaction('readonly',store=>{request=store.getAll();});return validateEvents(request.result);
}
export async function complete(day=localDay(),lesson=LESSON){
 if(!validDay(day))throw Error('Ungültiges Tagesdatum.');
 if(!lessonIds.includes(lesson))throw Error('Unbekannte Lektion.');
 const event={id:`${lesson}:${day}`,lesson,day};
 await transaction('readwrite',store=>store.put(event));return event;
}
export async function exportBackup(){
 return JSON.stringify({format:'lernfunke-progress',version:2,events:await list()},null,2);
}
export async function importBackup(text){
 // Validate the entire payload before opening a write transaction. Import merges
 // immutable completion keys; repeated imports cannot erase or double-count days.
 const events=parseBackup(text);
 await transaction('readwrite',store=>{for(const event of events)store.put(event);});
 return events.length;
}
