import { Ability, CardType } from "../shared/types";

const cards = {
  beggar: {
    name: "Beggar",
    type: CardType.Person,
    description: "Produces 1 gold/s.",
    ability: Ability.Produce,
    abilityStrength: 1,
  },
  ratSnack: {
    name: "Rat Snack",
    type: CardType.Food,
    description: "Produces 1 gold for every adjacent person.",
    ability: Ability.ProduceFromMatching,
    abilityStrength: 1,
    abilityMatch: CardType.Person,
  }
};

export default cards;