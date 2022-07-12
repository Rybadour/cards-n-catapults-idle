/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import packsConfig from "../config/prestige-packs";
import global from "../config/global";
import { getExponentialValue } from "../shared/utils";
import { RealizedPrestigePack, RealizedPrestigeUpgrade } from "../shared/types";
import { debugLogPackChance, generateFromPack } from "../shared/pack-generation";

const realizedPacks: Record<string, RealizedPrestigePack> = {};
Object.values(packsConfig).forEach(pack => {
  // In debug mode verify that packs have reasonable chances in them (should add up to 100%)
  if (global.isDebug) {
    debugLogPackChance('PrestigePack', pack);
  }

  realizedPacks[pack.id] = {
    ...pack,
    cost: pack.baseCost,
    numBought: 0,
  };
});

export type PrestigeContext = {
  prestigePoints: number,
  upgrades: Record<string, RealizedPrestigeUpgrade>,
  packs: Record<string, RealizedPrestigePack>,
  buyPack: (cardPack: RealizedPrestigePack) => void,
};

const defaultContext: PrestigeContext = {
  prestigePoints: 0,
  upgrades: {},
  packs: realizedPacks,
  buyPack: (pack) => {},
};

export const PrestigeContext = createContext(defaultContext);

export function PrestigeProvider(props: Record<string, any>) {
  const [prestigePoints, setPoints] = useState(defaultContext.prestigePoints);
  const [upgrades, setUpgrades] = useState(defaultContext.upgrades);
  const [packs, setPacks] = useState(defaultContext.packs);

  function buyPack(pack: RealizedPrestigePack) {
    if (prestigePoints < pack.cost) return;

    setPoints(prestigePoints - pack.cost);

    const newUpgrades = {...upgrades};
    const upgradesFromPack = generateFromPack(pack);
    upgradesFromPack.forEach(up => {
      if (newUpgrades.hasOwnProperty(up.id)) {
        newUpgrades[up.id].quantity += 1;
      } else {
        newUpgrades[up.id] = {...up, quantity: 1};
      }
    });
    setUpgrades(newUpgrades);

    const newPrestigePacks = {...packs};
    newPrestigePacks[pack.id].numBought += 1;
    newPrestigePacks[pack.id].cost = getExponentialValue(pack.baseCost, pack.costGrowth, pack.numBought);
    setPacks(newPrestigePacks);
  }

  return (
    <PrestigeContext.Provider
      value={{
        prestigePoints, upgrades, packs,
        buyPack,
      }}
      {...props}
    />
  );
}
