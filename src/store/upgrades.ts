import { cloneDeep } from "lodash";
import { MyCreateSlice } from ".";
import upgrades from "../config/upgrades";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { Bonuses } from "../shared/types";
import { CardDefsSlice } from "./card-definitions";
import { StatsSlice } from "./stats";

export interface UpgradesSlice {
  purchasedUpgrades: Record<string, boolean>;
  bonuses: Bonuses,

  purchaseUpgrade: (id: string) => void;
}

const createUpgradesSlice: MyCreateSlice<UpgradesSlice, [() => StatsSlice, () => CardDefsSlice]>
= (set, get, stats, cardDefs) => {
  return {
    purchasedUpgrades: {},
    bonuses: cloneDeep(DEFAULT_EFFECTS.bonuses),

    purchaseUpgrade: (id) => {
      const purchasedUpgrades = get().purchasedUpgrades;
      const upgrade = upgrades[id];
      if (purchasedUpgrades[id] || !stats().canAfford(upgrade.cost)) return;

      const newBonuses = get().bonuses;
      if (upgrade.bonus) {
        newBonuses[upgrade.bonus.field] += upgrade.bonus.amount;
      }

      set({
        bonuses: newBonuses,
        purchasedUpgrades: { ...get().purchasedUpgrades, [id]: true }
      });
      cardDefs().upgradesUpdate(newBonuses);
      stats().useResources(upgrade.cost);
    }
  };
};

export default createUpgradesSlice;