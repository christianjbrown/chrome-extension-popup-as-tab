import type { DestinationRule } from "../src/destination";
import { FirstDestination } from "../src/destination";

const rule = (answer?: { windowId: number; index: number }) => ({
  pick: vi.fn<DestinationRule["pick"]>().mockResolvedValue(answer),
});

describe("FirstDestination", () => {
  it("takes the first rule that has an answer, and asks no further", async () => {
    const rules = [rule(), rule({ windowId: 2, index: 3 }), rule()];
    const context = { incognito: false };

    await expect(new FirstDestination(rules).pick(context)).resolves.toEqual({
      windowId: 2,
      index: 3,
    });
    expect(rules[0]!.pick).toHaveBeenCalledWith(context);
    expect(rules[2]!.pick).not.toHaveBeenCalled();
  });

  it("has no answer when no rule does", async () => {
    await expect(
      new FirstDestination([rule(), rule()]).pick({ incognito: false }),
    ).resolves.toBeUndefined();
  });
});
