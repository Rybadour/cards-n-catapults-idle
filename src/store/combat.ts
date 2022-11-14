import { CombatEncounter, MyCreateSlice } from "../shared/types";
import { CardGridsSlice, getEmptyGrid } from "./card-grids";

export interface CombatSlice {
  encounter: CombatEncounter | null,

  chooseEncounter: (encounter: CombatEncounter) => void,
}

const createCombatSlice: MyCreateSlice<CombatSlice, [() => CardGridsSlice]> = (set, get, cardGrids) => {
  return {
    encounter: null,
    armyGrid: getEmptyGrid(),

    chooseEncounter: (encounter) => {
      cardGrids().initializeGrid('combat', encounter.staticCards);
      set({ encounter: encounter });
    }
  }
};

export default createCombatSlice;