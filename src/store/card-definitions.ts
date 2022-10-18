import { cloneDeep } from "lodash";

import baseCardsConfig from "../config/cards";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { Card, CardId, EMPTY_CARD, MatchingGridShape, MyCreateSlice, PrestigeEffects, ResourceType } from "../shared/types";
import { autoFormatNumber, formatNumber, using } from "../shared/utils";
import { CardMasteries, getMasteryBonus } from "./card-mastery";

export interface CardDefsSlice {
  defs: Record<CardId, Card>,
  effects: PrestigeEffects,
  cardMasteries: CardMasteries,
  prestigeUpdate: (effects: PrestigeEffects) => void,
  cardMasteryUpdate: (cardMasteries: CardMasteries) => void,
}

const createCardDefsSlice: MyCreateSlice<CardDefsSlice, []> = (set, get) => {
  function getUpdatedCardDefs(effects: PrestigeEffects, cardMasteries: CardMasteries) {
    const newDefs: Record<CardId, Card> = {};
    Object.values(baseCardsConfig).forEach(card => {
      const def = cloneDeep(card);
      const bonus = cardMasteries[card.id] ? getMasteryBonus(cardMasteries[card.id], card) : 1;

      function replaceInDescription(variable: string, value: string) {
        def.description = def.description.replaceAll(`{{${variable}}}`, value);
      }

      if (def.passive) {
        if (def.passive.resource === ResourceType.Gold) {
          def.passive.strength *= effects.bonuses.goldGain;
        }
        def.passive.strength *= bonus;
        replaceInDescription('passiveAmount', `${autoFormatNumber(def.passive.strength)} ${def.passive.resource}/s`)
      }
      if (def.cooldownMs) {
        def.cooldownMs /= bonus;
        replaceInDescription('cooldownSecs', formatNumber(def.cooldownMs / 1000, 0, 1));
      }
      if (def.bonusToAdjacent) {
        def.bonusToAdjacent.strength *= bonus;
        replaceInDescription('bonusToAdjacentAmount', formatNumber(def.bonusToAdjacent.strength * 100, 0, 0) + '%')
      }
      using(def.bonusToFoodCapacity, (btfc) => {
        btfc.strength *= bonus;
        replaceInDescription('bonusToFoodAmount', formatNumber(btfc.strength * 100, 0, 0) + '%');
      });
      if (def.maxDurability) {
        def.maxDurability *= bonus * effects.bonuses.foodCapacity;
      }

      newDefs[def.id] = def;
    });
    return newDefs;
  }

  const initialEffects = cloneDeep(DEFAULT_EFFECTS);
  const initialCardMasteries = {};

  return {
    defs: getUpdatedCardDefs(initialEffects, initialCardMasteries),
    effects: initialEffects,
    cardMasteries: initialCardMasteries,

    prestigeUpdate: (effects) => {
      set({
        effects,
        defs: getUpdatedCardDefs(effects, get().cardMasteries)
      });
    },

    cardMasteryUpdate: (cardMasteries) => {
      set({
        cardMasteries,
        defs: getUpdatedCardDefs(get().effects, cardMasteries)
      });
    }
  }
};

export default createCardDefsSlice;