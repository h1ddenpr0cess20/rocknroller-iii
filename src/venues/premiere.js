import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { barred, branch, centre, facingRot, flat, toBack, wallTile, wash } from './helpers.js';

/**
 * Scene 10: The Premiere. The last night of the shoot, and the first night
 * of the picture: Like a Rock opens at the movie palace on the boulevard,
 * and Rock is not on the guest list. Out of the limo onto the boulevard,
 * searchlights crossing over the hills; up the red carpet between the
 * velvet ropes, the paparazzi flashing and the fans wanting autographs, the
 * marquee over it all with his name on; into the lobby under the
 * chandeliers, the concession stand heaped with popcorn, a reel in the coat
 * check; through the doors (the usher has the pass) and down the raked
 * stalls, the rows of seats with an aisle in each, the rigs coming down
 * over them; across the orchestra pit on the fans' hands; and onto the
 * stage under the screen, where the giant gold statue stands and the Mogul
 * stamps. The main title again, with the brass out.
 */

export const PREMIERE = {
  tiles: ['#b82030', '#9a1a28', '#e8b84a', '#7a1420'],
  walls: ['#c8a050', '#b08840', '#e8c060', '#9a7838'],
  ambient: [1.05, 0.98, 0.95], lamp: '#ffe0a0', trap: '#2a1a1e', lift: '#3a2a2e', exit: '#ffd23a', zapHue: 1.2, vary: 0.04,
};

/** Gold, a searchlight's white, the carpet's red, a flashbulb's blue-white. */
const GALA = ['#ffd23a', '#f4f0ff', '#ff3a4a', '#d8e8ff'];

