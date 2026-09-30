'use strict';
/* 难度人工微调表：覆盖自动分级结果。{ 'word': 1|2|3 }（1基础 2进阶 3高级）
   只在 build 时使用（work/lv-assign.js 最后一步读取）；此表之外全部由词频榜自动打标。
   抽查边界词时往里加，key 与词条 w 完全一致（含大小写/空格）。 */
const LV_OVERRIDES = {
  /* 示例（可删）：{ 'according to': 2 } */
};
module.exports = { LV_OVERRIDES };
