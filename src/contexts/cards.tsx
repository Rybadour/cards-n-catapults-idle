/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import { generateCards } from "../shared/pack-generation";
import { Card, CardPack, RealizedCard, ResourceType } from "../shared/types";
import { StatsContext } from "./stats";

export type CardsContext = {
  cards: Record<string, number>,
  selectedCard: Card | null,
  setSelectedCard: (card: Card) => void,
  hasCard: (card: Card) => boolean,
  replaceCard: (existingCard: RealizedCard | null) => void,
  buyPack: (cardPack: CardPack) => void,
};

const defaultContext: CardsContext = {
  cards: {beggar: 2, ratSnack: 1, ratDen: 1, forest: 1},
  selectedCard: null,
  setSelectedCard: (card) => {},
  hasCard: (card) => false,
  replaceCard: (card) => {},
  buyPack: (cardPack) => {},
};

export const CardsContext = createContext(defaultContext);

export function CardsProvider(props: Record<string, any>) {
  const stats = useContext(StatsContext);
  const [cards, setCards] = useState(defaultContext.cards);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  function hasCard(card: Card) {
    return (cards[card.id] ?? 0) > 0;
  }

  function replaceCard(existingCard: RealizedCard | null) {
    if (selectedCard == null) {
      return;
    }

    const newCards = {
      ...cards,
      [selectedCard.id]: (cards[selectedCard.id] ?? 0) - 1, 
    };
    if (newCards[selectedCard.id] < 0) {
      newCards[selectedCard.id] = 0;
    }

    if (existingCard != null) {
      let amount = 1;
      if (existingCard.durability && existingCard.maxDurability) {
        amount = existingCard.durability / existingCard.maxDurability;
        if (amount > 0.95) {
          amount = 1;
        }
      }
      newCards[existingCard.id] = (newCards[existingCard.id] ?? 0) + amount;
    }
    setCards(newCards);
  }

  function buyPack(cardPack: CardPack) {
    if (stats.resources[ResourceType.Gold] < cardPack.cost) return;

    stats.useResource(ResourceType.Gold, cardPack.cost);

    const cardsFromPack = generateCards(cardPack);
    const newCards = { ...cards };
    cardsFromPack.forEach(card => {
      newCards[card.id] = (newCards[card.id] ?? 0) + 1;
    });
    setCards(newCards);
  }

  return (
    <CardsContext.Provider
      value={{
        cards, selectedCard,
        setSelectedCard, hasCard, replaceCard, buyPack,
      }}
      {...props}
    />
  );
}
