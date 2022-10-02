import { letterSpacing } from "@mui/system";
import { access } from "fs";
import create from "zustand";
import createCardPacksLens, { CardPacksSlice } from "./card-packs";
import createCardsLens, { CardsSlice } from "./cards";

import createDiscoveryLens, { DiscoverySlice } from "./discovery";
import createGridLens, { GridSlice } from "./grid";
import createStatsLens, { StatsSlice } from "./stats";

export type FullStore = {
  discovery: DiscoverySlice,
  stats: StatsSlice
  cards: CardsSlice,
  grid: GridSlice,
  cardPacks: CardPacksSlice,
}

const useStore = create<FullStore>((set, get) => {
  const discovery = createDiscoveryLens(set, get);
  const stats = createStatsLens(set, get);
  const cards = createCardsLens(set, get, discovery.slice);
  const grid = createGridLens(set, get, cards.slice);
  const cardPacks = createCardPacksLens(set, get, stats.slice, cards.slice);

  return {
    discovery: discovery.slice,
    stats: stats.slice,
    cards: cards.slice,
    grid: grid.slice,
    cardPacks: cardPacks.slice,
  }
});

export default useStore;