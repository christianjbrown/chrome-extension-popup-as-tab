import type { BrowserTab, BrowserWindow, WINDOW_TYPE } from "./browser";
import type { Destination } from "./destination";

// The calls this extension makes on chrome.tabs and chrome.windows, each one
// on its own, so a class depends on only the call it makes.

export interface TabQuery {
  query(query: { windowId: number }): Promise<BrowserTab[]>;
}

export interface TabLookup {
  get(tabId: number): Promise<BrowserTab>;
}

export interface WindowLookup {
  get(windowId: number): Promise<BrowserWindow>;
}

interface WindowQuery {
  populate: boolean;
  windowTypes: (typeof WINDOW_TYPE.normal)[];
}

export interface WindowSource {
  getAll(query: WindowQuery): Promise<BrowserWindow[]>;
}

export interface TabMover {
  move(tabId: number, properties: Destination): Promise<unknown>;
}

export interface TabActivator {
  update(tabId: number, properties: { active: boolean }): Promise<unknown>;
}

export interface WindowFocuser {
  update(windowId: number, properties: { focused: boolean }): Promise<unknown>;
}
