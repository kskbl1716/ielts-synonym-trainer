'use strict';
/* V11.0 智能记忆引擎专项验证（CDP 驱动本地 Edge/Chrome 9223，localhost:8000）
   前置：python -m http.server 8000 + Edge --remote-debugging-port=9223 打开 http://localhost:8000/
   用法：node work/e2e-v11-srs.js
   覆盖：recordAnswer 艾宾浩斯调度、掌握度 5 级派生、错题本、dueWords、首页待复习区、错题本面板、例句整句朗读 */
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
  async open(){ await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; }); this.ws.onmessage = ev => { const o = JSON.parse(ev.data); if(o.id && this.pending.has(o.id)){ this.pending.get(o.id)(o); this.pending.delete(o.id); } }; }
  send(method, params){ const id = ++this.id; return new Promise(res => { this.pending.set(id, res); this.ws.send(JSON.stringify({ id, method, params: params || {} })); }); }
  async eval(expr){ const res = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); const r = res.result || {}; if(r.exceptionDetails) return '__EXC__ ' + (r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text); return r.result.value; }
  close(){ try{ this.ws.close(); }catch(e){} }
}
(async () => {
  const page = await getPage();
  if(!page) throw new Error('no page on localhost:8000');
  const cdp = new CDP(page.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send('Network.enable');
  await cdp.send('Network.setBlockedURLs', { urls: ['*://cdn.jsdelivr.net/*', '*jsdelivr*', '*supabase.co/*'] });
  const mock = fs.readFileSync(path.join(__dirname, 'mock-supa.js'), 'utf8');
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: mock });
  await cdp.eval("localStorage.clear(); location.reload(); true");
  await new Promise(r => setTimeout(r, 2500));
  await cdp.eval("window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message))); true");
  const results = [];
  const T = async (name, expr) => { try { const v = await cdp.eval(expr); const s = v === undefined ? 'undefined' : JSON.stringify(v); results.push([String(s).includes('__EXC__') ? 'FAIL' : 'OK', name + ' => ' + String(s).slice(0, 220)]); } catch(e){ results.push(['FAIL', name + ' => ' + e.message]); } };

  /* 1. recordAnswer 调度：首学→+1天；连续对→1→3→7 */
  await T('s1-schedule-ok-x3', "(()=>{ state=defaultState(); saveState(); recordAnswer('able',true); recordAnswer('able',true); recordAnswer('able',true); const r=reviewStore()['able']; const t=todayStr(); return {int:r.int, nextDays:(new Date(r.next)-new Date(t))/86400000, lapses:r.lapses, next:r.next}; })()");
  /* 2. 错误：重置 int=1 + 错题本 +1 */
  await T('s2-schedule-wrong', "(()=>{ recordAnswer('ability',false); const r=reviewStore()['ability'], nb=notebookStore()['ability']; return {int:r.int, lapses:r.lapses, nbCount:nb.count}; })()");
  /* 3. 掌握度派生 */
  await T('s3-mastery-levels', "(()=>{ const t=todayStr(); return {unseen:masteryLevel('zzzunseenzzz'), isMasteredAlter:isMastered('able')}; })()");
  /* 4. dueWords：把 ability 设为今天到期 */
  await T('s4-due-words', "(()=>{ reviewStore()['ability'].next=todayStr(); const d=dueWords(); return {n:d.length, has:d.includes('ability')}; })()");
  /* 5. 首页待复习区渲染 */
  await T('s5-home-review', "(()=>{ switchView('home'); const el=document.getElementById('home-review'); const n=document.querySelectorAll('#home-review .review-item').length; return {has:!!el, items:n, btn:!!document.getElementById('home-review-btn')}; })()");
  /* 6. 开始复习 → 闪卡用到期词（对象列表） */
  await T('s6-review-flash', "(()=>{ document.getElementById('home-review-btn').click(); return {flashView:document.getElementById('view-flash').classList.contains('active'), game:!document.getElementById('flash-game').classList.contains('hidden'), listObj:flash&&flash.list&&flash.list.length>0&&typeof flash.list[0]==='object', n:flash?flash.list.length:-1}; })()");
  /* 7. 错题本面板 */
  await T('s7-wrong-panel', "(()=>{ switchView('stats'); const p=document.getElementById('wrong-panel'); return {has:!!p, txt:p?p.textContent.replace(/\\s+/g,' ').trim().slice(0,60):null, btn:!!document.getElementById('wrong-review-btn')}; })()");
  /* 8. 单词详情例句整句朗读按钮 */
  await T('s8-sentence-speak', "(()=>{ openWordDetail('able'); const b=document.querySelector('.wm-say'); const out={has:!!b, isSentence:(b&&b.dataset.speak||'').split(' ').length>2}; closeWordDetail(); return out; })()");
  /* 9. P2 记忆看板 + 遗忘曲线（有复习数据时渲染） */
  await T('s9-memory-panel', "(()=>{ state=defaultState(); saveState(); const rv=reviewStore(); rv['able']={int:3,next:todayStr(),lapses:0,last:todayStr()}; rv['ability']={int:7,next:todayStr(),lapses:0,last:todayStr()}; state.activity={}; state.activity[todayStr()]=5; saveState(); switchView('stats'); const mp=document.getElementById('memory-panel'); return {has:!!mp, svg:!!(mp&&mp.querySelector('svg.mem-curve')), dueLabel:mp?mp.textContent.includes('今日到期'):false}; })()");
  /* 10. P2 学习热力图（今日格子高亮） */
  await T('s10-heatmap', "(()=>{ const hp=document.getElementById('heatmap-panel'); return {has:!!hp, activeCells:hp?hp.querySelectorAll('.hm-cell.lv1,.hm-cell.lv2,.hm-cell.lv3').length:0, today:!!(hp&&hp.querySelector('.hm-cell.today'))}; })()");
  /* 11. P2 每日活动自动记录 */
  await T('s11-activity-recorded', "(()=>{ const before=state.activity[todayStr()]||0; recordAnswer('able', true); return (state.activity[todayStr()]||0) > before; })()");
  /* 12. 无 JS 报错 */
  await T('s12-no-errors', "window.__errs.join('|')");

  console.log('==== E2E V11-SRS 智能记忆引擎 (' + results.length + ' 项) ====');
  let fail = 0;
  for (const [st, msg] of results){ console.log(st + '  | ' + msg); if (st === 'FAIL') fail++; }
  console.log('==== FAILS: ' + fail + ' ====');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR:', e.message); process.exit(2); });
