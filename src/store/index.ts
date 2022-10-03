import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";
import { CardPacksSlice } from "./card-packs";
import createCardsSlice, { CardsSlice } from "./cards";

import createDiscoverySlice, { DiscoverySlice } from "./discovery";
import { GridSlice } from "./grid";
import { StatsSlice } from "./stats";

export type FullStore = {
  discovery: DiscoverySlice,
  stats: StatsSlice
  cards: CardsSlice,
  grid: GridSlice,
  cardPacks: CardPacksSlice,
}

const useStore = create<FullStore>((set, get) => {
  const discovery = createLens(set, get, 'discovery');
  const stats = createLens(set, get, 'stats');
  const cards = createLens(set, get, 'cards');
  const grid = createLens(set, get, 'cards');
  const cardPacks = createLens(set, get, 'cards');

  return {
    discovery: createDiscoverySlice(...discovery),
    stats: createStatsSlice(...stats),
    cards: createCardsSlice(...cards, discovery[1]),
    grid: createGridSlice(...grid, cards[1]),
    cardPacks: createCardPacksSlice(...cardPacks, stats[1], cards[1]),
  }
});

export default useStore;