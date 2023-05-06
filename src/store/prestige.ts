import { cloneDeep, pick, shuffle } from "lodash";
import global from "../config/global";
import packsConfig from "../config/prestige-packs";
import upgradesConfig, { PRESTIGE_COST, PRESTIGE_REFUND_FACTOR } from "../config/prestige-upgrades";
import { PrestigeUpgrade, RealizedPrestigePack, RealizedPrestigeUpgrade } from "../shared/types";
import { getExponentialValue, getRandomFromArray, using } from "../shared/utils";
import { CardDefsSlice } from "./card-definitions";
import { CardsSlice } from "./cards";
import { DiscoverySlice } from "./discovery";
import { CardGridsSlice } from "./card-grids";
import { StatsSlice } from "./stats";
import { MyCreateSlice } from ".";

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

export type PrestigeSlice = {
  prestigePoints: number,
  nextPoints: number,
  nextRenownCost: number,
  upgrades: Record<string, Record<string, RealizedPrestigeUpgrade>>,
  packs: Record<string, RealizedPrestigePack>,
  isMenuOpen: boolean,
  isReseting: boolean,
  shouldAutoSacrificeAll: boolean,
  isPromptOpen: boolean,
  openPrompt: () => void,
  closePrompt: () => void,
  toggleShouldAutoSacrifice: () => void,
  prestige: () => boolean,
  prestigeAndSacrificeAll: () => boolean,
  buyPack: (pack: RealizedPrestigePack) => void,
  refundUpgrade: (upgrade: PrestigeUpgrade) => void,
  update: () => void,
  openMenu: () => void,
  closeMenu: () => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
  completeReset: () => void,
};

