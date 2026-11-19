/*
 * Red Ring Circuit: the Chao Garden's world -- the land itself. One continuous voxel landscape
 * (half-metre voxels), the Central Garden in the middle and the other gardens round it, each
 * behind its own passage. The ground is a height field drawn from the garden's plan (the pond,
 * the waterfall cliff, the plaza, the orchard, the paths), built into meshes chunk by chunk as
 * the keeper walks, with the garden's things set on it: trees that fruit, flowers, rocks, the
 * Garden Hall, the incubator, the fountain, the gates.
 *
 *   ChaoWorld.make(scene, id) -> { ground(x, z), water(x, z), blocked(x, z, r), update(x, z), spots, trees, ... }
 *
 * Seven gardens, each a map of its own joined to the Central Garden by a gate on its rim (as
 * the Sonic Adventure games keep their gardens): Central, Tropical (a beach and the sea, a
 * lagoon and a pier), Forest (deep woods, a creek, a mushroom glade, the dojo's clearing),
 * Mountain (slopes up to the snow, a frozen lake, the climbers' cave), Mystic (old ruins round a
 * sunken court, a lily pond, crystals), Mechanical (metal floors, raised decks, pipes, the lab)
 * and Sky (islands floating over the clouds, joined by bridges). REGIONS holds each one's land,
 * colours, trees, things and places; make() builds whichever is asked for.
 */
