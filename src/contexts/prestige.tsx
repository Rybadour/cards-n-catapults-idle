/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react";
import packsConfig from "../config/prestige-packs";
import { getExponentialValue } from "../shared/utils";
import { RealizedPrestigePack, RealizedPrestigeUpgrade } from "../shared/types";
import { PRESTIGE_BASE_COST, PRESTIGE_COST_GROWTH } from "../config/prestige-upgrades";
import { shuffle } from "lodash";

const realizedPacks: Record<string, RealizedPrestigePack> = {};
Object.values(packsConfig).forEach(pack => {
  const totalUpgrades: string[] = [];
  pack.upgrades.forEach(u => {
    for (let i = 0; i < u.quantity; ++i) {
      totalUpgrades.push(u.upgrade.id);
    }
  });

  realizedPacks[pack.id] = {
    ...pack,
    cost: pack.baseCost,
    numBought: 0,
    remainingUpgrades: shuffle(totalUpgrades),
  };
});

export type PrestigeContext = {
  prestigePoints: number,
  nextPoints: number,
  currentRenownCost: number,
  nextRenownCost: number,
  upgrades: Record<string, RealizedPrestigeUpgrade>,
  packs: Record<string, RealizedPrestigePack>,
  isMenuOpen: boolean,
  prestige: () => boolean,
  buyPack: (cardPack: RealizedPrestigePack) => void,
  update: (renown: number) => void,
  openMenu: () => void,
  closeMenu: () => void,
};

const defaultContext: PrestigeContext = {
  prestigePoints: 0,
  nextPoints: 0,
  currentRenownCost: 0,
  nextRenownCost: PRESTIGE_BASE_COST,
  upgrades: {},
  packs: realizedPacks,
  isMenuOpen: false,
  prestige: () => false,
  buyPack: (pack) => {},
  update: (renown) => {},
  openMenu: () => {},
  closeMenu: () => {},
};

export const PrestigeContext = createContext(defaultContext);

export function PrestigeProvider(props: Record<string, any>) {
  const [prestigePoints, setPoints] = useState(defaultContext.prestigePoints);
  const [nextPoints, setNextPoints] = useState(defaultContext.nextPoints);
  const [currentRenownCost, setCurrentRenownCost] = useState(defaultContext.currentRenownCost);
  const [nextRenownCost, setNextRenownCost] = useState(defaultContext.nextRenownCost);
  const [upgrades, setUpgrades] = useState(defaultContext.upgrades);
  const [packs, setPacks] = useState(defaultContext.packs);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  function prestige() {
    if (nextPoints <= 0) {
      return false;
    }

    setPoints(prestigePoints + nextPoints);
    setNextPoints(0);
    setCurrentRenownCost(0);
    setIsMenuOpen(true);
    return true;
  }

  function buyPack(pack: RealizedPrestigePack) {
    if (prestigePoints < pack.cost) return;

    setPoints(prestigePoints - pack.cost);

    const newUpgrades = {...upgrades};
    
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

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <PrestigeContext.Provider
      value={{
        prestigePoints, upgrades, packs,
        nextPoints, nextRenownCost, currentRenownCost, isMenuOpen,
        prestige, buyPack, update, openMenu, closeMenu,
      }}
      {...props}
    />
  );
}
