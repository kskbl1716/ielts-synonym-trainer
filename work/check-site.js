'use strict';
/* 线上健康检查：一键验证站点部署状态
   用法：node work/check-site.js
   检查：首页可达/词数/关键标记/robots/sitemap/BingSiteAuth/Pages 构建/本地一致/Supabase 连通
   只读，不改任何东西。
*/
const https = require('https');
const fs = require('fs');
const path = require('path');

const SITE = 'https://kskbl1716.github.io/ielts-synonym-trainer/';
const REPO_API = 'https://api.github.com/repos/kskbl1716/ielts-synonym-trainer';

const get = (url, headers) => new Promise((res) => {
  https.get(url, { headers: Object.assign({ 'User-Agent': 'check-site.js' }, headers || {}) }, (r) => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res({ status: r.statusCode, body: d }));
  }).on('error', () => res({ status: 0, body: '' }));
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
    ['版本 v10.x', /版本 v10\.\d/.test(home.body)],
    ['分页 learn-more', home.body.includes('learn-more-bar')],
    ['反馈 _replyto', home.body.includes('_replyto')],
  ];
  for (const [name, ok] of markers) T('标记:' + name, ok200 && ok, ok ? '存在' : '缺失');

  /* 词数：数 WORDS 数组条目（原始 HTML 里是内联 JS，渲染数字不在源码中） */
  const ws = home.body.match(/const WORDS = \[([\s\S]*?)\n\];/);
  const wordCount = ws ? (ws[1].match(/\{t:'/g) || []).length : 0;
  T('词库 WORDS 计数', wordCount === 5622, 'count=' + wordCount);

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
  T('线上/本地一致性', diff < 100, '线上=' + liveLen + ' 本地=' + localLen + (diff === 0 ? '（逐字节一致）' : '（差异 ' + diff + 'B，容差内）'));

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
