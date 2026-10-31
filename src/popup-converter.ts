import type { BrowserTab, BrowserWindow } from "./browser";
import type { DestinationRule } from "./destination";
import type { Openers } from "./opener-finder";
import type { TabPlacement } from "./tab-placer";

export interface TabQuery {
  query(query: { windowId: number }): Promise<BrowserTab[]>;
}

interface PageTab {
  id: number;
  openerTabId: number;
}

// Turns a page's popup window into a tab in an ordinary window.
//
// Only popups a web page opened are touched, and Chrome says which those are:
// their tab has an opener. Popups an extension makes have none, and are left
// alone, as are popups whose opener lives in an app window, DevTools or
// another popup.
export class PopupConverter {
  constructor(
    private readonly tabs: TabQuery,
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
    const tab = await this.pageTab(popup);
    if (tab === undefined) {
      return;
    }
    const opener = await this.openers.find(tab.openerTabId);
    if (opener !== undefined && opener.window.type !== "normal") {
      return;
    }
    const destination = await this.destinations.pick({
      incognito: popup.incognito,
      opener,
    });
    if (destination !== undefined) {
      await this.placer.place(tab.id, destination);
    }
  }

  // The popup's tab, if a page opened it.
  private async pageTab(popup: BrowserWindow): Promise<PageTab | undefined> {
    if (popup.type !== "popup" || popup.id === undefined) {
      return undefined;
    }
    const [tab] = await this.tabs.query({ windowId: popup.id });
    if (tab?.id === undefined || tab.openerTabId === undefined) {
      return undefined;
    }
    return { id: tab.id, openerTabId: tab.openerTabId };
  }
}
