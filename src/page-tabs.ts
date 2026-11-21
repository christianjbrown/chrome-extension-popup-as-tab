import type { BrowserWindow } from "./browser";

// A popup's tab, and the tab that opened it.
export interface PageTab {
  id: number;
  openerTabId: number;
}

// Decides which popups qualify to become a tab, and finds the tab of one that
// does.
export interface PageTabs {
  find(popup: BrowserWindow): Promise<PageTab | undefined>;
}
