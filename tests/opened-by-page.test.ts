import type { BrowserTab, BrowserWindow } from "../src/browser";
import { OpenedByPage } from "../src/opened-by-page";

const popup: BrowserWindow = { id: 2, type: "popup", incognito: false };
const popupTab: BrowserTab = { id: 20, index: 0, windowId: 2, openerTabId: 10 };

function pageTabs(tabs: BrowserTab[] = [popupTab]) {
  const source = { query: vi.fn().mockResolvedValue(tabs) };
  return { source, subject: new OpenedByPage(source) };
}

describe("OpenedByPage", () => {
  it("finds the tab of a popup a page opened, and the tab that opened it", async () => {
    const { source, subject } = pageTabs();

    await expect(subject.find(popup)).resolves.toEqual({
      id: 20,
      openerTabId: 10,
    });
    expect(source.query).toHaveBeenCalledWith({ windowId: 2 });
  });

  it.each([
    ["an ordinary window", { ...popup, type: "normal" as const }],
    ["a window with no id", { ...popup, id: undefined }],
  ])("passes over %s without looking", async (_what, window: BrowserWindow) => {
    const { source, subject } = pageTabs();

    await expect(subject.find(window)).resolves.toBeUndefined();
    expect(source.query).not.toHaveBeenCalled();
  });

  it.each([
    ["has no tab", []],
    ["has a tab with no id", [{ ...popupTab, id: undefined }]],
    [
      "an extension opened, with no opener",
      [{ ...popupTab, openerTabId: undefined }],
    ],
  ])("passes over a popup that %s", async (_what, tabs: BrowserTab[]) => {
    await expect(pageTabs(tabs).subject.find(popup)).resolves.toBeUndefined();
  });
});
