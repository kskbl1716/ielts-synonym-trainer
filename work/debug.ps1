$page = (Invoke-RestMethod 'http://127.0.0.1:9223/json' | Where-Object { $_.type -eq 'page' } | Select-Object -First 1)
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult() | Out-Null
function RawEval([string]$expr) {
  $req = @{ id = 9001; method = 'Runtime.evaluate'; params = @{ expression = $expr; returnByValue = $true } } | ConvertTo-Json -Compress -Depth 10
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
$out.Add('--- flash-start raw ---')
$out.Add((RawEval "document.querySelector('.tab[data-view=`"flash`"]').click(); document.querySelector('#flash-start').click(); ({a:1})"))
Start-Sleep -Milliseconds 300
$out.Add('--- flash state ---')
$out.Add((RawEval "({gameHidden:document.querySelector('#flash-game').classList.contains('hidden'), listLen:flash.list.length, idx:flash.idx})"))
$out.Add('--- mcq-start raw ---')
$out.Add((RawEval "document.querySelector('.tab[data-view=`"practice`"]').click(); document.querySelector('#p-start').click(); ({b:2})"))
Start-Sleep -Milliseconds 300
$out.Add('--- practice state ---')
$out.Add((RawEval "({gameHidden:document.querySelector('#practice-game').classList.contains('hidden'), prac: prac ? {type:prac.type, idx:prac.idx, len:prac.queue.length} : null, opts:document.querySelectorAll('#quiz-body .opt').length})"))
$ws.Dispose()
[System.IO.File]::WriteAllLines('debug-out.txt', $out, (New-Object System.Text.UTF8Encoding($false)))
'debug done'