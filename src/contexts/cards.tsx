/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react";
import { Card, CardPack } from "../shared/types";

export type CardsContext = {
  cards: Record<string, number>,
  selectedCard: Card | null,
  setSelectedCard: (card: Card) => void,
  hasCard: (card: Card) => boolean,
  addCard: (card: Card) => void,
  removeCard: (card: Card) => void,
  openPack: (cardPack: CardPack) => void,
};

const defaultContext: CardsContext = {
  cards: {beggar: 2, ratSnack: 1},
  selectedCard: null,
  setSelectedCard: (card) => {},
  hasCard: (card) => false,
  addCard: (card) => {},
  removeCard: (card) => {},
  openPack: (cardPack) => {},
};

export const CardsContext = createContext(defaultContext);

export function CardsProvider(props: Record<string, any>) {
  const [cards, setCards] = useState(defaultContext.cards);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  function hasCard(card: Card) {
    return (cards[card.id] ?? 0) > 0;
  }

  function addCard(card: Card) {
    const newCards = {
      ...cards,
      [card.id]: (cards[card.id] ?? 0) + 1, 
    };
    setCards(newCards);
  }

  function removeCard(card: Card) {
    const newCards = {
      ...cards,
      [card.id]: (cards[card.id] ?? 0) - 1, 
    };
    setCards(newCards);
  }

  function openPack(cardPack: CardPack) {

  }

  return (
    <CardsContext.Provider
      value={{
        cards, selectedCard,
        setSelectedCard, hasCard, addCard, removeCard, openPack,
      }}
      {...props}
    />
  );
}
