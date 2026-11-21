import type { BrowserWindow } from "./browser";
import type { PageTab, PageTabs } from "./page-tabs";
import type { PageTabRule } from "./page-tab-rule";
import type { PopupTabs } from "./popup-tabs";

// The popup's tab, as long as the rule says it qualifies.
export class QualifyingPageTabs implements PageTabs {
  constructor(
    private readonly popupTabs: PopupTabs,
    private readonly rule: PageTabRule,
  ) {}

  async find(popup: BrowserWindow): Promise<PageTab | undefined> {
    const tab = await this.popupTabs.firstTab(popup);
    return tab === undefined ? undefined : this.rule.pageTabOf(tab);
  }
}
