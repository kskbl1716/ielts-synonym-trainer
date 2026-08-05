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
function T([string]$name, [string]$expr) {
  try { $v = Invoke-Eval $expr; Write-Output ('OK  | ' + $name + ' => ' + ($v | ConvertTo-Json -Compress -Depth 8)) }
  catch { Write-Output ('FAIL| ' + $name + ' => ' + $_.Exception.Message) }
}
Invoke-Eval "localStorage.removeItem('ielts-syn-trainer-v1'); location.reload(); true" | Out-Null
Start-Sleep -Milliseconds 1800
T 'set-large' '(()=>{
  [...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''settings'').click();
  const chip=[...document.querySelectorAll(''#set-font .chip'')].find(b=>b.dataset.v===''l'');
  chip.click();
  return {active:chip.classList.contains(''on''), font:document.documentElement.dataset.font, saved:JSON.parse(localStorage.getItem(''ielts-syn-trainer-v1'')).settings.font};
})()'
T 'learn-large' '(()=>{
  [...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''learn'').click();
  const c=document.querySelector(''#learn-list .word-card .wc-word'');
  const ex=document.querySelector(''#learn-list .word-card .wc-ex'');
  return {body:getComputedStyle(document.body).fontSize, wcWord:getComputedStyle(c).fontSize, wcEx:getComputedStyle(ex).fontSize};
})()'
T 'modal-large' '(()=>{
  const card=[...document.querySelectorAll(''#learn-list .word-card'')][0];
  card.click();
  const m={w:getComputedStyle(document.querySelector(''#wm-word-head .wm-w'')).fontSize, ipa:getComputedStyle(document.querySelector(''#wm-word-head .wm-ipa'')).fontSize, cn:getComputedStyle(document.querySelector(''#wm-body .wm-cn'')).fontSize, def:getComputedStyle(document.querySelector(''#wm-body .wm-def'')).fontSize};
  document.querySelector(''#wm-ok'').click();
  return m;
})()'
T 'flash-large' '(()=>{
  [...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''flash'').click();
  document.querySelector(''#flash-start'').click();
  const f={word:getComputedStyle(document.querySelector(''#flash-word'')).fontSize, cn:getComputedStyle(document.querySelector(''#flash-cn'')).fontSize};
  document.querySelector(''#flash-quit'').click();
  return f;
})()'
T 'quiz-large' '(()=>{
  [...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''practice'').click();
  [...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''mcq'').click();
  document.querySelector(''#p-start'').click();
  const q={qWord:getComputedStyle(document.querySelector(''#quiz-body .q-word'')).fontSize, opt:getComputedStyle(document.querySelector(''#quiz-body .opt'')).fontSize, btn:getComputedStyle(document.querySelector(''#quiz-quit'')).fontSize};
  document.querySelector(''#quiz-quit'').click();
  return q;
})()'
T 'dict-large' '(()=>{
  [...document.querySelectorAll(''#p-types .type-card'')].find(c=>c.querySelector(''input'').value===''dict'').click();
  document.querySelector(''#p-start'').click();
  const d=getComputedStyle(document.querySelector(''#dict-input'')).fontSize;
  document.querySelector(''#quiz-quit'').click();
  return {input:d};
})()'
T 'persist-reload' '(()=>{ location.reload(); true; })()'
Start-Sleep -Milliseconds 1800
T 'after-reload' '(()=>{
  [...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''learn'').click();
  const c=document.querySelector(''#learn-list .word-card .wc-word'');
  return {font:document.documentElement.dataset.font, wcWord:getComputedStyle(c).fontSize, body:getComputedStyle(document.body).fontSize};
})()'
T 'back-to-medium' '(()=>{
  [...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''settings'').click();
  [...document.querySelectorAll(''#set-font .chip'')].find(b=>b.dataset.v===''m'').click();
  [...document.querySelectorAll(''.tab'')].find(t=>t.dataset.view===''learn'').click();
  const c=document.querySelector(''#learn-list .word-card .wc-word'');
  return {font:document.documentElement.dataset.font, wcWord:getComputedStyle(c).fontSize};
})()'
$ws.Dispose()
exit 0
