'use strict';
/* P3 词根词缀数据合并表：{ word: { rt:词根, af:词缀拆分+含义, mn:记忆提示 } }
   分批文件 rootdata-1..N.js 各导出 { BATCH }，这里合并；build.js 在 assignRoots 里查表注入词条。 */
const fs = require('fs');
const path = require('path');
const R = {};
for (let i = 1; i <= 10; i++) {
  const f = path.join(__dirname, 'rootdata-' + i + '.js');
  if (fs.existsSync(f)) Object.assign(R, require(f).BATCH || {});
}
module.exports = { ROOTDATA: R };
