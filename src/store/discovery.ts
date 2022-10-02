import { createLens } from "@dhmk/zustand-lens";

import global from "../config/global";
import { Card, MyCreateLens, PrestigeEffects, ResourceType } from "../shared/types";
import cardPacks from "../config/card-packs";
import { FullStore } from ".";

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

const KEY = "discovery";
const createDiscoveryLens: MyCreateLens<FullStore, DiscoverySlice, []> = (set, get) => {
  const [_set, _get] = createLens(set, get, KEY);
  return {
    key: KEY,
    slice: {
      discoveredCards: initialCards,
      cardsDiscoveredThisPrestige: initialCardsThisPrestige,
      discoveredCardPacks: initialCardPacks,
      discoveredResources: {
        [ResourceType.Gold]: true,
      },

      discoverCards: (cards) => {
        if (cards.length <= 0) return;

        const cardIds = cards.map(c => c.id);

        const newDiscovered = {..._get().discoveredCards};
        addToDiscoverMap(newDiscovered, cardIds);
        _set({discoveredCards: newDiscovered});

        const newDiscoveredThisPrestige = {..._get().cardsDiscoveredThisPrestige};
        addToDiscoverMap(newDiscoveredThisPrestige, cardIds);
        _set({cardsDiscoveredThisPrestige: newDiscoveredThisPrestige});
      },

      discoverResources: (resources) => {console.log('fuck')},
      prestigeReset: (startingCards, prestigeEffects) => {console.log('fuck')},
      prestigeUpdate: (effects) => {console.log('fuck')},
      getSaveData: () => ({}),
      loadSaveData: (data) => false,
    }
  };
};
    

function addToDiscoverMap<K extends string | symbol>(map: Record<K, boolean>, keys: K[]) {
  keys.forEach(k => {
    map[k] = true;
  });
}

export default createDiscoveryLens;