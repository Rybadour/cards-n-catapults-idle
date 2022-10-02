import { atom } from "recoil";
import cardPacks from "../config/card-packs";
import global from "../config/global";
import { conduit } from "../shared/recoil-extensions";
import { Card, CardPack, PrestigeEffects, ResourceType } from "../shared/types";

const defaultDiscoveredCards = {}
const defaultCardsDiscoveredThisPrestige = {};
const defaultDiscoveredCardPacks = {};
addToDiscoverMap(defaultDiscoveredCards, Object.keys(global.startingCards));
addToDiscoverMap(defaultCardsDiscoveredThisPrestige, Object.keys(global.startingCards));
addToDiscoverMap(defaultDiscoveredCardPacks, global.unlockedPacks);
addCardPacks(defaultDiscoveredCardPacks, Object.values(cardPacks));

export const discoveredCardsAtom = atom<Record<string, boolean>>({
  key: 'discoveredCards',
  default: defaultDiscoveredCards,
});

export const cardsDiscoveredThisPrestigeAtom = atom<Record<string, boolean>>({
  key: 'cardsDiscoveredThisPrestige',
  default: defaultCardsDiscoveredThisPrestige,
});

export const discoveredCardPacksAtom = atom<Record<string, boolean>>({
  key: 'discoveredCardPacks',
  default: defaultDiscoveredCardPacks,
});

export const discoveredResourcesAtom = atom<Partial<Record<ResourceType, boolean>>>({
  key: 'discoveredResources',
  default: {
    [ResourceType.Gold]: true,
  },
})

export const discoverCardsAction = conduit<Card[]>(({set}, cards: Card[]) => {
  if (cards.length <= 0) return;

  const cardIds = cards.map(c => c.id);

  set(discoveredCardsAtom, dc => {
    const newDc = {...dc};
    addToDiscoverMap(newDc, cardIds);
    return newDc;
  });

  set(cardsDiscoveredThisPrestigeAtom, dc => {
    const newDc = {...dc};
    addToDiscoverMap(newDc, cardIds);
    return newDc;
  });
});

export const discoverResourcesAction = conduit<ResourceType[]>(({set}, resources: ResourceType[]) => {
  set(discoveredResourcesAtom, dr => {
    const newDr = {...dr};
    resources.forEach(resource => {
      newDr[resource] = true;
    });
    return newDr;
  });
});

export const prestigeResetAction = conduit<{
  startingCards: Record<string, number>,
  prestigeEffects: PrestigeEffects,
}>(({set}, {startingCards, prestigeEffects}) => {
  const cardIds = Object.keys(startingCards);
  set(discoveredCardsAtom, dc => {
    const newDc = {...dc};
    addToDiscoverMap(newDc, cardIds);
    return newDc;
  });

  set(cardsDiscoveredThisPrestigeAtom, dc => {
    const newDc = {...dc};
    addToDiscoverMap(newDc, cardIds);
    return newDc;
  });

  set(discoveredCardPacksAtom, dcp => {
    const newDcp = {...dcp};
    addToDiscoverMap(newDcp, prestigeEffects.unlockedCardPacks);
    return newDcp;
  });
});

function addToDiscoverMap<K extends string | symbol>(map: Record<K, boolean>, keys: K[]) {
  keys.forEach(k => {
    map[k] = true;
  });
}

function addCardPacks(map: Record<string, boolean>, newCardPacks: CardPack[]) {
  addToDiscoverMap(
    map,
    Object.values(newCardPacks)
      .filter(pack => pack.unlocked)
      .map(pack => pack.id)
  );
}