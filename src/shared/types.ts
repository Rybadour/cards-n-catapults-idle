export enum CardType {
  Treasure,
  Person,
  Soldier,
  Monster,
  Food,
  Building,
}

export type Card = {
  id: string,
  name: string,
  type: CardType,
  description: string,
  ability: Ability,
  abilityStrength: number,
  abilityMatch?: CardType,
  abilityCard?: string,
}

export enum Ability {
  Produce,
  ProduceFromMatching,
  ProduceCard,
}

export type Grid = (Card | null)[][];

export type CardPack = {
  id: string,
  name: string,
  cost: number,
  quantity: number,
  possibleCards: {
    card: Card,
    chance: number,
  }[]
};