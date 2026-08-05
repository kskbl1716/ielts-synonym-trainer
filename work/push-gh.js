const fs = require('fs');
const https = require('https');

const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) { console.error('GH_TOKEN not set'); process.exit(1); }
const OWNER = 'kskbl1716';
const REPO = 'ielts-synonym-trainer';
const BASE = 'https://api.github.com';
const sleep = ms => new Promise(r => setTimeout(r, ms));

function gh(method, url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(u, {
      method,
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'codex-maintain',
        'Content-Type': 'application/json'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(d); } catch (e) {}
        resolve({ status: res.statusCode, body: parsed !== null ? parsed : d });
      });
    });
    req.on('error', reject);
    if (body !== undefined) req.write(JSON.stringify(body));
    req.end();
  });
}

async function ghRetry(method, url, body, tries) {
  for (let t = 1; t <= (tries || 4); t++) {
    try {
      const r = await gh(method, url, body);
      if (r.status >= 500 && t < (tries || 4)) { console.log('  retry', t, r.status); await sleep(2000); continue; }
      return r;
    } catch (e) {
      if (t === (tries || 4)) throw e;
      console.log('  retry', t, e.message); await sleep(2000);
    }
  }
}

async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

(async () => {
  const me = await ghRetry('GET', BASE + '/user');
  if (me.status !== 200) { console.error('TOKEN INVALID:', me.status, JSON.stringify(me.body)); process.exit(1); }
  console.log('token OK as', me.body.login);

  const repo = await ghRetry('GET', `${BASE}/repos/${OWNER}/${REPO}`);
  if (repo.status !== 200) { console.error('repo fetch failed', repo.status, JSON.stringify(repo.body)); process.exit(1); }
  const branch = repo.body.default_branch;
  console.log('default branch:', branch);

  const ref = await ghRetry('GET', `${BASE}/repos/${OWNER}/${REPO}/git/ref/heads/${branch}`);
  if (ref.status !== 200) { console.error('ref failed', ref.status, JSON.stringify(ref.body)); process.exit(1); }
  const baseCommitSha = ref.body.object.sha;
  const commit = await ghRetry('GET', `${BASE}/repos/${OWNER}/${REPO}/git/commits/${baseCommitSha}`);
  const baseTreeSha = commit.body.tree.sha;
  console.log('base commit', baseCommitSha.slice(0, 7), 'tree', baseTreeSha.slice(0, 7));

  const rawList = fs.readFileSync('work/.push-filelist.txt');
let listTxt = rawList.includes(0) ? rawList.toString('utf16le') : rawList.toString('utf8');
listTxt = listTxt.replace(/^\uFEFF/, '');
const paths = listTxt.split(/\r?\n/).filter(Boolean);
  if (!paths.includes('index.html')) paths.push('index.html');
  const entries = paths.map(p => ({ path: p, data: fs.readFileSync(p) }));
  console.log('files to push:', entries.length);

  const blobs = await pool(entries, 6, async (e) => {
    const r = await ghRetry('POST', `${BASE}/repos/${OWNER}/${REPO}/git/blobs`, { content: e.data.toString('base64'), encoding: 'base64' });
    if (r.status !== 201) throw new Error('blob fail ' + e.path + ' ' + r.status + ' ' + JSON.stringify(r.body));
    return { path: e.path, sha: r.body.sha };
  });

  const tree = await ghRetry('POST', `${BASE}/repos/${OWNER}/${REPO}/git/trees`, {
    base_tree: baseTreeSha,
    tree: blobs.map(b => ({ path: b.path, mode: '100644', type: 'blob', sha: b.sha }))
  });
  if (tree.status !== 201) { console.error('tree fail', tree.status, JSON.stringify(tree.body)); process.exit(1); }
  console.log('tree created', tree.body.sha.slice(0, 7));

  const newCommit = await ghRetry('POST', `${BASE}/repos/${OWNER}/${REPO}/git/commits`, {
    message: 'Add full source: IELTS synonym trainer (work source, outputs, DEPLOY)',
    tree: tree.body.sha,
    parents: [baseCommitSha]
  });
  if (newCommit.status !== 201) { console.error('commit fail', newCommit.status, JSON.stringify(newCommit.body)); process.exit(1); }
  console.log('commit created', newCommit.body.sha.slice(0, 7));

  const upd = await ghRetry('PATCH', `${BASE}/repos/${OWNER}/${REPO}/git/refs/heads/${branch}`, { sha: newCommit.body.sha, force: false });
  if (upd.status !== 200) { console.error('ref update fail', upd.status, JSON.stringify(upd.body)); process.exit(1); }
  console.log('PUSH OK — branch', branch, 'now at', upd.body.object.sha.slice(0, 7));

  const list = await ghRetry('GET', `${BASE}/repos/${OWNER}/${REPO}/contents/`);
  if (list.status === 200) {
    console.log('repo root:', list.body.map(f => f.name + (f.type === 'dir' ? '/' : '')).join(', '));
  } else {
    console.log('listing failed:', list.status);
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
