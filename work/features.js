/* ================= v2: 单词详情弹窗 ================= */
function dictOf(w){ return Object.prototype.hasOwnProperty.call(DICT, w) ? DICT[w] : null; }
function openWordDetail(word){
  const entry = WORDS.find(x=>x.w===word) || null;
  const d = dictOf(word);
  const w = word;
  const ipa = (d && d[0]) || (entry && entry.p) || '';
  const pos = (d && d[1]) || (entry && entry.pos) || '';
  const def = (d && d[2]) || (entry && entry.d) || '';
  const cn = entry ? entry.c : (d && d[3] ? d[3] : '');
  $('#wm-word-head').innerHTML =
    '<div class="wm-w">'+escapeHtml(w)+'</div>'+
    (ipa?'<span class="wm-ipa">'+escapeHtml(ipa)+'</span>':'')+
    (pos?'<span class="wm-pos">'+escapeHtml(pos)+'</span>':'')+
    '<button class="icon-btn wm-speak" data-speak="'+escapeHtml(w)+'">🔊 发音</button>';
  let synChips = '';
  if(entry){
    synChips = entry.s.map(s=>{
      const has = !!dictOf(s);
      return '<button class="syn-chip'+(has?' linkable':'')+'" data-w="'+escapeHtml(s)+'" data-speak="'+escapeHtml(s)+'">'+escapeHtml(s)+(has?' 📖':'')+'</button>';
    }).join('');
  }
  let html = '';
  if(cn) html += '<div class="wm-sec"><div class="wm-sec-t">中文释义</div><div class="wm-cn">'+escapeHtml(cn)+'</div></div>';
  if(def) html += '<div class="wm-sec"><div class="wm-sec-t">英文释义</div><div class="wm-def">'+escapeHtml(def)+'</div></div>';
  if(entry && entry.s.length) html += '<div class="wm-sec"><div class="wm-sec-t">同义替换（点击发音 · 📖 可看详情）</div><div class="wm-syns">'+synChips+'</div></div>';
  if(entry) html += '<div class="wm-sec"><div class="wm-sec-t">例句（听力语境）</div><p class="wc-ex">'+highlight(entry.e, entry.k)+'</p></div>';
  if(entry) html += '<div class="wm-meta">'+topicName(entry.t)+'</div>';
  $('#wm-body').innerHTML = html;
  const wbBtn = $('#wm-wb');
  wbBtn.dataset.w = w;
  wbBtn.textContent = state.wordbook.includes(w) ? '★ 已在生词本' : '☆ 加入生词本';
  $('#word-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeWordDetail(){ $('#word-modal').classList.add('hidden'); document.body.style.overflow = ''; }
$('#wm-close').addEventListener('click', closeWordDetail);
$('#wm-ok').addEventListener('click', closeWordDetail);
$('#word-modal').addEventListener('click', e=>{ if(e.target.id==='word-modal') closeWordDetail(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeWordDetail(); });
$('#wm-word-head').addEventListener('click', e=>{ const t=e.target.closest('[data-speak]'); if(t) speak(t.dataset.speak); });
$('#wm-body').addEventListener('click', e=>{
  const chip = e.target.closest('[data-w]');
  if(chip){ const cw=chip.dataset.w; if(dictOf(cw)){ openWordDetail(cw); } else { speak(cw); } return; }
  const t = e.target.closest('[data-speak]');
  if(t) speak(t.dataset.speak);
});
$('#wm-wb').addEventListener('click', ()=>{
  const w = $('#wm-wb').dataset.w; if(!w) return;
  if(state.wordbook.includes(w)){ state.wordbook = state.wordbook.filter(x=>x!==w); toast('已从生词本移除'); }
  else { state.wordbook.push(w); toast('已加入生词本'); }
  saveState(); renderStats();
  $('#wm-wb').textContent = state.wordbook.includes(w) ? '★ 已在生词本' : '☆ 加入生词本';
});

/* ================= v2: 词库卡片整卡可点 ================= */
function renderLearnList(){
  const q = learnQuery.trim().toLowerCase();
  const list = learnPool().filter(w=>{
    if(!q) return true;
    return w.w.toLowerCase().includes(q) || w.c.includes(learnQuery.trim()) ||
      w.s.some(s=>s.toLowerCase().includes(q)) || w.e.toLowerCase().includes(q);
  });
  const box = $('#learn-list');
  if(!list.length){
    const hasFilter = (typeof learnZone==='undefined' ? 'all' : learnZone)!=='all' || (typeof learnTopic==='undefined' ? 'all' : learnTopic)!=='all';
    if(q){
      box.innerHTML = '<div class="empty">没有找到与「<b>'+escapeHtml(learnQuery.trim())+'</b>」匹配的单词'+(hasFilter?'（当前还有专区 / 主题筛选）':'')+'<br><button class="btn btn-primary btn-sm empty-btn" id="learn-clear-search" type="button">✕ 清除搜索</button></div>';
    } else if(hasFilter){
      box.innerHTML = '<div class="empty">当前筛选条件下没有单词（专区 × 主题无交集）<br><button class="btn btn-primary btn-sm empty-btn" id="learn-clear-filter" type="button">✕ 清除筛选</button></div>';
    } else {
      box.innerHTML = '<div class="empty">词库还没有单词～</div>';
    }
    const bs = box.querySelector('#learn-clear-search');
    if(bs) bs.addEventListener('click', ()=>{ const inp=$('#learn-search'); if(inp) inp.value=''; learnQuery=''; renderLearnList(); });
    const bf = box.querySelector('#learn-clear-filter');
    if(bf) bf.addEventListener('click', ()=>{ learnZone='all'; learnTopic='all'; renderLearn(); });
    return;
  }
  box.innerHTML = list.map(w=>{
    const syn = w.s.map(s=>'<button class="syn-chip'+(dictOf(s)?' linkable':'')+'" data-w="'+escapeHtml(s)+'" data-speak="'+escapeHtml(s)+'">'+escapeHtml(s)+(dictOf(s)?' 📖':'')+'</button>').join('');
    const m = isMastered(w.w) ? '<span class="done">✅ 已掌握</span>' : '';
    return '<div class="word-card clickable" data-w="'+escapeHtml(w.w)+'">'+
      '<div class="wc-top"><div><div class="wc-word">'+escapeHtml(w.w)+'</div><div class="wc-cn">'+escapeHtml(w.c)+'</div></div>'+
      '<button class="icon-btn" data-speak="'+escapeHtml(w.w)+'">🔊</button></div>'+
      '<div class="wc-syn">'+syn+'</div>'+
      '<p class="wc-ex">'+highlight(w.e, w.k)+'</p>'+
      '<div class="wc-meta"><span>'+topicName(w.t)+'</span>'+m+'<span class="wc-detail-hint">📖 点击卡片查看详情</span></div>'+
    '</div>';
  }).join('');
}
$('#learn-list').addEventListener('click', e=>{
  const chip = e.target.closest('.syn-chip[data-w]');
  if(chip){ const cw=chip.dataset.w; if(dictOf(cw)){ openWordDetail(cw); } else { speak(cw); } return; }
  const sp = e.target.closest('[data-speak]');
  if(sp) return;
  const card = e.target.closest('.word-card[data-w]');
  if(card) openWordDetail(card.dataset.w);
});

/* ================= v2: 生词本列表可点开详情 ================= */
$('#wordbook-list').addEventListener('click', e=>{
  if(e.target.closest('[data-rm]')) return;
  const item = e.target.closest('.wb-item');
  if(item){ const wd = item.querySelector('.wb-word'); if(wd) openWordDetail(wd.textContent.trim()); }
});

/* ================= v2: 闪卡背面加详情按钮 ================= */
function renderFlashCard(){
  const e = flash.list[flash.idx];
  const fwd = flashDir==='forward';
  const shown = fwd ? e.w : e.s[Math.floor(Math.random()*e.s.length)];
  flash.curKey = shown;
  $('#flash-card').classList.remove('flipped');
  $('#flash-front').innerHTML = '<div class="f-word">'+escapeHtml(shown)+'</div>'+
    (fwd ? '<div class="f-cn">'+escapeHtml(e.c)+'</div>' : '<div class="f-cn">找出与它意思相同的单词</div>')+
    '<div class="f-hint">点击卡片翻转</div>';
  const synChips = e.s.map(s=>'<button class="syn-chip" data-speak="'+escapeHtml(s)+'">'+escapeHtml(s)+'</button>').join('');
  $('#flash-back').innerHTML =
    (fwd ? '<div class="f-word">'+escapeHtml(e.w)+'</div><div class="f-cn">'+escapeHtml(e.c)+'</div>' : '<div class="f-syns">'+synChips+'</div>')+
    (fwd ? '<div class="f-syns">'+synChips+'</div>' : '<div class="f-word">'+escapeHtml(e.w)+'</div><div class="f-cn">'+escapeHtml(e.c)+'</div>')+
    '<div class="f-ex">'+highlight(e.e, e.k)+'</div>'+
    '<button class="btn btn-ghost btn-sm f-detail" data-fw="'+escapeHtml(e.w)+'">📖 查看详情</button>';
  $('#flash-pos').textContent = '第 '+(flash.idx+1)+' / '+flash.list.length+' 张';
  $('#flash-count').textContent = '✓ '+flash.known+' · ✗ '+flash.unknown;
}
$('#flash-back').addEventListener('click', e=>{
  const d = e.target.closest('[data-fw]');
  if(d){ e.stopPropagation(); openWordDetail(d.dataset.fw); return; }
});

/* ================= v2: 进度备份（导出/导入） ================= */
function exportProgress(){
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  const d = new Date(), pad = n=>String(n).padStart(2,'0');
  a.href = URL.createObjectURL(blob);
  a.download = 'ielts-syn-backup-'+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 3000);
  toast('已导出进度备份 ✅');
}
function importProgress(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const obj = JSON.parse(reader.result);
      if(!obj || typeof obj!=='object' || !Array.isArray(obj.wordbook)) throw new Error('文件格式不正确');
      const s = defaultState();
      Object.keys(s).forEach(k=>{ if(obj[k]!==undefined) s[k]=obj[k]; });
      if(typeof s.daily!=='object' || s.daily===null) s.daily={date:'',count:0};
      if(typeof s.stats!=='object' || s.stats===null) s.stats={};
      state = s; saveState(); renderHeaderStats(); renderStats();
      toast('导入成功 ✅');
    }catch(err){ toast('导入失败：'+err.message); }
  };
  reader.readAsText(file);
}
(function(){
  const dz = document.querySelector('.danger-zone');
  if(!dz) return;
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px';
  wrap.innerHTML = '<button class="btn btn-ghost btn-sm" id="export-data">📤 导出进度备份</button>'+
    '<button class="btn btn-ghost btn-sm" id="import-data">📥 导入进度备份</button>'+
    '<input type="file" id="import-file" accept=".json,application/json" style="display:none">'+
    '<span style="font-size:12px;color:var(--muted)">换设备 / 清缓存前先导出，换好后导入即可恢复进度</span>';
  dz.prepend(wrap);
  $('#export-data').addEventListener('click', exportProgress);
  $('#import-data').addEventListener('click', ()=>$('#import-file').click());
  $('#import-file').addEventListener('change', e=>{ if(e.target.files && e.target.files[0]) importProgress(e.target.files[0]); e.target.value=''; });
})();

