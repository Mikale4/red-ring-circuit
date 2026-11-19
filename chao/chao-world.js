/*
 * Red Ring Circuit: the Chao Garden's world -- the land itself. One continuous voxel landscape
 * (half-metre voxels), the Central Garden in the middle and the other gardens round it, each
 * behind its own passage. The ground is a height field drawn from the garden's plan (the pond,
 * the waterfall cliff, the plaza, the orchard, the paths), built into meshes chunk by chunk as
 * the keeper walks, with the garden's things set on it: trees that fruit, flowers, rocks, the
 * Garden Hall, the incubator, the fountain, the gates.
 *
 *   ChaoWorld.make(scene) -> { ground(x, z), water(x, z), blocked(x, z, r), update(x, z), spots, trees, ... }
 */
(function (root) {
  "use strict";
  const THREE = root.THREE, M = root.ChaoModels;
  if (!THREE || !M || !M.ok) { root.ChaoWorld = { ok: false }; return; }
  const { Vox, meshVox, mixC, mulC, hash, grain, part, ell, cap, blk, shape, chain } = M;
  const PI = Math.PI, VS = 0.5, CH = 16;            // voxel size (m), chunk size (columns)

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
    plaza: [0, 24, 9.5], orchard: [22, -2, 11], meadow: [-24, 20, 10],
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
    /* the rim: hills all round, broken only where the gates are */
    const gc = gateCorridor(x, z);
    if (r > 43 && z > PLAN.cliffZ + 2) h += (r - 43) * 0.9 * sm(3.5, 7, gc);
    if (r > 47 && z <= PLAN.cliffZ + 2) h += (r - 47) * 0.9 * sm(3.5, 7, gc);
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
    if (Math.hypot(x - PLAN.meadow[0], z - PLAN.meadow[1]) < PLAN.meadow[2]) return "meadow";
    if (h > PLAN.plateau - 0.6 && z < PLAN.cliffZ) return "high";
    return "grass";
  }
  const COL = {
    grass: (x, z, y) => { const n = fbm(x * 0.2, z * 0.2, 4); return grain(mixC(0x4a9a3a, 0x7ac455, n), x * 2, y, z * 2, 0.06); },
    high: (x, z, y) => grain(mixC(0x5a9a48, 0x8ab866, fbm(x * 0.2, z * 0.2, 6)), x * 2, y, z * 2, 0.06),
    meadow: (x, z, y) => { const h = hash(x * 2 | 0, z * 2 | 0, 77); return h < 0.08 ? [0xf8f070, 0xf87aa0, 0xf8f8f8, 0xb08af0][(h * 50 | 0) % 4] : grain(mixC(0x5aaa44, 0x86cc5a, fbm(x * 0.25, z * 0.25, 4)), x * 2, y, z * 2, 0.06); },
    path: (x, z, y) => grain(mixC(0xc8a878, 0xa88a5a, hash(x * 2 | 0, z * 2 | 0, 5) * 0.6), x * 2, y, z * 2, 0.05),
    stone: (x, z, y) => { const tx = Math.floor(x * 2), tz = Math.floor(z * 2), row = tz >> 1, h = hash((tx + (row & 1)) >> 1, row, 3); const c = h < 0.3 ? 0xcfc2a6 : h < 0.6 ? 0xc2b597 : h < 0.85 ? 0xd8ccb2 : 0xb3a68a; return grain(hash(tx, tz, 11) < 0.012 ? mixC(c, 0x6a9a4a, 0.45) : c, tx, y, tz, 0.035); },
    sand: (x, z, y) => grain(mixC(0xe8d8a8, 0xd8c890, hash(x * 2 | 0, z * 2 | 0, 8)), x * 2, y, z * 2, 0.04),
    bed: (x, z, y) => grain(mixC(0x7a8a5a, 0x9a9a6a, hash(x * 2 | 0, z * 2 | 0, 9)), x * 2, y, z * 2, 0.06),
  };
  const dirt = (x, y, z) => grain(((y & 3) === 0) ? 0x7a5a3a : 0x8a6a44, x, y, z, 0.06);
  const rock = (x, y, z) => grain(((y + (hash(x >> 1, 0, z >> 1) * 3 | 0)) % 4 === 0) ? 0x7a7468 : mixC(0x9a9484, 0x8a8478, hash(x >> 1, y >> 1, z >> 1)), x, y, z, 0.06);

  /* ---------------------------------------------------------------- the world */
  function make(scene, opts) {
    opts = opts || {};
    const W = { scene, chunks: new Map(), group: new THREE.Group(), props: new THREE.Group(), water: [], trees: [], obst: [], gates: [], spots: {}, t: 0, PLAN };
    scene.add(W.group); scene.add(W.props);
    /* the height field, quantised to the half-metre voxels; kept per column */
    const HC = new Map();
    const colH = (i, k) => { const key = i * 4096 + k; let h = HC.get(key); if (h == null) { h = Math.round(heightAt(i * VS + VS / 2, k * VS + VS / 2) / VS); HC.set(key, h); } return h; };
    W.colH = colH;
    /* the ground's height under a point (m), stepping smoothly between voxels for walkers */
    W.ground = (x, z) => colH(Math.floor(x / VS), Math.floor(z / VS)) * VS;
    W.smooth = (x, z) => {
      const fx = x / VS - 0.5, fz = z / VS - 0.5, i = Math.floor(fx), k = Math.floor(fz), u = fx - i, w = fz - k;
      const a = colH(i, k), b = colH(i + 1, k), c = colH(i, k + 1), d = colH(i + 1, k + 1);
      const mx = Math.max(a, b, c, d), mn = Math.min(a, b, c, d);
      if (mx - mn > 1) return W.ground(x, z);                                // a cliff edge: no ramp down it
      return (a * (1 - u) * (1 - w) + b * u * (1 - w) + c * (1 - u) * w + d * u * w) * VS;
    };
    const F = PLAN.fall;
    W.waterAt = (x, z) => {
      const g = W.ground(x, z);
      if (inPond(x, z) < 1.05 && g < PLAN.pond.level) return PLAN.pond.level;
      if (z < PLAN.cliffZ - 0.5 && z > PLAN.cliffZ - 14 && Math.abs(x - F.x) < F.w / 2 && g < F.top) return F.top;
      return null;
    };
    W.depth = (x, z) => { const w = W.waterAt(x, z); return w == null ? 0 : w - W.ground(x, z); };
    W.surface = (x, z) => surfaceAt(x, z, W.ground(x, z));
    /* can something of radius r stand here, coming from height y? (a step of half a metre is
       fine; more is a wall; the gates and the things in the world are solid) */
    W.blocked = (x, z, r, y) => {
      const g = W.ground(x, z);
      if (y != null && g - y > 0.55) return true;
      if (Math.hypot(x, z) > 62) return true;
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
        const x = (i + 0.5) * VS, z = (k + 0.5) * VS, surf = surfaceAt(x, z, h * VS), top = COL[surf] || COL.grass;
        const cliff = h - mn > 3;
        /* the column's voxels lie under its height: the top one's upper face is the ground the
           walkers stand on (h voxels up) */
        for (let y = mn; y < h; y++) {
          let c;
          const d = h - 1 - y;
          if (d === 0) c = cliff && surf !== "stone" && surf !== "path" ? mixC(top(x, z, y), 0x5a8a3a, 0.2) : top(x, z, y);
          else if (d === 1 && (surf === "grass" || surf === "meadow" || surf === "high") && !cliff) c = grain(0x5a8a34, i, y, k, 0.08);
          else c = cliff || d > 2 ? rock(i, y, k) : surf === "sand" || surf === "bed" ? grain(0xc8b888, i, y, k, 0.05) : dirt(i, y, k);
          v.set(di, y, dk, c);
        }
        lo = Math.min(lo, mn);
      }
      const inside = (x, z) => x >= 0 && x < CH && z >= 0 && z < CH;
      const geo = meshVox(v, VS, (x, y, z, nx, ny, nz) => inside(x, z) && ny >= 0);
      const m = new THREE.Mesh(geo, M.mat("vox"));
      m.position.set(i0 * VS, 0, k0 * VS);
      m.matrixAutoUpdate = false; m.updateMatrix();
      return m;
    }
    /* build the chunks round the keeper, and drop the ones far behind */
    W.update = (x, z, rad) => {
      rad = rad || 46;
      const ci0 = Math.floor((x - rad) / (CH * VS)), ci1 = Math.floor((x + rad) / (CH * VS)), ck0 = Math.floor((z - rad) / (CH * VS)), ck1 = Math.floor((z + rad) / (CH * VS));
      let built = 0;
      const want = [];
      for (let ci = ci0; ci <= ci1; ci++) for (let ck = ck0; ck <= ck1; ck++) {
        const cx = (ci + 0.5) * CH * VS, cz = (ck + 0.5) * CH * VS, d = Math.hypot(cx - x, cz - z);
        if (d > rad + 6 || Math.hypot(cx, cz) > 70) continue;
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
    {
      const P = PLAN.pond, g = new THREE.PlaneGeometry(P.rx * 2.6, P.rz * 2.6, 40, 40);
      g.rotateX(-PI / 2);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) { const x = pos.getX(i) + P.x, z = pos.getZ(i) + P.z; if (inPond(x, z) > 1.2) pos.setY(i, -3); }
      const m = new THREE.Mesh(g, waterMat); m.position.set(P.x, P.level - 0.06, P.z); m.renderOrder = 2;
      W.group.add(m); W.water.push(m);
    }
    /* the waterfall: a falling sheet, foam at its foot */
    {
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
    for (const T of PLAN.trees) {
      const s = T.s || 1, y = W.ground(T.x, T.z);
      const tr = M.prop("tree", { k: T.k, s, seed: Math.floor(hash(T.x | 0, T.z | 0, 1) * 100), c: T.c });
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
      const x = (R(n) - 0.5) * 92, z = (hash(n, 17, 5) - 0.5) * 92, h = W.ground(x, z), s = surfaceAt(x, z, h);
      if (Math.hypot(x, z) > 44 || W.blocked(x, z, 0.6)) continue;
      if (s === "meadow" || (s === "grass" && hash(n, 3, 3) < 0.3)) { const c = [0xf05a7a, 0xf8e040, 0xf8f8f8, 0xb070f0, 0xf08a3a, 0x6ab0f8][n % 6]; put(M.prop("flower", { c, k: n % 3 }), x, z, R(n * 3) * 6); }
      else if (s === "grass" && hash(n, 4, 4) < 0.1) { put(M.prop("rock", { s: 0.6 + R(n * 7) * 0.7, k: n % 3 }), x, z, R(n * 5) * 6); block(x, z, 0.4); }
    }
    /* grass: tufts of blades all over the lawns (one mesh, drawn many times) */
    {
      const tuft = M.part("tuft", 1 / 16, v => {
        for (const [x, z, h, c] of [[0, 0, 5, 0x5aa83a], [2, 1, 4, 0x6ab84a], [-1, 2, 3, 0x4a9a34], [1, -2, 4, 0x6ac050], [-2, -1, 3, 0x5aa840]])
          for (let y = 0; y < h; y++) v.set(x + (y > 2 ? Math.sign(x || 1) : 0), y, z, M.mixC(c, 0xb8e070, y / (h + 2)));
      });
      const geo = tuft.children[0].geometry, at = [];
      for (let n = 0; n < 5200 && at.length < 2600; n++) {
        const x = (hash(n, 5, 41) - 0.5) * 90, z = (hash(n, 6, 43) - 0.5) * 90;
        if (Math.hypot(x, z) > 45) continue;
        const h = W.ground(x, z), sf = surfaceAt(x, z, h);
        if (sf !== "grass" && sf !== "meadow" && sf !== "high") continue;
        if (W.blocked(x, z, 0.2)) continue;
        at.push([x, h, z, hash(n, 7, 7) * PI * 2, 0.55 + hash(n, 8, 8) * 0.5]);
      }
      const im = new THREE.InstancedMesh(geo, M.mat("vox"), at.length), o = new THREE.Object3D();
      at.forEach(([x, y, z, a, k], i) => { o.position.set(x, y, z); o.rotation.y = a; o.scale.setScalar(k); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
      im.receiveShadow = true; W.group.add(im); W.grass = im;
    }
    /* boulders on the rim and round the pond */
    for (let n = 0; n < 40; n++) {
      const a = n / 40 * PI * 2, r = 44 + hash(n, 2, 2) * 3, x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (gateCorridor(x, z) < 6 || z < PLAN.cliffZ) continue;
      put(M.prop("rock", { s: 1.6 + hash(n, 1, 1) * 1.2, c: 0x8a8478, k: n }), x, z, a);
    }

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
    /* the gates */
    for (const G of PLAN.gates) {
      const gm = buildingMesh(G.lift ? "balloon" : "gate");
      put(gm, G.at[0], G.at[1], G.face);
      const ob = block(G.at[0], G.at[1], 0, { box: true, w: G.lift ? 1.6 : 3.6, d: G.lift ? 1.6 : 0.7, a: G.face });
      W.gates.push(Object.assign({ m: gm, ob, open: false }, G));
      const sign = buildingMesh("sign"), ix = Math.sin(G.face), iz = Math.cos(G.face), tx = Math.cos(G.face), tz = -Math.sin(G.face);
      const sx = G.at[0] + ix * 1.8 + tx * 4.8, sz = G.at[1] + iz * 1.8 + tz * 4.8;
      put(sign, sx, sz, G.face + PI); block(sx, sz, 0.25);
      W.spots["gate-" + G.id] = { x: G.at[0] + Math.sin(G.face) * 2.2, z: G.at[1] + Math.cos(G.face) * 2.2, r: 2.4, gate: G };
    }
    /* fences round the orchard, a bridge of stepping stones to the island */
    { const [[ax, az], [bx, bz]] = PLAN.stones, n = Math.ceil(Math.hypot(bx - ax, bz - az) / 1.25);
      for (let i = 0; i <= n; i++) { const t = i / n, x = ax + (bx - ax) * t + Math.sin(i * 1.7) * 0.25, z = az + (bz - az) * t + Math.cos(i * 1.3) * 0.25; if (W.depth(x, z) > 0.15) { const st = M.prop("rock", { s: 0.5, c: 0xb8b0a0, k: i }); put(st, x, z, i, PLAN.pond.level - 0.42); W.obst.push({ x, z, r: 0.5, w: 0, d: 0, step: PLAN.pond.level + 0.1 }); } } }
    W.steps = W.obst.filter(o => o.step);
    W.standAt = (x, z) => { for (const s of W.steps) if (Math.hypot(x - s.x, z - s.z) < 0.6) return s.step; return null; };
    W.obst = W.obst.filter(o => !o.step);

    /* where creatures like to be, for their days */
    W.places = {
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
      } else if (k === "sign") {
        cap(v, 0, 0, 0, 0, 8, 0, 0.6, 0.6, 0x6a4022);
        blk(v, -5, 8, -1, 5, 13, -1, (x, y) => (Math.abs(x) === 5 || y === 8 || y === 13 ? 0x6a4022 : 0xd8b070));
        for (let x = -3; x <= 3; x++) if (x % 2 === 0) v.set(x, 11, -2, 0x3a2a1a);
        for (let x = -3; x <= 2; x++) v.set(x, 10, -2, 0x3a2a1a);
      }
    });
  }

  root.ChaoWorld = { ok: true, make, PLAN, heightAt, surfaceAt, buildingMesh, VS };
})(typeof globalThis !== "undefined" ? globalThis : this);
