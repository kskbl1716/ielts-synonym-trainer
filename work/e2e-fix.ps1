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
T 'dict-wrong-fixed' '(()=>{[...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''practice'').click(); [...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''dict'').click(); document.querySelector(''#p-start'').click(); const w=prac.queue[prac.idx].w; const inp=document.querySelector(''#dict-input''); inp.value=w+''zzz''; document.querySelector(''#dict-check'').click(); const r={score:prac.score, fb:document.querySelector(''#feedback'').className, next:!document.querySelector(''#next-row'').classList.contains(''hidden''), wrongs:prac.wrongs.length, wrongC:prac.wrongs[0]?.c}; document.querySelector(''#quiz-quit'').click(); return r;})()'
T 'dict-multiword-norm' '(()=>{[...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''dict'').click(); document.querySelector(''#p-start'').click(); prac.q={type:''dict'',w:''air conditioning'',c:''空调'',e:''The air conditioning is broken.'',k:''air conditioning'',correct:''air conditioning''}; const inp=document.querySelector(''#dict-input''); inp.value=''airconditioning''; checkDict(); const r1={score:prac.score, ok:document.querySelector(''#feedback'').classList.contains(''ok'')}; document.querySelector(''#next-btn'').click(); const q2=prac.queue[prac.idx]; prac.q={type:''dict'',w:q2.w,c:q2.c,e:q2.e,k:q2.k,correct:q2.w}; const inp2=document.querySelector(''#dict-input''); inp2.disabled=false; inp2.value=''car park''.replace(''car park'',q2.w); document.querySelector(''#dict-check'').disabled=false; checkDict(); const r2={score:prac.score, ok:document.querySelector(''#feedback'').classList.contains(''ok'')}; document.querySelector(''#quiz-quit'').click(); return {r1, r2};})()'
T 'mcq-correct-feedback' '(()=>{[...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''mcq'').click(); document.querySelector(''#p-start'').click(); const q=prac.q; [...document.querySelectorAll(''#quiz-body .opt'')].find(b=>b.dataset.opt===q.correct).click(); const r={fb:document.querySelector(''#feedback'').className, hasCn:q.cn?document.querySelector(''#feedback'').textContent.includes(q.cn.slice(0,2)):false, next:!document.querySelector(''#next-row'').classList.contains(''hidden'')}; document.querySelector(''#quiz-quit'').click(); return r;})()'
T 'mcq-wrong-review' '(()=>{[...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''mcq'').click(); document.querySelector(''#p-start'').click(); const q=prac.q; const wrongOpt=[...document.querySelectorAll(''#quiz-body .opt'')].find(b=>b.dataset.opt!==q.correct); wrongOpt.click(); const w0=prac.wrongs[0]; const wrongC=w0?w0.c:null; const wrongN=prac.wrongs.length; endPractice(); const wrong=document.querySelector(''#res-wrong''); const reviewShown=!!wrong; const reviewHasCn=wrong?(wrong.textContent.includes(wrongC||''zzz'')):false; const reviewTxt=wrong?wrong.textContent.slice(0,40):null; quitPractice(); return {wrongs:wrongN, wrongC, reviewShown, reviewHasCn, reviewTxt};})()'
T 'listen-correct-feedback' '(()=>{[...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''listen'').click(); document.querySelector(''#p-start'').click(); const q=prac.q; [...document.querySelectorAll(''#quiz-body .opt'')].find(b=>b.dataset.opt===q.correct).click(); const r={fb:document.querySelector(''#feedback'').className, next:!document.querySelector(''#next-row'').classList.contains(''hidden'')}; document.querySelector(''#quiz-quit'').click(); return r;})()'
T 'w2c-wrong-review' '(()=>{[...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''word2cn'').click(); document.querySelector(''#p-start'').click(); const q=prac.q; const wrongOpt=[...document.querySelectorAll(''#quiz-body .opt'')].find(b=>b.dataset.opt!==q.correct); wrongOpt.click(); document.querySelector(''#next-btn'').click(); const wrong=prac.wrongs[0]; const r={wrongs:prac.wrongs.length, wrongC:wrong?wrong.c:null, wrongW:wrong?wrong.w:null}; document.querySelector(''#quiz-quit'').click(); return r;})()'
T 'final-errors-fixed' '({errs:window.__errs||[]})'
"==== E2E FIX RESULTS ($($results.Count) tests) ===="
$fail = 0
foreach ($r in $results) { $r; if ($r -like 'FAIL*') { $fail++ } }
"==== FAILS: $fail ===="
$ws.Dispose()
exit $fail