import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, centre, flat, toBack, wallTile, wash } from './helpers.js';

/**
 * Scene 4: The Musical. Sound Stage 4, the big number, shot in Technicolor:
 * out of the dressing rooms along the corridor of mirrors, down a grand
 * staircase lined with bulbs, onto the ballroom floor under the one mirror
 * ball on the lot, a line of hoofers going through their steps and lit
 * cubes to dance on (or bounce off); a reel behind the painted sky, another
 * across the orchestra pit on a plank; the stage elevator down to the
 * understage, where the make-up artist has the pass and the wardrobe hides
 * the last reel; and out onto the soundstage floor among the cameras, where
 * the Director wants it again, bigger, with feeling, and lunges for the
 * close-up. A big band, swinging.
 */

export const MUSICAL = {
  tiles: ['#c8303a', '#a8202e', '#e8b84a', '#8a2030'],
  walls: ['#3a4ab0', '#2a3a98', '#e8b84a', '#24307a'],
  ambient: [1.05, 0.95, 1.0], lamp: '#ffe0a0', trap: '#2a1a2a', lift: '#3a2a3a', exit: '#ffd23a', zapHue: 4.2, vary: 0.05,
};

/** Technicolor: a red, a gold, a blue, a pink. */
const COLOUR = ['#ff3a5a', '#ffd23a', '#3a7aff', '#ff7ad0'];

