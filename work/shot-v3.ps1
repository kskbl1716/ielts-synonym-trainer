$ErrorActionPreference = 'Stop'
$page = @(Invoke-RestMethod 'http://127.0.0.1:9223/json' | Where-Object { $_.type -eq 'page' -and $_.url -like 'http*' })[0]
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$null = $ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
$script:id = 1000
function Send-Cdp([string]$method, [hashtable]$params) {
  $script:id++
  $req = @{ id = $script:id; method = $method; params = $params } | ConvertTo-Json -Compress -Depth 12
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
    if ($obj.id -eq $script:id) { return $obj }
  }
}
$expr = "(()=>{const t=todayStr();const fmt=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');state.goal=20;state.daily={date:t,count:20};state.checkins=[fmt(new Date(Date.now()-4*864e5)),fmt(new Date(Date.now()-3*864e5)),fmt(new Date(Date.now()-2*864e5)),fmt(new Date(Date.now()-864e5)),t];saveState();switchView('stats');return document.querySelector('#cal-title').textContent;})()"
$r = Send-Cdp 'Runtime.evaluate' @{ expression = $expr; returnByValue = $true }
"cal-title: " + $r.result.result.value
Start-Sleep -Milliseconds 600
$shot = Send-Cdp 'Page.captureScreenshot' @{ format = 'png'; captureBeyondViewport = $false }
$b64 = $shot.result.data
$png = [Convert]::FromBase64String($b64)
[IO.File]::WriteAllBytes((Join-Path (Get-Location) 'work\shot-v3-checkin.png'), $png)
"screenshot saved: $($png.Length) bytes"
$ws.Dispose()