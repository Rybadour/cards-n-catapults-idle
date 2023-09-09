import { ResourceType, ResourcesMap, Upgrade } from "../../shared/types";

export const stoneAgeTech: Record<string, TownUpgrade> = {
  betterBerries: {
    id: '',
    name: 'Bigger Berries',
    icon: 'cornucopia',
    description: 'Berries provide twice as much food.',
    summary: '',
    cost: {
      [ResourceType.Wood]: 200,
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
      [ResourceType.Wood]: 300,
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
    description: 'Unlocks the ability to make tools.',
    summary: '',
    cost: {
      [ResourceType.Wood]: 800,
    },
    unlockedCards: ['carpenter']
  },
  sharperStones: {
    id: '',
    name: 'Sharper Stones',
    icon: 'stone-crafting',
    description: 'Doubles carpenter tool production.',
    summary: '',
    cost: {
      [ResourceType.Tools]: 10,
      [ResourceType.Wood]: 1000,
    },
    cardsBonuses: {
      carpenter: {
        toolGain: {
          baseMulti: 2,
        }
      }
    }
  },
  campfireCooking: {
    id: '',
    name: 'Campfire Cooking',
    icon: 'campfire',
    description: 'Unlocks automated food placement.',
    summary: '',
    cost: {
      [ResourceType.Tools]: 20,
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
      [ResourceType.Tools]: 100,
      [ResourceType.Wood]: 1000,
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
      [ResourceType.Tools]: 200,
      [ResourceType.Wood]: 2000,
    },
    unlockAge: 'bronzeAge',
  }
}

/* *
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
/* */

export type TownUpgrade = Upgrade & {
  id: string,
  cost: Partial<ResourcesMap>,
}
