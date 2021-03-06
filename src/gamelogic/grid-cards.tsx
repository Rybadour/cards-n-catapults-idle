import { Card, PrestigeEffects, RealizedCard } from "../shared/types";

export function createCard(card: Card, quantity: number): RealizedCard {
  return {
    ...card,
    maxDurability: card.maxDurability,
    bonus: 1,
    totalStrength: 0,
    totalCost: 0,
    shouldBeReserved: false,
    isDisabled: false,
    isExpiredAndReserved: false,
    durability: (quantity >= 1 ? 1 : quantity) * (card.maxDurability ?? 0),
    durabilityBonus: 1,
    timeLeftMs: card.cooldownMs,
    cardMarks: {},
    statusIcon: '',
    statusText: '',
  };
}