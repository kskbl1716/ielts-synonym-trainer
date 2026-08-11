'use strict';
const fs = require('fs');
const { DICT, NEW } = require('./dict-data.js');
const { V4NEW } = require('./v4-words.js');
const { V5NEW } = require('./v5-words.js');
const { V6NEW } = require('./v6-words.js');
const { V7NEW } = require('./v7-words.js');
const { V8NEW } = require('./v8-words.js');
const { BOOKS } = require('./books.js');
const { assignLv } = require('./lv-assign.js');
const V10LISTEN = [].concat(
  require('./v10-listening-a1.js').V10LIST_A1,
  require('./v10-listening-a2.js').V10LIST_A2,
  require('./v10-listening-a3.js').V10LIST_A3,
  require('./v10-listening-a4.js').V10LIST_A4,
  require('./v10-listening-a5.js').V10LIST_A5,
  require('./v10-listening-a6.js').V10LIST_A6,
  require('./v10-listening-b1.js').V10LIST_B1,
  require('./v10-listening-b2.js').V10LIST_B2,
  require('./v10-listening-b3.js').V10LIST_B3,
  require('./v10-listening-b4.js').V10LIST_B4,
  require('./v10-listening-b5.js').V10LIST_B5
);
const V10JQ = [].concat(
  require('./v10-jianqiao-c1.js').V10JQ_C1,
  require('./v10-jianqiao-c2.js').V10JQ_C2,
  require('./v10-jianqiao-c3.js').V10JQ_C3,
  require('./v10-jianqiao-c4.js').V10JQ_C4,
  require('./v10-jianqiao-c5.js').V10JQ_C5,
  require('./v10-jianqiao-c6.js').V10JQ_C6
);
const V10ZJ = [].concat(
  require('./v10-zhenjing-d1.js').V10ZJ_D1,
  require('./v10-zhenjing-d2.js').V10ZJ_D2,
  require('./v10-zhenjing-d3.js').V10ZJ_D3,
  require('./v10-zhenjing-d4.js').V10ZJ_D4,
  require('./v10-zhenjing-d5.js').V10ZJ_D5,
  require('./v10-zhenjing-d6.js').V10ZJ_D6,
  require('./v10-zhenjing-e1.js').V10ZJ_E1,
  require('./v10-zhenjing-e2.js').V10ZJ_E2,
  require('./v10-zhenjing-e3.js').V10ZJ_E3,
  require('./v10-zhenjing-e4.js').V10ZJ_E4,
  require('./v10-zhenjing-e5.js').V10ZJ_E5,
  require('./v10-zhenjing-e6.js').V10ZJ_E6,
  require('./v10-zhenjing-e7.js').V10ZJ_E7
);
const { V10AWL } = require('./v10-awl-f1.js');
const { AWL_WORDS } = require('./v10-awl-words.js');
const { V10B9 } = require('./v10-band9-h1.js');
const { BAND9_WORDS } = require('./v10-band9-words.js');
const V10NAWL = [].concat(
  require('./v10-nawl-a1.js').V10NAWL_A1,
  require('./v10-nawl-a2.js').V10NAWL_A2,
  require('./v10-nawl-a3.js').V10NAWL_A3,
  require('./v10-nawl-a4.js').V10NAWL_A4
);
const { NAWL_WORDS } = require('./v10-nawl-words.js');
const { V10SPOKEN_ADD } = require('./v10-spoken-add.js');
const { SPOKEN_WORDS } = require('./v10-spoken-words.js');
const { V10CAMB_ADD } = require('./v10-camb-add.js');
const { CAMB_WORDS } = require('./v10-camb-words.js');
const V10OX = [].concat(
  require('./v10-oxford-j1.js').V10OX_J1,
  require('./v10-oxford-j2.js').V10OX_J2,
  require('./v10-oxford-j3.js').V10OX_J3,
  require('./v10-oxford-j4.js').V10OX_J4,
  require('./v10-oxford-j5.js').V10OX_J5,
  require('./v10-oxford-j6.js').V10OX_J6,
  require('./v10-oxford-j7.js').V10OX_J7,
  require('./v10-oxford-k1.js').V10OX_K1,
  require('./v10-oxford-k2.js').V10OX_K2,
  require('./v10-oxford-k3.js').V10OX_K3,
  require('./v10-oxford-k4.js').V10OX_K4,
  require('./v10-oxford-k5.js').V10OX_K5,
  require('./v10-oxford-k6.js').V10OX_K6,
  require('./v10-oxford-k7.js').V10OX_K7
);
const BOOK_IDS = new Set(BOOKS.map(b => b.id));
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
while (cut('const BOOKS = ', UTIL_ANCHOR, true)) {}
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
const all = existing.concat(NEW.map(w => Object.assign({}, w, { z: w.z || 'l' }))).concat(V4NEW).concat(V5NEW).concat(V6NEW).concat(V7NEW).concat(V8NEW).concat(V10LISTEN).concat(V10JQ).concat(V10ZJ).concat(V10AWL).concat(V10B9).concat(V10OX).concat(V10NAWL).concat(V10SPOKEN_ADD).concat(V10CAMB_ADD);
const seen = new Set();
all.forEach(w => {
  if (seen.has(w.w)) throw new Error('duplicate word: ' + w.w);
  seen.add(w.w);
  if (!Array.isArray(w.b) || !w.b.length) w.b = ['default']; // 老词默认归入「内置词库」
  w.b.forEach(id => { if (!BOOK_IDS.has(id)) throw new Error('bad book id ' + id + ' for ' + w.w); });
  ['t','w','s','c','e','k','p','pos','d','z'].forEach(f => { if (w[f] === undefined || w[f] === '') throw new Error('missing field ' + f + ' for ' + w.w); });
  if (w.z !== 'l' && w.z !== 'w') throw new Error('bad zone for ' + w.w);
  if (!Array.isArray(w.s) || !w.s.length) throw new Error('bad synonyms for ' + w.w);
});
const zc = all.reduce((a,w)=>{ a[w.z]=(a[w.z]||0)+1; return a; }, {});
console.log('existing:', existing.length, '| new:', NEW.length, '| v4new:', V4NEW.length, '| total:', all.length, '| zones:', JSON.stringify(zc));

