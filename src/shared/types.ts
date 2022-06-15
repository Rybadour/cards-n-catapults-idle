export enum CardType {
  Treasure,
  Person,
  Soldier,
  Monster,
  Food,
  Building,
  Resource,
}

export enum ResourceType {
  Gold,
  Wood,
}

export type Card = {
  id: string,
  name: string,
  icon: string,
  type: CardType,
  description: string,
  foodDrain?: number,
  maxDurability?: number,
  cooldownMs?: number,
  ability: Ability,
  abilityStrength: number,
  abilityMatch?: CardType,
  abilityCard?: string,
  abilityResource?: ResourceType,
}

export type RealizedCard = Card & {
  durability?: number,
  modifiedStrength: number,
  timeLeftMs?: number,
}

export enum Ability {
  Produce,
  ProduceFromMatching,
  ProduceCard,
  BonusToMatching,
}

export type Grid = (RealizedCard | null)[][];

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