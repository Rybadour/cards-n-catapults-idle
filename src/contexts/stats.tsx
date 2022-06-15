/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react";
import { getPerSecFromGrid } from "../gamelogic/abilities";
import { Grid, ResourceType } from "../shared/types";
import { enumFromKey } from "../shared/utils";

export type StatsContext = {
  resources: Record<ResourceType, number>,
  resourcesPerSec: Record<ResourceType, number>,
  update: (elapsed: number, shouldRecalculate: boolean, grid: Grid) => void,
  updatePerSec: (grid: Grid) => void,
  useResource: (resource: ResourceType, amount: number) => void,
};

const defaultContext: StatsContext = {
  resources: {
    [ResourceType.Gold]: 100,
    [ResourceType.Wood]: 0,
  },
  resourcesPerSec: {
    [ResourceType.Gold]: 1,
    [ResourceType.Wood]: 0,
  },
  update: (elapsed, shouldRecalculate, grid) => {},
  updatePerSec: (grid) => {},
  useResource: (resource, amount) => {},
};

export const StatsContext = createContext(defaultContext);

export function StatsProvider(props: Record<string, any>) {
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
        newResources[resource] += elapsedSecs * resourcesPerSec[resource];
      }
    })
    setResources(newResources);
  }

  function updatePerSec(grid: Grid) {
    const newPerSec = getPerSecFromGrid(grid);
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
