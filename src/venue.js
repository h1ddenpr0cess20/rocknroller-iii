import { Venue as Base } from 'madness-engine/venue/venue';

export * from 'madness-engine/venue/venue';

/** The tour's venue: the engine's, with this game's names for what lies about in it. */
export class Venue extends Base {
  /** A pile of guitar picks, to roll over: they are the hype. */
  pick(x, z, amount = 10) {
    return this.pickup('pick', x, z, amount);
  }

  /** A suitcase, sprung open on a heap of picks. */
  suitcase(x, z, amount = 60) {
    return this.pickup('suitcase', x, z, amount);
  }

  /** A roll of gaffer tape: holds Rock together. */
  tape(x, z, amount = 25) {
    return this.pickup('tape', x, z, amount);
  }

  /** A lighter, held up: when Rock is done for, the crowd calls for an encore and he gets up. */
  lighter(x, z) {
    return this.pickup('lighter', x, z, 1);
  }

  /** A passport, for the border gates and the stage door. */
  pass(x, z) {
    return this.pickup('pass', x, z, 1);
  }

  /** A snow globe, a souvenir: three are hidden at every stop. */
  globe(x, z) {
    return this.pickup('globe', x, z, 100);
  }
}
