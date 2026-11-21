import type { Destination, DestinationRule, PopupContext } from "./destination";
import type { ReceivingWindow } from "./receiving-window";

// Right after the tab that opened the popup, as long as its window is still
// one the tab can go to.
export class BesideOpener implements DestinationRule {
  constructor(private readonly receiving: ReceivingWindow) {}

  pick({ incognito, opener }: PopupContext): Promise<Destination | undefined> {
    const window = opener?.window;
    if (
      opener === undefined ||
      window?.id === undefined ||
      !this.receiving.accepts(window, incognito)
    ) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve({
      windowId: window.id,
      index: opener.tab.index + 1,
    });
  }
}
