$ErrorActionPreference = 'Stop'
$port = 9223
Start-Sleep -Milliseconds 1200
$list = (Invoke-WebRequest "http://127.0.0.1:$port/json" -UseBasicParsing).Content | ConvertFrom-Json
$page = $list | Where-Object { $_.type -eq 'page' -and $_.url -like 'http://localhost:8000/*' } | Select-Object -First 1
if (-not $page) { $null = Invoke-RestMethod -Method Put "http://127.0.0.1:$port/json/new?http://localhost:8000/"; Start-Sleep -Milliseconds 2000; $list = (Invoke-WebRequest "http://127.0.0.1:$port/json" -UseBasicParsing).Content | ConvertFrom-Json; $page = $list | Where-Object { $_.type -eq 'page' -and $_.url -like 'http://localhost:8000/*' } | Select-Object -First 1 }
if (-not $page) { throw 'no page' }
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
  if ($r.timeout) { return $null }
  if ($r.result.exceptionDetails) { return $null }
  return $r.result.result.value
}
function Shot([string]$name) {
  $shot = Send-Cdp 'Page.captureScreenshot' @{ format = 'png'; captureBeyondViewport = $false }
  if ($shot.timeout -or -not $shot.result) { return }
  $png = [Convert]::FromBase64String($shot.result.data)
  [IO.File]::WriteAllBytes((Join-Path 'C:\Users\哈哈哈\Documents\Codex\2026-08-04\zu\work' ("$name.png")), $png)
  Write-Output ("shot $name -> $($png.Length) bytes")
}
$null = Eval "(()=>{localStorage.removeItem('ielts-syn-trainer-v1'); location.reload(); return 1;})()"
Start-Sleep -Milliseconds 2500
Shot 'v9-shot-01-home-light'
$null = Eval "(()=>{const s=JSON.parse(localStorage.getItem('ielts-syn-trainer-v1')||'{}'); s.settings=s.settings||{}; s.settings.theme='dark'; localStorage.setItem('ielts-syn-trainer-v1',JSON.stringify(s)); location.reload(); return 1;})()"
Start-Sleep -Milliseconds 2500
Shot 'v9-shot-02-home-dark'
$null = Eval "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='learn').click(); return 1;})()"
Start-Sleep -Milliseconds 800
Shot 'v9-shot-03-learn'
$null = Eval "(()=>{const first=document.querySelector('#learn-list .word-card'); if(first) first.click(); return 1;})()"
Start-Sleep -Milliseconds 800
Shot 'v9-shot-04-detail'
$null = Eval "(()=>{const m=document.querySelector('.modal-mask'); if(m){m.classList.add('hidden');} [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='flash').click(); return 1;})()"
Start-Sleep -Milliseconds 800
Shot 'v9-shot-05-flash'
$null = Eval "(()=>{const b=document.getElementById('flash-start'); if(b) b.click(); return 1;})()"
Start-Sleep -Milliseconds 800
$null = Eval "(()=>{const c=document.getElementById('flash-card'); if(c) c.click(); return 1;})()"
Start-Sleep -Milliseconds 900
Shot 'v9-shot-06-flash-flip'
$null = Eval "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='settings').click(); return 1;})()"
Start-Sleep -Milliseconds 800
Shot 'v9-shot-07-settings-dark'
$ws.Dispose()
Write-Output 'ALL DONE'