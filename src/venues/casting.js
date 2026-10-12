import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, flat, pick, toBack, wallTile } from './helpers.js';

/**
 * Reel 1: The Casting Call. Where Rock starts: the studio's casting office,
 * after hours, for the night shoot of Like a Rock. In off the lot by the
 * stage door, past a queue of hopefuls with their headshots, into a waiting
 * room of plastic chairs under strip lights, along the corridor behind Stage
 * 7 where the sandbags come down, and down to the screen-test stage, cameras
 * and lamps and a director's chair. Everything is taught here: rolling over
 * popcorn, running at somebody to smash them, a sandbag that drops on the
 * beat, a closed set and its pass, and a breakaway flat that someone ought
 * to run at, with a golden reel behind it. Extras, a production assistant,
 * and an agent who wants ten percent of Rock.
 */

export const CASTING = {
  tiles: ['#cfc6b4', '#b8ae9a', '#8a7a5a', '#a49a88'],
  walls: ['#d8cdb4', '#c6b99c', '#9a8a6a', '#bfb294'],
  ambient: [0.95, 0.93, 0.92], lamp: '#fff2d8', trap: '#3a3632', lift: '#4a4a52', exit: '#ffc84a', vary: 0.06,
};

/** The office's colours: strip-light white, a warm lamp, the gold of the studio's name. */
const OFFICE = ['#fff4e0', '#ffc870', '#ffe2a0'];
const GOLD = '#ffc84a';

