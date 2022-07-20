/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import cardPacks from "../config/card-packs";
import global from "../config/global";
import { Card, ResourceType } from "../shared/types";
import { PrestigeContext } from "./prestige";

export type DiscoveryContext = {
  discoveredCards: Record<string, boolean>,
  cardsDiscoveredThisPrestige: Record<string, boolean>,
  discoveredCardPacks: Record<string, boolean>,
  discoveredResources: Partial<Record<ResourceType, boolean>>,
  discoverCards: (cards: Card[]) => void,
  discoverResources: (resources: ResourceType[]) => void,
  prestigeReset: (startingCards: Record<string, number>) => void,
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
  prestigeReset: (startingCards) => {},
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
  const prestige = useContext(PrestigeContext);
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

  function prestigeReset(startingCards: Record<string, number>) {
    const newDiscovered = {};
    addToDiscoverMap(newDiscovered, Object.keys(startingCards));
    setCardsDiscoveredThisPrestige(newDiscovered);

    const newDiscoveredPacks = {};
    addCardPacks(newDiscoveredPacks, prestige.prestigeEffects.unlockedCardPacks);
    setDiscoveredCardPacks(newDiscoveredPacks);
  }

  return (
    <DiscoveryContext.Provider
      value={{
        discoveredCards, cardsDiscoveredThisPrestige, discoveredCardPacks, discoveredResources,
        discoverCards, discoverResources, prestigeReset,
      }}
      {...props}
    />
  );
}
