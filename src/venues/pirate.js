import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, centre, flat, toBack, wallTile, wash } from './helpers.js';

/**
 * Scene 8: The Swashbuckler. A galleon built full size in the studio's big
 * tank, and an island at the far end of it: down from the crow's nest by
 * the rigging, the parrot circling; over the quarterdeck, past the wheel,
 * where the powder kegs go up on the beat; the length of the main deck
 * under the yardarm, cargo swinging down off it, the cannons run out along
 * the rail and a reel at the end of the plank; down the hatch into the
 * hold, the captain's cabin with the pass and a reel in a sea chest behind
 * a bulkhead; out by the barred gun port onto the dock, a rowing boat
 * across the tank, and Treasure Island, where the last reel is buried.
 * A fiddle, a snare marching, strings sawing away.
 */

export const PIRATE = {
  tiles: ['#9a7a52', '#86684a', '#c8a868', '#7a5c40'],
  walls: ['#8a6a48', '#76583c', '#a88858', '#6a4e36'],
  ambient: [1.0, 0.95, 0.9], lamp: '#ffc070', trap: '#3a2a1e', lift: '#5a4030', exit: '#ffd23a', sticky: '#4a3a2a', zapHue: 3.4, vary: 0.07,
};

/** Lantern light, gold, a sea-blue, the sails' cream. */
const SEA = ['#ffc070', '#ffd23a', '#3a9ad8', '#f4ead0'];

