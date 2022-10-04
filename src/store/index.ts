import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";
import createCardPacksSlice, { CardPacksSlice } from "./card-packs";
import createCardsSlice, { CardsSlice } from "./cards";

import createDiscoverySlice, { DiscoverySlice } from "./discovery";
import createGridSlice, { GridSlice } from "./grid";
import createStatsSlice, { StatsSlice } from "./stats";

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
  const grid = createLens(set, get, 'grid');
  const cardPacks = createLens(set, get, 'cardPacks');

  return {
    discovery: createDiscoverySlice(...discovery),
    stats: createStatsSlice(...stats, discovery[1]),
    cards: createCardsSlice(...cards, discovery[1]),
    grid: createGridSlice(...grid, discovery[1], stats[1], cards[1]),
    cardPacks: createCardPacksSlice(...cardPacks, stats[1], cards[1]),
  }
});

export default useStore;