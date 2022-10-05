import { cloneDeep } from "lodash";

import { Grid, MyCreateSlice, PrestigeEffects, RealizedCard } from "../shared/types";
import { CardsSlice } from "./cards";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { updateGrid, updateGridTotals, UpdateGridTotalsResults } from "../gamelogic/abilities";
import { StatsSlice } from "./stats";
import { DiscoverySlice } from "./discovery";
import { CardMasterySlice } from "./card-mastery";

export interface GridSlice {
  gridSpaces: Grid,
  prestigeEffects: PrestigeEffects,
  replaceCard: (x: number, y: number, newCard: RealizedCard) => void,
  returnCard: (x: number, y: number) => void,
  update: (elapsed: number) => void,
  prestigeReset: () => void,
  prestigeUpdate: (effects: PrestigeEffects) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => any,
}

const createGridSlice: MyCreateSlice<GridSlice, [() => DiscoverySlice, () => StatsSlice, () => CardsSlice, () => CardMasterySlice]>
 = (set, get, discovery, stats, cards, cardMastery) => {

  function replaceCard(x: number, y: number, newCard: RealizedCard | null) {
    const newGridSpaces = [ ...get().gridSpaces ];
    const oldCard = newGridSpaces[y][x];
    newGridSpaces[y][x] = newCard;

    const results = updateGridTotals(newGridSpaces, stats(), cardMastery().cardMasteries);
    set({gridSpaces: newGridSpaces});
    stats().updatePerSec(results.resourcesPerSec);

    if (oldCard) {
      cards().returnCard(oldCard);
    }
  }

  return {
    gridSpaces: getEmptyGrid(),
    prestigeEffects: cloneDeep(DEFAULT_EFFECTS),

    update: (elapsed) => {
      const results = updateGrid(
        get().gridSpaces,
        stats().resources,
        cards().cards,
        get().prestigeEffects,
        cardMastery().cardMasteries,
        elapsed
      );

      if (results.newCards.length > 0) {
        discovery().discoverCards(results.newCards);
      }

      let totalResults: UpdateGridTotalsResults | null = null;
      if (results.anyChanged) {
        totalResults = updateGridTotals(results.grid, stats(), cardMastery().cardMasteries);
        results.grid = totalResults.grid;
      }
      stats().update(elapsed, totalResults?.resourcesPerSec ?? null, results.grid);

      set({gridSpaces: results.grid});

      if (Object.keys(results.inventoryDelta).length > 0) {
        cards().updateInventory(results.inventoryDelta);
      }
    },

    replaceCard: (x, y, newCard) => {
      replaceCard(x, y, newCard);
    },

    returnCard: (x, y) => {
      replaceCard(x, y, null);
    },

    prestigeReset: () => {},
    prestigeUpdate: (effects) => {},
    getSaveData: () => ({}),
    loadSaveData: (data) => {},
  }
};

const WIDTH = 5;
const HEIGHT = 5;

function getEmptyGrid() {
  const gridSpaces = [];
  for (let i = 0; i < HEIGHT; ++i) {
    const row: (RealizedCard | null)[] = [];
    for (let j = 0; j < WIDTH; ++j) {
      row.push(null);
    }
    gridSpaces.push(row);
  }
  return gridSpaces;
}

export default createGridSlice;