import type { TabActivator, TabMover, WindowFocuser } from "./browser-apis";
import type { Destination } from "./destination";
import type { TabPlacement } from "./tab-placement";

// Moves the tab across and brings it to the front. Chrome closes the popup
// window by itself once its only tab has gone.
//
// Chrome can refuse a move, say while a tab is being dragged. The popup then
// just stays a popup, which is what it was going to be anyway, so a refused
// move is not an error. Anything else that goes wrong is.
export class TabPlacer implements TabPlacement {
  constructor(
    private readonly mover: TabMover,
    private readonly activator: TabActivator,
    private readonly windows: WindowFocuser,
  ) {}

  async place(tabId: number, destination: Destination): Promise<void> {
    if (!(await this.moved(tabId, destination))) {
      return;
    }
    await this.activator.update(tabId, { active: true });
    await this.windows.update(destination.windowId, { focused: true });
  }

  private async moved(
    tabId: number,
    destination: Destination,
  ): Promise<boolean> {
    try {
      await this.mover.move(tabId, destination);
      return true;
    } catch {
      return false;
    }
  }
}
