/*
 * Red Ring Circuit: the Chao Garden's duels -- built the way Pallet to Pewter builds its
 * battles, not as a copy of any other game's. Real time, on a voxel ring: every creature
 * fights on its own, as its temperament and its Instinct tell it -- picking its techniques,
 * circling, closing in or keeping off, guarding, covering a friend -- and the keeper's job is
 * to call to them: the fight holds still while you choose (cheer one on, call for a
 * technique, launch a team technique when the gauge is full, swap who's in front). One, two
 * or three a side; a party of three at most.
 *
 * The garden's seven attributes do all of it:
 *   Velocity    how soon it acts again, how fast it closes in
 *   Agility     dodging, and how soon it can dodge again
 *   Power       a strike's weight, and breaking guards
 *   Resilience  how much a blow takes off it
 *   Vitality    its health
 *   Instinct    aim, critical blows, counters, and choosing well
 *   Chaos       its Chaos Energy: how much it holds, how fast it comes back, its specials' power
 * And the team: friends side by side hit harder and cover each other; who's in front takes the
 * blows, who's behind is harder to reach; landing blows together fills the team gauge.
 *
 *   ChaoBattle.start(env, setup, done) -> battle { frame(dt), key(code), paused }
 */
(function (root) {
  "use strict";
  const THREE = root.THREE;
  const PI = Math.PI, TAU = PI * 2;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const lerp = (a, b, t) => a + (b - a) * t;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const angTo = (a, b) => { let d = (b - a) % TAU; if (d > PI) d -= TAU; if (d < -PI) d += TAU; return d; };
  const RING = 6.2;

  /* how each fighting temperament plays: how near it likes to be, how often it guards, how
     much it leans on its specials, how bravely it goes in */
  const STYLE = {
    bold:    { range: 1.4, guard: 0.5, special: 0.9, push: 1.25, cover: 0.6 },
    careful: { range: 3.4, guard: 1.6, special: 1.1, push: 0.8, cover: 1.0 },
    tricky:  { range: 2.6, guard: 0.8, special: 1.3, push: 1.0, cover: 0.6, feint: 1 },
    fast:    { range: 1.8, guard: 0.6, special: 0.8, push: 1.15, cover: 0.7 },
    steady:  { range: 2.2, guard: 1.3, special: 1.0, push: 0.95, cover: 1.1 },
    loyal:   { range: 2.4, guard: 1.0, special: 1.0, push: 1.0, cover: 1.8 },
  };

  function start(env, setup, done) {
    const { R, M, L, D } = env;
    const B = { env, setup, done, t: 0, paused: false, over: null, fx: [], shots: [], floats: [], log: [], gauge: [0, 0], slow: 0, shake: 0, shot: null, introT: 2.2 };
    /* -- the arena */
    const scene = B.scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8ac8f0); scene.fog = new THREE.Fog(0x8ac8f0, 30, 80);
    scene.add(new THREE.HemisphereLight(0xe8f4ff, 0x6a8a4a, 0.6));
    const sun = new THREE.DirectionalLight(0xfff0d8, 0.8); sun.position.set(8, 16, 10); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 50 }); scene.add(sun);
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    const arena = M.part("arena:" + (setup.arena || "garden"), 1 / 4, (v, gl) => {
      const r0 = RING * 4, grass = (x, y, z) => M.grain(M.mixC(0x5aa83a, 0x7ac455, M.hash(x >> 1, 0, z >> 1)), x, y, z, 0.06);
      M.shape(v, -r0 - 6, -2, -r0 - 6, r0 + 6, 0, r0 + 6, (x, y, z) => Math.hypot(x, z) <= r0 + 5.5, (x, y, z) => {
        const d = Math.hypot(x, z);
        if (d > r0 + 0.5) return M.grain(0x9a9484, x, y, z, 0.06);
        if (d > r0 - 1.5) return M.grain(0xd8ccb0, x, y, z, 0.05);
        if (Math.abs(d - r0 * 0.4) < 0.6) return M.grain(0xf0f0e8, x, y, z, 0.03);
        return y === 0 ? grass(x, y, z) : M.grain(0x7a5a3a, x, y, z, 0.06);
      });
      for (let i = 0; i < 48; i++) { const a = i / 48 * TAU, x = Math.round(Math.cos(a) * (r0 + 3)), z = Math.round(Math.sin(a) * (r0 + 3)); M.blk(v, x - 1, 1, z - 1, x, 2 + (i % 2), z, (xx, y, zz) => M.grain(0xb8b0a0, xx, y, zz, 0.06)); }
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + 0.2, x = Math.round(Math.cos(a) * (r0 + 4.5)), z = Math.round(Math.sin(a) * (r0 + 4.5));
        M.blk(v, x, 1, z, x, 12, z, 0x6a4a2a); M.blk(v, x + 1, 8, z, x + 4, 12, z, (xx, y) => (y + xx) % 3 ? [0xe42630, 0x1f58e0, 0xffd21a, 0x2fb844][i % 4] : 0xf8f8f8); gl.set(x, 13, z, 0xffd040); }
    });
    arena.traverse(o => { if (o.isMesh) o.receiveShadow = true; });
    scene.add(arena);
    /* the garden's ground all round the arena (voxels near, a flat field out to the fog), so the
       keepers, the trees and the hills stand on something */
    const ringR = (RING * 4 + 5.5) / 2;
    const ground = M.part("arena-ground", 1 / 2, v => {
      M.shape(v, -80, -3, -80, 80, -1, 80, (x, y, z) => { const d = Math.hypot(x, z); return d > ringR - 0.5 && d <= 79.5; },
        (x, y, z) => y === -1 ? M.grain(M.mixC(0x4a9a3a, 0x6ab84a, M.hash(x >> 1, 0, z >> 1)), x, y, z, 0.07) : M.grain(0x7a5a3a, x, y, z, 0.06));
    });
    ground.traverse(o => { if (o.isMesh) o.receiveShadow = true; }); scene.add(ground);
    const far = new THREE.Mesh(new THREE.CircleGeometry(220, 40), new THREE.MeshLambertMaterial({ color: 0x5aa040 })); far.rotation.x = -PI / 2; far.position.y = -0.03; scene.add(far);
    /* hills and trees round it, so it sits in the garden */
    const back = M.part("arena-back", 1 / 2, v => {
      for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, r = 24 + (i % 3) * 2, x = Math.cos(a) * r, z = Math.sin(a) * r;
        M.ell(v, x, -2, z, 5 + (i % 4), 4 + (i % 3) * 2, 5, (xx, y, zz) => M.grain(M.mixC(0x4a9a3a, 0x6ab84a, M.hash(xx >> 1, y >> 1, zz >> 1)), xx, y, zz, 0.08)); }
    });
    scene.add(back);
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + 0.3, t = M.prop("tree", { k: i % 3 ? "fruit" : "oak", s: 0.9, seed: i }); t.position.set(Math.cos(a) * 13, 0, Math.sin(a) * 13); scene.add(t); }
    const cam = B.cam = new THREE.PerspectiveCamera(46, 1, 0.1, 200);
    B.camA = 0; B.camD = 13;
    /* -- the fighters */
    B.fighters = [];
    const mk = (c, side, i, n, row) => {
      const rig = M.creature(c);
      rig.g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; } });
      if (rig.shadow) rig.shadow.visible = false;
      const lane = n === 1 ? 0 : (i - (n - 1) / 2) * 2.4, z0 = (side ? -1 : 1) * (row === "back" ? 4.6 : 3);
      const hpMax = Math.round(70 + L.stat(c, "vit") * 1.1), enMax = Math.round(3 + L.stat(c, "cha") / 40);
      const f = { c, rig, side, row: row || "front", x: lane, z: z0, a: side ? 0 : PI, hp: hpMax, hpMax, en: Math.min(2, enMax), enMax,
        gap: rnd(0.6, 1.6), dodgeCD: 0, guard: 0, guardK: 0, buff: {}, daze: 0, act: null, alive: true, st: "idle", v: 0, hit: 0, id: c.id + ":" + side,
        style: STYLE[D.TEMPERS[c.genes.temper[0]].fight] || STYLE.steady, call: null, cheer: 0, dealt: 0, taken: 0, used: {} };
      rig.g.position.set(f.x, 0, f.z); scene.add(rig.g);
      B.fighters.push(f); return f;
    };
    const rows = setup.rows || {};
    setup.mine.forEach((c, i) => mk(c, 0, i, setup.mine.length, rows[c.id]));
    setup.foes.forEach((c, i) => mk(c, 1, i, setup.foes.length, setup.foeRows ? setup.foeRows[c.id] : (i === 2 ? "back" : "front")));
    /* the other keeper, at the ring's edge */
    if (setup.foeKeeper && setup.foeKeeper.look) { const k = M.avatar(setup.foeKeeper.look); k.g.position.set(0, 0, -RING - 1.6); scene.add(k.g); B.foeRig = k; }
    if (setup.keeperLook) { const k = M.avatar(setup.keeperLook); k.g.position.set(0, 0, RING + 1.6); k.g.rotation.y = PI; scene.add(k.g); B.myRig = k; }
    /* -- the HUD */
    const hud = B.hud = document.createElement("div"); hud.className = "cg-bhud";
    hud.innerHTML = `<div class="cg-bside foe"></div><div class="cg-bmid"><div class="cg-bgauge"><span></span><b>Team</b></div></div><div class="cg-bside mine"></div><div class="cg-blog"></div><div class="cg-bfloat"></div><div class="cg-bcmd"><span class="cg-p"><b>Z</b>Call to your team</span></div><div class="cg-bintro"><b>${env.esc(setup.title || "Duel")}</b><i>${env.esc(setup.sub || "")}</i></div>`;
    env.el.append(hud);
    const card = f => `<div class="cg-bcard" data-f="${f.id}"><b>${env.esc(f.c.name)}</b><i>${f.row === "back" ? "Back" : "Front"}</i><span class="hp"><span></span></span><span class="en"></span></div>`;
    hud.querySelector(".cg-bside.foe").innerHTML = B.fighters.filter(f => f.side).map(card).join("");
    hud.querySelector(".cg-bside.mine").innerHTML = B.fighters.filter(f => !f.side).map(card).join("");
    hud.querySelector(".cg-bcmd").onclick = () => command();
    env.music && env.music(setup.music || "race-2");
    B.say = (t) => { B.log.push(t); const el = hud.querySelector(".cg-blog"); el.innerHTML = B.log.slice(-3).map((x, i, a) => `<div class="${i < a.length - 1 ? "old" : ""}">${env.esc(x)}</div>`).join(""); };
    B.say(setup.intro || "The duel begins!");

    /* ---------------------------------------------------------------- the fight */
    const foesOf = f => B.fighters.filter(o => o.side !== f.side && o.alive);
    const allies = f => B.fighters.filter(o => o.side === f.side && o.alive && o !== f);
    const S = (f, a) => L.stat(f.c, a) * (1 + (f.buff[a] ? 0.25 : 0)) * (f.cheer > 0 ? 1.1 : 1);
    const friends = (a, b) => (a.c.rel[b.c.id] || 0) >= 30;
    function pickTarget(f) {
      const fs = foesOf(f); if (!fs.length) return null;
      /* the front row first, mostly; the weakest when it smells a finish; whoever taunted */
      const taunt = fs.find(o => o.taunt > 0); if (taunt) return taunt;
      const ins = S(f, "ins");
      return fs.map(o => ({ o, s: (o.row === "back" && fs.some(x => x.row === "front") ? -40 : 0) - Math.hypot(o.x - f.x, o.z - f.z) * 4 + (1 - o.hp / o.hpMax) * ins * 0.6 + rnd(0, 30) }))
        .sort((a, b) => b.s - a.s)[0].o;
    }
    /* the choice: everything it knows, weighed by how it fights and what's going on; a keener
       Instinct weighs it better */
    function choose(f) {
      const T = f.c.techs.map(id => D.tech(id)).filter(t => t && (t.cost || 0) <= f.en && (t.kind !== "team"));
      const tgt = f.target = pickTarget(f); if (!tgt) return null;
      if (f.call) { const t = D.tech(f.call); f.call = null; if (t && (t.cost || 0) <= f.en) return t; }
      const st = f.style, hurt = 1 - f.hp / f.hpMax, al = allies(f), lowAlly = al.find(a => a.hp / a.hpMax < 0.4);
      const noise = 60 / (20 + S(f, "ins") / 8);
      let best = null, bs = -1e9;
      for (const t of T) {
        let s = 10;
        if (t.kind === "strike") s += (t.pow || 20) * (t.attr === "pow" ? S(f, "pow") : t.attr === "vel" ? S(f, "vel") : S(f, "agi")) / 60 * st.push + (t.first ? 6 : 0) + (t.breakGuard && tgt.guard > 0 ? 25 : 0);
        if (t.kind === "special") s += (t.pow || 20) * S(f, t.attr) / 60 * st.special + (t.splash && foesOf(f).length > 1 ? 12 : 0) - (t.cost || 0) * 3 + (t.status && tgt.daze <= 0 ? 6 : -30);
        if (t.kind === "guard") { const near = foesOf(f).some(o => Math.hypot(o.x - f.x, o.z - f.z) < 2.2 || (o.act && o.act.tg === f)); s += (near ? hurt * 22 * st.guard + 8 : -20) + (tgt.act && tgt.act.t.kind === "strike" && tgt.act.tg === f ? 14 : 0) - 8; }
        if (t.kind === "support") {
          if (t.heal) s += (t.team ? al.filter(a => a.hp < a.hpMax * 0.7).length * 14 : lowAlly || hurt > 0.5 ? 30 : -40) * (t.team ? 1 : 1);
          if (t.buff) s += al.length ? 14 : -10;
          if (t.energy) s += f.en < 2 ? 22 : -15;
          if (t.taunt) s += al.some(a => a.hp < a.hpMax * 0.5) ? 18 * st.cover : -20;
          if (t.cover) s += lowAlly ? 26 * st.cover : -25;
        }
        if (f.used[t.id] && f.used[t.id] > B.t - 4) s -= t.kind === "guard" ? 40 : 20;     // (and not the same thing every time)
        s += rnd(-noise, noise);
        if (s > bs) { bs = s; best = t; }
      }
      return best;
    }
    function begin(f, t) {
      f.used[t.id] = B.t; f.en -= t.cost || 0;
      const tg = f.target;
      if (t.kind === "strike") f.act = { t, phase: "go", tg, time: 0 };
      else if (t.kind === "special") { f.act = { t, phase: "wind", tg, time: 0 }; }
      else if (t.kind === "guard") { f.guard = t.dodge ? 0 : t.guard || 0.5; f.guardK = t.counter ? "counter" : t.dodge ? "dodge" : "guard"; f.guardT = 1.6; f.act = { t, phase: "hold", time: 0 }; B.say(`${f.c.name}: ${t.name}!`); }
      else if (t.kind === "support") { f.act = { t, phase: "cast", time: 0 }; }
      if (t.kind !== "guard") callout(f, t.name);
    }
    /* a blow lands, or doesn't */
    function strike(f, o, t, k) {
      if (!o.alive) return;
      const ins = S(f, "ins"), agi = S(o, "agi");
      /* dodged? (a sidestep held ready, or just quick feet) */
      const dodge = (o.guardK === "dodge" && o.guardT > 0 ? 0.6 : 0) + (o.dodgeCD <= 0 && o.act == null ? clamp((agi - ins * 0.6) / 400, 0.03, 0.22) : 0) - (t.sure ? 1 : 0) - (t.air ? 0.1 : 0);
      if (Math.random() < dodge) { o.dodgeCD = clamp(4 - S(o, "agi") / 160, 1.4, 4); hop(o, f); pop(o, "Dodged!", 0x6fe6ff); return; }
      const atk = t.kind === "special" ? S(f, "cha") : S(f, t.attr || "pow"), def = t.kind === "special" ? (S(o, "res") + S(o, "ins")) / 2 : S(o, "res");
      let dmg = (t.pow || 20) * (k || 1) * 2 * atk / (atk + def + 20);
      const al = allies(f); if (al.some(a => friends(a, f))) dmg *= 1.1;
      if (o.row === "back" && t.kind === "strike" && foesOf(f).some(x => x.row === "front" && x !== o)) dmg *= 0.8;
      const crit = Math.random() < clamp(ins / 900, 0.03, 0.22) + (L.traitsOf(f.c).find(x => x.fight && x.fight.crit) ? 0.08 : 0);
      if (crit) dmg *= 1.5;
      if (o.guard > 0 && o.guardT > 0 && !t.breakGuard) dmg *= 1 - o.guard;
      if (t.breakGuard && o.guardT > 0) { o.guardT = 0; o.guard = 0; pop(o, "Guard broken!", 0xff8a10); }
      const thick = L.traitsOf(o.c).find(x => x.fight && x.fight.guard); if (thick) dmg *= 1 - thick.fight.guard;
      const rage = L.traitsOf(f.c).find(x => x.fight && x.fight.rage); if (rage && f.hp < f.hpMax * 0.4) dmg *= 1 + rage.fight.rage;
      /* a friend nearby may take it for them */
      const cover = B.fighters.find(x => x.side === o.side && x.alive && x !== o && (x.covering > 0 || (L.traitsOf(x.c).some(q => q.fight && q.fight.cover) && friends(x, o) && Math.random() < 0.25)) && Math.hypot(x.x - o.x, x.z - o.z) < 3.5);
      let to = o;
      if (cover) { to = cover; cover.covering = 0; dmg *= 0.85; B.say(`${cover.c.name} took it for ${o.c.name}!`); }
      dmg = Math.max(1, Math.round(dmg * rnd(0.9, 1.1)));
      hurt(to, dmg, f, crit);
      if (t.drain) { f.hp = Math.min(f.hpMax, f.hp + Math.round(dmg * t.drain)); pop(f, "+" + Math.round(dmg * t.drain), 0x6ad050); }
      if (t.status === "dazed") { to.daze = 4; pop(to, "Dazed", 0xb070f0); }
      if (t.knock || crit) knock(to, f, crit ? 2.2 : 1.4);
      if (to.guardK === "counter" && to.guardT > 0 && to.alive) { to.guardT = 0; B.say(`${to.c.name} countered!`); setTimeout(() => strike(to, f, { kind: "strike", attr: "ins", pow: 34 }, 1.3), 120); }
      /* the team gauge: blows landed together fill it */
      B.gauge[f.side] = Math.min(100, B.gauge[f.side] + 6 + (al.length ? 3 : 0));
      f.dealt += dmg;
    }
    function hurt(o, dmg, by, crit) {
      o.hp = Math.max(0, o.hp - dmg); o.taken += dmg; o.hit = 0.25;
      pop(o, (crit ? "Critical! " : "") + dmg, crit ? 0xffd21a : 0xffffff, crit);
      burst(o.x, 0.6, o.z, crit ? [0xffd21a, 0xffffff, 0xff8a10] : [0xffffff, 0xf8e070], crit ? 16 : 9);
      B.shake = Math.max(B.shake, crit ? 0.25 : 0.1);
      env.sfx && env.sfx(crit ? "impact" : "hit");
      if (o.hp <= 0 && o.alive) {
        const sw = L.traitsOf(o.c).find(x => x.fight && x.fight.second);
        if (sw && !o.second) { o.second = true; o.hp = Math.round(o.hpMax * 0.25); pop(o, "Second wind!", 0x6ad050); return; }
        o.alive = false; o.act = null; o.st = "sleep"; o.rig.face = "shut"; B.say(`${o.c.name} is out of the fight!`); B.slow = 0.6; env.sfx && env.sfx("stumble");
        B.shot = { f: o, t: 0.9 };
      }
    }
    function knock(o, f, k) { const a = Math.atan2(o.x - f.x, o.z - f.z); o.kvx = Math.sin(a) * k * 4; o.kvz = Math.cos(a) * k * 4; o.kT = 0.25; }
    function hop(o, f) { const a = Math.atan2(o.x - f.x, o.z - f.z) + (Math.random() < 0.5 ? 1.3 : -1.3); o.kvx = Math.sin(a) * 5; o.kvz = Math.cos(a) * 5; o.kT = 0.22; o.jump = 0.3; }
    function heal(f, n) { f.hp = Math.min(f.hpMax, f.hp + n); pop(f, "+" + n, 0x6ad050); burst(f.x, 0.5, f.z, [0x6ad050, 0xffffff], 8); }
    /* -- the team techniques: two or three of the same side together, when the gauge is full */
    function teamTech(side) {
      const mine = B.fighters.filter(f => f.side === side && f.alive);
      if (B.gauge[side] < 100 || mine.length < 2) return false;
      const t = D.tech(mine.length >= 3 ? "trio-storm" : mine.some(f => S(f, "pow") > S(f, "vel")) ? "duo-tower" : "duo-spin");
      const tg = pickTarget(mine[0]); if (!tg) return false;
      B.gauge[side] = 0;
      for (const f of mine) { f.act = { t, phase: "team", tg, time: 0, team: mine }; f.target = tg; }
      B.say(`${mine.map(f => f.c.name).join(" and ")}: ${t.name}!`);
      callout(mine[0], t.name, true); B.shot = { f: tg, t: 1.4, wide: true };
      env.jingle && env.jingle("dance");
      return true;
    }
    function act(f, dt) {
      const A = f.act; A.time += dt;
      const t = A.t, tg = A.tg;
      if (A.phase === "go") {
        if (!tg || !tg.alive) { f.act = null; return; }
        const d = Math.hypot(tg.x - f.x, tg.z - f.z), reach = 0.9 + (tg.rig.r || 0.3);
        if (d > reach && A.time < 2.2) { move(f, tg.x, tg.z, dt, (2.4 + S(f, "vel") / 120) * (t.first ? 1.4 : 1)); f.st = "run"; return; }
        A.phase = "hit"; A.time = 0; f.st = "train";
      }
      if (A.phase === "hit") {
        face(f, tg, dt); f.st = "train";
        if (A.time > 0.18 && !A.done) {
          A.done = true;
          const hits = t.hits || 1;
          for (let i = 0; i < hits; i++) setTimeout(() => { if (B.over || !tg.alive || !f.alive) return; if (f.daze > 0 && Math.random() < 0.5) { pop(f, "Missed!", 0xb070f0); return; } strike(f, tg, t, 1); }, i * 140);
        }
        if (A.time > 0.45 + (t.slow ? 0.5 : 0)) { f.act = null; f.gap = gapOf(f); }
        return;
      }
      if (A.phase === "wind") {
        face(f, tg, dt); f.st = "happy";
        if (A.time > 0.45) { fire(f, tg, t); f.act = null; f.gap = gapOf(f); }
        return;
      }
      if (A.phase === "hold") { f.st = "sit"; if (A.time > 0.5) { f.act = null; f.gap = gapOf(f) * 0.7; } return; }
      if (A.phase === "cast") {
        f.st = "dance";
        if (A.time > 0.5 && !A.done) {
          A.done = true; const al = allies(f);
          if (t.heal) { if (t.team) [f, ...al].forEach(x => heal(x, Math.round(x.hpMax * t.heal))); else { const w = [f, ...al].sort((a, b) => a.hp / a.hpMax - b.hp / b.hpMax)[0]; heal(w, Math.round(w.hpMax * t.heal)); } }
          if (t.buff) for (const x of [f, ...al]) { x.buff[t.buff] = 6; pop(x, "Power up", 0xff8a10); }
          if (t.energy) { f.en = Math.min(f.enMax, f.en + t.energy); pop(f, "+Chaos", 0x40e0e8); }
          if (t.taunt) { f.taunt = 4; pop(f, "Over here!", 0xffd21a); }
          if (t.cover) { f.covering = 5; pop(f, "Covering", 0x6fe6ff); }
        }
        if (A.time > 0.8) { f.act = null; f.gap = gapOf(f); }
        return;
      }
      if (A.phase === "team") {
        if (!tg || !tg.alive) { f.act = null; return; }
        const i = A.team.indexOf(f), a = Math.atan2(f.x - tg.x, f.z - tg.z) + (i - 1) * 0.9, d = Math.hypot(tg.x - f.x, tg.z - f.z);
        if (A.time < 1.0 && d > 1.2) { move(f, tg.x + Math.sin(a) * 1, tg.z + Math.cos(a) * 1, dt, 6); f.st = "run"; return; }
        f.st = "train"; face(f, tg, dt);
        if (!A.done && i === 0) { A.done = true; const k = A.team.length >= 3 ? 1.5 : 1.25; for (let j = 0; j < A.team.length; j++) setTimeout(() => { if (!B.over && tg.alive) strike(A.team[j] || f, tg, Object.assign({}, t, { sure: 1, kind: t.attr === "cha" ? "special" : "strike" }), k / A.team.length * 1.6); }, 120 + j * 160); }
        if (A.time > 1.6) { f.act = null; f.gap = gapOf(f); }
      }
    }
    /* a special flies at its target, and can be dodged */
    function fire(f, tg, t) {
      if (!tg) return;
      const c = t.attr === "ins" ? 0x9aa4b0 : t.id === "leafstorm" ? 0x6ad050 : t.id === "bubbleburst" ? 0x9ad8f8 : t.id === "dazzle" ? 0xf8f070 : t.id === "drain" ? 0xb070f0 : t.id === "nova" ? 0xffffff : 0x40e0e8;
      const targets = t.splash ? foesOf(f) : [tg];
      for (const o of targets) {
        const m = new THREE.Mesh(new THREE.IcosahedronGeometry(t.id === "nova" ? 0.4 : 0.2, 0), new THREE.MeshBasicMaterial({ color: c }));
        m.position.set(f.x, 0.55, f.z); scene.add(m);
        B.shots.push({ m, f, o, t, k: t.splash ? 0.6 : 1, sp: t.id === "nova" ? 6 : 9 });
      }
      env.sfx && env.sfx("shot");
    }
    function gapOf(f) { return clamp(2.6 * 260 / (S(f, "vel") + 200), 0.7, 2.8) * (f.daze > 0 ? 1.3 : 1) * rnd(0.85, 1.15); }
    function move(f, x, z, dt, sp) {
      const a = Math.atan2(x - f.x, z - f.z); f.a += angTo(f.a, a) * Math.min(1, dt * 10);
      f.x += Math.sin(a) * sp * dt; f.z += Math.cos(a) * sp * dt; keepIn(f);
    }
    function face(f, o, dt) { if (o) f.a += angTo(f.a, Math.atan2(o.x - f.x, o.z - f.z)) * Math.min(1, dt * 10); }
    function keepIn(f) { const d = Math.hypot(f.x, f.z); if (d > RING - 0.4) { f.x *= (RING - 0.4) / d; f.z *= (RING - 0.4) / d; } }
    /* between actions: circle at the distance it likes, a little apart from its friends */
    function idle(f, dt) {
      const tg = f.target && f.target.alive ? f.target : (f.target = pickTarget(f)); if (!tg) return;
      const want = f.style.range * (f.row === "back" ? 1.7 : 1), d = Math.hypot(tg.x - f.x, tg.z - f.z) || 1;
      const ux = (f.x - tg.x) / d, uz = (f.z - tg.z) / d, side = f.side ? 1 : -1;
      let tx = tg.x + ux * want - uz * side * 0.8, tz = tg.z + uz * want + ux * side * 0.8;
      for (const a of allies(f)) { const dd = Math.hypot(a.x - f.x, a.z - f.z); if (dd < 1.5) { tx += (f.x - a.x) / (dd || 1) * 1.2; tz += (f.z - a.z) / (dd || 1) * 1.2; } }
      const dx = tx - f.x, dz = tz - f.z, dm = Math.hypot(dx, dz);
      if (dm > 0.3) { move(f, tx, tz, dt, 1.2 + S(f, "vel") / 300); f.st = "walk"; } else f.st = "idle";
      face(f, tg, dt);
    }
    function tickF(f, dt) {
      if (!f.alive) { f.rig.anim(B.t, dt, "sleep"); f.rig.g.position.set(f.x, 0, f.z); return; }
      f.en = Math.min(f.enMax, f.en + dt * (0.18 + S(f, "cha") / 1600));
      f.dodgeCD -= dt; f.daze -= dt; f.cheer -= dt; f.taunt = (f.taunt || 0) - dt; f.covering = (f.covering || 0) - dt;
      if (f.guardT > 0) f.guardT -= dt; else { f.guard = 0; f.guardK = 0; }
      for (const k in f.buff) if ((f.buff[k] -= dt) <= 0) delete f.buff[k];
      if (f.kT > 0) { f.kT -= dt; f.x += f.kvx * dt; f.z += f.kvz * dt; keepIn(f); }
      if (f.act) act(f, dt);
      else if ((f.gap -= dt) <= 0) { const t = choose(f); if (t) begin(f, t); else f.gap = 0.5; }
      else idle(f, dt);
      f.hit = Math.max(0, f.hit - dt); f.jump = Math.max(0, (f.jump || 0) - dt);
      f.rig.g.position.set(f.x + (f.hit > 0 ? Math.sin(B.t * 80) * 0.03 : 0), f.jump > 0 ? Math.sin(f.jump / 0.3 * PI) * 0.35 : 0, f.z);
      f.rig.g.rotation.y = f.a;
      f.rig.face = f.hit > 0 ? "shut" : f.daze > 0 ? "sad" : null;
      f.rig.anim(B.t, dt, f.st, 1.2);
      if (f.rig.ball) { const m = f.hp / f.hpMax < 0.3 ? "swirl" : f.guardT > 0 ? "exclaim" : f.cheer > 0 ? "heart" : "ball"; M.emote(f.rig, m); }
    }
    function shotsTick(dt) {
      for (const s of B.shots.slice()) {
        const o = s.o, dx = o.x - s.m.position.x, dz = o.z - s.m.position.z, d = Math.hypot(dx, dz);
        if (!o.alive || d < 0.4) {
          if (o.alive) strike(s.f, o, s.t, s.k);
          burst(s.m.position.x, 0.55, s.m.position.z, [s.m.material.color.getHex(), 0xffffff], 10);
          scene.remove(s.m); s.m.geometry.dispose(); B.shots.splice(B.shots.indexOf(s), 1); continue;
        }
        s.m.position.x += dx / d * s.sp * dt; s.m.position.z += dz / d * s.sp * dt; s.m.rotation.y += dt * 6; s.m.position.y = 0.55 + Math.sin(B.t * 12) * 0.05;
      }
    }

    /* ---------------------------------------------------------------- effects */
    function burst(x, y, z, cols, n) {
      const g = new THREE.BoxGeometry(0.08, 0.08, 0.08);
      for (let i = 0; i < n; i++) { const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: cols[i % cols.length] })); m.position.set(x, y, z); scene.add(m); B.fx.push({ m, v: [rnd(-2.5, 2.5), rnd(1.5, 4), rnd(-2.5, 2.5)], life: rnd(0.4, 0.7) }); }
    }
    function fxTick(dt) {
      for (const p of B.fx.slice()) { p.life -= dt; p.v[1] -= 10 * dt; p.m.position.x += p.v[0] * dt; p.m.position.y += p.v[1] * dt; p.m.position.z += p.v[2] * dt; p.m.scale.setScalar(Math.max(0.01, p.life * 1.6)); if (p.life <= 0) { scene.remove(p.m); p.m.material.dispose(); B.fx.splice(B.fx.indexOf(p), 1); } }
    }
    const V = new THREE.Vector3();
    function pop(f, text, col, big) {
      const el = document.createElement("div"); el.className = "cg-float" + (big ? " big" : ""); el.textContent = text; el.style.color = "#" + col.toString(16).padStart(6, "0");
      hud.querySelector(".cg-bfloat").append(el); B.floats.push({ el, x: f.x, z: f.z, y: (f.rig.h || 0.6) + 0.2, t: 0, life: 1.1 });
    }
    function callout(f, text, big) { pop(f, text, big ? 0xff8a10 : 0xffd21a, big); }
    function floatsTick(dt) {
      for (const p of B.floats.slice()) {
        p.t += dt; p.life -= dt;
        V.set(p.x, p.y + p.t * 0.6, p.z).project(cam);
        p.el.style.transform = `translate(${((V.x + 1) / 2 * B.w).toFixed(0)}px,${((1 - V.y) / 2 * B.h).toFixed(0)}px) translate(-50%,-100%)`;
        p.el.style.opacity = clamp(p.life * 2, 0, 1);
        if (p.life <= 0) { p.el.remove(); B.floats.splice(B.floats.indexOf(p), 1); }
      }
    }
    function hudTick() {
      for (const f of B.fighters) {
        const el = hud.querySelector(`[data-f="${f.id}"]`); if (!el) continue;
        el.querySelector(".hp>span").style.width = (f.hp / f.hpMax * 100).toFixed(1) + "%";
        el.querySelector(".hp>span").className = f.hp / f.hpMax < 0.3 ? "low" : "";
        const pips = Math.floor(f.en); const ens = el.querySelector(".en"); const want = `${"<i></i>".repeat(pips)}${"<u></u>".repeat(Math.max(0, f.enMax - pips))}`; if (ens._h !== want) { ens._h = want; ens.innerHTML = want; }
        el.classList.toggle("out", !f.alive);
        el.querySelector("i").textContent = f.row === "back" ? "Back" : "Front";
      }
      const g = hud.querySelector(".cg-bgauge>span"); g.style.width = B.gauge[0] + "%"; hud.querySelector(".cg-bgauge").classList.toggle("full", B.gauge[0] >= 100 && B.fighters.filter(f => !f.side && f.alive).length >= 2);
    }
    function camTick(dt) {
      B.camA += dt * 0.05;
      let tx = 0, tz = 0, ty = 0.4, d = B.camD, h = 5.2;
      const live = B.fighters.filter(f => f.alive); if (live.length) { tx = live.reduce((s, f) => s + f.x, 0) / live.length * 0.5; tz = live.reduce((s, f) => s + f.z, 0) / live.length * 0.5; }
      if (B.shot && B.shot.t > 0) { B.shot.t -= dt; const f = B.shot.f; tx = lerp(tx, f.x, 0.6); tz = lerp(tz, f.z, 0.6); d = B.shot.wide ? 9 : 7; h = 3; }
      if (B.introT > 0) { d = 9 + B.introT * 3; h = 3 + B.introT; }
      const cx = tx + Math.sin(B.camA) * d, cz = tz + Math.cos(B.camA) * d;
      cam.position.lerp(V.set(cx, h, cz), Math.min(1, dt * 3));
      if (B.shake > 0) { B.shake -= dt; cam.position.x += rnd(-1, 1) * B.shake * 0.4; cam.position.y += rnd(-1, 1) * B.shake * 0.3; }
      cam.lookAt(tx, ty, tz);
    }

    /* ---------------------------------------------------------------- the keeper's calls
       The fight holds still while you choose. */
    function command() {
      if (B.over || env.isMenu()) return;
      B.paused = true;
      const mine = B.fighters.filter(f => !f.side && f.alive);
      const canTeam = B.gauge[0] >= 100 && mine.length >= 2;
      const el = env.menuOpen(env.sec("Call to your team", "megaphone", `
        <div class="cg-mm">
          ${mine.map((f, i) => `<button class="cg-mi" data-f ${i === 0 ? "data-focus" : ""} data-cheer="${f.id}">${env.ico("heart")}<b>Cheer ${env.esc(f.c.name)} on</b><i>A little stronger and quicker for a while; it'll remember you were there</i></button>`).join("")}
          <button class="cg-mi" data-f data-call>${env.ico("star")}<b>Call a technique</b><i>Tell one of them what to do next</i></button>
          ${mine.length > 1 ? `<button class="cg-mi" data-f data-swap>${env.ico("swap")}<b>Swap who's in front</b><i>The front takes the blows; the back is harder to reach</i></button>` : ""}
          <button class="cg-mi" data-f data-team ${canTeam ? "" : "disabled"}>${env.ico("sparkle")}<b>Team technique</b><i>${canTeam ? "The gauge is full: all together!" : "Fills as your team lands blows together"}</i></button>
          <button class="cg-mi" data-f data-quit>${env.ico("door")}<b>Give up</b><i>End the duel here</i></button>
        </div>`), () => resume(), "cg-small");
      el.querySelectorAll("[data-cheer]").forEach(b => b.onclick = () => { const f = B.fighters.find(x => x.id === b.dataset.cheer); f.cheer = 6; f.c.bond = clamp(f.c.bond + 0.5, 0, 100); pop(f, "Go!", 0xf07ab0); resume(); });
      el.querySelector("[data-call]").onclick = () => callMenu();
      const sw = el.querySelector("[data-swap]"); if (sw) sw.onclick = () => { for (const f of mine) f.row = f.row === "front" ? "back" : "front"; if (!mine.some(f => f.row === "front")) mine[0].row = "front"; B.say("Your team swaps places."); resume(); };
      el.querySelector("[data-team]").onclick = () => { if (teamTech(0)) resume(); };
      el.querySelector("[data-quit]").onclick = () => { env.menuClose(); finish(1, true); };
    }
    function callMenu() {
      const mine = B.fighters.filter(f => !f.side && f.alive);
      const el = env.menuOpen(env.sec("Call a technique", "star", `<div class="cg-mm">${mine.map(f => f.c.techs.map(id => D.tech(id)).filter(t => t && t.kind !== "team").map((t, i) => `<button class="cg-mi" data-f ${i === 0 && f === mine[0] ? "data-focus" : ""} data-who="${f.id}" data-t="${t.id}" ${(t.cost || 0) > f.en ? "disabled" : ""}>${env.ico(t.kind === "guard" ? "cross" : t.kind === "support" ? "heart" : t.kind === "special" ? "sparkle" : "bolt")}<b>${env.esc(f.c.name)}: ${env.esc(t.name)}</b><i>${env.esc(t.text)}${t.cost ? ` -- ${t.cost} Chaos` : ""}</i></button>`).join("")).join("")}</div>`), () => command(), "cg-small");
      el.querySelectorAll("[data-t]").forEach(b => b.onclick = () => { const f = B.fighters.find(x => x.id === b.dataset.who); f.call = b.dataset.t; f.gap = Math.min(f.gap, 0.2); pop(f, "Right!", 0xffd21a); resume(); });
    }
    function resume() { env.menuClose(); B.paused = false; }

    /* the other side's keeper calls too: a team technique when it can */
    function foeKeeper(dt) {
      B.foeT = (B.foeT || rnd(4, 8)) - dt;
      if (B.foeT <= 0) { B.foeT = rnd(5, 9); if (!teamTech(1)) { const f = B.fighters.filter(x => x.side && x.alive)[0]; if (f) f.cheer = 4; } }
    }
    function finish(winner, quit) {
      if (B.over) return;
      B.over = { winner, quit, t: 0 };
      B.say(winner === 0 ? "Your team wins!" : quit ? "You gave up the duel." : "Your team is beaten.");
      const ban = document.createElement("div"); ban.className = "cg-bend " + (winner === 0 ? "win" : "lose"); ban.innerHTML = `<b>${winner === 0 ? "Victory!" : quit ? "Given up" : "Defeat"}</b>`;
      hud.append(ban);
      env.jingle && env.jingle(winner === 0 ? "born-change" : "farewell");
      setTimeout(() => end(), 2600);
    }
    function end() {
      for (const f of B.fighters) scene.remove(f.rig.g);
      hud.remove();
      const res = { winner: B.over.winner, quit: B.over.quit, fighters: B.fighters.map(f => ({ c: f.c, side: f.side, alive: f.alive, dealt: f.dealt, taken: f.taken, used: Object.keys(f.used) })) };
      done && done(res);
    }

    /* ---------------------------------------------------------------- the frame */
    B.frame = (dt) => {
      const b = env.el.getBoundingClientRect(); if (B.w !== b.width || B.h !== b.height) { B.w = b.width; B.h = b.height; R.setSize(B.w, B.h, false); cam.aspect = B.w / B.h; cam.updateProjectionMatrix(); }
      if (!B.paused && !env.isMenu()) {
        let k = dt; if (B.slow > 0) { B.slow -= dt; k = dt * 0.35; }
        B.t += k;
        if (B.introT > 0) { B.introT -= dt; hud.querySelector(".cg-bintro").style.opacity = clamp(B.introT, 0, 1); }
        else {
          for (const f of B.fighters) tickF(f, k);
          shotsTick(k); foeKeeper(k);
          if (!B.over) { const a = B.fighters.some(f => !f.side && f.alive), z = B.fighters.some(f => f.side && f.alive); if (!a || !z) finish(a ? 0 : 1); }
        }
        fxTick(k);
      }
      camTick(dt); floatsTick(dt); hudTick();
      R.render(scene, cam);
    };
    B.key = (code) => { if (B.over) return true; if (code === "KeyZ" || code === "Enter" || code === "Space") { command(); return true; } return false; };
    B.dispose = () => { scene.traverse(o => { if (o.geometry && o.geometry.dispose && !o.geometry.parameters) {} }); };
    return B;
  }

  root.ChaoBattle = { ok: true, start, STYLE };
})(typeof globalThis !== "undefined" ? globalThis : this);
