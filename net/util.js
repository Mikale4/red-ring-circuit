/* ============================================================================
   net/util.js -- the small helpers the online pieces share (accounts, the
   relay, rooms, friends and messages), as in Wordle n' Friends and BLOCKADE.
   ========================================================================== */
(function () {
  'use strict';
  const U = window.U = window.U || {};
  U.clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  U.pick = arr => arr[Math.floor(Math.random() * arr.length)];
  U.shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  U.read = (k, def) => { try { const v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } };
  U.write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* keep going */ } };
  U.rid = (n = 12) => { const b = new Uint8Array(n); crypto.getRandomValues(b); return Array.from(b, x => (x % 36).toString(36)).join(''); };
  U.ago = ts => {
    const s = Math.max(0, (Date.now() - ts) / 1000);
    if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + 'm ago'; if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    if (s < 86400 * 30) return Math.floor(s / 86400) + 'd ago'; return new Date(ts).toLocaleDateString();
  };
  U.time = ts => new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  /* typed text from other people: plain, one line, no control or direction-flipping characters */
  const BADCH = c => c < 32 || (c >= 0x7f && c <= 0x9f) || (c >= 0x200b && c <= 0x200f) || (c >= 0x2028 && c <= 0x202e) || (c >= 0x2060 && c <= 0x206f) || c === 0xfeff;
  U.clean = (t, max = 160) => Array.from(String(t == null ? '' : t)).filter(ch => !BADCH(ch.codePointAt(0))).join('').replace(/\s+/g, ' ').trim().slice(0, max);
  const SWEARS = /\b(f+u+c+k|s+h+i+t|b+i+t+c+h|c+u+n+t|a+s+s+h+o+l+e|b+a+s+t+a+r+d|s+l+u+t|w+h+o+r+e|t+w+a+t|w+a+n+k|d+i+c+k+h+e+a+d|m+o+t+h+e+r+f+u+c+k)\w*/gi;
  U.unswear = t => t.replace(SWEARS, w => w[0] + '*'.repeat(Math.max(1, w.length - 1)));
  U.b64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  U.unb64 = s => { s = String(s).replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };
  U.hexb = bytes => Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2, '0')).join('');
  U.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  /* a tiny event hub: U.hub() -> { on(type, fn) -> off, emit(type, data) } */
  U.hub = () => {
    const L = {};
    return {
      on(t, fn) { (L[t] = L[t] || new Set()).add(fn); return () => L[t].delete(fn); },
      emit(t, d) { for (const fn of [...(L[t] || [])]) { try { fn(d); } catch (e) { console.error(e); } } },
    };
  };
})();
