import { WINDOW_TYPE, type BrowserWindow } from "./browser";
import type { Destination, DestinationRule, PopupContext } from "./destination";
import type { ReceivingWindow } from "./receiving-window";

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

// The end of the ordinary window used most recently, skipping any the tab
// cannot go to.
export class LastFocusedWindow implements DestinationRule {
  constructor(
    private readonly windows: WindowSource,
    private readonly receiving: ReceivingWindow,
  ) {}

  async pick({ incognito }: PopupContext): Promise<Destination | undefined> {
    const all = await this.windows.getAll({
      populate: WITH_TABS,
      windowTypes: [WINDOW_TYPE.normal],
    });
    const latest = all
      .filter((window) => this.receiving.accepts(window, incognito))
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
