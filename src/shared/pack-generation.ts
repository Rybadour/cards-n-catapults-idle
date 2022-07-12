import { Pack } from "./types";

export function generateFromPack<T>(pack: Pack<T>): T[] {
  const things: T[] = [];

  for (let i = 0; i < pack.quantity; ++i) {
    const r = Math.random();
    let lastChance = 0;
    for (let i = 0; i < pack.possibleThings.length; ++i) {
      const choice = pack.possibleThings[i];
      if (lastChance < r && r < (lastChance + choice.chance)) {
        things.push(choice.thing);
        break;
      }

      if (i == pack.possibleThings.length-1) {
        things.push(choice.thing);
      }

      lastChance += choice.chance;
    }
  }

  return things;
}

export function debugLogPackChance<T>(packTypeName: string, pack: Pack<T>) {
  let totalChance = 0;
  pack.possibleThings.forEach(upgrade => {
    totalChance += upgrade.chance;
  });
  if (totalChance < 0.98 || 1.01 < totalChance) {
    console.error(`WARNING: ${packTypeName} ${pack.id} does not add up to 100% chance instead its ${totalChance}`);
  }
}