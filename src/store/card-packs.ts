import { createLens } from "@dhmk/zustand-lens";

import global from "../config/global";
import { Card, CardPack, MyCreateLens, MyCreateSlice, PrestigeEffects, RealizedCardPack, ResourceType } from "../shared/types";
import cardPacksConfig from "../config/card-packs";
import { debugLogPackChance, generateFromPack } from "../shared/pack-generation";
import { DiscoverySlice } from "./discovery";
import { cloneDeep } from "lodash";
import { getExponentialValue, getExpValueMultiple, getMultipleFromExpValue } from "../shared/utils";
import { FullStore } from ".";
import { CardsSlice } from "./cards";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { StatsSlice } from "./stats";

export interface CardPacksSlice {
  cardPacks: Record<string, RealizedCardPack>,
  prestigeEffects: PrestigeEffects,

  buyPack: (cardPack: RealizedCardPack) => void,
  buyMaxPack: (cardPack: RealizedCardPack) => void,
  prestigeReset: () => void,
  prestigeUpdate: (effects: PrestigeEffects) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
}

const realizedCardPacks: Record<string, RealizedCardPack> = {};
Object.values(cardPacksConfig).forEach(cardPack => {
  // In debug mode verify that packs have reasonable chances in them (should add up to 100%)
  if (global.isDebug) {
    debugLogPackChance('CardPack', cardPack);
  }

  realizedCardPacks[cardPack.id] = {
    ...cardPack,
    cost: cardPack.baseCost,
    numBought: 0,
  };
});

const createCardPacksSlice: MyCreateSlice<CardPacksSlice, [() => StatsSlice, () => CardsSlice]>
  = (set, get, stats, cards) => {
  return {
    cardPacks: cloneDeep(realizedCardPacks),
    prestigeEffects: cloneDeep(DEFAULT_EFFECTS),

    buyPack: (cardPack) => {
      if (stats().resources[ResourceType.Gold] < cardPack.cost) return;

      stats().useResource(ResourceType.Gold, cardPack.cost);

      const cardsFromPack = generateFromPack(cardPack);
      cards().drawCards(cardsFromPack);

      const newCardPacks = {...get().cardPacks};
      newCardPacks[cardPack.id].numBought += 1;
      newCardPacks[cardPack.id].cost = getPackCost(cardPack, DEFAULT_EFFECTS);
      set({cardPacks: newCardPacks});
    },

    buyMaxPack: (cardPack) => {
      const baseCost = getBaseCost(cardPack, get().prestigeEffects);
      const numMaxBuy = Math.floor(getMultipleFromExpValue(baseCost, cardPack.costGrowth, cardPack.numBought, stats().resources.Gold));
      if (numMaxBuy < 1) return;

      const maxBuyCost = Math.round(getExpValueMultiple(baseCost, cardPack.costGrowth, cardPack.numBought, numMaxBuy));

      stats().useResource(ResourceType.Gold, maxBuyCost);

      let cardsFromPacks: Card[] = [];
      for (let i = 0; i < numMaxBuy; ++i) {
        cardsFromPacks = cardsFromPacks.concat(generateFromPack(cardPack));
      }
      cards().drawCards(cardsFromPacks);

      const newCardPacks = {...get().cardPacks};
      newCardPacks[cardPack.id].numBought += numMaxBuy;
      newCardPacks[cardPack.id].cost = getPackCost(cardPack, get().prestigeEffects);
      set({cardPacks: newCardPacks});
    },

    prestigeReset: () => {},

    prestigeUpdate: (effects) => {},

    getSaveData: () => {},

    loadSaveData: (data: any) => {return false;},
  }
};

function getBaseCost(pack: CardPack, effects: PrestigeEffects) {
  return pack.baseCost * (1 - effects.bonuses.cardPackCostReduction);
}

function getPackCost(pack: RealizedCardPack, effects: PrestigeEffects) {
  return getExponentialValue(getBaseCost(pack, effects), pack.costGrowth, pack.numBought);
}

export default createCardPacksSlice;