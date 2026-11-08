import { createExit as exit } from 'madness-engine/venue/scenery';
import { bill } from 'madness-engine/textures/venue';

export { createVenueMeshes } from 'madness-engine/venue/scenery';

// The tour's posters: the world tour, and the bands on the bill with it.
bill({
  bands: ['WORLD TOUR', 'BOULDER DASH', 'THE PEBBLES', 'LANDSLIDE', 'BEDROCK', 'THE SEDIMENTS', 'MAGMA', 'SCREE', 'GRANITE', 'SLAB', 'TECTONIC', 'HARD PLACE'],
  headline: 'ROCK · LIVE',
  badge: 'SOON',
});

/** The way out of a stop: the engine's frame with a lit sign, with this tour's words on it. */
export const createExit = (GFX, venue, options = {}) => exit(GFX, venue, { signs: { exit: 'CUT', last: 'THE END' }, ...options });
