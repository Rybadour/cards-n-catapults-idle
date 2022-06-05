export enum CardType {
  Treasure,
  Person,
  Soldier,
  Monster,
  Food,
}

export type Card = {
  id: string,
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

export type Grid = (Card | null)[][];

export type CardPack = {
  name: string,
  cost: number,
  quantity: number,
  possibleCards: [{
    card: Card,
    chance: number,
  }]
};