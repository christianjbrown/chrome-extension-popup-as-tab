import type { BrowserWindow, Opener } from "../src/browser";
import type { Destination, DestinationRule } from "../src/destination";
import type { PageTab } from "../src/page-tabs";
import { PopupConverter } from "../src/popup-converter";

const popup: BrowserWindow = { id: 2, type: "popup", incognito: false };
const pageTab: PageTab = { id: 20, openerTabId: 10 };
const opener: Opener = {
  tab: { id: 10, index: 0, windowId: 1 },
  window: { id: 1, type: "normal", incognito: false },
};
const here: Destination = { windowId: 1, index: 1 };

interface Given {
  tab?: PageTab | undefined;
  found?: Opener | undefined;
  destination?: Destination | undefined;
}

function converter(given: Given = {}) {
  const tab = "tab" in given ? given.tab : pageTab;
  const found = "found" in given ? given.found : opener;
  const destination = "destination" in given ? given.destination : here;
  const pageTabs = { find: vi.fn().mockResolvedValue(tab) };
  const openers = { find: vi.fn().mockResolvedValue(found) };
  const destinations = {
    pick: vi.fn<DestinationRule["pick"]>().mockResolvedValue(destination),
  };
  const placer = { place: vi.fn().mockResolvedValue(undefined) };
  return {
    pageTabs,
    openers,
    destinations,
    placer,
    converter: new PopupConverter(pageTabs, openers, destinations, placer),
  };
}

describe("PopupConverter", () => {
  it("moves the popup's tab to where the rules say", async () => {
    const {
      pageTabs,
      openers,
      destinations,
      placer,
      converter: subject,
    } = converter();

    await subject.convert(popup);

    expect(pageTabs.find).toHaveBeenCalledWith(popup);
    expect(openers.find).toHaveBeenCalledWith(10);
    expect(destinations.pick).toHaveBeenCalledWith({
      incognito: false,
      opener,
    });
    expect(placer.place).toHaveBeenCalledWith(20, here);
  });

  it("still finds a place when the opener has gone", async () => {
    const {
      destinations,
      placer,
      converter: subject,
    } = converter({
      found: undefined,
    });

    await subject.convert({ ...popup, incognito: true });

    expect(destinations.pick).toHaveBeenCalledWith({
      incognito: true,
      opener: undefined,
    });
    expect(placer.place).toHaveBeenCalledWith(20, here);
  });

  it("leaves a popup alone that does not qualify", async () => {
    const {
      openers,
      placer,
      converter: subject,
    } = converter({ tab: undefined });

    await subject.convert(popup);

    expect(openers.find).not.toHaveBeenCalled();
    expect(placer.place).not.toHaveBeenCalled();
  });

  it("leaves the popup alone when there is nowhere to put it", async () => {
    const { placer, converter: subject } = converter({
      destination: undefined,
    });

    await subject.convert(popup);

    expect(placer.place).not.toHaveBeenCalled();
  });

  it("leaves the popup as it is when Chrome refuses the move", async () => {
    const { placer, converter: subject } = converter();
    placer.place.mockRejectedValueOnce(new Error("Tabs cannot be edited"));

    await expect(subject.convert(popup)).resolves.toBeUndefined();
  });
});
