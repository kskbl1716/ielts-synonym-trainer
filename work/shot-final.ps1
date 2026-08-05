$ErrorActionPreference = 'Stop'
$list = (Invoke-WebRequest 'http://127.0.0.1:9223/json' -UseBasicParsing).Content | ConvertFrom-Json
$page = $list | Where-Object { $_.type -eq 'page' -and $_.url -like 'http://localhost:8000/*' } | Select-Object -First 1
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$null = $ws.ConnectAsync([Uri][string]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
$script:id = 1000
function Receive-Msg {
  $sb = New-Object System.Text.StringBuilder
  $buf = New-Object byte[] 524288
  $seg = [ArraySegment[byte]]::new($buf)
  $task = $ws.ReceiveAsync($seg, $ct)
  if (-not $task.Wait(6000)) { return $null }
  $r = $task.GetAwaiter().GetResult()
  [void]$sb.Append([Text.Encoding]::UTF8.GetString($buf, 0, $r.Count))
  while (-not $r.EndOfMessage) {
    $buf2 = New-Object byte[] 524288
    $seg2 = [ArraySegment[byte]]::new($buf2)
    $task2 = $ws.ReceiveAsync($seg2, $ct)
    if (-not $task2.Wait(6000)) { return $null }
    $r = $task2.GetAwaiter().GetResult()
    [void]$sb.Append([Text.Encoding]::UTF8.GetString($buf2, 0, $r.Count))
  }
  return ($sb.ToString() | ConvertFrom-Json)
}
function Send-Cdp([string]$method, [hashtable]$params) {
  $script:id++
  $req = @{ id = $script:id; method = $method; params = $params } | ConvertTo-Json -Compress -Depth 12
  $bytes = [Text.Encoding]::UTF8.GetBytes($req)
  $null = $ws.SendAsync([ArraySegment[byte]]::new($bytes), [Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).GetAwaiter().GetResult()
  while ($true) {
    $obj = Receive-Msg
    if ($null -eq $obj) { return @{ timeout = $true } }
    if ($obj.id -eq $script:id) { return $obj }
  }
}
function Eval([string]$expr) {
  $r = Send-Cdp 'Runtime.evaluate' @{ expression = $expr; returnByValue = $true }
  if ($r.timeout) { Write-Output '  [eval timeout]'; return $null }
  if ($r.result.exceptionDetails) { Write-Output ('  [eval exc] ' + $r.result.exceptionDetails.exception.description); return $null }
  return $r.result.result.value
}
function Shot([string]$name) {
  $shot = Send-Cdp 'Page.captureScreenshot' @{ format = 'png'; captureBeyondViewport = $false }
  if ($shot.timeout) { Write-Output "  [shot $name timeout]"; return }
  $png = [Convert]::FromBase64String($shot.result.data)
  [IO.File]::WriteAllBytes((Join-Path (Get-Location) "work\final-$name.png"), $png)
  Write-Output ("shot $name -> $($png.Length) bytes")
}
$null = Eval "(()=>{localStorage.removeItem('ielts-syn-trainer-v1'); location.reload(); return 1;})()"
Start-Sleep -Milliseconds 1800
$null = Eval "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='learn').click(); const inp=document.querySelector('#learn-search'); if(inp){inp.value='surge'; inp.dispatchEvent(new Event('input'));} return 1;})()"
Start-Sleep -Milliseconds 600
$null = Eval "(()=>{const c=[...document.querySelectorAll('#learn-list .word-card')].find(c=>c.dataset.w==='surge'); if(c) c.click(); return 1;})()"
Start-Sleep -Milliseconds 400
Shot 'learn-modal'
$null = Eval "(()=>{document.querySelector('#wm-ok').click(); [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='settings').click(); [...document.querySelectorAll('#set-font .chip')].find(b=>b.dataset.v==='l').click(); return 1;})()"
Start-Sleep -Milliseconds 500
Shot 'settings'
$null = Eval "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='practice').click(); [...document.querySelectorAll('#p-zones .chip')].find(b=>b.dataset.z==='w').click(); return 1;})()"
Start-Sleep -Milliseconds 500
Shot 'practice-writing'
$ws.Dispose()