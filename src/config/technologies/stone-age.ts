import { ResourceType, TownUpgrade, UpgradeId } from "../../shared/types";

export const stoneAgeTech: Record<UpgradeId, TownUpgrade> = {
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
  toolTech: {
    id: '',
    name: 'Primitive Tool Tech',
    icon: 'stone-crafting',
    description: 'Unlocks the ability to make tools!',
    summary: '',
    cost: {
      [ResourceType.Gold]: 200,
      [ResourceType.Wood]: 500,
    },
    unlockedCards: ['carpenter']
  },
  cultivation: {
    id: '',
    name: 'Cultivation',
    icon: 'plow',
    description: 'Unlocks new cards.',
    summary: '',
    cost: {
      [ResourceType.Gold]: 500,
      [ResourceType.Wood]: 500,
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
      [ResourceType.Gold]: 1000,
      [ResourceType.Wood]: 500,
    },
    unlockedCards: ['campfire', 'rat-snack']
  },
  religion: {
    id: '',
    name: 'Religion',
    icon: 'sun-priest',
    description: 'Unlocks a way to generate Renown.',
    summary: '',
    cost: {
      [ResourceType.Gold]: 1500,
    },
    unlockedCards: ['soothsayer']
  },
  nextAge: {
    id: '',
    name: 'Dawn of a New Age',
    icon: 'laurel-crown',
    description: 'One big step...',
    summary: '',
    cost: {
      [ResourceType.Renown]: 200,
      [ResourceType.Gold]: 2000,
    },
    unlockAge: 'bronzeAge',
  }
}