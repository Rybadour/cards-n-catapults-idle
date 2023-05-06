import { ResourceType, TownUpgrade } from "../shared/types";

const upgrades: Record<string, TownUpgrade> = {
  betterBerries: {
    id: '',
    name: 'Bigger Berries',
    icon: 'cornucopia',
    description: 'Berries provide twice as much food.',
    summary: '',
    cost: {
      [ResourceType.Gold]: 150,
    },
    cardsBonuses: {
      'berries': {
        foodCapacity: {
          baseMulti: 2,
        },
      }
    }
  },
  woodChopping: {
    id: '',
    name: 'Faster Chomping',
    icon: 'axe-in-stump',
    description: 'Lumberjacks produce twice as much wood.',
    summary: '',
    cost: {
      [ResourceType.Gold]: 300,
    },
    cardsBonuses: {
      'lumberjack': {
        woodGain: {
          baseAdd: 0.5,
        },
      }
    }
  },
  cultivation: {
    id: '',
    name: 'Cultivation',
    icon: 'plow',
    description: 'Unlocks new cards.',
    summary: '',
    cost: {
      [ResourceType.Gold]: 1000,
    },
    unlockedCards: ['farmer', 'farm', 'corn']
  },
  campfireCooking: {
    id: '',
    name: 'Campfire Cooking',
    icon: 'campfire',
    description: 'Unlocks automated food placement.',
    summary: '',
    cost: {
      [ResourceType.Gold]: 500,
      [ResourceType.Wood]: 500,
    },
    unlockedCards: ['campfire']
  }
}

Object.keys(upgrades)
  .forEach((id) => {
    const upgrade = upgrades[id];
    upgrade.id = id;
  });

export default upgrades;