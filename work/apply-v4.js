'use strict';
const fs = require('fs');
const BASE = 'outputs/index.html';
const FJS = 'work/features.js';
const FCSS = 'work/features.css';
let h = fs.readFileSync(BASE, 'utf8');
let fj = fs.readFileSync(FJS, 'utf8');
let fc = fs.readFileSync(FCSS, 'utf8');
const V4_MARK = '/* ================= v4: 设置 + 专区 + 新模式 ================= */';
function mustReplace(src, from, to){ if(!src.includes(from)) throw new Error('anchor not found: ' + from.slice(0,90)); return src.split(from).join(to); }
function applyOnce(src, from, to, marker){ if(src.includes(marker)) return src; return mustReplace(src, from, to); }
/* ---------- base html patches (幂等) ---------- */
h = applyOnce(h,
  '<button class="tab" data-view="stats">📊 统计</button>\n</nav>',
  '<button class="tab" data-view="stats">📊 统计</button>\n  <button class="tab" data-view="settings">⚙️ 设置</button>\n</nav>',
  'data-view="settings"');
h = applyOnce(h, '<title>雅思听力同义替换训练营</title>', '<title>雅思同义替换训练营（听力 · 书写）</title>', '雅思同义替换训练营（听力 · 书写）');
h = applyOnce(h,
  '<div class="brand">🎧 雅思听力同义替换训练营\n      <small>题干换说法，答案照样拿分 · IELTS Listening Synonym Trainer</small>',
  '<div class="brand">🎧 雅思同义替换训练营（听力 · 书写）\n      <small>听力同义替换 + 写作高分词汇 · IELTS Synonym Trainer</small>',
  '听力同义替换 + 写作高分词汇');
h = applyOnce(h,
  '<label class="type-card"><input type="radio" name="ptype" value="listen"><span class="t-icon">🔊</span><div class="t-name">听力题</div><div class="t-desc">听句子，抓同义词</div></label>\n      </div>',
  '<label class="type-card"><input type="radio" name="ptype" value="listen"><span class="t-icon">🔊</span><div class="t-name">听力题</div><div class="t-desc">听句子，抓同义词</div></label>\n        <label class="type-card"><input type="radio" name="ptype" value="dict"><span class="t-icon">⌨️</span><div class="t-name">听写模式</div><div class="t-desc">听发音，拼写单词</div></label>\n        <label class="type-card"><input type="radio" name="ptype" value="word2cn"><span class="t-icon">🤔</span><div class="t-name">看词选义</div><div class="t-desc">看单词，选中文释义</div></label>\n        <label class="type-card"><input type="radio" name="ptype" value="l2cn"><span class="t-icon">🎧</span><div class="t-name">听音选义</div><div class="t-desc">听发音，选中文释义</div></label>\n      </div>',
  'value="l2cn"');
h = applyOnce(h,
  '      <div class="chips" id="learn-topics"></div>\n      <div class="search-wrap">',
  '      <div class="chips" id="learn-zones"></div>\n      <div class="chips" id="learn-topics"></div>\n      <div class="search-wrap">',
  'id="learn-zones"');
h = applyOnce(h,
  '<h3>1. 选择主题</h3>\n      <div class="chips" id="flash-topics"></div>',
  '<h3>1. 选择专区 / 主题</h3>\n      <div class="chips" id="flash-zones"></div>\n      <div class="chips" id="flash-topics"></div>',
  'id="flash-zones"');
h = applyOnce(h,
  '<h3>1. 选择主题 <span style="font-weight:400;color:var(--muted)">（不选 = 全部）</span></h3>\n      <div class="chips" id="p-topics"></div>',
  '<h3>1. 选择专区 / 主题 <span style="font-weight:400;color:var(--muted)">（主题不选 = 全部）</span></h3>\n      <div class="chips" id="p-zones"></div>\n      <div class="chips" id="p-topics"></div>',
  'id="p-zones"');
h = applyOnce(h,
  "function defaultState(){ return { stats:{}, daily:{date:'',count:0}, streak:0, lastDate:'', wordbook:[], goal:DEFAULT_GOAL, checkins:[] }; }",
  "function defaultState(){ return { stats:{}, daily:{date:'',count:0}, streak:0, lastDate:'', wordbook:[], goal:DEFAULT_GOAL, checkins:[], settings:defaultSettings() }; }",
  'settings:defaultSettings()');
