import type { Destination, DestinationRule, PopupContext } from "./destination";

// Right after the tab that opened the popup, as long as its window is still
// on screen. A minimised window would hide the tab the moment it arrived.
export class BesideOpener implements DestinationRule {
  pick({ incognito, opener }: PopupContext): Promise<Destination | undefined> {
    const window = opener?.window;
    if (
      opener === undefined ||
      window?.id === undefined ||
      window.state === "minimized" ||
      window.incognito !== incognito
    ) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve({
      windowId: window.id,
      index: opener.tab.index + 1,
    });
  }
}
