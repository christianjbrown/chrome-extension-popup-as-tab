import type { BrowserTab } from "./browser";
import type { PageTab } from "./page-tabs";
import type { PageTabRule } from "./page-tab-rule";

function hasOpener(tab: BrowserTab): tab is BrowserTab & PageTab {
  return tab.id !== undefined && tab.openerTabId !== undefined;
}

// Only popups a web page opened qualify, and Chrome says which those are:
// their tab has an opener. Popups an extension makes have none, and are left
// alone.
export class OpenedByPage implements PageTabRule {
  pageTabOf(tab: BrowserTab): PageTab | undefined {
    return hasOpener(tab)
      ? { id: tab.id, openerTabId: tab.openerTabId }
      : undefined;
  }
}
