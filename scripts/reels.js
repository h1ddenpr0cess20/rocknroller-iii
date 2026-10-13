/**
 * The reels scripts/reel.js makes. Each is a soundtrack (a theme from the
 * game's music, the tempo to play it at, and the bar of the song to open on:
 * the chorus and the solo are full-band, the intro a build), a line to open
 * on, and clips cut on its bar lines: from a stop (they count from 0), so
 * many bars long, the best stretch of it the autopilot played. Every one ends
 * on the card with the address.
 */

/** New York's brass and trumpet, from the solo into the last chorus: the band from the first beat. */
const FINALE = { theme: 'finale', tempo: 124, from: 40, lead: 0.12 };
/** Sydney's drive, the same way. */
const DRIVE = { theme: 'sydney', tempo: 128, from: 40, lead: 0.12 };

export const REELS = {
  tour: {
    hook: ['Rock goes on tour', 'ten cities · one boulder'],
    music: FINALE,
    // Four of the ten, the best each has to show, in order; New York to finish.
    clips: { from: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], take: 4, keep: [9], bars: 3 },
  },
  bosses: {
    hook: ['Three bosses', 'a yeti, a sumo and a superfan'],
    music: DRIVE,
    worth: { boss: 120, bossdown: 200 },
    clips: [
      { level: 3, bars: 4 },
      { level: 6, bars: 4 },
      { level: 9, bars: 4 },
    ],
  },
};

/**
 * What each sound the game makes is worth to a reel: a number, or a function
 * of what it was called with. A smash says how hard it was. Falls and hurts
 * are worth less than nothing: they're no advert. (`boss` and `bossdown`,
 * which recorder.js notes as a boss comes into range and goes down, are
 * worth something only to the reel about the bosses.)
 */
export const WORTH = {
  smash: (grade) => ({ crit: 45, smash: 22, bonk: 6, tap: -2 })[grade] ?? 0,
  panel: 8,
  globe: 18,
  pass: 8,
  gate: 12,
  lighter: 6,
  tape: 3,
  pick: 3,
  encore: 10,
  bumper: 3,
  flash: 2,
  slam: (near) => (near ?? 0),
  burst: (near) => (near ?? 0),
  land: (speed) => Math.min(4, (speed ?? 0) * 0.4),
  locked: 1,
  clear: 20,
  zap: -12,
  fall: -12,
  hurt: -8,
  over: -30,
};

/** How long the card to end on stays up, in seconds. */
export const CARD = 4.6;

/** How long the opening line stays up, and when the address comes in under the HUD. */
export const HOOK = 2.4;
export const PILL = 2.7;
