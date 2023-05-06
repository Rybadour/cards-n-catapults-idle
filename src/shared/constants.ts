import { BonusValues, CardBonuses } from "./types";

export const DEFAULT_BONUS_VALUES: BonusValues = {
  baseAdd: 0,
  baseMulti: 1,
}
export const DEFAULT_CARD_BONUSES: CardBonuses = {
  foodCapacity: {...DEFAULT_BONUS_VALUES},
  goldGain: {...DEFAULT_BONUS_VALUES},
  woodGain: {...DEFAULT_BONUS_VALUES},
}

export const STANDARD_MODAL_STYLE = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
};

export const FOOD_RED = "#C22";

export const BUILDING_BLUE = "#72bcd4";