import type { BrowserTab, BrowserWindow } from "../src/browser";
import { QualifyingPageTabs } from "../src/qualifying-page-tabs";

const popup: BrowserWindow = { id: 2, type: "popup", incognito: false };
const popupTab: BrowserTab = { id: 20, index: 0, windowId: 2, openerTabId: 10 };

function pageTabs(tab: BrowserTab | undefined) {
  const popupTabs = { firstTab: vi.fn().mockResolvedValue(tab) };
  const rule = { pageTabOf: vi.fn(() => ({ id: 20, openerTabId: 10 })) };
  return { popupTabs, rule, subject: new QualifyingPageTabs(popupTabs, rule) };
}

describe("QualifyingPageTabs", () => {
  it("asks the rule about the popup's tab", async () => {
    const { popupTabs, rule, subject } = pageTabs(popupTab);

    await expect(subject.find(popup)).resolves.toEqual({
      id: 20,
      openerTabId: 10,
    });
    expect(popupTabs.firstTab).toHaveBeenCalledWith(popup);
    expect(rule.pageTabOf).toHaveBeenCalledWith(popupTab);
  });

  it("finds nothing, without asking the rule, when the popup has no tab", async () => {
    const { rule, subject } = pageTabs(undefined);

    await expect(subject.find(popup)).resolves.toBeUndefined();
    expect(rule.pageTabOf).not.toHaveBeenCalled();
  });
});
