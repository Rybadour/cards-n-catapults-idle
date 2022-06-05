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
  }
};

Object.keys(cards).forEach((cardId) => cards[cardId].id = cardId);

export default cards;