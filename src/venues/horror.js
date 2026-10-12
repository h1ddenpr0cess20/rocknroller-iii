import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, centre, flat, toBack, wallTile, wash } from './helpers.js';

/**
 * Scene 6: The Horror Picture. The haunted house on Stage 13, every bit of
 * it cobwebbed by the art department, shot on a stock that makes everyone
 * look a little dead: in through the graveyard, where the zombie extras
 * shamble between the headstones and the lightning (a machine on a stand)
 * goes now and then; a reel down in a tomb behind a slab of painted stone;
 * up to the house and into its great hall, a dining room where somebody has
 * loosened the chandeliers, a library with a secret passage behind a
 * bookcase, and a corridor slick with fake blood; then down past the barred
 * gate into the crypt, where the torches flare on the beat, the Mummy keeps
 * coming undone and the last reel is across the pit, on the altar. An
 * organ, a theremin, a heartbeat.
 */

export const HORROR = {
  tiles: ['#6a6670', '#58545e', '#7a3a3a', '#4a4650'],
  walls: ['#6a6670', '#5a5660', '#4a3a3a', '#504c56'],
  ambient: [0.85, 0.95, 0.9], lamp: '#ffb070', trap: '#2a1e1e', lift: '#3a3438', exit: '#9aff6a', sticky: '#6a0a0a', zapHue: 2.2, vary: 0.08,
};

/** Candlelight, a corpse's green, the lightning's white. */
const GLOOM = ['#ffb070', '#7aff8a', '#e0e8ff', '#9a3aff'];

