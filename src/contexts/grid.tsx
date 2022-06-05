/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react";
import cards from "../config/cards";
import { Card } from "../shared/types";
import { getPerSecFromGrid } from "../shared/calculations";

const width = 5;
const height = 5;

export type GridContext = {
  gridSpaces: (Card | null)[][],
  selectedCard: Card | null,
  totalGold: number,
  goldPerSec: number,
  addCard: (x: number, y: number) => void,
  removeCard: (x: number, y: number) => void,
  setSelectedCard: (card: Card) => void,
  update: (elapsed: number) => void,
};

const defaultContext: GridContext = {
  gridSpaces: [],
  selectedCard: null,
  totalGold: 0,
  goldPerSec: 0,
  addCard: (x, y) => {},
  removeCard: (x, y) => {},
  setSelectedCard: (card) => {},
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
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [totalGold, setTotalGold] = useState(100);
  const [goldPerSec, setGoldPerSec] = useState(0);

  function update(elapsed: number) {
    setTotalGold(totalGold + (elapsed/1000) * goldPerSec);
  }

  function addCard(x: number, y: number) {
    const newGridSpaces = [ ...gridSpaces ];
    newGridSpaces[y][x] = selectedCard;
    setGridSpaces(newGridSpaces);

    setGoldPerSec(getPerSecFromGrid(gridSpaces));
  }

  function removeCard(x: number, y: number) {

  }

  return (
    <GridContext.Provider
      value={{
        gridSpaces, selectedCard, totalGold, goldPerSec,
        addCard, removeCard, setSelectedCard, update,
      }}
      {...props}
    />
  );
}
