import type { BrowserTab, BrowserWindow, Opener } from "./browser";

export interface TabLookup {
  get(tabId: number): Promise<BrowserTab>;
}

export interface WindowLookup {
  get(windowId: number): Promise<BrowserWindow>;
}

export interface Openers {
  find(tabId: number): Promise<Opener | undefined>;
}

// Looks up the tab that opened a popup. Chrome rejects the lookup when that
// tab, or its window, has closed since, and then there is no opener to go by.
export class OpenerFinder implements Openers {
  constructor(
    private readonly tabs: TabLookup,
    private readonly windows: WindowLookup,
  ) {}

  async find(tabId: number): Promise<Opener | undefined> {
    try {
      const tab = await this.tabs.get(tabId);
      const window = await this.windows.get(tab.windowId);
      return { tab, window };
    } catch {
      return undefined;
    }
  }
}
