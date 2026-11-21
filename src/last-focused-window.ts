import { WINDOW_TYPE, isMinimised, type BrowserWindow } from "./browser";
import type { Destination, DestinationRule, PopupContext } from "./destination";

interface WindowQuery {
  populate: boolean;
  windowTypes: (typeof WINDOW_TYPE.normal)[];
}

export interface WindowSource {
  getAll(query: WindowQuery): Promise<BrowserWindow[]>;
}

// Ask for each window's tabs too, which is where "last used" comes from.
const WITH_TABS = true;

// Index -1 is Chrome's "at the end".
const AT_THE_END = -1;

// The time given to a tab, or a window, that has never been used, which sorts
// before any real one.
const NEVER_USED = 0;

// When a window was last used: the most recent time any of its tabs was.
function lastUsed(window: BrowserWindow): number {
  return Math.max(
    NEVER_USED,
    ...(window.tabs ?? []).map((tab) => tab.lastAccessed ?? NEVER_USED),
  );
}

// The end of the ordinary window used most recently, skipping minimised ones
// and any on the other side of the incognito line, which Chrome will not let
// a tab cross.
export class LastFocusedWindow implements DestinationRule {
  constructor(private readonly windows: WindowSource) {}

  async pick({ incognito }: PopupContext): Promise<Destination | undefined> {
    const all = await this.windows.getAll({
      populate: WITH_TABS,
      windowTypes: [WINDOW_TYPE.normal],
    });
    const latest = all
      .filter(
        (window) => window.incognito === incognito && !isMinimised(window),
      )
      .reduce<BrowserWindow | undefined>(
        (best, window) =>
          best === undefined || lastUsed(window) > lastUsed(best)
            ? window
            : best,
        undefined,
      );
    return latest?.id === undefined
      ? undefined
      : { windowId: latest.id, index: AT_THE_END };
  }
}
