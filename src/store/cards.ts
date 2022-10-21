import global from "../config/global";
import { createCard } from "../gamelogic/grid-cards";
import { Card, CardId, MyCreateSlice, PrestigeEffects, RealizedCard } from "../shared/types";
import { CardDefsSlice } from "./card-definitions";
import { DiscoverySlice } from "./discovery";

export interface CardsSlice {
  cards: Record<CardId, number>,
  selectedCard: CardId | null,
  setSelectedCard: (card: CardId) => void,
  hasCard: (card: Card) => boolean,
  returnCard: (card: RealizedCard) => void,
  spendCards: (card: Card, num: number) => void,
  takeSelectedCard: () => RealizedCard | null,
  updateInventory: (cardsDelta: Record<CardId, number>) => void,
  drawCards: (cardsToDraw: Card[]) => void,
  prestigeReset: (prestigeEffects: PrestigeEffects) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
}

const createCardsSlice: MyCreateSlice<CardsSlice, [() => DiscoverySlice, () => CardDefsSlice]>
= (set, get, discovery, cardDefs) => {
  function removeCard(id: string, num = 1) {
    const newCards = { ...get().cards };
    newCards[id] = (newCards[id] ?? 0) - num;
    if (newCards[id] < 0) {
      newCards[id] = 0;
    }
    return newCards;
  }

  function getCardDef(card: RealizedCard) {
    return cardDefs().defs[card.cardId];
  }

  return {
    cards: global.startingCards,
    selectedCard: null,

    setSelectedCard: (cardId) => {
      set({selectedCard: cardId});
    },

    hasCard: (card) => (get().cards[card.id] ?? 0) > 0,

    returnCard: (card) => {
      const newCards = {...get().cards};
      addRealizedCard(newCards, card, getCardDef(card));

      set({cards: newCards});
    },

    takeSelectedCard: () => {
      const selected = get().selectedCard;
      if (selected == null || (get().cards[selected] ?? 0) <= 0) {
        return null;
      }

      const newCard = createCard(cardDefs().defs[selected], get().cards[selected]);

      set({cards: removeCard(selected)});

      return newCard;
    },

    spendCards: (card, num) => {
      set({cards: removeCard(card.id, num)});
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

    prestigeReset: (prestigeEffects) => {
      const newCards: Record<string, number> = {...global.startingCards};
      Object.entries(prestigeEffects.extraStartCards)
        .forEach(([c, amount]) => {
          newCards[c] = (newCards[c] ?? 0) + amount;
        });
      set({cards: newCards});
      discovery().prestigeReset(newCards, prestigeEffects);
    },

    getSaveData: () => ({cards: get().cards}),

    loadSaveData: (data) => {
      if (typeof data !== 'object') return false;

      set({cards: data.cards});

      return true;
    },
  }
};

function addRealizedCard(cards: Record<string, number>, card: RealizedCard, cardDef: Card) {
  let amount = 1;
  if (card.durability !== undefined && cardDef.maxDurability) {
    amount = card.durability / cardDef.maxDurability;
    if (amount > 0.95) {
      amount = 1;
    }
  }
  cards[card.cardId] = (cards[card.cardId] ?? 0) + amount;
}

export default createCardsSlice;