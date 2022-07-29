/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import cardPacks from "../config/card-packs";
import global from "../config/global";
import { Card, PrestigeEffects, ResourceType } from "../shared/types";
import { PrestigeContext } from "./prestige";

export type DiscoveryContext = {
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
};

const defaultContext: DiscoveryContext = {
  discoveredCards: {},
  cardsDiscoveredThisPrestige: {},
  discoveredCardPacks: {},
  discoveredResources: {
    [ResourceType.Gold]: true,
  },
  discoverCards: (cards) => {},
  discoverResources: (resources) => {},
  prestigeReset: (startingCards, prestigeEffects) => {},
  prestigeUpdate: (effects) => {},
  getSaveData: () => ({}),
  loadSaveData: (data) => false,
};

function addToDiscoverMap<K extends string | symbol>(map: Record<K, boolean>, keys: K[]) {
  keys.forEach(k => {
    map[k] = true;
  });
}

function addCardPacks(map: Record<string, boolean>, unlocked: string[]) {
  addToDiscoverMap(
    map,
    Object.values(cardPacks)
      .filter(pack => pack.unlocked || unlocked.includes(pack.id))
      .map(pack => pack.id)
  );
}

addToDiscoverMap(defaultContext.discoveredCards, Object.keys(global.startingCards));
addToDiscoverMap(defaultContext.cardsDiscoveredThisPrestige, Object.keys(global.startingCards));
addCardPacks(defaultContext.discoveredCardPacks, global.unlockedPacks);

export const DiscoveryContext = createContext(defaultContext);

export function DiscoveryProvider(props: Record<string, any>) {
  const [discoveredCards, setDiscoveredCards] = useState(defaultContext.discoveredCards);
  const [discoveredCardPacks, setDiscoveredCardPacks] = useState(defaultContext.discoveredCardPacks);
  const [cardsDiscoveredThisPrestige, setCardsDiscoveredThisPrestige] = useState(defaultContext.cardsDiscoveredThisPrestige);
  const [discoveredResources, setDiscoveredResources] = useState(defaultContext.discoveredResources);

  function discoverCards(cards: Card[]) {
    if (cards.length <= 0) return;

    const cardIds = cards.map(c => c.id);

    const newDiscovered = {...discoveredCards};
    addToDiscoverMap(newDiscovered, cardIds);
    setDiscoveredCards(newDiscovered);

    const newDiscoveredThisPrestige = {...cardsDiscoveredThisPrestige};
    addToDiscoverMap(newDiscoveredThisPrestige, cardIds);
    setCardsDiscoveredThisPrestige(newDiscoveredThisPrestige);
  }

  function discoverResources(resources: ResourceType[]) {
    const newDiscover = {...discoveredResources};
    resources.forEach(resource => {
      newDiscover[resource] = true;
    });
    setDiscoveredResources(newDiscover);
  }

  function prestigeReset(startingCards: Record<string, number>, prestigeEffects: PrestigeEffects) {
    const newDiscovered = {};
    addToDiscoverMap(newDiscovered, Object.keys(startingCards));
    setCardsDiscoveredThisPrestige(newDiscovered);

    const newDiscoveredPacks = {};
    addCardPacks(newDiscoveredPacks, prestigeEffects.unlockedCardPacks);
    setDiscoveredCardPacks(newDiscoveredPacks);
  }

  function prestigeUpdate(effects: PrestigeEffects) {
    const newDiscoveredPacks = {};
    addCardPacks(newDiscoveredPacks, effects.unlockedCardPacks);
    setDiscoveredCardPacks(newDiscoveredPacks);
  }

  function getSaveData() {
    return {
      discoveredCards,
      cardsDiscoveredThisPrestige,
      discoveredCardPacks,
      discoveredResources,
    };
  }

  function loadSaveData(data: any) {
    if (typeof data !== 'object') return false;

    setDiscoveredCards(data.discoveredCards);
    setDiscoveredCardPacks(data.discoveredCardPacks);
    setCardsDiscoveredThisPrestige(data.cardsDiscoveredThisPrestige);
    setDiscoveredResources(data.discoveredResources);

    return true;
  }

  return (
    <DiscoveryContext.Provider
      value={{
        discoveredCards, cardsDiscoveredThisPrestige, discoveredCardPacks, discoveredResources,
        discoverCards, discoverResources, prestigeReset, prestigeUpdate, getSaveData, loadSaveData,
      }}
      {...props}
    />
  );
}
