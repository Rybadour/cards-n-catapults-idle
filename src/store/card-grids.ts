import { mapValues } from "lodash";

import { CardId, defaultResourcesMap, Grid, GridCoords, GridTemplate, RealizedCard, ResourcesMap } from "../shared/types";
import { CardsSlice } from "./cards";
import { iterateGrid, updateGrid, UpdateGridResults, updateGridTotals, UpdateGridTotalsResults } from "../gamelogic/grid";
import { StatsSlice } from "./stats";
import { DiscoverySlice } from "./discovery";
import { CardDefsSlice } from "./card-definitions";
import { getTranslatedGridCoords, mergeSum } from "../shared/utils";
import { createCard } from "../gamelogic/grid-cards";
import allCardsConfig from "../config/cards";
import global from "../config/global";
import { MyCreateSlice } from ".";

export interface CardGridsSlice {
  initialized: boolean,
  grids: Record<string, Grid>,
  gridsResourcesPerSec: Record<string, ResourcesMap>,
  updateAll: (elapsed: number) => void,
  cardDefsChanged: () => void,
  replaceCard: (gridId: string, x: number, y: number, newCard: RealizedCard, shouldReturnCard?: boolean) => void,
  removeCard: (gridId: string, x: number, y: number, shouldReturnCard?: boolean) => void,
  clearGrid: (gridId: string) => void,
  clearAllGrids: () => void,
  initializeGrid: (gridId: string, staticCards: GridTemplate) => void,
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

  function replaceCard(gridId: string, x: number, y: number, newCard: RealizedCard | null, shouldReturnCard: boolean = true) {
    const gridSpaces = get().grids[gridId];
    if (!gridSpaces) return;

    const newGridSpaces = [ ...gridSpaces ];
    const oldCard = newGridSpaces[y][x];
    newGridSpaces[y][x] = newCard;

    const results = updateGridTotals(newGridSpaces, cardDefs().defs, stats());
    set({
      grids: {...get().grids, [gridId]: newGridSpaces},
    });
    updateResourcesOfGrid(gridId, results.resourcesPerSec);

    if (oldCard && shouldReturnCard) {
      cards().returnCard(oldCard);
    }
  }

  function updateResourcesOfGrid(gridId: string, resourcesPerSec: ResourcesMap) {
    const gridsResourcesPerSec = {...get().gridsResourcesPerSec};
    gridsResourcesPerSec[gridId] = resourcesPerSec;
    const sumOfResources = Object.values(gridsResourcesPerSec)
      .reduce((sum, resPerSec) => mergeSum(sum, resPerSec), {...defaultResourcesMap});
    stats().updatePerSec(sumOfResources);

    set({gridsResourcesPerSec: gridsResourcesPerSec});
  }

  function getCardsFromGrid(gridId: string) {
    const returnedCards: Record<string, number> = {};
    get().grids[gridId].forEach((row, y) => {
      row.forEach((card, x) => {
        if (card && !card.isStatic) {
          returnedCards[card.cardId] = (returnedCards[card.cardId] ?? 0) + 1;
        }
      })
    });
    return returnedCards;
  }

  function getEmptyGridWithStatics(gridId: string) {
    const grid = get().grids[gridId];
    const newGrid = getEmptyGrid(grid[0].length, grid.length);
    iterateGrid(grid, (card, x, y) => {
      if (card.isStatic) {
        newGrid[y][x] = card;
      }
    });
    return newGrid;
  }

