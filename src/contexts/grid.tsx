/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import { Grid, RealizedCard } from "../shared/types";
import { getPerSecFromGrid, updateGrid } from "../gamelogic/abilities";
import { StatsContext } from "./stats";

const width = 5;
const height = 5;

export type GridContext = {
  gridSpaces: Grid,
  replaceCard: (x: number, y: number, newCard: RealizedCard) => (RealizedCard | null),
  update: (elapsed: number) => void,
};

const defaultContext: GridContext = {
  gridSpaces: [],
  replaceCard: (x, y, newCard) => null,
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
  const stats = useContext(StatsContext);
  const [gridSpaces, setGridSpaces] = useState(defaultContext.gridSpaces);

  function update(elapsed: number) {
    const results = updateGrid(gridSpaces, elapsed);
    setGridSpaces(results.grid);

    stats.update(elapsed, results.anyChanged, gridSpaces);
  }

  function replaceCard(x: number, y: number, newCard: RealizedCard) {
    const oldCard = gridSpaces[y][x];
    const newGridSpaces = [ ...gridSpaces ];
    newGridSpaces[y][x] = newCard;
    setGridSpaces(newGridSpaces);

    stats.updatePerSec(gridSpaces);

    return oldCard;
  }

  return (
    <GridContext.Provider
      value={{
        gridSpaces,
        replaceCard, update,
      }}
      {...props}
    />
  );
}
