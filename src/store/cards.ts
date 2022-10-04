import global from "../config/global";
import { createCard } from "../gamelogic/grid-cards";
import { Card, CardId, MyCreateSlice, PrestigeEffects, RealizedCard } from "../shared/types";
import { DiscoverySlice } from "./discovery";

export interface CardsSlice {
  cards: Record<CardId, number>,
  selectedCard: Card | null,
  setSelectedCard: (card: Card) => void,
  hasCard: (card: Card) => boolean,
  returnCard: (card: RealizedCard) => void,
  spendCard: (card: Card) => void,
  takeSelectedCard: () => RealizedCard | null,
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

    hasCard: (card) => (get().cards[card.id] ?? 0) > 0,

    returnCard: (card) => {
      const newCards = {...get().cards};
      addRealizedCard(newCards, card);

      set({cards: newCards});
    },

    takeSelectedCard: () => {
      const selected = get().selectedCard;
      if (selected == null || (get().cards[selected.id] ?? 0) <= 0) {
        return null;
      }

      const newCards = removeCard(selected.id);
      set({cards: newCards});

      const newCard = createCard(selected, get().cards[selected.id]);
      return newCard;
    },

    spendCard: (card) => {
      set({cards: removeCard(card.id)});
    },

    updateInventory: (cardsDelta) => {
      if (Object.keys(cardsDelta).length <= 0) return;

      const newCardMap = {...get().cards};
      Object.entries(cardsDelta)
        .forEach(([cardId, amount]) => {
          newCardMap[cardId] = (newCardMap[cardId] ?? 0) + amount
        });
      set({cards: newCardMap});
    },

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