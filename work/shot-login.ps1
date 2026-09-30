$ErrorActionPreference = 'Stop'
$list = (Invoke-WebRequest 'http://127.0.0.1:9223/json' -UseBasicParsing).Content | ConvertFrom-Json
$page = $list | Where-Object { $_.type -eq 'page' -and $_.url -like 'http://localhost:8000/*' } | Select-Object -First 1
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$null = $ws.ConnectAsync([Uri][string]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
$script:id = 5000
function Invoke-Cdp([string]$method, $params) {
  $script:id++
  $req = @{ id = $script:id; method = $method; params = $params } | ConvertTo-Json -Compress -Depth 20
  $bytes = [Text.Encoding]::UTF8.GetBytes($req)
  $null = $ws.SendAsync([ArraySegment[byte]]::new($bytes), [Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).GetAwaiter().GetResult()
  while ($true) {
    $sb = New-Object System.Text.StringBuilder
    do {
      $buf = New-Object byte[] 1048576
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
$null = Invoke-Cdp 'Page.enable' @{}
# 先退出登录态，打开登录弹窗
Invoke-Eval "try{ document.getElementById('logout-btn').click(); }catch(e){} localStorage.removeItem('sb-mock-session'); location.reload(); true" | Out-Null
Start-Sleep -Milliseconds 2500
Invoke-Eval "document.getElementById('login-btn').click(); true" | Out-Null
Start-Sleep -Milliseconds 400
$shot = Invoke-Cdp 'Page.captureScreenshot' @{ format = 'png' }
[System.IO.File]::WriteAllBytes((Join-Path (Get-Location) 'work/shot-login.png'), [Convert]::FromBase64String($shot.data))
Write-Host 'screenshot saved'
$ws.Dispose()
