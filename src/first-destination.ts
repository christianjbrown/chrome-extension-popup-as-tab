import type { Destination, DestinationRule, PopupContext } from "./destination";

// Asks each rule in turn and takes the first answer.
export class FirstDestination implements DestinationRule {
  constructor(private readonly rules: DestinationRule[]) {}

  // Once a rule has answered, the ones after it are not asked.
  pick(context: PopupContext): Promise<Destination | undefined> {
    return this.rules.reduce<Promise<Destination | undefined>>(
      (earlier, rule) => earlier.then((found) => found ?? rule.pick(context)),
      Promise.resolve(undefined),
    );
  }
}
