/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react";
import { shuffle } from "lodash";

import packsConfig from "../config/prestige-packs";
import { getExponentialValue } from "../shared/utils";
import { PrestigeEffects, RealizedPrestigePack, RealizedPrestigeUpgrade } from "../shared/types";
import upgradesConfig, { PRESTIGE_BASE_COST, PRESTIGE_COST_GROWTH } from "../config/prestige-upgrades";
import global from "../config/global";

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
  isReseting: boolean,
  prestigeEffects: PrestigeEffects,
  prestige: () => boolean,
  buyPack: (cardPack: RealizedPrestigePack) => void,
  update: (renown: number) => void,
  openMenu: () => void,
  closeMenu: () => void,
};

const defaultContext: PrestigeContext = {
  prestigePoints: global.startingPrestige,
  nextPoints: 0,
  currentRenownCost: 0,
  nextRenownCost: PRESTIGE_BASE_COST,
  upgrades: {},
  packs: realizedPacks,
  isMenuOpen: false,
  isReseting: false,
  prestigeEffects: {
    bonuses: {
      foodCapacity: 1,
    },
    extraStartCards: {},
  },
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReseting, setIsReseting] = useState(false);
  const [prestigeEffects, setPrestigeEffects] = useState(defaultContext.prestigeEffects);

  function prestige() {
    if (nextPoints <= 0) {
      return false;
    }

    setPoints(prestigePoints + nextPoints);
    setNextPoints(0);
    setCurrentRenownCost(0);
    setNextRenownCost(PRESTIGE_BASE_COST);
    setIsMenuOpen(true);
    setIsReseting(true);
    return true;
  }

  function buyPack(pack: RealizedPrestigePack) {
    if (prestigePoints < pack.cost) return;

    setPoints(prestigePoints - pack.cost);

    const newUpgrades = {...upgrades};
    const upgradeId = pack.remainingUpgrades.splice(0, 1)[0];
    let upgrade = newUpgrades[upgradeId];
    if (!upgrade) {
      upgrade = {
        ...(upgradesConfig[upgradeId]),
        quantity: 1,
      } as RealizedPrestigeUpgrade;
    } else {
      upgrade.quantity += 1;
    }
    newUpgrades[upgradeId] = upgrade;
    setUpgrades(newUpgrades);

    const newEffects = {...prestigeEffects};
    if (upgrade.extraStartingCards) {
      Object.entries(upgrade.extraStartingCards).forEach(([c, amount]) => {
        newEffects.extraStartCards[c] = (newEffects.extraStartCards[c] ?? 0) + amount;
      })
    }
    if (upgrade.bonus) {
      newEffects.bonuses[upgrade.bonus.field] = (newEffects.bonuses[upgrade.bonus.field] ?? 0) + upgrade.bonus.amount;
    }
    setPrestigeEffects(newEffects);

    const newPrestigePacks = {...packs};
    newPrestigePacks[pack.id].numBought += 1;
    newPrestigePacks[pack.id].cost = getExponentialValue(pack.baseCost, pack.costGrowth, pack.numBought);
    newPrestigePacks[pack.id].remainingUpgrades = pack.remainingUpgrades;
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
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsReseting(false);
  };

  return (
    <PrestigeContext.Provider
      value={{
        prestigePoints, upgrades, packs, nextPoints, nextRenownCost, currentRenownCost, isMenuOpen, isReseting,
        prestigeEffects,
        prestige, buyPack, update, openMenu, closeMenu,
      }}
      {...props}
    />
  );
}
