import type { Opener } from "./browser";

// Finds the tab that opened a popup, and its window, if they are still there.
export interface Openers {
  find(tabId: number): Promise<Opener | undefined>;
}
