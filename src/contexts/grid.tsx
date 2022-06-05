/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react";
import cards from "../config/cards";
import { Card } from "../shared/types";

const width = 5;
const height = 5;

export type GridContext = {
  gridSpaces: (Card | null)[][],
  selectedCard: Card | null,
  addCard: (x: number, y: number) => void,
  removeCard: (x: number, y: number) => void,
  setSelectedCard: (card: Card) => void,
};

const defaultContext: GridContext = {
  gridSpaces: [],
  selectedCard: null,
  addCard: (x, y) => {},
  removeCard: (x, y) => {},
  setSelectedCard: (card) => {},
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
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  function addCard(x: number, y: number) {
    const newGridSpaces = [ ...gridSpaces ];
    newGridSpaces[y][x] = selectedCard;
    setGridSpaces(newGridSpaces);
  }

  function removeCard(x: number, y: number) {

  }

  return (
    <GridContext.Provider
      value={{
        gridSpaces, selectedCard,
        addCard, removeCard, setSelectedCard,
      }}
      {...props}
    />
  );
}
