import { MyCreateSlice } from ".";
import global from "../config/global";

export enum Scene {
  Economy = "Economy",
  Prestige = "Prestige",
  Combat = "Combat",
}

export interface ScenesSlice {
  currentScene: Scene,
  switchScene: (newScene: Scene) => void,
}

const createScenesSlice: MyCreateSlice<ScenesSlice, []> = (set, get) => {
  return {
    currentScene: global.startingScene,

    switchScene: (newScene) => {
      set({currentScene: newScene});
    },
  };
};

export default createScenesSlice;