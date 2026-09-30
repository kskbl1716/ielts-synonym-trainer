$page = (Invoke-RestMethod 'http://127.0.0.1:9223/json' | Where-Object { $_.type -eq 'page' } | Select-Object -First 1)
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$null = $ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
$script:id = 7000
function Cdp([string]$method, $params) {
  $script:id++
  $req = @{ id = $script:id; method = $method }
  if ($null -ne $params) { $req.params = $params }
  $json = $req | ConvertTo-Json -Compress -Depth 12
  $bytes = [Text.Encoding]::UTF8.GetBytes($json)
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
    if ($obj.id -eq $script:id) { return $obj }
  }
}
function Eval([string]$expr) {
  $r = Cdp 'Runtime.evaluate' @{ expression = $expr; returnByValue = $true }
  if ($r.result.exceptionDetails) { return '__EXC__ ' + $r.result.exceptionDetails.exception.description }
  return $r.result.result.value
}
function Shot([string]$name) {
  $r = Cdp 'Page.captureScreenshot' @{ format = 'png'; captureBeyondViewport = $false }
  $b64 = $r.result.data
  [System.IO.File]::WriteAllBytes(("shot-$name.png"), [Convert]::FromBase64String($b64))
  "saved shot-$name.png"
}
$null = Cdp 'Page.enable' $null
# 1) reset & learn view
$null = Eval "localStorage.removeItem('ielts-syn-trainer-v1'); location.reload(); true"
Start-Sleep -Milliseconds 1200
$null = Eval "[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='learn').click()"
Start-Sleep -Milliseconds 300
Shot '01-learn'
# 2) flash with flipped card
$null = Eval "[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='flash').click(); document.querySelector('#flash-start').click(); document.querySelector('#flash-card').click()"
Start-Sleep -Milliseconds 300
Shot '02-flash'
# 3) practice mcq with answered question
$null = Eval "[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='practice').click(); document.querySelector('#p-start').click()"
Start-Sleep -Milliseconds 200
$null = Eval "[...document.querySelectorAll('#quiz-body .opt')].find(b=>b.dataset.opt!==prac.q.correct).click()"
Start-Sleep -Milliseconds 300
Shot '03-practice'
# 4) stats
$null = Eval "[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='stats').click()"
Start-Sleep -Milliseconds 300
Shot '04-stats'
$ws.Dispose()
'all done'