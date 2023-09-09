import { mapValues } from "lodash";
import upgrades, { PrestigeUpgrade, PrestigeUpgradeId } from "./prestige-upgrades";

const packs = {
  stoneAge: {
    name: "Stone Age Pack",
    baseCost: 10,
    costGrowth: 1.12,
    upgrades: [{
      upgrade: upgrades.hoboVillage,
      quantity: 3,
    }, {
      upgrade: upgrades.rationing,
      quantity: 10,
    }, {
      upgrade: upgrades.charity,
      quantity: 4,
    }, {
      upgrade: upgrades.market,
      quantity: 1,
    }, {
      upgrade: upgrades.taxes,
      quantity: 10,
    }],
  },
  bronzeAge: {
    name: "Bronze Age Pack",
    baseCost: 100,
    costGrowth: 1.12,
    upgrades: [{
      upgrade: upgrades.treasureMap,
      quantity: 1,
    }],
  },
} satisfies Record<string, Omit<PrestigePack, "id">>;

export type PrestigePackId = keyof typeof packs;

export const totalUpgrades: Record<string, number> = {};

const packsWithIds: Record<PrestigePackId, PrestigePack> = mapValues(packs, (pack, key) => {
  const id = key as PrestigePackId;
  packs[id].upgrades.forEach((up) => {
    totalUpgrades[up.upgrade.id] = (totalUpgrades[up.upgrade.id] ?? 0) + up.quantity;
  });

  return {
    ...pack,
    id,
  }
});

export default packsWithIds;

export type PrestigePack = {
  id: PrestigePackId,
  name: string,
  baseCost: number,
  costGrowth: number,
  upgrades: {
    upgrade: PrestigeUpgrade,
    quantity: number,
  }[]
};

export type RealizedPrestigePack = PrestigePack & {
  cost: number,
  refund: number,
  numBought: number,
  remainingUpgrades: PrestigeUpgradeId[],
};
