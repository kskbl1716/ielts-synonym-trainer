$ErrorActionPreference = 'Stop'
$list = (Invoke-WebRequest 'http://127.0.0.1:9223/json' -UseBasicParsing).Content | ConvertFrom-Json
$page = $list | Where-Object { $_.type -eq 'page' -and $_.url -like 'http://localhost:8000/*' } | Select-Object -First 1
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$null = $ws.ConnectAsync([Uri][string]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
$script:id = 4000
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
function T([string]$name, [string]$expr) {
  Write-Host ("[T-START] " + $name)
  try {
    $v = Invoke-Eval $expr
    Write-Host ("[T-VAL] " + $name + " => " + ($v | ConvertTo-Json -Compress -Depth 10))
  } catch {
    Write-Host ("[T-ERR] " + $name + " => " + $_.Exception.Message)
  }
  Write-Host ("[T-END] " + $name)
}
T 'b8-do-practice' "(()=>{ [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='practice').click(); [...document.querySelectorAll('#p-types .type-card')].find(c=>c.querySelector('input').value==='mcq').click(); document.querySelector('#p-start').click(); const q=prac.q; [...document.querySelectorAll('#quiz-body .opt')].find(b=>b.dataset.opt!==q.correct).click(); const w=q.w; document.querySelector('#quiz-quit').click(); return {w:w, seen:state.stats[w]?state.stats[w].seen:0, wb:state.wordbook.includes(w)}; })()"
Start-Sleep -Milliseconds 2000
T 'b9-check' "(()=>{ const st=window.__mockStore.store; const uid=window.__mockStore.session.user.id; const row=st[uid]; if(!row) return '__no-row__'; const d=row.data; return {statsN:Object.keys(d.stats||{}).length, wbN:(d.wordbook||[]).length, goal:d.goal}; })()"
$ws.Dispose()