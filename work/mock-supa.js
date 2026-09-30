/* 测试用 Supabase 模拟器（仅注入到测试页面） */
(function(){
  if(window.__mockSupaLoaded) return;
  window.__mockSupaLoaded = true;
  window.__SUPA_CONFIG__ = { url: 'mock://supabase.local', anon: 'mock-anon-key' };
  var USERS_KEY = 'sb-mock-users';
  var SESS_KEY = 'sb-mock-session';
  var STORE_KEY = 'sb-mock-store';
  function read(k, d){ try{ var v = JSON.parse(localStorage.getItem(k)); return (v === null || v === undefined) ? d : v; }catch(e){ return d; } }
  function write(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  var users = read(USERS_KEY, {});
  var store = read(STORE_KEY, {});
  var session = read(SESS_KEY, null);
  var authCb = null;
  window.__mockStore = { users: users, store: store, session: session };
  function emit(ev, s){ if(authCb){ try{ authCb(ev, s); }catch(e){} } }
  function makeUser(id, email){ return { id: id, email: email }; }
  function makeSession(user){ return { user: user, access_token: 'mock-token-' + user.id, expires_at: Date.now() + 86400000 }; }
  var builder = {
    select: function(){ return builder; },
    eq: function(){ return builder; },
    maybeSingle: function(){
      var u = session ? session.user : null;
      return Promise.resolve({ data: (u && store[u.id]) ? store[u.id] : null, error: null });
    },
    upsert: function(payload, opts){
      var u = session ? session.user : null;
      if(!u) return Promise.resolve({ error: { message: 'not signed in' } });
      store[u.id] = { data: payload.data, updated_at: payload.updated_at };
      write(STORE_KEY, store);
      window.__mockStore.store = store;
      return Promise.resolve({ error: null });
    }
  };
  window.supabase = {
    createClient: function(){
      return {
        auth: {
          getSession: function(){ return Promise.resolve({ data: { session: session }, error: null }); },
          onAuthStateChange: function(cb){
            authCb = cb;
            window.__mockStore.authCb = cb;
            return { data: { subscription: { unsubscribe: function(){} } } };
          },
          signInWithPassword: function(p){
            var u = users[p.email];
            if(!u || u.pass !== p.password) return Promise.resolve({ data: {}, error: { message: 'Invalid login credentials' } });
            var s = makeSession(makeUser(u.id, p.email));
            session = s; write(SESS_KEY, s); window.__mockStore.session = s;
            emit('SIGNED_IN', s);
            return Promise.resolve({ data: { user: s.user, session: s }, error: null });
          },
          signUp: function(p){
            if(users[p.email]) return Promise.resolve({ data: {}, error: { message: 'User already registered' } });
            var id = 'u' + (Object.keys(users).length + 1);
            users[p.email] = { id: id, pass: p.password };
            write(USERS_KEY, users);
            window.__mockStore.users = users;
            var s = makeSession(makeUser(id, p.email));
            session = s; write(SESS_KEY, s); window.__mockStore.session = s;
            emit('SIGNED_IN', s);
            return Promise.resolve({ data: { user: s.user, session: s }, error: null });
          },
          signOut: function(){
            session = null; write(SESS_KEY, null); window.__mockStore.session = null;
            emit('SIGNED_OUT', null);
            return Promise.resolve({ error: null });
          },
          resetPasswordForEmail: function(){ return Promise.resolve({ error: null }); }
        },
        from: function(t){
          if(t !== 'user_data') return Promise.reject(new Error('bad table ' + t));
          return builder;
        }
      };
    }
  };
})();