import enemies from "../config/combat-enemies";
import { CombatEncounter, MyCreateSlice } from "../shared/types";

export type ActiveCombatant = {
  id: string,
  health: number,
  damage: number,
  attackSpeed: number,
}

export type ActiveCombatGrid = (ActiveCombatant | null)[][];

export interface CombatSlice {
  selectedEncounter: CombatEncounter | null,
  enemyGrid: ActiveCombatGrid,
  playerGrid: ActiveCombatGrid,

  chooseEncounter: (encounter: CombatEncounter) => void,
}

const createCombatSlice: MyCreateSlice<CombatSlice, []> = (set, get) => {
  return {
    selectedEncounter: null,
    enemyGrid: getEmptyGrid(),
    playerGrid: getEmptyGrid(),

    chooseEncounter: (encounter) => {
      const activeGrid: ActiveCombatGrid = [];
      encounter.grid.forEach(row => {
        const activeRow: (ActiveCombatant | null)[] = [];
        row.forEach(enemyId => {
          activeRow.push(enemyId ? enemies[enemyId] : null);
        });
        activeGrid.push(activeRow);
      });

      set({
        selectedEncounter: encounter,
        enemyGrid: activeGrid,
        playerGrid: getEmptyGrid(),
      });
    }
  }
};

const GRID_WIDTH = 5;
const GRID_HEIGHT = 3;

function getEmptyGrid() {
  const activeGrid: ActiveCombatGrid = [];
  for (let y = 0; y < GRID_HEIGHT; ++y) {
    const row = [];
    for (let x = 0; x < GRID_WIDTH; ++x) {
      row.push(null);
    }
    activeGrid.push(row);
  }
  return activeGrid;
}

export default createCombatSlice;