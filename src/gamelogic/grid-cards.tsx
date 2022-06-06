import { CardsContext } from "../contexts/cards";
import { GridContext } from "../contexts/grid";

export function replaceSpaceWithCard(grid: GridContext, cards: CardsContext, x: number, y: number) {
  if (cards.selectedCard == null || !cards.hasCard(cards.selectedCard)) {
    return;
  }

  const oldCard = grid.replaceCard(x, y, cards.selectedCard);
  cards.replaceCard(oldCard);
}