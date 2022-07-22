import { PrestigeUpgrade } from "../shared/types";
import { formatNumber } from "../shared/utils";

export const PRESTIGE_BASE_COST = 100;
export const PRESTIGE_COST_GROWTH = 1.1;
export const PRESTIGE_REFUND_FACTOR = 0.5;

const upgrades: Record<string, PrestigeUpgrade> = {
  ratz: {
    id: '',
    name: 'Ratz!',
    icon: 'cave-entrance',
    description: 'Get a Rat Den at the start of each game.',
    summary: '{{extraCards}} on reset',
    extraStartingCards: {ratDen: 1},
  },
  hoboVillage: {
    id: '',
    name: 'Hobo Village',
    icon: 'camping-tent',
    description: 'Get more Beggars at the start of each game.',
    summary: '{{extraCards}} on reset',
    extraStartingCards: {beggar: 1},
  },
  rationing: {
    id: '',
    name: 'Rationing',
    icon: 'cornucopia',
    description: 'All food has {{bonusAsPercent}} more capacity per upgrade',
    summary: '+{{bonusAsPercent}} food capacity',
    bonus: {
      amount: 0.05,
      field: 'foodCapacity',
    }
  },
  charity: {
    id: '',
    name: 'Charity',
    icon: 'receive-money',
    description: 'Provides {{bonusAsAmount}} extra gold on reset',
    summary: '+{{bonusAsAmount}} gold on reset',
    bonus: {
      amount: 50,
      field: 'startingGold',
    }
  },
  market: {
    id: '',
    name: 'Marketplace',
    icon: 'desert-camp',
    description: 'Unlocks the food pack',
    summary: '',
    unlockedCardPack: 'food',
  },
  tradeDeal: {
    id: '',
    name: 'Trade Deal',
    icon: 'trade',
    description: 'Reduces the cost of card packs by ',
    summary: '-{{bonusAsPercent}} card pack cost',
    bonus: {
      amount: 0.1,
      field: 'cardPackCostReduction',
    }
  }
};

Object.keys(upgrades)
  .forEach((id) => {
    const upgrade = upgrades[id];
    upgrade.id = id;

    function replaceInDescription(variable: string, value: string) {
      upgrade.description = upgrade.description.replaceAll(`{{${variable}}}`, value);
    }

    if (upgrade.bonus) {
      replaceInDescription('bonusAsPercent', formatNumber(upgrade.bonus.amount * 100, 0, 0) + '%');
      replaceInDescription('bonusAsAmount', formatNumber(upgrade.bonus.amount, 0, 0));
    }
  });

export default upgrades;