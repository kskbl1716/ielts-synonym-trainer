'use strict';
/* V10 M5-1a listening 词条接入专项验证（CDP）
   前置：本地服务器 8000 + Chrome 9223
   用法：node work/e2e-v10-m5a.js */
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

  await T('l1-total-words', "WORDS.length");
  await T('l2-listening-count', "bookWords('listening').length");
  await T('l3-learn-filter', "(()=>{ learnBook='listening'; learnZone='all'; learnTopic='all'; renderLearn(); return {cards:document.querySelectorAll('#learn-list .word-card').length, first:document.querySelector('#learn-list .wc-word')?document.querySelector('#learn-list .wc-word').textContent:null}; })()");
  await T('l4-book-detail', "(()=>{ openBookDetail('listening'); return {detail:!document.getElementById('books-detail').classList.contains('hidden'), words:document.querySelectorAll('#book-word-list .book-word-item').length}; })()");
  await T('l5-detail-search', "(()=>{ const i=document.getElementById('book-search'); i.value='absence'; i.dispatchEvent(new Event('input',{bubbles:true})); return document.querySelectorAll('#book-word-list .book-word-item').length; })()");
  await T('l6-flash-pool', "(()=>{ flashBook='listening'; flashTopic='all'; flashZone='all'; startFlash(); return {list:flash.list.length}; })()");
  await T('l7-recite-setup', "(()=>{ openBookDetail('listening'); document.getElementById('book-recite-btn').click(); const s=document.querySelector('#book-recite .br-setup'); return s? s.textContent.replace(/\\s+/g,' ').includes('共 821 词') : false; })()");
  await T('l8-stats-panel', "(()=>{ switchView('stats'); const rows=[...document.querySelectorAll('#book-progress-rows .book-bar')]; const l=rows.find(r=>r.textContent.includes('听力拼写')); return l?l.textContent.replace(/\\s+/g,' ').trim().slice(0,60):null; })()");
  await T('l9-modal-booktag', "(()=>{ const w=bookWords('listening')[0]; openWordDetail(w.w); const t=document.querySelector('.wm-books .book-tag'); const txt=t?t.textContent:null; document.getElementById('wm-close').click(); return {tag:txt}; })()");
  await T('l10-no-errors', "JSON.stringify(window.__errs||[])");

  console.log('==== E2E V10-M5a listening 专项 (' + results.length + ' 项) ====');
  let fail = 0;
  for(const [st, msg] of results){ console.log(st.padEnd(4) + '| ' + msg); if(st === 'FAIL') fail++; }
  console.log('==== FAILS: ' + fail + ' ====');
  cdp.close();
  process.exit(fail);
})().catch(e => { console.error('HARNESS ERROR:', e.message); process.exit(2); });
