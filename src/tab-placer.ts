import type { Destination } from "./destination";

export interface TabMover {
  move(tabId: number, properties: Destination): Promise<unknown>;
  update(tabId: number, properties: { active: boolean }): Promise<unknown>;
}

export interface WindowFocuser {
  update(windowId: number, properties: { focused: boolean }): Promise<unknown>;
}

export interface TabPlacement {
  place(tabId: number, destination: Destination): Promise<void>;
}

// Moves the tab across and brings it to the front. Chrome closes the popup
// window by itself once its only tab has gone.
export class TabPlacer implements TabPlacement {
  constructor(
    private readonly tabs: TabMover,
    private readonly windows: WindowFocuser,
  ) {}

  async place(tabId: number, destination: Destination): Promise<void> {
    await this.tabs.move(tabId, destination);
    await this.tabs.update(tabId, { active: true });
    await this.windows.update(destination.windowId, { focused: true });
  }
}
