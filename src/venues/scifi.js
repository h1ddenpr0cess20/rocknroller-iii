import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, centre, flat, frontHeading, toBack, wallTile, wash } from './helpers.js';

/**
 * Scene 5: The Space Picture. A starship built on Stage 12 out of plywood
 * and fairy lights, the stars painted on the cyclorama behind it: out of the
 * airlock, along a corridor where the plasma conduits run live either side,
 * onto the bridge on red alert (a reel in the captain's quarters, behind a
 * hull panel that is only painted ply); out along the hull on moving
 * walkways that run toward the edge, through the coolant vents, down the
 * engine room where the presses come down on the beat (a reel across the
 * reactor on a plank); the pass is in the sick bay, and the hangar is shut;
 * a flying saucer across the void, and down in the lift to the alien
 * planet, where the last reel is in a crater behind a painted sky. Robots,
 * rubber aliens, camera drones. Synths, four on the floor.
 */

export const SCIFI = {
  tiles: ['#8a92a8', '#767e96', '#5ad8ff', '#5a6280'],
  walls: ['#9aa2b8', '#848ca4', '#5ad8ff', '#6a7290'],
  ambient: [0.9, 0.98, 1.1], lamp: '#9af0ff', trap: '#1e2230', lift: '#3a4058', exit: '#5af0ff', zap: '#ff3aff', zapHue: 5.0, vary: 0.04,
};

/** Cyan, magenta, a red-alert red, a cool white. */
const SPACE = ['#3ae8ff', '#ff3aff', '#ff3a3a', '#e0f0ff'];

