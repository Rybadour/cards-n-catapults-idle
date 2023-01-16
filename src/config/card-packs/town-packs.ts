import { CardPack, GameFeature, ResourceType } from "../../shared/types";
import cards from "../cards/town-cards";

export default {
  dirt: {
    id: "",
    name: "Dirt Pack",
    feature: GameFeature.Economy,
    baseCost: {
      [ResourceType.Gold]: 150,
    },
    costGrowth: 1.08,
    quantity: 4,
    unlocked: true,
    possibleThings: [{
      thing: cards.pauline,
      chance: 0.003,
    }, {
      thing: cards.campfire,
      chance: 0.05,
    }, {
      thing: cards.ratDen,
      chance: 0.025,
      locked: true,
    }, {
      thing: cards.lumberjack,
      chance: 0.075,
    }, {
      thing: cards.forest,
      chance: 0.1,
    }, {
      thing: cards.beggar,
      chance: 0.1,
    }, {
      thing: cards.ratSnack,
      chance: 0.3,
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
    feature: GameFeature.Economy,
    baseCost: {
      [ResourceType.Gold]: 1200,
      [ResourceType.Wood]: 100,
    },
    costGrowth: 1.1,
    quantity: 4,
    unlocked: true,
    possibleThings: [{
      thing: cards.schoolHouse,
      chance: 0.003,
    }, {
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
    feature: GameFeature.Economy,
    baseCost: {
      [ResourceType.Gold]: 100,
    },
    costGrowth: 1.1,
    quantity: 4,
    unlocked: false,
    possibleThings: [{
      thing: cards.ambrosia,
      chance: 0.002,
    }, {
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
} as Record<string, CardPack>;