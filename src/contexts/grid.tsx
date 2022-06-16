/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import { Grid, RealizedCard } from "../shared/types";
import { getPerSecFromGrid, updateGrid } from "../gamelogic/abilities";
import { StatsContext } from "./stats";
import { CardsContext } from "./cards";
import { DiscoveryContext } from "./discovery";

const width = 5;
const height = 5;

export type GridContext = {
  gridSpaces: Grid,
  replaceCard: (x: number, y: number, newCard: RealizedCard) => (RealizedCard | null),
  returnCard: (x: number, y: number) => void,
  update: (elapsed: number) => void,
};

const defaultContext: GridContext = {
  gridSpaces: [],
  replaceCard: (x, y, newCard) => null,
  returnCard: (x, y) => {},
  update: (elapsed) => {},
};
for (let i = 0; i < height; ++i) {
  const row: (RealizedCard | null)[] = [];
  for (let j = 0; j < width; ++j) {
    row.push(null);
  }
  defaultContext.gridSpaces.push(row);
}

export const GridContext = createContext(defaultContext);

export function GridProvider(props: Record<string, any>) {
  const discovery = useContext(DiscoveryContext);
  const stats = useContext(StatsContext);
  const cards = useContext(CardsContext);
  const [gridSpaces, setGridSpaces] = useState(defaultContext.gridSpaces);

  function update(elapsed: number) {
    const results = updateGrid(gridSpaces, elapsed);
    setGridSpaces(results.grid);

    if (results.anyChanged) {
      discovery.discoverCards(results.newCards);
    }
    stats.update(elapsed, results.anyChanged, gridSpaces);

    cards.updateInventory(results.inventoryDelta);
  }

  function replaceCard(x: number, y: number, newCard: RealizedCard) {
    const oldCard = gridSpaces[y][x];
    const newGridSpaces = [ ...gridSpaces ];
    newGridSpaces[y][x] = newCard;
    setGridSpaces(newGridSpaces);

    stats.updatePerSec(gridSpaces);

    return oldCard;
  }
  
  function returnCard(x: number, y: number) {
    const newGridSpaces = [ ...gridSpaces ];
    newGridSpaces[y][x] = null;
    setGridSpaces(newGridSpaces);

    stats.updatePerSec(gridSpaces);
  }

  return (
    <GridContext.Provider
      value={{
        gridSpaces,
        replaceCard, returnCard, update,
      }}
      {...props}
    />
  );
}