/* ---------- 1.4 AWL / band9 一词多书标记 ---------- */
/* AWL 570 词表中已在词库的词（老词/其他批次）补 b:['awl']，使 awl 词书 = 完整 570 词 */
const awlSet = new Set(AWL_WORDS);
let awlTagged = 0;
all.forEach(w => { if (awlSet.has(w.w) && !w.b.includes('awl')){ w.b.push('awl'); awlTagged++; } });
console.log('AWL tagged onto existing words:', awlTagged);
/* band9 高分表达词表中已在词库的词补 b:['band9'] */
const band9Set = new Set(BAND9_WORDS);
let band9Tagged = 0;
all.forEach(w => { if (band9Set.has(w.w) && !w.b.includes('band9')){ w.b.push('band9'); band9Tagged++; } });
console.log('band9 tagged onto existing words:', band9Tagged);
/* NAWL 963 词表中已在词库的词补 b:['nawl']，使 nawl 词书 = 完整 963 学术词 */
const nawlSet = new Set(NAWL_WORDS);
let nawlTagged = 0;
all.forEach(w => { if (nawlSet.has(w.w) && !w.b.includes('nawl')){ w.b.push('nawl'); nawlTagged++; } });
console.log('NAWL tagged onto existing words:', nawlTagged);
/* 口语话题词表中已在词库的词补 b:['spoken'] */
const spokenSet = new Set(SPOKEN_WORDS);
let spokenTagged = 0;
all.forEach(w => { if (spokenSet.has(w.w) && !w.b.includes('spoken')){ w.b.push('spoken'); spokenTagged++; } });
console.log('SPOKEN tagged onto existing words:', spokenTagged);
/* 剑桥 18-20 话题词表中已在词库的词补 b:['camb'] */
const cambSet = new Set(CAMB_WORDS);
let cambTagged = 0;
all.forEach(w => { if (cambSet.has(w.w) && !w.b.includes('camb')){ w.b.push('camb'); cambTagged++; } });
console.log('CAMB tagged onto existing words:', cambTagged);

/* ---------- 1.45 难度自动分级（lv：1基础 2进阶 3高级） ---------- */
/* 在词书 tagging 之后跑，使 awl/band9 锚点生效；不修改词源文件 */
assignLv(all);

/* ---------- 1.5 词书校验 ---------- */
const bc = {};
all.forEach(w => { w.b.forEach(id => { bc[id] = (bc[id]||0)+1; }); });
if ((bc['default']||0) < 2274) throw new Error('default book must cover 2274 words, got ' + (bc['default']||0));
BOOKS.forEach(b => {
  const act = bc[b.id] || 0;
  if (act !== b.words) console.log('WARN book ' + b.id + ': declared ' + b.words + ' words, actual ' + act + '（一词多书/分批接入，仅提示）');
});
console.log('book counts:', JSON.stringify(bc));

/* ---------- 2. 序列化 ---------- */
function jsStr(s){ return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r/g, '').replace(/\n/g, '\\n') + "'"; }
function entryStr(o){
  return '{t:' + jsStr(o.t) + ',w:' + jsStr(o.w) + ',s:[' + o.s.map(jsStr).join(',') + '],c:' + jsStr(o.c) +
    ',e:' + jsStr(o.e) + ',k:' + jsStr(o.k) + ',p:' + jsStr(o.p) + ',pos:' + jsStr(o.pos) + ',d:' + jsStr(o.d) + ',z:' + jsStr(o.z) + ',lv:' + jsStr(String(o.lv)) + ',b:[' + o.b.map(jsStr).join(',') + ']}';
}
const newBlock = 'const WORDS = [\n' + all.map(entryStr).join(',\n') + '\n];';
html = html.replace(block, newBlock);

/* ---------- 3. 注入 BOOKS + DICT ---------- */
if (!html.includes(UTIL_ANCHOR)) throw new Error('UTIL anchor not found');
const booksConst = '\n\nconst BOOKS = ' + JSON.stringify(BOOKS) + ';\n\n' + UTIL_ANCHOR;
html = html.replace(UTIL_ANCHOR, booksConst);
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