$ErrorActionPreference = 'Stop'
$page = @(Invoke-RestMethod 'http://127.0.0.1:9223/json' | Where-Object { $_.type -eq 'page' -and $_.url -like 'http*' })[0]
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$null = $ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
$script:id = 1000
function Invoke-Eval([string]$expr) {
  $script:id++
  $req = @{ id = $script:id; method = 'Runtime.evaluate'; params = @{ expression = $expr; returnByValue = $true } } | ConvertTo-Json -Compress -Depth 12
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
Start-Sleep -Milliseconds 1600

T 'init' "({ready:document.readyState, words:WORDS.length, dict:Object.keys(DICT).length, themes:TOPICS.length, wb:state.wordbook.length})"
T 'data-integrity' "(()=>{const bad=WORDS.filter(w=>!w.p||!w.pos||!w.d||!w.e.toLowerCase().includes(w.k.toLowerCase())||!w.s.length); const dup=WORDS.length-new Set(WORDS.map(w=>w.w)).size; return {badWords:bad.length, dups:dup, sample:WORDS[0].w+':'+WORDS[0].p};})()"
T 'learn-count' "(()=>{document.querySelector('#learn-list') ? 0 : 0; [...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='learn').click(); return {cards:document.querySelectorAll('#learn-list .word-card').length, hint:!!document.querySelector('.wc-detail-hint')};})()"
T 'card-click-modal' "(()=>{const card=document.querySelector('#learn-list .word-card'); const w=card.dataset.w; card.click(); return {open:!document.querySelector('#word-modal').classList.contains('hidden'), word:document.querySelector('#wm-word-head .wm-w').textContent, ipa:document.querySelector('#wm-word-head .wm-ipa')?.textContent, pos:document.querySelector('#wm-word-head .wm-pos')?.textContent, cn:document.querySelector('#wm-body .wm-cn')?.textContent, def:document.querySelector('#wm-body .wm-def')?.textContent.slice(0,30), syns:document.querySelectorAll('#wm-body .syn-chip').length, example:!!document.querySelector('#wm-body .wc-ex')};})()"
T 'modal-wb-add' "(()=>{const before=state.wordbook.length; document.querySelector('#wm-wb').click(); return {added:state.wordbook.length===before+1, btnText:document.querySelector('#wm-wb').textContent};})()"
T 'modal-syn-link' "(()=>{const chip=[...document.querySelectorAll('#wm-body .syn-chip.linkable')][0]; if(!chip) return {noLinkable:true}; const w1=document.querySelector('#wm-word-head .wm-w').textContent; chip.click(); const w2=document.querySelector('#wm-word-head .wm-w').textContent; return {switched:w1!==w2, from:w1, to:w2};})()"
T 'modal-close' "(()=>{document.querySelector('#wm-ok').click(); return {closed:document.querySelector('#word-modal').classList.contains('hidden')};})()"
T 'speak-btn-ok' "(()=>{document.querySelector('#learn-list .word-card').click(); const b=document.querySelector('#wm-word-head .wm-speak'); return {speakBtn:!!b, modalOpen:!document.querySelector('#word-modal').classList.contains('hidden')};})()"
T 'modal-esc-close' "(()=>{document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'})); return {closed:document.querySelector('#word-modal').classList.contains('hidden')};})()"

T 'flash-start' "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='flash').click(); document.querySelector('#flash-start').click(); return {gameHidden:document.querySelector('#flash-game').classList.contains('hidden'), pos:document.querySelector('#flash-pos').textContent, front:document.querySelector('#flash-front').textContent.trim().slice(0,15)};})()"
T 'flash-flip-detail' "(()=>{document.querySelector('#flash-card').click(); const d=document.querySelector('#flash-back .f-detail'); return {flipped:document.querySelector('#flash-card').classList.contains('flipped'), hasDetailBtn:!!d};})()"
T 'flash-detail-open' "(()=>{const w=document.querySelector('#flash-back .f-detail').dataset.fw; document.querySelector('#flash-back .f-detail').click(); return {open:!document.querySelector('#word-modal').classList.contains('hidden'), word:document.querySelector('#wm-word-head .wm-w').textContent, matches:w};})()"
T 'flash-detail-close' "(()=>{document.querySelector('#wm-close').click(); return {closed:document.querySelector('#word-modal').classList.contains('hidden')};})()"
T 'flash-no' "(()=>{document.querySelector('#flash-no').click(); return {unknown:flash.unknown, wb:state.wordbook.length};})()"
T 'flash-yes' "(()=>{document.querySelector('#flash-yes').click(); return {known:flash.known};})()"
T 'flash-back' "(()=>{document.querySelector('#flash-back').click(); return {gameHidden:document.querySelector('#flash-game').classList.contains('hidden')};})()"

T 'mcq-start' "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='practice').click(); document.querySelector('#p-start').click(); return {gameHidden:document.querySelector('#practice-game').classList.contains('hidden'), opts:document.querySelectorAll('#quiz-body .opt').length, type:prac.type};})()"
T 'mcq-correct' "(()=>{[...document.querySelectorAll('#quiz-body .opt')].find(b=>b.dataset.opt===prac.q.correct).click(); return {score:prac.score, fb:document.querySelector('#feedback').className, next:!document.querySelector('#next-row').classList.contains('hidden')};})()"
T 'mcq-next-wrong' "(()=>{document.querySelector('#next-btn').click(); [...document.querySelectorAll('#quiz-body .opt')].find(b=>b.dataset.opt!==prac.q.correct).click(); return {score:prac.score, fb:document.querySelector('#feedback').className, wb:state.wordbook.length, wrongs:prac.wrongs.length};})()"
T 'mcq-quit' "(()=>{document.querySelector('#quiz-quit').click(); return {setupShown:!document.querySelector('#practice-setup').classList.contains('hidden')};})()"

T 'wordbook-open-detail' "(()=>{[...document.querySelectorAll('.tab')].find(t=>t.dataset.view==='stats').click(); const item=document.querySelector('#wordbook-list .wb-item'); if(!item) return {noWbItems:true}; const w=item.querySelector('.wb-word').textContent.trim(); item.querySelector('.wb-word').click(); return {open:!document.querySelector('#word-modal').classList.contains('hidden'), word:document.querySelector('#wm-word-head .wm-w').textContent, matches:w};})()"
T 'wordbook-close' "(()=>{document.querySelector('#wm-ok').click(); return {closed:document.querySelector('#word-modal').classList.contains('hidden')};})()"
T 'export-fn' "(()=>{return {hasBtn:!!document.querySelector('#export-data'), hasImport:!!document.querySelector('#import-data'), isFn:typeof exportProgress==='function'&&typeof importProgress==='function'};})()"
T 'export-run' "(()=>{try{exportProgress(); return {noThrow:true, toast:document.querySelector('#toast').textContent};}catch(e){return {noThrow:false, err:String(e)};}})()"
T 'checkin-panel' "(()=>{return {panel:!!document.querySelector('#checkin-panel'), presets:document.querySelectorAll('#goal-presets [data-goal]').length, cal:!!document.querySelector('#cal-grid'), btn:!!document.querySelector('#checkin-btn')};})()"
T 'goal-preset' "(()=>{document.querySelectorAll('#goal-presets button')[1].click(); return {goal:state.goal, active:[...document.querySelectorAll('#goal-presets .btn')].filter(b=>b.classList.contains('active')).map(b=>b.dataset.goal)};})()"
T 'goal-custom' "(()=>{document.querySelector('#goal-input').value='45'; document.querySelector('#goal-save').click(); return {goal:state.goal, badge:document.querySelector('#streak-badge').textContent.includes('45')};})()"
T 'goal-clamp' "(()=>{document.querySelector('#goal-input').value='9999'; document.querySelector('#goal-save').click(); return {goal:state.goal, ok:state.goal===500};})()"
T 'checkin-click' "(()=>{const before=(state.checkins||[]).length; document.querySelector('#checkin-btn').click(); return {added:(state.checkins||[]).length===before+1, today:(state.checkins||[]).includes(todayStr()), disabled:document.querySelector('#checkin-btn').disabled};})()"
T 'checkin-streak' "(()=>{const y=new Date(Date.now()-864e5); const ys=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0'); const before=checkinStreak(); let grew=false; if(!(state.checkins||[]).includes(ys)){ state.checkins.push(ys); grew=true; } const after=checkinStreak(); if(grew) state.checkins=state.checkins.filter(d=>d!==ys); saveState(); return {before, after, grew:after>before};})()"
T 'calendar-marked' "(()=>{const marked=document.querySelectorAll('#cal-grid .cal-cell.checked').length; return {marked, todayMarked:!!document.querySelector('#cal-grid .cal-cell.today'), foot:document.querySelector('#cal-foot').textContent.length>0};})()"
T 'calendar-nav' "(()=>{const t1=document.querySelector('#cal-title').textContent; document.querySelector('#cal-prev').click(); const t2=document.querySelector('#cal-title').textContent; document.querySelector('#cal-next').click(); const t3=document.querySelector('#cal-title').textContent; return {back:t1===t3, cells:document.querySelectorAll('#cal-grid .cal-cell:not(.empty)').length};})()"
T 'reset-data' "(()=>{state=defaultState(); saveState(); renderHeaderStats(); renderStats(); return {wb:state.wordbook.length};})()"

T 'persist-reload' "(()=>{state.daily.count=7; state.streak=3; saveState(); location.reload(); return 'reloading';})()"
Start-Sleep -Milliseconds 1600
T 'persist-check' "({daily:state.daily.count, streak:state.streak, ok:state.daily.count===7&&state.streak===3})"
T 'checkin-persist' "(()=>{state.goal=60; state.checkins=[todayStr()]; saveState(); location.reload(); return 'saving';})()"
Start-Sleep -Milliseconds 1600
T 'checkin-persist-ok' "({goal:state.goal, checkins:state.checkins, ok:state.goal===60&&Array.isArray(state.checkins)&&state.checkins.length===1&&state.checkins[0]===todayStr(), badge:document.querySelector('#streak-badge').textContent.includes('60'), calChecked:document.querySelectorAll('#cal-grid .cal-cell.checked').length})"
T 'learn-chip-nav' "(()=>{const chip=document.querySelector('#learn-list .syn-chip.linkable'); if(!chip){return {noLinkable:true};} const w1=document.querySelector('#learn-list .word-card[data-w]').dataset.w; chip.click(); const open=!document.querySelector('#word-modal').classList.contains('hidden'); const w2=document.querySelector('#wm-word-head .wm-w')?.textContent; document.querySelector('#wm-ok')?.click(); return {open, from:w1, to:w2, switched:open&&w1!==w2};})()"
T 'final-errors' "({errs:window.__errs||[]})"

"==== E2E v2 RESULTS ($($results.Count) tests) ===="
$fail = 0
foreach ($r in $results) { $r; if ($r -like 'FAIL*') { $fail++ } }
"==== FAILS: $fail ===="
$ws.Dispose()
exit $fail