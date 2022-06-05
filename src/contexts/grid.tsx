/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react";
import cards from "../config/cards";
import { Card } from "../shared/types";

const width = 5;
const height = 5;

export type GridContext = {
  gridSpaces: (Card | null)[][],
  addCard: (x: number, y: number, card: Card) => void,
  removeCard: (x: number, y: number) => void,
};

const defaultContext: GridContext = {
  gridSpaces: [],
  addCard: (x, y, card) => {},
  removeCard: (x, y) => {},
};
for (let i = 0; i < height; ++i) {
  const row: (Card | null)[] = [];
  for (let j = 0; j < width; ++j) {
    row.push(null);
  }
  defaultContext.gridSpaces.push(row);
}

defaultContext.gridSpaces[0][2] = cards.beggar;

export const GridContext = createContext(defaultContext);

export function GridProvider(props: Record<string, any>) {
  const [gridSpaces, setGridSpaces] = useState(defaultContext.gridSpaces);

  function addCard(x: number, y: number, card: Card) {
    const newGridSpaces = [ ...gridSpaces ];
    newGridSpaces[y][x] = card;
    setGridSpaces(newGridSpaces);
  }

  function removeCard(x: number, y: number) {

  }

  return (
    <GridContext.Provider
      value={{
        gridSpaces,
        addCard, removeCard,
      }}
      {...props}
    />
  );
}
