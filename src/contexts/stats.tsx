/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import global from "../config/global";
import { defaultResourcesMap, Grid, ResourcesMap, ResourceType } from "../shared/types";
import { enumFromKey } from "../shared/utils";
import { DiscoveryContext } from "./discovery";

export type StatsContext = {
  resources: ResourcesMap,
  resourcesPerSec: ResourcesMap,
  update: (elapsed: number, newResourcesPerSec: ResourcesMap | null, grid: Grid) => void,
  updatePerSec: (newPerSec: ResourcesMap) => void,
  useResource: (resource: ResourceType, amount: number) => void,
};

const defaultContext: StatsContext = {
  resources: { ...defaultResourcesMap },
  resourcesPerSec: { ...defaultResourcesMap },
  update: (elapsed, newResourcesPerSec, grid) => {},
  updatePerSec: (newPerSec) => {},
  useResource: (resource, amount) => {},
};
defaultContext.resources[ResourceType.Gold] = global.startingGold;

export const StatsContext = createContext(defaultContext);

export function StatsProvider(props: Record<string, any>) {
  const discovery = useContext(DiscoveryContext);
  const [resources, setResources] = useState(defaultContext.resources);
  const [resourcesPerSec, setResourcesPerSec] = useState(defaultContext.resourcesPerSec);

  function update(elapsed: number, newResourcesPerSec: ResourcesMap | null, grid: Grid) {
    if (newResourcesPerSec) {
      setResourcesPerSec(newResourcesPerSec);
    }

    const elapsedSecs = (elapsed/1000);
    const newResources = {...resources};
    Object.keys(resourcesPerSec).forEach(r => {
      const resource = enumFromKey(ResourceType, r);
      if (resource) {
        newResources[resource] += elapsedSecs * resourcesPerSec[resource] * global.produceModifier;
      }
    })
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

  return (
    <StatsContext.Provider
      value={{
        resources, resourcesPerSec,
        update, updatePerSec, useResource,
      }}
      {...props}
    />
  );
}
