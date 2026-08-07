'use strict';
const fs = require('fs');
const { DICT, NEW } = require('./dict-data.js');
const { V4NEW } = require('./v4-words.js');
const { V5NEW } = require('./v5-words.js');
const { V6NEW } = require('./v6-words.js');
const { V7NEW } = require('./v7-words.js');
const { V8NEW } = require('./v8-words.js');
const OUT = 'outputs/index.html';
const CSS_MARK = '/* ===== v2: 单词详情弹窗 / 备份 ===== */';
const HTML_MARK = '<!-- ============ 单词详情弹窗 v2 ============ -->';
const JS_MARK = '/* ================= v2: 单词详情弹窗 ================= */';
const UTIL_ANCHOR = '/* ===UTIL=== */';
let html = fs.readFileSync(OUT, 'utf8');

/* ---------- 0. 清理上一次注入（幂等） ---------- */
const cut = (from, to, keepTo) => {
  const i = html.indexOf(from);
  if (i < 0) return false;
  const j = to === null ? html.length : html.indexOf(to, i + from.length);
  if (j < 0) throw new Error('anchor missing: ' + to);
  html = html.slice(0, i) + (keepTo ? html.slice(j) : html.slice(j + to.length));
  return true;
};
while (cut(JS_MARK, '</script>', true)) {}
while (cut(HTML_MARK, '</main>', true)) {}
while (cut(CSS_MARK, '</style>', true)) {}
while (cut('const DICT = {', UTIL_ANCHOR, true)) {}

/* ---------- 1. 提取并合并词库 ---------- */
const arrStart = html.indexOf('const WORDS = [');
if (arrStart < 0) throw new Error('WORDS block not found');
const arrEnd = html.indexOf('];', arrStart);
if (arrEnd < 0) throw new Error('WORDS array end not found');
const block = html.slice(arrStart, arrEnd + 2);
function extractEntries(src){
  const out = []; let cur = '', depth = 0, inStr = false, esc = false;
  for (const ch of src){
    if (inStr){
      cur += ch;
      if (esc){ esc = false; continue; }
      if (ch === '\\'){ esc = true; continue; }
      if (ch === "'"){ inStr = false; }
      continue;
    }
    if (ch === "'"){ inStr = true; cur += ch; continue; }
    if (ch === '{'){ if (depth === 0) cur = ''; depth++; cur += ch; continue; }
    if (ch === '}'){ depth--; cur += ch; if (depth === 0){ out.push(cur); cur = ''; } continue; }
    if (depth === 0) continue;
    cur += ch;
  }
  return out;
}
// 原始词库从 app.js（旧版页面 JS 快照）提取，保证例句/关键词完整
const appSrc = fs.readFileSync('work/app.js', 'utf8');
const appStart = appSrc.indexOf('const WORDS = [');
const appEnd = appSrc.indexOf('];', appStart);
const entries = extractEntries(appSrc.slice(appSrc.indexOf('[', appStart) + 1, appEnd));
console.log('existing entries extracted from app.js:', entries.length);
if (entries.length !== 173) throw new Error('expected 173 original entries, got ' + entries.length);
const K_FIX = { suggest: 'points to', agree: 'in favour of' };
const existing = entries.map(l => {
  const obj = eval('(' + l.trim().replace(/,\s*$/, '') + ')');
  if (!DICT[obj.w]) throw new Error('missing DICT for existing word: ' + obj.w);
  obj.p = DICT[obj.w][0]; obj.pos = DICT[obj.w][1]; obj.d = DICT[obj.w][2];
  obj.z = 'l';
  if (K_FIX[obj.w]) obj.k = K_FIX[obj.w];
  return obj;
});
const all = existing.concat(NEW.map(w => Object.assign({}, w, { z: w.z || 'l' }))).concat(V4NEW).concat(V5NEW).concat(V6NEW).concat(V7NEW).concat(V8NEW);
const seen = new Set();
all.forEach(w => {
  if (seen.has(w.w)) throw new Error('duplicate word: ' + w.w);
  seen.add(w.w);
  ['t','w','s','c','e','k','p','pos','d','z'].forEach(f => { if (w[f] === undefined || w[f] === '') throw new Error('missing field ' + f + ' for ' + w.w); });
  if (w.z !== 'l' && w.z !== 'w') throw new Error('bad zone for ' + w.w);
  if (!Array.isArray(w.s) || !w.s.length) throw new Error('bad synonyms for ' + w.w);
});
const zc = all.reduce((a,w)=>{ a[w.z]=(a[w.z]||0)+1; return a; }, {});
console.log('existing:', existing.length, '| new:', NEW.length, '| v4new:', V4NEW.length, '| total:', all.length, '| zones:', JSON.stringify(zc));

/* ---------- 2. 序列化 ---------- */
function jsStr(s){ return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r/g, '').replace(/\n/g, '\\n') + "'"; }
function entryStr(o){
  return '{t:' + jsStr(o.t) + ',w:' + jsStr(o.w) + ',s:[' + o.s.map(jsStr).join(',') + '],c:' + jsStr(o.c) +
    ',e:' + jsStr(o.e) + ',k:' + jsStr(o.k) + ',p:' + jsStr(o.p) + ',pos:' + jsStr(o.pos) + ',d:' + jsStr(o.d) + ',z:' + jsStr(o.z) + '}';
}
const newBlock = 'const WORDS = [\n' + all.map(entryStr).join(',\n') + '\n];';
html = html.replace(block, newBlock);

/* ---------- 3. 注入 DICT ---------- */
if (!html.includes(UTIL_ANCHOR)) throw new Error('UTIL anchor not found');
const dictConst = '\n\nconst DICT = {\n' + Object.keys(DICT).map(k => '  ' + jsStr(k) + ':[' + DICT[k].map(jsStr).join(',') + ']').join(',\n') + '\n};\n\n' + UTIL_ANCHOR;
html = html.replace(UTIL_ANCHOR, dictConst);

/* ---------- 4. 注入 CSS ---------- */
const styleEnd = html.lastIndexOf('</style>');
if (styleEnd < 0) throw new Error('style end not found');
html = html.slice(0, styleEnd) + fs.readFileSync('work/features.css', 'utf8').replace(/^\uFEFF/, '') + '\n' + html.slice(styleEnd);

/* ---------- 5. 注入弹窗 HTML ---------- */
const mainEnd = html.lastIndexOf('</main>');
if (mainEnd < 0) throw new Error('main end not found');
html = html.slice(0, mainEnd) + fs.readFileSync('work/modal.html', 'utf8') + html.slice(mainEnd);

/* ---------- 6. 注入 JS ---------- */
const scriptEnd = html.lastIndexOf('</script>');
if (scriptEnd < 0) throw new Error('script end not found');
const js = fs.readFileSync('work/features.js', 'utf8');
if (js.includes('</script')) throw new Error('features.js contains script close tag!');
let jsAll = js;
if (fs.existsSync('work/cloud.js')){
  const cloud = fs.readFileSync('work/cloud.js', 'utf8');
  if (cloud.includes('</script')) throw new Error('cloud.js contains script close tag!');
  jsAll += '\n' + cloud;
}
html = html.slice(0, scriptEnd) + '\n' + jsAll + '\n' + html.slice(scriptEnd);

/* ---------- 7. 写回 ---------- */
fs.writeFileSync(OUT, html, 'utf8');
console.log('build OK, size:', Buffer.byteLength(html));