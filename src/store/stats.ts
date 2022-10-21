import global from "../config/global";
import { defaultResourcesMap, MyCreateSlice, PrestigeEffects, ResourcesMap, ResourceType } from "../shared/types";
import { enumFromKey } from "../shared/utils";
import { DiscoverySlice } from "./discovery";

export interface StatsSlice {
  resources: ResourcesMap,
  resourcesPerSec: ResourcesMap,
  update: (elapsed: number, newResourcesPerSec: ResourcesMap | null) => void,
  updatePerSec: (newPerSec: ResourcesMap) => void,
  useResource: (resource: ResourceType, amount: number) => void,
  prestigeReset: (effects: PrestigeEffects) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => any,
}

const DEFAULT_RESOURCES = {
  ...defaultResourcesMap,
  [ResourceType.Gold]: global.startingGold
};

const createStatsSlice: MyCreateSlice<StatsSlice, [() => DiscoverySlice]> = (set, get, discovery) => {
  return {
    resources: {...DEFAULT_RESOURCES},
    resourcesPerSec: { ...defaultResourcesMap },

    update: (elapsed: number, newResourcesPerSec: ResourcesMap | null) => {
      if (newResourcesPerSec) {
        set({resourcesPerSec: newResourcesPerSec});
      }

      const elapsedSecs = (elapsed/1000);
      const newResources = {...get().resources};
      Object.keys(get().resourcesPerSec).forEach(r => {
        const resource = enumFromKey(ResourceType, r);
        if (resource) {
          newResources[resource] += elapsedSecs * get().resourcesPerSec[resource];
        }
      });
      set({resources: newResources});
    },

    updatePerSec: (newPerSec) => {
      discovery().discoverResources(
        Object.keys(newPerSec)
          .map(r => enumFromKey(ResourceType, r)!)
          .filter(r => r && newPerSec[r] > 0)
      );
      set({resourcesPerSec: newPerSec});
    },

    useResource: (resource, amount) => {
      const newResources = {...get().resources};
      newResources[resource] -= amount;
      set({resources: newResources});
    },

    prestigeReset: (effects) => {
      const newResources = {...DEFAULT_RESOURCES};
      newResources.Gold += effects.bonuses.startingGold;
      set({
        resources: newResources,
        resourcesPerSec: {...defaultResourcesMap},
      })
    },

    getSaveData: () => get().resources,

    loadSaveData: (data) => {
      if (typeof data !== 'object') return;

      set({resources: data});
    },
  }
};

export default createStatsSlice;