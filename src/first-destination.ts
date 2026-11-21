import type { Destination, DestinationRule, PopupContext } from "./destination";

// Asks each rule in turn and takes the first answer.
export class FirstDestination implements DestinationRule {
  constructor(private readonly rules: DestinationRule[]) {}

  async pick(context: PopupContext): Promise<Destination | undefined> {
    for (const rule of this.rules) {
      const destination = await rule.pick(context);
      if (destination !== undefined) {
        return destination;
      }
    }
    return undefined;
  }
}
