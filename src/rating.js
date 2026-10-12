/**
 * How a scene went, in stars. Three, and each is its own thing to go for:
 *
 *   ★  Hit your mark: get to the end of the scene.
 *   ★  Scene-stealer: smash at least three in four of the people in the way.
 *   ★  In the can: find all three golden reels.
 */

export const SMASH_SHARE = 0.75;
export const REELS = 3;

/** The goals, and whether `result` ({ smashed, foes, reels }) met each. */
export function goals({ smashed = 0, foes = 0, reels = 0 }) {
  return [
    { id: 'mark', title: 'Hit your mark', text: 'Get to the end of the scene.', met: true },
    { id: 'steal', title: 'Scene-stealer', text: `Smash ${Math.ceil(foes * SMASH_SHARE)} of the ${foes} people in the way.`, met: foes === 0 || smashed >= Math.ceil(foes * SMASH_SHARE), progress: [Math.min(smashed, foes), foes] },
    { id: 'reels', title: 'In the can', text: 'Find all three golden reels.', met: reels >= REELS, progress: [Math.min(reels, REELS), REELS] },
  ];
}

/** Stars for a wrapped scene: 1 to 3. */
export const stars = (result) => goals(result).filter((g) => g.met).length;
