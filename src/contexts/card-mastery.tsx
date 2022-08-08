/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import cardsConfig from "../config/cards";
import { Card, CardId } from "../shared/types";
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
};

const defaultContext: CardMasteryContext = {
  cardMasteries: defaultMasteries,
  sacrificeCard: (card) => {},
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

  return (
    <CardMasteryContext.Provider
      value={{
        cardMasteries,
        sacrificeCard,
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