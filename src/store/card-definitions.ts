import { cloneDeep, mapValues } from "lodash";

import baseCardsConfig, { CardId } from "../config/cards";
import { DEFAULT_CARD_BONUSES } from "../shared/constants";
import { Card, CardBonuses, CardPartialBonuses, ResourceType, UnlockableCardFeature, Upgrade } from "../shared/types";
import { addToBonusValue, autoFormatNumber, formatNumber, getEntries, getFinalBonusValue, getPartialEntries, mapRecordValues, using } from "../shared/utils";
import { CardGridsSlice } from "./card-grids";
import { MyCreateSlice } from ".";

export interface CardDefsSlice {
  baseCardConfigs: Record<CardId, Card>,
  defs: Record<CardId, Card>,
  cardsBonuses: Record<CardId, CardBonuses>,
  unlockables: Record<UnlockableCardFeature, boolean>, 

  prestigeReset: (prestigeUpgrades: Upgrade[]) => void,
  addUpgrade: (upgrade: Upgrade) => void,
}

const initialBonuses: Record<CardId, CardBonuses> = mapValues(baseCardsConfig, (card) => cloneDeep(DEFAULT_CARD_BONUSES));

const createCardDefsSlice: MyCreateSlice<CardDefsSlice, [() => CardGridsSlice]> = (set, get, cardGrids) => {

  function getRecomputedCardDef(baseCardConfigs: Record<CardId, Card>, cardId: CardId, bonuses: CardBonuses): Card {
    const def: Card = cloneDeep(baseCardConfigs[cardId]);

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
      if (def.passive.resource === ResourceType.Tools) {
        def.passive.strength = getFinalBonusValue(def.passive.strength, bonuses.toolGain);
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

  return {
    baseCardConfigs: cloneDeep(baseCardsConfig),
    defs: mapRecordValues(initialBonuses, (bonuses, cardId: CardId) => getRecomputedCardDef(baseCardsConfig, cardId, bonuses)),
    cardsBonuses: initialBonuses,
    unlockables: {
      ForagerWood: false,
    },

    prestigeReset: (prestigeUpgrades) => {
      const newCardsBonuses: Record<CardId, CardBonuses> = cloneDeep(initialBonuses);
      prestigeUpgrades.forEach(pu => {
        if (pu.bonuses) {
          Object.values(newCardsBonuses)
            .forEach((cardBonuses) => mergeCardBonuses(cardBonuses, pu.bonuses!));
        }
        if (pu.cardsBonuses) {
          getPartialEntries(pu.cardsBonuses)
            .forEach(([cardId, newBonuses]) => mergeCardBonuses(newCardsBonuses[cardId], newBonuses));
        }
      })

      set({
        defs: mapRecordValues(newCardsBonuses, (bonuses: CardBonuses, cardId: CardId) => getRecomputedCardDef(get().baseCardConfigs, cardId, bonuses)),
        cardsBonuses: newCardsBonuses,
      });
      cardGrids().cardDefsChanged();
    },

    addUpgrade: (upgrade) => {
      if (!upgrade.bonuses && !upgrade.cardsBonuses && !upgrade.unlockedCardFeaured) return;

      const cardsBonuses = get().cardsBonuses;
      let cardsChanged: CardId[] = [];
      if (upgrade.bonuses) {
        cardsChanged = Object.keys(cardsBonuses) as CardId[];
        Object.values(cardsBonuses)
          .forEach((cardBonuses) => mergeCardBonuses(cardBonuses, upgrade.bonuses!));
      }
      if (upgrade.cardsBonuses) {
        getPartialEntries(upgrade.cardsBonuses)
          .forEach(([cardId, newBonuses]) => {
            cardsChanged.push(cardId);
            mergeCardBonuses(cardsBonuses[cardId], newBonuses)
          });
      }

      if (upgrade.unlockedCardFeaured) {
        const newBaseConfigs = { ...get().baseCardConfigs };
        getEntries(newBaseConfigs).forEach(([cardId, baseDef]) => {
          Object.entries(baseDef.unlockableFeatures ?? {}).forEach(([unlockable, cardFeatures]) => {
            if (unlockable === upgrade.unlockedCardFeaured) {
              newBaseConfigs[cardId] = {...baseDef, ...cardFeatures};
              cardsChanged.push(cardId);
            }
          })
        });
        set({ baseCardConfigs: newBaseConfigs });
      }

      const newDefs = { ...get().defs };
      (new Set(cardsChanged)).forEach((cardId) => {
        newDefs[cardId] = getRecomputedCardDef(get().baseCardConfigs, cardId, cardsBonuses[cardId]);
      });

      set({
        cardsBonuses: cardsBonuses,
        defs: newDefs,
      });
      cardGrids().cardDefsChanged();
    },
  }
};


function mergeCardBonuses(cardBonuses: CardBonuses, newBonuses: Partial<CardPartialBonuses>) {
  (Object.keys(newBonuses) as (keyof CardBonuses)[]).forEach(p => {
    addToBonusValue(cardBonuses[p], newBonuses[p]!);
  })
}

export default createCardDefsSlice;