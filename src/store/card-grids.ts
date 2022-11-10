import { mapValues, merge, mergeWith, pick } from "lodash";

import { defaultResourcesMap, Grid, MyCreateSlice, PrestigeEffects, RealizedCard, ResourcesMap } from "../shared/types";
import { CardsSlice } from "./cards";
import { iterateGrid, updateGrid, UpdateGridResults, updateGridTotals, UpdateGridTotalsResults } from "../gamelogic/abilities";
import { StatsSlice } from "./stats";
import { DiscoverySlice } from "./discovery";
import { createCard } from "../gamelogic/grid-cards";
import cardsConfig from "../config/cards";
import { CardDefsSlice } from "./card-definitions";
import { mergeSum } from "../shared/utils";

export interface CardGridsSlice {
  grids: Record<string, Grid>,
  gridsResourcesPerSec: Record<string, ResourcesMap>,
  updateAll: (elapsed: number) => void,
  cardDefsChanged: () => void,
  replaceCard: (gridId: string, x: number, y: number, newCard: RealizedCard) => void,
  returnCard: (gridId: string, x: number, y: number) => void,
  clearGrid: (gridId: string) => void,
  prestigeReset: () => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => any,
}

type UpdateResults = 
  Omit<Omit<UpdateGridResults, 'grid'>, 'anyChanged'> &
  Omit<UpdateGridTotalsResults, 'grid'>;

type UpdateDefsResults = Omit<UpdateGridTotalsResults, 'grid'>;

const createGridsSlice: MyCreateSlice<CardGridsSlice, [() => DiscoverySlice, () => CardDefsSlice, () => StatsSlice, () => CardsSlice]>
= (set, get, discovery, cardDefs, stats, cards) => {

  function replaceCard(gridId: string, x: number, y: number, newCard: RealizedCard | null) {
    const gridSpaces = get().grids[gridId];
    if (!gridSpaces) return;

    const newGridSpaces = [ ...gridSpaces ];
    const oldCard = newGridSpaces[y][x];
    newGridSpaces[y][x] = newCard;

    const results = updateGridTotals(newGridSpaces, cardDefs().defs, stats());
    set({grids: {...get().grids, [gridId]: newGridSpaces}});
    updateResourcesOfGrid(gridId, results.resourcesPerSec);

    if (oldCard) {
      cards().returnCard(oldCard);
    }
  }

  function updateResourcesOfGrid(gridId: string, resourcesPerSec: ResourcesMap) {
    const gridsResourcesPerSec = {...get().gridsResourcesPerSec};
    gridsResourcesPerSec[gridId] = resourcesPerSec;
    const sumOfResources = Object.values(gridsResourcesPerSec)
      .reduce((sum, resPerSec) => mergeSum(sum, resPerSec), {...defaultResourcesMap});

    stats().update(0, sumOfResources);
  }

  return {
    grids: {
      town: getEmptyGrid(),
      combat: getEmptyGrid(),
    },
    gridsResourcesPerSec: {
      town: {...defaultResourcesMap},
      combat: {...defaultResourcesMap},
    },

    updateAll: (elapsed) => {
      const resources = {...stats().resources};
      const inventory = {...cards().cards};
      const gridsResourcesPerSec = get().gridsResourcesPerSec;
      const newGrids: Record<string, Grid> = {};
      const results: UpdateResults = Object.entries(get().grids).map(([id, grid]) => {
        const gridResults = updateGrid(grid, resources, cardDefs().defs, inventory, elapsed);

        let totalResults: UpdateGridTotalsResults | null = null;
        if (gridResults.anyChanged) {
          totalResults = updateGridTotals(gridResults.grid, cardDefs().defs, stats());
          gridResults.grid = totalResults.grid;
        }

        newGrids[id] = gridResults.grid;

        return {
          gridId: id,
          ...gridResults,
          ...totalResults,
        };
      }).reduce<UpdateResults>((mergedResults, results) => {
        return {
          newCards: [...mergedResults.newCards, ...results.newCards],
          inventoryDelta: mergeSum(mergedResults.inventoryDelta, results.inventoryDelta),
          resourcesSpent: mergeSum(mergedResults.resourcesSpent, results.resourcesSpent),
          resourcesPerSec: mergeSum(mergedResults.resourcesPerSec, results.resourcesPerSec ?? gridsResourcesPerSec[results.gridId])
        };
      }, {newCards: [], inventoryDelta: {}, resourcesSpent: {...defaultResourcesMap}, resourcesPerSec: {...defaultResourcesMap}});

      if (results.newCards.length > 0) {
        discovery().discoverCards(results.newCards);
      }
      
      stats().useResources(results.resourcesSpent);
      stats().update(elapsed, results.resourcesPerSec);

      if (Object.keys(results.inventoryDelta).length > 0) {
        cards().updateInventory(results.inventoryDelta);
      }

      set({grids: newGrids});
    },

    cardDefsChanged: () => {
      const newGrids: Record<string, Grid> = {};
      const defs = cardDefs().defs;
      const gridsResourcesPerSec = get().gridsResourcesPerSec;
      const results: UpdateDefsResults = Object.entries(get().grids).map(([id, grid]) => {
        iterateGrid(grid, (card) => {
          const cardDef = defs[card.cardId];
          if (cardDef.maxDurability && card.durability) {
            if (card.maxDurability > 0) {
              card.durability *= cardDef.maxDurability/card.maxDurability;
            }
          }
        });
        const totalResults = updateGridTotals(grid, defs, stats());
        newGrids[id] = totalResults.grid;

        return {
          gridId: id,
          ...totalResults,
        };
      }).reduce<UpdateDefsResults>((mergedResults, results) => {
        return {
          resourcesPerSec: mergeSum(mergedResults.resourcesPerSec, results.resourcesPerSec ?? gridsResourcesPerSec[results.gridId])
        };
      }, {resourcesPerSec: {...defaultResourcesMap}});

      stats().update(0, results.resourcesPerSec);
      set({grids: newGrids});
    },

    replaceCard: (gridId, x, y, newCard) => {
      replaceCard(gridId, x, y, newCard);
    },

    returnCard: (gridId, x, y) => {
      replaceCard(gridId, x, y, null);
    },

    clearGrid: (gridId) => {
      const returnedCards: Record<string, number> = {};
      get().grids[gridId].forEach((row, y) => {
        row.forEach((card, x) => {
          if (card) {
            returnedCards[card.cardId] = (returnedCards[card.cardId] ?? 0) + 1;
          }
        })
      });

      cards().updateInventory(returnedCards);
      set({grids: {...get().grids, [gridId]: getEmptyGrid()}});
      updateResourcesOfGrid(gridId, {...defaultResourcesMap});
    },

    prestigeReset: () => {
      set({
        grids: mapValues(get().grids, (g) => getEmptyGrid()),
        gridsResourcesPerSec: mapValues(get().grids, (g) => ({...defaultResourcesMap})),
      });
    },

    getSaveData: () => {
      /* *
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
      /* */
    },

    loadSaveData: (data) => {
      /* *
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
      /* */
    },
  }
}

const WIDTH = 5;
const HEIGHT = 5;

export function getEmptyGrid() {
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

export default createGridsSlice;