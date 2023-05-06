import { MyCreateSlice } from ".";
import upgrades from "../config/upgrades";
import { CardDefsSlice } from "./card-definitions";
import { StatsSlice } from "./stats";
import { DiscoverySlice } from "./discovery";

export interface UpgradesSlice {
  purchasedUpgrades: Record<string, boolean>;

  purchaseUpgrade: (id: string) => void;
}

const createUpgradesSlice: MyCreateSlice<UpgradesSlice, [() => StatsSlice, () => CardDefsSlice, () => DiscoverySlice]>
= (set, get, stats, cardDefs, discovery) => {
  return {
    purchasedUpgrades: {},

    purchaseUpgrade: (id) => {
      const purchasedUpgrades = get().purchasedUpgrades;
      const upgrade = upgrades[id];
      if (purchasedUpgrades[id] || !stats().canAfford(upgrade.cost)) return;

      const newState: Partial<UpgradesSlice> = {
        purchasedUpgrades: { ...get().purchasedUpgrades, [id]: true }
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