import type { BrowserTab } from "../src/browser";
import { OpenedByPage } from "../src/opened-by-page";

const popupTab: BrowserTab = { id: 20, index: 0, windowId: 2, openerTabId: 10 };

describe("OpenedByPage", () => {
  it("takes the tab of a popup a page opened, and the tab that opened it", () => {
    expect(new OpenedByPage().pageTabOf(popupTab)).toEqual({
      id: 20,
      openerTabId: 10,
    });
  });

  it.each([
    ["has no id", { ...popupTab, id: undefined }],
    [
      "an extension opened, with no opener",
      { ...popupTab, openerTabId: undefined },
    ],
  ])("passes over a tab that %s", (_what, tab: BrowserTab) => {
    expect(new OpenedByPage().pageTabOf(tab)).toBeUndefined();
  });
});
