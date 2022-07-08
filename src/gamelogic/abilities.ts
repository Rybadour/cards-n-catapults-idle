import cardsConfig from "../config/cards";
import { createCard } from "./grid-cards";
import { Ability, RealizedCard, Grid, CardType, ResourceType, Card, CardId, ResourcesMap, defaultResourcesMap, MatchingGridShape, ResourceCost, EMPTY_CARD, MarkType } from "../shared/types";
import global from "../config/global";
import { getRandomFromArray } from "../shared/utils";
import { StatsContext } from "../contexts/stats";

export type UpdateGridTotalsResults = {
  resourcesPerSec: Record<ResourceType, number>;
  grid: Grid;
};

export function updateGridTotals(grid: Grid, stats: StatsContext): UpdateGridTotalsResults {
  const results = {
    grid: [...grid],
    resourcesPerSec: { ...defaultResourcesMap },
  } as UpdateGridTotalsResults;

  // Disable and reset
  iterateGrid(grid, (card, x, y) => {
    card.bonus = 1;
    card.cardMarks = {};

    card.isDisabled = false;
    if (card.abilityCostPerSec) {
      if (!canAfford(stats.resources, card.abilityCostPerSec)) {
        card.isDisabled = true;
      }
    }

    // Should only change disabled state if the above logic didn't disable the card already
    if (card.disableShape && !card.isDisabled) {
      const isDisabling = card.disableShape.onMatch;
      const disable = card.disableShape;
      card.isDisabled = !isDisabling;
      iterateGridShapeCards(grid, x, y, card.disableShape.shape, (adj, x2, y2) => {
        if (adj.isExpiredAndReserved) return;

        let setDisabled = false;
        if (disable.maxTier && adj.tier <= disable.maxTier) {
          setDisabled = true;
        }
        if (disable.cardType && adj.type == disable.cardType) {
          setDisabled = true;
        }
        if (disable.cards && disable.cards.includes(adj.id)) {
          setDisabled = true;
        }

        if (setDisabled) {
          card.isDisabled = isDisabling;
          card.cardMarks[`${x2}:${y2}`] = isDisabling ? MarkType.Exclusion : MarkType.Buff;
        }
      });
    }

    results.grid[y][x] = card;
  });

  // Apply bonuses
  iterateGrid(grid, (card, x, y) => {
    if (card.isDisabled || card.isExpiredAndReserved) return;

    if (card.ability == Ability.BonusToMatching && card.abilityMatch && card.abilityShape) {
      iterateGridShapeCards(grid, x, y, card.abilityShape, (adj, x2, y2) => {
        if (card.abilityMatch?.includes(adj.type)) {
          adj.bonus *= 1 + card.abilityStrength;
          card.cardMarks[`${x2}:${y2}`] = MarkType.Buff;
        }
      });
    }
    
    if (card.abilityStrengthModifier) {
      const mod = card.abilityStrengthModifier;
      let isModified = !mod.whenMatching;
      iterateGridShapeCards(grid, x, y, mod.gridShape, (adj) => {
        if (mod.types.includes(adj.type)) {
          isModified = mod.whenMatching;
        }
      });

      if (isModified) {
        card.bonus *= mod.factor;
      }
    }
  });

  // Calculate per second abilities
  iterateGrid(grid, (card, x, y) => {
    if (card.isDisabled || card.isExpiredAndReserved) return;

    const strength = card.abilityStrength * card.bonus;

    if (card.ability == Ability.Produce && card.abilityResource) {
      results.resourcesPerSec[card.abilityResource] += strength;

    } else if (card.ability == Ability.ProduceFromMatching && card.abilityShape) {
      iterateGridShapeCards(grid, x, y, card.abilityShape, (adj, x2, y2) => {
        if (adj.isDisabled) return;

        if (card.abilityMatch?.includes(adj.type) && card.abilityResource) {
          results.resourcesPerSec[card.abilityResource] += strength;
          card.cardMarks[`${x2}:${y2}`] = MarkType.Buff;
        }
      });

    } else if (card.ability == Ability.ProduceFromCards && card.abilityShape && card.abilityCards && card.abilityResource) {
      iterateGridShape(grid, x, y, card.abilityShape, (adj, x2, y2) => {
        if (adj && adj.isDisabled) return;

        const cardId = (adj && !adj.isExpiredAndReserved) ? adj.id : EMPTY_CARD;
        if (card.abilityCards!!.includes(cardId)) {
          results.resourcesPerSec[card.abilityResource!!] += strength;
          card.cardMarks[`${x2}:${y2}`] = MarkType.Buff;
        }
      });
    }

    if (card.abilityCostPerSec) {
      results.resourcesPerSec[card.abilityCostPerSec.resource] -= card.abilityCostPerSec.cost;
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
    if (card.abilityCostPerSec) {
      if (card.isDisabled && canAfford(resources, card.abilityCostPerSec)) {
        results.anyChanged = true;
      } else if (!card.isDisabled && resources[card.abilityCostPerSec.resource] <= 0) {
        card.isDisabled = true;
        results.anyChanged = true;
      }
    }

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
        card.timeLeftMs = (card.timeLeftMs ?? 0) - (elapsed * card.bonus * global.produceModifier);
        if (card.timeLeftMs > 0) return;
      }

      // Don't activate or reset cooldown if not enough resources
      if (card.abilityCost) {
        if (!canAfford(resources, card.abilityCost)) {
          return;
        }
      }

      const didActivate = activateCard(results, cards, card, x, y);

      if (didActivate) {
        card.timeLeftMs = card.cooldownMs;

        if (card.abilityCost) {
          results.resourcesSpent[card.abilityCost.resource] += card.abilityCost.cost;
          resources[card.abilityCost.resource] -= card.abilityCost.cost;
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
const diagAdjacent = [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: -1}, {x: -1, y: 1}];
function iterateGridShape(
  grid: Grid, x: number, y: number, shape: MatchingGridShape,
  callback: (card: RealizedCard | null, x: number, y: number) => void
) {
  if (shape == MatchingGridShape.RowAndColumn) {
    for (let x2 = 0; x2 < grid[y].length; x2++) {
      if (x2 == x) continue;

      callback(grid[y][x2], x2, y);
    }
    for (let y2 = 0; y2 < grid.length; y2++) {
      if (y2 == y) continue;

      callback(grid[y2][x], x, y2);
    }
  } else {
    let adjacent: {x: number, y: number}[] = [];
    if (shape === MatchingGridShape.OrthoAdjacent || shape === MatchingGridShape.AllAdjacent) {
      adjacent = adjacent.concat(orthoAdjacent);
    }
    if (shape === MatchingGridShape.DiagAdjacent || shape === MatchingGridShape.AllAdjacent) {
      adjacent = adjacent.concat(diagAdjacent);
    }

    adjacent.forEach(adj => {
      const ax = x + adj.x, ay = y + adj.y;
      if (0 > ay || ay >= grid.length || 0 > ax || ax >= grid[ay].length) {
        return;
      }

      callback(grid[ay][ax], ax, ay);
    });
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

function canAfford(resources: ResourcesMap, cost: ResourceCost) {
  return resources[cost.resource] >= cost.cost;
}