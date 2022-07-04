import { Ability, Card, CardType, MatchingGridShape, ResourceType } from "../shared/types";
import { formatNumber } from "../shared/utils";

const cards: Record<string, Card> = {
  beggar: {
    id: "",
    name: "Beggar",
    icon: "bindle",
    tier: 1,
    type: CardType.Person,
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
    description: "Generates {{abilityStrength}} gold/s except when near low tier cards.",
    foodDrain: 0.5,
    ability: Ability.Produce,
    abilityStrength: 3,
    abilityResource: ResourceType.Gold,
    disableShape: {
      onMatch: true,
      shape: MatchingGridShape.OrthoAdjacent,
      maxTier: 1,
    }
  },
  ratSnack: {
    id: "",
    name: "Rat Snack",
    icon: "rat",
    tier: 1,
    type: CardType.Food,
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
    description: "Produces {{abilityStrength}} gold for every nearby empty tile.",
    maxDurability: 10,
    ability: Ability.BonusToEmpty,
    abilityStrength: 0.1,
    abilityResource: ResourceType.Gold,
    abilityShape: MatchingGridShape.OrthoAdjacent,
  },
  haunch: {
    id: "",
    name: "Meat Haunch",
    icon: "ham-shank",
    tier: 2,
    type: CardType.Food,
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
    description: "Just food, that's it.",
    maxDurability: 40,
    ability: Ability.None,
    abilityStrength: 0,
  },
  forest: {
    id: "",
    name: "Forest",
    icon: "birch-trees",
    tier: 2,
    type: CardType.Resource,
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
    description: "Automatically places food when used up for a cost of wood.",
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
    description: "Generates Mushrooms and Berries when next to a forest.",
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
    description: "Improves buildings and people in the same row and column by {{abilityPercent}}.",
    ability: Ability.BonusToMatching,
    abilityStrength: 0.2,
    abilityMatch: [CardType.Person, CardType.Building],
    abilityCostPerSec: {
      resource: ResourceType.Wood,
      cost: 2,
    },
    abilityShape: MatchingGridShape.RowAndColumn,
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
  });

export default cards;