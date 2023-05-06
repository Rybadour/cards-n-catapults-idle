import { ResourceType, TownUpgrade } from "../shared/types";

const upgrades: Record<string, TownUpgrade> = {
  woody: {
    id: '',
    name: 'Wood Chopping',
    icon: 'axe-in-stump',
    description: 'Lumberjacks produce twice as much gold.',
    summary: '',
    cost: {
      [ResourceType.Gold]: 300,
    },
    cardsBonuses: {
      'lumberjack': {
        goldGain: {
          baseAdd: 0.5,
        },
      }
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