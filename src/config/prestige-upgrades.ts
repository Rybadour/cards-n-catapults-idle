import { PrestigeUpgrade, Rarity } from "../shared/types";

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
    bonuses: {
      foodCapacity: {
        baseMulti: 1.5,
      }
    }
  },
  charity: {
    id: '',
    name: 'Charity',
    icon: 'receive-money',
    description: 'Provides {{bonusAsAmount}} extra gold on reset per upgrade',
    summary: '+{{bonusAsAmount}} gold on reset',
    // TODO: ???
  },
  market: {
    id: '',
    name: 'Marketplace',
    icon: 'desert-camp',
    description: 'Unlocks the food pack',
    summary: '',
    unlockedCardPack: 'food',
  },
  taxes: {
    id: '',
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

export default upgrades;