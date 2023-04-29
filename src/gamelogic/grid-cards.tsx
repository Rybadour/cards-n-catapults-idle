import { BonusType, Card, RealizedCard } from "../shared/types";

export function createCard(card: Card): RealizedCard {
  return {
    cardId: card.id,
    bonuses: {
      [BonusType.Strength]: 1,
      [BonusType.FoodDrain]: 1,
    },
    totalStrength: 0,
    totalCost: 0,
    shouldBeReserved: false,
    isDisabled: false,
    isExpiredAndReserved: false,
    isStatic: false,
    maxDurability: (card.maxDurability ?? 0),
    durability: (card.maxDurability ?? 0),
    durabilityBonus: 1,
    timeLeftMs: card.cooldownMs,
    cardMarks: {},
    statusIcon: '',
    statusText: '',
    appliedEffects: {},
  };
}