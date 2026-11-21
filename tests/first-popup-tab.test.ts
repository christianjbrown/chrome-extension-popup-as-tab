import type { BrowserTab, BrowserWindow } from "../src/browser";
import { FirstPopupTab } from "../src/first-popup-tab";

const popup: BrowserWindow = { id: 2, type: "popup", incognito: false };
const popupTab: BrowserTab = { id: 20, index: 0, windowId: 2, openerTabId: 10 };

function popupTabs(tabs: BrowserTab[] = [popupTab]) {
  const source = { query: vi.fn().mockResolvedValue(tabs) };
  return { source, subject: new FirstPopupTab(source) };
}

describe("FirstPopupTab", () => {
  it("finds the tab in a popup", async () => {
    const { source, subject } = popupTabs();

    await expect(subject.firstTab(popup)).resolves.toBe(popupTab);
    expect(source.query).toHaveBeenCalledWith({ windowId: 2 });
  });

  it.each([
    ["an ordinary window", { ...popup, type: "normal" as const }],
    ["a window with no id", { ...popup, id: undefined }],
  ])("passes over %s without looking", async (_what, window: BrowserWindow) => {
    const { source, subject } = popupTabs();

    await expect(subject.firstTab(window)).resolves.toBeUndefined();
    expect(source.query).not.toHaveBeenCalled();
  });

  it("finds nothing in a popup with no tab", async () => {
    await expect(
      popupTabs([]).subject.firstTab(popup),
    ).resolves.toBeUndefined();
  });
});
