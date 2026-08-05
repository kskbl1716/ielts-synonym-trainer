$ErrorActionPreference = 'Stop'
$list = (Invoke-WebRequest 'http://127.0.0.1:9223/json' -UseBasicParsing).Content | ConvertFrom-Json
$page = $list | Where-Object { $_.type -eq 'page' -and $_.url -like 'http://localhost:8000/*' } | Select-Object -First 1
if (-not $page) {
  $null = Invoke-RestMethod -Method Put "http://127.0.0.1:9223/json/new?http://localhost:8000/"
  Start-Sleep -Milliseconds 1500
  $list = (Invoke-WebRequest 'http://127.0.0.1:9223/json' -UseBasicParsing).Content | ConvertFrom-Json
  $page = $list | Where-Object { $_.type -eq 'page' -and $_.url -like 'http://localhost:8000/*' } | Select-Object -First 1
}
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$null = $ws.ConnectAsync([Uri][string]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
$script:id = 1000
function Invoke-Cdp([string]$method, $params) {
  $script:id++
  $req = @{ id = $script:id; method = $method; params = $params } | ConvertTo-Json -Compress -Depth 20
  $bytes = [Text.Encoding]::UTF8.GetBytes($req)
  $null = $ws.SendAsync([ArraySegment[byte]]::new($bytes), [Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).GetAwaiter().GetResult()
  while ($true) {
    $sb = New-Object System.Text.StringBuilder
    do {
      $buf = New-Object byte[] 524288
      $seg = [ArraySegment[byte]]::new($buf)
      $r = $ws.ReceiveAsync($seg, $ct).GetAwaiter().GetResult()
      [void]$sb.Append([Text.Encoding]::UTF8.GetString($buf, 0, $r.Count))
    } while (-not $r.EndOfMessage)
    $obj = $sb.ToString() | ConvertFrom-Json
    if ($obj.id -eq $script:id) { return $obj.result }
  }
}
function Invoke-Eval([string]$expr) {
  $res = Invoke-Cdp 'Runtime.evaluate' @{ expression = $expr; returnByValue = $true; awaitPromise = $true }
  if ($res.exceptionDetails) { return '__EXC__ ' + $res.exceptionDetails.exception.description }
  return $res.result.value
}
$results = [System.Collections.Generic.List[string]]::new()
function T([string]$name, [string]$expr) {
  try { $v = Invoke-Eval $expr; $results.Add("OK  | $name => " + ($v | ConvertTo-Json -Compress -Depth 10)) }
  catch { $results.Add("FAIL| $name => " + $_.Exception.Message) }
}
function SleepS([int]$ms) { Start-Sleep -Milliseconds $ms }

# ============ 场景A：未配置（游客模式） ============
Invoke-Eval "localStorage.clear(); location.reload(); true" | Out-Null
SleepS 2000
Invoke-Eval "window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message))); true" | Out-Null
T 'a1-login-btn-uncfg' "document.getElementById('login-btn') ? document.getElementById('login-btn').textContent : '__missing__'"
T 'a2-login-click-toast' "(()=>{ document.getElementById('login-btn').click(); const t=document.getElementById('toast').textContent; return t; })()"
T 'a3-learn-works' "document.querySelectorAll('.wc-word').length > 0"

# ============ 注入模拟器 + 屏蔽真实 SDK ============
$null = Invoke-Cdp 'Network.enable' @{}
$null = Invoke-Cdp 'Page.enable' @{}
$null = Invoke-Cdp 'Network.setBlockedURLs' @{ urls = @('*://cdn.jsdelivr.net/*', '*jsdelivr*', '*supabase.co/*') }
$mock = [System.IO.File]::ReadAllText((Join-Path $PSScriptRoot 'mock-supa.js'))
$null = Invoke-Cdp 'Page.addScriptToEvaluateOnNewDocument' @{ source = $mock }

# ============ 场景B：注册 / 登录 / 云同步 ============
Invoke-Eval "localStorage.clear(); location.reload(); true" | Out-Null
SleepS 2500
T 'b1-btn-ready' "document.getElementById('login-btn').textContent"
T 'b2-open-modal' "(()=>{ document.getElementById('login-btn').click(); return !document.getElementById('login-modal').classList.contains('hidden'); })()"
T 'b3-wrong-pass' "(()=>{ document.getElementById('lm-email').value='test@example.com'; document.getElementById('lm-pass').value='wrongpass'; document.getElementById('lm-submit').click(); return true; })()"
SleepS 700
T 'b4-wrong-pass-msg' "document.getElementById('lm-msg').textContent"
T 'b5-register' "(()=>{ document.getElementById('lm-tab-reg').click(); document.getElementById('lm-email').value='test@example.com'; document.getElementById('lm-pass').value='abc123'; document.getElementById('lm-submit').click(); return true; })()"
SleepS 1500
T 'b6-signed-in-badge' "(()=>{ const ub=document.getElementById('user-badge'); return {shown: !ub.classList.contains('hidden'), email: document.getElementById('user-email').textContent, modalHidden: document.getElementById('login-modal').classList.contains('hidden'), cfg: window.__mockStore ? (window.__mockStore.session ? window.__mockStore.session.user.email : null) : '__nomock'}; })()"
T 'b7-cloud-card-logged' "(()=>{ [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='settings').click(); const c=document.getElementById('cloud-card'); return c ? c.textContent : '__missing__'; })()"

# 做一道错题 → stats + wordbook + 云推送
T 'b8-do-practice' "(()=>{ [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='practice').click(); [...document.querySelectorAll('#p-types .type-card')].find(c=>c.querySelector('input').value==='mcq').click(); document.querySelector('#p-start').click(); const q=prac.q; [...document.querySelectorAll('#quiz-body .opt')].find(b=>b.dataset.opt!==q.correct).click(); const w=q.w; document.querySelector('#quiz-quit').click(); return {w:w, seen:state.stats[w]?state.stats[w].seen:0, wb:state.wordbook.includes(w)}; })()"
SleepS 2000
T 'b9-cloud-pushed' "(()=>{ const st=window.__mockStore.store; const uid=window.__mockStore.session.user.id; const row=st[uid]; if(!row) return '__no-row__'; const d=row.data; return {hasStats: !!d.stats && Object.keys(d.stats).length>0, hasWb: d.wordbook.length>0}; })()"

# 设置每日目标 50 → 云同步
T 'b10-set-goal' "(()=>{ [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='settings').click(); [...document.querySelectorAll('#set-goal-presets .btn')].find(b=>b.dataset.goal==='50').click(); return state.goal; })()"
SleepS 2000
T 'b11-goal-pushed' "(()=>{ const row=window.__mockStore.store[window.__mockStore.session.user.id]; return row ? row.data.goal : '__no-row__'; })()"

# 退出登录
T 'b12-logout' "(()=>{ document.getElementById('logout-btn').click(); return true; })()"
SleepS 700
T 'b13-logged-out' "(()=>{ const ub=document.getElementById('user-badge'); return {badgeHidden: ub.classList.contains('hidden'), btn: document.getElementById('login-btn').textContent, storeHas: !!window.__mockStore.store['u1']}; })()"

# 离线状态下本地改动（未登录）→ 重新登录应合并
T 'b14-offline-edit' "(()=>{ state.wordbook.push('zzcloudtest'); state.stats['zzcloudtest']={seen:3,correct:2,wrong:1}; state.goal=20; saveState(); return {goal: state.goal, wb: state.wordbook.includes('zzcloudtest')}; })()"
T 'b15-relogin' "(()=>{ document.getElementById('login-btn').click(); document.getElementById('lm-email').value='test@example.com'; document.getElementById('lm-pass').value='abc123'; document.getElementById('lm-submit').click(); return true; })()"
SleepS 2200
T 'b16-merge-check' "(()=>{ const pw=state.stats['zzcloudtest']; return {goal: state.goal, hasLocalWord: state.wordbook.includes('zzcloudtest'), hasCloudWord: state.wordbook.length>0, localStats: pw?pw.seen:null, totalStats: Object.keys(state.stats).length, totalWb: state.wordbook.length, email: document.getElementById('user-email').textContent}; })()"

# 刷新页面 → 会话恢复 + 数据还在
Invoke-Eval "location.reload(); true" | Out-Null
SleepS 2500
T 'c1-session-restored' "(()=>{ const ub=document.getElementById('user-badge'); return {badgeShown: !ub.classList.contains('hidden'), email: document.getElementById('user-email').textContent, wordbookN: state.wordbook.length, goal: state.goal, statsN: Object.keys(state.stats).length}; })()"
SleepS 1500
T 'c2-persisted-again' "(()=>{ const row=window.__mockStore.store['u1']; return row ? {goal: row.data.goal, wbN: row.data.wordbook.length, hasZ: row.data.wordbook.includes('zzcloudtest')} : '__no-row__'; })()"
T 'c3-no-errors' "({errs: window.__errs || []})"

"==== E2E v6 (CLOUD) RESULTS ($($results.Count) tests) ===="
$fail = 0
foreach ($r in $results) { $r; if ($r -like 'FAIL*') { $fail++ } }
"==== FAILS: $fail ===="
$ws.Dispose()
exit $fail