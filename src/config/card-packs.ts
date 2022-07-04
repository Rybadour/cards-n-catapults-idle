import { CardPack } from "../shared/types";
import cards from "./cards";

const cardPacks: Record<string, CardPack> = {
  dirt: {
    id: "",
    name: "Dirt",
    baseCost: 150,
    costGrowth: 1.08,
    quantity: 4,
    possibleCards: [{
      card: cards.campfire,
      chance: 0.05,
    }, {
      card: cards.ratDen,
      chance: 0.05,
    }, {
      card: cards.peasant,
      chance: 0.025,
    }, {
      card: cards.forest,
      chance: 0.1,
    }, {
      card: cards.beggar,
      chance: 0.10,
    }, {
      card: cards.ratSnack,
      chance: 0.325,
    }, {
      card: cards.berries,
      chance: 0.175,
    }, {
      card: cards.mushrooms,
      chance: 0.175,
    }],
  },
  stone: {
    id: "",
    name: "Stone Pack",
    baseCost: 1200,
    costGrowth: 1.1,
    quantity: 4,
    possibleCards: [{
      card: cards.forager,
      chance: 0.1,
    }, {
      card: cards.carpenter,
      chance: 0.075,
    }, {
      card: cards.pigPen,
      chance: 0.075,
    }, {
      card: cards.peasant,
      chance: 0.15,
    }, {
      card: cards.bread,
      chance: 0.25,
    }, {
      card: cards.haunch,
      chance: 0.35,
    }]
  }
}

Object.keys(cardPacks).forEach((id) => cardPacks[id].id = id);

export default cardPacks;