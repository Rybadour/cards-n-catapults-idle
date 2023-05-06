import { PrestigeUpgrade, ResourceType, TownUpgrade } from "../shared/types";

const upgrades: Record<string, TownUpgrade> = {
  rationing: {
    id: '',
    name: 'Rationing',
    icon: 'cornucopia',
    description: 'All food has {{bonusAsPercent}} more capacity per upgrade',
    summary: '+{{bonusAsPercent}} food capacity',
    cost: {
      [ResourceType.Gold]: 100,
    },
    bonus: {
      amount: 0.2,
      field: 'foodCapacity',
    }
  },
  other: {
    id: '',
    name: 'Rationing',
    icon: 'cornucopia',
    description: 'All food has {{bonusAsPercent}} more capacity per upgrade',
    summary: '+{{bonusAsPercent}} food capacity',
    cost: {
      [ResourceType.Gold]: 100,
    },
    bonus: {
      amount: 0.2,
      field: 'foodCapacity',
    }
  },
}

Object.keys(upgrades)
  .forEach((id) => {
    const upgrade = upgrades[id];
    upgrade.id = id;
  });

export default upgrades;