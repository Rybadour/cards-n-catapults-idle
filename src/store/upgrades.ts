import { MyCreateSlice } from ".";
import agesConfig from "../config/technologies/ages";
import { CardDefsSlice } from "./card-definitions";
import { StatsSlice } from "./stats";
import { DiscoverySlice } from "./discovery";
import { mapValues } from "lodash";

export interface UpgradesSlice {
  purchasedUpgrades: Record<string, Record<string, boolean>>;

  purchaseUpgrade: (ageId: string, upId: string) => void;
}

const createUpgradesSlice: MyCreateSlice<UpgradesSlice, [() => StatsSlice, () => CardDefsSlice, () => DiscoverySlice]>
= (set, get, stats, cardDefs, discovery) => {
  return {
    purchasedUpgrades: mapValues(agesConfig, (age) => ({})),

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
      cardDefs().addUpgrade(upgrade);

      if (upgrade.unlockedCards) {
        discovery().discoverCards(upgrade.unlockedCards);
      }

      set(newState);
      stats().useResources(upgrade.cost);
    }
  };
};

export default createUpgradesSlice;