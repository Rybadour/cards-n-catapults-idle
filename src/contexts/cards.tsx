/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import global from "../config/global";
import { generateCards } from "../shared/pack-generation";
import { Card, CardId, CardPack, RealizedCard, ResourceType } from "../shared/types";
import { DiscoveryContext } from "./discovery";
import { StatsContext } from "./stats";

export type CardsContext = {
  cards: Record<CardId, number>,
  selectedCard: Card | null,
  setSelectedCard: (card: Card) => void,
  hasCard: (card: Card) => boolean,
  returnCard: (card: RealizedCard) => void,
  replaceCard: (existingCard: RealizedCard | null) => void,
  updateInventory: (cardsDelta: Record<CardId, number>) => void,
  buyPack: (cardPack: CardPack) => void,
};

const defaultContext: CardsContext = {
  cards: global.startingCards,
  selectedCard: null,
  setSelectedCard: (card) => {},
  hasCard: (card) => false,
  returnCard: (card) => {},
  replaceCard: (card) => {},
  updateInventory: (cardsDelta) => {},
  buyPack: (cardPack) => {},
};

export const CardsContext = createContext(defaultContext);

export function CardsProvider(props: Record<string, any>) {
  const discovery = useContext(DiscoveryContext);
  const stats = useContext(StatsContext);
  const [cards, setCards] = useState(defaultContext.cards);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  function hasCard(card: Card) {
    return (cards[card.id] ?? 0) > 0;
  }

  function returnCard(card: RealizedCard) {
    const newCards = {...cards};
    addRealizedCard(newCards, card);

    setCards(newCards);
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
      addRealizedCard(newCards, existingCard);
    }
    setCards(newCards);
  }

  function addRealizedCard(cards: Record<string, number>, card: RealizedCard) {
    let amount = 1;
    if (card.durability && card.maxDurability) {
      amount = card.durability / card.maxDurability;
      if (amount > 0.95) {
        amount = 1;
      }
    }
    cards[card.id] = (cards[card.id] ?? 0) + amount;
  }

  function updateInventory(cardsDelta: Record<CardId, number>) {
    if (Object.keys(cardsDelta).length <= 0) return;

    const newCardMap = {...cards};
    Object.entries(cardsDelta)
      .forEach(([cardId, amount]) => {
        newCardMap[cardId] = (newCardMap[cardId] ?? 0) + amount
      });
    setCards(newCardMap);
  }

  function buyPack(cardPack: CardPack) {
    if (stats.resources[ResourceType.Gold] < cardPack.cost) return;

    stats.useResource(ResourceType.Gold, cardPack.cost);

    const cardsFromPack = generateCards(cardPack);
    discovery.discoverCards(cardsFromPack);

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
        setSelectedCard, hasCard, returnCard, replaceCard, updateInventory, buyPack,
      }}
      {...props}
    />
  );
}
