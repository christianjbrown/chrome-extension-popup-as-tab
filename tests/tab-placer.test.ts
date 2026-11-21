import { TabPlacer } from "../src/tab-placer";

describe("TabPlacer", () => {
  it("moves the tab, makes it the active one and focuses its window, in that order", async () => {
    const calls: string[] = [];
    const record = (name: string) =>
      vi.fn((...args: unknown[]) => {
        calls.push(`${name} ${JSON.stringify(args)}`);
        return Promise.resolve();
      });
    const tabs = { move: record("move") };
    const activator = { update: record("update") };
    const windows = { update: record("focus") };

    await new TabPlacer(tabs, activator, windows).place(20, {
      windowId: 1,
      index: 3,
    });

    expect(calls).toEqual([
      'move [20,{"windowId":1,"index":3}]',
      'update [20,{"active":true}]',
      'focus [1,{"focused":true}]',
    ]);
  });

  it("leaves the tab where it is when Chrome refuses the move", async () => {
    const tabs = {
      move: vi.fn().mockRejectedValue(new Error("Tabs cannot be edited")),
    };
    const activator = { update: vi.fn() };
    const windows = { update: vi.fn() };

    await expect(
      new TabPlacer(tabs, activator, windows).place(20, {
        windowId: 1,
        index: 3,
      }),
    ).resolves.toBeUndefined();
    expect(activator.update).not.toHaveBeenCalled();
    expect(windows.update).not.toHaveBeenCalled();
  });

  it("lets any other failure surface", async () => {
    const failure = new Error("No tab with id: 20");
    const tabs = { move: vi.fn().mockResolvedValue({}) };
    const activator = { update: vi.fn().mockRejectedValue(failure) };
    const windows = { update: vi.fn() };

    await expect(
      new TabPlacer(tabs, activator, windows).place(20, {
        windowId: 1,
        index: 3,
      }),
    ).rejects.toBe(failure);
  });
});
