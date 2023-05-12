import { mapValues, mergeWith } from "lodash";
import { MyCreateSlice } from ".";

import global from "../config/global";
import { DEFAULT_BONUS_VALUES } from "../shared/constants";
import { BonusValues, defaultResourcesMap, PrestigeUpgrade, ResourcesMap, ResourceType } from "../shared/types";
import { addToBonusValue, enumFromKey, getFinalBonusValue, mergeSumPartial } from "../shared/utils";
import { DiscoverySlice } from "./discovery";

export interface StatsSlice {
  resources: ResourcesMap,
  resourcesPerSec: ResourcesMap,
  sellResourceBonuses: Record<ResourceType, BonusValues>;
  sellResourcePrice: Record<ResourceType, number>;

  update: (elapsed: number, newResourcesPerSec: ResourcesMap | null) => void,
  updatePerSec: (newPerSec: ResourcesMap) => void,
  canAfford: (resources: Partial<ResourcesMap>) => boolean,
  useResource: (resource: ResourceType, amount: number) => void,
  useResources: (resources: Partial<ResourcesMap>) => void,
  sellResource: (resource: ResourceType, percent: number) => void,
  addSellResourceBonus: (sellResourceBonus: Partial<Record<ResourceType, Partial<BonusValues>>>) => void,
  resetResource: (resource: ResourceType) => void,
  prestigeReset: (prestigeUpgrades: PrestigeUpgrade[]) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => any,
}

const DEFAULT_RESOURCES = {
  ...defaultResourcesMap,
  ...global.startingResources,
};

const createStatsSlice: MyCreateSlice<StatsSlice, [() => DiscoverySlice]> = (set, get, discovery) => {
  return {
    resources: {...DEFAULT_RESOURCES},
    resourcesPerSec: { ...defaultResourcesMap },
    sellResourceBonuses: mapValues(DEFAULT_RESOURCES, (_) => ({...DEFAULT_BONUS_VALUES})),
    sellResourcePrice: mapValues(DEFAULT_RESOURCES, () => 1),

    update: (elapsed: number, newResourcesPerSec: ResourcesMap | null) => {
      if (newResourcesPerSec) {
        get().updatePerSec(newResourcesPerSec);
      }

      const elapsedSecs = (elapsed/1000);
      const newResources = {...get().resources};
      Object.keys(get().resourcesPerSec).forEach(r => {
        const resource = enumFromKey(ResourceType, r);
        if (resource) {
          newResources[resource] += elapsedSecs * get().resourcesPerSec[resource];
          newResources[resource] = Math.max(0, newResources[resource]);
        }
      });
      set({resources: newResources});
    },

    updatePerSec: (newPerSec) => {
      discovery().discoverResources(
        Object.keys(newPerSec)
          .map(r => enumFromKey(ResourceType, r)!)
          .filter(r => r && newPerSec[r])
      );
      set({resourcesPerSec: newPerSec});
    },

    canAfford: (cost) => {
      const resources = get().resources;
      return Object.entries(cost)
        .every(([resource, amount]) => resources[enumFromKey(ResourceType, resource)!] >= amount);
    },

    useResource: (resource, amount) => {
      const newResources = {...get().resources};
      newResources[resource] -= amount;
      set({resources: newResources});
    },

    useResources: (resources) => {
      set({resources: mergeSumPartial(get().resources, mapValues(resources, r => -(r ?? 0)))});
    },

    sellResource: (resource, percent) => {
      const resources = get().resources;
      const resourcesUsed = resources[resource] * percent;
      const goldGiven = resourcesUsed * get().sellResourcePrice[resource];
      set({
        resources: mergeSumPartial(resources, {
          [ResourceType.Gold]: goldGiven,
          [resource]: -resourcesUsed,
        })
      })
    },

    addSellResourceBonus: (sellResourceBonus) => {
      const newSellResourceBonuses = mergeWith(get().sellResourceBonuses, sellResourceBonus, (a, b) => {
        addToBonusValue(a, b);
        return a;
      });
      set({
        sellResourceBonuses: newSellResourceBonuses,
        sellResourcePrice: mapValues(get().sellResourcePrice, (oldPrice, resource) => {
          if (sellResourceBonus[resource as ResourceType]) {
            return getFinalBonusValue(1, newSellResourceBonuses[resource as ResourceType]);
          } else {
            return oldPrice;
          }
        })
      })
    },

    resetResource: (res) => {
      set({
        resources: {...get().resources, [res]: 0},
      });
    },

    prestigeReset: (prestigeUpgrades: PrestigeUpgrade[]) => {
      const newResources = {...DEFAULT_RESOURCES};
      // TODO
      //newResources.Gold += effects.bonuses.startingGold;
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