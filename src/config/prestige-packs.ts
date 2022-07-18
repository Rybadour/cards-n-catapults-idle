import { PrestigePack } from "../shared/types";
import upgrades from "./prestige-upgrades";

const packs: Record<string, PrestigePack> = {
  stoneAge: {
    id: "",
    name: "Stone Age Pack",
    baseCost: 10,
    costGrowth: 1.12,
    upgrades: [{
      upgrade: upgrades.ratz,
      quantity: 1,
    }, {
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
    }],
  },
}

export const totalUpgrades: Record<string, number> = {};
Object.keys(packs).forEach((id) => {
  packs[id].id = id;
  packs[id].upgrades.forEach((up) => {
    totalUpgrades[up.upgrade.id] = (totalUpgrades[up.upgrade.id] ?? 0) + up.quantity;
  });
});

export default packs;