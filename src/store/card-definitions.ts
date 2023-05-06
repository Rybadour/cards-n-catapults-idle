import { cloneDeep } from "lodash";

import baseCardsConfig from "../config/cards";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { Bonuses, Card, CardId, PrestigeEffects, ResourceType } from "../shared/types";
import { autoFormatNumber, formatNumber, using } from "../shared/utils";
import { CardGridsSlice } from "./card-grids";
import { MyCreateSlice } from ".";

export interface CardDefsSlice {
  defs: Record<CardId, Card>,
  prestigeEffects: PrestigeEffects,
  bonuses: Bonuses,

  prestigeUpdate: (effects: PrestigeEffects) => void,
  upgradesUpdate: (bonuses: Bonuses) => void,
}

const createCardDefsSlice: MyCreateSlice<CardDefsSlice, [() => CardGridsSlice]> = (set, get, cardGrids) => {
  function getUpdatedCardDefs(effects: PrestigeEffects, bonuses: Bonuses) {
    const newDefs: Record<CardId, Card> = {};
    Object.values(baseCardsConfig).forEach(card => {
      const def = cloneDeep(card);
      const bonus = 1;

      function replaceInDescription(variable: string, value: string) {
        def.description = def.description.replaceAll(`{{${variable}}}`, value);
      }

      if (def.passive) {
        if (def.passive.resource === ResourceType.Gold) {
          def.passive.strength *= effects.bonuses.goldGain * bonuses.goldGain;
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
        def.maxDurability *= bonus * effects.bonuses.foodCapacity * bonuses.foodCapacity;
      }

      newDefs[def.id] = def;
    });
    return newDefs;
  }

  const initialEffects = cloneDeep(DEFAULT_EFFECTS);
  const initialBonuses = cloneDeep(DEFAULT_EFFECTS.bonuses);

  return {
    defs: getUpdatedCardDefs(initialEffects, initialBonuses),
    prestigeEffects: initialEffects,
    bonuses: initialBonuses,

    prestigeUpdate: (effects) => {
      set({
        prestigeEffects: effects,
        defs: getUpdatedCardDefs(effects, get().bonuses)
      });
      cardGrids().cardDefsChanged();
    },

    upgradesUpdate: (bonuses) => {
      set({
        bonuses: bonuses,
        defs: getUpdatedCardDefs(get().prestigeEffects, bonuses)
      });
      cardGrids().cardDefsChanged();
    },
  }
};

export default createCardDefsSlice;