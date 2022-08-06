/* eslint-disable @typescript-eslint/no-empty-function */
import { cloneDeep } from "lodash";
import { createContext, useContext, useState } from "react";
import cardPacksConfig from "../config/card-packs";
import global from "../config/global";
import { DEFAULT_EFFECTS } from "../shared/constants";
import { debugLogPackChance, generateFromPack } from "../shared/pack-generation";
import { PrestigeEffects, RealizedCardPack, ResourceType } from "../shared/types";
import { getExponentialValue } from "../shared/utils";
import { CardsContext } from "./cards";
import { StatsContext } from "./stats";

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

export type CardPacksContext = {
  cardPacks: Record<string, RealizedCardPack>,
  prestigeEffects: PrestigeEffects,
  buyPack: (cardPack: RealizedCardPack) => void,
  buyMaxPack: (cardPack: RealizedCardPack) => void,
  prestigeReset: () => void,
  prestigeUpdate: (effects: PrestigeEffects) => void,
  getSaveData: () => any,
  loadSaveData: (data: any) => boolean,
};

const defaultContext: CardPacksContext = {
  cardPacks: cloneDeep(realizedCardPacks),
  prestigeEffects: cloneDeep(DEFAULT_EFFECTS),
  buyPack: (cardPack) => {},
  buyMaxPack: (cardPack) => {},
  prestigeReset: () => {},
  prestigeUpdate: (effects) => {},
  getSaveData: () => ({}),
  loadSaveData: (data) => false,
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

  function buyMaxPack(cardPack: RealizedCardPack) {
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

  function getSaveData() {
    const packsToSave: Record<string, number> = {};
    Object.entries(cardPacks).forEach(([id, pack]) => {
      packsToSave[id] = pack.numBought;
    });
    return packsToSave;
  }

  function loadSaveData(data: any) {
    if (typeof data !== 'object') return false;

    const newPacks: Record<string, RealizedCardPack> = {};
    Object.entries(data as Record<string, number>).forEach(([id, numBought]) => {
      newPacks[id] = {
        ...cardPacksConfig[id],
        cost: 0,
        numBought,
      };
      newPacks[id].cost = getPackCost(newPacks[id], prestigeEffects);
    });
    setCardPacks(newPacks);

    return true;
  }

  return (
    <CardPacksContext.Provider
      value={{
        cardPacks, prestigeEffects,
        buyPack, buyMaxPack, prestigeReset, prestigeUpdate, getSaveData, loadSaveData,
      }}
      {...props}
    />
  );
}

function getPackCost(pack: RealizedCardPack, effects: PrestigeEffects) {
  return getExponentialValue(pack.baseCost, pack.costGrowth, pack.numBought) * (1 - effects.bonuses.cardPackCostReduction)
}
