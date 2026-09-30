'use strict';
/* 线上健康检查：一键验证站点部署状态
   用法：node work/check-site.js
   检查：首页可达/词数/关键标记/robots/sitemap/BingSiteAuth/Pages 构建/本地一致/Supabase 连通
   只读，不改任何东西。
*/
const https = require('https');
const net = require('net');
const fs = require('fs');
const path = require('path');

const SITE = 'https://kskbl1716.github.io/ielts-synonym-trainer/';
const REPO_API = 'https://api.github.com/repos/kskbl1716/ielts-synonym-trainer';

/* 可选：直连 api.github.com 不通时走 HTTP 代理（GH_PROXY=http://127.0.0.1:10808），CONNECT 隧道，与 push-gh.js 一致 */
function proxyTunnel(proxy, hostname, port) {
  return new Promise((resolve, reject) => {
    let ph = proxy, pp = 80;
    try { const u = new URL(proxy); ph = u.hostname; pp = u.port || 80; }
    catch (e) { const i = proxy.indexOf('://'); const rest = (i >= 0 ? proxy.slice(i + 3) : proxy); const j = rest.lastIndexOf(':'); if (j > 0){ ph = rest.slice(0, j); pp = +rest.slice(j + 1); } }
    const conn = net.connect(pp, ph, () => {
      conn.write('CONNECT ' + hostname + ':' + port + ' HTTP/1.1\r\nHost: ' + hostname + ':' + port + '\r\nProxy-Connection: keep-alive\r\n\r\n');
    });
    let buf = '';
    conn.on('data', function onData(d){
      buf += d.toString('latin1');
      if (buf.includes('\r\n\r\n')){
        if (/HTTP\/1\.[01] 200/.test(buf)){ conn.removeListener('data', onData); resolve(conn); }
        else { conn.destroy(); reject(new Error('CONNECT failed: ' + buf.slice(0, 80))); }
      }
    });
    conn.on('error', reject);
  });
}

const get = (url, headers) => new Promise((res) => {
  const u = new URL(url);
  const opts = { headers: Object.assign({ 'User-Agent': 'check-site.js' }, headers || {}) };
  /* 只有被墙的 api.github.com 走代理，github.io / Supabase 国内可直连（走代理反而慢） */
  if (process.env.GH_PROXY && u.hostname === 'api.github.com'){
    opts.createConnection = (o, cb) => {
      proxyTunnel(process.env.GH_PROXY, o.hostname || o.host, o.port || 443).then(s => cb(null, s)).catch(cb);
    };
  }
  const req = https.request(u, opts, (r) => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res({ status: r.statusCode, body: d }));
  });
  req.on('error', () => res({ status: 0, body: '' }));
  req.end();
});