export function musical() {
  const g = new Venue({
    name: 'The Musical', act: 4, cols: 126, rows: 132, palette: MUSICAL, tempo: 140,
    intro: 'Five, six, seven, eight. Rock does not dance. Rock rolls.',
    look: {
      genre: 'Musical', grade: 'technicolor', theme: 'musical', floor: 'planks', wall: 'curtain', lamp: 'bulb', crusher: 'rig', lift: 'riser',
      hemi: ['#ffd8e8', '#3a2040', 1.15], key: '#fff0f0', keyK: 1.1, lantern: '#ffe0d0',
      skyColors: ['#06020e', '#10061e', '#1c0a30', '#2c1040', '#3a1448'],
      reflect: COLOUR, ceiling: '#2a1438',
      rig: { colors: COLOUR, program: 'chase', every: 2 },
    },
  });
  const sign = (p, along, text, color = COLOUR[1], size = 0.55, height = 1.6) => g.light('marquee', ...wallTile(p, along), { text, color, height, size });
  const DRESS = { floor: 'carpet', wall: 'wallpaper' };

  // The dressing rooms: a star on the door, the corridor of mirrors, a hoofer warming up.
  g.room(2, 4, 5, 5, 80, { lamps: 3, ...DRESS });
  g.start = { x: 4, z: 6 };
  const d = digger(g, { x: 7, z: 6, h: 80, heading: '+x' });
  const corridor = d.hall(12, DRESS);
  for (const k of [2, 6, 10]) g.pillar(...backTile(corridor, k), 1.0, { prop: 'mirror' });
  g.foe('dancer', ...corridor.tile(7, 0), { range: 4, path: [corridor.tile(4, 0), corridor.tile(10, 0)] });
  g.pick(...corridor.tile(1, 0), 5).pick(...corridor.tile(4, 1), 5).pick(...corridor.tile(8, -1), 5).pick(...corridor.tile(11, 0), 10);
  sign(corridor, 4, 'STAGE 4', COLOUR[1], 0.5);
  d.turn('+z', DRESS);
  d.hall(2, DRESS);

  // The grand staircase: wide, bulbs all the way down both sides, hoofers on the steps.
  const stairs = d.stairs(10, 5, { width: 9, floor: 'carpet', wall: 'damask' });
  for (const side of [-1, 1]) {
    g.light('festoon', ...stairs.tile(0, side * 4), { to: [9 * stairs.dir[0], 9 * stairs.dir[1]], colors: [COLOUR[1], '#fff4e0'], height: 1.4, sag: 0.1 });
  }
  g.foe('dancer', ...stairs.tile(3, -2), { range: 4 }).foe('dancer', ...stairs.tile(6, 2), { range: 4 });
  g.pick(...stairs.tile(2, 0), 10).pick(...stairs.tile(5, -3), 5).pick(...stairs.tile(5, 3), 5).pick(...stairs.tile(8, 0), 10);
  d.hall(2, { width: 9, floor: 'carpet', wall: 'damask' });

  // The ballroom: the dance floor lit from under, the mirror ball over it, lit cubes, and the chorus line.
  const ball = d.room(19, 17, { floor: 'panels', wall: 'curtain' });
  for (const [a, b] of [[4, -4], [8, 3], [12, -3], [15, 4], [6, -1]]) g.bumper(...ball.tile(a, b), { radius: 0.5, look: 'podium' });
  const line = [ball.tile(3, 5), ball.tile(16, 5)];
  for (let k = 0; k < 4; k++) g.foe('dancer', ...ball.tile(4 + k * 3, 5), { range: 3, path: k % 2 ? [line[1], line[0]] : line });
  g.foe('drone', ...ball.tile(10, 0), { path: [ball.tile(4, -5), ball.tile(16, -5), ball.tile(16, 1), ball.tile(4, 1)] });
  g.pick(...ball.tile(2, 0), 10).pick(...ball.tile(9, -6), 10).pick(...ball.tile(11, 6), 10).pick(...ball.tile(17, 0), 10);
  g.suitcase(...ball.tile(17, -6), 50);
  g.light('ball', ...centre(ball), { colors: COLOUR, radius: 8, height: 3.4 });
  wash(g, ball, [COLOUR[0], COLOUR[2], COLOUR[3]], { cans: 3, program: 'chase', every: 2 });
  g.light('spot', ...wallTile(ball, 7), { colors: ['#fff4e0'], radius: 3, aim: toBack(ball).map((v) => -5 * v), height: 2.4 });
  g.light('spot', ...wallTile(ball, 12), { colors: ['#fff4e0'], radius: 3, aim: toBack(ball).map((v) => -5 * v), height: 2.4, shift: 2 });
  sign(ball, 9.5, 'BROADWAY MELODY', COLOUR[1], 0.45, 1.9);
  // Through the painted sky at the back of the number: a reel, left behind the scenery.
  const scenery = branch(d, ball, 3, 'back', 9);
  const skyHall = scenery.hall(5, { wall: 'flats' });
  flat(g, skyHall, 3, { look: 'backdrop' });
  const behind = scenery.room(5, 5, { wall: 'flats', floor: 'planks' });
  g.globe(...behind.tile(3, 0));
  g.pick(...behind.tile(1, -1), 10).pick(...behind.tile(1, 1), 10);
  d.hall(2, { wall: 'curtain' });
  d.turn('+x', { wall: 'curtain' });

  // The orchestra pit, under the lip of the stage: the band's lights on their stands, the rig coming down over the way.
  const lip = d.hall(14, { width: 5, floor: 'planks', wall: 'curtain' });
  g.drop(...across(lip, 4, { beats: 8 }));
  g.drop(...across(lip, 10, { beats: 8, offset: 0.5 }));
  g.foe('pa', ...lip.tile(7, 0), { range: 3 });
  g.pick(...lip.tile(2, 0), 5).pick(...lip.tile(7, -1), 5).pick(...lip.tile(12, 1), 10);
  g.tape(...lip.tile(13, -1));
  // Across the pit on a plank, to where the band keeps its music: the second reel.
  const pit = branch(d, lip, 7, 'front', 3);
  const plank = pit.bridge(7, { floor: 'planks' });
  g.zap(...plank.rect(0, 7, plank.lo - 2, 5), pit.h - 1.8, { fill: true });
  g.foe('dancer', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const band = pit.room(5, 5, { floor: 'planks', wall: 'block' });
  g.globe(...band.tile(2, 0));
  g.block(...band.rect(3, 2, -2, 1), 0.88, { prop: 'piano' });
  d.hall(2, { floor: 'planks', wall: 'curtain' });
  // The stage elevator: down to the understage.
  d.shaft(4, { size: 3, period: 7 });
  d.hall(2, { floor: 'concrete', wall: 'block' });
  d.turn('+z', { floor: 'concrete', wall: 'block' });

  // The understage: wardrobe and make-up, the pass, and the way out to the floor shut.
  const under = d.room(13, 11, { floor: 'concrete', wall: 'block' });
  for (const k of [2, 5, 8]) g.pillar(...backTile(under, k), 1.0, { prop: 'mirror' });
  g.foe('makeup', ...under.tile(6, 1), { range: 5 }).foe('critic', ...under.tile(10, -2), { range: 5 });
  g.pass(...under.tile(4, 3));
  g.pick(...under.tile(2, -2), 10).pick(...under.tile(9, 3), 10);
  g.lighter(...under.tile(12, 4));
  wash(g, under, ['#ffe0a0', COLOUR[3]], { cans: 2, program: 'static' });
  // Wardrobe, behind a curtain: the last reel among the costumes.
  const ward = branch(d, under, 10, 'front', 6);
  const curtain = ward.hall(5, { wall: 'curtain' });
  flat(g, curtain, 3, { look: 'curtain', breakAt: 6.5 });
  const rails = ward.room(5, 5, { wall: 'curtain', floor: 'carpet' });
  g.globe(...rails.tile(3, 0));
  g.pillar(...rails.tile(2, 2), 1.1, { prop: 'rail' });
  g.suitcase(...rails.tile(1, -1), 60);
  const out = d.hall(4, { floor: 'concrete', wall: 'block' });
  barred(g, out, 2);
  d.stairs(3, 1.5, { wall: 'block' });
  d.turn('+x', { wall: 'flats' });
  d.hall(2, { wall: 'flats' });

  // The soundstage floor: cameras on dollies, director's chairs, lamps, and the Director.
  const floor = d.room(19, 15, { floor: 'planks', wall: 'flats' });
  for (const [a, b] of [[4, -5], [4, 5], [14, -5], [14, 5]]) g.pillar(...floor.tile(a, b), 1.2, { prop: 'lamp' });
  g.block(...floor.rect(9, 1, -6, 1), 1.0, { prop: 'camera' });
  g.block(...floor.rect(9, 1, 6, 1), 1.0, { prop: 'camera' });
  g.pillar(...floor.tile(16, -6), 0.9, { prop: 'chair' });
  g.foe('director', ...floor.tile(11, 0), { range: 6 });
  g.foe('pa', ...floor.tile(16, 4), { range: 4 });
  g.pick(...floor.tile(2, 0), 10).pick(...floor.tile(7, -4), 10).pick(...floor.tile(7, 4), 10).pick(...floor.tile(12, -5), 10);
  g.tape(...floor.tile(2, -5)).tape(...floor.tile(2, 5));
  wash(g, floor, ['#fff4e0', '#ffd890'], { cans: 3, program: 'static' });
  g.light('spot', ...wallTile(floor, 9), { colors: ['#fff4e0'], radius: 3, aim: toBack(floor).map((v) => -5 * v), height: 2.4 });
  sign(floor, 4, 'ON AIR', '#ff4a3a', 0.45, 1.8);
  d.hall(3, { wall: 'flats' });
  d.exit(3);
  return g;
}
