import { MyCreateSlice } from ".";
import agesConfig, { RealizedTechAge } from "../config/technologies/ages";
import { CardDefsSlice } from "./card-definitions";
import { StatsSlice } from "./stats";
import { DiscoverySlice } from "./discovery";
import { mapValues } from "lodash";
import { Upgrade } from "../shared/types";

export interface UpgradesSlice {
  techAges: Record<string, RealizedTechAge>,
  purchasedUpgrades: Record<string, Record<string, boolean>>,

  purchaseUpgrade: (ageId: string, upId: string) => void;
  chooseMegaUpgrade: (ageId: string, upId: string) => void;
}

const createUpgradesSlice: MyCreateSlice<UpgradesSlice, [() => StatsSlice, () => CardDefsSlice, () => DiscoverySlice]>
= (set, get, stats, cardDefs, discovery) => {
  function applyUpgrade(upgrade: Upgrade) {
    cardDefs().addUpgrade(upgrade);
    if (upgrade.unlockedCards) {
      discovery().discoverCards(upgrade.unlockedCards);
    }
    if (upgrade.sellResourceBonus) {
      stats().addSellResourceBonus(upgrade.sellResourceBonus);
    }
  }

  return {
    purchasedUpgrades: mapValues(agesConfig, (age) => ({})),
    techAges: mapValues(agesConfig, (age) => ({
      ...age,
      unlocked: age.id === 'stoneAge',
      completed: false,
    })),

    purchaseUpgrade: (ageId, upId) => {
      const purchasedUpgrades = get().purchasedUpgrades;
      const upgrade = agesConfig[ageId].upgrades[upId];
      if (purchasedUpgrades[ageId][upId] || !stats().canAfford(upgrade.cost)) return;

      const newState: Partial<UpgradesSlice> = {
        purchasedUpgrades: mapValues(get().purchasedUpgrades, (upgrades, theAgeId) => {
          if (theAgeId === ageId) {
            return { ...upgrades, [upId]: true };
          } else {
            return upgrades;
          }
        })
      };
      if (upgrade.unlockAge) {
        const techAges = { ...get().techAges };
        techAges[ageId].completed = true;
        techAges[upgrade.unlockAge].unlocked = true;
        newState.techAges = techAges;
      }
      set(newState);
      stats().useResources(upgrade.cost);
      applyUpgrade(upgrade);
    },

    chooseMegaUpgrade: (ageId, upId) => {
      const upgrade = agesConfig[ageId].megaUpgrades[upId];
      if (!upgrade) return;

      const techAges = get().techAges;
      set({
        techAges: {
          ...techAges,
          [ageId]: {
            ...techAges[ageId],
            chosenMegaUpgrade: upId,
          }
        },
      });

      applyUpgrade(upgrade);
    },
  };
};

export default createUpgradesSlice;