/* Red Ring Circuit -- the Chao Garden's training ground.
   Seven short games, one for each attribute, played with one of your creatures in a little voxel
   scene of their own (as a duel is): the creature does the running, jumping and smashing, the
   keeper does the timing. How well it goes is the keeper's doing; how forgiving it is, the
   creature's (a strong one gets a wider window, a longer jump, a slower show). The garden grows
   the attribute after, by how well it went.

   ChaoTrain.start(env, { c, game }, done) -> a session with frame(dt), key(code), dispose().
   Keys: Enter starts and pauses, Z does the thing, the arrows move, X backs out (when paused). */
(function (root) {
  "use strict";
  const THREE = root.THREE;
  if (!THREE) { root.ChaoTrain = { ok: false }; return; }
  const PI = Math.PI, TAU = PI * 2;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t, rnd = (a, b) => a + Math.random() * (b - a);

  const GAMES = [
    { id: "sprint", attr: "vel", also: "vit", name: "Dash Lane", unit: "m", time: 12, timed: true,
      how: "Left and Right in turn, as fast as you can. How far can it get in twelve seconds?", keys: [["L", ""], ["R", ""]], tip: "In turn to run" },
    { id: "hurdles", attr: "agi", also: "vel", name: "Hurdle Run", unit: "", time: 60,
      how: "It runs by itself. Z to jump the low hurdles, Down to duck under the high bars.", keys: [["KeyZ", "Z", "Jump"], ["D", "", "Duck"]] },
    { id: "boulder", attr: "pow", also: "res", name: "Rock Smash", unit: "", time: 20, timed: true,
      how: "Z when the marker crosses the gold. Break as many boulders as you can in twenty seconds.", keys: [["KeyZ", "Z", "Smash"]] },
    { id: "balls", attr: "res", also: "ins", name: "Ball Machine", unit: "", time: 60,
      how: "Balls fly in from three machines. Press the arrow key toward each one just as it arrives, to block it.", keys: [["L", ""], ["U", ""], ["R", ""]], tip: "Block" },
    { id: "swim", attr: "vit", also: "res", name: "Long Swim", unit: "m", time: 25, timed: true,
      how: "Z as the ring closes, to stroke on the beat. Strokes off the beat tire it out.", keys: [["KeyZ", "Z", "Stroke"]] },
    { id: "fruit", attr: "ins", also: "agi", name: "Fruit Catch", unit: "", time: 25, timed: true,
      how: "Watch the shadows to see where the fruit will land. Left and Right to catch it, and keep clear of the spiny nuts.", keys: [["L", ""], ["R", ""]], tip: "Move" },
    { id: "chaos", attr: "cha", also: "ins", name: "Drive Echo", unit: "", time: 75,
      how: "The Chaos Drives light up in turn. Play the tune back with the arrow keys; one more note each round.", keys: [["U", ""], ["L", ""], ["R", ""], ["D", ""]], tip: "Echo" },
  ];
  /* the arrow keys, drawn (the pixel font has no arrows): an up arrow, turned */
  const ARROW = `<rect x="5" y="1" width="2" height="1"/><rect x="4" y="2" width="4" height="1"/><rect x="3" y="3" width="6" height="1"/><rect x="2" y="4" width="8" height="1"/><rect x="1" y="5" width="10" height="1"/><rect x="4" y="6" width="4" height="5"/>`;
  const arrow = d => `<svg class="cg-tarrow" viewBox="0 0 12 12" shape-rendering="crispEdges" style="transform:rotate(${{ U: 0, R: 90, D: 180, L: 270 }[d]}deg)" aria-hidden="true">${ARROW}</svg>`;
  const GRADES = [[1, "S"], [0.8, "A"], [0.6, "B"], [0.35, "C"], [-1, "D"]];
  const grade = r => GRADES.find(([k]) => r >= k)[1];

  function start(env, setup, done) {
    const { R, M, L, D } = env, c = setup.c, GM = GAMES.find(g => g.id === setup.game);
    const A = D.ATTRS.find(a => a.id === GM.attr);
    const q = 1 - Math.exp(-L.stat(c, GM.attr) / 250);          // (how good it already is: 0 to 1)
    const B = { env, setup, t: 0, phase: "intro", paused: false, fx: [], floats: [], score: 0, left: GM.time, w: 0, h: 0, ratio: 0, ended: false };

    /* -- the scene */
    const scene = B.scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8ac8f0); scene.fog = new THREE.Fog(0x8ac8f0, 26, 70);
    scene.add(new THREE.HemisphereLight(0xe8f4ff, 0x6a8a4a, 0.6));
    const sun = new THREE.DirectionalLight(0xfff0d8, 0.8); sun.position.set(6, 14, 8); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 40 }); scene.add(sun); scene.add(sun.target);
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    const cam = B.cam = new THREE.PerspectiveCamera(46, 1, 0.1, 200);
    const add = (o, x, y, z, ry) => { o.position.set(x || 0, y || 0, z || 0); if (ry) o.rotation.y = ry; o.traverse(m => { if (m.isMesh && !(m.material && m.material.transparent)) { m.castShadow = true; m.receiveShadow = true; } }); scene.add(o); return o; };
    const rig = M.creature(c);
    rig.g.traverse(o => { if (o.isMesh && !o.material.transparent) o.castShadow = true; });
    if (rig.shadow) rig.shadow.visible = true;
    scene.add(rig.g);
    const H = rig.h || 0.6;                                     // (its height)

    /* -- the HUD */
    const hud = B.hud = document.createElement("div"); hud.className = "cg-thud";
    const col = n => "#" + n.toString(16).padStart(6, "0");
    hud.innerHTML = `
      <div class="cg-tcard"><span class="cg-tattr" style="background:${col(A.c)}">${env.esc(A.short)}</span><b>${env.esc(GM.name)}</b><i>${env.esc(c.name)}</i></div>
      <div class="cg-tscore"><b>0</b><i></i></div>
      <div class="cg-tmid"></div>
      <div class="cg-tkeys">${GM.keys.map(([k, lab, tip]) => `<button class="cg-tk" data-k="${k}"><b>${({ L: 1, R: 1, U: 1, D: 1 })[k] ? arrow(k) : env.esc(lab)}</b>${tip ? `<i>${env.esc(tip)}</i>` : ""}</button>`).join("")}${GM.tip ? `<span class="cg-tktip">${env.esc(GM.tip)}</span>` : ""}<button class="cg-tk ghost" data-k="Enter"><b>Enter</b><i>Pause</i></button></div>
      <div class="cg-tfloat"></div>
      <div class="cg-tover"></div>`;
    env.el.append(hud);
    const $ = s => hud.querySelector(s);
    hud.addEventListener("pointerdown", ev => { const b = ev.target.closest && ev.target.closest("[data-k]"); if (b) { ev.preventDefault(); B.key(b.dataset.k); } });
    const over = $(".cg-tover");
    const card = (html) => { over.innerHTML = html; over.style.display = html ? "" : "none"; };
    card(`<div class="cg-tintro"><div class="cg-tintro-hd"><span class="cg-tattr" style="background:${col(A.c)}">${env.esc(A.name)}</span><b>${env.esc(GM.name)}</b></div>
      <p>${env.esc(GM.how)}</p><div class="cg-tintro-go"><button class="cg-tk" data-k="KeyZ"><b>Z</b><i>Start</i></button><button class="cg-tk ghost" data-k="KeyX"><b>X</b><i>Back</i></button></div></div>`);
    env.music && env.music("classroom");

    /* -- effects */
    const boxG = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    function burst(x, y, z, cols, n, sp) {
      sp = sp || 1;
      for (let i = 0; i < n; i++) { const m = new THREE.Mesh(boxG, new THREE.MeshBasicMaterial({ color: cols[i % cols.length] })); m.position.set(x, y, z); scene.add(m); B.fx.push({ m, v: [rnd(-2.5, 2.5) * sp, rnd(1.5, 4) * sp, rnd(-2.5, 2.5) * sp], life: rnd(0.4, 0.75) }); }
    }
    const V = new THREE.Vector3();
    function pop(text, color, x, y, z, big) {
      const el = document.createElement("div"); el.className = "cg-float" + (big ? " big" : ""); el.textContent = text; el.style.color = col(color || 0xffd21a);
      $(".cg-tfloat").append(el); B.floats.push({ el, x, y, z, t: 0, life: 1 });
    }
    const popC = (text, color, big) => pop(text, color, rig.g.position.x, rig.g.position.y + H + 0.2, rig.g.position.z, big);
    function fxTick(dt) {
      for (const p of B.fx.slice()) { p.life -= dt; p.v[1] -= 10 * dt; p.m.position.x += p.v[0] * dt; p.m.position.y += p.v[1] * dt; p.m.position.z += p.v[2] * dt; p.m.scale.setScalar(Math.max(0.01, p.life * 1.6)); if (p.life <= 0) { scene.remove(p.m); p.m.material.dispose(); B.fx.splice(B.fx.indexOf(p), 1); } }
      for (const p of B.floats.slice()) {
        p.t += dt; p.life -= dt;
        V.set(p.x, p.y + p.t * 0.6, p.z).project(cam);
        p.el.style.transform = `translate(${((V.x + 1) / 2 * B.w).toFixed(0)}px,${((1 - V.y) / 2 * B.h).toFixed(0)}px) translate(-50%,-100%)`;
        p.el.style.opacity = clamp(p.life * 2, 0, 1);
        if (p.life <= 0) { p.el.remove(); B.floats.splice(B.floats.indexOf(p), 1); }
      }
    }
    const sfx = n => env.sfx && env.sfx(n), chirp = (f, d) => env.tone && env.tone(f, f, d || 0.18, "triangle", 0.07);

    /* -- the grounds: a lane of track (or pool), a round clearing, hills and trees round them */
    const grass = (x, y, z) => M.grain(M.mixC(0x5aa83a, 0x7ac455, M.hash(x >> 1, 0, z >> 1)), x, y, z, 0.06);
    const dirt = (x, y, z) => M.grain(0x7a5a3a, x, y, z, 0.06);
    function laneSeg(kind) {
      return M.part("tr-" + kind, 1 / 4, v => {
        M.blk(v, -40, -2, -79, 39, 0, 0, (x, y, z) => {
          const tr = x >= -6 && x <= 5;
          if (kind === "pool") {
            if (tr && y >= -1) return y === 0 ? null : (x === -6 || x === 5) && (z & 1) ? 0xf8f8f8 : (x === -6 || x === 5) ? 0xe42630 : M.grain(((x + (z >> 2)) & 3) === 0 ? 0x5ac0f0 : 0x3aa0e0, x, y, z, 0.04);
            if (x === -7 || x === 6 || x === -8 || x === 7) return y === 0 ? M.grain(0xf0f0e8, x, y, z, 0.03) : M.grain(0xd8d8d0, x, y, z, 0.03);
            if (tr) return M.grain(0x2a80c0, x, y, z, 0.04);
            return y === 0 ? grass(x, y, z) : dirt(x, y, z);
          }
          if (y < 0) return dirt(x, y, z);
          if (!tr) return grass(x, y, z);
          if (x === -6 || x === 5 || z === 0 || z === -40) return 0xf4f4ec;
          return M.grain(0xc8603a, x, y, z, 0.05);
        });
      });
    }
    const sideHills = () => M.part("tr-side", 1 / 2, v => {
      for (let i = 0; i < 4; i++) for (const s of [-1, 1]) M.ell(v, s * (22 + (i % 2) * 3), -2, -i * 10 - 5, 6 + (i % 3), 4 + (i % 2) * 2, 6, (x, y, z) => M.grain(M.mixC(0x4a9a3a, 0x6ab84a, M.hash(x >> 1, y >> 1, z >> 1)), x, y, z, 0.08));
    });
    function lane(kind, n) {
      for (let i = -1; i < n; i++) { add(laneSeg(kind), 0, 0, -i * 20); add(sideHills(), 0, 0, -i * 20); }
      for (let i = 0; i < n * 2; i++) for (const s of [-1, 1]) if ((i + (s > 0)) % 2 === 0) add(M.prop("tree", { k: i % 3 ? "oak" : "fruit", s: 0.85, seed: i * 2 + (s > 0) }), s * rnd(3.6, 4.4), 0.25, -i * 10 + 4);
    }
    function pad() {
      add(M.part("tr-pad", 1 / 4, v => {
        M.shape(v, -62, -2, -62, 62, 0, 62, (x, y, z) => Math.hypot(x, z) <= 61.5, (x, y, z) => {
          const d = Math.hypot(x, z);
          if (y < 0) return dirt(x, y, z);
          if (d < 12) return M.grain(Math.abs(d - 11) < 0.8 ? 0xf0f0e8 : 0xe8d8a8, x, y, z, 0.05);
          return grass(x, y, z);
        });
      }));
      add(M.part("tr-back", 1 / 2, v => {
        for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, r = 30 + (i % 3) * 3; M.ell(v, Math.cos(a) * r, -2, Math.sin(a) * r, 6 + (i % 4), 5 + (i % 3) * 2, 6, (x, y, z) => M.grain(M.mixC(0x4a9a3a, 0x6ab84a, M.hash(x >> 1, y >> 1, z >> 1)), x, y, z, 0.08)); }
      }));
      for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + 0.4; add(M.prop("tree", { k: i % 3 ? "fruit" : "oak", s: 0.9, seed: 20 + i }), Math.cos(a) * 9.5, 0.25, Math.sin(a) * 9.5); }
    }
    const GY = 0.25;                                              // (the top of the ground)
    /* a field out to the fog, under everything, so no edge shows the sky below the horizon */
    { const far = new THREE.Mesh(new THREE.CircleGeometry(260, 40), new THREE.MeshLambertMaterial({ color: 0x5aa040 })); far.rotation.x = -PI / 2; far.position.set(0, -0.6, -60); scene.add(far); }

    /* ================================================================ the games */
    const G = {};
    let game;

    /* -- Dash Lane (Velocity): left and right in turn */
    G.sprint = () => {
      lane("lane", 8);
      const S = { v: 0, z: 0, last: null, vmax: 4.4 + q * 4.2, kick: 0.55 + q * 0.5, puff: 0 };
      rig.g.rotation.y = PI;
      const target = GM.time * Math.min(S.vmax, S.kick * 6.5 / 0.9) * 0.86;
      return {
        key(k) {
          if (k !== "L" && k !== "R") return;
          if (k === S.last) { S.v *= 0.82; rig.face = "sad"; S.sad = 0.25; sfx("stumble"); }
          else { S.v = Math.min(S.vmax, S.v + S.kick); }
          S.last = k;
        },
        tick(dt) {
          S.v = Math.max(0, S.v - S.v * 0.9 * dt);
          S.z -= S.v * dt; B.score = -S.z;
          if ((S.sad -= dt) <= 0) rig.face = null;
          if (S.v > 3.5 && (S.puff -= dt) <= 0) { S.puff = 0.12; burst(rig.g.position.x + rnd(-0.1, 0.1), GY + 0.05, S.z + 0.3, [0xd8b890, 0xc8a070], 2, 0.3); }
        },
        place(dt) { rig.g.position.set(0, GY, S.z); rig.anim(B.t, dt, S.v > 3 ? "run" : S.v > 0.4 ? "walk" : "idle", S.v / 4); },
        camera(dt) { cam.position.lerp(V.set(5.2, 1.9, S.z + 1.2), Math.min(1, dt * 6)); cam.lookAt(0, 0.6, S.z - 0.6); sun.position.set(6, 14, S.z + 8); sun.target.position.set(0, 0, S.z); },
        show: () => B.score.toFixed(1) + " m",
        ratio: () => B.score / target,
      };
    };

    /* -- Hurdle Run (Agility): jump the hurdles, duck the bars */
    G.hurdles = () => {
      lane("lane", 9);
      rig.g.rotation.y = PI;
      const S = { z: 2, v: 3.6 + q * 1.6, y: 0, air: 0, duck: 0, slow: 0, ok: 0, n: 0 };
      const T = 0.55 + q * 0.32, DT = 0.55 + q * 0.35, list = [];
      let z = -10;
      for (let i = 0; i < 16; i++) { const bar = i >= 3 && Math.random() < 0.33; list.push({ z, bar }); z -= rnd(6.5, 10) * (S.v / 4.5); }
      const hurdle = () => M.part("tr-hurdle", 1 / 8, v => {
        for (const x of [-11, 11]) { M.blk(v, x, 0, -1, x, 3, 0, 0xf0f0e8); M.blk(v, x - 1, 0, -2, x + 1, 0, 1, 0x3a3a44); }
        M.blk(v, -11, 3, -1, 11, 3, 0, x => ((x + 11) >> 2) & 1 ? 0xe42630 : 0xf8f8f8);
      });
      const bar = () => M.part("tr-bar", 1 / 8, v => {
        for (const x of [-11, 11]) { M.blk(v, x, 0, -1, x, 6, 0, 0xf0f0e8); M.blk(v, x - 1, 0, -2, x + 1, 0, 1, 0x3a3a44); }
        M.blk(v, -11, 5, -1, 11, 5, 0, x => ((x + 11) >> 2) & 1 ? 0x1f58e0 : 0xffd21a);
      });
      for (const o of list) o.m = add(o.bar ? bar() : hurdle(), 0, GY, o.z);
      const last = list[list.length - 1].z;
      return {
        key(k) {
          if (k === "KeyZ" && S.air <= 0 && S.duck <= 0) { S.air = T; sfx("jump"); }
          if (k === "D" && S.air <= 0 && S.duck <= 0) { S.duck = DT; sfx("swing"); }
        },
        tick(dt) {
          S.slow = Math.max(0, S.slow - dt);
          const v = S.v * (S.slow > 0 ? 0.45 : 1), z0 = S.z;
          S.z -= v * dt;
          if (S.air > 0) { S.air -= dt; S.y = Math.sin(clamp(1 - S.air / T, 0, 1) * PI) * 0.55; } else S.y = 0;
          if (S.duck > 0) S.duck -= dt;
          for (const o of list) if (!o.done && z0 > o.z && S.z <= o.z) {
            o.done = true; S.n++;
            const clear = o.bar ? S.duck > 0 : S.y > 0.2;
            if (clear) { S.ok++; popC(o.bar ? "Under!" : "Over!", 0xffd21a); sfx("ring"); }
            else { o.m.rotation.x = o.bar ? 0.9 : -1.3; o.m.position.y = o.bar ? GY : GY + 0.05; o.m.updateMatrix(); S.slow = 0.9; popC("Oops", 0xf05a3a); sfx("stumble"); rig.face = "sad"; S.sad = 0.6; burst(0, 0.3, o.z, [0xf8f8f8, 0xe42630], 8, 0.6); }
          }
          if ((S.sad -= dt) <= 0) rig.face = null;
          B.score = S.ok;
          if (S.z < last - 5) B.finish();
        },
        place(dt) {
          rig.g.position.set(0, GY + S.y, S.z);
          rig.g.scale.set(1, S.duck > 0 ? 0.55 : 1, 1);
          rig.anim(B.t, dt, S.air > 0 ? "happy" : S.slow > 0 ? "walk" : "run", S.slow > 0 ? 0.6 : 1.2);
        },
        camera(dt) { cam.position.lerp(V.set(5, 1.8, S.z + 0.4), Math.min(1, dt * 6)); cam.lookAt(0, 0.5, S.z - 1.4); sun.position.set(6, 14, S.z + 8); sun.target.position.set(0, 0, S.z); },
        dbg: () => ({ S, list }),
        show: () => `${S.ok} / ${list.length}`,
        ratio: () => S.ok / list.length / 0.9,
      };
    };

    /* -- Rock Smash (Power): strike when the marker's in the gold */
    G.boulder = () => {
      pad();
      rig.g.rotation.y = PI;
      const S = { p: 0, dir: 1, cd: 0, hp: 100, broke: 0, dmg: 0, lunge: 0, rock: null, drop: 0, shake: 0 };
      const zw = 0.07 + q * 0.06, hit = 22 + q * 30;
      const target = GM.time / 0.95 * hit * 0.8 / 100;
      const rockMesh = k => M.part("tr-rock" + k, 1 / 8, v => {
        const base = [0x9a9484, 0x8a8a92, 0xa89a7a][k];
        M.ell(v, 0, 4, 0, 5 + (k === 1), 4.5 + (k === 2) * 0.8, 5 - (k === 2), (x, y, z) => M.grain(((y + (M.hash(x >> 1, 0, z >> 1) * 3 | 0)) % 4 === 0) ? M.mixC(base, 0x000000, 0.18) : base, x, y, z, 0.07));
      });
      const rock = () => { if (S.rock) scene.remove(S.rock); S.rock = add(rockMesh(S.broke % 3), 0, GY + 3, -0.35); S.drop = 1; S.hp = 100; };
      rock();
      $(".cg-tmid").innerHTML = `<div class="cg-tgauge"><i style="left:${(50 - zw * 100).toFixed(1)}%;width:${(zw * 200).toFixed(1)}%"></i><b></b></div><div class="cg-tbar"><span></span></div>`;
      const mark = $(".cg-tgauge>b"), bar = $(".cg-tbar>span");
      return {
        key(k) {
          if (k !== "KeyZ" || S.cd > 0 || S.drop > 0) return;
          S.cd = 0.5; S.lunge = 0.3;
          const d = Math.abs(S.p - 0.5), a = d < zw ? 1 : clamp(1 - (d - zw) * 2.6, 0.12, 0.85);
          const dm = a * hit; S.hp -= dm; S.dmg += dm; S.shake = 0.25;
          popC(a >= 1 ? "Perfect!" : a > 0.6 ? "Good" : "Weak", a >= 1 ? 0xffd21a : a > 0.6 ? 0xffffff : 0x9ab0c8, a >= 1);
          sfx(a >= 1 ? "impact" : "hit");
          burst(0, 0.5, -0.1, [0x9a9484, 0xc8c0b0], a >= 1 ? 12 : 5, 0.6);
          if (S.hp <= 0) { S.broke++; burst(0, 0.5, -0.35, [0x9a9484, 0x7a7468, 0xc8c0b0], 34, 1.2); sfx("boom"); popC("Smashed!", 0xff8a10, true); rock(); }
        },
        tick(dt) {
          const sp = 1.05 + S.broke * 0.12;
          S.p += S.dir * sp * dt; if (S.p > 1) { S.p = 2 - S.p; S.dir = -1; } if (S.p < 0) { S.p = -S.p; S.dir = 1; }
          S.cd -= dt; S.lunge = Math.max(0, S.lunge - dt);
          if (S.drop > 0) { S.drop = Math.max(0, S.drop - dt * 2.2); S.rock.position.y = GY + Math.abs(Math.cos((1 - S.drop) * PI * 1.5)) * S.drop * 3; if (!S.drop) { sfx("stomp"); burst(0, 0.1, -0.35, [0xd8b890], 10, 0.6); } }
          if (S.shake > 0) { S.shake -= dt; S.rock.position.x = Math.sin(B.t * 90) * S.shake * 0.12; } else if (S.rock) S.rock.position.x = 0;
          B.score = S.broke + clamp(1 - S.hp / 100, 0, 0.99);
          mark.style.left = (S.p * 100).toFixed(1) + "%"; bar.style.width = clamp(S.hp, 0, 100) + "%";
        },
        place(dt) {
          const l = S.lunge > 0 ? Math.sin(S.lunge / 0.3 * PI) * 0.3 : 0;
          rig.g.position.set(0, GY, 0.9 - l);
          rig.face = S.lunge > 0.15 ? "shut" : null;
          rig.anim(B.t, dt, S.lunge > 0 ? "train" : "idle", 1);
        },
        camera(dt) { cam.position.lerp(V.set(2.4, 1.5, 3.1), Math.min(1, dt * 4)); cam.lookAt(0, 0.45, 0.1); },
        show: () => `${S.broke} boulder${S.broke === 1 ? "" : "s"}`,
        ratio: () => S.dmg / 100 / target,
      };
    };

    /* -- Ball Machine (Resilience): block what comes from each side */
    G.balls = () => {
      pad();
      const S = { face: PI, guard: 0, gdir: null, cd: 0, block: 0, n: 0, next: 1.2, sad: 0 };
      const total = 24, win = 0.17 + q * 0.13;
      const M3 = [{ d: "L", x: -3.1, z: 0, a: PI / 2 }, { d: "U", x: 0, z: -3.4, a: 0 }, { d: "R", x: 3.1, z: 0, a: -PI / 2 }];
      const mach = () => M.part("tr-machine", 1 / 8, (v, gl) => {
        M.blk(v, -4, 0, -4, 3, 1, 3, 0x3a3a44);
        M.blk(v, -3, 2, -3, 2, 7, 2, (x, y, z) => M.grain(y === 7 ? 0xffd21a : 0x1f58e0, x, y, z, 0.04));
        M.blk(v, -1, 4, 3, 0, 5, 6, 0x2a2a34);
        gl.set(-1, 8, -1, 0xff4a3a); gl.set(0, 8, -1, 0xff4a3a);
      });
      for (const m of M3) { m.m = add(mach(), m.x, GY, m.z, m.a); m.lamp = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.4), new THREE.MeshBasicMaterial({ color: 0xffe040, transparent: true, opacity: 0 })); m.lamp.position.set(m.x, GY + 1.12, m.z); scene.add(m.lamp); }
      const ballG = new THREE.BoxGeometry(0.2, 0.2, 0.2), shots = [];
      const fire = (m, fly) => { const b = new THREE.Mesh(ballG, new THREE.MeshLambertMaterial({ color: [0xf05a9a, 0xffd21a, 0x3ad8a0][shots.length % 3] })); b.castShadow = true; scene.add(b); shots.push({ m, b, t: 0, T: fly, state: "fly" }); sfx("shot"); };
      const plan = [];
      for (let i = 0, t = 1.2; i < total; i++) { const m = M3[Math.floor(Math.random() * 3)]; plan.push({ at: t, m, fly: clamp(1.0 - i * 0.012, 0.72, 1) }); t += clamp(1.55 - i * 0.045, 0.62, 1.6) * (i > 12 && Math.random() < 0.2 ? 0.35 : 1); }
      return {
        key(k) {
          const m = M3.find(x => x.d === k); if (!m || S.cd > 0) return;
          S.gdir = m; S.guard = 0.28;
          const s = shots.filter(x => x.state === "fly" && x.m === m && x.T - x.t <= win && x.T - x.t >= -0.07).sort((a, b) => (a.T - a.t) - (b.T - b.t))[0];
          if (s) { s.state = "back"; s.vx = (s.m.x) * 0.9; s.vz = (s.m.z) * 0.9; s.vy = 4; S.block++; popC(S.block % 5 === 0 ? "Solid!" : "Block!", 0xffd21a, S.block % 5 === 0); sfx("set"); burst(s.b.position.x, s.b.position.y, s.b.position.z, [0xffffff, 0xffd21a], 6, 0.5); }
          else { S.cd = 0.3; sfx("swing"); }
        },
        tick(dt) {
          S.cd -= dt; S.guard -= dt; S.sad -= dt;
          for (const p of plan) if (!p.lit && B.t >= p.at - 0.4) { p.lit = true; p.m.flash = 0.4; sfx("warn"); }
          for (const p of plan) if (!p.done && B.t >= p.at) { p.done = true; fire(p.m, p.fly); }
          for (const m of M3) { m.flash = Math.max(0, (m.flash || 0) - dt); m.lamp.material.opacity = m.flash > 0 ? 0.5 + Math.sin(B.t * 40) * 0.3 : 0; }
          for (const s of shots.slice()) {
            s.t += dt; const b = s.b;
            if (s.state === "fly") {
              const k = clamp(s.t / s.T, 0, 1.2), sx = s.m.x * 0.92, sz = s.m.z * 0.92;
              b.position.set(lerp(sx, 0, k), GY + 0.6 + Math.sin(Math.min(1, k) * PI) * 1.1 - (k > 1 ? (k - 1) * 2 : 0), lerp(sz, 0, k));
              if (s.t > s.T + 0.07) { s.state = "hit"; s.vx = -s.m.x * 0.4 + rnd(-1, 1); s.vz = -s.m.z * 0.4 + rnd(-1, 1); s.vy = 2.5; S.sad = 0.5; popC("Ow!", 0xf05a3a); sfx("hit"); }
            } else {
              s.vy -= 12 * dt; b.position.x += s.vx * dt; b.position.y += s.vy * dt; b.position.z += s.vz * dt;
              if (b.position.y < GY + 0.1) { b.position.y = GY + 0.1; s.vy = Math.abs(s.vy) * 0.4; s.vx *= 0.7; s.vz *= 0.7; }
              if (s.t > s.T + 1.6) { scene.remove(b); b.material.dispose(); shots.splice(shots.indexOf(s), 1); }
            }
          }
          B.score = S.block;
          if (plan.every(p => p.done) && !shots.some(s => s.state === "fly")) B.finish();
        },
        place(dt) {
          const want = S.guard > 0 && S.gdir ? Math.atan2(S.gdir.x, S.gdir.z) : PI;
          let d = want - S.face; while (d > PI) d -= TAU; while (d < -PI) d += TAU; S.face += d * Math.min(1, dt * 18);
          rig.g.rotation.y = S.face; rig.g.position.set(0, GY, S.sad > 0 ? 0.1 : 0);
          rig.face = S.sad > 0 ? "sad" : S.guard > 0 ? "shut" : null;
          rig.anim(B.t, dt, S.guard > 0 ? "carry" : "idle", 1);
        },
        camera(dt) { const k = cam.aspect < 1.1 ? 1.5 : 1; cam.position.lerp(V.set(0, 4.2 * k, 5.4 * k), Math.min(1, dt * 4)); cam.lookAt(0, 0.2, -0.9); },
        dbg: () => ({ S, shots, win }),
        show: () => `${S.block} / ${total}`,
        ratio: () => S.block / total / 0.85,
      };
    };

    /* -- Long Swim (Vitality): stroke on the beat */
    G.swim = () => {
      lane("pool", 4);
      rig.g.rotation.y = PI;
      const S = { z: 0, owe: 0, st: 50 + q * 50, stMax: 50 + q * 50, beat: -1, used: -1, combo: 0 };
      const target = GM.time / 0.78 * 1.12;
      $(".cg-tmid").innerHTML = `<div class="cg-tbeat"><i></i><b></b></div><div class="cg-tbar st"><span></span></div>`;
      const ring = $(".cg-tbeat>i"), stb = $(".cg-tbar>span");
      const period = () => 0.86 - Math.min(0.2, B.t * 0.008);
      return {
        key(k) {
          if (k !== "KeyZ") return;
          const P = period(), ph = (B.t % P) / P, near = Math.round(B.t / P), e = Math.min(ph, 1 - ph) * P;
          const tired = S.st < 12;
          let m, cost, lab, cl;
          if (near === S.used) { m = 0.2; cost = 12; lab = "Off"; cl = 0x9ab0c8; S.combo = 0; }
          else if (e < 0.075) { m = 1.35; cost = 3; lab = S.combo >= 4 ? "Great x" + (S.combo + 1) : "Great!"; cl = 0xffd21a; S.combo++; S.used = near; }
          else if (e < 0.16) { m = 0.95; cost = 6; lab = "Good"; cl = 0xffffff; S.combo = 0; S.used = near; }
          else { m = 0.3; cost = 13; lab = "Off"; cl = 0x9ab0c8; S.combo = 0; }
          if (tired) { m *= 0.4; lab = "Tired..."; cl = 0x9ab0c8; }
          S.st = Math.max(0, S.st - cost); S.owe += m;
          popC(lab, cl); sfx(m > 1 ? "splash" : "bubble");
          burst(0, GY - 0.1, S.z - 0.2, [0xd8f4ff, 0xffffff], m > 1 ? 6 : 3, 0.5);
        },
        tick(dt) {
          const mv = S.owe * Math.min(1, dt * 3.5); S.owe -= mv; S.z -= mv + dt * 0.15;
          S.st = Math.min(S.stMax, S.st + (5 + q * 7) * dt);
          B.score = -S.z;
          const P = period(), ph = (B.t % P) / P;
          ring.style.transform = `translate(-50%,-50%) scale(${(1 + (1 - ph) * 1.6).toFixed(3)})`;
          ring.style.opacity = (0.35 + ph * 0.65).toFixed(2);
          stb.style.width = (S.st / S.stMax * 100).toFixed(1) + "%"; stb.className = S.st < 12 ? "low" : "";
        },
        place(dt) { rig.g.position.set(0, -0.12, S.z); rig.anim(B.t, dt, "swim", 1 + S.owe); },
        camera(dt) { cam.position.lerp(V.set(4, 2.1, S.z + 2.2), Math.min(1, dt * 5)); cam.lookAt(0, 0, S.z - 1); sun.position.set(6, 14, S.z + 8); sun.target.position.set(0, 0, S.z); },
        show: () => B.score.toFixed(1) + " m",
        ratio: () => B.score / target,
      };
    };

    /* -- Fruit Catch (Instinct): read the shadows */
    G.fruit = () => {
      pad();
      rig.g.rotation.y = 0;
      for (let i = 0; i < 5; i++) add(M.prop("tree", { k: "fruit", s: 1.1, seed: 40 + i }), -4 + i * 2, 0.25, -2.6);
      const S = { x: 0, lane: 2, stun: 0, got: 0, nuts: 0, spawned: 0, next: 0.8, happy: 0 };
      const warn = 0.6 + q * 0.6, fall = 0.55, sp = 6 + q * 6, drops = [];
      const KINDS = ["round", "triangle", "square", "berry", "nut", "heart"].filter(id => D.food(id));
      const spiny = () => M.part("tr-spiny", 1 / 16, v => {
        M.ell(v, 0, 3, 0, 3, 3, 3, (x, y, z) => M.grain(0x5a3a22, x, y, z, 0.08));
        for (const [x, y, z] of [[0, 7, 0], [4, 3, 0], [-4, 3, 0], [0, 3, 4], [0, 3, -4], [3, 6, 3], [-3, 6, -3], [3, 6, -3], [-3, 6, 3]]) v.set(x, y, z, 0x2a1a10);
      });
      return {
        key(k) { if (S.stun > 0) return; if (k === "L") S.lane = Math.max(0, S.lane - 1); if (k === "R") S.lane = Math.min(4, S.lane + 1); },
        tick(dt) {
          S.stun -= dt; S.happy -= dt;
          if ((S.next -= dt) <= 0 && B.left > warn + fall) {
            S.next = lerp(1.0, 0.45, clamp(B.t / GM.time, 0, 1)) * rnd(0.85, 1.15);
            const busy = drops.filter(d => !d.done).map(d => d.lane);
            let ln = Math.floor(Math.random() * 5); for (let i = 0; i < 5 && busy.includes(ln); i++) ln = (ln + 1) % 5;
            const nut = B.t > 4 && Math.random() < 0.18;
            const m = nut ? spiny() : M.prop("fruit", { id: KINDS[Math.floor(Math.random() * KINDS.length)] });
            const sh = M.blob(0.32); sh.scale.setScalar(0.01); scene.add(sh); sh.position.set(-2 + ln, GY + 0.02, 0);
            add(m, -2 + ln, 8, 0); m.visible = false;
            drops.push({ lane: ln, m, sh, t: 0, nut }); if (!nut) S.spawned++;
          }
          for (const d of drops.slice()) {
            d.t += dt;
            const k = d.t / warn; d.sh.scale.setScalar(clamp(k, 0.05, 1));
            if (d.t > warn) { d.m.visible = true; const f = clamp((d.t - warn) / fall, 0, 1); d.m.position.y = lerp(6, GY + 0.2, f * f); }
            if (!d.done && d.t >= warn + fall) {
              d.done = true;
              const caught = Math.abs(S.x - (-2 + d.lane)) < 0.45 && S.stun <= 0;
              if (caught && !d.nut) { S.got++; S.happy = 0.4; popC("+1", 0xffd21a); sfx("coin"); scene.remove(d.m); d.gone = true; }
              else if (caught && d.nut) { S.nuts++; S.stun = 0.7; popC("Ouch!", 0xf05a3a); sfx("hurt"); burst(d.m.position.x, 0.6, 0, [0x5a3a22, 0x2a1a10], 8, 0.6); scene.remove(d.m); d.gone = true; }
              else { sfx(d.nut ? "stomp" : "pop"); burst(d.m.position.x, 0.3, 0, d.nut ? [0x5a3a22] : [0xffd21a, 0xf87aa0], 5, 0.4); }
              d.end = d.t;
            }
            if (d.done && d.t > d.end + 0.4) { scene.remove(d.m); scene.remove(d.sh); d.sh.material.dispose(); d.sh.geometry.dispose(); drops.splice(drops.indexOf(d), 1); }
          }
          const want = -2 + S.lane; S.x += clamp(want - S.x, -sp * dt, sp * dt);
          B.score = Math.max(0, S.got - S.nuts);
        },
        place(dt) {
          rig.g.position.set(S.x, GY, 0.2);
          const moving = Math.abs(-2 + S.lane - S.x) > 0.05;
          rig.g.rotation.y = moving ? (-2 + S.lane > S.x ? PI / 2 : -PI / 2) * 0.6 : 0;
          rig.face = S.stun > 0 ? "sad" : null;
          rig.anim(B.t, dt, S.stun > 0 ? "sad" : S.happy > 0 ? "happy" : moving ? "run" : "idle", 1.4);
        },
        camera(dt) { const k = cam.aspect < 1.1 ? 1.7 : 1; cam.position.lerp(V.set(0, 3.3 * k, 5.6 * k), Math.min(1, dt * 4)); cam.lookAt(0, 0.8, -0.5); },
        dbg: () => ({ S, drops, warn }),
        show: () => `${B.score} fruit`,
        ratio: () => B.score / Math.max(4, S.spawned) / 0.85,
      };
    };

    /* -- Drive Echo (Chaos): play the tune back */
    G.chaos = () => {
      pad();
      const P4 = { U: { x: 0, z: -1.7, c: 0x3ad86a, f: 523 }, R: { x: 1.7, z: 0, c: 0xffd21a, f: 659 }, D: { x: 0, z: 1.7, c: 0xb06af0, f: 392 }, L: { x: -1.7, z: 0, c: 0xf04a4a, f: 784 } };
      const ped = k => M.part("tr-ped" + k, 1 / 8, (v, gl) => {
        M.blk(v, -2, 0, -2, 2, 5, 2, (x, y, z) => M.grain(y === 5 ? 0xd8d0c0 : 0xb8b0a0, x, y, z, 0.05));
        const cc = P4[k].c; for (let y = 6; y <= 9; y++) { const r = y === 6 || y === 9 ? 0 : 1; M.blk(gl, -r, y, -r, r, y, r, M.mixC(cc, 0xffffff, y === 8 ? 0.35 : 0)); }
      });
      for (const k in P4) { const p = P4[k]; p.m = add(ped(k), p.x, GY, p.z); p.halo = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.62), new THREE.MeshBasicMaterial({ color: p.c, transparent: true, opacity: 0, depthWrite: false })); p.halo.position.set(p.x, GY + 0.98, p.z); scene.add(p.halo); }
      const S = { seq: [], i: 0, mode: "wait", t: 0.9, round: 0, lives: 2 + (q > 0.5 ? 1 : 0), lit: null, litT: 0, face: 0, sad: 0, happy: 0 };
      const keys = Object.keys(P4), showT = () => Math.max(0.3, 0.6 + q * 0.25 - S.round * 0.025), gap = 0.17;
      const more = () => S.seq.push(keys[Math.floor(Math.random() * 4)]);
      more(); more(); more();
      const light = (k, d) => { S.lit = k; S.litT = d; chirp(P4[k].f, d); };
      const hearts = () => { $(".cg-tmid").innerHTML = `<div class="cg-thearts">${"<i></i>".repeat(S.lives)}</div>`; };
      hearts();
      return {
        key(k) {
          if (!P4[k] || S.mode !== "input") return;
          light(k, 0.22);
          if (S.seq[S.i] === k) {
            S.i++;
            if (S.i >= S.seq.length) { S.round++; S.mode = "wait"; S.t = 0.8; S.happy = 0.7; popC(S.round % 3 === 0 ? "Brilliant!" : "Good!", 0xffd21a, S.round % 3 === 0); sfx("check"); more(); }
          } else {
            S.lives--; hearts(); S.sad = 0.8; popC("Not quite", 0xf05a3a); sfx("stumble");
            if (S.lives <= 0) B.finish(); else { S.mode = "wait"; S.t = 1.0; }
          }
        },
        tick(dt) {
          S.litT -= dt; S.sad -= dt; S.happy -= dt;
          if (S.litT <= 0) S.lit = null;
          for (const k in P4) { const p = P4[k], on = S.lit === k; p.halo.material.opacity = on ? 0.55 : 0; p.halo.scale.setScalar(on ? 1 + Math.sin(B.t * 20) * 0.06 : 1); }
          if (S.mode === "wait") { if ((S.t -= dt) <= 0) { S.mode = "show"; S.i = 0; S.t = 0.15; } }
          else if (S.mode === "show") {
            if ((S.t -= dt) <= 0) {
              if (S.i < S.seq.length) { light(S.seq[S.i], showT()); S.i++; S.t = showT() + gap; }
              else { S.mode = "input"; S.i = 0; }
            }
          }
          B.score = S.round;
          const tip = hud.querySelector(".cg-tktip"); if (tip) tip.textContent = S.mode === "input" ? "Your turn" : "Watch";
        },
        place(dt) {
          const tg = S.lit ? P4[S.lit] : null, want = tg ? Math.atan2(tg.x, tg.z) : 0;
          let d = want - S.face; while (d > PI) d -= TAU; while (d < -PI) d += TAU; S.face += d * Math.min(1, dt * 10);
          rig.g.rotation.y = S.face; rig.g.position.set(0, GY, 0);
          rig.face = S.sad > 0 ? "sad" : null;
          rig.anim(B.t, dt, S.sad > 0 ? "sad" : S.happy > 0 ? "happy" : "idle", 1);
        },
        camera(dt) { const k = cam.aspect < 1.1 ? 1.5 : 1; cam.position.lerp(V.set(0, 4.3 * k, 4.4 * k), Math.min(1, dt * 4)); cam.lookAt(0, 0.4, 0); },
        dbg: () => ({ S }),
        show: () => `Round ${S.round + 1}`,
        final: () => `${S.round} round${S.round === 1 ? "" : "s"}`,
        ratio: () => S.round / 7,
      };
    };

    game = G[GM.id]();
    game.camera(1);
    B.dbg = () => game.dbg && game.dbg();

    /* ================================================================ the flow
       intro (the rules, Z to start) -> count (3, 2, 1) -> play -> end (Finish!) -> done */
    let count = 0, shown = null, goT = 0;
    B.finish = () => {
      if (B.phase !== "play") return;
      B.phase = "end"; B.endT = 2.0;
      B.ratio = game.ratio();
      card(`<div class="cg-bend win"><b>${B.left <= 0 && GM.timed ? "Time!" : "Finish!"}</b></div>`);
      sfx("goal");
      if (B.ratio >= 0.6) env.jingle && env.jingle("born-change");
    };
    function quit() {
      if (B.ended) return; B.ended = true;
      teardown(); done && done({ quit: true, game: GM, c });
    }
    function teardown() { hud.remove(); for (const p of B.fx) { scene.remove(p.m); p.m.material.dispose(); } B.fx = []; }
    function pause(on) {
      B.paused = on;
      if (on) card(`<div class="cg-tintro small"><div class="cg-tintro-hd"><b>Paused</b></div><div class="cg-tintro-go"><button class="cg-tk" data-k="Enter"><b>Enter</b><i>Go on</i></button><button class="cg-tk ghost" data-k="KeyX"><b>X</b><i>Stop training</i></button></div></div>`);
      else card("");
    }
    B.key = (k) => {
      if (B.ended) return true;
      const code = { ArrowLeft: "L", ArrowRight: "R", ArrowUp: "U", ArrowDown: "D", KeyA: "L", KeyD: "R", KeyW: "U", KeyS: "D", Space: "KeyZ" }[k] || k;
      if (B.phase === "intro") { if (code === "KeyZ" || code === "Enter") { B.phase = "count"; count = 3; shown = null; card(""); } else if (code === "KeyX" || code === "Escape") quit(); return true; }
      if (B.phase === "end") return true;
      if (B.paused) { if (code === "Enter" || code === "KeyZ") pause(false); else if (code === "KeyX" || code === "Escape") quit(); return true; }
      if (code === "Enter" || code === "Escape" || code === "KeyX") { pause(true); return true; }
      if (B.phase === "play") game.key(code);
      return true;
    };
    B.frame = (dt) => {
      if (B.ended) return;
      const b = env.el.getBoundingClientRect(); if (B.w !== b.width || B.h !== b.height) { B.w = b.width; B.h = b.height; R.setSize(B.w, B.h, false); cam.aspect = B.w / B.h; cam.updateProjectionMatrix(); }
      dt = Math.min(dt, 0.05);
      if (!B.paused && !(env.isMenu && env.isMenu())) {
        if (B.phase === "count") {
          count -= dt;
          const n = Math.ceil(count);
          if (n !== shown) { shown = n; if (n > 0) { card(`<div class="cg-tcount">${n}</div>`); sfx("warn"); } }
          if (count <= 0) { B.phase = "play"; goT = 0.7; card(`<div class="cg-tcount go">Go!</div>`); sfx("star"); }
        } else if (B.phase === "play") {
          if (goT > 0 && (goT -= dt) <= 0) card("");
          B.t += dt; B.left -= dt;
          game.tick(dt);
          if (B.left <= 0) { B.left = 0; B.finish(); }
        } else if (B.phase === "end") {
          B.endT -= dt;
          if (B.endT <= 0 && !B.ended) { B.ended = true; const res = { quit: false, game: GM, c, score: B.score, show: game.final ? game.final() : game.show(), ratio: B.ratio, grade: grade(B.ratio) }; teardown(); done && done(res); return; }
        }
        game.place(dt); fxTick(dt);
      }
      game.camera(dt);
      $(".cg-tscore>b").textContent = game.show();
      $(".cg-tscore>i").textContent = GM.timed && B.phase !== "intro" ? Math.ceil(Math.max(0, B.left)) + " s" : "";
      R.render(scene, cam);
    };
    B.dispose = () => {};
    return B;
  }

  root.ChaoTrain = { ok: true, start, GAMES, grade };
})(typeof globalThis !== "undefined" ? globalThis : this);
