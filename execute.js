import {lessonIds} from './curriculum.js';
export async function execute(code,lesson=lessonIds[0]){
 if(!lessonIds.includes(lesson))return {ok:false,error:'Unbekannte Lektion.'};
 // Fetch through the parent's service worker, then create an opaque srcdoc.
 // Opaque-origin iframe navigations cannot rely on a same-origin offline SW.
 let runner;
 try {const response=await fetch('./runner.html');if(!response.ok)throw Error();runner=await response.text();}
 catch{return {ok:false,error:'Die isolierte Ausführung ist offline noch nicht vorbereitet.'};}

 return new Promise(resolve=>{
  if(typeof code!=='string'||code.length>20000){resolve({ok:false,error:'Code zu groß (höchstens 20.000 Zeichen).'});return;}
  const frame=document.createElement('iframe');
  frame.setAttribute('sandbox','allow-scripts');frame.hidden=true;frame.srcdoc=runner;frame.title='Isolierte Codeausführung';
  const nonce=crypto.randomUUID();const channel=new MessageChannel();let done=false;
  const finish=result=>{if(done)return;done=true;clearTimeout(deadline);channel.port1.close();frame.remove();resolve(result);};
  const deadline=setTimeout(()=>finish({ok:false,error:'Zeitlimit erreicht. Prüfe deinen Code auf Endlosschleifen.'}),3000);
  channel.port1.onmessage=({data})=>{
   if(data?.nonce!==nonce||data.lesson!==lesson)return;
   if(typeof data.ok!=='boolean'||typeof data.error!=='string'||!Array.isArray(data.results))return;
   finish({ok:data.ok,error:data.error.slice(0,500),results:data.results.slice(0,4).map(r=>({input:r.input,expected:r.expected,actual:String(r.actual).slice(0,100),pass:r.pass===true}))});
  };
  frame.onload=()=>frame.contentWindow.postMessage({type:'run',nonce,code,lesson},'*',[channel.port2]);
  frame.onerror=()=>finish({ok:false,error:'Die isolierte Ausführung ist nicht verfügbar.'});
  document.body.append(frame);
 });
}
