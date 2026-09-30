'use strict';
/* V10 M5-4 awl 学术词汇批次校验
   对照：.existing-words.txt（当前基准）+ 已接入批次；AWL 570 词清单与词条交集校验
   检查：字段齐全、s>=2、z 合法、t 标准主题、pos 合法（含 prep.）、k 逐字在 e、b 含 awl、
        与现有库/批内去重；78 条词条均为 AWL 570 清单内词
   用法：node work/validate-v10-awl-f.js
   产出：work/_archive/.m5-awl-final.txt */
const fs = require('fs');
const path = require('path');
const root = __dirname;
const STD = new Set(['core','edu','work','travel','health','env','living','academic','shopping','feelings']);
const POS_OK = new Set(['n.','v.','adj.','adv.','prep.']);
const { V10AWL } = require(path.join(root, 'v10-awl-f1.js'));
const { AWL_WORDS } = require(path.join(root, 'v10-awl-words.js'));
const existing = new Set(fs.readFileSync(path.join(root, '.existing-words.txt'), 'utf8').split(/\r?\n/).filter(Boolean));
/* 已接入批次加入去重集 */
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
const awlSet = new Set(AWL_WORDS);
const seen = new Set();
const missing = [], kErr = [], badTopic = [], badPos = [], badZone = [], badBook = [], notAwl = [], dups = [];
for (const w of V10AWL){
  const miss = ['t','w','c','e','k','p','pos','d'].filter(f => w[f]===undefined || w[f]==='');
  if (miss.length){ missing.push(w.w+':'+miss.join(',')); continue; }
  if (!Array.isArray(w.s) || w.s.length < 2){ missing.push(w.w+':s<2'); continue; }
  if (w.z !== 'l' && w.z !== 'w'){ badZone.push(w.w+':'+w.z); continue; }
  if (!STD.has(w.t)){ badTopic.push(w.w+':'+w.t); continue; }
  if (!POS_OK.has(w.pos)){ badPos.push(w.w+':'+w.pos); continue; }
  if (!Array.isArray(w.b) || !w.b.includes('awl')){ badBook.push(w.w); continue; }
  if (!w.e.toLowerCase().includes(w.k.toLowerCase())){ kErr.push(w.w); continue; }
  if (!awlSet.has(w.w)){ notAwl.push(w.w); continue; }
  if (existing.has(w.w)){ dups.push(w.w+' (existing/batch)'); continue; }
  if (seen.has(w.w)){ dups.push(w.w+' (in-batch)'); continue; }
  seen.add(w.w);
}
console.log('=== V10 M5-4 awl 校验 ===');
console.log('total entries:', V10AWL.length, '| OK:', seen.size);
console.log('missing fields:', missing.length, JSON.stringify(missing));
console.log('k-not-in-e:', kErr.length, JSON.stringify(kErr));
console.log('bad topic:', badTopic.length, JSON.stringify(badTopic));
console.log('bad pos:', badPos.length, JSON.stringify(badPos));
console.log('bad zone:', badZone.length, JSON.stringify(badZone));
console.log('bad book b:', badBook.length, JSON.stringify(badBook));
console.log('not in AWL570:', notAwl.length, JSON.stringify(notAwl));
console.log('dups:', dups.length, JSON.stringify(dups));
const zc = {}; V10AWL.forEach(w => zc[w.z] = (zc[w.z]||0)+1);
const tc = {}; V10AWL.forEach(w => tc[w.t] = (tc[w.t]||0)+1);
console.log('zones:', JSON.stringify(zc), '| topics:', JSON.stringify(tc));
fs.writeFileSync(path.join(root, '_archive', '.m5-awl-final.txt'), [...seen].join('\n'), 'utf8');
console.log('written _archive/.m5-awl-final.txt with', seen.size, 'words');
