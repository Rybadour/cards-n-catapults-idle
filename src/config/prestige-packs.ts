import { PrestigePack } from "../shared/types";
import upgrades from "./prestige";

const packs: Record<string, PrestigePack> = {
  dirt: {
    id: "",
    name: "Dirt Pack",
    baseCost: 10,
    costGrowth: 1.12,
    quantity: 2,
    possibleThings: [{
      thing: upgrades.ratz,
      chance: 0.05,
    }],
  },
}

Object.keys(packs).forEach((id) => packs[id].id = id);

export default packs;