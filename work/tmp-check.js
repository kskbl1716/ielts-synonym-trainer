const { DICT, NEW } = require('C:/Users/哈哈哈/Documents/Codex/2026-08-04/zu/work/dict-data.js');
console.log('DICT', Object.keys(DICT).length, 'NEW', NEW.length);
const missing = NEW.filter(w => !DICT[w.w]);
console.log('NEW words missing in DICT:', missing.length, missing.slice(0,20).map(w=>w.w).join(', '));
