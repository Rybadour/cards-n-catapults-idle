import cards from "../config/cards";
import { createCard } from "./grid-cards";
import { Ability, RealizedCard, Grid, CardType } from "../shared/types";

export function getPerSecFromGrid(grid: Grid): number {
  let goldPerSec = 0;

  iterateGrid(grid, (card, x, y) => {
    if (card.ability == Ability.Produce) {
      goldPerSec += card.abilityStrength;
    } else if (card.ability == Ability.ProduceFromMatching) {
      iterateAdjacentCards(grid, x, y, (adj) => {
        if (adj.type == card.abilityMatch) {
          goldPerSec += card.abilityStrength;
        }
      });
    } else if (card.ability == Ability.BonusToMatching) {
      iterateAdjacentCards(grid, x, y, (adj) => {
        if (adj.type == card.abilityMatch) {
          goldPerSec += (adj.abilityStrength * card.abilityStrength);
        }
      });
    }
  });

  return goldPerSec;
}

export function updateGrid(grid: Grid, elapsed: number): {grid: Grid, anyChanged: boolean} {
  const newGrid = [...grid];
  let anyChanged = false;
  iterateGrid(grid, (card, x, y) => {
    if (card.foodDrain) {
      const adjacentFood: {
        card: RealizedCard,
        x: number,
        y: number,
      }[] = [];
      iterateAdjacentCards(grid, x, y, (adjCard, ax, ay) => {
        if (adjCard.type == CardType.Food && adjCard.maxDurability) {
          adjacentFood.push({card: adjCard, x: ax, y: ay});
        } 
      }); 

      const foodDrain = (elapsed/1000 * card.foodDrain) / adjacentFood.length;
      adjacentFood.forEach(food => {
        food.card.durability = (food.card.durability ?? 0) - foodDrain;
        if (food.card.durability <= 0) {
          grid[food.y][food.x] = null;
          anyChanged = true;
        }
      })
    }

    if (card.ability == Ability.ProduceCard && card.abilityCard) {
      card.timeLeftMs = (card.timeLeftMs ?? 0) - elapsed;
      if (card.timeLeftMs > 0) return;

      card.timeLeftMs = card.cooldownMs;
      let found = false;
      iterateAdjacent(grid, x, y, (adjCard, ax, ay) => {
        if (adjCard || found) return;

        found = true;
        newGrid[ay][ax] = createCard(cards[card.abilityCard!!], 1);
      });
    }
  });
  return {grid: newGrid, anyChanged};
}

function iterateGrid(grid: Grid, callback: (card: RealizedCard, x: number, y: number) => void) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x]) {
        callback(grid[y][x]!!, x, y);
      }
    }
  }
}

const adjacents = [{x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: -1, y: 0}];
function iterateAdjacent(
  grid: Grid, x: number, y: number,
  callback: (card: RealizedCard | null, x: number, y: number) => void
) {
  adjacents.forEach(adj => {
    const ax = x + adj.x, ay = y + adj.y;
    if (0 > ay || ay >= grid.length || 0 > ax || ax >= grid[ay].length) {
      return;
    }

    callback(grid[ay][ax]!!, ax, ay);
  });
}

function iterateAdjacentCards(
  grid: Grid, x: number, y: number,
  callback: (card: RealizedCard, x: number, y: number) => void
) {
  iterateAdjacent(grid, x, y, (card, ax, ay) => {
    if (card) {
      callback(card!!, ax, ay);
    }
  });
}