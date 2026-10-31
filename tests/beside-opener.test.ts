import { BesideOpener } from "../src/beside-opener";
import type { BrowserWindow } from "../src/browser";

const opener = (window: Partial<BrowserWindow>) => ({
  tab: { id: 10, index: 4, windowId: 1 },
  window: { id: 1, type: "normal", incognito: false, ...window },
});

describe("BesideOpener", () => {
  it("puts the tab right after its opener", async () => {
    await expect(
      new BesideOpener().pick({ incognito: false, opener: opener({}) }),
    ).resolves.toEqual({ windowId: 1, index: 5 });
  });

  it.each([
    ["there is no opener", undefined],
    ["the opener's window is minimised", opener({ state: "minimized" })],
    [
      "the opener's window is on the other side of incognito",
      opener({ incognito: true }),
    ],
    ["the opener's window has no id", opener({ id: undefined })],
  ])("has no answer when %s", async (_why, given) => {
    await expect(
      new BesideOpener().pick({ incognito: false, opener: given }),
    ).resolves.toBeUndefined();
  });
});
