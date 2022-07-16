import { CardPack } from "../shared/types";
import cards from "./cards";

const cardPacks: Record<string, CardPack> = {
  dirt: {
    id: "",
    name: "Dirt Pack",
    baseCost: 150,
    costGrowth: 1.08,
    quantity: 4,
    unlocked: true,
    possibleThings: [{
      thing: cards.campfire,
      chance: 0.05,
    }, {
      thing: cards.ratDen,
      chance: 0.05,
    }, {
      thing: cards.peasant,
      chance: 0.025,
    }, {
      thing: cards.forest,
      chance: 0.1,
    }, {
      thing: cards.beggar,
      chance: 0.10,
    }, {
      thing: cards.ratSnack,
      chance: 0.325,
    }, {
      thing: cards.berries,
      chance: 0.175,
    }, {
      thing: cards.mushrooms,
      chance: 0.175,
    }],
  },
  stone: {
    id: "",
    name: "Stone Pack",
    baseCost: 1200,
    costGrowth: 1.1,
    quantity: 4,
    unlocked: true,
    possibleThings: [{
      thing: cards.bard,
      chance: 0.075,
    }, {
      thing: cards.forager,
      chance: 0.075,
    }, {
      thing: cards.carpenter,
      chance: 0.05,
    }, {
      thing: cards.lumbermill,
      chance: 0.05,
    }, {
      thing: cards.pigPen,
      chance: 0.05,
    }, {
      thing: cards.peasant,
      chance: 0.1,
    }, {
      thing: cards.bread,
      chance: 0.25,
    }, {
      thing: cards.haunch,
      chance: 0.35,
    }]
  },
  food: {
    id: "",
    name: "Food Pack",
    baseCost: 100,
    costGrowth: 1.1,
    quantity: 4,
    unlocked: false,
    possibleThings: [{
      thing: cards.bread,
      chance: 0.1,
    }, {
      thing: cards.haunch,
      chance: 0.1,
    }, {
      thing: cards.mushrooms,
      chance: 0.2,
    }, {
      thing: cards.ratSnack,
      chance: 0.3,
    }, {
      thing: cards.berries,
      chance: 0.3,
    }]
  },
}

Object.keys(cardPacks).forEach((id) => cardPacks[id].id = id);

export default cardPacks;