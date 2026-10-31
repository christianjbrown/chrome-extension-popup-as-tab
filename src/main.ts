// The service worker: builds the object graph and connects it to Chrome's events.
import { BesideOpener } from "./beside-opener";
import { FirstDestination } from "./destination";
import { LastFocusedWindow } from "./last-focused-window";
import { OpenerFinder } from "./opener-finder";
import { PopupConverter } from "./popup-converter";
import { TabPlacer } from "./tab-placer";

const converter = new PopupConverter(
  chrome.tabs,
  new OpenerFinder(chrome.tabs, chrome.windows),
  new FirstDestination([
    new BesideOpener(),
    new LastFocusedWindow(chrome.windows),
  ]),
  new TabPlacer(chrome.tabs, chrome.windows),
);

// Only popups. Ordinary windows, app windows and DevTools never get here.
chrome.windows.onCreated.addListener(
  (window) => {
    void converter.convert(window);
  },
  { windowTypes: ["popup"] },
);
