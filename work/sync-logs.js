'use strict';
/* 日志同步检查：确认四处（AGENTS.md 当前状态 / DEPLOY.md 当前版本 / UPDATES / FEATURE_LOG）都同步到最新版本
   用法：node work/sync-logs.js
   只读，不改任何东西。漏哪处输出哪处。 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const features = fs.readFileSync(path.join(__dirname, 'features.js'), 'utf8');

/* 1. 权威版本号：从页面「关于」文本提取（"版本 vX.Y"） */
const verMatch = features.match(/版本 v(\d+)\.(\d+)/);
const ver = verMatch ? 'v' + verMatch[1] + '.' + verMatch[2] : null;
if (!ver){ console.log('FAIL| 无法从 features.js 提取版本号'); process.exit(1); }
console.log('当前版本:', ver, '\n');

/* 2. 检查四处是否同步 */
const results = [];

// AGENTS.md「当前线上状态」行
const agents = fs.readFileSync(path.join(ROOT, 'AGENTS.md'), 'utf8');
const agentsLine = (agents.match(/当前线上状态[^\n]*/) || [''])[0];
results.push(['AGENTS.md 当前线上状态', agentsLine.includes(ver), agentsLine.slice(0, 60)]);

// DEPLOY.md「当前版本」行
const deploy = fs.readFileSync(path.join(ROOT, 'DEPLOY.md'), 'utf8');
const deployLine = (deploy.match(/当前版本[^\n]*/) || [''])[0];
results.push(['DEPLOY.md 当前版本', deployLine.includes(ver), deployLine.slice(0, 60)]);

// features.js UPDATES 顶部第一条
const upMatch = features.match(/var UPDATES = \[\s*\{[^}]*v:'(v\d+\.\d+)'/);
results.push(['features.js UPDATES 顶部', upMatch && upMatch[1] === ver, upMatch ? '顶部=' + upMatch[1] : '未匹配']);

// features.js FEATURE_LOG 顶部第一条
const flMatch = features.match(/var FEATURE_LOG = \[\s*\{v:'(v\d+\.\d+)'/);
results.push(['features.js FEATURE_LOG 顶部', flMatch && flMatch[1] === ver, flMatch ? '顶部=' + flMatch[1] : '未匹配']);

/* 输出 */
let fail = 0;
console.log('==== 日志同步检查 ====');
for (const [name, ok, detail] of results){
  console.log((ok ? 'OK  ' : 'FAIL') + '| ' + name + (detail ? ' — ' + detail : ''));
  if (!ok) fail++;
}
console.log('==== FAILS: ' + fail + ' ====');
process.exit(fail ? 1 : 0);
