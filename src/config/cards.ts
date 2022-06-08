import { Ability, Card, CardType } from "../shared/types";

const cards: Record<string, Card> = {
  beggar: {
    id: "",
    name: "Beggar",
    type: CardType.Person,
    description: "Produces 1 gold/s.",
    ability: Ability.Produce,
    abilityStrength: 1,
  },
  ratSnack: {
    id: "",
    name: "Rat Snack",
    type: CardType.Food,
    description: "Produces 1 gold for every adjacent person.",
    ability: Ability.ProduceFromMatching,
    abilityStrength: 1,
    abilityMatch: CardType.Person,
  },
  ratDen: {
    id: "",
    name: "Rat Den",
    type: CardType.Building,
    description: "Generates 1 Rat Snack1",
    ability: Ability.ProduceCard,
    abilityStrength: 1,
    abilityCard: "ratSnack",
  },
  peasant: {
    id: "",
    name: "Peasant",
    type: CardType.Person,
    description: "Generates 3 gold/s.",
    ability: Ability.Produce,
    abilityStrength: 3,
  }
};

Object.keys(cards).forEach((cardId) => cards[cardId].id = cardId);

export default cards;