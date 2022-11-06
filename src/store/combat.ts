import { CombatEncounter, Grid, MyCreateSlice } from "../shared/types";
import { getEmptyGrid } from "./grid";

export interface CombatSlice {
  encounter: CombatEncounter | null,
  armyGrid: Grid,

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