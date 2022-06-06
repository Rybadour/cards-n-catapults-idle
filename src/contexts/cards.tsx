/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react";
import { Card, CardPack } from "../shared/types";

export type CardsContext = {
  cards: Record<string, number>,
  selectedCard: Card | null,
  setSelectedCard: (card: Card) => void,
  hasCard: (card: Card) => boolean,
  replaceCard: (existingCard: Card | null) => void,
  openPack: (cardPack: CardPack) => void,
};

const defaultContext: CardsContext = {
  cards: {beggar: 2, ratSnack: 1},
  selectedCard: null,
  setSelectedCard: (card) => {},
  hasCard: (card) => false,
  replaceCard: (card) => {},
  openPack: (cardPack) => {},
};

export const CardsContext = createContext(defaultContext);

export function CardsProvider(props: Record<string, any>) {
  const [cards, setCards] = useState(defaultContext.cards);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  function hasCard(card: Card) {
    return (cards[card.id] ?? 0) > 0;
  }

  function replaceCard(existingCard: Card | null) {
    if (selectedCard == null) {
      return;
    }

    const newCards = {
      ...cards,
      [selectedCard.id]: (cards[selectedCard.id] ?? 0) - 1, 
    };
    if (existingCard != null) {
      newCards[existingCard.id] = (cards[existingCard.id] ?? 0) + 1;
    }
    setCards(newCards);
  }

  function openPack(cardPack: CardPack) {

  }

  return (
    <CardsContext.Provider
      value={{
        cards, selectedCard,
        setSelectedCard, hasCard, replaceCard, openPack,
      }}
      {...props}
    />
  );
}
