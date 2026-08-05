$ErrorActionPreference = 'Stop'
$page = (Invoke-RestMethod 'http://127.0.0.1:9223/json' | Where-Object { $_.type -eq 'page' } | Select-Object -First 1)
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$null = $ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
$script:id = 2000
function Invoke-Cdp([string]$method, $params) {
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
function Shot([string]$name) {
  $r = Invoke-Cdp 'Page.captureScreenshot' @{ format = 'png' }
  $bytes = [Convert]::FromBase64String($r.result.data)
  [IO.File]::WriteAllBytes((Join-Path (Get-Location) "work\$name.png"), $bytes)
  "saved work\$name.png ($($bytes.Length) bytes)"
}
Invoke-Cdp 'Page.enable' @{} | Out-Null
# 词库页
Invoke-Cdp 'Runtime.evaluate' @{ expression = "location.href='http://127.0.0.1:8123/'; true"; returnByValue = $true } | Out-Null
Start-Sleep -Milliseconds 1500
Invoke-Cdp 'Runtime.evaluate' @{ expression = "document.querySelector('#learn-list .word-card').click(); true"; returnByValue = $true } | Out-Null
Start-Sleep -Milliseconds 600
Shot 'shot-v2-modal'
Invoke-Cdp 'Runtime.evaluate' @{ expression = "document.querySelector('#wm-ok').click(); [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='learn').click(); true"; returnByValue = $true } | Out-Null
Start-Sleep -Milliseconds 400
Shot 'shot-v2-learn'
Invoke-Cdp 'Runtime.evaluate' @{ expression = "document.querySelector('#learn-search').value='environ'; document.querySelector('#learn-search').dispatchEvent(new Event('input')); true"; returnByValue = $true } | Out-Null
Start-Sleep -Milliseconds 400
Shot 'shot-v2-search'
$ws.Dispose()