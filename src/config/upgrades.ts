import { ResourceType, TownUpgrade } from "../shared/types";

const upgrades: Record<string, TownUpgrade> = {
  rationing: {
    id: '',
    name: 'Rationing',
    icon: 'cornucopia',
    description: 'All food has {{bonusAsPercent}} more capacity per upgrade',
    summary: '+{{bonusAsPercent}} food capacity',
    cost: {
      [ResourceType.Gold]: 300,
    },
    bonus: {
      amount: 0.2,
      field: 'foodCapacity',
    }
  },
  cultivation: {
    id: '',
    name: 'Cultivation',
    icon: 'cornucopia',
    description: 'Unlocks farming.',
    summary: '',
    cost: {
      [ResourceType.Gold]: 1000,
    },
    unlockedCards: ['farmer', 'farm', 'corn']
  },
}

Object.keys(upgrades)
  .forEach((id) => {
    const upgrade = upgrades[id];
    upgrade.id = id;
  });

export default upgrades;