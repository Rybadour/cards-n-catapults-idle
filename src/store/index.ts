import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";

import createCardDefsSlice, { CardDefsSlice } from "./card-definitions";
import createCardMasterySlice, { CardMasterySlice } from "./card-mastery";
import createCardPacksSlice, { CardPacksSlice } from "./card-packs";
import createCardsSlice, { CardsSlice } from "./cards";
import createCombatSlice, { CombatSlice } from "./combat";
import createDiscoverySlice, { DiscoverySlice } from "./discovery";
import createGridSlice, { GridSlice } from "./grid";
import createPrestigeSlice, { PrestigeSlice } from "./prestige";
import createSavingLoadingSlice, { SavingLoadingSlice } from "./saving-loading";
import createScenesSlice, { ScenesSlice } from "./scenes";
import createStatsSlice, { StatsSlice } from "./stats";

export type FullStore = {
  discovery: DiscoverySlice,
  stats: StatsSlice
  cardDefs: CardDefsSlice,
  cards: CardsSlice,
  cardMastery: CardMasterySlice,
  grid: GridSlice,
  cardPacks: CardPacksSlice,
  prestige: PrestigeSlice,
  savingLoading: SavingLoadingSlice,
  combat: CombatSlice,
  scenes: ScenesSlice,
}

const useStore = create<FullStore>((set, get) => {
  const discovery = createLens(set, get, 'discovery');
  const stats = createLens(set, get, 'stats');
  const cardDefs = createLens(set, get, 'cardDefs');
  const cards = createLens(set, get, 'cards');
  const cardMastery = createLens(set, get, 'cardMastery');
  const grid = createLens(set, get, 'grid');
  const cardPacks = createLens(set, get, 'cardPacks');
  const prestige = createLens(set, get, 'prestige');
  const savingLoading = createLens(set, get, 'savingLoading');
  const combat = createLens(set, get, 'combat');
  const scenes = createLens(set, get, 'scenes');

  return {
    discovery: createDiscoverySlice(...discovery),
    stats: createStatsSlice(...stats, discovery[1]),
    cardDefs: createCardDefsSlice(...cardDefs, grid[1]),
    cards: createCardsSlice(...cards, discovery[1], cardDefs[1]),
    cardMastery: createCardMasterySlice(...cardMastery, cards[1], cardDefs[1]),
    grid: createGridSlice(...grid, discovery[1], cardDefs[1], stats[1], cards[1]),
    cardPacks: createCardPacksSlice(...cardPacks, stats[1], cards[1]),
    prestige: createPrestigeSlice(
      ...prestige, stats[1], discovery[1], cardDefs[1], cards[1], grid[1], cardPacks[1], cardMastery[1]
    ),
    savingLoading: createSavingLoadingSlice(
      ...savingLoading, stats[1], prestige[1], discovery[1], grid[1], cards[1], cardPacks[1], cardMastery[1]
    ),
    combat: createCombatSlice(...combat),
    scenes: createScenesSlice(...scenes),
  }
});

export default useStore;