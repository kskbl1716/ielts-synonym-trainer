'use strict';
/* V11.4 P4 phrasal 短语动词校验 */
const fs = require('fs');
const path = require('path');
const root = __dirname;
const STD = new Set(['core','edu','work','travel','health','env','living','academic','shopping','feelings']);
const POS_OK = new Set(['n.','v.','adj.','adv.','prep.','pron.']);
const html = fs.readFileSync(path.join(root, '..', 'outputs', 'index.html'), 'utf8');
const ws = html.match(/const WORDS = \[([\s\S]*?)\n\];/);
const site = new Set();
if (ws) for (const m of ws[1].matchAll(/\{t:'[^']*',w:'([^']*)'/g)) site.add(m[1]);
const { V10PHRASAL } = require(path.join(root, 'v10-phrasal-words.js'));
const seen = new Set();
const missing = [], kErr = [], badTopic = [], badPos = [], badZone = [], badBook = [], dups = [];
for (const w of V10PHRASAL){
  const miss = ['t','w','c','e','k','p','pos','d'].filter(f => w[f]===undefined || w[f]==='');
  if (miss.length){ missing.push(w.w+':'+miss.join(',')); continue; }
  if (!Array.isArray(w.s) || w.s.length < 2){ missing.push(w.w+':s<2'); continue; }
  if (w.z !== 'l' && w.z !== 'w'){ badZone.push(w.w+':'+w.z); continue; }
  if (!STD.has(w.t)){ badTopic.push(w.w+':'+w.t); continue; }
  if (!POS_OK.has(w.pos)){ badPos.push(w.w+':'+w.pos); continue; }
  if (!Array.isArray(w.b) || !w.b.includes('phrasal')){ badBook.push(w.w); continue; }
  if (!w.e.toLowerCase().includes(w.k.toLowerCase())){ kErr.push(w.w); continue; }
  if (site.has(String(w.w).toLowerCase())){ dups.push(w.w+' (in site)'); continue; }
  if (seen.has(w.w)){ dups.push(w.w+' (in-batch)'); continue; }
  seen.add(w.w);
}
console.log('=== V11.4 P4 phrasal 校验 ===');
console.log('total entries:', V10PHRASAL.length, '| OK:', seen.size);
console.log('missing fields:', missing.length, JSON.stringify(missing.slice(0,6)));
console.log('k-not-in-e:', kErr.length, JSON.stringify(kErr.slice(0,12)));
console.log('bad topic:', badTopic.length, JSON.stringify(badTopic.slice(0,6)));
console.log('bad pos:', badPos.length, JSON.stringify(badPos.slice(0,6)));
console.log('bad zone:', badZone.length, JSON.stringify(badZone.slice(0,6)));
console.log('bad book b:', badBook.length, JSON.stringify(badBook.slice(0,6)));
console.log('dups (site/batch):', dups.length, JSON.stringify(dups.slice(0,8)));
