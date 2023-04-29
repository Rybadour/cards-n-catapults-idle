import { MyCreateSlice } from ".";
import { CombatEncounter, ResourceType } from "../shared/types";
import { CardGridsSlice, getEmptyGrid } from "./card-grids";
import { CardsSlice } from "./cards";
import { DiscoverySlice } from "./discovery";
import { StatsSlice } from "./stats";

export interface CombatSlice {
  encounter: CombatEncounter | null,
  completedEncounters: string[],
  showRewardPage: boolean,

  chooseEncounter: (encounter: CombatEncounter) => void,
  update: (elapsed: number) => void,
  claimRewards: () => void,
}

const createCombatSlice: MyCreateSlice<CombatSlice, [
  () => CardGridsSlice, () => StatsSlice, () => CardsSlice, () => DiscoverySlice,
]> = (set, get, cardGrids, stats, cards, discovery) => {
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
      const rewards = get().encounter?.rewards;
      if (rewards?.cards) {
        // TODO
        //cards().drawCardsFromMap(rewards.cards);
      }
      if (rewards?.unlockedCards) {
        discovery().unlockCards(rewards.unlockedCards);       
      }

      set({
        showRewardPage: false,
        encounter: null,
      });
    },
  }
};

export default createCombatSlice;