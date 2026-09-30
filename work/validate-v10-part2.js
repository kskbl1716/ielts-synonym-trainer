'use strict';
/* V11.4 P4 part2 口语专题校验 */
const fs = require('fs');
const path = require('path');
const root = __dirname;
const STD = new Set(['core','edu','work','travel','health','env','living','academic','shopping','feelings']);
const POS_OK = new Set(['n.','v.','adj.','adv.','prep.','pron.']);
const html = fs.readFileSync(path.join(root, '..', 'outputs', 'index.html'), 'utf8');
const ws = html.match(/const WORDS = \[([\s\S]*?)\n\];/);
const site = new Set();
if (ws) for (const m of ws[1].matchAll(/\{t:'[^']*',w:'([^']*)'/g)) site.add(m[1]);
const { V10PART2_ADD } = require(path.join(root, 'v10-part2-add.js'));
const { PART2_WORDS } = require(path.join(root, 'v10-part2-words.js'));
const listSet = new Set(PART2_WORDS.map(w=>String(w).toLowerCase()));
const addSet = new Set(V10PART2_ADD.map(w=>String(w.w).toLowerCase()));
const missingInList = [...new Set(PART2_WORDS.map(String).map(w=>w.toLowerCase()))].filter(w => !site.has(w) && !addSet.has(w));
const seen = new Set();
const missing = [], kErr = [], badTopic = [], badPos = [], badZone = [], badBook = [], notList = [], dups = [];
for (const w of V10PART2_ADD){
  const miss = ['t','w','c','e','k','p','pos','d'].filter(f => w[f]===undefined || w[f]==='');
  if (miss.length){ missing.push(w.w+':'+miss.join(',')); continue; }
  if (!Array.isArray(w.s) || w.s.length < 2){ missing.push(w.w+':s<2'); continue; }
  if (w.z !== 'l' && w.z !== 'w'){ badZone.push(w.w+':'+w.z); continue; }
  if (!STD.has(w.t)){ badTopic.push(w.w+':'+w.t); continue; }
  if (!POS_OK.has(w.pos)){ badPos.push(w.w+':'+w.pos); continue; }
  if (!Array.isArray(w.b) || !w.b.includes('part2')){ badBook.push(w.w); continue; }
  if (!w.e.toLowerCase().includes(w.k.toLowerCase())){ kErr.push(w.w); continue; }
  if (!listSet.has(String(w.w).toLowerCase())){ notList.push(w.w); continue; }
  if (site.has(String(w.w).toLowerCase())){ dups.push(w.w+' (in site)'); continue; }
  if (seen.has(w.w)){ dups.push(w.w+' (in-batch)'); continue; }
  seen.add(w.w);
}
console.log('=== V11.4 P4 part2 校验 ===');
console.log('total entries:', V10PART2_ADD.length, '| OK:', seen.size);
console.log('missing fields:', missing.length, JSON.stringify(missing.slice(0,6)));
console.log('k-not-in-e:', kErr.length, JSON.stringify(kErr.slice(0,10)));
console.log('bad topic:', badTopic.length, JSON.stringify(badTopic.slice(0,6)));
console.log('bad pos:', badPos.length, JSON.stringify(badPos.slice(0,6)));
console.log('bad zone:', badZone.length, JSON.stringify(badZone.slice(0,6)));
console.log('bad book b:', badBook.length, JSON.stringify(badBook.slice(0,6)));
console.log('not in PART2 list:', notList.length, JSON.stringify(notList.slice(0,6)));
console.log('dups (site/batch):', dups.length, JSON.stringify(dups.slice(0,6)));
console.log('清单缺失但未补:', missingInList.length, JSON.stringify(missingInList.slice(0,10)));
