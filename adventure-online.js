/* ============================================================================
   adventure-online.js -- the account shell around Red Ring Circuit, the way
   every game of ours has it (Wordle n' Friends, BLOCKADE): log in or make a new
   player on the title screen, then the online lobby, rooms, friends, messages
   and the lobby chat, in the game's own Sonic look.

   THE LOGIN: the title's panel. A new player gives a name, a password (six
   characters or more) and the password again. Accounts live in this browser
   (net/auth.js); "Keep me logged in" skips the panel next time.

   THE LOBBY: the room list (each host keeps a note about its room on the two
   public MQTT brokers, as in Knock//Back), everyone online (friends first), a
   leaderboard and the lobby chat. Click anyone for their player card: add
   friend, message, invite to your room, challenge, join their room, block.
   QUICK MATCH drops you into an open public room (or opens one).

   A ROOM is for one of four things: a BATTLE (up to four fighters, players and
   CPUs filling in), an EXHIBITION RACE (up to eight runners through a zone's
   first Act, each in their own copy of it, the others shown as ghosts), STORY
   co-op (the host's episode chapter, the others fighting beside the hero), or a
   TOURNAMENT (a bracket of 8 or 16, CPUs filling the places nobody took). The
   host sets it up; everyone picks a fighter and readies up; the host starts.

   THE LINKS: browsers connect directly (WebRTC through PeerJS; the free PeerJS
   service only introduces them). If a direct link can't get through, the room's
   messages go over the lobby's MQTT brokers instead, encrypted (net/relay.js).
   The match itself is run by the host's game (adventure.js, "netplay"): guests
   send their buttons, the host sends back everything that happens.

     AdventureOnline.init(api) titlePanel(el) topbar(el) lobby() friends() messages()
     card(id) toast(text, cls) modal(o)   Online.host(o) join(code, pass) leave() start()
   ========================================================================== */
