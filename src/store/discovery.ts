import { pick } from "lodash";

import global from "../config/global";
import { Card, CardId, PrestigeEffects, ResourceType } from "../shared/types";
import cardPacks from "../config/card-packs";
import { MyCreateSlice } from ".";

export interface DiscoverySlice {
  discoveredCards: Record<string, boolean>,
  unlockedCards: Record<CardId, boolean>,
  cardsDiscoveredThisPrestige: Record<string, boolean>,
  discoveredCardPacks: Record<string, boolean>,
  discoveredResources: Partial<Record<ResourceType, boolean>>,
  discoverCards: (cards: Card[]) => void,
  unlockCards: (card: CardId[]) => void,
  discoverResources: (resources: ResourceType[]) => void,
  prestigeReset: (startingCards: Record<string, number>, prestigeEffects: PrestigeEffects) => void,
  prestigeUpdate: (effects: PrestigeEffects) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
  completeReset: () => void,
}

const DEFAULT_UNLOCKED_PACKS = [
  ...global.unlockedPacks,
  ...Object.keys(cardPacks).filter(cp => cardPacks[cp].unlocked)
];

const createDiscoverySlice: MyCreateSlice<DiscoverySlice, []> = (set, get): DiscoverySlice => {
  return {
    discoveredCards: addToDiscoverMap({}, Object.keys(global.startingCards)),
    unlockedCards: {},
    cardsDiscoveredThisPrestige: addToDiscoverMap({}, Object.keys(global.startingCards)),
    discoveredCardPacks: addToDiscoverMap({}, DEFAULT_UNLOCKED_PACKS),
    discoveredResources: {
      [ResourceType.Gold]: true,
    },

    discoverCards: (cards) => {
      if (cards.length <= 0) return;

      const cardIds = cards.map(c => c.id);
      set({
        discoveredCards: addToDiscoverMap(get().discoveredCards, cardIds),
        cardsDiscoveredThisPrestige: addToDiscoverMap(get().cardsDiscoveredThisPrestige, cardIds)
      });
    },

    unlockCards: (cards) => {
      set({
        unlockedCards: addToDiscoverMap(get().unlockedCards, cards),
      })
    },

    discoverResources: (resources) => {
      const newDiscover = {...get().discoveredResources};
      resources.forEach(resource => {
        newDiscover[resource] = true;
      });
      set({discoveredResources: newDiscover});
    },

    prestigeReset: (startingCards, prestigeEffects) => {
      set({
        cardsDiscoveredThisPrestige: addToDiscoverMap({}, Object.keys(startingCards)),
        discoveredCardPacks: addToDiscoverMap({}, [...prestigeEffects.unlockedCardPacks, ...DEFAULT_UNLOCKED_PACKS])
      });
    },

    completeReset: () => {
      set({
        discoveredCards: addToDiscoverMap({}, Object.keys(global.startingCards)),
        cardsDiscoveredThisPrestige: addToDiscoverMap({}, Object.keys(global.startingCards)),
        discoveredCardPacks: addToDiscoverMap({}, DEFAULT_UNLOCKED_PACKS)
      });
    },

    prestigeUpdate: (effects) => {
      set({discoveredCardPacks: addToDiscoverMap(get().discoveredCardPacks, effects.unlockedCardPacks)});
    },

    getSaveData: () => pick(get(), [
      'discoveredCards',
      'cardsDiscoveredThisPrestige',
      'discoveredCardPacks',
      'discoveredResources',
    ]),

    loadSaveData: (data) => {
      if (typeof data !== 'object') return false;

      set(data);

      return true;
    },
  };
}  

function addToDiscoverMap<K extends string | symbol>(map: Record<K, boolean>, keys: K[]) {
  const newMap = {...map};
  keys.forEach(k => {
    newMap[k] = true;
  });
  return newMap;
}

export default createDiscoverySlice;