/* ================= v3: 每日目标 + 打卡系统 ================= */
function fmtDate(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function checkinStreak(){
  if(!Array.isArray(state.checkins)) state.checkins = [];
  const set = new Set(state.checkins);
  let d = new Date();
  if(!set.has(fmtDate(d))) d = new Date(Date.now()-864e5);
  let n = 0;
  while(set.has(fmtDate(d))){ n++; d = new Date(d.getTime()-864e5); }
  return n;
}
const CAL = { y:0, m:0 };
function setGoal(n){
  state.goal = n; saveState();
  renderCheckinPanel(); renderHeaderStats();
  toast('每日目标已设为 '+n+' 词');
}
function renderCheckinPanel(){
  if(!Array.isArray(state.checkins)) state.checkins = [];
  const goal = state.goal>0 ? state.goal : DEFAULT_GOAL;
  const today = state.daily.date===todayStr() ? state.daily.count : 0;
  const checked = state.checkins.includes(todayStr());
  const pct = Math.min(100, Math.round(today/goal*100));
  const pt = $('#goal-presets');
  if(pt) [...pt.children].forEach(b=>b.classList.toggle('active', parseInt(b.dataset.goal,10)===goal));
  const tEl = $('#checkin-today'); if(tEl) tEl.textContent = '今日进度：'+today+' / '+goal+' 词';
  const fEl = $('#goal-fill'); if(fEl) fEl.style.width = pct+'%';
  const mEl = $('#checkin-msg');
  if(mEl){
    if(checked) mEl.innerHTML = '✅ 今天已打卡';
    else if(today>=goal) mEl.innerHTML = '🎉 已达成今日目标，点击下方按钮打卡！';
    else mEl.innerHTML = '💪 还差 '+(goal-today)+' 词达成今日目标';
  }
  const bEl = $('#checkin-btn');
  if(bEl){ bEl.disabled = checked; bEl.textContent = checked ? '✅ 今日已打卡' : '✅ 今日打卡'; }
  renderCalendar(); renderCalFoot();
}
function renderCalFoot(){
  if(!Array.isArray(state.checkins)) state.checkins = [];
  const list = state.checkins;
  const ym = CAL.y+'-'+String(CAL.m+1).padStart(2,'0');
  const monthCount = list.filter(d=>d.indexOf(ym)===0).length;
  const el = $('#cal-foot');
  if(el) el.textContent = '本月打卡 '+monthCount+' 天 · 累计 '+list.length+' 天 · 连续 '+checkinStreak()+' 天';
}
function renderCalendar(){
  const grid = $('#cal-grid');
  const title = $('#cal-title');
  if(!grid || !title) return;
  title.textContent = CAL.y+'年'+(CAL.m+1)+'月';
  const first = new Date(CAL.y, CAL.m, 1);
  const daysInMonth = new Date(CAL.y, CAL.m+1, 0).getDate();
  const lead = (first.getDay()+6)%7;
  const set = new Set(state.checkins||[]);
  const today = todayStr();
  let cells = '<div class="cal-dow">一</div><div class="cal-dow">二</div><div class="cal-dow">三</div><div class="cal-dow">四</div><div class="cal-dow">五</div><div class="cal-dow">六</div><div class="cal-dow">日</div>';
  for(let i=0;i<lead;i++) cells += '<div class="cal-cell empty"></div>';
  for(let d=1;d<=daysInMonth;d++){
    const ds = CAL.y+'-'+String(CAL.m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const cls = ['cal-cell'];
    if(set.has(ds)) cls.push('checked');
    if(ds===today) cls.push('today');
    if(ds>today) cls.push('future');
    cells += '<div class="'+cls.join(' ')+'" data-day="'+ds+'">'+d+'</div>';
  }
  grid.innerHTML = cells;
}
(function initCheckin(){
  const view = $('#view-stats');
  if(!view) return;
  const now = new Date();
  CAL.y = now.getFullYear(); CAL.m = now.getMonth();
  const panel = document.createElement('div');
  panel.className = 'panel checkin-panel';
  panel.id = 'checkin-panel';
  panel.innerHTML =
    '<h3>🗓️ 每日打卡 <span style="font-weight:400;color:var(--muted)">完成今日目标后打卡，坚持就是胜利</span></h3>'+
    '<div class="checkin-top">'+
      '<div class="goal-box">'+
        '<div class="goal-label">每日目标</div>'+
        '<div class="goal-presets" id="goal-presets">'+
          [10,20,30,50].map(n=>'<button class="btn btn-ghost btn-sm" data-goal="'+n+'">'+n+' 词</button>').join('')+
        '</div>'+
        '<div class="goal-custom"><input id="goal-input" type="number" min="1" max="500" placeholder="自定义">'+
        '<button class="btn btn-primary btn-sm" id="goal-save">保存</button></div>'+
      '</div>'+
      '<div class="checkin-now">'+
        '<div class="checkin-today" id="checkin-today"></div>'+
        '<div class="goal-bar"><div class="fill" id="goal-fill"></div></div>'+
        '<div class="checkin-msg" id="checkin-msg"></div>'+
        '<button class="btn btn-primary" id="checkin-btn">✅ 今日打卡</button>'+
      '</div>'+
    '</div>'+
    '<div class="calendar">'+
      '<div class="cal-head"><button class="btn btn-ghost btn-sm" id="cal-prev">‹ 上月</button>'+
      '<span class="cal-title" id="cal-title"></span>'+
      '<button class="btn btn-ghost btn-sm" id="cal-next">下月 ›</button></div>'+
      '<div class="cal-grid" id="cal-grid"></div>'+
      '<div class="cal-foot" id="cal-foot"></div>'+
    '</div>';
  view.insertBefore(panel, view.firstChild);
  $('#goal-presets').addEventListener('click', e=>{
    const b = e.target.closest('[data-goal]');
    if(b) setGoal(parseInt(b.dataset.goal,10));
  });
  $('#goal-save').addEventListener('click', ()=>{
    const v = parseInt($('#goal-input').value,10);
    if(!v || isNaN(v)){ toast('请输入 1~500 之间的数字'); return; }
    setGoal(Math.max(1, Math.min(500, v)));
    $('#goal-input').value = '';
  });
  $('#goal-input').addEventListener('keydown', e=>{ if(e.key==='Enter') $('#goal-save').click(); });
  $('#checkin-btn').addEventListener('click', ()=>{
    if(!Array.isArray(state.checkins)) state.checkins = [];
    if(state.checkins.includes(todayStr())) return;
    state.checkins.push(todayStr());
    saveState(); renderCheckinPanel(); renderHeaderStats();
    toast('🎉 打卡成功！连续 '+checkinStreak()+' 天');
  });
  $('#cal-prev').addEventListener('click', ()=>{ CAL.m--; if(CAL.m<0){ CAL.m=11; CAL.y--; } renderCalendar(); renderCalFoot(); });
  $('#cal-next').addEventListener('click', ()=>{ CAL.m++; if(CAL.m>11){ CAL.m=0; CAL.y++; } renderCalendar(); renderCalFoot(); });
  renderCheckinPanel();
})();
const _rsV3 = renderStats;
renderStats = function(){ _rsV3(); renderCheckinPanel(); };


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
    ab.innerHTML = '📚 词库共 <b>'+WORDS.length+'</b> 词（🎧 听力 '+zl+' · ✍️ 书写 '+zw+'）· 版本 v8.0<br>🎧 听力专区：听录音抓同义替换、听写拼写、听音选义，对应雅思听力场景。<br>✍️ 书写专区：写作 Task 1 图表词汇与 Task 2 论证词汇，对应雅思写作高频表达。<br>💾 数据只存本机浏览器，登录账号后进度自动云端同步，也可用「数据管理」导出/导入备份。';
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
  const norm = s => s.toLowerCase().replace(/[^a-z'-]/g,'');
  const typed = norm($('#dict-input').value || '');
  const ok = typed === norm(q.w);
  if(ok) prac.score++;
  recordAnswer(q.w, ok);
  if(!ok){
    addWordbook(q.w);
    prac.wrongs.push({w:q.w, c:q.cn, s:q.s, e:q.e, k:q.k, your:typed||'（未输入）', correct:q.w});
  }
  const fb = $('#feedback');
  fb.innerHTML = ok ? '✅ 拼写正确！' : '❌ 正确答案是 <b>'+escapeHtml(q.w)+'</b>（'+escapeHtml(q.cn)+'）';
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
  if(prac.type==='word2cn' || prac.type==='l2cn'){ v4AnswerCn(btn); return; }
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
  if(!ok){ addWordbook(q.w); prac.wrongs.push({w:q.w,c:q.cn,s:q.s,e:q.e,k:q.k,your:chosen,correct:q.correct}); }
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
/* ================= v8: 意见反馈（直达站长邮箱） ================= */
var FEEDBACK_EMAIL = '2012837089@qq.com';
function renderFeedbackPanel(){
  const sec = $('#view-settings');
  if(!sec || $('#feedback-panel')) return;
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.id = 'feedback-panel';
  panel.innerHTML =
    '<h3>💬 意见反馈</h3>'+
    '<div class="set-row"><div class="set-label">反馈类型</div><div class="set-control"><select id="fb-type" class="fb-select">'+
      '<option value="建议">💡 功能建议</option><option value="Bug">🐞 Bug 反馈</option><option value="词库">📚 词库问题</option><option value="其他">📝 其他</option>'+
    '</select></div></div>'+
    '<div class="set-row"><div class="set-label">反馈内容</div><div class="set-control"><textarea id="fb-content" rows="4" placeholder="请描述你的建议或遇到的问题…（必填）"></textarea></div></div>'+
    '<div class="set-row"><div class="set-label">联系方式</div><div class="set-control"><input id="fb-contact" type="text" placeholder="选填：邮箱 / QQ / 微信，方便我回复你"></div></div>'+
    '<div class="set-row"><div class="set-label"></div><div class="set-control">'+
      '<button class="btn btn-primary btn-sm" id="fb-send">📨 发送反馈</button>'+
      '<span class="fb-status" id="fb-status"></span>'+
    '</div></div>'+
    '<div class="set-hint">反馈将发送到站长邮箱（'+FEEDBACK_EMAIL+'）。首次发送会收到一封激活确认邮件，点开确认后，之后的反馈就能直接送达；网络不通时可用「📧 邮件直发」兜底。</div>';
  const about = sec.querySelector('#set-about');
  const anchor = about ? about.closest('.panel') : null;
  if(anchor) sec.insertBefore(panel, anchor); else sec.appendChild(panel);
  const fb = $('#fb-send');
  if(fb) fb.addEventListener('click', submitFeedback);
  const fbc = $('#fb-content');
  if(fbc) fbc.addEventListener('keydown', e=>{ if(e.key==='Enter' && (e.ctrlKey||e.metaKey)) submitFeedback(); });
}
function submitFeedback(){
  const contentEl = $('#fb-content'), typeEl = $('#fb-type'), contactEl = $('#fb-contact'), st = $('#fb-status');
  const content = contentEl ? contentEl.value : '';
  const type = typeEl ? typeEl.value : '其他';
  const contact = contactEl ? contactEl.value : '';
  const setSt = (txt, cls, extraLink)=>{
    if(!st) return;
    st.textContent = '';
    st.className = 'fb-status'+(cls?' '+cls:'');
    if(txt) st.appendChild(document.createTextNode(txt));
    if(extraLink){ st.appendChild(document.createTextNode(' ')); const a=document.createElement('a'); a.href=extraLink; a.textContent='📧 邮件直发'; a.style.color='var(--accent,#2563eb)'; st.appendChild(a); }
  };
  if(!content.trim()){ setSt('请先填写反馈内容', 'bad'); return; }
  const btn = $('#fb-send');
  if(btn){ btn.disabled = true; btn.textContent = '发送中…'; }
  const mailto = 'mailto:'+FEEDBACK_EMAIL+'?subject='+encodeURIComponent('【雅思训练器反馈】'+type)+'&body='+encodeURIComponent(content+'\n\n联系方式：'+(contact||'未填写'));
  const body = new FormData();
  body.append('_subject','【雅思训练器反馈】'+type);
  body.append('_template','table');
  body.append('_captcha','false');
  body.append('反馈类型',type);
  body.append('反馈内容',content);
  body.append('联系方式',contact||'未填写');
  fetch('https://formsubmit.co/ajax/'+FEEDBACK_EMAIL,{method:'POST',body:body})
    .then(r=>r.json().catch(()=>({})))
    .then(res=>{
      if(btn){ btn.disabled=false; btn.textContent='📨 发送反馈'; }
      if(res && (res.success==='true' || res.success===true)){
        setSt('✅ 发送成功！感谢你的反馈 💚','ok');
        if(contentEl) contentEl.value='';
        if(contactEl) contactEl.value='';
      } else {
        setSt('⚠️ '+(res && (res.message||res.error) ? String(res.message||res.error).replace(/<[^>]*>/g,'') : '发送失败，请重试'),'bad',mailto);
      }
    })
    .catch(()=>{
      if(btn){ btn.disabled=false; btn.textContent='📨 发送反馈'; }
      setSt('⚠️ 网络发送失败，请用邮件直发','bad',mailto);
    });
}
const _rsV8 = renderSettings;
renderSettings = function(){ _rsV8(); renderFeedbackPanel(); };