import { ResourceType } from "../shared/types"

const resourceIconMap: Record<ResourceType, string> = {
  [ResourceType.Gold]: 'two-coins',
  [ResourceType.Wood]: 'wood-pile',
  [ResourceType.Renown]: 'laurel-crown',
};

export default resourceIconMap;