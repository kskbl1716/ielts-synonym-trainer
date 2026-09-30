'use strict';
/* V10 M5-5 band9 高分表达批次校验
   对照：.existing-words.txt（当前基准）+ 已接入批次；BAND9 词表清单交集校验
   检查：字段齐全、s>=2、z 合法、t 标准主题、pos 合法（含 prep.）、k 逐字在 e、b 含 band9、
        例句 ≤16 词、与现有库/批内去重、均在 BAND9 清单内
   用法：node work/validate-v10-band9-h.js
   产出：work/_archive/.m5-band9-final.txt */
const fs = require('fs');
const path = require('path');
const root = __dirname;
const STD = new Set(['core','edu','work','travel','health','env','living','academic','shopping','feelings']);
const POS_OK = new Set(['n.','v.','adj.','adv.','prep.']);
const { V10B9 } = require(path.join(root, 'v10-band9-h1.js'));
const { BAND9_WORDS } = require(path.join(root, 'v10-band9-words.js'));
const existing = new Set(fs.readFileSync(path.join(root, '.existing-words.txt'), 'utf8').split(/\r?\n/).filter(Boolean));
for (const n of ['a1','a2','a3','a4','a5','a6','b1','b2','b3','b4','b5']){
  const mod = require(path.join(root, 'v10-listening-' + n + '.js'));
  (mod['V10LIST_' + n.toUpperCase()] || []).forEach(w => existing.add(w.w));
}
for (const n of ['c1','c2','c3','c4','c5','c6']){
  const mod = require(path.join(root, 'v10-jianqiao-' + n + '.js'));
  (mod['V10JQ_' + n.toUpperCase()] || []).forEach(w => existing.add(w.w));
}
for (const n of ['d1','d2','d3','d4','d5','d6','e1','e2','e3','e4','e5','e6','e7']){
  const mod = require(path.join(root, 'v10-zhenjing-' + n + '.js'));
  (mod['V10ZJ_' + n.toUpperCase()] || []).forEach(w => existing.add(w.w));
}
existing.add(require(path.join(root, 'v10-awl-f1.js')).V10AWL.map(w => w.w));
const band9Set = new Set(BAND9_WORDS);
const seen = new Set();
const missing = [], kErr = [], badTopic = [], badPos = [], badZone = [], badBook = [], notB9 = [], dups = [], longE = [];
for (const w of V10B9){
  const miss = ['t','w','c','e','k','p','pos','d'].filter(f => w[f]===undefined || w[f]==='');
  if (miss.length){ missing.push(w.w+':'+miss.join(',')); continue; }
  if (!Array.isArray(w.s) || w.s.length < 2){ missing.push(w.w+':s<2'); continue; }
  if (w.z !== 'l' && w.z !== 'w'){ badZone.push(w.w+':'+w.z); continue; }
  if (!STD.has(w.t)){ badTopic.push(w.w+':'+w.t); continue; }
  if (!POS_OK.has(w.pos)){ badPos.push(w.w+':'+w.pos); continue; }
  if (!Array.isArray(w.b) || !w.b.includes('band9')){ badBook.push(w.w); continue; }
  if (!w.e.toLowerCase().includes(w.k.toLowerCase())){ kErr.push(w.w); continue; }
  if (w.e.split(/\s+/).length > 16){ longE.push(w.w); continue; }
  if (!band9Set.has(w.w)){ notB9.push(w.w); continue; }
  if (existing.has(w.w)){ dups.push(w.w+' (existing/batch)'); continue; }
  if (seen.has(w.w)){ dups.push(w.w+' (in-batch)'); continue; }
  seen.add(w.w);
}
console.log('=== V10 M5-5 band9 校验 ===');
console.log('total entries:', V10B9.length, '| OK:', seen.size);
console.log('missing fields:', missing.length, JSON.stringify(missing));
console.log('k-not-in-e:', kErr.length, JSON.stringify(kErr));
console.log('e>16w:', longE.length, JSON.stringify(longE));
console.log('bad topic:', badTopic.length, JSON.stringify(badTopic));
console.log('bad pos:', badPos.length, JSON.stringify(badPos));
console.log('bad zone:', badZone.length, JSON.stringify(badZone));
console.log('bad book b:', badBook.length, JSON.stringify(badBook));
console.log('not in BAND9:', notB9.length, JSON.stringify(notB9));
console.log('dups:', dups.length, JSON.stringify(dups));
const zc = {}; V10B9.forEach(w => zc[w.z] = (zc[w.z]||0)+1);
const tc = {}; V10B9.forEach(w => tc[w.t] = (tc[w.t]||0)+1);
console.log('zones:', JSON.stringify(zc), '| topics:', JSON.stringify(tc));
fs.writeFileSync(path.join(root, '_archive', '.m5-band9-final.txt'), [...seen].join('\n'), 'utf8');
console.log('written _archive/.m5-band9-final.txt with', seen.size, 'words');
