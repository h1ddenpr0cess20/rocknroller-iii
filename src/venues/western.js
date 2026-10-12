import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, toBack, wallTile, wash } from './helpers.js';

/**
 * Reel 3: The Western. A frontier town on the backlot, shot day-for-night
 * and printed in sepia: down off Boot Hill among the headstones, along Main
 * Street, its mud churned to soup between the troughs and the barrels, a
 * reel in the bank's vault behind a balsa wall; into the saloon, where an
 * extra has been drinking the prop whiskey, and the mirror behind the bar is
 * sugar glass with a reel behind it; out the back past the sheriff's office (the pass is on
 * his desk), the livery and its pantomime horse; and down into the mine,
 * barred until the pass opens it, where crates come down off the hoist, the
 * effects crew's dynamite goes off on the beat, and a mine cart is the way
 * across the chasm. A whistle over a train beat, and twangy guitars at a
 * gallop.
 */

export const WESTERN = {
  tiles: ['#b89a6a', '#a4865a', '#8a6a48', '#9a8060'],
  walls: ['#a8885e', '#94744c', '#7a5a3a', '#8a6c48'],
  ambient: [1.0, 0.92, 0.85], lamp: '#ffb860', trap: '#3a2a1e', lift: '#4a3a30', exit: '#ffb02a', sticky: '#5a3a1e', zapHue: 0.4, vary: 0.08,
};

/** Lamplight, a sunset's last orange, a lantern's red. */
const DUSK = ['#ffb860', '#ff7a3a', '#ffd890'];

