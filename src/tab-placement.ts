import type { Destination } from "./destination";

// Puts a tab at a destination and brings it to the front.
export interface TabPlacement {
  place(tabId: number, destination: Destination): Promise<void>;
}
