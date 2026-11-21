import type { BrowserWindow } from "./browser";
import type { DestinationRule } from "./destination";
import type { Openers } from "./opener-finder";
import type { PageTabs } from "./page-tabs";
import type { TabPlacement } from "./tab-placer";

// Turns a page's popup window into a tab in an ordinary window: finds the
// popup's tab, asks where it goes, and moves it there. Which popups qualify is
// up to the page tabs it is given.
export class PopupConverter {
  constructor(
    private readonly pageTabs: PageTabs,
    private readonly openers: Openers,
    private readonly destinations: DestinationRule,
    private readonly placer: TabPlacement,
  ) {}

  async convert(popup: BrowserWindow): Promise<void> {
    try {
      await this.tryConvert(popup);
    } catch {
      // Chrome can refuse a move, say while a tab is being dragged. The popup
      // then just stays a popup, which is what it was going to be anyway.
    }
  }

  private async tryConvert(popup: BrowserWindow): Promise<void> {
    const tab = await this.pageTabs.find(popup);
    if (tab === undefined) {
      return;
    }
    const opener = await this.openers.find(tab.openerTabId);
    const destination = await this.destinations.pick({
      incognito: popup.incognito,
      opener,
    });
    if (destination !== undefined) {
      await this.placer.place(tab.id, destination);
    }
  }
}
