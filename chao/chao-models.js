/*
 * Red Ring Circuit: the Chao Garden's voxel models, drawn the way Post Parade draws its own:
 * hand-placed blocks on a chunky grain (a sixteenth of a metre, about, as Post Parade's
 * racers and furniture are), every face a few pixels -- eyes of two or three voxels with a
 * lid and a glint, a blush, a two-voxel mouth -- flat colours shaded by pattern rather than
 * noise, rounded only by cutting the corners off a box, then meshed with baked ambient
 * occlusion (voxkit, the mesher Post Parade's race uses) and lit by one shadowing sun.
 *
 * The keeper is Post Parade's own trainer figure: the same parts, the same choices (man or
 * woman, skin, cut, hair colour, eyes, attire, its colour, bottoms, glasses), the same rig.
 *
 *   ChaoModels.creature(c)    a Chao or an animal: { g, parts..., anim(t, dt, state, speed), h }
 *   ChaoModels.avatar(look)   the keeper (or anyone else made the trainer's way)
 *   ChaoModels.prop(kind, o)  fruit, eggs, toys, trees, flowers, rocks
 *   ChaoModels.AVATAR         the creator's rows (Post Parade's)
 */
(function (root) {
  "use strict";
  const THREE = root.THREE, KIT = root.Voxel && root.Voxel.kit, D = root.ChaoData;
  if (!THREE || !KIT) { root.ChaoModels = { ok: false }; return; }
  const { Vox, meshVox, mulC, mixC } = KIT;
  const PI = Math.PI;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

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
  /* a little shade per voxel, so a surface reads as blocks (Post Parade's `jit`) */
  const grain = (c, x, y, z, a) => mulC(c, 1 - (a || 0.04) + hash(x, y, z) * (a || 0.04) * 2);
  /* Post Parade's hair: a darker voxel and a lighter one in a repeating pattern */
  function patShade(c) {
    const c2 = mulC(c, 0.82), cl = mixC(c, 0xffffff, 0.14);
    return (x, y, z) => (((x * 7 + z * 3 + y * 5) % 6 + 6) % 6 === 0) ? c2 : (((x + y * 2 + z) % 5 + 5) % 5 === 0 ? cl : c);
  }

  /* ---------------------------------------------------------------- voxel drawing
     Boxes are inclusive, Post Parade's way: box(-4, 0, -4, 3, 7, 3) is eight wide, centred. */
  function bx(v, x0, y0, z0, x1, y1, z1, col) {
    x0 = Math.round(x0); y0 = Math.round(y0); z0 = Math.round(z0); x1 = Math.round(x1); y1 = Math.round(y1); z1 = Math.round(z1);
    const f = typeof col === "function";
    for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) for (let z = Math.min(z0, z1); z <= Math.max(z0, z1); z++) {
      const c = f ? col(x, y, z) : col; if (c != null) v.set(x, y, z, c);
    }
  }
  const blk = bx;
  /* a box with its corners (cut 3) or its edges too (cut 2) taken off: the pixel-art round */
  function rbx(v, x0, y0, z0, x1, y1, z1, col, cut) {
    cut = cut || 3;
    bx(v, x0, y0, z0, x1, y1, z1, (x, y, z) => {
      const ex = (x === x0 || x === x1 ? 1 : 0) + (y === y0 || y === y1 ? 1 : 0) + (z === z0 || z === z1 ? 1 : 0);
      if (ex >= cut && (x1 - x0) > 0 && (y1 - y0) > 0 && (z1 - z0) > 0) return null;
      return typeof col === "function" ? col(x, y, z) : col;
    });
  }
  /* a line of voxels from a to b (and t voxels thick round it) */
  function line(v, ax, ay, az, bx_, by, bz, col, t) {
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(bx_ - ax), Math.abs(by - ay), Math.abs(bz - az))));
    for (let i = 0; i <= n; i++) {
      const x = Math.round(ax + (bx_ - ax) * i / n), y = Math.round(ay + (by - ay) * i / n), z = Math.round(az + (bz - az) * i / n);
      const c = typeof col === "function" ? col(x, y, z, i / n) : col;
      v.set(x, y, z, c);
      if (t) { v.set(x - 1, y, z, c); v.set(x, y, z - 1, c); v.set(x - 1, y, z - 1, c); }
    }
  }
  /* mirror a column across the middle: x on the right is -1 - x on the left */
  const mx = (s, x) => s > 0 ? x : -1 - x;
  /* the general shapes (the land, the arena) */
  function shape(v, x0, y0, z0, x1, y1, z1, inside, col) {
    x0 = Math.floor(x0); y0 = Math.floor(y0); z0 = Math.floor(z0); x1 = Math.ceil(x1); y1 = Math.ceil(y1); z1 = Math.ceil(z1);
    /* (a cell past the box counts as outside: a test that ignores height, say, still has a top) */
    const inn = (X, Y, Z) => X > x0 && X < x1 + 1 && Y > y0 && Y < y1 + 1 && Z > z0 && Z < z1 + 1 && inside(X, Y, Z);
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) {
      const X = x + 0.5, Y = y + 0.5, Z = z + 0.5;
      if (!inside(X, Y, Z)) continue;
      if (inn(X + 1, Y, Z) && inn(X - 1, Y, Z) && inn(X, Y + 1, Z) && inn(X, Y - 1, Z) && inn(X, Y, Z + 1) && inn(X, Y, Z - 1)) continue;
      const c = typeof col === "function" ? col(x, y, z) : col;
      if (c != null) v.set(x, y, z, c);
    }
  }
  function ell(v, cx, cy, cz, rx, ry, rz, col) {
    rx = Math.max(0.6, rx); ry = Math.max(0.6, ry); rz = Math.max(0.6, rz);
    shape(v, cx - rx - 1, cy - ry - 1, cz - rz - 1, cx + rx, cy + ry, cz + rz, (x, y, z) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 <= 1, col);
  }
  function sel(v, cx, cy, cz, rx, ry, rz, p, col) {
    shape(v, cx - rx - 1, cy - ry - 1, cz - rz - 1, cx + rx, cy + ry, cz + rz, (x, y, z) => Math.abs((x - cx) / rx) ** p + Math.abs((y - cy) / ry) ** p + Math.abs((z - cz) / rz) ** p <= 1, col);
  }
  function cap(v, ax, ay, az, bX, by, bz, r0, r1, col) {
    const dx = bX - ax, dy = by - ay, dz = bz - az, L2 = dx * dx + dy * dy + dz * dz || 1e-6, R = Math.max(r0, r1);
    shape(v, Math.min(ax, bX) - R - 1, Math.min(ay, by) - R - 1, Math.min(az, bz) - R - 1, Math.max(ax, bX) + R, Math.max(ay, by) + R, Math.max(az, bz) + R, (x, y, z) => {
      let t = ((x - ax) * dx + (y - ay) * dy + (z - az) * dz) / L2; t = t < 0 ? 0 : t > 1 ? 1 : t;
      const px = ax + dx * t - x, py = ay + dy * t - y, pz = az + dz * t - z, r = r0 + (r1 - r0) * t;
      return px * px + py * py + pz * pz <= r * r;
    }, col);
  }
  function chain(v, pts, r0, r1, col) { for (let i = 0; i < pts.length - 1; i++) cap(v, ...pts[i], ...pts[i + 1], r0 + (r1 - r0) * i / (pts.length - 1), r0 + (r1 - r0) * (i + 1) / (pts.length - 1), col); }

  /* ---------------------------------------------------------------- meshes, kept */
  const MAT = {};
  function mat(kind) {
    if (MAT[kind]) return MAT[kind];
    let m;
    if (kind === "glass") m = new THREE.MeshPhongMaterial({ vertexColors: true, transparent: true, opacity: 0.76, shininess: 90, specular: 0x8899aa });
    else if (kind === "sheen") m = new THREE.MeshPhongMaterial({ vertexColors: true, shininess: 70, specular: 0x666666 });
    else if (kind === "glow") m = new THREE.MeshBasicMaterial({ vertexColors: true });
    else m = new THREE.MeshLambertMaterial({ vertexColors: true });
    return (MAT[kind] = m);
  }
  const GEO = new Map();
  /* a part: its voxels built once per key, lit; its "glow" voxels unlit. `off` shifts the
     mesh (in voxels) so an odd-sized thing centres on its pivot. */
  function part(key, scale, build, kind, off) {
    let g = GEO.get(key);
    if (!g) {
      const v = new Vox(), gl = new Vox();
      build(v, gl);
      g = { a: v.m.size ? meshVox(v, scale) : null, b: gl.m.size ? meshVox(gl, scale) : null };
      GEO.set(key, g);
    }
    const grp = new THREE.Group();
    for (const [geo, k] of [[g.a, kind || "vox"], [g.b, "glow"]]) if (geo) { const m = new THREE.Mesh(geo, mat(k)); if (off) m.position.set(-off[0] * scale, -off[1] * scale, -off[2] * scale); grp.add(m); }
    return grp;
  }
  const at = (o, x, y, z, s) => { o.position.set(x * s, y * s, z * s); return o; };
  let SHADOW_TEX = null;
  function blob(r) {
    if (!SHADOW_TEX) {
      const c = document.createElement("canvas"); c.width = c.height = 64;
      const x = c.getContext("2d"), gr = x.createRadialGradient(32, 32, 4, 32, 32, 31);
      gr.addColorStop(0, "rgba(0,0,0,.42)"); gr.addColorStop(0.7, "rgba(0,0,0,.18)"); gr.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = gr; x.fillRect(0, 0, 64, 64); SHADOW_TEX = new THREE.CanvasTexture(c);
    }
    const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), new THREE.MeshBasicMaterial({ map: SHADOW_TEX, transparent: true, depthWrite: false }));
    m.rotation.x = -PI / 2; m.position.y = 0.02; m.renderOrder = 1;
    return m;
  }

  /* ---------------------------------------------------------------- faces
     Eyes are a few pixels laid on the face, swapped as the creature feels things: open (a lid
     row and a glint, Post Parade's way), blinking, happy (^ ^), sad. `w` x `h` voxels. */
  function eyeSet(key, s, w, h, col, glint, lid) {
    const x0 = -Math.floor(w / 2), x1 = x0 + w - 1, y0 = -Math.floor(h / 2), y1 = y0 + h - 1;
    const mk = st => part(`eye:${key}:${w}x${h}:${col}:${glint ? 1 : 0}:${lid || 0}:${st}`, s, v => {
      if (st === "open") for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
        let c = col;
        if (lid && y === y1) c = lid;
        else if (glint && h >= 2 && w >= 2 && x === x1 && y === (lid ? y1 - 1 : y1)) c = mixC(col, 0xffffff, 0.75);
        else if (glint && w === 1 && h >= 3 && y === y1) c = mixC(col, 0xffffff, 0.75);
        v.set(x, y, 0, c);
      }
      else if (st === "shut") for (let x = x0; x <= x1; x++) v.set(x, y0 + (h >= 3 ? 1 : 0), 0, lid || col);
      else if (st === "happy") { for (let x = x0; x <= x1; x++) v.set(x, y0 + (h >= 3 ? 1 : 0), 0, lid || col); if (w >= 2) for (let x = x0 + (w >= 3 ? 1 : 0); x <= x1 - (w >= 3 ? 1 : 0); x++) v.set(x, y0 + (h >= 3 ? 2 : 1), 0, lid || col); }
      else if (st === "sad") for (let x = x0; x <= x1; x++) v.set(x, y0 + (h >= 3 ? 1 : 0) + ((key === "R" ? x1 - x : x - x0) >= Math.ceil(w / 2) ? 1 : 0), 0, lid || col);
    });
    const g = new THREE.Group(), st = {};
    for (const k of ["open", "shut", "happy", "sad"]) { st[k] = mk(k); st[k].visible = k === "open"; g.add(st[k]); }
    g.userData.st = st; g.scale.z = 0.3;
    return g;
  }
  const setEyes = (eyes, k) => { if (!eyes) return; for (const e of eyes) { const st = e.userData.st; for (const n in st) st[n].visible = n === k; } };
  /* pixel icons for a Chao's ball to turn into */
  const ICONS = {
    heart: [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."],
    exclaim: ["XX", "XX", "XX", "XX", "..", "XX"],
    question: [".XXX.", "X...X", "...X.", "..X..", ".....", "..X.."],
    swirl: [".XXX.", "X...X", "X.X.X", "X..XX", ".X...", "..XXX"],
    note: ["..XXX", "..X.X", "..X..", "XXX..", "XXX.."],
    zz: ["XXX..", "..X..", ".X...", "XXXXX", "...X.", "..XXX"],
  };
  function icon(name, col, s) {
    const rows = ICONS[name], h = rows.length, w = rows[0].length;
    return part(`icon:${name}:${col}`, s, (v, gl) => rows.forEach((r, i) => [...r].forEach((ch, x) => { if (ch === "X") gl.set(x, h - 1 - i, 0, col); })), null, [w / 2, h / 2, 0.5]);
  }

  /* ---------------------------------------------------------------- the keeper
     Post Parade's trainer: the parts and choices as Post Parade makes them (race/voxel.js),
     on its rig -- hips at eight voxels, the body, arms at the shoulders, the head on the neck. */
  const VS = 0.062, SKIN0 = 0xf8dcc8, LASH = 0x2a1a22, DENIM = 0x3a5a8a, SHIRT = 0xf6f4f0;
  const TRAINER = {
    skins:   [0xf8dcc8, 0xf0c8a8, 0xdcaa82, 0xb67c54, 0x7c4c30],
    hairs:   [0x22201e, 0x4a2c22, 0x7a4a2a, 0xa8642e, 0xe0b868, 0xb03a2a, 0xb8b8c0, 0x2a3a6a],
    eyes:    [0x4a3020, 0x3a6ab0, 0x3a8a5a, 0x7a4ab0, 0x8a8a90],
    colours: [0x2a3150, 0x3a3a40, 0x1e1e22, 0x2f6a4e, 0x7a2232, 0xb89a6a, 0x5a8ac8, 0xf2efe6],
    styles:  { m: ["short", "spiky", "slick", "buzz", "shaggy"], f: ["bob", "long", "ponytail", "bun", "pixie"] },
    bottoms: { m: ["trousers", "jeans", "shorts"], f: ["skirt", "pleated", "long", "trousers", "jeans", "shorts"] },
    attires: ["suit", "tracksuit", "sweater", "polo"],
  };
  const STYLE_NAMES = { short: "Short", spiky: "Spiky", slick: "Swept back", buzz: "Buzz cut", shaggy: "Shaggy", bob: "Bob", long: "Long", ponytail: "Ponytail", bun: "Bun", pixie: "Pixie" };
  const BOTTOM_NAMES = { trousers: "Trousers", jeans: "Jeans", shorts: "Shorts", skirt: "Skirt", pleated: "Pleated skirt", long: "Long skirt" };
  const ATTIRE_NAMES = { suit: "Suit", tracksuit: "Tracksuit", sweater: "Sweater", polo: "Polo and cap" };
  /* the creator's rows, Post Parade's: words as a segmented control, colours as swatches */
  const AVATAR = { OPTIONS: TRAINER, rows: [
    { key: "sex", label: "Keeper", seg: () => [["m", "Man"], ["f", "Woman"]] },
    { key: "skin", label: "Skin", sw: "skins" },
    { key: "style", label: "Hair", seg: c => TRAINER.styles[c.sex === "f" ? "f" : "m"].map(s => [s, STYLE_NAMES[s]]), bySex: true },
    { key: "hair", label: "Hair colour", sw: "hairs" },
    { key: "eyes", label: "Eyes", sw: "eyes" },
    { key: "attire", label: "Attire", seg: () => TRAINER.attires.map(a => [a, ATTIRE_NAMES[a]]) },
    { key: "colour", label: "Colour", sw: "colours" },
    { key: "bottoms", label: "Bottoms", seg: c => TRAINER.bottoms[c.sex === "f" ? "f" : "m"].map(b => [b, BOTTOM_NAMES[b]]), bySex: true },
    { key: "glasses", label: "Glasses", seg: () => [[false, "None"], [true, "Glasses"]] },
  ] };
  function avDefault(sex) {
    return sex === "f"
      ? { sex: "f", skin: 0, hair: 1, style: "ponytail", eyes: 0, attire: "suit", colour: 0, bottoms: "skirt", glasses: false }
      : { sex: "m", skin: 0, hair: 0, style: "short", eyes: 0, attire: "suit", colour: 0, bottoms: "trousers", glasses: false };
  }
  function avLook(t) {
    const d = avDefault(t && t.sex);
    t = Object.assign({}, d, t || {});
    const pick = (a, i) => a[clamp(i | 0, 0, a.length - 1)], sex = t.sex === "f" ? "f" : "m";
    return { sex, skin: pick(TRAINER.skins, t.skin), hair: pick(TRAINER.hairs, t.hair),
      style: TRAINER.styles[sex].includes(t.style) ? t.style : d.style, eyes: pick(TRAINER.eyes, t.eyes),
      attire: TRAINER.attires.includes(t.attire) ? t.attire : d.attire, colour: pick(TRAINER.colours, t.colour),
      bottoms: TRAINER.bottoms[sex].includes(t.bottoms) ? t.bottoms : d.bottoms, glasses: !!t.glasses, ...(t.custom || {}) };
  }
  const skirted = T => T.bottoms === "skirt" || T.bottoms === "pleated" || T.bottoms === "long";
  const bottomOf = T => T.attire === "sweater" ? 0x3a3a46 : T.attire === "polo" ? 0xc8b08a : T.colour;
  function buildTrainerHead(T) {
    const h = new Vox(), hs = patShade(T.hair), skin = T.skin;
    h.box(-4, 0, -4, 3, 7, 3, skin);
    for (const [xo, xi] of [[-3, -2], [2, 1]]) {
      h.set(xo, 3, 3, T.eyes); h.set(xi, 3, 3, mixC(T.eyes, 0xffffff, 0.5));
      h.set(xo, 4, 3, T.sex === "f" ? LASH : mixC(T.eyes, LASH, 0.6));
      h.set(xi, 4, 3, T.sex === "f" ? mixC(T.eyes, LASH, 0.55) : mulC(skin, 0.86));
    }
    if (T.sex === "f") { h.set(-3, 2, 3, 0xf0b4a6); h.set(2, 2, 3, 0xf0b4a6); }
    h.set(-1, 1, 3, mulC(skin, 0.78)); h.set(0, 1, 3, mulC(skin, 0.78));
    h.box(-4, 7, -4, 3, 7, 3, hs);
    h.box(-4, 0, -4, 3, 7, -3, hs);
    h.box(-4, 3, -4, -4, 7, 0, hs); h.box(3, 3, -4, 3, 7, 0, hs);
    const fringe = gap => { for (let x = -4; x <= 3; x++) if (x !== gap) h.set(x, 6, 3, hs(x, 6, 3)); };
    const covered = T.style === "bob" || T.style === "long" || T.style === "shaggy";
    switch (T.style) {
      case "short": fringe(1); h.box(-4, 4, 1, -4, 6, 2, hs); h.box(3, 4, 1, 3, 6, 2, hs); break;
      case "buzz": for (const x of [-4, 3]) h.box(x, 3, -2, x, 4, 0, skin); break;
      case "shaggy":
        fringe(99); for (const x of [-4, -3, -2, 1, 2, 3]) h.set(x, 5, 3, hs(x, 5, 3));
        h.box(-4, 0, -4, -4, 6, 2, hs); h.box(3, 0, -4, 3, 6, 2, hs); h.box(-3, -2, -4, 2, -1, -3, hs);
        for (let x = -4; x <= 3; x++) for (let z = -4; z <= 1; z++) if ((x * 3 + z) % 4) h.set(x, 8, z, hs(x, 8, z));
        break;
      case "spiky":
        fringe(99);
        for (let x = -4; x <= 3; x++) for (let z = -4; z <= 2; z++) if (((x + z) & 1) === 0) h.set(x, 8, z, hs(x, 8, z));
        for (const [x, z] of [[-2, -2], [1, 0], [-1, 1], [2, -3], [-3, 0]]) h.set(x, 9, z, hs(x, 9, z));
        break;
      case "slick": h.box(-4, 8, -4, 3, 8, 1, hs); h.box(-3, 8, 2, 2, 8, 2, hs); break;
      case "pixie": fringe(99); for (const x of [-4, -3, -2]) h.set(x, 5, 3, hs(x, 5, 3)); h.set(-4, 4, 3, hs(-4, 4, 3)); h.box(-4, 8, -3, 0, 8, 1, hs); break;
      case "bob":
        fringe(99); h.box(-4, 5, 3, -4, 5, 3, hs); h.box(3, 5, 3, 3, 5, 3, hs);
        h.box(-4, -2, -4, 3, -1, -2, hs); h.box(-4, 0, -4, -4, 2, 2, hs); h.box(3, 0, -4, 3, 2, 2, hs);
        break;
      case "long":
        fringe(-1);
        for (let y = -7; y <= -1; y++) { const x0 = y <= -3 ? -3 : -4, x1 = y <= -3 ? 2 : 3; for (let x = x0; x <= x1; x++) for (let z = -4; z <= -3; z++) if (!(y === -7 && (x === x0 || x === x1))) h.set(x, y, z, hs(x, y, z)); }
        h.box(-4, 0, -4, -4, 2, 1, hs); h.box(3, 0, -4, 3, 2, 1, hs);
        break;
      case "ponytail": fringe(-2); break;
      case "bun": fringe(-2); h.box(-1, 6, -6, 0, 8, -5, hs); h.box(-2, 7, -6, 1, 7, -5, hs); break;
    }
    if (!covered) { h.set(-5, 3, 0, skin); h.set(-5, 4, 0, skin); h.set(4, 3, 0, skin); h.set(4, 4, 0, skin); }
    if (T.hat) {
      const c = T.hat.c, band = T.hat.band || mulC(c, 0.8);
      if (T.hat.sun) { h.box(-6, 8, -6, 5, 8, 5, (x, y, z) => (Math.abs(x + 0.5) > 5 && Math.abs(z + 0.5) > 5) ? null : c); h.box(-4, 9, -4, 3, 9, 3, band); h.box(-3, 10, -3, 2, 10, 2, c); }
      else { h.box(-4, 8, -4, 3, 8, 3, band); h.box(-4, 9, -4, 3, 9, 3, c); h.box(-3, 10, -3, 2, 10, 2, c); h.box(-3, 8, 4, 2, 8, 4, mulC(c, 0.75)); }
      if (T.hat.flower) { h.set(2, 9, 3, T.hat.flower); h.set(3, 9, 3, T.hat.flower); h.set(2, 10, 3, 0xffd040); }
    } else if (T.attire === "polo") {
      const c = T.colour, cd = mulC(c, 0.8);
      h.box(-4, 8, -4, 3, 8, 3, c); h.box(-3, 9, -3, 2, 9, 2, c);
      h.box(-4, 8, 4, 3, 8, 5, cd); h.set(-1, 9, 3, 0xf6f4f0); h.set(0, 9, 3, 0xf6f4f0);
    }
    return meshVox(h);
  }
  function buildGlasses() {
    const g = new Vox(), fr = 0x26262e, lens = 0xfafcfd, q = 4;
    const box = (x0, y0, z0, x1, y1, z1, c) => g.box(Math.round(x0 * q), Math.round(y0 * q), Math.round(z0 * q), Math.round(x1 * q) - 1, Math.round(y1 * q) - 1, Math.round(z1 * q) - 1, c);
    for (const [a, b] of [[-3.75, -0.5], [0.5, 3.75]]) { box(a, 2.25, 4, b, 5.5, 4.25, fr); box(a + 0.25, 2.5, 4, b - 0.25, 5.25, 4.25, lens); }
    box(-0.5, 4.5, 4, 0.5, 4.75, 4.25, fr);
    for (const s of [-1, 1]) { const x0 = s < 0 ? -4.25 : 4; box(s < 0 ? -4.25 : 3.75, 5, 4, s < 0 ? -3.75 : 4.25, 5.25, 4.25, fr); box(x0, 5, -0.5, x0 + 0.25, 5.25, 4, fr); box(x0, 4.25, -0.5, x0 + 0.25, 5, -0.25, fr); }
    return meshVox(g);
  }
  function buildTrainerBody(T) {
    const b = new Vox(), J = T.colour, Jd = mulC(J, 0.8), bot = T.bottoms === "jeans" ? DENIM : bottomOf(T);
    switch (T.bottoms) {
      case "skirt": b.box(-3, 0, -2, 2, 2, 1, bot); b.box(-4, 0, -3, 3, 0, 2, mulC(bot, 0.9)); break;
      case "pleated": { const pl = x => (x & 1) ? mulC(bot, 0.86) : bot; b.box(-3, 0, -2, 2, 2, 1, pl); b.box(-4, 0, -3, 3, 1, 2, pl); b.box(-5, 0, -3, 4, 0, 2, pl); break; }
      case "long": b.box(-3, -4, -2, 2, 2, 1, (x, y) => y === -4 ? mulC(bot, 0.86) : bot); b.box(-4, -4, -3, 3, -3, 2, mulC(bot, 0.86)); break;
      default: b.box(-3, 0, -2, 2, 2, 1, (x, y) => y === 2 ? 0x2a2420 : bot);
    }
    b.box(-3, 3, -2, 2, 8, 1, J);
    switch (T.attire) {
      case "suit": { const tie = T.tie || (J === 0x7a2232 ? 0x2a3a6a : 0xc0303a);
        b.box(-3, 2, -2, 2, 2, 1, J); b.box(-2, 8, 1, 1, 8, 1, SHIRT); b.box(-1, 7, 1, 0, 7, 1, SHIRT); b.box(-1, 4, 1, 0, 6, 1, tie);
        for (const x of [-2, 1]) for (let y = 6; y <= 7; y++) b.set(x, y, 1, Jd); b.set(-2, 4, 1, 0x2a2a30); break; }
      case "tracksuit": b.box(-3, 6, -2, 2, 6, 1, SHIRT); b.box(-1, 3, 1, -1, 8, 1, 0xc8ccd6); b.box(-2, 9, -2, 1, 9, 1, J); break;
      case "sweater": b.box(-3, 3, -2, 2, 8, 1, (x, y) => y === 3 ? Jd : ((x & 1) ? mulC(J, 0.92) : J)); b.box(-2, 8, 1, 1, 8, 1, SHIRT); b.set(-2, 9, 1, SHIRT); b.set(1, 9, 1, SHIRT); break;
      case "polo": b.box(-2, 8, 1, 1, 8, 1, SHIRT); b.set(-3, 8, 0, SHIRT); b.set(2, 8, 0, SHIRT); b.box(-1, 6, 1, -1, 7, 1, SHIRT); break;
    }
    if (T.apron) { b.box(-2, 0, 1, 1, 7, 1, T.apron); b.set(-2, 8, 1, T.apron); b.set(1, 8, 1, T.apron); }
    if (T.satchel) { for (let i = 0; i < 6; i++) b.set(-3 + i, 8 - i, 2, 0x6a4a2a); b.box(2, 1, 2, 3, 3, 2, 0x8a5a3a); }
    b.box(-1, 9, -1, 0, 9, 0, T.skin);
    return meshVox(b);
  }
  function buildTrainerArm(T) {
    const a = new Vox(), J = T.colour;
    for (let y = -6; y <= -1; y++) {
      let c = J;
      if (y === -6) c = T.skin;
      else if (y === -5) c = T.attire === "suit" ? SHIRT : T.attire === "sweater" ? mulC(J, 0.8) : T.skin;
      else if (T.attire === "polo" && y <= -3) c = T.skin;
      a.box(-1, y, -1, 0, y, 0, c);
    }
    if (T.attire === "tracksuit") for (let y = -4; y <= -1; y++) a.set(0, y, 0, SHIRT);
    return meshVox(a);
  }
  function buildTrainerLeg(T) {
    const g = new Vox();
    const shoe = T.shoes || (T.attire === "tracksuit" ? 0xf2f2f2 : T.attire === "polo" ? 0x8a5a3a : 0x2a2420);
    const tights = T.legs || (T.attire === "suit" || T.attire === "sweater" ? 0x3a3440 : T.skin);
    for (let y = -8; y <= -1; y++) {
      let c;
      switch (T.bottoms) { case "jeans": c = DENIM; break; case "shorts": c = y >= -3 ? bottomOf(T) : y === -7 ? 0xf6f4f0 : T.skin; break; default: c = skirted(T) ? tights : bottomOf(T); }
      g.box(-1, y, -1, 0, y, 0, y === -8 ? shoe : c);
    }
    g.set(-1, -8, 1, shoe); g.set(0, -8, 1, shoe);
    return meshVox(g);
  }
  function buildPonytail(T) {
    const v = new Vox(), hs = patShade(T.hair), len = 11;
    for (let i = 0; i < len; i++) { const y = -i, z = -Math.round(i * 0.22), thin = i >= len - 2;
      for (let x = thin ? 0 : -1; x <= 0; x++) for (let dz = thin ? 0 : -1; dz <= 0; dz++) v.set(x, y, z + dz, hs(x, y, z + dz));
      if (i < len - 3) { v.set(-2, y, z, hs(-2, y, z)); v.set(1, y, z - 1, hs(1, y, z - 1)); } }
    return meshVox(v);
  }
  const TRCACHE = new Map();
  function makeTrainer(t) {
    const T = avLook(t), key = JSON.stringify(T);
    let P = TRCACHE.get(key);
    if (!P) { P = { head: buildTrainerHead(T), body: buildTrainerBody(T), arm: buildTrainerArm(T), leg: buildTrainerLeg(T), tail: T.style === "ponytail" ? buildPonytail(T) : null, glasses: T.glasses ? buildGlasses() : null }; TRCACHE.set(key, P); }
    const M = mat("vox"), mesh = g => { const m = new THREE.Mesh(g, M); m.castShadow = true; m.receiveShadow = true; return m; };
    const rootG = new THREE.Group(), rig = new THREE.Group(); rig.scale.setScalar(VS); rootG.add(rig);
    const legL = new THREE.Group(), legR = new THREE.Group(); legL.position.set(-1.05, 8, 0); legR.position.set(1.05, 8, 0); legL.add(mesh(P.leg)); legR.add(mesh(P.leg));
    const body = new THREE.Group(); body.position.set(0, 8, 0); body.add(mesh(P.body));
    const armL = new THREE.Group(), armR = new THREE.Group(); armL.position.set(-4, 9, 0); armR.position.set(4, 9, 0); armL.add(mesh(P.arm)); armR.add(mesh(P.arm));
    const head = new THREE.Group(); head.position.set(0, 10, 0); head.add(mesh(P.head));
    if (P.glasses) { const m = mesh(P.glasses); m.scale.setScalar(0.25); head.add(m); }
    const locks = [];
    if (P.tail) { const g = new THREE.Group(); g.position.set(0, 6.5, -5); g.add(mesh(P.tail)); head.add(g); locks.push(g); }
    body.add(armL, armR, head); rig.add(legL, legR, body);
    return { root: rootG, rig, legL, legR, body, armL, armR, head, locks, phase: Math.random() * 6.283, seed: Math.random() * 100 };
  }
  /* Post Parade's pose: `run` 0 (standing) to 1 (running), and what the garden adds */
  function keeperAnim(R, t, dt, st, sp) {
    const m = R.pp, run = st === "run" ? 1 : st === "walk" ? clamp(0.35 + (sp || 1) * 0.25, 0.3, 0.8) : 0;
    if (run) m.phase += dt * (5.5 + 8 * run);
    const s = Math.sin(m.phase), legA = 0.95 * run, armA = 0.85 * run;
    m.legL.rotation.x = s * legA; m.legR.rotation.x = -s * legA;
    m.armL.rotation.x = -s * armA; m.armR.rotation.x = s * armA;
    m.armL.rotation.z = -0.08 - 0.06 * run; m.armR.rotation.z = 0.08 + 0.06 * run;
    const breathe = Math.sin(t * 2.1 + m.seed) * 0.012 * (1 - run);
    m.body.rotation.x = 0.03 + 0.24 * run + breathe;
    m.head.rotation.x = -m.body.rotation.x * 0.55;
    m.head.rotation.y = Math.sin(t * 0.7 + m.seed) * 0.12 * (1 - run);
    m.rig.position.y = Math.abs(s) * 0.075 * run;
    for (let i = 0; i < m.locks.length; i++) m.locks[i].rotation.x = 0.06 + 0.6 * run + Math.sin(m.phase * 2 + 1 + i) * 0.07 * run;
    if (st === "carry") { m.armL.rotation.x = m.armR.rotation.x = -1.3; m.armL.rotation.z = -0.2; m.armR.rotation.z = 0.2; }
    if (st === "happy") { m.armL.rotation.z = -2.6; m.armR.rotation.z = 2.6; m.rig.position.y = Math.abs(Math.sin(t * 8)) * 0.06; }
    if (st === "sit") { m.legL.rotation.x = m.legR.rotation.x = -1.5; m.rig.position.y = -0.3; }
  }
  function avatar(t) {
    const m = makeTrainer(t);
    const R = { g: m.root, kind: "avatar", pp: m, arms: [m.armL, m.armR], legs: [m.legL, m.legR], wings: [], tails: [], head: m.head, body: m.body, h: 27 * VS, r: 0.28, headY: 22 * VS, gait: "biped", avatar: true };
    R.shadow = blob(0.36); R.g.add(R.shadow);
    R.anim = (time, dt, st, sp) => keeperAnim(R, time, dt, st, sp);
    return R;
  }

  /* ---------------------------------------------------------------- Chao
     A big rounded head (eight voxels across), a small body, stubby arms and feet with
     the tips' colour, little wings, a tail, and the ball floating over the head. The
     alignment colours it and shapes the ball and the head's tip; the first path reshapes the
     body (the second, half as much); a rare form adds its own touches. */
  const GC = 0.05;
  const TIP_SHAPE = { neutral: "point", hero: "round", dark: "horn", wild: "sprout", mech: "antenna" };
  function chaoLook(c) {
    const sp = D.species(c.sp) || D.CHAO[0], al = D.ALIGNS[sp.align] || D.ALIGNS.neutral, g = c.genes || {};
    const m = (sp.morph && sp.morph.body) || {};
    let body = m.tint != null ? m.tint : al.c[0], tip = m.tint != null ? mixC(m.tint, 0xffffff, 0.45) : al.c[1];
    body = shift(body, (g.tint || 0) * 0.5, (g.tint2 || 0) * 0.5); tip = shift(tip, (g.tint || 0) * 0.3, 0);
    const w = p => (sp.p1 === p ? 1 : 0) + (sp.p2 === p ? 0.5 : 0);
    return { sp, al: sp.align, body, tip, belly: mixC(body, 0xffffff, 0.4), m, child: sp.stage === 0, pat: g.pat || "plain",
      swim: w("swim") + (m.fins ? 1 : 0), fly: w("fly") + (m.wings ? m.wings - 1 : 0), run: w("run"), power: w("power"), spark: w("spark") + (m.ears === "antlers" ? 0.6 : 0),
      kind: m.glass ? "glass" : m.sheen ? "sheen" : "vox", tipShape: sp.stage >= 3 ? "round" : TIP_SHAPE[sp.align],
      ball: sp.stage >= 3 ? (m.ring ? "halo" : "sphere") : al.ball, ballC: sp.stage >= 3 ? tip : al.ballC };
  }
  function chaoCol(L) {
    return (x, y, z, zone, y1) => {
      let c = L.body;
      if (L.m.prism) c = fromHsl((x * 40 + y * 30 + z * 20) % 360, 0.6, 0.72);
      if (zone === "belly") c = L.belly;
      if (zone === "body" && y === 0) c = mulC(c, 0.9);
      if (zone === "head" && y1 != null && y === y1) c = mixC(c, 0xffffff, 0.08);
      if (L.pat === "spots" && zone !== "belly" && hash(x >> 1, y >> 1, z >> 1) < 0.12) c = mixC(c, L.tip, 0.7);
      if (L.pat === "stripes" && z < 0 && ((y + x) & 1) === 0) c = mixC(c, L.tip, 0.5);
      if (L.pat === "two-tone" && zone === "head" && y >= 4) c = mixC(c, L.tip, 0.4);
      if (L.pat === "freckles" && zone === "face" && hash(x, y, 3) < 0.4) c = mixC(c, 0x8a5a3a, 0.4);
      if (L.pat === "mask" && zone === "face") c = mulC(c, 0.8);
      if (L.m.stripes && ((y + x) & 1) === 0) c = L.m.stripes;
      if (L.m.moss && zone === "head" && y >= 5) c = (x + z) & 1 ? 0x6a9a4a : 0x5a8a3a;
      if (L.m.glyphs && zone && ((x * 3 + y * 5) % 7 === 0)) c = mulC(c, 0.6);
      if (L.m.rivets && ((x & 3) === 0) && ((y & 3) === 1)) c = 0x5a606a;
      return grain(c, x, y, z, 0.025);
    };
  }
  function buildChao(c) {
    const L = chaoLook(c), col = chaoCol(L), K = `chao:${c.sp}:${L.body}:${L.tip}:${L.pat}`;
    const ch = L.child, S = GC;
    const rig = { g: new THREE.Group(), kind: "chao", plan: "chao", gait: L.fly >= 1 ? "chaofly" : "chao", L, legs: [], arms: [], wings: [], tails: [], S };
    const inner = new THREE.Group(); rig.g.add(inner); rig.inner = inner;
    const pw = L.power >= 1 ? 1 : 0, bw = 3 + pw, bh = ch ? 4 : 5, legH = 2 + (L.run >= 1 ? 2 : L.run >= 0.5 ? 1 : 0);
    const tipMix = t => mixC(L.body, L.tip, clamp(t, 0, 1));
    /* the body: a rounded block, the belly paler in front */
    const body = part(K + ":body", S, (v, gl) => {
      rbx(v, -bw, 0, -2, bw - 1, bh - 1, 1, (x, y, z) => col(x, y, z, z === 1 && Math.abs(x + 0.5) < bw - 1 && y < bh - 1 ? "belly" : "body"), 2);
      if (pw) rbx(v, -bw, bh - 2, -2, bw - 1, bh - 1, 2, (x, y, z) => col(x, y, z, "body"), 2);          // a Brawn chest
      if (L.m.glow || L.spark >= 0.5) for (const x of [-2, 1]) gl.set(x, 2, 2, 0x9af8ff);
      if (L.m.rivets) for (const x of [-bw, bw - 1]) v.set(x, 2, 0, 0x5a606a);
    }, L.kind);
    at(body, 0, legH, 0, S); inner.add(body); rig.body = body;
    /* the head: eight across, seven high and deep, its edges cut round */
    const HY = legH + bh;
    const head = part(K + ":head", S, (v, gl) => {
      rbx(v, -4, 0, -3, 3, 6, 3, (x, y, z) => col(x, y, z, z === 3 ? "face" : "head", 6), 2);
      for (const x of [-3, 2]) v.set(x, 1, 3, mixC(L.body, 0xf88aa0, 0.45));                       // the blush
      /* the tip on top */
      const T = L.tipShape;
      if (T === "point") { bx(v, -1, 7, -1, 0, 7, 0, tipMix(0.4)); bx(v, -1, 8, -1, 0, 8, -1, tipMix(0.8)); bx(v, -1, 9, -2, 0, 9, -2, L.tip); }
      else if (T === "round") { bx(v, -1, 7, -1, 0, 7, 0, tipMix(0.6)); bx(v, -1, 8, -1, 0, 8, -1, mixC(L.tip, 0xffffff, 0.3)); }
      else if (T === "horn") for (const s of [-1, 1]) { v.set(mx(s, 2), 7, 0, tipMix(0.5)); v.set(mx(s, 2), 8, -1, L.tip); v.set(mx(s, 3), 8, -1, L.tip); }
      else if (T === "sprout") { bx(v, -1, 7, 0, 0, 7, 0, 0x5a8a3a); bx(v, -4, 8, 0, -1, 8, 0, (x) => x === -4 ? 0x5ac040 : 0x6ad050); bx(v, 0, 8, 0, 2, 9, 0, (x, y) => y === 9 && x === 0 ? null : 0x6ad050); }
      else if (T === "antenna") { bx(v, -1, 7, -1, 0, 8, -1, 0x8a909a); bx(gl, -1, 9, -1, 0, 9, -1, L.tip); }
      /* swept ears for runners, fins for swimmers, antlers for sparks */
      if (L.run >= 0.5) for (const s of [-1, 1]) { const n = L.run >= 1 ? 5 : 3; for (let i = 0; i < n; i++) bx(v, mx(s, 2), 6 + (i > 1 ? 1 : 0), -2 - i, mx(s, 3), 6 + (i > 1 ? 1 : 0), -2 - i, tipMix(i / n + 0.2)); }
      if (L.swim >= 0.5) for (const s of [-1, 1]) { const n = L.swim >= 1 ? 3 : 2; for (let i = 0; i < n; i++) bx(v, mx(s, 4 + i), 3 + i, -1 - i, mx(s, 4 + i), 5 + i - (i ? 1 : 0), 1 - i, tipMix(0.5 + i * 0.25)); }
      if (L.spark >= 0.5) for (const s of [-1, 1]) { v.set(mx(s, 2), 7, -1, L.tip); v.set(mx(s, 2), 8, -1, L.tip); v.set(mx(s, 3), 9, -1, L.tip); v.set(mx(s, 2), 9, -2, L.tip); if (L.spark >= 1) { v.set(mx(s, 4), 10, -1, L.tip); v.set(mx(s, 2), 10, -3, L.tip); } }
      if (L.m.petals) for (const [x, y] of [[-5, 2], [-5, 4], [4, 2], [4, 4], [-3, 7], [2, 7], [-1, 7]]) bx(v, x, y, 0, x, y, 0, 0xf8a8d0);
      if (L.m.flame) for (const [x, y, z] of [[-1, 7, 0], [0, 7, 0], [-1, 8, -1], [0, 9, -1], [-1, 10, -1]]) gl.set(x, y, z, y > 8 ? 0xffd040 : 0xff6a2a);
      if (L.m.gem) bx(gl, -1, 5, 4, 0, 5, 4, L.m.gem > 1 ? 0x40f080 : 0xf04a6a);
      if (L.m.glow || L.spark >= 1) for (const x of [-4, 3]) gl.set(x, 2, 2, 0x9af8ff);
      if (L.m.stars) for (let i = 0; i < 10; i++) gl.set(Math.floor(hash(i, 1, 9) * 8) - 4, Math.floor(hash(i, 2, 9) * 6) + 1, -3, 0xffffff);
    }, L.kind);
    at(head, 0, HY, 0, S); inner.add(head); rig.head = head;
    /* eyes and mouth: a few pixels on the face (its front is at z 4) */
    rig.eyes = [];
    for (const s of [-1, 1]) { const e = eyeSet(s > 0 ? "R" : "L", S, 2, 3, 0x1a1a2a, true); e.position.set((s > 0 ? 2 : -2) * S, 3 * S + 0.5 * S, 4 * S + 0.002); head.add(e); rig.eyes.push(e); }
    const mouth = new THREE.Group();
    const mShut = part("chao:mouth:shut", S, v => { v.set(-1, 0, 0, 0x5a2a3a); v.set(0, 0, 0, 0x5a2a3a); });
    const mOpen = part("chao:mouth:open", S, v => { v.set(-1, 0, 0, 0x8a2a3a); v.set(0, 0, 0, 0x8a2a3a); v.set(-1, -1, 0, 0xe86a7a); v.set(0, -1, 0, 0xe86a7a); });
    mOpen.visible = false; mouth.add(mShut, mOpen); mouth.position.set(0, 1 * S, 4 * S + 0.002); mouth.scale.z = 0.3; head.add(mouth);
    rig.mouth = { open: mOpen, shut: mShut };
    /* arms, the hands the tips' colour */
    for (const s of [-1, 1]) {
      const a = part(`${K}:arm${s}`, S, v => {
        const w = pw ? 2 : 1, n = pw ? 4 : 3;
        bx(v, mx(s, 0), -n, -1, mx(s, w), 0, pw ? 1 : 0, (x, y) => y <= -n + (pw ? 1 : 0) ? mixC(L.body, L.tip, 0.85) : col(x, y, 0, "body"));
        if (L.swim >= 1) bx(v, mx(s, 0), -n, 1, mx(s, 1), -n, 1, L.tip);
      }, L.kind);
      at(a, s > 0 ? bw : -bw, legH + bh - 1, 0, S); a.rotation.z = s * 0.3; inner.add(a); rig.arms.push(a);
    }
    /* legs and feet */
    for (const s of [-1, 1]) {
      const l = part(`${K}:leg${s}:${legH}`, S, v => {
        /* (from the hip down: the leg, then the foot at the bottom, its toes forward) */
        if (legH > 2) bx(v, -1, -legH + 2, -1, 0, -1, 0, (x, y, z) => col(x, y, z, "body"));
        rbx(v, -1, -legH, -1, 0, -legH + 1, 1, (x, y, z) => z === 1 ? mixC(L.body, L.tip, 0.85) : col(x, y, z, "body"), 3);
      }, L.kind);
      at(l, s * 1.6, legH, 0, S); inner.add(l); rig.legs.push(l);
    }
    rig.legLen = legH;
    /* wings on the back: small on most, great on fliers */
    for (const s of [-1, 1]) {
      const w = part(`${K}:wing${s}:${L.fly}`, S, v => {
        const rows = L.fly >= 1 ? [[2, 1, 3], [1, 0, 3], [0, 0, 2], [-1, 0, 1]] : L.fly >= 0.5 ? [[1, 0, 2], [0, 0, 2], [-1, 0, 1]] : [[1, 0, 1], [0, 0, 0]];
        const far = Math.max(...rows.map(r => r[2]));
        for (const [y, a0, a1] of rows) for (let x = a0; x <= a1; x++) v.set(mx(s, x), y, 0, x === far || x === a1 ? L.tip : mixC(L.body, L.tip, 0.35));
      }, L.kind);
      at(w, s * 1, legH + bh - 2, -3, S); inner.add(w); rig.wings.push(w); w.userData.s = s;
    }
    /* the tail */
    const tail = part(`${K}:tail`, S, v => {
      if (L.swim >= 0.5) { bx(v, -1, 0, -1, 0, 0, -1, L.body); bx(v, -2, 0, -3, 1, 0, -2, (x) => Math.abs(x + 0.5) > 1 ? L.tip : mixC(L.body, L.tip, 0.6)); }
      else { bx(v, -1, 0, -2, 0, 0, -1, mixC(L.body, L.tip, 0.3)); bx(v, -1, 1, -3, 0, 1, -3, L.tip); }
    }, L.kind);
    at(tail, 0, legH + 1, -2, S); inner.add(tail); rig.tails.push(tail); rig.tail = tail;
    /* the ball, floating over the head and lagging behind as the Chao moves */
    const tipH = L.tipShape === "point" ? 3 : L.tipShape === "antenna" ? 3 : 2;
    rig.ballY = (HY + 7 + tipH + 2.5) * S;
    rig.ball = new THREE.Group(); rig.ball.position.y = rig.ballY; rig.g.add(rig.ball);
    const B = rig.balls = {}, bc = L.ballC;
    B.ball = part(`ball:${L.ball}:${bc}`, S, (v, gl) => {
      if (L.ball === "sphere") rbx(v, -1, -1, -1, 1, 1, 1, (x, y, z) => x === -1 && y === 1 && z === 1 ? mixC(bc, 0xffffff, 0.5) : (y === 1 ? mixC(bc, 0xffffff, 0.15) : bc), 3);
      else if (L.ball === "halo") { for (const [x, z] of [[-2, -1], [-2, 0], [-2, 1], [2, -1], [2, 0], [2, 1], [-1, -2], [0, -2], [1, -2], [-1, 2], [0, 2], [1, 2]]) gl.set(x, 0, z, bc); }
      else if (L.ball === "spike") { rbx(v, -1, -1, -1, 1, 1, 1, bc, 3); for (const [x, y, z] of [[-2, 0, 0], [2, 0, 0], [0, 2, 0], [0, -2, 0], [0, 0, 2], [0, 0, -2]]) v.set(x, y, z, mulC(bc, 0.75)); }
      else if (L.ball === "leaf") { for (const [y, w] of [[-2, 0], [-1, 1], [0, 1], [1, 1], [2, 0]]) for (let z = -w; z <= w; z++) v.set(0, y, z, z === 0 ? 0x3a8a2a : bc); }
      else if (L.ball === "gear") { for (const [x, y] of [[-1, 2], [0, 2], [1, 2], [-1, -2], [0, -2], [1, -2], [2, -1], [2, 0], [2, 1], [-2, -1], [-2, 0], [-2, 1], [0, 3], [0, -3], [3, 0], [-3, 0]]) v.set(x, y, 0, 0x9aa4b0); gl.set(0, 0, 0, bc); }
    }, null, [0.5, 0.5, 0.5]);
    B.heart = icon("heart", 0xf04a7a, S * 0.7); B.exclaim = icon("exclaim", 0xffd21a, S * 0.7); B.question = icon("question", 0x6fe6ff, S * 0.7);
    B.swirl = icon("swirl", 0x9a7af0, S * 0.7); B.note = icon("note", 0xffffff, S * 0.7); B.zz = icon("zz", 0xb8d4ff, S * 0.7);
    for (const n in B) { B[n].visible = n === "ball"; rig.ball.add(B[n]); }
    if (L.m.ring) { const r = part("chao:ring", S, (v, gl) => { for (let i = 0; i < 40; i++) { const a = i / 40 * PI * 2; gl.set(Math.round(Math.cos(a) * 8), Math.round(Math.sin(a) * 8), 0, 0xffe070); } }); at(r, 0, HY + 3, -5, S); inner.add(r); }
    if (L.m.ribbon) { const r = part("chao:ribbon", S, (v, gl) => { for (let i = 0; i < 12; i++) gl.set(Math.round(Math.sin(i * 0.6) * 2), -Math.floor(i / 3), -i, fromHsl(140 + i * 18, 0.7, 0.7)); }); at(r, 0, legH + bh, -3, S); inner.add(r); }
    rig.h = rig.ballY + 0.1; rig.r = (bw + 2) * S; rig.headY = (HY + 3) * S;
    rig.shadow = blob(ch ? 0.26 : 0.32); rig.g.add(rig.shadow);
    rig.g.scale.setScalar(((c.genes && c.genes.size) || 1) * (ch ? 0.82 : 1));
    return rig;
  }

  /* ---------------------------------------------------------------- animals
     Each species is a body plan drawn in blocks from its size and its features -- a fox is a
     four-legged block with a fox's narrow snout, pointed ears and a brush of a tail; a lion
     the same with a mane and a tufted tail. Small animals are drawn on a finer grain, so a
     mouse still has a face. Its colours are its own, shifted a little by its genes. */
  function animalLook(c) {
    const sp = D.species(c.sp), g = c.genes || {}, f = sp.feat || {};
    const dh = (g.tint || 0) * 0.35, dl = (g.tint2 || 0) * 0.5, [m0, s0, b0] = sp.cols;
    const al = g.al || {}, two = k => al[k] && al[k][0] && al[k][1];
    let main = shift(m0, dh, dl), second = shift(s0, dh * 0.6, dl * 0.6), belly = shift(b0, dh * 0.4, dl * 0.4);
    if (two("albino")) { main = mixC(main, 0xf8f4f0, 0.75); second = mixC(second, 0xf8f4f0, 0.6); belly = mixC(belly, 0xf8f4f0, 0.6); }
    if (two("melan")) { main = mulC(main, 0.35); second = mulC(second, 0.5); belly = mulC(belly, 0.45); }
    return { sp, f, main, second, belly, pat: g.pat || "plain" };
  }
  /* the body's colour at a voxel: main, the belly underneath, and the species' markings */
  function aCol(L, part) {
    const f = L.f, { main, second, belly } = L;
    return (x, y, z, o) => {
      o = o || {};
      let c = main;
      if (o.under != null && y <= o.under) c = belly;
      if (o.front != null && z >= o.front) c = belly;
      if (part !== "leg") {
        if (f.spots && hash(x >> 1, y >> 1, z >> 1) < 0.2) c = second;
        if (f.rosettes && hash(x, y, z) < 0.18) c = (x + z) & 1 ? second : mixC(main, second, 0.5);
        if (f.patches && hash(x >> 1, y >> 1, z >> 1) < 0.34) c = second;
        if (f.stripes && part === "body" && (z & 1) === 0 && (o.under == null || y > o.under)) c = second;
        if (f.stripes && part === "head" && o.top != null && y >= o.top && (x & 1)) c = second;
        if (f.bands && (z & 1)) c = second;
        if (f.stripe === "back" && Math.abs(x + 0.5) < 1 && o.top != null && y >= o.top) c = second;
        if (f.saddle && part === "body" && o.mid != null && Math.abs(z - o.mid) <= 1) c = second;
        if (f.dots && hash(x, y, z) < 0.15) c = second;
        if (f.segments && (z & 1)) c = mixC(main, second, 0.4);
        if (f.wool && part === "body" && ((x + y + z) & 1)) c = mixC(main, 0xffffff, 0.12);
        if (f.scales && ((x + y + z) & 1)) c = mixC(main, second, 0.35);
      }
      if (L.pat === "spots" && part !== "leg" && hash(x, y + 9, z) < 0.1) c = mixC(c, second, 0.6);
      if (L.pat === "stripes" && part === "body" && ((z + y) % 3 === 0)) c = mixC(c, second, 0.45);
      if (L.pat === "two-tone" && part === "body" && o.top != null && y >= o.top) c = mixC(c, second, 0.5);
      if (L.pat === "socks" && part === "leg" && o.low != null && y <= o.low) c = mixC(c, 0xf8f8f0, 0.8);
      if (L.pat === "freckles" && part === "head" && hash(x, y, z) < 0.12) c = mixC(c, second, 0.5);
      return grain(c, x, y, z, 0.03);
    };
  }
  /* -- the head, every plan's: a block with eyes, ears, a snout or a beak, and its extras.
     Local to the neck: x -hw..hw-1, y 0..hh-1, z 0..hd-1; the face is at z = hd. */
  function aHead(R, L, f, g, K, hw, hh, hd, opt) {
    opt = opt || {};
    const col = aCol(L, "head"), main = L.main, sec = (x, y, z) => grain(L.second, x, y, z, 0.03), sid = L.sp.id;
    const blush = mixC(main, 0xf0a0a8, 0.45), dark = 0x1a1a1a;
    const head = part(`${K}:head:${opt.k || ""}`, g, (v, gl) => {
      rbx(v, -hw, 0, 0, hw - 1, hh - 1, hd - 1, (x, y, z) => col(x, y, z, { top: hh - 1, front: f.mask === "white" ? 99 : (f.face === "heart" ? hd - 1 : 99) }), 3);
      if (f.mask && f.mask !== "white") bx(v, -hw, hh - 2, hd - 1, hw - 1, hh - 2, hd - 1, mulC(L.second, 0.75));
      if (f.mask === "white") bx(v, -hw, 0, hd - 1, hw - 1, 1, hd - 1, 0xf8f4ec);
      if (f.eyepatch) for (const s of [-1, 1]) bx(v, mx(s, 1), hh - 3, hd - 1, mx(s, 2), hh - 2, hd - 1, L.second);
      if (f.stripe === "face") bx(v, -1, 1, hd - 1, 0, hh - 1, hd - 1, 0xf8f8f8);
      if (f.head === "white") bx(v, -hw, 0, 0, hw - 1, hh - 1, hd - 1, (x, y, z) => v.has(x, y, z) ? 0xf8f8f8 : null);
      /* the snout, or the beak, or the bill, in front of the face */
      const sn = f.snout, bk = f.beak, z0 = hd, low = 0;
      const snoutCol = sn === "bear" ? L.belly : sn === "pig" || sn === "wide" ? mixC(main, 0xe8a0a8, 0.3) : null;
      if (sn === "fox" || sn === "point") { bx(v, -1, low, z0, 0, low + 1, z0, (x, y, z) => col(x, y, z)); bx(v, -1, low, z0 + 1, 0, low, z0 + 1 + (hd > 3 ? 1 : 0), (x, y, z) => col(x, y, z)); v.set(-1, low, z0 + 1 + (hd > 3 ? 1 : 0), dark); v.set(0, low, z0 + 1 + (hd > 3 ? 1 : 0), dark); }
      else if (sn === "dog" || sn === "long") { const n = sn === "long" ? 3 : 2; bx(v, -1, low, z0, 0, low + 1, z0 + n - 1, (x, y, z) => col(x, y, z, { under: low })); bx(v, -1, low + 1, z0 + n - 1, 0, low + 1, z0 + n - 1, dark); }
      else if (sn === "bear") { bx(v, -1, low, z0, 0, low + 1, z0, snoutCol); bx(v, -1, low + 1, z0, 0, low + 1, z0, dark); }
      else if (sn === "pig") { bx(v, -1, low, z0, 0, low + 1, z0, snoutCol); v.set(-1, low, z0, 0x5a2a3a); v.set(0, low, z0, 0x5a2a3a); }
      else if (sn === "wide") { bx(v, -hw + 1, low, z0, hw - 2, low + 1, z0 + 1, snoutCol); for (const x of [-2, 1]) v.set(x, low + 1, z0 + 1, dark); }
      else if (sn === "tube") { bx(v, -1, low, z0, 0, low, z0 + 3, (x, y, z) => col(x, y, z)); }
      else if (sn === "trunk" || f.trunk) { bx(v, -1, low, z0, 0, low + 1, z0, (x, y, z) => col(x, y, z)); bx(v, -1, low - 4, z0 + 1, 0, low, z0 + 1, (x, y, z) => col(x, y, z)); bx(v, -1, low - 4, z0 + 2, 0, low - 4, z0 + 2, (x, y, z) => col(x, y, z)); }
      if (f.nose === "big") bx(v, -1, hh - 4, z0, 0, hh - 3, z0, 0x2a2a2a);
      if (f.bill) bx(v, -1, low, z0, 0, low, z0 + 1 + (hd > 3 ? 1 : 0), sid === "an-platypus" ? 0x3a3a3a : 0xf8a020);
      if (bk) {
        const bc = /crow|raven|magpie|woodpecker|heron/.test(sid) ? 0x2a2a2a : sid === "an-flamingo" ? 0xf0b0b8 : 0xf8b030;
        const y = Math.max(low, Math.floor(hh / 2) - 1);
        if (bk === "short") bx(v, -1, y, z0, 0, y, z0, bc);
        else if (bk === "long" || bk === "needle") bx(v, -1, y, z0, 0, y, z0 + (bk === "needle" ? 3 : 2), (x, yy, z) => bk === "needle" && x === 0 ? null : bc);
        else if (bk === "hook") { bx(v, -1, y, z0, 0, y + 1, z0, bc); v.set(-1, y, z0 + 1, bc); v.set(0, y, z0 + 1, bc); v.set(-1, y - 1, z0 + 1, mulC(bc, 0.8)); v.set(0, y - 1, z0 + 1, mulC(bc, 0.8)); }
        else if (bk === "big") bx(v, -1, y - 1, z0, 0, y + 1, z0 + 1, bc);
        else if (bk === "toucan") bx(v, -1, y - 1, z0, 0, y, z0 + 3, (x, yy, z) => z === z0 + 3 ? 0x1a1a1a : yy === y ? 0xf8e040 : 0xf8a020);
        else if (bk === "pouch") { bx(v, -1, y, z0, 0, y, z0 + 3, bc); bx(v, -1, y - 2, z0, 0, y - 1, z0 + 2, mixC(bc, 0xf8e0a0, 0.4)); }
        else if (bk === "bent") { bx(v, -1, y, z0, 0, y, z0 + 1, bc); bx(v, -1, y - 2, z0 + 1, 0, y - 1, z0 + 1, 0x1a1a1a); }
        else if (bk === "puffin") bx(v, -1, y - 1, z0, 0, y + 1, z0, (x, yy) => yy === y ? 0x3a4a6a : 0xf08a2a);
        else if (bk === "dolphin") bx(v, -1, low, z0, 0, low, z0 + 1, (x, yy, z) => col(x, yy, z));
        else bx(v, -1, y, z0, 0, y, z0, bc);
      }
      /* ears, on top */
      const ear = f.ears, top = hh;
      if (ear) for (const s of [-1, 1]) {
        const x = mx(s, hw - 1), xi = mx(s, hw - 2), ez = Math.max(0, Math.floor(hd / 2) - 1), inner = mixC(main, 0xf0a0a8, 0.5);
        if (ear === "point" || ear === "tuft") { v.set(x, top, ez, main); v.set(xi, top, ez, main); v.set(x, top + 1, ez, ear === "tuft" ? 0x2a2a2a : main); if (ear === "tuft") v.set(x, top + 2, ez, 0x2a2a2a); v.set(xi, top, ez + 1, inner); }
        else if (ear === "round") bx(v, x, top, ez, mx(s, hw - 2), top + 1, ez, (xx, y) => y === top + 1 && xx === mx(s, hw - 2) ? null : main);
        else if (ear === "big" || ear === "huge") { const n = ear === "huge" ? 4 : 2; bx(v, x, top, ez, mx(s, hw - 2), top + n, ez, (xx, y) => xx === xi && y < top + n ? inner : main); }
        else if (ear === "long") { bx(v, x, top, ez, x, top + Math.max(3, hh), ez, main); bx(v, x, top, ez + 1, x, top + Math.max(3, hh) - 1, ez + 1, inner); }
        else if (ear === "lop") bx(v, mx(s, hw), hh - 1, ez, mx(s, hw), 0, ez + 1, sec);
        else if (ear === "flop") bx(v, mx(s, hw), hh - 1, ez, mx(s, hw), hh - 3, ez, sec);
        else if (ear === "tiny") v.set(x, top, ez, main);
        else if (ear === "fan") bx(v, mx(s, hw), hh - 1, Math.max(0, ez - 1), mx(s, hw), 0, ez + 1, (xx, y, z) => col(xx, y, z));
        else if (ear === "fluffy") bx(v, mx(s, hw), hh - 1, ez, mx(s, hw + 1), hh - 2, ez, (xx) => xx === mx(s, hw + 1) ? 0xf0f0f0 : main);
      }
      /* horns, antlers, tusks and the rest */
      const hn = f.horns || f.horn, hc = 0xd8ccb0, hz = Math.max(0, Math.floor(hd / 2) - 1);
      if (hn === "nose") bx(v, -1, low + 2, z0, 0, low + 4, z0, (x, y) => y === low + 4 && x === 0 ? null : 0xd8d0c0);
      else if (hn === "spiral") bx(v, -1, top, hd - 2, 0, top + 3, hd - 2, (x, y) => (y & 1) ? 0xf8e080 : 0xf8f0c0);
      else if (hn) for (const s of [-1, 1]) {
        const x = mx(s, hw - 2);
        if (hn === "curve" || hn === "long") { v.set(x, top, hz, hc); v.set(x, top + 1, hz - 1, hc); if (hn === "long") { v.set(x, top + 2, hz - 2, hc); v.set(x, top + 2, hz - 3, hc); } else v.set(x, top + 1, hz - 2, hc); }
        else if (hn === "curl") { v.set(mx(s, hw - 1), top - 1, hz - 1, hc); v.set(mx(s, hw), top - 1, hz - 1, hc); v.set(mx(s, hw), top - 2, hz, hc); v.set(mx(s, hw), top - 3, hz + 1, hc); }
        else if (hn === "short") v.set(x, top, hz + 1, hc);
        else if (hn === "wide") { v.set(mx(s, hw - 1), top - 1, hz, hc); v.set(mx(s, hw), top - 1, hz, hc); v.set(mx(s, hw + 1), top, hz, hc); }
        else if (hn === "back") { v.set(x, top, hz - 1, hc); v.set(x, top, hz - 2, hc); v.set(x, top - 1, hz - 3, hc); }
        else if (hn === "antler") { v.set(x, top, hz, 0xf8e8a0); v.set(x, top + 1, hz, 0xf8e8a0); v.set(mx(s, hw - 1), top + 2, hz, 0xf8e8a0); }
        else if (hn === "cephalic") bx(v, mx(s, hw - 1), low, z0, mx(s, hw - 1), low + 1, z0 + 1, mulC(main, 0.8));
      }
      if (f.antlers) for (const s of [-1, 1]) {
        const ac = 0xa88a6a, x = mx(s, hw - 2), n = f.antlers === "big" || f.antlers === "palm" ? 4 : 3;
        for (let i = 0; i < n; i++) v.set(mx(s, hw - 2 + Math.floor(i / 2)), top + i, hz, ac);
        v.set(mx(s, hw - 1 + Math.floor(n / 2)), top + n - 1, hz - 1, ac); v.set(x, top + 2, hz + 1, ac);
        if (f.antlers === "palm") bx(v, mx(s, hw), top + 2, hz - 1, mx(s, hw + 1), top + 3, hz, ac);
      }
      if (f.ossicones) for (const s of [-1, 1]) { v.set(mx(s, hw - 2), top, hz, main); v.set(mx(s, hw - 2), top + 1, hz, 0x3a2a1a); }
      if (f.tusk === "spiral") bx(v, -1, low, z0, -1, low, z0 + 5, (x, y, z) => (z & 1) ? 0xf0ead8 : 0xd8d0b8);
      else if (f.tusks) for (const s of [-1, 1]) { const n = f.tusks === "long" || f.tusks === "big" ? 2 : 1; for (let i = 0; i < n; i++) v.set(mx(s, 1), low - i, z0 + i, 0xf0ead8); }
      if (f.whiskers) for (const s of [-1, 1]) { v.set(mx(s, 2), low + 1, z0, 0xe8e8e8); v.set(mx(s, 3), low, z0, 0xe8e8e8); }
      if (f.beard) bx(v, -1, -2, z0 - 1, 0, -1, z0 - 1, mixC(main, 0xf8f8f8, 0.4));
      if (f.crest || f.topknot) { const cc = f.crest === "flame" ? 0xff7a2a : L.second, n = f.crest === "big" ? 3 : 2; for (let i = 0; i < n; i++) { v.set(-1, top + i, hd - 2 - i, cc); v.set(0, top + i, hd - 2 - i, cc); } if (f.crest === "flame") gl.set(0, top + n, hd - 2 - n, 0xffd040); }
      if (f.comb) bx(v, -1, top, hd - 3, 0, top + (f.comb === "big" ? 1 : 0), hd - 1, 0xe83a3a);
      if (f.wattle) bx(v, -1, low - 1, z0 - 1, 0, low - 2, z0 - 1, 0xd83a3a);
      if (f.cap) bx(v, -hw + 1, hh - 1, 1, hw - 2, hh - 1, hd - 2, 0xd83a3a);
      if (f.brow) bx(v, -hw, hh - 2, hd, hw - 1, hh - 2, hd, mulC(main, 0.75));
      if (f.cheekpads) for (const s of [-1, 1]) bx(v, mx(s, hw), 1, hd - 3, mx(s, hw), hh - 3, hd - 1, mulC(main, 0.85));
      if (f.cheeks) for (const s of [-1, 1]) bx(v, mx(s, hw), 0, hd - 2, mx(s, hw), 1, hd - 1, L.belly);
      if (f.gills) for (const s of [-1, 1]) for (let i = 0; i < 3; i++) v.set(mx(s, hw + (i === 1 ? 1 : 0)), hh - 1 - i, 1, 0xe86a8a);
      if (f.frill) for (const s of [-1, 1]) bx(v, mx(s, hw), -1, 0, mx(s, hw), hh, 1, (x, y) => mixC(L.second, main, Math.abs(y - hh / 2) / hh));
      if (f.hood) for (const s of [-1, 1]) bx(v, mx(s, hw), -2, 0, mx(s, hw + 1), hh - 1, 0, (x, y, z) => col(x, y, z));
      if (f.hammer) for (const s of [-1, 1]) bx(v, mx(s, hw), 1, hd - 2, mx(s, hw + 2), 1, hd - 1, (x, y, z) => col(x, y, z));
      if (f.ruff) bx(v, -hw - 1, -1, -1, hw, 0, 1, 0xf8f8f8);
      if (f.dewlap) bx(v, -1, -2, hd - 2, 0, -1, hd - 2, L.second);
      if (f.teeth) { v.set(-1, low, z0, 0xf8f8f0); v.set(0, low, z0, 0xf8f8f0); }
      if (f.antennae) for (const s of [-1, 1]) { const fe = f.antennae === "feather"; line(v, mx(s, 1), top, hd - 1, mx(s, 2), top + 2, hd + 1, fe ? mulC(L.second, 0.7) : 0x3a3a3a); }
      if (f.eyes === "stalk") for (const s of [-1, 1]) bx(v, mx(s, 1), top, hd - 1, mx(s, 1), top + 1, hd - 1, main);
      if (f.mandibles) for (const s of [-1, 1]) { v.set(mx(s, 1), low, z0, mulC(main, 0.7)); v.set(mx(s, 1), low, z0 + 1, mulC(main, 0.7)); v.set(mx(s, 0), low, z0 + 2, mulC(main, 0.7)); }
      if (f.rivets) for (const x of [-hw, hw - 1]) v.set(x, hh - 1, Math.floor(hd / 2), 0x5a606a);
      if (f.glow) for (const s of [-1, 1]) gl.set(mx(s, 1), hh, hd - 1, 0xfff070);
      if (f.mane === "flame") for (let i = 0; i < 5; i++) gl.set(i & 1 ? -1 : 0, top + Math.floor(i / 2), hz - i, mixC(0xffe060, 0xff6a2a, i / 5));
      if (f.mane === "rainbow") for (let i = 0; i < 6; i++) v.set(-1 + (i & 1), top, hz - i + 2, fromHsl(i * 55, 0.7, 0.7));
    });
    /* the eyes: on the face (or on the sides, for birds and fish) */
    R.eyes = [];
    const big = f.eyes === "big" || f.eyes === "huge" || /owl/.test(L.sp.plan), ew = big && hw >= 3 ? 2 : 1, eh = big ? 2 : hh >= 5 ? 2 : 1;
    const ey = f.eyes === "top" ? hh - 1 : Math.max(1, hh - 2 - (eh > 1 ? 1 : 0)) + (eh > 1 ? 0.5 : 0);
    for (const s of [-1, 1]) {
      const e = eyeSet((s > 0 ? "R" : "L") + ":" + L.sp.plan, g, ew, eh, big ? 0x2a1a0a : 0x141414, ew * eh >= 2);
      if (opt.side) { e.position.set((s > 0 ? hw : -hw) * g + s * 0.002, (ey + (eh > 1 ? 0 : 0.5)) * g, (hd - 1.5) * g); e.rotation.y = s * PI / 2; }
      else { const ex = Math.max(1, hw - 2); e.position.set((s > 0 ? ex + (ew === 2 ? 1 : 0.5) : -ex - (ew === 2 ? 1 : 0.5)) * g, (ey + (eh > 1 ? 0 : 0.5)) * g, hd * g + 0.002); }
      head.add(e); R.eyes.push(e);
    }
    return head;
  }
  /* -- the tail, from the rump */
  function aTail(R, L, f, g, K, r, pos) {
    const t = f.tail; if (!t) return null;
    const col = aCol(L, "tail"), sec = L.second;
    const tl = part(`${K}:tail:${t}`, g, (v, gl) => {
      if (t === "brush") { bx(v, -1, -1, -1, 0, 0, -3, (x, y, z) => z <= -3 ? 0xf8f8f8 : col(x, y, z)); }
      else if (t === "bushy") { bx(v, -1, 0, -1, 0, r + 1, -2, (x, y, z) => col(x, y, z)); bx(v, -1, r + 1, -1, 0, r + 2, 0, (x, y, z) => col(x, y, z)); }
      else if (t === "puff") rbx(v, -1, -1, -1, 0, 0, -1, 0xf8f8f8, 3);
      else if (t === "curl") { v.set(0, 1, -1, mixC(L.main, 0xe86a8a, 0.2)); v.set(0, 2, -2, mixC(L.main, 0xe86a8a, 0.2)); v.set(0, 1, -2, mixC(L.main, 0xe86a8a, 0.2)); }
      else if (t === "stub") v.set(0, 0, -1, L.main);
      else if (t === "tuft") { line(v, 0, 0, -1, 0, -2, -3, (x, y, z) => col(x, y, z)); bx(v, -1, -3, -4, 0, -2, -4, f.mane ? mulC(sec, 0.9) : 0x2a2a2a); }
      else if (t === "ringed") bx(v, -1, -1, -1, 0, 0, -4, (x, y, z) => ((-z) & 1) ? sec : col(x, y, z));
      else if (t === "hair") bx(v, -1, -3, -1, 0, 0, -1, (x, y, z) => f.mane === "rainbow" ? fromHsl(-y * 60, 0.7, 0.7) : sec);
      else if (t === "thick") { bx(v, -1, -1, -1, 0, 0, -2, (x, y, z) => col(x, y, z)); bx(v, -1, -2, -3, 0, -2, -4, (x, y, z) => col(x, y, z)); }
      else if (t === "paddle") bx(v, -1, -1, -1, 0, -1, -3, (x, y, z) => z === -1 ? col(x, y, z) : 0x3a3a3a), bx(v, -2, -1, -2, 1, -1, -3, 0x3a3a3a);
      else if (t === "flat") bx(v, -2, 0, -1, 1, 0, -3, (x, y, z) => col(x, y, z));
      else if (t === "wag") line(v, 0, 0, -1, 0, 2, -2, (x, y, z) => col(x, y, z));
      else if (t === "blacktip") bx(v, 0, 0, -1, 0, 0, -3, (x, y, z) => z === -3 ? 0x1a1a1a : col(x, y, z));
      else if (t === "bone") line(v, 0, 0, -1, 0, 2, -2, 0xf0f0e8);
      else if (t === "antenna") { line(v, 0, 0, -1, 0, 3, -2, 0x8a909a); gl.set(0, 4, -2, 0xff4040); }
      else if (t === "key") { bx(v, 0, 0, -1, 0, 0, -2, 0xc8a040); bx(v, 0, -1, -3, 0, 1, -3, 0xd8b050); }
      else if (t === "bolt") for (const [y, z] of [[0, -1], [1, -2], [1, -3], [2, -4], [3, -4]]) gl.set(0, y, z, 0x6ac8ff);
      else if (t === "flame") for (const [y, z, k] of [[0, -1, 0], [1, -2, 0.3], [0, -3, 0.5], [1, -4, 0.8]]) gl.set(0, y, z, mixC(0xffe060, 0xff4a1a, k));
      else if (t === "fan") { for (let x = -4; x <= 3; x++) for (let y = 0; y <= 4 - Math.abs(x + 0.5) * 0.6; y++) v.set(x, y + 1, -1, L.sp.id === "an-peacock" ? ((x * 3 + y) % 4 === 0 ? 0x2a7ad8 : (y > 2 ? 0x3ad07a : 0x3a8a5a)) : mixC(L.main, sec, y / 4)); }
      else if (t === "fork") for (const s of [-1, 1]) line(v, 0, 0, -1, mx(s, 1), 0, -3, L.main);
      else if (t === "arch") { line(v, 0, 0, -1, 0, 3, -2, 0x2a6a3a); line(v, 0, 3, -2, 0, 1, -4, 0x3a8a4a); }
      else if (t === "plumes") for (let i = -1; i <= 1; i++) line(v, i, 0, -1, i * 2, -2, -4, i ? 0xf8c040 : 0xf8e080);
      else if (t === "sting") { line(v, 0, 0, -1, 0, 3, -2, L.main); v.set(0, 3, -1, L.main); v.set(0, 3, 0, 0x1a1a1a); }
      else if (t === "fin") bx(v, 0, 0, -1, 0, 2, -2, mixC(L.main, 0xffffff, 0.3));
      else if (t === "thin") line(v, 0, 0, -1, 0, -1, -4, mixC(L.main, 0xe8a0a8, 0.4));
      else line(v, 0, 0, -1, 0, -1, -4, (x, y, z) => col(x, y, z));                    // long
    });
    at(tl, pos[0], pos[1], pos[2], g); R.inner.add(tl); R.tails.push(tl);
    return tl;
  }
  /* -- a wing: feathered, leathery, clear, a butterfly's, or a flipper */
  function aWing(R, L, g, K, s, n, kind, pos) {
    const w = part(`${K}:wing${s}:${kind}:${n}`, g, v => {
      if (kind === "feather") for (let x = 0; x < n; x++) for (let z = 0; z >= -Math.max(1, Math.ceil((n - x) * 0.7)); z--) v.set(mx(s, x), 0, z, x >= n - 1 || z === -Math.ceil((n - x) * 0.7) ? L.second : mixC(L.main, L.second, x / n * 0.6));
      else if (kind === "leather") { for (let x = 0; x < n; x++) for (let y = -Math.floor((n - x) * 0.6); y <= 0; y++) v.set(mx(s, x), y + 1, 0, (x % 3 === 2) ? mulC(L.second, 0.7) : mixC(L.second, L.main, 0.3)); }
      else if (kind === "clear") for (let x = 0; x < n; x++) v.set(mx(s, x), 0, 0, 0xd8f0f8), v.set(mx(s, x), 0, -1, 0xc8e4f0);
      else if (kind === "butterfly" || kind === "moth") { for (let x = 0; x < n; x++) for (let y = -n + 1 + Math.floor(x / 2); y < n - Math.floor(x / 2); y++) v.set(mx(s, x), y, 0, (x === n - 1 || Math.abs(y) === n - 1 - Math.floor(x / 2)) ? L.second : (kind === "butterfly" && x === Math.floor(n / 2) && y === 1 ? 0xf8f8f8 : L.main)); }
      else if (kind === "flipper") bx(v, mx(s, 0), -1, 0, mx(s, Math.max(1, n - 1)), -1, -1, (x, y, z) => grain(L.main, x, y, z, 0.03));
      else if (kind === "mini") bx(v, mx(s, 0), 0, 0, mx(s, 1), 0, -2, L.second);
    });
    at(w, pos[0], pos[1], pos[2], g); R.inner.add(w); R.wings.push(w); w.userData.s = s;
    return w;
  }
  /* -- a leg: a column of voxels, a hoof, a paw or a bird's foot at the bottom */
  function aLeg(R, L, g, K, name, pos, len, w, foot) {
    const col = aCol(L, "leg");
    const l = part(`${K}:leg:${name}:${len}:${w}:${foot || ""}`, g, v => {
      const x0 = w > 1 ? -1 : 0;
      bx(v, x0, -len, x0, w > 1 ? 0 : 0, -1, w > 1 ? 0 : 0, (x, y, z) => col(x, y, z, { low: -len + 1 }));
      if (foot === "hoof") bx(v, x0, -len, x0, w > 1 ? 0 : 0, -len, w > 1 ? 0 : 0, mulC(L.second, 0.55));
      else if (foot === "talon") { v.set(0, -len, 1, 0xd8a040); v.set(0, -len, -1, 0xd8a040); }
      else if (foot === "web") bx(v, -1, -len, 0, 0, -len, 1, 0xf08a2a);
      else if (foot === "paw") v.set(0, -len, 1, (x => col(0, -len, 1, { low: -len + 1 }))());
    });
    at(l, pos[0], pos[1], pos[2], g); R.inner.add(l); R.legs.push(l);
    return l;
  }

  const BUILD = {};
  /* four-legged: most mammals, the dragon */
  BUILD.quad = (R, L, f, g, K, u) => {
    const sid = L.sp.id;
    let bl = Math.max(4, Math.round(u * 0.55)), bw = Math.max(2, Math.round(u * 0.15) * 2), bh = Math.max(3, Math.round(u * 0.3)), ll = Math.max(2, Math.round(u * 0.24)), hd = Math.max(3, Math.round(u * 0.26));
    if (f.legs === "long") ll = Math.round(ll * 1.6);
    if (/elephant|rhino|hippo|bear|buffalo|bull|moose|camel|giraffe|polarbear|panda/.test(sid)) { bh += 1; bw += 2; }
    if (/hippo|pig|boar|warthog|badger|wolverine|armadillo|pangolin|mole|shrew|guineapig|hamster|mouse|skunk|ferret|weasel|stoat|mongoose|hedgehog|porcupine|tapir/.test(sid)) ll = Math.max(1, Math.round(ll * 0.55));
    if (/ferret|weasel|stoat|mongoose|otter|cheetah/.test(sid)) { bl += 2; bh = Math.max(2, bh - 1); }
    const hw = Math.max(2, Math.floor(bw / 2) + (/lion|bear|tiger|panda|hippo/.test(sid) ? 1 : 0)), hh = Math.max(3, hd), col = aCol(L, "body");
    const body = part(K + ":body", g, (v, gl) => {
      const bz0 = -Math.floor(bl / 2), bz1 = bz0 + bl - 1, top = bh - 1;
      rbx(v, -bw / 2, 0, bz0, bw / 2 - 1, top, bz1, (x, y, z) => col(x, y, z, { under: 0, top, mid: 0 }), 3);
      if (f.wool) rbx(v, -bw / 2 - 1, 1, bz0 - 1, bw / 2, top + 1, bz1 + 1, (x, y, z) => (hash(x, y, z) < 0.25 ? null : grain(mixC(L.main, 0xffffff, (x + y + z) & 1 ? 0.15 : 0), x, y, z, 0.05)), 2);
      if (f.hump) { const n = +f.hump || 1; for (let i = 0; i < n; i++) rbx(v, -bw / 2 + 1, top + 1, (n > 1 ? (i ? bz0 + 1 : bz1 - 3) : -1), bw / 2 - 2, top + 2, (n > 1 ? (i ? bz0 + 3 : bz1 - 1) : 1), (x, y, z) => col(x, y, z), 2); }
      if (f.quills) for (let z = bz0; z <= bz1; z++) for (let x = -bw / 2; x < bw / 2; x++) if (((x + z) & 1) === 0) v.set(x, top + 1 + ((x * 3 + z) % 2 === 0 && f.quills === "long" ? 1 : 0), z, (x + z) % 3 === 0 ? 0xf0e8d8 : L.second);
      if (f.shell === "bands") for (let z = bz0 + 1; z < bz1; z += 2) bx(v, -bw / 2, 1, z, bw / 2 - 1, top, z, (x, y, zz) => v.has(x, y, zz) ? mulC(L.second, 0.8) : null);
      if (f.mane && f.mane !== "flame" && f.mane !== "rainbow") { if (/lion/.test(sid)) rbx(v, -bw / 2 - 1, 0, bz1 - 1, bw / 2, top + 1, bz1 + 1, (x, y, z) => grain(L.second, x, y, z, 0.08), 3); else bx(v, -1, top + 1, bz1 - 2, 0, top + 1, bz1, L.second); }
      if (f.spines) for (let z = bz0; z <= bz1; z += 2) v.set(-1, top + 1, z, L.second), v.set(0, top + 1, z, L.second);
      if (f.scutes) for (let z = bz0; z <= bz1; z += 2) for (const x of [-1, 0]) v.set(x, top + 1, z, mulC(L.main, 0.75));
      if (f.pouch) bx(v, -1, 1, bz1 + 1, 0, 2, bz1 + 1, L.belly);
      if (f.rivets) for (let z = bz0 + 1; z < bz1; z += 2) for (const x of [-bw / 2, bw / 2 - 1]) v.set(x, Math.floor(top / 2), z, 0x5a606a);
      if (f.wheel) for (const x of [-bw / 2 - 1, bw / 2]) rbx(v, x, -2, -1, x, 0, 1, 0x2a2a2a, 2);
      if (f.bones) for (let z = bz0 + 1; z < bz1; z += 2) bx(v, -bw / 2, top, z, bw / 2 - 1, top, z, 0xd8d8d0);
      if (f.glow) for (const x of [-bw / 2, bw / 2 - 1]) gl.set(x, Math.floor(top / 2), 0, 0xfff070);
      if (f.mane === "rainbow") for (let z = bz0; z <= bz1; z++) v.set(-1, top + 1, z, fromHsl(z * 50, 0.7, 0.7));
    });
    at(body, 0, ll, 0, g); R.inner.add(body); R.body = body;
    /* the neck and the head */
    const bz1 = -Math.floor(bl / 2) + bl - 1;
    let hy = ll + bh - Math.max(1, Math.floor(hh / 2)), hz = bz1 - 0;
    if (f.neck === "long" || f.neck === "tall" || f.neck === "bare") {
      const nl = f.neck === "tall" ? bh * 3 : Math.round(bh * 0.9);
      const neck = part(K + ":neck", g, v => bx(v, -1, 0, 0, 0, nl - 1, 1, (x, y, z) => col(x, y, z, { front: 1 })));
      at(neck, 0, ll + bh - 1, bz1 - 1, g); R.inner.add(neck); R.neck = neck;
      hy = ll + bh - 1 + nl - 1; hz = bz1;
    }
    const head = aHead(R, L, f, g, K, hw, hh, hd, {});
    at(head, 0, hy, hz, g); R.inner.add(head); R.head = head;
    /* legs */
    const lw = bw >= 6 ? 2 : 1, lx = bw / 2 - (lw > 1 ? 1 : 0.5) - 0.5, lz = Math.floor(bl / 2) - 1;
    const hoof = /cow|bull|buffalo|horse|pony|zebra|donkey|deer|fawn|reindeer|moose|elk|goat|ibex|sheep|ram|llama|alpaca|camel|giraffe|okapi|pig|boar|warthog|unicorn|pegasus|kirin|tapir/.test(sid) ? "hoof" : "paw";
    for (const [sx, sz, nm] of [[-1, 1, "fl"], [1, 1, "fr"], [-1, -1, "bl"], [1, -1, "br"]]) aLeg(R, L, g, K, nm, [sx * lx + (lw > 1 ? 0 : 0), ll, sz * lz + (sz < 0 ? 0 : -0.5)], ll, lw, hoof);
    aTail(R, L, f, g, K, 1, [0, ll + bh - 2, -Math.floor(bl / 2)]);
    if (f.wings) for (const s of [-1, 1]) aWing(R, L, g, K, s, Math.round(bl * 0.8), f.wings === "leather" ? "leather" : "feather", [s * bw / 2, ll + bh - 1, 1]);
    R.h = (hy + hh + 2) * g; R.r = Math.max(bw, bl * 0.6) * 0.5 * g; R.headY = (hy + hh / 2) * g; R.gait = "walk4"; R.legLen = ll;
  };
  BUILD.woolly = BUILD.quad; BUILD.dragon = BUILD.quad;
  /* hoppers: rabbits, squirrels, kangaroos -- sitting up, big hind feet, small front paws */
  BUILD.hopper = (R, L, f, g, K, u) => {
    const kang = /kangaroo|wallaby/.test(L.sp.id), col = aCol(L, "body");
    const bw = Math.max(2, Math.round(u * 0.17) * 2), bh = Math.max(3, Math.round(u * (kang ? 0.45 : 0.32))), bd = Math.max(3, Math.round(u * 0.3)), by = kang ? Math.round(u * 0.2) : 1;
    const body = part(K + ":body", g, v => { rbx(v, -bw / 2, 0, -Math.floor(bd / 2), bw / 2 - 1, bh - 1, Math.ceil(bd / 2) - 1, (x, y, z) => col(x, y, z, { front: Math.ceil(bd / 2) - 1, top: bh - 1 }), 2); if (f.pouch) bx(v, -1, 1, Math.ceil(bd / 2), 0, 2, Math.ceil(bd / 2), L.belly); if (f.stripes) for (const x of [-2, 1]) bx(v, x, 1, -Math.floor(bd / 2), x, bh - 1, -Math.floor(bd / 2), 0x3a2a1a); });
    at(body, 0, by, 0, g); R.inner.add(body); R.body = body;
    const hw = Math.max(2, bw / 2), hh = Math.max(3, Math.round(u * 0.3)), hd = Math.max(3, Math.round(u * 0.28));
    const head = aHead(R, L, f, g, K, hw, hh, hd, {}); at(head, 0, by + bh - 1, Math.ceil(bd / 2) - hd + 1, g); R.inner.add(head); R.head = head;
    for (const s of [-1, 1]) {
      const hind = part(`${K}:hind${s}`, g, v => { bx(v, mx(s, 0), -by - 1, -1, mx(s, 0), 0, 1, (x, y, z) => col(x, y, z)); bx(v, mx(s, 0), -by - 1, 1, mx(s, 0), -by - 1, kang ? 3 : 2, (x, y, z) => col(x, y, z, { low: 99 })); });
      at(hind, s * (bw / 2 - 0.5) + (s < 0 ? 0 : 0), by + 1, -Math.floor(bd / 2) + 1, g); R.inner.add(hind); R.legs.push(hind);
      const front = part(`${K}:front${s}`, g, v => bx(v, mx(s, 0), -Math.max(1, Math.round(bh * 0.4)), 0, mx(s, 0), 0, 0, (x, y, z) => col(x, y, z)));
      at(front, s * (bw / 2 - 1.5) + (s > 0 ? 0 : 0), by + Math.round(bh * 0.6), Math.ceil(bd / 2), g); R.inner.add(front); R.arms.push(front);
    }
    aTail(R, L, f, g, K, 1, [0, by + 1, -Math.floor(bd / 2)]);
    if (L.sp.plan === "glider") for (const s of [-1, 1]) aWing(R, L, g, K, s, 2, "mini", [s * bw / 2, by + 2, 0]);
    R.h = (by + bh + hh + 3) * g; R.r = bd * 0.6 * g; R.headY = (by + bh + hh / 2) * g; R.gait = "hop"; R.legLen = by + 1;
  };
  BUILD.glider = BUILD.hopper;
  /* the upright: primates, apes, meerkats, koalas */
  function biped(R, L, f, g, K, u, o) {
    const col = aCol(L, "body"), bw = Math.max(2, Math.round(u * o.w) * 2), bh = Math.max(3, Math.round(u * o.h)), bd = Math.max(2, Math.round(u * o.d)), ll = Math.max(2, Math.round(u * o.l));
    const body = part(K + ":body", g, v => rbx(v, -bw / 2, 0, -Math.floor(bd / 2), bw / 2 - 1, bh - 1, Math.ceil(bd / 2) - 1, (x, y, z) => col(x, y, z, { front: Math.ceil(bd / 2) - 1, top: bh - 1 }), 3));
    at(body, 0, ll, 0, g); R.inner.add(body); R.body = body;
    const hw = Math.max(2, Math.round(u * o.hw)), hh = Math.max(3, Math.round(u * o.hh)), hd = Math.max(3, hh);
    const head = aHead(R, L, f, g, K, hw, hh, hd, {}); at(head, 0, ll + bh, -Math.floor(hd / 2), g); R.inner.add(head); R.head = head;
    const al = Math.max(2, Math.round(u * o.a)), aw = o.thick ? 2 : 1;
    for (const s of [-1, 1]) {
      const arm = part(`${K}:arm${s}`, g, v => { bx(v, mx(s, 0), -al, aw > 1 ? -1 : 0, mx(s, aw - 1), 0, 0, (x, y, z) => col(x, y, z)); if (f.claws) v.set(mx(s, 0), -al - 1, 0, 0xe8e0d0); });
      at(arm, s * bw / 2, ll + bh - 1, 0, g); R.inner.add(arm); R.arms.push(arm);
      aLeg(R, L, g, K, "l" + s, [s * (bw / 2 - 1) + (s > 0 ? 0 : 0.5) - 0.5 + (s > 0 ? 0.5 : 0), ll, 0], ll, aw, "paw");
    }
    aTail(R, L, f, g, K, 1, [0, ll + 1, -Math.floor(bd / 2)]);
    R.h = (ll + bh + hh + 2) * g; R.r = Math.max(bw, bd) * 0.6 * g; R.headY = (ll + bh + hh / 2) * g; R.gait = "biped"; R.legLen = ll;
  }
  BUILD.primate = (R, L, f, g, K, u) => biped(R, L, f, g, K, u, { w: 0.16, h: 0.32, d: 0.25, l: 0.22, hw: 0.17, hh: 0.3, a: 0.32 });
  BUILD.ape = (R, L, f, g, K, u) => biped(R, L, f, g, K, u, { w: 0.22, h: 0.4, d: 0.3, l: 0.22, hw: 0.2, hh: 0.3, a: f.arms === "long" ? 0.5 : 0.42, thick: true });
  BUILD.upright = (R, L, f, g, K, u) => biped(R, L, f, g, K, u, { w: 0.13, h: 0.42, d: 0.22, l: 0.14, hw: 0.13, hh: 0.24, a: 0.16 });
  BUILD.climber = (R, L, f, g, K, u) => biped(R, L, f, g, K, u, { w: 0.18, h: 0.38, d: 0.3, l: 0.14, hw: 0.18, hh: 0.3, a: 0.28 });
  /* birds: a body, a head, a beak, two wings, a tail, two thin legs */
  function bird(R, L, f, g, K, u, o) {
    const col = aCol(L, "body"), bw = Math.max(2, Math.round(u * 0.14) * 2), bh = Math.max(3, Math.round(u * (o.up ? 0.5 : 0.3))), bl = Math.max(3, Math.round(u * (o.up ? 0.34 : 0.5)));
    const ll = Math.max(1, Math.round(u * 0.14 * (f.legs === "long" ? 1.6 : f.legs === "stilt" ? 3 : 1) * (o.ll || 1)));
    const body = part(K + ":body", g, v => {
      rbx(v, -bw / 2, 0, -Math.floor(bl / 2), bw / 2 - 1, bh - 1, Math.ceil(bl / 2) - 1, (x, y, z) => col(x, y, z, o.up ? { front: Math.ceil(bl / 2) - 1 } : { under: 0 }), 2);
      if (/flicky|wocky/.test(L.sp.id)) bx(v, -bw / 2 + 1, 0, Math.ceil(bl / 2) - 1, bw / 2 - 2, bh - 2, Math.ceil(bl / 2) - 1, L.belly);
    });
    at(body, 0, ll, 0, g); R.inner.add(body); R.body = body;
    let hy = ll + bh - (o.up ? 1 : 2), hz = o.up ? -1 : Math.ceil(bl / 2) - 2;
    if (f.neck === "long" || f.neck === "bare") {
      const nl = Math.max(2, Math.round(u * (o.neck || 0.4)));
      const neck = part(K + ":neck", g, v => bx(v, -1, 0, 0, 0, nl - 1, 0, (x, y, z) => f.neck === "bare" ? 0xd8a8a0 : col(x, y, z)));
      at(neck, 0, ll + bh - 1, Math.ceil(bl / 2) - 1, g); R.inner.add(neck); R.neck = neck;
      hy = ll + bh - 1 + nl - 1; hz = Math.ceil(bl / 2) - 2;
    }
    const hw = Math.max(1, Math.round(bw * (o.up && /owl/.test(L.sp.plan) ? 0.5 : 0.4))), hh = Math.max(2, Math.round(u * (o.hh || 0.22))), hd = Math.max(2, hh);
    const head = aHead(R, L, Object.assign({}, f, /owl/.test(L.sp.plan) ? { eyes: "big" } : {}), g, K, Math.max(hw, 1), hh, hd, { side: !o.front });
    at(head, 0, hy, hz, g); R.inner.add(head); R.head = head;
    const wn = Math.max(2, Math.round(bl * (f.flightless ? 0.5 : 0.9) * (f.wings === "long" ? 1.4 : 1)));
    for (const s of [-1, 1]) aWing(R, L, g, K, s, wn, o.flipper || f.flippers ? "flipper" : "feather", [s * bw / 2, ll + bh - 1, Math.ceil(bl / 2) - 1]);
    if (f.tail) aTail(R, L, f, g, K, 1, [0, ll + Math.floor(bh / 2), -Math.floor(bl / 2)]);
    else { const tg = part(K + ":wedge", g, v => bx(v, -1, 0, -1, 0, 0, -2, L.second)); at(tg, 0, ll + Math.floor(bh / 2), -Math.floor(bl / 2), g); R.inner.add(tg); R.tails.push(tg); }
    for (const s of [-1, 1]) aLeg(R, L, g, K, "l" + s, [s * Math.max(0.5, bw / 2 - 1.5) - 0.5, ll, 0], ll, 1, o.web ? "web" : "talon");
    R.h = (hy + hh + 2) * g; R.r = Math.max(bl, bw) * 0.55 * g; R.headY = (hy + hh / 2) * g; R.gait = f.flightless ? "biped" : "bird"; R.legLen = ll;
  }
  BUILD.bird = (R, L, f, g, K, u) => bird(R, L, f, g, K, u, {});
  BUILD.raptor = (R, L, f, g, K, u) => bird(R, L, f, g, K, u, { ll: 1.2 });
  BUILD.owl = (R, L, f, g, K, u) => bird(R, L, f, g, K, u, { up: true, front: true, hh: 0.3 });
  BUILD.penguin = (R, L, f, g, K, u) => bird(R, L, f, g, K, u, { up: true, front: true, flipper: true, web: true, ll: 0.6 });
  BUILD.wader = (R, L, f, g, K, u) => bird(R, L, Object.assign({ legs: "stilt" }, f), g, K, u, { neck: 0.5 });
  BUILD.waterfowl = (R, L, f, g, K, u) => bird(R, L, f, g, K, u, { web: true, ll: 0.6, neck: 0.45 });
  BUILD.ratite = (R, L, f, g, K, u) => bird(R, L, Object.assign({ flightless: true }, f), g, K, u, { neck: 0.55, ll: f.legs === "long" ? 1.8 : 1 });
  /* bats: a little furry body, leather wings, big ears */
  BUILD.bat = (R, L, f, g, K, u) => {
    const col = aCol(L, "body"), n = Math.max(3, Math.round(u * 0.3)), by = Math.round(u * 0.4);
    const body = part(K + ":body", g, v => rbx(v, -1, 0, -1, 0, n - 1, 0, (x, y, z) => col(x, y, z, { front: 0 }), 3)); at(body, 0, by, 0, g); R.inner.add(body); R.body = body;
    const head = aHead(R, L, f, g, K, 1, 2, 2, {}); at(head, 0, by + n, -1, g); R.inner.add(head); R.head = head;
    for (const s of [-1, 1]) aWing(R, L, g, K, s, Math.max(4, Math.round(u * 0.6)), "leather", [s * 1, by + n - 1, 0]);
    R.h = (by + n + 4) * g; R.r = u * 0.3 * g; R.headY = (by + n + 1) * g; R.gait = "fly"; R.hover = 0.9;
  };
  /* seals, otters, walruses: long and low, flippers */
  BUILD.seal = (R, L, f, g, K, u) => {
    const otter = /otter/.test(L.sp.id), col = aCol(L, "body"), bl = Math.round(u * 0.7), bw = Math.max(2, Math.round(u * 0.14) * 2), bh = Math.max(2, Math.round(u * 0.24));
    const body = part(K + ":body", g, v => { rbx(v, -bw / 2, 0, -Math.floor(bl / 2), bw / 2 - 1, bh - 1, Math.ceil(bl / 2) - 1, (x, y, z) => col(x, y, z, { under: 0 }), 2); rbx(v, -bw / 2, 1, Math.ceil(bl / 2) - 3, bw / 2 - 1, bh, Math.ceil(bl / 2) - 1, (x, y, z) => col(x, y, z), 2); });
    at(body, 0, otter ? 2 : 0, 0, g); R.inner.add(body); R.body = body;
    const hw = Math.max(1, bw / 2), hh = Math.max(2, bh), hd = Math.max(2, Math.round(u * 0.2));
    const head = aHead(R, L, f, g, K, hw, hh, hd, {}); at(head, 0, (otter ? 2 : 0) + bh - 1, Math.ceil(bl / 2) - 1, g); R.inner.add(head); R.head = head;
    if (otter) for (const [sx, sz, nm] of [[-1, 1, "fl"], [1, 1, "fr"], [-1, -1, "bl"], [1, -1, "br"]]) aLeg(R, L, g, K, nm, [sx * (bw / 2 - 0.5) - 0.5 + (sx > 0 ? 0.5 : 0.5), 2, sz * (Math.floor(bl / 2) - 1)], 2, 1, "paw");
    else for (const s of [-1, 1]) { aWing(R, L, g, K, s, 2, "flipper", [s * bw / 2, 1, 1]); const rear = part(`${K}:rear${s}`, g, v => bx(v, mx(s, 0), 0, -1, mx(s, 1), 0, -2, mulC(L.main, 0.9))); at(rear, 0, 0, -Math.floor(bl / 2), g); R.inner.add(rear); R.tails.push(rear); }
    if (otter) aTail(R, L, Object.assign({}, f, { tail: f.tail || "thick" }), g, K, 1, [0, 2, -Math.floor(bl / 2)]);
    R.h = (bh + hh + 3) * g; R.r = bl * 0.45 * g; R.headY = (bh + 1) * g; R.gait = otter ? "walk4" : "hump"; R.swims = true; R.legLen = 2;
  };
  /* turtles: a stepped shell, a head, stubby legs */
  BUILD.turtle = (R, L, f, g, K, u) => {
    const sea = /seaturtle/.test(L.sp.id), dome = f.shell === "dome", w = Math.max(4, Math.round(u * 0.25) * 2), l = Math.max(5, Math.round(u * 0.6));
    const shell = part(K + ":shell", g, v => {
      const z0 = -Math.floor(l / 2), z1 = z0 + l - 1;
      bx(v, -w / 2, 0, z0, w / 2 - 1, 0, z1, L.belly);
      rbx(v, -w / 2, 1, z0, w / 2 - 1, dome ? 3 : 2, z1, (x, y, z) => grain((((x + 8) >> 1) + ((z + 8) >> 1)) & 1 ? L.second : mixC(L.second, 0x3a2a1a, 0.25), x, y, z, 0.04), 2);
      rbx(v, -w / 2 + 1, dome ? 4 : 3, z0 + 1, w / 2 - 2, dome ? 4 : 3, z1 - 1, (x, y, z) => mixC(L.second, 0x3a2a1a, 0.15), 2);
    });
    at(shell, 0, 1, 0, g); R.inner.add(shell); R.body = shell;
    const head = aHead(R, L, f, g, K, 1, 2, 2, {}); at(head, 0, 1, Math.ceil(l / 2), g); R.inner.add(head); R.head = head;
    if (sea) for (const s of [-1, 1]) aWing(R, L, g, K, s, 3, "flipper", [s * w / 2, 1, 1]);
    for (const [sx, sz, nm] of [[-1, 1, "fl"], [1, 1, "fr"], [-1, -1, "bl"], [1, -1, "br"]]) if (!sea || sz < 0) aLeg(R, L, g, K, nm, [sx * (w / 2 - 0.5) + (sx > 0 ? 0 : 0), 1, sz * (Math.floor(l / 2) - 1)], 1, 1, "paw");
    aTail(R, L, Object.assign({}, f, { tail: "stub" }), g, K, 1, [0, 1, -Math.floor(l / 2)]);
    R.h = (dome ? 7 : 6) * g; R.r = l * 0.5 * g; R.headY = 2 * g; R.gait = "walk4"; R.slow = 0.5; R.swims = sea; R.legLen = 1;
  };
  /* frogs and toads: a squat block, eyes bulging on top, folded legs */
  BUILD.frog = (R, L, f, g, K, u) => {
    const col = aCol(L, "body"), w = Math.max(4, Math.round(u * 0.24) * 2), l = Math.max(4, Math.round(u * 0.5)), h = Math.max(2, Math.round(u * 0.25));
    const body = part(K + ":body", g, v => {
      rbx(v, -w / 2, 0, -Math.floor(l / 2), w / 2 - 1, h - 1, Math.ceil(l / 2) - 1, (x, y, z) => col(x, y, z, { under: 0 }), 2);
      if (f.warts) for (let i = 0; i < 8; i++) v.set(Math.floor(hash(i, 1, 0) * w) - w / 2, h - 1, Math.floor(hash(i, 2, 0) * l) - Math.floor(l / 2), mulC(L.main, 0.8));
      for (const s of [-1, 1]) bx(v, mx(s, w / 2 - 2), h, Math.ceil(l / 2) - 2, mx(s, w / 2 - 1), h, Math.ceil(l / 2) - 1, L.main);
    });
    at(body, 0, 1, 0, g); R.inner.add(body); R.body = body; R.head = body;
    R.eyes = [];
    for (const s of [-1, 1]) { const e = eyeSet("frog" + s, g, 1, 1, 0x141414, false); e.position.set((s > 0 ? w / 2 - 1.5 : -w / 2 + 1.5) * g, (1 + h + 0.5) * g, (Math.ceil(l / 2)) * g + 0.002); body.add(e); R.eyes.push(e); }
    for (const s of [-1, 1]) {
      const hind = part(`${K}:hind${s}`, g, v => { bx(v, mx(s, 0), 0, 0, mx(s, 1), 1, -2, L.main); bx(v, mx(s, 1), 0, 1, mx(s, 1), 0, 1, L.main); });
      at(hind, s * (w / 2), 0, -Math.floor(l / 2) + 1, g); R.inner.add(hind); R.legs.push(hind);
      const fr = part(`${K}:front${s}`, g, v => bx(v, mx(s, 0), -1, 0, mx(s, 0), 0, 0, L.main));
      at(fr, s * (w / 2 - 1), 1, Math.ceil(l / 2) - 1, g); R.inner.add(fr); R.arms.push(fr);
    }
    R.h = (h + 3) * g; R.r = l * 0.5 * g; R.headY = h * g; R.gait = "hop"; R.swims = true; R.legLen = 1;
  };
  /* lizards, newts, crocodiles: long and low, legs out at the sides, a long tail */
  BUILD.lizard = (R, L, f, g, K, u) => {
    const croc = L.sp.plan === "croc", col = aCol(L, "body"), bl = Math.max(4, Math.round(u * 0.45)), bw = Math.max(2, Math.round(u * 0.12) * 2), bh = Math.max(2, Math.round(u * 0.14));
    const body = part(K + ":body", g, v => {
      rbx(v, -bw / 2, 0, -Math.floor(bl / 2), bw / 2 - 1, bh - 1, Math.ceil(bl / 2) - 1, (x, y, z) => col(x, y, z, { under: 0, top: bh - 1 }), 3);
      if (f.spines || f.crest) for (let z = -Math.floor(bl / 2); z < Math.ceil(bl / 2); z += 2) v.set(-1, bh, z, L.second), v.set(0, bh, z, L.second);
      if (f.scutes) for (let z = -Math.floor(bl / 2); z < Math.ceil(bl / 2); z += 2) for (const x of [-1, 0]) v.set(x, bh, z, mulC(L.main, 0.72));
    });
    at(body, 0, 1, 0, g); R.inner.add(body); R.body = body;
    const hw = Math.max(1, bw / 2), hh = Math.max(2, bh), hd = Math.max(2, Math.round(u * (croc ? 0.12 : 0.1)));
    const head = aHead(R, L, Object.assign({}, f, croc ? { snout: f.snout === "wide" ? "wide" : "long", teeth: true } : {}), g, K, hw, hh, hd, {}); at(head, 0, 1, Math.ceil(bl / 2), g); R.inner.add(head); R.head = head;
    for (const [sx, sz, nm] of [[-1, 1, "fl"], [1, 1, "fr"], [-1, -1, "bl"], [1, -1, "br"]]) {
      const lg = part(`${K}:leg:${nm}`, g, v => { bx(v, mx(sx, 0), 0, 0, mx(sx, 1), 0, 0, L.main); bx(v, mx(sx, 1), -1, 0, mx(sx, 1), -1, 1, L.main); });
      at(lg, sx * bw / 2, 1, sz * (Math.floor(bl / 2) - 1), g); R.inner.add(lg); R.legs.push(lg);
    }
    const tl = Math.round(u * (croc ? 0.45 : 0.42));
    const tail = part(K + ":ltail", g, v => { for (let i = 0; i < tl; i++) { const w2 = i < tl / 2 ? 1 : 0; bx(v, w2 ? -1 : -1, 0, -1 - i, w2 ? 0 : -1, 0, -1 - i, (x, y, z) => col(x, y, z)); } if (f.tail === "fin") bx(v, -1, 1, -1, -1, 1, -tl + 1, mixC(L.main, 0xffffff, 0.3)); });
    at(tail, 0, 1, -Math.floor(bl / 2), g); R.inner.add(tail); R.tails.push(tail);
    R.h = (bh + hh + 3) * g; R.r = bl * 0.6 * g; R.headY = (bh + 1) * g; R.gait = "crawl"; R.swims = croc; R.legLen = 1;
  };
  BUILD.croc = BUILD.lizard;
  /* snakes and worms: a chain of segments, the head raised */
  BUILD.snake = (R, L, f, g, K, u) => {
    const col = aCol(L, "body"), n = 9, w = /python/.test(L.sp.id) ? 2 : 2;
    R.segs = [];
    for (let i = 0; i < n; i++) {
      const sg = part(`${K}:seg${i}`, g, v => bx(v, -1, 0, -1, 0, i > n - 3 ? 0 : 1, 0, (x, y, z) => f.pattern === "band" && (i % 2) ? grain(L.second, x, y, z) : f.pattern === "blotch" && hash(i, x, z) < 0.35 ? grain(L.second, x, y, z) : col(x, y, z, { under: 0 })));
      R.inner.add(sg); R.segs.push(sg);
    }
    R.segR = 0; R.segStep = 2;
    const head = aHead(R, L, Object.assign({}, f, f.hood ? {} : {}), g, K, 1, 2, 3, {}); R.inner.add(head); R.head = head;
    R.h = 6 * g; R.r = 8 * g; R.headY = 3 * g; R.gait = "slither"; R.S = g;
  };
  BUILD.worm = (R, L, f, g, K, u) => {
    R.segs = [];
    for (let i = 0; i < 6; i++) { const sg = part(`${K}:seg${i}`, g, v => rbx(v, -1, 0, -1, 0, 1, 0, (x, y, z) => grain(i % 2 ? L.second : L.main, x, y, z), 3)); R.inner.add(sg); R.segs.push(sg); }
    R.segR = 0; R.segStep = 2;
    const head = aHead(R, L, f, g, K, 1, 2, 2, {}); R.inner.add(head); R.head = head;
    R.h = 5 * g; R.r = 6 * g; R.headY = 2 * g; R.gait = "slither"; R.slow = 0.35; R.S = g;
  };
  /* fish, dolphins, whales: a body, a tail fin, fins; they live in the water */
  BUILD.fish = (R, L, f, g, K, u) => {
    const col = aCol(L, "body"), big = /dolphin|orca|whale|shark|narwhal|manatee|hammerhead/.test(L.sp.id);
    const bl = Math.max(4, Math.round(u * 0.6)), bw = Math.max(2, Math.round(u * 0.12) * 2), bh = Math.max(2, Math.round(u * (f.round ? 0.4 : 0.25)));
    const body = part(K + ":body", g, (v, gl) => {
      rbx(v, -bw / 2, 0, -Math.floor(bl / 2), bw / 2 - 1, bh - 1, Math.ceil(bl / 2) - 1, (x, y, z) => { let c = col(x, y, z, { under: 0, top: bh - 1 }); if (f.patch && y >= bh - 2 && z > 0 && z < 3) c = 0xf8f8f8; if (f.bands && (z & 3) === 0) c = 0xf8f8f8; return c; }, 2);
      if (f.fin === "back" || f.fin === "tall") bx(v, -1, bh, -1, 0, bh + (f.fin === "tall" ? 2 : 1), 0, (x, y, z) => y === bh + (f.fin === "tall" ? 2 : 1) && z === 0 ? null : mulC(L.main, 0.9));
      if (f.fin === "fancy" || /angelfish/.test(L.sp.id)) { bx(v, -1, bh, -2, -1, bh + 1, 0, mixC(L.main, L.second, 0.5)); bx(v, -1, -2, -2, -1, -1, 0, mixC(L.main, L.second, 0.5)); }
      if (f.spines) for (let i = 0; i < 10; i++) v.set(hash(i, 3, 1) < 0.5 ? -bw / 2 - 1 : bw / 2, Math.floor(hash(i, 4, 1) * bh), Math.floor(hash(i, 5, 1) * bl) - Math.floor(bl / 2), L.second);
      if (f.rivets) for (let z = -1; z <= 1; z++) v.set(-1, bh - 1, z * 2, 0x5a606a);
      if (f.key) bx(v, -1, bh, -1, -1, bh + 1, -1, 0xc8a040);
      if (f.grooves) for (let z = 0; z < Math.ceil(bl / 2); z += 2) bx(v, -bw / 2, 0, z, bw / 2 - 1, 0, z, 0xd8d8e0);
      if (f.legs === "fish") for (const s of [-1, 1]) bx(v, mx(s, 0), -2, 0, mx(s, 0), -1, 0, 0xf8c040);
    });
    at(body, 0, 1, 0, g); R.inner.add(body); R.body = body;
    const head = aHead(R, L, f, g, K, Math.max(1, bw / 2), bh, Math.max(1, Math.round(u * 0.1)), { side: true, k: "f" }); at(head, 0, 1, Math.ceil(bl / 2), g); R.inner.add(head); R.head = head;
    const tf = part(K + ":tailfin", g, v => { if (big && !/shark|hammerhead/.test(L.sp.id)) bx(v, -bw / 2 - 1, 0, -1, bw / 2, 0, -1, mulC(L.main, 0.92)); else bx(v, -1, -1, -1, 0, bh, -1, (x, y) => (y === -1 || y === bh) ? mixC(L.main, L.second, 0.4) : (y === Math.floor(bh / 2) ? null : mixC(L.main, L.second, 0.4))); });
    at(tf, 0, 1, -Math.floor(bl / 2), g); R.inner.add(tf); R.tails.push(tf);
    for (const s of [-1, 1]) aWing(R, L, g, K, s, 2, "flipper", [s * bw / 2, 2, 1]);
    R.h = (bh + 4) * g; R.r = bl * 0.5 * g; R.headY = (bh / 2 + 1) * g; R.gait = "swim"; R.aquatic = true;
  };
  BUILD.ray = (R, L, f, g, K, u) => {
    const col = aCol(L, "body"), w = Math.round(u * 0.5);
    const body = part(K + ":body", g, v => { for (let x = -w; x < w; x++) { const d = Math.round(w * 0.7 - Math.abs(x + 0.5) * 0.6); for (let z = -d; z <= d; z++) v.set(x, 0, z, col(x, 0, z, { under: -1 })); } line(v, 0, 0, -w * 0.6, 0, 0, -w * 1.6, L.main); });
    at(body, 0, 1, 0, g); R.inner.add(body); R.body = body;
    const head = aHead(R, L, f, g, K, 1, 1, 1, {}); at(head, 0, 1, Math.round(w * 0.6), g); R.inner.add(head); R.head = head;
    R.h = 4 * g; R.r = w * g; R.headY = g; R.gait = "swim"; R.aquatic = true;
  };
  BUILD.seahorse = (R, L, f, g, K, u) => {
    const col = aCol(L, "body"), n = Math.round(u * 0.7);
    const body = part(K + ":body", g, v => { for (let i = 0; i < n; i++) { const z = Math.round(Math.sin(i / n * 3) * 1.5); bx(v, -1, i, z, 0, i, z + (i > n * 0.3 ? 1 : 0), (x, y, zz) => (i & 1) ? col(x, y, zz) : grain(L.second, x, y, zz)); } bx(v, -1, 0, -2, 0, 0, -1, L.main); });
    at(body, 0, 0, 0, g); R.inner.add(body); R.body = body;
    const head = aHead(R, L, Object.assign({}, f, { snout: "tube" }), g, K, 1, 2, 2, { side: true }); at(head, 0, n, 0, g); R.inner.add(head); R.head = head;
    R.h = (n + 3) * g; R.r = 3 * g; R.headY = n * g; R.gait = "float"; R.aquatic = true;
  };
  BUILD.octopus = (R, L, f, g, K, u) => {
    const col = aCol(L, "body"), squid = /squid/.test(L.sp.id), w = Math.max(4, Math.round(u * 0.2) * 2), h = Math.round(u * (squid ? 0.5 : 0.32));
    const body = part(K + ":body", g, v => { rbx(v, -w / 2, 0, -w / 2, w / 2 - 1, h - 1, w / 2 - 1, (x, y, z) => col(x, y, z), 2); if (squid) for (const s of [-1, 1]) bx(v, mx(s, w / 2), h - 2, -1, mx(s, w / 2), h - 1, 0, L.second); });
    at(body, 0, 3, 0, g); R.inner.add(body); R.body = body; R.head = body;
    R.eyes = []; for (const s of [-1, 1]) { const e = eyeSet("oct" + s, g, 1, 2, 0x141414, true); e.position.set((s > 0 ? 1.5 : -1.5) * g, (1.5) * g, (w / 2) * g + 0.002); body.add(e); R.eyes.push(e); }
    for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2 + PI / 8; const t = part(`${K}:arm${i}`, g, v => { for (let k = 0; k < 4; k++) v.set(Math.round(Math.cos(a) * (1 + k)), -k + (k > 2 ? 1 : 0), Math.round(Math.sin(a) * (1 + k)), k > 2 ? L.second : L.main); }); at(t, 0, 3, 0, g); R.inner.add(t); R.legs.push(t); }
    R.h = (h + 5) * g; R.r = w * 0.8 * g; R.headY = (h / 2 + 3) * g; R.gait = "float"; R.aquatic = true;
  };
  BUILD.jelly = (R, L, f, g, K, u) => {
    const w = Math.max(4, Math.round(u * 0.25) * 2);
    const body = part(K + ":body", g, (v, gl) => { rbx(v, -w / 2, 0, -w / 2, w / 2 - 1, Math.round(w * 0.5), w / 2 - 1, (x, y, z) => mixC(L.main, L.second, y / w), 2); gl.set(-1, 1, 0, L.second); gl.set(0, 1, -1, L.second); }, "glass");
    at(body, 0, 8, 0, g); R.inner.add(body); R.body = body; R.head = body; R.eyes = [];
    for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; const t = part(`${K}:ten${i}:${i & 1}`, g, v => { for (let k = 0; k < 6; k++) v.set(k % 3 === 1 ? 1 : 0, -k, 0, mixC(L.main, 0xffffff, 0.3)); }, "glass"); at(t, Math.round(Math.cos(a) * w * 0.3), 8, Math.round(Math.sin(a) * w * 0.3), g); R.inner.add(t); R.legs.push(t); }
    R.h = (8 + w * 0.6) * g; R.r = w * 0.6 * g; R.headY = 9 * g; R.gait = "float"; R.aquatic = true;
  };
  BUILD.crab = (R, L, f, g, K, u) => {
    const col = aCol(L, "body"), lob = /lobster|scorpion/.test(L.sp.id), w = Math.max(4, Math.round(u * (lob ? 0.2 : 0.35)) * 2 / 2 * 2), l = Math.max(3, Math.round(u * (lob ? 0.5 : 0.3)));
    const body = part(K + ":body", g, v => rbx(v, -w / 2, 0, -Math.floor(l / 2), w / 2 - 1, 1, Math.ceil(l / 2) - 1, (x, y, z) => col(x, y, z, { under: 0 }), 3));
    at(body, 0, 2, 0, g); R.inner.add(body); R.body = body;
    const head = aHead(R, L, Object.assign({ eyes: "stalk" }, f), g, K, 1, 1, 1, {}); at(head, 0, 3, Math.ceil(l / 2) - 1, g); R.inner.add(head); R.head = head;
    for (const s of [-1, 1]) {
      const cl = part(`${K}:claw${s}`, g, v => { bx(v, mx(s, 0), 0, 0, mx(s, 0), 0, 1, L.main); rbx(v, mx(s, 0), 0, 2, mx(s, 1), 1, 3, L.main, 3); v.set(mx(s, 0), 1, 4, L.second); });
      at(cl, s * (w / 2), 2, Math.ceil(l / 2) - 1, g); R.inner.add(cl); R.arms.push(cl);
      for (let i = 0; i < 3; i++) { const lg = part(`${K}:cleg${s}${i}`, g, v => { v.set(mx(s, 0), 0, 0, mulC(L.main, 0.85)); v.set(mx(s, 1), -1, 0, mulC(L.main, 0.85)); v.set(mx(s, 1), -2, 0, mulC(L.main, 0.85)); }); at(lg, s * w / 2, 2, -Math.floor(l / 2) + i, g); R.inner.add(lg); R.legs.push(lg); }
    }
    if (lob) aTail(R, L, Object.assign({}, f, { tail: /scorpion/.test(L.sp.id) ? "sting" : "fan" }), g, K, 1, [0, 2, -Math.floor(l / 2)]);
    R.h = 6 * g; R.r = w * 0.6 * g; R.headY = 3 * g; R.gait = "crawl"; R.swims = !/scorpion/.test(L.sp.id);
  };
  BUILD.star = (R, L, f, g, K, u) => {
    const col = aCol(L, "body"), n = Math.round(u * 0.35);
    const body = part(K + ":body", g, v => { for (let i = 0; i < 5; i++) { const a = i / 5 * PI * 2; line(v, 0, 0, 0, Math.cos(a) * n, 0, Math.sin(a) * n, (x, y, z) => col(x, y, z)); } bx(v, -1, 0, -1, 0, 1, 0, L.main); });
    at(body, 0, 1, 0, g); R.inner.add(body); R.body = body; R.head = body;
    R.eyes = []; for (const s of [-1, 1]) { const e = eyeSet("star" + s, g, 1, 1, 0x141414, false); e.rotation.x = -PI / 2; e.position.set((s > 0 ? 0.5 : -1.5) * g, 3 * g + 0.002, 0.5 * g); body.add(e); R.eyes.push(e); }
    R.h = 3 * g; R.r = n * g; R.headY = g; R.gait = "crawl"; R.slow = 0.3; R.swims = true;
  };
  /* bugs: a body, six legs, antennae, wings or a shell */
  BUILD.bug = (R, L, f, g, K, u) => {
    const col = aCol(L, "body"), dome = /ladybug|beetle|stag|moto/.test(L.sp.id), w = Math.max(2, Math.round(u * 0.2) * 2), l = Math.max(3, Math.round(u * 0.45));
    const body = part(K + ":body", g, (v, gl) => {
      if (dome) rbx(v, -w / 2, 0, -Math.floor(l / 2), w / 2 - 1, Math.max(1, Math.round(w * 0.6)), Math.ceil(l / 2) - 1, (x, y, z) => { let c = col(x, y, z); if (L.sp.id === "an-ladybug" && (x === -1 || x === 0) && y > 0) c = 0x1a1a1a; if (L.sp.id === "an-beetle") c = mixC(c, 0x8ae0a0, (x + z) & 1 ? 0.2 : 0); return c; }, 2);
      else { rbx(v, -1, 0, 0, 0, 1, 1, (x, y, z) => col(x, y, z), 3); rbx(v, -w / 2, 0, -l + 1, w / 2 - 1, 1, -1, (x, y, z) => grain(f.bands && (z & 1) ? L.second : L.main, x, y, z), 3); }
      if (f.glow === "tail") bx(gl, -1, 0, -l, 0, 1, -l, 0xf8f060);
      if (f.horn) { v.set(-1, 2, 1, mulC(L.main, 0.7)); v.set(-1, 3, 2, mulC(L.main, 0.7)); }
      if (f.wheel) for (const x of [-w / 2 - 1, w / 2]) rbx(v, x, -2, -1, x, 0, 1, 0x2a2a3a, 2);
      if (f.rivets) for (let z = -1; z <= 1; z++) v.set(-w / 2, 1, z * 2, 0x5a606a);
    });
    at(body, 0, 2, 0, g); R.inner.add(body); R.body = body;
    const head = aHead(R, L, f, g, K, 1, 2, 2, {}); at(head, 0, 2, dome ? Math.ceil(l / 2) : 2, g); R.inner.add(head); R.head = head;
    if (f.wings) for (const s of [-1, 1]) aWing(R, L, g, K, s, Math.max(3, Math.round(u * 0.45)), "clear", [s * 1, 4, -1]);
    if (!f.wheel) for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const lg = part(`${K}:bleg${s}${i}`, g, v => { v.set(mx(s, 0), 0, 0, 0x2a2a2a); v.set(mx(s, 1), -1, 0, 0x2a2a2a); }); at(lg, s * (w / 2), 2, -1 + i, g); R.inner.add(lg); R.legs.push(lg); }
    R.h = 7 * g; R.r = l * 0.5 * g; R.headY = 3 * g; R.gait = f.wings && !dome ? "fly" : "crawl"; R.hover = f.wings && !dome ? 0.5 : 0;
  };
  BUILD.butterfly = (R, L, f, g, K, u) => {
    const body = part(K + ":body", g, v => bx(v, -1, 0, -2, 0, 0, 1, L.belly)); at(body, 0, 4, 0, g); R.inner.add(body); R.body = body;
    const head = aHead(R, L, f, g, K, 1, 1, 1, {}); at(head, 0, 4, 2, g); R.inner.add(head); R.head = head;
    for (const s of [-1, 1]) { const w = aWing(R, L, g, K, s, Math.max(3, Math.round(u * 0.35)), L.sp.id === "an-moth" ? "moth" : "butterfly", [s * 1, 4, 0]); w.rotation.x = -PI / 2.4; }
    R.h = 8 * g; R.r = u * 0.35 * g; R.headY = 4 * g; R.gait = "fly"; R.hover = 0.7;
  };
  BUILD.snail = (R, L, f, g, K, u) => {
    const n = Math.max(3, Math.round(u * 0.3));
    const body = part(K + ":body", g, v => { bx(v, -1, 0, -2, 0, 0, n, L.main); bx(v, -1, 1, n - 1, 0, 1, n, L.main); rbx(v, -1, 1, -2, 0, n + 1, n - 2, (x, y, z) => ((y + z) & 1) ? L.second : mixC(L.second, 0x5a3a1a, 0.3), 2); v.set(-2, Math.floor(n / 2) + 1, Math.floor(n / 2) - 2, mixC(L.second, 0x5a3a1a, 0.5)); });
    at(body, 0, 0, 0, g); R.inner.add(body); R.body = body;
    const head = aHead(R, L, Object.assign({ eyes: "stalk" }, f), g, K, 1, 1, 1, {}); at(head, 0, 1, n + 1, g); R.inner.add(head); R.head = head;
    R.h = (n + 3) * g; R.r = n * g; R.headY = 2 * g; R.gait = "crawl"; R.slow = 0.25;
  };
  BUILD.spider = (R, L, f, g, K, u) => {
    const body = part(K + ":body", g, v => { rbx(v, -2, 0, -4, 1, 2, -1, (x, y, z) => y === 2 && (x === -1 || x === 0) ? L.second : L.main, 2); rbx(v, -1, 0, 0, 0, 1, 1, L.main, 3); });
    at(body, 0, 2, 0, g); R.inner.add(body); R.body = body; R.head = body;
    R.eyes = []; for (const s of [-1, 1]) { const e = eyeSet("sp" + s, g, 1, 1, 0xe83a3a, false); e.position.set((s > 0 ? 0.5 : -0.5) * g, 3.5 * g, 2 * g + 0.002); body.add(e); R.eyes.push(e); }
    for (const s of [-1, 1]) for (let i = 0; i < 4; i++) { const lg = part(`${K}:sleg${s}${i}`, g, v => { v.set(mx(s, 0), 0, 0, mulC(L.main, 0.85)); v.set(mx(s, 1), 1, 0, mulC(L.main, 0.85)); v.set(mx(s, 2), 0, 0, mulC(L.main, 0.85)); v.set(mx(s, 3), -1, 0, mulC(L.main, 0.85)); }); at(lg, s * 1, 2, 1 - i, g); R.inner.add(lg); R.legs.push(lg); }
    R.h = 5 * g; R.r = 4 * g; R.headY = 3 * g; R.gait = "crawl";
  };
  function buildAnimal(c) {
    const L = animalLook(c), sp = L.sp, f = sp.feat || {};
    const g = clamp(sp.size / 12, 0.03, 0.0625), u = sp.size / g;
    const K = `an:${sp.id}:${L.main}:${L.second}:${L.belly}:${L.pat}:${g}`;
    const R = { g: new THREE.Group(), kind: "animal", plan: sp.plan, legs: [], arms: [], wings: [], tails: [], L, S: g };
    const inner = new THREE.Group(); R.g.add(inner); R.inner = inner;
    (BUILD[sp.plan] || BUILD.quad)(R, L, f, g, K, u);
    R.g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    R.shadow = blob(Math.max(0.12, R.r || 0.3)); R.g.add(R.shadow);
    R.g.scale.setScalar((c.genes && c.genes.size) || 1);
    return R;
  }

  /* ---------------------------------------------------------------- animation
     One animator for every creature: its gait decides how legs, arms, wings and tails move
     in each state (idle, walk, run, sit, sleep, eat, happy, sad, swim, fly, held, dance, cry). */
  function anim(R, t, dt, st, sp) {
    st = st || "idle"; sp = sp || 0;
    const g = R.gait || "walk4", moving = st === "walk" || st === "run" || st === "swim" || st === "fly";
    const f = (st === "run" ? 13 : st === "walk" ? 8 : 5) * (R.slow || 1);
    R.ph = (R.ph || 0) + dt * (moving ? f * Math.max(0.5, Math.min(1.6, sp)) : 2);
    const ph = R.ph, amp = st === "run" ? 0.9 : 0.6, inner = R.inner;
    inner.position.set(0, 0, 0); inner.rotation.set(0, 0, 0);
    if (g === "walk4" || g === "crawl") R.legs.forEach((l, i) => { const o = (i === 0 || i === 3) ? 0 : PI; l.rotation.x = moving ? Math.sin(ph + o) * amp * 0.8 : 0; l.rotation.z = 0; });
    else if (g === "biped" || g === "chao" || g === "chaofly" || g === "bird") R.legs.forEach((l, i) => { l.rotation.x = moving ? Math.sin(ph + i * PI) * amp : 0; });
    else if (g === "hop") { const hop = moving ? Math.abs(Math.sin(ph * 0.5)) : 0; inner.position.y = hop * (R.h || 0.3) * 0.3; R.legs.forEach(l => l.rotation.x = moving ? -Math.cos(ph * 0.5) * 0.6 : 0); }
    else if (g === "float") R.legs.forEach((l, i) => { l.rotation.x = Math.sin(t * 2 + i) * 0.25; l.rotation.z = Math.cos(t * 2 + i * 1.3) * 0.2; });
    R.arms.forEach((a, i) => { a.rotation.x = moving && g !== "hop" ? -Math.sin(ph + i * PI) * amp * 0.8 : 0; a.rotation.z = R.kind === "chao" ? (i ? 1 : -1) * 0.3 : 0; });
    R.wings.forEach(w => { const s = w.userData.s || 1; const flap = st === "fly" || g === "fly" ? Math.sin(t * (R.kind === "chao" ? 14 : 18)) * 0.8 : g === "swim" || st === "swim" ? Math.sin(t * 6) * 0.4 : Math.sin(t * 1.6) * 0.06; w.rotation.z = -s * flap; });
    R.tails.forEach((tl, i) => { tl.rotation.y = Math.sin(t * (st === "happy" ? 12 : g === "swim" ? 7 : 3) + i) * (st === "happy" ? 0.5 : g === "swim" ? 0.45 : 0.18); });
    if (R.segs) {
      const S = R.S, n = R.segs.length, wav = moving ? 1 : 0.35, step = R.segStep || 2;
      for (let i = 0; i < n; i++) { const x = Math.round(Math.sin(ph * 0.7 - i * 0.8) * 1.6 * wav * (i / n + 0.3)); R.segs[i].position.set(x * S, 0, (-i * step + 4) * S); }
      if (R.head) R.head.position.set(Math.round(Math.sin(ph * 0.7 + 0.8) * 1.2 * wav) * S, 1 * S, 5 * S);
    } else if (moving && g !== "hop") inner.position.y = Math.abs(Math.sin(ph)) * (R.h || 0.4) * (g === "chao" ? 0.05 : 0.03);
    if (g === "swim" || R.aquatic) inner.rotation.z = Math.sin(t * 2) * 0.05;
    if (g === "hump" && moving) { inner.position.y = Math.abs(Math.sin(ph * 0.5)) * 0.05; inner.rotation.x = Math.sin(ph * 0.5) * 0.1; }
    if (g === "fly" || R.hover) inner.position.y = (R.hover || 0.6) * (R.h || 0.3) + Math.sin(t * 3) * 0.04;
    if (st === "fly" && R.kind !== "animal") inner.position.y = 0.25 + Math.sin(t * 3) * 0.04;
    const head = R.head, own = head && head !== R.body && !R.segs;
    if (own) head.rotation.set(0, 0, 0);
    if (st === "idle" && own) { head.rotation.y = Math.sin(t * 0.7 + (R.seed || 0)) * 0.25; head.rotation.x = Math.sin(t * 0.5) * 0.05; }
    const drop = (R.legLen || 2) * (R.S || GC);
    if (st === "sit") { inner.position.y = -drop * 0.6; R.legs.forEach(l => l.rotation.x = -1.2); if (R.kind === "chao") R.arms.forEach((a, i) => a.rotation.z = (i ? 1 : -1) * 0.5); }
    if (st === "sleep") { inner.rotation.z = R.kind === "chao" ? PI / 2.2 : 0; inner.position.y = R.kind === "chao" ? 0.14 : -drop * 0.6; if (R.kind !== "chao") R.legs.forEach(l => l.rotation.x = -1.3); if (own) head.rotation.x = 0.35; }
    if (st === "eat" && own) { head.rotation.x = 0.3 + Math.abs(Math.sin(t * 9)) * 0.25; R.arms.forEach((a, i) => { a.rotation.x = -1.3; a.rotation.z = (i ? 1 : -1) * 0.5; }); }
    if (st === "happy") { inner.position.y = Math.abs(Math.sin(t * 9)) * 0.08; R.arms.forEach((a, i) => a.rotation.z = (i ? 1 : -1) * (1.8 + Math.sin(t * 18) * 0.4)); }
    if (st === "dance") { inner.rotation.y = Math.sin(t * 4) * 0.6; inner.position.y = Math.abs(Math.sin(t * 8)) * 0.05; R.arms.forEach((a, i) => a.rotation.z = (i ? 1 : -1) * (1 + Math.sin(t * 8 + i * PI) * 0.8)); }
    if (st === "sad" || st === "cry") { if (own) head.rotation.x = 0.35; R.arms.forEach((a, i) => { a.rotation.x = -0.9 - (st === "cry" ? Math.abs(Math.sin(t * 12)) * 0.4 : 0); a.rotation.z = (i ? -1 : 1) * 0.3; }); }
    if (st === "held") { R.legs.forEach((l, i) => l.rotation.x = Math.sin(t * 8 + i * PI) * 0.5); R.arms.forEach((a, i) => a.rotation.z = (i ? 1 : -1) * 0.9); }
    if (st === "carry") R.arms.forEach((a, i) => { a.rotation.x = -1.35; a.rotation.z = (i ? -1 : 1) * 0.25; });
    if (st === "swim" && R.kind !== "animal") { inner.rotation.x = 0.9; inner.position.y = 0.05; R.legs.forEach((l, i) => l.rotation.x = Math.sin(t * 10 + i * PI) * 0.7); R.arms.forEach((a, i) => a.rotation.x = -2.4 + Math.sin(t * 6 + i * PI) * 0.9); }
    if (st === "train") { inner.position.y = Math.abs(Math.sin(t * 10)) * 0.06; R.arms.forEach((a, i) => a.rotation.x = -Math.sin(t * 10 + i * PI) * 1.2); }
    if (R.ball) { const b = R.ball, ty = R.ballY + inner.position.y + Math.sin(t * 2.2) * 0.015; b.userData.vy = (b.userData.vy || 0) * 0.82 + (ty - b.position.y) * 0.3; b.position.y += b.userData.vy; b.rotation.y += dt * (R.L && R.L.ball === "gear" ? 1.5 : 0.8); }
    R.blink = (R.blink == null ? 2 + Math.random() * 3 : R.blink) - dt;
    const face = R.face || (st === "sleep" ? "shut" : st === "happy" || st === "dance" ? "happy" : st === "sad" || st === "cry" ? "sad" : null);
    if (face) setEyes(R.eyes, face);
    else if (R.blink < 0) { setEyes(R.eyes, "shut"); if (R.blink < -0.12) R.blink = 2 + Math.random() * 4; }
    else setEyes(R.eyes, "open");
    if (R.mouth) { const open = st === "happy" || st === "eat" || st === "cry" || st === "dance"; R.mouth.open.visible = open; R.mouth.shut.visible = !open; }
    if (R.shadow) R.shadow.scale.setScalar(1 / (1 + Math.max(0, inner.position.y) * 2));
  }
  function emote(R, k) { if (!R || !R.balls) return; if (k === "sleep") k = "zz"; for (const n in R.balls) R.balls[n].visible = n === (k || "ball"); }
  function creature(c) {
    const sp = D.species(c.sp), R = sp && sp.kind === "animal" ? buildAnimal(c) : buildChao(c);
    R.seed = Math.random() * 10; R.anim = (t, dt, st, spd) => anim(R, t, dt, st, spd);
    return R;
  }

  /* ---------------------------------------------------------------- the garden's things
     On the same grain as the creatures (a sixteenth), the trees on twice that */
  const FG = 0.0625;
  function prop(kind, o) {
    o = o || {};
    if (kind === "fruit") {
      const f = D.food(o.id) || D.FOODS[0], c = f.c, hi = mixC(c, 0xffffff, 0.35), lo = mulC(c, 0.82);
      return part("fruit:" + f.id, FG, (v, gl) => {
        if (f.id === "triangle") { bx(v, -2, 0, -2, 1, 0, 1, lo); bx(v, -2, 1, -1, 1, 1, 0, c); bx(v, -1, 1, -2, 0, 1, 1, c); bx(v, -1, 2, -1, 0, 2, 0, hi); }
        else if (f.id === "square") bx(v, -2, 0, -2, 1, 3, 1, (x, y, z) => (y === 3 ? hi : (x === -2 || x === 1) && (z === -2 || z === 1) ? lo : c));
        else if (f.id === "heart") { const rows = [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."]; rows.forEach((r, i) => [...r].forEach((ch, x) => { if (ch === "X") { v.set(x - 3, 5 - i, 0, i < 2 ? hi : c); v.set(x - 3, 5 - i, -1, lo); } })); }
        else if (f.id.startsWith("chaosdrive")) { bx(v, -1, 0, -1, 0, 0, 0, 0x8a909a); bx(gl, -1, 1, -1, 0, 3, 0, c); bx(v, -1, 4, -1, 0, 4, 0, 0x8a909a); }
        else if (f.id === "nut") { rbx(v, -1, 0, -1, 0, 2, 0, c, 3); bx(v, -1, 2, -1, 0, 2, 0, 0x6a4a2a); }
        else if (f.id === "fish") { bx(v, -1, 0, -2, 0, 1, 1, c); v.set(-1, 0, -3, c); v.set(0, 1, -3, c); v.set(0, 1, 1, 0x1a1a1a); }
        else if (f.id === "candy") { rbx(v, -1, 0, -1, 0, 1, 0, (x, y) => (x + y) & 1 ? 0xffffff : c, 3); v.set(-2, 0, 0, c); v.set(1, 1, -1, c); }
        else if (f.id === "mushroom") { bx(v, -1, 0, -1, 0, 1, 0, 0xf0e8d8); rbx(v, -2, 2, -2, 1, 3, 1, (x, y, z) => y === 3 && ((x + z) & 1) ? 0xffffff : c, 2); }
        else if (f.id === "berry") { for (const [x, y, z] of [[0, 0, 0], [-1, 0, -1], [0, 1, -1], [-1, 1, 0]]) v.set(x, y, z, c); v.set(0, 1, 0, hi); }
        else { rbx(v, -2, 0, -2, 1, 3, 1, (x, y, z) => (y === 3 || (x === -2 && y === 2)) ? hi : y === 0 ? lo : c, 2); }
        if (["round", "triangle", "square", "heart"].includes(f.id)) { const ty = f.id === "heart" ? 6 : f.id === "triangle" ? 3 : 4; v.set(-1, ty, 0, 0x6a4a2a); v.set(0, ty + 1, 0, 0x4ab040); v.set(1, ty + 1, 0, 0x4ab040); }
      });
    }
    if (kind === "egg") {
      const look = o.look || [0xf4f0e4, 0x9ad8f8], spots = o.spots || 0;
      return part(`egg:${look[0]}:${look[1]}:${spots}`, FG, v => {
        const rows = [[0, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 2], [6, 2], [7, 1]];
        for (const [y, r] of rows) bx(v, -r, y, -r, r - 1, y, r - 1, (x, yy, z) => {
          if ((Math.abs(x + 0.5) > r - 1) && (Math.abs(z + 0.5) > r - 1)) return null;
          let c = look[0];
          if (spots === 0 && yy >= 4) c = look[1];
          if (spots === 1 && hash(x, yy, z) < 0.25) c = look[1];
          if (spots === 2 && (yy === 2 || yy === 5)) c = look[1];
          if (spots === 3 && ((x + yy + z) & 1) === 0 && yy > 1 && yy < 6) c = look[1];
          return yy === 7 || (x < 0 && z > 0 && yy > 4) ? mixC(c, 0xffffff, 0.2) : c;
        });
      });
    }
    if (kind === "toy") {
      const t = D.toy(o.id) || D.TOYS[0];
      return part("toy:" + t.id, FG, (v, gl) => {
        if (t.id === "ball") rbx(v, -2, 0, -2, 1, 3, 1, (x, y, z) => ((x + 2) >> 1) + (y >> 1) + ((z + 2) >> 1) & 1 ? 0xf8f8f8 : t.c, 2);
        else if (t.id === "duck") { bx(v, -1, 0, -2, 0, 1, 1, t.c); bx(v, -1, 2, 0, 0, 3, 1, t.c); bx(v, -1, 2, 2, 0, 2, 2, 0xf08a2a); v.set(-1, 3, 1, 0x1a1a1a); v.set(0, 3, 1, 0x1a1a1a); }
        else if (t.id === "trumpet") { bx(v, -1, 1, -3, 0, 1, 1, t.c); bx(v, -2, 0, 2, 1, 3, 2, mixC(t.c, 0xffffff, 0.2)); }
        else if (t.id === "box") { bx(v, -2, 0, -2, 1, 3, 1, (x, y, z) => (x + y + z) & 1 ? t.c : 0xf8e040); rbx(v, -1, 4, -1, 0, 5, 0, 0xf05a5a, 3); }
        else if (t.id === "car") { bx(v, -1, 1, -2, 0, 1, 2, t.c); bx(v, -1, 2, -1, 0, 2, 0, 0x9ad8f8); for (const x of [-2, 1]) for (const z of [-2, 2]) v.set(x, 0, z, 0x2a2a2a); }
        else if (t.id === "kite") { for (let y = 0; y < 7; y++) { const w = 3 - Math.abs(y - 4); for (let x = -w; x < w; x++) v.set(x, y + 1, 0, (x < 0) !== (y > 3) ? t.c : 0xf8f8f8); } line(v, 0, 0, 0, 0, -2, -2, 0xf8f8f8); }
      });
    }
    if (kind === "flower") {
      const c = o.c || 0xf05a7a, k = (o.k || 0) % 3;
      return part(`flower:${c}:${k}`, FG, v => {
        bx(v, 0, 0, 0, 0, 2 + k, 0, 0x4a9a3a); v.set(1, 1, 0, 0x5ab04a);
        const y = 3 + k;
        if (k === 1) for (const [x, z] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) v.set(x, y, z, c);
        else if (k === 2) { bx(v, -1, y, -1, 1, y, 1, (x, yy, z) => x === 0 && z === 0 ? null : c); }
        else { v.set(-1, y, 0, c); v.set(1, y, 0, c); v.set(0, y + 1, 0, c); }
        v.set(0, y, 0, 0xf8d040);
      });
    }
    if (kind === "rock") {
      const s = Math.max(1, Math.round((o.s || 1) * 3)), c = o.c || 0x8a8a92, k = o.k || 0;
      return part(`rock:${s}:${c}:${k % 3}`, FG * 2, v => {
        rbx(v, -s, 0, -s, s - 1, Math.max(1, Math.round(s * 0.8)), s - 1, (x, y, z) => grain(y === 0 ? mulC(c, 0.85) : (hash(x, y, z + k) < 0.1 ? 0x6a9a4a : ((x + y + z) % 4 === 0 ? mulC(c, 0.9) : c)), x, y, z, 0.05), 2);
        if (s > 1) rbx(v, 0, 0, 0, s, Math.round(s * 0.6), s, (x, y, z) => grain(c, x, y, z, 0.06), 3);
      });
    }
    if (kind === "tree") return treeMesh(o);
    return new THREE.Group();
  }
  /* trees, Post Parade's way: a trunk of bark-patterned blocks, a crown of leaves lighter at
     the top; palms, pines, great oaks and mushroom trees beside the round fruit trees */
  const TG = 0.125;
  function treeMesh(o) {
    const k = o.k || "fruit", s = o.s || 1, seed = (o.seed || 1) % 5, H = Math.round(14 * s);
    return part(`tree:${k}:${s}:${seed}:${o.c || 0}`, TG, (v, gl) => {
      const bark = (x, y, z) => ((y + (x & 1) * 2) % 3 === 0) ? 0x6a4a2a : ((x + z) & 1 ? 0x7a5a32 : 0x84603a);
      const R = KIT.mulberry32(seed * 977 + 13), leafRound = (cx, cy, cz, r, cols, ry) => {
        for (let x = -Math.ceil(r); x <= Math.ceil(r); x++) for (let y = -Math.ceil(r * (ry || 1)); y <= Math.ceil(r * (ry || 1)); y++) for (let z = -Math.ceil(r); z <= Math.ceil(r); z++) {
          if (x * x + (y / (ry || 1)) ** 2 + z * z > r * r) continue;
          const c = y > r * 0.3 ? cols[1] : y < -r * 0.4 ? cols[2] : cols[0];
          v.set(cx + x, cy + y, cz + z, grain(c, x, y, z, 0.1));
        }
      };
      if (k === "palm") {
        let x = 0; for (let y = 0; y < H; y++) { if (y > 3 && y % 4 === 0) x += (seed & 1 ? 1 : -1); bx(v, x - 1, y, -1, x, y, 0, (xx, yy) => yy % 2 ? 0xa8804a : 0x8a6a3a); }
        for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2 + seed; for (let j = 1; j <= 6; j++) v.set(x + Math.round(Math.cos(a) * j), H - Math.floor(j * j / 10), Math.round(Math.sin(a) * j), grain(j > 4 ? 0x4ab84a : 0x3aa040, j, i, 0, 0.08)); }
        bx(v, x - 1, H - 1, -1, x, H, 0, 0x3aa040);
        for (const [dx, dz] of [[-1, 1], [1, -1], [1, 1]]) v.set(x + dx, H - 2, dz, 0x6a4a22);
      } else if (k === "pine") {
        bx(v, -1, 0, -1, 0, Math.round(H * 0.35), 0, bark);
        for (let t = 0; t < 4; t++) { const y0 = Math.round(H * 0.3) + t * 3, r = 4.5 * s - t * 1.1; for (let y = 0; y < 3; y++) for (let x = -Math.ceil(r); x <= Math.ceil(r); x++) for (let z = -Math.ceil(r); z <= Math.ceil(r); z++) { const rr = r * (1 - y / 3.5); if ((x + 0.5) ** 2 + (z + 0.5) ** 2 <= rr * rr) v.set(x, y0 + y, z, grain(o.snow && y === 2 ? 0xf0f4f8 : y === 2 ? 0x3a8a4a : 0x2a6a3a, x, y, z, 0.1)); } }
        bx(v, -1, Math.round(H * 0.3) + 12, -1, 0, Math.round(H * 0.3) + 13, 0, 0x3a8a4a);
      } else if (k === "mushroom") {
        bx(v, -1, 0, -1, 0, Math.round(H * 0.55), 0, 0xf0e8d8);
        const r = Math.round(5 * s), y0 = Math.round(H * 0.55);
        for (let y = 0; y <= 3; y++) { const rr = r - y; bx(v, -rr, y0 + y, -rr, rr - 1, y0 + y, rr - 1, (x, yy, z) => (Math.abs(x + 0.5) > rr - 1 && Math.abs(z + 0.5) > rr - 1) ? null : (yy === y0 ? 0xe8d8c0 : ((x * 3 + z * 5 + yy) % 7 === 0 ? 0xffffff : (o.c || 0xd83a3a)))); }
      } else if (k === "oak") {
        bx(v, -1, 0, -1, 1, Math.round(H * 0.5), 1, bark);
        for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) bx(v, dx * 2, Math.round(H * 0.4), dz * 2, dx * 3, Math.round(H * 0.5), dz * 3, bark);
        const cols = [0x3a8a3e, 0x5aa84a, 0x2f6e3a];
        leafRound(0, Math.round(H * 0.72), 0, 5.5 * s, cols, 0.75);
        for (let i = 0; i < 4; i++) { const a = i / 4 * PI * 2 + R(); leafRound(Math.round(Math.cos(a) * 4 * s), Math.round(H * 0.62 + R() * 3), Math.round(Math.sin(a) * 4 * s), 3.2 * s, cols, 0.8); }
      } else {
        bx(v, -1, 0, -1, 0, Math.round(H * 0.5), 0, bark);
        leafRound(0, Math.round(H * 0.66), 0, 4.2 * s, [0x4a9a3e, 0x6ab84a, 0x356f3a], 0.85);
        for (let i = 0; i < 3; i++) { const a = i / 3 * PI * 2 + seed; leafRound(Math.round(Math.cos(a) * 3 * s), Math.round(H * 0.6), Math.round(Math.sin(a) * 3 * s), 2.4 * s, [0x4a9a3e, 0x6ab84a, 0x356f3a], 0.8); }
        if (o.blossom) for (let i = 0; i < 12; i++) v.set(Math.round((R() - 0.5) * 8 * s), Math.round(H * 0.66 + (R() - 0.2) * 4 * s), Math.round((R() - 0.5) * 8 * s), 0xf2a6c4);
      }
    });
  }
  /* where a fruit tree's fruit hang (for the garden to put fruit there), in metres */
  function fruitSpots(s) {
    const H = Math.round(14 * s), cy = Math.round(H * 0.66) * TG, out = [];
    for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2 + 0.4, r = (4.4 * s) * TG; out.push([Math.cos(a) * r, cy - (i % 2 ? 0.25 : 0.05) * s, Math.sin(a) * r]); }
    return out;
  }

  root.ChaoModels = { ok: true, creature, avatar, prop, emote, setEyes, blob, AVATAR, avDefault, avLook, fruitSpots, mat, shift, hash, grain, patShade,
    Vox, meshVox, mixC, mulC, part, ell, sel, cap, blk, bx, rbx, line, shape, chain, mx, GC, VS };
})(typeof globalThis !== "undefined" ? globalThis : this);