(function (root) {
  "use strict";
  const THREE = root.THREE, M = root.ChaoModels;
  if (!THREE || !M || !M.ok) { root.ChaoWorld = { ok: false }; return; }
  const { Vox, meshVox, mixC, mulC, hash, grain, part, ell, cap, blk, shape, chain } = M;
  const PI = Math.PI, VS = 0.25, CH = 32;           // voxel size (m: Post Parade's building grain), chunk size (columns)

  /* ---------------------------------------------------------------- noise */
  const vn = (x, z, s) => {
    const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
    const u = xf * xf * (3 - 2 * xf), w = zf * zf * (3 - 2 * zf);
    const a = hash(xi, zi, s), b = hash(xi + 1, zi, s), c = hash(xi, zi + 1, s), d = hash(xi + 1, zi + 1, s);
    return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
  };
  const fbm = (x, z, s) => vn(x, z, s) * 0.55 + vn(x * 2.1, z * 2.1, s + 7) * 0.3 + vn(x * 4.3, z * 4.3, s + 13) * 0.15;
  const sm = (a, b, t) => { t = Math.max(0, Math.min(1, (t - a) / (b - a))); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  /* distance from a point to a polyline (for paths and streams) */
  function segDist(x, z, pts) {
    let best = 1e9;
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[i + 1], dx = bx - ax, dz = bz - az, L2 = dx * dx + dz * dz || 1;
      let t = ((x - ax) * dx + (z - az) * dz) / L2; t = t < 0 ? 0 : t > 1 ? 1 : t;
      const d = Math.hypot(x - ax - dx * t, z - az - dz * t); if (d < best) best = d;
    }
    return best;
  }

  /* ---------------------------------------------------------------- the plan
     The Central Garden: the keeper comes in from the south, by the Garden Hall and the plaza
     with its fountain; the pond lies west under the waterfall cliff; the orchard east; the
     flower meadow south-west; a ramp climbs the north cliff to the Mountain passage and the
     sky lift. Every other garden waits behind a gate on the rim. */
  const PLAN = {
    spawn: [0, 29], hall: [0, 38.5], fountain: [0, 22], incubator: [-6.5, 30.5], mailbox: [6.5, 30.5], book: [4, 33],
    pond: { x: -16, z: -13, rx: 11, rz: 13, level: 1.0 }, island: [-20, -14], stones: [[-6.2, -11], [-19, -12.6]],
    fall: { x: -16, z: -27, top: 7.6, w: 4 },
    plaza: [0, 24, 9.5], orchard: [22, -2, 11], meadow: [-24, 20, 10], yard: [21, 19, 4.5],
    cliffZ: -27, plateau: 8,
    ramp: [[30, 6], [31, -14], [24, -26], [12, -33]],
    paths: [
      [[0, 34], [0, 17], [6, 6], [16, -2], [26, -6], [44, -3], [52, 0]],
      [[-2, 18], [-8, 8], [-10, 2], [-22, 8], [-36, 4], [-52, 0]],
      [[0, 17], [-10, 20], [-26, 30], [-34, 36], [-40, 42]],
      [[4, 30], [18, 34], [32, 38], [40, 42]],
      [[16, -2], [30, 6], [31, -14], [24, -26], [12, -33], [2, -38], [0, -46], [0, -54]],
      [[12, -33], [22, -37]],
    ],
    gates: [
      { id: "tropical", at: [-49, 0], face: PI / 2, name: "Tropical Garden", need: "A bridge over the river, being mended." },
      { id: "forest", at: [49, -2], face: -PI / 2, name: "Forest Garden", need: "Fallen trees across the path." },
      { id: "mystic", at: [-37, 39], face: PI * 0.75, name: "Mystic Garden", need: "The old stone door is sealed." },
      { id: "mech", at: [37, 39], face: -PI * 0.75, name: "Mechanical Garden", need: "The lift has no power." },
      { id: "mountain", at: [0, -48], face: 0, name: "Mountain Garden", need: "Rocks have fallen across the pass." },
      { id: "sky", at: [24, -38], face: -PI / 4, name: "Sky Garden", need: "The balloon needs mending.", lift: true },
    ],
    trees: [
      // the orchard: fruit trees, each with its own fruit
      { k: "fruit", x: 16, z: -8, fruit: "round" }, { k: "fruit", x: 24, z: -12, fruit: "triangle" }, { k: "fruit", x: 28, z: -1, fruit: "round" },
      { k: "fruit", x: 20, z: 4, fruit: "square" }, { k: "fruit", x: 13, z: 2, fruit: "round" }, { k: "fruit", x: 30, z: 9, fruit: "heart", s: 0.9 },
      { k: "fruit", x: -30, z: 14, fruit: "round" }, { k: "fruit", x: -6, z: 12, fruit: "triangle", s: 0.9 },
      // and the garden's other trees
      { k: "palm", x: -20, z: -14, s: 0.8 }, { k: "palm", x: -27, z: -4, s: 0.9 }, { k: "palm", x: -6, z: -16, s: 0.85 },
      { k: "oak", x: -36, z: -14, s: 1.1 }, { k: "oak", x: 38, z: 20, s: 1.0 }, { k: "oak", x: -38, z: 22, s: 0.9 }, { k: "oak", x: 10, z: -20, s: 0.9 },
      { k: "pine", x: -8, z: -36, s: 1, top: 1 }, { k: "pine", x: 6, z: -40, s: 1.1, top: 1 }, { k: "pine", x: -28, z: -38, s: 1.2, top: 1 }, { k: "pine", x: 34, z: -30, s: 1, top: 1 },
      { k: "mushroom", x: 40, z: -16, s: 0.6, c: 0xd83a3a }, { k: "mushroom", x: -40, z: 32, s: 0.5, c: 0x3a8ad8 },
      { k: "fruit", x: 12, z: 20, fruit: "round", s: 0.85 }, { k: "oak", x: -18, z: 34, s: 0.8 }, { k: "oak", x: 22, z: 42, s: 0.8 },
    ],
  };

  /* the ground's height (m) and what's on top, from the plan */
  function inPond(x, z) { const P = PLAN.pond, n = (fbm(x * 0.15, z * 0.15, 3) - 0.5) * 0.35; return Math.hypot((x - P.x) / P.rx, (z - P.z) / P.rz) - n; }
  const pathD = (x, z) => { let d = 1e9; for (const p of PLAN.paths) d = Math.min(d, segDist(x, z, p)); return d; };
  function gateCorridor(x, z) { let d = 1e9; for (const g of PLAN.gates) if (!g.lift) d = Math.min(d, Math.hypot(x - g.at[0], z - g.at[1])); return d; }
  function heightAt(x, z) {
    let h = 2 + (fbm(x * 0.04, z * 0.04, 1) - 0.5) * 1.3;
    const r = Math.hypot(x, z);
    /* the cliff to the north, and the plateau above it */
    const cl = sm(PLAN.cliffZ + 1.2, PLAN.cliffZ - 1.6, z + (fbm(x * 0.12, 0, 5) - 0.5) * 3);
    h = lerp(h, PLAN.plateau + (fbm(x * 0.06, z * 0.06, 9) - 0.5) * 1.2, cl);
    /* the ramp up it, a steady climb along its path */
    const rd = segDist(x, z, PLAN.ramp);
    if (rd < 3.2) {
      let best = 0, bd = 1e9, acc = 0, total = 0;
      for (let i = 0; i < PLAN.ramp.length - 1; i++) total += Math.hypot(PLAN.ramp[i + 1][0] - PLAN.ramp[i][0], PLAN.ramp[i + 1][1] - PLAN.ramp[i][1]);
      for (let i = 0; i < PLAN.ramp.length - 1; i++) {
        const [ax, az] = PLAN.ramp[i], [bx, bz] = PLAN.ramp[i + 1], L = Math.hypot(bx - ax, bz - az);
        let t = ((x - ax) * (bx - ax) + (z - az) * (bz - az)) / (L * L); t = Math.max(0, Math.min(1, t));
        const d = Math.hypot(x - ax - (bx - ax) * t, z - az - (bz - az) * t);
        if (d < bd) { bd = d; best = (acc + t * L) / total; }
        acc += L;
      }
      const rh = lerp(2.2, PLAN.plateau, sm(0.12, 0.92, best));
      h = lerp(h, rh, sm(3.2, 1.8, rd));
    }
    /* the stream on the plateau that feeds the waterfall */
    const F = PLAN.fall;
    if (z < PLAN.cliffZ + 0.5 && z > PLAN.cliffZ - 14 && Math.abs(x - F.x) < F.w / 2 + 1) h = Math.min(h, lerp(PLAN.plateau - 1.1, h, sm(F.w / 2 - 0.2, F.w / 2 + 1, Math.abs(x - F.x))));
    /* the pond, and its island */
    const pd = inPond(x, z);
    if (pd < 1.15) h = lerp(PLAN.pond.level - 1.4 + Math.min(0.6, pd * 0.6), h, sm(0.85, 1.15, pd));
    if (Math.hypot(x - PLAN.island[0], z - PLAN.island[1]) < 3) h = Math.max(h, PLAN.pond.level + 0.5);
    /* the plaza: level */
    const pz = Math.hypot(x - PLAN.plaza[0], z - PLAN.plaza[1]);
    if (pz < PLAN.plaza[2] + 3) h = lerp(2, h, sm(PLAN.plaza[2], PLAN.plaza[2] + 3, pz));
    if (Math.hypot(x - PLAN.hall[0], z - PLAN.hall[1]) < 8) h = 2;
    const yd = Math.max(Math.abs(x - PLAN.yard[0]), Math.abs(z - PLAN.yard[1]));
    if (yd < PLAN.yard[2] + 2.5) h = lerp(2, h, sm(PLAN.yard[2] + 0.5, PLAN.yard[2] + 2.5, yd));
    /* the rim: hills all round, broken only where the gates are */
    const gc = gateCorridor(x, z);
    if (r > 43 && z > PLAN.cliffZ + 2) h += Math.min(9, (r - 43) * 0.9) * sm(3.5, 7, gc);
    if (r > 47 && z <= PLAN.cliffZ + 2) h += Math.min(7, (r - 47) * 0.9) * sm(3.5, 7, gc);
    /* paths settle a little into the ground */
    if (pathD(x, z) < 1.4 && pd > 1.1 && rd > 3) h -= 0.12;
    return h;
  }
  /* the surface's kind (for colour, footsteps and what grows) */
  function surfaceAt(x, z, h) {
    if (inPond(x, z) < 1.0 && h < PLAN.pond.level + 0.1) return "bed";
    if (inPond(x, z) < 1.18) return "sand";
    if (Math.hypot(x - PLAN.plaza[0], z - PLAN.plaza[1]) < PLAN.plaza[2] || Math.hypot(x - PLAN.hall[0], z - PLAN.hall[1]) < 7.5) return "stone";
    if (pathD(x, z) < 1.25 || segDist(x, z, PLAN.ramp) < 1.8) return "path";
    if (Math.max(Math.abs(x - PLAN.yard[0]), Math.abs(z - PLAN.yard[1])) < PLAN.yard[2]) return "sand";
    if (Math.hypot(x - PLAN.meadow[0], z - PLAN.meadow[1]) < PLAN.meadow[2]) return "meadow";
    if (h > PLAN.plateau - 0.6 && z < PLAN.cliffZ) return "high";
    return "grass";
  }
  const COL = {
    grass: (x, z, y) => { const n = fbm(x * 0.2, z * 0.2, 4); return grain(mixC(0x4a9a3a, 0x7ac455, n), x * 4, y, z * 4, 0.05); },
    high: (x, z, y) => grain(mixC(0x5a9a48, 0x8ab866, fbm(x * 0.2, z * 0.2, 6)), x * 4, y, z * 4, 0.05),
    meadow: (x, z, y) => { const h = hash(x * 2 | 0, z * 2 | 0, 77); return h < 0.08 ? [0xf8f070, 0xf87aa0, 0xf8f8f8, 0xb08af0][(h * 50 | 0) % 4] : grain(mixC(0x5aaa44, 0x86cc5a, fbm(x * 0.25, z * 0.25, 4)), x * 4, y, z * 4, 0.05); },
    path: (x, z, y) => grain(mixC(0xc8a878, 0xa88a5a, hash(x * 2 | 0, z * 2 | 0, 5) * 0.6), x * 4, y, z * 4, 0.04),
    stone: (x, z, y) => { const tx = Math.floor(x * 2), tz = Math.floor(z * 2), row = tz >> 1, h = hash((tx + (row & 1)) >> 1, row, 3); const c = h < 0.3 ? 0xcfc2a6 : h < 0.6 ? 0xc2b597 : h < 0.85 ? 0xd8ccb2 : 0xb3a68a; return grain(hash(tx, tz, 11) < 0.012 ? mixC(c, 0x6a9a4a, 0.45) : c, tx, y, tz, 0.035); },
    sand: (x, z, y) => grain(mixC(0xe8d8a8, 0xd8c890, hash(x * 2 | 0, z * 2 | 0, 8)), x * 4, y, z * 4, 0.04),
    bed: (x, z, y) => grain(mixC(0x7a8a5a, 0x9a9a6a, hash(x * 2 | 0, z * 2 | 0, 9)), x * 4, y, z * 4, 0.05),
  };
  const CENTRAL = { id: "central", name: "Central Garden", heightAt, surfaceAt, COL, bound: 58, edge: 62, radius: 44, music: "garden" };
  const dirt = (x, y, z) => grain(((y & 3) === 0) ? 0x7a5a3a : 0x8a6a44, x, y, z, 0.06);
  const rock = (x, y, z) => grain(((y + (hash(x >> 1, 0, z >> 1) * 3 | 0)) % 4 === 0) ? 0x7a7468 : mixC(0x9a9484, 0x8a8478, hash(x >> 1, y >> 1, z >> 1)), x, y, z, 0.06);

  /* ---------------------------------------------------------------- the other gardens
     Each a map of its own, about the Central Garden's size, with a gate on its rim back to it.
     What they share: rim hills (broken at the gate), places for the creatures' days, a gate. */
  const rimUp = (x, z, r0, ex, k) => { const r = Math.hypot(x, z); if (r <= r0) return 0; const g = Math.hypot(x - ex[0], z - ex[1]); return Math.min(8, (r - r0) * (k || 0.9)) * sm(3.5, 7.5, g); };
  const RAND = seed => { let a = seed | 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  /* trees scattered by a rule: n tries, kept where `ok` says, apart from each other */
  function scatterTrees(seed, n, rad, ok, make) {
    const R = RAND(seed), out = [];
    for (let i = 0; i < n * 6 && out.length < n; i++) {
      const a = R() * PI * 2, r = Math.sqrt(R()) * rad, x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (!ok(x, z) || out.some(t => Math.hypot(t.x - x, t.z - z) < 3.2)) continue;
      out.push(Object.assign({ x, z }, make(R, x, z)));
    }
    return out;
  }
  /* the places a creature goes to in a garden, found by looking */
  function placesOf(W, R, extra) {
    const pick = (ok, tries) => { for (let i = 0; i < (tries || 40); i++) { const a = Math.random() * PI * 2, r = Math.sqrt(Math.random()) * R.radius * 0.9, x = Math.cos(a) * r, z = Math.sin(a) * r; if (!W.blocked(x, z, 0.5) && ok(x, z)) return [x, z]; } return R.entry.slice(0, 2); };
    const P = {
      water: () => pick((x, z) => W.depth(x, z) > 0.45),
      shore: () => pick((x, z) => W.waterAt(x, z) == null && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => W.waterAt(x + dx * 1.5, z + dz * 1.5) != null)),
      trees: () => { const t = W.trees[Math.floor(Math.random() * W.trees.length)]; if (!t) return pick(() => true); const a = Math.random() * PI * 2; return [t.x + Math.cos(a) * 1.8, t.z + Math.sin(a) * 1.8]; },
      flowers: () => pick((x, z) => W.surface(x, z) === "meadow" || W.surface(x, z) === "grass"),
      high: () => { let b = null, bh = -99; for (let i = 0; i < 12; i++) { const p = pick(() => true, 8), h = W.ground(p[0], p[1]); if (h > bh) { bh = h; b = p; } } return b; },
      sun: () => pick((x, z) => W.waterAt(x, z) == null),
      shade: () => { const t = W.trees[Math.floor(Math.random() * W.trees.length)]; return t ? [t.x + (Math.random() - 0.5) * 3, t.z + (Math.random() - 0.5) * 3] : pick(() => true); },
      people: () => [R.entry[0] + (Math.random() - 0.5) * 6, R.entry[1] + (Math.random() - 0.5) * 6],
      any: () => pick((x, z) => W.waterAt(x, z) == null || W.depth(x, z) < 0.3),
    };
    return Object.assign(P, extra || {});
  }
  /* the way back: a gate on the rim (open, of course), its spot to walk through */
  function exitGate(W, put, block, R) {
    const E = R.exit, gm = buildingMesh(E.lift ? "balloon" : "gate-open");
    put(gm, E.at[0], E.at[1], E.face);
    if (E.lift) block(E.at[0], E.at[1], 0, { box: true, w: 1.6, d: 1.6, a: E.face });
    W.spots.exit = { x: E.at[0] + Math.sin(E.face) * 2.4, z: E.at[1] + Math.cos(E.face) * 2.4, r: 2.4, exit: true, name: "Central Garden" };
    const sign = buildingMesh("sign"), ix = Math.sin(E.face), iz = Math.cos(E.face), tx = Math.cos(E.face), tz = -Math.sin(E.face);
    const sx = E.at[0] + ix * 2 + tx * 4.8, sz = E.at[1] + iz * 2 + tz * 4.8; put(sign, sx, sz, E.face + PI); block(sx, sz, 0.25);
  }
  const C = (a, b) => (x, z, y) => grain(mixC(a, b, fbm(x * 0.2, z * 0.2, 4)), x * 4, y, z * 4, 0.05);
  const REGIONS = {};

  /* -- Tropical: a beach on the west, the sea beyond, a lagoon, a pier, palms */
  REGIONS.tropical = (() => {
    const sea = 0.9, lag = { x: 10, z: -16, r: 7 }, pier = { z0: 3, z1: 5.5, x0: -26, x1: -6 };
    const coast = (x, z) => x + 9 + (fbm(z * 0.05, 1, 21) - 0.5) * 14;
    const R = { id: "tropical", name: "Tropical Garden", bound: 58, edge: 60, radius: 44, sea, music: "garden-hero", waterCol: 0x2ab0c8,
      sky: [0x6ac8f0, 0xd8f4ff], entry: [40, 0, -PI / 2], exit: { at: [48, 0], face: -PI / 2 }, flowers: [0xf03a5a, 0xf87aa0, 0xf8d040, 0xf8f8f8], flowerK: 0.18,
      COL: { grass: C(0x4ab040, 0x8ad860), sand: (x, z, y) => grain(mixC(0xf0e0b0, 0xe0cc90, hash(x * 4 | 0, z * 4 | 0, 8)), x * 4, y, z * 4, 0.03),
        bed: (x, z, y) => grain(mixC(0xd8c890, 0xb8b080, hash(x * 4 | 0, z * 4 | 0, 9)), x * 4, y, z * 4, 0.04), plank: (x, z, y) => grain(((Math.floor(x * 4) & 3) === 0) ? 0x7a5a32 : 0xa8804a, x * 4, y, z * 4, 0.05),
        rock: (x, z, y) => grain(0x9a9488, x * 4, y, z * 4, 0.06) } };
    R.heightAt = (x, z) => {
      let h = 1.9 + (fbm(x * 0.04, z * 0.04, 31) - 0.5) * 1.6;
      const c = coast(x, z);
      if (c < 6) h = lerp(-1.2, h, sm(-14, 6, c));                       // the beach down into the sea
      if (z < -24 && x > 14) h += sm(-24, -36, z) * 5;                   // a headland of rock to the north-east
      const ld = Math.hypot(x - lag.x, z - lag.z) / lag.r;
      if (ld < 1.3) h = lerp(sea - 0.9 + ld * 0.5, h, sm(0.9, 1.3, ld));
      if (x > pier.x0 && x < pier.x1 && z > pier.z0 && z < pier.z1) h = sea + 0.55;   // the pier
      return h + rimUp(x, z, 44, R.exit.at) * (c > 0 ? 1 : 0.3);
    };
    R.surfaceAt = (x, z, h) => {
      if (x > pier.x0 && x < pier.x1 && z > pier.z0 && z < pier.z1) return "plank";
      if (h < sea) return "bed";
      if (h < sea + 0.8 || Math.hypot(x - lag.x, z - lag.z) < lag.r * 1.35) return "sand";
      if (z < -26 && x > 14) return "rock";
      return "grass";
    };
    R.waterAt = (x, z, g) => g < sea ? sea : null;
    R.trees = () => scatterTrees(41, 34, 42, (x, z) => { const h = R.heightAt(x, z), sf = R.surfaceAt(x, z, h); return h > sea + 0.3 && sf !== "plank" && Math.hypot(x - 40, z) > 7; }, (rr, x, z) => (rr() < 0.85 ? { k: "palm", s: 0.8 + rr() * 0.5 } : { k: "fruit", fruit: rr() < 0.5 ? "triangle" : "round", s: 0.9 })).concat([{ k: "fruit", x: 22, z: 12, fruit: "round" }, { k: "fruit", x: 16, z: 20, fruit: "triangle" }]);
    R.build = (W, put, block) => {
      exitGate(W, put, block, R);
      for (const [x, z] of [[-6, 2.6], [-6, 5.9], [-16, 2.6], [-16, 5.9], [-26, 2.6], [-26, 5.9]]) { const p = buildingMesh("post"); put(p, x, z, 0, sea - 1.2); }
      put(buildingMesh("hut"), 26, -6, -PI / 2); block(26, -6, 0, { box: true, w: 2.2, d: 2.2, a: 0 });
      W.spots.pier = { x: -24, z: 4.2, r: 2 };
    };
    R.places = W => placesOf(W, R);
    return R;
  })();

  /* -- Forest: deep woods, a creek, a mushroom glade, the dojo's clearing */
  REGIONS.forest = (() => {
    const creek = [[6, -50], [9, -20], [4, 0], [10, 22], [6, 50]], glade = { x: -16, z: -18, r: 8 }, dojo = { x: 18, z: 14, r: 8 }, lvl = 1.5;
    const path = [[-48, 0], [-20, 2], [4, 0], [18, 8]];
    const R = { id: "forest", name: "Forest Garden", bound: 58, edge: 60, radius: 44, music: "garden", sky: [0x8ab8a0, 0xc8e0c8], fog: 0.75,
      entry: [-40, 0, PI / 2], exit: { at: [-48, 0], face: PI / 2 }, flowers: [0xf8f8f8, 0xf8e040, 0xb070f0], flowerK: 0.12, rockK: 0.14, rockCol: 0x7a8478,
      COL: { grass: C(0x2f6e2e, 0x5a9a40), meadow: C(0x3a7a34, 0x6aa84a), path: (x, z, y) => grain(mixC(0x8a6a44, 0x6a5034, hash(x * 4 | 0, z * 4 | 0, 5) * 0.6), x * 4, y, z * 4, 0.05),
        moss: C(0x4a7a2e, 0x6a8a3a), bed: (x, z, y) => grain(0x6a6a50, x * 4, y, z * 4, 0.05), plank: (x, z, y) => grain(((Math.floor(z * 4) & 3) === 0) ? 0x6a4a2a : 0x8a6a3a, x * 4, y, z * 4, 0.05),
        stone: (x, z, y) => grain(((Math.floor(x * 2) + Math.floor(z * 2)) & 1) ? 0xb0a890 : 0xa09880, x * 4, y, z * 4, 0.04) } };
    R.heightAt = (x, z) => {
      let h = 2.2 + (fbm(x * 0.05, z * 0.05, 51) - 0.5) * 2.4;
      const cd = segDist(x, z, creek);
      if (cd < 3) h = lerp(lvl - 0.8, h, sm(1.2, 3, cd));
      if (Math.abs(z - 0) < 1.2 && cd < 3) h = Math.max(h, lvl + 0.6);                 // the log bridge
      const dd = Math.hypot(x - dojo.x, z - dojo.z); if (dd < dojo.r + 3) h = lerp(2.3, h, sm(dojo.r, dojo.r + 3, dd));
      const gd = Math.hypot(x - glade.x, z - glade.z); if (gd < glade.r + 3) h = lerp(1.9, h, sm(glade.r, glade.r + 3, gd));
      return h + rimUp(x, z, 44, R.exit.at, 1.1);
    };
    R.surfaceAt = (x, z, h) => {
      const cd = segDist(x, z, creek);
      if (Math.abs(z) < 1.2 && cd < 3) return "plank";
      if (cd < 1.6) return "bed";
      if (Math.hypot(x - dojo.x, z - dojo.z) < dojo.r - 2) return "stone";
      if (segDist(x, z, path) < 1.2) return "path";
      if (Math.hypot(x - glade.x, z - glade.z) < glade.r) return "moss";
      if (hash(x | 0, z | 0, 61) < 0.05) return "meadow";
      return "grass";
    };
    R.waterAt = (x, z, g) => g < lvl && segDist(x, z, creek) < 3 ? lvl : null;
    R.sea = lvl;
    R.trees = () => scatterTrees(52, 70, 44, (x, z) => segDist(x, z, creek) > 3.5 && Math.hypot(x - dojo.x, z - dojo.z) > dojo.r + 1 && segDist(x, z, path) > 2.2 && Math.hypot(x + 40, z) > 6 && Math.hypot(x - glade.x, z - glade.z) > 4,
      (rr, x, z) => Math.hypot(x - glade.x, z - glade.z) < glade.r + 3 ? { k: "mushroom", s: 0.4 + rr() * 0.4, c: [0xd83a3a, 0x3a8ad8, 0xe8a030, 0xb070f0][(rr() * 4) | 0] } : rr() < 0.55 ? { k: "oak", s: 0.8 + rr() * 0.5 } : rr() < 0.92 ? { k: "pine", s: 0.9 + rr() * 0.4 } : { k: "fruit", fruit: rr() < 0.5 ? "square" : "round", s: 0.9 })
      .concat(Array.from({ length: 6 }, (_, i) => ({ k: "mushroom", x: glade.x + Math.cos(i * 1.05) * 4, z: glade.z + Math.sin(i * 1.05) * 4, s: 0.45 + (i % 3) * 0.15, c: [0xd83a3a, 0x3a8ad8, 0xe8a030][i % 3] })));
    R.build = (W, put, block) => {
      exitGate(W, put, block, R);
      put(buildingMesh("dojo"), dojo.x + 1, dojo.z + 3.5, PI); block(dojo.x + 1, dojo.z + 3.5, 0, { box: true, w: 3.4, d: 2.4, a: 0 });
      W.spots.dojo = { x: dojo.x + 1, z: dojo.z - 0.5, r: 1.8, dojo: "forest" };
      for (const [x, z, a] of [[-24, 18, 0.4], [26, -24, 1.2], [-6, 30, 2.2]]) { put(buildingMesh("log"), x, z, a); block(x, z, 0, { box: true, w: 1.6, d: 0.4, a }); }
    };
    R.places = W => placesOf(W, R, { flowers: () => [glade.x + (Math.random() - 0.5) * 10, glade.z + (Math.random() - 0.5) * 10] });
    return R;
  })();

  /* -- Mountain: slopes rising north to the snow, a frozen lake, the climbers' cave */
  REGIONS.mountain = (() => {
    const lake = { x: -16, z: 6, r: 7 }, cave = [16, -26];
    const R = { id: "mountain", name: "Mountain Garden", bound: 58, edge: 60, radius: 44, music: "garden-hero", sky: [0x9ac0e8, 0xe8f0f8],
      entry: [0, 40, PI], exit: { at: [0, 48], face: PI }, flowers: [0xf8f8f8, 0x9ab0f8, 0xf8e040], flowerK: 0.1, rockK: 0.2, rockCol: 0x8a8a92,
      COL: { grass: C(0x5a8a48, 0x8ab070), high: C(0x6a8a58, 0x9aa878), snow: (x, z, y) => grain(mixC(0xf0f4f8, 0xdfe8f2, hash(x * 4 | 0, z * 4 | 0, 7)), x * 4, y, z * 4, 0.02),
        ice: (x, z, y) => grain(((Math.floor(x * 2) + Math.floor(z * 3)) % 5 === 0) ? 0xd8f0fc : 0xa8d8f0, x * 4, y, z * 4, 0.02), rock: (x, z, y) => grain(mixC(0x8a8478, 0x6a6a68, fbm(x * 0.3, z * 0.3, 8)), x * 4, y, z * 4, 0.06),
        path: (x, z, y) => grain(0xa89070, x * 4, y, z * 4, 0.05) },
      side: (i, y, k, d, surf, cliff) => (d > 0 && (surf === "snow" || y * VS > 9)) && d < 2 ? 0xe8eef4 : grain(((y + (hash(i >> 1, 0, k >> 1) * 3 | 0)) % 4 === 0) ? 0x6a6458 : 0x8a8478, i, y, k, 0.06) };
    R.heightAt = (x, z) => {
      let h = 2 + sm(10, -40, z) * 13 + (fbm(x * 0.05, z * 0.05, 71) - 0.5) * 3.2;
      h += Math.max(0, fbm(x * 0.1, z * 0.1, 72) - 0.55) * 6 * sm(0, -30, z);           // crags
      const ld = Math.hypot(x - lake.x, z - lake.z) / lake.r; if (ld < 1.4) h = lerp(2.4, h, sm(1, 1.4, ld));
      return h + rimUp(x, z, 44, R.exit.at, 1.2);
    };
    R.surfaceAt = (x, z, h) => {
      if (Math.hypot(x - lake.x, z - lake.z) < lake.r) return "ice";
      if (h > 10.5) return "snow";
      if (Math.abs(x) < 1.4 && z > 0) return "path";
      if (h > 7) return fbm(x * 0.3, z * 0.3, 73) > 0.55 ? "rock" : "high";
      return fbm(x * 0.25, z * 0.25, 74) > 0.68 ? "rock" : "grass";
    };
    R.trees = () => scatterTrees(73, 34, 42, (x, z) => { const h = R.heightAt(x, z); return h < 12 && Math.hypot(x - lake.x, z - lake.z) > lake.r + 2 && Math.abs(x) > 2.5 && Math.hypot(x - cave[0], z - cave[1]) > 6; }, (rr, x, z) => ({ k: "pine", s: 0.8 + rr() * 0.5, snow: R.heightAt(x, z) > 8 }));
    R.build = (W, put, block) => {
      exitGate(W, put, block, R);
      put(buildingMesh("cave"), cave[0], cave[1], 0); block(cave[0], cave[1] - 1.2, 0, { box: true, w: 3, d: 1.4, a: 0 });
      W.spots.dojo = { x: cave[0], z: cave[1] + 2.4, r: 1.8, dojo: "mountain" };
      W.spots.lake = { x: lake.x, z: lake.z, r: lake.r };
    };
    R.places = W => placesOf(W, R);
    return R;
  })();

  /* -- Mystic: ruins round a sunken court, a lily pond, crystals, the old arena */
  REGIONS.mystic = (() => {
    const court = { x: 0, z: 4, r: 11 }, pond = { x: -18, z: 16, r: 7 }, lvl = 1.4, arena = [0, -20];
    const R = { id: "mystic", name: "Mystic Garden", bound: 58, edge: 60, radius: 44, music: "garden-dark", sky: [0x7a6ab8, 0xd8c8f0], fog: 0.8,
      entry: [30, -30, -PI / 4], exit: { at: [34, -34], face: -PI / 4 }, flowers: [0xb070f0, 0xf8a8d0, 0x6ad8f0, 0xf8f8f8], flowerK: 0.25,
      COL: { grass: C(0x3a7a5a, 0x6a9a7a), meadow: C(0x4a8a6a, 0x7aa88a), stone: (x, z, y) => { const tx = Math.floor(x * 2), tz = Math.floor(z * 2); return grain(hash(tx >> 1, tz >> 1, 5) < 0.15 ? 0x6a9a6a : ((tx + tz) & 1 ? 0xb8b0c8 : 0xa8a0b8), tx, y, tz, 0.04); },
        bed: (x, z, y) => grain(0x5a6a5a, x * 4, y, z * 4, 0.05), path: (x, z, y) => grain(0xa8a0b0, x * 4, y, z * 4, 0.05) } };
    R.heightAt = (x, z) => {
      let h = 2.2 + (fbm(x * 0.05, z * 0.05, 81) - 0.5) * 1.8;
      const cd = Math.hypot(x - court.x, z - court.z); if (cd < court.r + 3) h = lerp(1.4, h, sm(court.r, court.r + 3, cd));
      const pd = Math.hypot(x - pond.x, z - pond.z) / pond.r; if (pd < 1.3) h = lerp(lvl - 0.9 + pd * 0.5, h, sm(0.9, 1.3, pd));
      const ad = Math.hypot(x - arena[0], z - arena[1]); if (ad < 9) h = lerp(2.6, h, sm(7, 9, ad));
      return h + rimUp(x, z, 44, R.exit.at);
    };
    R.surfaceAt = (x, z, h) => {
      if (Math.hypot(x - pond.x, z - pond.z) < pond.r && h < lvl) return "bed";
      if (Math.hypot(x - court.x, z - court.z) < court.r - 1 || Math.hypot(x - arena[0], z - arena[1]) < 7) return "stone";
      if (segDist(x, z, [[34, -34], [12, -10], [court.x, court.z]]) < 1.3) return "path";
      return fbm(x * 0.2, z * 0.2, 82) > 0.62 ? "meadow" : "grass";
    };
    R.waterAt = (x, z, g) => g < lvl && Math.hypot(x - pond.x, z - pond.z) < pond.r * 1.2 ? lvl : null;
    R.sea = lvl;
    R.trees = () => scatterTrees(83, 22, 42, (x, z) => Math.hypot(x - court.x, z - court.z) > court.r + 2 && Math.hypot(x - pond.x, z - pond.z) > pond.r + 1.5 && Math.hypot(x - arena[0], z - arena[1]) > 10 && Math.hypot(x - 30, z + 30) > 6,
      (rr) => ({ k: rr() < 0.7 ? "oak" : "fruit", s: 0.8 + rr() * 0.4, blossom: true, fruit: "heart" }));
    R.build = (W, put, block) => {
      exitGate(W, put, block, R);
      for (let i = 0; i < 10; i++) { const a = i / 10 * PI * 2, x = court.x + Math.cos(a) * (court.r - 0.5), z = court.z + Math.sin(a) * (court.r - 0.5); put(buildingMesh(i % 3 === 1 ? "pillar-broken" : "pillar"), x, z, a); block(x, z, 0.45); }
      for (const [x, z, a] of [[-26, -8, 0.3], [20, 22, 1.4], [-6, 30, 2.6]]) { put(buildingMesh("arch"), x, z, a); }
      for (const [x, z] of [[-10, -6], [12, 16], [-24, 28], [26, 4], [-30, -20], [8, -34]]) { put(buildingMesh("crystal"), x, z, hash(x | 0, z | 0, 1) * 6); block(x, z, 0.4); }
      put(buildingMesh("arena"), arena[0], arena[1], 0);
      W.spots.arena = { x: arena[0], z: arena[1] + 7.5, r: 2, arena: true };
      W.spots.altar = { x: court.x, z: court.z, r: 1.6 };
      put(buildingMesh("altar"), court.x, court.z, 0); block(court.x, court.z, 0.7);
    };
    R.places = W => placesOf(W, R);
    return R;
  })();

  /* -- Mechanical: metal floors and raised decks, pipes, lamps, the lab */
  REGIONS.mech = (() => {
    const decks = [{ x0: -24, x1: -8, z0: -18, z1: -6, h: 3.5 }, { x0: 8, x1: 26, z0: -22, z1: -8, h: 4.5 }, { x0: -6, x1: 10, z0: 10, z1: 24, h: 3 }], pool = { x: 18, z: 16, r: 5 }, lvl = 1.6, lab = [-16, 20];
    const inDeck = (x, z) => decks.find(d => x > d.x0 && x < d.x1 && z > d.z0 && z < d.z1);
    const R = { id: "mech", name: "Mechanical Garden", bound: 58, edge: 60, radius: 44, music: "lobby", sky: [0x8a9ab0, 0xd0d8e4], waterCol: 0x40d0f0,
      entry: [-30, -30, PI / 4], exit: { at: [-34, -34], face: PI / 4 }, flowerK: 0.04, rockK: 0.03, rockCol: 0x7a808a,
      COL: { metal: (x, z, y) => { const tx = Math.floor(x * 4), tz = Math.floor(z * 4); const edge = (tx & 7) === 0 || (tz & 7) === 0; return edge ? ((tx + tz) & 1 ? 0x5a606a : 0x6a707a) : ((tx & 7) === 4 && (tz & 7) === 4 ? 0x9aa0aa : grain(0x8a909a, tx, y, tz, 0.03)); },
        hazard: (x, z, y) => ((Math.floor(x * 4) + Math.floor(z * 4)) & 2) ? 0xf0c020 : 0x2a2a2a, grass: C(0x4a8a3a, 0x6a9a48), bed: (x, z, y) => grain(0x3a5a6a, x * 4, y, z * 4, 0.04) },
      side: (i, y, k, d) => grain(((y & 3) === 0) ? 0x4a505a : 0x6a707a, i, y, k, 0.04) };
    R.heightAt = (x, z) => {
      const d = inDeck(x, z); if (d) return d.h;
      let h = 2 + (fbm(x * 0.03, z * 0.03, 91) - 0.5) * 0.4;
      for (const dk of decks) { const dx = Math.max(dk.x0 - x, 0, x - dk.x1), dz = Math.max(dk.z0 - z, 0, z - dk.z1), dd = Math.hypot(dx, dz); if (dd < 4 && Math.abs(z - (dk.z0 + dk.z1) / 2) < 2) h = Math.max(h, lerp(dk.h, h, dd / 4)); }   // ramps
      const pd = Math.hypot(x - pool.x, z - pool.z) / pool.r; if (pd < 1.15) h = lerp(lvl - 1, h, sm(0.95, 1.15, pd));
      return h + rimUp(x, z, 44, R.exit.at, 1.3);
    };
    R.surfaceAt = (x, z, h) => {
      if (Math.hypot(x - pool.x, z - pool.z) < pool.r && h < lvl) return "bed";
      const d = inDeck(x, z); if (d) return (x - d.x0 < 0.6 || d.x1 - x < 0.6 || z - d.z0 < 0.6 || d.z1 - z < 0.6) ? "hazard" : "metal";
      return fbm(x * 0.15, z * 0.15, 92) > 0.66 ? "grass" : "metal";
    };
    R.waterAt = (x, z, g) => g < lvl && Math.hypot(x - pool.x, z - pool.z) < pool.r * 1.1 ? lvl : null;
    R.sea = lvl;
    R.trees = () => scatterTrees(93, 6, 40, (x, z) => !inDeck(x, z) && R.surfaceAt(x, z, R.heightAt(x, z)) === "grass", rr => ({ k: "pine", s: 0.7 + rr() * 0.3 }));
    R.build = (W, put, block) => {
      exitGate(W, put, block, R);
      put(buildingMesh("lab"), lab[0], lab[1], 0); block(lab[0], lab[1], 0, { box: true, w: 4.4, d: 3.4, a: 0 });
      W.spots.dojo = { x: lab[0], z: lab[1] - 4.2, r: 1.8, dojo: "mech" };
      for (const [x, z] of [[-4, -2], [6, -2], [-14, 4], [16, 4], [0, -26], [-28, -2], [28, 26], [-30, 30]]) { put(buildingMesh("lamp"), x, z, 0); block(x, z, 0.2); }
      for (const [x, z, a, n] of [[-20, -26, 0, 5], [24, 2, PI / 2, 6], [-34, 10, PI / 2, 4]]) { put(buildingMesh("pipe" + n), x, z, a); block(x, z, 0, { box: true, w: n * 0.85, d: 0.4, a }); }
      for (const [x, z] of [[2, -10], [3.6, -10], [2.8, -8.8], [-30, -12], [-29, -13.4]]) { put(buildingMesh("crate"), x, z, hash(x | 0, z | 0, 2)); block(x, z, 0.45); }
    };
    R.places = W => placesOf(W, R);
    return R;
  })();

  /* -- Sky: islands floating over the clouds, bridges between them */
  REGIONS.sky = (() => {
    const isl = [{ x: 0, z: 26, r: 9, h: 8 }, { x: 0, z: 0, r: 12, h: 9 }, { x: -22, z: -8, r: 8, h: 10.5 }, { x: 20, z: -12, r: 9, h: 9.5 }, { x: 2, z: -30, r: 8, h: 12 }, { x: -26, z: 20, r: 6, h: 8.5 }, { x: 26, z: 18, r: 6, h: 7.5 }];
    const bridges = [[0, 1], [1, 2], [1, 3], [1, 4], [0, 5], [0, 6], [2, 4]];
    const bridgeAt = (x, z) => { for (const [a, b] of bridges) { const A = isl[a], B = isl[b]; if (segDist(x, z, [[A.x, A.z], [B.x, B.z]]) < 0.9) { const L = Math.hypot(B.x - A.x, B.z - A.z), t = clamp01(((x - A.x) * (B.x - A.x) + (z - A.z) * (B.z - A.z)) / (L * L)); return lerp(A.h, B.h, t); } } return null; };
    const R = { id: "sky", name: "Sky Garden", bound: 58, edge: 60, radius: 40, music: "garden-hero", sky: [0x7ac0f8, 0xf0f8ff], flowerK: 0.25, flowers: [0xf8f8f8, 0xf8e040, 0x9ad0f8, 0xf8a8d0],
      entry: [0, 26.5, PI], exit: { at: [0, 33], face: PI, lift: true },
      COL: { grass: C(0x6ac04a, 0x9ad870), meadow: C(0x7ac85a, 0xa8e080), plank: (x, z, y) => grain(((Math.floor(x * 4) + Math.floor(z * 4)) & 3) === 0 ? 0x7a5a32 : 0xa8804a, x * 4, y, z * 4, 0.05), stone: (x, z, y) => grain(0xd8d4c8, x * 4, y, z * 4, 0.04) },
      side: (i, y, k, d) => d < 1 ? grain(0x6a9a3a, i, y, k, 0.06) : grain(((y + (hash(i >> 1, 0, k >> 1) * 3 | 0)) % 3 === 0) ? 0x8a7458 : 0xa88a64, i, y, k, 0.06) };
    R.heightAt = (x, z) => {
      let best = -40;
      for (const I of isl) { const d = Math.hypot(x - I.x, z - I.z) / (I.r * (1 + (fbm(x * 0.2, z * 0.2, 101) - 0.5) * 0.3)); if (d < 1) best = Math.max(best, I.h + (1 - d * d) * 0.8 + (fbm(x * 0.1, z * 0.1, 102) - 0.5) * 0.6); }
      if (best < -20) { const b = bridgeAt(x, z); if (b != null) return b; }
      return best;
    };
    /* an island's underside, tapering down to a point of rock; a bridge, a plank thick */
    R.bottom = (x, z, h) => {
      if (bridgeAt(x, z) != null && isl.every(I => Math.hypot(x - I.x, z - I.z) > I.r)) return h - 0.25;
      let d = 1; for (const I of isl) d = Math.min(d, Math.hypot(x - I.x, z - I.z) / I.r);
      return h - 1 - (1 - d) * 6 - fbm(x * 0.3, z * 0.3, 103) * 2;
    };
    R.surfaceAt = (x, z, h) => {
      if (isl.every(I => Math.hypot(x - I.x, z - I.z) > I.r * 0.98) && bridgeAt(x, z) != null) return "plank";
      if (Math.hypot(x, z) < 3) return "stone";
      return fbm(x * 0.2, z * 0.2, 104) > 0.62 ? "meadow" : "grass";
    };
    R.trees = () => scatterTrees(105, 18, 34, (x, z) => R.heightAt(x, z) > 0 && isl.some(I => Math.hypot(x - I.x, z - I.z) < I.r - 2) && Math.hypot(x, z - 30) > 5 && Math.hypot(x, z) > 4, rr => (rr() < 0.6 ? { k: "fruit", fruit: rr() < 0.4 ? "triangle" : "round", s: 0.8 } : { k: "oak", s: 0.6 + rr() * 0.3, blossom: rr() < 0.5 }));
    R.build = (W, put, block) => {
      exitGate(W, put, block, R);
      put(buildingMesh("observatory"), isl[4].x, isl[4].z - 2, 0); block(isl[4].x, isl[4].z - 2, 1.8);
      W.spots.observatory = { x: isl[4].x, z: isl[4].z + 1.4, r: 1.8 };
      /* clouds below, drifting */
      const cm = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
      const clouds = new THREE.Group();
      for (let i = 0; i < 26; i++) { const g = M.part("cloud" + (i % 4), 0.5, v => { for (let k = 0; k < 4 + (i % 4); k++) M.ell(v, k * 4 - 6, (k % 2) * 1.5, (k % 3) * 2 - 2, 4 + (k % 2), 2.5, 4, 0xffffff); }); g.traverse(m => { if (m.isMesh) m.material = cm; }); g.position.set((hash(i, 1, 9) - 0.5) * 120, -4 - hash(i, 2, 9) * 8, (hash(i, 3, 9) - 0.5) * 120); clouds.add(g); }
      W.group.add(clouds);
      W.anim.push((dt) => { for (const c of clouds.children) { c.position.x += dt * 0.6; if (c.position.x > 64) c.position.x = -64; } });
    };
    R.places = W => placesOf(W, R);
    return R;
  })();
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;

  /* ---------------------------------------------------------------- the world */
  function make(scene, id) {
    const RG = (id && REGIONS[id]) || CENTRAL, central = RG === CENTRAL;
    const W = { scene, id: RG.id, RG, chunks: new Map(), group: new THREE.Group(), props: new THREE.Group(), water: [], trees: [], obst: [], gates: [], spots: {}, t: 0, PLAN, anim: [] };
    scene.add(W.group); scene.add(W.props);
    /* the height field, quantised to the half-metre voxels; kept per column */
    const HC = new Map();
    const colH = (i, k) => { const key = i * 4096 + k; let h = HC.get(key); if (h == null) { h = Math.round(RG.heightAt(i * VS + VS / 2, k * VS + VS / 2) / VS); HC.set(key, h); } return h; };
    W.colH = colH;
    /* the ground's height under a point (m), stepping smoothly between voxels for walkers */
    W.ground = (x, z) => colH(Math.floor(x / VS), Math.floor(z / VS)) * VS;
    W.smooth = (x, z) => {
      const fx = x / VS - 0.5, fz = z / VS - 0.5, i = Math.floor(fx), k = Math.floor(fz), u = fx - i, w = fz - k;
      const a = colH(i, k), b = colH(i + 1, k), c = colH(i, k + 1), d = colH(i + 1, k + 1);
      const mx = Math.max(a, b, c, d), mn = Math.min(a, b, c, d);
      if (mx - mn > 2) return W.ground(x, z);                                // a cliff edge: no ramp down it
      return (a * (1 - u) * (1 - w) + b * u * (1 - w) + c * (1 - u) * w + d * u * w) * VS;
    };
    const F = PLAN.fall;
    W.waterAt = central ? (x, z) => {
      const g = W.ground(x, z);
      if (inPond(x, z) < 1.05 && g < PLAN.pond.level) return PLAN.pond.level;
      if (z < PLAN.cliffZ - 0.5 && z > PLAN.cliffZ - 14 && Math.abs(x - F.x) < F.w / 2 && g < F.top) return F.top;
      return null;
    } : (x, z) => RG.waterAt ? RG.waterAt(x, z, W.ground(x, z)) : null;
    W.depth = (x, z) => { const w = W.waterAt(x, z); return w == null ? 0 : w - W.ground(x, z); };
    W.surface = (x, z) => RG.surfaceAt(x, z, W.ground(x, z));
    /* can something of radius r stand here, coming from height y? (a step of half a metre is
       fine; more is a wall; the gates and the things in the world are solid) */
    W.blocked = (x, z, r, y) => {
      const g = W.ground(x, z);
      if (y != null && g - y > 0.55) return true;
      if (Math.hypot(x, z) > RG.edge) return true;
      if (g < -8) return true;                                               // (the sky's edge: nothing under you)
      for (const o of W.obst) if (!o.off && Math.abs(x - o.x) < o.r + r + o.w && Math.abs(z - o.z) < o.r + r + o.d) {
        if (o.box) { const lx = Math.cos(o.a) * (x - o.x) - Math.sin(o.a) * (z - o.z), lz = Math.sin(o.a) * (x - o.x) + Math.cos(o.a) * (z - o.z); if (Math.abs(lx) < o.w + r && Math.abs(lz) < o.d + r) return true; }
        else if (Math.hypot(x - o.x, z - o.z) < o.r + r) return true;
      }
      return false;
    };
    const solid = (i, y, k) => y <= colH(i, k);

    /* -- a chunk: its columns' voxels (and a border, for the culling and the shading) */
    function buildChunk(ci, ck) {
      const v = new Vox(), i0 = ci * CH, k0 = ck * CH;
      let lo = 1e9;
      for (let di = -1; di <= CH; di++) for (let dk = -1; dk <= CH; dk++) {
        const i = i0 + di, k = k0 + dk, h = colH(i, k);
        const mn = Math.min(h, colH(i + 1, k), colH(i - 1, k), colH(i, k + 1), colH(i, k - 1)) - 1;
        if (h < -20) continue;                                                // (the open sky)
        const x = (i + 0.5) * VS, z = (k + 0.5) * VS, surf = RG.surfaceAt(x, z, h * VS), top = (RG.COL && RG.COL[surf]) || COL[surf] || COL.grass;
        const cliff = h - mn > 6, lowest = RG.bottom ? Math.max(mn, Math.round(RG.bottom(x, z, h * VS) / VS)) : mn;
        /* the column's voxels lie under its height: the top one's upper face is the ground the
           walkers stand on (h voxels up) */
        const side = RG.side || null;
        for (let y = lowest; y < h; y++) {
          let c;
          const d = h - 1 - y;
          if (d === 0) c = cliff && surf !== "stone" && surf !== "path" && surf !== "metal" && surf !== "plank" ? mixC(top(x, z, y), 0x5a8a3a, 0.2) : top(x, z, y);
          else if (side) c = side(i, y, k, d, surf, cliff);
          else if (d === 1 && (surf === "grass" || surf === "meadow" || surf === "high") && !cliff) c = grain(0x5a8a34, i, y, k, 0.08);
          else c = cliff || d > 2 ? rock(i, y, k) : surf === "sand" || surf === "bed" ? grain(0xc8b888, i, y, k, 0.05) : dirt(i, y, k);
          v.set(di, y, dk, c);
        }
        lo = Math.min(lo, mn);
      }
      const inside = (x, z) => x >= 0 && x < CH && z >= 0 && z < CH;
      const geo = meshVox(v, VS, (x, y, z, nx, ny, nz) => inside(x, z) && (ny >= 0 || RG.bottom));
      const m = new THREE.Mesh(geo, M.mat("vox"));
      m.position.set(i0 * VS, 0, k0 * VS);
      m.matrixAutoUpdate = false; m.updateMatrix();
      return m;
    }
    /* build the chunks round the keeper, and drop the ones far behind */
    W.update = (x, z, rad) => {
      rad = rad || 38;
      const ci0 = Math.floor((x - rad) / (CH * VS)), ci1 = Math.floor((x + rad) / (CH * VS)), ck0 = Math.floor((z - rad) / (CH * VS)), ck1 = Math.floor((z + rad) / (CH * VS));
      let built = 0;
      const want = [];
      for (let ci = ci0; ci <= ci1; ci++) for (let ck = ck0; ck <= ck1; ck++) {
        const cx = (ci + 0.5) * CH * VS, cz = (ck + 0.5) * CH * VS, d = Math.hypot(cx - x, cz - z);
        if (d > rad + 6 || Math.hypot(cx, cz) > RG.bound) continue;
        const key = ci + "," + ck; if (!W.chunks.has(key)) want.push([d, ci, ck, key]);
      }
      want.sort((a, b) => a[0] - b[0]);
      for (const [, ci, ck, key] of want) { if (built >= (W.ready ? 2 : 999)) break; const m = buildChunk(ci, ck); W.group.add(m); W.chunks.set(key, m); built++; }
      for (const [key, m] of W.chunks) {
        const [ci, ck] = key.split(",").map(Number), cx = (ci + 0.5) * CH * VS, cz = (ck + 0.5) * CH * VS;
        if (Math.hypot(cx - x, cz - z) > rad + 30) { W.group.remove(m); m.geometry.dispose(); W.chunks.delete(key); }
      }
      W.ready = true;
      return built;
    };

    /* ---------------------------------------------------------------- water */
    const waterMat = new THREE.MeshPhongMaterial({ color: 0x3a9ad8, transparent: true, opacity: 0.68, shininess: 80, specular: 0x99ccff, depthWrite: false });
    W.waterMat = waterMat;
    if (!central && RG.sea != null) {
      const n = 72, S = (RG.edge + 6) * 2, g = new THREE.PlaneGeometry(S, S, n, n);
      g.rotateX(-PI / 2);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i); if (RG.heightAt(x, z) > RG.sea + 0.25 && !(RG.waterAt && RG.waterAt(x, z, RG.heightAt(x, z)) != null)) pos.setY(i, -3); }
      if (RG.waterCol) waterMat.color.setHex(RG.waterCol);
      const m = new THREE.Mesh(g, waterMat); m.position.y = RG.sea - 0.06; m.renderOrder = 2; W.group.add(m); W.water.push(m);
    }
    if (central) {
      const P = PLAN.pond, g = new THREE.PlaneGeometry(P.rx * 2.6, P.rz * 2.6, 40, 40);
      g.rotateX(-PI / 2);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) { const x = pos.getX(i) + P.x, z = pos.getZ(i) + P.z; if (inPond(x, z) > 1.2) pos.setY(i, -3); }
      const m = new THREE.Mesh(g, waterMat); m.position.set(P.x, P.level - 0.06, P.z); m.renderOrder = 2;
      W.group.add(m); W.water.push(m);
    }
    /* the waterfall: a falling sheet, foam at its foot */
    if (central) {
      const tex = waterTex();
      let fz = PLAN.cliffZ; for (let z = PLAN.cliffZ - 4; z < PLAN.cliffZ + 4; z += 0.25) if (W.ground(F.x, z) < F.top - 1) { fz = z; break; }
      F.z = fz;
      const fm = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide });
      const sheet = new THREE.Mesh(new THREE.PlaneGeometry(F.w, F.top - PLAN.pond.level + 0.3, 1, 1), fm);
      sheet.position.set(F.x, (F.top + PLAN.pond.level) / 2, F.z + 0.15); sheet.renderOrder = 3;
      W.group.add(sheet); W.fallSheet = sheet; W.fallTex = tex;
      const foam = new THREE.Mesh(new THREE.CircleGeometry(F.w * 0.75, 16), new THREE.MeshBasicMaterial({ color: 0xf0f8ff, transparent: true, opacity: 0.6, depthWrite: false }));
      foam.rotation.x = -PI / 2; foam.position.set(F.x, PLAN.pond.level + 0.02, F.z + 1.4); foam.renderOrder = 3; W.group.add(foam); W.foam = foam;
      /* the stream at the top that feeds it */
      const st = new THREE.Mesh(new THREE.PlaneGeometry(F.w + 0.4, 13), waterMat); st.rotation.x = -PI / 2; st.position.set(F.x, F.top - 0.05, F.z - 6.4); st.renderOrder = 2; W.group.add(st);
    }

    /* ---------------------------------------------------------------- things */
    const put = (o, x, z, a, y) => { o.position.set(x, y != null ? y : W.ground(x, z), z); if (a) o.rotation.y = a; o.matrixAutoUpdate = false; o.updateMatrix(); W.props.add(o); return o; };
    const block = (x, z, r, o) => { const b = Object.assign({ x, z, r: r || 0.4, w: 0, d: 0 }, o || {}); W.obst.push(b); return b; };
    /* trees: fruit trees keep track of their fruit */
    for (const T of (central ? PLAN.trees : RG.trees())) {
      const s = T.s || 1, y = W.ground(T.x, T.z);
      const tr = M.prop("tree", { k: T.k, s, seed: Math.floor(hash(T.x | 0, T.z | 0, 1) * 100), c: T.c, snow: T.snow, blossom: T.blossom });
      put(tr, T.x, T.z, hash(T.x | 0, 2, T.z | 0) * PI * 2);
      const rec = { x: T.x, z: T.z, y, k: T.k, s, m: tr, fruit: T.fruit || null, hang: [], grow: 0, spots: T.k === "fruit" ? M.fruitSpots(s) : [] };
      if (rec.fruit) for (let i = 0; i < rec.spots.length; i++) if (hash(i, T.x | 0, T.z | 0) < 0.6) addFruit(rec, i);
      W.trees.push(rec);
      block(T.x, T.z, T.k === "oak" ? 0.9 * s : T.k === "mushroom" ? 0.6 : 0.45 * s);
    }
    function addFruit(rec, i) {
      const f = M.prop("fruit", { id: rec.fruit }), sp = rec.spots[i];
      f.position.set(rec.x + sp[0], rec.y + sp[1], rec.z + sp[2]); f.scale.setScalar(1.2); W.props.add(f);
      rec.hang[i] = f;
    }
    W.addFruit = addFruit;
    /* a fruit tree grows fruit again in time (sooner with a green-thumbed Chao nearby) */
    W.growFruit = (dt, boost) => {
      for (const t of W.trees) if (t.fruit) {
        t.grow += dt * (boost ? boost(t) : 1);
        if (t.grow > 45) { t.grow = 0; const free = t.spots.map((s, i) => i).filter(i => !t.hang[i]); if (free.length) addFruit(t, free[Math.floor(Math.random() * free.length)]); }
      }
    };
    /* shake one down: the fruit falls to the ground beside the tree */
    W.shake = (t) => {
      const have = t.hang.map((f, i) => f ? i : -1).filter(i => i >= 0);
      if (!have.length) return null;
      const i = have[Math.floor(Math.random() * have.length)], f = t.hang[i]; t.hang[i] = null;
      const sp = t.spots[i];
      return { mesh: f, id: t.fruit, x: t.x + sp[0], y: t.y + sp[1], z: t.z + sp[2] };
    };
    /* flowers, rocks, bushes, scattered by the plan */
    const R = (n) => hash(n, 91, 3);
    for (let n = 0; n < 420; n++) {
      const x = (R(n) - 0.5) * RG.radius * 2.1, z = (hash(n, 17, 5) - 0.5) * RG.radius * 2.1, h = W.ground(x, z), s = RG.surfaceAt(x, z, h);
      if (Math.hypot(x, z) > RG.radius || W.blocked(x, z, 0.6) || W.waterAt(x, z) != null) continue;
      const fl = RG.flowers || [0xf05a7a, 0xf8e040, 0xf8f8f8, 0xb070f0, 0xf08a3a, 0x6ab0f8];
      if (s === "meadow" || (s === "grass" && hash(n, 3, 3) < (RG.flowerK || 0.3))) put(M.prop("flower", { c: fl[n % fl.length], k: n % 3 }), x, z, R(n * 3) * 6);
      else if ((s === "grass" || s === "rock" || s === "high" || s === "snow") && hash(n, 4, 4) < (RG.rockK || 0.1)) { put(M.prop("rock", { s: 0.6 + R(n * 7) * 0.7, k: n % 3, c: RG.rockCol }), x, z, R(n * 5) * 6); block(x, z, 0.4); }
    }
    /* grass: tufts of blades all over the lawns (one mesh, drawn many times) */
    {
      const tuft = M.part("tuft", 1 / 16, v => {
        for (const [x, z, h, c] of [[0, 0, 3, 0x5aa83a], [1, 1, 2, 0x6ab84a], [-1, 1, 2, 0x4a9a34]])
          for (let y = 0; y < h; y++) v.set(x, y, z, M.mixC(c, 0xb8e070, y / (h + 1)));
      });
      const geo = tuft.children[0].geometry, at = [];
      if (RG.grassTint) { /* (each garden's grass its own green) */ }
      for (let n = 0; n < 4000 && at.length < 1500; n++) {
        const x = (hash(n, 5, 41) - 0.5) * 90, z = (hash(n, 6, 43) - 0.5) * 90;
        if (Math.hypot(x, z) > RG.radius + 1) continue;
        const h = W.ground(x, z), sf = RG.surfaceAt(x, z, h);
        if (sf !== "grass" && sf !== "meadow" && sf !== "high") continue;
        if (W.blocked(x, z, 0.2)) continue;
        at.push([x, h, z, hash(n, 7, 7) * PI * 2, 0.55 + hash(n, 8, 8) * 0.5]);
      }
      const im = new THREE.InstancedMesh(geo, M.mat("vox"), at.length), o = new THREE.Object3D();
      at.forEach(([x, y, z, a, k], i) => { o.position.set(x, y, z); o.rotation.y = a; o.scale.setScalar(k); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
      im.receiveShadow = true; W.group.add(im); W.grass = im;
    }
    /* boulders on the rim and round the pond */
    if (central) for (let n = 0; n < 40; n++) {
      const a = n / 40 * PI * 2, r = 44 + hash(n, 2, 2) * 3, x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (gateCorridor(x, z) < 6 || z < PLAN.cliffZ) continue;
      put(M.prop("rock", { s: 1.6 + hash(n, 1, 1) * 1.2, c: 0x8a8478, k: n }), x, z, a);
    }

    if (!central) RG.build(W, put, block);
    else {
    /* the Garden Hall: a cottage on the plaza's south side (its door faces the garden) */
    const hall = buildingMesh("hall");
    put(hall, PLAN.hall[0], PLAN.hall[1], 0);
    block(PLAN.hall[0], PLAN.hall[1], 0, { box: true, w: 4.6, d: 3.1, a: 0 });
    block(PLAN.hall[0], PLAN.hall[1] - 3.6, 0, { box: true, w: 1.4, d: 0.5, a: 0, door: true }).off = true;
    W.spots.hall = { x: PLAN.hall[0], z: PLAN.hall[1] - 4.2, r: 1.5 };
    /* the fountain in the plaza */
    const fnt = buildingMesh("fountain"); put(fnt, PLAN.fountain[0], PLAN.fountain[1], 0); block(PLAN.fountain[0], PLAN.fountain[1], 2.4);
    W.fountain = fnt;
    const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.25, 1.6, 8, 1, true), new THREE.MeshBasicMaterial({ map: waterTex(), transparent: true, opacity: 0.75, depthWrite: false }));
    jet.position.set(PLAN.fountain[0], 2 + 1.9, PLAN.fountain[1]); W.props.add(jet); W.jet = jet;
    const pool = new THREE.Mesh(new THREE.CircleGeometry(1.95, 20), waterMat); pool.rotation.x = -PI / 2; pool.position.set(PLAN.fountain[0], 2.62, PLAN.fountain[1]); pool.renderOrder = 2; W.props.add(pool);
    /* the incubator, the mailbox, the book */
    put(buildingMesh("incubator"), PLAN.incubator[0], PLAN.incubator[1], 0); block(PLAN.incubator[0], PLAN.incubator[1], 0.7);
    W.spots.incubator = { x: PLAN.incubator[0], z: PLAN.incubator[1], r: 1.6, y: 2 + 0.78 };
    put(buildingMesh("mailbox"), PLAN.mailbox[0], PLAN.mailbox[1], PI); block(PLAN.mailbox[0], PLAN.mailbox[1], 0.3);
    W.spots.mailbox = { x: PLAN.mailbox[0], z: PLAN.mailbox[1], r: 1.4 };
    put(buildingMesh("lectern"), PLAN.book[0], PLAN.book[1], PI); block(PLAN.book[0], PLAN.book[1], 0.35);
    W.spots.book = { x: PLAN.book[0], z: PLAN.book[1], r: 1.4 };
    /* the training ground: a fenced yard east of the plaza, its gap facing the plaza */
    { const [yx, yz, yr] = PLAN.yard;
      put(buildingMesh("yard"), yx, yz, 0, 2);
      block(yx, yz - yr, 0, { box: true, w: yr, d: 0.15, a: 0 }); block(yx, yz + yr, 0, { box: true, w: yr, d: 0.15, a: 0 });
      block(yx + yr, yz, 0, { box: true, w: 0.15, d: yr, a: 0 });
      block(yx - yr, yz - (yr + 1) / 2, 0, { box: true, w: 0.15, d: (yr - 1) / 2, a: 0 }); block(yx - yr, yz + (yr + 1) / 2, 0, { box: true, w: 0.15, d: (yr - 1) / 2, a: 0 });
      block(yx + 2.33, yz - 2, 0.8); block(yx + 2.67, yz + 2.33, 0.6); block(yx - 2.33, yz - 1, 0.9);
      const sign = buildingMesh("sign"); put(sign, yx - yr - 0.6, yz - 1.6, PI / 2); block(yx - yr - 0.6, yz - 1.6, 0.25);
      W.spots.yard = { x: yx - yr - 0.4, z: yz, r: 2 }; }
    /* the gates */
    for (const G of PLAN.gates) {
      const gm = buildingMesh(G.lift ? "balloon" : "gate");
      put(gm, G.at[0], G.at[1], G.face);
      const ob = block(G.at[0], G.at[1], 0, { box: true, w: G.lift ? 1.6 : 3.6, d: G.lift ? 1.6 : 0.7, a: G.face });
      const gate = Object.assign({ m: gm, ob, open: false }, G);
      W.gates.push(gate);
      const sign = buildingMesh("sign"), ix = Math.sin(G.face), iz = Math.cos(G.face), tx = Math.cos(G.face), tz = -Math.sin(G.face);
      const sx = G.at[0] + ix * 1.8 + tx * 4.8, sz = G.at[1] + iz * 1.8 + tz * 4.8;
      put(sign, sx, sz, G.face + PI); block(sx, sz, 0.25);
      W.spots["gate-" + G.id] = { x: G.at[0] + Math.sin(G.face) * 2.2, z: G.at[1] + Math.cos(G.face) * 2.2, r: 2.4, gate };
    }
    W.openGate = (g) => { if (g.open) return; g.open = true; g.ob.off = true; if (!g.lift) { W.props.remove(g.m); const o = buildingMesh("gate-open"); o.position.copy(g.m.position); o.rotation.copy(g.m.rotation); o.updateMatrix(); o.matrixAutoUpdate = false; W.props.add(o); g.m = o; } };
    /* fences round the orchard, a bridge of stepping stones to the island */
    { const [[ax, az], [bx, bz]] = PLAN.stones, n = Math.ceil(Math.hypot(bx - ax, bz - az) / 1.25);
      for (let i = 0; i <= n; i++) { const t = i / n, x = ax + (bx - ax) * t + Math.sin(i * 1.7) * 0.25, z = az + (bz - az) * t + Math.cos(i * 1.3) * 0.25; if (W.depth(x, z) > 0.15) { const st = M.prop("rock", { s: 0.5, c: 0xb8b0a0, k: i }); put(st, x, z, i, PLAN.pond.level - 0.42); W.obst.push({ x, z, r: 0.5, w: 0, d: 0, step: PLAN.pond.level + 0.1 }); } } }
    }
    W.steps = W.obst.filter(o => o.step);
    W.standAt = (x, z) => { for (const s of W.steps) if (Math.hypot(x - s.x, z - s.z) < 0.6) return s.step; return null; };
    W.obst = W.obst.filter(o => !o.step);

    /* where creatures like to be, for their days */
    W.places = !central ? RG.places(W) : {
      water: () => { const P = PLAN.pond, a = Math.random() * PI * 2, r = Math.random() * 0.7; return [P.x + Math.cos(a) * P.rx * r, P.z + Math.sin(a) * P.rz * r]; },
      shore: () => { const P = PLAN.pond, a = Math.random() * PI * 2; return [P.x + Math.cos(a) * P.rx * 1.2, P.z + Math.sin(a) * P.rz * 1.2]; },
      trees: () => { const t = W.trees[Math.floor(Math.random() * W.trees.length)]; const a = Math.random() * PI * 2; return [t.x + Math.cos(a) * 1.6, t.z + Math.sin(a) * 1.6]; },
      flowers: () => [PLAN.meadow[0] + (Math.random() - 0.5) * 14, PLAN.meadow[1] + (Math.random() - 0.5) * 14],
      high: () => [(Math.random() - 0.5) * 50, -34 - Math.random() * 6],
      sun: () => [PLAN.plaza[0] + (Math.random() - 0.5) * 12, PLAN.plaza[1] + (Math.random() - 0.5) * 8],
      shade: () => { const t = W.trees.filter(t => t.k === "oak")[Math.floor(Math.random() * 4)] || W.trees[0]; return [t.x + (Math.random() - 0.5) * 3, t.z + (Math.random() - 0.5) * 3]; },
      people: () => [PLAN.spawn[0] + (Math.random() - 0.5) * 6, PLAN.spawn[1] - 4 + (Math.random() - 0.5) * 6],
      any: () => { for (let i = 0; i < 20; i++) { const a = Math.random() * PI * 2, r = Math.random() * 38, x = Math.cos(a) * r, z = Math.sin(a) * r; if (!W.blocked(x, z, 0.5) && !(z < PLAN.cliffZ + 1 && z > PLAN.cliffZ - 3)) return [x, z]; } return [0, 10]; },
    };
    W.tick = (dt, t) => {
      W.t += dt;
      for (const a of W.anim) a(dt, W.t);
      if (W.fallTex) W.fallTex.offset.y = (W.t * 1.6) % 1;
      if (W.jet) { W.jet.material.map.offset.y = (W.t * 2) % 1; W.jet.scale.y = 1 + Math.sin(W.t * 6) * 0.05; }
      if (W.foam) W.foam.scale.setScalar(1 + Math.sin(W.t * 5) * 0.06);
      waterMat.opacity = 0.66 + Math.sin(W.t * 0.8) * 0.03;
    };
    return W;
  }

  /* a texture of falling water, drawn once */
  function waterTex() {
    const c = document.createElement("canvas"); c.width = 32; c.height = 64; const x = c.getContext("2d");
    x.fillStyle = "#6ab8f0"; x.fillRect(0, 0, 32, 64);
    for (let i = 0; i < 40; i++) { x.fillStyle = i % 3 ? "rgba(255,255,255,.55)" : "rgba(40,120,200,.5)"; x.fillRect((hash(i, 1, 1) * 32) | 0, (hash(i, 2, 2) * 64) | 0, 2, 6 + (hash(i, 3, 3) * 10 | 0)); }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.NearestFilter; t.repeat.set(2, 2);
    return t;
  }

  /* ---------------------------------------------------------------- buildings and furniture
     All voxels, a sixth of a metre each (SB) */
  const SB = 1 / 6;
  function buildingMesh(k) {
    return part("bld:" + k, SB, (v, gl) => {
      if (k === "hall") {
        const wall = (x, y, z) => grain((y % 5 === 0) ? 0xe0d0b0 : 0xf0e4c8, x, y, z, 0.03), beam = (x, y, z) => grain(0x8a5a32, x, y, z, 0.05);
        blk(v, -27, 0, -18, 27, 2, 18, (x, y, z) => grain(0xb0a898, x, y, z, 0.04));                                     // the stone base
        shape(v, -26, 3, -17, 26, 22, 17, (x, y, z) => Math.abs(x) <= 25.5 && Math.abs(z) <= 16.5, wall);
        for (const x of [-25, -12, 0, 12, 25]) blk(v, x, 3, -17, x, 22, -17, beam), blk(v, x, 3, 17, x, 22, 17, beam);
        blk(v, -26, 22, -17, 26, 23, 17, beam);
        const tile = (x, yy, z) => grain(((x + yy) % 4 === 0) ? 0xa83a2a : 0xc8482e, x, yy, z, 0.05);
        for (let y = 0; y < 17; y++) { const z0 = Math.round(-21 + y * 1.25); blk(v, -30, 24 + y, z0, 30, 24 + y, z0 + 1, tile); blk(v, -30, 24 + y, -z0 - 1, 30, 24 + y, -z0, tile); }
        for (let y = 24; y < 40; y++) { const w = 21 - (y - 24) * 1.25 | 0; blk(v, -26, y, -w + 1, -26, y, w - 1, wall); blk(v, 26, y, -w + 1, 26, y, w - 1, wall); }
        blk(v, 14, 30, 4, 18, 46, 8, (x, y, z) => grain(0x9a5a3a, x, y, z, 0.08));                                          // a chimney
        /* the door (north, toward the garden), windows, a porch roof and the sign */
        blk(v, -4, 3, -18, 4, 15, -18, (x, y, z) => grain(Math.abs(x) === 4 || y === 15 ? 0x6a4022 : 0x9a6a3a, x, y, z, 0.05));
        v.set(2, 9, -19, 0xf0c040);
        for (const x of [-17, 17]) { blk(v, x - 4, 9, -18, x + 4, 16, -18, (xx, y) => (xx === x || y === 12 ? 0x8a5a32 : 0x9ad8f8)); gl.set(x - 2, 14, -18, 0xd8f0ff); }
        for (const z of [-8, 8]) { blk(v, -27, 9, z - 3, -27, 16, z + 3, (x, y, zz) => (zz === z || y === 12 ? 0x8a5a32 : 0x9ad8f8)); blk(v, 27, 9, z - 3, 27, 16, z + 3, (x, y, zz) => (zz === z || y === 12 ? 0x8a5a32 : 0x9ad8f8)); }
        blk(v, -8, 17, -24, 8, 17, -18, (x, y, z) => grain(0xa83a2a, x, y, z)); for (const x of [-7, 7]) blk(v, x, 3, -23, x, 16, -23, beam);
        blk(v, -9, 19, -19, 9, 22, -19, (x, y) => (y === 19 || y === 22 ? 0x6a4022 : 0xf8e8b0));
        for (let x = -6; x <= 6; x += 2) v.set(x, 20 + (x & 2 ? 1 : 0), -20, 0x1f58e0);
        /* flower boxes */
        for (const x of [-17, 17]) { blk(v, x - 4, 7, -20, x + 4, 8, -19, 0x8a5a32); for (let i = -3; i <= 3; i += 2) v.set(x + i, 9, -20, [0xf05a7a, 0xf8e040, 0xf8f8f8][(i + 3) % 3]); }
      } else if (k === "fountain") {
        shape(v, -15, 0, -15, 15, 4, 15, (x, y, z) => { const r = Math.hypot(x, z); return r <= 14 && (r >= 11.5 || y <= 1); }, (x, y, z) => grain(y === 4 ? 0xe0d8c8 : 0xc8c0b0, x, y, z, 0.04));
        cap(v, 0, 0, 0, 0, 9, 0, 2.6, 2, (x, y, z) => grain(0xd8d0c0, x, y, z));
        shape(v, -7, 9, -7, 7, 11, 7, (x, y, z) => Math.hypot(x, z) <= 6.5 && (Math.hypot(x, z) >= 5 || y === 9), (x, y, z) => grain(0xe0d8c8, x, y, z));
        for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2; v.set(Math.round(Math.cos(a) * 12.5), 5, Math.round(Math.sin(a) * 12.5), 0xf8d040); }
      } else if (k === "incubator") {
        cap(v, 0, 0, 0, 0, 3, 0, 4.5, 4, (x, y, z) => grain(0xc8c0b0, x, y, z));
        shape(v, -5, 3, -5, 5, 5, 5, (x, y, z) => Math.hypot(x, z) <= 4.6 && (Math.hypot(x, z) >= 3.2 || y === 3), (x, y, z) => grain(((x + z) & 1) ? 0xd8b070 : 0xc89a58, x, y, z, 0.06));
        for (let i = 0; i < 10; i++) { const a = i / 10 * PI * 2; gl.set(Math.round(Math.cos(a) * 4.4), 5, Math.round(Math.sin(a) * 4.4), i % 2 ? 0xffd040 : 0xff9a3a); }
      } else if (k === "mailbox") {
        cap(v, 0, 0, 0, 0, 7, 0, 0.7, 0.7, 0x6a4a2a);
        blk(v, -2, 7, -3, 2, 10, 3, (x, y, z) => grain(0x1f58e0, x, y, z)); blk(v, -2, 11, -3, 2, 11, 3, x => 0x2a68f0);
        blk(v, 3, 9, 1, 3, 13, 1, 0xe42630); blk(v, 3, 12, 2, 3, 13, 3, 0xe42630);
        blk(v, -1, 8, 4, 1, 9, 4, 0x0c1d66);
      } else if (k === "lectern") {
        cap(v, 0, 0, 0, 0, 6, 0, 1, 1, 0x8a5a32); blk(v, -3, 0, -2, 3, 0, 2, 0x6a4022);
        shape(v, -4, 6, -3, 4, 9, 3, (x, y, z) => Math.abs(z * 0.6 + (y - 7.5)) < 0.9, (x, y, z) => grain(Math.abs(x) < 1 ? 0xf8f0d8 : x < 0 ? 0xe42630 : 0xf8f0d8, x, y, z));
      } else if (k === "gate") {
        for (const s of [-1, 1]) { blk(v, s * 20 - 3, 0, -3, s * 20 + 3, 26, 3, (x, y, z) => grain(((y >> 2) + (x & 1)) % 2 ? 0xa8a090 : 0x989080, x, y, z, 0.05)); blk(v, s * 20 - 4, 26, -4, s * 20 + 4, 28, 4, 0xb8b0a0); }
        blk(v, -23, 29, -3, 23, 32, 3, (x, y, z) => grain(0xa8a090, x, y, z, 0.05));
        for (const z of [-4, 4]) blk(v, -10, 33, z, 10, 36, z, (x, y) => (y === 33 || y === 36 ? 0x6a4022 : 0xf8e8b0));
        for (let x = -16; x <= 16; x += 4) blk(v, x, 0, 0, x + 2, 22, 0, (xx, y, z) => grain(0x8a5a32, xx, y, z, 0.06));
        for (const y of [5, 17]) blk(v, -17, y, -1, 17, y + 1, -1, 0x6a4022);
        gl.set(0, 12, -2, 0xffd040); gl.set(-1, 12, -2, 0xffd040);
      } else if (k === "balloon") {
        blk(v, -9, 0, -9, 9, 2, 9, (x, y, z) => grain(0x8a5a32, x, y, z, 0.06));
        for (const [x, z] of [[-8, -8], [8, -8], [-8, 8], [8, 8]]) blk(v, x, 3, z, x, 14, z, 0x6a4022);
        blk(v, -8, 3, -8, 8, 6, 8, (x, y, z) => (Math.abs(x) === 8 || Math.abs(z) === 8) ? grain(0xb08a50, x, y, z) : null);
        ell(v, 0, 34, 0, 16, 17, 16, (x, y, z) => grain(((Math.atan2(z, x) / PI * 6 + 6) | 0) % 2 ? 0xe42630 : 0xf8f0e0, x, y, z, 0.03));
        for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; v.set(Math.round(Math.cos(a) * 13), 22, Math.round(Math.sin(a) * 13), 0x3a3a3a); }
        for (let y = 15; y < 22; y++) for (const [x, z] of [[-8, -8], [8, -8], [-8, 8], [8, 8]]) v.set(Math.round(x * (1 + (y - 15) * 0.07)), y, Math.round(z * (1 + (y - 15) * 0.07)), 0x6a6a6a);
      } else if (k === "gate-open") {
        for (const s2 of [-1, 1]) { blk(v, s2 * 20 - 3, 0, -3, s2 * 20 + 3, 26, 3, (x, y, z) => grain(((y >> 2) + (x & 1)) % 2 ? 0xa8a090 : 0x989080, x, y, z, 0.05)); blk(v, s2 * 20 - 4, 26, -4, s2 * 20 + 4, 28, 4, 0xb8b0a0); }
        blk(v, -23, 29, -3, 23, 32, 3, (x, y, z) => grain(0xa8a090, x, y, z, 0.05));
        for (const z of [-4, 4]) blk(v, -10, 33, z, 10, 36, z, (x, y) => (y === 33 || y === 36 ? 0x6a4022 : 0xf8e8b0));
        for (const s2 of [-1, 1]) for (let x = 0; x < 8; x++) blk(v, s2 * (17 - x * 2), 0, -2 - x * 2, s2 * (17 - x * 2) + (s2 > 0 ? 1 : -1), 22, -2 - x * 2, (xx, y) => grain(y % 6 === 5 ? 0x6a4022 : 0x8a5a32, xx, y, x, 0.06));
        gl.set(0, 30, -4, 0x6ad050); gl.set(-1, 30, -4, 0x6ad050);
      } else if (k === "post") {
        blk(v, -1, 0, -1, 1, 12, 1, (x, y, z) => grain(0x6a4a2a, x, y, z, 0.06));
      } else if (k === "hut") {
        blk(v, -12, 0, -12, 12, 1, 12, (x, y, z) => grain(0xa8804a, x, y, z, 0.05));
        for (const [x, z] of [[-11, -11], [11, -11], [-11, 11], [11, 11]]) blk(v, x, 2, z, x, 14, z, 0x6a4a2a);
        for (const z of [-11, 11]) blk(v, -11, 2, z, 11, 7, z, (x, y) => (y % 2 ? 0xc8a070 : 0xb08a58));
        blk(v, 11, 2, -11, 11, 7, 11, (x, y, z) => Math.abs(z) < 3 && y < 7 ? null : (y % 2 ? 0xc8a070 : 0xb08a58));
        blk(v, -11, 2, -11, -11, 7, 11, (x, y) => (y % 2 ? 0xc8a070 : 0xb08a58));
        for (let y = 0; y < 7; y++) blk(v, -14 + y * 2, 15 + y, -14 + y * 2, 14 - y * 2, 15 + y, 14 - y * 2, (x, yy, z) => (Math.abs(x) === 14 - y * 2 || Math.abs(z) === 14 - y * 2) ? grain(((x + z) & 1) ? 0xd8b860 : 0xc8a048, x, yy, z, 0.06) : null);
      } else if (k === "dojo") {
        blk(v, -22, 0, -15, 22, 2, 15, (x, y, z) => grain(0xb0a890, x, y, z, 0.04));
        for (const x of [-20, -7, 7, 20]) for (const z of [-13, 13]) blk(v, x, 3, z, x + 1, 20, z + 1, 0x8a2a22);
        blk(v, -20, 3, 13, 20, 18, 14, (x, y) => (x % 7 === 0 || y === 18 ? 0x6a4022 : 0xf0e8d0));
        blk(v, -20, 3, -14, 20, 18, -13, (x, y) => Math.abs(x) < 4 && y < 15 ? null : (x % 7 === 0 || y === 18 ? 0x6a4022 : 0xf0e8d0));
        for (const x of [-21, 21]) blk(v, x, 3, -13, x, 18, 13, (xx, y, z) => (z % 7 === 0 || y === 18 ? 0x6a4022 : 0xf0e8d0));
        for (let y = 0; y < 8; y++) blk(v, -26 + y * 2, 21 + y, -19 + y * 2, 26 - y * 2, 21 + y, 19 - y * 2, (x, yy, z) => (Math.abs(x) >= 26 - y * 2 - 1 || Math.abs(z) >= 19 - y * 2 - 1) ? grain(0x3a3a4a, x, yy, z, 0.05) : null);
        blk(v, -27, 20, -20, 27, 20, 20, (x, y, z) => (Math.abs(x) === 27 || Math.abs(z) === 20) ? 0x2a2a3a : null);
        blk(v, -6, 14, -16, 5, 17, -16, (x, y) => (y === 14 || y === 17 ? 0x6a4022 : 0xf8f0d8));
        for (const x of [-4, -1, 2]) v.set(x, 15 + (x & 1), -17, 0x1a1a1a);
      } else if (k === "log") {
        cap(v, -9, 2, 0, 9, 2, 0, 2.2, 2.2, (x, y, z) => grain(Math.abs(x) >= 9 ? 0xc8a070 : ((y + z) & 1 ? 0x6a4a2a : 0x7a5a32), x, y, z, 0.06));
        for (const x of [-6, -1, 4]) v.set(x, 5, 0, 0x5aa83a);
      } else if (k === "cave") {
        for (let y = 0; y < 22; y++) for (let x = -16; x <= 16; x++) for (let z = -8; z <= 0; z++) { const hole = Math.abs(x) < 8 - Math.max(0, y - 10) * 0.6 && y < 16 && z > -6; if (!hole && (Math.abs(x) > 15 - y * 0.4 ? false : true)) v.set(x, y, z, grain(((x + y) & 3) ? 0x8a8478 : 0x6a6458, x, y, z, 0.06)); }
        for (let x = -7; x <= 7; x++) for (let y = 0; y < 15; y++) v.set(x, y, -7, 0x1a1a22);
        for (const x of [-9, 8]) { gl.set(x, 14, 1, 0xffb040); gl.set(x, 13, 1, 0xff8a20); }
      } else if (k === "pillar" || k === "pillar-broken") {
        const n = k === "pillar" ? 22 : 9 + 4;
        blk(v, -3, 0, -3, 3, 2, 3, (x, y, z) => grain(0xb8b0c8, x, y, z, 0.04));
        for (let y = 3; y < n; y++) blk(v, -2, y, -2, 2, y, 2, (x, yy, z) => (Math.abs(x) === 2 && Math.abs(z) === 2) ? null : grain(hash(x, yy, z) < 0.08 ? 0x6a9a6a : ((x + z) & 1 ? 0xc8c0d8 : 0xb8b0c8), x, yy, z, 0.03));
        if (k === "pillar") blk(v, -3, n, -3, 3, n + 1, 3, (x, y, z) => grain(0xb8b0c8, x, y, z, 0.04));
        else for (const [x, z] of [[4, 2], [5, -1], [-4, 3]]) blk(v, x, 0, z, x + 1, 1, z + 1, 0xa8a0b8);
      } else if (k === "arch") {
        for (const s2 of [-1, 1]) blk(v, s2 * 9 - 2, 0, -2, s2 * 9 + 1, 20, 1, (x, y, z) => grain(hash(x, y, z) < 0.1 ? 0x6a9a6a : 0xb0a8c0, x, y, z, 0.04));
        for (let x = -11; x <= 10; x++) { const y = 20 + Math.round(Math.sqrt(Math.max(0, 100 - x * x)) * 0.35); blk(v, x, 18, -2, x, y, 1, (xx, yy, z) => grain(0xb8b0c8, xx, yy, z, 0.04)); }
        gl.set(0, 23, 2, 0x9a7af0);
      } else if (k === "crystal") {
        for (const [ox, oz, h] of [[0, 0, 14], [3, 1, 9], [-2, 2, 8], [1, -3, 7]]) for (let y = 0; y < h; y++) { const w = y > h - 3 ? 0 : 1; for (let x = -w; x <= w; x++) for (let z = -w; z <= w; z++) gl.set(ox + x, y, oz + z, mixC(0x9ad0f8, 0xc8a8f8, y / h)); }
      } else if (k === "arena") {
        for (let a = 0; a < 64; a++) { const t = a / 64 * PI * 2; for (let r = 40; r <= 46; r++) for (let y = 0; y < 2 + Math.max(0, (r - 40)) * 2; y++) v.set(Math.round(Math.cos(t) * r), y, Math.round(Math.sin(t) * r), grain(y === 1 + (r - 40) * 2 ? 0xd8d0e0 : 0xa8a0b8, a, y, r, 0.04)); }
        for (let a = 0; a < 8; a++) { const t = a / 8 * PI * 2 + 0.2; const x = Math.round(Math.cos(t) * 48), z = Math.round(Math.sin(t) * 48); if (Math.sin(t) > 0.9) continue; blk(v, x, 0, z, x + 1, 26, z + 1, 0x8a8aa0); blk(v, x + 2, 18, z, x + 5, 25, z, [0xe42630, 0x1f58e0, 0xffd21a, 0x2fb844][a % 4]); gl.set(x, 27, z, 0xffd040); }
      } else if (k === "altar") {
        blk(v, -4, 0, -4, 4, 3, 4, (x, y, z) => grain(0xb8b0c8, x, y, z, 0.04));
        blk(v, -2, 4, -2, 2, 5, 2, (x, y, z) => grain(0xc8c0d8, x, y, z, 0.03));
        for (let y = 6; y < 10; y++) gl.set(0, y, 0, mixC(0x6ad8f0, 0xb070f0, (y - 6) / 4));
      } else if (k === "lab") {
        blk(v, -26, 0, -20, 26, 1, 20, 0x5a606a);
        blk(v, -25, 2, -19, 25, 22, 19, (x, y, z) => (Math.abs(x) === 25 || Math.abs(z) === 19) ? ((y % 6 === 0) ? 0x5a606a : grain(0xb8c0cc, x, y, z, 0.03)) : null);
        blk(v, -4, 2, -19, 3, 12, -19, (x, y) => (x === -4 || x === 3 || y === 12 ? 0x3a404a : 0x40d0f0));
        for (const x of [-16, 13]) blk(v, x, 10, -20, x + 4, 15, -20, 0x9ad8f8);
        ell(v, 0, 22, 0, 18, 8, 14, (x, y, z) => y < 22 ? null : grain(0x8a909a, x, y, z, 0.03));
        blk(v, 14, 22, 8, 15, 36, 9, 0x6a707a); gl.set(14, 37, 8, 0xff4040);
      } else if (k === "lamp") {
        blk(v, 0, 0, 0, 0, 16, 0, 0x4a505a); blk(v, -1, 0, -1, 1, 1, 1, 0x3a404a);
        blk(v, 0, 16, 0, 3, 16, 0, 0x4a505a); blk(gl, 2, 15, 0, 3, 15, 0, 0xfff0a0);
      } else if (k.startsWith("pipe")) {
        const n = +k.slice(4) || 4;
        cap(v, -n * 5, 4, 0, n * 5, 4, 0, 2.4, 2.4, (x, y, z) => grain(((x + 100) % 10 === 0) ? 0x5a606a : 0x9aa0aa, x, y, z, 0.03));
        for (let x = -n * 5 + 3; x < n * 5; x += 10) blk(v, x, 0, -1, x + 1, 2, 1, 0x4a505a);
      } else if (k === "crate") {
        blk(v, -3, 0, -3, 2, 5, 2, (x, y, z) => ((x === -3 || x === 2) && (y === 0 || y === 5)) || ((z === -3 || z === 2) && (y === 0 || y === 5)) || ((x === -3 || x === 2) && (z === -3 || z === 2)) ? 0x6a4a2a : grain(0xa8804a, x, y, z, 0.06));
      } else if (k === "observatory") {
        cap(v, 0, 0, 0, 0, 14, 0, 8, 7, (x, y, z) => grain(y % 4 === 0 ? 0xd8d0c0 : 0xf0e8d8, x, y, z, 0.03));
        ell(v, 0, 15, 0, 8, 7, 8, (x, y, z) => y < 15 ? null : grain(0x8a9ab0, x, y, z, 0.03));
        cap(v, 0, 19, 0, 6, 25, 0, 1.5, 1.2, 0x3a404a);
        blk(v, -2, 0, 7, 1, 7, 8, (x, y) => (y === 7 ? 0x6a4022 : 0x8a5a32));
      } else if (k === "yard") {
        /* the fence: posts and two rails, a gap on the west side */
        const wood = (x, y, z) => grain(0x8a5a32, x, y, z, 0.06), rail = (x, y, z) => grain(0xa8743e, x, y, z, 0.05);
        for (let i = -27; i <= 27; i += 6) for (const [x, z] of [[i, -27], [i, 27], [27, i], [-27, i]]) if (!(x === -27 && Math.abs(z) < 7)) blk(v, x, 0, z, x, 4, z, wood);
        for (const y of [2, 4]) { blk(v, -27, y, -27, 27, y, -27, rail); blk(v, -27, y, 27, 27, y, 27, rail); blk(v, 27, y, -27, 27, y, 27, rail); blk(v, -27, y, -27, -27, y, -7, rail); blk(v, -27, y, 7, -27, y, 27, rail); }
        /* hurdles */
        for (const x0 of [-10, 2]) { for (const x of [x0 - 4, x0 + 4]) blk(v, x, 0, -19, x, 3, -19, 0xf0f0e8); blk(v, x0 - 4, 3, -19, x0 + 4, 3, -19, x => ((x >> 1) & 1) ? 0xe42630 : 0xf8f8f8); }
        /* a boulder to smash */
        ell(v, 14, 3, -12, 5, 4, 5, (x, y, z) => grain(((y + (hash(x >> 1, 0, z >> 1) * 3 | 0)) % 4 === 0) ? 0x7a7468 : 0x9a9484, x, y, z, 0.07));
        /* the ball machine, pointing in */
        blk(v, 14, 0, 11, 19, 1, 17, 0x3a3a44); blk(v, 15, 2, 12, 18, 7, 16, (x, y, z) => grain(y === 7 ? 0xffd21a : 0x1f58e0, x, y, z, 0.04)); blk(v, 11, 4, 13, 14, 5, 14, 0x2a2a34);
        gl.set(16, 8, 14, 0xff4a3a);
        for (const [x, z, c] of [[8, 20, 0xf05a9a], [10, 22, 0xffd21a], [6, 23, 0x3ad8a0]]) blk(v, x, 0, z, x + 1, 1, z + 1, c);
        /* a tub of water, for swimming strokes */
        shape(v, -20, 0, -12, -8, 4, 0, (x, y, z) => Math.hypot(x + 14, z + 6) <= 5.8, (x, y, z) => { const d = Math.hypot(x + 14, z + 6); return d > 4.8 ? grain((y & 1) ? 0x8a5a32 : 0x7a4a2a, x, y, z, 0.05) : y === 3 ? grain(0x3aa0e0, x, y, z, 0.05) : y < 3 ? 0x2a80c0 : null; });
        /* four Chaos Drive pedestals */
        for (const [dx, dz, c] of [[0, -4, 0x3ad86a], [4, 0, 0xffd21a], [0, 4, 0xb06af0], [-4, 0, 0xf04a4a]]) { const x = -12 + dx, z = 14 + dz; blk(v, x - 1, 0, z - 1, x + 1, 3, z + 1, (xx, y, zz) => grain(0xc8c0b0, xx, y, zz, 0.05)); gl.set(x, 4, z, c); gl.set(x, 5, z, mixC(c, 0xffffff, 0.3)); }
        /* a basket of fruit */
        shape(v, 0, 0, 10, 6, 3, 16, (x, y, z) => Math.hypot(x - 3, z - 13) <= 3.2, (x, y, z) => y < 3 ? grain(((x + y + z) & 1) ? 0xc89a50 : 0xa87a3a, x, y, z, 0.05) : null);
        for (const [x, z, c] of [[2, 12, 0xffd21a], [4, 13, 0xf05a3a], [3, 14, 0x8ad84a], [2, 14, 0xffd21a]]) v.set(x, 3, z, c);
      } else if (k === "sign") {
        cap(v, 0, 0, 0, 0, 8, 0, 0.6, 0.6, 0x6a4022);
        blk(v, -5, 8, -1, 5, 13, -1, (x, y) => (Math.abs(x) === 5 || y === 8 || y === 13 ? 0x6a4022 : 0xd8b070));
        for (let x = -3; x <= 3; x++) if (x % 2 === 0) v.set(x, 11, -2, 0x3a2a1a);
        for (let x = -3; x <= 2; x++) v.set(x, 10, -2, 0x3a2a1a);
      }
    });
  }

  root.ChaoWorld = { ok: true, make, PLAN, heightAt, surfaceAt, buildingMesh, VS, REGIONS, CENTRAL };
})(typeof globalThis !== "undefined" ? globalThis : this);
