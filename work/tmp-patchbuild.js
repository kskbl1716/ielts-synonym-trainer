const fs = require('fs');
const p = 'C:/Users/哈哈哈/Documents/Codex/2026-08-04/zu/work/build.js';
let s = fs.readFileSync(p, 'utf8');
function rep(from, to){ if(!s.includes(from)) throw new Error('not found: '+from.slice(0,80)); s = s.split(from).join(to); }
rep("const { DICT, NEW } = require('./dict-data.js');",
    "const { DICT, NEW } = require('./dict-data.js');\nconst { V4NEW } = require('./v4-words.js');");
rep("  obj.p = DICT[obj.w][0]; obj.pos = DICT[obj.w][1]; obj.d = DICT[obj.w][2];",
    "  obj.p = DICT[obj.w][0]; obj.pos = DICT[obj.w][1]; obj.d = DICT[obj.w][2];\n  obj.z = 'l';");
rep("const all = existing.concat(NEW);",
    "const all = existing.concat(NEW.map(w => Object.assign({}, w, { z: w.z || 'l' }))).concat(V4NEW);");
rep("  ['t','w','s','c','e','k','p','pos','d'].forEach(f => { if (w[f] === undefined || w[f] === '') throw new Error('missing field ' + f + ' for ' + w.w); });",
    "  ['t','w','s','c','e','k','p','pos','d','z'].forEach(f => { if (w[f] === undefined || w[f] === '') throw new Error('missing field ' + f + ' for ' + w.w); });\n  if (w.z !== 'l' && w.z !== 'w') throw new Error('bad zone for ' + w.w);");
rep("console.log('existing:', existing.length, '| new:', NEW.length, '| total:', all.length);",
    "const zc = all.reduce((a,w)=>{ a[w.z]=(a[w.z]||0)+1; return a; }, {});\nconsole.log('existing:', existing.length, '| new:', NEW.length, '| v4new:', V4NEW.length, '| total:', all.length, '| zones:', JSON.stringify(zc));");
rep("  return '{t:' + jsStr(o.t) + ',w:' + jsStr(o.w) + ',s:[' + o.s.map(jsStr).join(',') + '],c:' + jsStr(o.c) +",
    "  return '{t:' + jsStr(o.t) + ',w:' + jsStr(o.w) + ',s:[' + o.s.map(jsStr).join(',') + '],c:' + jsStr(o.c) +");
rep("    ',e:' + jsStr(o.e) + ',k:' + jsStr(o.k) + ',p:' + jsStr(o.p) + ',pos:' + jsStr(o.pos) + ',d:' + jsStr(o.d) + '}';",
    "    ',e:' + jsStr(o.e) + ',k:' + jsStr(o.k) + ',p:' + jsStr(o.p) + ',pos:' + jsStr(o.pos) + ',d:' + jsStr(o.d) + ',z:' + jsStr(o.z) + '}';");
fs.writeFileSync(p, s, 'utf8');
console.log('build.js patched OK');
