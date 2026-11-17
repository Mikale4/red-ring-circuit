/*
 * Red Ring Circuit: the voxel kit -- a sparse voxel grid, and a face-culled mesher with baked
 * ambient occlusion that turns one into Lambert-lit vertex-coloured geometry, plus the colour
 * helpers. The same kit Post Parade's race and lobby are built with (its voxel.js), which the
 * game grew up inside; here on its own, as `Voxel.kit`, so adventure.js reads it as it always
 * did.
 */
(function (root) {
  "use strict";
  const THREE = root.THREE;
  if (!THREE) { root.Voxel = { ok: false }; return; }

  const cl = v => v < 0 ? 0 : v > 255 ? 255 : v | 0;
  const mulC = (c, f) => (cl(((c >> 16) & 255) * f) << 16) | (cl(((c >> 8) & 255) * f) << 8) | cl((c & 255) * f);
  const mixC = (a, b, t) =>
    (cl(((a >> 16) & 255) + (((b >> 16) & 255) - ((a >> 16) & 255)) * t) << 16) |
    (cl(((a >> 8) & 255) + (((b >> 8) & 255) - ((a >> 8) & 255)) * t) << 8) |
    cl((a & 255) + ((b & 255) - (a & 255)) * t);
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  class Vox {
    constructor() { this.m = new Map(); }
    static k(x, y, z) { return ((x + 512) * 1024 + (y + 512)) * 1024 + (z + 512); }
    set(x, y, z, c) { const k = Vox.k(x, y, z); if (c == null) this.m.delete(k); else this.m.set(k, c); }
    has(x, y, z) { return this.m.has(Vox.k(x, y, z)); }
    get(x, y, z) { return this.m.get(Vox.k(x, y, z)); }
    box(x0, y0, z0, x1, y1, z1, c) {
      const f = typeof c === "function";
      for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++)
        this.set(x, y, z, f ? c(x, y, z) : c);
    }
    each(fn) {
      for (const [k, c] of this.m) {
        const z = k % 1024 - 512, y = Math.floor(k / 1024) % 1024 - 512, x = Math.floor(k / 1048576) - 512;
        fn(x, y, z, c);
      }
    }
  }
  const AOF = [0.52, 0.7, 0.85, 1];
  const CWC = [[0, 0], [1, 0], [1, 1], [0, 1]], CCWC = [[0, 0], [0, 1], [1, 1], [1, 0]];
  /* `keep(x, y, z, nx, ny, nz)`, if given, may drop exposed faces nobody will ever see. */
  function meshVox(v, scale, keep) {
    const pos = [], nor = [], col = [], idx = [];
    let vi = 0;
    const P = [0, 0, 0], L = [0, 0, 0], ao = [0, 0, 0, 0];
    v.each((x, y, z, c) => {
      const r = ((c >> 16) & 255) / 255, g = ((c >> 8) & 255) / 255, b = (c & 255) / 255;
      for (let d = 0; d < 3; d++) for (let s = -1; s <= 1; s += 2) {
        const nx = d === 0 ? s : 0, ny = d === 1 ? s : 0, nz = d === 2 ? s : 0;
        if (v.has(x + nx, y + ny, z + nz)) continue;
        if (keep && !keep(x, y, z, nx, ny, nz)) continue;
        const u = (d + 1) % 3, w = (d + 2) % 3, C = s > 0 ? CWC : CCWC;
        L[0] = x + nx; L[1] = y + ny; L[2] = z + nz;
        for (let i = 0; i < 4; i++) {
          const cu = C[i][0], cw = C[i][1];
          P[0] = x; P[1] = y; P[2] = z; if (s > 0) P[d] += 1; P[u] += cu; P[w] += cw;
          pos.push(P[0], P[1], P[2]); nor.push(nx, ny, nz);
          const su = cu ? 1 : -1, sw = cw ? 1 : -1;
          L[u] += su; const s1 = v.has(L[0], L[1], L[2]) ? 1 : 0;
          L[w] += sw; const s3 = v.has(L[0], L[1], L[2]) ? 1 : 0;
          L[u] -= su; const s2 = v.has(L[0], L[1], L[2]) ? 1 : 0;
          L[w] -= sw;
          const a = (s1 && s2) ? 0 : 3 - (s1 + s2 + s3); ao[i] = a; const f = AOF[a];
          col.push(r * f, g * f, b * f);
        }
        if (ao[0] + ao[2] >= ao[1] + ao[3]) idx.push(vi, vi + 1, vi + 2, vi, vi + 2, vi + 3);
        else idx.push(vi + 1, vi + 2, vi + 3, vi + 1, vi + 3, vi);
        vi += 4;
      }
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    geo.setIndex(idx);
    if (scale && scale !== 1) geo.scale(scale, scale, scale);
    geo.computeBoundingSphere();
    return geo;
  }

  root.Voxel = { ok: true, kit: { Vox, meshVox, mulC, mixC, mulberry32 } };
})(typeof globalThis !== "undefined" ? globalThis : this);
