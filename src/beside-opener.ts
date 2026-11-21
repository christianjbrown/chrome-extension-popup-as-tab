import type { BrowserWindow, Opener } from "./browser";
import type { Destination, DestinationRule, PopupContext } from "./destination";
import type { ReceivingWindow } from "./receiving-window";

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
    return this.canTake(window, incognito)
      ? { windowId: window.id, index: opener.tab.index + 1 }
      : undefined;
  }

  // A window Chrome gave no id cannot be moved into.
  private canTake(
    window: BrowserWindow,
    incognito: boolean,
  ): window is BrowserWindow & { id: number } {
    return window.id !== undefined && this.receiving.accepts(window, incognito);
  }
}
