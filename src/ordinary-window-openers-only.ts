import { WINDOW_TYPE } from "./browser";
import type { Destination, DestinationRule, PopupContext } from "./destination";

// Popups whose opener lives in an app window, DevTools or another popup get no
// destination and stay as they are. One whose opener has gone is still fair
// game, so the rule inside decides for it.
export class OrdinaryWindowOpenersOnly implements DestinationRule {
  constructor(private readonly inner: DestinationRule) {}

  pick(context: PopupContext): Promise<Destination | undefined> {
    const { opener } = context;
    if (opener !== undefined && opener.window.type !== WINDOW_TYPE.normal) {
      return Promise.resolve(undefined);
    }
    return this.inner.pick(context);
  }
}
