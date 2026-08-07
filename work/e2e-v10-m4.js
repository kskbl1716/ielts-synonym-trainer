'use strict';
/* V10 M4 哈希路由专项验证（CDP 驱动本地 Chrome）
   前置：python -m http.server 8000 + Chrome --remote-debugging-port=9223 打开 http://localhost:8000/
   用法：node work/e2e-v10-m4.js */
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
const wait = ms => new Promise(r => setTimeout(r, ms));
const tick = () => wait(200);

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
  await wait(2500);
  await cdp.eval("window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message))); true");

  const results = [];
  const T = async (name, expr) => {
    try { const v = await cdp.eval(expr); const s = v === undefined ? 'undefined' : JSON.stringify(v); results.push([String(s).includes('__EXC__') ? 'FAIL' : 'OK', name + ' => ' + String(s).slice(0, 200)]); }
    catch(e){ results.push(['FAIL', name + ' => ' + e.message]); }
  };

  // 初始加载
  await T('r1-initial-home', "(()=>{ const h=(location.hash||'').replace(/^#/,''); const act=document.querySelector('.view.active'); return {hash:h, active:act?act.id:null}; })()");
  // tab 点击 → hash + view
  await T('r2-tab-learn', "(()=>{ [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='learn').click(); return {hash:location.hash, active:document.querySelector('.view.active').id}; })()");
  await T('r3-tab-flash', "(()=>{ [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='flash').click(); return {hash:location.hash, active:document.querySelector('.view.active').id}; })()");
  // 浏览器后退/前进
  await T('r4-history-back', "history.back(); new Promise(r=>setTimeout(r,300)).then(()=>({hash:location.hash, active:document.querySelector('.view.active').id}))");
  await T('r5-history-forward', "history.forward(); new Promise(r=>setTimeout(r,300)).then(()=>({hash:location.hash, active:document.querySelector('.view.active').id}))");
  // 直接改 hash（分享链接）
  await T('r6-hash-stats', "(()=>{ location.hash='#/stats'; return new Promise(r=>setTimeout(r,300)).then(()=>({hash:location.hash, active:document.querySelector('.view.active').id})); })()");
  // 词书深链
  await T('r7-book-deeplink', "(()=>{ location.hash='#/book/default'; return new Promise(r=>setTimeout(r,300)).then(()=>({hash:location.hash, active:document.querySelector('.view.active').id, detail:!document.getElementById('books-detail').classList.contains('hidden'), shelfHidden:document.getElementById('books-shelf').classList.contains('hidden')})); })()");
  await T('r8-book-empty', "(()=>{ location.hash='#/book/zhenjing'; return new Promise(r=>setTimeout(r,300)).then(()=>({detail:!document.getElementById('books-detail').classList.contains('hidden'), words:document.querySelectorAll('#book-word-list .book-word-item').length, empty:!!document.querySelector('#book-word-list .empty')})); })()");
  await T('r9-book-unknown', "(()=>{ location.hash='#/book/no-such-book'; return new Promise(r=>setTimeout(r,300)).then(()=>({shelf:!document.getElementById('books-shelf').classList.contains('hidden'), detailHidden:document.getElementById('books-detail').classList.contains('hidden')})); })()");
  // 详情返回按钮 → 书架 + hash 同步
  await T('r10-detail-back', "(()=>{ location.hash='#/book/default'; return new Promise(r=>setTimeout(r,300)).then(()=>{ document.querySelector('[data-book-back]').click(); return {hash:location.hash, shelf:!document.getElementById('books-shelf').classList.contains('hidden')}; }); })()");
  // 程序化 switchView 同步 URL（replaceState）
  await T('r11-switch-sync', "(()=>{ switchView('practice'); return {hash:location.hash, active:document.querySelector('.view.active').id}; })()");
  // 首页 data-goto 链接同步 URL
  await T('r12-home-goto', "(()=>{ switchView('home'); document.querySelector('#view-home a[data-goto]').click(); return {hash:location.hash, active:document.querySelector('.view.active').id}; })()");
  // 非法 hash 兜底回 home
  await T('r13-bad-hash', "(()=>{ location.hash='#/xyz'; return new Promise(r=>setTimeout(r,300)).then(()=>({hash:location.hash, active:document.querySelector('.view.active').id})); })()");
  // 无 JS 报错
  await T('r14-no-errors', "JSON.stringify(window.__errs||[])");

  console.log('==== E2E V10-M4 哈希路由专项 (' + results.length + ' 项) ====');
  let fail = 0;
  for(const [st, msg] of results){ console.log(st.padEnd(4) + '| ' + msg); if(st === 'FAIL') fail++; }
  console.log('==== FAILS: ' + fail + ' ====');
  cdp.close();
  process.exit(fail);
})().catch(e => { console.error('HARNESS ERROR:', e.message); process.exit(2); });
