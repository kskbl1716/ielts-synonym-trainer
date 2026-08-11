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
  if(entry) html += '<div class="wm-meta">'+topicName(entry.t)+
    '<div class="wm-books">'+(entry.b||['default']).map(bid=>'<button class="book-tag" data-book="'+escapeHtml(bid)+'">'+escapeHtml(bookName(bid))+'</button>').join('')+'</div></div>';
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
  const tb = e.target.closest('.book-tag[data-book]');
  if(tb){ if(typeof learnBook!=='undefined') learnBook = tb.dataset.book; switchView('learn'); return; }
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
var learnLimit = 100;          // 词库列表分页步长（性能：避免一次性渲染全量 5600+ 卡片）
var lastLearnQ = '';           // 记录上次查询，查询变化时重置分页（var：base init 先于本段执行，不能用 let 以免 TDZ）
function renderLearnList(){
  const q = learnQuery.trim().toLowerCase();
  const list = learnPool().filter(w=>{
    if(!q) return true;
    return w.w.toLowerCase().includes(q) || w.c.includes(learnQuery.trim()) ||
      w.s.some(s=>s.toLowerCase().includes(q)) || w.e.toLowerCase().includes(q);
  });
  if(lastLearnQ !== q){ lastLearnQ = q; learnLimit = 100; }
  const box = $('#learn-list');
  if(!list.length){
    const hasFilter = (typeof learnZone==='undefined' ? 'all' : learnZone)!=='all' || (typeof learnTopic==='undefined' ? 'all' : learnTopic)!=='all' || (typeof learnBook==='undefined' ? 'all' : learnBook)!=='all';
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
    if(bf) bf.addEventListener('click', ()=>{ learnZone='all'; learnTopic='all'; learnBook='all'; renderLearn(); });
    return;
  }
  const shown = list.slice(0, learnLimit);
  box.innerHTML = shown.map(w=>{
    const syn = w.s.map(s=>'<button class="syn-chip'+(dictOf(s)?' linkable':'')+'" data-w="'+escapeHtml(s)+'" data-speak="'+escapeHtml(s)+'">'+escapeHtml(s)+(dictOf(s)?' 📖':'')+'</button>').join('');
    const m = isMastered(w.w) ? '<span class="done">✅ 已掌握</span>' : '';
    return '<div class="word-card clickable" data-w="'+escapeHtml(w.w)+'">'+
      '<div class="wc-top"><div><div class="wc-word">'+escapeHtml(w.w)+'</div><div class="wc-cn">'+escapeHtml(w.c)+'</div></div>'+
      '<button class="icon-btn" data-speak="'+escapeHtml(w.w)+'">🔊</button></div>'+
      '<div class="wc-syn">'+syn+'</div>'+
      '<p class="wc-ex">'+highlight(w.e, w.k)+'</p>'+
      '<div class="wc-meta"><span>'+topicName(w.t)+'</span>'+m+'<span class="wc-detail-hint">📖 点击卡片查看详情</span></div>'+
    '</div>';
  }).join('') +
    (list.length > learnLimit
      ? '<div class="learn-more-bar"><button class="btn btn-ghost btn-sm" id="learn-more">加载更多（已显示 '+learnLimit+' / '+list.length+'）</button></div>'
      : '');
  const more = box.querySelector('#learn-more');
  if(more) more.addEventListener('click', ()=>{ learnLimit += 100; renderLearnList(); });
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
function defaultSettings(){ return { voice:'auto', rate:0.85, theme:'light', font:'m', pCount:10, pDir:'forward', book:'all', pHint:'c' }; }
function sett(){ if(!state.settings || typeof state.settings!=='object') state.settings = defaultSettings(); return state.settings; }
function saveSett(patch){ state.settings = Object.assign(sett(), patch||{}); saveState(); applyAppearance(); renderSettings(); }
function applyAppearance(){
  const s = sett();
  const root = document.documentElement;
  const apply = ()=>{ root.classList.add('th-trans'); root.dataset.theme = (s.theme==='auto') ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : s.theme; clearTimeout(applyAppearance._t); applyAppearance._t = setTimeout(()=>root.classList.remove('th-trans'), 450); };
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
  const ph = $('#set-phint');
  if(ph) ph.innerHTML = [['cd','中文+释义'],['c','仅中文'],['off','无提示']].map(o=>'<button class="chip'+(s.pHint===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
  const th = $('#set-theme');
  if(th) th.innerHTML = [['light','☀️ 浅色'],['dark','🌙 深色'],['auto','🔄 跟随系统']].map(o=>'<button class="chip'+(s.theme===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
  const ft = $('#set-font');
  if(ft) ft.innerHTML = [['s','小号'],['m','中号'],['l','大号']].map(o=>'<button class="chip'+(s.font===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
  const ab = $('#set-about');
  if(ab){
    const zl = WORDS.filter(w=>w.z==='l').length, zw = WORDS.filter(w=>w.z==='w').length;
    ab.innerHTML = '📚 词库共 <b>'+WORDS.length+'</b> 词（🎧 听力 '+zl+' · ✍️ 书写 '+zw+'）· 版本 v10.2<br>🎧 听力专区：听录音抓同义替换、听写拼写、听音选义，对应雅思听力场景。<br>✍️ 书写专区：写作 Task 1 图表词汇与 Task 2 论证词汇，对应雅思写作高频表达。<br>💾 数据只存本机浏览器，登录账号后进度自动云端同步，也可用「数据管理」导出/导入备份。';
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
  on('#set-phint', e=>{ const b=e.target.closest('[data-v]'); if(b) saveSett({pHint:b.dataset.v}); });
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
  learnLimit = 100;            // 筛选/主题/切换视图均重置分页
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
      pHintHtml(q)+
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

/* ================= v10 M2: 词书系统 UI ================= */
var learnBook='all', flashBook='all', pBook='all';
var curBookId = null, curBookQuery = '';
var bookLimit = 100;           // 词书详情列表分页步长
var lastBookQ = '';            // 记录上次词书内查询，变化时重置分页
function bookById(id){ return (typeof BOOKS==='undefined' || !Array.isArray(BOOKS)) ? null : BOOKS.find(b=>b.id===id) || null; }
function bookName(id){ const b = bookById(id); return b ? b.name : String(id); }
function bookWords(id){ return WORDS.filter(w=>(w.b||['default']).includes(id)); }
function bookSourceShort(b){
  const s = b.source || '';
  const i = s.lastIndexOf('/');
  return i >= 0 ? s.slice(i+1) : s;
}
function bookChips(active){
  const rows = [['all','📚 全部',WORDS.length]].concat((typeof BOOKS==='undefined' ? [] : BOOKS).map(b=>[b.id, b.icon+' '+b.name, bookWords(b.id).length]));
  return rows.map(x=>'<button class="chip'+(active===x[0]?' on':'')+'" data-book="'+escapeHtml(x[0])+'">'+escapeHtml(x[1])+' <i>'+x[2]+'</i></button>').join('');
}
const _v10lp = learnPool;
learnPool = function(){
  let list = _v10lp();
  if(learnBook!=='all') list = list.filter(w=>(w.b||['default']).includes(learnBook));
  return list;
};
const _v10rl = renderLearn;
renderLearn = function(){
  _v10rl();
  const el = $('#learn-books'); if(!el) return;
  el.innerHTML = bookChips(learnBook);
  el.onclick = e=>{ const b=e.target.closest('[data-book]'); if(b){ learnBook=b.dataset.book; renderLearn(); } };
};
const _v10rfs = renderFlashSetup;
renderFlashSetup = function(){
  _v10rfs();
  const el = $('#flash-books'); if(!el) return;
  el.innerHTML = bookChips(flashBook);
  el.onclick = e=>{ const b=e.target.closest('[data-book]'); if(b){ flashBook=b.dataset.book; renderFlashSetup(); } };
};
/* 池子构建沿用 v4 的 topic→zone 逻辑，追加 book 过滤（v4 版本不返回池子，只能重写） */
const _v10sf = startFlash;
startFlash = function(){
  let pool = flashTopic==='all' ? WORDS : WORDS.filter(w=>w.t===flashTopic);
  if(flashZone!=='all') pool = pool.filter(w=>w.z===flashZone);
  if(flashBook!=='all') pool = pool.filter(w=>(w.b||['default']).includes(flashBook));
  if(pool.length < 2){ toast('该范围词太少，无法开始'); return; }
  flash = {list:shuffle(pool), idx:0, known:0, unknown:0};
  $('#flash-end').classList.add('hidden');
  $('#flash-game').classList.remove('hidden');
  renderFlashCard();
};
const _v10rps = renderPracticeSetup;
renderPracticeSetup = function(){
  _v10rps();
  const el = $('#p-books'); if(!el) return;
  el.innerHTML = bookChips(pBook);
  el.onclick = e=>{ const b=e.target.closest('[data-book]'); if(b){ pBook=b.dataset.book; renderPracticeSetup(); } };
  const ph = $('#p-hints');
  if(ph){
    const s = sett();
    ph.innerHTML = [['cd','中文+释义'],['c','仅中文'],['off','无提示']].map(o=>'<button class="chip'+(s.pHint===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
    ph.onclick = e=>{ const b=e.target.closest('[data-v]'); if(b){ saveSett({pHint:b.dataset.v}); renderPracticeSetup(); } };
  }
};
const _v10pp = practicePool;
practicePool = function(){
  let list = _v10pp();
  if(pBook!=='all') list = list.filter(w=>(w.b||['default']).includes(pBook));
  return list;
};
const _v10sv = switchView;
switchView = function(name){
  _v10sv(name);
  if(name==='books') renderBooksShelf();
};
function renderBooksShelf(){
  const shelf = $('#books-shelf');
  if(!shelf) return;
  const list = (typeof BOOKS==='undefined' || !Array.isArray(BOOKS)) ? [] : BOOKS;
  if(!list.length){ shelf.innerHTML = '<div class="empty">该词书将在后续版本接入</div>'; return; }
  shelf.innerHTML = '<div class="books-grid">'+list.map(b=>{
    const ws = bookWords(b.id);
    const cnt = ws.length;
    const m = ws.filter(w=>isMastered(w.w)).length;
    return '<div class="book-card" data-book="'+escapeHtml(b.id)+'">'+
      '<span class="bk-ico">'+escapeHtml(b.icon)+'</span>'+
      '<span class="bk-name">'+escapeHtml(b.name)+'</span>'+
      '<span class="bk-desc">'+escapeHtml(b.desc)+'</span>'+
      '<span class="bk-foot"><span>'+cnt+' 词</span><span>'+escapeHtml(bookSourceShort(b))+'</span><span class="bk-flag '+(cnt>0 ? (m>0?'live':'soon') : 'soon')+'">'+(cnt>0 ? ('已掌握 '+m) : '该词书将在后续版本接入')+'</span></span>'+
    '</div>';
  }).join('')+'</div>';
}
const _shEl = $('#books-shelf');
if(_shEl) _shEl.addEventListener('click', e=>{ const c=e.target.closest('.book-card[data-book]'); if(c){ location.hash = '#/book/'+c.dataset.book; if(typeof applyRoute==='function') applyRoute(); } });
function openBookDetail(id){
  const b = bookById(id);
  const shelf = $('#books-shelf');
  const detail = $('#books-detail');
  if(!b || !shelf || !detail) return;
  curBookId = id;
  curBookQuery = '';
  bookLimit = 100; lastBookQ = '';
  shelf.classList.add('hidden');
  detail.classList.remove('hidden');
  const ws = bookWords(id);
  const m = ws.filter(w=>isMastered(w.w)).length;
  const wbN = ws.filter(w=>state.wordbook.includes(w.w)).length;
  detail.innerHTML =
    '<div class="book-detail-cover">'+
      '<span class="bk-ico bk-lg">'+escapeHtml(b.icon)+'</span>'+
      '<span class="bk-name">'+escapeHtml(b.name)+'</span>'+
      '<span class="bk-desc">'+escapeHtml(b.desc)+'</span>'+
      '<span class="bk-foot"><span>共 '+ws.length+' 词</span><span>已掌握 '+m+'</span><span>生词 '+wbN+'</span></span>'+
      '<div class="src-row">'+
        '<span class="src-name">来源</span>'+
        '<span class="src-meta">'+escapeHtml(b.source||'')+'</span>'+
        '<span class="src-license">'+escapeHtml(b.license||'')+'</span>'+
      '</div>'+
      '<div style="display:flex;gap:10px;flex-wrap:wrap">'+
        '<button class="btn btn-ghost btn-sm" data-book-back="1">← 返回</button>'+
        '<button class="btn btn-primary" id="book-recite-btn">📖 开始背诵</button>'+
        '<button class="btn btn-primary" id="book-practice-btn">✍️ 开始练习</button>'+
      '</div>'+
    '</div>'+
    '<div style="margin-bottom:10px"><input id="book-search" type="text" placeholder="🔍 搜索本书单词 / 同义词 / 中文释义…" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></div>'+
    '<div class="book-word-list" id="book-word-list"></div>'+
    '<div id="book-recite" class="hidden"></div>';
  renderBookWordList();
}
function renderBookWordList(){
  const box = $('#book-word-list');
  if(!box || !curBookId) return;
  const ws = bookWords(curBookId);
  if(!ws.length){ box.innerHTML = '<div class="empty">该词书将在后续版本接入</div>'; return; }
  const q = curBookQuery.trim().toLowerCase();
  if(lastBookQ !== q){ lastBookQ = q; bookLimit = 100; }
  const list = q ? ws.filter(w=>w.w.toLowerCase().includes(q) || w.c.includes(curBookQuery.trim()) || w.s.some(s=>s.toLowerCase().includes(q)) || w.e.toLowerCase().includes(q)) : ws;
  if(!list.length){ box.innerHTML = '<div class="empty">没有找到与「<b>'+escapeHtml(curBookQuery.trim())+'</b>」匹配的单词</div>'; return; }
  const shown = list.slice(0, bookLimit);
  box.innerHTML = shown.map(w=>{
    const syn = w.s.map(s=>'<button class="syn-chip'+(dictOf(s)?' linkable':'')+'" data-w="'+escapeHtml(s)+'" data-speak="'+escapeHtml(s)+'">'+escapeHtml(s)+(dictOf(s)?' 📖':'')+'</button>').join('');
    return '<div class="book-word-item" data-w="'+escapeHtml(w.w)+'">'+
      '<span class="bw-word">'+escapeHtml(w.w)+'</span>'+
      '<span class="bw-cn">'+escapeHtml(w.c)+'</span>'+
      '<span class="bw-syn">'+syn+'</span>'+
    '</div>';
  }).join('') +
    (list.length > bookLimit
      ? '<div class="learn-more-bar"><button class="btn btn-ghost btn-sm" id="book-more">加载更多（已显示 '+bookLimit+' / '+list.length+'）</button></div>'
      : '');
  const more = box.querySelector('#book-more');
  if(more) more.addEventListener('click', ()=>{ bookLimit += 100; renderBookWordList(); });
}
function startBookPractice(){
  if(!curBookId) return;
  pBook = curBookId;
  saveSett({book: curBookId});
  renderPracticeSetup();
  switchView('practice');
}
(function bindBookDetail(){
  const bd = $('#books-detail');
  if(!bd) return;
  bd.addEventListener('click', e=>{
    if(e.target.closest('[data-book-back]')){ location.hash = '#/books'; if(typeof applyRoute==='function') applyRoute(); return; }
    if(e.target.closest('#book-recite-btn')){ startRecite(); return; }
    if(e.target.closest('#book-practice-btn')){ startBookPractice(); return; }
    const chip = e.target.closest('.syn-chip[data-w]');
    if(chip){ const cw=chip.dataset.w; if(dictOf(cw)){ openWordDetail(cw); } else { speak(cw); } return; }
    const sp = e.target.closest('[data-speak]');
    if(sp) return;
    const item = e.target.closest('.book-word-item[data-w]');
    if(item) openWordDetail(item.dataset.w);
  });
  bd.addEventListener('input', e=>{ if(e.target && e.target.id==='book-search'){ curBookQuery = e.target.value; renderBookWordList(); } });
})();
const _v10stats = renderStats;
renderStats = function(){ _v10stats(); renderBookProgressPanel(); };
function renderBookProgressPanel(){
  const sec = $('#view-stats');
  if(!sec) return;
  let panel = $('#book-progress-panel');
  if(!panel){
    panel = document.createElement('div');
    panel.className = 'panel book-progress-panel';
    panel.id = 'book-progress-panel';
    panel.innerHTML = '<h3>📚 词书进度 <span style="font-weight:400;color:var(--muted)">（按词书统计学习进度）</span></h3><div id="book-progress-rows"></div>';
    const anchor = $('#topic-progress');
    const ref = anchor ? anchor.closest('.panel') : null;
    if(ref && ref.parentNode) ref.parentNode.insertBefore(panel, ref.nextSibling);
    else sec.appendChild(panel);
  }
  const rows = $('#book-progress-rows');
  if(!rows) return;
  rows.innerHTML = (typeof BOOKS==='undefined' ? [] : BOOKS).map(b=>{
    const ws = bookWords(b.id);
    const seen = ws.filter(w=>wordStat(w.w).seen>0).length;
    const m = ws.filter(w=>isMastered(w.w)).length;
    const pct = ws.length ? Math.round(seen/ws.length*100) : 0;
    return '<div class="book-bar">'+
      '<span class="bn">'+escapeHtml(b.icon)+' '+escapeHtml(b.name)+'</span>'+
      '<div class="track"><div class="fill" style="width:'+pct+'%"></div></div>'+
      '<span class="pct">'+seen+'/'+ws.length+'</span>'+
      '<span style="grid-column:1/-1;font-size:12px;color:var(--muted)">已学 '+seen+' 词 · 已掌握 '+m+' 词</span>'+
    '</div>';
  }).join('');
}
const _v10rs = renderSettings;
renderSettings = function(){ _v10rs(); renderBookSettings(); };
function renderBookSettings(){
  const sec = $('#view-settings');
  if(!sec) return;
  let panel = $('#set-book-panel');
  if(!panel){
    panel = document.createElement('div');
    panel.className = 'panel';
    panel.id = 'set-book-panel';
    panel.innerHTML =
      '<h3>📚 词书</h3>'+
      '<div class="set-row"><div class="set-label">默认词书</div><div class="set-control chips" id="set-book"></div></div>'+
      '<div class="set-row"><div class="set-label">词书来源</div><div class="set-control" id="set-book-src"></div></div>';
    const about = sec.querySelector('#set-about');
    const anchor = about ? about.closest('.panel') : null;
    if(anchor && anchor.parentNode) sec.insertBefore(panel, anchor);
    else sec.appendChild(panel);
  }
  const sb = $('#set-book');
  if(sb){
    sb.innerHTML = bookChips(sett().book || 'all');
    sb.onclick = e=>{ const b=e.target.closest('[data-book]'); if(b){ learnBook = flashBook = pBook = b.dataset.book; saveSett({book:b.dataset.book}); renderLearn(); renderFlashSetup(); renderPracticeSetup(); } };
  }
  const src = $('#set-book-src');
  if(src){
    src.innerHTML = (typeof BOOKS==='undefined' ? [] : BOOKS).map(b=>
      '<div class="src-row">'+
        '<span class="src-name">'+escapeHtml(b.icon)+' '+escapeHtml(b.name)+'</span>'+
        '<span class="src-meta">'+escapeHtml(b.source||'')+'</span>'+
        '<span class="src-license">'+escapeHtml(b.license||'')+'</span>'+
        (b.id==='oxford' ? '<span style="flex-basis:100%;font-size:12px;color:var(--muted)">牛津 3000 词表版权归 Oxford University Press 所有，仅作非商用学习用途，使用需署名</span>' : '')+
      '</div>'
    ).join('');
  }
}
(function initV10(){
  const s0 = sett();
  if(s0 && s0.book) learnBook = flashBook = pBook = s0.book;
  const fsBtn = $('#flash-start');
  if(fsBtn){
    const cl = fsBtn.cloneNode(true);
    fsBtn.parentNode.replaceChild(cl, fsBtn);
    cl.addEventListener('click', startFlash);
  }
  renderBooksShelf();
  renderLearn();
  renderFlashSetup();
  renderPracticeSetup();
})();
/* ================= v10.3: 背诵模式 ================= */
let recite = {book:'', pool:[], rep:[], wrongs:[], idx:0, correct:0, wrong:0, round:0, order:'seq'};
function reciteStore(){
  if(!state.recite || typeof state.recite!=='object') state.recite = {books:{}};
  if(!state.recite.books || typeof state.recite.books!=='object') state.recite.books = {};
  return state.recite;
}
function startRecite(){
  if(!curBookId) return;
  const ws = bookWords(curBookId);
  if(ws.length===0){ toast('该词书暂无单词，将在后续版本接入'); return; }
  recite.book = curBookId;
  const cover = document.querySelector('.book-detail-cover');
  if(cover) cover.classList.add('hidden');
  const sb = $('#book-search');
  if(sb && sb.parentNode) sb.parentNode.style.display = 'none';
  const wl = $('#book-word-list');
  if(wl) wl.classList.add('hidden');
  const br = $('#book-recite');
  if(!br) return;
  br.classList.remove('hidden');
  brSetup();
}
function brSetup(){
  const br = $('#book-recite');
  if(!br) return;
  const ws = bookWords(recite.book);
  const st = reciteStore();
  const rb = st.books[recite.book];
  const stats = (rb && rb.rounds) ? ('本书累计背诵 '+rb.rounds+' 轮 · 累计正确率 '+Math.round(rb.correct/(rb.correct+rb.wrong)*100)+'%') : '尚未背诵过';
  br.innerHTML =
    '<div class="br-setup">'+
      '<h3>📖 背诵模式 <span style="font-weight:400;color:var(--muted)">共 '+ws.length+' 词</span></h3>'+
      '<div class="br-desc">逐词过一遍，不认识的单词会进入下一遍重复，直到全部认识为止。点「✗ 不认识」或「✓ 认识」继续。</div>'+
      '<div class="chips">'+
        '<button class="chip'+(recite.order==='seq'?' on':'')+'" data-order="seq">顺序</button>'+
        '<button class="chip'+(recite.order==='rand'?' on':'')+'" data-order="rand">乱序</button>'+
      '</div>'+
      '<div class="br-stats">'+stats+'</div>'+
      '<button class="btn btn-primary" id="br-start">🚀 开始背诵</button>'+
    '</div>';
  const start = $('#br-start');
  if(start) start.addEventListener('click', ()=>beginReciteRound(recite.order==='rand' ? shuffle(ws) : ws.slice()));
  br.querySelectorAll('.chip[data-order]').forEach(c=>c.addEventListener('click', ()=>{
    recite.order = c.dataset.order;
    br.querySelectorAll('.chip[data-order]').forEach(x=>x.classList.toggle('on', x===c));
  }));
}
function beginReciteRound(pool){
  recite.pool = pool;
  recite.rep = [];
  recite.idx = 0;
  recite.correct = 0;
  recite.wrong = 0;
  recite.wrongs = [];
  recite.round = 0;
  const br = $('#book-recite');
  if(!br) return;
  br.innerHTML = brGame();
  bindReciteEvents();
  renderReciteCard();
}
function brGame(){
  return '<div class="br-game">'+
    '<div class="br-progress"><div class="br-fill" id="br-fill"></div></div>'+
    '<div class="br-meta">'+
      '<span class="br-pos" id="br-pos"></span>'+
      '<span class="br-rep hidden" id="br-rep"></span>'+
    '</div>'+
    '<div class="br-card">'+
      '<div class="br-head">'+
        '<span class="br-word" id="br-word"></span>'+
        '<button class="icon-btn" id="br-speak" data-speak="">🔊</button>'+
      '</div>'+
      '<span class="br-ipa" id="br-ipa"></span>'+
      '<span class="br-pos-tag" id="br-pos-tag"></span>'+
      '<div class="br-cn" id="br-cn"></div>'+
      '<div class="br-ex" id="br-ex"></div>'+
    '</div>'+
    '<div class="br-btns">'+
      '<button class="btn btn-red" id="br-no">✗ 不认识</button>'+
      '<button class="btn btn-green" id="br-yes">✓ 认识</button>'+
      '<button class="btn btn-ghost btn-sm" id="br-exit">✕ 退出</button>'+
    '</div>'+
  '</div>';
}
function bindReciteEvents(){
  const no = $('#br-no');
  if(no) no.addEventListener('click', ()=>{
    const e = recite.pool[recite.idx];
    if(!e) return;
    recite.wrong++;
    if(!recite.wrongs.some(x=>x.w===e.w)) recite.wrongs.push(e); // 再背错词池按词去重
    if(recite.round === 0) recite.rep.push(e); // 仅首遍收集重复队列，重复遍不再循环入队
    recordAnswer(e.w, false);
    nextRecite();
  });
  const yes = $('#br-yes');
  if(yes) yes.addEventListener('click', ()=>{
    const e = recite.pool[recite.idx];
    if(!e) return;
    recite.correct++;
    recordAnswer(e.w, true);
    nextRecite();
  });
  const ex = $('#br-exit');
  if(ex) ex.addEventListener('click', exitRecite);
  const sp = $('#br-speak');
  if(sp) sp.addEventListener('click', ()=>{ if(sp.dataset.speak) speak(sp.dataset.speak); });
}
function nextRecite(){
  recite.idx++;
  if(recite.idx < recite.pool.length){ renderReciteCard(); return; }
  if(recite.rep.length > 0){
    recite.pool = recite.rep;
    recite.rep = [];
    recite.idx = 0;
    recite.round++;
    renderReciteCard();
    return;
  }
  showReciteResult();
}
function renderReciteCard(){
  const pool = recite.pool;
  if(!pool || !pool.length) return;
  const e = pool[recite.idx];
  if(!e) return;
  const pos = $('#br-pos');
  if(pos) pos.textContent = '第 '+(recite.idx+1)+' / '+pool.length+' 词';
  const fill = $('#br-fill');
  if(fill) fill.style.width = Math.round((recite.idx/pool.length)*100)+'%';
  const rep = $('#br-rep');
  if(rep){
    if(recite.round > 0){
      rep.textContent = '🔁 重复遍 '+recite.round+' · 剩余 '+(pool.length-recite.idx)+' 词';
      rep.classList.remove('hidden');
    } else {
      rep.classList.add('hidden');
    }
  }
  const wEl = $('#br-word'); if(wEl) wEl.textContent = e.w;
  const iEl = $('#br-ipa'); if(iEl) iEl.textContent = e.p || '';
  const pEl = $('#br-pos-tag'); if(pEl) pEl.textContent = e.pos || '';
  const cEl = $('#br-cn'); if(cEl) cEl.textContent = e.c || '';
  const xEl = $('#br-ex'); if(xEl) xEl.innerHTML = e.e ? highlight(e.e, e.k) : '';
  const sp = $('#br-speak'); if(sp) sp.dataset.speak = e.w;
}
function showReciteResult(){
  const total = recite.correct + recite.wrong;
  const acc = total ? Math.round(recite.correct/total*100) : 0;
  const st = reciteStore();
  const rb = st.books[recite.book] || {rounds:0, correct:0, wrong:0, last:''};
  rb.rounds++;
  rb.correct += recite.correct;
  rb.wrong += recite.wrong;
  rb.last = todayStr();
  st.books[recite.book] = rb;
  saveState();
  const br = $('#book-recite');
  if(!br) return;
  const wrongN = recite.wrong;
  br.innerHTML = brResult(acc, total, wrongN);
  const again = $('#br-again');
  if(again) again.addEventListener('click', ()=>beginReciteRound(recite.wrongs.slice()));
  const done = $('#br-done');
  if(done) done.addEventListener('click', exitRecite);
  if(wrongN===0) toast('全部认识，太棒了！');
}
function brResult(acc, total, wrongN){
  return '<div class="br-result">'+
    '<div class="br-big">'+(acc>=80 ? '🎉' : '💪')+'</div>'+
    '<div class="br-res-title" id="br-res-title">本组背诵完成！</div>'+
    '<div class="br-res-line" id="br-res-line">共背 '+total+' 词 · ✓ 认识 '+recite.correct+' · ✗ 不认识 '+recite.wrong+' · 正确率 '+acc+'%'+(wrongN>0 ? ' · 已记录累计统计' : '')+'</div>'+
    (wrongN>0 ? '<button class="btn btn-primary" id="br-again">🔁 再背错词</button>' : '')+
    '<button class="btn btn-ghost" id="br-done">✅ 完成</button>'+
  '</div>';
}
function exitRecite(){
  const cover = document.querySelector('.book-detail-cover');
  if(cover) cover.classList.remove('hidden');
  const sb = $('#book-search');
  if(sb && sb.parentNode) sb.parentNode.style.display = '';
  const wl = $('#book-word-list');
  if(wl) wl.classList.remove('hidden');
  const br = $('#book-recite');
  if(br) br.classList.add('hidden');
}

/* ================= v11: 哈希路由 + 转场（V10 M4） ================= */
/* URL 形如 #/learn #/flash #/book/jianqiao #/stats #/settings
   - tab 点击 → 写 hash（可前进/后退/分享）
   - hashchange → applyRoute 切换 view，沿用 .view.active 的 viewIn 转场
   - 程序化 switchView（首页卡片/弹窗标签等）→ replaceState 同步 URL，不推历史、不触发 hashchange */
let __routeApplying = false;
const ROUTE_VIEWS = new Set(['home','learn','flash','practice','stats','settings','books']);
function parseRoute(){
  const h = (location.hash || '').replace(/^#\/?/, '').trim();
  if(!h) return {view:'home'};
  const parts = h.split('/').filter(Boolean);
  if(ROUTE_VIEWS.has(parts[0])) return {view:parts[0]};
  if(parts[0]==='book' && parts[1]) return {view:'books', book:parts[1]};
  return {view:'home'};
}
function showBookShelf(){
  const s = $('#books-shelf'), d = $('#books-detail');
  if(s) s.classList.remove('hidden');
  if(d) d.classList.add('hidden');
}
function applyRoute(){
  __routeApplying = true;
  try{
    const r = parseRoute();
    switchView(r.view);
    if(r.view==='books'){ if(r.book && typeof bookById==='function' && bookById(r.book)) openBookDetail(r.book); else showBookShelf(); }
  } finally { __routeApplying = false; }
}
const _v11sv = switchView;
switchView = function(name){
  _v11sv(name);
  if(!__routeApplying && typeof history!=='undefined' && history.replaceState && name && name.indexOf('/')<0){
    const want = '#/'+name;
    if(location.hash !== want) history.replaceState(null, '', want);
  }
};
/* tab 点击改为写 hash（克隆替换以去掉基础 JS 的直连 switchView 绑定） */
$$('.tab').forEach(tab=>{
  const cl = tab.cloneNode(true);
  tab.parentNode.replaceChild(cl, tab);
  cl.addEventListener('click', ()=>{ location.hash = '#/'+cl.dataset.view; applyRoute(); });
});
window.addEventListener('hashchange', applyRoute);
applyRoute();