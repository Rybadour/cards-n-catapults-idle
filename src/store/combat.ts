import { CombatEncounter, MyCreateSlice, ResourceType } from "../shared/types";
import { CardGridsSlice, getEmptyGrid } from "./card-grids";
import { StatsSlice } from "./stats";

export interface CombatSlice {
  encounter: CombatEncounter | null,
  completedEncounters: string[],
  showRewardPage: boolean,

  chooseEncounter: (encounter: CombatEncounter) => void,
  update: (elapsed: number) => void,
  claimRewards: () => void,
}

const createCombatSlice: MyCreateSlice<CombatSlice, [() => CardGridsSlice, () => StatsSlice]> = (set, get, cardGrids, stats) => {
  return {
    encounter: null,
    completedEncounters: [],
    showRewardPage: false,

    chooseEncounter: (encounter) => {
      cardGrids().initializeGrid('combat', encounter.staticCards);
      set({ encounter: encounter });
    },

    update: (elapsed) => {
      if (get().showRewardPage) return;

      const encounter = get().encounter;
      if (encounter && stats().resources.Power >= encounter.militaryStrength) {
        set({
          showRewardPage: true,
          completedEncounters: [...get().completedEncounters, encounter.id],
        });
        stats().resetResource(ResourceType.MilitaryPower);
        cardGrids().clearGrid('combat');
      }
    },

    claimRewards: () => {
      set({
        showRewardPage: false,
        encounter: null,
      });
    },
  }
};

export default createCombatSlice;