
import { Card, CardType, MatchingGridShape, ResourceType } from "../../shared/types";

const hungryDisable = {
  onMatch: false,
  shape: MatchingGridShape.OrthoAdjacent,
  cardTypes: [CardType.Food],
};

export default {
  pikeman: {
    id: "",
    name: "Pikeman",
    icon: "pikeman",
    tier: 1,
    type: CardType.Soldier,
    description: "Produces {{passiveAmount}}.",
    foodDrain: 0.2,
    passive: {
      strength: 1,
      resource: ResourceType.MilitaryPower,
    },
    costPerSec: {
      cost: 1,
      resource: ResourceType.Gold,
    },
    disableShape: hungryDisable,
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  cavalry: {
    id: "",
    name: "Cavalry",
    icon: "mounted-knight",
    tier: 3,
    type: CardType.Soldier,
    description: "Produces {{passiveAmount}}.",
    foodDrain: 1,
    passive: {
      strength: 10,
      resource: ResourceType.MilitaryPower,
    },
    costPerSec: {
      cost: 3,
      resource: ResourceType.Gold,
    },
    disableShape: hungryDisable,
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  archer: {
    id: "",
    name: "Archer",
    icon: "bowman",
    tier: 1,
    type: CardType.Soldier,
    description: "Produces {{passiveAmount}}.",
    foodDrain: 0.2,
    passive: {
      strength: 5,
      resource: ResourceType.MilitaryPower,
    },
    costPerSec: {
      cost: 2,
      resource: ResourceType.Gold,
    },
    disableShape: hungryDisable,
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
    }
  },
} as Record<string, Card>;