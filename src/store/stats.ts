import { createLens } from "@dhmk/zustand-lens";

import global from "../config/global";
import { Card, CardId, defaultResourcesMap, Grid, MyCreateLens, PrestigeEffects, RealizedCard, ResourcesMap, ResourceType } from "../shared/types";
import { DiscoverySlice } from "./discovery";
import { FullStore } from ".";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { cloneDeep } from "lodash";

export interface StatsSlice {
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
}

const KEY = 'stats';
const createStatsLens: MyCreateLens<FullStore, StatsSlice, []> = (set, get) => {
  const [_set, _get] = createLens(set, get, KEY);

  return {
    key: KEY,
    slice: {
      resources: {
        ...defaultResourcesMap,
        [ResourceType.Gold]: global.startingGold
      },
      resourcesPerSec: { ...defaultResourcesMap },
      prestigeEffects: cloneDeep(DEFAULT_EFFECTS),
      update: (elapsed, newResourcesPerSec, grid) => {},
      updatePerSec: (newPerSec) => {},
      useResource: (resource, amount) => {
        const newResources = {..._get().resources};
        newResources[resource] -= amount;
        _set({resources: newResources});
      },
      prestigeReset: (effects) => {},
      prestigeUpdate: (effects) => {},
      getSaveData: () => ({}),
      loadSaveData: (data) => {},
    }
  }
};

export default createStatsLens;