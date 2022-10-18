import { Card, CardId, MyCreateSlice } from "../shared/types";
import cardsConfig from "../config/cards";
import { CardsSlice } from "./cards";
import { getExpValueMultiple, getMultipleFromExpValue } from "../shared/utils";
import { cloneDeep } from "lodash";
import { CardDefsSlice } from "./card-definitions";

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
  sacrificeUpToLevel: (card: Card) => void,
  sacrificeMax: (card: Card) => void,
  sacrificeAll: () => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
  completeReset: () => void,
}

const createCardMasterySlice: MyCreateSlice<CardMasterySlice, [() => CardsSlice, () => CardDefsSlice]>
= (set, get, cards, cardDefs) => {

  return {
    cardMasteries: cloneDeep(defaultMasteries),
    selectedCard: null,

    sacrificeCard: (card) => {
      if (cards().cards[card.id] < 1) return;

      const newCardMasteries = {...get().cardMasteries};
      incrementMastery(newCardMasteries, card, 1);
      set({cardMasteries: newCardMasteries});

      cards().spendCards(card, 1);
      cardDefs().cardMasteryUpdate(newCardMasteries);
    },

    sacrificeUpToLevel: (card) => {
      const numCards = Math.floor(cards().cards[card.id]);
      if (numCards < 1) return;

      const newCardMasteries = {...get().cardMasteries};
      const numToSacrifice = Math.min(
        newCardMasteries[card.id].currentCost - newCardMasteries[card.id].currentSpent,
        numCards
      );
      incrementMastery(newCardMasteries, card, numToSacrifice);
      set({cardMasteries: newCardMasteries});

      cards().spendCards(card, numToSacrifice);
      cardDefs().cardMasteryUpdate(newCardMasteries);
    },

    sacrificeMax: (card) => {
      const numCards = Math.floor(cards().cards[card.id]);
      if (numCards < 1) return;

      const newCardMasteries = {...get().cardMasteries};
      incrementMastery(newCardMasteries, card, numCards);
      set({cardMasteries: newCardMasteries});

      cards().spendCards(card, numCards);
      cardDefs().cardMasteryUpdate(newCardMasteries);
    },

    sacrificeAll: () => {
      const newCardMasteries = {...get().cardMasteries};
      const inventoryDelta: Record<string, number> = {};

      Object.entries(cards().cards).forEach(([id, num]) => {
        const numCards = Math.floor(num);
        if (numCards <= 0) return;

        incrementMastery(newCardMasteries, cardsConfig[id], numCards);
        inventoryDelta[id] = -numCards;
      });

      set({cardMasteries: newCardMasteries});
      cards().updateInventory(inventoryDelta);
      cardDefs().cardMasteryUpdate(newCardMasteries);
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
      cardDefs().cardMasteryUpdate(newMasteries);

      return true;
    },
    
    completeReset: () => {
      set({cardMasteries: cloneDeep(defaultMasteries)});
      cardDefs().cardMasteryUpdate(get().cardMasteries);
    },
  }
};

function getLevelCost(currentLevel: number, card: Card) {
  return card.mastery.baseCost * Math.pow(card.mastery.growth, currentLevel);
}

function incrementMastery(masteries: CardMasteries, card: Card, num: number) {
  const mastery = masteries[card.id];
  mastery.cardsSacrificed += num;

  let remainder = mastery.currentSpent + num;
  while(remainder >= mastery.currentCost) {
    remainder -= mastery.currentCost;
    mastery.level++;
    mastery.currentCost = getLevelCost(mastery.level, card);
  }
  mastery.currentSpent = remainder;
}

export function getMasteryBonus(mastery: CardMastery, card: Card) {
  return 1 + (mastery.level * card.mastery.bonusPer);
}

export default createCardMasterySlice;