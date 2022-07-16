import { PrestigeUpgrade } from "../shared/types";
import { formatNumber } from "../shared/utils";

export const PRESTIGE_BASE_COST = 100;
export const PRESTIGE_COST_GROWTH = 1.1;

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
    }
  });

export default upgrades;