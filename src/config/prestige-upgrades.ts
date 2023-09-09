import { mapValues } from "lodash";
import { Rarity, Upgrade } from "../shared/types";

export const PRESTIGE_COST = {
  base: 100,
  growthFactor: 5,
  growthExp: 3,
};
export const PRESTIGE_REFUND_FACTOR = 0.5;

const upgrades = {
  hoboVillage: {
    name: 'Hobo Village',
    icon: 'camping-tent',
    description: 'Get more Beggars at the start of each game.',
    summary: '{{extraCards}} on reset',
    extraStartingCards: {beggar: 1},
  },
  rationing: {
    name: 'Rationing',
    icon: 'cornucopia',
    description: 'All food has {{bonusAsPercent}} more capacity per upgrade',
    summary: '+{{bonusAsPercent}} food capacity',
    bonuses: {
      foodCapacity: {
        baseMulti: 1.5,
      }
    }
  },
  charity: {
    name: 'Charity',
    icon: 'receive-money',
    description: 'Provides {{bonusAsAmount}} extra gold on reset per upgrade',
    summary: '+{{bonusAsAmount}} gold on reset',
    // TODO: ???
  },
  market: {
    name: 'Marketplace',
    icon: 'desert-camp',
    description: 'Unlocks the food pack',
    summary: '',
    unlockedCardPack: 'food',
  },
  taxes: {
    name: 'Taxes',
    icon: 'cash',
    description: 'Increases all gold gain by {{bonusAsPercent}} per upgrade',
    summary: '+{{bonusAsPercent}} gold gain',
    bonuses: {
      goldGain: {
        baseMulti: 1.5,
      }
    }
  },
  treasureMap: {
    name: 'Treasure Map',
    icon: 'treasure-map',
    description: 'Gives you one of the ultra rare cards you\'ve discovered on reset',
    summary: 'Ultra rare card on reset',
    randomStartingCards: {
      possibleCards: [],
      possibleCardRarity: Rarity.UltraRare,
      amount: 1,
      onlyIfDiscovered: true,
    }
  }
} satisfies Record<string, Omit<PrestigeUpgrade, "id">>;

export type PrestigeUpgradeId = keyof typeof upgrades;

const upgradesWithIds: Record<PrestigeUpgradeId, PrestigeUpgrade> = mapValues(upgrades, (upgrade, key) => {
  const id = key as PrestigeUpgradeId;
  return {
    ...upgrade,
    id,
  };

  // TODO: Re-implement random card upgrades

  function replaceInDescription(variable: string, value: string) {
    upgrade.description = upgrade.description.replaceAll(`{{${variable}}}`, value);
  }

  /* *
  TODO: Hmmmm
  if (upgrade.bonuses) {
    replaceInDescription('bonusAsPercent', formatNumber(upgrade.bonus.amount * 100, 0, 0) + '%');
    replaceInDescription('bonusAsAmount', formatNumber(upgrade.bonus.amount, 0, 0));
  }
  /* */
});

export default upgradesWithIds;

export type PrestigeUpgrade = Upgrade & {
  id: PrestigeUpgradeId,
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
