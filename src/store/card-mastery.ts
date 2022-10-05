import { Card, CardId, MyCreateSlice } from "../shared/types";
import cardsConfig from "../config/cards";
import { CardsSlice } from "./cards";
import { getExpValueMultiple, getMultipleFromExpValue } from "../shared/utils";

export type CardMastery = {
  level: number,
  currentCost: number,
  currentSpent: number,
  cardsSacrificed: number,
};
export type CardMasteries = Record<CardId, CardMastery>;

const defaultMasteries: CardMasteries = {};
Object.entries(cardsConfig).forEach(([id, card]) => {
  defaultMasteries[id] = {
    level: 0,
    currentCost: getLevelCost(0, card),
    currentSpent: 0,
    cardsSacrificed: 0,
  };
});

export interface CardMasterySlice {
  cardMasteries: CardMasteries,
  sacrificeCard: (card: Card) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
}

const createCardMasterySlice: MyCreateSlice<CardMasterySlice, [() => CardsSlice]> = (set, get, cards) => {
  return {
    cardMasteries: defaultMasteries,
    selectedCard: null,

    sacrificeCard: (card) => {
      if (cards().cards[card.id] < 1) return;

      const newCardMasteries = {...get().cardMasteries};
      const mastery = newCardMasteries[card.id];
      mastery.cardsSacrificed++;
      mastery.currentSpent++;
      if (mastery.currentCost == mastery.currentSpent) {
        mastery.level++;
        mastery.currentCost = getLevelCost(mastery.level, card);
        mastery.currentSpent = 0;
      }
      set({cardMasteries: newCardMasteries});

      cards().spendCard(card);
    },

    getSaveData: () => {
      const cardMasteriesToSave: Record<string, any> = {};
      Object.entries(get().cardMasteries).forEach(([id, mastery]) => {
        cardMasteriesToSave[id] = mastery.cardsSacrificed;
      });
      return {
        cardMasteries: cardMasteriesToSave,
      };
    },

    loadSaveData: (data) => {
      if (typeof data !== 'object' || typeof data.cardMasteries !== 'object') return false;

      const newMasteries: CardMasteries = {};
      Object.entries(data.cardMasteries).forEach(([id, cardsSacrified]) => {
        const masteryConfig = cardsConfig[id].mastery;
        const cardsSac = cardsSacrified as number;
        const level = Math.floor(getMultipleFromExpValue(masteryConfig.baseCost, masteryConfig.growth, 0, cardsSac));
        newMasteries[id] = {
          cardsSacrificed: cardsSac,
          level,
          currentCost: getLevelCost(level, cardsConfig[id]),
          currentSpent: cardsSac - getExpValueMultiple(masteryConfig.baseCost, masteryConfig.growth, 0, level),
        };
      });
      set({cardMasteries: newMasteries});

      return true;
    }
  }
};

function getLevelCost(currentLevel: number, card: Card) {
  return card.mastery.baseCost * Math.pow(card.mastery.growth, currentLevel);
}

export function getMasteryBonus(mastery: CardMastery, card: Card) {
  return 1 + (mastery.level * card.mastery.bonusPer);
}

export default createCardMasterySlice;