$page = (Invoke-RestMethod 'http://127.0.0.1:9223/json' | Where-Object { $_.type -eq 'page' } | Select-Object -First 1)
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult() | Out-Null
function RawEval([string]$expr) {
  $req = @{ id = 9002; method = 'Runtime.evaluate'; params = @{ expression = $expr; returnByValue = $true } } | ConvertTo-Json -Compress -Depth 10
  $bytes = [Text.Encoding]::UTF8.GetBytes($req)
  $null = $ws.SendAsync([ArraySegment[byte]]::new($bytes), [Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).GetAwaiter().GetResult()
  $sb = New-Object System.Text.StringBuilder
  do {
    $buf = New-Object byte[] 262144
    $seg = [ArraySegment[byte]]::new($buf)
    $r = $ws.ReceiveAsync($seg, $ct).GetAwaiter().GetResult()
    [void]$sb.Append([Text.Encoding]::UTF8.GetString($buf, 0, $r.Count))
  } while (-not $r.EndOfMessage)
  return $sb.ToString()
}
$out = [System.Collections.Generic.List[string]]::new()
$out.Add('--- e2e flash-start exact expr ---')
$out.Add((RawEval "(()=>{document.querySelector('.tab[data-view=\"flash\"]').click(); document.querySelector('#flash-start').click(); return {gameHidden:document.querySelector('#flash-game').classList.contains('hidden'), pos:document.querySelector('#flash-pos').textContent, front:document.querySelector('#flash-front').textContent.trim().slice(0,15)};})()"))
Start-Sleep -Milliseconds 300
$out.Add('--- e2e mcq-correct context ---')
$out.Add((RawEval "({gameHidden:document.querySelector('#practice-game').classList.contains('hidden'), opts:document.querySelectorAll('#quiz-body .opt').length, hasPrac: typeof prac!=='undefined' && prac!==null})"))
$ws.Dispose()
[System.IO.File]::WriteAllLines('debug2-out.txt', $out, (New-Object System.Text.UTF8Encoding($false)))
'debug2 done'