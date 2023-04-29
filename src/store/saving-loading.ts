import { cloneDeep } from "lodash";
import global from "../config/global";
import { isMajorAndMinorVersionEqual, migrateSaveData } from "../save-data-migrations";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { CardsSlice } from "./cards";
import { DiscoverySlice } from "./discovery";
import { CardGridsSlice } from "./card-grids";
import { PrestigeSlice } from "./prestige";
import { StatsSlice } from "./stats";
import { MyCreateSlice } from ".";

const AUTO_SAVE_KEY = 'cnc-auto-save';
const MIGRATION_BACKUP_KEY = 'cnc-migration-backup';
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
};

export type SavingLoadingSlice = {
  isLoadedFromAutoSave: boolean,
  isAutoSaveEnabled: boolean,
  autoSaveTime: number,
  oldSaveData: string,
  loadDataError: LoadDataError | null,
  save: () => void,
  load: () => void,
  update: (elapsed: number) => void,
  completeReset: () => void,
  toggleAutoSave: () => void,
  attemptImportData: (rawData: string) => void,
  getSaveData: () => string,
};

const createSavingLoadingSlice:MyCreateSlice<SavingLoadingSlice, [
  () => StatsSlice, () => PrestigeSlice, () => DiscoverySlice, () => CardGridsSlice, () => CardsSlice,
]> = 
(set, get, stats, prestige, discovery, grid, cards) => {

  const sliceDataMap: SliceMap = {
    stats, prestige, discovery, grid, cards
  };

  function save() {
    localStorage.setItem(AUTO_SAVE_KEY, getSaveData());
  }

  function load() {
    const rawData: string | null = localStorage.getItem(AUTO_SAVE_KEY);
    if (!rawData) return;

    attemptImportData(rawData, true);
  }

  function attemptImportData(rawData: string, attemptMigration = false) {
    let saveData: Record<string, any>;
    try {
      saveData = JSON.parse(rawData);
    } catch (err) {
      return;
    }

    if (attemptMigration && !isMajorAndMinorVersionEqual(saveData.version, global.version)) {
      localStorage.setItem(MIGRATION_BACKUP_KEY + '_' + saveData.version, rawData);
      const result = migrateSaveData(saveData);
      if (isLoadDataError(result)) {
        set({oldSaveData: rawData, loadDataError: result});
        return;
      } else {
        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(result));
      }
    }

    // Order matters here since things lower in the list have dependencies on those higher
    stats().loadSaveData(saveData.stats);
    discovery().loadSaveData(saveData.discovery);
    cards().loadSaveData(saveData.cards);
    grid().loadSaveData(saveData.grid);
    prestige().loadSaveData(saveData.prestige);
    set({
      isAutoSaveEnabled: saveData?.saveSettings?.isAutoSaveEnabled ?? true,
      loadDataError: null,
    });
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
    oldSaveData: '',
    loadDataError: null,

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

export type LoadDataError = {
  saveVersion: string,
  failedMigrationVersion: string,
  exception: unknown,
}

export type SaveData = Record<string, any>;

function isLoadDataError(errorOrNot: SaveData | LoadDataError): errorOrNot is LoadDataError {
  return (errorOrNot as LoadDataError).exception !== undefined;
}