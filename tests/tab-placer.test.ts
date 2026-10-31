import { TabPlacer } from "../src/tab-placer";

describe("TabPlacer", () => {
  it("moves the tab, makes it the active one and focuses its window, in that order", async () => {
    const calls: string[] = [];
    const record = (name: string) =>
      vi.fn((...args: unknown[]) => {
        calls.push(`${name} ${JSON.stringify(args)}`);
        return Promise.resolve();
      });
    const tabs = { move: record("move"), update: record("update") };
    const windows = { update: record("focus") };

    await new TabPlacer(tabs, windows).place(20, { windowId: 1, index: 3 });

    expect(calls).toEqual([
      'move [20,{"windowId":1,"index":3}]',
      'update [20,{"active":true}]',
      'focus [1,{"focused":true}]',
    ]);
  });
});
