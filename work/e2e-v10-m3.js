'use strict';
/* V10 M3 背诵模式专项验证（CDP 驱动本地 Chrome）
   前置：python -m http.server 8000 + Chrome --remote-debugging-port=9223 打开 http://localhost:8000/
   用法：node work/e2e-v10-m3.js */
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

  await T('m1-recite-entry', "(()=>{ switchView('books'); openBookDetail('default'); document.getElementById('book-recite-btn').click(); return {recite:!document.getElementById('book-recite').classList.contains('hidden'), setup:!!document.querySelector('#book-recite .br-setup'), coverHidden:document.querySelector('.book-detail-cover').classList.contains('hidden')}; })()");
  await T('m2-setup-info', "(()=>{ const s=document.querySelector('#book-recite .br-setup'); return s?s.textContent.replace(/\\s+/g,' ').trim().slice(0,80):null; })()");
  await T('m3-game-start', "(()=>{ beginReciteRound(WORDS.filter(w=>w.b.includes('default')).slice(0,3)); return {game:!!document.querySelector('#book-recite .br-game'), word:document.getElementById('br-word').textContent, pos:document.getElementById('br-pos').textContent}; })()");
  await T('m4-wrong-rep', "(()=>{ document.getElementById('br-no').click(); return {idx:recite.idx, rep:recite.rep.length, wrong:recite.wrong, word:document.getElementById('br-word').textContent}; })()");
  await T('m5-yes', "(()=>{ document.getElementById('br-yes').click(); return {idx:recite.idx, correct:recite.correct}; })()");
  await T('m6-repeat-pass', "(()=>{ document.getElementById('br-yes').click(); return {round:recite.round, poolLen:recite.pool.length, repBadge:document.getElementById('br-rep').textContent}; })()");
  await T('m7-repeat-wrong', "(()=>{ document.getElementById('br-no').click(); return {idx:recite.idx, wrong:recite.wrong, result:!!document.querySelector('#book-recite .br-result')}; })()");
  await T('m8-result-line', "(()=>{ const r=document.getElementById('br-res-line'); return r?r.textContent:null; })()");
  await T('m9-persist', "(()=>{ const b=state.recite.books['default']; return b?JSON.stringify(b):null; })()");
  await T('m10-again', "(()=>{ const again=document.getElementById('br-again'); if(again) again.click(); return {game:!!document.querySelector('#book-recite .br-game'), poolLen:recite.pool.length}; })()");
  await T('m11-all-correct', "(()=>{ document.getElementById('br-yes').click(); return {res:!!document.querySelector('#book-recite .br-result'), line:document.getElementById('br-res-line').textContent, again:!!document.getElementById('br-again')}; })()");
  await T('m12-done', "(()=>{ document.getElementById('br-done').click(); return {reciteHidden:document.getElementById('book-recite').classList.contains('hidden'), coverShown:!document.querySelector('.book-detail-cover').classList.contains('hidden')}; })()");
  await T('m13-empty-book', "(()=>{ openBookDetail('listening'); document.getElementById('book-recite-btn').click(); return {setup:!!document.querySelector('#book-recite .br-setup'), wordlist:document.querySelectorAll('#book-word-list .book-word-item').length}; })()");
  await T('m14-exit-mid', "(()=>{ beginReciteRound(WORDS.filter(w=>w.b.includes('default')).slice(0,2)); document.getElementById('br-exit').click(); return {reciteHidden:document.getElementById('book-recite').classList.contains('hidden')}; })()");
  await T('m15-no-errors', "JSON.stringify(window.__errs||[])");

  console.log('==== E2E V10-M3 背诵模式专项 (' + results.length + ' 项) ====');
  let fail = 0;
  for(const [st, msg] of results){ console.log(st.padEnd(4) + '| ' + msg); if(st === 'FAIL') fail++; }
  console.log('==== FAILS: ' + fail + ' ====');
  cdp.close();
  process.exit(fail);
})().catch(e => { console.error('HARNESS ERROR:', e.message); process.exit(2); });
