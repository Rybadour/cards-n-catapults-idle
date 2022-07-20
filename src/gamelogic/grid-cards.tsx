import { Card, PrestigeEffects, RealizedCard } from "../shared/types";

export function createCard(card: Card, quantity: number, prestigeEffects: PrestigeEffects): RealizedCard {
  const durability = (card.maxDurability ?? 0) * prestigeEffects.bonuses.foodCapacity;
  return {
    ...card,
    maxDurability: durability,
    bonus: 1,
    totalStrength: 0,
    totalCost: 0,
    isDisabled: false,
    isExpiredAndReserved: false,
    durability: (quantity >= 1 ? 1 : quantity) * durability,
    durabilityBonus: 1,
    timeLeftMs: card.cooldownMs,
    cardMarks: {},
  };
}