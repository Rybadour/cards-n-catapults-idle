/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react";
import cards from "../config/cards";
import { Card } from "../shared/types";
import { getPerSecFromGrid } from "../shared/calculations";

const width = 5;
const height = 5;

export type GridContext = {
  gridSpaces: (Card | null)[][],
  totalGold: number,
  goldPerSec: number,
  replaceCard: (x: number, y: number, newCard: Card) => (Card | null),
  update: (elapsed: number) => void,
};

const defaultContext: GridContext = {
  gridSpaces: [],
  totalGold: 0,
  goldPerSec: 0,
  replaceCard: (x, y, newCard) => null,
  update: (elapsed) => {},
};
for (let i = 0; i < height; ++i) {
  const row: (Card | null)[] = [];
  for (let j = 0; j < width; ++j) {
    row.push(null);
  }
  defaultContext.gridSpaces.push(row);
}

export const GridContext = createContext(defaultContext);

export function GridProvider(props: Record<string, any>) {
  const [gridSpaces, setGridSpaces] = useState(defaultContext.gridSpaces);
  const [totalGold, setTotalGold] = useState(100);
  const [goldPerSec, setGoldPerSec] = useState(0);

  function update(elapsed: number) {
    setTotalGold(totalGold + (elapsed/1000) * goldPerSec);
  }

  function replaceCard(x: number, y: number, newCard: Card) {
    const oldCard = gridSpaces[y][x];
    const newGridSpaces = [ ...gridSpaces ];
    newGridSpaces[y][x] = newCard;
    setGridSpaces(newGridSpaces);

    setGoldPerSec(getPerSecFromGrid(gridSpaces));

    return oldCard;
  }

  return (
    <GridContext.Provider
      value={{
        gridSpaces, totalGold, goldPerSec,
        replaceCard, update,
      }}
      {...props}
    />
  );
}
