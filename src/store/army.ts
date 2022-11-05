import { Combatant, MyCreateSlice } from "../shared/types";
import { StatsSlice } from "./stats";
import getPackSliceCreator, { PacksSlice } from "./generic-packs";
import armyPacks from "../config/army-packs";

export type ArmySlice = {
  reserves: Record<string, number>,
  deck: Record<string, number>,

  addToDeck: (unit: Combatant) => void,
  returnToReserves: (unit: Combatant) => void,
} & PacksSlice<Combatant>;

const createArmySlice: MyCreateSlice<ArmySlice, [() => StatsSlice]> = (set, get, stats) => {
  return {
    reserves: {},
    deck: {},

    addToDeck: (unit) => {
      const newReserves = get().reserves;
      const units = newReserves[unit.id] ?? 0;
      if (units <= 0) {
        return;
      }

      newReserves[unit.id] = units - 1;
      set({reserves: newReserves});

      const newDeck = get().deck;
      newDeck[unit.id] = (newDeck[unit.id] ?? 0) + 1;
      set({deck: newDeck})
    },

    returnToReserves: (unit) => {
      const newDeck = get().deck;
      const units = newDeck[unit.id] ?? 0;
      if (units <= 0) {
        return;
      }
      newDeck[unit.id] = units - 1;
      set({deck: newDeck})

      const newReserves = get().reserves;
      newReserves[unit.id] = (newReserves[unit.id] ?? 0) + 1;
      set({reserves: newReserves});

    },

    ...getPackSliceCreator(
      set, get, stats,
      armyPacks,
      (items) => {
        const newReserves = get().reserves;
        items.forEach(combatant => {
          newReserves[combatant.id] = (newReserves[combatant.id] ?? 0) + 1;
        });
        set({ reserves: newReserves });
      }
    )
  };
};

export default createArmySlice;
