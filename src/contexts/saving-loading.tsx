/* eslint-disable @typescript-eslint/no-empty-function */
import { grid } from "@mui/system";
import { createContext, useContext, useEffect, useState } from "react";
import { CardPacksContext } from "./card-packs";
import { CardsContext } from "./cards";
import { DiscoveryContext } from "./discovery";
import { GridContext } from "./grid";
import { PrestigeContext } from "./prestige";
import { StatsContext } from "./stats";

const AUTO_SAVE_KEY = 'cnc-auto-save';

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
};

export type SavingLoadingContext = {
  autoSaveTime: number,
  dataToLoad: Record<string, any> | null,
  save: () => void,
  load: () => void,
};

const defaultContext: SavingLoadingContext = {
  autoSaveTime: 0,
  dataToLoad: {},
  save: () => {},
  load: () => {},
};

export const SavingLoadingContext = createContext(defaultContext);

export function SavingLoadingProvider(props: Record<string, any>) {
  const [autoSaveTime, setAutoSaveTime] = useState(0);
  const [dataToLoad, setDataToLoad] = useState(defaultContext.dataToLoad);

  const contextDataMap: ContextMap = {
    stats: useContext(StatsContext),
    prestige: useContext(PrestigeContext),
    discovery: useContext(DiscoveryContext),
    grid: useContext(GridContext),
    cards: useContext(CardsContext),
    cardPacks: useContext(CardPacksContext),
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
    const saveData: Record<string, any> = {};

    Object.entries(contextDataMap).forEach(([key, context]) => {
      saveData[key] = context.getSaveData();
    });

    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData));
  }

  function load() {
    const rawData: string | null = localStorage.getItem(AUTO_SAVE_KEY);
    if (!rawData) return;

    let saveData: Record<string, any>;
    try {
      saveData = JSON.parse(rawData);
    } catch (err) {
      return;
    }

    contextDataMap.stats.loadSaveData(saveData.stats);
    contextDataMap.discovery.loadSaveData(saveData.discovery);
    contextDataMap.cardPacks.loadSaveData(saveData.cardPacks);
    setDataToLoad(saveData);
  }

  return (
    <SavingLoadingContext.Provider
      value={{
        autoSaveTime, dataToLoad,
        save, load,
      }}
      {...props}
    />
  );
}
