import global from "../config/global";
import { Card, CardId, MyCreateSlice, PrestigeEffects, RealizedCard } from "../shared/types";
import { DiscoverySlice } from "./discovery";

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

const createCardsSlice: MyCreateSlice<CardsSlice, [() => DiscoverySlice]> = (set, get, discovery) => {
  function removeCard(id: string) {
    const newCards = { ...get().cards };
    newCards[id] = (newCards[id] ?? 0) - 1;
    if (newCards[id] < 0) {
      newCards[id] = 0;
    }
    return newCards;
  }

  return {
    cards: global.startingCards,
    selectedCard: null,

    setSelectedCard: (card) => {
      set({selectedCard: card});
    },

    hasCard: (card) => false,

    returnCard: (card) => {},

    spendCard: (card) => {},

    replaceCard: (card) => {
      const selected = get().selectedCard;
      if (selected == null) {
        return;
      }

      const newCards = removeCard(selected.id);
      if (card != null) {
        addRealizedCard(newCards, card);
      }
      set({cards: newCards});
    },

    updateInventory: (cardsDelta) => {},

    drawCards: (cardsToDraw) => {
      discovery().discoverCards(cardsToDraw);

      const newCards = { ...get().cards };
      cardsToDraw.forEach(card => {
        newCards[card.id] = (newCards[card.id] ?? 0) + 1;
      });
      set({cards: newCards});
    },

    prestigeReset: (prestigeEffects) => {},

    getSaveData: () => ({}),

    loadSaveData: (data) => false,
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

export default createCardsSlice;