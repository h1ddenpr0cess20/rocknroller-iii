import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, centre, flat, toBack, wallTile, wash } from './helpers.js';

/**
 * Reel 2: The Backlot. The studio after dark, searchlights over the hills:
 * in at the gate, down New York Street — a city block that is only ever
 * the front of one, brownstones and a diner with nothing behind them but
 * scaffolding, and one façade that is only painted foam — onto the studio
 * tour's tram, across the flash-flood channel, along the edge of the water
 * tank (a raft goes out to the island in the middle, and a reel is on it),
 * through the stunt show, where the pyro goes up on the beat, down
 * soundstage alley under the rigs being flown in, and into the props
 * warehouse, which is a closed set: the pass is in the commissary, with a
 * costume character on a break.
 */

export const BACKLOT = {
  tiles: ['#8a8c94', '#787a84', '#9a8a6a', '#6a6c76'],
  walls: ['#b8a890', '#a49478', '#8a7a62', '#9a8c74'],
  ambient: [0.92, 0.94, 1.04], lamp: '#ffd8a0', trap: '#2a2a2e', lift: '#c82a2a', exit: '#ffc84a', zapHue: 0.5, vary: 0.06,
};

/** Sodium amber, a searchlight's white, the studio's gold. */
const LOT = ['#ffb860', '#f4f0ff', '#ffd23a'];

