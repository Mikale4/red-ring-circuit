/*
 * Red Ring Circuit: the Chao Garden -- a mode of its own, from the main menu. The keeper (the
 * player's own person, made at the first visit) walks a voxel garden where Chao and animals
 * live their own days: they eat, sleep, play, swim, make friends and rivals, train themselves
 * at what they like doing, and change as they're raised. The keeper picks them up, pets them,
 * feeds them, gives them toys, hatches eggs (the animals' come from the badniks Sonic and the
 * others break open in the main game), and keeps the encyclopedias.
 *
 *   ChaoGarden.open(host, { key, prog, sfx, tone, onExit })
 *
 * Its save is its own (under `key`), apart from the cabinet's.
 */
(function (root) {
  "use strict";
  const THREE = root.THREE;
  const PI = Math.PI, TAU = PI * 2;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const lerp = (a, b, t) => a + (b - a) * t;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ico = (n, s) => (root.Icon ? root.Icon(n, s) : "");
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pickW = (w) => { let s = 0; for (const k in w) s += Math.max(0, w[k]); let r = Math.random() * s; for (const k in w) { r -= Math.max(0, w[k]); if (r <= 0) return k; } return Object.keys(w)[0]; };
  const angTo = (a, b) => { let d = (b - a) % TAU; if (d > PI) d -= TAU; if (d < -PI) d += TAU; return d; };
  const DAY = 720;                     // a garden day: twelve minutes

  let G = null;

  /* ---------------------------------------------------------------- opening and closing */
  function css() {
    if (document.getElementById("cg-css")) return;
    const l = document.createElement("link"); l.id = "cg-css"; l.rel = "stylesheet"; l.href = "chao/chao.css" + (root.V ? "?v=" + root.V : "");
    document.head.append(l);
  }
  function open(host, opts) {
    if (G) close(true);
    const D = root.ChaoData, L = root.ChaoLife, M = root.ChaoModels, Wd = root.ChaoWorld;
    if (!THREE || !D || !L || !M || !M.ok || !Wd || !Wd.ok) return false;
    css();
    const box = host.querySelector(".adv") || host;
    const el = document.createElement("div"); el.className = "cg"; box.append(el);
    el.innerHTML = `<div class="cg-3d"></div><div class="cg-tags"></div><div class="cg-hud"></div><div class="cg-touch"></div><div class="cg-ov"></div>`;
    let R;
    try { R = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" }); } catch (e) { el.remove(); return false; }
    R.setPixelRatio(Math.min(root.devicePixelRatio || 1, 1.75));
    R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
    el.querySelector(".cg-3d").append(R.domElement);
    G = { host, el, opts: opts || {}, R, D, L, M, Wd, t: 0, keys: {}, pad: {}, touch: { x: 0, y: 0 }, ents: [], items: [], tags: new Map(), menu: null, last: 0, saveT: 0, toastQ: [], floats: [] };
    G.save = L.sane(load());
    G.ov = el.querySelector(".cg-ov"); G.hud = el.querySelector(".cg-hud"); G.tagBox = el.querySelector(".cg-tags");
    buildScene();
    bindInput();
    buildHud();
    G.raf = requestAnimationFrame(frame);
    music(G.save.avatar ? "garden" : "lobby");
    if (!G.save.avatar) creator(true);
    else arrive();
    return true;
  }
  function close(quiet) {
    if (!G) return;
    try { persist(); } catch (e) {}
    cancelAnimationFrame(G.raf);
    unbindInput();
    musicStop();
    try { G.R.dispose(); G.R.forceContextLoss(); } catch (e) {}
    if (PREV.R) { try { PREV.R.dispose(); PREV.R.forceContextLoss(); } catch (e) {} PREV.R = null; }
    G.el.remove();
    const onExit = G.opts.onExit; G = null;
    if (!quiet && onExit) onExit();
  }
  const load = () => { try { return JSON.parse(localStorage.getItem(G.opts.key || "redringcircuit.chao")); } catch (e) { return null; } };
  function persist() {
    if (!G || !G.save) return;
    const S = G.save;
    const here = S.region || "central", rg = o => (o.region || "central") === here;
    for (const e of G.ents) e.c.pos = [+e.x.toFixed(2), +e.z.toFixed(2)];
    if (G.arrived) {
      S.eggs = S.eggs.filter(e => !rg(e)).concat(G.items.filter(i => i.kind === "egg").map(i => Object.assign(i.data, { region: here, pos: [+i.x.toFixed(2), +i.z.toFixed(2)] })));
      S.items = (S.items || []).filter(i => !rg(i)).concat(G.items.filter(i => i.kind !== "egg" && !i.temp).map(i => ({ kind: i.kind, id: i.id, region: here, pos: [+i.x.toFixed(2), +i.z.toFixed(2)] })));
      if (G.keeper) S.keeper = [+G.keeper.x.toFixed(2), +G.keeper.z.toFixed(2), +G.keeper.a.toFixed(2)];
      if (G.held) { const h = G.held; if (h.kind === "egg") S.eggs.push(Object.assign(h.data, { region: here, pos: [G.keeper.x, G.keeper.z] })); else if (h.kind !== "creature") S.items.push({ kind: h.kind, id: h.id, region: here, pos: [G.keeper.x, G.keeper.z] }); }
    }
    for (const c of [...S.chao, ...S.animals]) { if (c.log.length > 40) c.log.splice(1, c.log.length - 40); for (const k in c.rel) if (Math.abs(c.rel[k]) < 0.5) delete c.rel[k]; }
    try { localStorage.setItem(G.opts.key || "redringcircuit.chao", JSON.stringify(S)); } catch (e) {}
  }
  const sfx = n => { try { if (G && G.opts.sfx) G.opts.sfx(n); } catch (e) {} };
  const chirp = (f, d) => { try { if (G && G.opts.tone) G.opts.tone(f, f * 1.5, d || 0.08, "sine", 0.05); } catch (e) {} };

  /* ---------------------------------------------------------------- the scene */
  function buildScene() {
    const scene = G.scene = new THREE.Scene();
    G.cam = new THREE.PerspectiveCamera(52, 1, 0.1, 400);
    G.hemi = new THREE.HemisphereLight(0xd8ecff, 0x6a8a4a, 0.62); scene.add(G.hemi);
    G.sun = new THREE.DirectionalLight(0xfff2d8, 0.95);
    G.sun.castShadow = true; G.sun.shadow.mapSize.set(2048, 2048);
    Object.assign(G.sun.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 140 });
    G.sun.shadow.bias = -0.0008; G.sun.shadow.normalBias = 0.03;
    scene.add(G.sun); scene.add(G.sun.target);
    G.amb = new THREE.AmbientLight(0xffffff, 0.12); scene.add(G.amb);
    scene.fog = new THREE.Fog(0x9ad0f0, 30, 70);
    scene.background = new THREE.Color(0x9ad0f0);
    /* the stars, for the night */
    const sg = new THREE.BufferGeometry(), sp = [];
    for (let i = 0; i < 700; i++) { const a = Math.random() * TAU, b = Math.random() * 0.48 * PI + 0.04; sp.push(Math.cos(a) * Math.cos(b) * 180, Math.sin(b) * 180, Math.sin(a) * Math.cos(b) * 180); }
    sg.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    G.stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false }));
    scene.add(G.stars);
    G.W = G.Wd.make(scene, G.save.region || "central");
    G.W.props.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    G.cam.userData = { yaw: 0, pitch: 0.32, dist: 4.8, tx: 0, ty: 0, tz: 0 };
    resize();
  }
  function resize() {
    if (!G) return;
    const b = G.el.querySelector(".cg-3d"), w = b.clientWidth || innerWidth, h = b.clientHeight || innerHeight;
    if (G.w === w && G.h === h) return;
    G.w = w; G.h = h; G.R.setSize(w, h, false); G.cam.aspect = w / h; G.cam.updateProjectionMatrix();
  }
  /* the sky through the day: sunrise, noon, sunset, night */
  const SKY = [[0, 0x0a1230, 0x101a3a], [0.2, 0x1a2450, 0x2a2a50], [0.26, 0xf0a070, 0xf8c890], [0.33, 0x8ac8f0, 0xd8ecff], [0.5, 0x7ac0f0, 0xe0f0ff], [0.7, 0x8ac0e8, 0xf0e0c8], [0.76, 0xf08a5a, 0xf8b070], [0.82, 0x3a3a70, 0x5a4a7a], [1, 0x0a1230, 0x101a3a]];
  function skyAt(tod) {
    for (let i = 0; i < SKY.length - 1; i++) if (tod >= SKY[i][0] && tod <= SKY[i + 1][0]) { const t = (tod - SKY[i][0]) / (SKY[i + 1][0] - SKY[i][0]); return [G.M.mixC(SKY[i][1], SKY[i + 1][1], t), G.M.mixC(SKY[i][2], SKY[i + 1][2], t)]; }
    return [SKY[0][1], SKY[0][2]];
  }
  const tod = () => ((G.save.day % 1) + 1) % 1;
  const isNight = () => { const t = tod(); return t < 0.21 || t > 0.85; };
  function light() {
    const t = tod(), el = Math.sin((t - 0.25) * TAU), day = clamp(el * 3 + 0.25, 0, 1);
    let [sky, fog] = skyAt(t);
    const RS = G.W && G.W.RG && G.W.RG.sky;
    if (RS) { sky = G.M.mixC(sky, RS[0], 0.5 * day); fog = G.M.mixC(fog, RS[1], 0.5 * day); }
    G.scene.background.setHex(sky); G.scene.fog.color.setHex(G.M.mixC(sky, fog, 0.5));
    const fk = (G.W && G.W.RG && G.W.RG.fog) || 1; G.scene.fog.near = 30 * fk; G.scene.fog.far = 70 * fk;
    const k = G.keeper || { x: 0, z: 0 };
    const sa = (t - 0.25) * TAU;
    G.sun.position.set(k.x + Math.cos(sa) * 50, Math.max(8, Math.sin(sa) * 60) + 10, k.z + 24);
    G.sun.target.position.set(k.x, 0, k.z);
    G.sun.intensity = 0.12 + day * 0.62;
    G.sun.color.setHex(day < 0.5 ? G.M.mixC(0x8a9ad8, 0xffc890, day * 2) : G.M.mixC(0xffc890, 0xfff4e0, (day - 0.5) * 2));
    G.hemi.intensity = 0.28 + day * 0.26;
    G.hemi.color.setHex(G.M.mixC(0x5a6aa8, 0xd8ecff, day));
    G.stars.material.opacity = clamp(1 - day * 2.2, 0, 1);
    G.stars.position.set(k.x, 0, k.z);
  }

  /* ---------------------------------------------------------------- arriving */
  function arrive() {
    const S = G.save, W = G.W, P = G.Wd.PLAN, here = S.region || "central", central = here === "central";
    /* the keeper */
    const kp = S.keeper || (central ? [P.spawn[0], P.spawn[1], PI] : W.RG.entry);
    G.keeper = { rig: G.M.avatar(S.avatar), x: kp[0], z: kp[1], a: kp[2], y: W.ground(kp[0], kp[1]), vx: 0, vz: 0, vy: 0, air: false };
    shadowsOn(G.keeper.rig.g); G.scene.add(G.keeper.rig.g);
    G.cam.userData.yaw = G.keeper.a + PI;
    /* the warden: the garden's own keeper of old, at the hall */
    folkHere();
    /* everyone who lives here (each creature lives in one garden; carried through a gate, it lives in the next) */
    settle();
    gates(true);
    music(gardenTune());
    W.update(G.keeper.x, G.keeper.z);
    W.group.traverse(o => { if (o.isMesh && !o.material.transparent) { o.receiveShadow = true; o.castShadow = true; } });
    mail();
    if (!S.met) intro();
    else toast(`Day ${Math.floor(S.day) + 1} in the ${W.RG.name || "Central Garden"}`, "sun");
    G.arrived = true;
  }
  const HAZEL = { sex: "f", skin: 2, hair: 6, style: "bun", eyes: 2, attire: "sweater", colour: 3, bottoms: "long", glasses: true, custom: { apron: 0x8a6a3a, hat: { c: 0xd8c08a, band: 0x3a6a3a, sun: true, flower: 0xf05a7a }, shoes: 0x6a4a2a } };
  function settle() {
    const S = G.save, here = S.region || "central", rg = o => (o.region || "central") === here;
    for (const c of [...S.chao, ...S.animals]) if (rg(c)) spawn(c);
    for (const e of S.eggs) if (rg(e)) addItem("egg", null, e.pos ? e.pos[0] : rnd(-4, 4), e.pos ? e.pos[1] : 28, e);
    for (const it of S.items || []) if (rg(it)) addItem(it.kind, it.id, it.pos[0], it.pos[1]);
  }

  /* ---------------------------------------------------------------- the gardens
     The gates round the Central Garden open as the keeper gets on: the bridge mended once a
     Chao has changed (or two days have passed), the fallen trees cleared once three live here,
     and so on; the balloon to the Sky Garden flies once the other five are open. */
  const GATE_RULES = {
    tropical: { ok: S => S.chao.some(c => c.stage >= 1) || S.day >= 2, why: "A bridge over the river is being mended. (It'll be done once one of your Chao has changed, or in two days.)", done: "The bridge to the Tropical Garden is mended!" },
    forest:   { ok: S => S.chao.length + S.animals.length >= 4, why: "Fallen trees lie across the path. (The garden's folk will clear them once four creatures live with you.)", done: "The fallen trees are cleared: the Forest Garden is open!" },
    mountain: { ok: S => (S.ach.duelWins || 0) >= 1, why: "Rocks have fallen across the pass. (The climbers will move them for a keeper who has won a duel at the hall.)", done: "The pass is clear: the Mountain Garden is open!" },
    mystic:   { ok: S => (S.ach.eggs || 0) >= 1, why: "The old stone door is sealed. (It opens, they say, for a keeper whose creatures have had an egg of their own.)", done: "The stone door has opened: the Mystic Garden!" },
    mech:     { ok: S => S.chao.length + S.animals.length >= 8 || (S.freedEggs || 0) >= 3, why: "The lift has no power. (The engineers want eight creatures in your care -- or three eggs from animals freed in the zones.)", done: "The lift has power: the Mechanical Garden is open!" },
    sky:      { ok: S => ["tropical", "forest", "mountain", "mystic", "mech"].every(k => (S.open || {})[k]), why: "The balloon needs mending. (Open the other five gardens and it'll fly.)", done: "The balloon is mended: the Sky Garden is above!" },
  };
  /* see which gates have opened (and tell, the first time) */
  function gates(quiet) {
    const S = G.save; S.open = S.open || {};
    if (!G.W || G.W.id !== "central") { for (const k in GATE_RULES) if (!S.open[k] && GATE_RULES[k].ok(S)) S.open[k] = true; return; }
    for (const g of G.W.gates) {
      const R = GATE_RULES[g.id]; if (!R) continue;
      if (!S.open[g.id] && R.ok(S)) { S.open[g.id] = true; if (!quiet) { toast(R.done, "door"); jingle("gate-open"); } }
      if (S.open[g.id] && !g.open) G.W.openGate(g);
    }
  }
  /* through a gate: the garden behind is put away, the next one built; what you carry comes too */
  function travel(to, from) {
    if (G.traveling) return; G.traveling = true;
    const fade = document.createElement("div"); fade.className = "cg-fade"; G.el.append(fade);
    requestAnimationFrame(() => fade.classList.add("on"));
    setTimeout(() => {
      if (!G) return;
      const S = G.save, h = G.held;
      persist();
      const carried = h && h.kind === "creature" ? h.e.c : null, item = h && h.kind !== "creature" ? { kind: h.kind, id: h.it.id, data: h.it.data } : null;
      if (carried) carried.region = to;
      G.held = null;
      for (const e of G.ents.slice()) despawn(e);
      for (const it of G.items) G.scene.remove(it.m);
      G.items = [];
      if (item && item.kind === "egg") { S.eggs = S.eggs.filter(e => e !== item.data); }
      else if (item) { const i = (S.items || []).findIndex(x => x.kind === item.kind && x.id === item.id && (x.region || "central") === (S.region || "central")); if (i >= 0) S.items.splice(i, 1); }
      for (const [, m] of G.W.chunks) m.geometry.dispose();
      G.scene.remove(G.W.group); G.scene.remove(G.W.props);

      S.region = to;
      G.W = G.Wd.make(G.scene, to);
      G.W.props.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      const k = G.keeper;
      if (to === "central") {
        const g = G.W.gates.find(x => x.id === from), sp = g ? G.W.spots["gate-" + g.id] : null;
        if (sp) { const ix = Math.sin(g.face), iz = Math.cos(g.face); k.x = sp.x + ix * 1.5; k.z = sp.z + iz * 1.5; k.a = g.face; } else { k.x = 0; k.z = 29; k.a = PI; }
      } else { const E = G.W.RG.entry; k.x = E[0]; k.z = E[1]; k.a = E[2]; }
      folkHere();
      k.y = G.W.ground(k.x, k.z); k.vx = k.vz = 0;
      G.cam.userData.yaw = k.a + PI; G.cam.userData.tx = k.x; G.cam.userData.tz = k.z; G.cam.userData.ty = k.y + 1;
      settle();
      if (carried) { const e = G.ents.find(x => x.c === carried) || spawn(carried, k.x, k.z); pickUp({ kind: "creature", e }); }
      if (item) { const it = addItem(item.kind, item.id, k.x, k.z, item.data); pickUp({ kind: item.kind, it, id: item.id }); }
      G.W.update(k.x, k.z);
      G.W.group.traverse(o => { if (o.isMesh && !o.material.transparent) { o.receiveShadow = true; o.castShadow = true; } });
      gates(true);
      music(gardenTune());
      S.visited = S.visited || {}; const first = !S.visited[to]; S.visited[to] = true;
      toast(first ? `The ${G.W.RG.name || "Central Garden"}, for the first time` : `The ${G.W.RG.name || "Central Garden"}`, first ? "star" : "flag");
      persist();
      fade.classList.remove("on"); setTimeout(() => fade.remove(), 500);
      G.traveling = false;
    }, 480);
  }
  /* the gardens you're not in: their creatures' days go on, more quietly */
  function elsewhere(dt) {
    G.elseT = (G.elseT || 0) + dt; if (G.elseT < 5) return;
    const S = G.save, here = S.region || "central", n = G.elseT; G.elseT = 0;
    for (const c of [...S.chao, ...S.animals]) {
      if ((c.region || "central") === here) continue;
      G.L.tick(c, n, { dayLen: DAY, asleep: isNight() && Math.random() < 0.6, wild: c.region === "forest" || c.region === "tropical", mech: c.region === "mech" });
      c.care.food = Math.max(c.care.food, 35);                       // (they find something to eat)
      if (Math.random() < n / 40) { const A = G.D.ATTRS, a = REGION_TRAIN[c.region] || A[Math.floor(Math.random() * 7)].id; G.L.train(c, a, 4); }
    }
  }
  /* what each garden is good for, a little, just by living there */
  const REGION_TRAIN = { tropical: "res", forest: "ins", mountain: "pow", mystic: "cha", mech: "ins", sky: "agi" };
  function shadowsOn(o) { o.traverse(m => { if (m.isMesh && m.material && !m.material.transparent && m.geometry.type !== "PlaneGeometry") { m.castShadow = true; m.receiveShadow = true; } }); }
  /* the animals Sonic and the others free from the badniks: every eight, an egg in the mailbox */
  function mail() {
    const S = G.save, L = G.L, D = G.D;
    const freed = G.opts.prog ? (G.opts.prog().animals || 0) : 0;
    S.mail = S.mail || [];
    const due = Math.floor(freed / 8);
    if (S.freedEggs == null || S.freedEggs > due) S.freedEggs = Math.min(due, S.freedEggs || 0);
    let n = 0;
    while (S.freedEggs < due && S.mail.length < 8) {
      S.freedEggs++; n++;
      const pool = D.ANIMALS.filter(a => a.classic && (a.rarity <= 1 || Math.random() < 0.3));
      const sp = pool[Math.floor(Math.random() * pool.length)];
      S.mail.push(L.egg(sp.id, { from: "from an animal freed from a badnik, out in the zones" }));
    }
    if (S.freedEggs < due) S.freedEggs = due;          // (a full mailbox: the rest are lost to the wind, as letters are)
    if (n) setTimeout(() => toast(`${n} egg${n > 1 ? "s" : ""} in the mailbox: animals freed from the badniks`, "mail"), 1800);
    G.mailN = S.mail.length;
  }
  function intro() {
    talk([
      ["Hazel", "Oh! A visitor. Welcome, welcome to the Central Garden. I'm Hazel; I've kept this place longer than I care to count."],
      ["Hazel", `And you must be ${esc(G.save.avatar.name || "the new keeper")}. The Society wrote you were coming.`],
      ["Hazel", "The Chao live here, and the animals -- the ones freed from Eggman's badniks out in the zones find their way here, given time."],
      ["Hazel", "Here: two Chao eggs, and an egg from a little Flicky. Keep them warm -- carry them, or set them on the incubator by the hall -- and they'll hatch soon enough."],
      ["Hazel", "Walk up to anything and press Z to pick it up or use it, C to pet, X to throw what you hold (or whistle), and V to look closer. Enter for the menu."],
      ["Hazel", "Shake the fruit trees in the orchard for food. And raise them kindly. What they become is up to you -- and to them."],
    ], () => {
      const S = G.save, L = G.L, P = G.Wd.PLAN;
      S.met = true;
      const e1 = L.egg("chao-neutral-child", { from: "a gift from Hazel, the garden's warden" }), e2 = L.egg("chao-neutral-child", { from: "a gift from Hazel, the garden's warden" }), e3 = L.egg("an-flicky", { from: "from a Flicky freed from a badnik" });
      e1.need = 30; e2.need = 36; e3.need = 26;
      addItem("egg", null, P.incubator[0] + 0.4, P.incubator[1] - 1.4, e1);
      addItem("egg", null, P.incubator[0] - 0.6, P.incubator[1] - 1.2, e2);
      addItem("egg", null, P.incubator[0] + 1.4, P.incubator[1] - 0.7, e3);
      addItem("toy", "ball", 3, 18); addItem("toy", "duck", -8, -2);
      for (const f of ["round", "round", "triangle"]) addItem("fruit", f, rnd(-3, 3), rnd(26, 28));
      persist();
      toast("Three eggs by the incubator", "heart");
    });
  }

  /* ---------------------------------------------------------------- creatures */
  function spawn(c, x, z) {
    const W = G.W, P = G.Wd.PLAN;
    const rig = G.M.creature(c);
    shadowsOn(rig.g); if (rig.shadow) rig.shadow.visible = false;
    const sp = G.D.species(c.sp);
    let px = x != null ? x : c.pos ? c.pos[0] : rnd(-10, 10), pz = z != null ? z : c.pos ? c.pos[1] : rnd(10, 26);
    if (!Number.isFinite(px) || !Number.isFinite(pz)) { px = rnd(-8, 8); pz = rnd(12, 24); }
    if (rig.aquatic && W.depth(px, pz) < 0.4) { const p = W.places.water(); px = p[0]; pz = p[1]; }
    const e = { c, rig, sp, x: px, z: pz, y: W.ground(px, pz), a: rnd(0, TAU), v: 0, st: "idle", task: null, think: rnd(0.5, 2), held: false, vy: 0, air: false, stuck: 0, bub: 0 };
    e.y = groundFor(e, e.x, e.z);
    rig.g.position.set(e.x, e.y, e.z);
    growScale(e);
    G.scene.add(rig.g); G.ents.push(e);
    G.save.seen[c.sp] = true; G.save.owned[c.sp] = true;
    return e;
  }
  function despawn(e) { G.scene.remove(e.rig.g); G.ents.splice(G.ents.indexOf(e), 1); const tag = G.tags.get(e); if (tag) { tag.remove(); G.tags.delete(e); } }
  /* young animals grow into their size */
  function growScale(e) {
    const al = e.c.genes.al || {}, two = k => al[k] && al[k][0] && al[k][1];
    const s = (e.c.genes.size || 1) * (two("giant") ? 1.35 : two("tiny") ? 0.7 : 1) * (e.c.kind === "animal" ? lerp(0.55, 1, clamp(e.c.grown || 0, 0, 1)) : 1);
    e.rig.g.scale.setScalar(s);
  }
  const isFlier = e => e.rig.gait === "fly" || e.rig.gait === "bird" && e.task && e.task.fly;
  function groundFor(e, x, z) {
    const W = G.W, g = W.smooth(x, z), w = W.waterAt(x, z), st = W.standAt(x, z);
    if (st != null && st > g) return st;
    if (w != null && w - g > 0.3) {
      if (e && e.rig && (e.rig.aquatic)) return w - 0.35;
      if (e && e.rig && (e.c.kind === "chao" || e.rig.swims)) return w - 0.28;
    }
    return g;
  }
  function canStand(e, x, z) {
    const W = G.W, r = (e.rig.r || 0.25) * 0.6;
    if (Math.hypot(x, z) > ((G.W.RG && G.W.RG.radius) || 44)) return false;
    if (e.rig.gait === "fly") return !W.blocked(x, z, r) || true;
    const dep = W.depth(x, z), st = W.standAt(x, z);
    if (e.rig.aquatic) return dep > 0.35;
    if (dep > 0.4 && st == null && !(e.c.kind === "chao" || e.rig.swims)) return false;
    return !W.blocked(x, z, r, e.y);
  }
  /* what it does next: its needs first, then its temperaments, its quirks and its likes */
  function think(e) {
    const c = e.c, D = G.D, L = G.L, T1 = D.TEMPERS[c.genes.temper[0]], T2 = D.TEMPERS[c.genes.temper[1]];
    const night = isNight(), tr = L.traitsOf(c), has = id => c.genes.traits.includes(id);
    if (c.care.food < 30 && !e.rig.aquatic && !(e.fails >= 2)) return task(e, "eat");
    if (c.care.energy < 18 || (night && !has("night") && Math.random() < (has("early") ? 0.8 : 0.45)) || (has("sleepy") && Math.random() < 0.08)) return task(e, "sleep");
    if (c.care.food < 22 && (e.fails || 0) >= 2 && G.keeper) { e.fails = 0; return task(e, "beg"); }
    const w = { wander: 1.2, rest: 0.7, social: 0.9, play: 0.6, explore: 0.4, run: 0.3, watch: 0.4, follow: 0.25 };
    for (const [T, k] of [[T1, 1], [T2, 0.5]]) for (const a in T.day) w[a] = (w[a] || 0) + T.day[a] * k;
    for (const t of tr) if (t.day) for (const a in t.day) if (w[a] != null) w[a] *= t.day[a];
    if (has("swimmer") || G.D.species(c.sp).p1 === "swim") w.swim = (w.swim || 0) + 1.6; else w.swim = 0.15;
    if (has("musician")) w.music = 1.2;
    if (c.bond > 50) w.follow += 0.6;
    if (G.keeper && Math.hypot(G.keeper.x - e.x, G.keeper.z - e.z) < 6 && c.bond < 30 && w.hide) w.hide *= 2.5;
    if (!G.items.some(i => i.kind === "toy")) w.play *= 0.6;
    if (e.rig.aquatic) return task(e, "swim");
    if (e.rig.gait === "fly" || e.rig.gait === "bird") w.fly = 1.4;
    if (c.kind === "animal") { w.spar = (w.spar || 0) * 0.4; w.music = 0; w.tease = (w.tease || 0) * 0.5; }
    if (c.care.mood < 25) w.rest += 1;
    return task(e, pickW(w));
  }
  function task(e, k, o) {
    const W = G.W, c = e.c, places = W.places, like = c.genes.likes.place;
    const T = e.task = Object.assign({ k, t: 0, until: rnd(6, 12) }, o || {});
    const go = (p) => { if (p) { T.x = p[0]; T.z = p[1]; } };
    const near = (r) => { for (let i = 0; i < 10; i++) { const a = rnd(0, TAU), d = rnd(2, r), x = e.x + Math.cos(a) * d, z = e.z + Math.sin(a) * d; if (canStand(e, x, z)) return [x, z]; } return null; };
    if (k === "wander") go(Math.random() < 0.3 && places[like] ? places[like]() : near(c.genes.temper.includes("adventurous") ? 22 : 9));
    else if (k === "explore") { go(places.any()); T.until = 30; }
    else if (k === "run") { go(places.any()); T.until = 24; T.fast = true; T.laps = 3; }
    else if (k === "rest" || k === "watch") { go(Math.random() < 0.5 && places[like] ? places[like]() : near(5)); T.sit = rnd(8, 15); }
    else if (k === "sleep") { go(places[like] && like !== "water" ? places[like]() : near(6)); T.until = 999; }
    else if (k === "swim") { go(places.water()); T.until = rnd(12, 22); }
    else if (k === "fly") { go(places.any()); T.fly = true; T.until = 14; }
    else if (k === "follow") { T.until = rnd(10, 18); }
    else if (k === "beg") { T.until = 25; }
    else if (k === "hide") { const t = W.trees.reduce((b, t) => (Math.hypot(t.x - e.x, t.z - e.z) < Math.hypot(b.x - e.x, b.z - e.z) ? t : b), W.trees[0]); const k2 = G.keeper; const dx = t.x - k2.x, dz = t.z - k2.z, d = Math.hypot(dx, dz) || 1; go([t.x + dx / d * 1.4, t.z + dz / d * 1.4]); T.sit = 10; }
    else if (k === "music") { go(near(4)); T.sit = 14; }
    else if (k === "eat") {
      const f = G.items.filter(i => i.kind === "fruit" && !i.claim).sort((a, b) => Math.hypot(a.x - e.x, a.z - e.z) - Math.hypot(b.x - e.x, b.z - e.z))[0];
      if (f && Math.hypot(f.x - e.x, f.z - e.z) < 30) { f.claim = e; T.item = f; go([f.x, f.z]); }
      else { const tr = W.trees.filter(t => t.fruit && t.hang.some(Boolean)).sort((a, b) => Math.hypot(a.x - e.x, a.z - e.z) - Math.hypot(b.x - e.x, b.z - e.z))[0]; if (tr) { T.tree = tr; const a = Math.atan2(e.z - tr.z, e.x - tr.x); go([tr.x + Math.cos(a) * 1.3, tr.z + Math.sin(a) * 1.3]); } else { T.k = "wander"; go(near(8)); } }
      T.until = 40;
    }
    else if (k === "social" || k === "play" || k === "tease" || k === "spar") {
      const others = G.ents.filter(o => o !== e && !o.held && o.c.kind === c.kind && !(o.task && o.task.k === "sleep") && !o.rig.aquatic && Math.hypot(o.x - e.x, o.z - e.z) < 26);
      if (k === "play" && Math.random() < 0.55) { const toy = G.items.filter(i => i.kind === "toy" && Math.hypot(i.x - e.x, i.z - e.z) < 25)[0]; if (toy) { T.toy = toy; go([toy.x, toy.z]); T.until = 18; return T; } }
      if (!others.length) { T.k = "wander"; go(near(8)); return T; }
      others.sort((a, b) => (b.c.rel[c.id] || 0) * (k === "spar" || k === "tease" ? -0.5 : 1) - (a.c.rel[c.id] || 0) * (k === "spar" || k === "tease" ? -0.5 : 1) + (Math.random() - 0.5) * 30);
      T.other = others[0]; T.until = 22;
    }
    return T;
  }
  /* walking toward a point; returns true on arrival */
  function steer(e, x, z, dt, fast) {
    if (x == null || z == null || !isFinite(x) || !isFinite(z)) return true;
    const dx = x - e.x, dz = z - e.z, d = Math.hypot(dx, dz);
    if (d < 0.35) { e.v = Math.max(0, e.v - dt * 6); return true; }
    const want = Math.atan2(dx, dz);
    e.a += clamp(angTo(e.a, want), -dt * 5, dt * 5);
    const base = speedOf(e) * (fast ? 2.1 : 1);
    e.v = lerp(e.v, Math.abs(angTo(e.a, want)) > 1.2 ? base * 0.2 : base, Math.min(1, dt * 4));
    const nx = e.x + Math.sin(e.a) * e.v * dt, nz = e.z + Math.cos(e.a) * e.v * dt;
    if (canStand(e, nx, nz)) { e.x = nx; e.z = nz; e.stuck = Math.max(0, e.stuck - dt); }
    else { e.a += (Math.random() < 0.5 ? 1 : -1) * 0.9; e.stuck += dt; e.v *= 0.3; }
    return false;
  }
  function speedOf(e) {
    const c = e.c, g = e.rig.gait, sz = Math.sqrt(Math.max(0.3, e.sp.size || 0.6) / 0.6);
    let v = c.kind === "chao" ? 1.0 + G.L.stat(c, "vel") / 1600 : g === "slither" || g === "crawl" ? 0.6 * (e.rig.slow ? e.rig.slow * 2 : 1) : g === "swim" || g === "float" ? 1.3 : g === "fly" ? 2.2 : 1.3 * sz;
    if (e.rig.slow) v *= Math.max(0.35, e.rig.slow);
    if (G.W.depth(e.x, e.z) > 0.3 && !e.rig.aquatic && g !== "fly") v *= 0.6;
    return v;
  }
  /* the natural training: what it does all day, it gets better at */
  function practise(e, a, n) {
    const got = G.L.train(e.c, a, n);
    if (got.lv) floatText(e, `+${got.lv} ${G.D.ATTRS.find(x => x.id === a).short}`, G.D.ATTRS.find(x => x.id === a).c);
    if (got.tech) { const t = G.D.tech(got.tech); toast(`${e.c.name} learned ${t.name}!`, "star"); e.c.log.push([G.save.day, `Learned ${t.name}.`]); }
  }
  function live(e, dt) {
    const c = e.c, T = e.task, L = G.L;
    L.tick(c, dt, { dayLen: DAY, asleep: e.st === "sleep", busy: T && (T.fast || T.k === "spar" || T.k === "play"), wild: c.kind === "chao" && (G.W.id === "forest" || G.W.id === "tropical" || (G.ents.some(o => o.c.kind === "animal" && Math.hypot(o.x - e.x, o.z - e.z) < 4) && Math.random() < 0.3)), mech: c.kind === "chao" && G.W.id === "mech" });
    if (!isFinite(e.x) || !isFinite(e.z) || !isFinite(e.a)) { const p = G.W.places.any(); e.x = p[0]; e.z = p[1]; e.a = 0; e.v = 0; e.y = groundFor(e, e.x, e.z); e.task = null; }
    /* a child grows by itself, most in what it was born good at; animals graze as they go */
    if (c.kind === "chao" && c.stage === 0 && !e.held && Math.random() < dt * 2) { const A = G.D.ATTRS; let s2 = 0; for (const a of A) s2 += c.genes.apt[a.id] + 0.2; let r = Math.random() * s2; for (const a of A) { r -= c.genes.apt[a.id] + 0.2; if (r <= 0) { practise(e, a.id, 0.35); break; } } }
    if (c.kind === "animal" && e.st !== "sleep") c.care.food = clamp(c.care.food + dt * (e.rig.aquatic ? 0.5 : 0.12), 0, 100);
    if (e.cocoon) { cocoonTick(e, dt); return; }
    if (e.held) return;
    if (e.air) {
      e.vy -= 18 * dt; e.x += e.tvx * dt; e.z += e.tvz * dt; e.y += e.vy * dt;
      const g = groundFor(e, e.x, e.z);
      if (e.y <= g) { e.y = g; e.air = false; sfx("stumble"); e.st = "cry"; e.face = "sad"; setTimeout(() => { if (e.face === "sad") e.face = null; }, 2500); task(e, "rest", { until: 3, sit: 2.5, x: e.x, z: e.z }); }
      return;
    }
    e.think -= dt;
    if (!T || T.t > T.until || e.stuck > 2.5 || (e.think <= 0 && !T)) { e.stuck = 0; think(e); e.think = rnd(2, 4); return; }
    T.t += dt;
    let st = "idle";
    const K = T.k;
    if (K === "petted") { st = "happy"; }
    else if (K === "eating") { st = "eat"; if (T.t > 2.6) { finishEat(e, T); } }
    else if (K === "eat") {
      if (T.item && (T.item.gone || T.item.held)) { e.task = null; return; }
      if (e.stuck > 2 || T.t > 38) { e.fails = (e.fails || 0) + 1; if (T.item) T.item.claim = null; e.task = null; e.stuck = 0; return; }
      if (T.x != null && !steer(e, T.x, T.z, dt)) st = "walk";
      else if (T.item) { eatItem(e, T.item); return; }
      else if (T.tree) { st = "idle"; e.a += angTo(e.a, Math.atan2(T.tree.x - e.x, T.tree.z - e.z)) * Math.min(1, dt * 4); if ((T.w = (T.w || 0) + dt) > 2.2) { const f = G.W.shake(T.tree); if (f) { const it = dropFruit(f); it.claim = e; T.item = it; T.tree = null; T.x = it.x; T.z = it.z; } else { e.task = null; } } }
    }
    else if (K === "sleep") {
      if (T.x != null && !T.down && !steer(e, T.x, T.z, dt)) st = "walk";
      else { T.down = true; st = "sleep"; if (Math.random() < dt * 0.3) floatText(e, "z", 0xb8d4ff, true); if (c.care.energy > 96 && (!isNight() || c.genes.traits.includes("night"))) e.task = null; }
    }
    else if (K === "rest" || K === "watch" || K === "hide" || K === "music") {
      if (T.x != null && !T.down && !steer(e, T.x, T.z, dt)) st = "walk";
      else {
        T.down = true; T.sit -= dt; st = K === "music" ? "dance" : "sit";
        practise(e, K === "watch" ? "ins" : K === "music" ? "cha" : K === "hide" ? "agi" : "vit", dt * 1.1);
        if (K === "music" && Math.random() < dt * 0.8) { G.M.emote(e.rig, "note"); e.bub = 1.2; for (const o of G.ents) if (o !== e && o.task && (o.task.k === "wander" || o.task.k === "rest") && Math.hypot(o.x - e.x, o.z - e.z) < 8) { task(o, "watch", { x: e.x + rnd(-2, 2), z: e.z + rnd(-2, 2), sit: 8 }); G.L.meet(e.c, o.c, "share", 0.5); } }
        if (T.sit <= 0) e.task = null;
      }
    }
    else if (K === "swim") {
      if (!steer(e, T.x, T.z, dt)) st = G.W.depth(e.x, e.z) > 0.3 ? "swim" : "walk";
      else { const p = G.W.places.water(); T.x = p[0]; T.z = p[1]; }
      if (G.W.depth(e.x, e.z) > 0.3) practise(e, "res", dt * 2.2);
    }
    else if (K === "fly") { if (!steer(e, T.x, T.z, dt, true)) st = "fly"; else e.task = null; practise(e, "agi", dt * 1.6); }
    else if (K === "run" || K === "explore" || K === "wander") {
      if (!steer(e, T.x, T.z, dt, T.fast)) { st = T.fast ? "run" : "walk"; if (T.fast) practise(e, "vel", dt * 2.4); else practise(e, K === "explore" ? "ins" : "vit", dt * 0.8); }
      else if (K === "run" && --T.laps > 0) { const p = G.W.places.any(); T.x = p[0]; T.z = p[1]; }
      else if (K === "explore" && !T.found) { T.found = true; find(e); T.until = T.t + 2; }
      else { T.until = Math.min(T.until, T.t + rnd(1, 3)); }
    }
    else if (K === "beg") {
      /* hungry, and nothing it can reach: it comes to the keeper and asks */
      const k = G.keeper, d = Math.hypot(k.x - e.x, k.z - e.z);
      if (d > 1.8 && !steer(e, k.x, k.z, dt, d > 6)) st = d > 6 ? "run" : "walk";
      else { e.a += angTo(e.a, Math.atan2(k.x - e.x, k.z - e.z)) * Math.min(1, dt * 3); st = "sad"; if (!T.said) { T.said = true; floatText(e, "Hungry", 0xff8a10); } if (Math.random() < dt * 0.4) { G.M.emote(e.rig, "question"); e.bub = 1.2; } }
      if (c.care.food > 40) e.task = null;
    }
    else if (K === "follow") {
      const k = G.keeper, d = Math.hypot(k.x - e.x, k.z - e.z);
      if (d > 2.2 && !steer(e, k.x, k.z, dt, d > 6)) st = d > 6 ? "run" : "walk";
      else { e.a += angTo(e.a, Math.atan2(k.x - e.x, k.z - e.z)) * Math.min(1, dt * 3); if (Math.random() < dt * 0.15) { G.M.emote(e.rig, "heart"); e.bub = 1.5; } }
    }
    else if (K === "flee") { if (!steer(e, T.x, T.z, dt, true)) st = "run"; else st = "happy"; }
    else if (K === "social" || K === "play" || K === "tease" || K === "spar") st = withOther(e, T, dt);
    e.st = st;
    /* evolution: checked now and then */
    e.evo = (e.evo || 0) - dt;
    if (e.evo <= 0) { e.evo = 6; const to = G.L.evolveCheck(c, { night: isNight() }); if (to) cocoon(e, to); else if (c.kind === "animal") growScale(e); }
  }
  /* time with another: talk, play chase, squabble, spar */
  function withOther(e, T, dt) {
    const o = T.other, c = e.c, L = G.L;
    if (T.toy) {
      const toy = T.toy;
      if (toy.gone || toy.held) { e.task = null; return "idle"; }
      if (Math.hypot(toy.x - e.x, toy.z - e.z) > 0.7) return steer(e, toy.x, toy.z, dt, true) ? "idle" : "run";
      toy.vx = Math.sin(e.a) * 2.2; toy.vz = Math.cos(e.a) * 2.2; toy.vy = toy.id === "ball" ? 2.5 : 0.8; toy.air = true;
      e.a += rnd(-1.4, 1.4); practise(e, "agi", 4); c.care.mood = clamp(c.care.mood + 3, 0, 100);
      if (Math.random() < 0.4) { G.M.emote(e.rig, "heart"); e.bub = 1; }
      return "happy";
    }
    if (!o || !G.ents.includes(o) || o.held) { e.task = null; return "idle"; }
    const d = Math.hypot(o.x - e.x, o.z - e.z);
    if (T.k === "play" && T.met) {
      /* tag: e chases o, who has a head start; a tag, and the other one is "it" */
      if (T.wait > 0) { T.wait -= dt; return "happy"; }
      if (d > 0.75) { steer(e, o.x, o.z, dt, true); practise(e, "vel", dt * 1.2); return "run"; }
      const tags = (T.tags || 0) + 1;
      L.meet(c, o.c, "play", 1); G.M.emote(e.rig, "heart"); e.bub = 1; chirp(1250, 0.05);
      if (tags >= 4) { e.task = null; if (o.task && (o.task.k === "flee" || o.task.k === "play")) o.task = null; maybeFriends(e, o); return "happy"; }
      const a = Math.atan2(e.x - o.x, e.z - o.z) + rnd(-0.6, 0.6), dd = rnd(3.5, 5.5);
      task(e, "flee", { x: e.x + Math.sin(a) * dd, z: e.z + Math.cos(a) * dd, until: 4 });
      task(o, "play", { other: e, met: true, tags, wait: 1.2, until: 20 });
      return "happy";
    }
    if (d > 1.1) { steer(e, o.x, o.z, dt, T.k === "play"); return T.k === "play" ? "run" : "walk"; }
    if (!T.met) {
      T.met = true; T.t2 = 0;
      if (o.task && o.task.k !== "sleep" && o.task.k !== "eating") o.task = { k: "with", t: 0, until: 6, other: e };
      if (T.k === "tease") { L.meet(c, o.c, "squabble", 1); G.M.emote(o.rig, "swirl"); o.bub = 2; o.face = "sad"; setTimeout(() => o.face = null, 2400); G.M.emote(e.rig, "note"); e.bub = 1.2; floatText(o, "Hey!", 0xff8a10); }
    }
    T.t2 += dt;
    e.a += angTo(e.a, Math.atan2(o.x - e.x, o.z - e.z)) * Math.min(1, dt * 4);
    o.a += angTo(o.a, Math.atan2(e.x - o.x, e.z - o.z)) * Math.min(1, dt * 4);
    if (T.k === "social") {
      if (Math.random() < dt * 0.9) { const x = Math.random() < 0.5 ? e : o; G.M.emote(x.rig, (c.rel[o.c.id] || 0) > 25 ? "heart" : "note"); x.bub = 1.1; }
      L.meet(c, o.c, "chat", dt * 0.6); practise(e, "ins", dt * 0.9);
      /* close friends, both grown and content, fall a little in love; Heart Fruit hurries it */
      if (L.adult(c) && L.adult(o.c) && (c.rel[o.c.id] || 0) >= 45 && c.care.mood > 60 && o.c.care.mood > 60) { c.love = (c.love || 0) + dt * 0.12; o.c.love = (o.c.love || 0) + dt * 0.12; }
      if ((c.love || 0) >= 4 && (o.c.love || 0) >= 4 && !L.canBreed(c, o.c) && room()) { T.k = "court"; T.t2 = 0; o.task = { k: "with", t: 0, until: 9, other: e }; return "dance"; }
      o.st = "idle"; if (T.t2 > 5) { e.task = null; if (o.task && o.task.k === "with") o.task = null; maybeFriends(e, o); }
      return "idle";
    }
    if (T.k === "court") {
      o.st = "dance"; if (Math.random() < dt * 2) { const x = Math.random() < 0.5 ? e : o; G.M.emote(x.rig, "heart"); x.bub = 0.8; }
      if (T.t2 > 6) { e.task = null; if (o.task && o.task.k === "with") o.task = null; layEgg(e, o, "in the garden"); }
      return "dance";
    }
    if (T.k === "spar") {
      o.st = "train"; practise(e, "pow", dt * 2); practise(o, "agi", dt * 1.4); practise(o, "res", dt * 0.8);
      if (T.t2 > 6) { e.task = null; if (o.task && o.task.k === "with") o.task = null; const won = G.L.stat(e.c, "pow") + rnd(0, 60) > G.L.stat(o.c, "res") + rnd(0, 60); L.meet(c, o.c, (c.rel[o.c.id] || 0) < 0 ? "squabble" : "chat", 1); floatText(won ? e : o, "Won!", 0xffd21a); maybeFriends(e, o); }
      return "train";
    }
    if (T.k === "play") { T.met = true; T.wait = 1.4; const a = Math.atan2(o.x - e.x, o.z - e.z) + rnd(-0.5, 0.5); task(o, "flee", { x: o.x + Math.sin(a) * 4.5, z: o.z + Math.cos(a) * 4.5, until: 4 }); return "happy"; }
    if (T.k === "tease") { if (T.t2 > 2) { e.task = null; maybeFriends(e, o); } return "happy"; }
    return "idle";
  }
  /* a friendship or a rivalry, when it first becomes one, goes into both histories */
  function maybeFriends(a, b) {
    const L = G.L, r = a.c.rel[b.c.id] || 0, k = [a.c.id, b.c.id].sort().join(":");
    G.save.bonds = G.save.bonds || {};
    const was = G.save.bonds[k];
    const now = r >= 30 ? "friends" : r <= -25 ? "rivals" : null;
    if (now && now !== was) {
      G.save.bonds[k] = now;
      for (const [x, y] of [[a, b], [b, a]]) x.c.log.push([G.save.day, now === "friends" ? `Became friends with ${y.c.name}.` : `Fell out with ${y.c.name}: rivals now.`]);
      toast(now === "friends" ? `${a.c.name} and ${b.c.name} are friends now` : `${a.c.name} and ${b.c.name} are rivals now`, now === "friends" ? "heart" : "flame");
    }
  }
  /* the garden holds so many (the habitats that come later hold more) */
  const CAP = () => 30 + ((G.save.habitat && G.save.habitat.room) || 0);
  const room = () => G.save.chao.length + G.save.animals.length + G.items.filter(i => i.kind === "egg").length < CAP();
  /* two creatures' egg: between them in the garden, or by the pens' incubator */
  function layEgg(a, b, how) {
    const L = G.L, egg = L.breed(a.c, b.c, G.save);
    const pen = how === "at the pens";
    const x = pen ? G.W.spots.incubator.x + rnd(-0.6, 0.6) : (a.x + b.x) / 2, z = pen ? G.W.spots.incubator.z - 1.2 : (a.z + b.z) / 2;
    addItem("egg", null, x, z, egg);
    for (const [p, q] of [[a, b], [b, a]]) p.c.log.push([G.save.day, `Had an egg with ${q.c.name}.`]);
    G.save.ach.eggs = (G.save.ach.eggs || 0) + 1;
    toast(`${a.c.name} and ${b.c.name} had an egg!`, "heart"); jingle("dance");
    burst(x, G.W.ground(x, z) + 0.4, z, [0xf07ab0, 0xffffff, 0xffd21a], 18);
    persist();
    return egg;
  }
  const allRecs = () => { const out = Object.assign({}, G.save.book); for (const c of [...G.save.chao, ...G.save.animals]) out[c.id] = c; return out; };
  /* exploring turns things up: fruit, nuts, now and then a toy -- or an egg */
  function find(e) {
    const L = G.L, D = G.D, f = L.traitsOf(e.c).reduce((m, t) => m * (t.find || 1), 1) * (D.TEMPERS[e.c.genes.temper[0]].finds || 1);
    const r = Math.random();
    if (r < 0.012 * f && G.items.filter(i => i.kind === "egg").length < 6) {
      const pool = e.c.kind === "chao" ? ["chao-neutral-child"] : D.ANIMALS.filter(a => a.region === "central" && a.rarity <= 2).map(a => a.id);
      const id = pool[Math.floor(Math.random() * pool.length)];
      addItem("egg", null, e.x + 0.5, e.z + 0.5, L.egg(id, { from: `found by ${e.c.name} while exploring` }));
      toast(`${e.c.name} found an egg!`, "star"); e.c.log.push([G.save.day, "Found an egg while exploring."]);
      G.M.emote(e.rig, "exclaim"); e.bub = 2;
    } else if (r < 0.3 * f) {
      const id = ["nut", "berry", "round", "berry", "mushroom"][Math.floor(Math.random() * 5)];
      addItem("fruit", id, e.x + 0.4, e.z + 0.4); G.M.emote(e.rig, "exclaim"); e.bub = 1.4;
    }
  }
  function dropFruit(f) {
    const it = addItem("fruit", f.id, f.x, f.z);
    it.y = f.y; it.vy = 0; it.air = true; it.vx = rnd(-0.5, 0.5); it.vz = rnd(-0.5, 0.5);
    G.W.props.remove(f.mesh);
    return it;
  }
  function eatItem(e, it) {
    if (it.gone) { e.task = null; return; }
    removeItem(it);
    const m = G.M.prop("fruit", { id: it.id }); m.scale.setScalar(0.9);
    e.rig.arms.length ? e.rig.g.add(m) : e.rig.g.add(m);
    m.position.set(0, (e.rig.headY || 0.3) * 0.7, (e.rig.r || 0.2) * 1.2);
    e.task = { k: "eating", t: 0, until: 4, id: it.id, m };
  }
  function finishEat(e, T) {
    if (T.m) e.rig.g.remove(T.m);
    const out = G.L.feed(e.c, T.id); e.fails = 0;
    if (out && out.fav) { G.M.emote(e.rig, "heart"); e.bub = 1.6; floatText(e, "Favourite!", 0xf07ab0); }
    if (T.id === "heart" && G.L.adult(e.c)) { G.M.emote(e.rig, "heart"); e.bub = 3; floatText(e, "In love", 0xf07ab0); }
    e.task = null;
  }
  /* the cocoon: a Chao changing into what it's become */
  function cocoon(e, to) {
    const sp = G.D.species(to); if (!sp || e.cocoon) return;
    e.task = { k: "cocoon", t: 0, until: 999 };
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.5, 18, 14), new THREE.MeshLambertMaterial({ color: 0xf8f4ff, emissive: 0x6a6a8a, transparent: true, opacity: 0.0 }));
    m.position.y = 0.36; e.rig.g.add(m);
    e.cocoon = { to, t: 0, m };
    toast(`${e.c.name} is changing...`, "sparkle");
  }
  function cocoonTick(e, dt) {
    const C = e.cocoon, m = C.m, to = C.to, sp = G.D.species(to);
    C.t += dt; m.material.opacity = Math.min(0.96, C.t * 1.2); m.scale.setScalar(1 + Math.sin(C.t * 6) * 0.04);
    if (C.t < 5) return;
    {
      G.L.evolve(e.c, to, G.save.day);
      const at = [e.x, e.z];
      despawn(e); const ne = spawn(e.c, at[0], at[1]);
      ne.task = { k: "petted", t: 0, until: 2.5 };
      G.M.emote(ne.rig, "exclaim"); ne.bub = 2.5; jingle("born-change");
      burst(at[0], G.W.ground(at[0], at[1]) + 0.4, at[1], [0xffffff, 0xf8e070, 0x9ad8f8], 24);
      toast(`${e.c.name} changed into a ${sp.name}!`, "star");
      persist();
    }
  }

  /* ---------------------------------------------------------------- things on the ground */
  function addItem(kind, id, x, z, data) {
    const M = G.M;
    const m = kind === "egg" ? M.prop("egg", { look: data.look, spots: data.spots }) : M.prop(kind, { id });
    if (kind === "egg") m.scale.setScalar(1.2);
    shadowsOn(m);
    const it = { kind, id, data, m, x, z, y: G.W.ground(x, z), vx: 0, vz: 0, vy: 0, air: false };
    it.y = groundFor(null, x, z);
    m.position.set(x, it.y, z); G.scene.add(m); G.items.push(it);
    return it;
  }
  function removeItem(it) { it.gone = true; G.scene.remove(it.m); const i = G.items.indexOf(it); if (i >= 0) G.items.splice(i, 1); }
  function itemsTick(dt) {
    for (const it of G.items) {
      if (it.held) continue;
      if (it.air) {
        it.vy -= 16 * dt; it.x += it.vx * dt; it.z += it.vz * dt; it.y += it.vy * dt;
        if (G.W.blocked(it.x, it.z, 0.1)) { it.vx *= -0.4; it.vz *= -0.4; }
        const w = G.W.waterAt(it.x, it.z), g = groundFor(null, it.x, it.z), floor = w != null && (it.kind === "toy" || it.kind === "fruit") ? w - 0.05 : g;
        if (it.y <= floor) { it.y = floor; if (Math.abs(it.vy) > 2.5 && it.kind === "toy" && it.id === "ball") { it.vy = -it.vy * 0.45; } else { it.air = false; it.vy = 0; } it.vx *= 0.6; it.vz *= 0.6; }
      } else if (Math.abs(it.vx) + Math.abs(it.vz) > 0.05) { it.x += it.vx * dt; it.z += it.vz * dt; it.vx *= Math.pow(0.1, dt); it.vz *= Math.pow(0.1, dt); it.y = groundFor(null, it.x, it.z); }
      const RR = ((G.W.RG && G.W.RG.radius) || 44); if (Math.hypot(it.x, it.z) > RR) { const k = (RR - 1) / Math.hypot(it.x, it.z); it.x *= k; it.z *= k; }
      it.m.position.set(it.x, it.y, it.z);
      if (it.kind === "egg") eggTick(it, dt);
    }
  }
  /* an egg warms (faster in arms, faster still on the incubator, faster rubbed), wobbles, hatches */
  function eggTick(it, dt) {
    const e = it.data, sp = G.W.spots.incubator;
    const onInc = Math.hypot(it.x - sp.x, it.z - sp.z) < 1.8;
    e.warm += dt * (it.held ? 1.6 : onInc ? 2.2 : 0.8);
    const k = e.warm / e.need;
    it.m.rotation.z = k > 0.75 ? Math.sin(G.t * (10 + k * 10)) * 0.12 * (k - 0.6) : 0;
    if (k >= 1 && !it.held) hatch(it);
  }
  function hatch(it) {
    const L = G.L, D = G.D, e = it.data;
    removeItem(it);
    const c = L.hatch(e, G.save.day, G.save.region || "central"); c.region = G.save.region || "central";
    (c.kind === "chao" ? G.save.chao : G.save.animals).push(c);
    G.save.book[c.id] = L.record(c);
    for (const pid of c.parents || []) if (!G.save.book[pid]) { const p = [...G.save.chao, ...G.save.animals].find(x => x.id === pid); if (p) G.save.book[pid] = L.record(p); }
    const ent = spawn(c, it.x, it.z);
    ent.task = { k: "petted", t: 0, until: 3 };
    G.M.emote(ent.rig, "exclaim"); ent.bub = 3;
    burst(it.x, it.y + 0.3, it.z, [e.look[0], e.look[1], 0xffffff], 22);
    sfx("pop"); jingle(c.kind === "chao" && G.D.species(c.sp).align === "dark" ? "born-dark" : c.kind === "chao" && G.D.species(c.sp).align === "hero" ? "born-hero" : "born");
    G.save.ach.hatched = (G.save.ach.hatched || 0) + 1;
    persist();
    hatchCard(ent);
  }

  /* ---------------------------------------------------------------- the keeper */
  function keeperTick(dt) {
    const k = G.keeper, W = G.W, I = inputDir(), cam = G.cam.userData;
    if (G.menu || G.talking) { I.x = 0; I.y = 0; }
    const fx = -Math.sin(cam.yaw), fz = -Math.cos(cam.yaw), rx = Math.cos(cam.yaw), rz = -Math.sin(cam.yaw);
    let mx = fx * I.y + rx * I.x, mz = fz * I.y + rz * I.x;
    const mag = Math.min(1, Math.hypot(mx, mz));
    const run = (G.keys.Shift || I.run || mag > 0.92 && I.pad) && mag > 0.1;
    const wade = W.depth(k.x, k.z) > 0.15 && W.standAt(k.x, k.z) == null;
    const spd = (run ? 6.2 : 3.3) * (wade ? 0.55 : 1) * (G.held && G.held.kind === "creature" ? 0.9 : 1);
    if (mag > 0.05) { const n = Math.hypot(mx, mz); mx /= n; mz /= n; }
    const tvx = mx * spd * mag, tvz = mz * spd * mag;
    k.vx = lerp(k.vx, tvx, Math.min(1, dt * 10)); k.vz = lerp(k.vz, tvz, Math.min(1, dt * 10));
    const free = (x, z) => !W.blocked(x, z, 0.3, k.y) && !(W.depth(x, z) > 0.8 && W.standAt(x, z) == null) && !G.ents.some(e => !e.held && Math.hypot(e.x - x, e.z - z) < (e.rig.r || 0.2) * 0.5 + 0.2 && e.c.kind === "animal" && (e.sp.size || 0) > 0.9);
    const nx = k.x + k.vx * dt, nz = k.z + k.vz * dt;
    if (free(nx, k.z)) k.x = nx; else k.vx = 0;
    if (free(k.x, nz)) k.z = nz; else k.vz = 0;
    const sp = Math.hypot(k.vx, k.vz);
    if (sp > 0.3) k.a += angTo(k.a, Math.atan2(k.vx, k.vz)) * Math.min(1, dt * 12);
    const st = W.standAt(k.x, k.z), g = st != null ? Math.max(st, W.smooth(k.x, k.z)) : W.smooth(k.x, k.z);
    if (k.air) { k.vy -= 22 * dt; k.y += k.vy * dt; if (k.y <= g) { k.y = g; k.air = false; } }
    else if (g < k.y - 0.6) { k.air = true; k.vy = 0; }
    else k.y = lerp(k.y, g, Math.min(1, dt * 16));
    if (G.jump && !k.air) { k.air = true; k.vy = 7; sfx("jump"); }
    G.jump = false;
    k.rig.g.position.set(k.x, k.y, k.z); k.rig.g.rotation.y = k.a;
    const state = k.air ? "walk" : sp > 4.5 ? "run" : sp > 0.4 ? "walk" : "idle";
    k.rig.anim(G.t, dt, G.held ? (state === "idle" ? "carry" : state) : state, sp / 3.3);
    if (G.held) {
      /* what's held goes in front, in the arms */
      k.rig.arms.forEach((a, i) => { a.rotation.x = -1.3; a.rotation.z = (i ? 1 : -1) * 0.2; });
      const h = G.held, ox = Math.sin(k.a) * 0.42, oz = Math.cos(k.a) * 0.42, hy = k.y + 0.82;
      if (h.kind === "creature") { const e = h.e; e.x = k.x + ox; e.z = k.z + oz; e.y = hy - 0.15; e.a = k.a + PI; e.rig.g.position.set(e.x, e.y, e.z); e.rig.g.rotation.y = e.a; }
      else { h.it.x = k.x + ox; h.it.z = k.z + oz; h.it.y = hy; h.it.m.position.set(h.it.x, hy, h.it.z); }
    }
    W.update(k.x, k.z);
  }
  function camTick(dt) {
    const k = G.keeper, U = G.cam.userData, W = G.W;
    const rot = (G.keys.q ? 1 : 0) - (G.keys.e ? 1 : 0) + (G.pad.rx || 0) * -1;
    U.yaw += rot * dt * 2.2;
    if (G.pad.ry) U.pitch = clamp(U.pitch + G.pad.ry * dt * 1.2, 0.08, 1.2);
    /* drift behind the keeper as they walk, gently */
    const sp = Math.hypot(k.vx, k.vz);
    if (sp > 1 && !G.dragging && Math.abs(rot) < 0.01) U.yaw += angTo(U.yaw, k.a + PI) * Math.min(1, dt * 0.6 * (sp / 4));
    U.tx = lerp(U.tx, k.x, Math.min(1, dt * 8)); U.tz = lerp(U.tz, k.z, Math.min(1, dt * 8)); U.ty = lerp(U.ty, k.y + 1.0, Math.min(1, dt * 6));
    const cp = Math.cos(U.pitch), d = U.dist;
    let cx = U.tx + Math.sin(U.yaw) * d * cp, cz = U.tz + Math.cos(U.yaw) * d * cp, cy = U.ty + Math.sin(U.pitch) * d;
    /* never inside the hill behind */
    for (let t = 0.3; t <= 1; t += 0.1) { const x = lerp(U.tx, cx, t), z = lerp(U.tz, cz, t), y = lerp(U.ty, cy, t), g = W.ground(x, z) + 0.6; if (g > y) { cy = Math.max(cy, g + (1 - t) * 1.5); } }
    cy = Math.max(cy, W.ground(cx, cz) + 0.7);
    /* nor inside a building: pulled in toward the keeper till it's out */
    for (let t = 1; t > 0.15; t -= 0.05) {
      const x = lerp(U.tx, cx, t), z = lerp(U.tz, cz, t), y = lerp(U.ty, cy, t);
      if (!W.obst.some(o => o.box && !o.off && y < 7 && Math.abs(Math.cos(o.a) * (x - o.x) - Math.sin(o.a) * (z - o.z)) < o.w + 0.3 && Math.abs(Math.sin(o.a) * (x - o.x) + Math.cos(o.a) * (z - o.z)) < o.d + 0.3)) { cx = x; cz = z; cy = y; break; }
    }
    G.cam.position.set(cx, cy, cz);
    G.cam.lookAt(U.tx, U.ty, U.tz);
  }
  /* what's in reach, and what Z, C, X and V would do with it */
  function reach() {
    const k = G.keeper, fx = Math.sin(k.a), fz = Math.cos(k.a);
    const score = (x, z, r) => { const dx = x - k.x, dz = z - k.z, d = Math.hypot(dx, dz); if (d > r) return -1; return (1 - d / r) + Math.max(0, (dx * fx + dz * fz) / (d || 1)) * 0.6; };
    let best = null, bs = 0;
    const consider = (o, s) => { if (s > bs) { bs = s; best = o; } };
    for (const e of G.ents) if (!e.held && !e.cocoon) consider({ kind: "creature", e }, score(e.x, e.z, 1.7 + (e.rig.r || 0.2)));
    for (const it of G.items) if (!it.held) consider({ kind: it.kind, it }, score(it.x, it.z, 1.5) + 0.05);
    for (const t of G.W.trees) if (t.fruit) consider({ kind: "tree", t }, score(t.x, t.z, 2.4) - 0.2);
    for (const n in G.W.spots) { const s = G.W.spots[n]; consider({ kind: "spot", n, s }, score(s.x, s.z, s.r + 0.6) - 0.1); }
    for (const n of G.npcs || []) if (n.rig.g.visible) consider({ kind: "npc", n }, score(n.x, n.z, 2.2) + 0.1);
    return best;
  }
  function prompts() {
    const r = G.reach = reach(), h = G.held, P = [];
    const name = o => o.kind === "creature" ? o.e.c.name : o.kind === "fruit" ? G.D.food(o.it.id).name : o.kind === "toy" ? G.D.toy(o.it.id).name : o.kind === "egg" ? "the egg" : "";
    if (h) {
      if (h.kind === "fruit" && r && r.kind === "creature") P.push(["Z", `Feed ${r.e.c.name}`]);
      else if (h.kind === "toy" && r && r.kind === "creature") P.push(["Z", `Give ${r.e.c.name} the ${G.D.toy(h.it.id).name.toLowerCase()}`]);
      else if (h.kind === "egg" && r && r.kind === "spot" && r.n === "incubator") P.push(["Z", "Set it on the incubator"]);
      else P.push(["Z", "Put down"]);
      if (h.kind === "creature") P.push(["C", "Cuddle"]); else if (h.kind === "egg") P.push(["C", "Rub it warm"]);
      P.push(["X", h.kind === "creature" ? "Throw" : "Toss"]);
      if (h.kind === "creature" || h.kind === "egg") P.push(["V", "Look"]);
    } else if (r) {
      if (r.kind === "creature") { P.push(["Z", `Pick up ${r.e.c.name}`], ["C", "Pet"], ["V", "Look"]); }
      else if (r.kind === "tree") P.push(["Z", "Shake the tree"]);
      else if (r.kind === "spot") { const n = r.n; P.push(["Z", n === "incubator" ? "The incubator" : n === "mailbox" ? (G.save.mail && G.save.mail.length ? `Mailbox (${G.save.mail.length})` : "Mailbox") : n === "book" ? "The encyclopedias" : n === "hall" ? "The Garden Hall" : n.startsWith("gate") ? (r.s.gate.open ? `Into the ${r.s.gate.name}` : `The way to the ${r.s.gate.name}`) : n === "exit" ? "Back to the Central Garden" : r.s.dojo ? "The dojo" : r.s.arena ? "The Garden League's arena" : n === "pier" ? "The pier" : n === "lake" ? "The frozen lake" : n === "altar" ? "The altar" : n === "observatory" ? "The observatory" : ""]); }
      else if (r.kind === "npc") P.push(["Z", `Talk to ${r.n.name}`]);
      else { P.push(["Z", `Pick up ${name(r)}`]); if (r.kind === "egg") P.push(["V", "Look"]); }
    }
    if (!h && !(r && r.kind === "creature")) P.push(["X", "Whistle"]);
    const html = P.map(([k, t]) => `<span class="cg-p"><b>${k}</b>${esc(t)}</span>`).join("");
    if (html !== G.lastPrompt) { G.lastPrompt = html; G.hud.querySelector(".cg-prompt").innerHTML = html; }
  }
  /* -- the actions */
  function actZ() {
    const r = G.reach, h = G.held, k = G.keeper, L = G.L;
    if (h) {
      if (h.kind === "fruit" && r && r.kind === "creature") { const e = r.e, it = h.it; G.held = null; it.held = false; eatItem(e, it); e.c.bond = clamp(e.c.bond + 1.5, 0, 100); G.L.raise(e.c, "hero", 2); sfx("grab"); return; }
      if (h.kind === "toy" && r && r.kind === "creature") { const e = r.e, it = h.it; drop(); it.x = e.x + Math.sin(e.a) * 0.4; it.z = e.z + Math.cos(e.a) * 0.4; e.task = null; task(e, "play", { toy: it }); e.c.bond = clamp(e.c.bond + 1, 0, 100); if (e.c.genes.likes.toy === it.id) { G.M.emote(e.rig, "heart"); e.bub = 1.6; floatText(e, "Favourite!", 0xf07ab0); e.c.care.mood = clamp(e.c.care.mood + 12, 0, 100); } return; }
      if (h.kind === "egg" && r && r.kind === "spot" && r.n === "incubator") { const it = h.it; drop(); const s = G.W.spots.incubator; it.x = s.x + rnd(-0.3, 0.3); it.z = s.z + rnd(-0.3, 0.3); it.y = s.y; it.m.position.set(it.x, it.y, it.z); toast("The egg is warm on the incubator", "flame"); return; }
      drop(); return;
    }
    if (!r) return;
    if (r.kind === "creature") { pickUp({ kind: "creature", e: r.e }); return; }
    if (r.kind === "fruit" || r.kind === "toy" || r.kind === "egg") { pickUp({ kind: r.kind, it: r.it, id: r.it.id }); return; }
    if (r.kind === "tree") { const f = G.W.shake(r.t); sfx("stumble"); r.t.m.rotation.z = 0.06; setTimeout(() => { if (r.t.m) { r.t.m.rotation.z = 0; r.t.m.updateMatrix(); } }, 160); r.t.m.updateMatrix(); if (f) dropFruit(f); else toast("No fruit on it yet: it'll grow more", "clover"); return; }
    if (r.kind === "npc") { r.n.f.talk(); return; }
    if (r.kind === "spot") {
      const n = r.n;
      if (n === "mailbox") { const S = G.save; if (!S.mail || !S.mail.length) { toast("The mailbox is empty", "mail"); return; } let i = 0; for (const e of S.mail) { addItem("egg", null, r.s.x + Math.cos(i) * 1.2 - 0.6, r.s.z - 1 + Math.sin(i) * 0.6, e); i++; } toast(`${S.mail.length} egg${S.mail.length > 1 ? "s" : ""} from the mailbox`, "mail"); S.mail = []; persist(); sfx("grab"); return; }
      if (n === "book") { encyclopedia(); return; }
      if (n === "hall") { hallMenu(); return; }
      if (n === "incubator") { toast("Eggs set here hatch twice as fast", "flame"); return; }
      if (n.startsWith("gate")) { const g = r.s.gate; if (g.open) travel(g.id); else talk([["Sign", `To the ${g.name}. ${(GATE_RULES[g.id] || {}).why || g.need}`]]); return; }
      if (n === "exit") { travel("central", G.W.id); return; }
      if (r.s.dojo) { dojoMenu(r.s.dojo); return; }
      if (r.s.arena) { leagueMenu(); return; }
      if (n === "pier") { talk([["", "The pier creaks underfoot. Fish dart in the clear water below; the swimmers love it here."]]); return; }
      if (n === "lake") { talk([["", "The lake is frozen solid. Something glints under the ice."]]); return; }
      if (n === "altar") { talk([["", "An old altar at the court's heart. Carvings round its edge show Chao, and a great light over them."]]); return; }
      if (n === "observatory") { talk([["", "The old observatory. Its telescope points at a patch of sky where the stars gather thickest."]]); return; }
    }
  }
  function pickUp(h) {
    if (h.kind === "creature") {
      const e = h.e; e.held = true; e.task = null; e.st = "held"; G.held = { kind: "creature", e };
      const shy = e.c.genes.temper[0] === "shy" && e.c.bond < 30;
      if (shy) { G.M.emote(e.rig, "exclaim"); e.bub = 1.4; } else if (e.c.genes.traits.includes("cuddly")) { G.M.emote(e.rig, "heart"); e.bub = 1.4; }
      G.save.seen[e.c.sp] = true; sfx("grab");
    } else { h.it.held = true; G.held = h; sfx("grab"); }
  }
  function drop(toss) {
    const h = G.held; if (!h) return; G.held = null;
    const k = G.keeper, fx = Math.sin(k.a), fz = Math.cos(k.a);
    if (h.kind === "creature") {
      const e = h.e; e.held = false;
      if (toss) { e.air = true; e.vy = 5.5; e.tvx = fx * 4.5; e.tvz = fz * 4.5; G.L.rough(e.c); G.M.emote(e.rig, "swirl"); e.bub = 2.4; sfx("swing"); }
      else { e.x = k.x + fx * 0.6; e.z = k.z + fz * 0.6; if (!canStand(e, e.x, e.z)) { e.x = k.x; e.z = k.z; } e.y = groundFor(e, e.x, e.z); e.task = { k: "petted", t: 0, until: 0.8 }; }
    } else {
      const it = h.it; it.held = false;
      it.x = k.x + fx * 0.6; it.z = k.z + fz * 0.6;
      if (toss) { it.air = true; it.vy = 4.5; it.vx = fx * 5; it.vz = fz * 5; it.x = k.x + fx * 0.4; it.z = k.z + fz * 0.4; sfx("swing"); }
      else { it.air = true; it.vy = 0; it.vx = 0; it.vz = 0; }
      if (G.W.blocked(it.x, it.z, 0.1)) { it.x = k.x; it.z = k.z; }
    }
  }
  function actC() {
    const r = G.reach, h = G.held, L = G.L;
    if (h && h.kind === "creature") { const e = h.e; L.pet(e.c); L.pet(e.c); G.M.emote(e.rig, "heart"); e.bub = 1.5; e.face = "happy"; setTimeout(() => e.face = null, 900); chirp(1100); return; }
    if (h && h.kind === "egg") { h.it.data.warm += 3; floatAt(h.it.x, h.it.y + 0.5, h.it.z, "Warm", 0xff8a10); return; }
    if (r && r.kind === "creature") {
      const e = r.e; L.pet(e.c);
      const shy = e.c.genes.temper[0] === "shy" && e.c.bond < 25;
      e.task = { k: "petted", t: 0, until: 1.6 }; e.st = "happy";
      G.M.emote(e.rig, shy ? "exclaim" : "heart"); e.bub = 1.4; chirp(shy ? 700 : 1100);
      if (e.c.care.mood > 80 && Math.random() < 0.25) floatText(e, "♥", 0xf07ab0);
      G.save.ach.pets = (G.save.ach.pets || 0) + 1;
    }
  }
  function actX() {
    if (G.held) { drop(true); return; }
    /* a whistle: those who are fond of the keeper come; the rest look round */
    sfx("check");
    for (const e of G.ents) { const d = Math.hypot(e.x - G.keeper.x, e.z - G.keeper.z); if (d > 18 || e.held || e.cocoon || (e.task && (e.task.k === "sleep" && e.task.down))) continue; if (e.c.bond > 25 || e.c.genes.temper.includes("affectionate")) { task(e, "follow", { until: 12 }); G.M.emote(e.rig, "exclaim"); } else { G.M.emote(e.rig, "question"); } e.bub = 1.4; }
    floatAt(G.keeper.x, G.keeper.y + 2.1, G.keeper.z, "♪", 0xffd21a);
  }
  function actV() {
    const r = G.reach, h = G.held;
    const e = h && h.kind === "creature" ? h.e : r && r.kind === "creature" ? r.e : null;
    if (e) { card(e.c); return; }
    const it = h && h.kind === "egg" ? h.it : r && r.kind === "egg" ? r.it : null;
    if (it) { const d = it.data, k = d.warm / d.need; talk([["Egg", `${d.from ? esc(d.from[0].toUpperCase() + d.from.slice(1)) + ". " : ""}${k < 0.3 ? "Cool still: it needs a while yet." : k < 0.7 ? "Warm, and something stirs inside." : "It's wobbling! It'll hatch any moment."}`]]); }
  }
  function hazelTalk() {
    const S = G.save, tips = [
      "Every Chao is its own. Two from the same egg-mother can grow up nothing alike -- it's in what they're born with, and how they're raised.",
      "Kindness makes a Chao bright -- the Hero sort, halo and all. Rough handling, and the dark comes out in them. Too long with the animals, and they go Wild.",
      "Whatever a Chao does with its days, it gets good at. The swimmers in the pond grow tough, the runners fast, the dreamers clever.",
      "Feed them what they love and you'll see it. Each one has a favourite -- fruit, a toy, a spot in the garden.",
      "When a Chao's grown enough, it'll wrap itself up and come out changed. What it changes into is everything it's done.",
      "The animals freed out in the zones send their eggs here, by the mailbox. Eight freed, one egg.",
      "Two that are fond of each other, grown, might have an egg of their own one day. The Society's breeding pens open later -- I'll tell you when.",
      "The gates round the rim lead to the other gardens: Tropical, Forest, Mountain, Mystic, Mechanical, and the Sky Garden up the balloon. Not open yet, I'm afraid.",
    ];
    S.tip = ((S.tip || 0) + 1) % tips.length;
    talk([["Hazel", tips[S.tip]]]);
  }

  /* ---------------------------------------------------------------- the loop */
  function frame(now) {
    if (!G) return;
    G.raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, Math.max(0, (now - (G.last || now)) / 1000)); G.last = now;
    resize(); pollPad();
    if (!G.keeper) { G.R.render(G.scene, G.cam); return; }
    if (G.battle) { G.battle.frame(dt); return; }
    step(dt);
    G.R.render(G.scene, G.cam);
  }
  function step(dt) {
    const paused = !!G.menu;
    if (!paused) {
      G.t += dt; G.save.day += dt / DAY;
      keeperTick(dt);
      for (const e of G.ents.slice()) { live(e, dt); place(e); }
      separate();
      itemsTick(dt);
      G.W.growFruit(dt, t => G.ents.some(e => e.c.genes.traits.includes("greenthumb") && Math.hypot(e.x - t.x, e.z - t.z) < 8) ? 1.6 : 1);
      G.W.tick(dt);
      for (const n of G.npcs || []) { n.rig.g.visible = folkIn(n); if (n.rig.g.visible) n.rig.anim(G.t, dt, "idle"); }
      G.saveT += dt; if (G.saveT > 25) { G.saveT = 0; persist(); gates(); }
      elsewhere(dt);
      const dn = Math.floor(G.save.day); if (G.dayN !== dn) { if (G.dayN != null) dawn(dn); G.dayN = dn; }
    }
    camTick(dt); light();
    if (!paused) prompts();
    tagsTick(dt); floatsTick(dt); hudTick();
  }
  /* a new day: a gift in the mail now and then */
  function dawn(n) {
    toast(`Day ${n + 1}`, "sun");
    const S = G.save;
    if (Math.random() < 0.35 && (S.mail || []).length < 8) { S.mail = S.mail || []; const pool = G.D.ANIMALS.filter(a => a.region === "central" && a.rarity <= 2); const sp = pool[Math.floor(Math.random() * pool.length)]; S.mail.push(G.L.egg(Math.random() < 0.5 ? "chao-neutral-child" : sp.id, { from: "sent by the Garden Society, with its compliments" })); toast("Something arrived in the mailbox", "mail"); }
    persist();
  }
  /* a creature's rig: placed, turned, animated, its ball and its tag */
  function place(e) {
    const r = e.rig;
    if (e.c) {
      if (!e.held && !e.air) { const g = groundFor(e, e.x, e.z); e.y = lerp(e.y, g, 0.25); }
      r.g.position.set(e.x, e.y, e.z); r.g.rotation.y = e.a;
      r.face = e.face || null;
      r.anim(G.t, 1 / 60, e.held ? "held" : e.st, e.v);
      if (e.bub > 0) { e.bub -= 1 / 60; if (e.bub <= 0) G.M.emote(r, "ball"); }
    } else { r.g.position.set(e.x, e.y, e.z); r.g.rotation.y = e.a; }
  }
  /* nobody stands inside anybody else: creatures shuffle apart, and out of the keeper's way */
  function separate() {
    const E = G.ents, k = G.keeper;
    for (let i = 0; i < E.length; i++) {
      const a = E[i]; if (a.held || a.air || a.cocoon) continue;
      const ra = (a.rig.r || 0.25) * a.rig.g.scale.x * 0.7;
      for (let j = i + 1; j < E.length; j++) {
        const b = E[j]; if (b.held || b.air || b.cocoon) continue;
        const rb = (b.rig.r || 0.25) * b.rig.g.scale.x * 0.7, dx = b.x - a.x, dz = b.z - a.z, d = Math.hypot(dx, dz), m = ra + rb;
        if (d < m && d > 1e-4) { const p = (m - d) * 0.5, ux = dx / d, uz = dz / d; if (canStand(a, a.x - ux * p, a.z - uz * p)) { a.x -= ux * p; a.z -= uz * p; } if (canStand(b, b.x + ux * p, b.z + uz * p)) { b.x += ux * p; b.z += uz * p; } }
      }
      if (k) { const dx = a.x - k.x, dz = a.z - k.z, d = Math.hypot(dx, dz), m = ra + 0.3; if (d < m && d > 1e-4) { const p = m - d; if (canStand(a, a.x + dx / d * p, a.z + dz / d * p)) { a.x += dx / d * p; a.z += dz / d * p; } } }
    }
  }
  /* little sparkles of voxels */
  function burst(x, y, z, cols, n) {
    const g = new THREE.BoxGeometry(0.07, 0.07, 0.07);
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: cols[i % cols.length] }));
      m.position.set(x, y, z); G.scene.add(m);
      const v = [rnd(-2, 2), rnd(1.5, 4.5), rnd(-2, 2)]; let life = rnd(0.5, 0.9);
      G.floats.push({ m3: m, v, life });
    }
  }

  /* ---------------------------------------------------------------- the HUD, tags, toasts */
  function buildHud() {
    G.hud.innerHTML = `
      <div class="cg-clock"><span class="cg-sun"></span><b></b><i></i></div>
      <div class="cg-rings"><span class="cg-ring"></span><b></b></div>
      <div class="cg-toasts"></div>
      <div class="cg-prompt"></div>
      <button class="cg-menu-btn" data-cgmenu>${ico("chevrons")}<span>Menu</span></button>`;
    G.hud.querySelector("[data-cgmenu]").onclick = () => mainMenu();
    if (matchMedia("(pointer: coarse)").matches || "ontouchstart" in root) touchPad();
  }
  function hudTick() {
    const t = tod(), h = Math.floor(t * 24), m = Math.floor((t * 24 - h) * 60 / 10) * 10;
    const s = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`, d = `Day ${Math.floor(G.save.day) + 1}`;
    if (s !== G.hudS) { G.hudS = s; const c = G.hud.querySelector(".cg-clock"); c.querySelector("b").textContent = s; c.querySelector("i").textContent = d; c.querySelector(".cg-sun").innerHTML = ico(isNight() ? "moon" : "sun"); }
    const rings = G.save.rings; if (rings !== G.hudR) { G.hudR = rings; G.hud.querySelector(".cg-rings b").textContent = rings; }
  }
  const V3 = new THREE.Vector3();
  function project(x, y, z) { V3.set(x, y, z).project(G.cam); if (V3.z > 1) return null; return [(V3.x + 1) / 2 * G.w, (1 - V3.y) / 2 * G.h]; }
  /* name tags over the creatures near the keeper */
  function tagsTick() {
    const k = G.keeper; if (!k) return;
    for (const e of G.ents) {
      const d = Math.hypot(e.x - k.x, e.z - k.z), show = d < 7 && !G.menu, near = G.reach && G.reach.e === e;
      let tag = G.tags.get(e);
      if (!show) { if (tag) tag.style.display = "none"; continue; }
      if (!tag) { tag = document.createElement("div"); tag.className = "cg-tag"; G.tagBox.append(tag); G.tags.set(e, tag); }
      const p = project(e.x, e.y + (e.rig.h || 0.6) * (e.rig.g.scale.x || 1) + 0.12, e.z);
      if (!p) { tag.style.display = "none"; continue; }
      tag.style.display = ""; tag.style.transform = `translate(${p[0].toFixed(0)}px,${p[1].toFixed(0)}px) translate(-50%,-100%)`;
      const html = `<b>${esc(e.c.name)}</b>${near ? `<i>${esc(G.D.species(e.c.sp).name)}</i>` : ""}`;
      if (tag._h !== html) { tag._h = html; tag.innerHTML = html; }
      tag.classList.toggle("near", !!near); tag.style.opacity = clamp(1.4 - d / 7, 0.2, 1);
    }
  }
  function floatText(e, text, col, soft) { floatAt(e.x, e.y + (e.rig.h || 0.6) + 0.25, e.z, text, col, soft); }
  function floatAt(x, y, z, text, col, soft) {
    if (!G) return;
    const el = document.createElement("div"); el.className = "cg-float" + (soft ? " soft" : ""); el.textContent = text; el.style.color = "#" + (col || 0xffffff).toString(16).padStart(6, "0");
    G.tagBox.append(el); G.floats.push({ el, x, y, z, life: 1.4, t: 0 });
  }
  function floatsTick(dt) {
    for (const f of G.floats.slice()) {
      f.life -= dt;
      if (f.m3) { f.v[1] -= 9 * dt; f.m3.position.x += f.v[0] * dt; f.m3.position.y += f.v[1] * dt; f.m3.position.z += f.v[2] * dt; f.m3.scale.setScalar(Math.max(0.01, f.life * 1.5)); }
      else { f.t += dt; const p = project(f.x, f.y + f.t * 0.5, f.z); if (p) f.el.style.transform = `translate(${p[0].toFixed(0)}px,${p[1].toFixed(0)}px) translate(-50%,-100%)`; f.el.style.opacity = clamp(f.life * 1.6, 0, 1); }
      if (f.life <= 0) { if (f.m3) { G.scene.remove(f.m3); f.m3.material.dispose(); } else f.el.remove(); G.floats.splice(G.floats.indexOf(f), 1); }
    }
  }
  function toast(text, icon) {
    if (!G) return;
    const box = G.hud.querySelector(".cg-toasts"); if (!box) return;
    const el = document.createElement("div"); el.className = "cg-toast"; el.innerHTML = `${icon ? ico(icon) : ""}<span>${esc(text)}</span>`;
    box.append(el); while (box.children.length > 3) box.firstChild.remove();
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 400); }, 3600);
  }

  /* ---------------------------------------------------------------- talk */
  function talk(lines, done) {
    G.talking = true;
    let i = 0;
    const box = document.createElement("div"); box.className = "cg-talk";
    G.el.append(box);
    const show = () => {
      const [who, text] = lines[i];
      box.innerHTML = `<div class="cg-talk-box"><b>${esc(who)}</b><p>${text}</p><span class="cg-talk-next">${i < lines.length - 1 ? "Z" : "Z  OK"}</span></div>`;
    };
    const next = () => { i++; if (i >= lines.length) { box.remove(); G.talking = null; G.talkNext = null; if (done) done(); } else show(); };
    box.onclick = next; G.talkNext = next;
    show();
  }

  /* ---------------------------------------------------------------- menus
     Full screens over the garden (the garden waits). Arrows move between the buttons, Z or
     Enter picks, X or Escape goes back. */
  function menuOpen(html, back, cls) {
    if (G.menu) G.menu.el.remove();
    const el = document.createElement("div"); el.className = "cg-menu " + (cls || "");
    el.innerHTML = html; G.ov.append(el);
    G.menu = { el, back: back || menuClose };
    const f = el.querySelector("[data-focus]") || el.querySelector("[data-f]");
    setFocus(G.kbUsed ? f : null);
    return el;
  }
  function menuClose() { if (G.menu) { G.menu.el.remove(); G.menu = null; } stopPreviews(); if (G.keeper) music(gardenTune()); }
  const gardenTune = () => (G && G.W && G.W.RG && G.W.RG.music) || "garden";
  function setFocus(el) { if (!G.menu) return; G.menu.el.querySelectorAll(".kb").forEach(b => b.classList.remove("kb")); G.focus = el; if (el) { el.classList.add("kb"); el.scrollIntoView({ block: "nearest" }); } }
  function moveFocus(dx, dy) {
    if (!G.menu) return;
    const all = [...G.menu.el.querySelectorAll("[data-f]")].filter(b => b.offsetParent && !b.disabled);
    if (!all.length) return;
    const cur = G.focus && all.includes(G.focus) ? G.focus : null;
    if (!cur) { setFocus(all[0]); return; }
    if (cur.dataset.row != null && dx && G.menu.row) { G.menu.row(cur, dx); return; }
    const a = cur.getBoundingClientRect(), ax = a.left + a.width / 2, ay = a.top + a.height / 2;
    let best = null, bs = 1e9;
    for (const b of all) {
      if (b === cur) continue;
      const r = b.getBoundingClientRect(), bx = r.left + r.width / 2, by = r.top + r.height / 2, ddx = bx - ax, ddy = by - ay;
      if (dx && Math.sign(ddx) !== dx || dx && Math.abs(ddx) < 4) continue;
      if (dy && Math.sign(ddy) !== dy || dy && Math.abs(ddy) < 4) continue;
      const s = dx ? Math.abs(ddx) + Math.abs(ddy) * 2.5 : Math.abs(ddy) + Math.abs(ddx) * 2.5;
      if (s < bs) { bs = s; best = b; }
    }
    if (best) setFocus(best);
  }
  const sec = (title, icon, body, cls) => `<div class="panel cg-panel ${cls || ""}"><div class="panel-hd">${icon ? ico(icon) : ""}${title}</div>${body}</div>`;
  function mainMenu() {
    if (G.menu || G.talking || !G.keeper) return;
    const S = G.save, nC = S.chao.length, nA = S.animals.length;
    menuOpen(sec("Chao Garden", "clover", `
      <div class="cg-mm">
        <button class="cg-mi" data-f data-focus data-go="creatures">${ico("heart")}<b>Garden</b><i>${nC} Chao, ${nA} animal${nA === 1 ? "" : "s"}${G.items.filter(i => i.kind === "egg").length ? `, ${G.items.filter(i => i.kind === "egg").length} egg${G.items.filter(i => i.kind === "egg").length === 1 ? "" : "s"}` : ""}</i></button>
        <button class="cg-mi" data-f data-go="book">${ico("book")}<b>Encyclopedias</b><i>${Object.keys(S.seen).filter(k => k.startsWith("chao")).length}/${G.D.CHAO.length} Chao, ${Object.keys(S.seen).filter(k => k.startsWith("an-")).length}/${G.D.ANIMALS.length} animals</i></button>
        <button class="cg-mi" data-f data-go="bag">${ico("clipboard")}<b>Bag</b><i>Fruit and things to take out</i></button>
        <button class="cg-mi" data-f data-go="keeper">${ico("person")}<b>Keeper</b><i>${esc(S.avatar.name || "You")}: change how you look</i></button>
        <button class="cg-mi" data-f data-go="leave">${ico("door")}<b>Save and leave</b><i>Back to the cabinet's menu</i></button>
      </div>
      <p class="cg-keys"><b>Arrows</b> move &nbsp; <b>Shift</b> run &nbsp; <b>Space</b> jump &nbsp; <b>Z</b> pick up / use &nbsp; <b>C</b> pet &nbsp; <b>X</b> throw / whistle &nbsp; <b>V</b> look &nbsp; <b>Q E</b> or drag: camera</p>`, "cg-small"));
    G.menu.el.querySelectorAll("[data-go]").forEach(b => b.onclick = () => {
      const k = b.dataset.go;
      if (k === "creatures") creaturesList(); else if (k === "book") encyclopedia(); else if (k === "bag") bag(); else if (k === "keeper") creator(false); else if (k === "leave") { menuClose(); persist(); close(); }
    });
  }
  function creaturesList() {
    const S = G.save, all = [...S.chao, ...S.animals];
    const row = c => { const sp = G.D.species(c.sp); return `<button class="cg-crow" data-f data-c="${c.id}"><canvas width="96" height="96" data-thumb="${c.id}"></canvas><span><b>${esc(c.name)}</b><i>${esc(sp.name)}</i><em>${ico("heart")} ${Math.round(c.bond)} &nbsp; Lv ${G.L.lvSum(c)}</em></span></button>`; };
    const el = menuOpen(sec("The garden's own", "heart", `
      ${all.length ? `<div class="cg-grid">${all.map(row).join("")}</div>` : `<p class="cg-empty">Nobody yet: the eggs by the incubator will hatch soon.</p>`}
      <div class="cg-foot"><button class="btn ghost" data-f data-back>${ico("back")}Back</button></div>`, "cg-wide"), () => mainMenu());
    el.querySelector("[data-back]").onclick = () => { menuClose(); mainMenu(); };
    el.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { const c = all.find(x => x.id === b.dataset.c); card(c, () => creaturesList()); });
    thumbs(el, id => all.find(c => c.id === id));
  }
  /* a creature's card: everything about it */
  function card(c, back) {
    const D = G.D, L = G.L, sp = D.species(c.sp), T = c.genes.temper.map(t => D.TEMPERS[t]);
    const all = [...G.save.chao, ...G.save.animals], who = id => (all.find(x => x.id === id) || G.save.book[id] || { name: "?" }).name;
    const friends = Object.entries(c.rel).filter(([, v]) => v >= 30).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([id]) => who(id));
    const rivals = Object.entries(c.rel).filter(([, v]) => v <= -25).sort((a, b) => a[1] - b[1]).slice(0, 3).map(([id]) => who(id));
    const bar = (v, col) => `<span class="cg-bar"><span style="width:${clamp(v, 0, 100).toFixed(0)}%;background:${col}"></span></span>`;
    const attrs = D.ATTRS.map(a => `<div class="cg-attr"><b style="color:#${a.c.toString(16).padStart(6, "0")}">${a.short}</b><em class="g-${L.grade(c, a.id)}">${L.grade(c, a.id)}</em><span>Lv ${c.lv[a.id]}</span>${bar(c.xp[a.id], "#" + a.c.toString(16).padStart(6, "0"))}<i>${L.stat(c, a.id)}</i></div>`).join("");
    const techs = c.techs.map(id => D.tech(id)).filter(Boolean).map(t => `<span class="cg-chip" title="${esc(t.text)}">${esc(t.name)}</span>`).join("");
    const traits = L.traitsOf(c).map(t => `<span class="cg-chip ${t.rare ? "rare" : ""}" title="${esc(t.text)}">${esc(t.name)}</span>`).join("");
    const age = c.age < 1 ? (h => `${h} hour${h === 1 ? "" : "s"} old`)(Math.max(1, Math.round(c.age * 24))) : `${Math.floor(c.age)} day${Math.floor(c.age) === 1 ? "" : "s"} old`;
    const al = c.kind === "chao" ? (() => { const a = c.align, tot = Math.max(1, a.hero + a.dark + a.wild + a.mech); return `<div class="cg-align"><span style="width:${a.hero / tot * 100}%" class="h"></span><span style="width:${a.dark / tot * 100}%" class="d"></span><span style="width:${a.wild / tot * 100}%" class="w"></span><span style="width:${a.mech / tot * 100}%" class="m"></span></div><p class="cg-small-note">Leaning: ${D.ALIGNS[L.leadAlign(c)].name}${c.stage === 0 ? " -- if it changed today" : ""}</p>`; })() : "";
    const el = menuOpen(`<div class="panel cg-panel cg-card"><div class="panel-hd">${ico(c.kind === "chao" ? "star" : "clover")}${esc(c.name)}<small>${esc(sp.name)}</small></div>
      <div class="cg-card-body">
        <div class="cg-card-l"><canvas class="cg-prev" width="300" height="300"></canvas>
          <div class="cg-care"><label>Food</label>${bar(c.care.food, "#ff8a10")}<label>Energy</label>${bar(c.care.energy, "#6fe6ff")}<label>Mood</label>${bar(c.care.mood, "#ffd21a")}<label>Bond</label>${bar(c.bond, "#f07ab0")}</div>
          ${al}
        </div>
        <div class="cg-card-r">
          <p class="cg-meta">Generation ${c.gen} &middot; ${age}${c.parents ? ` &middot; child of ${esc(who(c.parents[0]))} and ${esc(who(c.parents[1]))}` : ""}</p>
          <div class="cg-tempers">${T.map((t, i) => `<div class="cg-temper ${i ? "second" : ""}"><b>${esc(t.name)}</b><i>${esc(t.text)}</i></div>`).join("")}</div>
          <div class="cg-attrs">${attrs}</div>
          <h4>Quirks</h4><div class="cg-chips">${traits || "<i>None to speak of</i>"}</div>
          <h4>Techniques</h4><div class="cg-chips">${techs}</div>
          <h4>Likes</h4><p class="cg-likes">${esc(D.food(c.genes.likes.food).name)}, the ${esc(D.toy(c.genes.likes.toy).name.toLowerCase())}, and being ${({ water: "by the water", trees: "under the trees", flowers: "among the flowers", high: "up high", sun: "in the sun", shade: "in the shade", people: "near people" })[c.genes.likes.place]}</p>
          ${friends.length || rivals.length ? `<h4>Friends and rivals</h4><p class="cg-likes">${friends.length ? `Friends: ${friends.map(esc).join(", ")}. ` : ""}${rivals.length ? `Rivals: ${rivals.map(esc).join(", ")}.` : ""}</p>` : ""}
          <h4>Its story</h4><ul class="cg-log">${c.log.slice(-6).reverse().map(([d, t]) => `<li><b>Day ${Math.floor(d) + 1}</b>${esc(t)}</li>`).join("")}</ul>
        </div>
      </div>
      <div class="cg-foot"><button class="btn ghost" data-f data-back>${ico("back")}Back</button><button class="btn ghost" data-f data-fam>${ico("person")}Family</button><button class="btn" data-f data-focus data-rename>${ico("clipboard")}Rename</button></div></div>`, back ? () => { menuClose(); back(); } : menuClose, "cg-cardwrap");
    el.querySelector("[data-fam]").onclick = () => family(c, back);
    el.querySelector("[data-back]").onclick = () => { menuClose(); if (back) back(); };
    el.querySelector("[data-rename]").onclick = () => nameIt(c, () => card(c, back));
    livePreview(el.querySelector(".cg-prev"), () => G.M.creature(c));
  }
  function nameIt(c, then) {
    const el = menuOpen(sec("A name", "clipboard", `<div class="cg-name"><input maxlength="14" value="${esc(c.name)}" spellcheck="false"><div class="cg-foot"><button class="btn ghost" data-f data-rand>${ico("swap")}Another</button><button class="btn" data-f data-ok>${ico("check")}OK</button></div></div>`, "cg-small"), then);
    const inp = el.querySelector("input"); setTimeout(() => { inp.focus(); inp.select(); }, 30);
    const ok = () => { const v = inp.value.trim().slice(0, 14); if (v) { c.name = v; const e = G.ents.find(x => x.c === c); if (e) { const t = G.tags.get(e); if (t) t._h = null; } } persist(); menuClose(); if (then) then(); };
    el.querySelector("[data-ok]").onclick = ok;
    el.querySelector("[data-rand]").onclick = () => { inp.value = G.L.NAMES[Math.floor(Math.random() * G.L.NAMES.length)]; };
    inp.onkeydown = ev => { ev.stopPropagation(); if (ev.key === "Enter") ok(); if (ev.key === "Escape") { menuClose(); if (then) then(); } };
  }
  function hatchCard(e) {
    const c = e.c, sp = G.D.species(c.sp);
    G.save.ach.first = G.save.ach.first || c.id;
    const el = menuOpen(`<div class="panel cg-panel cg-hatch"><div class="panel-hd gold">${ico("star")}It hatched!</div>
      <div class="cg-hatch-body"><canvas class="cg-prev" width="260" height="260"></canvas>
        <div><p>A <b>${esc(sp.name)}</b>${c.parents ? `, child of ${esc((G.save.book[c.parents[0]] || {}).name || "?")} and ${esc((G.save.book[c.parents[1]] || {}).name || "?")}` : ""}.</p>
        <p class="cg-meta">${esc(G.D.TEMPERS[c.genes.temper[0]].name)}, with a ${esc(G.D.TEMPERS[c.genes.temper[1]].name.toLowerCase())} streak. ${esc(G.L.traitsOf(c).map(t => t.name).join(", "))}.</p>
        <label class="cg-lab">Its name</label><input maxlength="14" value="${esc(c.name)}" spellcheck="false"></div></div>
      <div class="cg-foot"><button class="btn ghost" data-f data-rand>${ico("swap")}Another name</button><button class="btn" data-f data-focus data-ok>${ico("check")}Welcome</button></div></div>`, null, "cg-cardwrap");
    const inp = el.querySelector("input");
    const ok = () => { const v = inp.value.trim().slice(0, 14); if (v) c.name = v; const t = G.tags.get(e); if (t) t._h = null; G.save.book[c.id] = G.L.record(c); persist(); menuClose(); };
    el.querySelector("[data-ok]").onclick = ok;
    el.querySelector("[data-rand]").onclick = () => { inp.value = G.L.NAMES[Math.floor(Math.random() * G.L.NAMES.length)]; };
    inp.onkeydown = ev => { ev.stopPropagation(); if (ev.key === "Enter") ok(); };
    G.menu.back = ok;
    livePreview(el.querySelector(".cg-prev"), () => G.M.creature(c));
  }
  function bag() {
    const S = G.save, inv = S.inv;
    const rows = Object.keys(inv).filter(k => inv[k] > 0).map(k => { const f = G.D.food(k); return f ? `<button class="cg-irow" data-f data-take="${k}"><span class="cg-dot" style="background:#${f.c.toString(16).padStart(6, "0")}"></span><b>${esc(f.name)}</b><i>${esc(f.text)}</i><em>x${inv[k]}</em></button>` : ""; }).join("");
    const el = menuOpen(sec("Bag", "clipboard", `${rows ? `<div class="cg-list">${rows}</div>` : `<p class="cg-empty">Empty. Fruit you put in it (pick it up, then Bag) waits here.</p>`}
      ${G.held && G.held.kind === "fruit" ? `<div class="cg-foot"><button class="btn" data-f data-stow>${ico("check")}Put the ${esc(G.D.food(G.held.it.id).name)} away</button></div>` : ""}
      <div class="cg-foot"><button class="btn ghost" data-f data-back>${ico("back")}Back</button></div>`, "cg-small"), () => mainMenu());
    el.querySelector("[data-back]").onclick = () => { menuClose(); mainMenu(); };
    const st = el.querySelector("[data-stow]"); if (st) st.onclick = () => { const it = G.held.it; G.held = null; inv[it.id] = (inv[it.id] || 0) + 1; removeItem(it); persist(); bag(); };
    el.querySelectorAll("[data-take]").forEach(b => b.onclick = () => {
      if (G.held) { toast("Your hands are full", "info"); return; }
      const k = b.dataset.take; inv[k]--; const it = addItem("fruit", k, G.keeper.x, G.keeper.z); pickUp({ kind: "fruit", it, id: k }); menuClose();
    });
  }
  function hallMenu() {
    music("hall");
    const el = menuOpen(sec("The Garden Hall", "door", `<p class="cg-text">Hazel's hall: the warden's desk, the Society's notices, a kettle always on. Its shop and the breeding pens are being made ready.</p>
      <div class="cg-mm"><button class="cg-mi" data-f data-focus data-go="duel">${ico("trophy")}<b>Today's visitor</b><i>${esc(visitor().name)} is here, and wants a duel</i></button>
      <button class="cg-mi" data-f data-go="pens">${ico("heart")}<b>The Society's pens</b><i>Pair two grown creatures who are fond of each other</i></button>
      <button class="cg-mi" data-f data-go="rest">${ico("moon")}<b>Rest till morning</b><i>Sleep here; the garden goes on through the night</i></button>
      <button class="cg-mi" data-f data-go="look">${ico("person")}<b>The mirror</b><i>Change how you look</i></button>
      <button class="cg-mi" data-f data-go="save">${ico("check")}<b>Save</b><i>Write the garden down</i></button></div>
      <div class="cg-foot"><button class="btn ghost" data-f data-back>${ico("back")}Back</button></div>`, "cg-small"));
    el.querySelector("[data-back]").onclick = menuClose;
    el.querySelectorAll("[data-go]").forEach(b => b.onclick = () => {
      const k = b.dataset.go;
      if (k === "pens") { pens(); return; }
      if (k === "duel") { duelMenu(); return; }
      if (k === "rest") { const t = tod(), add = (t < 0.27 ? 0.27 - t : 1.27 - t); for (const e of G.ents) { G.L.tick(e.c, add * DAY * 0.25, { dayLen: DAY, asleep: true }); e.c.care.energy = 100; e.task = null; } G.save.day += add; menuClose(); toast("Morning", "sun"); persist(); }
      else if (k === "look") creator(false);
      else if (k === "save") { persist(); menuClose(); toast("Saved", "check"); }
    });
  }

  /* the pens: two grown creatures, what their egg might be (and a hint when something rare
     might come), and a pairing */
  function pens(sel) {
    const L = G.L, D = G.D, S = G.save, all = [...S.chao, ...S.animals].filter(c => L.adult(c));
    sel = sel || [];
    const [a, b] = sel.map(id => all.find(c => c.id === id));
    const pv = a && b ? L.preview(a, b, S) : null;
    const nm = c => c ? `<b>${esc(c.name)}</b><i>${esc(D.species(c.sp).name)}</i>` : "<i>Pick one</i>";
    const sps = pv ? pv.sp.split("|").map(id => D.species(id).name) : [];
    const body = `
      <p class="cg-text">Two grown creatures, fond of each other, and rested a day since their last egg. The pens make no pairing the garden wouldn't: a Chao with a Chao, an animal with its own kind.</p>
      <div class="cg-pair"><div class="cg-slot ${a ? "on" : ""}">${nm(a)}</div><span class="cg-plus">${ico("heart")}</span><div class="cg-slot ${b ? "on" : ""}">${nm(b)}</div></div>
      ${pv ? `<div class="cg-pv">${pv.why ? `<p class="cg-why">${esc(pv.why)}</p>` : ""}
        <p><b>The egg:</b> ${esc(sps.join(" or "))}${pv.sp.includes("|") ? " (whichever way it takes after)" : ""}</p>
        <div class="cg-pv-apt">${D.ATTRS.map(x => `<span><b>${x.short}</b>${pv.apt[x.id][0]}${pv.apt[x.id][0] !== pv.apt[x.id][1] ? "-" + pv.apt[x.id][1] : ""}</span>`).join("")}</div>
        ${pv.traits.length ? `<p class="cg-meta">Quirks that might come down: ${esc(pv.traits.join(", "))}</p>` : ""}
        ${pv.hint ? `<p class="cg-hint">${ico("sparkle")} ${esc(pv.hint)}</p>` : ""}</div>` : ""}
      <div class="cg-grid cg-pick">${all.length ? all.map(c => `<button class="cg-crow ${sel.includes(c.id) ? "sel" : ""}" data-f data-c="${c.id}"><canvas width="96" height="96" data-thumb="${c.id}"></canvas><span><b>${esc(c.name)}</b><i>${esc(D.species(c.sp).name)}</i><em>${(c.love || 0) >= 4 ? ico("heart") + " in love" : `Gen ${c.gen}`}</em></span></button>`).join("") : `<p class="cg-empty">Nobody's grown yet: a Chao is grown once it has changed; an animal, once it's full size.</p>`}</div>
      <div class="cg-foot">${room() ? "" : `<p class="cg-why">The garden is full: ${CAP()} at most, eggs included.</p>`}<button class="btn ghost" data-f data-back>${ico("back")}Back</button><button class="btn" data-f data-pair ${pv && !pv.why && room() ? "" : "disabled"}>${ico("heart")}Pair them</button></div>`;
    const el = menuOpen(sec("The Society's pens", "heart", body), () => { menuClose(); hallMenu(); }, "cg-wide");
    el.querySelector("[data-back]").onclick = () => { menuClose(); hallMenu(); };
    el.querySelectorAll("[data-c]").forEach(bt => bt.onclick = () => { const id = bt.dataset.c, i = sel.indexOf(id); const ns = i >= 0 ? sel.filter(x => x !== id) : [...sel, id].slice(-2); pens(ns); });
    const pb = el.querySelector("[data-pair]");
    if (pb) pb.onclick = () => { const ea = G.ents.find(e => e.c === a), eb = G.ents.find(e => e.c === b); if (!ea || !eb) return; layEgg(ea, eb, "at the pens"); menuClose(); };
    thumbs(el, id => all.find(c => c.id === id));
  }
  /* a creature's family: its line, two generations up, its brothers and sisters, its children */
  function family(c, back) {
    const D = G.D, R = allRecs(), get = id => R[id] || null, live = id => G.save.chao.concat(G.save.animals).some(x => x.id === id);
    const box = (r, cls) => r ? `<button class="cg-fbox ${cls || ""}" data-f ${live(r.id) ? `data-c="${r.id}"` : ""}><b>${esc(r.name)}</b><i>${esc((D.species(r.sp) || {}).name || "")}</i><em>Gen ${r.gen || 1}</em></button>` : `<div class="cg-fbox none"><i>Unknown</i></div>`;
    const par = (c.parents || []).map(get), gp = par.map(p => p && p.parents ? p.parents.map(get) : [null, null]);
    const kids = Object.values(R).filter(r => r.parents && r.parents.includes(c.id));
    const sibs = c.parents ? Object.values(R).filter(r => r.id !== c.id && r.parents && r.parents.some(id => c.parents.includes(id))) : [];
    const lineId = c.line || c.id, inLine = Object.values(R).filter(r => (r.line || r.id) === lineId), founder = get(lineId) || c;
    const gens = Math.max(1, ...inLine.map(r => r.gen || 1));
    const where = ((c.log[0] || [0, ""])[1].split(": ")[1] || "").replace(/\.$/, "");
    const el = menuOpen(sec(`${esc(c.name)}'s family`, "person", `
      <p class="cg-text">Of the ${esc(founder.name)} line${inLine.length > 1 ? `: ${inLine.length} so far, over ${gens} generation${gens > 1 ? "s" : ""}` : ", which it founded"}.</p>
      <div class="cg-tree">
        ${c.parents ? `${gp.flat().some(Boolean) ? `<div class="cg-trow">${gp.flat().map(r => box(r, "gp")).join("")}</div>` : ""}<div class="cg-trow">${par.map(r => box(r, "p")).join("")}</div>` : `<p class="cg-meta">${where ? esc(where[0].toUpperCase() + where.slice(1)) : "An egg of the garden"}: the first of its family here.</p>`}
        <div class="cg-trow">${box(c, "me")}</div>
        ${sibs.length ? `<h4>Brothers and sisters</h4><div class="cg-trow">${sibs.slice(0, 8).map(r => box(r)).join("")}</div>` : ""}
        ${kids.length ? `<h4>Children</h4><div class="cg-trow">${kids.slice(0, 12).map(r => box(r)).join("")}</div>` : ""}
      </div>
      <div class="cg-foot"><button class="btn ghost" data-f data-back>${ico("back")}Back</button></div>`), () => { menuClose(); card(c, back); }, "cg-wide");
    el.querySelector("[data-back]").onclick = () => { menuClose(); card(c, back); };
    el.querySelectorAll("[data-c]").forEach(bt => bt.onclick = () => { const x = [...G.save.chao, ...G.save.animals].find(y => y.id === bt.dataset.c); if (x && x !== c) card(x, back); });
  }

  /* ---------------------------------------------------------------- duels
     Keepers from round about drop by the garden, a different one each day, each with their own
     kind of team and their own way of fighting; the Garden Hall is where they wait. */
  const VISITORS = [
    { id: "juniper", name: "Juniper Vale", what: "a ranger from the woods past the rim", pool: ["an-fox", "an-squirrel", "an-owl", "an-fawn", "an-hedgehog", "an-badger", "an-raccoon"], chao: 0.15,
      look: { sex: "f", skin: 3, hair: 2, style: "ponytail", eyes: 2, attire: "tracksuit", colour: 3, bottoms: "trousers", glasses: false, custom: { hat: { c: 0x6a8a4a, band: 0x3a5a2a }, shoes: 0x5a3a22 } },
      hi: "The woods' animals are tougher than they look. Shall we see?", win: "Ha! Well fought. The forest will hear of you.", lose: "My lot won this time. Come back when yours have grown." },
    { id: "marlow", name: "Captain Marlow Reef", what: "an old sailor who keeps a menagerie aboard", pool: ["an-seal", "an-otter", "an-penguin", "an-crab", "an-seaturtle", "an-pelican", "an-walrus"], chao: 0.2,
      look: { sex: "m", skin: 3, hair: 6, style: "shaggy", eyes: 1, attire: "sweater", colour: 0, bottoms: "trousers", glasses: false, custom: { hat: { c: 0x2a3150, band: 0xf2efe6 }, shoes: 0x2a2420 } },
      hi: "Ahoy! My crew could use the exercise.", win: "Shiver me -- you've a fine crew yourself.", lose: "Back to the briny with you! Next time, eh?" },
    { id: "ada", name: "Professor Ada Quill", what: "a Chao researcher with a notebook full of numbers", pool: ["chao-mech-spark", "chao-neutral-spark", "chao-mech-normal", "chao-hero-spark", "chao-neutral-fly"], chao: 1,
      look: { sex: "f", skin: 0, hair: 4, style: "bob", eyes: 3, attire: "suit", colour: 7, bottoms: "pleated", glasses: true, custom: { tie: 0x5a8ac8 } },
      hi: "For science! I'd like to observe your Chao under pressure.", win: "Fascinating. Your upbringing methods are clearly sound.", lose: "As predicted. But the data says yours are improving." },
    { id: "rowan", name: "Rowan and Fen", what: "two children from the village, very serious about it", pool: ["chao-neutral-child", "chao-hero-child", "chao-dark-child", "an-pocky", "an-flicky", "an-puppy"], chao: 0.6, easy: 0.75,
      look: { sex: "m", skin: 1, hair: 5, style: "spiky", eyes: 1, attire: "polo", colour: 6, bottoms: "shorts", glasses: false },
      hi: "We've been practising ALL week. Prepare yourself!", win: "Aww. Okay, you're really good. Can we come again?", lose: "We WON! Fen, we won!" },
    { id: "tobias", name: "Old Tobias Moss", what: "a gardener who has kept Chao for fifty years", pool: ["chao-neutral-normal", "chao-hero-normal", "chao-wild-normal", "an-tortoise", "an-sheep", "an-goat"], chao: 0.7, hard: 1.1,
      look: { sex: "m", skin: 2, hair: 6, style: "buzz", eyes: 0, attire: "sweater", colour: 5, bottoms: "trousers", glasses: true, custom: { hat: { c: 0xd8c08a, band: 0x7a2232, sun: true } } },
      hi: "Slow and steady, young keeper. Let's see what yours are made of.", win: "Heh. You've a gift for this. Treat them well.", lose: "Patience wins more than you'd think." },
    { id: "sable", name: "Sable Night", what: "who only ever comes after dark, it seems", pool: ["chao-dark-normal", "chao-dark-fly", "chao-dark-power", "an-bat", "an-blackcat", "an-crow", "an-raven"], chao: 0.6, hard: 1.1,
      look: { sex: "f", skin: 0, hair: 0, style: "long", eyes: 3, attire: "suit", colour: 2, bottoms: "long", glasses: false, custom: { tie: 0x7a2232, legs: 0x1e1e22, shoes: 0x1e1e22 } },
      hi: "Your garden's very bright. Let's dim it a little.", win: "...Hm. You're stronger than you look.", lose: "The dark always wins in the end." },
    { id: "brick", name: "Coach Brick Maddox", what: "who runs a training camp in the hills", pool: ["chao-neutral-power", "chao-dark-power", "chao-hero-power", "an-bear", "an-ram", "an-gorilla", "an-kangaroo"], chao: 0.5, hard: 1.15,
      look: { sex: "m", skin: 3, hair: 1, style: "buzz", eyes: 4, attire: "tracksuit", colour: 4, bottoms: "shorts", glasses: false, custom: { shoes: 0xf2f2f2 } },
      hi: "Drop and give me twenty! ...Or a duel. A duel's fine.", win: "That's what I like to see! Hustle!", lose: "Again! From the top! Train harder!" },
    { id: "lark", name: "Lark Featherstone", what: "a bird-watcher who's befriended half the sky", pool: ["an-hawk", "an-parrot", "an-swallow", "an-kingfisher", "an-toucan", "chao-neutral-fly", "chao-hero-fly"], chao: 0.35,
      look: { sex: "f", skin: 4, hair: 1, style: "pixie", eyes: 2, attire: "polo", colour: 3, bottoms: "jeans", glasses: false, custom: { satchel: true } },
      hi: "Oh! A garden full of friends. Mine would love to meet yours.", win: "Wonderful! What a lovely fight that was.", lose: "Up, up and away! Better luck next time." },
  ];
  const visitor = () => VISITORS[Math.floor(G.save.day) % VISITORS.length];
  function duelMenu() {
    const v = visitor(), S = G.save, all = [...S.chao, ...S.animals].filter(c => !G.ents.find(e => e.c === c && e.rig.aquatic));
    S.duels = S.duels || {};
    const rec = S.duels[v.id] || { w: 0, l: 0 };
    const el = menuOpen(sec("Today's visitor", "trophy", `
      <div class="cg-visit"><canvas class="cg-prev" width="200" height="260"></canvas><div>
        <h3>${esc(v.name)}</h3><p class="cg-meta">${esc(v.what)}${rec.w + rec.l ? ` &middot; you've won ${rec.w}, lost ${rec.l}` : ""}</p>
        <p class="cg-say">"${esc(v.hi)}"</p>
        <div class="cg-mm">${[1, 2, 3].map(n => `<button class="cg-mi" data-f ${n === 1 ? "data-focus" : ""} data-n="${n}" ${all.length < n ? "disabled" : ""}>${ico(n === 1 ? "person" : "heart")}<b>${n} against ${n}</b><i>${n === 1 ? "One of yours, one of theirs" : n === 2 ? "Two a side: friends fight better side by side" : "Three a side, and a team technique for all three"}</i></button>`).join("")}</div>
      </div></div>
      <div class="cg-foot"><button class="btn ghost" data-f data-back>${ico("back")}Back</button></div>`), () => { menuClose(); hallMenu(); }, "cg-wide");
    el.querySelector("[data-back]").onclick = () => { menuClose(); hallMenu(); };
    el.querySelectorAll("[data-n]").forEach(b => b.onclick = () => duelParty(v, +b.dataset.n, []));
    livePreview(el.querySelector(".cg-prev"), () => G.M.avatar(v.look));
  }
  function duelParty(v, n, sel, rows, o) {
    const S = G.save, D = G.D, L = G.L, all = [...S.chao, ...S.animals].filter(c => { const e = G.ents.find(x => x.c === c); return !(e && e.rig.aquatic); });
    rows = rows || {};
    const party = sel.map(id => all.find(c => c.id === id)).filter(Boolean);
    const el = menuOpen(sec(`${n} against ${n}: your team`, "heart", `
      <p class="cg-text">Pick ${n === 1 ? "one" : n === 2 ? "two" : "three"}.${n > 1 ? " Tap a picked one again to set it in front or behind: the front takes the blows, the back is harder to reach." : ""} Friends side by side hit harder, and cover each other.</p>
      <div class="cg-grid cg-pick">${all.map(c => { const i = sel.indexOf(c.id); return `<button class="cg-crow ${i >= 0 ? "sel" : ""}" data-f data-c="${c.id}"><canvas width="96" height="96" data-thumb="${c.id}"></canvas><span><b>${esc(c.name)}</b><i>${esc(D.species(c.sp).name)}</i><em>${i >= 0 && n > 1 ? (rows[c.id] === "back" ? "Behind" : "In front") : `Lv ${L.lvSum(c)} &middot; ${esc(D.TEMPERS[c.genes.temper[0]].name)}`}</em></span></button>`; }).join("")}</div>
      <div class="cg-foot"><button class="btn ghost" data-f data-back>${ico("back")}Back</button><button class="btn" data-f data-go ${party.length === n ? "" : "disabled"}>${ico("trophy")}${o && o.go || "Duel!"}</button></div>`), () => (o && o.back ? o.back() : duelMenu()), "cg-wide");
    el.querySelector("[data-back]").onclick = () => (o && o.back ? o.back() : duelMenu());
    el.querySelectorAll("[data-c]").forEach(b => b.onclick = () => {
      const id = b.dataset.c, i = sel.indexOf(id);
      if (i >= 0 && n > 1 && rows[id] !== "back") { rows[id] = "back"; duelParty(v, n, sel, rows, o); return; }
      if (i >= 0) { delete rows[id]; duelParty(v, n, sel.filter(x => x !== id), rows, o); return; }
      if (sel.length >= n) return;
      duelParty(v, n, [...sel, id], rows, o);
    });
    el.querySelector("[data-go]").onclick = () => { if (party.length !== n) return; if (o && o.pick) o.pick(party, rows); else duel(v, party, rows, o); };
    thumbs(el, id => all.find(c => c.id === id));
  }
  /* the other side: from the visitor's kinds, grown to about your team's strength */
  function foeTeam(v, mine, o) {
    const L = G.L, D = G.D, n = mine.length, avg = mine.reduce((s, c) => s + L.lvSum(c), 0) / n;
    const S = G.save, rec = (S.duels && S.duels[v.id]) || { w: 0 };
    const want = Math.max(7, avg * (v.easy || 1) * (v.hard || 1) * (o && o.mul || 1) * (o && o.mul ? 1 : 1 + rec.w * 0.06) * rnd(0.9, 1.08));
    const out = [];
    for (let i = 0; i < n; i++) {
      const id = v.pool[Math.floor(Math.random() * v.pool.length)], c = L.make(id, { name: L.NAMES[Math.floor(Math.random() * L.NAMES.length)] });
      if (c.kind === "animal") c.grown = 1;
      let guard = 0;
      while (L.lvSum(c) < want && guard++ < 400) { const a = D.ATTRS[Math.floor(Math.random() * 7)].id; L.train(c, a, 40 + c.genes.apt[a] * 60); }
      out.push(c);
    }
    return out;
  }
  function duel(v, party, rows, o) {
    menuClose();
    const foes = foeTeam(v, party, o);
    G.hud.style.display = "none"; G.tagBox.style.display = "none";
    const touch = G.el.querySelector(".cg-touch"); if (touch) touch.dataset.was = touch.className;
    G.battle = root.ChaoBattle.start({
      R: G.R, el: G.el, M: G.M, L: G.L, D: G.D, ico, esc, sfx, jingle, music, sec, menuOpen, menuClose, isMenu: () => !!G.menu,
    }, { mine: party, foes, rows, foeRows: { [foes[2] && foes[2].id]: "back" }, foeKeeper: { name: v.name, look: v.look }, keeperLook: G.save.avatar,
      title: (o && o.title) || `${v.name}`, sub: (o && o.sub) || `${party.length} against ${party.length}`, intro: `${v.name}: "${(o && o.hi) || v.hi}"`, music: o && o.music }, res => duelOver(v, party, foes, res, o));
  }
  function duelOver(v, party, foes, res, o) {
    const S = G.save, L = G.L, D = G.D;
    G.battle = null; G.hud.style.display = ""; G.tagBox.style.display = "";
    S.duels = S.duels || {}; const rec = S.duels[v.id] = S.duels[v.id] || { w: 0, l: 0 };
    const won = res.winner === 0;
    if (won) rec.w++; else rec.l++;
    const rings = o && o.rings != null ? (won ? o.rings : 0) : won ? 40 * party.length + 20 * Math.min(rec.w, 10) : res.quit ? 0 : 10;
    S.rings += rings;
    const names = foes.map(c => c.name).join(", ");
    for (const f of res.fighters.filter(x => x.side === 0)) {
      const c = f.c;
      /* what it did in the fight, it got better at */
      for (const id of f.used) { const t = D.tech(id); if (t && t.attr) L.train(c, t.attr, 14); }
      L.train(c, "vel", 6); L.train(c, "res", Math.min(30, f.taken / 4));
      c.care.energy = clamp(c.care.energy - 25, 0, 100);
      c.care.mood = clamp(c.care.mood + (won ? 12 : -8), 0, 100);
      c.bond = clamp(c.bond + (won ? 2.5 : 1), 0, 100);
      if (!won && c.genes.temper.includes("competitive")) c.care.mood = clamp(c.care.mood - 6, 0, 100);
      c.log.push([S.day, won ? `Won a duel against ${v.name}'s ${names}.` : `Lost a duel to ${v.name}'s ${names}.`]);
      c.wins = (c.wins || 0) + (won ? 1 : 0);
      G.L.raise(c, won ? "hero" : "dark", 1);
    }
    /* fighting side by side makes friends */
    for (let i = 0; i < party.length; i++) for (let j = i + 1; j < party.length; j++) L.meet(party[i], party[j], "share", won ? 3 : 2);
    for (const c of party) { const e = G.ents.find(x => x.c === c); if (e) { const t = G.tags.get(e); if (t) t._h = null; } }
    S.ach.duels = (S.ach.duels || 0) + 1; if (won) S.ach.duelWins = (S.ach.duelWins || 0) + 1;
    persist();
    music(gardenTune());
    if (o && o.onDone) { o.onDone(won, res, rings); return; }
    talk([[v.name, won ? v.win : v.lose], ["", won ? `You won ${rings} rings.` : rings ? `${rings} rings for trying.` : "No rings for giving up."]]);
  }

  /* ---------------------------------------------------------------- the garden's folk
     Who's where, and when: each has a garden, a spot (beside the dojo they keep, the arena,
     the pier...) and hours; at night most have gone home. Talk to them with Z. */
  const FOLK = [
    { id: "hazel", name: "Hazel", region: "central", at: () => { const P = G.Wd.PLAN; return [P.hall[0] + 3.2, P.hall[1] - 5.2, PI * 0.9]; }, look: () => HAZEL, hours: [0, 1], talk: () => hazelTalk() },
    { id: "pip", name: "Pip Marlowe", region: "central", at: () => [8.5, 30.5, -PI * 0.6], look: () => ({ sex: "m", skin: 1, hair: 3, style: "shaggy", eyes: 1, attire: "polo", colour: 0, bottoms: "shorts", custom: { apron: 0xe42630 } }), hours: [0.27, 0.83], talk: () => shopMenu(), role: "Runs the garden shop by the hall" },
    { id: "bram", name: "Master Bram Oakheart", region: "forest", at: () => { const s2 = G.W.spots.dojo; return [s2.x + 2.2, s2.z - 0.6, PI]; }, look: () => ({ sex: "m", skin: 3, hair: 7, style: "buzz", eyes: 0, attire: "tracksuit", colour: 3, bottoms: "trousers", custom: { hat: { c: 0xf2efe6, band: 0xc0303a } } }), hours: [0.25, 0.86], talk: () => dojoMenu("forest") },
    { id: "yuki", name: "Master Yuki Hale", region: "mountain", at: () => { const s2 = G.W.spots.dojo; return [s2.x - 2.2, s2.z, 0]; }, look: () => ({ sex: "f", skin: 0, hair: 6, style: "ponytail", eyes: 1, attire: "tracksuit", colour: 6, bottoms: "trousers", custom: { hat: { c: 0x5a8ac8, band: 0xf2efe6 } } }), hours: [0.22, 0.84], talk: () => dojoMenu("mountain") },
    { id: "nell", name: "Doctor Nell Voss", region: "mech", at: () => { const s2 = G.W.spots.dojo; return [s2.x + 2.2, s2.z, PI]; }, look: () => ({ sex: "f", skin: 2, hair: 5, style: "bob", eyes: 3, attire: "suit", colour: 7, bottoms: "trousers", glasses: true, custom: { tie: 0x40d0f0 } }), hours: [0.3, 0.95], talk: () => dojoMenu("mech") },
    { id: "ines", name: "Commissioner Ines Vale", region: "mystic", at: () => { const s2 = G.W.spots.arena; return [s2.x + 2.4, s2.z + 0.5, PI]; }, look: () => ({ sex: "f", skin: 4, hair: 0, style: "long", eyes: 2, attire: "suit", colour: 4, bottoms: "long", custom: { tie: 0xffd21a } }), hours: [0.27, 0.9], talk: () => leagueMenu() },
    { id: "marlo", name: "Old Marlo", region: "tropical", at: () => [-14, 4.2, -PI / 2], look: () => ({ sex: "m", skin: 3, hair: 6, style: "buzz", eyes: 0, attire: "polo", colour: 5, bottoms: "shorts", custom: { hat: { c: 0xd8c08a, band: 0x3a6a8a, sun: true } } }), hours: [0.22, 0.75], talk: () => folkTalk("marlo") },
    { id: "wren", name: "Wren Ashby", region: "mystic", at: () => [4, 6, PI * 0.7], look: () => ({ sex: "f", skin: 1, hair: 3, style: "bun", eyes: 2, attire: "sweater", colour: 5, bottoms: "trousers", glasses: true }), hours: [0.3, 0.8], talk: () => folkTalk("wren") },
    { id: "otto", name: "Otto Breck", region: "mountain", at: () => [-6, 22, 0.4], look: () => ({ sex: "m", skin: 0, hair: 2, style: "shaggy", eyes: 1, attire: "sweater", colour: 4, bottoms: "trousers", custom: { hat: { c: 0xe42630, band: 0xf2efe6 } } }), hours: [0.25, 0.8], talk: () => folkTalk("otto") },
    { id: "skye", name: "Skye Calloway", region: "sky", at: () => [3, 24, PI], look: () => ({ sex: "f", skin: 2, hair: 4, style: "pixie", eyes: 1, attire: "tracksuit", colour: 1, bottoms: "trousers", custom: { hat: { c: 0x8a5a3a, band: 0x3a2a1a } } }), hours: [0.2, 0.9], talk: () => folkTalk("skye") },
  ];
  const FOLK_LINES = {
    marlo: ["Been fishing off this pier since before your grandparents were eggs. The swimmers love it out here -- the sea makes 'em tough.", "Saw a Chao chase a crab clean into the lagoon this morning. The crab won.", "Bring your swimmers to the sea of an evening. The water's warm then."],
    wren: ["These ruins are older than the gardens. Look at the carvings on the altar: Chao, and a great light over them.", "They say a Chao who's lived three whole lives turns to light itself. I'd give anything to see one.", "The crystals hum at night. Your Chao feel it -- the ones that sleep here grow strange and strong in Chaos."],
    otto: ["The air's thin up here, but it makes the legs strong. Bring your runners up the slopes.", "Master Hale's dojo is in the cave up the hill. She's tough, but she's fair.", "There's something frozen in the lake. I keep meaning to chip it out."],
    skye: ["Up here, everyone flies -- or learns to. The fliers' wings come in stronger for it.", "Mind the edges. It's a long way down to the clouds.", "The observatory's telescope sees things nobody else can. Come up on a clear night."],
  };
  function folkTalk(id) { const L2 = FOLK_LINES[id] || ["..."]; const S = G.save; S.tips = S.tips || {}; S.tips[id] = ((S.tips[id] || 0) + 1) % L2.length; const f = FOLK.find(x => x.id === id); talk([[f.name, L2[S.tips[id]]]]); }
  /* who's here now: built when you arrive, shown or gone by the hour */
  function folkHere() {
    for (const n of G.npcs || []) G.scene.remove(n.rig.g);
    G.npcs = [];
    const here = G.save.region || "central";
    for (const f of FOLK) {
      if (f.region !== here) continue;
      let at; try { at = f.at(); } catch (e) { continue; }
      if (!at) continue;
      const n = { f, rig: G.M.avatar(f.look()), x: at[0], z: at[1], a: at[2] || 0, name: f.name };
      n.y = G.W.ground(n.x, n.z); place(n); shadowsOn(n.rig.g); G.scene.add(n.rig.g);
      G.npcs.push(n);
    }
  }
  const folkIn = n => { const t = tod(), [a, b] = n.f.hours; return a === 0 && b === 1 ? true : t >= a && t <= b; };

  /* ---------------------------------------------------------------- the garden shop
     Pip's stall by the hall, open by day: fruit and Chaos Drives (to the bag), toys (at your
     feet), eggs (by the incubator), and room for more -- a bigger garden, in three steps. */
  const SHOP = {
    food: [["round", 20], ["triangle", 40], ["square", 40], ["berry", 15], ["nut", 15], ["candy", 30], ["mushroom", 30], ["heart", 120], ["chaosdrive-g", 80], ["chaosdrive-p", 80], ["chaosdrive-r", 80], ["chaosdrive-y", 80]],
    toys: [["ball", 60], ["duck", 60], ["trumpet", 80], ["box", 100], ["car", 100], ["kite", 120]],
    eggs: [["chao-neutral-child", 300, "A Chao egg", "A plain egg: what hatches is up to how you raise it."],
           ["chao-hero-child", 650, "A Halo Chao egg", "From a Halo line: it hatches already leaning kind and bright."],
           ["chao-dark-child", 650, "A Shade Chao egg", "From a Shade line: it hatches already leaning sly and bold."],
           ["chao-wild-child", 650, "A Grove Chao egg", "From a Grove line: half wild from the start, at home with the animals."],
           ["chao-mech-child", 650, "A Gear Chao egg", "From a Gear line: it hatches with a gear for a ball, and a knack for machines."],
           ["animal", 250, "An animal's egg", "From the gardens round about. Who knows what's in it?"]],
    room: [[10, 1000], [20, 2500], [30, 5000]],
  };
  function shopMenu(tab) {
    const S = G.save; tab = tab || "food";
    const near = (G.npcs || []).some(n => n.f.id === "pip" && n.rig.g.visible);
    if (!near) { talk([["", "The shop's shutters are down. Pip opens up in the morning."]]); return; }
    const row = (k, name, text, price, c) => `<button class="cg-irow" data-f data-buy="${k}" ${S.rings < price ? "disabled" : ""}><span class="cg-dot" style="background:#${(c || 0xffd21a).toString(16).padStart(6, "0")}"></span><b>${esc(name)}</b><i>${esc(text)}</i><em>${price}</em></button>`;
    let rows = "";
    if (tab === "food") rows = SHOP.food.map(([id, p]) => { const f = G.D.food(id); return row("food:" + id, f.name, f.text + ((S.inv[id] || 0) ? ` (${S.inv[id]} in the bag)` : ""), p, f.c); }).join("");
    if (tab === "toys") rows = SHOP.toys.map(([id, p]) => { const t = G.D.toy(id); return row("toy:" + id, t.name, t.text, p, t.c); }).join("");
    if (tab === "eggs") rows = SHOP.eggs.map(([id, p, name, text]) => row("egg:" + id, name, text, p, id === "animal" ? 0xd8c8a0 : (G.D.ALIGNS[G.D.species(id).align] || {}).c ? G.D.ALIGNS[G.D.species(id).align].c[0] : 0xf4f0e4)).join("");
    if (tab === "room") { const cur = (S.habitat && S.habitat.room) || 0, nx = SHOP.room.find(([r]) => r > cur); rows = nx ? row("room:" + nx[0], `A bigger garden (room for ${30 + nx[0]})`, "The Society's carpenters widen your plots and build more nests.", nx[1], 0x6ad050) : `<p class="cg-empty">The garden's as big as it gets: room for ${30 + cur}.</p>`; }
    const el = menuOpen(`<div class="panel cg-panel"><div class="panel-hd">${ico("ticket")}Pip's garden shop<small>${S.rings} rings</small></div>
      <div class="cg-tabs">${[["food", "Food"], ["toys", "Toys"], ["eggs", "Eggs"], ["room", "Room"]].map(([k, n]) => `<button class="${tab === k ? "sel" : ""}" data-f data-tab="${k}">${n}</button>`).join("")}</div>
      <div class="cg-list">${rows}</div>
      <div class="cg-foot"><button class="btn ghost" data-f data-back>${ico("back")}Back</button></div></div>`, menuClose, "cg-small");
    el.querySelector("[data-back]").onclick = menuClose;
    el.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => shopMenu(b.dataset.tab));
    el.querySelectorAll("[data-buy]").forEach(b => b.onclick = () => {
      const [kind, id] = b.dataset.buy.split(":"), list = kind === "food" ? SHOP.food : kind === "toy" ? SHOP.toys : kind === "egg" ? SHOP.eggs : SHOP.room;
      const it = list.find(x => String(x[0]) === id); if (!it || S.rings < it[1]) return;
      if (kind === "egg" && !room()) { toast("The garden's full: buy more room first", "info"); return; }
      S.rings -= it[1]; sfx("coin");
      const k = G.keeper, fx = k.x + Math.sin(k.a) * 0.8, fz = k.z + Math.cos(k.a) * 0.8;
      if (kind === "food") { S.inv[id] = (S.inv[id] || 0) + 1; toast(`${G.D.food(id).name}: into the bag`, "check"); }
      else if (kind === "toy") { addItem("toy", id, fx, fz); toast(`A new ${G.D.toy(id).name.toLowerCase()}`, "check"); }
      else if (kind === "egg") {
        let sp = id;
        if (id === "animal") { const pool = G.D.ANIMALS.filter(a => a.rarity <= 2 && !a.classic && a.plan !== "fish" && a.plan !== "jelly"); sp = pool[Math.floor(Math.random() * pool.length)].id; }
        addItem("egg", null, fx, fz, G.L.egg(sp, { from: "bought at Pip's garden shop" })); toast("An egg, at your feet", "check");
      }
      else { S.habitat = S.habitat || {}; S.habitat.room = +id; toast(`The garden's bigger: room for ${30 + (+id)}`, "star"); }
      persist(); shopMenu(tab);
    });
  }

  /* ---------------------------------------------------------------- the dojos
     Three masters, each of two attributes: the Oakheart Dojo in the forest (Power, Resilience),
     the Summit Dojo in the mountain's cave (Velocity, Vitality), the Circuit Dojo in the lab
     (Instinct, Chaos). A session (rings) trains a creature hard in the master's two; the trial
     is three duels in a row against the students -- one, then two, then three a side -- and its
     reward is the dojo's seal and the master's own technique, taught to one of your team. */
  const DOJOS = {
    forest: { name: "Oakheart Dojo", master: "bram", attrs: ["pow", "res"], tech: "oak-crush", pool: ["chao-neutral-power", "chao-wild-power", "chao-hero-power", "an-bear", "an-boar", "an-badger", "an-ram"], cost: 60,
      hi: "Strength is nothing without the grit to take a blow. Show me both.", win: "Your team stands like oaks. Take the seal -- and take this.", lose: "Rooted, but not yet deep. Train, and come back." },
    mountain: { name: "Summit Dojo", master: "yuki", attrs: ["vel", "vit"], tech: "summit-rush", pool: ["chao-neutral-run", "chao-hero-run", "chao-dark-run", "an-ibex", "an-snowleopard", "an-hare", "an-wolf"], cost: 60,
      hi: "The mountain rewards speed and stamina. Can yours keep up?", win: "You reached the summit. The seal is yours, and my technique with it.", lose: "Out of breath already? The slopes will fix that." },
    mech: { name: "Circuit Dojo", master: "nell", attrs: ["ins", "cha"], tech: "circuit-pulse", pool: ["chao-mech-spark", "chao-mech-normal", "chao-neutral-spark", "an-mechpup", "an-mechcat", "an-mechbird", "an-moto"], cost: 60,
      hi: "Instinct and Chaos Energy: the mind and the spark. Let's measure both.", win: "Remarkable readings. Here's the seal, and a program for your team.", lose: "Insufficient data. Train, and we'll test again." },
  };
  function dojoMenu(id) {
    const Dj = DOJOS[id], S = G.save, master = FOLK.find(f => f.id === Dj.master);
    if (!Dj) return;
    S.seals = S.seals || {};
    const near = (G.npcs || []).some(n => n.f.id === Dj.master && n.rig.g.visible);
    if (!near) { talk([["", `The ${Dj.name} is closed for the night. Its master opens up in the morning.`]]); return; }
    const A1 = G.D.ATTRS.find(a => a.id === Dj.attrs[0]).name, A2 = G.D.ATTRS.find(a => a.id === Dj.attrs[1]).name, tech = G.D.tech(Dj.tech);
    const el = menuOpen(sec(Dj.name, "dumbbell", `
      <p class="cg-text"><b>${esc(master.name)}</b>: "${esc(Dj.hi)}"<br>${esc(A1)} and ${esc(A2)} are taught here.${S.seals[id] ? ` You hold this dojo's seal.` : ""}</p>
      <div class="cg-mm">
        <button class="cg-mi" data-f data-focus data-go="train">${ico("dumbbell")}<b>A training session</b><i>${Dj.cost} rings: one of yours trains hard in ${esc(A1)} and ${esc(A2)}</i></button>
        <button class="cg-mi" data-f data-go="trial">${ico("trophy")}<b>The dojo's trial</b><i>Three duels in a row -- one, two, then three a side. Win them all for the seal and ${esc(tech.name)}</i></button>
      </div>
      <div class="cg-foot"><button class="btn ghost" data-f data-back>${ico("back")}Back</button></div>`, "cg-small"));
    el.querySelector("[data-back]").onclick = menuClose;
    el.querySelector('[data-go="train"]').onclick = () => {
      if (S.rings < Dj.cost) { menuClose(); talk([[master.name, "A session costs " + Dj.cost + " rings. Come back when you have them."]]); return; }
      pickOne("Who trains?", c => {
        S.rings -= Dj.cost;
        const g1 = G.L.train(c, Dj.attrs[0], 70), g2 = G.L.train(c, Dj.attrs[1], 70);
        c.care.energy = clamp(c.care.energy - 20, 0, 100); c.bond = clamp(c.bond + 1, 0, 100);
        c.log.push([S.day, `Trained at the ${Dj.name}.`]); persist();
        talk([[master.name, `Good work. ${c.name} gained ${g1.lv + g2.lv} level${g1.lv + g2.lv === 1 ? "" : "s"} between ${A1} and ${A2}.`]]);
      }, () => dojoMenu(id));
    };
    el.querySelector('[data-go="trial"]').onclick = () => {
      const all = [...S.chao, ...S.animals].filter(c => { const e = G.ents.find(x => x.c === c); return !(e && e.rig.aquatic); });
      if (!all.length) { menuClose(); talk([[master.name, "Bring someone to fight first."]]); return; }
      const n = Math.min(3, all.length), v = { id: "dojo-" + id, name: master.name, look: master.look(), pool: Dj.pool, hi: Dj.hi, win: Dj.win, lose: Dj.lose };
      duelParty(v, n, [], {}, { go: "Begin the trial", back: () => dojoMenu(id), pick: (party, rows) => {
        const steps = [1, 2, 3].map(k => Math.min(k, party.length));
        const next = (i) => {
          if (i >= steps.length) {
            const first = !S.seals[id]; S.seals[id] = true; S.ach.seals = Object.keys(S.seals).length;
            if (first) pickOne(`Who learns ${tech.name}?`, c => { if (!c.techs.includes(tech.id)) { if (c.techs.length < 6) c.techs.push(tech.id); else c.techs[c.techs.length - 1] = tech.id; } c.log.push([S.day, `Earned the ${Dj.name}'s seal and learned ${tech.name}.`]); persist(); talk([[master.name, Dj.win], ["", `${c.name} learned ${tech.name}! The seal of the ${Dj.name} is yours.`]]); }, null, party);
            else talk([[master.name, "Still sharp. The trial is yours again."]]);
            return;
          }
          const k = steps[i], team = party.slice(0, k);
          duel(v, team, rows, { mul: 1.05 + i * 0.1 + (S.seals[id] ? 0.15 : 0), rings: 30 + i * 20, title: Dj.name, sub: `The trial: duel ${i + 1} of 3`, hi: i ? "Again!" : Dj.hi, onDone: (won) => { if (won) setTimeout(() => next(i + 1), 50); else talk([[master.name, Dj.lose]]); } });
        };
        next(0);
      } });
    };
  }
  /* pick one creature, for something */
  function pickOne(title, cb, back, among) {
    const S = G.save, all = among || [...S.chao, ...S.animals];
    const el = menuOpen(sec(title, "heart", `<div class="cg-grid cg-pick">${all.map(c => `<button class="cg-crow" data-f data-c="${c.id}"><canvas width="96" height="96" data-thumb="${c.id}"></canvas><span><b>${esc(c.name)}</b><i>${esc(G.D.species(c.sp).name)}</i><em>Lv ${G.L.lvSum(c)}</em></span></button>`).join("")}</div>
      <div class="cg-foot">${back ? `<button class="btn ghost" data-f data-back>${ico("back")}Back</button>` : ""}</div>`), back || menuClose, "cg-wide");
    const b = el.querySelector("[data-back]"); if (b) b.onclick = back;
    el.querySelectorAll("[data-c]").forEach(bt => bt.onclick = () => { const c = all.find(x => x.id === bt.dataset.c); menuClose(); cb(c); });
    thumbs(el, id => all.find(c => c.id === id));
  }

  /* ---------------------------------------------------------------- the Garden League
     In the Mystic Garden's old arena: five cups, each three rounds against the league's keepers
     (a quarter-final, a semi-final, the final), one, two or three a side, harder cup by cup. A
     cup won opens the next; the Champion's Cup's first winner is given a silver egg. */
  const CUPS = [
    { id: "pebble", name: "Pebble Cup", mul: 0.85, rings: 120 }, { id: "bronze", name: "Bronze Cup", mul: 1.0, rings: 200 }, { id: "silver", name: "Silver Cup", mul: 1.15, rings: 300 },
    { id: "gold", name: "Gold Cup", mul: 1.3, rings: 450 }, { id: "champion", name: "Champion's Cup", mul: 1.5, rings: 800 },
  ];
  const LEAGUE_KEEPERS = [
    { id: "lg-arlo", name: "Arlo Finch", look: { sex: "m", skin: 1, hair: 2, style: "slick", eyes: 1, attire: "suit", colour: 1, bottoms: "trousers" }, pool: ["chao-neutral-run", "chao-neutral-fly", "an-fox", "an-hawk"], hi: "Nothing personal. The bracket's the bracket.", win: "Good luck in the next round.", lose: "On to the next round for me!" },
    { id: "lg-mira", name: "Mira Santos", look: { sex: "f", skin: 3, hair: 5, style: "ponytail", eyes: 2, attire: "tracksuit", colour: 4, bottoms: "shorts" }, pool: ["chao-hero-normal", "chao-hero-fly", "an-swan", "an-unicorn"], hi: "My team's trained for this all season!", win: "You earned that. Go win it all.", lose: "Yes! Sorry -- yes!" },
    { id: "lg-tor", name: "Tor Halvard", look: { sex: "m", skin: 0, hair: 4, style: "spiky", eyes: 4, attire: "sweater", colour: 2, bottoms: "jeans" }, pool: ["chao-dark-power", "chao-dark-normal", "an-bear", "an-wolf", "an-rhino"], hi: "Power wins leagues.", win: "...Huh. Not bad.", lose: "Told you. Power wins." },
    { id: "lg-ivy", name: "Ivy Kestrel", look: { sex: "f", skin: 1, hair: 3, style: "pixie", eyes: 3, attire: "polo", colour: 6, bottoms: "pleated", glasses: true }, pool: ["chao-mech-spark", "chao-neutral-spark", "an-owl", "an-chameleon"], hi: "I've studied every one of your matches.", win: "My notes were wrong. Fascinating.", lose: "Exactly as calculated." },
    { id: "lg-cass", name: "Cass Okafor", look: { sex: "f", skin: 4, hair: 0, style: "bun", eyes: 0, attire: "suit", colour: 3, bottoms: "trousers" }, pool: ["chao-wild-power", "chao-wild-run", "an-tiger", "an-gorilla", "an-elephant"], hi: "Let's give the crowd a show.", win: "What a match! Take a bow.", lose: "And the crowd goes wild!" },
  ];
  function leagueMenu() {
    const S = G.save; S.league = S.league || {};
    const near = (G.npcs || []).some(n => n.f.id === "ines" && n.rig.g.visible);
    if (!near) { talk([["", "The arena is dark tonight. The Garden League's cups run by day."]]); return; }
    const won = c => S.league[c.id] && S.league[c.id].won, open = i => i === 0 || won(CUPS[i - 1]);
    const el = menuOpen(sec("The Garden League", "trophy", `
      <p class="cg-text"><b>Commissioner Ines Vale</b>: "Welcome to the league. Three rounds a cup, and every one of them in front of a crowd."</p>
      <div class="cg-mm">${CUPS.map((c, i) => `<button class="cg-mi" data-f ${i === 0 ? "data-focus" : ""} data-cup="${i}" ${open(i) ? "" : "disabled"}>${ico(won(c) ? "crown" : open(i) ? "trophy" : "lock")}<b>${esc(c.name)}</b><i>${won(c) ? `Won${S.league[c.id].n > 1 ? " " + S.league[c.id].n + " times" : ""} -- ${c.rings} rings a win` : open(i) ? `${c.rings} rings to the winner` : "Win the cup before it first"}</i></button>`).join("")}</div>
      <div class="cg-foot"><button class="btn ghost" data-f data-back>${ico("back")}Back</button></div>`, "cg-small"));
    el.querySelector("[data-back]").onclick = menuClose;
    el.querySelectorAll("[data-cup]").forEach(b => b.onclick = () => leagueFormat(+b.dataset.cup));
  }
  function leagueFormat(ci) {
    const cup = CUPS[ci], all = [...G.save.chao, ...G.save.animals];
    const el = menuOpen(sec(cup.name, "trophy", `<div class="cg-mm">${[1, 2, 3].map(n => `<button class="cg-mi" data-f ${n === 1 ? "data-focus" : ""} data-n="${n}" ${all.length < n ? "disabled" : ""}>${ico(n === 1 ? "person" : "heart")}<b>${n} against ${n}</b><i>Three rounds, ${n} a side</i></button>`).join("")}</div><div class="cg-foot"><button class="btn ghost" data-f data-back>${ico("back")}Back</button></div>`, "cg-small"));
    el.querySelector("[data-back]").onclick = () => leagueMenu();
    el.querySelectorAll("[data-n]").forEach(b => b.onclick = () => {
      const n = +b.dataset.n, keepers = LEAGUE_KEEPERS.slice().sort(() => Math.random() - 0.5).slice(0, 3);
      duelParty(keepers[0], n, [], {}, { go: "Enter the cup", back: () => leagueFormat(ci), pick: (party, rows) => {
        const round = ["The quarter-final", "The semi-final", "The final"];
        const next = i => {
          if (i >= 3) {
            const S = G.save, rec = S.league[cup.id] = S.league[cup.id] || { n: 0 }; rec.won = true; rec.n++;
            S.rings += cup.rings; S.ach.cups = (S.ach.cups || 0) + 1;
            for (const c of party) c.log.push([S.day, `Won the Garden League's ${cup.name}.`]);
            const lines = [["Commissioner Ines Vale", `The ${cup.name} goes to ${S.avatar.name || "you"} and ${party.map(c => c.name).join(", ")}! ${cup.rings} rings, and the cup.`]];
            if (cup.id === "champion" && rec.n === 1) { addItem("egg", null, G.keeper.x + 1, G.keeper.z, G.L.egg("chao-neutral-child", { from: "the Garden League's prize for its champion", genes: null })).data.silver = true; lines.push(["Commissioner Ines Vale", "And for the league's new champion: an egg like no other. Look after it."]); }
            persist(); jingle("born-change"); talk(lines);
            return;
          }
          const v = keepers[i];
          duel(v, party, rows, { mul: cup.mul * (1 + i * 0.07), rings: 40 + i * 20, title: cup.name, sub: round[i], music: i === 2 ? "race-3" : "race-2", onDone: won => { if (won) setTimeout(() => next(i + 1), 50); else talk([[v.name, v.lose], ["Commissioner Ines Vale", `Out in ${round[i].toLowerCase()}. The ${cup.name} will be here when you're ready.`]]); } });
        };
        next(0);
      } });
    });
  }

  /* ---------------------------------------------------------------- the encyclopedias */
  function encyclopedia(tab, sel) {
    const D = G.D, S = G.save;
    tab = tab || G.encTab || "chao"; G.encTab = tab;
    const list = tab === "chao" ? D.CHAO : D.ANIMALS;
    const seen = list.filter(s => S.seen[s.id]).length;
    const stars = n => "★".repeat(Math.min(6, n));
    const cell = s => S.seen[s.id] ? `<button class="cg-ecell seen" data-f data-sp="${s.id}"><canvas width="96" height="96" data-sthumb="${s.id}"></canvas><b>${esc(s.name)}</b></button>` : `<button class="cg-ecell" data-f data-sp="${s.id}"><span class="cg-q">?</span><b>???</b></button>`;
    const el = menuOpen(`<div class="panel cg-panel cg-enc"><div class="panel-hd">${ico("book")}Encyclopedia<small>${seen}/${list.length} found</small></div>
      <div class="cg-tabs"><button class="${tab === "chao" ? "sel" : ""}" data-f data-tab="chao">Chao</button><button class="${tab === "animal" ? "sel" : ""}" data-f data-tab="animal">Animals</button></div>
      <div class="cg-enc-body"><div class="cg-egrid">${list.map(cell).join("")}</div><div class="cg-edetail"></div></div>
      <div class="cg-foot"><button class="btn ghost" data-f data-back>${ico("back")}Back</button></div></div>`, () => { menuClose(); }, "cg-cardwrap");
    el.querySelector("[data-back]").onclick = menuClose;
    el.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => encyclopedia(b.dataset.tab));
    const det = el.querySelector(".cg-edetail");
    const show = id => {
      const s = D.species(id), known = S.seen[id];
      if (!known) { det.innerHTML = `<h3>???</h3><p>Not found yet.</p><p class="cg-meta">Rarity ${stars(s.rarity)}${s.kind === "animal" ? ` &middot; lives in the ${esc(D.REGIONS[s.region].name)}` : ""}</p>${s.rarity >= 4 ? "" : `<p class="cg-how">${esc(s.how || "")}</p>`}`; return; }
      det.innerHTML = `<canvas class="cg-prev" width="220" height="220"></canvas><h3>${esc(s.name)}</h3><p class="cg-meta">Rarity ${stars(s.rarity)}${s.kind === "animal" ? ` &middot; ${esc(D.REGIONS[s.region].name)} &middot; leans to ${esc(D.ATTRS.find(a => a.id === s.lean).name)}` : ` &middot; ${esc(D.ALIGNS[s.align].name)}`}</p><p>${esc(s.text || animalText(s))}</p>${s.how ? `<p class="cg-how">${esc(s.how)}</p>` : ""}<p class="cg-meta">${S.owned[id] ? "Raised in your garden" : "Seen"}</p>`;
      livePreview(det.querySelector(".cg-prev"), () => G.M.creature(fakeOf(s)));
    };
    el.querySelectorAll("[data-sp]").forEach(b => { b.onclick = () => show(b.dataset.sp); b.onfocus = () => show(b.dataset.sp); });
    show(sel || (list.find(s => S.seen[s.id]) || list[0]).id);
    sthumbs(el);
  }
  function animalText(s) { const parts = []; parts.push(`A ${s.size > 1 ? "big" : s.size < 0.4 ? "small" : ""} ${s.plan === "quad" ? "four-legged" : s.plan} creature`.replace("  ", " ")); if (s.classic) parts.push("one of the animals Eggman locks inside his badniks"); return parts.join(", ") + "."; }
  /* a stand-in creature for a species (for the encyclopedia's pictures) */
  function fakeOf(s) { return { id: "x", sp: s.id, kind: s.kind, genes: { size: 1, tint: 0, tint2: 0, pat: "plain", al: {} }, stage: s.stage || 0, grown: 1 }; }

  /* ---------------------------------------------------------------- pictures in the menus
     One small renderer for all of them: a creature drawn into a canvas, turning, or a still. */
  const PREV = { R: null, scene: null, cam: null, live: [], raf: 0 };
  function prevR() {
    if (PREV.R) return PREV;
    PREV.R = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    PREV.R.setPixelRatio(1); PREV.R.setSize(300, 300, false);
    PREV.scene = new THREE.Scene();
    PREV.scene.add(new THREE.HemisphereLight(0xffffff, 0x8a9ab8, 0.85));
    const d = new THREE.DirectionalLight(0xffffff, 0.7); d.position.set(2, 4, 3); PREV.scene.add(d);
    PREV.cam = new THREE.PerspectiveCamera(30, 1, 0.05, 50);
    return PREV;
  }
  function drawRig(rig, cv, turn) {
    const P = prevR();
    P.scene.add(rig.g);
    const h = Math.max(0.3, (rig.h || 0.6) * rig.g.scale.x), r = Math.max(h, (rig.r || 0.3) * 2.2 * rig.g.scale.x);
    rig.g.rotation.y = turn != null ? turn : 0.5;
    if (rig.shadow) rig.shadow.visible = false;
    P.cam.position.set(0, h * 0.62, r * 2.2 + 0.6); P.cam.lookAt(0, h * 0.42, 0);
    P.R.setSize(cv.width, cv.height, false); P.R.setClearColor(0x000000, 0); P.R.render(P.scene, P.cam);
    const x = cv.getContext("2d"); x.clearRect(0, 0, cv.width, cv.height); x.drawImage(P.R.domElement, 0, 0, cv.width, cv.height);
    P.scene.remove(rig.g);
  }
  function livePreview(cv, makeRig) {
    if (!cv) return;
    const rig = makeRig(); const item = { cv, rig, t: 0 };
    PREV.live.push(item);
    if (!PREV.raf) { let last = 0; const loop = (now) => { if (!PREV.live.length) { PREV.raf = 0; return; } PREV.raf = requestAnimationFrame(loop); const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; for (const it of PREV.live) { if (!it.cv.isConnected) continue; it.t += dt; it.rig.anim(it.t, dt, "idle"); drawRig(it.rig, it.cv, 0.4 + it.t * 0.6); } PREV.live = PREV.live.filter(i => i.cv.isConnected); }; PREV.raf = requestAnimationFrame(loop); }
  }
  function stopPreviews() { PREV.live = PREV.live.filter(i => i.cv.isConnected); }
  const THUMB = new Map();
  function thumbs(el, find) {
    const cvs = [...el.querySelectorAll("[data-thumb]")]; let i = 0;
    const step = () => { if (!G || !el.isConnected) return; for (let n = 0; n < 3 && i < cvs.length; n++, i++) { const cv = cvs[i], c = find(cv.dataset.thumb); if (!c) continue; const rig = G.M.creature(c); rig.anim(0, 0, "idle"); drawRig(rig, cv, 0.5); } if (i < cvs.length) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function sthumbs(el) {
    const cvs = [...el.querySelectorAll("[data-sthumb]")]; let i = 0;
    const step = () => { if (!G || !el.isConnected) return; for (let n = 0; n < 4 && i < cvs.length; n++, i++) { const cv = cvs[i], id = cv.dataset.sthumb; if (THUMB.has(id)) { cv.getContext("2d").drawImage(THUMB.get(id), 0, 0); continue; } const rig = G.M.creature(fakeOf(G.D.species(id))); rig.anim(0, 0, "idle"); drawRig(rig, cv, 0.5); const c2 = document.createElement("canvas"); c2.width = cv.width; c2.height = cv.height; c2.getContext("2d").drawImage(cv, 0, 0); THUMB.set(id, c2); } if (i < cvs.length) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------------- the keeper's look
     Post Parade's trainer screen: a man or a woman, skin, a cut and its colour, eyes, what
     they wear and its colour, bottoms, glasses -- words as a segmented row, colours as
     swatches, the figure turning beside them as you pick; up and down between rows, left and
     right through a row's choices. */
  function creator(first) {
    const M = G.M, O = M.AVATAR.OPTIONS, rows = M.AVATAR.rows;
    const c = Object.assign(M.avDefault(G.save.avatar && G.save.avatar.sex), G.save.avatar || {});
    const vals = r => r.sw ? O[r.sw].map((col, i) => [i, col]) : r.seg(c);
    const rowHtml = r => `<div class="cg-crow2" data-f data-row="${r.key}"><label>${esc(r.label)}</label><div class="cg-seg">${r.sw
      ? O[r.sw].map((col, i) => `<button data-v="${i}" class="sw" style="background:#${col.toString(16).padStart(6, "0")}"></button>`).join("")
      : r.seg(c).map(([v, t]) => `<button data-v='${esc(JSON.stringify(v))}'>${esc(t)}</button>`).join("")}</div></div>`;
    const el = menuOpen(`<div class="panel cg-panel cg-creator"><div class="panel-hd gold">${ico("person")}${first ? "Who's the new keeper?" : "The keeper"}</div>
      <div class="cg-cr-body"><div class="cg-cr-l"><canvas class="cg-prev" width="320" height="420"></canvas><label class="cg-lab">Your name</label><input maxlength="14" value="${esc(c.name || "")}" placeholder="A name" spellcheck="false"></div>
      <div class="cg-cr-r"><p class="cg-text">This is you: the one who walks the garden, and keeps its Chao and animals.</p>${rows.map(rowHtml).join("")}</div></div>
      <div class="cg-foot">${first ? "" : `<button class="btn ghost" data-f data-back>${ico("back")}Back</button>`}<button class="btn ghost" data-f data-rand>${ico("swap")}Surprise me</button><button class="btn" data-f data-done>${ico("check")}${first ? "Into the garden" : "Done"}</button></div></div>`, first ? () => {} : () => menuClose(), "cg-cardwrap");
    const cv = el.querySelector(".cg-prev");
    const rebuild = () => { PREV.live = PREV.live.filter(i => i.cv !== cv); livePreview(cv, () => M.avatar(c)); };
    const valOf = (r, b) => r.sw ? +b.dataset.v : JSON.parse(b.dataset.v);
    const bind = () => el.querySelectorAll("[data-row]").forEach(rw => { const r = rows.find(x => x.key === rw.dataset.row); rw.querySelectorAll("[data-v]").forEach(b => b.onclick = ev => { ev.stopPropagation(); set(r, valOf(r, b)); }); });
    const sync = () => {
      for (const r of rows) {
        const rw = el.querySelector(`[data-row="${r.key}"]`);
        if (r.bySex) rw.querySelector(".cg-seg").innerHTML = r.seg(c).map(([v, t]) => `<button data-v='${esc(JSON.stringify(v))}'>${esc(t)}</button>`).join("");
        rw.querySelectorAll("[data-v]").forEach(b => b.classList.toggle("sel", valOf(r, b) === c[r.key]));
      }
      bind(); rebuild();
    };
    /* a change of body brings that body's own cuts and bottoms, starting from its usual ones */
    const set = (r, v) => { if (r.key === "sex" && v !== c.sex) { const d = M.avDefault(v); c.style = d.style; c.bottoms = d.bottoms; } c[r.key] = v; sync(); };
    G.menu.row = (rowEl, dx) => { const r = rows.find(x => x.key === rowEl.dataset.row), vs = vals(r).map(x => x[0]), i = Math.max(0, vs.findIndex(v => v === c[r.key])); set(r, vs[(i + dx + vs.length) % vs.length]); };
    el.querySelector("[data-rand]").onclick = () => {
      const n = k => Math.floor(Math.random() * k), any = a => a[n(a.length)];
      c.sex = Math.random() < 0.5 ? "m" : "f"; c.skin = n(O.skins.length); c.hair = n(O.hairs.length); c.eyes = n(O.eyes.length);
      c.style = any(O.styles[c.sex]); c.attire = any(O.attires); c.bottoms = any(O.bottoms[c.sex]); c.colour = n(O.colours.length); c.glasses = Math.random() < 0.25;
      sync();
    };
    const inp = el.querySelector("input");
    inp.onkeydown = ev => { ev.stopPropagation(); if (ev.key === "Enter") inp.blur(); };
    if (first) setTimeout(() => inp.focus(), 60);
    const done = () => {
      c.name = inp.value.trim().slice(0, 14) || "Keeper";
      G.save.avatar = c; persist();
      menuClose();
      if (first) arrive();
      else if (G.keeper) { G.scene.remove(G.keeper.rig.g); G.keeper.rig = M.avatar(c); shadowsOn(G.keeper.rig.g); G.scene.add(G.keeper.rig.g); }
    };
    el.querySelector("[data-done]").onclick = done;
    const b = el.querySelector("[data-back]"); if (b) b.onclick = menuClose;
    sync();
  }

  /* ---------------------------------------------------------------- input */
  const KEYMAP = { ArrowUp: "U", KeyW: "U", ArrowDown: "D", KeyS: "D", ArrowLeft: "L", KeyA: "L", ArrowRight: "R", KeyD: "R" };
  function onKey(ev) {
    if (!G) return;
    const down = ev.type === "keydown", tag = ev.target && ev.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const k = ev.code;
    if (KEYMAP[k]) { G.keys[KEYMAP[k]] = down; if (down && G.menu) { G.kbUsed = true; const d = KEYMAP[k]; moveFocus(d === "L" ? -1 : d === "R" ? 1 : 0, d === "U" ? -1 : d === "D" ? 1 : 0); } ev.preventDefault(); return; }
    if (k === "ShiftLeft" || k === "ShiftRight") G.keys.Shift = down;
    if (k === "KeyQ") G.keys.q = down; if (k === "KeyE") G.keys.e = down;
    if (!down || ev.repeat) return;
    if (G.talking) { if (k === "KeyZ" || k === "Enter" || k === "Space" || k === "KeyX") { ev.preventDefault(); G.talkNext && G.talkNext(); } return; }
    if (G.menu) {
      G.kbUsed = true;
      if (k === "KeyZ" || k === "Enter" || k === "Space") { ev.preventDefault(); if (G.focus && G.focus.isConnected) { if (G.focus.dataset.row != null && G.menu.row) G.menu.row(G.focus, 1); else G.focus.click(); } else moveFocus(0, 1); }
      else if (k === "KeyX" || k === "Escape" || k === "Backspace") { ev.preventDefault(); const b = G.menu.back; b && b(); }
      return;
    }
    if (!G.keeper) return;
    if (G.battle) { if (G.battle.key(k)) ev.preventDefault(); return; }
    if (k === "KeyZ") actZ(); else if (k === "KeyC") actC(); else if (k === "KeyX") actX(); else if (k === "KeyV") actV();
    else if (k === "Space") { G.jump = true; ev.preventDefault(); }
    else if (k === "Enter" || k === "Escape") mainMenu();
  }
  function inputDir() {
    const K = G.keys, t = G.touch, p = G.pad;
    let x = (K.R ? 1 : 0) - (K.L ? 1 : 0) + (t.x || 0) + (p.lx || 0), y = (K.U ? 1 : 0) - (K.D ? 1 : 0) - (t.y || 0) - (p.ly || 0);
    const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; }
    return { x, y, pad: !!(p.lx || p.ly || t.x || t.y), run: p.run || t.run };
  }
  function pollPad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = pads && [...pads].find(Boolean); const P = G.pad;
    if (!gp) { P.lx = P.ly = P.rx = P.ry = 0; return; }
    const dz = v => Math.abs(v) < 0.18 ? 0 : v;
    P.lx = dz(gp.axes[0] || 0); P.ly = dz(gp.axes[1] || 0); P.rx = dz(gp.axes[2] || 0); P.ry = dz(gp.axes[3] || 0);
    const b = i => gp.buttons[i] && gp.buttons[i].pressed;
    const was = P.b || {}, now = {};
    for (const i of [0, 1, 2, 3, 9, 12, 13, 14, 15, 10]) now[i] = b(i);
    const press = i => now[i] && !was[i];
    P.run = now[10] || (gp.buttons[7] && gp.buttons[7].value > 0.5);
    if (G.menu || G.talking) {
      if (G.talking && (press(0) || press(1))) G.talkNext && G.talkNext();
      else if (G.menu) { if (press(12) || (P.ly < -0.6 && !P.navY)) moveFocus(0, -1); if (press(13) || (P.ly > 0.6 && !P.navY)) moveFocus(0, 1); if (press(14) || (P.lx < -0.6 && !P.navX)) moveFocus(-1, 0); if (press(15) || (P.lx > 0.6 && !P.navX)) moveFocus(1, 0); if (press(0)) { G.kbUsed = true; G.focus && G.focus.isConnected ? (G.focus.dataset.row != null && G.menu.row ? G.menu.row(G.focus, 1) : G.focus.click()) : moveFocus(0, 1); } if (press(1) || press(9)) G.menu.back && G.menu.back(); }
      P.navY = Math.abs(P.ly) > 0.6; P.navX = Math.abs(P.lx) > 0.6;
    } else if (G.battle) {
      if (press(0) || press(9)) G.battle.key("KeyZ");
    } else if (G.keeper) {
      if (press(0)) actZ(); if (press(2)) actC(); if (press(1)) actX(); if (press(3)) actV(); if (press(9)) mainMenu();
    }
    P.b = now;
  }
  let drag = null;
  function onDown(ev) { if (!G || G.menu || ev.target !== G.R.domElement) return; drag = { x: ev.clientX, y: ev.clientY, id: ev.pointerId }; G.dragging = true; }
  function onMove(ev) { if (!drag || ev.pointerId !== drag.id) return; const U = G.cam.userData; U.yaw -= (ev.clientX - drag.x) * 0.008; U.pitch = clamp(U.pitch + (ev.clientY - drag.y) * 0.005, 0.08, 1.2); drag.x = ev.clientX; drag.y = ev.clientY; }
  function onUp(ev) { if (drag && ev.pointerId === drag.id) { drag = null; G && (G.dragging = false); } }
  function onWheel(ev) { if (!G || G.menu) return; const U = G.cam.userData; U.dist = clamp(U.dist * (ev.deltaY > 0 ? 1.1 : 0.9), 3.2, 16); }
  function bindInput() { addEventListener("keydown", onKey, true); addEventListener("keyup", onKey, true); addEventListener("pointerdown", onDown); addEventListener("pointermove", onMove); addEventListener("pointerup", onUp); G.R.domElement.addEventListener("wheel", onWheel, { passive: true }); addEventListener("blur", onBlur); }
  function unbindInput() { removeEventListener("keydown", onKey, true); removeEventListener("keyup", onKey, true); removeEventListener("pointerdown", onDown); removeEventListener("pointermove", onMove); removeEventListener("pointerup", onUp); removeEventListener("blur", onBlur); }
  function onBlur() { if (G) G.keys = {}; }
  /* on a phone: a stick on the left, the buttons on the right */
  function touchPad() {
    const box = G.el.querySelector(".cg-touch");
    box.innerHTML = `<div class="cg-stick"><span></span></div><div class="cg-btns"><button data-t="Z">Z</button><button data-t="C">C</button><button data-t="X">X</button><button data-t="V">V</button><button data-t="J">${ico("chevrons")}</button></div>`;
    box.classList.add("on");
    const st = box.querySelector(".cg-stick"), knob = st.querySelector("span"); let sid = null, c0 = null;
    st.addEventListener("pointerdown", ev => { sid = ev.pointerId; const r = st.getBoundingClientRect(); c0 = [r.left + r.width / 2, r.top + r.height / 2]; st.setPointerCapture(sid); mv(ev); });
    const mv = ev => { if (ev.pointerId !== sid) return; let dx = (ev.clientX - c0[0]) / 50, dy = (ev.clientY - c0[1]) / 50; const m = Math.hypot(dx, dy); if (m > 1) { dx /= m; dy /= m; } G.touch.x = dx; G.touch.y = dy; G.touch.run = m > 0.95; knob.style.transform = `translate(${dx * 34}px,${dy * 34}px)`; };
    st.addEventListener("pointermove", mv);
    const up = ev => { if (ev.pointerId !== sid) return; sid = null; G.touch.x = G.touch.y = 0; G.touch.run = false; knob.style.transform = ""; };
    st.addEventListener("pointerup", up); st.addEventListener("pointercancel", up);
    box.querySelectorAll("[data-t]").forEach(b => b.addEventListener("pointerdown", ev => { ev.preventDefault(); const t = b.dataset.t; if (G.talking) { G.talkNext && G.talkNext(); return; } if (G.menu) return; if (G.battle) { G.battle.key("KeyZ"); return; } if (t === "Z") actZ(); else if (t === "C") actC(); else if (t === "X") actX(); else if (t === "V") actV(); else if (t === "J") G.jump = true; }));
  }

  /* ---------------------------------------------------------------- music
     The garden's tunes (audio/chao/*.mp3, from Sonic Adventure 2 Battle's own Chao Garden),
     looped where the game loops them (loops.json), at the cabinet's music volume; the jingles
     (an egg hatching, a Chao changing) play over the tune, which ducks for them. */
  const MUS = { ac: null, gain: null, src: null, key: null, loops: null, buf: {}, want: null };
  const mvol = () => (root.Settings ? Settings.get("musicVolume") : 0.55);
  function ac() {
    if (MUS.ac) return MUS.ac;
    const C = root.AudioContext || root.webkitAudioContext; if (!C) return null;
    MUS.ac = new C(); MUS.gain = MUS.ac.createGain(); MUS.gain.connect(MUS.ac.destination);
    if (MUS.ac.state === "suspended") { const go = () => { MUS.ac && MUS.ac.resume(); removeEventListener("pointerdown", go, true); removeEventListener("keydown", go, true); }; addEventListener("pointerdown", go, true); addEventListener("keydown", go, true); }
    return MUS.ac;
  }
  async function track(key) {
    const A = ac(); if (!A) return null;
    if (!MUS.loops) MUS.loops = await fetch("audio/chao/loops.json").then(r => r.json()).catch(() => ({}));
    if (!MUS.buf[key]) MUS.buf[key] = fetch("audio/chao/" + key + ".mp3").then(r => r.ok ? r.arrayBuffer() : null).then(b => b && new Promise((ok, no) => A.decodeAudioData(b, ok, no))).catch(() => null);
    return MUS.buf[key];
  }
  async function music(key) {
    if (MUS.want === key) return;
    MUS.want = key;
    const A = ac(); if (!A) return;
    MUS.gain.gain.value = mvol() * 0.75;
    const buf = await track(key);
    if (MUS.want !== key || !buf) return;
    if (MUS.src) { const old = MUS.src, g = old._g; g.gain.setTargetAtTime(0, A.currentTime, 0.25); setTimeout(() => { try { old.stop(); } catch (e) {} }, 1200); }
    const src = A.createBufferSource(), g = A.createGain(); src.buffer = buf;
    const L = MUS.loops[key]; if (L) { src.loop = true; src.loopStart = L[0]; src.loopEnd = Math.min(L[1], buf.duration); } else src.loop = true;
    g.gain.value = 0.0001; g.gain.setTargetAtTime(1, A.currentTime, 0.3);
    src.connect(g); g.connect(MUS.gain); src._g = g; src.start();
    MUS.src = src; MUS.key = key;
  }
  async function jingle(key) {
    const A = ac(); if (!A || !mvol()) return;
    const buf = await track(key); if (!buf) return;
    const src = A.createBufferSource(), g = A.createGain(); src.buffer = buf; g.gain.value = 1;
    src.connect(g); g.connect(MUS.gain); src.start();
    if (MUS.src) { const mg = MUS.src._g.gain; mg.setTargetAtTime(0.12, A.currentTime, 0.08); mg.setTargetAtTime(1, A.currentTime + buf.duration, 0.4); }
  }
  function musicStop() {
    if (MUS.src) { try { MUS.src.stop(); } catch (e) {} MUS.src = null; }
    MUS.key = null; MUS.want = null;
    if (MUS.ac) { try { MUS.ac.close(); } catch (e) {} MUS.ac = null; MUS.buf = {}; }
  }
  if (root.Settings && Settings.onChange) Settings.onChange(() => { if (MUS.gain) MUS.gain.gain.value = mvol() * 0.75; });
  /* for tests: run the garden n steps of dt seconds without waiting for frames, then draw */
  function _step(n, dt) { if (!G || !G.keeper) return; for (let i = 0; i < n; i++) { if (G.battle) G.battle.frame(dt || 1 / 60); else step(dt || 1 / 60); } if (!G.battle) G.R.render(G.scene, G.cam); }
  root.ChaoGarden = { ok: true, open, close, _g: () => G, _step, _act: { z: () => actZ(), c: () => actC(), x: () => actX(), v: () => actV() } };
})(typeof globalThis !== "undefined" ? globalThis : this);
