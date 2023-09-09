import { Card, CardType, ResourceType } from "../../shared/types";

export type EnemyCardId = "rat" | "ratQueen" | "ratDenEnemy";

export default {
  rat: {
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
  ratQueen: {
    name: "Rat Queen",
    icon: "rat-red",
    tier: 2,
    type: CardType.Enemy,
    description: "",
    passive: {
      strength: -5,
      resource: ResourceType.MilitaryPower,
    },
    mastery: {
      baseCost: 1,
      growth: 1,
      bonusPer: 0.1,
    }
  },
  ratDenEnemy: {
    name: "Rat Den",
    icon: "cave-entrance-black",
    tier: 2,
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
} satisfies Record<EnemyCardId, Omit<Card, "id">>;