(function (root) {
  'use strict';
  let A = null;                                        // the game (adventure.js) hands this in
  const AO = root.AdventureOnline = {};
  const esc = s => U.esc(s);
  const ico = n => (A ? A.ico(n) : '');
  const PROTO = 'rrc-room-1';
  const PEER_JS = ['https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js', 'https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js'];
  const PREFIX = 'redringcircuit-room-', ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const MAXES = { battle: 4, race: 8, gp: 8, story: 3, tourney: 8 };
  const MODES = { battle: 'Battle', race: 'Exhibition race', gp: 'Red Ring Circuit', story: 'Story co-op', tourney: 'Tournament' };
  const MODE_ICO = { battle: 'trophy', race: 'flag', gp: 'star', story: 'book', tourney: 'crown' };
  const GP_CLS_N = { breeze: 'Breeze', gale: 'Gale', storm: 'Storm' };
  const QUICK = ['GG!', 'Good luck!', 'Nice combo!', 'Ready!', 'One more?', 'Be right back', 'Thanks for the game!'];
  const DENY = {
    version: 'That room is on a different version of the game. Reload the page and try again.',
    blocked: 'The host of that room has blocked you.',
    locked: 'That room is locked: its host isn\'t letting anyone new in.',
    full: 'That room is full.',
    playing: 'That room is in the middle of a match. Try again when it ends.',
    pass: 'That room is private: it needs its password.',
    wrongpass: 'Wrong password.',
  };
  const why = e => ({
    'peer-unavailable': 'No room with that code. It may have closed: check the code.',
    'network': 'Couldn\'t reach the matchmaking service. Check your connection and try again.',
    'server-error': 'The matchmaking service is having trouble. Try again in a minute.',
    'socket-error': 'Couldn\'t reach the matchmaking service. Check your connection and try again.',
    'socket-closed': 'Lost the matchmaking service. Try again.',
    'browser-incompatible': 'This browser can\'t make peer-to-peer connections. Try Chrome, Edge, Firefox or Safari.',
    'webrtc': 'The connection failed. Some networks block it.',
  })[e && e.type] || ('Connection problem' + (e && e.type ? ' (' + e.type + ')' : '') + '. Try again.');

  AO.init = api => { A = api; };
  AO.MODES = MODES;

  /* ===================================================== toasts and dialogs */
  function toast(text, cls, ms) {
    const host = A && A.host(); if (!host) return null;
    let box = host.querySelector('.ao-toasts');
    if (!box) { box = document.createElement('div'); box.className = 'ao-toasts'; host.append(box); }
    const t = document.createElement('div'); t.className = 'ao-toast ' + (cls || ''); t.textContent = text;
    box.append(t); ms = ms || 3400;
    setTimeout(() => t.classList.add('out'), ms); setTimeout(() => t.remove(), ms + 450);
    return t;
  }
  AO.toast = toast;
  /* a dialog over everything: { title, icon, body (html or a node), buttons: [[label, fn, cls]], onClose }
     (a button's fn returning false keeps it open) */
  function modal(o) {
    const host = A.host();
    const wrap = document.createElement('div'); wrap.className = 'ao-modal';
    wrap.innerHTML = `<div class="panel adv-small pop ${o.cls || ''}"><div class="panel-hd">${o.icon ? ico(o.icon) : ''}<span>${esc(o.title)}</span><button class="ao-x" data-x aria-label="Close" title="Close">${ico('close')}</button></div><div class="ao-mbody"></div><div class="adv-btns"></div></div>`;
    const body = wrap.querySelector('.ao-mbody');
    if (typeof o.body === 'string') body.innerHTML = o.body; else if (o.body) body.append(o.body);
    const close = () => { if (!wrap.isConnected) return; wrap.remove(); if (o.onClose) o.onClose(); };
    wrap.querySelector('[data-x]').onclick = close;
    wrap.addEventListener('pointerdown', e => { if (e.target === wrap) close(); });
    const bb = wrap.querySelector('.adv-btns');
    (o.buttons || []).forEach(([label, fn, cls], i) => {
      const b = document.createElement('button'); b.className = 'btn ' + (cls || ''); b.innerHTML = label;
      b.onclick = () => { const keep = fn && fn() === false; if (!keep) close(); };
      bb.append(b); if (i === 0) setTimeout(() => { try { b.focus(); } catch (e) { /* fine */ } }, 30);
    });
    host.append(wrap);
    A.paintAll(wrap);
    return { close, el: wrap, body };
  }
  AO.modal = modal;
  const face = (who, w, h) => `<canvas class="ao-face" width="${w || 44}" height="${h || 40}" data-face="${esc(who || 'sonic')}"></canvas>`;
  const tagOf = id => '#' + String(id).slice(0, 4).toUpperCase();
  /* a player's favourite (their picture everywhere): yours is the one you picked on your card, else your game's runner */
  const myFav = () => { const f = Auth.S && Auth.S.fav; return f && A.cast().some(c => c.id === f) ? f : A.castId(); };
  const favOf = id => { if (id === Auth.id) return myFav(); const p = Net.online(id) || Net.profiles.get(id) || {}; return p.fav || 'sonic'; };

  /* ===================================================== the login (the title's panel) */
  let lastName = '';
  AO.loggedIn = () => !!Auth.user;
  AO.resume = () => { if (!Auth.user && Auth.resume()) afterLogin(true); return !!Auth.user; };
  AO.titlePanel = (box, onGo) => {
    let view = Auth.user ? 'me' : Auth.count() ? 'login' : 'new';
    const draw = err => {
      const accts = Auth.list();
      if (view === 'me') {
        box.innerHTML = `
          <div class="panel ao-login pop">
            <div class="ao-welcome">${face(A.castId(), 66, 54)}<div><small>Welcome back</small><b>${esc(Auth.name)}<i>${tagOf(Auth.id)}</i></b><span>Level ${Auth.lv()}${A.fighters ? ' · Fighters ' + A.fighters() + '/' + A.cast().length : ''}</span></div></div>
            <div class="adv-btns"><button class="btn lg" data-go data-enter data-focus>${ico('flag')}Start</button><button class="btn ghost" data-out>${ico('door')}Switch player</button></div>
          </div>`;
        box.querySelector('[data-go]').onclick = () => onGo();
        box.querySelector('[data-out]').onclick = () => { Auth.logout(); view = Auth.count() ? 'login' : 'new'; draw(); };
        A.paintAll(box); A.autoFocus(); return;
      }
      const login = view === 'login';
      box.innerHTML = `
        <form class="panel ao-login pop" novalidate>
          <div class="panel-hd">${ico(login ? 'person' : 'star')}${login ? 'Log in' : 'New player'}</div>
          ${login && accts.length ? `<div class="ao-accts">${accts.slice(0, 4).map(a => `<button type="button" class="ao-acct" data-u="${esc(a.user)}"><b>${esc(a.user)}</b><i>Lv ${a.lv}</i></button>`).join('')}</div>` : ''}
          <label class="ao-f"><span>Name</span><input class="ao-in" name="u" maxlength="16" autocomplete="username" spellcheck="false" value="${esc(lastName)}"></label>
          <label class="ao-f"><span>Password</span><input class="ao-in" name="p" type="password" autocomplete="${login ? 'current-password' : 'new-password'}"></label>
          ${login ? '' : `<label class="ao-f"><span>Confirm password</span><input class="ao-in" name="p2" type="password" autocomplete="new-password"></label>`}
          <label class="ao-chk"><input type="checkbox" name="r" checked><span>Keep me logged in on this device</span></label>
          ${login ? '' : `<p class="ao-note">A name of 3 to 16 letters or numbers, and a password of ${Auth.PW_MIN} characters or more. Your player lives in this browser.</p>`}
          <p class="ao-err" ${err ? '' : 'hidden'}>${esc(err || '')}</p>
          <div class="adv-btns">
            <button class="btn lg" type="submit">${ico(login ? 'flag' : 'check')}${login ? 'Log in' : 'Create player'}</button>
            ${login ? `<button class="btn ghost" type="button" data-sw>New player</button>` : Auth.count() ? `<button class="btn ghost" type="button" data-sw>${ico('back')}Log in instead</button>` : ''}
          </div>
        </form>`;
      const f = box.querySelector('form'), q = n => f.querySelector(`[name="${n}"]`);
      f.querySelectorAll('[data-u]').forEach(b => b.onclick = () => { q('u').value = b.dataset.u; q('p').focus(); });
      const sw = f.querySelector('[data-sw]'); if (sw) sw.onclick = () => { lastName = q('u').value; view = login ? 'new' : 'login'; draw(); };
      f.onsubmit = async e => {
        e.preventDefault();
        const u = q('u').value.trim(), p = q('p').value, rem = q('r').checked; lastName = u;
        const btn = f.querySelector('[type=submit]'); btn.disabled = true;
        const r = login ? await Auth.login(u, p, rem) : await Auth.register(u, p, q('p2').value, rem);
        btn.disabled = false;
        if (r.err) { draw(r.err); return; }
        afterLogin(false, r.fresh);
        onGo();
      };
      setTimeout(() => { const i = q('u').value ? q('p') : q('u'); try { i.focus(); } catch (x) { /* fine */ } }, 40);
    };
    draw();
  };
  /* in: the account's own save, and online (if Options say so) */
  function afterLogin(resumed, fresh) {
    A.onLogin(Auth.id, !!fresh);
    Social.init();
    Social.ui = { toast, message: (id, n, x) => { const t = toast(n + ': ' + x.slice(0, 80), 'msg', 4200); if (t) t.onclick = () => AO.messages(id); }, challenged, unchallenged, invited };
    Net.favDefault = A.castId();
    if (Auth.prefs.autoOnline) Net.start();
    if (fresh) setTimeout(() => toast('Welcome, ' + Auth.name + '! Your friend code is ' + Auth.name + tagOf(Auth.id) + '.', 'gold', 5200), 300);
  }
  AO.logout = () => { Online.leave(true); Auth.logout(); A.onLogout(); };

  /* ===================================================== the main menu's top bar */
  AO.topbar = el => {
    const offs = [];
    const draw = () => {
      if (!el.isConnected) { offs.forEach(f => f()); return; }
      if (!Auth.user) { el.innerHTML = ''; return; }
      const nf = Social.requests(), nm = Social.unread(), st = Net.state;
      el.innerHTML = `
        <button class="ao-me" data-a="me">${face(myFav())}<span><b>${esc(Auth.name)}<i>${tagOf(Auth.id)}</i></b><small><em class="ao-dot ${st}"></em>${st === 'up' ? 'Online' : st === 'connecting' ? 'Connecting…' : 'Offline'} · Lv ${Auth.lv()}${A.fighters ? ' · ' + A.fighters() + '/' + A.cast().length + ' fighters' : ''}</small></span></button>
        <button class="ao-tb" data-a="friends">${ico('person')}<span>Friends</span>${nf ? `<i class="ao-badge">${nf}</i>` : ''}</button>
        <button class="ao-tb" data-a="msgs">${ico('mail')}<span>Messages</span>${nm ? `<i class="ao-badge">${nm}</i>` : ''}</button>
        <button class="ao-tb" data-a="out">${ico('door')}<span>Log out</span></button>`;
      A.paintAll(el);
      const go = { me: () => AO.card(Auth.id), friends: () => AO.friends(), msgs: () => AO.messages(), out: () => modal({ title: 'Log out?', icon: 'door',
        body: `<p class="adv-note">You'll go back to the title. Your progress stays with your player on this device.</p>`, buttons: [['Log out', () => AO.logout(), ''], ['Stay', null, 'ghost']] }) };
      el.querySelectorAll('[data-a]').forEach(b => b.onclick = () => go[b.dataset.a]());
    };
    offs.push(Social.on('change', draw), Net.on('state', draw));
    draw();
  };

  /* ===================================================== the room note on the brokers */
  const Dir = {
    pub: null,
    async host(code, info) {
      Dir.stopHost();
      const topic = Net.PRE + 'rooms/' + code, P = Dir.pub = { topic, info, clients: [] };
      try { await Net.loadMqtt(); } catch (e) { return; }
      if (Dir.pub !== P) return;
      P.clients = Net.BROKERS.map(url => {
        const c = mqtt.connect(url, { clientId: 'rrch_' + U.rid(10), keepalive: 30, reconnectPeriod: 5000, connectTimeout: 8000, clean: true, will: { topic, payload: '', retain: true, qos: 0 } });
        c.on('connect', () => Dir.publish(c)); c.on('error', () => { });
        return c;
      });
      P.t = setInterval(() => Dir.update(), 10000);
    },
    publish(c) { const P = Dir.pub; if (!P) return; const i = P.info(); try { c.publish(P.topic, i ? JSON.stringify(Object.assign(i, { v: PROTO, ts: Date.now() })) : '', { retain: true, qos: 0 }); } catch (e) { /* fine */ } },
    update() { const P = Dir.pub; if (!P) return; for (const c of P.clients) if (c.connected) Dir.publish(c); },
    stopHost() {
      const P = Dir.pub; if (!P) return; Dir.pub = null; clearInterval(P.t);
      for (const c of P.clients) { try { if (c.connected) c.publish(P.topic, '', { retain: true, qos: 0 }); } catch (e) { /* fine */ } setTimeout(() => { try { c.end(true); } catch (e) { /* fine */ } }, 600); }
    },
  };
  const listedRooms = () => [...Net.rooms.values()].filter(r => r.v === PROTO);

  /* ===================================================== rooms: messages */
  const Online = root.Online = Object.assign(U.hub(), { PROTO });
  let N = null;        // the session: the room you're in (or opening / joining)
  const loadPeer = () => Net.loadScript(PEER_JS, () => !!root.Peer);
  const makeCode = () => Array.from({ length: 5 }, () => ALPHA[Math.floor(Math.random() * ALPHA.length)]).join('');
  const meInfo = () => ({ uid: Auth.id, name: Auth.name, lv: Auth.lv(), r: Auth.S.rank.rating, who: A.castId(), em: A.emerlLoadout() });
  const memberOf = id => N && N.room ? N.room.members.find(m => m.id === id) || null : null;
  Online.inRoom = () => !!(N && N.room && N.stage === 'room');
  Online.room = () => N && N.room;
  Online.myId = () => N && N.myId;
  Online.isHost = () => !!(N && N.host);
  Online.me = () => memberOf(N && N.myId);
  function toMember(id, msg) {
    if (!N || !N.host) return;
    if (id === N.myId) { setTimeout(() => { if (N) guestGot(msg); }, 0); return; }
    const M = N.mem.get(id); if (M && M.conn && M.conn.open) { try { M.conn.send(msg); } catch (e) { /* closed */ } }
  }
  function toAll(msg, exceptMe) { if (!N || !N.host) return; for (const m of N.room.members) if (!(exceptMe && m.id === N.myId)) toMember(m.id, msg); }
  function toHost(msg) { if (!N) return; if (N.host) hostGot(N.myId, msg); else if (N.conn && N.conn.open) { try { N.conn.send(msg); } catch (e) { /* closed */ } } }
  Online.toAll = toAll; Online.toHost = toHost; Online.toMember = toMember;

  /* ===================================================== the host's side */
  function newRoom(o, code) {
    const mode = MAXES[o.mode] ? o.mode : 'battle';
    return {
      code, name: U.clean(o.name, 24) || Auth.name + '\'s room', priv: !!o.priv, listed: o.listed !== false, locked: false, mode, max: MAXES[mode],
      members: [], playing: false, chat: 'on', chal: o.chal || null,
      // a battle: the arena, the rules, and CPUs to fill in
      arena: o.arena == null ? 0 : o.arena, rule: 'stock', goal: 3, time: 180, hp: 200, teams: false, cpu: 1, lvl: 1,
      // a race: a zone's first Act
      zone: o.zone == null ? 0 : o.zone,
      // story co-op: the host's episode and chapter
      ep: o.ep || A.castId(), ch: 0,
      // a tournament: 8 or 16 places, CPUs in the rest, at their level; the arena (-1: a new one every match)
      size: 8, tlvl: 1, tgoal: 2, tarena: -1,
      // the grand prix: a cup and a class (CPUs fill the eight places)
      gpCup: 0, gpCls: 'gale',
    };
  }
  function listing() {
    const R = N && N.room; if (!R || !R.listed) return null;
    const n = R.members.length;
    return { name: R.name, host: Auth.name, hostId: Auth.id, n, max: R.max, priv: R.priv, mode: R.mode, what: roomWhat(R),
      state: R.locked ? 'locked' : n >= R.max ? 'full' : R.playing ? 'playing' : 'open' };
  }
  /* what a room is about, in a few words */
  function roomWhat(R) {
    const z = i => (A.zones()[i] || {}).name || '';
    if (R.mode === 'race') return z(R.zone) + ' · Act 1';
    if (R.mode === 'gp') return ((A.gpCups ? A.gpCups() : [])[R.gpCup] || 'A cup') + ' · ' + (GP_CLS_N[R.gpCls] || 'Gale');
    if (R.mode === 'story') { const e = A.eps().find(x => x.who === R.ep); return e ? e.name + ': ' + (e.chapters[R.ch] || '') : ''; }
    if (R.mode === 'tourney') return R.size + ' places · ' + (R.tarena < 0 ? 'any arena' : z(R.tarena));
    return z(R.arena) + ' · ' + (R.rule === 'stock' ? R.goal + (R.goal === 1 ? ' life' : ' lives') : R.goal + ' KOs');
  }
  AO.roomWhat = roomWhat;
  let pushT = null;
  function pushRoom() {
    if (!N || !N.host) return;
    clearTimeout(pushT);
    pushT = setTimeout(() => { if (!N || !N.host) return; toAll({ t: 'room', room: N.room }, true); Dir.update(); setPresence(); redraw(); }, 30);
  }
  /* PING: how long a player's messages take to reach the host and come back (a room is the host's
     connection to each player, straight or through the relay). The host sends each player a ping
     every two seconds and smooths the round trips; the table goes to the room in a message of its
     own, and the bars beside each name show it (the host's own: theirs is the room). */
  const PING_EVERY = 2000;
  function hostPing(S0) {
    if (N !== S0 || !S0.host || !S0.room) { clearInterval(S0.pingT); return; }
    const now = performance.now(), table = {};
    for (const m of S0.room.members) {
      if (m.host) continue;
      toMember(m.id, { t: 'ping', s: now });
      const M = S0.mem.get(m.id);
      if (M && M.pongAt && now - M.pongAt > PING_EVERY * 3) m.ping = Math.max(m.ping || 0, Math.round(now - M.pongAt));   // (no answer for a while: as slow as that at least)
      if (m.ping != null) table[m.id] = m.ping;
    }
    toAll({ t: 'pings', p: table }, true);
    paintPings();
  }
  /* the bars: four, lit by how quick (60, 120, 200 ms and over), the time on hover */
  const pingLevel = ms => ms == null ? 0 : ms < 60 ? 4 : ms < 120 ? 3 : ms < 200 ? 2 : 1;
  function pingBars(m) {
    const lv = m.host ? 4 : pingLevel(m.ping);
    const tip = m.host ? 'Host: the room runs on their connection' : m.ping == null ? 'Measuring the ping…' : 'Ping ' + Math.round(m.ping) + ' ms';
    return `<i class="ao-ping p${lv}" data-pid="${esc(m.id)}" title="${tip}" aria-label="${tip}"><s></s><s></s><s></s><s></s></i>`;
  }
  function paintPings() {
    if (!N || !N.room) return;
    document.querySelectorAll('.ao-ping[data-pid]').forEach(el => {
      const m = memberOf(el.dataset.pid); if (!m) return;
      const tmp = document.createElement('div'); tmp.innerHTML = pingBars(m);
      const nw = tmp.firstChild; el.className = nw.className; el.title = nw.title; el.setAttribute('aria-label', nw.getAttribute('aria-label'));
    });
  }
  function sysSay(text) { if (!N) return; const c = { sys: text }; if (N.host) { toAll({ t: 'chat', c }, true); gotChat(c); } }
  function hostConn(conn) {
    conn.on('data', d => hostData(conn, d));
    conn.on('close', () => memberGone(conn.peer, 'left'));
    conn.on('error', () => { });
  }
  function hostData(conn, d) {
    if (!N || !N.host || !d || typeof d !== 'object') return;
    const id = conn.peer, R = N.room;
    if (d.t === 'hello') {
      if (N.mem.has(id)) return;
      const deny = w => { try { conn.send({ t: 'deny', why: w }); } catch (e) { /* fine */ } setTimeout(() => { try { conn.close(); } catch (e) { /* fine */ } }, 400); };
      if (d.ver !== PROTO) return deny('version');
      const me = d.me || {}, uid = String(me.uid || '').slice(0, 16);
      if (N.blocked.has(uid)) return deny('blocked');
      if (R.members.some(m => m.uid === uid)) return deny('full');
      const chal = R.chal && uid === R.chal.to;
      if (R.locked && !chal) return deny('locked');
      if (R.playing) return deny('playing');
      if (R.members.length >= R.max) return deny('full');
      if (R.priv && !chal && String(d.pass || '') !== N.pass) return deny(d.pass ? 'wrongpass' : 'pass');
      N.mem.set(id, { conn });
      const teamN = t => R.members.filter(m => m.team === t).length;
      const m = { id, uid, name: U.clean(me.name, 16) || 'Player', lv: (+me.lv | 0) || 1, r: Math.round(+me.r || 1000), who: A.validWho(me.who), em: me.em && typeof me.em === 'object' ? me.em : null,
        team: teamN(0) <= teamN(1) ? 0 : 1, ready: false, host: false };
      R.members.push(m);
      conn.send({ t: 'welcome', you: id, room: R, pass: R.priv ? N.pass : '' });
      sysSay(m.name + ' joined.');
      if (chal) R.chal = null;
      fitCpus(R);
      pushRoom(); return;
    }
    if (!N.mem.has(id)) return;
    hostGot(id, d);
  }
  /* fewer seats for CPUs when players come in (a battle holds four fighters) */
  function fitCpus(R) { if (R.mode === 'battle') R.cpu = U.clamp(R.cpu, R.members.length > 1 ? 0 : 1, 4 - R.members.length); }
  const flood = new Map();
  function hostGot(id, d) {
    const R = N.room, m = memberOf(id); if (!m || !d) return;
    if (typeof d.t === 'string' && d.t.startsWith('np.')) { A.np.hostGot(id, d); return; }
    switch (d.t) {
      case 'ready': if (R.playing) return; m.ready = !!d.on; pushRoom(); break;
      case 'pick': if (R.playing) return; m.who = A.validWho(d.who); m.em = d.em && typeof d.em === 'object' ? d.em : null; pushRoom(); break;
      case 'team': if (R.playing || !R.teams) return; if (d.tm !== 0 && d.tm !== 1) return; m.team = d.tm; pushRoom(); break;
      case 'say': {
        const x = U.clean(d.x, 160); if (!x) return;
        const now = Date.now(), f = (flood.get(id) || []).filter(t => now - t < 10000); if (f.length >= 6) return; f.push(now); flood.set(id, f);
        const c = { id: m.uid, n: m.name, x };
        toAll({ t: 'chat', c }, true); gotChat(c);
        break;
      }
      case 'back': m.back = true; break;                 // (a guest has seen the results)
      case 'pong': {                                     // a ping come back: the round trip, smoothed
        const rtt = performance.now() - (+d.s || 0), M = N.mem.get(id);
        if (!(rtt >= 0 && rtt < 30000)) break;
        if (M) M.pongAt = performance.now();
        m.ping = m.ping == null ? Math.round(rtt) : Math.round(m.ping * 0.6 + rtt * 0.4);
        break;
      }
      case 'leave': memberGone(id, 'left'); break;
    }
  }
  function memberGone(id, how) {
    if (!N || !N.host) return;
    const R = N.room, i = R.members.findIndex(m => m.id === id); if (i < 0) return;
    const m = R.members[i]; R.members.splice(i, 1);
    const M = N.mem.get(id); N.mem.delete(id); if (M && M.conn) { try { M.conn.close(); } catch (e) { /* fine */ } }
    sysSay(m.name + (how === 'kick' ? ' was removed.' : ' left.'));
    if (R.playing) A.np.memberLeft(id, m.name);
    pushRoom();
  }
  /* host controls */
  Online.set = (k, v) => {
    if (!N || !N.host || N.room.playing) return;
    const R = N.room;
    if (k === 'mode') { R.mode = MAXES[v] ? v : 'battle'; R.max = MAXES[R.mode]; if (R.members.length > R.max) { toast('That needs fewer players: ' + R.max + ' at most.', 'bad'); R.mode = 'battle'; R.max = 4; } }
    else R[k] = v;
    if (k === 'priv' && v && !N.pass) N.pass = U.rid(4).toUpperCase();
    fitCpus(R); R.members.forEach(m => { if (!m.host) m.ready = false; });
    pushRoom();
  };
  Online.kick = id => { const m = memberOf(id); if (!m || m.host) return; toMember(id, { t: 'kick' }); setTimeout(() => memberGone(id, 'kick'), 200); };
  Online.block = id => { const m = memberOf(id); if (!m || m.host) return; N.blocked.add(m.uid); Online.kick(id); };
  Online.start = () => {
    if (!N || !N.host) return;
    const R = N.room; if (R.playing) return;
    const plan = A.np.plan(R, N.myId);
    if (plan.err) { toast(plan.err, 'bad'); return; }
    R.playing = true; R.members.forEach(m => { m.ready = false; m.back = false; });
    pushRoom();
    toAll({ t: 'start', room: R, plan }, true);
    A.np.start(true, R, plan, N.myId);
  };
  /* the host's game is done with the match: back to the room */
  Online.matchEnded = () => {
    if (!N || !N.host) return;
    const R = N.room;
    R.playing = false; R.members.forEach(m => m.ready = m.host);
    pushRoom();
  };

  /* ===================================================== the guest's side */
  function guestGot(d) {
    if (!N || !d || typeof d !== 'object') return;
    if (typeof d.t === 'string' && d.t.startsWith('np.')) { A.np.guestGot(d); return; }
    switch (d.t) {
      case 'welcome': N.myId = d.you; N.room = d.room; N.stage = 'room'; if (d.pass) N.pass = d.pass; N.chat = N.chat || []; setPresence(); AO.room(); break;
      case 'deny': toast(DENY[d.why] || 'You couldn\'t join that room.', 'bad'); endSession(); AO.lobby(); break;
      case 'room': { N.room = d.room; setPresence(); if (!A.np.active()) redraw(); break; }
      case 'chat': gotChat(d.c); break;
      case 'kick': toast('The host removed you from the room.', 'bad'); endSession(); AO.lobby(); break;
      case 'closed': hostGone('The host closed the room.'); break;
      case 'start': N.room = d.room; A.np.start(false, d.room, d.plan, N.myId); break;
      case 'ping': toHost({ t: 'pong', s: d.s }); break;  // (straight back: the host times it)
      case 'pings': if (N.room && d.p && typeof d.p === 'object') { for (const m of N.room.members) if (typeof d.p[m.id] === 'number') m.ping = d.p[m.id]; paintPings(); } break;
    }
  }
  function hostGone(text) {
    if (!N || N.host) return;
    toast(text, 'bad');
    const inMatch = A.np.active();
    endSession();
    if (inMatch) A.np.stop();
    AO.lobby();
  }
  function gotChat(c) {
    if (!N) return;
    if (c.id && Auth.S.blocked[c.id]) return;
    N.chat = N.chat || []; N.chat.push(Object.assign({ t: Date.now() }, c)); if (N.chat.length > 120) N.chat.shift();
    if (A.np.active()) A.np.chatLine(c); else redraw();
  }
  Online.say = text => { text = U.clean(text, 160); if (!text || !N || !N.room) return; toHost({ t: 'say', x: text }); };
  Online.chat = () => (N && N.chat) || [];

  /* ===================================================== sessions */
  function endSession() {
    if (!N) return;
    const S0 = N; N = null;
    try {
      if (S0.host) { for (const m of S0.room ? S0.room.members : []) if (m.id !== S0.myId) { const M = S0.mem.get(m.id); if (M && M.conn && M.conn.open) M.conn.send({ t: 'closed' }); } Dir.stopHost(); }
      else if (S0.conn && S0.conn.open) S0.conn.send({ t: 'leave' });
    } catch (e) { /* fine */ }
    setTimeout(() => {
      try { if (S0.relay) S0.relay.stop(); } catch (e) { /* fine */ }
      for (const t of S0.tries || []) { try { t.close(); } catch (e) { /* fine */ } }
      try { if (S0.conn) S0.conn.close(); } catch (e) { /* fine */ }
      try { if (S0.peer) S0.peer.destroy(); } catch (e) { /* fine */ }
    }, 300);
    clearTimeout(S0.relayT); clearInterval(S0.pingT);
    setPresence();
  }
  Online.leave = silent => {
    if (!N) return;
    if (A.np.active()) A.np.stop();
    endSession();
    if (!silent) AO.lobby();
  };
  function setPresence() {
    if (!root.Net || !Auth.user) return;
    if (!N || !N.room) { Net.setStatus(A.where() === 'lobby' ? 'lobby' : 'menu', A.where() === 'lobby' ? 'In the online lobby' : 'In the menus'); return; }
    const R = N.room, pub = R.listed && !R.priv ? R.code : null;
    if (R.playing) Net.setStatus('play', 'Playing: ' + MODES[R.mode] + ' · ' + roomWhat(R), pub);
    else Net.setStatus('room', 'In a room: ' + MODES[R.mode], pub);
  }
  Online.setPresence = AO.setPresence = setPresence;

  Online.host = async o => {
    o = o || {};
    if (Net.state === 'off') Net.start();
    Online.leave(true);
    const S0 = N = { stage: 'creating', host: true, mem: new Map(), blocked: new Set(), chat: [], pass: o.pass || (o.priv ? U.rid(4).toUpperCase() : '') };
    waiting('Opening your room…');
    try { await loadPeer(); } catch (e) { if (N === S0) { N = null; toast(e.message, 'bad'); AO.lobby(); } return; }
    const open = () => {
      const code = makeCode(), peer = new Peer(PREFIX + code, { debug: 0 });
      S0.peer = peer;
      peer.on('open', id => {
        if (N !== S0) { try { peer.destroy(); } catch (e) { /* fine */ } return; }
        S0.myId = id; S0.room = newRoom(o, code);
        const me = meInfo();
        S0.room.members.push({ id, uid: Auth.id, name: Auth.name, lv: me.lv, r: me.r, who: me.who, em: me.em, team: 0, ready: true, host: true });
        S0.stage = 'room';
        S0.pingT = setInterval(() => hostPing(S0), PING_EVERY);
        Dir.host(code, listing);
        S0.relay = Relay.host(code, link => { if (N === S0) hostConn(link); });
        setPresence(); AO.room();
        if (o.chal) Net.send(o.chal.to, 'chal', { code, pass: S0.pass, desc: MODES[S0.room.mode] + ' · ' + roomWhat(S0.room) }, true).then(r => { if (r.err) toast(r.err, 'bad'); else toast('Invite sent to ' + o.chal.name + '.', 'gold'); });
      });
      peer.on('connection', conn => { if (N !== S0) return; hostConn(conn); });
      peer.on('error', e => {
        if (N !== S0) return;
        if (e.type === 'unavailable-id') { try { peer.destroy(); } catch (x) { /* fine */ } open(); return; }
        if (S0.stage === 'creating') { N = null; toast(why(e), 'bad'); AO.lobby(); }
      });
      peer.on('disconnected', () => { try { peer.reconnect(); } catch (e) { /* fine */ } });
    };
    open();
  };
  Online.join = async (code, pass) => {
    code = String(code || '').trim().toUpperCase();
    if (!/^[A-Z0-9]{5}$/.test(code)) { toast('Room codes are five letters or numbers.', 'bad'); return; }
    if (N && N.room && N.room.code === code) { AO.room(); return; }
    if (Net.state === 'off') Net.start();
    Online.leave(true);
    const S0 = N = { stage: 'joining', host: false, chat: [], pass: pass || '', tries: [] };
    waiting('Joining room ' + code + '…');
    try { await loadPeer(); } catch (e) { if (N === S0) { N = null; toast(e.message, 'bad'); AO.lobby(); } return; }
    const hello = () => ({ t: 'hello', ver: PROTO, me: meInfo(), pass: S0.pass });
    const adopt = link => {
      if (N !== S0 || S0.conn) { try { link.close(); } catch (e) { /* fine */ } return; }
      S0.conn = link; clearTimeout(S0.relayT);
      for (const t of S0.tries) if (t !== link) { t.dropped = true; try { t.close(); } catch (e) { /* fine */ } }
      link.on('data', d => { if (N === S0) guestGot(d); });
      link.on('close', () => { if (N === S0) hostGone('Lost the connection to the room.'); });
      link.send(hello());
    };
    const tryRelay = () => {
      if (N !== S0 || S0.conn || S0.relayed) return; S0.relayed = true;
      const link = Relay.join(code); S0.tries.push(link);
      link.on('open', () => adopt(link));
      link.on('close', () => { if (N === S0 && !S0.conn) { N = null; toast('Couldn\'t reach that room. It may have closed.', 'bad'); AO.lobby(); } });
    };
    const peer = new Peer({ debug: 0 }); S0.peer = peer;
    peer.on('open', () => {
      if (N !== S0) return;
      const conn = peer.connect(PREFIX + code, { reliable: true, serialization: 'json' }); S0.tries.push(conn);
      conn.on('open', () => adopt(conn));
      conn.on('close', () => { if (!conn.dropped && N === S0 && !S0.conn) tryRelay(); });
      conn.on('error', () => { });
      S0.relayT = setTimeout(tryRelay, 5000);
    });
    peer.on('error', e => {
      if (N !== S0 || S0.conn) return;
      if (e.type === 'peer-unavailable') { if (!S0.relayed) { tryRelay(); return; } }
      if (e.type === 'network' || e.type === 'server-error' || e.type === 'socket-error') { tryRelay(); return; }
      N = null; toast(why(e), 'bad'); AO.lobby();
    });
    peer.on('disconnected', () => { try { peer.reconnect(); } catch (e) { /* fine */ } });
  };
  Online.quick = mode => {
    const open = listedRooms().filter(r => r.state === 'open' && !r.priv && r.n < r.max && (!mode || r.mode === mode)).sort((a, b) => b.n - a.n);
    if (open.length) { Online.join(open[0].code, ''); return; }
    toast('No open rooms right now: opening one for you.', 'gold');
    Online.host({ name: Auth.name + '\'s ' + MODES[mode || 'battle'].toLowerCase(), mode: mode || 'battle', arena: A.randomArena() });
  };
  Online.challenge = (id, o) => Online.host({ name: Auth.name + ' vs ' + Net.nameOf(id), priv: true, listed: false, mode: o.mode || 'battle', arena: o.arena, chal: { to: id, name: Net.nameOf(id) } });
  Online.invite = id => {
    if (!N || !N.room) return;
    Net.send(id, 'inv', { code: N.room.code, pass: N.pass || '', name: N.room.name, mode: N.room.mode }, true).then(r => toast(r.err || 'Invite sent to ' + Net.nameOf(id) + '.', r.err ? 'bad' : 'gold'));
  };
  Online.declined = m => toast(m.n + (m.b && m.b.busy ? ' is busy right now.' : ' declined your invite.'), 'bad');

  /* ===================================================== incoming invites */
  const prompts = new Map();
  function challenged(m) {
    const b = m.b || {}; if (!/^[A-Z0-9]{5}$/.test(b.code || '')) return;
    if (Net.status.a === 'room' || Net.status.a === 'play') { Net.send(m.f, 'chalno', { code: b.code, busy: true }); return; }
    const p = modal({ title: 'Battle invite', icon: 'trophy', cls: 'ao-chal',
      body: `<div class="ao-who">${face(favOf(m.f), 66, 54)}<div><b>${esc(m.n)}<i>${tagOf(m.f)}</i></b><span>challenges you!</span><em>${esc(String(b.desc || 'A battle').slice(0, 60))}</em></div></div><p class="adv-note">Accepting takes you straight into their room.</p>`,
      buttons: [['Accept', () => { prompts.delete(b.code); Online.join(b.code, String(b.pass || '')); }, ''], ['Decline', () => { prompts.delete(b.code); Net.send(m.f, 'chalno', { code: b.code }); }, 'ghost'], ['Block', () => { prompts.delete(b.code); Net.send(m.f, 'chalno', { code: b.code }); Social.block(m.f, m.n); }, 'ghost']],
      onClose: () => prompts.delete(b.code) });
    prompts.set(b.code, p);
    setTimeout(() => { if (prompts.get(b.code) === p) p.close(); }, 90000);
  }
  function unchallenged(m) { const p = prompts.get((m.b || {}).code); if (p) { p.close(); toast(m.n + ' called off the challenge.'); } }
  function invited(m) {
    const b = m.b || {}; if (!/^[A-Z0-9]{5}$/.test(b.code || '')) return;
    if (Net.status.a === 'play') { toast(m.n + ' invited you to a room (code ' + b.code + ').', 'gold', 5000); return; }
    modal({ title: 'Room invite', icon: 'mail',
      body: `<div class="ao-who">${face(favOf(m.f), 66, 54)}<div><b>${esc(m.n)}</b><span>invites you to ${esc(U.clean(b.name, 24) || 'their room')}.</span><em>${esc(MODES[b.mode] || 'Room')} · ${esc(b.code)}</em></div></div>`,
      buttons: [['Join', () => Online.join(b.code, String(b.pass || '')), ''], ['Not now', null, 'ghost']] });
  }

  /* ===================================================== screens */
  let redraw = () => { };
  function waiting(text) {
    const ov = A.screen('lobby');
    ov.innerHTML = `<div class="panel adv-small pop ao-wait"><div class="ao-spin"></div><p>${esc(text)}</p><div class="adv-btns"><button class="btn ghost" data-back>${ico('back')}Cancel</button></div></div>`;
    ov.querySelector('[data-back]').onclick = () => { Online.leave(true); AO.lobby(); };
  }
  const netLine = () => Net.state === 'up' ? `<em class="ao-dot up"></em>Online · ${Net.players.size} here` : Net.state === 'connecting' ? '<em class="ao-dot connecting"></em>Connecting…' : '<em class="ao-dot down"></em>Offline';
  const tabsHtml = (tabs, cur) => `<div class="ao-tabs">${tabs.map(([k, t]) => `<button class="${k === cur ? 'on' : ''}" data-tab="${k}">${t}</button>`).join('')}</div>`;
  /* every player's row: their fighter, name, what they're doing, and buttons */
  const rowHtml = (id, n, sub, on, acts) => `
    <div class="ao-row${on ? ' on' : ''}">
      <button class="ao-who-b" data-card="${esc(id)}">${face(favOf(id))}<i class="ao-dot ${on ? 'up' : 'off'}"></i><span><b>${esc(n)}<i>${tagOf(id)}</i></b><small>${esc(sub)}</small></span></button>
      <div class="ao-acts">${acts || ''}</div>
    </div>`;
  const wireCards = el => el.querySelectorAll('[data-card]').forEach(b => b.onclick = () => AO.card(b.dataset.card));

  /* ---------------------------------------------------- THE LOBBY */
  AO.lobby = tab => {
    if (!Auth.user) { A.title(); return; }
    if (N && N.room && N.stage === 'room') { AO.room(); return; }
    if (Net.state === 'off') Net.start();
    tab = tab || AO._tab || 'rooms'; AO._tab = tab;
    const ov = A.screen('lobby');
    setPresence();
    ov.innerHTML = `
      <div class="ao-page pop">
        <div class="ao-head"><button class="btn ghost" data-back data-k="back">${ico('back')}Main menu</button><h2>${ico('comet')}Online lobby</h2><span class="ao-net"></span></div>
        <div class="ao-grid">
          <div class="panel ao-left">
            ${tabsHtml([['rooms', 'Rooms'], ['players', 'Players online'], ['top', 'Leaderboard']], tab)}
            <div class="ao-acts2">
              <button class="btn" data-q>${ico('bolt')}Quick match</button>
              <button class="btn" data-h>${ico('flag')}Host a room</button>
              <span class="ao-join"><input class="ao-in" maxlength="5" placeholder="CODE" spellcheck="false"><button class="btn ghost" data-j>Join</button></span>
            </div>
            <div class="ao-list"></div>
          </div>
          <div class="panel ao-right">
            <div class="panel-hd">${ico('chat')}Lobby chat</div>
            <div class="ao-log"></div>
            <form class="ao-send"><input class="ao-in" maxlength="160" placeholder="Say something to the lobby…" autocomplete="off"><button class="btn">Send</button></form>
          </div>
        </div>
      </div>`;
    const list = ov.querySelector('.ao-list'), log = ov.querySelector('.ao-log'), netEl = ov.querySelector('.ao-net');
    ov.querySelector('[data-back]').onclick = () => A.mainMenu();
    ov.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => AO.lobby(b.dataset.tab));
    ov.querySelector('[data-q]').onclick = () => quickForm();
    ov.querySelector('[data-h]').onclick = () => hostForm();
    const code = ov.querySelector('.ao-join input');
    const join = () => Online.join(code.value, '');
    ov.querySelector('[data-j]').onclick = join;
    code.addEventListener('keydown', e => { if (e.key === 'Enter') join(); });
    const form = ov.querySelector('.ao-send'), say = form.querySelector('input');
    form.onsubmit = e => { e.preventDefault(); const r = Net.say(say.value); if (r.err) toast(r.err, 'bad'); else say.value = ''; };
    const drawList = () => {
      if (tab === 'rooms') {
        const rs = listedRooms().sort((a, b) => (a.state === 'open' ? 0 : 1) - (b.state === 'open' ? 0 : 1) || b.n - a.n);
        list.innerHTML = rs.length ? rs.map(r => `
          <div class="ao-room ${r.state}">
            <span class="ao-rm-ic">${ico(MODE_ICO[r.mode] || 'trophy')}</span>
            <span class="ao-rm-tx"><b>${esc(r.name)}${r.priv ? ico('lock') : ''}</b><small>${esc(MODES[r.mode] || '')} · ${esc(r.what)} · host ${esc(r.host)}</small></span>
            <span class="ao-rm-n">${r.n}/${r.max}</span>
            <button class="btn ${r.state === 'open' ? '' : 'ghost'}" data-room="${r.code}" data-priv="${r.priv ? 1 : 0}" ${r.state === 'open' ? '' : 'disabled'}>${r.state === 'open' ? 'Join' : r.state === 'playing' ? 'Playing' : r.state === 'full' ? 'Full' : 'Locked'}</button>
          </div>`).join('') : `<p class="ao-empty">${Net.state === 'up' ? 'No rooms open right now. Host one, or take a Quick match.' : 'Connecting to the lobby…'}</p>`;
        list.querySelectorAll('[data-room]').forEach(b => b.onclick = () => {
          if (b.dataset.priv === '1') askPass(b.dataset.room); else Online.join(b.dataset.room, '');
        });
      } else if (tab === 'players') {
        const S = Auth.S, ps = [...Net.players.values()].filter(p => p.id !== Auth.id && !S.blocked[p.id])
          .sort((a, b) => (S.friends[b.id] ? 1 : 0) - (S.friends[a.id] ? 1 : 0) || a.n.localeCompare(b.n));
        list.innerHTML = ps.length ? ps.map(p => rowHtml(p.id, p.n, (S.friends[p.id] ? 'Friend · ' : '') + (p.x || 'Online') + ' · Lv ' + p.lv, true,
          p.rm ? `<button class="btn ghost" data-jr="${p.rm}">Join room</button>` : '')).join('') : `<p class="ao-empty">${Net.state === 'up' ? 'Nobody else is online right now.' : 'Connecting…'}</p>`;
        list.querySelectorAll('[data-jr]').forEach(b => b.onclick = () => Online.join(b.dataset.jr, ''));
        wireCards(list);
      } else {
        const top = [...Net.profiles.values()].filter(p => p.g > 0).sort((a, b) => b.r - a.r).slice(0, 30);
        list.innerHTML = top.length ? `<div class="ao-top">${top.map((p, i) => `
          <button class="ao-trow" data-card="${esc(p.id)}"><em>${i + 1}</em>${face(p.fav)}<span><b>${esc(p.n)}<i>${tagOf(p.id)}</i></b><small>Lv ${p.lv} · ${p.w}-${p.l} online · ${p.tw} tournaments won</small></span><strong>${p.r}</strong></button>`).join('')}</div>`
          : `<p class="ao-empty">No one has played an online battle yet. Rated battles move you up the board.</p>`;
        wireCards(list);
      }
      A.paintAll(list);
    };
    const drawChat = () => {
      const S = Auth.S;
      const atEnd = log.scrollTop + log.clientHeight >= log.scrollHeight - 30;
      log.innerHTML = Net.chat.filter(c => !S.blocked[c.f]).map(c => `<p class="${c.f === Auth.id ? 'me' : ''}"><button data-card="${esc(c.f)}">${esc(c.n)}</button><span>${esc(Social.shown(c.x))}</span><small>${U.time(c.t)}</small></p>`).join('')
        || `<p class="ao-empty">${Net.state === 'up' ? 'Nothing said yet. Say hello!' : 'Connecting…'}</p>`;
      wireCards(log);
      if (atEnd) log.scrollTop = 1e6;
    };
    const drawNet = () => { netEl.innerHTML = netLine(); };
    const offs = [Net.on('rooms', () => tab === 'rooms' && drawList()), Net.on('players', () => { if (tab === 'players') drawList(); drawNet(); }), Net.on('profiles', () => tab === 'top' && drawList()),
      Net.on('chat', drawChat), Net.on('state', () => { drawNet(); drawList(); drawChat(); })];
    const alive = setInterval(() => { if (!ov.isConnected || !ov.querySelector('.ao-list')) { clearInterval(alive); offs.forEach(f => f()); } }, 1000);
    drawList(); drawChat(); drawNet(); log.scrollTop = 1e6;
    A.autoFocus();
  };
  function askPass(code) {
    const body = document.createElement('div');
    body.innerHTML = `<label class="ao-f"><span>Password</span><input class="ao-in" maxlength="12" spellcheck="false"></label>`;
    const inp = body.querySelector('input');
    const m = modal({ title: 'Private room', icon: 'lock', body, buttons: [['Join', () => Online.join(code, inp.value.trim().toUpperCase()), ''], ['Cancel', null, 'ghost']] });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { m.close(); Online.join(code, inp.value.trim().toUpperCase()); } });
    setTimeout(() => inp.focus(), 40);
  }
  /* what a quick match is for */
  function quickForm() {
    modal({ title: 'Quick match', icon: 'bolt', body: `<p class="adv-note">Into an open room of the kind you pick (or a new one of yours, if none is open).</p>`,
      buttons: Object.keys(MODES).map(k => [ico(MODE_ICO[k]) + MODES[k], () => Online.quick(k), '']).concat([['Cancel', null, 'ghost']]) });
  }
  function hostForm() {
    const o = { mode: 'battle', priv: false, listed: true, name: Auth.name + '\'s room' };
    const body = document.createElement('div');
    const draw = () => {
      body.innerHTML = `
        <label class="ao-f"><span>Room name</span><input class="ao-in" data-n maxlength="24" value="${esc(o.name)}"></label>
        <div class="ao-seg-row"><span>For</span><div class="seg adv-seg">${Object.keys(MODES).map(k => `<button data-m="${k}" class="${o.mode === k ? 'sel' : ''}">${MODES[k]}</button>`).join('')}</div></div>
        <div class="ao-seg-row"><span>Who can join</span><div class="seg adv-seg">
          <button data-p="open" class="${!o.priv && o.listed ? 'sel' : ''}">Anyone (listed)</button>
          <button data-p="priv" class="${o.priv ? 'sel' : ''}">Password</button>
          <button data-p="code" class="${!o.priv && !o.listed ? 'sel' : ''}">Code only</button></div></div>
        <p class="adv-note">${o.mode === 'battle' ? 'Up to four fighters: players, and CPUs in the seats nobody takes.' : o.mode === 'race' ? 'Up to eight runners race through a zone\'s first Act, each in their own copy, the others shown as ghosts.' : o.mode === 'gp' ? 'The grand prix: four courses of a cup, eight runners (CPUs in the places nobody takes), Red Ring powers, points and a podium.' : o.mode === 'story' ? 'Up to three: your episode\'s chapters, the others fighting beside you.' : 'A bracket of 8 or 16; up to eight players, CPUs in the other places.'}</p>`;
      body.querySelector('[data-n]').oninput = e => { o.name = e.target.value; };
      body.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { o.mode = b.dataset.m; draw(); });
      body.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { o.priv = b.dataset.p === 'priv'; o.listed = b.dataset.p !== 'code'; draw(); });
    };
    draw();
    modal({ title: 'Host a room', icon: 'flag', body, buttons: [['Open the room', () => Online.host(Object.assign({}, o, { arena: A.randomArena() })), ''], ['Cancel', null, 'ghost']] });
  }

  /* ---------------------------------------------------- A ROOM */
  /* the settings: [key, label, choices (value, text)] by mode; arrows for the long lists */
  function settings(R) {
    const zones = (A.openZones ? A.openZones() : A.zones()).map(z => [z.i, z.name]);         // (the arenas of the zones the host has opened)
    if (R.mode === 'race') return [['zone', 'Zone (Act 1)', zones, 'arrows']];
    if (R.mode === 'gp') return [['gpCup', 'Cup', (A.gpCups ? A.gpCups() : []).map((c, i) => [i, c]), 'arrows'], ['gpCls', 'Class', [['breeze', 'Breeze'], ['gale', 'Gale'], ['storm', 'Storm']]]];
    if (R.mode === 'story') {
      const eps = A.eps().filter(x => !A.hasFighter || A.hasFighter(x.who)), e = eps.find(x => x.who === R.ep) || eps[0];
      const upTo = Math.min(e.chapters.length, (A.epDone(e.who) || 0) + 1);
      return [['ep', 'Episode', eps.map(x => [x.who, x.name + ': ' + x.title]), 'arrows'],
              ['ch', 'Chapter', e.chapters.slice(0, upTo).map((t, i) => [i, (i + 1) + '. ' + t]), 'arrows']];
    }
    if (R.mode === 'tourney') return [['size', 'Places', A.can16 && !A.can16() ? [[8, '8']] : [[8, '8'], [16, '16']]], ['tlvl', 'CPUs', [[0, 'Easy'], [1, 'Normal'], [2, 'Hard']]],
      ['tgoal', 'Lives a match', [[1, '1'], [2, '2'], [3, '3']]], ['tarena', 'Arena', [[-1, 'A new one every match']].concat(zones), 'arrows']];
    const players = R.members.length;
    return [['arena', 'Arena', zones, 'arrows'], ['rule', 'Rule', [['stock', 'Survival'], ['ko', 'KOs']]],
      ['goal', R.rule === 'stock' ? 'Lives' : 'KOs to win', [[1, '1'], [2, '2'], [3, '3'], [5, '5']]], ['time', 'Time', [[0, 'None'], [120, '2 min'], [180, '3 min'], [300, '5 min']]],
      ['hp', 'Health', [[150, '150'], [200, '200'], [250, '250']]], ['teams', 'Sides', [[false, 'Everyone for themselves'], [true, 'Red vs Blue']]],
      ['cpu', 'CPUs', [0, 1, 2, 3].filter(n => n + players <= 4 && n + players >= 2).map(n => [n, String(n)])], ['lvl', 'CPU level', [[0, 'Easy'], [1, 'Normal'], [2, 'Hard']]]];
  }
  AO.room = () => {
    if (!N || !N.room) { AO.lobby(); return; }
    const ov = A.screen('room');
    const draw = () => {
      if (!N || !N.room) return;
      if (A.np.active()) return;
      const R = N.room, me = memberOf(N.myId) || {}, host = N.host, S = Auth.S;
      const chatOn = R.chat !== 'off';
      ov.innerHTML = `
        <div class="ao-page pop">
          <div class="ao-head">
            <button class="btn ghost" data-leave data-back>${ico('back')}Leave</button>
            <h2>${ico(MODE_ICO[R.mode])}${esc(R.name)}</h2>
            <span class="ao-code">${R.priv ? ico('lock') + 'Password ' + esc(N.pass || '') + ' · ' : ''}Code <b>${R.code}</b></span>
          </div>
          <div class="ao-grid3">
            <div class="panel ao-mem">
              <div class="panel-hd">${ico('person')}Players ${R.members.length}/${R.max}</div>
              <div class="ao-mlist">${R.members.map(m => `
                <div class="ao-mrow ${m.ready || m.host ? 'ready' : ''} ${R.teams && R.mode === 'battle' ? 'team' + m.team : ''}">
                  <canvas class="ao-face" width="44" height="40" data-face="${esc(m.who === 'random' ? 'sonic' : m.who)}"></canvas>
                  <span><b>${m.host ? ico('crown') : ''}${esc(m.name)}${pingBars(m)}</b><small>${esc(m.who === 'random' ? 'Random' : A.castName(m.who))} · Lv ${m.lv}</small></span>
                  <em>${m.host ? 'Host' : m.ready ? 'Ready' : 'Not ready'}</em>
                  ${host && !m.host ? `<button class="ao-mini" data-kick="${m.id}" title="Remove">${ico('close')}</button>` : ''}
                </div>`).join('')}</div>
              <div class="ao-pick">
                <button class="adv-arr" data-pk="-1" aria-label="Previous">${ico('back')}</button>
                <canvas class="ao-face lg" width="88" height="80" data-face="${esc(me.who === 'random' || !me.who ? 'sonic' : me.who)}"></canvas>
                <span><small>Your fighter</small><b>${esc(me.who === 'random' ? 'Random' : A.castName(me.who || 'sonic'))}</b></span>
                <button class="adv-arr" data-pk="1" aria-label="Next">${ico('next')}</button>
              </div>
              ${R.teams && R.mode === 'battle' ? `<div class="ao-seg-row"><span>Your side</span><div class="seg adv-seg"><button data-tm="0" class="${me.team === 0 ? 'sel' : ''}">Red</button><button data-tm="1" class="${me.team === 1 ? 'sel' : ''}">Blue</button></div></div>` : ''}
              <div class="adv-btns">
                ${host ? `<button class="btn lg" data-start data-focus>${ico('flag')}Start</button>` : `<button class="btn lg" data-ready data-focus>${ico('check')}${me.ready ? 'Not ready' : 'Ready'}</button>`}
                <button class="btn ghost" data-inv>${ico('mail')}Invite a friend</button>
              </div>
            </div>
            <div class="panel ao-set">
              <div class="panel-hd">${ico('gear')}${esc(MODES[R.mode])}</div>
              ${host ? `<div class="ao-seg-row"><span>For</span><div class="seg adv-seg">${Object.keys(MODES).map(k => `<button data-mode="${k}" class="${R.mode === k ? 'sel' : ''}">${MODES[k]}</button>`).join('')}</div></div>` : ''}
              ${settings(R).map(([k, label, opts, kind]) => {
                const cur = opts.find(o => String(o[0]) === String(R[k])) || opts[0] || ['', '-'];
                if (!host) return `<div class="ao-seg-row"><span>${label}</span><b class="ao-val">${esc(cur[1])}</b></div>`;
                if (kind === 'arrows') return `<div class="ao-seg-row"><span>${label}</span><div class="adv-pick"><button class="adv-arr" data-ar="${k}" data-d="-1">${ico('back')}</button><b>${esc(cur[1])}</b><button class="adv-arr" data-ar="${k}" data-d="1">${ico('next')}</button></div></div>`;
                return `<div class="ao-seg-row"><span>${label}</span><div class="seg adv-seg">${opts.map(o => `<button data-set="${k}" data-v="${esc(JSON.stringify(o[0]))}" class="${String(o[0]) === String(R[k]) ? 'sel' : ''}">${esc(o[1])}</button>`).join('')}</div></div>`;
              }).join('')}
              ${host ? `<div class="ao-seg-row"><span>Room</span><div class="seg adv-seg"><button data-lock class="${R.locked ? 'sel' : ''}">${R.locked ? 'Locked' : 'Lock'}</button><button data-chatoff class="${R.chat === 'off' ? 'sel' : ''}">${R.chat === 'off' ? 'Chat off' : 'Chat on'}</button></div></div>` : ''}
              <p class="adv-note">${R.mode === 'battle' ? 'CPUs fill the seats nobody takes.' : R.mode === 'race' ? 'First to the goal post wins. Everyone runs their own copy of the Act; the others are ghosts.' : R.mode === 'gp' ? 'Four races, 9-6-3-1 points for the first four, CPUs in the empty places. Powers hit the other players too.' : R.mode === 'story' ? 'The host plays the episode\'s hero; everyone else fights beside them, and runs the stages alongside.' : 'A knock-out bracket. Matches between CPUs are settled at once; everyone watches the players\' matches.'}</p>
            </div>
            <div class="panel ao-rchat">
              <div class="panel-hd">${ico('chat')}Room chat</div>
              <div class="ao-log">${(N.chat || []).map(c => c.sys ? `<p class="sys">${esc(c.sys)}</p>` : `<p><button data-card="${esc(c.id)}">${esc(c.n)}</button><span>${esc(Social.shown(c.x))}</span></p>`).join('') || '<p class="ao-empty">The room chat.</p>'}</div>
              <div class="ao-quick">${QUICK.map((q, i) => `<button data-qk="${i}">${esc(q)}</button>`).join('')}</div>
              ${chatOn || host ? `<form class="ao-send"><input class="ao-in" maxlength="160" placeholder="Say something…" autocomplete="off"><button class="btn">Send</button></form>` : '<p class="ao-empty">The host has turned typed chat off.</p>'}
            </div>
          </div>
        </div>`;
      A.paintAll(ov);
      const q = s => ov.querySelector(s);
      q('[data-leave]').onclick = () => Online.leave();
      if (q('[data-start]')) q('[data-start]').onclick = () => {
        const notReady = R.members.filter(m => !m.host && !m.ready);
        if (notReady.length) modal({ title: 'Start anyway?', icon: 'flag', body: `<p class="adv-note">${esc(notReady.map(m => m.name).join(', '))} ${notReady.length > 1 ? 'aren\'t' : 'isn\'t'} ready yet.</p>`, buttons: [['Start', () => Online.start(), ''], ['Wait', null, 'ghost']] });
        else Online.start();
      };
      if (q('[data-ready]')) q('[data-ready]').onclick = () => toHost({ t: 'ready', on: !me.ready });
      q('[data-inv]').onclick = () => inviteForm();
      ov.querySelectorAll('[data-pk]').forEach(b => b.onclick = () => {
        const ids = A.cast().map(c => c.id).filter(id => !A.hasFighter || A.hasFighter(id)).concat(['random']), i = ids.indexOf(me.who), who = ids[(i + (+b.dataset.pk) + ids.length) % ids.length];   // (your team)
        A.setCast(who === 'random' ? A.castId() : who);
        toHost({ t: 'pick', who, em: A.emerlLoadout() });
      });
      ov.querySelectorAll('[data-tm]').forEach(b => b.onclick = () => toHost({ t: 'team', tm: +b.dataset.tm }));
      ov.querySelectorAll('[data-kick]').forEach(b => b.onclick = () => { const m = memberOf(b.dataset.kick); if (m) modal({ title: 'Remove ' + m.name + '?', icon: 'close', buttons: [['Remove', () => Online.kick(m.id), ''], ['Remove and block', () => Online.block(m.id), 'ghost'], ['Cancel', null, 'ghost']] }); });
      ov.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => Online.set('mode', b.dataset.mode));
      ov.querySelectorAll('[data-set]').forEach(b => b.onclick = () => Online.set(b.dataset.set, JSON.parse(b.dataset.v)));
      ov.querySelectorAll('[data-ar]').forEach(b => b.onclick = () => {
        const k = b.dataset.ar, opts = settings(R).find(s => s[0] === k)[2], i = opts.findIndex(o => String(o[0]) === String(R[k]));
        const v = opts[(i + (+b.dataset.d) + opts.length) % opts.length][0];
        Online.set(k, v); if (k === 'ep') Online.set('ch', 0);
      });
      if (q('[data-lock]')) q('[data-lock]').onclick = () => Online.set('locked', !R.locked);
      if (q('[data-chatoff]')) q('[data-chatoff]').onclick = () => Online.set('chat', R.chat === 'off' ? 'on' : 'off');
      ov.querySelectorAll('[data-qk]').forEach(b => b.onclick = () => Online.say(QUICK[+b.dataset.qk]));
      const form = q('.ao-send');
      if (form) { const inp = form.querySelector('input'); form.onsubmit = e => { e.preventDefault(); Online.say(inp.value); inp.value = ''; setTimeout(() => { const i2 = ov.querySelector('.ao-send input'); if (i2) i2.focus(); }, 60); }; }
      const log = q('.ao-log'); log.scrollTop = 1e6;
      wireCards(ov);
    };
    redraw = () => { if (ov.isConnected && N && N.room && A.where() === 'room') { const typing = document.activeElement && document.activeElement.closest && document.activeElement.closest('.ao-send'); const val = typing ? document.activeElement.value : null; draw(); if (typing) { const i2 = ov.querySelector('.ao-send input'); if (i2) { i2.value = val; i2.focus(); } } } };
    draw(); A.autoFocus();
  };
  function inviteForm() {
    const S = Auth.S, ids = Object.keys(S.friends).filter(id => Net.online(id));
    const body = document.createElement('div');
    body.innerHTML = ids.length ? ids.map(id => rowHtml(id, S.friends[id].n, Social.statusOf(id).text, true, `<button class="btn" data-iv="${id}">Invite</button>`)).join('')
      : `<p class="ao-empty">None of your friends is online right now. Share the room code instead: <b>${esc(N.room.code)}</b>${N.pass ? ' (password ' + esc(N.pass) + ')' : ''}.</p>`;
    const m = modal({ title: 'Invite a friend', icon: 'mail', body, buttons: [['Done', null, 'ghost']] });
    body.querySelectorAll('[data-iv]').forEach(b => b.onclick = () => { Online.invite(b.dataset.iv); b.disabled = true; b.textContent = 'Sent'; });
    wireCards(body); A.paintAll(body);
    return m;
  }
  AO.backToRoom = () => { if (N && N.room) { if (!N.host) toHost({ t: 'back' }); AO.room(); } else AO.lobby(); };
  AO.inRoom = () => Online.inRoom();

  /* ---------------------------------------------------- FRIENDS */
  AO.friends = tab => {
    if (!Auth.user) return;
    tab = tab || AO._ftab || 'friends'; AO._ftab = tab;
    const S = Auth.S, ov = A.screen('friends');
    const nIn = Object.keys(S.reqIn).length, onlineN = Object.keys(S.friends).filter(id => Net.online(id)).length;
    ov.innerHTML = `
      <div class="ao-page pop narrow">
        <div class="ao-head"><button class="btn ghost" data-back>${ico('back')}Back</button><h2>${ico('person')}Friends</h2><span class="ao-net">${netLine()}</span></div>
        <div class="panel">
          ${tabsHtml([['friends', 'Friends ' + onlineN + '/' + Object.keys(S.friends).length], ['requests', 'Requests' + (nIn ? ' (' + nIn + ')' : '')], ['add', 'Add friend'], ['blocked', 'Blocked']], tab)}
          <div class="ao-list"></div>
        </div>
      </div>`;
    ov.querySelector('[data-back]').onclick = () => AO.back();
    ov.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => AO.friends(b.dataset.tab));
    const list = ov.querySelector('.ao-list');
    const draw = () => {
      if (!list.isConnected) { offs.forEach(f => f()); return; }
      if (tab === 'friends') {
        const ids = Object.keys(S.friends).sort((a, b) => (Net.online(b) ? 1 : 0) - (Net.online(a) ? 1 : 0) || S.friends[a].n.localeCompare(S.friends[b].n));
        list.innerHTML = ids.length ? ids.map(id => {
          const st = Social.statusOf(id), c = S.convos[id];
          return rowHtml(id, S.friends[id].n, st.text, st.on,
            `<button class="btn ghost" data-dm="${id}">${ico('mail')}${c && c.unread ? c.unread : ''}</button>${st.on ? `<button class="btn" data-ch="${id}">Challenge</button>` : ''}${st.rm ? `<button class="btn ghost" data-jr="${st.rm}">Join</button>` : ''}${st.on && Online.inRoom() ? `<button class="btn ghost" data-iv="${id}">Invite</button>` : ''}`);
        }).join('') : `<p class="ao-empty">No friends yet. Add someone by their friend code under Add friend, or from a player card in the online lobby.</p>`;
      } else if (tab === 'requests') {
        const ins = Object.keys(S.reqIn), outs = Object.keys(S.reqOut);
        list.innerHTML = (!ins.length && !outs.length ? `<p class="ao-empty">No requests right now.</p>` : '') +
          (ins.length ? `<h3 class="ao-h3">For you</h3>` + ins.map(id => rowHtml(id, S.reqIn[id].n, 'Wants to be friends · ' + U.ago(S.reqIn[id].t), !!Net.online(id),
            `<button class="btn" data-acc="${id}">Accept</button><button class="btn ghost" data-dec="${id}">Decline</button>`)).join('') : '') +
          (outs.length ? `<h3 class="ao-h3">Sent</h3>` + outs.map(id => rowHtml(id, S.reqOut[id].n, 'Waiting for them · sent ' + U.ago(S.reqOut[id].t), !!Net.online(id),
            `<button class="btn ghost" data-can="${id}">Cancel</button>`)).join('') : '');
      } else if (tab === 'add') {
        list.innerHTML = `
          <div class="ao-mycode"><small>Your friend code</small><b>${esc(Auth.name)}${tagOf(Auth.id)}</b><button class="btn ghost" data-copy>Copy</button></div>
          <form class="ao-search"><input class="ao-in" placeholder="Name#TAG (or just a name)" maxlength="24" value="${esc(AO._q || '')}" spellcheck="false"><button class="btn">Search</button></form>
          <div class="ao-res"></div>
          <h3 class="ao-h3">Online now</h3>
          <div class="ao-others"></div>`;
        const qi = list.querySelector('.ao-search input'), res = list.querySelector('.ao-res');
        const search = () => {
          AO._q = qi.value; res.innerHTML = '';
          if (!qi.value.trim()) return;
          const found = Net.find(qi.value);
          res.innerHTML = found.length ? found.map(p => { const st = Social.statusOf(p.id); return rowHtml(p.id, p.n, st.text, st.on,
            S.friends[p.id] ? `<em class="ao-pill">Friends</em>` : S.reqOut[p.id] ? `<em class="ao-pill">Requested</em>` : `<button class="btn" data-add="${p.id}" data-n="${esc(p.n)}">Add friend</button>`); }).join('')
            : `<p class="ao-empty">${Net.state === 'up' ? 'Nobody by that name has been seen online. Check the spelling and the #TAG, or ask them to go online.' : 'You\'re not connected, so nobody can be found.'}</p>`;
          wire(res); A.paintAll(res);
        };
        list.querySelector('.ao-search').onsubmit = e => { e.preventDefault(); search(); };
        list.querySelector('[data-copy]').onclick = () => { try { navigator.clipboard.writeText(Auth.name + tagOf(Auth.id)); toast('Copied. Send it to a friend.'); } catch (e) { /* fine */ } };
        const others = [...Net.players.values()].filter(p => p.id !== Auth.id && !S.friends[p.id] && !S.blocked[p.id]).slice(0, 30);
        list.querySelector('.ao-others').innerHTML = others.length ? others.map(p => rowHtml(p.id, p.n, p.x || 'Online', true,
          S.reqOut[p.id] ? `<em class="ao-pill">Requested</em>` : `<button class="btn" data-add="${p.id}" data-n="${esc(p.n)}">Add</button>`)).join('')
          : `<p class="ao-empty">${Net.state === 'up' ? 'Nobody else is online right now.' : 'Not connected.'}</p>`;
        if (qi.value) search();
        setTimeout(() => qi.focus(), 40);
      } else {
        const ids = Object.keys(S.blocked);
        list.innerHTML = ids.length ? ids.map(id => rowHtml(id, S.blocked[id], 'Blocked', false, `<button class="btn ghost" data-unb="${id}">Unblock</button>`)).join('') : `<p class="ao-empty">You haven't blocked anyone.</p>`;
      }
      wire(list); A.paintAll(list);
    };
    const wire = el => {
      const on = (sel, fn) => el.querySelectorAll(sel).forEach(b => b.onclick = () => fn(b));
      on('[data-dm]', b => AO.messages(b.dataset.dm));
      on('[data-ch]', b => challengeForm(b.dataset.ch));
      on('[data-jr]', b => Online.join(b.dataset.jr, ''));
      on('[data-iv]', b => Online.invite(b.dataset.iv));
      on('[data-acc]', b => Social.accept(b.dataset.acc));
      on('[data-dec]', b => Social.decline(b.dataset.dec));
      on('[data-can]', b => Social.cancel(b.dataset.can));
      on('[data-add]', b => { Social.add(b.dataset.add, b.dataset.n); b.disabled = true; b.textContent = 'Requested'; });
      on('[data-unb]', b => Social.unblock(b.dataset.unb));
      wireCards(el);
    };
    const offs = tab === 'add' ? [] : [Social.on('change', draw), Net.on('players', draw), Net.on('profiles', draw)];
    draw(); A.autoFocus();
  };
  /* where Back goes from Friends and Messages: the room, the lobby, or the main menu */
  AO.back = () => { if (Online.inRoom()) AO.room(); else if (AO._from === 'lobby') AO.lobby(); else A.mainMenu(); };

  /* ---------------------------------------------------- MESSAGES */
  AO.messages = id => {
    if (!Auth.user) return;
    const S = Auth.S, want = id && id !== Auth.id ? id : null;
    if (want) Social.convo(want);
    Social.openConvo = want;
    const ov = A.screen('msgs');
    ov.innerHTML = `
      <div class="ao-page pop narrow">
        <div class="ao-head"><button class="btn ghost" data-back>${ico('back')}Back</button><h2>${ico('mail')}Messages</h2><span class="ao-net">${netLine()}</span></div>
        <div class="panel ao-msgs ${want ? 'has' : ''}"><div class="ao-convs"></div><div class="ao-thread"></div></div>
      </div>`;
    ov.querySelector('[data-back]').onclick = () => { Social.openConvo = null; if (want && innerWidth < 760) AO.messages(); else AO.back(); };
    const list = ov.querySelector('.ao-convs'), thread = ov.querySelector('.ao-thread');
    const tick = st => ({ sending: '…', queued: '◷', sent: '✓', got: '✓✓', failed: '!' })[st] || '';
    const drawList = () => {
      const ids = Object.keys(S.convos).filter(k => S.convos[k].msgs.length || k === want)
        .sort((a, b) => ((S.convos[b].msgs.slice(-1)[0] || {}).t || Date.now()) - ((S.convos[a].msgs.slice(-1)[0] || {}).t || Date.now()));
      list.innerHTML = `<button class="btn ghost ao-wide" data-new>${ico('mail')}New message</button>` + (ids.length ? ids.map(k => {
        const c = S.convos[k], last = c.msgs.slice(-1)[0];
        return `<button class="ao-conv ${k === want ? 'on' : ''} ${c.unread ? 'unread' : ''}" data-cv="${esc(k)}">${face(favOf(k))}<i class="ao-dot ${Net.online(k) ? 'up' : 'off'}"></i>
          <span><b>${esc(c.n)}</b><small>${last ? (last.me ? 'You: ' : '') + esc(Social.shown(last.x).slice(0, 40)) : 'New conversation'}</small></span>${c.unread ? `<i class="ao-badge">${c.unread}</i>` : ''}</button>`;
      }).join('') : `<p class="ao-empty">No messages yet.</p>`);
      list.querySelector('[data-new]').onclick = pickFriend;
      list.querySelectorAll('[data-cv]').forEach(b => b.onclick = () => AO.messages(b.dataset.cv));
      A.paintAll(list);
    };
    const drawThread = () => {
      if (!want) { thread.innerHTML = `<p class="ao-empty">Pick a conversation, or start a new one.</p>`; return; }
      const c = Social.convo(want), st = Social.statusOf(want), blocked = S.blocked[want];
      c.unread = 0; Auth.save();
      let lastDay = '';
      const msgs = c.msgs.map(m => {
        const d = new Date(m.t).toDateString(); let day = '';
        if (d !== lastDay) { lastDay = d; day = `<div class="ao-day">${d === new Date().toDateString() ? 'Today' : new Date(m.t).toLocaleDateString()}</div>`; }
        return day + `<div class="ao-bub ${m.me ? 'me' : 'them'} ${m.st === 'failed' ? 'failed' : ''}" title="${esc(m.why || '')}">${esc(Social.shown(m.x))}<small>${U.time(m.t)}${m.me ? ' ' + tick(m.st) : ''}</small></div>`;
      }).join('');
      thread.innerHTML = `
        <div class="ao-thead"><button class="ao-who-b" data-card="${esc(want)}">${face(favOf(want))}<span><b>${esc(c.n)}<i>${tagOf(want)}</i></b><small>${esc(st.text)}</small></span></button>
          ${st.on && !blocked ? `<button class="btn" data-ch>${ico('trophy')}Challenge</button>` : ''}</div>
        <div class="ao-tmsgs">${msgs || `<p class="ao-empty">Say hi to ${esc(c.n)}!${st.on ? '' : ' They\'re offline: your message will wait for them.'}</p>`}</div>
        ${blocked ? `<p class="ao-empty">You've blocked this player. <button class="btn ghost" data-unb>Unblock</button></p>` : `<form class="ao-send"><input class="ao-in" maxlength="${Social.MSG_MAX}" placeholder="Write a message…" autocomplete="off"><button class="btn">Send</button></form>`}`;
      const box = thread.querySelector('.ao-tmsgs'); box.scrollTop = 1e6;
      const form = thread.querySelector('.ao-send');
      if (form) { const inp = form.querySelector('input'); form.onsubmit = e => { e.preventDefault(); if (!inp.value.trim()) return; Social.dm(want, inp.value); inp.value = ''; }; }
      if (thread.querySelector('[data-ch]')) thread.querySelector('[data-ch]').onclick = () => challengeForm(want);
      if (thread.querySelector('[data-unb]')) thread.querySelector('[data-unb]').onclick = () => Social.unblock(want);
      wireCards(thread); A.paintAll(thread);
    };
    const pickFriend = () => {
      const ids = Object.keys(S.friends);
      const body = document.createElement('div');
      body.innerHTML = ids.length ? ids.map(k => rowHtml(k, S.friends[k].n, Social.statusOf(k).text, !!Net.online(k), `<button class="btn" data-to="${k}">Write</button>`)).join('')
        : `<p class="ao-empty">Add friends first (or open someone's player card in the lobby).</p>`;
      const m = modal({ title: 'New message', icon: 'mail', body, buttons: [['Cancel', null, 'ghost']] });
      body.querySelectorAll('[data-to]').forEach(b => b.onclick = () => { m.close(); AO.messages(b.dataset.to); });
      A.paintAll(body);
    };
    const draw = () => {
      if (!list.isConnected) { offs.forEach(f => f()); Social.openConvo = null; return; }
      const typing = document.activeElement && document.activeElement.closest && document.activeElement.closest('.ao-send');
      const val = typing ? document.activeElement.value : null;
      drawList(); drawThread();
      if (typing) { const i = ov.querySelector('.ao-send input'); if (i) { i.value = val; i.focus(); } }
    };
    const offs = [Social.on('change', draw), Net.on('players', draw)];
    draw(); Social.emit('change');
    if (want) setTimeout(() => { const i = ov.querySelector('.ao-send input'); if (i) i.focus(); }, 60);
  };

  /* ---------------------------------------------------- PLAYER CARD */
  AO.card = id => {
    if (!Auth.user || !id) return;
    const S = Auth.S, me = id === Auth.id;
    const pr = Net.profiles.get(id) || {}, pl = Net.online(id) || {}, name = me ? Auth.name : Net.nameOf(id);
    const P = me ? Net.myProfile() : pr;
    const r = me ? S.rank.rating : pl.r || pr.r || 1000, lv = me ? Auth.lv() : pl.lv || pr.lv || 1;
    const st = me ? { on: Net.state === 'up', text: 'This is you' } : Social.statusOf(id);
    const fr = S.friends[id], blk = S.blocked[id], out = S.reqOut[id], inc = S.reqIn[id];
    const B = [];
    if (!me) {
      if (blk) B.push(['Unblock', () => Social.unblock(id), 'ghost']);
      else {
        if (inc) B.push(['Accept request', () => Social.accept(id), '']);
        else if (!fr && !out) B.push(['Add friend', () => Social.add(id, name), '']);
        if (fr || S.prefs.dmFrom === 'everyone') B.push([ico('mail') + 'Message', () => AO.messages(id), fr ? '' : 'ghost']);
        if (st.on) B.push([ico('trophy') + 'Challenge', () => challengeForm(id), '']);
        if (st.rm) B.push(['Join their room', () => Online.join(st.rm, ''), 'ghost']);
        if (Online.inRoom() && st.on) B.push(['Invite to my room', () => Online.invite(id), 'ghost']);
        if (fr) B.push(['Remove friend', () => Social.remove(id), 'ghost']);
        B.push(['Block', () => Social.block(id, name), 'ghost']);
      }
    }
    const fav = favOf(id);
    const M = modal({ title: me ? 'You' : 'Player', icon: 'person', cls: 'ao-card', buttons: B.length ? B : [['Close', null, 'ghost']],
      body: `
        <div class="ao-who">${me ? `<div class="ao-favpick"><button class="adv-arr" data-fv="-1" aria-label="Previous favourite">${ico('back')}</button>${face(fav, 88, 80)}<button class="adv-arr" data-fv="1" aria-label="Next favourite">${ico('next')}</button></div>` : face(fav, 88, 80)}<div><b>${esc(name)}<i>${tagOf(id)}</i></b><span><em class="ao-dot ${st.on ? 'up' : 'off'}"></em>${esc(st.text)}</span><em>Level ${lv} · Rating ${r}</em></div></div>
        <div class="ao-nums">
          <div><b>${P && P.b != null ? (P.bw || 0) + '/' + (P.b || 0) : '-'}</b><small>Battles won</small></div>
          <div><b>${P && P.k != null ? P.k : '-'}</b><small>KOs</small></div>
          <div><b>${P && P.tw != null ? P.tw : '-'}</b><small>Tournaments won</small></div>
          <div><b>${P && P.rw != null ? P.rw : '-'}</b><small>Races won</small></div>
          <div class="${me ? 'ao-favn' : ''}"><b data-favname>${esc(A.castName(fav))}</b><small>${me ? 'Favourite: pick with the arrows' : 'Favourite'}</small></div>
        </div>
        ${fr ? `<p class="adv-note">Friends since ${new Date(fr.since).toLocaleDateString()}.</p>` : out ? `<p class="adv-note">Friend request sent. Waiting for them.</p>` : blk ? `<p class="adv-note">You've blocked this player.</p>` : ''}` });
    /* your own card: your favourite, picked from your team -- your picture for everyone */
    if (me) M.el.querySelectorAll('[data-fv]').forEach(b => b.onclick = () => {
      const team = A.cast().map(c => c.id).filter(x => !A.hasFighter || A.hasFighter(x)), cur = myFav();
      const nx = team[((team.indexOf(cur) < 0 ? 0 : team.indexOf(cur)) + (+b.dataset.fv) + team.length) % team.length];
      Auth.S.fav = nx; Auth.save();
      const cv = M.el.querySelector('.ao-favpick canvas'); cv.dataset.face = nx; A.paintAll(M.el.querySelector('.ao-favpick'));
      M.el.querySelector('[data-favname]').textContent = A.castName(nx);
      document.querySelectorAll('.ao-me canvas').forEach(c => { c.dataset.face = nx; }); document.querySelectorAll('.ao-me').forEach(el => A.paintAll(el));
      if (root.Net && Net.state === 'up') { Net.profile(); if (Net.presence) Net.presence(); }   // (the others see it at once)
    });
  };
  function challengeForm(id) {
    if (!Net.online(id)) { toast(Net.nameOf(id) + ' isn\'t online.', 'bad'); return; }
    const o = { mode: 'battle', arena: A.randomArena() };
    const body = document.createElement('div');
    const draw = () => {
      body.innerHTML = `
        <div class="ao-who">${face(favOf(id), 66, 54)}<div><b>${esc(Net.nameOf(id))}</b><span>${esc(Social.statusOf(id).text)}</span></div></div>
        <div class="ao-seg-row"><span>For</span><div class="seg adv-seg">${['battle', 'race', 'tourney'].map(k => `<button data-m="${k}" class="${o.mode === k ? 'sel' : ''}">${MODES[k]}</button>`).join('')}</div></div>
        <p class="adv-note">A private room opens for you both, and they get an invite.</p>`;
      body.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { o.mode = b.dataset.m; draw(); });
      A.paintAll(body);
    };
    draw();
    modal({ title: 'Challenge', icon: 'trophy', body, buttons: [['Send the invite', () => Online.challenge(id, o), ''], ['Cancel', null, 'ghost']] });
  }
  AO.where = () => A.where();
})(typeof globalThis !== 'undefined' ? globalThis : this);
