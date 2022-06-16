/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react";
import global from "../config/global";
import { Card, ResourceType } from "../shared/types";

export type DiscoveryContext = {
  discoveredCards: Record<string, boolean>,
  discoveredResources: Partial<Record<ResourceType, boolean>>,
  discoverCards: (cards: Card[]) => void,
  discoverResources: (resources: ResourceType[]) => void,
};

const defaultContext: DiscoveryContext = {
  discoveredCards: {},
  discoveredResources: {
    [ResourceType.Gold]: true,
  },
  discoverCards: (cards) => {},
  discoverResources: (resources) => {},
};

Object.keys(global.startingCards)
  .forEach(cardId => {
    defaultContext.discoveredCards[cardId] = true;
  })

export const DiscoveryContext = createContext(defaultContext);

export function DiscoveryProvider(props: Record<string, any>) {
  const [discoveredCards, setDiscoveredCards] = useState(defaultContext.discoveredCards);
  const [discoveredResources, setDiscoveredResources] = useState(defaultContext.discoveredResources);

  function discoverCards(cards: Card[]) {
    if (cards.length <= 0) return;

    const newDiscover = {...discoveredCards};
    cards.forEach(card => {
      newDiscover[card.id] = true;
    });
    setDiscoveredCards(newDiscover);
  }

  function discoverResources(resources: ResourceType[]) {
    const newDiscover = {...discoveredResources};
    resources.forEach(resource => {
      newDiscover[resource] = true;
    });
    setDiscoveredResources(newDiscover);
  }

  return (
    <DiscoveryContext.Provider
      value={{
        discoveredCards, discoveredResources,
        discoverCards, discoverResources,
      }}
      {...props}
    />
  );
}
