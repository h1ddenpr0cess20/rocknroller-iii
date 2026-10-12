import { action } from './action.js';
import { backlot } from './backlot.js';
import { casting } from './casting.js';
import { horror } from './horror.js';
import { musical } from './musical.js';
import { noir } from './noir.js';
import { pirate } from './pirate.js';
import { premiere } from './premiere.js';
import { scifi } from './scifi.js';
import { western } from './western.js';

/**
 * The sets, in the order of the shoot: each a night further along, and
 * each dug with `dig.js` a piece at a time, with the people, hazards and
 * treasure put into the pieces by where they are in them.
 */
export const VENUES = [casting, backlot, western, musical, scifi, horror, noir, pirate, action, premiere];

export function loadVenue(index) {
  return VENUES[index]();
}
