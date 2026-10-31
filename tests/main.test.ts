// Drives the service worker's wiring through a fake chrome, end to end.
import type { BrowserWindow } from "../src/browser";

type Listener = (...args: unknown[]) => unknown;

const windows: Record<1 | 3, BrowserWindow> = {
  1: { id: 1, type: "normal", incognito: false },
  3: { id: 3, type: "normal", incognito: false },
};

function fakeChrome(opener: { index: number; windowId: number }) {
  const listeners: Listener[] = [];
  return {
    windows: {
      onCreated: {
        addListener: vi.fn((listener: Listener) => listeners.push(listener)),
        fire: (...args: unknown[]) => {
          listeners.forEach((listener) => listener(...args));
        },
      },
      get: vi.fn((id: 1 | 3) => Promise.resolve(windows[id])),
      getAll: vi.fn().mockResolvedValue([
        { ...windows[1], state: "minimized", tabs: [] },
        {
          ...windows[3],
          tabs: [{ id: 30, index: 0, windowId: 3, lastAccessed: 5 }],
        },
      ]),
      update: vi.fn().mockResolvedValue({}),
    },
    tabs: {
      query: vi
        .fn()
        .mockResolvedValue([
          { id: 20, index: 0, windowId: 2, openerTabId: 10 },
        ]),
      get: vi.fn().mockResolvedValue({ id: 10, ...opener }),
      move: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
    },
  };
}

async function load(opener = { index: 4, windowId: 1 }) {
  vi.resetModules();
  const chrome = fakeChrome(opener);
  vi.stubGlobal("chrome", chrome);
  await import("../src/main");
  return chrome;
}

const popup = { id: 2, type: "popup", incognito: false };

describe("service worker", () => {
  it("listens for popup windows only", async () => {
    const chrome = await load();

    expect(chrome.windows.onCreated.addListener).toHaveBeenCalledWith(
      expect.any(Function),
      { windowTypes: ["popup"] },
    );
  });

  it("turns a popup into a tab right after its opener, and focuses it", async () => {
    const chrome = await load();

    chrome.windows.onCreated.fire(popup);

    await vi.waitFor(() => {
      expect(chrome.windows.update).toHaveBeenCalledWith(1, { focused: true });
    });
    expect(chrome.tabs.move).toHaveBeenCalledWith(20, {
      windowId: 1,
      index: 5,
    });
    expect(chrome.tabs.update).toHaveBeenCalledWith(20, { active: true });
  });

  it("falls back to the last used window when the opener's is minimised", async () => {
    const chrome = await load();
    chrome.windows.get.mockResolvedValueOnce({
      ...windows[1],
      state: "minimized",
    });

    chrome.windows.onCreated.fire(popup);

    await vi.waitFor(() => {
      expect(chrome.windows.update).toHaveBeenCalledWith(3, { focused: true });
    });
    expect(chrome.tabs.move).toHaveBeenCalledWith(20, {
      windowId: 3,
      index: -1,
    });
  });
});
