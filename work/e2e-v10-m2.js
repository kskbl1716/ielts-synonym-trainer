'use strict';
/* V10 M2 词书系统专项验证（CDP 驱动本地 Chrome）
   前置：python -m http.server 8000（项目根）+ Chrome --remote-debugging-port=9223 打开 http://localhost:8000/
   用法：node work/e2e-v10-m2.js */
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
    this.ws.onmessage = ev => {
      const obj = JSON.parse(ev.data);
      if(obj.id && this.pending.has(obj.id)){ this.pending.get(obj.id)(obj); this.pending.delete(obj.id); }
    };
  }
  send(method, params){
    const id = ++this.id;
    return new Promise(resolve => {
      this.pending.set(id, resolve);
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
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
  if(!page) throw new Error('no page on localhost:8000');
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
    try { const v = await cdp.eval(expr); const s = v === undefined ? 'undefined' : JSON.stringify(v); results.push([String(s).includes('__EXC__') ? 'FAIL' : 'OK', name + ' => ' + String(s).slice(0, 220)]); }
    catch(e){ results.push(['FAIL', name + ' => ' + e.message]); }
  };

  await T('b1-books-tab', "!!document.querySelector('.tab[data-view=\"books\"]')");
  await T('b2-shelf-render', "(()=>{ [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='books').click(); return document.querySelectorAll('#books-shelf .book-card').length; })()");
  await T('b3-shelf-first-card', "(()=>{ const c=document.querySelector('#books-shelf .book-card'); return c?c.textContent.replace(/\\s+/g,' ').trim().slice(0,60):null; })()");
  await T('b4-detail-open', "(()=>{ const card=document.querySelector('#books-shelf .book-card'); card.click(); return {detail:!document.getElementById('books-detail').classList.contains('hidden'), shelfHidden:document.getElementById('books-shelf').classList.contains('hidden')}; })()");
  await T('b5-detail-cover', "(()=>{ const c=document.querySelector('.book-detail-cover'); return c?c.textContent.replace(/\\s+/g,' ').trim().slice(0,80):null; })()");
  await T('b6-detail-wordlist', "document.querySelectorAll('#book-word-list .book-word-item').length");
  await T('b7-detail-search', "(()=>{ const i=document.getElementById('book-search'); i.value='surge'; i.dispatchEvent(new Event('input',{bubbles:true})); return document.querySelectorAll('#book-word-list .book-word-item').length; })()");
  await T('b8-detail-back', "(()=>{ const b=document.querySelector('[data-book-back]'); b.click(); return {shelf:!document.getElementById('books-shelf').classList.contains('hidden'), detail:document.getElementById('books-detail').classList.contains('hidden')}; })()");
  await T('b9-learn-book-chips', "(()=>{ switchView('learn'); return document.querySelectorAll('#learn-books .chip').length; })()");
  await T('b10-learn-book-filter', "(()=>{ learnBook='default'; renderLearn(); const all=document.querySelectorAll('#learn-list .word-card').length; learnBook='listening'; renderLearn(); return {default:all, listening:document.querySelectorAll('#learn-list .word-card').length, empty:!!document.querySelector('#learn-list .empty')}; })()");
  await T('b11-flash-practice-chips', "(()=>{ switchView('flash'); const f=document.querySelectorAll('#flash-books .chip').length; switchView('practice'); const p=document.querySelectorAll('#p-books .chip').length; return {flash:f, practice:p}; })()");
  await T('b12-modal-book-tags', "(()=>{ openWordDetail('important'); const tags=document.querySelectorAll('.wm-books .book-tag'); const txt=tags.length?tags[0].textContent:null; document.getElementById('wm-close').click(); return {count:tags.length, first:txt}; })()");
  await T('b13-modal-tag-jump', "(()=>{ openWordDetail('alleviate'); const tag=document.querySelector('.wm-books .book-tag'); tag.click(); return {book:learnBook, active:document.getElementById('view-learn').classList.contains('active')}; })()");
  await T('b14-stats-book-panel', "(()=>{ switchView('stats'); return {panel:!!document.getElementById('book-progress-panel'), rows:document.querySelectorAll('#book-progress-rows .book-bar').length}; })()");
  await T('b15-settings-book-panel', "(()=>{ switchView('settings'); const rows=document.querySelectorAll('#set-book-src .src-row').length; const ox=document.querySelector('#set-book-src .src-row:last-child'); return {chips:document.querySelectorAll('#set-book .chip').length, srcRows:rows, oxford:ox?ox.textContent.replace(/\\s+/g,' ').trim().slice(0,90):null}; })()");
  await T('b16-settings-book-click', "(()=>{ const chip=document.querySelector('#set-book .chip[data-book=\"default\"]'); chip.click(); return {book:learnBook, flashBook:flashBook, pBook:pBook, saved:sett().book}; })()");
  await T('b17-practice-start-book', "(()=>{ switchView('practice'); pType='mcq'; pCount=5; startPractice(false); return {pracCount:prac.queue.length}; })()");
  await T('b18-no-errors', "JSON.stringify(window.__errs||[])");

  console.log('==== E2E V10-M2 词书系统专项 (' + results.length + ' 项) ====');
  let fail = 0;
  for(const [st, msg] of results){ console.log(st.padEnd(4) + '| ' + msg); if(st === 'FAIL') fail++; }
  console.log('==== FAILS: ' + fail + ' ====');
  cdp.close();
  process.exit(fail);
})().catch(e => { console.error('HARNESS ERROR:', e.message); process.exit(2); });
