'use strict';
/* 回归验证：所有直接展示例句的核心学习界面都提供可点击的整句朗读入口。 */
const BASE = 'http://127.0.0.1:9223';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getPage(){
  let pages = await (await fetch(BASE + '/json')).json();
  let page = pages.find(p => p.type === 'page' && /localhost:8000|127\.0\.0\.1:8000/.test(p.url));
  if(!page){
    await fetch(BASE + '/json/new?http://localhost:8000/', { method:'PUT' });
    await wait(1500);
    pages = await (await fetch(BASE + '/json')).json();
    page = pages.find(p => p.type === 'page' && /localhost:8000|127\.0\.0\.1:8000/.test(p.url));
  }
  if(!page) throw new Error('local page not found');
  return page;
}

class CDP {
  constructor(url){ this.ws = new WebSocket(url); this.id = 0; this.pending = new Map(); }
  async open(){
    await new Promise((resolve, reject)=>{ this.ws.onopen=resolve; this.ws.onerror=reject; });
    this.ws.onmessage = event => {
      const message = JSON.parse(event.data);
      if(message.id && this.pending.has(message.id)){
        this.pending.get(message.id)(message);
        this.pending.delete(message.id);
      }
    };
  }
  send(method, params){
    const id = ++this.id;
    return new Promise(resolve=>{ this.pending.set(id, resolve); this.ws.send(JSON.stringify({id,method,params:params||{}})); });
  }
  async eval(expression){
    const message = await this.send('Runtime.evaluate', {expression,returnByValue:true,awaitPromise:true});
    if(message.result.exceptionDetails){
      const detail = message.result.exceptionDetails;
      throw new Error(detail.exception ? detail.exception.description : detail.text);
    }
    return message.result.result.value;
  }
  close(){ try{ this.ws.close(); }catch(error){} }
}

(async()=>{
  const page = await getPage();
  const cdp = new CDP(page.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send('Page.enable');
  await cdp.send('Page.reload', {ignoreCache:true});
  await wait(2200);
  const checks = await cdp.eval(`(()=>{
    const sample = WORDS[0];
    const spoken = [];
    window.speak = text => spoken.push(text);
    const testButton = (name, selector) => {
      const button = document.querySelector(selector);
      if(!button) return {name,ok:false,detail:'按钮不存在'};
      const before = spoken.length;
      button.click();
      const actual = spoken[spoken.length-1];
      return {name,ok:spoken.length===before+1 && actual===sample.e,detail:actual||'未触发'};
    };
    const results = [];

    switchView('learn');
    renderLearnList();
    results.push(testButton('词库卡片例句朗读', '#learn-list .word-card[data-w="'+sample.w+'"] .sentence-speak'));

    flash = {list:[sample],idx:0,known:0,unknown:0};
    flashDir = 'forward';
    renderFlashCard();
    results.push(testButton('闪卡背面例句朗读', '#flash-back .sentence-speak'));

    let reciteHost = document.querySelector('#book-recite');
    if(!reciteHost){ reciteHost=document.createElement('div'); reciteHost.id='book-recite'; document.body.appendChild(reciteHost); }
    reciteHost.innerHTML = brGame();
    reciteHost.classList.remove('hidden');
    recite.pool=[sample]; recite.idx=0; recite.round=0;
    bindReciteEvents(); renderReciteCard();
    results.push(testButton('词书背诵例句朗读', '#br-ex-speak'));

    prac={idx:1,q:null}; pDir='forward';
    renderSyn(sample);
    results.push(testButton('同义替换题例句朗读', '#quiz-body .syn-q-ex .sentence-speak'));
    return results;
  })()`);
  let failures = 0;
  console.log('==== 例句朗读入口回归 ('+checks.length+' 项) ====');
  checks.forEach(check=>{ console.log((check.ok?'OK  ':'FAIL')+'| '+check.name+' — '+check.detail); if(!check.ok) failures++; });
  console.log('==== FAILS: '+failures+' ====');
  cdp.close();
  process.exit(failures ? 1 : 0);
})().catch(error=>{ console.error('HARNESS ERROR:', error.stack||error.message); process.exit(2); });
