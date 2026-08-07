'use strict';
/* V10 M5-1b listening 批次B 截图（CDP）
   用法：node work/shot-v10-m5b.js */
const fs = require('fs');
const path = require('path');
const BASE = 'http://127.0.0.1:9223';
const OUT = path.join(__dirname, 'v10-m5b-');
async function getPage(){
  let list = await (await fetch(BASE + '/json')).json();
  let page = list.find(p => p.type === 'page' && p.url.startsWith('http://localhost:8000/'));
  if(!page){
    await fetch(BASE + '/json/new?http://localhost:8000/', { method: 'PUT' });
    await new Promise(r => setTimeout(r, 1500));
    list = await (await fetch(BASE + '/json')).json();
    page = list.find(p => p.type === 'page' && p.url.startsWith('http://localhost:8000/'));
  }
  return page;
}
class CDP {
  constructor(url){ this.ws = new WebSocket(url); this.id = 1000; this.pending = new Map(); }
  async open(){
    await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; });
    this.ws.onmessage = ev => { const obj = JSON.parse(ev.data); if(obj.id && this.pending.has(obj.id)){ this.pending.get(obj.id)(obj); this.pending.delete(obj.id); } };
  }
  send(method, params){
    const id = ++this.id;
    return new Promise(resolve => { this.pending.set(id, resolve); this.ws.send(JSON.stringify({ id, method, params: params || {} })); });
  }
  async eval(expr){
    const res = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    const r = res.result || {};
    if(r.exceptionDetails) return '__EXC__ ' + (r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text);
    return r.result.value;
  }
  async shot(file, expr){
    const v = await this.eval(expr);
    if(String(v).includes('__EXC__')){ console.log('shot FAIL:', file, v); return; }
    await new Promise(r => setTimeout(r, 800));
    const cap = await this.send('Page.captureScreenshot', { format: 'png' });
    const b64 = (cap.result && cap.result.data) || '';
    fs.writeFileSync(OUT + file, Buffer.from(b64, 'base64'));
    console.log('shot:', file, b64 ? Buffer.from(b64,'base64').length + ' bytes' : 'EMPTY');
  }
  close(){ try{ this.ws.close(); }catch(e){} }
}
(async () => {
  const page = await getPage();
  const cdp = new CDP(page.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send('Network.enable');
  await cdp.send('Page.enable');
  await cdp.send('Network.setBlockedURLs', { urls: ['*://cdn.jsdelivr.net/*', '*jsdelivr*', '*supabase.co/*'] });
  const mock = fs.readFileSync(path.join(__dirname, 'mock-supa.js'), 'utf8');
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: mock });
  await cdp.eval("localStorage.clear(); location.reload(); true");
  await new Promise(r => setTimeout(r, 2500));

  await cdp.shot('01-listening-detail.png', "(()=>{ switchView('books'); openBookDetail('listening'); return true; })()");
  await cdp.shot('02-learn-filter.png', "(()=>{ learnBook='listening'; learnZone='all'; learnTopic='all'; switchView('learn'); renderLearn(); return true; })()");
  await cdp.shot('03-flash-setup.png', "(()=>{ flashBook='listening'; switchView('flash'); renderFlashSetup(); return true; })()");

  cdp.close();
})().catch(e => { console.error('SHOT ERROR:', e.message); process.exit(2); });
