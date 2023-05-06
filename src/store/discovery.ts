import { pick } from "lodash";

import global from "../config/global";
import { Card, CardId, PrestigeEffects, ResourceType } from "../shared/types";
import { MyCreateSlice } from ".";

const DEFAULT_UPGRADES: string[] = [];

export interface DiscoverySlice {
  discoveredCards: Record<string, boolean>,
  unlockedCards: Record<CardId, boolean>,
  cardsDiscoveredThisPrestige: Record<string, boolean>,
  discoveredUpgrades: Record<string, boolean>,
  discoveredResources: Partial<Record<ResourceType, boolean>>,
  discoverCards: (cards: CardId[]) => void,
  unlockCards: (card: CardId[]) => void,
  discoverResources: (resources: ResourceType[]) => void,
  prestigeReset: (prestigeEffects: PrestigeEffects) => void,
  prestigeUpdate: (effects: PrestigeEffects) => void,
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
    discoveredResources: {
      [ResourceType.Gold]: true,
    },

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

    prestigeReset: (prestigeEffects) => {
      // TODO: STarting cards!?
      set({
        cardsDiscoveredThisPrestige: addToDiscoverMap({}, Object.keys({})),
      });
    },

    completeReset: () => {
      set({
        discoveredCards: addToDiscoverMap({}, Object.keys(global.startingCards)),
        cardsDiscoveredThisPrestige: addToDiscoverMap({}, Object.keys(global.startingCards)),
        discoveredUpgrades: addToDiscoverMap({}, DEFAULT_UPGRADES),
      });
    },

    prestigeUpdate: (effects) => {
      // noop
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