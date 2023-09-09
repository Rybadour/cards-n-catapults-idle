import { mapValues, pick } from "lodash";

import global from "../config/global";
import { ResourceType } from "../shared/types";
import { MyCreateSlice } from ".";
import { PrestigeUpgrade } from "../config/prestige-upgrades";
import { CardId } from "../config/cards";

const DEFAULT_UPGRADES: string[] = [];

export interface DiscoverySlice {
  discoveredCards: Partial<Record<CardId, boolean>>,
  unlockedCards: Partial<Record<CardId, boolean>>,
  cardsDiscoveredThisPrestige: Partial<Record<CardId, boolean>>,
  discoveredUpgrades: Partial<Record<string, boolean>>,
  discoveredResources: Partial<Record<ResourceType, boolean>>,
  discoverCards: (cards: CardId[]) => void,
  unlockCards: (card: CardId[]) => void,
  discoverResources: (resources: ResourceType[]) => void,
  prestigeReset: (prestigeUpgrades: PrestigeUpgrade[]) => void,
  prestigeUpdate: () => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
  completeReset: () => void,
}

const createDiscoverySlice: MyCreateSlice<DiscoverySlice, []> = (set, get): DiscoverySlice => {
  return {
    discoveredCards: addToDiscoverMap({}, Object.keys(global.startingCards)),
    unlockedCards: {},
    cardsDiscoveredThisPrestige: addToDiscoverMap({}, Object.keys(global.startingCards)),
    discoveredUpgrades: addToDiscoverMap({}, DEFAULT_UPGRADES),
    discoveredResources: mapValues(global.startingResources, (_) => true),

    discoverCards: (cardIds) => {
      if (cardIds.length <= 0) return;

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

    prestigeReset: (prestigeUpgrades) => {
      // noop
    },

    prestigeUpdate: () => {
      // noop
    },

    completeReset: () => {
      set({
        discoveredCards: addToDiscoverMap({}, Object.keys(global.startingCards)),
        cardsDiscoveredThisPrestige: addToDiscoverMap({}, Object.keys(global.startingCards)),
        discoveredUpgrades: addToDiscoverMap({}, DEFAULT_UPGRADES),
      });
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

function addToDiscoverMap<K extends string | symbol>(map: Partial<Record<K, boolean>>, keys: K[]) {
  const newMap = {...map};
  keys.forEach(k => {
    newMap[k] = true;
  });
  return newMap;
}

export default createDiscoverySlice;