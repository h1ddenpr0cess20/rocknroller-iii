/**
 * What Rock says. Not much, and flatly: he is several tons of granite, he
 * has been cast in a picture, and this is all a bit much. A line is picked
 * for what just happened; the people have a line of their own, said the
 * first time one is smashed.
 *
 * On some sets he talks the way the picture does (`look.voice`): in the
 * noir, every line is the voice-over.
 */

export const QUIPS = Object.freeze({
  smash: ['Noted.', 'Excuse me.', 'They\'ll be fine.', 'Was that someone?', 'Mm.', 'Rolling through.', 'I did say I was coming through.', 'Sorry. No I\'m not.', 'Hit my mark. And theirs.'],
  crit: ['That was a lot of person.', 'Rock accepts the applause.', 'Oops. Anyway.', 'That one had it coming. They all do.', 'One take.'],
  bonk: ['Ow. For a rock, I felt that.', 'Firm.', 'I need a run-up.', 'That was a person. Dense.'],
  tap: ['That\'s just bumping into someone.', 'Speed, Rock. Speed.', 'Walking into people. Great plan.'],
  fell: ['Gravity still works.', 'Down. As is tradition.', 'I\'m a rock. This is what I do.', 'That\'s not on the call sheet.'],
  zapped: ['I did not need that.', 'Mm. Tingly.', 'Rocks conduct. Who knew.'],
  crushed: ['That was a sandbag. I was under it.', 'Flattened. By the set. Rude.'],
  burnt: ['Warm.', 'Medium rare.', 'That was pyro. The effects budget is huge.'],
  scalded: ['Steam. I\'ve been steamed.', 'A facial. I didn\'t book a facial.'],
  thud: ['Hard landing.', 'Ouch. Floor.'],
  tape: ['Gaffer tape fixes everything.', 'Patched.', 'Silver tape. Holds a rock together. Mostly.'],
  clapper: ['A clapperboard. In case of me.', 'Take two. If it comes to that.'],
  pass: ['A studio pass. I was already everywhere.', 'A pass. Fine. I\'ll use it.'],
  locked: ['CLOSED SET. I\'m a rock. I\'m the set.', 'It\'s shut. I need the pass.'],
  sturdy: ['It\'s holding. I need more speed.', 'That wall is real. For now.'],
  broke: ['It was a wall. Was.', 'There was a room behind that.', 'Nobody told me that was balsa.', 'Breakaway. As it says on the tin.'],
  reel: ['A golden reel. It\'s round. I like it.', 'Gold. Shiny. Round. Like me.', 'That\'s in the can.'],
  retake: ['...Fine. From the top.', 'Take two. Do I have a choice?', 'Back up. I\'m a professional.'],
  combo: ['Now we\'re rolling.', 'That\'s a lot of people at once.', 'Combo. Is that what this is.'],
  clear: ['That was a scene.', 'Next.', 'Good take. Nobody asked me.', 'Print it.'],
  wrap: ['That\'s a wrap. I\'d like my trailer.', 'Roll credits. Mine first.'],
  shattered: ['I\'ve been better.', 'In pieces. As expected.', 'Well. That\'s that.', 'I\'ll be in my trailer. All of me.'],
  ready: ['Okay.', 'Let\'s go.', 'Let\'s get this over with.', 'Rolling.'],
});

/** The noir's voice-over: Rock, hard-boiled, in the rain. */
export const NOIR = Object.freeze({
  smash: ['Down like a bad alibi.', 'Another face in the rain. Not for long.', 'They had it coming. Everybody does, in this town.', 'I rolled on. The rain didn\'t care. Neither did I.'],
  crit: ['Never saw me coming. Nobody ever sees the rock.', 'Flat as last week\'s beer. And twice as bitter.'],
  bonk: ['Harder than they looked. So was I.', 'I needed a run at it. I always do.'],
  tap: ['I bounced off like a bad cheque.', 'Too slow. The city eats the slow ones.'],
  fell: ['The street gave way. The street always does.', 'Down. Like the rain. Like everything.'],
  zapped: ['Live wire. I was warned. I didn\'t listen.', 'Electric. Like trouble.'],
  crushed: ['It came down out of the dark. Things do.'],
  scalded: ['The steam came up out of the street like a bad memory.'],
  burnt: ['Somebody lit a fuse. It wasn\'t me.'],
  thud: ['I hit the ground. The ground hit back.'],
  tape: ['Tape. It holds a man together. A rock, too.'],
  clapper: ['A clapperboard. Everybody gets a second take. Almost everybody.'],
  pass: ['A pass. Somebody wanted me inside. That\'s never good.'],
  locked: ['The door was locked. Doors in this town usually are.'],
  sturdy: ['The wall held. I needed more speed, and a better reason.'],
  broke: ['There was a room behind the wall. There always is.'],
  reel: ['A golden reel. Everybody wants one. Nobody gets one clean.'],
  retake: ['I got up. You always get up. That\'s the job.'],
  combo: ['They kept coming. So did I.'],
  clear: ['Case closed. For tonight.'],
  shattered: ['They found me in pieces in the rain. Just another rock.'],
  ready: ['It was raining. It\'s always raining.', 'The city had a secret. I had nothing but time.'],
});

const VOICES = { noir: NOIR };

/** A line for `kind`, in `voice` where it has one, picked by `random` (a function giving 0 to 1). */
export function say(kind, voice = null, random = Math.random) {
  const lines = VOICES[voice]?.[kind] ?? QUIPS[kind];
  if (!lines?.length) return '';
  return lines[Math.floor(random() * lines.length) % lines.length];
}
