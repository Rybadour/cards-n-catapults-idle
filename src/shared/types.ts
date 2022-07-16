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
  Gold = "Gold",
  Wood = "Wood",
  Renown = "Renown",
}

export type ResourcesMap = Record<ResourceType, number>;
export const defaultResourcesMap: ResourcesMap = {
  [ResourceType.Gold]: 0,
  [ResourceType.Wood]: 0,
  [ResourceType.Renown]: 0,
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
  abilityMultiplyByAdjacent?: boolean,
  abilityStrengthModifier?: {
    factor: number,
    whenMatching: boolean,
    types: CardType[],
    gridShape: MatchingGridShape,
  },
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
  totalStrength: number,
  totalCost: number,
  isExpiredAndReserved: boolean,
  isDisabled: boolean,
  durability?: number,
  timeLeftMs?: number,
  cardMarks: Record<string, MarkType>,
}

export enum MarkType {
  Buff,
  Exclusion
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

export type Pack<T> = {
  id: string,
  name: string,
  baseCost: number,
  costGrowth: number,
  quantity: number,
  unlocked: boolean,
  possibleThings: {
    thing: T,
    chance: number,
  }[]
};

export type RealizedPack<T> = Pack<T> & {
  cost: number,
  numBought: number,
};

export type CardPack = Pack<Card>;
export type RealizedCardPack = RealizedPack<Card>;

export type CardId = string;

export const EMPTY_CARD = 'EMPTY';

export type PrestigeUpgrade = {
  id: string,
  name: string,
  icon: string,
  description: string,
  summary: string,
  extraStartingCards?: Record<string, number>,
  unlockedCardPack?: string,
  bonus?: {
    amount: number,
    field: keyof(PrestigeBonuses),
  },
};

export type RealizedPrestigeUpgrade = PrestigeUpgrade & {
  quantity: number;
};

export type PrestigeEffects = {
  extraStartCards: Record<string, number>,
  unlockedCardPacks: string[],
  bonuses: PrestigeBonuses,
}

export type PrestigeBonuses = {
  foodCapacity: number,
  startingGold: number,
}

export type PrestigePack = {
  id: string,
  name: string,
  baseCost: number,
  costGrowth: number,
  upgrades: {
    upgrade: PrestigeUpgrade,
    quantity: number,
  }[]
};

export type RealizedPrestigePack = PrestigePack & {
  cost: number,
  numBought: number,
  remainingUpgrades: string[],
};