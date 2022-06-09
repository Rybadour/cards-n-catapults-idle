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
  icon: string,
  type: CardType,
  description: string,
  foodDrain?: number,
  durability?: number,
  ability: Ability,
  abilityStrength: number,
  abilityMatch?: CardType,
  abilityCard?: string,
}

export enum Ability {
  Produce,
  ProduceFromMatching,
  ProduceCard,
  BonusToMatching,
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