/*
 * Red Ring Circuit: the Chao Garden's voxel models -- every Chao form, every animal's body plan,
 * the keeper (the player's avatar) and the garden's things (fruit, eggs, toys, trees, flowers).
 * Built as Pallet to Pewter builds its props: shapes filled into a sparse voxel grid, coloured
 * voxel by voxel (a little grain in each), then meshed with baked ambient occlusion (voxkit).
 * Each creature is a rig of parts (body, head, legs, arms, wings, tail, the Chao's ball) so it
 * can walk, hop, flap, swim and emote; its own genes tint it, pattern it and size it.
 *
 *   ChaoModels.creature(c)   -> rig { g, parts..., anim(t, dt, state) , h }
 *   ChaoModels.avatar(look)  -> rig
 *   ChaoModels.prop(kind, opt) -> THREE.Object3D
 *   ChaoModels.AVATAR        the creator's options
 */
(function (root) {
  "use strict";
  const THREE = root.THREE, KIT = root.Voxel && root.Voxel.kit, D = root.ChaoData;
  if (!THREE || !KIT) { root.ChaoModels = { ok: false }; return; }
  const { Vox, meshVox, mulC, mixC } = KIT;
  const PI = Math.PI;

  /* ---------------------------------------------------------------- colour */
  function toHsl(c) {
    const r = ((c >> 16) & 255) / 255, g = ((c >> 8) & 255) / 255, b = (c & 255) / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
    if (mx === mn) return [0, 0, l];
    const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h * 60, s, l];
  }
  function fromHsl(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360;
    const f = (p, q, t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
    let r, g, b;
    if (!s) r = g = b = l;
    else { const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; r = f(p, q, h + 1 / 3); g = f(p, q, h); b = f(p, q, h - 1 / 3); }
    return (Math.round(r * 255) << 16) | (Math.round(g * 255) << 8) | Math.round(b * 255);
  }
  const shift = (c, dh, dl) => { if (!dh && !dl) return c; const [h, s, l] = toHsl(c); return fromHsl(h + (dh || 0), s, Math.max(0.04, Math.min(0.97, l + (dl || 0) / 100))); };
  const hash = (x, y, z) => { let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 1274126177) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const grain = (c, x, y, z, a) => mulC(c, 1 - (a || 0.05) + hash(x, y, z) * (a || 0.05) * 2);

  /* ---------------------------------------------------------------- shapes
     Filled as shells (the inside never shows), coloured by a function of the voxel */
  function shape(v, x0, y0, z0, x1, y1, z1, inside, col) {
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) {
      const X = x + 0.5, Y = y + 0.5, Z = z + 0.5;
      if (!inside(X, Y, Z)) continue;
      if (inside(X + 1, Y, Z) && inside(X - 1, Y, Z) && inside(X, Y + 1, Z) && inside(X, Y - 1, Z) && inside(X, Y, Z + 1) && inside(X, Y, Z - 1)) continue;
      const c = typeof col === "function" ? col(x, y, z) : col;
      if (c != null) v.set(x, y, z, c);
    }
  }
  function ell(v, cx, cy, cz, rx, ry, rz, col) {
    rx = Math.max(0.6, rx); ry = Math.max(0.6, ry); rz = Math.max(0.6, rz);
    shape(v, Math.floor(cx - rx) - 1, Math.floor(cy - ry) - 1, Math.floor(cz - rz) - 1, Math.ceil(cx + rx), Math.ceil(cy + ry), Math.ceil(cz + rz),
      (x, y, z) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 <= 1, col);
  }
  /* a rounded box: a superellipsoid (p 2 is an ellipsoid; 3 a rounded cube; 4 and up, boxier) */
  function sel(v, cx, cy, cz, rx, ry, rz, p, col) {
    rx = Math.max(0.6, rx); ry = Math.max(0.6, ry); rz = Math.max(0.6, rz);
    shape(v, Math.floor(cx - rx) - 1, Math.floor(cy - ry) - 1, Math.floor(cz - rz) - 1, Math.ceil(cx + rx), Math.ceil(cy + ry), Math.ceil(cz + rz),
      (x, y, z) => Math.abs((x - cx) / rx) ** p + Math.abs((y - cy) / ry) ** p + Math.abs((z - cz) / rz) ** p <= 1, col);
  }
  /* a capsule (a cone, when the two radii differ) from a to b */
  function cap(v, ax, ay, az, bx, by, bz, r0, r1, col) {
    const dx = bx - ax, dy = by - ay, dz = bz - az, L2 = dx * dx + dy * dy + dz * dz || 1e-6, R = Math.max(r0, r1);
    shape(v, Math.floor(Math.min(ax, bx) - R) - 1, Math.floor(Math.min(ay, by) - R) - 1, Math.floor(Math.min(az, bz) - R) - 1,
      Math.ceil(Math.max(ax, bx) + R), Math.ceil(Math.max(ay, by) + R), Math.ceil(Math.max(az, bz) + R), (x, y, z) => {
        let t = ((x - ax) * dx + (y - ay) * dy + (z - az) * dz) / L2; t = t < 0 ? 0 : t > 1 ? 1 : t;
        const px = ax + dx * t - x, py = ay + dy * t - y, pz = az + dz * t - z, r = r0 + (r1 - r0) * t;
        return px * px + py * py + pz * pz <= r * r;
      }, typeof col === "function" ? col : col);
  }
  function blk(v, x0, y0, z0, x1, y1, z1, col) {
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) {
      const c = typeof col === "function" ? col(x, y, z) : col; if (c != null) v.set(x, y, z, c);
    }
  }
  /* a chain of capsules through points, radius from r0 to r1 */
  function chain(v, pts, r0, r1, col) {
    for (let i = 0; i < pts.length - 1; i++) {
      const t0 = i / (pts.length - 1), t1 = (i + 1) / (pts.length - 1);
      cap(v, ...pts[i], ...pts[i + 1], r0 + (r1 - r0) * t0, r0 + (r1 - r0) * t1, col);
    }
  }
  /* recolour what's already there inside a region */
  function paint(v, inside, col) { v.each((x, y, z, c) => { if (inside(x + 0.5, y + 0.5, z + 0.5)) v.set(x, y, z, typeof col === "function" ? col(x, y, z, c) : col); }); }
  const mirror = (v, fn) => { fn(1); fn(-1); };

  /* ---------------------------------------------------------------- meshes, kept */
  const MAT = {};
  function mat(kind) {
    if (MAT[kind]) return MAT[kind];
    let m;
    if (kind === "glass") m = new THREE.MeshPhongMaterial({ vertexColors: true, transparent: true, opacity: 0.74, shininess: 90, specular: 0x8899aa });
    else if (kind === "sheen") m = new THREE.MeshPhongMaterial({ vertexColors: true, shininess: 70, specular: 0x666666 });
    else if (kind === "glow") m = new THREE.MeshBasicMaterial({ vertexColors: true });
    else if (kind === "glowT") m = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false });
    else m = new THREE.MeshLambertMaterial({ vertexColors: true });
    return (MAT[kind] = m);
  }
  const GEO = new Map();
  /* a part: built once per key; its own voxels lit, its "glow" voxels unlit */
  function part(key, scale, build, kind) {
    let g = GEO.get(key);
    if (!g) {
      const v = new Vox(), gl = new Vox();
      build(v, gl);
      g = { a: v.m.size ? meshVox(v, scale) : null, b: gl.m.size ? meshVox(gl, scale) : null };
      GEO.set(key, g);
    }
    const grp = new THREE.Group();
    if (g.a) { const m = new THREE.Mesh(g.a, mat(kind || "vox")); grp.add(m); }
    if (g.b) grp.add(new THREE.Mesh(g.b, mat("glow")));
    return grp;
  }
  const at = (o, x, y, z, s) => { o.position.set(x * s, y * s, z * s); return o; };

  /* a soft round shadow under everything that moves */
  let SHADOW_TEX = null;
  function blob(r) {
    if (!SHADOW_TEX) {
      const c = document.createElement("canvas"); c.width = c.height = 64;
      const x = c.getContext("2d"), gr = x.createRadialGradient(32, 32, 4, 32, 32, 31);
      gr.addColorStop(0, "rgba(0,0,0,.42)"); gr.addColorStop(0.7, "rgba(0,0,0,.18)"); gr.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
      SHADOW_TEX = new THREE.CanvasTexture(c);
    }
    const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), new THREE.MeshBasicMaterial({ map: SHADOW_TEX, transparent: true, depthWrite: false }));
    m.rotation.x = -PI / 2; m.position.y = 0.02; m.renderOrder = 1;
    return m;
  }

  /* ---------------------------------------------------------------- eyes and faces
     Every creature's eyes come in the same few states, swapped as it feels things: open,
     blinking, happy (^ ^), sad, asleep. */
  function eyeSet(key, s, w, h, col, hi) {
    const x0 = -Math.floor(w / 2), x1 = x0 + w - 1, y0 = -Math.floor(h / 2), y1 = y0 + h - 1;
    const mk = (st) => part(`eye:${key}:${w}x${h}:${col}:${hi ? 1 : 0}:${st}`, s, v => {
      if (st === "open") {
        for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
          if (w >= 3 && h >= 4 && (x === x0 || x === x1) && (y === y0 || y === y1)) continue;          // round the corners
          v.set(x, y, 0, hi && h >= 3 && w >= 2 && x === x0 + (w >= 3 ? 0 : 0) && y === y1 - (h >= 4 ? 1 : 0) ? 0xffffff : col);
        }
      }
      else if (st === "shut") blk(v, x0, y0 + (h >= 3 ? 1 : 0), 0, x1, y0 + (h >= 3 ? 1 : 0), 0, col);
      else if (st === "happy") { const m = (x0 + x1) / 2; for (let x = x0; x <= x1; x++) v.set(x, y0 + 1 + (Math.abs(x - m) < 0.6 ? 1 : 0) + (w <= 2 ? 0 : 0), 0, col); if (w === 2) { v.set(x0, y0 + 1, 0, col); v.set(x1, y0 + 2, 0, col); } }
      else if (st === "sad") { for (let x = x0; x <= x1; x++) v.set(x, y0 + 1 + Math.round((x1 - x) * 0.5) * (key === "R" ? -1 : 1), 0, col); }
    });
    const g = new THREE.Group(), st = {};
    for (const k of ["open", "shut", "happy", "sad"]) { st[k] = mk(k); st[k].visible = k === "open"; g.add(st[k]); }
    g.userData.st = st;
    return g;
  }
  /* an eye (or a mouth) set on a face: on the voxel grid, mirrored true, its front just proud of
     the skin and turned with the face's curve */
  const faceZ = (cz, rx, ry, rz, x, dy) => cz + rz * Math.sqrt(Math.max(0, 1 - (x / rx) ** 2 - (dy / ry) ** 2));
  function stick(e, side, X, Y, Z, w, s, turn) {
    e.position.set((side > 0 ? X : -X - (w % 2)) * s, Math.round(Y) * s, Z * s);
    e.scale.z = 0.4; e.rotation.y = side * (turn || 0);
    return e;
  }
  const setEyes = (eyes, k) => { if (!eyes) return; for (const e of eyes) { const st = e.userData.st; for (const n in st) st[n].visible = n === k; } };

  /* ---------------------------------------------------------------- Chao
     A big round head, a small pear body, stubby arms and feet, little wings, a tail, and the
     ball floating over its head. The alignment colours it and shapes the ball and the head's
     tip; the first path reshapes the body (the second, half as much); a rare form adds its own. */
  const SC = 1 / 31;
  const TIP_SHAPE = { neutral: "point", hero: "round", dark: "horn", wild: "sprout", mech: "antenna" };
  function chaoLook(c) {
    const sp = D.species(c.sp) || D.CHAO[0], al = D.ALIGNS[sp.align] || D.ALIGNS.neutral, g = c.genes || {};
    const m = sp.morph && sp.morph.body || {};
    let body = m.tint != null ? m.tint : al.c[0], tip = m.tint != null ? mixC(m.tint, 0xffffff, 0.45) : al.c[1];
    body = shift(body, (g.tint || 0) * 0.5, (g.tint2 || 0) * 0.5); tip = shift(tip, (g.tint || 0) * 0.3, 0);
    const w = p => (sp.p1 === p ? 1 : 0) + (sp.p2 === p ? 0.5 : 0);
    return { sp, al: sp.align, body, tip, belly: mixC(body, 0xffffff, 0.35), m, child: sp.stage === 0, pat: g.pat || "plain",
      swim: w("swim") + (m.fins ? 1 : 0), fly: w("fly") + (m.wings ? m.wings - 1 : 0), run: w("run"), power: w("power"), spark: w("spark") + (m.ears === "antlers" ? 0.6 : 0),
      kind: m.glass ? "glass" : m.sheen ? "sheen" : "vox", tipShape: sp.stage >= 3 ? "round" : TIP_SHAPE[sp.align], ball: sp.stage >= 3 ? (m.ring ? "halo" : "sphere") : al.ball, ballC: sp.stage >= 3 ? tip : al.ballC };
  }
  function chaoCol(L) {
    /* a voxel's colour on the head or body: the body colour, lighter on the face and belly,
       the tips' colour toward the extremities, and the creature's own pattern */
    return (x, y, z, zone) => {
      let c = L.body;
      if (L.m.prism) c = fromHsl((x * 9 + y * 7 + z * 5) % 360, 0.6, 0.72);
      if (zone === "belly" && z > 1) c = L.belly;
      if (L.pat === "spots" && hash(x >> 1, y >> 1, z >> 1) < 0.1) c = mixC(c, L.tip, 0.7);
      if (L.pat === "stripes" && z < 0 && ((y + (x >> 2)) & 3) === 0) c = mixC(c, L.tip, 0.55);
      if (L.pat === "two-tone" && y > 4 && zone === "head") c = mixC(c, L.tip, 0.35);
      if (L.pat === "freckles" && zone === "head" && z > 5 && y < 7 && y > 3 && hash(x, y, z) < 0.18) c = mixC(c, 0x8a5a3a, 0.5);
      if (L.m.stripes && ((y + x) & 3) === 0) c = L.m.stripes;
      if (L.m.moss && y > 9 && zone === "head") c = mixC(0x6a9a4a, c, hash(x, y, z) * 0.4);
      if (L.m.glyphs && zone && ((x * 3 + y * 5) % 11 === 0)) c = mulC(c, 0.55);
      if (L.m.rivets && ((x & 3) === 0) && ((y & 3) === 0)) c = 0x5a606a;
      return grain(c, x, y, z, 0.035);
    };
  }
  function buildChao(c) {
    const L = chaoLook(c), col = chaoCol(L), K = `chao:${c.sp}:${L.body}:${L.tip}:${L.pat}`;
    const ch = L.child, k = ch ? 0.82 : 1;
    const rig = { g: new THREE.Group(), kind: "chao", plan: L.fly >= 1 ? "chaofly" : "chao", L };
    const inner = new THREE.Group(); rig.g.add(inner); rig.inner = inner;
    const legX = 3.6 * k, hip = (ch ? 3.5 : 4.5) + L.run * 3.2;
    const bw = (ch ? 4.4 : 5.2) * (1 + L.power * 0.22) * (1 - L.run * 0.06), bh = ch ? 6.5 : 8.5, bd = (ch ? 4.2 : 4.8) * (1 + L.power * 0.12);
    /* the body */
    const body = part(K + ":body", SC, (v, gl) => {
      ell(v, 0, bh / 2, 0, bw, bh / 2 + 0.5, bd, (x, y, z) => col(x, y, z, "belly"));
      if (L.m.glow || L.spark >= 0.5) for (let y = 2; y < bh - 2; y += 3) gl.set(0, y, Math.round(bd) - 0, 0x9af8ff);
      if (L.m.moss) ell(v, 0, bh * 0.6, -bd * 0.7, bw * 0.7, bh * 0.35, 1.6, (x, y, z) => grain(0x5a8a3a, x, y, z, 0.12));
      if (L.m.rivets) for (const sx of [-1, 1]) v.set(Math.round(sx * bw * 0.6), Math.round(bh * 0.5), Math.round(bd * 0.75), 0x5a606a);
    }, L.kind);
    at(body, 0, hip, 0, SC); inner.add(body); rig.body = body;
    /* the head, over the body's top, a little forward */
    const hr = ch ? 7.8 : 8.6, hy = hr * 0.86, neckY = hip + bh - 1.8;
    const head = part(K + ":head", SC, (v, gl) => {
      ell(v, 0, hy, 1, hr * 1.06, hy, hr * 0.94, (x, y, z) => col(x, y, z, "head"));
      const top = hy * 2 - 0.5;
      /* the tip on top */
      if (L.tipShape === "point") cap(v, 0, top - 2, 0, 0, top + 4.5, -1.5, 3, 0.8, (x, y, z) => grain(mixC(L.body, L.tip, Math.min(1, (y - top + 2) / 5)), x, y, z, 0.04));
      else if (L.tipShape === "round") ell(v, 0, top, 0, 2.6, 2.4, 2.6, (x, y, z) => grain(mixC(L.body, L.tip, 0.6), x, y, z));
      else if (L.tipShape === "horn") mirror(v, s => cap(v, s * 3, top - 2, 0, s * 4.5, top + 3.5, -1.5, 2, 0.6, (x, y, z) => grain(mixC(L.body, L.tip, Math.min(1, (y - top + 2) / 4)), x, y, z)));
      else if (L.tipShape === "sprout") { cap(v, 0, top - 1, 0, 0, top + 2.5, 0, 1, 0.8, 0x5a8a3a); ell(v, 2.5, top + 3, 0, 3, 1, 1.6, x => grain(0x6ad050, x, 0, 0)); ell(v, -2, top + 3.5, 0, 2.4, 0.9, 1.4, x => grain(0x5ac040, x, 1, 0)); }
      else if (L.tipShape === "antenna") { cap(v, 0, top - 1, 0, 0, top + 4, -1, 0.7, 0.7, 0x8a909a); gl.set(0, Math.round(top + 5), -1, L.tip); gl.set(0, Math.round(top + 4), -1, L.tip); }
      /* swept ears for runners, fins for swimmers, antlers for sparks */
      if (L.run >= 0.5) mirror(v, s => cap(v, s * 4, hy * 1.5, -2, s * (5 + L.run), hy * 1.5 + 1.5, -9 - L.run * 2, 2.2, 0.8, (x, y, z) => grain(mixC(L.body, L.tip, Math.min(1, -z / 9)), x, y, z)));
      if (L.swim >= 0.5) mirror(v, s => { for (let i = 0; i < 4; i++) cap(v, s * hr, hy + 1 - i * 1.2, 0, s * (hr + 3 + L.swim * 1.5 - i * 0.5), hy + 2.5 - i * 1.4, -3 - i * 0.4, 1, 0.6, (x, y, z) => grain(mixC(L.tip, L.body, 0.25), x, y, z)); });
      if (L.spark >= 0.5) mirror(v, s => { chain(v, [[s * 3, top - 2, 0], [s * 5, top + 3, -1], [s * 7.5, top + 6, -1]], 1.2, 0.6, (x, y, z) => grain(L.tip, x, y, z)); cap(v, s * 5, top + 3, -1, s * 3.5, top + 6.5, -1, 0.8, 0.5, (x, y, z) => grain(L.tip, x, y, z)); });
      if (L.m.petals) for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2; ell(v, Math.cos(a) * (hr + 1.5), hy + Math.sin(a) * (hy + 1), -1, 2.2, 2.2, 1, x => grain(0xf8a8d0, x, i, 0)); }
      if (L.m.flame) for (let i = 0; i < 6; i++) gl.set(Math.round((hash(i, 1, 2) - 0.5) * 4), Math.round(top + 2 + i), Math.round((hash(i, 3, 4) - 0.5) * 3), mixC(0xffd040, 0xff5a1a, i / 6));
      if (L.m.gem) ell(gl, 0, hy * 1.45, hr * 0.9, 1.4, 1.6, 0.8, L.m.gem > 1 ? 0x40f080 : 0xf04a6a);
      if (L.m.glow || L.spark >= 1) mirror(v, s => { gl.set(s * 5 + (s < 0 ? -1 : 0), Math.round(hy * 0.8), Math.round(hr * 0.75), 0x9af8ff); gl.set(s * 6 + (s < 0 ? -1 : 0), Math.round(hy * 0.8) + 1, Math.round(hr * 0.7), 0x9af8ff); });
      if (L.m.stars) for (let i = 0; i < 14; i++) { const a = hash(i, 9, 9) * PI * 2, b = hash(i, 7, 7) * PI - PI / 2; gl.set(Math.round(Math.cos(a) * Math.cos(b) * hr * 1.05), Math.round(hy + Math.sin(b) * hy), Math.round(1 + Math.sin(a) * Math.cos(b) * hr * 0.94), 0xffffff); }
      /* cheeks */
      if (!L.m.glass) mirror(v, s => { const x = s > 0 ? 5 : -6; for (const dx of [0, 1]) v.set(x + dx, Math.round(hy * 0.62), Math.round(hr * 0.78), mixC(col(x, 5, 7, "head"), 0xf88aa0, 0.35)); });
    }, L.kind);
    at(head, 0, neckY, 0, SC); inner.add(head); rig.head = head;
    /* the eyes and mouth on the face */
    const eyes = [];
    const eY = Math.round(hy + 0.4), eZ = Math.ceil(faceZ(1, hr * 1.06, hy, hr * 0.94, 2.5, eY + 0.5 - hy)) - 0.2;
    for (const s of [-1, 1]) { const e = eyeSet(s > 0 ? "R" : "L", SC, 3, 5, 0x1a1a2a, true); stick(e, s, 3, eY, eZ, 3, SC, 0); head.add(e); eyes.push(e); }
    rig.eyes = eyes;
    const mouth = new THREE.Group();
    const mOpen = part("chao:mouth:open", SC, v => { blk(v, -1, 0, 0, 1, 1, 0, 0x8a2a3a); v.set(0, 0, 0, 0xe86a7a); });
    const mShut = part("chao:mouth:shut", SC, v => { v.set(-1, 1, 0, 0x2a1a2a); v.set(0, 0, 0, 0x2a1a2a); v.set(1, 1, 0, 0x2a1a2a); });
    mOpen.visible = false; mouth.add(mOpen, mShut); stick(mouth, 1, 0, hy * 0.5, Math.round(faceZ(1, hr * 1.06, hy, hr * 0.94, 0.5, hy * 0.5 - hy)), 0, SC, 0); head.add(mouth);
    rig.mouth = { open: mOpen, shut: mShut };
    /* arms */
    const ar = (ch ? 1.9 : 2.2) * (1 + L.power * 0.55), al = (ch ? 4 : 5) * (1 + L.power * 0.35);
    rig.arms = [-1, 1].map(s => {
      const a = part(`${K}:arm${s}`, SC, v => {
        cap(v, 0, 0, 0, s * al, -al * 0.7, 1, ar, ar * 0.85, (x, y, z) => grain(mixC(L.body, L.tip, Math.max(0, Math.min(1, (Math.abs(x) - al * 0.45) / (al * 0.5)))), x, y, z));
        if (L.swim >= 1) ell(v, s * al, -al * 0.7, 1, 1, 2.5, 2.2, L.tip);
      }, L.kind);
      at(a, s * (bw - 0.6), hip + bh - 3, 0.5, SC); inner.add(a); return a;
    });
    /* legs and feet */
    rig.legs = [-1, 1].map(s => {
      const l = part(`${K}:leg${s}`, SC, v => {
        if (hip > 5) cap(v, 0, 0, 0, 0, -hip + 2, 0.5, 2, 1.8, (x, y, z) => grain(L.body, x, y, z));
        ell(v, 0, -hip + 1.6, 1.2, 2.6, 1.8, 3.2, (x, y, z) => grain(mixC(L.body, L.tip, z > 2 ? 0.8 : 0.3), x, y, z));
      }, L.kind);
      at(l, s * legX, hip, 0, SC); inner.add(l); return l;
    });
    /* wings on the back: tiny on most, great on fliers */
    const wk = (ch ? 0.75 : 1) * (1 + L.fly * 1.15);
    rig.wings = [-1, 1].map(s => {
      const w = part(`${K}:wing${s}`, SC, v => {
        const n = Math.round(4 * wk);
        for (let i = 0; i <= n; i++) { const t = i / n; cap(v, 0, 0, 0, s * (2 + t * 5 * wk), 2 + t * 3 * wk - t * t * 4 * wk, -1 - t * 2, 1.2 * (1 - t * 0.4), 0.7, (x, y, z) => grain(mixC(L.tip, L.body, 0.35 + t * 0.2), x, y, z)); }
      }, L.kind);
      at(w, s * 2.2, hip + bh - 3, -bd + 1, SC); inner.add(w); return w;
    });
    /* the tail */
    rig.tail = part(`${K}:tail`, SC, v => {
      if (L.swim >= 0.5 || (L.m.tail === "paddle")) { cap(v, 0, 0, 0, 0, 1.5, -4, 1.6, 1.4, L.body); ell(v, 0, 2, -6.5, 3.6 + L.swim, 1.2, 2.6, (x, y, z) => grain(L.tip, x, y, z)); }
      else cap(v, 0, 0, 0, 0, 2.5, -4.5, 1.6, 1, (x, y, z) => grain(mixC(L.body, L.tip, Math.min(1, -z / 4.5)), x, y, z));
    }, L.kind);
    at(rig.tail, 0, hip + 2, -bd + 0.8, SC); inner.add(rig.tail); rig.tails = [rig.tail];
    /* the ball, floating over the head and lagging behind it as the Chao moves */
    rig.ballY = (neckY + hy * 2 + (L.tipShape === "point" ? 6.5 : 5) + 2.5) * SC;
    rig.ball = new THREE.Group(); rig.ball.position.y = rig.ballY; rig.g.add(rig.ball);
    rig.balls = {};
    const B = rig.balls, bc = L.ballC;
    B.ball = part(`ball:${L.ball}:${bc}`, SC, (v, gl) => {
      if (L.ball === "sphere") ell(v, 0, 0, 0, 2.6, 2.6, 2.6, (x, y, z) => grain(y > 0 && z > 0 ? mixC(bc, 0xffffff, 0.3) : bc, x, y, z));
      else if (L.ball === "halo") { for (let i = 0; i < 28; i++) { const a = i / 28 * PI * 2; gl.set(Math.round(Math.cos(a) * 4.2), 0, Math.round(Math.sin(a) * 4.2), bc); } }
      else if (L.ball === "spike") { ell(v, 0, 0, 0, 2.2, 2.2, 2.2, bc); for (const [x, y, z] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) cap(v, x * 2, y * 2, z * 2, x * 4.5, y * 4.5, z * 4.5, 1.2, 0.5, mulC(bc, 0.8)); }
      else if (L.ball === "leaf") { ell(v, 0, 0, 0, 1.4, 3.6, 2.4, (x, y, z) => grain(x === 0 ? 0x3a8a2a : bc, x, y, z)); }
      else if (L.ball === "gear") { for (let i = 0; i < 24; i++) { const a = i / 24 * PI * 2, r = i % 3 === 0 ? 4.2 : 3.2; v.set(Math.round(Math.cos(a) * r), Math.round(Math.sin(a) * r), 0, 0x9aa4b0); v.set(Math.round(Math.cos(a) * 2.4), Math.round(Math.sin(a) * 2.4), 0, 0x8a949e); } gl.set(0, 0, 0, bc); gl.set(1, 0, 0, bc); gl.set(0, 1, 0, bc); gl.set(-1, 0, 0, bc); gl.set(0, -1, 0, bc); }
    });
    B.heart = part("emote:heart", SC, v => { mirror(v, s => ell(v, s * 1.6, 1, 0, 2, 2, 1.4, 0xf04a7a)); cap(v, 0, 0, 0, 0, -3, 0, 2.6, 0.5, 0xf04a7a); });
    B.exclaim = part("emote:exclaim", SC, v => { blk(v, -1, -1, 0, 0, 4, 0, 0xffd21a); blk(v, -1, -4, 0, 0, -3, 0, 0xffd21a); });
    B.question = part("emote:question", SC, v => { for (const [x, y] of [[-2, 3], [-1, 4], [0, 4], [1, 3], [1, 2], [0, 1], [-1, 0], [-1, -1], [-1, -4]]) blk(v, x, y, 0, x, y, 0, 0x6fe6ff); });
    B.swirl = part("emote:swirl", SC, v => { for (let i = 0; i < 30; i++) { const a = i * 0.5, r = 0.3 + i * 0.13; v.set(Math.round(Math.cos(a) * r), Math.round(Math.sin(a) * r), 0, 0x9a7af0); } });
    B.note = part("emote:note", SC, v => { blk(v, 0, -2, 0, 0, 3, 0, 0x2a2a3a); blk(v, 1, 3, 0, 2, 3, 0, 0x2a2a3a); ell(v, -1, -2.5, 0, 1.6, 1.2, 0.6, 0x2a2a3a); });
    for (const n in B) { B[n].visible = n === "ball"; rig.ball.add(B[n]); }
    if (L.m.ring) { const r = part("chao:ring", SC, (v, gl) => { for (let i = 0; i < 60; i++) { const a = i / 60 * PI * 2; gl.set(Math.round(Math.cos(a) * 15), Math.round(Math.sin(a) * 15), 0, 0xffe070); } }); at(r, 0, neckY + hy, -6, SC); inner.add(r); }
    if (L.m.ribbon) { const r = part("chao:ribbon", SC, (v, gl) => { for (let i = 0; i < 26; i++) gl.set(Math.round(Math.sin(i * 0.4) * 3), Math.round(-i * 0.3), -i, fromHsl(140 + i * 8, 0.7, 0.7)); }); at(r, 0, hip + bh, -bd, SC); inner.add(r); rig.ribbon = r; }
    rig.h = rig.ballY + 0.05; rig.r = (bw + 3) * SC; rig.headY = (neckY + hy) * SC;
    rig.shadow = blob(0.36 * (ch ? 0.8 : 1)); rig.g.add(rig.shadow);
    rig.g.scale.setScalar((c.genes && c.genes.size) || 1);
    return rig;
  }

  /* ---------------------------------------------------------------- animals
     Each species is a body plan built from its size and features: a fox is a quadruped with a
     fox's snout, pointed ears and a brush of a tail; a lion the same plan with a mane and a
     tufted tail. Its colours are its own, shifted a little by its genes. */
  function animalLook(c) {
    const sp = D.species(c.sp), g = c.genes || {}, f = sp.feat || {};
    const dh = (g.tint || 0) * 0.35, dl = (g.tint2 || 0) * 0.5;
    const [m0, s0, b0] = sp.cols;
    return { sp, f, main: shift(m0, dh, dl), second: shift(s0, dh * 0.6, dl * 0.6), belly: shift(b0, dh * 0.4, dl * 0.4), pat: g.pat || "plain", al: g.al || {} };
  }
  /* the body's colour at a voxel: main, belly underneath, and the species' markings */
  function animalCol(L, part) {
    const f = L.f, { main, second, belly } = L;
    const alb = L.al.albino && L.al.albino[0] && L.al.albino[1], mel = L.al.melan && L.al.melan[0] && L.al.melan[1];
    return (x, y, z, ctx) => {
      ctx = ctx || {};
      let c = main;
      if (ctx.belly != null && y < ctx.belly) c = belly;
      if (part === "body" || part === "head" || part === "tail") {
        if (f.spots && hash(x >> 1, y >> 1, z >> 1) < 0.16) c = second;
        if (f.rosettes) { const h = hash(x >> 1, y >> 1, z >> 1); if (h < 0.1) c = second; else if (h < 0.16) c = mixC(main, second, 0.4); }
        if (f.patches && hash(x >> 2, y >> 2, z >> 2) < 0.3) c = second;
        if (f.stripes && part !== "head" && ((z + (y >> 1)) & 3) === 0 && (ctx.belly == null || y >= ctx.belly)) c = second;
        if (f.stripes && part === "head" && y > (ctx.top || 99) - 2 && ((x + z) & 3) === 0) c = second;
        if (f.bands && ((z & 3) < 2)) c = second;
        if (f.stripe === "back" && Math.abs(x) <= 1 && y > (ctx.top || 0) - 3) c = second;
        if (f.saddle && part === "body" && z > -ctx.len * 0.25 && z < ctx.len * 0.2) c = second;
        if (f.dots && hash(x, y, z) < 0.12) c = second;
        if (f.segments && (z & 2)) c = mixC(main, second, 0.4);
      }
      if (L.pat === "spots" && part !== "leg" && hash(x >> 1, (y >> 1) + 9, z >> 1) < 0.09) c = mixC(c, second, 0.6);
      if (L.pat === "stripes" && part === "body" && ((z + y) % 5 === 0)) c = mixC(c, second, 0.5);
      if (L.pat === "two-tone" && part === "body" && ctx.top && y > ctx.top - 3) c = mixC(c, second, 0.5);
      if (L.pat === "socks" && part === "leg" && ctx.low && y < ctx.low) c = mixC(c, 0xf8f8f0, 0.8);
      if (L.pat === "freckles" && part === "head" && hash(x, y, z) < 0.1) c = mixC(c, second, 0.5);
      if (alb) c = mixC(c, 0xf8f4f0, 0.75);
      if (mel) c = mulC(c, 0.35);
      return grain(c, x, y, z, 0.05);
    };
  }
  /* the plans' proportions: body length, height, width, leg length, head size (all voxels;
     the whole animal then scaled to its size) */
  const PLAN = {
    quad: { bl: 16, bh: 8, bw: 8, ll: 7, hr: 4.2, gait: "walk4" },
    woolly: { bl: 15, bh: 10, bw: 10, ll: 5.5, hr: 3.8, gait: "walk4" },
    hopper: { bl: 11, bh: 9, bw: 8, ll: 4, hr: 4.4, gait: "hop" },
    glider: { bl: 12, bh: 6, bw: 7, ll: 4, hr: 3.8, gait: "hop" },
    dragon: { bl: 18, bh: 9, bw: 9, ll: 7, hr: 4.6, gait: "walk4" },
  };
  function buildAnimal(c) {
    const L = animalLook(c), sp = L.sp, f = L.f;
    const S = sp.size / 17;
    const K = `an:${sp.id}:${L.main}:${L.second}:${L.pat}:${(L.al.albino || [])[0]}${(L.al.albino || [])[1]}${(L.al.melan || [])[0]}${(L.al.melan || [])[1]}`;
    const rig = { g: new THREE.Group(), kind: "animal", plan: sp.plan, legs: [], arms: [], wings: [], tails: [], L, S };
    const inner = new THREE.Group(); rig.g.add(inner); rig.inner = inner;
    const B = BUILD[sp.plan] || BUILD.quad;
    B(rig, L, f, S, K, inner);
    rig.shadow = blob(Math.max(0.12, (rig.r || 0.3)));
    rig.g.add(rig.shadow);
    rig.g.scale.setScalar((c.genes && c.genes.size) || 1);
    return rig;
  }
  /* -- the head every plan shares: a round head with eyes, ears, a snout or beak, and extras */
  function headPart(rig, L, f, S, K, hr, opt) {
    opt = opt || {};
    const col = animalCol(L, "head"), main = L.main;
    const head = part(K + ":head:" + (opt.k || ""), S, (v, gl) => {
      const rz = hr * (opt.long || 1);
      ell(v, 0, 0, 0, hr * (opt.wide || 1), hr * 0.92, rz, (x, y, z) => col(x, y, z, { belly: f.mask === "white" ? 99 : -99, top: hr }));
      if (f.mask && f.mask !== "white") paint(v, (x, y, z) => z > hr * 0.2 && Math.abs(y - hr * 0.15) < hr * 0.3 && Math.abs(x) > 1, (x, y, z) => grain(mulC(L.second, 0.8), x, y, z));
      if (f.mask === "white") paint(v, (x, y, z) => z > 0 && y < hr * 0.2, (x, y, z) => grain(0xf8f4ec, x, y, z));
      if (f.eyepatch) mirror(v, s => paint(v, (x, y, z) => ((x - s * hr * 0.42) / (hr * 0.32)) ** 2 + ((y - hr * 0.15) / (hr * 0.38)) ** 2 < 1 && z > 0, (x, y, z) => grain(L.second, x, y, z)));
      if (f["stripe"] === "face") paint(v, (x, y) => Math.abs(x) < hr * 0.22 && y > -hr * 0.2, (x, y, z) => grain(0xf8f8f8, x, y, z));
      if (f.face === "heart") paint(v, (x, y, z) => z > hr * 0.3, (x, y, z) => grain(0xf8f4ec, x, y, z));
      /* the snout or beak */
      const sn = f.snout, bk = f.beak, fz = rz * 0.82;
      if (sn === "fox") cap(v, 0, -hr * 0.2, fz * 0.6, 0, -hr * 0.3, fz + hr * 0.9, hr * 0.5, hr * 0.22, (x, y, z) => col(x, y, z, { belly: -hr * 0.25 }));
      else if (sn === "dog") cap(v, 0, -hr * 0.25, fz * 0.6, 0, -hr * 0.3, fz + hr * 0.6, hr * 0.5, hr * 0.38, (x, y, z) => col(x, y, z, { belly: -hr * 0.3 }));
      else if (sn === "bear") ell(v, 0, -hr * 0.3, fz, hr * 0.42, hr * 0.35, hr * 0.45, (x, y, z) => grain(L.belly, x, y, z));
      else if (sn === "pig") { ell(v, 0, -hr * 0.2, fz + 0.5, hr * 0.42, hr * 0.32, hr * 0.35, (x, y, z) => grain(mixC(main, 0xe86a8a, 0.25), x, y, z)); mirror(v, s => v.set(s > 0 ? 1 : -2, Math.round(-hr * 0.2), Math.round(fz + hr * 0.35 + 0.5), 0x5a2a3a)); }
      else if (sn === "long") cap(v, 0, -hr * 0.2, fz * 0.5, 0, -hr * 0.55, fz + hr * 1.2, hr * 0.55, hr * 0.4, (x, y, z) => col(x, y, z));
      else if (sn === "wide") ell(v, 0, -hr * 0.3, fz, hr * 0.85, hr * 0.5, hr * 0.6, (x, y, z) => grain(mixC(main, 0xd8a8b0, 0.3), x, y, z));
      else if (sn === "point") cap(v, 0, -hr * 0.2, fz * 0.5, 0, -hr * 0.35, fz + hr * 0.9, hr * 0.45, hr * 0.15, (x, y, z) => col(x, y, z));
      else if (sn === "tube") cap(v, 0, -hr * 0.2, fz * 0.5, 0, -hr * 1.2, fz + hr * 2.2, hr * 0.4, hr * 0.18, (x, y, z) => col(x, y, z));
      else if (sn === "trunk" || f.trunk) chain(v, [[0, -hr * 0.1, fz * 0.8], [0, -hr * 0.6, fz + hr * 0.6], [0, -hr * 1.5, fz + hr * 0.8], [0, -hr * 2.3, fz + hr * 0.6]], hr * 0.38, hr * 0.22, (x, y, z) => col(x, y, z));
      if (sn && sn !== "trunk" && sn !== "pig" && !f.trunk) { const tipZ = sn === "fox" || sn === "point" ? fz + hr * 0.9 : sn === "tube" ? fz + hr * 2.2 : fz + hr * 0.6; v.set(0, Math.round(-hr * 0.25), Math.round(tipZ), 0x1a1a1a); v.set(-1, Math.round(-hr * 0.25), Math.round(tipZ), 0x1a1a1a); }
      if (f.nose === "big") ell(v, 0, -hr * 0.05, fz, hr * 0.35, hr * 0.42, hr * 0.3, 0x2a2a2a);
      if (f.bill) ell(v, 0, -hr * 0.25, fz + hr * 0.4, hr * 0.5, hr * 0.18, hr * 0.7, (x, y, z) => grain(sp_bill(L), x, y, z));
      if (bk) {
        const bc = bkCol(L), long = bk === "long" ? 1.6 : bk === "needle" ? 2.2 : bk === "big" ? 1.1 : bk === "toucan" ? 1.9 : bk === "pouch" ? 2.0 : bk === "bent" ? 1.3 : 0.8;
        const r0 = bk === "toucan" ? hr * 0.45 : bk === "big" ? hr * 0.42 : bk === "needle" ? hr * 0.13 : hr * 0.28;
        if (bk === "hook") { cap(v, 0, 0, fz * 0.8, 0, -hr * 0.2, fz + hr * 0.6, hr * 0.32, hr * 0.18, bc); cap(v, 0, -hr * 0.2, fz + hr * 0.6, 0, -hr * 0.55, fz + hr * 0.55, hr * 0.18, hr * 0.1, bc); }
        else if (bk === "bent") chain(v, [[0, -hr * 0.1, fz * 0.8], [0, -hr * 0.2, fz + hr * 0.7], [0, -hr * 0.9, fz + hr * 1.1]], hr * 0.28, hr * 0.12, (x, y, z) => grain(y < -hr * 0.5 ? 0x1a1a1a : bc, x, y, z));
        else if (bk === "puffin") { ell(v, 0, -hr * 0.15, fz + hr * 0.3, hr * 0.22, hr * 0.5, hr * 0.5, (x, y, z) => grain(z > fz + hr * 0.45 ? 0xf08a2a : 0x3a4a6a, x, y, z)); }
        else if (bk === "dolphin") cap(v, 0, -hr * 0.3, fz * 0.7, 0, -hr * 0.4, fz + hr * 0.8, hr * 0.38, hr * 0.28, (x, y, z) => col(x, y, z));
        else if (bk === "toucan") cap(v, 0, -hr * 0.05, fz * 0.7, 0, -hr * 0.3, fz + hr * long, r0, hr * 0.16, (x, y, z) => grain(z > fz + hr * 1.3 ? 0x1a1a1a : mixC(0xf8a020, 0xf8e040, Math.max(0, y / hr + 0.3)), x, y, z));
        else if (bk === "pouch") { cap(v, 0, -hr * 0.05, fz * 0.7, 0, -hr * 0.15, fz + hr * long, hr * 0.22, hr * 0.14, bc); ell(v, 0, -hr * 0.5, fz + hr * 1.1, hr * 0.3, hr * 0.4, hr * 0.8, mixC(bc, 0xf8e0a0, 0.4)); }
        else cap(v, 0, -hr * 0.1, fz * 0.8, 0, -hr * 0.2, fz + hr * long, r0, Math.max(0.5, r0 * 0.35), bc);
      }
      /* ears */
      const ear = f.ears;
      if (ear) mirror(v, s => {
        const ex = s * hr * 0.55, ey = hr * 0.7, c2 = (x, y, z) => col(x, y, z), inC = (x, y, z) => grain(mixC(main, 0xf0a0a8, 0.45), x, y, z);
        if (ear === "point" || ear === "tuft") { cap(v, ex, ey, 0, ex * 1.2, ey + hr * 0.75, -hr * 0.1, hr * 0.32, 0.5, c2); if (ear === "tuft") cap(v, ex * 1.2, ey + hr * 0.75, 0, ex * 1.25, ey + hr * 1.1, 0, 0.6, 0.5, 0x2a2a2a); }
        else if (ear === "round") ell(v, ex * 1.15, ey, -hr * 0.1, hr * 0.32, hr * 0.32, hr * 0.16, c2);
        else if (ear === "big" || ear === "huge") { const k = ear === "huge" ? 1.6 : 1.1; ell(v, ex * 1.3, ey + hr * 0.4 * k, -hr * 0.1, hr * 0.42 * k, hr * 0.62 * k, hr * 0.14, (x, y, z) => z > -hr * 0.05 && Math.abs(x - ex * 1.3) < hr * 0.25 * k ? inC(x, y, z) : c2(x, y, z)); }
        else if (ear === "long" || ear === "lop") {
          if (ear === "long") cap(v, ex * 0.7, ey, -hr * 0.15, ex * 0.9, ey + hr * 1.7, -hr * 0.35, hr * 0.3, hr * 0.24, (x, y, z) => z > -hr * 0.2 && Math.abs(x - ex * 0.8) < hr * 0.15 ? inC(x, y, z) : c2(x, y, z));
          else cap(v, ex * 1.1, ey * 0.8, -hr * 0.1, ex * 1.7, -hr * 0.9, hr * 0.05, hr * 0.3, hr * 0.26, c2);
        }
        else if (ear === "flop") cap(v, ex * 1.2, ey * 0.6, 0, ex * 1.6, -hr * 0.3, hr * 0.2, hr * 0.28, hr * 0.24, (x, y, z) => grain(L.second, x, y, z));
        else if (ear === "tiny") ell(v, ex * 1.1, ey * 0.85, -hr * 0.1, hr * 0.15, hr * 0.15, hr * 0.12, c2);
        else if (ear === "fan") ell(v, s * hr * 1.0, 0, -hr * 0.3, hr * 0.15, hr * 1.0, hr * 0.85, c2);
        else if (ear === "fluffy") ell(v, ex * 1.5, ey * 0.7, -hr * 0.1, hr * 0.48, hr * 0.48, hr * 0.2, (x, y, z) => grain(Math.abs(x) > hr * 0.9 ? 0xf0f0f0 : main, x, y, z));
      });
      /* horns and antlers */
      const hn = f.horns || f.horn;
      if (hn === "nose") { cap(v, 0, -hr * 0.1, rz * 0.9, 0, hr * 0.6, rz * 1.25, hr * 0.32, 0.4, 0xd8d0c0); }
      else if (hn === "spiral") { cap(v, 0, hr * 0.7, rz * 0.3, 0, hr * 2.2, rz * 0.6, hr * 0.22, 0.4, (x, y) => grain((y & 1) ? 0xf8e080 : 0xf8f0c0, x, y, 0)); }
      else if (hn) mirror(v, s => {
        const hc = (x, y, z) => grain(0xd8ccb0, x, y, z);
        if (hn === "curve" || hn === "long") chain(v, [[s * hr * 0.35, hr * 0.7, 0], [s * hr * 0.45, hr * (hn === "long" ? 1.8 : 1.3), -hr * 0.5], [s * hr * 0.4, hr * (hn === "long" ? 2.2 : 1.4), -hr * (hn === "long" ? 1.6 : 1.0)]], hr * 0.2, 0.5, hc);
        else if (hn === "curl") chain(v, [[s * hr * 0.4, hr * 0.7, -hr * 0.1], [s * hr * 0.95, hr * 0.9, -hr * 0.6], [s * hr * 1.1, hr * 0.1, -hr * 0.4], [s * hr * 0.8, -hr * 0.2, hr * 0.2]], hr * 0.28, hr * 0.14, hc);
        else if (hn === "short") cap(v, s * hr * 0.45, hr * 0.65, 0, s * hr * 0.6, hr * 1.05, -hr * 0.1, hr * 0.15, 0.4, hc);
        else if (hn === "wide") chain(v, [[s * hr * 0.4, hr * 0.6, 0], [s * hr * 1.3, hr * 0.7, 0], [s * hr * 1.5, hr * 1.2, hr * 0.1]], hr * 0.22, 0.5, hc);
        else if (hn === "back") cap(v, s * hr * 0.4, hr * 0.6, -hr * 0.2, s * hr * 0.6, hr * 1.2, -hr * 1.4, hr * 0.22, 0.4, hc);
        else if (hn === "antler") { chain(v, [[s * hr * 0.35, hr * 0.7, 0], [s * hr * 0.6, hr * 1.6, -hr * 0.3], [s * hr * 0.4, hr * 2.2, -hr * 0.2]], hr * 0.14, 0.4, 0xf8e8a0); }
        else if (hn === "cephalic") cap(v, s * hr * 0.7, -hr * 0.1, rz * 0.8, s * hr * 0.8, -hr * 0.5, rz * 1.4, hr * 0.2, hr * 0.15, mulC(main, 0.8));
      });
      if (f.antlers) mirror(v, s => {
        const big = f.antlers === "big" ? 1.5 : f.antlers === "palm" ? 1.3 : 1, ac = (x, y, z) => grain(0xa88a6a, x, y, z);
        chain(v, [[s * hr * 0.35, hr * 0.7, -hr * 0.1], [s * hr * 0.9 * big, hr * 1.6 * big, -hr * 0.4], [s * hr * 1.2 * big, hr * 2.4 * big, -hr * 0.6]], hr * 0.16, 0.5, ac);
        cap(v, s * hr * 0.65 * big, hr * 1.25 * big, -hr * 0.3, s * hr * 0.5 * big, hr * 2 * big, hr * 0.2, 0.6, 0.45, ac);
        if (f.antlers === "palm") ell(v, s * hr * 1.3 * big, hr * 2.0 * big, -hr * 0.5, hr * 0.7, hr * 0.5, hr * 0.15, ac);
      });
      if (f.ossicones) mirror(v, s => cap(v, s * hr * 0.3, hr * 0.7, -hr * 0.2, s * hr * 0.35, hr * 1.4, -hr * 0.3, hr * 0.15, hr * 0.18, (x, y, z) => grain(y > hr * 1.2 ? 0x3a2a1a : main, x, y, z)));
      if (f.tusks || f.tusk) { const tl = f.tusks === "big" || f.tusks === "long" ? 1.8 : 1; if (f.tusk === "spiral") cap(v, -1, 0, rz * 0.9, -1, hr * 0.2, rz + hr * 3.5, hr * 0.18, 0.4, (x, y, z) => grain((z & 1) ? 0xf0ead8 : 0xd8d0b8, x, y, z)); else mirror(v, s => cap(v, s * hr * 0.35, -hr * 0.45, rz * 0.8, s * hr * 0.45, f.tusks === "long" ? -hr * 1.6 : -hr * 0.1, rz + hr * 0.5 * tl, hr * 0.13, 0.5, 0xf0ead8)); }
      if (f.mane === "flame") for (let i = 0; i < 10; i++) gl.set(Math.round((hash(i, 2, 1) - 0.5) * 3), Math.round(hr * 0.9 + i * 0.4), Math.round(-i * 0.5), mixC(0xffe060, 0xff6a2a, i / 10));
      if (f.whiskers) mirror(v, s => { for (let i = 0; i < 3; i++) v.set(Math.round(s * (hr * 0.5 + i + 1)), Math.round(-hr * 0.3 + (i - 1) * 0.6), Math.round(rz * 0.9), 0xe8e8e8); });
      if (f.beard) cap(v, 0, -hr * 0.6, rz * 0.6, 0, -hr * 1.3, rz * 0.6, hr * 0.25, hr * 0.15, mixC(main, 0xf8f8f8, 0.4));
      if (f.crest || f.topknot) { const big = f.crest === "big" ? 1.6 : 1; const cc = f.crest === "flame" ? null : L.second; for (let i = 0; i < 4; i++) { if (cc == null) gl.set(0, Math.round(hr + i), Math.round(-i), mixC(0xffd040, 0xff4a1a, i / 4)); else cap(v, 0, hr * 0.8, -i * hr * 0.15, 0, hr * (1.3 + i * 0.12) * big, -hr * (0.3 + i * 0.25) * big, hr * 0.14, 0.5, cc); } }
      if (f.comb) { const big = f.comb === "big" ? 1.4 : 1; for (let i = -1; i <= 1; i++) ell(v, 0, hr * (0.95 + 0.15 * big), i * hr * 0.3 + hr * 0.1, hr * 0.12, hr * 0.32 * big, hr * 0.16, 0xe83a3a); }
      if (f.wattle) ell(v, 0, -hr * 0.8, rz * 0.6, hr * 0.15, hr * 0.4, hr * 0.15, 0xd83a3a);
      if (f.cap) ell(v, 0, hr * 0.7, 0, hr * 0.5, hr * 0.3, hr * 0.5, 0xd83a3a);
      if (f.brow) cap(v, -hr * 0.6, hr * 0.35, rz * 0.75, hr * 0.6, hr * 0.35, rz * 0.75, hr * 0.22, hr * 0.22, mulC(main, 0.8));
      if (f.cheekpads) mirror(v, s => ell(v, s * hr * 0.95, 0, rz * 0.3, hr * 0.35, hr * 0.6, hr * 0.2, mulC(main, 0.85)));
      if (f.cheeks) mirror(v, s => ell(v, s * hr * 0.7, -hr * 0.3, rz * 0.4, hr * 0.42, hr * 0.38, hr * 0.38, (x, y, z) => grain(L.belly, x, y, z)));
      if (f.gills) mirror(v, s => { for (let i = 0; i < 3; i++) cap(v, s * hr * 0.8, hr * 0.2 - i * hr * 0.3, -hr * 0.1, s * hr * 1.5, hr * 0.5 - i * hr * 0.45, -hr * 0.5, hr * 0.12, hr * 0.08, 0xe86a8a); });
      if (f.frill) mirror(v, s => ell(v, s * hr * 1.0, 0, -hr * 0.3, hr * 0.15, hr * 1.2, hr * 0.9, (x, y, z) => grain(mixC(L.second, main, Math.abs(y) / (hr * 1.2)), x, y, z)));
      if (f.hood) mirror(v, s => ell(v, s * hr * 0.9, -hr * 0.6, -hr * 0.5, hr * 0.15, hr * 1.1, hr * 0.7, (x, y, z) => col(x, y, z)));
      if (f.hammer) mirror(v, s => ell(v, s * hr * 1.4, 0, rz * 0.4, hr * 0.9, hr * 0.25, hr * 0.35, (x, y, z) => col(x, y, z)));
      if (f.ruff) ell(v, 0, -hr * 0.8, -hr * 0.2, hr * 1.1, hr * 0.4, hr * 0.9, 0xf8f8f8);
      if (f.head === "white") paint(v, () => true, (x, y, z) => grain(0xf8f8f8, x, y, z));
      if (f.dewlap) ell(v, 0, -hr * 0.9, rz * 0.3, hr * 0.12, hr * 0.5, hr * 0.5, L.second);
      if (f.teeth) { v.set(0, Math.round(-hr * 0.55), Math.round(rz * 0.95), 0xf8f8f0); v.set(-1, Math.round(-hr * 0.55), Math.round(rz * 0.95), 0xf8f8f0); }
      if (f.antennae) mirror(v, s => { const fe = f.antennae === "feather"; chain(v, [[s * hr * 0.3, hr * 0.7, rz * 0.4], [s * hr * 0.7, hr * 1.7, rz * 0.8], [s * hr * 1.1, hr * 2.1, rz * 0.6]], fe ? hr * 0.18 : 0.5, 0.45, mulC(L.second, 0.6)); });
      if (f.eyes === "stalk") mirror(v, s => cap(v, s * hr * 0.4, hr * 0.3, rz * 0.4, s * hr * 0.6, hr * 1.5, rz * 0.6, hr * 0.15, hr * 0.15, main));
      if (f.mandibles) mirror(v, s => chain(v, [[s * hr * 0.4, -hr * 0.2, rz * 0.8], [s * hr * 0.9, -hr * 0.1, rz + hr * 1.1], [s * hr * 0.3, -hr * 0.1, rz + hr * 1.8]], hr * 0.22, hr * 0.12, mulC(main, 0.8)));
      if (f.rivets) for (let i = -1; i <= 1; i++) v.set(i * 2, Math.round(hr * 0.9), 0, 0x5a606a);
      if (f.glow) mirror(v, s => gl.set(Math.round(s * hr * 0.4), Math.round(hr * 0.75), Math.round(rz * 0.6), 0xfff070));
    });
    /* eyes: two small dark ones (big on the night creatures), set into the face */
    const big = f.eyes === "big" ? 1.5 : f.eyes === "huge" ? 2 : 1, ew = Math.max(1, Math.round(hr * 0.3 * big)), eh = Math.max(1, Math.round(hr * 0.36 * big));
    rig.eyes = [];
    for (const s of [-1, 1]) {
      const e = eyeSet(`an:${ew}x${eh}`, S, ew + (ew > 1 ? 0 : 1), eh + 1, f.eyes === "big" || f.eyes === "huge" ? 0x2a1a0a : 0x141414, ew >= 2);
      const ey = hr * (f.eyes === "top" ? 0.75 : 0.25), rz = hr * (opt.long || 1), rx = hr * (opt.wide || 1);
      if (opt.eyeSide) { const ez = Math.round(hr * 0.3), ex = Math.round(faceZ(0, rz, hr * 0.92, rx, ez, ey)); e.position.set(s * ex * S + (s < 0 ? 0 : 0), Math.round(ey) * S, ez * S); e.rotation.y = s * PI / 2; e.scale.z = 0.4; }
      else { const ex = Math.max(1, Math.round(hr * 0.45)), ez = Math.round(faceZ(0, rx, hr * 0.92, rz, ex + 0.5, ey)); stick(e, s, ex, ey, ez, ew + (ew > 1 ? 0 : 1), S, 0.35); }
      head.add(e); rig.eyes.push(e);
    }
    return head;
  }
  const sp_bill = L => L.f.bill && L.sp.plan === "quad" ? 0x3a3a3a : 0xf8a020;
  const bkCol = L => (L.sp.id === "an-crow" || L.sp.id === "an-raven" || L.sp.id === "an-magpie" || L.sp.id === "an-woodpecker" || L.sp.id === "an-heron" ? 0x2a2a2a : L.sp.id === "an-flamingo" ? 0xf0b0b8 : 0xf8b030);

  /* -- tails, wings and legs */
  function tailPart(rig, L, f, S, K, r, at0) {
    const t = f.tail; if (!t && !at0.force) return null;
    const col = animalCol(L, "tail"), sec = (x, y, z) => grain(L.second, x, y, z);
    const g = part(K + ":tail", S, (v, gl) => {
      if (t === "brush") { chain(v, [[0, 0, 0], [0, -r * 0.8, -r * 1.6], [0, -r * 0.6, -r * 3.4]], r * 0.6, r * 0.75, (x, y, z) => z < -r * 2.9 ? grain(0xf8f8f8, x, y, z) : col(x, y, z)); }
      else if (t === "bushy") chain(v, [[0, 0, 0], [0, r * 1.2, -r * 1.2], [0, r * 2.6, -r * 0.8], [0, r * 3.2, r * 0.3]], r * 0.7, r * 0.9, col);
      else if (t === "puff") ell(v, 0, r * 0.2, -r * 0.3, r * 0.7, r * 0.7, r * 0.6, 0xf8f8f8);
      else if (t === "curl") { for (let i = 0; i < 10; i++) { const a = i * 0.7; v.set(0, Math.round(r * 0.6 + Math.sin(a) * r * 0.5), Math.round(-r * 0.4 - Math.cos(a) * r * 0.5 - i * 0.1), mixC(L.main, 0xe86a8a, 0.2)); } }
      else if (t === "stub") ell(v, 0, r * 0.2, -r * 0.2, r * 0.35, r * 0.35, r * 0.4, col);
      else if (t === "tuft") { chain(v, [[0, 0, 0], [0, -r * 1.5, -r * 1.5], [0, -r * 2.2, -r * 3]], r * 0.22, r * 0.18, col); ell(v, 0, -r * 2.3, -r * 3.3, r * 0.45, r * 0.5, r * 0.45, f.mane ? mulC(L.second, 0.9) : 0x2a2a2a); }
      else if (t === "ringed") chain(v, [[0, 0, 0], [0, -r * 0.6, -r * 1.6], [0, -r * 0.2, -r * 3.2]], r * 0.45, r * 0.5, (x, y, z) => ((z >> 1) & 1) ? sec(x, y, z) : col(x, y, z));
      else if (t === "hair") chain(v, [[0, 0, 0], [0, -r * 1.2, -r * 0.8], [0, -r * 2.8, -r * 1.2]], r * 0.45, r * 0.32, (x, y, z) => grain(f.mane === "rainbow" ? fromHsl(-y * 25, 0.7, 0.7) : L.second, x, y, z));
      else if (t === "thick" || t === "paddle" || t === "flat") { if (t === "paddle") ell(v, 0, -r * 0.4, -r * 1.6, r * 0.9, r * 0.25, r * 1.4, 0x3a3a3a); else if (t === "flat") ell(v, 0, -r * 0.1, -r * 1.4, r * 0.8, r * 0.3, r * 1.3, col); else chain(v, [[0, 0, 0], [0, -r * 1.2, -r * 1.8], [0, -r * 2.2, -r * 3.4]], r * 0.7, r * 0.35, col); }
      else if (t === "wag") chain(v, [[0, 0, 0], [0, r * 0.8, -r * 1], [0, r * 1.4, -r * 1.6]], r * 0.3, r * 0.25, col);
      else if (t === "blacktip") { chain(v, [[0, 0, 0], [0, -r * 0.3, -r * 1.6], [0, r * 0.1, -r * 2.6]], r * 0.3, r * 0.32, (x, y, z) => z < -r * 2 ? 0x1a1a1a : col(x, y, z)); }
      else if (t === "bone") { chain(v, [[0, 0, 0], [0, r * 0.8, -r * 1.2], [0, r * 1.4, -r * 1.8]], r * 0.22, r * 0.22, 0xf0f0e8); }
      else if (t === "antenna") { cap(v, 0, 0, 0, 0, r * 2, -r * 1.2, 0.6, 0.6, 0x8a909a); gl.set(0, Math.round(r * 2), Math.round(-r * 1.2), 0xff4040); }
      else if (t === "key") { cap(v, 0, 0, 0, 0, 0, -r * 1.2, 0.7, 0.7, 0xc8a040); ell(v, 0, 0, -r * 1.6, 0.6, r * 0.6, r * 0.5, 0xd8b050); }
      else if (t === "bolt") { for (let i = 0; i < 8; i++) gl.set(0, Math.round(r * 0.3 + ((i & 2) ? i * 0.4 : i * 0.6)), -i, 0x6ac8ff); }
      else if (t === "flame") { for (let i = 0; i < 14; i++) gl.set(Math.round((hash(i, 0, 5) - 0.5) * 3), Math.round(-i * 0.25 + (hash(i, 3, 1) - 0.5) * 2), -i, mixC(0xffe060, 0xff4a1a, i / 14)); }
      else if (t === "fan") { for (let i = -3; i <= 3; i++) cap(v, 0, 0, 0, i * r * 0.9, r * 3.2 - Math.abs(i) * r * 0.25, -r * 1.2, r * 0.25, r * 0.4, (x, y, z) => { const d = Math.hypot(x, y) / (r * 3); return grain(L.sp.id === "an-peacock" ? (d > 0.75 && hash(x >> 1, y >> 1, 0) < 0.5 ? 0x2a7ad8 : d > 0.75 ? 0x3ad07a : 0x3a8a5a) : mixC(L.main, L.second, d), x, y, z); }); }
      else if (t === "fork") mirror(v, s => cap(v, 0, 0, 0, s * r * 0.8, -r * 0.2, -r * 2.6, r * 0.35, 0.5, L.main));
      else if (t === "arch") chain(v, [[0, 0, 0], [0, r * 1.8, -r * 1.0], [0, r * 1.6, -r * 2.4], [0, 0, -r * 2.8]], r * 0.45, r * 0.35, (x, y, z) => grain(mixC(0x1a5a3a, 0x3a8a4a, hash(x, y, z)), x, y, z));
      else if (t === "plumes") { for (let i = -2; i <= 2; i++) chain(v, [[0, 0, 0], [i * r * 0.5, -r * 1, -r * 2], [i * r * 0.8, -r * 2.5, -r * 3]], r * 0.18, r * 0.35, (x, y, z) => grain(i & 1 ? 0xf8e080 : 0xf8c040, x, y, z)); }
      else if (t === "sting") chain(v, [[0, 0, 0], [0, r * 1.2, -r * 1.4], [0, r * 2.6, -r * 0.9], [0, r * 2.8, r * 0.1]], r * 0.4, r * 0.18, (x, y, z) => grain(z > 0 ? 0x1a1a1a : L.main, x, y, z));
      else if (t === "fin") ell(v, 0, r * 0.2, -r * 1.2, r * 0.15, r * 0.8, r * 1.4, (x, y, z) => grain(mixC(L.main, 0xffffff, 0.3), x, y, z));
      else if (t === "thin") chain(v, [[0, 0, 0], [0, -r * 0.4, -r * 1.6], [0, r * 0.2, -r * 3]], r * 0.14, r * 0.1, mixC(L.main, 0xe8a0a8, 0.4));
      else chain(v, [[0, 0, 0], [0, -r * 0.4, -r * 1.6], [0, r * 0.3, -r * 3.0]], r * 0.3, r * 0.22, col);   // long
    });
    at(g, at0[0], at0[1], at0[2], S); rig.inner.add(g); rig.tails.push(g);
    return g;
  }
  /* a feathered, a leathery, a clear or a butterfly's wing, from the shoulder outwards */
  function wingPart(rig, L, f, S, K, s, len, kind, at0, parent) {
    const g = part(`${K}:wing${s}:${kind}`, S, (v, gl) => {
      if (kind === "feather") { for (let i = 0; i < 6; i++) { const t = i / 5; cap(v, 0, 0, -t * len * 0.15, s * len * (0.35 + 0.65 * (1 - t * 0.3)), -len * 0.1 - t * len * 0.15, -len * 0.25 - t * len * 0.55, len * 0.11, len * 0.06, (x, y, z) => grain(t > 0.6 ? L.second : mixC(L.main, L.second, t * 0.6), x, y, z)); } }
      else if (kind === "leather") { for (let i = 0; i < 4; i++) { const t = i / 3; cap(v, 0, 0, 0, s * len * (1 - t * 0.25), len * 0.3 - t * len * 0.6, -t * len * 0.4, 0.6, 0.4, mulC(L.second, 0.85)); }
        shape(v, s > 0 ? 0 : -Math.ceil(len), -Math.ceil(len * 0.4), -Math.ceil(len * 0.5), s > 0 ? Math.ceil(len) : 0, Math.ceil(len * 0.35), 0, (x, y, z) => Math.abs(z + 0.5 + (x * s) * 0.05) < 0.6 && (x * s) > 0 && (x * s) < len * (1 - (y + len * 0.3) / (len * 0.9) * 0.3) && y < len * 0.3 - (x * s) * 0.1 && y > -len * 0.35 + (x * s) * 0.05, (x, y, z) => grain(mixC(L.second, L.main, 0.3), x, y, z)); }
      else if (kind === "clear") { ell(v, s * len * 0.55, 0, 0, len * 0.55, 0.7, len * 0.18, 0xd8f0f8); }
      else if (kind === "butterfly" || kind === "moth") {
        const c1 = L.main, c2 = L.second;
        ell(v, s * len * 0.5, len * 0.25, 0, len * 0.55, len * 0.5, 0.7, (x, y, z) => { const d = Math.hypot(x - s * len * 0.5, y - len * 0.25) / (len * 0.55); return grain(d > 0.8 ? c2 : kind === "moth" ? mixC(c1, c2, d * 0.5) : d < 0.35 && hash(x >> 1, y >> 1, 0) < 0.5 ? 0xf8f8f8 : c1, x, y, z); });
        ell(v, s * len * 0.38, -len * 0.35, 0, len * 0.38, len * 0.34, 0.7, (x, y, z) => grain(Math.hypot(x - s * len * 0.38, y + len * 0.35) / (len * 0.38) > 0.75 ? c2 : c1, x, y, z));
      }
      else if (kind === "mini") ell(v, s * len * 0.3, -len * 0.1, -len * 0.15, len * 0.32, len * 0.12, len * 0.4, (x, y, z) => grain(L.second, x, y, z));
      else if (kind === "flipper") ell(v, s * len * 0.4, -len * 0.3, 0, len * 0.18, len * 0.6, len * 0.3, (x, y, z) => grain(L.main, x, y, z));
    });
    at(g, at0[0], at0[1], at0[2], S); (parent || rig.inner).add(g); rig.wings.push(g); g.userData.s = s;
    return g;
  }
  function legPart(rig, L, S, K, name, x, y, z, len, r, opt) {
    opt = opt || {};
    const col = animalCol(L, "leg");
    const g = part(`${K}:leg:${name}`, S, v => {
      const fx = opt.splay ? x > 0 ? len * 0.6 : -len * 0.6 : 0;
      cap(v, 0, 0, 0, fx, -len + r * 0.5, opt.fwd || 0, r, r * 0.8, (X, Y, Z) => col(X, Y, Z, { low: -len * 0.25 }));
      if (opt.hoof) ell(v, fx, -len + r * 0.5, opt.fwd || 0, r * 0.85, r * 0.6, r * 0.9, (X, Y, Z) => grain(mulC(L.second, 0.6), X, Y, Z));
      else if (opt.paw) ell(v, fx, -len + r * 0.6, (opt.fwd || 0) + r * 0.4, r * 1.0, r * 0.65, r * 1.2, (X, Y, Z) => col(X, Y, Z, { low: -len * 0.25 }));
      else if (opt.talon) { for (const dz of [-1, 0, 1]) cap(v, 0, -len + 0.5, 0, dz * 1.2, -len + 0.5, 1.6 + (dz ? 0 : 0.6), 0.5, 0.4, 0xd8a040); }
      else if (opt.web) ell(v, 0, -len + 0.5, 1.2, r * 1.3, 0.6, r * 1.5, 0xf08a2a);
      if (opt.claws) for (const dx of [-1, 0, 1]) v.set(Math.round(fx + dx), Math.round(-len + r * 0.3), Math.round((opt.fwd || 0) + r * 1.4), 0xe8e0d0);
    });
    at(g, x, y, z, S); rig.inner.add(g); rig.legs.push(g);
    return g;
  }

  const BUILD = {};
  /* the four-legged (most mammals, the dragon): body, neck, head, four legs, a tail */
  BUILD.quad = (rig, L, f, S, K) => {
    const P = Object.assign({}, PLAN[L.sp.plan] || PLAN.quad), sid = L.sp.id;
    if (f.legs === "long") P.ll *= 1.45;
    if (sid.match(/elephant|rhino|hippo|bear|buffalo|bull|moose|camel|giraffe/)) { P.bh *= 1.25; P.bw *= 1.2; }
    if (sid.match(/hippo|pig|boar|warthog|badger|wolverine|armadillo|pangolin|mole|shrew|guineapig|hamster|mouse|skunk|ferret|weasel|stoat|mongoose|hedgehog|porcupine|tapir/)) P.ll *= 0.62;
    if (sid.match(/ferret|weasel|stoat|mongoose|otter|cheetah/)) { P.bl *= 1.15; P.bh *= 0.8; P.bw *= 0.85; }
    if (sid.match(/hamster|guineapig|mouse|hedgehog|shrew|mole/)) { P.bl *= 0.85; P.hr *= 1.1; }
    const col = animalCol(L, "body"), { bl, bh, bw } = P, ll = P.ll, by = ll + bh / 2;
    const body = part(K + ":body", S, (v, gl) => {
      ell(v, 0, 0, 0, bw / 2, bh / 2, bl / 2, (x, y, z) => col(x, y, z, { belly: -bh * 0.18, top: bh / 2, len: bl }));
      if (f.wool) for (let i = 0; i < 26; i++) { const a = hash(i, 1, 1) * PI * 2, b = hash(i, 2, 2) * PI * 0.7; ell(v, Math.cos(a) * Math.sin(b + 0.4) * bw * 0.48, Math.cos(b) * bh * 0.45, Math.sin(a) * bl * 0.42, 2.2, 2.2, 2.2, (x, y, z) => grain(mixC(L.main, 0xffffff, 0.15), x, y, z, 0.08)); }
      if (f.hump) { const n = +f.hump || 1; for (let i = 0; i < n; i++) ell(v, 0, bh * 0.5, n > 1 ? (i ? -bl * 0.18 : bl * 0.15) : 0, bw * 0.28, bh * 0.35, bl * 0.16, (x, y, z) => col(x, y, z)); }
      if (f.quills) { const ql = f.quills === "long" ? 1.6 : 1; for (let i = 0; i < 40; i++) { const a = hash(i, 5, 1) * PI - PI / 2, b = hash(i, 6, 2) * PI * 0.9 + 0.1; const nx = Math.sin(a) * Math.sin(b), ny = Math.cos(b) * 0.3 + 0.7 * Math.sin(b) * Math.cos(a), nz = -Math.cos(b); if (ny < 0) continue; cap(v, nx * bw * 0.45, ny * bh * 0.45, nz * bl * 0.4, nx * bw * (0.45 + 0.3 * ql), ny * bh * (0.45 + 0.45 * ql), nz * bl * 0.4 - 2 * ql, 0.6, 0.4, (x, y, z) => grain(y > bh * 0.75 ? 0xf0e8d8 : L.second, x, y, z)); } }
      if (f.shell === "bands") for (let z = -bl / 2 + 2; z < bl / 2 - 1; z += 2) paint(v, (x, y, zz) => Math.abs(zz - z) < 0.6 && y > -bh * 0.1, (x, y, zz) => grain(mulC(L.second, 0.8), x, y, zz));
      if (f.scales) paint(v, (x, y) => y > -bh * 0.1, (x, y, z) => grain(((x + y + z) & 1) ? L.main : L.second, x, y, z));
      if (f.mane && f.mane !== "short" && f.mane !== "flame") { if (sid.match(/lion/)) ell(v, 0, bh * 0.15, bl * 0.42, bw * 0.75, bh * 0.75, bl * 0.2, (x, y, z) => grain(L.second, x, y, z, 0.1)); else cap(v, 0, bh * 0.45, bl * 0.45, 0, bh * 0.4, -bl * 0.05, 1.4, 1, (x, y, z) => grain(f.mane === "rainbow" ? fromHsl(z * 30, 0.7, 0.7) : L.second, x, y, z)); }
      if (f.mane === "short") cap(v, 0, bh * 0.48, bl * 0.4, 0, bh * 0.45, 0, 1.2, 0.9, (x, y, z) => grain(L.second, x, y, z));
      if (f.spines) for (let z = -bl / 2 + 2; z < bl / 2; z += 2) cap(v, 0, bh * 0.45, z, 0, bh * 0.45 + 2.2, z - 1, 1, 0.4, L.second);
      if (f.scutes) for (let z = -bl / 2 + 1; z < bl / 2; z += 2) mirror(v, s => v.set(s > 0 ? 1 : -2, Math.round(bh * 0.5), z, mulC(L.main, 0.75)));
      if (f.pouch) ell(v, 0, -bh * 0.15, bl * 0.25, bw * 0.3, bh * 0.25, 1.5, L.belly);
      if (f.rivets) for (let z = -bl / 2 + 2; z < bl / 2; z += 3) mirror(v, s => v.set(Math.round(s * bw * 0.5) - (s < 0 ? 1 : 0), 0, z, 0x5a606a));
      if (f.wheel) { for (let a = 0; a < 16; a++) mirror(v, s => v.set(Math.round(s * bw * 0.45), Math.round(-bh * 0.5 + Math.sin(a / 16 * PI * 2) * 2.5), Math.round(Math.cos(a / 16 * PI * 2) * 2.5), 0x2a2a2a)); }
      if (f.bones) for (let z = -bl / 2 + 2; z < bl / 2 - 1; z += 2) paint(v, (x, y, zz) => Math.abs(zz - z) < 0.6 && y > 0, 0xd8d8d0);
      if (f.glow) mirror(v, s => gl.set(Math.round(s * bw * 0.5), 0, 0, 0xfff070));
    });
    at(body, 0, by, 0, S); rig.inner.add(body); rig.body = body;
    /* the neck and head */
    let hx = 0, hy = by + bh * 0.3, hz = bl / 2 + P.hr * 0.4;
    if (f.neck === "long" || f.neck === "tall" || f.neck === "bare") {
      const nl = f.neck === "tall" ? bh * 2.8 : bh * 0.9;
      const neck = part(K + ":neck", S, v => cap(v, 0, 0, 0, 0, nl, bl * 0.12, P.hr * 0.55, P.hr * 0.42, (x, y, z) => col(x, y, z, { belly: -99, top: 99 })));
      at(neck, 0, by + bh * 0.2, bl / 2 - P.hr * 0.6, S); rig.inner.add(neck); rig.neck = neck;
      hy = by + bh * 0.2 + nl; hz = bl / 2 - P.hr * 0.6 + bl * 0.12 + P.hr * 0.3;
    }
    const head = headPart(rig, L, f, S, K, P.hr * (sid.match(/hippo|bear|lion|tiger|panda|elephant/) ? 1.25 : 1), { long: f.snout === "long" ? 1.2 : 1 });
    at(head, hx, hy, hz, S); rig.inner.add(head); rig.head = head;
    /* the legs */
    const lx = bw * 0.3, lz = bl * 0.32, lr = Math.max(1.1, bw * 0.16), hoof = /cow|bull|buffalo|horse|pony|zebra|donkey|deer|fawn|reindeer|moose|elk|goat|ibex|sheep|ram|llama|alpaca|camel|giraffe|okapi|pig|boar|warthog|unicorn|pegasus|kirin|tapir/.test(sid);
    const paw = !hoof, claws = !!f.claws;
    for (const [sx, sz, nm] of [[-1, 1, "fl"], [1, 1, "fr"], [-1, -1, "bl"], [1, -1, "br"]])
      legPart(rig, L, S, K, nm, sx * lx, ll + 0.5, sz * lz, ll + 0.5, lr * (sz < 0 && L.sp.plan === "hopper" ? 1.3 : 1), { hoof, paw, claws });
    /* a tail; wings (pegasus, griffin, dragon) */
    tailPart(rig, L, f, S, K, Math.max(1.6, bw * 0.28), [0, by + bh * 0.2, -bl / 2 + 0.5]);
    if (f.wings) for (const s of [-1, 1]) wingPart(rig, L, f, S, K, s, bl * 0.9, f.wings === "leather" ? "leather" : "feather", [s * bw * 0.35, by + bh * 0.42, bl * 0.15]);
    rig.h = (hy + P.hr * 1.6) * S; rig.r = Math.max(bw, bl * 0.6) * 0.5 * S; rig.headY = hy * S; rig.gait = P.gait; rig.legLen = ll;
  };
  BUILD.woolly = BUILD.quad; BUILD.dragon = BUILD.quad;
  /* hoppers: rabbits, squirrels, kangaroos -- a sitting body, big hind feet, small front paws */
  BUILD.hopper = (rig, L, f, S, K) => {
    const kang = /kangaroo|wallaby/.test(L.sp.id);
    const col = animalCol(L, "body"), bl = kang ? 10 : 10, bh = kang ? 13 : 9, bw = 8, by = kang ? 9 : 6;
    const body = part(K + ":body", S, v => {
      ell(v, 0, 0, 0, bw / 2, bh / 2, bl / 2, (x, y, z) => col(x, y, z, { belly: z > 1 ? 99 : -99, top: bh / 2 }));
      if (f.pouch) ell(v, 0, -bh * 0.15, bl * 0.35, bw * 0.3, bh * 0.25, 1.5, L.belly);
      if (f.stripes) paint(v, (x, y, z) => Math.abs(Math.abs(x) - 1.5) < 0.6 && y > 0, 0x3a2a1a);
    });
    body.rotation.x = kang ? -0.6 : -0.35;
    at(body, 0, by, 0, S); rig.inner.add(body); rig.body = body;
    const head = headPart(rig, L, f, S, K, kang ? 3.8 : 4.6, {});
    at(head, 0, by + bh * 0.55, bl * 0.25, S); rig.inner.add(head); rig.head = head;
    for (const s of [-1, 1]) {
      const hind = part(`${K}:hind${s}`, S, v => { ell(v, 0, 0, 0, 2, kang ? 3.5 : 3, 3.5, (x, y, z) => col(x, y, z)); ell(v, 0, -by + 1.2, 2, 1.6, 1.2, kang ? 5 : 3.6, (x, y, z) => col(x, y, z, { low: 99 })); });
      at(hind, s * bw * 0.4, by - bh * 0.15, -bl * 0.15, S); rig.inner.add(hind); rig.legs.push(hind);
      const front = part(`${K}:front${s}`, S, v => cap(v, 0, 0, 0, 0, -(kang ? 4 : by - 1.2), 1, 1.1, 0.9, (x, y, z) => col(x, y, z, { low: -2 })));
      at(front, s * bw * 0.25, by + bh * (kang ? 0.15 : 0.05), bl * 0.35, S); rig.inner.add(front); rig.arms.push(front);
    }
    tailPart(rig, L, f, S, K, kang ? 2.6 : 2.2, [0, by - bh * 0.25, -bl * 0.45]);
    if (L.sp.plan === "glider") for (const s of [-1, 1]) wingPart(rig, L, f, S, K, s, 7, "mini", [s * bw * 0.4, by, 0]);
    rig.h = (by + bh * 0.55 + 6) * S; rig.r = bl * 0.55 * S; rig.headY = (by + bh * 0.55) * S; rig.gait = "hop";
  };
  BUILD.glider = BUILD.hopper;
  /* the upright: primates, apes, meerkats, koalas -- a biped with arms */
  function biped(rig, L, f, S, K, o) {
    const col = animalCol(L, "body"), bh = o.bh, bw = o.bw, bd = o.bd, by = o.ll + bh / 2;
    const body = part(K + ":body", S, v => ell(v, 0, 0, 0, bw / 2, bh / 2, bd / 2, (x, y, z) => col(x, y, z, { belly: z > 0.5 ? 99 : -99, top: bh / 2 })));
    at(body, 0, by, 0, S); rig.inner.add(body); rig.body = body;
    const head = headPart(rig, L, f, S, K, o.hr, { k: "b" });
    at(head, 0, by + bh / 2 + o.hr * 0.7, bd * 0.1, S); rig.inner.add(head); rig.head = head;
    for (const s of [-1, 1]) {
      const al = o.al || bh * 0.85;
      const arm = part(`${K}:arm${s}`, S, v => { cap(v, 0, 0, 0, s * 1, -al, 1, o.ar || 1.4, (o.ar || 1.4) * 0.85, (x, y, z) => col(x, y, z)); if (f.claws) for (const dx of [-1, 0, 1]) v.set(s + dx, Math.round(-al - 1), 2, 0xe8e0d0); });
      at(arm, s * (bw / 2 + 0.4), by + bh * 0.35, 0, S); rig.inner.add(arm); rig.arms.push(arm);
      legPart(rig, L, S, K, "l" + s, s * bw * 0.28, o.ll + 0.5, 0, o.ll + 0.5, o.lr || 1.5, { paw: true });
    }
    tailPart(rig, L, f, S, K, 2, [0, by - bh * 0.3, -bd / 2]);
    rig.h = (by + bh / 2 + o.hr * 2) * S; rig.r = Math.max(bw, bd) * 0.6 * S; rig.headY = (by + bh / 2 + o.hr) * S; rig.gait = "biped";
  }
  BUILD.primate = (rig, L, f, S, K) => biped(rig, L, f, S, K, { bh: 9, bw: 7, bd: 6, ll: 6, hr: 4.2, al: 8 });
  BUILD.ape = (rig, L, f, S, K) => biped(rig, L, f, S, K, { bh: 12, bw: 11, bd: 8, ll: 6, hr: 4.4, al: f.arms === "long" ? 14 : 11, ar: f.arms === "big" ? 2.4 : 1.8, lr: 2 });
  BUILD.upright = (rig, L, f, S, K) => biped(rig, L, f, S, K, { bh: 11, bw: 6, bd: 5.5, ll: 4, hr: 3.4, al: 4 });
  BUILD.climber = (rig, L, f, S, K) => biped(rig, L, f, S, K, { bh: 11, bw: 9, bd: 8, ll: 4, hr: 4.6, al: 7, ar: 1.6 });
  /* birds: a body tilted by how it stands, a head, a beak, two wings, a tail, two thin legs */
  function bird(rig, L, f, S, K, o) {
    const col = animalCol(L, "body"), bl = o.bl, bh = o.bh, bw = o.bw, ll = o.ll * (f.legs === "long" ? 1.5 : f.legs === "stilt" ? 2.4 : 1), by = ll + bh / 2;
    const body = part(K + ":body", S, v => {
      ell(v, 0, 0, 0, bw / 2, bh / 2, bl / 2, (x, y, z) => col(x, y, z, { belly: o.up ? (z > 1 ? 99 : -99) : -bh * 0.1, top: bh / 2 }));
      if (L.sp.id === "an-flicky" || L.sp.id === "an-wocky") paint(v, (x, y, z) => z > bl * 0.2 && y < bh * 0.2, (x, y, z) => grain(L.belly, x, y, z));
    });
    body.rotation.x = o.up ? -0.08 : -0.25;
    at(body, 0, by, 0, S); rig.inner.add(body); rig.body = body;
    let hy = by + (o.up ? bh * 0.45 : bh * 0.35), hz = o.up ? bl * 0.1 : bl * 0.45;
    if (f.neck === "long" || f.neck === "bare") {
      const nl = o.neck || bh * 1.6;
      const neck = part(K + ":neck", S, v => chain(v, [[0, 0, 0], [0, nl * 0.6, nl * 0.25], [0, nl, nl * 0.1]], o.hr * 0.45, o.hr * 0.35, (x, y, z) => col(x, y, z, { belly: -99, top: 99 })));
      at(neck, 0, hy - 1, hz - 1, S); rig.inner.add(neck); rig.neck = neck;
      hy += nl - 1; hz += nl * 0.1;
    }
    const head = headPart(rig, L, f, S, K, o.hr, { k: "bird", eyeSide: !o.front });
    at(head, 0, hy + o.hr * 0.6, hz, S); rig.inner.add(head); rig.head = head;
    const wl = o.wl * (f.flightless ? 0.55 : 1) * (f.wings === "long" ? 1.5 : 1);
    for (const s of [-1, 1]) wingPart(rig, L, f, S, K, s, wl, o.flipper || f.flippers ? "flipper" : "feather", [s * bw * 0.42, by + bh * 0.25, bl * 0.1]);
    if (f.tail) tailPart(rig, L, f, S, K, Math.max(1.4, bw * 0.25), [0, by - bh * 0.05, -bl * 0.45]);
    else { const tg = part(K + ":wedge", S, v => ell(v, 0, -0.5, -2.5, bw * 0.3, 0.8, 3, (x, y, z) => grain(L.second, x, y, z))); at(tg, 0, by, -bl * 0.42, S); rig.inner.add(tg); rig.tails.push(tg); }
    for (const s of [-1, 1]) legPart(rig, L, S, K, "l" + s, s * bw * 0.22, ll + 0.5, o.up ? 0 : bl * 0.05, ll + 0.5, o.lr || 0.6, { talon: !f.webbed && !o.web, web: o.web });
    rig.h = (hy + o.hr * 2.2) * S; rig.r = Math.max(bl, bw) * 0.55 * S; rig.headY = (hy + o.hr * 0.6) * S; rig.gait = f.flightless ? "biped" : "bird";
  }
  BUILD.bird = (rig, L, f, S, K) => bird(rig, L, f, S, K, { bl: 10, bh: 8, bw: 7, ll: 4, hr: 3.8, wl: 9 });
  BUILD.raptor = (rig, L, f, S, K) => bird(rig, L, f, S, K, { bl: 12, bh: 9, bw: 8, ll: 4, hr: 3.6, wl: 13, lr: 0.9 });
  BUILD.owl = (rig, L, f, S, K) => bird(rig, L, Object.assign({ eyes: "big" }, f), S, K, { bl: 8, bh: 12, bw: 10, ll: 2.5, hr: 4.8, wl: 9, up: true, front: true });
  BUILD.penguin = (rig, L, f, S, K) => bird(rig, L, f, S, K, { bl: 8, bh: 14, bw: 9, ll: 2.5, hr: 3.8, wl: 7, up: true, flipper: true, web: true });
  BUILD.wader = (rig, L, f, S, K) => bird(rig, L, f, S, K, { bl: 11, bh: 8, bw: 7, ll: 5, hr: 3, wl: 11, neck: 12 });
  BUILD.waterfowl = (rig, L, f, S, K) => bird(rig, L, f, S, K, { bl: 13, bh: 8, bw: 9, ll: 2.5, hr: 3.4, wl: 10, web: true, neck: f.neck === "long" ? 12 : 4 });
  BUILD.ratite = (rig, L, f, S, K) => bird(rig, L, Object.assign({ flightless: true }, f), S, K, { bl: 13, bh: 11, bw: 10, ll: f.legs === "long" ? 9 : 4, hr: 3.2, wl: 7, neck: f.neck === "long" ? 14 : 3, lr: 1.2 });
  /* bats: a little furry body, leather wings, big ears */
  BUILD.bat = (rig, L, f, S, K) => {
    const col = animalCol(L, "body"), by = 10;
    const body = part(K + ":body", S, v => ell(v, 0, 0, 0, 3.5, 4.5, 3.5, (x, y, z) => col(x, y, z, { belly: z > 1 ? 99 : -99 })));
    at(body, 0, by, 0, S); rig.inner.add(body); rig.body = body;
    const head = headPart(rig, L, f, S, K, 3.4, {}); at(head, 0, by + 5.5, 0.8, S); rig.inner.add(head); rig.head = head;
    for (const s of [-1, 1]) wingPart(rig, L, f, S, K, s, 12, "leather", [s * 3, by + 2, 0]);
    for (const s of [-1, 1]) legPart(rig, L, S, K, "l" + s, s * 1.5, by - 4, 0, 3, 0.6, {});
    rig.h = (by + 10) * S; rig.r = 6 * S; rig.headY = (by + 5.5) * S; rig.gait = "fly"; rig.hover = 0.9;
  };
  /* seals, otters, sea lions, walruses: a long body that humps along, flippers */
  BUILD.seal = (rig, L, f, S, K) => {
    const col = animalCol(L, "body"), otter = /otter/.test(L.sp.id), bl = otter ? 16 : 18, bh = otter ? 6 : 8, by = otter ? 4.5 : 4.5;
    const body = part(K + ":body", S, v => { ell(v, 0, 0, 0, otter ? 3.2 : 4.5, bh / 2, bl / 2, (x, y, z) => col(x, y, z, { belly: -bh * 0.1 })); ell(v, 0, bh * 0.25, bl * 0.38, otter ? 2.6 : 3.6, bh * 0.4, 3, (x, y, z) => col(x, y, z, { belly: -99 })); });
    at(body, 0, by, 0, S); rig.inner.add(body); rig.body = body;
    const head = headPart(rig, L, f, S, K, otter ? 3.2 : 4, { k: "s" }); at(head, 0, by + bh * 0.55, bl * 0.52, S); rig.inner.add(head); rig.head = head;
    if (otter) { for (const [sx, sz, n] of [[-1, 1, "fl"], [1, 1, "fr"], [-1, -1, "bl"], [1, -1, "br"]]) legPart(rig, L, S, K, n, sx * 2.4, 3.5, sz * bl * 0.3, 3.5, 1.1, { paw: true }); }
    else for (const s of [-1, 1]) { wingPart(rig, L, f, S, K, s, 7, "flipper", [s * 3.8, by, bl * 0.2]); const fl = part(`${K}:rear${s}`, S, v => ell(v, s * 1.5, 0, -2, 1.6, 0.8, 3, mulC(L.main, 0.9))); at(fl, s * 1.2, 1, -bl / 2, S); rig.inner.add(fl); rig.tails.push(fl); }
    if (otter) tailPart(rig, L, Object.assign({}, f, { tail: f.tail || "thick" }), S, K, 2, [0, by - 1, -bl / 2 + 0.5]);
    rig.h = (by + bh + 6) * S; rig.r = bl * 0.45 * S; rig.headY = (by + bh * 0.55) * S; rig.gait = otter ? "walk4" : "hump"; rig.swims = true;
  };
  /* turtles: the shell, a head, four stubby legs */
  BUILD.turtle = (rig, L, f, S, K) => {
    const col = animalCol(L, "body"), sea = /seaturtle/.test(L.sp.id), dome = f.shell === "dome";
    const shell = part(K + ":shell", S, v => {
      ell(v, 0, 0, 0, 7, dome ? 6 : 4.5, 8, (x, y, z) => { const h = hash(x >> 2, 0, z >> 2), edge = y < 0.8; return grain(edge ? L.belly : h < 0.5 ? L.second : mixC(L.second, 0x3a2a1a, 0.25), x, y, z); });
      blk(v, -6, -1, -7, 5, -1, 6, (x, y, z) => ((x + 0.5) / 6.5) ** 2 + ((z + 0.5) / 7.5) ** 2 < 1 ? grain(L.belly, x, y, z) : null);
    });
    at(shell, 0, 3.5, 0, S); rig.inner.add(shell); rig.body = shell;
    const head = headPart(rig, L, f, S, K, 2.6, { k: "t" }); at(head, 0, 4.5, 9.5, S); rig.inner.add(head); rig.head = head;
    if (sea) for (const s of [-1, 1]) wingPart(rig, L, f, S, K, s, 8, "flipper", [s * 6, 3, 4]);
    for (const [sx, sz, n] of [[-1, 1, "fl"], [1, 1, "fr"], [-1, -1, "bl"], [1, -1, "br"]]) if (!sea || sz < 0) legPart(rig, L, S, K, n, sx * 4.5, 3, sz * 5, 3, 1.5, { paw: true });
    tailPart(rig, L, Object.assign({}, f, { tail: "stub" }), S, K, 1.6, [0, 2.5, -8]);
    rig.h = 12 * S; rig.r = 8 * S; rig.headY = 4.5 * S; rig.gait = "walk4"; rig.slow = 0.5; rig.swims = sea;
  };
  /* frogs and toads: a squat body, big eyes on top, folded legs */
  BUILD.frog = (rig, L, f, S, K) => {
    const col = animalCol(L, "body");
    const body = part(K + ":body", S, v => {
      ell(v, 0, 0, 0, 6, 4, 6.5, (x, y, z) => col(x, y, z, { belly: -1 }));
      if (f.warts) for (let i = 0; i < 12; i++) v.set(Math.round((hash(i, 1, 0) - 0.5) * 9), Math.round(2 + hash(i, 2, 0) * 2), Math.round((hash(i, 3, 0) - 0.5) * 10), mulC(L.main, 0.8));
      mirror(v, s => { ell(v, s * 3, 4, 3.5, 2.2, 2.2, 2.2, (x, y, z) => grain(L.main, x, y, z)); });
    });
    body.rotation.x = -0.25; at(body, 0, 4, 0, S); rig.inner.add(body); rig.body = body; rig.head = body;
    rig.eyes = [];
    for (const s of [-1, 1]) { const e = eyeSet("frog", S, 2, 3, 0x141414, true); at(e, s * 3, 4.3, 5.8, S); body.add(e); rig.eyes.push(e); }
    for (const s of [-1, 1]) {
      const hind = part(`${K}:hind${s}`, S, v => { ell(v, 0, 0, 0, 2.5, 2, 4, (x, y, z) => col(x, y, z)); ell(v, s, -2.5, 2.5, 1.8, 0.8, 3, (x, y, z) => grain(L.main, x, y, z)); });
      at(hind, s * 5, 3, -3, S); rig.inner.add(hind); rig.legs.push(hind);
      const fr = part(`${K}:front${s}`, S, v => cap(v, 0, 0, 0, s, -3, 1, 1, 0.8, (x, y, z) => grain(L.main, x, y, z)));
      at(fr, s * 3.5, 3.5, 4, S); rig.inner.add(fr); rig.arms.push(fr);
    }
    rig.h = 10 * S; rig.r = 7 * S; rig.headY = 6 * S; rig.gait = "hop"; rig.swims = true;
  };
  /* lizards, newts, crocodiles: long and low, splayed legs, a long tail */
  BUILD.lizard = (rig, L, f, S, K) => {
    const col = animalCol(L, "body"), croc = L.sp.plan === "croc", bl = croc ? 18 : 12, bw = croc ? 7 : 5, bh = croc ? 5 : 4, by = croc ? 4 : 3;
    const body = part(K + ":body", S, v => {
      ell(v, 0, 0, 0, bw / 2, bh / 2, bl / 2, (x, y, z) => col(x, y, z, { belly: -bh * 0.15, top: bh / 2, len: bl }));
      if (f.spines || f.crest) for (let z = -bl / 2 + 1; z < bl / 2; z += 2) cap(v, 0, bh * 0.4, z, 0, bh * 0.4 + 1.8, z - 0.8, 0.8, 0.4, L.second);
      if (f.scutes) for (let z = -bl / 2 + 1; z < bl / 2; z += 2) mirror(v, s => v.set(s > 0 ? 1 : -2, Math.round(bh * 0.5), z, mulC(L.main, 0.72)));
    });
    at(body, 0, by, 0, S); rig.inner.add(body); rig.body = body;
    const head = headPart(rig, L, Object.assign({}, f, croc ? {} : {}), S, K, croc ? 2.8 : 2.6, { k: "lz", long: croc ? 2.4 : 1.4, wide: f.snout === "wide" ? 1.3 : 1 });
    at(head, 0, by + 0.5, bl / 2 + (croc ? 4 : 2), S); rig.inner.add(head); rig.head = head;
    for (const [sx, sz, n] of [[-1, 1, "fl"], [1, 1, "fr"], [-1, -1, "bl"], [1, -1, "br"]]) legPart(rig, L, S, K, n, sx * bw * 0.45, by, sz * bl * 0.3, by, croc ? 1.4 : 0.9, { splay: true, paw: true });
    const tl = croc ? 16 : f.tail === "curl" ? 8 : 12;
    const tail = part(K + ":ltail", S, v => {
      if (f.tail === "curl") { const pts = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * PI * 1.6; pts.push([0, -1 + Math.sin(a) * 3 * (i / 12), -2 - Math.sin(Math.min(a, PI / 2)) * 4 - (1 - Math.cos(a)) * 0.5]); } chain(v, pts, bw * 0.35, 0.5, col); }
      else chain(v, [[0, 0, 0], [0, -0.5, -tl * 0.5], [0, -1, -tl]], bw * 0.38, 0.5, (x, y, z) => f.tail === "fin" ? grain(y > 0 ? mixC(L.main, L.second, 0.4) : L.main, x, y, z) : col(x, y, z));
      if (f.tail === "fin") ell(v, 0, 1.5, -tl * 0.5, 0.5, 1.8, tl * 0.45, mixC(L.main, 0xffffff, 0.3));
    });
    at(tail, 0, by, -bl / 2 + 1, S); rig.inner.add(tail); rig.tails.push(tail);
    rig.h = (by + 6) * S; rig.r = bl * 0.5 * S; rig.headY = (by + 1) * S; rig.gait = "crawl"; rig.swims = croc;
  };
  BUILD.croc = BUILD.lizard;
  /* snakes: a body in S-curves, the head raised */
  BUILD.snake = (rig, L, f, S, K) => {
    const col = animalCol(L, "body"), n = 9, r = /python/.test(L.sp.id) ? 2.2 : 1.6;
    const segs = [];
    for (let i = 0; i < n; i++) {
      const sg = part(`${K}:seg${i}`, S, v => ell(v, 0, 0, 0, r * (1 - i / n * 0.5), r * (1 - i / n * 0.5), 2.8, (x, y, z) => { let c = col(x, y, z, { belly: -r * 0.4 }); if (f.pattern === "band" && i % 2) c = grain(L.second, x, y, z); if (f.pattern === "blotch" && hash(i, x >> 1, z >> 1) < 0.3) c = grain(L.second, x, y, z); return c; }));
      rig.inner.add(sg); segs.push(sg);
    }
    rig.segs = segs; rig.segR = r;
    const head = headPart(rig, L, f, S, K, 2.4, { k: "sn", long: 1.4 }); rig.inner.add(head); rig.head = head;
    rig.h = 8 * S; rig.r = 8 * S; rig.headY = 5 * S; rig.gait = "slither"; rig.S = S;
  };
  /* fish, dolphins, whales: a body, a tail fin, fins; they live in the water */
  BUILD.fish = (rig, L, f, S, K) => {
    const col = animalCol(L, "body"), big = /dolphin|orca|whale|shark|narwhal|manatee|hammerhead/.test(L.sp.id), bl = big ? 20 : 12, bh = big ? 7 : (f.round ? 9 : 7), bw = big ? 6 : 4.5;
    const body = part(K + ":body", S, (v, gl) => {
      ell(v, 0, 0, 0, bw / 2, bh / 2, bl / 2, (x, y, z) => { let c = col(x, y, z, { belly: -bh * 0.15, top: bh / 2 }); if (f.patch && y > 0 && z > bl * 0.1 && z < bl * 0.3) c = 0xf8f8f8; if (f.bands && (z & 3) === 0) c = 0xf8f8f8; return c; });
      if (f.fin === "back" || f.fin === "tall") cap(v, 0, bh / 2 - 0.5, 0, 0, bh / 2 + (f.fin === "tall" ? 5 : 3), -2.5, 1.8, 0.5, mulC(L.main, 0.9));
      if (f.fin === "fancy" || L.sp.id === "an-angelfish") { ell(v, 0, bh / 2 + 1.5, -1, 0.5, 3, 3, mixC(L.main, L.second, 0.5)); ell(v, 0, -bh / 2 - 1.5, -1, 0.5, 2.5, 2.5, mixC(L.main, L.second, 0.5)); }
      if (f.spines) for (let i = 0; i < 20; i++) { const a = hash(i, 1, 2) * PI * 2, b = hash(i, 2, 3) * PI; cap(v, Math.cos(a) * Math.sin(b) * bw * 0.45, Math.cos(b) * bh * 0.45, Math.sin(a) * Math.sin(b) * bl * 0.45, Math.cos(a) * Math.sin(b) * (bw * 0.45 + 2), Math.cos(b) * (bh * 0.45 + 2), Math.sin(a) * Math.sin(b) * (bl * 0.45 + 2), 0.5, 0.3, L.second); }
      if (f.rivets) for (let z = -bl / 2 + 2; z < bl / 2; z += 3) v.set(0, Math.round(bh / 2), z, 0x5a606a);
      if (f.key) cap(v, 0, bh / 2, -1, 0, bh / 2 + 3, -1, 0.6, 0.6, 0xc8a040);
      if (f.grooves) for (let z = -2; z < bl / 2; z += 2) paint(v, (x, y, zz) => Math.abs(zz - z) < 0.6 && y < -bh * 0.2, 0xd8d8e0);
      if (f.legs === "fish") mirror(v, s => cap(v, s * 1.5, -bh / 2, 0, s * 2, -bh / 2 - 3, 0.5, 0.8, 0.7, 0xf8c040));
    });
    at(body, 0, bh / 2 + 0.5, 0, S); rig.inner.add(body); rig.body = body;
    const head = headPart(rig, L, f, S, K, bh * 0.45, { k: "f", eyeSide: true, long: big ? 1.3 : 1 }); at(head, 0, bh / 2 + 0.5, bl / 2 - 1, S); rig.inner.add(head); rig.head = head;
    const tf = part(K + ":tailfin", S, v => { if (big && !/shark|hammerhead/.test(L.sp.id)) ell(v, 0, 0, -1.5, bl * 0.25, 0.8, 1.6, mulC(L.main, 0.92)); else mirror(v, s => cap(v, 0, 0, 0, 0, s * bh * 0.55, -bh * 0.5, 1, 1.6, (x, y, z) => grain(mixC(L.main, L.second, 0.4), x, y, z))); });
    at(tf, 0, bh / 2 + 0.5, -bl / 2, S); rig.inner.add(tf); rig.tails.push(tf);
    for (const s of [-1, 1]) { const pf = part(`${K}:pfin${s}`, S, v => ell(v, s * 1.5, 0, -1, 1.8, 0.5, 1.4, mixC(L.main, L.second, 0.3))); at(pf, s * bw / 2, bh * 0.3, bl * 0.15, S); rig.inner.add(pf); rig.wings.push(pf); pf.userData.s = s; }
    rig.h = (bh + 2) * S; rig.r = bl * 0.5 * S; rig.headY = bh * 0.5 * S; rig.gait = "swim"; rig.aquatic = true;
  };
  BUILD.ray = (rig, L, f, S, K) => {
    const col = animalCol(L, "body");
    const body = part(K + ":body", S, v => { shape(v, -12, -1, -8, 12, 1, 8, (x, y, z) => Math.abs(x) / 12 + Math.abs(z - 1) / 8 < 1 && Math.abs(y) < 1.2 - Math.abs(x) / 24, (x, y, z) => col(x, y, z, { belly: 0 })); cap(v, 0, 0, -6, 0, 0, -18, 0.8, 0.3, L.main); });
    at(body, 0, 2, 0, S); rig.inner.add(body); rig.body = body;
    const head = headPart(rig, L, f, S, K, 2.5, { k: "r" }); at(head, 0, 2.5, 6, S); rig.inner.add(head); rig.head = head;
    rig.h = 6 * S; rig.r = 12 * S; rig.headY = 2 * S; rig.gait = "swim"; rig.aquatic = true;
  };
  BUILD.seahorse = (rig, L, f, S, K) => {
    const col = animalCol(L, "body");
    const body = part(K + ":body", S, v => { chain(v, [[0, 10, 1], [0, 7, 2], [0, 4, 1.5], [0, 2, -0.5], [0, 1, -2], [0, 2, -3]], 2.6, 0.8, (x, y, z) => col(x, y, z, { belly: z > 1 ? 99 : -99 })); for (let y = 3; y < 11; y += 2) v.set(0, y, -1, L.second); });
    at(body, 0, 2, 0, S); rig.inner.add(body); rig.body = body;
    const head = headPart(rig, L, f, S, K, 2.4, { k: "sh", eyeSide: true }); at(head, 0, 14, 1.5, S); rig.inner.add(head); rig.head = head;
    rig.h = 18 * S; rig.r = 4 * S; rig.headY = 14 * S; rig.gait = "float"; rig.aquatic = true;
  };
  BUILD.octopus = (rig, L, f, S, K) => {
    const col = animalCol(L, "body"), squid = /squid/.test(L.sp.id);
    const body = part(K + ":body", S, v => { ell(v, 0, squid ? 6 : 3, 0, 5, squid ? 8 : 5.5, 5, (x, y, z) => col(x, y, z)); if (squid) mirror(v, s => ell(v, s * 4, 12, 0, 3, 2, 1, L.second)); });
    at(body, 0, 6, 0, S); rig.inner.add(body); rig.body = body; rig.head = body;
    rig.eyes = []; for (const s of [-1, 1]) { const e = eyeSet("oct", S, 2, 3, 0x141414, true); at(e, s * 2.5, 2.5, 4.8, S); body.add(e); rig.eyes.push(e); }
    for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2 + PI / 8; const t = part(`${K}:arm${i}`, S, v => chain(v, [[0, 0, 0], [Math.cos(a) * 4, -3, Math.sin(a) * 4], [Math.cos(a) * 7, -4.5, Math.sin(a) * 7], [Math.cos(a) * 9, -4, Math.sin(a) * 9]], 1.4, 0.5, (x, y, z) => grain(y < -3.5 ? L.second : L.main, x, y, z))); at(t, 0, 5, 0, S); rig.inner.add(t); rig.legs.push(t); }
    rig.h = 18 * S; rig.r = 8 * S; rig.headY = 8 * S; rig.gait = "float"; rig.aquatic = true;
  };
  BUILD.jelly = (rig, L, f, S, K) => {
    const body = part(K + ":body", S, (v, gl) => { shape(v, -7, 0, -7, 7, 6, 7, (x, y, z) => (x * x + z * z) / 49 + (y * y) / 36 <= 1 && y >= 0, (x, y, z) => grain(mixC(L.main, L.second, y / 6), x, y, z)); ell(gl, 0, 2, 0, 2.5, 1.5, 2.5, L.second); }, "glass");
    at(body, 0, 14, 0, S); rig.inner.add(body); rig.body = body; rig.head = body; rig.eyes = [];
    for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; const t = part(`${K}:ten${i}`, S, v => chain(v, [[0, 0, 0], [Math.sin(i) * 1.5, -5, 0], [-Math.sin(i), -10, 0], [0, -13, 0]], 0.6, 0.4, mixC(L.main, 0xffffff, 0.3)), "glass"); at(t, Math.cos(a) * 4, 14, Math.sin(a) * 4, S); rig.inner.add(t); rig.legs.push(t); }
    rig.h = 22 * S; rig.r = 7 * S; rig.headY = 16 * S; rig.gait = "float"; rig.aquatic = true;
  };
  BUILD.crab = (rig, L, f, S, K) => {
    const col = animalCol(L, "body"), lob = /lobster/.test(L.sp.id), scorp = /scorpion/.test(L.sp.id);
    const body = part(K + ":body", S, v => { ell(v, 0, 0, 0, lob || scorp ? 3.5 : 6.5, 2.8, lob || scorp ? 6 : 4.5, (x, y, z) => col(x, y, z, { belly: -1 })); });
    at(body, 0, 4, 0, S); rig.inner.add(body); rig.body = body;
    const head = headPart(rig, L, Object.assign({ eyes: "stalk" }, f), S, K, 2, { k: "c" }); at(head, 0, 5, lob || scorp ? 6 : 4, S); rig.inner.add(head); rig.head = head;
    for (const s of [-1, 1]) {
      const cl = part(`${K}:claw${s}`, S, v => { cap(v, 0, 0, 0, s * 3, 1, 4, 1, 1, L.main); ell(v, s * 4, 1.5, 7, 2.2, 1.6, 3, (x, y, z) => grain(L.main, x, y, z)); ell(v, s * 5.5, 1.5, 9.5, 0.8, 0.8, 1.8, L.second); });
      at(cl, s * (lob || scorp ? 3 : 5), 4.5, 3, S); rig.inner.add(cl); rig.arms.push(cl);
      for (let i = 0; i < 3; i++) legPart(rig, L, S, K, `l${s}${i}`, s * (lob || scorp ? 3 : 5.5), 4, -1.5 + i * 1.8, 4, 0.6, { splay: true });
    }
    if (lob || scorp) tailPart(rig, L, Object.assign({}, f, { tail: scorp ? "sting" : "fan" }), S, K, 2.2, [0, 4, -6]);
    rig.h = 10 * S; rig.r = 7 * S; rig.headY = 5 * S; rig.gait = "crawl"; rig.side = !lob && !scorp; rig.swims = !scorp;
  };
  BUILD.star = (rig, L, f, S, K) => {
    const col = animalCol(L, "body");
    const body = part(K + ":body", S, v => { for (let i = 0; i < 5; i++) { const a = i / 5 * PI * 2; cap(v, 0, 0, 0, Math.cos(a) * 9, 0, Math.sin(a) * 9, 3, 1, (x, y, z) => col(x, y, z)); } });
    at(body, 0, 2, 0, S); rig.inner.add(body); rig.body = body; rig.head = body;
    rig.eyes = []; for (const s of [-1, 1]) { const e = eyeSet("star", S, 1, 2, 0x141414, false); at(e, s * 1.2, 3.5, 1, S); e.rotation.x = -PI / 2.2; body.add(e); rig.eyes.push(e); }
    rig.h = 6 * S; rig.r = 9 * S; rig.headY = 2 * S; rig.gait = "crawl"; rig.slow = 0.3; rig.swims = true;
  };
  /* bugs: a body, six legs, antennae, wings or a shell */
  BUILD.bug = (rig, L, f, S, K) => {
    const col = animalCol(L, "body"), dome = /ladybug|beetle|stag|moto/.test(L.sp.id);
    const body = part(K + ":body", S, (v, gl) => {
      if (dome) ell(v, 0, 0, 0, 5, 3.6, 6, (x, y, z) => { let c = col(x, y, z); if (L.sp.id === "an-ladybug" && x === 0 && y > 0) c = 0x1a1a1a; if (f.sheen || L.sp.id === "an-beetle") c = mixC(c, 0x8ae0a0, hash(x, y, z) * 0.3); return c; });
      else { ell(v, 0, 0, 0, 2.5, 2.5, 3, (x, y, z) => col(x, y, z)); ell(v, 0, -0.5, -5, 3, 3, 4, (x, y, z) => grain(f.bands && ((z & 3) < 2) ? L.second : L.main, x, y, z)); }
      if (f["glow"] === "tail") ell(gl, 0, 0, -7, 2, 2, 2, 0xf8f060);
      if (f.horn) cap(v, 0, 1, 5, 0, 5, 8, 1, 0.5, mulC(L.main, 0.7));
      if (f.wheel) for (let a = 0; a < 16; a++) mirror(v, s => v.set(s * 4, Math.round(-3 + Math.sin(a / 16 * PI * 2) * 2.5), Math.round(Math.cos(a / 16 * PI * 2) * 2.5), 0x2a2a3a));
      if (f.rivets) for (let z = -4; z < 5; z += 3) mirror(v, s => v.set(s * 4, 1, z, 0x5a606a));
    });
    at(body, 0, 4, 0, S); rig.inner.add(body); rig.body = body;
    const head = headPart(rig, L, f, S, K, 2.2, { k: "bug" }); at(head, 0, 4, dome ? 6.5 : 3.8, S); rig.inner.add(head); rig.head = head;
    if (f.wings) for (const s of [-1, 1]) wingPart(rig, L, f, S, K, s, 8, "clear", [s * 1, 6, -1]);
    if (!f.wheel) for (const s of [-1, 1]) for (let i = 0; i < 3; i++) legPart(rig, L, S, K, `l${s}${i}`, s * 2.5, 3, -2 + i * 2, 3, 0.5, { splay: true });
    rig.h = 10 * S; rig.r = 6 * S; rig.headY = 4 * S; rig.gait = f.wings && !dome ? "fly" : "crawl"; rig.hover = f.wings && !dome ? 0.5 : 0;
  };
  BUILD.butterfly = (rig, L, f, S, K) => {
    const col = animalCol(L, "body");
    const body = part(K + ":body", S, v => cap(v, 0, 0, -3, 0, 0, 3, 1.1, 0.9, (x, y, z) => grain(L.belly, x, y, z)));
    at(body, 0, 6, 0, S); rig.inner.add(body); rig.body = body;
    const head = headPart(rig, L, f, S, K, 1.4, { k: "bf" }); at(head, 0, 6, 3.8, S); rig.inner.add(head); rig.head = head;
    for (const s of [-1, 1]) { const w = wingPart(rig, L, f, S, K, s, 10, L.sp.id === "an-moth" ? "moth" : "butterfly", [s * 0.6, 6, 0]); w.rotation.x = -PI / 2.4; }
    rig.h = 12 * S; rig.r = 8 * S; rig.headY = 6 * S; rig.gait = "fly"; rig.hover = 0.7;
  };
  BUILD.snail = (rig, L, f, S, K) => {
    const body = part(K + ":body", S, v => {
      ell(v, 0, 1.5, 1, 2.6, 1.8, 7, (x, y, z) => grain(L.main, x, y, z));
      for (let i = 0; i < 40; i++) { const a = i * 0.32, r = 5.2 - i * 0.11; ell(v, 0, 6 + Math.sin(a) * r * 0.9, -1 + Math.cos(a) * r * 0.9, 2.4, 1.4 + r * 0.18, 1.4 + r * 0.18, (x, y, z) => grain(mixC(L.second, 0x5a3a1a, (i % 8) / 10), x, y, z)); }
    });
    at(body, 0, 0, 0, S); rig.inner.add(body); rig.body = body;
    const head = headPart(rig, L, Object.assign({ eyes: "stalk" }, f), S, K, 1.8, { k: "sn" }); at(head, 0, 3, 7, S); rig.inner.add(head); rig.head = head;
    rig.h = 14 * S; rig.r = 6 * S; rig.headY = 3 * S; rig.gait = "crawl"; rig.slow = 0.25;
  };
  BUILD.worm = (rig, L, f, S, K) => {
    const segs = [];
    for (let i = 0; i < 7; i++) { const sg = part(`${K}:seg${i}`, S, v => { ell(v, 0, 0, 0, 2.4, 2.4, 1.8, (x, y, z) => grain(i % 2 ? L.second : L.main, x, y, z)); }); rig.inner.add(sg); segs.push(sg); }
    rig.segs = segs; rig.segR = 2.4;
    const head = headPart(rig, L, f, S, K, 2.6, { k: "w" }); rig.inner.add(head); rig.head = head;
    rig.h = 8 * S; rig.r = 6 * S; rig.headY = 3 * S; rig.gait = "slither"; rig.slow = 0.35; rig.S = S;
  };
  BUILD.spider = (rig, L, f, S, K) => {
    const body = part(K + ":body", S, v => { ell(v, 0, 0, -3, 4, 3.5, 4.5, (x, y, z) => grain(y > 2 && Math.abs(x) < 2 ? L.second : L.main, x, y, z)); ell(v, 0, -0.5, 2, 2.6, 2.4, 2.6, L.main); });
    at(body, 0, 5, 0, S); rig.inner.add(body); rig.body = body; rig.head = body;
    rig.eyes = []; for (const s of [-1, 1]) { const e = eyeSet("sp", S, 1, 2, 0x141414, false); at(e, s * 1, 5.6, 4.6, S); rig.inner.add(e); rig.eyes.push(e); }
    for (const s of [-1, 1]) for (let i = 0; i < 4; i++) { const g = part(`${K}:sleg${s}${i}`, S, v => chain(v, [[0, 0, 0], [s * 4, 3, (i - 1.5) * 1.5], [s * 7, -4, (i - 1.5) * 2.4]], 0.6, 0.45, mulC(L.main, 0.85))); at(g, s * 1.5, 5, 1 - i * 0.8, S); rig.inner.add(g); rig.legs.push(g); }
    rig.h = 10 * S; rig.r = 7 * S; rig.headY = 5 * S; rig.gait = "crawl";
  };

  /* ---------------------------------------------------------------- the keeper
     Made the way Post Parade makes its trainers: a row of choices, each changing the figure
     at once. An original person, nobody from the games. */
  const SA = 1 / 40;
  const AVATAR = {
    rows: [
      { id: "build", name: "Build", words: ["Slight", "Average", "Sturdy"] },
      { id: "height", name: "Height", words: ["Short", "Medium", "Tall"] },
      { id: "skin", name: "Skin", swatch: [0xfbe0c8, 0xf2c6a0, 0xe0a878, 0xc68a5a, 0x9a6440, 0x6e4428, 0x4a2c18, 0xf8d0b0] },
      { id: "eyes", name: "Eyes", words: ["Round", "Bright", "Sleepy", "Sharp"] },
      { id: "eyeCol", name: "Eye colour", swatch: [0x2a1a10, 0x5a3a1a, 0x2a6ad0, 0x3a9a4a, 0x8a5ad0, 0xd8402a, 0x8a8a92, 0xd8a020] },
      { id: "hair", name: "Hair", words: ["Short", "Spiky", "Swept", "Long", "Ponytail", "Bob", "Curly", "Twin tails", "Bun", "Buzz"] },
      { id: "hairCol", name: "Hair colour", swatch: [0x1a1410, 0x4a2a1a, 0x8a5a2a, 0xd8b060, 0xf0e8d0, 0xc83a2a, 0x3a6ae0, 0x3ab06a, 0xf07ab0, 0x8a5ad0, 0xf8f8f8, 0x6a6a72] },
      { id: "top", name: "Top", words: ["Tee", "Hoodie", "Jacket", "Vest", "Overalls", "Sweater"] },
      { id: "topCol", name: "Top colour", swatch: [0xe42630, 0x1f58e0, 0xffd21a, 0x2fb844, 0xf8f8f8, 0x2a2a34, 0xff8a10, 0x8a5ad0, 0xf07ab0, 0x6fe6ff] },
      { id: "legs", name: "Legs", words: ["Shorts", "Trousers", "Skirt", "Leggings"] },
      { id: "legCol", name: "Legs colour", swatch: [0x2a3a6a, 0x3a3a42, 0x8a6a4a, 0xf8f8f0, 0x2a6a3a, 0xc83a2a, 0x1a1a22, 0xd8c8a0] },
      { id: "shoes", name: "Shoes", words: ["Trainers", "Boots", "Sandals"] },
      { id: "shoeCol", name: "Shoes colour", swatch: [0xe42630, 0xf8f8f8, 0x2a2a34, 0x8a5a2a, 0x1f58e0, 0xffd21a] },
      { id: "hat", name: "Hat", words: ["None", "Cap", "Beanie", "Bandana", "Goggles", "Sun hat", "Flower"] },
      { id: "hatCol", name: "Hat colour", swatch: [0xe42630, 0x1f58e0, 0xffd21a, 0x2fb844, 0xf8f8f8, 0x2a2a34, 0xf07ab0, 0xff8a10] },
      { id: "extra", name: "Extra", words: ["None", "Backpack", "Scarf", "Glasses", "Satchel"] },
    ],
  };
  const avDefault = () => ({ build: 1, height: 1, skin: 1, eyes: 0, eyeCol: 1, hair: 0, hairCol: 1, top: 0, topCol: 1, legs: 1, legCol: 0, shoes: 0, shoeCol: 0, hat: 1, hatCol: 0, extra: 1, name: "" });
  function avRow(id) { return AVATAR.rows.find(r => r.id === id); }
  function avLook(a) {
    const o = Object.assign(avDefault(), a || {});
    const sw = (id) => { const r = avRow(id); return r.swatch[Math.max(0, Math.min(r.swatch.length - 1, o[id] | 0))]; };
    return { o, skin: sw("skin"), eyeC: sw("eyeCol"), hairC: sw("hairCol"), topC: sw("topCol"), legC: sw("legCol"), shoeC: sw("shoeCol"), hatC: sw("hatCol") };
  }
  function buildAvatar(a) {
    const A = avLook(a), o = A.o, K = "av:" + JSON.stringify(o);
    const rig = { g: new THREE.Group(), kind: "avatar", arms: [], legs: [], wings: [], tails: [] };
    const inner = new THREE.Group(); rig.g.add(inner); rig.inner = inner;
    const bw = [5, 6, 7.2][o.build], hk = [0.9, 1, 1.1][o.height];
    const legL = Math.round(22 * hk), torso = Math.round(19 * hk), hr = 7.4;
    const top = o.top, skirt = o.legs === 2;
    /* hips and torso */
    const body = part(K + ":body", SA, (v, gl) => {
      const tc = (x, y, z) => {
        let c = A.topC;
        if (top === 4) c = y < torso * 0.55 || Math.abs(x) < bw * 0.5 && z > 0 && y < torso * 0.8 ? A.legC : 0xf8f8f0;      // overalls over a shirt
        if (top === 2 && z > bw * 0.55 - 1 && Math.abs(x) < 1) c = 0xd8d8d0;                                                 // the jacket's zip
        if (top === 3 && z > 0 && Math.abs(x) < 2) c = 0xf8f8f0;                                                              // a vest over a shirt
        if (top === 5 && (y % 4 === 0)) c = mulC(A.topC, 0.85);                                                               // a knit
        if (top === 1 && y > torso - 4 && z < -1) c = mulC(A.topC, 0.9);                                                      // the hood down
        return grain(c, x, y, z, 0.04);
      };
      sel(v, 0, torso * 0.55, 0, bw, torso * 0.56, bw * 0.66, 3.4, tc);
      sel(v, 0, 1.5, 0, bw * 0.94, 3.6, bw * 0.62, 3, (x, y, z) => grain(A.legC, x, y, z));
      if (skirt) shape(v, -9, -7, -7, 8, 1, 6, (x, y, z) => y < 1 && y > -6 && (x * x + z * z) < (bw * 0.9 + (1 - y) * 0.6) ** 2 * (z > 0 ? 0.55 : 0.55), (x, y, z) => grain((x + 9) % 4 === 0 ? mulC(A.legC, 0.85) : A.legC, x, y, z));
      if (top === 1) ell(v, 0, torso - 1, -bw * 0.55, bw * 0.65, 2.5, 2, (x, y, z) => grain(mulC(A.topC, 0.88), x, y, z));
      if (o.extra === 2) { ell(v, 0, torso + 0.5, 0.5, bw * 0.7, 2, bw * 0.7, (x, y, z) => grain(((x + y) & 3) < 2 ? A.hatC : mixC(A.hatC, 0xffffff, 0.4), x, y, z)); cap(v, bw * 0.4, torso - 1, bw * 0.6, bw * 0.5, torso - 9, bw * 0.7, 1.4, 1.2, A.hatC); }
      if (o.extra === 1) { ell(v, 0, torso * 0.6, -bw * 0.75, bw * 0.75, torso * 0.35, 3, (x, y, z) => grain(A.hatC, x, y, z)); ell(v, 0, torso * 0.45, -bw * 0.75 - 3, bw * 0.5, torso * 0.18, 1, mulC(A.hatC, 0.85)); }
      if (o.extra === 4) { for (let i = 0; i < 16; i++) { const t = i / 15; v.set(Math.round(-bw * 0.8 + t * bw * 1.6), Math.round(torso * 0.95 - t * torso * 0.6), Math.round(bw * 0.62 + 0.5), 0x6a4a2a); } ell(v, bw * 0.9, torso * 0.3, 0, 1.5, 3.5, 3.5, 0x8a5a3a); }
    });
    at(body, 0, legL, 0, SA); inner.add(body); rig.body = body;
    /* head and hair */
    const head = part(K + ":head", SA, (v, gl) => {
      sel(v, 0, hr, 0.5, hr * 0.94, hr, hr * 0.9, 2.6, (x, y, z) => grain(A.skin, x, y, z, 0.03));
      mirror(v, s => ell(v, s * hr * 0.92, hr * 0.95, 0, 1.2, 1.8, 1.2, A.skin));                 // ears
      for (const x of [-1, 0]) v.set(x, Math.round(hr * 0.75), Math.round(hr * 0.9 + 0.5), mulC(A.skin, 0.9));   // a nose
      for (const x of [2, 3, -3, -4]) v.set(x, Math.round(hr * 0.98) + 3, Math.round(hr * 0.9 + 0.5), mulC(A.hairC, 0.9));   // brows
      const H = A.hairC, hc = (x, y, z) => grain(H, x, y, z, 0.06), st = o.hair;
      const cover = (yMin, zMin) => shape(v, -10, Math.floor(yMin), -10, 10, 17, 10, (x, y, z) => (Math.abs(x / (hr * 0.94 + 1)) ** 2.6 + Math.abs((y - hr) / (hr + 1)) ** 2.6 + Math.abs((z - 0.4) / (hr * 0.9 + 1)) ** 2.6 <= 1) && y >= yMin && (z <= zMin || y > hr * 1.55), hc);
      if (st === 9) cover(hr * 1.2, hr * 0.3);
      else if (st !== 7 || true) cover(st === 3 || st === 5 ? hr * 0.35 : hr * 0.75, hr * 0.45);
      if (st === 1) for (let i = 0; i < 9; i++) { const a = (i / 9) * PI * 2; cap(v, Math.cos(a) * 3, hr * 1.7, Math.sin(a) * 3 - 1, Math.cos(a) * 6, hr * 2.25 + (i & 1) * 1.5, Math.sin(a) * 6 - 2, 2, 0.5, hc); }
      if (st === 2) cap(v, -3, hr * 1.8, 4, 6, hr * 1.7, 6, 2.6, 1.2, hc);
      if (st === 3) cap(v, 0, hr * 1.2, -hr * 0.6, 0, -hr * 0.6, -hr * 0.9, hr * 0.8, hr * 0.7, hc);
      if (st === 4) { cap(v, 0, hr * 1.4, -hr * 0.9, 0, hr * 0.2, -hr * 1.6, 2, 1.6, hc); ell(v, 0, hr * 1.4, -hr * 0.9, 1.4, 1.4, 1.4, A.hatC); }
      if (st === 5) mirror(v, s => cap(v, s * hr * 0.85, hr * 1.2, -1, s * hr * 0.9, hr * 0.15, 0.5, 2.6, 2.2, hc));
      if (st === 6) for (let i = 0; i < 26; i++) { const a = hash(i, 1, 4) * PI * 2, b = hash(i, 2, 4) * PI * 0.55; ell(v, Math.cos(a) * Math.sin(b) * (hr + 0.6), hr + Math.cos(b) * (hr + 0.6), Math.sin(a) * Math.sin(b) * (hr + 0.6) - 0.5, 2, 2, 2, hc); }
      if (st === 7) mirror(v, s => { ell(v, s * hr * 0.9, hr * 1.55, -1, 1.6, 1.6, 1.6, A.hatC); cap(v, s * (hr + 1.5), hr * 1.5, -1, s * (hr + 3.5), hr * 0.1, -2, 2.4, 1.6, hc); });
      if (st === 8) ell(v, 0, hr * 2.0, -hr * 0.4, 3.2, 3, 3.2, hc);
      if (st === 0 || st === 2) ell(v, hr * 0.15, hr * 1.55, hr * 0.55, hr * 0.7, 1.5, 2, hc);                   // a fringe
      /* hats */
      const C = A.hatC, cc = (x, y, z) => grain(C, x, y, z, 0.05);
      if (o.hat === 1) { shape(v, -9, Math.floor(hr * 1.35), -9, 9, Math.ceil(hr * 2.2), 9, (x, y, z) => (x * x + (z - 0.4) ** 2) / (hr * 0.94 + 1) ** 2 + ((y - hr * 1.35) / (hr * 0.72)) ** 2 <= 1 && y >= hr * 1.35, cc); ell(v, 0, hr * 1.36, hr * 0.95, hr * 0.62, 0.7, hr * 0.45, mulC(C, 0.85)); v.set(0, Math.round(hr * 2.15), 0, 0xf8f8f8); }
      if (o.hat === 2) { shape(v, -9, Math.floor(hr * 1.2), -9, 9, Math.ceil(hr * 2.3), 9, (x, y, z) => (x * x + (z - 0.4) ** 2) / (hr * 0.94 + 1.1) ** 2 + ((y - hr * 1.2) / (hr * 0.95)) ** 2 <= 1 && y >= hr * 1.2, (x, y, z) => grain(y < hr * 1.45 ? mulC(C, 0.85) : C, x, y, z)); ell(v, 0, hr * 2.3, 0, 2, 2, 2, 0xf8f8f8); }
      if (o.hat === 3) { shape(v, -9, Math.floor(hr * 1.3), -9, 9, Math.ceil(hr * 1.75), 9, (x, y, z) => (x * x + (z - 0.3) ** 2) <= (hr + 1.1) ** 2 && (x * x + (z - 0.3) ** 2) >= (hr - 0.5) ** 2 && y >= hr * 1.3 && y <= hr * 1.7, (x, y, z) => grain(hash(x >> 1, y, z >> 1) < 0.2 ? 0xf8f8f8 : C, x, y, z)); cap(v, 0, hr * 1.5, -hr - 0.5, 2, hr * 0.8, -hr - 2.5, 1.2, 0.8, C); }
      if (o.hat === 4) { shape(v, -10, Math.floor(hr * 1.35), -10, 10, Math.ceil(hr * 1.62), 10, (x, y, z) => (x * x + (z - 0.3) ** 2) <= (hr + 1.1) ** 2 && (x * x + (z - 0.3) ** 2) >= (hr - 0.2) ** 2, 0x3a3a42); mirror(v, s => ell(gl, s * 2.6, hr * 1.5, hr + 0.6, 2, 1.6, 0.8, C)); }
      if (o.hat === 5) { shape(v, -14, Math.floor(hr * 1.4), -14, 14, Math.ceil(hr * 1.6), 14, (x, y, z) => x * x + z * z <= (hr * 1.75) ** 2, cc); ell(v, 0, hr * 1.7, 0, hr * 0.85, hr * 0.55, hr * 0.85, cc); shape(v, -9, Math.floor(hr * 1.6), -9, 9, Math.ceil(hr * 1.75), 9, (x, y, z) => x * x + z * z <= (hr * 0.95) ** 2 && x * x + z * z >= (hr * 0.75) ** 2, 0xf8f8f8); }
      if (o.hat === 6) { for (let i = 0; i < 5; i++) { const a = i / 5 * PI * 2; ell(v, hr * 0.6 + Math.cos(a) * 1.6, hr * 1.55 + Math.sin(a) * 1.6, hr * 0.45, 1.3, 1.3, 1, C); } v.set(Math.round(hr * 0.6), Math.round(hr * 1.55), Math.round(hr * 0.45 + 1), 0xffd21a); }
      if (o.extra === 3) { mirror(v, s => { for (let dx = 0; dx < 4; dx++) { v.set(s * (1 + dx) - (s < 0 ? 1 : 0), Math.round(hr * 1.0) + 1, Math.round(hr * 0.9 + 1.5), 0x2a2a34); v.set(s * (1 + dx) - (s < 0 ? 1 : 0), Math.round(hr * 1.0) - 2, Math.round(hr * 0.9 + 1.5), 0x2a2a34); } for (let dy = -2; dy <= 1; dy++) { v.set(s * 5 - (s < 0 ? 1 : 0), Math.round(hr) + dy, Math.round(hr * 0.9 + 1.5), 0x2a2a34); v.set(s * 1 - (s < 0 ? 1 : 0), Math.round(hr) + dy, Math.round(hr * 0.9 + 1.5), 0x2a2a34); } }); }
    });
    const headY = legL + torso + 0.5;
    at(head, 0, headY, 0, SA); inner.add(head); rig.head = head;
    /* the face */
    const ew = [2, 2, 3, 3][o.eyes], eh = [4, 4, 2, 2][o.eyes];
    rig.eyes = [];
    for (const s of [-1, 1]) { const e = eyeSet(s > 0 ? "R" : "L", SA, ew, eh, A.eyeC, o.eyes !== 3); stick(e, s, 3, hr * 0.98, Math.round(0.5 + hr * 0.9), ew, SA, 0); head.add(e); rig.eyes.push(e); }
    const mouth = part("av:mouth", SA, v => { v.set(-1, 0, 0, 0x7a3a34); v.set(0, 0, 0, 0x7a3a34); });
    stick(mouth, 1, 0, hr * 0.45, Math.round(0.5 + hr * 0.9), 0, SA, 0); head.add(mouth);
    /* arms (sleeves by the top), hands */
    const sleeve = top === 0 || top === 3 || top === 4 ? 0.35 : 0.95;
    rig.arms = [-1, 1].map(s => {
      const g = part(`${K}:arm${s}`, SA, v => {
        const len = torso * 0.92;
        cap(v, 0, 0, 0, s * 1.2, -len, 0.5, 2.3, 2.0, (x, y, z) => grain(-y < len * sleeve ? (top === 4 ? 0xf8f8f0 : A.topC) : A.skin, x, y, z, 0.04));
        ell(v, s * 1.2, -len - 1, 0.5, 2.1, 2.3, 2.1, A.skin);
        if (o.extra === 2 && s > 0) {}
      });
      at(g, s * (bw + 1.6), legL + torso - 2.5, 0, SA); inner.add(g); return g;
    });
    /* legs and shoes */
    rig.legs = [-1, 1].map(s => {
      const g = part(`${K}:leg${s}`, SA, v => {
        const lc = (x, y, z) => { const down = -y; const cov = o.legs === 0 ? 0.42 : o.legs === 2 ? 0.0 : 1; return grain(down < legL * cov ? A.legC : o.legs === 3 ? mulC(A.legC, 0.8) : A.skin, x, y, z, 0.04); };
        cap(v, 0, 0, 0, 0, -legL + 3, 0, 2.8, 2.3, lc);
        const sc = (x, y, z) => grain(o.shoes === 1 && y > -legL + 2 ? A.shoeC : y < -legL + 1.2 ? (o.shoes === 0 ? 0xf8f8f0 : mulC(A.shoeC, 0.7)) : A.shoeC, x, y, z, 0.04);
        if (o.shoes === 2) { blk(v, -2, -legL, -2, 1, -legL, 4, x => grain(A.shoeC, x, 0, 0)); v.set(0, -legL + 1, 2, A.shoeC); v.set(-1, -legL + 1, 2, A.shoeC); }
        else { ell(v, 0, -legL + 1.6, 1.4, 2.7, 2, 4, sc); if (o.shoes === 1) cap(v, 0, -legL + 2, 0, 0, -legL + 7, 0, 2.9, 2.9, sc); }
      });
      at(g, s * bw * 0.48, legL, 0, SA); inner.add(g); return g;
    });
    if (o.extra === 2) { const tail = part(K + ":scarf", SA, v => cap(v, 0, 0, 0, 0, -6, -3, 1.5, 1.2, A.hatC)); at(tail, -bw * 0.4, legL + torso, -bw * 0.6, SA); inner.add(tail); rig.tails.push(tail); }
    rig.h = (headY + hr * 2.4) * SA; rig.r = 0.28; rig.headY = (headY + hr) * SA; rig.gait = "biped"; rig.avatar = true;
    rig.shadow = blob(0.36); rig.g.add(rig.shadow);
    return rig;
  }

  /* ---------------------------------------------------------------- animation
     One animator for every rig: the gait decides how legs, arms, wings and tails move for
     each state (idle, walk, run, sit, sleep, eat, happy, sad, swim, fly, held, dance, cry). */
  function anim(rig, t, dt, st, sp) {
    st = st || "idle"; sp = sp || 0;
    const g = rig.gait || (rig.kind === "chao" ? "chao" : "walk4");
    const moving = st === "walk" || st === "run" || st === "swim" || st === "fly";
    const f = (st === "run" ? 13 : st === "walk" ? 8 : 5) * (rig.slow || 1) * (rig.L && rig.L.f && rig.L.sp && rig.L.sp.size > 1 ? 0.7 : 1);
    rig.ph = (rig.ph || 0) + dt * (moving ? f * Math.max(0.5, Math.min(1.6, sp)) : 2);
    const ph = rig.ph, sw = moving ? Math.sin(ph) : 0, amp = st === "run" ? 0.9 : 0.6;
    const inner = rig.inner;
    inner.position.set(0, 0, 0); inner.rotation.set(0, 0, 0);
    if (rig.body) rig.body.rotation.z = 0;
    /* legs */
    if (g === "walk4" || g === "crawl") rig.legs.forEach((l, i) => { const o = (i === 0 || i === 3) ? 0 : PI; l.rotation.x = moving ? Math.sin(ph + o) * amp * (g === "crawl" ? 0.6 : 0.8) : 0; l.rotation.z = g === "crawl" && moving ? Math.cos(ph + o) * 0.25 : 0; });
    else if (g === "biped" || g === "chao" || g === "chaofly" || g === "bird") rig.legs.forEach((l, i) => { l.rotation.x = moving ? Math.sin(ph + i * PI) * amp : 0; });
    else if (g === "hop") { const hop = moving ? Math.abs(Math.sin(ph * 0.5)) : 0; inner.position.y = hop * (rig.h || 0.3) * 0.35; rig.legs.forEach(l => l.rotation.x = moving ? -Math.cos(ph * 0.5) * 0.6 : 0); }
    else if (g === "float") rig.legs.forEach((l, i) => { l.rotation.x = Math.sin(t * 2 + i) * 0.25; l.rotation.z = Math.cos(t * 2 + i * 1.3) * 0.2; });
    /* arms swing opposite the legs */
    rig.arms.forEach((a, i) => { a.rotation.x = moving && g !== "hop" ? -Math.sin(ph + i * PI) * amp * 0.8 : 0; a.rotation.z = 0; });
    /* wings flap when flying, fold otherwise; fins paddle */
    rig.wings.forEach(w => { const s = w.userData.s || 1; const flap = st === "fly" || g === "fly" ? Math.sin(t * (rig.kind === "chao" ? 14 : 18)) * 0.8 : g === "swim" || st === "swim" ? Math.sin(t * 6) * 0.4 : Math.sin(t * 1.6) * 0.06; w.rotation.z = -s * flap; w.rotation.y = 0; });
    /* tails wag */
    rig.tails.forEach((tl, i) => { tl.rotation.y = Math.sin(t * (st === "happy" ? 12 : g === "swim" ? 7 : 3) + i) * (st === "happy" ? 0.5 : g === "swim" ? 0.45 : 0.18); tl.rotation.x = 0; });
    /* bodies bob; snakes and worms wave; swimmers undulate */
    if (rig.segs) {
      const S = rig.S, n = rig.segs.length, wav = moving ? 1 : 0.35;
      for (let i = 0; i < n; i++) { const z = -i * 4.2, x = Math.sin(ph * 0.7 - i * 0.8) * 3 * wav * (i / n + 0.3); rig.segs[i].position.set(x * S, rig.segR * S, z * S + 6 * S); }
      if (rig.head) { rig.head.position.set(Math.sin(ph * 0.7 + 0.8) * 2 * wav * S, (rig.segR + 3) * S, 10 * S); }
    } else if (moving && g !== "hop") inner.position.y = Math.abs(Math.sin(ph)) * (rig.h || 0.4) * (g === "chao" ? 0.06 : 0.03);
    if (g === "swim" || rig.aquatic) inner.rotation.z = Math.sin(t * 2) * 0.05;
    if (g === "hump" && moving) { inner.position.y = Math.abs(Math.sin(ph * 0.5)) * 0.06; inner.rotation.x = Math.sin(ph * 0.5) * 0.12; }
    if (g === "fly" || rig.hover) inner.position.y = (rig.hover || 0.6) * (rig.h || 0.3) + Math.sin(t * 3) * 0.04;
    if (st === "fly" && rig.kind !== "animal") inner.position.y = 0.25 + Math.sin(t * 3) * 0.04;
    /* the states */
    const head = rig.head;
    if (head && head !== rig.body && !rig.segs) { head.rotation.x = 0; head.rotation.y = 0; head.rotation.z = 0; }
    if (st === "idle" && head && head !== rig.body && !rig.segs) { head.rotation.y = Math.sin(t * 0.7 + (rig.seed || 0)) * 0.25; head.rotation.x = Math.sin(t * 0.5) * 0.05; }
    if (st === "sit") { inner.position.y = -(rig.legLen || 4) * (rig.S || SC) * 0.6; rig.legs.forEach(l => l.rotation.x = -1.2); if (rig.kind === "chao") rig.arms.forEach((a, i) => a.rotation.z = (i ? -1 : 1) * 0.4); }
    if (st === "sleep") { inner.rotation.z = rig.kind === "chao" ? PI / 2.2 : 0; inner.position.y = rig.kind === "chao" ? 0.12 : -(rig.legLen || 3) * (rig.S || SC) * 0.6; if (rig.kind !== "chao") rig.legs.forEach(l => l.rotation.x = -1.3); if (head && head !== rig.body && !rig.segs) head.rotation.x = 0.35; }
    if (st === "eat" && head && head !== rig.body && !rig.segs) { head.rotation.x = 0.3 + Math.abs(Math.sin(t * 9)) * 0.25; rig.arms.forEach((a, i) => { a.rotation.x = -1.3; a.rotation.z = (i ? 1 : -1) * 0.5; }); }
    if (st === "happy") { inner.position.y = Math.abs(Math.sin(t * 9)) * 0.08; rig.arms.forEach((a, i) => a.rotation.z = (i ? -1 : 1) * (1.6 + Math.sin(t * 18) * 0.4)); }
    if (st === "dance") { inner.rotation.y = Math.sin(t * 4) * 0.6; inner.position.y = Math.abs(Math.sin(t * 8)) * 0.05; rig.arms.forEach((a, i) => a.rotation.z = (i ? -1 : 1) * (1 + Math.sin(t * 8 + i * PI) * 0.8)); }
    if (st === "sad" || st === "cry") { if (head && head !== rig.body && !rig.segs) head.rotation.x = 0.35; rig.arms.forEach((a, i) => { a.rotation.x = -0.9 - (st === "cry" ? Math.abs(Math.sin(t * 12)) * 0.4 : 0); a.rotation.z = (i ? 1 : -1) * 0.6; }); }
    if (st === "held") { rig.legs.forEach((l, i) => l.rotation.x = Math.sin(t * 8 + i * PI) * 0.5); rig.arms.forEach((a, i) => a.rotation.z = (i ? -1 : 1) * 0.6); }
    if (st === "carry") { rig.arms.forEach((a, i) => { a.rotation.x = -1.35; a.rotation.z = (i ? 1 : -1) * 0.25; }); }
    if (st === "swim" && rig.kind !== "animal") { inner.rotation.x = 0.9; inner.position.y = 0.05; rig.legs.forEach((l, i) => l.rotation.x = Math.sin(t * 10 + i * PI) * 0.7); rig.arms.forEach((a, i) => a.rotation.x = -2.4 + Math.sin(t * 6 + i * PI) * 0.9); }
    if (st === "train") { inner.position.y = Math.abs(Math.sin(t * 10)) * 0.06; rig.arms.forEach((a, i) => a.rotation.x = -Math.sin(t * 10 + i * PI) * 1.2); }
    /* the Chao's ball: follows the head, springy, and floats */
    if (rig.ball) { const b = rig.ball; const tx = 0, ty = rig.ballY + inner.position.y + Math.sin(t * 2.2) * 0.015; b.userData.vy = (b.userData.vy || 0) * 0.82 + (ty - b.position.y) * 0.3; b.position.y += b.userData.vy; b.position.x += (tx - b.position.x) * 0.2; b.rotation.y += dt * (rig.L && rig.L.ball === "gear" ? 1.5 : 0.8); }
    /* blinking */
    rig.blink = (rig.blink == null ? 2 + Math.random() * 3 : rig.blink) - dt;
    const face = rig.face || (st === "sleep" ? "shut" : st === "happy" || st === "dance" ? "happy" : st === "sad" || st === "cry" ? "sad" : null);
    if (face) setEyes(rig.eyes, face);
    else if (rig.blink < 0) { setEyes(rig.eyes, "shut"); if (rig.blink < -0.12) rig.blink = 2 + Math.random() * 4; }
    else setEyes(rig.eyes, "open");
    if (rig.mouth) { const open = st === "happy" || st === "eat" || st === "cry" || st === "dance"; rig.mouth.open.visible = open; rig.mouth.shut.visible = !open; }
    if (rig.shadow) { rig.shadow.position.y = 0.02 - (inner.position.y > 0 ? 0 : 0); const k = 1 / (1 + Math.max(0, inner.position.y) * 2); rig.shadow.scale.setScalar(k); }
  }
  function emote(rig, k) { if (!rig || !rig.balls) return; for (const n in rig.balls) rig.balls[n].visible = n === (k || "ball"); }

  function creature(c) { const sp = D.species(c.sp); const rig = sp && sp.kind === "animal" ? buildAnimal(c) : buildChao(c); rig.seed = Math.random() * 10; rig.anim = (t, dt, st, spd) => anim(rig, t, dt, st, spd); return rig; }
  function avatar(a) { const rig = buildAvatar(a); rig.anim = (t, dt, st, spd) => anim(rig, t, dt, st, spd); return rig; }

  /* ---------------------------------------------------------------- the garden's things */
  const SP = 1 / 24;
  function prop(kind, o) {
    o = o || {};
    if (kind === "fruit") {
      const f = D.food(o.id) || D.FOODS[0], c = f.c;
      return part("fruit:" + f.id, SP, (v, gl) => {
        if (f.id === "triangle") shape(v, -3, 0, -3, 3, 6, 3, (x, y, z) => Math.abs(x) + Math.abs(z) * 0.6 < 3.2 - y * 0.45 && y < 6, (x, y, z) => grain(c, x, y, z, 0.07));
        else if (f.id === "square") blk(v, -2, 0, -2, 2, 4, 2, (x, y, z) => grain((Math.abs(x) === 2) + (Math.abs(z) === 2) + (y === 0 || y === 4) >= 2 ? mulC(c, 0.85) : c, x, y, z, 0.06));
        else if (f.id === "heart") { mirror(v, s => ell(v, s * 1.4, 3.4, 0, 2, 2, 1.8, c)); cap(v, 0, 3, 0, 0, 0.3, 0, 2.6, 0.6, c); }
        else if (f.id.startsWith("chaosdrive")) { cap(gl, 0, 0.5, 0, 0, 5.5, 0, 1.6, 1.6, c); cap(v, 0, 0, 0, 0, 1, 0, 2, 2, 0x8a909a); cap(v, 0, 5, 0, 0, 6, 0, 2, 2, 0x8a909a); }
        else if (f.id === "nut") ell(v, 0, 2, 0, 2, 2.4, 2, (x, y, z) => grain(y > 3 ? 0x6a4a2a : c, x, y, z, 0.1));
        else if (f.id === "fish") { ell(v, 0, 1.5, 0, 1.2, 1.5, 3.5, (x, y, z) => grain(c, x, y, z)); mirror(v, s => cap(v, 0, 1.5, -3, 0, 1.5 + s * 1.6, -5, 0.6, 0.8, c)); }
        else if (f.id === "candy") { ell(v, 0, 2, 0, 2, 2, 2, (x, y, z) => ((x + y) & 1 ? 0xffffff : c)); mirror(v, s => cap(v, s * 2, 2, 0, s * 4, 2, 0, 0.6, 1.4, c)); }
        else if (f.id === "mushroom") { cap(v, 0, 0, 0, 0, 3, 0, 1, 1, 0xf0e8d8); ell(v, 0, 3.5, 0, 3, 1.8, 3, (x, y, z) => hash(x, y, z) < 0.2 && y > 3 ? 0xffffff : grain(c, x, y, z)); }
        else if (f.id === "berry") { for (const [x, y, z] of [[0, 1.5, 0], [1.5, 1.5, 0.5], [-1, 1.4, 1], [0.4, 3, 0.2]]) ell(v, x, y, z, 1.3, 1.3, 1.3, c); }
        else ell(v, 0, 2.5, 0, 2.6, 2.6, 2.6, (x, y, z) => grain(y > 3 && x < 0 && z > 0 ? mixC(c, 0xffffff, 0.3) : c, x, y, z, 0.06));
        if (!f.id.startsWith("chaosdrive") && f.id !== "fish" && f.id !== "candy" && f.id !== "mushroom" && f.id !== "nut") { cap(v, 0, 4.5, 0, 0, 6.5, 0.5, 0.5, 0.5, 0x6a4a2a); ell(v, 1.2, 6.2, 0.5, 1.2, 0.5, 0.8, 0x4ab040); }
      });
    }
    if (kind === "egg") {
      const look = o.look || [0xf4f0e4, 0x9ad8f8];
      return part(`egg:${look[0]}:${look[1]}:${o.spots || 0}`, SP, v => {
        shape(v, -5, 0, -5, 5, 13, 5, (x, y, z) => { const t = (y - 5.5) / 6.5; const r = 4.4 * (t > 0 ? Math.sqrt(1 - t * t * 0.85) : Math.sqrt(1 - t * t)); return x * x + z * z <= r * r && y >= 0 && y <= 12; }, (x, y, z) => {
          const sp = o.spots || 0; let c = look[0];
          if (sp === 0 && y > 6) c = look[1];
          if (sp === 1 && hash(x >> 1, y >> 1, z >> 1) < 0.22) c = look[1];
          if (sp === 2 && (y % 4) < 1) c = look[1];
          if (sp === 3 && ((x + y + z) & 3) === 0) c = look[1];
          return grain(c, x, y, z, 0.04);
        });
      });
    }
    if (kind === "toy") {
      const t = D.toy(o.id) || D.TOYS[0];
      return part("toy:" + t.id, SP, (v, gl) => {
        if (t.id === "ball") ell(v, 0, 3.5, 0, 3.5, 3.5, 3.5, (x, y, z) => grain(((x >> 1) + (y >> 1)) & 1 ? 0xf8f8f8 : t.c, x, y, z));
        else if (t.id === "duck") { ell(v, 0, 2, 0, 2.6, 2, 3.2, t.c); ell(v, 0, 4.5, 2, 1.8, 1.8, 1.8, t.c); ell(v, 0, 4.2, 4, 1, 0.5, 1, 0xf08a2a); v.set(1, 5, 3, 0x1a1a1a); v.set(-2, 5, 3, 0x1a1a1a); }
        else if (t.id === "trumpet") { cap(v, 0, 2, -4, 0, 2, 2, 0.8, 0.8, t.c); cap(v, 0, 2, 2, 0, 2, 4, 1, 2.6, t.c); }
        else if (t.id === "box") { blk(v, -3, 0, -3, 3, 6, 3, (x, y, z) => grain((x + y + z) & 1 ? t.c : 0xf8e040, x, y, z)); ell(v, 0, 8.5, 0, 2, 2, 2, 0xf05a5a); }
        else if (t.id === "car") { blk(v, -2, 1, -4, 2, 3, 4, t.c); blk(v, -2, 4, -2, 2, 5, 1, 0x9ad8f8); mirror(v, s => { ell(v, s * 2.5, 1, 2.5, 0.8, 1.2, 1.2, 0x2a2a2a); ell(v, s * 2.5, 1, -2.5, 0.8, 1.2, 1.2, 0x2a2a2a); }); }
        else if (t.id === "kite") { shape(v, -5, 0, -1, 5, 12, 0, (x, y, z) => Math.abs(x) / 5 + Math.abs(y - 7) / 5 <= 1, (x, y) => (x > 0) !== (y > 7) ? t.c : 0xf8f8f8); }
      });
    }
    if (kind === "tree") return treeMesh(o);
    if (kind === "flower") {
      const c = o.c || 0xf05a7a;
      return part("flower:" + c + ":" + (o.k || 0), SP, v => {
        cap(v, 0, 0, 0, 0, 7, 0, 0.5, 0.5, 0x4a9a3a);
        ell(v, 1.5, 3, 0, 1.6, 0.6, 0.9, 0x5ab04a);
        if ((o.k || 0) % 2) for (let i = 0; i < 5; i++) { const a = i / 5 * PI * 2; ell(v, Math.cos(a) * 1.8, 8, Math.sin(a) * 1.8, 1.4, 0.8, 1.4, c); }
        else { ell(v, 0, 8.5, 0, 2.2, 1.6, 2.2, c); ell(v, 0, 9.4, 0, 1.2, 1.2, 1.2, mixC(c, 0xffffff, 0.4)); }
        v.set(0, 8, 0, 0xf8d040);
      });
    }
    if (kind === "rock") { const s = o.s || 1, c = o.c || 0x8a8a92; return part("rock:" + s + ":" + c + ":" + (o.k || 0), SP, v => { ell(v, 0, 3 * s, 0, 6 * s, 4 * s, 5 * s, (x, y, z) => grain(y < s ? mulC(c, 0.8) : hash(x, y, z) < 0.08 ? 0x6a9a4a : c, x, y, z, 0.08)); ell(v, 3 * s, 2 * s, 2 * s, 3.5 * s, 2.5 * s, 3 * s, (x, y, z) => grain(c, x, y, z, 0.08)); }); }
    return new THREE.Group();
  }
  /* trees by kind: the round garden fruit tree (with fruit on it, picked one by one), a palm,
     a pine, a great forest oak, a mushroom */
  function treeMesh(o) {
    const k = o.k || "fruit", s = o.s || 1, seed = o.seed || 1, H = Math.round(26 * s);
    const g = part(`tree:${k}:${s}:${seed % 5}:${o.c || 0}`, SP * 2, (v, gl) => {
      const trunk = (x, y, z) => grain(((y + (x & 1)) % 3 === 0) ? 0x6a4a2a : 0x7a5a32, x, y, z, 0.06);
      if (k === "palm") {
        const pts = []; for (let i = 0; i <= 8; i++) pts.push([Math.sin(i * 0.25 + seed) * i * 0.35, i * H / 8, 0]);
        chain(v, pts, 1.8, 1.2, (x, y, z) => grain(y % 3 ? 0xa8804a : 0x8a6a3a, x, y, z)); const top = pts[8];
        for (let i = 0; i < 7; i++) { const a = i / 7 * PI * 2; chain(v, [top, [top[0] + Math.cos(a) * 6, top[1] + 2, top[2] + Math.sin(a) * 6], [top[0] + Math.cos(a) * 11, top[1] - 3, top[2] + Math.sin(a) * 11]], 1.4, 0.6, (x, y, z) => grain(0x3aa040, x, y, z, 0.12)); }
        for (const a of [0.5, 2.6, 4.6]) ell(v, top[0] + Math.cos(a) * 1.6, top[1] - 1.5, top[2] + Math.sin(a) * 1.6, 1.3, 1.3, 1.3, 0x6a4a22);
      } else if (k === "pine") {
        cap(v, 0, 0, 0, 0, H * 0.4, 0, 1.6, 1.2, trunk);
        for (let i = 0; i < 4; i++) { const y = H * 0.3 + i * H * 0.18, r = 8 * s * (1 - i * 0.2); shape(v, -Math.ceil(r), Math.floor(y), -Math.ceil(r), Math.ceil(r), Math.ceil(y + r * 1.1), Math.ceil(r), (x, yy, z) => Math.hypot(x, z) <= r * (1 - (yy - y) / (r * 1.1)) && yy >= y, (x, yy, z) => grain(o.snow && yy > y + r * 0.6 ? 0xf0f4f8 : mixC(0x2a6a3a, 0x3a8a4a, hash(x, yy, z)), x, yy, z, 0.08)); }
      } else if (k === "mushroom") {
        cap(v, 0, 0, 0, 0, H * 0.55, 0, 2.6, 2, (x, y, z) => grain(0xf0e8d8, x, y, z));
        ell(v, 0, H * 0.6, 0, 10 * s, 5 * s, 10 * s, (x, y, z) => y < H * 0.6 - 1 ? grain(0xe8d8c0, x, y, z) : hash(x >> 1, y >> 1, z >> 1) < 0.15 ? 0xffffff : grain(o.c || 0xd83a3a, x, y, z));
      } else if (k === "oak") {
        chain(v, [[0, 0, 0], [0.5, H * 0.3, 0], [-0.5, H * 0.55, 0.5]], 3.2 * s, 2.2 * s, trunk);
        for (let i = 0; i < 4; i++) { const a = i * 1.7 + seed; cap(v, 0, H * 0.45, 0, Math.cos(a) * 6 * s, H * 0.6, Math.sin(a) * 6 * s, 1.4, 0.8, trunk); }
        for (let i = 0; i < 9; i++) { const a = hash(i, seed, 1) * PI * 2, r = hash(i, seed, 2) * 6 * s; ell(v, Math.cos(a) * r, H * 0.72 + hash(i, seed, 3) * 6 * s, Math.sin(a) * r, 6.5 * s, 5 * s, 6.5 * s, (x, y, z) => grain(mixC(0x2a7a34, 0x4aa04a, hash(x >> 1, y >> 1, z >> 1)), x, y, z, 0.1)); }
      } else {
        chain(v, [[0, 0, 0], [0.5, H * 0.35, 0], [0, H * 0.5, 0]], 2.2 * s, 1.6 * s, trunk);
        for (let i = 0; i < 6; i++) { const a = hash(i, seed, 1) * PI * 2, r = hash(i, seed, 2) * 4 * s; ell(v, Math.cos(a) * r, H * 0.62 + hash(i, seed, 3) * 4 * s, Math.sin(a) * r, 5.5 * s, 4.5 * s, 5.5 * s, (x, y, z) => grain(mixC(0x3a9a3a, 0x5ac04a, hash(x >> 1, y >> 1, z >> 1)), x, y, z, 0.1)); }
      }
    });
    return g;
  }
  /* where a fruit tree's fruit hang (for the garden to put fruit there), in metres */
  function fruitSpots(s) {
    const H = 26 * s * SP * 2, out = [];
    for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2 + 0.3; out.push([Math.cos(a) * 0.42 * s, H * 0.55 + (i % 2) * 0.14 * s, Math.sin(a) * 0.42 * s]); }
    return out;
  }

  root.ChaoModels = { ok: true, creature, avatar, prop, emote, setEyes, blob, AVATAR, avDefault, avLook, fruitSpots, mat, shift, hash, grain, Vox, meshVox, mixC, mulC, part, ell, sel, cap, blk, shape, chain };
})(typeof globalThis !== "undefined" ? globalThis : this);
