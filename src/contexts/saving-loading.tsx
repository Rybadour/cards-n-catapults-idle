/* eslint-disable @typescript-eslint/no-empty-function */
import { grid } from "@mui/system";
import { cloneDeep } from "lodash";
import { createContext, useContext, useEffect, useState } from "react";
import global from "../config/global";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { CardMasteryContext } from "./card-mastery";
import { CardPacksContext } from "./card-packs";
import { CardsContext } from "./cards";
import { DiscoveryContext } from "./discovery";
import { GridContext } from "./grid";
import { PrestigeContext } from "./prestige";
import { StatsContext } from "./stats";

const AUTO_SAVE_KEY = 'cnc-auto-save';
export const AUTO_SAVE_TIME = 30000;

type ISaveLoad = {
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
};

type ContextMap = {
  stats: ISaveLoad,
  prestige: ISaveLoad,
  discovery: ISaveLoad,
  grid: ISaveLoad,
  cards: ISaveLoad,
  cardPacks: ISaveLoad,
  cardMastery: ISaveLoad,
};

export type SavingLoadingContext = {
  isLoadedFromAutoSave: boolean,
  isAutoSaveEnabled: boolean,
  autoSaveTime: number,
  dataToLoad: Record<string, any> | null,
  save: () => void,
  load: () => void,
  update: (elapsed: number) => void,
  completeReset: () => void,
  setIsAutoSaveEnabled: (enabled: boolean) => void,
  attemptImportData: (rawData: string) => void,
  getSaveData: () => string,
};

const defaultContext: SavingLoadingContext = {
  isLoadedFromAutoSave: false,
  isAutoSaveEnabled: true,
  autoSaveTime: AUTO_SAVE_TIME,
  dataToLoad: {},
  save: () => {},
  load: () => {},
  update: (elapsed) => {},
  completeReset: () => {},
  setIsAutoSaveEnabled: (enabled) => {},
  attemptImportData: (rawData) => {},
  getSaveData: () => "",
};

export const SavingLoadingContext = createContext(defaultContext);

export function SavingLoadingProvider(props: Record<string, any>) {
  const [isLoadedFromAutoSave, setIsLoadedFromAutoSave] = useState(defaultContext.isLoadedFromAutoSave);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(defaultContext.isAutoSaveEnabled);
  const [autoSaveTime, setAutoSaveTime] = useState(defaultContext.autoSaveTime);
  const [dataToLoad, setDataToLoad] = useState(defaultContext.dataToLoad);
  const stats = useContext(StatsContext);
  const prestige = useContext(PrestigeContext);
  const discovery = useContext(DiscoveryContext);
  const grid = useContext(GridContext);
  const cards = useContext(CardsContext);
  const cardPacks = useContext(CardPacksContext);
  const cardMastery = useContext(CardMasteryContext);

  const contextDataMap: ContextMap = {
    stats, prestige, discovery, grid, cards, cardPacks, cardMastery,
  };

  useEffect(() => {
    if (dataToLoad) {
      contextDataMap.prestige.loadSaveData(dataToLoad?.prestige);
    }
  }, [contextDataMap.stats])

  useEffect(() => {
    if (dataToLoad) {
      contextDataMap.cards.loadSaveData(dataToLoad?.cards);
      contextDataMap.grid.loadSaveData(dataToLoad?.grid);
      setDataToLoad(null);
    }
  }, [contextDataMap.prestige]);

  function save() {
    localStorage.setItem(AUTO_SAVE_KEY, getSaveData());
  }

  function load() {
    const rawData: string | null = localStorage.getItem(AUTO_SAVE_KEY);
    if (!rawData) return;

    attemptImportData(rawData);
  }

  function completeReset() {
    localStorage.removeItem(AUTO_SAVE_KEY);
    prestige.completeReset();
    grid.prestigeReset();
    cardPacks.prestigeReset();
    const effects = cloneDeep(DEFAULT_EFFECTS);
    cards.prestigeReset(effects);
    stats.prestigeReset(effects);
  }

  function update(elapsed: number) {
    if (!global.autoLoadEnabled) return;

    if (!isLoadedFromAutoSave) {
      load();
      setIsLoadedFromAutoSave(true);
    }

    if (!isAutoSaveEnabled) return;

    let newAutoSave = autoSaveTime - elapsed;
    if (newAutoSave <= 0) {
      save();
      newAutoSave = AUTO_SAVE_TIME;
    }
    setAutoSaveTime(newAutoSave);
  }

  function attemptImportData(rawData: string) {
    let saveData: Record<string, any>;
    try {
      saveData = JSON.parse(rawData);
    } catch (err) {
      return;
    }

    setIsAutoSaveEnabled(saveData?.saveSettings?.isAutoSaveEnabled ?? true);
    contextDataMap.stats.loadSaveData(saveData.stats);
    contextDataMap.discovery.loadSaveData(saveData.discovery);
    contextDataMap.cardPacks.loadSaveData(saveData.cardPacks);
    contextDataMap.cardMastery.loadSaveData(saveData.cardMastery);
    setDataToLoad(saveData);
  }

  function getSaveData() {
    const saveData: Record<string, any> = {};

    Object.entries(contextDataMap).forEach(([key, context]) => {
      saveData[key] = context.getSaveData();
    });

    saveData.version = global.version;
    saveData.saveSettings = {
      isAutoSaveEnabled,
    };
    return JSON.stringify(saveData);
  }

  return (
    <SavingLoadingContext.Provider
      value={{
        isLoadedFromAutoSave, isAutoSaveEnabled, autoSaveTime, dataToLoad,
        save, load, update, completeReset, setIsAutoSaveEnabled, attemptImportData, getSaveData,
      }}
      {...props}
    />
  );
}
