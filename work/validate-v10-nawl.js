'use strict';
/* V10 M7 NAWL 学术词批次校验
   对照：outputs/index.html 已构建词库（去重）+ NAWL 公开词表（work/_navl-words.txt）
   检查：字段齐全、s>=2、z 合法、t 标准主题、pos 合法、k 逐字在 e、b 含 nawl、
        与现有库/批内去重、词在 NAWL 963 清单内
   用法：node work/validate-v10-nawl.js （a1-a4 已存在则全部校验）
   产出：work/_archive/.m7-nawl-final.txt */
'use strict';
const fs = require('fs');
const path = require('path');
const root = __dirname;
const STD = new Set(['core','edu','work','travel','health','env','living','academic','shopping','feelings']);
const POS_OK = new Set(['n.','v.','adj.','adv.','prep.','pron.']);
/* 当前站点已构建词库（outputs/index.html 的 WORDS 数组）作为去重基准 */
const html = fs.readFileSync(path.join(root, '..', 'outputs', 'index.html'), 'utf8');
const ws = html.match(/const WORDS = \[([\s\S]*?)\n\];/);
const site = new Set();
if (ws) for (const m of ws[1].matchAll(/\{t:'[^']*',w:'([^']*)'/g)) site.add(m[1].toLowerCase());
/* NAWL 963 词表 */
const NAWL = new Set(fs.readFileSync(path.join(root, '_navl-words.txt'), 'utf8').split(/\s+/).filter(Boolean).map(w=>w.toLowerCase()));
/* 载入全部已存在的 NAWL 批次 */
const entries = [];
for (const n of ['a1','a2','a3','a4']){
  const f = path.join(root, 'v10-nawl-' + n + '.js');
  if (!fs.existsSync(f)) continue;
  const mod = require(f);
  const arr = Object.values(mod)[0] || [];
  entries.push(...arr);
  console.log('loaded v10-nawl-' + n + '.js:', arr.length);
}
const seen = new Set();
const missing = [], kErr = [], badTopic = [], badPos = [], badZone = [], badBook = [], notNawl = [], dups = [];
for (const w of entries){
  const miss = ['t','w','c','e','k','p','pos','d'].filter(f => w[f]===undefined || w[f]==='');
  if (miss.length){ missing.push(w.w+':'+miss.join(',')); continue; }
  if (!Array.isArray(w.s) || w.s.length < 2){ missing.push(w.w+':s<2'); continue; }
  if (w.z !== 'l' && w.z !== 'w'){ badZone.push(w.w+':'+w.z); continue; }
  if (!STD.has(w.t)){ badTopic.push(w.w+':'+w.t); continue; }
  if (!POS_OK.has(w.pos)){ badPos.push(w.w+':'+w.pos); continue; }
  if (!Array.isArray(w.b) || !w.b.includes('nawl')){ badBook.push(w.w); continue; }
  if (!w.e.toLowerCase().includes(w.k.toLowerCase())){ kErr.push(w.w); continue; }
  if (!NAWL.has(String(w.w).toLowerCase())){ notNawl.push(w.w); continue; }
  if (site.has(String(w.w).toLowerCase())){ dups.push(w.w+' (in site)'); continue; }
  if (seen.has(w.w)){ dups.push(w.w+' (in-batch)'); continue; }
  seen.add(w.w);
}
console.log('=== V10 M7 NAWL 校验 ===');
console.log('total entries:', entries.length, '| OK:', seen.size);
console.log('missing fields:', missing.length, JSON.stringify(missing));
console.log('k-not-in-e:', kErr.length, JSON.stringify(kErr));
console.log('bad topic:', badTopic.length, JSON.stringify(badTopic));
console.log('bad pos:', badPos.length, JSON.stringify(badPos));
console.log('bad zone:', badZone.length, JSON.stringify(badZone));
console.log('bad book b:', badBook.length, JSON.stringify(badBook));
console.log('not in NAWL963:', notNawl.length, JSON.stringify(notNawl));
console.log('dups (site/batch):', dups.length, JSON.stringify(dups));
const zc = {}; entries.forEach(w => zc[w.z] = (zc[w.z]||0)+1);
const tc = {}; entries.forEach(w => tc[w.t] = (tc[w.t]||0)+1);
console.log('zones:', JSON.stringify(zc), '| topics:', JSON.stringify(tc));
fs.writeFileSync(path.join(root, '_archive', '.m7-nawl-final.txt'), [...seen].join('\n'), 'utf8');
console.log('written _archive/.m7-nawl-final.txt with', seen.size, 'words');
