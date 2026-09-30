'use strict';
/* V10 M4 哈希路由截图（CDP 驱动本地 Chrome，左上角叠加当前 hash 角标）
   用法：node work/shot-v10-m4.js */
const fs = require('fs');
const path = require('path');
const BASE = 'http://127.0.0.1:9223';
const OUT = path.join(__dirname, 'v10-m4-');

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
    await new Promise(r => setTimeout(r, 700));
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
  // 叠加 hash 角标
  await cdp.eval("(()=>{ const ov=document.createElement('div'); ov.id='hash-ov'; ov.style.cssText='position:fixed;top:8px;left:8px;z-index:99999;background:#0d1117;color:#3fb950;font:12px Consolas,monospace;padding:4px 10px;border-radius:4px;border:1px solid #30363d'; document.body.appendChild(ov); const upd=()=>{ ov.textContent='URL: '+(location.hash||'(no hash)') }; window.addEventListener('hashchange',upd); upd(); return true; })()");

  await cdp.shot('01-home.png', "location.hash='#/home'; true");
  await cdp.shot('02-learn.png', "location.hash='#/learn'; true");
  await cdp.shot('03-book-detail.png', "location.hash='#/book/default'; true");
  await cdp.shot('04-stats.png', "location.hash='#/stats'; true");
  await cdp.shot('05-settings.png', "location.hash='#/settings'; true");

  cdp.close();
})().catch(e => { console.error('SHOT ERROR:', e.message); process.exit(2); });