export function horror() {
  const g = new Venue({
    name: 'The Horror Picture', act: 6, cols: 130, rows: 136, palette: HORROR, tempo: 92,
    intro: 'It was a dark and stormy night. The storm is a fan and a hose.',
    look: {
      genre: 'Horror', grade: 'horror', theme: 'horror', floor: 'cobble', wall: 'stone', lamp: 'bulb', crusher: 'chandelier', lift: 'riser',
      hemi: ['#b8d0c8', '#2a2028', 1.0], key: '#d8e8ff', keyK: 1.0, lantern: '#d8e0ff',
      skyColors: ['#020204', '#06060c', '#0c0c16', '#14121e', '#1c1824'], stars: false, skyline: '#030305',
      reflect: GLOOM, ceiling: '#141018',
      rig: { colors: GLOOM.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = GLOOM[1], size = 0.55, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const candle = (p, along) => g.light('bulb', ...wallTile(p, along), { color: '#ffb070' });
  const lightning = (p, along, shift = 0) => g.light('strobe', ...wallTile(p, along), { program: 'lightning', every: 7, shift, reach: 12, height: 1.6 });
  const HOUSE = { floor: 'carpet', wall: 'damask' };

  // The cemetery gate.
  g.room(2, 4, 5, 5, 84, { lamps: 3, floor: 'dirt', wall: 'stone' });
  g.start = { x: 4, z: 6 };
  const d = digger(g, { x: 7, z: 6, h: 84, heading: '+x' });
  const path = d.hall(6, { floor: 'dirt', wall: 'stone' });
  g.pick(...path.tile(1, 0), 5).pick(...path.tile(3, 0), 5).pick(...path.tile(5, 0), 5);
  d.turn('+z', { floor: 'dirt', wall: 'stone' });
  d.hall(2, { floor: 'dirt', wall: 'stone' });

  // The graveyard: headstones in rows, the zombies between them, the lightning machine going.
  const yard = d.room(17, 13, { floor: 'dirt', wall: 'stone' });
  for (const [a, b] of [[3, -4], [3, -1], [3, 2], [8, -3], [8, 1], [8, 4], [13, -4], [13, 0], [13, 3]]) g.pillar(...yard.tile(a, b), 0.7, { prop: 'tombstone' });
  g.foe('zombie', ...yard.tile(5, 2), { range: 6 }).foe('zombie', ...yard.tile(10, -2), { range: 6 }).foe('zombie', ...yard.tile(15, 4), { range: 5 });
  g.foe('bat', ...yard.tile(9, 0), { path: [yard.tile(4, -5), yard.tile(15, -5), yard.tile(15, 5), yard.tile(4, 5)] });
  g.pick(...yard.tile(1, 0), 10).pick(...yard.tile(6, -5), 10).pick(...yard.tile(11, 5), 10).pick(...yard.tile(16, -2), 10);
  lightning(yard, 4);
  lightning(yard, 13, 0.5);
  g.light('par', ...wallTile(yard, 8), { colors: [GLOOM[1]], program: 'static', glow: 0.6, reach: 7, aim: toBack(yard).map((v) => -4 * v), height: 1.4 });
  // A tomb off the side of the yard, its door a slab of painted stone: the first reel.
  const tomb = branch(d, yard, 10, 'front', 7);
  const slab = tomb.hall(5, { floor: 'cobble', wall: 'stone' });
  flat(g, slab, 3, { look: 'stone' });
  const vault = tomb.room(5, 5, { floor: 'cobble', wall: 'stone' });
  g.globe(...vault.tile(3, 0));
  g.pillar(...vault.tile(3, 2), 0.6, { prop: 'coffin' });
  g.pick(...vault.tile(1, -1), 10);
  d.hall(2, { floor: 'cobble', wall: 'stone' });
  d.stairs(3, 1.5, { wall: 'stone' });

  // The great hall: candles on the walls, the portraits watching.
  const hall = d.room(9, 13, HOUSE);
  for (const k of [2, 6]) candle(hall, k);
  g.foe('makeup', ...hall.tile(4, 2), { range: 5 });
  g.pick(...hall.tile(2, -3), 10).pick(...hall.tile(6, 4), 10);
  g.light('chandelier', ...centre(hall), { height: 3.2, radius: 4, color: '#ffc890' });
  d.hall(4, HOUSE);
  d.turn('+x', HOUSE);

  // The dining hall: the long table laid for nobody, and the chandeliers over the way loose on their chains.
  const dining = d.hall(18, { width: 7, ...HOUSE });
  g.block(...dining.rect(3, 12, dining.back * 3, 1), 0.8, { prop: 'bar' });
  for (const [along, offset] of [[5, 0], [10, 0.33], [15, 0.66]]) {
    const [x, z, w, dd] = dining.rect(along, 2, dining.back > 0 ? dining.lo : dining.lo + 1, dining.width - 1);
    g.drop(x, z, { w, d: dd, beats: 4, offset });
  }
  g.foe('bat', ...dining.tile(9, 1), { path: [dining.tile(3, 2), dining.tile(16, 2)] });
  g.foe('zombie', ...dining.tile(12, -1), { range: 4 });
  g.pick(...dining.tile(2, 0), 5).pick(...dining.tile(8, -2), 5).pick(...dining.tile(13, 2), 10);
  g.tape(...dining.tile(17, -2));
  for (const k of [3, 8, 13]) candle(dining, k);
  d.turn('+z', HOUSE);
  d.hall(2, HOUSE);

  // The library: shelves to the ceiling, the pass on the desk, and a bookcase that is a door.
  const library = d.room(13, 11, { floor: 'planks', wall: 'damask' });
  for (const k of [1, 2, 3, 9, 10, 11]) g.pillar(...backTile(library, k), 1.3, { prop: 'bookcase' });
  g.block(...library.rect(6, 2, 2, 1), 0.8, { prop: 'desk' });
  g.pass(...library.tile(8, 3));
  g.foe('mummy', ...library.tile(5, -2), { range: 5 }).foe('makeup', ...library.tile(10, 3), { range: 4 });
  g.pick(...library.tile(2, 2), 10).pick(...library.tile(11, -3), 10);
  candle(library, 6);
  lightning(library, 6.5, 0.3);
  // Behind the bookcase that swings: the secret passage, and the second reel.
  const secret = branch(d, library, 6, 'back', 6);
  const shelf = secret.hall(5, { floor: 'planks', wall: 'stone' });
  flat(g, shelf, 3, { look: 'wood' });
  const study = secret.room(5, 5, { floor: 'planks', wall: 'stone' });
  g.globe(...study.tile(3, 0));
  g.suitcase(...study.tile(1, 1), 60);
  d.hall(2, HOUSE);

  // The corridor of fake blood: slick, and the Mummy's understudy in it.
  const gore = d.hall(12, { width: 5, floor: 'carpet', wall: 'stone' });
  g.sticky(...gore.rect(3, 7, -2, 5));
  g.foe('mummy', ...gore.tile(6, 0), { range: 4 });
  g.pick(...gore.tile(1, 0), 5).pick(...gore.tile(11, 0), 10);
  g.lighter(...gore.tile(11, 1));
  sign(gore, 6, 'GET OUT', '#ff2a2a', 0.5);
  const gate = d.hall(4, { floor: 'cobble', wall: 'stone' });
  barred(g, gate, 2, 'bars');
  d.stairs(5, 2.5, { wall: 'stone' });
  d.turn('+x', { floor: 'cobble', wall: 'stone' });
  d.hall(2, { floor: 'cobble', wall: 'stone' });

  // The crypt: coffins along the walls, the torches flaring across the way on the beat.
  const crypt = d.room(17, 13, { floor: 'cobble', wall: 'stone' });
  for (const k of [2, 8, 14]) g.pillar(...backTile(crypt, k), 0.6, { prop: 'coffin' });
  g.pyro(...across(crypt, 5, { beats: 4 }));
  g.pyro(...across(crypt, 11, { beats: 4, offset: 0.5 }));
  g.foe('zombie', ...crypt.tile(3, 3), { range: 4 }).foe('mummy', ...crypt.tile(8, -2), { range: 4 });
  g.foe('stuntman', ...crypt.tile(14, 2), { range: 4 });
  g.foe('bat', ...crypt.tile(8, 4), { path: [crypt.tile(2, 4), crypt.tile(15, 4)] });
  g.pick(...crypt.tile(2, 0), 10).pick(...crypt.tile(8, 0), 10).pick(...crypt.tile(14, -3), 10);
  g.tape(...crypt.tile(9, 5));
  wash(g, crypt, [GLOOM[1], GLOOM[3]], { cans: 2, program: 'static' });
  // Across the pit on a plank, the altar: the last reel.
  const pit = branch(d, crypt, 8, 'front', 7);
  const plank = pit.bridge(7, { floor: 'planks' });
  g.zap(...plank.rect(0, 7, plank.lo - 2, 5), pit.h - 1.8, { fill: true });
  g.foe('bat', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const altar = pit.room(5, 5, { floor: 'cobble', wall: 'stone' });
  g.globe(...altar.tile(2, 0));
  g.light('chandelier', ...centre(altar), { height: 2.8, radius: 2.5, color: '#9aff8a' });
  d.hall(3, { floor: 'cobble', wall: 'stone' });
  d.exit(3);
  return g;
}
