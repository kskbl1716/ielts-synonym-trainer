'use strict';
/* v8 词库校验：对照 .existing-words.txt 去重 + 字段 + k-in-e + t/z 合法性
   用法：node work/validate-v8.js   （输出 work/.v8-final.txt）*/
const fs = require('fs');
const path = require('path');
const root = __dirname;
const { V8NEW } = require(path.join(root, 'v8-words.js'));
const existing = fs.readFileSync(path.join(root, '.existing-words.txt'), 'utf8').split(/\r?\n/).filter(Boolean);
const exSet = new Set(existing);
const STD = new Set(['core','edu','work','travel','health','env','living','academic','shopping','feelings']);
const seen = new Set();
const dups = [], fieldErr = [], kErr = [], badZone = [], badTopic = [];
const ok = [];
for (const w of V8NEW){
  const f = ['t','w','s','c','e','k','p','pos','d','z'];
  const miss = f.filter(x => w[x]===undefined || w[x]==='');
  if (miss.length){ fieldErr.push(w.w+':'+miss.join(',')); continue; }
  if (!Array.isArray(w.s) || !w.s.length){ fieldErr.push(w.w+':s'); continue; }
  if (w.z!=='l' && w.z!=='w'){ badZone.push(w.w+':'+w.z); continue; }
  if (!STD.has(w.t)){ badTopic.push(w.w+':'+w.t); continue; }
  if (!w.e.toLowerCase().includes(w.k.toLowerCase())){ kErr.push(w.w); continue; }
  if (exSet.has(w.w)){ dups.push(w.w); continue; }
  if (seen.has(w.w)){ dups.push(w.w+' (in-file)'); continue; }
  seen.add(w.w); ok.push(w);
}
console.log('V8NEW total:', V8NEW.length);
console.log('dups:', dups.length, JSON.stringify(dups));
console.log('field errors:', JSON.stringify(fieldErr));
console.log('k-not-in-e:', JSON.stringify(kErr));
console.log('bad zone:', JSON.stringify(badZone));
console.log('bad topic:', JSON.stringify(badTopic));
console.log('final new words:', ok.length);
const zc = ok.reduce((a,w)=>{ a[w.z]=(a[w.z]||0)+1; return a; },{});
console.log('zones:', JSON.stringify(zc));
fs.writeFileSync(path.join(root, '.v8-final.txt'), ok.map(w=>w.w).join('\n'), 'utf8');
