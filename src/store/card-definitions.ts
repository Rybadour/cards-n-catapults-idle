import { cloneDeep, mapValues } from "lodash";

import baseCardsConfig from "../config/cards";
import { DEFAULT_CARD_BONUSES } from "../shared/constants";
import { BonusValues, Card, CardBonuses, CardId, CardPartialBonuses, ResourceType, Upgrade } from "../shared/types";
import { addToBonusValue, autoFormatNumber, formatNumber, getFinalBonusValue, using } from "../shared/utils";
import { CardGridsSlice } from "./card-grids";
import { MyCreateSlice } from ".";

export interface CardDefsSlice {
  defs: Record<CardId, Card>,
  cardsBonuses: Record<CardId, CardBonuses>,

  prestigeReset: (prestigeUpgrades: Upgrade[]) => void,
  addUpgrade: (upgrade: Upgrade) => void,
}

const initialBonuses = mapValues(baseCardsConfig, (card) => cloneDeep(DEFAULT_CARD_BONUSES));

const createCardDefsSlice: MyCreateSlice<CardDefsSlice, [() => CardGridsSlice]> = (set, get, cardGrids) => {
  return {
    defs: mapValues(initialBonuses, (bonuses, cardId) => getRecomputedCardDef(cardId, bonuses)),
    cardsBonuses: initialBonuses,

    prestigeReset: (prestigeUpgrades) => {
      const newCardsBonuses = cloneDeep(initialBonuses);
      prestigeUpgrades.forEach(pu => {
        if (pu.bonuses) {
          Object.values(newCardsBonuses)
            .forEach((cardBonuses) => mergeCardBonuses(cardBonuses, pu.bonuses!));
        }
        if (pu.cardsBonuses) {
          Object.entries(pu.cardsBonuses)
            .forEach(([cardId, newBonuses]) => mergeCardBonuses(newCardsBonuses[cardId], newBonuses));
        }
      })

      set({
        defs: mapValues(newCardsBonuses, (bonuses, cardId) => getRecomputedCardDef(cardId, bonuses)),
        cardsBonuses: newCardsBonuses,
      });
      cardGrids().cardDefsChanged();
    },

    addUpgrade: (upgrade) => {
      if (!upgrade.bonuses && !upgrade.cardsBonuses) return;

      const cardsBonuses = get().cardsBonuses;
      let cardsChanged: CardId[] = [];
      if (upgrade.bonuses) {
        cardsChanged = Object.keys(cardsBonuses);
        Object.values(cardsBonuses)
          .forEach((cardBonuses) => mergeCardBonuses(cardBonuses, upgrade.bonuses!));
      }
      if (upgrade.cardsBonuses) {
        Object.entries(upgrade.cardsBonuses)
          .forEach(([cardId, newBonuses]) => {
            cardsChanged.push(cardId);
            mergeCardBonuses(cardsBonuses[cardId], newBonuses)
          });
      }

      const newDefs = { ...get().defs }
      cardsChanged.forEach((cardId) => {
        newDefs[cardId] = getRecomputedCardDef(cardId, cardsBonuses[cardId]);
      });

      set({
        cardsBonuses: cardsBonuses,
        defs: newDefs,
      });
      cardGrids().cardDefsChanged();
    },
  }
};

function getRecomputedCardDef(cardId: CardId, bonuses: CardBonuses) {
  const def = cloneDeep(baseCardsConfig[cardId]);

  function replaceInDescription(variable: string, value: string) {
    def.description = def.description.replaceAll(`{{${variable}}}`, value);
  }

  if (def.passive) {
    if (def.passive.resource === ResourceType.Gold) {
      def.passive.strength = getFinalBonusValue(def.passive.strength, bonuses.goldGain);
    }
    if (def.passive.resource === ResourceType.Wood) {
      def.passive.strength = getFinalBonusValue(def.passive.strength, bonuses.woodGain);
    }
    replaceInDescription('passiveAmount', `${autoFormatNumber(def.passive.strength)} ${def.passive.resource}/s`)
  }
  if (def.cooldownMs) {
    replaceInDescription('cooldownSecs', formatNumber(def.cooldownMs / 1000, 0, 1));
  }
  if (def.bonusToAdjacent) {
    replaceInDescription('bonusToAdjacentAmount', formatNumber(def.bonusToAdjacent.strength * 100, 0, 0) + '%')
  }
  using(def.bonusToFoodCapacity, (btfc) => {
    replaceInDescription('bonusToFoodAmount', formatNumber(btfc.strength * 100, 0, 0) + '%');
  });
  if (def.maxDurability) {
    def.maxDurability = getFinalBonusValue(def.maxDurability, bonuses.foodCapacity);
  }

  return def;
}

function mergeCardBonuses(cardBonuses: CardBonuses, newBonuses: Partial<CardPartialBonuses>) {
  (Object.keys(newBonuses) as (keyof CardBonuses)[]).forEach(p => {
    addToBonusValue(cardBonuses[p], newBonuses[p]!);
  })
}

export default createCardDefsSlice;