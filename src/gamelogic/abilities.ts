import cardsConfig from "../config/cards";
import { createCard } from "./grid-cards";
import { Ability, RealizedCard, Grid, CardType, ResourceType, Card, CardId, ResourcesMap, defaultResourcesMap } from "../shared/types";
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
  resourcesSpent: ResourcesMap,
  anyChanged: boolean,
  inventoryDelta: Record<CardId, number>,
  newCards: Card[],
}

export function updateGrid(
  grid: Grid,
  resources: Record<ResourceType, number>,
  cards: Record<string, number>,
  elapsed: number
): UpdateGridResults {
  const results = {
    grid: [...grid],
    resourcesSpent: { ...defaultResourcesMap },
    anyChanged: false,
    inventoryDelta: {},
    newCards: [],
  } as UpdateGridResults;

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
          results.grid[food.y][food.x] = food.card;
          results.anyChanged = true;
        }
      })
    }

    if (card.cooldownMs) {
      if ((card.timeLeftMs ?? 0) > 0) {
        card.timeLeftMs = (card.timeLeftMs ?? 0) - elapsed * global.produceModifier;
        if (card.timeLeftMs > 0) return;
      }

      // Don't activate or reset cooldown if not enough resources
      if (card.abilityCost && card.abilityCostResource) {
        if (resources[card.abilityCostResource] < card.abilityCost) {
          return;
        }
      }

      const didActivate = activateCard(results, cards, card, x, y);

      if (didActivate) {
        card.timeLeftMs = card.cooldownMs;

        if (card.abilityCost && card.abilityCostResource) {
          results.resourcesSpent[card.abilityCostResource] += card.abilityCost;
          resources[card.abilityCostResource] -= card.abilityCost;
        }
      } else {
        card.timeLeftMs = 0;
      }
    }
  });
  return results;
}

function activateCard(
  results: UpdateGridResults,
  cards: Record<string, number>,
  card: RealizedCard,
  x: number,
  y: number
): boolean {
  if (card.ability == Ability.ProduceCard && card.abilityCard) {
    let found = false;
    iterateAdjacent(results.grid, x, y, (adjCard, ax, ay) => {
      if ((adjCard && !adjCard.isExpiredAndReserved) || found) return;

      found = true;
      results.grid[ay][ax] = createCard(cardsConfig[card.abilityCard!!], 1);
      results.newCards.push(cardsConfig[card.abilityCard!!]);
      results.anyChanged = true;
    });
    if (!found) {
      results.inventoryDelta[card.abilityCard] = (results.inventoryDelta[card.abilityCard] ?? 0) + 1;
      results.newCards.push(cardsConfig[card.abilityCard]);
    }
    return true;
  }

  if (card.ability == Ability.AutoPlace && card.abilityMatch) {
    let found = false;
    iterateGrid(results.grid, (otherCard, x2, y2) => {
      if (x == x2 && y == y2) return;
      if (!otherCard || !otherCard.isExpiredAndReserved || found) return;
      if (otherCard.type != card.abilityMatch) return;
      if ((cards[otherCard.id] ?? 0) <= 0) return;

      found = true;
      results.grid[y2][x2] = createCard(cardsConfig[otherCard.id], cards[otherCard.id]);
      results.inventoryDelta[otherCard.id] = (results.inventoryDelta[otherCard.id] ?? 0) - 1;
      results.anyChanged = true;
    });
    return found;
  }

  return false;
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