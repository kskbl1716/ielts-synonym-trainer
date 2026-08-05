const fs = require('fs');
const p = 'work/features.js';
let c = fs.readFileSync(p, 'utf8');
// 1) 弹窗内同义词区块文案
c = c.replace(/同义替换（[^）]*）/g, '同义替换（点击发音 · 📖 可看详情）');
// 2) 词库卡片同义词芯片：可跳详情
const oldChips = "const syn = w.s.map(s=>'<button class=\"syn-chip\" data-speak=\"'+escapeHtml(s)+'\">'+escapeHtml(s)+'</button>').join('');";
const newChips = "const syn = w.s.map(s=>'<button class=\"syn-chip'+(dictOf(s)?' linkable':'')+'\" data-w=\"'+escapeHtml(s)+'\" data-speak=\"'+escapeHtml(s)+'\">'+escapeHtml(s)+(dictOf(s)?' 📖':'')+'</button>').join('');";
if (!c.includes(oldChips)) throw new Error('chips not found');
c = c.split(oldChips).join(newChips);
// 3) 词库列表点击：先处理同义词芯片
const oldHandler = "$('#learn-list').addEventListener('click', e=>{\n  const sp = e.target.closest('[data-speak]');\n  if(sp) return;";
const newHandler = "$('#learn-list').addEventListener('click', e=>{\n  const chip = e.target.closest('.syn-chip[data-w]');\n  if(chip){ const cw=chip.dataset.w; if(dictOf(cw)){ openWordDetail(cw); } else { speak(cw); } return; }\n  const sp = e.target.closest('[data-speak]');\n  if(sp) return;";
if (!c.includes(oldHandler)) throw new Error('handler not found');
c = c.split(oldHandler).join(newHandler);
fs.writeFileSync(p, c, 'utf8');
console.log('features.js patched OK; new label count:', (c.match(/同义替换（点击发音/g)||[]).length, '| chip data-w count:', (c.match(/data-w=\\"\+escapeHtml\(s\)/g)||[]).length);