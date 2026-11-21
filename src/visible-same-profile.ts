import { WINDOW_STATE, type BrowserWindow } from "./browser";
import type { ReceivingWindow } from "./receiving-window";

// The window has to be on screen, since a minimised one would hide the tab the
// moment it arrived, and on the same side of the incognito line, which Chrome
// will not let a tab cross.
export class VisibleSameProfile implements ReceivingWindow {
  accepts(window: BrowserWindow, incognito: boolean): boolean {
    return (
      window.state !== WINDOW_STATE.minimized && window.incognito === incognito
    );
  }
}
