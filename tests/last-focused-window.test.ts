import type { BrowserWindow } from "../src/browser";
import { LastFocusedWindow } from "../src/last-focused-window";

const used = (
  id: number,
  lastAccessed: number[],
  more: Partial<BrowserWindow> = {},
): BrowserWindow => ({
  id,
  type: "normal" as const,
  incognito: false,
  tabs: lastAccessed.map((time, index) => ({
    id: id * 10 + index,
    index,
    windowId: id,
    lastAccessed: time,
  })),
  ...more,
});

// Turns down window 2 only, and records what it was asked.
const receiving = () => ({
  accepts: vi.fn((window: BrowserWindow) => window.id !== 2),
});

function rule(windows: BrowserWindow[], window = receiving()) {
  const source = { getAll: vi.fn().mockResolvedValue(windows) };
  return { source, rule: new LastFocusedWindow(source, window) };
}

describe("LastFocusedWindow", () => {
  it("asks for every ordinary window with its tabs", async () => {
    const { source, rule: subject } = rule([]);

    await subject.pick({ incognito: false });

    expect(source.getAll).toHaveBeenCalledWith({
      populate: true,
      windowTypes: ["normal"],
    });
  });

  it("picks the end of the window whose tab was used last", async () => {
    const { rule: subject } = rule([
      used(1, [100, 300]),
      used(3, [500, 200]),
      used(4, [400]),
    ]);

    await expect(subject.pick({ incognito: false })).resolves.toEqual({
      windowId: 3,
      index: -1,
    });
  });

  it("skips windows that cannot take the tab", async () => {
    const window = receiving();
    const two = used(2, [900]);
    const { rule: subject } = rule([used(1, [100]), two], window);

    await expect(subject.pick({ incognito: true })).resolves.toEqual({
      windowId: 1,
      index: -1,
    });
    expect(window.accepts).toHaveBeenCalledWith(two, true);
  });

  it("copes with windows that report no tabs or no times", async () => {
    const { rule: subject } = rule([
      { id: 1, type: "normal", incognito: true },
      {
        id: 3,
        type: "normal",
        incognito: true,
        tabs: [{ index: 0, windowId: 3 }],
      },
    ]);

    await expect(subject.pick({ incognito: true })).resolves.toEqual({
      windowId: 1,
      index: -1,
    });
  });

  it.each([[[]], [[used(2, [100])]], [[{ incognito: false }]]])(
    "has no answer when there is nowhere to go",
    async (windows: BrowserWindow[]) => {
      const { rule: subject } = rule(windows);

      await expect(subject.pick({ incognito: false })).resolves.toBeUndefined();
    },
  );
});