  return {
    initialized: false,
    grids: {
      town: removeGridTiles(
        getEmptyGrid(global.startingTown.width, global.startingTown.height, global.startingTown.fill),
        getTranslatedGridCoords(global.startingTown.empties, global.startingTown.center),
      ),
      combat: getEmptyGrid(5, 5),
    },
    gridsResourcesPerSec: {
      town: {...defaultResourcesMap},
      combat: {...defaultResourcesMap},
    },

    updateAll: (elapsed) => {
      const resources = {...stats().resources};
      const inventory = {...cards().cards};
      const gridsResourcesPerSec = {...get().gridsResourcesPerSec};
      const newGrids: Record<string, Grid> = {};
      const results: UpdateResults = Object.entries(get().grids).map(([id, grid]) => {
        const gridResults = updateGrid(grid, resources, cardDefs().defs, inventory, elapsed);

        let totalResults: UpdateGridTotalsResults | null = null;
        if (gridResults.anyChanged || !get().initialized) {
          totalResults = updateGridTotals(gridResults.grid, cardDefs().defs, stats());
          gridsResourcesPerSec[id] = totalResults.resourcesPerSec;
          gridResults.grid = totalResults.grid;
        }

        newGrids[id] = gridResults.grid;

        return {
          gridId: id,
          ...gridResults,
        };
      }).reduce<UpdateResults>((mergedResults, results) => {
        return {
          newCards: [...mergedResults.newCards, ...results.newCards],
          inventoryDelta: mergeSum(mergedResults.inventoryDelta, results.inventoryDelta),
          resourcesSpent: mergeSum(mergedResults.resourcesSpent, results.resourcesSpent),
          resourcesPerSec: mergeSum(mergedResults.resourcesPerSec, gridsResourcesPerSec[results.gridId])
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

      set({
        grids: newGrids,
        gridsResourcesPerSec: gridsResourcesPerSec,
        initialized: true,
      });
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

    replaceCard: (gridId, x, y, newCard, shouldReturnCard = true) => {
      replaceCard(gridId, x, y, newCard, shouldReturnCard);
    },

    removeCard: (gridId, x, y, shouldReturnCard = true) => {
      replaceCard(gridId, x, y, null, shouldReturnCard);
    },

    clearGrid: (gridId) => {
      cards().updateInventory(getCardsFromGrid(gridId));
      set({grids: {...get().grids, [gridId]: getEmptyGridWithStatics(gridId)}});
      updateResourcesOfGrid(gridId, {...defaultResourcesMap});
    },

    clearAllGrids: () => {
      const grids = get().grids;
      let returnedCards: Record<string, number> = {};
      Object.keys(grids).forEach((gridId) => {
        returnedCards = mergeSum(returnedCards, getCardsFromGrid(gridId));
      });

      cards().updateInventory(returnedCards);
      set({
        grids: mapValues(grids, (grid, gridId) => getEmptyGridWithStatics(gridId)),
        gridsResourcesPerSec: mapValues(grids, (grid) => ({...defaultResourcesMap})),
      })
    },

    initializeGrid: (gridId, staticCards) => {
      const newGridSpaces = getInitializedGrid(staticCards, true);
      const results = updateGridTotals(newGridSpaces, cardDefs().defs, stats());
      set({
        grids: {...get().grids, [gridId]: newGridSpaces},
      });
      updateResourcesOfGrid(gridId, results.resourcesPerSec);
    },

    prestigeReset: () => {
      set({
        grids: mapValues(get().grids, (g) => getEmptyGrid(g[0].length, g.length)),
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

export function getEmptyGrid(width: number, height: number, staticFillCard?: CardId) {
  const gridSpaces = [];
  for (let i = 0; i < height; ++i) {
    const row: (RealizedCard | null)[] = [];
    for (let j = 0; j < width; ++j) {
      let card: RealizedCard | null = null;
      if (staticFillCard) {
        card = createCard(allCardsConfig[staticFillCard], 1);
        card.isStatic = true;
      }
      row.push(card);
    }
    gridSpaces.push(row);
  }
  return gridSpaces;
}

export function removeGridTiles(grid: Grid, tiles: GridCoords[]) {
  const newGrid = [...grid];
  tiles.forEach(tile => {
    newGrid[tile.y][tile.x] = null;
  });
  return newGrid;
}

function getInitializedGrid(template: GridTemplate, isStatic = false) {
  const newGrid = getEmptyGrid(template[0].length, template.length);

  for (let y = 0; y < template.length; y++) {
    for (let x = 0; x < template[y].length; x++) {
      const cardId = template[y][x];
      if (cardId) {
        const newCard = createCard(allCardsConfig[cardId], 1);
        newCard.isStatic = isStatic;
        newGrid[y][x] = newCard;
      }
    }
  }

  return newGrid;
}

export default createGridsSlice;