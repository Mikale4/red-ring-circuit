/* ============================================================================
   net/social.js -- FRIENDS, MESSAGES, challenges and room invites (the logic;
   from Wordle n' Friends and BLOCKADE). The screens are the game's own, in its
   Sonic look (adventure-online.js), which hands this file its toasts and
   prompts through Social.ui.

   FRIENDS: add someone by their friend code (Name#TAG), from the lobby, or
   from their player card. They get a request (in their inbox, kept on the
   relay until they're next online); once they accept you're friends on both
   sides: you see when they're online and what they're doing, can message,
   challenge and invite them, and join their public room.
   MESSAGES: one conversation per player, end-to-end encrypted (net.js). A
   message to someone offline waits on the relay. One tick = sent, two =
   their game has it. Options: messages from everyone, or friends only.
   BLOCK: their requests, messages, challenges and invites are dropped, and
   their lobby chat is hidden.
   Your friends list and messages are saved with your account, on this device.
   ========================================================================== */
(function () {
  'use strict';
  const MSG_MAX = 500;
  let inited = false;
  const S = () => Auth.S;
  const ui = () => Social.ui || {};
  const toast = (t, c) => { const f = ui().toast; if (f) return f(t, c); };
  const changed = () => { Auth.save(); Social.emit('change'); };

  const Social = window.Social = Object.assign(U.hub(), {
    MSG_MAX, ui: null, openConvo: null,
    init() {
      if (inited) return; inited = true;
      Net.on('inbox', got);
      Net.on('players', () => Social.emit('change'));
    },
    isFriend: id => !!(S() && S().friends[id]),
    blocked: id => !!(S() && S().blocked[id]),
    shown: t => (Auth.prefs.filter ? U.unswear(t) : t),
    tagOf: id => '#' + String(id).slice(0, 4).toUpperCase(),

    /* ------------------------------------------------------------ friends */
    async add(id, name) {
      const s = S(); if (id === Auth.id || s.friends[id]) return;
      if (s.reqIn[id]) return Social.accept(id);
      const r = await Net.send(id, 'freq', {});
      if (r.err) { toast(r.err, 'bad'); return; }
      s.reqOut[id] = { n: name || Net.nameOf(id), t: Date.now() }; changed();
      toast('Friend request sent to ' + s.reqOut[id].n + (r.queued ? ' (it goes out when you\'re back online)' : '') + '.', 'gold');
    },
    accept(id) {
      const s = S(), q = s.reqIn[id]; if (!q) return;
      s.friends[id] = { n: q.n, epk: q.epk, since: Date.now() }; delete s.reqIn[id]; changed();
      Net.send(id, 'facc', {}); toast('You and ' + q.n + ' are friends now.', 'gold');
    },
    decline(id) { const s = S(); if (!s.reqIn[id]) return; delete s.reqIn[id]; changed(); Net.send(id, 'fdec', {}); },
    cancel(id) { const s = S(); delete s.reqOut[id]; changed(); },
    remove(id) { const s = S(), f = s.friends[id]; if (!f) return; delete s.friends[id]; changed(); Net.send(id, 'frem', {}); toast('Removed ' + f.n + ' from your friends.'); },
    block(id, name) {
      const s = S(); name = name || Net.nameOf(id);
      if (s.friends[id]) { delete s.friends[id]; Net.send(id, 'frem', {}); }
      delete s.reqIn[id]; delete s.reqOut[id]; s.blocked[id] = name; changed();
      toast('Blocked ' + name + '.');
    },
    unblock(id) { const s = S(); delete s.blocked[id]; changed(); },

    /* ------------------------------------------------------------ messages */
    convo(id) { const s = S(); return s.convos[id] = s.convos[id] || { n: Net.nameOf(id), msgs: [], unread: 0 }; },
    async dm(id, text) {
      text = U.clean(text, MSG_MAX); if (!text) return;
      const c = Social.convo(id), m = { i: U.rid(8), me: true, x: text, t: Date.now(), st: 'sending' };
      c.msgs.push(m); trim(c); changed();
      const r = await Net.send(id, 'dm', { x: text }, true);
      m.st = r.err ? 'failed' : r.queued ? 'queued' : 'sent'; m.ni = r.i; if (r.err) m.why = r.err;
      changed();
      if (r.err) toast(r.err, 'bad');
    },
    unread() { return S() ? Object.values(S().convos).reduce((a, c) => a + (c.unread || 0), 0) : 0; },
    requests() { return S() ? Object.keys(S().reqIn).length : 0; },
    statusOf(id) {
      const p = Net.online(id); if (p) return { on: true, text: p.x || 'Online', rm: p.rm };
      const pr = Net.profiles.get(id); return { on: false, text: pr ? 'Last seen ' + U.ago(pr.t) : 'Offline' };
    },
  });
  const trim = c => { if (c.msgs.length > 300) c.msgs.splice(0, c.msgs.length - 300); };

  /* --------------------------------------------------------------- the inbox */
  function got(m) {
    const s = S(); if (!s) return;
    const known = s.friends[m.f];
    if (known) { known.n = m.n; if (m.epk) known.epk = m.epk; }
    switch (m.k) {
      case 'freq':
        if (s.friends[m.f]) { Net.send(m.f, 'facc', {}); break; }                         // (they lost their list: back on it)
        if (s.reqOut[m.f]) { s.friends[m.f] = { n: m.n, epk: m.epk, since: Date.now() }; delete s.reqOut[m.f]; Net.send(m.f, 'facc', {}); toast('You and ' + m.n + ' are friends now.', 'gold'); break; }
        s.reqIn[m.f] = { n: m.n, epk: m.epk, t: m.t };
        toast(m.n + ' sent you a friend request.', 'gold'); break;
      case 'facc':
        if (!s.reqOut[m.f] && !s.friends[m.f]) break;
        s.friends[m.f] = Object.assign(s.friends[m.f] || { since: Date.now() }, { n: m.n, epk: m.epk || (s.friends[m.f] || {}).epk });
        if (s.reqOut[m.f]) { delete s.reqOut[m.f]; toast(m.n + ' accepted your friend request!', 'gold'); }
        break;
      case 'fdec': delete s.reqOut[m.f]; break;
      case 'frem': delete s.friends[m.f]; break;
      case 'dm': {
        if (s.prefs.dmFrom === 'friends' && !s.friends[m.f]) break;
        const text = U.clean(m.b.x, MSG_MAX); if (!text) break;
        const c = Social.convo(m.f); c.n = m.n;
        if (c.msgs.some(x => x.ni === m.i)) break;
        c.msgs.push({ i: U.rid(8), ni: m.i, me: false, x: text, t: Math.min(m.t, Date.now()) }); c.msgs.sort((a, b) => a.t - b.t); trim(c);
        if (Social.openConvo !== m.f) {
          c.unread = (c.unread || 0) + 1;
          const f = ui().message; if (f) f(m.f, m.n, Social.shown(text));
        }
        Net.send(m.f, 'ack', { i: m.i });
        break;
      }
      case 'ack': for (const c of Object.values(s.convos)) for (const x of c.msgs) if (x.me && x.ni === m.b.i) x.st = 'got'; break;
      case 'chal': { const f = ui().challenged; if (f) f(m); break; }
      case 'chalx': { const f = ui().unchallenged; if (f) f(m); break; }
      case 'chalno': if (window.Online && Online.declined) Online.declined(m); break;
      case 'inv': { const f = ui().invited; if (f) f(m); break; }
    }
    changed();
  }
})();
