/*
 * Red Ring Circuit: the settings -- music and sound volumes, how fast the story's talk types
 * out, and screen shake. Kept in this browser (`redringcircuit.settings`); the first time,
 * they are taken from Post Parade's (the game began as its arcade cabinet), where there are
 * any. The same API Post Parade's settings had, so the Options screen reads them as before.
 */
(function (root) {
  "use strict";
  const KEY = "redringcircuit.settings", OLD = "postparade.settings";
  const DEFS = [
    { id: "musicVolume", label: "Music", type: "choice", def: 0.55, choices: [[0, "Off"], [0.3, "Quiet"], [0.55, "Normal"], [0.85, "Loud"]] },
    { id: "sfxVolume", label: "Sound effects", type: "choice", def: 0.7, choices: [[0, "Off"], [0.4, "Quiet"], [0.7, "Normal"], [1, "Loud"]] },
    { id: "textSpeed", label: "Dialogue speed", type: "choice", def: 18, choices: [[34, "Relaxed"], [18, "Normal"], [7, "Fast"], [0, "Instant"]] },
    { id: "shake", label: "Screen shake", type: "toggle", def: true },
    { id: "tagPing", label: "Ping on player tags", type: "toggle", def: true },
  ];
  const defaults = () => { const o = {}; for (const d of DEFS) o[d.id] = d.def; return o; };
  let cache = null;
  function all() {
    if (cache) return cache;
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (!saved) try {                                   // the first time: what Post Parade had
      const old = JSON.parse(localStorage.getItem(OLD)) || {};
      saved = {}; for (const d of DEFS) if (d.id in old) saved[d.id] = old[d.id];
    } catch (e) {}
    cache = Object.assign(defaults(), saved || {});
    return cache;
  }
  const get = id => all()[id];
  const listeners = [];
  function set(id, value) {
    const s = all(); s[id] = value;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    for (const fn of listeners) fn(id, value);
    return value;
  }
  const onChange = fn => listeners.push(fn);
  root.Settings = { DEFS, all, get, set, onChange, defaults };
})(typeof globalThis !== "undefined" ? globalThis : this);
