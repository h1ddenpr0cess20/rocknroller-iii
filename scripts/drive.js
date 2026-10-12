/**
 * Puts the tests' autopilot through a set and says how it went: whether it
 * hit its mark, how long it took, every way Rock was lost or hurt, and the
 * people he ran into. For laying a set out: `node scripts/drive.js 7` (sets
 * count from 1).
 */

import { drive } from '../test/helpers/autopilot.js';
import { VENUES } from '../src/venues/index.js';

const n = Number(process.argv[2] ?? 1);
if (!(n >= 1 && n <= VENUES.length)) {
  console.error(`sets are 1 to ${VENUES.length}`);
  process.exit(1);
}
const t0 = performance.now();
const r = drive(n - 1);
const { gig } = r;
console.log(`${gig.venue.name}: ${r.finished ? 'hit the mark' : `stuck ${JSON.stringify(r.stuck)}`} in ${r.time.toFixed(1)} s of play (${Math.round(performance.now() - t0)} ms)`);
console.log(`  integrity ${gig.rock.hp}, snow globes ${gig.stats.globes}, smashed ${gig.stats.smashed} of ${gig.stats.foes}, hype ${Math.round(gig.hype.score)}`);
if (r.losses.length) console.log('  lost:', r.losses);
if (r.harms.length) console.log('  hurt:', r.harms);
const tally = {};
for (const h of r.hits) tally[`${h.kind} ${h.grade}`] = (tally[`${h.kind} ${h.grade}`] ?? 0) + 1;
console.log('  hits:', tally);
