import { Card, CardId, CardType, MatchingGridShape, ModifierBehaviour, ResourceType, TargettedEffectType } from "../../shared/types";

const hungryDisable = {
  onMatch: false,
  shape: MatchingGridShape.OrthoAdjacent,
  cardTypes: [CardType.Food],
};

const cards: Record<CardId, Card> = {
  militia: {
    id: "",
    name: "Miltia",
    icon: "farmer",
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
    disableRules: [hungryDisable],
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  pikeman: {
    id: "",
    name: "Pikeman",
    icon: "pikeman",
    tier: 1,
    type: CardType.Soldier,
    description: "Produces {{passiveAmount}} for each nearby enemy.",
    foodDrain: 0.2,
    passive: {
      resource: ResourceType.MilitaryPower,
      strength: 0.5,
      multiplyByAdjacent: {
        shape: MatchingGridShape.AllAdjacent,
        cardTypes: [CardType.Enemy],
      },
    },
    costPerSec: {
      cost: 1,
      resource: ResourceType.Gold,
    },
    disableRules: [hungryDisable],
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  bolasThrower: {
    id: "",
    name: "Bolas Thrower",
    icon: "bolas",
    tier: 2,
    type: CardType.Soldier,
    description: "Stuns a nearby enemy every {{cooldownSecs}} for 0.5s.",
    foodDrain: 1,
    cooldownMs: 3000,
    targettedEffect: {
      effect: TargettedEffectType.Disable,
      duration: 1500,
      match: {
        shape: MatchingGridShape.AllAdjacent,
        cardTypes: [CardType.Enemy],
      },
    },
    costPerSec: {
      cost: 2,
      resource: ResourceType.Gold,
    },
    disableRules: [hungryDisable],
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
    } 
  },
  rockThrower: {
    id: "",
    name: "Rock Thrower",
    icon: "throwing-ball",
    tier: 1,
    type: CardType.Soldier,
    description: "Produces some military power",
    foodDrain: 1,
    passive: {
      resource: ResourceType.MilitaryPower,
      strength: 1.5,
    },
    costPerSec: {
      cost: 2,
      resource: ResourceType.Gold,
    },
    disableRules: [
      {
        onMatch: false,
        shape: MatchingGridShape.DiagAdjacent,
      },  
      hungryDisable
    ],
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
      strength: 4,
      resource: ResourceType.MilitaryPower,
    },
    costPerSec: {
      cost: 3,
      resource: ResourceType.Gold,
    },
    disableRules: [
      hungryDisable,
      {
        onMatch: false,
        shape: MatchingGridShape.NorthAdjacent,
        cardTypes: [CardType.Enemy],
      },
      {
        onMatch: true,
        shape: MatchingGridShape.SideAdjacent,
        cardTypes: [CardType.Enemy],
      },
    ],
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
      strength: 3,
      resource: ResourceType.MilitaryPower,
    },
    abilityStrengthModifier: {
      behaviour: ModifierBehaviour.WhenMatching,
      factor: 1.5,
      match: {
        shape: MatchingGridShape.OrthoAdjacent,
        cards: ['archer'],
      },
      statusIcon: 'crossed-swords',
      statusText: 'Supported'
    },
    costPerSec: {
      cost: 2,
      resource: ResourceType.Gold,
    },
    disableRules: [{
      onMatch: true,
      shape: MatchingGridShape.OrthoAdjacent,
      cardTypes: [CardType.Enemy],
    }, hungryDisable],
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
    }
  },
};

export default cards;