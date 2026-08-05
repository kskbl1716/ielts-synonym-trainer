const fs = require('fs');
const html = fs.readFileSync('outputs/index.html', 'utf8');
const m = html.match(/const WORDS = (\[.*?\]);/s);
if (!m) { console.error('WORDS not found'); process.exit(1); }
// eslint-disable-next-line no-eval
const words = eval(m[1]);
const list = words.map(w => String(w.w).trim()).filter(Boolean);
const uniq = [...new Set(list.map(x => x.toLowerCase()))];
console.log('total entries:', words.length, '| unique lowercase:', uniq.length);
fs.writeFileSync('work/.existing-words.txt', list.join('\n') + '\n', 'utf8');
console.log('written work/.existing-words.txt with', list.length, 'lines');
