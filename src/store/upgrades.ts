import { MyCreateSlice } from ".";
import { StatsSlice } from "./stats";

export interface UpgradesSlice {
  purchasedUpgrades: Record<string, boolean>;

  purchaseUpgrade: (id: string) => void;
}

const createUpgradesSlice: MyCreateSlice<UpgradesSlice, [() => StatsSlice]> = (set, get, stats) => {
  return {
    purchasedUpgrades: {},

    purchaseUpgrade: (id) => {
      set({purchasedUpgrades: { ...get().purchasedUpgrades, [id]: true }});
    }
  };
};

export default createUpgradesSlice;