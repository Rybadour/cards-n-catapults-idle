export enum CardType {
  Treasure,
  Person,
  Soldier,
  Monster,
  Food,
}

export type Card = {
  name: string,
  type: CardType,
  description: string,
  ability: Ability,
  abilityStrength: number,
  abilityMatch?: CardType,
}

export enum Ability {
  Produce,
  ProduceFromMatching,
}