h = applyOnce(h,
  '<!-- ============ 单词详情弹窗 v2 ============ -->',
  `  <!-- ============ 设置 v4 ============ -->
  <section id="view-settings" class="view">
    <div class="tip">⚙️ 在这里调整学习目标、发音、练习偏好和界面外观；所有设置自动保存在本机浏览器，换设备可用「数据管理」里的导出/导入迁移。</div>
    <div class="panel">
      <h3>🎯 学习目标</h3>
      <div class="set-row">
        <div class="set-label">每日学习目标</div>
        <div class="set-control">
          <div class="goal-presets" id="set-goal-presets"></div>
          <div class="goal-custom">
            <input id="set-goal-input" type="number" min="1" max="500" placeholder="自定义 1~500">
            <button class="btn btn-primary btn-sm" id="set-goal-save">保存</button>
          </div>
          <div class="set-hint">今日进度见「统计」页打卡面板，达成目标后记得打卡。</div>
        </div>
      </div>
    </div>
    <div class="panel">
      <h3>🔊 发音设置</h3>
      <div class="set-row"><div class="set-label">口音</div><div class="set-control chips" id="set-voice"></div></div>
      <div class="set-row"><div class="set-label">语速</div><div class="set-control chips" id="set-rate"></div></div>
    </div>
    <div class="panel">
      <h3>✍️ 练习偏好</h3>
      <div class="set-row"><div class="set-label">默认题数</div><div class="set-control chips" id="set-pcount"></div></div>
      <div class="set-row"><div class="set-label">默认出题方向</div><div class="set-control chips" id="set-pdir"></div></div>
    </div>
    <div class="panel">
      <h3>🎨 外观</h3>
      <div class="set-row"><div class="set-label">主题</div><div class="set-control chips" id="set-theme"></div></div>
      <div class="set-row"><div class="set-label">字号</div><div class="set-control chips" id="set-font"></div></div>
    </div>
    <div class="panel">
      <h3>💾 数据管理</h3>
      <div class="set-row">
        <div class="set-label">备份与恢复</div>
        <div class="set-control">
          <div class="data-actions">
            <button class="btn btn-ghost btn-sm" id="set-export">📤 导出备份</button>
            <button class="btn btn-ghost btn-sm" id="set-import-btn">📥 导入备份</button>
            <input type="file" id="set-import-file" accept="application/json" hidden>
            <button class="btn btn-red btn-sm" id="set-reset">🗑️ 重置全部数据</button>
          </div>
          <div class="set-hint">进度仅保存在本机浏览器（localStorage），清除浏览器数据会丢失进度，建议定期导出。</div>
        </div>
      </div>
    </div>
    <div class="panel">
      <h3>ℹ️ 关于</h3>
      <div class="about-line" id="set-about"></div>
    </div>
  </section>
  <!-- ============ 单词详情弹窗 v2 ============ -->`,
  'id="view-settings"');
fs.writeFileSync(BASE, h, 'utf8');
console.log('base html patches OK');/* ---------- features.js: 音标回退（幂等） ---------- */
if(!fj.includes('(entry && entry.p)')){
  fj = mustReplace(fj,
    "  const ipa = d ? d[0] : '';\n  const pos = d ? d[1] : '';\n  const def = d ? d[2] : '';",
    "  const ipa = (d && d[0]) || (entry && entry.p) || '';\n  const pos = (d && d[1]) || (entry && entry.pos) || '';\n  const def = (d && d[2]) || (entry && entry.d) || '';");
}
/* ---------- features.js append v4（先清旧块再追加，自愈） ---------- */
const v4jIdx = fj.indexOf(V4_MARK);
if(v4jIdx >= 0){ fj = fj.slice(0, v4jIdx).replace(/\s+$/, '\n'); }
fj += '\n\n' + fs.readFileSync('work/v4-features.js', 'utf8');
if (fj.includes('</script')) throw new Error('features.js contains script close tag!');
fs.writeFileSync(FJS, fj, 'utf8');
console.log('features.js OK, size:', fj.length);
/* ---------- features.css append v4（先清旧块再追加，自愈） ---------- */
const v4cIdx = fc.indexOf('/* ===== v4: 设置 + 专区 + 新模式 ===== */');
if(v4cIdx >= 0){ fc = fc.slice(0, v4cIdx).replace(/\s+$/, '\n'); }
fc += '\n' + fs.readFileSync('work/v4.css', 'utf8');
fs.writeFileSync(FCSS, fc, 'utf8');
console.log('features.css OK, size:', fc.length);
console.log('apply-v4 done');