/*
 * Red Ring Circuit (Sonic & Friends) -- a fan-made Sonic platformer and fighter in voxels.
 * It began as an arcade cabinet in the hall of Post Parade (github.com/Mikale4/post-parade),
 * "Post Parade Adventure 2", and became a game of its own on 2026-11-17.
 *
 * A side-on platformer in voxels (voxkit.js: the sparse grid and AO mesher Post Parade's race
 * is built with), seen from the side. Its runners are fourteen, each in their own 2D sprites in Sonic Battle's style: Sonic,
 * Tails, Knuckles, Amy, Rouge, Shadow, Cream, Chaos and Chaos Gamma from SEGA's Sonic Battle
 * (Game Boy Advance, 2003), ripped by QuadFactor (The Spriters Resource); Dr. Eggman, Metal
 * Sonic, Mighty and Silver drawn in its style by TheKnucklesMainG4 (DeviantArt).
 * Emerl, the fourteenth, fights with the moves he has copied off the others (adventure-emerl.js,
 * tools/pack-emerl.py): Sonic Battle's sheets of him, re-ripped by Dinoshi 64 (some rips by Mr. C).
 * adventure-sprites.js holds the frames, tools/pack-sonic-battle.py cuts them. Thirteen stages
 * run left to right to a winning post, each one runner's own ground, as Sonic Battle gives each
 * fighter a home arena -- Sonic's clifftops over the sea, Tails' workshop and airstrip, Amy's
 * home seen from the floor up, Knuckles' shrines up a snowy mountain, Rouge's club and the
 * casino street, Shadow's road out of the city at sundown, Cream's natural history hall,
 * Chaos's springs under the old shrine, Mighty's canyon, Silver's burning city two hundred
 * years on, Gamma's storage depot in Eggman's hideout, Metal Sonic's racecourse among the
 * stars, and last Eggman's own station in orbit -- each long and tall the way the Genesis and
 * Game Boy Advance acts are, with a low road, a high one and the sky over both. In them are
 * Eggman's badniks, in their own sprites -- from Sonic Advance 1, 2 and 3 in the first six,
 * TheKnucklesMainG4's Modern Sonic Badniks in the rest (adventure-badniks.js;
 * tools/pack-badniks.py cuts them) -- each doing what it does in its own game.
 *
 * The fighting is Sonic Battle's, every move off the runner's own sheet. That game puts its
 * attacks on B and its specials on R; here they are three buttons:
 *   Space       jump; again in the air, the runner's air action
 *   Z           light attack: the sheet's 1st, 2nd and 3rd attacks, a combo, and the heavy
 *   X           heavy attack (a smash, in a battle); Up + X the upper attack, a launcher;
 *               Down + X the aim attack, a dash at the nearest thing and a blow -- or, with a
 *               rival in the air, after them (the chase); on one knocked down, the OTG;
 *               dashing, the dash attack; in the air, the air attack
 * A battle's fighting runs on combos, as the fighting games' do (Dragon Ball FighterZ, Marvel
 * vs. Capcom 3): each blow lands on the frames its sprite's fist or foot is out, presses wait
 * for their moment, and a blow that lands goes straight into the next -- jabs into the heavy,
 * the launcher, a special; the launcher into a super jump (Space) and air attacks, everyone
 * falling slowly while they land; then the chase. Smashes bounce off walls, the chase off the
 * floor; one knocked down is picked up by an OTG; once each a combo, and each hit of a long one
 * does less. A smash freezes the picture, slows the world a moment and (one on one) the camera leans in.
 * Down tapped is Sonic Battle's guard, each fighter's own; just as a blow lands, a parry -- the
 * attacker reels (Attack blocked), open to a counter. Z + X with the burst gauge full is Guilty
 * Gear's Psych Burst: blue out of a combo (it throws everyone off), gold otherwise (it hits).
 * Every hurt has its own frames off the sheets: knocked upward, knocked back, hitting a wall,
 * hitting the ground, getting up; and the guard and healing their own. A KO'd fighter tumbles,
 * lies on the ground, flickers and is gone.
 * Training holds the TUTORIAL (tutorialStart): twenty-three lessons played for real on a dummy,
 * a card over the fight teaching one thing at a time in your own keys, KNOCK//BACK's way.
 *   C           special: the shot; Up + C the power; Down + C the trap, and again to set it
 *               off. In the air each is its air version. (Sonic Battle has the player slot
 *               one special for the ground and one for the air before a match; here all
 *               three are always to hand.)
 *   a double tap of a direction: the dash, each runner's own. Down: crouch (the landing
 *   frames). Down + Space: a Spin Dash for everyone but Rouge (for her it does nothing), or
 *   a drop through a plank.
 *   Only Sonic's sheet has a Spin Dash; the others spin his, in their own colours.
 * The moving is their platformers': everyone sinks in deep water and needs air, as in the
 * classic games (Tails alone swims, by flying).
 *   Sonic     the fastest feet; Spin Dash (Sonic 2). In the
 *             air, Sonic Ballet: a second jump that homes on anything near, curled, as the
 *             Homing Attack does (Sonic Adventure).
 *   Tails     flies (Sonic 2 & 3): Space again in the air, tapped to climb, until he tires
 *             after about five seconds; under water the same stroke swims. Spin Dash.
 *   Knuckles  the slowest and lowest jumper, the hardest hitter. Space again in the air,
 *             held, glides; a glide into a wall grabs it, and Up and Down climb (Sonic &
 *             Knuckles), over the top when it ends. Spin Dash. Sonic Battle draws no climb, so
 *             his grab, cling, climb and pull-up are Sonic Advance's (ripped by AsuharaMoon),
 *             in his Sonic Battle colours.
 *   Amy       her Piko Piko Hammer is in her heavy, upper and air attacks, and Up + X
 *             swings her into a Hammer Jump (Sonic Advance). Double Jump. Spin Dash.
 *   Rouge     flies on her wings for a short while, then glides down slowly; Down lets go
 *             (Rouge Catch). Kicks, and Spiral Dive drills down through rock.
 *   Shadow    the fastest in Sonic Battle, skating on his Air Shoes; Chaos Control: Space in
 *             the air teleports him ahead, twice a jump, drifting down. Z in the air is his
 *             Homing Attack. Spin Dash; Chaos Spear (his shot) and Chaos Burst.
 *   Cream     the highest jump; flies on her ears (Space again in the air, tapped), and Cheese
 *             the Chao does her fighting, in every blow and special. Spin Dash.
 *   Chaos     water itself: swims, a stroke for each Space, and never needs air; a double tap
 *             melts him into Chaos Dive, nothing touching him; Chaos Flight, a little more height.
 *   Gamma     walks slowly; a double tap is Drive Mode, fast and steerable while held; Flight
 *             Mode in the air, sinking slowly; Devastator charges while C is held; Meltdown
 *             (Up + C) costs him a heart.
 *   Eggman    his Egg Mobile hovers off the ground; in the air its boosters fly him (tap to
 *             climb, a while), then it glides down. The Death Egg Cannon, missiles, bombs.
 *   Metal     the fastest after Shadow; his jet in the air, a burst ahead and a hover; the
 *             Black Shield (Up + C) lets nothing through. Spin Dash.
 *   Mighty    Shell Launch, straight up, and a wall jump off any wall (Knuckles' Chaotix);
 *             curled, spikes can't hurt him; Hammer Drop (Up + C in the air) breaks rock and
 *             sends a shockwave both ways (Sonic Mania Plus). Spin Dash.
 *   Silver    the Air Psycho Dash: ahead, a hover, then Space held floats him down; Psycho
 *             Knife, Surge and Orb. Spin Dash.
 *
 * The main menu (after the title) has six: Story, Free Exhibition, Battle, Training, Options
 * and Exit.
 *   Story     The Golden Horseshoes (adventure-story.js): twenty chapters, each a scene of talk
 *             between the cast in their Sonic Battle portraits, then a stage to run or a battle
 *             to win as one of them, then the talk after, on thirteen stages of its own.
 *   Free Exhibition  any runner on any stage opened: the thirteen stages, run for time, carrots,
 *             grades and the Golden Horseshoes (clearing one opens the next).
 *   Battle    Sonic Battle's fights with health: up to four fighters, players or CPUs (Easy,
 *             Normal, Hard), everyone for themselves or Red against Blue, in any runner's
 *             arena; a KO match or Survival, a time limit. Down guards, and held still heals.
 *             Two players share the keyboard (Options sets their keys) or a pad each.
 *   Training  The Tutorial (lessons played for real, one at a time, see tutorialStart), and Free
 *             Training: the same fight on a dummy that stands, guards, walks, jumps or fights back.
 *   Options   Music, sound, dialogue speed and screen shake (the game's own settings), and the
 *             two players' keys.
 *
 * Stages are drawn as text in adventure-stages.js (tools/genstages.py draws them): a grid of
 * one-metre tiles 32 rows tall, read left to right. The legend is there. Clearing a stage opens the next; each hides three
 * Golden Horseshoes. Best times, grades and horseshoes are kept per trainer; first clears
 * and first finds pay carrots into the stable.
 *
 *   Adventure.open(el, { onExit })   -- builds the cabinet's screens in `el` and runs
 *   Adventure.close()
 */
(function (root) {
  "use strict";
  const THREE = root.THREE, V = root.Voxel;
  if (!THREE || !V || !V.ok || !V.kit) { root.Adventure = { ok: false }; return; }
  const { Vox, meshVox, mulC, mixC, mulberry32 } = V.kit;
  const PI = Math.PI;
  const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
  const lerp = (a, b, k) => a + (b - a) * k;
  const sgn = v => v < 0 ? -1 : v > 0 ? 1 : 0;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ico = (n, s) => (root.Icon ? root.Icon(n, s) : "");
  const LOW_POWER = !!(root.matchMedia && matchMedia("(pointer:coarse)").matches) || (navigator.hardwareConcurrency || 8) <= 4;
  const TOUCH = !!(root.matchMedia && matchMedia("(pointer:coarse)").matches);

  // ---------------------------------------------------------------- the six
  /* Speeds in metres a second, gravity 34 m/s^2: a 12.4 jump clears two metres; a spring
     throws anyone about six and a half. Run speeds follow Sonic Battle's ratings (Shadow 8,
     Sonic 7, Tails and Amy 6, Rouge 5, Knuckles 3, of 9); every jump still clears two
     metres, the stages' rule. A jump out of a Spin Dash or a roll stays a ball and hurts what
     it touches; any other jump is the runner's own jumping frames. */
  const CAST = [
    { id: "sonic", name: "Sonic", w: 0.56, h: 1.02, run: 14.6, accel: 22, airAccel: 14, jump: 12.4,
      spinDash: true, air: "ballet", from: "Sonic the Hedgehog",
      moves: "Spin Dash · Sonic Ballet",
      grades: { Speed: "S", Jump: "B", Air: "B", Power: "B" },
      text: "The fastest feet. Down + Space revs a Spin Dash; jump out of it as a ball. In the air, Sonic Ballet homes on anything near." },
    { id: "tails", name: "Tails", w: 0.56, h: 0.96, run: 13.6, accel: 19, airAccel: 14, jump: 12.1,
      spinDash: true, air: "fly", flyTime: 5, from: "Miles \"Tails\" Prower",
      moves: "Flight · Energy Ball",
      grades: { Speed: "A", Jump: "C", Air: "S", Power: "C" },
      text: "Space again in the air to fly, tapping to climb, until he tires; under water he swims. Energy Ball, and a Big Hand." },
    { id: "knuckles", name: "Knuckles", w: 0.62, h: 1.06, run: 11.6, accel: 16, airAccel: 11, jump: 12.0,
      spinDash: true, air: "glide", climb: true, from: "Knuckles the Echidna",
      moves: "Glide · Climb",
      grades: { Speed: "C", Jump: "C", Air: "A", Power: "S" },
      text: "Hold Space in the air to glide; glide into a wall to grab it, then climb with Up and Down. Slow, and hits the hardest." },
    { id: "amy", name: "Amy", w: 0.54, h: 1.0, run: 13.6, accel: 20, airAccel: 13, jump: 12.1,
      spinDash: true, air: "double", from: "Amy Rose",
      moves: "Piko Piko Hammer",
      grades: { Speed: "A", Jump: "B", Air: "B", Power: "A" },
      text: "A Double Jump, a Spin Dash, and her Piko Piko Hammer: Up + X swings her into a Hammer Jump. The quickest fists of the six." },
    { id: "rouge", name: "Rouge", w: 0.56, h: 1.14, run: 12.9, accel: 18, airAccel: 15, jump: 12.4,
      air: "fly", flyTime: 3, glides: true, from: "Rouge the Bat",
      moves: "Flight · Spiral Dive",
      grades: { Speed: "B", Jump: "B", Air: "A", Power: "B" },
      text: "Space again in the air to fly a while, then she glides down; Down lets go. Up + C in the air: Spiral Dive, down through rock." },
    { id: "shadow", name: "Shadow", w: 0.56, h: 1.06, run: 15.4, accel: 24, airAccel: 15, jump: 12.8,
      spinDash: true, air: "teleport", from: "Shadow the Hedgehog",
      moves: "Chaos Control",
      grades: { Speed: "S", Jump: "A", Air: "A", Power: "A" },
      text: "Chaos Control: Space in the air teleports him ahead, twice a jump. Z in the air is a Homing Attack; C a Chaos Spear." },
    /* The second seven. Cream, Chaos and Chaos Gamma are Sonic Battle's own; Eggman, Metal
       Sonic, Mighty and Silver are drawn in its style by TheKnucklesMainG4. Their moves are
       the ones their sheets and Sonic Battle give them; their moving is their own games'. */
    { id: "cream", name: "Cream", w: 0.54, h: 0.98, run: 12.3, accel: 19, airAccel: 15, jump: 13.2,
      spinDash: true, air: "fly", flyTime: 4, flyK: 0.7, from: "Cream the Rabbit",
      moves: "Flight · Cheese the Chao",
      grades: { Speed: "C", Jump: "S", Air: "S", Power: "C" },
      text: "The highest jump. Space again in the air: she flies on her ears, tapping to climb. Cheese the Chao does her fighting." },
    { id: "chaos", name: "Chaos", w: 0.6, h: 1.12, run: 10.6, accel: 15, airAccel: 11, jump: 12.0,
      air: "float", swims: true, dashK: 1.55, dashT: 0.5, dashInv: true, from: "Chaos (Chaos 0)",
      moves: "Chaos Dive · swims",
      grades: { Speed: "C", Jump: "C", Air: "C", Power: "B" },
      text: "Water itself: he swims, Space for each stroke, and never runs out of air. A double tap melts him into Chaos Dive, untouchable." },
    { id: "gamma", name: "Chaos Gamma", w: 0.66, h: 1.2, run: 10.8, accel: 14, airAccel: 10, jump: 12.2,
      air: "hover", flyTime: 2.4, sink: 1.2, flyK: 1.25, dashK: 1.7, dashT: 0.75, steer: true, from: "Chaos Gamma",
      moves: "Drive Mode · Flight Mode",
      grades: { Speed: "C", Jump: "B", Air: "A", Power: "S" },
      text: "Walks slowly; a double tap is Drive Mode, fast and steerable. Space in the air: Flight Mode. Hold C to charge Devastator." },
    /* the Egg Mobile is a hovercraft: it floats `lift` metres off the ground, bobbing, its
       shadow on the floor under it (his body is that much taller to things over him) */
    { id: "eggman", name: "Dr. Eggman", w: 0.92, h: 1.6, lift: 0.42, run: 12.5, accel: 17, airAccel: 13, jump: 12.4,
      air: "fly", flyTime: 2.8, glides: true, flyK: 0.9, from: "Dr. Ivo \"Eggman\" Robotnik",
      moves: "Egg Mobile Flight · Death Egg Cannon",
      grades: { Speed: "B", Jump: "B", Air: "A", Power: "A" },
      text: "In his Egg Mobile. Space again in the air fires its boosters: tap to climb, a while, then it glides down; Down lets go. Missiles, bombs and a cannon." },
    { id: "metal", name: "Metal Sonic", w: 0.56, h: 1.04, run: 15.0, accel: 23, airAccel: 15, jump: 12.4,
      spinDash: true, air: "jet", dashK: 1.4, from: "Metal Sonic",
      moves: "Spin Dash · Jet",
      grades: { Speed: "S", Jump: "B", Air: "A", Power: "A" },
      text: "Built to outrun Sonic. Space in the air fires his jet: a burst ahead and a moment's hover. Up + C raises the Black Shield." },
    { id: "mighty", name: "Mighty", w: 0.58, h: 1.04, run: 13.6, accel: 20, airAccel: 13, jump: 12.2,
      spinDash: true, air: "launch", from: "Mighty the Armadillo",
      moves: "Shell Launch · Hammer Drop",
      grades: { Speed: "A", Jump: "B", Air: "B", Power: "S" },
      text: "Space in the air: Shell Launch, straight up; against a wall, a wall jump. Curled, spikes can't hurt him. Up + C in the air: Hammer Drop." },
    /* Emerl, Sonic Battle's Gizoid: he copies what he sees. His move set is his own until he wins
       fights, and every win teaches him one move of someone else's -- one of eight he has seen, at
       random, never one he knows -- which he can then use in its slot in place of his own
       (Emerl's Skills). What his CAST entry says is his own, before he has learned anything. */
    { id: "emerl", name: "Emerl", w: 0.56, h: 1.04, run: 12.6, accel: 18, airAccel: 13, jump: 12.2,
      air: "double", from: "Emerl (Gizoid)",
      moves: "Copies the moves he wins",
      grades: { Speed: "B", Jump: "B", Air: "B", Power: "B" },
      text: "A Gizoid that copies what it sees. Each battle he wins teaches him one move of someone else's; set them in Emerl's Skills." },
    { id: "silver", name: "Silver", w: 0.58, h: 1.12, run: 13.9, accel: 21, airAccel: 15, jump: 12.2,
      spinDash: true, air: "psy", from: "Silver the Hedgehog",
      moves: "Psychokinesis",
      grades: { Speed: "A", Jump: "B", Air: "A", Power: "A" },
      text: "Space in the air: an Air Psycho Dash ahead, a hover, then hold Space to float down. Psycho Knife, Psycho Surge, Psycho Orb." },
  ];
  const castOf = id => CAST.find(c => c.id === id) || CAST[0];
  /** which runner a move of p's comes from: their own, or for Emerl whose he copied in that slot */
  const srcOf = (p, slot) => (p.c.emerl && p.c.emerl[SLOT_OF[slot] || slot]) || p.c.id;
  const SLOT_OF = { idle: "pose", run: "run", skid: "run", start: "run", dash: "dash", jump: "jump", fall: "jump", land: "jump", seek: "aim" };

  /* The attacks, per runner, by the sheet's own rows: fps, and how far in front the blow
     reaches (metres). The blow lands in the middle of the animation; `step` is how far it
     carries the runner forward (m/s). Knuckles is slow and Amy quick, as Sonic Battle has
     them; Tails' Magic Hook and Amy's Girl Crush reach the furthest. */
  const BLOWS = {
    base:     { atk1: [22, 0.7, 2], atk2: [22, 0.75, 2.4], atk3: [20, 0.9, 3.4], heavy: [24, 1.15, 3.5], upper: [20, 0.85, 1.2],
                dashatk: [20, 1.0, 0], airatk: [20, 0.9, 0], aim: [22, 1.0, 2] },
    tails:    { heavy: [24, 1.8, 1] },
    knuckles: { atk1: [17, 0.8, 2.6], atk2: [17, 0.85, 3], atk3: [16, 0.95, 3.6], heavy: [20, 1.2, 4], upper: [16, 0.9, 1] },
    amy:      { atk1: [27, 0.65, 2], atk2: [27, 0.7, 2.2], atk3: [25, 0.8, 3], heavy: [24, 1.65, 3], upper: [20, 1.1, 0], airatk: [20, 1.15, 0] },
    rouge:    { heavy: [24, 1.1, 4.5], dashatk: [20, 1.05, 0] },
    shadow:   { atk1: [25, 0.7, 2.4], atk2: [25, 0.8, 2.6], atk3: [24, 0.9, 3.6], heavy: [26, 1.1, 4] },
    /* Cheese does Cream's hitting, out in front of her (Chao Arch, Winder, Salom, Tornado ...);
       Chaos's arms stretch; Gamma's and Eggman's machines are slow and long; Eggman's arms,
       drill and wrecking ball reach furthest of all */
    cream:    { atk1: [22, 1.1, 1], atk2: [22, 1.1, 1.2], atk3: [22, 1.2, 1.6], heavy: [24, 1.35, 1], upper: [16, 1.0, 0.5],
                dashatk: [12, 1.2, 0], airatk: [12, 1.1, 0], aim: [12, 1.2, 2] },
    chaos:    { atk1: [28, 0.95, 2], atk2: [28, 1.0, 2.2], atk3: [26, 1.15, 3], heavy: [24, 1.3, 3], upper: [24, 1.4, 1],
                dashatk: [16, 1.1, 0], airatk: [20, 1.1, 0], aim: [20, 1.1, 2] },
    gamma:    { atk1: [34, 0.95, 2], atk2: [24, 1.0, 2.2], atk3: [30, 1.15, 3], heavy: [36, 1.35, 2.5], upper: [34, 1.0, 1],
                dashatk: [26, 1.3, 0], airatk: [22, 1.1, 0], aim: [30, 1.2, 2] },
    eggman:   { atk1: [30, 1.3, 1.5], atk2: [22, 1.4, 1.8], atk3: [20, 1.5, 2.5], heavy: [26, 1.6, 2.5], upper: [22, 1.4, 0.5],
                dashatk: [22, 2.0, 0], airatk: [26, 2.0, 0], aim: [24, 1.5, 2] },
    metal:    { atk1: [24, 0.75, 2.4], atk2: [28, 0.8, 2.6], atk3: [24, 0.95, 3.6], heavy: [26, 1.35, 3], upper: [26, 0.9, 1.2],
                dashatk: [18, 1.5, 0], airatk: [20, 0.95, 0] },
    mighty:   { atk1: [24, 0.75, 2.4], atk2: [24, 0.8, 2.6], atk3: [22, 0.95, 3.6], heavy: [26, 1.15, 3.5], upper: [22, 0.9, 1.2],
                dashatk: [20, 1.05, 0] },
    silver:   { atk1: [22, 0.75, 2], atk2: [22, 0.8, 2.4], atk3: [22, 1.1, 3.2], heavy: [22, 1.3, 3], upper: [26, 0.9, 1],
                dashatk: [18, 1.05, 0], airatk: [20, 1.0, 0] },
  };
  /* What Cheese does in each of Cream's blows: Chao Arch, Chao Winder, Chao Salom, Chao Tornado,
     Chao Upper (and Chao Dunk), Chao Dash (and Chao Circle) */
  const CHAOS_WATER = { heavy: "fx.stab", upper: "fx.upper" };
  const CHEESE = { atk1: "fx.cheese1", atk2: "fx.cheese2", atk3: "fx.cheese3", heavy: "fx.cheese4", upper: "fx.cheese5", aim: "fx.cheese5",
                   dashatk: "fx.cheese6", airatk: "fx.cheese6" };
  const blow = (c, name) => { const b = (BLOWS[c.id] || {})[name] || BLOWS.base[name]; return { fps: b[0], reach: b[1], step: b[2] }; };
  /* How a blow lands, by its row: the freeze-frame when it connects (seconds), the jolt through
     the picture, the size of the hit spark (metres), and the knock it gives what it hits (m/s
     forward, up). The finishers -- the third jab, the heavies, the upper, the dash and aim
     attacks -- hold the picture longest and throw furthest. Knuckles hits hardest of the six,
     and Amy's hammer blows land like a hammer. A hit spark is in the runner's colour. In a
     battle the jabs knock by `bkick` instead, hardly at all, so a string stays in reach of the
     next blow; the heavies and the dash attack smash, the chase smashes down (see hitFighter). */
  const HITS = {
    atk1:    { stop: 0.06,  shake: 0.05, spark: 1.0,  kick: [6, 4],   bkick: [2.5, 0] },
    atk2:    { stop: 0.065, shake: 0.06, spark: 1.1,  kick: [7, 4.5], bkick: [3, 0] },
    atk3:    { stop: 0.09,  shake: 0.14, spark: 1.4,  kick: [12, 7],  bkick: [3.5, 2], heavy: true },
    heavy:   { stop: 0.12,  shake: 0.2,  spark: 1.7,  kick: [15, 6],  heavy: true },
    upper:   { stop: 0.11,  shake: 0.18, spark: 1.6,  kick: [3, 16],  heavy: true },
    dashatk: { stop: 0.1,   shake: 0.18, spark: 1.6,  kick: [16, 5],  heavy: true },
    airatk:  { stop: 0.075, shake: 0.1,  spark: 1.25, kick: [10, 2] },
    aim:     { stop: 0.09,  shake: 0.14, spark: 1.4,  kick: [11, 6],  heavy: true },
    chase:   { stop: 0.14,  shake: 0.24, spark: 1.9,  kick: [3, -12], heavy: true },
  };
  /* In a battle the upper is a launcher, everyone's alike: whoever it lands on goes straight up
     (about five metres) and is helpless till they come down; and Down + X goes after them into
     the air (the aim attack's chase) and lands the `chase` blow, down and away. */
  const LAUNCH = { vx: 1.5, vy: 18 };
  const HIT_C = { sonic: 0x9ad4ff, tails: 0xfff070, knuckles: 0xff9030, amy: 0xff80c0, rouge: 0xff70d0, shadow: 0xff4060,
                  emerl: 0xffa030, cream: 0x8ad8ff, chaos: 0x70c8ff, gamma: 0xff6040, eggman: 0xffc040, metal: 0x6a90ff, mighty: 0xff4a4a, silver: 0x70f0d0 };
  const hitWeight = (c, name) => c.id === "knuckles" || c.id === "mighty" ? 1.3 : c.id === "gamma" || c.id === "eggman" ? 1.2 :
                                 c.id === "amy" && /^(heavy|upper|airatk)$/.test(name) ? 1.25 : 1;

  /* How hard each lands: `charge` is the colour of the energy gathered while the move winds up;
     `pow` what its release does (a flash of that colour and size, a jolt through the picture,
     a recoil, a freeze-frame of `stop` seconds); `trail` the colour a shot leaves behind it, `k`
     its size, `ghost` a see-through one (wind, sound); `land` what a lobbed rock does when it
     comes down; `bits: 0` none of the flying bits. A `muzzle` is where on the firing frame the
     shot leaves from (metres ahead of the runner, metres up): Tails' cannon, Rouge's hand. The
     charge gathers there from frame `gfrom`, and the release bursts out of it the way the shot
     goes.

     The specials, as Sonic Battle has each one (Sonic Center's character FAQ and the Green
     Hill Zone's guide): `body` the runner's frames, `at` the frame it happens on, then what
     happens. Shots fly (`wave` ones run along the ground, `lob` ones arc and burst), each with its
     own knock, `kn`: [how far it throws them, how high, how long they float coming down, and 1 for
     a launch] -- the Chaos Spear furthest, the Mighty Cyclone tallest, the Electric Bolt longest; powers
     strike an `area` in front or around, or move the runner (`drive`, `dive`, `tornado`);
     traps sit, or `chase`, or `orbit`, till something touches them or Down + C sets them off. */
  const SPECIALS = {
    sonic: {
      /* Sonic Wave: he spins in place, faster and faster, then lets go a sonic boom -- air
         breaking the sound barrier, so you can see through it -- that tears along the ground
         and throws him back. Sonic Storm is the same from the air, angled down. */
      shot:     { body: "rev", windup: 0.5, wave: "fx.shot", speed: 16, life: 0.85, kn: [9, 5.5, 0], recoil: 7, ghost: 1.3 },
      airshot:  { body: "rev", windup: 0.4, fly: "fx.airshot", speed: 15, down: 0.55, life: 0.75, kn: [4, 7.5, 0], recoil: 6, ghost: 1.3 },
      power:    { body: "power", fps: 18, at: 3, drive: true, pow: { c: 0x9ad4ff, flash: 2.2, shake: 0.12 } },   // Sonic Drive: throws a ring, spins after it
      airpower: { body: "ball", fps: 24, at: 0, dive: "meteor", pow: { c: 0x9ad4ff, flash: 2.8, shake: 0.26, stop: 0.05 } }, // Sonic Meteor
      trap:     { body: "trap", fps: 16, at: 4, trap: "mine" },                                                 // Sonic Cracker: a landmine
      airtrap:  { body: "airtrap", fps: 16, at: 4, trap: "mine", toss: true } },
    tails: {
      shot:     { body: "shot", fps: 30, at: 9, fly: "fx.shot", speed: 12, life: 1.1, kn: [2, 9.5, 0.15], loop: true, k: 1.5, trail: 0xfff070,   // Energy Ball, from his arm cannon
                  muzzle: [0.68, 0.55], gfrom: 6, charge: 0xfff070, pow: { c: 0xfff070, flash: 2.2, shake: 0.12, recoil: 3 } },
      airshot:  { body: "shot", fps: 30, at: 9, fly: "fx.shot", speed: 12, down: 0.6, life: 0.95, kn: [2, 8.5, 0.15], loop: true, k: 1.5, trail: 0xfff070,
                  muzzle: [0.68, 0.55], gfrom: 6, charge: 0xfff070, pow: { c: 0xfff070, flash: 2.2, shake: 0.12, recoil: 3 } },
      power:    { body: "power", fps: 16, at: 3, area: "fx.power", ax: 1.5, ay: 0.7, w: 2.1, h: 2.2, k: 1.5,           // Flick: a Big Hand
                  charge: 0xffffff, pow: { c: 0xffffff, flash: 3, shake: 0.22, stop: 0.06 } },
      airpower: { body: "airpower", fps: 16, at: 3, area: "fx.power", ax: 1.5, ay: 0.55, w: 2.1, h: 2.2, k: 1.5,
                  charge: 0xffffff, pow: { c: 0xffffff, flash: 3, shake: 0.22, stop: 0.06 } },
      trap:     { body: "trap", fps: 16, at: 3, trap: "chase" },                                                // Chu² Bomb: crawls after its mark
      airtrap:  { body: "airtrap", fps: 16, at: 3, trap: "chase", toss: true } },
    knuckles: {
      /* no dust or flying bits on his: the rock, the punch and the blast land on their light,
         the jolt and the freeze alone */
      shot:     { body: "shot", fps: 20, at: 8, lob: "fx.shot", speed: 8, rise: 9, k: 1.35, bits: 0,              // Rock Free Fall: a rock, lobbed
                  charge: 0xffc080, land: { c: 0xffc080, flash: 2.4, shake: 0.26, stop: 0.04, bits: 0 } },
      airshot:  { body: "airshot", fps: 18, at: 3, lob: "fx.shot", speed: 9, rise: -7, k: 1.35, bits: 0,            // Meteor Crush: hurled down
                  land: { c: 0xffc080, flash: 2.4, shake: 0.26, stop: 0.04, bits: 0 } },
      power:    { body: "power", fps: 32, at: 29, area: "fx.power", ax: 1.2, ay: 0.7, w: 2.6, h: 2.4, step: 1.6, k: 1.7, bits: 0, // Deep Impact: the punch goes off
                  charge: 0xff9030, pow: { c: 0xff9030, flash: 4.5, shake: 0.4, stop: 0.09, recoil: 2, bits: 0 } },
      airpower: { body: "airpower", fps: 20, at: 0, dive: "erupt", bits: 0, pow: { c: 0xff9030, flash: 4, shake: 0.38, stop: 0.08, bits: 0 } }, // Major Eruption: dives, burrows, bursts out
      trap:     { body: "trap", fps: 18, at: 5, trap: "mine" },                       // Mole Bomb: a landmine that drills in, then its light blinks
      airtrap:  { body: "airtrap", fps: 18, at: 3, trap: "mine", toss: true } },
    amy: {
      /* Pink Typhoon: a tornado off her hammer -- wind, so you can see through it */
      shot:     { body: "shot", fps: 24, at: 7, wave: "fx.shot", speed: 9, life: 1.3, kn: [1.5, 18, 0.3, 1], ghost: 1.5, trail: 0xffa0d0, twister: true,
                  charge: 0xff80c0, pow: { c: 0xff80c0, flash: 2.2, shake: 0.14, recoil: 2.5 } },
      airshot:  { body: "airshot", fps: 22, at: 4, fly: "fx.airshot", speed: 10, down: 0.6, life: 0.95, kn: [3, 12, 0.25, 1], ghost: 1.5, trail: 0xffa0d0, twister: true,
                  pow: { c: 0xff80c0, flash: 2.2, shake: 0.14, recoil: 2.5 } },
      power:    { body: "shot", fps: 22, at: 4, tornado: [4, 7], charge: 0xff80c0, pow: { c: 0xff80c0, flash: 2.2, shake: 0.1 } }, // Girl Tornado: frames 4-7, six times round
      airpower: { body: "airshot", fps: 22, at: 4, tornado: [4, 6], pow: { c: 0xff80c0, flash: 2.2, shake: 0.1 } },
      trap:     { body: "trap", fps: 18, at: 8, trap: "gift" },                                                 // Gift
      airtrap:  { body: "airtrap", fps: 18, at: 4, trap: "gift", toss: true } },
    rouge: {
      /* Beauty Shock: an ultrasonic shriek -- sound, so you can see through it; short reach */
      shot:     { body: "shot", fps: 22, at: 7, fly: "fx.shot", speed: 11, life: 0.55, kn: [1.5, 8, 0.6], loop: true, ghost: 1.6, trail: 0xffb0f0,
                  muzzle: [0.64, 0.68], gfrom: 4, charge: 0xff70d0, pow: { c: 0xff70d0, flash: 2, shake: 0.1, recoil: 2 } },
      airshot:  { body: "airshot", fps: 22, at: 6, fly: "fx.shot", speed: 11, down: 0.7, life: 0.55, kn: [1.5, 7, 0.6], loop: true, ghost: 1.6, trail: 0xffb0f0,
                  muzzle: [0.63, 0.72], gfrom: 3, charge: 0xff70d0, pow: { c: 0xff70d0, flash: 2, shake: 0.1, recoil: 2 } },
      power:    { body: "power", fps: 22, at: 3, area: "fx.power", ax: 1.5, ay: 0.6, w: 2.4, h: 1.8, k: 1.5,           // Silent Size
                  charge: 0xa0ff70, pow: { c: 0xa0ff70, flash: 3, shake: 0.22, stop: 0.06 } },
      airpower: { body: "airpower", fps: 22, at: 0, dive: "drill", pow: { c: 0xff70d0, flash: 2.4, shake: 0.22, stop: 0.04 } }, // Spiral Dive: spins down, through rock
      trap:     { body: "trap", fps: 22, at: 7, trap: "chase", flies: true },                                   // Bat Cracker: a bat mine that hunts
      airtrap:  { body: "airtrap", fps: 22, at: 6, trap: "chase", flies: true } },
    shadow: {
      shot:     { body: "shot", fps: 22, at: 6, fly: "fx.shot", speed: 18, life: 0.65, kn: [11, 6.5, 0], hold: 0.4, k: 1.25, trail: 0xffe060, // Chaos Magic (Chaos Spear): held, it flies further
                  charge: 0xff4060, pow: { c: 0xffe060, flash: 2.4, shake: 0.14, recoil: 3.5 } },
      airshot:  { body: "airshot", fps: 22, at: 5, fly: "fx.shot", speed: 16, down: 0.6, life: 0.65, kn: [7, 4, 0], ahead: 1.8, k: 1.25, trail: 0xffe060, // appears a few steps ahead
                  charge: 0xff4060, pow: { c: 0xffe060, flash: 2.4, shake: 0.14, recoil: 3.5 } },
      /* Chaos Burst: the burst's frames draw Shadow himself in the sphere, so it goes over him at his
         own size, centred on him, and his own sprite stands aside while it plays (`self`) */
      power:    { body: "power", fps: 30, at: 8, area: "fx.power", ax: 0, ay: 0.58, w: 4.0, h: 3.2, around: true, k: 1, self: true,
                  charge: 0xff4060, pow: { c: 0xff70a0, flash: 5, shake: 0.4, stop: 0.1 } },
      airpower: { body: "airpower", fps: 24, at: 0, dive: "burst", pow: { c: 0xff70a0, flash: 5, shake: 0.4, stop: 0.1 } }, // Air Chaos Burst: drops, then bursts
      trap:     { body: "trap", fps: 20, at: 5, trap: "orbit" },                                                // Roaming Chaos: circles him
      airtrap:  { body: "airtrap", fps: 20, at: 4, trap: "orbit" } },
    cream: {
      /* Cheese does it all: Chao Cannon, Cheese wrapped in energy and flown at what's ahead;
         Chao Rush, a whirlwind round Cheese; Cream Cracker, an Omochao that flies off to hunt */
      shot:     { body: "shot", fps: 22, at: 3, fly: "fx.shot", speed: 10, life: 1.1, kn: [3, 11, 0], k: 1.2, trail: 0x8ad8ff,
                  muzzle: [0.55, 0.55], charge: 0x8ad8ff, pow: { c: 0x8ad8ff, flash: 2, shake: 0.1 } },
      airshot:  { body: "airshot", fps: 14, at: 1, fly: "fx.airshot", speed: 10, down: 0.5, life: 0.95, kn: [3, 10, 0], k: 1.2, trail: 0x8ad8ff,
                  pow: { c: 0x8ad8ff, flash: 2, shake: 0.1 } },
      power:    { body: "power", fps: 20, at: 4, area: "fx.power", ax: 1.7, ay: 1.0, w: 2.4, h: 2.6, k: 1.3,
                  charge: 0x8ad8ff, pow: { c: 0x8ad8ff, flash: 3, shake: 0.2, stop: 0.05 } },
      airpower: { body: "airpower", fps: 14, at: 1, area: "fx.power", ax: 1.6, ay: 0.6, w: 2.4, h: 2.6, k: 1.3,
                  pow: { c: 0x8ad8ff, flash: 3, shake: 0.2, stop: 0.05 } },
      trap:     { body: "trap", fps: 18, at: 6, trap: "chase", flies: true },
      airtrap:  { body: "airtrap", fps: 14, at: 1, trap: "chase", flies: true } },
    chaos: {
      /* Chaos Shot, a ball of water that bursts; Chaos Crush, his arm into the ground and three of
         Double Stab's tentacles up out of it in a row, one after another (Sonic Battle's own account
         of it); Chaos Splash, a puddle that throws up tentacles */
      shot:     { body: "shot", fps: 20, at: 4, fly: "fx.shot", speed: 9, life: 1.05, kn: [4.5, 8, 0.3], k: 1.15, trail: 0x9ad8ff,
                  muzzle: [0.7, 0.55], gfrom: 1, charge: 0x70c8ff, pow: { c: 0x9ad8ff, flash: 2, shake: 0.1 } },
      airshot:  { body: "airshot", fps: 20, at: 4, fly: "fx.shot", speed: 9, down: 0.5, life: 0.9, kn: [4, 7, 0.3], k: 1.15, trail: 0x9ad8ff,
                  muzzle: [0.7, 0.55], pow: { c: 0x9ad8ff, flash: 2, shake: 0.1 } },
      power:    { body: "power", fps: 20, at: 3, row: [1.0, 2.0, 3.0], gap: 0.14, rowFx: "fx.stab", each: 0.6, w: 1.5, h: 2.0,
                  charge: 0x70c8ff, pow: { c: 0x9ad8ff, flash: 2.6, shake: 0.2, stop: 0.05 } },
      /* Air Chaos Crush: his arm straight down, a column of water to the ground -- drawn in his own
         frames (Emerl's copy draws it on) */
      airpower: { body: "airpower", fps: 16, at: 3, area: "fx.airpower", drawn: true, ax: 0.13, ay: -1.0, w: 1.0, h: 2.6, k: 1,
                  pow: { c: 0x9ad8ff, flash: 2.6, shake: 0.2, stop: 0.05 } },
      trap:     { body: "trap", fps: 14, at: 4, trap: "mine" },
      airtrap:  { body: "airtrap", fps: 16, at: 4, trap: "mine", toss: true } },
    gamma: {
      /* Devastator, out of his arm cannon; held, it charges -- the charging frames, only while
         the button is down -- and lets go bigger and further. Meltdown: his reactor goes up,
         and him with it (a heart of his own). Blinker: a mine, blinking. */
      shot:     { body: "shot", fps: 16, at: 4, fly: "fx.shot", speed: 13, life: 0.95, kn: [8, 9.5, 0], loop: true, k: 1.3, trail: 0xc0b0ff,
                  muzzle: [1.0, 0.62], gfrom: 1, charge: 0xc0b0ff, pow: { c: 0xc0b0ff, flash: 2.4, shake: 0.14, recoil: 2 },
                  charged: { at: 2, body: "shotcharge", max: 1.2, release: "shotfull", rat: 8 } },
      airshot:  { body: "airshot", fps: 16, at: 3, fly: "fx.shot", speed: 13, down: 0.4, life: 0.95, kn: [7, 8, 0], loop: true, k: 1.3, trail: 0xc0b0ff,
                  muzzle: [1.0, 0.5], gfrom: 1, charge: 0xc0b0ff, pow: { c: 0xc0b0ff, flash: 2.4, shake: 0.14, recoil: 2 },
                  charged: { at: 2, body: "airshotcharge", max: 1.2, release: "airshotfull", rat: 7 } },
      power:    { body: "power", fps: 8, at: 3, blast: true, w: 5.4, h: 4.4, k: 3.2, charge: 0xff6040,
                  pow: { c: 0xffa040, flash: 7, shake: 0.6, stop: 0.12 } },
      airpower: { body: "airpower", fps: 8, at: 3, blast: true, w: 5.4, h: 4.4, k: 3.2, charge: 0xff6040,
                  pow: { c: 0xffa040, flash: 7, shake: 0.6, stop: 0.12 } },
      trap:     { body: "trap", fps: 22, at: 8, trap: "mine" },
      airtrap:  { body: "airtrap", fps: 18, at: 5, trap: "mine", toss: true } },
    eggman: {
      /* (his muzzles are where they are with the Egg Mobile off the ground) the Death Egg Cannon
         out of the Egg Mobile's front, a ball of fire; Missile Launch, a
         missile that goes off where it hits; Bomb Drop, a bomb out of the bottom, its fuse lit */
      shot:     { body: "shot", fps: 18, at: 7, fly: "fx.shot", speed: 11, life: 1.15, kn: [5, 11.5, 0], loop: true, k: 1.45, trail: 0xff7040,
                  muzzle: [0.95, 0.87], gfrom: 3, charge: 0xff7040, pow: { c: 0xff9050, flash: 3, shake: 0.2, recoil: 3 } },
      airshot:  { body: "airshot", fps: 18, at: 7, fly: "fx.shot", speed: 11, down: 0.45, life: 1.05, kn: [5, 10, 0], loop: true, k: 1.45, trail: 0xff7040,
                  muzzle: [0.95, 0.87], gfrom: 3, charge: 0xff7040, pow: { c: 0xff9050, flash: 3, shake: 0.2, recoil: 3 } },
      power:    { body: "power", fps: 14, at: 3, fly: "fx.power", range: [0, 7], speed: 9, life: 1.55, k: 1.4, trail: 0xc8c8c8,
                  muzzle: [0.8, 0.77], bursts: 1.6, boom: 1.4, land: { c: 0xffa040, flash: 3, shake: 0.26, stop: 0.04 } },
      airpower: { body: "airpower", fps: 14, at: 3, fly: "fx.power", range: [0, 7], speed: 9, down: 0.35, life: 1.4, k: 1.4, trail: 0xc8c8c8,
                  muzzle: [0.8, 0.77], bursts: 1.6, boom: 1.4, land: { c: 0xffa040, flash: 3, shake: 0.26, stop: 0.04 } },
      trap:     { body: "trap", fps: 10, at: 2, trap: "mine" },
      airtrap:  { body: "airtrap", fps: 10, at: 2, trap: "mine", toss: true } },
    metal: {
      /* Electric Bolt; Black Shield, a crystal round him that nothing gets through and that
         breaks what it meets; Plasma Grenade, thrown */
      shot:     { body: "shot", fps: 20, at: 6, fly: "fx.shot", speed: 15, life: 0.85, kn: [2, 7.5, 0.8], loop: true, k: 1.25, trail: 0xfff070,
                  muzzle: [0.6, 0.6], charge: 0x80c0ff, pow: { c: 0xfff070, flash: 2.4, shake: 0.14, recoil: 2.5 } },
      airshot:  { body: "airshot", fps: 20, at: 5, fly: "fx.shot", speed: 15, down: 0.55, life: 0.8, kn: [2, 7, 0.8], loop: true, k: 1.25, trail: 0xfff070,
                  muzzle: [0.6, 0.6], charge: 0x80c0ff, pow: { c: 0xfff070, flash: 2.4, shake: 0.14, recoil: 2.5 } },
      power:    { body: "power", fps: 10, at: 1, shield: true, pow: { c: 0x9ad4ff, flash: 3, shake: 0.18 } },
      airpower: { body: "airpower", fps: 10, at: 1, shield: true, pow: { c: 0x9ad4ff, flash: 3, shake: 0.18 } },
      trap:     { body: "trap", fps: 18, at: 5, trap: "mine", toss: true, far: 5.5 },
      airtrap:  { body: "airtrap", fps: 16, at: 3, trap: "mine", toss: true, far: 4.5 } },
    mighty: {
      /* Mighty Cyclone, a tornado along the ground (a ring of fire from the air); Hammer Spin,
         curled and spinning on, three times round; Hammer Drop (Sonic Mania Plus), straight
         down, through cracked rock, a shockwave both ways where he lands; Peacemaker */
      shot:     { body: "shot", fps: 24, at: 7, wave: "fx.shot", speed: 8, life: 1.35, kn: [0.5, 20.5, 0.5, 1], k: 1.15, trail: 0xffc080, twister: true,
                  pow: { c: 0xffa060, flash: 2.2, shake: 0.14, recoil: 2 } },
      airshot:  { body: "airshot", fps: 22, at: 2, fly: "fx.airshot", speed: 9, down: 0.5, life: 1.1, kn: [6, 7.5, 0], k: 1.2, trail: 0xff8040,
                  pow: { c: 0xffa060, flash: 2.2, shake: 0.14, recoil: 2 } },
      power:    { body: "power", fps: 18, at: 4, tornado: [5, 8], pow: { c: 0xff4a4a, flash: 2.2, shake: 0.1 } },
      airpower: { body: "airpower", fps: 20, at: 0, dive: "hammer", bits: 0, pow: { c: 0xffa060, flash: 4.5, shake: 0.42, stop: 0.08, bits: 0 } },
      trap:     { body: "trap", fps: 18, at: 6, trap: "mine", toss: true, far: 3.5 },               // Peacemaker: a little bomb, thrown
      airtrap:  { body: "airtrap", fps: 18, at: 3, trap: "mine", toss: true } },
    silver: {
      /* Psycho Knife, a blade of psychokinesis, gone in a moment; Psycho Surge, a whirlwind of
         it round him; Psycho Orb, sent ahead to hang in the air -- one at a time */
      shot:     { body: "shot", fps: 20, at: 4, fly: "fx.shot", speed: 12, life: 0.7, kn: [2.5, 8.5, 0.5], k: 1.15, trail: 0x70f0d0,
                  muzzle: [0.6, 0.65], charge: 0x70f0d0, pow: { c: 0x70f0d0, flash: 2.2, shake: 0.12, recoil: 2 } },
      airshot:  { body: "airshot", fps: 18, at: 3, fly: "fx.shot", speed: 12, down: 0.45, life: 0.7, kn: [2.5, 7.5, 0.5], k: 1.15, trail: 0x70f0d0,
                  muzzle: [0.6, 0.65], pow: { c: 0x70f0d0, flash: 2.2, shake: 0.12, recoil: 2 } },
      power:    { body: "power", fps: 18, at: 4, area: "fx.power", ax: 0, ay: 0.95, w: 3.4, h: 3.2, around: true, k: 1.3,
                  charge: 0x70f0d0, pow: { c: 0x70f0d0, flash: 4, shake: 0.32, stop: 0.08 } },
      airpower: { body: "airpower", fps: 18, at: 3, area: "fx.power", ax: 0, ay: 0.8, w: 3.4, h: 3.2, around: true, k: 1.3,
                  pow: { c: 0x70f0d0, flash: 4, shake: 0.32, stop: 0.08 } },
      trap:     { body: "trap", fps: 18, at: 4, trap: "float", one: true },
      airtrap:  { body: "airtrap", fps: 18, at: 3, trap: "float", one: true } },
  };
  /* How a runner's trap looks: `from` the frame it starts on, `loop` the frames it then goes
     round (else all of them), `k` its size; `boom` its own blast (from frame `bfrom`, `bk` its
     size, `bmid` about its middle) in place of the explosion */
  const TRAP_LOOK = {
    cream:  { from: 2, loop: [5, 6], boom: "fx.trapboom", bmid: true, bk: 1.6 },     // an Omochao flies off; the Cream Cracker
    chaos:  { loop: [0, 3], boom: "fx.trap", bfrom: 4, bk: 1.7 },                    // a puddle, that throws up tentacles
    eggman: { from: 2, loop: [4, 10] },                                              // his bomb, the fuse burning down
    mighty: { k: 2, rest: 0 },                                                         // Peacemaker's bomb: spinning as it flies, still once it lands
    silver: { loop: [5, 11] },                                                       // the orb gathers, then hangs there
  };

  // ---------------------------------------------------------------- the sprites
  /* Each runner is a flat card in the voxel world with crisp pixels, facing the way they run
     and casting a shadow of their shape. A runner's frames and effects share one texture
     (assets/guests/sb-<who>.png); a card shows a frame by its own UVs. Body frames stand on
     their feet, effects on their middle. */
  const SHEETS = root.AdventureSprites || {};
  /* the stage items -- Sonic Advance 3's monitors and shields (adventure-items.js,
     tools/pack-items.py) -- drawn as cards the same way */
  if (root.AdventureItems) SHEETS.items = root.AdventureItems;
  const ITEMS = !!SHEETS.items;
  const PX = 1.1 / 33;                              // metres to a sprite pixel: Sonic's idle is 33 tall, about 1.1m
  const MATS = {};
  function sheetMats(who) {
    if (MATS[who]) return MATS[who];
    const tex = SHEETS[who].canvas ? new THREE.CanvasTexture(SHEETS[who].canvas) : new THREE.TextureLoader().load(SHEETS[who].url);
    tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false;
    return (MATS[who] = {
      mat: new THREE.MeshBasicMaterial({ map: tex, alphaTest: 0.5, side: THREE.DoubleSide }),
      fx: new THREE.MeshBasicMaterial({ map: tex, alphaTest: 0.5, side: THREE.DoubleSide }),
      faint: new THREE.MeshBasicMaterial({ map: tex, alphaTest: 0.5, side: THREE.DoubleSide, transparent: true, opacity: 0.38, depthWrite: false }),
      ghost: new THREE.MeshBasicMaterial({ map: tex, alphaTest: 0.02, side: THREE.DoubleSide, transparent: true, opacity: 0.55, depthWrite: false }),
      depth: new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.5, side: THREE.DoubleSide }),
    });
  }
  /* struck, a fighter shows pure white for an instant: their sheet with every pixel white (made
     once the sheet is in; till then, null) */
  function whiteMat(who) {
    const M = sheetMats(who);
    if (M.white) return M.white.map ? M.white : null;
    const w = M.white = new THREE.MeshBasicMaterial({ color: 0xffffff, alphaTest: 0.5, side: THREE.DoubleSide });
    const make = src => {
      const c = document.createElement("canvas"); c.width = src.width; c.height = src.height;
      const g = c.getContext("2d"); g.drawImage(src, 0, 0); g.globalCompositeOperation = "source-in"; g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
      const t = new THREE.CanvasTexture(c); t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false;
      w.map = t; w.needsUpdate = true;
    };
    if (SHEETS[who].canvas) make(SHEETS[who].canvas);
    else { const img = new Image(); img.onload = () => make(img); img.src = SHEETS[who].url; }
    return w.map ? w : null;
  }
  function makeCard(who, kind) {
    const M = sheetMats(who);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), M[kind] && kind !== "depth" ? M[kind] : M.mat);
    if (kind !== "fx" && kind !== "faint" && kind !== "ghost") { mesh.castShadow = true; mesh.customDepthMaterial = M.depth; }
    mesh.userData.who = who;
    return mesh;
  }
  const framesOf = (who, name) => (SHEETS[who] && SHEETS[who].f[name]) || null;
  /** Which frame `t` seconds into a run of `n` frames: looping, or held on the last. */
  const frameAt = (n, t, fps, loop) => { const i = Math.floor(t * fps); return loop ? i % n : Math.min(i, n - 1); };
  /** Show frame `i` of `name` on a card, facing `face`, its feet (or its middle) at x, y, `k` times size. */
  function setFrame(mesh, name, i, face, x, y, mid, z, k) {
    k = k || 1;
    const who = mesh.userData.who, A = SHEETS[who], list = A.f[name] || A.f.idle;
    const [fx, fy, fw, fh, cx, hang] = list[clamp(i, 0, list.length - 1)];          // (hang: how far it is drawn below the feet)
    let u0 = fx / A.w, u1 = (fx + fw) / A.w;
    if (face < 0) { const t = u0; u0 = u1; u1 = t; }
    const v1 = 1 - fy / A.h, v0 = 1 - (fy + fh) / A.h, uv = mesh.geometry.attributes.uv;
    uv.setXY(0, u0, v1); uv.setXY(1, u1, v1); uv.setXY(2, u0, v0); uv.setXY(3, u1, v0); uv.needsUpdate = true;
    mesh.scale.set(fw * PX * k, fh * PX * k, 1);
    mesh.position.set(x + (fw / 2 - cx) * PX * k * face, mid ? y : y + (fh / 2 - (hang || 0)) * PX * k, z == null ? 0.06 : z);
  }
  /* A card in the cabinet's menu: the runner's Sonic Battle portrait, the one their sheet draws
     with a white outline, at twice size with crisp pixels, standing on the card's floor. */
  const IMGS = {};
  /* where each portrait's face is (its eyes and muzzle), in the portrait's own pixels */
  const FACE = { sonic: [37, 27], tails: [30, 28], knuckles: [30, 28], amy: [31, 26], rouge: [26, 27], shadow: [30, 26], cream: [34, 29],
    chaos: [17, 27], gamma: [32, 16], eggman: [41, 15], metal: [40, 31], mighty: [26, 21], silver: [40, 51], emerl: [28, 38] };
  /* which way each bust looks: Sonic Battle's (and most here) turn to their left; TheKnucklesMainG4's
     Metal Sonic, Mighty and Silver to their right. Two busts face to face: the left one looking right */
  const LOOKS_RIGHT = { metal: 1, mighty: 1, silver: 1 };
  const flipFor = (who, side) => (side === "l") !== !!LOOKS_RIGHT[who];   // (mirror it, on that side?)
  function paintCard(cv, who, frame, k) {
    const A = SHEETS[who]; if (!A) return;
    const img = IMGS[who] || (IMGS[who] = Object.assign(new Image(), { src: A.url }));
    const k0 = k || 2;
    const go = () => {
      const g = cv.getContext("2d"), f = (A.f[frame || "portrait"] || A.f.idle)[0];
      g.clearRect(0, 0, cv.width, cv.height); g.imageSmoothingEnabled = false;
      let k = k0; while (k > 1 && f[2] * k > cv.width) k--;      // a wide one (Emerl's) at a size that shows him
      /* a bust that fits stands on the card's floor; one bigger than the card (the small cards:
         the bracket, the story list, the race) is cut round its face, so it's never all ears and quills */
      const fc = (!frame || frame === "portrait") && FACE[who], W = f[2] * k, H = f[3] * k;
      const dx = W <= cv.width || !fc ? Math.round((cv.width - W) / 2) : clamp(Math.round(cv.width / 2 - fc[0] * k), cv.width - W, 0);
      const dy = H <= cv.height ? cv.height - H : fc ? clamp(Math.round(cv.height * 0.5 - fc[1] * k), cv.height - H, 0) : 0;
      g.drawImage(img, f[0], f[1], f[2], f[3], dx, dy, W, H);
      if (cv.dataset.dark) { g.globalCompositeOperation = "source-in"; g.fillStyle = "#0a1236"; g.fillRect(0, 0, cv.width, cv.height); g.globalCompositeOperation = "source-over"; }   // (not on the team yet: a silhouette)
    };
    if (img.complete && img.naturalWidth) go(); else img.addEventListener("load", go, { once: true });
  }

  // ---------------------------------------------------------------- Emerl
  /* Emerl's frames (adventure-emerl.js, tools/pack-emerl.py): his own sheet, and one for each of the
     eight he copies, every move drawn as him. Which move is in each slot is his loadout (kept per
     trainer); the runner the game makes of him is his own size, with each slot's move from its
     source -- its numbers, its frames, its effects -- and one picture made of all of it, put together
     here from the sheets (a card can show only one). */
  const EM = root.AdventureEmerl || null;
  const EM_SRC = ["tails", "knuckles", "amy", "rouge", "shadow", "cream", "chaos", "gamma"];
  const EM_SLOTS = [["pose", "Fighting pose"], ["run", "Run"], ["dash", "Dash"], ["jump", "Jump"], ["air", "Air action"], ["atk1", "1st attack"],
    ["atk2", "2nd attack"], ["atk3", "3rd attack"], ["heavy", "Heavy attack"], ["upper", "Upper attack"], ["dashatk", "Dash attack"],
    ["airatk", "Air attack"], ["aim", "Pursuit attack"], ["shot", "Ground shot"], ["airshot", "Air shot"], ["power", "Ground power"],
    ["airpower", "Air power"], ["trap", "Ground trap"], ["airtrap", "Air trap"]];
  /* which of his frames each slot brings (the air action's are named as each runner's are drawn) */
  const EM_NAMES = { pose: ["idle"], run: ["run", "skid"], dash: ["dash"], jump: ["jump", "fall", "land"], air: ["fly", "glide", "double", "teleport", "catch"],
    atk1: ["atk1"], atk2: ["atk2"], atk3: ["atk3"], heavy: ["heavy"], upper: ["upper"], dashatk: ["dashatk"], airatk: ["airatk"], aim: ["seek", "aim"],
    shot: ["sp.shot"], airshot: ["sp.airshot"], power: ["sp.power"], airpower: ["sp.airpower"], trap: ["sp.trap"], airtrap: ["sp.airtrap"] };
  if (EM) { SHEETS.emerl = Object.assign({ faceY: 14 }, EM.emerl); for (const k of EM_SRC) if (EM[k]) SHEETS["emerl." + k] = EM[k]; }
  /* Sonic Battle's own effects, everyone's (adventure-effects.js, tools/pack-effects.py): the hit stars, the
     guard's barrier and the blow it turns aside, the healing ring, a wall hit, the K.O. ring, a heavy
     blow's and a dash's dust, the pursuit's sweep */
  if (root.AdventureEffects) SHEETS.sbfx = root.AdventureEffects;
  /* Chaos's water tentacle (Double Stab's, Chaos Crush's), drawn from its root at the left of each
     frame where it comes up out of the ground, so it rises and swings over from one place */
  if (SHEETS.chaos && SHEETS.chaos.f["fx.power"]) SHEETS.chaos.f["fx.stab"] = SHEETS.chaos.f["fx.power"].map(f => [f[0], f[1], f[2], f[3], 3]);
  const SBFX = () => !!SHEETS.sbfx;
  /* every move he could learn: a slot of one of the eight's, with a name */
  const emerlAll = () => EM ? EM_SRC.flatMap(src => EM_SLOTS.map(([slot]) => src + "." + slot).filter(k => EM.names[k.split(".")[0]][k.split(".")[1]])) : [];
  function emerlSave() {
    const e = saveData.emerl = saveData.emerl || {};
    e.learned = e.learned || []; e.loadout = e.loadout || {};
    for (const [slot] of EM_SLOTS) if (e.loadout[slot] && !e.learned.includes(e.loadout[slot] + "." + slot)) delete e.loadout[slot];
    return e;
  }
  /** One move learned, after a win in his episode: at random, of those he does not know yet (of
      `from`'s, with one given). Null when he knows them all. */
  function emerlLearn(from) {
    const e = emerlSave(), left = emerlAll().filter(k => !e.learned.includes(k) && (!from || k.split(".")[0] === from));
    if (!left.length) return null;
    const k = left[Math.floor(Math.random() * left.length)];
    e.learned.push(k); save(saveData);
    const [src, slot] = k.split(".");
    return { src, slot, name: EM.names[src][slot], slotName: EM_SLOTS.find(s => s[0] === slot)[1] };
  }
  const EM_IMGS = {};
  const emImgOk = k => { const im = EM_IMGS[k]; return !!(im && im.complete && im.naturalWidth); };
  /* his nine pictures, on their way (each one in paints itself onto the sheets made so far) */
  function emerlImgs() {
    if (!EM) return false;
    let ok = true;
    for (const k of ["emerl"].concat(EM_SRC)) {
      const A = k === "emerl" ? EM.emerl : EM[k]; if (!A) continue;
      let im = EM_IMGS[k];
      if (!im) { im = EM_IMGS[k] = new Image(); im.onload = emerlRepaint; im.src = A.url; }
      if (!emImgOk(k)) ok = false;
    }
    return ok;
  }
  /* The runner made of Emerl's loadout: his size; each slot's numbers from the runner it copies;
     and his frames put together into one picture (painted as his pictures come in: he can be
     made before they have, as the menu's runner or the title's at the start). */
  const EM_BUILT = {};
  function emerlCast(lo0) {
    const base = castOf("emerl"), lo = lo0 || (saveData && emerlSave().loadout) || {};
    const from = {}; for (const [slot] of EM_SLOTS) from[slot] = lo[slot] || "emerl";
    emerlImgs();
    const key = "emerl#" + EM_SLOTS.map(([s]) => from[s].slice(0, 3)).join("");
    const c = Object.assign({}, base, { emerl: from, sheet: key, spinDash: false, climb: false, swims: false });
    const of = slot => from[slot] === "emerl" ? null : castOf(from[slot]);
    const r = of("run"), j = of("jump"), a = of("air"), d = of("dash");
    if (r) Object.assign(c, { run: r.run, accel: r.accel });
    if (j) Object.assign(c, { jump: j.jump, airAccel: j.airAccel });
    if (a) Object.assign(c, { air: a.air, flyTime: a.flyTime, flyK: a.flyK, glides: a.glides, sink: a.sink });
    if (d) Object.assign(c, { dashK: d.dashK, dashT: d.dashT, steer: d.steer, dashInv: d.dashInv, dashFrom: d.id });
    else c.dashFrom = "emerl";
    if (!EM_BUILT[key]) EM_BUILT[key] = emerlSheet(from);
    SHEETS[key] = EM_BUILT[key];
    return c;
  }
  /* one picture of the frames each slot brings, shelf-packed onto a canvas */
  function emerlSheet(from) {
    const want = [];
    const add = (name, k, src) => { const A = k === "emerl" ? EM.emerl : EM[k]; const fs = A && A.f[src]; if (fs) want.push([name, k, fs]); };
    for (const [slot] of EM_SLOTS) for (const nm of EM_NAMES[slot]) add(nm, from[slot], nm);
    for (const nm of ["hit", "out", "portrait", "guard", "heal", "blocked", "up", "back", "wall", "floor", "getup"]) add(nm, "emerl", nm);
    add("spin", "emerl", "double"); add("ball", "emerl", "double");                 // curled: his own air action's spin
    if (!want.some(w => w[0] === "fly") && from.air === "rouge") add("fly", "rouge", "fall");
    const runF = want.find(w => w[0] === "run"); if (runF) want.push(["start", runF[1], [runF[2][0]]]);
    const cv = document.createElement("canvas"); cv.width = 512;
    let x = 1, y = 1, sh = 0; const place = [];
    for (const [name, k, fs] of want) for (const f of fs) {
      if (x + f[2] + 1 > 512) { x = 1; y += sh + 1; sh = 0; }
      place.push([name, k, f, x, y]); x += f[2] + 1; sh = Math.max(sh, f[3]);
    }
    let H = 64; while (H < y + sh + 1) H *= 2;
    cv.height = H;
    const table = {};
    for (const [name, , f, px, py] of place) (table[name] = table[name] || []).push([px, py, f[2], f[3], f[4]]);
    const S = { canvas: cv, url: EM.emerl.url, w: 512, h: H, f: table, place, todo: true };
    emerlPaint(S);
    return S;
  }
  /* the frames onto a sheet, from the pictures that are in (a frame of one still coming stays
     blank till it does) */
  function emerlPaint(S) {
    const g = S.canvas.getContext("2d");
    g.clearRect(0, 0, S.canvas.width, S.canvas.height);
    let all = true;
    for (const [, k, f, px, py] of S.place) { if (emImgOk(k)) g.drawImage(EM_IMGS[k], f[0], f[1], f[2], f[3], px, py, f[2], f[3]); else all = false; }
    S.todo = !all;
  }
  /* a picture of his came in: the sheets still missing frames painted again, and their textures
     (and the white of a struck fighter, made from the sheet) brought up to date */
  function emerlRepaint() {
    for (const key in EM_BUILT) {
      const S = EM_BUILT[key]; if (!S.todo) continue;
      emerlPaint(S);
      const M = MATS[key]; if (M) { M.mat.map.needsUpdate = true; M.white = null; }
    }
  }
  /* A special of Emerl's: the move in that slot -- his own (Sonic's, as Sonic Battle gives him
     them) or the one he copied -- its data from the runner it is, its body his frames for it, timed
     to them, and its effects from its source's sheet */
  function emerlSpecial(p, slot) {
    const src = p.c.emerl[slot] || "emerl", from = src === "emerl" ? "sonic" : src;
    const S0 = SPECIALS[from][slot], S = Object.assign({}, S0, { body: "sp." + slot, fxWho: from });
    delete S.charged;                                     // (no frames of his for Gamma's held charge)
    const nE = (framesOf(p.c.sheet, "sp." + slot) || [0]).length, nO = (framesOf(from, S0.body) || [0]).length * (S0.loops || 1);
    if (nE && nO && !S0.windup) {
      const k = nE / nO;
      S.fps = (S0.fps || 16) * k; S.at = Math.min(nE - 1, Math.round((S0.at || 0) * k));
      if (S0.tornado) S.tornado = [Math.min(nE - 2, S0.tornado[0]), Math.min(nE - 1, S0.tornado[1])];
      S.loops = 1;
    }
    return S;
  }

  // ---------------------------------------------------------------- the badniks
  /* Eggman's robots, in their own sprites from SEGA's Sonic Advance, Sonic Advance 2 and Sonic
     Advance 3 (adventure-badniks.js, cut by tools/pack-badniks.py), each doing what it does in
     its own game, as Sonic Retro describes them:
       gamigami   a crab: walks sideways, stops, fires an energy ball up out of each claw
       rhinotank  trundles; sees you ahead and charges till it meets a wall or an edge
       stinger    a bee on a propeller: flies to and fro, stops to fire at you
       kiki       a monkey: stops to lob a bomb at you, that goes off where it lands
       hanabii    a lizard on wheels: stops to launch a firework that bursts overhead
       slot       a bat: flies to and fro, stops to drop a coin on you
       pierrot    a clown on a ball: blows bounce off the ball; jump on him, or come in curled
       yukimaru   a snowman: stops to throw a snowball up and over
       pen        a penguin: stops to lob a snowball at you
       leon       a chameleon: crawls, and shoots its tongue out at you close up
       wamu       a caterpillar, floating to and fro
       mirror     a mirrored octahedron, spinning (nothing hurts it), that opens to fire
       oct        an octopus: flies to and fro, stops to fire straight down
       senbon     a pufferfish: floats to and fro, puffs out its spikes now and then
       mogu       a mole: hides in its hole, pops out when you come close, and goes back
       pikopiko   a clown with a giant mallet: comes at you and brings it down
       star       spins in its points (nothing hurts it), then stops and opens up
       gaogao     a wind-up lion: its face takes any blow; hit it from behind or above
       bubu       a piggy bank on wheels, scooting to and fro
       guards     toy soldiers, marching in threes, firing bombs out of their trumpets
       akatento   a ladybird car, driving to and fro
       aotento    its blue twin: lifts off into the air when you come close
       condor     a jet: cruises high, and dives at you when you pass under it
     `act` is the way it moves; `air` it flies; `every` seconds between shots; `see` how near
     you have to be (metres) for it to act. */
  const BADS = root.AdventureBadniks || null;
  const BADNIKS = {
    gamigami:  { act: "walkshoot", speed: 1.3, every: 2.6, see: 9, fire: 0.35, dur: 0.75, shot: "claws" },
    rhinotank: { act: "charge", speed: 1.2, dash: 7.5, see: 8 },
    stinger:   { act: "fly", air: true, speed: 1.7, range: 3.5, every: 2.4, see: 7, fire: 0.3, dur: 0.7, shot: "aim" },
    kiki:      { act: "walkshoot", speed: 1.0, every: 2.4, see: 9, fire: 0.25, dur: 0.6, shot: "bomb" },
    hanabii:   { act: "walkshoot", speed: 1.1, every: 3.0, see: 9, fire: 0.2, dur: 0.7, shot: "firework" },
    slot:      { act: "fly", air: true, speed: 1.9, range: 4, every: 2.2, see: 6, fire: 0.25, dur: 0.6, shot: "coin" },
    pierrot:   { act: "walk", speed: 1.3, armor: "ball" },
    yukimaru:  { act: "walkshoot", speed: 0.8, every: 2.4, see: 9, fire: 0.3, dur: 0.8, shot: "snowup" },
    pen:       { act: "walkshoot", speed: 1.3, every: 2.2, see: 7, fire: 0.2, dur: 0.5, shot: "snowball" },
    leon:      { act: "tongue", speed: 0.9, see: 2.6, reach: 2.2 },
    wamu:      { act: "fly", air: true, speed: 1.3, range: 3, wave: 0.8 },
    mirror:    { act: "guardshoot", air: true, speed: 1.0, range: 2.5, every: 2.2, see: 9, dur: 1.1, fire: 0.45, shot: "beam" },
    oct:       { act: "fly", air: true, speed: 1.4, range: 3.5, every: 2.2, see: 5, fire: 0.3, dur: 0.7, shot: "down" },
    senbon:    { act: "guardfly", air: true, speed: 1.1, range: 3 },
    mogu:      { act: "pop", see: 3.6 },
    pikopiko:  { act: "mallet", speed: 1.3, see: 5, reach: 1.8 },
    star:      { act: "guardhover", air: true },
    gaogao:    { act: "walk", speed: 1.0, armor: "front" },
    bubu:      { act: "walk", speed: 1.9 },
    guards:    { act: "walkshoot", speed: 1.0, every: 2.8, see: 10, fire: 0.45, dur: 0.85, shot: "trumpet" },
    akatento:  { act: "walk", speed: 2.6 },
    aotento:   { act: "liftoff", speed: 2.2, see: 3.4 },
    condor:    { act: "dive", air: true, speed: 2.4, range: 5, see: 5 },
    /* The second seven's stages have TheKnucklesMainG4's Modern Sonic Badniks, each doing what
       it does in the game it comes from (Sonic Retro):
         motobug     a ladybird on a wheel, driving to and fro (Sonic 1)
         buzzbomber  a wasp: flies over, stops, fires down at 45 degrees, flies on (Sonic 1);
         buzzer      its Sonic 2 cousin, the same
         crabmeat    walks sideways, stops, fires a ball up out of each claw (Sonic 1)
         chopper     a piranha that leaps up out of the water (Sonic 1)
         jawz        a shark, swimming to and fro (Sonic 1's Jaws)
         orbinaut    spike balls going round it; come near and it fires them at you, one by one
                     (Sonic 1's Unidus); starnaut the gold one
         nebula      hovers on its propeller; drops a bomb when you pass under (Sonic 2)
         balkiry     a jet: waits ahead, then comes straight at you, fast, and is gone (Sonic 2)
         snail       Snail Blaster: its shell shut, nothing hurts it; it opens it to fire twice (Sonic 3)
         butterdroid flies to and fro, and comes after you when you come close (Sonic & Knuckles)
         spiny       crawls; lobs a spiked ball up at you (Sonic 2)
         slicer      a mantis: throws its two blades, that home in on you a while (Sonic 2)
         asteron     a starfish: flashes when you come near and bursts, its five points flying (Sonic 2)
         grabber     a spider on a thread: drops on you when you pass under (Sonic 2)
         grounder    behind a wall till you come near: out through the bricks, and at you (Sonic 2)
         rhinobot    sees you ahead and charges, skids and turns (Sonic 3)
         crawl       holds a bumper out in front: hit it from behind or above (Sonic 2)
         spinner     hovers; spots you and comes after you (Sonic Adventure)
         espinner    the Electro Spinner: crackles with electricity now and then -- don't touch
         mspinner    the Metal Spinner: armoured; only a jump on it, or a ball, breaks it
         klagen      a jellyfish robot, drifting after you (Sonic Heroes); eklagen the electric one
       `k` draws one smaller (the sheet's Jawz is a big shark). */
    motobug:     { act: "walk", speed: 2.2 },
    buzzbomber:  { act: "fly", air: true, speed: 2.4, range: 4, every: 2.2, see: 7, fire: 0.3, dur: 0.75, shot: "diag" },
    buzzer:      { act: "fly", air: true, speed: 2.8, range: 4.5, every: 2.0, see: 7, fire: 0.3, dur: 0.7, shot: "diag" },
    crabmeat:    { act: "walkshoot", speed: 1.0, every: 2.6, see: 9, fire: 0.35, dur: 0.75, shot: "claws" },
    chopper:     { act: "leap", every: 1.6, jump: 11 },
    jawz:        { act: "fly", air: true, speed: 1.4, range: 3.5, wave: 0.12, k: 0.62 },
    orbinaut:    { act: "orbit", speed: 0.5, see: 5, every: 0.9, shot: "orb" },
    starnaut:    { act: "orbit", speed: 0.5, see: 5, every: 0.9, shot: "orb" },
    nebula:      { act: "fly", air: true, speed: 1.2, range: 3, every: 1.8, see: 4, fire: 0.35, dur: 0.8, shot: "drop" },
    balkiry:     { act: "jet", air: true, speed: 10, see: 16 },
    snail:       { act: "shell", speed: 0.6, every: 2.8, see: 8, fire: 0.6, dur: 1.5, shot: "pair", armor: "shell" },
    butterdroid: { act: "flutter", air: true, speed: 1.1, range: 3, see: 5 },
    spiny:       { act: "walkshoot", speed: 0.9, every: 2.2, see: 7, fire: 0.2, dur: 0.5, shot: "lob" },
    slicer:      { act: "walkshoot", speed: 0.8, every: 3.6, see: 7, fire: 0.25, dur: 1.2, shot: "blades" },
    asteron:     { act: "burst", air: true, see: 3.4, shot: "points" },
    grabber:     { act: "grab", air: true, see: 1.4 },
    grounder:    { act: "wall", speed: 2.4, see: 4.5 },
    rhinobot:    { act: "charge", speed: 1.2, dash: 9, see: 9 },
    crawl:       { act: "walk", speed: 0.9, armor: "front" },
    spinner:     { act: "chase", air: true, speed: 2.0, see: 6 },
    espinner:    { act: "chase", air: true, speed: 1.8, see: 6, zap: true },
    mspinner:    { act: "chase", air: true, speed: 3.0, see: 7, armor: "ball" },
    klagen:      { act: "chase", air: true, speed: 1.1, see: 5 },
    eklagen:     { act: "chase", air: true, speed: 1.0, see: 5, zap: true },
  };
  /* What a shot is: the frames it shows (its own badnik's "shot", or a borrowed one), how it
     falls, whether it goes off where it lands, how big it hurts. */
  const SHOTS = {
    claws:    { g: 24, r: 0.25 },
    aim:      { g: 0, r: 0.22 },
    bomb:     { g: 22, r: 0.3, boom: true },
    firework: { g: 9, r: 0.25, burst: true },
    coin:     { g: 18, r: 0.25 },
    snowup:   { g: 22, r: 0.25 },
    snowball: { g: 20, r: 0.25 },
    beam:     { g: 0, r: 0.25 },
    down:     { g: 0, r: 0.22 },
    trumpet:  { g: 7, r: 0.22, boom: true },
    diag:     { g: 0, r: 0.22 },                         // Buzz Bomber's, Buzzer's: down at 45 degrees
    orb:      { g: 0, r: 0.3, k: 0.7 },                  // an Orbinaut's spike ball, flung at you
    drop:     { g: 20, r: 0.3, boom: true },             // Nebula's bomb
    pair:     { g: 0, r: 0.22 },                         // Snail Blaster's two
    lob:      { g: 20, r: 0.25 },                        // Spiny's spiked ball
    blades:   { g: 0, r: 0.25, home: 1.6 },              // Slicer's, homing in a while
    points:   { g: 0, r: 0.22 },                         // Asteron's five points
  };
  let BAD_M = null;
  function badMats() {
    if (BAD_M) return BAD_M;
    const tex = new THREE.TextureLoader().load(BADS.url);
    tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false;
    /* struck, a badnik shows pure white: its silhouette, the atlas with every pixel white */
    const white = new THREE.MeshBasicMaterial({ color: 0xffffff, alphaTest: 0.5, side: THREE.DoubleSide });
    white.visible = false;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
      const g = c.getContext("2d"); g.drawImage(img, 0, 0); g.globalCompositeOperation = "source-in"; g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
      const t = new THREE.CanvasTexture(c); t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false;
      white.map = t; white.visible = true; white.needsUpdate = true;
    };
    img.src = BADS.url;
    BAD_M = { mat: new THREE.MeshBasicMaterial({ map: tex, alphaTest: 0.5, side: THREE.DoubleSide }), white,
              depth: new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.5, side: THREE.DoubleSide }) };
    return BAD_M;
  }
  function badCard() {
    const M = badMats(), m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), M.mat);
    m.castShadow = true; m.customDepthMaterial = M.depth; m.userData.bad = true;
    return m;
  }
  const badFrames = (key, anim) => { const F = BADS.f[key]; return F[anim] || F.walk || F.fly || F.guard || F.pop || F.boom; };
  /** Show frame `i` of a badnik's `anim`, facing `face` (the sheets face left), standing on x, y. */
  function setBad(m, key, anim, i, face, x, y, k) {
    const L = badFrames(key, anim), [fx, fy, fw, fh, ax, ay] = L[((i % L.length) + L.length) % L.length];
    k = k || 1;
    let u0 = fx / BADS.w, u1 = (fx + fw) / BADS.w;
    if (face > 0) { const t = u0; u0 = u1; u1 = t; }
    const v1 = 1 - fy / BADS.h, v0 = 1 - (fy + fh) / BADS.h, uv = m.geometry.attributes.uv;
    uv.setXY(0, u0, v1); uv.setXY(1, u1, v1); uv.setXY(2, u0, v0); uv.setXY(3, u1, v0); uv.needsUpdate = true;
    m.scale.set(fw * PX * k, fh * PX * k, 1);
    m.position.set(x - face * (fw / 2 - ax) * PX * k, y + (ay - fh / 2) * PX * k, 0.04);
  }

  /* A badnik's turn: walking (it turns at walls and edges and keeps to the ground, slopes
     too), and whatever its kind does. `p` is the runner. */
  /** The ground's height at x, slopes and ledges included, from a little over y down; or null. */
  function groundAt(x, y) {
    const ci = Math.floor(x);
    for (let j = Math.floor(y + 1.2); j >= Math.floor(y - 1.6); j--) {
      const c = tile(ci, j);
      if (c === "/" || c === "\\") return slopeY(c, ci, j, x);
      if (solid(c) || c === "-") return j + 1;
    }
    return null;
  }
  /* A badnik walking: on along the ground, up and down slopes as it goes; it turns at a wall (a
     step a whole tile high, or a hurdle) and at an edge. A slope is no wall: the ground under the
     next step of a slope is not in its way. A wide one stands on the higher of its two halves,
     so it never sinks into a slope it is on. */
  function walkOn(e, speed, dt) {
    const ahead = e.x + e.dir * (e.w / 2 + 0.05), ai = Math.floor(ahead);
    const slopeAhead = [-0.1, 0.4, 0.9, 1.4].some(d => { const c = tile(ai, Math.floor(e.y + d)); return c === "/" || c === "\\"; });
    const ga = groundAt(ahead, e.y);
    const wall = (!slopeAhead && solid(tile(ai, Math.floor(e.y + 0.3)))) || (ga !== null && ga - e.y > (slopeAhead ? 1.2 : 0.55)) ||
                 world.solids.some(b => b.alive && ahead > b.x0 && ahead < b.x1 && e.y < b.y1);
    const floor = ga !== null && ga > e.y - 1.1;
    if (wall || !floor) { e.dir = -e.dir; return false; }
    e.vx = e.dir * speed; e.x += e.vx * dt;
    const g0 = groundAt(e.x - e.w * 0.25, e.y), g1 = groundAt(e.x + e.w * 0.25, e.y), gc = groundAt(e.x, e.y);
    const gy = [g0, g1, gc].filter(g => g !== null && g <= e.y + 0.9).reduce((a, b) => Math.max(a, b), -1e9);
    if (gy > -1e8) e.y = gy; else e.y -= 6 * dt;
    return true;
  }
  function setMode(e, mode) { e.mode = mode; e.t = 0; e.at = 0; e.fired = false; }
  function stepBadnik(e, dt, p) {
    const B = e.B, dx = p.x - e.x, dy = p.y + 0.5 - (e.y + e.h / 2), near = Math.abs(dx) < (B.see || 0) && Math.abs(dy) < 4;
    e.t += dt; e.at += dt;
    const fly = () => {                                   // to and fro about where it was put, bobbing
      e.ph += dt * B.speed / Math.max(1, B.range);
      const nx = e.x0 + Math.sin(e.ph) * B.range;
      e.dir = nx >= e.x ? 1 : -1; e.x = nx;
      e.y = e.y0 + Math.sin(e.ph * 2.6) * (B.wave || 0.3);
    };
    switch (B.act) {
      case "walk": walkOn(e, B.speed, dt); e.face = e.dir; break;
      case "walkshoot":
        if (e.mode === "shoot") {
          if (!e.fired && e.t > B.fire) { e.fired = true; badShot(e, p); }
          if (e.t > B.dur) setMode(e, "walk");
        } else {
          walkOn(e, B.speed, dt); e.face = e.dir;
          if (near && e.t > B.every) { setMode(e, "shoot"); e.face = sgn(dx) || e.face; }
        }
        break;
      case "charge":                                       // Rhinotank
        if (e.mode === "charge") {
          if (!walkOn(e, B.dash, dt)) setMode(e, "turn");
          e.face = e.dir === -1 ? -1 : 1;
          if (e.t > 3) setMode(e, "walk");
        } else if (e.mode === "turn") { if (e.t > 0.35) setMode(e, "walk"); }
        else {
          walkOn(e, B.speed, dt); e.face = e.dir;
          if (near && sgn(dx) === e.dir && Math.abs(dy) < 1.5 && e.t > 0.6) setMode(e, "charge");
        }
        break;
      case "fly":
        if (e.mode === "shoot") {
          if (!e.fired && e.t > B.fire) { e.fired = true; badShot(e, p); }
          if (e.t > B.dur) setMode(e, "walk");
        } else {
          fly(); e.face = e.dir;
          if (B.shot && near && e.t > B.every && (B.shot !== "down" && B.shot !== "coin" && B.shot !== "drop" || Math.abs(dx) < 1.6) && dy < 0.5) { setMode(e, "shoot"); e.face = sgn(dx) || e.face; }
        }
        break;
      case "guardshoot":                                   // Mirror: spins shut, opens to fire
        if (e.mode === "shoot") {
          e.guard = false;
          if (!e.fired && e.t > B.fire) { e.fired = true; badShot(e, p); }
          if (e.t > B.dur) setMode(e, "walk");
        } else {
          e.guard = true; fly();
          if (near && e.t > B.every) { setMode(e, "shoot"); e.face = sgn(dx) || e.face; }
        }
        break;
      case "guardfly":                                     // Senbon: spikes out every few seconds
        fly(); e.face = e.dir;
        if (e.mode === "guard") { e.guard = true; if (e.t > 1.4) { setMode(e, "walk"); e.guard = false; } }
        else if (e.t > 2.2) setMode(e, "guard");
        break;
      case "guardhover":                                   // Star: spins, then opens
        e.y = e.y0 + Math.sin(e.ph += dt * 1.6) * 0.25;
        if (e.mode === "open") { e.guard = false; if (e.t > 1.4) setMode(e, "walk"); }
        else { e.guard = true; if (e.t > 2.4) setMode(e, "open"); }
        break;
      case "pop":                                          // Mogu: up out of its hole and back
        if (e.mode === "up") { e.hidden = e.t < 0.2 || e.t > 1.75; if (e.t > 2) setMode(e, "down"); }
        else { e.hidden = true; if (e.t > 1.2 && near) setMode(e, "up"); }
        break;
      case "tongue":                                       // Leon
        if (e.mode === "shoot") {
          const k = Math.floor(e.t * 9);
          e.reach = k >= 1 && k <= 3 ? B.reach : 0;
          if (e.t > 0.6) { setMode(e, "walk"); e.reach = 0; }
        } else {
          walkOn(e, B.speed, dt); e.face = e.dir;
          if (near && sgn(dx) === e.face && Math.abs(dy) < 1.2 && e.t > 1) setMode(e, "shoot");
        }
        break;
      case "mallet":                                       // Piko-piko: up goes the mallet, down it comes
        if (e.mode === "raise") { if (e.t > 0.35) setMode(e, "smash"); }
        else if (e.mode === "smash") {
          e.reach = e.t < 0.2 ? B.reach : 0;
          if (e.t < 0.05) { shakeCam(0.08); SFX.stomp(); }
          if (e.t > 0.6) { setMode(e, "walk"); e.reach = 0; }
        } else {
          if (near) e.dir = sgn(dx) || e.dir;
          walkOn(e, B.speed, dt); e.face = e.dir;
          if (Math.abs(dx) < B.reach && Math.abs(dy) < 1.2 && e.t > 0.8) { e.face = sgn(dx) || e.face; setMode(e, "raise"); }
        }
        break;
      case "liftoff":                                      // Aotento: drives, then lifts off when you come close
        if (e.mode === "fly") {
          e.y = e.y0 + Math.min(2.4, e.t * 5) - Math.max(0, e.t - 1.4) * 5;
          if (e.y <= e.y0 && e.t > 1.4) { e.y = e.y0; setMode(e, "walk"); }
        } else {
          walkOn(e, B.speed, dt); e.face = e.dir; e.y0 = e.y;
          if (near && e.t > 1) setMode(e, "fly");
        }
        break;
      case "leap":                                         // Chopper: up out of the water, and back down
        if (e.mode === "jump") { e.vy -= 24 * dt; e.y += e.vy * dt; if (e.y <= e.y0 && e.vy < 0) { e.y = e.y0; setMode(e, "walk"); } }
        else { e.y = e.y0; if (e.t > B.every) { setMode(e, "jump"); e.vy = B.jump; } }
        e.face = sgn(dx) || e.face;
        break;
      case "orbit": {                                      // Orbinaut: its spike balls go round; near, it fires them
        if (e.balls == null) e.balls = 4;
        e.spin = (e.spin || 0) + dt * 2.4;
        walkOn(e, B.speed, dt); e.face = e.dir;
        if (near && e.balls > 0 && e.t > B.every) { e.t = 0; e.balls--; badShot(e, p); }
        if (!p.dead && p.star <= 0 && !(p.c.id === "mighty" && p.curl)) for (let k = 0; k < e.balls; k++) {
          const a = e.spin + k * PI / 2, bx = e.x + Math.cos(a) * 0.8, by = e.y + e.h / 2 + Math.sin(a) * 0.8;
          if (Math.abs(p.x - bx) < p.c.w / 2 + 0.2 && by > p.y - 0.2 && by < p.y + p.hh + 0.2) hurt(p, bx);
        }
        break;
      }
      case "flutter": case "chase": {                      // Butterdroid, the Spinners, Klagen: near, they come after you
        if (e.hx == null) { e.hx = e.x0; e.hy = e.y0; }
        if (B.zap) {                                       // the electric ones crackle now and then: don't touch
          if (e.mode === "zap") { e.guard = true; if (e.t > 1.1) { setMode(e, "walk"); e.guard = false; } }
          else if (e.t > 2.6 && near) { setMode(e, "zap"); SFX.charge(0.4); }
        }
        if (near && e.mode !== "zap") {
          const tx = clamp(p.x, e.hx - 6, e.hx + 6), ty = clamp(p.y + 0.2, e.hy - 3, e.hy + 2);
          e.x += clamp(tx - e.x, -1, 1) * B.speed * dt; e.y += clamp(ty - e.y, -1, 1) * B.speed * 0.6 * dt;
          e.face = sgn(dx) || e.face; e.x0 = e.x; e.y0 = e.y; e.ph = 0;
        } else if (B.act === "flutter") { fly(); e.face = e.dir; }
        else { e.y = e.y0 + Math.sin(e.t * 2.2 + e.hx) * 0.15; e.face = sgn(dx) || e.face; }          // hovering, bobbing
        break;
      }
      case "shell":                                        // Snail Blaster: shut, nothing hurts it; open, it fires
        if (e.mode === "open") {
          if (!e.fired && e.t > B.fire) { e.fired = true; badShot(e, p); }
          if (e.t > B.dur) setMode(e, "walk");
        } else {
          walkOn(e, B.speed, dt); e.face = e.dir;
          if (near && e.t > B.every) { setMode(e, "open"); e.face = sgn(dx) || e.face; }
        }
        break;
      case "burst":                                        // Asteron: near, it flashes, and goes off in five points
        if (e.mode === "flash") {
          if (e.t > 0.6) {
            badShot(e, p); e.alive = false; e.m.visible = false;
            burst(e.x, e.y + e.h / 2, [0xff8040, 0xffd060, 0xffffff], 10, 4); SFX.boom();
          }
        } else if (near && e.t > 0.5) setMode(e, "flash");
        break;
      case "jet":                                          // Balkiry: waits ahead; then straight at you, fast, and gone
        e.face = -1;
        if (e.mode === "go") { e.x -= B.speed * dt; if (e.x < e.x0 - 32) { e.alive = false; e.m.visible = false; } }
        else { e.y = e.y0 + Math.sin(e.t * 3) * 0.08; if (dx < 0 && -dx < B.see && e.t > 0.5) setMode(e, "go"); }
        break;
      case "grab":                                         // Grabber: down its thread when you pass under, and back up
        if (e.mode === "drop") { e.y = Math.max(e.ty, e.y - 9 * dt); if (e.t > 1.2) setMode(e, "rise"); }
        else if (e.mode === "rise") { e.y = Math.min(e.y0, e.y + 3 * dt); if (e.y >= e.y0) setMode(e, "walk"); }
        else { e.y = e.y0; if (Math.abs(dx) < B.see && p.y < e.y0 - 0.5 && e.t > 1) { setMode(e, "drop"); e.ty = Math.max(p.y + 0.3, e.y0 - 7); } }
        e.face = sgn(dx) || e.face;
        break;
      case "wall":                                         // Grounder: behind its wall; out through the bricks, and at you
        if (!e.out) {
          e.hidden = true; e.face = sgn(dx) || -1;
          if (near && Math.abs(dx) < B.see) {
            e.out = true; e.hidden = false; setMode(e, "pop");
            burst(e.x, e.y + 0.6, [0xb85a3a, 0x8a3a2a, 0xd8a080, 0x6a6a6a], 16, 6); SFX.breakIt();
          }
        } else if (e.mode === "pop") { if (e.t > 0.45) setMode(e, "drive"); }
        else { e.dir = sgn(dx) || e.dir; walkOn(e, B.speed, dt); e.face = e.dir; }
        break;
      case "dive":                                         // Condor
        if (e.mode === "dive") {
          const tx = e.tx - e.x, ty = e.ty - e.y, d = Math.hypot(tx, ty) || 1;
          if (e.t < 0.9 && d > 0.3) { e.x += tx / d * 9 * dt; e.y += ty / d * 9 * dt; e.face = sgn(tx) || e.face; }
          else setMode(e, "climb");
        } else if (e.mode === "climb") {
          e.y = Math.min(e.y0, e.y + 4 * dt); e.x += (e.x0 - e.x) * dt;
          if (e.y >= e.y0 - 0.01) { e.ph = Math.asin(clamp((e.x - e.x0) / B.range, -1, 1)); setMode(e, "walk"); }
        } else {
          fly(); e.face = e.dir;
          if (Math.abs(dx) < B.see && dy < -1.5 && e.t > 1.5) { setMode(e, "dive"); e.tx = p.x; e.ty = p.y + 0.4; }
        }
        break;
    }
  }
  /* What it fires, from where, and which way. */
  function badShot(e, p) {
    const B = e.B, s = SHOTS[B.shot], f = e.face, at = (vx, vy, ox, oy) =>
      world.eshots.push({ key: BADS.f[e.key].shot ? e.key : "kiki", x: e.x + (ox || 0) * f, y: e.y + (oy == null ? e.h * 0.6 : oy), vx, vy, g: s.g, r: s.r, boom: s.boom, burst: s.burst,
                          k: s.k, home: s.home, fi: fi, t: 0, m: null });
    let fi = null;
    const dx = p.x - e.x, dy = p.y + 0.5 - (e.y + e.h * 0.6);
    switch (B.shot) {
      case "claws": at(-3.2, 9.5, -0.6 * f, 0.7); at(3.2, 9.5, 0.6 * f, 0.7); break;
      case "aim": { const d = Math.hypot(dx, dy) || 1; at(dx / d * 6.5, dy / d * 6.5, 0.2, 0.2); break; }
      case "bomb": at(clamp(dx * 0.9, -6.5, 6.5), 8, 0.3, 1.1); break;
      case "firework": at(0, 13, 0.2, 0.9); break;
      case "coin": at(0, 0, 0, -0.1); break;
      case "snowup": at(sgn(dx) * 2.6, 11, 0.2, 0.9); break;
      case "snowball": at(sgn(dx) * 5.5, 5, 0.3, 0.7); break;
      case "beam": at(f * 7, 0, 0.5, e.h * 0.5); break;
      case "down": at(0, -6.5, 0, 0); break;
      case "trumpet": at(f * 6, 1.6, 0.45, 0.85); break;
      case "diag": at(sgn(dx || f) * 5, -5, 0.3, 0.1); break;
      case "orb": { const d = Math.hypot(dx, dy) || 1; at(dx / d * 6, dy / d * 6, 0, e.h / 2); break; }
      case "drop": at(0, -1, 0, 0); break;
      case "pair": { const a = Math.atan2(dy, dx); for (const da of [-0.22, 0.22]) at(Math.cos(a + da) * 6, Math.sin(a + da) * 6, 0.4, 0.5); break; }
      case "lob": at(clamp(dx * 0.75, -5.5, 5.5), 9.5, 0, 0.6); break;
      case "blades": { const d = Math.hypot(dx, dy) || 1; at(dx / d * 4, dy / d * 4 + 2.5, 0.3, 0.9); at(dx / d * 4, dy / d * 4 - 1, -0.3, 0.8); break; }
      case "points":                                     // a star's five: up, and out and down both ways
        for (const [deg, k] of [[90, 0], [162, 2], [18, 2], [-54, 2], [-126, 2]]) { fi = k; at(Math.cos(deg * PI / 180) * 7, Math.sin(deg * PI / 180) * 7, 0, e.h / 2); }
        break;
    }
    SFX.shot();
  }
  function stepEnemyShots(dt, p) {
    const w = world;
    for (const s of w.eshots) {
      if (s.gone) continue;
      s.t += dt; s.vy -= s.g * dt; s.x += s.vx * dt; s.y += s.vy * dt;
      if (s.home > 0 && !p.dead) {                       // Slicer's blades come after you a while
        s.home -= dt; const hx = p.x - s.x, hy = p.y + 0.6 - s.y, hd = Math.hypot(hx, hy) || 1;
        s.vx += (hx / hd * 5 - s.vx) * dt * 2.5; s.vy += (hy / hd * 5 - s.vy) * dt * 2.5;
      }
      if (!s.m) { s.m = badCard(); s.m.castShadow = false; w.group.add(s.m); }
      if (s.burst && s.vy < 0) { badBoom(s.x, s.y, "hanabii", 1.1); s.gone = true; }
      else if (solid(tile(Math.floor(s.x), Math.floor(s.y))) || s.y < -3 || s.t > 6) { if (s.boom) badBoom(s.x, s.y + 0.2, "kiki", 0.75); s.gone = true; }
      else {
        const r = (CPUS.length ? racers() : [p]).find(q => !q.dead && Math.abs(q.x - s.x) < q.c.w / 2 + s.r && s.y > q.y - s.r && s.y < q.y + q.hh + s.r);
        if (r) {
          const keep = cpuNow; cpuNow = r.cpuQ || null;
          if (s.boom) badBoom(s.x, s.y, "kiki", 0.75); else hurt(r, s.x);
          cpuNow = keep; s.gone = true;
        }
      }
      if (s.gone) { w.group.remove(s.m); s.m.geometry.dispose(); }
    }
    if (w.eshots.length > 24) w.eshots = w.eshots.filter(s => !s.gone);
    // explosions: Kiki's bomb, Guards' bomb, Hanabii's burst -- they hurt while they flare
    for (const b of w.booms) {
      if (b.gone) continue;
      b.t += dt;
      const n = badFrames(b.key, "boom").length;
      if (b.t * 14 >= n) { b.gone = true; w.group.remove(b.m); b.m.geometry.dispose(); continue; }
      if (b.t < 0.25) for (const r of CPUS.length ? racers() : [p]) if (!r.dead && Math.hypot(r.x - b.x, r.y + r.hh / 2 - b.y) < b.r + 0.3) { const keep = cpuNow; cpuNow = r.cpuQ || null; hurt(r, b.x); cpuNow = keep; }
    }
    if (w.booms.length > 16) w.booms = w.booms.filter(b => !b.gone);
  }
  function badBoom(x, y, key, r) {
    const m = badCard(); m.castShadow = false; world.group.add(m);
    world.booms.push({ key, x, y, r, t: 0, m });
    SFX.boom();
  }
  /* Which frame a badnik shows, from what it is doing. */
  function drawBadnik(e) {
    const B = e.B, k = e.key, T = world.t;
    let anim = "walk", i = Math.floor(e.at * 8);
    switch (B.act) {
      case "fly": case "guardfly": anim = e.mode === "shoot" ? "shoot" : e.mode === "guard" ? "guard" : "fly"; i = Math.floor(e.at * (e.mode === "shoot" ? 6 : 10)); break;
      case "guardshoot": anim = e.mode === "shoot" ? "shoot" : "walk"; i = e.mode === "shoot" ? Math.min(2, Math.floor(e.t * 8)) : Math.floor(T * 12); break;
      case "guardhover": anim = e.mode === "open" ? "open" : "guard"; i = e.mode === "open" ? Math.min(2, Math.floor(e.t * 8)) : Math.floor(T * 14); break;
      case "walkshoot": anim = e.mode === "shoot" ? "shoot" : "walk"; i = e.mode === "shoot" ? Math.min(badFrames(k, "shoot").length - 1, Math.floor(e.t / B.dur * badFrames(k, "shoot").length)) : Math.floor(e.at * 8); break;
      case "charge": anim = e.mode === "charge" ? "charge" : e.mode === "turn" ? "turn" : "walk"; i = Math.floor(e.at * (e.mode === "charge" ? 14 : 8)); break;
      case "pop": anim = "pop"; i = e.mode === "up" ? Math.min(3, Math.floor(e.t * 10)) + (e.t > 1.75 ? 1 + Math.floor((e.t - 1.75) * 10) : 0) : 0; i = Math.min(i, 6); break;
      case "tongue": anim = e.mode === "shoot" ? "shoot" : "walk"; i = e.mode === "shoot" ? Math.min(4, Math.floor(e.t * 9)) : Math.floor(e.at * 6); break;
      case "mallet": anim = e.mode === "raise" ? "raise" : e.mode === "smash" ? "smash" : "walk"; i = 0; break;
      case "liftoff": anim = e.mode === "fly" ? "fly" : "walk"; i = Math.floor(e.at * 10); break;
      case "dive": anim = e.mode === "dive" ? "dive" : "fly"; i = Math.floor(e.at * 10); break;
      case "leap": anim = "jump"; i = Math.floor(e.at * 10); break;
      case "flutter": case "chase": anim = e.mode === "zap" ? "zap" : "fly"; i = Math.floor(e.at * (e.mode === "zap" ? 14 : 12)); break;
      case "jet": anim = "fly"; i = Math.floor(e.at * 12); break;
      case "shell": anim = e.mode === "open" ? "open" : "walk"; i = e.mode === "open" ? Math.min(4, Math.floor(e.t * 10)) : Math.floor(e.at * 5); break;
      case "burst": anim = e.mode === "flash" && Math.floor(e.t * 14) % 2 ? "flash" : "walk"; i = Math.floor(T * 4); break;
      case "grab": anim = e.mode === "drop" ? "grab" : "walk"; i = Math.floor(e.at * (e.mode === "drop" ? 10 : 6)); break;
      case "wall": anim = e.mode === "pop" ? "pop" : "walk"; i = e.mode === "pop" ? Math.min(2, Math.floor(e.t * 7)) : Math.floor(e.at * 10); break;
      case "orbit": anim = "walk"; i = Math.floor(T * 4); break;
    }
    setBad(e.m, k, anim, i, e.face, e.x, e.y, B.k);
    e.m.visible = !(B.act === "wall" && !e.out);                // Grounder, behind its wall
    if (B.act === "orbit") {                               // Orbinaut's spike balls, the ones it still has
      if (!e.orbs) { e.orbs = [0, 1, 2, 3].map(() => { const m = badCard(); world.group.add(m); return m; }); }
      e.orbs.forEach((m, n) => {
        m.visible = e.alive && !e.fling && n < (e.balls == null ? 4 : e.balls);
        const a = (e.spin || 0) + n * PI / 2;
        setBad(m, k, "shot", 0, 1, e.x + Math.cos(a) * 0.8, e.y + e.h / 2 + Math.sin(a) * 0.8 - 0.21, 0.7);
      });
    }
    if (B.act === "grab") {                                // Grabber's thread, up to where it hangs from
      if (!e.thread) { e.thread = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 1), new THREE.MeshBasicMaterial({ color: 0xdedede })); world.group.add(e.thread); }
      const len = e.y0 - e.y + 0.9; e.thread.visible = e.alive && !e.fling;
      e.thread.scale.y = len; e.thread.position.set(e.x, e.y + e.h * 0.8 + len / 2, 0.02);
    }
  }
  function drawEnemyShots() {
    const w = world;
    for (const s of w.eshots) if (!s.gone && s.m) setBad(s.m, s.key, "shot", s.fi != null ? s.fi : Math.floor(s.t * 10), sgn(s.vx) || 1, s.x, s.y - 0.2 * (s.k || 1), s.k);
    for (const b of w.booms) if (!b.gone) setBad(b.m, b.key, "boom", Math.floor(b.t * 14), 1, b.x, b.y - (b.key === "hanabii" ? 1.05 : 0.5));
  }

  // ---------------------------------------------------------------- the thirteen places
  /* Each stage is one runner's own ground, as Sonic Battle gives each fighter a home arena:
     Sonic's seaside, Tails' workshop, Amy's home, Knuckles' ruins in the snow, Rouge's club,
     Shadow's highway, Cream's museum, Chaos's springs, Mighty's canyon, Silver's ruined city,
     Gamma's depot, Metal Sonic's racecourse, Eggman's station -- each built here as a place of
     its own. A theme is its sky, its light, what its ground, blocks and ledges are made of,
     what stands in it and who lives there.
       blocks   = tiles: stone, steel (riveted plate), books (spines on a shelf), carved
                  (old carved stone), glass (dark tile, neon edged), concrete, marble, mossy
                  (carved stone under moss), sandstone, ruin (cracked, fire in the cracks), hull
       planks   - tiles: wood, grate, shelf, rail (gold), girder
       hurdle   h: brush, barrier, books, cairn, rope, stones, crate
       tree     T: palm, windsock, plant, pillar, lamp, streetlamp, column, lantern, cactus,
                   crates, console
       foes     who lives there: the badnik each of k, r, b, n, p in a stage stands for (BADNIKS)
       far      the backdrop (buildFar) */
  const THEMES = {
    /* Sonic: green turf on white chalk, banded with flint, the sea all the way to the sky */
    cape: {
      sky: [0x2a86ec, 0xd6f0fa], fog: [0xd8eef8, 60, 320], sun: [0xfff4dc, 0.9, [10, 32, 22]], hemi: [0xffffff, 0x94b88a, 0.6],
      top: [0x52b43a, 0x60c044, 0x48a632], drip: 0x44a02e, soil: [0xe4dac2, 0xc8ba9a, 0xd6c8aa], deep: 0xb2a282,
      block: [0xb4bec8, 0xa0aab6], blocks: "stone", plank: 0xc8965a, planks: "wood", water: 0x1ca8e0, crack: 0xa8a49a, back: 0x8a7e68,
      tufts: [0x6cc84a, 0x7ad254], flowers: [0xffffff, 0xf2d040, 0x8aa8f0, 0xf08ac0], hurdle: "stones", tree: "palm",
      foes: { k: "gamigami", r: "rhinotank", b: "stinger", n: "kiki" }, far: "cape", music: "career" },
    /* Tails: the airfield grass, the workshop's riveted steel and grating, belts and fans */
    works: {
      sky: [0x3f8ee6, 0xdcecf6], fog: [0xd8e6f0, 55, 300], sun: [0xfff2dc, 0.9, [12, 30, 22]], hemi: [0xffffff, 0x9ab08a, 0.62],
      top: [0x5aac3c, 0x66b846, 0x50a034], drip: 0x4c9a34, soil: [0x8a6a4a, 0x7a5c3e, 0x947456], deep: 0x5a4632,
      block: [0xa8b4c0, 0x909cab], blocks: "steel", plank: 0x7a8694, planks: "grate", water: 0x2f8ac8, crack: 0x9a9a9e, back: 0x7a8494, indoors: 14,
      tufts: [0x72c44c, 0x80cc56], flowers: [0xffffff, 0xf2d040], hurdle: "barrier", tree: "windsock",
      foes: { k: "star", r: "senbon", b: "oct", n: "mogu" }, far: "works", music: "track" },
    /* Amy: her home, from the floor up -- a pink rug on the floorboards, shelves, books, cushions */
    parlour: {
      sky: [0xf4bcd2, 0xfde6ef], fog: [0xfbe2ec, 50, 230], sun: [0xfff0e2, 0.8, [8, 30, 26]], hemi: [0xfff6fa, 0xd8a8bc, 0.72],
      top: [0xf07aa8, 0xf48ab4, 0xe86c9c], drip: 0xfff4f8, soil: [0xd6a46e, 0xc8925c, 0xe0b07a], deep: 0x9a6a40,
      block: [0xf6efe6, 0xe8ddd0], blocks: "books", plank: 0xf6efe6, planks: "shelf", water: 0x7ccaf0, crack: 0xf0c890, back: 0xc88aa0,
      tufts: [0xf8a8c8, 0xffffff], flowers: [0xff4a7a, 0xffd23a, 0x8ad0f8], hurdle: "books", tree: "plant", indoor: true,
      foes: { k: "bubu", r: "gaogao", n: "guards", p: "pikopiko" }, far: "parlour", music: "friends", balloon: [0xff5a8a, 0xff8ab0] },
    /* Knuckles: snow on black volcanic rock, the old carved stone of the shrines */
    peak: {
      sky: [0x5a80c0, 0xe2ecf6], fog: [0xdce6f2, 45, 230], sun: [0xfff6ea, 0.72, [14, 28, 22]], hemi: [0xf4f8ff, 0xa8b4c4, 0.74],
      top: [0xf4f8fc, 0xe6eef6, 0xfafcff], drip: 0xe0eaf4, soil: [0x5a5254, 0x4e4648, 0x665c5c], deep: 0x3a3234,
      block: [0xbcb29c, 0xa89e88], blocks: "carved", plank: 0x8a6a4a, planks: "wood", water: 0x3a7ab0, crack: 0x9a948a, back: 0x2e2628,
      tufts: [0xffffff], flowers: [], snowfall: true, hurdle: "cairn", tree: "pillar",
      foes: { k: "pen", r: "leon", b: "wamu", n: "yukimaru" }, far: "peak", music: "night", tint: 0xeef2fa },
    /* Rouge: red carpet on black marble, dark glass edged in neon, gold rails, after midnight */
    club: {
      sky: [0x0a0618, 0x2c1444], fog: [0x1c0e30, 40, 210], sun: [0xe4d0ff, 0.6, [6, 30, 24]], hemi: [0xe0c8ff, 0x3a2448, 0.7],
      top: [0xb02e52, 0xbc3a5e, 0xa02448], drip: 0xe8c050, soil: [0x2c2632, 0x362e3c, 0x26202c], deep: 0x1a161e,
      block: [0x4a2a6a, 0x5a3480], blocks: "glass", plank: 0xe8c050, planks: "rail", water: 0x2a8ad8, crack: 0x8a8a9a, back: 0x3a2850, indoors: 6,
      tufts: [], flowers: [], stars: true, hurdle: "rope", tree: "lamp",
      foes: { k: "pierrot", r: "mirror", b: "slot", n: "hanabii" }, far: "club", music: "idea", tint: 0xe2daf4 },
    /* Shadow: asphalt and concrete, red girders, the sun going down behind the city */
    expressway: {
      sky: [0x34265a, 0xf4925a], fog: [0xe8946a, 55, 280], sun: [0xffb478, 1.0, [-20, 16, 20]], hemi: [0xffdcc0, 0x5a4048, 0.58],
      top: [0x3c3c44, 0x44444c, 0x36363e], drip: 0x8a8a92, soil: [0x9a948e, 0x8a847e, 0xa49e98], deep: 0x6a6460,
      block: [0xb0aaa2, 0x9c968e], blocks: "concrete", plank: 0xc03a2e, planks: "girder", water: 0x3a6a8a, crack: 0x8a847e, back: 0x2a2428,
      tufts: [], flowers: [], lanes: true, hurdle: "barrier", tree: "streetlamp",
      foes: { k: "akatento", r: "aotento", b: "condor" }, far: "city", music: "finale", tint: 0xffe6d4 },
    /* Cream: a natural history hall -- white marble, dark wood, a velvet rope to keep you off
       the exhibits, the great skeletons standing about */
    museum: {
      sky: [0xd8ccb4, 0xf6efe0], fog: [0xf2ead8, 50, 240], sun: [0xfff4e2, 0.82, [10, 30, 24]], hemi: [0xfffaf0, 0xc8b89a, 0.72],
      top: [0xeee8dc, 0xf6f2ea, 0xe4ddce], drip: 0xc8a050, soil: [0xe0d8c8, 0xd2c8b4, 0xe8e0d0], deep: 0xa89a82,
      block: [0xf2eee6, 0xdcd4c8], blocks: "marble", plank: 0x7a4a2a, planks: "wood", water: 0x6ab8e0, crack: 0xd8ccb0, back: 0xb8a888,
      checker: 0xb4a088, tufts: [], flowers: [], hurdle: "rope", tree: "column",
      foes: { k: "snail", r: "motobug", b: "butterdroid", n: "buzzbomber" }, far: "museum", music: "school", balloon: [0xff9a40, 0x7ac8f0] },
    /* Chaos: the springs under the old shrine, at night -- mossy carved stone, clear water
       everywhere, stone lanterns lit, the moon */
    springs: {
      sky: [0x0e1a34, 0x3a6a8a], fog: [0x1e3a52, 40, 220], sun: [0xd8e8ff, 0.62, [-8, 30, 20]], hemi: [0xc8e0ff, 0x2a4a3a, 0.72],
      top: [0x3e8a4a, 0x4a9a54, 0x367a42], drip: 0x2e6a3a, soil: [0x5a6260, 0x4e5654, 0x66706c], deep: 0x2e3634,
      block: [0x8a948c, 0x76807a], blocks: "mossy", plank: 0x7a5a3a, planks: "wood", water: 0x2ab4c8, crack: 0x8a948a, back: 0x24302e,
      tufts: [0x4a9a54, 0x5aaa60], flowers: [0x9ad8ff, 0xffffff], hurdle: "stones", tree: "lantern",
      foes: { k: "crabmeat", r: "orbinaut", b: "jawz", n: "chopper" }, far: "springs", music: "home_night", tint: 0xe6f0f8 },
    /* Mighty: canyon country -- red rock in bands, sand on top, cacti, the mesas going on for ever */
    canyon: {
      sky: [0x2e7ad0, 0xf6dcae], fog: [0xf2d8b0, 60, 320], sun: [0xfff0d0, 1.0, [14, 34, 18]], hemi: [0xfff4e0, 0xc08a5a, 0.6],
      top: [0xe8b878, 0xf0c488, 0xdcaa68], drip: 0xd8984e, soil: [0xc8643c, 0xb05232, 0xd47a4c], deep: 0x7a3420,
      block: [0xd8885a, 0xc06a40], blocks: "sandstone", plank: 0x8a6440, planks: "wood", water: 0x3a9ad0, crack: 0xc89a6a, back: 0x6a3020,
      tufts: [0xb8a050, 0x9a8a40], flowers: [0xff6a5a, 0xf2d040], hurdle: "stones", tree: "cactus",
      foes: { k: "rhinobot", r: "spiny", b: "asteron", n: "motobug" }, far: "canyon", music: "training_senior" },
    /* Silver: his city two hundred years on, burning -- cracked roads, black concrete lit by
       the fires in it, rusted girders, the sky red, embers coming down */
    ruins: {
      sky: [0x1a0a0e, 0xc8482a], fog: [0x6a2a1e, 40, 220], sun: [0xffa070, 0.85, [-14, 24, 20]], hemi: [0xffc0a0, 0x3a2020, 0.6],
      top: [0x4a4246, 0x544a4e, 0x403a3e], drip: 0x8a3a24, soil: [0x5a504c, 0x4a4240, 0x645a56], deep: 0x2a2224,
      block: [0x58504e, 0x4a4240], blocks: "ruin", plank: 0x8a4a2a, planks: "girder", water: 0x3a6070, crack: 0x7a6a62, back: 0x1e1618,
      tufts: [], flowers: [], snowfall: 0xffa050, hurdle: "barrier", tree: "streetlamp", lanes: true,
      foes: { k: "rhinotank", r: "grounder", b: "spinner", n: "espinner", p: "klagen" }, far: "ruins", music: "setback", tint: 0xffe0d0 },
    /* Chaos Gamma: a storage depot deep in Eggman's hideout -- steel floors striped for the
       forklifts, grating, belts, crates by the thousand, lamps hanging in the dark */
    depot: {
      sky: [0x0c1016, 0x2a3440], fog: [0x1a222c, 40, 200], sun: [0xe8f0ff, 0.7, [8, 30, 22]], hemi: [0xdce8f6, 0x2a3038, 0.72],
      top: [0x5e6874, 0x687280, 0x56606a], drip: 0xf2c030, soil: [0x3a424c, 0x343c44, 0x424a54], deep: 0x22282e,
      block: [0x7a8696, 0x667282], blocks: "steel", plank: 0x6a7684, planks: "grate", water: 0x2a7aa0, crack: 0x8a8e94, back: 0x1a2028, indoors: 10,
      tufts: [], flowers: [], hurdle: "crate", tree: "crates",
      foes: { k: "crawl", r: "grounder", b: "grabber", n: "rhinobot" }, far: "depot", music: "rival", tint: 0xe4eaf2 },
    /* Metal Sonic: a racecourse out among the stars -- dark track lit blue and white, gold
       rails, lane lines, the planets going by */
    stars: {
      sky: [0x02020a, 0x161040], fog: [0x0e0a26, 60, 320], sun: [0xe0e8ff, 0.75, [6, 30, 24]], hemi: [0xd0d8ff, 0x1a1830, 0.72],
      top: [0x22223a, 0x2a2a44, 0x1c1c32], drip: 0x7ad8ff, soil: [0x2a2a3e, 0x24243a, 0x30304a], deep: 0x14142a,
      block: [0x1e2240, 0x2a3060], blocks: "glass", neon: [0xffffff, 0x7ad8ff], plank: 0xe8c050, planks: "rail", water: 0x3a5ad8, crack: 0x6a6a8a, back: 0x0a0a1a,
      tufts: [], flowers: [], stars: true, lanes: true, hurdle: "barrier", tree: "lamp",
      foes: { k: "starnaut", r: "crawl", b: "nebula", n: "balkiry" }, far: "stars", music: "race_g1", tint: 0xe6e8ff },
    /* Dr. Eggman: his station in orbit -- grey hull plating, warning lights, grating over the
       machinery, consoles, and out of the windows the world turning below: the last stage */
    station: {
      sky: [0x020208, 0x0e1430], fog: [0x0a0e20, 60, 300], sun: [0xf0f4ff, 0.8, [10, 32, 22]], hemi: [0xe0e8ff, 0x2a2a38, 0.7],
      top: [0x8a909c, 0x949aa6, 0x7e848e], drip: 0xe84a3a, soil: [0x5a606c, 0x50565e, 0x646a76], deep: 0x2e3238,
      block: [0x9aa0aa, 0x80868e], blocks: "hull", plank: 0x5a6068, planks: "grate", water: 0x3a7ad8, crack: 0x8a8e96, back: 0x1a1c24, indoors: 10,
      tufts: [], flowers: [], stars: true, hurdle: "crate", tree: "console",
      foes: { k: "slicer", r: "crawl", b: "mspinner", n: "eklagen", p: "grabber" }, far: "station", music: "rival_final", tint: 0xeef0fa },
    // ---------------------------------------------------------------- the grand prix's twenty-four
    /* Flicky Cup -- Checker Hills: the classic green hills, checkered soil, totem poles, the sea */
    checker: {
      sky: [0x3a8ef0, 0xc8ecff], fog: [0xcfeaf8, 60, 320], sun: [0xfff4dc, 0.95, [10, 32, 22]], hemi: [0xffffff, 0x8ab87a, 0.62],
      top: [0x3cbc3c, 0x4ac848, 0x34aa34], drip: 0x2e9a2e, soil: [0xc0702a, 0x8a4a1a, 0xb0642a], deep: 0x6a3a14, checkSoil: true,
      block: [0xd8a060, 0xb87a40], blocks: "stone", plank: 0xc8965a, planks: "wood", water: 0x2a9ae8, crack: 0xb08a5a, back: 0x8a5a2a,
      tufts: [0x5ad24a, 0x6ade54], flowers: [0xff5a5a, 0xffd23a, 0xa86af0, 0xffffff], hurdle: "brush", tree: "totem",
      foes: { k: "motobug", r: "rhinobot", b: "buzzbomber", n: "crabmeat" }, far: "checker" },
    /* Coral Coast: white sand, coral rock, palms, the boardwalk over the tide pools */
    coral: {
      sky: [0x1e9ef2, 0xbaf2ff], fog: [0xc0eef8, 60, 320], sun: [0xfff6e0, 1.0, [12, 34, 20]], hemi: [0xffffff, 0xe8d8a8, 0.62],
      top: [0xf2e2aa, 0xf6e8b8, 0xead6a0], drip: 0xe0cc90, soil: [0xe8d49a, 0xd8c088, 0xf0dcaa], deep: 0xb8a070,
      block: [0xf2a0a0, 0xe08080], blocks: "stone", plank: 0xb08458, planks: "wood", water: 0x18c8d8, crack: 0xd8c49a, back: 0x8a7a58,
      tufts: [0x6ac85a], flowers: [0xff7aa0, 0xffffff], hurdle: "stones", tree: "palm",
      foes: { k: "crabmeat", r: "motobug", b: "buzzbomber", n: "chopper" }, far: "coral", balloon: [0xff5a5a, 0xffe060] },
    /* Mushroom Grove: autumn woods, leaves on the ground, mushrooms taller than houses */
    grove: {
      sky: [0x6aa8e8, 0xf8dcb0], fog: [0xf0d8b0, 50, 260], sun: [0xffe8c0, 0.9, [10, 30, 22]], hemi: [0xfff0d8, 0xa87a4a, 0.62],
      top: [0xd8902a, 0xe8a83a, 0xc8781e], drip: 0xb86a1a, soil: [0x7a5232, 0x6a442a, 0x8a5e3a], deep: 0x4a3020,
      block: [0xa89a7a, 0x8a7c5e], blocks: "stone", plank: 0x8a5a32, planks: "wood", water: 0x3a9ad0, crack: 0x9a8a6a, back: 0x5a3a22,
      tufts: [0xe8a83a, 0xc8702a], flowers: [0xff5a3a, 0xffd23a], hurdle: "brush", tree: "mushroom",
      foes: { k: "snail", r: "motobug", b: "butterdroid", n: "buzzer" }, far: "grove" },
    /* Lagoon Ruins: old columns half sunk in a clear lagoon, moss over everything */
    lagoon: {
      sky: [0x3a9ad8, 0xd8f2f0], fog: [0xc8eae6, 50, 280], sun: [0xfff6e0, 0.88, [10, 30, 22]], hemi: [0xffffff, 0x7aa88a, 0.65],
      top: [0x5aa848, 0x66b452, 0x4e9a3e], drip: 0x3e8a34, soil: [0xb8b098, 0xa49c84, 0xc8c0a8], deep: 0x7a7462,
      block: [0xc8c0a8, 0xa8a088], blocks: "mossy", plank: 0x7a5a3a, planks: "wood", water: 0x1ab0c0, crack: 0xa8a08a, back: 0x4a5a4a,
      tufts: [0x5aaa48], flowers: [0xffffff, 0x9ad8ff], hurdle: "stones", tree: "column",
      foes: { k: "chopper", r: "orbinaut", b: "jawz", n: "crabmeat" }, far: "lagoon" },
    /* Carnival Cup -- Pinball Palace: blue felt, neon rails, bumpers everywhere, the lights going */
    pinball: {
      sky: [0x0a0420, 0x3a1060], fog: [0x24103a, 45, 220], sun: [0xf0d8ff, 0.65, [6, 30, 24]], hemi: [0xf0d0ff, 0x3a2050, 0.75],
      top: [0x2a3ab8, 0x3448c8, 0x2232a8], drip: 0xf2d040, soil: [0x1a1a3a, 0x24244a, 0x14142e], deep: 0x0a0a1e,
      block: [0x5a2a8a, 0x7a3aa8], blocks: "glass", neon: [0xffd23a, 0xff4ac8], plank: 0xe8c050, planks: "rail", water: 0x3a6ae8, crack: 0x8a8aaa, back: 0x1a1030,
      tufts: [], flowers: [], stars: true, hurdle: "rope", tree: "lamp",
      foes: { k: "pierrot", r: "mirror", b: "slot", n: "hanabii" }, far: "pinball", balloon: [0xff4ac8, 0x7ad8ff], tint: 0xe8e0ff },
    /* Funfair Twilight: the fair at dusk, the wheel turning, the tents, the coaster's rails */
    funfair: {
      sky: [0x3a2a6a, 0xff9a7a], fog: [0xd88a7a, 50, 260], sun: [0xffb890, 0.85, [-16, 18, 20]], hemi: [0xffd8c8, 0x5a3a5a, 0.62],
      top: [0x48a858, 0x54b464, 0x3e9a4e], drip: 0x3a8a48, soil: [0x8a5a6a, 0x7a4a5a, 0x9a6a7a], deep: 0x4a2a3a,
      block: [0xf2e6d0, 0xd8303a], blocks: "stone", plank: 0xe8c050, planks: "rail", water: 0x3a8ad8, crack: 0xa88a8a, back: 0x3a2440,
      tufts: [0x5ab868], flowers: [0xffd23a, 0xff5a8a], hurdle: "barrier", tree: "lamp",
      foes: { k: "pierrot", r: "bubu", b: "balkiry", n: "hanabii" }, far: "funfair", balloon: [0xff5a5a, 0x5ac8ff], tint: 0xffe8e0 },
    /* Sugar Rush Factory: icing on cake, a chocolate river, lollipops, gift boxes on the belts */
    sweets: {
      sky: [0xf8b8d8, 0xfff0f6], fog: [0xffe6f0, 50, 240], sun: [0xfff4f0, 0.85, [8, 30, 24]], hemi: [0xfff8fc, 0xe0a8c0, 0.75],
      top: [0xfff6f8, 0xffe8f0, 0xfffafc], drip: 0xff9ac0, soil: [0xc87a4a, 0xa85e34, 0xd88a58], deep: 0x7a4428,
      block: [0xf6c0d8, 0xe8a0c0], blocks: "stone", plank: 0xff7ab0, planks: "wood", water: 0x8a5232, crack: 0xe8c8a8, back: 0xc87aa0,
      tufts: [0xff9ac0, 0x9ad8ff], flowers: [0xff4a7a, 0x7ad8ff, 0xffd23a], hurdle: "crate", tree: "lollipop",
      foes: { k: "bubu", r: "gaogao", b: "butterdroid", n: "guards" }, far: "sweets", balloon: [0xff7ab0, 0x7ad8ff] },
    /* Firework Pier: the boardwalk at night over the sea, lamps along it, the sky full of fireworks */
    pier: {
      sky: [0x060a24, 0x2a2a6a], fog: [0x141a40, 50, 260], sun: [0xd8e0ff, 0.62, [6, 30, 24]], hemi: [0xd8e0ff, 0x2a2a48, 0.72],
      top: [0xa87a4a, 0xb88a58, 0x986a3e], drip: 0x6a4a2a, soil: [0x5a4a3a, 0x4a3e30, 0x6a5848], deep: 0x2a2420,
      block: [0x8a6a4a, 0x6a4e34], blocks: "stone", plank: 0xa87a4a, planks: "wood", water: 0x1a4a8a, crack: 0x8a7a6a, back: 0x14182e,
      tufts: [], flowers: [], stars: true, hurdle: "rope", tree: "lamp",
      foes: { k: "kiki", r: "crabmeat", b: "balkiry", n: "hanabii" }, far: "pier", balloon: [0xff5a5a, 0xffd23a], tint: 0xe6e8ff },
    /* Aurora Cup -- Powder Slopes: fresh snow down the mountain, pines, slalom gates, a chalet */
    slopes: {
      sky: [0x3a8ae0, 0xe6f2fc], fog: [0xe2eef8, 60, 320], sun: [0xfff8f0, 0.95, [10, 32, 22]], hemi: [0xffffff, 0xb8c8d8, 0.72],
      top: [0xfafcff, 0xf0f6fc, 0xffffff], drip: 0xe6eef8, soil: [0x9aa8b8, 0x8a98a8, 0xaab8c8], deep: 0x6a7888,
      block: [0xd8e8f4, 0xb8d0e4], blocks: "stone", plank: 0x8a5a32, planks: "wood", water: 0x4a9ad8, crack: 0xb8c8d8, back: 0x5a6a7a,
      tufts: [0xffffff], flowers: [], snowfall: true, hurdle: "barrier", tree: "pine",
      foes: { k: "pen", r: "yukimaru", b: "wamu", n: "leon" }, far: "slopes" },
    /* Crystal Cavern: ice underground, crystals lit from inside */
    crystal: {
      sky: [0x0a1a2e, 0x1a4a6a], fog: [0x123048, 40, 200], sun: [0xc8f0ff, 0.65, [8, 30, 22]], hemi: [0xc8f0ff, 0x1a3a4a, 0.78],
      top: [0xbfe2f2, 0xd0eef8, 0xaad8ec], drip: 0x7ad8ff, soil: [0x2a4a6a, 0x24405e, 0x325478], deep: 0x14283e,
      block: [0x6ac8e8, 0x4aa8d0], blocks: "glass", neon: [0xbff4ff, 0x7ad8ff], plank: 0xbfe2f2, planks: "rail", water: 0x3ab8e8, crack: 0x8ab8d0, back: 0x0e1e30, indoors: 8,
      tufts: [], flowers: [], hurdle: "cairn", tree: "crystal",
      foes: { k: "pen", r: "orbinaut", b: "wamu", n: "spiny" }, far: "crystal", tint: 0xe6f4ff },
    /* Iceberg Bay: the frozen bay, floes on dark water, icebergs out to the horizon */
    floes: {
      sky: [0x5a9ae0, 0xe8f4fc], fog: [0xd8eaf6, 55, 300], sun: [0xfff6ea, 0.85, [12, 30, 22]], hemi: [0xf4f8ff, 0x9ab4c8, 0.72],
      top: [0xf4f8fc, 0xe6eef6, 0xffffff], drip: 0xcfe4f2, soil: [0x9ac8e0, 0x8ab8d4, 0xaad4ea], deep: 0x5a8aa8,
      block: [0xc8e4f4, 0xa8d0e8], blocks: "stone", plank: 0x6a7a8a, planks: "wood", water: 0x1a7ab8, crack: 0xa8c8d8, back: 0x3a5a7a,
      tufts: [0xffffff], flowers: [], snowfall: true, hurdle: "cairn", tree: "pine",
      foes: { k: "pen", r: "chopper", b: "wamu", n: "yukimaru" }, far: "floes" },
    /* Aurora Tundra: the tundra at night, the northern lights in ribbons over the snow */
    tundra: {
      sky: [0x040c1e, 0x1a3a5a], fog: [0x0e2236, 50, 260], sun: [0xc8f0e0, 0.6, [-8, 30, 20]], hemi: [0xc8e8ff, 0x2a3a4a, 0.72],
      top: [0xe8f0f8, 0xdce8f4, 0xf0f6fc], drip: 0xc8d8e8, soil: [0x4a5462, 0x404a58, 0x56606e], deep: 0x2a3038,
      block: [0x8aa0b4, 0x748a9e], blocks: "carved", plank: 0x6a5a4a, planks: "wood", water: 0x2a6aa8, crack: 0x8a98a8, back: 0x1a222c,
      tufts: [0xffffff], flowers: [], snowfall: true, stars: true, hurdle: "cairn", tree: "pine",
      foes: { k: "pen", r: "leon", b: "wamu", n: "yukimaru" }, far: "tundra", tint: 0xe0ecf8 },
    /* Ember Cup -- Pyramid Dunes: golden dunes, an oasis's palms, the pyramids in the haze */
    dunes: {
      sky: [0x3a90e0, 0xfff0c8], fog: [0xf8e4b8, 60, 320], sun: [0xfff4d8, 1.05, [14, 34, 18]], hemi: [0xfff8e0, 0xd8b070, 0.6],
      top: [0xf2d088, 0xf6d898, 0xe8c478], drip: 0xd8b468, soil: [0xe0b870, 0xd0a860, 0xe8c480], deep: 0xa8803e,
      block: [0xe8c890, 0xc8a46a], blocks: "stone", plank: 0x8a6440, planks: "wood", water: 0x3aa8c8, crack: 0xd8b880, back: 0x8a6a3a,
      tufts: [0xc8b050], flowers: [0xff6a5a], hurdle: "stones", tree: "palm",
      foes: { k: "spiny", r: "rhinobot", b: "asteron", n: "motobug" }, far: "dunes" },
    /* Dust Devil Town: a frontier town's dirt street, false fronts, the mesas, the wind spinning up */
    town: {
      sky: [0x4a8ad0, 0xf8d098], fog: [0xf0c890, 60, 300], sun: [0xffe8c0, 1.0, [14, 30, 20]], hemi: [0xfff0d8, 0xb8804a, 0.6],
      top: [0xc89058, 0xd09c64, 0xb8804a], drip: 0xa87040, soil: [0xb06a3a, 0x9a5a30, 0xc07a46], deep: 0x6a3a1e,
      block: [0x9a6a3a, 0x7a522a], blocks: "stone", plank: 0x8a5a32, planks: "wood", water: 0x4a8ab8, crack: 0xb08a5a, back: 0x5a3a20,
      tufts: [0xb8a050], flowers: [], hurdle: "crate", tree: "cactus",
      foes: { k: "rhinobot", r: "spiny", b: "condor", n: "motobug" }, far: "town" },
    /* Magma Foundry: Eggman's foundry, steel and grating over molten metal, furnaces glowing */
    foundry: {
      sky: [0x1a0a06, 0x6a2a10], fog: [0x3a1a0e, 40, 200], sun: [0xffb070, 0.75, [8, 30, 22]], hemi: [0xffc8a0, 0x3a1a10, 0.72],
      top: [0x5a5654, 0x64605e, 0x4e4a48], drip: 0xff8a2a, soil: [0x3a3634, 0x34302e, 0x423e3c], deep: 0x1e1a18,
      block: [0x6a625e, 0x58504c], blocks: "steel", plank: 0x6a6058, planks: "grate", water: 0xff6a1a, crack: 0x8a7a70, back: 0x1a1210, indoors: 10,
      tufts: [], flowers: [], hurdle: "crate", tree: "pipe",
      foes: { k: "grounder", r: "crawl", b: "spinner", n: "rhinobot" }, far: "foundry", tint: 0xffe6d8 },
    /* Volcano Rim: black rock with the fire in its cracks, embers falling, the cone smoking */
    volcano: {
      sky: [0x2a0a0a, 0xc04a2a], fog: [0x6a2a1a, 45, 240], sun: [0xffa070, 0.85, [-14, 24, 20]], hemi: [0xffc0a0, 0x3a1a14, 0.62],
      top: [0x3a3234, 0x443a3c, 0x302a2c], drip: 0xff6a2a, soil: [0x5a3a34, 0x4a302a, 0x6a443c], deep: 0x2a1a16,
      block: [0x4a3a38, 0x3a2e2c], blocks: "ruin", plank: 0x6a4a3a, planks: "girder", water: 0x3a6070, crack: 0x7a5a52, back: 0x1e1212,
      tufts: [], flowers: [], snowfall: 0xffa050, hurdle: "stones", tree: "torch",
      foes: { k: "rhinotank", r: "grounder", b: "spinner", n: "espinner" }, far: "volcano", tint: 0xffe0d0 },
    /* Skyward Cup -- Cloud Temple: white stone over the clouds, gold rails, islands floating by */
    temple: {
      sky: [0x4a9af0, 0xf6fcff], fog: [0xeef6ff, 70, 340], sun: [0xfffaf0, 1.0, [10, 34, 22]], hemi: [0xffffff, 0xd8e4f0, 0.72],
      top: [0x7ac85a, 0x86d466, 0x6ebc4e], drip: 0x5aa846, soil: [0xe8e0cc, 0xd8d0bc, 0xf0e8d6], deep: 0xb0a890,
      block: [0xf4ecd8, 0xd8cca8], blocks: "marble", plank: 0xd8b050, planks: "rail", water: 0x4ab0e8, crack: 0xd8ccb0, back: 0x9a9080,
      tufts: [0x7ac85a], flowers: [0xffffff, 0xffd23a], hurdle: "stones", tree: "column",
      foes: { k: "gamigami", r: "rhinotank", b: "condor", n: "balkiry" }, far: "temple" },
    /* Gale Highlands: windmills on green hills, the grass all blown one way */
    windmills: {
      sky: [0x4a90e0, 0xe0f0f8], fog: [0xd8eaf2, 60, 320], sun: [0xfff4e0, 0.92, [12, 32, 22]], hemi: [0xffffff, 0x8ab07a, 0.62],
      top: [0x6ab84a, 0x76c456, 0x5eaa40], drip: 0x4e9a38, soil: [0x8a7a5a, 0x7a6a4a, 0x9a8a6a], deep: 0x5a4a32,
      block: [0xb8b0a0, 0x9a9282], blocks: "stone", plank: 0x8a6a4a, planks: "wood", water: 0x3a90d0, crack: 0xa8a08a, back: 0x6a6a5a,
      tufts: [0x7ac85a, 0x8ad468], flowers: [0xffd23a, 0xffffff, 0xa86af0], hurdle: "brush", tree: "windsock",
      foes: { k: "kiki", r: "rhinotank", b: "stinger", n: "condor" }, far: "windmills" },
    /* Storm Fleet: the decks of Eggman's airships in the thunderclouds, rain coming down */
    fleet: {
      sky: [0x1a2030, 0x4a5468], fog: [0x2a3040, 40, 220], sun: [0xd8e0f0, 0.6, [8, 30, 22]], hemi: [0xd8e0f0, 0x2a2e38, 0.72],
      top: [0x7a828e, 0x848c98, 0x707884], drip: 0xf2c030, soil: [0x4a505a, 0x444a54, 0x525862], deep: 0x2a2e34,
      block: [0x8a929c, 0x707882], blocks: "hull", plank: 0x5a6068, planks: "grate", water: 0x3a5a8a, crack: 0x8a8e96, back: 0x1a1e26,
      tufts: [], flowers: [], snowfall: 0x9ab0d0, hurdle: "crate", tree: "flag",
      foes: { k: "slicer", r: "crawl", b: "balkiry", n: "eklagen" }, far: "fleet", tint: 0xdfe4ee },
    /* Jet Stream Spires: rock needles over a sea of cloud at sunrise, the jet stream in streaks */
    spires: {
      sky: [0x3a5ab0, 0xffc890], fog: [0xf0c8a0, 60, 320], sun: [0xffd8a8, 1.0, [16, 20, 22]], hemi: [0xfff0e0, 0xa88a7a, 0.62],
      top: [0x8ac86a, 0x96d476, 0x7eba5e], drip: 0x6aa84e, soil: [0xb8a0a8, 0xa88e98, 0xc8b0b8], deep: 0x7a6070,
      block: [0xc8b0b8, 0xa89098], blocks: "stone", plank: 0xe8c050, planks: "rail", water: 0x4a8ad8, crack: 0xb8a0a8, back: 0x6a5060,
      tufts: [0x8ad468], flowers: [0xffffff, 0xff9ac0], hurdle: "stones", tree: "flag",
      foes: { k: "kiki", r: "senbon", b: "condor", n: "balkiry" }, far: "spires" },
    /* Emerald Cup -- Chemical Refinery: blue steel, yellow stripes, tanks and pipes, the pink stuff */
    refinery: {
      sky: [0x1a2a5a, 0x6a8ad8], fog: [0x3a4a7a, 50, 260], sun: [0xe8f0ff, 0.8, [10, 30, 22]], hemi: [0xe8f0ff, 0x3a3a5a, 0.7],
      top: [0x4a7ad8, 0x5488e4, 0x406ec8], drip: 0xf2c030, soil: [0x3a4a7a, 0x34446e, 0x425486], deep: 0x1e2848,
      block: [0x6a8ad8, 0x4a6ab8], blocks: "steel", plank: 0x8a92a8, planks: "grate", water: 0xe85ab8, crack: 0x8a92b0, back: 0x1a2040,
      tufts: [], flowers: [], hurdle: "barrier", tree: "pipe",
      foes: { k: "grabber", r: "spiny", b: "spinner", n: "grounder" }, far: "refinery", tint: 0xe8ecff },
    /* Neon Metropolis: the city of tomorrow by day, white towers, tubes, the highways in the air */
    metro: {
      sky: [0x2a7ae8, 0xc8f0ff], fog: [0xc0e4f6, 60, 320], sun: [0xf8faff, 0.95, [12, 32, 22]], hemi: [0xffffff, 0x8a9ab8, 0.65],
      top: [0x3a3e4a, 0x444854, 0x343844], drip: 0x7ad8ff, soil: [0xc8ccd8, 0xb8bcc8, 0xd8dce6], deep: 0x8a8e9a,
      block: [0xe8ecf4, 0xc8ccd8], blocks: "glass", neon: [0x7ad8ff, 0xffffff], plank: 0xc8ccd8, planks: "rail", water: 0x3ab8e8, crack: 0xa8acb8, back: 0x5a6070,
      tufts: [], flowers: [], lanes: true, hurdle: "barrier", tree: "streetlamp",
      foes: { k: "aotento", r: "akatento", b: "condor", n: "klagen" }, far: "metro" },
    /* Egg Fortress: his own fortress, plating and red girders, his face on every wall */
    fortress: {
      sky: [0x200a0a, 0x6a1e1e], fog: [0x3a1414, 40, 220], sun: [0xffd0c0, 0.7, [8, 30, 22]], hemi: [0xffd8d0, 0x3a1a1a, 0.72],
      top: [0x5a5a64, 0x64646e, 0x50505a], drip: 0xe84a3a, soil: [0x3a3a44, 0x34343e, 0x42424c], deep: 0x1e1e26,
      block: [0x6a6a74, 0x55555e], blocks: "hull", plank: 0x8a1e1e, planks: "girder", water: 0x3a5a8a, crack: 0x7a7a84, back: 0x1a1018,
      tufts: [], flowers: [], hurdle: "crate", tree: "console",
      foes: { k: "eklagen", r: "crawl", b: "mspinner", n: "slicer", p: "grabber" }, far: "fortress", tint: 0xf2e4e4 },
    /* Starfall Orbit: a white track in orbit, the world turning below, stars falling past */
    orbit: {
      sky: [0x000006, 0x0a0a2a], fog: [0x08081e, 60, 340], sun: [0xf0f4ff, 0.8, [10, 32, 22]], hemi: [0xe0e8ff, 0x1a1a30, 0.72],
      top: [0xc8ccd8, 0xd4d8e4, 0xbcc0cc], drip: 0x7ad8ff, soil: [0x3a3e52, 0x34384a, 0x42465c], deep: 0x1a1c2a,
      block: [0x2a3060, 0x3a4080], blocks: "glass", neon: [0xffd23a, 0x7ad8ff], plank: 0xe8c050, planks: "rail", water: 0x3a5ad8, crack: 0x6a6a8a, back: 0x0a0a18,
      tufts: [], flowers: [], stars: true, lanes: true, hurdle: "barrier", tree: "lamp",
      foes: { k: "starnaut", r: "crawl", b: "nebula", n: "balkiry" }, far: "orbit", tint: 0xe8eaff },
  };

  // ---------------------------------------------------------------- reading a stage
  /* A stage is as tall as its chunks (all of a stage's the same): the stages are 32 rows, room
     for a low road, a high one and the sky over both. H is the stage being run. */
  let H = 32;
  const SOLIDS = "#=XBImC{}";
  const ENTS = "PGKEc*JHS>rbknphMVUOT^Qo@Y";
  function parse(def) {
    const chunks = def.chunks.map(raw => {
      const lines = raw.split("\n");
      while (lines.length && !lines[0].trim()) lines.shift();
      while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
      return lines;
    });
    const H = chunks[0].length;
    const rows = Array.from({ length: H }, () => []);
    for (const lines of chunks) {
      if (lines.length !== H) throw new Error(def.id + ": a chunk has " + lines.length + " rows, not " + H);
      const w = Math.max(...lines.map(l => l.length));
      lines.forEach((l, r) => { for (let i = 0; i < w; i++) rows[r].push(!l[i] || l[i] === " " ? "." : l[i]); });
    }
    const W = rows[0].length;
    const grid = [];
    for (let j = 0; j < H; j++) grid.push(rows[H - 1 - j].slice());
    const ents = [];
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const c = grid[j][i];
      if (ENTS.indexOf(c) < 0) continue;
      if (c === "^") { ents.push({ t: c, i, j }); continue; }          // thorns stay in the grid
      if ((c === "M" || c === "V") && i > 0 && grid[j][i - 1] === c + "_") { grid[j][i] = "."; continue; }
      let len = 1;
      if (c === "M" || c === "V") { while (grid[j][i + len] === c) { grid[j][i + len] = c + "_"; len++; } }
      ents.push({ t: c, i, j, len });
      grid[j][i] = ".";
    }
    // anything placed in water is in water
    for (const e of ents) {
      const row = grid[e.j];
      if (e.t !== "^" && (row[e.i - 1] === "~" || row[e.i + 1] === "~" || (grid[e.j + 1] && grid[e.j + 1][e.i] === "~"))) row[e.i] = "~";
    }
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) if (grid[j][i].length > 1) grid[j][i] = ".";
    return { W, H, grid, ents };
  }

  // ---------------------------------------------------------------- drawing in voxels
  const GR = 0.25;                     // the ground's grain: four to a tile, the lobby building's
  const F = 1 / 16;                    // props: the racers' own
  const ZF = 4, ZB = -6, ZDEEP = -16;  // tile depth in grain: front face at 1.25m, back at -1.5m, the top strip to -4m
  let MAT = null;
  function materials() {
    if (MAT) return MAT;
    MAT = {
      vox: new THREE.MeshLambertMaterial({ vertexColors: true }),
      water: new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true, opacity: 0.58, depthWrite: false }),
      glow: new THREE.MeshBasicMaterial({ vertexColors: true }),
      cube: new THREE.MeshLambertMaterial({ color: 0xffffff }),
    };
    return MAT;
  }
  const jit = (rnd, c, a) => mulC(c, 1 - a + rnd() * a * 2);
  const pick = (rnd, a) => a[Math.floor(rnd() * a.length) % a.length];

  /* A block (=) in the theme's own make. `open`: nothing stands on it. */
  const hash2 = (i, j) => { let h = (i * 374761393 + j * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return (h ^ (h >>> 16)) >>> 0; };
  const BOOKS = [0xe8506a, 0x5a8ee0, 0xf2c040, 0x6ac06a, 0xa86ae0, 0xf08a40, 0x40b8c0, 0xf6f2e8];
  /* old glyphs cut in the shrine stone, 4x4, one bit a grain */
  const GLYPHS = [0x6996, 0xf99f, 0x4e4a, 0x9669, 0x2772, 0xa5a5, 0x7557, 0x0f60];
  function blockCol(T, i, j, sx, sy, z, rnd, open) {
    const B = T.block, front = z === ZF;
    switch (T.blocks) {
      case "steel": {                                    // riveted plate; a hazard stripe along a top that is stood on
        if (open && sy === 3 && front) return ((i * 4 + sx) & 3) < 2 ? 0xf2c030 : 0x2a2a30;
        if (front && (sx === 0 || sx === 3) && (sy === 0 || sy === 3)) return 0x5a6470;
        return sx === 0 || sy === 0 ? mulC(B[1], 0.9) : jit(rnd, B[0], 0.03);
      }
      case "books": {                                    // rows of books on end, two metres tall, a spine every two grains
        const k = hash2(i * 2 + (sx >> 1), j >> 1), spine = BOOKS[k % BOOKS.length], topRow = (j & 1) && sy === 3;
        if (topRow && !front) return (k & 4) ? 0xf6efe0 : 0xefe4cc;   // the pages, along the top of each row
        if (topRow) return mulC(spine, 0.78);
        if (front && !(j & 1) && sy === 1 && (k & 8)) return 0xe8c050;  // gold lettering
        return jit(rnd, spine, 0.03);
      }
      case "carved": {                                   // shrine stone, a glyph cut in the face, snow on top
        if (open && sy === 3) return jit(rnd, 0xf4f8fc, 0.02);
        if (front && (GLYPHS[hash2(i, j) % GLYPHS.length] >> (sy * 4 + sx)) & 1) return (hash2(j, i) & 3) === 0 ? 0x4ab87a : mulC(B[1], 0.62);
        return sx === 0 || sy === 0 ? mulC(B[1], 0.86) : jit(rnd, pick(rnd, B), 0.04);
      }
      case "glass": {                                    // dark tile, neon round the face (pink and blue; white and blue among the stars)
        if (front && (sx === 0 || sy === 0 || sx === 3 || sy === 3)) return (T.neon || [0xff5ac8, 0x7ad8ff])[(i + j) & 1 ? 0 : 1];
        return jit(rnd, pick(rnd, B), 0.04);
      }
      case "marble": {                                   // white marble, grey veins, a gilt band along a top that is stood on
        if (open && sy === 3 && front) return 0xd8b050;
        if (((sx * 3 + sy * 5 + i * 7 + j * 11) % 13) === 0) return 0xbab6ae;
        return sx === 0 || sy === 0 ? mulC(B[1], 0.96) : jit(rnd, B[0], 0.02);
      }
      case "mossy": {                                    // the old carved stone, moss over its top and down its face
        if (open && sy === 3) return jit(rnd, (hash2(i * 4 + sx, j) & 3) ? 0x4a9a54 : 0x3a7a44, 0.04);
        if (open && sy === 2 && front && (hash2(i * 4 + sx, j) & 1)) return 0x3e8a4a;
        if (front && (GLYPHS[hash2(i, j) % GLYPHS.length] >> (sy * 4 + sx)) & 1) return (hash2(j, i) & 3) === 0 ? 0x5ad8e8 : mulC(B[1], 0.62);
        return sx === 0 || sy === 0 ? mulC(B[1], 0.86) : jit(rnd, pick(rnd, B), 0.04);
      }
      case "sandstone": {                                // red rock laid down in bands
        const band = (j * 4 + sy) % 7;
        return jit(rnd, band < 2 ? mulC(B[1], 0.9) : band === 4 ? 0xe8a070 : B[0], 0.04);
      }
      case "ruin": {                                     // black concrete, cracked, the fire glowing in the cracks
        const k = hash2(i * 4 + sx, j * 4 + sy);
        if (front && k % 23 === 0) return 0xff8a3a;
        if (front && k % 23 === 1) return 0xd84a20;
        if (sy === 0 || (front && sx === 0)) return mulC(B[1], 0.8);
        return jit(rnd, pick(rnd, B), 0.05);
      }
      case "hull": {                                     // hull plating: panel seams, a light now and then, a warning stripe along a top
        if (open && sy === 3 && front) return ((i * 4 + sx) & 3) < 2 ? 0xe84a3a : 0x3a3c44;
        if (front && sx === 1 && sy === 1 && hash2(i, j) % 5 === 0) return hash2(j, i) & 1 ? 0x7ad8ff : 0xffb040;
        return sx === 0 || sy === 0 ? mulC(B[1], 0.82) : jit(rnd, B[0], 0.025);
      }
      case "concrete": {
        if (sy === 0 || (front && sx === 0)) return mulC(B[1], 0.82);
        if (rnd() < 0.03) return 0x8a7462;
        return jit(rnd, pick(rnd, B), 0.04);
      }
      default: {
        const edge = sx === 0 || sy === 0 || (front && (sx === 3 || sy === 3));
        return edge ? mulC(B[1], 0.9) : jit(rnd, pick(rnd, B), 0.05);
      }
    }
  }
  /* A plank (-), one way up, in the theme's make. */
  function plankVox(v, T, i, lx, ly, rnd) {
    const P = T.plank;
    switch (T.planks) {
      case "grate":                                      // steel grating: see through it
        for (let sx = 0; sx < 4; sx++) for (let z = ZB; z <= ZF; z++)
          if (sx === 0 || z === ZB || z === ZF || ((sx + z) & 1) === 0) v.set(lx + sx, ly + 3, z, jit(rnd, P, 0.04));
        if (i % 3 === 0) for (const z of [ZB, ZF]) v.box(lx + 1, ly + 1, z, lx + 1, ly + 2, z, mulC(P, 0.7));
        return;
      case "shelf":                                      // a white shelf on brass brackets
        for (let sx = 0; sx < 4; sx++) for (let z = ZB; z <= ZF; z++) v.set(lx + sx, ly + 3, z, jit(rnd, z === ZF ? mulC(P, 0.92) : P, 0.02));
        if (i % 3 === 0) for (const z of [ZB + 1, ZF - 1]) { v.set(lx + 1, ly + 2, z, 0xd8a840); v.set(lx + 1, ly + 1, z, 0xd8a840); }
        return;
      case "rail":                                       // a gold ledge, its edge lit
        for (let sx = 0; sx < 4; sx++) for (let z = ZB; z <= ZF; z++) v.set(lx + sx, ly + 3, z, z === ZF ? 0xfff0a0 : jit(rnd, P, 0.04));
        for (let sx = 0; sx < 4; sx++) v.set(lx + sx, ly + 2, ZF, mulC(P, 0.7));
        return;
      case "girder":                                     // a red I-beam: two flanges and the web
        for (let sx = 0; sx < 4; sx++) {
          for (let z = ZB; z <= ZF; z++) v.set(lx + sx, ly + 3, z, jit(rnd, P, 0.04));
          for (let z = ZB; z <= ZF; z += 1) if (z === ZB || z === ZF || z === -1) v.set(lx + sx, ly + 1, z, mulC(P, 0.8));
          v.set(lx + sx, ly + 2, -1, mulC(P, 0.7));
        }
        v.set(lx + 1, ly + 3, ZF, 0x5a1a14); v.set(lx + 3, ly + 3, ZF, 0x5a1a14);
        return;
      default:
        for (let sx = 0; sx < 4; sx++) for (let z = ZB; z <= ZF; z++) v.set(lx + sx, ly + 3, z, jit(rnd, ((z & 3) === 0) ? mulC(P, 0.8) : P, 0.05));
        if (i % 3 === 0) for (const z of [ZB + 1, ZF - 1]) v.set(lx + 1, ly + 2, z, mulC(P, 0.75));
    }
  }

  /** The ground, a chunk of sixteen tiles at a time. */
  function buildChunk(S, T, i0, i1) {
    const v = new Vox(), w = new Vox(), rnd = mulberry32(i0 * 7919 + 13);
    const g = (i, j) => (i < 0 || i >= S.W || j < 0 || j >= H) ? "." : S.grid[j][i];
    const solidish = c => SOLIDS.indexOf(c) >= 0 || c === "/" || c === "\\";
    for (let i = i0; i < i1; i++) for (let j = 0; j < H; j++) {
      const c = g(i, j), lx = (i - i0) * 4, ly = j * 4;
      if (c === "~") {
        const surf = g(i, j + 1) !== "~" && !solidish(g(i, j + 1));
        for (let sx = 0; sx < 4; sx++) for (let sy = 0; sy < 4; sy++) for (let z = ZB; z <= ZF; z++) {
          if (surf && sy === 3) continue;                              // the surface sits a little low
          w.set(lx + sx, ly + sy, z, surf && sy === 2 ? mixC(T.water, 0xffffff, 0.22) : jit(rnd, T.water, 0.05));
        }
        continue;
      }
      if (c === "#" || c === "=" || c === "I" || c === "m" || c === "/" || c === "\\") {
        const above = g(i, j + 1), open = !solidish(above) && above !== "~", wet = above === "~";
        const surface = c !== "=" && c !== "I" && open;
        /* buried ground shows only its front, unless a side of it faces open air */
        const buried = !open && solidish(g(i - 1, j)) && solidish(g(i + 1, j)) && c === "#";
        const z0 = surface ? ZDEEP : buried ? ZF - 1 : ZB;
        /* the top of a stretch of ground (or a block) with more under it and on both sides: only
           its top layer runs back; the rest is never seen but from the front */
        const thin = (c === "#" || c === "=") && solidish(g(i, j - 1)) && solidish(g(i - 1, j)) && solidish(g(i + 1, j));
        // how deep this tile is under the surface, for the soil's bands
        let depth = 0; while (depth < 5 && solidish(g(i, j + depth + 1))) depth++;
        for (let sx = 0; sx < 4; sx++) for (let sy = 0; sy < 4; sy++) {
          if (c === "/" && sy > sx) continue;
          if (c === "\\" && sy > 3 - sx) continue;
          const topHere = (c === "/" ? sy === sx : c === "\\" ? sy === 3 - sx : sy === 3);
          for (let z = (c === "/" || c === "\\") ? ZDEEP : thin && sy < 3 ? ZF - 2 : z0; z <= ZF; z++) {
            let col;
            if (c === "=") {
              col = blockCol(T, i, j, sx, sy, z, rnd, open);
            } else if (c === "I") {
              col = ((sx + sy + z) % 5 === 0) ? 0xf4fcff : jit(rnd, 0xbfe2f2, 0.04);
            } else if (c === "m" && topHere && open) {
              col = rnd() < 0.18 ? 0x8a6a48 : jit(rnd, 0x5e4028, 0.06);                 // wet, with a shine on it
            } else if (c === "m" && sy === 2 && z === ZF) {
              col = jit(rnd, 0x6a4a30, 0.06);
            } else if ((topHere && (open || c !== "#")) && !wet) {
              col = jit(rnd, pick(rnd, T.top), 0.06);
              if (T.checker && (((i * 4 + sx) >> 2) + ((z - ZDEEP) >> 2)) & 1) col = jit(rnd, T.checker, 0.03);   // a marble floor laid in squares
              /* a road: white dashes down the middle, a solid line along the far side */
              if (T.lanes && (z === -5 && ((i * 4 + sx) & 7) < 4 || z === ZDEEP + 2)) col = z === -5 ? 0xf2f0e8 : 0xe8c040;
            } else if (z === ZF && sy >= 2 && open && depth === 0 && !wet && rnd() < 0.55) {
              col = T.drip;                                          // the grass hangs over the front
            } else {
              const band = (depth * 4 + (3 - sy)) % 7 < 3 ? 0 : 1;
              col = jit(rnd, depth >= 3 ? T.deep : T.soil[band + (rnd() < 0.12 ? 1 : 0)], 0.07);
              if (T.checkSoil && depth < 3) col = jit(rnd, (((i * 4 + sx) >> 1) + ((ly + sy) >> 1)) & 1 ? T.soil[0] : T.soil[1], 0.03);   // the green hills' checkered soil
              if (rnd() < 0.015) col = 0x8a8a8e;                     // a stone
            }
            v.set(lx + sx, ly + sy, z, col);
          }
        }
        // what grows on top: tufts, the odd flower, along the strip behind
        if (open && c === "#" && !wet && T.tufts.length) for (let k = 0; k < 4; k++) {
          const sx = Math.floor(rnd() * 4), z = Math.floor(ZDEEP + rnd() * (ZF - ZDEEP - 1));
          if (rnd() < 0.5) continue;
          const fl = T.flowers.length && rnd() < 0.18;
          v.set(lx + sx, ly + 4, z, fl ? pick(rnd, T.flowers) : pick(rnd, T.tufts));
          if (!fl && rnd() < 0.4) v.set(lx + sx, ly + 5, z, pick(rnd, T.tufts));
        }
        continue;
      }
      if (c === "-") { plankVox(v, T, i, lx, ly, rnd); continue; }
      if (c === "{" || c === "}") {                                  // a conveyor belt: chevrons the way it runs
        const d = c === "}" ? 1 : -1;
        for (let sx = 0; sx < 4; sx++) for (let sy = 0; sy < 4; sy++) for (let z = ZB; z <= ZF; z++) {
          let col;
          if (sy === 3) col = (((i * 4 + sx) * -d + Math.abs(z + 1)) % 6 + 6) % 6 === 0 ? 0xf2c030 : jit(rnd, 0x2c2c34, 0.05);
          else if (sy === 0) col = 0x5a6470;
          else if (z === ZF || z === ZB) col = (sx === 1 || sx === 2) && (sy === 1 || sy === 2) ? 0x3a3e46 : 0x8a96a4;
          else col = 0x6a7480;
          v.set(lx + sx, ly + sy, z, col);
        }
        continue;
      }
      /* a cave: an empty tile with ground just above it (or a roof two thick) gets a back
         wall -- not the open air under a ledge */
      if (c !== "~") {
        let roofed = false;
        for (let k = 1; k <= 2; k++) {
          const r = g(i, j + k);
          if (SOLIDS.indexOf(r) >= 0) { roofed = r === "#" || r === "X" || SOLIDS.indexOf(g(i, j + k + 1)) >= 0; break; }
        }
        /* indoors (the hangar, a vault): anything under a roof of blocks has a wall behind it */
        if (!roofed && T.indoors) for (let k = 1; k <= T.indoors; k++) if ("=X".indexOf(g(i, j + k)) >= 0 && "=X".indexOf(g(i, j + k + 1)) >= 0) { roofed = true; break; }
        if (roofed) for (let sx = 0; sx < 4; sx++) for (let sy = 0; sy < 4; sy++) v.set(lx + sx, ly + sy, ZB, jit(rnd, T.back, 0.08));
      }
    }
    const out = [];
    /* faces nobody sees go: every back face (the camera is always in front), and an underside
       with ground under it (the hollow inside a stretch of ground) */
    const keep = (x, y, z, nx, ny, nz) => nz >= 0 && !(ny < 0 && "#=Im{}".indexOf(g(i0 + (x >> 2), (y - 1) >> 2)) >= 0);   // never over something that can break
    if (v.m.size) { const m = new THREE.Mesh(meshVox(v, GR, keep), materials().vox); m.position.x = i0; m.receiveShadow = true; m.castShadow = true; out.push(m); }
    if (w.m.size) { const m = new THREE.Mesh(meshVox(w, GR), materials().water); m.position.x = i0; m.renderOrder = 2; out.push(m); }
    return out;
  }

  /* The ground runs on past either end of the stage at the height it starts and finishes,
     and every column that reaches the bottom row goes on down out of sight. */
  function skirts(S, T) {
    const v = new Vox(), rnd = mulberry32(77), g = new THREE.Group();
    const topOf = i => { for (let j = H - 1; j >= 0; j--) if (SOLIDS.indexOf(S.grid[j][i]) >= 0) return j + 1; return 0; };
    const strip = (x0, x1, top) => {
      const m = new Vox();
      for (let x = 0; x < (x1 - x0) * 4; x++) for (let y = -12; y < top * 4; y++) for (let z = (y >= top * 4 - 4 ? ZDEEP : ZF - 2); z <= ZF; z++)
        m.set(x, y, z, y === top * 4 - 1 ? jit(rnd, pick(rnd, T.top), 0.06) : jit(rnd, y > top * 4 - 12 ? T.soil[(y >> 2) & 1] : T.deep, 0.07));
      const mesh = new THREE.Mesh(meshVox(m, GR), materials().vox); mesh.position.x = x0; mesh.receiveShadow = true; g.add(mesh);
    };
    strip(-14, 0, topOf(0)); strip(S.W, S.W + 14, topOf(S.W - 1));
    for (let i0 = 0; i0 < S.W; i0 += 64) {
      for (let i = i0; i < Math.min(S.W, i0 + 64); i++) {
        if (SOLIDS.indexOf(S.grid[0][i]) < 0 && S.grid[0][i] !== "/" && S.grid[0][i] !== "\\") continue;
        for (let sx = 0; sx < 4; sx++) for (let y = -12; y < 0; y++) for (let z = ZF - 1; z <= ZF; z++)
          v.set((i - i0) * 4 + sx, y, z, jit(rnd, T.deep, 0.07));
      }
      const mesh = new THREE.Mesh(meshVox(v, GR), materials().vox); mesh.position.x = i0; g.add(mesh);
      v.m.clear();
    }
    return g;
  }

  /** One tile on its own -- cracked rock, a crate, a crumbling ledge -- so it can go. */
  function tileGeo(kind, T) {
    const v = new Vox(), rnd = mulberry32(kind.charCodeAt(0) * 31);
    for (let sx = 0; sx < 4; sx++) for (let sy = 0; sy < 4; sy++) for (let z = ZB; z <= ZF; z++) {
      let col;
      if (kind === "X") {
        col = jit(rnd, T.crack, 0.07);
        if ((z === ZF || z === ZB) && (sx === sy || sx === 3 - sy && sy > 1)) col = mulC(T.crack, 0.45);
      } else if (kind === "B") {
        const frame = sx === 0 || sx === 3 || sy === 0 || sy === 3;
        col = frame ? 0x8a5a2c : ((sx + sy) % 2 ? 0xc8904a : 0xb8803e);
        if (z !== ZF && z !== ZB && !frame) col = 0xb8803e;
      } else {
        if (sy < 2) continue;
        col = sy === 3 ? jit(rnd, T.block[0], 0.06) : jit(rnd, mulC(T.block[1], 0.85), 0.06);
        if (z === ZF && (sx + z) % 3 === 0 && sy === 2) col = mulC(T.block[1], 0.55);
      }
      v.set(sx, sy, z, col);
    }
    return meshVox(v, GR);
  }

  // ---------------------------------------------------------------- props, at the racers' grain
  function vox(fn, scale) { const v = new Vox(); fn(v); return meshVox(v, scale || F); }
  const PROPS = {};
  function propGeo(name, T) {
    const key = name + (T ? ":" + T.id : "");
    if (PROPS[key]) return PROPS[key];
    let g;
    switch (name) {
      case "ring": g = vox(v => ringVox(v, 0, 6, 5, 3.6, [0xf2b705, 0xfff3a0, 0xd89a00])); break;   // a gold ring, as every Sonic stage strews them
      case "powerring": g = vox(v => {                 // the grand prix's Red Ring: red, a white glint, no star
        ringVox(v, 0, 8, 7.5, 5.6, [0xe42630, 0xff8a8a, 0xa8141c]);
        v.box(-1, 12, 1, 0, 13, 2, 0xffffff);
      }); break;
      case "redring": g = vox(v => {                   // a Red Star Ring: a big red ring, a gold star in it
        ringVox(v, 0, 8, 7.5, 5.6, [0xe42630, 0xff8a8a, 0xa8141c]);
        starVox(v, 0, 8, 3.6, 0xffd21a);
      }); break;
      case "monitor_ring": case "monitor_shield": case "monitor_star": case "monitor_speed": g = vox(v => monitorVox(v, name.slice(8))); break;
      case "bird": g = vox(v => {                       // a little blue bird out of a badnik, as in the classic games
        v.box(-2, 1, -1, 2, 4, 1, 0x3a8ae0); v.box(-1, 2, -1, 1, 3, 1, 0x5aa8f0); v.box(2, 3, -1, 3, 5, 1, 0x3a8ae0);
        v.set(3, 5, 1, 0xffffff); v.set(4, 4, 0, 0xf2b705); v.box(-3, 2, -2, -1, 4, -2, 0x2a6ac0); v.box(-1, 0, 0, 0, 0, 0, 0xf2b705);
      }); break;
      case "bunny": g = vox(v => {                      // a little rabbit, hopping off
        v.box(-2, 0, -1, 2, 3, 1, 0xf0e6d8); v.box(1, 3, -1, 3, 5, 1, 0xf0e6d8); v.box(1, 6, 0, 1, 8, 0, 0xf0e6d8); v.box(3, 6, 0, 3, 8, 0, 0xf0e6d8);
        v.set(3, 5, 1, 0x2a2a2a); v.set(-3, 2, 0, 0xffffff); v.box(1, 7, 1, 1, 7, 1, 0xf0a8b8);
      }); break;
      /* a spring, in voxels after Sonic Advance 3's: a red base, a silver coil (its own part, so
         it can stretch), a red cap with a gold rim round the top */
      case "springBase": g = vox(v => vdisc(v, 0, 2, 6.5, (x, y, z, d) => y === 2 && d > 5.2 ? 0xff5a3a : d > 5.6 ? 0xa8141c : 0xd8261e)); break;
      case "springCoil": g = vox(v => {
        for (let y = 0; y < 8; y++) vdisc(v, y, y, y % 2 ? 4.4 : 3.6, (x, yy, z, d) => d < 2.4 ? null : y % 2 ? (x < 0 ? 0xf2f4fa : 0xb8bcc8) : 0x585c68);
      }); break;
      case "springCap": g = vox(v => vdisc(v, 0, 3, 7.5, (x, y, z, d) => {
        if (y === 3) return d > 6.2 ? 0xffd21a : d > 4.6 ? 0xff8a10 : 0xe8302a;   // the top: a gold rim round red
        if (y === 0) return 0x8a1014;
        return x < -2 && z > 0 ? 0xff6a4a : d > 6.6 ? 0xb81c1c : 0xe02a24;
      })); break;
      case "dash": g = vox(v => {
        v.box(-7, 0, -10, 8, 0, 9, 0x2a2a34);
        for (const ox of [-6, 0, 6]) for (let k = 0; k < 4; k++) { v.box(ox + k - 2, 1, -6 + k, ox + k - 2, 1, -6 + k + 1, 0xf2d040); v.box(ox + k - 2, 1, 5 - k, ox + k - 2, 1, 5 - k + 1, 0xf2d040); }
      }); break;
      case "pole": case "poleDone": g = vox(v => {     // a Star Post: a grey post, its lamp blue till it is passed, then red
        v.box(-1, 0, -1, 0, 30, 0, 0x9aa0ac); v.box(-3, 0, -3, 2, 1, 2, 0x6a6e78); v.box(-2, 30, -2, 1, 31, 1, 0x6a6e78);
        const c = name === "poleDone" ? [0xe42630, 0xff8a8a] : [0x2a6ae0, 0x9ac8ff];
        for (let x = -4; x <= 3; x++) for (let y = -4; y <= 3; y++) for (let z = -4; z <= 3; z++) {
          const d = Math.hypot(x + 0.5, y + 0.5, z + 0.5);
          if (d <= 4.2) v.set(x, 36 + y, z, x < -1 && y > 0 ? c[1] : c[0]);
        }
      }); break;
      case "goal": g = vox(v => {                      // the goal signpost: a grey post, a round sign that spins when passed
        v.box(-1, 0, -1, 0, 46, 0, 0x9aa0ac); v.box(-3, 0, -3, 2, 1, 2, 0x6a6e78);
        for (let x = -11; x <= 10; x++) for (let y = -11; y <= 10; y++) {
          const d = Math.hypot(x + 0.5, y + 0.5);
          if (d > 11) continue;
          const col = d > 9.4 ? 0xf2f2f2 : d > 8.2 ? 0x050a22 : 0x1f58e0;
          v.box(x, 58 + y, -1, x, 58 + y, 0, col);
        }
        starVox(v, 0, 58, 6, 0xffd21a, 1);
      }); break;
      case "relic": g = vox(v => {                     // a story stage's end: a Red Star Ring on a stone plinth
        v.box(-9, 0, -7, 8, 3, 6, 0x8a8a96); v.box(-7, 4, -5, 6, 17, 4, 0xbcbcc8); v.box(-9, 18, -7, 8, 20, 6, 0x8a8a96);
        ringVox(v, 0, 32, 11, 8, [0xe42630, 0xff8a8a, 0xa8141c]);
        starVox(v, 0, 32, 5.5, 0xffd21a);
      }); break;
      case "hurdle": g = vox(v => hurdleVox(v, T ? T.hurdle : "brush")); break;
      case "vent": g = vox(v => { v.box(-5, 0, -5, 4, 2, 4, 0x6a7078); v.box(-3, 2, -3, 2, 3, 2, 0x2a2e34); }); break;
      case "bubble": g = vox(v => {
        for (let x = -4; x <= 4; x++) for (let y = -4; y <= 4; y++) for (let z = -4; z <= 4; z++) {
          const d = Math.hypot(x, y, z);
          if (d < 4.4 && d > 3.2) v.set(x, y, z, (x < -1 && y > 1) ? 0xffffff : 0xbfeaff);
        }
      }); break;
      case "balloon": g = vox(v => {                   // a balloon on a string: a heart in Amy's home, round elsewhere
        const C = (T && T.balloon) || [0xff5a5a, 0xffb0a8], heart = T && T.id === "parlour";
        for (let x = -8; x <= 8; x++) for (let y = -8; y <= 9; y++) for (let z = -4; z <= 4; z++) {
          let inside;
          if (heart) { const X = x / 7.5, Y = (y + 1) / 7.5, k = X * X + Y * Y - 1; inside = k * k * k - X * X * Y * Y * Y <= 0 && Math.abs(z) <= 4 - Math.abs(x) / 4; }
          else inside = Math.hypot(x, y * 0.9, z * 1.6) <= 7;
          if (inside) v.set(x, y, z, (x < -2 && y > 2 && z > 1) ? C[1] : C[0]);
        }
        v.box(0, -10, 0, 0, -9, 0, mulC(C[0], 0.7));
        for (let y = -20; y < -10; y++) v.set(Math.round(Math.sin(y * 0.6)), y, 0, 0xf6f6f2);
      }); break;
      case "bumper": g = vox(v => {                    // a round bumper on the wall behind: ringed, a star in the middle
        const ring = T && T.id === "club" ? 0xff5ac8 : 0xd8303a;
        for (let x = -10; x <= 10; x++) for (let y = -10; y <= 10; y++) {
          const d = Math.hypot(x, y); if (d > 10.4) continue;
          const a = Math.atan2(y, x), star = d < 6.5 * (0.55 + 0.45 * Math.abs(Math.cos(a * 2.5)));
          for (let z = -3; z <= (d < 8 ? 2 : 1); z++) v.set(x, y, z, d > 8 ? ring : d > 7 ? 0xf6f6f2 : star ? 0xf2c030 : 0x3a2a5a);
        }
      }); break;
      case "tree": g = vox(v => treeVox(v, T), 1 / 12); break;
    }
    return (PROPS[key] = g);
  }
  /* h: something across the course to jump, or smash. */
  /* a solid disc, lying flat, rows y0 to y1, radius r; col(x, y, z, d) picks the colour (or null) */
  function vdisc(v, y0, y1, r, col) {
    const n = Math.ceil(r);
    for (let y = y0; y <= y1; y++) for (let x = -n; x < n; x++) for (let z = -n; z < n; z++) {
      const d = Math.hypot(x + 0.5, z + 0.5);
      if (d > r) continue;
      const c = col(x, y, z, d);
      if (c != null) v.set(x, y, z, c);
    }
  }
  /* a ring of voxels on its edge, facing the camera: radius r1 outside, r0 inside, lit at the
     top left (C: face, light, shade) */
  function ringVox(v, cx, cy, r1, r0, C) {
    const n = Math.ceil(r1);
    for (let x = -n; x <= n; x++) for (let y = -n; y <= n; y++) {
      const d = Math.hypot(x, y);
      if (d > r1 || d < r0) continue;
      const a = Math.atan2(y, x), col = a > 1.6 && a < 2.9 ? C[1] : a < -0.6 && a > -2.4 ? C[2] : C[0];
      v.box(cx + x, cy + y, -1, cx + x, cy + y, 0, col);
    }
  }
  /* a five-pointed star, flat, facing the camera, `dz` forward of the face */
  function starVox(v, cx, cy, R, col, dz) {
    const n = Math.ceil(R), pts = [];
    for (let k = 0; k < 10; k++) { const a = PI / 2 + k * PI / 5, r = k % 2 ? R * 0.42 : R; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
    const inside = (x, y) => { let c = false; for (let i = 0, j = 9; i < 10; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
    for (let x = -n; x <= n; x++) for (let y = -n; y <= n; y++) if (inside(x, y)) v.set(cx + x, cy + y, dz || 0, col);
  }
  /* An item monitor -- Sonic's TV of a box -- on its little stand, its screen showing what is
     in it: ten rings, a shield, invincibility's stars, the speed shoes. */
  function monitorVox(v, kind) {
    v.box(-6, 0, -4, 5, 1, 3, 0x6a6e78);
    v.box(-6, 2, -4, 5, 13, 3, 0xc8ccd6); v.box(-6, 13, -4, 5, 13, 3, 0xe8ecf4);
    v.box(-5, 4, 3, 4, 11, 4, 0x182040);
    if (kind === "ring") ringVox({ box: (a, b, c, d, e, f, col) => v.box(a, b, 5, d, e, 5, col) }, 0, 7.5, 3.2, 1.6, [0xf2b705, 0xfff3a0, 0xd89a00]);
    else if (kind === "shield") { for (let x = -3; x <= 3; x++) for (let y = -3; y <= 3; y++) if (Math.hypot(x, y) <= 3.2) v.set(x, 8 + y, 5, Math.hypot(x, y) > 2.2 ? 0x6ac8ff : 0x2a6ae0); }
    else if (kind === "star") { starVox(v, -1, 9, 2.6, 0xffd21a, 5); v.set(2, 6, 5, 0xff6ad8); v.set(3, 9, 5, 0x6affb0); v.set(-3, 5, 5, 0xffffff); }
    else { v.box(-3, 5, 5, 2, 6, 5, 0xe42630); v.box(-3, 7, 5, -1, 9, 5, 0xe42630); v.box(-3, 5, 5, 2, 5, 5, 0xffffff); v.set(1, 7, 5, 0xffffff); }
  }
  const HURDLE_C = { brush: [0x3a7e32, 0x2a6a2a, 0xf6f6f2], barrier: [0xd8303a, 0xf6f6f2, 0x8a8a92], books: BOOKS.slice(0, 4),
                     cairn: [0x8a8478, 0x6a645a, 0xf4f8fc], rope: [0xb01e3a, 0xe8c050, 0x7a1428],
                     stones: [0x7e786c, 0x5a544a, 0x4a9a54], crate: [0xc8904a, 0x8a5a2c, 0xe0b070] };
  function hurdleVox(v, kind) {
    switch (kind) {
      case "barrier":                                  // a road barrier: striped boards on white trestles, a lamp at each end
        for (const z of [-17, 16]) { v.box(-2, 0, z, 2, 1, z + 1, 0x8a8a92); v.box(-1, 2, z, 0, 15, z + 1, 0xf0f0ea); v.box(-1, 16, z, 0, 17, z + 1, 0xf2b020); }
        for (const [y0, y1] of [[4, 7], [10, 13]]) for (let z = -18; z <= 18; z++) v.box(-1, y0, z, 0, y1, z, ((z + 18) >> 2) & 1 ? 0xf6f6f2 : 0xd8303a);
        return;
      case "books": {                                  // books standing in a row, as on a shelf
        let z = -18, k = 0;
        while (z < 18) {
          const t = 2 + (k % 3 === 0 ? 1 : 0), h = 11 + ((k * 7) % 5), c = BOOKS[(k * 5) % BOOKS.length];
          v.box(-3, 0, z, 3, h, z + t - 1, c); v.box(-2, h, z, 2, h, z + t - 1, 0xf6efe0); v.box(3, 2, z, 3, 2, z + t - 1, 0xe8c050);
          z += t; k++;
        }
        return;
      }
      case "cairn":                                    // stones piled up, snow on the top
        for (let y = 0; y < 15; y++) {
          const layer = Math.floor(y / 3), rz = 18 - layer * 2, rx = 3 - (layer > 2 ? 1 : 0);
          for (let z = -rz; z <= rz; z++) for (let x = -rx; x <= rx; x++) {
            const edge = y % 3 === 2 && (Math.abs(z) + layer * 3) % 7 === 0;
            v.set(x, y, z, y >= 13 ? 0xf4f8fc : edge ? 0x5a544a : ((x + z + y) % 5 === 0 ? 0x9a9488 : 0x7e786c));
          }
        }
        return;
      case "stones":                                   // stones piled up by the old shrine, moss on the top
        for (let y = 0; y < 15; y++) {
          const layer = Math.floor(y / 3), rz = 18 - layer * 2, rx = 3 - (layer > 2 ? 1 : 0);
          for (let z = -rz; z <= rz; z++) for (let x = -rx; x <= rx; x++) {
            const edge = y % 3 === 2 && (Math.abs(z) + layer * 3) % 7 === 0;
            v.set(x, y, z, y >= 13 ? ((x + z) & 1 ? 0x4a9a54 : 0x3e8a4a) : edge ? 0x5a544a : ((x + z + y) % 5 === 0 ? 0x9a9488 : 0x7e786c));
          }
        }
        return;
      case "crate":                                    // crates stacked, two and one: smash them
        for (const [y0, y1, z0, z1] of [[0, 10, -18, -1], [0, 10, 0, 17], [11, 18, -9, 8]]) {
          v.box(-3, y0, z0, 3, y1, z1, 0xc8904a);
          v.box(-3, y0, z1, 3, y0, z1, 0x8a5a2c); v.box(-3, y1, z1, 3, y1, z1, 0x8a5a2c);
          for (let y = y0; y <= y1; y++) { v.set(-3, y, z1, 0x8a5a2c); v.set(3, y, z1, 0x8a5a2c); v.set(0, y, z1, 0xa8743a); }
          v.box(-3, y1, z0, 3, y1, z1, 0xd8a060);
        }
        return;
      case "rope":                                     // a velvet rope between brass posts
        for (const z of [-17, 16]) { v.box(-2, 0, z - 1, 2, 1, z + 2, 0xc8a040); v.box(-1, 2, z, 0, 15, z + 1, 0xe8c050); v.box(-1, 16, z, 0, 17, z + 1, 0xfff0a0); }
        for (let z = -16; z <= 15; z++) { const y = Math.round(13 - 4 * (1 - (z / 16) * (z / 16))); v.box(-1, y - 1, z, 0, y, z, 0xb01e3a); }
        return;
      default:                                         // a brush hurdle: green brush in a white frame
        v.box(-3, 0, -18, 3, 1, 18, 0xf6f6f2);
        for (let z = -16; z <= 16; z++) for (let y = 2; y < 15; y++) for (let x = -2; x <= 2; x++) {
          if (y > 12 && ((z + x * 3) & 3) === 0) continue;
          v.set(x, y, z, ((x + y + z) % 4 === 0) ? 0x2a6a2a : ((y * 3 + z) % 5 === 0 ? 0x4a9a3a : 0x3a7e32));
        }
        for (const z of [-18, 18]) v.box(-3, 0, z, 3, 15, z, 0xf6f6f2);
        v.box(-3, 15, -18, 3, 15, 18, 0xf6f6f2);
    }
  }
  /* T: what stands along the back of the course, at a twelfth of a metre. */
  function treeVox(v, T) {
    switch (T.tree) {
      case "windsock": {                               // a windsock on its mast, blown out by the sea breeze
        v.box(-3, 0, -3, 2, 1, 2, 0x8a8a92);
        v.box(-1, 2, -1, 0, 44, 0, 0xe8e8e2);
        v.box(-2, 42, -2, 1, 43, 1, 0x6a6a72);
        for (let s = 0; s < 18; s++) {
          const r = 3.6 - s * 0.13, cy = 41 - s * 0.12, col = Math.floor(s / 4) % 2 ? 0xf6f6f2 : 0xf08a24;
          for (let a = 0; a < 24; a++) { const t = a / 24 * PI * 2; v.set(1 + s, Math.round(cy + Math.sin(t) * r), Math.round(Math.cos(t) * r), col); }
        }
        return;
      }
      case "plant": {                                  // a pot of tulips on the floor
        for (let y = 0; y < 13; y++) { const r = 6 + Math.floor(y / 5); for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) if (Math.hypot(x, z) <= r) v.set(x, y, z, y === 9 || y === 10 ? 0xf4a8c4 : 0xd8784a); }
        for (let x = -6; x <= 6; x++) for (let z = -6; z <= 6; z++) if (Math.hypot(x, z) <= 6) v.set(x, 13, z, 0x6a4a32);
        const F = [[-3, 30, 0, 0xff5a8a], [2, 34, -2, 0xf2c030], [4, 27, 3, 0xffffff], [-1, 37, 2, 0xe8304a], [-5, 25, -3, 0xff8ab0]];
        for (const [fx, fy, fz, c] of F) {
          for (let y = 14; y < fy; y++) v.set(Math.round(fx * (y - 14) / (fy - 14)), y, Math.round(fz * (y - 14) / (fy - 14)), 0x4a9a3a);
          v.box(fx - 2, fy, fz - 2, fx + 2, fy + 4, fz + 2, c); v.box(fx - 1, fy + 5, fz - 1, fx + 1, fy + 5, fz + 1, c);
          v.box(fx - 1, fy + 1, fz - 1, fx + 1, fy + 4, fz + 1, mulC(c, 0.85));
        }
        for (const s of [-1, 1]) for (let k = 0; k < 9; k++) v.box(s * (2 + k), 14 + k * 1.2 | 0, 0, s * (2 + k), 15 + k * 1.2 | 0, 1, 0x5ab84a);
        return;
      }
      case "pillar": {                                 // a carved pillar of the old shrines, snow on its head
        v.box(-6, 0, -6, 5, 3, 5, 0xa89e88);
        for (let y = 4; y < 38; y++) for (let x = -4; x <= 3; x++) for (let z = -4; z <= 3; z++) {
          if (x > -4 && x < 3 && z > -4 && z < 3) continue;
          const band = y % 9 < 2, glyph = !band && z === 3 && ((x * 7 + y * 3) % 5 === 0);
          v.set(x, y, z, band ? 0x948a74 : glyph ? 0x4ab87a : ((x + y) % 4 === 0 ? 0xb4aa94 : 0xc4baa4));
        }
        v.box(-6, 38, -6, 5, 41, 5, 0xa89e88); v.box(-6, 42, -6, 5, 43, 5, 0xf4f8fc); v.box(-4, 44, -4, 3, 44, 3, 0xfafcff);
        return;
      }
      case "column": {                                 // a marble column, fluted, a gilt band at its head
        v.box(-7, 0, -7, 6, 3, 6, 0xdcd4c8); v.box(-6, 4, -6, 5, 5, 5, 0xe8e2d8);
        for (let y = 6; y < 44; y++) for (let x = -5; x <= 4; x++) for (let z = -5; z <= 4; z++) {
          const r = Math.hypot(x + 0.5, z + 0.5); if (r > 5.2 || r < 3.6) continue;
          v.set(x, y, z, Math.round(Math.atan2(z + 0.5, x + 0.5) * 4) & 1 ? 0xe4ded2 : 0xf4f0e8);
        }
        v.box(-6, 44, -6, 5, 45, 5, 0xd8b050); v.box(-7, 46, -7, 6, 48, 6, 0xf2eee6);
        return;
      }
      case "lantern": {                                // a stone lantern of the old shrine, lit, moss on its roof
        v.box(-5, 0, -5, 4, 2, 4, 0x7a827c); v.box(-2, 3, -2, 1, 16, 1, 0x8a928c); v.box(-5, 17, -5, 4, 18, 4, 0x7a827c);
        v.box(-4, 19, -4, 3, 25, 3, 0x8a928c); v.box(-3, 20, 3, 2, 24, 3, 0xffe8a0); v.box(-3, 20, -4, 2, 24, -4, 0xffe8a0);
        v.box(-7, 26, -7, 6, 27, 6, 0x6a726c); v.box(-5, 28, -5, 4, 29, 4, 0x4a8a54); v.box(-1, 30, -1, 0, 32, 0, 0x7a827c);
        return;
      }
      case "cactus": {                                 // a saguaro, an arm up either side
        for (let y = 0; y < 40; y++) v.box(-2, y, -2, 2, y, 2, y % 3 ? 0x4a8a3a : 0x3a7a2e);
        v.box(-1, 40, -1, 1, 41, 1, 0x5a9a48);
        for (const [sd, y0, h] of [[-1, 14, 14], [1, 20, 12]]) {
          for (let x = 3; x <= 6; x++) v.box(sd * x - 1, y0, -1, sd * x + 1, y0 + 2, 1, 0x4a8a3a);
          for (let y = y0; y < y0 + h; y++) v.box(sd * 6 - 1, y, -1, sd * 6 + 1, y, 1, y % 3 ? 0x4a8a3a : 0x3a7a2e);
        }
        return;
      }
      case "crates": {                                 // crates stacked up, stencilled
        for (const [cx, cy, cz] of [[0, 0, 0], [12, 0, 0], [6, 11, 0], [-12, 0, -2]]) {
          v.box(cx - 5, cy, cz - 5, cx + 5, cy + 10, cz + 5, 0xb07e40);
          v.box(cx - 5, cy, cz + 5, cx + 5, cy, cz + 5, 0x7a522a); v.box(cx - 5, cy + 10, cz + 5, cx + 5, cy + 10, cz + 5, 0x7a522a);
          v.box(cx - 2, cy + 4, cz + 6, cx + 2, cy + 6, cz + 6, 0x2a2a2a);
        }
        return;
      }
      case "console": {                                // a console, its screen lit, its buttons
        v.box(-8, 0, -5, 7, 14, 4, 0x6a707a); v.box(-8, 15, -5, 7, 16, 0, 0x5a606a);
        v.box(-7, 17, -5, 6, 30, -3, 0x4a505a); v.box(-6, 18, -2, 5, 29, -2, 0x3ad8a0);
        for (let k = 0; k < 4; k++) v.set(-6 + k * 3, 15, 3, [0xe84a3a, 0xf2c030, 0x7ad8ff, 0x6ac06a][k]);
        return;
      }
      case "lamp": case "streetlamp": {                // a lamp: ornate on the strip, tall and plain on the road
        if (T.tree === "lamp") {
          v.box(-3, 0, -3, 2, 2, 2, 0x2a2430); v.box(-1, 3, -1, 0, 34, 0, 0x2a2430);
          for (const y of [10, 22, 33]) v.box(-2, y, -2, 1, y, 1, 0xe8c050);
          v.box(-3, 35, -3, 2, 41, 2, 0xfff2b0); v.box(-4, 42, -4, 3, 43, 3, 0x2a2430); v.box(-1, 44, -1, 0, 46, 0, 0xe8c050);
        } else {
          v.box(-2, 0, -2, 1, 2, 1, 0x6a6a72); v.box(-1, 3, -1, 0, 56, 0, 0x8a8a92);
          for (let x = 0; x < 12; x++) v.set(x, 56 + Math.floor(x / 4), 0, 0x8a8a92);
          v.box(9, 57, -2, 15, 59, 1, 0x6a6a72); v.box(10, 56, -1, 14, 56, 0, 0xfff2c8);
        }
        return;
      }
      case "totem": {                                  // a totem pole of the green hills: stacked faces, wings out at the top
        const C = [0xd8402a, 0x3a7ae0, 0xf2c030, 0x3aa84a];
        for (let k = 0; k < 5; k++) {
          const y0 = k * 8, c = C[k % C.length];
          v.box(-4, y0, -4, 3, y0 + 7, 3, c); v.box(-4, y0 + 7, -4, 3, y0 + 7, 3, mulC(c, 0.7));
          v.box(-3, y0 + 4, 4, -2, y0 + 5, 4, 0xffffff); v.box(1, y0 + 4, 4, 2, y0 + 5, 4, 0xffffff);
          v.set(-2, y0 + 4, 4, 0x1a1a1a); v.set(1, y0 + 4, 4, 0x1a1a1a); v.box(-2, y0 + 1, 4, 1, y0 + 2, 4, 0x2a1a1a);
        }
        for (const s of [-1, 1]) for (let k = 0; k < 9; k++) v.box(s * (4 + k), 34 + (k >> 1), -1, s * (4 + k), 37 + (k >> 1), 1, k % 3 ? 0xf2c030 : 0xd8402a);
        return;
      }
      case "mushroom": {                               // a giant mushroom: a cream stalk, a red cap spotted white, the gills under it
        for (let y = 0; y < 30; y++) { const r = y < 3 ? 5 : 3; for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) if (Math.hypot(x, z) <= r) v.set(x, y, z, (x + y) % 5 ? 0xf2e6c8 : 0xe0d0aa); }
        for (let y = 0; y < 10; y++) {
          const r = 15 - Math.round(y * y * 0.14);
          for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) {
            const d = Math.hypot(x, z); if (d > r || (d < r - 2 && y < 9 && y > 0)) continue;
            v.set(x, 30 + y, z, y === 0 ? 0xe8d8b0 : ((x * 3 + z * 5 + y * 7) % 23 === 0 || (Math.abs(x) % 9 === 4 && Math.abs(z) % 7 === 3)) ? 0xffffff : 0xd8302a);
          }
        }
        return;
      }
      case "pine": {                                   // a pine, snow on each tier
        v.box(-1, 0, -1, 1, 8, 1, 0x6a4a2e);
        for (let t = 0; t < 4; t++) {
          const y0 = 6 + t * 9, r0 = 11 - t * 2;
          for (let y = 0; y < 10; y++) { const r = Math.round(r0 * (1 - y / 10)); for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) if (Math.abs(x) + Math.abs(z) <= r) v.set(x, y0 + y, z, y === 0 || (Math.abs(x) + Math.abs(z) >= r - 1 && y < 3) ? 0xf4f8fc : (x + z) % 3 ? 0x2a6a3a : 0x225a30); }
        }
        v.box(0, 46, 0, 0, 47, 0, 0xffffff);
        return;
      }
      case "crystal": {                                // a cluster of ice crystals, three leaning out of the rock
        v.box(-6, 0, -5, 5, 2, 4, 0x2a4a6a);
        for (const [cx, lean, h, c] of [[0, 0, 40, 0x9ae6ff], [-5, -0.35, 26, 0x7ad0f4], [5, 0.3, 30, 0xbff2ff]]) {
          for (let y = 0; y < h; y++) { const r = y > h - 6 ? Math.max(0, 2 - ((y - h + 6) >> 1)) : 2, x0 = cx + Math.round(lean * y);
            for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) v.set(x0 + x, 3 + y, z, x === r || z === r ? 0xffffff : c); }
        }
        return;
      }
      case "lollipop": {                               // a lollipop, taller than a runner, its swirl in two colours
        v.box(-1, 0, -1, 0, 26, 0, 0xfaf6ee);
        for (let x = -10; x <= 10; x++) for (let y = -10; y <= 10; y++) {
          const d = Math.hypot(x, y); if (d > 10) continue;
          const a = Math.atan2(y, x) + d * 0.55;
          for (let z = -2; z <= 1; z++) v.set(x, 37 + y, z, d > 9.2 ? 0xffffff : Math.floor(a / PI * 2 + 8) % 2 ? 0xff5a9a : 0xfff0f6);
        }
        return;
      }
      case "pipe": {                                   // a pipe up out of the floor: a valve wheel, an elbow, a stripe
        for (let y = 0; y < 34; y++) for (let x = -3; x <= 3; x++) for (let z = -3; z <= 3; z++) if (Math.hypot(x, z) <= 3.3) v.set(x, y, z, y % 12 === 10 ? 0xf2c030 : (x + 2) % 4 ? 0x8a929c : 0x9aa2ac);
        for (let x = 0; x < 12; x++) for (let y = -3; y <= 3; y++) for (let z = -3; z <= 3; z++) if (Math.hypot(y, z) <= 3.3) v.set(x, 34 + y, z, 0x8a929c);
        for (let a = 0; a < 20; a++) { const t = a / 20 * PI * 2; v.set(Math.round(Math.cos(t) * 5), 18 + Math.round(Math.sin(t) * 5), 4, 0xd8302a); }
        v.box(-1, 17, 4, 1, 19, 4, 0xd8302a);
        return;
      }
      case "flag": {                                   // a pole and a pennant snapping in the wind
        v.box(-2, 0, -2, 1, 1, 1, 0x8a8a92); v.box(-1, 2, -1, 0, 50, 0, 0xe8e8e2); v.box(-1, 51, -1, 0, 52, 0, 0xf2c030);
        for (let x = 1; x < 20; x++) { const h = Math.round(8 * (1 - x / 22)), y0 = 48 - h + Math.round(Math.sin(x * 0.6) * 1.2); v.box(x, y0, 0, x, 48 + Math.round(Math.sin(x * 0.6) * 1.2), 0, x % 6 < 3 ? 0xd8302a : 0xf6f6f2); }
        return;
      }
      case "torch": {                                  // a stone brazier on a post, fire in it
        v.box(-4, 0, -4, 3, 2, 3, 0x3a302e); v.box(-2, 3, -2, 1, 22, 1, 0x4a3e3a);
        v.box(-5, 23, -5, 4, 27, 4, 0x3a302e); v.box(-4, 27, -4, 3, 27, 3, 0xff6a1a);
        for (let k = 0; k < 40; k++) { const x = Math.round((Math.random() - 0.5) * 7), z = Math.round((Math.random() - 0.5) * 7), y = 28 + Math.floor(Math.random() * (9 - Math.abs(x) - Math.abs(z) / 2)); v.set(x, y, z, y > 33 ? 0xffe060 : 0xff8a2a); }
        return;
      }
      default: {                                       // a palm bent by the sea wind: the trunk ringed and leaning, seven fronds and coconuts
        let lx = 0;
        for (let y = 0; y < 38; y++) { lx = Math.round(y * y / 150); v.box(lx - 1, y, -1, lx + 1, y, 1, y % 4 === 0 ? 0x7a5a3a : 0x9a7448); }
        for (let k = 0; k < 7; k++) {
          const a = k / 7 * PI * 2 + 0.3;
          for (let s = 1; s < 14; s++) {
            const fx = lx + Math.round(Math.cos(a) * s), fz = Math.round(Math.sin(a) * s), fy = 39 - Math.round(s * s / 14);
            v.set(fx, fy, fz, s % 4 === 0 ? 0x2f8a2a : 0x4cae3a);
            if (s > 2 && s < 11) v.set(fx, fy - 1, fz, 0x3a9a30);
          }
        }
        v.box(lx - 1, 36, -1, lx + 1, 37, 1, 0x6a4a2a); v.box(lx - 2, 34, 1, lx - 1, 35, 2, 0x8a5a2a); v.box(lx + 1, 34, -2, lx + 2, 35, -1, 0x8a5a2a);
      }
    }
  }
  /* Where a lamp's light hangs, in metres from its foot (twelve grains a metre), for its glow. */
  const LAMP_AT = { lamp: [0, 38 / 12], streetlamp: [12 / 12, 56 / 12], lantern: [0, 22 / 12], torch: [0, 31 / 12] };

  // ---------------------------------------------------------------- far away
  /* What stands behind each stage, built coarse and set back so the perspective camera
     gives it parallax for free. */
  function buildFar(T, S, rnd, group) {
    const M = materials(), W = S.W;
    group.userData.anim = [];
    const topOf0 = (() => { for (let j = H - 1; j >= 0; j--) if (SOLIDS.indexOf(S.grid[j][0]) >= 0) return j + 1; return 0; })();
    /* a floor for the backdrop, `depth` deep back from z = front (never nearer than the stage's back) */
    const plane = (color, y, front, depth) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(W + 900, depth), new THREE.MeshLambertMaterial({ color })); m.rotation.x = -PI / 2; m.position.set(W / 2, y, Math.min(front, -5) - depth / 2); group.add(m); return m; };
    const clouds = k => cloudBank(group, W, rnd, Math.round(W / 30 * k));
    const add = (geo, x, y, z, s) => { const m = new THREE.Mesh(geo, M.vox); m.position.set(x, y, z); if (s) m.scale.setScalar(s); group.add(m); return m; };
    const band = (grain, z0, z1, base, amp, freq, cols, seed) => {
      const v = new Vox(), r = mulberry32(seed);
      const n = Math.ceil((W + 120) / grain);
      for (let x = 0; x < n; x++) {
        const X = x * grain - 60;
        const h = Math.max(1, Math.round((base + Math.sin(X * freq + seed) * amp + Math.sin(X * freq * 2.7 + seed * 2) * amp * 0.4) / grain));
        for (let z = Math.round(z0 / grain); z <= Math.round(z1 / grain); z++) for (let y = 0; y < h; y++)
          v.set(x, y, z, jit(r, y === h - 1 ? cols[1] : cols[0], 0.05));
      }
      const m = new THREE.Mesh(meshVox(v, grain), M.vox); m.position.x = -60; group.add(m); return m;
    };
    const trees = (z, n, y) => { for (let k = 0; k < n; k++) add(propGeo("tree", T), rnd() * (W + 40) - 20, y, z - rnd() * 6, 1 + rnd() * 0.4); };
    switch (T.far) {
      case "cape": {
        /* the open sea below the clifftops; headlands of the same chalk across the bay; a
           torii out on a rock, sails, and clouds */
        const sea = new THREE.Mesh(new THREE.PlaneGeometry(W + 900, 700), new THREE.MeshLambertMaterial({ color: 0x1f8fd0 }));
        sea.rotation.x = -PI / 2; sea.position.set(W / 2, -0.5, -355); group.add(sea);
        const glint = vox(v => { for (let k = 0; k < 160; k++) { const x = Math.floor(rnd() * 1600), z = Math.floor(rnd() * 240); v.set(x, 0, z, 0xffffff); if (rnd() < 0.5) v.set(x + 1, 0, z, 0xd8f2fc); } }, 0.25);
        for (let x = -60; x < W + 60; x += 400) { const m = new THREE.Mesh(glint, M.glow); m.position.set(x, -0.5, -75); group.add(m); }
        {                                                         // chalk, sheer to the water, turf on top
          const v = new Vox(), r = mulberry32(31), g = 3;
          for (let x = 0; x < (W + 260) / g; x++) {
            const X = x * g, s = Math.sin(X * 0.022) + Math.sin(X * 0.057) * 0.35;
            if (s < 0.15) continue;                               // open water between the headlands
            const h = Math.round((5 + s * 7) / g);
            for (let y = 0; y < h; y++) for (let z = 0; z < 4; z++)
              v.set(x, y, z, y >= h - 1 ? jit(r, 0x5ea04a, 0.05) : jit(r, (y % 3 === 1) ? 0xcabfa4 : 0xe8e0cc, 0.03));
          }
          const m = new THREE.Mesh(meshVox(v, g), M.vox); m.position.set(-130, -0.5, -160); group.add(m);
          /* a lighthouse on the broadest headland in each stretch, standing on its turf */
          for (let x0 = 0; x0 < W + 120; x0 += 260) {
            let best = null;
            for (let X = x0; X < x0 + 260; X += g) { const s = Math.sin(X * 0.022) + Math.sin(X * 0.057) * 0.35; if (s > 0.15 && (!best || s > best.s)) best = { X, s }; }
            if (best) lighthouse(group, best.X - 130 + 1.5, -0.5 + Math.round((5 + best.s * 7) / g) * g, -155);
          }
        }
        /* the coast across the bay: green hills to the horizon, behind the headlands */
        band(4, -262, -250, 18, 9, 0.009, [0x4a8a5a, 0x5ea04a], 37);
        /* rocks standing in the bay, their tops in grass, a palm or two on each */
        for (let x = 10; x < W + 40; x += 44 + rnd() * 34) seaStack(group, x, -36 - rnd() * 44, 3 + Math.floor(rnd() * 8), rnd, T);
        for (let x = 30; x < W; x += 110) torii(group, x + rnd() * 30, -48 - rnd() * 10);
        for (let k = 0; k < Math.round(W / 40); k++) {
          const b = vox(v => { v.box(-4, 0, -1, 4, 1, 1, 0xf6f6f2); v.box(-5, 1, -1, 5, 1, 1, 0x3a5a8a); for (let y = 2; y < 12; y++) v.box(0, y, 0, Math.round((12 - y) * 0.45), y, 0, 0xfaf8f0); v.box(0, 2, 0, 0, 13, 0, 0x8a6a4a); }, 0.5);
          const m = new THREE.Mesh(b, M.vox); m.position.set(rnd() * (W + 80) - 40, -0.5, -70 - rnd() * 60); m.rotation.y = rnd() < 0.5 ? 0 : PI; group.add(m);
        }
        for (let k = 0; k < Math.round(W / 30); k++) {
          const v = new Vox(), r = mulberry32(k * 13 + 7), n = 3 + Math.floor(r() * 4);
          for (let c = 0; c < n; c++) {
            const cx = c * 5 + Math.floor(r() * 3), rad = 3 + Math.floor(r() * 3) - (c === 0 || c === n - 1 ? 1 : 0);
            for (let x = -rad; x <= rad; x++) for (let y = 0; y <= rad; y++) for (let z = -2; z <= 2; z++)
              if (Math.hypot(x, y * 1.2, z * 1.5) <= rad) v.set(cx + x, y, z, y === 0 ? 0xe6eef6 : 0xffffff);
          }
          const m = new THREE.Mesh(meshVox(v, 1.4), new THREE.MeshBasicMaterial({ vertexColors: true, fog: false }));
          m.position.set(rnd() * (W + 300) - 150, 26 + rnd() * 26, -230 - rnd() * 40); group.add(m);
        }
        break;
      }
      case "works": {
        /* Tails' airfield: grass to the sea, a runway, hangars, the control tower, wind
           turbines turning on the hills, his planes going over */
        plane(0x62a844, 0, -5, 300);
        plane(0x2a90d0, 0.1, -300, 400);
        plane(0x4a4a52, 0.05, -41, 14);                           // the runway
        { const v = new Vox(); for (let x = 0; x < W + 240; x += 6) v.box(x, 0, 0, x + 2, 0, 1, 0xf2f0e8); const m = new THREE.Mesh(meshVox(v, 1), M.vox); m.position.set(-120, 0.12, -49); group.add(m); }
        band(2, -150, -140, 7, 4, 0.025, [0x7aa070, 0x86ac7a], 41);
        band(2, -112, -100, 4, 2.5, 0.035, [0x5e9a46, 0x6aac50], 43);
        for (let x = 0; x < W + 40; x += 9 + rnd() * 8) oak(group, x, 0, -88 - rnd() * 8, 0.9 + rnd() * 0.5, rnd);
        for (let x = 20; x < W; x += 95) { hangar(group, x + rnd() * 20, -70, rnd); fuelTank(group, x + 42 + rnd() * 6, -66); }
        for (let x = 140; x < W; x += 320) tower(group, x, -58);
        for (let x = 0; x < W + 100; x += 60) group.userData.anim.push(turbine(group, x + rnd() * 30, -135 - rnd() * 10, 10 + rnd() * 4));
        for (let k = 0; k < 3; k++) group.userData.anim.push(biplane(group, W, k, rnd));
        clouds(0.8);
        break;
      }
      case "parlour": {
        /* Amy's home, from the floor up: the floorboards running back to a papered wall, and
           what stands along it -- the bed, a dresser with a heart mirror, shelves of books, a
           window on the city, pictures, a clock, fairy lights -- all of it huge */
        const base = topOf0;
        plane(0xc8925c, base - 0.02, -5, 34);
        wallpaper(group, W, base, -38);
        const kit = [bed, dresser, windowOn, shelves, pictures, windowOn, dresser, pictures];
        let k = 0;
        for (let x = 6; x < W + 20; x += 34 + Math.floor(rnd() * 8)) kit[k++ % kit.length](group, x, base, -30, rnd);
        for (let x = -10; x < W + 20; x += 24) fairyLights(group, x, base + 26, -37.5);
        break;
      }
      case "peak": {
        /* Knuckles' mountain: snowfields and black rock, the old shrines stepping up the
           slopes, carved pillars in the snow, and at the summit a light that does not go out */
        plane(0xeef3f8, 0, -5, 400);
        mountains(group, W, -230, 3, 70, 0x8a96aa, 1);
        mountains(group, W, -120, 2, 34, 0x6a6470, 2);
        for (let x = 30; x < W; x += 140) shrine(group, x + rnd() * 30, -70 - rnd() * 14, rnd);
        trees(-16, Math.round(W / 22), 0);
        for (let x = 60; x < W + 60; x += 300) beacon(group, x + rnd() * 60, -200);
        clouds(0.6);
        break;
      }
      case "club": {
        /* Rouge's street after midnight: the casinos and clubs lit up in neon, signs in the
           four suits, searchlights crossing the sky, a full moon; her own club at the end */
        plane(0x1c1428, 0, -5, 400);
        casinos(group, W, -34, rnd);
        casinos(group, W, -70, rnd, 1.6);
        { const m = new THREE.Mesh(new THREE.CircleGeometry(14, 40), new THREE.MeshBasicMaterial({ color: 0xfff6e0, fog: false })); m.position.set(W * 0.6, 70, -280); group.add(m);
          const s = new THREE.Sprite(glowMat(0xd8c8ff, 0.5)); s.scale.set(70, 70, 1); s.position.set(W * 0.6, 70, -279); group.add(s); }
        for (let x = 40; x < W; x += 120) group.userData.anim.push(searchlight(group, x + rnd() * 40, -90, rnd));
        clubFront(group, W - 12, -16);
        break;
      }
      case "city": {
        /* Shadow's road out of the city at sundown: the sun on the horizon, the towers dark
           against it, a raised road behind with its traffic, lamps along it */
        plane(0x5a4650, 0, -5, 400);
        { const m = new THREE.Mesh(new THREE.CircleGeometry(26, 48), new THREE.MeshBasicMaterial({ color: 0xffd080, fog: false })); m.position.set(W * 0.5, 16, -300); group.add(m);
          const s = new THREE.Sprite(glowMat(0xff9a50, 0.8)); s.scale.set(150, 150, 1); s.position.set(W * 0.5, 16, -299); group.add(s); }
        skyline(group, W, -250, 0x6a4a6a, 0.0, 60, 1.6);
        skyline(group, W, -150, 0x4a3448, 0.25, 44, 1.2);
        skyline(group, W, -85, 0x2e2230, 0.5, 30, 0.9);
        overpass(group, W, -32);
        group.userData.anim.push(traffic(group, W, -32));
        break;
      }
      case "museum": {
        /* the hall, from its floor: marble running back to the far wall, tall arched windows in
           it full of daylight and banners between; the great skeletons on their plinths, glass
           cases of fossils, a whale's skeleton hung from the ceiling */
        const base = topOf0;
        plane(0xcbbda2, base - 0.02, -5, 64);
        museumWall(group, W, base, -66);
        let k = 0;
        for (let x = 10; x < W + 20; x += 36 + Math.floor(rnd() * 10)) {
          if (k % 3 === 2) displayCases(group, x, base, -24); else skeleton(group, x, base, -36 - rnd() * 8, k % 2);
          k++;
        }
        hallCeiling(group, W, base + 34, -2, -66, 0xb8ab90, 0x8a7e66, 0xfff6d8);
        for (let x = 40; x < W; x += 150) whale(group, x, base + 24, -50, base + 34);
        break;
      }
      case "springs": {
        /* the springs at night: still water running back to the cliffs, waterfalls down them,
           the old shrine at the top of its steps, stone lanterns, fireflies, the moon */
        plane(0x1e6a7a, -0.3, -5, 400);
        band(3, -120, -110, 26, 10, 0.02, [0x3a4a48, 0x3e7a4a], 81);
        const cliffAt = bandAt(3, 26, 10, 0.02, 81);
        band(4, -200, -190, 44, 16, 0.012, [0x2a3634, 0x2e5a3a], 82);
        for (let x = 20; x < W; x += 70 + rnd() * 40) waterfall(group, x, -107, cliffAt(x + 2));
        for (let x = 60; x < W; x += 170) shrineSteps(group, x + rnd() * 30, -64);
        trees(-14, Math.round(W / 26), 0);
        disc(group, W * 0.4, 62, -262, 13, 0xeef6ff, 0xc8e0ff);
        group.userData.anim.push(fireflies(group, W, rnd));
        break;
      }
      case "canyon": {
        /* canyon country: sand running back to red mesas laid down in bands, buttes standing
           alone, the far rims pale in the heat; cacti; the sun high */
        plane(0xe0aa70, 0, -5, 400);
        band(4, -240, -228, 46, 14, 0.008, [0xd8a07a, 0xe8bc94], 91);
        band(3, -150, -140, 28, 12, 0.014, [0xb8603a, 0xd88a5a], 92);
        band(2, -84, -78, 12, 6, 0.03, [0xa84e30, 0xc87a4a], 93);
        for (let x = 30; x < W; x += 90 + rnd() * 60) butte(group, x, -112 - rnd() * 18, 14 + Math.floor(rnd() * 12), rnd);
        trees(-12, Math.round(W / 18), 0);
        disc(group, W * 0.7, 74, -290, 12, 0xfff6d8, 0xffd890);
        clouds(0.3);
        break;
      }
      case "ruins": {
        /* the city burning: towers broken off against a red sky, the fires in them, and pieces
           of the city hanging in the air -- his power holding them up */
        plane(0x2a2224, 0, -5, 400);
        disc(group, W * 0.5, 26, -300, 22, 0xff9a50, 0xff5a20);
        skyline(group, W, -240, 0x3a1e1e, 0.0, 70, 1.6);
        skyline(group, W, -150, 0x2a1616, 0.15, 50, 1.2);
        brokenBlocks(group, W, -72, rnd);
        rubble(group, W, -30, rnd);
        group.userData.anim.push(fires(group, W, rnd));
        break;
      }
      case "depot": {
        /* the depot: the floor running back under racks of crates three high to the wall,
           steel columns, lamps hanging on chains */
        const base = topOf0;
        plane(0x4a525c, base - 0.02, -5, 70);
        depotWall(group, W, base, -72);
        for (let x = 0; x < W + 40; x += 26) rack(group, x + rnd() * 4, base, -36 - rnd() * 6, rnd);
        hallCeiling(group, W, base + 26, -2, -72, 0x2e343c, 0x4a525c, 0xf2c030);
        for (let x = 10; x < W; x += 22) hangLamp(group, x, base + 20, -16 - rnd() * 10, base + 26);
        break;
      }
      case "stars": {
        /* the course out among the stars: a ringed planet, a nebula's glow, the track's other
           turns floating far off in ribbons of light, grandstands lit up, rocks drifting by */
        nebula(group, W);
        ringedPlanet(group, W * 0.3, 44, -300);
        plane(0x3c3850, 0, -5, 420);
        band(4, -250, -238, 20, 12, 0.01, [0x34304a, 0x4a4466], 61);
        band(3, -140, -132, 8, 5, 0.025, [0x3e3a54, 0x524c6c], 62);
        craters(group, W, rnd);
        for (let x = -100; x < W + 200; x += 170) trackRibbon(group, x, -150 - rnd() * 40, rnd);
        for (let x = 40; x < W; x += 120) grandstand(group, x + rnd() * 30, -60, rnd);
        break;
      }
      case "station": {
        /* his station in orbit: the hull's inner wall with great windows in it, and through them
           the world turning far below; pipes, and warning lights going round */
        group.userData.anim.push(worldBelow(group, W));
        plane(0x3a3e48, topOf0 - 0.02, -5, 36);                   // the deck, back to the wall: the world is out of the windows
        { const m = new THREE.Mesh(new THREE.PlaneGeometry(W + 900, 64), new THREE.MeshLambertMaterial({ color: 0x14161c }));
          m.rotation.x = -PI / 2; m.position.set(W / 2, -1.5, -22); group.add(m); }   // and the shafts' floors, far down in the dark
        stationWall(group, W, topOf0, -40);
        group.userData.anim.push(warnLights(group, W, topOf0, -39));
        break;
      }
      // ---------------------------------------------------------------- the grand prix's places
      case "checker": {
        /* the classic: green hills with checkered soil rolling back to the sea, palms, a waterfall
           down a cliff, totem poles, clouds */
        plane(0x2a9ae8, -0.4, -150, 500);
        plane(0x4ab03c, 0, -5, 150);
        for (let x = -40; x < W + 60; x += 34 + rnd() * 30) checkerHill(group, x, -60 - rnd() * 50, 10 + rnd() * 14, 6 + rnd() * 10, rnd);
        for (let x = -60; x < W + 80; x += 70 + rnd() * 50) checkerHill(group, x, -170 - rnd() * 30, 26 + rnd() * 18, 14 + rnd() * 12, rnd);
        for (let x = 40; x < W; x += 160 + rnd() * 60) waterfall(group, x, -150, 18 + rnd() * 8);
        for (let k = 0; k < Math.round(W / 16); k++) add(propGeo("tree", PALM), rnd() * (W + 40) - 20, 0, -18 - rnd() * 30, 1 + rnd() * 0.5);
        trees(-12, Math.round(W / 60), 0);
        clouds(1);
        break;
      }
      case "coral": {
        /* the beach: the sea right back to the sky, coral reefs showing through it, a boardwalk on
           posts, sails, a lighthouse on the point, palms along the sand */
        const sea = plane(0x18b8d8, -0.4, -6, 600);
        plane(0xf2e2aa, -0.1, -5, 14);
        for (let x = -20; x < W + 40; x += 18 + rnd() * 22) reef(group, x, -30 - rnd() * 70, rnd);
        for (let x = 0; x < W; x += 140) boardwalk(group, x + rnd() * 30, -26, 40 + rnd() * 30);
        for (let x = 60; x < W; x += 380) lighthouse(group, x, -0.4, -150);
        band(4, -250, -240, 14, 7, 0.01, [0x4a9a5a, 0x5eaa4a], 141);
        for (let k = 0; k < Math.round(W / 30); k++) add(propGeo("tree", PALM), rnd() * (W + 40) - 20, 0, -8 - rnd() * 6, 1 + rnd() * 0.4);
        for (let k = 0; k < Math.round(W / 50); k++) { const s = sailBoat(); s.position.set(rnd() * (W + 80) - 40, -0.4, -80 - rnd() * 80); group.add(s); }
        sea.material.color.setHex(0x18b8d8);
        clouds(0.8);
        break;
      }
      case "grove": {
        /* autumn woods: mushrooms taller than trees, the trees in red and gold, the hills behind */
        plane(0xc8782a, 0, -5, 400);
        band(4, -220, -208, 34, 12, 0.012, [0x8a5a2a, 0xb87a2a], 151);
        band(3, -130, -120, 18, 8, 0.02, [0x9a5a22, 0xd8902a], 152);
        for (let x = -20; x < W + 40; x += 24 + rnd() * 26) giantMushroom(group, x, -40 - rnd() * 60, 14 + rnd() * 14, rnd);
        for (let x = 0; x < W + 40; x += 8 + rnd() * 8) autumnTree(group, x, 0, -16 - rnd() * 14, 0.9 + rnd() * 0.6, rnd);
        clouds(0.5);
        break;
      }
      case "lagoon": {
        /* the lagoon: still clear water back to the ruins, broken columns standing in it, arches,
           the jungle hills behind, a waterfall or two */
        plane(0x1ab0c0, -0.4, -5, 400);
        band(3, -170, -160, 30, 12, 0.016, [0x3a6a3a, 0x4e9a44], 161);
        const cliffAt = bandAt(3, 30, 12, 0.016, 161);
        for (let x = 30; x < W; x += 90 + rnd() * 60) waterfall(group, x, -158, cliffAt(x + 2));
        for (let x = -10; x < W + 40; x += 14 + rnd() * 20) ruinColumn(group, x, -22 - rnd() * 80, 6 + rnd() * 18, rnd, 0xc8c0a8);
        for (let x = 40; x < W; x += 120 + rnd() * 50) ruinArch(group, x, -60 - rnd() * 30, 0xc8c0a8);
        trees(-14, Math.round(W / 24), 0);
        clouds(0.6);
        break;
      }
      case "pinball": {
        /* inside the machine: the playfield tilted up behind, lanes lit in neon, bumpers flashing,
           flippers, the scoreboard over it all */
        const base = topOf0;
        plane(0x14142e, base - 0.02, -5, 80);
        group.userData.anim.push(pinballBack(group, W, base, -60));
        break;
      }
      case "funfair": {
        /* the fair at dusk: the big wheel turning, striped tents, a coaster's rails up on posts, lights
           strung everywhere, the sun going down */
        plane(0x3a6a4a, 0, -5, 400);
        disc(group, W * 0.5, 14, -300, 24, 0xffc080, 0xff8a5a);
        band(4, -240, -230, 14, 6, 0.01, [0x3a2a4a, 0x4a3a5a], 171);
        for (let x = 30; x < W; x += 260 + rnd() * 80) group.userData.anim.push(ferrisWheel(group, x, -110, 26 + rnd() * 6));
        for (let x = -10; x < W + 40; x += 30 + rnd() * 30) tent(group, x, -40 - rnd() * 40, rnd);
        coaster(group, W, -150, rnd);
        for (let x = -10; x < W + 20; x += 24) fairyLights(group, x, 9 + rnd() * 3, -30);
        break;
      }
      case "sweets": {
        /* the factory of sweets: pink hills of icing back to cake mountains, giant lollipops,
           cupcakes, candy canes, a chocolate river */
        plane(0xffd8e8, 0, -5, 400);
        plane(0x8a5232, 0.05, -60, 30);
        band(4, -230, -218, 30, 12, 0.012, [0xc87a4a, 0xfff0f6], 181);
        band(3, -140, -130, 16, 7, 0.02, [0xa85e34, 0xffc0d8], 182);
        for (let x = -10; x < W + 40; x += 20 + rnd() * 26) candy(group, x, -24 - rnd() * 70, rnd);
        clouds(0.7);
        break;
      }
      case "pier": {
        /* the pier at night: the sea, the boardwalk's lamps reaching out over it, a lit wheel at the
           end, the town's lights, and the sky full of fireworks */
        plane(0x0e2a5a, -0.4, -5, 500);
        for (let x = 0; x < W; x += 110) boardwalk(group, x + rnd() * 20, -34, 60 + rnd() * 20);
        for (let x = -10; x < W + 20; x += 22) fairyLights(group, x, 7 + rnd() * 2, -34);
        skyline(group, W, -240, 0x1a2040, 0.5, 26, 1.2);
        for (let x = 80; x < W; x += 340) group.userData.anim.push(ferrisWheel(group, x, -80, 20));
        disc(group, W * 0.3, 70, -280, 10, 0xfff6e0, 0xd8c8ff);
        group.userData.anim.push(fireworkShow(group, W, rnd));
        break;
      }
      case "slopes": {
        /* the mountain in the sun: snowfields, pines in their thousands, the peaks, a chalet or two,
           the ski lift's cables */
        plane(0xf4f8fc, 0, -5, 400);
        mountains(group, W, -240, 3, 80, 0x7a8aa0, 7);
        mountains(group, W, -140, 2, 40, 0x6a7890, 8);
        for (let x = 20; x < W; x += 110 + rnd() * 60) chalet(group, x, -50 - rnd() * 30, rnd);
        trees(-18, Math.round(W / 8), 0);
        for (let k = 0; k < Math.round(W / 4); k++) add(propGeo("tree", PINE), rnd() * (W + 40) - 20, 0, -60 - rnd() * 60, 0.8 + rnd() * 0.5);
        clouds(0.5);
        break;
      }
      case "crystal": {
        /* the cavern: rock walls back into the dark, crystals growing out of them lit from inside,
           icicles hanging from the roof */
        const base = topOf0;
        plane(0x1a3048, base - 0.02, -5, 60);
        group.userData.anim.push(crystalCave(group, W, base, -54, rnd));
        hallCeiling(group, W, base + 30, -2, -60, 0x14283e, 0x22405a, 0x7ad8ff);
        break;
      }
      case "floes": {
        /* the frozen bay: dark water dotted with floes, icebergs out to the horizon, the snowy
           shore's pines, the sun low and pale */
        plane(0x1a6aa8, -0.4, -5, 500);
        for (let k = 0; k < Math.round(W / 6); k++) floe(group, rnd() * (W + 80) - 40, -14 - rnd() * 90, rnd);
        for (let x = -20; x < W + 60; x += 40 + rnd() * 50) iceberg(group, x, -110 - rnd() * 90, 8 + rnd() * 16, rnd);
        mountains(group, W, -260, 3, 50, 0x8a9ab0, 9);
        disc(group, W * 0.6, 30, -290, 12, 0xfff8f0, 0xe0f0ff);
        clouds(0.5);
        break;
      }
      case "tundra": {
        /* the tundra at night: snow to the mountains, a few pines, a stone circle, and over it all
           the aurora in green and violet ribbons, moving */
        plane(0xd8e4f0, 0, -5, 400);
        mountains(group, W, -230, 3, 60, 0x3a4658, 10);
        mountains(group, W, -130, 2, 30, 0x2e3846, 11);
        trees(-16, Math.round(W / 14), 0);
        for (let x = 60; x < W; x += 200 + rnd() * 80) stoneCircle(group, x, -50 - rnd() * 20, rnd);
        group.userData.anim.push(aurora(group, W));
        break;
      }
      case "dunes": {
        /* the desert: golden dunes in rows to the pyramids, an oasis's palms, the sun white-hot */
        plane(0xf2d088, 0, -5, 400);
        band(4, -250, -238, 20, 10, 0.009, [0xe0b468, 0xf2d088], 191);
        band(3, -150, -140, 12, 7, 0.016, [0xd8a858, 0xf6d898], 192);
        band(2, -80, -74, 6, 4, 0.03, [0xd0a050, 0xf2d088], 193);
        for (let x = 40; x < W + 80; x += 170 + rnd() * 90) pyramid(group, x, -200 - rnd() * 40, 30 + rnd() * 20);
        for (let x = 100; x < W; x += 260) { for (let k = 0; k < 5; k++) add(propGeo("tree", PALM), x + rnd() * 20, 0, -40 - rnd() * 10, 1); plane0(group, 0x3aa8c8, x + 10, -45, 26, 10); }
        disc(group, W * 0.7, 80, -290, 12, 0xfffaf0, 0xffe8a0);
        break;
      }
      case "town": {
        /* the frontier town: the street's false fronts, a water tower, the mesas behind, dust devils
           spinning across the flats */
        plane(0xc89058, 0, -5, 400);
        band(4, -240, -228, 40, 14, 0.008, [0xb8603a, 0xd88a5a], 201);
        for (let x = 30; x < W; x += 90 + rnd() * 60) butte(group, x, -130 - rnd() * 20, 14 + Math.floor(rnd() * 10), rnd);
        storefronts(group, W, -30, rnd);
        for (let x = 140; x < W; x += 300) waterTower(group, x, -44);
        group.userData.anim.push(dustDevils(group, W, rnd));
        break;
      }
      case "foundry": {
        /* the foundry: the far wall of furnaces glowing, crucibles tipping molten metal, chains,
           a river of it along the floor behind */
        const base = topOf0;
        plane(0x2a2220, base - 0.02, -5, 70);
        group.userData.anim.push(foundryBack(group, W, base, -64, rnd));
        hallCeiling(group, W, base + 28, -2, -66, 0x1e1614, 0x3a302c, 0xff8a2a);
        break;
      }
      case "volcano": {
        /* the rim: black rock falling away to a lava lake, the cone smoking and spitting, the sky red */
        plane(0x2a1a16, 0, -5, 120);
        plane(0xff5a1a, -0.6, -125, 400);
        group.userData.anim.push(volcano(group, W * 0.55, -260, 80));
        band(3, -110, -100, 16, 10, 0.02, [0x2a2020, 0x4a2a22], 211);
        group.userData.anim.push(fires(group, W, rnd));
        break;
      }
      case "temple": {
        /* above the clouds: the cloud sea below, islands floating with ruins on them, the temple's
           towers far off, the sun */
        const cl = plane(0xf4f8ff, -6, -5, 500); cl.material = new THREE.MeshBasicMaterial({ color: 0xf4f8ff });
        cloudBank(group, W, rnd, Math.round(W / 12), -4);
        for (let x = -20; x < W + 60; x += 50 + rnd() * 50) floatIsland(group, x, 4 + rnd() * 30, -60 - rnd() * 120, 6 + rnd() * 10, rnd);
        for (let x = 80; x < W; x += 300) templeTower(group, x, -220);
        clouds(1);
        break;
      }
      case "windmills": {
        /* the highlands: green hills one behind another, old windmills turning, the grass blown flat,
           clouds going over fast */
        plane(0x5aa840, 0, -5, 400);
        band(4, -230, -218, 30, 12, 0.01, [0x4a8a3a, 0x6ab84a], 221);
        band(3, -140, -130, 18, 8, 0.02, [0x5a9a40, 0x76c456], 222);
        for (let x = 20; x < W; x += 70 + rnd() * 50) group.userData.anim.push(windmill(group, x, -60 - rnd() * 40));
        for (let x = 0; x < W + 100; x += 90) group.userData.anim.push(turbine(group, x + rnd() * 30, -150 - rnd() * 10, 10 + rnd() * 4));
        trees(-14, Math.round(W / 30), 0);
        clouds(1.2);
        break;
      }
      case "fleet": {
        /* the storm: thunderclouds below and above, Eggman's airships around you in it, lightning
           lighting them up */
        const sea = plane(0x3a4458, -10, -5, 500); sea.material = new THREE.MeshBasicMaterial({ color: 0x3a4458 });
        stormClouds(group, W, rnd);
        for (let k = 0; k * 120 < W + 120; k++) group.userData.anim.push(airship(group, W, k, rnd));
        group.userData.anim.push(lightning(group, W, rnd));
        break;
      }
      case "spires": {
        /* the spires at sunrise: needles of rock up out of a sea of cloud, the jet stream in streaks
           of white across the sky */
        const cl = plane(0xffe0c8, -6, -5, 500); cl.material = new THREE.MeshBasicMaterial({ color: 0xffd8c0 });
        disc(group, W * 0.35, 18, -300, 22, 0xfff0c8, 0xffb070);
        for (let x = -20; x < W + 60; x += 20 + rnd() * 30) spire(group, x, -50 - rnd() * 160, 20 + rnd() * 50, rnd);
        group.userData.anim.push(jetStream(group, W, rnd));
        break;
      }
      case "refinery": {
        /* the refinery at night: tanks, towers, pipes everywhere, the pink stuff glowing in the vats */
        plane(0x1e2848, 0, -5, 400);
        skyline(group, W, -240, 0x2a3460, 0.4, 40, 1.4);
        refinery(group, W, -60, rnd);
        for (let x = 10; x < W; x += 70) fuelTank(group, x + rnd() * 20, -36);
        break;
      }
      case "metro": {
        /* the city of tomorrow: white towers with glass tops, tubes between them, the highways in the
           air, flyers going over */
        plane(0xd8dce6, 0, -5, 400);
        skyline(group, W, -250, 0x9ab8d8, 0.0, 70, 1.6);
        futureCity(group, W, -120, rnd);
        overpass(group, W, -34);
        group.userData.anim.push(traffic(group, W, -34));
        group.userData.anim.push(flyers(group, W, rnd));
        clouds(0.5);
        break;
      }
      case "fortress": {
        /* his fortress: walls and towers in his colours, his face on them, searchlights sweeping */
        plane(0x2a2a32, 0, -5, 400);
        fortressWall(group, W, -70, rnd);
        for (let x = 40; x < W; x += 120) group.userData.anim.push(searchlight(group, x + rnd() * 40, -90, rnd));
        disc(group, W * 0.6, 60, -280, 10, 0xffd8c8, 0xff6a5a);
        break;
      }
      case "orbit": {
        /* in orbit: the world below, a planet with its rings, the nebula, the track's far turns in
           ribbons, and stars falling */
        group.userData.anim.push(worldBelow(group, W));
        nebula(group, W);
        ringedPlanet(group, W * 0.7, 60, -300);
        for (let x = -100; x < W + 200; x += 200) trackRibbon(group, x, -120 - rnd() * 60, rnd);
        group.userData.anim.push(fallingStars(group, W, rnd));
        break;
      }
    }
    // a clear night: stars, far off, past the fog
    if (T.stars) {
      const n = 420, pos = new Float32Array(n * 3);
      for (let k = 0; k < n; k++) { pos[k * 3] = Math.random() * (W + 400) - 200; pos[k * 3 + 1] = 25 + Math.random() * 140; pos[k * 3 + 2] = -260 - Math.random() * 40; }
      const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      group.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.4, fog: false, transparent: true, opacity: 0.85 })));
    }
  }
  /* ---- the backdrops' pieces. Each is built in voxels at its own grain and set far enough
     back for the camera to give it parallax; `anim` ones hand back a function of the time. */
  const voxMesh = (v, g, x, y, z, mat) => { const m = new THREE.Mesh(meshVox(v, g), mat || materials().vox); m.position.set(x, y, z); return m; };
  /* ---- the grand prix places' pieces */
  const PALM = { id: "_palm", tree: "palm" }, PINE = { id: "_pine", tree: "pine" };
  const glowSprite = (group, c, op, sx, sy, x, y, z) => { const s = new THREE.Sprite(glowMat(c, op)); s.scale.set(sx, sy, 1); s.position.set(x, y, z); group.add(s); return s; };
  function plane0(group, color, x, z, w, d) {          // a patch of flat colour on the ground (an oasis's pool)
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshLambertMaterial({ color })); m.rotation.x = -PI / 2; m.position.set(x, 0.02, z); group.add(m);
  }
  function checkerHill(group, x, z, w, h, rnd) {       // a round green hill, its soil in brown checks, grass on top
    const v = new Vox(), g = 1, R = Math.round(w / g), Hh = Math.round(h / g);
    for (let X = -R; X <= R; X++) {
      const top = Math.round(Hh * Math.sqrt(Math.max(0, 1 - (X / R) * (X / R))));
      for (let y = 0; y <= top; y++) for (let Z = 0; Z < 3; Z++)
        v.set(X, y, Z, y >= top - 1 ? (y === top ? 0x4ac848 : 0x34aa34) : (((X >> 1) + (y >> 1)) & 1 ? 0xc0702a : 0x8a4a1a));
    }
    group.add(voxMesh(v, g, x, 0, z));
  }
  function reef(group, x, z, rnd) {                    // coral showing through the shallows
    const v = new Vox(), C = [0xff7a8a, 0xffa05a, 0xd85aa8, 0xf2e2aa];
    for (let k = 0; k < 7; k++) { const cx = Math.floor(rnd() * 10), h = 1 + Math.floor(rnd() * 3), c = C[k % 4]; v.box(cx, 0, Math.floor(rnd() * 4), cx + 1, h, Math.floor(rnd() * 4) + 1, c); }
    group.add(voxMesh(v, 1, x, -1.6, z));
  }
  function boardwalk(group, x, z, len) {               // a boardwalk out on posts
    const v = new Vox();
    for (let X = 0; X < len; X++) { v.box(X, 4, 0, X, 4, 5, X % 2 ? 0xb08458 : 0x9a7048); if (X % 6 === 0) for (const Z of [0, 5]) v.box(X, -3, Z, X, 3, Z, 0x6a4a2e); }
    for (let X = 0; X < len; X += 3) v.box(X, 5, 0, X, 7, 0, 0xf2ece0);
    group.add(voxMesh(v, 0.5, x, 0, z));
  }
  function sailBoat() { return new THREE.Mesh(vox(v => { v.box(-4, 0, -1, 4, 1, 1, 0xf6f6f2); v.box(-5, 1, -1, 5, 1, 1, 0xd8303a); for (let y = 2; y < 12; y++) v.box(0, y, 0, Math.round((12 - y) * 0.45), y, 0, 0xfaf8f0); v.box(0, 2, 0, 0, 13, 0, 0x8a6a4a); }, 0.5), materials().vox); }
  function giantMushroom(group, x, z, h, rnd) {        // a mushroom taller than the trees
    const v = new Vox(), cap = [0xd8302a, 0xe8782a, 0xc84a8a][Math.floor(rnd() * 3)], R = Math.round(h * 0.45);
    for (let y = 0; y < h; y++) v.box(-1, y, -1, 1, y, 1, 0xf2e6c8);
    for (let y = 0; y < 5; y++) { const r = R - y * y * 0.4; for (let X = -R; X <= R; X++) for (let Z = -R; Z <= R; Z++) { const d = Math.hypot(X, Z); if (d <= r && (y === 4 || d > r - 1.5 || y === 0)) v.set(X, h + y, Z, y === 0 ? 0xe8d8b0 : ((X * 7 + Z * 3) % 11 === 0 ? 0xffffff : cap)); } }
    group.add(voxMesh(v, 0.8, x, 0, z));
  }
  function autumnTree(group, x, y, z, k, rnd) {        // a broad tree in red and gold
    const v = new Vox(), r = 3 + Math.floor(rnd() * 2), C = [[0xd8502a, 0xe86a2a], [0xe8a83a, 0xf2c040], [0xb83a2a, 0xd8602a]][Math.floor(rnd() * 3)];
    v.box(0, 0, 0, 0, 4, 0, 0x5a3a22);
    for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) for (let c = -r; c <= r; c++) if (Math.hypot(a, b * 1.15, c) <= r + 0.3) v.set(a, 5 + r + b, c, (a + b * 2 + c) % 4 === 0 ? C[0] : C[1]);
    group.add(voxMesh(v, 0.5 * k, x, y, z));
  }
  function ruinColumn(group, x, z, h, rnd, col) {      // an old column standing in the water, broken off
    const v = new Vox(), H2 = Math.round(h);
    for (let y = 0; y < H2; y++) for (let X = -1; X <= 1; X++) for (let Z = -1; Z <= 1; Z++) if (!(y === H2 - 1 && rnd() < 0.4)) v.set(X, y, Z, (y % 6 === 0) ? mulC(col, 0.85) : (X + Z + y) % 5 ? col : 0x5aa848);
    v.box(-2, 0, -2, 2, 0, 2, mulC(col, 0.8));
    group.add(voxMesh(v, 1, x, -1, z));
  }
  function ruinArch(group, x, z, col) {                 // an arch still standing
    const v = new Vox();
    for (const X of [-6, 5]) v.box(X, 0, -1, X + 1, 12, 1, col);
    for (let X = -6; X <= 6; X++) { const y = 12 + Math.round(Math.sqrt(Math.max(0, 36 - X * X)) * 0.5); v.box(X, 12, -1, X, y, 1, (X & 1) ? col : mulC(col, 0.9)); }
    group.add(voxMesh(v, 1, x, -1, z));
  }
  function pinballBack(group, W, base, z) {            // the playfield tilted up: lanes, bumpers that flash, flippers, the backbox
    const v = new Vox(), gl = new Vox(), lights = [];
    for (let X = -20; X < W + 40; X++) for (let y = 0; y < 34; y++) v.set(X, y, 0, (X % 18 === 0 || y % 17 === 0) ? 0x3a2a7a : 0x1a1450);
    for (let X = -20; X < W + 40; X += 18) for (let y = 3; y < 30; y += 2) gl.set(X, y, 1, y % 4 ? 0xff4ac8 : 0x7ad8ff);
    group.add(voxMesh(v, 1, 0, base, z)); group.add(voxMesh(gl, 1, 0, base, z, materials().glow));
    for (let x = 6; x < W; x += 18) for (const y of [8, 20]) {
      const c = [0xffd23a, 0xff4ac8, 0x7ad8ff, 0x6af06a][(x + y) % 4];
      const m = new THREE.Mesh(new THREE.CircleGeometry(2.4, 20), new THREE.MeshBasicMaterial({ color: c })); m.position.set(x + (y === 20 ? 9 : 0), base + y, z + 1.2); group.add(m);
      const s = glowSprite(group, c, 0.6, 7, 7, x + (y === 20 ? 9 : 0), base + y, z + 1.4); lights.push({ s, p: x * 0.37 + y });
    }
    for (let x = 0; x < W; x += 72) {                    // the flippers, on their pins
      for (const sd of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(7, 1.2, 0.6), new THREE.MeshLambertMaterial({ color: 0xf6f6f2 })); f.position.set(x + sd * 6, base + 3, z + 1.5); f.rotation.z = sd * -0.4; group.add(f); lights.push({ f, sd }); }
    }
    return t => { for (const L of lights) { if (L.s) L.s.material.opacity = 0.25 + 0.6 * (Math.sin(t * 6 + L.p) > 0.3 ? 1 : 0); if (L.f) L.f.rotation.z = L.sd * (-0.4 + (Math.sin(t * 2.3) > 0.85 ? 0.7 : 0)); } };
  }
  function ferrisWheel(group, x, z, r) {               // the big wheel, its cars, turning; lit at night
    const legs = new Vox(); for (let y = 0; y < r; y++) { legs.set(Math.round(-y * 0.45), y, 0, 0xd8d8e0); legs.set(Math.round(y * 0.45), y, 0, 0xd8d8e0); }
    group.add(voxMesh(legs, 1, x, 0, z));
    const wv = new Vox(), C = [0xff5a5a, 0xffd23a, 0x5ac8ff, 0x6af06a, 0xff8ac8];
    for (let a = 0; a < 120; a++) { const t = a / 120 * PI * 2; wv.set(Math.round(Math.cos(t) * r), Math.round(Math.sin(t) * r), 0, 0xf6f6f2); }
    for (let k = 0; k < 12; k++) { const t = k / 12 * PI * 2; for (let s = 0; s < r; s++) wv.set(Math.round(Math.cos(t) * s), Math.round(Math.sin(t) * s), 0, 0xe0e0e8); wv.box(Math.round(Math.cos(t) * r) - 1, Math.round(Math.sin(t) * r) - 2, -1, Math.round(Math.cos(t) * r) + 1, Math.round(Math.sin(t) * r), 1, C[k % 5]); }
    const m = voxMesh(wv, 1, x, r, z + 0.5); group.add(m);
    glowSprite(group, 0xfff0c8, 0.35, r * 2.6, r * 2.6, x, r, z + 1);
    return t => { m.rotation.z = t * 0.12; };
  }
  function tent(group, x, z, rnd) {                    // a circus tent in stripes, a flag on top
    const v = new Vox(), R = 7 + Math.floor(rnd() * 4), C = [[0xd8303a, 0xf6f2e8], [0x3a6ae0, 0xffd23a], [0x8a3ad8, 0xf6f2e8]][Math.floor(rnd() * 3)];
    for (let y = 0; y < 12; y++) { const r = y < 5 ? R : Math.round(R * (12 - y) / 7); for (let X = -r; X <= r; X++) for (let Z = -r; Z <= r; Z++) { const d = Math.hypot(X, Z); if (d <= r && d > r - 1.4) v.set(X, y, Z, Math.floor((Math.atan2(Z, X) + PI) / (PI / 6)) % 2 ? C[0][0] : C[0][1]); } }
    v.box(0, 12, 0, 0, 16, 0, 0x8a8a92); v.box(1, 14, 0, 4, 16, 0, C[1][0]);
    group.add(voxMesh(v, 0.8, x, 0, z));
  }
  function coaster(group, W, z, rnd) {                 // a roller coaster's rails up on their posts, dipping and climbing
    const v = new Vox();
    for (let X = -40; X < W + 80; X++) { const y = Math.round(14 + Math.sin(X * 0.05) * 8 + Math.sin(X * 0.13) * 3); v.set(X, y, 0, 0xff5a5a); v.set(X, y, 2, 0xff5a5a); if (X % 8 === 0) for (let k = 0; k < y; k++) v.set(X, k, 1, 0xe8e8ee); }
    group.add(voxMesh(v, 1, 0, 0, z));
  }
  function candy(group, x, z, rnd) {                   // a lollipop, a cupcake or a candy cane, all huge
    const v = new Vox(), k = Math.floor(rnd() * 3);
    if (k === 0) { v.box(0, 0, 0, 0, 14, 0, 0xfaf6ee); for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) { const d = Math.hypot(a, b); if (d <= 6) v.set(a, 20 + b, 0, Math.floor((Math.atan2(b, a) + d * 0.6) * 1.3) % 2 ? 0xff5a9a : 0xfff0f6); } }
    else if (k === 1) { for (let y = 0; y < 6; y++) { const r = 5 + (y >> 1); for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) if (Math.hypot(a, b) <= r) v.set(a, y, b, a % 2 ? 0xe8a0c0 : 0xd888b0); }
      for (let y = 0; y < 5; y++) { const r = 7 - y; for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) if (Math.hypot(a, b) <= r) v.set(a, 6 + y, b, 0xfff6f8); } v.box(0, 11, 0, 0, 12, 0, 0xd8303a); }
    else { for (let y = 0; y < 16; y++) v.set(0, y, 0, (y >> 1) % 2 ? 0xd8303a : 0xfff6f6); for (let a = 0; a < 8; a++) { const t = a / 8 * PI; v.set(Math.round(3 - Math.cos(t) * 3), 16 + Math.round(Math.sin(t) * 3), 0, a % 2 ? 0xd8303a : 0xfff6f6); } }
    group.add(voxMesh(v, 0.9, x, 0, z));
  }
  function fireworkShow(group, W, rnd) {               // fireworks going up over the sea and bursting, again and again
    const shells = [];
    for (let k = 0; k < Math.max(4, Math.round(W / 120)); k++) {
      const C = [0xff5a5a, 0xffd23a, 0x5ac8ff, 0x6af06a, 0xff8ac8][k % 5], parts = [];
      for (let p = 0; p < 14; p++) { const s = new THREE.Sprite(glowMat(C, 0.9)); s.scale.set(2.2, 2.2, 1); group.add(s); parts.push(s); }
      shells.push({ parts, x: rnd() * W, y: 40 + rnd() * 30, z: -150 - rnd() * 60, p: rnd() * 4, per: 3 + rnd() * 2 });
    }
    return t => { for (const f of shells) { const u = ((t + f.p) % f.per) / f.per, r = u * 22, op = u < 0.75 ? 0.95 : (1 - u) * 3.8;
      f.parts.forEach((s, i) => { const a = i / f.parts.length * PI * 2; s.position.set(f.x + Math.cos(a) * r, f.y + Math.sin(a) * r - u * u * 8, f.z); s.material.opacity = op; }); } };
  }
  function chalet(group, x, z, rnd) {                  // a wooden chalet, snow thick on its roof, the windows lit
    const v = new Vox();
    v.box(-6, 0, -4, 6, 7, 4, 0x8a5a32); for (const X of [-4, 3]) v.box(X, 3, 5, X + 1, 5, 5, 0xffe8a0);
    for (let y = 0; y < 6; y++) v.box(-8 + y, 8 + y, -5, 8 - y, 8 + y, 5, y === 5 ? 0xffffff : (y > 3 ? 0xf4f8fc : 0x6a3a22));
    for (let y = 0; y < 6; y++) v.box(-8 + y, 9 + y, -5, 8 - y, 9 + y, 5, 0xf4f8fc);
    group.add(voxMesh(v, 0.7, x, 0, z));
  }
  function crystalCave(group, W, base, z, rnd) {       // the cave's back wall and crystals out of it, glowing, slowly breathing
    const v = new Vox(), gl = [];
    for (let X = -20; X < W + 40; X++) { const h = 34 + Math.round(Math.sin(X * 0.2) * 3); for (let y = 0; y < h; y++) v.set(X, y, 0, (X * 7 + y * 3) % 11 ? 0x1e3854 : 0x284866); }
    group.add(voxMesh(v, 1, 0, base, z));
    for (let x = 0; x < W; x += 9 + rnd() * 10) {
      const c = [0x9ae6ff, 0xbff2ff, 0x7ad0f4, 0xd8b0ff][Math.floor(rnd() * 4)], y = base + 2 + rnd() * 26, h = 3 + rnd() * 5;
      const m = new THREE.Mesh(new THREE.ConeGeometry(0.9, h, 6), new THREE.MeshBasicMaterial({ color: c })); m.position.set(x, y, z + 2 + rnd() * 6); m.rotation.z = (rnd() - 0.5) * 1.2; group.add(m);
      gl.push({ s: glowSprite(group, c, 0.5, h * 2, h * 2, x, y, z + 3), p: rnd() * 6 });
    }
    return t => { for (const g of gl) g.s.material.opacity = 0.32 + Math.sin(t * 1.4 + g.p) * 0.16; };
  }
  function floe(group, x, z, rnd) {                    // a floe of ice on the dark water
    const v = new Vox(), w = 2 + Math.floor(rnd() * 5), d = 1 + Math.floor(rnd() * 3);
    v.box(0, 0, 0, w, 0, d, 0xf4f8fc); v.box(0, -1, 0, w, -1, d, 0xb8d8ec);
    group.add(voxMesh(v, 1, x, -0.3, z));
  }
  function iceberg(group, x, z, h, rnd) {              // an iceberg, white over blue
    const v = new Vox(), R = Math.round(h * 0.7);
    for (let y = 0; y < h; y++) { const r = Math.round(R * (1 - y / h) + 1); for (let X = -r; X <= r; X++) for (let Z = -2; Z <= 2; Z++) if (Math.abs(X) + rnd() * 2 <= r) v.set(X, y, Z, y < 2 ? 0x9ac8e0 : (X + y) % 6 ? 0xf4f8fc : 0xd8ecf8); }
    group.add(voxMesh(v, 1.2, x, -0.4, z));
  }
  function stoneCircle(group, x, z, rnd) {             // standing stones in the snow
    const v = new Vox();
    for (let k = 0; k < 8; k++) { const a = k / 8 * PI * 2, X = Math.round(Math.cos(a) * 9), Z = Math.round(Math.sin(a) * 4); v.box(X, 0, Z, X + 1, 6 + (k % 3), Z, 0x5a6270); v.box(X, 7 + (k % 3), Z, X + 1, 7 + (k % 3), Z, 0xf4f8fc); }
    group.add(voxMesh(v, 0.8, x, 0, z));
  }
  function aurora(group, W) {                          // the northern lights: ribbons of green and violet, rippling
    const rib = [];
    for (let k = 0; k < Math.round(W / 10) + 30; k++) {
      const s = new THREE.Sprite(glowMat(k % 3 === 2 ? 0xa86af0 : 0x5af0a8, 0.4)); s.scale.set(26, 60, 1); group.add(s);
      rib.push({ s, x: k * 12 - 150, p: k * 0.31 });
    }
    return t => { for (const r of rib) { r.s.position.set(r.x + Math.sin(t * 0.2 + r.p) * 6, 70 + Math.sin(t * 0.5 + r.p * 1.7) * 12, -260); r.s.material.opacity = 0.18 + 0.2 * (0.5 + 0.5 * Math.sin(t * 0.8 + r.p * 2.3)); } };
  }
  function pyramid(group, x, z, h) {                   // a pyramid in the haze, its steps
    const v = new Vox(), n = Math.round(h / 2);
    for (let y = 0; y < n; y++) v.box(-(n - y), y, -2, n - y, y, 2, y % 2 ? 0xe8c890 : 0xd8b478);
    group.add(voxMesh(v, 2, x, 0, z));
  }
  function storefronts(group, W, z, rnd) {             // the street: false fronts, signs, a porch along them
    let x = -20;
    while (x < W + 40) {
      const v = new Vox(), w = 8 + Math.floor(rnd() * 6), h = 10 + Math.floor(rnd() * 8), c = [0xb07a4a, 0x9a6a3a, 0xc89a6a, 0x8a5a3a][Math.floor(rnd() * 4)];
      v.box(0, 0, 0, w, h, 4, c); v.box(0, h + 1, 3, w, h + 3, 4, mulC(c, 0.85));
      for (let X = 1; X < w; X += 3) v.box(X, 4, 5, X + 1, 7, 5, 0x3a2a1a);
      v.box(0, 8, 5, w, 8, 8, 0x6a4a2a); for (const X of [0, w]) v.box(X, 0, 8, X, 7, 8, 0x6a4a2a);
      v.box(2, h - 2, 5, w - 2, h - 1, 5, 0xf2e2b8);
      group.add(voxMesh(v, 0.8, x, 0, z));
      x += (w + 1) * 0.8 + rnd() * 6;
    }
  }
  function waterTower(group, x, z) {                   // a water tower on its legs
    const v = new Vox();
    for (const [X, Z] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) v.box(X, 0, Z, X, 14, Z, 0x6a4a2a);
    for (let y = 15; y < 23; y++) for (let X = -5; X <= 5; X++) for (let Z = -5; Z <= 5; Z++) if (Math.hypot(X, Z) <= 5 && Math.hypot(X, Z) > 4) v.set(X, y, Z, y % 3 ? 0x9a6a3a : 0x5a3a20);
    for (let y = 0; y < 3; y++) { const r = 5 - y * 2; v.box(-r, 23 + y, -r, r, 23 + y, r, 0x7a5a3a); }
    group.add(voxMesh(v, 0.8, x, 0, z));
  }
  function dustDevils(group, W, rnd) {                 // dust devils spinning across the flats
    const dv = [];
    for (let k = 0; k < Math.max(3, Math.round(W / 220)); k++) {
      const parts = []; for (let p = 0; p < 10; p++) { const s = new THREE.Sprite(glowMat(0xd8b080, 0.35)); s.scale.set(3 + p * 0.8, 3, 1); group.add(s); parts.push(s); }
      dv.push({ parts, x0: rnd() * W, z: -60 - rnd() * 60, sp: 2 + rnd() * 3, p: rnd() * 10 });
    }
    return t => { for (const d of dv) { const x = (d.x0 + t * d.sp) % (W + 80) - 40; d.parts.forEach((s, i) => s.position.set(x + Math.sin(t * 5 + i + d.p) * (0.4 + i * 0.25), 0.8 + i * 1.6, d.z)); } };
  }
  function foundryBack(group, W, base, z, rnd) {       // the furnaces' wall, glowing; molten metal pouring; a river of it
    const v = new Vox(), gl = new Vox(), glow = [];
    for (let X = -20; X < W + 40; X++) for (let y = 0; y < 30; y++) v.set(X, y, 0, (X % 22 < 2 || y % 15 === 0) ? 0x2a2420 : 0x3e3632);
    for (let x = 4; x < W; x += 22) { gl.box(x + 4, 4, 1, x + 14, 12, 1, 0xff7a1a); gl.box(x + 6, 6, 1, x + 12, 10, 1, 0xffd060); glow.push({ s: glowSprite(group, 0xff8a2a, 0.6, 22, 16, x + 9, base + 8, z + 2), p: x }); }
    for (let x = 30; x < W; x += 88) { gl.box(x, 13, 3, x + 1, 29, 3, 0xffa030); }
    group.add(voxMesh(v, 1, 0, base, z)); group.add(voxMesh(gl, 1, 0, base, z, materials().glow));
    const river = new THREE.Mesh(new THREE.PlaneGeometry(W + 200, 8), new THREE.MeshBasicMaterial({ color: 0xff6a1a })); river.rotation.x = -PI / 2; river.position.set(W / 2, base - 0.01, z + 10); group.add(river);
    return t => { for (const g of glow) g.s.material.opacity = 0.45 + Math.sin(t * 3 + g.p) * 0.12; };
  }
  function volcano(group, x, z, h) {                   // the volcano: a cone of black rock, lava down its sides, smoke going up
    const v = new Vox(), gl = new Vox(), n = Math.round(h / 3);
    for (let y = 0; y < n; y++) { const r = Math.round((n - y) * 1.8 + 3); for (let X = -r; X <= r; X++) v.box(X, y, -2, X, y, 2, (X * 3 + y * 7) % 13 ? 0x3a2a26 : 0x4a3430); }
    for (let k = 0; k < 4; k++) { let X = Math.round((k - 1.5) * 4); for (let y = n; y > n * 0.3; y--) { X += (k % 2 ? 1 : -1) * ((y % 3) === 0 ? 1 : 0); gl.set(X, y, 3, 0xff6a1a); } }
    gl.box(-4, n, -2, 4, n, 2, 0xffa030);
    group.add(voxMesh(v, 3, x, 0, z)); group.add(voxMesh(gl, 3, x, 0, z, materials().glow));
    glowSprite(group, 0xff5a1a, 0.7, 90, 50, x, n * 3 + 6, z + 4);
    const smoke = []; for (let k = 0; k < 10; k++) { const s = new THREE.Sprite(glowMat(0x4a3a3a, 0.5)); group.add(s); smoke.push(s); }
    return t => smoke.forEach((s, i) => { const u = ((t * 0.08 + i / 10) % 1); s.position.set(x + Math.sin(u * 5 + i) * 10, n * 3 + u * 90, z + 5); s.scale.set(20 + u * 60, 20 + u * 60, 1); s.material.opacity = 0.5 * (1 - u); });
  }
  function floatIsland(group, x, y, z, w, rnd) {       // an island floating, grass on top, rock hanging under, a column or two
    const v = new Vox(), R = Math.round(w);
    for (let X = -R; X <= R; X++) { const d = Math.round((R - Math.abs(X)) * 0.9) + 1; for (let k = 0; k < d; k++) for (let Z = -2; Z <= 2; Z++) v.set(X, -k, Z, k === 0 ? 0x7ac85a : (X + k) % 4 ? 0xd8d0bc : 0xb0a890); }
    if (rnd() < 0.7) for (let c = 0; c < 2; c++) { const X = Math.round((rnd() - 0.5) * R); for (let k = 1; k < 5 + rnd() * 5; k++) v.set(X, k, 0, 0xf4ecd8); }
    group.add(voxMesh(v, 1, x, y, z));
  }
  function templeTower(group, x, z) {                  // the temple's tower far off, gold on its top
    const v = new Vox();
    for (let y = 0; y < 50; y++) { const r = y < 40 ? 4 : 2; v.box(-r, y, -r, r, y, r, y % 8 === 0 ? 0xd8cca8 : 0xf4ecd8); }
    v.box(-1, 50, -1, 1, 55, 1, 0xd8b050);
    group.add(voxMesh(v, 1.4, x, -10, z));
  }
  function windmill(group, x, z) {                     // an old windmill, its sails turning
    const v = new Vox();
    for (let y = 0; y < 16; y++) { const r = 4 - Math.floor(y / 6); v.box(-r, y, -r, r, y, r, y > 13 ? 0x8a3a2a : 0xf2ece0); }
    v.box(-1, 2, 5, 1, 5, 5, 0x6a4a2a);
    group.add(voxMesh(v, 0.8, x, 0, z));
    const s = new Vox(); for (let k = 0; k < 4; k++) { const a = k / 4 * PI * 2; for (let r = 1; r < 13; r++) { const X = Math.round(Math.cos(a) * r), Y = Math.round(Math.sin(a) * r); s.set(X, Y, 0, 0x8a6a4a); if (r > 3) s.set(X + Math.round(-Math.sin(a) * 2), Y + Math.round(Math.cos(a) * 2), 0, 0xf6f2e8); } }
    const m = voxMesh(s, 0.8, x, 12, z + 4); group.add(m);
    const ph = x * 0.21;
    return t => { m.rotation.z = -t * 1.6 + ph; };
  }
  function stormClouds(group, W, rnd) {                 // thunderclouds, dark and heavy, above and below
    glowMat(0, 0);                                         // (the soft disc's texture, made)
    for (let k = 0; k < Math.round(W / 9); k++) {
      const c = [0x2a3040, 0x3a4458, 0x232838][k % 3];
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW_TEX, color: c, transparent: true, opacity: 0.9, depthWrite: false, fog: false }));
      const w = 50 + rnd() * 70; s.scale.set(w, w * 0.45, 1);
      s.position.set(rnd() * (W + 200) - 100, k % 2 ? 50 + rnd() * 40 : -6 + rnd() * 10, -160 - rnd() * 100); group.add(s);
    }
  }
  function airship(group, W, k, rnd) {                 // one of his airships, drifting through the storm, its props going
    const v = new Vox();
    for (let X = -22; X <= 22; X++) { const r = Math.round(6 * Math.sqrt(1 - (X / 23) * (X / 23))); for (let Y = -r; Y <= r; Y++) v.box(X, Y, -1, X, Y, 1, Math.abs(Y) === r ? 0x5a606a : (X % 8 === 0 ? 0xd8303a : 0x8a929c)); }
    v.box(-10, -10, -2, 10, -7, 2, 0x4a505a); v.box(-3, -12, -2, 3, -11, 2, 0xf2c030);
    const m = voxMesh(v, 1, 0, 0, 0); group.add(m);
    const y = 12 + rnd() * 26, z = -70 - (k % 3) * 45 - rnd() * 30, sp = 1 + rnd() * 1.5, x0 = k * 120 + rnd() * 60;
    return t => { m.position.set((x0 + t * sp) % (W + 200) - 60, y + Math.sin(t * 0.5 + k) * 3, z); };
  }
  function lightning(group, W, rnd) {                  // lightning, now and then, lighting the clouds
    const s = new THREE.Sprite(glowMat(0xe8f0ff, 0)); s.scale.set(600, 300, 1); s.position.set(W / 2, 40, -200); group.add(s);
    const bolt = new THREE.Mesh(vox(v => { let X = 0; for (let y = 40; y > 0; y--) { X += (y % 4 === 0) ? (y % 8 ? 1 : -2) : 0; v.set(X, y, 0, 0xffffff); } }, 1), new THREE.MeshBasicMaterial({ color: 0xffffff })); group.add(bolt);
    let at = 0, next = 2;
    return t => { if (t > next) { at = t; next = t + 2 + Math.random() * 5; bolt.position.set(Math.random() * W, 10, -160 - Math.random() * 60); }
      const u = t - at, f = u < 0.25 ? (u < 0.06 || (u > 0.12 && u < 0.18) ? 1 : 0.2) : 0; s.material.opacity = f * 0.55; bolt.visible = f > 0.5; };
  }
  function spire(group, x, z, h, rnd) {                // a needle of rock up out of the clouds
    const v = new Vox(), n = Math.round(h / 2);
    for (let y = 0; y < n; y++) { const r = Math.max(1, Math.round(4 * (1 - y / n)) + 1); v.box(-r, y, -r, r, y, r, (y * 3) % 7 ? 0xb8a0a8 : 0x9a8090); }
    v.box(-1, n, -1, 1, n, 1, 0x8ac86a);
    group.add(voxMesh(v, 2, x, -12, z));
  }
  function jetStream(group, W, rnd) {                  // the jet stream: streaks of white going by fast
    const st = [];
    for (let k = 0; k < Math.round(W / 20); k++) { const s = new THREE.Sprite(glowMat(0xffffff, 0.35)); s.scale.set(30 + rnd() * 30, 0.8, 1); group.add(s); st.push({ s, x: rnd() * W, y: 30 + rnd() * 50, z: -120 - rnd() * 120, v: 40 + rnd() * 50 }); }
    return t => { for (const q of st) q.s.position.set((q.x + t * q.v) % (W + 200) - 100, q.y, q.z); };
  }
  function refinery(group, W, z, rnd) {                // towers and tanks and pipes, the pink stuff glowing in its vats
    let x = -20;
    while (x < W + 40) {
      const v = new Vox(), gl = new Vox(), h = 14 + Math.floor(rnd() * 20);
      for (let y = 0; y < h; y++) for (let X = -3; X <= 3; X++) for (let Z = -3; Z <= 3; Z++) if (Math.hypot(X, Z) <= 3.2) v.set(X, y, Z, y % 6 === 0 ? 0xf2c030 : 0x5a6aa0);
      for (let X = 4; X < 16; X++) v.box(X, h - 4, 0, X, h - 3, 1, 0x8a92a8);
      gl.box(6, 0, -2, 14, 3, 2, 0xe85ab8);
      group.add(voxMesh(v, 1, x, 0, z)); group.add(voxMesh(gl, 1, x, 0, z, materials().glow));
      x += 26 + rnd() * 20;
    }
  }
  function futureCity(group, W, z, rnd) {              // white towers with domes, glass bands lit, tubes between them
    let x = -30;
    while (x < W + 40) {
      const v = new Vox(), gl = new Vox(), w = 3 + Math.floor(rnd() * 3), h = 20 + Math.floor(rnd() * 30);
      for (let y = 0; y < h; y++) v.box(-w, y, -w, w, y, w, y % 7 === 6 ? 0x7ad8ff : 0xeef2f8);
      for (let y = 0; y < 3; y++) { const r = w - y; v.box(-r, h + y, -r, r, h + y, r, 0xb8e8ff); }
      for (let y = 6; y < h; y += 7) gl.box(-w, y, w + 1, w, y, w + 1, 0x9ae8ff);
      group.add(voxMesh(v, 1, x, 0, z)); group.add(voxMesh(gl, 1, x, 0, z, materials().glow));
      if (rnd() < 0.6) { const tb = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 16, 10), new THREE.MeshLambertMaterial({ color: 0xc8f0ff, transparent: true, opacity: 0.6 })); tb.rotation.z = PI / 2; tb.position.set(x + 9, h * 0.6, z); group.add(tb); }
      x += w * 2 + 6 + rnd() * 10;
    }
  }
  function flyers(group, W, rnd) {                     // little flyers going over the city
    const fl = [];
    for (let k = 0; k < Math.round(W / 60); k++) { const m = new THREE.Mesh(vox(v => { v.box(-2, 0, -1, 2, 1, 1, [0xff5a5a, 0xffd23a, 0x5ac8ff][k % 3]); v.box(-1, 2, -1, 1, 2, 1, 0xb8e8ff); }, 0.5), materials().vox); group.add(m); fl.push({ m, x: rnd() * W, y: 26 + rnd() * 30, z: -60 - rnd() * 100, v: (rnd() < 0.5 ? -1 : 1) * (8 + rnd() * 10) }); }
    return t => { for (const f of fl) f.m.position.set(((f.x + t * f.v) % (W + 200) + W + 200) % (W + 200) - 100, f.y, f.z); };
  }
  function fortressWall(group, W, z, rnd) {            // the fortress: battlements and towers in his red and grey, his face on them
    const v = new Vox();
    for (let X = -30; X < W + 40; X++) { for (let y = 0; y < 24; y++) v.set(X, y, 0, (y % 8 === 0) ? 0x3a3a44 : 0x5a5a64); if (X % 4 < 2) v.box(X, 24, 0, X, 26, 0, 0x5a5a64); }
    for (let x = 0; x < W; x += 60) { v.box(x - 5, 0, 1, x + 5, 38, 4, 0x6a6a74); v.box(x - 6, 38, 1, x + 6, 40, 4, 0xd8302a);
      const ex = x, ey = 28; v.box(ex - 3, ey - 3, 5, ex + 3, ey + 3, 5, 0xffc890); v.box(ex - 3, ey + 2, 5, ex + 3, ey + 3, 5, 0xd8302a);
      v.box(ex - 2, ey, 6, ex - 1, ey, 6, 0x1a1a1a); v.box(ex + 1, ey, 6, ex + 2, ey, 6, 0x1a1a1a); v.box(ex - 3, ey - 2, 6, ex + 3, ey - 2, 6, 0xd8762a); }
    group.add(voxMesh(v, 1, 0, 0, z));
  }
  function fallingStars(group, W, rnd) {               // stars falling past, now and then
    const st = [];
    for (let k = 0; k < 12; k++) { const s = new THREE.Sprite(glowMat(0xfff6c8, 0.8)); s.scale.set(5, 1, 1); s.material.rotation = -0.5; group.add(s); st.push({ s, x: rnd() * W, p: rnd() * 6, per: 3 + rnd() * 4, z: -200 - rnd() * 80 }); }
    return t => { for (const q of st) { const u = ((t + q.p) % q.per) / q.per; q.s.position.set(q.x + u * 60, 120 - u * 70, q.z); q.s.material.opacity = u < 0.6 ? 0.85 : (1 - u) * 2; } };
  }
  function cloudBank(group, W, rnd, n, y0) {
    for (let k = 0; k < n; k++) {
      const v = new Vox(), r = mulberry32(k * 13 + 7), c = 3 + Math.floor(r() * 4);
      for (let q = 0; q < c; q++) {
        const cx = q * 5 + Math.floor(r() * 3), rad = 3 + Math.floor(r() * 3) - (q === 0 || q === c - 1 ? 1 : 0);
        for (let x = -rad; x <= rad; x++) for (let y = 0; y <= rad; y++) for (let z = -2; z <= 2; z++)
          if (Math.hypot(x, y * 1.2, z * 1.5) <= rad) v.set(cx + x, y, z, y === 0 ? 0xe6eef6 : 0xffffff);
      }
      group.add(voxMesh(v, 1.4, rnd() * (W + 300) - 150, (y0 || 26) + rnd() * 26, -230 - rnd() * 40, new THREE.MeshBasicMaterial({ vertexColors: true, fog: false })));
    }
  }
  function hangar(group, x, z, rnd) {                  // an arched hangar, its doors run back
    const v = new Vox(), r = mulberry32(x | 0), wall = [0xdcd8d0, 0xc8c4bc], roof = 0x6a86a6;
    for (let X = -22; X <= 22; X++) {
      const top = 14 + Math.round(Math.sqrt(1 - (X / 23) * (X / 23)) * 9);
      for (let y = 0; y <= top; y++) for (let Z = 0; Z < 26; Z++) {
        if (X > -22 && X < 22 && Z > 0 && Z < 25 && y < top) continue;
        let c = y >= top - 1 ? (Z % 4 === 0 ? mulC(roof, 0.8) : roof) : wall[(X + 22 >> 1) & 1];
        if (Z === 25 && Math.abs(X) < 15 && y < 13) c = Math.abs(X) > 12 ? 0x8a929c : 0x262a32;
        v.set(X, y, Z, jit(r, c, 0.03));
      }
    }
    v.box(-6, 15, 26, 5, 17, 26, 0xf08a24);                       // a stripe of Tails' orange over the door
    group.add(voxMesh(v, 0.5, x, 0, z));
  }
  function tower(group, x, z) {                         // the control tower
    const v = new Vox();
    v.box(-4, 0, -4, 3, 44, 3, 0xe8e6e0); for (let y = 6; y < 44; y += 6) v.box(-4, y, 4, 3, y, 4, 0xc8c6c0);
    v.box(-7, 45, -7, 6, 52, 6, 0x6ab8e0); for (const X of [-7, 6]) v.box(X, 45, -7, X, 52, 6, 0xe8e6e0);
    v.box(-8, 53, -8, 7, 54, 7, 0x3a4048); v.box(0, 55, 0, 0, 62, 0, 0x8a8e96);
    group.add(voxMesh(v, 0.5, x, 0, z));
    const s = new THREE.Sprite(glowMat(0xff4a3a, 0.9)); s.scale.set(3, 3, 1); s.position.set(x, 31.5, z); group.add(s);
  }
  function turbine(group, x, z, h) {                    // a wind turbine on the hills: it turns
    const v = new Vox(); v.box(-1, 0, -1, 0, Math.round(h * 2), 0, 0xf2f2ee); v.box(-2, Math.round(h * 2), -2, 1, Math.round(h * 2) + 2, 3, 0xe8e8e4);
    group.add(voxMesh(v, 0.5, x, 0, z));
    const b = new Vox(); for (let k = 0; k < 3; k++) { const a = k / 3 * PI * 2; for (let s = 1; s < 18; s++) b.set(Math.round(Math.cos(a) * s), Math.round(Math.sin(a) * s), 0, s > 15 ? 0xd8303a : 0xf6f6f2); }
    const m = voxMesh(b, 0.5, x, h + 1, z + 2); group.add(m);
    const ph = x * 0.37;
    return t => { m.rotation.z = t * 1.3 + ph; };
  }
  function biplane(group, W, k, rnd) {                  // a biplane going over, across the whole field and round again
    const v = new Vox(), C = [[0xf08a24, 0xf6f6f2], [0x3a7ae0, 0xf2d040], [0xd8303a, 0xf6f6f2]][k % 3];
    v.box(-8, 0, -1, 7, 2, 1, C[0]); v.box(8, 0, -1, 9, 2, 1, 0x3a3a40); v.box(10, -3, 0, 10, 5, 0, 0xc8ccd4);
    for (const y of [-1, 4]) v.box(0, y, -9, 4, y, 9, C[1]); for (const Z of [-7, 7]) v.box(2, -1, Z, 2, 4, Z, 0x8a6a4a);
    v.box(-8, 3, 0, -6, 6, 0, C[0]); v.box(-8, 2, -3, -6, 2, 3, C[1]); v.box(2, 3, 0, 4, 4, 0, 0x5ab4e0);
    const m = voxMesh(v, 0.25, 0, 0, -70 - k * 25); group.add(m);
    const sp = 7 + k * 2, off = rnd() * W, y0 = 24 + k * 6;
    return t => { m.position.x = ((t * sp + off) % (W + 260)) - 130; m.position.y = y0 + Math.sin(t * 0.6 + k) * 1.5; };
  }
  function wallpaper(group, W, base, z) {               // Amy's wallpaper: pink stripes and little hearts, a white dado below
    const c = document.createElement("canvas"); c.width = c.height = 32;
    const g = c.getContext("2d");
    for (let x = 0; x < 32; x += 8) { g.fillStyle = "#f6c2d4"; g.fillRect(x, 0, 4, 32); g.fillStyle = "#fad6e2"; g.fillRect(x + 4, 0, 4, 32); }
    g.fillStyle = "#ec7aa6";
    for (const [hx, hy] of [[6, 6], [22, 22]]) { g.fillRect(hx, hy, 2, 2); g.fillRect(hx + 3, hy, 2, 2); g.fillRect(hx - 1, hy + 1, 7, 2); g.fillRect(hx, hy + 3, 5, 1); g.fillRect(hx + 1, hy + 4, 3, 1); g.fillRect(hx + 2, hy + 5, 1, 1); }
    const t = new THREE.CanvasTexture(c); t.magFilter = t.minFilter = THREE.NearestFilter; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set((W + 300) / 5, 90 / 5);
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(W + 300, 90), new THREE.MeshLambertMaterial({ map: t }));
    wall.position.set(W / 2, base + 45, z); group.add(wall);
    const dado = new THREE.Mesh(new THREE.PlaneGeometry(W + 300, 7), new THREE.MeshLambertMaterial({ color: 0xfaf4ee })); dado.position.set(W / 2, base + 3.5, z + 0.05); group.add(dado);
    for (const [y, hgt, c2] of [[0.35, 0.7, 0xe6d6cc], [7, 0.5, 0xf4e8e0]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(W + 300, hgt), new THREE.MeshLambertMaterial({ color: c2 })); m.position.set(W / 2, base + y, z + 0.1); group.add(m); }
  }
  function bed(group, x, base, z) {                     // the bed: a pink quilt with hearts, pillows, a heart in the headboard
    const v = new Vox();
    for (const X of [0, 54]) for (const Z of [0, 20]) v.box(X, 0, Z, X + 2, 4, Z + 2, 0xf6efe6);
    v.box(0, 5, 0, 56, 10, 22, 0xf8f4ee);
    for (let X = 2; X <= 56; X++) for (let Z = -1; Z <= 23; Z++) for (let y = 11; y <= 13; y++) {
      const heart = ((X >> 2) + (Z >> 2)) % 3 === 0 && (X & 3) === 1 && (Z & 3) === 1;
      v.set(X, y, Z, heart ? 0xffffff : y === 11 && (Z === -1 || Z === 23) ? 0xe86c9c : 0xf48ab4);
    }
    v.box(4, 14, 2, 14, 17, 10, 0xffffff); v.box(4, 14, 12, 14, 17, 20, 0xfad0de);
    v.box(-2, 0, -1, 1, 30, 23, 0xf6efe6);
    for (let y = -6; y <= 6; y++) for (let Z = -6; Z <= 6; Z++) {
      const X = Z / 5, Y = (y + 1) / 5, k = X * X + Y * Y - 1;
      if (k * k * k - X * X * Y * Y * Y <= 0) v.set(2, 22 + y, 11 + Z, 0xf06a9c);
    }
    group.add(voxMesh(v, 0.5, x, base, z));
  }
  function dresser(group, x, base, z) {                 // a white dresser, gold knobs; on it a heart-shaped mirror and bottles
    const v = new Vox();
    v.box(0, 0, 0, 24, 22, 12, 0xf8f2ea);
    for (const y of [3, 10, 17]) { v.box(1, y, 13, 23, y + 5, 13, 0xf2e8de); v.box(11, y + 2, 14, 12, y + 3, 14, 0xe8c050); }
    v.box(-1, 23, -1, 25, 23, 13, 0xf6efe6);
    for (let y = -10; y <= 10; y++) for (let X = -10; X <= 10; X++) {
      const a = X / 9, b2 = (y + 1) / 9, k = a * a + b2 * b2 - 1, k2 = (X / 7.5) ** 2 + ((y + 1) / 7.5) ** 2 - 1;
      if (k * k * k - a * a * b2 * b2 * b2 > 0) continue;
      v.set(12 + X, 36 + y, 5, k2 * k2 * k2 - (X / 7.5) ** 2 * ((y + 1) / 7.5) ** 3 <= 0 ? ((X + y) % 7 === 0 ? 0xffffff : 0xbfe2f2) : 0xe8c050);
    }
    v.box(11, 24, 5, 13, 26, 5, 0xe8c050);
    v.box(2, 24, 6, 4, 29, 8, 0xf48ab4); v.box(3, 30, 7, 3, 31, 7, 0xe8c050); v.box(19, 24, 6, 22, 27, 9, 0xb070e0); v.box(20, 28, 7, 21, 28, 8, 0xffffff);
    group.add(voxMesh(v, 0.5, x, base, z));
  }
  function windowOn(group, x, base, z) {                // a window on the city, the curtains drawn back
    const v = new Vox(), sky = [0x7ac0f0, 0x9ad0f4, 0xbfe2f8];
    for (let X = 0; X <= 32; X++) for (let y = 0; y <= 40; y++) {
      const frame = X === 0 || X === 32 || y === 0 || y === 40 || X === 16 || y === 20;
      let c = frame ? 0xf8f6f2 : sky[Math.min(2, Math.floor((40 - y) / 14))];
      if (!frame && y < 10 && ((X * 7) % 5 < 3) && y < 4 + ((X * 13) % 7)) c = 0x8aa0c0;     // rooftops
      if (!frame && y > 26 && y < 31 && X > 4 && X < 13) c = 0xffffff;                        // a cloud
      v.set(X, y, 0, c);
    }
    v.box(-2, -1, 1, 34, -1, 3, 0xf8f6f2);
    for (const [X0, s] of [[-7, 1], [33, -1]]) for (let y = -4; y <= 42; y++) for (let k = 0; k < 6; k++) v.set(X0 + k + (s > 0 ? 0 : 0), y, 1 + ((k + y) % 3 === 0 ? 1 : 0), (k + (y >> 2)) % 3 === 0 ? 0xe86c9c : 0xf48ab4);
    v.box(-8, 43, 1, 40, 44, 2, 0xe8c050);
    group.add(voxMesh(v, 0.5, x, base + 14, z - 7.5));
  }
  function shelves(group, x, base, z) {                 // a tall bookcase, books of every colour, a pot plant on top
    const v = new Vox();
    v.box(0, 0, 0, 22, 60, 1, 0xf2ece4); for (const X of [0, 22]) v.box(X, 0, 0, X, 60, 10, 0xf8f2ea);
    for (let s = 0; s <= 4; s++) {
      const y = s * 15; v.box(0, y, 0, 22, y, 10, 0xf8f2ea);
      if (s === 4) continue;
      let X = 1, k = s * 5;
      while (X < 21) { const t = 1 + (k % 3 === 0 ? 1 : 0), h = 8 + (k * 7) % 5; v.box(X, y + 1, 2, Math.min(21, X + t - 1), y + h, 9, BOOKS[k % BOOKS.length]); X += t; k++; }
    }
    v.box(8, 61, 3, 14, 66, 9, 0xd8784a); v.box(9, 67, 5, 13, 72, 7, 0x5ab84a); v.box(10, 73, 5, 12, 74, 7, 0xff5a8a);
    group.add(voxMesh(v, 0.5, x, base, z));
  }
  function pictures(group, x, base, z) {                // two pictures and a clock on the wall
    const v = new Vox(), P = [[0, 0xff8ab0, 0x5ab84a], [18, 0x7ac0f0, 0xf2c040]];
    for (const [X0, c1, c2] of P) for (let X = 0; X <= 12; X++) for (let y = 0; y <= 15; y++) {
      const edge = X === 0 || X === 12 || y === 0 || y === 15;
      v.set(X0 + X, y, 0, edge ? 0xe8c050 : (Math.hypot(X - 6, y - 9) < 3 ? c1 : y < 5 ? c2 : 0xfaf6ee));
    }
    for (let X = -6; X <= 6; X++) for (let y = -6; y <= 6; y++) { const d = Math.hypot(X, y); if (d > 6.4) continue; v.set(40 + X, 26 + y, 0, d > 5.2 ? 0xf06a9c : (X === 0 && y >= 0 && y < 5) || (y === 0 && X >= 0 && X < 4) ? 0x2a2a30 : 0xfaf6ee); }
    group.add(voxMesh(v, 0.5, x, base + 13, z - 7.6));
  }
  function fairyLights(group, x, y, z) {                // a string of fairy lights along the wall, sagging between pins
    const C = [0xff8ab0, 0xfff0a0, 0xffffff, 0x9ad8ff];
    for (let k = 0; k <= 8; k++) {
      const t = k / 8, sx = x + t * 24, sy = y - Math.sin(t * PI) * 2.2;
      const s = new THREE.Sprite(glowMat(C[k % 4], 0.85)); s.scale.set(1.6, 1.6, 1); s.position.set(sx, sy, z); group.add(s);
    }
  }
  function mountains(group, W, z, g, height, rock, seed) {   // snow-capped peaks, black rock below the snowline
    const v = new Vox(), r = mulberry32(seed * 31);
    for (let x = 0; x < (W + 600) / g; x++) {
      const X = x * g, s = 0.5 + 0.5 * Math.sin(X * 0.011 + seed) * Math.sin(X * 0.023 + seed * 3), h = Math.max(2, Math.round((height * (0.35 + s * 0.65)) / g));
      for (let y = 0; y < h; y++) for (let Z = 0; Z < 3; Z++) {
        const snow = y > h * 0.55 + Math.sin(X * 0.3) * 1.5 || y === h - 1;
        v.set(x, y, Z, jit(r, snow ? 0xf4f8fc : rock, 0.05));
      }
    }
    group.add(voxMesh(v, g, -300, 0, z));
  }
  function shrine(group, x, z, rnd) {                   // an old shrine stepping up the slope, snow on every step
    const v = new Vox(), r = mulberry32(x | 0);
    for (let t = 0; t < 6; t++) {
      const w = 22 - t * 3, y0 = t * 5;
      for (let X = -w; X <= w; X++) for (let y = y0; y < y0 + 5; y++) for (let Z = -8 + t; Z <= 8 - t; Z++)
        v.set(X, y, Z, y === y0 + 4 ? 0xf4f8fc : ((X * 7 + y * 3) % 11 === 0 ? 0x4ab87a : jit(r, (y & 1) ? 0xbcb29c : 0xb0a690, 0.04)));
    }
    v.box(-3, 0, 9, 3, 10, 9, 0x2a2228);
    for (const X of [-12, 12]) { v.box(X - 1, 0, 10, X + 1, 22, 12, 0xc4baa4); v.box(X - 2, 23, 9, X + 2, 24, 13, 0xf4f8fc); }
    group.add(voxMesh(v, 0.5, x, 0, z));
  }
  const SUITS = [                                       // the four suits, 7x7
    [0x08, 0x1c, 0x3e, 0x7f, 0x3e, 0x1c, 0x08],
    [0x36, 0x7f, 0x7f, 0x7f, 0x3e, 0x1c, 0x08],
    [0x08, 0x1c, 0x3e, 0x7f, 0x7f, 0x2a, 0x1c],
    [0x1c, 0x1c, 0x6b, 0x7f, 0x6b, 0x08, 0x1c]];
  function casinos(group, W, z, rnd, k) {               // a street of casinos and clubs, every one lit
    k = k || 1;
    const NEON = [0xff5ac8, 0x7ad8ff, 0xffd060, 0xa070ff, 0xff7a5a];
    let x = -60;
    while (x < W + 60) {
      const v = new Vox(), gl = new Vox(), r = mulberry32((x * 3 + z) | 0);
      let X = 0;
      for (let b = 0; b < 6 && X < 300; b++) {
        const bw = 11 + Math.floor(r() * 12), bh = 16 + Math.floor(r() * 32), neon = NEON[Math.floor(r() * NEON.length)], body = r() < 0.5 ? 0x2a2236 : 0x221c2e;
        for (let i = 0; i < bw; i++) for (let y = 0; y < bh; y++) v.set(X + i, y, 0, body);
        for (let i = 2; i < bw - 2; i += 2) for (let y = 11; y < bh - 3; y += 3) if (r() < 0.45) gl.set(X + i, y, 1, r() < 0.7 ? 0xffe6a0 : 0xfff6e0);
        for (let i = 0; i < bw; i++) gl.set(X + i, bh, 1, neon);
        for (let y = 0; y < bh; y++) { gl.set(X, y, 1, neon); gl.set(X + bw - 1, y, 1, neon); }
        for (let i = 1; i < bw - 1; i += 2) gl.set(X + i, 6, 1, (i >> 1) & 1 ? 0xfff0a0 : 0xffffff);      // the marquee
        if (bh > 24) { const S = SUITS[Math.floor(r() * 4)], sx = X + (bw >> 1) - 3, sy = bh - 11, sc = NEON[Math.floor(r() * NEON.length)];
          for (let j = 0; j < 7; j++) for (let i = 0; i < 7; i++) if ((S[j] >> (6 - i)) & 1) gl.set(sx + i, sy + 6 - j, 2, sc); }
        X += bw + 1 + Math.floor(r() * 3);
      }
      group.add(voxMesh(v, 0.8 * k, x, 0, z)); group.add(voxMesh(gl, 0.8 * k, x, 0, z, materials().glow));
      x += X * 0.8 * k;
    }
  }
  function searchlight(group, x, z, rnd) {              // a searchlight's beam, swinging across the sky
    const geo = new THREE.ConeGeometry(5, 150, 16, 1, true); geo.translate(0, -75, 0);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xe8e0ff, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
    m.position.set(x, 0, z); m.rotation.z = PI; group.add(m);
    const ph = rnd() * 6;
    return t => { m.rotation.z = PI + Math.sin(t * 0.35 + ph) * 0.55; };
  }
  function clubFront(group, x, z) {                     // her club: black and gold, and a great neon heart over the door
    const v = new Vox(), gl = new Vox();
    v.box(-30, 0, 0, 30, 46, 4, 0x1e1626); v.box(-8, 0, 5, 8, 12, 5, 0x0e0a14); v.box(-12, 13, 5, 12, 14, 9, 0xb01e3a);
    for (let X = -30; X <= 30; X += 2) gl.set(X, 46, 5, 0xe8c050);
    for (let y = -12; y <= 12; y++) for (let X = -13; X <= 13; X++) {
      const a = X / 11, b = (y + 1) / 11, k = a * a + b * b - 1, a2 = X / 9, b2 = (y + 1) / 9, k2 = a2 * a2 + b2 * b2 - 1;
      if (k * k * k - a * a * b * b * b <= 0 && !(k2 * k2 * k2 - a2 * a2 * b2 * b2 * b2 <= 0)) gl.set(X, 30 + y, 6, 0xff4aa8);
    }
    group.add(voxMesh(v, 0.5, x, 0, z)); group.add(voxMesh(gl, 0.5, x, 0, z, materials().glow));
    const s = new THREE.Sprite(glowMat(0xff4aa8, 0.6)); s.scale.set(22, 22, 1); s.position.set(x, 15, z + 4); group.add(s);
  }
  function skyline(group, W, z, color, lit, maxH, g) {  // towers against the sunset, a few windows lit
    let x = -150;
    while (x < W + 150) {
      const v = new Vox(), gl = new Vox(), r = mulberry32((x * 7 + z) | 0);
      let X = 0;
      while (X < 200) {
        const bw = 6 + Math.floor(r() * 14), bh = Math.round((maxH * (0.3 + r() * 0.7)) / g);
        for (let i = 0; i < bw; i++) for (let y = 0; y < bh; y++) v.set(X + i, y, 0, color);
        if (r() < 0.3) v.box(X + (bw >> 1), bh, 0, X + (bw >> 1), bh + 4, 0, color);
        for (let i = 1; i < bw - 1; i += 2) for (let y = 2; y < bh - 1; y += 2) if (r() < lit * 0.35) gl.set(X + i, y, 1, r() < 0.5 ? 0xffd890 : 0xffb070);
        X += bw + Math.floor(r() * 3);
      }
      group.add(voxMesh(v, g, x, 0, z)); if (gl.m.size) group.add(voxMesh(gl, g, x, 0, z, materials().glow));
      x += X * g;
    }
  }
  function overpass(group, W, z) {                      // a raised road behind, on pillars, lamps along it
    for (let x0 = -60; x0 < W + 60; x0 += 120) {
      const v = new Vox();
      for (let X = 0; X < 120; X++) { v.box(X, 12, 0, X, 13, 7, 0xa8a29a); v.set(X, 14, 0, 0x8a847e); v.set(X, 14, 7, 0x8a847e); if (X % 22 === 0) v.box(X, 0, 2, X + 1, 11, 4, 0x9a948e); }
      group.add(voxMesh(v, 1, x0, 0, z - 3.5));
    }
    for (let x = 0; x < W; x += 30) { const s = new THREE.Sprite(glowMat(0xffd8a0, 0.7)); s.scale.set(3, 3, 1); s.position.set(x, 16, z + 0.2); group.add(s); }
  }
  function traffic(group, W, z) {                       // the traffic on it: headlights one way, tail lights the other
    const cars = [];
    for (let k = 0; k < 12; k++) {
      const dir = k % 2 ? 1 : -1, v = new Vox(), C = [0x2a3a5a, 0x5a2a2a, 0xd8d8d8, 0x3a3a40][k % 4];
      v.box(0, 0, 0, 15, 4, 6, C); v.box(3, 5, 1, 11, 7, 5, mulC(C, 0.8));
      const m = voxMesh(v, 0.25, 0, 13.5, z + (dir > 0 ? -2 : 1)); group.add(m);
      const s = new THREE.Sprite(glowMat(dir > 0 ? 0xfff0c0 : 0xff4030, 0.9)); s.scale.set(1.4, 1.4, 1); group.add(s);
      cars.push({ m, s, dir, off: k * 97 % (W + 200), sp: 14 + (k * 7) % 9 });
    }
    return t => { for (const c of cars) { const x = ((c.off + t * c.sp * c.dir) % (W + 200) + (W + 200)) % (W + 200) - 100; c.m.position.x = x; c.s.position.set(x + (c.dir > 0 ? 4 : 0), 14.2, c.m.position.z + 1.6); } };
  }
  /* ---- the second seven's backdrops */
  function disc(group, x, y, z, r, color, glow) {       // the sun or the moon, and its glow
    const m = new THREE.Mesh(new THREE.CircleGeometry(r, 40), new THREE.MeshBasicMaterial({ color, fog: false })); m.position.set(x, y, z); group.add(m);
    const s = new THREE.Sprite(glowMat(glow, 0.6)); s.scale.set(r * 5, r * 5, 1); s.position.set(x, y, z + 1); group.add(s);
  }
  function museumWall(group, W, base, z) {             // the far wall: cream stone, arched windows full of daylight, banners
    for (let x0 = -60; x0 < W + 60; x0 += 120) {
      const v = new Vox(), gl = new Vox();
      for (let X = 0; X < 120; X++) {
        const wx = (((X + x0) % 30) + 30) % 30;
        for (let y = 0; y < 40; y++) {
          const top = 26 + (wx >= 13 && wx <= 17 ? 2 : 0) + (wx === 15 ? 1 : 0);
          if (wx >= 11 && wx <= 19 && y >= 8 && y <= top) { gl.set(X, y, 0, (y % 6 === 0 || wx === 15) ? 0xa89a82 : ((wx + y) % 7 === 0 ? 0xffffff : 0xd8eef8)); continue; }
          v.set(X, y, 0, y < 2 ? 0xb8a888 : y > 36 ? 0xd8c8a8 : (wx <= 2 || wx >= 28) ? 0xf2eadc : y === 31 ? 0xc8b48c : 0xe8dcc4);
        }
        if (wx === 5 || wx === 6 || wx === 24 || wx === 25) for (let y = 13; y < 28; y++) v.set(X, y, 1, y > 25 ? 0xd8b050 : ((X + x0) % 60 + 60) % 60 < 30 ? 0xf08a3a : 0x5aa0e0);
      }
      group.add(voxMesh(v, 1, x0, base, z)); group.add(voxMesh(gl, 1, x0, base, z, materials().glow));
    }
  }
  function skeleton(group, x, base, z, kind) {         // a dinosaur's skeleton on its plinth: a long-neck, or a tyrant
    const v = new Vox(), B = 0xf2ead6, D = 0xc8bc9c;
    v.box(-15, 0, -4, 15, 2, 4, 0x6a3e22); v.box(-14, 3, -3, 14, 3, 3, 0xd8b050);
    const ribs = (s, y, n) => { for (let r = 1; r < n; r++) { v.set(s, y - r, -2, B); v.set(s, y - r, 2, B); } v.set(s, y - n, -1, D); v.set(s, y - n, 1, D); };
    if (kind) {                                          // the long-neck: four legs, the neck going up and up
      for (const lx of [-7, -4, 5, 8]) { v.box(lx, 4, -2, lx, 12, -2, B); v.box(lx, 4, 2, lx, 12, 2, B); }
      for (let sx = -24; sx <= 22; sx++) {
        const y = Math.round(sx < 0 ? 15 + sx * 0.4 : sx < 8 ? 15 + sx * 0.12 : 16 + (sx - 8) * 1.25);
        v.set(sx, y, 0, B); if (sx >= -8 && sx <= 8 && !(sx & 1)) ribs(sx, y, 5);
      }
      v.box(21, 34, -1, 25, 36, 1, B); v.set(24, 35, 2, 0x3a3020);
    } else {                                             // the tyrant: two great legs, little arms, the skull
      for (const [lx, z0] of [[-2, -2], [3, 2]]) { for (let y = 4; y < 15; y++) v.set(lx + Math.round((y - 4) * 0.25), y, z0, B); v.box(lx - 1, 4, z0, lx + 3, 4, z0, B); }
      for (let sx = -22; sx <= 10; sx++) {
        const y = Math.round(sx < 0 ? 17 + sx * 0.3 : 17 + sx * 0.35);
        v.set(sx, y, 0, B); if (sx >= -6 && sx <= 8 && !(sx & 1)) ribs(sx, y, 5);
      }
      v.box(10, 20, -2, 18, 25, 2, B); v.box(11, 17, -1, 18, 19, 1, D); v.set(15, 23, 3, 0x3a3020); v.set(15, 23, -3, 0x3a3020);
      for (let x2 = 11; x2 <= 18; x2 += 2) v.set(x2, 19, 2, 0xffffff);
      v.box(8, 13, 2, 9, 14, 2, B); v.box(9, 12, 2, 9, 12, 2, B);
    }
    group.add(voxMesh(v, 0.5, x, base, z));
  }
  function displayCases(group, x, base, z) {          // glass cases on dark wood, a fossil in each
    const v = new Vox(), gl = new Vox();
    for (let c = 0; c < 3; c++) {
      const cx = c * 9;
      v.box(cx, 0, 0, cx + 7, 6, 4, 0x6a3e22); v.box(cx, 7, 0, cx + 7, 7, 4, 0xd8b050);
      for (let X = cx; X <= cx + 7; X++) for (let y = 8; y <= 13; y++) gl.set(X, y, 0, (X + y) % 5 === 0 ? 0xffffff : 0xcfe8f0);
      v.box(cx, 14, 0, cx + 7, 14, 4, 0x6a3e22); v.box(cx, 8, 4, cx, 13, 4, 0xd8b050); v.box(cx + 7, 8, 4, cx + 7, 13, 4, 0xd8b050);
      const f = [0xd8c8a0, 0xe8a070, 0xb8c8d8][c];       // an ammonite, a trilobite, a bone
      v.box(cx + 2, 8, 2, cx + 5, 10, 2, f); v.box(cx + 3, 11, 2, cx + 4, 11, 2, f);
    }
    group.add(voxMesh(v, 0.5, x, base, z)); group.add(voxMesh(gl, 0.5, x, base, z, materials().glow));
  }
  function whale(group, x, y, z, top) {                // a whale's skeleton, hung from the ceiling on wires
    const v = new Vox(), B = 0xf2ead6, wire = Math.round(((top || y + 17) - y) / 0.5);
    for (let sx = 0; sx < 60; sx++) {
      const yy = Math.round(Math.sin(sx / 60 * PI) * 3); v.set(sx, yy, 0, B);
      if (sx > 12 && sx < 42 && sx % 3 === 0) for (let r = 1; r < 6 - Math.abs(sx - 27) / 6; r++) { v.set(sx, yy - r, -2, B); v.set(sx, yy - r, 2, B); }
    }
    v.box(0, -3, -2, 9, 1, 2, B); v.box(52, -1, -4, 58, 0, 4, B);
    for (const sx of [14, 44]) v.box(sx, 2, 0, sx, wire, 0, 0x8a8a8a);
    group.add(voxMesh(v, 0.5, x, y, z));
  }
  function waterfall(group, x, z, h) {                 // a waterfall over the cliff's lip, foaming at its foot
    const v = new Vox();
    h = Math.round(h);
    for (let X = -1; X < 5; X++) v.set(X, h, -1, 0x7ad0e0);                                // over the edge
    for (let y = 0; y < h; y++) for (let X = 0; X < 4; X++) v.set(X, y, 0, (X + y * 2) % 5 === 0 ? 0xffffff : (X === 0 || X === 3) ? 0x7ad0e0 : 0xb8ecf6);
    for (let X = -2; X < 6; X++) v.set(X, 0, 1, 0xffffff);
    group.add(voxMesh(v, 1, x, 0, z, materials().glow));
  }
  function shrineSteps(group, x, z) {                  // the old shrine: stone steps up to it, a red gate at their foot
    const v = new Vox();
    for (let k = 0; k < 18; k++) v.box(k * 2, 0, 0, k * 2 + 1, k, 6, k % 2 ? 0x7a827c : 0x8a928c);
    const tx = 37, ty = 18;
    v.box(tx, 0, 0, tx + 15, ty, 6, 0x6a726c);
    for (const px of [tx + 2, tx + 13]) v.box(px, ty + 1, 1, px, ty + 7, 1, 0xc83a2a);
    v.box(tx + 3, ty + 1, 2, tx + 12, ty + 6, 5, 0x6a4a32); v.box(tx + 6, ty + 1, 1, tx + 9, ty + 4, 1, 0xffd890);
    for (let k = 0; k < 4; k++) v.box(tx - 2 + k * 2, ty + 8 + k, 0, tx + 17 - k * 2, ty + 8 + k, 6, k ? 0x2a3040 : 0x3a4252);
    for (const px of [-5, 5]) v.box(px, 0, 3, px, 11, 3, 0xc83a2a);
    v.box(-7, 11, 3, 7, 11, 3, 0xc83a2a); v.box(-8, 12, 3, 8, 12, 3, 0x2a2a2a); v.box(-6, 9, 3, 6, 9, 3, 0xc83a2a);
    group.add(voxMesh(v, 1, x, -0.3, z));
  }
  function fireflies(group, W, rnd) {                  // fireflies over the water, blinking
    const fl = [];
    for (let k = 0; k < Math.round(W / 8); k++) {
      const s = new THREE.Sprite(glowMat(0xc8ff90, 0.8)); s.scale.set(0.6, 0.6, 1); group.add(s);
      fl.push({ s, x: rnd() * W, y: 1 + rnd() * 9, z: -4 - rnd() * 22, p: rnd() * 10 });
    }
    return t => { for (const f of fl) { f.s.position.set(f.x + Math.sin(t * 0.5 + f.p) * 2, f.y + Math.sin(t * 0.8 + f.p * 2), f.z); f.s.material.opacity = 0.45 + 0.45 * Math.sin(t * 3 + f.p); } };
  }
  function butte(group, x, z, h, rnd) {                // a butte standing alone, red rock in bands
    const v = new Vox(), w = 5 + Math.floor(rnd() * 5);
    for (let y = 0; y < h; y++) {
      const ww = w - Math.max(0, y - h + 3);
      for (let X = -ww; X <= ww; X++) for (let Z = -3; Z <= 3; Z++) v.set(X, y, Z, y % 5 < 2 ? 0xb8603a : y % 5 === 4 ? 0xe8a070 : 0xd07a4a);
    }
    group.add(voxMesh(v, 1.5, x, 0, z));
  }
  function brokenBlocks(group, W, z, rnd) {            // the near ruins: towers broken off, girders bent out of them
    for (let x0 = -60; x0 < W + 60; x0 += 100) {
      const v = new Vox(), gl = new Vox(); let X = 0;
      while (X < 100) {
        const bw = 6 + Math.floor(rnd() * 10), bh = 8 + Math.floor(rnd() * 22);
        for (let i = 0; i < bw; i++) {
          const top = bh - Math.floor(Math.abs(Math.sin(i * 1.7 + bh)) * 5);
          for (let y = 0; y < top; y++) for (let Z = 0; Z < 3; Z++) v.set(X + i, y, Z, (y % 4 === 0 || i % 4 === 0) ? 0x2e2426 : 0x3a3032);
          for (let y = 2; y < top - 1; y += 3) if (i % 3 === 1 && rnd() < 0.25) gl.set(X + i, y, 3, rnd() < 0.5 ? 0xff7a30 : 0xffb050);
        }
        if (rnd() < 0.5) for (let k = 0; k < 6; k++) v.set(X + bw - 1 + k, bh - 3 + (k >> 1), 1, 0x8a4a2a);
        X += bw + 2 + Math.floor(rnd() * 4);
      }
      group.add(voxMesh(v, 1, x0, 0, z)); group.add(voxMesh(gl, 1, x0, 0, z, materials().glow));
    }
  }
  function fires(group, W, rnd) {                      // the fires burning in the city, flickering
    const fl = [];
    for (let k = 0; k < Math.round(W / 14); k++) {
      const s = new THREE.Sprite(glowMat(rnd() < 0.5 ? 0xff7a30 : 0xffa040, 0.8)); group.add(s);
      fl.push({ s, x: rnd() * (W + 100) - 50, y: 3 + rnd() * 22, z: -70 - rnd() * 90, r: 5 + rnd() * 9, p: rnd() * 10 });
    }
    return t => { for (const f of fl) { const k = 1 + Math.sin(t * 7 + f.p) * 0.12 + Math.sin(t * 13 + f.p * 3) * 0.08; f.s.scale.set(f.r * k, f.r * k * 1.2, 1); f.s.position.set(f.x, f.y, f.z); } };
  }

  /* ---- what the backdrops stand on, and what stands on them */
  /** The height of a band() at world x: its ground's top there. */
  function bandAt(grain, base, amp, freq, seed) {
    return wx => { const x = Math.floor((wx + 60) / grain), X = x * grain - 60;
      return Math.max(1, Math.round((base + Math.sin(X * freq + seed) * amp + Math.sin(X * freq * 2.7 + seed * 2) * amp * 0.4) / grain)) * grain; };
  }
  function seaStack(group, x, z, h, rnd, T) {           // a rock standing in the bay, banded chalk, turf on top
    const v = new Vox(), w = 2 + Math.floor(rnd() * 3);
    for (let y = 0; y < h; y++) {
      const ww = w + (y < 2 ? 1 : 0);
      for (let X = -ww; X <= ww; X++) for (let Z = -2; Z <= 2; Z++)
        v.set(X, y, Z, y === h - 1 ? 0x5ea04a : y === h - 2 && (X + Z) % 2 ? 0x4a8a3a : (y % 3 === 1) ? 0xcabfa4 : 0xe8e0cc);
    }
    const top = h * 1.5 - 0.5;
    group.add(voxMesh(v, 1.5, x, -0.5, z));
    const palm = new THREE.Mesh(propGeo("tree", T), materials().vox);
    palm.position.set(x - 0.6, top, z); palm.scale.setScalar(1.4 + rnd() * 0.4); group.add(palm);
  }
  function lighthouse(group, x, y, z) {                 // a lighthouse on the headland's turf, its lamp lit
    const v = new Vox();
    for (let k = 0; k < 22; k++) { const r = k < 2 ? 3 : 2; for (let X = -r; X <= r; X++) for (let Z = -r; Z <= r; Z++) if (X * X + Z * Z <= r * r + 1) v.set(X, k, Z, k < 2 ? 0xb0a890 : (k >> 2) % 2 ? 0xe03a30 : 0xfaf8f0); }
    v.box(-3, 22, -3, 3, 22, 3, 0x3a3a42); v.box(-1, 23, -1, 1, 24, 1, 0xfff2b0); v.box(-2, 25, -2, 2, 25, 2, 0xe03a30);
    group.add(voxMesh(v, 1, x, y, z));
    const s = new THREE.Sprite(glowMat(0xfff2b0, 0.85)); s.scale.set(10, 10, 1); s.position.set(x, y + 24, z + 2); group.add(s);
  }
  function oak(group, x, y, z, k, rnd) {                // a broad tree on its trunk
    const v = new Vox(), r = 3 + Math.floor(rnd() * 2);
    v.box(0, 0, 0, 0, 4, 0, 0x6a4a2e);
    for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) for (let c = -r; c <= r; c++)
      if (Math.hypot(a, b * 1.15, c) <= r + 0.3) v.set(a, 5 + r + b, c, (a + b * 2 + c) % 5 === 0 ? 0x4a8a3a : 0x5aa046);
    group.add(voxMesh(v, 0.5 * k, x, y, z));
  }
  function fuelTank(group, x, z) {                      // a fuel tank on its footing, a ladder up its side
    const v = new Vox();
    v.box(-5, 0, -5, 5, 0, 5, 0x8a8a86);
    for (let y = 1; y < 9; y++) for (let X = -4; X <= 4; X++) for (let Z = -4; Z <= 4; Z++) if (X * X + Z * Z <= 17) v.set(X, y, Z, y === 8 ? 0xd8d8d2 : y === 4 ? 0x3a6ad0 : 0xf2f0e8);
    for (let y = 1; y < 9; y++) v.set(5, y, 0, 0x5a5a5a);
    group.add(voxMesh(v, 0.6, x, 0, z));
  }
  function beacon(group, x, z) {                        // a stone beacon on the snow, the light that does not go out on top
    const v = new Vox();
    for (let y = 0; y < 30; y++) { const r = y < 3 ? 4 : y > 26 ? 3 : 2; for (let X = -r; X <= r; X++) for (let Z = -r; Z <= r; Z++) v.set(X, y, Z, y % 6 === 0 ? 0x8a8478 : (y > 26 ? 0xf4f8fc : 0xa8a090)); }
    group.add(voxMesh(v, 1.4, x, 0, z));
    const s = new THREE.Sprite(glowMat(0x6af0a0, 0.9)); s.scale.set(22, 22, 1); s.position.set(x, 30 * 1.4 + 3, z + 2); group.add(s);
  }
  function rubble(group, W, z, rnd) {                    // heaps of broken concrete on the ground, rebar out of them, a wall still standing
    for (let x0 = -60; x0 < W + 60; x0 += 80) {
      const v = new Vox();
      for (let k = 0; k < 6; k++) {
        const cx = Math.floor(rnd() * 80), r = 3 + Math.floor(rnd() * 4);
        for (let a = -r; a <= r; a++) for (let c = -2; c <= 2; c++) {
          const h = Math.max(0, Math.round((r - Math.abs(a)) * 0.8 + rnd() * 1.5));
          for (let y = 0; y < h; y++) v.set(cx + a, y, c, (a * 3 + y * 5 + c) % 7 === 0 ? 0x2a2224 : y === h - 1 ? 0x5a5052 : 0x463c3e);
        }
        if (rnd() < 0.7) for (let y = 0; y < r + 3; y++) v.set(cx + 1 + (y >> 2), y + 1, 0, 0x8a4a2a);
        if (rnd() < 0.35) { const ww = 4 + Math.floor(rnd() * 5), hh = 6 + Math.floor(rnd() * 8);
          for (let a = 0; a < ww; a++) for (let y = 0; y < hh - (a % 3 ? 0 : 2); y++) v.set(cx + r + a, y, 2, (y % 4 === 0) ? 0x2e2426 : 0x3a3032); }
      }
      group.add(voxMesh(v, 1, x0, 0, z));
    }
  }
  /* a hall's roof, seen from below: beams across it front to back, and lit panes (skylights, or lamps) between */
  function hallCeiling(group, W, y, z0, z1, col, beam, light) {
    for (let x0 = -60; x0 < W + 60; x0 += 120) {
      const v = new Vox(), gl = new Vox(), d = Math.round(z0 - z1);
      for (let X = 0; X < 120; X++) for (let Z = 0; Z < d; Z++) {
        v.set(X, 1, Z, col);
        if (X % 12 === 0) v.set(X, 0, Z, beam);
        else if (X % 12 > 3 && X % 12 < 9 && Z % 10 > 2 && Z % 10 < 8) gl.set(X, 0.5 | 0, Z, light);
      }
      for (let X = 0; X < 120; X++) v.set(X, 0, 0, beam);
      group.add(voxMesh(v, 1, x0, y, z1)); group.add(voxMesh(gl, 1, x0, y, z1, materials().glow));
    }
  }
  function depotWall(group, W, base, z) {              // the depot's far wall: steel, ribbed, a hazard stripe along its foot
    for (let x0 = -60; x0 < W + 60; x0 += 120) {
      const v = new Vox();
      for (let X = 0; X < 120; X++) for (let y = 0; y < 32; y++)
        v.set(X, y, 0, y < 2 ? (((X >> 1) & 1) ? 0xf2c030 : 0x2a2a30) : X % 12 === 0 ? 0x4a525c : y % 8 === 0 ? 0x3e464e : 0x343c44);
      for (let X = 3; X < 120; X += 40) for (let y = 14; y < 26; y++) for (let i = 0; i < 6; i++) v.set(X + i, y, 1, y > 23 || i === 0 || i === 5 ? 0x6a2a20 : 0xc83a2a);   // banners
      group.add(voxMesh(v, 1, x0, base, z));
    }
  }
  function rack(group, x, base, z, rnd) {              // a storage rack, three shelves high, crates on every one
    const v = new Vox();
    for (const px of [0, 15]) v.box(px, 0, 0, px, 23, 0, 0xe86a20), v.box(px, 0, 4, px, 23, 4, 0xe86a20);
    for (const y of [0, 8, 16]) {
      v.box(0, y + 7, 0, 15, y + 7, 4, 0x2e66b0);
      for (let c = 0; c < 3; c++) if (rnd() < 0.85) {
        const cx = 1 + c * 5, h = 4 + Math.floor(rnd() * 3), col = rnd() < 0.6 ? 0xb07e40 : 0x7a8696;
        v.box(cx, y + 7 - h, 1, cx + 3, y + 6, 3, col); v.box(cx, y + 6, 3, cx + 3, y + 6, 3, mulC(col, 0.75));
      }
    }
    group.add(voxMesh(v, 0.5, x, base, z));
  }
  function hangLamp(group, x, y, z, top) {             // a lamp hanging on its chain from the roof, lit
    const v = new Vox();
    v.box(0, 1, 0, 0, top ? Math.round((top - y) / 0.25) : 14, 0, 0x5a5a62); v.box(-2, 0, -2, 2, 0, 2, 0x3a3a42); v.box(-1, -1, -1, 1, -1, 1, 0xfff2c8);
    group.add(voxMesh(v, 0.25, x, y, z));
    const s = new THREE.Sprite(glowMat(0xfff0c8, 0.5)); s.scale.set(4, 4, 1); s.position.set(x, y - 0.3, z + 0.2); group.add(s);
  }
  function nebula(group, W) {                          // the glow of a nebula across the sky
    for (let k = 0; k < 6; k++) {
      const s = new THREE.Sprite(glowMat([0x7a3ad8, 0x3a7ad8, 0xd83a9a][k % 3], 0.35)); s.scale.set(220, 120, 1);
      s.position.set((W + 200) * k / 6 - 100, 60 + (k % 2) * 30, -310); group.add(s);
    }
  }
  function ringedPlanet(group, x, y, z) {              // a ringed planet, far off
    const m = new THREE.Mesh(new THREE.CircleGeometry(30, 48), new THREE.MeshBasicMaterial({ color: 0xd89a6a, fog: false })); m.position.set(x, y, z); group.add(m);
    const sh = new THREE.Mesh(new THREE.CircleGeometry(30, 48, -PI * 0.15, PI), new THREE.MeshBasicMaterial({ color: 0x8a5a3a, fog: false })); sh.position.set(x, y, z + 0.2); group.add(sh);
    const ring = new THREE.Mesh(new THREE.RingGeometry(38, 50, 64), new THREE.MeshBasicMaterial({ color: 0xe8d0a8, fog: false, side: THREE.DoubleSide, transparent: true, opacity: 0.8 }));
    ring.position.set(x, y, z + 0.5); ring.scale.y = 0.28; ring.rotation.z = 0.25; group.add(ring);
  }
  function trackRibbon(group, x, z, rnd) {             // the track's far turns: a ribbon of light up on pylons from the ground
    const v = new Vox(), gl = new Vox(), y0 = 8 + Math.floor(rnd() * 14);
    for (let X = 0; X < 160; X++) {
      const y = y0 + Math.round(Math.sin(X * 0.04) * 6);
      gl.set(X, y, 0, X % 6 < 3 ? 0x7ad8ff : 0xffffff); v.set(X, y - 1, 0, 0x2a2a44);
      if (X % 20 === 10) for (let k = 0; k < y - 1; k++) { v.set(X, k, 0, k % 4 === 0 ? 0x5a5a7a : 0x44445e); v.set(X + 1, k, 0, 0x3a3a52); }
    }
    group.add(voxMesh(v, 1, x, 0, z)); group.add(voxMesh(gl, 1, x, 0, z, materials().glow));
  }
  function grandstand(group, x, z, rnd) {              // a grandstand on the ground by the course, every seat lit
    const v = new Vox(), gl = new Vox();
    for (let k = 0; k < 8; k++) for (let X = k; X < 36 - k; X++) {
      for (let y = 0; y <= k; y++) v.set(X, y, k, y === k ? 0x3a3a52 : 0x2a2a3c);
      if (rnd() < 0.6) gl.set(X, k + 1, k, [0xff5ac8, 0x7ad8ff, 0xf2d040, 0xffffff][Math.floor(rnd() * 4)]);
    }
    for (const X of [0, 35]) for (let y = 0; y < 14; y++) v.set(X, y, 8, 0x5a5a7a);
    for (let X = 0; X < 36; X++) v.set(X, 14, 8, 0x7ad8ff);
    group.add(voxMesh(v, 0.5, x, 0, z)); group.add(voxMesh(gl, 0.5, x, 0, z, materials().glow));
  }
  /* the little world under the course: craters and loose rocks on its grey ground */
  function craters(group, W, rnd) {
    for (let x0 = -60; x0 < W + 60; x0 += 120) {
      const v = new Vox();
      for (let k = 0; k < 14; k++) {
        const cx = Math.floor(rnd() * 120), cz = -Math.floor(rnd() * 90), r = 2 + Math.floor(rnd() * 5);
        for (let a = -r - 1; a <= r + 1; a++) for (let b = -r - 1; b <= r + 1; b++) {
          const d = Math.hypot(a, b);
          if (d > r - 0.5 && d <= r + 1) v.set(cx + a, 0, cz + b, 0x5a5476);              // its rim
          else if (d <= r - 0.5) v.set(cx + a, -1, cz + b, 0x26233a);                   // and its floor, sunk
        }
      }
      for (let k = 0; k < 26; k++) { const rx = Math.floor(rnd() * 120), rz = -Math.floor(rnd() * 90), h = 1 + Math.floor(rnd() * 3);
        for (let y = 0; y < h; y++) v.box(rx, y, rz, rx + h - y, y, rz + 1, y === h - 1 ? 0x6a6488 : 0x4e4a66); }
      group.add(voxMesh(v, 1, x0, 0.02, -8));
    }
  }

  function worldBelow(group, W) {                      // the world, turning far below the station's windows
    const c = document.createElement("canvas"); c.width = 256; c.height = 128;
    const g = c.getContext("2d"), r = mulberry32(77);
    g.fillStyle = "#2a6ad0"; g.fillRect(0, 0, 256, 128);
    for (let k = 0; k < 26; k++) { g.fillStyle = r() < 0.6 ? "#4a9a4a" : "#b89a5a"; g.beginPath(); g.ellipse(r() * 256, 20 + r() * 88, 8 + r() * 26, 5 + r() * 14, r() * PI, 0, PI * 2); g.fill(); }
    for (let k = 0; k < 40; k++) { g.fillStyle = "rgba(255,255,255,.75)"; g.beginPath(); g.ellipse(r() * 256, r() * 128, 6 + r() * 20, 2 + r() * 4, 0, 0, PI * 2); g.fill(); }
    const tex = new THREE.CanvasTexture(c); tex.wrapS = THREE.RepeatWrapping;
    const m = new THREE.Mesh(new THREE.SphereGeometry(260, 48, 24), new THREE.MeshBasicMaterial({ map: tex, fog: false }));
    m.position.set(W / 2, -250, -420); group.add(m);
    const s = new THREE.Sprite(glowMat(0x6ab0ff, 0.5)); s.scale.set(800, 160, 1); s.position.set(W / 2, 6, -300); group.add(s);
    return t => { m.rotation.y = t * 0.01; };
  }
  function stationWall(group, W, base, z) {            // the station's inner wall: plating, great windows, pipes along it
    for (let x0 = -60; x0 < W + 60; x0 += 120) {
      const v = new Vox(), gl = new Vox();
      for (let X = 0; X < 120; X++) {
        const wx = (((X + x0) % 40) + 40) % 40;
        for (let y = 0; y < 34; y++) {
          if (wx >= 8 && wx <= 32 && y >= 6 && y <= 24) { if (wx === 8 || wx === 32 || y === 6 || y === 24 || wx === 20) v.set(X, y, 1, 0x4a505a); continue; }   // a window
          v.set(X, y, 0, y === 3 || y === 28 ? 0x5a606a : X % 10 === 0 ? 0x6a707a : 0x7e848e);
        }
        v.set(X, 27, 2, 0x9a6a3a); v.set(X, 29, 2, 0x5a8a9a);                                   // pipes
        if (wx === 2) for (let y = 8; y < 22; y++) gl.set(X, y, 1, y % 4 === 0 ? 0xffd040 : 0x2a2a30);   // a lit strip
      }
      group.add(voxMesh(v, 1, x0, base, z)); group.add(voxMesh(gl, 1, x0, base, z, materials().glow));
    }
  }
  function warnLights(group, W, base, z) {             // warning lights over the doors, going round
    const ls = [];
    for (let x = 20; x < W; x += 40) { const s = new THREE.Sprite(glowMat(0xff3a2a, 0.8)); s.scale.set(3, 3, 1); s.position.set(x, base + 30, z); group.add(s); ls.push(s); }
    return t => { ls.forEach((s, k) => { s.material.opacity = 0.2 + 0.7 * Math.max(0, Math.sin(t * 4 + k)); }); };
  }
  function torii(group, x, z) {                       // a red gate out on a rock in the sea
    const v = new Vox(), r = mulberry32(x | 0);
    for (let y = 0; y < 5; y++) { const w = 7 - Math.floor(y / 2); v.box(-w, y, -4, w, y, 4, jit(r, y === 4 ? 0x7a7468 : 0x8a8478, 0.06)); }
    for (const px of [-4, 3]) v.box(px, 5, -1, px + 1, 19, 0, 0xd8402e);
    v.box(-6, 15, -1, 6, 15, 0, 0xd8402e);                          // the tie beam
    v.box(-7, 19, -1, 7, 20, 0, 0xd8402e); v.box(-8, 21, -1, 8, 21, 0, 0x2a2a30);
    v.set(-9, 22, -1, 0x2a2a30); v.set(9, 22, -1, 0x2a2a30); v.set(-9, 22, 0, 0x2a2a30); v.set(9, 22, 0, 0x2a2a30);
    v.box(0, 16, -1, 0, 18, 0, 0xd8402e);
    const m = new THREE.Mesh(meshVox(v, 0.5), materials().vox); m.position.set(x, -0.8, z); group.add(m);
  }
  let GLOW_TEX = null;
  function glowMat(color, op) {
    if (!GLOW_TEX) {
      const c = document.createElement("canvas"); c.width = c.height = 64;
      const g = c.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,.45)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      GLOW_TEX = new THREE.CanvasTexture(c);
    }
    return new THREE.SpriteMaterial({ map: GLOW_TEX, color, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending });
  }
  function skyTexture(T) {
    const c = document.createElement("canvas"); c.width = 2; c.height = 256;
    const g = c.getContext("2d"), gr = g.createLinearGradient(0, 0, 0, 256);
    const hex = n => "#" + n.toString(16).padStart(6, "0");
    gr.addColorStop(0, hex(T.sky[0])); gr.addColorStop(0.75, hex(T.sky[1])); gr.addColorStop(1, hex(T.sky[1]));
    g.fillStyle = gr; g.fillRect(0, 0, 2, 256);
    const t = new THREE.CanvasTexture(c); t.magFilter = THREE.LinearFilter;
    return t;
  }

  // ---------------------------------------------------------------- sound
  /* Little synthesised effects, at the game's own sfx volume. The music is Sound's. */
  let AC = null;
  let CPUS = [], cpuNow = null, cpuMode = null;       // (the CPU runners in the world, the one taking its step, and the mode a step of theirs left the race in)
  let demoQuiet = false;                              // (the demo's own steps: nobody hears its runner)
  const demoOn = () => !!demo && (mode === "title" || mode === "main");
  function sfxVol() { if (SIM || demoQuiet) return 0; const k = cpuNow ? cpuHear(cpuNow.p) : 1; if (!k) return 0; try { const v = root.Settings && Settings.get("sfxVolume"); return (v == null ? 0.7 : v) * k; } catch (e) { return 0.7 * k; } }
  function tone(f0, f1, dur, type, vol, delay) {
    try {
      AC = AC || new (root.AudioContext || root.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      const t = AC.currentTime + (delay || 0), o = AC.createOscillator(), g = AC.createGain();
      o.type = type || "square"; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
      const v = (vol || 0.12) * sfxVol();
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + 0.02);
    } catch (e) {}
  }
  function noise(dur, vol, hp) {
    try {
      AC = AC || new (root.AudioContext || root.webkitAudioContext)();
      const n = Math.floor(AC.sampleRate * dur), b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const s = AC.createBufferSource(), g = AC.createGain(), f = AC.createBiquadFilter();
      f.type = "highpass"; f.frequency.value = hp || 600;
      s.buffer = b; g.gain.value = (vol || 0.15) * sfxVol();
      s.connect(f); f.connect(g); g.connect(AC.destination); s.start();
    } catch (e) {}
  }
  const SFX = {
    jump: () => tone(300, 620, 0.12, "square", 0.07),
    double: () => tone(520, 900, 0.12, "triangle", 0.09),
    coin: () => { tone(1568, 1568, 0.05, "square", 0.05); tone(2093, 2093, 0.14, "square", 0.05, 0.05); },        // a ring
    ringLoss: () => { for (let k = 0; k < 6; k++) tone(2093 - k * 140, 1568 - k * 140, 0.06, "square", 0.04, k * 0.035); },
    shoe: () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, f, 0.12, "triangle", 0.1, i * 0.07)),
    juice: () => tone(400, 900, 0.25, "sine", 0.12),
    spring: () => tone(180, 900, 0.3, "triangle", 0.12),
    dash: () => noise(0.25, 0.1, 1800),
    stomp: () => { tone(220, 90, 0.12, "square", 0.1); noise(0.08, 0.08, 400); },
    breakIt: () => noise(0.22, 0.18, 300),
    swing: heavy => noise(heavy ? 0.16 : 0.08, heavy ? 0.09 : 0.05, heavy ? 900 : 1800),
    hit: () => { tone(260, 110, 0.09, "square", 0.08); noise(0.06, 0.07, 700); },
    cast: () => tone(500, 760, 0.1, "triangle", 0.06),
    charge: d => tone(240, 820, d, "triangle", 0.045),
    impact: () => { noise(0.22, 0.2, 180); tone(170, 48, 0.24, "square", 0.09); },
    windup: d => { tone(160, 1300, d, "sawtooth", 0.045); tone(80, 650, d, "square", 0.03); },
    blast: () => { noise(0.5, 0.26, 240); tone(1500, 110, 0.35, "sawtooth", 0.07); tone(95, 38, 0.45, "square", 0.1); },
    shot: () => tone(900, 300, 0.18, "sawtooth", 0.05),
    boom: () => { noise(0.4, 0.2, 160); tone(120, 40, 0.35, "square", 0.08); },
    set: () => tone(660, 440, 0.12, "square", 0.06),
    ring: () => [1319, 1760].forEach((f, i) => tone(f, f, 0.08, "triangle", 0.07, i * 0.05)),
    dive: () => tone(900, 200, 0.25, "sawtooth", 0.06),
    flap: () => noise(0.07, 0.06, 2400),
    glide: () => noise(0.25, 0.04, 2200),
    grab: () => tone(180, 140, 0.08, "square", 0.08),
    teleport: () => { tone(1400, 300, 0.16, "sine", 0.08); tone(300, 1400, 0.16, "sine", 0.06, 0.12); },
    rev: k => tone(200 + k * 400, 300 + k * 500, 0.08, "sawtooth", 0.05),
    roll: () => tone(180, 700, 0.18, "sawtooth", 0.08),
    homing: () => tone(700, 1400, 0.12, "triangle", 0.08),
    hurt: () => { tone(400, 120, 0.3, "sawtooth", 0.1); },
    splash: () => noise(0.3, 0.1, 500),
    bubble: () => tone(300, 900, 0.15, "sine", 0.1),
    warn: () => tone(880, 880, 0.08, "square", 0.06),
    check: () => [523, 659, 784].forEach((f, i) => tone(f, f, 0.12, "triangle", 0.1, i * 0.08)),
    fall: () => tone(600, 80, 0.6, "triangle", 0.1),
    goal: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, f, 0.18, "square", 0.07, i * 0.11)),
    star: () => [784, 988, 1175, 1319, 1568].forEach((f, i) => tone(f, f, 0.1, "triangle", 0.08, i * 0.05)),
    stumble: () => tone(260, 140, 0.15, "square", 0.08),
    pop: () => { noise(0.07, 0.12, 1600); tone(880, 1500, 0.08, "triangle", 0.07); },
    bumper: () => { tone(620, 980, 0.09, "square", 0.08); tone(1320, 1320, 0.07, "triangle", 0.05, 0.05); },
  };
  /* The Sonic games' own sounds (audio/sonic/sfx/, from Mr Lange's Sonic Sounds Complete rips of
     Sonic 3 & Knuckles, named from the Sonic Retro disassembly): each sound here that has one
     plays it; the synthesized one above stands in till it has loaded, or where none is used. */
  const SND = "audio/";
  const SFX_FILE = {
    jump: "62-jump", double: "62-jump", coin: ["33-ring-right", "34-ring-left"], ringLoss: "b9-ring-loss", shoe: "9c-super-emerald",
    spring: "b1-spring", dash: "b6-dash", stomp: "b4-explode", breakIt: "3d-break", boom: "4e-missile-explode", blast: "48-blast",
    impact: "49-thump", shot: "4d-projectile", set: "3a-shield", grab: "4a-grab", rev: "ab-spin-dash", roll: "3c-roll",
    homing: "42-insta-shield-attack", splash: "39-splash", bubble: "38-bubble", warn: "a9-air-ding", check: "63-star-post",
    fall: "35-death", goal: "b8-signpost", stumble: "36-skid", pop: "3d-break", bumper: "aa-bumper",
    bossIn: "50-boss-activate", bossHit: "6e-boss-hit", quake: "61-boss-hit-floor", fire: "4f-flamethrower-quiet", missile: "51-missile-throw",
  };
  Object.assign(SFX, { bossIn: () => SFX.warn(), bossHit: () => { SFX.hit(); SFX.impact(); }, quake: () => SFX.impact(), fire: () => SFX.blast(), missile: () => SFX.shot() });
  const SAMPLES = {};
  let ringSide = 0;
  function loadSamples() {
    if (loadSamples.done) return;
    loadSamples.done = true;
    try { AC = AC || new (root.AudioContext || root.webkitAudioContext)(); } catch (e) { return; }
    const names = new Set(); for (const v of Object.values(SFX_FILE)) [].concat(v).forEach(n => names.add(n));
    names.forEach(n => fetch(SND + "sfx/" + n + ".mp3").then(r => (r.ok ? r.arrayBuffer() : null))
      .then(b => b && new Promise((ok, no) => AC.decodeAudioData(b, ok, no))).then(buf => { if (buf) SAMPLES[n] = buf; }).catch(() => {}));
  }
  function sample(n, rate, vol) {
    const b = SAMPLES[n];
    if (!b || !AC) return false;
    try {
      if (AC.state === "suspended") AC.resume();
      const src = AC.createBufferSource(), g = AC.createGain();
      src.buffer = b; src.playbackRate.value = rate || 1; g.gain.value = (vol == null ? 0.42 : vol) * sfxVol();
      src.connect(g); g.connect(AC.destination); src.start();
      return true;
    } catch (e) { return false; }
  }
  for (const k in SFX_FILE) {
    const syn = SFX[k];
    SFX[k] = (...a) => {
      let f = SFX_FILE[k];
      if (Array.isArray(f)) f = f[(ringSide = 1 - ringSide)];                    // a ring: right, then left, as in the games
      const rate = k === "rev" ? 1 + clamp(a[0] || 0, 0, 1) * 0.6 : k === "double" ? 1.15 : 1;   // a Spin Dash revs higher as it builds
      if (!sample(f, rate)) syn(...a);
    };
  }

  /* The music: the Sonic games' own, from the soundtracks in audio/sonic/ (khinsider: Sonic the
     Hedgehog 4 Genesis, Sonic 3 Angel Island Revisited, the Sonic 2 and Sonic 1 Anniversary
     Editions), played by the cabinet itself (the rest of Post Parade's music stops while it is
     open). Each zone has its two Acts' themes; the menus, the battles, the bosses and the
     story theirs; and the classic jingles: the Act clear, invincibility, the drowning count. */
  const ZONE_BGM = { cape: "splash-hill", works: "sky-fortress", parlour: "spring-yard", peak: "ice-cap", club: "casino-night", expressway: "star-light",
    museum: "marble", springs: "hydrocity", canyon: "sandopolis", ruins: "lava-reef", depot: "metropolis", stars: "half-pipe", station: "death-egg" };
  const BATTLE_BGM = ["battle-azure-lake", "battle-balloon-park", "battle-chrome-gadget", "battle-desert-palace", "battle-endless-mine"];
  const SCREEN_BGM = { title: "title", main: "main-menu", menu: "zone-select", options: "options", setup: "competition-menu", tourney: "competition-menu", story: "story", scene: "story" };   // (every screen its own: a battle's music stops with the battle)
  const BOSS_BGM = { mecha: "metal-battle", frog: "final-boss" };
  const musicVol = () => { try { const v = root.Settings && Settings.get("musicVolume"); return v == null ? 0.55 : v; } catch (e) { return 0.55; } };
  const BGM = { els: [], cur: 0, key: null, at: {}, over: null };
  function fadeEl(el, v, ms, done) {
    clearInterval(el._fade);
    const v0 = el.volume, n = Math.max(1, Math.round(ms / 30)); let i = 0;
    el._fade = setInterval(() => { i++; el.volume = clamp(v0 + (v - v0) * i / n, 0, 1); if (i >= n) { clearInterval(el._fade); if (done) done(); } }, 30);
  }
  /** Play the track `key` (crossfading); a zone's theme picks up where it left off (`resume`). */
  function bgm(key, opts) {
    if (SIM) return;
    opts = opts || {};
    if (!key || (key === BGM.key && !opts.restart)) return;
    if (!BGM.els.length) BGM.els = [new Audio(), new Audio()];
    const from = BGM.els[BGM.cur], to = BGM.els[1 - BGM.cur];
    if (BGM.key && !from.paused && from.loop) BGM.at[BGM.key] = from.currentTime;     // where a theme was, to pick up again
    if (!from.paused) fadeEl(from, 0, 260, () => from.pause());
    to.pause(); to.loop = !opts.once; to.volume = 0;
    const at = opts.resume ? BGM.at[key] || 0 : 0;
    to.src = SND + key + ".mp3";
    to.onloadedmetadata = () => { if (at) try { to.currentTime = at < to.duration - 1 ? at : 0; } catch (e) {} };
    const go = to.play(); if (go && go.catch) go.catch(() => {});
    fadeEl(to, musicVol(), 260);
    BGM.cur = 1 - BGM.cur; BGM.key = key;
  }
  function bgmStop() { BGM.els.forEach(el => fadeEl(el, 0, 260, () => el.pause())); BGM.key = null; BGM.over = null; }
  function bgmVolume() { const el = BGM.els[BGM.cur]; if (el && !el.paused) el.volume = musicVol(); }
  const zoneBgm = d => d.bgm || (ZONE_BGM[d.theme] || "splash-hill") + "-" + Math.min(2, d.actN || 1);
  const bossBgm = b => b.C.chase ? (b.hp <= b.C.hp / 2 ? "boss-chase-2" : "boss-chase-1") : b.gem > 0 ? "mini-boss" : BOSS_BGM[b.key] || "boss";


  // ---------------------------------------------------------------- the save
  /* each player's own save (net/auth.js keeps the players); before anyone logs in, the one
     from before there were players */
  const KEY = () => root.Auth && Auth.id ? "redringcircuit.save." + Auth.id : "redringcircuit.save";
  /* The first time on a browser where the game was played as Post Parade's arcade cabinet
     (postparade.adventure.<trainer>, the same site), its record comes along: the fullest one. */
  function oldSave() {
    let best = null, most = -1;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!/^postparade\.adventure\.(?!keys$)/.test(k)) continue;
        const o = JSON.parse(localStorage.getItem(k)), n = o && o.stages ? Object.keys(o.stages).length + (o.story && o.story.done || 0) : -1;
        if (n > most) { most = n; best = o; }
      }
    } catch (e) {}
    return best;
  }
  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY())); } catch (e) {}
    if (!s) { s = oldSave(); if (s) save(s); }
    s = s && typeof s === "object" ? s : {};
    s.stages = s.stages || {}; s.cast = s.cast || "sonic";
    return s;
  }
  function save(s) { try { localStorage.setItem(KEY(), JSON.stringify(s)); } catch (e) {} }
  /* a player's save; the first player made on this browser takes the progress made before
     there were players, so nothing played is lost */
  function loadAcct(id) {
    let s = null;
    try { s = JSON.parse(localStorage.getItem("redringcircuit.save." + id)); } catch (e) {}
    if (!s) {
      let claimed = null; try { claimed = localStorage.getItem("redringcircuit.claimed"); } catch (e) {}
      if (!claimed) {
        try { s = JSON.parse(localStorage.getItem("redringcircuit.save")); } catch (e) {}
        if (!s) s = oldSave();
        try { localStorage.setItem("redringcircuit.claimed", id); } catch (e) {}
      }
    }
    s = s && typeof s === "object" ? s : {};
    s.stages = s.stages || {}; s.cast = s.cast || "sonic";
    try { localStorage.setItem("redringcircuit.save." + id, JSON.stringify(s)); } catch (e) {}
    return s;
  }
  const PAY = { clear: 60, shoe: 20, sRank: 40 };

  // ---------------------------------------------------------------- the running game
  let host = null, opts0 = null, R = null, scene = null, camera = null, sun = null, hemi = null;
  let world = null, player = null, raf = 0, last = 0, acc = 0, mode = "menu", paused = false;
  let saveData = null, stageIdx = 0, castId = "sonic";
  const keys = {}, duoKeys = [{}, {}], pad = { L: 0, R: 0, U: 0, D: 0, J: 0, Z: 0, X: 0, C: 0 }, touch = { L: 0, R: 0, U: 0, D: 0, J: 0, Z: 0, X: 0, C: 0 };
  /* `input` is the hands of whoever is moving now: the one runner's (INPUT0), or in a battle each
     fighter's own in turn -- a player's keys or pad, or the CPU's. */
  const newInput = () => ({ L: 0, R: 0, U: 0, D: 0, J: 0, Z: 0, X: 0, C: 0, jp: 0, zp: 0, xp: 0, cp: 0, dash: 0 });
  const INPUT0 = newInput();
  let input = INPUT0;
  /* A battle (or training) under way: its fighters and rules (see "battle" below). `actor` is
     the fighter whose blow, shot or trap is landing now; `hitTok` the blow itself, so it lands
     on each fighter once; `hitDmg` and `hitKnock` how hard. */
  let battle = null, actor = null, hitTok = null, hitDmg = 8, hitKnock = 0.85;
  let demo = null;                                    // the title's demo run (see demoStart)
  let SIM = false;                                    // (a run played out of sight, for a race's rival: no sound, no music, nothing counted)
  /* the tutorial running (see tutorialStart), and what the fight tells it */
  let TUT = null;
  const emit = (k, d) => { if (TUT && battle && battle.cfg.tutorial) tutHear(k, d); };

  function stages() { return (root.AdventureStages && AdventureStages.LIST) || []; }

  function ensureRenderer() {
    if (R) return true;
    try { R = new THREE.WebGLRenderer({ antialias: !LOW_POWER, powerPreference: "high-performance" }); }
    catch (e) { R = null; return false; }
    R.setPixelRatio(Math.min(root.devicePixelRatio || 1, LOW_POWER ? 1 : 1.75));
    R.shadowMap.enabled = !LOW_POWER; R.shadowMap.type = THREE.PCFSoftShadowMap;
    return true;
  }

  function buildWorld(def) {
    const T = Object.assign({ id: def.theme }, THEMES[def.theme] || THEMES.cape);
    const S = parse(def);
    H = S.H;
    scene = new THREE.Scene();
    scene.background = skyTexture(T);
    scene.fog = new THREE.Fog(T.fog[0], T.fog[1], T.fog[2]);
    hemi = new THREE.HemisphereLight(T.hemi[0], T.hemi[1], T.hemi[2]); scene.add(hemi);
    sun = new THREE.DirectionalLight(T.sun[0], T.sun[1]);
    sun.castShadow = !LOW_POWER;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 16, bottom: -10, near: 1, far: 90 });
    sun.shadow.bias = -0.0006;
    scene.add(sun, sun.target);
    camera = new THREE.PerspectiveCamera(34, 1, 0.3, 600);

    const W = S.W, rnd = mulberry32(def.id.length * 97 + 5);
    const group = new THREE.Group(); scene.add(group);
    /* the ground near the start is built now, the rest a little at a time as the camera
       comes near it (buildAhead): a long stage opens without a wait */
    const pending = [];
    for (let i0 = 0; i0 < W; i0 += 16) { if (i0 < 64) for (const m of buildChunk(S, T, i0, Math.min(W, i0 + 16))) group.add(m); else pending.push(i0); }
    const far = new THREE.Group(); scene.add(far);
    buildFar(T, S, rnd, far);
    group.add(skirts(S, T));

    const w = { def, T, S, W, group, far, pending, tiles: {}, ents: [], carrots: [], solids: [], plats: [], enemies: [], vents: [], bubbles: [],
                shots: [], fx: [], traps: [], flashes: [], eshots: [], booms: [], drafts: [], hazards: [], checks: [], start: { x: 2, y: 5 }, goal: null, shoes: [], powers: [], total: 0,
                parts: null, t: 0 };
    const M = materials();
    // tiles that can go
    const TG = { X: tileGeo("X", T), B: tileGeo("B", T), C: tileGeo("C", T) };
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const c = S.grid[j][i];
      if (!TG[c]) continue;
      const m = new THREE.Mesh(TG[c], M.vox); m.position.set(i, j, 0); m.castShadow = m.receiveShadow = true; group.add(m);
      w.tiles[i + "," + j] = { c, m, i, j, t: 0, gone: 0 };
    }
    // the rings, as one instanced mesh (`carrots` inside: the stage's c)
    const cs = S.ents.filter(e => e.t === "c");
    const cm = new THREE.InstancedMesh(propGeo("ring"), M.vox, Math.max(1, cs.length));
    cm.castShadow = true; group.add(cm);
    w.carrotMesh = cm;
    cs.forEach((e, k) => w.carrots.push({ x: e.i + 0.5, y: e.j + 0.35, k, got: false }));
    w.total = cs.length;
    const put = (geo, x, y, z) => { const m = new THREE.Mesh(geo, M.vox); m.position.set(x, y, z || 0); m.castShadow = true; group.add(m); return m; };
    let shoeN = 0;
    for (const e of S.ents) {
      const x = e.i + 0.5, y = e.j;
      switch (e.t) {
        case "P": w.start = { x, y }; break;
        case "G":
          w.goal = { x, y, m: put(propGeo(def.story ? "relic" : "goal"), x, y, def.story ? 0 : -0.4), spin: 0 };
          if (def.story) { const g = new THREE.Sprite(glowMat(0xff7060, 0.7)); g.scale.set(3.6, 3.6, 1); g.position.set(x, y + 2.0, -0.3); group.add(g); }
          break;
        case "K": w.checks.push({ x, y, on: false, m: put(propGeo("pole"), x, y, -0.9) }); break;
        /* item monitors: * holds invincibility or the speed shoes, J ten rings or a shield, by turns along the stage */
        case "*": case "J": {
          const kind = e.t === "*" ? ((e.i + e.j) % 2 ? "speed" : "star") : ["ring", "shield", "magnet"][(e.i + e.j) % 3];
          let m;
          if (ITEMS) { m = makeCard("items"); group.add(m); setFrame(m, "mon." + kind, 0, 1, x, y, false, 0.1, 0.9); }
          else m = put(propGeo("monitor_" + (kind === "magnet" ? "shield" : kind)), x, y, 0);
          w.ents.push({ t: "monitor", kind, x, y, m });
          break;
        }
        case "E": w.arena = { x0: e.i, y }; break;          // Eggman's arena: its left edge (the boss, below)
        case "@": w.powers.push({ x, y: y + 0.25, col: e.i, m: put(propGeo("powerring"), x, y + 0.25), back: 0 }); break;   // a Red Ring: a power
        case "H": w.shoes.push({ t: "shoe", n: shoeN, x, y: y + 0.2, m: put(propGeo("redring"), x, y + 0.2) }); shoeN++; break;   // a Red Star Ring
        case "Y": {                                     // a spring set at forty-five degrees, up and on
          const m = new THREE.Group(), part = n => { const q = new THREE.Mesh(propGeo(n), M.vox); q.castShadow = q.receiveShadow = true; m.add(q); return q; };
          part("springBase"); const coil = part("springCoil"), cap = part("springCap");
          m.position.set(x, y, 0); m.rotation.z = -PI / 4; group.add(m);
          w.ents.push({ t: "dspring", x, y, m, coil, cap, sq: 0 });
          springPose({ coil, cap, sq: 0 });
          break;
        }
        case "S": {                                     // a spring, its coil squashed down at rest
          const m = new THREE.Group(), part = n => { const q = new THREE.Mesh(propGeo(n), M.vox); q.castShadow = q.receiveShadow = true; m.add(q); return q; };
          part("springBase"); const coil = part("springCoil"), cap = part("springCap");
          m.position.set(x, y, 0); group.add(m);
          w.ents.push({ t: "spring", x, y, m, coil, cap, sq: 0 });
          springPose({ coil, cap, sq: 0 });
          break;
        }
        case ">": w.ents.push({ t: "dash", x, y, m: put(propGeo("dash"), x, y + 0.01) }); break;
        case "h": { const m = put(propGeo("hurdle", T), x, y); w.solids.push({ t: "hurdle", x0: x - 0.2, x1: x + 0.2, y0: y, y1: y + 1.0, m, alive: true }); break; }
        case "Q": w.ents.push({ t: "bumper", x, y: y + 0.5, m: put(propGeo("bumper", T), x, y + 0.5, -0.3), sq: 0, cd: 0 }); break;
        case "o": w.ents.push({ t: "balloon", x, y: y + 0.3, y0: y + 0.3, m: put(propGeo("balloon", T), x, y + 0.3), back: 0 }); break;
        case "M": case "V": {
          const len = e.len || 3;
          const v = new Vox(); for (let sx = 0; sx < len * 4; sx++) for (let z = ZB; z <= ZF; z++) v.set(sx, 3, z, jit(rnd, ((sx & 3) === 0) ? mulC(T.plank, 0.75) : T.plank, 0.05));
          for (let sx = 0; sx < len * 4; sx++) v.set(sx, 2, ZF, mulC(T.plank, 0.7));
          const m = new THREE.Mesh(meshVox(v, GR), M.vox); m.castShadow = true; group.add(m);
          w.plats.push({ t: e.t, i: e.i, j: e.j, len, x0: e.i, y0: e.j, x: e.i, y: e.j, dx: 0, dy: 0, m, ph: (e.i * 0.37) % (PI * 2), range: 3 });
          break;
        }
        case "k": case "r": case "b": case "n": case "p": {      // a badnik: which, the theme says
          const key = T.foes && T.foes[e.t];
          if (!key || !BADS || !BADS.f[key]) break;
          const B = BADNIKS[key], box = BADS.f[key].box, m = badCard(); group.add(m);
          const y0 = B.air ? y + 0.4 : y;
          w.enemies.push({ key, B, x, y: y0, x0: x, y0, w: box[0] * PX * 0.82 * (B.k || 1), h: box[1] * PX * 0.88 * (B.k || 1), m, alive: true,
                           ph: e.i * 1.3, t: (e.i % 7) * 0.3, at: 0, mode: "walk", dir: -1, face: -1, vx: 0, vy: 0, reach: 0 });
          break;
        }
        case "U": w.drafts.push({ x0: e.i, x1: e.i + 1, y0: e.j, y1: e.j + 8 }); break;
        case "O": w.vents.push({ x, y, t: (e.i % 3) * 0.8, m: put(propGeo("vent"), x, y) }); break;
        case "T": {
          put(propGeo("tree", T), x, y, -2.6).scale.setScalar(1.1);
          const L = LAMP_AT[T.tree];                       // a lamp's light
          if (L) { const s = new THREE.Sprite(glowMat(T.tree === "lamp" ? 0xffd890 : 0xfff0c8, 0.8)); s.scale.set(2.6, 2.6, 1); s.position.set(x + L[0] * 1.1, y + L[1] * 1.1, -2.4); group.add(s); }
          break;
        }
        case "^": {
          const m = new THREE.Mesh(vox(v => { for (let k = -7; k <= 7; k += 2) for (let z = -20; z <= 18; z += 4) v.box(k, 0, z + (k & 3), k, 4 + ((k + z) & 3), z + (k & 3), (k & 2) ? 0x3a6a2a : 0x6a3a5a); }), M.vox);
          m.position.set(x, y, 0); group.add(m); w.hazards.push({ x0: e.i + 0.1, x1: e.i + 0.9, y0: e.j, y1: e.j + 0.45 });
          break;
        }
      }
    }
    buildMech(w, def, T, M, group);                    // the course's rides and zones (the grand prix's)
    // updraft columns: drifting motes
    for (const d of w.drafts) {
      const geo = vox(v => v.box(0, 0, 0, 0, 1, 0, typeof T.snowfall === "number" ? T.snowfall : T.snowfall ? 0xffffff : 0xd8f0d0));
      d.motes = [];
      for (let k = 0; k < 7; k++) { const m = new THREE.Mesh(geo, M.glow); m.position.set(d.x0 + Math.random(), d.y0 + Math.random() * 8, 0.3); group.add(m); d.motes.push(m); }
    }
    // particles: a pool of little cubes
    const pg = new THREE.BoxGeometry(1, 1, 1);
    const pm = new THREE.InstancedMesh(pg, M.cube, 320);
    pm.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    pm.setColorAt(0, new THREE.Color(1, 1, 1));
    group.add(pm);
    w.parts = { mesh: pm, list: [] };
    // snow falling past the camera
    if (T.snowfall) {
      const n = LOW_POWER ? 200 : 500, pos = new Float32Array(n * 3);
      for (let k = 0; k < n; k++) { pos[k * 3] = Math.random() * 40 - 20; pos[k * 3 + 1] = Math.random() * 20; pos[k * 3 + 2] = Math.random() * 14 - 4; }
      const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      w.snow = new THREE.Points(geo, new THREE.PointsMaterial({ color: typeof T.snowfall === "number" ? T.snowfall : 0xffffff, size: 0.12, transparent: true, opacity: 0.9, depthWrite: false }));
      scene.add(w.snow);
    }
    shoeN = 0;
    const rs = w.arena && rivalSpec(def);
    if (rs) w.rival = newRival(w, rs);                                                          // one of the cast waiting instead (a story chapter's; Silver's challenge)
    else if (w.arena && def.boss && def.last && BSH && BOSS[def.boss]) w.boss = newBoss(def.boss, w);   // Eggman, waiting in his arena
    return w;
  }

  /* Build the next ground chunk the camera is coming to: the nearest unbuilt within forty
     metres, every other frame -- every frame once it is nearly in sight. */
  function buildAhead(w) {
    const P = w.pending; if (!P.length) return;
    let best = -1, bd = 1e9;
    for (let k = 0; k < P.length; k++) { const d = Math.abs(P[k] + 8 - camX); if (d < bd) { bd = d; best = k; } }
    w.buildT = (w.buildT || 0) + 1;
    if (bd > 40 || (bd > 22 && w.buildT % 2)) return;
    const i0 = P.splice(best, 1)[0];
    for (const m of buildChunk(w.S, w.T, i0, Math.min(w.W, i0 + 16))) w.group.add(m);
  }

  function disposeWorld() {
    CPUS = []; cpuNow = null;
    if (!scene) return;
    scene.traverse(o => {
      if (o.geometry && !o.userData.keep && !Object.values(PROPS).includes(o.geometry)) o.geometry.dispose();
    });
    if (scene.background && scene.background.dispose) scene.background.dispose();
    scene = null; world = null;
  }

  // ---------------------------------------------------------------- the runner
  function makePlayer(c, lo) {
    if (c.id === "emerl" && !c.emerl) c = emerlCast(lo);
    sheetMats(c.sheet || c.id).mat.color.setHex(world.T.tint || 0xffffff);
    if (BADS) badMats().mat.color.setHex(world.T.tint || 0xffffff);        // the badniks in the same light
    if (ITEMS) sheetMats("items").mat.color.setHex(world.T.tint || 0xffffff);  // and the monitors
    const spr = makeCard(c.sheet || c.id); world.group.add(spr);
    // Sonic Advance's Spin Dash dust, kicked up behind a rev
    const dust = framesOf(c.id, "fx.rev") ? makeCard(c.id, "fx") : null;
    if (dust) { dust.visible = false; world.group.add(dust); }
    return { c, spr, dust, x: world.start.x, y: world.start.y, vx: 0, vy: 0, face: 1, ground: true, curl: false, coyote: 0, on: null,
             state: "run", st: 0, inv: 0, carrots: 0, ringsGot: 0, shield: false, speedT: 0, shoes: world.shoes.map(() => false), falls: 0,
             check: { x: world.start.x, y: world.start.y }, airMove: false, airSp: false, airUses: 0, cd: { shot: 0, power: 0, trap: 0 },
             rev: 0, star: 0, air: AIR, inWater: false, wasWater: false, jumping: false, dead: 0, target: null, onTile: null,
             flyLeft: c.flyTime || 0, hh: c.h, warnAt: 0, mv: null, sp: null, anim: { key: null, t: 0 }, landT: 0, drop: false };
  }
  const AIR = 16;                                    // seconds of breath under water: everyone, as in the classic games
  const BELT = 3.6;                                  // a conveyor belt's speed, m/s
  const GRAV = 34;

  const tile = (i, j) => (i < 0 || i >= world.W) ? "#" : (j < 0 || j >= H) ? "." : world.S.grid[j][i];
  const solid = c => SOLIDS.indexOf(c) >= 0;
  const slopeY = (c, i, j, x) => c === "/" ? j + clamp(x - i, 0, 1) : j + 1 - clamp(x - i, 0, 1);
  const surfaceAt = (x, y) => tile(Math.floor(x), Math.floor(y - 0.05));
  /* the runner's whole body hurts what it touches: curled, rolling, gliding, diving, in the
     live frames of a blow, or with the rainbow's shine */
  const BODY_HITS = { roll: 1, charge: 1, homing: 1, glide: 1, dive: 1, tornado: 1, jet: 1, ride: 1 };
  const attacking = p => p.star > 0 || p.drillT > 0 || !!BODY_HITS[p.state] || (p.state === "atk" && p.mv.live) ||
                         (p.curl && !p.ground && p.state !== "hurt");
  /** The ground under (x, y), slopes and planks included, within a metre or so; or null. */
  function groundY(x, y) {
    const ci = Math.floor(x);
    for (let j = Math.floor(y + 0.6); j >= Math.floor(y - 1.2); j--) {
      const c = tile(ci, j);
      if (c === "/" || c === "\\") return slopeY(c, ci, j, x);
      if (solid(c) || c === "-") return j + 1;
    }
    return null;
  }

  /** The highest thing to stand on under the runner, between yHi and yLo. */
  function floorBetween(p, yHi, yLo) {
    let best = null, on = null, tl = null;
    const x0 = p.x - p.c.w / 2 + 0.04, x1 = p.x + p.c.w / 2 - 0.04;
    for (let i = Math.floor(x0); i <= Math.floor(x1); i++) for (let j = Math.floor(yHi); j >= Math.floor(yLo) - 1; j--) {
      const c = tile(i, j);
      if (solid(c) || (c === "-" && !p.drop && !(battle && p.juggle && p.state === "hurt"))) {    // (one helpless in a juggle falls through a plank)
        const top = j + 1;
        if (top <= yHi + 1e-4 && top >= yLo - 1e-4 && (best === null || top > best)) { best = top; tl = solid(c) ? { i, j } : null; }
      }
    }
    const ci = Math.floor(p.x);
    for (let j = Math.floor(yHi) + 1; j >= Math.floor(yLo) - 1; j--) {
      const c = tile(ci, j);
      if (c === "/" || c === "\\") {
        const s = slopeY(c, ci, j, p.x);
        if (s <= yHi + 0.02 && s >= yLo - 1e-4 && (best === null || s > best)) { best = s; tl = null; }
      }
    }
    for (const q of world.plats) {
      if (x1 < q.x || x0 > q.x + q.len) continue;
      const top = q.y + 1;
      if (top <= yHi + Math.max(0, q.dy) + 1e-3 && top >= yLo - 1e-3 && (best === null || top > best)) { best = top; on = q; tl = null; }
    }
    for (const b of world.solids) {
      if (!b.alive || x1 < b.x0 || x0 > b.x1) continue;
      if (b.y1 <= yHi + 1e-4 && b.y1 >= yLo - 1e-4 && (best === null || b.y1 > best)) { best = b.y1; tl = null; on = null; }
    }
    return best === null ? null : { y: best, on, tl };
  }

  function breakTile(i, j) {
    const t = world.tiles[i + "," + j];
    if (!t || t.gone) return false;
    if (t.c === "C") return false;
    world.S.grid[j][i] = ".";
    t.gone = 1; t.m.visible = false;
    burst(i + 0.5, j + 0.5, t.c === "B" ? [0xc8904a, 0x8a5a2c, 0xe0b070] : [world.T.crack, mulC(world.T.crack, 0.6), 0xbcbcc4], 14, 6);
    SFX.breakIt();
    if (t.c === "B") for (let k = 0; k < 3; k++) spawnLoose(i + 0.5, j + 0.7, (k - 1) * 2.2, 7 + k);
    return true;
  }
  /* Rings loose: a crate's, which jump out and can be caught; or a runner's own, knocked out of
     them by a hit, flying every way, to be caught again in the few seconds before they vanish. */
  function spawnLoose(x, y, vx, vy, own) {
    const m = new THREE.Mesh(propGeo("ring"), materials().vox); m.position.set(x, y, 0); world.group.add(m);
    world.ents.push({ t: "loose", x, y, vx, vy, m, life: own ? 4.2 : 6, wait: own ? 0.6 : 0.3, own: !!own });
  }
  /* what a beaten badnik lets go: the animal inside it, which hops or flies off, as in the classic games */
  /* a spring's coil, stretched by how lately it threw someone (sq 1 just now, 0 at rest): it
     shoots up, overshoots, and settles back squashed, as Sonic Advance 3's does */
  function springPose(e) {
    const k = e.sq > 0 ? 1 - e.sq : 1;
    const s = e.sq > 0 ? 0.45 + 2.0 * Math.exp(-k * 4) * Math.abs(Math.cos(k * 7)) : 0.45;
    e.coil.position.y = 3 / 16; e.coil.scale.y = s;
    e.cap.position.y = (3 + 8 * s) / 16;
  }
  function spawnCritter(x, y, cpu) {
    if (!SIM && !cpu && saveData && !(player && (player.demo || player.cpu))) PROG().animals++;     // (toward Mighty: yours, not a CPU's)
    const bird = Math.random() < 0.5, m = new THREE.Mesh(propGeo(bird ? "bird" : "bunny"), materials().vox);
    m.position.set(x, y, 0.2); world.group.add(m);
    world.ents.push({ t: "critter", bird, x, y, vx: (Math.random() < 0.5 ? -1 : 1) * (bird ? 3.5 : 3), vy: bird ? 5 : 6, m, life: 2.6 });
  }
  /* a hit with rings: they fly out of the runner every way -- thirty-two at most, as in the games */
  function scatterRings(p) {
    const n = Math.min(32, p.carrots);
    p.carrots = 0;
    for (let k = 0; k < n; k++) {
      const a = PI / 2 + (k % 16 - 7.5) * 0.19 * (k < 16 ? 1 : 1.6), sp = k < 16 ? 7 : 4.5;
      spawnLoose(p.x, p.y + p.hh * 0.5, Math.cos(a) * sp * (k % 2 ? 1 : -1), Math.abs(Math.sin(a)) * sp + 3, true);
    }
    SFX.ringLoss();
  }
  /* an item monitor broken open: what it held */
  function openMonitor(p, e) {
    e.gone = true; e.m.visible = false;
    if (ITEMS) effect("items", "smoke", e.x, e.y + 0.45, 1, 16, true, "fx", 0.9);                  // it goes up in smoke
    else burst(e.x, e.y + 0.5, [0xc8ccd6, 0xffffff, 0x182040], 12, 5);
    SFX.pop();
    if (e.kind === "ring") { p.carrots += 10; p.ringsGot += 10; SFX.coin(); hudToast("Super Ring: ten rings"); }
    else if (e.kind === "shield") { p.shield = "green"; SFX.set(); hudToast("Shield: it takes one hit for you"); }
    else if (e.kind === "magnet") { p.shield = "magnet"; SFX.set(); hudToast("Magnetic Shield: rings come to you"); }
    else if (e.kind === "star") { p.star = 15; SFX.star(); hudToast("Invincibility"); }
    else { p.speedT = 12; SFX.dash(); hudToast("Speed Shoes"); }
  }
  /** A blow lands on a box of the world: whatever is in it -- things alive, cracked rock,
      crates, hurdles -- is beaten or broken, things alive knocked by `kick` (see defeat).
      Returns how many; world.hitAt is where the first one was met. */
  function strike(x0, x1, y0, y1, kick) {
    let n = 0;
    const at = (a0, a1, b0, b1) => { if (!n) world.hitAt = { x: (Math.max(x0, a0) + Math.min(x1, a1)) / 2, y: (Math.max(y0, b0) + Math.min(y1, b1)) / 2 }; };
    world.hitAt = null; world.hitBig = false; world.guarded = false;
    for (const e of world.enemies) if (e.alive && !e.hidden && e.x + e.w / 2 > x0 && e.x - e.w / 2 < x1 && e.y + e.h > y0 && e.y < y1) {
      at(e.x - e.w / 2, e.x + e.w / 2, e.y, e.y + e.h);
      /* a blow (not a blast) glances off spikes, a spin, Pierrot's ball and Gao-gao's face */
      if (!(kick && kick.r) && (e.guard || e.B.armor === "ball" || (e.B.armor === "shell" && e.mode !== "open") ||
                                (e.B.armor === "front" && sgn((x0 + x1) / 2 - e.x) === e.face))) { glance(e); continue; }
      defeat(e, kick); n++;
    }
    for (let i = Math.floor(x0); i <= Math.floor(x1 - 0.01); i++) for (let j = Math.floor(y0); j <= Math.floor(y1 - 0.01); j++) {
      const t = tile(i, j);
      if ((t === "X" || t === "B") && breakTile(i, j)) { at(i, i + 1, j, j + 1); n++; }
    }
    for (const b of world.solids) if (b.alive && b.x1 > x0 && b.x0 < x1 && b.y1 > y0 && b.y0 < y1) { at(b.x0, b.x1, b.y0, b.y1); smashHurdle(b); n++; }
    if (world.boss && !battle) { const nb = bossStrike(x0, x1, y0, y1); if (nb) world.hitBig = true; n += nb; }
    /* in a battle, the other side's fighters (not one's own team) */
    if (battle && actor) for (const q of battle.fs) {
      if (!rivals(actor, q) || q.ko || q.out) continue;
      const qx0 = q.x - q.c.w / 2, qx1 = q.x + q.c.w / 2;
      if (qx1 <= x0 || qx0 >= x1 || q.y + q.hh <= y0 || q.y >= y1) continue;
      if (hitFighter(q, kick, (x0 + x1) / 2)) { at(qx0, qx1, q.y, q.y + q.hh); n++; world.hitBig = true; }
    }
    return n;
  }

  /* Walls: tiles, and hurdles while they stand. A glide into a wall grabs it. */
  /* A tile in the way whose top is no more than half a metre over the feet, with nothing on
     it, is a lip, not a wall: the foot of a slope and the edge at its top are such lips (the
     ground under the next stretch of slope is a hand-width or two over the feet, because a
     runner moves along before the ground lifts them -- the more, the faster they go). Every
     tile step in a stage is a whole metre, so no real wall is ever a lip. */
  /* (a wide runner -- Eggman's Egg Mobile -- reaches the next tile sooner, while the ground is
     still further from lifting them: their lip is that much higher) */
  const isLip = (p, i, j) => j + 1 - p.y <= 0.5 + Math.max(0, p.c.w / 2 - 0.3) && !solid(tile(i, j + 1));
  function moveX(p, dx) {
    p.x += dx;
    const hb = p.hh;
    const yb = p.y + (p.ground ? 0.36 : 0.06), yt = p.y + hb - 0.06;
    let lift = null;
    for (let pass = 0; pass < 2; pass++) {
      const edge = dx > 0 ? p.x + p.c.w / 2 : p.x - p.c.w / 2;
      const i = Math.floor(edge);
      let hit = false;
      for (let j = Math.floor(yb); j <= Math.floor(yt); j++) {
        const c = tile(i, j);
        if (!solid(c)) continue;
        if ((c === "X" || c === "B") && attacking(p)) { breakTile(i, j); continue; }
        if (isLip(p, i, j)) { if (!lift || j + 1 > lift.y) lift = { y: j + 1, i, j }; continue; }   // run (or fly, glide, roll) up onto it
        hit = true; break;
      }
      if (hit) {
        p.x = dx > 0 ? i - p.c.w / 2 - 1e-3 : i + 1 + p.c.w / 2 + 1e-3;
        if (battle && p.state === "hurt" && p.smashT > 0 && p.cmb && !p.cmb.wb && Math.abs(p.vx) > 6) return wallBounce(p, sgn(dx));   // smashed into it
        if (p.state === "homing" || p.state === "seek" || p.state === "dash" || p.state === "jet" || p.state === "psy") { p.state = "run"; p.st = 0; }
        if (p.state === "glide" && p.c.climb) { startClimb(p, sgn(dx)); return; }
        p.vx = 0; p.ballistic = false;
        if (p.state === "roll") p.state = "run";
      }
    }
    /* up onto a lip: stand on it -- and, coming down onto it from the air, land */
    if (lift && lift.y > p.y) {
      p.y = lift.y;
      if (!p.ground && p.vy <= 0) land(p, { on: null, tl: { i: lift.i, j: lift.j } });
    }
    for (const b of world.solids) {
      if (!b.alive) continue;
      if (p.x + p.c.w / 2 <= b.x0 || p.x - p.c.w / 2 >= b.x1 || yt <= b.y0 || yb >= b.y1) continue;
      if (attacking(p)) { smashHurdle(b); continue; }
      p.x = dx > 0 ? b.x0 - p.c.w / 2 - 1e-3 : b.x1 + p.c.w / 2 + 1e-3;
      if (Math.abs(p.vx) > 7 && p.ground) { p.vx = -sgn(p.vx) * 3; p.state = "stumble"; p.st = 0.35; SFX.stumble(); }
      else p.vx = 0;
    }
  }
  function smashHurdle(b) {
    b.alive = false; b.m.visible = false;
    burst((b.x0 + b.x1) / 2, b.y0 + 0.5, HURDLE_C[world.T.hurdle] || HURDLE_C.brush, 16, 7);
    SFX.breakIt();
  }

  const AIR_STATES = { homing: 1, fly: 1, glide: 1, teleport: 1, seek: 1, climb: 1, jet: 1, psy: 1 };
  function land(p, hit) {
    if (!p.ground && p.vy < -14 && !(p.state === "dive" && p.diveS && p.diveS.bits === 0)) burst(p.x, p.y, [0xd8d0c0, 0xc8c0b0], 5, 2);
    if (!p.ground && p.vy < -4) p.landT = 0.14;
    const fell = p.vy;
    p.ground = true; p.vy = 0; p.ballistic = false; p.airMove = false; p.airSp = false; p.airUses = 0; p.airChain = 0; p.jumping = false; p.flyLeft = p.c.flyTime || 0;
    p.on = hit.on; p.onTile = hit.tl;
    /* a juggle comes down: the chase's smash bounces off the floor (once a combo); else after a
       combo of three or more, or a hard fall, they are knocked down a moment */
    if (battle && p.state === "hurt" && p.juggle) {
      if (p.smashT > 0 && p.spike && !p.cmb.gb && fell < -4) return floorBounce(p);
      p.juggle = false;
      if (p.cmb.n >= 3 || fell < -11) { p.state = "down"; p.st = 0.6; p.vx *= 0.5; burst(p.x, p.y + 0.05, [0xd8d0c0, 0xc8c0b0], 8, 3); SFX.stomp(); emit("down", { q: p }); }
      else p.st = Math.min(p.st, 0.1);
    }
    if (p.state !== "roll") p.curl = false;
    if (p.state === "dive") diveLand(p, fell);
    else if (AIR_STATES[p.state]) p.state = "run";
    else if (p.state === "atk" && p.mv.air && p.mv.name !== "aim") { p.state = "run"; p.mv = null; }
  }

  /* Hurt, the Sonic way: a shield takes the hit and goes; else the rings fly out; with no rings
     at all, the runner is down, and goes back to the last Star Post. */
  function hurt(p, fromX) {
    if (p.inv > 0 || p.star > 0 || p.dead || p.state === "ride" || p.drillT > 0) return;
    p.inv = 1.6;
    p.vx = -sgn(fromX - p.x || p.face) * 7; p.vy = 8; p.ground = false;
    p.state = "hurt"; p.st = 0.45; p.curl = false; p.mv = null; p.sp = null;
    SFX.hurt(); if (!p.cpu) flashHud();
    burst(p.x, p.y + 1, [0xffffff, 0xf2d040], 8, 4);
    if (p.shield) { p.shield = false; burst(p.x, p.y + p.hh / 2, [0x6ac8ff, 0xffffff], 14, 5); return; }
    if (p.carrots > 0) scatterRings(p);
    else die(p, "beaten");
  }
  function die(p, why) {
    if (p.dead) return;
    if (p.demo) { p.demoFell = true; return; }           // (the robot's run -- the title's, a rival's: over)
    p.dead = 1.1; p.why = why; p.falls++;
    SFX.fall();
  }
  function respawn(p) {
    p.dead = 0; p.carrots = 0; p.shield = false; p.speedT = 0; p.x = p.check.x; p.y = p.check.y + 0.02; p.vx = 0; p.vy = 0; p.inv = 1.4;
    p.state = "run"; p.ground = false; p.air = AIR; p.star = 0; p.rev = 0; p.mv = null; p.sp = null; p.curl = false; p.ride = null; p.ballistic = false;
    if (!p.cpu) snapCamera();
  }

  // ---------------------------------------------------------------- moving
  function step(dt) {
    const p = player, w = world, c = p.c;
    if (!battle && !p.cpu) w.t += dt;                     // (a battle keeps one clock for everyone; so does a race: yours)
    if (p.ko) { stepKO(p, dt); return; }
    if (p.dead) {
      p.dead -= dt;
      if (p.dead <= 0) respawn(p);
      return;
    }
    if (mode === "goal") { p.vx *= Math.pow(0.02, dt); goalStep(p, dt); if (!p.ground) p.vy = Math.max(p.vy - GRAV * dt, -22); integrate(p, dt); return; }
    p.inv = Math.max(0, p.inv - dt); p.star = Math.max(0, p.star - dt); p.speedT = Math.max(0, (p.speedT || 0) - dt);
    if (p.slowT > 0) p.slowT -= dt; if (p.drillT > 0) p.drillT -= dt;
    for (const k in p.cd) p.cd[k] = Math.max(0, p.cd[k] - dt);
    p.comboT = Math.max(0, (p.comboT || 0) - dt);
    p.drop = false;
    const dir = input.R - input.L;
    // where they are
    const midTile = tile(Math.floor(p.x), Math.floor(p.y + p.hh * 0.5));
    const headTile = tile(Math.floor(p.x), Math.floor(p.y + p.hh - 0.1));
    p.wasWater = p.inWater;
    p.inWater = midTile === "~";
    if (p.inWater !== p.wasWater && Math.abs(p.vy) > 3) { SFX.splash(); burst(p.x, Math.floor(p.y + p.hh * 0.5) + 1, [0xffffff, mixC(w.T.water, 0xffffff, 0.5)], 10, 4); }
    const under = p.ground ? (p.onTile ? tile(p.onTile.i, p.onTile.j) : surfaceAt(p.x, p.y)) : null;
    const ice = under === "I", mud = under === "m";
    // breath
    if (headTile === "~" && !c.swims) {                  // (Chaos is water: he never runs out of air)
      p.air -= dt;
      if (p.air < 6 && w.t > p.warnAt) { SFX.warn(); p.warnAt = w.t + 1; }
      if (p.air <= 0) { die(p, "air"); return; }
    } else p.air = AIR;
    let top = c.run * (p.star > 0 ? 1.22 : 1) * (p.speedT > 0 ? 1.35 : 1) * (p.paceK || 1) * (p.slowT > 0 ? 0.55 : 1) * (p.drillT > 0 ? 1.6 : 1), acc = (p.ground ? c.accel : c.airAccel) * (p.speedT > 0 ? 1.3 : 1), fr = p.ground ? 30 : 4;
    if (p.inWater) { if (c.swims) { acc *= 1.2; fr = 12; } else { top *= 0.62; acc *= 0.6; fr = 8; } }
    if (mud) top *= 0.5;
    if (ice) { acc *= 0.32; fr = 2.2; }
    p.st -= dt;
    if (battle) guardUpkeep(p, dt);
    /* a press waits a moment for the runner to be free -- and in a blow, for its link -- with the
       direction held as it was pressed */
    if (battle && input.Z && input.X && (input.zp || input.xp) && p.burst >= BURST_MAX && !p.ko && p.state !== "burst") {
      input.zp = input.xp = 0; p.buf = null; psychBurst(p);
    }
    if (input.zp || input.xp || input.cp) p.buf = { k: input.zp ? "z" : input.xp ? "x" : "c", U: input.U, D: input.D, t: 0.2 };
    else if (p.buf && p.state !== "atk" && (p.buf.t -= dt) <= 0) p.buf = null;
    p.jbuf = input.jp ? 0.15 : Math.max(0, (p.jbuf || 0) - dt);
    if (p.hang > 0) p.hang -= dt;
    if (p.shotHit > 0) p.shotHit -= dt;
    if (p.hideT > 0) p.hideT -= dt;
    if (p.wallT > 0) p.wallT -= dt;
    if (p.floorT > 0) p.floorT -= dt;
    p.hh =(p.state === "crouch" || p.state === "roll" || p.state === "charge") && !c.lift ? 0.72 : c.h;
    if (p.state === "ledge") { stepLedge(p, dt); interact(p, dt); return; }
    if (p.rideCd > 0) p.rideCd -= dt;
    if (p.state === "ride") { stepRide(p, dt); if (p.state === "ride") interact(p, dt, true); return; }   // on a ride: it carries you (rings on the way)
    const px0 = p.x;

    // what they are in the middle of
    switch (p.state) {
      case "hurt": case "stumble":
        if (battle && p.ground && p.state === "hurt") p.vx *= Math.pow(0.03, dt);     // knocked along the floor, sliding to a stop
        if (p.smashT > 0) p.smashT -= dt;
        if (p.st <= 0) {
          p.state = "run";
          if (p.juggle && !p.ground) { p.inv = Math.max(p.inv, 0.2); p.vy = Math.max(p.vy, 4); burst(p.x, p.y + p.hh / 2, [0xffffff, 0xbfe8ff], 6, 3); }  // out of it in the air: a flip clear
          p.juggle = false;
        }
        break;
      case "down":                                          // knocked down: a moment on the floor, then getting up, untouchable
        p.vx *= Math.pow(0.02, dt);
        if (p.st <= 0) { p.state = "getup"; p.st = GETUP_T; p.inv = Math.max(p.inv, GETUP_T + 0.15); }
        break;
      case "getup": p.vx = 0; if (p.st <= 0) p.state = "run"; break;
      case "blocked":                                       // parried: reeling, open
        p.vx *= Math.pow(0.02, dt);
        if (p.st <= 0) p.state = "run";
        break;
      case "burst": p.vx *= Math.pow(0.01, dt); if (p.st <= 0) p.state = "run"; break;
      case "crouch":
        p.vx = Math.abs(p.vx) <= fr * dt ? 0 : p.vx - sgn(p.vx) * fr * dt;
        if (!p.ground || (!input.D && !(battle && p.guardT > 0))) { p.state = "run"; p.landT = 0.1; }   // (a guard, once up, plays out)
        else if (battle) stepGuard(p, dt);                // in a battle, Down guards, and held, heals
        break;
      case "charge":                                       // a Spin Dash, revving: tap Space, let go of Down
        p.vx *= Math.pow(0.0005, dt);
        p.rev = Math.min(1, p.rev + dt * 0.5);
        if (input.jp) { p.rev = Math.min(1, p.rev + 0.2); p.revKick = 1; SFX.rev(p.rev); if (p.rev > 0.45) revSpark(p); }
        if (!input.D) {
          p.state = "roll"; p.vx = p.face * (13 + p.rev * 10) * (p.inWater ? 0.7 : 1); p.rev = 0; emit("spindash", { p });
          SFX.roll(); effect(c.id, "fx.dust", p.x - p.face * 0.6, p.y, -p.face, 22, false);
        }
        if (!p.ground) p.state = "run";
        break;
      case "roll":
        if (p.driveT > 0) { p.driveT -= dt; p.vx = p.face * 19; }
        else {
          p.vx -= sgn(p.vx) * 3.2 * dt;
          if (dir && sgn(dir) !== sgn(p.vx)) p.vx -= sgn(p.vx) * 9 * dt;
        }
        if (Math.abs(p.vx) < 3 && p.ground) p.state = input.D ? "crouch" : "run";
        if (!p.ground && !(p.driveT > 0)) p.state = "run";
        break;
      case "dash":                                         // a double tap: each runner's own burst
        if (c.id !== "knuckles" && dir && dir !== p.face) { if (c.steer) p.face = dir; else { p.state = "run"; break; } }
        if (c.steer && dir && (p.driveT2 = (p.driveT2 || 0) + dt) < 2.5) p.st = Math.max(p.st, 0.08);   // Drive Mode: on while held
        p.vx = p.face * Math.max(c.steer ? 0 : Math.abs(p.vx), c.run * dashK(c));
        if (p.st <= 0) p.state = "run";
        break;
      case "atk": stepBlow(p, dt); break;
      case "seek": stepSeek(p, dt); break;
      case "homing": stepHoming(p); break;
      case "special": stepSpecial(p, dt); break;
      case "tornado": stepTornado(p, dt); break;
      case "dive": stepDive(p, dt); break;
      case "erupt": stepErupt(p, dt); break;
      case "climb": stepClimb(p, dir); break;
      case "teleport": if (p.st <= 0) p.state = "run"; break;
      case "jet": case "psy":                              // Metal's jet, Silver's Psycho Dash: a burst ahead, easing off
        p.vx = p.face * Math.max(Math.abs(p.vx) - (p.state === "psy" ? 14 : 8) * dt, c.run * 0.9);
        if (p.st <= 0) { if (p.state === "psy") p.floatT = 1.6; p.state = "run"; }
        break;
      case "recoil":                                       // thrown back by his own blast, braking
        if (p.recoilLanded && battle && shotCancel(p)) break;
        p.vx = Math.abs(p.vx) <= 16 * dt ? 0 : p.vx - sgn(p.vx) * 16 * dt;
        if (p.st <= 0) p.state = "run";
        break;
      case "fly":
        p.flyLeft -= dt;
        if (input.D) { p.state = "run"; p.catchT = 0.3; }        // Rouge Catch: lets go
        else if (p.inWater && srcOf(p, "air") !== "tails") p.state = "run";
        else if (c.air === "hover" && p.flyLeft <= 0 && !c.glides) p.state = "run";   // Gamma's Flight Mode runs out
        break;
      case "glide":
        if (!input.J || p.ground) { p.state = "run"; break; }
        if (dir && dir !== p.face) { p.face = dir; p.vx = dir * 4; }
        p.vx = p.face * clamp(Math.abs(p.vx) + 6 * dt, 4, p.inWater ? 5 : 10);
        break;
    }
    // running, and steering in the air (not a shot from a cannon or a spring that flies true)
    if ((p.state === "run" || p.state === "fly" || p.state === "teleport") && !(p.ballistic && !p.ground)) {
      const t2 = p.state === "fly" ? Math.min(top * 1.3, c.run * (c.flyK || (srcOf(p, "air") === "rouge" ? 0.8 : 0.66))) : top;
      if (dir) {
        if (sgn(p.vx) !== dir && Math.abs(p.vx) > 0.4) p.vx += dir * acc * (ice ? 1 : 2.4) * dt;
        else if (Math.abs(p.vx) < t2) p.vx = clamp(p.vx + dir * acc * dt, -t2, t2);
        else p.vx -= sgn(p.vx) * Math.min(Math.abs(p.vx) - t2, 9 * dt);
        p.face = dir;
      } else {
        const d = fr * dt;
        p.vx = Math.abs(p.vx) <= d ? 0 : p.vx - sgn(p.vx) * d;
      }
    }

    const zg = w.zones && w.zones.length ? zoneStep(p, dt, dir) : 1;         // the course's currents, winds and low gravity
    // the buttons
    const free = p.state === "run" || p.state === "crouch" || p.state === "fly" || p.state === "glide" || p.state === "dash" ||
                 p.state === "roll" || p.state === "teleport" || p.state === "jet" || p.state === "psy";
    if (p.ground) p.coyote = 0.1; else p.coyote -= dt;
    if (input.jp && free) {
      const onPlank = p.ground && p.onTile === null && !p.on && tile(Math.floor(p.x), Math.floor(p.y - 0.1)) === "-";
      if (input.D && onPlank) { p.drop = true; p.ground = false; p.y -= 0.12; p.state = "run"; }
      else if (input.D && p.ground && c.spinDash && p.state !== "roll") startCharge(p);
      else if (input.D && p.ground && !c.spinDash) { /* no Spin Dash (Rouge, Chaos, Gamma, Eggman): Down + Space does nothing */ }
      else if (battle && p.ground && p.shotHit > 0 && juggled(p)) { p.shotHit = 0; superJump(p); }   // a shot of theirs threw someone up: after them
      else if ((p.ground || p.coyote > 0) && p.state !== "fly" && p.state !== "glide") jump(p, mud);
      else airAction(p);
    }
    if (p.jumping && !input.J && p.vy > 5 && p.state === "run") { p.vy = 5; p.jumping = false; }
    if (free) {
      if (input.dash && p.ground && (p.state === "run" || p.state === "crouch")) startDash(p, input.dash);
      else if (p.buf) { const b = p.buf; p.buf = null; freshPress(p, b); }
    }
    // Down: crouch when still, curl into a roll when running (everyone with a Spin Dash)
    if (p.state === "run" && p.ground && input.D) {
      if (c.spinDash && Math.abs(p.vx) > 4) { p.state = "roll"; p.curl = true; SFX.roll(); }
      else if (Math.abs(p.vx) < 4) p.state = "crouch";
    }

    // gravity
    let g = GRAV * zg, maxFall = 22;
    if (p.inWater) { g *= c.swims ? 0.3 : 0.45; maxFall = c.swims ? 4 : 6; }
    switch (p.state) {
      case "homing": case "seek": case "climb": case "dive": g = 0; break;
      case "burst": if (p.st > 0.15) { g = 0; p.vy *= Math.pow(0.02, dt); } else g *= 0.5; break;   // hanging in the blast
      case "fly":
        if (c.air === "hover") {                                   // Gamma and Eggman: no climbing, held up, sinking
          if (p.flyLeft > 0) { g = 0; p.vy = lerp(p.vy, -(c.sink || 0), Math.min(1, dt * 5)); }
          else { g *= 0.25; maxFall = 1.8; }                       // Eggman, out of it, sinks slowly
        } else if (p.flyLeft > 0) { g *= 0.3; maxFall = 2.4; }
        else if (c.glides) { g *= 0.25; maxFall = 1.6; }           // Rouge, tired, glides down on her wings
        else { g *= 0.5; maxFall = 4; }
        break;
      case "glide": if (p.vy > -1.5) g *= 0.5; else { p.vy = p.inWater ? -1 : -1.5; g = 0; } break;
      case "teleport": g *= 0.25; maxFall = 2; break;
      case "jet": g *= 0.15; maxFall = 0.8; break;
      case "psy": g = 0; p.vy = lerp(p.vy, 0, Math.min(1, dt * 10)); break;
      case "atk": if (p.mv.air) g *= p.hang > 0 ? 0.3 : 0.6; break;
      case "hurt":
        if (p.dazeT > 0 && p.juggle && p.vy < 1 && !(p.hang > 0)) { p.dazeT -= dt; g *= 0.15; maxFall = 1.5; }   // held up by a shot: floating down
        else if (p.hang > 0 && p.juggle) g *= 0.3 * (1 + Math.min(0.8, p.cmb.n * 0.05));   // an air combo: falling slowly, with the one hitting them (a long one less so)
        else if (p.smashT > 0 && !p.spike) g *= 0.45;                             // smashed: flying, low and far
        else if (p.juggle && p.cmb) g *= 1 + Math.min(0.8, p.cmb.n * 0.05);       // a long juggle falls faster and faster
        break;
      case "special": if (p.sp.air) { g *= 0.3; maxFall = 2.5; } break;
      case "tornado": if (p.tor.air) { g *= 0.15; maxFall = 1.2; } break;
    }
    // an updraft lifts anyone in it; one flying or gliding goes up it fastest
    /* Silver, after his Psycho Dash, floats down while Space is held; Mighty's Shell Launch is
       curled on the way up and uncurls at the top */
    if (p.floatT > 0) { p.floatT -= dt; if (p.state === "run" && !p.ground && input.J && p.vy < 0) maxFall = Math.min(maxFall, 2.4); }
    if (p.launchT > 0) { p.launchT -= dt; if (p.launchT <= 0 && p.state === "run") p.curl = false; }
    const floaty = p.state === "fly" || p.state === "glide";
    for (const d of w.drafts) if (p.x > d.x0 - 0.25 && p.x < d.x1 + 0.25 && p.y > d.y0 - 0.5 && p.y < d.y1 && p.state !== "climb") {
      p.vy = Math.min(p.vy + (floaty ? 60 : 46) * dt, floaty ? 8 : 4.5); p.ground = false;
      if (floaty) maxFall = 2.0;
    }
    if (w.zones && w.zones.length) liftStep(p);
    p.vy = Math.max(p.vy - g * dt, -maxFall);
    // slopes pull
    if (p.ground && (p.state === "run" || p.state === "roll")) {
      const st = tile(Math.floor(p.x), Math.floor(p.y - 0.02));
      const s2 = tile(Math.floor(p.x), Math.floor(p.y + 0.02));
      const sl = (st === "/" || st === "\\") ? st : (s2 === "/" || s2 === "\\") ? s2 : null;
      if (sl) p.vx += (sl === "/" ? -1 : 1) * (p.state === "roll" ? 14 : 5.5) * dt;
    }
    integrate(p, dt);
    interact(p, dt);
    if (w.rides && w.rides.length) rideCheck(p, px0);
  }

  function jump(p, mud) {
    const c = p.c;
    p.vy = c.jump * (mud ? 0.82 : 1) * (p.inWater ? 0.82 : 1);
    p.ground = false; p.coyote = 0; p.jumping = true; p.on = null;
    p.curl = p.state === "roll";                         // out of a Spin Dash or a roll: still a ball
    if (p.state !== "roll") p.state = "run";
    SFX.jump(); emit("jump", { p });
  }
  /** Space again in the air: the runner's air action. */
  function airAction(p) {
    const c = p.c;
    p.ballistic = false;
    emit("airaction", { p });
    if (p.inWater && c.swims) {                          // Chaos swims: a stroke for every press, as long as he likes
      p.vy = Math.max(p.vy, 6.5); p.jumping = false; p.curl = false; SFX.flap();
      burst(p.x, p.y + 0.2, [0xffffff, mixC(world.T.water, 0xffffff, 0.6)], 4, 2);
      return;
    }
    switch (c.air) {
      case "ballet": {                                     // Sonic Ballet: a second jump that homes on what's near
        if (p.airUses) return;
        p.airUses = 1;
        const t = homingTarget(p, 6.5);
        if (t) { p.state = "homing"; p.target = t; p.st = 0.6; p.curl = true; SFX.homing(); }
        else { p.vy = Math.max(p.vy, 9.5); p.vx = p.face * Math.max(Math.abs(p.vx), 10); p.balT = 0.32; p.curl = false; SFX.double(); }
        burst(p.x, p.y + 0.5, [0x9ad4ff, 0xffffff], 6, 3);
        break;
      }
      case "fly":                                          // Tails' tails, Rouge's wings, the Egg Mobile's boosters: tap to climb, till tired
        if (p.inWater && srcOf(p, "air") !== "tails") return;
        if (p.state !== "fly") { if (p.flyLeft <= 0) return; p.state = "fly"; p.curl = false; p.jumping = false; }
        /* each stroke lifts, but not past the top of the stage: there is nothing to fly over */
        if (p.flyLeft > 0) { p.vy = p.y > H - 3 ? Math.min(p.vy, 0.5) : Math.min(Math.max(p.vy, 0) + (srcOf(p, "air") === "tails" ? 4.4 : 4), 5.2); SFX.flap(); }
        break;
      case "glide":                                        // Knuckles: hold Space
        if (p.state === "glide") return;
        p.state = "glide"; p.curl = false; p.jumping = false;
        p.vx = p.face * Math.max(Math.abs(p.vx), 5); SFX.glide();
        break;
      case "double":                                       // Amy: stops, and jumps again
        if (p.airUses) return;
        p.airUses = 1; p.vy = c.jump * 0.9; p.jumping = true; p.dblT = 0.2; SFX.double();
        burst(p.x, p.y, [0xf08ac0, 0xffffff], 6, 2);
        break;
      case "teleport":                                     // Chaos Control
        if (p.airUses >= 2) return;
        p.airUses++; chaosControl(p);
        break;
      case "float":                                        // Chaos Flight: a little more height, once
        if (p.airUses) return;
        p.airUses = 1; p.vy = Math.max(p.vy, 8.5); p.jumping = true; p.curl = false; SFX.double();
        burst(p.x, p.y + 0.1, [0x9ad8ff, 0xffffff], 7, 2);
        break;
      case "hover":                                        // Gamma's Flight Mode
        if (p.state === "fly" || p.flyLeft <= 0 || p.inWater) return;
        p.state = "fly"; p.curl = false; p.jumping = false; p.vy = Math.max(p.vy, c.sink ? 0 : 1.5); SFX.flap();
        break;
      case "jet":                                          // Metal Sonic: a burst of his jet, and a moment's hover
        if (p.airUses) return;
        p.airUses = 1; p.state = "jet"; p.st = 0.42; p.curl = false; p.jumping = false;
        p.vx = p.face * Math.max(Math.abs(p.vx), 18); p.vy = Math.max(p.vy, 1.2);
        burst(p.x - p.face * 0.4, p.y + 0.55, [0x80c0ff, 0xffffff, 0xfff070], 9, 3); SFX.dash();
        break;
      case "psy":                                          // Silver's Air Psycho Dash: ahead, a hover, then he floats down
        if (p.airUses) return;
        p.airUses = 1; p.state = "psy"; p.st = 0.5; p.curl = false; p.jumping = false;
        p.vx = p.face * Math.max(Math.abs(p.vx), 15.5); p.vy = Math.max(p.vy, 0.5);
        burst(p.x, p.y + 0.6, [0x70f0d0, 0xffffff], 9, 3); SFX.dash();
        break;
      case "launch": {                                     // Mighty
        /* against a wall, a wall jump (Knuckles' Chaotix): off it and up, the launch his again */
        for (const d of [p.face, -p.face]) {
          const wi = Math.floor(p.x + d * (c.w / 2 + 0.12));
          if (solid(tile(wi, Math.floor(p.y + 0.4))) && solid(tile(wi, Math.floor(p.y + 0.9)))) {
            p.face = -d; p.vx = -d * 9; p.vy = 12; p.jumping = true; p.curl = false; p.launchT = 0; p.airUses = 0; SFX.jump();
            burst(p.x + d * c.w / 2, p.y + 0.5, [0xffffff, 0xd8d0c0], 6, 3);
            return;
          }
        }
        if (p.airUses) return;                             // Shell Launch: curled, straight up
        p.airUses = 1; p.vy = Math.max(p.vy, 12); p.vx *= 0.35; p.curl = true; p.launchT = 0.42; p.jumping = false; SFX.double();
        burst(p.x, p.y + 0.2, [0xff4a4a, 0xffffff], 6, 2);
        break;
      }
    }
  }
  /* Shadow vanishes and is a few metres on: never through a wall, and nothing touches him in between. */
  function chaosControl(p) {
    const from = { x: p.x, y: p.y };
    const blocked = x => { for (let j = Math.floor(p.y + 0.1); j <= Math.floor(p.y + p.hh - 0.1); j++) {
      const i = Math.floor(x + p.face * p.c.w / 2); if (solid(tile(i, j)) && !isLip(p, i, j)) return true; } return false; };
    for (let d = 0; d < 3.6; d += 0.1) {
      if (blocked(p.x + p.face * 0.1)) break;
      p.x += p.face * 0.1;
      const gy = groundY(p.x, p.y + 0.3);                 // along a slope: up it, never into it
      if (gy !== null && gy > p.y) p.y = gy;
    }
    p.vy = Math.max(p.vy, 1.5); p.state = "teleport"; p.st = 0.28; p.inv = Math.max(p.inv, 0.3); p.curl = false; p.jumping = false;
    if (framesOf(p.c.sheet || p.c.id, "after")) effect(p.c.sheet || p.c.id, "after", from.x, from.y, p.face, 18, false, "body");
    burst(from.x, from.y + 0.5, [0xf03a4a, 0xffe060, 0xffffff], 8, 3);
    SFX.teleport();
  }
  function startCharge(p) { p.state = "charge"; p.curl = true; p.rev = 0.15; SFX.rev(0.1); }
  const dashK = c => c.dashK || (c.id === "shadow" ? 1.45 : 1.25);
  const dashFrom = c => c.dashFrom || c.id;           // whose dash this is (Emerl's copies one)
  function startDash(p, d) {
    const c = p.c;
    p.state = "dash"; p.face = d; p.st = c.dashT || (dashFrom(c) === "knuckles" ? 0.42 : 0.3); p.driveT2 = 0;
    p.vx = d * c.run * dashK(c);
    if (dashFrom(c) === "sonic" || dashFrom(c) === "tails") { p.vy = 4.5; p.ground = false; p.on = null; }    // Sonic Dash and Tails Hop are hops
    if (dashFrom(c) === "shadow" || c.dashInv) p.inv = Math.max(p.inv, p.st);                        // gone while he dashes; Chaos a puddle
    if (battle && SBFX()) effect("sbfx", "dash", p.x - d * 0.35, p.y + 32 * PX, d, 24, true, "fx", 1);   // Sonic Battle's dash: dust thrown up behind
    SFX.dash(); emit("dash", { p });
  }
  function startClimb(p, wall) { p.state = "climb"; p.wall = wall; p.face = wall; p.vx = 0; p.vy = 0; p.curl = false; p.grabT = 0.14; SFX.grab(); }
  /* Knuckles on a wall: Up and Down climb, over the top when it ends; Space leaps off. */
  function stepClimb(p, dir) {
    const c = p.c;
    p.vx = 0; p.vy = input.U ? 3.2 : input.D ? -3.2 : 0;
    const wx = p.x + p.wall * (c.w / 2 + 0.06);
    const wallMid = solid(tile(Math.floor(wx), Math.floor(p.y + p.hh * 0.5)));
    const wallFeet = solid(tile(Math.floor(wx), Math.floor(p.y + 0.05)));
    if (!wallMid) {
      if (wallFeet) {                                      // over the top: he pulls himself up onto the ledge
        p.state = "ledge"; p.vx = p.vy = 0;
        p.ledge = { t: 0, x0: p.x, y0: p.y, x1: p.x + p.wall * (c.w / 2 + 0.35), y1: Math.floor(p.y + 0.05) + 1 };
      } else p.state = "run";
      return;
    }
    if (input.jp) {
      p.state = "run"; p.face = -p.wall; p.vx = -p.wall * 7; p.vy = 10.5; p.jumping = true; p.curl = false; p.airUses = 0;
      input.jp = 0;                                        // the leap, not a glide as well
      SFX.jump();
    } else if (dir === -p.wall) p.state = "run";
  }

  /* Over the top of a wall: Sonic Advance's pull-up, up first and then onto the ledge. */
  const LEDGE_T = 0.32;
  function stepLedge(p, dt) {
    const L = p.ledge; L.t += dt;
    const k = Math.min(1, L.t / LEDGE_T), e = k * k * (3 - 2 * k);
    p.x = lerp(L.x0, L.x1, e); p.y = lerp(L.y0, L.y1, Math.min(1, e * 1.5)); p.vx = p.vy = 0;
    if (k >= 1) { p.state = "run"; p.ground = true; p.y = L.y1; p.on = null; p.onTile = null; p.airUses = 0; p.flyLeft = 0; p.landT = 0.1; p.ledge = null; }
  }

  // ---------------------------------------------------------------- the blows
  /** Z or X: which blow, from where they are and the direction held (as it was when pressed). */
  function startAttack(p, kind, U, D) {
    if (U === undefined) { U = input.U; D = input.D; }
    const c = p.c;
    let name;
    if (p.state === "dash" && kind === "heavy" && !U && !D) return startBlow(p, "dashatk");   // (Up or Down picks its own)
    if (p.ground && p.comboT > 0) {                         // just after a blow: the chain goes on
      const next = linkFrom(p, { name: p.comboLast }, { k: kind === "light" ? "z" : "x", U, D });
      p.comboT = 0;
      if (next) return doLink(p, next, { U, D });
    }
    if (!p.ground) {
      if (kind === "heavy" && D && juggled(p)) return startSeek(p);    // after one thrown up, air move or not
      if (p.airMove) return;
      p.airMove = true;
      if (kind === "heavy" && D) return startSeek(p);
      const inCombo = battle && (j => j && Math.hypot(j.x - p.x, j.y - p.y) < 2.4)(juggled(p));
      if (kind === "light" && srcOf(p, "airatk") === "shadow" && !inCombo) {   // his Homing Attack (in an air combo, right by them, the air attack)
        const t = homingTarget(p, 7.5);
        if (t) { p.state = "homing"; p.target = t; p.st = 0.6; p.curl = true; SFX.homing(); return; }
      }
      name = "airatk";
    } else if (kind === "light") name = "atk1";
    else if (U) name = "upper";
    else if (D) return startSeek(p);
    else if (p.state === "dash" || p.state === "roll" || Math.abs(p.vx) > c.run * 0.85) name = "dashatk";
    else name = "heavy";
    startBlow(p, name);
  }
  /** A press, as it was pressed: Z or X a blow, C a special. */
  const freshPress = (p, b) => b.k === "c" ? startSpecial(p, b.U, b.D) : startAttack(p, b.k === "z" ? "light" : "heavy", b.U, b.D);
  /* The route, as the fighting games run their combos: what a press in blow `m` goes on to the
     moment it lands (or, missed, when it is over). On the ground the jabs chain 1-2-3, the third
     into the heavy (mash Z and that is the whole string); X after any jab is the heavy, Up + X
     the launcher, Down + X the aim attack; Down + X after the launcher, the heavy or the dash
     attack goes after them (the chase). In the air the air attacks chain three a jump, and Down +
     X is the chase. Anything that lands goes into a special. Null: no link from there. */
  function linkFrom(p, m, q) {
    const lite = /^atk[123]$/.test(m.name);
    if (q.k === "c") return m.struck ? "special" : null;
    if (!p.ground) {
      if (q.k === "x" && q.D) return "aim";
      if ((m.name === "airatk" || m.name === "upper") && (p.airChain || 0) < 3) return "airatk";
      return null;
    }
    if (q.k === "z") return m.name === "atk1" ? "atk2" : m.name === "atk2" ? "atk3" : m.name === "atk3" ? "heavy" : null;
    if (lite) return q.U ? "upper" : q.D ? "aim" : "heavy";
    if ((m.name === "upper" || m.name === "heavy" || m.name === "dashatk") && q.D) return "aim";
    return null;
  }
  function doLink(p, nx, q) {
    emit("link", { p, nx });
    if (nx === "special") {
      startSpecial(p, q.U, q.D);
      /* (the one this string is on, reeling on the ground, reels till the shot is out) */
      const v = p.lastVic, S = p.state === "special" && p.sp;
      if (battle && S && v && v.state === "hurt" && !v.juggle) v.st = Math.max(v.st, (S.windup || (S.at || 0) / (S.fps || 16)) + 0.18);
      return;
    }
    if (nx === "aim") {                                   // (its dash takes a moment: the one reeling on the ground waits for it)
      startSeek(p);
      const v = p.lastVic; if (battle && v && v.state === "hurt" && !v.juggle) v.st = Math.max(v.st, 0.45);
      return;
    }
    if (nx === "airatk") { p.airChain = (p.airChain || 0) + 1; p.airMove = true; }
    startBlow(p, nx);
    /* a link is a link: the one this string is on, still reeling on the ground, reels until the
       next blow is out (a slow one -- Gamma's, Tails' tail -- included) */
    const v = p.lastVic, m = p.mv;
    if (battle && v && v.state === "hurt" && !v.juggle && m && m.runs) v.st = Math.max(v.st, m.runs[0][0] / m.fps + 0.12);
  }

  /* Where each blow lands, from its own frames: the frames on which the fist, foot, hammer or arm
     is out -- the sprite reaching furthest forward, or for an upper drawn rising, highest -- each
     run of them a swing of its own (Sonic's heavy kicks three times, Knuckles' punches twice);
     and how far each frame reaches, the sprite's own front edge and a hand more. Nothing lands
     on a blow's first frame. A blow whose frames hardly move (one drawn mostly as an effect, as
     Cheese's are) lands through the middle of them, as far as BLOWS has it. */
  const SHAPES = {};
  function blowShape(id, name) {
    const key = id + "|" + name; if (SHAPES[key]) return SHAPES[key];
    const L = framesOf(id, name) || framesOf(id, "atk1"), I = (framesOf(id, "idle") || L)[0], n = L.length;
    const ext = L.map(f => (f[2] - f[4]) * PX), ht = L.map(f => f[3] * PX);
    const e0 = (I[2] - I[4]) * PX, hI = I[3] * PX, eMax = Math.max(...ext), hMax = Math.max(...ht);
    let on = null, by = null;
    if (name === "upper" && hMax - hI >= 0.2) { const t = hI + 0.6 * (hMax - hI); on = ht.map(h => h >= t); by = "up"; }
    else if (eMax - e0 >= 0.18) { const t = e0 + 0.6 * (eMax - e0); on = ext.map(e => e >= t); by = "fwd"; }
    if (on && n >= 3) on[0] = false;
    let runs = [];
    if (on) for (let i = 0; i < n; i++) if (on[i]) {
      const r = runs[runs.length - 1];
      if (r && r[1] === i - 1) r[1] = i; else runs.push([i, i]);
    }
    if (!runs.length) { const h0 = Math.floor(n * 0.3); runs = [[h0, Math.max(h0, Math.ceil(n * 0.7) - 1)]]; by = null; }
    if (runs.length > 3) runs = [runs[0], runs[runs.length >> 1], runs[runs.length - 1]];
    /* a dash attack is one rush: live from early on to its blow, its whole body in it */
    if (name === "dashatk") runs = [[Math.min(runs[0][0], Math.max(1, Math.floor(n * 0.3))), Math.max(runs[runs.length - 1][1], Math.ceil(n * 0.7) - 1)]];
    return (SHAPES[key] = { runs, by, ext, ht, e0 });
  }
  function startBlow(p, name) {
    const id = p.c.sheet || p.c.id, bw = srcOf(p, name), b = blow(castOf(bw), name);
    const S = blowShape(id, framesOf(id, name) ? name : "atk1"), n = S.ext.length, runs = S.runs;
    p.state = "atk"; p.curl = false;
    p.mv = { name, t: 0, fps: b.fps, n, reach: b.reach, step: b.step, shape: S, runs, h0: runs[0][0], h1: runs[runs.length - 1][1],
             cheese: !!(CHEESE[name] && framesOf(bw, CHEESE[name])), live: false, queue: null, air: !p.ground, struck: false,
             cur: -1, landed: -1, lk: {}, speed: Math.max(Math.abs(p.vx), p.c.run * 0.9) };
    if (name === "airatk") {                                // near one in a juggle: going with them, level; else a lift
      const j = battle && juggled(p);
      const near = j && Math.hypot(j.x - p.x, j.y - p.y) < 2.4;
      p.vy = near ? clamp(j.vy + (j.y - p.y) * 4, -1, 16) : Math.max(p.vy, 4);
      if (near) { p.face = sgn(j.x - p.x) || p.face; p.vx = clamp((j.x - p.face * 0.9 - p.x) * 5 + j.vx, -7, 7); }   // and in reach, along with them
    }
    /* Chaos's Double Stab and Upper Chaos: his arm into the ground (the fourth frame), and the water
       up out of it in front of him -- a tentacle that swings over, a fountain */
    const water = bw === "chaos" && CHAOS_WATER[name];
    if (water && framesOf("chaos", water)) effect("chaos", water, p.x + p.face * (p.c.w / 2 + b.reach * (name === "upper" ? 0.8 : 0.45)), p.y, p.face, name === "upper" ? 22 : 26, false, "fx", 1, 0, undefined, 3 / b.fps);
    /* Cream's blows are Cheese's: out in front of her, keeping time with her */
    if (p.mv.cheese) {
      const nm = CHEESE[name], up = name === "upper" ? 0.95 : 0.55;
      effect(bw, nm, p.x + p.face * 0.8, p.y + up, p.face, framesOf(bw, nm).length * b.fps / n, true, "fx", 1, 0, { p, ox: 0.8, oy: up });
    }
    SFX.swing(name === "heavy" || name === "dashatk" || name === "upper");
  }
  /** a blow's damage, shared out over its swings: the early ones a little each, the last the rest */
  function runDmg(p, m, fin) {
    const all = blowDmg(p, m.chase ? "chase" : m.name), k = m.runs.length;
    if (k < 2) return all;
    const early = Math.max(1, Math.round(all * 0.6 / k));
    return fin ? Math.max(1, all - early * (k - 1)) : early;
  }
  function stepBlow(p, dt) {
    const m = p.mv, c = p.c;
    m.t += dt;
    const i = Math.floor(m.t * m.fps), last = m.runs.length - 1;
    const r = m.runs.findIndex(R => i >= R[0] && i <= R[1]);
    m.live = r >= 0;
    if (m.name === "dashatk") p.vx = p.face * m.speed * (i <= m.h1 ? 1 : 0.45);
    else if (!m.air) p.vx = p.face * m.step * (i <= m.h1 ? 1 : 0.2);
    // Amy's upper is her hammer swung at the ground: a Hammer Jump
    if (srcOf(p, "upper") === "amy" && m.name === "upper" && i >= m.h0 && !m.launched) { m.launched = true; p.vy = 16.5; p.ground = false; p.on = null; SFX.spring(); }
    if (m.live) {
      if (r !== m.cur) { m.cur = r; m.tk = {}; }                       // each swing lands on its own
      const S = m.shape, f = Math.min(i, S.ext.length - 1), fin = r === last;
      /* the box the blow fills: from the runner's middle to the sprite's front edge on this
         frame (and over the head, for an upper); the chase's above and below as well */
      const fwd = m.cheese || !S.by ? c.w / 2 + m.reach : Math.max(S.ext[f], S.e0, c.w / 2 + 0.3) + 0.3;
      const top = p.y + (m.name === "upper" ? Math.max(p.hh, S.by ? S.ht[f] : 0) + (S.by ? 0.4 : 0.9) : p.hh), lo = m.chase ? 0.7 : m.air ? 0.35 : 0;   // (an air blow: a little above and below too)
      const back = m.name === "dashatk" ? c.w / 2 : 0.1;                                   // (a dash attack: the whole body)
      const x0 = p.face > 0 ? p.x - back : p.x - fwd, x1 = p.face > 0 ? p.x + fwd : p.x + back;
      tok(m.tk, runDmg(p, m, fin), !fin ? 0.3 : m.name === "atk1" || m.name === "atk2" ? 0.35 : 0.85);
      if (strike(x0, x1, p.y + 0.08 - lo, top + lo, blowKick(p, fin))) landBlow(p, fin);
    }
    /* a press in the blow waits for its moment: once the blow has landed (its last swing, and
       the freeze over) the next link cuts in; missed, it comes when the blow is done */
    if (p.buf && i >= 1) { m.queue = p.buf; p.buf = null; }
    const q = m.queue, done = m.struck && m.t - m.struckAt >= 0.05 && (m.landed === last || i > m.h1);
    /* Space in the launcher (any time in it): once it has launched someone, a super jump after them
       -- before any other link; a press waiting comes out up there, an air attack */
    if (m.name === "upper" && p.jbuf > 0) m.jq = true;
    if (done && m.jq && m.name === "upper" && juggled(p)) { p.jbuf = 0; p.mv = null; p.state = "run"; superJump(p); if (q && q.k !== "c") p.buf = Object.assign({}, q, { t: 0.35 }); return; }
    if (q && done) { const nx = linkFrom(p, m, q); if (nx) { p.mv = null; p.state = "run"; doLink(p, nx, q); return; } }
    if (i >= m.n) {
      p.mv = null; p.state = "run";
      if (q) { const nx = linkFrom(p, m, q); if (nx) doLink(p, nx, q); else freshPress(p, q); }
      else if (/^atk[123]$/.test(m.name)) { p.comboT = 0.25; p.comboLast = m.name; }
    }
  }
  /** The knock a blow gives what it hits: forward and up, by its row and the runner's weight. An
      early swing of several only holds them there for the next; the heavies and the dash attack
      smash (and off a wall they bounce), the chase smashes down (and off the floor they bounce);
      the aim attack picks up one lying down (OTG). */
  function blowKick(p, fin) {
    const m = p.mv, H = (m.chase && HITS.chase) || HITS[m.name] || HITS.atk1, k = hitWeight(castOf(srcOf(p, m.name)), m.name);
    if (fin === false && battle) return { vx: p.face * 1.2, vy: 0, hold: true };
    const K = (battle && H.bkick) || H.kick;
    return { vx: p.face * K[0] * k, vy: K[1] * k, launch: m.name === "upper", smash: !!m.chase || m.name === "heavy" || m.name === "dashatk",
             spike: !!m.chase, otg: m.name === "aim" };
  }
  /** A blow connects: a hit spark in the runner's colour where it met, a flash, and the picture
      stops dead and jolts -- longest and hardest for a finisher, while what it hit shows white,
      shaking, and is then thrown. Once a swing. A combo's finisher (a heavy or the dash attack
      after two hits or more) and the chase are smashes: a longer freeze, a moment of slow motion,
      and the camera leaning in on it. */
  function landBlow(p, fin) {
    const m = p.mv; if (!m) return;
    if (fin === undefined) fin = true;
    if (m.lk[m.cur]) return;
    m.lk[m.cur] = true; m.struck = true; m.struckAt = m.t; m.landed = Math.max(m.landed, m.cur);
    const H = (m.chase && HITS.chase) || HITS[m.name] || HITS.atk1, k = hitWeight(castOf(srcOf(p, m.name)), m.name) * (fin ? 1 : 0.7);
    const col = HIT_C[p.c.id] || 0xffffff;
    const h = world.hitAt || { x: p.x + p.face * (p.c.w / 2 + m.reach * 0.6), y: p.y + p.hh * 0.55 };
    hitSpark(h.x, h.y, H.spark * k, col);
    flash(h.x, h.y, H.spark * 1.5 * k, col);
    if (fin && m.name === "heavy" && framesOf(srcOf(p, "heavy"), "fx.punch")) effect(srcOf(p, "heavy"), "fx.punch", h.x + p.face * 0.2, h.y, p.face, 20, true, "fx", 1.4);   // Mighty's Explosive Punch
    if (battle && SBFX() && fin && (m.name === "heavy" || m.name === "dashatk")) effect("sbfx", "heavy", h.x + p.face * 0.5, h.y, p.face, 24, true, "fx", 1.1);   // the dust a heavy blow throws them through
    if (battle && SBFX() && m.chase) effect("sbfx", "pursuit", h.x, h.y, p.face, 22, true, "fx", 1.1);                                     // the pursuit's sweep
    hitStop(H.stop * k * (battle ? 1 : 0.6)); shakeCam(H.shake * k);
    SFX.hit(); if (H.heavy && fin) SFX.impact();
    if (!battle) return;
    /* an air blow that lands: the slow fall of the fighting games' air combos -- both of them
       hang, falling slowly, for the next blow (UMvC3's air combo gravity) */
    if (m.air && !m.chase) {
      p.vy = 2; p.hang = 0.45;
      const v = p.lastVic; if (v && !v.ground && v.state === "hurt") { v.hang = 0.45; v.st = Math.max(v.st, 0.55 * Math.max(0.55, 1 - 0.035 * Math.max(0, v.cmb.n - 6))); }
    }
    const cm = p.lastCmb, smash = fin && (m.chase || ((m.name === "heavy" || m.name === "dashatk") && cm && cm.n >= 3));
    if (m.chase) p.vy = -5;                                // the chase: down after them, for the bounce
    if (smash) {
      hitStop(0.2); slowMo(0.32);
      const v = p.lastVic;
      if (cm && v && (cm.n >= 5 || cm.dmg >= v.hpMax * 0.16 || clutch(v))) camPunch(h.x, h.y, 1, 1.0);
      impact(h.x, h.y, { c: col, flash: 3.2, shake: 0.3 });
      SFX.boom();
    }
  }
  /* Down + X: the aim attack -- a dash at the nearest thing, then the blow. In a battle, with a
     rival thrown up by an upper, it is the chase: after them, wherever they are, faster, and
     the blow lands the moment it reaches them. */
  function startSeek(p) {
    const j = juggled(p);
    p.target = j || homingTarget(p, 8); p.chase = !!j; p.state = "seek"; p.st = j ? 0.9 : p.target ? 0.7 : 0.25; p.curl = false;
    if (!p.ground) p.airMove = true;
    SFX.homing();
  }
  /* Space the moment the launcher lands: a super jump after the one it threw up, for an air combo */
  function superJump(p) {
    const t = juggled(p);
    /* high enough to meet them at the top of their flight */
    let vy = 16;
    if (t) { const g = GRAV * (1 + Math.min(0.8, t.cmb.n * 0.05)), top = t.y + Math.max(0, t.vy) ** 2 / (2 * g); vy = clamp(Math.sqrt(2 * GRAV * Math.max(1, top - p.y - 0.2)), 11, 19); }
    p.vy = vy; p.ground = false; p.on = null; p.onTile = null; p.coyote = 0; p.jumping = false; p.curl = false;
    p.airMove = false; p.airChain = 0; p.airUses = 0;
    if (t) { p.face = sgn(t.x - p.x) || p.face; p.vx = clamp((t.x - p.x - p.face * 0.8) / Math.max(0.2, vy / GRAV) + t.vx, -8, 8); }   // to just short of them
    burst(p.x, p.y + 0.05, [0xd8d0c0, 0xffffff], 8, 3); SFX.jump(); SFX.dash(); emit("superjump", { p });
  }
  /** the nearest rival in the air and helpless (a juggle), within 16 m */
  function juggled(p) {
    if (!battle) return null;
    let best = null, bd = 16;
    for (const q of battle.fs) if (q.juggle && !q.ground && !q.ko && !q.out && rivals(p, q)) {
      const d = Math.hypot(q.x - p.x, q.y - p.y);
      if (d < bd) { bd = d; best = q; }
    }
    return best;
  }
  function stepSeek(p) {
    const t = p.target, chase = p.chase && t && t.juggle;
    const strikeNow = met => {
      /* (the chase off the floor, beside one just thrown up -- off a shot -- goes up with them) */
      if (chase && met && p.ground && t.vy > 2) { p.ground = false; p.on = null; }
      const air = !p.ground; startBlow(p, "aim"); p.mv.air = air; p.chase = false;
      if (chase && met) { p.mv.chase = true; p.mv.runs = [[0, p.mv.h1]]; p.mv.h0 = 0; p.vx = t.vx; p.vy = Math.max(t.vy, 1); }    // at once, keeping with them
      else { p.vx = p.face * 2; if (air) p.vy = Math.max(p.vy, 3); }
    };
    if (t && t.alive !== false) {
      const ty = (t.y || 0) + (t.h ? t.h / 2 : 0.4), dx = t.x - p.x, dy = ty - (p.y + 0.5), d = Math.hypot(dx, dy) || 1, sp = chase ? 26 : 16;
      p.face = Math.abs(dx) > 0.05 ? sgn(dx) : p.face;
      if (d < (chase ? 1.3 : 1.1)) return strikeNow(true);
      if (p.st <= 0) return strikeNow(false);
      p.vx = dx / d * sp; p.vy = p.ground && dy < 0.6 ? 0 : dy / d * sp;
    } else {
      p.vx = p.face * 14;
      if (p.st <= 0) strikeNow();
    }
  }
  function stepHoming(p) {
    const t = p.target;
    if (!t || t.alive === false || p.st <= 0) { p.state = "run"; p.vx = clamp(p.vx, -p.c.run, p.c.run); return; }
    const ty = (t.y || 0) + (t.h ? t.h / 2 : 0.4), dx = t.x - p.x, dy = ty - (p.y + 0.5), d = Math.hypot(dx, dy) || 1;
    p.vx = dx / d * 24; p.vy = dy / d * 24; p.face = sgn(dx) || p.face;
  }
  function homingTarget(p, range) {
    let best = null, bd = range;
    const consider = (t, x, y) => {
      const dx = x - p.x, dy = y - (p.y + 0.5);
      if (dx * p.face < -0.3 || dy > 3.5 || dy < -6) return;
      const d = Math.hypot(dx, dy);
      if (d < bd) { bd = d; best = t; }
    };
    for (const e of world.enemies) if (e.alive && !e.hidden && !e.guard) consider(e, e.x, e.y + e.h / 2);
    for (const e of world.ents) if (e.t === "spring") consider(e, e.x, e.y + 0.3);
      else if ((e.t === "balloon" && !e.back) || e.t === "bumper") consider(e, e.x, e.y - 0.4);
    for (const b of world.solids) if (b.alive) consider(Object.assign(b, { x: (b.x0 + b.x1) / 2, y: b.y0, h: 1 }), (b.x0 + b.x1) / 2, b.y0 + 0.5);
    if (battle) for (const q of battle.fs) if (rivals(p, q) && !q.ko && !q.out) consider(q, q.x, q.y + q.hh / 2);
    return best;
  }

  // ---------------------------------------------------------------- the specials
  /** C: the shot; Up + C the power; Down + C the trap, or sets off the traps already down. */
  function startSpecial(p, U, D) {
    if (U === undefined) { U = input.U; D = input.D; }
    const c = p.c, air = !p.ground, kind = U ? "power" : D ? "trap" : "shot";
    if (kind === "trap" && world.traps.some(t => !t.gone && mine(t, p))) { world.traps.forEach(t => { if (!t.gone && mine(t, p)) boomTrap(t); }); return; }
    if (p.cd[kind] > 0 || (air && p.airSp)) return;
    if (air) p.airSp = true;
    const slot = (air ? "air" : "") + kind;
    let S = SPECIALS[c.id] && SPECIALS[c.id][slot];
    if (c.emerl) S = emerlSpecial(p, slot);           // Emerl: the move he copied in that slot, in his own frames
    p.cd[kind] = kind === "power" ? 1.4 : kind === "trap" ? 0.7 : 0.45;
    emit("special", { p, kind, air });
    p.state = "special"; p.curl = false; p.jumping = false;
    p.sp = Object.assign({ t: 0, fired: false, air, kind }, S, { n: (framesOf(c.sheet || c.id, S.body) || [0]).length * (S.loops || 1) });
    if (air && !S.dive) p.vy = Math.max(p.vy, 1);
    SFX.cast();
  }
  /* A shot of theirs has landed: what is pressed next cuts the rest of the move (or Sonic's recoil)
     short -- Space a super jump after one it threw up, a dash, a blow (Down + X the chase or the
     aim attack), another special. */
  function shotCancel(p) {
    const sj = p.jbuf > 0 && p.ground && juggled(p), dash = input.dash && p.ground;
    if (!(sj || dash || p.buf)) return false;
    p.sp = null; p.state = "run"; p.recoilLanded = false;
    if (sj) { p.jbuf = 0; p.shotHit = 0; input.jp = 0; superJump(p); }   // (the press used up: not the air action as well)
    else if (dash) { startDash(p, input.dash); input.dash = 0; }
    else { const b = p.buf; p.buf = null; freshPress(p, b); }
    emit("link", { p, nx: "shotcancel" });
    return true;
  }
  function stepSpecial(p, dt) {
    const s = p.sp;
    s.t += dt;
    if (s.landed && battle && shotCancel(p)) return;
    if (s.windup) return stepWindup(p, s, dt);
    if (s.charged && stepCharged(p, s, dt)) return;
    const i = Math.floor(s.t * s.fps);
    if (!s.air) p.vx = s.step ? p.face * s.step : p.vx * Math.pow(0.001, dt);
    if (!s.fired && s.charge && s.at > 1) {
      if (!s.hum) { s.hum = true; SFX.charge(s.at / s.fps); }
      s.glow = (s.glow || 0) - dt;
      if (s.glow <= 0 && s.bits !== 0 && i >= (s.gfrom || 0)) { s.glow = s.muzzle ? 0.02 : 0.03; gather(p, s.charge, s); }
    }
    if (!s.fired && i >= s.at) { s.fired = true; fire(p, s); if (p.state !== "special") { p.sp = null; return; } }
    if (s.shield && s.fired && tok(s, 6)) strike(p.x - 1.0, p.x + 1.0, p.y - 0.1, p.y + 1.9, { r: 10, cx: p.x, cy: p.y + 0.9 });   // the Black Shield breaks what it meets
    if (i >= s.n) {
      p.sp = null; p.state = "run";
      if (s.shield) effect(s.fxWho || p.c.id, "fx.power", p.x, p.y + 0.9, p.face, 14, true, "fx", 1.3);        // and breaks up
      if (s.drive) {
        p.state = "roll"; p.curl = true; p.vx = p.face * 19; p.driveT = 0.42; SFX.roll();
        const dw = s.fxWho || p.c.id;
        if (p.ground && framesOf(dw, "fx.dust")) effect(dw, "fx.dust", p.x - p.face * 0.6, p.y, -p.face, 22, false);
        impact(p.x - p.face * 0.3, p.y + 0.4, { c: 0x9ad4ff, flash: 1.8, shake: 0.12 });
      }
    }
  }
  /* Gamma's Devastator, held: past its `at` frame with the button still down he charges -- the
     charging frames, round and round, energy gathering at the cannon -- till it is let go or
     full; then the charged release, bigger and further the longer it was held. */
  function stepCharged(p, s, dt) {
    const H = s.charged;
    if (!s.phase) {
      if (s.fired || Math.floor(s.t * s.fps) < H.at || !input.C || !framesOf(p.c.sheet || p.c.id, H.body)) return false;
      s.phase = "charge"; s.ct = 0; s.body = H.body; s.t = 0; SFX.charge(H.max);
    }
    if (s.phase !== "charge") return false;              // the release plays as any special does
    s.ct += dt;
    p.vx *= Math.pow(0.001, dt); if (s.air) p.vy = Math.max(p.vy, -0.5);
    s.glow = (s.glow || 0) - dt;
    if (s.glow <= 0) { s.glow = 0.025; gather(p, s.charge || 0xffffff, { muzzle: s.muzzle, t: Math.min(s.ct, H.max), fps: 1, at: H.max }); }
    if (!input.C || s.ct >= H.max) {
      const k = 1 + Math.min(1, s.ct / H.max) * 0.8;
      s.phase = "release"; s.body = H.release; s.t = 0; s.at = H.rat; s.n = framesOf(p.c.sheet || p.c.id, H.release).length;
      s.k = (s.k || 1) * k; s.life *= k; s.speed *= 1.1; s.pow = Object.assign({}, s.pow, { flash: s.pow.flash * k, shake: s.pow.shake * k });
      if (s.kn) s.kn = s.kn.map((v, j) => j < 2 ? v * (0.7 + 0.3 * k) : v);
    }
    return true;
  }
  /* A special that winds up (Sonic Wave, Sonic Storm): he spins in place, the spin speeding up
     from a turn to a blur, dust kicking up and then sparks; at the top of it, the blast, a flash
     of light, a jolt through the picture, and he is thrown back. */
  function stepWindup(p, s, dt) {
    const k = Math.min(1, s.t / s.windup);
    if (!s.sound) { s.sound = true; SFX.windup(s.windup); }
    s.spin = (s.spin || 0) + dt * (7 + 48 * k * k);
    p.vx *= Math.pow(0.0005, dt);
    if (s.air) p.vy = Math.max(p.vy, -0.4);
    s.puff = (s.puff || 0) - dt;
    if (s.puff <= 0) {
      s.puff = 0.05 - k * 0.025;
      if (k > 0.4 && Math.random() < 0.55) revSpark(p);
    }
    if (k >= 1) {
      s.fired = true; fire(p, s);
      const f = p.face;
      flash(p.x + f * 0.9, p.y + (s.air ? 0.3 : 0.55), 3.2);
      const fy = p.y + (s.air ? 0.35 : 0.5);
      const fw = s.fxWho || p.c.id;
      if (framesOf(fw, "fx.flare")) effect(fw, "fx.flare", p.x + f * 1.3, fy, f, 26, true, "fx", 1.1);
      if (framesOf(fw, "fx.crescent")) effect(fw, "fx.crescent", p.x + f * 1.1, fy, f, 30, true, "ghost", 1.8);
      burst(p.x + f * 0.8, p.y + 0.4, [0xffffff, 0xcfe8ff, 0x9ad4ff], 16, 6);
      if (p.ground && framesOf(fw, "fx.dust")) effect(fw, "fx.dust", p.x - f * 0.5, p.y, -f, 24, false);
      shakeCam(0.28); SFX.blast();
      p.sp = null; p.state = "recoil"; p.st = 0.32; p.curl = false; p.recoilLanded = false;
      p.vx = -f * s.recoil;
      if (s.air) p.vy = Math.max(p.vy, 3.5);
    }
  }
  /** A spark off a hard rev (Sonic Advance's): somewhere about the runner's feet and front. */
  function revSpark(p) {
    if (!framesOf(p.c.id, "fx.spark")) return;
    effect(p.c.id, "fx.spark", p.x + (Math.random() - 0.3) * p.face * 0.9, p.y + 0.15 + Math.random() * 0.55, Math.random() < 0.5 ? 1 : -1, 32, true);
  }
  /** A ring of light that grows and fades (a parry, a burst). */
  function ring(x, y, color, size) {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.82, 1, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide }));
    m.position.set(x, y, 0.5); m.scale.setScalar(0.1); world.group.add(m);
    world.flashes.push({ s: m, size, t: 0, life: 0.35, ring: true });
  }
  /** A burst of light that swells and fades. */
  function flash(x, y, size, color) {
    const sp = new THREE.Sprite(glowMat(color || 0xffffff, 0.95)); sp.position.set(x, y, 0.4); sp.scale.setScalar(size * 0.3);
    world.group.add(sp); world.flashes.push({ s: sp, size, t: 0, life: 0.24 });
  }
  /** A blow landing: a flash of its colour, a jolt through the picture, sparks, and for the
      heaviest a freeze-frame -- everything stops for a few hundredths of a second. With `cone`
      (a facing) the sparks blow out of a muzzle the way the shot goes (`down` its slope), not
      up in a spray; with `bits: 0` there are none. */
  function impact(x, y, o) {
    if (!o) return;
    flash(x, y, o.flash || 1.5, o.c);
    if (o.shake) shakeCam(o.shake);
    if (o.stop) hitStop(o.stop);
    if (o.bits === 0) return;
    const cols = [o.c || 0xffffff, 0xffffff, mixC(o.c || 0xffffff, 0x000000, 0.25)];
    if (o.cone) {
      const a0 = Math.atan2(-(o.down || 0), 1);
      for (let k = 0, n = Math.round(10 + (o.flash || 1.5) * 4); k < n; k++) {
        const a = a0 + (Math.random() - 0.5) * 0.9, sp = 4 + Math.random() * 7, life = 0.12 + Math.random() * 0.12;
        world.parts.list.push({ x, y, z: (Math.random() - 0.5) * 0.3, vx: o.cone * Math.cos(a) * sp, vy: Math.sin(a) * sp + 9 * life, vz: (Math.random() - 0.5) * 2,
                                life, s: 0.05 + Math.random() * 0.05, c: cols[k % 3] });
      }
      return;
    }
    burst(x, y, cols, Math.round(8 + (o.flash || 1.5) * 4), 3 + (o.flash || 1.5));
  }
  /* energy gathering to the hand while a move winds up; with a muzzle, to the mouth of the
     cannon (or the hand) itself, a glow swelling there as it fills */
  function gather(p, color, s) {
    const m = s && s.muzzle;
    if (m) {
      const hx = p.x + p.face * m[0], hy = p.y + m[1], L = 0.16, fill = Math.min(1, s.t * s.fps / s.at);
      for (let k = 0; k < 3; k++) {
        const a = Math.random() * PI * 2, r = 0.4 + Math.random() * 0.35, x = hx + Math.cos(a) * r, y = hy + Math.sin(a) * r;
        world.parts.list.push({ x, y, z: 0.2, vx: (hx - x) / L, vy: (hy - y) / L + 9 * L, vz: 0, life: L, s: 0.06, c: Math.random() < 0.5 ? color : 0xffffff });
      }
      if ((s.glows = (s.glows || 0) + 1) % 3 === 1) flash(hx, hy, 0.45 + fill * 0.6, color);
      return;
    }
    const hx = p.x + p.face * 0.55, hy = p.y + p.hh * 0.55;
    for (let k = 0; k < 2; k++) {
      const a = Math.random() * PI * 2, r = 0.7 + Math.random() * 0.4, x = hx + Math.cos(a) * r, y = hy + Math.sin(a) * r;
      world.parts.list.push({ x, y, z: 0.2, vx: (hx - x) * 6, vy: (hy - y) * 6 + 2.2, vz: 0, life: 0.16, s: 0.07, c: Math.random() < 0.5 ? color : 0xffffff });
    }
  }
  /* A hit spark: an eight-pointed star of a landed blow, drawn in pixels -- the runner's colour
     round a white heart, popping out and gone in a few hundredths of a second (it holds through
     the freeze-frame). */
  let SPARK_TEX = null;
  function sparkMat(color) {
    if (!SPARK_TEX) {
      const N = 32, c = document.createElement("canvas"); c.width = c.height = N;
      const g = c.getContext("2d"); g.fillStyle = "#fff"; g.beginPath();
      for (let k = 0; k < 16; k++) {
        const a = k * PI / 8, r = k % 2 ? 3.6 : k % 4 === 0 ? 15.5 : 9;
        g[k ? "lineTo" : "moveTo"](16 + Math.cos(a) * r, 16 + Math.sin(a) * r);
      }
      g.closePath(); g.fill();
      SPARK_TEX = new THREE.CanvasTexture(c);
      SPARK_TEX.magFilter = SPARK_TEX.minFilter = THREE.NearestFilter; SPARK_TEX.generateMipmaps = false;
    }
    return new THREE.SpriteMaterial({ map: SPARK_TEX, color, alphaTest: 0.5, depthWrite: false, rotation: (Math.random() - 0.5) * 0.7 });
  }
  function hitSpark(x, y, size, color) {
    if (SBFX()) effect("sbfx", size >= 1.35 ? "hhit" : "hit", x, y, 1, 30, true, "fx", clamp(size * 0.95, 0.7, 1.7));   // Sonic Battle's star
    const a = new THREE.Sprite(sparkMat(color)), b = new THREE.Sprite(sparkMat(0xffffff));
    b.material.rotation = a.material.rotation;
    a.position.set(x, y, 0.45); b.position.set(x, y, 0.47);
    a.scale.setScalar(size); b.scale.setScalar(size * 0.5);
    world.group.add(a, b); world.flashes.push({ s: a, s2: b, size, t: 0, life: 0.17, spark: true });
  }
  let fireDmg = 8;
  function fire(p, s) {
    const who = s.fxWho || p.c.id, f = p.face;           // (Emerl's copied moves: their source's effects)
    fireDmg = spDmg(p, s);
    // the release: a flash at the hand, a jolt, and a push back
    const mz = s.muzzle;
    if (s.pow && !s.dive && !s.blast) {
      if (mz) impact(p.x + f * mz[0], p.y + mz[1], Object.assign({ cone: f, down: s.air ? s.down || 0 : 0 }, s.pow));
      else impact(p.x + f * 0.75, p.y + p.hh * 0.55, s.pow);
      if (s.pow.recoil) { p.vx = -f * s.pow.recoil; if (s.air) p.vy = Math.max(p.vy, 2.5); }
    }
    const k = s.k || s.ghost || 1;
    if (s.wave) shoot(who, { fx: s.wave, x: p.x + f * 0.7, y: p.y, vx: f * s.speed, vy: 0, life: s.life, ground: true,
                             w: 1.0 * k, h: 1.3 * k, k, face: f, ghost: s.ghost, trail: s.trail, twister: s.twister, kn: s.kn });
    else if (s.fly) {
      const held = s.hold && input.C ? s.hold : 0;
      shoot(who, { fx: s.fly, x: mz ? p.x + f * (mz[0] + 0.3 * k) : p.x + f * (0.6 + (s.ahead || 0)), y: mz ? p.y + mz[1] : p.y + p.hh * 0.55, x0: p.x + f * 0.3,
                   vx: f * s.speed, vy: -(s.down || 0) * s.speed,
                   life: s.life + held, loop: s.loop, mid: true, w: 0.8 * k, h: 0.8 * k, k, face: f, ghost: s.ghost, trail: s.trail,
                   range: s.range, bursts: s.bursts, boom: s.boom, land: s.land, twister: s.twister, kn: s.kn });
      if (!s.ghost) SFX.shot();
    } else if (s.lob) {
      shoot(who, { fx: s.lob, x: p.x + f * 0.5, y: p.y + p.hh + 0.5, vx: f * s.speed, vy: s.rise, g: 26, life: 3, loop: true, mid: true,
                   w: 0.9 * k, h: 0.9 * k, k, face: f, bursts: 1.8, trail: s.trail, land: s.land, bits: s.bits });
      SFX.shot();
    } else if (s.row) {                                    // Chaos Crush: tentacles up out of the ground in a row, one after another
      s.row.forEach((dx, i) => {
        const ax = p.x + f * dx, wait = i * s.gap, t0 = {};
        effect(who, s.rowFx, ax - f * 0.35, p.y, f, s.fxFps || 26, false, "fx", s.k || 1, 0, undefined, wait);
        later(wait + 0.06, () => {
          if (!world || p.ko || p.dead) return;
          const a0 = actor; actor = p; tok(t0, Math.max(1, Math.round(spDmg(p, s) * s.each)));
          if (strike(ax - s.w / 2, ax + s.w / 2, p.y - 0.2, p.y + s.h, { r: 11, cx: ax - f * 0.7, cy: p.y - 0.4 })) hitStop(0.04);
          actor = a0;
        });
      });
      SFX.boom();
    } else if (s.area) {
      const ax = p.x + f * s.ax, ay = p.y + s.ay;
      if (!(s.drawn && who === p.c.id)) effect(who, s.area, ax, ay, f, 22, true, "fx", k);   // (drawn: it is in his own frames)
      if (s.self && !p.c.emerl) p.hideT = framesOf(who, s.area).length / 22;
      tok(s, spDmg(p, s));
      if (strike(ax - s.w / 2, ax + s.w / 2, ay - s.h / 2, ay + s.h / 2, { r: 11, cx: ax - f * 0.6, cy: ay - 0.3 })) hitStop(0.05);
      SFX.boom();
    } else if (s.drive) {
      shoot(who, { fx: "fx.ring", x: p.x + f * 0.8, y: p.y + 0.5, vx: f * 14, vy: 0, life: 0.42, loop: true, mid: true, w: 0.5, h: 0.5, face: f, ring: true, trail: 0xfff070 });
      SFX.ring();
    } else if (s.dive) { p.diveS = s; startDive(p, s.dive); }
    else if (s.tornado) { p.state = "tornado"; p.tor = { t: s.t, from: s.tornado[0], to: s.tornado[1], left: 1.4, body: s.body, fps: s.fps, air: s.air }; SFX.swing(true); }
    else if (s.trap) setTrap(p, s);
    else if (s.blast) {                                    // Gamma's Meltdown: his reactor goes up, and him with it
      const by = p.y + 1.0;
      effect(who, "fx.boom", p.x, by, f, 16, true, "fx", s.k);
      impact(p.x, by, s.pow); burst(p.x, by, [0xfff3a0, 0xf08a24, 0xffffff, 0xe8403a], 30, 9);
      tok(s, 22); strike(p.x - s.w / 2, p.x + s.w / 2, p.y - 0.6, p.y + s.h, { r: 14, cx: p.x, cy: p.y + 0.4 });
      if (battle) p.hp = Math.max(1, p.hp - 10);          // (in a battle it costs him health)
      else if (p.carrots > 0) { p.carrots = Math.max(0, p.carrots - 10); flashHud(); }   // (on a stage, rings)
      p.inv = Math.max(p.inv, 1.2); SFX.boom(); SFX.impact();
    } else if (s.shield) { p.inv = Math.max(p.inv, (s.n - s.at) / s.fps + 0.2); SFX.set(); }   // Metal's Black Shield: nothing gets through
  }
  /* Air powers that dive: Sonic Meteor (curled, down and ahead), Spiral Dive (Rouge, drills
     straight down through rock), Major Eruption (Knuckles: dives, burrows, bursts out) and
     Air Chaos Burst (Shadow drops, then bursts). */
  function startDive(p, kind) {
    p.state = "dive"; p.dive = kind; p.diveT = 0; p.curl = kind === "meteor" || kind === "hammer";
    p.vx = kind === "meteor" ? p.face * 11 : 0;
    SFX.dive();
  }
  function stepDive(p, dt) {
    p.diveT += dt;
    p.vy = p.dive === "burst" || p.dive === "hammer" ? -24 : p.dive === "meteor" ? -14 : -17;
    if (p.dive !== "meteor") p.vx = 0;
    // through cracked rock and crates on the way down
    for (let i = Math.floor(p.x - p.c.w / 2 + 0.05); i <= Math.floor(p.x + p.c.w / 2 - 0.05); i++) {
      const j = Math.floor(p.y - 0.05), t = tile(i, j);
      if (t === "X" || t === "B") breakTile(i, j);
    }
    if (p.dive === "drill" && p.diveT > 0.9) p.state = "run";      // high up, it stops short
  }
  function diveLand(p, fell) {
    const kind = p.dive;
    if (kind === "meteor" || kind === "drill") {
      tok(p.diveS || p, 12); strike(p.x - 1.0, p.x + 1.0, p.y - 0.2, p.y + 1.2, { r: 9, cx: p.x, cy: p.y });
      burst(p.x, p.y + 0.1, [0xd8d0c0, 0xffffff, kind === "drill" ? 0xb070c0 : 0x5a9ae0], 16, 5);
      impact(p.x, p.y + 0.3, p.diveS && p.diveS.pow);
      const dw = (p.diveS && p.diveS.fxWho) || p.c.id;
      if (framesOf(dw, "fx.dust")) { effect(dw, "fx.dust", p.x - 0.5, p.y, -1, 22, false); effect(dw, "fx.dust", p.x + 0.5, p.y, 1, 22, false); }
      p.state = "run"; p.vy = 6; p.ground = false; SFX.stomp(); SFX.impact();
    } else if (kind === "hammer") {                       // Mighty's Hammer Drop: a shockwave both ways, then he uncurls
      effect((p.diveS && p.diveS.fxWho) || p.c.id, "fx.power", p.x, p.y, p.face, 20, false, "fx", 1.35);
      impact(p.x, p.y + 0.3, p.diveS && p.diveS.pow);
      tok(p.diveS || p, 13); strike(p.x - 2.4, p.x + 2.4, p.y - 0.2, p.y + 1.3, { r: 12, cx: p.x, cy: p.y });
      SFX.boom(); SFX.impact(); p.curl = false;
      p.state = "erupt"; p.vx = 0; p.er = { t: 0, body: p.c.emerl ? "sp.airpower" : "airpower", from: 3, to: 8, at: 99, fps: 18, fired: true };
    } else {
      p.state = "erupt"; p.vx = 0;
      const ab = p.c.emerl ? "sp.airpower" : "airpower", an = (framesOf(p.c.sheet || p.c.id, ab) || [0]).length - 1;
      p.er = kind === "erupt" ? { t: 0, body: ab, from: Math.min(4, an), to: Math.min(16, an), at: 10, fps: 18, r: 1.9, fired: false }
                              : { t: 0, body: ab, from: Math.min(6, an), to: Math.min(13, an), at: 1, fps: 18, r: 1.9, fired: false, fx: "fx.power" };
    }
  }
  function stepErupt(p, dt) {
    const e = p.er; e.t += dt; p.vx = 0;
    const i = e.from + Math.floor(e.t * e.fps);
    if (!e.fired && i >= e.from + e.at) {
      e.fired = true;
      const ew = (p.diveS && p.diveS.fxWho) || p.c.id;
      if (e.fx) {                                          // Shadow's Air Chaos Burst, kicking up dust (him in it, at his own size)
        effect(ew, e.fx, p.x, p.y + 0.58, p.face, 22, true, "fx", 1);
        if (ew === "shadow" && !p.c.emerl) p.hideT = framesOf(ew, e.fx).length / 22;
        if (framesOf(ew, "fx.dust")) { effect(ew, "fx.dust", p.x - 0.7, p.y, -1, 20, false); effect(ew, "fx.dust", p.x + 0.7, p.y, 1, 20, false); }
      } else effect(ew, "fx.boom", p.x, p.y + 0.6, p.face, 22, true, "fx", 1.5);   // Knuckles' Major Eruption: the blast alone
      impact(p.x, p.y + 0.7, p.diveS && p.diveS.pow);
      tok(e, 14); strike(p.x - e.r, p.x + e.r, p.y - 0.3, p.y + 2.2, { r: 12, cx: p.x, cy: p.y });
      SFX.boom(); SFX.impact();
    }
    if (i > e.to) { p.state = "run"; p.er = null; }
  }
  /* Amy's Girl Tornado: the hammer swung round and round, carrying her along. */
  function stepTornado(p, dt) {
    const T = p.tor; T.t += dt;
    const i = Math.floor(T.t * T.fps);
    if (i >= T.from) {
      T.left -= dt;
      p.vx = p.face * (T.air ? 3.5 : 4.5);
      const col = HIT_C[p.c.id] || 0xff80c0;
      if ((T.hitT = (T.hitT || 0) - dt) <= 0) { T.hitT = 0.22; T.tok = {}; }    // round and round: it can hit again each turn
      tok(T.tok, 3, 0.5);
      if (strike(p.x - 0.9, p.x + 0.9, p.y + 0.05, p.y + p.hh + 0.2, { vx: p.face * 10, vy: 8 })) { impact(p.x + p.face * 0.6, p.y + 0.6, { c: col, flash: 1.4, shake: 0.08 }); hitStop(0.03); SFX.hit(); }
      T.whirl = (T.whirl || 0) - dt;
      if (T.whirl <= 0) {                                  // the wind of the swing, round and round
        T.whirl = 0.035; const a = T.t * 18;
        world.parts.list.push({ x: p.x + Math.cos(a) * 0.9, y: p.y + 0.5 + Math.sin(a) * 0.25, z: Math.sin(a) * 0.6, vx: -Math.sin(a) * 4, vy: 2, vz: 0, life: 0.22, s: 0.07, c: Math.random() < 0.5 ? mixC(col, 0xffffff, 0.3) : 0xffffff });
      }
      if ((T.swish = (T.swish || 0) - dt) <= 0) { T.swish = 0.18; SFX.swing(true); }
      if (T.left <= 0) { p.state = "run"; p.tor = null; }
    }
  }

  // ---------------------------------------------------------------- shots, effects and traps
  /** A shot: a card of the runner's sheet that flies and hits what it meets. */
  function shoot(who, o) {
    const card = makeCard(who, o.ghost ? "ghost" : "fx"); world.group.add(card);
    world.shots.push(Object.assign({ card, who, t: 0, life0: o.life, gone: false, owner: actor, dmg: fireDmg, nid: ++shotNid }, o));
  }
  /** An effect that only shows: plays once where it is put. */
  function effect(who, name, x, y, face, fps, mid, kind, k, from, follow, wait) {
    const card = makeCard(who, kind === "body" ? "body" : "fx"); world.group.add(card); card.visible = !(wait > 0);
    world.fx.push({ card, name, x, y, face, fps, mid, k, t: -(wait || 0), from: from || 0, n: framesOf(who, name).length - (from || 0), follow });
  }
  /* something to do a moment from now, in the game's own time (a blow that lands as its water rises) */
  function later(t, fn) { (world.later = world.later || []).push({ t, fn }); }
  function stepLater(dt) {
    const L = world.later; if (!L || !L.length) return;
    for (const e of L.splice(0)) { e.t -= dt; if (e.t > 0) L.push(e); else e.fn(); }
  }
  function setTrap(p, s) {
    const live = world.traps.filter(t => !t.gone && mine(t, p));
    if (s.one) live.forEach(boomTrap);                   // Psycho Orb: one at a time
    else if (live.length >= 2) boomTrap(live[0]);
    const tw = s.fxWho || p.c.id;                        // (whose trap it is: Emerl's copies look like their source's)
    const f = p.face, card = makeCard(tw, s.faint ? "faint" : "fx"), float = s.trap === "float"; world.group.add(card);
    world.traps.push({ card, who: tw, owner: p, kind: s.trap, nid: ++shotNid, faint: !!s.faint, x: p.x + f * 0.7, y: p.y + (s.flies || float ? 1.0 : 0), vx: float ? f * 7 : s.toss ? f * (s.far || 3) : 0, vy: s.toss ? 2 : 0,
                       t: 0, life: s.trap === "orbit" ? 6 : 9, a: 0, flies: !!s.flies || float, grounded: !s.toss && !s.flies && !float && s.trap !== "orbit", gone: false, face: f });
    SFX.set();
  }
  function boomTrap(t) {
    if (t.gone) return;
    t.gone = true; world.group.remove(t.card); t.card.geometry.dispose(); emit("trapboom", { p: t.owner });
    const by = t.y + (t.flies || t.kind === "orbit" ? 0 : 0.5), knux = t.who === "knuckles";   // his Mole Bomb: the blast alone
    const L = TRAP_LOOK[t.who] || {}, col = L.boom ? HIT_C[t.who] : 0xffb040;
    if (L.boom) effect(t.who, L.boom, t.x, L.bmid ? by : t.y, 1, 18, !!L.bmid, "fx", L.bk || 1.4, L.bfrom);   // Cream Cracker, Chaos Splash
    else effect(t.who, "fx.boom", t.x, by, 1, 22, true, "fx", 1.6);
    if (!knux) burst(t.x, by, L.boom ? [col, 0xffffff, mixC(col, 0xffffff, 0.5)] : [0xfff3a0, 0xf08a24, 0xffffff, 0xe8403a], 24, 7);
    impact(t.x, by, { c: col, flash: 3.6, shake: 0.28, stop: 0.05, bits: knux ? 0 : 1 });
    const a0 = actor; actor = t.owner || actor; tok(t, 12);
    strike(t.x - 1.5, t.x + 1.5, t.y - 0.6, t.y + 1.8, { r: 11, cx: t.x, cy: by - 0.4 });
    actor = a0;
    SFX.boom(); SFX.impact();
  }
  /* what a hunting trap goes after: a badnik, or in a battle a fighter of the other side */
  function nearestFoe(x, y, range, owner) {
    let best = nearestEnemy(x, y, range), bd = best ? Math.hypot(best.x - x, best.y + best.h / 2 - y) : range;
    if (battle) for (const q of battle.fs) if (rivals(owner, q) && !q.ko && !q.out) { const d = Math.hypot(q.x - x, q.y + q.hh / 2 - y); if (d < bd) { bd = d; best = q; } }
    return best;
  }
  function nearestEnemy(x, y, range) {
    let best = null, bd = range;
    for (const e of world.enemies) if (e.alive && !e.hidden) { const d = Math.hypot(e.x - x, e.y + e.h / 2 - y); if (d < bd) { bd = d; best = e; } }
    return best;
  }
  function stepShots(dt, look) {
    const w = world;
    for (const s of look ? [] : w.shots) {
      if (s.gone) continue;
      actor = s.owner || null; tok(s, s.dmg || 8, s.kn ? 1 : 0.85);
      s.t += dt; s.life -= dt;
      if (s.g) s.vy -= s.g * dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      if (s.ground) { const gy = groundY(s.x, s.y); if (gy === null) s.life = 0; else s.y = gy; }
      const ty = s.mid ? s.y : s.y + 0.4, t = tile(Math.floor(s.x), Math.floor(ty));
      if (t === "X" || t === "B") breakTile(Math.floor(s.x), Math.floor(ty));
      else if (solid(t) || (s.mid && (t === "/" || t === "\\"))) { if (s.bursts) boomAt(s.x, s.y, s.bursts, s); s.life = 0; }
      if (s.life > 0) {
        /* each shot throws them its own way (`kn`): a tornado (Pink Typhoon, Mighty Cyclone)
           straight up, as the launcher does, others further, higher, or floating them down */
        const kn = s.kn, sd = sgn(s.vx) || s.face || 1;
        const kick = s.bursts ? null : kn ? (kn[3] ? { vx: sd * kn[0], vy: kn[1], launch: true, lvx: kn[0], lvy: kn[1], float: kn[2] } : { vx: sd * kn[0], vy: kn[1], float: kn[2] })
                   : s.twister ? { vx: sd * 1.5, vy: LAUNCH.vy, launch: true } : { vx: sd * 11, vy: 5 };
        /* (on its first step it sweeps back to the hand: point-blank, one already past the muzzle is hit) */
        let sx0 = s.x - s.w / 2, sx1 = s.x + s.w / 2;
        if (s.x0 != null) { sx0 = Math.min(sx0, s.x0); sx1 = Math.max(sx1, s.x0); s.x0 = null; }
        const n = strike(sx0, sx1, s.mid ? s.y - s.h / 2 : s.y, s.mid ? s.y + s.h / 2 : s.y + s.h, kick);
        /* a shot lands with weight: it stops in whoever it hits (a fighter, a boss) with a freeze,
           a jolt, a flash ring and sparks blown on the way it was going; a guard catches it.
           (Badniks and blocks it breaks, it goes on through.) */
        const big = world.hitBig, hx = world.hitAt ? world.hitAt.x : s.x, hy = world.hitAt ? world.hitAt.y : s.mid ? s.y : s.y + 0.5;
        if (n && s.bursts) {
          SFX.hit(); boomAt(s.x, s.y, s.bursts, s); s.life = 0;
          const o = s.owner;                                // (a rock or missile that bursts on someone opens a combo too)
          if (battle && o && big) { o.shotHit = 0.6; if (o.state === "special" && o.sp && o.sp.fired) o.sp.landed = true; }
        }
        else if (n && big) {
          const col = s.trail || HIT_C[s.who] || 0xffffff;
          impact(hx, hy, { c: col, flash: 2.4, shake: 0.16, stop: s.twister ? 0.09 : 0.07 });
          impact(hx, hy, { c: col, flash: 1.6, cone: sgn(s.vx) || 1 });
          ring(hx, hy, col, s.twister ? 2.2 : 1.6); hitSpark(hx, hy, 1.3, col);
          SFX.hit(); SFX.impact(); s.life = 0;
          /* it lands, and the combo can go on: the rest of the move cancels into the next press, and
             Space is a super jump after one it threw up */
          const o = s.owner;
          if (battle && o) { o.shotHit = 0.6; if (o.state === "special" && o.sp && o.sp.fired) o.sp.landed = true; if (o.state === "recoil") o.recoilLanded = true; }
        } else if (n) { SFX.hit(); impact(s.x, s.mid ? s.y : s.y + 0.5, { c: s.trail || 0xffffff, flash: 1.3, shake: 0.06 }); hitStop(0.03); }
        else if (world.guarded) { burst(s.x, s.mid ? s.y : s.y + 0.5, [s.trail || 0xffffff, 0xbfe8ff, 0xffffff], 10, 4); s.life = 0; }
      }
      if (s.ring) { const o = s.owner || player; if (Math.abs(o.x - s.x) < 0.7 && o.state === "roll") s.life = 0; }
      if (s.trail && s.bits !== 0 && Math.random() < 0.7) world.parts.list.push({ x: s.x - sgn(s.vx) * 0.35 * (s.k || 1), y: (s.mid ? s.y : s.y + 0.3 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.3, vx: -s.vx * 0.06, vy: 0.5 + Math.random(), vz: 0, life: 0.22, s: 0.07, c: Math.random() < 0.6 ? s.trail : 0xffffff });
      if (s.ghost && !s.trail && Math.random() < 0.6) world.parts.list.push({ x: s.x - sgn(s.vx) * 0.5, y: s.y + (s.mid ? 0 : 0.2 + Math.random() * 0.9), z: (Math.random() - 0.5) * 0.4,
        vx: -s.vx * 0.08, vy: 1 + Math.random() * 1.5, vz: 0, life: 0.25, s: 0.06, c: Math.random() < 0.5 ? 0xffffff : 0xcfe8ff });
      if (s.y < -3) s.life = 0;
      if (s.life <= 0) { s.gone = true; w.group.remove(s.card); s.card.geometry.dispose(); }
    }
    actor = null;
    if (w.shots.length > 30) w.shots = w.shots.filter(s => !s.gone);
    for (const f of w.flashes) {
      if (f.gone) continue;
      f.t += dt; const k = f.t / f.life;
      if (f.ring) {
        const sc = f.size * (0.15 + Math.sqrt(Math.min(1, k)) * 0.85); f.s.scale.set(sc, sc, 1); f.s.material.opacity = 0.9 * (1 - Math.min(1, k));
        if (k >= 1) { f.gone = true; w.group.remove(f.s); f.s.geometry.dispose(); f.s.material.dispose(); }
        continue;
      }
      if (f.spark) {                                       // a hit spark: pops, then shrinks away
        const sc = f.size * (k < 0.3 ? 1 + k * 0.6 : 1.18 - (k - 0.3) * 1.4);
        f.s.scale.setScalar(Math.max(0.01, sc)); f.s2.scale.setScalar(Math.max(0.01, sc * 0.5));
        if (k >= 1) { f.gone = true; w.group.remove(f.s, f.s2); f.s.material.dispose(); f.s2.material.dispose(); }
        continue;
      }
      f.s.scale.setScalar(f.size * (0.3 + k * 1.4)); f.s.material.opacity = 0.95 * (1 - k);
      if (k >= 1) { f.gone = true; w.group.remove(f.s); f.s.material.dispose(); }
    }
    if (w.flashes.length > 12) w.flashes = w.flashes.filter(f => !f.gone);
    for (const e of w.fx) {
      if (e.gone) continue;
      e.t += dt;
      if (e.follow && e.t >= 0) { e.x = e.follow.p.x + e.face * e.follow.ox; e.y = e.follow.p.y + e.follow.oy; }
      if (Math.floor(e.t * e.fps) >= e.n) { e.gone = true; w.group.remove(e.card); e.card.geometry.dispose(); }
    }
    if (w.fx.length > 30) w.fx = w.fx.filter(e => !e.gone);
    const p = player;
    for (const t of look ? [] : w.traps) {
      if (t.gone) continue;
      t.t += dt; t.life -= dt;
      if (t.kind === "orbit") {                            // Roaming Chaos keeps to Shadow
        const o = t.owner || p; t.a += dt * 4; t.x = o.x + Math.cos(t.a) * 1.2; t.y = o.y + 0.3 + Math.sin(t.a) * 0.8;
      } else if (t.kind === "float") {                     // Silver's Psycho Orb: ahead, slowing, then hangs there
        t.vx *= Math.pow(0.03, dt);
        const nx = t.x + t.vx * dt;
        if (solid(tile(Math.floor(nx), Math.floor(t.y)))) t.vx = 0; else t.x = nx;
        t.y += Math.sin(t.t * 3) * 0.35 * dt;
      } else if (t.flies) {                                // Bat Cracker hunts
        const e = nearestFoe(t.x, t.y, 9, t.owner);
        if (e) { const dx = e.x - t.x, dy = e.y + e.h / 2 - t.y, d = Math.hypot(dx, dy) || 1; t.x += dx / d * 3.5 * dt; t.y += dy / d * 3.5 * dt; t.face = sgn(dx) || t.face; }
        else t.y += Math.sin(t.t * 4) * 0.4 * dt;
      } else if (!t.grounded) {                            // tossed: falls to the ground
        t.vy -= GRAV * 0.8 * dt; t.x += t.vx * dt; t.y += t.vy * dt;
        const gy = groundY(t.x, t.y + 0.3);
        if (gy !== null && t.vy < 0 && t.y <= gy) { t.y = gy; t.grounded = true; t.vx = 0; t.landT = t.t; }
        if (t.y < -3) { t.gone = true; w.group.remove(t.card); t.card.geometry.dispose(); continue; }
      } else if (t.kind === "chase") {                     // the Chu² Bomb crawls after its mark
        const e = nearestFoe(t.x, t.y, 8, t.owner);
        if (e) { const nx = t.x + sgn(e.x - t.x) * 3 * dt, gy = groundY(nx, t.y); if (gy !== null) { t.x = nx; t.y = gy; t.face = sgn(e.x - t.x) || t.face; } }
      }
      for (const e of w.enemies) if (e.alive && !e.hidden && Math.abs(e.x - t.x) < e.w / 2 + 0.35 && t.y > e.y - 0.5 && t.y < e.y + e.h + 0.3) { boomTrap(t); break; }
      if (!t.gone && battle) for (const q of battle.fs) if (rivals(t.owner, q) && !q.ko && !q.out && Math.abs(q.x - t.x) < q.c.w / 2 + 0.35 && t.y > q.y - 0.5 && t.y < q.y + q.hh + 0.3) { boomTrap(t); break; }
      if (!t.gone && t.life <= 0) boomTrap(t);
    }
    if (w.traps.length > 12) w.traps = w.traps.filter(t => !t.gone);
  }
  /* A lobbed rock comes down (Knuckles'): no dust, only its light, the jolt and the freeze. */
  function boomAt(x, y, r, s) {
    if (s && s.boom) { effect(s.who, "fx.boom", x, y, 1, 22, true, "fx", s.boom); burst(x, y, [0xfff3a0, 0xf08a24, 0xffffff], 14, 6); }   // Eggman's missile
    else if (s && s.bits !== 0) burst(x, y, [0x9a7a62, 0x7a5a44, 0xd8c8a8, 0xb08a5a], 22, 7);
    if (s && s.land) impact(x, y, s.land);
    strike(x - r, x + r, y - r * 0.6, y + r, { r: 9, cx: x, cy: y - 0.5 });
    SFX.breakIt(); if (s && s.land) SFX.impact();
  }

  function integrate(p, dt) {
    // horizontal, in small steps so a fast runner cannot pass through a wall
    const dx = p.vx * dt, n = Math.max(1, Math.ceil(Math.abs(dx) / 0.2));
    for (let k = 0; k < n; k++) { moveX(p, dx / n); if (p.state === "climb") break; }
    /* come at a slope from the side (low, in a jump, a glide, a teleport) and the feet can be
       under its surface: they are set on it -- coming down, landed -- never left inside it */
    if (p.state !== "climb") {
      const ci = Math.floor(p.x), cj = Math.floor(p.y + 0.02), sc = tile(ci, cj);
      if (sc === "/" || sc === "\\") {
        const s = slopeY(sc, ci, cj, p.x);
        if (s > p.y) { p.y = s; if (!p.ground && p.vy <= 0) land(p, { on: null, tl: null }); }
      }
    }
    if (p.on && p.ground) { p.x += p.on.dx; }
    if (p.ground && p.onTile) {                           // a conveyor belt carries what stands on it
      const bt = tile(p.onTile.i, p.onTile.j);
      if (bt === "}" || bt === "{") moveX(p, (bt === "}" ? BELT : -BELT) * dt);
    }
    if (p.ground) {
      const reach = 0.18 + Math.abs(p.vx) * dt * 1.3 + (p.on ? Math.abs(p.on.dy) + 0.05 : 0);
      const hit = floorBetween(p, p.y + 0.52 + (p.on ? Math.max(0, p.on.dy) : 0), p.y - reach);   // up onto such a lip
      if (hit && p.vy <= 0.01) { p.y = hit.y; p.vy = 0; p.on = hit.on; p.onTile = hit.tl; }
      else { p.ground = false; p.on = null; p.onTile = null; }
    }
    if (!p.ground) {
      const prev = p.y;
      p.y += p.vy * dt;
      if (p.vy <= 0) {
        const hit = floorBetween(p, prev + 0.01, p.y);
        if (hit) { p.y = hit.y; land(p, hit); }
      } else {
        const hb = p.hh;
        const j = Math.floor(p.y + hb);
        for (let i = Math.floor(p.x - p.c.w / 2 + 0.05); i <= Math.floor(p.x + p.c.w / 2 - 0.05); i++) {
          const c = tile(i, j);
          if (solid(c)) {                                  // (a slope always stands on something: it is never a ceiling)
            if (c === "B" || (c === "X" && attacking(p))) { breakTile(i, j); continue; }
            p.y = j - hb - 1e-3; p.vy = 0; p.jumping = false;
            break;
          }
        }
      }
    }
    if (p.x < 0.4) { p.x = 0.4; p.vx = Math.max(0, p.vx); }
    if (p.y < -3 && !p.dead) die(p, "fell");
  }

  // ---------------------------------------------------------------- the courses' own machinery
  /* A course can carry, beside its tiles, the things a tile can't draw (the grand prix's do):
     `rides`, which take a runner along a path of their own and let go at its end, and `zones`,
     boxes where something acts on whoever is in them. x and y are the stage's metres (y up from
     the bottom row; what's placed is a runner's feet).
       rides
         loop    {x, y, r}            a loop-de-loop, its foot on the road at (x, y): run in at speed
                                      and round it you go, out again at the speed you came in (too
                                      slow, and you run on under it)
         cork    {x0, x1, y, amp}     a corkscrew over the road: at speed, round it you spin
         zip     {x0, y0, x1, y1, up} a cable (a pulley, a vine, a cable car), y its height: run into
                                      its handle and hang on, carried along it -- down one gaining
                                      speed, up one (`up`) at its own -- and let go at its end
         rail    {pts}                a rail to grind: land on it or run onto it and slide, downhill
                                      gaining; Jump leaves it
         tube    {pts}                a pipe: in at its mouth, through it at speed, out the far end
         cannon  {x, y, a, v}         a cannon on the road: in, a moment, and fired along `a` degrees
                                      at v m/s (a shot flies true: nothing steers it till it lands)
       zones
         current {x0, x1, y0, y1, vx} water running: in it, you go with it (against it, slowly)
         wind    {.., vx}             a gale: it holds you back, or blows you on
         lowg    {.., g}              low gravity: g of it
         geyser  {x, y, h, on, off, ph}  a spout: for `on` seconds of every on + off it throws
                                      whoever is over it up to y + h
         devil   {x0, x1, y, h, sp}   a dust devil, wandering to and fro between x0 and x1, lifting
                                      whoever it reaches up to y + h
       (`Y` in the tiles is a spring set at forty-five degrees: up and on, and the shot flies true.) */
  const RIDE_VMIN = 8.5;                              // (slower than this, a loop or a corkscrew lets you by)
  let TUBE_MAT = null;
  function buildMech(w, def, T, M, group) {
    w.rides = []; w.zones = (def.zones || []).map(z => Object.assign({ t0: 0 }, z));
    const col = (T.block && T.block[0]) || 0x8a8aa0, hi = (T.neon && T.neon[0]) || T.flowers && T.flowers[0] || 0xffd23a;
    for (const r0 of def.rides || []) {
      const R = Object.assign({}, r0), pts = [];
      switch (R.k) {
        case "loop": { const cx = R.x, cy = R.y + R.r; for (let a = -90; a <= 270.001; a += 4) { const t = a * PI / 180; pts.push([cx + (R.r - 0.05) * Math.cos(t), cy + (R.r - 0.05) * Math.sin(t)]); } break; }   // (the feet on the track all the way round: drawn running on it)
        case "cork": { R.n = Math.max(1, Math.round((R.x1 - R.x0) / 12)); for (let x = R.x0; x <= R.x1 + 1e-6; x += 0.5) { const ph = (x - R.x0) / (R.x1 - R.x0) * R.n * PI * 2; pts.push([x, R.y + R.amp * (1 - Math.cos(ph)) / 2]); } break; }
        case "zip": pts.push([R.x0, R.y0 - 2.2], [R.x1, R.y1 - 2.2]); break;
        case "rail": for (const q of R.pts) pts.push([q[0], q[1]]); break;
        case "tube": for (const q of R.pts) pts.push([q[0], q[1] - 0.5]); break;
        default: pts.push([R.x, R.y], [R.x + 0.01, R.y]);
      }
      R.p = pts; R.L = [0];
      for (let k = 1; k < pts.length; k++) R.L.push(R.L[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
      R.total = R.L[R.L.length - 1];
      R.xa = Math.min(...pts.map(q => q[0])); R.xb = Math.max(...pts.map(q => q[0]));
      mechMesh(w, R, group, T, M, col, hi);
      w.rides.push(R);
    }
    for (const z of w.zones) zoneMesh(z, group, T, M);
  }
  /* the floor under (x, y): the first thing to stand on, down from y */
  function mechFloor(w, x, y) {
    const i = Math.floor(x);
    for (let j = Math.min(H - 1, Math.floor(y)); j >= 0; j--) { const c = (i < 0 || i >= w.W) ? "#" : w.S.grid[j][i]; if (SOLIDS.indexOf(c) >= 0 || c === "-" || c === "/" || c === "\\") return j + 1; }
    return 0;
  }
  /* a bar from (x0, y0) to (x1, y1), w wide and d deep, at depth z */
  function mechBar(group, mat, x0, y0, x1, y1, w, d, z) {
    const len = Math.hypot(x1 - x0, y1 - y0) || 0.01;
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, w, d), mat);
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, z); m.rotation.z = Math.atan2(y1 - y0, x1 - x0);
    m.castShadow = true; group.add(m); return m;
  }
  const lamb = c => new THREE.MeshLambertMaterial({ color: c });
  function mechMesh(w, R, group, T, M, col, hi) {
    switch (R.k) {
      case "loop": {                                   // the track: a ring of the course's own blocks, a bright stripe round its inside
        const r = R.r, s = 0.25, n = Math.round(r / s);
        const g = vox(v => {
          for (let a = 0; a < 360; a += 0.7) {
            const t = a * PI / 180;
            for (let k = 0; k <= 2; k++) {
              const rr = n + k, ix = Math.round(Math.cos(t) * rr), iy = Math.round(Math.sin(t) * rr);
              for (let z = -6; z <= -2; z++) v.set(ix, iy, z, k === 0 ? ((Math.floor(a / 18) & 1) ? hi : 0xffffff) : col);
            }
          }
        }, s);
        const m = new THREE.Mesh(g, M.vox); m.position.set(R.x, R.y + r, 0); m.castShadow = true; group.add(m);
        break;
      }
      case "cork": {                                   // a ribbon twisting round, behind the road
        const g = vox(v => {
          for (let x = 0; x <= (R.x1 - R.x0) / 0.25; x++) {
            const ph = x * 0.25 / (R.x1 - R.x0) * R.n * PI * 2, y = Math.round(R.amp * (1 - Math.cos(ph)) / 2 / 0.25) - 1;
            const zc = Math.round(-4 + Math.cos(ph) * 2);
            for (let z = zc - 1; z <= zc + 1; z++) v.set(x, y, z, (x >> 2) & 1 ? col : hi);
          }
        }, 0.25);
        const m = new THREE.Mesh(g, M.vox); m.position.set(R.x0, R.y, 0); group.add(m);
        break;
      }
      case "zip": {                                    // two posts, the cable, and the handle waiting at its start
        const dark = lamb(0x3a3a44), cab = lamb(0x2a2a30);
        for (const [x, y] of [[R.x0, R.y0], [R.x1, R.y1]]) { const f = mechFloor(w, x, y - 0.5); mechBar(group, dark, x, f, x, y + 0.4, 0.22, 0.22, -0.7); }
        mechBar(group, cab, R.x0, R.y0, R.x1, R.y1, 0.07, 0.07, -0.2);
        R.handle = mechBar(group, lamb(hi), R.x0 - 0.35, R.y0 - 1.0, R.x0 + 0.35, R.y0 - 1.0, 0.12, 0.12, 0.2);
        mechBar(group, cab, R.x0, R.y0, R.x0, R.y0 - 1.0, 0.05, 0.05, 0.2);
        break;
      }
      case "rail": {                                   // the rail, and posts down to the ground
        const bar = lamb(hi), post = lamb(col);
        for (let k = 1; k < R.p.length; k++) mechBar(group, bar, R.p[k - 1][0], R.p[k - 1][1] - 0.08, R.p[k][0], R.p[k][1] - 0.08, 0.16, 0.3, 0);
        for (let x = R.xa + 1; x < R.xb; x += 5) { const y = rideYAt(R, x); if (y == null) continue; const f = mechFloor(w, x, y - 0.3); if (y - f > 0.4) mechBar(group, post, x, f, x, y - 0.15, 0.2, 0.2, -0.3); }
        break;
      }
      case "tube": {                                   // a glass pipe, a ring at each mouth
        TUBE_MAT = TUBE_MAT || new THREE.MeshLambertMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.28, depthWrite: false });
        const rim = lamb(hi);
        for (let k = 1; k < R.p.length; k++) {
          const a = R.p[k - 1], b = R.p[k], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
          const m = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, len + 0.2, 14, 1, true), TUBE_MAT);
          m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.5, 0); m.rotation.z = Math.atan2(b[1] - a[1], b[0] - a[0]) - PI / 2; m.renderOrder = 4; group.add(m);
        }
        for (const q of [R.p[0], R.p[R.p.length - 1]]) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.12, 6, 16), rim); t.position.set(q[0], q[1] + 0.5, 0); t.rotation.y = PI / 2; group.add(t); }
        break;
      }
      case "cannon": {                                 // a squat base and a barrel, aimed
        const a = R.a * PI / 180, base = lamb(0x30303a), brl = lamb(hi);
        const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 1.2), base); b.position.set(R.x, R.y + 0.35, -0.2); b.castShadow = true; group.add(b);
        const c = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 1.8, 12), brl);
        c.position.set(R.x + Math.cos(a) * 0.55, R.y + 0.65 + Math.sin(a) * 0.55, -0.2); c.rotation.z = a - PI / 2; c.castShadow = true; group.add(c);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.09, 6, 14), lamb(0xf2f2f2));
        ring.position.set(R.x + Math.cos(a) * 1.4, R.y + 0.65 + Math.sin(a) * 1.4, -0.2); ring.rotation.y = PI / 2; ring.rotation.x = 0; ring.rotation.z = a; group.add(ring);
        R.barrel = c;
        break;
      }
    }
  }
  /* the height of a rail (or any ride's path) at x, where it has one */
  function rideYAt(R, x) {
    for (let k = 1; k < R.p.length; k++) { const a = R.p[k - 1], b = R.p[k]; if (x < Math.min(a[0], b[0]) || x > Math.max(a[0], b[0]) || a[0] === b[0]) continue; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); }
    return null;
  }
  function zoneMesh(z, group, T, M) {
    const glow = (c, op) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: op, depthWrite: false });
    z.bits = [];
    if (z.k === "current" || z.k === "wind" || z.k === "lowg") {    // streaks going with it (or sparkles drifting up)
      const n = Math.min(40, Math.round((z.x1 - z.x0) * (z.y1 - z.y0) / (z.k === "lowg" ? 10 : 6)));
      const geo = z.k === "lowg" ? new THREE.BoxGeometry(0.09, 0.09, 0.09) : new THREE.BoxGeometry(z.k === "wind" ? 1.6 : 0.8, 0.05, 0.05);
      const mat = glow(z.k === "current" ? 0xe8f8ff : z.k === "wind" ? 0xffffff : 0xfff6c0, z.k === "wind" ? 0.45 : 0.7);
      for (let k = 0; k < n; k++) { const m = new THREE.Mesh(geo, mat); m.position.set(z.x0 + Math.random() * (z.x1 - z.x0), z.y0 + Math.random() * (z.y1 - z.y0), z.k === "wind" ? 0.6 : 0.35); group.add(m); z.bits.push(m); }
    } else if (z.k === "geyser") {                                   // a vent, and its spout
      const v = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 1.2), lamb(0x3a3430)); v.position.set(z.x, z.y + 0.15, -0.1); group.add(v);
      z.col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.75, 1, 10, 1, true), glow(z.c || T.geyser || 0xd8f4ff, 0.42));
      z.col.renderOrder = 4; z.col.visible = false; group.add(z.col);
    } else if (z.k === "devil") {                                    // a funnel of dust, turning
      z.rings = [];
      for (let k = 0; k < 7; k++) { const m = new THREE.Mesh(new THREE.TorusGeometry(0.35 + k * 0.17, 0.06, 5, 14), glow(z.c || 0xe0c090, 0.5)); m.rotation.x = PI / 2; m.renderOrder = 4; group.add(m); z.rings.push(m); }
    }
  }
  const devilX = (z, t) => z.x0 + (z.x1 - z.x0) * (0.5 + 0.5 * Math.sin(t * (z.sp || 0.5) + (z.ph || 0)));
  const geyserOn = (z, t) => { const per = z.on + z.off, ph = (((t + (z.ph || 0)) % per) + per) % per; return ph < z.on; };
  /* the zones' look, a frame: streaks going with the water and the wind, spouts up, whirlwinds wandering */
  function zonesDraw(w, dt) {
    for (const z of w.zones || []) {
      if (z.bits && z.bits.length) for (const m of z.bits) {
        if (z.k === "lowg") { m.position.y += dt * 0.8; if (m.position.y > z.y1) m.position.y = z.y0; continue; }
        m.position.x += z.vx * dt * (z.k === "wind" ? 1.4 : 1);
        if (m.position.x > z.x1) m.position.x = z.x0; else if (m.position.x < z.x0) m.position.x = z.x1;
      }
      if (z.k === "geyser") {
        const on = geyserOn(z, w.t);
        z.col.visible = on; if (on) { const h = z.h * (0.9 + Math.sin(w.t * 30) * 0.05); z.col.scale.set(1, h, 1); z.col.position.set(z.x, z.y + h / 2, 0); }
        if (on && Math.abs(z.x - camX) < 20 && Math.random() < 0.6) burst(z.x, z.y + z.h * Math.random(), [0xffffff, z.c || 0xd8f4ff], 1, 3);
      } else if (z.k === "devil") {
        const x = devilX(z, w.t);
        z.rings.forEach((m, k) => { m.position.set(x + Math.sin(w.t * 6 + k) * 0.12 * k, z.y + 0.3 + k * (z.h / 7), 0.2); m.rotation.z = w.t * (8 + k); });
      }
    }
  }
  /* zones acting on a runner, this step: carried by the water, pushed by the wind; and the gravity
     there (what's returned: a fraction) */
  function zoneStep(p, dt, dir) {
    let gk = 1;
    for (const z of world.zones) {
      if (z.k === "geyser" || z.k === "devil" || p.x < z.x0 || p.x > z.x1 || p.y < z.y0 || p.y > z.y1) continue;
      if (z.k === "current") { if (p.inWater) p.vx = lerp(p.vx, z.vx + dir * 2.5, 1 - Math.exp(-dt * 3)); }
      else if (z.k === "wind") moveX(p, z.vx * dt * (p.ground ? 0.45 : 0.7));
      else if (z.k === "lowg") gk = Math.min(gk, z.g);
    }
    return gk;
  }
  /* spouts and whirlwinds: up they throw you, to their top */
  function liftStep(p) {
    for (const z of world.zones) {
      let cx, r;
      if (z.k === "geyser") { if (!geyserOn(z, world.t)) continue; cx = z.x; r = 0.8; }
      else if (z.k === "devil") { cx = devilX(z, world.t); r = 1.0; }
      else continue;
      const top = z.y + z.h;
      if (Math.abs(p.x - cx) > r || p.y < z.y - 0.3 || p.y > top - 0.4) continue;
      const v = Math.sqrt(2 * GRAV * Math.max(0.6, top - p.y));
      if (p.vy < v) {
        p.vy = v; p.ground = false; p.on = null; p.jumping = false; p.ballistic = false;
        if (p.state !== "fly" && p.state !== "glide" && p.state !== "roll") p.state = "run";
      }
    }
  }
  /* on to a ride: if one's there to take, and you're right for it */
  function rideCheck(p, px) {
    const w = world;
    if (!w.rides || !w.rides.length || p.dead || p.ko || p.state === "ride" || p.state === "climb" || p.state === "hurt") return;
    for (const R of w.rides) {
      if (p.x < R.xa - 2 || p.x > R.xb + 2) continue;
      if (p.rideCd > 0 && R === p.rideLast) continue;                  // (just off this one: not straight back on -- the next one, though, at once)
      let u = null;
      switch (R.k) {
        case "loop": case "cork": { const x0 = R.k === "loop" ? R.x : R.x0;
          if (p.ground && p.vx >= RIDE_VMIN && px < x0 && p.x >= x0 && Math.abs(p.y - R.y) < 0.6) u = 0; break; }
        case "zip": if (Math.abs(p.x - R.x0) < 1.0 && p.y + p.hh > R.y0 - 1.8 && p.y < R.y0 + 0.2) u = 0; break;   // (its handle: caught by anyone running under it or jumping up at it)
        case "tube": { const q = R.p[0]; if (Math.abs(p.x - q[0]) < 1.2 && p.y > q[1] - 0.6 && p.y < q[1] + 1.4) u = 0; break; }   // (a pipe's mouth takes you in from a little way off)
        case "cannon": if (Math.abs(p.x - R.x) < 0.75 && p.y > R.y - 0.3 && p.y < R.y + 1.2) u = 0; break;
        case "rail": {
          if (p.vy > 0.5 || p.vx < 0) break;
          for (let k = 1; k < R.p.length; k++) {
            const a = R.p[k - 1], b = R.p[k];
            if (p.x < Math.min(a[0], b[0]) || p.x > Math.max(a[0], b[0]) || a[0] === b[0]) continue;
            const f = (p.x - a[0]) / (b[0] - a[0]), ry = a[1] + (b[1] - a[1]) * f;
            if (p.y > ry - 0.45 && p.y < ry + 0.3) u = R.L[k - 1] + (R.L[k] - R.L[k - 1]) * f;
            break;
          }
          break;
        }
      }
      if (u != null) { rideStart(p, R, u); return; }
    }
  }
  function rideStart(p, R, u) {
    const v0 = Math.max(Math.abs(p.vx), Math.hypot(p.vx, p.vy) * 0.8);
    p.ride = { R, u, t: 0, v: R.k === "tube" ? Math.max(v0, 20) : R.k === "zip" ? (R.up ? (R.v || 8) : Math.max(v0, 9)) : R.k === "rail" ? Math.max(v0, 9) : R.k === "cork" ? v0 * 1.08 : v0 };
    p.state = "ride"; p.st = 0; p.ground = false; p.on = null; p.curl = R.k !== "zip"; p.mv = null; p.sp = null; p.jumping = false; p.ballistic = false; p.drop = false;
    if (R.k === "cannon") { p.hideT = 0.4; p.x = R.x; p.y = R.y; p.vx = p.vy = 0; }
    if (R.k === "zip" && R.handle) R.handle.visible = false;
    if (R.k === "cannon" || R.k === "tube") SFX.roll(); else if (R.k === "zip" || R.k === "rail") SFX.grab(); else SFX.dash();
  }
  /* where along a ride u is, and which way it's going there */
  function rideAt(R, u) {
    const L = R.L, P = R.p; let k = 1;
    while (k < L.length - 1 && L[k] < u) k++;
    const a = P[k - 1], b = P[k], seg = L[k] - L[k - 1] || 1, f = clamp((u - L[k - 1]) / seg, 0, 1);
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, (b[0] - a[0]) / seg, (b[1] - a[1]) / seg];
  }
  function stepRide(p, dt) {
    const S = p.ride, R = S.R;
    S.t += dt;
    if (R.k === "cannon") {
      p.x = R.x; p.y = R.y; p.vx = p.vy = 0;
      if (S.t < 0.38) return;
      const a = R.a * PI / 180, mx = R.x + Math.cos(a) * 1.5, my = R.y + 0.65 + Math.sin(a) * 1.5;
      rideEnd(p, mx, my - 0.5, Math.cos(a) * R.v, Math.sin(a) * R.v, true);
      burst(mx, my, [0xffffff, 0xd8d0c0, 0xffd23a], 14, 6); SFX.boom();
      return;
    }
    if (R.k === "zip") S.v = R.up ? (R.v || 8) : clamp(S.v + (-(R.p[1][1] - R.p[0][1]) / R.total) * GRAV * 0.55 * dt, 9, 24);
    else if (R.k === "rail") {
      const d = rideAt(R, S.u); S.v = clamp(S.v - d[3] * GRAV * 0.55 * dt, 8, 26);
      if (input.jp) { rideEnd(p, p.x, p.y + 0.05, d[2] * S.v, Math.max(0, d[3] * S.v) + p.c.jump * 0.9, true); p.jumping = true; SFX.jump(); return; }
    }
    S.u += S.v * dt;
    if (S.u >= R.total) {
      const d = rideAt(R, R.total);
      if (R.k === "loop") rideEnd(p, R.x + 0.05, R.y, S.v, 0, false, true);
      else if (R.k === "cork") rideEnd(p, R.x1, R.y, S.v, 0, false, true);
      else rideEnd(p, d[0], d[1], d[2] * S.v, d[3] * S.v, true);
      if (R.k === "zip" && R.handle) setTimeout(() => { if (R.handle) R.handle.visible = true; }, 1500);
      return;
    }
    const d = rideAt(R, S.u);
    p.x = d[0]; p.y = d[1]; p.vx = d[2] * S.v; p.vy = d[3] * S.v;
    if (Math.abs(p.vx) > 0.5) p.face = sgn(p.vx);
    if (R.k === "rail" && Math.random() < 0.5) burst(p.x - p.face * 0.2, p.y, [0xffe080, 0xffffff], 1, 2);
  }
  function rideEnd(p, x, y, vx, vy, ballistic, ground) {
    p.rideLast = p.ride && p.ride.R; p.ride = null; p.state = "run"; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.rideCd = 0.45; p.coyote = 0;
    p.ground = !!ground; p.ballistic = !!ballistic && !ground; p.curl = !!(p.ballistic && Math.abs(vy) > 2);
  }

  function interact(p, dt, riding) {
    const w = world;
    const bx0 = p.x - p.c.w / 2, bx1 = p.x + p.c.w / 2, by0 = p.y, by1 = p.y + p.hh;
    const touches = (x, y, r) => x + r > bx0 && x - r < bx1 && y + r > by0 && y - r < by1;
    // rings -- and with the magnetic shield, the ones near fly in (only those in the columns about
    // the runner are looked at: a course has hundreds, and the CPUs look too)
    if (!w.ringCol) { w.ringCol = []; for (const k of w.carrots) { const i = Math.floor(k.x); (w.ringCol[i] = w.ringCol[i] || []).push(k); } }
    const c0 = Math.max(0, Math.floor(p.x) - 5), c1 = Math.floor(p.x) + 5;
    if (p.shield === "magnet") for (let i = c0; i <= c1; i++) for (const k of w.ringCol[i] || []) {
      if (k.got) continue;
      const dx = p.x - k.x, dy = p.y + 0.4 - k.y, d = Math.hypot(dx, dy);
      if (d < 3.4 && d > 0.05) { k.x += dx / d * 10 * dt; k.y += dy / d * 10 * dt; }
    }
    for (let i = c0; i <= c1; i++) for (const k of w.ringCol[i] || []) if (!k.got && touches(k.x, k.y + 0.35, 0.38)) {
      k.got = true; p.carrots++; p.ringsGot++; SFX.coin();
      burst(k.x, k.y + 0.4, [0xfff3a0, 0xffffff], 4, 2);
    }
    for (const e of w.ents) {
      if (e.gone) continue;
      if (e.t === "loose" || (riding && e.t !== "monitor")) continue;
      if (e.t === "dspring") {                             // up and on at forty-five degrees: the shot flies true
        if (touches(e.x + 0.3, e.y + 0.4, 0.45) && !(p.dsCd > w.t)) {
          p.dsCd = w.t + 0.4; p.vx = 15.5; p.vy = 15.5; p.ground = false; p.on = null; p.ballistic = true; p.face = 1;
          p.airMove = false; p.airSp = false; p.airUses = 0; p.jumping = false; p.flyLeft = p.c.flyTime || 0;
          p.curl = true; if (p.state !== "roll") p.state = "run"; e.sq = 1; SFX.spring();
        }
        continue;
      }
      if (e.t === "spring") {
        if (p.vy <= 0.5 && touches(e.x, e.y + 0.3, 0.42) && p.y >= e.y - 0.1) {
          p.vy = 21; p.ground = false; p.y = Math.max(p.y, e.y + 0.5); p.airMove = false; p.airSp = false; p.airUses = 0; p.jumping = false;
          p.flyLeft = p.c.flyTime || 0;
          p.curl = p.state === "roll"; if (p.state !== "roll") p.state = "run"; e.sq = 1; SFX.spring();
        }
      } else if (e.t === "dash") {
        if (p.ground && touches(e.x, e.y + 0.1, 0.6)) { if (p.vx < 18) { p.vx = 18; p.face = 1; SFX.dash(); burst(p.x, p.y + 0.2, [0xf2d040, 0xffffff], 5, 3); } }
      } else if (e.t === "balloon") {                      // pops, and throws whoever touched it up, their air moves back
        if (!e.back && touches(e.x, e.y, 0.55)) {
          e.back = 3.5; e.m.visible = false;
          p.vy = 15; p.ground = false; p.on = null; p.jumping = false; p.airMove = false; p.airSp = false; p.airUses = 0; p.flyLeft = p.c.flyTime || 0;
          if (p.state !== "roll" && p.state !== "fly") p.state = "run";
          burst(e.x, e.y, (w.T.balloon || [0xff5a5a, 0xffb0a8]).concat([0xffffff]), 12, 4); SFX.pop();
        }
      } else if (e.t === "bumper") {                       // knocks whoever touches it straight away from its middle
        const dx = p.x - e.x, dy = p.y + p.hh / 2 - e.y, d = Math.hypot(dx, dy) || 1;
        if (e.cd <= 0 && d < 0.66 + p.c.w / 2) {
          p.vx = dx / d * 15; p.vy = Math.max(dy / d * 15, 4); p.ground = false; p.on = null; p.jumping = false; p.airMove = false; p.airUses = 0;
          if (p.state !== "roll") p.state = "run";
          if (Math.abs(p.vx) > 0.5) p.face = sgn(p.vx);
          e.sq = 1; e.cd = 0.2; SFX.bumper(); flash(e.x, e.y, 1.4, w.T.id === "club" ? 0xff7ad8 : 0xffd060);
        }
      } else if (e.t === "monitor") {                      // break it open: jump on it, roll or dash into it, or hit it
        if (!(bx1 > e.x - 0.42 && bx0 < e.x + 0.42 && by0 < e.y + 0.95 && by1 > e.y)) continue;
        const above = p.vy < 0 && p.y > e.y + 0.5;
        if (above || attacking(p) || p.state === "atk" || p.state === "seek" || p.state === "dash") {
          openMonitor(p, e);
          if (above) { p.vy = input.J ? 11 : 8; p.ground = false; p.airMove = false; p.airUses = 0; }
        } else if (p.y < e.y + 0.6) {                      // otherwise it stands in the way
          p.x = p.x < e.x ? e.x - 0.42 - p.c.w / 2 : e.x + 0.42 + p.c.w / 2; p.vx = 0;
        }
      }
    }
    if (!p.cpu) for (const s of w.shoes) if (!s.got && touches(s.x, s.y + 0.4, 0.45)) {     // (the Red Star Rings are yours to find)
      s.got = true; s.m.visible = false; p.shoes[s.n] = true; SFX.shoe();
      burst(s.x, s.y + 0.5, [0xf2b705, 0xfff3c4], 14, 4);
      hudToast("Red Star Ring " + (s.n + 1) + " of 3");
    }
    /* checkpoints and the post: a Star Post spins for each runner who passes it (lit by the first),
       and each starts again from the last they passed themselves */
    for (const k of w.checks) if (p.x >= k.x - 0.3 && !(k.by && k.by.has(p))) {
      (k.by = k.by || new Set()).add(p); p.check = { x: k.x, y: k.y }; SFX.check();
      if (!k.on) { k.on = true; k.m.geometry = propGeo("poleDone"); }
      k.spin = 1; if (!p.cpu) hudToast("Star Post: you'll start again here");
    }
    if (w.goal && p.x >= w.goal.x && mode === "play") { if (!w.def.story) w.goal.spin = 2.6; if (p.cpu) cpuHome(p.cpuQ); else finish(p); }
    // thorns
    const shell = p.c.id === "mighty" && p.curl;             // Mighty's shell shrugs off spikes (Sonic Mania Plus)
    if (!riding) for (const z of w.hazards) if (bx1 > z.x0 && bx0 < z.x1 && by0 < z.y1 && by1 > z.y0 && !shell) hurt(p, p.x + p.face);
    // badniks
    for (const e of w.enemies) {
      if (!e.alive || e.hidden) continue;
      if (e.reach && p.state !== "teleport") {               // Leon's tongue, Piko-piko's mallet, out in front
        const rx0 = e.face > 0 ? e.x : e.x - e.reach, rx1 = e.face > 0 ? e.x + e.reach : e.x;
        if (bx1 > rx0 && bx0 < rx1 && by0 < e.y + e.h && by1 > e.y) hurt(p, e.x);
      }
      const ex0 = e.x - e.w / 2, ex1 = e.x + e.w / 2, ey0 = e.y, ey1 = e.y + e.h;
      if (bx1 < ex0 || bx0 > ex1 || by1 < ey0 || by0 > ey1) continue;
      const stomp = p.vy < -0.5 && by0 > ey0 + e.h * 0.4;
      if (e.guard && p.star <= 0) {                         // spikes out, or spinning: it hurts, whatever touches it
        glance(e);
        if (shell) { p.vx = (sgn(p.x - e.x) || -p.face) * 6; p.vy = Math.max(p.vy, 7); p.ground = false; }
        else if (p.state !== "teleport") hurt(p, e.x);
        continue;
      }
      const armoured = p.star <= 0 && (e.B.armor === "ball" ? !(stomp || p.curl) : e.B.armor === "front" ? !stomp && sgn(p.x - e.x) === e.face :
                                         e.B.armor === "shell" ? e.mode !== "open" : false);
      if (riding) { if (!armoured) { defeat(e, { vx: (sgn(p.vx) || 1) * 9, vy: 7 }); hitSpark(e.x, e.y + e.h / 2, 1.1, 0xffffff); SFX.hit(); } continue; }   // (carried: through it, or by it)
      if (armoured && stomp && e.B.armor === "shell") { glance(e); p.vy = input.J ? 12 : 9; p.ground = false; continue; }   // a shut shell: off it
      /* a blow that meets it lands -- in its wind-up too, so a heavy's step never carries the
         runner into a hurt -- and so does the aim attack's dash */
      const swinging = p.state === "seek" || (p.state === "atk" && p.mv && Math.floor(p.mv.t * p.mv.fps) <= p.mv.h1);
      if (armoured && (swinging || attacking(p))) {         // it takes the blow: the runner bounces off, neither hurt
        glance(e);
        p.vx = (sgn(p.x - e.x) || -p.face) * 6; if (!p.ground) p.vy = Math.max(p.vy, 5);
        if (p.state !== "run" && p.state !== "fly" && p.state !== "glide") { p.state = "run"; p.mv = null; }
        continue;
      }
      if (swinging || attacking(p)) {
        if (swinging) {
          if (p.state === "seek") { const air = !p.ground; startBlow(p, "aim"); p.mv.air = air; p.vx = p.face * 2; }
          world.hitAt = { x: clamp(p.x + p.face * (p.c.w / 2 + 0.2), ex0, ex1), y: clamp(p.y + p.hh * 0.55, ey0, ey1) };
          defeat(e, blowKick(p)); landBlow(p); continue;
        }
        const homing = p.state === "homing", v = Math.max(8, Math.abs(p.vx) * 0.8);
        defeat(e, { vx: (sgn(p.vx) || p.face) * v, vy: homing ? 6 : 7 });
        hitSpark((e.x + p.x) / 2, clamp(p.y + p.hh * 0.5, ey0, ey1), homing ? 1.3 : 1.1, HIT_C[p.c.id] || 0xffffff);
        hitStop(homing ? 0.05 : 0.035); shakeCam(homing ? 0.1 : 0.06); SFX.hit();
        if (p.state === "homing") { p.state = "run"; p.vy = 10; p.vx = p.face * 4; p.airMove = false; p.airUses = 0; p.curl = true; }
        else if (p.curl && !p.ground && p.vy < 0) p.vy = input.J ? 12 : 9;
      } else if (stomp) {
        defeat(e); hitSpark(p.x, ey1, 0.9, 0xffffff); hitStop(0.025);
        p.vy = input.J ? 13 : 9.5; p.ground = false; p.airMove = false; p.airUses = 0; SFX.stomp();
        if (p.state !== "fly" && p.state !== "glide") p.state = "run";
      } else if (p.state !== "teleport") hurt(p, e.x);
    }
    // a homing attack that reaches a spring or a hurdle
    if (p.state === "homing" && p.target && p.target.t === "hurdle" && !p.target.alive) { p.state = "run"; p.vy = 9; p.airMove = false; p.airUses = 0; }
    // bubbles
    for (const b of w.bubbles) if (!b.gone && touches(b.x, b.y, 0.5)) { b.gone = true; b.m.visible = false; p.air = AIR; SFX.bubble(); }
    // a crumbling ledge underfoot
    if (p.ground && p.onTile) {
      const t = w.tiles[p.onTile.i + "," + p.onTile.j];
      if (t && t.c === "C" && !t.t && !t.gone) t.t = 0.45;
    }
  }
  /** Beaten. Knocked by a blow or a blast -- `kick` a push {vx, vy}, or {r, cx, cy}: r m/s away
      from a point -- it shows white through the freeze-frame, then flies off tumbling and
      bursts where it hits something or after a moment; stomped, it bursts at once. */
  function defeat(e, kick) {
    e.alive = false; e.byCpu = !!(cpuNow || (player && player.cpu));
    if (kick) {
      let vx = kick.vx, vy = kick.vy;
      if (kick.r) {
        const dx = e.x - kick.cx, dy = e.y + e.h / 2 - kick.cy, d = Math.hypot(dx, dy) || 1;
        vx = dx / d * kick.r + (sgn(dx) || 1) * 2; vy = Math.max(5, dy / d * kick.r + 5);
      }
      e.fling = { vx, vy, t: 0, rot: 0, spin: -(sgn(vx) || 1) * (11 + Math.random() * 6) };
      whiten(e.m, true);
      return;
    }
    pop(e); SFX.stomp();
  }
  function pop(e, lost) {
    if (e.fling) SFX.stomp();
    e.fling = null; e.m.visible = false; whiten(e.m, false);
    burst(e.x, e.y + e.h / 2, [0xffffff, 0xf2d040, 0xc8ccd8], 10, 5);
    if (!lost) {                                           // Sonic Advance's puff of smoke, and the animal it was running on
      const m = badCard(); m.castShadow = false; world.group.add(m);
      world.booms.push({ key: "boom", x: e.x, y: e.y + e.h / 2, r: -9, t: 0, m });
      spawnCritter(e.x, e.y + 0.3, e.byCpu);
    }
  }
  /* A blow that does not land: a white spark and a clink, and nothing else. */
  function glance(e) {
    if (e.clink > world.t) return;
    e.clink = world.t + 0.25;
    hitSpark(e.x, e.y + e.h / 2, 0.7, 0xffffff); SFX.grab();
  }
  /* a thing struck shows pure white for a moment */
  let WHITE = null;
  function whiten(m, on) {
    WHITE = WHITE || new THREE.MeshBasicMaterial({ color: 0xffffff });
    if (m.userData.bad) {                                   // a sprite: its own white silhouette
      if (on && !m.userData.m0) { m.userData.m0 = m.material; m.material = badMats().white; }
      else if (!on && m.userData.m0) { m.material = m.userData.m0; m.userData.m0 = null; }
      return;
    }
    m.traverse(o => {
      if (!o.isMesh) return;
      if (on && !o.userData.m0) { o.userData.m0 = o.material; o.material = WHITE; }
      else if (!on && o.userData.m0) { o.material = o.userData.m0; o.userData.m0 = null; }
    });
  }

  // ---------------------------------------------------------------- everything else that moves
  function worldStep(dt) {
    const w = world, p = player;
    if (!(NP.on && !NP.host && battle)) stepLater(dt);                 // (an online guest's world only shows the host's)
    const watch = NP.on && NP.watch && !battle;                       // (a spectator's runner is nobody: no boss or rival comes for it)
    if (w.boss && (mode === "play" || mode === "goal") && !watch) stepBoss(dt);
    if (w.rival && mode === "play" && !watch) stepRival(dt);
    for (const q of w.plats) {
      const k = Math.sin(w.t * 0.9 + q.ph) * q.range;
      const nx = q.t === "M" ? q.x0 + k : q.x0, ny = q.t === "V" ? q.y0 + k : q.y0;
      q.dx = nx - q.x; q.dy = ny - q.y; q.x = nx; q.y = ny;
      q.m.position.set(q.x, q.y, 0);
      if (p.on === q && p.ground) { p.y = q.y + 1; }
      for (const cq of CPUS) if (cq.p.on === q && cq.p.ground) cq.p.y = q.y + 1;
    }
    for (const e of w.enemies) if (e.fling) {               // knocked flying: tumbles off, bursts where it hits
      const F = e.fling; F.t += dt;
      if (F.t > 0.05 && !F.lit) { F.lit = true; whiten(e.m, false); }
      F.vy -= 30 * dt; F.rot += F.spin * dt;
      const nx = e.x + F.vx * dt, ny = e.y + F.vy * dt;
      /* it bursts on a wall or the ground -- a slope's surface too, never sailing on into it */
      const mc = tile(Math.floor(nx), Math.floor(ny + e.h / 2)), lo = tile(Math.floor(nx), Math.floor(ny + 0.05));
      const inSlope = ((mc === "/" || mc === "\\") && ny + e.h / 2 < slopeY(mc, Math.floor(nx), Math.floor(ny + e.h / 2), nx)) ||
                      ((lo === "/" || lo === "\\") && F.vy < 0 && ny < slopeY(lo, Math.floor(nx), Math.floor(ny + 0.05), nx));
      if (F.t > 0.45 || ny < -2 || solid(mc) || inSlope) pop(e, ny < -2);
      else { e.x = nx; e.y = ny; }
    }
    for (const e of w.enemies) {                            // the badniks near enough to matter (to you, or to a CPU: after the nearest)
      if (!e.alive) continue;
      let tg = p, d = Math.abs(e.x - p.x);
      for (const cq of CPUS) { const dd = Math.abs(e.x - cq.p.x); if (dd < d && !cq.p.dead) { d = dd; tg = cq.p; } }
      if (d > 28) continue;
      const keep = cpuNow; cpuNow = tg.cpu ? tg.cpuQ : null;
      stepBadnik(e, dt, tg);
      cpuNow = keep;
      if (e.y < -3) e.alive = false;
    }
    stepEnemyShots(dt, p);
    // balloons come back, bumpers ready again
    for (const e of w.ents) {
      if (e.t === "balloon" && e.back > 0) { e.back -= dt; if (e.back <= 0) { e.back = 0; e.m.visible = true; } }
      else if (e.t === "bumper") e.cd = Math.max(0, e.cd - dt);
    }
    // shots, effects and traps (on an online guest's screen, the host's: only the effects move on here)
    stepShots(dt, NP.on && !NP.host && !!battle);
    // loose rings, bouncing, and the animals let out of the badniks
    for (const e of w.ents) {
      if (e.gone) continue;
      if (e.t === "critter") {
        e.life -= dt; e.x += e.vx * dt;
        if (e.bird) e.y += 4.5 * dt;
        else { e.vy -= GRAV * 0.8 * dt; e.y += e.vy * dt; const g = groundY(e.x, e.y + 0.3); if (g !== null && e.vy < 0 && e.y <= g) { e.y = g; e.vy = 6; } }
        e.m.position.set(e.x, e.y, 0.2); e.m.scale.x = sgn(e.vx) || 1; e.m.rotation.z = e.bird ? Math.sin(w.t * 30) * 0.2 : 0;
        if (e.life <= 0 || e.y < -3) { e.gone = true; e.m.visible = false; }
        continue;
      }
      if (e.t !== "loose") continue;
      e.life -= dt; e.wait -= dt; e.vy -= GRAV * 0.7 * dt; e.x += e.vx * dt; e.y += e.vy * dt;
      const below = tile(Math.floor(e.x), Math.floor(e.y)), side = tile(Math.floor(e.x + sgn(e.vx) * 0.2), Math.floor(e.y + 0.3));
      if ((solid(below) || below === "-") && e.vy < 0) { e.y = Math.floor(e.y) + 1; e.vy = -e.vy * 0.6; e.vx *= 0.85; }
      if (solid(side)) e.vx = -e.vx * 0.6;
      if (e.wait <= 0) for (const r of racers()) if (Math.abs(e.x - r.x) < 0.7 && e.y > r.y - 0.4 && e.y < r.y + r.hh && !r.dead) {   // (whoever's there: you, or a CPU)
        e.gone = true; e.m.visible = false; r.carrots++; if (!e.own) r.ringsGot++;
        const keep = cpuNow; cpuNow = r.cpuQ || null; SFX.coin(); cpuNow = keep;
        break;
      }
      if (e.life <= 0 || e.y < -3) { e.gone = true; e.m.visible = false; }
      e.m.position.set(e.x, e.y, 0); e.m.rotation.y += dt * 9; e.m.visible = !e.gone && (e.life > 1.2 || Math.sin(e.life * 30) > 0);
    }
    // crumbling ledges
    for (const k in w.tiles) {
      const t = w.tiles[k];
      if (t.c !== "C") continue;
      if (t.t > 0 && !t.gone) {
        t.t -= dt;
        t.m.position.x = t.i + Math.sin(w.t * 60) * 0.03;
        if (t.t <= 0) { t.gone = 4.5; w.S.grid[t.j][t.i] = "."; t.fall = 0; }
      } else if (t.gone) {
        t.fall = (t.fall || 0) + dt;
        t.m.position.y = t.j - t.fall * t.fall * 9; t.m.visible = t.fall < 1.2;
        t.gone -= dt;
        const clear = !(p.x + p.c.w / 2 > t.i && p.x - p.c.w / 2 < t.i + 1 && p.y < t.j + 1.1 && p.y + p.hh > t.j);
        if (t.gone <= 0 && clear) { t.gone = 0; t.t = 0; w.S.grid[t.j][t.i] = "C"; t.m.position.set(t.i, t.j, 0); t.m.visible = true; }
        else if (t.gone <= 0) t.gone = 0.1;
      }
    }
    // air bubbles from the vents
    for (const v of w.vents) {
      v.t -= dt;
      if (v.t <= 0) {
        v.t = 2.6;
        const m = new THREE.Mesh(propGeo("bubble"), materials().water); m.renderOrder = 3; w.group.add(m);
        w.bubbles.push({ x: v.x, y: v.y + 0.3, m, life: 7 });
      }
    }
    for (const b of w.bubbles) {
      if (b.gone) continue;
      b.life -= dt; b.y += 1.5 * dt; b.x += Math.sin(w.t * 3 + b.life) * 0.4 * dt;
      if (tile(Math.floor(b.x), Math.floor(b.y + 0.3)) !== "~" || b.life <= 0) { b.gone = true; b.m.visible = false; }
      b.m.position.set(b.x, b.y, 0.1); b.m.scale.setScalar(1 + Math.sin(w.t * 6 + b.life) * 0.06);
    }
    if (w.bubbles.length > 40) w.bubbles = w.bubbles.filter(b => !b.gone);
    for (const d of w.drafts) for (const m of d.motes) { m.position.y += dt * 4.5; if (m.position.y > d.y1) m.position.y = d.y0; m.position.x = d.x0 + 0.5 + Math.sin(m.position.y * 2 + d.x0) * 0.35; }
    // particles
    const P = w.parts, M4 = new THREE.Matrix4(), col = new THREE.Color();
    let n = 0;
    for (const q of P.list) {
      q.life -= dt; if (q.life <= 0) continue;
      q.vy -= 18 * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.z += q.vz * dt;
      const s = q.s * Math.min(1, q.life * 3);
      M4.makeScale(s, s, s); M4.setPosition(q.x, q.y, q.z);
      P.mesh.setMatrixAt(n, M4); P.mesh.setColorAt(n, col.setHex(q.c)); n++;
      if (n >= 320) break;
    }
    P.list = P.list.filter(q => q.life > 0);
    P.mesh.count = n; P.mesh.instanceMatrix.needsUpdate = true; if (P.mesh.instanceColor) P.mesh.instanceColor.needsUpdate = true;
  }
  function burst(x, y, cols, n, sp) {
    if (!world) return;
    for (let k = 0; k < n; k++) world.parts.list.push({ x, y, z: (Math.random() - 0.5) * 0.6, vx: (Math.random() - 0.5) * sp * 2, vy: Math.random() * sp + 1,
      vz: (Math.random() - 0.5) * sp, life: 0.5 + Math.random() * 0.5, s: 0.08 + Math.random() * 0.09, c: cols[k % cols.length] });
  }

  // ---------------------------------------------------------------- the picture
  let camX = 0, camY = 0, shake = 0, stopT = 0, slowT = 0, punch = null;
  let hitStop = s => { if (!cpuNow) stopT = Math.max(stopT, s); };       // (a CPU's hit doesn't freeze your race)
  /* a smash: the world runs at a third of its speed for a moment after the freeze */
  let slowMo = s => { slowT = Math.max(slowT, s); };
  /** In a one-on-one battle, the camera leans in on a big hit: toward (x, y), closer the bigger
      `k` (1 the most), tilting a little, and eases back over `life` seconds. (With three or four
      fighters it keeps still, framing them all.) */
  /* The dynamic camera (one-on-one only): it leans in, tilted, on a moment worth it -- a KO (the
     last, deciding one most of all), the smash or chase that ends a long or heavy combo, a bounce
     deep in one, a parry or a burst in a tight spot -- and then not again for a while (`force`, a
     KO, goes anyway); held inside the arena's walls, so a corner doesn't throw it about. */
  let camCool = 0;
  let camPunch = (x, y, k, life, force) => {
    if (!battle || battle.fs.length !== 2) return;
    if (punch && punch.t < punch.life && k <= punch.k) return;          // one on now, as big or bigger
    if (camCool > 0 && !force) return;                                  // too soon after the last
    life = life || 0.9;
    punch = { x, y, k, life, t: 0, roll: (Math.random() < 0.5 ? -1 : 1) * 0.05 * Math.min(1, k) };
    camCool = life + 2.4;
  };
  /* a tight spot: low on health (on their last life, in Survival) */
  const clutch = q => !!q && q.hp <= q.hpMax * 0.25;
  let shakeCam = s => { if (!cpuNow && (!root.Settings || Settings.get("shake") !== false)) shake = Math.max(shake, s); };   // Options can turn it off
  const CAM_D = 17;
  function snapCamera() { if (!player) return; camX = player.x + 2; camY = Math.max(6.1, player.y + 2.1); }
  const EGG_FLAME = [2, 3, 1, 2, 3, 2, 1, 3, 2, 0, 3, 1, 2, 3, 3, 1, 2, 1, 3, 2, 0, 2, 3, 1];   // big and middling mostly, now and then a gutter
  const EGG_JETS = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1];
  /** The runner's frame, from what they are doing. */
  function drawRunner(p, dt) {
    const c = p.c, a = p.anim, sp = Math.abs(p.vx), id = c.sheet || c.id;
    const airId = srcOf(p, "air"), runId = srcOf(p, "run");
    p.landT = Math.max(0, p.landT - dt); p.dblT = Math.max(0, (p.dblT || 0) - dt);
    p.balT = Math.max(0, (p.balT || 0) - dt); p.catchT = Math.max(0, (p.catchT || 0) - dt); p.grabT = Math.max(0, (p.grabT || 0) - dt);
    const count = nm => framesOf(id, nm).length;
    let name, fps = 10, loop = true, face = p.face, pick = null, spin = 0;   // (spin: turned with a loop's track, its feet on it)
    if (p.ko && battle) {
      /* KO'd: thrown, tumbling; down on the ground, flat out (the hitting-the-ground frames, held on
         the last; for one whose sheet has none, getting up's first, lying there) */
      if (!p.ground) { name = framesOf(id, "back") ? "back" : "out"; fps = 14; loop = true; }
      else if (framesOf(id, "floor")) { name = "floor"; fps = 16; loop = false; }
      else { name = framesOf(id, "getup") ? "getup" : "out"; pick = () => 0; }
    }
    else if (p.dead || p.ko) { name = "out"; fps = 8; loop = false; }
    else switch (p.state) {
      case "hurt": case "stumble":                         // hurt: off a wall, off the floor, flung tumbling, thrown up, or a blow
        name = "hit"; fps = 12; loop = false;
        if (p.state !== "hurt" || !battle) break;
        if (p.wallT > 0 && framesOf(id, "wall")) { name = "wall"; fps = 20; }
        else if (p.floorT > 0 && framesOf(id, "floor")) { name = "floor"; fps = 20; }
        else if (p.smashT > 0 && !p.spike && framesOf(id, "back")) { name = "back"; fps = 16; loop = true; }
        else if (p.juggle && framesOf(id, "up")) { name = "up"; fps = 12; }
        break;
      case "down": name = framesOf(id, "floor") ? "floor" : "out"; fps = 18; loop = false; break;   // knocked down: on the ground
      case "getup": name = framesOf(id, "getup") ? "getup" : "land"; pick = t => Math.min(count(name) - 1, Math.floor(t / GETUP_T * count(name))); break;
      case "blocked": name = framesOf(id, "blocked") ? "blocked" : "hit"; fps = 8; loop = false; break;   // parried, reeling
      case "burst": name = framesOf(id, "guard") ? "guard" : "hit"; pick = () => count(name) - 1; break;
      case "atk": name = p.mv.name; pick = () => Math.floor(p.mv.t * p.mv.fps); break;
      case "special":
        name = p.sp.body;
        pick = p.sp.windup ? () => Math.floor(p.sp.spin || 0) % count(name) : () => Math.floor(p.sp.t * p.sp.fps) % count(name);
        break;
      case "recoil": name = p.ground ? "skid" : "fall"; fps = 12; loop = false; break;   // braced, facing his blast
      case "seek": name = "seek"; fps = 14; loop = false; break;
      case "homing": name = "spin"; fps = 30; break;
      case "charge": name = "rev"; fps = 14 + p.rev * 22; break;              // Sonic's Spin Dash, in their colours
      case "roll": name = "spin"; fps = 12 + sp * 1.4; break;
      case "dash": name = "dash"; fps = 16; loop = !!c.steer; break;              // Gamma's Drive Mode rolls on
      case "crouch": {                                     // the guard; healing; else the landing frames, down to the deepest, held
        if (battle && p.guardT > 0 && framesOf(id, "guard")) { name = "guard"; fps = 20; loop = false; break; }
        if (battle && p.healing && framesOf(id, "heal")) { name = "heal"; const n = count("heal"); pick = t => t < 0.12 || n < 3 ? 0 : 1 + Math.floor(t * 7) % (n - 2); break; }
        const L = framesOf(id, "land"); let k = 0;
        L.forEach((f, j) => { if (f[3] < L[k][3]) k = j; });
        name = "land"; pick = t => Math.min(Math.floor(t * 20), k);
        break;
      }
      case "climb":                                        // Sonic Advance's climb: he faces the wall
        if (p.grabT > 0) { name = "grab"; pick = () => 0; }
        else if (p.vy) { name = "climb"; pick = () => { const n = count("climb"), k = Math.floor(p.y / 0.16); return ((k % n) + n) % n; }; }
        else { name = "cling"; fps = 2.5; }
        break;
      case "ledge": name = "ledge"; pick = () => Math.floor(p.ledge.t / LEDGE_T * count("ledge")); break;
      case "glide": name = "glide"; pick = t => t * 12 < 2 ? Math.floor(t * 12) : 2 + Math.floor(t * 10) % 3; break;
      case "fly":
        if (airId === "tails" && !c.emerl) { name = "fly"; pick = t => 1 + Math.floor(t * (p.flyLeft > 0 ? 16 : 7)) % 4; }
        else if (airId === "cream" && !c.emerl) { name = "fly"; pick = t => p.flyLeft > 0 ? 2 + Math.floor(t * 12) % 3 : 5; }   // her ears flap; tired, held out
        else if (framesOf(id, "fly")) { name = "fly"; fps = airId === "gamma" ? 14 : 10; }                            // Flight Mode, the Egg Mobile's jets
        else { name = "fall"; fps = p.flyLeft > 0 ? 14 : 6; }
        break;
      case "jet": name = "jet"; fps = 14; break;
      case "ride": {                                       // carried: hanging from a cable, crouched on a rail, or a ball (a loop, a pipe, a cannon)
        const k = p.ride && p.ride.R.k, ball = framesOf(id, "spin") ? "spin" : framesOf(id, "fly") ? "fly" : "jump";   // (no ball for Gamma or Eggman: flying, or a jump)
        if (k === "zip") { name = framesOf(id, "jump") ? "jump" : "idle"; loop = false; }
        else if (k === "loop" && framesOf(id, "run")) { name = "run"; fps = 22; face = 1; spin = Math.atan2(p.vy, p.vx); }   // (round a loop on its feet, as Sonic does: up the side, over the top upside down)
        else if (k === "rail" && framesOf(id, "land")) { name = "land"; const L = framesOf(id, "land"); let kk = 0; L.forEach((f, j) => { if (f[3] < L[kk][3]) kk = j; }); pick = () => kk; }
        else { name = ball; fps = 24; }
        break;
      }
      case "psy": name = "airdash"; pick = t => Math.min(count("airdash") - 1, Math.floor(t * 18)); break;
      case "teleport": name = "teleport"; fps = 20; loop = false; break;
      case "dive":
        if (p.dive === "meteor") { name = framesOf(id, "ball") ? "ball" : "sp.airpower"; fps = 30; }
        else { name = c.emerl ? "sp.airpower" : "airpower"; pick = t => p.dive === "drill" ? Math.floor(t * 22) % count(name) : Math.floor(t * 20) % Math.min(count(name), p.dive === "hammer" ? 3 : 4); }
        break;
      case "erupt": name = p.er.body; pick = () => Math.min(p.er.from + Math.floor(p.er.t * p.er.fps), p.er.to); break;
      case "tornado": {
        const T = p.tor; name = T.body;
        pick = () => { const k = Math.floor(T.t * T.fps); return k < T.from ? k : T.from + (k - T.from) % (T.to - T.from + 1); };
        break;
      }
      default:
        if (p.drillT > 0 && framesOf(id, "spin")) { name = "spin"; fps = 32; break; }   // a Yellow Wisp's drill: a ball, boring on
        if (!p.ground) {
          if (p.launchT > 0 && framesOf(id, "launch")) { name = "launch"; pick = t => t < 0.3 ? Math.floor(t * 20) % 3 : Math.min(5, 3 + Math.floor((t - 0.3) * 14)); }
          else if (p.dblT > 0) { name = "double"; fps = 12; loop = false; }
          else if (p.floatT > 0 && input.J && p.vy < 0 && framesOf(id, "airdash")) { name = "airdash"; pick = t => 5 + Math.floor(t * 8) % 4; }   // Silver floats down
          else if (p.balT > 0) { name = "spark"; fps = 16; loop = false; }
          else if (p.catchT > 0 && airId === "rouge" && framesOf(id, "catch")) { name = "catch"; fps = 8; loop = false; }
          else if (p.curl) { name = "spin"; fps = 12 + sp * 1.4; }          // out of a roll: the Spin Dash ball
          else { name = p.vy > 0 ? "jump" : "fall"; loop = false; }
        }
        else if (p.landT > 0) { name = "land"; fps = 22; loop = false; }
        else if (sp < 0.6) { name = "idle"; fps = 7; }
        else if (sp > 4 && (input.R - input.L) && sgn(input.R - input.L) !== sgn(p.vx)) { name = "skid"; fps = 12; loop = false; face = sgn(p.vx); }
        else if (sp < 2.2) name = "start";
        else { name = "run"; fps = runId === "shadow" && !c.emerl ? 8 + sp * 1.7 : 5 + sp * 1.15; }
    }
    /* Eggman's Egg Mobile: its booster (the idle and run frames, the flame off, small, big and
       middling) and its hover jets flicker as an engine does, a new flame every thirtieth of a
       second in no steady order, rather than turning slowly through them */
    if (id === "eggman" && /^(idle|run|start|land|fly)$/.test(name)) {
      if (name === "start") name = "run"; else if (name === "land") name = "idle";
      const seq = name === "fly" ? EGG_JETS : EGG_FLAME, n = count(name);
      pick = () => seq[((Math.floor(world.t * 30) % seq.length) + seq.length) % seq.length] % n;
    }
    if (!framesOf(id, name)) { name = !p.ground && framesOf(id, "jump") ? "jump" : "idle"; pick = null; }   // (a pose this sheet doesn't draw -- a ball, for Gamma or Eggman: the nearest it has)
    const key = name + "|" + p.state;
    if (a.key !== key) { a.key = key; a.t = 0; } else a.t += dt;
    const i = pick ? pick(a.t) : frameAt(count(name), a.t, fps, loop);
    p._rf = [name, i, face];
    const lift = c.lift && !p.dead && !p.ko ? c.lift + Math.sin(world.t * 3.4) * 0.05 : 0;          // Eggman's Egg Mobile, hovering
    /* his jets in the air: the Egg Mobile stays put and only the flames flicker (the frames are
       drawn from the jets' tips, which are longer in some than others) */
    const jets = id === "eggman" && /^(fly|jump|fall)$/.test(name) ? -((framesOf(id, name)[i] || [0, 0, 0, 36])[3] - 36) * PX : 0;
    setFrame(p.spr, name, i, face, p.x, p.y + lift + jets);
    if (spin) {                                                     // (turned about its feet)
      const dx = p.spr.position.x - p.x, dy = p.spr.position.y - p.y, cs = Math.cos(spin), sn = Math.sin(spin);
      p.spr.position.x = p.x + dx * cs - dy * sn; p.spr.position.y = p.y + dx * sn + dy * cs;
    }
    p.spr.rotation.z = spin;
    /* struck: white for an instant, shaking through the freeze-frame */
    const wm = p.whiteT > 0 ? whiteMat(p.spr.userData.who) : null;
    p.whiteT = Math.max(0, (p.whiteT || 0) - dt);
    p.spr.material = wm || sheetMats(p.spr.userData.who).mat;
    if (stopT > 0 && p.state === "hurt" && p.sinceHit < 0.02) { p.spr.position.x += (Math.random() - 0.5) * 0.14; p.spr.position.y += (Math.random() - 0.5) * 0.06; }
    /* KO'd: down a while, then flickering, then gone (till they come back in from above) */
    const koGone = p.ko && battle && (p.koT < 0.12 || (p.koT < 1.1 && Math.sin(world.t * 38) > 0));
    p.spr.visible = !!(!GLIDE[mode] || (demoOn() && world.demo) || (mode === "scene" && world.rival && world.rival.lock)) && !p.out && !koGone && !(p.hideT > 0) && !(p === player && !battle && NP.on && NP.watch) && !(p.inv > 0 && !p.dead && !p.ko && p.state !== "dash" && p.state !== "teleport" && !(p.sp && p.sp.shield) && Math.sin(world.t * 40) > 0.4);
  }
  /* The dust behind a rev: Sonic Advance's spray, looping faster and swelling as the rev
     builds (each tap of Space kicks it up), at the runner's heels, trailing away from them. */
  function drawDust(p, dt) {
    const d = p.dust; if (!d) return;
    const winding = p.state === "special" && p.sp && p.sp.windup && p.ground;
    const on = p.state === "charge" || winding;
    d.visible = !!(on && !p.dead);
    if (!on) { p.dustT = 0; return; }
    const rev = p.state === "charge" ? p.rev : Math.min(1, p.sp.t / p.sp.windup);
    p.revKick = Math.max(0, (p.revKick || 0) - dt * 5);
    p.dustT = (p.dustT || 0) + dt * (12 + rev * 18);
    const n = framesOf(p.c.id, "fx.rev").length;
    setFrame(d, "fx.rev", Math.floor(p.dustT) % n, -p.face, p.x - p.face * 0.62, p.y, false, 0.12, 0.8 + rev * 0.55 + p.revKick * 0.25);
  }
  /* A shot's frames: those it grows in through, its body (the frames at or near its full
     size), and those it dies away through. */
  const SHOT_ANIM = {};
  function shotAnim(who, fx) {
    const key = who + "|" + fx; if (SHOT_ANIM[key]) return SHOT_ANIM[key];
    const L = framesOf(who, fx) || [[0, 0, 1, 1]], area = L.map(f => f[2] * f[3]), big = Math.max(...area);
    let a = area.findIndex(v => v >= big * 0.6), b = L.length - 1;
    while (b > a && area[b] < big * 0.6) b--;
    return (SHOT_ANIM[key] = { n: L.length, a: Math.max(0, a), b });
  }
  /* Like the Egg Mobile's booster, a shot flickers: it grows in, then a new frame of its body
     every thirtieth of a second in no steady order (now and then a frame dropped), and if it
     runs out unspent, it dies away through its last frames. */
  function shotFrame(s) {
    const A = shotAnim(s.who, s.fx), tick = Math.floor(s.t * 30);
    const flick = (a, b) => {                             // a new one each tick, never the same twice running
      const len = b - a + 1;
      if (tick !== s.ft) { s.ft = tick; let r = Math.floor(Math.random() * len); if (len > 1 && r === s.fi) r = (r + 1) % len; s.fi = r; }
      return a + Math.min(s.fi, len - 1);
    };
    if (s.range) return flick(s.range[0], s.range[1]);   // a part of the row (Eggman's missile)
    const out = A.n - 1 - A.b;
    if (tick < A.a) return tick;
    if (out > 0 && !s.loop && s.life < out / 30) return Math.min(A.n - 1, A.b + 1 + Math.floor((out / 30 - s.life) * 30));
    return flick(A.a, A.b);
  }
  /* Shots, effects and traps, each at its frame. A trap about to go off blinks. */
  function drawCards() {
    const w = world;
    for (const s of w.shots) if (!s.gone) {
      if (s.seed == null) s.seed = Math.floor(Math.random() * 24);
      setFrame(s.card, s.fx, shotFrame(s), s.face, s.x, s.y, s.mid, 0.2, s.k || s.ghost);
      const tick = Math.floor(s.t * 30) + s.seed;
      s.card.visible = !(s.t > 0.07 && tick % 6 === 0);                                          // a dropped frame now and then
    }
    for (const e of w.fx) if (!e.gone) { e.card.visible = e.t >= 0; if (e.t >= 0) setFrame(e.card, e.name, e.from + Math.floor(e.t * e.fps), e.face, e.x, e.y, e.mid, e.mid ? 0.25 : 0.04, e.k); }
    for (const t of w.traps) if (!t.gone) {
      const n = framesOf(t.who, "fx.trap").length, k = Math.floor(t.t * 8);
      let name = "fx.trap", i = t.who === "amy" ? Math.min(k, n - 1) : t.who === "rouge" ? (k < 3 ? k : 3 + (k - 3) % (n - 3)) : k % n;
      /* Sonic Cracker tumbles as it goes down, settles, then sits armed, blinking, till it goes */
      const set = framesOf(t.who, "fx.trapset");
      if (set && t.grounded) {
        const since = t.t - (t.landT || 0);
        if (since < n / 12) i = Math.min(Math.floor(since * 12), n - 1);
        else { name = "fx.trapset"; i = Math.floor(since * 8) % set.length; }
      }
      const L = TRAP_LOOK[t.who];
      if (L && !set) { const a = L.from || 0, lp = L.loop || [a, n - 1], j = a + k; i = j < lp[0] ? j : lp[0] + (j - lp[0]) % (lp[1] - lp[0] + 1); }
      if (L && L.rest != null && t.grounded) i = L.rest;
      setFrame(t.card, name, i, t.face, t.x, t.y, t.flies || t.kind === "orbit", 0.15, L && L.k);
      t.card.visible = !(t.life < 1.6 && Math.sin(t.t * 30) > 0.3);
    }
  }
  function draw(dt) {
    const p = player, w = world;
    if (battle) {                                          // everyone in the fight, each with their own hands
      for (const f of battle.fs) { input = f.inp; drawRunner(f, dt); drawDust(f, dt); drawAura(f, dt); }
      input = INPUT0;
    } else {
      drawRunner(p, dt); drawDust(p, dt); drawAura(p, dt);
      if (CPUS.length) { const keep = input; for (const q of CPUS) { input = q.D.inp; drawRunner(q.p, dt); drawDust(q.p, dt); drawAura(q.p, dt); } input = keep; }   // the CPU runners, each with its own hands
      if (NP.on && NP.ghosts.size) npDrawGhosts(dt);
    }
    drawCards();
    for (const f of battle ? battle.fs : [p].concat(CPUS.filter(q => Math.abs(q.p.x - camX) < 30).map(q => q.p))) {
      if (f.out || f.ko) continue;
      if (f.star > 0 && Math.random() < (ITEMS ? 0.15 : 0.5)) burst(f.x, f.y + Math.random() * f.hh, [0xffffff, 0x9ad8ff, 0xfff070], 1, 1);
      if (f.drillT > 0 && Math.random() < 0.8) burst(f.x + f.face * 0.55, f.y + 0.45, [0xffd23a, 0xffffff, 0xc89a0a], 1, 3);    // drilling: sparks off the point
      if (f.slowT > 0 && Math.random() < 0.3) burst(f.x, f.y + Math.random() * f.hh, [0xb060f0, 0x6a20b0], 1, 1);             // slowed by a void
      if ((Math.abs(f.vx) > 13 || f.speedT > 0) && f.ground && Math.random() < (f.speedT > 0 ? 0.8 : 0.4)) burst(f.x - f.face * 0.3, f.y + 0.05, [0xd8d0c0, 0xffffff], 1, 1.5);
    }
    // the rings spin, all together, as they do
    const M4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s1 = new THREE.Vector3(1, 1, 1), s0 = new THREE.Vector3(0, 0, 0), pos = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
    for (const k of w.carrots) {
      q.setFromAxisAngle(up, w.t * 3.2);
      pos.set(k.x, k.y + 0.12 + Math.sin(w.t * 3 + k.k) * 0.08, 0);
      M4.compose(pos, q, k.got ? s0 : s1);
      w.carrotMesh.setMatrixAt(k.k, M4);
    }
    w.carrotMesh.instanceMatrix.needsUpdate = true;
    for (const k of w.checks) if (k.spin > 0) { k.spin = Math.max(0, k.spin - dt); k.m.rotation.y = (1 - k.spin) * PI * 4; }
    if (w.zones && w.zones.length) zonesDraw(w, dt);
    if (w.goal && w.goal.spin > 0) { w.goal.spin = Math.max(0, w.goal.spin - dt); w.goal.m.rotation.y += dt * (2 + w.goal.spin * 14); if (!w.goal.spin) w.goal.m.rotation.y = 0; }
    for (const e of w.ents) if (e.t === "spring" || e.t === "dspring") { e.sq = Math.max(0, e.sq - dt * 2.6); springPose(e); }
      else if (e.t === "bumper") { e.sq = Math.max(0, e.sq - dt * 5); e.m.scale.set(1 + e.sq * 0.3, 1 + e.sq * 0.3, 1); }
      else if (e.t === "balloon") { e.m.position.y = e.y + Math.sin(w.t * 2.2 + e.x) * 0.12; e.m.rotation.z = Math.sin(w.t * 1.3 + e.x) * 0.12; }
    for (const s of w.shoes) if (!s.got) { s.m.rotation.y = w.t * 2.6; s.m.position.y = s.y + Math.sin(w.t * 2.5 + s.x) * 0.12; }
    for (const e of w.enemies) {
      if (e.fling) {                                       // shaking through the freeze-frame, then spinning away
        drawBadnik(e);
        const j = stopT > 0 ? 0.09 : 0;
        e.m.position.x += (Math.random() - 0.5) * j; e.m.position.y += (Math.random() - 0.5) * j * 0.5;
        e.m.rotation.z = e.fling.rot;
        continue;
      }
      if (e.alive && Math.abs(e.x - camX) < 30) drawBadnik(e);
    }
    drawEnemyShots();
    if (w.snow) {
      const a = w.snow.geometry.attributes.position;
      for (let k = 0; k < a.count; k++) {
        let y = a.getY(k) - dt * 1.6, x = a.getX(k) + Math.sin(w.t + k) * dt * 0.4;
        if (y < camY - 8) y += 18;
        a.setXY(k, x, y);
      }
      a.needsUpdate = true; w.snow.position.x = camX - 0;
    }
    for (const f of w.far.userData.anim) f(w.t);
    buildAhead(w);
    if (w.goal && w.goal.fire) fireworks(dt);
    // the camera
    const aspect = R.domElement.width / Math.max(1, R.domElement.height);
    /* a tall phone screen backs the camera off until twelve metres of the stage fit across */
    let D = clamp(12.5 / (2 * Math.tan(17 * PI / 180) * aspect), CAM_D, 42);
    if (!battle && demoOn() && world.demo) D = Math.max(D, Math.min(D * 2, 36));   // the title's demo: far off, behind the strip (an upright phone is far off already)
    if (battle) D = battleView(aspect, dt);              // a battle frames everyone in it
    else {
      const halfW = Math.tan(17 * PI / 180) * D * aspect, halfH = Math.tan(17 * PI / 180) * D;
      const lead = clamp(p.vx * 0.28, -4.5, 4.5) + p.face * 1.2;
      let tx = clamp(p.x + lead, halfW - 0.5, w.W - halfW + 0.5);
      w.viewHalfW = halfW;
      if (w.boss && w.boss.lock) tx = bossCamX(w.boss, halfW);           // a boss's arena: the camera holds on it
      if (w.rival && w.rival.lock) tx = clamp((w.rival.x + p.x) / 2, w.rival.a0 + halfW - 1, w.rival.a1 - halfW + 1);   // a meeting: on the two of them
      let ty = clamp(p.y + 2.1, p.y < 3.5 ? 3.8 : 6.1, H - 3.2);             // lower when she is down in the water
      if (demoOn() && world.demo) ty = p.y + 0.6 - (mode === "title" ? demoBand(dt) : -0.1) * halfH;   // the demo's runner: in the open, between the logo and the strip
      if (D > CAM_D) ty = Math.max(ty, halfH - 3);
      camX = lerp(camX, tx, 1 - Math.exp(-dt * 3.6));
      camY = lerp(camY, ty, 1 - Math.exp(-dt * (p.ground ? 4 : 1.8)));
    }
    /* a big hit in a battle: the camera leans in on it fast, tilted, then eases back */
    let cx = camX, cy = camY, roll = 0;
    if (camCool > 0) camCool -= dt;
    if (punch) {
      punch.t += dt;
      const u = punch.t / punch.life;
      if (u >= 1 || !battle) punch = null;
      else {
        const e0 = u < 0.16 ? u / 0.16 : u < 0.45 ? 1 : 1 - (u - 0.45) / 0.55, e = e0 * e0 * (3 - 2 * e0);   // in, held, out
        D *= 1 - 0.3 * Math.min(1.25, punch.k) * e; cx = lerp(camX, punch.x, 0.5 * e); cy = lerp(camY, punch.y, 0.4 * e); roll = punch.roll * e;
        const hw = Math.tan(17 * PI / 180) * D * aspect;                // (not past the arena's walls)
        if (hw * 2 < w.W) cx = clamp(cx, hw - 0.5, w.W - hw + 0.5);
      }
    }
    camera.position.set(cx, cy + 1.9, D);
    if (shake > 0) {                                       // a blast shakes the picture, briefly
      shake = Math.max(0, shake - dt);
      camera.position.x += (Math.random() - 0.5) * shake * 1.6; camera.position.y += (Math.random() - 0.5) * shake * 1.6;
    }
    camera.lookAt(cx, cy, 0);
    if (roll && (!root.Settings || Settings.get("shake") !== false)) camera.rotateZ(roll);
    if (w.snow) w.snow.position.set(camX, 0, 0);
    sun.position.set(camX + w.T.sun[2][0], w.T.sun[2][1], w.T.sun[2][2]);
    sun.target.position.set(camX, camY - 2, 0);
    if (battle) placeTags();
    if (w.boss) drawBoss();
    if (w.rival) drawRival();
    R.render(scene, camera);
  }

  // ---------------------------------------------------------------- Eggman's bosses
  /* Each zone's Act 2 ends in Eggman's arena (E in the stage marks where it starts). Run in and it
     shuts behind you, the camera holds still, and the boss comes in. Every boss is the zone's own
     from the Sonic Advance games (adventure-bosses.js, tools/pack-bosses.py), doing what it does
     there, as far as the guides and the Sonic wikis tell it:
       hammer   Egg Hammer Tank (Advance): drives to and fro, its hammer going round in front;
                hit the cockpit from above or behind. Hurt, it hops, the hammer slamming down.
       aero     Aero Egg (Advance 2): flies over, dropping bombs that burst into flame; swoops
                low now and then, and that is the time to hit it.
       cube     Egg Cube (Advance 3): rises over you and slams down; throws a spiked mace that
                bounces at you, and sends out toy soldiers.
       mecha    Mecha Knuckles (Advance): Knuckles to look at, till it is hurt -- walks, punches,
                glides, spin-dashes; then its own silver, and missiles from afar.
       ball     Egg Ball (Advance): goes from tube to tube while a spiked ball runs between them.
       bomber   Egg Bomber Tank (Advance 2), a chase: it drives off down the road, firing back
                shells that burst into flame; catch it up and hit it.
       totem    Egg Totem (Advance 2): rolls to and fro on its electric spring, firing spiked bars
                low and high; the cockpit on top is the place to hit.
       spider   Egg Spider (Advance): hangs from the ceiling, drops icicles, and comes down to
                stamp; hit it low.
       press    Egg Press (Advance): bounds on its spring; a big jump shakes the ground on landing
                (be in the air); the cockpit on top is the place to hit, never the spring.
       hammer3  Gemerl first (Advance 3: stands, then dashes across; hit him standing, four
                times), then the Egg Hammer 3, its hammer on a chain, slamming down.
       snake    Egg Snake (Advance): two spiked balls going round it on chains; its top opens
                and shuts -- hit it open; it fires.
       saucer   Egg Saucer (Advance 2), a chase: the great ring flies on ahead, its giant fists
                slamming the road; it dips low after, and the cockpit in the ring can be hit.
       frog     Egg Frog (Advance 2): leaps from side to side, shaking the floor where it lands;
                breathes flame and fires; hit it when it is down.
     Eight hits (Gemerl four first), each a flash and a moment untouchable; past half, the boss
     fights harder. Then it blows apart, Eggman gets away in the Egg Mobile, and a capsule drops:
     jump on it and the animals go free -- the zone is clear. Going down in the arena puts the
     runner back at the Star Post before it, and the boss back as it was. */
  const BSH = root.AdventureBosses || null;
  if (BSH) SHEETS.bosses = BSH;
  const BOSS = {
    hammer: { name: "Egg Hammer Tank", hp: 8, k: 1.1 },
    aero: { name: "Aero Egg", hp: 8, k: 1 },
    cube: { name: "Egg Cube", hp: 8, k: 0.95 },
    mecha: { name: "Mecha Knuckles", hp: 8, k: 1.12 },
    ball: { name: "Egg Ball", hp: 8, k: 1.05 },
    bomber: { name: "Egg Bomber Tank", hp: 8, k: 1, chase: true },
    totem: { name: "Egg Totem", hp: 8, k: 0.9 },
    spider: { name: "Egg Spider", hp: 8, k: 1.05 },
    press: { name: "Egg Press", hp: 8, k: 0.95 },
    hammer3: { name: "Egg Hammer 3", hp: 8, k: 1.1, gemerl: 4 },
    snake: { name: "Egg Snake", hp: 8, k: 1 },
    saucer: { name: "Egg Saucer", hp: 8, k: 0.85, chase: true },
    frog: { name: "Egg Frog", hp: 8, k: 1.05, music: "finale" },
  };
  const ROAD_LEN = 360, BOSS_W = 18;
  const ovl = (A, B) => A[0] < B[1] && A[1] > B[0] && A[2] < B[3] && A[3] > B[2];
  const fr = name => (BSH && BSH.f[name]) || [[0, 0, 1, 1, 0, 0]];
  /* a sprite's size in metres, at the boss's scale */
  const bw = (b, name, i) => fr(name)[i || 0][2] * PX * b.C.k, bh = (b, name, i) => fr(name)[i || 0][3] * PX * b.C.k;
  /* the animal capsule stands the same height after every boss, low enough for anyone's plain
     jump to land on its top (the lowest, Knuckles' and Chaos', peaks about 2.1 m up) */
  const CAP_H = 1.75, capK = b => CAP_H / bh(b, "flee.capsule");

  function newBoss(key, w) {
    const C = BOSS[key], x0 = w.arena.x0, chase = !!C.chase;
    const a0 = chase ? x0 : x0 + 11, a1 = chase ? x0 + ROAD_LEN : x0 + 11 + BOSS_W;
    return { key, C, x0, a0, a1, gy: w.arena.y, state: "wait", mode: "in", t: 0, t2: 0, at: 1.2, hp: C.hp, gem: C.gemerl || 0,
             x: a1 + 4, y: w.arena.y, vx: 0, vy: 0, face: -1, inv: 0, cards: {}, shots: [], fires: [], booms: [], camX: a0, lock: false, n: 0 };
  }
  function resetBoss(b) {
    for (const k in b.cards) world.group.remove(b.cards[k]);
    const nb = newBoss(b.key, world);
    world.boss = nb; music();
    return nb;
  }
  /* into the arena: it shuts, the camera holds, the boss comes */
  function lockArena(b) {
    b.lock = true; b.state = "fight"; b.mode = "in"; b.t = 0; b.camX = b.C.chase ? player.x + 3 : (b.a0 + b.a1) / 2;
    if (b.C.chase) { b.x = player.x + 14; b.y = b.gy; }
    sheetMats("bosses").mat.color.setHex(world.T.tint || 0xffffff);
    music();
    hudToast(b.gem ? "Gemerl!" : b.C.name);
    SFX.bossIn();
  }
  const pinchOf = b => b.hp <= b.C.hp / 2;
  function bossHit(b, p) {
    if (b.inv > 0) return;
    b.inv = 0.9;
    if (b.gem > 0) { b.gem--; if (!b.gem) { b.mode = "gemout"; b.t2 = 0; music(); } }
    else { b.hp--; if (b.C.chase && b.hp === Math.floor(b.C.hp / 2)) music(); }       // a chase's second phase has its own theme
    hitSpark(p.x + sgn(b.x - p.x) * 0.4, p.y + p.hh * 0.6, 1.5, 0xffffff); hitStop(0.07); shakeCam(0.14); SFX.bossHit();
    p.vx = -(sgn(b.x - p.x) || p.face) * 7; p.vy = Math.max(p.vy, 9); p.ground = false; p.airMove = false; p.airUses = 0;
    if (p.state === "homing" || p.state === "seek" || p.state === "dash" || p.state === "roll" || p.state === "glide") p.state = "run";
    p.curl = true;
    if (b.hp <= 0 && !b.gem) { b.state = "boom"; b.t = 0; b.shots.length = 0; b.fires.length = 0; SFX.boom(); }
  }
  /* a blow, a shot or a blast that reaches its weak spot (strike) */
  function bossStrike(x0, x1, y0, y1) {
    const b = world.boss;
    if (!b || b.state !== "fight" || b.inv > 0) return 0;
    const wk = BRAIN[b.key].weak(b);
    if (!wk || !ovl([x0, x1, y0, y1], wk)) return 0;
    bossHit(b, player);
    return 1;
  }
  /* a shot: falls if it has weight, bursts or bounces where it meets the floor */
  function bshot(b, o) { b.shots.push(Object.assign({ x: b.x, y: b.y + 1, vx: 0, vy: 0, g: 0, r: 0.35, life: 6, t: 0, fps: 12, mid: true }, o)); }
  function bfire(b, x, h, life) { b.fires.push({ x, t: 0, h: h || 1.8, life: life || 1.1 }); SFX.fire(); }
  function quake(b, x, range) {
    shakeCam(0.3); impact(x, b.gy, { c: 0xd8c8a8, flash: 1.2, shake: 0.2 }); SFX.quake();
    burst(x, b.gy + 0.1, [0xd8d0c0, 0xb0a890], 18, 6);
    const p = player;
    if (p.ground && Math.abs(p.x - x) < range) hurt(p, x);
  }
  const toward = (b, p) => (sgn(p.x - b.x) || b.face);

  /* each boss's mind: step, its weak spot, what hurts, and how it is drawn */
  const BRAIN = {
    hammer: {
      step(b, dt, p, pn) {
        const sp = pn ? 3.6 : 2.4;
        if (b.mode === "in") { b.x -= 5 * dt; b.face = -1; if (b.x <= b.a1 - 3) b.mode = "drive"; return; }
        if (b.mode === "drive") {
          b.x += b.face * sp * dt;
          if (b.x < b.a0 + 2.2) { b.x = b.a0 + 2.2; b.face = 1; } if (b.x > b.a1 - 2.2) { b.x = b.a1 - 2.2; b.face = -1; }
          b.at -= dt;
          if (pn && b.at <= 0 && Math.abs(p.x - b.x) < 6) { b.mode = "hop"; b.vy = 9; b.at = 2.6; }
        } else if (b.mode === "hop") {
          b.vy -= GRAV * dt; b.y += b.vy * dt; b.x += b.face * 1.5 * dt;
          if (b.y <= b.gy) { b.y = b.gy; b.mode = "drive"; quake(b, b.x + b.face * 1.6, 3.2); }
        }
      },
      weak(b) { const p = player, w = bw(b, "hammer.body"), h = bh(b, "hammer.body");
        const above = p.y > b.y + h * 0.55, behind = sgn(p.x - b.x) === -b.face;
        return above || behind ? [b.x - w * 0.42, b.x + w * 0.42, b.y + h * 0.3, b.y + h + 0.3] : null; },
      harm(b) { const w = bw(b, "hammer.body"), h = bh(b, "hammer.body"), f = b.face;
        return [[Math.min(b.x + f * w * 0.15, b.x + f * (w * 0.5 + 0.7)), Math.max(b.x + f * w * 0.15, b.x + f * (w * 0.5 + 0.7)), b.y, b.y + h * 0.8],
                [b.x - w * 0.45, b.x + w * 0.45, b.y, b.y + h * 0.35]]; },
      draw(b, show) { show("body", "hammer.body", Math.floor(world.t * 7) % 3, b.face, b.x, b.y, false, true); },
    },
    aero: {
      step(b, dt, p, pn) {
        const hi = b.gy + 2.8, lo = b.gy + 1.1;
        if (b.mode === "in") { b.x -= 6 * dt; b.y = hi; if (b.x <= b.a1 - 3) { b.mode = "fly"; b.at = 1.2; b.t2 = 0; } return; }
        b.t2 += dt;
        if (b.mode === "fly") {
          b.x += b.face * (pn ? 4.2 : 3) * dt;
          if (b.x < b.a0 + 1.5) b.face = 1; if (b.x > b.a1 - 1.5) b.face = -1;
          b.y = lerp(b.y, hi + Math.sin(b.t2 * 2) * 0.3, 1 - Math.exp(-dt * 3));
          b.at -= dt;
          if (b.at <= 0) { bshot(b, { name: "aero.bomb", y: b.y, vx: b.face * 1, g: 14, r: 0.3, land: "fire", fps: 10 }); b.at = pn ? 0.9 : 1.5; b.n++; }
          if (b.n >= (pn ? 4 : 3)) { b.mode = "swoop"; b.n = 0; b.t2 = 0; b.face = toward(b, p); }
        } else if (b.mode === "swoop") {
          b.y = lerp(b.y, lo, 1 - Math.exp(-dt * 4)); b.x += b.face * 2.2 * dt;
          if (b.x < b.a0 + 1.5) b.face = 1; if (b.x > b.a1 - 1.5) b.face = -1;
          if (b.t2 > 2.6) { b.mode = "fly"; b.at = 0.8; }
        }
      },
      weak(b) { const w = bw(b, "aero.body"), h = bh(b, "aero.body"); return [b.x - w * 0.45, b.x + w * 0.45, b.y, b.y + h]; },
      harm(b) { const w = bw(b, "aero.body"); return [[b.x - w * 0.2, b.x + w * 0.2, b.y - 0.4, b.y]]; },
      draw(b, show) { show("body", "aero.body", Math.floor(world.t * 10) % 3, b.face, b.x, b.y, false, true); },
    },
    cube: {
      step(b, dt, p, pn) {
        const top = b.gy + 5.5;
        if (b.mode === "in") { b.y = top; b.x -= 6 * dt; if (b.x <= b.a1 - 3) { b.mode = "hover"; b.t2 = 0; } return; }
        b.t2 += dt;
        if (b.mode === "hover") {
          b.y = lerp(b.y, top, 1 - Math.exp(-dt * 4)); b.x = lerp(b.x, clamp(p.x, b.a0 + 1.5, b.a1 - 1.5), 1 - Math.exp(-dt * (pn ? 2.6 : 1.8)));
          if (b.t2 > (pn ? 1.3 : 1.9)) { b.mode = "drop"; b.vy = 0; }
        } else if (b.mode === "drop") {
          b.vy -= GRAV * 1.4 * dt; b.y += b.vy * dt;
          if (b.y <= b.gy) { b.y = b.gy; b.mode = "sit"; b.t2 = 0; quake(b, b.x, 2.6); b.n++;
            if (b.n % 2 === 0) bshot(b, { name: "cube.mace", x: b.x + toward(b, p) * 1.2, y: b.gy + 0.8, vx: toward(b, p) * (pn ? 6 : 4.5), vy: 7, g: GRAV * 0.8, r: 0.6, bounce: 0.8, life: 4, fps: 10 });
            else for (const d of [-1, 1]) bshot(b, { name: "cube.soldier", x: b.x + d * 1.2, y: b.gy, vx: d * 2.2, g: 0, r: 0.4, walker: true, life: 5, fps: 8, mid: false }); }
        } else if (b.mode === "sit") { if (b.t2 > 1.6) { b.mode = "hover"; b.t2 = 0; } }
      },
      weak(b) { const w = bw(b, "cube.body"), h = bh(b, "cube.body"); return b.mode === "sit" ? [b.x - w * 0.5, b.x + w * 0.5, b.y, b.y + h] : null; },
      harm(b) { const w = bw(b, "cube.body"), h = bh(b, "cube.body"); return b.mode === "drop" || b.mode === "hover" ? [[b.x - w * 0.45, b.x + w * 0.45, b.y, b.y + h]] : []; },
      draw(b, show) { show("body", b.mode === "sit" ? "cube.body" : "cube.dark", b.mode === "sit" ? 2 : Math.floor(world.t * 6) % 2, 1, b.x, b.y, false, true); },
    },
    mecha: {
      step(b, dt, p, pn) {
        const sp = pn ? 1.35 : 1;
        if (b.mode === "in") { b.x -= 3 * dt; b.face = -1; if (b.x <= b.a1 - 3) { b.mode = "walk"; b.at = 1.2; } return; }
        b.t2 += dt; b.at -= dt;
        switch (b.mode) {
          case "walk":
            b.face = toward(b, p); b.x += b.face * 2.6 * sp * dt;
            if (Math.abs(p.x - b.x) < 1.5 && Math.abs(p.y - b.y) < 1.5) { b.mode = "punch"; b.t2 = 0; }
            else if (b.at <= 0) {
              const r = Math.random(); b.t2 = 0; b.at = 1.5 / sp;
              if (pn && Math.abs(p.x - b.x) > 5 && r < 0.45) b.mode = "shoot";
              else if (r < 0.6) { b.mode = "jump"; b.vy = 12.5; b.vx = b.face * 2.5; }
              else b.mode = "spin";
            }
            break;
          case "punch": if (b.t2 > 0.65) { b.mode = "walk"; b.at = 0.9; } break;
          case "jump": b.vy -= GRAV * dt; b.y += b.vy * dt; b.x += b.vx * dt; if (b.vy < 1) { b.mode = "glide"; b.face = toward(b, p); } break;
          case "glide": b.x += b.face * 7 * sp * dt; b.y -= 1.4 * dt;
            if (b.y <= b.gy || b.x <= b.a0 + 0.6 || b.x >= b.a1 - 0.6) { b.mode = "fall"; b.vy = 0; } break;
          case "fall": b.vy -= GRAV * dt; b.y += b.vy * dt; if (b.y <= b.gy) { b.y = b.gy; b.mode = "land"; b.t2 = 0; } break;
          case "land": if (b.t2 > 0.7) { b.mode = "walk"; b.at = 1; } break;
          case "spin": if (b.t2 > 0.45) b.x += b.face * 11 * sp * dt; if (b.t2 > 1.4 || b.x <= b.a0 + 0.6 || b.x >= b.a1 - 0.6) { b.mode = "land"; b.t2 = 0.25; } break;
          case "shoot": if (b.t2 > 0.35 && !b.fired) { b.fired = true; SFX.missile();
              bshot(b, { name: "mecha.missile", y: b.y + 0.7, vx: b.face * 8, r: 0.35, home: 1.6, life: 2.4, fps: 14 }); }
            if (b.t2 > 0.9) { b.mode = "walk"; b.fired = false; b.at = 1.2; } break;
        }
        b.x = clamp(b.x, b.a0 + 0.6, b.a1 - 0.6);
        if (b.mode !== "jump" && b.mode !== "glide" && b.mode !== "fall") b.y = b.gy;
      },
      weak(b) { return /^(walk|land|punch|shoot)$/.test(b.mode) ? [b.x - 0.45, b.x + 0.45, b.y, b.y + 1.3] : null; },
      harm(b) {
        if (b.mode === "punch" && b.t2 > 0.2 && b.t2 < 0.5) return [[Math.min(b.x, b.x + b.face * 1.4), Math.max(b.x, b.x + b.face * 1.4), b.y + 0.3, b.y + 1.1]];
        if (/^(glide|spin|jump)$/.test(b.mode)) return [[b.x - 0.6, b.x + 0.6, b.y, b.y + 1.1]];
        return [];
      },
      draw(b, show) {
        const m = pinchOf(b) ? "mecha.m" : "mecha.", t = world.t;
        const [n, i] = b.mode === "walk" || b.mode === "in" ? ["walk", Math.floor(t * 10) % 5] : b.mode === "punch" ? ["punch", Math.min(3, Math.floor(b.t2 * 8))] :
          b.mode === "glide" ? ["glide", Math.floor(t * 8) % 2] : b.mode === "jump" || b.mode === "spin" || b.mode === "fall" ? ["ball", Math.floor(t * 16) % 4] : ["stand", Math.floor(t * 3) % 2];
        show("body", m + n, i, b.face, b.x, b.y, false, true);
      },
    },
    ball: {
      step(b, dt, p, pn) {
        const L = b.a0 + 2, R = b.a1 - 2, sp = pn ? 1.4 : 1;
        if (b.mode === "in") { b.x = R; b.y = b.gy - 2; b.mode = "rise"; b.t2 = 0; b.side = 1; return; }
        b.t2 += dt;
        if (b.mode === "rise") { b.y = lerp(b.y, b.gy + 2.6, 1 - Math.exp(-dt * 5)); if (b.t2 > 0.8) { b.mode = "arc"; b.t2 = 0; b.from = b.x; b.to = b.side > 0 ? L : R; b.peak = 2.2 + Math.random() * 2.2; } }
        else if (b.mode === "arc") {
          const T = 2.2 / sp, u = Math.min(1, b.t2 / T);
          b.x = lerp(b.from, b.to, u); b.y = b.gy + 2.6 + Math.sin(u * PI) * b.peak;
          if (u >= 1) { b.mode = "sink"; b.t2 = 0; b.side = -b.side; }
        } else if (b.mode === "sink") { b.y = lerp(b.y, b.gy - 2, 1 - Math.exp(-dt * 5)); if (b.t2 > 0.9) { b.mode = "rise"; b.t2 = 0; } }
        b.at -= dt;
        if (b.at <= 0) {                                     // the spiked ball: out of one tube, low or high, into the other
          const fromR = Math.random() < 0.5, high = Math.random() < 0.4;
          bshot(b, { name: "ball.spike", x: fromR ? R : L, y: b.gy + (high ? 2.4 : 0.55), vx: (fromR ? -1 : 1) * (pn ? 7.5 : 5.5), r: 0.6, life: 3.6, fps: 8 });
          b.at = pn ? 1.6 : 2.4;
        }
      },
      weak(b) { return b.mode === "arc" ? [b.x - 0.7, b.x + 0.7, b.y - 0.8, b.y + 0.8] : null; },
      harm(b) { return []; },
      draw(b, show) {
        for (const [k, x] of [["tl", b.a0 + 2], ["tr", b.a1 - 2]]) for (let s = 0; s < 3; s++) show(k + s, "ball.tube", 0, 1, x, b.gy + s * bh(b, "ball.tube"), false);
        if (b.y > b.gy - 0.5) show("body", "ball.body", Math.floor(world.t * 6) % 2, b.face, b.x, b.y, true, true);
      },
    },
    bomber: {
      step(b, dt, p, pn) {
        const v = pn ? 8.4 : 7.2, end = b.a1 - 14;
        if (b.mode === "in") { b.mode = "drive"; b.at = 1.5; }
        if (b.x < end) { b.x += v * dt; b.face = 1; } else b.x = end;
        b.camX = Math.min(b.x - 3.5, end - 3.5);
        if (p.x > b.x - 0.8) b.x = Math.min(end, b.x + (p.x - b.x + 0.8) * dt * 4);
        b.at -= dt;
        if (b.at <= 0) {
          SFX.shot(); b.at = pn ? 1.1 : 1.7;
          bshot(b, { name: "bomber.ball", x: b.x - 1.2, y: b.y + 1.9, vx: -(3 + Math.random() * 3), vy: 7, g: GRAV * 0.7, r: 0.35, land: "fire", fps: 10 });
        }
      },
      weak(b) { const w = bw(b, "bomber.body"), h = bh(b, "bomber.body"); return [b.x - w * 0.45, b.x + w * 0.3, b.y + h * 0.35, b.y + h]; },
      harm(b) { const w = bw(b, "bomber.body"), h = bh(b, "bomber.body"); return [[b.x - w * 0.45, b.x + w * 0.45, b.y, b.y + h * 0.35]]; },
      draw(b, show) { show("body", b.inv > 0.6 ? "bomber.flash" : "bomber.body", Math.floor(world.t * 8) % 3, -b.face, b.x, b.y, false, true); },
    },
    totem: {
      step(b, dt, p, pn) {
        if (b.mode === "in") { b.x -= 3 * dt; b.face = -1; if (b.x <= b.a1 - 3) { b.mode = "roll"; b.at = 1.4; } return; }
        b.x += b.face * (pn ? 2.2 : 1.4) * dt;
        if (b.x < b.a0 + 1.5) b.face = 1; if (b.x > b.a1 - 1.5) b.face = -1;
        b.at -= dt;
        if (b.at <= 0) {
          const d = toward(b, p), high = (b.n++ % (pn ? 2 : 3)) === 2 || (pn && Math.random() < 0.4);
          bshot(b, { name: "totem.bar", x: b.x + d * 1.2, y: b.gy + (high ? 1.7 : 0.45), vx: d * (pn ? 7 : 5.5), r: 0.5, w: 1.2, life: 3.5, fps: 12 });
          b.at = pn ? 1.2 : 1.8; SFX.shot();
        }
        b.zap = (b.at < 0.5);
      },
      weak(b) { const w = bw(b, "totem.body"), h = bh(b, "totem.body"); return [b.x - w * 0.5, b.x + w * 0.5, b.y + h * 0.72, b.y + h + 0.3]; },
      harm(b) { const w = bw(b, "totem.body"), h = bh(b, "totem.body"); return [[b.x - w * 0.42, b.x + w * 0.42, b.y, b.y + h * (b.zap ? 0.72 : 0.25)]]; },
      draw(b, show) { const h = bh(b, "totem.body"); show("body", "totem.body", Math.floor(world.t * 8) % 3, b.face, b.x, b.y, false, true);
        if (b.zap) show("zap", "totem.spark", Math.floor(world.t * 20) % 5, 1, b.x, b.y + h * 0.48, true); },
    },
    spider: {
      step(b, dt, p, pn) {
        const hang = b.gy + 3.6, low = b.gy + 0.9;
        if (b.mode === "in") { b.x = (b.a0 + b.a1) / 2; b.y = b.gy + 9; b.mode = "down"; return; }
        b.t2 += dt;
        if (b.mode === "down") { b.y = lerp(b.y, hang, 1 - Math.exp(-dt * 3)); if (Math.abs(b.y - hang) < 0.1) { b.mode = "hang"; b.t2 = 0; b.at = 1; } }
        else if (b.mode === "hang") {
          b.x = lerp(b.x, clamp(p.x, b.a0 + 1.5, b.a1 - 1.5), 1 - Math.exp(-dt * (pn ? 1.6 : 1.1))); b.y = hang + Math.sin(b.t2 * 3) * 0.15;
          b.at -= dt;
          if (b.at <= 0) { for (let k = 0; k < (pn ? 4 : 3); k++) bshot(b, { name: "spider.ice", x: b.a0 + 1.5 + Math.random() * (b.a1 - b.a0 - 3), y: b.gy + 7 + k * 0.8, g: 18, r: 0.35, life: 3, fps: 1, mid: true, shatter: true });
            b.at = pn ? 2 : 2.8; shakeCam(0.12); SFX.impact(); }
          if (b.t2 > (pn ? 4 : 5.5)) { b.mode = "stamp"; b.t2 = 0; }
        } else if (b.mode === "stamp") { b.y = lerp(b.y, low, 1 - Math.exp(-dt * 7)); if (b.t2 > 0.35 && !b.stamped) { b.stamped = true; quake(b, b.x, 1.6); } if (b.t2 > 1.8) { b.mode = "down"; b.stamped = false; } }
      },
      weak(b) { const w = bw(b, "spider.body"), h = bh(b, "spider.body"); return [b.x - w * 0.42, b.x + w * 0.42, b.y, b.y + h * 0.75]; },
      harm(b) { const w = bw(b, "spider.body"); return b.mode === "stamp" && b.t2 < 0.5 ? [[b.x - w * 0.5, b.x + w * 0.5, b.y - 0.3, b.y + 0.4]] : []; },
      draw(b, show) {
        show("body", "spider.body", b.mode === "stamp" ? 3 + Math.floor(world.t * 8) % 3 : Math.floor(world.t * 5) % 3, 1, b.x, b.y, false, true);
        for (let k = 0; k < 6; k++) show("th" + k, "snake.shot", 1, 1, b.x, b.y + bh(b, "spider.body") + 0.3 + k * 0.5, true, false, 0.6);    // its thread
      },
    },
    press: {
      step(b, dt, p, pn) {
        if (b.mode === "in") { b.x -= 4 * dt; b.y = b.gy; if (b.x <= b.a1 - 3) { b.mode = "set"; b.t2 = 0; b.n = 0; } return; }
        b.t2 += dt;
        if (b.mode === "set") { if (b.t2 > (pn ? 0.3 : 0.5)) { b.mode = "air"; b.n++; const big = b.n % 3 === 0; b.big = big; b.vy = big ? 15 : 8.5; b.face = toward(b, p); b.vx = b.face * (big ? 2.5 : (pn ? 4 : 3)); } }
        else if (b.mode === "air") {
          b.vy -= GRAV * dt; b.y += b.vy * dt; b.x += b.vx * dt;
          if (b.x < b.a0 + 1.3 || b.x > b.a1 - 1.3) { b.x = clamp(b.x, b.a0 + 1.3, b.a1 - 1.3); b.vx = -b.vx; }
          if (b.y <= b.gy) { b.y = b.gy; b.mode = "set"; b.t2 = 0; if (b.big) quake(b, b.x, BOSS_W); SFX.spring(); }
        }
      },
      weak(b) { const w = bw(b, "press.body"), h = bh(b, "press.body"); return [b.x - w * 0.5, b.x + w * 0.5, b.y + h * 0.55, b.y + h + 0.2]; },
      harm(b) { const w = bw(b, "press.body"), h = bh(b, "press.body"); return [[b.x - w * 0.25, b.x + w * 0.25, b.y, b.y + h * 0.5]]; },
      draw(b, show) { show("body", "press.body", b.mode === "set" ? 3 + Math.min(2, Math.floor(b.t2 * 10)) : b.vy > 4 ? 0 : 1, b.face, b.x, b.y, false, true); },
    },
    hammer3: {
      step(b, dt, p, pn) {
        b.t2 += dt;
        if (b.mode === "in") { b.x = b.a1 + 2; b.y = b.gy; b.mode = "gstand"; b.t2 = 0; b.face = -1; b.x = b.a1 - 3; return; }
        if (b.mode === "gstand") { b.face = toward(b, p); if (b.t2 > 1.2) { b.mode = "gdash"; b.t2 = 0; } return; }
        if (b.mode === "gdash") { b.x += b.face * 10 * dt; if (b.x <= b.a0 + 1 || b.x >= b.a1 - 1) { b.x = clamp(b.x, b.a0 + 1, b.a1 - 1); b.mode = "gstand"; b.t2 = 0; } return; }
        if (b.mode === "gemout") { b.y += 9 * dt; b.x += 4 * dt; if (b.t2 > 1.2) { b.mode = "drop"; b.t2 = 0; b.x = (b.a0 + b.a1) / 2; b.y = b.gy + 10; hudToast(b.C.name); } return; }
        const hi = b.gy + 4.4;
        if (b.mode === "drop") { b.y = lerp(b.y, hi, 1 - Math.exp(-dt * 3)); if (b.t2 > 1.4) { b.mode = "swing"; b.t2 = 0; } }
        else if (b.mode === "swing") {
          b.x = lerp(b.x, clamp(p.x - sgn(p.x - b.x) * 0.5, b.a0 + 1.5, b.a1 - 1.5), 1 - Math.exp(-dt * (pn ? 1.8 : 1.2))); b.y = hi;
          if (b.t2 > (pn ? 2 : 2.8)) { b.mode = "slam"; b.t2 = 0; }
        } else if (b.mode === "slam") {
          b.y = lerp(b.y, b.gy + 1.7, 1 - Math.exp(-dt * 9));
          if (b.t2 > 0.3 && !b.slammed) { b.slammed = true; quake(b, b.x, 1.8); }
          if (b.t2 > 1.7) { b.mode = "swing"; b.t2 = 0; b.slammed = false; }
        }
      },
      weak(b) {
        if (b.mode === "gstand") return [b.x - 0.45, b.x + 0.45, b.y, b.y + 1.5];
        if (/^g/.test(b.mode) || b.mode === "drop") return null;
        const w = bw(b, "hammer3.pod"); return [b.x - w * 0.5, b.x + w * 0.5, b.y, b.y + w];
      },
      harm(b) {
        if (b.mode === "gdash") return [[b.x - 0.6, b.x + 0.6, b.y, b.y + 1.4]];
        if (/^g/.test(b.mode)) return [];
        const sw = b.mode === "swing" ? Math.sin(b.t2 * 3.2) * 1.4 : 0, hx = b.x + sw, w = bw(b, "hammer3.head"), hy = b.y - 1.6;
        return [[hx - w * 0.45, hx + w * 0.45, hy - 0.4, hy + 0.6]];
      },
      draw(b, show) {
        if (/^g/.test(b.mode)) {
          const [n, i] = b.mode === "gdash" ? ["gemerl.dash", Math.floor(world.t * 12) % 2] : b.mode === "gemout" ? ["gemerl.hurt", 0] : ["gemerl.stand", Math.floor(world.t * 3) % 2];
          show("gem", n, i, b.face, b.x, b.y, false, true, 1.2); return;
        }
        const sw = b.mode === "swing" ? Math.sin(b.t2 * 3.2) * 1.4 : 0, hy = b.y - 1.6;
        for (let k = 1; k <= 3; k++) show("l" + k, "hammer3.link", 0, 1, b.x + sw * k / 4, b.y - k * 0.4, true);
        show("head", b.inv > 0.5 ? "hammer3.headhit" : "hammer3.head", 0, 1, b.x + sw, hy - 0.4, false);
        show("body", b.inv > 0.5 ? "hammer3.podhit" : "hammer3.pod", Math.floor(world.t * 6) % 3, 1, b.x, b.y, false, true);
      },
    },
    snake: {
      step(b, dt, p, pn) {
        if (b.mode === "in") { b.x -= 4 * dt; b.y = b.gy + 0.3; if (b.x <= b.a1 - 3) { b.mode = "shut"; b.t2 = 0; b.at = 1.5; } return; }
        b.t2 += dt; b.spin = (b.spin || 0) + dt * (pn ? 3.2 : 2.2);
        b.x += b.face * (pn ? 2.4 : 1.6) * dt;
        if (b.x < b.a0 + 2.5) b.face = 1; if (b.x > b.a1 - 2.5) b.face = -1;
        if (b.mode === "shut" && b.t2 > 2.4) { b.mode = "open"; b.t2 = 0; }
        else if (b.mode === "open" && b.t2 > (pn ? 1.6 : 2.2)) { b.mode = "shut"; b.t2 = 0; }
        b.at -= dt;
        if (b.at <= 0) { const d = toward(b, p); bshot(b, { name: "snake.shot", x: b.x + d, y: b.y + 0.8, vx: d * 6, vy: 0, r: 0.25, life: 3, fps: 10 }); b.at = pn ? 1.3 : 2; SFX.shot(); }
      },
      balls(b) { return [0, PI].map(a => [b.x + Math.cos(b.spin + a) * 2, b.y + 1 + Math.sin(b.spin + a) * 1.4]); },
      weak(b) { const w = bw(b, "snake.body"), h = bh(b, "snake.body"); return b.mode === "open" ? [b.x - w * 0.5, b.x + w * 0.5, b.y + h * 0.4, b.y + h + 0.3] : null; },
      harm(b) { const w = bw(b, "snake.body"), h = bh(b, "snake.body");
        return BRAIN.snake.balls(b).map(([x, y]) => [x - 0.5, x + 0.5, y - 0.5, y + 0.5]).concat(b.mode === "shut" ? [[b.x - w * 0.5, b.x + w * 0.5, b.y, b.y + h]] : []); },
      draw(b, show) {
        show("body", "snake.body", b.mode === "open" ? (Math.floor(world.t * 4) % 2 ? 0 : 5) : 1 + Math.floor(world.t * 8) % 3, 1, b.x, b.y, false, true);
        BRAIN.snake.balls(b).forEach(([x, y], k) => {
          for (let c = 1; c <= 3; c++) show("c" + k + c, "snake.shot", 1, 1, lerp(b.x, x, c / 4), lerp(b.y + 1, y, c / 4), true, false, 0.7);
          show("s" + k, "snake.spike", 0, 1, x, y, true);
        });
      },
    },
    saucer: {
      step(b, dt, p, pn) {
        const v = pn ? 8.2 : 7, end = b.a1 - 16;
        if (b.mode === "in") { b.mode = "fly"; b.at = 1.6; b.y = b.gy + 2.6; }
        if (b.x < end) b.x += v * dt; else b.x = end;
        b.camX = Math.min(b.x - 3, end - 3);
        if (p.x > b.x + 1) b.x = Math.min(end, b.x + (p.x - b.x - 1) * dt * 4);
        b.t2 += dt; b.at -= dt;
        if (b.mode === "fly") { b.y = lerp(b.y, b.gy + 2.6, 1 - Math.exp(-dt * 3));
          if (b.at <= 0) { b.mode = "fists"; b.t2 = 0; b.fx = [p.x + 2.2, p.x - 1.6]; b.fy = b.gy + 4.6; } }
        else if (b.mode === "fists") {
          b.fy = b.t2 < 0.7 ? b.gy + 4.6 : Math.max(b.gy, b.fy - 30 * dt);
          if (b.fy <= b.gy && !b.slam) { b.slam = true; quake(b, b.fx[0], 0.9); quake(b, b.fx[1], 0.9); }
          if (b.t2 > 1.6) { b.mode = "dip"; b.t2 = 0; b.slam = false; }
        } else if (b.mode === "dip") { b.y = lerp(b.y, b.gy + 0.4, 1 - Math.exp(-dt * 5)); if (b.t2 > 2.2) { b.mode = "fly"; b.at = pn ? 1.4 : 2.2; } }
      },
      weak(b) { const w = bw(b, "saucer.pod"), h = bh(b, "saucer.ring"); const cy = b.y + h * 0.5; return [b.x - w * 0.55, b.x + w * 0.55, cy - w * 0.6, cy + w * 0.6]; },
      harm(b) { if (b.mode !== "fists") return []; return b.fx.map(x => [x - 0.6, x + 0.6, b.fy, b.fy + 1.2]); },
      draw(b, show) {
        const h = bh(b, "saucer.ring");
        show("ring", "saucer.ring", Math.floor(world.t * 10) % 6, 1, b.x, b.y, false, false, undefined, -0.05);
        show("body", b.inv > 0.5 ? "saucer.podhit" : "saucer.pod", 0, 1, b.x, b.y + h * 0.5, true, true);
        if (b.mode === "fists") b.fx.forEach((x, k) => show("f" + k, "saucer.fist", 0, k ? 1 : -1, x, b.fy, false));
        else [-1, 1].forEach((d, k) => show("f" + k, "saucer.hand", 0, -d, b.x + d * bw(b, "saucer.ring") * 0.62, b.y + h * 0.35, false));
      },
    },
    frog: {
      step(b, dt, p, pn) {
        if (b.mode === "in") { b.x = b.a1 - 3; b.y = b.gy + 10; b.vy = 0; b.mode = "fall"; return; }
        b.t2 += dt;
        if (b.mode === "fall" || b.mode === "leap") {
          b.vy -= GRAV * dt; b.y += b.vy * dt; b.x += (b.vx || 0) * dt;
          if (b.y <= b.gy) { b.y = b.gy; b.vx = 0; b.mode = "sit"; b.t2 = 0; quake(b, b.x, 2.4); b.fired = 0; }
        } else if (b.mode === "sit") {
          b.face = toward(b, p);
          if (b.t2 > 0.5 && b.fired === 0) { b.fired = 1;
            if (Math.random() < 0.5) { for (let k = 0; k < 4; k++) bfire(b, b.x + b.face * (1.4 + k * 0.7), 0.9, 0.9); SFX.blast(); }
            else for (let k = -1; k <= 1; k++) bshot(b, { name: "frog.shot", x: b.x + b.face * 1, y: b.y + 1.2, vx: b.face * 6, vy: k * 2.4, r: 0.25, life: 3, fps: 12 }); }
          if (b.t2 > (pn ? 1.3 : 1.9)) { b.mode = "leap"; b.t2 = 0; const to = b.x < (b.a0 + b.a1) / 2 ? b.a1 - 3 : b.a0 + 3; b.vy = pn ? 16 : 14; b.vx = (to - b.x) / (2 * b.vy / GRAV); }
        }
      },
      weak(b) { const w = bw(b, "frog.body"), h = bh(b, "frog.body"); return b.mode === "sit" ? [b.x - w * 0.5, b.x + w * 0.5, b.y, b.y + h] : null; },
      harm(b) { const w = bw(b, "frog.body"), h = bh(b, "frog.body"); return b.mode !== "sit" ? [[b.x - w * 0.45, b.x + w * 0.45, b.y, b.y + h]] : []; },
      draw(b, show) { show("body", b.inv > 0.6 ? "frog.flash" : pinchOf(b) ? "frog.hurt" : "frog.body", b.mode === "sit" ? Math.floor(world.t * 6) % 5 : 0, b.face, b.x, b.y, false, true); },
    },
  };

  function stepBoss(dt) {
    const w = world, b = w.boss, p = player;
    if (!b || battle || !p) return;
    if (p.dead) { if (b.lock && b.state !== "done" && b.state !== "capsule") b.reset = true; return; }
    if (b.reset) { resetBoss(b); return; }
    if (b.state === "wait") { if (p.x > b.a0 + (b.C.chase ? 2 : 1.5)) lockArena(b); return; }
    b.t += dt; b.inv = Math.max(0, b.inv - dt);
    /* the arena's walls: one screen (or, on a chase, the camera's view, going on with the boss) */
    const hw = w.viewHalfW || 8;
    const L = b.C.chase ? b.camX - hw + 0.6 : b.a0 + 0.5, R = b.C.chase ? b.camX + hw - 0.6 : b.a1 - 0.5;
    if (b.lock) { if (p.x < L) { p.x = L; if (p.vx < 0) p.vx = 0; } if (p.x > R) { p.x = R; if (p.vx > 0) p.vx = 0; } }
    if (b.state === "fight") {
      const B = BRAIN[b.key];
      B.step(b, dt, p, pinchOf(b));
      if (b.mode !== "in") {
        const P = [p.x - p.c.w / 2, p.x + p.c.w / 2, p.y, p.y + p.hh];
        const hitting = attacking(p) || p.state === "seek" || (p.state === "atk" && p.mv);
        const wk = B.weak(b), stomp = p.vy < -0.5 && wk && p.y > (wk[2] + wk[3]) / 2;
        if (wk && ovl(P, wk) && (hitting || stomp)) bossHit(b, p);
        else if (p.inv <= 0 && p.star <= 0) for (const h of B.harm(b)) if (ovl(P, h)) { hurt(p, b.x); break; }
      }
    } else if (b.state === "boom") {
      if (b.t % 0.14 < dt) { b.booms.push({ x: b.x + (Math.random() - 0.5) * 2.4, y: b.y + Math.random() * 2.2, t: 0 }); SFX.boom(); shakeCam(0.08); }
      if (b.t > 2.4) { b.state = "flee"; b.t = 0; b.my = b.y + 1.2; b.mx = b.x;
        b.cap = { x: b.C.chase ? b.camX + 2 : clamp(p.x + 3, b.a0 + 2, b.a1 - 2), y: b.gy + 11, vy: 0, open: false, t: 0 };
        for (let k = 0; k < 10; k++) burst(b.x + (Math.random() - 0.5) * 2, b.y + Math.random() * 2, [0x8a8a8a, 0x5a5a5a, 0xffd040], 6, 7); }
    } else if (b.state === "flee" || b.state === "capsule" || b.state === "done") {
      b.mx += 7 * dt; b.my += 3.2 * dt;
      const c = b.cap;
      if (!c.landed) { c.vy -= GRAV * 0.6 * dt; c.y = Math.max(b.gy, c.y + c.vy * dt); if (c.y <= b.gy) { c.landed = true; shakeCam(0.12); SFX.impact(); b.state = "capsule"; } }
      const cw = bw(b, "flee.capsule") * capK(b) * 0.42, ch = CAP_H;
      if (!c.open) {
        /* its walls: a runner stands on it, or is stopped by its sides */
        if (p.x + p.c.w / 2 > c.x - cw && p.x - p.c.w / 2 < c.x + cw && p.y < c.y + ch - 0.3 && p.y + p.hh > c.y) { p.x = p.x < c.x ? c.x - cw - p.c.w / 2 : c.x + cw + p.c.w / 2; p.vx = 0; }
        if (c.landed && Math.abs(p.x - c.x) < cw && p.y >= c.y + ch - 0.4 && p.y <= c.y + ch + 0.6 && p.vy <= 0) {
          c.open = true; c.t = 0; b.state = "done"; p.y = c.y + ch - 0.45; p.vy = 6; p.ground = false;
          SFX.pop(); SFX.check(); burst(c.x, c.y + ch, [0xffffff, 0xffd040], 16, 6);
          for (let k = 0; k < 8; k++) setTimeout(() => world && spawnCritter(c.x + (Math.random() - 0.5) * 1.6, c.y + 0.6), k * 120);
        }
      } else {
        c.t += dt;
        if (c.t > 1.6 && mode === "play") finish(p);
      }
    }
    // shots
    for (const s of b.shots) {
      s.t += dt; s.life -= dt;
      if (s.home) s.vy += clamp((p.y + 0.6 - s.y) * s.home, -6, 6) * dt;
      if (s.g) s.vy -= s.g * dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      if (s.y - (s.mid ? s.r : 0) <= b.gy && s.vy <= 0) {
        if (s.land === "fire") { bfire(b, s.x, 1.8, 1.1); s.life = 0; SFX.blast(); }
        else if (s.shatter) { burst(s.x, b.gy + 0.2, [0xc8f0ff, 0xffffff], 8, 4); s.life = 0; }
        else if (s.bounce) { s.y = b.gy + s.r; s.vy = Math.abs(s.vy) * s.bounce; if (s.vy < 3) s.vy = 7; }
        else if (s.walker) { s.y = b.gy; s.vy = 0; }
      }
      if (!b.C.chase && (s.x < b.a0 - 1 || s.x > b.a1 + 1)) { if (s.walker || s.bounce) s.vx = -s.vx; else s.life = 0; }
      const r = s.r, hw2 = s.w || r;
      const box = s.mid ? [s.x - hw2, s.x + hw2, s.y - r, s.y + r] : [s.x - hw2, s.x + hw2, s.y, s.y + r * 2.4];
      const P = [p.x - p.c.w / 2, p.x + p.c.w / 2, p.y, p.y + p.hh];
      if (s.life > 0 && ovl(P, box)) {
        if (s.walker && (attacking(p) || p.vy < -0.5)) { s.life = 0; burst(s.x, s.y + 0.4, [0xffffff, 0xd8d8d8], 8, 4); SFX.stomp(); if (p.vy < 0) p.vy = 9; }
        else if (p.inv <= 0 && p.star <= 0) { hurt(p, s.x); if (!s.bounce && !s.walker) s.life = 0; }
      }
    }
    b.shots = b.shots.filter(s => s.life > 0);
    for (const f of b.fires) {
      f.t += dt;
      const P = [p.x - p.c.w / 2, p.x + p.c.w / 2, p.y, p.y + p.hh];
      if (p.inv <= 0 && p.star <= 0 && ovl(P, [f.x - 0.35, f.x + 0.35, b.gy, b.gy + f.h * Math.min(1, f.t * 4)])) hurt(p, f.x);
    }
    b.fires = b.fires.filter(f => f.t < f.life);
    for (const o of b.booms) o.t += dt;
    b.booms = b.booms.filter(o => o.t < 0.42);
  }
  /* the camera on a locked arena: held on it (on a chase, running with the boss) */
  function bossCamX(b, halfW) {
    if (b.C.chase) return b.camX;
    const c = (b.a0 + b.a1) / 2;
    return halfW * 2 >= b.a1 - b.a0 ? c : clamp(camX, b.a0 + halfW, b.a1 - halfW);
  }
  function drawBoss() {
    const b = world.boss; if (!b || battle) return;
    for (const k in b.cards) b.cards[k].visible = false;
    if (b.state === "wait") return;
    const flick = b.inv > 0 && Math.floor(world.t * 30) % 2 === 0;
    /* a piece of it: frame i of `name`, facing `face` (-1 left, as the sheets draw them; 1 right),
       at x, y (its feet, or its middle) */
    const show = (id, name, i, face, x, y, mid, body, k, z) => {
      if (body && flick) return;
      let m = b.cards[id];
      if (!m) { m = b.cards[id] = makeCard("bosses"); world.group.add(m); }
      m.visible = true;
      setFrame(m, name, i, face < 0 ? 1 : -1, x, y, mid, z == null ? 0.05 : z, b.C.k * (k || 1));
    };
    if (b.state === "fight") BRAIN[b.key].draw(b, show);
    b.shots.forEach((s, k) => show("shot" + k, s.name, Math.floor(s.t * s.fps) % fr(s.name).length, s.vx > 0 ? 1 : -1, s.x, s.y, s.mid, false));
    b.fires.forEach((f, k) => show("fire" + k, "aero.fire", Math.floor(f.t * 12) % 7, 1, f.x, b.gy, false, false, f.h / 1.9));
    b.booms.forEach((o, k) => show("boom" + k, "hammer.boom", Math.floor(o.t * 12), 1, o.x, o.y, true, false));
    if (b.state === "boom" && !flick) BRAIN[b.key].draw(b, (id, name, i, face, x, y, mid, body, k, z) => show(id, name, i, face, x, y, mid, false, k, z));
    if (b.cap) {
      show("mobile", "flee.mobile", Math.floor(world.t * 8) % 4, 1, b.mx, b.my, true, false);
      show("cap", b.cap.open ? "flee.open" : "flee.capsule", 0, 1, b.cap.x, b.cap.y, false, false, capK(b));
    }
  }

  // ---------------------------------------------------------------- the finish
  function finish(p) {
    mode = "goal"; p.state = "run";
    if (world.goal) { world.goal.fire = 2.5; world.goal.fireT = 0; }
    bgm("act-clear", { once: true });
    SFX.goal();
    const time = world.t;
    const st = curDef();
    const prev = saveData.stages[st.id] || {};
    const shoesBefore = (prev.shoes || []).slice(0, p.shoes.length).concat(p.shoes.map(() => false)).slice(0, p.shoes.length);
    const shoes = shoesBefore.map((b, i) => b || p.shoes[i]);
    const pct = world.total ? Math.min(1, p.ringsGot / world.total) : 1;
    const par = st.par || 90;
    let score = 0;
    score += time <= par ? 2 : time <= par * 1.35 ? 1 : 0;
    score += pct >= 0.8 ? 2 : pct >= 0.5 ? 1 : 0;
    score += p.falls === 0 ? 1 : 0;
    const grade = score >= 5 ? "S" : score >= 4 ? "A" : score >= 2 ? "B" : "C";
    const order = "CBAS";
    let earned = 0;
    if (!prev.clear) earned += PAY.clear;
    shoes.forEach((b, i) => { if (b && !shoesBefore[i]) earned += PAY.shoe; });
    if (grade === "S" && prev.grade !== "S") earned += PAY.sRank;
    const best = prev.best == null || time < prev.best;
    saveData.stages[st.id] = {
      clear: true, best: best ? time : prev.best, shoes,
      grade: prev.grade && order.indexOf(prev.grade) > order.indexOf(grade) ? prev.grade : grade,
      carrots: Math.max(prev.carrots || 0, p.carrots), by: best ? p.c.id : prev.by,
    };
    save(saveData);
    if (earned && root.Stable && Stable.grant) Stable.grant(earned, "adventure");
    if (NP.on && NP.race) { npFinished(time); return; }              // an online race: home, and wait for the others
    if (GPR) { gpHome(time); return; }                               // the grand prix: home, and your place
    if (RACE) { raceHome(time); return; }                            // a race against a rival: home first
    setTimeout(() => results({ time, best, grade, carrots: p.carrots, total: world.total, shoes: p.shoes, shoesAll: shoes, falls: p.falls, earned, par }), 1700);
  }
  function goalStep(p) { if (p.ground && Math.abs(p.vx) < 0.5) p.face = 1; }
  function fireworks(dt) {
    const g = world.goal;
    g.fire -= dt; g.fireT -= dt;
    if (g.fireT <= 0 && g.fire > 0) {
      g.fireT = 0.28;
      const C = [[0xe8403a, 0xfff3a0], [0x3a8ae0, 0xffffff], [0xf2b705, 0xffffff], [0x5ab84a, 0xe8fffc], [0x39c5bb, 0xf08ac0]];
      burst(g.x + (Math.random() - 0.3) * 8, g.y + 5 + Math.random() * 3, C[Math.floor(Math.random() * C.length)], 26, 7);
      tone(200 + Math.random() * 300, 60, 0.3, "triangle", 0.05);
    }
  }

  // ---------------------------------------------------------------- input
  /* Space jumps; Z, X and C are the light attack, the heavy attack and the special; the
     arrows or WASD move, and Up and Down pick the heavy or the special. A pad: A jumps, X,
     Y and B are light, heavy and special. */
  const KEYS = { ArrowLeft: "L", a: "L", A: "L", ArrowRight: "R", d: "R", D: "R", ArrowDown: "D", s: "D", S: "D", ArrowUp: "U", w: "U", W: "U",
                 " ": "J", z: "Z", Z: "Z", x: "X", X: "X", c: "C", C: "C", v: "V", V: "V", Shift: "V" };   // (V or Shift: the grand prix's power)
  function onKey(e, down) {
    if (!host) return;
    const tg = e.target;
    if (tg && (tg.tagName === "INPUT" || tg.tagName === "TEXTAREA" || tg.isContentEditable)) return;   // typing: a name, a password, a chat line
    const dlg = host.querySelector(".ao-modal");
    if (dlg) { if (down && e.key === "Escape") { const x = dlg.querySelector("[data-x]"); if (x) x.click(); } return; }
    if (rebind) { if (down) takeRebind(e); e.preventDefault(); return; }   // Options: the next key pressed is the new one
    const k = e.key, duo = !!(battle && battle.duo);
    const b = KEYS[k];
    if (menuKey(e, down)) return;
    if (k === "Escape" || ((k === "p" || k === "P") && !duo)) { if (down && mode === "play") togglePause(); e.preventDefault(); return; }
    if (duo) {                                           // two on one keyboard: each their own keys
      const hit = duoKey(e.code);
      if (hit) { e.preventDefault(); duoKeys[hit[0]][hit[1]] = down ? 1 : 0; }
      return;
    }
    if (!b) return;
    if (mode === "play" || mode === "goal") e.preventDefault();
    keys[b] = down ? 1 : 0;
    if (down && !e.repeat) specTap[b] = 1;              // (a tap, kept for a spectator's next frame: one between two frames still counts)
  }
  const kd = e => onKey(e, true), ku = e => onKey(e, false);

  /* The menus by keyboard. Enter goes on from the title to the stage select, starts the
     stage from the stage select, and opens and closes the pause menu in a run; in any menu the
     arrows move between its buttons (to the nearest one that way), Z presses the one picked
     (Enter too, on the pause and results screens) and X backs out: to the hall from the
     title, to the title from the stage select, back into the run from the pause menu, to the
     stage select from the results. Returns true if it took the key. */
  let kbFocus = null, kbUsed = false;
  const NAV = { ArrowLeft: "L", ArrowRight: "R", ArrowUp: "U", ArrowDown: "D" };
  function menuKey(e, down) {
    const k = e.key, inMenu = GLIDE[mode] || mode === "menu" || mode === "results" || (mode === "play" && paused);
    if (k === "Enter" && mode === "play" && !paused) { if (down && !e.repeat) { kbUsed = true; togglePause(); } e.preventDefault(); return true; }
    if (mode === "scene") {                              // the story's talk: Z, Enter or Space on, X skips the scene
      const go = k === "z" || k === "Z" || k === "Enter" || k === " ", skip = k === "x" || k === "X";
      if (!go && !skip) return !!NAV[k];
      e.preventDefault();
      if (down && !e.repeat) { if (go) sceneNext(); else sceneSkip(); }
      return true;
    }
    if (!inMenu) return false;
    const z = k === "z" || k === "Z", x = k === "x" || k === "X";
    if (!(NAV[k] || z || x || k === "Enter")) return false;
    e.preventDefault();
    if (!down) return true;
    kbUsed = true;
    const ov = host.querySelector(".adv-ov"), click = sel => { const el = ov && ov.querySelector(sel); if (el && !el.disabled) el.click(); };
    if (NAV[k]) { moveFocus(NAV[k]); return true; }
    if (e.repeat) return true;
    if (k === "Enter") {                                 // a screen's own Enter button, or the one picked
      if (mode === "play") togglePause();
      else { const el = ov && ov.querySelector("[data-enter]"); if (el && !el.disabled) el.click(); else pressFocus(); }
      return true;
    }
    if (z) { pressFocus(); return true; }
    if (mode === "play") togglePause();
    else click("[data-back]");                           // each screen marks its way back
    return true;
  }
  function menuItems() {
    const ov = host && host.querySelector(".adv-ov");
    return ov ? [...ov.querySelectorAll("button:not([disabled])")].filter(el => el.offsetParent !== null) : [];
  }
  function defaultFocus() {
    const ov = host.querySelector(".adv-ov"), items = menuItems();
    return (ov && (ov.querySelector("[data-focus]") || ov.querySelector("#advRes") || ov.querySelector("#advNext") || ov.querySelector("#advMenu") || ov.querySelector("#advStart") || ov.querySelector("#advTStart"))) || items[0] || null;
  }
  function setFocus(el) {
    if (kbFocus) kbFocus.classList.remove("kb");
    kbFocus = el;
    if (!el) return;
    el.classList.add("kb");
    try { el.focus({ preventScroll: true }); } catch (err) {}
    el.scrollIntoView({ block: "nearest" });
  }
  /* to the nearest button that way: the closest straight ahead, a step aside counting double */
  function moveFocus(dir) {
    const items = menuItems();
    if (!items.includes(kbFocus)) { setFocus(defaultFocus()); return; }
    const r0 = kbFocus.getBoundingClientRect(), cx = r0.left + r0.width / 2, cy = r0.top + r0.height / 2;
    let best = null, bd = Infinity;
    for (const el of items) {
      if (el === kbFocus) continue;
      const r = el.getBoundingClientRect(), dx = r.left + r.width / 2 - cx, dy = r.top + r.height / 2 - cy;
      const along = dir === "L" ? -dx : dir === "R" ? dx : dir === "U" ? -dy : dy;
      if (along <= 4) continue;
      const d = along + 2 * (dir === "L" || dir === "R" ? Math.abs(dy) : Math.abs(dx));
      if (d < bd) { bd = d; best = el; }
    }
    if (best) setFocus(best);
  }
  function pressFocus() {
    if (!menuItems().includes(kbFocus)) { setFocus(defaultFocus()); return; }
    const el = kbFocus;
    el.click();
    if (el.isConnected && menuItems().includes(el)) setFocus(el);      // a runner or stage picked: stay on it
  }
  /* a menu just drawn: if the keys are in use, start on its first choice */
  function autoFocus() { kbFocus = null; if (kbUsed && host) setFocus(defaultFocus()); }
  /* A player's hands into `inp`: the keys, a pad, the touch buttons. On one keyboard (and in a
     battle with one player) the keys are the ones above and the first pad and the touch pad are
     theirs too; in a battle with two players each has their own keys (Options sets them) and
     pad, and the touch pad is Player 1's. */
  function readInput(inp, slot) {
    inp = inp || INPUT0; slot = slot || 0;
    const duo = !!(battle && battle.duo);
    const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(g => g && g.connected) : [];
    const gp = duo ? pads[KEYMAP.padSwap ? 1 - slot : slot] : pads[0];
    for (const k in pad) pad[k] = 0;
    if (gp) {
      const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0, B = i => gp.buttons[i] && gp.buttons[i].pressed ? 1 : 0;
      pad.L = ax < -0.35 || B(14) ? 1 : 0; pad.R = ax > 0.35 || B(15) ? 1 : 0; pad.D = ay > 0.5 || B(13) ? 1 : 0; pad.U = ay < -0.5 || B(12) ? 1 : 0;
      pad.J = B(0); pad.Z = B(2); pad.X = B(3) || B(5); pad.C = B(1) || B(7);
      if (B(9) && !inp._start && mode === "play") togglePause();
      inp._start = B(9);
    }
    const src = duo ? duoKeys[slot] : keys, tc = slot === 0 ? touch : {};
    const on = k => src[k] || pad[k] || tc[k] ? 1 : 0;
    const now = performance.now(), tapAt = inp._tap || (inp._tap = { L: 0, R: 0 });
    inp.dash = 0;
    for (const d of ["L", "R"]) {                    // a double tap: the dash
      const v = on(d);
      if (v && !inp[d]) { if (now - tapAt[d] < 260) inp.dash = d === "L" ? -1 : 1; tapAt[d] = now; }
      inp[d] = v;
    }
    inp.U = on("U"); inp.D = on("D");
    for (const b of ["J", "Z", "X", "C"]) { const v = on(b); inp[b.toLowerCase() + "p"] = v && !inp[b] ? 1 : 0; inp[b] = v; }
  }

  // ---------------------------------------------------------------- the loop
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.max(0, Math.min(0.1, (now - (last || now)) / 1000)); last = now;
    if (!world || !player) return;
    resize();
    if (mode === "play" || mode === "goal") {
      if (!paused && npWatching()) npSpecTick(dt);                     // a spectator: who to watch, and how
      if (!paused && NP.on && !NP.host && battle) npGuestTick(dt);      // an online guest: the host's fight, mirrored
      else if (!paused) {
        if (stopT > 0) { stopT = Math.max(0, stopT - dt); acc = 0; }     // a freeze-frame: the world holds still
        else { acc += dt * (slowT > 0 ? 0.33 : 1); slowT = Math.max(0, slowT - dt); }   // and after a smash, slow motion
        const h = 1 / 120;
        let n = 0;
        while (acc >= h && n < 14 && (mode === "play" || mode === "goal")) {
          if (battle) battleTick(h);
          else if (NP.on && NP.watch) { world.t += h; cpuStep(h, gpHold()); worldStep(h); }   // a spectator's race: they run nothing; the world goes on round whoever they watch
          else {
            readInput();
            if (npHold() || rivalHold() || gpHold()) { const I = INPUT0; I.L = I.R = I.U = I.D = I.J = I.Z = I.X = I.C = 0; I.jp = I.zp = I.xp = I.cp = 0; I.dash = 0; }   // (an online race: nobody moves till Go)
            if (!(gpFrozen() && GPR.freezeBy !== "you")) step(h);        // (Chaos Control: time stops for you)
            cpuStep(h, gpHold());                                         // the CPU runners, after you
            worldStep(h); input.jp = input.zp = input.xp = input.cp = 0; input.dash = 0;
          }
          acc -= h; n++;
        }
        if (NP.on && NP.host && battle) npHostSend(dt);
      }
      if (!paused && NP.on && NP.race) npRaceTick(dt);
      if (!paused && RACE) stepRace(dt);
      if (!paused && GPR) gpTick(dt);
      if (!paused) {
        if (mode === "play" || mode === "goal") { if (battle) battleHud(); else { hud(); storyBeats(dt); } }
      }
    } else if (GLIDE[mode]) {
      /* the title and the menus: the camera goes along the stage on its own (the cast parades
         below the title); a story scene's talk goes on over it */
      if (demoOn() && world.demo) demoTick(dt);
      else { world.t += dt; titleGlide(dt); worldStep(dt * 0.6); }
      drawParade(dt);
      if (mode === "scene") sceneTick(dt);
    } else {
      // the menu: she waits at the start, the world goes on around her
      world.t += dt; worldStep(dt * 0.6);
      player.state = "run"; player.vx = 0;
    }
    if (!paused) draw(dt);
    if (NP.on && NP.ghosts.size) npTags();
  }
  function resize() {
    const box = host.querySelector(".adv-3d");
    if (!box) return;
    const W = box.clientWidth || innerWidth, Hh = box.clientHeight || innerHeight;
    const cv = R.domElement;
    if (cv.__w === W && cv.__h === Hh) return;
    cv.__w = W; cv.__h = Hh;
    R.setSize(W, Hh, false); camera.aspect = W / Hh; camera.updateProjectionMatrix();
  }

  // ---------------------------------------------------------------- battle
  /* Sonic Battle's fighting, with health. Up to four fighters in one runner's arena -- players
     or CPUs, everyone for themselves or two teams -- each with a hundred health (Options of
     the match: 60, 100 or 150). Blows, shots, traps and a curled body take it off; at none a
     fighter is KO'd and drops back in a moment later. A KO match goes to the first to so many
     KOs; in Survival each fighter has so many lives and the last side standing wins. Down is
     Sonic Battle's guard button: a tap raises a shield for half a second, and held still the
     runner heals, slowly, with nothing to stop a blow. Training is the same fight on a
     dummy that does as it is told, and never ends. */

  /* the screens where nobody runs: the stage goes by behind them on its own */
  const GLIDE = { title: 1, main: 1, setup: 1, options: 1, story: 1, scene: 1, lobby: 1, room: 1, friends: 1, msgs: 1, tourney: 1 };

  /* whether a and b are on opposite sides: everyone for themselves, or by team */
  const rivals = (a, b) => !!a && !!b && a !== b && (!battle || !battle.teams || a.team !== b.team);
  const mine = (t, p) => !battle || t.owner === p;
  const tok = (o, d, k) => { hitTok = o; hitDmg = d; hitKnock = k == null ? 0.85 : k; return true; };
  /* Damage, of a hundred: the third jab and the heavies the most; the runner's Power grade
     scales it, S a fifth more and C a tenth less. Powers hit harder than shots, traps between. */
  const DMG = { atk1: 4, atk2: 4, atk3: 7, heavy: 11, upper: 10, aim: 8, chase: 9, dashatk: 9, airatk: 7 };
  const POW = { S: 1.2, A: 1.1, B: 1, C: 0.9 };
  const powK = c => POW[c.grades && c.grades.Power] || 1;
  const blowDmg = (p, name) => Math.round((DMG[name] || 6) * powK(p.c));
  const spDmg = (p, s) => Math.round((s.kind === "power" ? 13 : s.kind === "trap" ? 11 : 8) * powK(p.c));
  /* how well each heals, held still on Down: Knuckles and Cream best, Sonic worst (as Sonic
     Battle has them), health a second */
  const HEAL = { knuckles: 9, cream: 9, chaos: 8, gamma: 7, sonic: 4, shadow: 4.5, metal: 4.5 };
  /* Down tapped on the ground: the guard, Sonic Battle's guard skill, each fighter's as long as
     theirs is (Rouge's quick, Gamma's Guard Mode long, the Chaos Guard strong). A blow that meets
     it in its first eighth of a second is parried: it does nothing, the one who threw it reels
     (Attack blocked) open to anything, and the parrier's burst gauge fills; later in it, a block. */
  /* Health, by the fighter: the match's figure times their own (Battle's setup: 150, 200 or 250,
     so three lives are done inside three minutes; a story fight 300, with one life),
     the heavy and sturdy more (Gamma, Eggman, Knuckles, Mighty), the light and quick less (Cream,
     Tails); whatever it is, healing and Training's refill come back at the same share of it. */
  const HP_K = { sonic: 1, shadow: 1, emerl: 1, metal: 1.05, chaos: 1.1, knuckles: 1.15, mighty: 1.15, eggman: 1.2, gamma: 1.25,
                 amy: 0.95, rouge: 0.95, silver: 0.95, tails: 0.9, cream: 0.85 };
  const hpOf = (c, base) => Math.round(base * (HP_K[c.id] || 1) / 10) * 10;
  const GUARD = { rouge: 0.22, shadow: 0.28, sonic: 0.3, emerl: 0.3, cream: 0.32, silver: 0.32, tails: 0.34, amy: 0.34,
                  knuckles: 0.36, metal: 0.36, mighty: 0.36, eggman: 0.4, chaos: 0.42, gamma: 0.45 };
  const guardOf = c => GUARD[c.id] || 0.32, PARRY_T = 0.12, GETUP_T = 0.32;
  /* Guilty Gear's Psych Burst: Z and X together with the burst gauge full. Hit (in a combo, down,
     or reeling), a blue burst: a blast that throws everyone off, no damage, and the combo is over.
     Otherwise a gold one: it hits, and landing it gives a third of the gauge back. The gauge fills
     slowly with time, with damage taken, and with every guard and parry (most for a special). */
  const BURST_MAX = 100;
  const SLOT_C = ["#e8403a", "#3a7ae0", "#e8b020", "#3aa04a"], TEAM_C = ["#e8403a", "#3a7ae0"], TEAM_N = ["Red", "Blue"];
  const tagCol = f => battle && battle.teams ? TEAM_C[f.team] : SLOT_C[f.slot];
  /* an online player's ping bars, from the room (they go on updating by themselves) */
  const pingTag = id => NP.on && id && root.Online && Online.pingBars && !(root.Settings && Settings.get("tagPing") === false) ? Online.pingBars(id) : "";   // (Options can turn them off)
  const tagText = f => (f.netName && f.ctl !== "p1" ? esc(f.netName) : f.ctl === "p1" ? "1P" : f.ctl === "p2" ? "2P" : "CPU") + pingTag(f.net);

  /** A fighter is hit. Unless their guard is up (the shield takes it: a clink, a push back),
      the damage comes off their health and they are knocked away -- a jab barely moves them,
      a finisher throws them across the arena or up into the air -- and reel a moment; at no
      health left, they are KO'd. Each swing lands on each fighter once.
      The combo rules, as the fighting games have them: one in the air off a hit is helpless till
      they come down (a juggle), and blows on them keep them up; the upper launches; a smash
      throws them hard, and off a wall they bounce (once a combo), the chase's off the floor
      (once); down on the floor only an OTG blow (the aim attack) picks them up, once a combo.
      The longer the combo, the less each hit does (from the fourth, a tenth less each, to a
      third), the shorter they are held (from the seventh) and the faster they fall; at eighteen
      hits they break out. */
  function hitFighter(q, kick, cx) {
    if (q.inv > 0 || q.state === "teleport" || q.ko || q.out) return false;
    const down = q.state === "down";
    if (down && !(kick && kick.otg && !q.cmb.otg)) return false;          // lying down: only an OTG blow, once a combo
    if (hitTok) { if (q.hits.has(hitTok)) return false; q.hits.add(hitTok); }
    const by = actor, from = by ? by.x : cx, away = sgn(q.x - from) || -q.face;
    if (q.guardT > 0) {
      world.guarded = true;
      const parry = (q.guard0 || 0) - q.guardT <= PARRY_T && !(q.ai && q.ai.dummy === "guard"), big = hitDmg >= 10;
      q.burst = Math.min(BURST_MAX, (q.burst || 0) + (parry ? 1 : 0.4) * (big ? 30 : 12));
      q.blocked++;
      if (parry) { parried(q, by); emit("parry", { q, by }); return false; }
      emit("block", { q, by });
      q.vx = away * 3.5;
      if (SBFX()) effect("sbfx", "guardhit", q.x - away * 0.45, q.y + q.hh * 0.55, -away, 26, true, "fx", clamp(q.hh, 1, 1.6));   // turned aside on the barrier
      else hitSpark(q.x - away * 0.35, q.y + q.hh * 0.55, 0.85, 0xbfe8ff);
      SFX.grab(); hitStop(0.03);
      return false;
    }
    const stunned = q.state === "hurt" || down, n = stunned ? q.cmb.n + 1 : 1, wasUp = stunned && q.juggle && !q.ground;
    /* a CPU's blows on a player are softer the easier it is: Easy three-quarters, Normal nine-tenths */
    const soft = by && by.ctl === "cpu" && q.ctl !== "cpu" ? [0.75, 0.9, 1][clamp(by.lvl, 0, 2)] : 1;
    const counter = q.state === "blocked";
    const dmg = kick && kick.burst === "blue" ? 0 : Math.max(1, Math.round(hitDmg * soft * (counter ? 1.25 : 1) * (n <= 3 ? 1 : Math.max(0.3, 1 - 0.1 * (n - 3))))), k = hitKnock;
    let vx, vy;
    if (kick && kick.r) {
      const dx = q.x - kick.cx, dy = q.y + q.hh / 2 - kick.cy, d = Math.hypot(dx, dy) || 1;
      vx = dx / d * kick.r * 0.8 + (sgn(dx) || away) * 1.5; vy = Math.max(5, dy / d * kick.r * 0.8 + 4);
    } else if (kick && kick.launch) { vx = (sgn(kick.vx) || away) * (kick.lvx || LAUNCH.vx); vy = kick.lvy || LAUNCH.vy; }   // the upper: straight up, everyone's alike (a tornado shot, its own)
    else if (down) { vx = (sgn(kick.vx) || away) * 1.5; vy = 9; }                              // OTG: up off the floor into the air
    else if (kick && kick.hold) {                                                               // an early swing: held there for the next
      const air = by && !by.ground;
      vx = air ? by.vx * 0.8 + kick.vx * 0.5 : kick.vx; vy = q.ground ? 0 : air ? 2.6 : 4.5;
    }
    else if (kick) {
      vx = kick.vx * k; vy = kick.vy * k;
      if (kick.smash && kick.spike) vx *= 1.3;                                                  // the chase: down hard
      else if (kick.smash) { vx = (sgn(vx) || away) * Math.max(Math.abs(vx) * 1.3, 18); vy = Math.max(vy, 6.5); }   // a smash: hard and far, flying
      else if (wasUp) {                                                                          // up in the air already: kept up, with whoever hit them
        const air = by && !by.ground;
        /* an air combo: they go along with whoever hit them, just ahead and a touch higher, so the next
           air blow is there to land (the attacker hangs at 2 m/s up after it lands) */
        vx = air ? by.vx * 0.8 + (sgn(vx) || away) * 1.0 : clamp(vx, -3.5, 3.5); vy = air ? Math.max(2.6 - 0.05 * n, 1.8) : Math.max(6.5 - 0.15 * n, 2.5);
      }
    } else { vx = away * 6; vy = 5; }
    q.cmb = stunned ? Object.assign(q.cmb, { n, dmg: q.cmb.dmg + dmg }) : { n: 1, dmg };
    if (down) q.cmb.otg = true;
    q.hp = Math.max(0, q.hp - dmg); q.sinceHit = 0; q.lastDmg = dmg; q.burst = Math.min(BURST_MAX, (q.burst || 0) + dmg * 0.8);
    if (counter && by) call(by, "Counter!");
    if (by) { by.dealt += dmg; by.landed++; by.lastCmb = q.cmb; by.lastVic = q; }
    q.state = "hurt"; q.mv = null; q.sp = null; q.hideT = 0; q.tor = null; q.er = null; q.curl = false; q.target = null;
    q.guardT = 0; q.healing = false; q.crouchT = 0;
    q.dazeT = (kick && kick.float) || 0;                  // a shot that holds them up: they float down
    q.vx = vx;
    if (vy > 3 || !q.ground) { q.vy = vy; q.ground = false; q.on = null; }
    q.juggle = !q.ground; q.jBy = by;
    q.smashT = kick && kick.smash ? 0.9 : 0; q.spike = !!(kick && kick.spike);
    const decay = Math.max(0.55, 1 - 0.035 * Math.max(0, n - 6));
    q.st = (q.juggle ? Math.min(1.6, airTime(q, q.smashT > 0 && !q.spike ? 0.45 : 0)) + 0.08 : 0.24 + hitDmg * 0.014) * decay;
    if (q.dazeT && q.juggle) q.st += q.dazeT * 0.8 * decay;
    q.whiteT = kick && (kick.smash || kick.launch) ? 0.12 : 0.07;
    if (n >= 18) { q.inv = Math.max(q.inv, 0.6); q.st = Math.min(q.st, 0.3); }   // a long combo: they break out of it
    emit("hit", { by, q, name: by ? (by.mv ? (by.mv.chase ? "chase" : by.mv.name) : by.state) : "", n, juggle: q.juggle, otg: down, counter,
                  launch: !!(kick && kick.launch), smash: !!(kick && kick.smash) });
    if (q.hp <= 0) {
      if (battle.cfg.kind === "training") { q.hp = q.hpMax; caption("KO!"); emit("ko", { q, by }); }   // the dummy never goes down for good
      else koFighter(q, by);
    }
    return true;
  }
  /** how long one in the air takes to come down to the floor under them, as they are going */
  function airTime(q, gk) {
    const g = GRAV * (gk || 1 + Math.min(0.8, (q.cmb ? q.cmb.n : 0) * 0.05)), h = Math.max(0, q.y - floorAt(q.x)), vy = q.vy || 0;
    return (vy + Math.sqrt(vy * vy + 2 * g * h)) / g;
  }
  /* A smash into a wall: off it and back up into the air, for the combo to go on (once a combo).
     The chase's smash into the floor: up off it the same way (once). */
  function wallBounce(p, d) {
    p.cmb.wb = true; p.smashT = 0; p.wallT = 0.3;
    p.vx = -d * 4.5; p.vy = Math.max(p.vy, 9.5); p.ground = false; p.on = null;
    p.juggle = true; p.st = Math.min(1.4, airTime(p)) + 0.08;
    const x = p.x + d * p.c.w / 2, y = p.y + p.hh * 0.5;
    impact(x, y, { c: 0xffffff, flash: 2.4, shake: 0.24 }); burst(x, y, [0xd8d0c0, 0xffffff, 0xa8a090], 16, 6);
    if (SBFX()) effect("sbfx", "wall", x, y, -d, 22, true, "fx", 1.2);
    hitStop(0.09); if (p.cmb.n >= 6) camPunch(x, y, 0.6, 0.8); SFX.impact(); SFX.stomp();
    emit("wall", { q: p });
  }
  function floorBounce(p) {
    p.cmb.gb = true; p.smashT = 0; p.spike = false; p.floorT = 0.3;
    p.ground = false; p.on = null; p.onTile = null; p.vy = 10.5; p.vx *= 0.4;
    p.juggle = true; p.st = Math.min(1.4, airTime(p)) + 0.08;
    impact(p.x, p.y + 0.1, { c: 0xffffff, flash: 2.4, shake: 0.24 }); burst(p.x, p.y + 0.1, [0xd8d0c0, 0xffffff, 0xa8a090], 18, 6);
    hitStop(0.08); if (p.cmb.n >= 6) camPunch(p.x, p.y + 0.6, 0.6, 0.8); SFX.impact(); SFX.stomp();
    emit("floor", { q: p });
  }
  /** a guard met a blow in its first moment: nothing comes of the blow, and one who threw it from
      close reels, open (Attack blocked) */
  function parried(q, by) {
    const x = by ? (q.x + by.x) / 2 : q.x + q.face * 0.5, y = q.y + q.hh * 0.6;
    hitSpark(x, y, 1.7, 0xffffff); flash(x, y, 2.6, 0x9ad8ff); ring(x, y, 0x9ad8ff, 1.6);
    hitStop(0.14); shakeCam(0.1); if (clutch(q)) camPunch(x, y, 0.55, 0.8);
    SFX.set(); SFX.hit();
    q.guardT = Math.max(q.guardT, 0.18); q.parries = (q.parries || 0) + 1;
    call(q, "Parry!");
    if (by && by !== q && !by.ko && Math.abs(by.x - q.x) < 3.2) {
      Object.assign(by, { state: "blocked", st: 0.55, mv: null, sp: null, tor: null, er: null, curl: false, juggle: false, target: null, buf: null, chase: false });
      by.vx = (sgn(by.x - q.x) || -by.face) * 3.5;
    }
  }
  /** Z and X at once, with the gauge full: the burst (blue, out of a combo; gold, otherwise) */
  function psychBurst(p) {
    const blue = p.state === "hurt" || p.state === "down" || p.state === "blocked" || p.state === "getup";
    const col = blue ? 0x58b8ff : 0xffc828, cx = p.x, cy = p.y + p.hh * 0.55;
    p.burst = 0; p.bursts = (p.bursts || 0) + 1; p.burstBlue = blue;
    Object.assign(p, { state: "burst", st: 0.45, mv: null, sp: null, tor: null, er: null, curl: false, juggle: false, smashT: 0, target: null,
                       buf: null, chase: false, guardT: 0, healing: false, crouchT: 0, vx: 0 });
    if (!p.ground) p.vy = 1.5;
    p.inv = Math.max(p.inv, 0.6); p.whiteT = 0.22;
    p.cmb = { n: 0, dmg: 0 };                               // whatever combo they were in is over
    tok({}, blue ? 0 : 9, 1);
    const hit = strike(cx - 3.4, cx + 3.4, cy - 2.6, cy + 2.6, { r: blue ? 15 : 13, cx, cy, burst: blue ? "blue" : "gold" });
    if (!blue && hit) p.burst = 35;
    ring(cx, cy, col, 4.2); ring(cx, cy, 0xffffff, 2.6);
    flash(cx, cy, 6, col); flash(cx, cy, 3, 0xffffff);
    burst(cx, cy, [col, 0xffffff, mixC(col, 0xffffff, 0.5)], 40, 9);
    hitStop(0.16); slowMo(0.25); shakeCam(0.32);
    if (blue && ((p.cmb && p.cmb.n >= 6) || clutch(p))) camPunch(cx, cy, 0.7, 0.9);
    SFX.blast(); SFX.boom();
    call(p, "Burst!");
    emit("burst", { p, blue, hit: !!hit });
  }
  /** a word over a fighter's head a moment: Parry!, Burst!, Counter! */
  function call(f, text) { f.callTx = text; f.callT = 0.9; f.callN = (f.callN || 0) + 1; }
  function guardUpkeep(p, dt) {
    if (p.guardT > 0 && (p.guardT -= dt) <= 0) { p.guardT = 0; p.guardCd = 0.35; }
    p.guardCd = Math.max(0, (p.guardCd || 0) - dt);
    if (p.state !== "crouch") { if (p.guardT > 0) { p.guardT = 0; p.guardCd = 0.25; } p.crouchT = 0; p.healing = false; }
  }
  /* Down, still on the ground: the shield for half a second, then (held) healing */
  function stepGuard(p, dt) {
    if (!p.crouchT && !(p.guardCd > 0)) { p.guardT = p.guard0 = guardOf(p.c); SFX.set(); }
    p.crouchT = (p.crouchT || 0) + dt;
    p.healing = p.crouchT > 0.8 && p.hp < p.hpMax;
    if (p.healing) p.hp = Math.min(p.hpMax, p.hp + (HEAL[p.c.id] || 6) * p.hpMax / 100 * dt);
  }
  /* the shield, a bubble of light round them; healing, green sparks rising */
  function drawAura(f, dt) {
    if (!f.aura) { f.aura = new THREE.Sprite(glowMat(0x9ad8ff, 0.5)); f.aura.visible = false; world.group.add(f.aura); }
    const card = ITEMS && f.shield && !f.dead;                 // a shield: Sonic Advance 3's own, see-through, turning
    if (ITEMS) {
      if (!f.shCard) { f.shCard = makeCard("items", "ghost"); world.group.add(f.shCard); }
      f.shCard.visible = !!card;
      if (card) setFrame(f.shCard, f.shield === "magnet" ? "shield.magnet" : "shield.green", Math.floor(world.t * 14) % 6, 1, f.x, f.y + f.hh * 0.5 + (f.c.lift || 0), true, 0.32, 1.05);
      /* invincibility: eight little sparkles circling the runner like a turning ball of stars --
         two tilted rings going round, the near side in front of the runner, the far side behind,
         each twinkling through the sparkle's frames */
      if (!f.spCards) { f.spCards = []; for (let k = 0; k < 8; k++) { const m = makeCard("items", "fx"); world.group.add(m); f.spCards.push(m); } }
      const lit = f.star > 0 && !f.dead, cy = f.y + f.hh * 0.5 + (f.c.lift || 0), R = 0.62 + f.c.w * 0.25;
      f.spCards.forEach((m, k) => {
        m.visible = !!lit;
        if (!lit) return;
        const ring = k % 2, lat = ring ? 0.5 : -0.5, a = world.t * (ring ? 5.2 : -4.4) + k * PI / 4, hr = R * Math.cos(lat);
        setFrame(m, "sparkle", (Math.floor(world.t * 20) + k * 2) % 6, 1, f.x + Math.cos(a) * hr, cy + R * Math.sin(lat) + Math.sin(a * 2) * 0.08,
                 true, 0.06 + Math.sin(a) * hr, 0.34 + 0.08 * Math.sin(a));
      });
    }
    const up = !f.ko && !f.out && !f.dead, sb = SBFX();
    /* guarding: Sonic Battle's barrier, a swirl that opens into a ring round them and fades, over the
       shield's half second (the plain glow without the sheet, and for Metal's Black Shield) */
    const guard = f.guardT > 0 && up;
    f.gT = guard ? (f.gOn ? (f.gT || 0) + dt : 0) : 0; f.gOn = guard;
    if (sb && !f.gCard) { f.gCard = makeCard("sbfx", "fx"); world.group.add(f.gCard); }
    if (f.gCard) {
      f.gCard.visible = !!guard;
      if (guard) {
        const L = framesOf("sbfx", "guard").length, i = Math.min(L - 1, Math.floor(f.gT / Math.max(0.2, f.guard0 || 0.5) * L));
        setFrame(f.gCard, "guard", i, f.face, f.x, f.y + f.hh * 0.5 + (f.c.lift || 0), true, 0.35, Math.max(1, f.hh * 0.95 + 0.1));
      }
    }
    const on = ((guard && !sb) || (f.shield && !ITEMS)) && up;
    f.aura.visible = !!on;
    if (on) { const k = 2.4 + Math.sin(world.t * 30) * 0.08; f.aura.scale.set(k, k, 1); f.aura.position.set(f.x, f.y + f.hh * 0.5 + (f.c.lift || 0), 0.35); }
    /* healing: the green ring, round them flat, rising from their feet up over them and again */
    const heal = f.healing && up;
    if (sb && !f.hCard) { f.hCard = makeCard("sbfx", "fx"); world.group.add(f.hCard); }
    if (f.hCard) {
      f.hCard.visible = !!heal;
      if (heal) {
        const r = (world.t * 1.25) % 1;
        setFrame(f.hCard, "heal", Math.floor(world.t * 16) % framesOf("sbfx", "heal").length, 1, f.x, f.y + 0.05 + r * f.hh * 0.85 + (f.c.lift || 0), true, 0.38, Math.max(1, f.c.w * 1.7));
      }
    }
    if (heal && !sb && Math.random() < dt * 16) world.parts.list.push({ x: f.x + (Math.random() - 0.5) * 0.9, y: f.y + 0.2, z: 0.3, vx: 0, vy: 4 + Math.random() * 2, vz: 0,
      life: 0.45, s: 0.07, c: Math.random() < 0.55 ? 0x7ae08a : 0xffffff });
  }

  /* KO'd: thrown up and down, flat out a moment; then back in from above, unless their lives
     are spent (Survival), or the match is over */
  function koFighter(q, by) {
    const B = battle;
    q.ko = true; q.koT = 2.2; q.hp = 0; q.state = "run"; q.guardT = 0; q.healing = false; q.juggle = false;
    if (SBFX()) effect("sbfx", "ko", q.x, q.y + q.hh * 0.5, 1, 22, true, "fx", 1.6);
    q.vy = Math.max(q.vy, 9); q.vx = (sgn(q.x - (by ? by.x : q.x)) || -q.face) * 5; q.ground = false; q.on = null;
    hitStop(0.22); shakeCam(0.3);
    const last = B.cfg.rule === "stock" && q.lives <= 1 && B.fs.filter(f => !f.elim && f !== q && rivals(f, q)).length > 0 && B.fs.filter(f => !f.elim && f !== q && !rivals(f, q)).length === 0;
    camPunch(q.x, q.y + q.hh * 0.5, last ? 1.25 : 0.9, last ? 1.5 : 1.0, true);
    if (last) slowMo(0.6);
    flash(q.x, q.y + q.hh * 0.5, 3.6, HIT_C[by ? by.c.id : q.c.id] || 0xffffff);
    burst(q.x, q.y + q.hh * 0.5, [0xffffff, 0xf2d040, 0xe8403a], 22, 7);
    SFX.impact(); SFX.fall();
    q.downs++;
    if (B.cfg.rule === "stock") { q.lives--; if (q.lives <= 0) q.elim = true; }
    else if (by && rivals(by, q)) by.score++;
    if (by && rivals(by, q)) by.kos++;
    caption("KO!");
    checkWin();
  }
  function stepKO(p, dt) {
    p.koT -= dt; p.state = "run"; p.vx *= Math.pow(0.15, dt);
    if (!p.ground) p.vy = Math.max(p.vy - GRAV * dt, -22);
    integrate(p, dt);
    if (p.koT <= 0) { if (p.elim) p.out = true; else if (battle && !battle.over) respawnFighter(p); else p.koT = 0.5; }
  }
  const spawnXs = W => [8.5, W - 8.5, 13.5, W - 13.5];
  /** the floor at x: the highest ground under the open sky (not a ledge) */
  function floorAt(x) {
    const i = Math.floor(x);
    for (let j = H - 2; j >= 0; j--) { const c = tile(i, j); if (c === "/" || c === "\\") return slopeY(c, i, j, x); if (solid(c)) return j + 1; }
    return 4;
  }
  function respawnFighter(p) {
    const B = battle, W = world.W;
    let best = spawnXs(W)[0], bd = -1;
    for (const x of spawnXs(W)) {
      const d = Math.min(99, ...B.fs.filter(f => f !== p && !f.out && !f.ko).map(f => Math.abs(f.x - x)));
      if (d > bd) { bd = d; best = x; }
    }
    Object.assign(p, { ko: false, x: best, y: floorAt(best) + 5, vx: 0, vy: 0, ground: false, on: null, onTile: null, state: "run", hp: p.hpMax, inv: 1.6,
                       curl: false, mv: null, sp: null, tor: null, er: null, airUses: 0, airMove: false, airSp: false, flyLeft: p.c.flyTime || 0,
                       star: 0, rev: 0, dead: 0, guardT: 0, healing: false, crouchT: 0, cmb: { n: 0, dmg: 0 }, juggle: false, chase: false, buf: null, smashT: 0, spike: false });
    p.face = best < W / 2 ? 1 : -1;
    burst(p.x, p.y + 0.5, [0xffffff, 0xfff3a0], 10, 3);
  }
  /* Bodies: a fighter curled, rolling, homing, gliding or diving hurts the other side's when they
     meet, as a badnik is beaten (dropping on a head does nothing here: stomping is the stages').
     Fighters standing in each other are eased apart. */
  function contacts(dt) {
    const fs = battle.fs.filter(f => !f.ko && !f.out);
    for (const p of fs) {
      p.bodyT = Math.max(0, (p.bodyT || 0) - dt);
      for (const q of fs) {
        if (q === p || !rivals(p, q) || q.ko) continue;
        const ox = Math.min(p.x + p.c.w / 2, q.x + q.c.w / 2) - Math.max(p.x - p.c.w / 2, q.x - q.c.w / 2);
        const oy = Math.min(p.y + p.hh, q.y + q.hh) - Math.max(p.y, q.y);
        if (ox <= 0 || oy <= 0) continue;
        if (!p.bodyTok || p.bodyT <= 0) { p.bodyTok = {}; p.bodyT = 0.4; }
        actor = p;
        if (attacking(p) && p.state !== "atk" && p.state !== "tornado") {
          const homing = p.state === "homing", v = Math.max(8, Math.abs(p.vx) * 0.8);
          tok(p.bodyTok, homing ? 7 : 6, 0.8);
          if (hitFighter(q, { vx: (sgn(p.vx) || p.face) * v, vy: homing ? 6 : 7 }, p.x)) {
            hitSpark((p.x + q.x) / 2, q.y + q.hh * 0.5, 1.1, HIT_C[p.c.id] || 0xffffff); hitStop(0.04); shakeCam(0.08); SFX.hit();
            if (homing) { p.state = "run"; p.vy = 10; p.vx = p.face * 4; p.airMove = false; p.airUses = 0; p.curl = true; }
            else if (p.curl && !p.ground && p.vy < 0) p.vy = 9;
            else if (p.state === "roll" || p.state === "dash") p.vx *= 0.4;
          }
        }   // (dropping on a head does nothing in a battle: stomping is for the stages)
        actor = null;
      }
    }
    for (let a = 0; a < fs.length; a++) for (let b = a + 1; b < fs.length; b++) {
      const p = fs[a], q = fs[b], ox = (p.c.w + q.c.w) / 2 * 0.8 - Math.abs(p.x - q.x);
      if (ox <= 0 || Math.abs(p.y - q.y) > 0.9) continue;
      const d = sgn(p.x - q.x) || (a % 2 ? 1 : -1), push = Math.min(ox / 2, 0.05);
      moveX(p, d * push); moveX(q, -d * push);
    }
  }

  /* Each runner's stage has its arena: forty metres of its own ground, walled at both ends by
     nothing you can see (as Sonic Battle's are), ledges to fight from -- three layouts, by turns:
     ledges over the floor; a mound in the middle; raised ends and one long ledge. */
  const ARENA_W = 40;
  function arenaDef(i) {
    const st = stages()[i] || stages()[0], W = ARENA_W, HH = 32;
    const g = Array.from({ length: HH }, () => Array(W).fill("."));
    for (let j = 0; j < 4; j++) for (let x = 0; x < W; x++) g[j][x] = "#";
    const plank = (x0, x1, j) => { for (let x = x0; x <= x1; x++) g[j][x] = "-"; };
    const L = i % 3;
    if (L === 0) { plank(5, 11, 7); plank(28, 34, 7); plank(16, 23, 10); }
    else if (L === 1) { g[4][15] = "/"; for (let x = 16; x <= 23; x++) g[4][x] = "="; g[4][24] = "\\"; plank(4, 10, 8); plank(29, 35, 8); plank(17, 22, 11); }
    else { for (let x = 0; x <= 5; x++) g[4][x] = "="; g[4][6] = "\\"; for (let x = 34; x < W; x++) g[4][x] = "="; g[4][33] = "/"; plank(12, 27, 8); plank(4, 9, 11); plank(30, 35, 11); }
    g[4][12] = "T"; g[4][28] = "T"; g[6][20] = "P";
    const lines = [];
    for (let r = 0; r < HH; r++) lines.push(g[HH - 1 - r].join(""));
    return { id: "arena-" + st.id, name: st.name, sub: st.sub, theme: st.theme, who: st.who, arena: true, chunks: [lines.join("\n")] };
  }
  const stageAt = id => Math.max(0, stages().findIndex(s => s.id === id));
  /* An arena's picture, for the setups (as Sonic Battle shows the stage you pick): its world
     built to one side, every chunk of it, seen from where a battle's camera stands when it is
     furthest out, rendered once at twice the size and kept, smoothed down, as a little canvas. */
  const ARENA_PICS = {};
  function arenaPic(i) {
    if (ARENA_PICS[i]) return ARENA_PICS[i];
    if (!R) return null;
    const keep = { scene, camera, sun, hemi, H };
    let out = null, rt = null;
    try {
      const w = buildWorld(arenaDef(i));
      for (const i0 of w.pending.splice(0)) for (const m of buildChunk(w.S, w.T, i0, Math.min(w.W, i0 + 16))) w.group.add(m);
      for (const f of w.far.userData.anim) f(0);
      const PW = 640, PH = 360, T = Math.tan(17 * PI / 180), D = 34, cx = w.W / 2, cy = 4 + T * D * 0.62;
      camera.aspect = PW / PH; camera.updateProjectionMatrix();
      camera.position.set(cx, cy + 1.9, D); camera.lookAt(cx, cy, 0);
      sun.position.set(cx + w.T.sun[2][0], w.T.sun[2][1], w.T.sun[2][2]); sun.target.position.set(cx, cy - 2, 0);
      rt = new THREE.WebGLRenderTarget(PW, PH);
      rt.texture.encoding = R.outputEncoding;
      R.setRenderTarget(rt); R.render(scene, camera);
      const px = new Uint8Array(PW * PH * 4);
      R.readRenderTargetPixels(rt, 0, 0, PW, PH, px);
      const big = document.createElement("canvas"); big.width = PW; big.height = PH;
      const img = big.getContext("2d").createImageData(PW, PH), row = PW * 4;
      for (let y = 0; y < PH; y++) img.data.set(px.subarray((PH - 1 - y) * row, (PH - y) * row), y * row);   // GL's rows run bottom up
      big.getContext("2d").putImageData(img, 0, 0);
      out = document.createElement("canvas"); out.width = PW / 2; out.height = PH / 2;
      const g = out.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(big, 0, 0, PW / 2, PH / 2);
      scene.traverse(o => { if (o.geometry && !o.userData.keep && !Object.values(PROPS).includes(o.geometry)) o.geometry.dispose(); });
      if (scene.background && scene.background.dispose) scene.background.dispose();
    } catch (e) { out = null; }
    finally {
      if (R) R.setRenderTarget(null);
      if (rt) rt.dispose();
      ({ scene, camera, sun, hemi, H } = keep);
    }
    return (ARENA_PICS[i] = out);
  }
  /* the setups' arena picker: the picture over the arrows */
  const openArenas = () => stages().map((z, i) => i).filter(i => unlocked(i));
  const arenaPick = i => i < 0 ? `
    <div class="adv-arena">
      <div class="adv-arena-pic in adv-arena-rand"><b>?</b></div>
      ${arrows("arena", "Random")}
    </div>` : `
    <div class="adv-arena">
      <div class="adv-arena-pic${ARENA_PICS[i] ? " in" : ""}"><canvas width="320" height="180" data-arena="${i}"></canvas></div>
      ${arrows("arena", esc(stages()[i].name))}
    </div>`;
  function paintArena(ov) {
    const cv = ov.querySelector("canvas[data-arena]"); if (!cv) return;
    const i = +cv.dataset.arena;
    const go = () => { if (!cv.isConnected) return; const pic = arenaPic(i); if (pic) { cv.getContext("2d").drawImage(pic, 0, 0); cv.parentNode.classList.add("in"); } };
    if (ARENA_PICS[i]) go(); else setTimeout(go, 160);   // built once the picker rests on it, not for each arena gone past
  }

  /** Start a fight: cfg = { kind: "battle" | "training" | "story", slots: [{ who, ctl: "p1" |
      "p2" | "cpu", lvl, team, dummy }], teams, arena, rule: "ko" | "stock", goal, time, hp }. */
  function startBattle(cfg) {
    endBattle();
    disposeWorld();
    const arenaI = cfg.arena == null || cfg.arena < 0 ? randomArena() : cfg.arena;           // (Random: a new one each fight)
    world = buildWorld(arenaDef(arenaI));
    const W = world.W, xs = spawnXs(W);
    const fs = cfg.slots.map((s, i) => {
      const pool = s.ctl === "cpu" || s.ctl === "net" ? CAST : CAST.filter(c => hasFighter(c.id));
      const who = s.who === "random" ? pool[Math.floor(Math.random() * pool.length)].id : s.who;   // Random: new each fight (a player's, from the team)
      const f = makePlayer(castOf(who), s.em), x = xs[i];
      return Object.assign(f, { x, y: floorAt(x), face: x < W / 2 ? 1 : -1, slot: i, ctl: s.ctl, lvl: s.lvl == null ? 1 : s.lvl, team: cfg.teams ? s.team : i,
        inp: newInput(), hits: new WeakSet(), hpMax: hpOf(f.c, cfg.hp), hp: hpOf(f.c, cfg.hp), score: 0, lives: cfg.rule === "stock" ? cfg.goal : 0, kos: 0, downs: 0, dealt: 0,
        landed: 0, blocked: 0, cmb: { n: 0, dmg: 0 }, sinceHit: 9, burst: BURST_MAX, callT: 0, ai: aiNew(s), alive: true, h: f.hh, guardT: 0, guardCd: 0, check: { x, y: 6 },
        net: s.net || null, netName: s.net ? s.name || null : null });
    });
    const humans = fs.filter(f => f.ctl !== "cpu");
    battle = { cfg, fs, live: false, over: false, intro: cfg.kind === "training" ? 0.6 : 1.7, clock: cfg.time || 0, duo: fs.some(f => f.ctl === "p2"),
               teams: !!cfg.teams, lead: humans[0] || fs[0], t: 0, endT: 0, arena: arenaI };
    player = battle.lead;
    for (const k in keys) keys[k] = 0;
    duoKeys.forEach(m => { for (const k in m) m[k] = 0; });
    camX = W / 2; camY = 8; camD = 24; acc = 0; last = 0; stopT = 0; shake = 0; slowT = 0; punch = null;
    const box = host.querySelector(".adv-3d");
    if (box && R.domElement.parentNode !== box) box.appendChild(R.domElement);
    R.domElement.__w = 0;
    mode = "play"; paused = false;
    host.querySelector(".adv-ov").innerHTML = "";
    host.classList.add("playing");
    buildBattleHud();
    caption(cfg.tutorial ? "Tutorial" : cfg.kind === "training" ? "Training" : "Ready");
    music();
  }
  /* the fighters off the stage: the world stays (a story scene goes on in front of it) */
  function endBattle() {
    TUT = null;
    if (!battle) return;
    for (const f of battle.fs) for (const m of [f.spr, f.dust, f.aura, f.shCard, ...(f.spCards || [])]) if (m) world.group.remove(m);
    battle = null; actor = null; input = INPUT0;
    duoKeys.forEach(m => { for (const k in m) m[k] = 0; });
    if (world) player = makePlayer(castOf(runnerId()));
    const h = host && host.querySelector(".adv-hud"); if (h) { h.classList.remove("on"); h.innerHTML = ""; }
  }
  function battleTick(h) {
    const B = battle, w = world;
    w.t += h; B.t += h;
    if (!B.live && !B.over) { B.intro -= h; if (B.intro <= 0) { B.live = true; if (B.cfg.kind !== "training") caption("Go!"); } }
    if (B.live && !B.over && B.cfg.time && B.cfg.kind === "battle") { B.clock -= h; if (B.clock <= 0) { B.clock = 0; timeUp(); } }
    if (B.over) {
      B.endT -= h;
      if (B.endT < 1.9 && !B.said) { B.said = true; caption(B.winner == null ? "Draw" : winnerLine(B.winner), true); SFX.goal(); }
      if (B.endT <= 0) { battleOver(); return; }
    }
    for (const f of B.fs) {
      f.alive = !f.ko && !f.out; f.h = f.hh; f.sinceHit += h;
      if (B.live && !f.ko) f.burst = Math.min(BURST_MAX, (f.burst || 0) + h * 2);   // the burst gauge, filling with time
      if (f.callT > 0) f.callT -= h;
      if (f.out) continue;
      if (f.ctl === "cpu") aiThink(f, h);
      else if (f.ctl === "net") npInput(f, B.live && !B.over);
      else if (B.live && !B.over) readInput(f.inp, f.ctl === "p2" ? 1 : 0);
      else { const I = f.inp; I.L = I.R = I.U = I.D = I.J = I.Z = I.X = I.C = 0; }
      if (B.cfg.kind === "training" && !TUT && f.sinceHit > 1.6 && f.hp < f.hpMax) f.hp = Math.min(f.hpMax, f.hp + 0.4 * f.hpMax * h);   // health comes back, between strings (the tutorial keeps its own)
    }
    for (const f of B.fs) { if (f.out) continue; player = f; input = f.inp; actor = f; step(h); }
    actor = null; input = INPUT0; player = B.lead;
    contacts(h);
    if (TUT && B.cfg.tutorial && B.live) tutTick(h);
    worldStep(h);
    for (const f of B.fs) { const I = f.inp; I.jp = I.zp = I.xp = I.cp = 0; I.dash = 0; }
  }
  /* each side's tally: KOs, lives and health left, fighters still in */
  function sides() {
    const m = new Map();
    for (const f of battle.fs) {
      const t = m.get(f.team) || { team: f.team, score: 0, lives: 0, hp: 0, alive: 0, fs: [] };
      t.score += f.score; t.lives += f.elim ? 0 : f.lives; t.hp += f.out ? 0 : f.hp / f.hpMax; t.alive += f.elim ? 0 : 1; t.fs.push(f);
      m.set(f.team, t);
    }
    return [...m.values()];
  }
  function checkWin() {
    const B = battle; if (!B || B.over || B.cfg.kind === "training") return;
    const S = sides();
    if (B.cfg.rule === "stock") { const left = S.filter(t => t.alive > 0); if (left.length <= 1) winBattle(left.length ? left[0].team : null); }
    else { const top = S.find(t => t.score >= B.cfg.goal); if (top) winBattle(top.team); }
  }
  /* time: the most KOs win; in Survival the most lives, then the most health; level is a draw */
  function timeUp() {
    caption("Time!");
    const key = t => battle.cfg.rule === "stock" ? t.lives * 1000 + t.hp : t.score;
    const S = sides().sort((a, b) => key(b) - key(a));
    winBattle(S.length > 1 && key(S[0]) === key(S[1]) ? null : S[0].team);
  }
  function winBattle(team) {
    const B = battle; B.over = true; B.live = false; B.winner = team; B.endT = 3.4;
  }
  function winnerLine(team) {
    const fs = battle.fs.filter(f => f.team === team);
    if (battle.teams) return (fs.length > 1 ? fs.map(f => f.c.name).join(" & ") + " win!" : fs[0].c.name + " wins!");
    return fs[0].c.name + " wins!";
  }

  // ---------------------------------------------------------------- the CPU
  /* A CPU fighter reads the fight a few times a second (Easy slowest, Hard quickest), and never
     throws a blow at nothing: it attacks only with its mark in reach, on its level and open to
     it (not untouchable, not lying down but for an OTG). It goes where its mark is -- up after
     one on a plank above (a jump, and its air action at the top), down off its own plank after
     one below; one it can't reach up there it waits for under the plank, its launcher ready.
     Each has a way of fighting (its style, mostly its runner's): RUSH, in close and combo;
     ZONE, keep off at shot range and fire, backing away from one who comes close (traps for
     them); COUNTER, hover just outside reach, guard and parry, and punish. Anyone left open --
     parried, reeling, whiffing a blow up close -- is punished, whatever the style.
     Its combos are planned and played as a player plays them: the next press only once the
     last blow has landed (the routes: jabs into the launcher, a super jump, an air combo and the
     chase; the auto combo into the smash; jabs into the heavy, a special or the aim attack); a
     blow that misses ends the plan. Easy drops its combos now and then, Normal now and again,
     Hard never. It guards (and so may parry) what it sees coming, bursts out of long combos,
     chases its own launches and picks up its own knockdowns (OTG), and heals when hurt and far. */
  const AI_LV = [
    { think: 0.5, guard: 0.12, shotGuard: 0.4, lead: 0.22, sp: 0.1, aim: 0.05, jumpIn: 0.15, air: 2, chase: 0.35, launch: 0.2, sj: 0, burstN: 9, burst: 0.3, drop: 0.14, punish: 0.4, aa: 0.25,
      routes: [0.05, 0.25, 0.3, 0.2, 0.08, 0.07, 0.05, 0] },
    { think: 0.28, guard: 0.38, shotGuard: 0.75, lead: 0.13, sp: 0.18, aim: 0.1, jumpIn: 0.22, air: 5, chase: 0.7, launch: 0.4, sj: 0.25, burstN: 6, burst: 0.55, drop: 0.04, punish: 0.75, aa: 0.55,
      routes: [0.27, 0.2, 0.15, 0.08, 0.06, 0.04, 0.1, 0.1] },
    { think: 0.15, guard: 0.62, shotGuard: 0.92, lead: 0.07, sp: 0.24, aim: 0.14, jumpIn: 0.26, air: 9, chase: 0.95, launch: 0.55, sj: 0.55, burstN: 4, burst: 0.8, drop: 0, punish: 0.95, aa: 0.85,
      routes: [0.42, 0.1, 0.1, 0.04, 0.04, 0.04, 0.12, 0.14] },
  ];
  const AI_STYLE = { sonic: "rush", shadow: "rush", knuckles: "rush", amy: "rush", mighty: "rush", metal: "rush", emerl: "rush",
                     tails: "zone", cream: "zone", gamma: "zone", eggman: "zone", silver: "zone", rouge: "counter", chaos: "counter" };
  const aiNew = s => ({ t: 0.4 + Math.random() * 0.4, q: [], qt: 0, dir: 0, hold: 0, D: 0, U: 0, mU: 0, mD: 0, mod: 0, jt: 0, ct: 0,
                        dummy: s.dummy || null, wander: Math.random() < 0.5 ? -1 : 1, wt: 0, style: null, plan: null, climbCd: 0, climbs: 0, wait: 0 });
  function press(f, a) {
    const I = f.inp, A = f.ai;
    if (a.U) { A.mU = 1; I.U = 1; } if (a.D) { A.mD = 1; I.D = 1; }
    if (a.U || a.D) A.mod = 0.12;
    if (a.k === "j") { I.jp = 1; I.J = 1; A.jt = a.hold || 0.2; }
    else if (a.k === "z") { I.zp = 1; I.Z = 1; }
    else if (a.k === "x") { I.xp = 1; I.X = 1; }
    else if (a.k === "c") { I.cp = 1; I.C = 1; A.ct = a.hold || 0.05; }
  }
  function aiTarget(f) {
    let best = null, bd = 1e9;
    for (const q of battle.fs) if (rivals(f, q) && !q.ko && !q.out) { const d = Math.abs(q.x - f.x) + Math.abs(q.y - f.y) * 1.5 - (q === f.ai.tgt ? 2 : 0); if (d < bd) { bd = d; best = q; } }
    return (f.ai.tgt = best);
  }
  /* a shot on its way to f, and how soon it gets there (seconds; 9 for none) */
  function shotComing(f) {
    let tti = 9, wave = false;
    for (const s of world.shots) {
      if (s.gone || !s.owner || !rivals(s.owner, f) || Math.abs(s.vx) < 0.5) continue;
      const y0 = s.mid ? s.y - s.h / 2 : s.y, y1 = s.mid ? s.y + s.h / 2 : s.y + s.h;
      if (y1 < f.y + 0.05 || y0 > f.y + f.hh + 0.2) continue;                     // passing over or under
      const gap = (f.x - s.x) * sgn(s.vx) - f.c.w / 2 - s.w / 2;                    // still to come
      if (gap < -0.3) continue;
      const t = Math.max(0, gap) / Math.abs(s.vx);
      if (t < tti) { tti = t; wave = !!s.ground; }
    }
    return { tti, wave };
  }
  /* a blow (or, with `shots`, a shot) on its way to f */
  function danger(f, shots) {
    for (const q of battle.fs) {
      if (!rivals(q, f) || q.ko || q.out) continue;
      const dx = f.x - q.x;
      if (Math.abs(dx) < 2.7 && Math.abs(f.y - q.y) < 1.6 && sgn(dx) === q.face &&
          (q.state === "atk" || q.state === "seek" || q.state === "special" || q.state === "tornado" || attacking(q))) return true;
    }
    if (shots) for (const s of world.shots) if (!s.gone && s.owner && rivals(s.owner, f) && Math.abs(s.x - f.x) < 4 && sgn(f.x - s.x) === sgn(s.vx) && Math.abs(s.y - (f.y + 0.6)) < 1.6) return true;
    return false;
  }
  /** whether f's blows reach q from here (with `extra` metres more): close, and on its level */
  const aiReach = (f, q, extra) => Math.abs(q.x - f.x) < f.c.w / 2 + q.c.w / 2 + 0.85 + (extra || 0) && q.y - f.y > -0.9 && q.y - f.y < 1.25;
  /** whether q can be hit at all now (not untouchable, not lying down, not out) */
  const aiOpen = q => !(q.inv > 0.12) && q.state !== "down" && q.state !== "getup" && q.state !== "teleport" && !q.ko && !(q.sp && q.sp.shield);
  /** the plank under q's feet, as [x0, x1] of its run of planks; null on the ground */
  function plankUnder(q) {
    const j = Math.floor(q.y - 0.1), i = Math.floor(q.x);
    if (!q.ground || tile(i, j) !== "-") return null;
    let a = i, b = i; while (tile(a - 1, j) === "-") a--; while (tile(b + 1, j) === "-") b++;
    return [a, b + 1];
  }
  /* The combo routes (weighted per level in AI_LV.routes): steps pressed one at a time, each once
     the last blow has landed. `sj` the super jump (Space as the launcher lands), `air` a step up
     there (pressed once in the air, near them, or as the last air blow lands). */
  const AI_ROUTES = [
    () => [{ k: "z" }, { k: "z" }, { k: "x", U: 1 }, { k: "j", sj: 1 }, { k: "z", air: 1 }, { k: "z", air: 1 }, { k: "z", air: 1 }, { k: "x", D: 1, air: 1 }],
    () => [{ k: "z" }, { k: "z" }, { k: "x", U: 1 }, { k: "x", D: 1 }],
    () => [{ k: "z" }, { k: "z" }, { k: "z" }, { k: "z" }],
    () => [{ k: "z" }, { k: "z" }, { k: "z" }, { k: "x" }],
    () => [{ k: "z" }, { k: "z" }, { k: "c" }],
    () => [{ k: "z" }, { k: "z" }, { k: "x", D: 1 }],
    () => [{ k: "z" }, { k: "z" }, { k: "c" }, { k: "x", D: 1, shot: 1 }],                                   // jabs, the shot, the aim attack after
    () => [{ k: "z" }, { k: "z" }, { k: "c" }, { k: "j", sj: 1, shot: 1 }, { k: "z", air: 1 }, { k: "z", air: 1 }, { k: "x", D: 1, air: 1 }],   // jabs, the shot, a super jump, an air combo
  ];
  function aiPlan(f, L, steps) {
    if (!steps) {
      let r = Math.random(), k = 0;
      while (k < L.routes.length - 1 && r >= L.routes[k]) { r -= L.routes[k]; k++; }
      steps = AI_ROUTES[k]();
    }
    f.ai.plan = { steps, i: 0, t: 0, pressed: false };
    f.ai.q = [];
  }
  /** a combo plan, played: true while it is going (the rest of the thinking waits) */
  function aiRunPlan(f, dt, tgt, L) {
    const A = f.ai, P = A.plan;
    if (!P) return false;
    const end = () => { A.plan = null; return false; };
    if (!tgt || tgt.ko || f.state === "hurt" || f.state === "down" || f.state === "getup" || f.state === "blocked" || f.ko) return end();
    const s = P.steps[P.i]; if (!s) return end();
    if ((P.t += dt) > 1.3) return end();                                   // stuck: let it go
    const m = f.mv, pending = f.buf || (m && m.queue);
    if (pending) return true;
    const open = tgt.state === "hurt" || tgt.state === "blocked";
    /* the last blow is over and they aren't reeling: the combo dropped (or never started) */
    if (P.pressed && !m && f.state !== "seek" && f.state !== "special" && !open && !(s.air && !f.ground) && !(s.shot && f.shotHit > 0)) return end();
    const linkable = m && m.struck && m.t - m.struckAt >= 0.02;
    let go;
    if (s.sj) go = s.shot ? f.shotHit > 0 && !!juggled(f) : m && m.name === "upper" && m.struck;
    else if (s.shot) go = f.shotHit > 0;
    else if (s.air) { if (f.ground && P.pressed && !(m && m.name === "upper")) return end(); go = !f.ground && ((f.state === "run" && Math.hypot(tgt.x - f.x, tgt.y - f.y) < 2.4) || linkable); }
    else if (P.i === 0 && s.aa) { const ddy = tgt.y - f.y; go = (f.state === "run" || f.state === "crouch") && f.ground && Math.abs(tgt.x - f.x) < 1.6 && ddy > 0.5 && ddy < 2.8 && aiOpen(tgt); }
    else if (P.i === 0) go = (f.state === "run" || f.state === "crouch") && f.ground && aiReach(f, tgt) && aiOpen(tgt);
    else go = linkable;
    if (!go) return true;
    if (P.i > 0 && Math.random() < L.drop) return end();                 // (Easy and Normal let some go)
    if (P.i === 0 && f.face !== (sgn(tgt.x - f.x) || f.face)) { f.ai.dir = sgn(tgt.x - f.x); f.ai.hold = 0.03; return true; }   // face them first
    press(f, s.k === "j" ? { k: "j", hold: 0.3 } : s);
    P.i++; P.t = 0; P.pressed = true;
    return true;
  }
  function aiThink(f, dt) {
    const I = f.inp, A = f.ai, B = battle, L = AI_LV[clamp(f.lvl, 0, 2)];
    I.jp = I.zp = I.xp = I.cp = 0; I.dash = 0;
    if (!B.live || B.over || f.ko) { I.L = I.R = I.U = I.D = I.J = I.Z = I.X = I.C = 0; A.q = []; A.plan = null; A.hold = 0; return; }
    if (A.hold > 0) A.hold -= dt; else { A.dir = 0; A.D = 0; A.U = 0; }
    if (A.mod > 0) A.mod -= dt; else { A.mU = 0; A.mD = 0; }
    if (A.jt > 0) A.jt -= dt;
    if (A.ct > 0) A.ct -= dt;
    A.climbCd = Math.max(0, A.climbCd - dt); A.wait = Math.max(0, A.wait - dt);
    I.L = A.dir < 0 ? 1 : 0; I.R = A.dir > 0 ? 1 : 0; I.U = A.U || A.mU ? 1 : 0; I.D = A.D || A.mD ? 1 : 0; I.J = A.jt > 0 ? 1 : 0;
    I.Z = 0; I.X = 0; I.C = A.ct > 0 ? 1 : 0;
    /* caught in a long combo with the gauge full: the burst, once a combo (if it thinks of it) */
    if (!A.dummy && f.burst >= BURST_MAX && (f.state === "hurt" || f.state === "down") && f.cmb.n >= L.burstN && A.burstFor !== f.cmb) {
      A.burstFor = f.cmb;
      if (Math.random() < L.burst) { I.zp = I.xp = 1; I.Z = I.X = 1; A.plan = null; return; }
    }
    const tgt = aiTarget(f);
    /* timed presses (a jump, a jump-in): an attack in one with nothing there to hit is dropped */
    if (A.q.length) {
      A.qt += dt;
      while (A.q.length && A.qt >= A.q[0].at) {
        const a = A.q[0];
        if ((a.k === "z" || a.k === "x") && !a.free && tgt && !(f.ground ? aiReach(f, tgt, 0.4) : Math.hypot(tgt.x - f.x, tgt.y - f.y) < 2.2)) { A.q = []; break; }
        press(f, A.q.shift());
      }
    }
    if (A.dummy && A.dummy !== "fight") return dummyThink(f, dt);
    if (!tgt) return;
    if (aiRunPlan(f, dt, tgt, L)) return;
    if (!A.style) A.style = Math.random() < 0.7 ? AI_STYLE[f.c.id] || "rush" : ["rush", "zone", "counter"][Math.floor(Math.random() * 3)];
    const dx = tgt.x - f.x, dy = tgt.y - f.y, adx = Math.abs(dx), toward = sgn(dx) || f.face, free = f.state === "run" || f.state === "crouch";
    /* a shot coming: it guards as it gets there -- Hard right as it touches (a parry), Normal a
       little early (a block), Easy earlier and less often */
    if (f.ground && free) {
      const sc = shotComing(f);
      if (sc.tti < L.lead + 0.03 && !A.shotSeen) {
        A.shotSeen = true;
        if (Math.random() < L.shotGuard) {
          A.plan = null; A.q = []; A.dir = 0;
          A.D = 1; A.hold = 0.35; A.t = 0.4;
          return;
        }
      } else if (sc.tti > 0.6) A.shotSeen = false;
    }
    // a blow coming: it may see it in time and guard (a counter-fighter most of all)
    const threat = danger(f);
    if (threat && !A.seen) {
      A.seen = true;
      if (f.ground && free && Math.random() < L.guard + (A.style === "counter" ? 0.2 : 0)) { A.q = []; A.dir = 0; A.D = 1; A.hold = 0.42; A.t = 0.45; return; }
    } else if (!threat) A.seen = false;
    /* its own combo going without a plan: a rival it put in the air, after them; one it knocked
       down, picked up (OTG) */
    const up = juggled(f);
    if (up && up.jBy === f && A.chased !== up.cmb) {
      A.chased = up.cmb;
      if (Math.random() < L.chase) {
        if (f.state === "atk" && f.mv && f.mv.name === "upper" && Math.random() < L.sj) aiPlan(f, L, [{ k: "j", sj: 1 }, { k: "z", air: 1 }, { k: "z", air: 1 }, { k: "z", air: 1 }, { k: "x", D: 1, air: 1 }]);
        else { A.q = [{ at: 0.08, k: "x", D: 1, free: true }]; A.qt = 0; }
        return;
      }
    }
    const low = battle.fs.find(q => q.state === "down" && q.jBy === f && !q.cmb.otg && rivals(f, q) && Math.abs(q.x - f.x) < 3.5);
    if (low && A.otg !== low.cmb) { A.otg = low.cmb; if (Math.random() < L.chase) { A.dir = sgn(low.x - f.x); A.hold = 0.05; A.q = [{ at: 0.05, k: "x", D: 1, free: true }]; A.qt = 0; return; } }
    // in the air beside its mark: the air attack
    if (!f.ground && !f.airMove && f.state === "run" && adx < 1.9 && Math.abs(dy) < 1.3 && aiOpen(tgt) && Math.random() < dt * L.air) press(f, { k: "z" });
    // a wall in the way: over it
    if (A.dir && f.ground && Math.abs(f.vx) < 0.5 && solid(tile(Math.floor(f.x + A.dir * (f.c.w / 2 + 0.3)), Math.floor(f.y + 0.5))) && !A.q.length) press(f, { k: "j", hold: 0.3 });
    /* steering while it climbs: over the plank it's going for */
    if (!f.ground && A.climbX != null && f.state !== "atk") { A.dir = sgn(A.climbX - f.x) || 0; A.hold = 0.05; }
    if (f.ground) A.climbX = null;
    A.t -= dt;
    if (A.t > 0 || A.q.length || A.hold > 0 || !free) return;
    A.t = L.think * (0.7 + Math.random() * 0.6);
    A.qt = 0;
    const r = Math.random(), level = Math.abs(dy) < 1, faced = f.face === toward, open = aiOpen(tgt);
    const reach = aiReach(f, tgt), W = world.W, cornered = (f.x < 3.5 && toward > 0) || (f.x > W - 3.5 && toward < 0);
    const shotReady = !(f.cd && f.cd.shot > 0), rec = tgt.state === "atk" && tgt.mv && !tgt.mv.struck && Math.floor(tgt.mv.t * tgt.mv.fps) > tgt.mv.h1;
    /* hurt, and out of reach: heal */
    if (f.hp < f.hpMax * 0.3 && adx > 9 && f.ground && r < 0.35) { A.dir = 0; A.D = 1; A.hold = 1.4; return; }
    /* open: parried, reeling, or whiffing a blow up close -- punish it */
    if (open && level && adx < 3.4 && (tgt.state === "blocked" || rec) && Math.random() < L.punish) {
      if (reach) return aiPlan(f, L);
      A.dir = toward; A.hold = 0.2; if (adx > 2.2) I.dash = toward; return;
    }
    /* they're up on a plank: up after them (a jump, the air action at the top), or wait below */
    if (dy > 1.3 && tgt.ground && f.ground) {
      const pl = plankUnder(tgt);
      if (A.climbs >= 3 && A.wait <= 0) { A.wait = 4; A.climbs = 0; }
      if (A.wait > 0) {                                              // can't get up there: wait under its end, launcher ready
        const ux = pl ? (Math.abs(f.x - pl[0]) < Math.abs(f.x - pl[1]) ? pl[0] - 0.8 : pl[1] + 0.8) : tgt.x;
        if (Math.abs(ux - f.x) > 0.8) { A.dir = sgn(ux - f.x); A.hold = 0.15; }
        else if (A.style === "zone" && shotReady && r < L.sp) A.q = [{ at: 0, k: "c", U: 1 }];
        return;
      }
      const gx = pl ? clamp(f.x, pl[0] - 0.9, pl[1] + 0.9) : tgt.x;          // under the plank's near end
      if (Math.abs(gx - f.x) > 1.0) { A.dir = sgn(gx - f.x); A.hold = 0.12; if (Math.abs(gx - f.x) > 6 && r < 0.4) I.dash = sgn(gx - f.x); return; }
      if (A.climbCd <= 0) {
        A.climbCd = 1.7; A.climbs++; A.climbX = pl ? clamp(tgt.x, pl[0] + 0.6, pl[1] - 0.6) : tgt.x;
        A.q = [{ at: 0, k: "j", hold: 0.45 }, { at: 0.36, k: "j", hold: 0.35 }, { at: 0.62, k: "j", hold: 0.3 }];
      }
      return;
    }
    if (dy > -0.6) A.climbs = Math.max(0, A.climbs - (level ? 1 : 0));
    /* they're below and it's on a plank: down to them (through the plank, or off its end) */
    if (dy < -1.3 && f.ground) {
      if (plankUnder(f) && adx < 4 && r < 0.6) { A.q = [{ at: 0, k: "j", D: 1 }]; return; }
      A.dir = toward; A.hold = 0.2; return;
    }
    /* right above it in the air, coming down: the launcher (anti-air) */
    if (!tgt.ground && dy > 0.6 && dy < 2.1 && adx < 1.4 && tgt.vy < 0.5 && f.ground && open && r < L.aa) { if (!faced) { A.dir = toward; A.hold = 0.03; } return aiPlan(f, L, [{ k: "x", U: 1, aa: 1 }, { k: "x", D: 1 }]); }
    /* in reach and open: a combo (or now and then the power or a trap, close in) */
    if (reach && open) {
      if (r < L.sp * 0.5 && faced) { A.q = [{ at: 0, k: "c", U: 1 }]; return; }
      if (A.style === "zone" && r < 0.3 && !cornered) { A.dir = -toward; A.hold = 0.3; if (r < 0.15) I.dash = -toward; return; }   // a zoner gets out
      return aiPlan(f, L);
    }
    if (reach && !open) { A.dir = adx < 1.2 ? -toward : 0; A.hold = 0.12; return; }   // lying down, untouchable: give them room
    /* by style, out of reach */
    if (A.style === "zone") {
      if (adx < 3.6 && !cornered && level) { A.dir = -toward; A.hold = A.t + 0.1; if (r < 0.25) I.dash = -toward; else if (r < 0.32 && f.ground) A.q = [{ at: 0, k: "c", D: 1 }]; return; }
      if (adx <= 8.5 && level && faced && shotReady && r < 0.55) { A.dir = 0; A.q = [{ at: 0, k: "c" }]; return; }
      if (adx <= 8.5 && level && !faced) { A.dir = toward; A.hold = 0.03; return; }
      A.dir = toward; A.hold = A.t + 0.05; if (adx > 9 && r < 0.3) I.dash = toward;
      return;
    }
    if (A.style === "counter" && adx < 4.5 && level && r < 0.75) {
      const want = 2.9 + Math.sin(world.t * 1.7 + f.slot) * 0.4;            // hovering just out of reach
      A.dir = adx > want + 0.3 ? toward : adx < want - 0.3 ? -toward : 0; A.hold = A.t + 0.05;
      if (!A.dir && !faced) { A.dir = toward; A.hold = 0.03; }
      return;
    }
    // rush (and the others, once they close): in, with a jump-in or the aim attack from mid range
    A.dir = toward; A.hold = A.t + 0.05;
    if (adx > 6) { if (f.ground && r > 0.7) I.dash = toward; else if (f.ground && faced && level && shotReady && r < L.sp) { A.dir = 0; A.q = [{ at: 0, k: "c" }]; } return; }
    if (adx > 2.0 && level && open) {
      if (r < L.aim && faced) A.q = [{ at: 0, k: "x", D: 1, free: true }];                                        // the aim attack
      else if (r < L.aim + L.jumpIn && f.ground && adx < 4) A.q = [{ at: 0, k: "j", hold: 0.3 }, { at: 0.28, k: "z" }];   // jump in
      else if (r > 0.82 && f.ground) I.dash = toward;
    }
  }
  /* Training's dummy: stands, guards whatever comes, walks to and fro, jumps, or fights (as a
     Normal CPU) */
  const DUMMY = [["stand", "Stand"], ["guard", "Guard"], ["walk", "Walk"], ["jump", "Jump"], ["fight", "Fight"]];
  function dummyThink(f, dt) {
    const A = f.ai;
    if (A.dummy === "guard") { if ((danger(f) || shotComing(f).tti < 0.2) && f.ground && !(f.guardCd > 0) && f.state !== "crouch" && f.state !== "hurt") { A.D = 1; A.hold = 0.42; } }
    else if (A.dummy === "walk") {
      A.wt += dt;
      if (A.wt > 2.4 || f.x < 5 || f.x > world.W - 5) { if (A.wt > 0.5) { A.wander = f.x < 5 ? 1 : f.x > world.W - 5 ? -1 : -A.wander; A.wt = 0; } }
      A.dir = A.wander; A.hold = 0.05;
    } else if (A.dummy === "jump") { A.wt += dt; if (A.wt > 1.1 && f.ground) { A.wt = 0; press(f, { k: "j", hold: 0.3 }); } }
  }

  // ---------------------------------------------------------------- the battle's picture and HUD
  /* the camera frames everyone in the fight, backing off as they spread out, the floor kept
     near the bottom of the picture */
  let camD = CAM_D;
  /* The strip of the picture the fighters are kept in, from bottom to top (-1 to 1): under the
     health cards, and with the touch pad up, over its buttons (else the floor sits a fifth of
     the way up). Measured off the page now and then. */
  let BAND = null;
  function viewBand(dt) {
    if (BAND && (BAND.t -= dt) > 0) return BAND;
    const box = host.querySelector(".adv-3d"), r0 = box && box.getBoundingClientRect();
    let sb = -0.62, st = 0.72;
    if (r0 && r0.height) {
      const cards = host.querySelector(".adv-fcards"), rc = cards && cards.getBoundingClientRect();
      if (rc && rc.height) st = Math.min(st, 1 - 2 * (rc.bottom - r0.top + 8) / r0.height);
      const keys = [...host.querySelectorAll(".adv-pad button")].map(b => b.getBoundingClientRect()).filter(r => r.height);
      if (keys.length) { const top = Math.min(...keys.map(r => r.top)); sb = Math.max(sb, 1 - 2 * (top - r0.top - 4) / r0.height); }
    }
    if (st - sb < 0.5) st = sb + 0.5;
    return (BAND = { sb, st, t: 0.5 });
  }
  function battleView(aspect, dt) {
    let fs = battle.fs.filter(f => !f.out);
    const sf = npFollowed(); if (sf && !sf.out) fs = [sf];              // a spectator following one fighter: the camera on them
    const T = Math.tan(17 * PI / 180), W = world.W, { sb, st } = viewBand(dt), band = (st - sb) / 2;
    /* a narrow (upright) screen may back off much further; if everyone still won't fit, it keeps
       to the players' own fighters and whoever is nearest each (the rest marked at the edge) */
    const maxD = aspect < 1.2 ? 80 : 40, mx = 3.4, my = 2.2;
    const box = list => {
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for (const f of list) { x0 = Math.min(x0, f.x); x1 = Math.max(x1, f.x); y0 = Math.min(y0, f.y); y1 = Math.max(y1, f.y + f.hh); }
      return { x0, x1, y0, y1, d: Math.max(((x1 - x0) / 2 + mx) / (T * aspect), ((y1 - y0) / 2 + my) / (T * band), 12.5 / (2 * T * aspect)) };
    };
    let bx = fs.length ? box(fs) : { x0: W / 2, x1: W / 2, y0: 4, y1: 5, d: CAM_D };
    const hum = fs.filter(f => f.ctl !== "cpu" && !f.ko);
    if (bx.d > maxD) {
      if (hum.length) {
        const keep = new Set(hum);
        for (const h of hum) { let nb = null, nd = 1e9; for (const f of fs) if (rivals(h, f) && !f.ko) { const d = Math.abs(f.x - h.x); if (d < nd) { nd = d; nb = f; } } if (nb) keep.add(nb); }
        bx = box([...keep]);
      }
    }
    const { x0, x1, y0, y1 } = bx;
    const want = clamp(bx.d, CAM_D, maxD);
    camD = lerp(camD, want, 1 - Math.exp(-dt * 2.5));
    const halfW = T * camD * aspect, halfH = T * camD;
    let tx = (x0 + x1) / 2;
    if (bx.d > maxD && hum.length) tx = clamp(tx, hum[0].x - halfW + 2.4, hum[0].x + halfW - 2.4);   // still too far apart: Player 1 kept in, leaning their foe's way
    tx = halfW * 2 > W ? W / 2 : clamp(tx, halfW - 0.5, W - halfW + 0.5);
    const ty = Math.max((y0 + y1) / 2 - halfH * (st + sb) / 2, 4 - sb * halfH);
    const fast = battle.fs.some(f => f.juggle || f.state === "seek");          // a juggle or a chase: the camera keeps right up with it
    camX = lerp(camX, tx, 1 - Math.exp(-dt * (fast ? 6 : 4))); camY = lerp(camY, ty, 1 - Math.exp(-dt * (fast ? 6.5 : 3)));
    return camD;
  }
  /* each fighter's tag (1P, 2P, CPU) over their head, in their colour */
  const TV = new THREE.Vector3();
  function placeTags() {
    const box = host.querySelector(".adv-3d"), wrap = host.querySelector(".adv-tags"); if (!box || !wrap) return;
    camera.updateMatrixWorld();
    const W = box.clientWidth, Hh = box.clientHeight;
    const calls = host.querySelectorAll(".adv-call");
    battle.fs.forEach((f, i) => {
      const el = wrap.children[i]; if (!el) return;
      if (f.out || f.ko) { el.style.display = "none"; return; }
      TV.set(f.x, f.y + f.hh + (f.c.lift || 0) + 0.3, 0).project(camera);
      el.style.display = "";
      let sx = Math.round((TV.x + 1) / 2 * W), sy = Math.round((1 - TV.y) / 2 * Hh);
      /* out of the picture: held at its edge, pointing the way they are */
      const offL = sx < 22, offR = sx > W - 22;
      el.classList.toggle("offl", offL); el.classList.toggle("offr", offR);
      if (offL || offR) {
        sx = offL ? 14 : W - 14; sy = clamp(sy + 12, 70, Hh - 40);
        el.style.transform = `translate(${sx}px,${sy}px) translate(${offL ? "0" : "-100%"},-50%)`;
      } else el.style.transform = `translate(${sx}px,${sy}px) translate(-50%,-100%)`;
      if (calls[i]) calls[i].style.transform = `translate(${sx}px,${sy - 30}px) translate(-50%,-100%)`;   // a call over the tag
    });
  }
  function padHtml() {
    return `<div class="adv-pad">
        <div class="adv-pad-l"><button data-t="U" class="up" aria-label="Up">${ico("down")}</button><button data-t="L" aria-label="Left">${ico("back")}</button><button data-t="D" class="dn-k" aria-label="Down">${ico("down")}</button><button data-t="R" aria-label="Right">${ico("next")}</button></div>
        <div class="adv-pad-r"><button data-t="Z">Light</button><button data-t="X">Heavy</button><button data-t="C">Special</button><button data-t="J" class="jp">Jump</button></div>
      </div>`;
  }
  function wirePad(el) {
    el.querySelectorAll("[data-t]").forEach(b => {
      const k = b.dataset.t, on = e => { e.preventDefault(); touch[k] = 1; specTap[k] = 1; b.classList.add("dn"); }, off = e => { e.preventDefault(); touch[k] = 0; b.classList.remove("dn"); };
      b.addEventListener("pointerdown", on); b.addEventListener("pointerup", off); b.addEventListener("pointercancel", off); b.addEventListener("pointerleave", off);
    });
  }
  function buildBattleHud() {
    const B = battle, h = host.querySelector(".adv-hud"), tr = B.cfg.kind === "training";
    h.classList.add("on");
    h.innerHTML = `
      <div class="adv-fcards n${B.fs.length}">${B.fs.map((f, i) => `
        <div class="adv-fc" data-i="${i}" style="--tc:${tagCol(f)}">
          <canvas class="adv-fc-face" width="44" height="40"></canvas>
          <div class="adv-fc-r">
            <div class="adv-fc-nm"><b>${esc(f.c.name)}</b><i>${tagText(f)}</i></div>
            <div class="adv-hp"><span></span></div>
            <div class="adv-bu" title="Burst: Z + X when full"><span></span></div>
            <div class="adv-fc-sc"></div>
          </div>
        </div>`).join("")}</div>
      <div class="adv-hr">
        ${B.cfg.time && B.cfg.kind === "battle" ? `<span class="adv-clock num"></span>` : ""}
        <button class="adv-pause" title="Pause (Enter)" aria-label="Pause">II</button>
      </div>
      <div class="adv-combo"><b class="num"></b><i></i></div>
      ${B.cfg.tutorial ? `<div class="adv-tut"></div>` : ""}
      <div class="adv-cap"></div>
      <div class="adv-tags">${B.fs.map(f => `<span class="adv-tag" style="--tc:${tagCol(f)}">${tagText(f)}</span>`).join("")}</div>
      <div class="adv-calls">${B.fs.map(() => `<b class="adv-call"></b>`).join("")}</div>
      ${TOUCH && B.fs.some(f => f.ctl === "p1") ? padHtml() : ""}`;
    h.classList.toggle("tut", !!B.cfg.tutorial);
    h.querySelectorAll(".adv-fc-face").forEach((cv, i) => paintCard(cv, B.fs[i].c.id, "portrait", 1));
    h.querySelector(".adv-pause").onclick = () => togglePause();
    wirePad(h);
    hudCache = {};
  }
  function scoreHtml(f) {
    const B = battle;
    if (B.cfg.kind === "training") return `<b class="num">${Math.ceil(f.hp)}</b><i class="num">/${f.hpMax}</i>`;
    if (B.cfg.rule === "stock") return `<span class="adv-lives">${Array.from({ length: B.cfg.goal }, (_, k) => `<em class="${k < f.lives ? "on" : ""}"></em>`).join("")}</span>`;
    return `<b class="num">${f.score}</b><i class="num">/${B.cfg.goal}</i><small>KO</small>`;
  }
  function battleHud() {
    const B = battle, h = host.querySelector(".adv-hud"); if (!h || !B) return;
    const set = (key, val, fn) => { if (hudCache[key] !== val) { hudCache[key] = val; fn(val); } };
    B.fs.forEach((f, i) => {
      const card = h.querySelector(`.adv-fc[data-i="${i}"]`); if (!card) return;
      const pct = Math.max(0, Math.round(f.hp / f.hpMax * 100));
      set("hp" + i, pct, v => { card.querySelector(".adv-hp span").style.width = v + "%"; card.classList.toggle("low", v <= 30); });
      set("sc" + i, scoreHtml(f), v => { card.querySelector(".adv-fc-sc").innerHTML = v; });
      set("out" + i, !!f.out, v => card.classList.toggle("out", v));
      set("heal" + i, !!f.healing, v => card.classList.toggle("heal", v));
      set("bu" + i, Math.floor(f.burst || 0), v => { card.querySelector(".adv-bu span").style.width = v + "%"; card.classList.toggle("bfull", v >= BURST_MAX); });
      const cl = h.querySelectorAll(".adv-call")[i];
      if (cl) set("call" + i, f.callT > 0 ? f.callN + "|" + f.callTx : "", v => {
        cl.className = "adv-call"; void cl.offsetWidth;
        if (v) { cl.textContent = f.callTx; cl.className = "adv-call on " + (f.callTx === "Burst!" ? (f.burstBlue ? "blue" : "gold") : f.callTx === "Parry!" ? "parry" : "counter"); }
      });
    });
    const ck = h.querySelector(".adv-clock");
    if (ck) set("clk", Math.ceil(B.clock), v => { ck.textContent = Math.floor(v / 60) + ":" + String(v % 60).padStart(2, "0"); ck.classList.toggle("low", v <= 10); });
    const cb = h.querySelector(".adv-combo");
    if (cb) {                                              // training: what the last string did
      /* whoever has a combo going: the longest one live (in Training, the player's) */
      const going = f => f.lastVic && f.lastVic.cmb === f.lastCmb && f.lastVic.sinceHit < 1.2 ? f.lastCmb.n : 0;
      let me = B.lead;
      if (B.cfg.kind !== "training") for (const f of B.fs) if (going(f) > going(me)) me = f;
      const c = me.lastCmb, live = c && (B.cfg.kind === "training" ? c.n >= 1 && B.fs.some(f => f !== me && f.sinceHit < 1.6) : going(me) >= 2);
      cb.style.setProperty("--tc", tagCol(me));
      set("cmb", live ? c.n + "|" + c.dmg : "", v => {
        cb.classList.toggle("on", !!v);
        if (v) { cb.querySelector("b").textContent = c.n > 1 ? c.n + " hits" : "1 hit"; cb.querySelector("i").textContent = c.dmg + " damage"; }
      });
    }
  }
  /* a word across the middle of the screen: Ready, Go!, KO!, Time!, who won */
  function caption(text, stay) {
    const c = host && host.querySelector(".adv-cap"); if (!c) return;
    c.textContent = text || ""; c.classList.remove("on", "stay"); void c.offsetWidth;
    if (text) c.classList.add(stay ? "stay" : "on");
  }

  // ---------------------------------------------------------------- the main menu
  const runnerId = () => NP.on && NP.who ? NP.who : storyRun ? storyRun.ch.who : castId;
  /* the menus glide over one of the stages, never an arena */
  function ensureStageWorld() { if (!world || world.demo || world.def !== actDef(stageIdx, actIdx)) { demo = null; load3d(stageIdx); } }
  /* A screen drawn again -- a setting changed on it, a room's update, a list refreshed -- is the
     same screen: it mustn't pop in again (that is the flicker), and whatever it was scrolled to
     stays. Only a different screen pops in. A screen is known by its outer block and its title. */
  function steadyRedraws(ov) {
    if (!ov || ov._steady) return; ov._steady = true;
    const sig = () => { const r = ov.firstElementChild; if (!r) return ""; const hd = r.querySelector(".ao-head h2, .panel-hd, h2, .adv-ulk-name"); return r.className.replace(/\b(pop|kb)\b/g, "").replace(/\s+/g, " ").trim() + "|" + (hd ? hd.textContent.trim().slice(0, 80) : ""); };
    const pathOf = el => { const p = []; while (el && el !== ov) { const par = el.parentElement; if (!par) return null; p.unshift([...par.children].indexOf(el)); el = par; } return el === ov ? p.join(".") : null; };
    const at = path => { let el = ov; for (const i of path.split(".")) { el = el && el.children[+i]; if (!el) return null; } return el; };
    let last = sig(), scrolls = {};
    ov.addEventListener("scroll", e => { const k = pathOf(e.target); if (k != null) scrolls[k] = e.target.scrollTop; }, true);
    new MutationObserver(() => {
      const s = sig(), same = !!s && s === last;
      ov.classList.toggle("steady", same);
      if (same) for (const k in scrolls) { const el = at(k); if (el && !el.scrollTop && scrolls[k]) el.scrollTop = scrolls[k]; }   // (unless the screen has set it itself)
      else scrolls = {};
      last = s;
    }).observe(ov, { childList: true });
  }
  function screenOn(m) {
    endBattle();
    /* a screen drawn again (a setting changed on it) stays where it was scrolled to; another
       screen starts at its top */
    const old = host.querySelector(".adv-ov .adv-panel"), keep = old && old.scrollTop ? { cls: old.className, y: old.scrollTop } : null;
    if (keep) queueMicrotask(() => { const p = host && host.querySelector(".adv-ov .adv-panel"); if (p && p.className === keep.cls) p.scrollTop = keep.y; });
    mode = m; paused = false; parade = null; talk = null;
    host.querySelector(".adv-hud").classList.remove("on");
    host.classList.remove("playing");
    music();
    return host.querySelector(".adv-ov");
  }
  function mainMenu() {
    if (root.AdventureOnline && root.Auth && !Auth.user) { title(); return; }   // (log in first)
    storyRun = null; RACE = null;
    if (RETRO) { const g = RETRO; RETRO = null; retroCard(g, () => mainMenu()); return; }
    checkUnlocks(); if (pendingFirst(mainMenu)) return;
    const ov = screenOn("main");
    if (!(demo && world && world.demo)) demoStart();      // the title's demo, far off under its haze, goes on behind (the strip's cast stay on the title)
    const eps = EPS(), epc = epsCleared();
    const items = [
      ["story", "book", "Story", `The Red Star Rings, from every side: an episode for each of the ${eps.length}`,
        epc ? `${epc}/${eps.length}` : ""],
      ["gp", "trophy", "Red Ring Circuit", "The grand prix: six cups of four courses, eight runners, and Red Rings with a power in each",
        (() => { const t = (saveData.gp && saveData.gp.trophies) || {}; const n = Object.values(t).reduce((a, x) => a + Object.keys(x).length, 0); return n ? `${n}/18` : "New"; })()],
      ["exhibition", "flag", "Free Exhibition", "Any runner in any zone you've opened, Act 1 or Act 2 and its boss: for time, rings and Red Star Rings",
        `${stages().filter((st, i) => cleared(i)).length}/${stages().length}`],
      ["battle", "trophy", "Battle", "Up to four fighters with health, players or CPUs, in any runner's arena", ""],
      ["tourney", "crown", "Tournament", "A knock-out bracket of 8 or 16: you against CPUs, match by match, to the final", ""],
      ["online", "comet", "Online Lobby", "Rooms for battles, races, story co-op and tournaments; friends, messages and chat",
        root.Net && Net.state === "up" ? `${Net.players.size} online` : ""],
      ["training", "dumbbell", "Training", "The tutorial, lesson by lesson; and a dummy that does as it's told", saveData.tutorial && saveData.tutorial.done ? "" : "New"],
      ["options", "gear", "Options", "Music, sound, screen shake and the two-player keys", ""],
      ["exit", "door", "Exit", "Back to the hall", ""],
    ].filter(it => it[0] !== "exit" || (opts0 && opts0.onExit));
    ov.innerHTML = `
      <div class="adv-haze"></div>
      <div class="adv-main pop">
        <div class="ao-topbar"></div>
        <div class="adv-brand">
          <div class="adv-kicker">SONIC &amp; FRIENDS</div>
          <div class="adv-logo">RED RING CIRCUIT</div>
        </div>
        <button class="adv-team" data-team data-k="team">${ico("person")}<b>Fighters ${fightersN()}/${CAST.length}</b>${chalsOpen().length ? `<em>${chalsOpen().length} challenger${chalsOpen().length > 1 ? "s" : ""} waiting</em>` : `<i>Who's on the team, and how to win over the rest</i>`}</button>
        <div class="adv-mm">
          ${items.map(([id, ic, t, sub, note], i) => `
            <button class="adv-mi" data-mm="${id}" data-k="mm-${id}" ${i === 0 ? "data-focus" : ""}>
              <span class="adv-mi-ic">${ico(ic)}</span>
              <span class="adv-mi-tx"><b>${t}</b><i>${sub}</i></span>
              ${note ? `<em>${note}</em>` : ""}
            </button>`).join("")}
        </div>
        <button hidden data-back id="advMMBack"></button>
      </div>`;
    const go = { story: storyMenu, gp: () => gpMenu(), exhibition: () => { load3d(stageIdx); menu(); }, battle: () => battleSetup(true), training: () => trainingMenu(), options: () => optionsScreen(true), exit: () => exit(),
                 tourney: () => tourSetup(), online: () => { if (root.AdventureOnline) { AdventureOnline._from = "lobby"; AdventureOnline.lobby(); } } };
    if (root.AdventureOnline) { AdventureOnline._from = "menu"; AdventureOnline.topbar(ov.querySelector(".ao-topbar")); }
    ov.querySelectorAll("[data-mm]").forEach(b => b.onclick = () => go[b.dataset.mm]());
    ov.querySelector("[data-team]").onclick = () => fighters();
    ov.querySelector("#advMMBack").onclick = () => title();
    autoFocus();
  }

  // ---------------------------------------------------------------- the battle and training screens
  /* The battle's setup, kept per trainer: up to four slots (a player, the second player, a CPU
     at its level, or nobody), everyone for themselves or Red against Blue, the arena, and the
     rules. A few ready-made matches set the slots in one go. */
  const PRESETS = [
    ["1P vs CPU", ["p1", "cpu", "off", "off"]],
    ["1P vs 2P", ["p1", "p2", "off", "off"]],
    ["CPU vs CPU", ["cpu", "cpu", "off", "off"]],
    ["1P & 2P vs CPU", ["p1", "p2", "cpu", "off"], [0, 0, 1, 1]],
    ["Three-way", ["p1", "cpu", "cpu", "off"]],
    ["Four-way", ["p1", "cpu", "cpu", "cpu"]],
    ["2 vs 2", ["p1", "cpu", "cpu", "cpu"], [0, 0, 1, 1]],
  ];
  const CTL_N = { p1: "Player 1", p2: "Player 2", cpu: "CPU", off: "Nobody" };
  const LV_N = ["Easy", "Normal", "Hard"];
  function bset() {
    const d = { slots: [{ who: castId, ctl: "p1", lvl: 1, team: 0 }, { who: "shadow", ctl: "cpu", lvl: 1, team: 1 },
                        { who: "knuckles", ctl: "off", lvl: 1, team: 0 }, { who: "amy", ctl: "off", lvl: 1, team: 1 }],
                teams: false, arena: 0, rule: "stock", goal: 3, time: 180, hp: 200 };
    const b = saveData.battle = Object.assign(d, saveData.battle || {});
    if (!b.v2) { b.rule = "stock"; b.v2 = 1; }
    if (!b.v3) { b.hp = { 60: 200, 100: 300, 150: 400 }[b.hp] || 300; b.v3 = 1; }
    if (!b.v4) { b.hp = { 200: 150, 300: 200, 400: 250 }[b.hp] || 200; b.v4 = 1; }   // less again: three lives took longer than the three minutes   // three times the health now (a setup kept from before)               // Survival is the default now (a setup kept from before was on KOs by default)
    b.slots = d.slots.map((s, i) => Object.assign({}, s, (b.slots || [])[i] || {}));
    b.slots.forEach(s => { if ((s.ctl === "p1" || s.ctl === "p2") && s.who !== "random" && !hasFighter(s.who)) s.who = castId; });
    if (b.arena >= 0 && !unlocked(b.arena)) b.arena = 0;
    return b;
  }
  /* a row of choices, the picked one lit: Options' own segmented control */
  const seg = (key, opts, cur) => `<div class="seg adv-seg">${opts.map(([v, l]) => `<button data-seg="${key}" data-v="${v}" data-k="${key}-${v}" class="${String(v) === String(cur) ? "sel" : ""}">${l}</button>`).join("")}</div>`;
  const row = (label, help, control) => `<div class="setrow"><div class="setlab"><b>${label}</b>${help ? `<i>${help}</i>` : ""}</div>${control}</div>`;
  const arrows = (key, label) => `<div class="adv-pick"><button class="adv-arr" data-arr="${key}" data-d="-1" data-k="${key}-prev" aria-label="Previous">${ico("back")}</button><b>${label}</b><button class="adv-arr" data-arr="${key}" data-d="1" data-k="${key}-next" aria-label="Next">${ico("next")}</button></div>`;
  const cycle = (arr, cur, d) => arr[(arr.indexOf(cur) + d + arr.length) % arr.length];
  function slotCard(s, i, o) {
    const off = s.ctl === "off", col = o.teams ? TEAM_C[s.team] : SLOT_C[i];
    return `
      <div class="adv-slot ${off ? "off" : ""}" style="--tc:${col}">
        <button class="adv-slot-ctl" data-ctl="${i}" data-k="ctl-${i}">${o.fixed ? o.fixed : off ? "Add a fighter" : CTL_N[s.ctl]}</button>
        <div class="adv-slot-face">${!off && s.who === "random" ? `<b class="adv-rand">?</b>` : `<canvas class="adv-spr" width="176" height="144" data-who="${off ? "" : s.who}"></canvas>`}</div>
        ${off ? "" : arrows("who" + i, s.who === "random" ? "Random" : esc(castOf(s.who).name))}
        ${!off && s.ctl === "cpu" && !o.noLevel ? seg("lvl" + i, LV_N.map((l, k) => [k, l]), s.lvl) : ""}
        ${!off && o.teams ? seg("team" + i, TEAM_N.map((l, k) => [k, l]), s.team) : ""}
      </div>`;
  }
  function keysLine() {
    const K = KEYMAP.p, f = (m, acts) => acts.map(a => m[a].map(keyName).join(" or ") || "none").join(" ");
    return `<b>Player 1</b> ${f(K[0], ["U", "L", "D", "R"])} to move &middot; ${f(K[0], ["J"])} jump &middot; ${f(K[0], ["Z", "X", "C"])} light, heavy, special<br>
            <b>Player 2</b> ${f(K[1], ["U", "L", "D", "R"])} to move &middot; ${f(K[1], ["J"])} jump &middot; ${f(K[1], ["Z", "X", "C"])} light, heavy, special`;
  }
  function battleSetup(first) {
    if (first && pendingFirst(() => battleSetup(true))) return;
    const b = bset(), ov = screenOn("setup");
    if (first) ensureStageWorld();
    const n = b.slots.filter(s => s.ctl !== "off").length, duo = b.slots.some(s => s.ctl === "p2");
    const preset = PRESETS.findIndex(([, ctl, tm]) => ctl.every((c, i) => b.slots[i].ctl === c) && !!tm === !!b.teams && (!tm || tm.every((t, i) => ctl[i] === "off" || b.slots[i].team === t)));
    ov.innerHTML = `
      <div class="adv-menu pop">
        <div class="panel adv-panel adv-bset">
          <div class="panel-hd">${ico("trophy")}Battle</div>
          <div class="adv-presets">${PRESETS.map(([l], i) => `<button data-pre="${i}" data-k="pre-${i}" class="${i === preset ? "sel" : ""}">${l}</button>`).join("")}</div>
          <div class="adv-slots">${b.slots.map((s, i) => slotCard(s, i, b)).join("")}</div>
          <div class="adv-rules">
            ${row("Sides", "", seg("teams", [[0, "Everyone for themselves"], [1, "Red against Blue"]], b.teams ? 1 : 0))}
            ${row("Arena", b.arena < 0 ? "A new one every fight, from the zones you've opened" : esc(stages()[b.arena].sub), arenaPick(b.arena))}
            ${row("Rule", b.rule === "stock" ? "Each fighter has lives; the last side standing wins." : "The first to so many KOs wins.", seg("rule", [["ko", "KO match"], ["stock", "Survival"]], b.rule))}
            ${row(b.rule === "stock" ? "Lives" : "KOs to win", "", seg("goal", [[1, "1"], [3, "3"], [5, "5"]], b.goal))}
            ${row("Time", "", seg("time", [[120, "2:00"], [180, "3:00"], [300, "5:00"], [0, "None"]], b.time))}
            ${row("Health", "Each fighter's own share of it: the heavy have more, the light less.", seg("hp", [[150, "150"], [200, "200"], [250, "250"]], b.hp))}
          </div>
          <div class="adv-go">
            <button class="btn lg" id="advFight" data-enter data-focus data-k="fight" ${n < 2 ? "disabled" : ""}>${ico("flag")}Fight</button>
            <button class="btn ghost" id="advBSk" data-k="emskill">Emerl's Skills</button>
            <button class="btn ghost" id="advBBack" data-back data-k="back">${ico("back")}Main menu</button>
          </div>
          <div class="adv-keys">${duo ? keysLine() + "<br>" : ""}<b>Down</b> guards (just as a blow lands, a parry), held still heals &middot; <b>Z + X</b> bursts &middot; Options sets the two players' keys</div>
        </div>
      </div>`;
    paintSlots(ov); paintArena(ov);
    const redo = () => { save(saveData); battleSetup(); };
    ov.querySelectorAll("[data-pre]").forEach(el => el.onclick = () => {
      const [, ctl, tm] = PRESETS[+el.dataset.pre];
      b.slots.forEach((s, i) => { s.ctl = ctl[i]; if (tm) s.team = tm[i]; });
      b.teams = !!tm; redo();
    });
    /* an empty slot: anywhere on its card adds a fighter, as its button does */
    ov.querySelectorAll(".adv-slot.off").forEach(card => card.onclick = e => { if (!e.target.closest("[data-ctl]")) card.querySelector("[data-ctl]").click(); });
    ov.querySelectorAll("[data-ctl]").forEach(el => el.onclick = () => {
      const i = +el.dataset.ctl, s = b.slots[i];
      const order = i < 2 ? ["p1", "p2", "cpu"] : ["p1", "p2", "cpu", "off"];
      s.ctl = s.ctl === "off" ? "cpu" : cycle(order, s.ctl, 1);              // an empty slot: in comes a CPU
      if ((s.ctl === "p1" || s.ctl === "p2") && s.who !== "random" && !hasFighter(s.who)) s.who = castId;   // (a player plays one of the team)
      if (s.ctl === "p1" || s.ctl === "p2") b.slots.forEach((o, k) => { if (k !== i && o.ctl === s.ctl) o.ctl = "cpu"; });   // one of each player
      redo();
    });
    ov.querySelectorAll("[data-arr]").forEach(el => el.onclick = () => {
      const key = el.dataset.arr, d = +el.dataset.d;
      if (key === "arena") b.arena = cycle([-1].concat(openArenas()), b.arena, d);                 // (Random first, then the arenas of the zones open)
      else { const s = b.slots[+key.slice(3)], team = s.ctl === "p1" || s.ctl === "p2";
             s.who = cycle(CAST.map(c => c.id).filter(id => !team || hasFighter(id)).concat(["random"]), s.who, d); }   // (players: the team; and Random, after the last)
      redo();
    });
    ov.querySelectorAll("[data-seg]").forEach(el => el.onclick = () => {
      const key = el.dataset.seg, v = el.dataset.v;
      if (key === "teams") b.teams = v === "1";
      else if (key === "rule") b.rule = v;
      else if (key === "goal" || key === "time" || key === "hp") b[key] = +v;
      else if (key.startsWith("lvl")) b.slots[+key.slice(3)].lvl = +v;
      else if (key.startsWith("team")) b.slots[+key.slice(4)].team = +v;
      redo();
    });
    ov.querySelector("#advFight").onclick = () => {
      let slots = b.slots.filter(s => s.ctl !== "off").map(s => Object.assign({}, s));
      if (!slots.some(s => s.ctl === "p1")) { const p2 = slots.find(s => s.ctl === "p2"); if (p2) p2.ctl = "p1"; }   // a lone second player is the first
      if (b.teams && new Set(slots.map(s => s.team)).size < 2) slots = slots.map((s, i) => Object.assign(s, { team: i % 2 }));
      startBattle({ kind: "battle", slots, teams: b.teams, arena: b.arena, rule: b.rule, goal: b.goal, time: b.time, hp: b.hp });
    };
    ov.querySelector("#advBBack").onclick = () => mainMenu();
    ov.querySelector("#advBSk").onclick = () => emerlSkills(() => battleSetup(true));
    if (first) autoFocus();
  }
  function paintSlots(ov) { ov.querySelectorAll(".adv-slot canvas[data-who]").forEach(cv => { if (cv.dataset.who) paintCard(cv, cv.dataset.who); }); }

  function tset() {
    const d = { you: castId, dummy: "knuckles", act: "stand", arena: 0 };
    const t = saveData.training = Object.assign(d, saveData.training || {});
    if (!hasFighter(t.you)) t.you = castId;
    if (!unlocked(t.arena)) t.arena = 0;
    return t;
  }
  function trainingSetup(first) {
    const t = tset(), ov = screenOn("setup");
    if (first) ensureStageWorld();
    ov.innerHTML = `
      <div class="adv-menu pop">
        <div class="panel adv-panel adv-bset adv-tset">
          <div class="panel-hd">${ico("dumbbell")}Training</div>
          <div class="adv-slots">
            ${slotCard({ who: t.you, ctl: "p1" }, 0, { fixed: "You" }).replace(/who0/g, "you")}
            ${slotCard({ who: t.dummy, ctl: "cpu" }, 1, { fixed: "The dummy", noLevel: true }).replace(/who1/g, "dummy")}
          </div>
          <div class="adv-rules">
            ${row("The dummy", "What it does while you practise. You can change it from the pause menu.", seg("act", DUMMY, t.act))}
            ${row("Arena", esc(stages()[t.arena].sub), arenaPick(t.arena))}
          </div>
          <div class="adv-go">
            <button class="btn lg" id="advTrain" data-enter data-focus data-k="train">${ico("flag")}Start training</button>
            <button class="btn ghost" id="advTSk" data-k="emskill">Emerl's Skills</button>
            <button class="btn ghost" id="advTBack2" data-back data-k="back">${ico("back")}Training</button>
          </div>
          <div class="adv-keys">Health comes back between strings, and nobody goes down for good. Pause for the move list.</div>
        </div>
      </div>`;
    paintSlots(ov); paintArena(ov);
    ov.querySelectorAll(".adv-slot-ctl").forEach(el => el.disabled = true);
    const redo = () => { save(saveData); trainingSetup(); };
    ov.querySelectorAll("[data-arr]").forEach(el => el.onclick = () => {
      const key = el.dataset.arr, d = +el.dataset.d;
      if (key === "arena") t.arena = cycle(openArenas(), t.arena, d);
      else t[key] = cycle(CAST.map(c => c.id).filter(id => key !== "you" || hasFighter(id)), t[key], d);
      redo();
    });
    ov.querySelectorAll("[data-seg]").forEach(el => el.onclick = () => { t.act = el.dataset.v; redo(); });
    ov.querySelector("#advTrain").onclick = () => startTraining();
    ov.querySelector("#advTBack2").onclick = () => trainingMenu();
    ov.querySelector("#advTSk").onclick = () => emerlSkills(() => trainingSetup(true));
    if (first) autoFocus();
  }
  function startTraining() {
    const t = tset();
    startBattle({ kind: "training", slots: [{ who: t.you, ctl: "p1", team: 0 }, { who: t.dummy, ctl: "cpu", lvl: 1, team: 1, dummy: t.act }],
                  teams: true, arena: t.arena, rule: "ko", goal: 99, time: 0, hp: 300 });
  }
  // ---------------------------------------------------------------- the tutorial
  /* The TUTORIAL, Training's first choice: an in-game one, played for real, the way KNOCK//BACK's
     is. A fight in Seabreeze Cape's arena against a dummy that does nothing until a lesson wants it
     to. A card over the fight gives one lesson at a time, in your own keys (or the pad's buttons,
     or the touch pad's), and the next opens once you have done it (or skipped it). Nobody loses
     anything: your health comes back (but in the healing lesson), the dummy's never runs out (but
     in the last round, when it fights back and is there to be KO'd), and a dummy knocked far off
     is brought back in front of you. The lessons hear the fight through emit(): hits (whose, which
     blow, how many in the combo, a launch, a chase, an OTG, a counter), bounces, knockdowns,
     guards and parries, bursts, specials, links, jumps, dashes and Spin Dashes. Done (or each lesson
     skipped to the end), its own last screen, with what you did. */
  const usingPad = () => { try { return Array.from(navigator.getGamepads ? navigator.getGamepads() : []).some(g => g && g.connected); } catch (e) { return false; } };
  const TUT_KEYS = { key: { J: "Space", Z: "Z", X: "X", C: "C" }, pad: { J: "A", Z: "X", X: "Y", C: "B" }, touch: { J: "Jump", Z: "Light", X: "Heavy", C: "Special" } };
  const tk = a => `<kbd>${(TOUCH ? TUT_KEYS.touch : usingPad() ? TUT_KEYS.pad : TUT_KEYS.key)[a]}</kbd>`;
  const td = d => `<kbd>${{ L: "&larr;", R: "&rarr;", U: "&uarr;", D: "&darr;" }[d]}</kbd>`;
  const tMe = () => battle.fs[0], tDum = () => battle.fs[1];
  const byMe = d => !!d && (d.by === tMe() || d.p === tMe());
  const nameOf = () => esc(tMe().c.name);
  /* both on the floor, x along the arena, facing each other, out of whatever they were in */
  function tutPlace(px, dx) {
    for (const [f, x] of [[tMe(), px], [tDum(), dx]]) {
      Object.assign(f, { x, y: floorAt(x), vx: 0, vy: 0, ground: true, on: null, onTile: null, state: "run", mv: null, sp: null, tor: null, er: null,
                         curl: false, juggle: false, smashT: 0, spike: false, hang: 0, guardT: 0, crouchT: 0, healing: false, target: null, chase: false,
                         buf: null, inv: 0, airMove: false, airChain: 0, cmb: { n: 0, dmg: 0 } });
    }
    tMe().face = sgn(dx - px) || 1; tDum().face = -tMe().face;
    const A = tDum().ai; A.q = []; A.dir = 0; A.hold = 0;
  }
  /* a lesson's combo dropped: back to its start, with a word on why */
  function tutDrop(note, air) {
    const v = tDum(), a = tMe();
    if (TUT.got > 0 && v.state !== "hurt" && v.state !== "down" && a.state !== "atk" && a.state !== "seek" && (!air || a.ground)) { TUT.got = 0; TUT.note = note; return "redraw"; }
  }
  /* The lessons. text: what the card says (once it has started, by how far in it is); need: how
     many to do; on(kind, data): what counts (true for one more, or a number for the progress
     itself); tick(dt): each frame while it is open; setup(): as it opens; cue: the dummy swings
     at you, this string every `gap` seconds; keepHp: your health is left alone; final: the last
     round; skip(): not this fighter's lesson. */
  const LESSONS = [
    { id: "move", title: "Move", need: 1, noHome: true,
      text: () => `Run with ${td("L")} ${td("R")} (or A and D). Run into the yellow ring.`,
      setup() { tutPlace(8, 24); TUT.spot = 15; TUT.ringT = 0; },
      tick(dt) {
        if ((TUT.ringT -= dt) <= 0) { TUT.ringT = 0.55; ring(TUT.spot, floorAt(TUT.spot) + 0.55, 0xffd21a, 1.3); }
        const a = tMe(); if (Math.abs(a.x - TUT.spot) < 0.6 && a.ground) return true;
      } },
    { id: "jump", title: "Jump and Air Action", need: 2, noHome: true,
      text: () => TUT.got < 1 ? `${tk("J")} jumps (hold it to go higher).` : `Now ${tk("J")} again in the air: ${nameOf()}'s air action, ${airDesc(tMe().c)}.`,
      on(k, d) { if (k === "jump" && byMe(d)) return Math.max(TUT.got, 1); if (k === "airaction" && byMe(d) && TUT.got >= 1) return 2; } },
    { id: "dash", title: "Dash", need: 1, noHome: true,
      text: () => `Tap ${td("L")} or ${td("R")} twice, quickly: ${nameOf()}'s dash.`,
      on(k, d) { if (k === "dash" && byMe(d)) return true; } },
    { id: "spin", title: "Spin Dash", need: 1, noHome: true, skip: () => !tMe().c.spinDash,
      text: () => `Hold ${td("D")} and tap ${tk("J")} to rev a Spin Dash (each tap revs it harder), then let go of ${td("D")}: off you go, curled, and whatever you run into is hit.`,
      on(k, d) { if (k === "spindash" && byMe(d)) return true; } },
    { id: "jabs", title: "Your 1-2-3", need: 3,
      text: () => `Walk up to the dummy and tap ${tk("Z")} three times: your 1st, 2nd and 3rd attacks. Press again as each one lands and they link (a press is kept till its moment).`,
      setup() { tutPlace(12, 13.3); },
      on(k, d) { if (k === "hit" && byMe(d) && d.q === tDum()) { const r = { atk1: 1, atk2: 2, atk3: 3 }[d.name]; if (r && d.n >= r) return r; } },
      tick() { return tutDrop("The string dropped. Start it again, and press as each hit lands."); } },
    { id: "auto", title: "Auto Combo", need: 1,
      text: () => `Keep on: mash ${tk("Z")}. After the 3rd attack comes your heavy, a SMASH that throws them far. Every hit freezes the picture a moment; a combo's smash slows the world, and one on one the camera leans in.`,
      setup() { tutPlace(12, 13.3); },
      on(k, d) { if (k === "hit" && byMe(d) && d.name === "heavy" && d.n >= 4) return true; } },
    { id: "enders", title: "Three Enders", need: 3,
      text: () => `After a jab or two: ${tk("X")} is the heavy; ${td("U")} + ${tk("X")} the LAUNCHER; ${td("D")} + ${tk("X")} the AIM ATTACK, a dash and a blow. Land each of the three after a ${tk("Z")}.`,
      setup() { tutPlace(12, 13.3); TUT.set = new Set(); },
      on(k, d) { if (k === "hit" && byMe(d) && (d.n >= 2 || d.name === "aim") && /^(heavy|upper|aim|chase)$/.test(d.name)) { TUT.set.add(d.name === "chase" ? "aim" : d.name); return TUT.set.size; } } },
    { id: "dashatk", title: "Dash Attack", need: 1,
      text: () => `Dash (${td("L")} or ${td("R")} twice) and press ${tk("X")} as you go: the DASH ATTACK, a smash on the run.`,
      setup() { tutPlace(10, 17); },
      on(k, d) { if (k === "hit" && byMe(d) && d.name === "dashatk") return true; } },
    { id: "launch", title: "Launcher and Chase", need: 2,
      text: () => TUT.got < 1 ? `${td("U")} + ${tk("X")}: the LAUNCHER. Every fighter's throws them straight up, the same height, helpless till they land.`
        : `Now ${td("D")} + ${tk("X")}: the CHASE. You fly up after them and drive them down.`,
      setup() { tutPlace(12, 13.3); },
      on(k, d) { if (k === "hit" && byMe(d) && d.launch) return Math.max(TUT.got, 1); if (k === "hit" && byMe(d) && d.name === "chase" && TUT.got >= 1) return 2; },
      tick() { return tutDrop("They landed first. Launch them again, then Down + X straight away.", true); } },
    { id: "air", title: "Super Jump and Air Combo", need: 3,
      text: () => TUT.got < 1 ? `${td("U")} + ${tk("X")} to launch, then ${tk("J")} as it lands: a SUPER JUMP, up after them.`
        : TUT.got < 2 ? `${tk("Z")} in the air: air attacks, three to a jump. While they land you both fall slowly, the fighting games' air-combo gravity.`
        : `Finish with ${td("D")} + ${tk("X")}: the chase smashes them down.`,
      setup() { tutPlace(12, 13.3); },
      on(k, d) {
        if (k === "superjump" && byMe(d)) return Math.max(TUT.got, 1);
        if (k === "hit" && byMe(d) && TUT.got >= 1 && (d.name === "airatk" || d.name === "homing")) return Math.max(TUT.got, 2);
        if (k === "hit" && byMe(d) && TUT.got >= 2 && d.name === "chase") return 3;
      },
      tick() { return tutDrop("They landed. Launch again: Up + X, then Space straight away.", true); } },
    { id: "wall", title: "Wall Bounce", need: 1,
      text: () => `The dummy is by the arena's wall. Smash it into the wall (${tk("X")}, or mash ${tk("Z")} into your heavy): off the wall it bounces back up, for more. Once a combo.`,
      setup() { const W = world.W; tutPlace(W - 6.6, W - 5.3); },
      on(k, d) { if (k === "wall" && d.q === tDum()) return true; } },
    { id: "floor", title: "Ground Bounce", need: 1,
      text: () => `Launch it (${td("U")} + ${tk("X")}) and chase it (${td("D")} + ${tk("X")}): the chase drives it into the floor, and it bounces back up. Once a combo.`,
      setup() { tutPlace(12, 13.3); },
      on(k, d) { if (k === "floor" && d.q === tDum()) return true; } },
    { id: "otg", title: "Knockdown and OTG", need: 2,
      text: () => TUT.got < 1 ? `Land a combo of three or more that brings it down (the launcher and the chase will do): it's KNOCKED DOWN, a moment on the floor.`
        : `While it lies there: ${td("D")} + ${tk("X")}, the OTG, picks it up off the floor for more. Once a combo; then it gets up, untouchable a moment.`,
      setup() { tutPlace(12, 13.3); },
      on(k, d) { if (k === "down" && d.q === tDum()) return Math.max(TUT.got, 1); if (k === "hit" && byMe(d) && d.otg) return 2; },
      tick() { const v = tDum(); if (TUT.got === 1 && v.state === "run" && v.ground) { TUT.got = 0; TUT.note = "It got up. Knock it down again, and Down + X while it lies there."; return "redraw"; } } },
    { id: "specials", title: "Specials", need: 3, noHome: true,
      text: () => `${tk("C")} is your shot; ${td("U")} + ${tk("C")} your power; ${td("D")} + ${tk("C")} sets your trap (${td("D")} + ${tk("C")} again sets it off). Use all three.`,
      setup() { tutPlace(10, 17); TUT.set = new Set(); },
      on(k, d) { if (k === "special" && byMe(d) && !d.air) { TUT.set.add(d.kind); return TUT.set.size; } } },
    { id: "airsp", title: "Air Specials", need: 1, noHome: true,
      text: () => `In the air, ${tk("C")} (and ${td("U")} or ${td("D")} with it) is each special's air version. Jump and use one.`,
      on(k, d) { if (k === "special" && byMe(d) && d.air) return true; } },
    { id: "cancel", title: "Special Cancel", need: 1,
      text: () => `Any blow that lands can go straight into a special: ${tk("Z")}, then ${tk("C")} as it lands.`,
      setup() { tutPlace(12, 13.3); },
      on(k, d) { if (k === "link" && byMe(d) && d.nx === "special") return true; } },
    { id: "guard", title: "Guard", need: 1, cue: { seq: ["z"], gap: 1.5 },
      text: () => `Now the dummy swings at you. Tap ${td("D")} as it comes: ${nameOf()}'s guard, as long as theirs is in Sonic Battle. A blow on it does nothing.`,
      setup() { tutPlace(12, 14.5); },
      on(k, d) { if ((k === "block" || k === "parry") && d.q === tMe()) return true; if (k === "hit" && d.q === tMe()) TUT.note = "It got through: tap Down as its blow comes."; } },
    { id: "parry", title: "Parry", need: 2, cue: { seq: ["z"], gap: 1.7 },
      text: () => `Tap ${td("D")} just as the blow lands: the first eighth of a second of the guard is a PARRY. Nothing comes of the blow, and the dummy reels, open. Parry it twice.`,
      setup() { tutPlace(12, 14.5); },
      on(k, d) {
        if (k === "parry" && d.q === tMe()) return TUT.got + 1;
        if (k === "block" && d.q === tMe()) TUT.note = "A block, not a parry: tap a touch later, as the blow is about to land.";
        if (k === "hit" && d.q === tMe()) TUT.note = "Too late: tap Down a moment before its blow reaches you.";
      } },
    { id: "counter", title: "Counter", need: 1, cue: { seq: ["z"], gap: 1.7 },
      text: () => `Parry it, then hit it while it reels: a COUNTER, a quarter more damage.`,
      setup() { tutPlace(12, 14.5); },
      on(k, d) { if (k === "hit" && byMe(d) && d.counter) return true; } },
    { id: "heal", title: "Heal", need: 1, keepHp: true, noHome: true,
      text: () => `Your health is down. Hold ${td("D")} and stand still: after a moment you heal, in ${nameOf()}'s healing frames (each fighter at their own speed; Knuckles and Cream fastest). Heal a tenth of it back.`,
      setup() { tutPlace(12, 20); tMe().hp = tMe().hpMax * 0.5; },
      tick() { const a = tMe(); if (a.hp >= a.hpMax * 0.6) return true; } },
    { id: "blue", title: "Burst: Blue", need: 1, cue: { seq: ["z", "z", "z", "z", "z", "z"], gap: 2.8 },
      text: () => `The dummy will combo you. Caught in it, press ${tk("Z")} + ${tk("X")} together: a BLUE BURST. It throws everyone off, does no damage, and ends the combo. The burst gauge is under your health: full, it flashes gold.`,
      setup() { tutPlace(12, 14.5); tMe().burst = BURST_MAX; },
      on(k, d) {
        if (k === "burst" && byMe(d) && d.blue) return true;
        if (k === "burst" && byMe(d)) { TUT.note = "That one was gold: wait till its combo has you, then burst."; tMe().burst = BURST_MAX; }
      } },
    { id: "gold", title: "Burst: Gold", need: 1,
      text: () => `Out of a combo, ${tk("Z")} + ${tk("X")} is a GOLD BURST: it hits, and landing it gives a third of the gauge back. Burst right next to the dummy.`,
      setup() { tutPlace(12, 13.3); tMe().burst = BURST_MAX; },
      on(k, d) { if (k === "burst" && byMe(d) && !d.blue) { if (d.hit) return true; TUT.note = "It missed: burst right next to the dummy."; tMe().burst = BURST_MAX; } } },
    { id: "finish", title: "Now For Real", need: 1, final: true,
      text: () => `The dummy fights back now, and its health is low. Everything you've learned: KO it. (Long combos run down: each hit after the third does less, and at eighteen they break out.)`,
      setup() { tutPlace(10, 17); const d = tDum(); d.ai.dummy = "fight"; d.lvl = 0; d.hp = d.hpMax * 0.22; tMe().burst = BURST_MAX; },   // (an Easy CPU)
      on(k, d) { if (k === "ko" && d.q === tDum()) return true; } },
  ];
  const tutLessons = () => LESSONS.filter(l => !l.skip || !l.skip());     // (the lessons this fighter gets)
  const PRAISE = ["Nice!", "Clean.", "That's it.", "Sharp.", "Exactly.", "Good."];

  function tutorialStart() {
    const t = tset(), you = t.you, dum = you === "knuckles" ? "sonic" : "knuckles";
    startBattle({ kind: "training", tutorial: true, slots: [{ who: you, ctl: "p1", team: 0 }, { who: dum, ctl: "cpu", lvl: 1, team: 1, dummy: "stand" }],
                  teams: true, arena: 0, rule: "ko", goal: 99, time: 0, hp: 300 });
    TUT = { i: -1, got: 0, note: "", ok: null, okT: 0, cueT: 0, stats: { combo: 0, bounces: 0, parries: 0, bursts: 0, done: 0 } };
    tutNext();
  }
  function tutNext() {
    if (!TUT) return;
    TUT.i++; TUT.got = 0; TUT.note = ""; TUT.ok = null; TUT.cueT = 0.9;
    while (LESSONS[TUT.i] && LESSONS[TUT.i].skip && LESSONS[TUT.i].skip()) TUT.i++;
    const L = LESSONS[TUT.i];
    if (!L) return tutFinish();
    const A = tDum().ai; A.dummy = "stand"; A.q = []; A.dir = 0;
    if (L.setup) L.setup.call(L);
    tutDraw("new");
  }
  function tutComplete() {
    const L = LESSONS[TUT.i]; let j = TUT.i + 1;
    while (LESSONS[j] && LESSONS[j].skip && LESSONS[j].skip()) j++;
    const nx = LESSONS[j];
    TUT.ok = PRAISE[Math.floor(Math.random() * PRAISE.length)] + " " + (nx ? "Next: " + nx.title + "." : "That's the tutorial!");
    TUT.okT = 1.4; TUT.stats.done++;
    SFX.check(); tutDraw("ok");
    if (L.final) { const d = tDum(); d.ai.dummy = "stand"; d.ai.q = []; }
  }
  function tutProgress(r) {
    const L = LESSONS[TUT.i], got = typeof r === "number" ? r : TUT.got + 1;
    if (got !== TUT.got) { TUT.got = got; TUT.note = ""; if (TUT.got < L.need) SFX.coin(); }
    if (TUT.got >= L.need) tutComplete(); else tutDraw();
  }
  /** what the fight tells the tutorial (see emit) */
  function tutHear(kind, d) {
    const st = TUT.stats;
    if (kind === "hit" && byMe(d) && d.q === tDum()) st.combo = Math.max(st.combo, d.n);
    if (kind === "wall" && d.q === tDum()) st.bounces++;
    if (kind === "parry" && d.q === tMe()) st.parries++;
    if (kind === "burst" && byMe(d)) st.bursts++;
    const L = LESSONS[TUT.i]; if (!L || TUT.ok || !L.on) return;
    const before = TUT.note, r = L.on.call(L, kind, d);
    if (r === true || (typeof r === "number" && r > TUT.got)) tutProgress(r);
    else if (TUT.note !== before || r === "redraw") tutDraw();
  }
  /** each tick of the fight: the gentle world, the dummy's cues, the lesson's own checks */
  function tutTick(dt) {
    const L = LESSONS[TUT.i]; if (!L) return;
    const a = tMe(), v = tDum();
    if (!L.keepHp && !L.final) a.hp = a.hpMax;
    if (!L.final) v.hp = Math.max(v.hp, v.hpMax * 0.4);
    if (TUT.ok) { if ((TUT.okT -= dt) <= 0) tutNext(); return; }
    /* a dummy knocked far off comes back, in front of you, once it's on its feet */
    if (!L.noHome && !L.final && v.state === "run" && v.ground && Math.abs(v.x - a.x) > 7 && a.ground) {
      if ((TUT.homeT = (TUT.homeT || 0) + dt) > 0.9) {
        TUT.homeT = 0;
        const x = clamp(a.x + a.face * 1.8, 3, world.W - 3);
        burst(v.x, v.y + 0.6, [0xffffff, 0xbfe8ff], 10, 3);
        Object.assign(v, { x, y: floorAt(x), vx: 0, vy: 0, face: -a.face });
        burst(x, v.y + 0.6, [0xffffff, 0xbfe8ff], 10, 3); SFX.dash();
      }
    } else TUT.homeT = 0;
    /* the dummy's cue: up to you, then its string, every so often */
    if (L.cue) {
      const A = v.ai, dx = a.x - v.x;
      TUT.cueT -= dt;
      if (v.state === "run" && v.ground && !A.q.length) {
        if (Math.abs(dx) > 1.3) { A.dir = sgn(dx); A.hold = 0.06; }
        else { v.face = sgn(dx) || v.face; if (TUT.cueT <= 0) { TUT.cueT = L.cue.gap; A.q = L.cue.seq.map((k, i) => ({ at: A.qt + i * 0.13, k })); } }
      }
    }
    if (!L.tick) return;
    const before = TUT.note, r = L.tick.call(L, dt);
    if (r === true || (typeof r === "number" && r > TUT.got)) tutProgress(r);
    else if (r === "redraw" || TUT.note !== before) tutDraw();
  }
  /** the card over the fight */
  function tutDraw(flash) {
    const c = host && host.querySelector(".adv-tut"), L = TUT && LESSONS[TUT.i]; if (!c || !L) return;
    const list = tutLessons();
    c.className = "adv-tut" + (flash ? " " + flash : "");
    c.innerHTML = `
      <div class="adv-tut-n"><span>Tutorial &middot; Lesson ${list.indexOf(L) + 1} / ${list.length}</span><i>${TOUCH ? "" : "Enter: pause"}</i></div>
      <h3>${TUT.ok ? "&#10003; " : ""}${esc(L.title)}</h3>
      <p>${TUT.ok ? esc(TUT.ok) : L.text.call(L)}</p>
      ${L.need > 1 ? `<div class="adv-tut-pips">${Array.from({ length: L.need }, (_, k) => `<i class="${k < TUT.got ? "on" : ""}"></i>`).join("")}</div>` : ""}
      ${TUT.note && !TUT.ok ? `<div class="adv-tut-try">${esc(TUT.note)}</div>` : ""}
      <div class="adv-tut-row"><button data-tut="skip">${L.final ? "Skip" : "Skip lesson"} ${ico("next")}</button><button data-tut="leave">Leave</button></div>`;
    c.querySelector('[data-tut="skip"]').onclick = () => { if (TUT && !TUT.ok) { SFX.pop(); tutNext(); } };
    c.querySelector('[data-tut="leave"]').onclick = () => tutLeave();
  }
  function tutLeave() { TUT = null; paused = false; trainingMenu(); }
  /* every lesson done (or skipped through): the tutorial's own last screen */
  function tutFinish() {
    const st = TUT.stats;
    saveData.tutorial = { done: true, at: Date.now() }; save(saveData);
    TUT = null; paused = false; mode = "results";
    bgm("competition-results");
    host.querySelector(".adv-hud").classList.remove("on");
    const ov = host.querySelector(".adv-ov"), R = (k, v) => `<div class="adv-row"><span>${k}</span><b class="num">${v}</b></div>`;
    ov.innerHTML = `
      <div class="panel adv-small pop adv-tutdone">
        <div class="panel-hd">${ico("dumbbell")}Tutorial complete</div>
        <div class="adv-tutdone-b">
          ${R("Lessons done", st.done)}${R("Longest combo", st.combo + (st.combo === 1 ? " hit" : " hits"))}${R("Wall bounces", st.bounces)}${R("Parries", st.parries)}${R("Bursts", st.bursts)}
          <p>Everyone plays by the same buttons; what each fighter's moves are is in the move list (pause in a fight). Every key can be changed in Options, and Free Training has a dummy to practise on any time.</p>
        </div>
        <div class="adv-btns">
          <button class="btn" id="advTutBack" data-focus data-k="tback">${ico("back")}Training</button>
          <button class="btn ghost" id="advTutAgain" data-k="tagain">${ico("flag")}Again</button>
        </div>
      </div>`;
    ov.querySelector("#advTutBack").onclick = () => trainingMenu();
    ov.querySelector("#advTutAgain").onclick = () => tutorialStart();
    autoFocus();
  }
  /* Training's two: the tutorial, and free training (its setup) */
  function trainingMenu() {
    const ov = screenOn("setup");
    ensureStageWorld();
    const done = !!(saveData.tutorial && saveData.tutorial.done), who = esc(castOf(tset().you).name);
    ov.innerHTML = `
      <div class="adv-main pop">
        <div class="adv-brand">
          <div class="adv-kicker">SONIC &amp; FRIENDS</div>
          <div class="adv-logo">TRAINING</div>
        </div>
        <div class="adv-mm">
          <button class="adv-mi" data-tm="tutorial" data-k="tm-tutorial" data-focus>
            <span class="adv-mi-ic">${ico("book")}</span>
            <span class="adv-mi-tx"><b>Tutorial</b><i>Every part of the fighting, lesson by lesson, in a real fight, as ${who}: combos, launchers and air combos, bounces, OTGs, specials, the guard and parry, the burst</i></span>
            <em>${done ? "Done" : "New"}</em>
          </button>
          <button class="adv-mi" data-tm="free" data-k="tm-free">
            <span class="adv-mi-ic">${ico("dumbbell")}</span>
            <span class="adv-mi-tx"><b>Free Training</b><i>Every move on a dummy that does as it's told (pick your runner here)</i></span>
          </button>
          <button class="adv-mi" data-tm="back" data-k="tm-back">
            <span class="adv-mi-ic">${ico("door")}</span>
            <span class="adv-mi-tx"><b>Main menu</b><i>Back to the main menu</i></span>
          </button>
        </div>
        <button hidden data-back id="advTMBack"></button>
      </div>`;
    const go = { tutorial: () => tutorialStart(), free: () => trainingSetup(true), back: () => mainMenu() };
    ov.querySelectorAll("[data-tm]").forEach(b => b.onclick = () => go[b.dataset.tm]());
    ov.querySelector("#advTMBack").onclick = () => mainMenu();
    autoFocus();
  }
  /* the move list: the same buttons for everyone; what the air action and the moves are, the
     runner's own */
  const AIR_DESC = { ballet: "Sonic Ballet, a second jump that homes on anything near", fly: "flight: tap to climb, until tired",
    glide: "a glide while held; glide into a wall to climb it", double: "a Double Jump", teleport: "Chaos Control, twice a jump",
    float: "Chaos Flight, a little more height", jet: "a burst of the jet ahead, and a hover", psy: "the Air Psycho Dash; then hold Space to float down",
    launch: "Shell Launch, straight up; against a wall, a wall jump" };
  const airDesc = c => c.id === "eggman" ? "Egg Mobile Flight: tap to climb on its boosters, a while; then it glides down" : c.air === "hover" ? "Flight Mode: held up a while, sinking" : AIR_DESC[c.air] || "";
  function movesHtml(c) {
    const R = (k, t) => `<div class="adv-mv-r"><b>${k}</b><span>${t}</span></div>`;
    return `<div class="adv-mlist">
      <div class="adv-mv-hd"><b>${esc(c.name)}</b><i>${esc(c.moves)}</i></div>
      ${R("Z", "Light attack: mash it for the 1-2-3 and the heavy")}
      ${R("X", "Heavy attack, a smash: off a wall they bounce. Up + X launches; Down + X the aim attack, after one in the air the chase, on one knocked down the OTG; dashing, the dash attack")}
      ${R("Z or X in the air", "Air attack, three to a jump in a combo" + (c.id === "shadow" ? " (Z: Homing Attack)" : ""))}
      ${R("Combos", "A blow that lands goes straight into the next: jabs, then X, Up + X or C; Space after the launcher jumps after them; in the air, air attacks, then Down + X (off the floor they bounce). A wall bounce, a floor bounce and an OTG once each a combo")}
      ${R("C", "Shot. Up + C power, Down + C trap (again to set it off); each has an air version")}
      ${R("Space", "Jump; again in the air, " + airDesc(c))}
      ${R("Twice left or right", "Dash")}
      ${R("Down", "Guard (a tap); just as a blow lands, a parry: it reels, open. Held still, heal")}
      ${R("Z + X", "Burst, with the gauge full: out of a combo it throws everyone off; otherwise it hits")}
      ${R("Health", (HP_K[c.id] || 1) === 1 ? "As much as the match gives" : `${Math.round((HP_K[c.id] || 1) * 100)}% of what the match gives (${(HP_K[c.id] || 1) > 1 ? "sturdier" : "lighter"} than most)`)}
      ${c.spinDash ? R("Down + Space", "Spin Dash: tap Space to rev, let go of Down") : ""}
      <p>${esc(c.text)}</p>
    </div>`;
  }
  function battlePause(ov) {
    const B = battle, tr = B.cfg.kind === "training", story = B.cfg.kind === "story";
    if (B.cfg.tutorial && TUT) {
      const L = LESSONS[TUT.i];
      ov.innerHTML = `
        <div class="panel adv-small pop">
          <div class="panel-hd">${ico("info")}Paused: Tutorial</div>
          <div class="adv-btns">
            <button class="btn" id="advRes" data-k="res">${ico("next")}Keep going</button>
            <button class="btn ghost" id="advTutRe" data-k="tre">Start this lesson again</button>
            <button class="btn ghost" id="advTutSkip" data-k="tskip">Skip this lesson</button>
            <button class="btn ghost" id="advMoves" data-k="moves">Move list</button>
            <button class="btn ghost" id="advTutLeave" data-k="tleave">${ico("back")}Leave the tutorial</button>
          </div>
          <div class="adv-mwrap" hidden>${movesHtml(B.lead.c)}</div>
        </div>`;
      const q = s => ov.querySelector(s);
      q("#advRes").onclick = () => togglePause();
      q("#advTutRe").onclick = () => { togglePause(); TUT.i--; tutNext(); };
      q("#advTutSkip").onclick = () => { togglePause(); if (TUT && !TUT.ok) tutNext(); };
      q("#advMoves").onclick = () => { const m = q(".adv-mwrap"); m.hidden = !m.hidden; };
      q("#advTutLeave").onclick = () => tutLeave();
      return autoFocus();
    }
    const dum = tr ? B.fs[1].ai.dummy : null;
    ov.innerHTML = `
      <div class="panel adv-small pop ${tr ? "adv-tpause" : ""}">
        <div class="panel-hd">${ico("info")}Paused</div>
        ${tr ? `<div class="adv-rules">${row("The dummy", "", seg("dum", DUMMY, dum))}</div>` : ""}
        <div class="adv-btns">
          <button class="btn" id="advRes" data-k="res">${ico("next")}Keep ${tr ? "training" : "fighting"}</button>
          ${tr ? `<button class="btn ghost" id="advReset" data-k="reset">Start again from the corners</button>
                  <button class="btn ghost" id="advMoves" data-k="moves">Move list</button>`
               : `<button class="btn ghost" id="advRe" data-k="re">Start the ${story ? "battle" : "match"} again</button>`}
          <button class="btn ghost" id="advSetup" data-k="setup">${story ? `${ico("book")}Story` : tr ? "Training setup" : "Battle setup"}</button>
          ${story ? "" : `<button class="btn ghost" id="advMain" data-k="main">${ico("back")}Main menu</button>`}
        </div>
        <div class="adv-mwrap" hidden>${movesHtml(B.lead.c)}</div>
      </div>`;
    const q = s => ov.querySelector(s);
    q("#advRes").onclick = () => togglePause();
    if (q("#advRe")) q("#advRe").onclick = () => { paused = false; startBattle(B.cfg); };
    if (q("#advReset")) q("#advReset").onclick = () => { paused = false; startBattle(B.cfg); };
    if (q("#advMoves")) q("#advMoves").onclick = () => { const m = q(".adv-mwrap"); m.hidden = !m.hidden; };
    q("#advSetup").onclick = () => { paused = false; if (story) storyMenu(); else if (tr) trainingSetup(true); else battleSetup(true); };
    if (q("#advMain")) q("#advMain").onclick = () => { paused = false; mainMenu(); };
    ov.querySelectorAll("[data-seg]").forEach(el => el.onclick = () => {
      B.fs[1].ai.dummy = el.dataset.v; B.cfg.slots[1].dummy = el.dataset.v; tset().act = el.dataset.v; save(saveData);
      ov.querySelectorAll("[data-seg]").forEach(x => x.classList.toggle("sel", x === el));
    });
    autoFocus();
  }
  /* the end of a match: who won, and everyone's numbers on the board */
  function battleOver() {
    const B = battle;
    if (B.cfg.net) return npBattleOver(B);
    if (B.cfg.tour) return tourBattleOver(B);
    if (B.cfg.chal) return chalOver(B);
    if (B.cfg.kind === "story") return storyBattleOver(B);
    { const me = B.fs.find(f => f.ctl === "p1"); if (me && B.winner === me.team && !B.counted) { B.counted = true; PROG().wins++; save(saveData); } checkUnlocks(); }
    mode = "results"; bgm("competition-results");
    host.querySelector(".adv-hud").classList.remove("on");
    /* (Emerl learns in his own story episode, not here) */
    const order = B.fs.slice().sort((a, b) => (b.team === B.winner) - (a.team === B.winner) || b.score - a.score || b.lives - a.lives || b.dealt - a.dealt);
    const ov = host.querySelector(".adv-ov");
    ov.innerHTML = `
      <div class="panel adv-small adv-bres pop">
        <div class="panel-hd gold">${ico("trophy")}${B.winner == null ? "A draw" : esc(winnerLine(B.winner).replace(/!$/, ""))}</div>
        <div class="adv-board">
          <div class="adv-row adv-bhd"><span></span><em>KOs</em><em>Down</em><em>Damage</em></div>
          ${order.map(f => `
            <div class="adv-row adv-frow ${f.team === B.winner ? "win" : ""}">
              <span><canvas width="44" height="40" data-face="${f.c.id}"></canvas><b>${esc(f.c.name)}</b><i style="--tc:${tagCol(f)}">${tagText(f)}</i></span>
              <b class="num">${f.kos}</b><b class="num">${f.downs}</b><b class="num">${Math.round(f.dealt)}</b>
            </div>`).join("")}
        </div>
        <div class="adv-btns">
          <button class="btn" id="advAgainB" data-focus data-k="again">${ico("flag")}Rematch</button>
          <button class="btn ghost" id="advBSet" data-k="set">Battle setup</button>
          <button class="btn ghost" id="advBMain" data-back data-k="main">${ico("back")}Main menu</button>
        </div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    ov.querySelector("#advAgainB").onclick = () => startBattle(B.cfg);
    ov.querySelector("#advBSet").onclick = () => battleSetup(true);
    ov.querySelector("#advBMain").onclick = () => mainMenu();
    setTimeout(autoFocus, 0);
  }

  /* Emerl's Skills: his slots, each set to his own move or one he has learned (Sonic Battle's skill
     cards, without the points: any mix goes). The arrows go through what he knows for that slot. */
  function emerlSkills(back) {
    const e = emerlSave(), ov = screenOn("setup");
    const all = emerlAll(), n = e.learned.length;
    const opts = slot => ["emerl"].concat(EM_SRC.filter(src => e.learned.includes(src + "." + slot)));
    const label = (slot, src) => src === "emerl" ? "His own" : `${EM.names[src][slot]} (${castOf(src).name})`;
    ov.innerHTML = `
      <div class="adv-menu pop">
        <div class="panel adv-panel adv-opts adv-emsk">
          <div class="panel-hd">${ico("cards")}Emerl's Skills</div>
          <div class="adv-emtop">
            <canvas width="88" height="72" data-face="emerl"></canvas>
            <div><b class="sx-big">${n}<i>/${all.length}</i></b><span>moves learned. Each battle Emerl wins as a player's fighter teaches him one more, at random.</span></div>
          </div>
          <div class="adv-rules">
            ${EM_SLOTS.map(([slot, nm]) => { const o = opts(slot), cur = e.loadout[slot] || "emerl";
              return row(nm, o.length > 1 ? `${o.length - 1} learned` : "Nothing learned yet", o.length > 1 ? arrows("em-" + slot, esc(label(slot, cur))) : `<div class="adv-pick"><b>${esc(label(slot, cur))}</b></div>`); }).join("")}
          </div>
          <div class="adv-go">
            <button class="btn lg" id="advEmDone" data-back data-focus data-k="done">${ico("check")}Done</button>
            <button class="btn ghost" id="advEmOwn" data-k="own">All his own</button>
          </div>
        </div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face));
    ov.querySelectorAll("[data-arr]").forEach(el => el.onclick = () => {
      const slot = el.dataset.arr.slice(3), o = opts(slot), cur = e.loadout[slot] || "emerl";
      const nx = o[(o.indexOf(cur) + +el.dataset.d + o.length) % o.length];
      if (nx === "emerl") delete e.loadout[slot]; else e.loadout[slot] = nx;
      save(saveData); emerlSkills(back);
    });
    ov.querySelector("#advEmOwn").onclick = () => { e.loadout = {}; save(saveData); emerlSkills(back); };
    ov.querySelector("#advEmDone").onclick = () => back();
    if (!kbFocus || !kbFocus.isConnected) autoFocus();
  }

  // ---------------------------------------------------------------- options
  /* Options: the game's own music, sound, dialogue-speed and screen-shake settings (the same
     ones the rest of Post Parade uses), and the keys two players share a keyboard with. A key is
     set by picking it and pressing the new one (Esc leaves it as it was); a key does one thing,
     so taking it from one place clears it from another. */
  const KEYMAP_KEY = "redringcircuit.keys";
  const ACTS = [["L", "Left"], ["R", "Right"], ["U", "Up"], ["D", "Down"], ["J", "Jump"], ["Z", "Light"], ["X", "Heavy"], ["C", "Special"]];
  const KEYS_DEF = () => ({
    p: [{ L: ["KeyA"], R: ["KeyD"], U: ["KeyW"], D: ["KeyS"], J: ["Space"], Z: ["KeyV"], X: ["KeyB"], C: ["KeyN"] },
        { L: ["ArrowLeft"], R: ["ArrowRight"], U: ["ArrowUp"], D: ["ArrowDown"], J: ["Numpad0", "Quote"], Z: ["Numpad1", "KeyK"], X: ["Numpad2", "KeyL"], C: ["Numpad3", "Semicolon"] }],
    padSwap: false });
  let KEYMAP = KEYS_DEF();
  try { const k = JSON.parse(localStorage.getItem(KEYMAP_KEY) || localStorage.getItem("postparade.adventure.keys")); if (k && k.p && k.p.length === 2) KEYMAP = Object.assign(KEYS_DEF(), k); } catch (e) {}
  const saveKeys = () => { try { localStorage.setItem(KEYMAP_KEY, JSON.stringify(KEYMAP)); } catch (e) {} };
  function duoKey(code) {
    if (!code) return null;
    for (let s = 0; s < 2; s++) for (const [a] of ACTS) if ((KEYMAP.p[s][a] || []).includes(code)) return [s, a];
    return null;
  }
  const KEY_NAMES = { Space: "Space", ArrowLeft: "←", ArrowRight: "→", ArrowUp: "↑", ArrowDown: "↓", Semicolon: ";", Quote: "'", Comma: ",",
    Period: ".", Slash: "/", Backslash: "\\", BracketLeft: "[", BracketRight: "]", Minus: "-", Equal: "=", Backquote: "`", ShiftLeft: "Left Shift",
    ShiftRight: "Right Shift", ControlLeft: "Left Ctrl", ControlRight: "Right Ctrl", AltLeft: "Left Alt", AltRight: "Right Alt", Tab: "Tab", Backspace: "Backspace",
    NumpadDecimal: "Num .", NumpadAdd: "Num +", NumpadSubtract: "Num -", NumpadMultiply: "Num *", NumpadDivide: "Num /" };
  const keyName = c => KEY_NAMES[c] || (/^Key./.test(c) ? c.slice(3) : /^Digit./.test(c) ? c.slice(5) : /^Numpad\d$/.test(c) ? "Num " + c.slice(6) : c);
  let rebind = null;
  function takeRebind(e) {
    const r = rebind; rebind = null;
    if (e.key !== "Escape" && e.code && !/^(Enter|NumpadEnter|Escape)$/.test(e.code)) {
      for (const m of KEYMAP.p) for (const [a] of ACTS) m[a] = (m[a] || []).filter(c => c !== e.code);
      KEYMAP.p[r.slot][r.act] = [e.code];
      saveKeys();
    }
    optionsScreen();
  }
  function optionsScreen(first) {
    const ov = screenOn("options");
    const S = root.Settings, def = id => S && S.DEFS.find(d => d.id === id);
    const setSeg = id => { const d = def(id); return d ? seg("set:" + id, d.choices, S.get(id)) : ""; };
    const K = KEYMAP.p;
    ov.innerHTML = `
      <div class="adv-menu pop">
        <div class="panel adv-panel adv-opts">
          <div class="panel-hd">${ico("gear")}Options</div>
          <div class="adv-rules">
            ${row("Music", "", setSeg("musicVolume"))}
            ${row("Sound effects", "", setSeg("sfxVolume"))}
            ${row("Dialogue speed", "How quickly the story's talk types out.", setSeg("textSpeed"))}
            ${row("Screen shake", "The jolt when a heavy blow lands.", seg("set:shake", [[1, "On"], [0, "Off"]], S && S.get("shake") === false ? 0 : 1))}
            ${row("Ping on player tags", "Online: each player's ping bars by their name, over their head and on their card.", seg("set:tagPing", [[1, "On"], [0, "Off"]], S && S.get("tagPing") === false ? 0 : 1))}
          </div>
          <p class="adv-note">Music, sound, dialogue speed and screen shake are Post Parade's own settings: they change for the whole game.</p>
          <div class="panel-hd adv-hd2">${ico("arcade")}Two players, one keyboard</div>
          <div class="adv-kmap">
            <div class="adv-kh"><span></span><b style="--tc:${SLOT_C[0]}">Player 1</b><b style="--tc:${SLOT_C[1]}">Player 2</b></div>
            ${ACTS.map(([a, l]) => `
              <div class="adv-kr"><span>${l}</span>
                ${[0, 1].map(s => `<button data-key="${s}:${a}" data-k="key-${s}-${a}" class="${rebind && rebind.slot === s && rebind.act === a ? "wait" : ""}">${
                  rebind && rebind.slot === s && rebind.act === a ? "Press a key" : (K[s][a] || []).map(keyName).join(" or ") || "None"}</button>`).join("")}
              </div>`).join("")}
          </div>
          <div class="adv-rules">
            ${row("Gamepads", "With two pads plugged in, which one is Player 1's.", seg("pad", [[0, "The first is Player 1's"], [1, "The first is Player 2's"]], KEYMAP.padSwap ? 1 : 0))}
          </div>
          <p class="adv-note">With one player the keys are always the arrows or W A S D, Space, Z, X and C. These are for a battle between two.</p>
          <div class="adv-go">
            <button class="btn lg" id="advODone" data-back data-focus data-k="done">${ico("check")}Done</button>
            <button class="btn ghost" id="advOReset" data-k="reset">Put the keys back as they were</button>
          </div>
        </div>
      </div>`;
    ov.querySelectorAll("[data-seg]").forEach(el => el.onclick = () => {
      const key = el.dataset.seg, v = el.dataset.v;
      if (key === "pad") { KEYMAP.padSwap = v === "1"; saveKeys(); }
      else if (key === "set:shake") S && S.set("shake", v === "1");
      else if (key === "set:tagPing") S && S.set("tagPing", v === "1");
      else if (S) { const d = def(key.slice(4)); const c = d && d.choices.find(c => String(c[0]) === v); if (c) S.set(d.id, c[0]); }
      bgmVolume();
      optionsScreen();
    });
    ov.querySelectorAll("[data-key]").forEach(el => el.onclick = () => {
      const [s, a] = el.dataset.key.split(":");
      rebind = { slot: +s, act: a }; optionsScreen();
    });
    ov.querySelector("#advOReset").onclick = () => { KEYMAP = KEYS_DEF(); saveKeys(); optionsScreen(); };
    ov.querySelector("#advODone").onclick = () => { rebind = null; mainMenu(); };
    if (first) autoFocus();
    else if (kbUsed && rebind) { const el = ov.querySelector(`[data-k="key-${rebind.slot}-${rebind.act}"]`); if (el) setFocus(el); }
  }

  // ---------------------------------------------------------------- the team: who can be played
  /* Every account starts with Sonic, Tails and Emerl, and their stories; the rest of the cast is won
     over -- in a story chapter, a challenge, a race, Red Star Rings found, animals freed, or
     Eggman's own tournament -- each with a scene of its own, and a card. Locked, they can still be
     met as CPUs (and in the story); they are never picked. saveData: unlocked (who -> when), chal
     (challenges open, who -> when), prog (battles won, animals freed, cups of 8 won). */
  const START_CAST = ["sonic", "tails", "emerl"];
  const PROG = () => (saveData.prog = saveData.prog || { wins: 0, animals: 0, cups: 0 });
  const hasFighter = id => START_CAST.includes(id) || !!(saveData && saveData.unlocked && saveData.unlocked[id]);
  const fightersN = () => CAST.filter(c => hasFighter(c.id)).length;
  const chalsOpen = () => Object.keys((saveData && saveData.chal) || {}).filter(id => !hasFighter(id));
  const chapterDone = (ep, title) => { const e = epOf(ep), i = e ? e.chapters.findIndex(c => c.title === title) : -1; return i >= 0 && epDone(ep) > i; };
  const redRings = () => stages().reduce((n, z, i) => n + zoneShoes(i), 0);
  const anyFinale = () => EPS().some(e => epDone(e.who) >= e.chapters.length);
  const SAY = "";
  const UNLOCK = {
    amy: { how: "story", need: () => chapterDone("sonic", "Hammer Time"), hint: `Clear "Hammer Time" in Sonic's story.`,
      join: [[SAY, "Rose Parlour. Amy has packed a bag: her hammer, her fortune cards, and a photo of Sonic."],
             ["amy", "Sonic said I could come along! ...Well, he didn't say I couldn't."],
             ["amy", "Look out, Eggman! Amy Rose is on the team!"]] },
    knuckles: { how: "story", need: () => chapterDone("sonic", "Tricked Again"), hint: `Clear "Tricked Again" in Sonic's story.`,
      join: [[SAY, "Guardian Peak. Knuckles stands over the empty shrines, fists clenched."],
             ["knuckles", "Eggman tricked me for the last time. Nobody takes the rings from this mountain and gets away with it."],
             ["knuckles", "Unlike Sonic, I don't chuckle. I'd rather flex. Let's go!"]] },
    chaos: { how: "story", need: () => chapterDone("tails", "The Water's Guardian"), hint: `Clear "The Water's Guardian" in Tails' story.`,
      join: [[SAY, "Moonwell Springs. The water stirs, and Chaos rises from the deepest pool, a Chao sitting on its shoulder."],
             [SAY, "It looks up at the stars, where Eggman's station turns. Then it steps out of the water and onto the path."],
             [SAY, "The guardian of the Chao will fight for them, wherever they need it."]] },
    cream: { how: "story", need: () => chapterDone("emerl", "Cream"), hint: `Clear "Cream" in Emerl's story.`,
      join: [["cream", "Cheese and I talked it over, and we'd like to help too! Mother says it's good manners to help your friends."],
             [SAY, "Cheese spins in the air and chirps, very much in agreement."],
             ["cream", "We'll do our very best! Won't we, Cheese?"]] },
    gamma: { how: "story", need: () => chapterDone("amy", "A Kind Word"), hint: `Clear "A Kind Word" in Amy's story.`,
      join: [["gamma", "New assignment confirmed: protect the girl. Stop the Star Engine."],
             ["gamma", "Query: is this what the old unit felt, when it chose? ...Data insufficient. Proceeding anyway."]] },
    shadow: { how: "fight", arena: "expressway", lvl: 2, need: () => chapterDone("sonic", "Prove It") && PROG().wins >= 10,
      hint: `Clear "Prove It" in Sonic's story, then win 10 battles in Battle mode.`, count: () => `Battles won: ${Math.min(10, PROG().wins)}/10`,
      what: "A one-on-one at Sundown Expressway, on Hard. Beat him, and he joins.",
      call: [[SAY, "Sundown Expressway, at dusk. A black hedgehog with red stripes is waiting in the middle of the road."],
             ["shadow", "Ten wins. I've been watching. You fight well... for someone who isn't the Ultimate Life Form."],
             ["shadow", "Come to the expressway. Prove it."]],
      join: [["shadow", "...Hmph. Not bad."],
             ["shadow", "Don't misunderstand. I'm not doing this for you. Eggman's engine threatens everything I promised to protect. I'll fight."]] },
    rouge: { how: "fight", arena: "club", lvl: 2, need: () => redRings() >= 15,
      hint: "Find 15 Red Star Rings in the zones. Someone else is after them too.", count: () => `Red Star Rings: ${Math.min(15, redRings())}/15`,
      what: "A one-on-one at Diamond Club, on Hard. Beat her, and she joins.",
      call: [[SAY, "Diamond Club, after midnight. A bat in black lounges on the bar, turning a Red Star Ring between her fingers."],
             ["rouge", "Fifteen Red Star Rings. You've been busy, sweetie. Busy doing MY job."],
             ["rouge", "Here's the deal: beat me, and I stop competing with you. Lose, and those rings are mine."]],
      join: [["rouge", "Oh, fine. You win. And a girl always knows when to switch to the winning side."],
             ["rouge", "Besides, Eggman's engine is the biggest jewel in the world. I just want to see it. Up close."]] },
    silver: { how: "zone", zone: "ruins", lvl: 2, need: () => chapterDone("sonic", "The Wrong Hedgehog"),
      hint: `Clear "The Wrong Hedgehog" in Sonic's story, then reach the end of Cinder City Act 2 in Free Exhibition.`,
      what: "He's waiting at the end of Cinder City Act 2, in Free Exhibition, where the boss would be.",
      call: [[SAY, "A message, scorched into a broken wall in Cinder City: \"I still need to be sure. Meet me at the end of the old quarter.\""],
             ["silver", "If the future really can change, I need to know the people who'll change it. I'll be waiting."]],
      meet: [[SAY, "At the end of the old quarter, Silver drops out of the smoke, his hands glowing cyan."],
             ["silver", "You came. Then show me: are you strong enough to change the future?"]],
      join: [["silver", "You really are... okay. I believe you. I believe in you!"],
             ["silver", "I'll stay in this time a little longer. If the future can change, I want to be there when it does."]] },
    metal: { how: "race", zone: "stars", pace: 1.08, need: () => chapterDone("sonic", "The Real Thing"),
      hint: `Clear "The Real Thing" in Sonic's story. Then he wants a rematch: a race.`,
      what: "A race through Comet Circuit Act 3, at full speed. Reach the goal post first.",
      call: [[SAY, "Comet Circuit. A silver-blue streak laps the racecourse, again and again, faster every time."],
             ["metal", "(Metal Sonic stops at the starting line. It points at you. Then down the track.)"],
             [SAY, "No fighting. No tricks. One run of Comet Circuit, the long way round, and the first to the goal post wins."]],
      join: [["metal", "(It stands at the goal post a long time, very still. Then it turns, and falls in beside you.)"],
             [SAY, "Second place felt, for the first time, like something it had never computed. Metal Sonic will run with you. For now."]] },
    mighty: { how: "count", need: () => PROG().animals >= 300,
      hint: "Free 300 animals from Eggman's badniks and capsules.", count: () => `Animals freed: ${Math.min(300, PROG().animals)}/300`,
      join: [[SAY, "Redstone Canyon. A red and black armadillo sits on a rock, with Flickies, rabbits and squirrels all round him."],
             ["mighty", "Three hundred little critters, set free from Eggman's machines. They told me all about you."],
             ["mighty", "I don't like fighting. But I like seeing them free even more. Count me in!"]] },
    eggman: { how: "cup", need: () => anyFinale(),
      hint: "Clear the last chapter of any story. Then he'll hold a tournament of his own.",
      what: "The Eggman Cup: a bracket of 8, with Eggman himself waiting in the final. Win it.",
      call: [["eggman", "Hohoho! So you beat me at my own engine. Well, I've had enough of losing on YOUR terms!"],
             ["eggman", "Welcome to the first annual EGGMAN CUP! Eight fighters, one bracket, and the greatest genius in the world waiting in the final!"],
             ["eggman", "Win it, and I'll... graciously allow you to... play as ME. Lose, and you'll never hear the end of it!"]],
      join: [["eggman", "No way! I can't believe this! In my OWN tournament!"],
             ["eggman", "...Very well. A genius knows when an alliance is to his advantage. The Eggman Empire is open for business. On YOUR side. Temporarily!"]] },
  };
  let PENDING = [], RETRO = null;
  /** What is newly won (a story or a count: on the team) or newly open to win (a challenge), queued
      to be shown -- unless `quiet` (a save from before the team was won over: one card for it all). */
  function checkUnlocks(quiet) {
    if (!saveData) return [];
    const U0 = saveData.unlocked = saveData.unlocked || {}, C0 = saveData.chal = saveData.chal || {}, got = [];
    for (const id in UNLOCK) {
      if (hasFighter(id) || PENDING.some(n => n.id === id)) continue;
      const u = UNLOCK[id];
      if (!u.need()) continue;
      if (u.how === "story" || u.how === "count") { U0[id] = Date.now(); got.push({ id, kind: "join" }); }
      else if (!C0[id]) { C0[id] = Date.now(); got.push({ id, kind: "chal" }); }
    }
    if (got.length) { save(saveData); if (!quiet) PENDING.push(...got); }
    return got;
  }
  function grantFighter(id) {
    (saveData.unlocked = saveData.unlocked || {})[id] = Date.now();
    if (saveData.chal) delete saveData.chal[id];
    save(saveData);
  }
  /* A save made before the team had to be won over: what its story already cleared is won now, and
     any challenge it has earned is open; one card says so, at the main menu. */
  function teamCatchUp() {
    if (!saveData) return;
    if (!hasFighter(castId)) { castId = "sonic"; saveData.cast = castId; }
    if (saveData.teamV) return;
    saveData.teamV = 1;
    const got = checkUnlocks(true);
    save(saveData);
    if (got.length) RETRO = got;
  }
  /* the unlocks waiting to be shown: each one's scene, then its card; then `then` */
  function showPending(then) {
    const n = PENDING.shift(); if (!n) { then(); return; }
    const u = UNLOCK[n.id];
    if (!world || battle) ensureStageWorld();
    playScene(n.kind === "join" ? u.join : u.call, () => unlockCard(n, () => showPending(then)));
  }
  const pendingFirst = then => { if (PENDING.length) { showPending(then); return true; } return false; };
  function unlockCard(n, next) {
    const c = castOf(n.id), u = UNLOCK[n.id], ep = epOf(n.id), join = n.kind === "join";
    const ov = screenOn("story");
    ov.innerHTML = `
      <div class="panel adv-small pop adv-ulk">
        <div class="adv-ulk-band">${join ? "New fighter" : "A new challenger"}</div>
        <canvas width="176" height="144" data-face="${n.id}"></canvas>
        <b class="adv-ulk-name">${join ? `${esc(c.name)} joins the team!` : `${esc(c.name)} ${u.how === "race" ? "wants a race" : u.how === "cup" ? "is holding a tournament" : "wants a fight"}!`}</b>
        <p class="adv-note">${join ? `${esc(poss(c.name))} story, <b>${esc(ep ? ep.title : "")}</b>, is open in Story, and ${esc(c.name)} can be picked in every mode. ${fightersN()} of ${CAST.length} on the team.`
          : `${esc(u.what)} It waits under Fighters, on the main menu.`}</p>
        <div class="adv-btns">
          ${join ? `<button class="btn" data-ok data-focus data-enter>${ico("check")}Let's go!</button>`
            : `<button class="btn" data-go data-focus data-enter>${ico("flag")}Take it on now</button><button class="btn ghost" data-ok data-back>Later</button>`}
        </div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 2));
    ov.querySelector("[data-ok]").onclick = () => next();
    if (ov.querySelector("[data-go]")) ov.querySelector("[data-go]").onclick = () => { PENDING = []; takeChallenge(n.id); };
    SFX.check && SFX.check();
    setTimeout(autoFocus, 0);
  }
  /* one card for a save from before: who is on the team already, and who is waiting */
  function retroCard(got, next) {
    const ov = screenOn("story"), joined = got.filter(g => g.kind === "join"), chal = got.filter(g => g.kind === "chal");
    ov.innerHTML = `
      <div class="panel adv-small pop adv-ulk">
        <div class="adv-ulk-band">The team</div>
        <p class="adv-note">Fighters are won over now: everyone starts with Sonic, Tails and Emerl. From your story so far:</p>
        <div class="adv-ulk-row">${joined.map(g => `<span><canvas width="88" height="72" data-face="${g.id}"></canvas><b>${esc(castOf(g.id).name)}</b></span>`).join("")}</div>
        ${joined.length ? `<p class="adv-note">${joined.length === 1 ? "joins" : "join"} the team.</p>` : ""}
        ${chal.length ? `<p class="adv-note">Waiting for you under Fighters: ${chal.map(g => esc(castOf(g.id).name)).join(", ")}.</p>` : ""}
        <div class="adv-btns"><button class="btn" data-ok data-focus data-enter>${ico("check")}Let's go!</button></div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    ov.querySelector("[data-ok]").onclick = () => next();
    setTimeout(autoFocus, 0);
  }

  /* ---- the challenges: a fight, a fight at a zone's end, a race, a tournament */
  function takeChallenge(id) {
    const u = UNLOCK[id];
    if (!u || hasFighter(id)) { fighters(); return; }
    if (u.how === "fight") playScene(u.call.slice(-1), () => chalFight(id));
    else if (u.how === "zone") {
      const zi = stageAt(u.zone);
      if (!actOpen(zi, 1)) { note(`Get to ${stages()[zi].name} Act 2 in Free Exhibition first.`); fighters(); return; }
      storyRun = null; RACE = null; stageIdx = zi; actIdx = 1; demo = null; play();
    } else if (u.how === "race") {
      const def = raceDef(stageAt(u.zone));
      loadDef(def);
      playScene(u.call.slice(-1), () => raceStart({ def, who: id, pace: u.pace, winLabel: "Fighters", backLabel: "Main menu", onBack: () => mainMenu(),
        onWin: () => { grantFighter(id); PENDING.push({ id, kind: "join" }); showPending(() => fighters()); } }));
    } else if (u.how === "cup") {
      playScene(u.call.slice(-1), () => {
        TOUR = tourMake({ size: 8, lvl: 1, goal: 2, arena: -1, online: false, cup: "eggman", humans: [{ name: root.Auth && Auth.user ? Auth.name : "You", who: castId, me: true }] });
        tourBracket();
      });
    }
  }
  function chalFight(id) {
    const u = UNLOCK[id];
    startBattle({ kind: "battle", chal: id, slots: [{ who: castId, ctl: "p1", team: 0 }, { who: id, ctl: "cpu", lvl: u.lvl, team: 1 }],
                  teams: true, arena: stageAt(u.arena || u.zone), rule: "stock", goal: 2, time: 180, hp: 200 });
  }
  function chalOver(B) {
    const id = B.cfg.chal, won = B.winner === B.fs[0].team;
    if (won) { grantFighter(id); endBattle(); PENDING.push({ id, kind: "join" }); showPending(() => fighters()); return; }
    mode = "results";
    host.querySelector(".adv-hud").classList.remove("on");
    const ov = host.querySelector(".adv-ov");
    ov.innerHTML = `
      <div class="panel adv-small pop">
        <div class="panel-hd">${ico("info")}${esc(castOf(id).name)} wins this time</div>
        <p class="adv-note">The challenge stays open under Fighters. Down guards, and held still heals; the move list is in Training.</p>
        <div class="adv-btns">
          <button class="btn" id="advTry" data-focus>${ico("flag")}Try again</button>
          <button class="btn ghost" id="advSt" data-back>${ico("person")}Fighters</button>
        </div>
      </div>`;
    ov.querySelector("#advTry").onclick = () => startBattle(B.cfg);
    ov.querySelector("#advSt").onclick = () => fighters();
    setTimeout(autoFocus, 0);
  }
  const note = msg => { if (root.AdventureOnline && AdventureOnline.toast) AdventureOnline.toast(msg); };

  /* The Fighters screen: the team, and how to win over the rest (the challenges open, to take on) */
  function fighters() {
    if (pendingFirst(fighters)) return;
    const ov = screenOn("story");
    ensureStageWorld();
    const open = chalsOpen();
    ov.innerHTML = `
      <div class="adv-menu pop">
        <div class="panel adv-panel">
          <div class="panel-hd">${ico("person")}Fighters: ${fightersN()} of ${CAST.length}</div>
          <p class="adv-note">Everyone starts with Sonic, Tails and Emerl. The rest of the cast is won over: in the story, in challenges, and out in the zones.</p>
          <div class="setrow"><div class="setlab"><b>Your fighter</b><i>For the challenges, Free Exhibition and the Tournament.</i></div><div class="adv-pick"><button class="adv-arr" data-pk="-1">${ico("back")}</button><canvas width="44" height="40" data-face="${castId}"></canvas><b>${esc(castOf(castId).name)}</b><button class="adv-arr" data-pk="1">${ico("next")}</button></div></div>
          <div class="adv-roster">
            ${CAST.map(c => { const has = hasFighter(c.id), u = UNLOCK[c.id] || {}, ch = !has && open.includes(c.id);
              return `
              <div class="adv-rst ${has ? "" : "locked"} ${ch ? "chal" : ""}">
                <canvas width="88" height="72" data-face="${c.id}" ${has ? "" : 'data-dark="1"'}></canvas>
                <div class="adv-rst-tx"><b>${has ? esc(c.name) : "???"}</b><i>${has ? "On the team" : esc(ch ? u.what : u.hint)}</i>${!has && u.count ? `<em>${esc(u.count())}</em>` : ""}</div>
                ${ch ? `<button class="btn" data-chal="${c.id}" data-k="chal-${c.id}">${ico("flag")}${u.how === "race" ? "Race" : u.how === "cup" ? "Enter" : u.how === "zone" ? "Go there" : "Fight"}</button>` : ""}
              </div>`; }).join("")}
          </div>
          <div class="adv-go"><button class="btn ghost" data-back data-focus data-k="back">${ico("back")}Main menu</button></div>
        </div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    ov.querySelectorAll("[data-chal]").forEach(b => b.onclick = () => takeChallenge(b.dataset.chal));
    ov.querySelectorAll("[data-pk]").forEach(b => b.onclick = () => { castId = cycleTeam(castId, +b.dataset.pk); saveData.cast = castId; save(saveData); fighters(); });
    ov.querySelector("[data-back]").onclick = () => mainMenu();
    autoFocus();
  }
  /* the next fighter on the team, either way round */
  function cycleTeam(id, d) {
    const ids = CAST.map(c => c.id).filter(hasFighter);
    const i = ids.indexOf(id);
    return ids[((i < 0 ? 0 : i + d) % ids.length + ids.length) % ids.length];
  }

  // ---------------------------------------------------------------- story
  /* The story: The Red Star Rings, told as an episode for each of the cast, the way Sonic
     Battle tells its story (adventure-story.js and its two parts). An episode is chapters, each a
     scene of talk, then a stage to run (the story's own, or a zone's Act 1), a zone to go through
     (its Act 1 and Act 2, and at the end its boss or one of the cast, and a fight) or a battle to
     win, as the episode's own runner, then the talk after. Every episode is open from the start; in one,
     clearing a chapter opens the next, and a cleared one can be played again. In Emerl's, a
     battle won teaches him moves of the one he beat (a chapter's `teach`), and nowhere else. */
  const EPS = () => (root.AdventureStory && AdventureStory.EPISODES) || [];
  const epOf = who => EPS().find(e => e.who === who);
  const chOf = (ep, i) => ep && ep.chapters[i] ? Object.assign({ who: ep.who }, ep.chapters[i]) : null;
  let storyRun = null, talk = null;
  const epDone = who => (saveData.story && saveData.story.eps && saveData.story.eps[who]) || 0;
  const poss = name => name + (/s$/.test(name) ? "'" : "'s");   // Tails', Knuckles'; Sonic's
  const epsCleared = () => EPS().filter(e => epDone(e.who) >= e.chapters.length).length;
  function chapterLine(ch) {
    const who = castOf(ch.who).name;
    if (ch.kind === "run") { const d = storyDef(ch); return `${who}: ${d.name}${d.actN ? " Act " + d.actN : ""}`; }
    if (ch.kind === "race") return `${who}: ${stages()[stageAt(ch.zone)].name} Act 3, a race against ${castOf(ch.rival).name}`;
    if (ch.kind === "zone") {
      const z = stages()[stageAt(ch.zone)], with_ = (ch.allies || []).map(a => castOf(a).name);
      return `${who}: ${z.name}, Acts 1 and 2, then ${ch.foes ? ch.foes.map(f => castOf(f.who).name).join(" & ") + (with_.length ? " (with " + with_.join(" & ") + ")" : "")
        : "Eggman's " + (BOSS[z.boss] ? BOSS[z.boss].name : "robot")}`;
    }
    const foes = ch.foes.map(f => castOf(f.who).name).join(" & "), with_ = (ch.allies || []).map(a => castOf(a).name);
    return `${[who].concat(with_).join(" & ")} against ${foes}, at ${stages()[stageAt(ch.arena)].name}`;
  }
  /** The story's first screen: whose episode. (With `who`, or from a chapter, that episode's chapters.) */
  function storyMenu(who) {
    if (pendingFirst(() => storyMenu(who))) return;
    if (who === undefined && storyRun) who = storyRun.who;
    storyRun = null;
    if (who && epOf(who)) return storyEpisode(who);
    const ov = screenOn("story");
    ensureStageWorld();
    const list = EPS(), last0 = (saveData.story && saveData.story.last) || (list[0] && list[0].who), last = hasFighter(last0) ? last0 : "sonic";
    ov.innerHTML = `
      <div class="adv-menu pop">
        <div class="panel adv-panel">
          <div class="panel-hd">${ico("book")}Story: ${esc((root.AdventureStory && AdventureStory.TITLE) || "")}</div>
          <p class="adv-note">One story, told from every side. Whose episode?</p>
          <div class="adv-stages adv-chs">
            ${list.map(ep => { const n = ep.chapters.length, d = Math.min(epDone(ep.who), n); return `
              <button class="adv-st ${ep.who === last ? "on" : ""} ${hasFighter(ep.who) ? "" : "locked"}" data-ep="${ep.who}" data-k="ep-${ep.who}" ${ep.who === last ? "data-focus" : ""} ${hasFighter(ep.who) ? "" : "disabled"}>
                <canvas class="adv-st-who" width="36" height="38" data-face="${ep.who}" ${hasFighter(ep.who) ? "" : 'data-dark="1"'}></canvas>
                <span class="adv-st-tx"><b>${hasFighter(ep.who) ? `${esc(castOf(ep.who).name)}: ${esc(ep.title)}` : "???"}</b><i>${esc(hasFighter(ep.who) ? ep.blurb : (UNLOCK[ep.who] || {}).hint || "")}</i></span>
                <span class="adv-chk">${!hasFighter(ep.who) ? `${ico("lock")}Locked` : d >= n ? `${ico("check")}Cleared` : d ? `${d}/${n}` : `${n} chapters`}</span>
              </button>`; }).join("")}
          </div>
          <div class="adv-go">
            <button class="btn ghost" id="advSBack" data-back data-k="back">${ico("back")}Main menu</button>
          </div>
        </div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "idle", 1));
    ov.querySelectorAll("[data-ep]").forEach(b => b.onclick = () => { if (hasFighter(b.dataset.ep)) storyEpisode(b.dataset.ep); });
    ov.querySelector("#advSBack").onclick = () => mainMenu();
    autoFocus();
    const on = ov.querySelector(".adv-st.on"); if (on) on.scrollIntoView({ block: "nearest" });
  }
  /** One runner's episode: its chapters. */
  function storyEpisode(who) {
    if (!hasFighter(who)) { storyMenu(null); return; }
    storyRun = null;
    const ep = epOf(who); if (!ep) return storyMenu(null);
    saveData.story = saveData.story || {}; saveData.story.last = who; save(saveData);
    const ov = screenOn("story");
    ensureStageWorld();
    const list = ep.chapters.map((c, i) => chOf(ep, i)), done = epDone(who), next = Math.min(done, list.length - 1);
    ov.innerHTML = `
      <div class="adv-menu pop">
        <div class="panel adv-panel">
          <div class="panel-hd">${ico("book")}${esc(castOf(who).name)}: ${esc(ep.title)}</div>
          <p class="adv-note">${esc(ep.blurb)}${who === "emerl" ? " Each battle he wins here teaches him one or two moves of the one he beat; set them in Emerl's Skills." : ""}</p>
          <div class="adv-stages adv-chs">
            ${list.map((ch, i) => { const open = i <= done; return `
              <button class="adv-st ${i === next ? "on" : ""} ${open ? "" : "locked"}" data-ch="${i}" data-k="ch-${i}" ${open ? "" : "disabled"}>
                <span class="adv-n">${i + 1}</span>
                <canvas class="adv-st-who" width="36" height="38" data-face="${ch.rival || (ch.foes ? ch.foes[0].who : ch.who)}"></canvas>
                <span class="adv-st-tx"><b>${esc(ch.title)}</b><i>${esc(chapterLine(ch))}</i></span>
                <span class="adv-chk">${!open ? `${ico("lock")}Locked` : i < done ? `${ico("check")}Cleared` : ch.kind === "battle" ? "Battle" : ch.kind === "zone" ? "Zone" : ch.kind === "race" ? "Race" : "Stage"}</span>
              </button>`; }).join("")}
          </div>
          <div class="adv-go">
            <button class="btn lg" id="advCont" data-enter data-focus data-k="cont">${ico("book")}${done >= list.length ? `Play chapter ${list.length} again` : done ? `Go on: chapter ${next + 1}${atLine(who, next)}` : "Begin the episode" + atLine(who, next)}</button>
            ${who === "emerl" ? `<button class="btn ghost" id="advEpSkill" data-k="skill">Emerl's Skills</button>` : ""}
            <button class="btn ghost" id="advSBack" data-back data-k="back">${ico("back")}Episodes</button>
          </div>
        </div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "idle", 1));
    ov.querySelectorAll("[data-ch]").forEach(b => b.onclick = () => { if (+b.dataset.ch <= done) playChapter(who, +b.dataset.ch); });
    ov.querySelector("#advCont").onclick = () => playChapter(who, next);
    if (ov.querySelector("#advEpSkill")) ov.querySelector("#advEpSkill").onclick = () => emerlSkills(() => storyEpisode(who));
    ov.querySelector("#advSBack").onclick = () => storyMenu(null);
    autoFocus();
    const on = ov.querySelector(".adv-st.on"); if (on) on.scrollIntoView({ block: "nearest" });
  }
  function playChapter(who, i) {
    const ep = epOf(who), ch = chOf(ep, i); if (!ch) return;
    endBattle();
    storyRun = { who, ep, i, ch };
    if (ch.kind === "zone") { playZone(ch); return; }
    if (ch.kind === "race") { playRaceChapter(ch); return; }
    if (ch.kind === "run") { storyRun.def = storyDef(ch); loadDef(storyRun.def); glideX = 12; camX = 15; }
    else { disposeWorld(); world = buildWorld(arenaDef(stageAt(ch.arena))); player = makePlayer(castOf(ch.who)); glideX = world.W / 2; snapCamera(); }
    music();
    playScene(ch.before, () => storyAction());
  }
  function storyAction() {
    const ch = storyRun.ch;
    if (ch.kind === "run") { play(); return; }
    storyFight(ch);
  }
  /* a chapter's battle: in its arena (a zone chapter's, that zone's) */
  function storyFight(ch) {
    const slots = [{ who: ch.who, ctl: "p1", team: 0 }].concat((ch.allies || []).map(a => ({ who: a, ctl: "cpu", lvl: 1, team: 0 })),
                  ch.foes.map(f => ({ who: f.who, ctl: "cpu", lvl: f.lvl == null ? 1 : f.lvl, team: 1 })));
    startBattle({ kind: "story", slots, teams: true, arena: stageAt(ch.arena || ch.zone), rule: "stock", goal: 1, time: 0, hp: 300 });
  }
  /* a run's stage: one of the story's own, or a zone's first Act (no boss) */
  const storyDef = ch => storyStages().find(s => s.id === ch.stage) || actDef(stageAt(ch.stage), 0);
  /* A zone chapter (`kind: "zone"`): the zone's Act 1, the talk between (`mid`), its Act 2 (its own
     `beats2`), and at Act 2's end its boss -- Eggman's robot -- or, with `foes`, one of the cast
     waiting in the boss's arena: the screen shuts as it does for a boss, they drop in, a word
     (`meet`), and the stage gives way to the fight, in that zone's own arena. How far it got is
     kept (`story.at`): with Act 1 cleared it goes on at Act 2; at the fight, at the fight. */
  const isZone = ch => !!ch && ch.kind === "zone";
  const rivalOf = ch => isZone(ch) && ch.foes && ch.foes.length ? ch.foes[0].who : null;
  const storyAtOf = (who, i) => { const a = saveData.story && saveData.story.at; return a && a.who === who && a.i === i ? a.act : 0; };
  const atLine = (who, i) => { const a = storyAtOf(who, i); return a >= 2 ? " (the fight)" : a >= 1 ? " (Act 2)" : ""; };
  function zoneAct(a) {
    const R = storyRun;
    R.act = a; R.def = actDef(stageAt(R.ch.zone), a); R.said = {};
    loadDef(R.def); glideX = 12; camX = 15;
  }
  function storyAt(act) {
    const R = storyRun; if (!R || R.net) return;
    saveData.story = saveData.story || {};
    saveData.story.at = act ? { who: R.who, i: R.i, act } : null; save(saveData);
  }
  function playZone(ch) {
    const R = storyRun, from = storyAtOf(R.who, R.i);
    if (from >= 2 && rivalOf(ch)) { zoneAct(1); R.meetNow = true; music(); play(); return; }     // back at the fight
    if (from >= 1) { zoneAct(1); music(); playScene(ch.mid, () => play()); return; }             // back at Act 2
    zoneAct(0); music(); playScene(ch.before, () => play());
  }
  /* A race chapter (`kind: "race"`): the zone's Act 3, the racecourse, against `rival` -- a CPU
     runner on the course with you; first to the post wins, and the story goes on */
  function playRaceChapter(ch) {
    const R = storyRun, def = raceDef(stageAt(ch.zone));
    R.def = def; loadDef(def); glideX = 12; camX = 15; music();
    playScene(ch.before, () => raceStart({ def, who: ch.rival, pace: ch.pace || 1.25, winLabel: "Go on with the story", backLabel: "Story",
      onWin: () => { storyRun = R; storyAfter(); }, onBack: () => storyMenu() }));
  }
  /* Act 1 cleared: the talk between, and on into Act 2 */
  function zoneNext() {
    storyAt(1);
    zoneAct(1); music();
    playScene(storyRun.ch.mid, () => play());
  }
  function rivalSpec(def) {
    if (!def || !def.last || !def.zone) return null;
    if (storyRun && rivalOf(storyRun.ch) && def.zone.id === storyRun.ch.zone) { const ch = storyRun.ch; return { who: rivalOf(ch), hero: ch.who, meet: ch.meet, story: true, fight: () => storyFight(ch) }; }
    const u = UNLOCK.silver;                                   // Silver's challenge: at the end of Cinder City Act 2, in Free Exhibition
    if (!storyRun && !NP.on && !RACE && def.zone.id === u.zone && saveData && saveData.chal && saveData.chal.silver && !hasFighter("silver"))
      return { who: "silver", hero: runnerId(), meet: u.meet, fight: () => chalFight("silver") };
    return null;
  }
  function newRival(w, spec) {
    const x0 = w.arena.x0, a0 = x0 + 11, a1 = a0 + BOSS_W;
    return { who: spec.who, spec, C: { chase: false }, x0, a0, a1, camX: (a0 + a1) / 2, gy: w.arena.y, state: "wait", t: 0, lock: false,
             x: a1 - 4, y: w.arena.y + 10, vy: 0, landed: false, card: null };
  }
  /* (while they drop in, nobody moves) */
  const rivalHold = () => !!(world && world.rival && world.rival.state === "in" && mode === "play");
  function stepRival(dt) {
    const r = world.rival, p = player; if (!r || !p || battle) return;
    if (r.state === "wait") {
      if (storyRun && storyRun.meetNow) { storyRun.meetNow = false; p.x = r.a0 + 2.5; p.y = r.gy; p.vx = p.vy = 0; p.ground = true; snapCamera(); }
      if (p.dead || p.x <= r.a0 + 1.5) return;
      if (NP.on && NP.race) { r.state = "done"; finish(p); return; }       // story co-op: home here; the fight comes when everyone is
      r.state = "in"; r.t = 0; r.lock = true; r.landed = false;
      r.x = clamp(p.x + 5, r.a0 + 4, r.a1 - 3); r.y = r.gy + 10; r.vy = 0;
      r.card = makeCard(r.who); world.group.add(r.card);
      if (r.spec.story) storyAt(2);
      SFX.bossIn(); hudToast(castOf(r.who).name);
      return;
    }
    if (r.lock) { const L = r.a0 + 0.5, Rx = r.a1 - 0.5; if (p.x < L) { p.x = L; if (p.vx < 0) p.vx = 0; } if (p.x > Rx) { p.x = Rx; if (p.vx > 0) p.vx = 0; } }
    if (r.state === "in") {
      r.t += dt;
      if (!r.landed) {
        r.vy -= GRAV * dt; r.y += r.vy * dt;
        if (r.y <= r.gy) { r.y = r.gy; r.landed = true; shakeCam(0.12); SFX.impact(); burst(r.x, r.gy + 0.2, [0xd8d0c0, 0xffffff, 0xa8a090], 14, 5); }
      }
      if (r.landed && r.t > 1.1 && p.ground) { r.state = "talk"; rivalMeet(); }
    }
  }
  function drawRival() {
    const r = world.rival; if (!r || !r.card || battle) return;
    const n = (framesOf(r.who, "idle") || [0]).length, c = castOf(r.who);
    setFrame(r.card, "idle", Math.floor(world.t * 7) % n, player && player.x < r.x ? -1 : 1, r.x, r.y + (c.lift && r.landed ? c.lift : 0));
  }
  /* face to face: the camera holds on the arena through the talk; then VS, and the fight */
  function rivalMeet() {
    const r = world.rival, p = player;
    p.face = r.x > p.x ? 1 : -1; p.vx = 0; p.state = "run";
    glideX = r.camX - 3; camX = r.camX;
    playScene(r.spec.meet, () => rivalVs(r), p.x < r.x ? { l: p.c.id, r: r.who } : { l: r.who, r: p.c.id });
  }
  function rivalVs(r) {
    showVs({ who: r.spec.hero, foes: [{ who: r.who }] }, () => { if (world && world.rival === r && mode === "scene") r.spec.fight(); });
  }
  /* the VS card: the hero and the one they meet, a moment, then on (`then`) */
  function showVs(ch, then) {
    const ov = screenOn("scene");
    ov.innerHTML = `<div class="adv-vs"><canvas width="176" height="144" data-face="${ch.who}"></canvas><b>VS</b><canvas width="176" height="144" data-face="${ch.foes[0].who}"></canvas></div>`;
    ov.querySelectorAll("[data-face]").forEach((cv, i) => { paintCard(cv, cv.dataset.face, "portrait", 2); cv.classList.toggle("flip", flipFor(cv.dataset.face, i ? "r" : "l")); });
    SFX.dash();
    setTimeout(then, 1150);
  }
  /* A word from someone mid-run: a chapter's `beats` are [how far along (0 to 1), who, words];
     each comes once a run, in a speech box up top, while the running goes on. */
  function storyBeats(dt) {
    const R = storyRun, BT = R && (R.act === 1 ? R.ch.beats2 : R.ch.beats);
    const end = world && (world.goal ? world.goal.x : world.arena ? world.arena.x0 + 11 : 0);
    if (!R || !BT || !world || !end || paused || mode !== "play") return;
    const el = host.querySelector(".adv-comm"); if (!el) return;
    R.said = R.said || {};
    R.commT = Math.max(0, (R.commT || 0) - dt);
    if (R.commT <= 0) el.classList.remove("on");
    if (R.commT > 0.4 || world.t < 2.4) return;
    const at = player.x / end;
    const k = BT.findIndex((b, n) => !R.said[n] && at >= b[0]);
    if (k < 0) return;
    const [, who, text] = BT[k];
    R.said[k] = true;
    paintCard(el.querySelector("canvas"), who);
    el.style.setProperty("--tc", "#" + (HIT_C[who] || 0x4a9dff).toString(16).padStart(6, "0"));
    el.querySelector("b").textContent = castOf(who).name; el.querySelector("span").textContent = text;
    el.classList.add("on"); R.commT = 2.4 + text.length * 0.05;
  }
  function storyBattleOver(B) {
    const R = storyRun, won = B.winner === B.fs[0].team;
    if (won) {
      /* Emerl's episode: he copies one or two moves of the one he beat (Sonic Battle's skill cards) */
      R.got = null;
      if (R.ch.teach && R.ch.who === "emerl") {
        R.got = [];
        for (let k = 0, n = Math.random() < 0.5 ? 2 : 1; k < n; k++) { const g = emerlLearn(R.ch.teach); if (g) R.got.push(g); }
      }
      storyAfter(); return;
    }
    mode = "results";
    host.querySelector(".adv-hud").classList.remove("on");
    const ov = host.querySelector(".adv-ov");
    ov.innerHTML = `
      <div class="panel adv-small pop">
        <div class="panel-hd">${ico("info")}Beaten</div>
        <p class="adv-note">${esc(castOf(R.ch.who).name)} is down. Down guards, and held still heals; the move list is in Training.</p>
        <div class="adv-btns">
          <button class="btn" id="advTry" data-focus data-k="try">${ico("flag")}Try again</button>
          <button class="btn ghost" id="advSt" data-back data-k="st">${ico("book")}Episode</button>
        </div>
      </div>`;
    ov.querySelector("#advTry").onclick = () => startBattle(B.cfg);
    ov.querySelector("#advSt").onclick = () => storyMenu();
    setTimeout(autoFocus, 0);
  }
  /* the talk after a cleared chapter, over the stage or the arena it was won in */
  function storyAfter() {
    const R = storyRun; if (!R) return;
    endBattle();
    if (world && world.def.arena) glideX = world.W / 2;
    else if (world) { glideX = Math.max(12, Math.min(world.W - 31, (world.goal ? world.goal.x : world.W) - 22)); camX = glideX + 3; }
    playScene(R.ch.after, () => chapterClear());
  }
  function chapterClear() {
    const R = storyRun, ep = R.ep, i = R.i;
    saveData.story = saveData.story || {};
    const eps = saveData.story.eps = saveData.story.eps || {};
    eps[R.who] = Math.max(eps[R.who] || 0, i + 1); saveData.story.last = R.who;
    if (saveData.story.at && saveData.story.at.who === R.who && saveData.story.at.i === i) saveData.story.at = null;
    save(saveData);
    if (!R.ulk) { R.ulk = true; checkUnlocks(); if (pendingFirst(() => chapterClear())) return; }
    const n = ep.chapters.length, next = i + 1 < n ? i + 1 : -1, nch = next >= 0 ? chOf(ep, next) : null, all = epsCleared();
    const ov = screenOn("story");
    const skills = !R.got ? "" : R.got.length ? R.got.map(g => `
        <div class="adv-skill">
          <canvas width="88" height="72" data-face="${g.src}"></canvas>
          <div><em>New skill</em><b>${esc(g.name)}</b><i>${esc(poss(castOf(g.src).name))} ${esc(g.slotName.toLowerCase())}: Emerl copied it. Set it in Emerl's Skills.</i></div>
        </div>`).join("") : `<p class="adv-note">Emerl already knows every move ${esc(castOf(R.ch.teach).name)} has to teach.</p>`;
    ov.innerHTML = `
      <div class="panel adv-small pop">
        <div class="panel-hd gold">${ico("check")}Chapter ${i + 1}: ${esc(R.ch.title)}</div>
        ${skills}
        <p class="adv-note">${next >= 0 ? `Next, chapter ${next + 1}: <b>${esc(nch.title)}</b>. ${esc(chapterLine(nch))}.`
          : `The end of ${esc(poss(castOf(R.who).name))} episode. ${all} of ${EPS().length} episodes cleared. ${all < EPS().length ? "The other sides of the story are waiting." : "Every side of the story is told. Thank you for playing."}`}</p>
        <div class="adv-btns">
          ${next >= 0 ? `<button class="btn" id="advNextCh" data-focus data-enter data-k="next">${ico("next")}Chapter ${next + 1}</button>` : ""}
          ${R.got && R.got.length ? `<button class="btn ghost" id="advChSkill" data-k="skill">Emerl's Skills</button>` : ""}
          <button class="btn ${next >= 0 ? "ghost" : ""}" id="advToStory" data-back data-k="story" ${next >= 0 ? "" : "data-focus"}>${ico("book")}${next >= 0 ? "Episode" : "Episodes"}</button>
        </div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    if (next >= 0) ov.querySelector("#advNextCh").onclick = () => playChapter(R.who, next);
    if (ov.querySelector("#advChSkill")) ov.querySelector("#advChSkill").onclick = () => emerlSkills(() => storyEpisode(R.who));
    ov.querySelector("#advToStory").onclick = () => next >= 0 ? storyEpisode(R.who) : storyMenu(null);
    autoFocus();
  }

  /* A scene: the speaker's Sonic Battle portrait on their side (the first to speak on the
     left, the next on the right; a third takes the place of whoever spoke longest ago), their
     name, and their words typed out at the dialogue speed Options sets. Z, Enter or a tap goes
     on (all of a line at once, then the next); X skips the rest. Narration has no portrait. */
  const lineOf = x => Array.isArray(x) ? { who: x[0], text: x[1], act: x[2] || null } : x;
  /* What the speaker's bust does as they say it -- a line can name it (a third item: "hop",
     "laugh", "shake", "shock", "tilt", "slump", "nod", "lean", "flee", "think"); if not, the
     words say: a laugh, a shout, a gasp, a question, a sigh, an exit. A bust that flees runs
     off its side of the screen, jittering, and comes back in when its runner speaks again. */
  const G_ACTS = ["hop", "laugh", "shake", "shock", "tilt", "slump", "nod", "lean", "flee", "think", "enter", "flinch"];
  const G_FLEE = /\b(time to (go|leave|run|scram)|retreat|i'?ll be back|you haven'?t seen the last|until next time|so long|i'?ll get you|you'?ll regret|i'?m (out of|outta) here|run for it|see you later|later, (hedgehog|losers?|fools?)|fall back)\b/i;
  const G_GONE = /\b(spins|zooms|wobbles|flies|races|runs|speeds|blasts|darts|dashes|shoots|roars|rockets|scurries|hurries|bolts) (away|off)\b|\bis gone\b|\bgets away\b|\bescapes\b|\bflees\b|\bvanishes\b/i;
  function actOf(L) {
    const t = (L.text || "").trim();
    if (G_FLEE.test(t)) return "flee";
    if (/\b(ha(ha)+|ho ?ho(ho)*|heh(eh)*|hee ?hee|tee ?hee)\b|\bhah!/i.test(t)) return "laugh";
    if (/^(what|huh|wha|eh|whoa|woah|no way|impossible|eek|gah)\b|\?!|!\?/i.test(t)) return "shock";
    if (/\b(grr+|argh+|blast( it)?|curses?|how dare|you'?ll pay|enough|stop right there|get back here|you traitor|why,? you|outrageous)\b|\bhmph!/i.test(t)) return "shake";
    if (/^\.\.\.|\b(sigh|sorry|i'?m afraid|lost|failed|alone|too late|i miss)\b/i.test(t)) return "slump";
    if (/^\(/.test(t)) return "think";                       // (a robot that doesn't speak: what it does instead)
    if (/^(yes|yeah|right|okay|ok|got it|understood|sure|agreed|of course|affirmative|confirmed|deal)\b/i.test(t)) return "nod";
    if (/!/.test(t) && /\b(yay|hooray|awesome|great|alright|all right|let'?s go|woo+|thank(s| you)|we did it|you did it|wonderful|amazing)\b/i.test(t)) return "hop";
    if (/\?$/.test(t)) return "tilt";
    if (/!$/.test(t)) return "lean";
    return null;
  }
  /* a bust's names in the narration: its runner's, and what they go about in */
  const G_ALIAS = { eggman: ["Egg Mobile"], tails: ["the fox"], gamma: ["Gamma"], metal: ["Metal Sonic"] };
  function namedIn(text, who) {
    const c = castOf(who), nm = ((c && c.name) || who).replace(/^Dr\. /, "");
    if (who === "sonic") return /(?<!Metal )\bSonic\b/.test(text);
    return [nm].concat(G_ALIAS[who] || []).some(n => text.includes(n));
  }
  /* the busts stand behind the talk box, their cut-off edge always under it: the box's top
     (with the whole line in it) is where they stand, sunk a way below it */
  function seatBusts(T, text) {
    const wrap = T.ov.querySelector(".adv-talk"), box = T.ov.querySelector(".adv-tk-box"), tx = T.ov.querySelector(".adv-tk-text");
    if (!wrap || !box || !tx) return;
    const keep = tx.textContent; tx.textContent = text || "";
    const top = wrap.getBoundingClientRect().bottom - box.getBoundingClientRect().top;
    tx.textContent = keep;
    if (top > 0) wrap.style.setProperty("--tkb", Math.round(top) + "px");
  }
  function gesture(T, side, act) {
    const cv = T.ov.querySelector(".adv-tk-face." + side); if (!cv) return;
    for (const a of G_ACTS) cv.classList.remove("g-" + a);
    if (!act) return;
    void cv.offsetWidth;                                 // (from the start again)
    cv.classList.add("g-" + act);
    T.gone[side] = act === "flee";
  }
  function playScene(lines, done, seat) {
    lines = (lines || []).map(lineOf);
    if (!lines.length) { done(); return; }
    const ov = screenOn("scene");
    ov.innerHTML = `
      <div class="adv-talk">
        <canvas class="adv-tk-face l" width="176" height="144"></canvas>
        <canvas class="adv-tk-face r" width="176" height="144"></canvas>
        <div class="adv-tk-box">
          <div class="adv-tk-name"></div>
          <div class="adv-tk-text"></div>
          <div class="adv-tk-hint">${TOUCH ? "Tap to go on" : "<b>Z</b> or <b>Enter</b> to go on &middot; <b>X</b> skips the scene"}</div>
        </div>
        <button class="btn ghost adv-tk-skip" data-k="skip">Skip</button>
      </div>`;
    talk = { lines, i: -1, done, shown: 0, t: 0, sides: { l: null, r: null }, seat: seat || null, gone: { l: false, r: false }, last: "r", ov };
    ov.querySelector(".adv-talk").onclick = e => { if (e.target.closest(".adv-tk-skip")) sceneSkip(); else sceneNext(); };
    sceneNext();
  }
  const textMs = () => { const v = root.Settings && Settings.get("textSpeed"); return v == null ? 18 : v; };
  function sceneNext() {
    const T = talk; if (!T) return;
    const L = T.lines[T.i];
    if (L && T.shown < L.text.length) { T.shown = L.text.length; paintTalk(); return; }
    T.i++;
    if (T.i >= T.lines.length) { talk = null; T.done(); return; }
    const n = T.lines[T.i];
    T.shown = 0; T.t = 0;
    if (n.who) {
      let side = T.sides.l === n.who ? "l" : T.sides.r === n.who ? "r" : null;
      if (!side) {
        /* (a meeting in the world seats each where they stand: `seat` {l, r}) */
        const st = T.seat && (T.seat.l === n.who ? "l" : T.seat.r === n.who ? "r" : null);
        side = st || (T.sides.l == null && !(T.seat && T.seat.l) ? "l" : T.sides.r == null && !(T.seat && T.seat.r) ? "r" : T.sides.l == null ? "l" : T.sides.r == null ? "r" : T.last === "l" ? "r" : "l");
        T.sides[side] = n.who;
        const cv = T.ov.querySelector(".adv-tk-face." + side); paintCard(cv, n.who); cv.classList.add("in");
        cv.classList.toggle("flip", flipFor(n.who, side));
        T.gone[side] = true;                             // (in from its side of the screen)
      }
      T.last = side;
      /* the bust's gesture: in again first, if it had gone (then the gesture); a shout or a gasp
         makes the other one flinch */
      const act = n.act || actOf(n), other = side === "l" ? "r" : "l";
      if (T.gone[side]) {
        gesture(T, side, "enter"); T.gone[side] = false;
        if (act && act !== "lean") setTimeout(() => { if (talk === T && T.lines[T.i] === n) gesture(T, side, act); }, 380);
      } else gesture(T, side, act);
      if ((act === "shake" || act === "shock") && T.sides[other] && !T.gone[other]) gesture(T, other, "flinch");
      /* the runner standing in the world turns to whoever is talking to them (a meeting already
         has the two of them face to face, where they stand) */
      if (player && world && !(world.rival && world.rival.lock) && n.who !== (player.c && player.c.id)) T.face = player.face = side === "l" ? -1 : 1;
    }
    seatBusts(T, n.text);
    /* narration: someone on screen making off (the Egg Mobile spinning away, Sonic gone) */
    if (!n.who && G_GONE.test(n.text)) for (const sd of ["l", "r"]) if (T.sides[sd] && !T.gone[sd] && namedIn(n.text, T.sides[sd])) gesture(T, sd, "flee");
    if (!textMs()) T.shown = n.text.length;
    paintTalk();
  }
  function sceneTick(dt) {
    const T = talk; if (!T) return;
    if (T.face && player) player.face = T.face;           // (held there, through the talk)
    const L = T.lines[T.i]; if (!L || T.shown >= L.text.length) return;
    T.t += dt * 1000;
    const n = Math.min(L.text.length, Math.floor(T.t / Math.max(1, textMs())));
    if (n !== T.shown) { T.shown = n; paintTalk(); }
  }
  function paintTalk() {
    const T = talk, L = T.lines[T.i], ov = T.ov;
    const nm = ov.querySelector(".adv-tk-name"), tx = ov.querySelector(".adv-tk-text");
    nm.textContent = L.who ? (L.name || castOf(L.who).name) : ""; nm.hidden = !L.who;
    nm.style.setProperty("--tc", L.who ? "#" + (HIT_C[L.who] || 0xffffff).toString(16).padStart(6, "0") : "");
    tx.textContent = L.text.slice(0, T.shown);
    tx.classList.toggle("narr", !L.who);
    const box = ov.querySelector(".adv-tk-box");
    box.classList.toggle("done", T.shown >= L.text.length);
    box.classList.toggle("tl", !!L.who && T.last === "l"); box.classList.toggle("tr", !!L.who && T.last === "r");
    for (const s of ["l", "r"]) ov.querySelector(".adv-tk-face." + s).classList.toggle("talking", !!L.who && T.last === s && T.sides[s] === L.who);
  }
  function sceneSkip() { const T = talk; if (!T) return; talk = null; T.done(); }

  // ---------------------------------------------------------------- screens
  const fmt = t => { if (t == null) return "--:--.-"; const m = Math.floor(t / 60), s = t - m * 60; return m + ":" + (s < 10 ? "0" : "") + s.toFixed(1); };
  /* open once the stage before it is cleared -- or once this one has been, so a stage added
     ahead of the others never locks what a player has already run */
  /* a stage that took the place of an older one (`was`) counts that one's clear */
  const cleared = i => actCleared(i, nActs(i) - 1);
  const unlocked = i => i === 0 || cleared(i - 1) || cleared(i);

  /* The zones' Acts. A zone (adventure-stages.js) is two: Act 1 ends at the goal signpost, Act 2
     in Eggman's arena. An Act's def is the zone's with that Act's map, par and its own id
     ("seabreeze-1"), which its record is kept under. */
  let actIdx = 0;
  const ACT_DEFS = {};
  function actDef(i, a) {
    const z = stages()[i]; if (!z || !z.acts) return z;
    a = clamp(a | 0, 0, z.acts.length - 1);
    const id = z.id + "-" + (a + 1);
    return ACT_DEFS[id] || (ACT_DEFS[id] = Object.assign({}, z, z.acts[a], { id, zone: z, actN: a + 1, last: a === z.acts.length - 1, acts: null }));
  }
  const nActs = i => (stages()[i] && stages()[i].acts ? stages()[i].acts.length : 1);
  /* a zone's Act 3: its racecourse -- much longer, few badniks, its hazards, roads up high and
     shortcuts -- raced against a rival (Stage Racing, the story's races, Metal Sonic's challenge) */
  function raceDef(i) {
    const z = stages()[i]; if (!z || !z.race) return null;
    const id = z.id + "-3";
    return ACT_DEFS[id] || (ACT_DEFS[id] = Object.assign({}, z, z.race, { id, zone: z, actN: 3, last: false, race: true, acts: null }));
  }
  /* an Act cleared -- or its whole zone, in a record from before the zones had Acts */
  const actCleared = (i, a) => { const z = stages()[i]; return !!((saveData.stages[z.id + "-" + (a + 1)] || {}).clear || (saveData.stages[z.id] || {}).clear || (z.was && (saveData.stages[z.was] || {}).clear)); };
  const actOpen = (i, a) => unlocked(i) && (a === 0 || actCleared(i, a - 1) || actCleared(i, a));
  /* a zone's Red Star Rings got: across its Acts (or in an older record of the whole stage) */
  const zoneShoes = i => { const z = stages()[i], old = ((saveData.stages[z.id] || {}).shoes || []).filter(Boolean).length;
    let n = 0; for (let a = 0; a < nActs(i); a++) n += ((saveData.stages[z.id + "-" + (a + 1)] || {}).shoes || []).filter(Boolean).length;
    return Math.max(old, n); };

  /* the stage up now: a story chapter's own, or the Act picked on the stage select */
  const storyStages = () => (root.AdventureStages && AdventureStages.STORY) || [];
  const curDef = () => (NP.on && NP.def) || (GPR && GPR.def) || (RACE && RACE.def) || (storyRun && storyRun.def) || actDef(stageIdx, actIdx);
  function load3d(i, a) { stageIdx = i; if (a != null) actIdx = a; actIdx = clamp(actIdx, 0, nActs(i) - 1); loadDef(actDef(i, actIdx)); }
  function loadDef(def) {
    disposeWorld();
    world = buildWorld(def);
    player = makePlayer(castOf(runnerId()));
    snapCamera();
    acc = 0; last = 0;
    const box = host.querySelector(".adv-3d");
    if (box && R.domElement.parentNode !== box) box.appendChild(R.domElement);
    R.domElement.__w = 0;
  }

  /* The title screen: behind it, a demo -- one of the cast, at random, playing a zone's first
     Act, at random, to its goal post, then another, round and round -- seen from far off, under a
     haze, so it stays behind; the logo; the login (or Start, once in); and along the bottom a strip of checkered soil
     under grass where up to four of the cast at a time come on, at random, to do something of their own. */
  let glideX = 12, parade = null;
  function title() {
    endBattle(); storyRun = null; talk = null;
    if (mode !== "title" && mode !== "main" && world) { glideX = Math.max(12, world.start.x); camX = glideX + 3; }
    mode = "title"; paused = false; music();
    if (!(demo && world && world.demo)) demoStart();
    const ov = host.querySelector(".adv-ov");
    host.querySelector(".adv-hud").classList.remove("on");
    host.classList.remove("playing");
    ov.innerHTML = `
      <div class="adv-haze"></div>
      <div class="adv-title pop">
        <div class="adv-brand">
          <div class="adv-kicker">SONIC &amp; FRIENDS</div>
          <div class="adv-logo">RED RING CIRCUIT</div>
        </div>
        <div class="adv-tgo"></div>
        ${opts0 && opts0.onExit ? `<button class="btn ghost" id="advTBack" data-back>${ico("back")}Back to the hall</button>` : ""}
      </div>
      <canvas class="adv-parade"></canvas>
      <div class="adv-legal">A fan-made game, not affiliated with SEGA. Sonic and his friends, rivals and Dr. Eggman belong to SEGA.</div>`;
    parade = { cv: ov.querySelector(".adv-parade"), t: 0 };
    /* log in, or a new player (adventure-online.js); without it, just Start */
    const tgo = ov.querySelector(".adv-tgo");
    if (root.AdventureOnline && root.Auth) AdventureOnline.titlePanel(tgo, () => mainMenu());
    else { tgo.innerHTML = `<button class="btn lg" id="advTStart" data-enter>${ico("flag")}Start</button>`; tgo.querySelector("#advTStart").onclick = () => mainMenu(); }
    if (ov.querySelector("#advTBack")) ov.querySelector("#advTBack").onclick = () => exit();
    autoFocus();
  }
  /* The demo: a runner and a zone's Act 1, each at random (not the last ones again), a robot at
     the controls. It holds right, and jumps for a wall, a gap or a badnik ahead, or when it
     stops; in the air, its air action for a wall or a drop (Knuckles climbs what he grabs).
     Nothing hurts it and it is quiet; fallen, it is put back on the road ahead; stuck a while,
     it skips on; at the goal post the post spins, and after a moment, the next. */
  function demoStart() {
    const zones = stages().map((z, i) => i).filter(i => cleanRunners(stages()[i].id + "-1").length);
    const pick = (list, not) => { const l = list.length > 1 ? list.filter(v => v !== not) : list; return l[Math.floor(Math.random() * l.length)]; };
    const i = pick(zones.length ? zones : stages().map((z, k) => k), demo && demo.i);
    const ok = cleanRunners(stages()[i].id + "-1"), id = pick(ok.length ? ok : CAST.map(c => c.id), demo && demo.id);
    disposeWorld();
    world = buildWorld(actDef(i, 0)); world.demo = true; world.played = true;
    player = makePlayer(castOf(id)); player.demo = true;
    snapCamera();
    const box = host.querySelector(".adv-3d");
    if (box && R.domElement.parentNode !== box) box.appendChild(R.domElement);
    demo = Object.assign(newBot(player), { i, id, acc: 0 });
  }
  /* where on the screen the demo's runner goes (-1 the bottom, 1 the top): the middle of the open
     band under the logo and Start, over the heads of the strip's cast -- measured off the page now
     and then, so nothing on the title ever covers it */
  function demoBand(dt) {
    const D = demo;
    if (D.band != null && (D.bandT -= dt) > 0) return D.band;
    D.bandT = 0.5; D.band = -0.35;
    const box = host.querySelector(".adv-3d"), r0 = box && box.getBoundingClientRect();
    const t = host.querySelector(".adv-title"), cv = host.querySelector(".adv-parade");
    if (r0 && r0.height && t && cv) {
      const k = (root.innerHeight || 800) < 600 ? 1.5 : 2;
      const top = t.getBoundingClientRect().bottom + 8, bot = cv.getBoundingClientRect().bottom - 18 * k - 45 * k;
      const mid = bot > top ? (top + bot) / 2 : top + 24;
      D.band = clamp(1 - 2 * (mid - r0.top) / r0.height, -0.75, 0.2);
    }
    return D.band;
  }
  /* back on the road, `dist` metres or more on from x: the nearest standing place to the height it was at */
  /* The robot: the title demo's runner, and every CPU runner in a race or the grand prix. It runs
     as a player who knows the road would: it holds right and looks ahead (further the faster it
     goes) for what's in the way -- walls, hurdles, monitors, thorns, badniks, the end of the road,
     water -- and jumps each in good time for how tall it is, held till it's cleared; rolls through
     cracked rock it can't jump; never rolls or runs into a badnik with its spikes out, a shut shell
     or an armoured face (over those it goes); Spin Dashes off the line and out of a stop; and on a
     clear road uses its own dash (`skill.dash`: how often, in seconds; none without). In the air,
     its air action for a wall or a drop (Knuckles climbs). Played straight: nothing skipped -- it
     breathes as a runner does and is hit as one is. Stuck, it backs off for a run at it or goes up
     by the ledges; a fall, a hit it can't take, or no way past, and the run is "fail" (a CPU in a
     race gets up again from its Star Post, as you do). */
  const newBot = (p, skill) => ({ t: 0, best: p.x, still: 0, hold: 0, jt: 0, zt: 0, back: 0, tries: 0, airUsed: false, done: 0, goal: null, gt: 0, tried: [], dashT: 0,
                                  rev: 0, revTap: 0, skill: skill || {}, inp: newInput(), tr: !!(skill && skill.trace) });   // (tr: noting why it does what it does, for a trace)
  /* a jump's time to rise `hgt` metres over the feet, and to come back down past it again (null:
     out of its reach) */
  function riseFall(c, hgt, mud, gk) {
    const v0 = c.jump * (mud ? 0.82 : 1), G = GRAV * (gk || 1), d = v0 * v0 - 2 * G * hgt;
    return d <= 0 ? null : [(v0 - Math.sqrt(d)) / G, (v0 + Math.sqrt(d)) / G];
  }
  /* the gravity where a point is: a course's low gravity (its lowg zones), or the usual */
  function gravAt(x, y) {
    const w = world; if (!w) return 1;
    const L = w.lowgZ || (w.lowgZ = (w.zones || []).filter(z => z.k === "lowg"));
    let g = 1; for (const z of L) if (x >= z.x0 && x <= z.x1 && y >= z.y0 && y <= z.y1) g = Math.min(g, z.g);
    return g;
  }
  /* badniks it mustn't touch at all, however it's going: spikes out, spinning shut, crackling, spike
     balls going round */
  const SPIKY = { guardshoot: 1, guardfly: 1, guardhover: 1, orbit: 1 };
  const BOT_NEED = { wall: -0.4, monitor: -0.3, hurdle: 0.15, thorns: 0.2, bumper: 0.2 };   // (over a thing's top: how high its feet must get to be past it)
  /* What's ahead of a runner, within R metres of its front: the things in its way, nearest first,
     measured from its front and its feet -- { x0, x1, top, kind, rock (cracked rock it could roll
     through), spiky, hard (it bounces a roll off) } -- and where the road ends, if it does
     (gap: [from, to]; water counts). */
  const botBrk = t => t === "X" || t === "B";
  function botFloorIn(i, fy) {                              // 1 ground (or a step up), 0 water, -1 a drop
    for (let j = fy; j >= Math.max(0, fy - 10); j--) {
      const t = tile(i, j);
      if (t === "~") return 0;
      if (solid(t) || t === "-" || t === "/" || t === "\\") return 1;
    }
    return -1;
  }
  /* (its look ahead is made in buffers it keeps -- B -- so seven of them thinking a hundred and
     twenty times a second make nothing new to throw away) */
  function botAhead(p, w, R, B) {
    B = B || { obs: [], pool: [], fl: [], rp: [], gap: [0, 0] };
    const c = p.c, half = c.w / 2, front = p.x + half, fy = Math.floor(p.y + 0.05), obs = B.obs, fl = B.fl, rp = B.rp;
    obs.length = 0; fl.length = 0; rp.length = 0;
    let np = 0;
    const ob = (x0, x1, top, kind, rock, spiky, hard) => { const o = B.pool[np] || (B.pool[np] = {}); np++; o.x0 = x0; o.x1 = x1; o.top = top; o.kind = kind; o.rock = !!rock; o.spiky = !!spiky; o.hard = !!hard; obs.push(o); return o; };
    let gap = null, wall = null, ramp = null;
    const i0 = Math.floor(front + 0.02);                        // (fl: the ground's height, column by column, over its feet: -99 none, or water; rp: a slope's, or what it leads onto)
    for (let i = i0; i <= Math.floor(front + R + 12); i++) {
      const dx = i - front;
      if (dx > R + 6 && !gap) break;                            // (the ground a little past R too: where a jump comes down)
      const t0 = tile(i, fy), s0 = solid(t0);
      let k = 0; if (s0) while (k < 12 && solid(tile(i, fy + k))) k++;
      let g = -99;
      if (s0) g = fy + k - p.y;
      else for (let j = fy; j >= Math.max(0, fy - 26); j--) { const t = tile(i, j); if (t === "~") break; if (t === "/" || t === "\\") { g = j + 0.5 - p.y; break; } if (solid(t) || t === "-") { g = j + 1 - p.y; break; } }
      /* a column standing up from its feet: a wall, or a step -- not the ground under a slope
         running up, nor what it leads onto, nor a lip the runner just runs up onto */
      const top = fy + k - p.y;
      const up = s0 && (tile(i, fy + k) === "/" || tile(i - 1, fy + k - 1) === "/" || tile(i - 1, fy + k) === "/" || (ramp != null && top <= ramp + 0.05));
      if (!s0) ramp = null; else if (up) ramp = Math.max(top, ramp == null ? top : ramp);
      fl.push(g); rp.push(up || t0 === "/" ? 1 : 0);
      if (!gap && dx <= R) { if (botFloorIn(i, fy) < 1) { gap = B.gap; gap[0] = Math.max(0, dx); gap[1] = dx + 1; } }
      else if (gap && gap[1] === dx) { if (botFloorIn(i, fy) < 1) gap[1] = dx + 1; }
      if (dx > R) continue;
      if (!s0) { wall = null; continue; }
      if (up || top <= 0.55) { wall = null; continue; }
      if (wall && wall.x1 === dx) { wall.x1 = dx + 1; wall.top = Math.max(wall.top, top); wall.rock = wall.rock && botBrk(t0); }
      else wall = ob(dx, dx + 1, top, "wall", botBrk(t0) && k >= 2);
    }
    /* a trench: a sheer drop, and its far side standing up out of it again -- a jump across it, as
       over a gap (down in it, a wall to climb out) */
    if (!gap) for (let k = 0; k < fl.length; k++) {
      const dx = i0 + k - front, prev = k ? fl[k - 1] : 0;
      if (dx > R) break;
      if (fl[k] > -50 && fl[k] < prev - 2.5 && prev > -0.6 && !(k && rp[k - 1]) && !rp[k]) {
        const bed = fl[k];
        let m = k + 1; while (m < fl.length && m - k <= 18 && fl[m] > -50 && fl[m] < bed + 1.5 && fl[m] > bed - 1) m++;
        if (m < fl.length && m - k <= 18 && fl[m] >= bed + 1.5) { gap = B.gap; gap[0] = Math.max(0, dx); gap[1] = i0 + m - front; }
        break;
      }
    }
    for (const b of w.solids) { const x0 = b.x0 - front; if (b.alive && x0 > -1.2 && x0 < R && b.y0 < p.y + 0.6 && b.y1 > p.y + 0.05) ob(x0, b.x1 - front, b.y1 - p.y, "hurdle"); }
    for (const e of w.ents) {
      if (e.gone) continue;
      if (e.t === "monitor") { const x0 = e.x - 0.42 - front; if (x0 > -1.2 && x0 < R && e.y < p.y + 0.6 && e.y > p.y - 0.4) ob(x0, e.x + 0.42 - front, e.y + 0.95 - p.y, "monitor"); }
      else if (e.t === "bumper") { const x0 = e.x - 0.7 - front; if (x0 > -1.2 && x0 < R && e.y - 0.66 < p.y + p.hh && e.y + 0.66 > p.y) ob(x0, e.x + 0.7 - front, e.y + 0.7 - p.y, "bumper"); }
    }
    for (const z of w.hazards) { const x0 = z.x0 - front; if (x0 > -1.2 && x0 < R && z.y0 < p.y + 0.4 && z.y1 > p.y - 0.4) ob(x0, z.x1 - front, z.y1 - p.y, "thorns", false, true); }
    for (const e of w.enemies) {
      if (!e.alive || e.hidden) continue;
      const EB = e.B, ext = EB.act === "orbit" ? 1.0 : 0, rch = e.reach || EB.reach || 0;
      let x0 = e.x - e.w / 2 - ext - front, x1 = e.x + e.w / 2 + ext - front;
      if (rch && e.face < 0) x0 -= rch; else if (rch) x1 += rch;
      if (!(x0 > -1.2 && x0 < R) && !(x0 < 0 && x1 > -0.4)) continue;
      const bot = e.y - ext, top = e.y + e.h + ext - p.y;
      if (bot > p.y + p.hh + 0.2 || top < -0.15) continue;        // (over its head, or down below)
      ob(x0, x1, top, "foe", false, SPIKY[EB.act] || EB.zap || e.guard, EB.armor === "front" || EB.armor === "shell");
    }
    if (obs.length > 1) obs.sort(botByX);
    B.gapOn = gap; B.front = front; B.i0 = i0;
    return B;
  }
  const botByX = (a, b) => a.x0 - b.x0;
  /* whether the ground falls away (more than a step) before x ahead of the runner's front */
  function botDropBefore(A, x) {
    for (let k = 0; k < A.fl.length; k++) { if (A.i0 + k - A.front >= x) break; if (A.fl[k] < -0.6) return true; }
    return false;
  }
  /* how far ahead (from where it is) the next ride's mouth is that it runs into at the height it's
     at -- a cable's handle, a pipe, a cannon -- or 99: one it takes, not one to jump over */
  /* (a ride's mouth, as rideCheck takes a runner in: where it is, how near it catches, and
     whether a runner at x, y is caught by it) */
  const botMouth = R => R.k === "zip" ? [R.x0, 1.0] : R.k === "tube" ? [R.p[0][0], 1.2] : [R.x, 0.75];
  function botCaught(R, x, y, hh) {
    if (R.k === "zip") return Math.abs(x - R.x0) < 1.0 && y + hh > R.y0 - 1.8 && y < R.y0 + 0.2;
    if (R.k === "tube") { const q = R.p[0]; return Math.abs(x - q[0]) < 1.2 && y > q[1] - 0.6 && y < q[1] + 1.4; }
    if (R.k === "cannon") return Math.abs(x - R.x) < 0.75 && y > R.y - 0.3 && y < R.y + 1.2;
    return false;
  }
  function botRideAt(p, w) {
    let best = 99;
    for (const R of w.rides || []) {
      if (R.k !== "zip" && R.k !== "tube" && R.k !== "cannon") continue;
      const [mx, near] = botMouth(R), x = mx - near;
      if (x - p.x > -0.4 && x - p.x < best && botCaught(R, mx, p.y, p.hh)) best = Math.max(0, x - p.x);
    }
    return best;
  }
  /* A fall from where a runner is, as it's going (holding on ahead, no more presses): where it
     comes down -- "ground", "wall" (into one too high to land on), "pit" (nothing under it, or
     water), or "far" (past what it can see: ground there, it's taken as ground) */
  function botLanding(p, A, top) {
    const c = p.c, dt = 1 / 40;
    let x = 0, y = 0, vx = Math.max(0, p.vx), vy = p.vy;
    const col = xx => { const k = Math.floor(A.front + xx) - A.i0; return k < 0 ? 0 : k < A.fl.length ? A.fl[k] : undefined; };
    const rides = (world.rides || []).filter(R => (R.k === "zip" || R.k === "tube" || R.k === "cannon") && botMouth(R)[0] > p.x - 1 && botMouth(R)[0] < p.x + 40);
    for (let t = 0; t < 3; t += dt) {
      if (vx < top) vx = Math.min(top, vx + c.airAccel * dt); else if (vx > top && !p.ballistic) vx = Math.max(top, vx - 9 * dt);
      const xp = x, yp = y;
      vy = Math.max(vy - GRAV * gravAt(A.front + x, p.y + y) * dt, -22); x += (vx + windAt(A.front + x, p.y + y) * 0.7) * dt; y += vy * dt;
      for (const R of rides) if (!(R === p.rideLast && t < p.rideCd) && botCaught(R, p.x + x, p.y + y, p.hh)) return "ground";   // (down into a cable's handle, a pipe, a cannon: taken on -- not the one just left, for a moment)
      const g = col(x);
      if (g === undefined) { const last = A.fl[A.fl.length - 1]; return last > -50 && last > y - 26 ? "far" : "pit"; }
      if (g > -50 && y < g - 0.45 && vy > -14) { const k = Math.floor(A.front + x) - A.i0; if (!(A.rp[k])) return "wall"; }
      if (vy < 0) for (const xx of [x - 0.02, x - c.w + 0.06]) {
        const lv = col(xx);
        if (lv === undefined || lv <= -50 || y > lv) continue;
        if (yp <= lv) return "ground";                                  // (in at the side, within its lip: up onto it)
        /* down through that height this step: just where -- a foot over the ground then (as the
           game lands it: any of its feet), or past the edge already */
        const f = (yp - lv) / (yp - y), xc = xp + (x - xp) * f, a = col(xc - 0.02), b = col(xc - c.w + 0.06);
        if ((a !== undefined && a > -50 && a >= lv - 0.01) || (b !== undefined && b > -50 && b >= lv - 0.01)) return "ground";
      }
      if (y < -26) return "pit";
    }
    return "far";
  }
  /* A jump planned before it's made: how long to hold Jump. Flown out step by step, the shortest
     hold that takes it over everything in its way -- walls by their top lip, the rest clear -- and
     down again on ground, far enough short of the next thing to run and jump again (or past it
     too); none will, and the full jump. Returns seconds (9: all the way up). */
  /* the wind where a point is (the course's gales): a jump goes on further in a tailwind */
  function windAt(x, y) { let v = 0; for (const z of world.zones || []) if (z.k === "wind" && x >= z.x0 && x <= z.x1 && y >= z.y0 && y <= z.y1) v += z.vx; return v; }
  function botPlan(p, A, v, mud, roofH, top) {
    const c = p.c, half = c.w / 2, v0 = c.jump * (mud ? 0.82 : 1), dt = 1 / 60;
    const ground = x => { const k = Math.floor(A.front + x) - A.i0; return k < 0 ? 0 : k < A.fl.length ? A.fl[k] : -99; };
    const rampAt = x => { const k = Math.floor(A.front + x) - A.i0; return k >= 0 && k < A.rp.length && A.rp[k]; };
    const needOf = o => Math.max(0.3, o.top + (BOT_NEED[o.kind] != null ? BOT_NEED[o.kind] : o.spiky ? 0.5 : 0.3));
    let fallback = 9, far = -1, farHold = null;
    for (const hold of [0.05, 0.09, 0.13, 0.18, 0.24, 0.31, 0.4, 9]) {
      let t = 0, y = 0, vy = v0, cut = false, ok = true, land = null, xw = 0, vh = v;
      while (t < 1.8 && ok) {
        if (!cut && t >= hold - 1e-6) { cut = true; if (vy > 5) vy = 5; }   // (let go after `hold` seconds held, as the game steps it)
        t += dt;
        vy -= GRAV * gravAt(A.front + xw, p.y + y) * dt; y += vy * dt;
        if (y + p.hh > roofH && vy > 0) vy = 0;                    // (a roof: it bumps its head)
        if (top && vh > top) vh = Math.max(top, vh - 9 * dt);      // (faster than it runs -- off a dash strip -- it slows in the air)
        xw += (vh + windAt(A.front + xw, p.y + y) * 0.7) * dt;
        const x = xw, g = ground(x + 0.02);                         // (its front, over the ground there; a gale carrying it on)
        if (g > -50 && y < g - 0.15 && !rampAt(x + 0.02)) { ok = false; break; }   // into a wall too high to run up onto (a plan keeps the lip it could catch in hand)
        for (const o of A.obs) if (o.kind !== "wall" && x > o.x0 - 0.05 && x - c.w < o.x1 + 0.05 && y < needOf(o)) { ok = false; break; }
        const gb = Math.max(ground(x - 0.35), ground(x - c.w + 0.35));      // (a foot well on it, not just a toe on its edge)
        if (vy < 0 && gb > -50 && y <= gb) { land = x; break; }
      }
      if (!ok || land == null) { if (ok && fallback === 9) fallback = hold; continue; }
      if (land > far) { far = land; farHold = hold; }
      /* down: room before the next thing (or nothing more within reach) */
      const next = A.obs.find(o => o.x0 > land - c.w - 0.1);
      const gapNext = A.gapOn && A.gapOn[1] > land ? A.gapOn[0] - land : 99;
      if (gapNext < 0) continue;                                    // (down into the gap)
      if (!next) { A.why = "clear@" + land.toFixed(1); return hold; }
      const rf = riseFall(c, needOf(next), mud), room = next.x0 - land;
      if (room >= v * (rf ? rf[0] : 0.2) + 0.5) { A.why = "room@" + land.toFixed(1) + "/" + next.kind + next.x0.toFixed(1); return hold; }
    }
    A.why = farHold != null ? "far@" + far.toFixed(1) : "fallback";
    return farHold != null ? farHold : fallback;
  }
  /* stuck: a way up -- a ledge or a plank higher than it is, within a jump (its own, and its air
     action's), back the way it came or just ahead, with room over it to jump (not up into a roof) */
  /* how many rows up a runner really gets: its jump (about three), and what its air action adds
     (flight a good deal, a double jump some, a hover or a glide hardly any) */
  const AIR_UP = { fly: 2.6, ballet: 1.2, double: 1.2, hop: 1 };
  const jumpRows = c => (c.jump * c.jump) / (2 * GRAV * 0.7) + (AIR_UP[c.air] || 0.3);
  /* (and how high its air action really takes it over a wall's lip: a jump's top, and what flight,
     a double jump or a hop adds -- a hover or a glide holds it up, never higher) */
  const airRows = c => (c.jump * c.jump) / (2 * GRAV) + (AIR_UP[c.air] || 0);
  function stepUp(p, tried) {
    const c = p.c, reach = Math.min(jumpRows(c), airRows(c) + 0.4), x0 = Math.floor(p.x), y0 = Math.floor(p.y + 0.01);   // (as high as it truly gets)
    const open = (i, j) => { const t = tile(i, j); return !solid(t) || t === "-"; };
    let best = null, bs = 1e9;
    for (let i = x0 - 24; i <= x0 + 4; i++) for (let j = y0 + 1; j <= y0 + reach; j++) {        // (as high as it really gets: one step at a time)
      const under = tile(i, j - 1);
      if (!(solid(under) || under === "-") || !open(i, j) || !open(i, j + 1) || tile(i, j) === "~") continue;
      if (tried.some(a => Math.abs(a.x - (i + 0.5)) < 1.5 && a.y === j)) continue;
      const side = i + 0.5 < p.x ? 1 : -1;                                  // (the side it jumps from)
      let room = true;
      for (let k = y0 + 1; k <= j + 1 && room; k++) for (const dx of [0, side, 2 * side]) if (!open(i + dx, k)) { room = false; break; }
      if (!room) continue;
      const score = Math.abs(i + 0.5 - p.x) - (j - y0) * 0.6;
      if (score < bs) { bs = score; best = { x: i + 0.5, y: j }; }
    }
    return best;
  }
  function demoBot(D, p, w, h) {
    const I = D.inp, c = p.c;
    I.R = 1; I.L = 0; I.U = 0; I.D = 0; I.Z = I.X = I.C = 0;
    D.t += h; D.jt -= h; D.hold -= h; D.back -= h; D.zt -= h; D.dashT -= h;
    if (p.demoFell || p.dead || p.y < 0.3) return "fail";
    if (p.state === "ride" || (p.ballistic && !p.ground)) { I.R = 1; I.J = 0; D.hold = 0; D.still = 0; D.best = Math.max(D.best, p.x); return; }   // (carried, or flying true: nothing to do but hold on)
    if (p.x > D.best + 0.4) { D.best = p.x; D.still = 0; } else D.still += h;
    if (p.ground) D.airUsed = false;
    if (D.t > 220) return "fail";
    if (D.rev > 0) {                                                   // a Spin Dash: Down, Jump tapped to rev it, then let go
      D.rev -= h; D.revTap -= h; I.R = 0; I.D = 1;
      if (D.rev < 0.3 && D.revTap <= 0) { I.jp = 1; D.revTap = 0.06; }
      if (D.rev <= 0 || (p.state !== "charge" && p.state !== "crouch" && D.rev < 0.26)) { D.rev = 0; I.D = 0; I.R = 1; }
      I.J = I.jp ? 1 : 0;
      return;
    }
    if (D.back > 0) { I.R = 0; I.L = 1; I.J = 0; return; }            // backing off, for a run at it
    if (D.goal) {                                                      // on the way up to a ledge
      const g = D.goal, dx = g.x - p.x;
      D.gt += h;
      if (p.ground && p.y >= g.y - 0.3 && (Math.abs(dx) < 1.6 || dx < 0)) { D.goal = null; D.best = p.x; D.still = 0; D.tries = 0; }
      else if (dx < -3 && p.y >= g.y - 0.3 && p.ground) { D.goal = null; D.still = 0; }           // (up there already, past it, another way)
      else if (D.gt > 4.5) { D.tried.push(g); D.goal = null; D.still = 0; }                      // (it gave that one a fair go)
      else if (p.state === "dash" && c.steer) { I.R = I.L = 0; I.J = 0; return; }                // (Gamma's Drive Mode: let go of it first, and it stops)
      else {
        I.R = dx > 0.35 ? 1 : 0; I.L = dx < -0.35 ? 1 : 0;
        /* coming in fast for a ledge: braking, so as not to fly past it (a plank is only a few
           tiles wide) -- hardest for one a plain jump reaches, a little less for one it needs its
           air action for */
        const lowLedge = g.y - p.y <= (c.jump * c.jump) / (2 * GRAV);
        const fast = Math.abs(p.vx) > (lowLedge ? 7 : 9) && Math.abs(dx) < 3 + Math.abs(p.vx) * 0.3 && sgn(p.vx) === sgn(dx);
        if (fast) { I.R = p.vx < 0 ? 1 : 0; I.L = p.vx > 0 ? 1 : 0; }
        if (p.ground && Math.abs(dx) < 2.4 && D.jt <= 0 && !fast) { I.jp = 1; D.hold = 0.5; D.jt = 0.4; }
        else if (!p.ground && !D.airUsed && p.vy < 1 && p.y < g.y + 0.2 && D.jt <= 0 && c.air !== "hover" && c.air !== "glide") { I.jp = 1; D.airUsed = true; D.hold = 0.7; D.jt = 0.25; }   // (an air action that takes it higher: not a hover, nor a glide)
        else if (p.state === "fly" && p.y < g.y + 0.5 && D.jt <= 0) { I.jp = 1; D.jt = 0.22; }
        I.J = D.hold > 0 || I.jp ? 1 : 0;
        return;
      }
    }
    if (D.still > 1.6) {
      if (++D.tries > 5) return "fail";
      D.still = 0; D.jt = 0;
      const g = stepUp(p, D.tried);
      if (g) { D.goal = g; D.gt = 0; } else D.back = 0.45 * Math.min(3, D.tries);             // a way up; else a run at it, further back each time
      return;
    }
    /* keeping its speed: it looks further ahead the faster it goes and deals with what's coming
       in good time -- never with a move that stops it -- from the nearest thing on */
    if (p.state === "climb") { I.U = 1; return; }          // Knuckles, on a wall: up and over
    const v = Math.max(0, p.vx), half = c.w / 2, S = D.skill;
    const A = botAhead(p, w, Math.max(6.5, half + 1.4 + v * 0.5), D.buf || (D.buf = { obs: [], pool: [], fl: [], rp: [], gap: [0, 0] })), obs = A.obs, gap = A.gapOn;
    const mud = p.ground && surfaceAt(p.x, p.y) === "m";
    const topNow = c.run * (p.star > 0 ? 1.22 : 1) * (p.speedT > 0 ? 1.35 : 1) * (p.paceK || 1);
    let roofH = 99;                                                    // (a low roof over it: as high as a jump goes there)
    for (let k = 1; k <= 4; k++) if (solid(tile(Math.floor(p.x), Math.floor(p.y + 0.05) + k)) || solid(tile(Math.floor(p.x + half + 0.4), Math.floor(p.y + 0.05) + k))) { roofH = Math.floor(p.y + 0.05) + k - p.y; break; }
    const clearTo = d => !obs.some(o => o.x0 < d && o.x1 > -0.3) && !(gap && gap[0] < d);   // (nothing in the way for d metres)
    if (!p.ground && D.hold > 1 && p.vy <= 0) D.hold = 0;            // (a full jump: held to the top)
    if (p.ground) {
      const rolling = p.state === "roll", rolls = c.spinDash && v > 4;
      if (p.state === "dash" && c.steer && !clearTo(v * 0.8 + 3)) I.R = 0;                      // (Gamma's Drive Mode goes on while it's held: let go of it before what's coming)
      /* the first thing in the way: through it, over it, or up by the ledges */
      let jumpFor = null;
      for (const o of obs) {
        if (o.rock && (rolls || rolling) && !(gap && gap[0] < o.x0)) { if (o.x0 < 1.4 + v * 0.06) { if (!rolling) { I.D = 1; I.J = 0; return; } } break; }   // cracked rock: roll through it
        /* how high its feet must get: onto a wall (its top lip it runs up onto), a monitor; over
           a hurdle, thorns, a badnik (one with spikes out, well over) */
        const need = Math.max(0.3, o.top + (BOT_NEED[o.kind] != null ? BOT_NEED[o.kind] : o.spiky ? 0.5 : 0.3));
        const rf = riseFall(c, need, mud, gravAt(p.x, p.y));
        /* a tall wall past a drop (the plank it's on ends short of it): up the next step from
           here, not down off the end and back to the foot of it */
        if (o.kind === "wall" && o.top > 1.2 && !D.goal && botDropBefore(A, o.x0)) {
          const g = stepUp(p, D.tried);
          if (g && g.y > Math.floor(p.y + 0.01)) { D.goal = g; D.gt = 0; if (D.tr) D.why = "up-drop"; return; }
        }
        if (!rf || need > roofH - 0.2) {
          if (o.kind === "wall" && o.top - 0.4 <= airRows(c) && AIR_UP[c.air] && roofH > o.top + 1) { if (o.x0 <= v * 0.3 + 0.6) jumpFor = o; break; }   // (its air action takes it the rest of the way)
          if (o.top > 1.2 && !D.goal) { const g = stepUp(p, D.tried); D.why = "up:" + o.kind + o.top.toFixed(1) + (g ? "" : "-none"); if (g) { D.goal = g; D.gt = 0; return; } }   // too tall: up it by its steps, starting now
          if (o.top <= 1.2 && o.x0 <= v * 0.12 + 0.5) jumpFor = o;      // (a low thing under a roof: hop it anyway)
          break;
        }
        if (o.x0 <= v * rf[0] + 0.35 + (o.kind === "foe" ? 0.6 : 0)) jumpFor = o;
        break;
      }
      /* the end of the road: off the very edge, held all the way -- unless a ride takes it on
         first (a cable's handle at the edge, a cannon at a wall's foot): into that */
      const rideD = botRideAt(p, w);
      if (jumpFor && rideD < jumpFor.x0 + half) jumpFor = null;
      const atEdge = gap && gap[0] <= Math.max(0.3, v * 0.05) && !(rideD <= gap[0] + half + 0.3);
      if (rolling && !jumpFor && !atEdge && D.jt <= 0) {                 // out of a roll once it's as slow as running: up, and running again
        const rock = obs.find(o => o.rock && o.x0 < 2.5);
        if (!rock && v <= topNow + 0.4 && roofH > 2.4) { I.jp = 1; D.jt = 0.25; D.hold = 0.1; }
      }
      if (D.jt <= 0 && (atEdge || jumpFor)) {                        // a jump: held as long as its plan says
        I.jp = 1; D.jt = 0.22;
        D.hold = botPlan(p, A, v, mud, roofH, topNow);                 // (a gap too: no further than the next stone)
        if (D.tr) D.why = (atEdge ? "edge" + gap[0].toFixed(1) + "-" + gap[1].toFixed(1) : "for:" + jumpFor.kind + jumpFor.x0.toFixed(1)) + " " + A.why;
      } else if (!I.jp && !rolling && p.state === "run" && D.jt <= 0) {
        /* stopped (by a hit, a wall, the start): a Spin Dash, if the road's clear for it */
        if (c.spinDash && v < 3.5 && !p.inWater && clearTo(7) && roofH > 1.2 && D.t > 0.02) { D.rev = 0.34; D.revTap = 0; I.R = 0; I.D = 1; return; }
        if (v < 1.5 && D.t > 0.6 && D.still > 0.35) { I.jp = 1; D.hold = 0.42; D.jt = 0.3; D.why = "low"; }          // (stuck at something low)
        /* a clear road: its own dash, now and then */
        else if (S.dash && D.dashT <= 0 && v >= topNow * 0.9 && !p.inWater && !mud && clearTo(v * 0.9 + 2.5) && roofH > 2) { I.dash = 1; D.dashT = S.dash; }
        /* Chaos: a Chaos Dive under badniks and across thorns -- nothing touches him */
        else if (c.dashInv && D.dashT <= 0 && obs.some(o => (o.kind === "foe" || o.kind === "thorns") && o.x0 < 3.5) && !(gap && gap[0] < 4)) { I.dash = 1; D.dashT = 1.1; }
      }
    } else {
      /* in the air: where this jump comes down, as it's going. On ground, nothing to do -- it
         never flies or glides when a plain jump will do (flight is slower than running). Into
         water, a pit or a wall: its air action, as late as it can; flying, a beat at a time to
         hold its height, and the moment a drop from there would land, it lets go (Down) and runs
         on; gliding, it keeps on over the trouble and lets go once it's past */
      const land = botLanding(p, A, topNow), safe = land === "ground";
      if (D.tr) D.why = "air:" + land;
      if (p.state === "fly") {
        if (safe) I.D = 1;
        else if (D.jt <= 0 && (p.vy < 0.2 || land === "wall")) { I.jp = 1; D.jt = 0.2; }
      } else if (p.state === "glide") { if (!safe) D.hold = Math.max(D.hold, 0.1); }
      else if (!safe && !D.airUsed && D.jt <= 0 && (p.vy < 1.5 || land === "wall") && !obs.some(o => o.spiky && o.x0 < 3)) { I.jp = 1; D.airUsed = true; D.hold = 0.6; D.jt = 0.25; }
    }
    I.J = D.hold > 0 || I.jp ? 1 : 0;
  }
  function demoTick(dt) {
    const D = demo, p = player, w = world, h = 1 / 120;
    D.acc += Math.min(dt, 0.1);
    const keep = input; input = D.inp; demoQuiet = true;
    let n = 0;
    while (D.acc >= h && n < 14) {
      D.acc -= h; n++;
      if (D.done) {                                         // at the post: braking, the post spinning, then the next
        D.done += h; D.inp.R = 0; D.inp.J = 0;
        if (D.done > 3.4) { input = keep; demoQuiet = false; demoStart(); return; }
      } else if (demoBot(D, p, w, h) === "fail") { input = keep; demoQuiet = false; demoStart(); return; }   // (it didn't make it: on to another)
      step(h); worldStep(h);
      input.jp = input.zp = input.xp = input.cp = 0; input.dash = 0;
      if (!D.done && w.goal && p.x >= w.goal.x) { D.done = h; w.goal.spin = 2.6; w.goal.fire = 2.5; w.goal.fireT = 0; }
    }
    input = keep; demoQuiet = false;
  }
  /* A run played out of sight, at the robot's hands: through `def` as `who`, a fixed step at a time,
     with no sound, no music and nothing counted -- how the robot is measured (who gets round where:
     CLEAN, GP_CLEAN; _debug.botStats), its sprite's place and frame kept thirty times a second, and
     (st) its hits, bumps and time in water. The world there was goes (build the next).
     { ok, time, track: [[t, x, y, frame, i, face]], st } */
  function simRun(def, who, seed, skill) {
    const keep = { input, mode, demo, rnd: Math.random }, h = 1 / 120, res = { ok: false, time: 0, track: [] };
    if (seed != null) Math.random = mulberry32(seed);      // (a seeded run: the same on every machine)
    disposeWorld();
    SIM = true; demo = null;
    try {
      world = buildWorld(def); world.sim = true;
      const p = player = makePlayer(castOf(who)); p.demo = true;
      const D = newBot(p, skill);
      input = D.inp; mode = "sim";
      let rec = 0;
      const st = res.st = { hurt: 0, bump: 0, stumble: 0, water: 0, ev: [] };
      while (world.t < 230) {
        if (demoBot(D, p, world, h) === "fail") break;
        const ps = p.state, pvx = p.vx;
        step(h); worldStep(h);
        if (p.state === "hurt" && ps !== "hurt") { st.hurt++; st.ev.push(["hurt", +p.x.toFixed(1), +p.y.toFixed(1)]); }
        if (p.state === "ride" && ps !== "ride") { st.rides = (st.rides || 0) + 1; st.ev.push(["ride", p.ride.R.k, +p.x.toFixed(1)]); }
        if (p.state === "fly" && ps !== "fly") st.ev.push(["fly", +p.x.toFixed(1), +p.y.toFixed(1)]);
        if (p.state === "stumble" && ps !== "stumble") { st.stumble++; st.ev.push(["stumble", +p.x.toFixed(1), +p.y.toFixed(1)]); }
        if (Math.abs(pvx) > 5 && Math.abs(p.vx) < 1 && p.state !== "hurt" && p.state !== "stumble") { st.bump++; st.ev.push(["bump", +p.x.toFixed(1), +p.y.toFixed(1), +pvx.toFixed(1)]); }
        if (p.inWater) { if (!st.wet) st.ev.push(["water", +p.x.toFixed(1), +p.y.toFixed(1)]); st.water += h; st.wet = 1; } else st.wet = 0;
        if (skill && skill.trace && p.x >= skill.trace[0] && p.x <= skill.trace[1]) (res.trace = res.trace || []).push([+world.t.toFixed(3), +p.x.toFixed(2), +p.y.toFixed(2), +p.vx.toFixed(1), +p.vy.toFixed(1), p.state, p.ground ? 1 : 0, D.inp.J, D.inp.jp, D.inp.D, +D.hold.toFixed(2), D.goal ? "goal" + D.goal.x.toFixed(1) + "," + D.goal.y + " gt" + D.gt.toFixed(1) : "", "st" + D.still.toFixed(1), "tr" + D.tries, D.inp.R, D.inp.L, D.why || ""].join(" ")); D.why = "";
        input.jp = input.zp = input.xp = input.cp = 0; input.dash = 0;
        if (world.t >= rec) { rec += 1 / 30; drawRunner(p, 1 / 30); const f = p._rf || ["idle", 0, 1]; res.track.push([+world.t.toFixed(3), +p.spr.position.x.toFixed(3), +p.spr.position.y.toFixed(3), f[0], f[1], f[2]]); }
        if ((world.goal && p.x >= world.goal.x) || (!world.goal && world.arena && p.x >= world.arena.x0)) { res.ok = true; break; }   // (to the post; an Act 2, to the boss's arena)
      }
      res.time = world.t; res.st.dist = (world.goal ? world.goal.x : world.W) - world.start.x; res.st.ideal = res.st.dist / p.c.run; res.st.endX = p.x;
    } catch (e) { console.error(e); }
    finally { disposeWorld(); world = null; player = null; input = keep.input; mode = keep.mode; demo = keep.demo; SIM = false; Math.random = keep.rnd; }
    return res;
  }
  /* Who the robot gets through each Act 1 and Act 3 fairly: measured with simRun, every runner on
     every one (_debug.botStats; Act 3 with its dash, as a race's CPU runs it), 2026-11-18. */
  const CLEAN = {
    "seabreeze-1": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "seabreeze-3": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "airstrip-1": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "airstrip-3": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "parlour-1": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman mighty emerl", "parlour-3": "sonic tails knuckles amy rouge shadow cream chaos eggman mighty emerl",
    "peak-1": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "peak-3": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl",
    "club-1": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "club-3": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "expressway-1": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "expressway-3": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "museum-1": "sonic tails knuckles amy rouge shadow cream chaos eggman metal mighty emerl silver", "museum-3": "tails knuckles amy rouge shadow cream chaos gamma eggman metal silver",
    "springs-1": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "springs-3": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "canyon-1": "sonic tails knuckles amy rouge shadow cream chaos eggman metal mighty emerl silver", "canyon-3": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "ruins-1": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "ruins-3": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "depot-1": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "depot-3": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "stars-1": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "stars-3": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty silver",
    "station-1": "sonic tails knuckles amy rouge shadow cream chaos gamma metal mighty emerl silver", "station-3": "sonic tails knuckles amy rouge shadow cream chaos eggman metal mighty emerl silver",
  };
  const cleanRunners = id => (CLEAN[id] || "").split(" ").filter(Boolean);
  /* the same for the grand prix's courses: who gets round each fairly (a cup's rivals are drawn
     from those who get round all four) */
  const GP_CLEAN = {                                 // (measured 2026-11-18 with _debug.botStats, the CPUs' dash and all, on the redrawn courses)
    "gp-checker": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "gp-coral": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "gp-grove": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "gp-lagoon": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "gp-pinball": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "gp-funfair": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "gp-sweets": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "gp-pier": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "gp-slopes": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "gp-crystal": "sonic tails amy rouge shadow cream chaos metal mighty emerl silver",
    "gp-floes": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "gp-tundra": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "gp-dunes": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "gp-town": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "gp-foundry": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "gp-volcano": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "gp-temple": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "gp-windmills": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "gp-fleet": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "gp-spires": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "gp-refinery": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "gp-metro": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
    "gp-fortress": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver", "gp-orbit": "sonic tails knuckles amy rouge shadow cream chaos gamma eggman metal mighty emerl silver",
  };

  /* CPU RUNNERS. A race's rival and the grand prix's CPUs are runners in the world as you are: the
     same bodies, moves and speeds, the same rings, monitors, springs, Star Posts and badniks, with
     the robot (demoBot) at each one's controls. They're stepped with you, a tick at a time, after
     you: they take the rings they run through and light the posts they pass, are hit and lose their
     rings, fall and start again from their last post, as you do. Only what's near you is heard, and
     nothing of theirs comes up on your HUD, moves your camera or counts toward your records.
     `paceK` (their top speed, against yours) is how a class or a difficulty holds them back. */
  function cpuAdd(who, o) {
    const p = makePlayer(castOf(who)); p.cpu = true; p.paceK = o.paceK || 1;
    const q = { id: o.id, who, p, D: newBot(p, o.skill), skill: o.skill || {}, home: null, down: false };
    p.cpuQ = q; CPUS.push(q);
    return q;
  }
  function cpuClear() {
    if (world) for (const q of CPUS) { const p = q.p; for (const m of [p.spr, p.dust, p.aura, p.shCard, p.gCard].concat(p.spCards || [])) if (m) world.group.remove(m); }
    CPUS = []; cpuNow = null;
  }
  /* how loud a CPU is: as loud as it is near where the camera looks, and never as loud as you */
  function cpuHear(p) { const d = Math.abs(p.x - camX) + Math.max(0, Math.abs(p.y - camY) - 4); return d < 6 ? 0.55 : d < 16 ? 0.55 * (16 - d) / 10 : 0; }
  /* a tick for each: the robot's hands, then the same step as yours (held still on the grid; stopped
     by someone's Chaos Control; home, braking) */
  function cpuStep(h, hold) {
    if (!CPUS.length || !world) return;
    const keepP = player, keepI = input, keepM = mode;
    for (const q of CPUS) {
      const p = q.p;
      if (GPR && gpFrozen() && GPR.freezeBy !== q.id) continue;
      cpuNow = q; player = p; input = q.D.inp;
      const I = input;
      if (hold || q.home != null) { I.L = I.R = I.U = I.D = I.J = I.Z = I.X = I.C = 0; I.jp = I.zp = I.xp = I.cp = 0; I.dash = 0; }
      else {
        if (p.dead) q.down = true;
        else if (q.down) { q.down = false; q.D = Object.assign(newBot(p, q.skill), { inp: I }); }     // (up again at its post: it thinks again)
        if (!p.dead && demoBot(q.D, p, world, h) === "fail") q.D = Object.assign(newBot(p, q.skill), { inp: I });
      }
      mode = q.home != null ? "goal" : "play";
      step(h);
      I.jp = I.zp = I.xp = I.cp = 0; I.dash = 0;
    }
    cpuNow = null; player = keepP; input = keepI; mode = cpuMode || keepM; cpuMode = null;   // (a race just lost to one of them: over for you too)
  }
  /* home: its time, for the race or the grand prix */
  function cpuHome(q) {
    if (!q || q.home != null || !world) return;
    q.home = world.t;
    if (RACE) raceCpuHome(q);
    if (GPR) gpCpuHome(q);
  }
  /* those in the world, running: you (not a spectator's camera) and the CPUs */
  const racers = () => (NP.on && NP.watch && !battle ? [] : player ? [player] : []).concat(CPUS.map(q => q.p));

  /* A RACE: you against a rival through an Act 3 (or a story stage) to the goal post -- the rival a
     CPU runner beside you (cpuAdd), as quick as the pace asked for lets it be (1 flat out; more,
     slower). First to the post wins. Free Exhibition's Stage Racing, the story's race chapters and
     Metal Sonic's challenge are all one of these. */
  let RACE = null;
  const PACE = { easy: 1.3, normal: 1.12, hard: 1.0 };
  const paceK = pace => 1 / (1 + Math.max(0, (pace || 1) - 1) * 0.55);       // (a pace, as the rival's top speed against yours)
  const paceDash = pace => (pace || 1) <= 1.05 ? 0.9 : (pace || 1) <= 1.15 ? 1.8 : 0;   // (and how often it uses its dash)
  function raceStart(o) {
    RACE = null;
    const k = o.pace || 1;
    RACE = Object.assign({}, o, { T: null, over: false, won: false, time: null, q: null });
    loadDef(o.def);
    play();
    RACE.q = cpuAdd(o.who, { id: "rival", paceK: paceK(k), skill: { dash: paceDash(k) } });
    const hudEl = host.querySelector(".adv-hud");
    const tag = document.createElement("div"); tag.className = "adv-race"; tag.innerHTML = `<canvas width="88" height="72"></canvas><div><b>${esc(castOf(o.who).name)}</b><span></span></div>`;
    hudEl.append(tag); paintCard(tag.querySelector("canvas"), o.who);
    caption("Race " + castOf(o.who).name + " to the goal post!");
    return true;
  }
  /* the rival's lead, on the HUD */
  function stepRace(dt) {
    const R = RACE; if (!R || !world || mode !== "play" || !R.q) return;
    const el = host.querySelector(".adv-race span");
    if (el) { const d = Math.round(R.q.p.x - player.x); el.textContent = Math.abs(d) < 2 ? "neck and neck" : d > 0 ? d + " m ahead" : -d + " m behind"; }
  }
  /* the rival home first: the race is lost */
  function raceCpuHome(q) {
    const R = RACE; if (!R || R.over || q !== R.q) return;
    R.over = true; R.won = false; R.T = q.home; mode = cpuMode = "goal";
    const keep = cpuNow; cpuNow = null; SFX.goal(); cpuNow = keep;           // (the race's end: heard, wherever the rival is)
    setTimeout(() => raceEnd(), 1400);
  }
  /* home first (finish() comes here): the race is won */
  function raceHome(time) { const R = RACE; if (!R || R.over) return; R.over = true; R.won = true; R.time = time; setTimeout(() => raceEnd(), 1700); }
  /* a CPU still running when the race is decided: when it would be home, at the pace it's going */
  const cpuETA = q => q.home != null ? q.home : world.t + Math.max(0, (world.goal ? world.goal.x : world.W) - q.p.x) / Math.max(4, q.p.c.run * (q.p.paceK || 1) * 0.92);
  function raceEnd() {
    const R = RACE; if (!R || !host) return;
    if (R.T == null && R.q && world) R.T = cpuETA(R.q);
    mode = "results";
    host.querySelector(".adv-hud").classList.remove("on");
    const ov = host.querySelector(".adv-ov"), rn = castOf(R.who).name;
    ov.innerHTML = `
      <div class="panel adv-small adv-res pop">
        <div class="panel-hd gold">${ico("flag")}${R.won ? "You win the race!" : esc(rn) + " wins the race"}</div>
        <div class="adv-board">
          <div class="adv-row"><span>You</span><b class="num">${R.won ? fmt(R.time) : "--:--.-"}</b></div>
          <div class="adv-row"><span>${esc(rn)}</span><b class="num">${fmt(R.T)}</b></div>
        </div>
        <div class="adv-btns">
          ${R.won && R.onWin ? `<button class="btn" id="advRW" data-focus>${ico("next")}${esc(R.winLabel || "Go on")}</button>` : ""}
          <button class="btn ${R.won && R.onWin ? "ghost" : ""}" id="advRA" ${R.won && R.onWin ? "" : "data-focus"}>${ico("flag")}${R.won ? "Race again" : "Try again"}</button>
          <button class="btn ghost" id="advRB" data-back>${ico("back")}${esc(R.backLabel || "Back")}</button>
        </div>
      </div>`;
    const again = Object.assign({}, R);
    if (ov.querySelector("#advRW")) ov.querySelector("#advRW").onclick = () => { RACE = null; R.onWin(); };
    ov.querySelector("#advRA").onclick = () => raceStart(again);
    ov.querySelector("#advRB").onclick = () => { RACE = null; (R.onBack || mainMenu)(); };
    setTimeout(autoFocus, 0);
  }

  // ---------------------------------------------------------------- the grand prix: Red Ring Circuit
  /* RED RING CIRCUIT, the grand prix: a cup is four courses (adventure-gp.js), raced eight at a time
     -- you and seven of the cast -- and points for each: 9, 6, 3 and 1 for the first four, nothing
     after. Finish fifth or worse and the race has to be run again. After the fourth, the three with
     the most points stand on the podium, and a trophy is yours if you're one of them.
     The seven rivals are CPU runners on the course with you (cpuAdd): the robot at their hands,
     as quick as the class lets them be (their top speed against yours, and how often they dash),
     each a little quicker or slower than the next; held back or let on a bit offline by how far
     from you they are; knocked down by what hits them, sped on by what they pick up. They take
     the rings and Red Rings they run through and light the Star Posts, as you do.
     Red Rings stand across every road at the power points: run into one and the box spins up a
     power, used with its own button (V or Shift; a pad's left shoulder; Power on a touch screen).
       Speed Shoes; a Bubble Shield (one hit, for 4.5 s); Invincibility (and anyone touched goes
       down); a Buzz Bomber (after the runner ahead; with nobody ahead, it hovers where you left
       it, a trap); an Eggman Monitor (a fake, left behind); Grey Quake (the ground shakes: anyone
       standing on it near you goes down); Chaos Control (3.5 s of stopped time for everyone else);
       and from the Wisps, a Cyan Laser (a beam straight ahead), an Orange Rocket (along the road
       ahead), a Yellow Drill (2.5 s of drilling on, fast and untouchable) and a Purple Void (the
       ones near pulled back and slowed); Orbinaut Orbs (three spike balls round you); a Spring
       Trap (whoever hits it is thrown back); the Giant Ring (out just behind the runner ahead);
       and a Red Spring (straight up, to the high road).
     The further back you are, the better the powers. Classes: Breeze, Gale and Storm (the rivals'
     pace, and how keen they are on powers). Cups open one after another (a trophy in the one
     before, any class), and Storm once you've won a gold at Gale. */
  const GPD = () => root.AdventureGP || { CUPS: [], COURSES: [] };
  const GP_CLS = { breeze: { name: "Breeze", speed: 0.88, dash: 0, keen: 0.55 }, gale: { name: "Gale", speed: 0.95, dash: 1.8, keen: 0.8 }, storm: { name: "Storm", speed: 1, dash: 0.9, keen: 1 } };   // (speed: the CPUs' top speed against yours; dash: how often they use theirs)
  const GP_PTS = [9, 6, 3, 1, 0, 0, 0, 0];
  const GP_CUP_NAMES = ["Flicky Cup", "Carnival Cup", "Aurora Cup", "Ember Cup", "Skyward Cup", "Emerald Cup"];
  const POWERS = {
    shoes: { name: "Speed Shoes", say: "Speed Shoes!" },
    shield: { name: "Bubble Shield", say: "Bubble Shield: it takes one hit" },
    star: { name: "Invincibility", say: "Invincible!" },
    buzz: { name: "Buzz Bomber", say: "Buzz Bomber, after the one ahead" },
    monitor: { name: "Eggman Monitor", say: "A fake monitor, left behind" },
    quake: { name: "Grey Quake", say: "Grey Quake!" },
    chaos: { name: "Chaos Control", say: "Chaos Control!" },
    laser: { name: "Cyan Laser", say: "Cyan Laser!" },
    rocket: { name: "Orange Rocket", say: "Orange Rocket away" },
    drill: { name: "Yellow Drill", say: "Yellow Drill!" },
    void: { name: "Purple Void", say: "Purple Void!" },
    orbs: { name: "Orbinaut Orbs", say: "Orbinaut Orbs" },
    spring: { name: "Spring Trap", say: "A spring, left behind" },
    ring: { name: "Giant Ring", say: "Giant Ring: on ahead!" },
    redspring: { name: "Red Spring", say: "Red Spring!" },
  };
  /* what a Red Ring gives, by place: the leaders traps and a defence, the middle things to throw,
     the back of the pack the big ones that bring you back into it */
  const POWER_ODDS = [
    { monitor: 24, spring: 22, shield: 22, buzz: 14, orbs: 10, shoes: 8 },
    { buzz: 18, laser: 16, rocket: 14, shoes: 14, orbs: 10, monitor: 10, spring: 10, shield: 8 },
    { buzz: 16, laser: 14, rocket: 14, shoes: 14, quake: 10, orbs: 10, redspring: 8, shield: 6, star: 4, void: 4 },
    { shoes: 16, rocket: 12, quake: 12, laser: 10, buzz: 10, redspring: 10, orbs: 8, void: 8, star: 8, drill: 6 },
    { shoes: 16, drill: 12, quake: 12, star: 12, void: 10, redspring: 10, rocket: 8, ring: 8, chaos: 6, buzz: 6 },
    { drill: 16, star: 16, shoes: 14, ring: 12, chaos: 10, void: 10, quake: 10, redspring: 6, rocket: 6 },
    { star: 20, ring: 18, drill: 16, chaos: 14, shoes: 12, void: 10, redspring: 10 },
    { star: 22, ring: 22, chaos: 18, drill: 16, shoes: 12, void: 10 },
  ];
  function rollPower(place, rnd) {
    const o = POWER_ODDS[clamp(place, 0, 7)], tot = Object.values(o).reduce((a, b) => a + b, 0);
    let r = (rnd || Math.random)() * tot;
    for (const k in o) { r -= o[k]; if (r <= 0) return k; }
    return "shoes";
  }
  let GP = null, GPR = null;                          // the cup being run; the race being run
  const gpCourse = id => GPD().COURSES.find(c => c.id === id);
  const GP_DEFS = {};
  function gpDef(id) {
    const c = gpCourse(id); if (!c) return null;
    return GP_DEFS[id] || (GP_DEFS[id] = Object.assign({}, c, { actN: 3, race: true, gp: true, last: false }));
  }
  const gpSave = () => (saveData.gp = saveData.gp || { trophies: {} });
  const gpCupOpen = (i, online) => online || i === 0 || Object.keys((gpSave().trophies[GPD().CUPS[i - 1].id]) || {}).length > 0;
  const gpClsOpen = (cls, online) => online || cls !== "storm" || Object.values(gpSave().trophies).some(t => t.gale === 1);
  /* load the courses when they're first wanted (a megabyte of them; the rest of the cabinet doesn't need it) */
  function needGP(then) {
    if (root.AdventureGP) { then(); return; }
    const s = document.createElement("script");
    s.src = "adventure-gp.js" + (root.V ? "?v=" + root.V : "");       // (index.html's stamp)
    s.onload = () => then(); s.onerror = () => note("The grand prix's courses didn't load: check the connection.");
    document.head.append(s);
  }

  /* A course's picture for the cup select, as Mario Kart 64 shows each cup's four: the course
     built to one side, a stretch of it near the start, seen from the run's own camera, kept */
  const GP_PICS = {};
  function coursePic(id, at) {
    if (GP_PICS[id]) return GP_PICS[id];
    if (!R) return null;
    const keep = { scene, camera, sun, hemi, H };
    let out = null, rt = null;
    try {
      const w = buildWorld(gpDef(id));
      const cx = at || 120, i0 = Math.max(0, Math.floor((cx - 40) / 16) * 16);
      for (let i = i0; i < Math.min(w.W, cx + 48); i += 16) for (const m of buildChunk(w.S, w.T, i, Math.min(w.W, i + 16))) w.group.add(m);
      for (const f of w.far.userData.anim) f(3);
      let gy = 4; for (let j = H - 1; j >= 0; j--) if (solid(w.S.grid[j][Math.floor(cx)])) { gy = j + 1; break; }
      const PW = 480, PH = 300;
      camera.aspect = PW / PH; camera.updateProjectionMatrix();
      camera.position.set(cx, gy + 5.5, 19); camera.lookAt(cx, gy + 3, 0);
      sun.position.set(cx + w.T.sun[2][0], w.T.sun[2][1], w.T.sun[2][2]); sun.target.position.set(cx, gy, 0);
      rt = new THREE.WebGLRenderTarget(PW, PH);
      rt.texture.encoding = R.outputEncoding;
      R.setRenderTarget(rt); R.render(scene, camera);
      const px = new Uint8Array(PW * PH * 4);
      R.readRenderTargetPixels(rt, 0, 0, PW, PH, px);
      const big = document.createElement("canvas"); big.width = PW; big.height = PH;
      const img = big.getContext("2d").createImageData(PW, PH), row = PW * 4;
      for (let y = 0; y < PH; y++) img.data.set(px.subarray((PH - 1 - y) * row, (PH - y) * row), y * row);
      big.getContext("2d").putImageData(img, 0, 0);
      out = document.createElement("canvas"); out.width = PW / 2; out.height = PH / 2;
      const g = out.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(big, 0, 0, PW / 2, PH / 2);
      scene.traverse(o => { if (o.geometry && !o.userData.keep && !Object.values(PROPS).includes(o.geometry)) o.geometry.dispose(); });
      if (scene.background && scene.background.dispose) scene.background.dispose();
    } catch (e) { console.error(e); out = null; }
    finally {
      if (R) R.setRenderTarget(null);
      if (rt) rt.dispose();
      ({ scene, camera, sun, hemi, H } = keep);
    }
    return (GP_PICS[id] = out);
  }

  /* ---- the cup select: the class, your runner, the six cups; the highlighted cup's four courses
     in pictures, with their names; your trophies on each cup */
  let gpCupI = 0;
  function gpMenu() {
    needGP(() => gpMenuDraw());
  }
  function gpMenuDraw() {
    if (pendingFirst(gpMenu)) return;
    const S = gpSave(), set = S.set = Object.assign({ cls: "breeze", cup: 0 }, S.set || {});
    if (!gpClsOpen(set.cls)) set.cls = "breeze";
    gpCupI = clamp(set.cup | 0, 0, GPD().CUPS.length - 1); if (!gpCupOpen(gpCupI)) gpCupI = 0;
    if (!hasFighter(castId)) castId = "sonic";
    const ov = screenOn("setup");
    ensureStageWorld();
    const cups = GPD().CUPS;
    const tro = c => ["breeze", "gale", "storm"].map(k => { const p = (S.trophies[c.id] || {})[k]; return `<i class="gp-tro ${p ? "p" + p : ""}" title="${GP_CLS[k].name}: ${p ? ["", "gold", "silver", "bronze"][p] : "none yet"}">${ico("trophy")}</i>`; }).join("");
    ov.innerHTML = `
      <div class="adv-menu pop gp-menu">
        <div class="panel adv-panel">
          <div class="panel-hd">${ico("trophy")}Red Ring Circuit: the grand prix</div>
          <div class="gp-top">
            <div class="setrow"><div class="setlab"><b>Class</b><i>How fast the rivals go.</i></div><div class="seg adv-seg">${Object.keys(GP_CLS).map(k => `<button data-cls="${k}" data-k="cls-${k}" class="${set.cls === k ? "sel" : ""}" ${gpClsOpen(k) ? "" : "disabled"}>${gpClsOpen(k) ? "" : ico("lock")}${GP_CLS[k].name}</button>`).join("")}</div></div>
            <div class="setrow"><div class="setlab"><b>You</b><i>Seven of the rest race you.</i></div><div class="adv-pick"><button class="adv-arr" data-pk="-1" data-k="pk-prev">${ico("back")}</button><canvas width="44" height="40" data-face="${castId}"></canvas><b>${esc(castOf(castId).name)}</b><button class="adv-arr" data-pk="1" data-k="pk-next">${ico("next")}</button></div></div>
          </div>
          <div class="gp-sel">
            <div class="gp-cups">${cups.map((c, i) => `
              <button class="gp-cup ${i === gpCupI ? "on" : ""} ${gpCupOpen(i) ? "" : "locked"}" data-cup="${i}" data-k="cup-${c.id}" ${i === gpCupI ? "data-focus" : ""}>
                <b>${gpCupOpen(i) ? "" : ico("lock")}${esc(c.name)}</b><span class="gp-tros">${tro(c)}</span>
              </button>`).join("")}</div>
            <div class="gp-prev"></div>
          </div>
          <div class="adv-go">
            <button class="btn ghost" data-back data-k="back">${ico("back")}Main menu</button>
            <button class="btn" id="gpGo" data-enter data-k="go">${ico("flag")}Start the cup</button>
          </div>
        </div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    const paintPrev = () => {
      const c = cups[gpCupI], el = ov.querySelector(".gp-prev"); if (!el) return;
      el.innerHTML = `<div class="gp-prev-hd"><b>${esc(c.name)}</b><i>${esc(c.sub)}</i></div>
        <div class="gp-pics">${c.courses.map((id, k) => { const d = gpCourse(id); return `<div class="gp-pic"><canvas width="240" height="150" data-pic="${id}"></canvas><span><em>${k + 1}</em>${esc(d ? d.name : id)}</span></div>`; }).join("")}</div>
        ${gpCupOpen(gpCupI) ? "" : `<p class="adv-note">${ico("lock")}Win a trophy in the ${esc(cups[gpCupI - 1].name)} (any class) to open it.</p>`}`;
      /* the pictures, one a frame, so the menu stays quick */
      const cvs = [...el.querySelectorAll("[data-pic]")];
      const one = k => { if (k >= cvs.length || !cvs[k].isConnected) return; const pic = coursePic(cvs[k].dataset.pic); if (pic) cvs[k].getContext("2d").drawImage(pic, 0, 0, 240, 150); setTimeout(() => one(k + 1), 30); };
      setTimeout(() => one(0), 30);
    };
    paintPrev();
    ov.querySelectorAll("[data-cup]").forEach(b => b.onclick = () => {
      gpCupI = +b.dataset.cup; set.cup = gpCupI; save(saveData);
      ov.querySelectorAll("[data-cup]").forEach(x => x.classList.toggle("on", x === b)); paintPrev();
    });
    ov.querySelectorAll("[data-cls]").forEach(b => b.onclick = () => { set.cls = b.dataset.cls; save(saveData); ov.querySelectorAll("[data-cls]").forEach(x => x.classList.toggle("sel", x === b)); });
    ov.querySelectorAll("[data-pk]").forEach(b => b.onclick = () => { castId = cycleTeam(castId, +b.dataset.pk); saveData.cast = castId; save(saveData); gpMenuDraw(); });
    ov.querySelector("[data-back]").onclick = () => mainMenu();
    ov.querySelector("#gpGo").onclick = () => {
      if (!gpCupOpen(gpCupI)) { note(`Win a trophy in the ${cups[gpCupI - 1].name} first.`); return; }
      gpBegin({ cup: gpCupI, cls: set.cls, who: castId });
    };
    autoFocus();
  }

  /* ---- a cup: who races, the points */
  function gpBegin(o) {
    const cup = GPD().CUPS[o.cup], me = o.who;
    const clean = id => cup.courses.every(cid => (GP_CLEAN[cid] || "").split(" ").includes(id));
    let pool = CAST.map(c => c.id).filter(id => id !== me);
    const good = pool.filter(clean), rest = pool.filter(id => !good.includes(id));
    U.shuffle(good); U.shuffle(rest);
    const cpus = good.concat(rest).slice(0, 7);
    GP = { cup: o.cup, cupId: cup.id, cls: o.cls, k: GP_CLS[o.cls], race: 0, online: !!o.online,
           runners: [{ id: "you", who: me, me: true, name: "You" }].concat(cpus.map((who, i) => ({ id: "cpu" + i, who, name: castOf(who).name, skill: 0.97 + Math.random() * 0.07 }))),
           pts: {}, done: [], retries: 0 };
    GP.runners.forEach(r => { GP.pts[r.id] = 0; });
    gpGrid();
  }
  /* the starting grid: the course, who's on it, each to their mark in turn */
  function gpGrid() {
    const G = GP, cup = GPD().CUPS[G.cup], cid = cup.courses[G.race], def = gpDef(cid);
    const ov = screenOn("setup");
    ov.innerHTML = `
      <div class="panel adv-small pop gp-grid">
        <div class="panel-hd">${ico("flag")}${esc(cup.name)} · Race ${G.race + 1} of 4</div>
        <div class="gp-grid-c"><canvas width="240" height="150" class="gp-gpic"></canvas><div><b>${esc(def.name)}</b><i>${esc(def.sub)}</i><em>${esc(G.k.name)}</em></div></div>
        <div class="gp-line">${G.runners.map(r => `<span class="${r.me ? "me" : ""}"><canvas width="36" height="38" data-face="${r.who}"></canvas><b>${esc(r.me ? castOf(r.who).name : r.name)}</b></span>`).join("")}</div>
        <div class="gp-load"><i style="width:0%"></i></div>
        <p class="adv-note gp-load-t">The runners take their marks…</p>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    const pic = coursePic(cid); if (pic) ov.querySelector(".gp-gpic").getContext("2d").drawImage(pic, 0, 0, 240, 150);
    const cpus = G.runners.filter(r => !r.me && !r.human);
    G.ready = new Set(); G.goSent = false; G.goEarly = false;
    let k = 0;
    const bar = ov.querySelector(".gp-load i");
    const next = () => {                                   // (each to its mark, one after another)
      if (GP !== G) return;
      if (k >= cpus.length) {
        setTimeout(() => {
          if (GP !== G) return;
          gpGo(def);
          if (G.online) { if (NP.host) gpNetReady(NP.me); else Online.toHost({ t: "np.gok" }); }
          if (NP.late) Online.toHost({ t: "np.ws" });     // (a late spectator, its course built: where the race has got to)
        }, 350);
        return;
      }
      k++; bar.style.width = Math.round(k / Math.max(1, cpus.length) * 100) + "%";
      setTimeout(next, 110);
    };
    setTimeout(next, 120);
  }
  /* the race: the course built, the rivals on their marks, the count */
  function gpGo(def) {
    const G = GP, cid = def.id, runsHere = !G.online || NP.host;
    GPR = { def, cid, t0: 0, count: G.online && !G.goEarly ? Infinity : 4.2, said: 5, hfin: {}, seen: {}, gT: 0, tid: 0, go: false, over: false, fin: [], rivals: [], rows: [], freeze: 0, freezeBy: null,
            power: null, spin: 0, roll: 0, bombs: [], traps: [], rockets: [], beams: [], voids: [], myOrbs: null, myShield: 0, shieldS: null, rnd: mulberry32(7 + G.race * 101), myFin: null, lastV: 0, endT: 0 };
    loadDef(def);
    play();
    world.played = true;
    const W = world;
    /* the rivals: CPU runners on their marks, each a little quicker or slower than the next (online,
       the host's: a guest sees each where the host's game says it is) */
    for (const r of G.runners) {
      if (r.me || r.human) continue;
      const bub = new THREE.Sprite(glowMat(0x6ac8ff, 0.55)); bub.scale.set(2.6, 2.6, 1); bub.visible = false; W.group.add(bub);
      const v = { r, who: r.who, q: null, card: null, bub, x: W.start.x, y: W.start.y, tx: W.start.x, ty: W.start.y, rf: null, face: 1,
                  star: 0, shield: false, pow: null, powT: 0, fin: null, lastX: W.start.x, bumpCd: 0 };
      if (runsHere) { v.q = cpuAdd(r.who, { id: r.id, paceK: G.k.speed * (0.955 + clamp((r.skill || 1) - 0.97, 0, 0.07) * 0.65), skill: { dash: G.k.dash } }); v.q.k0 = v.q.p.paceK; }
      else { v.card = makeCard(r.who); W.group.add(v.card); }
      GPR.rivals.push(v);
    }
    /* the HUD: your place, the field along the course, the power box */
    const hudEl = host.querySelector(".adv-hud");
    const box = document.createElement("div"); box.className = "gp-hud";
    box.innerHTML = `
      ${G.watch ? "" : `<div class="gp-place"><b class="num">8</b><i>th</i></div>`}
      <div class="gp-strip"><div class="gp-strip-in">${G.runners.map((r, i) => `<span data-gs="${i}" class="${r.me ? "me" : ""}"><canvas width="22" height="22" data-face="${r.who}"></canvas></span>`).join("")}<em class="gp-goal"></em></div></div>
      ${G.watch ? "" : `<div class="gp-pow"><canvas width="48" height="48"></canvas><i>${TOUCH ? "" : "V"}</i></div>`}`;
    hudEl.append(box);
    box.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    if (TOUCH && !G.watch) { const wrap = document.createElement("div"); wrap.className = "gp-pwrap"; wrap.innerHTML = `<button class="gp-pbtn" data-t="V">Power</button>`; (hudEl.querySelector(".adv-pad") || hudEl).append(wrap); wirePad(wrap); }
    paintPower(null);
    caption(G.online && GPR.count === Infinity ? "Waiting for the others…" : def.name, true);
    world.t = 0;
  }
  const gpHold = () => !!(GPR && !GPR.over && GPR.count > 0.4);
  const gpFrozen = () => !!(GPR && GPR.freeze > 0);
  /* a power's picture, in the box (drawn here: crisp, the cabinet's own) */
  function paintPower(k, spin) {
    const cv = host && host.querySelector(".gp-pow canvas"); if (!cv) return;
    const g = cv.getContext("2d"); g.clearRect(0, 0, 48, 48);
    if (!k) return;
    g.save(); g.translate(24, 24);
    const px = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    const disc = (c, x, y, r) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, PI * 2); g.fill(); };
    const poly = (c, line, pts) => { g.fillStyle = c; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill(); if (line) { g.strokeStyle = line; g.lineWidth = 2; g.stroke(); } };
    const wisp = (c, dark) => { disc(dark, 0, 1, 13); disc(c, 0, 0, 12); disc("#ffffff", -4, -2, 3.2); disc("#ffffff", 4, -2, 3.2); disc("#1a1a2a", -4, -1.5, 1.6); disc("#1a1a2a", 4, -1.5, 1.6); };   // a Wisp's face
    const spring = c => { px("#3a3a44", -12, 10, 24, 5); for (let k = 0; k < 4; k++) px(k % 2 ? "#c8ccd8" : "#8a8e9a", -8, 6 - k * 4, 16, 3); px(c, -14, -12, 28, 6); px("#ffffff", -12, -11, 8, 2); };
    switch (k) {
      case "shoes": px("#1a1a2a", -15, -2, 30, 14); px("#e8303a", -13, -1, 26, 9); px("#ffffff", -13, 6, 26, 3); px("#ffffff", -4, -1, 3, 6); px("#f2c030", 8, -1, 4, 3); break;
      case "shield": g.fillStyle = "rgba(106,200,255,.45)"; g.beginPath(); g.arc(0, 0, 17, 0, PI * 2); g.fill(); g.strokeStyle = "#e6f8ff"; g.lineWidth = 3; g.stroke(); px("#ffffff", -9, -11, 5, 4); break;
      case "star": { g.fillStyle = "#ffd23a"; g.strokeStyle = "#7a4a00"; g.lineWidth = 3; g.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * PI * 2 - PI / 2, r = i % 2 ? 7 : 17; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.stroke(); g.fill(); break; }
      case "buzz":                                         // Sonic 1's wasp: striped body, wings, the stinger
        poly("#bfe8ff", "#5a8ab0", [[-6, -4], [-14, -16], [-1, -9]]); poly("#bfe8ff", "#5a8ab0", [[2, -4], [-2, -17], [9, -8]]);
        g.fillStyle = "#1a1a2a"; g.beginPath(); g.ellipse(0, 3, 15, 7, 0, 0, PI * 2); g.fill();
        for (let k = -9; k <= 9; k += 6) px("#f2c030", k, -3, 3, 12);
        disc("#e8303a", -11, 1, 3); poly("#c8ccd8", "#5a5a6a", [[12, 6], [19, 12], [10, 9]]); break;
      case "monitor": px("#1a1a2a", -15, -15, 30, 30); px("#c8ccd8", -13, -13, 26, 26); px("#2a3a6a", -10, -10, 20, 16); px("#ffc890", -6, -8, 12, 10); px("#d8762a", -7, -2, 14, 3); px("#1a1a1a", -4, -6, 2, 2); px("#1a1a1a", 2, -6, 2, 2); break;
      case "quake":                                        // a stone slab breaking, the ground shaking away from it
        px("#5a5a66", -16, 6, 32, 10); px("#8a8a96", -16, 6, 32, 3);
        poly("#a0a0ac", "#3a3a44", [[-9, 6], [-4, -12], [5, -10], [9, 6]]);
        g.strokeStyle = "#2a2a30"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -10); g.lineTo(-2, -2); g.lineTo(2, 2); g.lineTo(-1, 6); g.stroke();
        px("#d8d0c0", -20, 0, 4, 2); px("#d8d0c0", 16, 0, 4, 2); px("#d8d0c0", -19, -6, 3, 2); px("#d8d0c0", 16, -6, 3, 2); break;
      case "chaos": g.fillStyle = "#3ad88a"; g.strokeStyle = "#0a4a2a"; g.lineWidth = 3; g.beginPath(); g.moveTo(-14, -4); g.lineTo(-7, -14); g.lineTo(7, -14); g.lineTo(14, -4); g.lineTo(0, 16); g.closePath(); g.stroke(); g.fill(); px("#c8ffe8", -6, -11, 6, 4); break;
      case "laser": px("#bff8ff", 4, -3, 20, 6); px("#ffffff", 4, -1, 20, 2); g.save(); g.translate(-6, 0); wisp("#3ad8f0", "#0a6a8a"); g.restore(); break;
      case "rocket":                                       // an Orange Wisp's rocket, nose on
        poly("#ffd23a", null, [[-18, 0], [-10, -5], [-10, 5]]); poly("#f04a1a", null, [[-15, 0], [-10, -3], [-10, 3]]);
        poly("#ff8a2a", "#8a3a0a", [[-10, -7], [8, -7], [17, 0], [8, 7], [-10, 7]]); disc("#ffffff", 3, 0, 3.2); disc("#1a6ad8", 3, 0, 1.8);
        poly("#c8501a", null, [[-8, -7], [-3, -7], [-9, -13]]); poly("#c8501a", null, [[-8, 7], [-3, 7], [-9, 13]]); break;
      case "drill":                                        // a Yellow Wisp's drill, spinning
        poly("#ffd23a", "#8a6a00", [[-12, -11], [16, 0], [-12, 11]]);
        g.strokeStyle = "#c89a0a"; g.lineWidth = 2; for (let k = -6; k <= 8; k += 5) { g.beginPath(); g.moveTo(k, -9 + (k + 12) * 0.38); g.lineTo(k - 4, 9 - (k + 12) * 0.38); g.stroke(); }
        px("#8a8e9a", -17, -8, 6, 16); px("#c8ccd8", -16, -6, 3, 12); break;
      case "void":                                         // a Purple Wisp's void: rings closing on a dark heart
        for (let r = 17; r > 4; r -= 4) { g.strokeStyle = r % 8 ? "#b060f0" : "#6a20b0"; g.lineWidth = 2.5; g.beginPath(); g.arc(0, 0, r, r * 0.3, r * 0.3 + PI * 1.5); g.stroke(); }
        disc("#1a0a2a", 0, 0, 5); disc("#e8c8ff", -1.5, -1.5, 1.4); break;
      case "orbs":                                         // three of Orbinaut's spike balls, round and round
        for (const [x, y] of [[0, -11], [-10, 7], [10, 7]]) { for (let a = 0; a < 8; a++) { const t = a / 8 * PI * 2; px("#c8ccd8", x + Math.cos(t) * 7 - 1, y + Math.sin(t) * 7 - 1, 2, 2); } disc("#2a3a7a", x, y, 5.5); disc("#6a8ad8", x - 2, y - 2, 2); }
        g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1.5; g.beginPath(); g.arc(0, 1, 11, 0, PI * 2); g.stroke(); break;
      case "spring": spring("#f2c030"); g.fillStyle = "#e8303a"; g.beginPath(); g.moveTo(-18, -2); g.lineTo(-11, -7); g.lineTo(-11, 3); g.closePath(); g.fill(); break;
      case "ring":                                         // the Giant Ring that takes you to the Special Stage
        g.strokeStyle = "#7a4a00"; g.lineWidth = 9; g.beginPath(); g.arc(0, 0, 14, 0, PI * 2); g.stroke();
        g.strokeStyle = "#ffd23a"; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, 14, 0, PI * 2); g.stroke();
        g.strokeStyle = "#fff6c0"; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 14, PI * 1.1, PI * 1.6); g.stroke();
        px("#ffffff", 11, -15, 3, 7); px("#ffffff", 8.5, -12.5, 8, 2); break;
      case "redspring": spring("#e8303a"); poly("#ffffff", null, [[0, -21], [-7, -14], [7, -14]]); break;
    }
    g.restore();
    if (spin) { g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(0, 0, 48, 48); }
  }
  /* the race, a frame of it (from the loop, in play) */
  function gpTick(dt) {
    const Rr = GPR, G = GP, w = world, p = player; if (!Rr || !w || !p) return;
    if (Rr.count > 0) {                                    // the count: 3, 2, 1, Go (online: once the host says)
      if (Rr.count === Infinity) { gpDraw(dt); return; }
      Rr.count -= dt;
      const n = Math.ceil(Rr.count - 0.4);
      if (n !== Rr.said && n <= 3) { Rr.said = n; if (n > 0) { caption(String(n), true); SFX.blip ? SFX.blip() : SFX.pop(); } else { caption("Go!"); SFX.dash(); w.t = 0; Rr.go = true; } }
      gpDraw(dt); return;
    }
    if (mode !== "play" && mode !== "goal") return;
    const t = w.t, goalX = w.goal ? w.goal.x : w.W - 20;
    Rr.freeze = Math.max(0, Rr.freeze - dt);
    host.classList.toggle("gp-frozen", Rr.freeze > 0 && Rr.freezeBy !== "you");
    /* the rivals: CPU runners (here, or on a guest's screen the host's, where it says they are) */
    for (const v of Rr.rivals) {
      v.bumpCd = Math.max(0, v.bumpCd - dt);
      if (!v.q) { gpCard(v, dt); continue; }
      const cp = v.q.p; v.x = cp.x; v.y = cp.y; v.face = cp.face; v.star = cp.star;
      if (v.fin != null) continue;
      if (!G.online && Rr.myFin == null) { const d = v.x - p.x; cp.paceK = v.q.k0 * (d > 40 ? 0.95 : d > 20 ? 0.98 : d < -40 ? 1.05 : d < -20 ? 1.025 : 1); }   // (the pack stays near you)
      /* a Red Ring run into: a power, if its hands are free (the keener the class, the surer) */
      for (const e of w.powers) if (!(e.back > 0) && !cp.dead && Math.abs(cp.x - e.x) < 0.75 && cp.y < e.y + 0.8 && cp.y + cp.hh > e.y - 0.3) {
        e.back = 4; e.m.visible = false; burst(e.x, e.y + 0.4, [0xe42630, 0xffffff, 0xffd21a], 8, 4);
        cpuNow = v.q; SFX.ring(); cpuNow = null;
        if (!v.pow && Rr.rnd() < 0.55 + 0.45 * G.k.keen) { v.pow = rollPower(gpPlace(v.r.id), Rr.rnd); v.powT = 0; }
      }
      v.lastX = v.x;
      if (v.pow) { v.powT += dt; gpCpuUse(v); }
    }
    if (G.online && NP.host && Rr.rivals.length) {                // the host: where its CPUs are, to the others, ten times a second
      Rr.cT = (Rr.cT || 0) + dt;
      if (Rr.cT >= 0.1) { Rr.cT = 0; Online.toAll({ t: "np.gc", c: Rr.rivals.filter(v => v.q).map(v => [v.r.id, r3(v.x), r3(v.y), v.q.p._rf || ["idle", 0, 1], v.fin != null ? 1 : 0, v.shield ? 1 : 0, v.q.p.star > 0 ? 1 : 0]) }, true); }
    }
    /* your Red Rings: run into one and the box spins */
    for (const e of w.powers) {
      if (e.back > 0) { e.back -= dt; if (e.back <= 0) { e.back = 0; e.m.visible = true; } continue; }
      if (!G.watch && Math.abs(p.x - e.x) < 0.75 && p.y < e.y + 0.8 && p.y + p.hh > e.y - 0.3 && !p.dead) {
        e.back = 4; e.m.visible = false; SFX.ring(); burst(e.x, e.y + 0.4, [0xe42630, 0xffffff, 0xffd21a], 10, 4);
        if (!Rr.power && !Rr.roll) { Rr.roll = 1.1; Rr.rollK = rollPower(gpPlace("you"), Math.random); }
      }
    }
    if (Rr.roll > 0) {                                     // the box, spinning through them, then stopping on one
      Rr.roll -= dt;
      const ks = Object.keys(POWERS);
      if (Rr.roll > 0) paintPower(ks[Math.floor(t * 14) % ks.length], true);
      else { Rr.roll = 0; Rr.power = Rr.rollK; paintPower(Rr.power); SFX.set(); }
    }
    /* the power button */
    const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(g => g && g.connected) : [];
    const gp0 = pads[0], padV = gp0 && ((gp0.buttons[4] && gp0.buttons[4].pressed) || (gp0.buttons[6] && gp0.buttons[6].pressed));
    const V = !!(keys.V || touch.V || padV);
    if (V && !Rr.lastV && Rr.power && !p.dead && Rr.myFin == null && Rr.freeze <= 0) { const k = Rr.power; Rr.power = null; paintPower(null); gpUse("you", k); }
    Rr.lastV = V;
    /* you and the rivals, touching: invincible, or rolling into them, they go down */
    for (const v of Rr.rivals) {
      if (v.fin != null || v.bumpCd > 0 || G.watch) continue;
      if (Math.abs(v.x - p.x) < 0.9 && Math.abs(v.y - p.y) < 1.6) {
        if (p.star > 0 && v.star <= 0) { gpHit(v.r.id, "you"); v.bumpCd = 1.5; }
        else if (v.star > 0 && p.star <= 0) { gpHit("you", v.r.id); v.bumpCd = 1.5; }
        else if ((p.curl || p.state === "attack" || p.state === "special") && !(v.q && v.q.p.state === "hurt")) { gpHit(v.r.id, "you", 0.8); v.bumpCd = 1.5; }
      }
    }
    gpStepShots(dt);
    if (G.online) {                                        // online: where you are, to the others; the other players, touched
      Rr.gT += dt;
      if (Rr.gT >= 0.1 && !G.watch) { Rr.gT = 0; const d = { t: "np.g", x: r3(p.x), y: r3(p.y), rf: p._rf || ["idle", 0, 1], fin: Rr.myFin != null ? 1 : 0 }; if (NP.host) Online.toAll(Object.assign({ id: NP.me }, d), true); else Online.toHost(d); }
      for (const r of G.runners) if (r.human && !r.me) {
        const g = NP.ghosts.get(r.netId); if (!g) continue;
        if (g.fin && Rr.seen[r.netId] == null) Rr.seen[r.netId] = t;
        if (!G.watch && p.star > 0 && !(Rr.cd && Rr.cd[r.netId] > t) && Math.abs(g.x - p.x) < 0.9 && Math.abs(g.y - p.y) < 1.6) { (Rr.cd = Rr.cd || {})[r.netId] = t + 1.5; gpSend({ k: "hit", to: r.netId }); }
      }
    }
    if (Rr.spin > 0) { Rr.spin -= dt; p.face = Math.floor(Rr.spin * 12) % 2 ? 1 : -1; }
    /* the bubble round you */
    if (!Rr.shieldS) { Rr.shieldS = new THREE.Sprite(glowMat(0x6ac8ff, 0.55)); Rr.shieldS.scale.set(2.8, 2.8, 1); w.group.add(Rr.shieldS); }
    Rr.shieldS.visible = !!Rr.myShield; Rr.shieldS.position.set(p.x, p.y + p.hh / 2, 0.3);
    gpDraw(dt);
    /* a spectating host: once the CPUs and every player still here are home, the result */
    if (G.watch) {
      if (NP.host && !Rr.netSent && Rr.rivals.every(v => v.fin != null) &&
          G.runners.every(r => !r.human || Rr.hfin[r.netId] != null || !(NP.room && NP.room.members.some(m => m.id === r.netId)))) { Rr.endT += dt; if (Rr.endT > 1.6) gpNetResult(); }
    }
    /* all seven home and you not, a while after: the race is over for you */
    else if (Rr.myFin == null && Rr.rivals.every(v => v.fin != null)) { Rr.endT += dt; if (Rr.endT > (G.online ? 25 : 12)) { Rr.myFin = Infinity; Rr.over = true; mode = "goal"; caption("Race over", true);
      if (G.online) { if (NP.host) gpNetFin(NP.me, 9999); else Online.toHost({ t: "np.gfin", time: 9999 }); } else setTimeout(() => gpResults(), 1600); } }
  }
  /* the host's CPU on a guest's screen: on toward where the host last said it was (np.gc), and
     touching the world here as it does there */
  function gpCard(v, dt) {
    const k = Math.min(1, dt * 12);
    v.x += (v.tx - v.x) * k; v.y += (v.ty - v.y) * k;
    if (Math.abs(v.tx - v.x) > 6 || Math.abs(v.ty - v.y) > 6) { v.x = v.tx; v.y = v.ty; }
    if (v.fin == null) ghostTouch(v, v.x, v.y, v.rf);
    v.lastX = v.x;
  }
  function gpNetCpu(d) {
    const Rr = GPR; if (!Rr || !Array.isArray(d.c)) return;
    for (const [id, x, y, rf, fin, sh, st] of d.c) {
      const v = Rr.rivals.find(o => o.r.id === id); if (!v || v.q) continue;
      v.tx = +x || 0; v.ty = +y || 0; v.rf = Array.isArray(rf) ? rf : v.rf; v.face = (v.rf || [])[2] || 1;
      v.shield = !!sh; v.star = st ? 1 : 0;
      if (fin && v.fin == null) { v.fin = world ? world.t : 0; Rr.fin.push({ id, t: v.fin }); }
    }
  }
  /* places: home first by time, then by how far along */
  function gpOrder() {
    const Rr = GPR, p = player, list = [];
    if (!(GP && GP.watch)) list.push({ id: "you", x: p ? p.x : 0, y: p ? p.y : 0, fin: Rr.myFin });   // (a spectator isn't in the race)
    for (const v of Rr.rivals) list.push({ id: v.r.id, x: v.x, y: v.y, fin: v.fin });
    if (GP && GP.online) for (const r of GP.runners) if (r.human && !r.me) { const g = NP.ghosts.get(r.netId); list.push({ id: r.id, x: g ? g.tx : (world ? world.start.x : 0), y: g ? g.ty : 0, fin: Rr.seen[r.netId] != null ? Rr.seen[r.netId] : null }); }
    return list.sort((a, b) => (a.fin == null) - (b.fin == null) || (a.fin != null ? a.fin - b.fin : b.x - a.x));
  }
  const gpPlace = id => Math.max(0, gpOrder().findIndex(o => o.id === id));
  const ORD = n => n + (n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th");
  /* the rivals' cards, and the HUD */
  function gpDraw(dt) {
    const Rr = GPR, G = GP, w = world; if (!Rr || !w) return;
    for (const v of Rr.rivals) {
      v.bub.visible = v.shield; v.bub.position.set(v.x, v.y + 1, 0.3);
      if (!v.card) continue;
      const a = v.rf || ["idle", 0, 1];
      let name = a[0], i = a[1] | 0, face = a[2] || 1;
      if (!framesOf(v.who, name)) { name = framesOf(v.who, "run") ? "run" : "idle"; i = Math.floor(w.t * 10); }
      const n = (framesOf(v.who, name) || [0]).length;
      setFrame(v.card, name, i % n, face, 0, 0);
      v.card.position.set(v.x, v.y, 0.04);
      if (v.star > 0 && Math.random() < 0.4) burst(v.x, v.y + Math.random() * 1.6, [0xffffff, 0x9ad8ff, 0xfff070], 1, 1);
    }
    for (const e of w.powers) if (e.m.visible) { e.m.rotation.y = w.t * 3; e.m.position.y = e.y + Math.sin(w.t * 3 + e.x) * 0.08; }
    /* the HUD: place, the field along the strip */
    const ord = gpOrder(), me = ord.findIndex(o => o.id === "you") + 1;
    const hp = host.querySelector(".gp-place");
    if (hp && hp.dataset.n !== String(me)) { hp.dataset.n = me; hp.querySelector("b").textContent = me; hp.querySelector("i").textContent = ORD(me).slice(String(me).length); hp.className = "gp-place p" + me; }
    const goalX = w.goal ? w.goal.x : w.W, x0 = w.start.x;
    G.runners.forEach((r, i) => {
      const el = host.querySelector(`[data-gs="${i}"]`); if (!el) return;
      const o = ord.find(q => q.id === r.id); if (!o) return;
      el.style.left = (clamp((o.fin != null ? goalX : o.x - x0) / (goalX - x0), 0, 1) * 100).toFixed(2) + "%";
      el.style.zIndex = 20 - ord.indexOf(o);
    });
  }
  /* a CPU's power: when it makes sense to use it */
  function gpCpuUse(v) {
    const Rr = GPR, k = v.pow, T = v.powT, ord = gpOrder(), me = ord.findIndex(o => o.id === v.r.id), cp = v.q && v.q.p;
    if (!cp) return;
    const ahead = me > 0 ? ord[me - 1] : null, behind = ord[me + 1] || null, live = o => o && o.fin == null && o.id !== v.r.id;
    const near = (r, dy) => ord.some(o => live(o) && Math.abs(o.x - v.x) < r && Math.abs((o.y || 0) - v.y) < (dy || 99));
    let go = false;
    switch (k) {
      case "shoes": case "drill": go = T > 0.6 && cp.ground; break;
      case "star": case "orbs": case "chaos": go = T > 0.4 + (v.r.skill || 1) * 0.3; break;
      case "shield": go = (live(behind) && v.x - behind.x < 15) || T > 3; break;
      case "buzz": go = (live(ahead) && ahead.x - v.x < 70 && T > 0.6) || T > 6; break;
      case "rocket": go = (live(ahead) && ahead.x - v.x < 45 && T > 0.6) || T > 6; break;
      case "laser": go = (ord.some(o => live(o) && o.x > v.x && o.x - v.x < 35 && Math.abs((o.y || 0) - v.y) < 1.1) && T > 0.5) || T > 7; break;
      case "monitor": case "spring": go = (live(behind) && v.x - behind.x < 22 && T > 0.8) || T > 5; break;
      case "quake": go = (near(12, 3) && T > 0.5) || T > 6; break;
      case "void": go = (near(12, 6) && T > 0.5) || T > 6; break;
      case "ring": go = (live(ahead) && ahead.x - v.x > 15 && T > 0.5) || T > 4; break;
      case "redspring": go = cp.ground && T > 0.5 && !solid(tile(Math.floor(cp.x), Math.floor(cp.y) + 3)) && !solid(tile(Math.floor(cp.x), Math.floor(cp.y) + 5)); break;
    }
    if (go) { v.pow = null; gpUse(v.r.id, k); }
  }
  const gpRunner = id => id === "you" ? null : GPR.rivals.find(v => v.r.id === id);
  const gpBody = id => id === "you" ? player : ((gpRunner(id) || {}).q || {}).p || null;    // (the runner itself, if it's run here)
  const gpPos = id => { if (id === "you") return { x: player.x, y: player.y + 1 }; const v = gpRunner(id); if (v) return { x: v.x, y: v.y + 1 };
    const g = NP.ghosts && NP.ghosts.get(id); return g ? { x: g.x, y: g.y + 1 } : { x: 0, y: 0 }; };
  /* a power used, by you ("you") or a rival (its id) */
  function gpUse(id, k) {
    const Rr = GPR, p = player, v = gpRunner(id), mine = id === "you", at = gpPos(id), me = gpBody(id), host = mine || (v && v.q);
    const send = msg => { if (mine) gpSend(msg); else if (v && v.q) gpSend(Object.assign({ by: id }, msg)); };   // (to the others online: yours, or the host's CPU's)
    if (mine) hudToast(POWERS[k].say);
    const ord = () => gpOrder(), ahead = () => { const o = ord(), i = o.findIndex(x => x.id === id); return i > 0 && o[i - 1].fin == null ? o[i - 1] : null; };
    switch (k) {
      case "shoes": if (me) me.speedT = 4.5; if (mine) SFX.dash(); break;
      case "shield": if (mine) { Rr.myShield = 4.5; SFX.set(); } else if (v) v.shield = 4.5; break;          // (four and a half seconds, or one hit)
      case "star": if (me) me.star = 7; if (mine) SFX.star(); break;
      case "drill": if (me) { me.drillT = 2.5; me.speedT = 0; } burst(at.x, at.y - 0.4, [0xffd23a, 0xffffff], 10, 5); SFX.dash(); break;
      case "redspring": if (me) { me.vy = 24; me.ground = false; me.on = null; me.jumping = false; me.ballistic = false; me.curl = true; if (me.state !== "fly") me.state = "run"; } burst(at.x, at.y - 0.8, [0xe8303a, 0xffffff], 10, 5); SFX.spring(); break;
      case "buzz": {                                       // Sonic 1's Buzz Bomber: after the one ahead -- or, with nobody ahead, hovering where you left it, for whoever comes
        const tgt = ahead(), m = gpTrapMesh("buzz");
        if (tgt) Rr.bombs.push({ kind: "buzz", from: id, to: tgt.id, x: at.x + 0.6, y: at.y, t: 0, m });
        else gpTrap("buzz", id, at.x - 1.8, at.y + 0.3, m, send);
        SFX.homing ? SFX.homing() : SFX.dash(); break;
      }
      case "monitor": case "spring": {                     // left on the ground behind you: a fake monitor, or a spring that throws back whoever runs into it
        const x = at.x - 1.6; let gy = at.y - 1; for (let j = Math.floor(gy) + 1; j >= 0; j--) if (solid(tile(Math.floor(x), j)) || tile(Math.floor(x), j) === "-") { gy = j + 1; break; }
        gpTrap(k, id, x, gy, gpTrapMesh(k), send); SFX.pop(); break;
      }
      case "quake": {                                      // the ground shakes out both ways: everyone standing on it near you goes down (in the air, you're safe)
        for (let d = -14; d <= 14; d += 2) burst(at.x + d, at.y - 0.9, [0xd8d0c0, 0x8a8a96, 0xffffff], 2, 4);
        if (mine) shakeCam(0.3); SFX.impact(); SFX.boom();
        for (const o of ord()) if (o.id !== id && o.fin == null) {
          const b = gpBody(o.id), q = gpPos(o.id), card = !b && gpRunner(o.id);            // (the host's CPU, on a guest's screen: the host's game decides; near enough, it's told)
          if ((b ? b.ground : card) && Math.abs(q.x - at.x) < 15 && Math.abs(q.y - at.y) < 3) gpHit(o.id, id);
        }
        send({ k: "quake", x: at.x, y: at.y }); break;
      }
      case "chaos": {
        Rr.freeze = 3.5; Rr.freezeBy = id; caption("Chaos Control!"); SFX.star();
        send({ k: "chaos" });
        if (!mine) hudToast(castOf(v.who).name + ": Chaos Control!");
        break;
      }
      case "laser": {                                      // a Cyan Wisp's beam, straight ahead at your height, till a wall stops it: everyone in it goes down
        const y = at.y - 0.4; let x1 = at.x + 40;
        for (let i = Math.floor(at.x + 0.6); i < at.x + 40; i++) if (solid(tile(i, Math.floor(y)))) { x1 = i; break; }
        gpBeam(at.x + 0.4, x1, y);
        for (const o of ord()) if (o.id !== id && o.fin == null) { const q = gpPos(o.id); if (q.x > at.x + 0.3 && q.x < x1 && Math.abs(q.y - 0.4 - y) < 1.0) gpHit(o.id, id); }
        send({ k: "laser", x: at.x, x1, y }); SFX.charge ? SFX.charge(0.3) : SFX.dash(); break;
      }
      case "rocket": {                                     // an Orange Wisp's rocket, along the road ahead: the first one it meets goes down
        const m = new THREE.Mesh(vox(vx => { vx.box(-6, -2, -2, 4, 2, 2, 0xff8a2a); vx.box(5, -1, -1, 7, 1, 1, 0xffd23a); vx.box(-7, -3, -1, -5, 3, 1, 0xc8501a); vx.set(2, 0, 3, 0xffffff); }, 0.09), materials().vox);
        world.group.add(m);
        Rr.rockets.push({ from: id, x: at.x + 0.8, y: at.y - 0.6, t: 0, m });
        SFX.dash(); break;
      }
      case "void": {                                       // a Purple Wisp's void opens: everyone near is pulled back toward it, and slowed
        gpVoidFx(at.x, at.y - 0.4);
        for (const o of ord()) if (o.id !== id && o.fin == null) {
          const q = gpPos(o.id), b = gpBody(o.id); if (Math.abs(q.x - at.x) >= 14 || Math.abs(q.y - at.y) >= 6) continue;
          if (b) { b.slowT = 3; moveX(b, -sgn(q.x - at.x) * 1.5); }
          else if (gpRunner(o.id) && GP && GP.online) gpSend({ k: "cpuSlow", id: o.id, x: at.x });      // (the host's CPU: the host slows it)
        }
        send({ k: "void", x: at.x, y: at.y }); SFX.boom(); break;
      }
      case "orbs": {                                       // three of Orbinaut's spike balls, round you ten seconds: whoever touches one goes down
        const o = { n: 3, t: 10, a: 0, ms: [0, 1, 2].map(() => gpTrapMesh("orb")) };
        if (mine) Rr.myOrbs = o; else if (v) v.orbs = o;
        SFX.set(); break;
      }
      case "ring": {                                       // the Giant Ring: through it, and out again just behind the one ahead
        const tgt = ahead();
        burst(at.x, at.y, [0xffd23a, 0xffffff], 18, 6); flash(at.x, at.y, 3, 0xffe060); SFX.ring();
        if (tgt && me) {
          const q = gpPos(tgt.id); let x = q.x - 2.5, y = q.y - 1;
          if (solid(tile(Math.floor(x), Math.floor(y + 0.5)))) x = q.x;
          me.x = x; me.y = y + 0.05; me.vy = Math.max(me.vy, 2); me.ground = false; me.on = null;
          if (mine) snapCamera();
          burst(x, y + 1, [0xffd23a, 0xffffff], 18, 6); flash(x, y + 1, 3, 0xffe060);
        }
        break;
      }
    }
  }
  /* a trap left on the course (and, online, on everyone's) */
  function gpTrap(kind, from, x, y, m, send) {
    const Rr = GPR, tid = (from === "you" ? (NP.me || "me") : from) + ":" + (++Rr.tid);
    m.position.set(x, y, 0.1);
    Rr.traps.push({ kind, from, x, y, m, t: 0, life: 40, tid });
    if (send) send({ k: "trap", kind, x, y, tid });
  }
  function gpTrapMesh(kind) {
    let m;
    if (kind === "monitor") m = new THREE.Mesh(vox(vx => { vx.box(-5, 0, -4, 5, 11, 4, 0xc8ccd8); vx.box(-4, 3, 5, 4, 9, 5, 0x2a3a6a); vx.box(-2, 4, 6, 2, 8, 6, 0xffc890); vx.box(-3, 4, 6, 3, 4, 6, 0xd8762a); vx.set(-1, 7, 7, 0x1a1a1a); vx.set(1, 7, 7, 0x1a1a1a); vx.box(-2, 8, 6, 2, 8, 6, 0xd8302a); }, 0.08), materials().vox);
    else if (kind === "spring") { m = new THREE.Group(); const part = n => { const q = new THREE.Mesh(propGeo(n), materials().vox); m.add(q); return q; }; part("springBase"); const coil = part("springCoil"), cap = part("springCap"); m.userData.sp = { coil, cap, sq: 0 }; springPose(m.userData.sp); }
    else if ((kind === "buzz" || kind === "orb") && BADS && BADS.f[kind === "buzz" ? "buzzbomber" : "orbinaut"]) { m = badCard(); m.castShadow = false; }
    else m = new THREE.Mesh(vox(vx => { for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) for (let c = -3; c <= 3; c++) if (Math.hypot(a, b, c) <= 3.2) vx.set(a, b, c, kind === "orb" ? 0x2a3a7a : 0x1a1a2a); }, 0.09), materials().vox);
    world.group.add(m);
    return m;
  }
  /* a beam, for a moment */
  function gpBeam(x0, x1, y) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.5, x1 - x0), 0.35, 0.35), new THREE.MeshBasicMaterial({ color: 0x9af4ff, transparent: true, opacity: 0.85, depthWrite: false }));
    m.position.set((x0 + x1) / 2, y, 0.4); m.renderOrder = 5; world.group.add(m);
    GPR.beams.push({ m, t: 0 });
    for (let x = x0; x < x1; x += 3) burst(x, y, [0xffffff, 0x9af4ff], 1, 2);
  }
  function gpVoidFx(x, y) {
    const ms = [0, 1, 2].map(k => { const m = new THREE.Mesh(new THREE.TorusGeometry(1.4 + k * 0.9, 0.12, 6, 20), new THREE.MeshBasicMaterial({ color: k % 2 ? 0x6a20b0 : 0xb060f0, transparent: true, opacity: 0.7, depthWrite: false })); m.position.set(x, y, 0.4); m.renderOrder = 5; world.group.add(m); return m; });
    GPR.voids.push({ ms, t: 0 });
  }
  /* thrown back the way they came, by a spring left in the road */
  function gpBounce(id) {
    const Rr = GPR;
    if (id === "you") { if (player.star > 0 || Rr.myFin != null || (GP && GP.watch)) return; bounceBack(player); return; }
    const v = gpRunner(id);
    if (!v) { if (GP && GP.online) gpSend({ k: "bounce", to: id }); return; }
    if (!v.q) { if (GP && GP.online) gpSend({ k: "cpuBounce", id }); return; }
    if (v.q.p.star <= 0) bounceBack(v.q.p);
  }
  function bounceBack(b) { b.vx = -(sgn(b.vx) || 1) * Math.max(9, Math.abs(b.vx) * 0.8); b.vy = 13; b.ground = false; b.on = null; b.state = "run"; b.ballistic = true; b.curl = true; b.jumping = false; b.mv = null; b.sp = null; const k = cpuNow; cpuNow = b.cpuQ || null; SFX.spring(); cpuNow = k; }
  /* a runner hit (a Buzz Bomber, a fake monitor, the quake, a laser, a rocket, an orb, someone
     invincible): down a moment; a shield takes it instead; invincible (or drilling), nothing */
  function gpHit(id, by, k) {
    const Rr = GPR;
    if (id === "you") {
      const p = player;
      if (p.star > 0 || Rr.myFin != null || (GP && GP.watch)) return;
      if (p.drillT > 0) return;
      if (Rr.myShield) { Rr.myShield = 0; burst(p.x, p.y + p.hh / 2, [0x6ac8ff, 0xffffff], 14, 5); SFX.pop(); return; }
      p.vx = 0; p.vy = 6; p.ground = false; p.state = "hurt"; p.st = 0.55; p.curl = false; p.mv = null; p.sp = null; p.inv = 1.2;
      Rr.spin = 0.9; SFX.hurt(); flashHud(); burst(p.x, p.y + 1, [0xffffff, 0xf2d040], 10, 5);
      if (p.carrots > 0) scatterRings(p);
      return;
    }
    const v = gpRunner(id);
    if (!v) {                                              // (another player: theirs to take -- from you, or from the host's CPU)
      const cv = by !== "you" && gpRunner(by);
      if (GP && GP.online && (by === "you" || (cv && cv.q))) gpSend(by === "you" ? { k: "hit", to: id } : { k: "hit", to: id, by });
      return;
    }
    if (v.fin != null) return;
    if (!v.q) {                                            // (on a guest's screen, the host's CPU: the host's to knock down)
      if (GP && GP.online && by === "you") gpSend({ k: "cpuHit", id, kk: k || 1 });
      if (v.star <= 0) burst(v.x, v.y + 1, [0xffffff, 0xf2d040], 10, 5);
      return;
    }
    const q = v.q, cp = q.p;
    if (cp.star > 0 || cp.dead || cp.drillT > 0) return;
    if (v.shield) { v.shield = 0; burst(v.x, v.y + 1, [0x6ac8ff, 0xffffff], 12, 5); return; }
    /* down, as you go down: thrown up, its rings flying out (for anyone to catch) */
    cp.vx = 0; cp.vy = 6; cp.ground = false; cp.state = "hurt"; cp.st = 0.55 * (k || 1) + 0.25; cp.curl = false; cp.mv = null; cp.sp = null; cp.inv = 1.2;
    burst(cp.x, cp.y + 1, [0xffffff, 0xf2d040], 10, 5);
    cpuNow = q; SFX.hurt(); if (cp.carrots > 0) scatterRings(cp); cpuNow = null;
    if (by === "you") hudToast(castOf(v.who).name + " goes down!");
  }
  /* what's flying (Buzz Bombers, rockets, beams, voids) and what's lying in wait (fake monitors,
     springs, Buzz Bombers hovering), the shields running down and the orbs going round */
  function gpStepShots(dt) {
    const Rr = GPR, p = player, w = world;
    const runners = () => { const l = []; if (!(GP && GP.watch) && Rr.myFin == null) l.push({ id: "you", x: p.x, y: p.y }); for (const v of Rr.rivals) if (v.fin == null) l.push({ id: v.r.id, x: v.x, y: v.y, cpu: !!v.q }); if (GP && GP.online) for (const r of GP.runners) if (r.human && !r.me) { const g = NP.ghosts.get(r.netId); if (g && !g.fin) l.push({ id: r.id, x: g.x, y: g.y, ghost: true }); } return l; };
    Rr.myShield = Math.max(0, (Rr.myShield || 0) - dt);
    for (const v of Rr.rivals) if (v.q) v.shield = Math.max(0, (v.shield || 0) - dt);
    for (const b of Rr.bombs) {                            // Buzz Bombers, after their mark
      if (b.gone) continue;
      b.t += dt;
      const tgt = b.to ? gpPos(b.to) : { x: b.x + 30, y: b.y };
      const dx = tgt.x - b.x, dy = tgt.y - b.y, d = Math.hypot(dx, dy) || 1, sp = 24;
      b.x += dx / d * sp * dt; b.y += dy / d * sp * dt;
      if (b.m.userData.bad) setBad(b.m, "buzzbomber", "fly", Math.floor(b.t * 14), dx < 0 ? -1 : 1, b.x, b.y - 0.4);
      else b.m.position.set(b.x, b.y, 0.2);
      if ((b.to && d < 0.9) || b.t > 5) {
        b.gone = true; world.group.remove(b.m); burst(b.x, b.y, [0xff8a2a, 0xffd23a, 0x3a3a3a], 20, 7); SFX.impact();
        if (b.to && d < 0.9) gpHit(b.to, b.from);
      }
    }
    Rr.bombs = Rr.bombs.filter(b => !b.gone);
    for (const r of Rr.rockets) {                          // rockets, along the ground ahead
      if (r.gone) continue;
      r.t += dt;
      const nx = r.x + 30 * dt, f = mechFloor(w, nx, r.y + 1.6);
      if (f > r.y + 1.4 || r.t > 4) r.gone = true;        // (a wall: it goes off there)
      else { r.x = nx; r.y = f > r.y - 3 ? lerp(r.y, f + 0.35, Math.min(1, dt * 12)) : r.y; }
      if (!r.gone) for (const o of runners()) if (o.id !== r.from && Math.abs(o.x - r.x) < 0.8 && r.y > o.y - 0.4 && r.y < o.y + 1.4) { gpHit(o.id, r.from); r.gone = true; break; }
      r.m.position.set(r.x, r.y, 0.3);
      if (Math.random() < 0.7) burst(r.x - 0.6, r.y, [0xffd23a, 0xff8a2a], 1, 1);
      if (r.gone) { world.group.remove(r.m); burst(r.x, r.y, [0xff8a2a, 0xffd23a, 0xffffff], 18, 6); SFX.impact(); }
    }
    Rr.rockets = Rr.rockets.filter(r => !r.gone);
    for (const b of Rr.beams) { b.t += dt; b.m.material.opacity = Math.max(0, 0.85 - b.t * 3); b.m.scale.y = b.m.scale.z = 1 + b.t * 2; if (b.t > 0.3) { world.group.remove(b.m); b.gone = true; } }
    Rr.beams = Rr.beams.filter(b => !b.gone);
    for (const vd of Rr.voids) { vd.t += dt; vd.ms.forEach((m, k) => { const s2 = Math.max(0.05, 1 - vd.t * 1.2); m.scale.set(s2, s2, 1); m.rotation.z = vd.t * (6 + k * 3) * (k % 2 ? -1 : 1); }); if (vd.t > 0.8) { vd.ms.forEach(m => world.group.remove(m)); vd.gone = true; } }
    Rr.voids = Rr.voids.filter(v => !v.gone);
    /* the orbs, round whoever has them: each one that touches someone takes them down, and goes */
    const orbOf = [];
    if (Rr.myOrbs) orbOf.push(["you", Rr.myOrbs, p.x, p.y, () => { Rr.myOrbs = null; }]);
    for (const v of Rr.rivals) if (v.orbs) orbOf.push([v.r.id, v.orbs, v.x, v.y, () => { v.orbs = null; }]);
    for (const [id, o, x, y, done] of orbOf) {
      o.t -= dt; o.a += dt * 5;
      o.ms.forEach((m, k) => {
        m.visible = k < o.n;
        const a = o.a + k * PI * 2 / 3, ox = x + Math.cos(a) * 1.05, oy = y + 0.6 + Math.sin(a) * 1.05;
        if (m.userData.bad) setBad(m, "orbinaut", "shot", 0, 1, ox, oy - 0.21, 0.8); else m.position.set(ox, oy, 0.3);
        if (k < o.n) for (const r of runners()) if (r.id !== id && Math.abs(r.x - ox) < 0.6 && oy > r.y - 0.2 && oy < r.y + 1.3 && !(o.cd > 0)) { gpHit(r.id, id); o.n--; o.cd = 0.25; break; }
      });
      o.cd = Math.max(0, (o.cd || 0) - dt);
      if (o.t <= 0 || o.n <= 0) { o.ms.forEach(m => world.group.remove(m)); done(); }
    }
    /* what's lying in wait */
    for (const tp of Rr.traps) {
      if (tp.gone) continue;
      tp.t += dt; tp.life -= dt;
      if (tp.life <= 0) { tp.gone = true; world.group.remove(tp.m); continue; }
      if (tp.kind === "buzz" && tp.m.userData.bad) setBad(tp.m, "buzzbomber", "fly", Math.floor(tp.t * 14), -1, tp.x, tp.y - 0.4 + Math.sin(tp.t * 3) * 0.15);
      if (tp.kind === "spring" && tp.m.userData.sp) { const sp = tp.m.userData.sp; sp.sq = Math.max(0, sp.sq - dt * 2.6); springPose(sp); }
      const armed = tp.t > 0.6, reach = tp.kind === "buzz" ? 1.0 : 0.8;
      const hitBy = [];
      if (armed && Math.abs(p.x - tp.x) < reach && p.y > tp.y - 1.4 && p.y < tp.y + 1.2 && Rr.myFin == null && !(GP && GP.watch)) hitBy.push("you");
      for (const v of Rr.rivals) if (armed && v.q && v.fin == null && Math.abs(v.x - tp.x) < reach && v.y > tp.y - 1.4 && v.y < tp.y + 1.2 && Rr.rnd() < 0.85) hitBy.push(v.r.id);
      if (!hitBy.length) continue;
      /* (set off by you, or by the host's CPU: gone for everyone) */
      if (tp.tid && (hitBy.includes("you") || (GP && GP.online && NP.host))) gpSend({ k: "trapGone", tid: tp.tid });
      tp.gone = true; world.group.remove(tp.m);
      if (tp.kind === "spring") { hitBy.forEach(id => gpBounce(id)); burst(tp.x, tp.y + 0.5, [0xf2c030, 0xffffff], 10, 5); }
      else { burst(tp.x, tp.y + 0.5, [0xff8a2a, 0xffd23a, 0xc8ccd8], 18, 6); SFX.impact(); hitBy.forEach(id => gpHit(id, tp.from)); }
    }
    Rr.traps = Rr.traps.filter(tp => !tp.gone);
  }
  /* a CPU home: its time */
  function gpCpuHome(q) {
    const Rr = GPR, v = Rr && Rr.rivals.find(o => o.q === q); if (!v || v.fin != null) return;
    v.fin = q.home; Rr.fin.push({ id: v.r.id, t: v.fin });
  }
  /* home (finish() comes here): your time; the rest run on a moment, then the results */
  function gpHome(time) {
    const Rr = GPR; if (!Rr || Rr.myFin != null) return;
    Rr.myFin = time; Rr.fin.push({ id: "you", t: time });
    const pl = gpPlace("you") + 1;
    caption(ORD(pl) + "!", true);
    if (GP.online) { if (NP.host) gpNetFin(NP.me, time); else Online.toHost({ t: "np.gfin", time }); setTimeout(() => { if (GPR && !GPR.done) caption("Waiting for the others…", true); }, 2600); return; }
    setTimeout(() => gpResults(), 2400);
  }
  /* the results, as Mario Kart 64 gives them: the finishing order with times, then the points
     added up, and the cup's standings */
  function gpResults(net) {
    const Rr = GPR, G = GP; if (!Rr || Rr.done) return;
    Rr.done = true; Rr.over = true;
    host.classList.remove("gp-frozen");
    /* those still running: home when they would be, at the pace they're going */
    for (const v of Rr.rivals) if (v.fin == null) v.fin = v.q ? cpuETA(v.q) : world.t + 30;
    if (Rr.myFin == null) Rr.myFin = Infinity;
    const ord = net ? net.map(x => ({ id: gpLocalId(x.id), fin: x.t == null || x.t >= 9999 ? Infinity : x.t })) : gpOrder();
    const res = ord.map((o, i) => { const r = G.runners.find(q => q.id === o.id) || G.runners[0]; return { id: r.id, who: r.who, name: r.me ? "You" : r.name, me: !!r.me, t: o.fin == null ? Infinity : o.fin, pts: GP_PTS[i] }; });
    const myPlace = res.findIndex(r => r.me);
    const ok = G.online || myPlace < 4;
    Rr.res = res;
    mode = "results"; bgm("competition-results");
    host.querySelector(".adv-hud").classList.remove("on");
    const ov = host.querySelector(".adv-ov");
    const before = Object.assign({}, G.pts);
    ov.innerHTML = `
      <div class="panel adv-small pop gp-res">
        <div class="panel-hd gold">${ico("flag")}${esc(Rr.def.name)}: the results</div>
        <div class="gp-rlist">${res.map((r, i) => `
          <p class="${r.me ? "me" : ""}"><em class="num p${i + 1}">${ORD(i + 1)}</em><canvas width="44" height="40" data-face="${r.who}"></canvas><b>${esc(r.name === "You" ? castOf(r.who).name + " (you)" : r.name)}</b><span class="num">${r.t === Infinity ? "--:--.-" : fmt(r.t)}</span><i class="num">${r.pts ? "+" + r.pts : ""}</i></p>`).join("")}</div>
        <div class="adv-btns"><button class="btn" id="gpNext" data-focus data-enter>${ico("next")}${ok ? "The standings" : "Go on"}</button></div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    const record = () => { if (Rr.recorded) return; Rr.recorded = true; res.forEach(r => { G.pts[r.id] += r.pts; }); G.done[G.race] = res; };
    if (ok) record();
    ov.querySelector("#gpNext").onclick = () => {
      if (!ok) { gpRetry(res, myPlace); return; }
      gpStandings(before, res);
    };
    setTimeout(autoFocus, 0);
  }
  /* fifth or worse: as in Mario Kart 64, no points for anyone till the race is won back */
  function gpRetry(res, myPlace) {
    const G = GP, ov = host.querySelector(".adv-ov");
    ov.innerHTML = `
      <div class="panel adv-small pop">
        <div class="panel-hd">${ico("info")}${ORD(myPlace + 1)}: out of the points</div>
        <p class="adv-note">Only the first four score in the grand prix. Run this race again to stay in the cup.</p>
        <div class="adv-btns">
          <button class="btn" id="gpAgain" data-focus data-enter>${ico("flag")}Retry the race</button>
          <button class="btn ghost" id="gpQuit" data-back>${ico("door")}Leave the cup</button>
        </div>
      </div>`;
    ov.querySelector("#gpAgain").onclick = () => { G.retries++; gpEndRace(); gpGrid(); };
    ov.querySelector("#gpQuit").onclick = () => gpQuit();
    setTimeout(autoFocus, 0);
  }
  /* the standings: everyone's points with this race's added, counting up, then in their new order */
  function gpStandings(before, res) {
    const G = GP, ov = host.querySelector(".adv-ov");
    const rows = G.runners.map(r => ({ r, b: before[r.id], a: G.pts[r.id], add: (res.find(x => x.id === r.id) || {}).pts || 0 }));
    const byB = rows.slice().sort((x, y) => y.b - x.b), byA = rows.slice().sort((x, y) => y.a - x.a);
    const last = G.race >= 3;
    ov.innerHTML = `
      <div class="panel adv-small pop gp-res">
        <div class="panel-hd gold">${ico("trophy")}${esc(GPD().CUPS[G.cup].name)}: after race ${G.race + 1} of 4</div>
        <div class="gp-rlist gp-stand">${byB.map((x, i) => `
          <p class="${x.r.me ? "me" : ""}" data-sid="${x.r.id}" style="--i:${i}"><em class="num p${i + 1}">${ORD(i + 1)}</em><canvas width="44" height="40" data-face="${x.r.who}"></canvas><b>${esc(x.r.me ? castOf(x.r.who).name + " (you)" : x.r.name)}</b><i class="num">${x.add ? "+" + x.add : ""}</i><span class="num" data-pts>${x.b}</span></p>`).join("")}</div>
        <div class="adv-btns">
          <button class="btn" id="gpNext" data-focus data-enter>${ico("next")}${last ? "The award ceremony" : "Race " + (G.race + 2) + ": " + esc(gpCourse(GPD().CUPS[G.cup].courses[G.race + 1]).name)}</button>
          ${last ? "" : `<button class="btn ghost" id="gpQuit" data-back>${ico("door")}Leave the cup</button>`}
        </div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    /* count them up, then move each row to its new place */
    const list = ov.querySelector(".gp-stand"), H0 = list.querySelector("p") ? list.querySelector("p").offsetHeight + 4 : 46;
    setTimeout(() => {
      rows.forEach(x => { const el = list.querySelector(`[data-sid="${x.r.id}"]`), sp = el && el.querySelector("[data-pts]"); if (!sp || !x.add) return;
        let n = x.b; const iv = setInterval(() => { n++; sp.textContent = n; if (n >= x.a) clearInterval(iv); }, 70); });
      setTimeout(() => {
        rows.forEach(x => { const el = list.querySelector(`[data-sid="${x.r.id}"]`); if (!el) return; const from = byB.indexOf(x), to = byA.indexOf(x);
          el.style.transform = `translateY(${(to - from) * H0}px)`; const em = el.querySelector("em"); em.textContent = ORD(to + 1); em.className = "num p" + (to + 1); });
      }, 900);
    }, 450);
    const nb = ov.querySelector("#gpNext");
    if (G.online && !NP.host) { nb.disabled = true; nb.innerHTML = `${ico("info")}The host starts the next one`; }
    nb.onclick = () => { if (G.online) { if (!NP.host) return; Online.toAll({ t: "np.gnext" }, true); } gpNetNext(); };
    if (ov.querySelector("#gpQuit")) ov.querySelector("#gpQuit").onclick = () => gpQuit();
    setTimeout(autoFocus, 0);
  }
  function gpEndRace() {
    const Rr = GPR; GPR = null;
    host.classList.remove("gp-frozen");
    const h = host.querySelector(".gp-hud"); if (h) h.remove();
    const pb = host.querySelector(".gp-pwrap"); if (pb) pb.remove();
    if (Rr && world) {
      for (const v of Rr.rivals) { if (v.card) world.group.remove(v.card); world.group.remove(v.bub); if (v.orbs) v.orbs.ms.forEach(m => world.group.remove(m)); }
      for (const l of [Rr.bombs, Rr.traps, Rr.rockets]) for (const b of l) if (b.m) world.group.remove(b.m);
      if (Rr.myOrbs) Rr.myOrbs.ms.forEach(m => world.group.remove(m));
    }
    cpuClear();
  }
  /* the award ceremony: the top three on the podium; a trophy for you if you're there */
  function gpPodium() {
    const G = GP, cup = GPD().CUPS[G.cup];
    const order = G.runners.slice().sort((a, b) => G.pts[b.id] - G.pts[a.id] || (a.me ? -1 : b.me ? 1 : 0));
    const place = order.findIndex(r => r.me) + 1;
    if (place <= 3 && !G.online) {
      const T = gpSave().trophies[cup.id] = gpSave().trophies[cup.id] || {};
      T[G.cls] = Math.min(T[G.cls] || 9, place); save(saveData);
    }
    bgm("gp-trophy", { once: true });
    const ov = screenOn("story");
    const top = order.slice(0, 3), steps = [top[1], top[0], top[2]], H = ["s2", "s1", "s3"];
    ov.innerHTML = `
      <div class="panel adv-small pop gp-podium">
        <div class="panel-hd gold">${ico("trophy")}${esc(cup.name)} · ${esc(G.k.name)}</div>
        <div class="gp-pod">${steps.map((r, i) => r ? `
          <div class="gp-step ${H[i]} ${r.me ? "me" : ""}"><canvas width="176" height="144" data-face="${r.who}"></canvas><b>${esc(r.me ? castOf(r.who).name + " (you)" : r.name)}</b><span class="num">${G.pts[r.id]} pts</span><div class="gp-blk">${H[i].slice(1)}</div></div>` : "").join("")}</div>
        <p class="adv-note">${G.watch ? `<b>${esc(top[0].name)}</b> takes the ${esc(cup.name)}, ${esc(G.k.name)} class, with ${G.pts[top[0].id]} points.` : place <= 3 ? `${["", "Gold", "Silver", "Bronze"][place]} trophy! ${esc(cup.name)}, ${esc(G.k.name)} class.` : `${ORD(place)} overall: the podium is ${esc(top[0].name)}'s this time. Try the cup again!`}</p>
        <div class="adv-btns">
          <button class="btn" id="gpAgain" data-focus data-enter>${ico("flag")}Race the cup again</button>
          <button class="btn ghost" id="gpBack" data-back>${ico("back")}Red Ring Circuit</button>
        </div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach((cv, i) => { paintCard(cv, cv.dataset.face, "portrait", 2); if (i !== 1) cv.style.transform = flipFor(cv.dataset.face, i ? "r" : "l") ? "scaleX(-1)" : ""; });   // (second and third face the winner)
    if (G.online) { ov.querySelector("#gpAgain").remove(); const bb = ov.querySelector("#gpBack"); bb.innerHTML = `${ico("back")}Back to the room`; bb.setAttribute("data-focus", ""); bb.onclick = () => { GP = null; npBackToRoom(); }; }
    else {
      ov.querySelector("#gpAgain").onclick = () => gpBegin({ cup: G.cup, cls: G.cls, who: G.runners[0].who });
      ov.querySelector("#gpBack").onclick = () => { GP = null; gpMenu(); };
    }
    SFX.goal();
    setTimeout(autoFocus, 0);
  }
  function gpQuit() { const on = GP && GP.online; gpEndRace(); GP = null; if (on) { if (root.Online) Online.leave(); return; } gpMenu(); }
  function gpNetNext() {
    const G = GP; if (!G) return;
    if (GPR && !GPR.recorded && GPR.res) { GPR.res.forEach(r => { G.pts[r.id] += r.pts; }); GPR.recorded = true; }
    gpEndRace();
    if (G.race >= 3) gpPodium(); else { G.race++; gpGrid(); }
  }

  /* ---- the grand prix online: a room's players race the cup together. Everyone runs their own
     copy of each course, the other players shown as ghosts; the CPUs filling the eight places are
     the host's: its game runs them and says where they are ten times a second (np.gc), and each
     guest's shows them there, taking the rings and Red Rings they touch as the players' ghosts do.
     A power that reaches another player goes to them over the room (np.pw) -- a CPU's from the
     host; a hit on a CPU to the host -- and the host gathers everyone's time and sends the one
     result (np.gres), so the points and standings are the same for all. No retries online: the
     cup goes on whatever your place. */
  function npGP(plan) {
    needGP(() => {
      const cup = GPD().CUPS[plan.cup], meM = plan.mem.find(m => m.id === NP.me);
      if (meM) { NP.who = meM.who; NP.em = meM.em; }          // (your runner: the one you picked in the room)
      const humans = plan.mem.map(m => ({ id: m.id === NP.me ? "you" : m.id, netId: m.id, who: m.who === "emerl" ? "emerl" : m.who, name: m.name, me: m.id === NP.me, human: true }));
      const cpus = plan.cpus.map((who, i) => ({ id: "cpu" + i, who, name: castOf(who).name, skill: plan.skill[i] }));
      GP = { cup: plan.cup, cupId: cup.id, cls: plan.cls, k: GP_CLS[plan.cls], race: 0, online: true, runners: humans.concat(cpus), pts: {}, done: [], retries: 0, watch: !!NP.watch };   // (watch: a spectator, with no runner of their own)
      GP.runners.forEach(r => { GP.pts[r.id] = 0; });
      if (NP.late) { npLateWait("Catching up with the grand prix…"); Online.toHost({ t: "np.ws" }); }   // (come mid-cup: which race, the points, from the host)
      else gpGrid();
    });
  }
  const gpNetId = id => id === "you" ? NP.me : id;
  const gpLocalId = id => id === NP.me ? "you" : id;
  function gpSend(msg) {
    if (!GP || !GP.online || !NP.on) return;
    msg = Object.assign({ t: "np.pw", by: NP.me }, msg);
    if (NP.host) Online.toAll(msg, true); else Online.toHost(msg);
  }
  /* a power from another player (or the host's CPU), here */
  function gpNetPw(d) {
    const Rr = GPR; if (!Rr || !GP || d.by === NP.me) return;
    const p = player, near = (r, dy) => p && Math.abs(p.x - d.x) < r && Math.abs(p.y + 1 - d.y) < dy;
    switch (d.k) {
      case "hit": if (d.to === NP.me) gpHit("you", d.by); break;
      case "bounce": if (d.to === NP.me) gpBounce("you"); break;
      case "cpuHit": { const v = gpRunner(d.id); if (v && v.q) gpHit(d.id, d.by, +d.kk || 1); break; }   // (a player's hit on the host's CPU: the host's game takes it)
      case "cpuBounce": { const v = gpRunner(d.id); if (v && v.q) gpBounce(d.id); break; }
      case "cpuSlow": { const v = gpRunner(d.id); if (v && v.q) { v.q.p.slowT = 3; moveX(v.q.p, -sgn(v.q.p.x - d.x) * 1.5); } break; }
      case "quake": if (p && p.ground && near(15, 3)) gpHit("you", d.by); for (let k = -14; k <= 14; k += 3) burst(d.x + k, d.y - 0.9, [0xd8d0c0, 0x8a8a96], 2, 4); break;
      case "laser": gpBeam(d.x + 0.4, d.x1, d.y); if (p && p.x > d.x + 0.3 && p.x < d.x1 && Math.abs(p.y + 0.6 - d.y) < 1.0) gpHit("you", d.by); break;
      case "void": gpVoidFx(d.x, d.y - 0.4); if (near(14, 6)) { p.slowT = 3; moveX(p, -sgn(p.x - d.x) * 1.5); } break;
      case "chaos": Rr.freeze = 3.5; Rr.freezeBy = d.by; caption("Chaos Control!"); SFX.star(); break;
      case "trap": { const kind = d.kind || "monitor", m = gpTrapMesh(kind); m.position.set(d.x, d.y, 0.1); Rr.traps.push({ kind, from: d.by, x: d.x, y: d.y, m, t: 0, life: 40, tid: d.tid }); break; }
      case "trapGone": { const tp = Rr.traps.find(q => q.tid === d.tid); if (tp && !tp.gone) { tp.gone = true; world.group.remove(tp.m); burst(tp.x, tp.y + 0.5, [0xff8a2a, 0xffd23a], 12, 5); } break; }
    }
  }
  /* the host: everyone's ready on the grid (or long enough), then Go for all */
  function gpNetReady(id) {
    const Rr = GPR; if (!GP || !GP.online || !NP.host) return;
    GP.ready = GP.ready || new Set(); GP.ready.add(id);
    const here = GP.runners.filter(r => r.human && (r.me || (NP.room && NP.room.members.some(m => m.id === r.netId))));
    if (here.every(r => GP.ready.has(r.netId)) && !GP.goSent) { GP.goSent = true; Online.toAll({ t: "np.ggo" }, true); gpNetGo(); }
  }
  function gpNetGo() { const Rr = GPR; if (Rr && Rr.count === Infinity) Rr.count = 4.2; else if (GP) GP.goEarly = true; }
  /* the host: a player home; once all are (or a while after the first), the result */
  function gpNetFin(id, time) {
    if (!GP || !GP.online || !NP.host || !GPR) return;
    const Rr = GPR; Rr.hfin = Rr.hfin || {}; if (Rr.hfin[id] != null) return;
    Rr.hfin[id] = time;
    const here = GP.runners.filter(r => r.human && (r.me || (NP.room && NP.room.members.some(m => m.id === r.netId))));
    const all = here.every(r => Rr.hfin[r.netId] != null);
    if (all) gpNetResult();
    else if (!Rr.netT) Rr.netT = setTimeout(() => gpNetResult(), 45000);
  }
  function gpNetResult() {
    const Rr = GPR, G = GP; if (!Rr || !G || Rr.netSent) return;
    Rr.netSent = true; clearTimeout(Rr.netT);
    for (const v of Rr.rivals) if (v.fin == null) v.fin = v.q ? cpuETA(v.q) : world.t + 30;
    const res = G.runners.map(r => ({ id: r.human ? r.netId : r.id, t: r.human ? (Rr.hfin[r.netId] != null ? Rr.hfin[r.netId] : null) : (gpRunner(r.id) || {}).fin }))
      .map(x => ({ id: x.id, t: x.t == null ? null : +x.t.toFixed(2) }))
      .sort((a, b) => (a.t == null) - (b.t == null) || (a.t || 0) - (b.t || 0));
    Online.toAll({ t: "np.gres", res }, true);
    gpResults(res);
  }


  /* the camera goes along the stage's low road on its own; nobody is there to see */
  function titleGlide(dt) {
    const p = player, w = world;
    if (w.rival && w.rival.lock) return;                 // (a meeting at an Act's end: everyone stays put through the talk)
    if (w.def.arena) glideX = w.W / 2 + Math.sin(w.t * 0.22) * (w.W / 2 - 12);         // an arena: to and fro across it
    else {
      glideX += dt * 4.2;
      if (glideX > w.W - 30) { glideX = Math.max(12, w.start.x); camX = glideX + 3; }   // round again, a cut
    }
    let y = 0;
    for (let j = 0; j < H; j++) { const c = tile(Math.floor(glideX), j); if (!solid(c) && c !== "~" && c !== "/" && c !== "\\") { y = j; break; } }
    p.x = glideX; p.y = y; p.vx = 0; p.vy = 0; p.face = 1; p.state = "run"; p.inv = 99; p.dead = 0;
  }
  /* The strip along the bottom of the title: up to four of the cast at a time come on, at random,
     each to do a thing of their own -- walk across (those whose sheets draw a walk: Sonic, Knuckles,
     Mighty); run across; walk or run in, stop and stand a while (a waiting pose where the sheet has
     one: Sonic's foot-tap, Knuckles', Mighty's, Metal's), then go on; rev a Spin Dash and roll off;
     fly over (Tails, Cream, Gamma, Eggman); glide over and drop (Knuckles) -- in their own frames
     from their own atlas, crisp, at a whole number of times size. */
  const PARADE_MAX = 4;
  function paradeActor(W, k, busy) {
    const ids = CAST.map(c => c.id).filter(id => SHEETS[id] && !busy.has(id));
    if (!ids.length) return null;
    const id = ids[Math.floor(Math.random() * ids.length)], f = SHEETS[id].f, has = n => f[n] && f[n].length;
    const acts = ["run", "run", "stand", "stand"];
    if (has("walk")) acts.push("walk", "walk", "stand");
    if (has("spin") && has("rev")) acts.push("spin");
    if (has("fly")) acts.push("fly", "fly");
    if (has("glide")) acts.push("glide");
    const act = acts[Math.floor(Math.random() * acts.length)], dir = Math.random() < 0.5 ? 1 : -1;
    return { id, act, dir, t: 0, pt: 0, x: dir > 0 ? -50 : W + 50, y: 0, phase: "in", walk: has("walk") && Math.random() < 0.6,
             stop: W * (0.15 + Math.random() * 0.7), wait: 1.6 + Math.random() * 1.8, alt: 16 + Math.random() * 14 };
  }
  /* one step of an actor: where they are, and which frames; false once they're gone */
  function paradeStep(a, dt, W, k) {
    const f = SHEETS[a.id].f, has = n => f[n] && f[n].length, sp = 62 * k;
    a.t += dt; a.pt += dt;
    const go = (v, name, fps) => { a.x += a.dir * v * dt; a.name = name; a.fps = fps; a.loop = true; };
    const to = ph => { a.phase = ph; a.pt = 0; };
    const gone = () => a.dir > 0 ? a.x > W + 60 : a.x < -60;
    const past = () => a.dir > 0 ? a.x > a.stop : a.x < a.stop;
    a.y = 0;
    switch (a.act) {
      case "walk": go(sp * 0.75, "walk", 9); return !gone();
      /* flying by: Eggman on his Egg Mobile's side booster (its jets below are for going up, not
         along), the others in their flight */
      case "fly": go(sp * 1.5, a.id === "eggman" ? "run" : "fly", 12); a.y = a.alt + Math.sin(a.t * 2.2) * 3; return !gone();
      case "glide":
        if (a.phase === "in") { go(sp * 1.9, "glide", 10); a.y = Math.max(0, a.alt + 10 - a.pt * 7); if (past() || a.y <= 0) to("drop"); return true; }
        if (a.phase === "drop") { a.y = Math.max(0, (a.y || 0) - a.pt * 120); a.x += a.dir * sp * 0.5 * dt; a.name = "fall"; a.fps = 10; a.loop = true; if (a.y <= 0) to("off"); return true; }
        go(sp * 2.2, "run", 14); return !gone();
      case "spin":
        if (a.phase === "in") { go(sp * 2, "run", 13); if (past()) to("skid"); return true; }
        if (a.phase === "skid") { a.name = "skid"; a.fps = 12; a.loop = false; a.x += a.dir * sp * Math.max(0, 1 - a.pt * 3) * dt; if (a.pt > 0.3) to("rev"); return true; }
        if (a.phase === "rev") { a.name = "rev"; a.fps = 10 + a.pt * 30; a.loop = true; if (a.pt > 0.8) to("roll"); return true; }
        go(sp * 5, "spin", 24); return !gone();
      case "stand":                                         // in, a stop, a while standing (their waiting pose, if they have one), and on
        if (a.phase === "in") { if (a.walk) go(sp * 0.75, "walk", 9); else go(sp * 2, "run", 13); if (past()) to(a.walk ? "wait" : "skid"); return true; }
        if (a.phase === "skid") { a.name = "skid"; a.fps = 12; a.loop = false; a.x += a.dir * sp * Math.max(0, 1 - a.pt * 3) * dt; if (a.pt > 0.3) to("wait"); return true; }
        if (a.phase === "wait") {
          const pose = has("pose") && a.pt > 0.6, n = pose ? f.pose.length : 0;
          if (pose && a.pt - 0.6 < n / 8) { a.name = "pose"; a.fps = 8; a.loop = false; a.pose0 = 0.6; }
          else { a.name = "idle"; a.fps = 7; a.loop = true; }
          if (a.pt > (pose ? 0.6 + n / 8 + 0.5 : a.wait)) { if (Math.random() < 0.35) a.dir = -a.dir; to("off"); }
          return true;
        }
        if (a.walk) go(sp * 0.75, "walk", 9); else go(sp * 2.3, "run", 14);
        return !gone();
      default: go(sp * 2.2, "run", 14); return !gone();      // run
    }
  }
  function drawParade(dt) {
    const cv = parade && parade.cv;
    if (!cv || !cv.isConnected) return;
    parade.t += dt;
    const dpr = Math.min(2, root.devicePixelRatio || 1), W = cv.clientWidth, Hh = cv.clientHeight;
    if (!W || !Hh) return;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(Hh * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr); }
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, Hh); g.imageSmoothingEnabled = false;
    const k = (root.innerHeight || 800) < 600 ? 1.5 : 2, track = Math.round(18 * k), top = Hh - track, t = parade.t;
    // the ground: checkered soil in two browns under a lip of grass
    const sq = 12;
    for (let r = 0, y = top + 8; y < Hh; r++, y += sq) for (let c = 0, x = -sq; x < W + sq; c++, x += sq) {
      g.fillStyle = (c + r) & 1 ? "#b8641e" : "#7a3e12"; g.fillRect(x, y, sq, sq);
    }
    g.fillStyle = "#2fb844"; g.fillRect(0, top, W, 6);
    g.fillStyle = "#1c7a2a"; g.fillRect(0, top + 6, W, 3);
    g.fillStyle = "#050a22"; g.fillRect(0, top + 9, W, 2);
    g.fillStyle = "#2fb844";
    for (let x = 0; x < W; x += 16) { g.fillRect(x, top - 3, 4, 3); g.fillRect(x + 9, top - 2, 3, 2); }
    // the cast: up to four at a time, each come on at random
    const P = parade, feet = top + 3;
    P.actors = P.actors || []; P.spawn = P.spawn == null ? 0.2 : P.spawn - dt;
    if (P.spawn <= 0 && P.actors.length < PARADE_MAX) {
      const a = paradeActor(W, k, new Set(P.actors.map(a => a.id)));
      if (a) P.actors.push(a);
      P.spawn = 0.7 + Math.random() * 2.2;
    }
    P.actors = P.actors.filter(a => paradeStep(a, dt, W, k));
    for (const a of P.actors) {
      const A = SHEETS[a.id]; if (!A) continue;
      const img = IMGS[a.id] || (IMGS[a.id] = Object.assign(new Image(), { src: A.url }));
      if (!img.complete || !img.naturalWidth) continue;
      const L = A.f[a.name] || A.f.idle, n = L.length;
      let i = a.loop ? Math.floor(a.pt * a.fps) % n : Math.min(n - 1, Math.floor((a.pt - (a.name === "pose" ? a.pose0 || 0 : 0)) * a.fps));
      if (a.id === "eggman" && (a.name === "run" || a.name === "idle" || a.name === "dash")) i = EGG_FLAME[Math.floor(t * 30) % EGG_FLAME.length] % n;   // his booster, flickering
      if (a.id === "eggman" && a.name === "fly") i = EGG_JETS[Math.floor(t * 30) % EGG_JETS.length] % n;                                   // his jets, flickering
      const fr = L[i], c = castOf(a.id);
      const lift = c.lift ? Math.round(c.lift / PX * k * 0.6 + Math.sin(t * 3.4) * 2) : 0;
      /* (his flying frames are drawn from the jets' tips: the Egg Mobile kept level, only the flames change) */
      const jets = a.id === "eggman" && /^(fly|jump|fall)$/.test(a.name) ? Math.round((fr[3] - 36) * k) : 0;
      const X = Math.round(a.x), Y = Math.round(feet - a.y - lift + jets);
      g.fillStyle = "rgba(10,30,14,.35)"; g.beginPath(); g.ellipse(X, feet + 1, fr[2] * k * 0.3 * Math.max(0.4, 1 - a.y / 120), 3.5, 0, 0, PI * 2); g.fill();
      g.save(); g.translate(X, 0); g.scale(a.dir, 1);
      g.drawImage(img, fr[0], fr[1], fr[2], fr[3], -Math.round(fr[4] * k), Y - fr[3] * k, fr[2] * k, fr[3] * k);
      g.restore();
    }
  }

  function menu() {
    if (pendingFirst(menu)) return;
    endBattle(); storyRun = null; talk = null; RACE = null;
    mode = "menu"; paused = false; parade = null; music();
    const ov = host.querySelector(".adv-ov"), list = stages();
    host.querySelector(".adv-hud").classList.remove("on");
    host.classList.remove("playing");
    ov.innerHTML = `
      <div class="adv-menu pop">
        <div class="panel adv-panel">
          <div class="panel-hd">${ico("person")}Free Exhibition: who runs</div>
          <div class="adv-cast">
            ${CAST.map(c => `
              <button class="adv-who ${c.id === castId ? "on" : ""} ${hasFighter(c.id) ? "" : "locked"}" data-cast="${c.id}">
                <div class="adv-bust"><canvas class="adv-spr" width="176" height="144" data-who="${c.id}" ${hasFighter(c.id) ? "" : 'data-dark="1"'}></canvas></div>
                <div class="adv-who-tx">
                  <b>${hasFighter(c.id) ? esc(c.name) : "???"}</b>
                  ${hasFighter(c.id) ? `<span class="adv-mv">${ico("star")}${esc(c.moves)}</span>` : `<span class="adv-lockhint">${ico("lock")}${esc((UNLOCK[c.id] || {}).hint || "")}</span>`}
                  <span class="adv-gr">${Object.entries(c.grades).map(([k, g]) => `<i>${k}${hasFighter(c.id) ? `<b class="g g${g}">${g}</b>` : `<b class="g">?</b>`}</i>`).join("")}</span>
                  ${hasFighter(c.id) ? `<small>${esc(c.text)}</small>` : ""}
                </div>
              </button>`).join("")}
          </div>
          <div class="panel-hd adv-hd2">${ico("flag")}Zone</div>
          <div class="seg adv-seg adv-exmode">${[["run", "Act 1 and Act 2"], ["race", "Stage Racing: Act 3"]].map(([v, l]) => `<button data-exm="${v}" data-k="exm-${v}" class="${exSet().mode === v ? "sel" : ""}">${l}</button>`).join("")}</div>
          <div class="adv-acts"></div>
          <div class="adv-stages">
            ${list.map((s, i) => {
              const recs = Array.from({ length: nActs(i) }, (_, a) => saveData.stages[s.id + "-" + (a + 1)] || {}), open = unlocked(i), got = zoneShoes(i);
              const bests = recs.map(r => r.best), order = "CBAS", gr = recs.map(r => r.grade).filter(Boolean).sort((a, b) => order.indexOf(b) - order.indexOf(a))[0];
              const r = { best: bests.every(b => b != null) ? bests.reduce((a, b) => a + b, 0) : null, grade: gr }, sh = [0, 1, 2].map(k => k < got);
              return `
              <button class="adv-st ${i === stageIdx ? "on" : ""} ${open ? "" : "locked"}" data-st="${i}" ${open ? "" : "disabled"}>
                <span class="adv-n">${i + 1}</span>
                ${s.who ? `<canvas class="adv-st-who" width="36" height="38" data-face="${s.who}" title="${esc(poss(castOf(s.who).name))} stage"></canvas>` : ""}
                <span class="adv-st-tx"><b>${esc(s.name)}</b><i>${esc(s.sub)}</i></span>
                ${open ? `
                  <span class="adv-shoes">${[0, 1, 2].map(k => `<em class="${sh[k] ? "got" : ""}">${RED_I}</em>`).join("")}</span>
                  <span class="adv-best num">${r.best != null ? fmt(r.best) : "--:--.-"}</span>
                  <span class="adv-grade">${r.grade ? `<b class="g g${r.grade}">${r.grade}</b>` : ""}</span>`
                : `<span class="adv-lock">${ico("lock")}Clear zone ${i} first</span>`}
              </button>`;
            }).join("")}
          </div>
          <div class="adv-go">
            <button class="btn lg" id="advStart" data-enter>${ico("flag")}Start</button>
            <button class="btn ghost" id="advBack" data-back>${ico("back")}Main menu</button>
          </div>
          <div class="adv-keys">${TOUCH ? "On screen: the pad moves, crouches and picks a move (Up or Down with Heavy or Special); Jump, Light, Heavy and Special." :
            `<b>&larr; &rarr;</b> run, twice to dash &middot; <b>Space</b> jump, again in the air &middot; <b>Z</b> light &middot; <b>X</b> heavy &middot; <b>C</b> special<br>
             <b>&uarr;</b> or <b>&darr;</b> with <b>X</b> or <b>C</b> for another move &middot; <b>&darr;</b> crouch &middot; <b>&darr; + Space</b> Spin Dash, or drop through &middot; <b>Enter</b> start, and pause<br>
             In the menus: <b>arrows</b> to choose &middot; <b>Z</b> to confirm &middot; <b>X</b> to go back`}</div>
          <div class="adv-credit">Sonic and his friends, his rivals and Dr. Eggman belong to SEGA. Sonic, Tails, Knuckles, Amy, Rouge, Shadow, Cream, Chaos and Chaos Gamma are from SEGA's Sonic Battle (Game Boy Advance, 2003), ripped by QuadFactor; Emerl, and every move he copies, re-ripped by Dinoshi 64 (some rips by Mr. C); Knuckles' climbing and the Spin Dash rev, dust and blast effects are from Sonic Advance (2001), ripped by AsuharaMoon; all from The Spriters Resource. Dr. Eggman, Metal Sonic, Mighty and Silver are drawn in Sonic Battle's style by TheKnucklesMainG4 (DeviantArt). The badniks are from Sonic Advance, Sonic Advance 2 and Sonic Advance 3, ripped by SpitfyaUK and Techokami, Fatazz and SkyLights (The Spriters Resource), and from TheKnucklesMainG4's Modern Sonic Badniks sheet (DeviantArt). The monitors and shields are Sonic Advance 3's, ripped by SpitfyaUK and Techokami (The Spriters Resource). Eggman's bosses, Gemerl and the capsule are from Sonic Advance, Sonic Advance 2 and Sonic Advance 3, ripped by SonicDash57, Flare, raidlandguy, SkyLights, Shade and Sonikku (The Spriters Resource). The music is from the soundtracks of Sonic the Hedgehog 4 Genesis, Sonic 3 Angel Island Revisited, and the Sonic 2 and Sonic 1 Anniversary Editions (khinsider); the sound effects are Sonic 3 &amp; Knuckles', from Mr Lange's Sonic Sounds Complete.</div>
        </div>
      </div>`;
    ov.querySelectorAll(".adv-spr").forEach(cv => paintCard(cv, cv.dataset.who));
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "idle", 1));
    ov.querySelectorAll("[data-cast]").forEach(b => b.onclick = () => {
      if (!hasFighter(b.dataset.cast)) { note((UNLOCK[b.dataset.cast] || {}).hint || "Not on the team yet."); return; }
      castId = b.dataset.cast; saveData.cast = castId; save(saveData);
      ov.querySelectorAll("[data-cast]").forEach(x => x.classList.toggle("on", x === b));
      world.group.remove(player.spr); if (player.dust) world.group.remove(player.dust);
      player = makePlayer(castOf(castId)); snapCamera();
    });
    ov.querySelectorAll("[data-st]").forEach(b => b.onclick = () => {
      const i = +b.dataset.st; if (!unlocked(i) || i === stageIdx) return;
      ov.querySelectorAll("[data-st]").forEach(x => x.classList.toggle("on", x === b));
      load3d(i, firstAct(i)); music(); paintActs(ov);
    });
    paintActs(ov);
    ov.querySelectorAll("[data-exm]").forEach(b => b.onclick = () => { exSet().mode = b.dataset.exm; save(saveData); ov.querySelectorAll("[data-exm]").forEach(x => x.classList.toggle("sel", x === b)); paintActs(ov); });
    ov.querySelector("#advStart").onclick = () => {
      if (exSet().mode !== "race") { play(); return; }
      if (!actCleared(stageIdx, 1)) { note(`Clear ${stages()[stageIdx].name} Act 2 to open its racecourse.`); return; }
      const e = exSet();
      raceStart({ def: raceDef(stageIdx), who: exRival(), pace: PACE[e.pace] || PACE.normal, backLabel: "Free Exhibition", onBack: () => menu() });
    };
    ov.querySelector("#advBack").onclick = () => mainMenu();
    autoFocus();
  }
  /* the zone's Acts, to pick from: each one's best time and grade; Act 2 opens once Act 1 is cleared */
  const firstAct = i => { for (let a = 0; a < nActs(i); a++) if (!actCleared(i, a)) return a; return 0; };
  /* Stage Racing's settings (kept): the mode, the rival, the pace */
  const exSet = () => {                                  // (the one kept object: filled in, never swapped out)
    const e = saveData.exRace || (saveData.exRace = {}), d = { mode: "run", rival: "metal", pace: "normal" };
    for (const k in d) if (e[k] == null) e[k] = d[k];
    return e;
  };
  /* the rivals for a zone's racecourse: those the robot gets through it fairly */
  const rivalsFor = i => { const l = cleanRunners(stages()[i].id + "-3"); return l.length ? l : ["sonic"]; };
  const exRival = () => { const e = exSet(), l = rivalsFor(stageIdx); return l.includes(e.rival) ? e.rival : l[0]; };
  function paintRace(ov, el) {
    const z = stages()[stageIdx], e = exSet(), open = actCleared(stageIdx, 1), r = saveData.stages[z.id + "-3"] || {}, riv = exRival();
    el.innerHTML = `
      <div class="adv-race-set">
        <div class="adv-act on"><b>Act 3</b><i>${esc(z.name)}<br>The racecourse: race a rival to the goal post</i>
          <span class="num">${open ? (r.best != null ? fmt(r.best) : "--:--.-") : ""}</span>${open ? "" : ico("lock")}</div>
        <div class="setrow"><div class="setlab"><b>Rival</b><i>Any of the cast who can run it clean.</i></div><div class="adv-pick"><button class="adv-arr" data-rv="-1" data-k="rv-prev">${ico("back")}</button><canvas width="44" height="40" data-face="${riv}"></canvas><b>${esc(castOf(riv).name)}</b><button class="adv-arr" data-rv="1" data-k="rv-next">${ico("next")}</button></div></div>
        <div class="setrow"><div class="setlab"><b>Pace</b><i>How fast the rival goes: Hard is flat out.</i></div><div class="seg adv-seg">${[["easy", "Easy"], ["normal", "Normal"], ["hard", "Hard"]].map(([v, l]) => `<button data-pace="${v}" data-k="pace-${v}" class="${e.pace === v ? "sel" : ""}">${l}</button>`).join("")}</div></div>
        ${open ? "" : `<p class="adv-note">${ico("lock")}Clear ${esc(z.name)} Act 2 to open its racecourse.</p>`}
      </div>`;
    el.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    el.querySelectorAll("[data-rv]").forEach(b => b.onclick = () => { e.rival = cycle(rivalsFor(stageIdx), riv, +b.dataset.rv); save(saveData); paintRace(ov, el); });
    el.querySelectorAll("[data-pace]").forEach(b => b.onclick = () => { e.pace = b.dataset.pace; save(saveData); paintRace(ov, el); });
  }
  function paintActs(ov) {
    const el = ov.querySelector(".adv-acts"); if (!el) return;
    if (exSet().mode === "race") { paintRace(ov, el); return; }
    const z = stages()[stageIdx];
    el.innerHTML = Array.from({ length: nActs(stageIdx) }, (_, a) => {
      const r = saveData.stages[z.id + "-" + (a + 1)] || {}, open = actOpen(stageIdx, a), last = a === nActs(stageIdx) - 1;
      return `<button class="adv-act ${a === actIdx ? "on" : ""}" data-act="${a}" data-k="act-${a}" ${open ? "" : "disabled"}>
        <b>Act ${a + 1}</b><i>${esc(z.name)}<br>${last ? "Eggman's " + esc(BOSS[z.boss] ? BOSS[z.boss].name : "boss") : "To the goal signpost"}</i>
        <span class="num">${open ? (r.best != null ? fmt(r.best) : "--:--.-") : ""}</span>${open ? (r.grade ? `<b class="g g${r.grade}">${r.grade}</b>` : "") : ico("lock")}
      </button>`;
    }).join("");
    el.querySelectorAll("[data-act]").forEach(b => b.onclick = () => {
      const a = +b.dataset.act; if (!actOpen(stageIdx, a) || a === actIdx) return;
      load3d(stageIdx, a); music(); paintActs(ov);
    });
  }
  function music() {
    if (!host) return;
    if (battle) {
      const cfg = battle.cfg;
      if (cfg.kind === "training") return bgm("training");
      if (storyRun && storyRun.i === storyRun.ep.chapters.length - 1) return bgm("story-final");      // the story's last fight
      return bgm(BATTLE_BGM[(battle.arena != null ? battle.arena : cfg.arena || 0) % BATTLE_BGM.length]);
    }
    if (mode === "play" || mode === "goal") {
      const b = world && world.boss;
      if (b && b.lock && (b.state === "fight" || b.state === "boom")) return bgm(bossBgm(b));
      if (world && world.def) bgm(zoneBgm(world.def), { resume: true });
      return;
    }
    bgm(SCREEN_BGM[mode]);
  }

  function play() {
    cpuClear();                                            // (a race adds its rivals once it's set up)
    // the stage the menu has standing is fresh: run it; anything already played is built again
    if (world && world.def === curDef() && !world.played) {
      world.group.remove(player.spr); if (player.dust) world.group.remove(player.dust);
      world.t = 0; player = makePlayer(castOf(runnerId())); snapCamera(); acc = 0; last = 0;
    } else loadDef(curDef());
    world.played = true; BGM.over = null;
    if (storyRun) { storyRun.said = {}; storyRun.commT = 0; }
    mode = "play"; paused = false;
    host.querySelector(".adv-ov").innerHTML = "";
    host.classList.add("playing");
    const st = curDef();
    const hudEl = host.querySelector(".adv-hud");
    hudEl.classList.add("on");
    hudEl.innerHTML = `
      <div class="adv-hl">
        <span class="adv-car">${RING_I}<b class="num">0</b><i class="num">/${world.total}</i></span>
        <span class="adv-hs"></span>
      </div>
      <div class="adv-air"><i>Air</i><b class="num"></b></div>
      <div class="adv-hr">
        <span class="adv-clock num">0:00.0</span>
        <button class="adv-pause" title="Pause (Esc)" aria-label="Pause">II</button>
      </div>
      <div class="adv-toast"></div>
      <div class="adv-name"><b>${esc(st.name)}</b>${st.actN ? `<em class="num">Act ${st.actN}</em>` : ""}<i>${esc(st.sub)}</i></div>
      ${storyRun && (storyRun.ch.beats || storyRun.ch.beats2) ? `<div class="adv-comm"><canvas width="88" height="72"></canvas><div><b></b><span></span></div></div>` : ""}
      ${TOUCH ? padHtml() : ""}`;
    hudEl.querySelector(".adv-pause").onclick = () => togglePause();
    wirePad(hudEl);
    hudCache = {};
    setTimeout(() => { const n = host && host.querySelector(".adv-name"); if (n) n.classList.add("off"); }, 2600);
    music();
  }

  /* the cabinet's own icons: a gold ring (the counter) and a Red Star Ring */
  const RING_I = `<svg class="ico sx-ring" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.6" fill="none" stroke="#050a22" stroke-width="4.6"/><circle cx="8" cy="8" r="5.6" fill="none" stroke="#ffd21a" stroke-width="2.6"/><path d="M3.6 6.2A5 5 0 0 1 6.4 3.1" fill="none" stroke="#fff6b0" stroke-width="1.3"/></svg>`;
  const RED_I = `<svg class="ico sx-ring" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="#050a22" stroke-width="4"/><circle cx="8" cy="8" r="6" fill="none" stroke="#e42630" stroke-width="2.2"/><path d="M8 4.6l1 2.2 2.3.2-1.8 1.5.6 2.3L8 9.6l-2.1 1.2.6-2.3-1.8-1.5 2.3-.2z" fill="#ffd21a" stroke="#050a22" stroke-width=".6"/></svg>`;
  let hudCache = {};
  function hud() {
    const h = host.querySelector(".adv-hud"); if (!h || !player || !h.querySelector(".adv-car")) return;   // (no run's HUD up: a match just left)
    const p = player, set = (key, val, fn) => { if (hudCache[key] !== val) { hudCache[key] = val; fn(val); } };
    if (mode === "play") {
      const over = p.dead ? null : p.star > 0.05 ? "invincible" : p.inWater && p.air < 12 ? "drowning" : null;
      if (over !== BGM.over) { BGM.over = over; if (over) bgm(over, { once: over === "drowning" }); else music(); }
    }
    set("car", p.carrots, v => { const c = h.querySelector(".adv-car"); c.querySelector("b").textContent = v; c.classList.toggle("zero", !v); });   // none: the counter flashes red
    set("hs", p.shoes.join(), () => h.querySelector(".adv-hs").innerHTML = p.shoes.map(b => `<em class="${b ? "got" : ""}">${RED_I}</em>`).join(""));
    set("clock", fmt(world.t), v => h.querySelector(".adv-clock").textContent = v);
    const under = p.air < AIR - 0.05;
    set("air", under ? Math.ceil(p.air) : -1, v => {
      const a = h.querySelector(".adv-air"); a.classList.toggle("on", v >= 0); a.classList.toggle("low", v >= 0 && v <= 5);
      a.querySelector("b").textContent = v >= 0 ? v : "";
    });
  }
  function hudToast(text) {
    if (cpuNow) return;                                    // (what a CPU picks up isn't news on your screen)
    const t = host && host.querySelector(".adv-toast"); if (!t) return;
    t.textContent = text; t.classList.remove("on"); void t.offsetWidth; t.classList.add("on");
  }
  function flashHud() { if (cpuNow) return; const h = host && host.querySelector(".adv-car"); if (h) { h.classList.remove("hit"); void h.offsetWidth; h.classList.add("hit"); } }

  function togglePause() {
    if (mode !== "play") return;
    if (NP.on) { npPause(); return; }                     // online: the match can't stop for one player
    paused = !paused;
    const ov = host.querySelector(".adv-ov");
    if (!paused) { ov.innerHTML = ""; last = 0; return; }
    if (battle) return battlePause(ov);
    if (GPR) {                                           // the grand prix: on, the race again, or out of the cup
      ov.innerHTML = `
      <div class="panel adv-small pop">
        <div class="panel-hd">${ico("info")}Paused</div>
        <div class="adv-btns">
          <button class="btn" id="advRes">${ico("next")}Keep racing</button>
          <button class="btn ghost" id="advRe">Restart the race</button>
          <button class="btn ghost" id="advQuit">${ico("door")}Leave the cup</button>
        </div>
      </div>`;
      ov.querySelector("#advRes").onclick = () => togglePause();
      ov.querySelector("#advRe").onclick = () => { paused = false; GP.retries++; gpEndRace(); gpGrid(); };
      ov.querySelector("#advQuit").onclick = () => { paused = false; gpQuit(); };
      autoFocus(); return;
    }
    ov.innerHTML = `
      <div class="panel adv-small pop">
        <div class="panel-hd">${ico("info")}Paused</div>
        <div class="adv-btns">
          <button class="btn" id="advRes">${ico("next")}Keep going</button>
          <button class="btn ghost" id="advRe">Start the stage again</button>
          <button class="btn ghost" id="advQuit">${ico("back")}${storyRun ? "Story" : "Stage select"}</button>
        </div>
      </div>`;
    ov.querySelector("#advRes").onclick = () => togglePause();
    ov.querySelector("#advRe").onclick = () => { paused = false; play(); };
    ov.querySelector("#advQuit").onclick = () => { paused = false; if (storyRun) storyMenu(); else { load3d(stageIdx); menu(); } };
    autoFocus();
  }

  function results(r) {
    if (!host) return;
    checkUnlocks();                                       // (animals freed, Red Star Rings found: shown at the next menu)
    mode = "results";
    host.querySelector(".adv-hud").classList.remove("on");
    const list = stages(), moreActs = !storyRun && actIdx + 1 < nActs(stageIdx);
    const next = moreActs ? stageIdx : stageIdx + 1 < list.length ? stageIdx + 1 : -1, nextAct = moreActs ? actIdx + 1 : 0;
    const ov = host.querySelector(".adv-ov");
    ov.innerHTML = `
      <div class="panel adv-small adv-res pop">
        <div class="panel-hd gold">${ico("trophy")}${esc(curDef().name)}${curDef().actN ? " Act " + curDef().actN : ""}: clear</div>
        <div class="adv-board">
          <div class="adv-row"><span>Time</span><b class="num">${fmt(r.time)}</b>${r.best ? `<em>Best</em>` : ""}</div>
          <div class="adv-row"><span>Rings</span><b class="num">${r.carrots}<i>/${r.total}</i></b></div>
          <div class="adv-row"><span>Red Star Rings</span><b class="adv-hs">${r.shoes.map(b => `<em class="${b ? "got" : ""}">${RED_I}</em>`).join("")}</b></div>
          <div class="adv-row"><span>Falls</span><b class="num">${r.falls}</b></div>
          <div class="adv-row adv-big"><span>Grade</span><b class="g g${r.grade}">${r.grade}</b></div>
        </div>
        ${r.earned && root.Stable ? `<div class="adv-pay">${ico("carrot")}<b class="num">+${r.earned}</b> carrots to your stable</div>` : ""}
        <div class="adv-btns">
          ${storyRun ? (isZone(storyRun.ch) && storyRun.act === 0 ? `<button class="btn" id="advSAct" data-focus>${ico("next")}Go on: Act 2</button>`
            : `<button class="btn" id="advSCont" data-focus>${ico("book")}Go on with the story</button>`)
            : next >= 0 ? `<button class="btn" id="advNext">${ico("next")}Next: ${esc(list[next].name)} Act ${nextAct + 1}</button>` : `<button class="btn" id="advMenu">${ico("flag")}All thirteen zones cleared</button>`}
          <button class="btn ghost" id="advAgain">Run it again</button>
          <button class="btn ghost" id="advSel" data-back>${ico("back")}${storyRun ? "Story" : "Stage select"}</button>
        </div>
      </div>`;
    const go = id => { const b = ov.querySelector(id); return b; };
    if (go("#advNext")) go("#advNext").onclick = () => { stageIdx = next; actIdx = nextAct; play(); };
    if (go("#advMenu")) go("#advMenu").onclick = () => { load3d(stageIdx); menu(); };
    setTimeout(autoFocus, 0);
    go("#advAgain").onclick = () => play();
    go("#advSel").onclick = () => { if (storyRun) { storyMenu(); return; } if (next >= 0) { stageIdx = next; actIdx = nextAct; } load3d(stageIdx); menu(); };
    if (go("#advSCont")) go("#advSCont").onclick = () => storyAfter();
    if (go("#advSAct")) go("#advSAct").onclick = () => zoneNext();
  }

  // ---------------------------------------------------------------- online: netplay
  /* Every online match is run by the room host's game (adventure-online.js holds the room).
     A BATTLE: the guests send their buttons (thirty times a second, presses counted so none is
     lost); the host plays the fight with them as their fighters' hands, and twenty times a second
     sends back all a guest needs to draw it -- each fighter's state, the shots and traps, the
     clock -- and the hits, sparks, sounds, captions and camera moves since the last time, which
     the guest plays again on its own screen. A guest's game simulates nothing in a battle. If a
     guest leaves, a CPU takes their fighter; if the host leaves, the match is over.
     A RACE (an exhibition, or a story chapter's run): everyone plays their own copy of the Act,
     sending where they are ten times a second, and sees the others as ghosts with their names
     over them; the host starts the count and keeps the finish order.
     STORY co-op: everyone sees the chapter's scene, then a battle with the guests fighting
     beside the hero (the host), or a race through the chapter's stage; then the scene after.
     A TOURNAMENT: the bracket is the host's; its players' matches are online battles that
     everyone else in the room watches, and matches between CPUs are settled at once. */
  const NP = { on: false, host: false, room: null, plan: null, me: null, kind: null, ev: [], snapT: 0, inT: 0, seq: 0,
               remote: new Map(), cnt: null, sent: null, ghosts: new Map(), gT: 0, race: null, story: null, who: null, em: null, def: null, myInp: null };
  let npDepth = 0, shotNid = 0;
  /* the host's effects, sounds and camera moves, noted (once: not the ones they set off themselves) */
  const npWrap = (k, f, map) => function (...a) {
    if (NP.on && NP.host && battle && !npDepth) NP.ev.push([k, map ? map(a) : a]);
    npDepth++; try { return f.apply(this, a); } finally { npDepth--; }
  };
  function npInstall() {
    if (npInstall.done) return; npInstall.done = true;
    burst = npWrap("burst", burst); impact = npWrap("impact", impact); flash = npWrap("flash", flash); ring = npWrap("ring", ring);
    hitSpark = npWrap("hitSpark", hitSpark); hitStop = npWrap("hitStop", hitStop); slowMo = npWrap("slowMo", slowMo);
    shakeCam = npWrap("shakeCam", shakeCam); camPunch = npWrap("camPunch", camPunch); caption = npWrap("caption", caption);
    effect = npWrap("effect", effect, a => { const b = a.slice(0, 11); if (b[10] && b[10].p) b[10] = { s: b[10].p.slot, ox: b[10].ox, oy: b[10].oy }; return b; });
    call = npWrap("call", call, a => [a[0] ? a[0].slot : -1, a[1]]);
    for (const k of Object.keys(SFX)) if (typeof SFX[k] === "function") SFX[k] = npWrap("sfx." + k, SFX[k]);
  }
  function npReplay(ev) {
    for (const [k, a] of ev) {
      try {
        if (k.startsWith("sfx.")) { const f = SFX[k.slice(4)]; if (f) f(...a); continue; }
        switch (k) {
          case "burst": burst(...a); break;
          case "impact": impact(...a); break;
          case "flash": flash(...a); break;
          case "ring": ring(...a); break;
          case "hitSpark": hitSpark(...a); break;
          case "hitStop": hitStop(...a); break;
          case "slowMo": slowMo(...a); break;
          case "shakeCam": shakeCam(...a); break;
          case "camPunch": camPunch(...a); break;
          case "caption": caption(...a); break;
          case "call": { const f = battle && battle.fs[a[0]]; if (f) call(f, a[1]); break; }
          case "effect": {
            const b = a.slice();
            if (b[10] && b[10].s != null) { const f = battle && battle.fs[b[10].s]; b[10] = f ? { p: f, ox: b[10].ox, oy: b[10].oy } : undefined; }
            effect(...b); break;
          }
        }
      } catch (e) { /* (one bad note mustn't stop the rest) */ }
    }
  }
  const resolveWho = w => w === "random" || !CAST.some(c => c.id === w) ? CAST[Math.floor(Math.random() * CAST.length)].id : w;
  const randomArena = () => { const o = openArenas(); return o.length ? o[Math.floor(Math.random() * o.length)] : 0; };
  /* the match a room's host starts: everything everyone's game needs to set it up the same */
  function npPlan(R, hostId) {
    const P = npPlanOf(R, hostId);
    if (!P.err) P.specs = R.members.filter(m => m.spec).map(m => m.id);    // (the spectators: they play nobody, and watch)
    return P;
  }
  function npPlanOf(R, hostId) {
    const mem = R.members.filter(m => !m.spec).map(m => ({ id: m.id, name: m.name, who: resolveWho(m.who), em: m.em || null, team: m.team || 0, r: m.r || 1000, uid: m.uid }));
    if (!mem.length && (R.mode === "race" || R.mode === "story")) return { err: R.mode === "race" ? "Nobody is running: an exhibition race has no CPUs, so someone has to play (or pick the grand prix, where CPUs race)." : "Story co-op needs a player: someone has to be the hero." };
    if (R.mode === "race") return { kind: "race", zone: clamp(R.zone | 0, 0, stages().length - 1), mem };
    if (R.mode === "gp") {                                // the grand prix: the room's players, CPUs in the other places
      const used = new Set(mem.map(m => m.who)), pool = CAST.map(c => c.id).filter(id => !used.has(id));
      U.shuffle(pool);
      const n = Math.max(0, 8 - mem.length), cpus = [];
      for (let k = 0; k < n; k++) cpus.push(pool[k % pool.length]);
      return { kind: "gp", cup: clamp(R.gpCup | 0, 0, GP_CUP_NAMES.length - 1), cls: GP_CLS[R.gpCls] ? R.gpCls : "gale", mem, cpus, skill: cpus.map(() => +(0.97 + Math.random() * 0.07).toFixed(3)) };
    }
    if (R.mode === "story") {
      const ep = epOf(R.ep); if (!ep) return { err: "Pick an episode first." };
      return { kind: "story", ep: R.ep, ch: clamp(R.ch | 0, 0, ep.chapters.length - 1), mem, hero: mem.some(m => m.id === hostId) ? hostId : mem[0].id };   // (the host is the hero; a spectating host's, the first player)
    }
    if (R.mode === "tourney") return { kind: "tourney", T: tourMake({ size: R.size, lvl: R.tlvl, goal: R.tgoal, arena: R.tarena, online: true,
      humans: mem.map(m => ({ name: m.name, who: m.who, em: m.em, net: m.id, uid: m.uid, r: m.r })) }) };
    const slots = mem.map(m => ({ who: m.who, net: m.id, em: m.em, name: m.name, team: m.team, r: m.r }));
    const used = new Set(slots.map(s => s.who));
    for (let k = 0; k < (R.cpu | 0) && slots.length < 4; k++) {
      let pool = CAST.filter(c => !used.has(c.id)); if (!pool.length) pool = CAST;
      const who = pool[Math.floor(Math.random() * pool.length)].id; used.add(who);
      const t0 = slots.filter(s => s.team === 0).length;
      slots.push({ who, ctl: "cpu", lvl: R.lvl, team: t0 <= slots.length - t0 ? 0 : 1 });
    }
    if (slots.length < 2) return { err: mem.length ? "A battle needs two fighters: set CPUs to 1 or more." : "Nobody is playing: set CPUs to 2 or more for the spectators to watch." };
    if (R.teams && new Set(slots.map(s => s.team)).size < 2) return { err: "Red vs Blue needs someone on each side." };
    return { kind: "battle", cfg: { kind: "battle", net: true, slots, teams: !!R.teams, arena: R.arena, rule: R.rule, goal: R.goal, time: R.time, hp: R.hp } };
  }
  function npStart(isHost, room, plan, me, late) {
    npInstall();
    npClear();
    Object.assign(NP, { on: true, host: isHost, room, plan, me, kind: plan.kind, ev: [], snapT: 0, inT: 0, seq: 0, remote: new Map(), race: null, story: null,
      who: null, em: null, def: null, cnt: { jp: 0, zp: 0, xp: 0, cp: 0, dl: 0, dr: 0 }, sent: null, lastSnap: null, spectator: false,
      watch: (plan.specs || []).includes(me), sp: null,        // (watch: a spectator of the room, playing nobody)
      late: !!late && !isHost });                              // (late: come to watch a match already under way)
    paused = false; storyRun = null; talk = null;
    host.classList.toggle("np-watching", NP.watch);
    if (plan.kind === "battle") npBattle(plan.cfg);
    else if (plan.kind === "race") npRace(plan, null);
    else if (plan.kind === "story") npStory(plan);
    else if (plan.kind === "tourney") { TOUR = plan.T; TOUR.me = null; if (NP.late) npLateWait("Catching up with the tournament…"); else tourBracket(); }
    else if (plan.kind === "gp") npGP(plan);
    if (NP.late && plan.kind !== "gp") Online.toHost({ t: "np.ws" });    // (where it's got to: the host's game says; the grand prix asks once it's loaded)
    if (root.Online) Online.setPresence();
  }
  /* ---- WATCHING A MATCH ALREADY UNDER WAY. A spectator who comes in mid-match is given the plan,
     sets its match up as anyone would, and asks the host's game where everything has got to
     (np.ws): the host answers with the battle being fought (its snapshots do the rest), the race's
     clock, who's home and where everyone is, the story's part, the tournament's bracket, or the
     grand prix's race, points and CPUs (np.wst). A match just over: back to the room, to watch
     the next. */
  function npCatch() {
    const s = { kind: NP.kind };
    if (battle) { s.cfg = Object.assign({}, battle.cfg, { arena: battle.arena }); s.over = !!battle.over; }
    if (NP.kind === "tourney" && TOUR) s.T = TOUR;
    const gh = {};
    for (const g of NP.ghosts.values()) gh[g.id] = { x: r3(g.tx), y: r3(g.ty), rf: g.rf, fin: g.fin ? 1 : 0 };
    if (player && !battle && !NP.watch && (NP.race || GPR)) gh[NP.me] = { x: r3(player.x), y: r3(player.y), rf: player._rf || ["idle", 0, 1], fin: (NP.race ? NP.race.mine != null : GPR.myFin != null) ? 1 : 0 };
    s.ghosts = gh;
    if (NP.race) { const R = NP.race; s.race = { go: !!R.go, count: r3(R.count), t: world ? r3(world.t) : 0, fin: [...R.fin], done: !!R.done }; }
    if (NP.story) s.story = { stage: NP.story.stage, act: NP.story.act == null ? null : NP.story.act };
    if (GP && GP.online) {
      const pts = {}; for (const r of GP.runners) pts[r.human ? r.netId : r.id] = GP.pts[r.id] || 0;
      s.gp = { race: GP.race, pts, phase: GPR ? (GPR.done ? "between" : "race") : mode === "setup" ? "grid" : "podium" };
      if (GPR && !GPR.done) {
        const Rr = GPR;
        s.gpr = { t: r3(world.t), cnt: Rr.count === Infinity ? null : r3(Rr.count), go: !!Rr.go, hfin: Rr.hfin || {}, seen: Rr.seen || {},
          rivals: Rr.rivals.map(v => ({ id: v.r.id, x: r3(v.x), y: r3(v.y), fin: v.fin == null ? null : r3(v.fin), shield: v.shield ? 1 : 0 })) };
      }
    }
    return s;
  }
  function npWatchSync(s) {
    if (!NP.on || !NP.late || !s) return;
    const K = NP.kind;
    if (K === "gp") return gpLateSync(s);
    NP.late = false;
    if (K === "battle") { if (!s.cfg || s.over) npLateOver(); return; }
    if (K === "tourney") { if (s.T) { TOUR = s.T; TOUR.me = null; } if (s.cfg && !s.over) npBattle(s.cfg); else tourBracket(); return; }
    if (K === "race") { if (!s.race || s.race.done) npLateOver(); else npRaceCatch(s); return; }
    if (K === "story") {
      const S = NP.story, st = s.story; if (!S || !st || st.stage === "after") return npLateOver();
      if (st.act != null) S.act = storyRun.act = st.act;
      S.stage = st.stage; S.ok = new Set();
      if (st.stage === "action") {
        if (s.cfg && !s.over) return npBattle(s.cfg);
        if (s.race && !s.race.done) { npRace(NP.plan, S); return npRaceCatch(s); }
      }
      npLateWait(st.stage === "action" ? "The players are between parts of the chapter: you'll watch the next one." : "The players are watching a scene: you'll watch what comes after it.");
    }
  }
  /* a race under way: who's home, where everyone is, and the clock (no count, unless it's still on) */
  function npRaceCatch(s) {
    const R = NP.race, r = s.race; if (!R || !r) return;
    for (const id in s.ghosts || {}) npGhost(id, s.ghosts[id]);
    for (const [id, t] of r.fin || []) { R.fin.set(id, t); const g = NP.ghosts.get(id); if (g) g.fin = true; }
    if (r.go) { R.go = true; R.count = Math.max(0, r.count || 0); R.said = R.count > 0 ? Math.ceil(R.count - 0.4) : 0; if (world) world.t = r.t || 0; if (R.count <= 0) caption(""); }
  }
  /* the grand prix: the points so far, then the race being run (its course built first: it asks
     again once it is), or the standings between races, or the podium */
  function gpLateSync(s) {
    const G = GP, g = s.gp; if (!G || !g) { NP.late = false; return npLateOver(); }
    for (const r of G.runners) G.pts[r.id] = (g.pts || {})[r.human ? r.netId : r.id] || 0;
    if (g.phase === "podium") { NP.late = false; gpEndRace(); G.race = 3; return gpPodium(); }
    if (g.phase === "between") { NP.late = false; gpEndRace(); G.race = g.race; screenOn("story"); return gpStandings(Object.assign({}, G.pts), []); }
    const cid = GPD().CUPS[G.cup].courses[g.race];
    if (!GPR || G.race !== g.race || GPR.cid !== cid) { gpEndRace(); G.race = g.race; return gpGrid(); }
    NP.late = false;
    const Rr = GPR, q = s.gpr; if (!q) return;          // (the host's still on the grid: Go comes from them)
    world.t = q.t || 0; Rr.go = !!q.go;
    Rr.count = q.cnt == null ? Infinity : Math.max(0, q.cnt);
    Rr.said = Rr.count > 0 && Rr.count !== Infinity ? Math.ceil(Rr.count - 0.4) : 0;
    if (Rr.count <= 0) caption("");
    for (const id in q.seen || {}) Rr.seen[id] = q.seen[id];
    for (const id in q.hfin || {}) Rr.seen[id] = q.hfin[id];
    for (const v of Rr.rivals) {
      const o = (q.rivals || []).find(x => x.id === v.r.id); if (!o) continue;
      if (v.q) continue;                                   // (the host's own: nothing to catch up)
      v.x = v.tx = +o.x || v.x; v.y = v.ty = +o.y || v.y; v.shield = !!o.shield; v.fin = o.fin; v.lastX = v.x;
      if (v.fin != null) Rr.fin.push({ id: v.r.id, t: v.fin });
    }
    for (const id in s.ghosts || {}) npGhost(id, s.ghosts[id]);
  }
  /* catching up: a card till the host's game answers (or till the next part starts) */
  function npLateWait(text) {
    const ov = screenOn("story");
    ov.innerHTML = `<div class="panel adv-small pop ao-wait"><div class="ao-spin"></div><p>${esc(text)}</p><div class="adv-btns"><button class="btn ghost" data-back>${ico("door")}Leave the room</button></div></div>`;
    ov.querySelector("[data-back]").onclick = () => { if (root.Online) Online.leave(); };
  }
  /* come just as it ended: back to the room, to watch the next one */
  function npLateOver() {
    NP.late = false;
    if (NP.race) clearTimeout(NP.race.timer);
    NP.race = null; if (GP) gpEndRace();
    const ov = screenOn("story");
    ov.innerHTML = `<div class="panel adv-small pop"><div class="panel-hd">${ico("eye")}Spectating</div><p class="adv-note">This match is just over: the room is getting ready for the next one. You'll watch that from the room.</p>
      <div class="adv-btns"><button class="btn" id="npBack" data-focus data-enter>${ico("back")}Back to the room</button></div></div>`;
    ov.querySelector("#npBack").onclick = () => npBackToRoom();
    autoFocus();
  }
  /* a battle: on the host, its guests' fighters steered by what they send; on a guest, a mirror */
  function npBattle(cfg) {
    const c = Object.assign({}, cfg, { slots: cfg.slots.map(s => Object.assign({}, s, { ctl: s.net ? (s.net === NP.me ? "p1" : "net") : "cpu" })) });
    NP.cnt = { jp: 0, zp: 0, xp: 0, cp: 0, dl: 0, dr: 0 }; NP.remote = new Map(); NP.lastSnap = null; NP.sent = null; NP.ev = [];
    startBattle(c);
    for (const f of battle.fs) {
      const s = c.slots[f.slot];
      f.net = s.net || null; f.netName = s.name || null; f.netR = s.r || 1000; f._used = { jp: 0, zp: 0, xp: 0, cp: 0, dl: 0, dr: 0 };
    }
    NP.spectator = !battle.fs.some(f => f.net === NP.me);
    battle.lead = battle.fs.find(f => f.net === NP.me) || battle.fs[0]; player = battle.lead;
  }
  /* the host: a guest's buttons into their fighter's hands, a press at a time */
  function npInput(f, live) {
    const I = f.inp, R = NP.remote.get(f.net), D = f._used;
    I.dash = 0;
    if (!R || !live) { I.L = I.R = I.U = I.D = I.J = I.Z = I.X = I.C = 0; I.jp = I.zp = I.xp = I.cp = 0; return; }
    const h = R.h | 0, c = R.c || [];
    I.L = h & 1 ? 1 : 0; I.R = h & 2 ? 1 : 0; I.U = h & 4 ? 1 : 0; I.D = h & 8 ? 1 : 0; I.J = h & 16 ? 1 : 0; I.Z = h & 32 ? 1 : 0; I.X = h & 64 ? 1 : 0; I.C = h & 128 ? 1 : 0;
    const take = (k, i) => { if ((c[i] | 0) > D[k]) { D[k]++; return 1; } return 0; };
    I.jp = take("jp", 0); I.zp = take("zp", 1); I.xp = take("xp", 2); I.cp = take("cp", 3);
    if (take("dl", 4)) I.dash = -1; else if (take("dr", 5)) I.dash = 1;
  }
  /* a guest: its own buttons, to the host */
  function npSendInput(dt) {
    const I = NP.myInp || (NP.myInp = newInput()), C = NP.cnt;
    readInput(I, 0);
    if (I.jp) C.jp++; if (I.zp) C.zp++; if (I.xp) C.xp++; if (I.cp) C.cp++; if (I.dash < 0) C.dl++; if (I.dash > 0) C.dr++;
    const h = I.L | I.R << 1 | I.U << 2 | I.D << 3 | I.J << 4 | I.Z << 5 | I.X << 6 | I.C << 7;
    const key = h + ":" + C.jp + ":" + C.zp + ":" + C.xp + ":" + C.cp + ":" + C.dl + ":" + C.dr;
    NP.inT += dt;
    if (key !== NP.sent || NP.inT > 0.2) { NP.sent = key; NP.inT = 0; Online.toHost({ t: "np.in", h, c: [C.jp, C.zp, C.xp, C.cp, C.dl, C.dr] }); }
  }
  /* what each fighter's picture needs, and the HUD (numbers to three places) */
  const NPF = ["x", "y", "vx", "vy", "face", "ground", "state", "curl", "rev", "hp", "hpMax", "burst", "lives", "kos", "score", "downs", "dealt", "landed", "ko", "koT", "out", "elim",
    "whiteT", "hideT", "inv", "wallT", "floorT", "smashT", "spike", "juggle", "guardT", "healing", "flyLeft", "dive", "launchT", "dblT", "floatT", "balT", "catchT", "landT",
    "sinceHit", "star", "shield", "hh", "team", "callT", "callTx", "callN", "st", "dead"];
  const NPF_DEF = { state: "run", callTx: "", face: 1 };
  const r3 = v => typeof v === "number" ? Math.round(v * 1000) / 1000 : v;
  function npSerF(f) {
    const o = {};
    for (const k of NPF) { const v = f[k]; if (v !== undefined && v !== null && v !== 0 && v !== false && v !== "") o[k] = r3(v); }
    if (f.mv) o.mv = { name: f.mv.name, t: r3(f.mv.t), fps: f.mv.fps, air: f.mv.air ? 1 : 0, chase: f.mv.chase ? 1 : 0 };
    if (f.sp) o.sp = { body: f.sp.body, t: r3(f.sp.t), fps: f.sp.fps, windup: f.sp.windup || 0, spin: r3(f.sp.spin || 0), shield: f.sp.shield ? 1 : 0, kind: f.sp.kind, air: f.sp.air ? 1 : 0 };
    if (f.tor) o.tor = { body: f.tor.body, t: r3(f.tor.t), fps: f.tor.fps, from: f.tor.from, to: f.tor.to };
    if (f.er) o.er = { body: f.er.body, t: r3(f.er.t), fps: f.er.fps, from: f.er.from, to: f.er.to };
    o.cmb = { n: f.cmb.n, dmg: Math.round(f.cmb.dmg) };
    const I = f.inp; o.ib = I.L | I.R << 1 | I.J << 4;
    return o;
  }
  const npSerS = s => [s.nid, s.who, s.fx, r3(s.x), r3(s.y), s.face, r3(s.t), r3(s.life), r3(s.life0), s.loop ? 1 : 0, s.mid ? 1 : 0, s.k || 0, s.ghost || 0, s.range || 0, s.trail || 0, r3(s.vx || 0), r3(s.vy || 0)];
  const npSerT = t => [t.nid, t.who, t.kind, r3(t.x), r3(t.y), t.face, r3(t.t), r3(t.life), t.grounded ? 1 : 0, t.flies ? 1 : 0, r3(t.landT || 0), t.faint ? 1 : 0];
  function npHostSend(dt) {
    const B = battle; if (!B || !NP.on || !NP.host) return;
    NP.snapT += dt; if (NP.snapT < 0.05) return; NP.snapT = 0;
    const w = world;
    Online.toAll({ t: "np.s", q: ++NP.seq, bt: r3(B.t), c: r3(B.clock), lv: B.live ? 1 : 0, ov: B.over ? 1 : 0, in: r3(B.intro), w: B.winner == null ? null : B.winner,
      f: B.fs.map(npSerF), s: w.shots.filter(s => !s.gone).map(npSerS), r: w.traps.filter(t => !t.gone).map(npSerT), e: NP.ev }, true);
    NP.ev = [];
  }
  function npApplySnap(d) {
    const B = battle; if (!B || !world) return;
    if (NP.lastSnap && d.q <= NP.lastSnap.q) return;
    NP.lastSnap = d; NP.snapAt = performance.now();
    B.clock = d.c; B.live = !!d.lv; B.intro = d.in;
    if (d.ov && !B.over) { B.over = true; B.winner = d.w; }
    d.f.forEach((o, i) => {
      const f = B.fs[i]; if (!f) return;
      for (const k of NPF) if (k !== "x" && k !== "y") f[k] = o[k] !== undefined ? o[k] : NPF_DEF[k] !== undefined ? NPF_DEF[k] : 0;
      f._tx = o.x || 0; f._ty = o.y || 0; f._tvx = o.vx || 0; f._tvy = o.vy || 0;
      if (!f._snapped) { f.x = f._tx; f.y = f._ty; f._snapped = true; }
      f.mv = o.mv || null; f.sp = o.sp || null; f.tor = o.tor || null; f.er = o.er || null; f.cmb = o.cmb || { n: 0, dmg: 0 };
      const ib = o.ib | 0; f.inp.L = ib & 1 ? 1 : 0; f.inp.R = ib & 2 ? 1 : 0; f.inp.J = ib & 16 ? 1 : 0;
      f.alive = !f.ko && !f.out; f.hh = f.hh || f.c.h;
    });
    npMirror(world.shots, d.s, a => ({ nid: a[0], who: a[1], fx: a[2], x: a[3], y: a[4], face: a[5], t: a[6], life: a[7], life0: a[8], loop: !!a[9], mid: !!a[10],
      k: a[11] || undefined, ghost: a[12] || undefined, range: a[13] || undefined, trail: a[14] || undefined, vx: a[15], vy: a[16] }), s => makeCard(s.who, s.ghost ? "ghost" : "fx"));
    npMirror(world.traps, d.r, a => ({ nid: a[0], who: a[1], kind: a[2], x: a[3], y: a[4], face: a[5], t: a[6], life: a[7], grounded: !!a[8], flies: !!a[9], landT: a[10], faint: !!a[11] }),
      t => makeCard(t.who, t.faint ? "faint" : "fx"));
    npReplay(d.e || []);
  }
  function npMirror(list, rows, mk, card) {
    const seen = new Set();
    for (const a of rows || []) {
      const o = mk(a); seen.add(o.nid);
      const x = list.find(z => z.nid === o.nid && !z.gone);
      if (!x) { const n = Object.assign(o, { gone: false, seed: null }); n.card = card(n); world.group.add(n.card); list.push(n); }
      else Object.assign(x, o);
    }
    for (const x of list) if (!x.gone && x.nid != null && !seen.has(x.nid)) { x.gone = true; world.group.remove(x.card); x.card.geometry.dispose(); }
    for (let i = list.length - 1; i >= 0; i--) if (list[i].gone) list.splice(i, 1);
  }
  /* a guest's battle frame: its buttons out, the fighters eased toward where the host has them
     (a little ahead, by their speed, for the time since), the moves' clocks running on */
  function npGuestTick(dt) {
    const B = battle, w = world;
    w.t += dt; B.t += dt;
    stopT = Math.max(0, stopT - dt); slowT = Math.max(0, slowT - dt);
    if (!NP.spectator && B.live && !B.over) npSendInput(dt);
    const k = Math.min(1, dt * 16), ahead = Math.min(0.1, (performance.now() - (NP.snapAt || 0)) / 1000);
    for (const f of B.fs) {
      if (f._tx == null) continue;
      const tx = f._tx + f._tvx * ahead, ty = Math.max(f.ground ? f._ty : -9, f._ty + f._tvy * ahead);
      if (Math.abs(tx - f.x) > 3 || Math.abs(ty - f.y) > 3) { f.x = tx; f.y = ty; } else { f.x += (tx - f.x) * k; f.y += (ty - f.y) * k; }
      if (f.mv) f.mv.t += dt; if (f.sp) f.sp.t += dt; if (f.tor) f.tor.t += dt; if (f.er) f.er.t += dt;
    }
    for (const s of w.shots) if (!s.gone) { s.x += (s.vx || 0) * dt; s.y += (s.vy || 0) * dt; s.t += dt; }
    for (const t of w.traps) if (!t.gone) t.t += dt;
    worldStep(dt);
  }
  /* the end: the host's numbers for everyone, and the results */
  function npBattleOver(B) {
    if (NP.host) Online.toAll({ t: "np.end", w: B.winner == null ? null : B.winner,
      f: B.fs.map(f => ({ score: f.score, kos: f.kos, downs: f.downs, dealt: Math.round(f.dealt), lives: f.lives, team: f.team, hp: Math.round(f.hp) })) }, true);
    npEndOf(B);
  }
  function npEndOf(B) {
    if (B.cfg.tour) return tourBattleOver(B);
    if (B.cfg.story) return npStoryBattleOver(B);
    npResults(B);
  }
  /* "GuestB wins" (the player, not the character, when one person won it) */
  function npWinLine(B) {
    const w = B.fs.filter(f => f.team === B.winner);
    return !B.teams && w.length === 1 && w[0].netName ? w[0].netName + " wins" : winnerLine(B.winner).replace(/!$/, "");
  }
  function npResults(B) {
    mode = "results"; bgm("competition-results");
    host.querySelector(".adv-hud").classList.remove("on");
    const me = B.fs.find(f => f.net === NP.me);
    let rec = null;
    if (me && root.Auth && Auth.user) {
      if (B.winner === me.team && saveData) { PROG().wins++; save(saveData); checkUnlocks(); }      // (online wins count toward Shadow's challenge too)
      const rivals = B.fs.filter(f => f.team !== me.team && f.net);
      rec = Auth.record({ kind: "battle", won: B.winner === me.team, kos: me.kos, who: me.c.id, online: true, oppR: rivals.length ? rivals.reduce((t, f) => t + f.netR, 0) / rivals.length : null });
    }
    const order = B.fs.slice().sort((a, b) => (b.team === B.winner) - (a.team === B.winner) || b.score - a.score || b.lives - a.lives || b.dealt - a.dealt);
    const ov = host.querySelector(".adv-ov");
    ov.innerHTML = `
      <div class="panel adv-small adv-bres pop">
        <div class="panel-hd gold">${ico("trophy")}${B.winner == null ? "A draw" : esc(npWinLine(B))}</div>
        <div class="adv-board">
          <div class="adv-row adv-bhd"><span></span><em>KOs</em><em>Down</em><em>Damage</em></div>
          ${order.map(f => `
            <div class="adv-row adv-frow ${f.team === B.winner ? "win" : ""}">
              <span><canvas width="44" height="40" data-face="${f.c.id}"></canvas><b>${esc(f.netName || f.c.name)}</b><i style="--tc:${tagCol(f)}">${f.net ? esc(f.c.name) : tagText(f)}</i></span>
              <b class="num">${f.kos}</b><b class="num">${f.downs}</b><b class="num">${Math.round(f.dealt)}</b>
            </div>`).join("")}
        </div>
        ${rec ? `<p class="adv-note">+${rec.xp} XP${rec.delta != null ? ` · rating ${rec.delta >= 0 ? "+" : ""}${rec.delta} (${rec.rating})` : ""}${rec.up ? ` · level ${rec.lv}!` : ""}</p>` : ""}
        <div class="adv-btns"><button class="btn" id="npBack" data-focus data-enter>${ico("back")}Back to the room</button></div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    ov.querySelector("#npBack").onclick = () => npBackToRoom();
    setTimeout(autoFocus, 0);
  }
  function npClear() {
    for (const g of NP.ghosts.values()) { if (world) world.group.remove(g.spr); }
    NP.ghosts.clear();
    const t = host && host.querySelector(".np-tags"); if (t) t.remove();
    const p = host && host.querySelector(".np-pause"); if (p) p.remove();
    const s = host && host.querySelector(".np-spec"); if (s) s.remove();
    if (host) host.classList.remove("np-watching", "np-free");
  }
  function npBackToRoom() {
    if (NP.race) clearTimeout(NP.race.timer);
    NP.on = false; npClear(); endBattle(); storyRun = null; paused = false; NP.race = null; NP.story = null; if (GP && GP.online) { gpEndRace(); GP = null; }
    if (NP.host && root.Online) Online.matchEnded();
    if (root.AdventureOnline) AdventureOnline.backToRoom();
  }
  /* out of it (the room gone, or left) */
  function npStop() {
    if (!NP.on) return;
    if (NP.race) clearTimeout(NP.race.timer);
    NP.on = false; npClear(); endBattle(); storyRun = null; paused = false; NP.race = null; NP.story = null; if (GP && GP.online) { gpEndRace(); GP = null; }
    if (TOUR && TOUR.online) TOUR = null;
  }
  /* a fighter's name tags again (a player left and a CPU took over) */
  function retag(f) {
    const h = host.querySelector(".adv-hud"); if (!h) return;
    const a = h.querySelector(`.adv-fc[data-i="${battle.fs.indexOf(f)}"] .adv-fc-nm i`), t = h.querySelectorAll(".adv-tags:not(.np-tags) .adv-tag")[battle.fs.indexOf(f)];
    if (a) a.innerHTML = tagText(f); if (t) t.innerHTML = tagText(f);
  }
  function npMemberLeft(id, name) {
    if (!NP.on) return;
    if (battle) { const f = battle.fs.find(x => x.net === id); if (f) { f.net = null; f.ctl = "cpu"; f.netName = (f.netName || f.c.name) + " (CPU)"; caption(name + " left: a CPU takes over"); retag(f); } }
    const g = NP.ghosts.get(id); if (g) { world.group.remove(g.spr); NP.ghosts.delete(id); }
    if (NP.race && NP.host) npRaceCheck();
    if (NP.story && NP.host && NP.story.stage === "before") npStoryCheck();
    if (GP && GP.online && NP.host) { if (GPR && !GPR.go) gpNetReady(NP.me); if (GPR && Object.keys(GPR.hfin || {}).length) { const here = GP.runners.filter(r => r.human && (r.me || (NP.room && NP.room.members.some(m => m.id === r.netId && m.id !== id)))); if (here.every(r => GPR.hfin[r.netId] != null)) gpNetResult(); } }
    if (TOUR && TOUR.online) TOUR.ents.forEach(e => { if (e.net === id) { e.net = null; e.cpu = true; e.lvl = 1; e.name += " (CPU)"; } });
  }
  function npChatLine(c) { if (root.AdventureOnline) AdventureOnline.toast((c.sys ? "" : c.n + ": ") + (c.sys || c.x), "msg", 3600); }
  function npHostGot(id, d) {
    if (!NP.on) return;
    switch (d.t) {
      case "np.in": NP.remote.set(id, d); break;
      case "np.g": Online.toAll(Object.assign({}, d, { id }), true); npGhost(id, d); break;
      case "np.fin": npRaceFin(id, +d.time || 0); break;
      case "np.ok": if (NP.story) { NP.story.ok.add(id); npStoryCheck(); } break;
      case "np.gok": gpNetReady(id); break;
      case "np.gfin": gpNetFin(id, +d.time || 9999); break;
      case "np.pw": Online.toAll(Object.assign({}, d, { by: id }), true); gpNetPw(Object.assign({}, d, { by: id })); break;
      case "np.ws": Online.toMember(id, { t: "np.wst", s: npCatch() }); break;      // a late spectator: where it's got to
    }
  }
  function npGuestGot(d) {
    if (!NP.on && d.t !== "np.tour") return;
    switch (d.t) {
      case "np.s": npApplySnap(d); break;
      case "np.end": {
        const B = battle; if (!B) break;
        d.f.forEach((o, i) => { const f = B.fs[i]; if (f) Object.assign(f, o); });
        B.over = true; B.winner = d.w; npEndOf(B); break;
      }
      case "np.g": npGhost(d.id, d); break;
      case "np.gc": gpNetCpu(d); break;
      case "np.go": npRaceGo(); break;
      case "np.fn": npRaceNote(d.id, d.time); break;
      case "np.rr": npRaceResults(d.res); break;
      case "np.sgo": npStoryGo(d); break;
      case "np.tour": if (NP.on) { TOUR = d.T; tourBracket(); } break;
      case "np.tm": if (NP.on) { TOUR = d.T; npBattle(d.cfg); } break;
      case "np.ggo": gpNetGo(); break;
      case "np.pw": gpNetPw(d); break;
      case "np.gres": if (GPR) { if (mode !== "goal" && mode !== "play") mode = "goal"; gpResults(d.res); } break;
      case "np.gnext": gpNetNext(); break;
      case "np.wst": npWatchSync(d.s); break;
    }
  }
  /* the pause menu, online: the match goes on behind it */
  function npPause() {
    let p = host.querySelector(".np-pause");
    if (p) { p.remove(); return; }
    p = document.createElement("div"); p.className = "np-pause";
    p.innerHTML = `<div class="panel adv-small pop"><div class="panel-hd">${ico("info")}Online match</div><p class="adv-note">The match goes on while this is open.</p>
      <div class="adv-btns"><button class="btn" data-k="res">${ico("next")}Keep playing</button><button class="btn ghost" data-k="out">${ico("door")}Leave the room</button></div></div>`;
    host.append(p);
    p.querySelector('[data-k="res"]').onclick = () => p.remove();
    p.querySelector('[data-k="out"]').onclick = () => { p.remove(); if (root.Online) Online.leave(); };
    if (NP.watch) { p.querySelector(".panel-hd").innerHTML = `${ico("eye")}Spectating`; p.querySelector('[data-k="res"]').innerHTML = `${ico("next")}Keep watching`; }
  }

  /* ---- SPECTATING. A room's spectator (NP.watch) plays nobody, and nor, in a tournament's match
     or a story fight, does a player who isn't in it (NP.spectator). In a battle the camera frames
     the whole arena, as ever, or follows one fighter; in a race or the grand prix it follows any
     runner -- a player's ghost or a CPU -- or flies free along the course. Left and Right: the one
     before or after; Z (or Jump): the whole arena / the free camera, and back; in the free camera
     the arrows move it, and X comes back to the runners. A bar along the bottom says who it is.
     (In a race the spectator's game still has a runner, for the camera to follow: never seen, and
     put each frame where the one watched is.) */
  const SPI = {}, specTap = {};                          // (the spectator's buttons: keys, a pad, the touch bar; the keys tapped since the last frame)
  const npWatching = () => !!(NP.on && (NP.watch || (battle && NP.spectator))) || !!(battle && battle.cfg && battle.cfg.spec);   // (offline: a tournament's CPU match you watch)
  function npFollowed() {
    const S = NP.sp; if (!battle || !S || S.view !== "follow" || !npWatching()) return null;
    return battle.fs.find(f => "f" + f.slot === S.key) || null;
  }
  /* who there is to watch, in order: { key, x, y, face, name, sub } */
  function specList() {
    if (battle) return battle.fs.filter(f => !f.out).map(f => ({ key: "f" + f.slot, x: f.x, y: f.y, face: f.face, name: f.netName || f.c.name,
      sub: f.netName ? f.c.name : f.ctl === "cpu" ? "CPU" : f.c.name }));
    const out = [];
    if (GP && GPR) {
      const ord = gpOrder(), place = id => ord.findIndex(o => o.id === id) + 1;
      for (const r of GP.runners) {
        if (r.human) { const g = NP.ghosts.get(r.netId); if (g) out.push({ key: r.id, x: g.x, y: g.y, face: (g.rf || [])[2] || 1, name: r.name, sub: castOf(r.who).name + " · " + ORD(place(r.id)) }); }
        else { const v = gpRunner(r.id); if (v) out.push({ key: r.id, x: v.x, y: v.y, face: v.face || 1, name: r.name, sub: "CPU · " + ORD(place(r.id)) }); }
      }
      return out;
    }
    const story = NP.race && NP.race.story;
    for (const m of (NP.plan && NP.plan.mem) || []) {
      const g = NP.ghosts.get(m.id); if (!g) continue;
      const who = story && m.id === NP.plan.hero ? story.ch.who : m.who;
      out.push({ key: m.id, x: g.x, y: g.y, face: (g.rf || [])[2] || 1, name: m.name, sub: castOf(who).name + (g.fin ? " · home" : "") });
    }
    return out;
  }
  function npSpecTick(dt) {
    const what = battle || GPR || NP.race;
    let S = NP.sp;
    if (!S || S.what !== what) { S = NP.sp = { what, view: battle ? "all" : "follow", key: S && !battle && S.view !== "all" ? S.key : null, fx: player ? player.x : 0, fy: player ? player.y : 0, L: 0, R: 0, bar: "" }; for (const k in specTap) specTap[k] = 0; }
    readInput(SPI, 0);
    const tap = Object.assign({}, specTap); for (const k in specTap) specTap[k] = 0;
    const L = (SPI.L && !S.L) || tap.L, R = (SPI.R && !S.R) || tap.R; S.L = SPI.L; S.R = SPI.R;
    const list = specList(), n = list.length, cam = SPI.zp || SPI.jp || tap.Z || tap.J;
    if (tap.X) SPI.xp = 1;
    const step = d => { const i = S.view === "follow" ? list.findIndex(o => o.key === S.key) : -1; S.view = "follow"; S.key = list[i < 0 ? (d > 0 ? 0 : n - 1) : (i + d + n) % n].key; };
    if (battle) {
      if (cam) { S.view = S.view === "all" ? "follow" : "all"; if (S.view === "follow" && !list.some(o => o.key === S.key) && n) S.key = list[0].key; }
      else if ((L || R) && n) step(R ? 1 : -1);
      else if (SPI.xp && S.view === "follow") S.view = "all";
      if (S.view === "follow" && !list.some(o => o.key === S.key)) S.view = "all";     // (they're out of it)
    } else {
      const p = player;
      if (cam || (SPI.xp && S.view === "free")) {
        if (S.view === "free") {                         // back to the runners: the one nearest where the camera is
          S.view = "follow"; let best = null, bd = 1e9;
          for (const o of list) { const d = Math.abs(o.x - S.fx) + Math.abs(o.y - S.fy) * 0.5; if (d < bd) { bd = d; best = o; } }
          if (best) S.key = best.key;
        } else if (cam) { S.view = "free"; S.fx = p.x; S.fy = p.y; }
      } else if (S.view === "free") {
        S.fx = clamp(S.fx + (SPI.R - SPI.L) * 20 * dt, 2, world.W - 2); S.fy = clamp(S.fy + (SPI.U - SPI.D) * 12 * dt, 0, H - 4);
      } else if ((L || R) && n) step(R ? 1 : -1);
      if (S.view === "follow" && !list.some(o => o.key === S.key) && n) S.key = list[0].key;
      /* the runner nobody sees, where the camera is to be */
      const o = S.view === "follow" ? list.find(q => q.key === S.key) : null;
      const x = o ? o.x : S.view === "free" ? S.fx : p.x, y = o ? o.y : S.view === "free" ? S.fy : p.y;
      if (Math.abs(x - p.x) < 8 && dt > 0) p.vx = clamp(lerp(p.vx || 0, (x - p.x) / dt, 0.2), -30, 30);   // (a cut to someone else: no speed)
      p.x = x; p.y = y; if (o) p.face = o.face < 0 ? -1 : 1;
      p.vy = 0; p.ground = true; p.inv = 99; p.dead = 0; p.state = "run"; p.curl = false;
    }
    host.classList.toggle("np-free", S.view === "free");
    npSpecBar(S, list);
  }
  /* the bar along the bottom: who's being watched, and the keys (on a touch screen, buttons) */
  function npSpecBar(S, list) {
    const h = host.querySelector(".adv-hud"); if (!h) return;
    let el = h.querySelector(".np-spec");
    if (!el) {
      el = document.createElement("div"); el.className = "np-spec";
      el.innerHTML = `<div class="np-spec-t"><i>${ico("eye")}Spectating</i><b></b><small></small></div><p class="np-spec-k"></p>` +
        (TOUCH ? `<div class="np-spec-b"><button data-t="L" aria-label="The one before">${ico("back")}</button><button data-t="U" class="fv up" aria-label="Up">${ico("down")}</button>` +
          `<button data-t="Z" class="cam" aria-label="Change the camera">${ico("eye")}</button><button data-t="D" class="fv" aria-label="Down">${ico("down")}</button><button data-t="R" aria-label="The one after">${ico("next")}</button></div>` : "");
      h.append(el); wirePad(el); S.bar = "";
    }
    const o = S.view === "follow" ? list.find(q => q.key === S.key) : null, two = `${td("L")}${td("R")}`;
    let t, sub, k;
    if (battle) {
      if (o) { t = o.name; sub = o.sub; k = `${two} switch · ${tk("Z")} the whole arena`; }
      else { t = "The whole arena"; sub = list.length + " in the fight"; k = `${two} follow a fighter`; }
    } else if (S.view === "free") { t = "Free camera"; sub = "Anywhere on the course"; k = `${td("L")}${td("R")}${td("U")}${td("D")} move · ${tk("Z")} back to the runners`; }
    else if (o) { t = o.name; sub = o.sub; k = `${two} switch runner · ${tk("Z")} free camera`; }
    else { t = "Waiting for the runners…"; sub = ""; k = ""; }
    const key = t + "|" + sub + "|" + k + "|" + S.view;
    if (S.bar === key) return;
    S.bar = key;
    el.querySelector("b").textContent = t; el.querySelector("small").textContent = sub;
    el.querySelector(".np-spec-k").innerHTML = TOUCH ? "" : k;
    el.classList.toggle("free", S.view === "free");
    /* who's being watched: their card in a battle, their face on the grand prix's strip */
    h.querySelectorAll(".adv-fc.watch, .gp-strip span.watch").forEach(x => x.classList.remove("watch"));
    if (o && battle) { const f = battle.fs.find(q => "f" + q.slot === o.key), c = f && h.querySelector(`.adv-fc[data-i="${battle.fs.indexOf(f)}"]`); if (c) c.classList.add("watch"); }
    if (o && GP && GPR) { const i = GP.runners.findIndex(r => r.id === o.key), s = h.querySelector(`[data-gs="${i}"]`); if (s) s.classList.add("watch"); }
  }

  /* ---- a race: everyone their own copy, the others as ghosts */
  function npRace(plan, story) {
    const meM = plan.mem.find(m => m.id === NP.me) || plan.mem[0];                 // (a spectator: nobody's -- the runner made is never seen)
    NP.who = story && NP.me === plan.hero ? story.ch.who : meM.who; NP.em = meM.em;
    NP.def = story ? (story.ch.kind === "zone" ? actDef(stageAt(story.ch.zone), story.act || 0) : story.ch.kind === "race" ? raceDef(stageAt(story.ch.zone)) : storyDef(story.ch)) : actDef(plan.zone, 0);
    NP.race = { fin: new Map(), go: false, count: 0, story, mine: null, done: false, timer: null, said: -1 };
    play();
    world.played = true; world.t = 0;
    caption("Get ready…", true);
    if (NP.host) setTimeout(() => { if (NP.on && NP.race && !NP.race.go) { Online.toAll({ t: "np.go" }, true); npRaceGo(); } }, 1600);
  }
  function npRaceGo() { const R = NP.race; if (!R || R.go) return; R.go = true; R.count = 3.4; R.said = 4; }
  /* the count (nobody moves till Go), and where you are, ten times a second */
  function npRaceTick(dt) {
    const R = NP.race; if (!R) return;
    if (R.go && R.count > 0) {
      R.count -= dt;
      const n = Math.ceil(R.count - 0.4);
      if (n !== R.said) { R.said = n; if (n > 0) { caption(String(n), true); SFX.blip ? SFX.blip() : SFX.pop(); } else { caption("Go!"); SFX.dash(); world.t = 0; } }
    }
    NP.gT += dt;
    if (NP.gT >= 0.1 && player && R.go && !NP.watch) {               // (a spectator runs nowhere)
      NP.gT = 0;
      const p = player, d = { t: "np.g", x: r3(p.x), y: r3(p.y), rf: p._rf || ["idle", 0, 1], fin: R.mine != null ? 1 : 0 };
      if (NP.host) { Online.toAll(Object.assign({ id: NP.me }, d), true); } else Online.toHost(d);
    }
  }
  const npHold = () => !!(NP.on && NP.race && (!NP.race.go || NP.race.count > 0.4));
  function npGhost(id, d) {
    if (id === NP.me || !world || !NP.on) return;
    let g = NP.ghosts.get(id);
    if (!g) {
      const mem = (NP.plan.mem || []).find(m => m.id === id); if (!mem) return;
      const hero = NP.race && NP.race.story && id === NP.plan.hero;
      const c = hero ? castOf(NP.race.story.ch.who) : mem.who === "emerl" ? emerlCast(mem.em) : castOf(mem.who);
      const sheet = c.sheet || c.id;
      const spr = makeCard(sheet, "ghost"); world.group.add(spr);
      g = { id, name: mem.name, sheet, spr, x: +d.x || 0, y: +d.y || 0, tx: +d.x || 0, ty: +d.y || 0, rf: d.rf, fin: false };
      NP.ghosts.set(id, g);
    }
    g.tx = +d.x || 0; g.ty = +d.y || 0; g.rf = Array.isArray(d.rf) ? d.rf : g.rf; g.fin = !!d.fin;
  }
  function npDrawGhosts(dt) {
    for (const g of NP.ghosts.values()) {
      const k = Math.min(1, dt * 12);
      g.x += (g.tx - g.x) * k; g.y += (g.ty - g.y) * k;
      if (Math.abs(g.tx - g.x) > 6 || Math.abs(g.ty - g.y) > 6) { g.x = g.tx; g.y = g.ty; }
      const rf = g.rf || ["idle", 0, 1], L = framesOf(g.sheet, rf[0]) || framesOf(g.sheet, "idle");
      g.spr.visible = !!L;
      if (L) setFrame(g.spr, framesOf(g.sheet, rf[0]) ? rf[0] : "idle", Math.min(rf[1] | 0, L.length - 1), rf[2] || 1, g.x, g.y);
      if (!g.fin && (NP.race || GPR) && !battle) ghostTouch(g, g.x, g.y, rf);
    }
  }
  /* Someone seen here but run elsewhere -- another player's ghost, or on a guest's screen the
     host's CPU -- still takes the rings it runs through, lights the Star Posts it passes, spins the
     goal post, takes the Red Rings it touches, and breaks the monitors and badniks it comes down
     on or rolls into, as it did where it's run. */
  function ghostTouch(g, x, y, rf) {
    const w = world; if (!w || (mode !== "play" && mode !== "goal")) return;
    const ball = !!(rf && /^(spin|roll|ball|rev|homing)/.test(rf[0]));
    const keep = cpuNow; cpuNow = { p: { x, y } };          // (heard as a CPU is, by how near; nothing of it on your HUD)
    for (let i = Math.max(0, Math.floor(x) - 2); i <= Math.floor(x) + 2; i++) for (const k of (w.ringCol && w.ringCol[i]) || []) if (!k.got && Math.abs(k.x - x) < 0.66 && k.y + 0.73 > y && k.y - 0.03 < y + 1) { k.got = true; burst(k.x, k.y + 0.4, [0xfff3a0, 0xffffff], 4, 2); SFX.coin(); }
    for (const k of w.checks) if (x >= k.x - 0.3 && !(k.by && k.by.has(g))) { (k.by = k.by || new Set()).add(g); if (!k.on) { k.on = true; k.m.geometry = propGeo("poleDone"); } k.spin = 1; SFX.check(); }
    if (w.goal && x >= w.goal.x && !g.atGoal) { g.atGoal = true; if (!w.def.story) w.goal.spin = 2.6; }
    for (const e of w.powers || []) if (!(e.back > 0) && Math.abs(x - e.x) < 0.75 && y < e.y + 0.8 && y + 1 > e.y - 0.3) { e.back = 4; e.m.visible = false; burst(e.x, e.y + 0.4, [0xe42630, 0xffffff, 0xffd21a], 8, 4); }
    for (const e of w.ents) if (e.t === "monitor" && !e.gone && Math.abs(e.x - x) < 0.7 && y < e.y + 0.95 && y + 1 > e.y && (ball || y > e.y + 0.5)) {
      e.gone = true; e.m.visible = false; if (ITEMS) effect("items", "smoke", e.x, e.y + 0.45, 1, 16, true, "fx", 0.9); SFX.pop();
    }
    if (ball) for (const e of w.enemies) if (e.alive && !e.hidden && !e.guard && Math.abs(e.x - x) < e.w / 2 + 0.3 && e.y < y + 1 && e.y + e.h > y) defeat(e);
    cpuNow = keep;
  }
  /* their names over the ghosts */
  function npTags() {
    if (!NP.ghosts.size || !camera) return;
    let box = host.querySelector(".np-tags");
    if (!box) { box = document.createElement("div"); box.className = "np-tags adv-tags"; host.append(box); }
    const b = host.querySelector(".adv-3d"), W = b.clientWidth, Hh = b.clientHeight;
    camera.updateMatrixWorld();
    for (const g of NP.ghosts.values()) {
      let el = box.querySelector(`[data-g="${g.id}"]`);
      if (!el) { el = document.createElement("span"); el.className = "adv-tag np-gtag"; el.dataset.g = g.id; el.innerHTML = esc(g.name) + pingTag(g.id); box.append(el); }
      TV.set(g.x, g.y + 1.45, 0).project(camera);
      const sx = Math.round((TV.x + 1) / 2 * W), sy = Math.round((1 - TV.y) / 2 * Hh), off = TV.z > 1 || sx < -40 || sx > W + 40;
      el.style.display = off ? "none" : "";
      el.style.transform = `translate(${sx}px,${sy}px) translate(-50%,-100%)`;
      el.classList.toggle("fin", g.fin);
    }
  }
  /* home: your time to the host; a wait for the others */
  function npFinished(time) {
    const R = NP.race; if (!R || R.mine != null) return;
    R.mine = time;
    if (NP.host) npRaceFin(NP.me, time); else Online.toHost({ t: "np.fin", time });
    setTimeout(() => { if (NP.on && NP.race && !NP.race.done) npRaceWait(); }, 1800);
  }
  function npRaceFin(id, time) {
    const R = NP.race; if (!R || R.done || R.fin.has(id)) return;
    R.fin.set(id, time);
    Online.toAll({ t: "np.fn", id, time }, true); npRaceNote(id, time);
    npRaceCheck();
  }
  function npRaceCheck() {
    const R = NP.race; if (!R || R.done) return;
    const here = NP.plan.mem.filter(m => NP.room.members.some(x => x.id === m.id) || m.id === NP.me);
    if (here.every(m => R.fin.has(m.id))) npRaceDone();
    else if (R.fin.size && !R.timer) R.timer = setTimeout(npRaceDone, R.story ? 30000 : 45000);
  }
  function npRaceDone() {
    const R = NP.race; if (!R || R.done) return; clearTimeout(R.timer);
    const res = NP.plan.mem.map(m => ({ id: m.id, name: m.name, who: m.who, time: R.fin.has(m.id) ? R.fin.get(m.id) : null }))
      .sort((a, b) => (a.time == null) - (b.time == null) || (a.time || 0) - (b.time || 0));
    Online.toAll({ t: "np.rr", res }, true); npRaceResults(res);
  }
  function npRaceNote(id, time) {
    const R = NP.race; if (!R) return; R.fin.set(id, time);
    const g = NP.ghosts.get(id); if (g) g.fin = true;
    if (id !== NP.me) { const m = NP.plan.mem.find(x => x.id === id); if (m) caption(m.name + " is home: " + fmt(time)); }
    if (R.mine != null && !R.done) npRaceWait();
  }
  function npRaceWait() {
    const R = NP.race; if (!R || R.done || mode === "results") return;
    const ov = host.querySelector(".adv-ov");
    const rows = NP.plan.mem.map(m => ({ m, t: R.fin.get(m.id) })).sort((a, b) => (a.t == null) - (b.t == null) || (a.t || 0) - (b.t || 0));
    ov.innerHTML = `
      <div class="panel adv-small pop np-wait">
        <div class="panel-hd gold">${ico("flag")}${R.story ? "You made it" : "Finished: " + fmt(R.mine)}</div>
        <div class="np-rlist">${rows.map((r, i) => `<p class="${r.m.id === NP.me ? "me" : ""}"><em>${r.t != null ? i + 1 : "-"}</em><b>${esc(r.m.name)}</b><span>${r.t != null ? fmt(r.t) : "running…"}</span></p>`).join("")}</div>
        <p class="adv-note">Waiting for the others to get home.</p>
      </div>`;
  }
  function npRaceResults(res) {
    const R = NP.race; if (!R) return;
    R.done = true; clearTimeout(R.timer);
    if (R.story) { npStoryRaced(R.story); return; }
    mode = "results"; bgm("competition-results");
    host.querySelector(".adv-hud").classList.remove("on");
    const place = res.findIndex(r => r.id === NP.me), won = place === 0 && res[0].time != null;
    const rec = root.Auth && Auth.user && !NP.watch ? Auth.record({ kind: "race", won, online: true }) : null;   // (watched: not on your record)
    const ov = host.querySelector(".adv-ov");
    ov.innerHTML = `
      <div class="panel adv-small adv-bres pop">
        <div class="panel-hd gold">${ico("trophy")}${res[0] && res[0].time != null ? esc(res[0].name) + " wins the race" : "Nobody finished"}</div>
        <div class="np-rlist big">${res.map((r, i) => `<p class="${r.id === NP.me ? "me" : ""}"><em>${r.time != null ? i + 1 : "-"}</em><canvas width="44" height="40" data-face="${esc(r.who)}"></canvas><b>${esc(r.name)}</b><span>${r.time != null ? fmt(r.time) : "didn't finish"}</span></p>`).join("")}</div>
        ${rec ? `<p class="adv-note">+${rec.xp} XP${rec.up ? ` · level ${rec.lv}!` : ""}</p>` : ""}
        <div class="adv-btns"><button class="btn" id="npBack" data-focus data-enter>${ico("back")}Back to the room</button></div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    ov.querySelector("#npBack").onclick = () => npBackToRoom();
    setTimeout(autoFocus, 0);
  }

  /* ---- story co-op: the scene, then a battle beside the hero or a race through the stage */
  function npStory(plan) {
    const ep = epOf(plan.ep), ch = chOf(ep, plan.ch);
    NP.story = { plan, ep, ch, ok: new Set(), stage: "before" };
    storyRun = { who: ep.who, ep, i: plan.ch, ch, net: true };
    if (ch.kind === "run") { storyRun.def = storyDef(ch); loadDef(storyRun.def); glideX = 12; camX = 15; }
    else if (ch.kind === "zone") { NP.story.act = storyRun.act = 0; storyRun.def = actDef(stageAt(ch.zone), 0); loadDef(storyRun.def); glideX = 12; camX = 15; }
    else if (ch.kind === "race") { storyRun.def = raceDef(stageAt(ch.zone)); loadDef(storyRun.def); glideX = 12; camX = 15; }
    else { disposeWorld(); world = buildWorld(arenaDef(stageAt(ch.arena))); player = makePlayer(castOf(ch.who)); glideX = world.W / 2; snapCamera(); }
    music();
    if (NP.late) npLateWait("Catching up with the story…");        // (come mid-chapter: what part it's at comes from the host)
    else playScene(ch.before, () => npStoryOk());
  }
  const NP_GATE = { before: 1, mid: 1, meet: 1 };            // (the talk everyone sees before the story goes on)
  function npStoryOk() {
    const S = NP.story; if (!S || !NP_GATE[S.stage]) return;
    if (NP.host) { S.ok.add(NP.me); npStoryCheck(); } else Online.toHost({ t: "np.ok" });
    if (NP_GATE[S.stage]) {
      const ov = screenOn("scene");
      ov.innerHTML = `<div class="panel adv-small pop ao-wait"><div class="ao-spin"></div><p>Waiting for the others to finish the scene…</p></div>`;
    }
  }
  function npStoryCheck() {
    const S = NP.story; if (!S || !NP_GATE[S.stage] || !NP.host) return;
    const here = NP.plan.mem.filter(m => NP.room.members.some(x => x.id === m.id));
    if (!here.every(m => S.ok.has(m.id))) { if (!S.timer) S.timer = setTimeout(() => { S.timer = null; if (NP.story === S && NP_GATE[S.stage]) { here.forEach(m => S.ok.add(m.id)); npStoryCheck(); } }, 40000); return; }
    clearTimeout(S.timer); S.timer = null;
    const ch = S.ch, d = { t: "np.sgo" };
    if (ch.kind === "battle" || S.stage === "meet") {
      const P = NP.plan, slots = [];
      slots.push({ who: ch.who, net: P.hero, name: (P.mem.find(m => m.id === P.hero) || {}).name, team: 0 });
      for (const m of P.mem) if (m.id !== P.hero && NP.room.members.some(x => x.id === m.id) && slots.length < 4 - ch.foes.length) slots.push({ who: m.who, net: m.id, em: m.em, name: m.name, team: 0 });
      for (const a of ch.allies || []) if (slots.length < 4 - ch.foes.length) slots.push({ who: a, ctl: "cpu", lvl: 1, team: 0 });
      for (const f of ch.foes) if (slots.length < 4) slots.push({ who: f.who, ctl: "cpu", lvl: f.lvl == null ? 1 : f.lvl, team: 1 });
      d.cfg = { kind: "battle", net: true, story: true, slots, teams: true, arena: stageAt(ch.arena || ch.zone), rule: "stock", goal: 1, time: 0, hp: 300 };
    } else { d.run = 1; if (ch.kind === "zone") d.act = S.stage === "mid" ? 1 : 0; }
    Online.toAll(d, true); npStoryGo(d);
  }
  function npStoryGo(d) {
    const S = NP.story; if (!S) return;
    const vs = d.cfg && S.stage === "meet";
    S.stage = "action"; S.ok = new Set();
    if (vs) showVs(S.ch, () => { if (NP.story === S && NP.on) npBattle(d.cfg); });   // (the meeting at an Act's end: VS, then the fight)
    else if (d.cfg) npBattle(d.cfg);
    else { if (d.act != null) S.act = storyRun.act = d.act; npRace(NP.plan, S); }
  }
  function npStoryBattleOver(B) { npStoryAfter(B.winner === 0); }
  /* everyone home: a zone chapter goes on -- the talk between and Act 2; at Act 2's end, the one
     waiting there (they drop in, the talk, and the fight) -- or it is over */
  function npStoryRaced(S) {
    if (isZone(S.ch) && !(S.act > 0)) return npStoryGate("mid", S.ch.mid);
    if (rivalOf(S.ch)) {
      const r = world && world.rival;
      if (r && !r.card) { r.card = makeCard(r.who); world.group.add(r.card); r.x = r.a1 - 4; r.y = r.gy; r.landed = true; r.lock = true; glideX = r.camX - 3; camX = r.camX; }
      return npStoryGate("meet", S.ch.meet);
    }
    npStoryAfter(true);
  }
  function npStoryGate(stage, lines) {
    const S = NP.story; if (!S) return;
    S.stage = stage; S.ok = new Set();
    host.querySelector(".adv-hud").classList.remove("on");
    playScene(lines, () => npStoryOk());
  }
  /* the scene after (a win), the chapter cleared for everyone who was there, and back to the room */
  function npStoryAfter(won) {
    const S = NP.story; if (!S) return;
    S.stage = "after";
    endBattle();
    if (!won) {
      mode = "results"; host.querySelector(".adv-hud").classList.remove("on");
      const ov = host.querySelector(".adv-ov");
      ov.innerHTML = `<div class="panel adv-small pop"><div class="panel-hd">${ico("info")}Beaten</div><p class="adv-note">The chapter wasn't cleared. The host can start it again from the room.</p>
        <div class="adv-btns"><button class="btn" id="npBack" data-focus data-enter>${ico("back")}Back to the room</button></div></div>`;
      ov.querySelector("#npBack").onclick = () => npBackToRoom(); setTimeout(autoFocus, 0); return;
    }
    if (world && world.def.arena) glideX = world.W / 2;
    else if (world) { glideX = Math.max(12, Math.min(world.W - 31, (world.goal ? world.goal.x : world.W) - 22)); camX = glideX + 3; }
    playScene(S.ch.after, () => {
      if (!NP.watch) {                                   // (a spectator watched it: their save is as it was)
        saveData.story = saveData.story || {};
        const eps = saveData.story.eps = saveData.story.eps || {};
        eps[S.ep.who] = Math.max(eps[S.ep.who] || 0, S.plan.ch + 1); save(saveData);
      }
      const ov = screenOn("story");
      ov.innerHTML = `<div class="panel adv-small pop"><div class="panel-hd gold">${ico("check")}Chapter ${S.plan.ch + 1}: ${esc(S.ch.title)}</div>
        <p class="adv-note">${NP.watch ? "Cleared by the players. You watched: your own save is as it was." : `Cleared together. It counts in ${esc(poss(castOf(S.ep.who).name))} episode on your save too.`}</p>
        <div class="adv-btns"><button class="btn" id="npBack" data-focus data-enter>${ico("back")}Back to the room</button></div></div>`;
      ov.querySelector("#npBack").onclick = () => npBackToRoom(); autoFocus();
    });
  }

  // ---------------------------------------------------------------- the tournament
  /* A bracket of 8 or 16, knock-out, one battle a match (Survival: the lives a match the setup
     says, three minutes). The players are spread through the bracket so they meet as late as
     they can; CPUs fill the other places, with fighters nobody took and levels around the one
     set. A match between two CPUs is settled at once (their levels and a little luck) -- or
     watched, offline, if you like. Online, the room's host runs the bracket: its players'
     matches are online battles everyone in the room watches. */
  let TOUR = null;
  const ROUND_N = (n, r) => { const left = n >> r; return left === 2 ? "Final" : left === 4 ? "Semi-finals" : left === 8 ? "Quarter-finals" : "Round of " + left; };
  /* the places the players go: bit-reversed, so the first two are in opposite halves */
  const seedOrder = n => { const b = Math.log2(n); return Array.from({ length: n }, (_, i) => { let r = 0; for (let k = 0; k < b; k++) if (i & (1 << k)) r |= 1 << (b - 1 - k); return r; }); };
  function tourMake(o) {
    const size = o.size === 16 ? 16 : 8;
    const humans = o.humans.slice(0, size).map(h => Object.assign({ cpu: false }, h));
    const used = new Set(humans.map(e => e.who).concat(o.cup ? [o.cup] : [])), cpus = [];
    while (humans.length + cpus.length < size) {
      let pool = CAST.filter(c => !used.has(c.id)); if (!pool.length) pool = CAST;
      const c = pool[Math.floor(Math.random() * pool.length)]; used.add(c.id);
      const lv = clamp((o.lvl == null ? 1 : o.lvl) + (Math.random() < 0.3 ? (Math.random() < 0.5 ? -1 : 1) : 0), 0, 2);
      cpus.push({ cpu: true, who: c.id, name: c.name, lvl: lv });
    }
    /* (sixteen places and fourteen runners: a second of one is "2") */
    const seen = {}; for (const e of humans.concat(cpus)) if (e.cpu) { seen[e.name] = (seen[e.name] || 0) + 1; if (seen[e.name] > 1) e.name += " " + seen[e.name]; }
    U.shuffle(cpus);
    const order = seedOrder(size), ents = new Array(size);
    humans.forEach((h, i) => { ents[order[i]] = h; });
    if (o.cup) ents[order[humans.length]] = { cpu: true, who: o.cup, name: castOf(o.cup).name, lvl: 2, boss: true };   // (the host of the Cup, in the other half)
    for (let i = 0; i < size; i++) if (!ents[i]) ents[i] = cpus.pop();
    const rounds = []; let n = size / 2;
    rounds.push(Array.from({ length: n }, (_, k) => ({ a: 2 * k, b: 2 * k + 1, w: null })));
    while (n > 1) { n /= 2; rounds.push(Array.from({ length: n }, () => ({ a: null, b: null, w: null }))); }
    return { size, goal: o.goal || 2, arena: o.arena == null ? -1 : o.arena, lvl: o.lvl == null ? 1 : o.lvl, online: !!o.online, cup: o.cup || null, ents, rounds, r: 0, done: false, champ: null, recd: false };
  }
  /* the next match to play (rounds done carry their winners on) */
  function tourNext() {
    const T = TOUR;
    for (let guard = 0; guard < 8; guard++) {
      const R = T.rounds[T.r]; if (!R) return null;
      const N2 = T.rounds[T.r + 1];
      if (N2) R.forEach((x, k) => { if (x.w == null) return; const nm = N2[k >> 1]; if (k % 2 === 0) nm.a = x.w; else nm.b = x.w; });   // a winner moves on at once
      const m = R.find(x => x.w == null);
      if (m) return m;
      if (!N2) { T.done = true; T.champ = R[0].w; return null; }
      T.r++;
    }
    return null;
  }
  const isMine = e => !!e && (TOUR.online ? e.net === NP.me : !!e.me);
  /* two CPUs: the higher level mostly wins, now and then not */
  function tourSim(m) {
    const T = TOUR, A2 = T.ents[m.a], B2 = T.ents[m.b];
    if (A2.boss || B2.boss) { m.w = A2.boss ? m.a : m.b; m.sim = true; return; }     // (the Cup's host never loses before the final)
    const s = e => e.lvl * 1.1 + (HP_K[e.who] || 1) * 0.6 + Math.random() * 1.6;
    m.w = s(A2) >= s(B2) ? m.a : m.b; m.sim = true;
  }
  function tourCfg(m) {
    const T = TOUR, ea = T.ents[m.a], eb = T.ents[m.b];
    const slot = e => e.cpu ? { who: e.who, ctl: "cpu", lvl: e.lvl } : T.online ? { who: e.who, net: e.net, em: e.em, name: e.name, r: e.r } : { who: e.who, ctl: "p1", em: e.em };
    return { kind: "battle", tour: true, net: T.online, slots: [slot(ea), slot(eb)], teams: false, arena: T.arena < 0 ? randomArena() : T.arena, rule: "stock", goal: T.goal, time: 180, hp: 200 };
  }
  /* play (or settle) the next match */
  function tourGo(watch) {
    const T = TOUR, m = tourNext();
    if (!m) { tourBracket(); return; }
    const ea = T.ents[m.a], eb = T.ents[m.b];
    if (ea.cpu && eb.cpu && !watch) { tourSim(m); tourAfter(); return; }
    T.cur = m;
    const cfg = tourCfg(m);
    if (!T.online && ea.cpu && eb.cpu) cfg.spec = true;     // (two CPUs, watched: you follow either, or the whole arena)
    if (T.online) { Online.toAll({ t: "np.tm", T, cfg }, true); npBattle(cfg); }
    else startBattle(cfg);
  }
  /* a match is over: its winner on, then the bracket (and, online, to everyone) */
  function tourBattleOver(B) {
    const T = TOUR, m = T && T.cur; if (!T || !m) { mode = "results"; return; }
    let w = B.winner;
    if (w == null) { const [fa, fb] = B.fs; w = fa.lives * 1000 + fa.hp > fb.lives * 1000 + fb.hp ? 0 : 1; }
    if (!T.online || NP.host) { m.w = w === 0 ? m.a : m.b; T.cur = null; }
    endBattle();
    tourAfter();
  }
  function tourAfter() {
    const T = TOUR;
    tourNext();
    if (T.online && NP.host) Online.toAll({ t: "np.tour", T }, true);
    tourBracket();
  }
  /* your tournament, once you're out or it's over: the record */
  function tourRecord() {
    const T = TOUR; if (!T || T.recd || !root.Auth || !Auth.user) return null;
    const mine = T.ents.findIndex(isMine); if (mine < 0) return null;
    const out = T.rounds.some(R => R.some(m => m.w != null && (m.a === mine || m.b === mine) && m.w !== mine));
    if (!out && !T.done) return null;
    T.recd = true;
    if (T.done && T.champ === mine && !T.online) {
      if (T.size === 8) { PROG().cups++; save(saveData); }
      if (T.cup && !hasFighter(T.cup)) { grantFighter(T.cup); PENDING.push({ id: T.cup, kind: "join" }); }
    }
    const wins = T.rounds.reduce((n, R) => n + R.filter(m => m.w === mine).length, 0);
    return Auth.record({ kind: "tourney", rounds: wins, champ: T.champ === mine, online: T.online });
  }
  /* the bracket */
  function tourBracket() {
    const T = TOUR; if (!T) { mainMenu(); return; }
    const ov = screenOn("tourney");
    if (!world || world.def.arena) ensureStageWorld();
    const next = tourNext(), rec = tourRecord();
    const mine = T.ents.findIndex(isMine);
    const canRun = !T.online || NP.host;
    const ent = (i, m) => {
      if (i == null) return `<div class="tr-e tbd"><span>-</span></div>`;
      const e = T.ents[i], lost = m.w != null && m.w !== i, won = m.w === i;
      return `<div class="tr-e ${lost ? "lost" : ""} ${won ? "won" : ""} ${i === mine ? "me" : ""}"><canvas width="32" height="29" data-face="${esc(e.who)}"></canvas><span>${esc(e.name)}${e.cpu ? "" : `<i>${T.online ? "Player" : "You"}</i>`}</span>${won ? ico("check") : ""}</div>`;
    };
    const champ = T.done ? T.ents[T.champ] : null;
    ov.innerHTML = `
      <div class="ao-page pop tr-page">
        <div class="ao-head">
          <button class="btn ghost" data-quit data-back>${ico("back")}${T.online ? "Leave the room" : "Quit"}</button>
          <h2>${ico("crown")}${T.cup ? "The " + esc(castOf(T.cup).name.replace(/^Dr\. /, "")) + " Cup" : "Tournament · " + T.size}</h2>
          <span class="ao-net">${T.watch ? `${ico("eye")}Spectating · ` : ""}${T.done ? "Over" : esc(ROUND_N(T.size, T.r))} · ${T.goal} ${T.goal === 1 ? "life" : "lives"} a match</span>
        </div>
        <div class="panel tr-wrap"><div class="tr-bracket">${T.rounds.map((R, r) => `
          <div class="tr-col"><h4>${esc(ROUND_N(T.size, r))}</h4><div class="tr-ms">${R.map(m => `<div class="tr-m ${m === next ? "cur" : ""} ${m.sim ? "sim" : ""}">${ent(m.a, m)}${ent(m.b, m)}</div>`).join("")}</div></div>`).join("")}
          <div class="tr-col tr-champ"><h4>Champion</h4><div class="tr-ms">${champ ? `<div class="tr-m won"><canvas width="66" height="54" data-face="${esc(champ.who)}"></canvas><b>${esc(champ.name)}</b></div>` : `<div class="tr-m tbd">${ico("crown")}</div>`}</div></div>
        </div></div>
        <div class="panel tr-bar">
          ${T.done ? `<p class="tr-msg">${ico("crown")}${isMine(champ) ? "You win the tournament!" : `<b>${esc(champ.name)}</b> wins the tournament${champ.cpu ? "." : "!"}`}${rec ? ` +${rec.xp} XP` : ""}</p>
              <div class="adv-btns">${T.online ? `<button class="btn" data-room data-focus>${ico("back")}Back to the room</button>` : `<button class="btn" data-again data-focus>${ico("flag")}New tournament</button><button class="btn ghost" data-menu>Main menu</button>`}</div>`
            : next ? (() => {
              const a = T.ents[next.a], b = T.ents[next.b], cpuOnly = a.cpu && b.cpu, inIt = isMine(a) || isMine(b);
              if (T.watch && canRun) return `<p class="tr-msg">${ico("eye")}${esc(ROUND_N(T.size, T.r))}: <b>${esc(a.name)}</b> vs <b>${esc(b.name)}</b></p>
                <div class="adv-btns"><button class="btn lg" data-watch data-focus>${ico("eye")}Watch the match</button><button class="btn ghost" data-go>${ico("next")}Settle it</button><button class="btn ghost" data-skip>Settle the rest</button></div>`;
              return `<p class="tr-msg">${esc(ROUND_N(T.size, T.r))}: <b>${esc(a.name)}</b> vs <b>${esc(b.name)}</b>${cpuOnly ? " (CPUs)" : ""}${rec ? ` · you're out: +${rec.xp} XP` : ""}</p>
                <div class="adv-btns">${canRun ? `<button class="btn lg" data-go data-focus>${ico(inIt ? "flag" : "next")}${inIt ? "Play your match" : cpuOnly ? "Settle it" : "Start the match"}</button>
                  ${cpuOnly ? `<button class="btn ghost" data-watch>${ico("eye")}Watch it</button><button class="btn ghost" data-skip>Settle every CPU match</button>` : ""}` : `<p class="adv-note">Waiting for the host…</p>`}</div>`;
            })() : ""}
        </div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    const q = s => ov.querySelector(s);
    q("[data-quit]").onclick = () => {
      if (T.online) { if (root.Online) Online.leave(); return; }
      if (T.done) { TOUR = null; mainMenu(); return; }
      if (root.AdventureOnline) AdventureOnline.modal({ title: "Quit the tournament?", icon: "door", body: `<p class="adv-note">The bracket is lost.</p>`, buttons: [["Quit", () => { TOUR = null; mainMenu(); }, ""], ["Stay", null, "ghost"]] });
      else { TOUR = null; mainMenu(); }
    };
    if (q("[data-go]")) q("[data-go]").onclick = () => tourGo(false);
    if (q("[data-watch]")) q("[data-watch]").onclick = () => tourGo(true);
    if (q("[data-skip]")) q("[data-skip]").onclick = () => {
      for (let n = tourNext(); n && T.ents[n.a].cpu && T.ents[n.b].cpu; n = tourNext()) tourSim(n);
      tourAfter();
    };
    if (q("[data-again]")) q("[data-again]").onclick = () => tourSetup();
    if (q("[data-menu]")) q("[data-menu]").onclick = () => { TOUR = null; mainMenu(); };
    if (q("[data-room]")) q("[data-room]").onclick = () => npBackToRoom();
    const cur = ov.querySelector(".tr-m.cur"); if (cur) cur.scrollIntoView({ block: "nearest", inline: "center" });
    autoFocus();
  }
  /* the offline tournament's setup */
  let tourSet = null;
  function tourSetup() {
    tourSet = tourSet || { size: 8, lvl: 1, goal: 2, arena: -1, spec: 0 };
    const ov = screenOn("tourney"), t = tourSet, zs = stages(), can16 = PROG().cups >= 1;
    if (!can16) t.size = 8;
    if (t.arena >= 0 && !unlocked(t.arena)) t.arena = -1;
    const segs = (k, opts) => `<div class="seg adv-seg">${opts.map(([v, l]) => `<button data-t="${k}" data-v="${v}" class="${String(t[k]) === String(v) ? "sel" : ""}">${l}</button>`).join("")}</div>`;
    ov.innerHTML = `
      <div class="adv-menu pop">
        <div class="panel adv-panel">
          <div class="panel-hd">${ico("crown")}Tournament</div>
          <p class="adv-note">${t.spec ? "A knock-out bracket of CPUs, one battle a match, the winner on to the next round: you watch each match, or settle it. Nothing counts toward your record." : "A knock-out bracket: you and CPUs, one battle a match, the winner on to the next round."}</p>
          <div class="setrow"><div class="setlab"><b>You</b><i>${t.spec ? "Watch every fighter in it." : "Fight in it."}</i></div>${segs("spec", [[0, "Fight"], [1, `${ico("eye")}Spectate`]])}</div>
          <div class="setrow"><div class="setlab"><b>Places</b>${can16 ? "" : "<i>16 places open once you've won a tournament of 8.</i>"}</div>${can16 ? segs("size", [[8, "8"], [16, "16"]]) : `<div class="seg adv-seg"><button class="sel">8</button><button disabled title="Win a tournament of 8 first">${ico("lock")}16</button></div>`}</div>
          <div class="setrow"><div class="setlab"><b>CPUs</b><i>Around this level, a little either side.</i></div>${segs("lvl", [[0, "Easy"], [1, "Normal"], [2, "Hard"]])}</div>
          <div class="setrow"><div class="setlab"><b>Lives a match</b></div>${segs("goal", [[1, "1"], [2, "2"], [3, "3"]])}</div>
          <div class="setrow"><div class="setlab"><b>Arena</b></div><div class="adv-pick"><button class="adv-arr" data-ar="-1">${ico("back")}</button><b>${t.arena < 0 ? "A new one every match" : esc(zs[t.arena].name)}</b><button class="adv-arr" data-ar="1">${ico("next")}</button></div></div>
          ${t.spec ? "" : `<div class="setrow"><div class="setlab"><b>Your fighter</b></div><div class="adv-pick"><button class="adv-arr" data-pk="-1">${ico("back")}</button><canvas width="44" height="40" data-face="${castId}"></canvas><b>${esc(castOf(castId).name)}</b><button class="adv-arr" data-pk="1">${ico("next")}</button></div></div>`}
          <div class="adv-go">
            <button class="btn lg" data-go data-focus data-enter>${ico(t.spec ? "eye" : "flag")}${t.spec ? "Watch the tournament" : "Start the tournament"}</button>
            <button class="btn ghost" data-back>${ico("back")}Main menu</button>
          </div>
        </div>
      </div>`;
    ov.querySelectorAll("[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1));
    ov.querySelectorAll("[data-t]").forEach(b => b.onclick = () => { t[b.dataset.t] = +b.dataset.v; tourSetup(); });
    if (pendingFirst(tourSetup)) return;
    ov.querySelectorAll("[data-ar]").forEach(b => b.onclick = () => { t.arena = cycle([-1].concat(openArenas()), t.arena, +b.dataset.ar); tourSetup(); });
    ov.querySelectorAll("[data-pk]").forEach(b => b.onclick = () => { castId = cycleTeam(castId, +b.dataset.pk); saveData.cast = castId; save(saveData); tourSetup(); });
    ov.querySelector("[data-go]").onclick = () => {
      TOUR = tourMake({ size: t.size, lvl: t.lvl, goal: t.goal, arena: t.arena, online: false, humans: t.spec ? [] : [{ name: root.Auth && Auth.user ? Auth.name : "You", who: castId, me: true }] });
      TOUR.watch = !!t.spec;                                 // (a spectator's: every place a CPU's)
      tourBracket();
    };
    ov.querySelector("[data-back]").onclick = () => mainMenu();
    autoFocus();
  }

  // ---------------------------------------------------------------- open / close
  function open(el, opts) {
    close();
    if (!ensureRenderer()) {
      el.innerHTML = `<div class="scr-wrap"><div class="panel pop"><div class="panel-hd">${ico("info")}No 3D here</div><p style="padding:16px">This browser can't draw the voxels the cabinet needs.</p></div></div>`;
      return false;
    }
    host = el; opts0 = opts || {};
    battle = null; storyRun = null; talk = null; rebind = null; actor = null; input = INPUT0;
    saveData = load();
    emerlImgs();                                         // Emerl's sheets, ready for when he is picked
    try { if (root.Sound && Sound.stop) Sound.stop(); } catch (e) {}                 // the cabinet plays its own music
    loadSamples();
    castId = CAST.some(c => c.id === saveData.cast) ? saveData.cast : "sonic";
    teamCatchUp();
    const list = stages();
    if (!list.length) return false;
    stageIdx = 0;
    for (let i = list.length - 1; i >= 0; i--) if (unlocked(i)) { stageIdx = i; break; }
    if (cleared(stageIdx) && stageIdx + 1 < list.length && unlocked(stageIdx + 1)) stageIdx++;
    actIdx = firstAct(stageIdx);
    el.innerHTML = `<div class="adv"><div class="adv-3d"></div><div class="adv-hud"></div><div class="adv-ov"></div></div>`;
    host = el.querySelector(".adv");
    steadyRedraws(host.querySelector(".adv-ov"));
    host.addEventListener("pointerdown", () => { kbUsed = false; if (kbFocus) kbFocus.classList.remove("kb"); kbFocus = null; });
    if (root.AdventureOnline) { AdventureOnline.init(onlineApi()); AdventureOnline.resume(); }
    load3d(stageIdx);
    title(); music();
    addEventListener("keydown", kd); addEventListener("keyup", ku);
    raf = requestAnimationFrame(frame);
    return true;
  }
  /* what adventure-online.js may use */
  function onlineApi() {
    return {
      host: () => host, screen: m => screenOn(m), mainMenu: () => mainMenu(), title: () => title(), ico, autoFocus: () => autoFocus(), where: () => mode,
      paintAll: el => el.querySelectorAll("canvas[data-face]").forEach(cv => paintCard(cv, cv.dataset.face, "portrait", 1)),
      cast: () => CAST.map(c => ({ id: c.id, name: c.name })), castName: id => id === "random" ? "Random" : (CAST.find(c => c.id === id) || { name: String(id) }).name,
      validWho: w => w === "random" || CAST.some(c => c.id === w) ? w : "sonic",
      castId: () => castId, setCast: id => { if (!CAST.some(c => c.id === id)) return; castId = id; if (saveData) { saveData.cast = id; save(saveData); } },
      emerlLoadout: () => (saveData && saveData.emerl && saveData.emerl.loadout) || null,
      zones: () => stages().map((z, i) => ({ i, id: z.id, name: z.name })),
      eps: () => EPS().map(e => ({ who: e.who, name: castOf(e.who).name, title: e.title, chapters: e.chapters.map(c => c.title) })),
      epDone: who => epDone(who),
      onLogin: id => {
        saveData = loadAcct(id);
        castId = CAST.some(c => c.id === saveData.cast) ? saveData.cast : "sonic";
        PENDING = []; RETRO = null; teamCatchUp();
        const list = stages(); stageIdx = 0;
        for (let i = list.length - 1; i >= 0; i--) if (unlocked(i)) { stageIdx = i; break; }
        if (cleared(stageIdx) && stageIdx + 1 < list.length && unlocked(stageIdx + 1)) stageIdx++;
        actIdx = firstAct(stageIdx);
      },
      onLogout: () => { npStop(); TOUR = null; saveData = load(); PENDING = []; RETRO = null; title(); },
      fighters: () => fightersN(), hasFighter: id => hasFighter(id), gpCups: () => GP_CUP_NAMES, openZones: () => openArenas().map(i => ({ i, id: stages()[i].id, name: stages()[i].name })),
      can16: () => PROG().cups >= 1, randomArena: () => randomArena(),
      np: { start: npStart, plan: npPlan, hostGot: npHostGot, guestGot: npGuestGot, stop: npStop, memberLeft: npMemberLeft, active: () => NP.on, chatLine: npChatLine },
    };
  }
  function exit() {
    const cb = opts0 && opts0.onExit;
    if (!cb) return;                                     // on its own page there is nowhere to go back to
    close();
    if (cb) cb();
  }
  function close() {
    if (raf) cancelAnimationFrame(raf); raf = 0;
    removeEventListener("keydown", kd); removeEventListener("keyup", ku);
    for (const k in keys) keys[k] = 0;
    for (const k in touch) touch[k] = 0;
    duoKeys.forEach(m => { for (const k in m) m[k] = 0; });
    battle = null; storyRun = null; talk = null; rebind = null; actor = null; input = INPUT0;
    bgmStop();
    disposeWorld(); player = null;
    if (R && R.domElement.parentNode) R.domElement.parentNode.removeChild(R.domElement);
    host = null;
  }

  root.Adventure = { ok: true, open, close, CAST, THEMES,
    _debug: { get cpus() { return CPUS; }, get world() { return world; }, get player() { return player; }, get GP() { return GP; }, get GPR() { return GPR; }, gpBegin: o => gpBegin(o), npStart: (h, R, plan, me) => npStart(h, R, plan, me), npPlan: (R, id) => npPlan(R, id), get NP() { return NP; }, gpSim: (id, who, seed) => { const r = simRun(gpDef(id), who, seed == null ? 1000 : seed); return { ok: r.ok, time: r.time, end: r.track.length ? r.track[r.track.length - 1][1] : null }; }, gpUse: (id, k) => gpUse(id, k), gpHit: (id, by) => gpHit(id, by), gpPodium: () => gpPodium(), gpMenu: () => gpMenu(), gpDef: id => gpDef(id), coursePic: id => coursePic(id), gpCleanAdd: (id, list) => { GP_CLEAN[id] = list; }, step: (s, n) => { for (let k = 0; k < (n || 1); k++) { readInput(); step(s); worldStep(s); input.jp = input.zp = input.xp = input.cp = 0; } },
              play: (i, id, a) => { if (id) castId = id; if (i != null) stageIdx = i; actIdx = a || 0; play(); }, draw: dt => draw(dt || 1 / 60), input: INPUT0, keys, touch, parse,
              get battle() { return battle; }, get punch() { return punch; }, get np() { return NP; }, get tour() { return TOUR; }, frame: t => frame(t), tourSetup, tourMake, tourBracket, tourGo, get demo() { return demo; }, demoTick: (secs, h) => { for (let t = 0; t < secs && demo; t += h || 0.05) demoTick(h || 0.05); }, title, get mode() { return mode; }, get talk() { return talk; }, startBattle, mainMenu, storyMenu, storyEpisode, playChapter, battleSetup, get storyRun() { return storyRun; }, EPS,
              trainingSetup, optionsScreen, arenaDef, emerlLearn, emerlSkills, emerlCast, get saveData() { return saveData; },
              bossWeak: () => world && world.boss && BRAIN[world.boss.key].weak(world.boss),
              simRun: (where, who) => simRun(typeof where === "number" ? actDef(where, 0) : /^r\d+$/.test(where) ? raceDef(+where.slice(1)) : storyStages().find(st => st.id === where), who),
              raceDef: i => raceDef(i),
              peek: (where, x, y, r) => { const def = typeof where === "number" ? raceDef(where) : /^a\d+$/.test(where) ? actDef(+where.slice(1), 0) : gpDef(where); disposeWorld(); const w = world = buildWorld(def); r = r || 8;
                const rows = []; for (let j = Math.min(H - 1, Math.round(y) + 6); j >= Math.max(0, Math.round(y) - 4); j--) { let s = ""; for (let i = Math.round(x) - r; i <= Math.round(x) + r; i++) s += tile(i, j); rows.push(String(j).padStart(2) + " " + s); }
                const near = o => Math.abs((o.x != null ? o.x : o.x0) - x) < r && Math.abs((o.y != null ? o.y : o.y0) - y) < 6;
                const out = { rows, hz: w.hazards.filter(near).map(z => [z.t || "hz", z.x0, z.x1, z.y0, z.y1]), en: w.enemies.filter(near).map(e => [e.key, e.x, e.y]), ents: w.ents.filter(near).map(e => [e.t, e.x, e.y]), sol: w.solids.filter(near).map(b => [b.t, b.x0, b.y0]) };
                disposeWorld(); world = null; return out; },
              botStats: (where, who, skill) => { const def = typeof where === "number" ? raceDef(where) : /^[ab]\d+$/.test(where) ? actDef(+where.slice(1), where[0] === "b" ? 1 : 0) : /^s\d+$/.test(where) ? storyStages()[+where.slice(1)] : gpDef(where); const r = simRun(def, who, 1000, skill); return { trace: r.trace, ok: r.ok, time: +r.time.toFixed(1), ideal: +r.st.ideal.toFixed(1), hurt: r.st.hurt, rides: r.st.rides || 0, bump: r.st.bump, stumble: r.st.stumble, water: +r.st.water.toFixed(1), endX: Math.round(r.st.endX), dist: Math.round(r.st.dist), ev: r.st.ev }; },
              raceStart: o => raceStart(o), get race() { return RACE; }, actDef: (i, a) => actDef(i, a), storyStages: () => storyStages(),
              get tut() { return TUT; }, tutorialStart, trainingMenu, tutLessons: () => tutLessons().map(l => l.id),
              tutJump: id => { if (!TUT) return; TUT.i = LESSONS.findIndex(l => l.id === id) - 1; TUT.ok = null; tutNext(); },
              get bgm() { return BGM; }, get samples() { return Object.keys(SAMPLES); }, sfx: SFX, tick: (n, h) => { for (let k = 0; k < (n || 1); k++) { if (battle) battleTick(h || 1 / 120); } } } };
})(typeof globalThis !== "undefined" ? globalThis : this);
