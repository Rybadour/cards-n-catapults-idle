/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import { shuffle } from "lodash";

import packsConfig from "../config/prestige-packs";
import { getExponentialValue } from "../shared/utils";
import { PrestigeEffects, PrestigeUpgrade, RealizedPrestigePack, RealizedPrestigeUpgrade } from "../shared/types";
import upgradesConfig, { PRESTIGE_BASE_COST, PRESTIGE_COST_GROWTH, PRESTIGE_REFUND_FACTOR } from "../config/prestige-upgrades";
import global from "../config/global";
import { StatsContext } from "./stats";
import { GridContext } from "./grid";
import { CardsContext } from "./cards";
import { CardPacksContext } from "./card-packs";

const defaultUpgrades: Record<string, Record<string, RealizedPrestigeUpgrade>> = {};
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
    refund: 0,
    numBought: 0,
    remainingUpgrades: shuffle(totalUpgrades),
  };
  defaultUpgrades[pack.id] = {};
});

export type PrestigeContext = {
  prestigePoints: number,
  nextPoints: number,
  currentRenownCost: number,
  nextRenownCost: number,
  upgrades: Record<string, Record<string, RealizedPrestigeUpgrade>>,
  packs: Record<string, RealizedPrestigePack>,
  isMenuOpen: boolean,
  isReseting: boolean,
  prestigeEffects: PrestigeEffects,
  prestige: () => boolean,
  buyPack: (pack: RealizedPrestigePack) => void,
  refundUpgrade: (upgrade: PrestigeUpgrade) => void,
  update: () => void,
  openMenu: () => void,
  closeMenu: () => void,
};

const defaultContext: PrestigeContext = {
  prestigePoints: global.startingPrestige,
  nextPoints: 0,
  currentRenownCost: 0,
  nextRenownCost: PRESTIGE_BASE_COST,
  upgrades: defaultUpgrades,
  packs: realizedPacks,
  isMenuOpen: false,
  isReseting: false,
  prestigeEffects: {
    bonuses: {
      foodCapacity: 1,
      startingGold: 0,
      cardPackCostReduction: 0,
    },
    extraStartCards: {},
    unlockedCardPacks: [],
  },
  prestige: () => false,
  buyPack: (pack) => {},
  refundUpgrade: (upgrade) => {},
  update: () => {},
  openMenu: () => {},
  closeMenu: () => {},
};

export const PrestigeContext = createContext(defaultContext);

export function PrestigeProvider(props: Record<string, any>) {
  const stats = useContext(StatsContext);
  const grid = useContext(GridContext);
  const cards = useContext(CardsContext);
  const cardPacks = useContext(CardPacksContext);

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

    cardPacks.prestigeReset();
    grid.prestigeReset();

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

    const newUpgrades = {...upgrades[pack.id]};
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
    setUpgrades({
      ...upgrades,
      [pack.id]: newUpgrades,
    });

    const newEffects = {...prestigeEffects};
    if (upgrade.extraStartingCards) {
      Object.entries(upgrade.extraStartingCards).forEach(([c, amount]) => {
        newEffects.extraStartCards[c] = (newEffects.extraStartCards[c] ?? 0) + amount;
      })
    }
    if (upgrade.unlockedCardPack) {
      newEffects.unlockedCardPacks.push(upgrade.unlockedCardPack);
    }
    if (upgrade.bonus) {
      newEffects.bonuses[upgrade.bonus.field] = (newEffects.bonuses[upgrade.bonus.field] ?? 0) + upgrade.bonus.amount;
    }
    setPrestigeEffects(newEffects);

    const newPrestigePacks = {...packs};
    newPrestigePacks[pack.id].numBought += 1;
    newPrestigePacks[pack.id].refund = pack.cost * PRESTIGE_REFUND_FACTOR;
    newPrestigePacks[pack.id].cost = getExponentialValue(pack.baseCost, pack.costGrowth, pack.numBought);
    newPrestigePacks[pack.id].remainingUpgrades = pack.remainingUpgrades;
    setPacks(newPrestigePacks);

    onUpgradesChanged(newEffects);
  }

  function refundUpgrade(upgrade: PrestigeUpgrade) {
    const pack = Object.values(packs)
      .find((pack) => 
        pack.upgrades.findIndex((u) => u.upgrade.id == upgrade.id) >= 0
      );
    if (!pack) return;

    const newUpgrades = {...upgrades[pack.id]};
    pack.remainingUpgrades.push(upgrade.id);

    let newUpgrade = newUpgrades[upgrade.id];
    if (!newUpgrade) {
      return;
    } else {
      newUpgrade.quantity -= 1;
    }

    if (newUpgrade.quantity > 0) {
      newUpgrades[upgrade.id] = newUpgrade;
    } else {
      delete newUpgrades[upgrade.id];
    }
    setUpgrades({...upgrades,
      [pack.id]: newUpgrades,
    });

    setPoints(prestigePoints + pack.refund);

    const newEffects = {...prestigeEffects};
    if (upgrade.extraStartingCards) {
      Object.entries(upgrade.extraStartingCards).forEach(([c, amount]) => {
        newEffects.extraStartCards[c] = (newEffects.extraStartCards[c] ?? 0) - amount;
      })
    }
    if (upgrade.unlockedCardPack) {
      const i = newEffects.unlockedCardPacks.indexOf(upgrade.unlockedCardPack);
      if (i >= 0) {
        newEffects.unlockedCardPacks.splice(i, 1);
      }
    }
    if (upgrade.bonus) {
      newEffects.bonuses[upgrade.bonus.field] = (newEffects.bonuses[upgrade.bonus.field] ?? 0) - upgrade.bonus.amount;
    }
    setPrestigeEffects(newEffects);

    const newPrestigePacks = {...packs};
    newPrestigePacks[pack.id].numBought -= 1;
    newPrestigePacks[pack.id].cost = getExponentialValue(pack.baseCost, pack.costGrowth, pack.numBought);
    newPrestigePacks[pack.id].refund = getExponentialValue(pack.baseCost, pack.costGrowth, pack.numBought - 1) * PRESTIGE_REFUND_FACTOR;
    newPrestigePacks[pack.id].remainingUpgrades = pack.remainingUpgrades;
    setPacks(newPrestigePacks);

    onUpgradesChanged(newEffects);
  }

  function update() {
    if (currentRenownCost + nextRenownCost <= stats.resources.Renown) {
      setNextPoints(nextPoints + 1);
      const newCost = getExponentialValue(PRESTIGE_BASE_COST, PRESTIGE_COST_GROWTH, nextPoints + 1);
      setNextRenownCost(newCost);
      setCurrentRenownCost(currentRenownCost + newCost);
    }
  }

  function onUpgradesChanged(newEffects: PrestigeEffects) {
    cardPacks.prestigeUpdate(newEffects);
  }

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => {
    if (isReseting) {
      cards.prestigeReset(prestigeEffects);
      stats.prestigeReset(prestigeEffects);
    }

    setIsMenuOpen(false);
    setIsReseting(false);
  };

  return (
    <PrestigeContext.Provider
      value={{
        prestigePoints, upgrades, packs, nextPoints, nextRenownCost, currentRenownCost, isMenuOpen, isReseting,
        prestigeEffects,
        prestige, buyPack, refundUpgrade, update, openMenu, closeMenu,
      }}
      {...props}
    />
  );
}
