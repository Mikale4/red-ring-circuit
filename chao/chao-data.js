/*
 * Red Ring Circuit: the Chao Garden's data -- every Chao form and every animal species, the
 * attributes they grow in, their temperaments, techniques, foods and toys. All of it as data:
 * the garden's systems read these tables and never know any one creature by name, so more can
 * be added here and everything (models, care, breeding, battle) takes them as they come.
 *
 *   ChaoData.ATTRS, TEMPERS, ALIGNS, PATHS, CHAO (the forms), ANIMALS (the species), TECHS,
 *   FOODS, TOYS, REGIONS; ChaoData.chao(id), animal(id), species(id)
 *
 * The attributes are the garden's own -- not any other game's six stats, no base-stat total:
 *   Velocity   speed on the ground, acceleration, momentum
 *   Agility    dodging, jumping, aerial control, getting up again
 *   Power      the weight of a blow, knockback, breaking guards
 *   Resilience taking a blow, holding a defence
 *   Vitality   health and staying power over a long fight
 *   Instinct   reactions, accuracy, reading the other side, counters
 *   Chaos      Chaos Energy: special techniques, how much and how fast it comes back
 * A species only leans (bias); each creature is born with its own aptitude in each (genes), and
 * what it becomes is what it is raised to be.
 */
