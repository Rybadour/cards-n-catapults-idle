/* eslint-disable @typescript-eslint/no-empty-function */
import { cloneDeep } from "lodash";
import { createContext, useContext, useState } from "react";
import cardPacks from "../config/card-packs";
import global from "../config/global";
import { debugLogPackChance, generateFromPack } from "../shared/pack-generation";
import { PrestigeEffects, RealizedCardPack, ResourceType } from "../shared/types";
import { getExponentialValue } from "../shared/utils";
import { CardsContext } from "./cards";
import { StatsContext } from "./stats";

const realizedCardPacks: Record<string, RealizedCardPack> = {};
Object.values(cardPacks).forEach(cardPack => {
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

export type CardPacksContext = {
  cardPacks: Record<string, RealizedCardPack>,
  prestigeEffects: PrestigeEffects,
  buyPack: (cardPack: RealizedCardPack) => void,
  prestigeReset: () => void,
  prestigeUpdate: (effects: PrestigeEffects) => void,
};

const defaultContext: CardPacksContext = {
  cardPacks: cloneDeep(realizedCardPacks),
  prestigeEffects: {} as PrestigeEffects,
  buyPack: (cardPack) => {},
  prestigeReset: () => {},
  prestigeUpdate: (effects) => {},
};

export const CardPacksContext = createContext(defaultContext);

export function CardPacksProvider(props: Record<string, any>) {
  const stats = useContext(StatsContext);
  const cards = useContext(CardsContext);
  const [cardPacks, setCardPacks] = useState(defaultContext.cardPacks);
  const [prestigeEffects, setPrestigeEffects] = useState(defaultContext.prestigeEffects);

  function buyPack(cardPack: RealizedCardPack) {
    if (stats.resources[ResourceType.Gold] < cardPack.cost) return;

    stats.useResource(ResourceType.Gold, cardPack.cost);

    const cardsFromPack = generateFromPack(cardPack);
    cards.drawCards(cardsFromPack);

    const newCardPacks = {...cardPacks};
    newCardPacks[cardPack.id].numBought += 1;
    newCardPacks[cardPack.id].cost = getPackCost(cardPack, prestigeEffects);
    setCardPacks(newCardPacks);
  }

  function prestigeReset() {
    setCardPacks(cloneDeep(realizedCardPacks));
  }

  function prestigeUpdate(effects: PrestigeEffects) {
    const newCardPacks = {...cardPacks};
    Object.values(newCardPacks).forEach(pack => {
      pack.cost = getPackCost(pack, effects);
    });
    setCardPacks(newCardPacks);

    setPrestigeEffects(effects);
  }

  return (
    <CardPacksContext.Provider
      value={{
        cardPacks, prestigeEffects,
        buyPack, prestigeReset, prestigeUpdate,
      }}
      {...props}
    />
  );
}

function getPackCost(pack: RealizedCardPack, effects: PrestigeEffects) {
  return getExponentialValue(pack.baseCost, pack.costGrowth, pack.numBought) * (1 - effects.bonuses.cardPackCostReduction)
}
