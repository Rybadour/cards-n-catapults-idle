/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import global from "../config/global";
import { getPerSecFromGrid } from "../gamelogic/abilities";
import { Grid, ResourceType } from "../shared/types";
import { enumFromKey } from "../shared/utils";
import { DiscoveryContext } from "./discovery";

export type StatsContext = {
  resources: Record<ResourceType, number>,
  resourcesPerSec: Record<ResourceType, number>,
  update: (elapsed: number, shouldRecalculate: boolean, grid: Grid) => void,
  updatePerSec: (grid: Grid) => void,
  useResource: (resource: ResourceType, amount: number) => void,
};

const defaultContext: StatsContext = {
  resources: {
    [ResourceType.Gold]: global.startingGold,
    [ResourceType.Wood]: 0,
  },
  resourcesPerSec: {
    [ResourceType.Gold]: 0,
    [ResourceType.Wood]: 0,
  },
  update: (elapsed, shouldRecalculate, grid) => {},
  updatePerSec: (grid) => {},
  useResource: (resource, amount) => {},
};

export const StatsContext = createContext(defaultContext);

export function StatsProvider(props: Record<string, any>) {
  const discovery = useContext(DiscoveryContext);
  const [resources, setResources] = useState(defaultContext.resources);
  const [resourcesPerSec, setResourcesPerSec] = useState(defaultContext.resourcesPerSec);

  function update(elapsed: number, shouldRecalculate: boolean, grid: Grid) {
    if (shouldRecalculate) {
      const newPerSec = getPerSecFromGrid(grid);
      setResourcesPerSec(newPerSec);
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

  function updatePerSec(grid: Grid) {
    const newPerSec = getPerSecFromGrid(grid);
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
