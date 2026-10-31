import type { BrowserWindow } from "../src/browser";
import { LastFocusedWindow } from "../src/last-focused-window";

const used = (
  id: number,
  lastAccessed: number[],
  more: Partial<BrowserWindow> = {},
) => ({
  id,
  type: "normal",
  incognito: false,
  tabs: lastAccessed.map((time, index) => ({
    id: id * 10 + index,
    index,
    windowId: id,
    lastAccessed: time,
  })),
  ...more,
});

function rule(windows: BrowserWindow[]) {
  const source = { getAll: vi.fn().mockResolvedValue(windows) };
  return { source, rule: new LastFocusedWindow(source) };
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
      used(2, [500, 200]),
      used(3, [400]),
    ]);

    await expect(subject.pick({ incognito: false })).resolves.toEqual({
      windowId: 2,
      index: -1,
    });
  });

  it("skips minimised windows and the other side of incognito", async () => {
    const { rule: subject } = rule([
      used(1, [100]),
      used(2, [500], { state: "minimized" }),
      used(3, [900], { incognito: true }),
    ]);

    await expect(subject.pick({ incognito: false })).resolves.toEqual({
      windowId: 1,
      index: -1,
    });
  });

  it("copes with windows that report no tabs or no times", async () => {
    const { rule: subject } = rule([
      { id: 1, type: "normal", incognito: true },
      {
        id: 2,
        type: "normal",
        incognito: true,
        tabs: [{ index: 0, windowId: 2 }],
      },
    ]);

    await expect(subject.pick({ incognito: true })).resolves.toEqual({
      windowId: 1,
      index: -1,
    });
  });

  it.each([
    [[]],
    [[used(1, [100], { state: "minimized" })]],
    [[{ incognito: false }]],
  ])(
    "has no answer when there is nowhere to go",
    async (windows: BrowserWindow[]) => {
      const { rule: subject } = rule(windows);

      await expect(subject.pick({ incognito: false })).resolves.toBeUndefined();
    },
  );
});
