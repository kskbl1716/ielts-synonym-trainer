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
Start-Sleep -Milliseconds 1800
Invoke-Eval "window.__errs=[]; window.addEventListener('error',e=>window.__errs.push(String(e.message))); true" | Out-Null
T 'init' '({ready:document.readyState, words:WORDS.length, zl:WORDS.filter(w=>w.z===''l'').length, zw:WORDS.filter(w=>w.z===''w'').length, tabs:document.querySelectorAll(''.tab'').length, typeCards:document.querySelectorAll(''#p-types .type-card'').length, settings:JSON.stringify(state.settings)})'
T 'data-integrity' '(()=>{const bad=WORDS.filter(w=>!w.p||!w.pos||!w.d||!w.z||!w.s.length||!w.e.toLowerCase().includes(w.k.toLowerCase())); const dup=WORDS.length-new Set(WORDS.map(w=>w.w)).size; const badZone=WORDS.filter(w=>w.z!==''l''&&w.z!==''w'').length; return {badWords:bad.length, dups:dup, badZone};})()'
T 'learn-zones' '(()=>{[...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''learn'').click(); const chips=document.querySelectorAll(''#learn-zones .chip'').length; [...document.querySelectorAll(''#learn-zones .chip'')].find(b=>b.dataset.z===''w'').click(); const cards=[...document.querySelectorAll(''#learn-list .word-card'')]; const zw=WORDS.filter(w=>w.z===''w'').length; const allW=cards.every(c=>WORDS.find(w=>w.w===c.dataset.w).z===''w''); return {chips, cards:cards.length, zw, allW};})()'
T 'modal-ipa-fallback' '(()=>{const card=document.querySelector(''#learn-list .word-card''); const w=card.dataset.w; const entry=WORDS.find(x=>x.w===w); card.click(); const ipa=document.querySelector(''#wm-word-head .wm-ipa'')?.textContent; const pos=document.querySelector(''#wm-word-head .wm-pos'')?.textContent; const cn=document.querySelector(''#wm-body .wm-cn'')?.textContent; const def=document.querySelector(''#wm-body .wm-def'')?.textContent.slice(0,25); document.querySelector(''#wm-ok'').click(); return {w, ipa, pos, cn, def, ipaOk:ipa===entry.p, posOk:pos===entry.pos};})()'
T 'flash-zones' '(()=>{[...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''flash'').click(); const chips=document.querySelectorAll(''#flash-zones .chip'').length; [...document.querySelectorAll(''#flash-zones .chip'')].find(b=>b.dataset.z===''w'').click(); document.querySelector(''#flash-start'').click(); const allW=flash.list.every(e=>e.z===''w''); return {chips, gameOn:!document.querySelector(''#flash-game'').classList.contains(''hidden''), allW, count:flash.list.length};})()'
T 'practice-dict-start' '(()=>{[...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''practice'').click(); [...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''dict'').click(); document.querySelector(''#p-start'').click(); return {type:prac.type, hasInput:!!document.querySelector(''#dict-input''), opts:document.querySelectorAll(''#quiz-body .opt'').length};})()'
T 'dict-wrong' '(()=>{const before=state.wordbook.length; document.querySelector(''#dict-input'').value=''zzzz''; document.querySelector(''#dict-check'').click(); return {score:prac.score, fb:document.querySelector(''#feedback'').className, wb:state.wordbook.length===before+1, next:!document.querySelector(''#next-row'').classList.contains(''hidden'')};})()'
T 'dict-correct' '(()=>{document.querySelector(''#next-btn'').click(); const w=prac.q.w.toLowerCase().replace(/[^a-z''-]/g,''''); document.querySelector(''#dict-input'').value=w; document.querySelector(''#dict-check'').click(); return {word:prac.q.w, score:prac.score, fb:document.querySelector(''#feedback'').className};})()'
T 'dict-quit' '(()=>{document.querySelector(''#quiz-quit'').click(); return {setupShown:!document.querySelector(''#practice-setup'').classList.contains(''hidden'')};})()'
T 'practice-word2cn' '(()=>{[...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''word2cn'').click(); document.querySelector(''#p-start'').click(); const opts=document.querySelectorAll(''#quiz-body .opt'').length; const shown=document.querySelector(''#quiz-body .q-word'').textContent.trim(); [...document.querySelectorAll(''#quiz-body .opt'')].find(b=>b.dataset.opt===prac.q.correct).click(); const r={type:prac.type, opts, shown, score:prac.score, fb:document.querySelector(''#feedback'').className, answer:prac.q.correct}; document.querySelector(''#quiz-quit'').click(); return r;})()'
T 'practice-l2cn' '(()=>{[...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''l2cn'').click(); document.querySelector(''#p-start'').click(); const opts=document.querySelectorAll(''#quiz-body .opt'').length; const playBtn=!!document.querySelector(''#play-btn''); [...document.querySelectorAll(''#quiz-body .opt'')].find(b=>b.dataset.opt===prac.q.correct).click(); const r={type:prac.type, opts, playBtn, score:prac.score, fb:document.querySelector(''#feedback'').className}; document.querySelector(''#quiz-quit'').click(); return r;})()'
T 'settings-panels' '(()=>{[...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''settings'').click(); const panels=document.querySelectorAll(''#view-settings .panel'').length; const about=document.querySelector(''#set-about'').textContent; return {panels, aboutHasCount:about.includes(String(WORDS.length))};})()'
T 'settings-goal' '(()=>{document.querySelector(''#set-goal-presets [data-goal="20"]'').click(); const g1=state.goal; document.querySelector(''#set-goal-input'').value=''45''; document.querySelector(''#set-goal-save'').click(); return {preset:g1, custom:state.goal, badge:document.querySelector(''#streak-badge'').textContent.includes(''45'')};})()'
T 'settings-appearance' '(()=>{document.querySelector(''#set-theme [data-v="dark"]'').click(); const dark=document.documentElement.dataset.theme===''dark''; document.querySelector(''#set-theme [data-v="light"]'').click(); const light=document.documentElement.dataset.theme===''light''; document.querySelector(''#set-font [data-v="l"]'').click(); const font=document.documentElement.dataset.font; document.querySelector(''#set-rate [data-v="1.0"]'').click(); const rate=state.settings.rate; document.querySelector(''#set-voice [data-v="us"]'').click(); const voice=state.settings.voice; return {dark, light, font, rate, voice};})()'
T 'settings-prefs' '(()=>{document.querySelector(''#set-pcount [data-v="15"]'').click(); const pc=state.settings.pCount; document.querySelector(''#set-pdir [data-v="reverse"]'').click(); const pd=state.settings.pDir; [...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''practice'').click(); const onCount=[...document.querySelectorAll(''#p-counts .chip'')].find(b=>b.classList.contains(''on'')).dataset.n; const onDir=[...document.querySelectorAll(''#p-dirs .chip'')].find(b=>b.classList.contains(''on'')).dataset.dir; return {pc, pd, onCount, onDir, ok:pc===15&&pd===''reverse''&&onCount===''15''&&onDir===''reverse''};})()'
T 'settings-data-btns' '(()=>({exportBtn:!!document.querySelector(''#set-export''), importBtn:!!document.querySelector(''#set-import-btn''), resetBtn:!!document.querySelector(''#set-reset'')}))()'
T 'settings-export-run' '(()=>{try{exportProgress(); return {noThrow:true};}catch(e){return {noThrow:false, err:String(e)};}})()'
T 'settings-import-fn' '(()=>typeof importProgress===''function'')()'
T 'checkin-from-settings-goal' '(()=>{[...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''stats'').click(); const badge=document.querySelector(''#streak-badge'').textContent; const before=(state.checkins||[]).length; const btn=document.querySelector(''#checkin-btn''); if(btn && !btn.disabled) btn.click(); return {badge, added:(state.checkins||[]).length===before+1, calChecked:document.querySelectorAll(''#cal-grid .cal-cell.checked'').length};})()'
T 'persist-reload' '(()=>{saveState(); location.reload(); return ''reloading'';})()'
T 'persist-settings' '(()=>{const s=state.settings||{}; return {goal:state.goal, voice:s.voice, rate:s.rate, pCount:s.pCount, pDir:s.pDir, theme:document.documentElement.dataset.theme, font:document.documentElement.dataset.font, badge:document.querySelector(''#streak-badge'').textContent};})()'
T 'final-errors' '({errs:window.__errs||[]})'

"==== E2E v4 RESULTS ($($results.Count) tests) ===="
$fail = 0
foreach ($r in $results) { $r; if ($r -like 'FAIL*') { $fail++ } }
"==== FAILS: $fail ===="
$ws.Dispose()
exit $fail