export function pirate() {
  const g = new Venue({
    name: 'The Swashbuckler', act: 8, cols: 136, rows: 140, palette: PIRATE, tempo: 112,
    intro: 'Rock has been asked to walk the plank. Rock is a boulder. The plank has views.',
    look: {
      genre: 'Swashbuckler', theme: 'pirate', floor: 'planks', wall: 'clapboard', lamp: 'bulb', crusher: 'crate', lift: 'raft',
      hemi: ['#c8d8f0', '#3a2a20', 1.1], key: '#fff0d8', keyK: 1.1, lantern: '#ffe0b0',
      skyColors: ['#02040c', '#060c1c', '#0c1830', '#14243e', '#203048'], stars: true,
      reflect: SEA, ceiling: '#1a2030',
      rig: { colors: SEA.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const lantern = (p, along) => g.light('bulb', ...wallTile(p, along), { color: '#ffc070' });
  const DECK = { floor: 'planks', wall: 'clapboard' };

  // The crow's nest.
  g.room(2, 4, 5, 5, 90, { lamps: 3, floor: 'planks', wall: 'fence' });
  g.start = { x: 4, z: 6 };
  const d = digger(g, { x: 7, z: 6, h: 90, heading: '+x' });
  const yard = d.hall(5, { floor: 'planks', wall: 'fence' });
  g.pick(...yard.tile(1, 0), 5).pick(...yard.tile(3, 0), 5);
  // Down the rigging: a long way, the parrot going round.
  const ratlines = d.stairs(10, 5, { floor: 'planks', wall: 'fence' });
  g.foe('parrot', ...ratlines.tile(5, 0), { path: [ratlines.tile(1, 0), ratlines.tile(9, 0)] });
  g.pick(...ratlines.tile(3, 0), 5).pick(...ratlines.tile(6, 0), 5).pick(...ratlines.tile(9, 0), 10);
  d.hall(2, DECK);
  d.turn('+z', DECK);
  d.hall(2, DECK);

  // The quarterdeck: the wheel, a pirate at it, and the powder kegs going up across the deck.
  const quarter = d.room(13, 11, DECK);
  g.pillar(...quarter.tile(3, 0), 0.9, { prop: 'wheel' });
  for (const k of [2, 6, 10]) g.pillar(...backTile(quarter, k), 0.7, { prop: 'barrel' });
  g.pyro(...across(quarter, 7, { beats: 4 }));
  g.foe('pirate', ...quarter.tile(5, 2), { range: 5 }).foe('pirate', ...quarter.tile(10, -2), { range: 4 });
  g.pick(...quarter.tile(1, -3), 10).pick(...quarter.tile(5, -4), 10).pick(...quarter.tile(11, 3), 10);
  g.tape(...quarter.tile(11, -4));
  for (const k of [4, 9]) lantern(quarter, k);
  d.hall(2, DECK);
  d.turn('+x', DECK);
  d.hall(2, DECK);

  // The main deck: the cannons run out along the rail, barrels to bounce off, cargo coming down off the yardarm.
  const deck = d.hall(22, { width: 7, ...DECK });
  for (const k of [2, 6, 10, 14, 18]) g.pillar(...backTile(deck, k), 0.8, { prop: 'cannon' });
  g.drop(...across(deck, 8, { beats: 4 }));
  g.drop(...across(deck, 15, { beats: 4, offset: 0.5 }));
  for (const [a, b] of [[4, 1], [12, -1], [19, 2]]) g.bumper(...deck.tile(a, b), { radius: 0.42, look: 'barrel' });
  g.foe('pirate', ...deck.tile(5, -1), { range: 4 }).foe('stuntman', ...deck.tile(17, 0), { range: 3 });
  g.foe('parrot', ...deck.tile(11, 0), { path: [deck.tile(3, 2), deck.tile(20, 2)] });
  g.pick(...deck.tile(2, 0), 10).pick(...deck.tile(10, 1), 5).pick(...deck.tile(13, -2), 5).pick(...deck.tile(21, 0), 10);
  g.suitcase(...deck.tile(21, -2), 50);
  for (const k of [4, 12, 20]) lantern(deck, k);
  g.light('festoon', ...deck.tile(1, -3), { to: [20 * deck.dir[0] + 6 * deck.across[0], 20 * deck.dir[1] + 6 * deck.across[1]], colors: [SEA[0], SEA[3]], height: 2.6 });
  // Off the rail, the plank, out over the tank: the first reel, at the very end of it.
  const plankRoot = branch(d, deck, 6, 'front', 4);
  const plank = plankRoot.bridge(8, { floor: 'planks' });
  g.foe('parrot', ...plank.tile(4, 0), { path: [plank.tile(1, 0), plank.tile(6, 0)] });
  const end = plankRoot.room(3, 3, { floor: 'planks', wall: 'fence' });
  g.globe(...end.tile(1, 0));
  d.hall(2, DECK);
  d.turn('+z', DECK);
  // Down the hatch.
  d.stairs(4, 2, { wall: 'clapboard' });
  d.hall(2, { floor: 'planks', wall: 'plywood' });

  // The hold: barrels and crates, lanterns swinging, the crew below decks; the captain's cabin aft.
  const hold = d.room(17, 13, { floor: 'planks', wall: 'plywood' });
  for (const [a, b] of [[2, -5], [2, 5], [7, -5], [12, 5], [15, -5]]) g.pillar(...hold.tile(a, b), 0.8, { prop: 'crate' });
  for (const k of [4, 10]) g.pillar(...backTile(hold, k), 0.7, { prop: 'barrel' });
  g.foe('pirate', ...hold.tile(5, 1), { range: 5 }).foe('pirate', ...hold.tile(12, -2), { range: 5 });
  g.pick(...hold.tile(3, 0), 10).pick(...hold.tile(9, 3), 10).pick(...hold.tile(14, 0), 10);
  g.lighter(...hold.tile(16, 4));
  wash(g, hold, [SEA[0], SEA[1]], { cans: 2, program: 'static' });
  // The captain's cabin, off the hold: the pass on the chart table.
  const aft = branch(d, hold, 4, 'front', 7);
  aft.hall(3, { floor: 'planks', wall: 'plywood' });
  const cabin = aft.room(7, 7, { floor: 'carpet', wall: 'clapboard' });
  g.pass(...cabin.tile(4, 0));
  g.block(...cabin.rect(5, 1, 2, 2), 0.8, { prop: 'desk' });
  g.foe('stuntman', ...cabin.tile(2, -2), { range: 3 });
  g.tape(...cabin.tile(6, -2));
  // Behind a bulkhead at the back of the hold, a sea chest: the second reel.
  const bulk = branch(d, hold, 13, 'back', 7);
  const bulkHall = bulk.hall(5, { floor: 'planks', wall: 'plywood' });
  flat(g, bulkHall, 3, { look: 'wood' });
  const store = bulk.room(5, 5, { floor: 'planks', wall: 'plywood' });
  g.globe(...store.tile(3, 0));
  g.pillar(...store.tile(3, 2), 0.7, { prop: 'chest' });
  g.suitcase(...store.tile(1, -1), 60);
  const port = d.hall(4, { floor: 'planks', wall: 'plywood' });
  barred(g, port, 2, 'bars');
  d.turn('+x', { floor: 'planks', wall: 'fence' });

  // The dock, and a rowing boat across the tank.
  const dock = d.hall(4, { floor: 'planks', wall: 'fence' });
  g.foe('pirate', ...dock.tile(2, 0), { range: 3 });
  d.ferry(12, { size: 3, period: 7 });

  // Treasure Island: sand, palms, a wreck's timbers to bounce off, and the last reel in a cave behind a fall of painted rock.
  const isle = d.room(15, 13, { floor: 'dirt', wall: 'fence' });
  for (const [a, b] of [[3, -4], [11, 4], [12, -4]]) g.bumper(...isle.tile(a, b), { radius: 0.45, look: 'cactus' });
  g.foe('pirate', ...isle.tile(6, 2), { range: 5 }).foe('parrot', ...isle.tile(8, 0), { path: [isle.tile(3, -3), isle.tile(13, -3), isle.tile(13, 3), isle.tile(3, 3)] });
  g.pick(...isle.tile(2, 0), 10).pick(...isle.tile(8, -4), 10).pick(...isle.tile(14, 2), 10);
  wash(g, isle, [SEA[2], SEA[0]], { cans: 2, program: 'static' });
  const cave = branch(d, isle, 9, 'back', 7);
  const fall = cave.hall(5, { floor: 'dirt', wall: 'stone' });
  flat(g, fall, 3, { look: 'stone' });
  const hoard = cave.room(5, 5, { floor: 'dirt', wall: 'stone' });
  g.globe(...hoard.tile(3, 0));
  g.pillar(...hoard.tile(3, 2), 0.7, { prop: 'chest' });
  void centre; void toBack;
  d.hall(3, { floor: 'dirt', wall: 'fence' });
  d.exit(3);
  return g;
}
