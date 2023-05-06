import { MyCreateSlice } from ".";

export interface UpgradesSlice {
  purchasedUpgrades: Record<string, boolean>;

  purchaseUpgrade: (id: string) => void;
}

const createUpgradesSlice: MyCreateSlice<UpgradesSlice, []> = (set, get) => {
  return {
    purchasedUpgrades: {},

    purchaseUpgrade: (id) => {
      set({purchasedUpgrades: { ...get().purchasedUpgrades, [id]: true }});
    }
  };
};

export default createUpgradesSlice;