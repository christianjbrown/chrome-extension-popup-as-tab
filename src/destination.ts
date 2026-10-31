import type { Opener } from "./browser";

// Where a popup's tab goes: a window, and the place in its tab strip.
export interface Destination {
  windowId: number;
  index: number;
}

export interface PopupContext {
  incognito: boolean;
  opener?: Opener | undefined;
}

// One way of choosing a destination. A rule that has no answer returns
// undefined and leaves it to the next one.
export interface DestinationRule {
  pick(context: PopupContext): Promise<Destination | undefined>;
}

// Asks each rule in turn and takes the first answer.
export class FirstDestination implements DestinationRule {
  constructor(private readonly rules: DestinationRule[]) {}

  async pick(context: PopupContext): Promise<Destination | undefined> {
    for (const rule of this.rules) {
      const destination = await rule.pick(context);
      if (destination !== undefined) {
        return destination;
      }
    }
    return undefined;
  }
}
