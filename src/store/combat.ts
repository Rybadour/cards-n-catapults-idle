import combatEncounters from "../config/combat-encounters";
import { CombatEncounter, MyCreateSlice } from "../shared/types";
import { getEmptyGrid } from "./card-grids";

export interface CombatSlice {
  encounter: CombatEncounter | null,

  chooseEncounter: (encounter: CombatEncounter) => void,
}

const createCombatSlice: MyCreateSlice<CombatSlice, []> = (set, get) => {
  return {
    encounter: null,
    armyGrid: getEmptyGrid(),

    chooseEncounter: (encounter) => {
      set({ encounter: encounter });
    }
  }
};

export default createCombatSlice;