import cardsConfig from "../config/cards";
import { createCard } from "./grid-cards";
import { Ability, RealizedCard, Grid, CardType, ResourceType, Card, CardId, ResourcesMap, defaultResourcesMap, DisableBehaviour, MatchingGridShape } from "../shared/types";
import global from "../config/global";
import { getRandomFromArray } from "../shared/utils";

export type UpdateGridTotalsResults = {
  resourcesPerSec: Record<ResourceType, number>;
  grid: Grid;
};

export function updateGridTotals(grid: Grid): UpdateGridTotalsResults {
  const results = {
    grid: [...grid],
    resourcesPerSec: { ...defaultResourcesMap },
  } as UpdateGridTotalsResults;

  iterateGrid(grid, (card, x, y) => {
    if (card.disableBehaviour && card.disableShape) {
      const isDisabling = card.disableBehaviour == DisableBehaviour.Near;
      card.isDisabled = !isDisabling;
      iterateGridShapeCards(grid, x, y, card.disableShape, (adj) => {
        if (adj.isExpiredAndReserved) return;

        if (card.disableMaxTier && adj.tier <= card.disableMaxTier) {
          card.isDisabled = isDisabling;
        }
        if (card.disableCardType && adj.type == card.disableCardType) {
          card.isDisabled = isDisabling;
        }
        if (card.disableCards && card.disableCards.includes(adj.id)) {
          card.isDisabled = isDisabling;
        }
      });
      results.grid[y][x] = card;
    }
  });

  iterateGrid(grid, (card, x, y) => {
    if (card.isDisabled || card.isExpiredAndReserved) return;

    if (card.ability == Ability.Produce && card.abilityResource) {
      results.resourcesPerSec[card.abilityResource] += card.abilityStrength;
    } else if (card.ability == Ability.ProduceFromMatching && card.abilityShape) {
      iterateGridShapeCards(grid, x, y, card.abilityShape, (adj) => {
        if (adj.isDisabled) return;

        if (card.abilityMatch?.includes(adj.type) && card.abilityResource) {
          results.resourcesPerSec[card.abilityResource] += card.abilityStrength;
        }
      });
    } else if (card.ability == Ability.BonusToMatching && card.abilityShape) {
      iterateGridShapeCards(grid, x, y, card.abilityShape, (adj) => {
        if (adj.isDisabled) return;

        // TODO: Time to stop doing double the logic here. Should just increase strength in a different pass
        if (card.abilityMatch?.includes(adj.type) && adj.abilityResource) {
          results.resourcesPerSec[adj.abilityResource] += (adj.abilityStrength * card.abilityStrength);
        }
      });
    } else if (card.ability == Ability.BonusToEmpty && card.abilityResource && card.abilityShape) {
      iterateGridShape(grid, x, y, card.abilityShape, (adj) => {
        if (!adj || adj.isExpiredAndReserved) {
          results.resourcesPerSec[card.abilityResource!!] += card.abilityStrength;
        }
      });
    }
  });

  return results;
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
    if (card.isDisabled) return;

    if (card.foodDrain) {
      const adjacentFood: {
        card: RealizedCard,
        x: number,
        y: number,
      }[] = [];
      iterateGridShapeCards(grid, x, y, MatchingGridShape.OrthoAdjacent, (adjCard, ax, ay) => {
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
  if (card.ability == Ability.ProduceCard && card.abilityCards && card.abilityShape) {
    const newCard = getRandomFromArray(card.abilityCards);
    let found = false;
    iterateGridShape(results.grid, x, y, card.abilityShape, (adjCard, ax, ay) => {
      if ((adjCard && !adjCard.isExpiredAndReserved) || found) return;

      found = true;
      results.grid[ay][ax] = createCard(cardsConfig[newCard], 1);
      results.newCards.push(cardsConfig[newCard]);
      results.anyChanged = true;
    });
    if (!found) {
      results.inventoryDelta[newCard] = (results.inventoryDelta[newCard] ?? 0) + 1;
      results.newCards.push(cardsConfig[newCard]);
    }
    return true;
  }

  if (card.ability == Ability.DrawCard && card.abilityCards) {
    const newCard = getRandomFromArray(card.abilityCards);
    results.inventoryDelta[newCard] = (results.inventoryDelta[newCard] ?? 0) + 1;
    results.newCards.push(cardsConfig[newCard]);
    return true;
  }

  if (card.ability == Ability.AutoPlace && card.abilityMatch) {
    let found = false;
    iterateGrid(results.grid, (otherCard, x2, y2) => {
      if (x == x2 && y == y2) return;
      if (!otherCard || !otherCard.isExpiredAndReserved || found) return;
      if (!card.abilityMatch?.includes(otherCard.type)) return;
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

const orthoAdjacent = [{x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: -1, y: 0}];
function iterateGridShape(
  grid: Grid, x: number, y: number, shape: MatchingGridShape,
  callback: (card: RealizedCard | null, x: number, y: number) => void
) {
  if (shape == MatchingGridShape.OrthoAdjacent) {
    orthoAdjacent.forEach(adj => {
      const ax = x + adj.x, ay = y + adj.y;
      if (0 > ay || ay >= grid.length || 0 > ax || ax >= grid[ay].length) {
        return;
      }

      callback(grid[ay][ax], ax, ay);
    });
  } else if (shape == MatchingGridShape.RowAndColumn) {
    for (let x2 = 0; x2 < grid[y].length; x2++) {
      if (x2 == x) continue;

      callback(grid[y][x2], x2, y);
    }
    for (let y2 = 0; y2 < grid.length; y2++) {
      if (y2 == y) continue;

      callback(grid[y2][x], x, y2);
    }
  }
}

function iterateGridShapeCards(
  grid: Grid, x: number, y: number, shape: MatchingGridShape,
  callback: (card: RealizedCard, x: number, y: number) => void
) {
  iterateGridShape(grid, x, y, shape, (card, ax, ay) => {
    if (card) {
      callback(card!!, ax, ay);
    }
  });
}