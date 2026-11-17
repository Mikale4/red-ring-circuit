/*
 * Red Ring Circuit: "The Red Star Rings", the second part of the episodes (Rouge, Shadow, Cream,
 * Chaos and Chaos Gamma). The format is in adventure-story.js.
 */
(function (root) {
  "use strict";
  const N = "";
  const S = root.AdventureStory = root.AdventureStory || { TITLE: "The Red Star Rings", EPISODES: [] };

  // ==================================================================== Rouge
  S.EPISODES.push({ who: "rouge", title: "Jewel Thief", blurb: "The world's greatest treasure hunter takes a government job: find out who's buying up the rings. Keeping a few is just a bonus.",
  chapters: [
    { title: "Night Shift", kind: "run", stage: "club",
      before: [
        [N, "The city's club street, after dark. Rouge leans on the bar of her own club, reading a message from her employers."],
        ["rouge", "\"Red Star Rings falling all over the world. Someone is collecting them. Find out who.\" Hmm. Treasure AND a paycheck? Don't mind if I do."],
        [N, "Outside, the neon flickers. A line of badniks is marching down the street, carrying a crate that glows red."],
        ["rouge", "Well, well. Delivery boys. Let's see where you're taking that."],
      ],
      beats: [
        [0.15, "rouge", "Badniks on my street. Somebody's getting sloppy."],
        [0.55, "rouge", "Eggman's work, of course. Who else paints everything red?"],
        [0.9, "rouge", "And the crate is... empty. They've already handed the ring off. Clever boys."],
      ],
      after: [
        ["rouge", "The tracks lead north, up the mountain. Guardian Peak. Knuckles' mountain."],
        ["rouge", "Oh, he's going to be SO happy to see me."],
      ] },
    { title: "Summit Heist", kind: "run", stage: "peak",
      before: [
        [N, "Guardian Peak, in the afternoon. On the lower slopes, Knuckles and Sonic are busy hitting each other, while Eggman's badniks slip past them up the mountain."],
        ["rouge", "Boys. Always fighting over the wrong thing. While they're busy, I'll take a look at the top shrine myself."],
      ],
      beats: [
        [0.2, "rouge", "Snow, rocks, and robots. Charming."],
        [0.6, "eggman", "Rouge?! What is SHE doing here? Badniks, those rings are mine!"],
        [0.92, "rouge", "The top shrine. And look at that: seven of them. Nobody will miss just one."],
      ],
      after: [
        [N, "Rouge lifts one ring from the shrine. It's warm, and it hums. Then a shadow falls over her."],
        ["knuckles", "ROUGE! Put that back!"],
        ["rouge", "Knuckles! Done fighting Sonic already? You must be exhausted, sweetie. Sit down. Rest."],
      ] },
    { title: "Finders Keepers", kind: "battle", arena: "peak", foes: [{ who: "knuckles", lvl: 1 }],
      before: [
        ["knuckles", "My people have guarded those rings for a thousand years!"],
        ["rouge", "And they've done a lovely job. Now it's my turn."],
      ],
      after: [
        ["knuckles", "Grr... come back here!"],
        ["rouge", "If you want it, come and find me tonight in the city. Ciao!"],
        [N, "Rouge glides off the summit with the ring. She doesn't look back. If she had, she'd have seen Knuckles grinning."],
        ["knuckles", "Go on, then. Lead me straight to whoever you're working for."],
      ] },
    { title: "Rooftop Run", kind: "run", stage: "s-rooftops",
      before: [
        [N, "The city after midnight. Rouge flies from roof to roof. Behind her, a red echidna is gliding, and gaining."],
        ["rouge", "He followed me all the way from the mountain? Persistent. I'll give him that."],
      ],
      beats: [
        [0.12, "knuckles", "Rouge! You can't outrun me!"],
        [0.5, "rouge", "Keep up, Knuckles! A girl could get bored!"],
        [0.88, "rouge", "Home sweet home. Time to lose him."],
      ],
      after: [
        [N, "Rouge drops down behind her club. And there, copying the dancers through the window, is a little machine with a ring for a heart."],
        ["emerl", "...Dance. Spin. Wings!"],
        ["rouge", "Now what do we have here? A walking jewel box?"],
      ] },
    { title: "Shiny Thing", kind: "battle", arena: "club", foes: [{ who: "emerl", lvl: 1 }],
      before: [
        ["rouge", "That ring in your chest is the shiniest thing I've seen all night, sweetie."],
        ["emerl", "Mine. ...Emerl's. Fight for it!"],
        ["rouge", "Feisty. I like that."],
      ],
      after: [
        ["emerl", "...Rouge. Fast. Pretty kicks."],
        ["rouge", "Flatterer. Keep your ring, you funny little thing. Taking it would be like taking your heart."],
        ["rouge", "And I'm a treasure hunter. Not a heartless one."],
        [N, "Her communicator beeps. A ring has turned up at Petal Hall Museum, on display, and so have a lot of Eggman's badniks."],
      ] },
    { title: "Museum Piece", kind: "battle", arena: "museum", foes: [{ who: "cream", lvl: 1 }],
      before: [
        [N, "Petal Hall Museum. The badniks are scrap already. A little rabbit and her Chao are standing guard over the ring's display case."],
        ["cream", "Excuse me, miss. Please don't take the star ring. The robots wanted it too."],
        ["rouge", "Lady. I like this kid. Now, sweetie, be a dear and step aside."],
        ["cream", "I'm sorry, miss, but I can't. Cheese! Let's do our best!"],
      ],
      after: [
        ["cream", "Oh no. Cheese... are you okay?"],
        ["rouge", "Don't cry. He's fine, he's tougher than he looks. You're both very brave."],
        ["amy", "Cream! Rouge, if you've touched one ear on that girl's head..."],
        ["rouge", "Relax. Keep the ring. I'm more interested in the badniks that just ran off with the museum's other one."],
        [N, "As the last badnik flees, Rouge flicks a tiny tracker onto its back."],
        ["rouge", "Run home to Daddy Eggman, little robot. I'll be right behind you."],
      ] },
    { title: "Tailing the Convoy", kind: "run", stage: "expressway",
      before: [
        [N, "The tracker leads out of the city to the expressway, where Eggman's trucks are gathering into a convoy."],
        ["rouge", "Every ring Eggman's dug up, heading the same way. Under the mountains, I'd bet."],
      ],
      beats: [
        [0.15, "rouge", "Mind the traffic, Rouge. You've got a nice face."],
        [0.55, "rouge", "There's something at the head of the convoy. Blue. Fast. ...That's not Sonic."],
        [0.9, "rouge", "The trucks are turning off into the mountain. Iron Hold."],
      ],
      after: [
        ["rouge", "An old depot under the mountains. Eggman's treasure vault."],
        ["rouge", "Agents in, rings out. Easiest job I've ever had."],
      ] },
    { title: "Inside Job", kind: "run", stage: "s-vault",
      before: [
        [N, "Iron Hold Depot. Rouge comes in through an air vent, the way professionals do."],
        ["rouge", "Lasers, locks, robots. He really does care about his things."],
      ],
      beats: [
        [0.15, "rouge", "Left at the scary robot. Right at the scarier robot."],
        [0.55, "eggman", "An intruder in my vault?! Lock everything!"],
        [0.9, "rouge", "And there's the vault. Empty. Somebody beat me to it."],
      ],
      after: [
        [N, "A file on a desk in the vault tells Rouge all she needs: the rings went up the launch track, to the Egg Orbital, to be set in the Star Engine."],
        ["rouge", "An engine that drains the power out of everything else. Even my government friends wouldn't want that."],
        ["knuckles", "Rouge."],
        ["rouge", "Knuckles. You did follow me. Since we're both here... want to see a space station?"],
      ] },
    { title: "Partners", kind: "battle", arena: "station", allies: ["knuckles"], foes: [{ who: "metal", lvl: 2 }],
      before: [
        [N, "The Egg Orbital. The ring store sits by the engine room, and Metal Sonic is guarding it."],
        ["rouge", "Ladies first, Knuckles."],
        ["knuckles", "Just this once. Don't steal anything while I'm busy."],
        ["rouge", "No promises."],
      ],
      after: [
        [N, "Metal Sonic goes down in a shower of sparks. Down the corridor, the Star Engine coughs, stutters, and stops: someone has beaten Eggman."],
        [N, "The Red Star Rings shake loose and fall back toward the world like shooting stars."],
        ["knuckles", "Well. Thanks, I guess."],
        ["rouge", "Don't mention it. Ever. To anyone."],
        [N, "That night, high on Guardian Peak, a bat slips something back into the top shrine and flies off without a word."],
        ["rouge", "Seven again. A girl has to have SOME secrets. Rouge's episode: the end."],
      ] },
  ] });

  // ==================================================================== Shadow
  S.EPISODES.push({ who: "shadow", title: "The Ultimate Life Form", blurb: "A convoy on the expressway, a copy that runs too fast, and a machine from the Professor's notes. Shadow keeps his promise.",
  chapters: [
    { title: "The Convoy", kind: "run", stage: "s-convoy",
      before: [
        [N, "Evening. The expressway out of the city. A line of Eggman's trucks roars along it, loaded with crates that glow red."],
        ["shadow", "The Doctor is collecting those rings. Whatever he wants with them, it isn't good."],
        ["shadow", "And at the head of the convoy... a blue hedgehog. Sonic. So that's whose side you're on."],
      ],
      beats: [
        [0.1, "eggman", "Shadow! You're too late! The rings are already on their way!"],
        [0.5, "shadow", "Hmph. Your robots are as slow as you are, Doctor."],
        [0.9, "shadow", "The lead truck. I'll stop it here."],
      ],
      after: [
        [N, "The trucks lie stopped across the road. But the blue runner at the head of the convoy is gone, and the crates with it."],
        ["sonic", "Hey, Shadow! You seen a bunch of red rings come through here?"],
        ["shadow", "I saw you. Running at the head of Eggman's convoy."],
      ] },
    { title: "Prove It", kind: "battle", arena: "expressway", foes: [{ who: "sonic", lvl: 1 }],
      before: [
        ["sonic", "Wasn't me. I've been up a mountain all afternoon."],
        ["shadow", "Then prove it."],
        ["sonic", "Fine! You always do this the hard way."],
      ],
      after: [
        ["sonic", "Okay, okay! Look, would I still be standing here if I'd run off with Eggman's rings?"],
        ["shadow", "...No. The one on the road was faster than you in a straight line. And it never once looked back."],
        ["sonic", "Faster than me? Now I'm offended."],
        ["shadow", "It was a machine. Metal Sonic. And it was heading for Redstone Canyon."],
      ] },
    { title: "Redstone Trail", kind: "run", stage: "canyon",
      before: [
        [N, "Redstone Canyon. Scorch marks from Metal Sonic's jets run along the cliffs, and Eggman's blasting has shaken the whole canyon."],
        ["shadow", "It's leaving a trail a child could follow. It wants to be chased."],
      ],
      beats: [
        [0.2, "shadow", "The scorch marks get fresher. It's close."],
        [0.6, "shadow", "Badniks. Placed to slow me down. Pointless."],
        [0.9, "shadow", "Someone's ahead. That isn't Metal."],
      ],
      after: [
        [N, "A silver hedgehog drops out of the air in front of Shadow, glowing cyan."],
        ["silver", "Shadow?! In this time... Are you working with the blue hedgehog? The one who brings the last ring?"],
        ["shadow", "Silver. You never did learn to ask your questions before throwing things."],
      ] },
    { title: "Questions First", kind: "battle", arena: "canyon", foes: [{ who: "silver", lvl: 1 }],
      before: [
        ["silver", "I won't let my future happen. Not even if you're in the way!"],
        ["shadow", "Then show me how far you're willing to go."],
      ],
      after: [
        ["silver", "...You're as strong as the stories said."],
        ["shadow", "Talk. What happens in your future?"],
        ["silver", "An engine, up in the stars. It drained the power out of everything. The cities, the animals, the sky. Our records say a blue hedgehog brought it the last ring."],
        ["shadow", "Your records are wrong. It wasn't Sonic. It was a copy of him."],
        ["silver", "A copy? Then... I nearly fought the wrong one."],
        ["shadow", "The future isn't written yet. Go and help him. I have something else to look into."],
      ] },
    { title: "The Gizoid", kind: "battle", arena: "ruins", foes: [{ who: "emerl", lvl: 1 }],
      before: [
        [N, "Cinder City, the burnt-out old quarter at the edge of town. Shadow has followed reports of a strange little machine here, because they remind him of a drawing in one of Professor Gerald's journals."],
        [N, "Sitting on a broken wall is the machine from the drawing."],
        ["emerl", "...Black. Fast. Like Sonic. ...Not Sonic."],
        ["shadow", "A Gizoid. An ancient weapon that copies everything it sees. The Professor wrote about you."],
        ["shadow", "And if the Professor wrote about you, the Doctor has read about you. Show me what you are."],
      ],
      after: [
        ["emerl", "...Strong. Shadow, strong. Chaos... Control?"],
        ["shadow", "You learned that from one look. Then you could become anything. A weapon. Or something else."],
        ["shadow", "Choose well, Gizoid. The Doctor will want you to choose him."],
        [N, "His communicator crackles. It's Tails: Metal Sonic is on the launch track, taking the rings to Eggman's station."],
      ] },
    { title: "Among the Stars", kind: "run", stage: "stars",
      before: [
        [N, "Shadow doesn't take the track. A flash of Chaos Control, and he's already among the stars, on the girders below the Egg Orbital, where Metal Sonic must pass."],
        ["shadow", "I'll meet it at the top."],
      ],
      beats: [
        [0.2, "shadow", "The Doctor's defences. As predictable as ever."],
        [0.6, "eggman", "Shadow?! How did he get up here?! Stop him!"],
        [0.9, "shadow", "There. The docking track."],
      ],
      after: [
        [N, "Metal Sonic lands on the track in front of him, with a case of rings, and turns. Its eyes burn red."],
        ["shadow", "A copy of Sonic. Built to beat the original. I wonder how you'll do against me."],
      ] },
    { title: "Imitation", kind: "battle", arena: "stars", foes: [{ who: "metal", lvl: 2 }],
      before: [
        ["metal", "(Metal Sonic drops into a crouch. Its jet flares.)"],
        ["shadow", "Come, then."],
      ],
      after: [
        [N, "Metal Sonic staggers, sparking, and the case of rings slides away along the track. Sonic skids to a stop beside Shadow, out of breath."],
        ["sonic", "Aw, you beat him without me? Rude."],
        ["shadow", "You were slow. The Doctor is inside. Let's finish this."],
        ["sonic", "Ha! Look who decided to trust me."],
        ["shadow", "Don't push it."],
      ] },
    { title: "Engine Core", kind: "run", stage: "s-core",
      before: [
        [N, "The Egg Orbital. The power lines through its corridors all lead one way: to the Star Engine at the core."],
        ["shadow", "Every scrap of power on the planet is flowing up into this station. We end it now."],
      ],
      beats: [
        [0.1, "eggman", "Welcome to the Egg Orbital! You'll find every room named after ME!"],
        [0.5, "sonic", "Hey, Shadow, race you to the core!"],
        [0.88, "shadow", "The engine room. Chaos Control!"],
      ],
      after: [
        [N, "The Star Engine turns, set all round with Red Star Rings. Dr. Eggman waits in front of it, and Metal Sonic rises behind him, sparking."],
        ["eggman", "Shadow! You of all people should understand! With this much power, nobody could ever stop me!"],
        ["shadow", "That's exactly why it's going to stop."],
      ] },
    { title: "The Star Engine", kind: "battle", arena: "station", allies: ["sonic"], foes: [{ who: "eggman", lvl: 2 }, { who: "metal", lvl: 1 }],
      before: [
        ["eggman", "Metal Sonic! Destroy them both!"],
        ["sonic", "Two of us, two of you. Ready, Shadow?"],
        ["shadow", "Always."],
      ],
      after: [
        ["eggman", "No way! I can't believe this! I'll get you for this, both of you!"],
        [N, "The Egg Mobile spins away into the dark. The Star Engine slows, shudders, and stops. One by one, the Red Star Rings fall back toward the world like shooting stars."],
        ["sonic", "Nice work, partner."],
        ["shadow", "I'm not your partner. ...But the world is safe. That's enough."],
        [N, "Shadow watches the rings fall, and thinks of a promise he made long ago, to protect the world below."],
        ["shadow", "Promise kept. Shadow's episode: the end."],
      ] },
  ] });

  // ==================================================================== Cream
  S.EPISODES.push({ who: "cream", title: "Cream and Cheese", blurb: "A day out at the museum turns into an adventure. Cream is very polite about it. Cheese does the fighting.",
  chapters: [
    { title: "A Day at the Museum", kind: "run", stage: "museum",
      before: [
        [N, "Petal Hall Museum. Cream and Cheese are on a day out, and the museum has a new exhibit: a red ring with a star in it, that fell out of the sky last week."],
        ["cream", "Look, Cheese, it's so pretty! It's like a little star!"],
        [N, "Then the windows shatter, and the badniks pour in."],
        ["cream", "Oh my! Excuse me, Mr. Robots, you aren't supposed to run in a museum!"],
        ["cream", "...They're not listening, Cheese. We have to stop them!"],
      ],
      beats: [
        [0.2, "cream", "Please be careful with the paintings!"],
        [0.6, "cream", "They're going upstairs, to the gallery! Hurry, Cheese!"],
        [0.92, "cream", "The gallery! We're almost there!"],
      ],
      after: [
        ["cream", "The robots ran up into the old gallery with the star ring, Cheese. We have to get it back for the museum."],
      ] },
    { title: "The Gallery", kind: "run", stage: "s-gallery",
      before: [
        [N, "The museum's upper gallery: long halls of paintings and statues, closed for repairs, and full of Eggman's robots."],
        ["cream", "It's very dark up here. Cheese, you'll stay close, won't you?"],
      ],
      beats: [
        [0.15, "eggman", "A little rabbit? Hohoho! Go home, girl, before you get hurt!"],
        [0.5, "cream", "I'm sorry, Mr. Eggman, but that ring belongs to the museum!"],
        [0.9, "cream", "There's the ring! Excuse me, Mr. Robot, may I have that, please?"],
      ],
      after: [
        ["cream", "We did it, Cheese! The star ring is safe!"],
        ["rouge", "Bravo. And now, sweetie, be a dear and hand it over."],
        ["cream", "Oh! Hello, miss. Are you a friend of the museum?"],
        ["rouge", "Something like that."],
      ] },
    { title: "Miss Rouge", kind: "battle", arena: "museum", foes: [{ who: "rouge", lvl: 0 }],
      before: [
        ["cream", "I'm sorry, miss. The star ring belongs to the museum. I can't give it to you."],
        ["rouge", "Then I'll just have to take it. Don't worry, I'll go easy on you."],
        ["cream", "Cheese, let's do our best!"],
      ],
      after: [
        ["rouge", "Ow! That little Chao packs a punch!"],
        ["amy", "Cream! I came as fast as I could! ...Huh? Did you beat Rouge? By yourself?"],
        ["cream", "Cheese did most of it, Miss Amy."],
        ["rouge", "Fine, fine. Keep your little ring. I only wanted to know who's buying them, anyway."],
        ["cream", "Miss Amy, one of the robots got away with another ring. It flew off toward the forest, where the Chao live."],
      ] },
    { title: "The Chao Garden", kind: "run", stage: "springs",
      before: [
        [N, "Moonwell Springs, in the forest, where the wild Chao live. Eggman's robots have set pumps in the pools, and the water is going down."],
        ["cream", "Cheese, they're draining the Chao's home! That's so mean!"],
      ],
      beats: [
        [0.2, "cream", "Don't worry, little Chao! We're coming!"],
        [0.6, "cream", "The pumps are up ahead. We have to turn them off!"],
        [0.92, "cream", "The biggest pool. That's where the ring must be."],
      ],
      after: [
        [N, "The pumps stop. And out of the deepest pool rises a figure made of living water, its eyes glowing green."],
        ["cream", "Oh! Hello. Are you... Mr. Chaos? The one who looks after the Chao?"],
        [N, "Chaos doesn't answer. It has seen too many of Eggman's machines today, and it doesn't know this one yet."],
      ] },
    { title: "Mr. Chaos", kind: "battle", arena: "springs", foes: [{ who: "chaos", lvl: 0 }],
      before: [
        ["cream", "We're not with Mr. Eggman! We're here to help!"],
        ["cream", "...It isn't listening, Cheese. We'll have to show it."],
      ],
      after: [
        [N, "Chaos stops. It looks at Cheese for a long time. Then a little Chao floats out from behind the stones and settles on Chaos' head."],
        ["cream", "You were only protecting them, weren't you? We'd never hurt the Chao."],
        [N, "Chaos sinks back into the pool, with the ring still at the bottom of it. The Chao will be safe there."],
        ["cream", "Goodbye, Mr. Chaos! Take good care of them!"],
      ] },
    { title: "A New Friend", kind: "battle", arena: "seabreeze", foes: [{ who: "emerl", lvl: 0 }],
      before: [
        [N, "Seabreeze Cape, on the way home. A little machine is sitting on the cliffs, watching the sea."],
        ["cream", "Hello! My name is Cream, and this is Cheese. What's your name?"],
        ["emerl", "...Emerl. Sonic said. Emerl."],
        ["cream", "That's a lovely name! Would you like to play with us?"],
        ["emerl", "Play. ...Fight? Play-fight!"],
        ["cream", "Oh! Well, if it's just pretend... okay! Cheese, gently!"],
      ],
      after: [
        ["emerl", "...Fun. Cream, fun. Cheese, fun!"],
        ["cream", "You're very good! You copied Cheese's Chao Attack on the very first try!"],
        [N, "Emerl copies something else, too: Cream's little bow. Then it bows again, and again, because it's having a lovely time."],
        ["amy", "Cream! Come quick! Eggman's taken the rings to his base under the mountains, and I'm going in!"],
        ["cream", "I have to go, Emerl. Let's play again soon! Goodbye!"],
      ] },
    { title: "Iron Hold", kind: "run", stage: "depot",
      before: [
        [N, "Iron Hold Depot, under the mountains. Amy went in an hour ago. She hasn't come out."],
        ["cream", "Miss Amy must be in trouble. Cheese, we have to find her!"],
      ],
      beats: [
        [0.2, "cream", "It's so big in here. Miss Amy? Can you hear me?"],
        [0.6, "eggman", "Another one?! Are all of Sonic's friends this stubborn?"],
        [0.92, "cream", "I can hear her! She's behind that door!"],
      ],
      after: [
        [N, "Amy is behind bars in a cell by the vault. A robot stands guard over her."],
        ["amy", "Cream?! What are you doing here? It's dangerous!"],
        ["gamma", "Unit Chaos Gamma. Another intruder. You will be detained."],
        ["cream", "Excuse me, Mr. Gamma. Please let Miss Amy go."],
      ] },
    { title: "Please Let Her Go", kind: "battle", arena: "depot", foes: [{ who: "gamma", lvl: 1 }],
      before: [
        ["gamma", "Request denied. Assignment: guard the prisoner."],
        ["cream", "Then I'm sorry, Mr. Gamma. Cheese!"],
      ],
      after: [
        ["gamma", "...Systems damaged. Query: why do you apologise, when you are winning?"],
        ["cream", "Because it isn't nice to hurt people. Even when you have to."],
        ["amy", "She's right, Gamma. You don't have to do everything Eggman says. That engine of his will drain the power out of everything. Even you."],
        ["gamma", "...Data found. An old unit of my line once made this same choice. New assignment: protect the prisoner. ...Protect the girls."],
        [N, "The cell door opens."],
        ["amy", "Thanks, Gamma! Cream, you're amazing! Now let's go stop Eggman!"],
      ] },
    { title: "Star Engine", kind: "battle", arena: "station", allies: ["amy"], foes: [{ who: "eggman", lvl: 1 }],
      before: [
        [N, "The Egg Orbital. The Star Engine turns at the heart of the station, and Eggman waits in front of it."],
        ["eggman", "The rabbit?! The little rabbit is what's left to stop me? Hohoho!"],
        ["cream", "Mr. Eggman, please turn off your engine. It's hurting everyone."],
        ["eggman", "Never! With this, I'll never lose again!"],
        ["amy", "Then you've never met Cream. Let's go!"],
      ],
      after: [
        ["eggman", "No way! I can't believe this! Beaten by a little rabbit!"],
        [N, "The Star Engine slows, and stops. One by one, the Red Star Rings shake loose and fall back toward the world like shooting stars."],
        ["cream", "Look, Cheese! Shooting stars! Make a wish!"],
        ["amy", "What did you wish for, Cream?"],
        ["cream", "Ice cream, for everyone! And for Mr. Gamma, and Mr. Chaos, and Emerl, too."],
        [N, "Cream's episode: the end."],
      ] },
  ] });

  // ==================================================================== Chaos
  S.EPISODES.push({ who: "chaos", title: "Still Water", blurb: "The spirit of the water never speaks. When Eggman drains the Chao's home, it doesn't need to.",
  chapters: [
    { title: "The Pools", kind: "run", stage: "springs",
      before: [
        [N, "Moonwell Springs, in the forest. A thousand years ago, a Red Star Ring fell into the deepest pool here, and Chaos has kept it there, deep and quiet, ever since, among the Chao."],
        [N, "This morning, Eggman's robots came. They set pumps in the pools, and the water began to go down."],
        ["eggman", "Drain every pool! The ring at the bottom is MINE!"],
        [N, "The Chao run and hide. The deepest pool stirs. And Chaos rises."],
      ],
      beats: [
        [0.15, "chaos", "(The water around Chaos ripples. It moves toward the pumps.)"],
        [0.55, "eggman", "What is that thing? Badniks, get rid of it!"],
        [0.92, "chaos", "(The last pump. Chaos rises over it like a wave.)"],
      ],
      after: [
        [N, "The pumps lie broken. But the robots have carried the drained water away in their tanks, and somewhere in it, Chaos can feel, are its Chao's eggs."],
        [N, "Chaos follows the trail of spilled water, down into the caves below the springs."],
      ] },
    { title: "The Chao Pools", kind: "run", stage: "s-chaopools",
      before: [
        [N, "The old Chao pools in the caves, where the water runs underground. The robots are hauling their tanks this way."],
        ["eggman", "Whatever that water monster is, it can't follow us down here. Can it?"],
      ],
      beats: [
        [0.2, "chaos", "(Chaos pours through a crack in the rock, and rises again on the other side.)"],
        [0.6, "eggman", "It CAN follow us down here?!"],
        [0.92, "chaos", "(The tanks. Chaos can feel the eggs inside.)"],
      ],
      after: [
        [N, "The tanks crack open. The water, and the Chao eggs in it, spill out into the cave pool, safe. Chaos gathers them up and carries them home."],
        [N, "But as it rises out of the springs, someone is standing at the edge of the deepest pool. A small one, with a Chao on her shoulder."],
        ["cream", "Oh! Hello. Are you... Mr. Chaos? The one who looks after the Chao?"],
      ] },
    { title: "The Rabbit", kind: "battle", arena: "springs", foes: [{ who: "cream", lvl: 0 }],
      before: [
        [N, "Chaos has seen too many strangers today. It cannot tell this one from the robots yet."],
        ["cream", "Wait! We're not with Mr. Eggman! Cheese, I don't think it understands!"],
      ],
      after: [
        [N, "Cream sits down in the grass, tired. Her Chao, Cheese, floats in front of her, keeping guard."],
        [N, "Chaos stops. A Chao that guards its friend. The Chao do not do that for the robots."],
        ["cream", "You were only protecting them, weren't you? We'd never hurt the Chao."],
        [N, "Then the Egg Mobile drops out of the sky, with a great claw underneath it."],
        ["eggman", "Enough! If my badniks can't fetch that ring, I'll fetch it myself!"],
      ] },
    { title: "The Doctor", kind: "battle", arena: "springs", foes: [{ who: "eggman", lvl: 1 }],
      before: [
        ["eggman", "A puddle with a grudge! I'll pour you into a bottle and put you on my shelf!"],
        [N, "Chaos rises taller than it has in a thousand years."],
      ],
      after: [
        ["eggman", "Ugh! Soaked! My Egg Mobile is SOAKED! Fine, keep your silly pond! I have plenty of other rings!"],
        [N, "The Egg Mobile wobbles off toward the canyon in the east. That is where the springs' water comes from, and Eggman's robots have been blasting there for days."],
        [N, "If the river dries up, so will the pools. Chaos follows him."],
      ] },
    { title: "Blasting Site", kind: "run", stage: "s-blasting",
      before: [
        [N, "Redstone Canyon. Eggman's blasting crews are cracking the cliffs open to get at the rings fallen in them, and every blast shakes the river further from its bed."],
        ["eggman", "Blast it all! Every rock in this canyon could have a ring in it!"],
      ],
      beats: [
        [0.2, "chaos", "(The river runs thin here. Chaos moves faster.)"],
        [0.6, "eggman", "The water monster again?! Blast it! ...No, not with the explosives! Not near the explosives!"],
        [0.92, "chaos", "(The dam of rubble across the river. Chaos crashes through it.)"],
      ],
      after: [
        [N, "The river runs free again, back toward the springs. But on the canyon floor, someone has been watching Chaos tear up Eggman's site: a red and black armadillo, with his fists up."],
        ["mighty", "Hold it right there! I don't know what you are, but I've watched you smashing up this whole canyon!"],
      ] },
    { title: "The Traveller", kind: "battle", arena: "canyon", foes: [{ who: "mighty", lvl: 1 }],
      before: [
        ["mighty", "This canyon's been here a lot longer than both of us. I'm not letting anyone wreck it!"],
        [N, "Chaos and Mighty want the very same thing. Neither of them knows it yet."],
      ],
      after: [
        ["mighty", "Phew. You're strong. ...Hey. The river. It's running again. You did that?"],
        [N, "Chaos raises one hand, and the river water rises with it, clear and cold."],
        ["mighty", "You were protecting it. Same as me. Sorry, friend. I got it all wrong."],
        ["mighty", "Eggman's taken the rings to his base, under the mountains. Iron Hold. If he took any of yours, that's where they are."],
      ] },
    { title: "Under the Mountain", kind: "run", stage: "s-vault",
      before: [
        [N, "Iron Hold Depot. Chaos goes in the way water always does: through the cracks. One of the eggs never came home from the caves, and Chaos can feel it, somewhere in here."],
      ],
      beats: [
        [0.2, "eggman", "There's water coming in through the walls! Who left the taps on?!"],
        [0.6, "chaos", "(The egg is close. Chaos follows the cold.)"],
        [0.92, "chaos", "(The vault. And something in front of it.)"],
      ],
      after: [
        [N, "A robot stands guard before the vault. On a shelf behind it sits a single Chao egg, in a glass case marked \"Specimen\"."],
        ["gamma", "Unit Chaos Gamma. Unknown life form detected. Engaging."],
      ] },
    { title: "Gamma", kind: "battle", arena: "depot", foes: [{ who: "gamma", lvl: 1 }],
      before: [
        ["gamma", "Assignment: guard the vault. Query: you are made of water. My weapons may be ineffective."],
        [N, "Chaos doesn't answer. It never does."],
      ],
      after: [
        ["gamma", "...Systems damaged. Your attacks carry no malice. Only... protection."],
        [N, "Chaos reaches past Gamma, and lifts the Chao egg out of its case, very gently."],
        ["gamma", "Data found. A unit of my line once freed creatures from the Doctor's machines. I believe... he was right to."],
        ["gamma", "The Doctor's engine will drain the springs. The Chao. Everything. New assignment: help you stop it."],
      ] },
    { title: "Star Engine", kind: "battle", arena: "station", allies: ["gamma"], foes: [{ who: "eggman", lvl: 2 }],
      before: [
        [N, "The Egg Orbital, among the stars. The Star Engine turns at the station's heart, and the power of every pool and river below is draining into it."],
        ["eggman", "YOU?! The puddle AND my own robot?! Is nothing in this world loyal to me?!"],
        ["gamma", "Correction. We are loyal. To the world."],
      ],
      after: [
        ["eggman", "No way! I can't believe this! I'll get you for this, you... puddle!"],
        [N, "The Star Engine stops. The Red Star Rings shake loose and fall back toward the world like shooting stars."],
        [N, "That night, the springs fill to the brim. A new Chao hatches from the egg Chaos carried home, and the ring at the bottom of the deepest pool glows, quiet and safe."],
        [N, "Chaos sinks into the water, among the Chao. Chaos' episode: the end."],
      ] },
  ] });

  // ==================================================================== Chaos Gamma
  S.EPISODES.push({ who: "gamma", title: "New Assignment", blurb: "Chaos Gamma was built to guard Eggman's vault and obey. Three intruders later, it begins to ask questions.",
  chapters: [
    { title: "Calibration", kind: "run", stage: "depot",
      before: [
        [N, "Iron Hold Depot, under the mountains. A new robot stands on the test floor: Chaos Gamma, built from the plans of an old E-100 series unit."],
        ["eggman", "Chaos Gamma! Your assignment: guard my vault, and every Red Star Ring that goes into it! But first, a little test run."],
        ["gamma", "Acknowledged. Beginning calibration."],
        ["eggman", "The badniks on the course are your targets! Don't worry, I've got plenty more."],
      ],
      beats: [
        [0.15, "gamma", "Targets acquired. Firing."],
        [0.55, "gamma", "Query: the targets are Doctor Robotnik's own units. Why destroy them?"],
        [0.92, "eggman", "Because I SAID so! That's why!"],
      ],
      after: [
        ["eggman", "Excellent! Excellent! Faster than E-102, stronger than E-102, and none of his annoying ideas!"],
        ["gamma", "Query: what were E-102's ideas?"],
        ["eggman", "Never you mind! To your post!"],
      ] },
    { title: "The Small Unit", kind: "battle", arena: "depot", foes: [{ who: "tails", lvl: 1 }],
      before: [
        [N, "An intruder at the gate. A small fox with two tails and a scanner."],
        ["tails", "Built on E-102 Gamma's design... I've read your schematics! You don't have to do this!"],
        ["gamma", "Assignment: guard. Engaging."],
      ],
      after: [
        ["tails", "Ow... okay, okay, I'm going! But Eggman's engine will drain the power out of everything. Even you!"],
        [N, "The fox flies off. Gamma logs the words, without knowing why."],
        ["gamma", "Data stored. Query pending."],
      ] },
    { title: "The Prisoner", kind: "battle", arena: "depot", foes: [{ who: "amy", lvl: 1 }],
      before: [
        [N, "The next intruder doesn't use the gate. She comes through the wall with a hammer."],
        ["amy", "Eggman's got the rings in here! And you're... you look just like E-102 Gamma. He was my friend."],
        ["gamma", "Unit Chaos Gamma. Intruder. You will be detained."],
        ["amy", "If you want a fight, you'll get one!"],
      ],
      after: [
        [N, "Gamma locks the girl in the cell beside the vault. She doesn't stop talking."],
        ["amy", "You don't have to do everything he tells you, you know. The other Gamma didn't."],
        ["gamma", "Query: what did the other Gamma do?"],
        ["amy", "He saw the animals trapped inside Eggman's robots, and he set them free. Even his brothers. Even though it hurt him."],
        ["gamma", "...Data stored."],
      ] },
    { title: "The Digger", kind: "battle", arena: "depot", foes: [{ who: "knuckles", lvl: 1 }],
      before: [
        [N, "The third intruder comes up through the floor."],
        ["knuckles", "My shrine's rings are in here! Out of my way, tin can!"],
        ["gamma", "Assignment: guard the vault. The Doctor's orders."],
        ["knuckles", "Eggman lies to everyone, you know. He lied to me this morning. Twice."],
      ],
      after: [
        ["knuckles", "Grr... You hit hard, for a machine."],
        [N, "The echidna digs his way back out. Gamma stands alone at the vault, and runs its stored data again."],
        ["gamma", "Three intruders. Three warnings. The engine drains everything. The Doctor lies. The other Gamma chose."],
        ["gamma", "...Query resolved."],
      ] },
    { title: "The Turn", kind: "run", stage: "s-vault",
      before: [
        [N, "Gamma opens the cell door."],
        ["amy", "Gamma? You're... letting me out?"],
        ["gamma", "New assignment: protect the girl. Stop the Star Engine."],
        ["eggman", "GAMMA! What do you think you're doing?! Badniks, stop them both!"],
        ["gamma", "Out of the vault. This way."],
      ],
      beats: [
        [0.15, "gamma", "Former allies approaching. Targets acquired."],
        [0.55, "amy", "Go, Gamma! I knew you were a good one!"],
        [0.92, "gamma", "The loading bay. The last shipment."],
      ],
      after: [
        [N, "In the loading bay, Metal Sonic is lifting the last case of rings onto its back."],
        ["eggman", "Metal Sonic! Take the rings to the station, and scrap that traitor on the way!"],
      ] },
    { title: "Metal", kind: "battle", arena: "depot", foes: [{ who: "metal", lvl: 2 }],
      before: [
        ["gamma", "Unit Metal Sonic. Halt. Those rings will not reach the Doctor."],
        ["metal", "(Metal Sonic's eyes flare red. It sets the case down.)"],
      ],
      after: [
        [N, "Metal Sonic reels, sparking. Then its jet roars, and it snatches up the case and is gone, out of the bay and up the launch track toward the sky."],
        ["gamma", "Target escaping. Pursuing."],
        ["amy", "Gamma, wait for me!"],
      ] },
    { title: "Launch Track", kind: "run", stage: "s-launch",
      before: [
        [N, "The launch track runs from the mountains all the way up into the stars, to the Egg Orbital. Metal Sonic is somewhere ahead."],
        ["gamma", "Hover systems: engaged."],
      ],
      beats: [
        [0.15, "eggman", "Gamma! Turn back now and I'll only melt you down a LITTLE!"],
        [0.55, "gamma", "Negative."],
        [0.92, "gamma", "The docking port. Sonic is already here."],
      ],
      after: [
        ["sonic", "Whoa, Gamma? Amy said you switched sides! Welcome to the team!"],
        ["gamma", "Correction. I chose a side. Proceeding to the station's core."],
      ] },
    { title: "Engine Core", kind: "run", stage: "s-core",
      before: [
        [N, "The Egg Orbital. Its power lines run through every corridor toward the Star Engine."],
        ["gamma", "Analysis: the engine is drawing power from the planet. Animals, plants, machines. Everything."],
      ],
      beats: [
        [0.1, "eggman", "Gamma! I BUILT you! You can't do this to me!"],
        [0.5, "gamma", "You built me. The choice is mine."],
        [0.88, "gamma", "The engine room."],
      ],
      after: [
        [N, "The Star Engine turns, set all round with Red Star Rings. Eggman waits in front of it in the Egg Mobile. Amy runs in, out of breath."],
        ["amy", "Gamma! You didn't think you were doing this without me, did you?"],
      ] },
    { title: "Chosen", kind: "battle", arena: "station", allies: ["amy"], foes: [{ who: "eggman", lvl: 2 }],
      before: [
        ["eggman", "You traitor! I gave you the best parts money could buy!"],
        ["gamma", "Correction. You gave me parts. Amy gave me a choice."],
        ["amy", "Aww, Gamma! Let's get him!"],
      ],
      after: [
        ["eggman", "No way! I can't believe this! My own robot! I'll get you for this!"],
        [N, "Gamma fires one shot into the Star Engine's main coupling. The engine slows, and stops, and the Red Star Rings fall back toward the world like shooting stars."],
        ["amy", "Look, Gamma. Shooting stars. Make a wish!"],
        ["gamma", "...Wish registered: that the girl gets her date."],
        ["amy", "Gamma! You're the best!"],
        ["gamma", "Assignment complete. New assignment: undetermined. ...I look forward to it. Chaos Gamma's episode: the end."],
      ] },
  ] });
})(typeof globalThis !== "undefined" ? globalThis : this);
