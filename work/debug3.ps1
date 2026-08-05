$page = (Invoke-RestMethod 'http://127.0.0.1:9223/json' | Where-Object { $_.type -eq 'page' } | Select-Object -First 1)
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$null = $ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
function RawEval([string]$expr) {
  $req = @{ id = 9003; method = 'Runtime.evaluate'; params = @{ expression = $expr; returnByValue = $true } } | ConvertTo-Json -Compress -Depth 10
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
$out.Add('--- start mcq ---')
$out.Add((RawEval "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='practice').click(); document.querySelector('#p-start').click(); return {opts:document.querySelectorAll('#quiz-body .opt').length, correct:prac.q.correct, fbCount:document.querySelectorAll('#feedback').length, nrCount:document.querySelectorAll('#next-row').length};})()"))
Start-Sleep -Milliseconds 200
$out.Add('--- click correct + dump ---')
$out.Add((RawEval "(()=>{[...document.querySelectorAll('#quiz-body .opt')].find(b=>b.dataset.opt===prac.q.correct).click(); const fb=document.querySelector('#feedback'); const nr=document.querySelector('#next-row'); return {score:prac.score, fbClass:fb.className, fbHtml:fb.innerHTML.slice(0,60), nrHidden:nr.classList.contains('hidden'), fbCount:document.querySelectorAll('#feedback').length, fbParent:fb.parentElement.className};})()"))
Start-Sleep -Milliseconds 200
$out.Add('--- click next + click wrong ---')
$out.Add((RawEval "(()=>{document.querySelector('#next-btn').click(); [...document.querySelectorAll('#quiz-body .opt')].find(b=>b.dataset.opt!==prac.q.correct).click(); const fb=document.querySelector('#feedback'); return {score:prac.score, fbClass:fb.className, wrongs:prac.wrongs.length, wb:state.wordbook.length};})()"))
$ws.Dispose()
[System.IO.File]::WriteAllLines('debug3-out.txt', $out, (New-Object System.Text.UTF8Encoding($false)))
'debug3 done'