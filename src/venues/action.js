import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, frontHeading, toBack, wallTile, wash } from './helpers.js';

/**
 * Scene 9: The Action Picture. The summer's big one, all of it a stunt:
 * off the helipad on the roof, down the fire stairs, out across the floors
 * of a tower going up, steel girders over the drop and the forklifts the
 * only way over the gaps, a reel through a pane of sugar glass; the parking
 * garage, where the cars go up on the beat; the freeway set, the road
 * running under the cars on belts for the driving shots; and the stunt
 * hangar, where the airbags are, the pass is with security, and the last
 * reel is behind a wall that was always going to come down. Henchmen,
 * stunt doubles, a drone getting the shot. Guitars through the
 * distortion, double kick. And the papier-mâché boulder from the
 * adventure picture next door, which keeps coming down.
 */

export const ACTION = {
  tiles: ['#7a7e86', '#686c74', '#e8a020', '#5a5e66'],
  walls: ['#8a8e96', '#767a82', '#e8a020', '#6a6e76'],
  ambient: [0.95, 0.95, 1.0], lamp: '#ffd8a0', trap: '#2a2a2e', lift: '#e8a020', exit: '#ff8a1a', zapHue: 0.6, vary: 0.06,
};

/** Fire, a warning amber, the blue of a police light, a work light's white. */
const BLAST = ['#ff6a1a', '#ffb020', '#3a6aff', '#f0f4ff'];

