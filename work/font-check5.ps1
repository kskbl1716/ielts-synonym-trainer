$ErrorActionPreference = 'Stop'
$list = (Invoke-WebRequest 'http://127.0.0.1:9223/json' -UseBasicParsing).Content | ConvertFrom-Json
$page = $list | Where-Object { $_.type -eq 'page' -and $_.url -like 'http://localhost:8000/*' } | Select-Object -First 1
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$null = $ws.ConnectAsync([Uri][string]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
$script:id = 1000
function Invoke-Eval([string]$expr) {
  $script:id++
  $req = @{ id = $script:id; method = 'Runtime.evaluate'; params = @{ expression = $expr; returnByValue = $true; awaitPromise = $true } } | ConvertTo-Json -Compress -Depth 12
  $bytes = [Text.Encoding]::UTF8.GetBytes($req)
  $null = $ws.SendAsync([ArraySegment[byte]]::new($bytes), [Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).GetAwaiter().GetResult()
  while ($true) {
    $sb = New-Object System.Text.StringBuilder
    do {
      $buf = New-Object byte[] 262144
      $seg = [ArraySegment[byte]]::new($buf)
      $r = $ws.ReceiveAsync($seg, $ct).GetAwaiter().GetResult()
      [void]$sb.Append([Text.Encoding]::UTF8.GetString($buf, 0, $r.Count))
    } while (-not $r.EndOfMessage)
    $obj = $sb.ToString() | ConvertFrom-Json
    if ($obj.id -eq $script:id) {
      if ($obj.result.exceptionDetails) { return '__EXC__ ' + $obj.result.exceptionDetails.exception.description }
      return $obj.result.result.value
    }
  }
}
function T([string]$name, [string]$expr) {
  try { $v = Invoke-Eval $expr; Write-Output ('OK  | ' + $name + ' => ' + ($v | ConvertTo-Json -Compress -Depth 8)) }
  catch { Write-Output ('FAIL| ' + $name + ' => ' + $_.Exception.Message) }
}
Invoke-Eval "location.reload(); true" | Out-Null
Start-Sleep -Milliseconds 1800
T 'quiz-l-btns' '(()=>{
  [...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''settings'').click();
  [...document.querySelectorAll(''#set-font .chip'')].find(b=>b.dataset.v===''l'').click();
  [...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''practice'').click();
  [...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''l2cn'').click();
  document.querySelector(''#p-start'').click();
  const r={quit:getComputedStyle(document.querySelector(''#quiz-quit'')).fontSize, listen:getComputedStyle(document.querySelector(''.listen-btn'')).fontSize};
  document.querySelector(''#quiz-quit'').click();
  [...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''settings'').click();
  [...document.querySelectorAll(''#set-font .chip'')].find(b=>b.dataset.v===''m'').click();
  return r;
})()'
$ws.Dispose()
exit 0