const createPrestigeSlice: MyCreateSlice<PrestigeSlice, [
  () => StatsSlice, () => DiscoverySlice, () => CardDefsSlice, () => CardsSlice, () => CardGridsSlice
]> = (set, get, stats, discovery, cardDefs, cards, cardGrids) => {
  function onUpgradesChanged() {
    // TODO?
    //cardDefs().prestigeUpdate(newEffects);
    //discovery().prestigeUpdate(newEffects);
  }

  function onReset(upgrades: PrestigeUpgrade[]) {
    /* *
    TODO
    const newEffects = cloneDeep(effects);
    Object.values(get().upgrades).forEach(upgradesInPack => {
      Object.values(upgradesInPack).forEach(upgrade => {
        using(upgrade.randomStartingCards, (rsc) => {
          for (let i = 0; i < rsc.amount; ++i) {
            let possibleCards = rsc.possibleCards;

            if (rsc.onlyIfDiscovered) {
              possibleCards = possibleCards.filter(c => discovery().discoveredCards[c]);
            }

            if (possibleCards.length > 0) {
              const card = getRandomFromArray(possibleCards);
              newEffects.extraStartCards[card] = (newEffects.extraStartCards[card] ?? 0) + 1;
            }
          }
        });
      });
    });
    /* */
    
    cards().prestigeReset(upgrades);
    stats().prestigeReset(upgrades);
  }

  function prestige() {
    cardGrids().prestigeReset();

    set({
      prestigePoints: get().prestigePoints + get().nextPoints,
      nextPoints: 0,
      nextRenownCost: PRESTIGE_COST.base,
      isMenuOpen: true,
      isReseting: true,
      isPromptOpen: false,
    });
    return true;
  }

  return {
    prestigePoints: global.startingPrestige,
    nextPoints: 0,
    nextRenownCost: PRESTIGE_COST.base,
    upgrades: cloneDeep(defaultUpgrades),
    packs: cloneDeep(realizedPacks),
    isMenuOpen: false,
    isReseting: false,
    shouldAutoSacrificeAll: false,
    isPromptOpen: false,

    openPrompt: () => set({isPromptOpen: true}),
    closePrompt: () => set({isPromptOpen: false}),
    toggleShouldAutoSacrifice: () => set({shouldAutoSacrificeAll: !get().shouldAutoSacrificeAll}),

    prestige: () => {
      if (get().nextPoints <= 0) {
        return false;
      }

      prestige();
      return true;
    },

    prestigeAndSacrificeAll: () => {
      if (get().nextPoints <= 0) {
        return false;
      }

      cardGrids().clearAllGrids();

      prestige();
      return true;
    },

    buyPack: (pack) => {
      if (get().prestigePoints < pack.cost) return;

      const newUpgrades = {...get().upgrades[pack.id]};
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

      // TODO
      //const newEffects = {...get().prestigeEffects};
      //applyUpgrade(newEffects, upgrade, 1);

      const oldPackCost = pack.cost;
      const newPacks = {...get().packs};
      newPacks[pack.id].numBought += 1;
      newPacks[pack.id].refund = Math.round(pack.cost * PRESTIGE_REFUND_FACTOR);
      newPacks[pack.id].cost = Math.round(getExponentialValue(pack.baseCost, pack.costGrowth, pack.numBought));
      newPacks[pack.id].remainingUpgrades = pack.remainingUpgrades;

      set({
        prestigePoints: get().prestigePoints - oldPackCost,
        upgrades: {
          ...get().upgrades,
          [pack.id]: newUpgrades,
        },
        packs: newPacks,
      });


      // TODO
      //onUpgradesChanged(newEffects);
    },

    refundUpgrade: (upgrade) => {
      const pack = Object.values(get().packs)
        .find((pack) => 
          pack.upgrades.findIndex((u) => u.upgrade.id == upgrade.id) >= 0
        );
      if (!pack) return;

      const newUpgrades = {...get().upgrades[pack.id]};
      pack.remainingUpgrades.push(upgrade.id);

      const newUpgrade = newUpgrades[upgrade.id];
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


      /* *
      // TODO
      const newEffects = {...get().prestigeEffects};
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
      /* */

      const oldPackRefund = pack.refund;
      const newPacks = {...get().packs};
      newPacks[pack.id].numBought -= 1;
      newPacks[pack.id].cost = Math.round(getExponentialValue(pack.baseCost, pack.costGrowth, pack.numBought));
      newPacks[pack.id].refund = Math.round(getExponentialValue(pack.baseCost, pack.costGrowth, pack.numBought - 1) * PRESTIGE_REFUND_FACTOR);
      newPacks[pack.id].remainingUpgrades = pack.remainingUpgrades;

      set({
        upgrades: {
          ...get().upgrades,
          [pack.id]: newUpgrades,
        },
        prestigePoints: get().prestigePoints + oldPackRefund,
        packs: newPacks,
      });

      // TODO
      //onUpgradesChanged(newEffects);
    },

    update: () => {
      const newPoints = Math.round(getPrestigePointsFromRenown(stats().resources.Renown));
      if (newPoints >= get().nextPoints) {
        set({
          nextPoints: newPoints,
          nextRenownCost: getRenownFromPrestigePoints(newPoints + 1),
        });
      }
    },

    openMenu: () => set({isMenuOpen: true}),

    closeMenu: () => {
      if (get().isReseting) {
        // TODO
        //onReset(get().prestigeEffects);
      }

      set({isMenuOpen: false, isReseting: false});
    },

    getSaveData: () => {
      const upgradesToSave: Record<string, number> = {};
      Object.values(get().upgrades).forEach(upgradesMap => {
        Object.values(upgradesMap).forEach(upgrade => {
          upgradesToSave[upgrade.id] = upgrade.quantity;
        });
      });

      return {
        ...pick(get(), ['prestigePoints', 'isReseting', 'shouldAutoSacrificeAll']),
        upgrades: upgradesToSave,
      };
    },

    loadSaveData: (data) => {
      if (typeof data !== 'object') return false;

      const upgrades: Record<string, Record<string, RealizedPrestigeUpgrade>> = {};
      const newPacks = cloneDeep(realizedPacks);
      Object.values(newPacks).forEach(pack => {
        pack.remainingUpgrades = [];
        upgrades[pack.id] = {};
        pack.upgrades.forEach(({upgrade, quantity}) => {
          const savedQuantity = data.upgrades[upgrade.id] || 0;
          if (savedQuantity > 0) {
            upgrades[pack.id][upgrade.id] = {
              ...upgradesConfig[upgrade.id],
              quantity: savedQuantity,
            };
          }
          for (let i = 0; i < quantity - savedQuantity; ++i) {
            pack.remainingUpgrades.push(upgrade.id);
          }
          pack.numBought += savedQuantity;
        });
        pack.cost = Math.round(getExponentialValue(pack.baseCost, pack.costGrowth, pack.numBought));
        pack.refund = Math.round(getExponentialValue(pack.baseCost, pack.costGrowth, pack.numBought - 1) * PRESTIGE_REFUND_FACTOR);
      });

      /* *
      const newEffects: PrestigeEffects = cloneDeep(DEFAULT_EFFECTS);
      Object.entries(data.upgrades as Record<string, number>)
        .forEach(([up, quantity]) => applyUpgrade(newEffects, upgradesConfig[up], quantity));
      /* */

      set({
        isReseting: false,
        shouldAutoSacrificeAll: data.shouldAutoSacrificeAll,
        prestigePoints: data.prestigePoints,
        nextPoints: 0,
        nextRenownCost: getRenownFromPrestigePoints(1),
        packs: newPacks,
        upgrades: upgrades,
      });

      // TODO
      //onUpgradesChanged(upgrades);

      if (data.isReseting) {
        // TODO
        //onReset(upgrades);
      }

      return true;
    },

    completeReset: () => {
      set({
        isReseting: false,
        shouldAutoSacrificeAll: false,
        prestigePoints: 0,
        nextPoints: 0,
        nextRenownCost: getRenownFromPrestigePoints(1),
        packs: cloneDeep(realizedPacks),
        upgrades: cloneDeep(defaultUpgrades),
      });
    },
  }
};

function getPrestigePointsFromRenown(renown: number) {
  const {base, growthFactor, growthExp} = PRESTIGE_COST;
  return Math.floor(Math.pow((renown-base)*growthFactor, 1/growthExp));
}

function getRenownFromPrestigePoints(pp: number) {
  const {base, growthFactor, growthExp} = PRESTIGE_COST;
  return Math.floor(Math.pow(pp, growthExp)/growthFactor + base);
}

/* *
TODO
function applyUpgrade(effects: PrestigeEffects, upgrade: PrestigeUpgrade, quantity: number) {
  if (upgrade.extraStartingCards) {
    Object.entries(upgrade.extraStartingCards).forEach(([c, amount]) => {
      effects.extraStartCards[c] = (effects.extraStartCards[c] ?? 0) + amount * quantity;
    })
  }
  if (upgrade.unlockedCardPack) {
    effects.unlockedCardPacks.push(upgrade.unlockedCardPack);
  }
  if (upgrade.bonus) {
    effects.bonuses[upgrade.bonus.field] = (effects.bonuses[upgrade.bonus.field] ?? 0) + upgrade.bonus.amount * quantity;
  }
}
/* */

export default createPrestigeSlice;