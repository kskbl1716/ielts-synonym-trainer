$ErrorActionPreference = 'Stop'
$port = 9223
$list = (Invoke-WebRequest "http://127.0.0.1:$port/json" -UseBasicParsing).Content | ConvertFrom-Json
$page = $list | Where-Object { $_.type -eq 'page' -and $_.url -like 'http://localhost:8000/*' } | Select-Object -First 1
if (-not $page) { $null = Invoke-RestMethod -Method Put "http://127.0.0.1:$port/json/new?http://localhost:8000/"; Start-Sleep -Milliseconds 1500; $list = (Invoke-WebRequest "http://127.0.0.1:$port/json" -UseBasicParsing).Content | ConvertFrom-Json; $page = $list | Where-Object { $_.type -eq 'page' -and $_.url -like 'http://localhost:8000/*' } | Select-Object -First 1 }
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
  [IO.File]::WriteAllBytes((Join-Path (Get-Location) "work\$name.png"), $png)
  Write-Output ("shot $name -> $($png.Length) bytes")
}
$null = Eval "(()=>{localStorage.removeItem('ielts-syn-trainer-v1'); learnZone='all'; learnTopic='all'; learnQuery=''; location.reload(); return 1;})()"
Start-Sleep -Milliseconds 2200
$null = Eval "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='learn').click(); return 1;})()"
Start-Sleep -Milliseconds 600
Shot 'shot-v7-learn'
$null = Eval "(()=>{const inp=document.getElementById('learn-search'); inp.value='zzzqqq'; inp.dispatchEvent(new Event('input',{bubbles:true})); return 1;})()"
Start-Sleep -Milliseconds 500
Shot 'shot-v7-empty-search'
$null = Eval "(()=>{const inp=document.getElementById('learn-search'); inp.value=''; inp.dispatchEvent(new Event('input',{bubbles:true})); learnZone='w'; learnTopic='food'; renderLearn(); return 1;})()"
Start-Sleep -Milliseconds 500
Shot 'shot-v7-empty-filter'
$null = Eval "(()=>{learnZone='all'; learnTopic='all'; renderLearn(); openWordDetail('bolster'); return 1;})()"
Start-Sleep -Milliseconds 500
Shot 'shot-v7-detail'
$null = Eval "(()=>{closeWordDetail(); [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='settings').click(); return 1;})()"
Start-Sleep -Milliseconds 500
Shot 'shot-v7-settings'
$ws.Dispose()