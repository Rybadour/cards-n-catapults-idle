import { cloneDeep } from "lodash";

import baseCardsConfig from "../config/cards";
import global from "../config/global";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { Card, CardId, MyCreateSlice, PrestigeEffects } from "../shared/types";
import { CardMasteries, getMasteryBonus } from "./card-mastery";

export interface CardDefsSlice {
  defs: Record<CardId, Card>,
  effects: PrestigeEffects,
  cardMasteries: CardMasteries,
  prestigeUpdate: (effects: PrestigeEffects) => void,
  cardMasteryUpdate: (cardMasteries: CardMasteries) => void,
}

const createCardDefsSlice: MyCreateSlice<CardDefsSlice, []> = (set, get) => {
  function updateCardDefs() {
    const newDefs: Record<CardId, Card> = {};
    const state = get();
    Object.values(baseCardsConfig).forEach(card => {
      const def = cloneDeep(card);
      const bonus = state.cardMasteries[card.id] ? getMasteryBonus(state.cardMasteries[card.id], card) : 1;

      if (def.abilityStrengthModifier) {
        def.abilityStrengthModifier.factor *= bonus;
      }
      if (def.bonusToAdjacent) {
        def.bonusToAdjacent.strength *= bonus;
      }
      if (def.maxDurability) {
        def.maxDurability *= bonus;
      }
      newDefs[def.id] = def;
    });

    set({defs: newDefs});
  }

  return {
    defs: cloneDeep(baseCardsConfig),
    effects: cloneDeep(DEFAULT_EFFECTS),
    cardMasteries: {},

    prestigeUpdate: (effects) => {
      set({effects});
      updateCardDefs();
    },

    cardMasteryUpdate: (cardMasteries) => {
      set({cardMasteries});
      updateCardDefs();
    }
  }
};

export default createCardDefsSlice;