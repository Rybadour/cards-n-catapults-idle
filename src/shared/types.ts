export enum CardType {
  Building = "Building",
  Food = "Food",
  Monster = "Monster",
  Person = "Person",
  Resource = "Resource",
  Soldier = "Soldier",
  Treasure = "Treasure",
}

export enum ResourceType {
  Gold = "gold",
  Wood = "wood",
}

export type ResourcesMap = Record<ResourceType, number>;
export const defaultResourcesMap: ResourcesMap = {
  [ResourceType.Gold]: 0,
  [ResourceType.Wood]: 0,
};

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
  abilityCost?: number,
  abilityCostResource?: ResourceType,
}

export type RealizedCard = Card & {
  modifiedStrength: number,
  isExpiredAndReserved: boolean,
  durability?: number,
  timeLeftMs?: number,
}

export enum Ability {
  Produce,
  ProduceFromMatching,
  ProduceCard,
  BonusToMatching,
  AutoPlace,
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

export type CardId = string;