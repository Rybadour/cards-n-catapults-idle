import { Ability, Card, CardType, ResourceType } from "../shared/types";

const cards: Record<string, Card> = {
  beggar: {
    id: "",
    name: "Beggar",
    icon: "bindle",
    type: CardType.Person,
    description: "Produces 1 gold/s.",
    foodDrain: 0.1,
    ability: Ability.Produce,
    abilityStrength: 1,
    abilityResource: ResourceType.Gold,
  },
  ratSnack: {
    id: "",
    name: "Rat Snack",
    icon: "rat",
    type: CardType.Food,
    description: "Produces 0.5 gold for every adjacent person.",
    maxDurability: 10,
    ability: Ability.ProduceFromMatching,
    abilityStrength: 0.5,
    abilityMatch: CardType.Person,
  },
  ratDen: {
    id: "",
    name: "Rat Den",
    icon: "cave-entrance",
    type: CardType.Building,
    description: "Generates 1 Rat Snack1",
    ability: Ability.ProduceCard,
    abilityStrength: 1,
    abilityCard: "ratSnack",
    cooldownMs: 10000,
  },
  peasant: {
    id: "",
    name: "Peasant",
    icon: "farmer",
    type: CardType.Person,
    description: "Generates 3 gold/s.",
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
    description: "Increases adjacent persons abilities by 50%.",
    maxDurability: 5,
    ability: Ability.BonusToMatching,
    abilityStrength: 1.5,
    abilityMatch: CardType.Person,
  },
  forest: {
    id: "",
    name: "Forest",
    icon: "birch-trees",
    type: CardType.Resource,
    description: "Produces 1 wood/s",
    ability: Ability.Produce,
    abilityStrength: 1,
    abilityResource: ResourceType.Wood,
  },
};

Object.keys(cards).forEach((cardId) => cards[cardId].id = cardId);

export default cards;