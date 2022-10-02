import { createLens } from "@dhmk/zustand-lens";

import global from "../config/global";
import { Card, CardId, MyCreateLens, PrestigeEffects, RealizedCard } from "../shared/types";
import { DiscoverySlice } from "./discovery";
import { FullStore } from ".";

export interface CardsSlice {
  cards: Record<CardId, number>,
  selectedCard: Card | null,
  setSelectedCard: (card: Card) => void,
  hasCard: (card: Card) => boolean,
  returnCard: (card: RealizedCard) => void,
  spendCard: (card: Card) => void,
  replaceCard: (existingCard: RealizedCard | null) => void,
  updateInventory: (cardsDelta: Record<CardId, number>) => void,
  drawCards: (cardsToDraw: Card[]) => void,
  prestigeReset: (prestigeEffects: PrestigeEffects) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
}

const KEY = 'cards';
const createCardsLens: MyCreateLens<FullStore, CardsSlice, [DiscoverySlice]> = (set, get, discovery) => {
  const [_set, _get] = createLens(set, get, KEY);

  function removeCard(id: string) {
    const newCards = { ..._get().cards };
    newCards[id] = (newCards[id] ?? 0) - 1;
    if (newCards[id] < 0) {
      newCards[id] = 0;
    }
    return newCards;
  }

  return {
    key: KEY,
    slice: {
      cards: global.startingCards,
      selectedCard: null,

      setSelectedCard: (card) => {
        _set({selectedCard: card});
      },

      hasCard: (card) => false,

      returnCard: (card) => {},

      spendCard: (card) => {},

      replaceCard: (card) => {
        const selected = _get().selectedCard;
        if (selected == null) {
          return;
        }

        const newCards = removeCard(selected.id);
        if (card != null) {
          addRealizedCard(newCards, card);
        }
        _set({cards: newCards});
      },

      updateInventory: (cardsDelta) => {},

      drawCards: (cardsToDraw) => {
        discovery.discoverCards(cardsToDraw);

        const newCards = { ..._get().cards };
        cardsToDraw.forEach(card => {
          newCards[card.id] = (newCards[card.id] ?? 0) + 1;
        });
        _set({cards: newCards});
      },

      prestigeReset: (prestigeEffects) => {},

      getSaveData: () => ({}),

      loadSaveData: (data) => false,
    }
  }
};

function addRealizedCard(cards: Record<string, number>, card: RealizedCard) {
  let amount = 1;
  if (card.durability !== undefined && card.maxDurability) {
    amount = card.durability / card.maxDurability;
    if (amount > 0.95) {
      amount = 1;
    }
  }
  cards[card.id] = (cards[card.id] ?? 0) + amount;
}

export default createCardsLens;