(function (root) {
  "use strict";

  const ATTRS = [
    { id: "vel", name: "Velocity", short: "VEL", c: 0x3aa0f0, text: "Speed on the ground: how fast it runs, and how quickly it gets there." },
    { id: "agi", name: "Agility", short: "AGI", c: 0x3ad8a0, text: "Dodging, jumping and turning in the air; back on its feet sooner after a hit." },
    { id: "pow", name: "Power", short: "POW", c: 0xf05a3a, text: "The weight of its blows: knockback, and breaking through a guard." },
    { id: "res", name: "Resilience", short: "RES", c: 0xc89a3a, text: "Taking a blow: how little it hurts, and how well it holds a defence." },
    { id: "vit", name: "Vitality", short: "VIT", c: 0xf06a9a, text: "Health and staying power: the long fight, and recovering after it." },
    { id: "ins", name: "Instinct", short: "INS", c: 0x9a7af0, text: "Reactions and aim: reading the other side, and the counter in time." },
    { id: "cha", name: "Chaos", short: "CHA", c: 0x40e0e8, text: "Chaos Energy: how strong its techniques are, how much it holds, how fast it comes back." },
  ];

  /* Temperaments: how it spends its day (what it would rather do, as weights), how training
     takes to it, and how it fights. A creature has one leading temperament and a second that
     colours it. */
  const TEMPERS = {
    playful:      { name: "Playful", text: "Wants a game out of everything, and starts them with the others.", day: { play: 3, wander: 1.4, social: 1.6, rest: 0.6 }, train: { agi: 1.15, ins: 0.9 }, fight: "bold" },
    shy:          { name: "Shy", text: "Hides from strangers at first; devoted once it knows you.", day: { hide: 2, rest: 1.4, wander: 0.8, social: 0.5 }, train: { res: 1.15, pow: 0.9 }, fight: "careful", warm: 0.6 },
    curious:      { name: "Curious", text: "Into every bush and up every rock; finds things.", day: { explore: 3, wander: 1.6, social: 0.8 }, train: { ins: 1.15, res: 0.92 }, fight: "tricky", finds: 1.6 },
    energetic:    { name: "Energetic", text: "Never still: laps of the garden, all day long.", day: { run: 3, wander: 1.6, play: 1.2, rest: 0.4 }, train: { vel: 1.15, vit: 0.95 }, fight: "fast" },
    calm:         { name: "Calm", text: "Sits by the water and watches the clouds; hard to rattle.", day: { rest: 2.4, watch: 1.8, wander: 0.8 }, train: { vit: 1.15, vel: 0.9 }, fight: "steady" },
    mischievous:  { name: "Mischievous", text: "Takes the others' toys, then runs.", day: { tease: 2.2, play: 1.6, wander: 1.2 }, train: { agi: 1.1, cha: 1.08, res: 0.9 }, fight: "tricky" },
    affectionate: { name: "Affectionate", text: "Always near you, and near its friends; grows close fast.", day: { follow: 3, social: 2, rest: 0.8 }, train: { vit: 1.1, cha: 1.05 }, fight: "loyal", warm: 1.6 },
    competitive:  { name: "Competitive", text: "Has to win -- races, fights, who gets the fruit first.", day: { run: 1.6, spar: 2.4, wander: 1 }, train: { pow: 1.15, vel: 1.05, vit: 0.92 }, fight: "bold" },
    stubborn:     { name: "Stubborn", text: "Does what it wants, when it wants; immovable once set.", day: { rest: 1.6, wander: 1.2 }, train: { res: 1.12, pow: 1.08, ins: 0.88 }, fight: "steady", warm: 0.75 },
    adventurous:  { name: "Adventurous", text: "Wanders furthest from home, and comes back with stories (and eggs).", day: { explore: 2.6, wander: 2, run: 1 }, train: { vel: 1.08, ins: 1.08 }, fight: "bold", finds: 1.4 },
  };
  const TEMPER_KEYS = Object.keys(TEMPERS);

  /* ---------------------------------------------------------------- Chao
     A Chao's form is three things: its alignment (who it grew up loving -- the ball over its
     head, its colouring, its nub), its first path (what it was raised to be when it first
     changed: the shape of its body) and, after a second change, a second path that blends
     into it. Then the rare ones: mutations a lineage throws up, and the legendary. */
  const ALIGNS = {
    neutral: { name: "Neutral", word: "", c: [0x9ad8f8, 0xf8e070], ball: "sphere", ballC: 0xf8e070, nub: "point", text: "Raised by no one side: the garden's own." },
    hero:    { name: "Hero", word: "Halo", c: [0xf4f8ff, 0x9ad0f8], ball: "halo", ballC: 0xf8f070, nub: "round", text: "Raised gently and well: a halo over its head, light in colour." },
    dark:    { name: "Dark", word: "Shade", c: [0x4a3a6a, 0xd83a5a], ball: "spike", ballC: 0xd83a5a, nub: "horn", text: "Raised rough, or by rough company: a spiked ball, dark in colour." },
    wild:    { name: "Wild", word: "Grove", c: [0x8ad870, 0xf0a040], ball: "leaf", ballC: 0x6ad050, nub: "sprout", text: "Raised mostly among the animals: leafy, earthy, half wild." },
    mech:    { name: "Gear", word: "Gear", c: [0xb8c0cc, 0x40d0f0], ball: "gear", ballC: 0x40d0f0, nub: "antenna", text: "Grown up round the machines: steel-grey, with a gear for a ball." },
  };
  const ALIGN_KEYS = Object.keys(ALIGNS);
  const PATHS = {
    normal: { name: "Bloom", text: "Rounded and balanced", bias: {}, body: {} },
    swim:   { name: "Tidal", text: "Fins and a tail like a paddle", bias: { res: 1.25, vit: 1.1 }, body: { fins: 1, tail: "paddle" } },
    fly:    { name: "Sky", text: "Great wings, a light body", bias: { agi: 1.3, ins: 1.1 }, body: { wings: 2.2 } },
    run:    { name: "Dash", text: "Long legs and swept-back ears", bias: { vel: 1.35, agi: 1.05 }, body: { legs: 1.5, ears: "swept" } },
    power:  { name: "Brawn", text: "Broad arms and a chest like a barrel", bias: { pow: 1.35, res: 1.1 }, body: { arms: 1.6, chest: 1.25 } },
    spark:  { name: "Spark", text: "Glowing marks, and the energy crackling round it", bias: { cha: 1.35, ins: 1.1 }, body: { glow: 1, ears: "antlers" } },
  };
  const PATH_KEYS = Object.keys(PATHS);
  const CHAO = [];
  const chaoName = (al, p1, p2) => [ALIGNS[al].word, PATHS[p1].name + (p2 && p2 !== p1 ? "-" + PATHS[p2].name : ""), "Chao"].filter(Boolean).join(" ");
  /* the child of each alignment: the egg's first shape */
  for (const al of ALIGN_KEYS) CHAO.push({ id: "chao-" + al + "-child", kind: "chao", name: (ALIGNS[al].word ? ALIGNS[al].word + " " : "") + "Child Chao", align: al, stage: 0, p1: null, p2: null, rarity: al === "neutral" ? 1 : 2,
    text: "A Chao just out of its egg. What it becomes is up to how it's raised.", how: al === "neutral" ? "Hatches from any Chao egg." : "A " + ALIGNS[al].name.toLowerCase() + " Chao's own eggs; or a child raised that way from the start." });
  /* the first change: alignment x path */
  for (const al of ALIGN_KEYS) for (const p1 of PATH_KEYS) CHAO.push({ id: `chao-${al}-${p1}`, kind: "chao", name: chaoName(al, p1), align: al, stage: 1, p1, p2: null, rarity: 1 + (al !== "neutral") + (p1 === "spark"),
    text: `${PATHS[p1].text}. ${ALIGNS[al].text}`, how: `A child raised ${al === "neutral" ? "by everyone" : ALIGNS[al].name.toLowerCase()}, trained most in ${p1 === "normal" ? "everything alike" : ATTRS.find(a => a.id === Object.keys(PATHS[p1].bias)[0]).name}.` });
  /* the second change: a second path blends into the first */
  for (const al of ALIGN_KEYS) for (const p1 of PATH_KEYS) for (const p2 of PATH_KEYS) {
    if (p2 === p1) continue;   // (a Bloom Chao that later leans is "Bloom-Dash"; a Dash one that rounds out again, "Dash-Bloom")
    CHAO.push({ id: `chao-${al}-${p1}-${p2}`, kind: "chao", name: chaoName(al, p1, p2), align: al, stage: 2, p1, p2, rarity: 2 + (al !== "neutral") + (p1 === "spark" || p2 === "spark"),
      text: `${PATHS[p1].text}, with something of the ${PATHS[p2].name.toLowerCase()} in it. ${ALIGNS[al].text}`, how: `A ${chaoName(al, p1)} trained on, past its first change, in a second field.` });
  }
  /* mutations a lineage throws up (a recessive pairing, a long line, a strange place), and the
     legendary few */
  const RARE = [
    ["chao-crystal", "Crystal Chao", "mutation", 4, { body: { gem: 1, tint: 0xa0f0ff, glass: 1 } }, "A body like cut glass. Born now and then to two Chao with the crystal gene.", "Breed two Chao that both carry the crystal gene (a crystal grandparent, or luck)."],
    ["chao-ember", "Ember Chao", "mutation", 4, { body: { glow: 1, tint: 0xff7a3a, flame: 1 } }, "Warm to hold, and its ball flickers like a candle.", "Hatch an egg kept warm by the volcano vents in the Mountain Garden."],
    ["chao-tide", "Tide Chao", "mutation", 4, { body: { fins: 2, tint: 0x3a90e0, tail: "paddle" } }, "Sea-blue, finned all over; sleeps floating.", "A Tidal line three generations long."],
    ["chao-blossom", "Blossom Chao", "mutation", 4, { body: { tint: 0xf8a8d0, petals: 1 } }, "Petals round its head that open in the sun.", "Raise a Wild child in the Forest Garden's flower meadow."],
    ["chao-shadowglass", "Obsidian Chao", "mutation", 4, { body: { tint: 0x2a2238, glass: 1, gem: 1 } }, "Black glass, a red light deep inside.", "Breed a Crystal Chao with a Shade Chao."],
    ["chao-pearl", "Pearl Chao", "mutation", 4, { body: { tint: 0xf8f0e8, sheen: 1 } }, "A pearly sheen, and it hums when content.", "Find the pearl egg in the tide pools at low tide."],
    ["chao-moss", "Mossback Chao", "mutation", 3, { body: { tint: 0x6a9a4a, moss: 1 } }, "Moss grows on its back; birds nest in it.", "A Wild Chao that sleeps in the forest for many nights."],
    ["chao-copper", "Copper Chao", "mutation", 3, { body: { tint: 0xd88a4a, sheen: 1, rivets: 1 } }, "Riveted copper, warm brown; ticks softly.", "A Gear Chao with a Wild parent."],
    ["chao-star", "Starlit Chao", "mutation", 4, { body: { tint: 0x2a3a8a, stars: 1 } }, "Freckled with stars that move across it at night.", "Hatch an egg on the Sky Garden's observatory under a clear night."],
    ["chao-candy", "Candy Chao", "mutation", 3, { body: { tint: 0xf8c0e0, stripes: 0xffffff } }, "Striped like a sweet; always sticky.", "Feed a child nothing but sweet fruit."],
    ["chao-storm", "Storm Chao", "mutation", 4, { body: { tint: 0x5a6a8a, glow: 1, ears: "antlers" } }, "Its ball crackles before rain.", "A Spark Chao raised in the Sky Garden's thunderheads."],
    ["chao-gold", "Gold Chao", "rare", 5, { body: { tint: 0xf8c840, sheen: 1 } }, "Solid gold to look at; Chao keepers talk about them for years.", "One egg in a very long while: a perfect lineage, or the Golden Egg itself."],
    ["chao-silver", "Silver Chao", "rare", 5, { body: { tint: 0xd8dce4, sheen: 1 } }, "Mirror-silver.", "Win the Garden League's championship."],
    ["chao-chaos", "Chaos Chao", "legend", 6, { body: { tint: 0x40d8e8, glass: 1, glow: 1, wings: 2 } }, "A Chao reborn again and again until it never ages. The garden's own legend.", "A Chao that has lived three full lives, loved all the way through each."],
    ["chao-emerald", "Emerald Chao", "legend", 6, { body: { tint: 0x30d070, gem: 2, glow: 1 } }, "Green as a Chaos Emerald, and as bright.", "Something waits in the Mystic Garden's deepest chamber."],
    ["chao-eclipse", "Eclipse Chao", "legend", 6, { body: { tint: 0x1a1a2a, glow: 1, ring: 1 } }, "A dark ring of light round it, like the sun hidden.", "A Halo line and a Shade line, three generations each, brought together."],
    ["chao-aurora", "Aurora Chao", "legend", 6, { body: { tint: 0x80f0c0, ribbon: 1, glow: 1 } }, "Ribbons of light trail behind it.", "Hatch an egg in the snow on the mountain's peak while the aurora shows."],
    ["chao-prism", "Prism Chao", "legend", 6, { body: { glass: 1, prism: 1 } }, "Every colour at once, depending how you look.", "Have discovered a hundred Chao forms."],
    ["chao-omega", "Gizoid Chao", "legend", 6, { body: { tint: 0x8a8aa0, rivets: 1, glow: 1, ears: "antlers" } }, "Built, not born -- or so the researchers say.", "Rebuild the machine in the Mechanical Garden's sealed lab."],
    ["chao-ancient", "Ancient Chao", "legend", 6, { body: { tint: 0xd8c8a0, glyphs: 1 } }, "Carvings on its skin match the ruins'.", "Wake the sleeper in the Mystic Garden's ruins."],
    ["chao-dream", "Dream Chao", "legend", 6, { body: { tint: 0xc8b0f8, stars: 1, wings: 1.6 } }, "Only ever seen half asleep.", "Have a Chao sleep in every region of the garden."],
  ];
  for (const [id, name, cls, rarity, morph, text, how] of RARE) CHAO.push({ id, kind: "chao", name, align: "neutral", stage: 3, p1: null, p2: null, rarity, cls, morph, text, how });

  /* ---------------------------------------------------------------- animals
     Each species: its body plan (how the model is built), size, its colours (main, second,
     belly), its features (the things that make a rabbit a rabbit), where it lives, and what it
     tends to be good at. They breed only with their own species. The classic ones -- the
     animals Sonic frees from Eggman's badniks -- come from the main game. */
  const H = "central", T = "tropical", M = "mountain", F = "forest", Y = "mystic", C = "mech", S = "sky";
  /* [id, name, plan, size, [main, second, belly], features, region, lean, rarity, classic] */
  const A = [
    // the classic animals: what the badniks hold (the main game frees them)
    ["flicky", "Flicky", "bird", 0.42, [0x3a7af0, 0xf8f8f8, 0xf8f8f8], "beak:short,crest", H, "agi", 1, 1],
    ["pocky", "Pocky", "hopper", 0.5, [0xf0f0f0, 0xf8b0c0, 0xf8f8f8], "ears:long,tail:puff", H, "vel", 1, 1],
    ["cucky", "Cucky", "bird", 0.48, [0xf8f8f0, 0xe83a3a, 0xf8f8f0], "beak:short,comb,flightless", H, "res", 1, 1],
    ["pecky", "Pecky", "penguin", 0.5, [0x2a3a5a, 0xf8f8f8, 0xf8f8f8], "beak:short,flippers", M, "agi", 1, 1],
    ["rocky", "Rocky", "seal", 0.6, [0xa8b0c0, 0x8a909a, 0xd8dce4], "whiskers,flippers", T, "vit", 1, 1],
    ["picky", "Picky", "quad", 0.5, [0xf8b8c8, 0xe89aa8, 0xf8c8d4], "snout:pig,ears:flop,tail:curl", H, "res", 1, 1],
    ["ricky", "Ricky", "hopper", 0.45, [0xb87a4a, 0x8a5a3a, 0xf0d8b8], "ears:round,tail:bushy", F, "agi", 1, 1],
    ["tocky", "Tocky", "turtle", 0.5, [0x6aa84a, 0x8a6a3a, 0xd8c878], "shell", T, "res", 1, 1],
    ["mocky", "Mocky", "primate", 0.55, [0x9a6a3a, 0xe8c8a0, 0xe8c8a0], "ears:round,tail:long", F, "agi", 1, 1],
    ["becky", "Becky", "bird", 0.45, [0xf8e040, 0xf08a2a, 0xf8f0b0], "beak:short", T, "vel", 1, 1],
    ["wocky", "Wocky", "bird", 0.5, [0xf8f8f8, 0x3a3a3a, 0xf8f8f8], "beak:long,legs:long", T, "ins", 2, 1],
    ["rabbit", "Rabbit", "hopper", 0.5, [0xd8c0a0, 0xc0a080, 0xf8f0e0], "ears:long,tail:puff", H, "vel", 1],
    // the garden's mammals
    ["hare", "Snow Hare", "hopper", 0.55, [0xf8f8f8, 0xd8dce4, 0xf8f8f8], "ears:long,tail:puff", M, "vel", 2],
    ["lop", "Lop Rabbit", "hopper", 0.5, [0xc89a6a, 0xa87a4a, 0xf0e0c8], "ears:lop,tail:puff", H, "vit", 1],
    ["squirrel", "Squirrel", "hopper", 0.42, [0xc86a3a, 0xa04a2a, 0xf0d0a8], "ears:tuft,tail:bushy", F, "agi", 1],
    ["chipmunk", "Chipmunk", "hopper", 0.36, [0xb87a4a, 0x3a2a1a, 0xf0d8b0], "ears:round,tail:bushy,stripes", F, "vel", 1],
    ["flyingsquirrel", "Flying Squirrel", "glider", 0.42, [0xa89a8a, 0x7a6a5a, 0xf0e8d8], "ears:round,tail:flat", F, "agi", 2],
    ["mouse", "Field Mouse", "quad", 0.3, [0xa88a6a, 0x8a6a4a, 0xe8d8c0], "ears:big,tail:thin,whiskers", H, "agi", 1],
    ["hamster", "Hamster", "quad", 0.32, [0xf0c080, 0xf8f0e0, 0xf8f0e0], "ears:round,cheeks", H, "vit", 1],
    ["guineapig", "Guinea Pig", "quad", 0.38, [0xf8f0e0, 0xc87a3a, 0xf8f0e0], "ears:round,patches", H, "res", 1],
    ["hedgehog", "Hedgehog", "quad", 0.38, [0x8a6a4a, 0x4a3a2a, 0xf0d8b8], "quills,snout:point", F, "res", 1],
    ["porcupine", "Porcupine", "quad", 0.5, [0x5a4a3a, 0xf0e8d8, 0x8a7a6a], "quills:long,snout:point", F, "res", 2],
    ["armadillo", "Armadillo", "quad", 0.48, [0xa89a8a, 0x8a7a6a, 0xd8c8b8], "shell:bands,ears:point,snout:point", Y, "res", 2],
    ["pangolin", "Pangolin", "quad", 0.55, [0x8a6a4a, 0x6a4a3a, 0xd8b898], "scales,tail:long,snout:point", Y, "res", 3],
    ["mole", "Mole", "quad", 0.35, [0x3a3a3a, 0xf8b0c0, 0x5a5a5a], "snout:point,claws", F, "pow", 1],
    ["shrew", "Shrew", "quad", 0.25, [0x6a5a4a, 0x4a3a2a, 0xa89a8a], "snout:point,tail:thin", F, "vel", 1],
    ["bat", "Bat", "bat", 0.42, [0x4a3a4a, 0x2a2030, 0x6a5a6a], "ears:big,wings:leather", Y, "ins", 1],
    ["fruitbat", "Fruit Bat", "bat", 0.5, [0x8a5a3a, 0x3a2a2a, 0xc89a6a], "ears:point,wings:leather,snout:fox", T, "agi", 2],
    ["skunk", "Skunk", "quad", 0.48, [0x2a2a2a, 0xf8f8f8, 0x2a2a2a], "tail:bushy,stripe:back", F, "ins", 1],
    ["raccoon", "Raccoon", "quad", 0.52, [0x8a8a8a, 0x2a2a2a, 0xd8d8d8], "mask,tail:ringed,ears:point", F, "ins", 1],
    ["redpanda", "Red Panda", "quad", 0.52, [0xc85a2a, 0x3a2a2a, 0xf8f0e0], "mask:white,tail:ringed,ears:point", M, "agi", 2],
    ["fox", "Fox", "quad", 0.55, [0xe8782a, 0xf8f8f8, 0xf8f8f8], "ears:point,tail:brush,snout:fox", F, "ins", 1],
    ["arcticfox", "Arctic Fox", "quad", 0.5, [0xf8f8f8, 0xd8dce4, 0xf8f8f8], "ears:point,tail:brush,snout:fox", M, "agi", 2],
    ["fennec", "Fennec Fox", "quad", 0.42, [0xf0d0a0, 0xf8f0e0, 0xf8f0e0], "ears:huge,tail:brush,snout:fox", T, "vel", 2],
    ["wolf", "Wolf", "quad", 0.8, [0x8a8a92, 0x5a5a62, 0xd8d8dc], "ears:point,tail:brush,snout:dog", M, "pow", 2],
    ["dog", "Dog", "quad", 0.6, [0xc8a070, 0x8a6a4a, 0xf0e0c8], "ears:flop,tail:wag,snout:dog", H, "vit", 1],
    ["puppy", "Puppy", "quad", 0.42, [0xf0e0c8, 0x8a6a4a, 0xf8f0e0], "ears:flop,tail:wag,snout:dog", H, "vit", 1],
    ["dalmatian", "Spotted Dog", "quad", 0.6, [0xf8f8f8, 0x2a2a2a, 0xf8f8f8], "ears:flop,tail:wag,snout:dog,spots", H, "vel", 2],
    ["cat", "Cat", "quad", 0.48, [0xe8a060, 0xc8803a, 0xf8e8d0], "ears:point,tail:long,whiskers", H, "agi", 1],
    ["blackcat", "Black Cat", "quad", 0.48, [0x2a2a30, 0x1a1a20, 0x3a3a40], "ears:point,tail:long,whiskers", Y, "ins", 2],
    ["tabby", "Tabby Cat", "quad", 0.48, [0xb0a090, 0x6a5a4a, 0xe8e0d0], "ears:point,tail:long,whiskers,stripes", H, "agi", 1],
    ["lynx", "Lynx", "quad", 0.7, [0xc8a87a, 0x8a6a4a, 0xf0e0c8], "ears:tuft,tail:stub,whiskers,spots", M, "ins", 2],
    ["cheetah", "Cheetah", "quad", 0.85, [0xf0c060, 0x2a2a2a, 0xf8f0d8], "ears:round,tail:long,spots,legs:long", T, "vel", 2],
    ["leopard", "Leopard", "quad", 0.85, [0xe8b050, 0x3a2a1a, 0xf8e8c8], "ears:round,tail:long,rosettes", T, "agi", 2],
    ["snowleopard", "Snow Leopard", "quad", 0.85, [0xe8e8e0, 0x5a5a5a, 0xf8f8f8], "ears:round,tail:thick,rosettes", M, "agi", 3],
    ["lion", "Lion", "quad", 1.1, [0xe0b060, 0xa86a2a, 0xf0d8a0], "ears:round,tail:tuft,mane", T, "pow", 2],
    ["tiger", "Tiger", "quad", 1.1, [0xf08a2a, 0x2a2a2a, 0xf8f8f0], "ears:round,tail:long,stripes", F, "pow", 2],
    ["whitetiger", "White Tiger", "quad", 1.1, [0xf8f8f0, 0x3a3a4a, 0xf8f8f8], "ears:round,tail:long,stripes", Y, "pow", 4],
    ["jaguar", "Jaguar", "quad", 0.95, [0xe0a040, 0x2a2a2a, 0xf8e8c8], "ears:round,tail:long,rosettes", T, "pow", 3],
    ["panther", "Panther", "quad", 0.95, [0x1a1a22, 0x2a2a34, 0x2a2a30], "ears:round,tail:long", Y, "ins", 3],
    ["bear", "Brown Bear", "quad", 1.15, [0x7a5232, 0x5a3a22, 0x9a7252], "ears:round,snout:bear", M, "pow", 2],
    ["blackbear", "Black Bear", "quad", 1.05, [0x2a2a2a, 0x1a1a1a, 0x8a6a4a], "ears:round,snout:bear", F, "res", 2],
    ["polarbear", "Polar Bear", "quad", 1.2, [0xf8f8f0, 0xe0e0d8, 0xf8f8f8], "ears:round,snout:bear", M, "vit", 3],
    ["panda", "Panda", "quad", 1.0, [0xf8f8f8, 0x1a1a1a, 0xf8f8f8], "ears:round,eyepatch,snout:bear", M, "res", 3],
    ["koala", "Koala", "climber", 0.55, [0xa8a8b0, 0x8a8a92, 0xf0f0f0], "ears:fluffy,nose:big", F, "vit", 2],
    ["sloth", "Sloth", "climber", 0.6, [0x9a8a6a, 0x6a5a4a, 0xc8b898], "mask,claws", F, "vit", 2],
    ["kangaroo", "Kangaroo", "hopper", 0.95, [0xc8885a, 0xa86a3a, 0xf0d8b8], "ears:point,tail:thick,pouch", T, "pow", 2],
    ["wallaby", "Wallaby", "hopper", 0.7, [0xa89a8a, 0x8a7a6a, 0xe8e0d8], "ears:point,tail:thick", T, "vel", 2],
    ["deer", "Deer", "quad", 0.95, [0xc8885a, 0xf8f8f8, 0xf0e0c8], "ears:point,antlers,tail:stub,legs:long", F, "vel", 2],
    ["fawn", "Fawn", "quad", 0.6, [0xc8885a, 0xf8f8f8, 0xf0e0c8], "ears:point,spots,legs:long", F, "agi", 1],
    ["reindeer", "Reindeer", "quad", 1.0, [0x8a6a4a, 0xf0e8d8, 0xd8c8b0], "ears:point,antlers:big,legs:long", M, "vit", 2],
    ["moose", "Moose", "quad", 1.3, [0x5a4a3a, 0x3a2a1a, 0x7a6a5a], "antlers:palm,snout:long", M, "pow", 3],
    ["elk", "Elk", "quad", 1.2, [0xa87a4a, 0x6a4a2a, 0xd8b88a], "antlers:big,mane:short,legs:long", M, "pow", 3],
    ["goat", "Goat", "quad", 0.7, [0xf0e8d8, 0xc8b8a8, 0xf8f0e8], "horns:curve,beard,ears:flop", M, "res", 1],
    ["ibex", "Ibex", "quad", 0.85, [0xa89070, 0x6a5a4a, 0xd8c8a8], "horns:long,beard", M, "agi", 3],
    ["sheep", "Sheep", "woolly", 0.7, [0xf8f4e8, 0x3a3a3a, 0xf8f4e8], "ears:flop,wool", H, "res", 1],
    ["ram", "Ram", "woolly", 0.85, [0xf0e8d8, 0x8a7a6a, 0xf0e8d8], "horns:curl,wool", M, "pow", 2],
    ["llama", "Llama", "quad", 1.0, [0xf0e8d8, 0xc8a070, 0xf8f0e8], "ears:long,neck:long,wool", M, "vit", 2],
    ["alpaca", "Alpaca", "woolly", 0.85, [0xf8f0e0, 0xe0c8a0, 0xf8f0e0], "ears:point,neck:long,wool", M, "vit", 2],
    ["camel", "Camel", "quad", 1.3, [0xd8b080, 0xb08a5a, 0xe8c898], "hump:2,neck:long,legs:long", T, "vit", 2],
    ["horse", "Horse", "quad", 1.25, [0x8a5a3a, 0x3a2a1a, 0x9a6a4a], "mane,tail:hair,legs:long", H, "vel", 2],
    ["pony", "Pony", "quad", 0.85, [0xf0e0c8, 0xc8a070, 0xf8f0e0], "mane,tail:hair", H, "vit", 1],
    ["zebra", "Zebra", "quad", 1.15, [0xf8f8f8, 0x1a1a1a, 0xf8f8f8], "mane,tail:tuft,stripes,legs:long", T, "vel", 2],
    ["donkey", "Donkey", "quad", 0.95, [0x8a8a8a, 0x6a6a6a, 0xd8d8d8], "ears:long,mane:short,tail:tuft", H, "res", 1],
    ["cow", "Cow", "quad", 1.1, [0xf8f8f8, 0x2a2a2a, 0xf8c8c8], "horns:short,spots,tail:tuft", H, "vit", 1],
    ["bull", "Bull", "quad", 1.2, [0x5a3a2a, 0x3a2a1a, 0x7a5a4a], "horns:wide,tail:tuft", M, "pow", 2],
    ["buffalo", "Buffalo", "quad", 1.3, [0x3a2a22, 0x2a1a12, 0x5a4a3a], "horns:wide,mane:short,hump:1", M, "pow", 3],
    ["pig", "Pig", "quad", 0.75, [0xf8b8c8, 0xe89aa8, 0xf8c8d4], "snout:pig,ears:flop,tail:curl", H, "res", 1],
    ["boar", "Boar", "quad", 0.8, [0x5a4a3a, 0x3a2a1a, 0x7a6a5a], "snout:pig,tusks,mane:short", F, "pow", 2],
    ["warthog", "Warthog", "quad", 0.8, [0x8a7a6a, 0x5a4a3a, 0xa89a8a], "snout:pig,tusks:big,mane:short", T, "pow", 2],
    ["hippo", "Hippo", "quad", 1.3, [0x8a7a8a, 0x6a5a6a, 0xd8a8b0], "snout:wide,ears:tiny", T, "res", 3],
    ["rhino", "Rhino", "quad", 1.35, [0x9a9aa0, 0x7a7a80, 0xb0b0b4], "horn:nose,ears:point", T, "pow", 3],
    ["elephant", "Elephant", "quad", 1.5, [0xa0a0a8, 0x8a8a92, 0xb8b8c0], "trunk,ears:fan,tusks", T, "pow", 3],
    ["giraffe", "Giraffe", "quad", 1.6, [0xf0c060, 0xa86a2a, 0xf8e8c0], "neck:tall,ossicones,patches,legs:long", T, "ins", 3],
    ["okapi", "Okapi", "quad", 1.1, [0x5a3a2a, 0xf8f8f8, 0x6a4a3a], "ossicones,legstripes,neck:long", Y, "ins", 4],
    ["tapir", "Tapir", "quad", 0.95, [0x2a2a2a, 0xf8f8f8, 0x2a2a2a], "snout:trunk,saddle", T, "res", 3],
    ["anteater", "Anteater", "quad", 0.95, [0x8a7a6a, 0x2a2a2a, 0xf0e8d8], "snout:tube,tail:brush,claws", T, "ins", 3],
    ["otter", "Otter", "seal", 0.6, [0x7a5a3a, 0x5a3a22, 0xd8c0a0], "whiskers,tail:thick,ears:tiny", T, "agi", 1],
    ["seaotter", "Sea Otter", "seal", 0.65, [0x6a4a32, 0xd8c8b0, 0xd8c8b0], "whiskers,tail:flat", T, "vit", 2],
    ["beaver", "Beaver", "quad", 0.6, [0x8a5a3a, 0x5a3a22, 0xa87a5a], "teeth,tail:paddle,ears:tiny", F, "pow", 2],
    ["platypus", "Platypus", "quad", 0.5, [0x7a5a3a, 0x3a3a3a, 0xa87a5a], "bill,tail:paddle,webbed", Y, "ins", 3],
    ["seal", "Seal", "seal", 0.7, [0xa8b0c0, 0x8a909a, 0xd8dce4], "whiskers,flippers", T, "vit", 1],
    ["sealion", "Sea Lion", "seal", 0.85, [0x8a6a4a, 0x6a4a32, 0xa88a6a], "whiskers,flippers,ears:tiny", T, "pow", 2],
    ["walrus", "Walrus", "seal", 1.15, [0xa87a5a, 0x8a5a3a, 0xc89a7a], "whiskers,tusks:long,flippers", M, "res", 3],
    ["dolphin", "Dolphin", "fish", 1.0, [0x6a90b8, 0x4a6a90, 0xd8e4f0], "fin:back,beak:dolphin", T, "agi", 2],
    ["orca", "Orca", "fish", 1.3, [0x1a1a22, 0xf8f8f8, 0xf8f8f8], "fin:tall,patch", T, "pow", 4],
    ["narwhal", "Narwhal", "fish", 1.1, [0xa8b0b8, 0x6a7a8a, 0xd8dce4], "tusk:spiral,spots", M, "ins", 4],
    ["manatee", "Manatee", "fish", 1.1, [0x9a9aa0, 0x7a7a80, 0xb0b0b4], "flippers,snout:wide", T, "vit", 3],
    ["monkey", "Monkey", "primate", 0.6, [0x9a6a3a, 0xe8c8a0, 0xe8c8a0], "ears:round,tail:long", F, "agi", 1],
    ["baboon", "Baboon", "primate", 0.8, [0x8a7a5a, 0xd83a5a, 0xa89a7a], "snout:dog,mane:short", T, "pow", 2],
    ["gorilla", "Gorilla", "ape", 1.2, [0x2a2a2a, 0x5a5a5a, 0x3a3a3a], "brow,arms:big", F, "pow", 3],
    ["chimp", "Chimpanzee", "ape", 0.85, [0x3a2a22, 0xe8c8a0, 0x5a4a3a], "ears:big", F, "ins", 2],
    ["orangutan", "Orangutan", "ape", 1.0, [0xc8602a, 0xa8481a, 0xd8784a], "arms:long,cheekpads", F, "vit", 3],
    ["lemur", "Lemur", "primate", 0.5, [0xb0b0b8, 0x2a2a2a, 0xf8f8f8], "tail:ringed,eyes:big", Y, "agi", 2],
    ["slowloris", "Slow Loris", "primate", 0.38, [0xc8a07a, 0x6a4a32, 0xf0e0c8], "eyes:big,mask", Y, "ins", 3],
    ["tarsier", "Tarsier", "primate", 0.3, [0xa88a6a, 0x8a6a4a, 0xd8c0a0], "eyes:huge,ears:big", Y, "ins", 3],
    ["meerkat", "Meerkat", "upright", 0.4, [0xd8b080, 0x8a6a4a, 0xf0d8b0], "ears:tiny,mask", T, "ins", 1],
    ["prairiedog", "Prairie Dog", "upright", 0.38, [0xc8a07a, 0xa8805a, 0xf0d8b0], "ears:tiny", H, "ins", 1],
    ["groundhog", "Groundhog", "upright", 0.5, [0x8a6a4a, 0x6a4a32, 0xa88a6a], "ears:tiny,teeth", F, "res", 1],
    ["badger", "Badger", "quad", 0.6, [0x8a8a8a, 0x1a1a1a, 0x3a3a3a], "stripe:face,claws", F, "pow", 2],
    ["wolverine", "Wolverine", "quad", 0.65, [0x4a3a2a, 0xc8a070, 0x3a2a1a], "claws,stripe:side", M, "pow", 3],
    ["ferret", "Ferret", "quad", 0.42, [0xf0e0c8, 0x6a4a32, 0xf8f0e0], "mask,tail:long", H, "agi", 1],
    ["weasel", "Weasel", "quad", 0.38, [0x9a6a3a, 0xf8f0e0, 0xf8f0e0], "tail:long", F, "vel", 1],
    ["stoat", "Stoat", "quad", 0.38, [0xf8f8f8, 0x2a2a2a, 0xf8f8f8], "tail:blacktip", M, "vel", 2],
    ["mongoose", "Mongoose", "quad", 0.45, [0x9a8a6a, 0x7a6a4a, 0xb0a080], "tail:long,snout:point", T, "ins", 2],
    ["hyena", "Hyena", "quad", 0.8, [0xc8b080, 0x5a4a3a, 0xd8c8a0], "spots,mane:short,ears:round", T, "ins", 2],
    // birds
    ["parrot", "Parrot", "bird", 0.5, [0x3ac83a, 0xe83a3a, 0xf8e040], "beak:hook,tail:long", T, "ins", 1],
    ["macaw", "Macaw", "bird", 0.6, [0xe83a2a, 0x3a7af0, 0xf8e040], "beak:hook,tail:long", T, "agi", 2],
    ["cockatoo", "Cockatoo", "bird", 0.55, [0xf8f8f8, 0xf8e040, 0xf8f8f8], "beak:hook,crest:big", T, "ins", 2],
    ["toucan", "Toucan", "bird", 0.55, [0x1a1a1a, 0xf8a020, 0xf8f8f0], "beak:toucan", T, "ins", 2],
    ["peacock", "Peacock", "bird", 0.75, [0x2a6ad0, 0x3ab06a, 0x2a6ad0], "crest,tail:fan", Y, "cha", 3],
    ["swallow", "Swallow", "bird", 0.38, [0x2a3a7a, 0xd84a3a, 0xf8f0e8], "beak:short,tail:fork", S, "vel", 1],
    ["robin", "Robin", "bird", 0.36, [0x8a6a4a, 0xe8602a, 0xf8f0e8], "beak:short", H, "agi", 1],
    ["bluejay", "Blue Jay", "bird", 0.4, [0x3a7ad0, 0xf8f8f8, 0xf8f8f8], "beak:short,crest", F, "ins", 1],
    ["cardinal", "Cardinal", "bird", 0.38, [0xd82a2a, 0x2a1a1a, 0xd82a2a], "beak:short,crest", F, "pow", 1],
    ["sparrow", "Sparrow", "bird", 0.32, [0x9a7a5a, 0x6a4a32, 0xe8d8c8], "beak:short", H, "agi", 1],
    ["finch", "Finch", "bird", 0.3, [0xf8d830, 0x2a2a2a, 0xf8e880], "beak:short", H, "vel", 1],
    ["canary", "Canary", "bird", 0.3, [0xf8e040, 0xf8c020, 0xf8f0a0], "beak:short", H, "cha", 1],
    ["hummingbird", "Hummingbird", "bird", 0.24, [0x3ab06a, 0xe83a6a, 0xd8f0d8], "beak:needle", T, "vel", 2],
    ["kingfisher", "Kingfisher", "bird", 0.38, [0x2a90d8, 0xf08a2a, 0xf0a060], "beak:long", T, "ins", 2],
    ["woodpecker", "Woodpecker", "bird", 0.4, [0x2a2a2a, 0xe83a3a, 0xf8f8f8], "beak:long,crest", F, "pow", 1],
    ["owl", "Owl", "owl", 0.55, [0x9a7a5a, 0xf0e0c8, 0xd8c8a8], "ears:tuft,eyes:big", F, "ins", 2],
    ["snowyowl", "Snowy Owl", "owl", 0.6, [0xf8f8f8, 0x3a3a3a, 0xf8f8f8], "eyes:big,spots", M, "ins", 3],
    ["barnowl", "Barn Owl", "owl", 0.55, [0xe0b070, 0xf8f8f0, 0xf8f8f0], "face:heart", H, "ins", 2],
    ["hawk", "Hawk", "raptor", 0.65, [0x8a5a3a, 0xf0e0c8, 0xf0e0c8], "beak:hook,talons", M, "vel", 2],
    ["eagle", "Eagle", "raptor", 0.8, [0x4a3a2a, 0xf8f8f8, 0x4a3a2a], "beak:hook,talons,head:white", S, "pow", 3],
    ["falcon", "Falcon", "raptor", 0.6, [0x6a7a8a, 0xf0e8d8, 0xf0e8d8], "beak:hook,mask", S, "vel", 3],
    ["condor", "Condor", "raptor", 0.95, [0x1a1a1a, 0xf8f8f8, 0xd88a8a], "beak:hook,ruff", S, "vit", 3],
    ["vulture", "Vulture", "raptor", 0.85, [0x3a3a3a, 0xd8a8a0, 0x5a5a5a], "beak:hook,neck:bare", T, "res", 2],
    ["crow", "Crow", "bird", 0.48, [0x1a1a22, 0x2a2a3a, 0x2a2a34], "beak:short", Y, "ins", 1],
    ["raven", "Raven", "bird", 0.55, [0x10101a, 0x2a2a4a, 0x1a1a2a], "beak:big", Y, "cha", 2],
    ["magpie", "Magpie", "bird", 0.48, [0x1a1a22, 0xf8f8f8, 0xf8f8f8], "beak:short,tail:long", H, "ins", 1],
    ["seagull", "Seagull", "bird", 0.5, [0xf8f8f8, 0x9aa0aa, 0xf8f8f8], "beak:short", T, "vit", 1],
    ["pelican", "Pelican", "bird", 0.8, [0xf8f8f0, 0xf8c040, 0xf8f8f0], "beak:pouch", T, "vit", 2],
    ["puffin", "Puffin", "penguin", 0.4, [0x1a1a22, 0xf08a2a, 0xf8f8f8], "beak:puffin", M, "agi", 2],
    ["penguin", "Penguin", "penguin", 0.55, [0x2a3a5a, 0xf8f8f8, 0xf8f8f8], "beak:short,flippers", M, "agi", 1],
    ["emperorpenguin", "Emperor Penguin", "penguin", 0.8, [0x1a2a3a, 0xf8c040, 0xf8f8f8], "beak:long,flippers", M, "vit", 3],
    ["flamingo", "Flamingo", "wader", 0.85, [0xf8a0b0, 0xe8708a, 0xf8b0c0], "beak:bent,legs:stilt,neck:long,legc:e8708a", T, "agi", 2],
    ["heron", "Heron", "wader", 0.8, [0x9aa0b0, 0x3a3a3a, 0xf8f8f8], "beak:long,legs:stilt,neck:long,legc:c8b060", T, "ins", 2],
    ["crane", "Crane", "wader", 0.9, [0xf8f8f8, 0xd83a3a, 0xf8f8f8], "beak:long,legs:stilt,neck:long,cap,legc:4a4a50", Y, "cha", 3],
    ["stork", "Stork", "wader", 0.85, [0xf8f8f8, 0x1a1a1a, 0xf8f8f8], "beak:long,legs:stilt,neck:long,legc:d8503a", H, "vit", 2],
    ["swan", "Swan", "waterfowl", 0.8, [0xf8f8f8, 0xf08a2a, 0xf8f8f8], "neck:long", Y, "cha", 2],
    ["duck", "Duck", "waterfowl", 0.45, [0x6a5a3a, 0x2a8a4a, 0xd8c8a8], "bill", H, "vit", 1],
    ["duckling", "Duckling", "waterfowl", 0.3, [0xf8e040, 0xf8a020, 0xf8f0a0], "bill", H, "vit", 1],
    ["goose", "Goose", "waterfowl", 0.65, [0xf0f0f0, 0xf8a020, 0xf0f0f0], "bill,neck:long", H, "pow", 1],
    ["chicken", "Chicken", "bird", 0.48, [0xc8803a, 0xe83a3a, 0xe8a060], "beak:short,comb,flightless", H, "res", 1],
    ["chick", "Chick", "bird", 0.28, [0xf8e040, 0xf8a020, 0xf8f0a0], "beak:short,flightless", H, "vit", 1],
    ["rooster", "Rooster", "bird", 0.55, [0xd8602a, 0xe83a3a, 0x2a6a3a], "beak:short,comb:big,tail:arch,flightless", H, "pow", 2],
    ["turkey", "Turkey", "bird", 0.75, [0x6a4a32, 0xd83a3a, 0x8a6a4a], "beak:short,wattle,tail:fan,flightless", F, "res", 2],
    ["pheasant", "Pheasant", "bird", 0.6, [0xc8602a, 0x2a6a4a, 0xd88a4a], "beak:short,tail:long", F, "vel", 2],
    ["quail", "Quail", "bird", 0.3, [0x9a7a5a, 0x3a2a1a, 0xc8a87a], "beak:short,topknot,flightless", H, "agi", 1],
    ["ostrich", "Ostrich", "ratite", 1.2, [0x2a2a2a, 0xf8f8f8, 0xd8a8a0], "neck:long,legs:long", T, "vel", 3],
    ["emu", "Emu", "ratite", 1.1, [0x6a5a4a, 0x3a3a5a, 0x7a6a5a], "neck:long,legs:long", T, "vel", 2],
    ["kiwi", "Kiwi", "ratite", 0.4, [0x8a6a4a, 0x6a4a32, 0xa88a6a], "beak:long,flightless", Y, "ins", 3],
    ["dodo", "Dodo", "ratite", 0.6, [0x9a9aa0, 0xd8c070, 0xb0b0b8], "beak:big,flightless", Y, "vit", 4],
    ["roadrunner", "Roadrunner", "bird", 0.5, [0x8a7a5a, 0x3a6ad8, 0xe8d8b8], "beak:long,crest,tail:long,legs:long", T, "vel", 2],
    ["albatross", "Albatross", "bird", 0.7, [0xf8f8f8, 0x3a3a3a, 0xf8f8f8], "beak:hook,wings:long", S, "vit", 3],
    ["lovebird", "Lovebird", "bird", 0.3, [0x6ad86a, 0xf08a5a, 0xc8f0a0], "beak:hook", T, "cha", 2],
    ["bird-of-paradise", "Paradise Bird", "bird", 0.55, [0xf8c040, 0x2a8ad8, 0xf8e080], "tail:plumes,crest", Y, "cha", 4],
    // reptiles and amphibians
    ["turtle", "Turtle", "turtle", 0.55, [0x6aa84a, 0x8a6a3a, 0xd8c878], "shell", H, "res", 1],
    ["seaturtle", "Sea Turtle", "turtle", 0.85, [0x6a9a7a, 0x8a6a3a, 0xd8c8a8], "shell,flippers", T, "vit", 2],
    ["tortoise", "Tortoise", "turtle", 0.8, [0x8a7a5a, 0x6a5a3a, 0xb0a070], "shell:dome", T, "res", 2],
    ["frog", "Frog", "frog", 0.35, [0x5ac84a, 0x3a8a3a, 0xd8f0a0], "eyes:top", F, "agi", 1],
    ["treefrog", "Tree Frog", "frog", 0.28, [0x5ae04a, 0xe83a3a, 0xf0f8d8], "eyes:big,toes", T, "agi", 2],
    ["poisondart", "Dart Frog", "frog", 0.25, [0x3a8af0, 0x1a1a2a, 0x3a8af0], "spots", T, "cha", 3],
    ["toad", "Toad", "frog", 0.4, [0x8a7a4a, 0x6a5a3a, 0xc8b88a], "warts", F, "res", 1],
    ["axolotl", "Axolotl", "lizard", 0.4, [0xf8b8c8, 0xe86a8a, 0xf8c8d4], "gills,tail:fin", Y, "vit", 3],
    ["newt", "Newt", "lizard", 0.3, [0x8a6a3a, 0xf08a2a, 0xf0a040], "tail:fin", F, "agi", 1],
    ["salamander", "Fire Salamander", "lizard", 0.38, [0x1a1a1a, 0xf8d020, 0x2a2a2a], "spots", Y, "cha", 3],
    ["lizard", "Lizard", "lizard", 0.4, [0x6a9a4a, 0x4a7a3a, 0xc8d8a0], "tail:long", T, "vel", 1],
    ["gecko", "Gecko", "lizard", 0.3, [0xf0d060, 0x8a6a3a, 0xf8e8a0], "eyes:big,toes,spots", T, "agi", 1],
    ["chameleon", "Chameleon", "lizard", 0.42, [0x5ac86a, 0xf8d040, 0xd8f0a0], "crest,tail:curl,eyes:turret", Y, "ins", 3],
    ["iguana", "Iguana", "lizard", 0.65, [0x5aa86a, 0x3a7a4a, 0xa8d8a0], "spines,dewlap", T, "res", 2],
    ["frilled", "Frilled Lizard", "lizard", 0.55, [0xa88a5a, 0xe86a3a, 0xd8c08a], "frill", T, "ins", 3],
    ["komodo", "Komodo Dragon", "lizard", 1.2, [0x6a6a5a, 0x4a4a3a, 0x8a8a7a], "tail:long,tongue", Y, "pow", 4],
    ["crocodile", "Crocodile", "croc", 1.2, [0x4a6a3a, 0x3a4a2a, 0xc8c890], "snout:long,teeth,scutes", T, "pow", 3],
    ["alligator", "Alligator", "croc", 1.15, [0x3a4a3a, 0x2a3a2a, 0xa8a880], "snout:wide,teeth,scutes", T, "res", 3],
    ["snake", "Snake", "snake", 0.8, [0x6aa84a, 0xf0e040, 0xd8e8a0], "pattern:band", F, "agi", 2],
    ["python", "Python", "snake", 1.2, [0xa88a4a, 0x5a4a2a, 0xd8c08a], "pattern:blotch", T, "pow", 3],
    ["cobra", "Cobra", "snake", 0.95, [0x8a7a4a, 0x3a3a2a, 0xd8c88a], "hood", T, "cha", 3],
    // fish and sea life
    ["goldfish", "Goldfish", "fish", 0.3, [0xf8902a, 0xf8c040, 0xf8c080], "fin:fancy", H, "cha", 1],
    ["koi", "Koi", "fish", 0.55, [0xf8f8f8, 0xe8502a, 0xf8f8f8], "whiskers,patches", Y, "cha", 2],
    ["clownfish", "Clownfish", "fish", 0.3, [0xf8802a, 0xf8f8f8, 0xf8a060], "bands", T, "agi", 1],
    ["angelfish", "Angelfish", "fish", 0.4, [0xf8e040, 0x3a7af0, 0xf8f0a0], "fin:tall,stripes", T, "agi", 2],
    ["pufferfish", "Pufferfish", "fish", 0.38, [0xd8c070, 0x8a7a4a, 0xf8f0d8], "spines,round", T, "res", 2],
    ["seahorse", "Seahorse", "seahorse", 0.35, [0xf8a040, 0xf8d080, 0xf8c080], "snout:tube,tail:curl,crest", T, "ins", 3],
    ["octopus", "Octopus", "octopus", 0.6, [0xe8603a, 0xf8a080, 0xf8a080], "arms:8", T, "ins", 3],
    ["squid", "Squid", "octopus", 0.7, [0xf8c8d8, 0xe88aa8, 0xf8d8e0], "fins:head", T, "agi", 3],
    ["jellyfish", "Jellyfish", "jelly", 0.45, [0xc8a8f8, 0xf8b8f0, 0xe0d0f8], "tentacles,glass", T, "cha", 2],
    ["crab", "Crab", "crab", 0.4, [0xe8502a, 0xf8a060, 0xf8c8a0], "claws:big,eyes:stalk", T, "res", 1],
    ["lobster", "Lobster", "crab", 0.55, [0xd83a2a, 0xa82a1a, 0xf08a6a], "claws:big,antennae,tail:fan", T, "pow", 2],
    ["starfish", "Starfish", "star", 0.35, [0xf8802a, 0xf8c040, 0xf8a060], "dots", T, "vit", 1],
    ["shark", "Shark", "fish", 1.2, [0x6a7a8a, 0x4a5a6a, 0xf0f0f0], "fin:tall,teeth", T, "pow", 3],
    ["hammerhead", "Hammerhead", "fish", 1.15, [0x8a909a, 0x6a707a, 0xf0f0f0], "fin:tall,hammer", T, "ins", 4],
    ["manta", "Manta Ray", "ray", 1.1, [0x2a2a3a, 0xf8f8f8, 0xf8f8f8], "horns:cephalic", T, "agi", 3],
    ["whale", "Blue Whale", "fish", 1.6, [0x4a6a9a, 0x3a5a7a, 0xa8b8d0], "grooves", T, "vit", 5],
    ["halffish", "Half Fish", "fish", 0.5, [0x6ab0d8, 0xf8e040, 0xd8f0f8], "legs:fish,fin:fancy", T, "agi", 3],
    // insects and small things
    ["ladybug", "Ladybug", "bug", 0.25, [0xe82a2a, 0x1a1a1a, 0x1a1a1a], "spots,antennae", H, "res", 1],
    ["bee", "Bee", "bug", 0.25, [0xf8d020, 0x1a1a1a, 0xf8d020], "bands,wings:clear,antennae", H, "vel", 1],
    ["butterfly", "Butterfly", "butterfly", 0.35, [0xf8a020, 0x1a1a1a, 0x3a2a1a], "wings:butterfly,antennae", F, "cha", 1],
    ["moth", "Moth", "butterfly", 0.35, [0xd8c8a8, 0x8a7a5a, 0xa89a7a], "wings:moth,antennae:feather", Y, "ins", 1],
    ["dragonfly", "Dragonfly", "bug", 0.35, [0x3ab0d8, 0x2a6a8a, 0x3ab0d8], "wings:long,tail:thin", T, "vel", 2],
    ["beetle", "Beetle", "bug", 0.3, [0x3a8a4a, 0x2a5a3a, 0x3a8a4a], "horn,shell:sheen", F, "pow", 1],
    ["stagbeetle", "Stag Beetle", "bug", 0.4, [0x5a3a2a, 0x3a2a1a, 0x5a3a2a], "mandibles", F, "pow", 2],
    ["firefly", "Firefly", "bug", 0.22, [0x3a3a2a, 0xf8f060, 0xf8f060], "glow:tail,antennae", F, "cha", 2],
    ["snail", "Snail", "snail", 0.3, [0xd8c8a8, 0xc8803a, 0xd8c8a8], "shell:spiral,eyes:stalk", F, "res", 1],
    ["caterpillar", "Caterpillar", "worm", 0.35, [0x6ad84a, 0xf8e040, 0x8ae86a], "segments,antennae", F, "vit", 1],
    ["spider", "Spider", "spider", 0.3, [0x3a2a2a, 0xe83a3a, 0x3a2a2a], "legs:8", Y, "ins", 2],
    ["scorpion", "Scorpion", "crab", 0.4, [0x2a2a2a, 0xa88a4a, 0x3a3a3a], "claws,tail:sting", T, "pow", 3],
    // the garden's rare and legendary animals
    ["unicorn", "Unicorn", "quad", 1.2, [0xf8f8ff, 0xf8c0e0, 0xf8f8ff], "horn:spiral,mane:rainbow,tail:hair,legs:long", Y, "cha", 5],
    ["pegasus", "Pegasus", "quad", 1.25, [0xf8f8ff, 0x9ad0f8, 0xf8f8ff], "mane,tail:hair,wings:feather,legs:long", S, "agi", 5],
    ["phoenix", "Phoenix", "raptor", 0.9, [0xf8602a, 0xf8d040, 0xf8902a], "crest:flame,tail:flame,glow", S, "cha", 6],
    ["dragon", "Dragon", "dragon", 1.3, [0x3ab06a, 0xf8d040, 0xa8e8a0], "horns:back,wings:leather,spines,tail:long", Y, "pow", 6],
    ["skeletondog", "Skeleton Dog", "quad", 0.6, [0xf0f0e8, 0x8a8a80, 0xd8d8d0], "ears:point,tail:bone,bones", Y, "res", 4],
    ["kirin", "Kirin", "quad", 1.3, [0xf8d870, 0x5ac0a0, 0xf8f0c0], "horns:antler,scales,mane:flame,legs:long", Y, "ins", 6],
    ["griffin", "Griffin", "quad", 1.2, [0xd8b070, 0xf8f8f0, 0xf0e0c0], "beak:hook,wings:feather,tail:tuft", S, "pow", 5],
    ["qilin", "Thunder Hare", "hopper", 0.6, [0xf8f070, 0x40a0f0, 0xf8f8d8], "ears:long,glow,tail:bolt", S, "vel", 5],
    ["mechbird", "Mecha Flicky", "bird", 0.45, [0xb8c0cc, 0xe83a3a, 0x8a909a], "beak:short,rivets", C, "vel", 3],
    ["mechpup", "Gear Pup", "quad", 0.5, [0xb8c0cc, 0x40d0f0, 0x8a909a], "ears:point,rivets,tail:antenna", C, "res", 3],
    ["mechcat", "Clockwork Cat", "quad", 0.5, [0xd8a040, 0x8a5a2a, 0xc8903a], "ears:point,rivets,tail:key", C, "ins", 4],
    ["mechbear", "Tin Bear", "quad", 1.0, [0x8a909a, 0xe8c040, 0x6a707a], "ears:round,rivets", C, "pow", 4],
    ["mechfish", "Wind-up Fish", "fish", 0.45, [0xf8c040, 0xd83a2a, 0xf8e080], "rivets,key", C, "agi", 3],
    ["moto", "Motobug", "bug", 0.55, [0xd83a2a, 0x3a3a4a, 0x8a909a], "wheel,antennae,rivets", C, "vel", 4],
    // Eggman's badniks, as the raids on the gardens bring them (Sonic 1's own): beaten, and set right
    ["buzzbomber", "Buzz Bomber", "bug", 0.75, [0x1f78d8, 0x8ac8f8, 0xd8e0e8], "wings,antennae,rivets,bands", C, "agi", 4],
    ["crabmeat", "Crabmeat", "crab", 0.9, [0xe0302a, 0xc8ccd8, 0xf4f4f4], "claws,rivets", C, "pow", 4],
    ["eggwarden", "Egg Warden", "robot", 1.6, [0xd83a2a, 0x8a909a, 0xffd21a], "rivets", C, "pow", 6],
    ["chopper", "Chopper", "fish", 0.7, [0xd83a2a, 0xc8ccd8, 0xf4f4f4], "rivets,teeth,fin:back,round", C, "vel", 4],
  ];
  const ANIMALS = A.map(([id, name, plan, size, cols, feat, region, lean, rarity, classic]) => ({
    id: "an-" + id, kind: "animal", name, plan, size, cols, region, lean, rarity: rarity || 1, classic: !!classic,
    feat: Object.fromEntries(String(feat || "").split(",").filter(Boolean).map(f => { const [k, v] = f.split(":"); return [k, v == null ? true : v]; })),
    text: "", how: classic ? "Freed from one of Eggman's badniks out in the zones: each one freed counts toward an egg." : "",
  }));
  for (const a of ANIMALS) if (["an-moto", "an-buzzbomber", "an-crabmeat", "an-chopper"].includes(a.id)) { a.badnik = true; a.how = "One of Eggman's badniks, beaten in the raids on the gardens and set right by Doctor Nell Voss."; }
  { const w = ANIMALS.find(a => a.id === "an-eggwarden"); w.badnik = true; w.boss = true; w.how = "Eggman's robot, left to steal the Chaos Heart. Beaten at his outpost on the north-west of the island; never kept."; }

  /* ---------------------------------------------------------------- techniques
     What a creature can do in a fight: a kind (strike, special, guard, support, team), the
     attribute it draws on, its cost in Chaos Energy, and what it does. A creature learns from
     its species' leaning, its training, its temperament and its parents. */
  const TECHS = [
    // strikes (Power or Velocity)
    { id: "tackle", name: "Tackle", kind: "strike", attr: "pow", pow: 30, cost: 0, text: "A running bump." },
    { id: "spinattack", name: "Spin Attack", kind: "strike", attr: "vel", pow: 34, cost: 0, fast: 1, text: "Curl and roll into it -- quick." },
    { id: "pounce", name: "Pounce", kind: "strike", attr: "agi", pow: 32, cost: 0, text: "Leap from out of reach." },
    { id: "headbutt", name: "Headbutt", kind: "strike", attr: "pow", pow: 44, cost: 1, knock: 1, text: "Heavy, and knocks it back a row." },
    { id: "flurry", name: "Flurry", kind: "strike", attr: "vel", pow: 14, hits: 3, cost: 1, text: "Three quick swipes." },
    { id: "slam", name: "Body Slam", kind: "strike", attr: "pow", pow: 56, cost: 2, slow: 1, text: "Everything into one blow; slow to recover." },
    { id: "dashstrike", name: "Dash Strike", kind: "strike", attr: "vel", pow: 40, cost: 1, first: 1, text: "Always goes first." },
    { id: "diveattack", name: "Dive Attack", kind: "strike", attr: "agi", pow: 42, cost: 1, air: 1, text: "From above: hard to guard." },
    { id: "crush", name: "Guard Crush", kind: "strike", attr: "pow", pow: 30, cost: 1, breakGuard: 1, text: "Breaks a guard and the guard's bonus." },
    // specials (Chaos)
    { id: "chaosspear", name: "Chaos Spark", kind: "special", attr: "cha", pow: 40, cost: 2, text: "A bolt of Chaos Energy." },
    { id: "bubbleburst", name: "Bubble Burst", kind: "special", attr: "cha", pow: 34, cost: 2, splash: 1, text: "Bubbles that hit everyone on the other side a little." },
    { id: "leafstorm", name: "Leaf Whirl", kind: "special", attr: "cha", pow: 36, cost: 2, splash: 1, text: "A whirl of leaves over the other side." },
    { id: "gearshot", name: "Gear Shot", kind: "special", attr: "ins", pow: 38, cost: 2, sure: 1, text: "Never misses." },
    { id: "nova", name: "Nova", kind: "special", attr: "cha", pow: 70, cost: 4, text: "All the energy it has, at once." },
    { id: "drain", name: "Siphon", kind: "special", attr: "cha", pow: 26, cost: 2, drain: 0.5, text: "Takes back half of what it deals." },
    { id: "dazzle", name: "Dazzle", kind: "special", attr: "cha", pow: 10, cost: 1, status: "dazed", text: "Leaves it dazed: its next move may miss." },
    // guards and counters (Resilience, Instinct)
    { id: "guard", name: "Guard", kind: "guard", attr: "res", cost: 0, guard: 0.5, text: "Halves the next blow." },
    { id: "shell", name: "Shell Up", kind: "guard", attr: "res", cost: 1, guard: 0.85, text: "Almost nothing gets through, this turn." },
    { id: "counter", name: "Counter", kind: "guard", attr: "ins", cost: 1, counter: 1, text: "If struck this turn, strikes back harder." },
    { id: "sidestep", name: "Sidestep", kind: "guard", attr: "agi", cost: 0, dodge: 0.6, text: "A good chance to dodge entirely." },
    // support (team)
    { id: "cheer", name: "Cheer", kind: "support", attr: "cha", cost: 1, buff: "pow", text: "Its allies hit harder for a while." },
    { id: "rally", name: "Rally", kind: "support", attr: "vit", cost: 2, heal: 0.25, team: 1, text: "Everyone on its side recovers a quarter." },
    { id: "soothe", name: "Soothe", kind: "support", attr: "vit", cost: 1, heal: 0.4, text: "One ally recovers a lot." },
    { id: "focus", name: "Focus", kind: "support", attr: "ins", cost: 0, energy: 2, text: "Gathers Chaos Energy." },
    { id: "taunt", name: "Taunt", kind: "support", attr: "ins", cost: 0, taunt: 1, text: "Draws the other side's blows to itself." },
    { id: "cover", name: "Cover", kind: "support", attr: "res", cost: 1, cover: 1, text: "Takes the next blow meant for an ally." },
    // the team techniques: two (or three) together, when their kinds fit
    { id: "duo-spin", name: "Twin Spin", kind: "team", attr: "vel", pow: 46, cost: 2, need: 2, text: "Two spin into it together." },
    { id: "duo-tower", name: "Chao Tower", kind: "team", attr: "pow", pow: 60, cost: 3, need: 2, text: "One throws the other." },
    { id: "trio-storm", name: "Garden Storm", kind: "team", attr: "cha", pow: 90, cost: 5, need: 3, text: "All three at once." },
    // the dojos' own: taught by their masters, to one who has passed the trial
    { id: "oak-crush", name: "Oakheart Crush", kind: "strike", attr: "pow", pow: 64, cost: 2, breakGuard: 1, knock: 1, dojo: 1, text: "The Oakheart Dojo's blow: through any guard, and back a row." },
    { id: "summit-rush", name: "Summit Rush", kind: "strike", attr: "vel", pow: 26, hits: 3, cost: 2, first: 1, dojo: 1, text: "The Summit Dojo's charge: first in, three blows." },
    { id: "circuit-pulse", name: "Circuit Pulse", kind: "special", attr: "cha", pow: 50, cost: 3, sure: 1, splash: 1, dojo: 1, text: "The Circuit Dojo's program: never misses, and reaches all of them." },
  ];

  /* ---------------------------------------------------------------- care: food and toys */
  const FOODS = [
    { id: "round", name: "Round Fruit", c: 0xf8a040, feed: 30, mood: 4, pull: {}, from: "trees", text: "The garden's everyday fruit." },
    { id: "triangle", name: "Triangle Fruit", c: 0xf0e040, feed: 28, mood: 3, pull: { vel: 2 }, from: "trees", text: "A little extra spring." },
    { id: "square", name: "Square Fruit", c: 0x8ad050, feed: 28, mood: 3, pull: { res: 2 }, from: "trees", text: "Dense; filling." },
    { id: "heart", name: "Heart Fruit", c: 0xf87aa0, feed: 22, mood: 10, love: 4, from: "shop", text: "Brings Chao together: good before breeding." },
    { id: "chaosdrive-g", name: "Green Drive", c: 0x5ae05a, feed: 6, mood: 4, gain: { vel: 8 }, from: "badniks", text: "Chaos Energy from a beaten badnik: Velocity." },
    { id: "chaosdrive-p", name: "Purple Drive", c: 0xb070f0, feed: 6, mood: 4, gain: { agi: 8 }, from: "badniks", text: "Chaos Energy: Agility." },
    { id: "chaosdrive-r", name: "Red Drive", c: 0xf05a3a, feed: 6, mood: 4, gain: { pow: 8 }, from: "badniks", text: "Chaos Energy: Power." },
    { id: "chaosdrive-y", name: "Yellow Drive", c: 0xf0d040, feed: 6, mood: 4, gain: { vit: 8 }, from: "badniks", text: "Chaos Energy: Vitality." },
    { id: "berry", name: "Wild Berry", c: 0x9a4ad0, feed: 14, mood: 6, pull: { ins: 2 }, from: "bushes", text: "Animals love these." },
    { id: "nut", name: "Nut", c: 0xa87a4a, feed: 16, mood: 4, pull: { pow: 1, res: 1 }, from: "bushes", text: "For the squirrels, and anyone else." },
    { id: "fish", name: "Little Fish", c: 0x9ab0c8, feed: 26, mood: 6, from: "fishing", text: "The sea animals' favourite." },
    { id: "candy", name: "Candy", c: 0xf8b0d8, feed: 8, mood: 14, sweet: 1, from: "shop", text: "A treat: everyone's happy, nobody's fed." },
    { id: "mushroom", name: "Forest Mushroom", c: 0xe85a4a, feed: 18, mood: 2, pull: { cha: 2 }, from: "forest", text: "Odd things happen to Chao that eat a lot of these." },
  ];
  const TOYS = [
    { id: "ball", name: "Ball", c: 0xf05a5a, play: "ball", text: "To chase, kick and fight over." },
    { id: "duck", name: "Rubber Duck", c: 0xf8e040, play: "water", text: "For the pond." },
    { id: "trumpet", name: "Toy Trumpet", c: 0xf0c040, play: "music", text: "Loud." },
    { id: "box", name: "Jack-in-the-Box", c: 0x5a9af0, play: "surprise", text: "Every time a surprise." },
    { id: "car", name: "Toy Car", c: 0x5ad06a, play: "push", text: "Push it round the garden." },
    { id: "kite", name: "Kite", c: 0xf87aa0, play: "fly", text: "The fliers' favourite." },
  ];

  /* ---------------------------------------------------------------- the garden's regions */
  const REGIONS = {
    central:  { name: "Central Garden", text: "Grass, flowers, the pond and the fountain: where everyone meets." },
    tropical: { name: "Tropical Garden", text: "Beaches, palms and a waterfall." },
    mountain: { name: "Mountain Garden", text: "Cliffs, caves and the high meadows." },
    forest:   { name: "Forest Garden", text: "Great trees and mushroom glades." },
    mystic:   { name: "Mystic Garden", text: "Ruins older than anyone remembers." },
    mech:     { name: "Mechanical Garden", text: "Machines, labs and moving platforms." },
    sky:      { name: "Sky Garden", text: "Floating islands over the clouds." },
  };

  const BY = {};
  for (const s of CHAO) BY[s.id] = s;
  for (const s of ANIMALS) BY[s.id] = s;
  /* ---------------------------------------------------------------- how each animal lives
     Its real habits, by body plan and then by species: gait (how it moves: knuckle = on all
     fours with the arms as front legs, strut = a ground bird's head-bobbing walk, waddle,
     hop...), slow, hover; fly (how often it takes to the air: 0 never), night (out at night,
     asleep by day), herd (keeps near its own kind), graze (stops to crop the grass), likes (the
     place it goes to: water, shore, trees, flowers, high), swim, wade (stands in the shallows),
     perch (rests up in a tree), sentinel (stands up straight to keep watch), sideways (a crab). */
  const HABIT_PLAN = {
    primate: { gait: "knuckle", likes: "trees" }, ape: { gait: "knuckle" }, upright: { gait: "knuckle", sentinel: 1 }, climber: { gait: "knuckle", slow: 0.35, likes: "trees" },
    bird: { fly: 1, perch: 1 }, raptor: { fly: 1.8, perch: 1 }, owl: { fly: 1, perch: 1, night: 1 }, wader: { gait: "strut", fly: 0.6, likes: "shore", wade: 1, slow: 0.6 },
    waterfowl: { gait: "waddle", fly: 0.45, likes: "water", swim: 1 }, penguin: { gait: "waddle", fly: 0, likes: "water", swim: 1 }, ratite: { fly: 0 }, bat: { fly: 1.6, night: 1 },
    seal: { likes: "water", swim: 1 }, turtle: { likes: "shore" }, frog: { likes: "shore" }, croc: { likes: "water", swim: 1, slow: 0.7 }, lizard: { likes: "sun" },
    crab: { sideways: 1, likes: "shore" }, butterfly: { likes: "flowers" }, glider: { likes: "trees", night: 1 }, woolly: { herd: 1, graze: 1 }, worm: { likes: "flowers" }, snail: { likes: "shade" },
  };
  const GROUND_FOWL = ["cucky", "chicken", "chick", "rooster", "turkey", "pheasant", "quail", "peacock", "roadrunner"];
  const HERDS = ["deer", "fawn", "reindeer", "moose", "elk", "goat", "ibex", "llama", "camel", "horse", "pony", "zebra", "donkey", "cow", "bull", "buffalo", "elephant", "giraffe", "okapi", "boar", "warthog", "unicorn", "pegasus", "kirin"];
  const NIGHT = ["raccoon", "hedgehog", "mouse", "hamster", "skunk", "badger", "mole", "porcupine", "armadillo", "firefly", "kiwi", "slowloris", "tarsier", "blackcat", "panther", "lynx", "wolf", "fox", "arcticfox", "fennec", "moth"];
  const WATERY = { hippo: { likes: "water", swim: 1, slow: 0.7 }, beaver: { likes: "water", swim: 1 }, platypus: { likes: "water", swim: 1 }, polarbear: { likes: "water", swim: 1 }, tapir: { likes: "water", swim: 1 }, moose: { likes: "water" }, elephant: { likes: "water" }, tiger: { likes: "water", swim: 1 }, dragonfly: { likes: "water" }, kingfisher: { likes: "water" }, seagull: { likes: "water", fly: 1.8 }, albatross: { likes: "water", fly: 2.2 }, pelican: { likes: "water", swim: 1, fly: 1.2 }, flamingo: { likes: "water" } };
  const HABIT_SP = {
    hummingbird: { gait: "fly", hover: 0.9, likes: "flowers" }, bee: { likes: "flowers" }, roadrunner: { gait: "biped", fly: 0.1 }, tarsier: { gait: "hop", night: 1, likes: "trees" }, slowloris: { gait: "knuckle", slow: 0.3, night: 1, likes: "trees" },
    lobster: { sideways: 0, likes: "water" }, scorpion: { sideways: 0, night: 1, likes: "sun" }, kiwi: { gait: "waddle", fly: 0 }, dodo: { gait: "waddle", fly: 0 }, cat: { likes: "sun" }, tabby: { likes: "sun" }, cheetah: { likes: "sun" }, lion: { likes: "sun", herd: 1 },
    meerkat: { herd: 1, likes: "sun" }, prairiedog: { herd: 1 }, goat: { likes: "high" }, ibex: { likes: "high" }, snowleopard: { likes: "high" }, eagle: { likes: "high" }, condor: { likes: "high" }, squirrel: { likes: "trees" }, chipmunk: { likes: "trees" }, koala: { likes: "trees" }, sloth: { likes: "trees", slow: 0.25 },
  };
  function habitsOf(sp) {
    if (!sp || sp.kind !== "animal") return {};
    const id = sp.id.slice(3), h = Object.assign({}, HABIT_PLAN[sp.plan] || {});
    if (GROUND_FOWL.includes(id)) Object.assign(h, { gait: "strut", fly: 0.15, perch: 0 });
    if (HERDS.includes(id)) Object.assign(h, { herd: 1, graze: 1 });
    if (NIGHT.includes(id)) h.night = 1;
    if (WATERY[id]) Object.assign(h, WATERY[id]);
    if (HABIT_SP[id]) Object.assign(h, HABIT_SP[id]);
    if (sp.feat && sp.feat.flightless) h.fly = 0;
    return h;
  }

  /* ---------------------------------------------------------------- the keeper's decor
     Things to set out in a garden of your own (Pip sells them; the story gives the last). use:
     what a creature does at it -- sleep in it, sit by it, train on it, splash in it, dance to it
     -- and attr, what that trains; mood, align: what being near it does; solid: in the way. */
  const DECOR = [
    { id: "nest", name: "Nest bed", price: 150, use: "sleep", text: "A round bed of straw with a blanket in it. A creature asleep in it wakes rested in half the time." },
    { id: "feeder", name: "Fruit feeder", price: 300, solid: 0.5, text: "It fills itself in the night: three fruit drop out of it every morning." },
    { id: "perch", name: "Perch tower", price: 220, use: "train", attr: "agi", solid: 0.4, text: "A tall post with a ladder and a platform to leap from. Agility, for climbers and fliers." },
    { id: "dummy", name: "Sparring dummy", price: 200, use: "train", attr: "pow", solid: 0.45, text: "A straw dummy on a post that wobbles back. Power." },
    { id: "lamp", name: "Chaos lamp", price: 260, use: "sit", attr: "cha", solid: 0.3, text: "A lamp burning Chaos Energy, bright all night. Chaos, for whoever sits by it." },
    { id: "splash", name: "Paddling pool", price: 320, use: "splash", attr: "res", mood: 1, text: "Shallow and splashy. Resilience, and a great deal of fun." },
    { id: "flowers", name: "Flower bed", price: 120, use: "sit", mood: 1, align: "wild", text: "Flowers to sit among: a better mood, and a lean to the Wild." },
    { id: "bench", name: "Bench", price: 90, use: "sit", attr: "vit", text: "A seat in the sun. Vitality, slowly." },
    { id: "musicbox", name: "Music box", price: 300, use: "dance", attr: "cha", mood: 1, solid: 0.35, text: "It winds itself, and the Chao dance to it." },
    { id: "toybox", name: "Toy chest", price: 400, solid: 0.55, text: "Every morning there's a new toy beside it." },
    { id: "warmer", name: "Egg warmer", price: 350, text: "An incubator for any garden: an egg set on it hatches twice as fast." },
    { id: "lantern", name: "Paper lantern", price: 60, solid: 0.2, text: "Just pretty, and lit at night." },
    { id: "arch", name: "Flower arch", price: 160, mood: 0.5, text: "Walking under it puts anyone in a better mood." },
    { id: "statue", name: "Chao statue", price: 500, align: "hero", solid: 0.6, text: "A hero's statue, halo and all: the Chao who stop by it lean a little to the Hero." },
    { id: "fence", name: "Picket fence", price: 30, solid: 0.15, wide: 1.2, text: "A length of fence, to mark out a garden of your own." },
    { id: "shrine", name: "Chaos Heart shrine", price: 0, use: "sit", attr: "cha", mood: 1, bless: 1, solid: 0.9, story: 1, text: "The Chaos Heart's light, kept: every creature in its garden grows a little happier, and a little stronger, near it." },
  ];

  root.ChaoData = {
    DECOR, decor: id => DECOR.find(d => d.id === id), habits: sp => habitsOf(typeof sp === "string" ? BY[sp] : sp),
    ATTRS, TEMPERS, TEMPER_KEYS, ALIGNS, ALIGN_KEYS, PATHS, PATH_KEYS, CHAO, ANIMALS, TECHS, FOODS, TOYS, REGIONS,
    species: id => BY[id], chao: id => BY[id] && BY[id].kind === "chao" ? BY[id] : null, animal: id => BY[id] && BY[id].kind === "animal" ? BY[id] : null,
    tech: id => TECHS.find(t => t.id === id), food: id => FOODS.find(f => f.id === id), toy: id => TOYS.find(t => t.id === id),
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
