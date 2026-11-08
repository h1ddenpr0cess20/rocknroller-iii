import { createActors } from './actors.js';
import { createGig as create } from 'madness-engine/venue/gig';
import { loadVenue } from './venues/index.js';

export * from 'madness-engine/venue/gig';

/** What each kind of pickup does on this tour. */
export const PICKUPS = Object.freeze({
  pick: { score: 1 },
  suitcase: { score: 5 },
  tape: { heal: true },
  lighter: { revive: true },
  pass: { pass: true },
  globe: { token: true },
});

/** Starts stop `index` of the tour. */
export const createGig = (GFX, index, options = {}) => create(GFX, index, { loadVenue, createActors, pickups: PICKUPS, ...options });

/** The rating inputs for this stop as it stands. */
export const resultOf = (gig) => ({ smashed: gig.stats.smashed, foes: gig.stats.foes, globes: gig.stats.tokens });
