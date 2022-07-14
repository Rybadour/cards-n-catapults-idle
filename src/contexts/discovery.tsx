/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react";
import global from "../config/global";
import { Card, ResourceType } from "../shared/types";

export type DiscoveryContext = {
  discoveredCards: Record<string, boolean>,
  cardsDiscoveredThisPrestige: Record<string, boolean>,
  discoveredResources: Partial<Record<ResourceType, boolean>>,
  discoverCards: (cards: Card[]) => void,
  discoverResources: (resources: ResourceType[]) => void,
  prestigeReset: () => void,
};

const defaultContext: DiscoveryContext = {
  discoveredCards: {},
  cardsDiscoveredThisPrestige: {},
  discoveredResources: {
    [ResourceType.Gold]: true,
  },
  discoverCards: (cards) => {},
  discoverResources: (resources) => {},
  prestigeReset: () => {},
};

function addToDiscoverMap<K extends string | symbol>(map: Record<K, boolean>, keys: K[]) {
  keys.forEach(k => {
    map[k] = true;
  });
}

addToDiscoverMap(defaultContext.discoveredCards, Object.keys(global.startingCards));
addToDiscoverMap(defaultContext.cardsDiscoveredThisPrestige, Object.keys(global.startingCards));

export const DiscoveryContext = createContext(defaultContext);

export function DiscoveryProvider(props: Record<string, any>) {
  const [discoveredCards, setDiscoveredCards] = useState(defaultContext.discoveredCards);
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

  function prestigeReset() {
    const newDiscovered = {};
    addToDiscoverMap(newDiscovered, Object.keys(global.startingCards));
    setCardsDiscoveredThisPrestige(newDiscovered);
  }

  return (
    <DiscoveryContext.Provider
      value={{
        discoveredCards, cardsDiscoveredThisPrestige, discoveredResources,
        discoverCards, discoverResources, prestigeReset,
      }}
      {...props}
    />
  );
}
