import { CardsContext } from "../contexts/cards";
import { GridContext } from "../contexts/grid";
import { CardPack } from "../shared/types";

export function replaceSpaceWithCard(grid: GridContext, cards: CardsContext, x: number, y: number) {
  if (cards.selectedCard == null || !cards.hasCard(cards.selectedCard)) {
    return;
  }

  const quantity = cards.cards[cards.selectedCard.id]; 
  const oldCard = grid.replaceCard(x, y, {
    ...cards.selectedCard,
    durability: (quantity >= 1 ? 1 : quantity) * (cards.selectedCard.maxDurability ?? 0),
    modifiedStrength: 0,
  });
  cards.replaceCard(oldCard);
}

export function buyPack(grid: GridContext, cards: CardsContext, cardPack: CardPack) {
  if (grid.totalGold >= cardPack.cost) {
    grid.useGold(cardPack.cost);
    cards.openPack(cardPack);
  }
}