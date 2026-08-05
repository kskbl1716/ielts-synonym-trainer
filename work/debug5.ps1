$page = (Invoke-RestMethod 'http://127.0.0.1:9223/json' | Where-Object { $_.type -eq 'page' } | Select-Object -First 1)
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$null = $ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
function RawEval([string]$expr) {
  $req = @{ id = 9005; method = 'Runtime.evaluate'; params = @{ expression = $expr; returnByValue = $true } } | ConvertTo-Json -Compress -Depth 10
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
$out.Add('--- start mcq, answer q1 wrong ---')
$out.Add((RawEval "(()=>{pCount=2; [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='practice').click(); document.querySelector('#p-start').click(); [...document.querySelectorAll('#quiz-body .opt')].find(b=>b.dataset.opt!==prac.q.correct).click(); return {score:prac.score, wb:state.wordbook.length};})()"))
Start-Sleep -Milliseconds 200
$out.Add('--- q2 correct + finish ---')
$out.Add((RawEval "(()=>{document.querySelector('#next-btn').click(); [...document.querySelectorAll('#quiz-body .opt')].find(b=>b.dataset.opt===prac.q.correct).click(); document.querySelector('#next-btn').click(); return {score:prac.score, wrongs:prac.wrongs.length, resHidden:document.querySelector('#practice-result').classList.contains('hidden')};})()"))
Start-Sleep -Milliseconds 200
$out.Add('--- result page wrong items ---')
$out.Add((RawEval "(()=>{const items=[...document.querySelectorAll('#res-wrong .wrong-item')]; return {count:items.length, sample:items[0] ? items[0].textContent.trim().slice(0,60) : '', resTitle:document.querySelector('#res-title').textContent, resScore:document.querySelector('#res-score').textContent};})()"))
$ws.Dispose()
[System.IO.File]::WriteAllLines('debug5-out.txt', $out, (New-Object System.Text.UTF8Encoding($false)))
'debug5 done'