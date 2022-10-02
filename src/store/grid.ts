import { createLens } from "@dhmk/zustand-lens";

import { Grid, MyCreateLens, PrestigeEffects, RealizedCard } from "../shared/types";
import { FullStore } from ".";
import { CardsSlice } from "./cards";
import { cloneDeep } from "lodash";
import { DEFAULT_EFFECTS } from "../shared/constants";

export interface GridSlice {
  gridSpaces: Grid,
  prestigeEffects: PrestigeEffects,
  replaceCard: (x: number, y: number, newCard: RealizedCard) => void,
  returnCard: (x: number, y: number) => void,
  update: (elapsed: number) => void,
  prestigeReset: () => void,
  prestigeUpdate: (effects: PrestigeEffects) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => any,
}

const KEY = 'grid';
const createGridLens: MyCreateLens<FullStore, GridSlice, [CardsSlice]> = (set, get, cards) => {
  const [_set, _get] = createLens(set, get, KEY);

  return {
    key: KEY,
    slice: {
      gridSpaces: getEmptyGrid(),
      prestigeEffects: cloneDeep(DEFAULT_EFFECTS),
      replaceCard: (x, y, newCard) => {
        const newGridSpaces = [ ..._get().gridSpaces ];
        const oldCard = newGridSpaces[y][x];
        newGridSpaces[y][x] = newCard;

        //const results = updateGridTotals(newGridSpaces, stats, cardMastery.cardMasteries);
        _set({gridSpaces: newGridSpaces});
        //stats.updatePerSec(results.resourcesPerSec);

        cards.replaceCard(oldCard);
      },
      returnCard: (x, y) => {},
      update: (elapsed) => {},
      prestigeReset: () => {},
      prestigeUpdate: (effects) => {},
      getSaveData: () => ({}),
      loadSaveData: (data) => {},
    }
  }
};

const WIDTH = 5;
const HEIGHT = 5;

function getEmptyGrid() {
  const gridSpaces = [];
  for (let i = 0; i < HEIGHT; ++i) {
    const row: (RealizedCard | null)[] = [];
    for (let j = 0; j < WIDTH; ++j) {
      row.push(null);
    }
    gridSpaces.push(row);
  }
  return gridSpaces;
}

export default createGridLens;