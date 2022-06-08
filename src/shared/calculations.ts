import { Ability, Card, Grid } from "./types";

export function getPerSecFromGrid(grid: Grid): number {
  let goldPerSec = 0;

  iterateGrid(grid, (card, x, y) => {
    if (card.ability == Ability.Produce) {
      goldPerSec += card.abilityStrength;
    } else if (card.ability == Ability.ProduceFromMatching) {
      iterateAdjacent(grid, x, y, (adj) => {
        if (adj.type == card.abilityMatch) {
          goldPerSec += card.abilityStrength;
        }
      });
    }
  });

  return goldPerSec;
}

function iterateGrid(grid: Grid, callback: (card: Card, x: number, y: number) => void) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x]) {
        callback(grid[y][x]!!, x, y);
      }
    }
  }
}

const adjacents = [{x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: -1, y: 0}];
function iterateAdjacent(grid: Grid, x: number, y: number, callback: (card: Card) => void) {
  adjacents.forEach(adj => {
    const ax = x + adj.x, ay = y + adj.y;
    if (0 > ay || ay >= grid.length || 0 > ax || ax >= grid[ay].length) {
      return;
    }
    const adjacent = grid[ay][ax];
    if (adjacent != null) {
      callback(adjacent!!)
    }
  });
}