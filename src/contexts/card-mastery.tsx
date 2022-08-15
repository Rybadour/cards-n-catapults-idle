/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import cardsConfig from "../config/cards";
import { Card, CardId } from "../shared/types";
import { getExpValueMultiple, getMultipleFromExpValue } from "../shared/utils";
import { CardsContext } from "./cards";

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

export type CardMasteryContext = {
  cardMasteries: CardMasteries,
  sacrificeCard: (card: Card) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
};

const defaultContext: CardMasteryContext = {
  cardMasteries: defaultMasteries,
  sacrificeCard: (card) => {},
  getSaveData: () => {},
  loadSaveData: (data) => false,
};

export const CardMasteryContext = createContext(defaultContext);

export function CardMasteryProvider(props: Record<string, any>) {
  const cards = useContext(CardsContext);
  const [cardMasteries, setCardMasteries] = useState(defaultContext.cardMasteries);

  function sacrificeCard(card: Card) {
    if (cards.cards[card.id] < 1) return;

    const newCardMasteries = {...cardMasteries};
    const mastery = newCardMasteries[card.id];
    mastery.cardsSacrificed++;
    mastery.currentSpent++;
    if (mastery.currentCost == mastery.currentSpent) {
      mastery.level++;
      mastery.currentCost = getLevelCost(mastery.level, card);
      mastery.currentSpent = 0;
    }
    setCardMasteries(newCardMasteries);

    cards.spendCard(card);
  }

  function getSaveData() {
    const cardMasteriesToSave: Record<string, any> = {};
    Object.entries(cardMasteries).forEach(([id, mastery]) => {
      cardMasteriesToSave[id] = mastery.cardsSacrificed;
    });
    return {
      cardMasteries: cardMasteriesToSave,
    };
  }

  function loadSaveData(data: any) {
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
    setCardMasteries(newMasteries);

    return true;
  }

  return (
    <CardMasteryContext.Provider
      value={{
        cardMasteries,
        sacrificeCard, getSaveData, loadSaveData,
      }}
      {...props}
    />
  );
}

function getLevelCost(currentLevel: number, card: Card) {
  return card.mastery.baseCost * Math.pow(card.mastery.growth, currentLevel);
}

export function getMasteryBonus(mastery: CardMastery, card: Card) {
  return 1 + (mastery.level * card.mastery.bonusPer);
}