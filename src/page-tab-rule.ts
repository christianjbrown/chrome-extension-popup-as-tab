import type { BrowserTab } from "./browser";
import type { PageTab } from "./page-tabs";

// Decides whether a popup's tab qualifies to become a tab, and if so which tab
// opened it.
export interface PageTabRule {
  pageTabOf(tab: BrowserTab): PageTab | undefined;
}
