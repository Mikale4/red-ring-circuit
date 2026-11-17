/*
 * Red Ring Circuit: "The Red Star Rings", the third part of the episodes (Dr. Eggman, Metal
 * Sonic, Mighty, Silver and Emerl). The format is in adventure-story.js. In Emerl's episode, each
 * battle won teaches him moves of the one he beat (`teach`: he learns one or two of theirs he
 * doesn't have yet); nowhere else does he learn.
 */
(function (root) {
  "use strict";
  const N = "";
  const S = root.AdventureStory = root.AdventureStory || { TITLE: "The Red Star Rings", EPISODES: [] };

  // ==================================================================== Dr. Eggman
  S.EPISODES.push({ who: "eggman", title: "The Eggman Empire", blurb: "Thirty-nine Red Star Rings, one Star Engine, and the greatest genius the world has ever known. What could possibly go wrong?",
  chapters: [
    { title: "The Dig", kind: "run", stage: "s-dig",
      before: [
        [N, "Seabreeze Cape, first thing in the morning. Dr. Eggman's dig rig is chewing up the clifftop."],
        ["eggman", "Thirty-nine Red Star Rings have fallen on this world, and every one of them holds a star's worth of power!"],
        ["eggman", "Set them all in my Star Engine, and I'll have power without end! I'll never lose again! Hohoho!"],
        [N, "A badnik turns around, beeps, and fires at him."],
        ["eggman", "What?! My badniks' recognition chips are on the blink! They think I'M the intruder!"],
        ["eggman", "Bah! I'll fix them later. A genius with an IQ of 300 can handle a few malfunctions himself!"],
      ],
      beats: [
        [0.1, "eggman", "Shoo! Shoo! I'm your creator, you ungrateful scrap heaps!"],
        [0.45, "eggman", "Ah, the dig is going splendidly. Nothing could possibly ruin this day."],
        [0.94, "eggman", "The dig rig! And there's... a blue blur heading this way. Of course there is."],
      ],
      after: [
        ["sonic", "Morning, Eggman! Digging for something?"],
        ["eggman", "Sonic! Not today, hedgehog! Today I have a brand-new Egg Mobile and a VERY bad temper!"],
        ["sonic", "So, just a normal day, then."],
      ] },
    { title: "That Hedgehog", kind: "battle", arena: "seabreeze", foes: [{ who: "sonic", lvl: 1 }],
      before: [
        ["eggman", "Get a load of THIS!"],
        ["sonic", "Show me what you've got, Egghead!"],
      ],
      after: [
        ["eggman", "Hohoho! Beaten at last! Now hand over that ring, you pest!"],
        ["sonic", "Ow. Okay, that was a good one. ...Catch!"],
        [N, "Sonic tosses something shiny high in the air. Eggman lunges for it. It's a pebble. When he looks back, Sonic is gone, ring and all."],
        ["eggman", "THAT HEDGEHOG! ...No matter. There are rings all over this world, and I know exactly where the next batch is: Guardian Peak!"],
      ] },
    { title: "The Mountain", kind: "run", stage: "peak",
      before: [
        [N, "Guardian Peak. Seven Red Star Rings rest in the old shrine at the top, guarded by Knuckles the Echidna."],
        ["eggman", "Knuckles is strong. But he believes anything you tell him with a straight face. A simple plan: I tell him Sonic is coming to steal the rings..."],
        ["eggman", "...and while those two knock each other silly, my badniks walk off with the lot! Genius!"],
      ],
      beats: [
        [0.15, "eggman", "Up, up, up! Even a genius gets puffed out on a mountain."],
        [0.55, "eggman", "There they go, fighting each other. Like clockwork! Hohoho!"],
        [0.92, "eggman", "The shrine. Seven rings. Badniks, pack them up!"],
      ],
      after: [
        [N, "The badniks march off down the mountain with the rings. Then the snow crunches behind Eggman."],
        ["knuckles", "EGGMAN! You tricked me! AGAIN!"],
        ["eggman", "Ah. Knuckles. Hello. Lovely weather for it."],
      ] },
    { title: "Lovely Weather", kind: "battle", arena: "peak", foes: [{ who: "knuckles", lvl: 1 }],
      before: [
        ["knuckles", "Give back my shrine's rings, or I'll punch you all the way to the moon!"],
        ["eggman", "Funny you should say that. That's EXACTLY where they're going!"],
      ],
      after: [
        ["knuckles", "Grr... come back here!"],
        ["eggman", "Hohoho! Thank you for your cooperation, Knuckles! I couldn't have done it without you!"],
        [N, "The Egg Mobile zooms off down the mountain after the badniks. Nearly all of the rings go with it. Nearly."],
        ["eggman", "Now. That fox of Sonic's has built some sort of radar. And I want it."],
      ] },
    { title: "The Radar", kind: "battle", arena: "airstrip", foes: [{ who: "tails", lvl: 1 }],
      before: [
        [N, "The airstrip. Tails is testing his ring radar, and Eggman arrives in a hurry."],
        ["eggman", "Hand over that radar, fox, and nobody gets hurt! Mainly you!"],
        ["tails", "No way! I built it to stop you!"],
      ],
      after: [
        ["tails", "Ugh... You're not getting it!"],
        ["eggman", "I don't need it! My Egg Mobile copied every reading off that radar while we fought! Every ring it found is on MY map now!"],
        ["eggman", "Amy's house, the museum, the city, the springs, the canyon... Hohoho! Badniks! Fetch them all!"],
      ] },
    { title: "Blasting Site", kind: "run", stage: "s-blasting",
      before: [
        [N, "Redstone Canyon. The radar says the cliffs are full of rings. Eggman's solution: blow up the cliffs."],
        ["eggman", "Subtlety is for people without explosives!"],
      ],
      beats: [
        [0.15, "eggman", "Fire in the hole! ...Why is the hole firing BACK?"],
        [0.55, "eggman", "These badniks are going to be the death of me. Recognition chips! I'm putting them first on the list!"],
        [0.92, "eggman", "And THERE'S a ring. Right in the rock. Blast it!"],
      ],
      after: [
        [N, "The cliff comes down. When the dust settles, a red and black armadillo is standing in the rubble, with his fists up."],
        ["mighty", "That's enough, Eggman! This canyon's been here for a thousand years. I'm not letting you blow it to pieces!"],
        ["eggman", "Mighty? The tree-hugger? Out of my way, you overgrown hedge!"],
      ] },
    { title: "Rock and a Hard Place", kind: "battle", arena: "canyon", foes: [{ who: "mighty", lvl: 1 }],
      before: [
        ["mighty", "I don't like fighting. But I like you wrecking this place even less!"],
        ["eggman", "Then let me make this quick! Get a load of THIS!"],
      ],
      after: [
        ["mighty", "Ugh... you're tougher than you look, Doc."],
        ["eggman", "Of course I am! I'm Dr. Eggman! Badniks, take the rings to Iron Hold. And somebody bring me a towel."],
      ] },
    { title: "Mutiny", kind: "battle", arena: "depot", foes: [{ who: "gamma", lvl: 2 }],
      before: [
        [N, "Iron Hold Depot. Eggman comes home to find the vault open, the prisoner gone, and his newest robot standing in the doorway."],
        ["eggman", "Gamma! What is the meaning of this? Back to your post!"],
        ["gamma", "Negative. New assignment: stop the Star Engine."],
        ["eggman", "You traitor! I gave you the best parts money could buy!"],
        ["gamma", "You gave me parts. She gave me a choice."],
      ],
      after: [
        ["eggman", "Hah! You thought you could beat ME, your own creator?! I know every bolt in your body!"],
        [N, "Gamma reels back, sparking, and hovers off up the corridor. Eggman doesn't chase it. He has more pressing things to do."],
        ["eggman", "Metal Sonic! Take the last rings up to the Egg Orbital! It's time to start the Star Engine!"],
      ] },
    { title: "The Star Engine", kind: "battle", arena: "station", allies: ["metal"], foes: [{ who: "sonic", lvl: 2 }, { who: "shadow", lvl: 2 }],
      before: [
        [N, "The Egg Orbital, among the stars. The Star Engine turns at its heart, set all round with Red Star Rings, and every scrap of power in the world is pouring up into it."],
        ["eggman", "Too late, Sonic! The Engine is running! With all the power in the world on my side, I can't lose!"],
        ["sonic", "Funny thing about power, Eggman. It doesn't help much when the other guy's faster."],
        ["shadow", "Two of us. Two of you. End this, Doctor."],
        ["eggman", "Metal Sonic, rise! We finish this together!"],
      ],
      after: [
        ["eggman", "I... I WON! I actually won! Hohoho! Do you see, hedgehogs?! The power of the Star Engine is..."],
        [N, "The lights flicker. The floor shudders. The Star Engine is still pulling in power, from the world, from the station, from Eggman's own machines."],
        ["eggman", "...is draining the station. Hmm. I might not have thought that part all the way through."],
        [N, "The engine shakes itself loose from its mountings. The Red Star Rings burst out of it and fall back toward the world like shooting stars, every last one."],
        ["eggman", "No way! I can't believe this! I beat them, and I STILL lose?!"],
        ["sonic", "Want a lift, Eggman? Tails brought the Tornado."],
        ["eggman", "...Just this once. And I'll get you for this, Sonic! Dr. Eggman's episode: the end."],
      ] },
  ] });

  // ==================================================================== Metal Sonic
  S.EPISODES.push({ who: "metal", title: "Second to None", blurb: "Eggman's copy of Sonic was built for one thing: to be the fastest. Metal Sonic never speaks. It runs.",
  chapters: [
    { title: "The Convoy", kind: "run", stage: "s-convoy",
      before: [
        [N, "Evening. The expressway out of the city. Eggman's trucks roar along it, loaded with Red Star Rings, and at the head of the convoy runs Metal Sonic."],
        ["eggman", "Metal Sonic! Get those rings to Iron Hold! And if anybody tries to stop you..."],
        ["metal", "(Its eyes flare red. It understands.)"],
      ],
      beats: [
        [0.15, "eggman", "Faster, Metal! Faster!"],
        [0.55, "metal", "(Something black and red is closing in from behind. Metal Sonic doesn't look back.)"],
        [0.92, "metal", "(The convoy is stopping. Something is on the road ahead.)"],
      ],
      after: [
        [N, "Shadow stands across the road. The trucks stop. Metal Sonic does not."],
        ["shadow", "So you're the one who ran at the head of the convoy. A copy of Sonic."],
        ["metal", "(It drops into a crouch. Its jet flares.)"],
      ] },
    { title: "Faster", kind: "battle", arena: "expressway", foes: [{ who: "shadow", lvl: 2 }],
      before: [
        ["shadow", "A copy, built to beat the original. I wonder how you'll do against me."],
        ["metal", "(Metal Sonic's eyes burn brighter.)"],
      ],
      after: [
        ["shadow", "Tch... You're faster than I thought."],
        [N, "Metal Sonic is already gone, the crates of rings strapped to its back, the convoy left behind. Its trail leads into Redstone Canyon."],
      ] },
    { title: "Redstone Canyon", kind: "run", stage: "canyon",
      before: [
        [N, "Redstone Canyon. Eggman's blasting has shaken the cliffs, and Metal Sonic's route runs through the rubble."],
        ["eggman", "Take the canyon road, Metal! Nobody's fast enough to follow you there!"],
      ],
      beats: [
        [0.2, "metal", "(Its jet scorches the cliff walls. It doesn't slow down.)"],
        [0.6, "metal", "(Something ahead. A light, cyan, hovering above the canyon floor.)"],
        [0.92, "silver", "A blue hedgehog... carrying the rings. It's you!"],
      ],
      after: [
        [N, "A silver hedgehog floats down in front of Metal Sonic, his hands glowing."],
        ["silver", "Our records say a blue hedgehog brings the last ring to the engine. But you're... you're not Sonic at all. You're a machine!"],
        ["silver", "It was you. It was always you! I won't let you reach that engine!"],
      ] },
    { title: "The Records", kind: "battle", arena: "canyon", foes: [{ who: "silver", lvl: 1 }],
      before: [
        ["silver", "For my future!"],
        ["metal", "(It sets down the rings, and turns to face him.)"],
      ],
      after: [
        ["silver", "No... it's too strong..."],
        [N, "Metal Sonic picks up the rings and runs. Behind it, Silver struggles to his feet."],
        ["silver", "I have to warn Sonic. It's the copy. It was the copy all along!"],
      ] },
    { title: "Last Shipment", kind: "battle", arena: "depot", foes: [{ who: "gamma", lvl: 2 }],
      before: [
        [N, "Iron Hold Depot. Metal Sonic comes for the last case of rings, to take them up to the station. In the loading bay, Chaos Gamma is waiting."],
        ["gamma", "Unit Metal Sonic. Halt. Those rings will not reach the Doctor."],
        ["eggman", "Gamma, you traitor! Metal Sonic, scrap him!"],
      ],
      after: [
        ["gamma", "...Systems critical. Unit Metal Sonic is... faster than projected."],
        [N, "Metal Sonic lifts the last case of rings onto its back. The launch track is waiting, and at the top of it, the stars."],
      ] },
    { title: "The Launch Track", kind: "run", stage: "s-launch",
      before: [
        [N, "The launch track runs all the way up into the sky, to the Egg Orbital. Metal Sonic runs it with the last rings."],
        [N, "And behind it, getting closer, comes a blue hedgehog."],
        ["sonic", "Hey, copycat! Wait up!"],
      ],
      beats: [
        [0.15, "eggman", "Faster, Metal! Show them who the real fastest thing alive is!"],
        [0.55, "sonic", "Not bad, Metal! Not good enough, either!"],
        [0.9, "metal", "(The dock. Metal Sonic got there first. It turns around.)"],
      ],
      after: [
        ["sonic", "Okay, copycat. End of the line."],
        ["metal", "(Its eyes burn red. Nothing, nothing in the world, has ever mattered as much as this.)"],
      ] },
    { title: "The Real Thing", kind: "battle", arena: "stars", foes: [{ who: "sonic", lvl: 2 }],
      before: [
        ["sonic", "You've been second best your whole life, Metal. Let's keep it that way."],
        ["metal", "(It drops into a crouch. Its jet flares.)"],
      ],
      after: [
        ["sonic", "Ugh... okay... you've gotten better..."],
        [N, "For one moment, Metal Sonic stands over Sonic, among the stars. The fastest thing alive."],
        ["eggman", "Magnificent, Metal! Now bring those rings to the core! It's time to start the Star Engine!"],
      ] },
    { title: "Engine Core", kind: "run", stage: "s-core",
      before: [
        [N, "The Egg Orbital. Metal Sonic carries the last rings through the station, toward the Star Engine at its heart."],
        ["eggman", "Hurry, Metal! Sonic's friends are all over my station, and they're touching EVERYTHING!"],
      ],
      beats: [
        [0.15, "eggman", "The fox is in the hull! The echidna's in the vents! Why does nobody use the DOOR?!"],
        [0.55, "metal", "(The power lines in the walls pulse brighter. The engine is waiting.)"],
        [0.9, "metal", "(The engine room. And someone in the doorway.)"],
      ],
      after: [
        [N, "Shadow stands between Metal Sonic and the Star Engine."],
        ["shadow", "So, we meet again, copy. This time, you don't get away."],
      ] },
    { title: "Second to None", kind: "battle", arena: "station", foes: [{ who: "shadow", lvl: 2 }],
      before: [
        ["shadow", "You were built to beat Sonic. But you'll never BE him. You'll never be anyone but the Doctor's machine."],
        ["metal", "(Metal Sonic sets down the last case of rings, very carefully. Then it turns.)"],
      ],
      after: [
        ["shadow", "...Hmph. Impressive. For a machine."],
        [N, "Metal Sonic sets the last rings into the Star Engine. It roars into life. The lights of the Egg Orbital blaze. Then they flicker."],
        [N, "The engine is pulling in too much power, from the world, from the station, and from Metal Sonic itself. Its own core dims. It sinks to one knee."],
        [N, "Then the engine shakes itself apart, and the Red Star Rings fall back toward the world like shooting stars."],
        [N, "Metal Sonic watches them go, from the edge of the station. It was faster than all of them, today. Somehow, it is never enough."],
        [N, "Metal Sonic's episode: the end."],
      ] },
  ] });

  // ==================================================================== Mighty
  S.EPISODES.push({ who: "mighty", title: "Canyon Wanderer", blurb: "Mighty the Armadillo just wanted a quiet walk through Redstone Canyon. Then Eggman started blowing it up.",
  chapters: [
    { title: "Redstone Canyon", kind: "run", stage: "canyon",
      before: [
        [N, "Redstone Canyon. Mighty the Armadillo is passing through, the way he does, on his long walk around the world."],
        ["mighty", "Every time I come back, the canyon's a little different. The river carves it a bit deeper every year."],
        [N, "BOOM. A whole cliff comes down at the end of the canyon."],
        ["mighty", "...That wasn't the river."],
      ],
      beats: [
        [0.15, "mighty", "Badniks? Out here? I'd know those anywhere."],
        [0.55, "mighty", "The blasts are coming from further up. Somebody's blowing up the cliffs!"],
        [0.92, "mighty", "There it is. A whole blasting site."],
      ],
      after: [
        ["mighty", "Eggman. Of course. Blowing a hole in a thousand years of rock, for some shiny rings."],
        ["mighty", "I don't like fighting. But I don't like this even more."],
      ] },
    { title: "Blasting Site", kind: "run", stage: "s-blasting",
      before: [
        [N, "Eggman's blasting site. Drills, charges and badniks, all over the canyon floor."],
        ["mighty", "Time to put a stop to this. Gently, if I can. Not gently, if I can't."],
      ],
      beats: [
        [0.15, "eggman", "Who's that wrecking my drills? Mighty?! Get him!"],
        [0.55, "mighty", "Sorry, little guys. You're getting recycled."],
        [0.92, "mighty", "And that's the last charge disarmed."],
      ],
      after: [
        ["eggman", "My blasting site! Do you know how much those drills cost?!"],
        ["mighty", "Less than this canyon, Doc. Pack it up and go home."],
        ["eggman", "Never! Get a load of THIS!"],
      ] },
    { title: "Pack It Up", kind: "battle", arena: "canyon", foes: [{ who: "eggman", lvl: 1 }],
      before: [
        ["eggman", "I'll flatten you, and then I'll flatten this whole canyon!"],
        ["mighty", "Not while I'm standing, you won't."],
      ],
      after: [
        ["eggman", "Ugh! Fine! Keep your rocks! I've got all the rings I need from here anyway!"],
        [N, "The Egg Mobile wobbles away toward the mountains. Mighty dusts himself off, and the canyon goes quiet."],
        [N, "Then a hedgehog drops out of the sky in a flash of cyan light, right in front of him."],
        ["silver", "Excuse me! I'm looking for a blue hedgehog. Very fast. Have you seen him?"],
      ] },
    { title: "Questions", kind: "battle", arena: "canyon", foes: [{ who: "silver", lvl: 1 }],
      before: [
        ["mighty", "You mean Sonic? Sure, I know him. Why?"],
        ["silver", "Because in my time, he brings the last ring to an engine that drains the world. I have to stop him!"],
        ["mighty", "Sonic? No way. You've got the wrong hedgehog, friend. And I'm not telling you where he is."],
        ["silver", "Then I'll have to make you!"],
      ],
      after: [
        ["silver", "...You'd really fight for him? Even knowing what I know?"],
        ["mighty", "I've known Sonic a long time. He'd never help Eggman. Whatever your records say, they're wrong."],
        ["silver", "Then... I need to see for myself."],
        ["sonic", "See what? Hey, Mighty! Long time no see!"],
      ] },
    { title: "Old Friends", kind: "battle", arena: "canyon", foes: [{ who: "sonic", lvl: 1 }],
      before: [
        ["mighty", "Sonic! I was just telling this kid you're a good guy."],
        ["sonic", "I am a good guy! Hey, it's been ages. Want to see if you've still got it?"],
        ["mighty", "A friendly spar? You're on!"],
      ],
      after: [
        ["sonic", "Whoa! You've been working out!"],
        ["mighty", "All that walking. Hey, Sonic, Eggman's machine came through here, the one that looks like you. It went toward the mountains with a load of rings."],
        ["sonic", "Metal Sonic. Thanks, Mighty. Come on, Silver, let's go find out who your records are really about!"],
        [N, "Sonic and Silver race off. Mighty looks down at the river. It's running thin. The rubble from the blasting has dammed it."],
        ["mighty", "The river feeds the springs in the forest. If it dries up, so do the pools. I'd better go and see."],
      ] },
    { title: "The Springs", kind: "run", stage: "springs",
      before: [
        [N, "Moonwell Springs, in the forest, where the wild Chao live. The water is low, and Eggman's pumps are sucking up what's left."],
        ["mighty", "The Chao's home. Hold on, little guys!"],
      ],
      beats: [
        [0.2, "mighty", "These pumps have to go. All of them."],
        [0.6, "mighty", "Out of the way, badniks!"],
        [0.92, "mighty", "The deepest pool. And... something's coming up out of it."],
      ],
      after: [
        [N, "Out of the deepest pool rises a figure made of living water. Its eyes glow green, and it has seen too many strangers today."],
        ["mighty", "Whoa, whoa! Easy, friend! I'm on your side!"],
      ] },
    { title: "Water and Stone", kind: "battle", arena: "springs", foes: [{ who: "chaos", lvl: 1 }],
      before: [
        [N, "Chaos doesn't answer. It never does."],
        ["mighty", "Okay. I guess we're doing this."],
      ],
      after: [
        [N, "Chaos sinks back. Mighty sits down in the grass, catching his breath. A Chao toddles over and climbs onto his shell."],
        ["mighty", "See? Friends. I'm going to clear the river for you. Promise."],
        [N, "Chaos watches him for a long moment. Then it rises, and points toward the mountains, where the pumped water has been taken."],
        ["mighty", "Eggman's base. Iron Hold. Got it."],
      ] },
    { title: "Iron Hold", kind: "run", stage: "s-vault",
      before: [
        [N, "Iron Hold Depot. Mighty walks in through the front gate, which is a mistake, but he's very hard to stop."],
        ["mighty", "Excuse me. Coming through."],
      ],
      beats: [
        [0.15, "eggman", "The armadillo?! Is EVERYONE coming to my base today?!"],
        [0.55, "mighty", "Water tanks! He's been storing the springs' water in here!"],
        [0.92, "mighty", "And there's the drain valve. Let it all go home!"],
      ],
      after: [
        [N, "The tanks empty into the old channels under the mountain, back down to the river, back to the springs."],
        ["tails", "Mighty?! It's Tails! Sonic's gone up to Eggman's station after Metal Sonic, and he could use a hand. The Tornado's at the airstrip!"],
        ["mighty", "A space station? Well. I've walked everywhere else."],
      ] },
    { title: "Mighty Strong", kind: "battle", arena: "station", allies: ["sonic"], foes: [{ who: "metal", lvl: 2 }],
      before: [
        [N, "The Egg Orbital. Metal Sonic stands between Sonic and the engine room, and Sonic is out of breath."],
        ["mighty", "Need a hand, Sonic?"],
        ["sonic", "Mighty! Perfect timing! You take the left, I'll take the right!"],
        ["mighty", "Which one's the real you again?"],
        ["sonic", "The one that ISN'T trying to kill us!"],
      ],
      after: [
        [N, "Metal Sonic goes down in a shower of sparks. In the engine room, the Star Engine stutters, and stops. The Red Star Rings fall back toward the world like shooting stars."],
        ["sonic", "Nice work, Mighty! Want to stick around? We could use somebody like you."],
        ["mighty", "Thanks, Sonic. But there's a canyon down there with a river that needs clearing, and a lot of Chao waiting on it."],
        [N, "That evening, the river runs full through Redstone Canyon again, carving it a little deeper, the way it always has."],
        ["mighty", "That's more like it. Mighty's episode: the end."],
      ] },
  ] });

  // ==================================================================== Silver
  S.EPISODES.push({ who: "silver", title: "The Last Ring", blurb: "Two hundred years from now, the world has gone dark. Silver comes back to stop the one who brought the last ring.",
  chapters: [
    { title: "The Last Street", kind: "run", stage: "s-laststreet",
      before: [
        [N, "Two hundred years from now. The last city still standing has one street with the lights on. Every year, it gets darker."],
        ["silver", "Long ago, a machine up in the stars drained the power out of the world. The cities, the animals, the sky. Our records say it was called the Star Engine."],
        ["silver", "And they say a blue hedgehog brought it the last ring. If I can go back and stop him... this street won't have to be the last one."],
        [N, "The street's old machines have gone wild in the dark. Silver has to cross it to reach the time gate at the end."],
      ],
      beats: [
        [0.15, "silver", "Hang on, everyone. I'll fix this. I promise."],
        [0.55, "silver", "The machines are worse every year. They don't even know what they're guarding anymore."],
        [0.92, "silver", "The time gate! It's now or never!"],
      ],
      after: [
        [N, "The gate opens with a flash of light. Silver steps through, into the past."],
      ] },
    { title: "Arrival", kind: "run", stage: "canyon",
      before: [
        [N, "Redstone Canyon, two hundred years ago. The sky is blue. The river is running. Silver stands and stares at it."],
        ["silver", "So this is what the world looked like. It's... it's beautiful."],
        ["silver", "Focus, Silver. The blue hedgehog. He has to be close."],
      ],
      beats: [
        [0.2, "silver", "These machines are new. They work! Even the bad ones."],
        [0.6, "silver", "Something fast went through here. Very fast. The cliffs are scorched."],
        [0.92, "silver", "There! A blue hedgehog!"],
      ],
      after: [
        ["sonic", "Uh, hi? Do I know you?"],
        ["silver", "A blue hedgehog. Fast. It's you. You're the one who brings him the last ring."],
        ["sonic", "I'm the one who what now?"],
        ["silver", "I'm sorry. I can't let my future happen!"],
      ] },
    { title: "The Blue Hedgehog", kind: "battle", arena: "canyon", foes: [{ who: "sonic", lvl: 1 }],
      before: [
        ["sonic", "Hold on, you've got the wrong guy!"],
        ["silver", "That's what you would say!"],
      ],
      after: [
        ["sonic", "Okay! Okay! Listen! There's a machine running around that looks just like me! Metal Sonic! I bet your records got the two of us mixed up!"],
        ["silver", "A machine... that looks like you? Then... I nearly..."],
        ["sonic", "Don't sweat it. But if you want the one carrying Eggman's rings, he went up the expressway with a convoy this evening."],
        ["silver", "Then I'll find out for myself."],
      ] },
    { title: "The Expressway", kind: "run", stage: "expressway",
      before: [
        [N, "The expressway out of the city, at night. Burnt-out trucks of Eggman's convoy lie across the road. Silver searches them for the truth."],
        ["silver", "If there's a machine that looks like Sonic, someone here has seen it."],
      ],
      beats: [
        [0.2, "silver", "Empty crates. They glowed red, once. The rings were in here."],
        [0.6, "silver", "Footprints. Scorched ones. That's no hedgehog."],
        [0.92, "silver", "Someone's ahead. Black and red. ...Shadow?"],
      ],
      after: [
        ["shadow", "Silver. What are you doing in this time?"],
        ["silver", "Shadow! I'm trying to find out who brings the last ring to the Star Engine. Are you helping Sonic? Or the machine?"],
        ["shadow", "You never did learn to ask your questions before throwing things. Very well. Let's see if you've improved."],
      ] },
    { title: "Shadow", kind: "battle", arena: "expressway", foes: [{ who: "shadow", lvl: 2 }],
      before: [
        ["silver", "I won't lose. Not with my whole future riding on this!"],
        ["shadow", "Then show me."],
      ],
      after: [
        ["shadow", "...Hmph. You've grown stronger."],
        ["silver", "I've had to."],
        ["shadow", "The one you're after is Metal Sonic. The Doctor's copy of Sonic. Find it, and you'll find your last ring."],
        ["shadow", "But be careful. Your future isn't written yet. Don't spend it fighting the wrong people."],
      ] },
    { title: "The Old Machine", kind: "battle", arena: "ruins", foes: [{ who: "emerl", lvl: 1 }],
      before: [
        [N, "Cinder City, the burnt-out old quarter at the edge of town. To Silver it looks like home, and that hurts. A little machine is sitting on a broken wall, copying the way the birds hop."],
        ["emerl", "...Silver. Shining. Floating!"],
        ["silver", "You... You're a Gizoid! In my time, there's nothing left of you but old stories."],
        ["emerl", "Fight! Learn! Emerl, learn!"],
        ["silver", "You want to spar? Okay. I won't hold back!"],
      ],
      after: [
        ["emerl", "...Strong. Silver, strong. Floating, fun!"],
        ["silver", "You picked up my psychokinesis in one go. You're amazing."],
        ["silver", "In my time, nobody remembers you. I wonder what happens to you. ...No. That's not what I'm here for. Metal Sonic."],
        [N, "A message crackles through on the radio Sonic gave him: Tails. Metal Sonic is on the launch track, taking the last rings up to the stars."],
      ] },
    { title: "The Launch Track", kind: "run", stage: "s-launch",
      before: [
        [N, "The launch track runs from the mountains all the way up into the sky. Somewhere up there is the Star Engine."],
        ["silver", "This is it. The moment from the records. The last ring, going up."],
        ["silver", "Not this time!"],
      ],
      beats: [
        [0.15, "eggman", "Who's that? Another hedgehog?! How many of you ARE there?!"],
        [0.55, "silver", "I can see it, at the top. Metal Sonic!"],
        [0.92, "silver", "The dock! I made it!"],
      ],
      after: [
        [N, "Metal Sonic turns to face him, the last case of rings on its back, its eyes burning red."],
        ["silver", "A blue hedgehog, carrying the last ring. It was you. It was always you."],
      ] },
    { title: "The Records Were Wrong", kind: "battle", arena: "stars", foes: [{ who: "metal", lvl: 2 }],
      before: [
        ["silver", "For everyone on the last street. For my future!"],
        ["metal", "(It drops into a crouch. Its jet flares.)"],
      ],
      after: [
        [N, "Metal Sonic staggers, sparking. The case of rings slides away across the track, and Silver catches it in a cyan glow."],
        ["silver", "I did it. The last ring will never reach the engine!"],
        ["eggman", "Ugh! No matter! I have more than enough to start the Star Engine already! Come up and get me, if you dare!"],
        ["silver", "...It's still not over."],
        ["sonic", "Then let's finish it together. Ready, Silver?"],
      ] },
    { title: "A New Future", kind: "battle", arena: "station", allies: ["sonic"], foes: [{ who: "eggman", lvl: 2 }],
      before: [
        [N, "The Egg Orbital. The Star Engine turns at its heart, and Eggman waits in front of it."],
        ["eggman", "A hedgehog from the future?! Tell me, boy, how does history remember the great Dr. Eggman?"],
        ["silver", "It doesn't. Not after today."],
        ["sonic", "Ooh. Harsh. Let's go!"],
      ],
      after: [
        ["eggman", "No way! I can't believe this! I'll get you for this! In the future, AND the present!"],
        [N, "The Star Engine slows, and stops. The Red Star Rings shake loose and fall back toward the world like shooting stars."],
        ["silver", "They're falling back. All of them. The world gets to keep its power."],
        ["sonic", "So what happens now? Do you go home?"],
        ["silver", "I think so. I want to see it. A future where the last street isn't the last one."],
        [N, "The time gate opens, and Silver steps through. Two hundred years later, the lights are on in every street of the city."],
        ["silver", "...Welcome home. Silver's episode: the end."],
      ] },
  ] });

  // ==================================================================== Emerl
  /* his own story: he learns by fighting (each win, `teach` of the one he beat) */
  S.EPISODES.push({ who: "emerl", title: "Gizoid", blurb: "Dug out of the cliffs by Eggman's drills, an ancient machine wakes up with no name and no past. Every friend it fights teaches it something new.",
  chapters: [
    { title: "Awakening", kind: "run", stage: "seabreeze",
      before: [
        [N, "Deep under Seabreeze Cape, something has slept for four thousand years."],
        [N, "This morning, Eggman's drills cracked the rock open. A Red Star Ring fell from the sky into the crack, and the something woke up."],
        ["emerl", "..."],
        [N, "It has no name. It doesn't know what it is. It knows only that there is light up there, and that it wants to go and see it."],
      ],
      beats: [
        [0.15, "emerl", "...Light. Sea. ...Robots?"],
        [0.55, "emerl", "Robots. Hit. ...Hit back!"],
        [0.92, "emerl", "...Blue."],
      ],
      after: [
        [N, "At the top of the cliffs, a blue hedgehog is waiting. He has just beaten Eggman's dig rig, and he's watching the crack in the ground with interest."],
        ["sonic", "Hey there. You okay? Eggman dug you up, huh?"],
        [N, "It copies the way he stands. Then the way he taps his foot. Then it drops into his fighting stance, exactly."],
        ["sonic", "Ha! You learn fast. You need a name... A ring for a heart and a gem on your head. How about Emerl?"],
        ["emerl", "Emerl. ...Emerl!"],
        ["sonic", "Here's the thing, Emerl. You want to learn? Go fight my friends. Fight fair, have fun, and watch everything they do."],
      ] },
    { title: "Tails", kind: "battle", arena: "airstrip", foes: [{ who: "tails", lvl: 1 }], teach: "tails",
      before: [
        [N, "The airstrip. Tails is testing his new ring radar. Emerl watches the radar, then the fox, then the fox's two spinning tails."],
        ["emerl", "Tails. Fly. ...Emerl, fly!"],
        ["tails", "You're the one Sonic found! Okay, a friendly spar. I've always wanted to see how a machine this old works!"],
      ],
      after: [
        ["tails", "Wow. You learn really fast. You copied my moves on the second try!"],
        ["emerl", "...Tails. Clever. Thank you."],
        ["tails", "You're welcome! Hey, Knuckles is up on Guardian Peak. He's the strongest of all of us. Go and say hi!"],
      ] },
    { title: "Knuckles", kind: "battle", arena: "peak", foes: [{ who: "knuckles", lvl: 1 }], teach: "knuckles",
      before: [
        [N, "The old shrine at the foot of Guardian Peak. Knuckles is studying the carvings on its walls. Emerl is copying them."],
        ["knuckles", "Those carvings... my people's stories talk about machines like you. The Gizoids. Warriors that copied every fighter they ever met."],
        ["emerl", "Fight. Learn. ...Fight Knuckles!"],
        ["knuckles", "Ha! You want to learn from the best? Then pay attention!"],
      ],
      after: [
        ["knuckles", "Whoa. You hit like a train, for something that size."],
        ["emerl", "Knuckles... strong. Emerl, strong too!"],
        ["knuckles", "Heh. Stay out of trouble, kid. Eggman would love to get his hands on something like you."],
      ] },
    { title: "Amy", kind: "battle", arena: "parlour", foes: [{ who: "amy", lvl: 1 }], teach: "amy",
      before: [
        [N, "Amy's house. Amy has just finished sweeping up after the badniks, and she finds a little machine reading her fortune cards."],
        ["amy", "Hey! Those are mine! ...Oh! You're Sonic's new friend! Emerl, right?"],
        ["emerl", "Amy. Hammer. ...Emerl wants hammer!"],
        ["amy", "Ha! You want to see the Piko Piko Hammer? Okay. But I don't go easy on anyone!"],
      ],
      after: [
        ["amy", "Not bad! You even got the spin right!"],
        ["emerl", "Amy... fun! Amy loves Sonic?"],
        ["amy", "Of COURSE I love Sonic! Now you're learning the important things!"],
      ] },
    { title: "Rouge", kind: "battle", arena: "club", foes: [{ who: "rouge", lvl: 1 }], teach: "rouge",
      before: [
        [N, "The city at night. Emerl has followed the music to Rouge's club, and is copying the dancers through the window."],
        ["rouge", "Now what do we have here? A walking jewel box? That ring in your chest is the shiniest thing I've seen all night."],
        ["emerl", "Mine. Emerl's. ...Fight for it!"],
        ["rouge", "Feisty. I like that."],
      ],
      after: [
        ["rouge", "Ooh. Those kicks are almost as good as mine. Almost."],
        ["emerl", "Rouge, fast. Rouge, pretty kicks."],
        ["rouge", "Flatterer. Keep your ring, you funny little thing. Taking it would be like taking your heart."],
      ] },
    { title: "Cream", kind: "battle", arena: "seabreeze", foes: [{ who: "cream", lvl: 0 }], teach: "cream",
      before: [
        [N, "Seabreeze Cape, back where it all started. A little rabbit and her Chao are walking along the cliffs."],
        ["cream", "Hello! My name is Cream, and this is Cheese. What's your name?"],
        ["emerl", "Emerl! Sonic said. Emerl."],
        ["cream", "That's a lovely name! Would you like to play with us?"],
        ["emerl", "Play-fight! Emerl, learn!"],
        ["cream", "Oh! Well, if it's just pretend... okay! Cheese, gently!"],
      ],
      after: [
        ["cream", "You're very good! You copied Cheese's Chao Attack on the very first try!"],
        [N, "Emerl copies something else, too: Cream's little bow. Then it bows again, and again, because it's having a lovely time."],
        ["emerl", "Cream. Friend. ...Emerl has friends."],
        ["cream", "Of course you do! Lots of them!"],
      ] },
    { title: "Chaos", kind: "battle", arena: "springs", foes: [{ who: "chaos", lvl: 1 }], teach: "chaos",
      before: [
        [N, "Moonwell Springs, in the forest. Emerl came to see the Chao, and found the pools half-drained, and Chaos, guarding them."],
        ["emerl", "...Water. Moving. Alive?"],
        [N, "Chaos doesn't answer. It has seen too many of Eggman's machines today, and Emerl looks like a machine."],
        ["emerl", "Emerl, not Eggman. ...Emerl, show you!"],
      ],
      after: [
        [N, "Chaos settles back into the pool. Emerl sits beside it, very still, and a Chao climbs into its lap."],
        ["emerl", "Chaos. Protects. ...Emerl, protect too."],
        [N, "Chaos looks at it for a long time. Then it nods, once."],
      ] },
    { title: "Shadow", kind: "battle", arena: "expressway", foes: [{ who: "shadow", lvl: 2 }], teach: "shadow",
      before: [
        [N, "The expressway, at night. Emerl has been following a black hedgehog, because he's fast like Sonic, but not Sonic."],
        ["shadow", "A Gizoid. An ancient weapon that copies everything it sees. Professor Gerald wrote about you, in his journals."],
        ["shadow", "And if the Professor wrote about you, the Doctor has read about you. Show me what you are."],
        ["emerl", "Emerl. ...Emerl is Emerl!"],
      ],
      after: [
        ["shadow", "You learned Chaos Control from one look. You could become anything. A weapon. Or something else."],
        ["emerl", "Emerl... wants to be friend. Not weapon."],
        ["shadow", "Then choose well, Gizoid. The Doctor will want you to choose him."],
      ] },
    { title: "Gamma", kind: "battle", arena: "depot", foes: [{ who: "gamma", lvl: 2 }], teach: "gamma",
      before: [
        [N, "Iron Hold Depot. Eggman has captured Amy, and Emerl came to get her out. A robot stands guard at her cell."],
        ["gamma", "Unit Chaos Gamma. Unknown machine detected. Query: are you one of the Doctor's units?"],
        ["emerl", "No! Emerl is Sonic's friend. Amy's friend. Let Amy go!"],
        ["gamma", "Request denied. Engaging."],
      ],
      after: [
        ["gamma", "...Systems damaged. Query: you are a machine. Why do you fight for them?"],
        ["emerl", "Because Emerl chose. ...Gamma can choose too."],
        ["amy", "He's right, Gamma. You don't have to do everything Eggman says."],
        ["gamma", "...Data found. An old unit of my line once made this same choice. New assignment: protect the girl. ...And the small machine."],
        ["eggman", "So THERE you are, Gizoid! Do you know how long I spent digging you up?! You belong to ME! Come to my station, and I'll show you what you were made for!"],
      ] },
    { title: "Chosen", kind: "battle", arena: "station", foes: [{ who: "eggman", lvl: 2 }],
      before: [
        [N, "The Egg Orbital. The Star Engine turns at its heart. Dr. Eggman holds up an old, yellowed journal, with a Gizoid drawn on the cover."],
        ["eggman", "Professor Gerald's notes! With these codes, any Gizoid must obey its master! Gizoid! I command you: obey me, and destroy Sonic!"],
        [N, "For one moment, Emerl's eyes flicker red. Something very old inside it wants to obey."],
        [N, "And then it remembers. A race on the cliffs. A tail swipe. A hammer. A bow. A Chao in its lap."],
        ["emerl", "...No. Emerl is Emerl. Emerl chooses friends!"],
        ["eggman", "WHAT?! Then I'll scrap you myself! Get a load of THIS!"],
      ],
      after: [
        ["eggman", "No way! I can't believe this! Beaten by my own discovery!"],
        [N, "The Star Engine slows, and stops. The Red Star Rings shake loose and fall back toward the world like shooting stars."],
        ["sonic", "Hey, Emerl! You did it! Look at you. You've learned everything."],
        ["emerl", "Not everything. ...Emerl wants to learn more. With Sonic. With friends."],
        ["sonic", "Ha! Then let's go. There's a whole world down there!"],
        [N, "Emerl's episode: the end. Every move it learned is its own now, in Battle and on the stages."],
      ] },
  ] });
})(typeof globalThis !== "undefined" ? globalThis : this);
