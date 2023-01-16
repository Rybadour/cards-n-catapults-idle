import cardsConfig from "../config/cards";
import { createCard } from "./grid-cards";
import {
  RealizedCard, Grid, CardType, ResourceType, Card, CardId, ResourcesMap, defaultResourcesMap,
  MatchingGridShape, ResourceCost, EMPTY_CARD, MarkType, GridMatch, ModifierBehaviour
} from "../shared/types";
import { getRandomFromArray, using } from "../shared/utils";
import { StatsSlice } from "../store/stats";

export type UpdateGridTotalsResults = {
  resourcesPerSec: Record<ResourceType, number>;
  grid: Grid;
};

export function updateGridTotals(grid: Grid, cardDefs: Record<CardId, Card>, stats: StatsSlice): UpdateGridTotalsResults {
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
    const cardDef = cardDefs[card.cardId];

    if (cardDef.foodDrain) {
      iterateGridShape(grid, x, y, MatchingGridShape.OrthoAdjacent, (other, x2, y2) => {
        card.cardMarks[`${x2}:${y2}`] = MarkType.Associated;
      });
    }

    if (cardDef.produceCardEffect) {
      iterateGridShape(grid, x, y, cardDef.produceCardEffect.shape, (other, x2, y2) => {
        card.cardMarks[`${x2}:${y2}`] = MarkType.Associated;
      });
    }

    card.isDisabled = false;
    if (cardDef.costPerSec) {
      if (!canAfford(stats.resources, cardDef.costPerSec)) {
        card.isDisabled = true;
      }
    }

    // Should only change disabled state if the above logic didn't disable the card already
    if (cardDef.disableRules && !card.isDisabled) {
      card.isDisabled = cardDef.disableRules.some((dr) => {
        const isDisabling = dr.onMatch;
        let isDisabled = !isDisabling;
        iterateGridShapeCards(grid, x, y, dr.shape, (adj, x2, y2) => {
          const adjDef = cardDefs[adj.cardId];
          let setDisabled = false;
          if (dr.maxTier && adjDef.tier <= dr.maxTier) {
            setDisabled = true;
          }
          if (dr.cardTypes?.includes(adjDef.type)) {
            setDisabled = true;
          }
          if (dr.cards && dr.cards.includes(adj.cardId)) {
            setDisabled = true;
          }

          if (setDisabled) {
            isDisabled = isDisabling;
            card.cardMarks[`${x2}:${y2}`] = isDisabling ? MarkType.Exclusion : MarkType.Buff;
          }
        });
        return isDisabled;
      });
    }

    results.grid[y][x] = card;
  });

  // Apply bonuses
  iterateGrid(grid, (card, x, y) => {
    if (card.isDisabled || card.isExpiredAndReserved) return;
    const cardDef = cardDefs[card.cardId];

    using(cardDef.bonusToAdjacent, (bta) => {
      iterateGridMatch(grid, cardDefs, x, y, bta, (adj, x2, y2) => {
        if (!adj) return;
        adj.bonus *= 1 + bta.strength;
        card.cardMarks[`${x2}:${y2}`] = (bta.strength > 0 ? MarkType.Buff : MarkType.Exclusion);
      });
    });

    using(cardDef.bonusToFoodCapacity, (btfc) => {
      iterateGridMatch(grid, cardDefs, x, y, btfc, (adj, x2, y2) => {
        if (!adj) return;
        adj.durabilityBonus *= btfc.strength;
        card.cardMarks[`${x2}:${y2}`] = MarkType.Buff;
      });
    });
    
    using(cardDef.abilityStrengthModifier, (mod) => {
      const shouldModify = mod.behaviour == ModifierBehaviour.WhenMatching;
      let isModified = !shouldModify;
      iterateGridMatch(grid, cardDefs, x, y, mod.match, (adj, x2, y2) => {
        if (!adj || adj.isExpiredAndReserved) return;

        isModified = shouldModify;
        if (mod.behaviour == ModifierBehaviour.WhenMatching) {
          card.cardMarks[`${x2}:${y2}`] = (mod.factor > 0 ? MarkType.Buff : MarkType.Exclusion);
        }
      });

      if (isModified) {
        card.bonus *= mod.factor;
        card.statusIcon = mod.statusIcon ?? '';
        card.statusText = mod.statusText ?? '';
      }
    });
  });

  // Calculate per second abilities
  iterateGrid(grid, (card, x, y) => {
    if (card.isDisabled || card.isExpiredAndReserved) return;
    const cardDef = cardDefs[card.cardId];

    let numAdjacent = 0;

    using(cardDef.passive, (p) => {
      const strength = p.scaledToResource ?
        getScaledResourceAsStrength(card, cardDef, stats.resources[p.scaledToResource]) :
        p.strength * card.bonus;
      if (p.multiplyByAdjacent) {
        const mba = p.multiplyByAdjacent;
        iterateGridMatch(grid, cardDefs, x, y, mba, (adj, ax, ay) => {
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

    using(cardDef.costPerSec, (cps) => {
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
  cardDefs: Record<CardId, Card>,
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
    const cardDef = cardDefs[card.cardId];
    using(cardDef.costPerSec, (cps) => {
      if (card.isDisabled && canAfford(resources, cps)) {
        results.anyChanged = true;
      } else if (!card.isDisabled && resources[cps.resource] <= 0) {
        card.isDisabled = true;
        results.anyChanged = true;
      }
    });

    if (card.isDisabled) return;

    if (cardDef.passive && cardDef.passive.scaledToResource) {
      const strength = getScaledResourceAsStrength(card, cardDef, resources[cardDef.passive.scaledToResource]);
      if (Math.abs(card.totalStrength - strength) > 0.1) {
        results.anyChanged = true;
      }
    }

    if (cardDef.foodDrain) {
      const adjacentFood: {
        card: RealizedCard,
        x: number,
        y: number,
      }[] = [];
      iterateGridShapeCards(grid, x, y, MatchingGridShape.OrthoAdjacent, (adjCard, ax, ay) => {
        const adjDef = cardDefs[adjCard.cardId];
        if (adjDef.type == CardType.Food && adjDef.maxDurability && !adjCard.isDisabled) {
          adjacentFood.push({card: adjCard, x: ax, y: ay});
        } 
      }); 

      const foodDrain = (elapsed/1000 * cardDef.foodDrain) / adjacentFood.length;
      adjacentFood.forEach(food => {
        const foodBonus = food.card.durabilityBonus;
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

    if (cardDef.cooldownMs) {
      if ((card.timeLeftMs ?? 0) > 0) {
        card.timeLeftMs = (card.timeLeftMs ?? 0) - (elapsed * card.bonus);
        if (card.timeLeftMs > 0) return;
      }

      // Don't activate or reset cooldown if not enough resources
      if (cardDef.costPerUse) {
        if (!canAfford(resources, cardDef.costPerUse)) {
          return;
        }
      }

      const didActivate = activateCard(results, cardDefs, cards, cardDef, x, y);

      if (didActivate) {
        card.timeLeftMs = cardDef.cooldownMs;

        using(cardDef.costPerUse, (cpu) => {
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
  cardDefs: Record<CardId, Card>,
  cards: Record<string, number>,
  cardDef: Card,
  x: number,
  y: number
): boolean {
  if (cardDef.produceCardEffect) {
    const pc = cardDef.produceCardEffect;
    const newCardId = getRandomFromArray(pc.possibleCards);
    let found = false;
    iterateGridShape(results.grid, x, y, pc.shape, (adjCard, ax, ay) => {
      if (found) return;
      if (adjCard) {
        // Only place cards into slots reserved for the new card
        if (!adjCard.isExpiredAndReserved || adjCard.cardId !== newCardId) {
          return;
        }
      }

      found = true;
      const newCard = createCard(cardsConfig[newCardId], 1);
      newCard.shouldBeReserved = adjCard?.shouldBeReserved ?? false;
      results.grid[ay][ax] = newCard;
      results.newCards.push(cardsConfig[newCardId]);
      results.anyChanged = true;
    });
    if (!found) {
      results.inventoryDelta[newCardId] = (results.inventoryDelta[newCardId] ?? 0) + 1;
      results.newCards.push(cardsConfig[newCardId]);
    }
    return true;

  } else if (cardDef.drawCardEffect) {
    const newCard = getRandomFromArray(cardDef.drawCardEffect.possibleCards);
    results.inventoryDelta[newCard] = (results.inventoryDelta[newCard] ?? 0) + 1;
    results.newCards.push(cardsConfig[newCard]);
    return true;

  } else if (cardDef.autoReplaceEffect) {
    let found = false;
    iterateGrid(results.grid, (otherCard, x2, y2) => {
      const otherDef = cardDefs[otherCard.cardId];
      if (x == x2 && y == y2) return;
      if (!otherCard || !otherCard.isExpiredAndReserved || found) return;
      if (cardDef.autoReplaceEffect?.cardType !== otherDef.type) return;
      if ((cards[otherCard.cardId] ?? 0) <= 0) return;

      found = true;

      const newCard = createCard(cardsConfig[otherCard.cardId], cards[otherCard.cardId]);
      newCard.shouldBeReserved = true;
      results.grid[y2][x2] = newCard;

      const quantityUsed = cards[otherCard.cardId] > 1 ? 1 : cards[otherCard.cardId];
      results.inventoryDelta[otherCard.cardId] = (results.inventoryDelta[otherCard.cardId] ?? 0) - quantityUsed;
      results.anyChanged = true;
    });
    return found;

  } else if (cardDef.convertCardEffect) {
    const convert = cardDef.convertCardEffect;

    let found = false;
    iterateGrid(results.grid, (other, x2, y2) => {
      if (found || !other || other.isExpiredAndReserved) return;

      if (other.cardId == convert.targetCard) {
        results.grid[y2][x2] = createCard(cardsConfig[convert.resultingCard], 1);
        results.anyChanged = true;
        found = true;
      }
    });

    if (!found && cards[convert.targetCard] > 0) {
      results.inventoryDelta[convert.targetCard] = (results.inventoryDelta[convert.targetCard] ?? 0) - 1;
      results.inventoryDelta[convert.resultingCard] = (results.inventoryDelta[convert.resultingCard] ?? 0) + 1;
      results.newCards.push(cardsConfig[convert.resultingCard]);
      results.anyChanged = true;
      return true;
    }

    return found;
  }

  return false;
}

export function iterateGrid(grid: Grid, callback: (card: RealizedCard, x: number, y: number) => void) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x]) {
        callback(grid[y][x]!, x, y);
      }
    }
  }
}

interface GridPos {
  x: number;
  y: number;
}
const north = {x: 0, y: -1};
const east = {x: 1, y: 0};
const south = {x: 0, y: 1}; 
const west = {x: -1, y: 0};
const orthoAdjacent = [north, east, south, west];
const diagAdjacent = [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: -1}, {x: -1, y: 1}];
const shapeMap: Partial<Record<MatchingGridShape, GridPos[]>> = {
  [MatchingGridShape.NorthAdjacent]: [north],
  [MatchingGridShape.EastAdjacent]: [east],
  [MatchingGridShape.SouthAdjacent]: [south],
  [MatchingGridShape.WestAdjacent]: [west],
  [MatchingGridShape.SideAdjacent]: [east, west],
  [MatchingGridShape.OrthoAdjacent]: orthoAdjacent,
  [MatchingGridShape.DiagAdjacent]: diagAdjacent,
  [MatchingGridShape.AllAdjacent]: [...orthoAdjacent, ...diagAdjacent],
};
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
    let adjacent = shapeMap[shape];
    if (!adjacent) return;

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
      callback(card!, ax, ay);
    }
  });
}

function iterateGridMatch(
  grid: Grid, cardDefs: Record<CardId, Card>, x: number, y: number, match: GridMatch,
  callback: (card: RealizedCard | null, x: number, y: number) => void
) {
  iterateGridShape(grid, x, y, match.shape, (card, ax, ay) => {
    const cardId = (card && !card.isExpiredAndReserved) ? card.cardId : EMPTY_CARD;
    if (match.cards?.includes(cardId)) {
      callback(card, ax, ay);
    }
    if (card && (!!match.cardTypes || !!match.cardTiers)) {
      const matchOnType = !match.cardTypes || match.cardTypes?.includes(cardDefs[card.cardId].type);
      const matchOnTier = !match.cardTiers || match.cardTiers?.includes(cardDefs[card.cardId].tier);
      if (matchOnType && matchOnTier) {
        callback(card, ax, ay);
      }
    }
  });
}

function canAfford(resources: ResourcesMap, cost: ResourceCost) {
  return resources[cost.resource] >= cost.cost;
}

function getScaledResourceAsStrength(card: RealizedCard, cardDef: Card, resource: number) {
  if (cardDef.passive && cardDef.passive.scaledToResource) {
    return cardDef.passive.strength * card.bonus * (resource > 0 ? Math.log10(resource) : 0);
  }

  return 0;
}