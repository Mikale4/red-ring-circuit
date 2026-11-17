/*
 * Red Ring Circuit: the story, "The Red Star Rings", told from every side.
 *
 * Thirty-nine Red Star Rings, each holding a star's worth of power, have fallen across the world
 * with the shooting stars: the ones hidden three to a stage. Dr. Eggman means to set every one of
 * them in his Star Engine aboard the Egg Orbital -- power without end, so he never loses again --
 * though an engine that strong would drain the power out of everything else. As Sonic Battle
 * tells its story, each of the cast has an EPISODE of their own: the same days, seen from their
 * side, with their own scenes, runs and battles (and, as in Sonic Battle, each wins the fights of
 * their own episode). Eggman's dig on Seabreeze Cape also wakes something older than any of it:
 * an ancient Gizoid, which Sonic names Emerl, and which learns by fighting everyone it meets --
 * in Emerl's own episode, each win teaches him moves of the one he beat.
 *
 * Each chapter is a scene of talk, then a stage to run or a battle to win, then the talk after.
 * Runs are on the story's own stages (adventure-stages.js, STORY: Eggman's dig on the cliffs,
 * the runway, Amy's house, the shrines, the rooftops, the convoy road, the museum gallery, the
 * Chao pools, the blasting site, Silver's last street, the vault, the launch track, the Star
 * Engine's core) or the zones themselves; battles are in the runners' arenas (seabreeze,
 * airstrip, parlour, peak, club, expressway, museum, springs, canyon, ruins, depot, stars,
 * station). Mid-run, the cast and Eggman have their say (`beats`).
 *
 * The characters are written to their canon (researched on Wikipedia, Sonic Retro and TV
 * Tropes):
 * - Sonic is easy-going, cocky and kind, quick with a quip ("Too easy!"), and can't swim.
 * - Tails looks up to Sonic and talks machines.
 * - Knuckles guards his people's old shrines, has a hot temper, and is tricked by Eggman yet
 *   again (the series' running joke).
 * - Amy is loud, sunny and quick with her hammer: her fortune cards, her love for Sonic, and the
 *   kindness that turned E-102 Gamma.
 * - Rouge is the self-styled world's greatest treasure hunter, a government spy on the side,
 *   who loves to rile Knuckles.
 * - Shadow is the Ultimate Life Form: aloof, snarky to Sonic, keeping his promise to protect
 *   the world; Professor Gerald Robotnik's journals are part of his past.
 * - Cream is six, polite ("Mr." and "Miss"), hates fighting and loves ice cream; Cheese the
 *   Chao does the fighting.
 * - Chaos is the old spirit of the water, protector of the Chao, who never speaks.
 * - Chaos Gamma is the robot Eggman built on E-102 Gamma's design, who speaks as a machine.
 * - Mighty is a strong, gentle traveller who loves nature and dislikes violence.
 * - Silver is fourteen, from a ruined future: hopeful, earnest, naive, and once more sure that
 *   Sonic is to blame.
 * - Metal Sonic is Eggman's silent copy of Sonic, who cannot bear to be second.
 * - Eggman is the self-proclaimed genius with an IQ of 300, a ham who names everything after
 *   himself ("Get a load of THIS!", "No way! I can't believe this!").
 * - Emerl is an ancient Gizoid with no personality of its own at first: it learns by watching
 *   and by being hit, copying techniques and picking up the ways of the people it meets, and
 *   loves a sporting fight; Sonic gives it its name (Sonic Battle).
 * Sonic and his friends, rivals and Dr. Eggman belong to SEGA; the story and its places are
 * the game's own.
 *
 * An episode: { who, title, blurb, chapters }. A chapter: { title, who (the one played; the
 * episode's own if left out), kind: "run" | "battle", stage (a run's: a story stage or a zone id)
 * or arena (a battle's: a zone id), foes: [{ who, lvl: 0 Easy | 1 Normal | 2 Hard }], allies (CPUs
 * on the player's side), before, beats (a run's, mid-stage), after }. A line is [speaker, text];
 * "" is narration. A beat is [how far along the stage, 0 to 1, speaker, text]. The episodes are
 * spread over three files (this one, adventure-story2.js, adventure-story3.js); each adds its own.
 */