export function western() {
  const g = new Venue({
    name: 'The Western', act: 3, cols: 130, rows: 130, palette: WESTERN, tempo: 132,
    intro: 'This town ain\'t big enough for the both of us. Rock is very big.',
    look: {
      genre: 'Western', grade: 'sepia', theme: 'spain', floor: 'dirt', wall: 'clapboard', lamp: 'bulb', crusher: 'crate', lift: 'cart',
      hemi: ['#f0d8b8', '#5a3a28', 1.1], key: '#ffe8c8', keyK: 1.1, lantern: '#ffd8a8',
      skyColors: ['#0a0614', '#1a0e22', '#3a1a2a', '#6a2a22', '#a8481a'], stars: true, skyline: '#140a0a',
      reflect: DUSK, ceiling: '#3a2418',
      rig: { colors: DUSK, program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = DUSK[2], size = 0.55, height = 1.6) => g.light('marquee', ...wallTile(p, along), { text, color, height, size });
  const lantern = (p, along) => g.light('bulb', ...wallTile(p, along), { color: '#ffb860' });
  const BOARDS = { floor: 'planks', wall: 'clapboard' };

  // Boot Hill: headstones in the dirt, a cactus or two, the town below.
  g.room(2, 4, 5, 5, 76, { lamps: 3, floor: 'dirt', wall: 'fence' });
  g.start = { x: 4, z: 6 };
  const d = digger(g, { x: 7, z: 6, h: 76, heading: '+x' });
  const hill = d.hall(10, { width: 5, floor: 'dirt', wall: 'fence' });
  for (const k of [2, 5, 8]) g.pillar(...backTile(hill, k), 0.7, { prop: 'tombstone' });
  g.bumper(...hill.tile(4, 1), { radius: 0.45, look: 'cactus' });
  g.pick(...hill.tile(1, 0), 5).pick(...hill.tile(3, -1), 5).pick(...hill.tile(6, 0), 5).pick(...hill.tile(9, 1), 10);
  g.foe('cowboy', ...hill.tile(7, 1), { range: 4 });
  d.turn('+z', { width: 5, floor: 'dirt', wall: 'fence' });
  d.ramp(6, 3, { width: 5, floor: 'dirt', wall: 'fence' });

  // Main Street: the mud down the middle, troughs and barrels along the boardwalk, the town out after dark.
  const street = d.room(22, 11, { floor: 'dirt' });
  g.sticky(...street.rect(6, 9, -2, 5));
  for (const k of [3, 11, 18]) g.pillar(...backTile(street, k), 0.6, { prop: 'trough' });
  for (const [a, b] of [[4, 2], [14, -3], [19, 3]]) g.bumper(...street.tile(a, b), { radius: 0.42, look: 'barrel' });
  g.foe('cowboy', ...street.tile(5, -3), { range: 6 }).foe('cowboy', ...street.tile(16, 3), { range: 6 });
  g.foe('horse', ...street.tile(10, 0), { range: 6 });
  g.pick(...street.tile(2, 0), 10).pick(...street.tile(8, 4), 10).pick(...street.tile(12, -4), 10).pick(...street.tile(20, 0), 10);
  for (const k of [6, 14]) lantern(street, k);
  g.light('festoon', ...street.tile(2, -5), { to: [17 * street.dir[0] + 10 * street.across[0], 17 * street.dir[1] + 10 * street.across[1]], colors: ['#ffd890', '#ffb860', '#ff9a4a'], height: 2.4 });
  sign(street, 9, 'GENERAL STORE', DUSK[2], 0.4);
  sign(street, 17, 'BANK', DUSK[2], 0.5);
  // Behind the bank's back wall, a stunt wall of balsa: the first reel, in the vault.
  const bank = branch(d, street, 20, 'back', 6);
  const vaultHall = bank.hall(5, BOARDS);
  flat(g, vaultHall, 1, { look: 'wood' });
  const vault = bank.room(5, 5, { floor: 'planks', wall: 'block' });
  g.globe(...vault.tile(3, 0));
  g.pick(...vault.tile(1, -1), 10).pick(...vault.tile(1, 1), 10);
  d.hall(5, BOARDS);
  d.turn('+x', BOARDS);
  d.hall(3, BOARDS);

  // The saloon: the bar down the back, the piano, tables, and the extra who has been at the prop whiskey.
  const saloon = d.room(15, 11, { floor: 'planks', wall: 'clapboard' });
  g.block(...saloon.rect(3, 8, saloon.back * 5, 1), 0.9, { prop: 'bar' });
  g.block(...saloon.rect(2, 2, -saloon.back * 4, 1), 0.8, { prop: 'piano' });
  for (const [a, b] of [[5, 1], [8, 3], [10, -1]]) g.pillar(...saloon.tile(a, b), 0.62, { prop: 'table' });
  g.foe('drunk', ...saloon.tile(5, -2), { range: 5 }).foe('drunk', ...saloon.tile(10, 2), { range: 5 });
  g.foe('cowboy', ...saloon.tile(13, -1), { range: 5 });
  g.pick(...saloon.tile(2, -3), 10).pick(...saloon.tile(9, -3), 10).pick(...saloon.tile(13, 4), 10);
  g.tape(...saloon.tile(14, 3));
  sign(saloon, 7, 'SALOON', '#ffd890', 0.6);
  wash(g, saloon, ['#ffb860', '#ff9a5a'], { cans: 2, program: 'static' });
  // Through the mirror at the end of the bar, which is sugar glass, as saloon mirrors are: the back room, and a reel.
  const back = branch(d, saloon, 12, 'back', 6);
  const mirror = back.hall(5, BOARDS);
  flat(g, mirror, 3, { look: 'glass', breakAt: 6 });
  const den = back.room(5, 5, { floor: 'planks', wall: 'clapboard' });
  g.globe(...den.tile(3, 0));
  g.pick(...den.tile(1, -1), 10).pick(...den.tile(1, 1), 10);
  d.hall(3, BOARDS);
  d.turn('+z', BOARDS);

  // Behind the saloon: the sheriff's office (the pass is on his desk) and the livery.
  const yard = d.hall(14, { width: 5, floor: 'dirt', wall: 'fence' });
  g.foe('stuntman', ...yard.tile(10, 0), { range: 4 });
  g.pick(...yard.tile(3, 0), 5).pick(...yard.tile(6, 1), 5).pick(...yard.tile(12, -1), 10);
  const office = branch(d, yard, 4, 'front', 3);
  office.hall(3, BOARDS);
  const sheriff = office.room(7, 7, { floor: 'planks', wall: 'clapboard' });
  g.pass(...sheriff.tile(4, 0));
  g.block(...sheriff.rect(5, 1, -2, 2), 0.8, { prop: 'desk' });
  g.foe('cowboy', ...sheriff.tile(2, 2), { range: 4 });
  g.lighter(...sheriff.tile(5, 2));
  sign(sheriff, 3.5, 'SHERIFF', DUSK[2], 0.45);
  const livery = branch(d, yard, 11, 'back', 3);
  livery.hall(2, { floor: 'dirt', wall: 'fence' });
  const barn = livery.room(7, 7, { floor: 'dirt', wall: 'canvas' });
  g.sticky(...barn.rect(1, 5, -2, 5));
  for (const [a, b] of [[1, -3], [6, 3]]) g.pillar(...barn.tile(a, b), 0.7, { prop: 'bale' });
  g.foe('horse', ...barn.tile(4, 0), { range: 4 });
  g.suitcase(...barn.tile(6, -3), 60);
  const mine = d.hall(5, { floor: 'dirt', wall: 'stone' });
  barred(g, mine, 2, 'bars');
  sign(mine, 4, 'MINE', '#ff9a4a', 0.5);
  d.turn('+x', { floor: 'dirt', wall: 'stone' });
  d.chute(8, 3, { floor: 'dirt' });

  // The mine: the hoist bringing crates down across the drift, and the dynamite.
  const drift = d.hall(16, { width: 5, floor: 'dirt', wall: 'stone' });
  g.drop(...across(drift, 4, { beats: 6 }));
  g.pyro(...across(drift, 9, { beats: 6, offset: 0.25 }));
  g.drop(...across(drift, 13, { beats: 6, offset: 0.5 }));
  g.foe('pa', ...drift.tile(7, 1), { range: 3 });
  g.pick(...drift.tile(2, 0), 5).pick(...drift.tile(6, -1), 5).pick(...drift.tile(11, 1), 5).pick(...drift.tile(15, 0), 10);
  for (const k of [2, 7, 11]) lantern(drift, k);
  d.hall(2, { floor: 'dirt', wall: 'stone' });
  // The chasm: the cart is the only way over, the lighting cables loose in the dark below.
  const chasm = d.ferry(10, { size: 3, period: 7, style: 'cart' });
  g.zap(...chasm.rect(0, 10, chasm.lo - 2, 7), d.h - 1.8, { fill: true });
  const landing = d.hall(3, { floor: 'dirt', wall: 'stone' });
  g.tape(...landing.tile(1, 1));
  d.turn('+z', { floor: 'dirt', wall: 'stone' });
  d.stairs(3, 1.5, { wall: 'stone' });

  // The seam: one more stick of dynamite, a stunt double, and along a plank over the dark, the last reel.
  const seam = d.room(13, 11, { floor: 'dirt', wall: 'stone' });
  g.pyro(...across(seam, 9, { beats: 6 }));
  g.foe('stuntman', ...seam.tile(5, 2), { range: 5 }).foe('cowboy', ...seam.tile(11, -2), { range: 4 });
  g.pick(...seam.tile(3, -3), 10).pick(...seam.tile(6, 4), 10).pick(...seam.tile(12, 3), 10);
  wash(g, seam, ['#ffb860', '#ff7a3a'], { cans: 2, program: 'pulse', every: 2 });
  const shaft = branch(d, seam, 4, 'front', 6);
  const plank = shaft.bridge(7, { floor: 'planks' });
  g.zap(...plank.rect(0, 7, plank.lo - 2, 5), shaft.h - 1.8, { fill: true });
  g.foe('pa', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const nugget = shaft.room(5, 5, { floor: 'dirt', wall: 'stone' });
  g.globe(...nugget.tile(2, 0));
  g.suitcase(...nugget.tile(3, 1), 70);
  d.hall(3, { floor: 'dirt', wall: 'stone' });
  d.ramp(5, 2, { wall: 'stone' });
  // Out by the water tower.
  const out = d.room(7, 7, { floor: 'dirt', wall: 'fence' });
  g.bumper(...out.tile(3, 2), { radius: 0.45, look: 'cactus' });
  g.light('festoon', ...out.tile(0, -3), { to: [6 * out.dir[0] + 6 * out.across[0], 6 * out.dir[1] + 6 * out.across[1]], colors: DUSK, height: 2.2 });
  void toBack;
  d.hall(2, { floor: 'dirt', wall: 'fence' });
  d.exit(3);
  return g;
}