export function backlot() {
  const g = new Venue({
    name: 'The Backlot', act: 2, cols: 130, rows: 126, palette: BACKLOT, tempo: 146,
    intro: 'The tour tram leaves every twenty minutes. Rock is not on it.',
    look: {
      genre: 'Studio Tour', theme: 'worldtour', floor: 'asphalt', wall: 'stucco', lamp: 'bulb', crusher: 'rig', lift: 'tram',
      hemi: ['#b8c4e8', '#3a3448', 1.1], key: '#e8ecff', keyK: 1.05, lantern: '#ffe2b8',
      skyColors: ['#020410', '#060a1e', '#0e1430', '#1c2040', '#30284a'], stars: true, skyline: '#05060c',
      reflect: LOT, ceiling: '#1a1e30',
      rig: { colors: LOT, program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = LOT[2], size = 0.6, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const STREET = { floor: 'asphalt', wall: 'brick' };

  // The gate: the guard's booth, the barrier, a searchlight in the lot behind.
  g.room(2, 4, 5, 5, 70, { lamps: 3, floor: 'asphalt', wall: 'stucco' });
  g.start = { x: 4, z: 6 };
  g.light('klieg', 3, 8, { yaw: 0.9, sweep: 0.8, shift: 0 });
  const d = digger(g, { x: 7, z: 6, h: 70, heading: '+x' });
  const drive = d.hall(10, { floor: 'asphalt' });
  g.pick(...drive.tile(2, 0), 5).pick(...drive.tile(4, 0), 5).pick(...drive.tile(6, 1), 5);
  g.foe('tourist', ...drive.tile(7, -1), { range: 4 });
  sign(drive, 4, 'STUDIO GATE 2', LOT[2], 0.45);
  d.turn('+z');
  d.hall(3);

  // New York Street: brownstones down the back, a diner, the lamps lit, a car parked, and somebody's tour group.
  const street = d.room(20, 9, STREET);
  for (const k of [3, 9, 15]) g.light('streetlamp', ...street.tile(k, -street.back * 3), { height: 2.4 });
  g.bumper(...street.tile(6, 2), { radius: 0.4, look: 'hydrant' });
  g.bumper(...street.tile(13, -2), { radius: 0.4, look: 'hydrant' });
  g.block(...street.rect(17, 3, -street.back * 3 - (street.back > 0 ? 1 : 0), 2), 0.9, { prop: 'sedan' });
  for (const k of [1, 11]) g.pillar(...backTile(street, k), 0.8, { prop: 'trash' });
  g.foe('tourist', ...street.tile(4, 0), { range: 6 }).foe('tourist', ...street.tile(10, 1), { range: 6 });
  g.foe('paparazzo', ...street.tile(14, -1), { range: 6 }).foe('pa', ...street.tile(18, 1), { range: 5 });
  g.pick(...street.tile(2, 2), 10).pick(...street.tile(8, -2), 10).pick(...street.tile(12, 3), 10).pick(...street.tile(16, 0), 10);
  sign(street, 5, 'DINER', '#ff5a7a', 0.6);
  sign(street, 13, 'HOTEL', '#7ad8ff', 0.6);
  // Through the front of a brownstone that is only painted foam: scaffolding, and a reel left on it.
  const fake = branch(d, street, 8, 'back', 5);
  const foam = fake.hall(5, { wall: 'flats', floor: 'concrete' });
  flat(g, foam, 1, { look: 'brick' });
  const scaffold = fake.room(5, 5, { wall: 'flats', floor: 'planks' });
  g.globe(...scaffold.tile(3, 0));
  g.pick(...scaffold.tile(1, -1), 10).pick(...scaffold.tile(1, 1), 10);
  d.turn('+x', STREET);

  // The tram stop, and the flash-flood channel: the tour tram is the only way across.
  const stop = d.hall(5, STREET);
  g.pick(...stop.tile(1, 0), 5).pick(...stop.tile(3, 0), 5);
  const flood = d.ferry(12, { size: 3, period: 8, style: 'tram' });
  g.zap(...flood.rect(0, 12, flood.lo - 2, 7), d.h - 1.8, { fill: true });
  d.hall(2, STREET);
  d.turn('+z', STREET);
  d.stairs(3, 1.5);

  // The water tank: a ledge along the edge of it, and the dark water; a raft goes out to the island.
  const edge = d.ledge(20, { width: 4, wallTex: 'corrugated', floor: 'planks' });
  g.foe('tourist', ...edge.tile(5, 0), { range: 4 }).foe('drone', ...edge.tile(12, 0), { path: [edge.tile(8, -1), edge.tile(17, -1)] });
  g.pick(...edge.tile(3, edge.back), 5).pick(...edge.tile(9, edge.back), 10).pick(...edge.tile(16, edge.back), 5);
  sign(edge, 4, 'TANK 1', '#7ad8ff', 0.5);
  sign(edge, 17, 'NO SWIMMING', '#ff5a3a', 0.4);
  g.light('marquee', ...wallTile(edge, 10.5), { text: 'STUDIO TOUR', color: '#ffd890', size: 0.45, height: 1.6 });
  const isle = branch(d, edge, 11, 'front', 2);
  const ferry = isle.ferry(9, { size: 3, period: 7, style: 'raft' });
  void ferry;
  const island = isle.room(5, 5, { floor: 'grass', wall: 'fence' });
  g.globe(...island.tile(2, 0));
  g.pick(...island.tile(3, -1), 10).pick(...island.tile(3, 1), 10);
  d.turn('+x', { wall: 'corrugated' });
  d.hall(3, { wall: 'corrugated', floor: 'concrete' });

  // The stunt show: bleachers along the back, pyro going up across the arena on the beat, a stunt double showing off.
  const show = d.room(15, 11, { floor: 'dirt', wall: 'fence' });
  g.block(...show.rect(2, 11, show.back * 5 - (show.back > 0 ? 1 : 0), 2), 1.4, { prop: 'stands', sturdy: true });
  for (const [along, offset] of [[5, 0], [9, 0.5]]) {
    const [x, z, w, dd] = show.rect(along, 1, show.back > 0 ? show.lo : show.lo + 2, show.width - 2);
    g.pyro(x, z, { w, d: dd, beats: 8, offset });
  }
  g.foe('stuntman', ...show.tile(7, -2), { range: 3 });
  g.pick(...show.tile(3, -2), 10).pick(...show.tile(7, -3), 5).pick(...show.tile(11, -2), 10);
  g.tape(...show.tile(13, -3));
  wash(g, show, ['#ffb860', '#ff6a3a'], { cans: 2, program: 'pulse', every: 2 });
  d.hall(3, { wall: 'stucco' });
  d.turn('+z', { wall: 'stucco' });

  // Soundstage alley: the big doors of Stages 7 and 9, golf carts, and rigs being flown in over the way.
  const alley = d.hall(18, { width: 5, wall: 'stucco', floor: 'asphalt' });
  g.drop(...across(alley, 5, { beats: 8 }));
  g.drop(...across(alley, 12, { beats: 8, offset: 0.5 }));
  g.block(...alley.rect(8, 2, alley.back * 2, 1), 0.9, { prop: 'cart' });
  g.foe('security', ...alley.tile(16, -1), { range: 3 });
  g.pick(...alley.tile(2, 0), 5).pick(...alley.tile(7, -1), 5).pick(...alley.tile(15, 1), 10);
  sign(alley, 3, 'STAGE 7', LOT[2], 0.6, 1.8);
  sign(alley, 15, 'STAGE 9', LOT[2], 0.6, 1.8);
  // The commissary, off the alley: the pass on a table, and a costume character on a break.
  const lunch = branch(d, alley, 9, 'front', 3);
  lunch.hall(3, { wall: 'stucco' });
  const commissary = lunch.room(7, 9, { floor: 'checker', wall: 'wallpaper' });
  g.pass(...commissary.tile(4, 0));
  g.foe('mascot', ...commissary.tile(2, 2), { range: 4 });
  g.block(...commissary.rect(5, 2, -3, 1), 0.85, { prop: 'craft' });
  g.pick(...commissary.tile(5, 3), 10).lighter(...commissary.tile(1, -3));
  g.light('festoon', ...commissary.tile(0, -4), { to: [6 * commissary.dir[0] + 8 * commissary.across[0], 6 * commissary.dir[1] + 8 * commissary.across[1]], colors: ['#ffd890', '#ff9a5a', '#fff4e0'], height: 2.2 });
  const door = d.hall(4, { wall: 'stucco' });
  barred(g, door, 2);
  sign(door, 0.5, 'PROPS', '#ff5a3a', 0.45, 1.6);
  d.turn('+x', { wall: 'corrugated' });
  d.hall(3, { wall: 'corrugated', floor: 'concrete' });

  // The props warehouse: racking, crates, a sedan cut in half, a production assistant counting it all.
  const store = d.room(15, 13, { floor: 'concrete', wall: 'corrugated' });
  for (const b of [-4, 2]) g.block(...store.rect(3, 4, b, 2), 1.3, { prop: 'racking' });
  g.block(...store.rect(9, 3, -4, 2), 1.3, { prop: 'racking' });
  g.foe('pa', ...store.tile(6, 0), { range: 5 }).foe('paparazzo', ...store.tile(12, 3), { range: 5 });
  g.pick(...store.tile(2, 0), 10).pick(...store.tile(8, 5), 10).pick(...store.tile(13, -1), 10);
  g.suitcase(...store.tile(13, 5), 60);
  g.tape(...store.tile(11, -5));
  wash(g, store, ['#ffd8a0', '#fff4e0'], { cans: 2, program: 'static' });
  // Behind a painted sky, at the back of the warehouse: the last reel.
  const sky = branch(d, store, 11, 'back', 6);
  const skyHall = sky.hall(6, { wall: 'flats' });
  flat(g, skyHall, 1, { breakAt: 6.5, look: 'backdrop' });
  const nook = sky.room(5, 5, { wall: 'flats' });
  g.globe(...nook.tile(3, 0));
  g.suitcase(...nook.tile(1, 1), 70);
  d.hall(3, { wall: 'corrugated' });
  d.turn('+z', { wall: 'stucco' });
  d.ramp(6, 2.5, { wall: 'stucco' });
  const back = d.room(9, 9, STREET);
  g.foe('tourist', ...back.tile(4, 0), { range: 4 });
  g.light('klieg', ...back.tile(7, back.back * 3), { yaw: 0.6, sweep: 0.9, shift: 2 });
  void centre; void toBack;
  d.hall(2, STREET);
  d.exit(3);
  return g;
}
