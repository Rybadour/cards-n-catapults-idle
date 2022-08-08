/* eslint-disable @typescript-eslint/no-empty-function */
import { cloneDeep } from "lodash";
import { createContext, useContext, useState } from "react";
import global from "../config/global";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { defaultResourcesMap, Grid, PrestigeEffects, ResourcesMap, ResourceType } from "../shared/types";
import { enumFromKey } from "../shared/utils";
import { DiscoveryContext } from "./discovery";

export type StatsContext = {
  resources: ResourcesMap,
  resourcesPerSec: ResourcesMap,
  prestigeEffects: PrestigeEffects,
  update: (elapsed: number, newResourcesPerSec: ResourcesMap | null, grid: Grid) => void,
  updatePerSec: (newPerSec: ResourcesMap) => void,
  useResource: (resource: ResourceType, amount: number) => void,
  prestigeReset: (effects: PrestigeEffects) => void,
  prestigeUpdate: (effects: PrestigeEffects) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => any,
};

const defaultContext: StatsContext = {
  resources: { ...defaultResourcesMap },
  resourcesPerSec: { ...defaultResourcesMap },
  prestigeEffects: cloneDeep(DEFAULT_EFFECTS),
  update: (elapsed, newResourcesPerSec, grid) => {},
  updatePerSec: (newPerSec) => {},
  useResource: (resource, amount) => {},
  prestigeReset: (effects) => {},
  prestigeUpdate: (effects) => {},
  getSaveData: () => ({}),
  loadSaveData: (data) => {},
};
defaultContext.resources[ResourceType.Gold] = global.startingGold;

export const StatsContext = createContext(defaultContext);

export function StatsProvider(props: Record<string, any>) {
  const discovery = useContext(DiscoveryContext);
  const [resources, setResources] = useState(defaultContext.resources);
  const [resourcesPerSec, setResourcesPerSec] = useState(defaultContext.resourcesPerSec);
  const [prestigeEffects, setPrestigeEffects] = useState(defaultContext.prestigeEffects);

  function update(elapsed: number, newResourcesPerSec: ResourcesMap | null, grid: Grid) {
    if (newResourcesPerSec) {
      setResourcesPerSec(newResourcesPerSec);
    }

    const elapsedSecs = (elapsed/1000);
    const newResources = {...resources};
    Object.keys(resourcesPerSec).forEach(r => {
      const resource = enumFromKey(ResourceType, r);
      const prestigeBonus = (resource === ResourceType.Gold ? prestigeEffects.bonuses.goldGain : 1);
      if (resource) {
        newResources[resource] += elapsedSecs * resourcesPerSec[resource] * prestigeBonus;
      }
    });
    setResources(newResources);
  }

  function updatePerSec(newPerSec: ResourcesMap) {
    discovery.discoverResources(
      Object.keys(newPerSec)
        .map(r => enumFromKey(ResourceType, r)!!)
        .filter(r => r && newPerSec[r] > 0)
    );
    setResourcesPerSec(newPerSec);
  }

  function useResource(resource: ResourceType, amount: number) {
    const newResources = {...resources};
    newResources[resource] -= amount;
    setResources(newResources);
  }

  function prestigeReset(effects: PrestigeEffects) {
    const newResources = {...defaultContext.resources};
    newResources.Gold += effects.bonuses.startingGold;
    setResources(newResources);
    setResourcesPerSec({...defaultResourcesMap});
    setPrestigeEffects(effects);
  }

  function prestigeUpdate(effects: PrestigeEffects) {
    setPrestigeEffects(effects);
  }

  function getSaveData() {
    return {...resources};
  }

  function loadSaveData(data: any) {
    if (typeof data !== 'object') return;

    setResources(data);
  }

  return (
    <StatsContext.Provider
      value={{
        resources, resourcesPerSec, prestigeEffects,
        update, updatePerSec, useResource, prestigeReset, prestigeUpdate, getSaveData, loadSaveData,
      }}
      {...props}
    />
  );
}
