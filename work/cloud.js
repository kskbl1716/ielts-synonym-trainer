/* ================= v6: 邮箱登录 + 云同步 (Supabase) ================= */
(function(){
  'use strict';

  /* 👉 部署前配置：把下面两个空字符串替换成你的 Supabase 项目信息（见 DEPLOY.md 部署指南） */
  var SUPABASE_URL = 'https://xetfvqissmpcznxtnpnx.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldGZ2cWlzc21wY3pueHRucG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4OTAxOTAsImV4cCI6MjEwMTQ2NjE5MH0.cA4nhBYuGm-apF_GU1kEsvYivpenh_7ws93lvSr7YGU';

  var CFG = (window.__SUPA_CONFIG__ && window.__SUPA_CONFIG__.url && window.__SUPA_CONFIG__.anon)
    ? window.__SUPA_CONFIG__
    : { url: SUPABASE_URL, anon: SUPABASE_ANON_KEY };
  var TABLE = 'user_data';
  var client = null;
  var sessionUser = null;
  var pushTimer = null;
  var loadingCloud = false;
  var lastPushErrAt = 0;
  var offlineShown = false;

  function cloudReady(){ return !!(CFG.url && CFG.anon && window.supabase && window.supabase.createClient); }
  function getClient(){
    if(!client && cloudReady()){
      try{ client = window.supabase.createClient(CFG.url, CFG.anon, { auth: { persistSession: true, autoRefreshToken: true } }); }
      catch(e){ console.error('[cloud] createClient error', e); }
    }
    return client;
  }
  function esc(s){ return (typeof escapeHtml === 'function') ? escapeHtml(s) : String(s); }

  /* ---------- 顶部登录入口 ---------- */
  function ensureTopbarUI(){
    var inner = document.querySelector('.topbar-inner');
    if(!inner || document.getElementById('cloud-area')) return;
    var div = document.createElement('div');
    div.id = 'cloud-area';
    div.className = 'cloud-area';
    div.innerHTML = '<button class="login-btn" id="login-btn" type="button">👤 登录 / 注册</button>' +
      '<div class="user-badge hidden" id="user-badge"><span class="ub-mail" id="user-email"></span><button class="ub-logout" id="logout-btn" type="button">退出</button></div>';
    inner.appendChild(div);
    var lb = document.getElementById('login-btn');
    var ob = document.getElementById('logout-btn');
    if(lb) lb.addEventListener('click', openLoginModal);
    if(ob) ob.addEventListener('click', doLogout);
  }
  function renderAuthUI(){
    var lb = document.getElementById('login-btn');
    var ub = document.getElementById('user-badge');
    if(!lb && !ub) return;
    if(!cloudReady()){
      if(lb){
        lb.style.display = '';
        if(ub) ub.classList.add('hidden');
        lb.textContent = CFG.url ? (offlineShown ? '☁️ 离线' : '☁️ 连接中…') : '☁️ 未配置';
        lb.dataset.off = CFG.url ? '' : '1';
      }
      return;
    }
    if(sessionUser){
      if(lb) lb.style.display = 'none';
      if(ub) ub.classList.remove('hidden');
      var em = document.getElementById('user-email');
      if(em) em.textContent = '👤 ' + (sessionUser.email || sessionUser.id || '');
    } else {
      if(lb){ lb.style.display = ''; lb.textContent = '👤 登录 / 注册'; lb.dataset.off = ''; }
      if(ub) ub.classList.add('hidden');
    }
  }

  /* ---------- 设置页账号卡片 ---------- */
  function ensureCloudCard(){
    var v = document.getElementById('view-settings');
    if(!v || document.getElementById('cloud-card')) return;
    var card = document.createElement('div');
    card.id = 'cloud-card';
    card.className = 'panel cloud-card';
    v.insertBefore(card, v.firstChild);
  }
  function renderCloudCard(){
    var card = document.getElementById('cloud-card');
    if(!card) return;
    if(!CFG.url){
      card.innerHTML = '<div class="cc-row"><span>☁️ 云同步：<b>未配置</b></span></div><div class="cc-sub">在代码中填入 Supabase 项目地址与 Key 并重新构建部署后，即可启用邮箱登录与云端备份（见部署指南）。</div>';
      return;
    }
    if(sessionUser){
      card.innerHTML = '<div class="cc-row"><span>☁️ 已登录：<b>' + esc(sessionUser.email || sessionUser.id) + '</b></span><button class="btn btn-ghost btn-sm" id="cc-logout" type="button">退出登录</button></div><div class="cc-sub">学习进度与设置会自动云端同步，换设备 / 清缓存不丢失。</div>';
    } else {
      card.innerHTML = '<div class="cc-row"><span>☁️ 未登录（数据仅存本机）</span><button class="btn btn-primary btn-sm" id="cc-login" type="button">登录 / 注册</button></div><div class="cc-sub">登录后进度自动云端备份，换设备不丢失。</div>';
    }
    var l = document.getElementById('cc-login'); if(l) l.addEventListener('click', openLoginModal);
    var o = document.getElementById('cc-logout'); if(o) o.addEventListener('click', doLogout);
  }

  /* ---------- 登录弹窗 ---------- */
  var authMode = 'login';
  function openLoginModal(){
    if(!cloudReady()){
      if(!CFG.url) toast('☁️ 云同步未配置：请先填入 Supabase 配置（见部署指南）');
      else if(offlineShown) toast('☁️ 云同步服务不可用：当前网络无法加载服务，请联网后刷新');
      else toast('☁️ 云同步服务加载中，请稍候…');
      return;
    }
    var m = document.getElementById('login-modal');
    if(!m) return;
    m.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setAuthMode('login');
    var msg = document.getElementById('lm-msg'); if(msg){ msg.textContent = ''; msg.className = 'auth-msg'; }
    var em = document.getElementById('lm-email'); if(em) em.focus();
  }
  function closeLoginModal(){
    var m = document.getElementById('login-modal');
    if(m) m.classList.add('hidden');
    document.body.style.overflow = '';
  }
  function setAuthMode(mode){
    authMode = mode;
    var tl = document.getElementById('lm-tab-login'), tr = document.getElementById('lm-tab-reg');
    var sub = document.getElementById('lm-submit'), ti = document.getElementById('lm-title');
    if(tl) tl.classList.toggle('active', mode === 'login');
    if(tr) tr.classList.toggle('active', mode === 'reg');
    if(sub) sub.textContent = mode === 'login' ? '登 录' : '注 册';
    if(ti) ti.textContent = mode === 'login' ? '👤 登录' : '📝 注册账号';
  }
  function lmMsg(text, ok){
    var msg = document.getElementById('lm-msg');
    if(!msg) return;
    msg.textContent = text;
    msg.className = 'auth-msg ' + (ok ? 'ok' : 'err');
  }
  async function doAuthSubmit(){
    var emailEl = document.getElementById('lm-email'), passEl = document.getElementById('lm-pass');
    var email = emailEl ? emailEl.value.trim() : '';
    var pass = passEl ? passEl.value : '';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ lmMsg('请输入正确的邮箱地址', false); return; }
    if(pass.length < 6){ lmMsg('密码至少需要 6 位', false); return; }
    var c = getClient();
    if(!c){ lmMsg('云服务未就绪，请检查网络后重试', false); return; }
    var btn = document.getElementById('lm-submit');
    if(btn){ btn.disabled = true; btn.textContent = '请稍候…'; }
    try{
      if(authMode === 'login'){
        var r = await c.auth.signInWithPassword({ email: email, password: pass });
        if(r.error){
          lmMsg(r.error.message === 'Invalid login credentials' ? '邮箱或密码错误' : (r.error.message || '登录失败，请重试'), false);
        } else {
          closeLoginModal();
          toast('✅ 登录成功，进度已同步');
        }
      } else {
        var r2 = await c.auth.signUp({ email: email, password: pass });
        if(r2.error){
          lmMsg(r2.error.message || '注册失败，请重试', false);
        } else if(r2.data && r2.data.session){
          closeLoginModal();
          toast('✅ 注册成功，已自动登录');
        } else {
          lmMsg('注册成功！验证邮件已发送到 ' + email + '，请查收后登录', true);
          setAuthMode('login');
        }
      }
    }catch(e){
      console.error('[cloud] auth error', e);
      lmMsg('网络异常：' + (e && e.message ? e.message : e), false);
    }
    if(btn){ btn.disabled = false; btn.textContent = authMode === 'login' ? '登 录' : '注 册'; }
  }
  async function doForgot(){
    var emailEl = document.getElementById('lm-email');
    var email = emailEl ? emailEl.value.trim() : '';
    if(!email){ lmMsg('请先输入邮箱地址', false); return; }
    var c = getClient();
    if(!c) return;
    try{
      var r = await c.auth.resetPasswordForEmail(email);
      lmMsg(r && r.error ? (r.error.message || '发送失败') : '重置邮件已发送，请查收邮箱操作', !(r && r.error));
    }catch(e){ lmMsg('网络异常，请重试', false); }
  }
  async function doLogout(){
    var c = getClient();
    if(!c) return;
    try{ await c.auth.signOut(); }catch(e){ console.error('[cloud] signOut', e); }
    /* SIGNED_OUT 事件里会更新 UI */
  }

  /* ---------- 云端同步 ---------- */
  var origSaveState = (typeof saveState === 'function') ? saveState : function(){};
  saveState = function(){ origSaveState(); schedulePush(); };

  function schedulePush(){
    if(!sessionUser || loadingCloud) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushNow, 900);
  }
  async function pushNow(){
    var c = getClient();
    if(!c || !sessionUser || loadingCloud) return;
    try{
      var payload = {
        user_id: sessionUser.id,
        data: JSON.parse(JSON.stringify(state)),
        updated_at: new Date().toISOString()
      };
      var r = await c.from(TABLE).upsert(payload, { onConflict: 'user_id' });
      if(r && r.error) throw r.error;
    }catch(e){
      console.error('[cloud] push error', e);
      var now = Date.now();
      if(now - lastPushErrAt > 15000){ lastPushErrAt = now; toast('☁️ 云端同步失败（网络问题），数据仍安全保存在本机'); }
    }
  }
  function mergeState(cloud, local){
    var base = JSON.parse(JSON.stringify(cloud && typeof cloud === 'object' ? cloud : {}));
    var out = Object.assign(defaultState(), base);
    var st = {};
    Object.keys(base.stats || {}).forEach(function(w){ st[w] = base.stats[w]; });
    Object.keys(local.stats || {}).forEach(function(w){
      var l = local.stats[w], b = st[w];
      if(!b){ st[w] = l; }
      else if((l && (l.seen || 0)) > (b && (b.seen || 0))){ st[w] = l; }
    });
    out.stats = st;
    out.wordbook = Array.from(new Set((base.wordbook || []).concat(local.wordbook || [])));
    out.checkins = Array.from(new Set((base.checkins || []).concat(local.checkins || []))).sort();
    if((local.lastDate || '') > (base.lastDate || '')){
      out.streak = local.streak || 0;
      out.lastDate = local.lastDate;
      out.daily = Object.assign({ date: '', count: 0 }, local.daily || {});
    }
    if(local.goal != null) out.goal = local.goal;
    if(local.settings && typeof local.settings === 'object') out.settings = Object.assign(defaultSettings(), local.settings);
    return out;
  }
  async function loadFromCloud(){
    var c = getClient();
    if(!c || !sessionUser || loadingCloud) return;
    loadingCloud = true;
    try{
      var r = await c.from(TABLE).select('data, updated_at').eq('user_id', sessionUser.id).maybeSingle();
      if(r && r.error) throw r.error;
      if(r && r.data && r.data.data){
        var raw = r.data.data;
        var cloudState = (typeof raw === 'string') ? JSON.parse(raw) : raw;
        state = mergeState(cloudState, state);
        origSaveState();
        if(typeof renderHeaderStats === 'function') renderHeaderStats();
        if(typeof renderStats === 'function') renderStats();
        if(typeof renderSettings === 'function') renderSettings();
        if(typeof applyAppearance === 'function') applyAppearance();
        if(typeof applyPracticePrefs === 'function') applyPracticePrefs();
        toast('☁️ 已同步云端进度');
      } else {
        pushNow();
      }
    }catch(e){
      console.error('[cloud] load error', e);
      toast('☁️ 云端数据读取失败，请检查网络');
    }
    loadingCloud = false;
    schedulePush();
  }
  function onAuth(event, session){
    sessionUser = session ? session.user : null;
    window.__CURRENT_USER_EMAIL__ = sessionUser ? (sessionUser.email || '') : '';
    if(sessionUser){
      setTimeout(loadFromCloud, 250);
      var si = document.getElementById('learn-search');
      var em = sessionUser.email || '';
      if(si && si.value && em && si.value.trim().toLowerCase() === em.toLowerCase()){
        si.value = '';
        if(typeof learnQuery !== 'undefined') learnQuery = '';
        if(typeof renderLearnList === 'function') renderLearnList();
      }
    }
    renderAuthUI();
    renderCloudCard();
  }
  function initAuth(){
    var c = getClient();
    if(!c) return;
    try{
      c.auth.onAuthStateChange(function(event, session){
        if(event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED'){
          onAuth(event, session);
        } else if(event === 'SIGNED_OUT'){
          onAuth(event, null);
        }
      });
      c.auth.getSession().then(function(res){
        if(res && res.data && res.data.session) onAuth('INITIAL_SESSION', res.data.session);
      }).catch(function(e){ console.error('[cloud] getSession', e); });
    }catch(e){ console.error('[cloud] initAuth', e); }
  }
  function bindModalEvents(){
    var mc = document.getElementById('lm-close');
    if(mc) mc.addEventListener('click', closeLoginModal);
    var mm = document.getElementById('login-modal');
    if(mm) mm.addEventListener('click', function(e){ if(e.target && e.target.id === 'login-modal') closeLoginModal(); });
    var tl = document.getElementById('lm-tab-login'); if(tl) tl.addEventListener('click', function(){ setAuthMode('login'); });
    var tr = document.getElementById('lm-tab-reg'); if(tr) tr.addEventListener('click', function(){ setAuthMode('reg'); });
    var sub = document.getElementById('lm-submit'); if(sub) sub.addEventListener('click', doAuthSubmit);
    var fg = document.getElementById('lm-forgot'); if(fg) fg.addEventListener('click', doForgot);
    var pp = document.getElementById('lm-pass');
    if(pp) pp.addEventListener('keydown', function(e){ if(e.key === 'Enter') doAuthSubmit(); });
    var ee = document.getElementById('lm-email');
    if(ee) ee.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ var p = document.getElementById('lm-pass'); if(p) p.focus(); } });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeLoginModal(); });
  }

  function init(){
    ensureTopbarUI();
    ensureCloudCard();
    bindModalEvents();
    renderAuthUI();
    renderCloudCard();
    function boot(){
      ensureTopbarUI(); ensureCloudCard(); renderAuthUI(); renderCloudCard();
      if(cloudReady()){
        initAuth();
      } else if(CFG.url){
        window.addEventListener('load', function(){
          if(cloudReady()){ initAuth(); }
          else { offlineShown = true; }
          renderAuthUI(); renderCloudCard();
        });
      }
    }
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }
  init();
})();
