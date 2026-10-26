import alps from 'madness-engine/moods/alps';
import egypt from 'madness-engine/moods/egypt';
import london from 'madness-engine/moods/london';
import newyork from 'madness-engine/moods/newyork';
import paris from 'madness-engine/moods/paris';
import rio from 'madness-engine/moods/rio';
import spain from 'madness-engine/moods/spain';
import sydney from 'madness-engine/moods/sydney';
import tokyo from 'madness-engine/moods/tokyo';
import venice from 'madness-engine/moods/venice';

/**
 * Each stop's mood, in the order of the tour (`venues/index.js`): its
 * light, its sky and reflections, the film it is shot on, its weather and
 * its band. The moods are the engine's, made from the stops' looks.
 */
export const MOODS = [london, paris, venice, alps, spain, egypt, tokyo, rio, sydney, newyork];
