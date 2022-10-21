import { pick } from "lodash";

import { defaultResourcesMap, Grid, MyCreateSlice, PrestigeEffects, RealizedCard } from "../shared/types";
import { CardsSlice } from "./cards";
import { updateGrid, updateGridTotals, UpdateGridTotalsResults } from "../gamelogic/abilities";
import { StatsSlice } from "./stats";
import { DiscoverySlice } from "./discovery";
import { createCard } from "../gamelogic/grid-cards";
import cardsConfig from "../config/cards";
import { CardDefsSlice } from "./card-definitions";

export interface GridSlice {
  gridSpaces: Grid,
  replaceCard: (x: number, y: number, newCard: RealizedCard) => void,
  returnCard: (x: number, y: number) => void,
  update: (elapsed: number) => void,
  clearGrid: () => void,
  prestigeReset: () => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => any,
}

const createGridSlice: MyCreateSlice<GridSlice, [
  () => DiscoverySlice, () => CardDefsSlice, () => StatsSlice, () => CardsSlice
]> = (set, get, discovery, cardDefs, stats, cards) => {

  function replaceCard(x: number, y: number, newCard: RealizedCard | null) {
    const newGridSpaces = [ ...get().gridSpaces ];
    const oldCard = newGridSpaces[y][x];
    newGridSpaces[y][x] = newCard;

    const results = updateGridTotals(newGridSpaces, cardDefs().defs, stats());
    set({gridSpaces: newGridSpaces});
    stats().updatePerSec(results.resourcesPerSec);

    if (oldCard) {
      cards().returnCard(oldCard);
    }
  }

  return {
    gridSpaces: getEmptyGrid(),

    update: (elapsed) => {
      const results = updateGrid(
        get().gridSpaces,
        stats().resources,
        cardDefs().defs,
        cards().cards,
        elapsed
      );

      if (results.newCards.length > 0) {
        discovery().discoverCards(results.newCards);
      }

      let totalResults: UpdateGridTotalsResults | null = null;
      if (results.anyChanged) {
        totalResults = updateGridTotals(results.grid, cardDefs().defs, stats());
        results.grid = totalResults.grid;
      }
      stats().update(elapsed, totalResults?.resourcesPerSec ?? null);

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

    clearGrid: () => {
      const returnedCards: Record<string, number> = {};
      get().gridSpaces.forEach((row, y) => {
        row.forEach((card, x) => {
          if (card) {
            returnedCards[card.cardId] = (returnedCards[card.cardId] ?? 0) + 1;
          }
        })
      });

      cards().updateInventory(returnedCards);
      set({gridSpaces: getEmptyGrid()});

      stats().update(0, defaultResourcesMap);
    },

    prestigeReset: () => {
      set({gridSpaces: getEmptyGrid()});
    },

    getSaveData: () => {
      const gridData: any[] = [];
      get().gridSpaces.forEach((row, y) => {
        row.forEach((card, x) => {
          if (card) {
            gridData.push({
              x, y,
              card: pick(card, ['cardId', 'shouldBeReserved', 'isExpiredAndReserved', 'durability', 'timeLeftMs'])
            });
          }
        });
      })
      return gridData;
    },

    loadSaveData: (data) => {
      if (!Array.isArray(data)) return false;
      if (data.length == 0) return true;
      if (typeof data[0] !== 'object' && data[0].card) return false;

      const newGridSpaces = getEmptyGrid();
      data.forEach((space) => {
        newGridSpaces[space.y][space.x] = {
          ...createCard(cardsConfig[space.card.cardId], 0),
          ...space.card
        };
      });

      const results = updateGridTotals(newGridSpaces, cardDefs().defs, stats());

      set({gridSpaces: results.grid});
      stats().updatePerSec(results.resourcesPerSec);
    },
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