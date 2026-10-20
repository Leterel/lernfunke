import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname} from 'node:path';
const root=fileURLToPath(new URL('.',import.meta.url));
const files=new Set(['index.html','app.js','store.js','model.js','execute.js','runner.html','styles.css','sw.js','manifest.webmanifest','icon.svg']);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const sandbox="sandbox allow-scripts; default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'";
export async function serve(port=4178){
 const runner=await readFile(resolve(root,'runner.html'),'utf8');
 const runnerScript=runner.match(/<script>([\s\S]*?)<\/script>/)[1];
 const runnerHash=createHash('sha256').update(runnerScript).digest('base64');
 const server=createServer(async(req,res)=>{
  // Bind only to IPv4 loopback and reject foreign Host headers (DNS rebinding).
  if(!/^127\.0\.0\.1:\d+$/.test(req.headers.host||'')){res.writeHead(403);return res.end('Nur lokal erreichbar.');}
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end();}
  let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html';}catch{res.writeHead(400);return res.end();}
  if(!files.has(name)){res.writeHead(404);return res.end('Nicht gefunden.');}
  try{
   const data=await readFile(resolve(root,name));
   res.writeHead(200,{'Content-Type':`${types[extname(name)]||'application/octet-stream'}; charset=utf-8`,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':name==='runner.html'?sandbox:`default-src 'self'; script-src 'self' 'sha256-${runnerHash}' 'unsafe-eval'; style-src 'self'; img-src 'self'; connect-src 'self'; frame-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`});
   res.end(req.method==='HEAD'?undefined:data);
  }catch{res.writeHead(500);res.end('Datei konnte nicht gelesen werden.');}
 });
 return new Promise(resolve=>server.listen(port,'127.0.0.1',()=>resolve(server)));
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const port=Number(process.env.PORT||4178);
 const server=await serve(port);console.log(`Lernfunke: http://127.0.0.1:${server.address().port} (Beenden: Strg+C)`);
}
