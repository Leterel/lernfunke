import {lessonIds} from './curriculum.js';
export const MAX_DRAFT_BYTES=32768;
let connection;
export function validateDraftCode(lesson,code){
 if(!lessonIds.includes(lesson))throw Error('Unbekannte Lektion.');
 if(typeof code!=='string'||!code.isWellFormed()||new TextEncoder().encode(code).length>MAX_DRAFT_BYTES)throw Error('Entwurf zu groß oder ungültig (höchstens 32 KiB pro Lektion).');
 return code;
}
export function validateDraftRecord(record,lesson){
 if(record===undefined)return null;
 if(!record||typeof record!=='object'||Array.isArray(record)||Object.keys(record).length!==3||!['lesson','code','revision'].every(key=>Object.hasOwn(record,key))||record.lesson!==lesson||!Number.isSafeInteger(record.revision)||record.revision<1)throw Error('Gespeicherter Entwurf ungültig. Dein Text bleibt im Tab erhalten.');
 validateDraftCode(lesson,record.code);return record;
}
function db(){
 return connection??=new Promise((resolve,reject)=>{
  const request=indexedDB.open('lernfunke-drafts',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('drafts',{keyPath:'lesson'});
  request.onsuccess=()=>{request.result.onversionchange=()=>{request.result.close();connection=undefined;};resolve(request.result);};
  request.onerror=()=>{connection=undefined;reject(Error('Entwurfspeicher nicht verfügbar. Dein Text bleibt nur in diesem Tab.'));};
  request.onblocked=()=>{connection=undefined;reject(Error('Entwurfspeicher blockiert. Bitte alte Tabs schließen.'));};
 });
}
export async function loadDraft(lesson){
 if(!lessonIds.includes(lesson))throw Error('Unbekannte Lektion.');
 const database=await db();
 return new Promise((resolve,reject)=>{
  const tx=database.transaction('drafts','readonly'),request=tx.objectStore('drafts').get(lesson);
  tx.oncomplete=()=>{try{resolve(validateDraftRecord(request.result,lesson));}catch(error){reject(error);}};
  tx.onerror=tx.onabort=()=>reject(Error('Entwurf konnte nicht gelesen werden.'));
 });
}
export async function saveDraft(lesson,code,expectedRevision,{overwrite=false}={}){
 validateDraftCode(lesson,code);
 if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0)throw Error('Ungültige Entwurfsrevision.');
 const database=await db();
 return new Promise((resolve,reject)=>{
  const tx=database.transaction('drafts','readwrite',{durability:'strict'}),store=tx.objectStore('drafts'),request=store.get(lesson);
  let result,failure;
  request.onsuccess=()=>{
   try{
    let current;try{current=validateDraftRecord(request.result,lesson);}catch(error){if(!overwrite)throw error;current=null;}
    const revision=current?.revision||0;
    if(!overwrite&&revision!==expectedRevision)throw Object.assign(Error('Ein anderer Tab hat einen neueren Entwurf gespeichert. Dein Text bleibt hier erhalten.'),{conflict:true});
    if(revision>=Number.MAX_SAFE_INTEGER)throw Error('Entwurfsrevision ausgeschöpft.');
    result={lesson,code,revision:revision+1};store.put(result);
   }catch(error){failure=error;tx.abort();}
  };
  tx.oncomplete=()=>resolve(result);
  tx.onerror=tx.onabort=()=>reject(failure||Error('Entwurf nicht gespeichert. Dein Text bleibt nur in diesem Tab.'));
 });
}