export function action() {
  const g = new Venue({
    name: 'The Action Picture', act: 9, cols: 142, rows: 140, palette: ACTION, tempo: 150,
    intro: 'Rock does his own stunts. Rock is his own stunt.',
    look: {
      genre: 'Action', theme: 'action', floor: 'concrete', wall: 'corrugated', lamp: 'bulb', buzz: true, crusher: 'boulder', lift: 'forklift',
      hemi: ['#c8d4ec', '#3a3430', 1.1], key: '#fff0d8', keyK: 1.1, lantern: '#ffe0a8',
      skyColors: ['#04040c', '#0a0c1c', '#141a30', '#2a1e2a', '#4a2418'], stars: true, skyline: '#05060a',
      reflect: BLAST, ceiling: '#1e2230',
      rig: { colors: BLAST.slice(0, 2), program: 'pulse', every: 2 },
    },
  });
  const sign = (p, along, text, color = BLAST[1], size = 0.55, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const beacon = (p, along, color = BLAST[1], reach = 2) => g.light('spot', ...wallTile(p, along), { colors: [color], radius: reach, aim: toBack(p).map((v) => -(reach + 1) * v), height: 1.3, angle: 0.22 });
  const SITE = { floor: 'plate', wall: 'corrugated' };

  // The helipad on the roof.
  g.room(2, 4, 5, 5, 96, { lamps: 3, floor: 'plate', wall: 'fence' });
  g.start = { x: 4, z: 6 };
  g.light('klieg', 3, 8, { yaw: 0.7, sweep: 0.9 });
  const d = digger(g, { x: 7, z: 6, h: 96, heading: '+x' });
  const roof = d.hall(12, { width: 5, floor: 'concrete', wall: 'fence' });
  for (const k of [3, 8]) g.pillar(...backTile(roof, k), 1.0, { prop: 'vent' });
  g.foe('pa', ...roof.tile(6, 1), { range: 3 }).foe('drone', ...roof.tile(9, 0), { path: [roof.tile(3, 0), roof.tile(11, 0)] });
  g.pick(...roof.tile(1, 0), 5).pick(...roof.tile(5, -1), 5).pick(...roof.tile(10, 1), 10);
  sign(roof, 6, 'HELIPAD', BLAST[3], 0.5);
  d.turn('+z', { floor: 'concrete', wall: 'block' });
  // The fire stairs: down and round.
  d.stairs(6, 3, { wall: 'block' });
  d.turn('+x', { floor: 'concrete', wall: 'block' });
  d.stairs(5, 2.5, { wall: 'block' });
  d.hall(2, SITE);

  // The tower going up: a floor of girders over the drop, the forklifts across the gaps, the boulder coming down.
  const floor = d.hall(8, { width: 5, ...SITE });
  g.drop(...across(floor, 4, { beats: 8 }));
  g.foe('stuntman', ...floor.tile(6, 1), { range: 3 });
  g.pick(...floor.tile(2, 0), 5).pick(...floor.tile(7, -1), 10);
  beacon(floor, 2);
  const gap1 = d.ferry(9, { size: 3, period: 6 });
  g.zap(...gap1.rect(0, 9, gap1.lo - 2, 7), d.h - 1.8, { fill: true });
  d.bridge(6, { width: 1, floor: 'plate' });
  const ledge = d.hall(4, { width: 3, ...SITE });
  g.tape(...ledge.tile(2, 1));
  const gap2 = d.ferry(9, { size: 3, period: 7, phase: 2 });
  g.zap(...gap2.rect(0, 9, gap2.lo - 2, 7), d.h - 1.8, { fill: true });
  const far = d.hall(4, { width: 5, ...SITE });
  g.pick(...far.tile(2, 0), 10);
  // Through the window: sugar glass, and a reel on the desk of an office nobody has moved into.
  const pane = branch(d, far, 2, 'back', 3);
  const glass = pane.hall(5, { floor: 'carpet', wall: 'block' });
  flat(g, glass, 3, { look: 'glass', breakAt: 6 });
  const suite = pane.room(5, 5, { floor: 'carpet', wall: 'block' });
  g.globe(...suite.tile(3, 0));
  g.block(...suite.rect(1, 1, 1, 2), 0.8, { prop: 'desk' });
  d.turn('+z', SITE);
  d.ramp(8, 4, { floor: 'asphalt', wall: 'block' });

  // The parking garage: cars parked, cars going up on the beat, a henchman in every bay.
  const garage = d.room(19, 13, { floor: 'asphalt', wall: 'block' });
  for (const k of [2, 7, 12]) g.block(...garage.rect(k, 2, garage.back * 6 - (garage.back > 0 ? 1 : 0), 2), 0.9, { prop: 'sedan' });
  g.pyro(...across(garage, 5, { beats: 4 }));
  g.pyro(...across(garage, 10, { beats: 4, offset: 0.5 }));
  g.pyro(...across(garage, 15, { beats: 4 }));
  g.foe('paparazzo', ...garage.tile(3, 2), { range: 3 }).foe('stuntman', ...garage.tile(8, -1), { range: 2 }).foe('goon', ...garage.tile(13, 2), { range: 2 });
  g.pick(...garage.tile(1, 0), 10).pick(...garage.tile(7, 3), 10).pick(...garage.tile(12, -2), 10).pick(...garage.tile(18, 0), 10);
  g.tape(...garage.tile(17, 4));
  for (const k of [4, 14]) beacon(garage, k, k === 4 ? BLAST[2] : BLAST[1]);
  sign(garage, 9.5, 'LEVEL P2', BLAST[3], 0.5);
  d.hall(2, { floor: 'asphalt', wall: 'block' });
  d.turn('+x', { floor: 'asphalt', wall: 'block' });

  // The freeway set: the road running under the cars on belts, toward the edge, for the driving shots.
  const freeway = d.ledge(22, { width: 5, floor: 'asphalt', wallTex: 'fence' });
  const edge = frontHeading(freeway);
  g.belt(...freeway.rect(3, 4, freeway.lo, 5), edge);
  g.belt(...freeway.rect(11, 4, freeway.lo, 5), edge);
  g.block(...freeway.rect(8, 2, freeway.back * 2, 1), 0.9, { prop: 'sedan' });
  g.block(...freeway.rect(17, 2, freeway.back * 2, 1), 0.9, { prop: 'sedan' });
  g.foe('drone', ...freeway.tile(10, 0), { path: [freeway.tile(4, -1), freeway.tile(19, -1)] });
  g.foe('goon', ...freeway.tile(20, 0), { range: 2 });
  g.pick(...freeway.tile(2, freeway.back), 5).pick(...freeway.tile(9, -freeway.back), 5).pick(...freeway.tile(16, -freeway.back), 10);
  g.lighter(...freeway.tile(21, -freeway.back));
  sign(freeway, 7, 'EXIT 9', '#3aff7a', 0.5);
  sign(freeway, 14, 'NO STUNTS', BLAST[0], 0.45);
  d.turn('+z', SITE);
  d.hall(2, SITE);

  // The stunt hangar: airbags, rigs, security with the pass; the last reel behind a wall built to come down.
  const hangar = d.room(17, 13, { floor: 'concrete', wall: 'corrugated' });
  for (const [a, b] of [[3, -4], [3, 4], [13, -4], [13, 4]]) g.pillar(...hangar.tile(a, b), 0.6, { prop: 'airbag' });
  g.block(...hangar.rect(7, 3, hangar.back * 6, 1), 1.3, { prop: 'racking' });
  g.pass(...hangar.tile(5, 3));
  g.foe('security', ...hangar.tile(12, -2), { range: 3 }).foe('pa', ...hangar.tile(14, 2), { range: 4 }).foe('pa', ...hangar.tile(5, -2), { range: 4 });
  g.pick(...hangar.tile(1, 0), 10).pick(...hangar.tile(11, -3), 10).pick(...hangar.tile(16, 3), 10);
  g.suitcase(...hangar.tile(16, -5), 70);
  wash(g, hangar, [BLAST[3], BLAST[1]], { cans: 3, program: 'static' });
  const wall = branch(d, hangar, 11, 'front', 7);
  const drywall = wall.hall(5, { floor: 'concrete', wall: 'corrugated' });
  flat(g, drywall, 3, { look: 'drywall', breakAt: 6.5 });
  const nook = wall.room(5, 5, { floor: 'concrete', wall: 'corrugated' });
  g.globe(...nook.tile(3, 0));
  // Behind the racking: the effects store, along a girder, the third reel.
  const store = branch(d, hangar, 3, 'front', 7);
  const beam = store.bridge(6, { floor: 'plate' });
  g.zap(...beam.rect(0, 6, beam.lo - 2, 5), store.h - 1.8, { fill: true });
  g.foe('drone', ...beam.tile(3, 0), { path: [beam.tile(1, 0), beam.tile(4, 0)] });
  const fx = store.room(5, 5, { floor: 'concrete', wall: 'corrugated' });
  g.globe(...fx.tile(2, 0));
  const door = d.hall(4, SITE);
  barred(g, door, 2);
  d.hall(2, SITE);
  d.exit(3);
  return g;
}
