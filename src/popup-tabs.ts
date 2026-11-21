import type { BrowserTab, BrowserWindow } from "./browser";

// Finds the tab a popup window holds.
export interface PopupTabs {
  firstTab(popup: BrowserWindow): Promise<BrowserTab | undefined>;
}
