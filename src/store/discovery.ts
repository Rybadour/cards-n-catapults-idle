import global from "../config/global";
import { Card, MyCreateSlice, PrestigeEffects, ResourceType } from "../shared/types";
import cardPacks from "../config/card-packs";

export interface DiscoverySlice {
  discoveredCards: Record<string, boolean>,
  cardsDiscoveredThisPrestige: Record<string, boolean>,
  discoveredCardPacks: Record<string, boolean>,
  discoveredResources: Partial<Record<ResourceType, boolean>>,
  discoverCards: (cards: Card[]) => void,
  discoverResources: (resources: ResourceType[]) => void,
  prestigeReset: (startingCards: Record<string, number>, prestigeEffects: PrestigeEffects) => void,
  prestigeUpdate: (effects: PrestigeEffects) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
}

const initialCards: DiscoverySlice['discoveredCards'] = {};
addToDiscoverMap(initialCards, Object.keys(global.startingCards));

const initialCardsThisPrestige: DiscoverySlice['cardsDiscoveredThisPrestige'] = {};
addToDiscoverMap(initialCardsThisPrestige, Object.keys(global.startingCards));

const initialCardPacks: DiscoverySlice['discoveredCardPacks'] = {};
addToDiscoverMap(initialCardPacks, global.unlockedPacks);
addToDiscoverMap(initialCardPacks, Object.keys(cardPacks).filter(cp => cardPacks[cp].unlocked));

const createDiscoverySlice: MyCreateSlice<DiscoverySlice, []> = (set, get): DiscoverySlice => {
  return {
    discoveredCards: initialCards,
    cardsDiscoveredThisPrestige: initialCardsThisPrestige,
    discoveredCardPacks: initialCardPacks,
    discoveredResources: {
      [ResourceType.Gold]: true,
    },

    discoverCards: (cards) => {
      if (cards.length <= 0) return;

      const cardIds = cards.map(c => c.id);

      const newDiscovered = {...get().discoveredCards};
      addToDiscoverMap(newDiscovered, cardIds);
      set({discoveredCards: newDiscovered});

      const newDiscoveredThisPrestige = {...get().cardsDiscoveredThisPrestige};
      addToDiscoverMap(newDiscoveredThisPrestige, cardIds);
      set({cardsDiscoveredThisPrestige: newDiscoveredThisPrestige});
    },

    discoverResources: (resources) => {
      const newDiscover = {...get().discoveredResources};
      resources.forEach(resource => {
        newDiscover[resource] = true;
      });
      set({discoveredResources: newDiscover});
    },

    prestigeReset: (startingCards, prestigeEffects) => {console.log('fuck')},
    prestigeUpdate: (effects) => {console.log('fuck')},
    getSaveData: () => ({}),
    loadSaveData: (data) => false,
  };
}  

function addToDiscoverMap<K extends string | symbol>(map: Record<K, boolean>, keys: K[]) {
  keys.forEach(k => {
    map[k] = true;
  });
}

export default createDiscoverySlice;