import { cloneDeep } from "lodash";

import global from "../config/global";
import { MyCreateSlice, Pack, PackItem, PrestigeEffects, RealizedPack, ResourceType } from "../shared/types";
import { debugLogPackChance, generateFromPack } from "../shared/pack-generation";
import { getExponentialValue, getExpValueMultiple, getMultipleFromExpValue } from "../shared/utils";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { StatsSlice } from "./stats";
import { StoreApi } from "zustand";

export interface PacksSlice<T extends PackItem> {
  packs: Record<string, RealizedPack<T>>,
  prestigeEffects: PrestigeEffects,

  buyPack: (pack: RealizedPack<T>) => void,
  buyMaxPack: (pack: RealizedPack<T>) => void,
  prestigeReset: () => void,
  prestigeUpdate: (effects: PrestigeEffects) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
}

export default function getPackSliceCreator<T extends PackItem>(
  set: StoreApi<PacksSlice<T>>['setState'],
  get: StoreApi<PacksSlice<T>>['getState'],
  stats: () => StatsSlice,
  initialPackConfig: Record<string, Pack<T>>,
  earnItems: (items: T[]) => void,
): PacksSlice<T> {
  const realizedPacks: Record<string, RealizedPack<T>> = {};
  Object.values(initialPackConfig).forEach(pack => {
    // In debug mode verify that packs have reasonable chances in them (should add up to 100%)
    if (global.isDebug) {
      debugLogPackChance('CardPack', pack);
    }

    realizedPacks[pack.id] = {
      ...pack,
      cost: pack.baseCost,
      numBought: 0,
    };
  });

  return {
    packs: cloneDeep(realizedPacks),
    prestigeEffects: cloneDeep(DEFAULT_EFFECTS),

    buyPack: (pack) => {
      if (stats().resources[ResourceType.Gold] < pack.cost) return;

      stats().useResource(ResourceType.Gold, pack.cost);

      const itemsFromPack = generateFromPack<T>(pack);
      earnItems(itemsFromPack);

      const newPacks = {...get().packs};
      newPacks[pack.id].numBought += 1;
      newPacks[pack.id].cost = getPackCost(pack, DEFAULT_EFFECTS);
      set({packs: newPacks});
    },

    buyMaxPack: (pack) => {
      const baseCost = getBaseCost(pack, get().prestigeEffects);
      const numMaxBuy = Math.floor(getMultipleFromExpValue(baseCost, pack.costGrowth, pack.numBought, stats().resources.Gold));
      if (numMaxBuy < 1) return;

      const maxBuyCost = Math.round(getExpValueMultiple(baseCost, pack.costGrowth, pack.numBought, numMaxBuy));

      stats().useResource(ResourceType.Gold, maxBuyCost);

      let itemsFromPacks: T[] = [];
      for (let i = 0; i < numMaxBuy; ++i) {
        itemsFromPacks = itemsFromPacks.concat(generateFromPack(pack));
      }
      earnItems(itemsFromPacks);

      const newPacks = {...get().packs};
      newPacks[pack.id].numBought += numMaxBuy;
      newPacks[pack.id].cost = getPackCost(pack, get().prestigeEffects);
      set({packs: newPacks});
    },

    prestigeReset: () => {
      set({packs: cloneDeep(realizedPacks)});
    },

    prestigeUpdate: (effects) => {
      const newPacks = {...get().packs};
      Object.values(newPacks).forEach(pack => {
        pack.cost = getPackCost(pack, effects);
      });
      set({
        packs: newPacks,
        prestigeEffects: effects,
      });
    },

    getSaveData: () => {
      const packsToSave: Record<string, number> = {};
      Object.entries(get().packs).forEach(([id, pack]) => {
        packsToSave[id] = pack.numBought;
      });
      return packsToSave;
    },

    loadSaveData: (data) => {
      if (typeof data !== 'object') return false;

      const newPacks: Record<string, RealizedPack<T>> = {};
      Object.entries(data as Record<string, number>).forEach(([id, numBought]) => {
        newPacks[id] = {
          ...initialPackConfig[id],
          cost: 0,
          numBought,
        };
        newPacks[id].cost = getPackCost(newPacks[id], get().prestigeEffects);
      });
      set({packs: newPacks});

      return true;
    },
  }
}

function getBaseCost<T extends PackItem>(pack: Pack<T>, effects: PrestigeEffects) {
  return pack.baseCost * (1 - effects.bonuses.cardPackCostReduction);
}

function getPackCost<T extends PackItem>(pack: RealizedPack<T>, effects: PrestigeEffects) {
  return getExponentialValue(getBaseCost(pack, effects), pack.costGrowth, pack.numBought);
}