export function premiere() {
  const g = new Venue({
    name: 'The Premiere', act: 10, cols: 140, rows: 146, palette: PREMIERE, tempo: 146,
    intro: 'Like a Rock opens tonight. Rock is not on the list.',
    look: {
      genre: 'Premiere', theme: 'finale', floor: 'carpet', wall: 'damask', lamp: 'bulb', crusher: 'rig', lift: 'crowd',
      hemi: ['#ffe8d8', '#4a2028', 1.15], key: '#fff0e0', keyK: 1.1, lantern: '#ffe8c8',
      skyColors: ['#020410', '#060a1e', '#0e1430', '#1c1c40', '#302848'], stars: true, skyline: '#05060c',
      reflect: GALA, ceiling: '#2a1620',
      rig: { colors: GALA.slice(0, 2), program: 'chase', every: 4 },
    },
  });
  const sign = (p, along, text, color = GALA[0], size = 0.55, height = 1.6) => g.light('marquee', ...wallTile(p, along), { text, color, height, size });
  const BLVD = { floor: 'asphalt', wall: 'stucco' };
  const rope = (p, along, across = 0) => g.bumper(...p.tile(along, across), { radius: 0.4, look: 'rope' });

  // The limo, at the kerb.
  g.room(2, 4, 5, 5, 84, { lamps: 3, ...BLVD });
  g.start = { x: 4, z: 6 };
  g.light('klieg', 3, 8, { yaw: 0.5, sweep: 0.9, shift: 0 });
  const d = digger(g, { x: 7, z: 6, h: 84, heading: '+x' });
  // The boulevard: the stars in the pavement, the fans already here, the searchlights going.
  const blvd = d.hall(14, { width: 5, ...BLVD });
  g.foe('fan', ...blvd.tile(5, 1), { range: 4 }).foe('fan', ...blvd.tile(10, -1), { range: 4 });
  g.popcorn(...blvd.tile(1, 0), 5).popcorn(...blvd.tile(4, -1), 5).popcorn(...blvd.tile(8, 1), 5).popcorn(...blvd.tile(12, 0), 10);
  g.light('klieg', ...blvd.tile(7, -2), { yaw: 1.1, sweep: 0.8, shift: 1.5 });
  for (const k of [3, 11]) g.light('streetlamp', ...blvd.tile(k, 2), { height: 2.4 });
  d.turn('+z', BLVD);
  d.hall(2, { floor: 'carpet', wall: 'stucco' });

  // The red carpet: the ropes down it, the paparazzi and the fans, the palace's marquee over it with his name on.
  const carpet = d.room(24, 9, { floor: 'carpet', wall: 'damask' });
  for (const a of [3, 7, 11, 15, 19]) { rope(carpet, a, -2); rope(carpet, a, 2); }
  g.foe('paparazzo', ...carpet.tile(5, 3), { range: 4 }).foe('paparazzo', ...carpet.tile(13, -3), { range: 4 });
  g.foe('influencer', ...carpet.tile(9, 0), { range: 5 }).foe('fan', ...carpet.tile(17, 3), { range: 4 }).foe('critic', ...carpet.tile(21, -2), { range: 4 });
  g.popcorn(...carpet.tile(2, 0), 10).popcorn(...carpet.tile(8, -3), 10).popcorn(...carpet.tile(14, 3), 10).popcorn(...carpet.tile(20, 0), 10);
  sign(carpet, 11.5, 'LIKE A ROCK', GALA[0], 0.9, 1.6);
  sign(carpet, 3.5, 'TONIGHT', GALA[1], 0.45);
  sign(carpet, 20.5, 'PREMIERE', GALA[1], 0.45);
  wash(g, carpet, [GALA[1], GALA[0]], { cans: 3, program: 'static' });
  d.hall(5, { floor: 'checker', wall: 'damask' });
  d.turn('+x', { floor: 'checker', wall: 'damask' });
  d.hall(2, { floor: 'checker', wall: 'damask' });

  // The lobby: marble, chandeliers, the concession stand heaped with popcorn, the doorman at the doors.
  const lobby = d.room(15, 13, { floor: 'checker', wall: 'damask' });
  g.block(...lobby.rect(3, 9, lobby.back * 6, 1), 0.9, { prop: 'bar' });
  g.bucket(...lobby.tile(5, lobby.back * 5), 60).bucket(...lobby.tile(10, lobby.back * 5), 60);
  for (const a of [4, 11]) g.light('chandelier', ...lobby.tile(a, 0), { height: 3.2, radius: 3.5 });
  g.foe('usher', ...lobby.tile(6, 3), { range: 5 }).foe('agent', ...lobby.tile(10, -1), { range: 5 }).foe('bouncer', ...lobby.tile(13, 3), { range: 3 });
  g.pass(...lobby.tile(4, 4));
  g.popcorn(...lobby.tile(2, 0), 10).popcorn(...lobby.tile(8, 2), 10);
  g.tape(...lobby.tile(14, -3));
  sign(lobby, 7.5, 'CONCESSIONS', GALA[0], 0.5, 2.0);
  // The coat check, behind its curtain: the first reel, in somebody's coat.
  const coats = branch(d, lobby, 7, 'front', 7);
  const curtain = coats.hall(5, { floor: 'carpet', wall: 'damask' });
  flat(g, curtain, 3, { look: 'curtain', breakAt: 6 });
  const check = coats.room(5, 5, { floor: 'carpet', wall: 'damask' });
  g.reel(...check.tile(3, 0));
  g.pillar(...check.tile(3, 2), 1.1, { prop: 'rail' });
  const doors = d.hall(4, { floor: 'carpet', wall: 'damask' });
  barred(g, doors, 2);
  d.turn('+z', { floor: 'carpet', wall: 'damask' });
  d.hall(5, { floor: 'carpet', wall: 'damask' });

  // The stalls: raked down to the screen in shallow steps, rows of seats with an aisle in each, the rigs coming down over the aisles.
  const stalls = d.stairs(18, 3, { width: 13, floor: 'carpet', wall: 'damask', color: 0 });
  g.enclose(stalls.x, stalls.z, stalls.w, stalls.d, { sides: 'z0', wall: 'damask' });
  const rows = [[3, -4], [6, 3], [9, -1], [12, 4], [15, -3]];
  for (const [along, aisle] of rows) {
    const lo = stalls.lo, hi = lo + stalls.width;
    const left = aisle - 1, right = aisle + 2;
    if (left > lo) g.block(...stalls.rect(along, 1, lo, left - lo), 0.7, { prop: 'seat', rot: facingRot(stalls.dir) });
    if (hi > right) g.block(...stalls.rect(along, 1, right, hi - right), 0.7, { prop: 'seat', rot: facingRot(stalls.dir) });
  }
  for (const [i, [along, aisle]] of [[0, rows[1]], [1, rows[3]]]) g.drop(...stalls.tile(along + 1, aisle), { w: 2, d: 2, beats: 8, offset: i * 0.5 });
  g.foe('usher', ...stalls.tile(4, 0), { range: 4 }).foe('fan', ...stalls.tile(10, 2), { range: 4 }).foe('critic', ...stalls.tile(14, -2), { range: 4 });
  for (const [along, aisle] of rows) g.popcorn(...stalls.tile(along - 1, aisle), 10);
  g.clapper(...stalls.tile(16, 5));
  wash(g, stalls, [GALA[0], GALA[2]], { cans: 3, program: 'chase', every: 4 });

  // The orchestra pit: across on the fans' hands.
  d.hall(1, { width: 13, floor: 'planks', wall: 'damask' });
  const pit = d.ferry(11, { size: 3, period: 8 });
  g.zap(...pit.rect(0, 11, pit.lo - 2, 7), d.h - 1.6, { fill: true });
  g.light('strobe', ...pit.tile(5, -3), { colors: ['#ffffff'], reach: 9, height: 2.8 });
  // Into the wings, and round onto the stage.
  d.hall(2, { floor: 'planks', wall: 'curtain' });
  d.turn('+x', { floor: 'planks', wall: 'curtain' });
  d.hall(5, { floor: 'planks', wall: 'curtain' });

  // The stage, under the screen: the giant gold statue, the cameras, and the Mogul.
  const stage = d.room(19, 15, { floor: 'planks', wall: 'curtain' });
  g.block(...stage.rect(8, 3, stage.back * 6 - (stage.back > 0 ? 1 : 0), 2), 2.0, { prop: 'statue' });
  for (const [a, b] of [[4, -5], [4, 5], [15, -5], [15, 5]]) g.pillar(...stage.tile(a, b), 1.2, { prop: 'lamp' });
  g.foe('mogul', ...stage.tile(11, 0), { range: 6 });
  g.popcorn(...stage.tile(2, 0), 10).popcorn(...stage.tile(7, -5), 10).popcorn(...stage.tile(7, 5), 10).popcorn(...stage.tile(12, -5), 10);
  g.tape(...stage.tile(2, -5)).tape(...stage.tile(2, 5));
  g.light('spot', ...wallTile(stage, 5), { colors: ['#fff4e0'], radius: 3, aim: toBack(stage).map((v) => -5 * v), height: 2.6 });
  g.light('spot', ...wallTile(stage, 14), { colors: ['#fff4e0'], radius: 3, aim: toBack(stage).map((v) => -5 * v), height: 2.6, shift: 2 });
  sign(stage, 9.5, 'THE END', GALA[1], 0.6, 2.0);
  // Through the trap under the stage: the second reel.
  const trap = branch(d, stage, 5, 'front', 8);
  const under = trap.hall(5, { floor: 'planks', wall: 'block' });
  flat(g, under, 3, { look: 'wood', breakAt: 6.5 });
  const cellar = trap.room(5, 5, { floor: 'planks', wall: 'block' });
  g.reel(...cellar.tile(3, 0));
  g.bucket(...cellar.tile(1, 1), 60);
  // Up in the projection booth, along the catwalk: the third.
  const booth = branch(d, stage, 15, 'front', 8);
  const walk = booth.bridge(7, { floor: 'plate' });
  g.foe('drone', ...walk.tile(3, 0), { path: [walk.tile(1, 0), walk.tile(5, 0)] });
  const projection = booth.room(5, 5, { floor: 'concrete', wall: 'block' });
  g.reel(...projection.tile(2, 0));
  g.block(...projection.rect(3, 1, -1, 1), 1.0, { prop: 'camera' });
  void centre;
  d.hall(3, { floor: 'planks', wall: 'curtain' });
  d.exit(3);
  return g;
}
