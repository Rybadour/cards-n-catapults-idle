/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import packsConfig from "../config/prestige-packs";
import global from "../config/global";
import { getExponentialValue } from "../shared/utils";
import { RealizedPrestigePack, RealizedPrestigeUpgrade } from "../shared/types";
import { debugLogPackChance, generateFromPack } from "../shared/pack-generation";
import { PRESTIGE_BASE_COST, PRESTIGE_COST_GROWTH } from "../config/prestige";

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
  nextPoints: number,
  currentRenownCost: number,
  nextRenownCost: number,
  upgrades: Record<string, RealizedPrestigeUpgrade>,
  packs: Record<string, RealizedPrestigePack>,
  prestige: () => boolean,
  buyPack: (cardPack: RealizedPrestigePack) => void,
  update: (renown: number) => void,
};

const defaultContext: PrestigeContext = {
  prestigePoints: 0,
  nextPoints: 0,
  currentRenownCost: 0,
  nextRenownCost: PRESTIGE_BASE_COST,
  upgrades: {},
  packs: realizedPacks,
  prestige: () => false,
  buyPack: (pack) => {},
  update: (renown) => {},
};

export const PrestigeContext = createContext(defaultContext);

export function PrestigeProvider(props: Record<string, any>) {
  const [prestigePoints, setPoints] = useState(defaultContext.prestigePoints);
  const [nextPoints, setNextPoints] = useState(defaultContext.nextPoints);
  const [currentRenownCost, setCurrentRenownCost] = useState(defaultContext.currentRenownCost);
  const [nextRenownCost, setNextRenownCost] = useState(defaultContext.nextRenownCost);
  const [upgrades, setUpgrades] = useState(defaultContext.upgrades);
  const [packs, setPacks] = useState(defaultContext.packs);

  function prestige() {
    if (nextPoints <= 0) {
      return false;
    }

    setPoints(prestigePoints + nextPoints);
    setNextPoints(0);
    setCurrentRenownCost(0);
    return true;
  }

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

  function update(renown: number) {
    if (currentRenownCost + nextRenownCost <= renown) {
      setNextPoints(nextPoints + 1);
      const newCost = getExponentialValue(PRESTIGE_BASE_COST, PRESTIGE_COST_GROWTH, nextPoints + 1);
      setNextRenownCost(newCost);
      setCurrentRenownCost(currentRenownCost + newCost);
    }
  }

  return (
    <PrestigeContext.Provider
      value={{
        prestigePoints, upgrades, packs,
        nextPoints, nextRenownCost, currentRenownCost,
        prestige, buyPack, update,
      }}
      {...props}
    />
  );
}
