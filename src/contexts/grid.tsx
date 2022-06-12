/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react";
import cards from "../config/cards";
import { Card, Grid, RealizedCard } from "../shared/types";
import { getPerSecFromGrid, updateDurabilities } from "../shared/calculations";

const width = 5;
const height = 5;

export type GridContext = {
  gridSpaces: Grid,
  totalGold: number,
  goldPerSec: number,
  replaceCard: (x: number, y: number, newCard: Card) => (RealizedCard | null),
  update: (elapsed: number) => void,
  useGold: (amount: number) => void,
};

const defaultContext: GridContext = {
  gridSpaces: [],
  totalGold: 0,
  goldPerSec: 0,
  replaceCard: (x, y, newCard) => null,
  update: (elapsed) => {},
  useGold: (amount) => {},
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
  const [gridSpaces, setGridSpaces] = useState(defaultContext.gridSpaces);
  const [totalGold, setTotalGold] = useState(100);
  const [goldPerSec, setGoldPerSec] = useState(0);

  function update(elapsed: number) {
    const results = updateDurabilities(gridSpaces, elapsed);
    setGridSpaces(results.grid);

    let newGoldPerSec = goldPerSec;
    if (results.anyRemoved) {
      newGoldPerSec = getPerSecFromGrid(results.grid);
      setGoldPerSec(newGoldPerSec);
    }
    setTotalGold(totalGold + (elapsed/1000) * newGoldPerSec);
  }

  function useGold(amount: number) {
    setTotalGold(totalGold - amount);
  }

  function replaceCard(x: number, y: number, newCard: Card) {
    const oldCard = gridSpaces[y][x];
    const newGridSpaces = [ ...gridSpaces ];
    newGridSpaces[y][x] = {
      ...newCard,
      durability: newCard.maxDurability,
      modifiedStrength: 0,
    };
    setGridSpaces(newGridSpaces);

    setGoldPerSec(getPerSecFromGrid(gridSpaces));

    return oldCard;
  }

  return (
    <GridContext.Provider
      value={{
        gridSpaces, totalGold, goldPerSec,
        replaceCard, update, useGold,
      }}
      {...props}
    />
  );
}
