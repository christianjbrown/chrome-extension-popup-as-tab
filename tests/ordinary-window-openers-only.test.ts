import type { Opener, WindowType } from "../src/browser";
import type { Destination, DestinationRule } from "../src/destination";
import { OrdinaryWindowOpenersOnly } from "../src/ordinary-window-openers-only";

const here: Destination = { windowId: 1, index: 1 };
const inWindow = (type: WindowType): Opener => ({
  tab: { id: 10, index: 0, windowId: 1 },
  window: { id: 1, type, incognito: false },
});

function subject() {
  const inner = {
    pick: vi.fn<DestinationRule["pick"]>().mockResolvedValue(here),
  };
  return { inner, rule: new OrdinaryWindowOpenersOnly(inner) };
}

describe("OrdinaryWindowOpenersOnly", () => {
  it("leaves the choice to the rule inside for an opener in an ordinary window", async () => {
    const { inner, rule } = subject();
    const context = { incognito: false, opener: inWindow("normal") };

    await expect(rule.pick(context)).resolves.toBe(here);
    expect(inner.pick).toHaveBeenCalledWith(context);
  });

  it("leaves the choice to the rule inside when the opener has gone", async () => {
    const { rule } = subject();

    await expect(rule.pick({ incognito: false })).resolves.toBe(here);
  });

  it.each(["app", "popup", "devtools"] as const)(
    "gives no destination for an opener in a %s window",
    async (type) => {
      const { inner, rule } = subject();

      await expect(
        rule.pick({ incognito: false, opener: inWindow(type) }),
      ).resolves.toBeUndefined();
      expect(inner.pick).not.toHaveBeenCalled();
    },
  );
});