(async () => {
  const results = [];
  const T = (name, ok, detail) => results.push([ok ? 'OK  ' : 'FAIL', name + ' — ' + detail]);

  /* 1. 首页可达 + 关键标记 */
  const home = await get(SITE + '?_t=' + Date.now());
  const ok200 = home.status === 200;
  T('首页可达 HTTP 200', ok200, 'status=' + home.status);
  const markers = [
    ['canonical', home.body.includes('rel="canonical"')],
    ['百度统计 hm.js', home.body.includes('hm.baidu.com/hm.js')],
    ['首页更新区', home.body.includes('id="home-updates"')],
    ['顶部提示条', home.body.includes('announce-bar')],
    ['版本 v1[01].x', /版本 v1[01]\.\d/.test(home.body)],
    ['分页 learn-more', home.body.includes('learn-more-bar')],
    ['反馈 _replyto', home.body.includes('_replyto')],
  ];
  for (const [name, ok] of markers) T('标记:' + name, ok200 && ok, ok ? '存在' : '缺失');

  /* 词数：词库已外置为独立 words.js，改从该文件抓取元组条目（每行一个 [ 开头元组）。
     首页只需断言外链存在——它若丢失，页面拿不到词库会整站白屏。 */
  T('标记:words.js 外链', ok200 && home.body.includes('<script src="words.js"></script>'), '外链存在');
  const wjs = await get(SITE + 'words.js?_t=' + Date.now());
  T('words.js 可达 HTTP 200', wjs.status === 200, 'status=' + wjs.status + ' size=' + Buffer.byteLength(wjs.body || ''));
  const ws = (wjs.body || '').match(/const WORDS_RAW=\[([\s\S]*?)\n\];/);
  const wordCount = ws ? (ws[1].match(/\n\[/g) || []).length : 0;
  T('词库 WORDS 计数', wordCount === 6533, 'count=' + wordCount);

  /* 2. 静态文件 */
  const robots = await get(SITE + 'robots.txt');
  T('robots.txt', robots.status === 200 && robots.body.includes('Sitemap:'), 'status=' + robots.status);
  const sitemap = await get(SITE + 'sitemap.xml');
  T('sitemap.xml', sitemap.status === 200 && sitemap.body.includes('<urlset'), 'status=' + sitemap.status);
  const bing = await get(SITE + 'BingSiteAuth.xml');
  T('BingSiteAuth.xml', bing.status === 200 && bing.body.includes('<user>'), 'status=' + bing.status);

  /* 3. Pages 构建状态 */
  if (process.env.GH_TOKEN){
    const pb = await get(REPO_API + '/pages/builds/latest', { 'Authorization': 'Bearer ' + process.env.GH_TOKEN, 'Accept': 'application/vnd.github+json' });
    try { const j = JSON.parse(pb.body); T('Pages 构建', j.status === 'built', 'status=' + j.status + (j.error && j.error.message ? ' err=' + j.error.message : '')); }
    catch(e){ T('Pages 构建', false, 'API 解析失败'); }
  } else {
    T('Pages 构建', false, 'GH_TOKEN 未设置，跳过');
  }

  /* 4. 线上 vs 本地构建一致性（Node 解压测量有少量偏差，用容差；精确认证用 curl cmp） */
  const local = fs.readFileSync('outputs/index.html', 'utf8');
  const liveLen = Buffer.byteLength(home.body);
  const localLen = Buffer.byteLength(local);
  const diff = Math.abs(liveLen - localLen);
  T('线上/本地一致性(index)', diff < 100, '线上=' + liveLen + ' 本地=' + localLen + (diff === 0 ? '（逐字节一致）' : '（差异 ' + diff + 'B，容差内）'));
  if (fs.existsSync('outputs/words.js') && wjs.body){
    const localW = fs.readFileSync('outputs/words.js', 'utf8');
    const diffW = Math.abs(Buffer.byteLength(wjs.body) - Buffer.byteLength(localW));
    T('线上/本地一致性(words.js)', diffW < 100, '线上=' + Buffer.byteLength(wjs.body) + ' 本地=' + Buffer.byteLength(localW) + (diffW === 0 ? '（逐字节一致）' : '（差异 ' + diffW + 'B，容差内）'));
  }

  /* 5. Supabase 连通（用 anon key，只发只读请求） */
  try {
    const cloud = fs.readFileSync(path.join(__dirname, 'cloud.js'), 'utf8');
    const ref = (cloud.match(/supabase\.co/) ? cloud.match(/https:\/\/([a-z0-9]+)\.supabase\.co/) : null);
    const anon = (cloud.match(/SUPABASE_ANON_KEY = '([^']+)'/) || [])[1];
    if (ref && anon){
      const sb = await get('https://' + ref[1] + '.supabase.co/rest/v1/user_data?select=*&limit=1', { 'apikey': anon, 'Authorization': 'Bearer ' + anon });
      T('Supabase 连通(只读探测)', sb.status === 200, 'status=' + sb.status + '（RLS 拦截为 200+[] 即正常）');
    } else { T('Supabase 连通', false, 'cloud.js 未读到配置'); }
  } catch(e){ T('Supabase 连通', false, e.message); }

  /* 输出 */
  console.log('==== 线上健康检查 (' + results.length + ' 项) ====');
  let fail = 0;
  for (const [st, msg] of results){ console.log(st + '| ' + msg); if (st === 'FAIL') fail++; }
  console.log('==== FAILS: ' + fail + ' ====');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('FATAL', e.message); process.exit(2); });
