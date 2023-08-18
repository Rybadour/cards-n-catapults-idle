export enum CardType {
  Building = "Building",
  Food = "Food",
  Enemy = "Enemy",
  Person = "Person",
  Resource = "Resource",
  Soldier = "Soldier",
  Treasure = "Treasure",
}

export enum ResourceType {
  Gold = "Gold",
  Wood = "Wood",
  Tools = "Tools",
  Renown = "Renown",
  MilitaryPower = "Power",
}

export interface ResourceConfig {
  icon: string;
  sellPrice: number;
}

export type ResourcesMap = Record<ResourceType, number>;
export const defaultResourcesMap: ResourcesMap = {
  [ResourceType.Gold]: 0,
  [ResourceType.Wood]: 0,
  [ResourceType.Tools]: 0,
  [ResourceType.Renown]: 0,
  [ResourceType.MilitaryPower]: 0,
};

export type Card = {
  id: string,
  name: string,
  icon: string,
  tier: number,
  type: CardType,
  description: string,
  baseCost: number,
  costResource: ResourceType,
  costGrowth: number,
  noEffect?: true,

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
    bonusType: BonusType,
  } & GridMatch,
  bonusToFoodCapacity?: {
    strength: number,
  } & GridMatch,
  regeneration?: {
    durabilityPerSec: number,
    matchCondition: GridMatch,
  },
  degeneration?: {
    durabilityPerSec: number,
    multiplyByAdjacent?: GridMatch,
  },

  cooldownMs?: number,
  produceCardEffect?: {
    shape: MatchingGridShape,
    possibleCards: string[],
    produceByCopying?: boolean,
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
  targettedEffect?: {
    effect: TargettedEffectType,
    duration: number,
    match: GridMatch,
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
  disableRules?: ({
    onMatch: boolean,
    maxTier?: number,
  } & GridMatch)[],

  mastery: {
    baseCost: number,
    growth: number,
    bonusPer: number,
  }
};

export type GridMatch = {
  shape: MatchingGridShape,
  cards?: string[],
  cardTypes?: CardType[],
  cardTiers?: number[],
}

export type RealizedCard = {
  cardId: CardId,
  bonuses: Record<BonusType, number>,
  totalStrength: number,
  totalCost: number,
  shouldBeReserved: boolean,
  isExpiredAndReserved: boolean,
  isDisabled: boolean,
  isStatic: boolean,
  maxDurability: number,
  durability?: number,
  durabilityBonus: number,
  timeLeftMs?: number,
  cardMarks: Record<string, MarkType>,
  statusIcon: string,
  statusText: string,
  appliedEffects: Partial<Record<TargettedEffectType, AppliedEffect>>,
}

export type CardTracking = {
  numPurchased: number,
  numActive: number,
  cost: number,
}

export type AppliedEffect = {
  duration: number,
  strength: number,
}

export enum BonusType {
  Strength = "Strength",
  FoodDrain = "FoodDrain",
}

export enum Rarity {
  Common = "Common",
  Rare = "Rare",
  UltraRare = "Ultra Rare",
}

export enum MarkType {
  Buff,
  Exclusion,
  Associated,
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
  NorthAdjacent = "northAdjacent",
  EastAdjacent = "eastAdjacent",
  SouthAdjacent = "southAdjacent",
  WestAdjacent = "westAdjacent",
  SideAdjacent = "sideAdjacent",
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

export enum TargettedEffectType {
  Disable = 'disable',
}

export type Grid = (RealizedCard | null)[][];

export type CardId = string;
export type AgeId = string;
export type UpgradeId = string;

export const EMPTY_CARD = 'EMPTY';

export interface Upgrade {
  id: UpgradeId,
  name: string,
  icon: string,
  description: string,
  summary: string,
  unlockedCards?: CardId[],
  bonuses?: Partial<CardPartialBonuses>,
  cardsBonuses?: Record<CardId, Partial<CardPartialBonuses>>,
  sellResourceBonus?: Partial<Record<ResourceType, Partial<BonusValues>>>,
  dynamicSellResourceBonus?: Partial<Record<ResourceType, DynamicBonus>>,
  unlockAge?: string,
}

export type TownUpgrade = Upgrade & {
  cost: Partial<ResourcesMap>,
}

export type PrestigeUpgrade = Upgrade & {
  extraStartingCards?: Record<string, number>,
  unlockedCardPack?: string,
  randomStartingCards?: {
    possibleCards: string[],
    possibleCardRarity?: Rarity,
    amount: number,
    onlyIfDiscovered: boolean,
  },
};

export type RealizedPrestigeUpgrade = PrestigeUpgrade & {
  quantity: number;
};

export enum DynamicTriggerType {
  Resource = "Resource",  
}

export interface DynamicBonus {
  trigger: [DynamicTriggerType.Resource, ResourceType],
  getBonus: (input: number) => Partial<BonusValues>;
}

export interface BonusValues {
  baseAdd: number;
  baseMulti: number;
}

export interface CardBonuses {
  foodCapacity: BonusValues,
  goldGain: BonusValues,
  woodGain: BonusValues,
  toolGain: BonusValues,
}

export type CardPartialBonuses = {
  [Property in keyof CardBonuses]: Partial<BonusValues>;
}

export interface TechAge {
  id: AgeId,
  name: string,
  description: string,
  upgrades: Record<string, TownUpgrade>,
  megaUpgrades: Record<string, TownUpgrade>,
}

export type RealizedTechAge = {
  unlocked: boolean,
  completed: boolean,
  chosenMegaUpgrade?: UpgradeId,
} & TechAge;

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

export type GridTemplate = CardId[][];

export type CombatEncounter = {
  id: string,
  name: string,
  description: string,
  militaryStrength: number,
  staticCards: GridTemplate,
  unlockedBy: string,
  rewards: {
    cards?: Record<CardId, number>,
    unlockedCards?: CardId[],
  }
};

export interface GridCoords {
  x: number;
  y: number;
}

export enum GameFeature {
  Economy,
  Combat,
}