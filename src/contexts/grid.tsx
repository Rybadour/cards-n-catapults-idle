/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import { Grid, PrestigeEffects, RealizedCard } from "../shared/types";
import { updateGrid, updateGridTotals, UpdateGridTotalsResults } from "../gamelogic/abilities";
import { StatsContext } from "./stats";
import { CardsContext } from "./cards";
import cardsConfig from "../config/cards";
import { DiscoveryContext } from "./discovery";
import _, { cloneDeep } from "lodash";
import { createCard } from "../gamelogic/grid-cards";
import { DEFAULT_EFFECTS } from "../shared/constants";

const width = 5;
const height = 5;

export type GridContext = {
  gridSpaces: Grid,
  prestigeEffects: PrestigeEffects,
  replaceCard: (x: number, y: number, newCard: RealizedCard) => (RealizedCard | null),
  returnCard: (x: number, y: number) => void,
  update: (elapsed: number) => void,
  prestigeReset: () => void,
  prestigeUpdate: (effects: PrestigeEffects) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => any,
};

const defaultContext: GridContext = {
  gridSpaces: getEmptyGrid(),
  prestigeEffects: cloneDeep(DEFAULT_EFFECTS),
  replaceCard: (x, y, newCard) => null,
  returnCard: (x, y) => {},
  update: (elapsed) => {},
  prestigeReset: () => {},
  prestigeUpdate: (effects) => {},
  getSaveData: () => ({}),
  loadSaveData: (data) => {},
};

export const GridContext = createContext(defaultContext);

export function GridProvider(props: Record<string, any>) {
  const discovery = useContext(DiscoveryContext);
  const stats = useContext(StatsContext);
  const cards = useContext(CardsContext);
  const [gridSpaces, setGridSpaces] = useState(defaultContext.gridSpaces);
  const [prestigeEffects, setPrestigeEffects] = useState(defaultContext.prestigeEffects);

  function update(elapsed: number) {
    const results = updateGrid(gridSpaces, stats.resources, cards.cards, prestigeEffects, elapsed);

    if (results.newCards.length > 0) {
      discovery.discoverCards(results.newCards);
    }

    let totalResults: UpdateGridTotalsResults | null = null;
    if (results.anyChanged) {
      totalResults = updateGridTotals(results.grid, stats);
      results.grid = totalResults.grid;
    }
    stats.update(elapsed, totalResults?.resourcesPerSec ?? null, results.grid);

    setGridSpaces(results.grid);

    if (Object.keys(results.inventoryDelta).length > 0) {
      cards.updateInventory(results.inventoryDelta);
    }
  }

  function replaceCard(x: number, y: number, newCard: RealizedCard) {
    const oldCard = gridSpaces[y][x];
    const newGridSpaces = [ ...gridSpaces ];
    newGridSpaces[y][x] = newCard;

    const results = updateGridTotals(newGridSpaces, stats);
    setGridSpaces(results.grid);
    stats.updatePerSec(results.resourcesPerSec);

    return oldCard;
  }
  
  function returnCard(x: number, y: number) {
    const newGridSpaces = [ ...gridSpaces ];
    newGridSpaces[y][x] = null;

    const results = updateGridTotals(newGridSpaces, stats);
    setGridSpaces(results.grid);
    stats.updatePerSec(results.resourcesPerSec);
  }

  function prestigeReset() {
    setGridSpaces(getEmptyGrid());
  }

  function prestigeUpdate(prestigeEffects: PrestigeEffects) {
    setPrestigeEffects(prestigeEffects);
  }

  function getSaveData() {
    const gridData: any[] = [];
    gridSpaces.forEach((row, y) => {
      row.forEach((card, x) => {
        if (card) {
          gridData.push({
            x, y,
            card: _.pick(card, ['id', 'shouldBeReserved', 'isExpiredAndReserved', 'durability', 'timeLeftMs'])
          });
        }
      });
    })
    return gridData;
  }

  function loadSaveData(data: any) {
    if (!Array.isArray(data)) return false;
    if (typeof data[0] !== 'object' && data[0].id) return false;

    const newGridSpaces = getEmptyGrid();
    data.forEach((space) => {
      newGridSpaces[space.y][space.x] = {
        ...createCard(cardsConfig[space.card.id], 0),
        ...space.card
      };
    });

    const results = updateGridTotals(newGridSpaces, stats);

    setGridSpaces(results.grid);
    stats.updatePerSec(results.resourcesPerSec);
  }

  return (
    <GridContext.Provider
      value={{
        gridSpaces, prestigeEffects,
        replaceCard, returnCard, update, prestigeReset, prestigeUpdate, getSaveData, loadSaveData,
      }}
      {...props}
    />
  );
}

function getEmptyGrid() {
  const gridSpaces = [];
  for (let i = 0; i < height; ++i) {
    const row: (RealizedCard | null)[] = [];
    for (let j = 0; j < width; ++j) {
      row.push(null);
    }
    gridSpaces.push(row);
  }
  return gridSpaces;
}