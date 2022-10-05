import { cloneDeep } from "lodash";
import global from "../config/global";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { MyCreateSlice } from "../shared/types";
import { CardMasterySlice } from "./card-mastery";
import { CardPacksSlice } from "./card-packs";
import { CardsSlice } from "./cards";
import { DiscoverySlice } from "./discovery";
import { GridSlice } from "./grid";
import { PrestigeSlice } from "./prestige";
import { StatsSlice } from "./stats";

const AUTO_SAVE_KEY = 'cnc-auto-save';
export const AUTO_SAVE_TIME = 5000;

type ISaveLoad = {
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
};

type SliceMap = {
  stats: () => ISaveLoad,
  prestige: () => ISaveLoad,
  discovery: () => ISaveLoad,
  grid: () => ISaveLoad,
  cards: () => ISaveLoad,
  cardPacks: () => ISaveLoad,
  cardMastery: () => ISaveLoad,
};

export type SavingLoadingSlice = {
  isLoadedFromAutoSave: boolean,
  isAutoSaveEnabled: boolean,
  autoSaveTime: number,
  save: () => void,
  load: () => void,
  update: (elapsed: number) => void,
  completeReset: () => void,
  toggleAutoSave: () => void,
  attemptImportData: (rawData: string) => void,
  getSaveData: () => string,
};

const createSavingLoadingSlice:MyCreateSlice<SavingLoadingSlice, [
  () => StatsSlice, () => PrestigeSlice, () => DiscoverySlice, () => GridSlice, () => CardsSlice,
  () => CardPacksSlice, () => CardMasterySlice
]> = 
(set, get, stats, prestige, discovery, grid, cards, cardPacks, cardMastery) => {

  const sliceDataMap: SliceMap = {
    stats, prestige, discovery, grid, cards, cardPacks, cardMastery,
  };

  function save() {
    localStorage.setItem(AUTO_SAVE_KEY, getSaveData());
  }

  function load() {
    const rawData: string | null = localStorage.getItem(AUTO_SAVE_KEY);
    if (!rawData) return;

    attemptImportData(rawData);
  }

  function attemptImportData(rawData: string) {
    let saveData: Record<string, any>;
    try {
      saveData = JSON.parse(rawData);
    } catch (err) {
      return;
    }

    // Order matters here since things lower in the list have dependencies on those higher
    stats().loadSaveData(saveData.stats);
    discovery().loadSaveData(saveData.discovery);
    cardPacks().loadSaveData(saveData.cardPacks);
    cardMastery().loadSaveData(saveData.cardMastery);
    cards().loadSaveData(saveData.cards);
    grid().loadSaveData(saveData.grid);
    prestige().loadSaveData(saveData.prestige);
    set({ isAutoSaveEnabled: saveData?.saveSettings?.isAutoSaveEnabled ?? true });
  }

  function getSaveData() {
    const saveData: Record<string, any> = {};

    Object.entries(sliceDataMap).forEach(([key, slice]) => {
      saveData[key] = slice().getSaveData();
    });

    saveData.version = global.version;
    saveData.saveSettings = {
      isAutoSaveEnabled: get().isAutoSaveEnabled,
    };
    return JSON.stringify(saveData);
  }

  return {
    isLoadedFromAutoSave: false,
    isAutoSaveEnabled: global.autoLoadEnabled,
    autoSaveTime: AUTO_SAVE_TIME,

    save,
    load,
    attemptImportData,
    getSaveData,

    toggleAutoSave: () => set({isAutoSaveEnabled: !get().isAutoSaveEnabled}),

    completeReset: () => {
      localStorage.removeItem(AUTO_SAVE_KEY);
      discovery().completeReset();
      prestige().completeReset();
      grid().prestigeReset();
      cardPacks().prestigeReset();
      const effects = cloneDeep(DEFAULT_EFFECTS);
      cards().prestigeReset(effects);
      stats().prestigeReset(effects);
    },

    update: (elapsed: number) => {
      if (global.autoLoadEnabled && !get().isLoadedFromAutoSave) {
        load();
        set({isLoadedFromAutoSave: true});
      }

      if (!get().isAutoSaveEnabled) return;

      let newAutoSave = get().autoSaveTime - elapsed;
      if (newAutoSave <= 0) {
        save();
        newAutoSave = AUTO_SAVE_TIME;
      }
      set({autoSaveTime: newAutoSave});
    }, 
  };
}

export default createSavingLoadingSlice;