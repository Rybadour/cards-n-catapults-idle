import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";
import createCardMasterySlice, { CardMasterySlice } from "./card-mastery";
import createCardPacksSlice, { CardPacksSlice } from "./card-packs";
import createCardsSlice, { CardsSlice } from "./cards";

import createDiscoverySlice, { DiscoverySlice } from "./discovery";
import createGridSlice, { GridSlice } from "./grid";
import createPrestigeSlice, { PrestigeSlice } from "./prestige";
import createSavingLoadingSlice, { SavingLoadingSlice } from "./saving-loading";
import createStatsSlice, { StatsSlice } from "./stats";

export type FullStore = {
  discovery: DiscoverySlice,
  stats: StatsSlice
  cards: CardsSlice,
  cardMastery: CardMasterySlice,
  grid: GridSlice,
  cardPacks: CardPacksSlice,
  prestige: PrestigeSlice,
  savingLoading: SavingLoadingSlice,
}

const useStore = create<FullStore>((set, get) => {
  const discovery = createLens(set, get, 'discovery');
  const stats = createLens(set, get, 'stats');
  const cards = createLens(set, get, 'cards');
  const cardMastery = createLens(set, get, 'cardMastery');
  const grid = createLens(set, get, 'grid');
  const cardPacks = createLens(set, get, 'cardPacks');
  const prestige = createLens(set, get, 'prestige');
  const savingLoading = createLens(set, get, 'savingLoading');

  return {
    discovery: createDiscoverySlice(...discovery),
    stats: createStatsSlice(...stats, discovery[1]),
    cards: createCardsSlice(...cards, discovery[1]),
    cardMastery: createCardMasterySlice(...cardMastery, cards[1]),
    grid: createGridSlice(...grid, discovery[1], stats[1], cards[1], cardMastery[1]),
    cardPacks: createCardPacksSlice(...cardPacks, stats[1], cards[1]),
    prestige: createPrestigeSlice(...prestige, stats[1], discovery[1], cards[1], grid[1], cardPacks[1]),
    savingLoading: createSavingLoadingSlice(
      ...savingLoading, stats[1], prestige[1], discovery[1], grid[1], cards[1], cardPacks[1], cardMastery[1]
    )
  }
});

export default useStore;