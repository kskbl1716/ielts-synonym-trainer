'use strict';
const fs = require('fs');
const path = require('path');
const root = __dirname;
const { V7NEW } = require(path.join(root, 'v7-words.js'));
const existing = fs.readFileSync(path.join(root, '.existing-words.txt'),'utf8').split(/\r?\n/).filter(Boolean);
const exSet = new Set(existing);
const seen = new Set();
const dups = [], fieldErr = [], kErr = [];
const ok = [];
for (const w of V7NEW){
  const f = ['t','w','s','c','e','k','p','pos','d','z'];
  const miss = f.filter(x => w[x]===undefined || w[x]==='');
  if (miss.length){ fieldErr.push(w.w+':'+miss.join(',')); continue; }
  if (!Array.isArray(w.s) || !w.s.length){ fieldErr.push(w.w+':s'); continue; }
  if (w.z!=='l' && w.z!=='w'){ fieldErr.push(w.w+':z'); continue; }
  if (!w.e.toLowerCase().includes(w.k.toLowerCase())){ kErr.push(w.w); continue; }
  if (exSet.has(w.w)){ dups.push(w.w); continue; }
  if (seen.has(w.w)){ dups.push(w.w+' (in-file)'); continue; }
  seen.add(w.w); ok.push(w);
}
console.log('V7NEW total:', V7NEW.length);
console.log('dups:', dups.length, JSON.stringify(dups));
console.log('field errors:', JSON.stringify(fieldErr));
console.log('k-not-in-e:', JSON.stringify(kErr));
console.log('final new words:', ok.length);
const zc = ok.reduce((a,w)=>{ a[w.z]=(a[w.z]||0)+1; return a; },{});
console.log('zones:', JSON.stringify(zc));
fs.writeFileSync(path.join(root, '.v7-final.txt'), ok.map(w=>w.w).join('\n'), 'utf8');