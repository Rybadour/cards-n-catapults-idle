import { Ability, Card, CardType, EMPTY_CARD, MatchingGridShape, Rarity, ResourceType } from "../shared/types";
import { formatNumber } from "../shared/utils";

const cards: Record<string, Card> = {
  beggar: {
    id: "",
    name: "Beggar",
    icon: "bindle",
    tier: 1,
    type: CardType.Person,
    rarity: Rarity.Common,
    description: "Produces {{abilityStrength}} gold/s.",
    foodDrain: 0.2,
    ability: Ability.Produce,
    abilityStrength: 1,
    abilityResource: ResourceType.Gold,
  },
  peasant: {
    id: "",
    name: "Peasant",
    icon: "farmer",
    tier: 2,
    type: CardType.Person,
    rarity: Rarity.Common,
    description: "Generates {{abilityStrength}} gold/s except when near low tier cards. When not fed with food it's production is reduced to {{modifiedStrength}} gold/s.",
    foodDrain: 0.5,
    ability: Ability.Produce,
    abilityStrength: 3,
    abilityResource: ResourceType.Gold,
    abilityStrengthModifier: {
      factor: 0.333,
      whenMatching: false,
      types: [CardType.Food],
      gridShape: MatchingGridShape.OrthoAdjacent,
    },
    disableShape: {
      onMatch: true,
      shape: MatchingGridShape.OrthoAdjacent,
      maxTier: 1,
    }
  },
  bard: {
    id: "",
    name: "Bard",
    icon: "lyre",
    tier: 2,
    type: CardType.Person,
    rarity: Rarity.Common,
    description: "Generates {{abilityStrength}} renown/s for each person next to them, in all directions.",
    foodDrain: 0.2,
    ability: Ability.ProduceFromMatching,
    abilityStrength: 2,
    abilityResource: ResourceType.Renown,
    abilityMatch: [CardType.Person],
    abilityShape: MatchingGridShape.AllAdjacent,
  },
  ratSnack: {
    id: "",
    name: "Rat Snack",
    icon: "rat",
    tier: 1,
    type: CardType.Food,
    rarity: Rarity.Common,
    description: "Produces {{abilityStrength}} gold for every adjacent person.",
    maxDurability: 12,
    ability: Ability.ProduceFromMatching,
    abilityStrength: 0.25,
    abilityMatch: [CardType.Person],
    abilityResource: ResourceType.Gold,
    abilityShape: MatchingGridShape.OrthoAdjacent,
  },
  berries: {
    id: "",
    name: "Berries",
    icon: "berries-bowl",
    tier: 2,
    type: CardType.Food,
    rarity: Rarity.Common,
    description: "Increases adjacent persons abilities by {{abilityPercent}}.",
    maxDurability: 8,
    ability: Ability.BonusToMatching,
    abilityStrength: 0.2,
    abilityMatch: [CardType.Person],
    abilityShape: MatchingGridShape.OrthoAdjacent,
  },
  mushrooms: {
    id: "",
    name: "Mushrooms",
    icon: "mushrooms",
    tier: 1,
    type: CardType.Food,
    rarity: Rarity.Common,
    description: "Produces {{abilityStrength}} gold for every nearby empty, mushroom, or forest tile. Considers both orthogonal and diagonal tiles.",
    maxDurability: 10,
    ability: Ability.ProduceFromCards,
    abilityStrength: 0.1,
    abilityCards: ['mushrooms', 'forest', EMPTY_CARD],
    abilityResource: ResourceType.Gold,
    abilityShape: MatchingGridShape.AllAdjacent,
  },
  haunch: {
    id: "",
    name: "Meat Haunch",
    icon: "ham-shank",
    tier: 2,
    type: CardType.Food,
    rarity: Rarity.Common,
    description: "Improves nearby people by {{abilityPercent}}",
    maxDurability: 5,
    ability: Ability.BonusToMatching,
    abilityStrength: 1,
    abilityMatch: [CardType.Person],
    abilityShape: MatchingGridShape.OrthoAdjacent,
  },
  bread: {
    id: "",
    name: "Bread",
    icon: "sliced-bread",
    tier: 2,
    type: CardType.Food,
    rarity: Rarity.Common,
    description: "Just food, that's it.",
    maxDurability: 40,
    ability: Ability.None,
    abilityStrength: 0,
  },
  ambrosia: {
    id: "",
    name: "Ambrosia",
    icon: "cool-spices",
    tier: 4,
    type: CardType.Food,
    rarity: Rarity.UltraRare,
    description: "Food of the gods. Massive bonus to adjacent people and bonus to all food.",
    maxDurability: 1000,
    ability: Ability.BonusToMatching,
    abilityStrength: 0,
  },
  forest: {
    id: "",
    name: "Forest",
    icon: "birch-trees",
    tier: 2,
    type: CardType.Resource,
    rarity: Rarity.Common,
    description: "Produces {{abilityStrength}} wood/s",
    ability: Ability.Produce,
    abilityStrength: 1,
    abilityResource: ResourceType.Wood,
  },
  ratDen: {
    id: "",
    name: "Rat Den",
    icon: "cave-entrance",
    tier: 1,
    type: CardType.Building,
    rarity: Rarity.Common,
    description: "Generates 1 Rat Snack nearby every {{cooldownSecs}} seconds.",
    ability: Ability.ProduceCard,
    abilityStrength: 1,
    abilityCards: ["ratSnack"],
    abilityShape: MatchingGridShape.OrthoAdjacent,
    cooldownMs: 20000,
  },
  campfire: {
    id: "",
    name: "Campfire",
    icon: "campfire",
    tier: 1,
    type: CardType.Building,
    rarity: Rarity.Common,
    description: "Automatically replaces food anywhere on the grid every {{cooldownSecs}} seconds for {{abilityCostValue}} wood.",
    ability: Ability.AutoPlace,
    abilityStrength: 1,
    abilityMatch: [CardType.Food],
    abilityCost: {
      resource: ResourceType.Wood,
      cost: 1,
    },
    cooldownMs: 5000,
  },
  forager: {
    id: "",
    name: "Forager",
    icon: "granary",
    tier: 2,
    type: CardType.Building,
    rarity: Rarity.Common,
    description: "Generates Mushrooms and Berries when next to a forest every {{cooldownSecs}} seconds.",
    ability: Ability.ProduceCard,
    abilityStrength: 1,
    abilityCards: ['mushrooms', 'berries'],
    abilityShape: MatchingGridShape.OrthoAdjacent,
    cooldownMs: 10000,
    disableShape: {
      onMatch: false,
      shape: MatchingGridShape.OrthoAdjacent,
      cards: ['forest'],
    }
  },
  pigPen: {
    id: "",
    name: "Pig Pen",
    icon: "pig",
    tier: 1,
    type: CardType.Building,
    rarity: Rarity.Common,
    description: "Generates meat every {{cooldownSecs}}s while consuming food.",
    foodDrain: 2,
    ability: Ability.DrawCard,
    abilityStrength: 1,
    abilityCards: ['haunch'],
    disableShape: {
      onMatch: false,
      shape: MatchingGridShape.OrthoAdjacent,
      cardType: CardType.Food,
    },
    cooldownMs: 5000,
  },
  carpenter: {
    id: "",
    name: "Carpenter",
    icon: "hammer-nails",
    tier: 2,
    type: CardType.Building,
    rarity: Rarity.Common,
    description: "Improves buildings and people in the same row and column by {{abilityPercent}}.",
    ability: Ability.BonusToMatching,
    abilityStrength: 0.25,
    abilityMatch: [CardType.Person, CardType.Building],
    abilityCostPerSec: {
      resource: ResourceType.Wood,
      cost: 2,
    },
    abilityShape: MatchingGridShape.RowAndColumn,
  },
  lumbermill: {
    id: "",
    name: "Lumbermill",
    icon: "cleaver",
    tier: 2,
    type: CardType.Building,
    rarity: Rarity.Common,
    description: "Sells 1 wood/s for 2 gold/s for each adjacent forest, in all directions",
    ability: Ability.ProduceFromCards,
    abilityStrength: 2,
    abilityResource: ResourceType.Gold,
    abilityMultiplyByAdjacent: true,
    abilityCards: ['forest'],
    abilityCostPerSec: {
      resource: ResourceType.Wood,
      cost: 0.5,
    },
    abilityShape: MatchingGridShape.AllAdjacent,
  }
};

Object.keys(cards)
  .forEach((cardId) => {
    const card = cards[cardId];
    card.id = cardId;

    function replaceInDescription(variable: string, value: string) {
      card.description = card.description.replaceAll(`{{${variable}}}`, value);
    }

    replaceInDescription('abilityStrength', String(card.abilityStrength));
    if (card.cooldownMs) {
      replaceInDescription('cooldownSecs', formatNumber(card.cooldownMs / 1000, 0, 1));
    }
    if (card.ability == Ability.BonusToMatching) {
      replaceInDescription('abilityPercent', formatNumber(card.abilityStrength * 100, 0, 0)+"%");
    }
    if (card.abilityCost) {
      replaceInDescription('abilityCostValue', formatNumber(card.abilityCost.cost, 0, 1));
    }
    if (card.abilityStrengthModifier) {
      replaceInDescription('modifiedStrength', formatNumber(card.abilityStrength * card.abilityStrengthModifier.factor, 0, 1));
    }
  });

export default cards;