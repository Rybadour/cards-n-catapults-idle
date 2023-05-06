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
    description: "Produces {{passiveAmount}} for each nearby food item and speeds up farms by 50%.",
    foodDrain: 0.2,
    baseCost: 100,
    costGrowth: 1.1,
    passive: {
      strength: 0.5,
      resource: ResourceType.Gold,
      multiplyByAdjacent: {
        shape: MatchingGridShape.OrthoAdjacent,
        cardTypes: [CardType.Food],
      }
    },
    bonusToAdjacent: {
      strength: 0.5,
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
    description: "Produce {{passiveAmount}} and {{bonusToAdjacent}}",
    foodDrain: 0.3,
    baseCost: 50,
    costGrowth: 2,
    passive: {
      strength: 0.65,
      resource: ResourceType.Gold,
      multiplyByAdjacent: {
        shape: MatchingGridShape.AllAdjacent,
        cards: ['forest'],
      }
    },
    bonusToAdjacent: {
      strength: 0.5,
      bonusType: BonusType.Strength,
      shape: MatchingGridShape.AllAdjacent,
      cards: ['forest'],
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
    description: "Improves nearby people by 50%.",
    foodDrain: 0.5,
    baseCost: 1000,
    costGrowth: 1.2,
    bonusToAdjacent: {
      strength: 0.5,
      bonusType: BonusType.Strength,
      shape: MatchingGridShape.OrthoAdjacent,
      cardTypes: [CardType.Person],
    },
    disableRules: [hungryDisable],
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
    }
  },
  peasant: {
    id: "",
    name: "Peasant",
    icon: "farmer",
    tier: 2,
    type: CardType.Person,
    description: "Produces {{passiveAmount}} except when near low tier cards.",
    foodDrain: 0.5,
    baseCost: 100,
    costGrowth: 1.1,
    passive: {
      strength: 3,
      resource: ResourceType.Gold,
    },
    disableRules: [{
      onMatch: true,
      shape: MatchingGridShape.OrthoAdjacent,
      maxTier: 1,
    }, hungryDisable],
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
  pauline: {
    id: "",
    name: "Pauline Bunion",
    icon: "magic-axe",
    tier: 3,
    type: CardType.Person,
    description: "The woman, the myth, the legend. Produces Gold based on total Wood and improves nearby Forests by {{bonusToAdjacentAmount}}.",
    foodDrain: 0.1,
    baseCost: 100,
    costGrowth: 1.1,
    passive: {
      strength: 3,
      resource: ResourceType.Gold,
      scaledToResource: ResourceType.Wood,
    },
    bonusToAdjacent: {
      strength: 1,
      bonusType: BonusType.Strength,
      shape: MatchingGridShape.AllAdjacent,
      cards: ['forest'],
    },
    mastery: {
      baseCost: 1,
      growth: 2,
      bonusPer: 0.2,
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
    costGrowth: 1.1,
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
    baseCost: 50,
    costGrowth: 1.05,
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
    baseCost: 64,
    costGrowth: 1.1,
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
    costGrowth: 1.1,
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
    costGrowth: 1.1,
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.25,
    }
  },
  ambrosia: {
    id: "",
    name: "Ambrosia",
    icon: "cool-spices",
    tier: 4,
    type: CardType.Food,
    description: "Food of the gods. {{bonusToAdjacentAmount}} bonus to any nearby Person and {{bonusToFoodAmount}} to all food capacity.",
    maxDurability: 1000,
    baseCost: 100,
    costGrowth: 1.1,
    bonusToAdjacent: {
      strength: 2,
      bonusType: BonusType.Strength,
      shape: MatchingGridShape.AllAdjacent,
      cardTypes: [CardType.Person],
    },
    bonusToFoodCapacity: {
      strength: 2,
      shape: MatchingGridShape.Grid,
      cardTypes: [CardType.Food],
    },
    mastery: {
      baseCost: 1,
      growth: 2,
      bonusPer: 0.25,
    }
  },
  forest: {
    id: "",
    name: "Forest",
    icon: "birch-trees",
    tier: 2,
    type: CardType.Resource,
    description: "Generates wood when near a lumberjack or lumbermill.",
    baseCost: 100,
    costGrowth: 1.1,
    passive: {
      strength: 0.5,
      resource: ResourceType.Wood,
      multiplyByAdjacent: {
        shape: MatchingGridShape.AllAdjacent,
        cards: ['lumberjack', 'lumbermill'],
      }
    },
    mastery: {
      baseCost: 2,
      growth: 2,
      bonusPer: 0.1,
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
    costGrowth: 1.1,
    autoReplaceEffect: {
      cardType: CardType.Food,
    },
    costPerUse: {
      resource: ResourceType.Wood,
      cost: 1,
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
    cooldownMs: 60000,
    baseCost: 120,
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
    description: "{{bonusToAdjacent}}. Uses {{costPerSec}}.",
    baseCost: 100,
    costGrowth: 1.1,
    bonusToAdjacent: {
      strength: 0.25,
      bonusType: BonusType.Strength,
      shape: MatchingGridShape.RowAndColumn,
      cardTypes: [CardType.Person, CardType.Building],
    },
    costPerSec: {
      resource: ResourceType.Wood,
      cost: 2,
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
  schoolHouse: {
    id: "",
    name: "School House",
    icon: "family-house",
    tier: 3,
    type: CardType.Building,
    description: "Knowledge is power! Converts a Beggar into a Peasant every {{cooldownSecs}}s and improves all people by {{bonusToAdjacentAmount}}.",
    cooldownMs: 10000,
    baseCost: 100,
    costGrowth: 1.1,
    bonusToAdjacent: {
      strength: 1,
      bonusType: BonusType.Strength,
      shape: MatchingGridShape.Grid,
      cardTypes: [CardType.Person]
    },
    convertCardEffect: {
      targetCard: 'beggar',
      resultingCard: 'peasant',
    },
    mastery: {
      baseCost: 1,
      growth: 2,
      bonusPer: 0.25,
    }
  }
};

export default cards;