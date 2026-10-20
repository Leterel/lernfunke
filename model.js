export const LESSON='js-return-1';
export function localDay(now=new Date()){
 return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
export function validDay(day){
 if(typeof day!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(day))return false;
 const date=new Date(day+'T12:00:00Z');return Number.isFinite(+date)&&date.toISOString().slice(0,10)===day;
}
export function previousDay(day){
 const date=new Date(day+'T12:00:00Z');date.setUTCDate(date.getUTCDate()-1);return date.toISOString().slice(0,10);
}
export function validateEvents(events){
 if(!Array.isArray(events)||events.length>20000)throw Error('Ungültige oder zu große Fortschrittsliste.');
 const unique=new Map();
 for(const event of events){
  if(!event||typeof event!=='object'||event.lesson!==LESSON||!validDay(event.day)||event.id!==`${LESSON}:${event.day}`)
   throw Error('Die Sicherung enthält ungültige Lernabschlüsse.');
  unique.set(event.id,{id:event.id,lesson:LESSON,day:event.day});
 }
 return [...unique.values()].sort((a,b)=>a.id.localeCompare(b.id));
}
export function parseBackup(text){
 if(typeof text!=='string'||text.length>2_000_000)throw Error('Sicherung zu groß (höchstens 2 MB).');
 let data;try{data=JSON.parse(text);}catch{throw Error('Das ist keine gültige JSON-Sicherung.');}
 if(!data||data.format!=='lernfunke-progress'||data.version!==1)throw Error('Unbekanntes Sicherungsformat.');
 return validateEvents(data.events);
}
export function summary(events,today=localDay()){
 const clean=validateEvents(events);const days=new Set(clean.map(e=>e.day));
 let current=0,cursor=days.has(today)?today:previousDay(today);
 while(days.has(cursor)){current++;cursor=previousDay(cursor);}
 let longest=0,run=0,last=null;
 for(const day of [...days].sort()){
  run=last===previousDay(day)?run+1:1;longest=Math.max(longest,run);last=day;
 }
 return {events:clean,days:days.size,current,longest,complete:clean.length>0,today:days.has(today)};
}
