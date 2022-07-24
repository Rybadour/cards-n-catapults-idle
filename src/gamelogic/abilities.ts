import cardsConfig from "../config/cards";
import { createCard } from "./grid-cards";
import { RealizedCard, Grid, CardType, ResourceType, Card, CardId, ResourcesMap, defaultResourcesMap, MatchingGridShape, ResourceCost, EMPTY_CARD, MarkType, PrestigeEffects, GridMatch, ModifierBehaviour } from "../shared/types";
import global from "../config/global";
import { getRandomFromArray, using } from "../shared/utils";
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
    card.statusIcon = '';
    card.statusText = '';
    card.durabilityBonus = 1;
    card.totalStrength = 0;
    card.totalCost = 0;
    card.cardMarks = {};

    if (card.foodDrain) {
      iterateGridShape(grid, x, y, MatchingGridShape.OrthoAdjacent, (other, x2, y2) => {
        card.cardMarks[`${x2}:${y2}`] = MarkType.Associated;
      });
    }

    if (card.produceCardEffect) {
      iterateGridShape(grid, x, y, card.produceCardEffect.shape, (other, x2, y2) => {
        card.cardMarks[`${x2}:${y2}`] = MarkType.Associated;
      });
    }

    card.isDisabled = false;
    if (card.costPerSec) {
      if (!canAfford(stats.resources, card.costPerSec)) {
        card.isDisabled = true;
      }
    }

    // Should only change disabled state if the above logic didn't disable the card already
    if (card.disableShape && !card.isDisabled) {
      const isDisabling = card.disableShape.onMatch;
      const disable = card.disableShape;
      card.isDisabled = !isDisabling;
      iterateGridShapeCards(grid, x, y, card.disableShape.shape, (adj, x2, y2) => {
        let setDisabled = false;
        if (disable.maxTier && adj.tier <= disable.maxTier) {
          setDisabled = true;
        }
        if (disable.cardTypes?.includes(adj.type)) {
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

    using(card.bonusToAdjacent, (bta) => {
      iterateGridMatch(grid, x, y, bta, (adj, x2, y2) => {
        if (!adj) return;
        adj.bonus *= 1 + bta.strength;
        card.cardMarks[`${x2}:${y2}`] = MarkType.Buff;
      });
    });

    using(card.bonusToFoodCapacity, (btfc) => {
      iterateGridMatch(grid, x, y, btfc, (adj, x2, y2) => {
        if (!adj) return;
        adj.durabilityBonus *= btfc.strength;
        card.cardMarks[`${x2}:${y2}`] = MarkType.Buff;
      });
    });
    
    using(card.abilityStrengthModifier, (mod) => {
      const shouldModify = mod.behaviour == ModifierBehaviour.WhenMatching;
      let isModified = !shouldModify;
      iterateGridMatch(grid, x, y, mod.match, (adj) => {
        if (!adj || adj.isExpiredAndReserved) return;

        isModified = shouldModify;
      });

      if (isModified) {
        card.bonus *= mod.factor;
        card.statusIcon = card.abilityStrengthModifier?.statusIcon ?? '';
        card.statusText = card.abilityStrengthModifier?.statusText ?? '';
      }
    });
  });

  // Calculate per second abilities
  iterateGrid(grid, (card, x, y) => {
    if (card.isDisabled || card.isExpiredAndReserved) return;

    let numAdjacent = 0;

    using(card.passive, (p) => {
      const strength = p.scaledToResource ?
        getScaledResourceAsStrength(card, stats.resources[p.scaledToResource]) :
        p.strength * card.bonus;
      if (p.multiplyByAdjacent) {
        const mba = p.multiplyByAdjacent;
        iterateGridMatch(grid, x, y, mba, (adj, ax, ay) => {
          if (adj?.isDisabled) return;

          card.totalStrength += strength;
          card.cardMarks[`${ax}:${ay}`] = MarkType.Buff;
          numAdjacent += 1;
        });
      } else {
        card.totalStrength += strength;
      }
      results.resourcesPerSec[p.resource] += card.totalStrength;
    });

    using(card.costPerSec, (cps) => {
      const cost = cps.cost * (numAdjacent > 0 ? numAdjacent : 1);
      results.resourcesPerSec[cps.resource] -= cost;
      card.totalCost += cost;
    });
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
  effects: PrestigeEffects,
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
    using(card.costPerSec, (cps) => {
      if (card.isDisabled && canAfford(resources, cps)) {
        results.anyChanged = true;
      } else if (!card.isDisabled && resources[cps.resource] <= 0) {
        card.isDisabled = true;
        results.anyChanged = true;
      }
    });

    if (card.isDisabled) return;

    if (card.passive && card.passive.scaledToResource) {
      const strength = getScaledResourceAsStrength(card, resources[card.passive.scaledToResource]);
      if (Math.abs(card.totalStrength - strength) > 0.1) {
        results.anyChanged = true;
      }
    }

    if (card.foodDrain) {
      const adjacentFood: {
        card: RealizedCard,
        x: number,
        y: number,
      }[] = [];
      iterateGridShapeCards(grid, x, y, MatchingGridShape.OrthoAdjacent, (adjCard, ax, ay) => {
        if (adjCard.type == CardType.Food && adjCard.maxDurability && !adjCard.isDisabled) {
          adjacentFood.push({card: adjCard, x: ax, y: ay});
        } 
      }); 

      const foodDrain = (elapsed/1000 * card.foodDrain) / adjacentFood.length;
      adjacentFood.forEach(food => {
        const foodBonus = food.card.durabilityBonus * effects.bonuses.foodCapacity;
        food.card.durability = (food.card.durability ?? 0) - (foodDrain / foodBonus);
        if (food.card.durability <= 0) {
          if (food.card.shouldBeReserved) {
            food.card.isExpiredAndReserved = true;
            food.card.durability = 0;
            results.grid[food.y][food.x] = food.card;
          } else {
            results.grid[food.y][food.x] = null;
          }

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
      if (card.costPerUse) {
        if (!canAfford(resources, card.costPerUse)) {
          return;
        }
      }

      const didActivate = activateCard(results, cards, effects, card, x, y);

      if (didActivate) {
        card.timeLeftMs = card.cooldownMs;

        using(card.costPerUse, (cpu) => {
          results.resourcesSpent[cpu.resource] += cpu.cost;
          resources[cpu.resource] -= cpu.cost;
        });
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
  effects: PrestigeEffects,
  card: RealizedCard,
  x: number,
  y: number
): boolean {
  if (card.produceCardEffect) {
    const pc = card.produceCardEffect;
    const newCard = getRandomFromArray(pc.possibleCards);
    let found = false;
    iterateGridShape(results.grid, x, y, pc.shape, (adjCard, ax, ay) => {
      if (found) return;
      if (adjCard) {
        // Only place cards into slots reserved for the new card
        if (!adjCard.isExpiredAndReserved || adjCard.id !== newCard) {
          return;
        }
      }

      found = true;
      results.grid[ay][ax] = createCard(cardsConfig[newCard], 1, effects);
      results.newCards.push(cardsConfig[newCard]);
      results.anyChanged = true;
    });
    if (!found) {
      results.inventoryDelta[newCard] = (results.inventoryDelta[newCard] ?? 0) + 1;
      results.newCards.push(cardsConfig[newCard]);
    }
    return true;

  } else if (card.drawCardEffect) {
    const newCard = getRandomFromArray(card.drawCardEffect.possibleCards);
    results.inventoryDelta[newCard] = (results.inventoryDelta[newCard] ?? 0) + 1;
    results.newCards.push(cardsConfig[newCard]);
    return true;

  } else if (card.autoReplaceEffect) {
    let found = false;
    iterateGrid(results.grid, (otherCard, x2, y2) => {
      if (x == x2 && y == y2) return;
      if (!otherCard || !otherCard.isExpiredAndReserved || found) return;
      if (card.autoReplaceEffect?.cardType !== otherCard.type) return;
      if ((cards[otherCard.id] ?? 0) <= 0) return;

      found = true;

      const newCard = createCard(cardsConfig[otherCard.id], cards[otherCard.id], effects);
      newCard.shouldBeReserved = true;
      results.grid[y2][x2] = newCard;

      const quantityUsed = cards[otherCard.id] > 1 ? 1 : cards[otherCard.id];
      results.inventoryDelta[otherCard.id] = (results.inventoryDelta[otherCard.id] ?? 0) - quantityUsed;
      results.anyChanged = true;
    });
    return found;

  } else if (card.convertCardEffect) {
    const convert = card.convertCardEffect;

    let found = false;
    iterateGrid(results.grid, (other, x2, y2) => {
      if (found || !other || other.isExpiredAndReserved) return;

      if (other.id == convert.targetCard) {
        results.grid[y2][x2] = createCard(cardsConfig[convert.resultingCard], 1, effects);
        results.anyChanged = true;
        found = true;
      }
    });

    if (!found && cards[convert.targetCard] > 0) {
      results.inventoryDelta[convert.targetCard] = (results.inventoryDelta[convert.targetCard] ?? 0) - 1;
      results.inventoryDelta[convert.resultingCard] = (results.inventoryDelta[convert.resultingCard] ?? 0) + 1;
      results.anyChanged = true;
      return true;
    }

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
  if (shape == MatchingGridShape.Grid) {
    iterateGrid(grid, (adj, ax, ay) => {
      if (x == ax && y == ay) return;
      callback(adj, ax, ay);
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
    if (card && !card.isExpiredAndReserved) {
      callback(card!!, ax, ay);
    }
  });
}

function iterateGridMatch(
  grid: Grid, x: number, y: number, match: GridMatch,
  callback: (card: RealizedCard | null, x: number, y: number) => void
) {
  iterateGridShape(grid, x, y, match.shape, (card, ax, ay) => {
    const cardId = (card && !card.isExpiredAndReserved) ? card.id : EMPTY_CARD;
    if (match.cards?.includes(cardId)) {
      callback(card, ax, ay);
    }
    if (card && match.cardTypes?.includes(card.type)) {
      callback(card, ax, ay);
    }
  });
}

function canAfford(resources: ResourcesMap, cost: ResourceCost) {
  return resources[cost.resource] >= cost.cost;
}

function getScaledResourceAsStrength(card: RealizedCard, resource: number) {
  if (card.passive && card.passive.scaledToResource) {
    return card.passive.strength * card.bonus * (resource > 0 ? Math.log10(resource) : 0);
  }

  return 0;
}