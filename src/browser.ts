// The parts of Chrome's tabs and windows this extension reads. Nothing here
// needs the "tabs" permission: no URL, no title, no favicon.
export interface BrowserTab {
  id?: number | undefined;
  index: number;
  windowId: number;
  openerTabId?: number | undefined;
  lastAccessed?: number | undefined;
}

export interface BrowserWindow {
  id?: number | undefined;
  type?: string | undefined;
  state?: string | undefined;
  incognito: boolean;
  tabs?: BrowserTab[] | undefined;
}

// The tab a popup was opened from, and the window it sits in.
export interface Opener {
  tab: BrowserTab;
  window: BrowserWindow;
}
