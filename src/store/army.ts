import { Combatant, MyCreateSlice } from "../shared/types";
import { StatsSlice } from "./stats";
import getPackSliceCreator, { PacksSlice } from "./generic-packs";
import armyPacks from "../config/army-packs";

export type ArmySlice = {
  reserves: Record<string, number>,
  deck: Record<string, number>,
} & PacksSlice<Combatant>;

const createArmySlice: MyCreateSlice<ArmySlice, [() => StatsSlice]> = (set, get, stats) => {
  return {
    reserves: {},
    deck: {},
    ...getPackSliceCreator(
      set, get, stats,
      armyPacks,
      (items) => {
        const oldReserves = get().reserves;
        items.forEach(combatant => {
          oldReserves[combatant.id] = (oldReserves[combatant.id] ?? 0) + 1;
        });
        set({ reserves: oldReserves });
      }
    )
  };
};

export default createArmySlice;
