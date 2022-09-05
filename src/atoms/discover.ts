import { atom } from "recoil";
import global from "../config/global";
import { conduit } from "../shared/recoil-extensions";
import { Card } from "../shared/types";

const defaultDiscoveredCards = {}, defaultCardsDiscoveredThisPrestige = {};
addToDiscoverMap(defaultDiscoveredCards, Object.keys(global.startingCards));
addToDiscoverMap(defaultCardsDiscoveredThisPrestige, Object.keys(global.startingCards));
//addCardPacks(defaultContext.discoveredCardPacks, global.unlockedPacks);

export const discoveredCardsAtom = atom<Record<string, boolean>>({
  key: 'discoveredCards',
  default: defaultDiscoveredCards,
});

export const cardsDiscoveredThisPrestigeAtom = atom<Record<string, boolean>>({
  key: 'cardsDiscoveredThisPrestige',
  default: defaultCardsDiscoveredThisPrestige,
});

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

function addToDiscoverMap<K extends string | symbol>(map: Record<K, boolean>, keys: K[]) {
  keys.forEach(k => {
    map[k] = true;
  });
}