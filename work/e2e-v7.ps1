$ErrorActionPreference = 'Stop'
$list = (Invoke-WebRequest 'http://127.0.0.1:9223/json' -UseBasicParsing).Content | ConvertFrom-Json
$page = $list | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
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

# 注入 mock + 屏蔽真实 SDK
$null = Invoke-Cdp 'Network.enable' @{}
$null = Invoke-Cdp 'Page.enable' @{}
$null = Invoke-Cdp 'Network.setBlockedURLs' @{ urls = @('*://cdn.jsdelivr.net/*', '*jsdelivr*', '*supabase.co/*') }
$mock = [System.IO.File]::ReadAllText((Join-Path (Get-Location) 'work/mock-supa.js'))
$null = Invoke-Cdp 'Page.addScriptToEvaluateOnNewDocument' @{ source = $mock }
Invoke-Eval "localStorage.clear(); location.reload(); true" | Out-Null
SleepS 2500
Invoke-Eval "window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message))); true" | Out-Null

# 登录
T 'n1-words-total' "WORDS.length"
T 'n2-register' "(()=>{ document.getElementById('login-btn').click(); document.getElementById('lm-tab-reg').click(); document.getElementById('lm-email').value='me@test.com'; document.getElementById('lm-pass').value='abc123'; document.getElementById('lm-submit').click(); return true; })()"
SleepS 1500
T 'n3-logged-in' "(()=>{ const em=document.getElementById('user-email'); return {shown:!document.getElementById('user-badge').classList.contains('hidden'), email:em?em.textContent:null, cur:window.__CURRENT_USER_EMAIL__}; })()"

# 模拟浏览器把邮箱自动填进搜索框（触发 input 事件）
T 'n4-autofill-guard' "(()=>{ const inp=document.getElementById('learn-search'); inp.value='me@test.com'; inp.dispatchEvent(new Event('input',{bubbles:true})); return {val:inp.value, q:learnQuery, cards:document.querySelectorAll('#learn-list .word-card').length}; })()"

# 普通搜索正常
T 'n5-search-word' "(()=>{ const inp=document.getElementById('learn-search'); inp.value='surge'; inp.dispatchEvent(new Event('input',{bubbles:true})); return {cards:document.querySelectorAll('#learn-list .word-card').length, first:document.querySelector('#learn-list .wc-word')?document.querySelector('#learn-list .wc-word').textContent:null}; })()"

# 搜索无结果 → 清除搜索按钮
T 'n6-search-empty' "(()=>{ const inp=document.getElementById('learn-search'); inp.value='zzzqqqxxx'; inp.dispatchEvent(new Event('input',{bubbles:true})); const btn=document.getElementById('learn-clear-search'); return {empty:!!document.querySelector('#learn-list .empty'), btn:!!btn, msg:document.querySelector('#learn-list .empty')?document.querySelector('#learn-list .empty').textContent.slice(0,30):null}; })()"
T 'n7-clear-search' "(()=>{ document.getElementById('learn-clear-search').click(); return {q:learnQuery, val:document.getElementById('learn-search').value, cards:document.querySelectorAll('#learn-list .word-card').length}; })()"

# 专区+主题叠加为空 → 清除筛选按钮
T 'n8-filter-empty' "(()=>{ learnZone='w'; learnTopic='food'; renderLearn(); const btn=document.getElementById('learn-clear-filter'); return {empty:!!document.querySelector('#learn-list .empty'), btn:!!btn, msg:document.querySelector('#learn-list .empty')?document.querySelector('#learn-list .empty').textContent.slice(0,30):null}; })()"
T 'n9-clear-filter' "(()=>{ document.getElementById('learn-clear-filter').click(); return {zone:learnZone, topic:learnTopic, cards:document.querySelectorAll('#learn-list .word-card').length}; })()"

# 设置 → 返回词库 词库正常显示
T 'n10-settings-back' "(()=>{ [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='settings').click(); [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='learn').click(); return {cards:document.querySelectorAll('#learn-list .word-card').length, empty:!!document.querySelector('#learn-list .empty'), zone:learnZone, topic:learnTopic}; })()"

# 登录邮箱污染检查：onAuth 后搜索框不应等于邮箱
T 'n11-no-email-in-search' "document.getElementById('learn-search').value"

# Enter 打开第一个结果详情
T 'n12-enter-detail' "(()=>{ const inp=document.getElementById('learn-search'); inp.value='alleviate'; inp.dispatchEvent(new Event('input',{bubbles:true})); inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); const open=!document.getElementById('word-modal').classList.contains('hidden'); document.getElementById('wm-close').click(); return {open:open, first:document.querySelector('#learn-list .wc-word')?document.querySelector('#learn-list .wc-word').textContent:null}; })()"

# 抽查新词详情弹窗
T 'n13-new-word-detail' "(()=>{ openWordDetail('bolster'); const head=document.getElementById('wm-word-head').textContent; const body=document.getElementById('wm-body').textContent; document.getElementById('wm-close').click(); return {head:head.slice(0,40), body:body.slice(0,60)}; })()"

T 'n14-no-errors' "JSON.stringify(window.__errs||[])"
"==== E2E v7 专项结果 ($($results.Count) 项) ===="
$fail = 0
foreach ($r in $results) { $r; if ($r -like 'FAIL*' -or $r -like 'OK  | *__EXC__*') { $fail++ } }
"==== FAILS: $fail ===="
$ws.Dispose()
exit $fail