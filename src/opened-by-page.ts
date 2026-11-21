import { WINDOW_TYPE, type BrowserTab, type BrowserWindow } from "./browser";
import type { TabQuery } from "./browser-apis";
import type { PageTab, PageTabs } from "./page-tabs";

// A window that is not a popup has no id here.
function popupIdOf(window: BrowserWindow): number | undefined {
  return window.type === WINDOW_TYPE.popup ? window.id : undefined;
}

function pageTabOf(tab: BrowserTab): PageTab | undefined {
  return hasOpener(tab)
    ? { id: tab.id, openerTabId: tab.openerTabId }
    : undefined;
}

function hasOpener(tab: BrowserTab): tab is BrowserTab & PageTab {
  return tab.id !== undefined && tab.openerTabId !== undefined;
}

// Only popups a web page opened qualify, and Chrome says which those are:
// their tab has an opener. Popups an extension makes have none, and are left
// alone.
export class OpenedByPage implements PageTabs {
  constructor(private readonly tabs: TabQuery) {}

  async find(popup: BrowserWindow): Promise<PageTab | undefined> {
    const windowId = popupIdOf(popup);
    return windowId === undefined ? undefined : this.firstTabIn(windowId);
  }

  private async firstTabIn(windowId: number): Promise<PageTab | undefined> {
    const [tab] = await this.tabs.query({ windowId });
    return tab === undefined ? undefined : pageTabOf(tab);
  }
}
