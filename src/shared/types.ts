import cards from "../config/cards";

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
  rarity: Rarity,
  foodDrain?: number,
  maxDurability?: number,

  passive?: {
    strength: number,
    resource: ResourceType,
    multiplyByAdjacent?: GridMatch,
    scaledToResource?: ResourceType,
  },
  bonusToAdjacent?: {
    strength: number,
  } & GridMatch,
  bonusToFoodCapacity?: {
    strength: number,
  } & GridMatch,

  cooldownMs?: number,
  produceCardEffect?: {
    shape: MatchingGridShape,
    possibleCards: string[],
  },
  autoReplaceEffect?: {
    cardType: CardType,
  },
  drawCardEffect?: {
    possibleCards: string[],
  },
  convertCardEffect?: {
    targetCard: string,
    resultingCard: string,
  },

  costPerUse?: ResourceCost,
  costPerSec?: ResourceCost,
  multiplyCostPerAdjacent?: boolean,
  abilityStrengthModifier?: {
    behaviour: ModifierBehaviour,
    factor: number,
    match: GridMatch,
    statusIcon: string,
    statusText: string,
  },
  disableShape?: {
    onMatch: boolean,
    maxTier?: number,
  } & GridMatch,
}

export type GridMatch = {
  shape: MatchingGridShape,
  cards?: string[],
  cardTypes?: CardType[],
}

export type RealizedCard = Card & {
  bonus: number,
  totalStrength: number,
  totalCost: number,
  isExpiredAndReserved: boolean,
  isDisabled: boolean,
  durability?: number,
  durabilityBonus: number,
  timeLeftMs?: number,
  cardMarks: Record<string, MarkType>,
  statusIcon: string,
  statusText: string,
}

export enum Rarity {
  Common = "Common",
  UltraRare = "Ultra Rare",
}

export enum MarkType {
  Buff,
  Exclusion
}

export type ResourceCost = {
  resource: ResourceType,
  cost: number,
}

export enum MatchingGridShape {
  OrthoAdjacent = "orthoAdjacent",
  DiagAdjacent = "diagAdjacent",
  AllAdjacent = "allAdjacent",
  RowAndColumn = "rowAndColumn",
  Grid = "Grid",
}

export enum AbilityImprovementStat {
  Strength,
  Cooldown,
}

export enum ModifierBehaviour {
  WhenMatching,
  WhenNotMatching,
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
  randomStartingCards?: {
    possibleCards: string[],
    amount: number,
    onlyIfDiscovered: boolean,
  },
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
  goldGain: number,
  cardPackCostReduction: number,
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
  refund: number,
  numBought: number,
  remainingUpgrades: string[],
};