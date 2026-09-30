'use strict';
/* V10 M5-3 zhenjing 雅思真经批次 2 校验
   对照：work/_archive/.m5-zhenjing-eN.json（切片清单）+ .existing-words.txt（3993 基准）+ 已接入批次
   检查：字段齐全、s>=2、z 合法、t 标准主题、pos 合法（含 prep.）、k 逐字在 e、b 含 zhenjing、
        词条与切片一一对应、批内/跨库去重
   用法：node work/validate-v10-zhenjing-e.js
   产出：work/_archive/.m5-zhenjing-e-final.txt */
const fs = require('fs');
const path = require('path');
const root = __dirname;
const STD = new Set(['core','edu','work','travel','health','env','living','academic','shopping','feelings']);
const POS_OK = new Set(['n.','v.','adj.','adv.','prep.']);
const SLICES = ['e1','e2','e3','e4','e5','e6','e7'];
const all = [];
const bySlice = {};
for (const n of SLICES){
  const mod = require(path.join(root, 'v10-zhenjing-' + n + '.js'));
  const arr = mod['V10ZJ_' + n.toUpperCase()] || [];
  bySlice[n] = arr;
  all.push(...arr);
}
const existing = new Set(fs.readFileSync(path.join(root, '.existing-words.txt'), 'utf8').split(/\r?\n/).filter(Boolean));
for (const n of ['a1','a2','a3','a4','a5','a6','b1','b2','b3','b4','b5']){
  const mod = require(path.join(root, 'v10-listening-' + n + '.js'));
  (mod['V10LIST_' + n.toUpperCase()] || []).forEach(w => existing.add(w.w));
}
for (const n of ['c1','c2','c3','c4','c5','c6']){
  const mod = require(path.join(root, 'v10-jianqiao-' + n + '.js'));
  (mod['V10JQ_' + n.toUpperCase()] || []).forEach(w => existing.add(w.w));
}
for (const n of ['d1','d2','d3','d4','d5','d6']){
  const mod = require(path.join(root, 'v10-zhenjing-' + n + '.js'));
  (mod['V10ZJ_' + n.toUpperCase()] || []).forEach(w => existing.add(w.w));
}
const seen = new Set();
const missing = [], kErr = [], badTopic = [], badPos = [], badZone = [], badBook = [], dups = [];
for (const w of all){
  const miss = ['t','w','c','e','k','p','pos','d'].filter(f => w[f]===undefined || w[f]==='');
  if (miss.length){ missing.push(w.w+':'+miss.join(',')); continue; }
  if (!Array.isArray(w.s) || w.s.length < 2){ missing.push(w.w+':s<2'); continue; }
  if (w.z !== 'l' && w.z !== 'w'){ badZone.push(w.w+':'+w.z); continue; }
  if (!STD.has(w.t)){ badTopic.push(w.w+':'+w.t); continue; }
  if (!POS_OK.has(w.pos)){ badPos.push(w.w+':'+w.pos); continue; }
  if (!Array.isArray(w.b) || !w.b.includes('zhenjing')){ badBook.push(w.w); continue; }
  if (!w.e.toLowerCase().includes(w.k.toLowerCase())){ kErr.push(w.w); continue; }
  if (existing.has(w.w)){ dups.push(w.w+' (existing/batch)'); continue; }
  if (seen.has(w.w)){ dups.push(w.w+' (in-batch)'); continue; }
  seen.add(w.w);
}
console.log('=== V10 M5-3 zhenjing 批次2 校验 ===');
console.log('total entries:', all.length, '| OK:', seen.size);
console.log('missing fields:', missing.length, JSON.stringify(missing.slice(0,25)));
console.log('k-not-in-e:', kErr.length, JSON.stringify(kErr.slice(0,25)));
console.log('bad topic:', badTopic.length, JSON.stringify(badTopic.slice(0,15)));
console.log('bad pos:', badPos.length, JSON.stringify(badPos.slice(0,15)));
console.log('bad zone:', badZone.length, JSON.stringify(badZone));
console.log('bad book b:', badBook.length, JSON.stringify(badBook));
console.log('dups:', dups.length, JSON.stringify(dups.slice(0,25)));
let sliceMiss = [], sliceExtra = [];
for (const n of SLICES){
  const want = JSON.parse(fs.readFileSync(path.join(root, '_archive', '.m5-zhenjing-' + n + '.json'), 'utf8')).map(o => o.word.toLowerCase());
  const have = new Set(bySlice[n].map(e => e.w));
  want.forEach(w => { if(!have.has(w)) sliceMiss.push(n+':'+w); });
  bySlice[n].forEach(e => { if(!want.includes(e.w)) sliceExtra.push(n+':'+e.w); });
}
console.log('slice missing:', sliceMiss.length, JSON.stringify(sliceMiss.slice(0,25)));
console.log('slice extra:', sliceExtra.length, JSON.stringify(sliceExtra.slice(0,25)));
const zc = {}; all.forEach(w => zc[w.z] = (zc[w.z]||0)+1);
const tc = {}; all.forEach(w => tc[w.t] = (tc[w.t]||0)+1);
console.log('zones:', JSON.stringify(zc), '| topics:', JSON.stringify(tc));
fs.writeFileSync(path.join(root, '_archive', '.m5-zhenjing-e-final.txt'), [...seen].join('\n'), 'utf8');
console.log('written _archive/.m5-zhenjing-e-final.txt with', seen.size, 'words');
