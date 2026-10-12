import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, centre, flat, toBack, wallTile, wash } from './helpers.js';

/**
 * Scene 7: The Noir. Stage 9's city street, in black and white, in the rain
 * the effects crew have kept falling all night, and Rock narrating the whole
 * thing in a voice like a wet cigarette. Down off the hotel steps into a
 * street of wet asphalt and steaming manholes under the lamps, a downed
 * line fizzing in a puddle by the kerb; the detective's office up off the
 * street, the light through the blinds laying bars across the floor, a
 * dame waiting, the pass in the desk and a reel behind the frosted glass of
 * the inner office; down an alley where crates come off the hoist, into the
 * Rock Bottom Club, a basement of smoke and a piano, a reel in the back
 * room; out the back to the docks, a launch across the black water, and the
 * warehouse where Mr. Big waits among his crates under one bare bulb, and
 * moves only on the beat. Brushes, a walking bass, a sax in the rain.
 */

export const NOIR = {
  tiles: ['#6a6a6e', '#58585c', '#8a8a8e', '#4a4a4e'],
  walls: ['#7a7a7e', '#6a6a6e', '#5a5a5e', '#606064'],
  ambient: [0.9, 0.9, 0.95], lamp: '#fff0d8', trap: '#202024', lift: '#3a3a3e', exit: '#ffffff', zap: '#e8f0ff', zapHue: 3.0, vary: 0.07,
};

/** Lamplight and neon, all of it white enough once the picture is black and white. */
const NIGHT = ['#fff0d8', '#ffffff', '#ffd8b0', '#d8e4ff'];

