import { BesideOpener } from "../src/beside-opener";
import type { BrowserWindow } from "../src/browser";

const opener = (window: Partial<BrowserWindow>) => ({
  tab: { id: 10, index: 4, windowId: 1 },
  window: { id: 1, type: "normal" as const, incognito: false, ...window },
});

const receiving = (accepts: boolean) => ({
  accepts: vi.fn().mockReturnValue(accepts),
});

describe("BesideOpener", () => {
  it("puts the tab right after its opener", async () => {
    await expect(
      new BesideOpener(receiving(true)).pick({
        incognito: false,
        opener: opener({}),
      }),
    ).resolves.toEqual({ windowId: 1, index: 5 });
  });

  it("asks whether the opener's window can take the tab", async () => {
    const given = opener({});
    const window = receiving(false);

    await expect(
      new BesideOpener(window).pick({ incognito: true, opener: given }),
    ).resolves.toBeUndefined();
    expect(window.accepts).toHaveBeenCalledWith(given.window, true);
  });

  it.each([
    ["there is no opener", undefined],
    ["the opener's window has no id", opener({ id: undefined })],
  ])("has no answer when %s", async (_why, given) => {
    await expect(
      new BesideOpener(receiving(true)).pick({
        incognito: false,
        opener: given,
      }),
    ).resolves.toBeUndefined();
  });
});
