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

Object.keys(packs).forEach((id) => packs[id].id = id);

export default packs;