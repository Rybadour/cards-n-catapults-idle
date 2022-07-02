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
  tier: number,
  type: CardType,
  description: string,
  foodDrain?: number,
  maxDurability?: number,
  cooldownMs?: number,
  ability: Ability,
  abilityStrength: number,
  abilityMatch?: CardType[],
  abilityCards?: string[],
  abilityResource?: ResourceType,
  abilityCost?: {
    resource: ResourceType,
    cost: number,
  },
  abilityCostPerSec?: {
    resource: ResourceType,
    cost: number,
  },
  abilityShape?: MatchingGridShape,
  disableShape?: {
    onMatch: boolean,
    shape: MatchingGridShape,
    cards?: string[],
    cardType?: CardType,
    maxTier?: number,
  },
}

export type RealizedCard = Card & {
  bonus: number,
  isExpiredAndReserved: boolean,
  isDisabled: boolean,
  durability?: number,
  timeLeftMs?: number,
}

export enum Ability {
  Produce,
  ProduceFromMatching,
  ProduceCard,
  DrawCard,
  BonusToMatching,
  BonusToEmpty,
  AutoPlace,
}

export enum MatchingGridShape {
  OrthoAdjacent = "ortho",
  RowAndColumn = "rowAndColumn",
}

export enum AbilityImprovementStat {
  Strength,
  Cooldown,
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