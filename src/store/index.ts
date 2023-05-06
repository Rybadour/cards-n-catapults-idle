import { StoreApi } from "zustand";
import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";

import createCardDefsSlice, { CardDefsSlice } from "./card-definitions";
import createCardsSlice, { CardsSlice } from "./cards";
import createCombatSlice, { CombatSlice } from "./combat";
import createDiscoverySlice, { DiscoverySlice } from "./discovery";
import createGridSlice, { CardGridsSlice } from "./card-grids";
import createPrestigeSlice, { PrestigeSlice } from "./prestige";
import createSavingLoadingSlice, { SavingLoadingSlice } from "./saving-loading";
import createScenesSlice, { ScenesSlice } from "./scenes";
import createStatsSlice, { StatsSlice } from "./stats";
import createUpgradesSlice, { UpgradesSlice } from "./upgrades";

export type FullStore = {
  cardDefs: CardDefsSlice,
  cards: CardsSlice,
  cardGrids: CardGridsSlice,

  upgrades: UpgradesSlice,

  combat: CombatSlice,

  stats: StatsSlice,
  discovery: DiscoverySlice,
  prestige: PrestigeSlice,
  savingLoading: SavingLoadingSlice,
  scenes: ScenesSlice,
}

const useStore = create<FullStore>((set, get) => {
  const cardDefs = createLens(set, get, 'cardDefs');
  const cards = createLens(set, get, 'cards');
  const cardGrids = createLens(set, get, 'cardGrids');

  const upgrades = createLens(set, get, 'upgrades');

  const combat = createLens(set, get, 'combat');

  const stats = createLens(set, get, 'stats');
  const discovery = createLens(set, get, 'discovery');
  const prestige = createLens(set, get, 'prestige');
  const savingLoading = createLens(set, get, 'savingLoading');
  const scenes = createLens(set, get, 'scenes');

  return {
    discovery: createDiscoverySlice(...discovery),
    stats: createStatsSlice(...stats, discovery[1]),
    cardDefs: createCardDefsSlice(...cardDefs, cardGrids[1]),
    cards: createCardsSlice(...cards, discovery[1], stats[1], cardDefs[1]),
    cardGrids: createGridSlice(...cardGrids, discovery[1], cardDefs[1], stats[1], cards[1]),

    upgrades: createUpgradesSlice(...upgrades, stats[1], cardDefs[1]),

    prestige: createPrestigeSlice(
      ...prestige, stats[1], discovery[1], cardDefs[1], cards[1], cardGrids[1]
    ),
    savingLoading: createSavingLoadingSlice(
      ...savingLoading, stats[1], prestige[1], discovery[1], cardGrids[1], cards[1]
    ),
    combat: createCombatSlice(...combat, cardGrids[1], stats[1], cards[1], discovery[1]),
    scenes: createScenesSlice(...scenes),
  }
});

export default useStore;

export type Lens<T> = [set: StoreApi<T>['setState'], get: StoreApi<T>['getState']];

export type MyCreateSlice<T, A extends (() => any)[]> =
  (set: StoreApi<T>['setState'], get: StoreApi<T>['getState'], ...args: A) => T