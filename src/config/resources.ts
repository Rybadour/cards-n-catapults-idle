import { ResourceConfig, ResourceType } from "../shared/types"

const resourcesConfig: Record<ResourceType, ResourceConfig> = {
  [ResourceType.Gold]: {
    icon: 'two-coins',
    sellPrice: 0,
  },
  [ResourceType.Wood]: {
    icon: 'wood-pile',
    sellPrice: 1,
  },
  [ResourceType.Tools]: {
    icon: 'stone-crafting',
    sellPrice: 100,
  },
  [ResourceType.Renown]: {
    icon: 'laurel-crown',
    sellPrice: 0,
  },
  [ResourceType.MilitaryPower]: {
    icon: 'crossed-swords',
    sellPrice: 0,
  },
}

export default resourcesConfig;