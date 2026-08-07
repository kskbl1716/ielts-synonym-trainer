'use strict';
/* V10 M5-6 oxford 批次1 专项验证（CDP）
   前置：本地服务器 8000 + Chrome 9223
   用法：node work/e2e-v10-m5h.js */
const fs = require('fs');
const path = require('path');
const BASE = 'http://127.0.0.1:9223';
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
  await cdp.eval("window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message))); true");
  const results = [];
  const T = async (name, expr) => {
    try { const v = await cdp.eval(expr); const s = v === undefined ? 'undefined' : JSON.stringify(v); results.push([String(s).includes('__EXC__') ? 'FAIL' : 'OK', name + ' => ' + String(s).slice(0, 200)]); }
    catch(e){ results.push(['FAIL', name + ' => ' + e.message]); }
  };

  await T('o1-total', "WORDS.length");
  await T('o2-oxford-count', "bookWords('oxford').length");
  await T('o3-basic-present', "(()=>{ const ws=bookWords('oxford'); return {able:ws.some(x=>x.w==='able'), phrase:ws.some(x=>x.w==='according to'), everyday:ws.some(x=>x.w==='ice cream')}; })()");
  await T('o4-learn-filter', "(()=>{ learnBook='oxford'; learnZone='all'; learnTopic='all'; renderLearn(); return document.querySelectorAll('#learn-list .word-card').length; })()");
  await T('o5-detail', "(()=>{ openBookDetail('oxford'); return {words:document.querySelectorAll('#book-word-list .book-word-item').length, cover:document.querySelector('.book-detail-cover').textContent.replace(/\\s+/g,' ').slice(0,60)}; })()");
  await T('o6-detail-search', "(()=>{ const i=document.getElementById('book-search'); i.value='according to'; i.dispatchEvent(new Event('input',{bubbles:true})); return document.querySelectorAll('#book-word-list .book-word-item').length; })()");
  await T('o7-flash-pool', "(()=>{ flashBook='oxford'; flashZone='all'; flashTopic='all'; startFlash(); return flash.list.length; })()");
  await T('o8-recitation', "(()=>{ openBookDetail('oxford'); document.getElementById('book-recite-btn').click(); const s=document.querySelector('#book-recite .br-setup'); return s? s.textContent.replace(/\\s+/g,' ').includes('共 500 词') : false; })()");
  await T('o9-shelf', "(()=>{ switchView('books'); const card=[...document.querySelectorAll('#books-shelf .book-card')].find(c=>c.textContent.includes('牛津基础')); return card?card.textContent.replace(/\\s+/g,' ').slice(0,40):null; })()");
  await T('o10-settings-oup', "(()=>{ switchView('settings'); const ox=document.querySelector('#set-book-src .src-row:last-child'); return ox?ox.textContent.replace(/\\s+/g,' ').includes('牛津 3000 词表版权归 Oxford University Press') : null; })()");
  await T('o11-no-errors', "JSON.stringify(window.__errs||[])");

  console.log('==== E2E V10-M5h oxford 批次1 (' + results.length + ' 项) ====');
  let fail = 0;
  for(const [st, msg] of results){ console.log(st.padEnd(4) + '| ' + msg); if(st === 'FAIL') fail++; }
  console.log('==== FAILS: ' + fail + ' ====');
  cdp.close();
  process.exit(fail);
})().catch(e => { console.error('HARNESS ERROR:', e.message); process.exit(2); });
