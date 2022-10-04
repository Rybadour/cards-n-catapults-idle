import { createLens } from "@dhmk/zustand-lens";

import global from "../config/global";
import { Card, CardPack, MyCreateLens, MyCreateSlice, PrestigeEffects, RealizedCardPack, ResourceType } from "../shared/types";
import cardPacksConfig from "../config/card-packs";
import { debugLogPackChance, generateFromPack } from "../shared/pack-generation";
import { DiscoverySlice } from "./discovery";
import { cloneDeep } from "lodash";
import { getExponentialValue } from "../shared/utils";
import { FullStore } from ".";
import { CardsSlice } from "./cards";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { StatsSlice } from "./stats";

export interface CardPacksSlice {
  cardPacks: Record<string, RealizedCardPack>,
  buyPack: (cardPack: RealizedCardPack) => void,
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
  }
};

function getBaseCost(pack: CardPack, effects: PrestigeEffects) {
  return pack.baseCost * (1 - effects.bonuses.cardPackCostReduction);
}

function getPackCost(pack: RealizedCardPack, effects: PrestigeEffects) {
  return getExponentialValue(getBaseCost(pack, effects), pack.costGrowth, pack.numBought);
}

export default createCardPacksSlice;