import { cloneDeep } from "lodash";
import { MyCreateSlice } from ".";
import upgrades from "../config/upgrades";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { Bonuses } from "../shared/types";
import { CardDefsSlice } from "./card-definitions";
import { StatsSlice } from "./stats";
import { DiscoverySlice } from "./discovery";

export interface UpgradesSlice {
  purchasedUpgrades: Record<string, boolean>;
  bonuses: Bonuses,

  purchaseUpgrade: (id: string) => void;
}

const createUpgradesSlice: MyCreateSlice<UpgradesSlice, [() => StatsSlice, () => CardDefsSlice, () => DiscoverySlice]>
= (set, get, stats, cardDefs, discovery) => {
  return {
    purchasedUpgrades: {},
    bonuses: cloneDeep(DEFAULT_EFFECTS.bonuses),

    purchaseUpgrade: (id) => {
      const purchasedUpgrades = get().purchasedUpgrades;
      const upgrade = upgrades[id];
      if (purchasedUpgrades[id] || !stats().canAfford(upgrade.cost)) return;

      const newState: Partial<UpgradesSlice> = {
        purchasedUpgrades: { ...get().purchasedUpgrades, [id]: true }
      };
      if (upgrade.bonus) {
        const newBonuses = get().bonuses;
        newBonuses[upgrade.bonus.field] += upgrade.bonus.amount;
        newState.bonuses = newBonuses;
        cardDefs().upgradesUpdate(newBonuses);
      }

      if (upgrade.unlockedCards) {
        discovery().discoverCards(upgrade.unlockedCards);
      }

      set(newState);
      stats().useResources(upgrade.cost);
    }
  };
};

export default createUpgradesSlice;