export function scifi() {
  const g = new Venue({
    name: 'The Space Picture', act: 5, cols: 136, rows: 134, palette: SCIFI, tempo: 126,
    intro: 'In space, no one can hear Rock roll. On Stage 12, everyone can.',
    look: {
      genre: 'Science Fiction', grade: 'scifi', theme: 'scifi', floor: 'grate', wall: 'hull', lamp: 'bulb', crusher: 'piston', lift: 'saucer', pyro: 'steam',
      hemi: ['#c8e0ff', '#2a2440', 1.1], key: '#e0f0ff', keyK: 1.05, lantern: '#d8f0ff',
      skyColors: ['#000004', '#02020c', '#060418', '#0c0624', '#140a30'], stars: true,
      reflect: SPACE, ceiling: '#141a2a',
      rig: { colors: SPACE.slice(0, 2), program: 'chase', every: 2 },
    },
  });
  const sign = (p, along, text, color = SPACE[0], size = 0.55, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const DECK = { floor: 'grate', wall: 'hull' };

  // The airlock.
  g.room(2, 4, 5, 5, 80, { lamps: 3, ...DECK });
  g.start = { x: 4, z: 6 };
  const d = digger(g, { x: 7, z: 6, h: 80, heading: '+x' });
  // The corridor: the conduits live down both sides, a robot on patrol between them.
  const corridor = d.hall(14, { width: 5, ...DECK });
  g.zap(...corridor.rect(3, 9, corridor.lo, 1), d.h);
  g.zap(...corridor.rect(3, 9, corridor.lo + 4, 1), d.h);
  g.foe('robot', ...corridor.tile(8, 0), { range: 4, path: [corridor.tile(5, 0), corridor.tile(11, 0)] });
  g.pick(...corridor.tile(1, 0), 5).pick(...corridor.tile(4, 0), 5).pick(...corridor.tile(7, 1), 5).pick(...corridor.tile(13, 0), 10);
  sign(corridor, 2, 'DECK 7', SPACE[0], 0.5);
  sign(corridor, 12, 'AIRLOCK', SPACE[2], 0.45);
  d.turn('+z', DECK);
  d.hall(2, DECK);

  // The bridge: consoles round the walls, the captain's chair, the viewscreen, red alert.
  const bridge = d.room(15, 13, { ...DECK, floor: 'panels' });
  g.block(...bridge.rect(3, 9, bridge.back * 6, 1), 0.85, { prop: 'console' });
  g.pillar(...bridge.tile(8, -1), 0.9, { prop: 'chair' });
  for (const [a, b] of [[4, 3], [11, 3]]) g.block(...bridge.rect(a, 2, b, 1), 0.85, { prop: 'console' });
  g.foe('alien', ...bridge.tile(5, -3), { range: 6 }).foe('alien', ...bridge.tile(11, -2), { range: 6 });
  g.foe('pa', ...bridge.tile(13, 4), { range: 5 });
  g.pick(...bridge.tile(2, 0), 10).pick(...bridge.tile(7, -4), 10).pick(...bridge.tile(13, -4), 10);
  g.suitcase(...bridge.tile(2, 5), 50);
  sign(bridge, 7.5, 'RED ALERT', SPACE[2], 0.6, 1.8);
  for (const k of [3, 12]) g.light('strobe', ...wallTile(bridge, k), { colors: [SPACE[2]], reach: 8, height: 1.4, cycle: 16, on: 4, shift: k });
  wash(g, bridge, [SPACE[0], SPACE[1]], { cans: 2, program: 'pulse', every: 2 });
  // The captain's quarters, behind a hull panel that is only painted ply: the first reel.
  const quarters = branch(d, bridge, 11, 'front', 7);
  const panel = quarters.hall(5, DECK);
  flat(g, panel, 3, { look: 'steel' });
  const cabin = quarters.room(5, 5, { floor: 'carpet', wall: 'hull' });
  g.globe(...cabin.tile(3, 0));
  g.pick(...cabin.tile(1, -1), 10).pick(...cabin.tile(1, 1), 10);
  d.hall(2, DECK);
  d.turn('+x', DECK);

  // Out on the hull: a walkway along the edge of the stars, belts running toward it.
  const hull = d.ledge(20, { width: 4, ...DECK, wallTex: 'hull' });
  const edge = frontHeading(hull);
  g.belt(...hull.rect(4, 3, hull.lo, 4), edge);
  g.belt(...hull.rect(12, 3, hull.lo, 4), edge);
  g.foe('drone', ...hull.tile(9, 0), { path: [hull.tile(5, -1), hull.tile(16, -1)] });
  g.pick(...hull.tile(2, hull.back), 5).pick(...hull.tile(8, hull.back), 5).pick(...hull.tile(16, hull.back), 10);
  sign(hull, 9, 'VIEWPORT', SPACE[0], 0.5);
  d.turn('+z', DECK);
  d.hall(2, DECK);

  // The coolant vents: steam blasting up across the way on the beat.
  const vents = d.hall(12, { width: 5, ...DECK });
  g.pyro(...across(vents, 3, { beats: 4 }));
  g.pyro(...across(vents, 7, { beats: 4, offset: 0.5 }));
  g.foe('robot', ...vents.tile(10, 0), { range: 3 });
  g.pick(...vents.tile(5, 0), 5).pick(...vents.tile(5, 1), 5).pick(...vents.tile(9, -1), 10);
  g.tape(...vents.tile(11, 1));
  sign(vents, 5, 'COOLANT', SPACE[3], 0.45);
  d.turn('+x', DECK);
  d.hall(2, DECK);

  // The engine room: the presses coming down on the beat, the reactor in the middle; the sick bay off it.
  const engine = d.room(17, 13, { ...DECK, floor: 'plate' });
  for (const [along, b, offset] of [[4, -4, 0], [8, 2, 0.33], [12, -4, 0.66]]) g.drop(...engine.rect(along, 2, b, 3).slice(0, 2), { w: engine.dir[0] ? 2 : 3, d: engine.dir[0] ? 3 : 2, beats: 4, offset });
  g.block(...engine.rect(7, 3, -6, 2), 1.3, { prop: 'rack' });
  g.foe('robot', ...engine.tile(6, 3), { range: 5 }).foe('alien', ...engine.tile(14, 1), { range: 5 });
  g.pick(...engine.tile(2, 0), 10).pick(...engine.tile(10, 5), 10).pick(...engine.tile(15, -3), 10);
  g.lighter(...engine.tile(16, 5));
  wash(g, engine, [SPACE[1], SPACE[0]], { cans: 3, program: 'chase', every: 2 });
  g.light('laser', ...wallTile(engine, 6), { color: SPACE[1], radius: 4, height: 2.2 });
  // Across the reactor pit on a plank, the conduits live below: the second reel.
  const reactor = branch(d, engine, 15, 'back', 7);
  const plank = reactor.bridge(7, { floor: 'grate' });
  g.zap(...plank.rect(0, 7, plank.lo - 2, 5), reactor.h - 1.8, { fill: true });
  g.foe('drone', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const core = reactor.room(5, 5, { ...DECK, floor: 'plate' });
  g.globe(...core.tile(2, 0));
  // The sick bay, off the front of the engine room: the pass.
  const sick = branch(d, engine, 5, 'front', 7);
  sick.hall(3, DECK);
  const bay = sick.room(7, 7, { ...DECK, floor: 'panels' });
  g.pass(...bay.tile(4, 0));
  g.pillar(...bay.tile(2, 2), 1.2, { prop: 'pod' });
  g.pillar(...bay.tile(2, -2), 1.2, { prop: 'pod' });
  g.foe('pa', ...bay.tile(5, 2), { range: 4 });
  g.tape(...bay.tile(6, -2));
  const lock = d.hall(5, DECK);
  barred(g, lock, 2);
  sign(lock, 4, 'HANGAR', SPACE[0], 0.5);
  d.turn('+z', DECK);
  d.hall(2, DECK);

  // The hangar: the saucer across the void.
  const deck = d.hall(4, { width: 5, ...DECK });
  g.foe('alien', ...deck.tile(2, 0), { range: 3 });
  const voidway = d.ferry(12, { size: 3, period: 7 });
  void voidway;
  const pad = d.hall(3, DECK);
  g.pick(...pad.tile(1, 0), 10);
  // Down in the lift, to the planet.
  d.shaft(4, { size: 3, period: 7 });
  d.hall(2, { floor: 'dirt', wall: 'stone' });
  d.turn('+x', { floor: 'dirt', wall: 'stone' });

  // The alien planet: purple rock, a crater, aliens, a robot, and the painted sky over it all.
  const planet = d.room(17, 13, { floor: 'dirt', wall: 'stone' });
  g.bowl(...planet.rect(3, 5, 1, 5), d.h, 0.5);
  for (const [a, b] of [[3, -4], [13, 4], [14, -4]]) g.bumper(...planet.tile(a, b), { radius: 0.45, look: 'post' });
  g.foe('alien', ...planet.tile(6, -3), { range: 6 }).foe('robot', ...planet.tile(12, -2), { range: 6 }).foe('alien', ...planet.tile(15, 2), { range: 5 });
  g.pick(...planet.tile(5, 3), 10).pick(...planet.tile(11, 0), 10).pick(...planet.tile(16, -3), 10);
  g.suitcase(...planet.tile(16, 5), 70);
  wash(g, planet, [SPACE[1], '#9a5aff'], { cans: 3, program: 'static' });
  // Behind the painted sky at the back of the planet: the last reel.
  const crater = branch(d, planet, 9, 'back', 7);
  const skyHall = crater.hall(5, { wall: 'flats' });
  flat(g, skyHall, 3, { look: 'backdrop' });
  const nook = crater.room(5, 5, { floor: 'dirt', wall: 'flats' });
  g.globe(...nook.tile(3, 0));
  void backTile; void centre; void toBack;
  d.hall(3, { floor: 'dirt', wall: 'stone' });
  d.exit(3);
  return g;
}
