$port = 9223
$list = (Invoke-WebRequest "http://127.0.0.1:$port/json" -UseBasicParsing).Content | ConvertFrom-Json
$page = $list | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$ws.ConnectAsync([Uri][string]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
$id = 0
function Receive-Msg {
  $sb = New-Object System.Text.StringBuilder
  $buf = New-Object byte[] 2097152
  $seg = [ArraySegment[byte]]::new($buf)
  $task = $ws.ReceiveAsync($seg, $ct)
  if (-not $task.Wait(10000)) { return $null }
  $r = $task.GetAwaiter().GetResult()
  [void]$sb.Append([Text.Encoding]::UTF8.GetString($buf, 0, $r.Count))
  while (-not $r.EndOfMessage) {
    $buf2 = New-Object byte[] 2097152
    $seg2 = [ArraySegment[byte]]::new($buf2)
    $task2 = $ws.ReceiveAsync($seg2, $ct)
    if (-not $task2.Wait(10000)) { return $null }
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
  if ($r.timeout -or $r.result.exceptionDetails) { return "ERR" }
  return $r.result.result.value
}
function ShotFull([string]$name) {
  $shot = Send-Cdp 'Page.captureScreenshot' @{ format = 'png'; captureBeyondViewport = $true }
  if ($shot.timeout -or -not $shot.result) { Write-Output "SHOT FAILED $name"; return }
  $png = [Convert]::FromBase64String($shot.result.data)
  [IO.File]::WriteAllBytes((Join-Path 'C:\Users\哈哈哈\Documents\Codex\2026-08-04\zu\work' ("$name.png")), $png)
  Write-Output ("shot $name -> $($png.Length) bytes")
}

# 1) home light (full page)
$null = Eval "(()=>{const s=JSON.parse(localStorage.getItem('ielts-syn-trainer-v1')||'{}'); s.settings=s.settings||{}; s.settings.theme='light'; localStorage.setItem('ielts-syn-trainer-v1',JSON.stringify(s)); location.reload(); return 1;})()"
Start-Sleep -Milliseconds 2500
ShotFull 'v9-full-home-light'
Write-Output ("homeLight: " + (Eval "JSON.stringify({home:!!document.getElementById('view-home'),tabs:[...document.querySelectorAll('.tab')].map(t=>t.dataset.view).join(','),cards:document.querySelectorAll('#view-home .stat-card').length,books:document.querySelectorAll('#view-home .book-card').length})"))
# 2) home dark (full page)
$null = Eval "(()=>{const s=JSON.parse(localStorage.getItem('ielts-syn-trainer-v1')||'{}'); s.settings=s.settings||{}; s.settings.theme='dark'; localStorage.setItem('ielts-syn-trainer-v1',JSON.stringify(s)); location.reload(); return 1;})()"
Start-Sleep -Milliseconds 2500
ShotFull 'v9-full-home-dark'
Write-Output ("themeAttr: " + (Eval "document.documentElement.getAttribute('data-theme')"))
# 3) learn view
$null = Eval "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='learn').click(); return 1;})()"
Start-Sleep -Milliseconds 1000
Write-Output ("learn: " + (Eval "JSON.stringify({learn:!!document.getElementById('view-learn'),words:document.querySelectorAll('#learn-list .word-card').length,filters:document.querySelectorAll('#learn-filter').length})"))
# 4) flash view
$null = Eval "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='flash').click(); return 1;})()"
Start-Sleep -Milliseconds 1000
Write-Output ("flash: " + (Eval "JSON.stringify({flash:!!document.getElementById('view-flash'),start:!!document.getElementById('flash-start'),card:!!document.getElementById('flash-card')})"))
# 5) settings dark view
$null = Eval "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='settings').click(); return 1;})()"
Start-Sleep -Milliseconds 1000
Write-Output ("settings: " + (Eval "JSON.stringify({settings:!!document.getElementById('view-settings'),theme:document.getElementById('set-theme')?document.getElementById('set-theme').value:null,themeSel:document.querySelectorAll('#set-theme option').length})"))
# 6) console errors
$errs = Send-Cdp 'Runtime.evaluate' @{ expression = "window.__errs ? window.__errs : 'no tracker'"; returnByValue = $true }
Write-Output ("console: " + $errs.result.result.value)
$ws.Dispose()
Write-Output 'VERIFY DONE'