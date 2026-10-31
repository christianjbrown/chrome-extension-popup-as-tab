import type { BrowserWindow } from "./browser";
import type { Destination, DestinationRule, PopupContext } from "./destination";

interface WindowQuery {
  populate: boolean;
  windowTypes: "normal"[];
}

export interface WindowSource {
  getAll(query: WindowQuery): Promise<BrowserWindow[]>;
}

// Index -1 is Chrome's "at the end".
const AT_THE_END = -1;

// When a window was last used: the most recent time any of its tabs was.
function lastUsed(window: BrowserWindow): number {
  return Math.max(
    0,
    ...(window.tabs ?? []).map((tab) => tab.lastAccessed ?? 0),
  );
}

// The end of the ordinary window used most recently, skipping minimised ones
// and any on the other side of the incognito line, which Chrome will not let
// a tab cross.
export class LastFocusedWindow implements DestinationRule {
  constructor(private readonly windows: WindowSource) {}

  async pick({ incognito }: PopupContext): Promise<Destination | undefined> {
    const all = await this.windows.getAll({
      populate: true,
      windowTypes: ["normal"],
    });
    const latest = all
      .filter(
        (window) =>
          window.incognito === incognito && window.state !== "minimized",
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
