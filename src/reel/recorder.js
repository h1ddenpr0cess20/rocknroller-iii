import '@fontsource/anton/400.css';
import '@fontsource/barlow-condensed/500.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/alfa-slab-one/400.css';

import { createAudio } from '../audio.js';
import { BOARD_DETAIL } from '../foes.js';
import { createGame } from '../game.js';
import { createHud } from '../hud.js';
import { CAST } from '../models/cast/index.js';
import { PROPS } from '../models/props/index.js';
import { preload, ready } from '../models/library.js';
import { createStage } from '../stage.js';
import { createStorage } from '../storage.js';
import { HOME } from '../view.js';
import { createPilot } from '../../test/helpers/autopilot.js';
import { createRecorder } from './core.js';

/**
 * Rock 'n' Roller III, for the reels (reel.html; the filming is core.js): the
 * game built as main.js builds it, with nobody's hands on it and the
 * autopilot at the wheel, rolling Rock through a stop on a phone.
 */

let stage = null;

createRecorder({
  async ready() {
    // Everything any set shows, baked before the clock goes virtual.
    preload();
    await Promise.all([
      ...Object.keys(PROPS).map((n) => ready(n, 1)),
      ...Object.keys(CAST).map((n) => ready(n, BOARD_DETAIL)),
    ]);
    await Promise.all(['400 20px Anton', '500 20px "Barlow Condensed"', '600 20px "Barlow Condensed"', '700 20px "Barlow Condensed"', '400 20px "Alfa Slab One"'].map((f) => document.fonts.load(f)));
  },

  createAudio,
  // Every frame, and the beat the light show dances to (the soundtrack's, as the music runs in the film).
  quiet: ['rolling', 'rev'],
  through: ['beat'],

  async build({ audio }) {
    const hud = createHud(document.body, { onStart() {} });
    hud.muted(false);
    const input = {
      stick: () => ({ x: 0, y: 0 }),
      view: () => ({ turn: 0, tilt: 0, zoom: 1 }),
      rev: () => false,
      take: () => [],
      get pointing() { return false; },
    };
    stage = await createStage(document.getElementById('view'));
    const game = createGame({ stage, hud, input, audio, storage: createStorage() });
    return { game, stage, GFX: stage.GFX };
  },

  start(game, level) {
    game.startVenue(level);
    // The camera from its corner every time, wherever the last set left it.
    Object.assign(stage.view.aim, HOME);
    stage.view.step(0, true);
  },
  pilot: (game) => createPilot(game.debug.gig),
  attach: (game, pilot) => { game.debug.pilot = pilot; },
  ball: (game) => game.debug.ball,
  name: (game) => game.debug.gig.venue.name,
  state: (game) => game.state,
  // Worth watching while Rock rolls; the stop's name, a fall and the review are not.
  phase: (game) => ({ play: 'live', clear: 'end', over: 'end' })[game.state] ?? 'wait',
  steering: (game) => game.state === 'play',
  // A thumb on REV while the autopilot charges a boss.
  button: { selector: '#rev-button', held: (game, move) => game.state === 'play' && Boolean(move?.rev) },

  // The score for the reel from `from` bars into the song, so it opens on the chorus and not a build.
  music: (audio, m) => audio.startMusic(
    { look: { theme: m.theme }, tempo: m.tempo },
    m.from ? { gig: { time: (m.from * 240) / m.tempo - 0.1201 } } : {},
  ),

  card: {
    logo: `<header class="logo">
        <p class="presents">Live on stage, all over the world</p>
        <h1 class="top">Rock <span class="amp">'n'</span> Roller <span class="two">III</span></h1>
        <h1 class="bottom">World Tour</h1>
        <p class="tag">a boulder goes abroad</p>
      </header>`,
    url: 'rocknroller-iii.vercel.app',
  },
  theme: {
    display: 'Anton, Impact, "Arial Narrow Bold", sans-serif',
    body: '"Barlow Condensed", "Arial Narrow", system-ui, sans-serif',
    accent: '#c8302a',
    'accent-dark': '#4a0f0c',
    'accent-2': '#ffb468',
    cool: '#f4ead2',
    dim: '#a8b0c4',
    'pill-top': '138px',
    'pill-size': '15px',
    'url-size': '27px',
    'cta-size': '20px',
  },
});
