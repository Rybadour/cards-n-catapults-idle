import { cloneDeep } from "lodash";

import baseCardsConfig from "../config/cards";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { Card, CardId, PrestigeEffects, ResourceType } from "../shared/types";
import { autoFormatNumber, formatNumber, using } from "../shared/utils";
import { CardGridsSlice } from "./card-grids";
import { MyCreateSlice } from ".";

export interface CardDefsSlice {
  defs: Record<CardId, Card>,
  effects: PrestigeEffects,
  prestigeUpdate: (effects: PrestigeEffects) => void,
}

const createCardDefsSlice: MyCreateSlice<CardDefsSlice, [() => CardGridsSlice]> = (set, get, cardGrids) => {
  function getUpdatedCardDefs(effects: PrestigeEffects) {
    const newDefs: Record<CardId, Card> = {};
    Object.values(baseCardsConfig).forEach(card => {
      const def = cloneDeep(card);
      const bonus = 1;

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
    defs: getUpdatedCardDefs(initialEffects),
    effects: initialEffects,
    cardMasteries: initialCardMasteries,

    prestigeUpdate: (effects) => {
      set({
        effects,
        defs: getUpdatedCardDefs(effects)
      });
      cardGrids().cardDefsChanged();
    },
  }
};

export default createCardDefsSlice;