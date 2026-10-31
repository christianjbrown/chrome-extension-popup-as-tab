import { OpenerFinder } from "../src/opener-finder";

const tab = { id: 10, index: 2, windowId: 1 };
const window = { id: 1, type: "normal", incognito: false };

describe("OpenerFinder", () => {
  it("returns the opener tab and its window", async () => {
    const tabs = { get: vi.fn().mockResolvedValue(tab) };
    const windows = { get: vi.fn().mockResolvedValue(window) };

    await expect(new OpenerFinder(tabs, windows).find(10)).resolves.toEqual({
      tab,
      window,
    });
    expect(tabs.get).toHaveBeenCalledWith(10);
    expect(windows.get).toHaveBeenCalledWith(1);
  });

  it("has no opener once the tab has closed", async () => {
    const tabs = { get: vi.fn().mockRejectedValue(new Error("No tab")) };
    const windows = { get: vi.fn() };

    await expect(
      new OpenerFinder(tabs, windows).find(10),
    ).resolves.toBeUndefined();
    expect(windows.get).not.toHaveBeenCalled();
  });

  it("has no opener once its window has closed", async () => {
    const tabs = { get: vi.fn().mockResolvedValue(tab) };
    const windows = { get: vi.fn().mockRejectedValue(new Error("No window")) };

    await expect(
      new OpenerFinder(tabs, windows).find(10),
    ).resolves.toBeUndefined();
  });
});
