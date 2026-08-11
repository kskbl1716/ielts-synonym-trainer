'use strict';
/* 难度自动分级（build 时运行，源词条不加 lv 字段）。
   分级规则（优先级从高到低）：
     1. w 在 awl / band9 词书        → lv=3（学术/高分表达=高级）
     2. 多词短语（w 含空格）查不到词频 → lv=2（功能性短语非高级）
     3. 词频榜排名 ≤2500             → lv=1（基础）
        2501–9000                    → lv=2（进阶）
        >9000 或查不到               → lv=3（高级）
     4. work/lv-overrides.js 人工微调表最后覆盖
   词频数据：hermitdave/FrequencyWords en_50k.txt（GitHub，公开）。
   如 work/lv/freq-en.txt 缺失：curl -x http://127.0.0.1:10808 -o work/lv/freq-en.txt \
       https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/en/en_50k.txt
   注意：freq-en.txt 是公共数据，不纳入推送清单/仓库。 */
const fs = require('fs');
const path = require('path');
const { LV_OVERRIDES } = require('./lv-overrides.js');

const FREQ_PATH = path.join(__dirname, 'lv', 'freq-en.txt');
const RANK1 = 2500;   // ≤2500 → 基础
const RANK2 = 9000;   // 2501–9000 → 进阶；>9000 → 高级

let _rank = null;
function rankMap() {
  if (_rank) return _rank;
  const m = {};
  let i = 0;
  const raw = fs.readFileSync(FREQ_PATH, 'utf8');
  for (const line of raw.split('\n')) {
    if (!line) continue;
    const sp = line.indexOf(' ');
    const w = (sp > 0 ? line.slice(0, sp) : line).trim();
    if (w && !(w in m)) m[w] = ++i;
  }
  _rank = m;
  return m;
}

function assignLv(all) {
  const rank = rankMap();
  let c1 = 0, c2 = 0, c3 = 0;
  for (const w of all) {
    let lv;
    const inAdvBook = (w.b || []).some(id => id === 'awl' || id === 'band9');
    if (inAdvBook) {
      lv = 3;
    } else {
      const r = rank[String(w.w).toLowerCase()];
      if (r === undefined) {
        lv = String(w.w).indexOf(' ') > 0 ? 2 : 3;
      } else if (r <= RANK1) lv = 1;
      else if (r <= RANK2) lv = 2;
      else lv = 3;
    }
    const ov = LV_OVERRIDES[w.w];
    if (ov !== undefined) lv = ov;
    if (lv !== 1 && lv !== 2 && lv !== 3) throw new Error('bad lv ' + lv + ' for ' + w.w);
    w.lv = lv;
    if (lv === 1) c1++; else if (lv === 2) c2++; else c3++;
  }
  console.log('lv distribution: 基础=' + c1 + ' 进阶=' + c2 + ' 高级=' + c3 + ' | overrides=' + Object.keys(LV_OVERRIDES).length);
  return all;
}

module.exports = { assignLv };
