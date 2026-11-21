import type { BrowserWindow } from "./browser";

// A popup's tab, and the tab that opened it.
export interface PageTab {
  id: number;
  openerTabId: number;
}

// Finds the tab of a popup that qualifies to become a tab.
export interface PageTabs {
  find(popup: BrowserWindow): Promise<PageTab | undefined>;
}
