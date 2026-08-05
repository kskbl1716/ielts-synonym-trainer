$page = (Invoke-RestMethod 'http://127.0.0.1:9223/json' | Where-Object { $_.type -eq 'page' } | Select-Object -First 1)
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$null = $ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
function RawEval([string]$expr) {
  $req = @{ id = 9004; method = 'Runtime.evaluate'; params = @{ expression = $expr; returnByValue = $true } } | ConvertTo-Json -Compress -Depth 10
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
$out.Add('--- quit + fresh mcq ---')
$out.Add((RawEval "(()=>{document.querySelector('#quiz-quit').click(); document.querySelector('#p-start').click(); return {q:prac.q};})()"))
Start-Sleep -Milliseconds 200
$out.Add('--- answer with try/catch ---')
$out.Add((RawEval "(()=>{const btn=[...document.querySelectorAll('#quiz-body .opt')].find(b=>b.dataset.opt===prac.q.correct); try{ answer(btn); return {threw:false, score:prac.score, fbClass:document.querySelector('#feedback').className}; }catch(e){ return {threw:true, msg:String(e.message), stack:String(e.stack).slice(0,300)}; }})()"))
$out.Add('--- highlight direct test ---')
$out.Add((RawEval "(()=>{const q=prac.q; try{ const h=highlight(q.e, q.k); return {ok:true, h:h.slice(0,80)}; }catch(e){ return {ok:false, msg:String(e.message), stack:String(e.stack).slice(0,300)}; }})()"))
$ws.Dispose()
[System.IO.File]::WriteAllLines('debug4-out.txt', $out, (New-Object System.Text.UTF8Encoding($false)))
'debug4 done'