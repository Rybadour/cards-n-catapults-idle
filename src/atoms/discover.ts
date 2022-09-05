import { atom, useRecoilTransaction_UNSTABLE } from "recoil";
import { conduit } from "../shared/recoil-extensions";
import { Card } from "../shared/types";

export const discoveredCardsAtom = atom<Record<string, boolean>>({
  key: 'discoveredCards',
  default: {},
});

export const cardsDiscoveredThisPrestigeAtom = atom<Record<string, boolean>>({
  key: 'cardsDiscoveredThisPrestige',
  default: {},
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