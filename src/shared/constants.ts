import { PrestigeEffects } from "./types";

export const DEFAULT_EFFECTS: PrestigeEffects = {
  bonuses: {
    foodCapacity: 1,
    startingGold: 0,
    goldGain: 1,
    cardPackCostReduction: 0,
  },
  extraStartCards: {},
  unlockedCardPacks: [],
};

export const STANDARD_MODAL_STYLE = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
};