export function noir() {
  const g = new Venue({
    name: 'The Noir', act: 7, cols: 146, rows: 138, palette: NOIR, tempo: 84,
    intro: 'It was raining. In this town, it is always raining. The rain is a hose.',
    look: {
      genre: 'Film Noir', grade: 'noir', weather: 'rain', voice: 'noir', theme: 'tokyo',
      floor: 'asphalt', wall: 'brick', lamp: 'bulb', crusher: 'crate', lift: 'raft', pyro: 'steam', gate: null,
      hemi: ['#c8ccd8', '#202024', 0.95], key: '#e8ecff', keyK: 1.15, lantern: '#f0f0f4',
      skyColors: ['#020204', '#06060a', '#0c0c10', '#141418', '#1c1c22'], skyline: '#040406',
      reflect: NIGHT, ceiling: '#141418',
      rig: { colors: NIGHT.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = NIGHT[1], size = 0.6, height = 1.7) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const STREET = { floor: 'asphalt', wall: 'brick' };
  const ROOMS = { floor: 'planks', wall: 'wallpaper' };

  // The hotel steps, a newsie on the corner.
  g.room(16, 4, 5, 5, 82, { lamps: 3, ...STREET });
  g.start = { x: 18, z: 6 };
  const d = digger(g, { x: 21, z: 6, h: 82, heading: '+x' });
  const steps = d.hall(6, STREET);
  g.foe('newsie', ...steps.tile(4, 0), { range: 4 });
  g.pick(...steps.tile(1, 0), 5).pick(...steps.tile(3, 0), 5).pick(...steps.tile(5, 0), 5);
  sign(steps, 3, 'HOTEL', NIGHT[1], 0.7, 1.8);
  d.turn('+z', STREET);
  d.stairs(3, 1.5, { wall: 'brick' });

  // The street: wet, the lamps lit, a car at the kerb, the manholes steaming, a flatfoot and a hood.
  const street = d.room(24, 11, STREET);
  for (const k of [3, 11, 23]) g.light('streetlamp', ...street.tile(k, -street.back * 4), { height: 2.6, buzz: k === 11 });
  g.block(...street.rect(18, 3, -street.back * 4 - (street.back > 0 ? 1 : 0), 2), 0.9, { prop: 'sedan' });
  g.pyro(...across(street, 7, { beats: 4 }));
  g.pyro(...across(street, 16, { beats: 4, offset: 0.5 }));
  g.bumper(...street.tile(4, 3), { radius: 0.4, look: 'hydrant' });
  g.bumper(...street.tile(21, -3), { radius: 0.4, look: 'hydrant' });
  for (const k of [1, 22]) g.pillar(...backTile(street, k), 0.8, { prop: 'trash' });
  // A line down in a puddle by the kerb, fizzing.
  g.zap(...street.rect(10, 2, -street.back * 5, 1), d.h);
  g.foe('cop', ...street.tile(4, -2), { range: 3 }).foe('gangster', ...street.tile(12, 2), { range: 3 });
  g.foe('newsie', ...street.tile(20, 0), { range: 5 });
  g.pick(...street.tile(2, 0), 10).pick(...street.tile(10, -2), 10).pick(...street.tile(13, 0), 10).pick(...street.tile(22, 2), 10);
  sign(street, 5, 'CAFE', NIGHT[2], 0.6);
  sign(street, 13, 'BAR', NIGHT[1], 0.7);
  sign(street, 21, 'ROOMS', NIGHT[3], 0.55);
  // Headlights going by, sweeping the street.
  g.light('spot', ...wallTile(street, 17), { colors: ['#ffffff'], radius: 3, aim: toBack(street).map((v) => -5 * v), height: 1.3, angle: 0.24 });

  // The detective's office, up a flight off the street: the blinds, the desk, the dame.
  const up = branch(d, street, 9, 'back', 6);
  up.hall(3, { floor: 'planks', wall: 'brick' });
  const office = up.room(9, 9, ROOMS);
  g.block(...office.rect(5, 2, 1, 1), 0.8, { prop: 'desk' });
  for (const k of [1, 2]) g.pillar(...backTile(office, k), 1.2, { prop: 'cabinet' });
  g.pass(...office.tile(6, -1));
  g.foe('dame', ...office.tile(3, 2), { range: 4 });
  g.pick(...office.tile(7, 3), 10);
  g.tape(...office.tile(7, -3));
  g.light('blinds', ...wallTile(office, 5), { aim: toBack(office).map((v) => -3.2 * v), height: 2.0, width: 2.4, depth: 2.8 });
  sign(office, 7.5, 'PRIVATE', NIGHT[2], 0.4, 1.6);
  // The inner office, behind its frosted glass: the first reel, in the safe.
  const inner = branch(up, office, 6, 'front', 5);
  const door = inner.hall(5, ROOMS);
  flat(g, door, 3, { look: 'glass', breakAt: 6 });
  const safe = inner.room(5, 5, ROOMS);
  g.globe(...safe.tile(3, 0));
  g.suitcase(...safe.tile(1, 1), 60);
  d.hall(2, STREET);
  d.turn('+x', STREET);

  // The alley: cobbles, bins, a fire escape overhead, crates coming off the hoist, a goon in a doorway.
  const alley = d.hall(16, { width: 5, floor: 'cobble', wall: 'brick' });
  g.drop(...across(alley, 5, { beats: 4 }));
  g.drop(...across(alley, 11, { beats: 4, offset: 0.5 }));
  for (const k of [2, 8, 14]) g.pillar(...backTile(alley, k), 0.8, { prop: 'trash' });
  g.foe('goon', ...alley.tile(14, 1), { range: 2 });
  g.pick(...alley.tile(3, 0), 5).pick(...alley.tile(8, 1), 5).pick(...alley.tile(15, 0), 10);
  g.tape(...alley.tile(15, -1));
  g.light('bulb', ...wallTile(alley, 8), { color: '#fff0d8', buzz: true });
  d.turn('+z', { floor: 'cobble', wall: 'brick' });
  d.stairs(4, 2, { wall: 'brick' });
  d.hall(2, ROOMS);

  // The Rock Bottom Club: a basement of smoke, the piano, tables, the bar, the stage lit for a singer who isn't singing.
  const club = d.room(17, 13, { floor: 'checker', wall: 'damask' });
  g.block(...club.rect(3, 9, club.back * 6, 1), 0.9, { prop: 'bar' });
  g.block(...club.rect(13, 2, -club.back * 5, 1), 0.88, { prop: 'piano' });
  for (const [a, b] of [[4, 2], [8, -2], [8, 3], [12, 0]]) g.pillar(...club.tile(a, b), 0.62, { prop: 'table' });
  g.foe('dame', ...club.tile(14, 2), { range: 5 }).foe('gangster', ...club.tile(6, -2), { range: 5 });
  g.foe('bouncer', ...club.tile(2, 3), { range: 3 });
  g.pick(...club.tile(2, -2), 10).pick(...club.tile(10, 5), 10).pick(...club.tile(15, -3), 10);
  g.lighter(...club.tile(16, -5));
  sign(club, 8, 'THE ROCK BOTTOM', NIGHT[1], 0.5, 1.9);
  g.light('spot', ...wallTile(club, 14), { colors: ['#ffffff'], radius: 2, aim: toBack(club).map((v) => -6 * v), height: 2.4 });
  wash(g, club, [NIGHT[2], NIGHT[0]], { cans: 2, program: 'static' });
  // Through the back of the bar, past the mirror: the back room, and the second reel.
  const back = branch(d, club, 14, 'back', 7);
  const mirror = back.hall(5, { floor: 'planks', wall: 'brick' });
  flat(g, mirror, 3, { look: 'wood' });
  const den = back.room(5, 5, ROOMS);
  g.globe(...den.tile(3, 0));
  g.pillar(...den.tile(3, 2), 0.62, { prop: 'table' });
  const exit = d.hall(4, { floor: 'planks', wall: 'brick' });
  barred(g, exit, 2);
  d.turn('+x', { floor: 'planks', wall: 'brick' });

  // The docks: the pier along the black water, the crane at work, a launch across to the warehouse.
  const pier = d.ledge(18, { width: 4, floor: 'planks', wallTex: 'corrugated' });
  g.drop(...across(pier, 6, { beats: 4 }));
  g.foe('gangster', ...pier.tile(10, 0), { range: 3 });
  g.pick(...pier.tile(3, pier.back), 5).pick(...pier.tile(9, pier.back), 10).pick(...pier.tile(16, pier.back), 5);
  g.light('streetlamp', ...pier.tile(12, pier.back), { height: 2.4 });
  sign(pier, 3, 'PIER 9', NIGHT[1], 0.5);
  // A launch out to the end of the jetty, where the last reel is in a fishing boat's hold.
  const jetty = branch(d, pier, 13, 'front', 2);
  jetty.ferry(9, { size: 3, period: 7 });
  const boat = jetty.room(5, 5, { floor: 'planks', wall: 'fence' });
  g.globe(...boat.tile(2, 0));
  g.pick(...boat.tile(3, -1), 10).pick(...boat.tile(3, 1), 10);
  d.turn('+z', { floor: 'planks', wall: 'corrugated' });
  d.hall(3, { floor: 'concrete', wall: 'corrugated' });
  d.turn('+x', { floor: 'concrete', wall: 'corrugated' });
  d.hall(2, { floor: 'concrete', wall: 'corrugated' });

  // The warehouse: crates stacked, one bare bulb, goons, and Mr. Big.
  const store = d.room(21, 15, { floor: 'concrete', wall: 'corrugated' });
  for (const [a, b] of [[4, -6], [4, 6], [18, -6], [18, 6]]) g.pillar(...store.tile(a, b), 0.9, { prop: 'crate' });
  g.block(...store.rect(9, 3, -7, 1), 1.3, { prop: 'racking' });
  g.foe('mrbig', ...store.tile(14, 0), { range: 6 });
  g.pick(...store.tile(2, 0), 10).pick(...store.tile(7, -4), 10).pick(...store.tile(7, 4), 10).pick(...store.tile(12, -5), 10);
  g.tape(...store.tile(2, -5)).tape(...store.tile(2, 5));
  g.light('blinds', ...wallTile(store, 9), { aim: toBack(store).map((v) => -4 * v), height: 2.2, width: 3, depth: 3.4, program: 'pulse' });
  void centre;
  d.hall(3, { floor: 'concrete', wall: 'corrugated' });
  d.exit(3);
  return g;
}
