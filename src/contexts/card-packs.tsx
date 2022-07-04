/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import cardPacks from "../config/card-packs";
import global from "../config/global";
import { generateCards } from "../shared/pack-generation";
import { RealizedCardPack, ResourceType } from "../shared/types";
import { getExponentialValue } from "../shared/utils";
import { CardsContext } from "./cards";
import { StatsContext } from "./stats";

const realizedCardPacks: Record<string, RealizedCardPack> = {};
Object.values(cardPacks).forEach(cardPack => {
  // In debug mode verify that packs have reasonable chances in them (should add up to 100%)
  if (global.isDebug) {
    let totalChance = 0;
    cardPack.possibleCards.forEach(card => {
      totalChance += card.chance;
    });
    if (totalChance < 0.98 || 1.01 < totalChance) {
      console.error('WARNING: CardPack ' + cardPack.id + ' does not add up to 100% chance instead its ' + totalChance);
    }
  }

  realizedCardPacks[cardPack.id] = {
    ...cardPack,
    cost: cardPack.baseCost,
    amountBought: 0,
  };
});

export type CardPacksContext = {
  cardPacks: Record<string, RealizedCardPack>,
  buyPack: (cardPack: RealizedCardPack) => void,
};

const defaultContext: CardPacksContext = {
  cardPacks: realizedCardPacks,
  buyPack: (cardPack) => {},
};

export const CardPacksContext = createContext(defaultContext);

export function CardPacksProvider(props: Record<string, any>) {
  const stats = useContext(StatsContext);
  const cards = useContext(CardsContext);
  const [cardPacks, setCardPacks] = useState(defaultContext.cardPacks);

  function buyPack(cardPack: RealizedCardPack) {
    if (stats.resources[ResourceType.Gold] < cardPack.cost) return;

    stats.useResource(ResourceType.Gold, cardPack.cost);

    const cardsFromPack = generateCards(cardPack);
    cards.drawCards(cardsFromPack);

    const newCardPacks = {...cardPacks};
    newCardPacks[cardPack.id].amountBought += 1;
    newCardPacks[cardPack.id].cost = getExponentialValue(cardPack.baseCost, cardPack.costGrowth, cardPack.amountBought);
    setCardPacks(newCardPacks);
  }

  return (
    <CardPacksContext.Provider
      value={{
        cardPacks,
        buyPack,
      }}
      {...props}
    />
  );
}
