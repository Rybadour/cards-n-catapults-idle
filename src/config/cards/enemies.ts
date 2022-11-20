import { Card, CardType, ResourceType } from "../../shared/types";

export default {
  rat: {
    id: "",
    name: "Rat",
    icon: "rat-black",
    tier: 1,
    type: CardType.Enemy,
    description: "Eats your food and nibbles at your ankles!",
    foodDrain: 0.2,
    passive: {
      strength: -0.25,
      resource: ResourceType.MilitaryPower,
    },
    mastery: {
      baseCost: 1,
      growth: 1,
      bonusPer: 0.1,
    }
  },
  ratDenEnemy: {
    id: "",
    name: "Rat Den",
    icon: "cave-entrance-black",
    tier: 1,
    type: CardType.Enemy,
    description: "",
    passive: {
      strength: -1.5,
      resource: ResourceType.MilitaryPower,
    },
    mastery: {
      baseCost: 1,
      growth: 1,
      bonusPer: 0.1,
    }
  }
} as Record<string, Card>;