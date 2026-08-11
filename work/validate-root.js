'use strict';
/* V11.2 P3 词根词缀数据校验
   对照：work/_acad-words.txt（2036 学术词清单，含 acad-extract.js 提取）
   检查：每个词根条目都在学术词清单内、rt/af/mn 非空、跨批次无重复覆盖、build 能查到对应词条
   用法：node work/validate-root.js */
'use strict';
const fs = require('fs');
const path = require('path');
const root = __dirname;
const acad = new Set(fs.readFileSync(path.join(root, '_acad-words.txt'), 'utf8').split(/\r?\n/).filter(Boolean));
/* 逐批读取，检测跨批重复 */
const seen = new Map();   // word -> batch
const entries = [];       // {word, batch, d}
for (let i = 1; i <= 10; i++) {
  const f = path.join(root, 'rootdata-' + i + '.js');
  if (!fs.existsSync(f)) continue;
  const batch = require(f).BATCH || {};
  for (const [w, d] of Object.entries(batch)) {
    if (seen.has(w)) console.log('DUP-CROSS-BATCH: ' + w + ' in batch' + seen.get(w) + ' and batch' + i);
    seen.set(w, i);
    entries.push({ word: w, batch: i, d });
  }
}
const notAcad = [], missingField = [], badShape = [];
for (const { word, d } of entries) {
  if (!acad.has(word)) { notAcad.push(word); continue; }
  if (!d || typeof d !== 'object') { badShape.push(word + ':not-obj'); continue; }
  if (!d.rt || !d.af || !d.mn) { missingField.push(word + ':rt/af/mn missing'); continue; }
}
/* build 可查到词条（读 outputs/index.html WORDS） */
const html = fs.readFileSync(path.join(root, '..', 'outputs', 'index.html'), 'utf8');
const ws = html.match(/const WORDS = \[([\s\S]*?)\n\];/);
const site = new Set();
if (ws) for (const m of ws[1].matchAll(/\{t:'[^']*',w:'([^']*)'/g)) site.add(m[1]);
const notInSite = entries.filter(e => !site.has(e.word)).map(e => e.word);
console.log('=== V11.2 P3 词根校验 ===');
console.log('total root entries:', entries.length, '| unique words:', seen.size);
console.log('cross-batch dups:', seen.size < entries.length ? entries.length - seen.size : 0);
console.log('not in academic list:', notAcad.length, JSON.stringify(notAcad));
console.log('missing rt/af/mn:', missingField.length, JSON.stringify(missingField));
console.log('bad shape:', badShape.length, JSON.stringify(badShape));
console.log('not in site WORDS:', notInSite.length, JSON.stringify(notInSite));
const rtCount = {};
entries.forEach(e => rtCount[e.d.rt] = (rtCount[e.d.rt]||0)+1);
const top = Object.entries(rtCount).sort((a,b)=>b[1]-a[1]).slice(0,15);
console.log('distinct roots:', Object.keys(rtCount).length, '| top roots:', top.map(x=>x[0]+'×'+x[1]).join(', '));
const ok = !notAcad.length && !missingField.length && !badShape.length && !notInSite.length;
process.exit(ok ? 0 : 1);
