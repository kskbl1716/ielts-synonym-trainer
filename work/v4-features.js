/* ================= v4: 设置 + 专区 + 新模式 ================= */
function defaultSettings(){ return { voice:'auto', rate:0.85, theme:'light', font:'m', pCount:10, pDir:'forward' }; }
function sett(){ if(!state.settings || typeof state.settings!=='object') state.settings = defaultSettings(); return state.settings; }
function saveSett(patch){ state.settings = Object.assign(sett(), patch||{}); saveState(); applyAppearance(); renderSettings(); }
function applyAppearance(){
  const s = sett();
  const root = document.documentElement;
  const apply = ()=>{ root.dataset.theme = (s.theme==='auto') ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : s.theme; };
  apply();
  if(s.theme==='auto'){
    if(!applyAppearance._mq){ applyAppearance._mq = window.matchMedia('(prefers-color-scheme: dark)'); applyAppearance._mq.addEventListener('change', apply); }
  }
  root.dataset.font = s.font || 'm';
}
function renderSettings(){
  const s = sett();
  const gp = $('#set-goal-presets');
  if(gp) gp.innerHTML = [10,20,30,50].map(n=>'<button class="btn btn-ghost btn-sm'+(state.goal===n?' active':'')+'" data-goal="'+n+'">'+n+' 词</button>').join('');
  const vr = $('#set-voice');
  if(vr) vr.innerHTML = [['auto','自动（英音优先）'],['uk','🇬🇧 英音'],['us','🇺🇸 美音']].map(o=>'<button class="chip'+(s.voice===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
  const rt = $('#set-rate');
  if(rt) rt.innerHTML = [['0.7','🐢 慢速'],['0.85','🙂 正常'],['1.0','🚀 快速']].map(o=>'<button class="chip'+(String(s.rate)===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
  const pc = $('#set-pcount');
  if(pc) pc.innerHTML = [5,10,15,20].map(n=>'<button class="chip'+(s.pCount===n?' on':'')+'" data-v="'+n+'">'+n+' 题</button>').join('');
  const pd = $('#set-pdir');
  if(pd) pd.innerHTML = [['forward','正向'],['reverse','反向'],['mixed','混合']].map(o=>'<button class="chip'+(s.pDir===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
  const th = $('#set-theme');
  if(th) th.innerHTML = [['light','☀️ 浅色'],['dark','🌙 深色'],['auto','🔄 跟随系统']].map(o=>'<button class="chip'+(s.theme===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
  const ft = $('#set-font');
  if(ft) ft.innerHTML = [['s','小号'],['m','中号'],['l','大号']].map(o=>'<button class="chip'+(s.font===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
  const ab = $('#set-about');
  if(ab){
    const zl = WORDS.filter(w=>w.z==='l').length, zw = WORDS.filter(w=>w.z==='w').length;
    ab.innerHTML = '📚 词库共 <b>'+WORDS.length+'</b> 词（🎧 听力 '+zl+' · ✍️ 书写 '+zw+'）· 版本 v4.0<br>🎧 听力专区：听录音抓同义替换、听写拼写、听音选义，对应雅思听力场景。<br>✍️ 书写专区：写作 Task 1 图表词汇与 Task 2 论证词汇，对应雅思写作高频表达。<br>💾 数据只存本机浏览器，导出备份文件可迁移到其他设备。';
  }
}
function applyPracticePrefs(){
  const s = sett();
  pCount = s.pCount || 10;
  pDir = s.pDir || 'forward';
  $$('#p-counts .chip').forEach(b=>b.classList.toggle('on', +b.dataset.n===pCount));
  $$('#p-dirs .chip').forEach(b=>b.classList.toggle('on', b.dataset.dir===pDir));
}
function bindSettingsEvents(){
  const on = (sel, fn)=>{ const el = $(sel); if(el) el.addEventListener('click', fn); };
  on('#set-goal-presets', e=>{ const b=e.target.closest('[data-goal]'); if(b){ setGoal(parseInt(b.dataset.goal,10)); renderSettings(); } });
  on('#set-goal-save', ()=>{ const v=parseInt($('#set-goal-input').value,10); if(!v||isNaN(v)){ toast('请输入 1~500 之间的数字'); return; } setGoal(Math.max(1,Math.min(500,v))); $('#set-goal-input').value=''; renderSettings(); });
  const gi = $('#set-goal-input'); if(gi) gi.addEventListener('keydown', e=>{ if(e.key==='Enter') $('#set-goal-save').click(); });
  on('#set-voice', e=>{ const b=e.target.closest('[data-v]'); if(b) saveSett({voice:b.dataset.v}); });
  on('#set-rate', e=>{ const b=e.target.closest('[data-v]'); if(b) saveSett({rate:parseFloat(b.dataset.v)}); });
  on('#set-pcount', e=>{ const b=e.target.closest('[data-v]'); if(b){ saveSett({pCount:parseInt(b.dataset.v,10)}); applyPracticePrefs(); } });
  on('#set-pdir', e=>{ const b=e.target.closest('[data-v]'); if(b){ saveSett({pDir:b.dataset.v}); applyPracticePrefs(); } });
  on('#set-theme', e=>{ const b=e.target.closest('[data-v]'); if(b) saveSett({theme:b.dataset.v}); });
  on('#set-font', e=>{ const b=e.target.closest('[data-v]'); if(b) saveSett({font:b.dataset.v}); });
  on('#set-export', ()=>{ if(typeof exportProgress==='function') exportProgress(); });
  on('#set-import-btn', ()=>{ const f=$('#set-import-file'); if(f) f.click(); });
  const imp = $('#set-import-file');
  if(imp) imp.addEventListener('change', e=>{ if(e.target.files && e.target.files[0] && typeof importProgress==='function') importProgress(e.target.files[0]); e.target.value=''; });
  on('#set-reset', ()=>{ if(confirm('确定要清空所有学习数据和设置吗？此操作不可恢复。')){ state = defaultState(); saveState(); renderHeaderStats(); renderStats(); renderSettings(); applyAppearance(); applyPracticePrefs(); toast('已重置全部数据'); } });
}
/* ---- 语音设置：口音 + 语速 ---- */
speak = function(text, rate){
  const s = sett();
  const acc = s.voice || 'auto';
  const r = (typeof rate==='number') ? rate : (s.rate || 0.85);
  if(!('speechSynthesis' in window)){ toast('当前浏览器不支持语音合成，请使用 Chrome / Edge'); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  let v = null;
  if(acc==='us') v = voices.find(x=>x.lang==='en-US') || voices.find(x=>x.lang && x.lang.startsWith('en'));
  else v = voices.find(x=>x.lang==='en-GB') || voices.find(x=>x.lang && x.lang.startsWith('en'));
  if(v) u.voice = v;
  u.lang = (v && v.lang) || (acc==='us' ? 'en-US' : 'en-GB');
  u.rate = r;
  speechSynthesis.speak(u);
};/* ---- 专区过滤：听力 / 书写 ---- */
let learnZone='all', flashZone='all', pZone='all';
function zoneChips(active){
  const cnt = z => z==='all' ? WORDS.length : WORDS.filter(w=>w.z===z).length;
  return [['all','📚 全部',cnt('all')],['l','🎧 听力词汇',cnt('l')],['w','✍️ 书写词汇',cnt('w')]].map(x=>
    '<button class="chip'+(active===x[0]?' on':'')+'" data-z="'+x[0]+'">'+x[1]+' <i>'+x[2]+'</i></button>').join('');
}
const _v4lp = learnPool;
learnPool = function(){
  let list = _v4lp();
  if(learnZone!=='all') list = list.filter(w=>w.z===learnZone);
  return list;
};
const _v4rl = renderLearn;
renderLearn = function(){
  _v4rl();
  const el = $('#learn-zones'); if(!el) return;
  el.innerHTML = zoneChips(learnZone);
  el.onclick = e=>{ const b=e.target.closest('[data-z]'); if(b){ learnZone=b.dataset.z; renderLearn(); } };
};
const _v4rfs = renderFlashSetup;
renderFlashSetup = function(){
  _v4rfs();
  const el = $('#flash-zones'); if(!el) return;
  el.innerHTML = zoneChips(flashZone);
  el.onclick = e=>{ const b=e.target.closest('[data-z]'); if(b){ flashZone=b.dataset.z; renderFlashSetup(); } };
};
const _v4sf = startFlash;
startFlash = function(){
  let pool = flashTopic==='all' ? WORDS : WORDS.filter(w=>w.t===flashTopic);
  if(flashZone!=='all') pool = pool.filter(w=>w.z===flashZone);
  if(pool.length < 2){ toast('该范围词太少，无法开始'); return; }
  flash = {list:shuffle(pool), idx:0, known:0, unknown:0};
  $('#flash-end').classList.add('hidden');
  $('#flash-game').classList.remove('hidden');
  renderFlashCard();
};
const _v4rps = renderPracticeSetup;
renderPracticeSetup = function(){
  _v4rps();
  const el = $('#p-zones'); if(!el) return;
  el.innerHTML = zoneChips(pZone);
  el.onclick = e=>{ const b=e.target.closest('[data-z]'); if(b){ pZone=b.dataset.z; renderPracticeSetup(); } };
};
const _v4pp = practicePool;
practicePool = function(){
  let list = _v4pp();
  if(pZone!=='all') list = list.filter(w=>w.z===pZone);
  return list;
};
/* ---- 新练习模式：听写 / 看词选义 / 听音选义 ---- */
const _v4rq = renderQuestion;
renderQuestion = function(){
  prac.answered = false;
  renderQuizTop();
  const q = prac.queue[prac.idx];
  if(prac.type==='dict'){ renderDict(q); return; }
  if(prac.type==='word2cn'){ renderW2C(q); return; }
  if(prac.type==='l2cn'){ renderL2C(q); return; }
  _v4rq();
};
function distractorCn(entry, n){
  const others = shuffle(WORDS.filter(x=>x.w!==entry.w));
  const out = [];
  for(const o of others){ if(!out.includes(o.c)){ out.push(o.c); if(out.length>=n) return out; } }
  return out;
}
function renderDict(q){
  prac.q = {type:'dict', w:q.w, cn:q.c, e:q.e, k:q.k, correct:q.w};
  $('#quiz-body').innerHTML =
    '<div class="q-card">'+
      '<div class="listen-row"><button class="listen-btn" id="play-btn">🔊 播放单词</button>'+
      '<button class="icon-btn" id="replay-btn" title="再听一遍">🔁 再听一遍</button></div>'+
      '<div class="q-prompt">听发音，在下方输入你听到的单词（可反复重听）</div>'+
      '<div class="dict-row"><input id="dict-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="输入单词…">'+
      '<button class="btn btn-primary" id="dict-check">✓ 检查</button></div>'+
      '<div class="feedback" id="feedback"></div>'+
      '<div class="next-row hidden" id="next-row"><button class="btn btn-primary btn-sm" id="next-btn">下一题 →</button></div>'+
    '</div>';
  const play = ()=>{ speak(q.w); const b=$('#play-btn'); if(b){ b.classList.add('playing'); setTimeout(()=>b.classList.remove('playing'), 1600); } };
  $('#play-btn').addEventListener('click', play);
  $('#replay-btn').addEventListener('click', play);
  setTimeout(play, 400);
  $('#dict-check').addEventListener('click', checkDict);
  $('#dict-input').addEventListener('keydown', e=>{ if(e.key==='Enter') checkDict(); });
  const inp = $('#dict-input'); if(inp) inp.focus();
  $('#next-btn').addEventListener('click', nextQuestion);
}
function checkDict(){
  if(prac.answered) return;
  prac.answered = true;
  const q = prac.q;
  const typed = ($('#dict-input').value || '').trim().toLowerCase().replace(/[^a-z'-]/g,'');
  const ok = typed === q.w.toLowerCase();
  if(ok) prac.score++;
  recordAnswer(q.w, ok);
  if(!ok){
    addWordbook(q.w);
    prac.wrongs.push({w:q.w, c:q.c, s:q.s, e:q.e, k:q.k, your:typed||'（未输入）', correct:q.w});
  }
  const fb = $('#feedback');
  fb.innerHTML = ok ? '✅ 拼写正确！' : '❌ 正确答案是 <b>'+escapeHtml(q.w)+'</b>（'+escapeHtml(q.c)+'）';
  fb.className = 'feedback show '+(ok?'ok':'bad');
  const inp = $('#dict-input'); if(inp) inp.disabled = true;
  const cb = $('#dict-check'); if(cb) cb.disabled = true;
  $('#next-row').classList.remove('hidden');
  $('#quiz-score').textContent = prac.score;
}
function renderW2C(q){
  const opts = shuffle([q.c].concat(distractorCn(q,3)));
  prac.q = {type:'w2c', correct:q.c, opts, w:q.w, cn:q.c, e:q.e, k:q.k};
  $('#quiz-body').innerHTML =
    '<div class="q-card">'+
      '<div class="q-word">'+escapeHtml(q.w)+' <button class="icon-btn" id="speak-word">🔊</button></div>'+
      '<div class="q-prompt">看单词，选出正确的中文释义</div>'+
      '<div class="options">'+opts.map((o,i)=>'<button class="opt" data-opt="'+escapeHtml(o)+'"><span class="k">'+(i+1)+'</span>'+escapeHtml(o)+'</button>').join('')+'</div>'+
      '<div class="feedback" id="feedback"></div>'+
      '<div class="next-row hidden" id="next-row"><button class="btn btn-primary btn-sm" id="next-btn">下一题 →</button></div>'+
    '</div>';
  $('#speak-word').addEventListener('click', ()=>speak(q.w));
  bindOptionClicks();
  $('#next-btn').addEventListener('click', nextQuestion);
}
function renderL2C(q){
  const opts = shuffle([q.c].concat(distractorCn(q,3)));
  prac.q = {type:'l2cn', correct:q.c, opts, w:q.w, cn:q.c, e:q.e, k:q.k};
  $('#quiz-body').innerHTML =
    '<div class="q-card">'+
      '<div class="listen-row"><button class="listen-btn" id="play-btn">🔊 播放单词</button>'+
      '<button class="icon-btn" id="replay-btn" title="再听一遍">🔁 再听一遍</button></div>'+
      '<div class="q-prompt">听发音（不显示拼写），选出正确的中文释义</div>'+
      '<div class="options">'+opts.map((o,i)=>'<button class="opt" data-opt="'+escapeHtml(o)+'"><span class="k">'+(i+1)+'</span>'+escapeHtml(o)+'</button>').join('')+'</div>'+
      '<div class="feedback" id="feedback"></div>'+
      '<div class="next-row hidden" id="next-row"><button class="btn btn-primary btn-sm" id="next-btn">下一题 →</button></div>'+
    '</div>';
  const play = ()=>{ speak(q.w); const b=$('#play-btn'); if(b){ b.classList.add('playing'); setTimeout(()=>b.classList.remove('playing'), 1600); } };
  $('#play-btn').addEventListener('click', play);
  $('#replay-btn').addEventListener('click', play);
  setTimeout(play, 400);
  bindOptionClicks();
  $('#next-btn').addEventListener('click', nextQuestion);
}
const _v4ans = answer;
answer = function(btn){
  if(prac.type==='dict') return;
  if(prac.type==='w2c' || prac.type==='l2cn'){ v4AnswerCn(btn); return; }
  _v4ans(btn);
};
function v4AnswerCn(btn){
  if(prac.answered) return;
  prac.answered = true;
  const q = prac.q;
  const chosen = btn.dataset.opt;
  const ok = chosen === q.correct;
  $$('#quiz-body .opt').forEach(b=>{ b.disabled = true; if(b.dataset.opt===q.correct) b.classList.add('correct'); else if(b===btn) b.classList.add('wrong'); });
  if(ok) prac.score++;
  recordAnswer(q.w, ok);
  if(!ok){ addWordbook(q.w); prac.wrongs.push({w:q.w,c:q.c,s:q.s,e:q.e,k:q.k,your:chosen,correct:q.correct}); }
  const fb = $('#feedback');
  fb.innerHTML = ok ? '✅ 正确！<b>'+escapeHtml(q.correct)+'</b>' : '❌ 正确答案：<b>'+escapeHtml(q.correct)+'</b>（<b>'+escapeHtml(q.w)+'</b>）';
  fb.className = 'feedback show '+(ok?'ok':'bad');
  $('#next-row').classList.remove('hidden');
  $('#quiz-score').textContent = prac.score;
}
/* ---- v4 初始化 ---- */
const _v4sv = switchView;
switchView = function(name){
  _v4sv(name);
  if(name==='settings') renderSettings();
  if(name==='practice') applyPracticePrefs();
};
(function initV4(){
  const fsBtn = $('#flash-start');
  if(fsBtn){ const cl = fsBtn.cloneNode(true); fsBtn.parentNode.replaceChild(cl, fsBtn); cl.addEventListener('click', startFlash); }
  bindSettingsEvents();
  applyAppearance();
  renderSettings();
  applyPracticePrefs();
  renderLearn();
  renderFlashSetup();
  renderPracticeSetup();
  renderHeaderStats();
})();