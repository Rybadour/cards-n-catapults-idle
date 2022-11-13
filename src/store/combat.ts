import combatEncounters from "../config/combat-encounters";
import { CombatEncounter, Grid, MyCreateSlice } from "../shared/types";
import { getEmptyGrid } from "./card-grids";

export interface CombatSlice {
  encounter: CombatEncounter | null,
  armyGrid: Grid,

  chooseEncounter: (encounter: CombatEncounter) => void,
}

const createCombatSlice: MyCreateSlice<CombatSlice, []> = (set, get) => {
  return {
    encounter: combatEncounters.ratden,
    armyGrid: getEmptyGrid(),

    chooseEncounter: (encounter) => {
      set({ encounter: encounter });
    }
  }
};

export default createCombatSlice;