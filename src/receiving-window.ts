import type { BrowserWindow } from "./browser";

// Decides whether a popup's tab can go to a window.
export interface ReceivingWindow {
  accepts(window: BrowserWindow, incognito: boolean): boolean;
}
