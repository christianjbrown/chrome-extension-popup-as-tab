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
