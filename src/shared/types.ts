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
  abilityCost?: ResourceCost,
  abilityCostPerSec?: ResourceCost,
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

export type ResourceCost = {
  resource: ResourceType,
  cost: number,
}

export enum Ability {
  None,
  Produce,
  ProduceFromMatching,
  ProduceFromCards,
  ProduceCard,
  DrawCard,
  BonusToMatching,
  AutoPlace,
}

export enum MatchingGridShape {
  OrthoAdjacent = "orthoAdjacent",
  DiagAdjacent = "diagAdjacent",
  AllAdjacent = "allAdjacent",
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
  baseCost: number,
  costGrowth: number,
  quantity: number,
  possibleCards: {
    card: Card,
    chance: number,
  }[]
};

export type RealizedCardPack = CardPack & {
  cost: number,
  amountBought: number,
};

export type CardId = string;

export const EMPTY_CARD = 'EMPTY';