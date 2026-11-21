// The parts of Chrome's tabs and windows this extension reads. Nothing here
// needs the "tabs" permission: no URL, no title, no favicon.
export interface BrowserTab {
  id?: number | undefined;
  index: number;
  windowId: number;
  openerTabId?: number | undefined;
  lastAccessed?: number | undefined;
}

// The window kinds and states the extension tells apart.
export const WINDOW_TYPE = { normal: "normal", popup: "popup" } as const;
export const WINDOW_STATE = { minimized: "minimized" } as const;

// Chrome has other kinds and states too; they only ever mean "something else".
export type WindowType =
  (typeof WINDOW_TYPE)[keyof typeof WINDOW_TYPE] | "panel" | "app" | "devtools";
type WindowState =
  | (typeof WINDOW_STATE)[keyof typeof WINDOW_STATE]
  | "normal"
  | "maximized"
  | "fullscreen"
  | "locked-fullscreen";

export interface BrowserWindow {
  id?: number | undefined;
  type?: WindowType | undefined;
  state?: WindowState | undefined;
  incognito: boolean;
  tabs?: BrowserTab[] | undefined;
}

// The tab a popup was opened from, and the window it sits in.
export interface Opener {
  tab: BrowserTab;
  window: BrowserWindow;
}
