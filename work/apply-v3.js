'use strict';
const fs = require('fs');
const BASE = 'outputs/index.html';
const FJS = 'work/features.js';
const FCSS = 'work/features.css';

let h = fs.readFileSync(BASE, 'utf8');
let fj = fs.readFileSync(FJS, 'utf8');
let fc = fs.readFileSync(FCSS, 'utf8');

const V3_MARK = '/* ================= v3: 每日目标 + 打卡系统 ================= */';
if (h.includes('const DEFAULT_GOAL = 30;') && fj.includes(V3_MARK) && fc.includes('v3: 每日目标 + 打卡')) {
  console.log('v3 already applied, skip'); process.exit(0);
}
function mustReplace(src, from, to){
  if(!src.includes(from)) throw new Error('anchor not found: ' + from.slice(0, 70));
  return src.split(from).join(to);
}
function mustSlice(src, startAnchor, endAnchor, replacement){
  const i = src.indexOf(startAnchor);
  if(i<0) throw new Error('start anchor missing: ' + startAnchor.slice(0, 70));
  const j = src.indexOf(endAnchor, i + startAnchor.length);
  if(j<0) throw new Error('end anchor missing: ' + endAnchor.slice(0, 70));
  return src.slice(0, i) + replacement + src.slice(j + endAnchor.length);
}

/* ---------- base edits ---------- */
h = mustReplace(h, 'const GOAL = 30;', 'const DEFAULT_GOAL = 30;');
h = mustReplace(h,
  "function defaultState(){ return { stats:{}, daily:{date:'',count:0}, streak:0, lastDate:'', wordbook:[] }; }",
  "function defaultState(){ return { stats:{}, daily:{date:'',count:0}, streak:0, lastDate:'', wordbook:[], goal:DEFAULT_GOAL, checkins:[] }; }");
h = mustSlice(h, 'function renderHeaderStats(){', '}',
`function renderHeaderStats(){
  const el = $('#streak-badge');
  el.textContent = '🔥 连续打卡 ' + checkinStreak() + ' 天 · 今日 ' + state.daily.count + '/' + (state.goal||DEFAULT_GOAL) + ' 词';
}`);
h = mustReplace(h,
  'const today = state.daily.date===todayStr() ? state.daily.count : 0;',
  'const today = state.daily.date===todayStr() ? state.daily.count : 0;\n  const goal = state.goal || DEFAULT_GOAL;');
h = mustSlice(h, "$('#stat-cards').innerHTML = [", '].map(',
`$('#stat-cards').innerHTML = [
    ['🎯','今日练习', today+' / '+goal],
    ['📝','累计题目', totalSeen],
    ['✅','正确率', acc+'%'],
    ['🏅','已掌握', mastered+' 词'],
    ['📚','生词本', state.wordbook.length+' 词'],
    ['🗓️','累计打卡', (state.checkins||[]).length+' 天'],
    ['🔥','连续打卡', checkinStreak()+' 天']
  ].map(`);
fs.writeFileSync(BASE, h, 'utf8');
console.log('base edits OK');

/* ---------- features.js append ---------- */
const V3_JS = `/* ================= v3: 每日目标 + 打卡系统 ================= */
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
`;
fj += '\n\n' + V3_JS;
fs.writeFileSync(FJS, fj, 'utf8');
console.log('features.js append OK');

/* ---------- features.css append ---------- */
const V3_CSS = `/* ===== v3: 每日目标 + 打卡 ===== */
.checkin-panel .checkin-top{display:flex;gap:26px;flex-wrap:wrap;margin-top:14px}
.goal-box{flex:1;min-width:220px}
.goal-label{font-size:12px;color:var(--muted);letter-spacing:1px;margin-bottom:8px;font-weight:600}
.goal-presets{display:flex;gap:8px;flex-wrap:wrap}
.goal-presets .btn.active{background:var(--primary);color:#fff;border-color:var(--primary)}
.goal-custom{display:flex;gap:8px;margin-top:10px}
.goal-custom input{width:110px;padding:8px 10px;border:1px solid #d7e0ea;border-radius:10px;font-size:14px;background:var(--card);color:var(--ink)}
.goal-custom input:focus{outline:none;border-color:var(--primary)}
.checkin-now{flex:1;min-width:250px;background:#f4f8fd;border:1px dashed #c9d8ea;border-radius:14px;padding:14px 16px}
.checkin-today{font-size:14px;font-weight:700;margin-bottom:8px}
.goal-bar{height:10px;background:#e3eaf3;border-radius:99px;overflow:hidden;margin-bottom:8px}
.goal-bar .fill{height:100%;background:linear-gradient(90deg,#ff9a3c,#ff6b6b);border-radius:99px;transition:width .3s}
.checkin-msg{font-size:13px;color:var(--muted);margin-bottom:10px;min-height:18px}
#checkin-btn:disabled{opacity:.55;cursor:default}
.calendar{margin-top:18px;border-top:1px dashed #dde6f0;padding-top:14px}
.cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.cal-title{font-weight:700;font-size:15px}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.cal-dow{font-size:11px;color:var(--muted);text-align:center;padding:4px 0;font-weight:600}
.cal-cell{aspect-ratio:1;border-radius:10px;background:#f1f5fa;display:flex;align-items:center;justify-content:center;font-size:13px;color:#46586b;border:1px solid transparent}
.cal-cell.checked{background:linear-gradient(135deg,#34c98b,#1fa875);color:#fff;font-weight:700}
.cal-cell.today{border-color:var(--primary);box-shadow:0 0 0 2px rgba(45,120,225,.18);font-weight:700}
.cal-cell.future{opacity:.35}
.cal-cell.empty{background:none}
.cal-foot{margin-top:10px;font-size:12px;color:var(--muted)}
`;
fc += '\n' + V3_CSS;
fs.writeFileSync(FCSS, fc, 'utf8');
console.log('features.css append OK');
console.log('apply-v3 done');