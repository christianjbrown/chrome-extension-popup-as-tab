import type { BrowserTab, BrowserWindow, Opener } from "../src/browser";
import type { Destination, DestinationRule } from "../src/destination";
import { PopupConverter } from "../src/popup-converter";

const popup: BrowserWindow = { id: 2, type: "popup", incognito: false };
const popupTab: BrowserTab = { id: 20, index: 0, windowId: 2, openerTabId: 10 };
const opener: Opener = {
  tab: { id: 10, index: 0, windowId: 1 },
  window: { id: 1, type: "normal", incognito: false },
};
const here: Destination = { windowId: 1, index: 1 };

interface Given {
  tabs?: BrowserTab[];
  found?: Opener | undefined;
  destination?: Destination | undefined;
}

function converter(given: Given = {}) {
  const { tabs = [popupTab] } = given;
  const found = "found" in given ? given.found : opener;
  const destination = "destination" in given ? given.destination : here;
  const source = { query: vi.fn().mockResolvedValue(tabs) };
  const openers = { find: vi.fn().mockResolvedValue(found) };
  const destinations = {
    pick: vi.fn<DestinationRule["pick"]>().mockResolvedValue(destination),
  };
  const placer = { place: vi.fn().mockResolvedValue(undefined) };
  return {
    source,
    openers,
    destinations,
    placer,
    converter: new PopupConverter(source, openers, destinations, placer),
  };
}

describe("PopupConverter", () => {
  it("moves the popup's tab to where the rules say", async () => {
    const {
      source,
      openers,
      destinations,
      placer,
      converter: subject,
    } = converter();

    await subject.convert(popup);

    expect(source.query).toHaveBeenCalledWith({ windowId: 2 });
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

  it.each([
    ["an ordinary window", { ...popup, type: "normal" }],
    ["a window with no id", { ...popup, id: undefined }],
  ])("leaves %s alone", async (_what, window: BrowserWindow) => {
    const { source, converter: subject } = converter();

    await subject.convert(window);

    expect(source.query).not.toHaveBeenCalled();
  });

  it.each([
    ["has no tab", []],
    ["has a tab with no id", [{ ...popupTab, id: undefined }]],
    [
      "an extension opened, with no opener",
      [{ ...popupTab, openerTabId: undefined }],
    ],
  ])("leaves a popup alone that %s", async (_what, tabs: BrowserTab[]) => {
    const { openers, placer, converter: subject } = converter({ tabs });

    await subject.convert(popup);

    expect(openers.find).not.toHaveBeenCalled();
    expect(placer.place).not.toHaveBeenCalled();
  });

  it.each(["app", "popup", "devtools"])(
    "leaves a popup alone whose opener is in a %s window",
    async (type) => {
      const { destinations, converter: subject } = converter({
        found: { ...opener, window: { ...opener.window, type } },
      });

      await subject.convert(popup);

      expect(destinations.pick).not.toHaveBeenCalled();
    },
  );

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