export function casting() {
  const g = new Venue({
    name: 'The Casting Call', act: 1, cols: 92, rows: 84, palette: CASTING, tempo: 118,
    intro: 'Rock has been cast. Rock did not audition.',
    look: {
      genre: 'Screen Test', theme: 'casting', floor: 'checker', wall: 'stucco', lamp: 'bulb', crusher: 'sandbag', lift: 'dolly',
      hemi: ['#e8dcc8', '#5a4a40', 1.05], key: '#fff0e0', keyK: 1.15, lantern: '#ffe6c8',
      skyColors: ['#04060e', '#0a0e1c', '#121a30', '#1c2440', '#2a2c48'], stars: true, skyline: '#06070c',
      reflect: OFFICE, ceiling: '#2a2a38',
      rig: { colors: OFFICE, program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = GOLD, size = 0.6, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  /** A film lamp on the back wall of a piece, `along` it, shining `reach` tiles out into it. */
  const lamp = (p, along, reach = 2.5, color = OFFICE[1]) => g.light('par', ...wallTile(p, along), { colors: [color], program: 'static', glow: 0.7, reach: 7, aim: toBack(p).map((v) => -reach * v), height: 1.6 });

  // The stage door, off the lot.
  g.room(2, 4, 5, 5, 40, { lamps: 3, floor: 'asphalt', wall: 'brick' });
  g.start = { x: 4, z: 6 };
  const d = digger(g, { x: 7, z: 6, h: 40, heading: '+x' });
  // The queue of hopefuls along the wall, headshots in hand; popcorn somebody dropped to follow in.
  const queue = d.hall(8, { wall: 'posters', floor: 'concrete' });
  for (const a of [2, 3, 4]) g.pick(...queue.tile(a, 0), 5);
  g.pick(...queue.tile(6, 1), 5);
  g.foe('extra', ...queue.tile(5, -1), { range: 4 });
  sign(queue, 4, 'CASTING', GOLD, 0.6);
  d.turn('+z', { wall: 'posters', floor: 'concrete' });
  d.hall(4, { wall: 'posters', floor: 'concrete' });
  d.stairs(4, 2);

  // The waiting room: rows of chairs along the back, the water cooler, two hopefuls and the assistant with the clipboard.
  const room = d.room(15, 11, { floor: 'checker', wall: 'wallpaper' });
  for (const k of [1, 2, 3]) g.pillar(...backTile(room, k), 0.8, { prop: 'chairs' });
  for (const k of [9, 10, 11]) g.pillar(...backTile(room, k), 0.8, { prop: 'chairs' });
  g.pillar(...backTile(room, 6), 1.1, { prop: 'cooler' });
  g.block(...room.rect(12, 2, room.back * 5 - (room.back > 0 ? 1 : 0), 2), 0.8, { prop: 'desk' });
  g.foe('extra', ...room.tile(5, -2), { range: 6 }).foe('extra', ...room.tile(8, 2), { range: 6 });
  g.foe('pa', ...room.tile(10, -1), { range: 5 });
  g.pick(...room.tile(3, 3), 10).pick(...room.tile(12, -3), 10).pick(...room.tile(6, 0), 5);
  g.suitcase(...room.tile(13, -4), 50);
  sign(room, 6.5, 'NEXT', '#ff6a4a', 0.5, 1.7);
  lamp(room, 4);
  lamp(room, 13, 2.5, OFFICE[0]);
  // Off the front of the room, a bay behind a breakaway flat: the first golden reel. Run at it.
  const bay = d.fork().jump(pick(room.tile(7, -room.back * 6), room.back > 0 ? '+x' : '-x'));
  const bayHall = bay.hall(3, { width: 3, wall: 'flats' });
  flat(g, bayHall, 1, { look: 'flat' });
  const closet = bay.room(5, 5, { wall: 'flats' });
  g.globe(...closet.tile(3, 0));
  g.pick(...closet.tile(1, -1), 10).pick(...closet.tile(1, 1), 10);
  d.hall(5, { wall: 'wallpaper' });
  d.turn('+x', { wall: 'wallpaper' });

  // Down the corridor of offices, the agent pacing it.
  const offices = d.hall(11, { wall: 'wallpaper', floor: 'carpet' });
  g.foe('agent', ...offices.tile(5, 0), { range: 5, path: [offices.tile(2, 0), offices.tile(9, 0)] });
  g.pick(...offices.tile(9, 1), 10).pick(...offices.tile(3, -1), 5);
  sign(offices, 6, 'AGENTS', '#9ad0ff', 0.45, 1.5);
  // The corridor behind Stage 7, under the flies: sandbags coming down on the beat.
  const flies = d.hall(11, { wall: 'flats', floor: 'concrete' });
  g.drop(...across(flies, 4, { beats: 4 }));
  g.pick(...flies.tile(5, 0), 5).pick(...flies.tile(5, 1), 5).pick(...flies.tile(5, -1), 5);
  g.drop(...across(flies, 8, { beats: 4, offset: 0.5 }));
  g.pick(...flies.tile(9, 0), 10);
  // Past the second sandbag, the first roll of tape: for whatever the bags took off him.
  g.tape(...flies.tile(10, 0));
  d.turn('+z', { wall: 'flats' });
  d.hall(3, { wall: 'flats' });
  d.stairs(5, 2.5, { wall: 'flats' });

  // The screen-test stage: lamps on stands, a camera on its legs, the director's chair, and the way out shut.
  const stage = d.room(13, 13, { floor: 'planks', wall: 'curtain' });
  for (const [a, b] of [[2, 3], [2, -3]]) g.pillar(...stage.tile(a, b), 1.2, { prop: 'lamp' });
  g.block(...stage.rect(8, 1, 4, 1), 1.0, { prop: 'camera' });
  g.pillar(...stage.tile(8, -4), 0.9, { prop: 'chair' });
  g.foe('pa', ...stage.tile(5, 0), { range: 6 }).foe('extra', ...stage.tile(9, 3), { range: 6 }).foe('extra', ...stage.tile(10, -3), { range: 6 });
  g.suitcase(...stage.tile(11, 5), 60).pick(...stage.tile(1, -5), 10).pick(...stage.tile(6, 5), 10);
  g.lighter(...stage.tile(11, -5));
  // On the way out, once the three of them have had a go at him, a roll of tape.
  g.tape(...stage.tile(12, 1));
  g.light('spot', ...wallTile(stage, 6), { colors: ['#fff4e0'], radius: 3, aim: toBack(stage).map((v) => -4 * v), height: 2.2 });
  sign(stage, 3, 'QUIET PLEASE', '#ff4a3a', 0.4, 1.7);
  sign(stage, 7, 'ON AIR', '#ff4a3a', 0.45, 1.7);
  // Wardrobe, through a door off the stage: the studio pass is on the rail.
  const wardrobe = d.fork().jump(pick(stage.tile(6, -7), '+x'));
  wardrobe.hall(3, { wall: 'stucco' });
  const rails = wardrobe.room(6, 7, { wall: 'stucco', floor: 'carpet' });
  g.pass(...rails.tile(3, 0));
  g.pillar(...rails.tile(5, 3), 1.1, { prop: 'rail' });
  g.foe('extra', ...rails.tile(2, 2), { range: 4 });
  g.pick(...rails.tile(4, -2), 10);
  // And over the pit, along a plank, a second reel.
  const pit = d.fork().jump(pick(stage.tile(10, stage.back * 7), stage.back > 0 ? '-x' : '+x'));
  pit.hall(2, { wall: 'curtain' });
  const plank = pit.bridge(7, { floor: 'planks' });
  g.foe('extra', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const alcove = pit.room(5, 5, { wall: 'curtain' });
  g.globe(...alcove.tile(2, 0));
  d.hall(4, { wall: 'curtain' });
  const gate = d.hall(6, { wall: 'stucco' });
  barred(g, gate, 3);
  sign(gate, 5, 'CLOSED SET', '#ff4a3a', 0.4, 1.7);
  d.turn('+x', { wall: 'stucco' });
  d.ramp(7, 3, { wall: 'stucco' });

  // The last stretch: a ramp to run down, and a drywall office off it with the last reel behind the wall,
  // and the last roll of tape, for the sandbag still to come.
  const run = d.hall(9, { wall: 'stucco', floor: 'concrete' });
  const strongbox = d.fork().jump(pick(run.tile(4, -2), '-z'));
  const sbHall = strongbox.hall(7, { wall: 'wallpaper' });
  flat(g, sbHall, 6, { breakAt: 6.5, look: 'drywall' });
  const office = strongbox.room(5, 5, { wall: 'wallpaper', floor: 'carpet' });
  g.globe(...office.tile(3, 0));
  g.suitcase(...office.tile(1, -1), 70).tape(...office.tile(1, 1));
  g.foe('agent', ...run.tile(6, 1), { range: 5 });
  g.drop(...across(run, 8, { beats: 4 }));
  const last = d.room(9, 9, { wall: 'flats', floor: 'planks' });
  g.foe('extra', ...last.tile(3, -2), { range: 5 }).foe('pa', ...last.tile(4, 2), { range: 5 });
  g.pick(...last.tile(6, 0), 10);
  d.hall(3, { wall: 'flats' });
  d.stairs(3, 1.5, { wall: 'flats' });
  d.hall(2, { wall: 'flats' });
  d.exit(3);
  return g;
}
