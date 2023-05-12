import { BonusType, Card, CardId, CardType, MatchingGridShape, ResourceType } from "../../shared/types";

const hungryDisable = {
  onMatch: false,
  shape: MatchingGridShape.OrthoAdjacent,
  cardTypes: [CardType.Food],
};

const cards: Record<CardId, Card> = {
  farmer: {
    id: "",
    name: "Farmer",
    icon: "farmer",
    tier: 1,
    type: CardType.Person,
    description: "Improves the speed of farms by 500%.",
    foodDrain: 0.2,
    baseCost: 200,
    costGrowth: 1.1,
    bonusToAdjacent: {
      strength: 5,
      bonusType: BonusType.Strength,
      shape: MatchingGridShape.OrthoAdjacent,
      cards: ['farm'],
    },
    disableRules: [hungryDisable],
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  lumberjack: {
    id: "",
    name: "Lumberjack",
    icon: "axe-in-stump",
    tier: 2,
    type: CardType.Person,
    description: "Produce {{passiveAmount}} per adjacent forest.",
    foodDrain: 0.3,
    baseCost: 50,
    costGrowth: 2,
    passive: {
      strength: 0.5,
      resource: ResourceType.Wood,
      multiplyByAdjacent: {
        shape: MatchingGridShape.AllAdjacent,
        cards: ['forest'],
      }
    },
    disableRules: [hungryDisable],
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  soothsayer: {
    id: "",
    name: "Soothsayer",
    icon: "sun-priest",
    tier: 2,
    type: CardType.Person,
    description: "Generates renown for every adjacent person but costs gold.",
    foodDrain: 0.2,
    baseCost: 1000,
    costGrowth: 1.5,
    passive: {
      strength: 1,
      resource: ResourceType.Renown,
      multiplyByAdjacent: {
        shape: MatchingGridShape.AllAdjacent,
        cardTypes: [CardType.Person],
      }
    },
    costPerSec: {
      resource: ResourceType.Gold,
      cost: 0.5,
    },
    multiplyCostPerAdjacent: true,
    disableRules: [hungryDisable],
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  bard: {
    id: "",
    name: "Bard",
    icon: "lyre",
    tier: 2,
    type: CardType.Person,
    description: "Produces {{passiveAmount}}.",
    foodDrain: 0.2,
    baseCost: 100,
    costGrowth: 1.1,
    passive: {
      strength: 2,
      resource: ResourceType.Renown,
      multiplyByAdjacent: {
        shape: MatchingGridShape.AllAdjacent,
        cardTypes: [CardType.Person],
      }
    },
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  ratSnack: {
    id: "",
    name: "Rat Snack",
    icon: "rat-red",
    tier: 1,
    type: CardType.Food,
    description: "Produces {{passiveAmount}} {{passiveAdjacent}}",
    maxDurability: 12,
    baseCost: 100,
    costGrowth: 1,
    passive: {
      strength: 0.25,
      resource: ResourceType.Gold,
      multiplyByAdjacent: {
        shape: MatchingGridShape.OrthoAdjacent,
        cardTypes: [CardType.Person],
      }
    },
    mastery: {
      baseCost: 8,
      growth: 2,
      bonusPer: 0.05,
    }
  },
  berries: {
    id: "",
    name: "Berries",
    icon: "berries-bowl",
    tier: 2,
    type: CardType.Food,
    description: "{{bonusToAdjacent}}",
    maxDurability: 5,
    baseCost: 30,
    costGrowth: 1,
    bonusToAdjacent: {
      strength: 0.5,
      bonusType: BonusType.Strength,
      shape: MatchingGridShape.OrthoAdjacent,
      cardTypes: [CardType.Person],
    },
    mastery: {
      baseCost: 4,
      growth: 2,
      bonusPer: 0.05,
    }
  },
  mushrooms: {
    id: "",
    name: "Mushrooms",
    icon: "mushrooms",
    tier: 1,
    type: CardType.Food,
    description: "Improves nearby people and regenerates when next to other mushrooms.",
    maxDurability: 6,
    baseCost: 80,
    costGrowth: 1.1,
    bonusToAdjacent: {
      strength: 0.2,
      bonusType: BonusType.Strength,
      shape: MatchingGridShape.OrthoAdjacent,
      cardTypes: [CardType.Person],
    },
    regeneration: {
      durabilityPerSec: 0.3,
      matchCondition: {
        shape: MatchingGridShape.AllAdjacent,
        cards: ['mushrooms'],
      }
    },
    mastery: {
      baseCost: 4,
      growth: 2,
      bonusPer: 0.05,
    }
  },
  corn: {
    id: "",
    name: "Corn",
    icon: "corn",
    tier: 1,
    type: CardType.Food,
    description: "Reduces the food drain of nearby people.",
    maxDurability: 16,
    baseCost: 80,
    costGrowth: 1,
    bonusToAdjacent: {
      strength: 0.5,
      bonusType: BonusType.FoodDrain,
      shape: MatchingGridShape.OrthoAdjacent,
    },
    mastery: {
      baseCost: 4,
      growth: 2,
      bonusPer: 0.05,
    }
  },
  haunch: {
    id: "",
    name: "Meat Haunch",
    icon: "ham-shank",
    tier: 2,
    type: CardType.Food,
    description: "{{bonusToAdjacent}}",
    maxDurability: 5,
    baseCost: 100,
    costGrowth: 1,
    bonusToAdjacent: {
      strength: 1,
      bonusType: BonusType.Strength,
      shape: MatchingGridShape.OrthoAdjacent,
      cardTypes: [CardType.Person],
    },
    mastery: {
      baseCost: 3,
      growth: 2,
      bonusPer: 0.075,
    }
  },
  bread: {
    id: "",
    name: "Bread",
    icon: "sliced-bread",
    tier: 2,
    type: CardType.Food,
    description: "Just food, that's it.",
    maxDurability: 40,
    baseCost: 100,
    costGrowth: 1,
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.25,
    }
  },
  ratDen: {
    id: "",
    name: "Rat Den",
    icon: "cave-entrance-blue",
    tier: 1,
    type: CardType.Building,
    description: "{{produceCard}} every {{cooldownSecs}} seconds.",
    baseCost: 100,
    costGrowth: 1.1,
    produceCardEffect: {
      shape: MatchingGridShape.OrthoAdjacent,
      possibleCards: ["ratSnack"],
    },
    cooldownMs: 20000,
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.15,
    }
  },
  campfire: {
    id: "",
    name: "Campfire",
    icon: "campfire",
    tier: 1,
    type: CardType.Building,
    description: "Automatically replaces food anywhere on the grid every {{cooldownSecs}} seconds for {{costPerUse}}.",
    baseCost: 300,
    costGrowth: 2,
    autoReplaceEffect: {
      cardType: CardType.Food,
    },
    costPerUse: {
      resource: ResourceType.Wood,
      cost: 10,
    },
    cooldownMs: 5000,
    mastery: {
      baseCost: 1,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  farm: {
    id: "",
    name: "Farm",
    icon: "plow",
    tier: 2,
    type: CardType.Building,
    description: "Copies any fruit or vegetable nearby every {{cooldownSecs}}s.",
    cooldownMs: 20000,
    baseCost: 250,
    costGrowth: 1.1,
    produceCardEffect: {
      shape: MatchingGridShape.OrthoAdjacent,
      possibleCards: ['berries', 'mushrooms', 'corn'],
      produceByCopying: true,
    },
    mastery: {
      baseCost: 1,
      growth: 2,
      bonusPer: 1,
    },
  },
  forager: {
    id: "",
    name: "Forager",
    icon: "granary",
    tier: 2,
    type: CardType.Building,
    description: "{{produceCard}} when next to a forest every {{cooldownSecs}} seconds.",
    baseCost: 20,
    costGrowth: 1.5,
    produceCardEffect: {
      shape: MatchingGridShape.OrthoAdjacent,
      possibleCards: ['mushrooms', 'berries'],
    },
    cooldownMs: 10000,
    disableRules: [{
      onMatch: false,
      shape: MatchingGridShape.OrthoAdjacent,
      cards: ['forest'],
    }],
    mastery: {
      baseCost: 1,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  pigPen: {
    id: "",
    name: "Pig Pen",
    icon: "pig",
    tier: 1,
    type: CardType.Building,
    description: "{{drawCard}} every {{cooldownSecs}} seconds while consuming food.",
    foodDrain: 2,
    baseCost: 100,
    costGrowth: 1.1,
    drawCardEffect: {
      possibleCards: ['haunch'],
    },
    disableRules: [{
      onMatch: false,
      shape: MatchingGridShape.OrthoAdjacent,
      cardTypes: [CardType.Food],
    }],
    cooldownMs: 5000,
    mastery: {
      baseCost: 1,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  carpenter: {
    id: "",
    name: "Carpenter",
    icon: "hammer-nails",
    tier: 2,
    type: CardType.Building,
    description: "Makes tools and boosts all people and buildings in the same row and column.",
    baseCost: 500,
    costGrowth: 2,
    bonusToAdjacent: {
      strength: 1,
      bonusType: BonusType.Strength,
      shape: MatchingGridShape.RowAndColumn,
      cardTypes: [CardType.Person, CardType.Building],
    },
    passive: {
      strength: 0.05,
      resource: ResourceType.Tools,
    },
    costPerSec: {
      resource: ResourceType.Wood,
      cost: 4,
    },
    mastery: {
      baseCost: 1,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  lumbermill: {
    id: "",
    name: "Lumbermill",
    icon: "cleaver",
    tier: 2,
    type: CardType.Building,
    description: "Sells {{costPerSec}} for {{passiveAmount}} for each adjacent forest, in all directions",
    baseCost: 100,
    costGrowth: 1.1,
    passive: {
      strength: 2,
      resource: ResourceType.Gold,
      multiplyByAdjacent: {
        shape: MatchingGridShape.AllAdjacent,
        cards: ['forest'],
      }
    },
    costPerSec: {
      resource: ResourceType.Wood,
      cost: 0.5,
    },
    mastery: {
      baseCost: 1,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  forest: {
    id: "",
    name: "Forest",
    icon: "forest",
    tier: 2,
    type: CardType.Resource,
    description: "Forest of trees",
    baseCost: 0,
    costGrowth: 0,
    noEffect: true,

    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
    }
  },
};

export default cards;