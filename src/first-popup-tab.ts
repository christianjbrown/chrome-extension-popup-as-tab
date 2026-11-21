import { WINDOW_TYPE, type BrowserTab, type BrowserWindow } from "./browser";
import type { TabQuery } from "./browser-apis";
import type { PopupTabs } from "./popup-tabs";

// A window that is not a popup has no id here.
function popupIdOf(window: BrowserWindow): number | undefined {
  return window.type === WINDOW_TYPE.popup ? window.id : undefined;
}

// A popup holds one tab, which is the first Chrome lists in its window.
export class FirstPopupTab implements PopupTabs {
  constructor(private readonly tabs: TabQuery) {}

  async firstTab(popup: BrowserWindow): Promise<BrowserTab | undefined> {
    const windowId = popupIdOf(popup);
    return windowId === undefined ? undefined : this.firstTabIn(windowId);
  }

  private async firstTabIn(windowId: number): Promise<BrowserTab | undefined> {
    const [tab] = await this.tabs.query({ windowId });
    return tab;
  }
}
