import type { BrowserWindow } from "../src/browser";
import { VisibleSameProfile } from "../src/visible-same-profile";

const window: BrowserWindow = { id: 1, type: "normal", incognito: false };
const subject = new VisibleSameProfile();

describe("VisibleSameProfile", () => {
  it("accepts a window on screen, on the same side of incognito", () => {
    expect(subject.accepts(window, false)).toBe(true);
    expect(subject.accepts({ ...window, incognito: true }, true)).toBe(true);
  });

  it.each([
    ["is minimised", { ...window, state: "minimized" as const }, false],
    ["is on the other side of incognito", window, true],
  ])(
    "turns down a window that %s",
    (_what, candidate: BrowserWindow, incognito: boolean) => {
      expect(subject.accepts(candidate, incognito)).toBe(false);
    },
  );
});
