import type { BrowserWindow, Opener } from "./browser";
import type { Destination, DestinationRule, PopupContext } from "./destination";
import type { ReceivingWindow } from "./receiving-window";

// A window Chrome gave an id, which is the only kind a tab can be moved into.
type NumberedWindow = BrowserWindow & { id: number };

function hasId(window: BrowserWindow): window is NumberedWindow {
  return window.id !== undefined;
}

// Right after the tab that opened the popup, as long as its window is still
// one the tab can go to.
export class BesideOpener implements DestinationRule {
  constructor(private readonly receiving: ReceivingWindow) {}

  pick({ incognito, opener }: PopupContext): Promise<Destination | undefined> {
    return Promise.resolve(
      opener === undefined ? undefined : this.beside(opener, incognito),
    );
  }

  private beside(opener: Opener, incognito: boolean): Destination | undefined {
    const { window } = opener;
    return hasId(window) ? this.besideIn(window, opener, incognito) : undefined;
  }

  private besideIn(
    window: NumberedWindow,
    opener: Opener,
    incognito: boolean,
  ): Destination | undefined {
    return this.receiving.accepts(window, incognito)
      ? { windowId: window.id, index: opener.tab.index + 1 }
      : undefined;
  }
}