(function (root) {
  "use strict";
  const N = "";
  const S = root.AdventureStory = root.AdventureStory || { TITLE: "The Red Star Rings", EPISODES: [] };

  // ==================================================================== Sonic
  S.EPISODES.push({ who: "sonic", title: "The Blue Blur", blurb: "A day off, a lucky ring, and a world's worth of trouble. Sonic's side of it all, from the cliffs to the stars.",
  chapters: [
    { title: "A Lucky Find", kind: "run", stage: "s-dig",
      before: [
        [N, "Seabreeze Cape, first thing in the morning. A blue hedgehog is stretched out on the warm grass at the top of the cliffs, doing nothing at all."],
        ["sonic", "Clear skies, sea breeze, nowhere to be. Now this is my kind of day."],
        [N, "Something glints in the grass by his hand: a ring, red as the sunrise, with a gold star in it, humming with power."],
        ["sonic", "Huh. A Red Star Ring? Haven't seen one of these in a while. Guess today's my lucky day."],
        ["eggman", "Hohoho! Not for long, hedgehog! That ring belongs to me!"],
        ["eggman", "Thirty-nine Red Star Rings have fallen on this world, and every one holds a star's worth of power! Set them all in my Star Engine, and I'll never lose again!"],
        ["sonic", "You know power was never your problem, right? It's the giant robots. They keep blowing up."],
        ["eggman", "Silence! Badniks, dig up this whole cape!"],
      ],
      beats: [
        [0.08, "eggman", "Dig, my badniks, dig! Every Red Star Ring on this cape is property of the Eggman Empire!"],
        [0.4, "sonic", "He's turned the whole clifftop into Swiss cheese. Rude."],
        [0.94, "sonic", "There's the dig rig. Too easy!"],
      ],
      after: [
        ["sonic", "Piece of cake. Three more rings up on the cliffs, and Eggman's robots were after every one."],
        [N, "Then the ground shakes. Where the dig rig stood, the cliff has split open, and something down in the crack is glowing."],
        ["sonic", "...Okay. That's new."],
      ] },
    { title: "Something in the Cliff", kind: "battle", arena: "seabreeze", foes: [{ who: "emerl", lvl: 0 }],
      before: [
        [N, "Out of the crack climbs a little machine, older than anything Sonic has seen. A Red Star Ring glows in its chest."],
        ["emerl", "...Mmmh. Shining. ...Blue. Fast."],
        ["sonic", "Hey there. You okay? Eggman dug you up, huh?"],
        [N, "It copies the way Sonic stands. Then the way he taps his foot. Then it drops into his fighting stance, exactly."],
        ["sonic", "Ha! You want a race? A fight? Okay, little guy. Show me what you've got!"],
      ],
      after: [
        ["emerl", "...Fun. Again. Again!"],
        ["sonic", "Heh. You learn fast. You need a name... A ring for a heart and a gem on your head. How about Emerl?"],
        ["emerl", "Emerl. ...Emerl!"],
        ["tails", "Sonic! There you are! My instruments went haywire an hour ago. Something's giving off a huge energy reading, all over the world!"],
        ["sonic", "Let me guess. Shaped like this? Tails, meet Emerl. Emerl, Tails. Let's go see what that radar of yours says."],
      ] },
    { title: "Hammer Time", kind: "battle", arena: "parlour", foes: [{ who: "amy", lvl: 0 }],
      before: [
        [N, "Tails' radar picks up a Red Star Ring at Amy's house. By the time Sonic gets there, Amy has already cleared out the badniks herself."],
        ["amy", "Sonic! You came to save me! ...Well, I already saved me. But it's the thought that counts!"],
        ["sonic", "Great. So, about that ring..."],
        ["amy", "It's my lucky charm. If you want it, you'll have to win it! And if I win, you take me on a date."],
        ["sonic", "Why does everything with you end in a date? Okay. Don't hold back!"],
      ],
      after: [
        ["amy", "Hmph! Fine, you win. Take the ring. But I'm coming with you!"],
        ["sonic", "Wouldn't have it any other way."],
        ["tails", "Guys! The radar just lit up! There's a whole cluster of Red Star Rings up on Guardian Peak!"],
        ["sonic", "Knuckles' mountain. He's gonna love having visitors."],
      ] },
    { title: "Tricked Again", kind: "battle", arena: "peak", foes: [{ who: "knuckles", lvl: 1 }],
      before: [
        [N, "Guardian Peak. Snow falls on the old echidna shrines at the summit, where Knuckles keeps watch."],
        ["sonic", "Hey, Knuckles! Listen, Eggman's after the..."],
        ["knuckles", "Save it, Sonic! Eggman told me all about you. Nobody takes anything from these shrines!"],
        ["sonic", "He tricked you again? Seriously? Okay, fine. I'll knock some sense into you."],
      ],
      after: [
        ["knuckles", "Grr... You've gotten faster."],
        ["sonic", "And you've gotten more gullible. Look up the mountain."],
        [N, "High on the slopes, a line of badniks is carrying the shrines' rings away. The Egg Mobile floats along behind them."],
        ["knuckles", "Eggman! He tricked me so I'd keep you busy! ...Again! Stay out of it, Sonic. This is my mountain."],
      ] },
    { title: "Prove It", kind: "battle", arena: "expressway", foes: [{ who: "shadow", lvl: 1 }],
      before: [
        [N, "The expressway out of the city, at sundown. Eggman's trucks lie stopped across the road, and Shadow stands among them."],
        ["sonic", "Hey, Shadow! You seen a bunch of red rings come through here?"],
        ["shadow", "I saw you. Running at the head of Eggman's convoy."],
        ["sonic", "Wasn't me. I've been up a mountain all afternoon."],
        ["shadow", "Then prove it."],
      ],
      after: [
        ["shadow", "...You're fast. But the one on the road was faster in a straight line. And it never once looked back."],
        ["sonic", "Faster than me? Okay, now I'm offended."],
        ["shadow", "It was a machine, Sonic. One built to beat you."],
        ["sonic", "Metal Sonic. So he's back."],
      ] },
    { title: "The Wrong Hedgehog", kind: "battle", arena: "canyon", foes: [{ who: "silver", lvl: 1 }],
      before: [
        [N, "Redstone Canyon, on Metal Sonic's trail. Mighty has just pointed the way, when a silver hedgehog drops out of thin air."],
        ["silver", "A blue hedgehog. Fast. It's you. You're the one who brings him the last ring."],
        ["sonic", "I'm the one who what now?"],
        ["silver", "I'm sorry. I can't let my future happen!"],
        ["sonic", "Hold on, you've got the wrong guy!"],
      ],
      after: [
        ["silver", "You never once went for the ring I'm carrying. Why not?"],
        ["sonic", "Because I don't want it! There's a machine running around that looks just like me. I bet your records got the two of us mixed up."],
        ["silver", "Then I almost... I'm sorry, Sonic."],
        ["sonic", "Don't sweat it. Help us catch the real one."],
        ["tails", "Sonic! Metal Sonic's on the launch track! He's taking the rings up to Eggman's station!"],
      ] },
    { title: "Catch Metal", kind: "run", stage: "s-launch",
      before: [
        ["tails", "The track runs all the way up into the sky, Sonic. If Metal reaches the dock at the top, the rings are gone."],
        ["sonic", "A race against my copy? Now you're speaking my language."],
      ],
      beats: [
        [0.12, "eggman", "Faster, Metal! Show them who the real fastest thing alive is!"],
        [0.55, "sonic", "There he is. Not bad, Metal. Not good enough, either."],
        [0.9, "sonic", "Gotcha!"],
      ],
      after: [
        [N, "At the top of the track, Metal Sonic stops, and turns around. Its eyes burn red."],
        ["sonic", "Okay, copycat. End of the line."],
      ] },
    { title: "The Real Thing", kind: "battle", arena: "stars", foes: [{ who: "metal", lvl: 2 }],
      before: [
        ["sonic", "You've been second best your whole life, Metal. Let's keep it that way."],
        ["metal", "(It drops into a crouch. Its jet flares.)"],
      ],
      after: [
        [N, "Metal Sonic staggers, sparks pouring from its joints. The case of rings slides away across the track."],
        ["sonic", "That was tight! But that's the last delivery you'll ever make."],
        ["eggman", "NO! Ugh... no matter! I already have more than enough rings up here to start the Star Engine! Come and get me if you dare, Sonic!"],
      ] },
    { title: "Engine Core", kind: "run", stage: "s-core",
      before: [
        ["tails", "The Tornado can get you as far as the station's outer hull. After that, you're on your own."],
        ["sonic", "Story of my life. Let's go!"],
        ["shadow", "I'm coming too. The Doctor has something that belongs to everyone."],
        ["sonic", "Ha! Look who decided to trust me."],
        ["shadow", "Don't push it."],
      ],
      beats: [
        [0.1, "tails", "Sonic, the Star Engine is right at the core! Follow the power lines in!"],
        [0.5, "eggman", "Welcome to the Egg Orbital, hedgehog! Every room on it is named after me, you know!"],
        [0.88, "shadow", "The engine room's ahead. Chaos Control!"],
      ],
      after: [
        [N, "At the heart of the station, the Star Engine turns, set all round with Red Star Rings. Dr. Eggman waits in front of it in the Egg Mobile."],
        ["eggman", "You're too late, Sonic! The Engine is running! Every scrap of power in the world is pouring into this station!"],
        ["sonic", "Funny thing about power, Eggman. It doesn't help much when the other guy's faster."],
      ] },
    { title: "The Star Engine", kind: "battle", arena: "station", allies: ["shadow"], foes: [{ who: "eggman", lvl: 2 }, { who: "metal", lvl: 1 }],
      before: [
        ["eggman", "With all the power in the world on my side, I can't lose! Metal Sonic, rise! We finish this together!"],
        ["metal", "(Metal Sonic rises behind him, sparking, its eyes burning red.)"],
        ["sonic", "Two of us, two of you. Let's do this!"],
      ],
      after: [
        ["eggman", "No way! I can't believe this! I had all the power in the world! I'll get you for this, Sonic!"],
        [N, "The Egg Mobile spins away into the dark. The Star Engine slows, shudders, and stops. One by one the Red Star Rings shake loose and fall back toward the world like shooting stars."],
        ["sonic", "Let them land wherever they want. Somebody out there could use a little luck."],
        [N, "Sonic's episode: the end. The other sides of the story are waiting."],
      ] },
  ] });

  // ==================================================================== Tails
  S.EPISODES.push({ who: "tails", title: "Radar Days", blurb: "A raided workshop, a radar to build, and a best friend to keep up with. Tails tracks every ring in the world.",
  chapters: [
    { title: "The Workshop", kind: "run", stage: "s-runway",
      before: [
        [N, "Tails' workshop, out by the airstrip. The hangar doors hang open, and something has been through it in a hurry."],
        ["tails", "Oh no. My tools are everywhere... and they took the Tornado's spare engine!"],
        ["tails", "There's a badnik carrying it down the runway! If it gets away, the Tornado won't fly for weeks."],
        ["tails", "Sonic's not here. That's okay. I can do this myself!"],
      ],
      beats: [
        [0.1, "tails", "There it is, past the belts! It's heading for the end of the runway!"],
        [0.5, "tails", "Come on, come on... I'm not letting you take my engine!"],
        [0.82, "tails", "Almost there... Don't you dare drop it!"],
      ],
      after: [
        ["tails", "Got it! The engine's fine. And look what the badnik dropped: a Red Star Ring!"],
        ["tails", "I'll scan it. ...Whoa. It doesn't just hold power, it pulls it in. My batteries went flat the moment I picked it up."],
        ["tails", "And all morning my instruments have been picking up readings just like this one, all over the world. I need to find Sonic!"],
      ] },
    { title: "Test Flight", kind: "run", stage: "airstrip",
      before: [
        [N, "That afternoon. Tails has built a ring radar out of the scanner and half a toaster. It needs testing, out on the airstrip."],
        ["tails", "If I'm right, every Red Star Ring sends out the same signal. Find the signal, find the rings."],
        ["sonic", "And if you're wrong?"],
        ["tails", "Then I've built a really fancy toaster. Watch the readings, Sonic!"],
      ],
      beats: [
        [0.15, "tails", "Signal's strong... the radar's working!"],
        [0.55, "sonic", "Badniks on the strip! Looks like Eggman wants your radar too."],
        [0.88, "tails", "Last bend! Nobody's taking this radar!"],
      ],
      after: [
        ["tails", "It works! It really works! There are rings everywhere: Amy's house, Guardian Peak, the city, the canyon..."],
        ["emerl", "...Radar. Radar!"],
        ["tails", "Uh, Sonic? Who's that, and why is it copying my radar?"],
        ["sonic", "That's Emerl. Found him this morning. He learns stuff by watching. And by fighting."],
      ] },
    { title: "Copy That", kind: "battle", arena: "airstrip", foes: [{ who: "emerl", lvl: 0 }],
      before: [
        [N, "Emerl spins its tails. Except it doesn't have tails. It spins anyway."],
        ["emerl", "Tails. Fly. ...Emerl, fly!"],
        ["tails", "Is it... challenging me? Okay. A friendly spar. I've always wanted to see how a machine this old works!"],
      ],
      after: [
        ["emerl", "...Tails. Strong. Clever."],
        ["tails", "Thanks! You too! It copied my Tail Swipe on the second try. Sonic, this thing is incredible. It must be thousands of years old."],
        ["sonic", "Then it's got thousands of years of catching up to do. Come on, both of you. Those rings won't find themselves."],
      ] },
    { title: "Signals at Sea", kind: "run", stage: "seabreeze",
      before: [
        [N, "The radar points back to Seabreeze Cape. One ring is still out there, along the sea cliffs, and Eggman's robots have found it too."],
        ["tails", "If I can get there first, Eggman's one ring short. Every ring counts!"],
      ],
      beats: [
        [0.2, "tails", "The signal's getting stronger... down by the water!"],
        [0.6, "eggman", "The fox! Get that radar off him!"],
        [0.9, "tails", "There it is!"],
      ],
      after: [
        ["tails", "Got it! That's one Eggman will never have."],
        ["tails", "But... the radar's picking up something strange from the forest. Near the Chao pools. Like a huge amount of water, moving on its own."],
      ] },
    { title: "The Water's Guardian", kind: "battle", arena: "springs", foes: [{ who: "chaos", lvl: 0 }],
      before: [
        [N, "The Chao pools under the old shrine. The Chao hide behind the stones. Out of the deepest pool rises a figure made of living water."],
        ["tails", "Chaos? I read about you in the old records. You protect the Chao..."],
        ["tails", "Wait, I'm not with Eggman! I'm just trying to... it's not listening!"],
      ],
      after: [
        [N, "Chaos sinks back into the water. It doesn't attack again. A Chao floats over and sits on Tails' head."],
        ["tails", "I think it was testing me. I think it believes me now."],
        ["tails", "It's guarding a ring at the bottom of the pool. Then that one stays here. Chaos will keep it safer than any of us could."],
      ] },
    { title: "Iron Hold", kind: "battle", arena: "depot", foes: [{ who: "gamma", lvl: 1 }],
      before: [
        [N, "Iron Hold Depot, under the mountains: where most of the rings have ended up. Tails comes to scout it. At the gate, a robot stands guard."],
        ["gamma", "Unit Chaos Gamma. Intruder detected. Leave, or be removed."],
        ["tails", "Built on E-102 Gamma's design... I've read your schematics! You don't have to do this!"],
        ["gamma", "Assignment: guard. Engaging."],
      ],
      after: [
        ["gamma", "...Damage report. You fight well, for a small unit."],
        ["tails", "I'm not here to hurt you. Eggman's engine will drain the power out of everything. Even you."],
        ["gamma", "Data noted. ...The prisoner said the same."],
        ["tails", "Prisoner? Amy! Amy's in there?"],
      ] },
    { title: "Tornado Escort", kind: "run", stage: "s-launch",
      before: [
        [N, "Metal Sonic is carrying the last rings up the launch track to Eggman's station. Sonic is right behind it, and Tails flies the Tornado alongside."],
        ["tails", "I can't land on the track, Sonic! I'll have to run it with you!"],
        ["sonic", "Then keep up, buddy!"],
      ],
      beats: [
        [0.15, "tails", "The badniks are coming down the track at us!"],
        [0.55, "sonic", "Keep going, Tails! You've got this!"],
        [0.9, "tails", "The dock! We made it!"],
      ],
      after: [
        ["tails", "Metal Sonic's waiting at the top. Sonic, I'll keep the Tornado ready. When you're done, we fly up to the station together."],
        ["sonic", "Deal."],
      ] },
    { title: "Hull Breach", kind: "run", stage: "stars",
      before: [
        [N, "Among the stars. The Tornado clings to the Egg Orbital's outer hull, and the station's defences have spotted it."],
        ["tails", "I need to get us inside before those turrets wreck the Tornado. Sonic, cover me!"],
      ],
      beats: [
        [0.2, "tails", "The hull track leads to a maintenance hatch... I think."],
        [0.6, "eggman", "A fox on my station?! Shoo! Shoo!"],
        [0.9, "tails", "There's the hatch!"],
      ],
      after: [
        ["tails", "We're in! The Star Engine's at the core. I can read its power lines from here."],
        ["eggman", "So, the little fox thinks he can stop my engine? I'll deal with you myself!"],
      ] },
    { title: "Engine Trouble", kind: "battle", arena: "station", allies: ["sonic"], foes: [{ who: "eggman", lvl: 1 }],
      before: [
        ["eggman", "You'll never shut down my Star Engine! I built it to be unstoppable!"],
        ["tails", "Every machine has an off switch, Eggman. Even yours."],
        ["sonic", "You heard him. Let's do this, Tails!"],
      ],
      after: [
        ["eggman", "No! My engine! My beautiful engine!"],
        ["tails", "Found it! Main power coupling... and off!"],
        [N, "The Star Engine slows, and stops. The Red Star Rings shake loose and fall back toward the world like shooting stars."],
        ["sonic", "Nice work, little buddy. Best radar in the world."],
        ["tails", "Best toaster, too. Tails' episode: the end."],
      ] },
  ] });

  // ==================================================================== Knuckles
  S.EPISODES.push({ who: "knuckles", title: "Guardian of the Peak", blurb: "A mountain to guard, rings that aren't his to lose, and a doctor who's very good at lying.",
  chapters: [
    { title: "Morning Watch", kind: "run", stage: "peak",
      before: [
        [N, "Guardian Peak, before dawn. Knuckles makes his rounds of the old echidna shrines, the way his people always did."],
        ["knuckles", "Seven Red Star Rings in the top shrine. They fell here before my people's time, and we've kept them safe ever since."],
        [N, "Far below, something is climbing the mountain. Lots of somethings."],
        ["knuckles", "Badniks. On my mountain. At this hour?! Right. Let's go."],
      ],
      beats: [
        [0.15, "knuckles", "They're everywhere. What's Eggman after?"],
        [0.55, "knuckles", "Nothing gets past me on this mountain!"],
        [0.9, "knuckles", "Last one. Hmph. Too easy."],
      ],
      after: [
        ["eggman", "Knuckles! Thank goodness I found you! I came all this way to warn you!"],
        ["knuckles", "Eggman. You've got five seconds to get off my mountain."],
        ["eggman", "Those weren't mine! They were Sonic's! He wants the rings in your shrines, every last one! He'll be here any second!"],
        ["knuckles", "Sonic? ...If he's after my shrines, he'll have to go through me."],
      ] },
    { title: "Tricked Again", kind: "battle", arena: "peak", foes: [{ who: "sonic", lvl: 1 }],
      before: [
        ["sonic", "Hey, Knuckles! Listen, Eggman's after the..."],
        ["knuckles", "Save it, Sonic! Nobody takes anything from these shrines while I'm guarding them!"],
        ["sonic", "Oh, come on. He tricked you again? Seriously?"],
      ],
      after: [
        ["knuckles", "Ha! Had enough?"],
        ["sonic", "Knuckles. Look up the mountain."],
        [N, "High on the slopes, a line of badniks is carrying the shrines' rings away. The Egg Mobile floats along behind them."],
        ["knuckles", "Eggman! He tricked me so I'd keep you busy! ...Again!"],
        ["knuckles", "No help, Sonic. This is my mountain. I'll handle it myself."],
      ] },
    { title: "Summit Shrines", kind: "run", stage: "s-shrines",
      before: [
        ["knuckles", "Up the mountain, through the snow, and every one of those robots goes down."],
        ["knuckles", "Nobody makes a fool of me twice in one day!"],
      ],
      beats: [
        [0.08, "eggman", "Hohoho! Thank you for your cooperation, Knuckles! I couldn't have done it without you!"],
        [0.45, "knuckles", "Laugh while you can, Eggman. I'm coming for you!"],
        [0.85, "knuckles", "There's the top shrine. Almost there!"],
      ],
      after: [
        ["knuckles", "That's the last of them. The rings are safe. ...Hey. There were seven of them in the top shrine. Now there are six."],
        ["rouge", "Six is still plenty, handsome. You won't miss one."],
        ["knuckles", "Rouge! Put that back!"],
        ["rouge", "If you want it, come and find me tonight in the city. Ciao!"],
      ] },
    { title: "Following the Bat", kind: "run", stage: "s-rooftops",
      before: [
        [N, "The city after midnight. Somewhere over the neon of the club street, a bat with a stolen ring is flying from rooftop to rooftop."],
        ["knuckles", "I can glide, too, Rouge. And I'm not stopping till I've got that ring back!"],
      ],
      beats: [
        [0.12, "knuckles", "There she goes, over the signs! Hey! Get back here!"],
        [0.5, "rouge", "Keep up, Knuckles! A girl could get bored!"],
        [0.88, "knuckles", "The club roof. You're cornered now!"],
      ],
      after: [
        ["rouge", "You actually followed me all the way here. I'm almost flattered."],
        ["knuckles", "The ring. Now."],
        ["rouge", "So persistent. Fine. Beat me, and it's yours."],
      ] },
    { title: "Night Moves", kind: "battle", arena: "club", foes: [{ who: "rouge", lvl: 1 }],
      before: [
        ["knuckles", "I'm not going easy on you just because you're a thief!"],
        ["rouge", "Treasure hunter, sweetie. Get it right."],
      ],
      after: [
        ["rouge", "Okay, okay! You win, knucklehead. Here's your little ring."],
        ["knuckles", "Why'd you even take it?"],
        ["rouge", "Government work. They want to know where Eggman's taking all the rings. And now, thanks to you chasing me across town, so do I: an old depot under the mountains. Iron Hold."],
        ["knuckles", "Then that's where the rest of my shrine's rings went. ...Hold on. You WORK for the government?!"],
      ] },
    { title: "Old Stones", kind: "battle", arena: "peak", foes: [{ who: "emerl", lvl: 1 }],
      before: [
        [N, "On his way to Iron Hold, Knuckles passes the old shrine at the foot of Guardian Peak, and finds a little machine copying the carvings on its walls."],
        ["emerl", "...Old. Like Emerl. Old."],
        ["knuckles", "Those carvings... my people's stories talk about machines like you. The Gizoids. Warriors that copied every fighter they ever met."],
        ["emerl", "Fight. Learn. ...Fight Knuckles!"],
        ["knuckles", "Ha! You want to learn from the best? Then pay attention!"],
      ],
      after: [
        ["emerl", "...Strong. Knuckles, strong."],
        ["knuckles", "You're not bad yourself. You hit like a train, for something that size."],
        ["knuckles", "Stay out of trouble, kid. Eggman would love to get his hands on something like you."],
      ] },
    { title: "Underground", kind: "run", stage: "s-vault",
      before: [
        [N, "Iron Hold Depot. Knuckles doesn't bother with the front door. He digs straight down through the mountain, and comes up inside the vault corridor."],
        ["knuckles", "My shrine's rings are in here somewhere. Nobody locks up what my people kept safe for a thousand years!"],
      ],
      beats: [
        [0.15, "knuckles", "A maze of corridors. Typical Eggman."],
        [0.55, "eggman", "The echidna?! How did he get in? I built this place out of solid rock!"],
        [0.9, "knuckles", "That door. That's the vault."],
      ],
      after: [
        [N, "A robot steps out in front of the vault door. Its cannon arm hums."],
        ["gamma", "Unit Chaos Gamma. You are not authorized."],
        ["knuckles", "I'm authorized to knock you flat. Out of my way!"],
      ] },
    { title: "Unit Gamma", kind: "battle", arena: "depot", foes: [{ who: "gamma", lvl: 1 }],
      before: [
        ["gamma", "Assignment: guard the vault. The Doctor's orders."],
        ["knuckles", "Eggman lies to everyone, you know. He lied to me this morning. Twice."],
        ["gamma", "...Query noted. Engaging."],
      ],
      after: [
        ["gamma", "...You are right. The Doctor lies. The prisoner told me the same."],
        ["amy", "Knuckles! You came too! Gamma's on our side now. The vault's open!"],
        ["knuckles", "Huh. Okay then. The shrine's rings come with me. All of them."],
        ["gamma", "Report: the last shipment has already left. The robot in Sonic's shape is carrying it to the Doctor's station."],
      ] },
    { title: "Tricked No More", kind: "battle", arena: "station", foes: [{ who: "eggman", lvl: 2 }],
      before: [
        [N, "The Egg Orbital. Knuckles reaches the engine room by a back way, and finds Eggman alone."],
        ["eggman", "Knuckles! Thank goodness! Sonic has gone mad, he's going to blow up the whole station! Help me stop him!"],
        ["knuckles", "..."],
        ["eggman", "...He's right behind you!"],
        ["knuckles", "Nice try, Eggman. Fool me once. Fool me twice. Fool me three times... not today!"],
      ],
      after: [
        ["eggman", "No! How?! You always fall for it!"],
        ["knuckles", "Not anymore. The rings go back where they fell. Every one."],
        [N, "The Star Engine stops. The rings fall back toward the world, and the six on Guardian Peak come home to their shrine. Seven, now."],
        ["rouge", "Seven? I gave you one. Funny, that."],
        ["knuckles", "ROUGE! ...Knuckles' episode: the end."],
      ] },
  ] });

  // ==================================================================== Amy
  S.EPISODES.push({ who: "amy", title: "Lucky Stars", blurb: "Her fortune cards promised a shining star. Amy means to make sure the cards were right.",
  chapters: [
    { title: "Fortune Cards", kind: "run", stage: "s-teacup",
      before: [
        [N, "Amy's house. To a badnik the size of a teacup, her parlour is a whole country."],
        ["amy", "Hey! Get off my bookshelf! Those are my favourite books!"],
        ["amy", "This morning my fortune cards said a shining star would fall into my life. And then a star ring came right through my window! It has to be a sign."],
        ["amy", "A sign that Sonic and I are meant to be together. Obviously! Piko Piko Hammer, let's tidy up!"],
      ],
      beats: [
        [0.1, "amy", "Shoo! Out of my kitchen! Out, out, out!"],
        [0.45, "amy", "They're after my fortune cards too?! That does it!"],
        [0.85, "amy", "There's my star ring! Nobody touches my lucky charm!"],
      ],
      after: [
        ["sonic", "Amy! You okay? Tails' radar said there was a Red Star Ring here."],
        ["amy", "Sonic! You came to save me! ...Well, I already saved me. But it's the thought that counts!"],
        ["amy", "It's my lucky charm, Sonic. If you want it, you'll have to win it! And if I win, you take me on a date."],
      ] },
    { title: "A Date at Stake", kind: "battle", arena: "parlour", foes: [{ who: "sonic", lvl: 0 }],
      before: [
        ["sonic", "Why does everything with you end in a date?"],
        ["amy", "Because it's fate, silly! Ready, Sonic? And don't you dare go easy on me!"],
      ],
      after: [
        ["amy", "I won! I won! That means a date!"],
        ["sonic", "Okay, okay. A date. After we stop Eggman. Deal?"],
        ["amy", "Deal! And you can keep the ring, since you're going to need it. See? Lucky charm."],
        ["tails", "Guys! A ring just turned up on the radar at the museum, and so did a lot of badniks!"],
        ["amy", "The museum? Cream said she'd be there today!"],
      ] },
    { title: "To the Museum", kind: "run", stage: "museum",
      before: [
        [N, "Petal Hall Museum. Amy runs the long way round, through the halls, to find Cream."],
        ["amy", "Hang on, Cream! I'm coming!"],
      ],
      beats: [
        [0.2, "amy", "Badniks in the museum? Don't they know you're supposed to whisper?!"],
        [0.6, "amy", "Out of the way! I have a friend to find!"],
        [0.9, "amy", "The gallery's just upstairs!"],
      ],
      after: [
        ["cream", "Miss Amy! We saved the star ring from the robots, but now there's a lady with wings who wants it!"],
        ["rouge", "Lady. I like this kid. Now, sweetie, be a dear and hand over that ring."],
        ["amy", "Not a chance, Rouge. Cream, let's show her how we do things!"],
      ] },
    { title: "Hands Off!", kind: "battle", arena: "museum", allies: ["cream"], foes: [{ who: "rouge", lvl: 1 }],
      before: [
        ["rouge", "Two against one? That hardly seems fair. For you."],
        ["amy", "You wish!"],
      ],
      after: [
        ["rouge", "Fine, fine. Keep your little ring. I only wanted to know who's buying them, anyway."],
        ["cream", "The robots took one ring away, Miss Amy. They flew off toward the pools in the forest where the Chao live."],
        ["amy", "The Chao? Then that's where we're going. You were really brave, Cream."],
      ] },
    { title: "Water Spirit", kind: "battle", arena: "springs", foes: [{ who: "chaos", lvl: 1 }],
      before: [
        [N, "The Chao pools. Eggman's pumps lie broken by the water, and out of the deepest pool rises a figure of living water."],
        ["amy", "Whoa! Is that... Chaos? Hey, we're friends! We're here to help the Chao!"],
        ["cream", "Miss Amy, I don't think it understands!"],
        ["amy", "Then I'll make it understand. Gently. Sort of!"],
      ],
      after: [
        [N, "Chaos settles back into the pool. The Chao gather around Cream and Cheese, and Chaos watches them, still."],
        ["amy", "It was only protecting them. It wants the ring to stay down there, with them."],
        ["cream", "Then we'll leave it with Mr. Chaos."],
        ["amy", "Right. And now Eggman's base. Tails says it's under the mountains. I'm going in. Right now!"],
      ] },
    { title: "Iron Hold", kind: "run", stage: "s-vault",
      before: [
        [N, "Iron Hold Depot. Amy didn't wait for anyone. She's already in the corridors, hammer first."],
        ["amy", "Eggman's got most of the rings in here. If I get them back, Sonic will HAVE to be impressed!"],
      ],
      beats: [
        [0.15, "amy", "Left... or right... I'll just go through the wall!"],
        [0.55, "eggman", "The pink one?! Gamma! Stop her!"],
        [0.9, "amy", "The vault! Almost there!"],
      ],
      after: [
        [N, "A robot steps out in front of the vault. Its cannon arm hums."],
        ["gamma", "Unit Chaos Gamma. Intruder. You will be detained."],
        ["amy", "You look just like... E-102 Gamma. He was my friend. You're not going to hurt me, are you?"],
      ] },
    { title: "A Kind Word", kind: "battle", arena: "depot", foes: [{ who: "gamma", lvl: 1 }],
      before: [
        ["gamma", "Assignment: guard the vault. Detain all intruders."],
        ["amy", "Okay. If you want a fight, you'll get one. But then you're going to listen to me!"],
      ],
      after: [
        ["gamma", "...Systems damaged. Query: why do you not finish me?"],
        ["amy", "Because you don't have to do everything he tells you. That Star Engine will drain the power out of everything: the animals in his badniks, the Chao, you. You're not like the others."],
        ["gamma", "...Data found. An old unit of my line once made this same choice. New assignment: protect the girl. Stop the Star Engine."],
        ["amy", "I knew you were a good one!"],
      ] },
    { title: "Together", kind: "battle", arena: "stars", allies: ["sonic"], foes: [{ who: "metal", lvl: 1 }],
      before: [
        [N, "The top of the launch track, among the stars. Metal Sonic waits, with the last case of rings, and Sonic is facing it alone. Not for long."],
        ["amy", "Sonic! I'm here! Two Sonics, one hammer. Let's go!"],
        ["sonic", "Amy?! How did you even get up here?"],
        ["amy", "Love finds a way!"],
      ],
      after: [
        [N, "Metal Sonic staggers, sparking. The case of rings slides away across the track."],
        ["sonic", "Okay. That was actually really helpful, Amy."],
        ["amy", "I KNOW! Now, Eggman's station. And then, our date!"],
      ] },
    { title: "Hammer Down", kind: "battle", arena: "station", allies: ["gamma"], foes: [{ who: "eggman", lvl: 2 }],
      before: [
        [N, "The heart of the Egg Orbital. The Star Engine turns, set all round with Red Star Rings, and Eggman waits in front of it."],
        ["eggman", "Gamma?! You traitor! And you, girl, you'll pay for turning my robot against me!"],
        ["gamma", "Correction. I chose."],
        ["amy", "You heard him. Time for the Piko Piko Hammer!"],
      ],
      after: [
        ["eggman", "No way! I can't believe this! Beaten by a hammer! AGAIN!"],
        [N, "The Star Engine slows, and stops. The Red Star Rings shake loose and fall toward the world like shooting stars."],
        ["amy", "Look, Gamma. Shooting stars. Make a wish!"],
        ["gamma", "...Wish registered: that the girl gets her date."],
        ["amy", "Gamma! You're the best! Amy's episode: the end."],
      ] },
  ] });
})(typeof globalThis !== "undefined" ? globalThis : this);
