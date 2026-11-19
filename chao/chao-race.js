/* Red Ring Circuit -- the Chao Garden's races.
   Eight Chao on a voxel course: running (Velocity), swimming (Resilience and Vitality),
   climbing a wall (Power), gliding off it (Agility), a hedge of doors to read (Instinct) and
   Chaos pads to charge on (Chaos); stamina (Vitality) for the long run. The race runs itself;
   the keeper's part is the cheering -- three cheers a race, best spent when yours stops to
   watch a butterfly, or nods off, or waves at the crowd.

   ChaoRace.start(env, { c, course, cls, rivals }, done) -> a session with frame(dt), key(code).
   ChaoRace.rivals(L, D, cls, course, n) -> n rival Chao grown to the class. */
(function (root) {
  "use strict";
  const THREE = root.THREE;
  if (!THREE) { root.ChaoRace = { ok: false }; return; }
  const PI = Math.PI, TAU = PI * 2;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t, rnd = (a, b) => a + Math.random() * (b - a);

  /* the courses: [kind, length in metres]; a climb is 2.5 m up a wall, a glide 2.5 m down */
  const COURSES = [
    { id: "daisy", name: "Daisy Run", focus: null, text: "A first race: a little of everything.",
      segs: [["run", 24], ["swim", 12], ["run", 14], ["climb"], ["run", 10], ["glide"], ["run", 14], ["riddle"], ["run", 18]] },
    { id: "ripple", name: "Ripple Race", focus: "res", text: "Long swims, and a little running between.",
      segs: [["run", 12], ["swim", 22], ["run", 8], ["swim", 18], ["run", 10], ["swim", 22], ["run", 14]] },
    { id: "dash", name: "Dash Race", focus: "vel", text: "Long straights: the quickest legs win.",
      segs: [["run", 40], ["riddle"], ["run", 34], ["pad"], ["run", 44]] },
    { id: "cliff", name: "Cliffside Race", focus: "pow", text: "Wall after wall to climb, and the long glide down.",
      segs: [["run", 10], ["climb"], ["run", 8], ["climb"], ["run", 8], ["climb"], ["run", 10], ["glide"], ["glide"], ["glide"], ["run", 14]] },
    { id: "breeze", name: "Breeze Race", focus: "agi", text: "Up, and off into the air: the gliders' course.",
      segs: [["run", 10], ["climb"], ["glide"], ["run", 8], ["climb"], ["climb"], ["glide"], ["glide"], ["run", 10], ["climb"], ["glide"], ["run", 14]] },
    { id: "hedge", name: "Hedge Race", focus: "ins", text: "Door after door: the one that opens is the one to read.",
      segs: [["run", 12], ["riddle"], ["run", 10], ["riddle"], ["run", 10], ["riddle"], ["swim", 10], ["riddle"], ["run", 14]] },
    { id: "spark", name: "Spark Race", focus: "cha", text: "Chaos pads to charge on, and fling yourself from.",
      segs: [["run", 10], ["pad"], ["run", 8], ["pad"], ["swim", 10], ["pad"], ["run", 8], ["pad"], ["run", 14]] },
    { id: "grand", name: "Grand Race", focus: null, text: "The long one, with everything in it. The garden's own champion's course.",
      segs: [["run", 20], ["swim", 14], ["run", 8], ["climb"], ["run", 6], ["climb"], ["glide"], ["run", 10], ["riddle"], ["run", 10], ["pad"], ["swim", 12], ["run", 8], ["climb"], ["glide"], ["glide"], ["run", 10], ["riddle"], ["run", 20]] },
  ];
  const CLASSES = [
    { id: "bronze", name: "Bronze", lv: 3, prize: 120, music: "race-1" },
    { id: "silver", name: "Silver", lv: 12, prize: 260, music: "race-2" },
    { id: "gold", name: "Gold", lv: 28, prize: 420, music: "race-3" },
  ];
  const LEN = { climb: 3, glide: 10, riddle: 8, pad: 8 };
  const UP = 2.5;
  /* what each part of a course trains, a little, for every metre of it run */
  const USES = { run: { vel: 0.5 }, swim: { res: 0.5, vit: 0.35 }, climb: { pow: 6 }, glide: { agi: 6 }, riddle: { ins: 5 }, pad: { cha: 5 } };

  /* lay a course out: each part's start and end along the race (s), along the ground (z), and up (y) */
  function layout(course) {
    const out = []; let s = 0, z = 0, y = 0;
    for (const [k, l0] of course.segs) {
      const len = l0 || LEN[k];
      const g = { k, len, s0: s, s1: s + len, z0: z, y0: y };
      if (k === "climb") { g.z1 = z - 0.5; g.y1 = y + UP; }
      else if (k === "glide") { g.z1 = z - len; g.y1 = Math.max(0, y - UP); }
      else { g.z1 = z - len; g.y1 = y; }
      out.push(g); s = g.s1; z = g.z1; y = g.y1;
    }
    return { segs: out, total: s, endZ: z, endY: y };
  }
  function at(C, s) {
    const g = C.segs.find(x => s < x.s1) || C.segs[C.segs.length - 1], k = clamp((s - g.s0) / g.len, 0, 1);
    if (g.k === "climb") { const up = Math.min(1, k / 0.85); return { g, k, z: g.z0 + 0.2 - (k > 0.85 ? (k - 0.85) / 0.15 * 0.7 : 0), y: g.y0 + UP * up }; }
    if (g.k === "glide") return { g, k, z: lerp(g.z0, g.z1, k), y: g.y0 + Math.sin(Math.min(1, k * 3) * PI) * 0.35 * (1 - k) - (g.y0 - g.y1) * Math.pow(k, 1.5) };
    if (g.k === "swim") { const e = Math.min(k * g.len, (1 - k) * g.len); return { g, k, z: lerp(g.z0, g.z1, k), y: g.y0 - 0.45 * clamp(e / 0.8, 0, 1) }; }
    return { g, k, z: lerp(g.z0, g.z1, k), y: g.y0 };
  }

  /* rivals grown to the class: a first-changed Chao of any kind, its attributes about the class's level */
  function rivals(L, D, cls, course, n, taken) {
    const pool = D.CHAO.filter(s => s.stage === 1 && s.rarity <= 2);
    const out = [], names = new Set(taken || []);
    for (let i = 0; i < n; i++) {
      const sp = pool[Math.floor(Math.random() * pool.length)];
      let nm, tries = 0; do nm = L.NAMES[Math.floor(Math.random() * L.NAMES.length)]; while (names.has(nm) && tries++ < 200); names.add(nm);
      const c = L.make(sp.id, { name: nm });
      for (const a of D.ATTRS) {
        const want = Math.max(1, Math.round(cls.lv * rnd(0.75, 1.2) + (course.focus === a.id ? cls.lv * 0.2 : 0)));
        let guard = 0; while (c.lv[a.id] < want && guard++ < 200) L.train(c, a.id, 100);
      }
      c.bond = 60; out.push(c);
    }
    return out;
  }

  function start(env, setup, done) {
    const { R, M, L, D } = env, C = layout(setup.course), CO = setup.course, CL = setup.cls;
    const B = { env, setup, t: 0, phase: "intro", paused: false, fx: [], floats: [], cheers: 3, view: "mine", log: [], w: 0, h: 0, ended: false };

    /* -- the scene */
    const scene = B.scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8ac8f0); scene.fog = new THREE.Fog(0x8ac8f0, 34, 90);
    scene.add(new THREE.HemisphereLight(0xe8f4ff, 0x6a8a4a, 0.6));
    const sun = new THREE.DirectionalLight(0xfff0d8, 0.8); sun.position.set(8, 16, 8); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 50 }); scene.add(sun); scene.add(sun.target);
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    const cam = B.cam = new THREE.PerspectiveCamera(46, 1, 0.1, 220);
    const add = (o, x, y, z, ry) => { o.position.set(x || 0, y || 0, z || 0); if (ry) o.rotation.y = ry; o.traverse(m => { if (m.isMesh && !(m.material && m.material.transparent)) { m.castShadow = true; m.receiveShadow = true; } }); o.matrixAutoUpdate = false; o.updateMatrix(); scene.add(o); return o; };

    /* -- the course */
    const G4 = 1 / 4;
    const grass = (x, y, z) => M.grain(M.mixC(0x5aa83a, 0x7ac455, M.hash(x >> 1, 0, z >> 1)), x, y, z, 0.06);
    const dirt = (x, y, z) => M.grain(0x7a5a3a, x, y, z, 0.06);
    const stone = (x, y, z) => M.grain(((y + (M.hash(x >> 1, 0, z >> 1) * 3 | 0)) % 4 === 0) ? 0x7a7468 : 0x9a9484, x, y, z, 0.06);
    const track = (x, y, z) => (x + 16) % 4 === 0 && Math.abs(x) <= 16 ? 0xf4f0e4 : M.grain(M.mixC(0xd8b070, 0xc8a060, M.hash(x >> 1, 0, z >> 1) * 0.6), x, y, z, 0.05);
    const water = (x, y, z) => M.grain(((x + (z >> 2)) & 3) === 0 ? 0x5ac0f0 : 0x3aa0e0, x, y, z, 0.04);
    function segPart(g) {
      const deep = Math.round((g.k === "glide" ? g.y1 : g.y0) * 4) + 4, n = Math.round(g.len * 4);
      return M.part(`rc:${g.k}:${g.len}:${deep}`, G4, (v, gl) => {
        const side = (x, y, z) => y === -1 ? (Math.abs(x) === 17 ? M.grain(0x8a8a92, x, y, z, 0.05) : null) : stone(x, y, z);
        if (g.k === "swim") {
          M.blk(v, -17, -deep, -n, 17, -1, -1, (x, y, z) => {
            const edge = z >= -2 || z <= -n + 1;
            if (Math.abs(x) === 17 || edge) return y === -1 ? M.grain(0xe8e4d8, x, y, z, 0.03) : stone(x, y, z);
            if (y >= -1) return null;
            if (y === -2) return water(x, y, z);
            return y > -6 ? M.grain(0x2a80c0, x, y, z, 0.04) : stone(x, y, z);
          });
          return;
        }
        if (g.k === "glide") {
          /* (placed at the lower level: a pond under the glide) */
          M.blk(v, -17, -deep, -n, 17, -1, -1, (x, y, z) => Math.abs(x) === 17 ? (y === -1 ? M.grain(0x8a8a92, x, y, z, 0.05) : stone(x, y, z)) : y >= -1 ? null : y === -2 ? water(x, y, z) : y > -6 ? M.grain(0x2a80c0, x, y, z, 0.04) : stone(x, y, z));
          for (let i = 0; i < 6; i++) gl.set(-12 + i * 5, -2, -6 - (i * 7) % (n - 10), 0xb8f0ff);
          return;
        }
        if (g.k === "climb") {
          /* a rock face, with holds, in front of the next part's wall */
          M.blk(v, -17, 0, -2, 17, 9, -1, (x, y, z) => z === -1 && (M.hash(x, y, 9) < 0.12) ? [0xe42630, 0xffd21a, 0x1f58e0, 0x2fb844][(x + y) & 3] : stone(x, y, z));
          M.blk(v, -17, -deep, -2, 17, -1, -1, (x, y, z) => y === -1 ? track(x, y, z) : dirt(x, y, z));
          return;
        }
        M.blk(v, -17, -deep, -n, 17, -1, -1, (x, y, z) => y === -1 ? (Math.abs(x) === 17 ? M.grain(0x8a8a92, x, y, z, 0.05) : track(x, y, z)) : y > -5 ? dirt(x, y, z) : stone(x, y, z));
        if (g.k === "riddle") {
          /* a hedge across the course: a doorway for each lane, flowers over them */
          M.blk(v, -17, 0, -17, 17, 5, -15, (x, y, z) => { const m = (x + 16) % 4; if ((m === 1 || m === 2) && y < 5 && Math.abs(x) < 17) return null; return y === 5 && (m === 1 || m === 2) ? [0xf87aa0, 0xf8f070, 0xb08af0][((x + 16) >> 2) % 3] : M.grain(M.mixC(0x2f7a2e, 0x4a9a3a, M.hash(x, y, z)), x, y, z, 0.08); });
        }
        if (g.k === "pad") for (let i = 0; i < 8; i++) for (const x of [-15 + i * 4, -14 + i * 4]) for (const z of [-7, -6]) gl.set(x, -1, z, 0x40e8f0);
      });
    }
    for (const g of C.segs) add(segPart(g), 0, g.k === "glide" ? g.y1 : g.y0, g.z0);
    /* the ground either side, hills, trees, the start and the finish */
    /* (a part is a new group each call, its geometry shared: one object can't stand in two places) */
    const base = () => M.part("rc-base", G4, v => { for (const s of [-1, 1]) M.blk(v, s < 0 ? -60 : 18, -4, -79, s < 0 ? -18 : 59, -1, 0, (x, y, z) => y === -1 ? grass(x, y, z) : dirt(x, y, z)); });
    const hills = () => M.part("rc-hills", 1 / 2, v => { for (let i = 0; i < 4; i++) for (const s of [-1, 1]) M.ell(v, s * (30 + (i % 2) * 4), -2, -i * 10 - 5, 7 + (i % 3), 5 + (i % 2) * 3, 7, (x, y, z) => M.grain(M.mixC(0x4a9a3a, 0x6ab84a, M.hash(x >> 1, y >> 1, z >> 1)), x, y, z, 0.08)); });
    for (let z = 20; z > C.endZ - 30; z -= 20) { add(base(), 0, 0, z); add(hills(), 0, 0, z); }
    for (let i = 0, z = 6; z > C.endZ - 10; i++, z -= 9) for (const s of [-1, 1]) if ((i + (s > 0)) % 2 === 0) add(M.prop("tree", { k: i % 3 ? "oak" : "fruit", s: 1, seed: i * 2 + (s > 0) }), s * rnd(6.5, 9), 0, z);
    const arch = (key, cols) => M.part("rc-arch:" + key, 1 / 6, v => {
      for (const x of [-34, 33]) M.blk(v, x, 0, -1, x + 1, 22, 0, (xx, y, zz) => M.grain(0xf0f0e8, xx, y, zz, 0.03));
      M.blk(v, -34, 18, -1, 34, 22, 0, (x, y) => ((x >> 1) + (y >> 1)) & 1 ? cols[0] : cols[1]);
    });
    add(arch("start", [0xe42630, 0xf8f8f8]), 0, 0, -0.7);
    add(arch("finish", [0x1a1a22, 0xf8f8f8]), 0, C.endY, C.endZ + 0.2);

    /* -- the racers: yours in the middle lanes */
    const field = [setup.c, ...setup.rivals].slice(0, 8);
    const order = [3, 4, 2, 5, 1, 6, 0, 7];
    const q = (c, a) => 1 - Math.exp(-L.stat(c, a) / 250);
    const racers = field.map((c, i) => {
      const rig = M.creature(c); rig.g.traverse(o => { if (o.isMesh && !o.material.transparent) o.castShadow = true; });
      scene.add(rig.g); rig.g.rotation.y = PI;
      const lane = order[i];
      const r = { c, rig, mine: i === 0, lane, x: -3.5 + lane, s: 0, v: 0, st: 100, wait: 0, why: null, distract: 0, dk: null, cheerT: 0, fin: null, ph: Math.random() * 10, seen: {}, rid: {}, hop: 0 };
      r.Q = {}; for (const a of D.ATTRS) r.Q[a.id] = q(c, a.id);
      r.fickle = 0.03 * (c.genes.temper.includes("lazy") ? 1.7 : c.genes.temper.includes("curious") ? 1.4 : c.genes.temper.includes("focused") || c.genes.temper.includes("competitive") ? 0.6 : 1) * (1 - (c.bond || 0) / 220);
      return r;
    });
    const me = racers[0];

    /* -- the HUD */
    const hud = B.hud = document.createElement("div"); hud.className = "cg-thud cg-rhud";
    hud.innerHTML = `
      <div class="cg-tcard"><span class="cg-tattr" style="background:${["#c8823a", "#c8ccd8", "#ffd21a"][CLASSES.indexOf(CL)]}">${env.esc(CL.name)}</span><b>${env.esc(CO.name)}</b><i>${env.esc(me.c.name)}</i></div>
      <div class="cg-rprog"><span></span>${racers.map((r, i) => `<i class="${r.mine ? "me" : ""}" data-r="${i}"></i>`).join("")}</div>
      <div class="cg-rlist"></div>
      <div class="cg-rlog"></div>
      <div class="cg-tkeys"><button class="cg-tk" data-k="KeyZ"><b>Z</b><i>Cheer</i><em class="cg-rcheer">3</em></button><button class="cg-tk ghost" data-k="U"><b>${arrowSvg("U")}</b><i>Camera</i></button><button class="cg-tk ghost" data-k="Enter"><b>Enter</b><i>Pause</i></button></div>
      <div class="cg-tfloat"></div>
      <div class="cg-tover"></div>`;
    env.el.append(hud);
    const $ = s => hud.querySelector(s);
    hud.addEventListener("pointerdown", ev => { const b = ev.target.closest && ev.target.closest("[data-k]"); if (b) { ev.preventDefault(); B.key(b.dataset.k); } });
    const over = $(".cg-tover"), card = html => { over.innerHTML = html; over.style.display = html ? "" : "none"; };
    const prize = CL.prize;
    card(`<div class="cg-tintro"><div class="cg-tintro-hd"><span class="cg-tattr" style="background:#ffd21a">${env.esc(CL.name)}</span><b>${env.esc(CO.name)}</b></div>
      <p>${env.esc(CO.text)} ${env.esc(me.c.name)} against seven. ${prize} rings to the winner.</p>
      <p class="cg-rhow">The race runs itself. Z to cheer: three a race, best spent when ${env.esc(me.c.name)} stops to look at something. Up to look at the leader.</p>
      <div class="cg-tintro-go"><button class="cg-tk" data-k="KeyZ"><b>Z</b><i>Start</i></button><button class="cg-tk ghost" data-k="KeyX"><b>X</b><i>Back</i></button></div></div>`);
    env.music && env.music("race-entry");
    const say = t => { B.log.push(t); $(".cg-rlog").innerHTML = B.log.slice(-3).map((x, i, a) => `<div class="${i < a.length - 1 ? "old" : ""}">${env.esc(x)}</div>`).join(""); };

    /* -- effects */
    const boxG = new THREE.BoxGeometry(0.08, 0.08, 0.08), V = new THREE.Vector3();
    function burst(x, y, z, cols, n, sp) { sp = sp || 1; for (let i = 0; i < n; i++) { const m = new THREE.Mesh(boxG, new THREE.MeshBasicMaterial({ color: cols[i % cols.length] })); m.position.set(x, y, z); scene.add(m); B.fx.push({ m, v: [rnd(-2, 2) * sp, rnd(1.5, 3.5) * sp, rnd(-2, 2) * sp], life: rnd(0.4, 0.7) }); } }
    function pop(r, text, color, big) { const el = document.createElement("div"); el.className = "cg-float" + (big ? " big" : ""); el.textContent = text; el.style.color = "#" + (color || 0xffd21a).toString(16).padStart(6, "0"); $(".cg-tfloat").append(el); B.floats.push({ el, r, y: (r.rig.h || 0.6) + 0.3, t: 0, life: 1.1 }); }
    function fxTick(dt) {
      for (const p of B.fx.slice()) { p.life -= dt; p.v[1] -= 10 * dt; p.m.position.x += p.v[0] * dt; p.m.position.y += p.v[1] * dt; p.m.position.z += p.v[2] * dt; p.m.scale.setScalar(Math.max(0.01, p.life * 1.6)); if (p.life <= 0) { scene.remove(p.m); p.m.material.dispose(); B.fx.splice(B.fx.indexOf(p), 1); } }
      for (const p of B.floats.slice()) {
        p.t += dt; p.life -= dt; const g = p.r.rig.g.position;
        V.set(g.x, g.y + p.y + p.t * 0.5, g.z).project(cam);
        p.el.style.transform = `translate(${((V.x + 1) / 2 * B.w).toFixed(0)}px,${((1 - V.y) / 2 * B.h).toFixed(0)}px) translate(-50%,-100%)`;
        p.el.style.opacity = V.z < 1 ? clamp(p.life * 2, 0, 1) : 0;
        if (p.life <= 0) { p.el.remove(); B.floats.splice(B.floats.indexOf(p), 1); }
      }
    }
    const sfx = n => env.sfx && env.sfx(n);

    /* ================================================================ the race */
    const DISTRACT = [["sit", "has sat down to watch a butterfly", "heart"], ["sleep", "has nodded off", "swirl"], ["dance", "is waving at the crowd", "heart"], ["sit", "is looking at the flowers", "ball"]];
    function speedOf(r, g) {
      const Q = r.Q;
      let v = g.k === "swim" ? 0.9 + 2.6 * (0.6 * Q.res + 0.4 * Q.vit) : g.k === "climb" ? 0.5 + 1.6 * Q.pow : g.k === "glide" ? 2.3 + 3.6 * Q.agi : 2.0 + 4.4 * Q.vel;
      if (r.st < 20) v *= 0.72;
      if (r.cheerT > 0) v *= 1.15;
      return v * (0.95 + 0.07 * Math.sin(B.t * 0.8 + r.ph) + 0.03 * Math.sin(B.t * 2.3 + r.ph * 2));
    }
    function tick(r, dt) {
      r.cheerT -= dt;
      if (r.fin != null) { r.v = Math.max(0, r.v - dt * 3); r.s += r.v * dt; return; }
      const P = at(C, r.s), g = P.g;
      if (r.wait > 0) { r.wait -= dt; if (r.why === "pad") r.st = Math.min(100, r.st + dt * 6); if (r.wait <= 0 && r.why === "pad") { r.hop = 1; sfx("spring"); burst(r.x, P.y + 0.2, P.z, [0x40e8f0, 0xffffff], 8, 0.7); } return; }
      if (r.distract > 0) { r.distract -= dt; r.st = Math.min(100, r.st + dt * 4); if (r.distract <= 0) r.dk = null; return; }
      /* a distraction: only on the flat, never in the water or on a wall */
      if ((g.k === "run" || g.k === "riddle") && r.s > 6 && !r.hop && Math.random() < r.fickle * dt) {
        const d = DISTRACT[Math.floor(Math.random() * DISTRACT.length)];
        r.distract = rnd(1.8, 3.2); r.dk = d;
        if (r.mine) { say(`${r.c.name} ${d[1]}! Z to cheer it on.`); pop(r, "!", 0xff8a10, true); sfx("warn"); }
        return;
      }
      /* the doors: one opens for each; read it right, or bump the wrong one and go round */
      if (g.k === "riddle" && !r.rid[g.s0] && r.s >= g.s0 + 3.3) {
        r.rid[g.s0] = 1;
        if (Math.random() > 0.3 + 0.65 * r.Q.ins) { r.wait = 2.4; r.why = "door"; if (r.mine) { say(`${r.c.name} tried the wrong door!`); sfx("stumble"); } }
        else if (r.mine) pop(r, "This way!", 0xffd21a);
        return;
      }
      /* the pads: stop, charge with Chaos, and fling */
      if (g.k === "pad" && !r.rid[g.s0] && r.s >= g.s0 + 1.5) { r.rid[g.s0] = 1; r.wait = 3.0 - 2.4 * r.Q.cha; r.why = "pad"; return; }
      let v = speedOf(r, g);
      if (r.hop > 0) { v = 7.5; r.hop = Math.max(0, r.hop - dt / 0.8); }
      r.v = lerp(r.v, v, Math.min(1, dt * 3));
      r.s += r.v * dt;
      const cost = { run: 1.3, riddle: 1.3, swim: 2.2, climb: 2.6, glide: 0.3, pad: 0.4 }[g.k] || 1;
      r.st = Math.max(0, r.st - cost * dt * (1.3 - r.Q.vit));
      if (r.st < 20 && !r.tired) { r.tired = true; if (r.mine) say(`${r.c.name} is tiring...`); }
      if (r.s >= C.total) { r.fin = B.t; r.s = C.total; r.place = racers.filter(x => x.fin != null).length; finishOne(r); }
    }
    function finishOne(r) {
      if (r.place === 1) { say(`${r.c.name} wins the ${CO.name}!`); sfx("goal"); burst(r.x, C.endY + 1, C.endZ, [0xffd21a, 0xe42630, 0x1f58e0, 0xffffff], 30, 1.2); }
      if (r.mine) { if (r.place > 1) say(`${r.c.name} finishes ${ord(r.place)}.`); pop(r, ord(r.place) + "!", r.place === 1 ? 0xffd21a : 0xffffff, true); B.myFin = B.t; }
    }
    const ord = n => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");
    function place(r, dt) {
      const P = at(C, Math.min(r.s, C.total)), g = P.g;
      let y = P.y, z = P.z;
      if (r.hop > 0) y += Math.sin((1 - r.hop) * PI) * 1.2;
      r.rig.g.position.set(r.x, y, z);
      const st = r.fin != null ? (r.place <= 3 ? "happy" : "idle") : r.distract > 0 ? r.dk[0] : r.wait > 0 ? (r.why === "door" ? "sad" : "idle") : g.k === "swim" && P.y < g.y0 - 0.2 ? "swim" : g.k === "climb" && P.k < 0.85 ? "train" : g.k === "glide" ? "fly" : "run";
      r.rig.anim(B.t, dt, st, r.v / 3);
      r.rig.face = r.distract > 0 && r.dk[0] === "sleep" ? "shut" : null;
      const em = r.distract > 0 ? r.dk[2] : r.wait > 0 ? (r.why === "door" ? "swirl" : "exclaim") : r.cheerT > 0 ? "heart" : r.fin != null && r.place === 1 ? "heart" : "ball";
      if (r.rig.ball && em !== r.em) { r.em = em; M.emote(r.rig, em); }
      if (r.wait > 0 && r.why === "pad" && Math.random() < dt * 8) burst(r.x + rnd(-0.2, 0.2), y + 0.1, z, [0x40e8f0], 1, 0.3);
    }

    /* the camera: alongside yours (or the leader), a little ahead */
    function camTick(dt) {
      const lead = racers.slice().sort((a, b) => b.s - a.s)[0], f = B.view === "lead" ? lead : me;
      const p = f.rig.g.position, k = cam.aspect < 1.1 ? 1.5 : 1;
      cam.position.lerp(V.set(8.5 * k, p.y + 4.2 * k, p.z + 2.6), Math.min(1, dt * 3));
      cam.lookAt(0, p.y + 0.4, p.z - 2.4);
      sun.position.set(8, p.y + 16, p.z + 8); sun.target.position.set(0, p.y, p.z); sun.target.updateMatrixWorld();
    }
    function hudTick() {
      const ranked = racers.slice().sort((a, b) => (a.fin != null) !== (b.fin != null) ? (a.fin != null ? -1 : 1) : a.fin != null ? a.place - b.place : b.s - a.s);
      const html = ranked.map((r, i) => `<div class="${r.mine ? "me" : ""}"><b>${i + 1}</b><span>${env.esc(r.c.name)}</span>${r.fin != null ? "<em>Finished</em>" : r.distract > 0 ? "<em>Stopped</em>" : r.tired ? "<em>Tired</em>" : ""}</div>`).join("");
      if (html !== B.lastList) { B.lastList = html; $(".cg-rlist").innerHTML = html; }
      racers.forEach((r, i) => { $(`[data-r="${i}"]`).style.left = (Math.min(1, r.s / C.total) * 100).toFixed(1) + "%"; });
      $(".cg-rcheer").textContent = B.cheers;
      const lead = ranked[0];
      if (lead !== B.leader && B.phase === "race" && lead.fin == null && B.t > 2 && B.t - (B.leadT || 0) > 4) { B.leader = lead; B.leadT = B.t; say(`${lead.c.name} takes the lead!`); }
    }

    /* ================================================================ the flow */
    let count = 0, shown = null, goT = 0;
    function results() {
      B.phase = "results";
      env.music && env.music("race-end");
      const ranked = racers.slice().sort((a, b) => (a.fin != null) !== (b.fin != null) ? (a.fin != null ? -1 : 1) : a.fin != null ? a.place - b.place : b.s - a.s);
      ranked.forEach((r, i) => { r.final = i + 1; });
      card(`<div class="cg-tintro"><div class="cg-tintro-hd"><b>Results</b></div>
        <ol class="cg-rres">${ranked.map(r => `<li class="${r.mine ? "me" : ""}"><b>${ord(r.final)}</b><span>${env.esc(r.c.name)}</span><i>${env.esc(D.species(r.c.sp).name)}</i><em>${r.fin != null ? r.fin.toFixed(1) + " s" : "--"}</em></li>`).join("")}</ol>
        <div class="cg-tintro-go"><button class="cg-tk" data-k="KeyZ"><b>Z</b><i>Go on</i></button></div></div>`);
    }
    function finish() {
      if (B.ended) return; B.ended = true;
      const res = { quit: false, place: me.final, time: me.fin, course: CO, cls: CL, uses: C.segs.map(g => [g.k, g.len]), cheered: 3 - B.cheers };
      teardown(); done && done(res);
    }
    function quit() { if (B.ended) return; B.ended = true; teardown(); done && done({ quit: true, course: CO, cls: CL }); }
    function teardown() { hud.remove(); for (const p of B.fx) { scene.remove(p.m); p.m.material.dispose(); } B.fx = []; }
    function pause(on) {
      B.paused = on;
      card(on ? `<div class="cg-tintro small"><div class="cg-tintro-hd"><b>Paused</b></div><div class="cg-tintro-go"><button class="cg-tk" data-k="Enter"><b>Enter</b><i>Go on</i></button><button class="cg-tk ghost" data-k="KeyX"><b>X</b><i>Leave the race</i></button></div></div>` : "");
    }
    function cheer() {
      if (B.cheers <= 0 || me.fin != null) { sfx("stumble"); return; }
      B.cheers--; sfx("check");
      if (me.distract > 0) { me.distract = 0; me.dk = null; me.cheerT = 3; say(`${me.c.name} hears you, and is off again!`); pop(me, "Go!", 0xf07ab0, true); }
      else { me.cheerT = 2; pop(me, "Go!", 0xf07ab0); }
      me.c.bond = clamp((me.c.bond || 0) + 0.5, 0, 100);
    }
    B.key = (k) => {
      if (B.ended) return true;
      const code = { ArrowLeft: "L", ArrowRight: "R", ArrowUp: "U", ArrowDown: "D", KeyA: "L", KeyD: "R", KeyW: "U", KeyS: "D", Space: "KeyZ" }[k] || k;
      if (B.phase === "intro") { if (code === "KeyZ" || code === "Enter") { B.phase = "count"; count = 3; shown = null; card(""); env.music && env.music(CL.music); } else if (code === "KeyX" || code === "Escape") quit(); return true; }
      if (B.phase === "results") { if (code === "KeyZ" || code === "Enter") finish(); return true; }
      if (B.paused) { if (code === "Enter" || code === "KeyZ") pause(false); else if (code === "KeyX" || code === "Escape") quit(); return true; }
      if (code === "Enter" || code === "Escape" || code === "KeyX") { pause(true); return true; }
      if (code === "U" || code === "D") { B.view = B.view === "mine" ? "lead" : "mine"; return true; }
      if (code === "KeyZ" && B.phase === "race") cheer();
      return true;
    };
    B.frame = (dt) => {
      if (B.ended) return;
      const b = env.el.getBoundingClientRect(); if (B.w !== b.width || B.h !== b.height) { B.w = b.width; B.h = b.height; R.setSize(B.w, B.h, false); cam.aspect = B.w / B.h; cam.updateProjectionMatrix(); }
      dt = Math.min(dt, 0.05);
      if (!B.paused && !(env.isMenu && env.isMenu())) {
        if (B.phase === "count") {
          count -= dt; const n = Math.ceil(count);
          if (n !== shown) { shown = n; if (n > 0) { card(`<div class="cg-tcount">${n}</div>`); sfx("warn"); } }
          if (count <= 0) { B.phase = "race"; goT = 0.7; card(`<div class="cg-tcount go">Go!</div>`); sfx("star"); say("And they're off!"); }
        } else if (B.phase === "race") {
          if (goT > 0 && (goT -= dt) <= 0) card("");
          B.t += dt;
          for (const r of racers) tick(r, dt);
          if (racers.every(r => r.fin != null) || (B.myFin != null && B.t - B.myFin > 7) || B.t > 240) results();
        }
        for (const r of racers) place(r, dt);
        fxTick(dt);
      }
      camTick(B.phase === "intro" && !B.camSet ? (B.camSet = 1, 1) : dt);
      hudTick();
      R.render(scene, cam);
    };
    B.dbg = () => ({ racers, C });
    B.dispose = () => {};
    return B;
  }
  /* the arrow keys, drawn (the pixel font has no arrows) */
  function arrowSvg(d) {
    return `<svg class="cg-tarrow" viewBox="0 0 12 12" shape-rendering="crispEdges" style="transform:rotate(${{ U: 0, R: 90, D: 180, L: 270 }[d]}deg)" aria-hidden="true"><rect x="5" y="1" width="2" height="1"/><rect x="4" y="2" width="4" height="1"/><rect x="3" y="3" width="6" height="1"/><rect x="2" y="4" width="8" height="1"/><rect x="1" y="5" width="10" height="1"/><rect x="4" y="6" width="4" height="5"/></svg>`;
  }

  root.ChaoRace = { ok: true, start, rivals, COURSES, CLASSES, USES, layout };
})(typeof globalThis !== "undefined" ? globalThis : this);
