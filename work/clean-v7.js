'use strict';
const fs = require('fs');
const path = require('path');
const root = __dirname;
const { V7NEW } = require(path.join(root, 'v7-words.js'));
const existing = fs.readFileSync(path.join(root, '.existing-words.txt'),'utf8').split(/\r?\n/).filter(Boolean);
const exSet = new Set(existing);
const seen = new Set();
const keep = [];
for (const w of V7NEW){
  if (exSet.has(w.w)) continue;
  if (seen.has(w.w)) continue;
  seen.add(w.w);
  keep.push(w);
}
function jsStr(s){ return '"' + String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"') + '"'; }
function entry(o){
  return '{t:'+jsStr(o.t)+',w:'+jsStr(o.w)+',s:['+o.s.map(jsStr).join(',')+'],c:'+jsStr(o.c)+
    ',e:'+jsStr(o.e)+',k:'+jsStr(o.k)+',p:'+jsStr(o.p)+',pos:'+jsStr(o.pos)+',d:'+jsStr(o.d)+',z:'+jsStr(o.z)+'}';
}
const v7l = keep.filter(w=>w.z==='l');
const v7w = keep.filter(w=>w.z==='w');
const out = "'use strict';\n/* v7 新增词库：z = 'l' 听力专区 / 'w' 书写专区（雅思核心词汇，扩充批次）*/\n" +
  'const V7L = [\n' + v7l.map(entry).join(',\n') + '\n];\n' +
  'const V7W = [\n' + v7w.map(entry).join(',\n') + '\n];\n' +
  'const V7NEW = [].concat(V7L, V7W);\nmodule.exports = { V7NEW };\n';
fs.writeFileSync(path.join(root, 'v7-words.js'), out, 'utf8');
console.log('V7L:', v7l.length, 'V7W:', v7w.length, 'total:', keep.length);