$ErrorActionPreference = 'Stop'
$list = (Invoke-WebRequest 'http://127.0.0.1:9223/json' -UseBasicParsing).Content | ConvertFrom-Json
$page = $list | Where-Object { $_.type -eq 'page' -and $_.url -like 'http://localhost:8000/*' } | Select-Object -First 1
if (-not $page) {
  $null = Invoke-RestMethod -Method Put "http://127.0.0.1:9223/json/new?http://localhost:8000/"
  Start-Sleep -Milliseconds 1500
  $list = (Invoke-WebRequest 'http://127.0.0.1:9223/json' -UseBasicParsing).Content | ConvertFrom-Json
  $page = $list | Where-Object { $_.type -eq 'page' -and $_.url -like 'http://localhost:8000/*' } | Select-Object -First 1
}
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
$results = [System.Collections.Generic.List[string]]::new()
function T([string]$name, [string]$expr) {
  try { $v = Invoke-Eval $expr; $results.Add("OK  | $name => " + ($v | ConvertTo-Json -Compress -Depth 8)) }
  catch { $results.Add("FAIL| $name => " + $_.Exception.Message) }
}
Invoke-Eval "localStorage.removeItem('ielts-syn-trainer-v1'); location.reload(); true" | Out-Null
Start-Sleep -Milliseconds 1800
Invoke-Eval "window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message))); true" | Out-Null
T 'init-v5' '({ready:document.readyState, words:WORDS.length, zl:WORDS.filter(w=>w.z===''l'').length, zw:WORDS.filter(w=>w.z===''w'').length, newTopics:[''food'',''technology'',''media'',''science'',''money''].every(t=>WORDS.some(w=>w.t===t))})'
T 'data-integrity-v5' '(()=>{const bad=WORDS.filter(w=>!w.p||!w.pos||!w.d||!w.z||!w.s.length||!w.e.toLowerCase().includes(w.k.toLowerCase())); const dup=WORDS.length-new Set(WORDS.map(w=>w.w)).size; const badZone=WORDS.filter(w=>w.z!==''l''&&w.z!==''w'').length; return {badWords:bad.length, dups:dup, badZone};})()'
T 'learn-search-new-word' '(()=>{[...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''learn'').click(); const inp=document.querySelector(''#learn-search''); if(inp){inp.value=''surge''; inp.dispatchEvent(new Event(''input''));} const card=[...document.querySelectorAll(''#learn-list .word-card'')].find(c=>c.dataset.w===''surge''); card.click(); const ipa=document.querySelector(''#wm-word-head .wm-ipa'')?.textContent; const cn=document.querySelector(''#wm-body .wm-cn'')?.textContent; const def=document.querySelector(''#wm-body .wm-def'')?.textContent.slice(0,20); const syn=document.querySelectorAll(''#wm-body .wm-syns .syn-chip'').length; document.querySelector(''#wm-ok'').click(); return {found:!!card, ipa, cn, def, syn};})()'
T 'dict-multiword-norm' '(()=>{[...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''practice'').click(); [...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''dict'').click(); document.querySelector(''#p-start'').click(); prac.q={type:''dict'',w:''air conditioning'',cn:''空调'',e:''The air conditioning is broken.'',k:''air conditioning'',correct:''air conditioning''}; const inp=document.querySelector(''#dict-input''); inp.value=''airconditioning''; checkDict(); const r1={score:prac.score, ok:document.querySelector(''#feedback'').classList.contains(''ok'')}; document.querySelector(''#next-btn'').click(); const q2=prac.queue[prac.idx]; prac.q={type:''dict'',w:q2.w,cn:q2.c,e:q2.e,k:q2.k,correct:q2.w}; const inp2=document.querySelector(''#dict-input''); inp2.value=q2.w; checkDict(); const r2={score:prac.score, ok:document.querySelector(''#feedback'').classList.contains(''ok'')}; document.querySelector(''#quiz-quit'').click(); return {r1, r2};})()'
T 'font-l-visible' '(()=>{const setFont=v=>[...document.querySelectorAll(''#set-font .chip'')].find(b=>b.dataset.v===v).click(); [...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''settings'').click(); setFont(''l''); [...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''learn'').click(); const fs=getComputedStyle(document.querySelector(''#learn-list .word-card .wc-word'')).fontSize; setFont(''m''); return {font:document.documentElement.dataset.font, wcWordL:fs};})()'
T 'practice-writing-zone' '(()=>{[...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''practice'').click(); [...document.querySelectorAll(''#p-zones .chip'')].find(b=>b.dataset.z===''w'').click(); const allW=practicePool().every(w=>w.z===''w''); const n=practicePool().length; [...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''word2cn'').click(); document.querySelector(''#p-start'').click(); const q=prac.queue[prac.idx]; [...document.querySelectorAll(''#quiz-body .opt'')].find(b=>b.dataset.opt===q.c).click(); const r={type:prac.type, zone:n, allW, score:prac.score, fb:document.querySelector(''#feedback'').className}; document.querySelector(''#quiz-quit'').click(); return r;})()'
T 'flash-writing-zone' '(()=>{[...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''flash'').click(); [...document.querySelectorAll(''#flash-zones .chip'')].find(b=>b.dataset.z===''w'').click(); document.querySelector(''#flash-start'').click(); return {gameOn:!document.querySelector(''#flash-game'').classList.contains(''hidden''), count:flash.list.length, allW:flash.list.every(e=>e.z===''w'')};})()'
T 'final-errors-v5' '({errs:window.__errs||[]})'
"==== E2E v5 RESULTS ($($results.Count) tests) ===="
$fail = 0
foreach ($r in $results) { $r; if ($r -like 'FAIL*') { $fail++ } }
"==== FAILS: $fail ===="
$ws.Dispose()
exit $fail