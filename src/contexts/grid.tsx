/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import { Grid, RealizedCard } from "../shared/types";
import { updateGrid, updateGridTotals, UpdateGridTotalsResults } from "../gamelogic/abilities";
import { StatsContext } from "./stats";
import { CardsContext } from "./cards";
import { DiscoveryContext } from "./discovery";
import { PrestigeContext } from "./prestige";

const width = 5;
const height = 5;

export type GridContext = {
  gridSpaces: Grid,
  replaceCard: (x: number, y: number, newCard: RealizedCard) => (RealizedCard | null),
  returnCard: (x: number, y: number) => void,
  update: (elapsed: number) => void,
  prestigeReset: () => void,
};

const defaultContext: GridContext = {
  gridSpaces: getEmptyGrid(),
  replaceCard: (x, y, newCard) => null,
  returnCard: (x, y) => {},
  update: (elapsed) => {},
  prestigeReset: () => {},
};

export const GridContext = createContext(defaultContext);

export function GridProvider(props: Record<string, any>) {
  const discovery = useContext(DiscoveryContext);
  const prestige = useContext(PrestigeContext);
  const stats = useContext(StatsContext);
  const cards = useContext(CardsContext);
  const [gridSpaces, setGridSpaces] = useState(defaultContext.gridSpaces);

  function update(elapsed: number) {
    const results = updateGrid(gridSpaces, stats.resources, cards.cards, prestige.prestigeEffects, elapsed);

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

    cards.updateInventory(results.inventoryDelta);
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

  return (
    <GridContext.Provider
      value={{
        gridSpaces,
        replaceCard, returnCard, update, prestigeReset,
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