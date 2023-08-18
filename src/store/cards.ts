import { mapValues, uniq, uniqBy } from "lodash";
import { MyCreateSlice } from ".";
import allCardsConfig from "../config/cards";
import global from "../config/global";
import { createCard } from "../gamelogic/grid-cards";
import { Card, CardId, CardTracking, CardType, PrestigeUpgrade, RealizedCard, ResourceType, defaultResourcesMap } from "../shared/types";
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
  useCard: (id: CardId) => RealizedCard,
  sellCard: (card: RealizedCard) => void,
  sellCards: (card: RealizedCard[]) => void,
  updateInventory: (cardsDelta: Record<CardId, number>, expiredCards: Record<CardId, number>) => void,
  prestigeReset: (prestigeUpgrades: PrestigeUpgrade[]) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
}

const createCardsSlice: MyCreateSlice<CardsSlice, [() => DiscoverySlice, () => StatsSlice, () => CardDefsSlice]>
= (set, get, discovery, stats, cardDefs) => {
  function sellCards(cards: RealizedCard[]) {
    const newCards = {...get().cards};
    const providedResources = {...defaultResourcesMap};

    cards.forEach((card) => {
      if (card.isExpiredAndReserved) return;

      const tracking = {...newCards[card.cardId]};
      tracking.numActive -= 1;
      const cardDef = cardDefs().defs[card.cardId];
      updateCost(cardDef, tracking);
      newCards[card.cardId] = tracking;

      let sellAmount = tracking.cost;
      if (allCardsConfig[card.cardId].type === CardType.Food) {
        sellAmount *= (card.durability ?? 0) / card.maxDurability;
      }
      providedResources[cardDef.costResource] -= sellAmount;
    });

    set({cards: newCards});
    stats().useResources(providedResources);
  }

  return {
    cards: mapValues(allCardsConfig, (card) => {
      const tracking = {
        numPurchased: global.startingCards[card.id] ?? 0,
        numActive: 0,
        cost: 0,
      };
      updateCost(card, tracking);
      return tracking;
    }),
    selectedCard: null,

    setSelectedCard: (cardId) => {
      set({selectedCard: cardId});
    },

    canAffordCard: (id: CardId) => {
      const tracking = get().cards[id];
      const cardDef = cardDefs().defs[id];
      return stats().canAfford({[cardDef.costResource]: tracking?.cost});
    },

    buyCard: (id) => {
      const newCards = {...get().cards};
      const tracking = {...newCards[id]};
      const cardDef = cardDefs().defs[id];

      stats().useResource(cardDef.costResource, tracking.cost);

      tracking.numActive += 1;
      updateCost(cardDef, tracking);
      newCards[id] = tracking;
      set({cards: newCards});

      return createCard(cardDefs().defs[id]);
    },

    useCard: (id) => {
      const newCards = {...get().cards};
      const tracking = {...newCards[id]};
      const cardDef = cardDefs().defs[id];
      tracking.numActive += 1;
      tracking.numPurchased -= 1;
      updateCost(cardDef, tracking);

      newCards[id] = tracking;
      set({cards: newCards});

      return createCard(cardDefs().defs[id]);
    },

    sellCard: (card) => {
      sellCards([card]);
    },

    sellCards: (cards) => {
      sellCards(cards);
    },

    updateInventory: (cardsDelta, expiredCards) => {
      if (Object.keys(cardsDelta).length + Object.keys(expiredCards).length <= 0) return;

      const newCards = {...get().cards};
      Object.entries(cardsDelta)
        .forEach(([cardId, amount]) => {
          newCards[cardId].numPurchased += amount;
          updateCost(cardDefs().defs[cardId], newCards[cardId]);
        });
      Object.entries(expiredCards)
        .forEach(([cardId, amount]) => {
          newCards[cardId].numActive -= amount;
          updateCost(cardDefs().defs[cardId], newCards[cardId]);
        });
      set({cards: newCards});
    },

    prestigeReset: (prestigeUpgrades) => {
      // TODO: Extra start cards?
      //discovery().prestigeReset(prestigeEffects);
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