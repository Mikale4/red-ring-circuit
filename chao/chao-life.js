/*
 * Red Ring Circuit: the Chao Garden's living things -- what makes one creature itself. A
 * species (chao-data.js) is only a starting lean; every creature is born with its own genes
 * (an aptitude in each attribute, its colouring, its size, two temperaments, quirks, what it
 * likes, hidden alleles it may pass on), and becomes what it's raised to be: trained
 * attributes, the path and alignment a Chao changes into, the techniques it picks up, its
 * friends and rivals, and a little history of its own.
 *
 *   ChaoLife.make(spId, {rng, parents, region, from})   a newborn
 *   ChaoLife.egg(spId | null, opts)                      an egg (genes rolled now, hatched later)
 *   ChaoLife.hatch(egg)                                  the creature inside
 *   ChaoLife.stat(c, a), grade(c, a), train(c, a, n), evolveCheck(c), canBreed(a, b), breed(a, b, save)
 *
 * No three.js here: plain data, so it runs (and is tested) anywhere.
 */
(function (root) {
  "use strict";
  const D = root.ChaoData;
  const A = D.ATTRS.map(a => a.id);
  let SEQ = 0;
  const uid = p => p + Date.now().toString(36) + (SEQ++).toString(36) + Math.floor(Math.random() * 1296).toString(36);
  const pick = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

  /* ---------------------------------------------------------------- quirks
     Small things that make a creature itself. Each one a few effects the systems read:
     `train` (an attribute's gains), `day` (what it would rather do), `fight` (battle),
     `care` (how fast it gets hungry or tired), `find` (turning things up). */
  const TRAITS = {
    early:     { name: "Early Riser", text: "Up with the sun; tired by nightfall.", day: { morning: 1 } },
    night:     { name: "Night Owl", text: "Livelier after dark.", day: { night: 1 } },
    glutton:   { name: "Big Appetite", text: "Always hungry, and never says no.", care: { hunger: 1.4 }, train: { vit: 1.06 } },
    picky:     { name: "Picky Eater", text: "Only its favourite food really cheers it up.", care: { picky: 1 } },
    swimmer:   { name: "Water Baby", text: "Happiest in the water; swims like it was born to.", train: { res: 1.05 }, day: { water: 2 } },
    brave:     { name: "Brave", text: "Never backs down, even outmatched.", fight: { brave: 1 } },
    timid:     { name: "Timid", text: "Startles easily -- but fast when it bolts.", fight: { flee: 1 }, train: { agi: 1.06 } },
    lucky:     { name: "Lucky", text: "Things just go its way, now and then.", fight: { crit: 0.08 }, find: 1.3 },
    quick:     { name: "Quick Learner", text: "Picks up training faster than most.", train: { all: 1.12 } },
    late:      { name: "Late Bloomer", text: "Slow to start; goes further in the end.", train: { all: 0.9 }, cap: 1.12 },
    irongut:   { name: "Iron Stomach", text: "Eats anything, mushrooms included, and never minds.", care: { gut: 1 } },
    sunny:     { name: "Sun Lover", text: "Basks in the sun; gloomy on grey days.", day: { sun: 2 } },
    loner:     { name: "Loner", text: "Prefers its own company. A few close friends, at most.", day: { social: 0.4 }, social: 0.5 },
    social:    { name: "Social", text: "Friends with everyone it meets.", day: { social: 2 }, social: 1.6 },
    showoff:   { name: "Show-off", text: "Does its best with an audience.", fight: { crowd: 0.1 } },
    guardian:  { name: "Guardian", text: "Throws itself in front of its friends.", fight: { cover: 1 } },
    trickster: { name: "Trickster", text: "Feints, fakes and dirty tricks.", fight: { feint: 0.12 }, train: { ins: 1.06 } },
    gentle:    { name: "Gentle Giant", text: "Big, strong and kind; never the first to hit.", train: { pow: 1.08 }, fight: { slowStart: 1 } },
    hothead:   { name: "Hot-headed", text: "Quick to anger: hits harder when hurt.", fight: { rage: 0.25 } },
    focused:   { name: "Focused", text: "Shuts everything else out.", train: { ins: 1.08, cha: 1.05 } },
    sleepy:    { name: "Sleepyhead", text: "Naps anywhere, any time -- and wakes refreshed.", care: { energy: 1.3 }, day: { rest: 1.8 } },
    collector: { name: "Collector", text: "Picks up shiny things and leaves them in a pile.", find: 1.8 },
    musician:  { name: "Musician", text: "Hums, drums and sings; the others gather round.", day: { music: 2 } },
    greenthumb:{ name: "Green Thumb", text: "Trees near its favourite spot fruit sooner.", garden: { fruit: 1.4 } },
    racer:     { name: "Born Racer", text: "Lives for a race.", train: { vel: 1.1 } },
    sharp:     { name: "Sharp Eyes", text: "Sees everything coming.", fight: { dodge: 0.06 } },
    thick:     { name: "Thick Hide", text: "Shrugs off blows.", fight: { guard: 0.08 } },
    secondwind:{ name: "Second Wind", text: "Recovers when it's almost down.", fight: { second: 1 } },
    cuddly:    { name: "Cuddly", text: "Loves being held; affection grows quickly.", care: { warm: 1.4 } },
    wanderer:  { name: "Wanderer", text: "Always just over the next hill.", day: { explore: 2 }, find: 1.2 },
    // the rare ones: inherited down a line, or a mutation
    radiant:   { name: "Radiant", text: "It glows faintly. Others feel better near it.", rare: 1, fight: { aura: 1 }, social: 1.3 },
    prodigy:   { name: "Prodigy", text: "Born with a gift: every aptitude a step higher.", rare: 1, train: { all: 1.2 }, cap: 1.08 },
    ancient:   { name: "Old Soul", text: "Remembers things from lives before this one.", rare: 1, train: { ins: 1.15, cha: 1.1 } },
    chosen:    { name: "Emerald's Chosen", text: "The Chaos Emeralds' energy runs strong in it.", rare: 1, train: { cha: 1.25 } },
  };
  const TRAIT_KEYS = Object.keys(TRAITS).filter(k => !TRAITS[k].rare);
  const RARE_TRAITS = Object.keys(TRAITS).filter(k => TRAITS[k].rare);

  /* hidden genes: allele pairs a creature carries, shown only when both are there (recessive)
     -- the way a rare form runs in a family before it turns up */
  const ALLELES = ["crystal", "gold", "shade", "star", "giant", "tiny", "albino", "melan"];
  const MUT = 0.015;      // the chance any one allele mutates on its way to a child

  const NAMES = ["Pip", "Momo", "Taffy", "Bean", "Nibs", "Puddle", "Juniper", "Mochi", "Pebble", "Sprout", "Fig", "Dot", "Bramble", "Lulu", "Nimbus",
    "Peaches", "Tuck", "Wiggles", "Soba", "Biscuit", "Cobble", "Hazel", "Rumble", "Sunny", "Pickle", "Tango", "Mallow", "Dandy", "Kiki", "Moss",
    "Plum", "Bonbon", "Ziggy", "Clover", "Tidbit", "Waffle", "Ember", "Nori", "Poppy", "Rocket", "Sable", "Tinker", "Yuzu", "Gumdrop", "Kip",
    "Marble", "Oolong", "Pudding", "Quill", "Rascal", "Saffron", "Toffee", "Umber", "Velvet", "Whisk", "Zephyr", "Acorn", "Bloop", "Cricket",
    "Dumpling", "Echo", "Fable", "Gizmo", "Hopper", "Inky", "Jelly", "Kettle", "Lemon", "Mango", "Noodle", "Olive", "Pretzel", "Ripple",
    "Sprocket", "Truffle", "Wren", "Bolt", "Chip", "Domino", "Flint", "Goby", "Honey", "Ivy", "Jinx", "Lark", "Mint", "Opal", "Pesto"];

  /* a grade for an aptitude: E D C B A S, as the garden's keepers say it */
  const GRADES = ["E", "D", "C", "B", "A", "S"];
  const gradeOf = apt => GRADES[clamp(Math.floor(apt * 6), 0, 5)];

  /* ---------------------------------------------------------------- a newborn */
  const leanOf = sp => sp.kind === "animal" ? { [sp.lean]: 1.3 } : (sp.p1 ? D.PATHS[sp.p1].bias : {});
  function rollGenes(sp, r, parents) {
    const lean = leanOf(sp);
    const g = { apt: {}, tint: 0, tint2: 0, pat: "plain", size: 1, temper: [], traits: [], likes: {}, al: {}, techs: [] };
    for (const a of A) {
      let v = 0.18 + r() * 0.42 + (lean[a] ? (lean[a] - 1) * 0.9 : 0);     // most creatures are C or D at most things, and better at what their kind leans to
      if (r() < 0.07) v += 0.25;                                          // and now and then a gift
      g.apt[a] = clamp(v, 0, 0.95);
    }
    g.size = clamp(0.88 + r() * 0.24, 0.8, 1.2);
    g.tint = Math.floor((r() - 0.5) * 2 * 26);           // hue shift, in degrees
    g.tint2 = Math.floor((r() - 0.5) * 2 * 16);          // lightness shift, in percent
    g.pat = r() < 0.62 ? "plain" : pick(r, ["spots", "stripes", "two-tone", "socks", "freckles", "mask"]);
    const t1 = pick(r, D.TEMPER_KEYS); let t2 = pick(r, D.TEMPER_KEYS); if (t2 === t1) t2 = pick(r, D.TEMPER_KEYS);
    g.temper = [t1, t2];
    g.traits = [pick(r, TRAIT_KEYS)]; if (r() < 0.45) { const t = pick(r, TRAIT_KEYS); if (!g.traits.includes(t)) g.traits.push(t); }
    if (r() < 0.012) g.traits.push(pick(r, RARE_TRAITS));
    g.likes = { food: pick(r, D.FOODS.filter(f => f.from !== "badniks")).id, toy: pick(r, D.TOYS).id, place: pick(r, ["water", "trees", "flowers", "high", "sun", "shade", "people"]) };
    for (const al of ALLELES) g.al[al] = [r() < 0.04 ? 1 : 0, r() < 0.04 ? 1 : 0];
    return g;
  }
  function make(spId, opts) {
    opts = opts || {};
    const sp = D.species(spId) || D.species("chao-neutral-child");
    const r = opts.rng || Math.random;
    const g = opts.genes || rollGenes(sp, r, opts.parents);
    const c = {
      id: uid(sp.kind === "chao" ? "c" : "a"), kind: sp.kind, sp: sp.id, name: opts.name || pick(r, NAMES),
      gen: opts.gen || 1, parents: opts.parents || null, born: opts.day || 0, age: 0, region: opts.region || "central",
      genes: g, lv: {}, xp: {}, path: {}, align: { hero: 0, dark: 0, wild: 0, mech: 0 },
      care: { food: 80, energy: 90, mood: 70 }, bond: opts.bond || 10, rel: {}, techs: [], lives: 0,
      diet: {}, log: [], stage: sp.kind === "chao" ? (sp.stage || 0) : 0, grown: sp.kind === "animal" ? 0 : null,
    };
    for (const a of A) { c.lv[a] = 1; c.xp[a] = 0; }
    c.techs = startTechs(c, r);
    c.log.push([opts.day || 0, "Hatched in the " + (D.REGIONS[c.region] || D.REGIONS.central).name + (opts.from ? ": " + opts.from : "") + "."]);
    return c;
  }
  /* the techniques it starts with: one from what its kind leans to, one from its temperament,
     and any it inherited */
  const LEAN_TECH = { vel: ["spinattack", "dashstrike"], agi: ["pounce", "sidestep"], pow: ["tackle", "headbutt"], res: ["guard", "shell"], vit: ["soothe", "tackle"], ins: ["counter", "gearshot"], cha: ["chaosspear", "focus"] };
  const TEMPER_TECH = { playful: "pounce", shy: "sidestep", curious: "gearshot", energetic: "spinattack", calm: "guard", mischievous: "dazzle", affectionate: "cheer", competitive: "dashstrike", stubborn: "shell", adventurous: "diveattack" };
  function bestApt(c) { let b = A[0]; for (const a of A) if (c.genes.apt[a] > c.genes.apt[b]) b = a; return b; }
  function startTechs(c, r) {
    const out = ["tackle"];
    const l = LEAN_TECH[bestApt(c)]; out.push(pick(r, l));
    out.push(TEMPER_TECH[c.genes.temper[0]]);
    for (const t of c.genes.techs || []) out.push(t);
    return [...new Set(out)].slice(0, 4);
  }

  /* ---------------------------------------------------------------- attributes and growth */
  const bias = (c, a) => {
    const sp = D.species(c.sp); let b = 1;
    if (sp && sp.kind === "animal" && sp.lean === a) b = 1.25;
    if (sp && sp.p1 && D.PATHS[sp.p1].bias[a]) b *= D.PATHS[sp.p1].bias[a];
    if (sp && sp.p2 && D.PATHS[sp.p2].bias[a]) b *= 1 + (D.PATHS[sp.p2].bias[a] - 1) * 0.5;
    if (sp && sp.rarity >= 5) b *= 1.12;
    return b;
  };
  /* what it is now: its level in it, its aptitude, its form's leaning */
  const stat = (c, a) => Math.round((14 + c.lv[a] * 10) * (0.7 + 0.6 * c.genes.apt[a]) * bias(c, a));
  const grade = (c, a) => gradeOf(c.genes.apt[a]);
  const traitsOf = c => (c.genes.traits || []).map(t => TRAITS[t]).filter(Boolean);
  function trainMul(c, a) {
    let m = 0.55 + c.genes.apt[a];
    for (const t of c.genes.temper) { const T = D.TEMPERS[t]; if (T && T.train && T.train[a]) m *= t === c.genes.temper[0] ? T.train[a] : 1 + (T.train[a] - 1) * 0.5; }
    for (const T of traitsOf(c)) if (T.train) m *= (T.train[a] || 1) * (T.train.all || 1);
    m *= 0.6 + Math.min(1, c.care.mood / 70) * 0.4;                 // a happy creature learns; a miserable one barely
    return m;
  }
  const levelCap = c => Math.round(99 * Math.min(1.15, traitsOf(c).reduce((m, T) => m * (T.cap || 1), 1)));
  /* train an attribute by n points; returns the levels gained (and any technique it learned) */
  const PATH_OF = { vel: "run", agi: "fly", pow: "power", res: "swim", cha: "spark", vit: "normal", ins: "spark" };
  function train(c, a, n, rng) {
    const r = rng || Math.random;
    const got = { lv: 0, tech: null };
    c.xp[a] += n * trainMul(c, a);
    c.path[PATH_OF[a]] = (c.path[PATH_OF[a]] || 0) + n;
    while (c.xp[a] >= 100 && c.lv[a] < levelCap(c)) {
      c.xp[a] -= 100; c.lv[a]++; got.lv++;
      if (c.lv[a] % 6 === 0) { const t = learn(c, a, r); if (t) got.tech = t; }
    }
    if (c.lv[a] >= levelCap(c)) c.xp[a] = 0;
    return got;
  }
  /* a new technique, drawn from the attribute it trained: which one is chance -- two Chao of a
     kind trained alike still end up fighting differently */
  function learn(c, a, r) {
    const pool = D.TECHS.filter(t => t.attr === a && t.kind !== "team" && !t.dojo && !c.techs.includes(t.id));
    if (!pool.length) return null;
    const t = pick(r, pool);
    if (c.techs.length < 6) c.techs.push(t.id); else c.techs[Math.floor(r() * 6)] = t.id;
    return t.id;
  }

  /* ---------------------------------------------------------------- upbringing and change
     A Chao's alignment is who and what it grew up with: kindness (petting, praise, being
     comforted) makes it Hero; rough handling and fights make it Dark; days among the animals,
     Wild; days round the machines and badnik drives, Gear. Its path is what it trained. */
  function raise(c, al, n) { if (c.kind === "chao") c.align[al] = (c.align[al] || 0) + n; }
  const lvSum = c => A.reduce((s, a) => s + c.lv[a], 0);
  function leadAlign(c) {
    let best = "neutral", bv = 0, tot = 0;
    for (const k in c.align) { tot += c.align[k]; if (c.align[k] > bv) { bv = c.align[k]; best = k; } }
    return bv >= 40 && bv > tot * 0.45 ? best : "neutral";
  }
  /* the path it's taken most to (a balanced upbringing, all-round, is the Bloom) */
  function leadPath(c, not) {
    let best = null, bv = 0, tot = 0;
    for (const k in c.path) { if (k === not) continue; tot += k === "normal" ? c.path[k] * 0.5 : c.path[k]; if (k !== "normal" && c.path[k] > bv) { bv = c.path[k]; best = k; } }
    return best && bv > tot * 0.22 ? best : "normal";
  }
  /* a Chao is ready to change when it's old enough and grown enough; what it changes into is
     everything above, and now and then something nobody planned */
  function evolveCheck(c, ctx) {
    if (c.kind !== "chao") { if (c.grown < 1) c.grown = clamp(c.age / 1.5, 0, 1); return null; }
    const sp = D.species(c.sp);
    if (!sp || sp.stage >= 3) return null;
    if (sp.stage === 0 && c.age >= 1 && lvSum(c) >= 14) return formFor(c, 1, ctx);
    if (sp.stage === 1 && c.age >= 4 && lvSum(c) >= 50) return formFor(c, 2, ctx);
    return null;
  }
  function formFor(c, stage, ctx) {
    const rare = rareForm(c, ctx || {});
    if (rare) return rare;
    const al = leadAlign(c), sp = D.species(c.sp);
    if (stage === 1) return `chao-${al}-${leadPath(c)}`;
    const p1 = sp.p1, p2 = leadPath(c, p1);
    return `chao-${al}-${p1}-${p2 === p1 ? (p1 === "normal" ? "run" : "normal") : p2}`;
  }
  const both = (c, al) => c.genes.al[al] && c.genes.al[al][0] && c.genes.al[al][1];
  function rareForm(c, ctx) {
    const sp = D.species(c.sp);
    const ld = c.lineDepth || {};
    if (c.legend && D.species(c.legend)) return c.legend;
    if (c.silver) return "chao-silver";
    if (both(c, "gold")) return "chao-gold";
    if ((ld["al-hero"] || 0) >= 3 && (ld["al-dark"] || 0) >= 3) return "chao-eclipse";
    if (both(c, "crystal")) return sp.align === "dark" || c.align.dark > 60 ? "chao-shadowglass" : "chao-crystal";
    if (both(c, "star") && ctx.night) return "chao-star";
    const diet = c.diet || {}, eaten = Object.values(diet).reduce((s, n) => s + n, 0);
    if (eaten >= 12 && (diet.candy || 0) > eaten * 0.6) return "chao-candy";
    if (eaten >= 12 && (diet.mushroom || 0) > eaten * 0.5 && c.align.wild > 30) return "chao-moss";
    if (c.hatchedAt === "vent") return "chao-ember";
    if (c.lineDepth && c.lineDepth.swim >= 3) return "chao-tide";
    return null;
  }
  /* change it: a new form, the same creature (its genes, history, friends and techniques stay) */
  function evolve(c, to, day) {
    const sp = D.species(to); if (!sp) return;
    c.sp = to; c.stage = sp.stage;
    c.log.push([day || 0, "Changed into a " + sp.name + "."]);
    for (const a of A) c.xp[a] += 40;                 // and a burst of growth with it
  }

  /* ---------------------------------------------------------------- eggs and hatching */
  const EGG_LOOK = { "chao": [0xf4f0e4, 0x9ad8f8], "hero": [0xf8f8ff, 0xf8e070], "dark": [0x5a4a6a, 0xd83a5a], "wild": [0xd8f0b0, 0x6ad050], "mech": [0xc8d0d8, 0x40d0f0] };
  function egg(spId, opts) {
    opts = opts || {};
    const r = opts.rng || Math.random;
    const sp = D.species(spId) || D.species("chao-neutral-child");
    const genes = opts.genes || rollGenes(sp, r, opts.parents);
    const look = sp.kind === "chao" ? EGG_LOOK[sp.align === "neutral" ? "chao" : sp.align] : [sp.cols[0], sp.cols[1]];
    return { id: uid("e"), kind: "egg", sp: sp.id, genes, from: opts.from || "", parents: opts.parents || null, gen: opts.gen || 1, line: opts.line || null,
      warm: 0, need: opts.need || (sp.kind === "chao" ? 70 : 55), look: opts.legend ? [0xf8f0c0, 0x40e8a0] : look, spots: Math.floor(r() * 4), name: opts.name || null, lineDepth: opts.lineDepth || null, hatchedAt: opts.at || null, legend: opts.legend || null };
  }
  function hatch(e, day, region) {
    const c = make(e.sp, { genes: e.genes, parents: e.parents, gen: e.gen, day, region, from: e.from, name: e.name, bond: 25 });
    if (e.lineDepth) c.lineDepth = e.lineDepth;
    if (e.hatchedAt) c.hatchedAt = e.hatchedAt;
    if (e.silver) c.silver = true;
    if (e.legend) c.legend = e.legend;          // (a legendary egg: it becomes that form at its first change)
    c.line = e.line || c.id;                    // its family line: the founder's, or its own if it founds one
    return c;
  }

  /* ---------------------------------------------------------------- care
     Food fills it and moves an attribute a little (its favourite pleases it more); petting and
     play make it happier and closer; rest brings back energy. None of it is a chore: a creature
     that's left alone looks after itself well enough, it just won't grow as much. */
  function feed(c, foodId) {
    const f = D.food(foodId); if (!f) return null;
    const fav = c.genes.likes.food === f.id, picky = traitsOf(c).some(T => T.care && T.care.picky);
    c.care.food = clamp(c.care.food + f.feed, 0, 100);
    c.care.mood = clamp(c.care.mood + f.mood * (fav ? 2.2 : picky ? 0.4 : 1), 0, 100);
    c.diet[f.id] = (c.diet[f.id] || 0) + 1;
    const out = { fav, lv: 0 };
    for (const a in f.pull || {}) out.lv += train(c, a, f.pull[a] * 6).lv;
    for (const a in f.gain || {}) out.lv += train(c, a, f.gain[a] * 9).lv;
    if (f.id.startsWith("chaosdrive")) raise(c, "mech", 3);
    if (f.from === "bushes" || f.from === "forest") raise(c, "wild", 2);
    if (f.love) c.love = (c.love || 0) + f.love;
    if (fav) c.bond = clamp(c.bond + 2, 0, 100);
    return out;
  }
  function pet(c) {
    const warm = (D.TEMPERS[c.genes.temper[0]].warm || 1) * traitsOf(c).reduce((m, T) => m * ((T.care && T.care.warm) || 1), 1);
    c.care.mood = clamp(c.care.mood + 8, 0, 100);
    c.bond = clamp(c.bond + 1.6 * warm, 0, 100);
    raise(c, "hero", 4);
  }
  function rough(c) { c.care.mood = clamp(c.care.mood - 14, 0, 100); c.bond = clamp(c.bond - 1, 0, 100); raise(c, "dark", 6); }
  /* the slow tick: food and energy go down, mood drifts to how it's kept */
  function tick(c, dt, ctx) {
    const days = dt / (ctx.dayLen || 720);
    c.age += days;
    const hung = traitsOf(c).reduce((m, T) => m * ((T.care && T.care.hunger) || 1), 1);
    c.care.food = clamp(c.care.food - days * 60 * hung, 0, 100);
    if (ctx.asleep) c.care.energy = clamp(c.care.energy + days * 300, 0, 100);
    else c.care.energy = clamp(c.care.energy - days * (ctx.busy ? 90 : 40), 0, 100);
    const want = 45 + (c.care.food > 30 ? 15 : -20) + (c.care.energy > 25 ? 10 : -15) + c.bond * 0.2;
    c.care.mood += (want - c.care.mood) * Math.min(1, days * 3);
    if (ctx.wild) raise(c, "wild", days * 30);
    if (ctx.mech) raise(c, "mech", days * 30);
  }

  /* ---------------------------------------------------------------- friends and rivals
     Every pair that spends time together drifts somewhere: play and sharing make friends,
     squabbles over toys and food make rivals; temperaments and quirks push it each way. */
  function meet(a, b, how, n) {
    const soc = c => traitsOf(c).reduce((m, T) => m * (T.social || 1), 1);
    const k = (n || 1) * Math.sqrt(soc(a) * soc(b));
    const fit = (D.TEMPERS[a.genes.temper[0]].fight === D.TEMPERS[b.genes.temper[0]].fight) ? 1.3 : 1;
    const d = how === "play" || how === "share" ? 2 * k * fit : how === "squabble" ? -3 * k * (a.genes.temper.includes("competitive") || b.genes.temper.includes("competitive") ? 1.4 : 1) : 0.4 * k;
    a.rel[b.id] = clamp((a.rel[b.id] || 0) + d, -100, 100);
    b.rel[a.id] = clamp((b.rel[a.id] || 0) + d, -100, 100);
    return a.rel[b.id];
  }
  const friendOf = (c, id) => (c.rel[id] || 0) >= 30;
  const rivalOf = (c, id) => (c.rel[id] || 0) <= -25;

  /* ---------------------------------------------------------------- breeding
     Two Chao, or two animals of the same species, grown, and fond of each other. The child
     takes each aptitude from one parent or between them, a little either way; its colouring
     from either, blended; a temperament from each (or its own); some of each one's quirks;
     techniques from the eight they know between them; one allele of each hidden gene from each
     -- and now and then a mutation. Rare forms wait in the lines that carry them. */
  const adult = c => c.kind === "chao" ? c.stage >= 1 : c.grown >= 1;
  function canBreed(a, b) {
    if (!a || !b || a.id === b.id) return "Pick two different creatures.";
    if (a.kind !== b.kind) return "A Chao and an animal can't have an egg together.";
    if (a.kind === "animal" && a.sp !== b.sp) return "Animals only have eggs with their own kind.";
    if (!adult(a) || !adult(b)) return (adult(a) ? b.name : a.name) + " is still too young.";
    if ((a.rel[b.id] || 0) < 20) return `${a.name} and ${b.name} aren't close enough yet.`;
    if ((a.bredAt || -9) > (a.age - 1) || (b.bredAt || -9) > (b.age - 1)) return "One of them had an egg too recently (a day apart).";
    return null;
  }
  function inherit(ga, gb, r) {
    const g = { apt: {}, al: {}, likes: {}, techs: [] };
    for (const a of A) {
      const x = ga.apt[a], y = gb.apt[a], t = r();
      let v = t < 0.38 ? x : t < 0.76 ? y : (x + y) / 2;
      v += (r() - 0.45) * 0.12;                                 // a little either way, a little more often up
      if (r() < 0.04) v += 0.2;                                 // a gift
      g.apt[a] = clamp(v, 0, 0.98);
    }
    g.size = clamp((r() < 0.5 ? ga.size : gb.size) + (r() - 0.5) * 0.06, 0.78, 1.25);
    g.tint = Math.round((r() < 0.5 ? ga.tint : gb.tint) * 0.6 + (ga.tint + gb.tint) * 0.2 + (r() - 0.5) * 8);
    g.tint2 = Math.round(((ga.tint2 + gb.tint2) / 2) + (r() - 0.5) * 6);
    g.pat = r() < 0.08 ? pick(r, ["spots", "stripes", "two-tone", "socks", "freckles", "mask"]) : r() < 0.5 ? ga.pat : gb.pat;
    g.temper = [r() < 0.15 ? pick(r, D.TEMPER_KEYS) : ga.temper[Math.floor(r() * 2)], r() < 0.15 ? pick(r, D.TEMPER_KEYS) : gb.temper[Math.floor(r() * 2)]];
    if (g.temper[1] === g.temper[0]) g.temper[1] = pick(r, D.TEMPER_KEYS);
    const tr = new Set();
    for (const t of [...ga.traits, ...gb.traits]) if (r() < (TRAITS[t] && TRAITS[t].rare ? 0.5 : 0.35)) tr.add(t);
    if (!tr.size || r() < 0.3) tr.add(pick(r, TRAIT_KEYS));
    if (r() < 0.01) tr.add(pick(r, RARE_TRAITS));
    g.traits = [...tr].slice(0, 3);
    for (const al of ALLELES) {
      const pa = ga.al[al] || [0, 0], pb = gb.al[al] || [0, 0];
      let x = pa[Math.floor(r() * 2)], y = pb[Math.floor(r() * 2)];
      if (r() < MUT) x = 1 - x; if (r() < MUT) y = 1 - y;
      g.al[al] = [x, y];
    }
    g.likes = { food: (r() < 0.5 ? ga : gb).likes.food, toy: (r() < 0.5 ? ga : gb).likes.toy, place: (r() < 0.5 ? ga : gb).likes.place };
    return g;
  }
  function breed(a, b, save, rng) {
    const r = rng || Math.random;
    const g = inherit(a.genes, b.genes, r);
    const known = [...new Set([...a.techs, ...b.techs])].filter(t => t !== "tackle");
    for (let i = 0; i < 2 && known.length; i++) g.techs.push(known.splice(Math.floor(r() * known.length), 1)[0]);
    let sp;
    if (a.kind === "animal") sp = a.sp;
    else {
      const la = D.species(a.sp).align, lb = D.species(b.sp).align;
      sp = `chao-${la === lb ? la : r() < 0.5 ? la : lb}-child`;
      if (la !== lb && r() < 0.5) sp = "chao-neutral-child";
    }
    /* a line: how many generations in a row took the same path (for the forms that need a long line) */
    const ld = {};
    for (const p of D.PATH_KEYS) {
      const da = (a.lineDepth && a.lineDepth[p]) || 0, db = (b.lineDepth && b.lineDepth[p]) || 0;
      const sa = D.species(a.sp).p1 === p, sb = D.species(b.sp).p1 === p;
      if (sa || sb) ld[p] = Math.max(sa ? da + 1 : 0, sb ? db + 1 : 0);
    }
    /* and of an alignment: a Halo line, a Shade line (two long ones brought together make something) */
    for (const al of D.ALIGN_KEYS) {
      const k = "al-" + al, da = (a.lineDepth && a.lineDepth[k]) || 0, db = (b.lineDepth && b.lineDepth[k]) || 0;
      const sa = D.species(a.sp).align === al && a.kind === "chao", sb = D.species(b.sp).align === al && b.kind === "chao";
      const v = Math.max(sa ? da + 1 : da, sb ? db + 1 : db);
      if (v) ld[k] = v;
    }
    /* the pity rule (after the FF7 ranch): a pair that keeps missing a rare form gets closer to it */
    save.breedMiss = save.breedMiss || 0;
    const rareChance = 0.02 * (1 + save.breedMiss);
    if (r() < rareChance) {
      const rec = ALLELES[Math.floor(r() * ALLELES.length)];
      g.al[rec] = [1, 1]; save.breedMiss = 0;
    } else save.breedMiss++;
    a.bredAt = a.age; b.bredAt = b.age;
    a.love = 0; b.love = 0;
    const elder = (a.gen || 1) >= (b.gen || 1) ? a : b;
    const e = egg(sp, { genes: g, parents: [a.id, b.id], gen: Math.max(a.gen, b.gen) + 1, from: `the egg of ${a.name} and ${b.name}`, rng: r, lineDepth: ld, line: elder.line || elder.id });
    return e;
  }
  /* what a pairing might bring (the Society's pens show it, as the FF7 ranch's rancher does):
     the child's kind, each aptitude's range between its parents', the quirks that might come
     down, and a hint when the two carry something hidden between them */
  function preview(a, b, save) {
    const why = canBreed(a, b);
    const out = { why, apt: {}, traits: [], hint: null, sp: null };
    if (a.kind === "animal") out.sp = a.sp;
    else { const la = D.species(a.sp).align, lb = D.species(b.sp).align; out.sp = la === lb ? `chao-${la}-child` : `chao-${la}-child|chao-${lb}-child|chao-neutral-child`; }
    for (const x of A) { const p = a.genes.apt[x], q = b.genes.apt[x]; out.apt[x] = [gradeOf(Math.max(0, Math.min(p, q) - 0.06)), gradeOf(Math.min(0.98, Math.max(p, q) + 0.06))]; }
    out.traits = [...new Set([...a.genes.traits, ...b.genes.traits])].map(t => TRAITS[t]).filter(Boolean).map(t => t.name);
    const carried = ALLELES.filter(al => (a.genes.al[al] || [0, 0]).some(Boolean) && (b.genes.al[al] || [0, 0]).some(Boolean));
    const lines = ["al-hero", "al-dark"].filter(k => ((a.lineDepth || {})[k] || 0) >= 2 || ((b.lineDepth || {})[k] || 0) >= 2);
    if (carried.length) out.hint = "Something runs in both these families. A child of theirs might be... unusual.";
    else if (lines.length === 2) out.hint = "Two old lines, light and dark. Something waits where they meet.";
    else if ((save && save.breedMiss || 0) > 12) out.hint = "The Society's luck is turning: something rare is due.";
    return out;
  }

  /* ---------------------------------------------------------------- the save
     Every creature that ever lived keeps a line in the family book (for the genealogy), even
     after it's gone; the living keep everything. */
  function record(c) { return { id: c.id, name: c.name, sp: c.sp, gen: c.gen, parents: c.parents, kind: c.kind, line: c.line || c.id }; }
  function fresh() {
    return { v: 1, day: 0.3, chao: [], animals: [], eggs: [], book: {}, seen: {}, owned: {}, inv: { round: 4, triangle: 1, square: 1 }, rings: 300,
      avatar: null, freed: 0, freedEggs: 0, breedMiss: 0, ach: {}, log: [], habitat: {}, quest: {} };
  }
  function sane(s) {
    const f = fresh();
    if (!s || typeof s !== "object" || s.v !== 1) return f;
    for (const k in f) if (s[k] == null) s[k] = f[k];
    for (const c of [...s.chao, ...s.animals]) if (!c.genes || !c.lv) return f;
    return s;
  }

  root.ChaoLife = { TRAITS, TRAIT_KEYS, RARE_TRAITS, ALLELES, NAMES, GRADES, gradeOf, make, egg, hatch, stat, grade, train, trainMul, levelCap, learn, raise, lvSum,
    leadAlign, leadPath, evolveCheck, evolve, feed, pet, rough, tick, meet, friendOf, rivalOf, adult, canBreed, breed, preview, inherit, record, fresh, sane, traitsOf, bestApt, uid };
})(typeof globalThis !== "undefined" ? globalThis : this);
