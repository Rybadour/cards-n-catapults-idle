import cards from "../config/cards";
import { createCard } from "./grid-cards";
import { Ability, RealizedCard, Grid, CardType, ResourceType, Card, CardId } from "../shared/types";
import global from "../config/global";

export function getPerSecFromGrid(grid: Grid): Record<ResourceType, number> {
  let resourcesPerSec = {
    [ResourceType.Gold]: 0,
    [ResourceType.Wood]: 0,
  };

  iterateGrid(grid, (card, x, y) => {
    if (card.ability == Ability.Produce && card.abilityResource) {
      resourcesPerSec[card.abilityResource] += card.abilityStrength;
    } else if (card.ability == Ability.ProduceFromMatching) {
      iterateAdjacentCards(grid, x, y, (adj) => {
        if (adj.type == card.abilityMatch && card.abilityResource) {
          resourcesPerSec[card.abilityResource] += card.abilityStrength;
        }
      });
    } else if (card.ability == Ability.BonusToMatching) {
      iterateAdjacentCards(grid, x, y, (adj) => {
        if (adj.type == card.abilityMatch && adj.abilityResource) {
          resourcesPerSec[adj.abilityResource] += (adj.abilityStrength * card.abilityStrength);
        }
      });
    }
  });

  return resourcesPerSec;
}

export type UpdateGridResults = {
  grid: Grid,
  anyChanged: boolean,
  inventoryDelta: Record<CardId, number>,
  newCards: Card[],
}

export function updateGrid(grid: Grid, elapsed: number): UpdateGridResults {
  const newGrid = [...grid];
  let anyChanged = false;
  const newCards: Card[] = [];
  const inventoryDelta: Record<CardId, number> = {};

  iterateGrid(grid, (card, x, y) => {
    if (card.foodDrain) {
      const adjacentFood: {
        card: RealizedCard,
        x: number,
        y: number,
      }[] = [];
      iterateAdjacentCards(grid, x, y, (adjCard, ax, ay) => {
        if (adjCard.type == CardType.Food && adjCard.maxDurability && !adjCard.isExpiredAndReserved) {
          adjacentFood.push({card: adjCard, x: ax, y: ay});
        } 
      }); 

      const foodDrain = (elapsed/1000 * card.foodDrain) / adjacentFood.length;
      adjacentFood.forEach(food => {
        food.card.durability = (food.card.durability ?? 0) - foodDrain;
        if (food.card.durability <= 0) {
          food.card.isExpiredAndReserved = true;
          food.card.durability = 0;
          newGrid[food.y][food.x] = food.card;
          anyChanged = true;
        }
      })
    }

    if (card.ability == Ability.ProduceCard && card.abilityCard) {
      card.timeLeftMs = (card.timeLeftMs ?? 0) - elapsed * global.produceModifier;
      if (card.timeLeftMs > 0) return;

      card.timeLeftMs = card.cooldownMs;
      let found = false;
      iterateAdjacent(newGrid, x, y, (adjCard, ax, ay) => {
        if ((adjCard && !adjCard.isExpiredAndReserved) || found) return;

        found = true;
        newGrid[ay][ax] = createCard(cards[card.abilityCard!!], 1);
        newCards.push(cards[card.abilityCard!!]);
        anyChanged = true;
      });
      if (!found) {
        inventoryDelta[card.abilityCard] = (inventoryDelta[card.abilityCard] ?? 0) + 1;
        newCards.push(cards[card.abilityCard]);
      }
    }

    if (card.ability == Ability.AutoPlace && card.abilityMatch && card.abilityCost && card.abilityCostResource) {
      card.timeLeftMs = (card.timeLeftMs ?? 0) - elapsed * global.produceModifier;
      if (card.timeLeftMs > 0) return;

      card.timeLeftMs = card.cooldownMs;
    }
  });
  return {grid: newGrid, anyChanged, inventoryDelta, newCards};
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