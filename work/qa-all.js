'use strict';
/* 一键 QA：语法校验 + 词数断言 + 构建幂等 + e2e 核心回归
   用法：node work/qa-all.js
   前置：e2e 需先起 python -m http.server 8000 + Edge --remote-debugging-port=9223 打开 http://localhost:8000/
   无 e2e 环境时自动跳过 e2e（只跑语法/词数/构建），并提示如何起环境。 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'outputs', 'index.html');
const WORDS_JS = path.join(ROOT, 'outputs', 'words.js');
const results = [];
const T = (name, ok, detail) => results.push([!!ok, name + (detail ? ' — ' + detail : '')]);

/* 1. 主脚本语法校验 */
function checkSyntax(){
  const html = fs.readFileSync(OUT, 'utf8');
  const scripts = [];
  const re = /<script>([\s\S]*?)<\/script>/g;
  let m; while ((m = re.exec(html))) scripts.push(m[1]);
  const main = scripts[scripts.length - 1];
  try { new Function(main); T('主脚本语法', true, scripts.length + ' 段内联脚本'); }
  catch (e) { T('主脚本语法', false, e.message); }
}

/* 2. 词数断言（词库已外置到 outputs/words.js，不再内联于 index.html） */
function checkWords(){
  if (!fs.existsSync(WORDS_JS)) { T('词库计数 6533', false, 'outputs/words.js 不存在'); return; }
  const src = fs.readFileSync(WORDS_JS, 'utf8');
  const ws = src.match(/const WORDS_RAW=\[([\s\S]*?)\n\];/);
  const count = ws ? (ws[1].match(/\n\[/g) || []).length : 0;
  T('词库计数 6533', count === 6533, 'count=' + count);
  try { new Function(src); T('words.js 语法', true, Math.round(src.length / 1024) + ' KB'); }
  catch (e) { T('words.js 语法', false, e.message); }
  /* 外链引用必须在 index.html 里存在，否则页面拿不到词库 */
  const html = fs.readFileSync(OUT, 'utf8');
  T('index.html 引用 words.js', html.includes('<script src="words.js"></script>'), '外链标签存在');
  /* 拆 script 后严格模式必须显式补回（原巨型 script 顶部有 use strict） */
  T('拆分后恢复严格模式', /<script src="words\.js"><\/script>\s*<script>\s*'use strict';/.test(html), 'use strict 已补回');
}

/* 3. 构建幂等（连续两次 build 字节一致 = 不双注入）
   注意：stdio:'inherit'（不用 'pipe'）——DSH 沙箱禁止子进程 stdio 管道捕获（EPERM），
   且 build/e2e 的成败本就靠 exit code 判定，不需要捕获 stdout。 */
function checkBuildIdempotent(){
  const before = fs.readFileSync(OUT);
  const beforeW = fs.existsSync(WORDS_JS) ? fs.readFileSync(WORDS_JS) : null;
  try {
    execSync('node work/build.js', { cwd: ROOT, stdio: 'inherit' });
    const once = fs.readFileSync(OUT);
    const onceW = fs.readFileSync(WORDS_JS);
    execSync('node work/build.js', { cwd: ROOT, stdio: 'inherit' });
    const twice = fs.readFileSync(OUT);
    const twiceW = fs.readFileSync(WORDS_JS);
    T('构建幂等', once.equals(twice) && onceW.equals(twiceW), '两次 build 字节一致（index + words）');
    T('产物最新', once.equals(before) && (beforeW ? onceW.equals(beforeW) : true), 'build 后与源一致');
    fs.writeFileSync(OUT, before);   // 恢复（幂等时本就一样）
    if (beforeW) fs.writeFileSync(WORDS_JS, beforeW);
  } catch (e) {
    T('构建', false, e.message);
  }
}

/* 4. e2e 核心回归（需本地服务器 + Edge CDP） */
function e2eReady(){
  return new Promise((resolve) => {
    const req = http.get('http://127.0.0.1:9223/json', (r) => { resolve(true); r.resume(); });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => { req.destroy(); resolve(false); });
  });
}
function runE2E(){
  const suite = ['e2e-v11-srs', 'e2e-v10-m2', 'e2e-v10-m3', 'e2e-v10-m4', 'e2e-fix-resagain', 'e2e-fix-phint'];
  let pass = 0, fail = 0;
  for (const s of suite){
    try {
      execSync('node work/' + s + '.js', { cwd: ROOT, stdio: 'inherit', timeout: 120000 });
      pass++; T('e2e:' + s, true, '通过');
    } catch (e) {
      fail++;
      const why = e.status === null ? 'killed/timeout' : 'exit ' + e.status;
      T('e2e:' + s, false, why);
    }
  }
  if (fail === 0) T('e2e 汇总', true, pass + ' 套全绿');
}

(async () => {
  checkSyntax();
  checkWords();
  checkBuildIdempotent();
  if (await e2eReady()){
    runE2E();
  } else {
    T('e2e 环境', false, '未检测到 Edge CDP 9223，跳过 e2e（先起 http.server 8000 + Edge 9223 打开 localhost:8000）');
  }
  /* 汇总 */
  let fail = 0;
  console.log('==== 一键 QA (' + results.length + ' 项) ====');
  for (const [ok, msg] of results){ console.log((ok ? 'OK  ' : 'FAIL') + '| ' + msg); if (!ok) fail++; }
  console.log('==== FAILS: ' + fail + ' ====');
  process.exit(fail ? 1 : 0);
})();
