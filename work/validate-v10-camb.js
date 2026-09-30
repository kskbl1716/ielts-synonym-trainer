'use strict';
/* V10 M9 剑桥 18-20 话题词校验：v10-camb-add.js 新增词条
   对照：outputs/index.html 已构建词库（去重）+ CAMB_WORDS 清单
   检查：字段齐全、s>=2、z 合法、t 标准主题、pos 合法、k 逐字在 e、b 含 camb、词在清单内、去重
   用法：node work/validate-v10-camb.js */
'use strict';
const fs = require('fs');
const path = require('path');
const root = __dirname;
const STD = new Set(['core','edu','work','travel','health','env','living','academic','shopping','feelings']);
const POS_OK = new Set(['n.','v.','adj.','adv.','prep.','pron.']);
const html = fs.readFileSync(path.join(root, '..', 'outputs', 'index.html'), 'utf8');
const ws = html.match(/const WORDS = \[([\s\S]*?)\n\];/);
const site = new Set();
if (ws) for (const m of ws[1].matchAll(/\{t:'[^']*',w:'([^']*)'/g)) site.add(m[1].toLowerCase());
const { V10CAMB_ADD } = require(path.join(root, 'v10-camb-add.js'));
const { CAMB_WORDS } = require(path.join(root, 'v10-camb-words.js'));
const cambSet = new Set(CAMB_WORDS.map(w=>String(w).toLowerCase()));
const seen = new Set();
const missing = [], kErr = [], badTopic = [], badPos = [], badZone = [], badBook = [], notCamb = [], dups = [];
for (const w of V10CAMB_ADD){
  const miss = ['t','w','c','e','k','p','pos','d'].filter(f => w[f]===undefined || w[f]==='');
  if (miss.length){ missing.push(w.w+':'+miss.join(',')); continue; }
  if (!Array.isArray(w.s) || w.s.length < 2){ missing.push(w.w+':s<2'); continue; }
  if (w.z !== 'l' && w.z !== 'w'){ badZone.push(w.w+':'+w.z); continue; }
  if (!STD.has(w.t)){ badTopic.push(w.w+':'+w.t); continue; }
  if (!POS_OK.has(w.pos)){ badPos.push(w.w+':'+w.pos); continue; }
  if (!Array.isArray(w.b) || !w.b.includes('camb')){ badBook.push(w.w); continue; }
  if (!w.e.toLowerCase().includes(w.k.toLowerCase())){ kErr.push(w.w); continue; }
  if (!cambSet.has(String(w.w).toLowerCase())){ notCamb.push(w.w); continue; }
  if (site.has(String(w.w).toLowerCase())){ dups.push(w.w+' (in site)'); continue; }
  if (seen.has(w.w)){ dups.push(w.w+' (in-batch)'); continue; }
  seen.add(w.w);
}
console.log('=== V10 M9 剑桥 18-20 词校验 ===');
console.log('total entries:', V10CAMB_ADD.length, '| OK:', seen.size);
console.log('missing fields:', missing.length, JSON.stringify(missing));
console.log('k-not-in-e:', kErr.length, JSON.stringify(kErr));
console.log('bad topic:', badTopic.length, JSON.stringify(badTopic));
console.log('bad pos:', badPos.length, JSON.stringify(badPos));
console.log('bad zone:', badZone.length, JSON.stringify(badZone));
console.log('bad book b:', badBook.length, JSON.stringify(badBook));
console.log('not in CAMB list:', notCamb.length, JSON.stringify(notCamb));
console.log('dups (site/batch):', dups.length, JSON.stringify(dups));
