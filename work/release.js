'use strict';
/* 一键发布：build → copy → (可选 e2e) → git commit → push-gh.js → 线上验证
   用法：
     node work/release.js "提交信息" [额外新文件...] [--e2e]
   说明：
   - 提交信息必填（完整信息含 Co-Authored-By 尾部）
   - 额外文件参数：本次新增的、未纳入 git 跟踪的文件（如 TROUBLESHOOTING.md）
   - --e2e：若本地 8000 服务器 + 9223 调试浏览器都在，先跑 e2e-v7.ps1 再发布；不在则警告跳过
   - 已跟踪文件的改动用 `git add -u` 全收；push 走 push-gh.js（GitHub 主域被墙，勿用 git push）
*/
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const e2eIdx = args.indexOf('--e2e');
const doE2E = e2eIdx >= 0;
if (e2eIdx >= 0) args.splice(e2eIdx, 1);
const msg = args[0];
const extraFiles = args.slice(1);

if (!msg){ console.error('用法: node work/release.js "提交信息" [额外新文件...] [--e2e]'); process.exit(1); }
if (!process.env.GH_TOKEN){ console.error('GH_TOKEN 未设置，无法推送'); process.exit(1); }

const run = (cmd, opts) => { console.log('\n▶', cmd); execSync(cmd, Object.assign({ stdio: 'inherit' }, opts || {})); };
const up = (url) => { try { const o = execSync('curl -s -o /dev/null -w %{http_code} ' + url, { encoding: 'utf8' }); return String(o).trim() === '200'; } catch(e){ return false; } };

/* 1. 构建 + 复制根文件（词库已外置 words.js，同样复制到根） */
run('node work/build.js');
fs.copyFileSync('outputs/index.html', 'index.html');
console.log('▶ copy outputs/index.html → index.html');
fs.copyFileSync('outputs/words.js', 'words.js');
console.log('▶ copy outputs/words.js → words.js');

/* 2. 可选 e2e（需 server+browser 在跑） */
if (doE2E){
  if (up('http://127.0.0.1:8000/') && up('http://127.0.0.1:9223/json')){
    run('powershell.exe -NoProfile -ExecutionPolicy Bypass -File work/e2e-v7.ps1');
  } else {
    console.warn('⚠️ 本地 server(8000) 或调试浏览器(9223) 未在跑，跳过 e2e（建议先手动跑）。');
  }
}

/* 3. git commit（本地留痕） */
run('git add -u');
run('git add outputs/words.js words.js');
if (extraFiles.length) run('git add ' + extraFiles.map(f => '"' + f.replace(/"/g, '\\"') + '"').join(' '));
run('git commit -m "' + msg.replace(/"/g, '\\"') + '"');

/* 4. 推送（走 push-gh.js） */
run('node work/push-gh.js');

/* 5. 线上验证 */
console.log('\n▶ 等待 Pages 部署…');
execSync('sleep 25', { stdio: 'inherit' });
const https = require('https');
const get = (url, headers) => new Promise((res) => https.get(url, { headers: headers || {} }, (r) => { let d = ''; r.on('data', c => d += c); r.on('end', () => res({ status: r.statusCode, body: d, len: r.headers['content-length'] })); }).on('error', () => res({ status: 0, body: '', len: 0 })));
(async () => {
  try {
    const b = await get('https://api.github.com/repos/kskbl1716/ielts-synonym-trainer/pages/builds/latest', { 'Authorization': 'Bearer ' + process.env.GH_TOKEN, 'Accept': 'application/vnd.github+json', 'User-Agent': 'release.js' });
    let st = 'unknown'; try { st = JSON.parse(b.body).status; } catch(e){}
    console.log('Pages 构建:', st);
    const ts = Date.now();
    const live = await get('https://kskbl1716.github.io/ielts-synonym-trainer/?_t=' + ts);
    const local = fs.statSync('outputs/index.html').size;
    const liveLen = Buffer.byteLength(live.body);
    console.log('线上 HTTP', live.status, '| 线上字节', liveLen, '| 本地字节', local, liveLen === local ? '✓ 一致' : '⚠️ 不一致（可能 CDN 缓存）');
  } catch(e){ console.error('验证异常:', e.message); }
})();
