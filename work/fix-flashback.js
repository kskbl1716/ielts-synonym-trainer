const fs = require('fs');
const p = 'outputs/index.html';
let s = fs.readFileSync(p, 'utf8');
const btnOld = '<button class="btn btn-ghost" id="flash-back">返回设置</button>';
const btnNew = '<button class="btn btn-ghost" id="flash-end-back">返回设置</button>';
const jsOld = "$('#flash-back').addEventListener('click', ()=>{ $('#flash-end').classList.add('hidden'); $('#flash-game').classList.add('hidden'); $('#flash-card').classList.remove('flipped'); });";
const jsNew = "$('#flash-end-back').addEventListener('click', ()=>{ $('#flash-end').classList.add('hidden'); $('#flash-game').classList.add('hidden'); $('#flash-card').classList.remove('flipped'); });";
let n = 0;
if (s.includes(btnOld)) { s = s.replace(btnOld, btnNew); n++; console.log('button id renamed'); } else { console.log('WARN: button pattern not found'); }
if (s.includes(jsOld)) { s = s.replace(jsOld, jsNew); n++; console.log('js selector updated'); } else { console.log('WARN: js pattern not found'); }
if (n > 0) fs.writeFileSync(p, s, 'utf8');
console.log('changes:', n);
