import type { BrowserWindow } from "./browser";
import type { DestinationRule } from "./destination";
import type { Openers } from "./openers";
import type { PageTab, PageTabs } from "./page-tabs";
import type { TabPlacement } from "./tab-placement";

// Turns a page's popup window into a tab in an ordinary window: finds the
// popup's tab, asks where it goes, and moves it there. Which popups qualify is
// up to the page tabs it is given.
export class PopupConverter {
  constructor(
    private readonly pageTabs: PageTabs,
    private readonly openers: Openers,
    private readonly destinations: DestinationRule,
    private readonly placer: TabPlacement,
  ) {}

  async convert(popup: BrowserWindow): Promise<void> {
    const tab = await this.pageTabs.find(popup);
    if (tab !== undefined) {
      await this.move(tab, popup.incognito);
    }
  }

  // A tab no rule has a destination for stays where it is.
  private async move(tab: PageTab, incognito: boolean): Promise<void> {
    const opener = await this.openers.find(tab.openerTabId);
    const destination = await this.destinations.pick({ incognito, opener });
    if (destination !== undefined) {
      await this.placer.place(tab.id, destination);
    }
  }
}
