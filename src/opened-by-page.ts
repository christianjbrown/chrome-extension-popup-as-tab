import { WINDOW_TYPE, type BrowserTab, type BrowserWindow } from "./browser";
import type { PageTab, PageTabs } from "./page-tabs";

export interface TabQuery {
  query(query: { windowId: number }): Promise<BrowserTab[]>;
}

// Only popups a web page opened qualify, and Chrome says which those are:
// their tab has an opener. Popups an extension makes have none, and are left
// alone.
export class OpenedByPage implements PageTabs {
  constructor(private readonly tabs: TabQuery) {}

  async find(popup: BrowserWindow): Promise<PageTab | undefined> {
    if (popup.type !== WINDOW_TYPE.popup || popup.id === undefined) {
      return undefined;
    }
    const [tab] = await this.tabs.query({ windowId: popup.id });
    if (tab?.id === undefined || tab.openerTabId === undefined) {
      return undefined;
    }
    return { id: tab.id, openerTabId: tab.openerTabId };
  }
}
