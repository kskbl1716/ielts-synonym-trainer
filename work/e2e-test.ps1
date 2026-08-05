$ErrorActionPreference = 'Stop'
$page = (Invoke-RestMethod 'http://127.0.0.1:9223/json' | Where-Object { $_.type -eq 'page' } | Select-Object -First 1)
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$null = $ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()

$script:id = 1000
function Invoke-Eval([string]$expr) {
  $script:id++
  $req = @{ id = $script:id; method = 'Runtime.evaluate'; params = @{ expression = $expr; returnByValue = $true } } | ConvertTo-Json -Compress -Depth 10
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
$results = [System.Collections.Generic.List[string]]::new()
function T([string]$name, [string]$expr) {
  try { $v = Invoke-Eval $expr; $results.Add("OK  | $name => " + ($v | ConvertTo-Json -Compress -Depth 6)) }
  catch { $results.Add("FAIL| $name => " + $_.Exception.Message) }
}

Invoke-Eval "localStorage.removeItem('ielts-syn-trainer-v1'); location.reload(); true" | Out-Null
Start-Sleep -Milliseconds 1500

T 'init' "({ready:document.readyState, words:WORDS.length, active:document.querySelector('.tab.active').dataset.view, wb:state.wordbook.length, daily:state.daily.count})"
T 'learn-list-count' "({items:document.querySelectorAll('#learn-list>*').length})"
T 'learn-search' "(()=>{const i=document.querySelector('#learn-search'); i.value='environment'; i.dispatchEvent(new Event('input')); const n=document.querySelectorAll('#learn-list>*').length; const t=document.querySelector('#learn-list>*')?.textContent.trim().slice(0,24); i.value=''; i.dispatchEvent(new Event('input')); return {filtered:n, sample:t, restored:document.querySelectorAll('#learn-list>*').length};})()"

T 'flash-start' "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='flash').click(); document.querySelector('#flash-start').click(); return {gameHidden:document.querySelector('#flash-game').classList.contains('hidden'), pos:document.querySelector('#flash-pos').textContent, front:document.querySelector('#flash-front').textContent.trim().slice(0,15)};})()"
T 'flash-flip' "(()=>{document.querySelector('#flash-card').click(); return {flipped:document.querySelector('#flash-card').classList.contains('flipped'), backText:document.querySelector('#flash-back').textContent.trim().slice(0,15)};})()"
T 'flash-no' "(()=>{document.querySelector('#flash-no').click(); return {unknown:flash.unknown, wb:state.wordbook.length, count:document.querySelector('#flash-count').textContent};})()"
T 'flash-yes' "(()=>{document.querySelector('#flash-yes').click(); return {known:flash.known, wb:state.wordbook.length};})()"

T 'mcq-start' "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='practice').click(); document.querySelector('#p-start').click(); return {gameHidden:document.querySelector('#practice-game').classList.contains('hidden'), opts:document.querySelectorAll('#quiz-body .opt').length, type:prac.type};})()"
T 'mcq-correct' "(()=>{[...document.querySelectorAll('#quiz-body .opt')].find(b=>b.dataset.opt===prac.q.correct).click(); return {score:prac.score, fb:document.querySelector('#feedback').className, next:!document.querySelector('#next-row').classList.contains('hidden')};})()"
T 'mcq-next-wrong' "(()=>{document.querySelector('#next-btn').click(); [...document.querySelectorAll('#quiz-body .opt')].find(b=>b.dataset.opt!==prac.q.correct).click(); return {score:prac.score, wb:state.wordbook.length, fb:document.querySelector('#feedback').className, wrongs:prac.wrongs.length};})()"

T 'listen-start' "(()=>{document.querySelector('#quiz-quit').click(); [...document.querySelectorAll('#p-types input')].find(i=>i.value==='listen').closest('.type-card').click(); document.querySelector('#p-start').click(); return {type:prac.type, play:!!document.querySelector('#play-btn'), opts:document.querySelectorAll('#quiz-body .opt').length};})()"
T 'listen-answer' "(()=>{[...document.querySelectorAll('#quiz-body .opt')].find(b=>b.dataset.opt===prac.q.correct).click(); return {score:prac.score, fb:document.querySelector('#feedback').className};})()"

T 'match-start' "(()=>{document.querySelector('#quiz-quit').click(); [...document.querySelectorAll('#p-types input')].find(i=>i.value==='match').closest('.type-card').click(); document.querySelector('#p-start').click(); return {type:prac.type, left:document.querySelectorAll('#quiz-body .m-card[data-side=l]').length, right:document.querySelectorAll('#quiz-body .m-card[data-side=r]').length, prog:document.querySelector('#m-progress').textContent};})()"
T 'match-solve' "(()=>{for(let i=0;i<6;i++){const l=[...document.querySelectorAll('#quiz-body .m-card[data-side=l]')].find(b=>!b.classList.contains('done')); if(!l) break; l.click(); const r=[...document.querySelectorAll('#quiz-body .m-card[data-side=r]')].find(b=>b.dataset.key===l.dataset.w && !b.classList.contains('done')); r.click();} return {matched:match.matched, moves:match.moves, prog:document.querySelector('#m-progress').textContent, next:!document.querySelector('#next-row').classList.contains('hidden')};})()"
T 'match-finish' "(()=>{document.querySelector('#next-btn').click(); return {score:prac.score, resultHidden:document.querySelector('#practice-result').classList.contains('hidden'), resScore:document.querySelector('#res-score').textContent, wb:state.wordbook.length};})()"

T 'persist-reload' "(()=>{const s=JSON.stringify({wb:state.wordbook.length, daily:state.daily.count, streak:state.streak}); localStorage.setItem('__e2e_snapshot', s); location.reload(); return 'reloading';})()"
Start-Sleep -Milliseconds 1500
T 'persist-check' "(()=>{const s=JSON.parse(localStorage.getItem('__e2e_snapshot')); const wb=state.wordbook.length, daily=state.daily.count, streak=state.streak; return {saved:s, loaded:{wb,daily,streak}, match:s.wb===wb && s.daily===daily && s.streak===streak};})()"

T 'stats-view' "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='stats').click(); return {cards:[...document.querySelectorAll('#stat-cards .stat-card .num')].map(x=>x.textContent).join(' | '), wbItems:document.querySelectorAll('#wordbook-list .wb-item').length, streakBadge:document.querySelector('#streak-badge').textContent};})()"
T 'wordbook-remove' "(()=>{document.querySelector('#wordbook-list .rm-btn').click(); return {wb:state.wordbook.length, items:document.querySelectorAll('#wordbook-list .wb-item').length};})()"
T 'reset-all' "(()=>{window.confirm=()=>true; document.querySelector('#reset-all').click(); return {wb:state.wordbook.length, daily:state.daily.count, streak:state.streak, items:document.querySelectorAll('#wordbook-list .wb-item').length};})()"
T 'final' "({active:document.querySelector('.tab.active').dataset.view, today:state.daily.count})"

$ws.Dispose()
$results | ForEach-Object { Write-Output $_ }
$fail = ($results | Where-Object { $_ -like 'FAIL*' }).Count
$bad = ($results | Where-Object { $_ -like '*__EXC__*' }).Count
Write-Output ("---- " + ($results.Count - $fail - $bad) + " passed / " + $fail + " failed / " + $bad + " exceptions ----")