import { Ability, Card, CardType, ResourceType } from "../shared/types";
import { formatNumber } from "../shared/utils";

const cards: Record<string, Card> = {
  beggar: {
    id: "",
    name: "Beggar",
    icon: "bindle",
    type: CardType.Person,
    description: "Produces {{abilityStrength}} gold/s.",
    foodDrain: 0.2,
    ability: Ability.Produce,
    abilityStrength: 1,
    abilityResource: ResourceType.Gold,
  },
  ratSnack: {
    id: "",
    name: "Rat Snack",
    icon: "rat",
    type: CardType.Food,
    description: "Produces {{abilityStrength}} gold for every adjacent person.",
    maxDurability: 1,
    ability: Ability.ProduceFromMatching,
    abilityStrength: 0.25,
    abilityMatch: CardType.Person,
    abilityResource: ResourceType.Gold,
  },
  ratDen: {
    id: "",
    name: "Rat Den",
    icon: "cave-entrance",
    type: CardType.Building,
    description: "Generates 1 Rat Snack nearby every {{cooldownSecs}} seconds.",
    ability: Ability.ProduceCard,
    abilityStrength: 1,
    abilityCard: "ratSnack",
    cooldownMs: 20000,
  },
  peasant: {
    id: "",
    name: "Peasant",
    icon: "farmer",
    type: CardType.Person,
    description: "Generates {{abilityStrength}} gold/s.",
    foodDrain: 0.5,
    ability: Ability.Produce,
    abilityStrength: 3,
    abilityResource: ResourceType.Gold,
  },
  berries: {
    id: "",
    name: "Berries",
    icon: "berries-bowl",
    type: CardType.Food,
    description: "Increases adjacent persons abilities by {{abilityPercent}}.",
    maxDurability: 8,
    ability: Ability.BonusToMatching,
    abilityStrength: 0.2,
    abilityMatch: CardType.Person,
  },
  forest: {
    id: "",
    name: "Forest",
    icon: "birch-trees",
    type: CardType.Resource,
    description: "Produces {{abilityStrength}} wood/s",
    ability: Ability.Produce,
    abilityStrength: 1,
    abilityResource: ResourceType.Wood,
  },
  campfire: {
    id: "",
    name: "Campfire",
    icon: "campfire",
    type: CardType.Building,
    description: "Automatically places food when used up for a cost of wood.",
    ability: Ability.AutoPlace,
    abilityStrength: 1,
    abilityMatch: CardType.Food,
    abilityCost: 1,
    abilityCostResource: ResourceType.Wood,
    cooldownMs: 5000,
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