import { ResourceType } from "../shared/types"

const resourceIconMap: Record<ResourceType, string> = {
  [ResourceType.Gold]: 'two-coins.png',
  [ResourceType.Wood]: 'wood-pile.png',
  [ResourceType.Renown]: 'eagle-emblem.png',
};

export default resourceIconMap;