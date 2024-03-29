import { PrestigeUpgrade, Rarity } from "../shared/types";
import { formatNumber } from "../shared/utils";
import cards from "./cards";

export const PRESTIGE_COST = {
  base: 100,
  growthFactor: 5,
  growthExp: 3,
};
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
    description: 'Provides {{bonusAsAmount}} extra gold on reset per upgrade',
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
    description: 'Reduces the cost of card packs by {{bonusAsPercent}} per upgrade',
    summary: '-{{bonusAsPercent}} card pack cost',
    bonus: {
      amount: 0.1,
      field: 'cardPackCostReduction',
    }
  },
  taxes: {
    id: '',
    name: 'Taxes',
    icon: 'cash',
    description: 'Increases all gold gain by {{bonusAsPercent}} per upgrade',
    summary: '+{{bonusAsPercent}} gold gain',
    bonus: {
      amount: 0.1,
      field: 'goldGain',
    }
  },
  treasureMap: {
    id: '',
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
};

Object.keys(upgrades)
  .forEach((id) => {
    const upgrade = upgrades[id];
    upgrade.id = id;

    if (upgrade.randomStartingCards && upgrade.randomStartingCards.possibleCardRarity) {
      upgrade.randomStartingCards.possibleCards = Object.values(cards)
        .filter(c => c.rarity == upgrade.randomStartingCards?.possibleCardRarity)
        .map(c => c.id);
    }

    function replaceInDescription(variable: string, value: string) {
      upgrade.description = upgrade.description.replaceAll(`{{${variable}}}`, value);
    }

    if (upgrade.bonus) {
      replaceInDescription('bonusAsPercent', formatNumber(upgrade.bonus.amount * 100, 0, 0) + '%');
      replaceInDescription('bonusAsAmount', formatNumber(upgrade.bonus.amount, 0, 0));
    }
  });

export default upgrades;