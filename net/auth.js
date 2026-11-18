/* ============================================================================
   net/auth.js -- accounts (kept in this browser), as in Wordle n' Friends and
   BLOCKADE. Signing up takes a name, a password (6 characters or more) and the
   password again.

   Accounts live in localStorage, so a password here is NOT a security boundary
   (anyone at this machine with devtools can read the save). Passwords are
   salted SHA-256 only so a reused one is never stored in the clear.

   Every account also gets an online identity, two key pairs made in the
   browser at sign-up (WebCrypto, P-256):
     a SIGNING key: everything you post online is signed with it, so nobody
       can post as you. Your player ID is a hash of its public half, and your
       TAG (the #A1B2 after your name) is the start of that ID.
     an ENCRYPTION key: messages and invites to you are encrypted to it.
   The private halves never leave this browser. The game's own progress (zones,
   story, Emerl's moves, the battle setup) is kept per account too, by
   adventure.js, under redringcircuit.save.<id>.

     Auth.list() register(u, pw, pw2, remember) login(u, pw, remember) resume()
     logout() save() remove(id) record(result)   Auth.user  Auth.S  Auth.id  Auth.tag
   ========================================================================== */
(function () {
  'use strict';
  const ACC = 'redringcircuit.accounts', SES = 'redringcircuit.session';
  const all = () => U.read(ACC, {}) || {};
  const norm = u => String(u || '').trim().toLowerCase();
  const subtle = window.crypto && crypto.subtle;
  function salt() { const b = new Uint8Array(16); crypto.getRandomValues(b); return U.hexb(b); }
  async function hash(pw, s) {
    const data = new TextEncoder().encode(s + '|' + pw);
    if (subtle) return U.hexb(await subtle.digest('SHA-256', data));
    let h = 0; for (const c of s + '|' + pw) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0; return 'weak:' + (h >>> 0).toString(16);
  }
  /* the player ID: the first 16 hex digits of SHA-256 over the signing key's public point */
  async function idOf(spk) { return U.hexb(await subtle.digest('SHA-256', new TextEncoder().encode(spk[0] + '.' + spk[1]))).slice(0, 16); }
  async function makeKeys() {
    const s = await subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
    const e = await subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey']);
    const ex = k => subtle.exportKey('jwk', k);
    return { sPriv: await ex(s.privateKey), sPub: await ex(s.publicKey), ePriv: await ex(e.privateKey), ePub: await ex(e.publicKey) };
  }
  const PREFS = { autoOnline: true, dmFrom: 'everyone', filter: false };
  function freshSave() {
    return {
      xp: 0,
      stats: { battles: 0, wins: 0, losses: 0, kos: 0, online: 0, onlineWins: 0, races: 0, raceWins: 0, tourneys: 0, tourneyWins: 0, fighters: {} },
      rank: { rating: 1000, games: 0, wins: 0, losses: 0, peak: 1000 },
      friends: {}, reqIn: {}, reqOut: {}, blocked: {}, convos: {}, seen: [],
      prefs: Object.assign({}, PREFS), created: Date.now(),
    };
  }
  function upgrade(a) {
    const f = freshSave(); for (const k in f) if (a.save[k] == null) a.save[k] = f[k];
    a.save.stats = Object.assign({}, f.stats, a.save.stats);
    a.save.prefs = Object.assign({}, PREFS, a.save.prefs);
    return a;
  }
  /* level from xp: each level needs a little more */
  function level(xp) {
    let lv = 1, need = 400, left = xp || 0;
    while (left >= need) { left -= need; lv++; need = 400 + (lv - 1) * 100; }
    return { lv, into: left, need };
  }
  const PW_MIN = 6;

  const Auth = window.Auth = {
    user: null, ready: !!subtle, PW_MIN,
    get S() { return Auth.user && Auth.user.save; },
    get id() { return Auth.user && Auth.user.id; },
    get tag() { return Auth.user ? Auth.user.id.slice(0, 4).toUpperCase() : ''; },
    get name() { return Auth.user ? Auth.user.user : ''; },
    get prefs() { return Auth.S ? Auth.S.prefs : PREFS; },
    idOf, level,
    lv() { return Auth.S ? level(Auth.S.xp).lv : 1; },
    list() { return Object.values(all()).sort((a, b) => (b.lastLogin || 0) - (a.lastLogin || 0)).map(a => ({ id: a.id, user: a.user, lastLogin: a.lastLogin, lv: level(a.save ? a.save.xp : 0).lv })); },
    count() { return Object.keys(all()).length; },
    checkName(u) {
      u = String(u || '').trim();
      if (u.length < 3) return 'A name needs at least 3 characters.';
      if (u.length > 16) return 'A name can be 16 characters at most.';
      if (!/^[a-zA-Z0-9_-]+$/.test(u)) return 'Letters, numbers, - and _ only (no spaces).';
      if (Object.values(all()).some(a => norm(a.user) === norm(u))) return 'That name is already an account on this device.';
      return null;
    },
    checkPassword(pw, pw2) {
      if (String(pw || '').length < PW_MIN) return 'The password needs at least ' + PW_MIN + ' characters.';
      if (pw2 != null && pw !== pw2) return 'The two passwords don\'t match.';
      return null;
    },
    async register(user, pw, pw2, remember) {
      if (!subtle) return { err: 'This browser can\'t make accounts on this page: it needs a secure page (https, or http://localhost).' };
      const e = Auth.checkName(user) || Auth.checkPassword(pw, pw2);
      if (e) return { err: e };
      const keys = await makeKeys(), id = await idOf([keys.sPub.x, keys.sPub.y]), s = salt();
      const a = { id, user: String(user).trim(), salt: s, hash: await hash(pw, s), keys, created: Date.now(), lastLogin: Date.now(), save: freshSave() };
      const A = all(); A[id] = a; U.write(ACC, A);
      Auth.user = a; U.write(SES, remember ? id : null); Auth.emit('login');
      return { ok: true, fresh: true };
    },
    async login(user, pw, remember) {
      const a = Object.values(all()).find(x => norm(x.user) === norm(user));
      if (!a) return { err: 'No player by that name on this device. (Accounts live in the browser they were made in.)' };
      if (await hash(pw, a.salt) !== a.hash) return { err: 'Wrong password.' };
      a.lastLogin = Date.now(); Auth.user = upgrade(a); Auth.save(); U.write(SES, remember ? a.id : null); Auth.emit('login');
      return { ok: true };
    },
    resume() { const id = U.read(SES, null); const a = id && all()[id]; if (a) { Auth.user = upgrade(a); a.lastLogin = Date.now(); Auth.save(); Auth.emit('login'); return true; } return false; },
    logout() { if (window.Online) Online.leave(true); if (window.Net) Net.stop(); Auth.user = null; Auth._k = null; U.write(SES, null); Auth.emit('logout'); },
    remove(id) { const A = all(); delete A[id]; U.write(ACC, A); },
    save() { if (!Auth.user) return; const A = all(); A[Auth.user.id] = Auth.user; U.write(ACC, A); },
    async changePassword(oldPw, newPw, newPw2) {
      const a = Auth.user; if (await hash(oldPw, a.salt) !== a.hash) return { err: 'Your current password is wrong.' };
      const e = Auth.checkPassword(newPw, newPw2); if (e) return { err: e };
      a.salt = salt(); a.hash = await hash(newPw, a.salt); Auth.save(); return { ok: true };
    },
    async keys() {
      if (Auth._k && Auth._k.id === Auth.id) return Auth._k;
      const K = Auth.user.keys, imp = (j, alg, use) => subtle.importKey('jwk', j, alg, false, use);
      Auth._k = {
        id: Auth.id,
        sign: await imp(K.sPriv, { name: 'ECDSA', namedCurve: 'P-256' }, ['sign']),
        ecdh: await imp(K.ePriv, { name: 'ECDH', namedCurve: 'P-256' }, ['deriveKey']),
        spk: [K.sPub.x, K.sPub.y], epk: [K.ePub.x, K.ePub.y],
      };
      return Auth._k;
    },
    /* a finished match: { kind: 'battle' | 'race' | 'tourney', won, kos, who, online, oppR, champ }
       Online battles move your rating (Elo against the other side's average). Everything pays xp. */
    record(r) {
      const S = Auth.S; if (!S) return null;
      const st = S.stats, before = level(S.xp).lv;
      let xp = 0, delta = null;
      if (r.kind === 'race') { st.races++; if (r.won) st.raceWins++; xp = 80 + (r.won ? 120 : 0); }
      else if (r.kind === 'tourney') { st.tourneys++; if (r.champ) st.tourneyWins++; xp = 150 + (r.rounds || 0) * 80 + (r.champ ? 300 : 0); }
      else {
        st.battles++; if (r.won) st.wins++; else st.losses++; st.kos += r.kos || 0;
        if (r.who) st.fighters[r.who] = (st.fighters[r.who] || 0) + 1;
        xp = 100 + (r.won ? 150 : 0) + (r.kos || 0) * 30;
      }
      if (r.online) { st.online++; if (r.won || r.champ) st.onlineWins++; xp = Math.round(xp * 1.5); }
      if (r.online && r.kind === 'battle' && r.oppR) {
        const R = S.rank, E = 1 / (1 + Math.pow(10, (r.oppR - R.rating) / 400)), K = R.games < 5 ? 48 : 24;
        delta = Math.round(K * ((r.won ? 1 : 0) - E)); delta = r.won ? Math.max(6, delta) : Math.min(-4, delta);
        R.games++; if (r.won) R.wins++; else R.losses++; R.rating = Math.max(100, R.rating + delta); R.peak = Math.max(R.peak, R.rating);
      }
      S.xp += xp;
      Auth.save();
      if (window.Net) Net.profile();
      return { xp, lv: level(S.xp).lv, up: level(S.xp).lv > before, delta, rating: S.rank.rating };
    },
  };
  Object.assign(Auth, U.hub());   // on / emit (mixed in after: Object.assign would call the getters above)
})();
