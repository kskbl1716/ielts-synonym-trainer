'use strict';
/* V10 M5-1b listening 听力拼写批次校验
   对照：work/_archive/.m5-listening-bN.txt（切片清单，372 词）+ .existing-words.txt（2723 基准，含批次 A）
   检查：字段齐全、s>=2、z='l'、t 标准主题、pos 合法、k 逐字在 e、b 含 listening、
        词条与切片一一对应、批内/跨库去重（含批次 A）
   用法：node work/validate-v10-listening-b.js
   产出：work/_archive/.m5-listening-b-final.txt */
const fs = require('fs');
const path = require('path');
const root = __dirname;
const STD = new Set(['core','edu','work','travel','health','env','living','academic','shopping','feelings']);
const POS_OK = new Set(['n.','v.','adj.','adv.']);
const SLICES = ['b1','b2','b3','b4','b5'];
const all = [];
const bySlice = {};
for (const n of SLICES){
  const mod = require(path.join(root, 'v10-listening-' + n + '.js'));
  const arr = mod['V10LIST_' + n.toUpperCase()] || [];
  bySlice[n] = arr;
  all.push(...arr);
}
const existing = new Set(fs.readFileSync(path.join(root, '.existing-words.txt'), 'utf8').split(/\r?\n/).filter(Boolean));
/* 批次 A 词表也加入去重集 */
for (const n of ['a1','a2','a3','a4','a5','a6']){
  const mod = require(path.join(root, 'v10-listening-' + n + '.js'));
  (mod['V10LIST_' + n.toUpperCase()] || []).forEach(w => existing.add(w.w));
}
const seen = new Set();
const missing = [], kErr = [], badTopic = [], badPos = [], badZone = [], badBook = [], dups = [];
for (const w of all){
  const miss = ['t','w','c','e','k','p','pos','d'].filter(f => w[f]===undefined || w[f]==='');
  if (miss.length){ missing.push(w.w+':'+miss.join(',')); continue; }
  if (!Array.isArray(w.s) || w.s.length < 2){ missing.push(w.w+':s<2'); continue; }
  if (w.z !== 'l'){ badZone.push(w.w+':'+w.z); continue; }
  if (!STD.has(w.t)){ badTopic.push(w.w+':'+w.t); continue; }
  if (!POS_OK.has(w.pos)){ badPos.push(w.w+':'+w.pos); continue; }
  if (!Array.isArray(w.b) || !w.b.includes('listening')){ badBook.push(w.w); continue; }
  if (!w.e.toLowerCase().includes(w.k.toLowerCase())){ kErr.push(w.w); continue; }
  if (existing.has(w.w)){ dups.push(w.w+' (existing/batchA)'); continue; }
  if (seen.has(w.w)){ dups.push(w.w+' (in-batch)'); continue; }
  seen.add(w.w);
}
console.log('=== V10 M5-1b listening 校验 ===');
console.log('total entries:', all.length, '| OK:', seen.size);
console.log('missing fields:', missing.length, JSON.stringify(missing.slice(0,25)));
console.log('k-not-in-e:', kErr.length, JSON.stringify(kErr.slice(0,25)));
console.log('bad topic:', badTopic.length, JSON.stringify(badTopic.slice(0,15)));
console.log('bad pos:', badPos.length, JSON.stringify(badPos.slice(0,15)));
console.log('bad zone:', badZone.length, JSON.stringify(badZone));
console.log('bad book b:', badBook.length, JSON.stringify(badBook));
console.log('dups:', dups.length, JSON.stringify(dups.slice(0,15)));
let sliceMiss = [], sliceExtra = [];
for (const n of SLICES){
  const want = fs.readFileSync(path.join(root, '_archive', '.m5-listening-' + n + '.txt'), 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split('|')[0]);
  const have = new Set(bySlice[n].map(e => e.w));
  want.forEach(w => { if(!have.has(w)) sliceMiss.push(n+':'+w); });
  bySlice[n].forEach(e => { if(!want.includes(e.w)) sliceExtra.push(n+':'+e.w); });
}
console.log('slice missing:', sliceMiss.length, JSON.stringify(sliceMiss.slice(0,20)));
console.log('slice extra:', sliceExtra.length, JSON.stringify(sliceExtra.slice(0,20)));
const zc = {}; all.forEach(w => zc[w.t] = (zc[w.t]||0)+1);
console.log('topics:', JSON.stringify(zc));
fs.writeFileSync(path.join(root, '_archive', '.m5-listening-b-final.txt'), [...seen].join('\n'), 'utf8');
console.log('written _archive/.m5-listening-b-final.txt with', seen.size, 'words');
