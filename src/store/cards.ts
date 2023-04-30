import { mapValues } from "lodash";
import { MyCreateSlice } from ".";
import allCardsConfig from "../config/cards";
import global from "../config/global";
import { createCard } from "../gamelogic/grid-cards";
import { Card, CardId, CardTracking, PrestigeEffects, RealizedCard, ResourceType } from "../shared/types";
import { getExponentialValue } from "../shared/utils";
import { CardDefsSlice } from "./card-definitions";
import { DiscoverySlice } from "./discovery";
import { StatsSlice } from "./stats";

export interface CardsSlice {
  cards: Record<CardId, CardTracking>,
  selectedCard: CardId | null,
  setSelectedCard: (card: CardId) => void,
  canAffordCard: (id: CardId) => boolean,
  buyCard: (id: CardId) => RealizedCard,
  returnCard: (card: RealizedCard) => void,
  updateInventory: (cardsDelta: Record<CardId, number>) => void,
  prestigeReset: (prestigeEffects: PrestigeEffects) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
}

const createCardsSlice: MyCreateSlice<CardsSlice, [() => DiscoverySlice, () => StatsSlice, () => CardDefsSlice]>
= (set, get, discovery, stats, cardDefs) => {
  return {
    cards: mapValues(allCardsConfig, (card) => ({
      numPurchased: 0,
      numActive: 0,
      cost: card.baseCost,
    })),
    selectedCard: null,

    setSelectedCard: (cardId) => {
      set({selectedCard: cardId});
    },

    canAffordCard: (id: CardId) => {
      const tracking = get().cards[id];
      return stats().canAfford({[ResourceType.Gold]: tracking?.cost});
    },

    buyCard: (id) => {
      const newCards = {...get().cards};
      const tracking = {...newCards[id]};
      const cardDef = cardDefs().defs[id];
      tracking.numActive += 1;
      updateCost(cardDef, tracking);
      newCards[id] = tracking;
      set({cards: newCards});

      stats().useResource(ResourceType.Gold, tracking.cost);

      return createCard(cardDefs().defs[id]);
    },

    returnCard: (card) => {
      const newCards = {...get().cards};
      const tracking = {...newCards[card.cardId]};
      const cardDef = cardDefs().defs[card.cardId];
      tracking.numActive -= 1;
      updateCost(cardDef, tracking);
      newCards[card.cardId] = tracking;
      set({cards: newCards});

      stats().useResource(ResourceType.Gold, -tracking.cost);
    },

    updateInventory: (cardsDelta) => {
      if (Object.keys(cardsDelta).length <= 0) return;

      const newCards = {...get().cards};
      Object.entries(cardsDelta)
        .forEach(([cardId, amount]) => {
          newCards[cardId].numPurchased += amount;
          updateCost(cardDefs().defs[cardId], newCards[cardId]);
        });
      set({cards: newCards});
    },

    prestigeReset: (prestigeEffects) => {
      // TODO: Extra start cards?
      discovery().prestigeReset(prestigeEffects);
    },

    getSaveData: () => ({cards: get().cards}),

    loadSaveData: (data) => {
      if (typeof data !== 'object') return false;

      set({cards: data.cards});

      return true;
    },
  }
};

function updateCost(cardDef: Card, tracking: CardTracking) {
  tracking.cost = getExponentialValue(cardDef.baseCost, cardDef.costGrowth, tracking.numActive + tracking.numPurchased);
}

export default createCardsSlice;