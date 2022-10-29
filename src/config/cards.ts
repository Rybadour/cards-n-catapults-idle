import { Card, CardType, EMPTY_CARD, MatchingGridShape, ModifierBehaviour, ResourceType } from "../shared/types";
import { formatNumber, using } from "../shared/utils";

const cards: Record<string, Card> = {
  beggar: {
    id: "",
    name: "Beggar",
    icon: "bindle",
    tier: 1,
    type: CardType.Person,
    description: "Produces {{passiveAmount}}.",
    foodDrain: 0.2,
    passive: {
      strength: 1,
      resource: ResourceType.Gold,
    },
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
    passive: {
      strength: 0.2,
      resource: ResourceType.Gold,
      multiplyByAdjacent: {
        shape: MatchingGridShape.AllAdjacent,
        cards: ['forest'],
      }
    },
    bonusToAdjacent: {
      strength: 0.2,
      shape: MatchingGridShape.AllAdjacent,
      cards: ['forest'],
    },
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
    description: "Produces {{passiveAmount}} except when near low tier cards. When not fed it's production is reduced to {{modifiedStrength}}.",
    foodDrain: 0.5,
    passive: {
      strength: 3,
      resource: ResourceType.Gold,
    },
    abilityStrengthModifier: {
      behaviour: ModifierBehaviour.WhenNotMatching,
      factor: 0.333,
      statusIcon: 'opened-food-can',
      statusText: '(Hungry)',
      match: {
        shape: MatchingGridShape.OrthoAdjacent,
        cardTypes: [CardType.Food],
      }
    },
    disableShape: {
      onMatch: true,
      shape: MatchingGridShape.OrthoAdjacent,
      maxTier: 1,
    },
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
    passive: {
      strength: 3,
      resource: ResourceType.Gold,
      scaledToResource: ResourceType.Wood,
    },
    bonusToAdjacent: {
      strength: 1,
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
    icon: "rat",
    tier: 1,
    type: CardType.Food,
    description: "Produces {{passiveAmount}} {{passiveAdjacent}}",
    maxDurability: 12,
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
    maxDurability: 8,
    bonusToAdjacent: {
      strength: 0.2,
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
    description: "Produces {{passiveAmount}} {{passiveAdjacent}}.",
    maxDurability: 10,
    passive: {
      strength: 0.1,
      resource: ResourceType.Gold,
      multiplyByAdjacent: {
        shape: MatchingGridShape.AllAdjacent,
        cards: ['mushrooms', 'forest', EMPTY_CARD],
      }
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
    bonusToAdjacent: {
      strength: 1,
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
    bonusToAdjacent: {
      strength: 2,
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
    description: "Produces {{passiveAmount}}.",
    passive: {
      strength: 1,
      resource: ResourceType.Wood,
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
    icon: "cave-entrance",
    tier: 1,
    type: CardType.Building,
    description: "{{produceCard}} every {{cooldownSecs}} seconds.",
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
  forager: {
    id: "",
    name: "Forager",
    icon: "granary",
    tier: 2,
    type: CardType.Building,
    description: "{{produceCard}} when next to a forest every {{cooldownSecs}} seconds.",
    produceCardEffect: {
      shape: MatchingGridShape.OrthoAdjacent,
      possibleCards: ['mushrooms', 'berries'],
    },
    cooldownMs: 10000,
    disableShape: {
      onMatch: false,
      shape: MatchingGridShape.OrthoAdjacent,
      cards: ['forest'],
    },
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
    drawCardEffect: {
      possibleCards: ['haunch'],
    },
    disableShape: {
      onMatch: false,
      shape: MatchingGridShape.OrthoAdjacent,
      cardTypes: [CardType.Food],
    },
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
    bonusToAdjacent: {
      strength: 0.25,
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
    bonusToAdjacent: {
      strength: 1,
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

Object.keys(cards)
  .forEach((cardId) => {
    const card = cards[cardId];
    card.id = cardId;

    function replaceInDescription(variable: string, value: string) {
      card.description = card.description.replaceAll(`{{${variable}}}`, value);
    }

    using(card.passive, (p) => {
      let multiplyText = '';
      using(p.multiplyByAdjacent, (mba) => {
        let matchingText = '';
        if (mba.cardTypes) {
          matchingText = mba.cardTypes.map(ct => String(ct)).join(' or ');
        } else if (mba.cards) {
          matchingText = mba.cards
            .map(c => c === EMPTY_CARD ? 'empty tile' : cards[c].name)
            .join(' or ');
        }

        const shape = 'nearby' + (mba.shape == MatchingGridShape.AllAdjacent ? ', in all directions' : '');
        multiplyText = ` for each ${matchingText} ${shape}`;
      });
      replaceInDescription('passiveAdjacent', multiplyText);
    });

    using(card.abilityStrengthModifier, (mod) => {
      if (card.passive) { 
        replaceInDescription('modifiedStrength', formatNumber(card.passive.strength * mod.factor, 0, 1));
      }
    });

    using(card.bonusToAdjacent, (bta) => {
      let matching = '';
      if (bta.cardTypes) {
        matching = bta.cardTypes.map(ct => String(ct)).join(' or ');
      } else if (bta.cards) {
        matching = bta.cards.map(c => cards[c].name).join(' or ');
      }

      const prefix = (bta.shape === MatchingGridShape.RowAndColumn ?
        `Improves all ${matching} cards in the same row and column` :
        `Improves all nearby ${matching} cards`
      );

      replaceInDescription(
        'bonusToAdjacent',
        `${prefix} by {{bonusToAdjacentAmount}}.`
      );
    });

    using(card.produceCardEffect, (prod) => {
      const possibleCards = prod.possibleCards.map(c => cards[c].name).join(' or ');
      replaceInDescription('produceCard', `Generates a ${possibleCards} card nearby`);
    });

    using(card.drawCardEffect, (draw) => {
      const possibleCards = draw.possibleCards.map(c => cards[c].name).join(' or ');
      replaceInDescription('drawCard', `Generates a ${possibleCards} card `);
    });

    using(card.costPerSec, (cps) => {
      replaceInDescription('costPerSec', `${cps.cost} ${cps.resource}/s`);
    });
    using(card.costPerUse, (cpu) => {
      replaceInDescription('costPerUse', cpu.cost + ' ' + cpu.resource);
    });
  });

export default cards;